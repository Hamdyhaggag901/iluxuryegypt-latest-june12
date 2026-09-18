// Fetches the featured image and the in-body figures for the five new blog
// posts, and writes the alt text for each one after the photo is chosen.
//
// Run this AFTER the five content-updates/blog-0*.sql files, because it edits
// the body_en those files insert.
//
// Same rules as scripts/refix-itinerary-images.ts, which exists because the
// first pass at this got them wrong:
//
//   Pexels, then Pixabay, then Unsplash, the order the admin "Suggest Photo"
//   button uses. Several phrasings per image. Every candidate is checked
//   against the PROVIDER'S OWN DESCRIPTION, not against the query that found
//   it, because a query is not evidence about the photograph it returned.
//
//   If nothing can be confirmed, THE IMAGE IS LEFT OUT and the post is
//   reported. A post that goes live missing a figure is fixable. A post
//   illustrated with a picture of somewhere else is worse than one with no
//   picture at all.
//
//   Alt text is composed from that description AFTER the pick, never before,
//   and every content word in it has to trace back to the description or to
//   the place name. The focus keyword appears in exactly one image per post.
//
// ---------------------------------------------------------------------------
// Running it
// ---------------------------------------------------------------------------
//   npx tsx scripts/fill-post-images.ts --plan      # no network, no writes
//   npx tsx scripts/fill-post-images.ts --dry-run   # full run, then rollback
//   npx tsx scripts/fill-post-images.ts             # for real
//
// Flags:
//   --only=<slug>   restrict to one post (repeatable)
//
// Needs DATABASE_URL and PEXELS_API_KEY. PIXABAY_API_KEY and
// UNSPLASH_ACCESS_KEY are optional; a provider with no key is skipped.

import "dotenv/config";
import fs from "fs/promises";
import { pool } from "../server/db";
import {
  KEYS, PROVIDER_ORDER, UPLOAD_URL_PREFIX, UPLOAD_DIR,
  type Guard, auditVocabulary, composeAlt, findInventedWords,
  findConfirmed, downloadAndOptimise, creditLine,
} from "./lib/provider-images";
import {
  POSTS, figureExistsAfterH2, insertFigureAfterH2,
} from "./lib/post-image-specs";

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
const argv = process.argv.slice(2);
const PLAN_ONLY = argv.includes("--plan");
// A re-run fills only what is missing. Nothing already in place is touched,
// re-fetched or re-described unless --refill says so.
const REFILL = argv.includes("--refill");
const DRY_RUN = argv.includes("--dry-run");
const ONLY = argv.filter((a) => a.startsWith("--only=")).map((a) => a.slice("--only=".length));

interface TxClient {
  query(text: string, values?: unknown[]): Promise<{ rows: any[] }>;
  release(): void;
}
const connectable = pool as unknown as { connect(): Promise<TxClient> };

interface ResultRow {
  slug: string;
  role: string;
  position: string;
  place: string;
  outcome: "set" | "skipped" | "kept";
  url: string;
  provider: string;
  query: string;
  description: string;
  alt: string;
  tier: string;
  detail: string;
  rejections?: string[];
}

const results: ResultRow[] = [];
const writtenFiles: string[] = [];
const notes: string[] = [];

