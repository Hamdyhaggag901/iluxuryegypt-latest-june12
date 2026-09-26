-- Rewrites the itinerary for white-desert-luxury-camping.
--
--   psql "$DATABASE_URL" -f content-updates/spiritual-8-desert.sql
--
-- Eight days, unchanged in length. THIS FIXES A BROKEN ITINERARY: the live
-- JSON had days 1, 2, 3, 4, 5 and 8, with days 6 and 7 missing entirely, so the
-- page rendered a gap. The rewrite produces a complete 1..8 run and fills those
-- two days with Farafra and the return leg through Bahariya rather than padding.
--
-- Siwa is dropped from this tour. It is roughly ten hours by road from Bahariya
-- and belongs to the fourteen day sacred journey, which is the only one of the
-- six that now uses it.
--
-- Bahariya has no confirmed property and the brief's accommodation table does
-- not cover it, so it follows the Siwa convention and carries the place name as
-- a plain string rather than an invented brand. The desert nights carry
-- "Desert camp, White Desert" for the same reason.
--
-- IMAGES
-- No image UUID is written here. Each day carries an ordered list of include
-- patterns and a list of exclude patterns, matched against media.alt_en with
-- ILIKE: the first include pattern that matches anything wins, and within that
-- pattern the lowest id wins, so a re-run returns the same row. Excludes apply
-- from the second pattern onwards, never to the first, because the first
-- pattern is the day's own subject and must not be vetoed by a guard meant for
-- the broad fallbacks. Nothing matching at all gives PENDING_UPLOAD, which the
-- tour page and the brochure both have a fallback panel for. imageAlt comes
-- from the same media row; the written fallback alt is used only on a fallback.
--
-- Eleven keys per day: day, title, description, activities, lat, lng,
-- placeName, image, imageAlt, accommodation, meals. activities is empty on
-- every day. jsonb does not preserve key order.
--
-- Safe to run twice: itinerary is replaced with =, never appended to with ||,
-- the image lookup is deterministic, and updated_at is not touched.
--
-- Dollar quoting on every text value.

\set ON_ERROR_STOP on

BEGIN;

DO $GUARD$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $D$white-desert-luxury-camping$D$) THEN
    RAISE EXCEPTION $D$tour white-desert-luxury-camping not found; nothing was changed$D$;
  END IF;
END
$GUARD$;

