-- Article: The Flower of Life Egypt Pattern at Abydos: What Is Known and What Is Not
--
--   psql "$DATABASE_URL" -f content-updates/article-flower-of-life.sql
--
-- Inserts one row into posts. Safe to run twice: ON CONFLICT (slug) DO UPDATE,
-- and the image lookups are deterministic, so a second run changes nothing.
--
-- KEYWORDS
-- "flower of life egypt" appears as an exact phrase in title_en (which renders as the H1 and is
-- a different column from meta_title), the slug, meta_title, meta_description,
-- the FIRST SENTENCE of the body, exactly two h2 headings and no more,
-- featured_image_alt, and one FAQ question. It is used 3 times in the body,
-- inside the three to five the brief allows. Synonyms and close variants carry
-- the rest of the topic, which is what keeps the page off stuffing.
--
-- IMAGES ARE RESOLVED AT RUN TIME
-- No UUID is written here. Four lookups per article, each an ordered list of
-- include patterns against media.alt_en with ILIKE: first pattern that matches
-- wins, lowest id within it, so a re-run picks the same row. Excludes apply from
-- the second pattern onwards, never to the first, and they also keep the four
-- images on this page distinct from one another. Nothing matching gives
-- PENDING_UPLOAD rather than an empty src.
--
-- featured_image_alt is built as the focus phrase followed by the resolved
-- media alt_en, so it carries the phrase AND describes the photograph that was
-- actually selected. The three in body alts are the media alt_en unchanged and
-- carry no focus phrase, which is checked by the guard below.
--
-- SCHEMA
-- The FAQPage node is built from the faqs column in SQL rather than written out
-- twice, so the two cannot drift. The graph is an Article node plus that
-- FAQPage. No offers, no price property, no price string.
--
-- PUBLISHING
-- status published with scheduled_at NULL is "live now" per
-- shared/post-visibility.ts, which is the documented Publish now state and is
-- immune to clock skew in a way a "past timestamp" is not. published_at carries
-- the staggered date: 2026-10-04 11:10:00.
--
-- Canonical is SITE_URL + '/blog/' + slug, matching server/seo-meta.ts.
--
-- Dollar quoting on every text value.

\set ON_ERROR_STOP on

BEGIN;

