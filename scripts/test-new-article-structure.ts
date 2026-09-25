// Structural checks for the articles written from the Nile cluster onwards.
//
// These assert things the generator cannot: that the furniture it builds
// survives into the SQL, and that the schema a crawler receives is complete
// and not duplicated. The bodies are read back out of the generated wave file
// rather than from the .mjs source, because the bug this file was written
// after was exactly a gap between the two: the guards validated a rendered
// body and the SQL shipped the raw one, and every report said it worked.
//
//   npx tsx scripts/test-new-article-structure.ts

import { ENV_REPORT } from "./lib/script-env";
void ENV_REPORT;
process.env.DATABASE_URL ||= "postgres://p:p@127.0.0.1:1/p";
const realError = console.error;
console.error = (...a: unknown[]) => { if (typeof a[0] === "string" && a[0].startsWith("Database seeding error")) return; realError(...a); };

const { storage } = await import("../server/storage");
const { resolvePageMeta, injectMetaTags } = await import("../server/seo-meta");
const { resolvePageContent, injectPageContent } = await import("../server/seo-content");
import fs from "fs";
import path from "path";
import { POSTS, articleH2Positions } from "./lib/post-image-specs";

// The five Phase A rows exactly as the wave SQL stores them, read back from
// the generated SQL so this checks what ships rather than a hand-made stub.
// Both new waves, so the hotels cluster is covered by the same assertions as
// the Nile one rather than by a second copy of this file.
const sql = ["nile-cluster", "hotels-cluster", "planning-cluster"]
  .map((w) => fs.readFileSync(path.resolve(import.meta.dirname, `../content-updates/add-posts-wave-${w}.sql`), "utf8"))
  .join("\n");
const bodies = [...sql.matchAll(/^  '([a-z0-9-]+)',\n  '((?:[^']|'')*)',\n  '((?:[^']|'')*)',/gm)]
  .map((m) => ({ slug: m[1], title: m[2].replace(/''/g, "'"), body: m[3].replace(/''/g, "'") }));

// Each row's own scheduled moment, taken from the same file. The stub used to
// hardcode one date for all five, which made the byline assertion fail for
// four of them and told us nothing about the code.
const scheduled = new Map(
  [...sql.matchAll(/^  '([a-z0-9-]+)',[\s\S]*?\n  'published',\n  '([^']+)'::timestamptz,/gm)]
    .map((m) => [m[1], m[2]] as [string, string]),
);

const TEMPLATE = fs.readFileSync(path.resolve(import.meta.dirname, "../client/index.html"), "utf8");
let fails = 0;
const ok = (n: string, c: boolean, d = "") => { if (!c) fails++; console.log(`${c ? "PASS" : "FAIL"}  ${n}${d ? "  " + d : ""}`); };

for (const row of bodies) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (storage as any).getPostBySlug = async (s: string) => s !== row.slug ? undefined : ({
    id: "0", slug: row.slug, titleEn: row.title, bodyEn: row.body,
    metaTitle: row.title, metaDescription: "d".repeat(155), excerpt: "e".repeat(155),
    featuredImage: "/uploads/x.jpg", featuredImageAlt: null, ogImage: null,
    canonicalUrl: null, robots: null, schemaType: "BlogPosting", category: "Travel Planning",
    tags: ["Nile Cruise"], status: "published", scheduledAt: null,
    publishedAt: new Date(scheduled.get(row.slug)!), createdAt: new Date(scheduled.get(row.slug)!),
    updatedAt: new Date(scheduled.get(row.slug)!),
    schemaMarkup: row.slug === "dahabiya-nile-cruise" ? null : null,
    faqs: Array.from({ length: 8 }, (_, i) => ({ id: String(i), question: `Q${i}?`, answer: `A${i}` })),
  });

  const path = `/blog/${row.slug}`;
  const meta = await resolvePageMeta(path);
  const content = await resolvePageContent(path);
  const html = injectMetaTags(injectPageContent(TEMPLATE, content.kind === "content" ? content.html : ""), path, meta!);

  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
  const types = blocks.flatMap((b) => (Array.isArray(b) ? b : [b])).map((b) => b["@type"]);
  console.log(`\n--- ${row.slug} ---`);
  ok("BlogPosting in server HTML", types.includes("BlogPosting"), types.join(", "));
  ok("FAQPage in server HTML", types.includes("FAQPage"));
  ok("BreadcrumbList in server HTML", types.includes("BreadcrumbList"));
  ok("no duplicate schema @type", new Set(types).size === types.length, types.join(", "));
  const bp = blocks.flat().find((b) => b["@type"] === "BlogPosting");
  ok("BlogPosting has datePublished, dateModified, author, publisher, image",
     Boolean(bp.datePublished && bp.dateModified && bp.author && bp.publisher && bp.image));
  // The <time datetime="..."> in the byline and dateModified in the JSON-LD
  // are the same fact stated twice. A rich result gets dropped when they
  // disagree, and nothing else in the pipeline would notice.
  const bylineDate = row.body.match(/<time datetime="([^"]+)">/)?.[1] ?? "";
  ok("dateModified matches the visible Last updated line",
     bylineDate.length > 0 && bp.dateModified.startsWith(bylineDate),
     `schema ${bp.dateModified} vs byline ${bylineDate}`);
  ok("exactly one table with a header row",
     (row.body.match(/<table>/g) ?? []).length === 1 && row.body.includes("<thead>"));
  ok("exactly one byline and one table of contents",
     (row.body.match(/class="post-byline"/g) ?? []).length === 1 &&
     (row.body.match(/class="toc"/g) ?? []).length === 1);
  ok("table of contents rendered server side", html.includes('class="toc"'));
  ok("key takeaways rendered server side", html.includes('class="key-takeaways"'));

  // Every image spec position has to exist in the body that actually ships.
  //
  // This is the assertion the /<h2>/g bug needed. The placer counted H2s with
  // a pattern that matches no heading in a furniture article, so afterH2
  // failed its range check on all fourteen of them and every body figure was
  // skipped with a note nobody was going to read. Counting against the stored
  // body, with the same helper the placer uses, is the only version of this
  // check that can fail when that breaks.
  const spec = POSTS.find((x) => x.slug === row.slug);
  if (spec) {
    const positions = articleH2Positions(row.body);
    const bad = spec.images
      .filter((i) => i.role === "body")
      .filter((i) => i.afterH2! < 1 || i.afterH2! >= positions.length)
      .map((i) => `afterH2 ${i.afterH2} against ${positions.length} H2s`);
    ok("every body image position exists in the stored body", bad.length === 0, bad.join(", "));
    ok("the H2 count excludes the takeaways and related blocks",
       positions.length === (row.body.match(/<h2\b[^>]*>/g) ?? []).length - 2,
       `${positions.length} article H2s of ${(row.body.match(/<h2\b[^>]*>/g) ?? []).length} total`);
  } else {
    ok("has an image spec", false, `${row.slug} is not in post-image-specs.ts`);
  }
}
console.log(fails === 0 ? "\nAll schema cases passed." : `\n${fails} failure(s)`);
process.exit(fails === 0 ? 0 : 1);
