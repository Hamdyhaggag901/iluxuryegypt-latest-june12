-- Rewrites the itinerary for 7-day-egypt-tour (Egypt Tours for Solo Travellers).
--
--   psql "$DATABASE_URL" -f content-updates/solo-7-day.sql
--
-- Seven days, unchanged. Day 1 is arrival only and day 7 is departure only.
--
-- IMAGES
-- No image UUID is written here. Each day carries an ordered list of LIKE
-- patterns plus a list of patterns to exclude, and the script resolves them
-- against media.alt_en at run time: the first include pattern that matches
-- anything wins, and within that pattern the lowest id wins, so a re-run
-- returns the same row rather than a different one each time. Include patterns
-- run from the day's own subject outwards to the city or region, so a day
-- whose specific photograph has not been uploaded still lands on something of
-- the right place instead of failing outright.
--
-- The exclude list is what stops a broad fallback stealing the next day's
-- subject. Testing this against a fixture library, the Siwa arrival day and
-- the Great Sand Sea day both resolved to the same dune photograph through a
-- bare %Siwa% pattern, and a %desert road% pattern on the drive back from Siwa
-- matched a Giza sunrise. Both are excluded by name below.
--
-- Exclusions apply from the second pattern onwards, never to the first. The
-- first pattern is the day's own subject and must not be vetoed: excluding
-- %Great Pyramid% to keep the arrival day off the plateau also threw away the
-- one Mena House photograph, because its alt text mentions the pyramid behind
-- the gardens. Guarding only the fallbacks fixes that without letting a broad
-- pattern wander.
--
-- Where nothing matches at all, the image is set to PENDING_UPLOAD, which is
-- the value the tour page and the brochure both have a fallback panel for.
-- ILIKE rather than LIKE, because alt text in the library is written as
-- sentences and the capitalisation of a place inside one is not something
-- this script should have to predict. Rows that are not images are skipped, so
-- a video whose alt text names the right place cannot land in a day slot.
--
-- imageAlt is taken from the same media row, so the alt text describes the
-- photograph that is actually on the page. The written fallback alt below is
-- used only when the image itself falls back to PENDING_UPLOAD.
--
-- KEY SET
-- Eleven keys per day: day, title, description, activities, lat, lng,
-- placeName, image, imageAlt, accommodation, meals. The brief's day object
-- lists ten of them (it says nine, but the example carries ten) and its
-- accommodation section adds the eleventh. activities is empty on every day,
-- matching the existing data. jsonb does not preserve key order, so the order
-- keys read back in is Postgres's own, not this file's.
--
-- Safe to run twice: itinerary is replaced with =, never appended to with ||,
-- the image lookup is deterministic, and updated_at is deliberately not
-- touched, so a second run is a true no-op. If the tour's dateModified should
-- move when this runs, add updated_at = now() to the SET list.
--
-- Dollar quoting ($D$) on every text value, so apostrophes are written once
-- and never doubled.

\set ON_ERROR_STOP on

BEGIN;

