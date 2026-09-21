// Tests for the {year} placeholder in article titles.
//
// Titles for time sensitive queries are stored with a {year} token and the
// real year is substituted at render time, in Africa/Cairo, so that an article
// titled "... in 2026" becomes "... in 2027" on 1 January with nobody editing
// anything. See shared/year-placeholder.ts.
//
// Four things have to be true, and each has its own section below:
//
//   A  the substitution itself flips at midnight in CAIRO, not in UTC
//   B  the HTML a crawler receives carries the real year and never the token
//   C  neither cache keeps serving last year's render past midnight
//   D  the "Last reviewed" lines stay fixed, because a date that advances on
//      its own is a lie that maintains itself
//
// No database needed: storage.getPostBySlug is stubbed, so this runs anywhere.
//
//   npx tsx scripts/test-year-placeholder.ts

import { ENV_REPORT } from "./lib/script-env";
import fs from "fs";
import path from "path";

void ENV_REPORT;

// server/db.ts refuses to load without a connection string and every module
// under test reaches it through storage. The pool is never asked to connect:
// the one storage method these tests call is replaced below.
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgres://placeholder:placeholder@127.0.0.1:1/placeholder";
  const realError = console.error;
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].startsWith("Database seeding error")) return;
    realError(...args);
  };
}

const { YEAR_PLACEHOLDER, currentYear, applyYear } = await import("@shared/year-placeholder");
const { resolvePageContent, resolvePageContentCached, clearContentCache, injectPageContent } =
  await import("../server/seo-content");
const { resolvePageMeta, injectMetaTags } = await import("../server/seo-meta");
const { cacheKeyFor } = await import("../server/prerender");
const { storage } = await import("../server/storage");

let fails = 0;
function ok(name: string, passed: boolean, detail = ""): void {
  console.log(`${passed ? "PASS" : "FAIL"}  ${name}${passed || !detail ? "" : `\n        ${detail}`}`);
  if (!passed) fails++;
}

// ---------------------------------------------------------------------------
// A frozen clock
// ---------------------------------------------------------------------------
// The render path calls applyYear() with no argument, which means it reads the
// real clock. To test 1 January there has to be a fake one, and it has to fool
// Intl.DateTimeFormat as well as Date.now(), which is why this is a real Date
// subclass rather than a stub object.

const RealDate = Date;
let frozenAt: number | null = null;

class FrozenDate extends RealDate {
  constructor(value?: number | string | Date) {
    if (value === undefined) super(frozenAt ?? RealDate.now());
    else super(value);
  }
  static override now(): number {
    return frozenAt ?? RealDate.now();
  }
}

async function at<T>(iso: string, fn: () => Promise<T> | T): Promise<T> {
  frozenAt = new RealDate(iso).getTime();
  (globalThis as { Date: DateConstructor }).Date = FrozenDate as unknown as DateConstructor;
  try {
    return await fn();
  } finally {
    (globalThis as { Date: DateConstructor }).Date = RealDate;
    frozenAt = null;
  }
}

// Cairo is UTC+02:00 on 1 January, so the new year arrives there at 22:00 UTC
// on 31 December. These two instants are 60 seconds apart and straddle it.
const LAST_MINUTE_OF_2026 = "2026-12-31T21:59:30Z"; // 23:59:30 in Cairo
const FIRST_MINUTE_OF_2027 = "2026-12-31T22:00:30Z"; // 00:00:30 in Cairo

// ---------------------------------------------------------------------------
// A stand-in post
// ---------------------------------------------------------------------------
// Carries the placeholder in every field that reaches a page, including the
// H1, so the test covers the h1 path whether or not a real article uses it
// today. The "Last reviewed" line is the one in the visa and safety articles.

const REVIEWED_LINE = "<strong>Last reviewed: September 2026.</strong>";
const STUB_SLUG = "year-placeholder-fixture";

const stubPost = {
  id: "00000000-0000-4000-8000-000000000000",
  slug: STUB_SLUG,
  titleEn: `Egypt Visa Rules in ${YEAR_PLACEHOLDER}`,
  metaTitle: `Egypt Visa Rules in ${YEAR_PLACEHOLDER}: What Changed`,
  metaDescription: `Everything that changed for ${YEAR_PLACEHOLDER}, in one page.`,
  excerpt: `The short version for ${YEAR_PLACEHOLDER}.`,
  bodyEn: `<p>${REVIEWED_LINE} Entry rules change without much notice.</p>`,
  featuredImage: "/uploads/test.jpg",
  featuredImageAlt: null,
  ogImage: null,
  canonicalUrl: null,
  robots: null,
  schemaType: "BlogPosting",
  category: "Travel Planning",
  tags: ["Visa"],
  faqs: [],
  status: "published",
  scheduledAt: null,
  publishedAt: new RealDate("2025-03-01T09:00:00Z"),
  createdAt: new RealDate("2025-03-01T09:00:00Z"),
  updatedAt: new RealDate("2026-09-20T09:00:00Z"),
};