WITH feat AS (
  SELECT m.url, m.alt_en
  FROM unnest(ARRAY[$A$%flower of life%$A$, $A$%overlapping circle%$A$, $A$%Osireion%column%$A$, $A$%Osireion%$A$, $A$%Abydos%$A$]) WITH ORDINALITY AS p(pat, ord)
  JOIN media m ON m.alt_en ILIKE p.pat
  WHERE m.url <> $A$$A$
    AND (p.ord = 1 OR NOT (m.alt_en ILIKE ANY (ARRAY[]::text[])))
    AND (m.mime_type LIKE $A$image/%$A$ OR m.url ~* $A$[.](webp|jpe?g|png|avif)$$A$)
  ORDER BY p.ord, m.id
  LIMIT 1
),
img1 AS (
  SELECT m.url, m.alt_en
  FROM unnest(ARRAY[$A$%Osireion%$A$, $A$%Osirion%$A$, $A$%Abydos%granite%$A$, $A$%Abydos%$A$]) WITH ORDINALITY AS p(pat, ord)
  JOIN media m ON m.alt_en ILIKE p.pat
  WHERE m.url <> $A$$A$
    AND (p.ord = 1 OR NOT (m.alt_en ILIKE ANY (ARRAY[$A$%flower of life%$A$, $A$%overlapping circle%$A$, $A$%king list%$A$])))
    AND (m.mime_type LIKE $A$image/%$A$ OR m.url ~* $A$[.](webp|jpe?g|png|avif)$$A$)
  ORDER BY p.ord, m.id
  LIMIT 1
),
img2 AS (
  SELECT m.url, m.alt_en
  FROM unnest(ARRAY[$A$%Abydos%relief%$A$, $A$%Seti I%$A$, $A$%Abydos%temple%$A$, $A$%Abydos%$A$]) WITH ORDINALITY AS p(pat, ord)
  JOIN media m ON m.alt_en ILIKE p.pat
  WHERE m.url <> $A$$A$
    AND (p.ord = 1 OR NOT (m.alt_en ILIKE ANY (ARRAY[$A$%Osireion%$A$, $A$%Osirion%$A$, $A$%flower of life%$A$])))
    AND (m.mime_type LIKE $A$image/%$A$ OR m.url ~* $A$[.](webp|jpe?g|png|avif)$$A$)
  ORDER BY p.ord, m.id
  LIMIT 1
),
img3 AS (
  SELECT m.url, m.alt_en
  FROM unnest(ARRAY[$A$%Abydos%exterior%$A$, $A$%Abydos%courtyard%$A$, $A$%Abydos%$A$]) WITH ORDINALITY AS p(pat, ord)
  JOIN media m ON m.alt_en ILIKE p.pat
  WHERE m.url <> $A$$A$
    AND (p.ord = 1 OR NOT (m.alt_en ILIKE ANY (ARRAY[$A$%Osireion%$A$, $A$%Osirion%$A$, $A$%relief%$A$, $A$%flower of life%$A$])))
    AND (m.mime_type LIKE $A$image/%$A$ OR m.url ~* $A$[.](webp|jpe?g|png|avif)$$A$)
  ORDER BY p.ord, m.id
  LIMIT 1
)
INSERT INTO posts (
  slug, title_en, body_en, excerpt, category, focus_keyword, meta_title, meta_description,
  featured_image, featured_image_alt, og_image, canonical_url, robots, schema_type,
  status, scheduled_at, published_at, faqs
)
SELECT
  $A$flower-of-life-egypt$A$,
  $A$The Flower of Life Egypt Pattern at Abydos: What Is Known and What Is Not$A$,
  replace(replace(replace($A$<p>The flower of life egypt pattern is a set of overlapping circles cut into a granite column at the Osireion in Abydos, and almost everything said about it online goes further than the evidence does.</p>
<p>This is a short article because it is a small subject.</p>
<p>What can be said with confidence fits in a few paragraphs, and the rest is attribution rather than fact.</p>

<h2>What the Flower of Life Egypt Marks Are</h2>
<p>The pattern is a grid of circles of equal size, each one passing through the centres of its neighbours, producing a lattice of pointed petal shapes.</p>
<p>The same geometric figure appears in many places and many periods, from Assyrian palace floors to medieval European manuscripts to Leonardo's notebooks, because it is what you get when you walk a compass around a circle at a fixed radius.</p>
<p>At Abydos the figure appears more than once on the granite, in at least two places on the columns of the Osireion.</p>
<p>The marks are shallow and look drawn rather than carved.</p>
<p>They sit on the surface of the stone rather than being integrated into any decorative scheme, and they do not align with the architecture around them.</p>
<p>They are also, in places, faint enough that a photograph taken in flat light shows very little.</p>
<IMG1>

<h2>Where They Are on the Structure</h2>
<p>The Osireion is the sunken structure behind the temple of Seti I, with a central hall of enormous unmortared granite pillars standing in groundwater.</p>
<p>The marks are on those pillars rather than on the decorated chambers at the ends of the building.</p>
<p>That placement is part of what makes them puzzling, because the pillars themselves carry no other decoration at all.</p>
<p>Whatever the marks are, they are on a surface that was otherwise left plain.</p>
<p>Reaching them is a question of water level, since the central hall is normally flooded and visitors view it from the edge of the cutting rather than walking among the columns.</p>

<h2>Why the Date Is Genuinely Unresolved</h2>
<p>There is no scientific dating for surface marks of this kind.</p>
<p>A pattern cut shallowly into granite cannot be dated by the methods used on organic material, and the stone itself only tells you when the rock formed, not when somebody drew on it.</p>
<p>Nor is there any inscription associating the marks with a name or a reign.</p>
<p>That leaves stylistic comparison and context, both of which are weak tools here, because the figure is too simple and too widespread to be diagnostic of a period.</p>
<p>Anyone who tells you the date confidently, in either direction, is going beyond what the evidence supports.</p>
<p>This is the honest core of the subject and the reason this article is short.</p>

<h2>The Explanations People Give</h2>
<p>The most commonly offered explanation among Egyptologists and site specialists is that the marks are graffiti of the Greek or Roman period, when Abydos was still receiving visitors and when this geometric figure was in circulation in the Mediterranean world.</p>
<p>A second explanation places them later still, in the Coptic period, when the structure was used by Christian occupants and when marking surfaces was common.</p>
<p>A third view, held by some readers rather than by specialists, treats the marks as contemporary with the structure and as evidence of geometric knowledge in dynastic Egypt.</p>
<p>The difficulty with the third is that no comparable figure appears in dated Egyptian material from the period, which is a significant absence given how much dynastic material survives.</p>
<p>The difficulty with the first two is that neither has direct evidence either, and both rest on plausibility rather than proof.</p>
<p>Some writers argue for the earlier date and Egyptologists generally do not, and that sentence is as far as the evidence currently allows anybody to go.</p>
<IMG2>

<h2>How the Flower of Life Egypt Story Spread</h2>
<p>The marks were known to people working at the site long before they were known to anyone else, and they appear in site photography without comment for decades.</p>
<p>What changed was popular publishing in the late twentieth century, which gave the figure a name and attached a body of meaning to it, and then the internet, which reproduced photographs of the Abydos columns far more widely than any book had.</p>
<p>The name itself comes from that popular literature rather than from Egyptology or from any Egyptian source, and no ancient text calls the figure anything.</p>
<p>That matters for a reader trying to check a claim, because searching the modern name returns the modern literature rather than the archaeological record.</p>
<p>The pattern at Abydos is now among the most photographed details of the site, which says something about how attention works and very little about the date of the marks.</p>

<h2>What This Article Does Not Claim</h2>
<p>A great deal written about this pattern describes what it supposedly does: what it means spiritually, what it represents about the structure of matter, what effect it has on a person standing near it.</p>
<p>None of that is described here, and the omission is deliberate rather than an oversight.</p>
<p>Those are claims about experience and belief rather than about the stone, and this article is about the stone.</p>
<p>What can be said fairly is that a number of people find the pattern significant and travel to Abydos partly to see it, that it has a substantial literature outside academic Egyptology, and that the interest in it is real whatever its date turns out to be.</p>
<p>Describing what people believe, attributed to them, is different from asserting it.</p>

<h2>Seeing It, and Keeping It in Proportion</h2>
<p>Visitors sometimes arrive at Abydos for the marks and leave disappointed, which is usually a problem of expectation rather than of the site.</p>
<p>They are faint, they are on columns standing in water, and the viewing position is from the edge of the cutting above.</p>
<p>The building they are on is far more remarkable than the marks themselves: unmortared granite blocks weighing many tonnes, set with tight joints, in a plain style unlike the temple in front of it.</p>
<p>The <a href="/blog/egypt-osiris-temple">full article on the Osireion at Abydos</a> covers that structure, its disputed dating, the temple of Seti I and the king list, which is what a visitor actually spends the day looking at.</p>
<p>Abydos is roughly three hours by road north of Luxor, so nobody makes the trip for a pattern on a column alone.</p>
<IMG3>

<h2>How to Weigh What You Read About It</h2>
<p>Two questions separate the careful writing on this subject from the rest.</p>
<p>The first is whether the writer distinguishes the age of a mark from the age of the surface it is on, because a Roman visitor drawing on a thirteenth century structure tells you nothing about when that structure was built.</p>
<p>The second is whether the writer says how the date was established, and accepts that the answer is currently that it has not been.</p>
<p>Writing that treats the marks as proven ancient, and writing that treats them as proven modern, both fail those tests.</p>$A$, $A$<IMG1>$A$,
    $A$<img src="$A$ || COALESCE((SELECT url FROM img1), $A$PENDING_UPLOAD$A$) || $A$" alt="$A$ || COALESCE((SELECT alt_en FROM img1), $A$Granite pillars of the Osireion standing in groundwater at Abydos$A$) || $A$" />$A$), $A$<IMG2>$A$,
    $A$<img src="$A$ || COALESCE((SELECT url FROM img2), $A$PENDING_UPLOAD$A$) || $A$" alt="$A$ || COALESCE((SELECT alt_en FROM img2), $A$Raised relief carving in the temple of Seti I at Abydos$A$) || $A$" />$A$), $A$<IMG3>$A$,
    $A$<img src="$A$ || COALESCE((SELECT url FROM img3), $A$PENDING_UPLOAD$A$) || $A$" alt="$A$ || COALESCE((SELECT alt_en FROM img3), $A$The outer courtyard of the temple complex at Abydos$A$) || $A$" />$A$),
  $A$The flower of life egypt pattern sits on a granite column at the Osireion in Abydos. What is on the stone, why its date is unresolved, and the explanations.$A$,
  $A$Egypt Travel$A$,
  $A$flower of life egypt$A$,
  $A$Flower of Life Egypt: The Abydos Pattern$A$,
  $A$The flower of life egypt pattern sits on a granite column at the Osireion in Abydos. What is on the stone, why its date is unresolved, and the explanations.$A$,
  COALESCE((SELECT url FROM feat), $A$PENDING_UPLOAD$A$),
  $A$flower of life egypt$A$ || $A$: $A$ || COALESCE((SELECT alt_en FROM feat), $A$the overlapping circle pattern cut into a granite column at the Osireion in Abydos$A$),
  COALESCE((SELECT url FROM feat), $A$PENDING_UPLOAD$A$),
  $A$https://iluxuryegypt.com/blog/flower-of-life-egypt$A$,
  $A$index, follow$A$,
  $A$Article$A$,
  $A$published$A$,
  NULL,
  $A$2026-10-04 11:10:00$A$::timestamp,
  $A$[
  {
    "id": "art3-0001-4000-8000-000000000001",
    "question": "What is the flower of life egypt pattern at Abydos?",
    "answer": "It is a lattice of overlapping circles of equal size, cut shallowly into granite columns of the Osireion behind the temple of Seti I. The same geometric figure appears in many cultures and periods, because it is what results from walking a compass around a circle at a fixed radius. At Abydos it appears in at least two places on the pillars."
  },
  {
    "id": "art3-0002-4000-8000-000000000002",
    "question": "How old are the marks?",
    "answer": "Nobody knows, and that is the honest answer. Surface marks of this kind cannot be dated scientifically, there is no inscription associating them with a reign, and the figure is too simple and too widespread to be diagnostic of a period. Claims of a confident date in either direction go beyond the evidence."
  },
  {
    "id": "art3-0003-4000-8000-000000000003",
    "question": "What do Egyptologists think they are?",
    "answer": "The most common view among specialists is that they are graffiti of the Greek or Roman period, when Abydos still received visitors and the figure was in circulation around the Mediterranean. A second view places them in the Coptic period. Both rest on plausibility rather than direct evidence."
  },
  {
    "id": "art3-0004-4000-8000-000000000004",
    "question": "Could they be as old as the structure itself?",
    "answer": "Some readers argue so, and Egyptologists generally do not. The main difficulty is that no comparable figure appears in dated Egyptian material from the dynastic period, which is a notable absence given how much survives. The question is not closed, but the weight of the evidence does not favour it."
  },
  {
    "id": "art3-0005-4000-8000-000000000005",
    "question": "Can you get close enough to see them properly?",
    "answer": "Usually not. The central hall of the Osireion is normally flooded and visitors view it from the edge of the cutting above rather than walking among the columns. The marks are faint, so how much you see depends on the water level and on the light at the time of day you arrive."
  },
  {
    "id": "art3-0006-4000-8000-000000000006",
    "question": "Is it worth going to Abydos to see this?",
    "answer": "Not on its own. Abydos is around three hours by road north of Luxor, and the marks are a small detail on a large site. The Osireion itself, the raised relief in the temple of Seti I and the Abydos king list are what fill the visit."
  }
]$A$::jsonb
ON CONFLICT (slug) DO UPDATE SET
  title_en           = EXCLUDED.title_en,
  body_en            = EXCLUDED.body_en,
  excerpt            = EXCLUDED.excerpt,
  category           = EXCLUDED.category,
  focus_keyword      = EXCLUDED.focus_keyword,
  meta_title         = EXCLUDED.meta_title,
  meta_description   = EXCLUDED.meta_description,
  featured_image     = EXCLUDED.featured_image,
  featured_image_alt = EXCLUDED.featured_image_alt,
  og_image           = EXCLUDED.og_image,
  canonical_url      = EXCLUDED.canonical_url,
  robots             = EXCLUDED.robots,
  schema_type        = EXCLUDED.schema_type,
  status             = EXCLUDED.status,
  scheduled_at       = NULL,
  published_at       = EXCLUDED.published_at,
  faqs               = EXCLUDED.faqs,
  updated_at         = now();