DO $GUARD$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $D$7-day-egypt-tour$D$) THEN
    RAISE EXCEPTION $D$tour 7-day-egypt-tour not found; nothing was changed$D$;
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
   ARRAY[$D$%Sphinx%$D$, $D$%Great Pyramid%$D$, $D$%Pyramids of Giza%$D$, $D$%Dahshur%$D$, $D$%Saqqara%$D$],
   $D$Marriott Mena House at Giza with the pyramid plateau behind it$D$,
   $D$Your flight lands at Cairo and you are met inside the terminal, before the immigration hall rather than after it. The visa, the passport queue and the bags are handled for you while you wait somewhere cooler. The drive out to Giza crosses the whole city, so it takes longer in the evening than the map suggests. You check in at the Marriott Mena House and the day ends there. Nothing else is scheduled, because a first evening spent sleeping is worth more than a site seen badly.$D$),
  (2,
   $D$Pyramids of Giza$D$,
   $D$Giza: The Plateau at First Light and the Grand Egyptian Museum$D$,
   29.9792, 31.1342,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Marriott Mena House, Cairo$D$,
   ARRAY[$D$%Pyramids of Giza%$D$, $D$%Giza plateau%$D$, $D$%Great Pyramid%$D$, $D$%Sphinx%$D$, $D$%Giza%$D$],
   ARRAY[$D$%Mena House%$D$, $D$%Dahshur%$D$, $D$%Saqqara%$D$],
   $D$The Giza plateau at first light with the Great Pyramid and the Sphinx$D$,
   $D$You are on the plateau early, before the coaches come out from the city and while the light is still low. Your guide works outward from the Great Pyramid. The differences between the three only become obvious once you are standing among them rather than looking from the road. The Sphinx follows, approached along the causeway, which is the line it was carved to be seen from. The afternoon belongs to the Grand Egyptian Museum, where the Tutankhamun material is shown as a single assemblage rather than split between buildings. Travelling alone, you decide how long to spend in each gallery, and in a museum this size that is not a small thing.$D$),
  (3,
   $D$Dahshur$D$,
   $D$Dahshur and Saqqara: Three Pyramids and a Mosque$D$,
   29.8086, 31.2062,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Four Seasons Hotel Cairo at The First Residence$D$,
   ARRAY[$D$%Dahshur%$D$, $D$%Red Pyramid%$D$, $D$%Bent Pyramid%$D$, $D$%Saqqara%$D$, $D$%Ibn Tulun%$D$],
   ARRAY[$D$%Giza%$D$, $D$%Mena House%$D$],
   $D$The Red Pyramid at Dahshur standing alone on open desert$D$,
   $D$South of Giza the crowds thin quickly, and Dahshur is usually close to empty. You can go down inside the Red Pyramid, along a passage that is low, steep and warm, which is easier to do at your own pace than at a group's. The Bent Pyramid stands a short drive further on, still carrying much of its original casing at the base, and it is the clearest evidence anywhere of what these monuments looked like finished. Saqqara comes after lunch, where the Step Pyramid is the oldest of them all and still reads as an experiment rather than a settled form. The day ends at Ibn Tulun, whose courtyard is the quietest large space in Cairo.$D$),
  (4,
   $D$Valley of the Kings$D$,
   $D$Luxor: The Flight South, the Valley of the Kings and Deir el-Medina$D$,
   25.7402, 32.6014,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Sofitel Winter Palace Luxor$D$,
   ARRAY[$D$%Valley of the Kings%$D$, $D$%Deir el-Medina%$D$, $D$%west bank%$D$, $D$%Luxor%$D$],
   ARRAY[$D$%Karnak%$D$, $D$%Luxor Temple%$D$, $D$%Dendera%$D$, $D$%Winter Palace%$D$],
   $D$Tomb entrances cut into the hillside at the Valley of the Kings$D$,
   $D$A short morning flight puts you in Luxor before the heat builds. You cross to the west bank in the afternoon for the Valley of the Kings, where the general ticket admits you to a set number of tombs and your guide chooses them by what is open and least crowded that day. Seti I and Tutankhamun carry their own tickets, and whether they are worth it is a conversation to have on the spot rather than in advance. Deir el-Medina closes the day: the village where the men who cut those tombs lived, with their own small tombs on the slope above it, painted for themselves rather than for a king, and it is the one site of the week where the scale drops to something human.$D$),
  (5,
   $D$Dendera Temple$D$,
   $D$Dendera: The Painted Ceiling of Hathor$D$,
   26.1417, 32.6700,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Sofitel Winter Palace Luxor$D$,
   ARRAY[$D$%Dendera%$D$, $D$%Hathor%$D$],
   ARRAY[$D$%Abydos%$D$],
   $D$The painted ceiling of the Temple of Hathor at Dendera$D$,
   $D$Dendera is a drive north along the river, and the road is part of the point, because it runs through farmland rather than desert. The temple of Hathor is among the most complete in Egypt, and the reason to come is overhead. Its ceiling was cleaned of centuries of soot only recently, and the blues and golds that came out from under it are close to what was first painted there. You can climb to the roof chapels and go down into a crypt reached by a narrow stair. Few coaches make the trip, so the hypostyle hall is usually yours to stand in.$D$),
  (6,
   $D$Philae Temple$D$,
   $D$Aswan: Philae by Boat and a Nubian Afternoon$D$,
   24.0256, 32.8844,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Sofitel Legend Old Cataract Aswan$D$,
   ARRAY[$D$%Philae%$D$, $D$%Nubian%$D$, $D$%Aswan%$D$],
   ARRAY[$D$%Abu Simbel%$D$, $D$%Old Cataract%$D$, $D$%Kom Ombo%$D$],
   $D$Philae Temple on its island seen from the water at Aswan$D$,
   $D$You fly to Aswan and reach Philae by boat, which is the only way onto the island. The temple was cut up and moved here when the High Dam raised the water. The island it was built on is now under the lake. Isis was still worshipped at Philae after the rest of Egypt had turned Christian, which is why the carving runs so late and why crosses are cut over some of it. The afternoon goes to a Nubian village, where the houses are painted, the doorways are low and bright, and the language spoken at home is not Arabic. It is the one afternoon of the week where you are a guest rather than a visitor.$D$),
  (7,
   $D$Cairo$D$,
   $D$Cairo: Departure$D$,
   30.0444, 31.2357,
   ARRAY[$D$Breakfast$D$],
   $D$$D$,
   ARRAY[$D$%Cairo skyline%$D$, $D$%airport%$D$, $D$%Cairo%$D$],
   ARRAY[$D$%Giza%$D$, $D$%Coptic%$D$, $D$%Al-Muizz%$D$, $D$%Islamic Cairo%$D$, $D$%Egyptian Museum%$D$, $D$%Ibn Tulun%$D$],
   $D$The Cairo skyline from the Nile before an evening departure$D$,
   $D$A morning flight returns you to Cairo. If your onward departure is late enough there is room for one more stop on the way, and your planner will have asked in advance which you would rather it was. Otherwise the transfer runs straight to the terminal, with the same assistance through check in that you had on arrival. You will have moved between Cairo, Luxor and Aswan in six nights, and the flights are the reason a week this short does not feel rushed.$D$)),
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
WHERE t.slug = $D$7-day-egypt-tour$D$;