WITH spec(day, place_name, title, lat, lng, meals, accommodation, patterns, excludes, alt_fallback, description) AS (
  VALUES
  (1,
   $D$Giza$D$,
   $D$Giza: Arrival and Check In$D$,
   29.9870, 31.2118,
   ARRAY[$D$Dinner$D$],
   $D$Marriott Mena House, Cairo$D$,
   ARRAY[$D$%Mena House%$D$, $D$%Giza%$D$],
   ARRAY[$D$%Sphinx%$D$, $D$%Great Pyramid%$D$, $D$%Pyramids of Giza%$D$, $D$%Saqqara%$D$, $D$%desert%$D$],
   $D$Marriott Mena House at Giza with the pyramid plateau behind it$D$,
   $D$You land at Cairo and are met before the immigration hall rather than after it. The visa, the passport queue and the bags are handled while you wait. The car runs out to Giza and you check in at the Marriott Mena House. Nothing is scheduled today and nothing should be, because tomorrow is a long drive into the Western Desert and it starts early. The evening is for sleeping.$D$),
  (2,
   $D$Bahariya Oasis$D$,
   $D$Bahariya: The Road into the Western Desert$D$,
   28.3500, 28.8667,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Bahariya Oasis$D$,
   ARRAY[$D$%Bahariya%$D$, $D$%Bawiti%$D$, $D$%Western Desert%$D$],
   ARRAY[$D$%White Desert%$D$, $D$%Black Desert%$D$, $D$%Crystal%$D$, $D$%Farafra%$D$],
   $D$Palm groves and springs at Bahariya Oasis in the Western Desert$D$,
   $D$Today is mostly a road day, and it is worth saying so plainly. Bahariya is several hours southwest of Cairo on a single desert road, and the drive is empty rather than scenic for most of its length. The oasis itself arrives suddenly: palm groves, springs and mud brick, dropped into a depression in the middle of nothing. You transfer to a four wheel drive here, because the vehicle that brought you from Cairo cannot go where the rest of this week goes. There is time in the afternoon for the hot springs above the town, and an early night, since the desert starts tomorrow.$D$),
  (3,
   $D$Black Desert$D$,
   $D$The Black Desert: Volcanic Ground$D$,
   28.2000, 28.9000,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Desert camp, White Desert$D$,
   ARRAY[$D$%Black Desert%$D$, $D$%volcanic%$D$, $D$%Western Desert%$D$],
   ARRAY[$D$%White Desert%$D$, $D$%Crystal%$D$, $D$%Bahariya%$D$, $D$%Farafra%$D$],
   $D$The dark volcanic hills of the Black Desert south of Bahariya$D$,
   $D$The Black Desert begins within half an hour of leaving Bahariya, and the change is abrupt. The hills here are capped with dark dolerite that has weathered down over the sand, so the whole landscape reads as scorched rather than coloured. You can climb one of the smaller cones, and from the top the pattern of them running south becomes clear in a way it never is from the road. The drive continues south through the afternoon and the ground lightens as you go. Camp is set in the open, and this is the first of four nights with no building of any kind between you and the sky.$D$),
  (4,
   $D$White Desert$D$,
   $D$The White Desert: Chalk and a Night Outside$D$,
   27.2333, 28.1833,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Desert camp, White Desert$D$,
   ARRAY[$D$%White Desert%$D$, $D$%chalk%$D$, $D$%rock formation%$D$],
   ARRAY[$D$%Black Desert%$D$, $D$%Crystal%$D$, $D$%Bahariya%$D$],
   $D$Wind carved chalk formations standing on the sand of the White Desert$D$,
   $D$This is what the tour is named for. The chalk formations stand clear of the sand in shapes the wind has cut over a very long time, and the ones that have names have them because somebody thought they looked like a mushroom or a chicken or a sphinx. The whole plateau was seabed, and the chalk is what settled out of it. Late afternoon is when to walk among them, because the low sun puts the shapes into relief and the white turns orange for about half an hour. After dark the sky here is as dark as it gets anywhere in Egypt, with no town within a night's drive to spoil it. Dinner is cooked at the camp and eaten outside.$D$),
  (5,
   $D$Crystal Mountain$D$,
   $D$Crystal Mountain and the Open Plain$D$,
   27.6333, 28.3167,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Desert camp, White Desert$D$,
   ARRAY[$D$%Crystal Mountain%$D$, $D$%quartz%$D$, $D$%White Desert%$D$],
   ARRAY[$D$%Black Desert%$D$, $D$%Bahariya%$D$, $D$%Farafra%$D$],
   $D$The quartz ridge of Crystal Mountain in the Western Desert$D$,
   $D$Crystal Mountain is a ridge of quartz and calcite standing beside the road between Bahariya and Farafra, with a natural arch through the middle of it. It is smaller than the name suggests and more interesting than the name suggests, because the whole thing glitters in the sun and the ground around it is scattered with broken crystal. The rest of the day runs across the open plain, which is flat, pale and completely empty. There are fossil beds out here from when this was under water, and the shells lie on the surface where the wind has stripped the sand off them. A second night in the same part of the desert, with the camp moved.$D$),
  (6,
   $D$Farafra$D$,
   $D$Farafra: The Oasis at the End of the Road$D$,
   27.0589, 27.9708,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Desert camp, White Desert$D$,
   ARRAY[$D$%Farafra%$D$, $D$%oasis%$D$, $D$%Western Desert%$D$],
   ARRAY[$D$%Bahariya%$D$, $D$%White Desert%$D$, $D$%Siwa%$D$],
   $D$Mud brick houses and palm groves at Farafra oasis$D$,
   $D$Farafra is the smallest and most isolated of the Western Desert oases, and it feels it. The town is mud brick and palm, with a population small enough that nothing about it has been arranged for visitors. Bir Sitta, one of the hot springs outside it, is the place people actually swim, and the water comes out of the ground warm enough to be a surprise. There is a local museum built by an artist from the town which is worth an hour and takes most people by surprise. You are back in the desert for the night.$D$),
  (7,
   $D$Bahariya Oasis$D$,
   $D$Bahariya: The Return Leg and the Springs$D$,
   28.3500, 28.8667,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Bahariya Oasis$D$,
   ARRAY[$D$%Bahariya%$D$, $D$%Bawiti%$D$, $D$%hot spring%$D$],
   ARRAY[$D$%White Desert%$D$, $D$%Black Desert%$D$, $D$%Crystal%$D$, $D$%Farafra%$D$],
   $D$Palm groves and springs at Bahariya Oasis in the Western Desert$D$,
   $D$The drive north retraces the route, and the landscape runs backwards from white to black to ordinary sand. Back at Bahariya there is time for what the outward day did not have room for: the Golden Mummies museum, the small tombs in the ridge above the town, and the salt lake at its edge. After four nights outside, a room and a shower are a larger event than they sound. The evening at the springs is the last of the desert, and it is the right place to end it.$D$),
  (8,
   $D$Cairo$D$,
   $D$Cairo: Departure$D$,
   30.0444, 31.2357,
   ARRAY[$D$Breakfast$D$],
   $D$$D$,
   ARRAY[$D$%airport%$D$, $D$%Cairo skyline%$D$, $D$%Cairo%$D$],
   ARRAY[$D$%Giza%$D$, $D$%Coptic%$D$, $D$%Al-Muizz%$D$, $D$%Islamic Cairo%$D$, $D$%Egyptian Museum%$D$, $D$%Ibn Tulun%$D$, $D$%Saqqara%$D$, $D$%desert%$D$, $D$%Bahariya%$D$],
   $D$The Cairo skyline from the Nile before departure$D$,
   $D$The road back to Cairo takes most of the day, and it is the same long empty drive in reverse. You leave early so the distance is behind you before the afternoon, with stops for food and for standing up when you want them rather than on a schedule. The city arrives as a shock after a week of nothing, which is a large part of why people do this trip in this order. The transfer runs to the terminal with the same assistance through check in that you had on arrival.$D$)),
resolved AS (
  SELECT s.*, hit.url AS image_url, hit.alt_en AS image_alt
  FROM spec s
  LEFT JOIN LATERAL (
    SELECT m.url, m.alt_en
    FROM unnest(s.patterns) WITH ORDINALITY AS p(pat, ord)
    JOIN media m ON m.alt_en ILIKE p.pat
    WHERE m.url <> $D$$D$
      AND (p.ord = 1 OR NOT (m.alt_en ILIKE ANY (s.excludes)))
      AND (m.mime_type LIKE $D$image/%$D$ OR m.url ~* $D$[.](webp|jpe?g|png|avif)$$D$)
    ORDER BY p.ord, m.id
    LIMIT 1
  ) AS hit ON TRUE
)
UPDATE tours t
SET itinerary = (
  SELECT jsonb_agg(
    jsonb_build_object(
      $D$day$D$,           r.day,
      $D$title$D$,         r.title,
      $D$description$D$,   r.description,
      $D$activities$D$,    $D$[]$D$::jsonb,
      $D$lat$D$,           r.lat,
      $D$lng$D$,           r.lng,
      $D$placeName$D$,     r.place_name,
      $D$image$D$,         COALESCE(r.image_url, $D$PENDING_UPLOAD$D$),
      $D$imageAlt$D$,      COALESCE(r.image_alt, r.alt_fallback),
      $D$accommodation$D$, r.accommodation,
      $D$meals$D$,         to_jsonb(r.meals)
    )
    ORDER BY r.day
  )
  FROM resolved r
)
WHERE t.slug = $D$white-desert-luxury-camping$D$;

-- Rolls the file back rather than leaving a half written itinerary. The old
-- JSON for two of these six had missing days in the middle, so the 1..n check
-- is the point of this block rather than a formality.
DO $GUARD$
DECLARE
  n int; gaps int; dupes int;
BEGIN
  SELECT jsonb_array_length(itinerary) INTO n FROM tours WHERE slug = $D$white-desert-luxury-camping$D$;
  IF n IS DISTINCT FROM 8 THEN
    RAISE EXCEPTION $D$expected 8 days, got %$D$, n;
  END IF;

  SELECT count(*) INTO gaps
  FROM tours t, jsonb_array_elements(t.itinerary) WITH ORDINALITY AS e(d, ord)
  WHERE t.slug = $D$white-desert-luxury-camping$D$ AND (e.d->>$D$day$D$)::int <> e.ord;
  IF gaps > 0 THEN
    RAISE EXCEPTION $D$day numbers are not 1..8 in order$D$;
  END IF;

  SELECT count(*) INTO dupes FROM (
    SELECT e.d->>$D$image$D$ AS img
    FROM tours t, jsonb_array_elements(t.itinerary) AS e(d)
    WHERE t.slug = $D$white-desert-luxury-camping$D$ AND e.d->>$D$image$D$ <> $D$PENDING_UPLOAD$D$
    GROUP BY 1 HAVING count(*) > 1
  ) x;
  IF dupes > 0 THEN
    RAISE NOTICE $D$% photograph(s) are used on more than one day; see the SHARED rows below$D$, dupes;
  END IF;
END
$GUARD$;

COMMIT;

\echo
\echo white-desert-luxury-camping

SELECT jsonb_array_length(itinerary) AS day_count
FROM tours WHERE slug = $D$white-desert-luxury-camping$D$;

SELECT
  (d->>$D$day$D$)::int   AS day,
  d->>$D$placeName$D$    AS place_name,
  CASE WHEN d->>$D$image$D$ = $D$PENDING_UPLOAD$D$
       THEN $D$FALLBACK, needs upload$D$ ELSE $D$resolved$D$ END AS image_status,
  CASE WHEN d->>$D$image$D$ <> $D$PENDING_UPLOAD$D$
        AND count(*) OVER (PARTITION BY d->>$D$image$D$) > 1
       THEN $D$SHARED with another day$D$ ELSE $D$$D$ END AS note,
  d->>$D$accommodation$D$ AS accommodation
FROM tours t, jsonb_array_elements(t.itinerary) AS d
WHERE t.slug = $D$white-desert-luxury-camping$D$
ORDER BY 1;
