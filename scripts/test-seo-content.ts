// Tests for the server rendered page content.
//
// Two layers:
//
//   Pure    escaping, injection and the not-found semantics, with no database.
//           Always run.
//
//   Live    every route type against the real data, through the same two
//           functions the server uses to build a response, so what is asserted
//           is the HTML a crawler receives rather than a stand-in for it.
//           Runs when DATABASE_URL is set.
//
// Pass --http=http://localhost:5199 to additionally assert over real responses,
// which is the only way to check the status code a crawler actually sees.
//
//   npx tsx scripts/test-seo-content.ts
//   DATABASE_URL=... npx tsx scripts/test-seo-content.ts --http=http://localhost:5199

import { ENV_REPORT } from "./lib/script-env";
import fs from "fs";
import path from "path";
import { HOME_INTRO_PARAGRAPH } from "@shared/home-intro";

void ENV_REPORT;

// Whether there is a database to talk to, read before the placeholder below
// can muddy the answer.
const HAS_DB = Boolean(process.env.DATABASE_URL);

// server/db.ts refuses to load at all without a connection string, and both
// modules under test reach it through storage, so a static import would take
// the pure cases down with it on a machine that has no database. A placeholder
// gets the modules loaded; the pool it builds is never asked to connect,
// because every live case is behind HAS_DB.
if (!HAS_DB) {
  process.env.DATABASE_URL = "postgres://placeholder:placeholder@127.0.0.1:1/placeholder";
  // server/storage.ts kicks off seedDatabase() when it is imported, which with
  // the placeholder above fails and logs in the middle of the results. It is
  // expected here and says nothing about the cases being run, so only that one
  // message is swallowed; every other console.error still comes through.
  const realError = console.error;
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].startsWith("Database seeding error")) return;
    realError(...args);
  };
}

const { esc, trusted, injectPageContent, resolvePageContent } = await import("../server/seo-content");
const { resolvePageMeta, injectMetaTags, SITE_URL } = await import("../server/seo-meta");

let fails = 0;
function ok(name: string, passed: boolean, detail = ""): void {
  console.log(`${passed ? "PASS" : "FAIL"}  ${name}${passed || !detail ? "" : `\n        ${detail}`}`);
  if (!passed) fails++;
}

const HTTP_BASE = process.argv.slice(2).find((a) => a.startsWith("--http="))?.slice("--http=".length);

const BARE_TEMPLATE = `<html><head><title>t</title><meta name="description" content="d" /></head><body><div id="root"></div></body></html>`;

const distIndex = path.resolve(import.meta.dirname, "..", "dist", "public", "index.html");
const template = fs.existsSync(distIndex) ? fs.readFileSync(distIndex, "utf-8") : BARE_TEMPLATE;

/** Exactly what the server sends, built by the same two calls. */
async function render(url: string): Promise<{ html: string; status: number }> {
  const [meta, content] = await Promise.all([resolvePageMeta(url), resolvePageContent(url)]);
  let html = meta ? injectMetaTags(template, url, meta) : template;
  if (content.kind === "content") html = injectPageContent(html, content.html);
  return { html, status: content.kind === "notFound" ? 404 : 200 };
}

const count = (s: string, re: RegExp) => (s.match(re) || []).length;

/**
 * Every JSON-LD script in a response, parsed. The string "INVALID" stands in
 * for one that is not JSON, so a broken script fails loudly instead of simply
 * not being found.
 */
function jsonLdNodes(s: string): any[] {
  return [...s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => {
    try { return JSON.parse(m[1].replace(/\\u003c/g, "<")); } catch { return "INVALID"; }
  });
}

const jsonLdTypes = (s: string): string[] =>
  jsonLdNodes(s).map((n) => (n === "INVALID" ? "INVALID" : n["@type"])).filter(Boolean);

/** The FAQPage node, which is the one carrying a mainEntity list of questions. */
const faqNode = (s: string): any =>
  jsonLdNodes(s).find((n) => n !== "INVALID" && n["@type"] === "FAQPage" && Array.isArray(n.mainEntity));

// ---------------------------------------------------------------------------
console.log("\nA. Escaping: markup through, values escaped\n");

