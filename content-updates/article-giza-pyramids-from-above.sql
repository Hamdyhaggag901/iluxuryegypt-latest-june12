-- Article: Giza Pyramids from Above: The New Tethered Balloon (2026)
--
--   psql "$DATABASE_URL" -f content-updates/article-giza-pyramids-from-above.sql
--
-- Same pattern as the five articles in 0d33498: one row into posts, images
-- resolved from the media library at run time, the FAQPage built from the faqs
-- column, and ON CONFLICT (slug) DO UPDATE so the file is safe to run twice.
--
-- TARGETING
-- Primary "giza pyramids from above" sits at the start of the title tag, in title_en (the H1), the
-- slug, meta_title, meta_description, the first sentence of the body, one h2,
-- featured_image_alt and the closing paragraph. It is used three times in the
-- body; everything else is carried by natural variants ("the plateau from the
-- air", "above the plateau", "the pyramids of Giza from above"), which is what
-- keeps the page off stuffing.
--
-- "hot air balloon pyramids" is deliberately NOT targeted. In the US that query
-- is largely about Teotihuacan in Mexico, so the h2 answering it is written to
-- correct the misunderstanding rather than to rank for it.
--
-- FACTS, ALL VERIFIED BY SEARCH BEFORE WRITING (September 2026)
--   trial operation began 30 August 2026, after a ministerial inspection
--   no confirmed public opening date, no announced ticket price
--   Tashreef for Tourism Marketing with the French specialist Aerophile
--   rises roughly 150 m, about 2 km from the pyramids, a little over 2 km
--     from the Sphinx, rides of about 15 minutes
--   audio commentary in 12 languages, prepared under the supervision of the
--     Supreme Council of Antiquities
--   free flying hot air balloons do not operate over Giza; Egypt's hot air
--     ballooning is at Luxor, over the west bank at sunrise
-- No price or ticket figure appears anywhere, and the body states plainly that
-- the opening date and details may change.
--
-- The article does NOT link to the existing pyramids-balloon-sunrise tour,
-- which advertises a hot air balloon over the Giza plateau and contradicts the
-- verified position. That page needs a separate decision; nothing here changes
-- it.
--
-- Published live: status published with scheduled_at NULL is the documented
-- "Publish now" state in shared/post-visibility.ts. published_at is 2026-09-27 10:40:00.
--
-- Dollar quoting on every text value.

\set ON_ERROR_STOP on

BEGIN;

WITH feat AS (
  SELECT m.url, m.alt_en
  FROM unnest(ARRAY[$A$%Pyramids of Giza%$A$, $A$%Giza plateau%$A$, $A$%Great Pyramid%$A$, $A$%Giza%$A$, $A$%Sphinx%$A$]) WITH ORDINALITY AS p(pat, ord)
  JOIN media m ON m.alt_en ILIKE p.pat
  WHERE m.url <> $A$$A$
    AND (p.ord = 1 OR NOT (m.alt_en ILIKE ANY (ARRAY[]::text[])))
    AND (m.mime_type LIKE $A$image/%$A$ OR m.url ~* $A$[.](webp|jpe?g|png|avif)$$A$)
  ORDER BY p.ord, m.id
  LIMIT 1
),
img1 AS (
  SELECT m.url, m.alt_en
  FROM unnest(ARRAY[$A$%Sphinx%$A$, $A$%Giza plateau%$A$, $A$%Pyramids of Giza%$A$, $A$%Giza%$A$]) WITH ORDINALITY AS p(pat, ord)
  JOIN media m ON m.alt_en ILIKE p.pat
  WHERE m.url <> $A$$A$
    AND (p.ord = 1 OR NOT (m.alt_en ILIKE ANY (ARRAY[$A$%Mena House%$A$, $A$%Saqqara%$A$, $A$%balloon%$A$])))
    AND (m.mime_type LIKE $A$image/%$A$ OR m.url ~* $A$[.](webp|jpe?g|png|avif)$$A$)
  ORDER BY p.ord, m.id
  LIMIT 1
),
img2 AS (
  SELECT m.url, m.alt_en
  FROM unnest(ARRAY[$A$%Mena House%$A$, $A$%pyramid%view%$A$, $A$%Giza%$A$, $A$%Cairo%$A$]) WITH ORDINALITY AS p(pat, ord)
  JOIN media m ON m.alt_en ILIKE p.pat
  WHERE m.url <> $A$$A$
    AND (p.ord = 1 OR NOT (m.alt_en ILIKE ANY (ARRAY[$A$%Sphinx%$A$, $A$%Saqqara%$A$, $A$%balloon%$A$])))
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
  $A$giza-pyramids-from-above$A$,
  $A$Giza Pyramids from Above: The New Tethered Balloon (2026)$A$,
  replace(replace($A$<p><strong>Updated September 2026:</strong> there is now a way to see the Giza pyramids from above, and it is not the one most people expect.</p>
<p>The balloon described below is in trial operation, so its opening date, operating hours and details may change, and nothing here should be read as a confirmed schedule.</p>
<p>A tethered balloon has been installed near the plateau and entered trial operation at the end of August 2026, rising vertically on a cable to roughly 150 metres and returning to the same spot about fifteen minutes later.</p>
<p>It is not a hot air balloon, it does not drift anywhere, and at the time of writing there is no confirmed public opening date and no announced ticket price.</p>
<p>What follows is what has actually been announced, what the experience is designed to be, and the ways of gaining height over the plateau that already work today.</p>

<h2>What the Giza tethered balloon is</h2>
<p>The distinction that matters is the cable.</p>
<p>A tethered balloon is a large gas balloon held to a winch at a fixed ground station, which lets it climb straight up, hold at altitude for a few minutes, and come back down to the point it left.</p>
<p>There is no pilot steering it across the landscape and no chase vehicle following it across the desert, because it never travels anywhere.</p>
<p>That is a different machine from the free flying hot air balloons people picture, and the difference is worth holding onto before you book anything, because the two experiences are sold under confusingly similar names.</p>
<p>The project is being delivered by Tashreef for Tourism Marketing together with the French balloon specialist Aerophile, and Egypt's Minister of Tourism and Antiquities inspected the site at the end of August before trials began on 30 August 2026.</p>
<p>The installation was designed to sit lightly on the ground, using prefabricated structures placed above ground level so the whole thing can be assembled and taken apart without excavation or concrete foundations near the archaeology.</p>
<p>Commentary for passengers was prepared under the supervision of the Supreme Council of Antiquities and is offered in twelve languages, which tells you something about who the operators expect to be standing in the basket.</p>
<IMG1>

<h2>Is there a hot air balloon over the Giza pyramids?</h2>
<p>No, and this is the most common misunderstanding we are asked to clear up.</p>
<p>Free flying hot air balloons do not operate over the Giza plateau.</p>
<p>The site lies beneath the working airspace around Cairo airport, and drifting an uncontrolled balloon across it is not something the authorities permit, which is why no operator offers it however the advertising is worded.</p>
<p>Egypt's hot air ballooning happens far to the south, at Luxor, where balloons lift from the west bank at first light and drift slowly over the Theban necropolis with the Nile on one side and the desert cliffs on the other.</p>
<p>It is one of the genuinely great aerial experiences anywhere, and it is the flight we run as a <a href="/luxor-hot-air-balloon-sunrise-tour">sunrise hot air balloon over the Luxor west bank</a>.</p>
<p>If a search result promises you a hot air balloon over the pyramids, it is almost always describing Luxor, or describing a balloon flight over pyramids somewhere outside Egypt altogether.</p>
<p>The Giza balloon is the first thing that genuinely puts visitors above the plateau on a regular basis, and it does it on a cable rather than on the wind.</p>

<h2>Where it stands and what you actually see</h2>
<p>The ground station sits roughly two kilometres from the pyramids and a little over two kilometres from the Sphinx.</p>
<p>That distance is the point rather than a compromise.</p>
<p>Standing at the foot of the Great Pyramid you cannot see the shape of the plateau at all, because the monuments are too large and too close, and the classic view of the three pyramids in a line is one you have to travel away from them to get.</p>
<p>A rise of about 150 metres from two kilometres out is roughly the geometry of that view, lifted off the ground and held still.</p>
<p>At that height the three pyramids, the smaller queens' pyramids beside them and the Sphinx on its lower terrace resolve into a single composition, with the edge of the city pressing up against the desert behind them, which is the detail that surprises most first time visitors.</p>
<p>Fifteen minutes is not long, and it is worth understanding how it divides: the ascent, a few minutes held at the top, and the descent.</p>
<p>What a tethered balloon will not give you is the low raking angle of a helicopter banking over the causeways, or the slow change of perspective you get from a flight that moves.</p>
<p>It gives you one fixed, high, steady viewpoint, with time to look properly and to photograph without a window in the way.</p>
<IMG2>

<h2>Other ways to see the Giza pyramids from above</h2>
<p>Until the balloon opens to the public, three approaches already work, and they are very different from one another.</p>
<p>The first is simply a room.</p>
<p>The Marriott Mena House sits at the foot of the plateau in its own gardens, and its pyramid view rooms and suites have balconies that face the Great Pyramid directly.</p>
<p>This is not height in any serious sense, but waking up with the pyramid filling the window changes how the whole trip feels, and for many guests it is the single most memorable thing about their stay in Cairo.</p>
<p>The second is the panoramic viewpoint on the plateau itself, on the desert rise to the south west of the complex, where the ground lifts enough to line all three pyramids up in one frame.</p>
<p>It costs nothing, it is part of any properly run private morning, and it is where the photograph you are picturing is usually taken from.</p>
<p>The third is a helicopter, which remains the only way to actually fly over the monuments, and we run it as a <a href="/cairo-helicopter-tour">private helicopter flight over the Giza plateau</a> for guests who want the aerial view without waiting for the balloon.</p>
<p>There is also the accident of a window seat on the right approach into Cairo, which occasionally delivers the pyramids of Giza from above for about twenty seconds, and which no one can plan for.</p>

<h2>How to fit it into a private Giza day</h2>
<p>The shape of a good day at Giza has not changed because a balloon arrived, and the balloon should be fitted around it rather than the other way round.</p>
<p>Reach the plateau at opening time.</p>
<p>The difference between eight in the morning and eleven is the difference between a monument and a queue, and it costs nothing but an early alarm and a driver who is already waiting when you come down.</p>
<p>A private Egyptologist is what turns the plateau from a set of very large objects into a site you can read, and on a private morning the pace inside the complex is yours to set rather than a group's.</p>
<p>The Grand Egyptian Museum belongs in the afternoon of the same day, within sight of what you spent the morning walking around, and our <a href="/blog/grand-egyptian-museum-tour">guide to visiting the Grand Egyptian Museum</a> covers how long to give it and what to see first.</p>
<p>The balloon, once it is open to the public, belongs at the end of a day like that rather than the beginning.</p>
<p>Seeing the plateau from the ground first and then from the air makes sense of both, and the late afternoon light is better for the view than the middle of the day in any case.</p>
<p>Because the opening date is not settled, the sensible approach for anyone travelling in the coming months is to plan the day without the balloon and add it if it is running when you arrive.</p>

<h2>Planning a private day at the pyramids</h2>
<p>We are based in Cairo, which means we will know whether the balloon is carrying passengers on the morning you are here rather than what was announced three months ago.</p>
<p>Our <a href="/private-grand-museum-pyramids">private Grand Egyptian Museum and Pyramids day</a> is the itinerary this article describes: the plateau at opening with your own Egyptologist, the Sphinx from the causeway, and the museum in the afternoon, arranged around your own pace rather than a coach timetable.</p>
<p>If the balloon is open when you travel, we will tell you honestly whether it is worth the hour it costs you, and if it is not yet running we will say so before you build a day around it.</p>
<p>Either way, the view of the Giza pyramids from above is about to become something visitors can plan for rather than something reserved for photographers with a permit, and that is a genuine change to what a few days in Cairo can offer.</p>$A$, $A$<IMG1>$A$,
    $A$<img src="$A$ || COALESCE((SELECT url FROM img1), $A$PENDING_UPLOAD$A$) || $A$" alt="$A$ || COALESCE((SELECT alt_en FROM img1), $A$The Great Sphinx on its terrace below the Giza plateau$A$) || $A$" />$A$), $A$<IMG2>$A$,
    $A$<img src="$A$ || COALESCE((SELECT url FROM img2), $A$PENDING_UPLOAD$A$) || $A$" alt="$A$ || COALESCE((SELECT alt_en FROM img2), $A$Hotel gardens at the foot of the Giza plateau with the Great Pyramid behind$A$) || $A$" />$A$),
  $A$A tethered balloon near the Giza plateau entered trial operation in August 2026, rising about 150 metres for roughly fifteen minutes. What it is, why it is not a hot air balloon, and the other ways to get height over the pyramids.$A$,
  $A$Egypt Travel$A$,
  $A$giza pyramids from above$A$,
  $A$Giza Pyramids from Above: The New Tethered Balloon$A$,
  $A$Giza pyramids from above: a new tethered balloon near the plateau rises about 150 m for roughly 15 minutes. What it is, and how to plan around it.$A$,
  COALESCE((SELECT url FROM feat), $A$PENDING_UPLOAD$A$),
  $A$giza pyramids from above$A$ || $A$: $A$ || COALESCE((SELECT alt_en FROM feat), $A$the three pyramids and the Sphinx on the Giza plateau seen across the desert$A$),
  COALESCE((SELECT url FROM feat), $A$PENDING_UPLOAD$A$),
  $A$https://iluxuryegypt.com/blog/giza-pyramids-from-above$A$,
  $A$index, follow$A$,
  $A$Article$A$,
  $A$published$A$,
  NULL,
  $A$2026-09-27 10:40:00$A$::timestamp,
  $A$[
  {
    "id": "gz01-0001-4000-8000-000000000001",
    "question": "Is the Giza tethered balloon open to the public yet?",
    "answer": "Not as a confirmed, ticketed attraction. It entered trial operation on 30 August 2026 following an inspection by the Minister of Tourism and Antiquities, and no official public opening date has been announced. Anyone travelling in the next few months should plan their Giza day without it and treat it as a bonus if it is running."
  },
  {
    "id": "gz01-0002-4000-8000-000000000002",
    "question": "How high does the Giza balloon go?",
    "answer": "Around 150 metres. It rises vertically on a cable from a ground station roughly two kilometres from the pyramids and a little over two kilometres from the Sphinx, which is the distance at which the three pyramids line up into the classic view."
  },
  {
    "id": "gz01-0003-4000-8000-000000000003",
    "question": "Is it a hot air balloon?",
    "answer": "No. It is a tethered gas balloon attached to a winch, so it goes straight up, holds, and comes straight back down to the same spot. Free flying hot air balloons do not operate over Giza because the plateau sits beneath the working airspace around Cairo airport. Egypt's hot air ballooning is at Luxor, over the west bank at sunrise."
  },
  {
    "id": "gz01-0004-4000-8000-000000000004",
    "question": "How long does the ride last?",
    "answer": "About fifteen minutes in total, which covers the ascent, a few minutes held at altitude and the descent. Commentary was prepared under the supervision of the Supreme Council of Antiquities and is offered in twelve languages."
  },
  {
    "id": "gz01-0005-4000-8000-000000000005",
    "question": "Can the balloon be combined with a private pyramids tour?",
    "answer": "Yes, once it opens, and it works best at the end of a day rather than the start. The usual shape is the plateau at opening time with a private Egyptologist, the Grand Egyptian Museum in the afternoon, then the balloon in the late afternoon light. Because the opening date is unconfirmed, we build the day so it works with or without it."
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
        $A$dateModified$A$, to_char(p.published_at, $A$YYYY-MM-DD$A$),
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
WHERE p.slug = $A$giza-pyramids-from-above$A$;

DO $GUARD$
DECLARE n int; b text;
BEGIN
  SELECT body_en INTO b FROM posts WHERE slug = $A$giza-pyramids-from-above$A$;
  IF b IS NULL THEN RAISE EXCEPTION $A$article was not written$A$; END IF;

  n := (length(lower(b)) - length(replace(lower(b), $A$giza pyramids from above$A$, $A$$A$)))
       / length($A$giza pyramids from above$A$);
  IF n < 2 OR n > 5 THEN
    RAISE EXCEPTION $A$focus phrase used % times in the body, outside 2 to 5$A$, n;
  END IF;

  SELECT count(*) INTO n FROM regexp_matches(b, $A$<h2>([^<]*)</h2>$A$, $A$g$A$) AS m
  WHERE lower(m[1]) LIKE $A$%giza pyramids from above%$A$;
  IF n < 1 THEN RAISE EXCEPTION $A$no h2 carries the focus phrase$A$; END IF;

  IF EXISTS (SELECT 1 FROM posts WHERE slug = $A$giza-pyramids-from-above$A$
             AND (schema_markup ILIKE $A$%"offers"%$A$ OR schema_markup ILIKE $A$%"price"%$A$)) THEN
    RAISE EXCEPTION $A$a price property reached the schema$A$;
  END IF;
END
$GUARD$;

COMMIT;

\echo
\echo giza-pyramids-from-above

SELECT slug, length(body_en) AS body_chars,
  (length(lower(body_en)) - length(replace(lower(body_en), $A$giza pyramids from above$A$, $A$$A$)))
    / length($A$giza pyramids from above$A$) AS phrase_uses,
  jsonb_array_length(faqs) AS faqs, status, scheduled_at IS NULL AS live_now, published_at
FROM posts WHERE slug = $A$giza-pyramids-from-above$A$;

SELECT $A$featured$A$ AS slot,
  CASE WHEN featured_image = $A$PENDING_UPLOAD$A$ THEN $A$FALLBACK, needs upload$A$ ELSE $A$resolved$A$ END AS status,
  featured_image AS image
FROM posts WHERE slug = $A$giza-pyramids-from-above$A$
UNION ALL
SELECT $A$in body $A$ || m.ord::text,
  CASE WHEN m.src[1] = $A$PENDING_UPLOAD$A$ THEN $A$FALLBACK, needs upload$A$ ELSE $A$resolved$A$ END,
  m.src[1]
FROM posts p,
  LATERAL ROWS FROM (regexp_matches(p.body_en, $A$<img src="([^"]*)"$A$, $A$g$A$))
    WITH ORDINALITY AS m(src, ord)
WHERE p.slug = $A$giza-pyramids-from-above$A$;
