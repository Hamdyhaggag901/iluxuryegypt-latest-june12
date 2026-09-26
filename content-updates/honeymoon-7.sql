-- Rewrites the itinerary for all-inclusive-romantic-vacations-egypt-honeymoon.
--
--   psql "$DATABASE_URL" -f content-updates/honeymoon-7.sql
--
-- Seven days, unchanged. The shortest of the three honeymoon tours and the
-- most resort weighted: two days of monuments, one in Luxor, then the Red Sea
-- for the back half. It is the only one of the six that ends on a beach, and
-- the only one that uses Hurghada at all.
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
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $D$all-inclusive-romantic-vacations-egypt-honeymoon$D$) THEN
    RAISE EXCEPTION $D$tour all-inclusive-romantic-vacations-egypt-honeymoon not found; nothing was changed$D$;
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
   ARRAY[$D$%Sphinx%$D$, $D$%Great Pyramid%$D$, $D$%Pyramids of Giza%$D$, $D$%Saqqara%$D$],
   $D$Marriott Mena House at Giza with the pyramid plateau behind it$D$,
   $D$Your flight lands at Cairo and you are met inside the terminal, before the immigration hall rather than after it. The visa, the passport queue and the bags are handled for you while you wait. The drive out to Giza crosses the whole city, so it takes longer in the evening than the map suggests. You check in at the Marriott Mena House, and the rest of the day belongs to the two of you. Nothing is scheduled, because a first evening spent recovering from a flight is worth more than a site seen badly.$D$),
  (2,
   $D$Pyramids of Giza$D$,
   $D$Giza: The Plateau and the Sphinx$D$,
   29.9792, 31.1342,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Marriott Mena House, Cairo$D$,
   ARRAY[$D$%Pyramids of Giza%$D$, $D$%Giza plateau%$D$, $D$%Great Pyramid%$D$, $D$%Sphinx%$D$, $D$%Giza%$D$],
   ARRAY[$D$%Mena House%$D$, $D$%Saqqara%$D$, $D$%Dahshur%$D$],
   $D$The Giza plateau at first light with the Great Pyramid and the Sphinx$D$,
   $D$You are on the plateau early, before the coaches come out from the city and while the light is still low. Your guide works outward from the Great Pyramid, and the differences between the three only become obvious once you are standing among them. The Sphinx follows, approached along the causeway rather than from the viewing terrace. Going inside the Great Pyramid is possible and suits some people and not others, so it is left as a decision for the morning rather than a fixed item. The afternoon is deliberately short, because the flight south leaves early tomorrow.$D$),
  (3,
   $D$Karnak Temple$D$,
   $D$Luxor: Karnak and Luxor Temple in a Day$D$,
   25.7188, 32.6573,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Sofitel Winter Palace Luxor$D$,
   ARRAY[$D$%Karnak%$D$, $D$%Luxor Temple%$D$, $D$%Luxor%$D$],
   ARRAY[$D$%Valley of the%$D$, $D$%Winter Palace%$D$, $D$%Medinet Habu%$D$, $D$%Hatshepsut%$D$],
   $D$The hypostyle hall at Karnak Temple in Luxor$D$,
   $D$A morning flight puts you in Luxor before the heat builds. Karnak is the one unmissable thing on a week this short, and you see it early, while the hypostyle hall is still empty enough for the scale to register. The afternoon is free at the Winter Palace, whose garden is the quietest place in central Luxor. Luxor Temple comes after dark, when it is lit and the avenue of sphinxes running north out of it is picked out. This is the last of the temples, and the itinerary is arranged that way on purpose.$D$),
  (4,
   $D$Hurghada$D$,
   $D$The Red Sea: Crossing to the Coast$D$,
   27.2579, 33.8116,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$The Oberoi Beach Resort, Sahl Hasheesh$D$,
   ARRAY[$D$%Hurghada%$D$, $D$%Red Sea%$D$, $D$%Sahl Hasheesh%$D$],
   ARRAY[$D$%Nile%$D$, $D$%Luxor%$D$],
   $D$The Red Sea coast at Hurghada seen from the shore$D$,
   $D$The road east from Luxor to the coast crosses open desert and takes most of the morning. It is a real transfer rather than a scenic drive, and it is worth knowing that before you set off. What changes at the end of it is the whole character of the trip: you arrive at Sahl Hasheesh in the early afternoon and nothing further is planned. Check in, swim, and let the first three days settle.$D$),
  (5,
   $D$Sahl Hasheesh$D$,
   $D$Sahl Hasheesh: The Reef from the Beach$D$,
   27.0333, 33.8833,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$The Oberoi Beach Resort, Sahl Hasheesh$D$,
   ARRAY[$D$%Sahl Hasheesh%$D$, $D$%Red Sea reef%$D$, $D$%Red Sea%$D$, $D$%Hurghada%$D$],
   ARRAY[]::text[],
   $D$The Red Sea reef seen through clear water at Sahl Hasheesh$D$,
   $D$The reef here begins close enough to the shore that you can reach it without a boat. The water is clear in a way the Nile never is, and the fish are close in, which makes this a good place to snorkel for the first time. There is nothing on the schedule today. Diving and boat trips are arranged locally rather than booked in advance, so you can decide over breakfast whether you want one. For most couples this is the day the honeymoon actually starts.$D$),
  (6,
   $D$Red Sea$D$,
   $D$The Red Sea: A Day You Plan Yourselves$D$,
   27.0400, 33.8950,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$The Oberoi Beach Resort, Sahl Hasheesh$D$,
   ARRAY[$D$%Red Sea%$D$, $D$%Sahl Hasheesh%$D$, $D$%Hurghada%$D$],
   ARRAY[$D$%Nile%$D$, $D$%Luxor%$D$],
   $D$Clear shallow water and reef on the Red Sea coast$D$,
   $D$A second full day on the coast, unplanned on purpose. Some couples take a boat out to the further reefs, some spend the whole day between the water and the shade and consider it time well used. The one thing worth doing before the light goes is walking the shoreline at the south end of the bay, which empties out in the late afternoon. Dinner is somewhere you choose rather than somewhere you are taken.$D$),
  (7,
   $D$Cairo$D$,
   $D$Cairo: Departure$D$,
   30.0444, 31.2357,
   ARRAY[$D$Breakfast$D$],
   $D$$D$,
   ARRAY[$D$%airport%$D$, $D$%Cairo skyline%$D$, $D$%Cairo%$D$],
   ARRAY[$D$%Giza%$D$, $D$%Coptic%$D$, $D$%Al-Muizz%$D$, $D$%Islamic Cairo%$D$, $D$%Egyptian Museum%$D$, $D$%Ibn Tulun%$D$, $D$%Saqqara%$D$, $D$%Red Sea%$D$, $D$%Hurghada%$D$],
   $D$The Cairo skyline from the Nile before departure$D$,
   $D$A short flight brings you back to Cairo. Depending on when you fly home there may be room for a last stop on the way to the airport, and your planner will have asked in advance which you would prefer. Otherwise the transfer runs straight to the terminal, with the same assistance through check in that you had on arrival. Seven days is short for Egypt, and this one deliberately trades breadth for two days of doing nothing at all.$D$)),
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
WHERE t.slug = $D$all-inclusive-romantic-vacations-egypt-honeymoon$D$;