ok("an ampersand in a value is escaped", esc('Tickets & Timing') === "Tickets &amp; Timing", esc("Tickets & Timing"));
ok("a double quote in a value is escaped", esc('say "hello"') === "say &quot;hello&quot;", esc('say "hello"'));
ok("angle brackets in a value are escaped", esc("<script>") === "&lt;script&gt;", esc("<script>"));
ok("a single quote is escaped", esc("it's") === "it&#39;s", esc("it's"));
ok("null becomes an empty string, not the word null", esc(null) === "", esc(null));

ok("trusted HTML passes through untouched",
   trusted("<h2>Hello</h2><p>A &amp; B</p>") === "<h2>Hello</h2><p>A &amp; B</p>");
ok("an entity already in stored HTML is not escaped again",
   !trusted("A &amp; B").includes("&amp;amp;"), trusted("A &amp; B"));

{
  // The exact hazard: a title carrying markup must not become markup, while
  // the body next to it must stay markup.
  const html = `<h1>${esc('Tickets & "Timing": <b>')}</h1><div>${trusted("<h2>Real</h2>")}</div>`;
  ok("a title with & and quotes is escaped in place", html.includes("Tickets &amp; &quot;Timing&quot;: &lt;b&gt;"), html);
  ok("and the body beside it is still live markup", html.includes("<h2>Real</h2>"), html);
  ok("the escaped title did not become a tag", !html.includes("<b>"), html);
}

// ---------------------------------------------------------------------------
console.log("\nB. Injection\n");

{
  const template = `<html><body><div id="root"></div><script src="/x.js"></script></body></html>`;
  const out = injectPageContent(template, "<h1>Hi</h1>");
  ok("content lands inside #root", /<div id="root"><div data-server-rendered="true"><h1>Hi<\/h1><\/div><\/div>/.test(out), out);
  ok("the script tag is untouched", out.includes('<script src="/x.js">'), out);
  ok("nothing is added outside #root",
     out.replace(/<div id="root">[\s\S]*?<\/div><\/div>/, "") === `<html><body><script src="/x.js"></script></body></html>`, out);
}
{
  // React's createRoot empties its container on mount, which is the whole
  // reason the content is safe to put there. If the template ever stops having
  // an empty #root, injection has to be a no-op rather than a guess.
  const noRoot = `<html><body><div id="app"></div></body></html>`;
  ok("a template with no empty #root is returned unchanged",
     injectPageContent(noRoot, "<h1>Hi</h1>") === noRoot);
}

// ---------------------------------------------------------------------------
console.log("\nC. Not found is different from nothing to say\n");

