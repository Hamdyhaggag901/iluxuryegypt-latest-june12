-- Article: A Honeymoon in Egypt: Is It a Good Idea, and How to Shape One
--
--   psql "$DATABASE_URL" -f content-updates/article-honeymoon-in-egypt.sql
--
-- Inserts one row into posts. Safe to run twice: ON CONFLICT (slug) DO UPDATE,
-- and the image lookups are deterministic, so a second run changes nothing.
--
-- KEYWORDS
-- "honeymoon in egypt" appears as an exact phrase in title_en (which renders as the H1 and is
-- a different column from meta_title), the slug, meta_title, meta_description,
-- the FIRST SENTENCE of the body, exactly two h2 headings and no more,
-- featured_image_alt, and one FAQ question. It is used 5 times in the body,
-- inside the three to five the brief allows. Synonyms and close variants carry
-- the rest of the topic, which is what keeps the page off stuffing.
-- Secondary phrases, each in exactly one h2 and once more in the body:
--   best time for egypt honeymoon
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
-- the staggered date: 2026-10-06 16:30:00.
--
-- Canonical is SITE_URL + '/blog/' + slug, matching server/seo-meta.ts.
--
-- Dollar quoting on every text value.

\set ON_ERROR_STOP on

BEGIN;

WITH feat AS (
  SELECT m.url, m.alt_en
  FROM unnest(ARRAY[$A$%honeymoon%$A$, $A$%couple%$A$, $A$%Nile%sunset%$A$, $A$%felucca%$A$, $A$%Nile%$A$]) WITH ORDINALITY AS p(pat, ord)
  JOIN media m ON m.alt_en ILIKE p.pat
  WHERE m.url <> $A$$A$
    AND (p.ord = 1 OR NOT (m.alt_en ILIKE ANY (ARRAY[]::text[])))
    AND (m.mime_type LIKE $A$image/%$A$ OR m.url ~* $A$[.](webp|jpe?g|png|avif)$$A$)
  ORDER BY p.ord, m.id
  LIMIT 1
),
img1 AS (
  SELECT m.url, m.alt_en
  FROM unnest(ARRAY[$A$%Nile cruise%$A$, $A$%dahabiya%$A$, $A$%Nile%boat%$A$, $A$%Nile%$A$]) WITH ORDINALITY AS p(pat, ord)
  JOIN media m ON m.alt_en ILIKE p.pat
  WHERE m.url <> $A$$A$
    AND (p.ord = 1 OR NOT (m.alt_en ILIKE ANY (ARRAY[$A$%felucca%$A$, $A$%honeymoon%$A$, $A$%sunset%$A$])))
    AND (m.mime_type LIKE $A$image/%$A$ OR m.url ~* $A$[.](webp|jpe?g|png|avif)$$A$)
  ORDER BY p.ord, m.id
  LIMIT 1
),
img2 AS (
  SELECT m.url, m.alt_en
  FROM unnest(ARRAY[$A$%Red Sea%$A$, $A$%Sahl Hasheesh%$A$, $A$%Hurghada%$A$]) WITH ORDINALITY AS p(pat, ord)
  JOIN media m ON m.alt_en ILIKE p.pat
  WHERE m.url <> $A$$A$
    AND (p.ord = 1 OR NOT (m.alt_en ILIKE ANY (ARRAY[$A$%Nile%$A$, $A$%honeymoon%$A$])))
    AND (m.mime_type LIKE $A$image/%$A$ OR m.url ~* $A$[.](webp|jpe?g|png|avif)$$A$)
  ORDER BY p.ord, m.id
  LIMIT 1
),
img3 AS (
  SELECT m.url, m.alt_en
  FROM unnest(ARRAY[$A$%Mena House%$A$, $A$%Giza%plateau%$A$, $A$%Pyramids of Giza%$A$, $A$%Giza%$A$]) WITH ORDINALITY AS p(pat, ord)
  JOIN media m ON m.alt_en ILIKE p.pat
  WHERE m.url <> $A$$A$
    AND (p.ord = 1 OR NOT (m.alt_en ILIKE ANY (ARRAY[$A$%Nile%$A$, $A$%Red Sea%$A$, $A$%honeymoon%$A$])))
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
  $A$honeymoon-in-egypt$A$,
  $A$A Honeymoon in Egypt: Is It a Good Idea, and How to Shape One$A$,
  replace(replace(replace(replace($A$<p>A honeymoon in egypt is an unusual choice and it suits some couples very well and others not at all, so the useful question is not whether it is good but whether it is good for you.</p>
<p>It is not a lie down and do nothing destination unless you build it that way deliberately.</p>
<p>It is also one of the few places where two people can spend a fortnight and still be talking about what they saw a year later.</p>
<p>This article answers the questions couples actually ask before booking, in roughly the order they ask them.</p>

<h2>Is a Honeymoon in Egypt Actually a Good Idea</h2>
<p>For couples who like seeing things, yes, and the reason is density.</p>
<p>The distance between the pyramids, the Valley of the Kings and the temples at Aswan is short by the standards of a country with this much in it, and internal flights make the whole southern half reachable inside a fortnight.</p>
<p>For couples whose idea of a honeymoon is two weeks of not moving, it is the wrong country unless you spend most of it on the Red Sea coast, in which case you may as well be somewhere closer.</p>
<p>The honest split is this.</p>
<p>If you want a trip you will talk about, Egypt is one of the strongest choices anywhere.</p>
<p>If you want a trip you will recover on, it is a compromise.</p>
<p>The middle path, which most couples take, is a week of sites followed by three or four days of nothing.</p>

<h2>Is It Safe for Couples</h2>
<p>Safety is the first question most couples ask and it deserves a straight answer rather than reassurance.</p>
<p>The tourist corridor of Cairo, Luxor, Aswan and the Red Sea resorts is heavily policed and very well used, and the practical risks for visiting couples are the ordinary ones of a busy country: traffic, heat, stomach upsets, and persistent selling around major sites.</p>
<p>Travel advice changes and differs by government, so the right source is your own foreign ministry rather than any tour operator, including this one.</p>
<p>The advice for the United States is published at <a href="https://travel.state.gov">travel.state.gov</a> and other countries publish their own.</p>
<p>What a private guide and driver genuinely changes is friction rather than danger: you are not negotiating at gates, not navigating, and not being approached constantly while you work out where to go.</p>
<p>Many couples say afterwards that this was the thing that made the trip feel relaxed.</p>
<IMG1>

<h2>Best Time for Egypt Honeymoon Travel</h2>
<p>The best time for egypt honeymoon travel is October to April, and the reason is simply heat.</p>
<p>Upper Egypt from May to September reaches temperatures that turn a morning at Karnak into an endurance exercise, and most site visits in those months move to early morning and late afternoon with a long gap in the middle.</p>
<p>December and January are the most comfortable and also the busiest, with the sites noticeably fuller.</p>
<p>October, November, March and April are the compromise most couples end up making, warm enough for the Red Sea and bearable on the west bank.</p>
<p>The Red Sea coast copes with summer far better than the valley does, so a June or July trip weighted towards the coast is workable where a temple heavy itinerary is not.</p>
<p>If your dates are fixed by a wedding rather than chosen, tell whoever is planning the trip early, because the itinerary shape should follow the month rather than the other way round.</p>

<h2>How Long to Go For</h2>
<p>Seven days covers Cairo and one other place properly, and nothing more.</p>
<p>Nine to ten days is where the country starts to make sense, because it lets you see Giza, spend real time in Luxor and reach Aswan without any day feeling like a transfer.</p>
<p>Fourteen days lets you add either the Red Sea or somewhere off the standard route, and it is the length at which nobody feels rushed.</p>
<p>The common mistake is compressing: four nights in Cairo and three in Luxor sounds balanced and produces two half trips.</p>
<p>If you only have a week, the better answer is to do less rather than to move faster.</p>

<h2>Nile Cruise, Red Sea, or Both</h2>
<p>This is the decision that shapes everything else, and the three answers suit different couples.</p>
<p>The river is the classic choice, and its appeal is that the temples on the stretch between Aswan and Luxor arrive without a drive attached to them, so the hours between sites are spent watching the bank go past rather than sitting in a vehicle.</p>
<p>The Red Sea is the resting half, and the reef at the southern resorts starts close enough to shore that you do not need a boat to see it.</p>
<p>Doing both inside ten days is possible and usually a mistake, because it adds two internal flights and leaves neither half with enough time.</p>
<p>Inside fourteen days both work comfortably.</p>
<p>The nine day <a href="/luxury-egypt-honeymoon">Luxury Honeymoon in Egypt</a> itinerary is the river version with no coast at all, which is the cleanest expression of that choice.</p>
<IMG2>

<h2>Do Hotels Do Anything for Honeymooners</h2>
<p>Usually yes, and it is worth being realistic about what.</p>
<p>Egyptian hotels at the upper end are generous with honeymoon gestures: a room upgrade where one is available, flowers or a cake on arrival, a decorated bed, sometimes a private dinner arrangement.</p>
<p>None of it is contractual and nobody should promise it to you in advance, including us.</p>
<p>What makes it more likely is telling the hotel, through whoever books it, well before you arrive rather than at check in.</p>
<p>Anyone who guarantees a specific upgrade at a specific property is telling you something they cannot know.</p>

<h2>What It Costs, in Shape Rather Than Numbers</h2>
<p>The cost of a honeymoon in egypt is driven by four things and only four.</p>
<p>The first is the season, because the same itinerary in January and in July are not close.</p>
<p>The second is whether you are flying internally or driving, which buys time at a real cost.</p>
<p>The third is the standard of accommodation, which in Egypt spans a wider range than in most countries.</p>
<p>The fourth is whether the trip is private or a group departure, which is the largest single factor on a short itinerary.</p>
<p>Knowing which of those four you care about is more useful than any number, because it tells whoever is quoting you where to spend and where not to.</p>

<h2>Is It Too Much Walking for a Relaxed Trip</h2>
<p>It is more walking than most beach honeymoons and less than people fear.</p>
<p>The demanding days are the Luxor west bank, where the Valley of the Kings and Deir el-Bahari in one morning means a few hours on uneven ground in heat, and Saqqara, which is sand and slope.</p>
<p>Karnak and the Giza plateau are each a couple of hours on foot at a pace you set.</p>
<p>Nothing on a standard itinerary requires climbing, and the interiors that do, such as the passage into the Great Pyramid, are optional.</p>
<p>On a private trip the pace inside each site is yours, which is the practical difference: you stop when you want to rather than when a group does.</p>
<p>Couples who want the sites without the walking should ask for a west bank day split across two mornings rather than compressed into one.</p>
<IMG3>

<h2>The Mistakes That Spoil a Honeymoon in Egypt</h2>
<p>Four go wrong more often than anything else, and all four are avoidable at the planning stage.</p>
<p>The first is arriving late in the day and scheduling a site for that same evening, which turns the first twenty four hours into a blur nobody enjoys.</p>
<p>The second is booking an itinerary with no unstructured day in it at all, so that a couple who needs a morning off has to lose a site to get one.</p>
<p>The third is putting the Red Sea first, because the resting half works far better after the sites than before them, when you have nothing to recover from yet.</p>
<p>The fourth is treating the internal flights as optional to save a little, which trades several hours of road for money in a country where the roads between Cairo and Luxor are long and dull.</p>
<p>A fifth, less common but harder to fix, is not saying it is a honeymoon until arrival, which removes any chance of the hotels doing anything about it.</p>

<h2>Privacy, and What Private Actually Means</h2>
<p>Private on an Egyptian itinerary means your own guide, your own driver and your own vehicle, and it does not mean the sites are empty.</p>
<p>Karnak at ten in the morning is busy whether you arrive alone or with forty people.</p>
<p>What you control is when you arrive, and arriving at opening time is the single most effective thing a couple can do for the feel of a trip.</p>
<p>The other half of privacy is the evenings, which on a private itinerary are genuinely unstructured rather than filled with a group dinner.</p>

<h2>The Practical Things Couples Ask Last and Should Ask First</h2>
<p>Visas are issued on arrival for many nationalities and in advance online for others, and the official portal is <a href="https://visa2.egypt.gov.eg">visa2.egypt.gov.eg</a> rather than any of the lookalike sites that rank alongside it.</p>
<p>Two people travelling on different passports should check separately, because the rules are not the same for every nationality.</p>
<p>If either of you has changed name after the wedding, travel in the name on the passport and not the new one, and leave the name change until after the trip.</p>
<p>Health advice for Egypt is published by national health services and the United States version sits at <a href="https://wwwnc.cdc.gov">wwwnc.cdc.gov</a>.</p>
<p>Travel insurance that covers a hot air balloon flight is worth checking specifically if Luxor is on the itinerary, because a number of standard policies exclude it.</p>

<h2>Where to Start if You Are Comparing</h2>
<p>The three itineraries under <a href="CATLINK">Egypt Honeymoon Packages</a> are built not to overlap, so comparing them takes a few minutes rather than an evening: one ends on the Red Sea, one is the river, and one runs widest and includes Alexandria.</p>
<p>Couples with only a few days, or who want Cairo as the romantic half rather than the whole trip, will find <a href="/blog/cairo-honeymoon-packages">the article on short Cairo honeymoons</a> more directly useful than this one.</p>
<p>The questions worth asking whoever you book with are the same four every time: what is the pace of each day, who is guiding, what is not included, and what happens if a site is closed on the day.</p>$A$, $A$<IMG1>$A$,
    $A$<img src="$A$ || COALESCE((SELECT url FROM img1), $A$PENDING_UPLOAD$A$) || $A$" alt="$A$ || COALESCE((SELECT alt_en FROM img1), $A$A Nile boat moored on the river between Aswan and Luxor$A$) || $A$" />$A$), $A$<IMG2>$A$,
    $A$<img src="$A$ || COALESCE((SELECT url FROM img2), $A$PENDING_UPLOAD$A$) || $A$" alt="$A$ || COALESCE((SELECT alt_en FROM img2), $A$Clear shallow water over reef on the Red Sea coast$A$) || $A$" />$A$), $A$<IMG3>$A$,
    $A$<img src="$A$ || COALESCE((SELECT url FROM img3), $A$PENDING_UPLOAD$A$) || $A$" alt="$A$ || COALESCE((SELECT alt_en FROM img3), $A$The Giza plateau seen from the gardens of a hotel below it$A$) || $A$" />$A$), $A$CATLINK$A$, (SELECT $A$/$A$ || CASE c.category_type WHEN $A$day-tours$A$ THEN $A$egypt-day-tours$A$ WHEN $A$nile-cruise$A$ THEN $A$egypt-nile-cruise-tours$A$ ELSE $A$luxury-egypt-tour-packages$A$ END || $A$/$A$ || c.slug FROM categories c WHERE c.name = $A$Luxury Honeymoon Egypt$A$)),
  $A$A honeymoon in egypt suits some couples and not others. Safety, the best months, how long to go, Nile cruise or Red Sea, and how much walking to expect.$A$,
  $A$Egypt Travel$A$,
  $A$honeymoon in egypt$A$,
  $A$Honeymoon in Egypt: Is It a Good Idea?$A$,
  $A$A honeymoon in egypt suits some couples and not others. Safety, the best months, how long to go, Nile cruise or Red Sea, and how much walking to expect.$A$,
  COALESCE((SELECT url FROM feat), $A$PENDING_UPLOAD$A$),
  $A$honeymoon in egypt$A$ || $A$: $A$ || COALESCE((SELECT alt_en FROM feat), $A$a felucca under sail on the Nile at Aswan in the late afternoon$A$),
  COALESCE((SELECT url FROM feat), $A$PENDING_UPLOAD$A$),
  $A$https://iluxuryegypt.com/blog/honeymoon-in-egypt$A$,
  $A$index, follow$A$,
  $A$Article$A$,
  $A$published$A$,
  NULL,
  $A$2026-10-06 16:30:00$A$::timestamp,
  $A$[
  {
    "id": "art4-0001-4000-8000-000000000001",
    "question": "Is a honeymoon in egypt a good idea for couples who want to relax?",
    "answer": "Only if you build it that way deliberately. The classic itineraries are site heavy and involve early starts, so a couple who wants to rest should weight the trip towards the Red Sea coast or add three or four unstructured days at the end. Couples who enjoy seeing things rather than lying still tend to rate Egypt very highly."
  },
  {
    "id": "art4-0002-4000-8000-000000000002",
    "question": "Is Egypt safe for a couple travelling together?",
    "answer": "The tourist corridor of Cairo, Luxor, Aswan and the Red Sea resorts is heavily policed and very well used, and the practical risks are the ordinary ones of a busy country rather than anything exotic. Government travel advice changes and differs by country, so check your own foreign ministry rather than relying on an operator. A private guide and driver mostly removes friction rather than danger."
  },
  {
    "id": "art4-0003-4000-8000-000000000003",
    "question": "How long should the trip be to avoid feeling rushed?",
    "answer": "Nine to ten days is where the country starts to work, covering Giza, Luxor and Aswan without any day feeling like a transfer. Seven days covers Cairo and one other place properly and nothing more. Fourteen days allows the Red Sea or somewhere off the standard route as well."
  },
  {
    "id": "art4-0004-4000-8000-000000000004",
    "question": "Should we do a Nile cruise, the Red Sea, or both?",
    "answer": "Both works comfortably inside fourteen days and is usually a mistake inside ten, because it adds two internal flights and leaves neither half enough time. The river suits couples who want the temples to arrive without a drive attached. The coast suits couples who want a genuine resting half."
  },
  {
    "id": "art4-0005-4000-8000-000000000005",
    "question": "Will hotels do anything special for honeymooners?",
    "answer": "Usually something, and nothing guaranteed. Upper end Egyptian hotels are generous with upgrades where available, flowers, a cake or a decorated room, but none of it is contractual and anyone promising a specific upgrade in advance is overstating what they control. Telling the hotel well before arrival makes it more likely than mentioning it at check in."
  },
  {
    "id": "art4-0006-4000-8000-000000000006",
    "question": "How much walking is involved on a typical itinerary?",
    "answer": "More than a beach honeymoon and less than most couples fear. The Luxor west bank and Saqqara are the demanding days, each a few hours on uneven ground in heat, while Karnak and the Giza plateau are a couple of hours each at your own pace. Nothing standard requires climbing, and the pyramid interiors are optional."
  },
  {
    "id": "art4-0007-4000-8000-000000000007",
    "question": "Which months should we avoid?",
    "answer": "June to September in Upper Egypt, unless the trip is weighted to the Red Sea, which copes with summer far better than the valley. December and January are the most comfortable and also the busiest. October, November, March and April are the compromise most couples settle on."
  },
  {
    "id": "art4-0008-4000-8000-000000000008",
    "question": "What makes a private itinerary different from a group departure?",
    "answer": "You control the clock, which on a honeymoon is most of the point. You decide when to leave a site, when to eat and whether to add an hour somewhere, and the evenings are genuinely yours rather than filled with a group dinner. It does not make the sites empty, but it does let you be at them when they open."
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
WHERE p.slug = $A$honeymoon-in-egypt$A$;

DO $GUARD$
DECLARE n int; b text; alts text[];
BEGIN
  SELECT body_en INTO b FROM posts WHERE slug = $A$honeymoon-in-egypt$A$;
  IF b IS NULL THEN RAISE EXCEPTION $A$article honeymoon-in-egypt was not written$A$; END IF;

  n := (length(lower(b)) - length(replace(lower(b), $A$honeymoon in egypt$A$, $A$$A$)))
       / length($A$honeymoon in egypt$A$);
  IF n < 3 OR n > 5 THEN
    RAISE EXCEPTION $A$focus phrase used % times in the body, outside 3 to 5$A$, n;
  END IF;

  -- Exactly two headings carry the phrase, no more.
  SELECT count(*) INTO n FROM regexp_matches(b, $A$<h[23]>([^<]*)</h[23]>$A$, $A$g$A$) AS m
  WHERE lower(m[1]) LIKE $A$%honeymoon in egypt%$A$;
  IF n <> 2 THEN
    RAISE EXCEPTION $A$the phrase is in % headings, expected exactly 2$A$, n;
  END IF;

  -- None of the three in body image alts may carry the phrase.
  SELECT count(*) INTO n FROM regexp_matches(b, $A$alt="([^"]*)"$A$, $A$g$A$) AS m
  WHERE lower(m[1]) LIKE $A$%honeymoon in egypt%$A$;
  IF n <> 0 THEN
    RAISE EXCEPTION $A$% in body image alt(s) carry the focus phrase$A$, n;
  END IF;

  IF EXISTS (SELECT 1 FROM posts WHERE slug = $A$honeymoon-in-egypt$A$
             AND (schema_markup ILIKE $A$%"offers"%$A$ OR schema_markup ILIKE $A$%"price"%$A$)) THEN
    RAISE EXCEPTION $A$a price property reached the schema$A$;
  END IF;
END
$GUARD$;

COMMIT;

\echo
\echo honeymoon-in-egypt

SELECT
  slug,
  length(body_en) AS body_chars,
  (length(lower(body_en)) - length(replace(lower(body_en), $A$honeymoon in egypt$A$, $A$$A$)))
    / length($A$honeymoon in egypt$A$) AS phrase_uses,
  jsonb_array_length(faqs) AS faqs,
  status, scheduled_at IS NULL AS live_now, published_at
FROM posts WHERE slug = $A$honeymoon-in-egypt$A$;

SELECT
  $A$featured$A$ AS slot,
  CASE WHEN featured_image = $A$PENDING_UPLOAD$A$ THEN $A$FALLBACK, needs upload$A$ ELSE $A$resolved$A$ END AS status,
  featured_image AS image
FROM posts WHERE slug = $A$honeymoon-in-egypt$A$
UNION ALL
SELECT $A$in body $A$ || m.ord::text,
  CASE WHEN m.src[1] = $A$PENDING_UPLOAD$A$ THEN $A$FALLBACK, needs upload$A$ ELSE $A$resolved$A$ END,
  m.src[1]
FROM posts p,
  LATERAL ROWS FROM (regexp_matches(p.body_en, $A$<img src="([^"]*)"$A$, $A$g$A$))
    WITH ORDINALITY AS m(src, ord)
WHERE p.slug = $A$honeymoon-in-egypt$A$;
