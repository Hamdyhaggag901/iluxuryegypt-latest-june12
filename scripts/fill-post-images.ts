// Fetches the featured image and the in-body figures for the blog posts, and
// writes the alt text for each one after the photo is chosen.
//
// Run this AFTER the content-updates/blog-*.sql files, because it edits the
// body_en those files insert.
//
// Rules, all of which exist because of a real failure:
//
//   Unsplash, then Pixabay, then Pexels, then Wikimedia Commons as a last
//   resort. Commons is free and correctly licensed and keeps returning
//   nineteenth century engravings, so it goes last rather than not at all.
//
//   Every candidate is checked against the PROVIDER'S OWN DESCRIPTION, never
//   against the query that found it, because a query is not evidence about the
//   photograph it returned.
//
//   If nothing can be confirmed, THE POSITION IS LEFT AS IT IS. On a first fill
//   that means no image and a report; under --replace it means the existing
//   image stays. A post illustrated with a picture of somewhere else is worse
//   than one with no picture at all, and an empty position is worse than an
//   imperfect one that a person already accepted.
//
//   Alt text is composed from that description AFTER the pick, never before,
//   and every content word has to trace back to the description or the place
//   name. The focus keyword appears in exactly one image per post.
//
//   One post, one transaction. A failure costs that post and nothing else.
//
// ---------------------------------------------------------------------------
// Running it
// ---------------------------------------------------------------------------
//   npx tsx scripts/fill-post-images.ts --plan             # no network, no writes
//   npx tsx scripts/fill-post-images.ts --dry-run          # full run, then roll back
//   npx tsx scripts/fill-post-images.ts                    # fill empty positions
//   npx tsx scripts/fill-post-images.ts --replace --only=x # re-shoot a post
//
// Flags:
//   --only=<slug>          restrict to one post (repeatable)
//   --replace              re-source positions that already have an image
//   --refill               same as --replace, kept for the older muscle memory
//   --provider-order=a,b   override the source priority for this run
//   --plan                 no network, no writes
//   --dry-run              full run including downloads, then roll back
//
// Needs DATABASE_URL and at least one provider key. See scripts/lib/script-env.ts
// for which .env files are read: this project has two, and that is exactly why
// UNSPLASH_ACCESS_KEY appeared to be missing when it was not.

import { ENV_REPORT, printEnvReport } from "./lib/script-env";
import fs from "fs/promises";
import { pool } from "../server/db";
import {
  KEYS, ALL_PROVIDERS, DEFAULT_SOURCE_ORDER,
  type Source, type Candidate, auditVocabulary, auditPlaceGuards, composeAlt, findInventedWords,
  findConfirmed, downloadAndOptimise, creditLine, isProvider,
  resolveSourceOrder, retiredProviders, requestsUsed,
} from "./lib/provider-images";
import {
  POSTS, figureExistsAfterH2, insertFigureAfterH2, figureAtAfterH2,
  type PostSpec, type ImageSpec,
} from "./lib/post-image-specs";
import { isPinnedUrl, isPinnedFigure, pinnedImagesLost } from "./lib/pinned-images";
import {
  decideAction, outcomeFor, replaceFigureAfterH2, figureHtmlFor, existingAlt,
  composeAltForPosition,
} from "./lib/image-placement";
import { searchCommonsUsable } from "./lib/wikimedia-commons";

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
const argv = process.argv.slice(2);
const PLAN_ONLY = argv.includes("--plan");
const DRY_RUN = argv.includes("--dry-run");
// A plain run fills only what is empty. --replace re-sources positions that
// already hold an image, and never empties one to do it.
const REPLACE = argv.includes("--replace") || argv.includes("--refill");
const ONLY = argv.filter((a) => a.startsWith("--only=")).map((a) => a.slice("--only=".length));
const ORDER_FLAG = argv.filter((a) => a.startsWith("--provider-order=")).map((a) => a.slice("--provider-order=".length))[0];

interface TxClient {
  query(text: string, values?: unknown[]): Promise<{ rows: any[] }>;
  release(): void;
}
const connectable = pool as unknown as { connect(): Promise<TxClient> };

