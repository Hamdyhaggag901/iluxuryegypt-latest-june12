// Fetches article images from Wikimedia Commons.
//
// Written general purpose from the start, because the five SEO articles are the
// first five of roughly a hundred. Everything specific to an image is either a
// command line flag or an entry in scripts/lib/post-image-specs.ts.
//
// Why Commons rather than another stock provider: the stock libraries are good
// at "Egypt, sand, camel" and bad at "the Temple of Beit el Wali as re-erected
// above Lake Nasser". Commons has archival and specialist photography of
// Egyptian sites that Pexels, Pixabay and Unsplash simply do not carry, which
// is how a position ends up unfillable after all three have been tried.
//
// What it will not do:
//
//   LICENCES. Only CC0, public domain, CC BY and CC BY-SA are accepted. Anything
//   non-commercial, no-derivatives, GFDL-only, fair use, or with a licence field
//   this script does not recognise is rejected. Commons hosts non-free files and
//   files whose licence tags are a mess, and this is a commercial site.
//
//   GOOGLE IMAGES, or any other search engine's image results. Those are other
//   people's copyrighted photographs with no licence attached. They are not an
//   option here and there is no flag to make them one.
//
//   A PHOTOGRAPH OF SOMEWHERE ELSE. Same relevance guard as the stock scripts:
//   the candidate is judged on the description Commons carries for it, never on
//   the query that found it, and a description naming a different Egyptian place
//   is a rejection however well it matches otherwise.
//
//   AN ENGRAVING, A MAP OR A SCAN. Commons is full of nineteenth century plates
//   and modern scans of them. They are beautiful and they are not photographs of
//   the place as a visitor will find it.
//
// Every accepted image gets its licence written into media.caption, with the
// photographer's name and a link to the Commons file page, so the source of any
// picture on the site can be read straight off the Media Library.
//
// ---------------------------------------------------------------------------
// Running it
// ---------------------------------------------------------------------------
//   npx tsx scripts/fetch-wikimedia-image.ts --fill-missing --plan
//       Lists every position in post-image-specs.ts that still has no image.
//       No network, no writes.
//
//   npx tsx scripts/fetch-wikimedia-image.ts --fill-missing --dry-run
//       Searches and downloads for real, prints the table, then ROLLS BACK.
//
//   npx tsx scripts/fetch-wikimedia-image.ts --fill-missing
//       The same, committed.
//
//   npx tsx scripts/fetch-wikimedia-image.ts \
//     --post=abu-simbel-tour-from-aswan --position=7 \
//     --place="Lake Nasser" --city=Aswan --query="Lake Nasser Egypt"
//       One position on one post, for an article with no spec entry.
//
// Flags:
//   --post=<slug>        the post to write to
//   --position=<n>       1 based H2 index, or "hero" for the featured image
//   --place="<name>"     what the photograph has to be of
//   --city=<name>        the city or governorate it sits in
//   --query="<text>"     a Commons search phrase (repeatable, tried in order)
//   --keyword="<text>"   editorial suffix for the alt, e.g. a focus keyword
//   --fill-missing       every empty position across post-image-specs.ts
//   --replace            overwrite a position that already has an image
//   --plan               no network, no writes
//   --dry-run            full run, then rollback
//
// Needs DATABASE_URL. No API key: Commons is open, but it does require a real
// User-Agent, which is set below.

import { ENV_REPORT, printEnvReport } from "./lib/script-env";
import fs from "fs/promises";
import { pool } from "../server/db";
import {
  type Guard, type Tier,
  auditVocabulary, composeAlt, findInventedWords,
  downloadAndOptimise, EGYPT_PLACES,
} from "./lib/provider-images";
import {
  type CommonsCandidate, type Rejection,
  PREFER_WIDTH, findOnCommons, commonsCaption, titleToWords,
} from "./lib/wikimedia-commons";
import {
  POSTS, figureExistsAfterH2, insertFigureAfterH2, removeFigureAfterH2, figureAtAfterH2,
} from "./lib/post-image-specs";
import { isPinnedUrl, isPinnedFigure } from "./lib/pinned-images";

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
const argv = process.argv.slice(2);
const PLAN_ONLY = argv.includes("--plan");
const DRY_RUN = argv.includes("--dry-run");
const FILL_MISSING = argv.includes("--fill-missing");
const REPLACE = argv.includes("--replace");
const flag = (name: string): string | undefined =>
  argv.filter((a) => a.startsWith(`--${name}=`)).map((a) => a.slice(name.length + 3))[0];