if (!HAS_DB) {
  console.log("  DATABASE_URL not set, skipping the live checks.\n");
} else {
  async function routeTest(label: string, url: string, expect: { h1?: RegExp } = {}): Promise<void> {
    const { html, status } = await render(url);
    ok(`${label}: responds 200`, status === 200, `status ${status}`);
    ok(`${label}: has an <h1>`, count(html, /<h1>/g) >= 1);
    if (expect.h1) {
      const h1 = html.match(/<h1>([^<]*)/)?.[1] ?? "";
      ok(`${label}: the <h1> is the page's own`, expect.h1.test(h1), h1);
    }
    const imgs = [...html.matchAll(/<img[^>]*alt="([^"]*)"[^>]*>/g)];
    ok(`${label}: has an <img> with a non-empty alt`,
       imgs.some((m) => m[1].trim().length > 0),
       `${imgs.length} img(s), alts: ${imgs.map((m) => m[1]).slice(0, 2).join(" | ")}`);
    ok(`${label}: has an internal <a href>`, count(html, /href="\/[^"]+"/g) >= 1);
    const types = jsonLdTypes(html);
    ok(`${label}: emits valid JSON-LD`, types.length > 0 && !types.includes("INVALID"), types.join(", "));
  }

  // One per route type the task names.
  await routeTest("homepage", "/");
  await routeTest("blog index", "/blog", { h1: /Blog/i });
  await routeTest("destination index", "/egypt-travel-guide", { h1: /Guide/i });
  await routeTest("tour index", "/luxury-egypt-tour-packages", { h1: /Tour/i });

  const { storage } = await import("../server/storage");
  const { isPostLive } = await import("@shared/post-visibility");

  const livePost = (await storage.getPosts()).find((p) => isPostLive(p) && p.bodyEn);
  if (livePost) await routeTest(`blog post (${livePost.slug})`, `/blog/${livePost.slug}`);
  else ok("a live post exists to test", false, "no live post in this database");

  const destination = (await storage.getDestinations()).find((d) => d.published);
  if (destination) await routeTest(`destination (${destination.slug})`, `/egypt-travel-guide/${destination.slug}`);

  const category = (await storage.getCategories())[0];
  if (category) await routeTest(`category (${category.slug})`, `/luxury-egypt-tour-packages/${category.slug}`);

  const tour = (await storage.getTours()).find((t) => t.published);
  if (tour) await routeTest(`tour (${tour.slug})`, `/${tour.slug}`);

  // -------------------------------------------------------------------------
  console.log("");

  for (const missing of ["/blog/no-such-post-xyz", "/egypt-travel-guide/no-such-place-xyz", "/luxury-egypt-tour-packages/no-such-cat-xyz"]) {
    const { html, status } = await render(missing);
    ok(`${missing} is a real 404`, status === 404, `status ${status}`);
    ok(`${missing} carries no injected content`, !html.includes('data-server-rendered'), "content was injected");
  }
  {
    // A static client route at the root shares its namespace with tour slugs,
    // so it must never be turned into a 404 by a missing tour.
    const { status } = await render("/about");
    ok("a static route at the root is not a 404", status === 200, `status ${status}`);
  }

  // -------------------------------------------------------------------------
  console.log("");

  {
    // The homepage H1 is the first active hero slide's title, which is the
    // heading a visitor sees first. Asserting the value rather than a word in
    // it is what stops the server and the client drifting apart.
    const slides = await storage.getActiveHeroSlides().catch(() => []);
    const { html } = await render("/");
    const h1 = html.match(/<h1>([^<]*)/)?.[1] ?? "";
    if (slides.length > 0 && slides[0].title?.trim()) {
      ok("the homepage H1 is the first hero slide's title", h1 === esc(slides[0].title.trim()),
         `h1 "${h1}" vs slide "${slides[0].title}"`);
    } else {
      ok("with no slides the homepage still has an H1", h1.trim().length > 0, h1);
    }
    ok("the homepage emits exactly one H1", (html.match(/<h1>/g) || []).length === 1,
       `${(html.match(/<h1>/g) || []).length} found`);
  }

  console.log("");

  const scheduled = (await storage.getPosts()).find((p) => !isPostLive(p));
  if (scheduled) {
    const { html } = await render(`/blog/${scheduled.slug}`);
    ok(`a future scheduled post renders no content (${scheduled.slug})`,
       !html.includes("data-server-rendered"), "scheduled content leaked into the HTML");
    ok("and no <h1> of its own", !new RegExp(`<h1>${scheduled.titleEn.slice(0, 20)}`).test(html));
  } else {
    ok("a scheduled post exists to test", false, "no scheduled post in this database");
  }

  // -------------------------------------------------------------------------
  console.log("");

  if (livePost) {
    const { html } = await render(`/blog/${livePost.slug}`);
    const bodyHeadings = (livePost.bodyEn || "").match(/<h2>/g)?.length ?? 0;
    ok("body_en headings are live markup in the response",
       bodyHeadings === 0 || html.includes("<h2>"), `${bodyHeadings} h2 in body_en`);
    ok("body_en is not escaped into text", !html.includes("&lt;h2&gt;"));
    ok("and entities already in the stored HTML are not doubled", !html.includes("&amp;amp;"));
    ok("the title is escaped where it is a value",
       !html.includes("<h1></h1>") && html.includes("<h1>"));
  }
}

// ---------------------------------------------------------------------------
console.log("\nD. FAQ structured data\n");

// The injection half, with no database. A FAQPage travels beside the
// BlogPosting as a second object in the same array, so what is checked here is
// that a second object really does become a second <script> and survives the
// escaping intact.
{
  const html = injectMetaTags(BARE_TEMPLATE, "/blog/x", {
    title: "T",
    description: "D",
    image: "https://example.com/i.jpg",
    type: "article",
    jsonLd: [
      { "@context": "https://schema.org", "@type": "BlogPosting", headline: "T" },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "Is it <b>far</b>?", acceptedAnswer: { "@type": "Answer", text: "About 3 hours each way." } },
          { "@type": "Question", name: "What does it cost?", acceptedAnswer: { "@type": "Answer", text: "From $120 per person." } },
          { "@type": "Question", name: "Hazard", acceptedAnswer: { "@type": "Answer", text: "</script><script>alert(1)</script>" } },
        ],
      },
    ],
  });
  const types = jsonLdTypes(html);
  const faq = faqNode(html);
  ok("a FAQPage beside a BlogPosting becomes its own script",
     types.includes("BlogPosting") && types.includes("FAQPage"), types.join(", "));
  ok("every question makes it into the script", faq?.mainEntity?.length === 3, String(faq?.mainEntity?.length));
  // An answer is editor written text, so it can contain anything, including
  // the one string that would end the script tag in the middle of the JSON.
  ok("a literal </script> in an answer does not close the tag early",
     !jsonLdTypes(html).includes("INVALID") && !html.includes("<script>alert(1)"),
     jsonLdTypes(html).join(", "));
  ok("and every answer still parses back to its original text",
     faq?.mainEntity?.[0]?.name === "Is it <b>far</b>?" &&
     faq?.mainEntity?.[2]?.acceptedAnswer?.text === "</script><script>alert(1)</script>",
     JSON.stringify(faq?.mainEntity?.[2]?.acceptedAnswer?.text));
}

