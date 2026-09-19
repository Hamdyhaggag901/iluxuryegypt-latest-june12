// Says where a post's FAQPage schema is, or which step dropped it.
//
// There are three places the answer can differ, and the point of this script is
// to print all three side by side so the failing one names itself:
//
//   database    the stored FAQs, and whether each has both halves filled in
//   generated   what resolvePageMeta + injectMetaTags put in the HTML, which
//               is what a crawler that runs no JavaScript receives
//   served      what the running site actually answers with, for a plain
//               request and for a crawler, whose response comes from the
//               prerender middleware and can be a cached snapshot older than
//               the data behind it
//
//   npx tsx scripts/check-faq-schema.ts abu-simbel-tour-from-aswan
//   npx tsx scripts/check-faq-schema.ts --all
//   npx tsx scripts/check-faq-schema.ts abu-simbel-tour-from-aswan --http=https://iluxuryegypt.com

import { ENV_REPORT } from "./lib/script-env";

void ENV_REPORT;

const args = process.argv.slice(2);
const httpBase = args.find((a) => a.startsWith("--http="))?.slice("--http=".length);
const all = args.includes("--all");
const slugs = args.filter((a) => !a.startsWith("--"));

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set, so there is nothing to read. Run this from the checkout that has the .env.");
  process.exit(1);
}

const { storage } = await import("../server/storage");
const { resolvePageMeta, injectMetaTags } = await import("../server/seo-meta");
const { isPostLive } = await import("@shared/post-visibility");

type Faq = { question?: string; answer?: string };
const usable = (f: Faq | null | undefined): boolean => Boolean(f && f.question?.trim() && f.answer?.trim());

const TEMPLATE = `<html><head><title>t</title><meta name="description" content="d" /></head><body><div id="root"></div></body></html>`;

const posts = await storage.getPosts();
const chosen = all
  ? posts.filter((p) => ((p.faqs || []) as Faq[]).length > 0)
  : slugs.length > 0
    ? slugs.map((slug) => posts.find((p) => p.slug === slug)).filter((p): p is (typeof posts)[number] => Boolean(p))
    : [];

if (chosen.length === 0) {
  console.error(slugs.length > 0 ? `No post matched: ${slugs.join(", ")}` : "Pass a slug, or --all for every post that has FAQs.");
  process.exit(1);
}

let problems = 0;

for (const post of chosen) {
  const stored = (post.faqs || []) as Faq[];
  const good = stored.filter(usable);
  const live = isPostLive(post);

  console.log(`\n/blog/${post.slug}`);
  console.log(`  database   status=${post.status} scheduledAt=${post.scheduledAt ? new Date(post.scheduledAt).toISOString() : "none"} live=${live} faqs=${stored.length} usable=${good.length}`);
  for (const [i, faq] of stored.entries()) {
    if (usable(faq)) continue;
    console.log(`             faq ${i + 1} is half written: question=${JSON.stringify(faq?.question ?? null)} answer=${JSON.stringify(faq?.answer ?? null)}`);
  }

  const meta = await resolvePageMeta(`/blog/${post.slug}`);
  if (!meta) {
    console.log("  generated  resolvePageMeta returned nothing, so the page carries no schema at all");
    console.log(live ? "             (it is live, so this is a bug)" : "             (it is not live yet, which is why)");
    if (live) problems++;
    continue;
  }
  const html = injectMetaTags(TEMPLATE, `/blog/${post.slug}`, meta);
  const nodes = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => {
    try { return JSON.parse(m[1].replace(/\\u003c/g, "<")); } catch { return null; }
  });
  const types = nodes.map((n) => (n ? n["@type"] : "UNPARSEABLE")).join(", ");
  const faqPage = nodes.find((n) => n && n["@type"] === "FAQPage" && Array.isArray(n.mainEntity));
  console.log(`  generated  schema: ${types}`);
  console.log(`             FAQPage: ${faqPage ? `${faqPage.mainEntity.length} question(s)` : "missing"}`);
  if (good.length > 0 && !faqPage) problems++;
  if (faqPage && faqPage.mainEntity.length !== good.length) {
    console.log(`             mismatch: ${good.length} usable FAQ(s) stored, ${faqPage.mainEntity.length} in the schema`);
    problems++;
  }

  if (!httpBase) continue;
  for (const [label, ua] of [
    ["plain  ", "curl/8.0.0"],
    ["crawler", "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"],
  ] as Array<[string, string]>) {
    try {
      const res = await fetch(`${httpBase}/blog/${post.slug}`, { headers: { "user-agent": ua } });
      const body = await res.text();
      const snapshot = res.headers.get("x-prerendered") ?? "no";
      const has = body.includes('"FAQPage"');
      console.log(`  served     ${label} ${res.status} ${body.length} bytes  prerendered=${snapshot}  FAQPage=${has ? "yes" : "no"}`);
      if (!has && good.length > 0 && live) {
        problems++;
        if (snapshot === "cache") {
          console.log("             this answer came from the prerender cache, which can be up to 24 hours older than the data.");
          console.log(`             Confirm with: curl -s '${httpBase}/blog/${post.slug}?_prerender=true' | grep -c FAQPage`);
        }
      }
    } catch (err) {
      console.log(`  served     ${label} unreachable: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}

console.log(problems === 0 ? "\nNothing missing." : `\n${problems} problem(s) above.`);
process.exit(problems === 0 ? 0 : 1);