const flags = (name: string): string[] =>
  argv.filter((a) => a.startsWith(`--${name}=`)).map((a) => a.slice(name.length + 3));

/**
 * Posts this run may touch.
 *
 * --only was documented and never parsed, so every run processed all thirteen
 * posts whatever was on the command line. That is how a run meant to fix one
 * position spent the hour's request allowance, hit a 429, and rolled back
 * everything it had already done. An unknown slug is now an error rather than
 * a silent widening of the job.
 */
const ONLY = flags("only");
function postsInScope() {
  if (ONLY.length === 0) return POSTS;
  const unknown = ONLY.filter((s) => !POSTS.some((p) => p.slug === s));
  if (unknown.length > 0) {
    console.error(
      `Unknown --only slug(s): ${unknown.join(", ")}\nKnown slugs:\n  ${POSTS.map((p) => p.slug).join("\n  ")}`
    );
    process.exit(1);
  }
  return POSTS.filter((p) => ONLY.includes(p.slug));
}

interface Job {
  slug: string;
  role: "featured" | "body";
  afterH2?: number;
  place: string;
  city: string;
  queries: string[];
  guard: Guard;
  suffix?: string;
}

/**
 * A guard for a post with no spec entry, built from --place and --city.
 *
 * Deliberately no looser than the ones written by hand: the place or its city
 * still has to be named in the description, and any other Egyptian place still
 * contradicts it. What it cannot do is require a subject ("colonnade", "relief"),
 * so for a position that matters, write a spec entry instead.
 */
function guardFor(place: string, city: string): Guard {
  const placeTokens = [place.toLowerCase(), ...place.toLowerCase().split(/\s+/).filter((w) => w.length > 3)];
  const cityToken = city.trim().toLowerCase();
  const allow = EGYPT_PLACES.filter((p) => placeTokens.some((t) => t.includes(p)) || (cityToken && cityToken.includes(p)));
  return {
    requirePlace: Array.from(new Set([...placeTokens, cityToken].filter(Boolean))),
    require: [],
    deny: [],
    allowPlaces: Array.from(new Set([...allow, cityToken].filter(Boolean))),
  };
}

interface TxClient {
  query(text: string, values?: unknown[]): Promise<{ rows: any[] }>;
  release(): void;
}
const connectable = pool as unknown as { connect(): Promise<TxClient> };

interface ResultRow {
  slug: string;
  position: string;
  place: string;
  outcome: "set" | "skipped" | "kept";
  url: string;
  width: string;
  licence: string;
  query: string;
  alt: string;
  tier: string;
  detail: string;
  rejections?: Rejection[];
}

const results: ResultRow[] = [];
const writtenFiles: string[] = [];
const notes: string[] = [];

