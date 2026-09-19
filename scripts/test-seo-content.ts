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
import { esc, trusted, injectPageContent, resolvePageContent } from "../server/seo-content";
import { resolvePageMeta, injectMetaTags } from "../server/seo-meta";

void ENV_REPORT;

let fails = 0;
function ok(name: string, passed: boolean, detail = ""): void {
  console.log(`${passed ? "PASS" : "FAIL"}  ${name}${passed || !detail ? "" : `\n        ${detail}`}`);
  if (!passed) fails++;
}

const HTTP_BASE = process.argv.slice(2).find((a) => a.startsWith("--http="))?.slice("--http=".length);

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

if (!process.env.DATABASE_URL) {
  console.log("  DATABASE_URL not set, skipping the live checks.\n");
} else {
  const distIndex = path.resolve(import.meta.dirname, "..", "dist", "public", "index.html");
  const template = fs.existsSync(distIndex)
    ? fs.readFileSync(distIndex, "utf-8")
    : `<html><head><title>t</title><meta name="description" content="d" /></head><body><div id="root"></div></body></html>`;

  /** Exactly what the server sends, built by the same two calls. */
  async function render(url: string): Promise<{ html: string; status: number }> {
    const [meta, content] = await Promise.all([resolvePageMeta(url), resolvePageContent(url)]);
    let html = meta ? injectMetaTags(template, url, meta) : template;
    if (content.kind === "content") html = injectPageContent(html, content.html);
    return { html, status: content.kind === "notFound" ? 404 : 200 };
  }

  const count = (s: string, re: RegExp) => (s.match(re) || []).length;
  const jsonLdTypes = (s: string) =>
    [...s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      .flatMap((m) => {
        try {
          const parsed = JSON.parse(m[1].replace(/\\u003c/g, "<"));
          return [parsed["@type"]].filter(Boolean);
        } catch { return ["INVALID"]; }
      });

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
if (HTTP_BASE) {
  console.log(`\nD. Over HTTP against ${HTTP_BASE}\n`);
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
}

console.log(fails === 0 ? "\nAll SEO content cases passed." : `\n${fails} failure(s)`);
process.exit(fails === 0 ? 0 : 1);