async function run(): Promise<void> {
  const vocabProblems = auditVocabulary();
  if (vocabProblems.length > 0) {
    console.error("VOCABULARY GUARD FAILED:\n  " + vocabProblems.join("\n  "));
    process.exit(1);
  }

  const specs = ONLY.length > 0 ? POSTS.filter((p) => ONLY.includes(p.slug)) : POSTS;
  if (specs.length === 0) {
    console.error(`No post matched --only=. Known slugs:\n  ${POSTS.map((p) => p.slug).join("\n  ")}`);
    process.exit(1);
  }

  const configured = PROVIDER_ORDER.filter((p) => KEYS[p]);
  console.log(`Providers configured: ${configured.join(", ") || "none"}`);
  if (!PLAN_ONLY && configured.length === 0) {
    console.error("No image provider is configured. Set at least PEXELS_API_KEY.");
    process.exit(1);
  }

  // A stale afterH2 index is exactly the bug this run just found: the articles
  // were expanded after the specs were written and the figures landed in the
  // wrong sections. Checked against the live body before anything downloads.
  for (const post of specs) {
    const { rows } = await (await connectable.connect().then(async (c) => {
      const r = await c.query(`SELECT body_en FROM posts WHERE slug = $1`, [post.slug]);
      c.release();
      return r;
    }));
    if (!rows[0]) continue;
    const h2Count = (String(rows[0].body_en ?? "").match(/<h2>/g) || []).length;
    for (const img of post.images) {
      if (img.role === "body" && (img.afterH2! < 1 || img.afterH2! >= h2Count)) {
        console.error(
          `${post.slug}: afterH2 ${img.afterH2} is out of range, the post has ${h2Count} H2 headings. ` +
            `Update the spec rather than letting the figure land at the end of the article.`
        );
        process.exit(1);
      }
    }
  }

  // Sanity check the keyword rule before any network call.
  for (const post of POSTS) {
    const n = post.images.filter((i) => i.keyword).length;
    if (n !== 1) {
      console.error(`${post.slug}: ${n} image(s) marked to carry the focus keyword, must be exactly 1`);
      process.exit(1);
    }
  }

  const client = await connectable.connect();
  let committed = false;

  try {
    await client.query("BEGIN");

    const { rows: userRows } = await client.query(
      `SELECT id FROM users WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1`
    );
    const uploader: string | null = userRows[0]?.id ?? null;

    // Seeded with every provider photo already used anywhere, so a post never
    // reuses a picture an itinerary day is already showing.
    const usedIds = new Set<string>();
    const { rows: credits } = await client.query(
      `SELECT caption FROM media WHERE caption ILIKE '%pexels%' OR caption ILIKE '%pixabay%' OR caption ILIKE '%unsplash%'`
    );
    for (const row of credits) {
      const c = String(row.caption ?? "");
      let m = c.match(/pexels\.com\/photo\/(?:[^/\s]*-)?(\d+)/i);
      if (m) { usedIds.add(`pexels:${m[1]}`); continue; }
      m = c.match(/pixabay\.com\/[^\s)]*-(\d+)/i);
      if (m) { usedIds.add(`pixabay:${m[1]}`); continue; }
      m = c.match(/unsplash\.com\/photos\/(?:[^/\s]*-)?([A-Za-z0-9_-]{8,})/i);
      if (m) usedIds.add(`unsplash:${m[1]}`);
    }

    for (const post of specs) {
      const { rows } = await client.query(
        `SELECT id, body_en, featured_image, featured_image_alt FROM posts WHERE slug = $1`,
        [post.slug]
      );
      if (!rows[0]) {
        notes.push(`${post.slug}: post not found. Run its SQL file first.`);
        continue;
      }
      let body: string = rows[0].body_en ?? "";
      let featured: string | null = rows[0].featured_image ?? null;
      let featuredAlt: string | null = rows[0].featured_image_alt ?? null;
      // Two images on one page with identical alt text is a real defect, and
      // it happens when two different photos of the same site come back with
      // similar descriptions. Tracked per post so it can be reported.
      const altsUsed = new Set<string>();

      // Body figures are inserted from the LAST position backwards, so an
      // earlier insertion never shifts the index of a later one.
      // Body figures are inserted from the LAST position backwards so an
      // earlier insertion never shifts a later index. The featured image has no
      // position and is put first, because an article without a hero is worse
      // off than one missing a figure and it should get first pick of the
      // photos when the two compete.
      const ordered = [...post.images].sort((a, b) => {
        if (a.role !== b.role) return a.role === "featured" ? -1 : 1;
        return (b.afterH2 ?? 0) - (a.afterH2 ?? 0);
      });

      for (const spec of ordered) {
        const position = spec.role === "featured" ? "hero" : `after H2 #${spec.afterH2}`;
        const base: ResultRow = {
          slug: post.slug, role: spec.role, position, place: spec.place,
          outcome: "skipped", url: "", provider: "", query: "", description: "",
          alt: "", tier: "-", detail: "",
        };

        const alreadyThere = spec.role === "featured"
          ? Boolean(featured && featured.trim())
          : figureExistsAfterH2(body, spec.afterH2!);
        if (alreadyThere && !REFILL) {
          results.push({ ...base, outcome: "kept", detail: "already filled, left alone" });
          continue;
        }

        if (PLAN_ONLY) {
          results.push({ ...base, detail: `would try: ${spec.queries.join(" | ")}` });
          continue;
        }

        const found = await findConfirmed(spec.queries, spec.guard, usedIds);
        if (!("candidate" in found)) {
          // The rule this script exists for: no confirmed photo means no photo.
          results.push({
            ...base,
            detail: `nothing confirmed out of ${found.tried} candidate(s), image left out`,
            rejections: found.rejections,
          });
          console.warn(`  ! ${post.slug} ${position} (${spec.place}): nothing confirmed, leaving it out.`);
          continue;
        }

        const description = found.candidate.description;
        const suffix = spec.keyword ? post.keywordSuffix : undefined;
        // placeConfirmed is not an assumption: findConfirmed only returns a
        // candidate whose description satisfied this image's requirePlace.
        const composed = composeAlt(description, spec.place, spec.city, { suffix, placeConfirmed: true });
        if (!composed) {
          results.push({
            ...base, description,
            detail: "description too thin to write an honest 8 word alt, image left out",
          });
          console.warn(`  ! ${post.slug} ${position}: description too thin for an alt, leaving it out.`);
          continue;
        }

        const invented = findInventedWords(composed.alt, description, spec.place, spec.city, suffix);
        if (invented.length > 0) {
          throw new Error(
            `${post.slug} ${position}: alt "${composed.alt}" contains word(s) the description ` +
              `"${description}" does not attest: ${invented.join(", ")}`
          );
        }

        if (altsUsed.has(composed.alt.toLowerCase())) {
          notes.push(
            `${post.slug} ${position}: alt would duplicate another image on this post ` +
              `("${composed.alt}"). The image is still set; reword one of them by hand.`
          );
        }
        altsUsed.add(composed.alt.toLowerCase());

        const saved = await downloadAndOptimise(found.candidate, writtenFiles);
        const credit = creditLine(found.candidate);

        await client.query(
          `INSERT INTO media (filename, original_name, mime_type, size, url, alt_en, caption, uploaded_by)
           VALUES ($1, $2, 'image/webp', $3, $4, $5, $6, $7)`,
          [
            saved.filename,
            `${found.candidate.provider}-${spec.place.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
            saved.size, saved.url, composed.alt, credit, uploader,
          ]
        );

        if (spec.role === "featured") {
          featured = saved.url;
          featuredAlt = composed.alt;
        } else {
          const escaped = composed.alt.replace(/"/g, "&quot;");
          const figure =
            `<figure><img src="${saved.url}" alt="${escaped}" loading="lazy" width="1600" height="1067">` +
            `<figcaption>${escaped}</figcaption></figure>\n`;
          body = insertFigureAfterH2(body, spec.afterH2!, figure);
        }

        results.push({
          ...base, outcome: "set", url: saved.url, provider: found.candidate.provider,
          query: found.query, description, alt: composed.alt, tier: composed.tier,
          detail: found.query === spec.queries[0] ? "" : "fallback query",
        });
      }

      if (!PLAN_ONLY) {
        await client.query(
          `UPDATE posts SET featured_image = $1, featured_image_alt = $2, body_en = $3, updated_at = now() WHERE id = $4`,
          [featured, featuredAlt, body, rows[0].id]
        );
      }
    }

    printReport();
    verifyKeywordRule();

    if (PLAN_ONLY) {
      await client.query("ROLLBACK");
      console.log("\n--plan: nothing was written and nothing was downloaded.");
    } else if (DRY_RUN) {
      await client.query("ROLLBACK");
      for (const f of writtenFiles) await fs.unlink(f).catch(() => {});
      console.log(`\n--dry-run: rolled back, and removed ${writtenFiles.length} file(s) written to ${UPLOAD_DIR}.`);
    } else {
      await client.query("COMMIT");
      committed = true;
      const set = results.filter((r) => r.outcome === "set").length;
      const skipped = results.filter((r) => r.outcome === "skipped").length;
      console.log(`\nCOMMITTED. ${set} image(s) set, ${skipped} left out.`);
      if (skipped > 0) console.log("The skipped ones are listed above with the reason for each.");
      console.log("Next: press “Notify Search Engines” in Admin → Settings once the posts are live.");
    }
  } catch (error) {
    if (!committed) {
      await client.query("ROLLBACK").catch(() => {});
      for (const f of writtenFiles) await fs.unlink(f).catch(() => {});
    }
    throw error;
  } finally {
    client.release();
    await (pool as unknown as { end(): Promise<void> }).end();
  }
}

/** Exactly one image per post may carry the focus keyword. */
function verifyKeywordRule(): void {
  console.log("\nFocus keyword in image alt text:");
  for (const post of POSTS) {
    const mine = results.filter((r) => r.slug === post.slug && r.outcome === "set");
    if (mine.length === 0) continue;
    const n = mine.filter((r) => r.alt.toLowerCase().includes(post.focusKeyword.toLowerCase())).length;
    console.log(`  ${post.slug.padEnd(30)} ${n} of ${mine.length} image(s)`);
    if (n > 1) throw new Error(`${post.slug}: focus keyword appears in ${n} image alts, the rule is one`);
  }
}

function printReport(): void {
  const w = (n: number) => (s: string) => (s.length > n ? s.slice(0, n - 1) + "…" : s).padEnd(n);
  const cols: Array<[number, string]> = [[28, "POST"], [9, "ROLE"], [14, "POSITION"], [22, "PLACE"], [8, "OUTCOME"], [9, "PROVIDER"], [7, "TIER"]];
  console.log("\n" + cols.map(([n, h]) => w(n)(h)).join("  "));
  console.log(cols.map(([n]) => "-".repeat(n)).join("  "));
  for (const r of results) {
    console.log([w(28)(r.slug), w(9)(r.role), w(14)(r.position), w(22)(r.place), w(8)(r.outcome), w(9)(r.provider), w(7)(r.tier)].join("  "));
  }

  console.log("\nPer image:");
  for (const r of results) {
    console.log(`\n  ${r.slug} ${r.position} — ${r.place}`);
    if (r.description) console.log(`    the photo's own description: "${r.description}"`);
    if (r.outcome === "kept") {
      console.log(`    already filled, left alone`);
    } else if (r.outcome === "set") {
      console.log(`    file: ${r.url}`);
      console.log(`    alt:  ${r.alt}`);
      console.log(`    via:  ${r.provider} / "${r.query}"${r.detail ? ` (${r.detail})` : ""}`);
    } else {
      console.log(`    NOT SET: ${r.detail}`);
      for (const reason of r.rejections ?? []) console.log(`      - ${reason}`);
    }
  }

  const skipped = results.filter((r) => r.outcome === "skipped" && !PLAN_ONLY);
  const kept = results.filter((r) => r.outcome === "kept");
  if (kept.length > 0) console.log(`\n${kept.length} image(s) already in place and left untouched.`);
  if (skipped.length > 0) {
    console.log(`\n${skipped.length} image(s) could not be filled. Add these by hand from the Media Library:`);
    for (const r of skipped) console.log(`  ${r.slug} ${r.position} (${r.place})`);
  }

  if (notes.length > 0) {
    console.log("\nNotes:");
    for (const n of notes) console.log(`  ${n}`);
  }
}

run().catch((error) => {
  console.error("\nFAILED, nothing was committed:\n", error instanceof Error ? error.message : error);
  process.exit(1);
});
