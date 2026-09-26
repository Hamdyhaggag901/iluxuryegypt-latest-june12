-- Article: Cairo Honeymoon Packages: Shaping a Few Romantic Days in One City
--
--   psql "$DATABASE_URL" -f content-updates/article-cairo-honeymoon.sql
--
-- Inserts one row into posts. Safe to run twice: ON CONFLICT (slug) DO UPDATE,
-- and the image lookups are deterministic, so a second run changes nothing.
--
-- KEYWORDS
-- "cairo honeymoon packages" appears as an exact phrase in title_en (which renders as the H1 and is
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
-- the staggered date: 2026-10-09 08:05:00.
--
-- Canonical is SITE_URL + '/blog/' + slug, matching server/seo-meta.ts.
--
-- Dollar quoting on every text value.

\set ON_ERROR_STOP on

BEGIN;

WITH feat AS (
  SELECT m.url, m.alt_en
  FROM unnest(ARRAY[$A$%Mena House%$A$, $A$%pyramid%view%$A$, $A$%Giza%plateau%$A$, $A$%Pyramids of Giza%$A$, $A$%Cairo%$A$]) WITH ORDINALITY AS p(pat, ord)
  JOIN media m ON m.alt_en ILIKE p.pat
  WHERE m.url <> $A$$A$
    AND (p.ord = 1 OR NOT (m.alt_en ILIKE ANY (ARRAY[]::text[])))
    AND (m.mime_type LIKE $A$image/%$A$ OR m.url ~* $A$[.](webp|jpe?g|png|avif)$$A$)
  ORDER BY p.ord, m.id
  LIMIT 1
),
img1 AS (
  SELECT m.url, m.alt_en
  FROM unnest(ARRAY[$A$%Nile%Cairo%$A$, $A$%Cairo%corniche%$A$, $A$%Cairo%skyline%$A$, $A$%Cairo%$A$]) WITH ORDINALITY AS p(pat, ord)
  JOIN media m ON m.alt_en ILIKE p.pat
  WHERE m.url <> $A$$A$
    AND (p.ord = 1 OR NOT (m.alt_en ILIKE ANY (ARRAY[$A$%Mena House%$A$, $A$%Giza%$A$, $A$%Khan%$A$, $A$%Muizz%$A$])))
    AND (m.mime_type LIKE $A$image/%$A$ OR m.url ~* $A$[.](webp|jpe?g|png|avif)$$A$)
  ORDER BY p.ord, m.id
  LIMIT 1
),
img2 AS (
  SELECT m.url, m.alt_en
  FROM unnest(ARRAY[$A$%Khan el Khalili%$A$, $A$%Khan El Khalili%$A$, $A$%Al-Muizz%$A$, $A$%Islamic Cairo%$A$]) WITH ORDINALITY AS p(pat, ord)
  JOIN media m ON m.alt_en ILIKE p.pat
  WHERE m.url <> $A$$A$
    AND (p.ord = 1 OR NOT (m.alt_en ILIKE ANY (ARRAY[$A$%Giza%$A$, $A$%Mena House%$A$])))
    AND (m.mime_type LIKE $A$image/%$A$ OR m.url ~* $A$[.](webp|jpe?g|png|avif)$$A$)
  ORDER BY p.ord, m.id
  LIMIT 1
),
img3 AS (
  SELECT m.url, m.alt_en
  FROM unnest(ARRAY[$A$%Saqqara%$A$, $A$%Step Pyramid%$A$, $A$%Djoser%$A$]) WITH ORDINALITY AS p(pat, ord)
  JOIN media m ON m.alt_en ILIKE p.pat
  WHERE m.url <> $A$$A$
    AND (p.ord = 1 OR NOT (m.alt_en ILIKE ANY (ARRAY[$A$%Giza%plateau%$A$, $A$%Mena House%$A$, $A$%Cairo%skyline%$A$])))
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
  $A$cairo-honeymoon-packages$A$,
  $A$Cairo Honeymoon Packages: Shaping a Few Romantic Days in One City$A$,
  replace(replace(replace(replace($A$<p>Cairo honeymoon packages exist for two kinds of couple: the one with only a few days, and the one treating Cairo as the romantic half of a longer trip rather than the whole of it.</p>
<p>Both are better served by doing one city properly than by adding a third internal flight.</p>
<p>Cairo is not an obviously romantic city at first glance, and it rewards couples who know where to point themselves.</p>
<p>This is what a few days there can actually be.</p>

<h2>Who Cairo Honeymoon Packages Suit</h2>
<p>A couple with four or five days, who would rather see one place well than three places badly.</p>
<p>A couple adding a few days at the start or end of a Red Sea trip, where the coast is the resting half and the city is the part they will remember.</p>
<p>A couple on a second visit, who have already done the standard Cairo, Luxor and Aswan route and want to go back to one part of it.</p>
<p>It does not suit a couple whose main reason for coming to Egypt is the Nile or the temples of the south, because Cairo cannot substitute for either.</p>
<p>If that is you, the country wants more of your time rather than less, and <a href="/blog/honeymoon-in-egypt">the longer article on honeymooning in Egypt</a> covers how to shape a full trip.</p>

<h2>Where You Sleep Decides the Trip</h2>
<p>This matters more in Cairo than in most cities, because the two halves of it are genuinely different places.</p>
<p>Staying at Giza, in a hotel below the plateau, means waking to the pyramids and being ten minutes from the gate at opening time.</p>
<p>It also means the city itself is a drive away, which in Cairo traffic is not nothing.</p>
<p>Staying in Zamalek or on the river in the centre means the city at your door, dinner on foot and the Nile outside the window, with the plateau a morning trip instead.</p>
<p>There is no correct answer and there is a correct answer for each couple, and it comes down to which view you would rather wake up to.</p>
<p>Some couples split it, two nights at Giza and two in the centre, which costs a hotel change and is usually worth it.</p>
<IMG1>

<h2>The Pyramid View, and What It Actually Is</h2>
<p>Hotel photography of pyramid views is the single most oversold thing in Egyptian travel and it is worth being precise.</p>
<p>A genuine pyramid view room at Giza looks directly at the plateau across gardens or rooftops, and it is spectacular.</p>
<p>A partial view means you can see the top of one pyramid from one end of a balcony.</p>
<p>The difference is large and the price difference is large, and the words used to describe them are not standardised across properties.</p>
<p>Ask for the specific room category rather than the phrase, confirm it in writing, and understand that nobody can guarantee a particular room number in advance.</p>
<p>Anyone promising you a specific room is telling you something they do not control.</p>

<h2>Dinner on the Nile</h2>
<p>There are three versions and they are not the same experience.</p>
<p>A dinner cruise boat is the most common, a large vessel with a set menu and entertainment, and it is enjoyable and not private.</p>
<p>A felucca at sunset is a small sailing boat with a boatman, usually an hour or two rather than a meal, and it is the quietest thing on the river.</p>
<p>A restaurant on the water, of which there are several on the Zamalek side, gives you the view without the movement and tends to be the better food.</p>
<p>Couples often assume they want the first and discover they wanted the second or third.</p>
<p>Deciding which one you actually want before booking anything is the practical advice.</p>

<h2>The Evening in the Old City</h2>
<p>Khan el Khalili is a working bazaar and it is at its best after dark, when the heat drops and the lamps come on.</p>
<p>The famous coffee houses on its edge are busy, touristed and genuinely old, and sitting in one for an hour with mint tea is a better evening than most restaurant bookings.</p>
<p>Al-Muizz Street, a short walk north, is closed to cars along its main stretch and is lit at night, with Fatimid, Mamluk and Ottoman buildings in sequence along one road.</p>
<p>It is the most straightforwardly beautiful walk in the city and a great many visitors never do it.</p>
<p>Expect persistent selling in the bazaar itself and rather less of it on Al-Muizz.</p>
<IMG2>

<h2>One Day at Giza and Saqqara</h2>
<p>The single most valuable thing a couple can do in Cairo is reach the plateau at opening time.</p>
<p>The difference between eight in the morning and eleven is the difference between a place and a queue, and it costs nothing but an alarm.</p>
<p>Going inside the Great Pyramid is optional and divides people: the passage is low, steep and warm, and the chamber at the end is empty granite.</p>
<p>Saqqara in the afternoon is quieter than Giza will ever be, and the Step Pyramid predates everything on the plateau.</p>
<p>The tomb chapels around it carry reliefs of farming, butchery and boat building rather than gods, which is the part couples tend to remember.</p>
<p>The seven day <a href="/all-inclusive-romantic-vacations-egypt-honeymoon">Honeymoon Package in Egypt</a> opens with exactly this pair of days before moving south and then to the coast, which is the shortest itinerary that does Cairo properly and still leaves the country.</p>
<IMG3>

<h2>What Cairo Honeymoon Packages Should Leave Out</h2>
<p>A short trip is shaped as much by what is dropped as by what is kept.</p>
<p>The sound and light show at the plateau is the first thing to cut, because it costs an evening and most couples find it dated.</p>
<p>A camel ride arranged at the gate is the second, since the ones sold on the spot are short, expensive relative to what they are, and involve more negotiation than anybody wants on a honeymoon.</p>
<p>A second museum is the third: the Grand Egyptian Museum at Giza and the older collection in the centre both reward a half day, and doing both in four days leaves no time for anything else.</p>
<p>Day trips to Alexandria or the Fayoum are the fourth, because each takes the whole day in the car for a few hours at the far end.</p>
<p>What a short Cairo trip needs is fewer things and more time at each of them, which is an easy sentence to write and a hard one to hold to when an itinerary is being filled in.</p>

<h2>What a Few Days in Cairo Cannot Do</h2>
<p>It cannot give you the Nile in the sense people mean when they say it.</p>
<p>The river at Cairo is wide, urban and busy, and it is not the stretch between Aswan and Luxor that appears in photographs.</p>
<p>It cannot give you Luxor, and no amount of museum time substitutes for standing in the hypostyle hall at Karnak.</p>
<p>It cannot give you quiet, except in the specific places where quiet has been arranged, such as a hotel garden or the river at dusk.</p>
<p>Knowing that in advance is what separates a good short trip from a disappointing one, because the disappointment is almost always about what was expected rather than what was there.</p>

<h2>Shaping Four Days</h2>
<p>A shape that works, for couples who want one.</p>
<p>Arrive and do nothing, because the flights into Cairo are mostly unkind and the first evening is better spent on a terrace than at a site.</p>
<p>Giza at opening time on the first full day, the Grand Egyptian Museum in the afternoon, and an early night.</p>
<p>Saqqara in the morning of the second, then the old city in the evening when it is cool and lit.</p>
<p>The third day unstructured, with a felucca or a Nile restaurant in the evening, and the fourth for the flight.</p>
<p>The three itineraries under <a href="CATLINK">Egypt Honeymoon Packages</a> all open with these same Cairo days before going somewhere else, so comparing them is a question of where you want the rest of the trip to go.</p>

<h2>Questions to Ask Before Booking Anything</h2>
<p>Which room category, in writing, if a pyramid view matters to you.</p>
<p>What time you will be at the Giza gate, because anything after nine changes the day.</p>
<p>Whether the guide is with you for the whole stay or per site, since continuity is worth more over a few days than over two weeks.</p>
<p>What happens if a site is closed on your day, which in Egypt is a real possibility and a fair question.</p>
<p>Those four answers tell you more about a short Cairo trip than any itinerary description will.</p>$A$, $A$<IMG1>$A$,
    $A$<img src="$A$ || COALESCE((SELECT url FROM img1), $A$PENDING_UPLOAD$A$) || $A$" alt="$A$ || COALESCE((SELECT alt_en FROM img1), $A$The Nile and the Cairo skyline at dusk from the corniche$A$) || $A$" />$A$), $A$<IMG2>$A$,
    $A$<img src="$A$ || COALESCE((SELECT url FROM img2), $A$PENDING_UPLOAD$A$) || $A$" alt="$A$ || COALESCE((SELECT alt_en FROM img2), $A$Lamplit alleys in the medieval quarter of Cairo in the evening$A$) || $A$" />$A$), $A$<IMG3>$A$,
    $A$<img src="$A$ || COALESCE((SELECT url FROM img3), $A$PENDING_UPLOAD$A$) || $A$" alt="$A$ || COALESCE((SELECT alt_en FROM img3), $A$The Step Pyramid of Djoser at Saqqara in late afternoon light$A$) || $A$" />$A$), $A$CATLINK$A$, (SELECT $A$/$A$ || CASE c.category_type WHEN $A$day-tours$A$ THEN $A$egypt-day-tours$A$ WHEN $A$nile-cruise$A$ THEN $A$egypt-nile-cruise-tours$A$ ELSE $A$luxury-egypt-tour-packages$A$ END || $A$/$A$ || c.slug FROM categories c WHERE c.name = $A$Luxury Honeymoon Egypt$A$)),
  $A$Cairo honeymoon packages suit couples with only a few days, or a romantic half to a longer trip. Pyramid view rooms, dinner on the Nile and a day at Giza.$A$,
  $A$Egypt Travel$A$,
  $A$cairo honeymoon packages$A$,
  $A$Cairo Honeymoon Packages: A Few Days, Done Well$A$,
  $A$Cairo honeymoon packages suit couples with only a few days, or a romantic half to a longer trip. Pyramid view rooms, dinner on the Nile and a day at Giza.$A$,
  COALESCE((SELECT url FROM feat), $A$PENDING_UPLOAD$A$),
  $A$cairo honeymoon packages$A$ || $A$: $A$ || COALESCE((SELECT alt_en FROM feat), $A$a hotel garden at Giza with the pyramid plateau rising behind it$A$),
  COALESCE((SELECT url FROM feat), $A$PENDING_UPLOAD$A$),
  $A$https://iluxuryegypt.com/blog/cairo-honeymoon-packages$A$,
  $A$index, follow$A$,
  $A$Article$A$,
  $A$published$A$,
  NULL,
  $A$2026-10-09 08:05:00$A$::timestamp,
  $A$[
  {
    "id": "art5-0001-4000-8000-000000000001",
    "question": "What do cairo honeymoon packages usually include?",
    "answer": "A few nights in the city, a day at the Giza plateau and usually Saqqara, and an evening element such as a felucca or dinner on the river. The variable is where you sleep, since a hotel below the pyramids and one on the Nile in the centre give completely different trips. Nothing should be promised as a specific room or a specific upgrade in advance."
  },
  {
    "id": "art5-0002-4000-8000-000000000002",
    "question": "Is Cairo enough on its own for a honeymoon?",
    "answer": "For four or five days, yes, if you accept what it cannot do. It cannot give you the stretch of the Nile people picture, or Luxor, or quiet outside the places where quiet has been arranged. Couples whose main reason for coming is the temples of the south should give the country more time rather than less."
  },
  {
    "id": "art5-0003-4000-8000-000000000003",
    "question": "Is a pyramid view room worth paying more for?",
    "answer": "It is if the view is a genuine one, and the words used to sell it are not standardised between hotels. A true pyramid view looks across gardens or rooftops at the plateau; a partial view means the top of one pyramid from one end of a balcony. Ask for the specific room category in writing rather than the phrase."
  },
  {
    "id": "art5-0004-4000-8000-000000000004",
    "question": "What is the best evening to plan in Cairo?",
    "answer": "Al-Muizz Street after dark is the most straightforwardly beautiful walk in the city and most visitors never do it. It is closed to cars along its main stretch, lit at night, and lined with Fatimid, Mamluk and Ottoman buildings in sequence. Khan el Khalili is a short walk away and is best after the heat drops."
  },
  {
    "id": "art5-0005-4000-8000-000000000005",
    "question": "How early should we get to the pyramids?",
    "answer": "Opening time, which means leaving the hotel before most breakfast services start. The difference between eight in the morning and eleven is the difference between a place and a queue, and it costs nothing but an alarm. Staying at Giza rather than in the centre makes this considerably easier."
  },
  {
    "id": "art5-0006-4000-8000-000000000006",
    "question": "Can Cairo be combined with the Red Sea for a short trip?",
    "answer": "Yes, and it is one of the better short combinations, because the coast provides the resting half that Cairo cannot. It costs one internal flight each way and works comfortably in about a week. Adding Luxor as well inside the same week is where short trips usually go wrong."
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
WHERE p.slug = $A$cairo-honeymoon-packages$A$;

DO $GUARD$
DECLARE n int; b text; alts text[];
BEGIN
  SELECT body_en INTO b FROM posts WHERE slug = $A$cairo-honeymoon-packages$A$;
  IF b IS NULL THEN RAISE EXCEPTION $A$article cairo-honeymoon-packages was not written$A$; END IF;

  n := (length(lower(b)) - length(replace(lower(b), $A$cairo honeymoon packages$A$, $A$$A$)))
       / length($A$cairo honeymoon packages$A$);
  IF n < 3 OR n > 5 THEN
    RAISE EXCEPTION $A$focus phrase used % times in the body, outside 3 to 5$A$, n;
  END IF;

  -- Exactly two headings carry the phrase, no more.
  SELECT count(*) INTO n FROM regexp_matches(b, $A$<h[23]>([^<]*)</h[23]>$A$, $A$g$A$) AS m
  WHERE lower(m[1]) LIKE $A$%cairo honeymoon packages%$A$;
  IF n <> 2 THEN
    RAISE EXCEPTION $A$the phrase is in % headings, expected exactly 2$A$, n;
  END IF;

  -- None of the three in body image alts may carry the phrase.
  SELECT count(*) INTO n FROM regexp_matches(b, $A$alt="([^"]*)"$A$, $A$g$A$) AS m
  WHERE lower(m[1]) LIKE $A$%cairo honeymoon packages%$A$;
  IF n <> 0 THEN
    RAISE EXCEPTION $A$% in body image alt(s) carry the focus phrase$A$, n;
  END IF;

  IF EXISTS (SELECT 1 FROM posts WHERE slug = $A$cairo-honeymoon-packages$A$
             AND (schema_markup ILIKE $A$%"offers"%$A$ OR schema_markup ILIKE $A$%"price"%$A$)) THEN
    RAISE EXCEPTION $A$a price property reached the schema$A$;
  END IF;
END
$GUARD$;

COMMIT;

\echo
\echo cairo-honeymoon-packages

SELECT
  slug,
  length(body_en) AS body_chars,
  (length(lower(body_en)) - length(replace(lower(body_en), $A$cairo honeymoon packages$A$, $A$$A$)))
    / length($A$cairo honeymoon packages$A$) AS phrase_uses,
  jsonb_array_length(faqs) AS faqs,
  status, scheduled_at IS NULL AS live_now, published_at
FROM posts WHERE slug = $A$cairo-honeymoon-packages$A$;

SELECT
  $A$featured$A$ AS slot,
  CASE WHEN featured_image = $A$PENDING_UPLOAD$A$ THEN $A$FALLBACK, needs upload$A$ ELSE $A$resolved$A$ END AS status,
  featured_image AS image
FROM posts WHERE slug = $A$cairo-honeymoon-packages$A$
UNION ALL
SELECT $A$in body $A$ || m.ord::text,
  CASE WHEN m.src[1] = $A$PENDING_UPLOAD$A$ THEN $A$FALLBACK, needs upload$A$ ELSE $A$resolved$A$ END,
  m.src[1]
FROM posts p,
  LATERAL ROWS FROM (regexp_matches(p.body_en, $A$<img src="([^"]*)"$A$, $A$g$A$))
    WITH ORDINALITY AS m(src, ord)
WHERE p.slug = $A$cairo-honeymoon-packages$A$;