-- Built from the row's own faqs, so the FAQPage text cannot drift from it.
UPDATE posts p SET schema_markup = jsonb_pretty(
  jsonb_build_object(
    $A$@context$A$, $A$https://schema.org$A$,
    $A$@graph$A$, jsonb_build_array(
      jsonb_build_object(
        $A$@type$A$, $A$Article$A$,
        $A$@id$A$, p.canonical_url,
        $A$headline$A$, p.title_en,
        $A$description$A$, p.meta_description,
        $A$inLanguage$A$, $A$en$A$,
        $A$datePublished$A$, to_char(p.published_at, $A$YYYY-MM-DD$A$),
        $A$image$A$, p.featured_image,
        $A$mainEntityOfPage$A$, jsonb_build_object($A$@type$A$, $A$WebPage$A$, $A$@id$A$, p.canonical_url),
        $A$author$A$, jsonb_build_object($A$@type$A$, $A$Organization$A$, $A$name$A$, $A$iLuxury Egypt$A$),
        $A$publisher$A$, jsonb_build_object($A$@type$A$, $A$Organization$A$, $A$name$A$, $A$iLuxury Egypt$A$)
      ),
      jsonb_build_object(
        $A$@type$A$, $A$FAQPage$A$,
        $A$mainEntity$A$, (
          SELECT jsonb_agg(jsonb_build_object(
            $A$@type$A$, $A$Question$A$,
            $A$name$A$, e->>$A$question$A$,
            $A$acceptedAnswer$A$, jsonb_build_object($A$@type$A$, $A$Answer$A$, $A$text$A$, e->>$A$answer$A$)))
          FROM jsonb_array_elements(p.faqs) AS e))
    )))