if (!HAS_DB) {
  console.log("  DATABASE_URL not set, skipping the live FAQ checks.\n");
} else {
  const { storage } = await import("../server/storage");
  const { isPostLive } = await import("@shared/post-visibility");

  type Faq = { question?: string; answer?: string };
  // The same test seo-meta applies: both halves filled in, or it is not a FAQ.
  const usable = (f: Faq | null | undefined): boolean =>
    Boolean(f && f.question?.trim() && f.answer?.trim());
  const storedFaqs = (post: { faqs?: unknown }): Faq[] =>
    ((post.faqs || []) as Faq[]).filter(usable);

  const livePosts = (await storage.getPosts()).filter((p) => isPostLive(p));
  const withFaqs = livePosts.filter((p) => storedFaqs(p).length > 0);

  ok("at least one live post has curated FAQs to assert on", withFaqs.length > 0,
     `${livePosts.length} live post(s), none of them with FAQs`);

  // Every one of them rather than a sample. One article quietly losing its
  // FAQPage while the rest keep theirs is the exact failure this is here for,
  // and a sample is how that article gets missed.
  const noFaqPage: string[] = [];
  const wrongQuestions: string[] = [];
  for (const post of withFaqs) {
    const stored = storedFaqs(post).map((f) => f.question!.trim());
    const { html } = await render(`/blog/${post.slug}`);
    const faq = faqNode(html);
    if (!faq) { noFaqPage.push(post.slug); continue; }
    const asked: string[] = faq.mainEntity.map((q: any) => q?.name);
    const answered = faq.mainEntity.every(
      (q: any) => q?.["@type"] === "Question" && typeof q?.acceptedAnswer?.text === "string" && q.acceptedAnswer.text.trim().length > 0,
    );
    if (asked.length !== stored.length || !stored.every((q) => asked.includes(q)) || !answered) {
      wrongQuestions.push(`${post.slug} (${stored.length} stored, ${asked.length} in the schema${answered ? "" : ", an answer is empty"})`);
    }
  }
  ok("every live post with FAQs emits a FAQPage in the raw HTML",
     noFaqPage.length === 0, noFaqPage.join(", "));
  ok("each FAQPage carries one answered Question per stored FAQ",
     wrongQuestions.length === 0, wrongQuestions.join(", "));

  if (withFaqs[0]) {
    // The FAQPage is an addition. If it ever replaces the article node or the
    // breadcrumbs, the page loses more than it gains.
    const { html } = await render(`/blog/${withFaqs[0].slug}`);
    const types = jsonLdTypes(html);
    ok(`the article and breadcrumb nodes are still beside it (${withFaqs[0].slug})`,
       types.includes("BreadcrumbList") && types.length >= 3 && !types.includes("INVALID"),
       types.join(", "));
  }

  // The other half of the contract: no questions, no empty FAQPage.
  const withoutFaqs = livePosts.find((p) => storedFaqs(p).length === 0);
  if (withoutFaqs) {
    const { html } = await render(`/blog/${withoutFaqs.slug}`);
    ok(`a post with no FAQs emits no FAQPage (${withoutFaqs.slug})`,
       !jsonLdTypes(html).includes("FAQPage"), jsonLdTypes(html).join(", "));
  }

  // A scheduled post has no structured data at all, FAQs or not, so its
  // questions cannot be indexed before the article is live.
  const scheduledWithFaqs = (await storage.getPosts()).find((p) => !isPostLive(p) && storedFaqs(p).length > 0);
  if (scheduledWithFaqs) {
    const { html } = await render(`/blog/${scheduledWithFaqs.slug}`);
    ok(`a scheduled post's FAQs are not published early (${scheduledWithFaqs.slug})`,
       !jsonLdTypes(html).includes("FAQPage"), jsonLdTypes(html).join(", "));
  }
}