let lookups = 0;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(storage as any).getPostBySlug = async (slug: string) => {
  if (slug !== STUB_SLUG) return undefined;
  lookups++;
  return stubPost;
};

const STUB_PATH = `/blog/${STUB_SLUG}`;

// The real shipped template. injectMetaTags REPLACES the og tags rather than
// inserting them, so a hand written stand-in without og:title in it would let
// the og:title assertion below pass by never running.
const TEMPLATE = fs.readFileSync(path.resolve(import.meta.dirname, "../client/index.html"), "utf8");

// ---------------------------------------------------------------------------
// A. the substitution, and the timezone it turns on
// ---------------------------------------------------------------------------
console.log("\n--- A. currentYear and applyYear ---");

await at(FIRST_MINUTE_OF_2027, () => {
  ok("1 January 2027 in Cairo reads 2027", currentYear() === "2027", `got ${currentYear()}`);
  const stored: string = `Best Time to Visit Egypt in ${YEAR_PLACEHOLDER}`;
  ok(
    "a title with the token renders the current year",
    applyYear(stored) === "Best Time to Visit Egypt in 2027",
    applyYear(stored),
  );
});

// This pair is the whole reason the helper uses Intl rather than getFullYear.
// At 21:59:30 UTC it is still 2026 everywhere; at 22:00:30 UTC it is 2027 in
// Cairo and still 2026 in London. A UTC implementation passes the first case
// and fails the second, which is the bug this catches.
await at(LAST_MINUTE_OF_2026, () => {
  ok("23:59:30 on 31 December in Cairo still reads 2026", currentYear() === "2026", `got ${currentYear()}`);
});
await at(FIRST_MINUTE_OF_2027, () => {
  ok("00:00:30 on 1 January in Cairo reads 2027 while UTC is still 2026",
     currentYear() === "2027" && new RealDate(FIRST_MINUTE_OF_2027).getUTCFullYear() === 2026,
     `currentYear ${currentYear()}, UTC year ${new RealDate(FIRST_MINUTE_OF_2027).getUTCFullYear()}`);
});

ok("text without the token is returned unchanged", applyYear("No year here") === "No year here");
ok("null passes through", applyYear(null) === null);
ok("undefined passes through", applyYear(undefined) === undefined);
const twice: string = `${YEAR_PLACEHOLDER} and ${YEAR_PLACEHOLDER}`;
ok("every occurrence is replaced, not just the first",
   applyYear(twice, new RealDate(FIRST_MINUTE_OF_2027)) === "2027 and 2027");

// ---------------------------------------------------------------------------
// B. what a crawler is served
// ---------------------------------------------------------------------------
console.log("\n--- B. the server rendered HTML on 1 January 2027 ---");

await at(FIRST_MINUTE_OF_2027, async () => {
  const meta = await resolvePageMeta(STUB_PATH);
  if (!meta) {
    ok("the stub post resolves to meta", false, "resolvePageMeta returned null");
    return;
  }

  ok("<title> says 2027", meta.title.includes("2027"), meta.title);
  ok("<title> carries no literal token", !meta.title.includes(YEAR_PLACEHOLDER), meta.title);
  ok("the description says 2027", meta.description.includes("2027"), meta.description);

  const nodes = Array.isArray(meta.jsonLd) ? meta.jsonLd : [meta.jsonLd];
  const blogPosting = nodes.find(
    (n): n is Record<string, unknown> =>
      typeof n === "object" && n !== null && (n as Record<string, unknown>)["@type"] === "BlogPosting",
  );
  ok("a BlogPosting node is present", Boolean(blogPosting));
  const headline = String(blogPosting?.headline ?? "");
  ok("BlogPosting headline says 2027", headline.includes("2027"), headline);
  ok("BlogPosting headline carries no literal token", !headline.includes(YEAR_PLACEHOLDER), headline);

  const content = await resolvePageContent(STUB_PATH);
  ok("the post renders as content, not a passthrough", content.kind === "content", content.kind);
  const contentHtml = content.kind === "content" ? content.html : "";
  ok("the H1 says 2027", /<h1>[^<]*2027[^<]*<\/h1>/.test(contentHtml),
     contentHtml.match(/<h1>.*?<\/h1>/)?.[0] ?? "no h1");

  // The one assertion that covers everything at once: whatever else is in the
  // page, the token itself must never reach it.
  const full = injectMetaTags(injectPageContent(TEMPLATE, contentHtml), STUB_PATH, meta);
  ok("the whole served document contains no literal {year}", !full.includes(YEAR_PLACEHOLDER),
     full.slice(Math.max(0, full.indexOf(YEAR_PLACEHOLDER) - 60), full.indexOf(YEAR_PLACEHOLDER) + 60));
  ok("the whole served document says 2027", full.includes("2027"));
  ok("og:title in the document says 2027", /property="og:title" content="[^"]*2027/.test(full),
     full.match(/property="og:title" content="[^"]*"/)?.[0] ?? "no og:title");
});