-- Rolls the file back rather than leaving a half written itinerary. The old
-- JSON for two of these six had missing days in the middle, so the 1..n check
-- is the point of this block rather than a formality.
DO $GUARD$
DECLARE
  n int; gaps int; dupes int;
BEGIN
  SELECT jsonb_array_length(itinerary) INTO n FROM tours WHERE slug = $D$all-inclusive-romantic-vacations-egypt-honeymoon$D$;
  IF n IS DISTINCT FROM 7 THEN
    RAISE EXCEPTION $D$expected 7 days, got %$D$, n;
  END IF;

  SELECT count(*) INTO gaps
  FROM tours t, jsonb_array_elements(t.itinerary) WITH ORDINALITY AS e(d, ord)
  WHERE t.slug = $D$all-inclusive-romantic-vacations-egypt-honeymoon$D$ AND (e.d->>$D$day$D$)::int <> e.ord;
  IF gaps > 0 THEN
    RAISE EXCEPTION $D$day numbers are not 1..7 in order$D$;
  END IF;

  SELECT count(*) INTO dupes FROM (
    SELECT e.d->>$D$image$D$ AS img
    FROM tours t, jsonb_array_elements(t.itinerary) AS e(d)
    WHERE t.slug = $D$all-inclusive-romantic-vacations-egypt-honeymoon$D$ AND e.d->>$D$image$D$ <> $D$PENDING_UPLOAD$D$
    GROUP BY 1 HAVING count(*) > 1
  ) x;
  IF dupes > 0 THEN
    RAISE NOTICE $D$% photograph(s) are used on more than one day; see the SHARED rows below$D$, dupes;
  END IF;
END
$GUARD$;

COMMIT;

\echo
\echo all-inclusive-romantic-vacations-egypt-honeymoon

SELECT jsonb_array_length(itinerary) AS day_count
FROM tours WHERE slug = $D$all-inclusive-romantic-vacations-egypt-honeymoon$D$;

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
WHERE t.slug = $D$all-inclusive-romantic-vacations-egypt-honeymoon$D$
ORDER BY 1;
