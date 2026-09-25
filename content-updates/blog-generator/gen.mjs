import { writeFileSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import {
  ARTICLES, SCHEDULE, LIVE, TOUR_SLUGS, DESTINATION_SLUGS, HOTEL_SLUGS,
  EXISTING_POST_SLUGS, RESERVED_KEYWORDS,
} from "./articles.mjs";

const OUT = "/home/user/iluxuryegypt-latest-june12/content-updates";

// Mirrors shared/post-categories.ts. A category outside this list is not a
// cosmetic problem: client/src/pages/blog.tsx filters on exact string equality,
// so an unrecognised value makes the post appear under no filter at all.
const POST_CATEGORIES = [
  "Culture & History", "Travel Tips", "Destinations",
  "Food & Culture", "Travel Planning", "Responsible Travel",
];

const BANNED_PHRASES = [
  "delve into", "it's worth noting", "it is worth noting", "in conclusion",
  "nestled", "boasts", "a testament to", "unforgettable", "breathtaking",
  "hidden gem", "look no further", "when it comes to", "rich tapestry",
  "dive into", "embark on a journey", "at the end of the day",
];

// FAQ ids are derived from the slug and the question rather than generated
// fresh each run. A random id per run rewrote every id in every file on every
// regeneration, which buried the real change in the diff and, because the
// upsert always assigns faqs, silently replaced the ids in the live rows too.
// Same question, same id, forever.
function faqId(slug, question) {
  const h = createHash("sha1").update(`${slug}|${question}`).digest("hex");
  return [h.slice(0, 8), h.slice(8, 12), "5" + h.slice(13, 16),
          ((parseInt(h.slice(16, 17), 16) & 0x3) | 0x8).toString(16) + h.slice(17, 20),
          h.slice(20, 32)].join("-");
}

const pg = (s) => `'${String(s).replace(/'/g, "''")}'`;
const strip = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const words = (text) => text.split(/\s+/).filter(Boolean);
const countOf = (haystack, needle) =>
  (haystack.toLowerCase().match(new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;

/**
 * Phrases the home page targets. No article may use one, anywhere, because an
 * article that ranks for them takes the traffic from the page built to convert
 * it. Checked against every article rather than listed per slug: the
 * commercial rewrites are the ones at risk, and any of them could drift into
 * these without anybody noticing.
 */
/**
 * Hosts an article may link out to. Government and public health sources only.
 *
 * The visa, safety and vaccination articles summarise rules that change and
 * that this business does not set. Each one has to point at the authority, so
 * a reader can check the current position rather than trust a travel company's
 * summary of it, and so the page carries the signal that it knows where its
 * own facts come from.
 */
// Mirrors shared/year-placeholder.ts. The generator cannot import a .ts file,
// and one constant duplicated with a pointer to its source beats a build step.
const YEAR_PLACEHOLDER = "{year}";

const OFFICIAL_SOURCES = [
  "travel.state.gov",
  "visa2.egypt.gov.eg",
  "wwwnc.cdc.gov",
];

const HOMEPAGE_KEYWORDS = [
  "egypt private tours",
  "egypt luxury private tours",
  "luxury egypt vacation packages",
  "egypt private tour guide",
];

// "luxury dahabiya nile cruise" used to be the fifth entry above. The owner
// moved it off the homepage and onto /blog/dahabiya-nile-cruise, which is a
// 720 a month head term the homepage was never going to rank for while also
// selling five other things. Only that article may use the phrase, so it is
// reserved TO a slug rather than FROM every slug.
const KEYWORDS_OWNED_BY_ONE_ARTICLE = {
  "luxury dahabiya nile cruise": "dahabiya-nile-cruise",
};

// ---------------------------------------------------------------------------
// Page furniture
// ---------------------------------------------------------------------------
// An article written from October 2026 onwards supplies `takeaways` and
// `related` and gets its table of contents, its key takeaways box, its author
// line and its related posts block BUILT here rather than typed into the body.
//
// Built rather than written because three of the four have to agree with
// something else and a human cannot be relied on to keep them agreeing: the
// contents list has to name exactly the H2s that exist, in order, with ids
// that match; the author line has to carry the same date as dateModified; and
// the related block has to stay inside the article's own cluster. An article
// without `takeaways` is one of the 38 written before this existed and is
// passed through untouched, so none of those files change.

// Paths that 301 somewhere else. Parsed out of server/path-redirects.ts and
// server/tour-redirects.ts rather than copied, because a copy drifts and the
// drift is invisible: a link to an old path still works, it just spends a
// redirect on every reader and every crawl, and nothing ever complains.
// Paths that 301 somewhere else, mirroring resolveRedirect in
// server/path-redirects.ts. Parsed from the source rather than copied.
//
// The three tables do NOT behave the same way and conflating them produces a
// false positive that is worse than no check: CHILD_PATH_REDIRECTS sends
// /luxury-hotels-in-egypt/<slug> to /hotel/<slug> while leaving
// /luxury-hotels-in-egypt itself alone, so treating its keys as redirected
// paths flagged the hotels listing page, which is the canonical URL every
// hotels article is supposed to link.
const { REDIRECT_EXACT, REDIRECT_PREFIX, REDIRECT_CHILD_ONLY } = (() => {
  const root = "/home/user/iluxuryegypt-latest-june12/server";
  const src = readFileSync(`${root}/path-redirects.ts`, "utf8");
  const keys = (block) => {
    const m = src.match(new RegExp(block + "[^=]*= \\{([\\s\\S]*?)\\n\\};"));
    return m ? [...m[1].matchAll(/"([^"]+)":\s*"[^"]+"/g)].map((e) => e[1]) : [];
  };
  const exact = new Set(keys("EXACT_PATH_REDIRECTS"));
  const tours = readFileSync(`${root}/tour-redirects.ts`, "utf8");
  for (const e of tours.matchAll(/^\s+"([a-z0-9-]+)":\s*"[a-z0-9-]+",/gm)) exact.add(`/${e[1]}`);
  return {
    REDIRECT_EXACT: exact,
    // The prefix itself redirects, and so does everything under it.
    REDIRECT_PREFIX: keys("PATH_PREFIX_REDIRECTS"),
    // Only the children redirect. The parent is a real page.
    REDIRECT_CHILD_ONLY: keys("CHILD_PATH_REDIRECTS"),
  };
})();

/** Mirrors resolveRedirect: true when this path would 301. */
function redirects(path) {
  const bare = path.split("?")[0].replace(/\/+$/, "") || "/";
  if (REDIRECT_EXACT.has(bare)) return true;
  for (const parent of REDIRECT_CHILD_ONLY) if (bare.startsWith(`${parent}/`)) return true;
  for (const prefix of REDIRECT_PREFIX) if (bare === prefix || bare.startsWith(`${prefix}/`)) return true;
  return false;
}

const AUTHOR_NAME = "Hamdy Haggag";
const AUTHOR_BIO =
  "Written by Hamdy Haggag, who has planned and run private journeys in Egypt " +
  "for more than a decade and still takes the first call for every itinerary.";

/** A stable, readable id for an H2, unique within its own page. */
function headingId(text, taken) {
  const base = strip(text).toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "section";
  let id = base, n = 2;
  while (taken.has(id)) id = `${base}-${n++}`;
  taken.add(id);
  return id;
}

/**
 * The body as it is actually stored: prose plus furniture.
 *
 * Returns the prose separately so the word range is measured on what the
 * author wrote plus the takeaways, and not on a contents list and a byline.
 */
function renderBody(a, publishDate) {
  if (!a.takeaways) return { body: a.body, prose: a.body, toc: [] };

  const taken = new Set();
  const toc = [];
  const withIds = a.body.replace(/<h2>(.*?)<\/h2>/g, (_m, inner) => {
    const id = headingId(inner, taken);
    toc.push({ id, text: strip(inner) });
    return `<h2 id="${id}">${inner}</h2>`;
  });

  const date = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Cairo", day: "numeric", month: "long", year: "numeric",
  }).format(new Date(publishDate));

  // The byline carries the same date as dateModified in the schema, which the
  // wave SQL sets to the publication date rather than to the moment the row
  // was inserted. A visible date that disagrees with the one in the JSON-LD is
  // the kind of mismatch that gets a rich result dropped.
  const byline =
    `<p class="post-byline">By <span>${AUTHOR_NAME}</span>. ` +
    `Last updated: <time datetime="${String(publishDate).slice(0, 10)}">${date}</time>.</p>`;

  const takeaways =
    `<aside class="key-takeaways" aria-label="Key takeaways">` +
    `<h2 id="key-takeaways">Key takeaways</h2><ul>` +
    a.takeaways.map((t) => `<li>${t}</li>`).join("") +
    `</ul></aside>`;

  const contents =
    `<nav class="toc" aria-label="On this page"><p>On this page</p><ol>` +
    toc.map((h) => `<li><a href="#${h.id}">${h.text}</a></li>`).join("") +
    `</ol></nav>`;

  const related =
    `<aside class="related-posts" aria-label="Related reading">` +
    `<h2 id="related-reading">Related reading</h2><ul>` +
    a.related.map((r) => `<li><a href="${r.href}">${r.anchor}</a></li>`).join("") +
    `</ul></aside>`;

  const bio = `<p class="author-bio">${AUTHOR_BIO}</p>`;

  // Order matters. The 40 to 60 word answer is the first thing after the h1,
  // because that is what a featured snippet lifts; the takeaways sit under it;
  // the contents list comes after both so a phone reader meets the answer
  // before a navigation block.
  const [answer, ...rest] = withIds.trim().split(/\n\n/);
  const body = [byline, answer, takeaways, contents, ...rest, related, bio].join("\n\n");

  // The takeaways are content and count toward the length. The byline, the
  // contents list, the related block and the bio are furniture and do not.
  return { body, prose: `${a.body}\n\n${takeaways}`, toc };
}