WHERE p.slug = $A$flower-of-life-egypt$A$;

DO $GUARD$
DECLARE n int; b text; alts text[];
BEGIN
  SELECT body_en INTO b FROM posts WHERE slug = $A$flower-of-life-egypt$A$;
  IF b IS NULL THEN RAISE EXCEPTION $A$article flower-of-life-egypt was not written$A$; END IF;

  n := (length(lower(b)) - length(replace(lower(b), $A$flower of life egypt$A$, $A$$A$)))
       / length($A$flower of life egypt$A$);
  IF n < 3 OR n > 5 THEN
    RAISE EXCEPTION $A$focus phrase used % times in the body, outside 3 to 5$A$, n;
  END IF;

  -- Exactly two headings carry the phrase, no more.
  SELECT count(*) INTO n FROM regexp_matches(b, $A$<h[23]>([^<]*)</h[23]>$A$, $A$g$A$) AS m
  WHERE lower(m[1]) LIKE $A$%flower of life egypt%$A$;
  IF n <> 2 THEN
    RAISE EXCEPTION $A$the phrase is in % headings, expected exactly 2$A$, n;
  END IF;

  -- None of the three in body image alts may carry the phrase.
  SELECT count(*) INTO n FROM regexp_matches(b, $A$alt="([^"]*)"$A$, $A$g$A$) AS m
  WHERE lower(m[1]) LIKE $A$%flower of life egypt%$A$;
  IF n <> 0 THEN
    RAISE EXCEPTION $A$% in body image alt(s) carry the focus phrase$A$, n;
  END IF;

  IF EXISTS (SELECT 1 FROM posts WHERE slug = $A$flower-of-life-egypt$A$
             AND (schema_markup ILIKE $A$%"offers"%$A$ OR schema_markup ILIKE $A$%"price"%$A$)) THEN
    RAISE EXCEPTION $A$a price property reached the schema$A$;
  END IF;
