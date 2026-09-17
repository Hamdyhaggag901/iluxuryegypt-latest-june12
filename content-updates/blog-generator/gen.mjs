import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import a1 from "./a1.mjs";
import a2 from "./a2.mjs";
import a3 from "./a3.mjs";
import a4 from "./a4.mjs";
import a5 from "./a5.mjs";

const OUT = "/home/user/iluxuryegypt-latest-june12/content-updates";
const ARTICLES = [a1, a2, a3, a4, a5];

// Two weeks, one article every two to three days. A new site publishing five
// pieces at once is an unnatural pattern; this spreads them out.
const SCHEDULE = [
  "2026-09-22T09:00:00+03:00",
  "2026-09-24T09:00:00+03:00",
  "2026-09-27T09:00:00+03:00",
  "2026-09-29T09:00:00+03:00",
  "2026-10-02T09:00:00+03:00",
];

// Real slugs, verified earlier in this session. Tours live at the site ROOT.
const TOUR_SLUGS = new Set([
  "7-day-egypt-tour", "10-day-egypt-tour", "12-days-egypt-tour",
  "family-tours-egypt", "egypt-family-vacation-packages", "egypt-tours-family",
  "egypt-small-group-tour", "egypt-private-tours", "egypt-private-tour-packages",
  "egypt-nile-cruise-packages", "best-luxury-egypt-tours", "luxury-small-group-tours-egypt",
]);
const DESTINATION_SLUGS = new Set([
  "cairo-travel-guide", "attractions-in-luxor", "aswan-egypt-attractions",
  "alexandria-egypt-attractions", "things-to-do-in-hurghada", "siwa-oasis-egypt",
]);

// Mirrors shared/post-categories.ts. A category outside this list is not a
// cosmetic problem: client/src/pages/blog.tsx filters on exact string equality,
// so an unrecognised value makes the post appear under no filter at all. That
// is what "Travel Guides" would have done to all five of these.
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

// Keywords owned by another page. Using them here would compete with it.
const RESERVED_KEYWORDS = {
  "what-to-see-in-luxor": ["attractions in luxor"],
  "grand-egyptian-museum-tour": [],
  "dahshur-pyramids-egypt": ["step pyramid of djoser"],
};