// ---------------------------------------------------------------------------
console.log("\nE. The homepage intro paragraph\n");

// The hero slider is client only, so this paragraph is the one piece of
// homepage copy a crawler that runs no JavaScript can read. Everything here is
// about it still being there, still saying the same thing on both sides, and
// still being readable by a person rather than only by a crawler.

const KEY_PHRASES = ["egypt private tours", "egypt luxury private tours", "luxury egypt vacation packages"];

// Styles that would turn quiet copy into hidden keyword text. Any of these on
// the paragraph is cloaking, whatever the intent behind it.
const HIDING = [
  /\bhidden\b/, /\bsr-only\b/, /\binvisible\b/, /\bopacity-0\b/,
  /display\s*:\s*none/i, /visibility\s*:\s*hidden/i, /\bblur-/,
  /-left-\[?\s*-?9\d{3}/, /\btext-transparent\b/,
];
/** A Tailwind text size below 13px, which is too small to read. */
const TINY = /text-\[(\d+(?:\.\d+)?)px\]/;

{
  const copy = HOME_INTRO_PARAGRAPH;
  ok("the copy is one paragraph, not several", !/\n/.test(copy) && copy.trim() === copy);
  ok("it carries no heading markup", !/<h[1-6]/i.test(copy) && !/^#/.test(copy));
  ok("it has exactly one em dash", (copy.match(/—/g) || []).length === 1,
     String((copy.match(/—/g) || []).length));
  ok("and no en dash", !copy.includes("–"));
  for (const phrase of KEY_PHRASES) {
    ok(`the copy contains "${phrase}"`, copy.includes(phrase));
  }
  ok("the phrases are plain prose, not links or emphasis",
     !/<(a|strong|em|b|i)\b/i.test(copy));
}

{
  // One source of truth. A second copy of this wording in the component is how
  // the crawler ends up reading one paragraph while the visitor sees another.
  const home = fs.readFileSync(path.resolve(import.meta.dirname, "..", "client", "src", "pages", "home.tsx"), "utf-8");
  ok("the homepage component imports the shared copy",
     /import\s*\{\s*HOME_INTRO_PARAGRAPH\s*\}\s*from\s*"@shared\/home-intro"/.test(home));
  ok("and does not carry a second copy of the wording",
     !home.includes(HOME_INTRO_PARAGRAPH.slice(0, 40)));

  const element = home.match(/<p\b[\s\S]*?data-testid="home-intro"[\s\S]*?>/);
  ok("the component renders it as a paragraph, not a heading", Boolean(element));
  const classNames = element?.[0].match(/className="([^"]*)"/)?.[1] ?? "";
  ok("the rendered paragraph carries no hiding classes",
     !HIDING.some((re) => re.test(classNames)), classNames);
  const tiny = classNames.match(TINY);
  ok("and no font size below 13px", !tiny || Number(tiny[1]) >= 13, tiny?.[0] ?? "no explicit px size");
}

if (!HAS_DB) {
  console.log("  DATABASE_URL not set, skipping the rendered homepage checks.\n");
} else {
  const { html } = await render("/");

  // The brief's own list, asserted against what the server actually sends.
  ok("the homepage still has exactly one <h1>", count(html, /<h1>/g) === 1, `${count(html, /<h1>/g)} found`);
  ok("the intro paragraph is in the server HTML as a real <p>",
     html.includes(`<p>${esc(HOME_INTRO_PARAGRAPH)}</p>`));
  for (const phrase of KEY_PHRASES) {
    ok(`the server HTML contains "${phrase}"`, html.includes(phrase));
  }

  // Not wrapped in anything that would hide it, and not turned into a heading
  // on its way out. The server block has no styling at all, so any style or
  // hiding attribute here would have had to be added deliberately.
  const paragraph = html.match(new RegExp(`<[^>]*>${esc(HOME_INTRO_PARAGRAPH).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));
  const openingTag = paragraph?.[0].match(/<[^>]*>/)?.[0] ?? "";
  ok("it is inside a <p>", openingTag === "<p>", openingTag);
  ok("the paragraph carries no hiding styles",
     !/style=|hidden|aria-hidden/i.test(openingTag), openingTag);
}

// ---------------------------------------------------------------------------
console.log("\nF. /stay moved to /luxury-hotels-in-egypt\n");

// Every old URL here is one someone else may already have linked or indexed,
// so these run without a database or a server: "does /stay still work" should
// never need a deployment to answer.
{
  const { resolveRedirect } = await import("../server/path-redirects");

  ok("/stay redirects to the new listing path",
     resolveRedirect("/stay") === "/luxury-hotels-in-egypt", String(resolveRedirect("/stay")));

  // There has never been a /stay/:slug route: hotel pages are served at
  // /hotel/:slug and that is where their canonical_url points, so an old
  // /stay/<slug> link goes straight there rather than to a child of the new
  // listing that nothing serves.
  ok("/stay/<slug> redirects to that hotel's page",
     resolveRedirect("/stay/four-seasons-first-residence-cairo") === "/hotel/four-seasons-first-residence-cairo",
     String(resolveRedirect("/stay/four-seasons-first-residence-cairo")));
  ok("a child of the new listing path goes to the same place",
     resolveRedirect("/luxury-hotels-in-egypt/four-seasons-first-residence-cairo") === "/hotel/four-seasons-first-residence-cairo",
     String(resolveRedirect("/luxury-hotels-in-egypt/four-seasons-first-residence-cairo")));

  ok("neither redirect lands on a path that redirects again",
     resolveRedirect("/luxury-hotels-in-egypt") === null && resolveRedirect("/hotel/x") === null,
     `${resolveRedirect("/luxury-hotels-in-egypt")} / ${resolveRedirect("/hotel/x")}`);
  ok("a query string survives the move",
     resolveRedirect("/stay", "?utm_source=newsletter") === "/luxury-hotels-in-egypt?utm_source=newsletter");
  ok("an unrelated path is left alone", resolveRedirect("/blog") === null);
  ok("/stay is gone as a served path, it only redirects",
     resolveRedirect("/stay") !== null && resolveRedirect("/stayed-in-egypt") === null,
     String(resolveRedirect("/stayed-in-egypt")));
}

{
  // The sitemap's static list, read from source. An old path left in it tells
  // search engines to keep crawling a URL that now redirects.
  const routes = fs.readFileSync(path.resolve(import.meta.dirname, "..", "server", "routes.ts"), "utf-8");
  const staticPages = routes.match(/const staticPages = \[[\s\S]*?\];/)?.[0] ?? "";
  ok("the sitemap's static list was found", staticPages.length > 0);
  ok("the sitemap lists the new path", staticPages.includes('"/luxury-hotels-in-egypt"'));
  ok("and does not list the old one", !/"\/stay"/.test(staticPages));
}

if (!HAS_DB) {
  console.log("  DATABASE_URL not set, skipping the rendered hotel listing checks.\n");
} else {
  const { html, status } = await render("/luxury-hotels-in-egypt");
  ok("the new listing path responds 200", status === 200, `status ${status}`);
  ok("it renders server content", html.includes('data-server-rendered="true"'));
  ok("with exactly one <h1>", count(html, /<h1>/g) === 1, `${count(html, /<h1>/g)} found`);
  ok("and links to hotel pages", /href="\/hotel\/[^"]+"/.test(html));

  const types = jsonLdTypes(html);
  ok("its ItemList and breadcrumbs still resolve",
     types.includes("ItemList") && types.includes("BreadcrumbList"), types.join(", "));
  ok("the breadcrumb points at the new path and reads as a human label",
     html.includes(`${SITE_URL}/luxury-hotels-in-egypt`) && html.includes('"Luxury Hotels"'));
  ok("the canonical is the new path",
     html.includes(`<link rel="canonical" href="${SITE_URL}/luxury-hotels-in-egypt" />`));

  // The old path has no meta of its own any more: it is a redirect, and the
  // 301 target is what carries the canonical.
  const stay = await resolvePageMeta("/stay");
  ok("/stay no longer resolves meta of its own", stay === null, JSON.stringify(stay?.title));
}

// ---------------------------------------------------------------------------
console.log("\nG. Article SEO field lengths\n");

// Every article's SEO title and meta description, checked at the source that
// writes them rather than at the database that receives them. These are the
// two fields a search result is built from: a title over 60 characters gets
// truncated mid word, and a description outside 150 to 160 either wastes the
// space or gets cut.
//
// The nine slugs added in the October and December waves are named explicitly,
// so this fails loudly if one of them is ever dropped from the batch rather
// than passing vacuously over whatever happens to be left.
const WAVE_SLUGS = [
  "valley-of-the-queens", "egypt-diving-red-sea", "black-and-white-desert-egypt",
  "tombs-of-the-nobles", "open-air-museum-memphis-egypt",
  "hatshepsut-temple", "memphis-egypt", "deir-el-medina", "bahariya-oasis-egypt",
];

{
  type Article = { slug: string; metaTitle: string; metaDescription: string };
  const mod = await import("../content-updates/blog-generator/articles.mjs" as string);
  const articles = (mod as { ARTICLES: Article[] }).ARTICLES;

  ok("the article source loads", Array.isArray(articles) && articles.length > 0, String(articles?.length));

  const bySlug = new Map(articles.map((a) => [a.slug, a]));
  const missing = WAVE_SLUGS.filter((slug) => !bySlug.has(slug));
  ok("all nine wave articles are still in the batch", missing.length === 0, missing.join(", "));

  const longTitles = articles.filter((a) => a.metaTitle.length >= 60)
    .map((a) => `${a.slug} (${a.metaTitle.length})`);
  ok("every SEO title is under 60 characters", longTitles.length === 0, longTitles.join(", "));

  const badDescriptions = articles
    .filter((a) => a.metaDescription.length < 150 || a.metaDescription.length > 160)
    .map((a) => `${a.slug} (${a.metaDescription.length})`);
  ok("every meta description is 150 to 160 characters", badDescriptions.length === 0, badDescriptions.join(", "));

  // Named individually as well, so a failure says which article to open.
  for (const slug of WAVE_SLUGS) {
    const a = bySlug.get(slug);
    if (!a) continue;
    ok(`${slug}: title ${a.metaTitle.length}, description ${a.metaDescription.length}`,
       a.metaTitle.length < 60 && a.metaDescription.length >= 150 && a.metaDescription.length <= 160);
  }
}

if (!HAS_DB) {
  console.log("  DATABASE_URL not set, skipping the stored article checks.\n");
} else {
  const { storage } = await import("../server/storage");
  const posts = await storage.getPosts();
  const bySlug = new Map(posts.map((p) => [p.slug, p]));

  const loaded = WAVE_SLUGS.filter((slug) => bySlug.has(slug));
  if (loaded.length === 0) {
    console.log("  none of the nine wave articles are in this database yet, so there is nothing stored to check.\n");
  } else {
    const badStored = loaded
      .map((slug) => bySlug.get(slug)!)
      .filter((p) => (p.metaTitle ?? "").length >= 60
        || (p.metaDescription ?? "").length < 150
        || (p.metaDescription ?? "").length > 160)
      .map((p) => `${p.slug} (title ${(p.metaTitle ?? "").length}, description ${(p.metaDescription ?? "").length})`);
    ok(`${loaded.length} stored wave article(s) keep their SEO field lengths`,
       badStored.length === 0, badStored.join(", "));

    // Scheduling is the whole point of the December batch, so it is worth
    // asserting rather than assuming: a wave article that is already visible
    // has lost its schedule somewhere between the file and the row.
    const { isPostScheduled } = await import("@shared/post-visibility");
    const december = loaded.filter((slug) => {
      const at = bySlug.get(slug)!.scheduledAt;
      return at ? new Date(at).getUTCMonth() === 11 : false;
    });
    const live = december.filter((slug) => !isPostScheduled(bySlug.get(slug)!));
    ok("the December articles are still scheduled rather than live", live.length === 0, live.join(", "));
  }
}

// ---------------------------------------------------------------------------
if (HTTP_BASE) {
  console.log(`\nH. Over HTTP against ${HTTP_BASE}\n`);
  for (const [label, url, expected] of [
    ["homepage", "/", 200],
    ["blog post", "/blog", 200],
    ["missing post", "/blog/no-such-post-xyz", 404],
  ] as Array<[string, string, number]>) {
    try {
      const res = await fetch(`${HTTP_BASE}${url}`);
      const body = await res.text();
      ok(`${label} ${url} responds ${expected}`, res.status === expected, `got ${res.status}`);
      if (expected === 200) ok(`${label} ${url} carries an <h1>`, /<h1>/.test(body));
      if (expected === 404) ok(`${label} ${url} carries no content`, !body.includes("data-server-rendered"));
    } catch (err) {
      ok(`${label} ${url} is reachable`, false, err instanceof Error ? err.message : String(err));
    }
  }

  // The status a crawler actually sees for the moved paths. Only a real
  // response can tell 301 from 302, or from a soft 200 that a client side
  // redirect would produce.
  for (const [from, to] of [
    ["/stay", "/luxury-hotels-in-egypt"],
    ["/stay/four-seasons-first-residence-cairo", "/hotel/four-seasons-first-residence-cairo"],
    ["/luxury-hotels-in-egypt/four-seasons-first-residence-cairo", "/hotel/four-seasons-first-residence-cairo"],
  ] as Array<[string, string]>) {
    try {
      const res = await fetch(`${HTTP_BASE}${from}`, { redirect: "manual" });
      ok(`${from} is a 301, not a 302 or a 200`, res.status === 301, `got ${res.status}`);
      ok(`${from} points at ${to}`, res.headers.get("location") === to, String(res.headers.get("location")));
    } catch (err) {
      ok(`${from} is reachable`, false, err instanceof Error ? err.message : String(err));
    }
  }

  for (const live of ["/luxury-hotels-in-egypt", "/hotel/four-seasons-first-residence-cairo"]) {
    try {
      const res = await fetch(`${HTTP_BASE}${live}`, { redirect: "manual" });
      const body = await res.text();
      ok(`${live} responds 200`, res.status === 200, `got ${res.status}`);
      ok(`${live} carries an <h1>`, /<h1[\s>]/.test(body));
    } catch (err) {
      ok(`${live} is reachable`, false, err instanceof Error ? err.message : String(err));
    }
  }

  try {
    const res = await fetch(`${HTTP_BASE}/sitemap.xml`);
    const xml = await res.text();
    ok("the served sitemap lists the new path", xml.includes("/luxury-hotels-in-egypt"));
    ok("and no longer lists /stay", !/<loc>[^<]*\/stay<\/loc>/.test(xml));
  } catch (err) {
    ok("the sitemap is reachable", false, err instanceof Error ? err.message : String(err));
  }

  // The path a crawler actually takes. A bot user agent is intercepted by the
  // prerender middleware and served a headless-Chrome snapshot instead of the
  // response built above, so the structured data has to survive that too, and a
  // snapshot cached before an edit is the one way the two can disagree.
  if (HAS_DB) {
    const { storage } = await import("../server/storage");
    const { isPostLive } = await import("@shared/post-visibility");
    type Faq = { question?: string; answer?: string };
    const post = (await storage.getPosts()).find(
      (p) => isPostLive(p) && ((p.faqs || []) as Faq[]).some((f) => f?.question?.trim() && f?.answer?.trim()),
    );
    if (!post) {
      ok("a live post with FAQs exists to fetch", false, "none in this database");
    } else {
      for (const [label, ua] of [
        ["a plain request", "curl/8.0.0"],
        ["a crawler", "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"],
      ] as Array<[string, string]>) {
        try {
          const res = await fetch(`${HTTP_BASE}/blog/${post.slug}`, { headers: { "user-agent": ua } });
          const body = await res.text();
          const prerendered = res.headers.get("x-prerendered");
          ok(`${label} for /blog/${post.slug} gets a FAQPage`, body.includes('"FAQPage"'),
             `${body.length} bytes, x-prerendered: ${prerendered ?? "none"}`);
          if (prerendered === "cache") {
            ok(`${label} was not served a cached snapshot`, false,
               "x-prerendered: cache, so this answer can predate the data behind it");
          }
        } catch (err) {
          ok(`${label} for /blog/${post.slug} is reachable`, false, err instanceof Error ? err.message : String(err));
        }
      }
    }
  }
}

console.log(fails === 0 ? "\nAll SEO content cases passed." : `\n${fails} failure(s)`);
process.exit(fails === 0 ? 0 : 1);