-- Raises rather than leaving a half written itinerary behind. A repeated
-- photograph is a notice, not a failure: it is worth seeing but it is not a
-- reason to roll back a content update.
DO $GUARD$
DECLARE
  n     int;
  gaps  int;
  dupes int;
BEGIN
  SELECT jsonb_array_length(itinerary) INTO n FROM tours WHERE slug = $D$7-day-egypt-tour$D$;
  IF n IS DISTINCT FROM 7 THEN
    RAISE EXCEPTION $D$expected 7 days, got %$D$, n;
  END IF;

  SELECT count(*) INTO gaps
  FROM tours t, jsonb_array_elements(t.itinerary) WITH ORDINALITY AS e(d, ord)
  WHERE t.slug = $D$7-day-egypt-tour$D$ AND (e.d->>$D$day$D$)::int <> e.ord;
  IF gaps > 0 THEN
    RAISE EXCEPTION $D$day numbers are not 1..7 in order$D$;
  END IF;

  SELECT count(*) INTO dupes FROM (
    SELECT e.d->>$D$image$D$ AS img
    FROM tours t, jsonb_array_elements(t.itinerary) AS e(d)
    WHERE t.slug = $D$7-day-egypt-tour$D$ AND e.d->>$D$image$D$ <> $D$PENDING_UPLOAD$D$
    GROUP BY 1 HAVING count(*) > 1
  ) x;
  IF dupes > 0 THEN
    RAISE NOTICE $D$% photograph(s) are used on more than one day; see the SHARED rows below$D$, dupes;
  END IF;
END
$GUARD$;

COMMIT;

\echo
\echo 7-day-egypt-tour

SELECT jsonb_array_length(itinerary) AS day_count
FROM tours WHERE slug = $D$7-day-egypt-tour$D$;

SELECT
  (d->>$D$day$D$)::int   AS day,
  d->>$D$placeName$D$    AS place_name,
  CASE WHEN d->>$D$image$D$ = $D$PENDING_UPLOAD$D$
       THEN $D$FALLBACK, needs upload$D$
       ELSE $D$resolved$D$ END AS image_status,
  CASE WHEN d->>$D$image$D$ <> $D$PENDING_UPLOAD$D$
        AND count(*) OVER (PARTITION BY d->>$D$image$D$) > 1
       THEN $D$SHARED with another day$D$
       ELSE $D$$D$ END AS note,
  d->>$D$image$D$        AS image
FROM tours t, jsonb_array_elements(t.itinerary) AS d
WHERE t.slug = $D$7-day-egypt-tour$D$
ORDER BY 1;