type Outcome = "set" | "replaced" | "kept" | "pinned" | "skipped";

interface ResultRow {
  slug: string;
  role: string;
  position: string;
  place: string;
  outcome: Outcome;
  url: string;
  provider: string;
  width: string;
  query: string;
  description: string;
  alt: string;
  tier: string;
  detail: string;
  rejections?: string[];
}

const results: ResultRow[] = [];
const notes: string[] = [];
/** Files written for the post currently being processed, cleaned up on failure. */
let writtenForPost: string[] = [];

/** Wikimedia plugged in as the last source, without this file owning its rules. */
const sourceSearch = async (source: Source, query: string): Promise<Candidate[]> =>
  source === "wikimedia" ? searchCommonsUsable(query) : [];

// ---------------------------------------------------------------------------
// One post, one transaction
// ---------------------------------------------------------------------------
interface PostOutcome { committed: boolean; stop: boolean }

async function processPost(
  post: PostSpec, uploader: string | null, usedIds: Set<string>, order: Source[]
): Promise<PostOutcome> {
  const client = await connectable.connect();
  writtenForPost = [];
  let committed = false;
  let stop = false;

  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      `SELECT id, body_en, featured_image, featured_image_alt FROM posts WHERE slug = $1`,
      [post.slug]
    );
    if (!rows[0]) {
      notes.push(`${post.slug}: post not found. Run its SQL file first.`);
      await client.query("ROLLBACK");
      return { committed: false, stop: false };
    }

    const bodyAsLoaded: string = rows[0].body_en ?? "";
    let body: string = bodyAsLoaded;
    const featuredAsLoaded: string | null = rows[0].featured_image ?? null;
    let featured: string | null = featuredAsLoaded;
    let featuredAlt: string | null = rows[0].featured_image_alt ?? null;

    const h2Count = (body.match(/<h2>/g) || []).length;
    const altsUsed = new Set<string>();
    let keywordSpent = false;

    // A pinned image can never be replaced, so whether it carries the keyword is
    // decided before anything else and the rest of the post works around it.
    for (const spec of post.images) {
      const html = spec.role === "featured"
        ? (featured && isPinnedUrl(featured) ? `<img src="${featured}" alt="${featuredAlt ?? ""}">` : "")
        : (figureAtAfterH2(body, spec.afterH2!)?.html ?? "");
      if (!html) continue;
      const pinned = spec.role === "featured" ? isPinnedUrl(featured) : isPinnedFigure(html);
      if (!pinned) continue;
      const alt = spec.role === "featured" ? (featuredAlt ?? "") : existingAlt(html);
      if (alt.toLowerCase().includes(post.focusKeyword.toLowerCase())) keywordSpent = true;
    }

    // Featured first, then body figures from the LAST position backwards, so an
    // insertion never shifts the index of one not yet done. The hero goes first
    // because an article without one is worse off than one missing a figure.
    const ordered = [...post.images].sort((a, b) => {
      if (a.role !== b.role) return a.role === "featured" ? -1 : 1;
      return (b.afterH2 ?? 0) - (a.afterH2 ?? 0);
    });

    for (const spec of ordered) {
      const position = spec.role === "featured" ? "hero" : `after H2 #${spec.afterH2}`;
      const base: ResultRow = {
        slug: post.slug, role: spec.role, position, place: spec.place,
        outcome: "skipped", url: "", provider: "", width: "", query: "",
        description: "", alt: "", tier: "-", detail: "",
      };

      if (spec.role === "body" && (spec.afterH2! < 1 || spec.afterH2! >= h2Count)) {
        results.push({ ...base, detail: `afterH2 ${spec.afterH2} out of range, the post has ${h2Count} H2 headings` });
        notes.push(`${post.slug} ${position}: spec index is stale, fix post-image-specs.ts.`);
        continue;
      }

      const current = spec.role === "featured"
        ? (featured && featured.trim() ? { html: "", url: featured } : null)
        : (() => { const f = figureAtAfterH2(body, spec.afterH2!); return f ? { html: f.html, url: "" } : null; })();
      const filled = spec.role === "featured" ? Boolean(current) : figureExistsAfterH2(body, spec.afterH2!);
      const pinned = filled && (spec.role === "featured" ? isPinnedUrl(featured) : isPinnedFigure(current!.html));
      const currentAlt = () => (spec.role === "featured" ? (featuredAlt ?? "") : existingAlt(current?.html ?? ""));
      const action = decideAction({ filled, pinned, replaceMode: REPLACE });

      if (action === "pinned" || action === "keep") {
        const alt = currentAlt();
        results.push({
          ...base, outcome: outcomeFor(action, false), alt,
          detail: action === "pinned" ? "placed by hand, never replaced" : "already filled, left alone",
        });
        altsUsed.add(alt.toLowerCase());
        if (alt.toLowerCase().includes(post.focusKeyword.toLowerCase())) keywordSpent = true;
        continue;
      }

      if (PLAN_ONLY) {
        results.push({
          ...base,
          outcome: filled ? "kept" : "skipped",
          detail: `${filled ? "would try to replace" : "would try to fill"}: ${spec.queries.join(" | ")}`,
        });
        continue;
      }

      const keepOld = (detail: string, rejections?: string[]) => {
        if (filled) {
          const alt = currentAlt();
          results.push({ ...base, outcome: outcomeFor(action, false), alt, detail: `${detail}, existing image kept`, rejections });
          altsUsed.add(alt.toLowerCase());
          if (alt.toLowerCase().includes(post.focusKeyword.toLowerCase())) keywordSpent = true;
        } else {
          results.push({ ...base, outcome: "skipped", detail: `${detail}, position left empty`, rejections });
        }
      };

      const found = await findConfirmed(spec.queries, spec.guard, usedIds, { order, search: sourceSearch });
      if (!("candidate" in found)) {
        keepOld(`nothing confirmed out of ${found.tried} candidate(s)`, found.rejections);
        console.warn(`  ! ${post.slug} ${position} (${spec.place}): nothing confirmed.`);
        continue;
      }

      const description = found.candidate.description;
      const composed = composeAltForPosition(post, spec, description, keywordSpent);
      if ("refused" in composed) {
        keepOld(composed.refused);
        console.warn(`  ! ${post.slug} ${position}: ${composed.refused}.`);
        continue;
      }

      if (altsUsed.has(composed.alt.toLowerCase())) {
        notes.push(
          `${post.slug} ${position}: alt duplicates another image on this post ("${composed.alt}"). ` +
            `The image is still set; reword one of them by hand.`
        );
      }

      const saved = await downloadAndOptimise(found.candidate, writtenForPost);
      await client.query(
        `INSERT INTO media (filename, original_name, mime_type, size, url, alt_en, caption, uploaded_by)
         VALUES ($1, $2, 'image/webp', $3, $4, $5, $6, $7)`,
        [
          saved.filename,
          `${found.candidate.provider}-${spec.place.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
          saved.size, saved.url, composed.alt, creditLine(found.candidate), uploader,
        ]
      );

      if (spec.role === "featured") {
        featured = saved.url;
        featuredAlt = composed.alt;
      } else {
        // Remove and insert in one operation, so the position is never empty,
        // not even for the length of a string concatenation.
        body = replaceFigureAfterH2(body, spec.afterH2!, figureHtmlFor(saved.url, composed.alt));
      }

      altsUsed.add(composed.alt.toLowerCase());
      if (composed.carriesKeyword) keywordSpent = true;
      results.push({
        ...base, outcome: outcomeFor(filled ? "replace" : "fill", true), url: saved.url,
        provider: found.candidate.provider, width: found.candidate.width ? `${found.candidate.width}px` : "",
        query: found.query, description, alt: composed.alt, tier: composed.tier,
        detail: found.query === spec.queries[0] ? "" : "fallback query",
      });
    }

    // Independent of every position check above, because it compares the body
    // that came out of the database with the one about to go back in. A stale
    // H2 index in the spec cannot get past this.
    const lost = pinnedImagesLost(bodyAsLoaded, body);
    if (lost.length > 0) {
      throw new Error(
        `${post.slug}: this would remove ${lost.length} hand placed image(s): ${lost.join(", ")}. ` +
          `Nothing was written for this post.`
      );
    }
    if (featuredAsLoaded && isPinnedUrl(featuredAsLoaded) && featured !== featuredAsLoaded) {
      throw new Error(`${post.slug}: this would replace the hand placed hero image. Nothing was written for this post.`);
    }

    // Enforced by construction above; verified here so a bug in that reasoning
    // costs one post rather than being written to every post in the run.
    const finalAlts = [
      ...(featuredAlt ? [featuredAlt] : []),
      ...[...body.matchAll(/<figure><img[^>]*\balt="([^"]*)"/gi)].map((m) => m[1]),
    ];
    const keywordHits = finalAlts.filter((a) => a.toLowerCase().includes(post.focusKeyword.toLowerCase())).length;
    if (keywordHits > 1) {
      throw new Error(
        `${post.slug}: the focus keyword would appear in ${keywordHits} image alts and the rule is one. ` +
          `Nothing was written for this post.`
      );
    }

    const wrote = results.some((r) => r.slug === post.slug && (r.outcome === "set" || r.outcome === "replaced"));
    if (wrote) {
      await client.query(
        `UPDATE posts SET featured_image = $1, featured_image_alt = $2, body_en = $3, updated_at = now() WHERE id = $4`,
        [featured, featuredAlt, body, rows[0].id]
      );
    }

    if (PLAN_ONLY || DRY_RUN) {
      await client.query("ROLLBACK");
      for (const f of writtenForPost) await fs.unlink(f).catch(() => {});
    } else {
      await client.query("COMMIT");
      committed = true;
      if (wrote) console.log(`  committed ${post.slug}`);
    }
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    for (const f of writtenForPost) await fs.unlink(f).catch(() => {});
    const message = error instanceof Error ? error.message : String(error);
    notes.push(`${post.slug}: rolled back, nothing changed for this post. ${message}`);
    console.error(`  ! ${post.slug}: ${message}`);
    console.error(`    This post is unchanged. Other posts are unaffected.`);
  } finally {
    client.release();
  }

  // Every provider gone means nothing further can be resolved this run.
  if (retiredProviders().length >= ALL_PROVIDERS.filter((p) => KEYS[p]).length && ALL_PROVIDERS.some((p) => KEYS[p])) {
    stop = true;
  }
  return { committed, stop };
}

// ---------------------------------------------------------------------------
function printReport(): void {
  const w = (n: number) => (s: string) => (s.length > n ? s.slice(0, n - 1) + "…" : s).padEnd(n);
  const cols: Array<[number, string]> = [
    [28, "POST"], [14, "POSITION"], [20, "PLACE"], [9, "OUTCOME"], [10, "PROVIDER"], [8, "WIDTH"],
  ];
  console.log("\n" + cols.map(([n, h]) => w(n)(h)).join("  "));
  console.log(cols.map(([n]) => "-".repeat(n)).join("  "));
  for (const r of results) {
    console.log([w(28)(r.slug), w(14)(r.position), w(20)(r.place), w(9)(r.outcome), w(10)(r.provider), w(8)(r.width)].join("  "));
  }

  console.log("\nAlt text written this run:");
  for (const r of results) {
    if (r.outcome !== "set" && r.outcome !== "replaced") continue;
    console.log(`  ${r.slug} ${r.position}\n    ${r.alt}\n    from: "${r.description.slice(0, 110)}"`);
  }

  const kept = results.filter((r) => r.outcome === "kept");
  const pinned = results.filter((r) => r.outcome === "pinned");
  const skipped = results.filter((r) => r.outcome === "skipped");

  if (pinned.length > 0) {
    console.log(`\n${pinned.length} image(s) are pinned and were not touched:`);
    for (const r of pinned) console.log(`  ${r.slug} ${r.position}`);
  }
  if (kept.length > 0) {
    console.log(`\n${kept.length} position(s) kept the image already there:`);
    for (const r of kept) {
      console.log(`  ${r.slug} ${r.position} (${r.place}) ${r.detail}`);
      for (const rej of (r.rejections ?? []).slice(0, 4)) console.log(`      ${rej}`);
    }
  }
  if (skipped.length > 0) {
    console.log(`\n${skipped.length} position(s) are still empty:`);
    for (const r of skipped) {
      console.log(`  ${r.slug} ${r.position} (${r.place}) ${r.detail}`);
      for (const rej of (r.rejections ?? []).slice(0, 4)) console.log(`      ${rej}`);
    }
  }
}

async function run(): Promise<void> {
  const vocabProblems = auditVocabulary();
  if (vocabProblems.length > 0) {
    console.error("VOCABULARY GUARD FAILED:\n  " + vocabProblems.join("\n  "));
    process.exit(1);
  }

  // A guard whose requirePlace names no place cannot reject anything, and a run
  // that starts with one will happily illustrate an article with the wrong
  // country. Checked before the first network call, for every spec, not just
  // the ones this run touches.
  const guardProblems = auditPlaceGuards(
    POSTS.flatMap((post) =>
      post.images.map((img) => ({
        slug: post.slug,
        position: img.role === "featured" ? "hero" : `after H2 #${img.afterH2}`,
        place: img.place,
        city: img.city,
        guard: img.guard,
      }))
    )
  );
  if (guardProblems.length > 0) {
    console.error("PLACE GUARD AUDIT FAILED:\n  " + guardProblems.join("\n  "));
    process.exit(1);
  }

  const specs = ONLY.length > 0 ? POSTS.filter((p) => ONLY.includes(p.slug)) : POSTS;
  if (specs.length === 0) {
    console.error(`No post matched --only=. Known slugs:\n  ${POSTS.map((p) => p.slug).join("\n  ")}`);
    process.exit(1);
  }

  const { order, error } = resolveSourceOrder(ORDER_FLAG);
  if (error) { console.error(error); process.exit(1); }

  printEnvReport(ENV_REPORT, {
    DATABASE_URL: process.env.DATABASE_URL ? "set" : "",
    UNSPLASH_ACCESS_KEY: KEYS.unsplash, PIXABAY_API_KEY: KEYS.pixabay, PEXELS_API_KEY: KEYS.pexels,
  });

  const usable = order.filter((s) => !isProvider(s) || KEYS[s]);
  console.log(`Source order: ${order.join(" > ")}`);
  console.log(`Usable this run: ${usable.join(" > ") || "none"}`);
  if (order.join() !== DEFAULT_SOURCE_ORDER.join()) console.log("  (overridden by --provider-order)");
  if (!PLAN_ONLY && usable.length === 0) {
    console.error("No source is usable. Set at least one provider key, or allow wikimedia in --provider-order.");
    process.exit(1);
  }
  console.log(`Mode: ${REPLACE ? "replace existing images" : "fill empty positions only"}`
    + `${PLAN_ONLY ? ", plan only" : DRY_RUN ? ", dry run" : ""}`);
  console.log(`Posts: ${specs.length}\n`);

  for (const post of POSTS) {
    const n = post.images.filter((i) => i.keyword).length;
    if (n !== 1) {
      console.error(`${post.slug}: ${n} image(s) marked to carry the focus keyword, must be exactly 1`);
      process.exit(1);
    }
  }

  // Loaded once and shared, so a post never reuses a picture another already has.
  const usedIds = new Set<string>();
  let uploader: string | null = null;
  if (!PLAN_ONLY) {
    const client = await connectable.connect();
    try {
      const { rows: userRows } = await client.query(
        `SELECT id FROM users WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1`
      );
      uploader = userRows[0]?.id ?? null;
      const { rows: credits } = await client.query(
        `SELECT caption FROM media WHERE caption ILIKE '%pexels%' OR caption ILIKE '%pixabay%' OR caption ILIKE '%unsplash%' OR caption ILIKE '%wikimedia%'`
      );
      for (const row of credits) {
        const c = String(row.caption ?? "");
        let m = c.match(/pexels\.com\/photo\/(?:[^/\s]*-)?(\d+)/i);
        if (m) { usedIds.add(`pexels:${m[1]}`); continue; }
        m = c.match(/pixabay\.com\/[^\s)]*-(\d+)/i);
        if (m) { usedIds.add(`pixabay:${m[1]}`); continue; }
        m = c.match(/unsplash\.com\/photos\/(?:[^/\s]*-)?([A-Za-z0-9_-]{8,})/i);
        if (m) { usedIds.add(`unsplash:${m[1]}`); continue; }
        m = c.match(/curid=(\d+)/);
        if (m) usedIds.add(`wikimedia:${m[1]}`);
      }
    } finally {
      client.release();
    }
  }

  let stopped = false;
  for (const post of specs) {
    if (PLAN_ONLY) {
      // No transaction and no network; just read the body to report on it.
      const client = await connectable.connect();
      try {
        await client.query("BEGIN");
        await processPostPlan(client, post);
        await client.query("ROLLBACK");
      } finally { client.release(); }
      continue;
    }
    const { stop } = await processPost(post, uploader, usedIds, order);
    if (stop) {
      stopped = true;
      notes.push("Every provider was rate limited or spent its budget. Stopped early; everything committed so far is kept.");
      break;
    }
  }

  printReport();

  const used = requestsUsed();
  console.log(`\nRequests this run: ${ALL_PROVIDERS.map((p) => `${p} ${used[p]}`).join(", ")}`);
  for (const { provider, reason } of retiredProviders()) console.log(`  ${provider} stopped early: ${reason}`);

  if (notes.length > 0) {
    console.log("\nNotes:");
    for (const n of notes) console.log(`  ${n}`);
  }

  const set = results.filter((r) => r.outcome === "set").length;
  const replaced = results.filter((r) => r.outcome === "replaced").length;
  if (PLAN_ONLY) {
    console.log("\n--plan: nothing was searched, downloaded or written.");
  } else if (DRY_RUN) {
    console.log(`\n--dry-run: rolled back. Would have set ${set} and replaced ${replaced} image(s).`);
  } else {
    console.log(`\nDone. ${set} image(s) set, ${replaced} replaced, committed post by post.`);
    if (stopped) console.log("Stopped early on the rate limit. Re-run the same command in an hour to continue.");
    console.log("Next: press “Notify Search Engines” in Admin → Settings once the posts are live.");
  }

  await (pool as unknown as { end(): Promise<void> }).end();
}

