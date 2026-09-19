import { writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import {
  ARTICLES, SCHEDULE, TOUR_SLUGS, DESTINATION_SLUGS,
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

const problems = [];
const notes = [];
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
  for (const reserved of RESERVED_KEYWORDS[L] ?? []) {
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
  // The first article to publish has no earlier sibling to link to, and a
  // forward link would 404 between its date and the target's. That is why a1
  // carried a {{RELATED_POST_SLUG}} token for so long. Exempt it and say so,
  // rather than papering over a broken link.
  const publishesFirst = SCHEDULE.every((iso, i) => i === index || Date.parse(iso) >= Date.parse(SCHEDULE[index]));
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
  const mine = Date.parse(SCHEDULE[index]);
  for (const href of postLinks) {
    const target = href.replace("/blog/", "");
    if (target.includes("{{")) continue;
    if (EXISTING_POST_SLUGS.has(target)) continue; // already live, cannot 404
    const targetIndex = ARTICLES.findIndex((x) => x.slug === target);
    if (targetIndex === -1) problems.push(`${L}: links to /blog/${target}, which is neither in this batch nor a known live article`);
    else if (Date.parse(SCHEDULE[targetIndex]) >= mine)
      problems.push(`${L}: links to /blog/${target}, which publishes ${SCHEDULE[targetIndex]}, at or after this article's ${SCHEDULE[index]}, so the link would 404 on publication`);
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

// Every article publishes at 9am Cairo. The offset written into the ISO string
// is easy to get wrong across a daylight saving boundary, and the result is a
// post that goes live an hour early for the rest of its life without anyone
// noticing, so the wall clock time is checked rather than the string.
const cairoTime = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Africa/Cairo", hour: "2-digit", minute: "2-digit", hour12: false,
});
SCHEDULE.forEach((iso, i) => {
  const local = cairoTime.format(new Date(iso));
  if (local !== "09:00")
    problems.push(`${ARTICLES[i]?.slug ?? `schedule[${i}]`}: ${iso} is ${local} in Cairo, not 09:00. Check the UTC offset against Egyptian summer time.`);
});

// One article per day. Publishing two at once on a site this young is the
// pattern the spread out schedule exists to avoid, and it is easy to create by
// accident when a later batch is dated into the gaps of an earlier one.
const byDay = new Map();
SCHEDULE.forEach((iso, i) => {
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
ARTICLES.forEach((a, index) => {
  const faqJson = JSON.stringify(a.faqs.map((f) => ({ id: faqId(a.slug, f.q), question: f.q, answer: f.a })));
  const tags = `ARRAY[${a.tags.map(pg).join(", ")}]::text[]`;

  // "N of M" counts only the articles that ship as their own file. Counting
  // every article in ARTICLES would rewrite the header of all thirteen earlier
  // files every time a wave is added, for no change anyone asked for.
  const standalone = ARTICLES.filter((x) => !x.wave).length;
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
const WAVES = [...new Set(ARTICLES.map((a) => a.wave).filter(Boolean))];

for (const wave of WAVES) {
  const members = ARTICLES
    .map((a, index) => ({ a, index }))
    .filter(({ a }) => a.wave === wave);

  const slugList = members.map(({ a }) => pg(a.slug)).join(", ");

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
  ${pg(SCHEDULE[index])}::timestamptz AT TIME ZONE 'Africa/Cairo',
  ${pg(faqJson)}::jsonb,
  'BlogPosting'
)`;
  }).join(",\n");

  const verifications = members.map(({ a }) => `SELECT ${pg(a.slug)} AS slug,
       (SELECT count(*) FROM regexp_matches(body_en, ${pg(a.primary)}, 'gi')) AS primary_hits
FROM posts WHERE slug = ${pg(a.slug)};`).join("\n");

  const sql = `-- Wave "${wave}": ${members.length} articles, loaded in one file.
--
${members.map(({ a, index }) => `--   ${SCHEDULE[index]}  ${a.slug}  (${a.primary})`).join("\n")}
--
-- Scheduled via posts.scheduled_at, so every row stays out of the blog list,
-- the sitemap and the server rendered meta until its moment. published_at
-- carries the same instant as the article's own date. See
-- shared/post-visibility.ts for the visibility rule.
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
-- Safe to run twice. See the ON CONFLICT block: a row whose body already has
-- figures in it keeps that body rather than losing the images.

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
WHERE slug IN (${slugList})
ORDER BY scheduled_at;

BEGIN;

INSERT INTO posts (
  slug, title_en, body_en, excerpt, category, tags,
  focus_keyword, meta_title, meta_description,
  status, scheduled_at, published_at, faqs, schema_type
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
  updated_at = now();

COMMIT;

-- ---------------------------------------------------------------------------
-- Verification. Every "bad" column below must read 0, and the row count must
-- be ${members.length}.
-- ---------------------------------------------------------------------------
SELECT count(*) AS rows_present FROM posts WHERE slug IN (${slugList});

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