/** Jobs from --fill-missing: every spec position with nothing in it yet. */
async function missingJobs(client: TxClient): Promise<Job[]> {
  const jobs: Job[] = [];
  for (const post of postsInScope()) {
    const { rows } = await client.query(
      `SELECT body_en, featured_image FROM posts WHERE slug = $1`, [post.slug]
    );
    if (!rows[0]) { notes.push(`${post.slug}: post not found, skipped`); continue; }
    const body: string = rows[0].body_en ?? "";
    for (const img of post.images) {
      const filled = img.role === "featured"
        ? Boolean(rows[0].featured_image)
        : figureExistsAfterH2(body, img.afterH2!);
      const fig = img.role === "body" ? figureAtAfterH2(body, img.afterH2!) : null;
      const pinned = img.role === "featured"
        ? isPinnedUrl(rows[0].featured_image)
        : Boolean(fig && isPinnedFigure(fig.html));
      if (pinned) {
        notes.push(`${post.slug} ${img.role === "featured" ? "hero" : `after H2 #${img.afterH2}`}: pinned by hand, not touched.`);
        continue;
      }
      if (filled && !REPLACE) continue;
      jobs.push({
        slug: post.slug, role: img.role, afterH2: img.afterH2,
        place: img.place, city: img.city, queries: img.queries, guard: img.guard,
        suffix: img.keyword ? post.keywordSuffix : undefined,
      });
    }
  }
  return jobs;
}

/** The single job described by the command line flags. */
function explicitJob(): Job {
  const slug = flag("post");
  const position = flag("position");
  const place = flag("place");
  const city = flag("city") ?? "";
  const queries = flags("query");

  const missing = [
    !slug && "--post=<slug>",
    !position && "--position=<n|hero>",
    !place && '--place="<name>"',
    queries.length === 0 && '--query="<search text>"',
  ].filter(Boolean);
  if (missing.length > 0) {
    console.error(`Missing ${missing.join(", ")}. Or pass --fill-missing to work from the specs.`);
    process.exit(1);
  }

  const role = position === "hero" ? "featured" : "body";
  const afterH2 = role === "body" ? Number(position) : undefined;
  if (role === "body" && (!Number.isInteger(afterH2) || afterH2! < 1)) {
    console.error(`--position must be a whole number of 1 or more, or "hero". Got "${position}".`);
    process.exit(1);
  }

  // A spec entry for this exact position wins: its guard is stronger than
  // anything guardFor() can build, and its queries have been tried before.
  const spec = POSTS.find((p) => p.slug === slug)?.images
    .find((i) => (role === "featured" ? i.role === "featured" : i.afterH2 === afterH2));

  return {
    slug: slug!, role, afterH2, place: place!, city,
    queries,
    guard: spec?.guard ?? guardFor(place!, city),
    suffix: undefined,
  };
}

function printReport(): void {
  console.log("");
  console.log(
    "post".padEnd(30), "position".padEnd(12), "outcome".padEnd(8),
    "width".padEnd(7), "licence".padEnd(18), "alt"
  );
  for (const r of results) {
    console.log(
      r.slug.padEnd(30), r.position.padEnd(12), r.outcome.padEnd(8),
      r.width.padEnd(7), r.licence.padEnd(18), r.alt || r.detail
    );
  }

  const skipped = results.filter((r) => r.outcome === "skipped");
  if (skipped.length > 0) {
    console.log(`\n${skipped.length} position(s) left empty. Commons had nothing this script would accept:`);
    for (const r of skipped) {
      console.log(`\n  ${r.slug} ${r.position} (${r.place}) ${r.detail}`);
      for (const rej of r.rejections ?? []) console.log(`      ${rej.title}: ${rej.reason}`);
    }
  }
}

async function run(): Promise<void> {
  const vocabProblems = auditVocabulary();
  if (vocabProblems.length > 0) {
    console.error("VOCABULARY GUARD FAILED:\n  " + vocabProblems.join("\n  "));
    process.exit(1);
  }

  printEnvReport(ENV_REPORT, { DATABASE_URL: process.env.DATABASE_URL ? "set" : "" });
  if (ONLY.length > 0) console.log(`Restricted to: ${ONLY.join(", ")}`);

  const client = await connectable.connect();
  let committed = false;

  try {
    await client.query("BEGIN");

    const jobs = FILL_MISSING ? await missingJobs(client) : [explicitJob()];
    if (jobs.length === 0) {
      console.log("Nothing to do: every position in the specs already has an image.");
      await client.query("ROLLBACK");
      return;
    }

    console.log(`${jobs.length} position(s) to fill from Wikimedia Commons.`);
    if (PLAN_ONLY) {
      for (const j of jobs) {
        console.log(`  ${j.slug} ${j.role === "featured" ? "hero" : `after H2 #${j.afterH2}`} (${j.place}) queries: ${j.queries.join(" | ")}`);
      }
      await client.query("ROLLBACK");
      console.log("\n--plan: nothing was searched, downloaded or written.");
      return;
    }

    const { rows: userRows } = await client.query(
      `SELECT id FROM users WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1`
    );
    const uploader: string | null = userRows[0]?.id ?? null;

    // Commons file pages already in media.caption, so a re-run never fetches the
    // same photograph twice for two different positions.
    const usedIds = new Set<string>();
    const { rows: captions } = await client.query(
      `SELECT caption FROM media WHERE caption ILIKE '%wikimedia%'`
    );
    for (const row of captions) {
      const m = String(row.caption ?? "").match(/curid=(\d+)/);
      if (m) usedIds.add(`wikimedia:${m[1]}`);
    }

    // Grouped by post so each body is read once, written once, and the figures
    // go in from the last position backwards, which keeps the earlier H2
    // indices valid while the body grows.
    const bySlug = new Map<string, Job[]>();
    for (const job of jobs) {
      if (!bySlug.has(job.slug)) bySlug.set(job.slug, []);
      bySlug.get(job.slug)!.push(job);
    }

    for (const [slug, postJobs] of bySlug) {
      const { rows } = await client.query(
        `SELECT id, body_en, featured_image, featured_image_alt FROM posts WHERE slug = $1`, [slug]
      );
      if (!rows[0]) { notes.push(`${slug}: post not found, skipped`); continue; }

      let body: string = rows[0].body_en ?? "";
      let featured: string | null = rows[0].featured_image ?? null;
      let featuredAlt: string | null = rows[0].featured_image_alt ?? null;

      const ordered = [...postJobs].sort((a, b) => {
        if (a.role === "featured") return 1;
        if (b.role === "featured") return -1;
        return (b.afterH2 ?? 0) - (a.afterH2 ?? 0);
      });

      for (const job of ordered) {
        const position = job.role === "featured" ? "hero" : `after H2 #${job.afterH2}`;
        const base = {
          slug, position, place: job.place, outcome: "skipped" as const,
          url: "", width: "", licence: "", query: "", alt: "", tier: "", detail: "",
        };

        const found = await findOnCommons(job.queries, job.guard, usedIds);
        if ("rejections" in found) {
          results.push({ ...base, detail: `nothing confirmed out of ${found.tried} file(s)`, rejections: found.rejections });
          console.warn(`  ! ${slug} ${position}: nothing on Commons passed the licence, quality and place checks.`);
          continue;
        }

        const c = found.candidate;
        const composed = composeAlt(c.description, job.place, job.city, {
          suffix: job.suffix,
          placeConfirmed: true,
        });
        if (!composed) {
          results.push({ ...base, detail: "Commons description too thin to write an honest alt, image left out" });
          console.warn(`  ! ${slug} ${position}: description too thin for an alt, leaving it out.`);
          continue;
        }

        const invented = findInventedWords(composed.alt, c.description, job.place, job.city, job.suffix);
        if (invented.length > 0) {
          throw new Error(
            `${slug} ${position}: alt "${composed.alt}" uses word(s) the Commons description ` +
              `"${c.description}" does not attest: ${invented.join(", ")}`
          );
        }

        const saved = await downloadAndOptimise(c, writtenFiles);
        await client.query(
          `INSERT INTO media (filename, original_name, mime_type, size, url, alt_en, caption, uploaded_by)
           VALUES ($1, $2, 'image/webp', $3, $4, $5, $6, $7)`,
          [
            saved.filename,
            `wikimedia-${job.place.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
            saved.size, saved.url, composed.alt, commonsCaption(c), uploader,
          ]
        );

        if (job.role === "featured") {
          featured = saved.url;
          featuredAlt = composed.alt;
        } else {
          const escaped = composed.alt.replace(/"/g, "&quot;");
          const figure =
            `<figure><img src="${saved.url}" alt="${escaped}" loading="lazy" width="1600" height="1067">` +
            `<figcaption>${escaped}</figcaption></figure>\n`;
          if (REPLACE && figureExistsAfterH2(body, job.afterH2!)) {
            body = removeFigureAfterH2(body, job.afterH2!);
            // The row stays in the Media Library on purpose. Deleting it would
            // break any other page that had reused the same picture, and this
            // script has no way to know whether one has.
            notes.push(`${slug} ${position}: replaced the figure. The old image is still in the Media Library if you want it back.`);
          }
          body = insertFigureAfterH2(body, job.afterH2!, figure);
        }

        results.push({
          ...base, outcome: "set", url: saved.url,
          width: `${c.width}px`, licence: c.licence, query: found.query,
          alt: composed.alt, tier: composed.tier as Tier,
          detail: c.width >= PREFER_WIDTH ? "" : `source under ${PREFER_WIDTH}px`,
        });
      }

      await client.query(
        `UPDATE posts SET featured_image = $1, featured_image_alt = $2, body_en = $3, updated_at = now() WHERE id = $4`,
        [featured, featuredAlt, body, rows[0].id]
      );
    }

    printReport();

    if (DRY_RUN) {
      await client.query("ROLLBACK");
      console.log("\n--dry-run: rolled back, nothing was kept in the database.");
    } else {
      await client.query("COMMIT");
      committed = true;
      console.log("\nCommitted.");
    }
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    throw error;
  } finally {
    client.release();
    // A rolled back transaction leaves the downloaded files orphaned on disk,
    // pointed at by nothing. Clean them up rather than leaving them for someone
    // to find in the uploads directory a month later.
    if (!committed) {
      for (const file of writtenFiles) await fs.unlink(file).catch(() => {});
    }
    await pool.end().catch(() => {});
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