END
$GUARD$;

COMMIT;

\echo
\echo flower-of-life-egypt

SELECT
  slug,
  length(body_en) AS body_chars,
  (length(lower(body_en)) - length(replace(lower(body_en), $A$flower of life egypt$A$, $A$$A$)))
    / length($A$flower of life egypt$A$) AS phrase_uses,
  jsonb_array_length(faqs) AS faqs,
  status, scheduled_at IS NULL AS live_now, published_at
FROM posts WHERE slug = $A$flower-of-life-egypt$A$;

SELECT
  $A$featured$A$ AS slot,
  CASE WHEN featured_image = $A$PENDING_UPLOAD$A$ THEN $A$FALLBACK, needs upload$A$ ELSE $A$resolved$A$ END AS status,
  featured_image AS image
FROM posts WHERE slug = $A$flower-of-life-egypt$A$
UNION ALL
SELECT $A$in body $A$ || m.ord::text,
  CASE WHEN m.src[1] = $A$PENDING_UPLOAD$A$ THEN $A$FALLBACK, needs upload$A$ ELSE $A$resolved$A$ END,
  m.src[1]
FROM posts p,
  LATERAL ROWS FROM (regexp_matches(p.body_en, $A$<img src="([^"]*)"$A$, $A$g$A$))
    WITH ORDINALITY AS m(src, ord)
WHERE p.slug = $A$flower-of-life-egypt$A$;