const problems = [];
const notes = [];
const report = [];
const placeholders = [];

// Rendered ONCE, here, and read by both the validation loop below and the SQL
// emitter further down.
//
// It was briefly rendered inside the validation loop only. Everything passed
// and nothing reached the database: the guards checked a body with a contents
// list, a takeaways box and a byline in it, and the SQL wrote the raw prose.
// The generator was checking one string and shipping another, which is the
// worst shape a bug like this can have, because the report says it worked.
const RENDERED = ARTICLES.map((a, index) =>
  renderBody(a, SCHEDULE[index] === LIVE ? "2026-09-24T09:00:00+03:00" : SCHEDULE[index]));
const STORED = ARTICLES.map((a, i) => ({ ...a, body: RENDERED[i].body }));

STORED.forEach((a, index) => {
  const L = a.slug;
  // Validated AS STORED, furniture included, so a link or a keyword in the
  // takeaways counts exactly as one in a paragraph. The word range is the one
  // exception and uses the prose, so a contents list cannot pad an article.
  const text = strip(RENDERED[index].prose);
  const lower = text.toLowerCase();
  const wordCount = words(text).length;
  const first100 = words(text).slice(0, 100).join(" ").toLowerCase();

  // ---- category ----
  if (!POST_CATEGORIES.includes(a.category))
    problems.push(`${L}: category "${a.category}" is not one of the site's categories, so the post would appear under no blog filter`);

  // ---- SEO placement ----
  // Lengths are measured on what a reader sees, not on what is stored. A title
  // holding {year} is six characters in the database and four on the page, and
  // it is the page that Google truncates. See shared/year-placeholder.ts.
  const rendered = (t) => String(t ?? "").split(YEAR_PLACEHOLDER).join("2026");
  const renderedTitle = rendered(a.metaTitle);
  if (renderedTitle.length > 60) problems.push(`${L}: meta_title ${renderedTitle.length} chars rendered (max 60)`);

  // A hardcoded year is stale on 1 January and nobody remembers. If a title
  // wants a year it uses the placeholder.
  for (const [field, value] of [["meta_title", a.metaTitle], ["title_en", a.titleEn], ["meta_description", a.metaDescription]])
    if (/\b20\d{2}\b/.test(value))
      problems.push(`${L}: ${field} hardcodes a year. Use ${YEAR_PLACEHOLDER}, which is filled in at render time.`);
  if (!renderedTitle.toLowerCase().includes(a.primary)) problems.push(`${L}: primary keyword missing from meta_title`);
  const renderedDescription = rendered(a.metaDescription);
  if (renderedDescription.length < 150 || renderedDescription.length > 160)
    problems.push(`${L}: meta_description ${renderedDescription.length} chars rendered (want 150-160)`);
  if (!renderedDescription.toLowerCase().includes(a.primary)) problems.push(`${L}: primary keyword missing from meta_description`);
  if (!a.titleEn.toLowerCase().includes(a.primary)) problems.push(`${L}: primary keyword missing from the H1 (title_en)`);
  if (!first100.includes(a.primary)) problems.push(`${L}: primary keyword missing from the first 100 words`);
  // Word by word rather than as one joined string. The point of the rule is
  // that the URL carries the words of the keyword, not that it carries them in
  // the keyword's order: /blog/egypt-travel-insurance and the keyword "travel
  // insurance egypt" are the same three words and rank the same. Checking the
  // joined string would have failed that slug, and the only way to satisfy it
  // would have been to rename a URL that is already published and indexed.
  // The exact phrase, in the same word order, with hyphens read as spaces.
  //
  // This was briefly relaxed to a word-set test so that a slug could carry the
  // keyword's words in any order and drop the stopwords. That is not the rule:
  // /blog/egypt-travel-insurance and the keyword "travel insurance egypt" are
  // not the same phrase, and treating them as interchangeable let a slug and a
  // primary keyword disagree in the one place a reader and a crawler both see
  // them together. Hyphens still read as spaces, because "tailor-made egypt
  // tours" is spelled with three hyphens in a URL and one in the phrase.
  const slugPhrase = a.slug.replace(/-/g, " ");
  if (!slugPhrase.includes(a.primary.replace(/-/g, " ")))
    problems.push(`${L}: primary keyword "${a.primary}" is not in the slug as an exact phrase (slug reads "${slugPhrase}")`);

  const h2s = [...a.body.matchAll(/<h2[^>]*>(.*?)<\/h2>/g)].map((m) => strip(m[1]));
  if (!h2s.some((h) => h.toLowerCase().includes(a.primary)))
    problems.push(`${L}: no H2 carries the primary keyword`);

  // ---- density ----
  const primaryCount = countOf(lower, a.primary);
  if (primaryCount < 3 || primaryCount > 5) problems.push(`${L}: primary keyword appears ${primaryCount} times (want 3-5)`);
  for (const sec of a.secondary) {
    // Counted so a longer secondary containing a shorter one is not double
    // charged, e.g. "dahshur pyramids" inside "dahshur pyramids egypt".
    let n = countOf(lower, sec);
    if (sec !== a.primary && a.primary.includes(sec)) n -= primaryCount;
    for (const other of a.secondary) if (other !== sec && other.includes(sec)) n -= countOf(lower, other);
    if (n < 1 || n > 2) problems.push(`${L}: secondary "${sec}" appears ${n} times (want 1-2)`);
  }

  // ---- length and shape ----
  const [lo, hi] = a.wordRange;
  if (wordCount < lo || wordCount > hi) problems.push(`${L}: ${wordCount} words (want ${lo}-${hi})`);
  if (h2s.length === 0) problems.push(`${L}: no H2 headings`);
  const perH2 = wordCount / h2s.length;
  if (perH2 > 320) problems.push(`${L}: ${perH2.toFixed(0)} words per H2 (want under about 300)`);
  if (/<h2[^>]*>\s*(Overview|Introduction|Conclusion|Summary)\s*<\/h2>/i.test(a.body))
    problems.push(`${L}: has a generic H2 (Overview/Introduction/Conclusion/Summary)`);

  // Paragraphs of five or more sentences read as a wall on a phone.
  [...a.body.matchAll(/<p>(.*?)<\/p>/gs)].forEach((m, i) => {
    const sentences = strip(m[1]).split(/(?<=[.!?])\s+/).filter((x) => x.length > 2);
    if (sentences.length > 4) problems.push(`${L}: paragraph ${i + 1} has ${sentences.length} sentences (max 4)`);
  });

  // Uniform sentence length is the clearest tell of generated prose.
  const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => words(s).length > 1);
  const lengths = sentences.map((s) => words(s).length);
  const mean = lengths.reduce((x, y) => x + y, 0) / lengths.length;
  const sd = Math.sqrt(lengths.reduce((acc, n) => acc + (n - mean) ** 2, 0) / lengths.length);
  if (sd < 6) problems.push(`${L}: sentence length standard deviation ${sd.toFixed(1)} (want 6 or more, vary the rhythm)`);

  // ---- style bans ----
  if (/[–—]/.test(a.body + a.metaTitle + a.metaDescription + a.excerpt + a.titleEn))
    problems.push(`${L}: contains an em or en dash`);
  for (const phrase of BANNED_PHRASES)
    if (lower.includes(phrase)) problems.push(`${L}: uses the banned phrase "${phrase}"`);
  for (const [phrase, owner] of Object.entries(KEYWORDS_OWNED_BY_ONE_ARTICLE)) {
    if (L === owner) continue;
    if (countOf(lower, phrase) > 0 || a.metaTitle.toLowerCase().includes(phrase) || a.titleEn.toLowerCase().includes(phrase))
      problems.push(`${L}: uses "${phrase}", which belongs to /blog/${owner}`);
  }

  for (const reserved of [...HOMEPAGE_KEYWORDS, ...(RESERVED_KEYWORDS[L] ?? [])]) {
    // A reserved phrase that is a substring of this article's own primary
    // keyword is unavoidable: "black and white desert egypt" contains "white
    // desert egypt". Only standalone uses count, so those are subtracted.
    let hits = countOf(lower, reserved);
    if (a.primary.includes(reserved) && a.primary !== reserved) hits -= primaryCount;
    // Same for a secondary that swallows it, e.g. "camping white desert egypt".
    for (const sec of a.secondary)
      if (sec !== reserved && sec.includes(reserved) && !a.primary.includes(sec)) hits -= countOf(lower, sec);
    if (hits > 0) problems.push(`${L}: uses "${reserved}" ${hits} time(s) standalone, and it is reserved for another page`);
  }

  // At most two promotional sentences per article.
  const promo = sentences.filter((s) => /\bour\b/i.test(s) && /itinerary|tour|package/i.test(s));
  if (promo.length > 2) problems.push(`${L}: ${promo.length} promotional sentences (max 2)`);

  // ---- internal links ----
  const allHrefs = [...a.body.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);

  // Official sources, and only these. An article about visas or vaccinations
  // that does not link the government page it is summarising is asking to be
  // trusted on a subject where the reader should check for themselves, and the
  // rule is a rule so the list cannot quietly grow into affiliate links.
  const external = allHrefs.filter((h) => /^https?:\/\//.test(h));
  for (const href of external) {
    const host = href.replace(/^https?:\/\//, "").split("/")[0].toLowerCase();
    if (!OFFICIAL_SOURCES.includes(host))
      problems.push(`${L}: links out to ${host}, which is not one of the official sources this project links to`);
  }

  // Internal links are what the cap and the shape rules are about.
  //
  // The related posts block is counted separately from the four link cap, and
  // that is a deliberate reading of two rules that would otherwise contradict
  // each other. The cap exists so that links inside prose stay
  // recommendations rather than a menu; a related reading block at the foot of
  // the article is site furniture, the same kind of thing as the contents list
  // above it, and every article carries an identical one. Counting it against
  // the editorial budget would mean an article could carry one link in its
  // actual text.
  const relatedBlock = a.body.match(/<aside class="related-posts"[\s\S]*?<\/aside>/)?.[0] ?? "";
  const relatedHrefs = [...relatedBlock.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  //
  // /hotel/<slug> links are exempt for the same reason. An article called
  // "where to stay in Cairo" that names four hotels has to link all four, and
  // capping that at one would make the article worse rather than tidier. They
  // are references to the site's own records rather than recommendations to
  // read something else, so they get their own ceiling below.
  const hrefs = allHrefs
    .filter((h) => !/^https?:\/\//.test(h))
    .filter((h) => !h.startsWith("#"))
    .filter((h) => !/^\/hotel\//.test(h))
    .filter((h, i, all) => {
      // Remove exactly as many occurrences as the related block contributes,
      // so a prose link to the same target still counts.
      const before = all.slice(0, i).filter((x) => x === h).length;
      return before >= relatedHrefs.filter((x) => x === h).length;
    });
  if (hrefs.length < 3) problems.push(`${L}: only ${hrefs.length} internal prose links (min 3)`);
  if (hrefs.length > 4) problems.push(`${L}: ${hrefs.length} internal prose links (max 4)`);

  // Six is a lot of hotels to name in one article and it is the point at which
  // a page stops being advice and becomes a directory.
  const hotelLinks = [...new Set(allHrefs.filter((h) => /^\/hotel\//.test(h)))];
  if (hotelLinks.length > 6)
    problems.push(`${L}: links to ${hotelLinks.length} hotels (max 6). Past that it is a directory rather than advice.`);

  // The rule that matters most: a tour under the category path is a 404.
  for (const href of hrefs) {
    if (/^\/luxury-egypt-tour-packages\/[^/]+$/.test(href)) {
      const sub = href.split("/")[2];
      if (TOUR_SLUGS.has(sub)) problems.push(`${L}: ${href} is a TOUR under the category path and will 404`);
    }
    if (!href.startsWith("/")) problems.push(`${L}: ${href} is not a site relative link`);

  }

  // Hotels live at /hotel/<slug>, never under the listing page, and only
  // hotels that exist. Checked against EVERY internal link rather than the
  // prose subset: /hotel/ links are exempt from the editorial cap, which means
  // they are filtered out of that list, which briefly meant these two checks
  // looped over a list the links could never be in and silently passed.
  for (const href of allHrefs.filter((h) => h.startsWith("/"))) {
    if (/^\/luxury-hotels-in-egypt\/[^/]+$/.test(href))
      problems.push(`${L}: ${href} puts a hotel under the listing page. Hotels are /hotel/<slug>.`);
    const hotel = href.match(/^\/hotel\/([^/]+)$/)?.[1];
    if (hotel && !HOTEL_SLUGS.has(hotel))
      problems.push(`${L}: ${href} is not a hotel in the hotels table. See HOTEL_SLUGS in articles.mjs.`);
  }

  // Never link at a path that redirects. It works, and it costs the reader and
  // the crawler a hop for nothing, and it leaks a little of whatever the link
  // was passing on.
  for (const href of allHrefs.filter((h) => h.startsWith("/"))) {
    if (redirects(href))
      problems.push(`${L}: links to ${href}, which 301s somewhere else. Link the final URL.`);
  }

  const tourLinks = hrefs.filter((h) => TOUR_SLUGS.has(h.replace(/^\//, "")));
  const destLinks = hrefs.filter((h) => h.startsWith("/egypt-travel-guide/") && DESTINATION_SLUGS.has(h.split("/")[2]));
  // Every internal blog link, related block included. The cap does not count
  // the related block, but "would this link 404 on the day this article goes
  // live" certainly does: a related reading list pointing at a sibling that
  // publishes nine days later is three dead links in the footer of the page.
  const postLinks = [...new Set(
    allHrefs.filter((h) => h.startsWith("/blog/"))
  )];
  if (tourLinks.length === 0) problems.push(`${L}: no link to a tour`);
  if (destLinks.length === 0) problems.push(`${L}: no link to a destination page`);
  // The first article to publish has no earlier sibling to link to, and a
  // forward link would 404 between its date and the target's. That is why a1
  // carried a {{RELATED_POST_SLUG}} token for so long. Exempt it and say so,
  // rather than papering over a broken link.
  const publishesFirst = SCHEDULE[index] !== LIVE
    && SCHEDULE.every((iso, i) => i === index || iso === LIVE || Date.parse(iso) >= Date.parse(SCHEDULE[index]));
  if (postLinks.length === 0 && !publishesFirst) problems.push(`${L}: no link to another article`);
  if (postLinks.length === 0 && publishesFirst)
    notes.push(`${L}: publishes first, so it links to no other article. Add a backlink once a sibling is live.`);

  for (const href of hrefs) {
    if (href.startsWith("/egypt-travel-guide/") && !DESTINATION_SLUGS.has(href.split("/")[2]))
      problems.push(`${L}: ${href} is not a known destination slug`);
  }

  // A link to a sibling that publishes LATER would 404 until that date.
  //
  // Compared by date rather than by position in ARTICLES. Position used to be
  // a safe proxy because SCHEDULE was ascending, and it stopped being one the
  // moment a later batch was appended with earlier dates: an article added at
  // the end can easily publish before one in the middle, and an index compare
  // would wave through a link that 404s for a week.
  // A rewrite of a published row goes out the moment its SQL is run, so its
  // effective publish moment is now, not the end of time. Infinity was wrong
  // here: it let a rewrite shipping today link to a batch article dated three
  // weeks out, and that link 404s for three weeks. Anything already live is
  // still linkable from anywhere, which is what EXISTING_POST_SLUGS covers.
  const mine = SCHEDULE[index] === LIVE ? Date.now() : Date.parse(SCHEDULE[index]);
  for (const href of postLinks) {
    const target = href.replace("/blog/", "");
    if (target.includes("{{")) continue;
    if (EXISTING_POST_SLUGS.has(target)) continue; // already live, cannot 404
    const targetIndex = STORED.findIndex((x) => x.slug === target);
    if (targetIndex === -1) problems.push(`${L}: links to /blog/${target}, which is neither in this batch nor a known live article`);
    else if (SCHEDULE[targetIndex] !== LIVE && Date.parse(SCHEDULE[targetIndex]) >= mine)
      problems.push(`${L}: links to /blog/${target}, which publishes ${SCHEDULE[targetIndex]}, at or after this article's ${SCHEDULE[index] === LIVE ? "immediate publication" : SCHEDULE[index]}, so the link would 404 on publication`);
  }

  // Descriptive anchors, not repeated keyword.
  // Editorial anchors only. A contents list entry has to repeat its heading
  // word for word, keyword included, or it is describing somewhere else; and a
  // page full of "#jump" links is not what the repeated anchor rule is about.
  const editorialBody = a.body
    .replace(/<nav class="toc"[\s\S]*?<\/nav>/g, "")
    .replace(/href="#[^"]*"/g, 'href="#"');
  const anchors = [...editorialBody.matchAll(/<a href="[^"]+">([^<]+)<\/a>/g)].map((m) => m[1].toLowerCase());
  void external;
  const keywordAnchors = anchors.filter((x) => x.includes(a.primary));
  if (keywordAnchors.length > 0) problems.push(`${L}: ${keywordAnchors.length} anchor(s) repeat the primary keyword verbatim`);
  if (new Set(anchors).size !== anchors.length) problems.push(`${L}: duplicate anchor text`);

  // ---- FAQs, written for AI answer engines ----
  // These are the rules that decide whether an answer can be lifted out of the
  // page and quoted on its own by ChatGPT, Perplexity or an AI Overview.
  if (a.faqs.length < 7 || a.faqs.length > 8) problems.push(`${L}: ${a.faqs.length} FAQs (want 7-8)`);

  // Comparison questions are the shape AI answers quote most often.
  const comparative = a.faqs.filter((f) => /\b(better|best|difference|vs|versus|worth|compare|instead)\b/i.test(f.q));
  if (comparative.length < 2) problems.push(`${L}: only ${comparative.length} comparison question(s) (want at least 2)`);

  const brandMentions = a.faqs.filter((f) => /iluxury|i\.luxury/i.test(f.a));
  if (brandMentions.length > 1) problems.push(`${L}: brand named in ${brandMentions.length} FAQ answers (max 1)`);

  const seenQ = new Set();
  a.faqs.forEach((f, i) => {
    const N = `${L}: FAQ ${i + 1}`;
    if (!f.q.trim() || !f.a.trim()) problems.push(`${N} has an empty half`);
    if (/[–—]/.test(f.q + f.a)) problems.push(`${N} contains an em or en dash`);

    // 40 to 80 words: shorter carries no information, longer does not get quoted.
    const n = words(f.a).length;
    if (n < 40 || n > 80) problems.push(`${N} answer is ${n} words (want 40-80)`);

    // The answer has to open WITH the answer. A first sentence that hedges or
    // restates the question buries it where an answer engine will not find it.
    const first = (f.a.split(/(?<=[.!?])\s+/)[0] ?? "").trim();
    if (/^(it depends|there are|this depends|generally|in general|typically|well,|that is a|the answer)/i.test(first))
      problems.push(`${N} answer opens with a hedge rather than the answer: "${first.slice(0, 50)}"`);
    if (words(first).length > 32) problems.push(`${N} first sentence is ${words(first).length} words, too long to be the direct answer`);

    // Self contained: an answer that points at the rest of the page is useless
    // once it has been lifted off the page.
    if (/\b(as (mentioned|noted|described) above|see above|as we said|in the section above|this article)\b/i.test(f.a))
      problems.push(`${N} answer refers to the rest of the page and will not stand alone`);

    // Something concrete. An answer engine prefers a number to an adjective.
    if (!/\d/.test(f.a)) problems.push(`${N} answer contains no specific number`);

    if (!/\?$/.test(f.q.trim())) problems.push(`${N} question does not end in a question mark`);
    const key = f.q.trim().toLowerCase();
    if (seenQ.has(key)) problems.push(`${N} duplicates an earlier question`);
    seenQ.add(key);
  });

  // ---- structure, for the articles that carry furniture ----
  if (a.takeaways) {
    // Every H2 needs an id and the contents list has to name all of them, in
    // order. A contents list that has drifted from the headings is worse than
    // none: it sends a reader to an anchor that is not there.
    const ids = [...a.body.matchAll(/<h2 id="([^"]+)">/g)].map((m) => m[1]);
    const headings = [...a.body.matchAll(/<h2[^>]*>/g)].length;
    if (ids.length !== headings)
      problems.push(`${L}: ${headings} H2s but ${ids.length} have an id`);
    if (new Set(ids).size !== ids.length)
      problems.push(`${L}: duplicate H2 id, so a jump link is ambiguous`);

    const jumps = [...(a.body.match(/<nav class="toc"[\s\S]*?<\/nav>/)?.[0] ?? "")
      .matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
    if (jumps.length === 0) problems.push(`${L}: no table of contents`);
    const missing = jumps.filter((j) => !ids.includes(j));
    if (missing.length > 0)
      problems.push(`${L}: contents list points at ${missing.join(", ")}, which is not an H2 id`);
    // The takeaways box and the related block carry an H2 for the outline and
    // for screen readers, but neither is a place a reader jumps TO, so neither
    // belongs in the contents list.
    const FURNITURE_IDS = ["key-takeaways", "related-reading"];
    const unlisted = ids.filter((id) => !jumps.includes(id) && !FURNITURE_IDS.includes(id));
    if (unlisted.length > 0)
      problems.push(`${L}: H2s missing from the contents list: ${unlisted.join(", ")}`);

    if (a.takeaways.length < 3 || a.takeaways.length > 5)
      problems.push(`${L}: ${a.takeaways.length} key takeaways (want 3-5)`);
    for (const t of a.takeaways)
      if (words(strip(t)).length > 30) problems.push(`${L}: a takeaway is ${words(strip(t)).length} words, too long to be lifted`);

    if (!a.related || a.related.length !== 3)
      problems.push(`${L}: ${a.related?.length ?? 0} related posts (want exactly 3)`);
    for (const r of a.related ?? []) {
      if (r.href === `/blog/${L}`) problems.push(`${L}: related posts link to the article itself`);
      if (r.anchor.toLowerCase().includes(a.primary))
        problems.push(`${L}: related anchor "${r.anchor}" repeats the primary keyword verbatim`);
    }

    // One real table per article. Every one of these queries is list shaped
    // in some direction, and a list pretending to be a table is not the same
    // thing to a reader on a phone or to a crawler looking for a comparison.
    const tables = (a.body.match(/<table>/g) ?? []).length;
    if (tables < 1) problems.push(`${L}: no table. Every one of these queries has a comparison in it.`);
    if (tables > 2) problems.push(`${L}: ${tables} tables, which is a spreadsheet rather than an article`);
    if (tables > 0 && !/<thead>/.test(a.body))
      problems.push(`${L}: the table has no header row`);

    if (!/class="post-byline"/.test(a.body)) problems.push(`${L}: no visible author and updated line`);
    if (!/class="author-bio"/.test(a.body)) problems.push(`${L}: no author bio`);

    // The excerpt is what the blog index and the cards show, so it is a real
    // summary with a real length rather than the first sentence of the body.
    if (a.excerpt.length < 150 || a.excerpt.length > 160)
      problems.push(`${L}: excerpt ${a.excerpt.length} chars (want 150-160)`);
    if (a.body.trim().startsWith(a.excerpt.slice(0, 40)))
      problems.push(`${L}: excerpt is the opening of the body rather than a summary`);

    // Exactly one image alt carries the primary keyword, and the hero is it.
    if (!a.heroAlt.toLowerCase().includes(a.primary))
      problems.push(`${L}: the hero alt does not carry the primary keyword`);
  }

  // ---- placeholders ----
  for (const m of a.body.matchAll(/data-placeholder="([^"]+)">([^<]+)</g))
    placeholders.push({ slug: L, key: m[1], text: m[2] });
  for (const m of a.body.matchAll(/\{\{([A-Z_]+)\}\}/g))
    placeholders.push({ slug: L, key: m[1], text: "template token, must be replaced before publishing" });

  report.push({
    slug: L, words: wordCount, primary: primaryCount, h2: h2s.length,
    metaTitle: rendered(a.metaTitle).length, meta: rendered(a.metaDescription).length,
    faqs: a.faqs.length, links: hrefs.length, sd: sd.toFixed(1),
    scheduled: SCHEDULE[index],
    rewriteOf: a.rewriteOf ?? null,
  });
});

// Every article publishes at 9am Cairo. The offset written into the ISO string
// is easy to get wrong across a daylight saving boundary, and the result is a
// post that goes live an hour early for the rest of its life without anyone
// noticing, so the wall clock time is checked rather than the string.
const cairoTime = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Africa/Cairo", hour: "2-digit", minute: "2-digit", hour12: false,
});
// A rewrite carries the marker LIVE instead of a date. It is an edit to a row
// that is already published and already indexed, so it has no publish hour to
// get wrong and no slot in the schedule to collide with.
SCHEDULE.forEach((iso, i) => {
  if (iso === LIVE) return;
  const local = cairoTime.format(new Date(iso));
  if (local !== "09:00")
    problems.push(`${ARTICLES[i]?.slug ?? `schedule[${i}]`}: ${iso} is ${local} in Cairo, not 09:00. Check the UTC offset against Egyptian summer time.`);
});

// One article per day. Publishing two at once on a site this young is the
// pattern the spread out schedule exists to avoid, and it is easy to create by
// accident when a later batch is dated into the gaps of an earlier one.
const byDay = new Map();
SCHEDULE.forEach((iso, i) => {
  if (iso === LIVE) return;
  const day = iso.slice(0, 10);
  if (!byDay.has(day)) byDay.set(day, []);
  byDay.get(day).push(ARTICLES[i]?.slug ?? `schedule[${i}]`);
});
for (const [day, slugs] of byDay)
  if (slugs.length > 1) problems.push(`${day}: ${slugs.length} articles share this publish date (${slugs.join(", ")})`);

if (problems.length > 0) {
  console.error("GUARD FAILURES:\n  " + problems.join("\n  "));
  process.exit(1);
}

if (notes.length > 0) console.log("NOTES:\n  " + notes.join("\n  ") + "\n");

console.log("slug".padEnd(30), "words", "kw", "h2", "title", "meta", "faq", "links", "sd", " scheduled");
for (const r of report) {
  console.log(
    r.slug.padEnd(30), String(r.words).padStart(5), String(r.primary).padStart(2),
    String(r.h2).padStart(2), String(r.metaTitle).padStart(5), String(r.meta).padStart(4),
    String(r.faqs).padStart(3), String(r.links).padStart(5), String(r.sd).padStart(4),
    " " + r.scheduled
  );
}

// ---------------------------------------------------------------------------
// SQL
// ---------------------------------------------------------------------------
STORED.forEach((a, index) => {
  const faqJson = JSON.stringify(a.faqs.map((f) => ({ id: faqId(a.slug, f.q), question: f.q, answer: f.a })));
  const tags = `ARRAY[${a.tags.map(pg).join(", ")}]::text[]`;

  // "N of M" counts only the articles that ship as their own file. Counting
  // every article in ARTICLES would rewrite the header of all thirteen earlier
  // files every time a wave is added, for no change anyone asked for.
  const standalone = STORED.filter((x) => !x.wave).length;
  const sql = `-- ${a.titleEn}
-- Blog post ${index + 1} of ${standalone}. Primary keyword: ${a.primary}
--
-- Scheduled for ${SCHEDULE[index]} via posts.scheduled_at, so it stays out of
-- the blog list, the sitemap and the server rendered meta until that moment.
-- See shared/post-visibility.ts for the rule.
--
-- RUN THE MIGRATION FIRST (Admin > Settings > Run Migrations). This needs
-- posts.scheduled_at, posts.faqs and posts.schema_markup.
--
-- Only the English columns are filled. title_es/fr/jp and body_es/fr/jp are
-- deliberately left NULL rather than machine translated.
--
-- Images are NOT set here. scripts/fill-post-images.ts fetches them, checks
-- each candidate against the provider's own description, and writes
-- featured_image plus the in-body figures. Run it after this file.

BEGIN;

INSERT INTO posts (
  slug, title_en, body_en, excerpt, category, tags,
  focus_keyword, meta_title, meta_description,
  status, scheduled_at, faqs, schema_type
) VALUES (
  ${pg(a.slug)},
  ${pg(a.titleEn)},
  ${pg(a.body.trim())},
  ${pg(a.excerpt)},
  ${pg(a.category)},
  ${tags},
  ${pg(a.primary)},
  ${pg(a.metaTitle)},
  ${pg(a.metaDescription)},
  'published',
  ${pg(SCHEDULE[index])}::timestamptz,
  ${pg(faqJson)}::jsonb,
  -- The other SEO overrides stay NULL on purpose: canonical_url falls back to
  -- the page's own URL, robots to "index, follow", og_image to the hero. An
  -- empty string in any of them would defeat that fallback.
  'BlogPosting'
)
ON CONFLICT (slug) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  -- The body is NOT overwritten once images are in it.
  --
  -- This file used to assign EXCLUDED.body_en unconditionally, and re-running
  -- it after scripts/fill-post-images.ts deleted every <figure> that script had
  -- inserted. Silently, with the file reporting success. The CASE makes a
  -- re-run safe: a row that has already been illustrated keeps its body, and
  -- the verification below says which rows were kept so it is never a surprise.
  --
  -- To change the prose of a row that has figures, patch it surgically instead.
  -- See content-updates/blog-generator/README.md.
  body_en = CASE
    WHEN posts.body_en LIKE '%<figure%' THEN posts.body_en
    ELSE EXCLUDED.body_en
  END,
  excerpt = EXCLUDED.excerpt,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  focus_keyword = EXCLUDED.focus_keyword,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  status = EXCLUDED.status,
  scheduled_at = EXCLUDED.scheduled_at,
  faqs = EXCLUDED.faqs,
  schema_type = EXCLUDED.schema_type,
  updated_at = now();

COMMIT;

-- ---------------------------------------------------------------------------
-- Verification. Every "bad" column below must read 0.
-- ---------------------------------------------------------------------------

-- Not a failure. On a first run this reads "body written". On a re-run against
-- a row that already has images it reads "body kept, it has figures in it",
-- which is the guard above doing its job rather than something going wrong.
SELECT CASE
         WHEN body_en LIKE '%<figure%' THEN 'body kept, it has figures in it'
         ELSE 'body written from this file'
       END AS body_en_outcome,
       (length(body_en) - length(replace(body_en, '<figure', ''))) / 7 AS figures
FROM posts WHERE slug = ${pg(a.slug)};
SELECT slug,
       length(meta_title) AS title_len,
       length(meta_description) AS meta_len,
       jsonb_array_length(faqs) AS faq_count,
       array_length(regexp_split_to_array(regexp_replace(body_en, '<[^>]+>', ' ', 'g'), '\\s+'), 1) AS body_words,
       scheduled_at,
       schema_type,
       (SELECT count(*) FROM regexp_matches(body_en, ${pg(a.primary)}, 'gi')) AS primary_hits
FROM posts WHERE slug = ${pg(a.slug)};

SELECT 'seo lengths out of range' AS check, count(*) AS bad FROM posts
WHERE slug = ${pg(a.slug)} AND (length(meta_title) > 60 OR length(meta_description) NOT BETWEEN 150 AND 160);

SELECT 'faq count out of range' AS check, count(*) AS bad FROM posts
WHERE slug = ${pg(a.slug)} AND jsonb_array_length(faqs) NOT BETWEEN 7 AND 8;

-- Answers are written to be quoted on their own by an AI answer engine, which
-- means 40 to 80 words each. Outside that they are either empty or too long.
SELECT 'faq answers outside 40-80 words' AS check, count(*) AS bad
FROM posts p, jsonb_array_elements(p.faqs) f
WHERE p.slug = ${pg(a.slug)}
  AND array_length(regexp_split_to_array(trim(f->>'answer'), '\\s+'), 1) NOT BETWEEN 40 AND 80;

-- The SEO overrides must be NULL, not empty strings, or the fallbacks break.
SELECT 'seo overrides stored as empty strings' AS check, count(*) AS bad FROM posts
WHERE slug = ${pg(a.slug)}
  AND (canonical_url = '' OR robots = '' OR og_image = '' OR schema_type = '' OR featured_image_alt = '');

SELECT 'faq entries missing id, question or answer' AS check, count(*) AS bad
FROM posts p, jsonb_array_elements(p.faqs) f
WHERE p.slug = ${pg(a.slug)}
  AND (coalesce(f->>'id','') = '' OR coalesce(f->>'question','') = '' OR coalesce(f->>'answer','') = '');

SELECT 'em or en dash present' AS check, count(*) AS bad FROM posts
WHERE slug = ${pg(a.slug)}
  AND (body_en ~ '[\\u2013\\u2014]' OR meta_title ~ '[\\u2013\\u2014]' OR meta_description ~ '[\\u2013\\u2014]' OR title_en ~ '[\\u2013\\u2014]');

-- Tour links must sit at the site root. Anything under the category path 404s.
SELECT 'tour links under /luxury-egypt-tour-packages/' AS check, count(*) AS bad FROM posts
WHERE slug = ${pg(a.slug)} AND body_en ~ 'href="/luxury-egypt-tour-packages/[^"]';

SELECT 'root-relative internal links' AS check,
       (SELECT count(*) FROM regexp_matches(body_en, 'href="/[^"]+"', 'g')) AS good,
       (SELECT count(*) FROM regexp_matches(body_en, 'href="(?!/)[^"]+"', 'g')) AS bad
FROM posts WHERE slug = ${pg(a.slug)};

SELECT 'unfilled placeholders' AS check,
       (SELECT count(*) FROM regexp_matches(body_en, 'data-placeholder=', 'g'))
     + (SELECT count(*) FROM regexp_matches(body_en, '\\{\\{[A-Z_]+\\}\\}', 'g')) AS remaining
FROM posts WHERE slug = ${pg(a.slug)};

SELECT 'other language columns left empty' AS check, count(*) AS bad FROM posts
WHERE slug = ${pg(a.slug)}
  AND (title_es IS NOT NULL OR title_fr IS NOT NULL OR title_jp IS NOT NULL
       OR body_es IS NOT NULL OR body_fr IS NOT NULL OR body_jp IS NOT NULL);
`;
  // Articles that belong to a wave ship in one grouped file instead, written
  // below. Two files carrying the same row would both be correct and both be
  // safe to run, and someone would still have to work out which one to run.
  if (!a.wave) writeFileSync(`${OUT}/blog-${String(index + 1).padStart(2, "0")}-${a.slug}.sql`, sql);
});

// ---------------------------------------------------------------------------
// Wave files
// ---------------------------------------------------------------------------
// A batch written and loaded in one go, rather than one file per article. The
// row shape is the same as above with one addition: published_at, the date the
// article presents itself as written on. scheduled_at alone decides visibility
// (shared/post-visibility.ts), but seo-meta.ts reads published_at for
// datePublished in the BlogPosting, and without it an article scheduled for
// December would tell a crawler it was written on the day the row was created.
const WAVES = [...new Set(STORED.map((a) => a.wave).filter(Boolean))];

for (const wave of WAVES) {
  const members = STORED
    .map((a, index) => ({ a, index }))
    .filter(({ a }) => a.wave === wave);

  const slugList = members.map(({ a }) => pg(a.slug)).join(", ");
  // Old and new together, for the preview and for the "nothing left behind"
  // check. On a rewrite that renames a slug, the row to look at before the run
  // is under the old name and after it under the new one.
  const allSlugList = [...new Set(members.flatMap(({ a }) => [a.slug, a.rewriteOf].filter(Boolean)))]
    .map(pg).join(", ");

  // A rewrite wave updates rows that are already published and already indexed
  // rather than inserting new ones. published_at is never touched: the article
  // keeps the date it was first published, which is what its BlogPosting has
  // been telling crawlers all along. updated_at carries the rewrite.
  const isRewrite = members.every(({ a }) => a.rewriteOf);
  // Rewrites that also change slug. Was hardcoded as "six", which was the
  // count for the whole sixteen article programme and wrong for every wave.
  const renamed = members.filter(({ a }) => a.rewriteOf && a.rewriteOf !== a.slug);
  if (!isRewrite && members.some(({ a }) => a.rewriteOf))
    problems.push(`wave "${wave}" mixes rewrites and new articles, which need different SQL`);

  const updates = members.map(({ a }) => {
    const faqJson = JSON.stringify(a.faqs.map((f) => ({ id: faqId(a.slug, f.q), question: f.q, answer: f.a })));
    const slugs = a.rewriteOf === a.slug ? [a.slug] : [a.rewriteOf, a.slug];
    return `-- ${a.rewriteOf === a.slug ? a.slug : `${a.rewriteOf} becomes ${a.slug}`}
UPDATE posts SET
  slug = ${pg(a.slug)},
  title_en = ${pg(a.titleEn)},
  body_en = ${pg(a.body.trim())},
  excerpt = ${pg(a.excerpt)},
  category = ${pg(a.category)},
  tags = ARRAY[${a.tags.map(pg).join(", ")}]::text[],
  focus_keyword = ${pg(a.primary)},
  meta_title = ${pg(a.metaTitle)},
  meta_description = ${pg(a.metaDescription)},
  faqs = ${pg(faqJson)}::jsonb,
  schema_type = 'BlogPosting',
  status = 'published',
  updated_at = now()
-- Both slugs, so a second run finds the row it renamed on the first.
WHERE slug IN (${slugs.map(pg).join(", ")});`;
  }).join("\n\n");

  const rows = members.map(({ a, index }) => {
    const faqJson = JSON.stringify(a.faqs.map((f) => ({ id: faqId(a.slug, f.q), question: f.q, answer: f.a })));
    return `(
  ${pg(a.slug)},
  ${pg(a.titleEn)},
  ${pg(a.body.trim())},
  ${pg(a.excerpt)},
  ${pg(a.category)},
  ARRAY[${a.tags.map(pg).join(", ")}]::text[],
  ${pg(a.primary)},
  ${pg(a.metaTitle)},
  ${pg(a.metaDescription)},
  'published',
  ${pg(SCHEDULE[index])}::timestamptz,
  -- published_at and updated_at both take the scheduled moment as written.
  --
  -- published_at used to carry "AT TIME ZONE 'Africa/Cairo'" here, which is
  -- what you reach for when a value needs moving INTO Cairo time and is wrong
  -- for a string that already says +02:00. It converted the timestamptz to a
  -- naive local time and then let the server read it back as UTC, so every
  -- article in the two earlier waves stored 11:00 Cairo rather than 09:00.
  -- Nothing had noticed because scheduled_at, which decides visibility, never
  -- had the conversion and was always right; only datePublished in the
  -- BlogPosting was two hours out.
  --
  -- updated_at matches, so dateModified agrees with the "Last updated" line
  -- the article prints under its title. A row inserted today for November
  -- would otherwise claim it was last touched in September.
  ${pg(SCHEDULE[index])}::timestamptz,
  ${pg(SCHEDULE[index])}::timestamptz,
  ${pg(faqJson)}::jsonb,
  'BlogPosting'
)`;
  }).join(",\n");

  const verifications = members.map(({ a }) => `SELECT ${pg(a.slug)} AS slug,
       (SELECT count(*) FROM regexp_matches(body_en, ${pg(a.primary)}, 'gi')) AS primary_hits
FROM posts WHERE slug = ${pg(a.slug)};`).join("\n");

  const sql = `-- Wave "${wave}": ${members.length} articles, loaded in one file.
--
${members.map(({ a, index }) => isRewrite
  ? `--   ${a.rewriteOf === a.slug ? a.slug : `${a.rewriteOf} becomes ${a.slug}`}  (${a.primary})`
  : `--   ${SCHEDULE[index]}  ${a.slug}  (${a.primary})`).join("\n")}
--
${isRewrite ? `-- These rows are ALREADY PUBLISHED and already indexed. This file rewrites
-- their body and their SEO fields in place. published_at is never touched, so
-- each article keeps the date it first went out, which is what its BlogPosting
-- has been telling crawlers since. updated_at carries the rewrite, and
-- dateModified follows from it.
--
${renamed.length > 0 ? `-- ${renamed.length} of these slugs change: ${renamed.map(({ a }) => `${a.rewriteOf} to ${a.slug}`).join(", ")}.
-- server/path-redirects.ts sends every old path to its new one with a 301, and
-- scripts/test-redirects.ts proves it over HTTP for GET and for HEAD. Deploy
-- the server BEFORE running this file, or the old URLs 404 in the window
-- between the two.` : `-- No slug changes in this wave, so no redirect is involved. Every row keeps
-- the URL it is already indexed under.`}
--
-- RUN THIS BEFORE scripts/fill-post-images.ts, not after. The rewrite replaces
-- body_en outright, which is the point, and that discards any <figure> the
-- image script had inserted. Fill the images once the prose is in place.` : `-- Scheduled via posts.scheduled_at, so every row stays out of the blog list,
-- the sitemap and the server rendered meta until its moment. published_at
-- carries the same instant as the article's own date. See
-- shared/post-visibility.ts for the visibility rule.`}
--
-- RUN THE MIGRATION FIRST (Admin > Settings > Run Migrations). This needs
-- posts.scheduled_at, posts.faqs and posts.schema_markup.
--
-- Only the English columns are filled. title_es/fr/jp and body_es/fr/jp are
-- deliberately left NULL rather than machine translated.
--
-- Images are NOT set here. scripts/fill-post-images.ts fetches them, checks
-- each candidate against the provider's own description, and writes
-- featured_image plus the in-body figures. Run it after this file.
--
-- The hero alt text each article wants, carrying its focus keyword, which is
-- one of the required keyword placements. featured_image_alt stays NULL until
-- there is an image to describe; these are the strings to use when there is:
--
${members.map(({ a }) => `--   ${a.slug}\n--     ${a.heroAlt}`).join("\n")}
--
${isRewrite ? `-- Safe to run twice. Each UPDATE matches the old slug and the new one, so a
-- second run finds the row it renamed on the first and writes the same values
-- to it again.` : `-- Safe to run twice. See the ON CONFLICT block: a row whose body already has
-- figures in it keeps that body rather than losing the images.`}

-- ---------------------------------------------------------------------------
-- Before: what is already in the database for these slugs.
-- On a first run this returns no rows, which is the expected result.
-- ---------------------------------------------------------------------------
SELECT slug,
       status,
       scheduled_at,
       published_at,
       length(body_en) AS body_chars,
       (body_en LIKE '%<figure%') AS has_images,
       updated_at
FROM posts
WHERE slug IN (${allSlugList})
ORDER BY ${isRewrite ? "published_at NULLS LAST, slug" : "scheduled_at"};

BEGIN;

${isRewrite ? updates : `INSERT INTO posts (
  slug, title_en, body_en, excerpt, category, tags,
  focus_keyword, meta_title, meta_description,
  status, scheduled_at, published_at, updated_at, faqs, schema_type
) VALUES
${rows}
ON CONFLICT (slug) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  -- The body is NOT overwritten once images are in it. Re-running a file after
  -- scripts/fill-post-images.ts once deleted every <figure> that script had
  -- inserted, silently, with the file reporting success.
  --
  -- To change the prose of a row that has figures, patch it surgically instead.
  -- See content-updates/blog-generator/README.md.
  body_en = CASE
    WHEN posts.body_en LIKE '%<figure%' THEN posts.body_en
    ELSE EXCLUDED.body_en
  END,
  excerpt = EXCLUDED.excerpt,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  focus_keyword = EXCLUDED.focus_keyword,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  status = EXCLUDED.status,
  scheduled_at = EXCLUDED.scheduled_at,
  published_at = EXCLUDED.published_at,
  faqs = EXCLUDED.faqs,
  schema_type = EXCLUDED.schema_type,
  updated_at = now();`}

COMMIT;

-- ---------------------------------------------------------------------------
-- Verification. Every "bad" column below must read 0, and the row count must
-- be ${members.length}.
-- ---------------------------------------------------------------------------
SELECT count(*) AS rows_present FROM posts WHERE slug IN (${slugList});${isRewrite ? `

-- Must be 0. Any row still under an old slug means its UPDATE matched nothing,
-- which means the row was not there under either name.
SELECT 'rows still under an old slug' AS check, count(*) AS bad
FROM posts WHERE slug IN (${allSlugList}) AND slug NOT IN (${slugList});
` : ""}

SELECT slug,
       length(meta_title) AS title_len,
       length(meta_description) AS meta_len,
       jsonb_array_length(faqs) AS faq_count,
       array_length(regexp_split_to_array(regexp_replace(body_en, '<[^>]+>', ' ', 'g'), '\\s+'), 1) AS body_words,
       scheduled_at,
       published_at,
       CASE WHEN body_en LIKE '%<figure%' THEN 'body kept, it has figures in it'
            ELSE 'body written from this file' END AS body_en_outcome
FROM posts WHERE slug IN (${slugList}) ORDER BY scheduled_at;

${verifications}

SELECT 'seo lengths out of range' AS check, count(*) AS bad FROM posts
WHERE slug IN (${slugList}) AND (length(meta_title) > 60 OR length(meta_description) NOT BETWEEN 150 AND 160);

SELECT 'faq count out of range' AS check, count(*) AS bad FROM posts
WHERE slug IN (${slugList}) AND jsonb_array_length(faqs) NOT BETWEEN 7 AND 8;

-- Answers are written to be quoted on their own by an AI answer engine, which
-- means 40 to 80 words each. Outside that they are either empty or too long.
SELECT 'faq answers outside 40-80 words' AS check, count(*) AS bad
FROM posts p, jsonb_array_elements(p.faqs) f
WHERE p.slug IN (${slugList})
  AND array_length(regexp_split_to_array(trim(f->>'answer'), '\\s+'), 1) NOT BETWEEN 40 AND 80;

-- The SEO overrides must be NULL, not empty strings, or the fallbacks break.
SELECT 'seo overrides stored as empty strings' AS check, count(*) AS bad FROM posts
WHERE slug IN (${slugList})
  AND (canonical_url = '' OR robots = '' OR og_image = '' OR schema_type = '' OR featured_image_alt = '');

SELECT 'faq entries missing id, question or answer' AS check, count(*) AS bad
FROM posts p, jsonb_array_elements(p.faqs) f
WHERE p.slug IN (${slugList})
  AND (coalesce(f->>'id','') = '' OR coalesce(f->>'question','') = '' OR coalesce(f->>'answer','') = '');

SELECT 'em or en dash present' AS check, count(*) AS bad FROM posts
WHERE slug IN (${slugList})
  AND (body_en ~ '[\\u2013\\u2014]' OR meta_title ~ '[\\u2013\\u2014]' OR meta_description ~ '[\\u2013\\u2014]' OR title_en ~ '[\\u2013\\u2014]');

-- Tour links must sit at the site root. Anything under the category path 404s.
SELECT 'tour links under /luxury-egypt-tour-packages/' AS check, count(*) AS bad FROM posts
WHERE slug IN (${slugList}) AND body_en ~ 'href="/luxury-egypt-tour-packages/[^"]';

-- The hotel listing moved. A link to the old path still works through the 301,
-- and costs every reader a hop for no reason.
SELECT 'links to the old /stay path' AS check, count(*) AS bad FROM posts
WHERE slug IN (${slugList}) AND body_en ~ 'href="/stay';

SELECT 'unfilled placeholders' AS check, count(*) AS bad FROM posts
WHERE slug IN (${slugList}) AND (body_en LIKE '%data-placeholder=%' OR body_en ~ '\\{\\{[A-Z_]+\\}\\}');

SELECT 'other language columns left empty' AS check, count(*) AS bad FROM posts
WHERE slug IN (${slugList})
  AND (title_es IS NOT NULL OR title_fr IS NOT NULL OR title_jp IS NOT NULL
       OR body_es IS NOT NULL OR body_fr IS NOT NULL OR body_jp IS NOT NULL);

-- The owner paragraphs are deliberately left as HTML comments for someone to
-- replace with a real first hand voice. This is a reminder, not a failure.
SELECT slug,
       (length(body_en) - length(replace(body_en, '<!-- OWNER:', ''))) / 11 AS owner_notes_awaiting_a_paragraph
FROM posts WHERE slug IN (${slugList}) ORDER BY slug;
`;

  writeFileSync(`${OUT}/add-posts-wave-${wave}.sql`, sql);
  console.log(`wave "${wave}": ${members.length} article(s) -> add-posts-wave-${wave}.sql`);
}

console.log(`\n${ARTICLES.length} SQL file(s) written to ${OUT}`);

if (placeholders.length > 0) {
  console.log(`\n${placeholders.length} placeholder(s) to fill before publishing:`);
  for (const p of placeholders) console.log(`  ${p.slug} :: ${p.key}\n      ${p.text}`);
}
writeFileSync(new URL("./placeholders.json", import.meta.url), JSON.stringify(placeholders, null, 1));
writeFileSync(new URL("./schedule.json", import.meta.url), JSON.stringify(report, null, 1));