// ---------------------------------------------------------------------------
// C. the caches
// ---------------------------------------------------------------------------
console.log("\n--- C. no cache serves last year's render ---");

// 60 seconds apart, so the 5 minute content TTL and the 24 hour prerender TTL
// are both still live. Only the year in the cache key can force a re-render,
// which is exactly what is being asserted.
clearContentCache();

const before = await at(LAST_MINUTE_OF_2026, () => resolvePageContentCached(STUB_PATH));
ok("the cached path renders real content, not a passthrough", before.kind === "content", before.kind);
const beforeHtml = before.kind === "content" ? before.html : "";
ok("the 31 December render says 2026", beforeHtml.includes("2026"),
   beforeHtml.match(/<h1>.*?<\/h1>/)?.[0] ?? "no h1");

const lookupsAfterFirst = lookups;
const warm = await at(LAST_MINUTE_OF_2026, () => resolvePageContentCached(STUB_PATH));
ok("a second call in the same year is served from the cache",
   lookups === lookupsAfterFirst && warm.kind === "content",
   `lookups went ${lookupsAfterFirst} -> ${lookups}`);

const after = await at(FIRST_MINUTE_OF_2027, () => resolvePageContentCached(STUB_PATH));
const afterHtml = after.kind === "content" ? after.html : "";
ok("60 seconds later, across midnight in Cairo, the cache re-renders",
   lookups > lookupsAfterFirst, `lookups went ${lookupsAfterFirst} -> ${lookups}`);
ok("the 1 January render says 2027 and not 2026",
   afterHtml.includes("2027") && !afterHtml.includes("Rules in 2026"),
   afterHtml.match(/<h1>.*?<\/h1>/)?.[0] ?? "no h1");

const keyBefore = await at(LAST_MINUTE_OF_2026, () => cacheKeyFor(STUB_PATH));
const keyAfter = await at(FIRST_MINUTE_OF_2027, () => cacheKeyFor(STUB_PATH));
ok("the prerender cache key changes across the Cairo new year",
   keyBefore !== keyAfter, `${keyBefore} vs ${keyAfter}`);

// ---------------------------------------------------------------------------
// D. "Last reviewed" is fixed on purpose
// ---------------------------------------------------------------------------
console.log('\n--- D. "Last reviewed" does not move ---');

await at(FIRST_MINUTE_OF_2027, async () => {
  const content = await resolvePageContent(STUB_PATH);
  const html = content.kind === "content" ? content.html : "";
  ok('"Last reviewed: September 2026." survives a render in 2027 unchanged',
     html.includes(REVIEWED_LINE),
     html.match(/Last reviewed[^<]*/)?.[0] ?? "no Last reviewed line");
});

// And the source of truth: no article may put the token on that line, because
// a review date that advances on its own claims work that nobody did.
const GEN_DIR = path.resolve(import.meta.dirname, "../content-updates/blog-generator");
const modules = fs.readdirSync(GEN_DIR).filter((f) => /^a\d+\.mjs$/.test(f));
ok("article modules were found to check", modules.length > 0, `${GEN_DIR}`);

const reviewedOffenders: string[] = [];
const bodyOffenders: string[] = [];
for (const file of modules) {
  const src = fs.readFileSync(path.join(GEN_DIR, file), "utf8");
  for (const line of src.split("\n")) {
    if (line.includes("Last reviewed") && line.includes(YEAR_PLACEHOLDER)) reviewedOffenders.push(`${file}: ${line.trim()}`);
  }
  // The token belongs in the SEO title fields. In a body it would be rendered
  // by seo-content but NOT by anything that reads body_en directly, and the
  // admin editor would show it to whoever opens the article next.
  const body = src.match(/body:\s*`([\s\S]*?)`,\n {2}faqs:/)?.[1] ?? "";
  if (body.includes(YEAR_PLACEHOLDER)) bodyOffenders.push(file);
}
ok('no "Last reviewed" line uses the placeholder', reviewedOffenders.length === 0, reviewedOffenders.join("\n        "));
ok("no article body carries the placeholder", bodyOffenders.length === 0, bodyOffenders.join(", "));

console.log(fails === 0 ? "\nAll year placeholder cases passed." : `\n${fails} failure(s)`);
process.exit(fails === 0 ? 0 : 1);