const pg = (s) => `'${String(s).replace(/'/g, "''")}'`;
const strip = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const words = (text) => text.split(/\s+/).filter(Boolean);
const countOf = (haystack, needle) =>
  (haystack.toLowerCase().match(new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;

const problems = [];
const report = [];
const placeholders = [];

ARTICLES.forEach((a, index) => {
  const L = a.slug;
  const text = strip(a.body);
  const lower = text.toLowerCase();
  const wordCount = words(text).length;
  const first100 = words(text).slice(0, 100).join(" ").toLowerCase();

  // ---- category ----
  if (!POST_CATEGORIES.includes(a.category))
    problems.push(`${L}: category "${a.category}" is not one of the site's categories, so the post would appear under no blog filter`);

  // ---- SEO placement ----
  if (a.metaTitle.length > 60) problems.push(`${L}: meta_title ${a.metaTitle.length} chars (max 60)`);
  if (!a.metaTitle.toLowerCase().includes(a.primary)) problems.push(`${L}: primary keyword missing from meta_title`);
  if (a.metaDescription.length < 150 || a.metaDescription.length > 160)
    problems.push(`${L}: meta_description ${a.metaDescription.length} chars (want 150-160)`);
  if (!a.metaDescription.toLowerCase().includes(a.primary)) problems.push(`${L}: primary keyword missing from meta_description`);
  if (!a.titleEn.toLowerCase().includes(a.primary)) problems.push(`${L}: primary keyword missing from the H1 (title_en)`);
  if (!first100.includes(a.primary)) problems.push(`${L}: primary keyword missing from the first 100 words`);
  if (!a.slug.includes(a.primary.replace(/\s+/g, "-"))) problems.push(`${L}: primary keyword not in the slug`);

  const h2s = [...a.body.matchAll(/<h2>(.*?)<\/h2>/g)].map((m) => strip(m[1]));
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
  if (/<h2>\s*(Overview|Introduction|Conclusion|Summary)\s*<\/h2>/i.test(a.body))
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
  for (const reserved of RESERVED_KEYWORDS[L] ?? [])
    if (lower.includes(reserved)) problems.push(`${L}: uses "${reserved}", which is reserved for another page`);

  // At most two promotional sentences per article.
  const promo = sentences.filter((s) => /\bour\b/i.test(s) && /itinerary|tour|package/i.test(s));
  if (promo.length > 2) problems.push(`${L}: ${promo.length} promotional sentences (max 2)`);

  // ---- internal links ----
  const hrefs = [...a.body.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  if (hrefs.length < 3) problems.push(`${L}: only ${hrefs.length} internal links (min 3)`);

  // The rule that matters most: a tour under the category path is a 404.
  for (const href of hrefs) {
    if (/^\/luxury-egypt-tour-packages\/[^/]+$/.test(href)) {
      const sub = href.split("/")[2];
      if (TOUR_SLUGS.has(sub)) problems.push(`${L}: ${href} is a TOUR under the category path and will 404`);
    }
    if (!href.startsWith("/")) problems.push(`${L}: ${href} is not a site relative link`);
  }

  const tourLinks = hrefs.filter((h) => TOUR_SLUGS.has(h.replace(/^\//, "")));
  const destLinks = hrefs.filter((h) => h.startsWith("/egypt-travel-guide/") && DESTINATION_SLUGS.has(h.split("/")[2]));
  const postLinks = hrefs.filter((h) => h.startsWith("/blog/"));
  if (tourLinks.length === 0) problems.push(`${L}: no link to a tour`);
  if (destLinks.length === 0) problems.push(`${L}: no link to a destination page`);
  if (postLinks.length === 0) problems.push(`${L}: no link to another article`);

  for (const href of hrefs) {
    if (href.startsWith("/egypt-travel-guide/") && !DESTINATION_SLUGS.has(href.split("/")[2]))
      problems.push(`${L}: ${href} is not a known destination slug`);
  }

  // A link to a sibling that publishes LATER would 404 until that date.
  for (const href of postLinks) {
    const target = href.replace("/blog/", "");
    if (target.includes("{{")) continue;
    const targetIndex = ARTICLES.findIndex((x) => x.slug === target);
    if (targetIndex === -1) problems.push(`${L}: links to /blog/${target}, which is not one of these five (verify it exists)`);
    else if (targetIndex >= index)
      problems.push(`${L}: links to /blog/${target}, scheduled at or after it, so the link would 404 on publication`);
  }

  // Descriptive anchors, not repeated keyword.
  const anchors = [...a.body.matchAll(/<a href="[^"]+">([^<]+)<\/a>/g)].map((m) => m[1].toLowerCase());
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

  // ---- placeholders ----
  for (const m of a.body.matchAll(/data-placeholder="([^"]+)">([^<]+)</g))
    placeholders.push({ slug: L, key: m[1], text: m[2] });
  for (const m of a.body.matchAll(/\{\{([A-Z_]+)\}\}/g))
    placeholders.push({ slug: L, key: m[1], text: "template token, must be replaced before publishing" });

  report.push({
    slug: L, words: wordCount, primary: primaryCount, h2: h2s.length,
    metaTitle: a.metaTitle.length, meta: a.metaDescription.length,
    faqs: a.faqs.length, links: hrefs.length, sd: sd.toFixed(1),
    scheduled: SCHEDULE[index],
  });
});

if (problems.length > 0) {
  console.error("GUARD FAILURES:\n  " + problems.join("\n  "));
  process.exit(1);
}

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
ARTICLES.forEach((a, index) => {
  const faqJson = JSON.stringify(a.faqs.map((f) => ({ id: randomUUID(), question: f.q, answer: f.a })));
  const tags = `ARRAY[${a.tags.map(pg).join(", ")}]::text[]`;

  const sql = `-- ${a.titleEn}
-- Blog post ${index + 1} of 5. Primary keyword: ${a.primary}
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
  body_en = EXCLUDED.body_en,
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
  writeFileSync(`${OUT}/blog-${String(index + 1).padStart(2, "0")}-${a.slug}.sql`, sql);
});

console.log(`\n${ARTICLES.length} SQL file(s) written to ${OUT}`);

if (placeholders.length > 0) {
  console.log(`\n${placeholders.length} placeholder(s) to fill before publishing:`);
  for (const p of placeholders) console.log(`  ${p.slug} :: ${p.key}\n      ${p.text}`);
}
writeFileSync(new URL("./placeholders.json", import.meta.url), JSON.stringify(placeholders, null, 1));
writeFileSync(new URL("./schedule.json", import.meta.url), JSON.stringify(report, null, 1));