/** --plan: report what each position would do, without a network call. */
async function processPostPlan(client: TxClient, post: PostSpec): Promise<void> {
  const { rows } = await client.query(
    `SELECT body_en, featured_image, featured_image_alt FROM posts WHERE slug = $1`, [post.slug]
  );
  if (!rows[0]) { notes.push(`${post.slug}: post not found. Run its SQL file first.`); return; }
  const body: string = rows[0].body_en ?? "";
  const featured: string | null = rows[0].featured_image ?? null;

  for (const spec of post.images) {
    const position = spec.role === "featured" ? "hero" : `after H2 #${spec.afterH2}`;
    const fig = spec.role === "body" ? figureAtAfterH2(body, spec.afterH2!) : null;
    const filled = spec.role === "featured" ? Boolean(featured && featured.trim()) : Boolean(fig);
    const pinned = spec.role === "featured" ? isPinnedUrl(featured) : Boolean(fig && isPinnedFigure(fig.html));
    const outcome: Outcome = pinned ? "pinned" : filled && !REPLACE ? "kept" : "skipped";
    const detail = pinned ? "placed by hand, never replaced"
      : filled && !REPLACE ? "already filled, left alone"
      : `${filled ? "would try to replace" : "would try to fill"}: ${spec.queries.join(" | ")}`;
    results.push({
      slug: post.slug, role: spec.role, position, place: spec.place, outcome,
      url: "", provider: "", width: "", query: "", description: "",
      alt: spec.role === "featured" ? (rows[0].featured_image_alt ?? "") : (fig ? existingAlt(fig.html) : ""),
      tier: "-", detail,
    });
  }
}

run().catch(async (error) => {
  console.error("\nFAILED:\n", error instanceof Error ? error.message : error);
  await (pool as unknown as { end(): Promise<void> }).end().catch(() => {});
  process.exit(1);
});
