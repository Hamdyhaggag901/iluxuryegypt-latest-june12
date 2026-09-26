-- Rewrites the itinerary for 10-day-spiritual-egypt.
--
--   psql "$DATABASE_URL" -f content-updates/spiritual-10.sql
--
-- Ten days, unchanged. The temple route, and already the most coherent of the
-- three spiritual tours. The main change is the arrival day at the front, which
-- the old version did not have: it opened straight onto the Giza plateau. Abu
-- Simbel comes out, which keeps it clear of the fourteen day sacred journey and
-- leaves Abu Simbel on two of the six rather than three.
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
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $D$10-day-spiritual-egypt$D$) THEN
    RAISE EXCEPTION $D$tour 10-day-spiritual-egypt not found; nothing was changed$D$;
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
   $D$Your flight lands at Cairo and you are met inside the terminal, before the immigration hall. The visa, the queue and the bags are handled for you while you wait. The drive out to Giza crosses the whole city and takes longer in the evening than the map suggests. You check in at the Marriott Mena House and the day ends there, with no site and no schedule. Ten days of temples starts tomorrow, and starting it tired is a poor trade.$D$),
  (2,
   $D$Pyramids of Giza$D$,
   $D$Giza: The Plateau$D$,
   29.9792, 31.1342,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Marriott Mena House, Cairo$D$,
   ARRAY[$D$%Pyramids of Giza%$D$, $D$%Giza plateau%$D$, $D$%Great Pyramid%$D$, $D$%Sphinx%$D$, $D$%Giza%$D$],
   ARRAY[$D$%Mena House%$D$, $D$%Saqqara%$D$, $D$%Step Pyramid%$D$],
   $D$The Giza plateau at first light with the Great Pyramid and the Sphinx$D$,
   $D$You are on the plateau early, before the coaches arrive and while the light is still low. The three pyramids are taken in turn, and the engineering changes visibly across them even though they were built within a century of each other. Going inside the Great Pyramid is possible and the Grand Gallery is the reason to do it, though the passage to reach it is low, steep and warm. The Sphinx follows along the causeway. The afternoon is left open, because the next eight days are dense and the front of a trip is the cheapest place to put a free half day.$D$),
  (3,
   $D$Saqqara$D$,
   $D$Saqqara: The Oldest of Them All$D$,
   29.8712, 31.2165,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Four Seasons Hotel Cairo at The First Residence$D$,
   ARRAY[$D$%Step Pyramid%$D$, $D$%Saqqara%$D$, $D$%Djoser%$D$],
   ARRAY[$D$%Giza%$D$, $D$%Mena House%$D$, $D$%Serapeum%$D$],
   $D$The Step Pyramid of Djoser at Saqqara in late afternoon light$D$,
   $D$Saqqara is where the whole idea of a pyramid starts. Djoser's Step Pyramid predates everything at Giza and still reads as an experiment rather than a settled form, six mastabas stacked and then encased. The surrounding complex was built to be walked through rather than looked at, and the dummy buildings along its processional route were never meant to be entered by anyone living. The tomb chapels nearby hold reliefs of ordinary work rather than gods, which is a useful corrective this early in a trip about temples. You move into Cairo for the night, ready for the flight south.$D$),
  (4,
   $D$Dendera Temple$D$,
   $D$Dendera: The Painted Ceiling of Hathor$D$,
   26.1417, 32.6700,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Sofitel Winter Palace Luxor$D$,
   ARRAY[$D$%Dendera%$D$, $D$%Hathor%$D$],
   ARRAY[$D$%Abydos%$D$, $D$%Karnak%$D$, $D$%Winter Palace%$D$],
   $D$The painted ceiling of the Temple of Hathor at Dendera after cleaning$D$,
   $D$A morning flight puts you in Luxor, and you drive straight north to Dendera rather than starting on the east bank. The temple of Hathor is among the most complete in Egypt and the reason to come is overhead. Its ceiling was cleaned of centuries of soot relatively recently, and the blues and golds that came out from under it are close to what was first painted there. You can climb to the roof chapels and go down into a crypt reached by a narrow stair. Few coaches make the trip this far north, so the hypostyle hall is usually yours to stand in.$D$),
  (5,
   $D$Abydos Temple$D$,
   $D$Abydos: Seti I and the King List$D$,
   26.1847, 31.9192,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Sofitel Winter Palace Luxor$D$,
   ARRAY[$D$%Abydos%$D$, $D$%Seti I%$D$, $D$%Osireion%$D$],
   ARRAY[$D$%Dendera%$D$, $D$%Karnak%$D$, $D$%Winter Palace%$D$],
   $D$Raised relief carving in the Temple of Seti I at Abydos$D$,
   $D$Abydos is about three hours north of Luxor and the drive is the price of the best carving in Egypt. The raised relief in Seti I's temple still holds pigment in places, and the quality of the cutting is not matched anywhere else. The king list on one wall names his predecessors in order, with the ones he preferred to forget left off it. Abydos was the cult centre of Osiris and a place people were buried or memorialised for thousands of years, which is why the ground around the temple is so thick with earlier material. It is a long day and it returns you to Luxor in the evening.$D$),
  (6,
   $D$Karnak Temple$D$,
   $D$Luxor: Karnak$D$,
   25.7188, 32.6573,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Sofitel Winter Palace Luxor$D$,
   ARRAY[$D$%Karnak%$D$, $D$%Luxor Temple%$D$, $D$%Luxor%$D$],
   ARRAY[$D$%Valley of the%$D$, $D$%Hatshepsut%$D$, $D$%Winter Palace%$D$, $D$%Dendera%$D$],
   $D$The hypostyle hall at Karnak Temple in Luxor$D$,
   $D$Karnak is not one temple but roughly two thousand years of them on the same ground, and no single reign accounts for what you walk through. The hypostyle hall is the part everyone remembers, and reaching it before the crowd is the difference between scale and a queue. The sacred lake, the row of Sekhmet statues and the Ptolemaic gate at the back take another hour and most visitors skip all three. Luxor Temple is an optional evening addition, lit after dark, with the cleared avenue of sphinxes running north out of it.$D$),
  (7,
   $D$Hatshepsut Temple$D$,
   $D$Luxor: Deir el-Bahari and the West Bank$D$,
   25.7381, 32.6067,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Sofitel Winter Palace Luxor$D$,
   ARRAY[$D$%Hatshepsut%$D$, $D$%Deir el-Bahari%$D$, $D$%west bank%$D$, $D$%Valley of the Kings%$D$, $D$%Luxor%$D$],
   ARRAY[$D$%Karnak%$D$, $D$%Luxor Temple%$D$, $D$%Winter Palace%$D$],
   $D$Hatshepsut temple terraces at Deir el-Bahari on the Luxor west bank$D$,
   $D$Hatshepsut's temple is cut back into the cliff in three terraces and reads as modern until you are standing on it. The reliefs in the southern colonnade record the expedition to Punt, with the ships, the cargo and the trees carried back in baskets, which is the closest thing Egypt left to a travel account. Her name was chiselled out after her death in a great many places, and the gaps are visible. The Valley of the Kings follows, where the general ticket admits you to a set number of tombs and your guide chooses by what is open that morning. The Colossi of Memnon close the day.$D$),
  (8,
   $D$Aswan$D$,
   $D$Aswan: The River and the Nubian Museum$D$,
   24.0889, 32.8998,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Sofitel Legend Old Cataract Aswan$D$,
   ARRAY[$D$%Aswan%$D$, $D$%Nubian%$D$, $D$%Elephantine%$D$, $D$%felucca%$D$],
   ARRAY[$D$%Philae%$D$, $D$%Abu Simbel%$D$, $D$%Old Cataract%$D$, $D$%Kom Ombo%$D$],
   $D$Feluccas on the Nile at Aswan with Elephantine Island beyond$D$,
   $D$You move south to Aswan, where the river narrows between granite islands and the pace drops. Elephantine has been inhabited for as long as anywhere in Egypt and the excavations on it run from the Old Kingdom to the Roman period on one site. The Nubian Museum is the best single explanation of what the High Dam cost the people who lived behind it, and it is worth an afternoon rather than an hour. A felucca at sunset is the standard way to end the day here and it deserves its reputation.$D$),
  (9,
   $D$Philae Temple$D$,
   $D$Aswan: Philae by Boat$D$,
   24.0256, 32.8844,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Sofitel Legend Old Cataract Aswan$D$,
   ARRAY[$D$%Philae%$D$, $D$%Isis%$D$],
   ARRAY[$D$%Abu Simbel%$D$, $D$%Nubian%$D$, $D$%Old Cataract%$D$, $D$%Elephantine%$D$],
   $D$Philae Temple on its island seen from the approaching boat at Aswan$D$,
   $D$Philae is reached by boat and the approach is part of it, because the temple comes into view across the water the way it was meant to. Isis was worshipped here longer than at any other temple in the country, which is why the carving runs so late and why Christian crosses are cut over parts of it. The whole complex was moved block by block when the High Dam raised the lake over the island it stood on. The kiosk of Trajan at the water's edge is the building everyone photographs and it is the least important thing on the island. It is a fitting last site for a trip built around temples.$D$),
  (10,
   $D$Cairo$D$,
   $D$Cairo: Departure$D$,
   30.0444, 31.2357,
   ARRAY[$D$Breakfast$D$],
   $D$$D$,
   ARRAY[$D$%airport%$D$, $D$%Cairo skyline%$D$, $D$%Cairo%$D$],
   ARRAY[$D$%Giza%$D$, $D$%Coptic%$D$, $D$%Al-Muizz%$D$, $D$%Islamic Cairo%$D$, $D$%Egyptian Museum%$D$, $D$%Ibn Tulun%$D$, $D$%Saqqara%$D$, $D$%Philae%$D$, $D$%Aswan%$D$],
   $D$The Cairo skyline from the Nile before departure$D$,
   $D$You fly back to Cairo in the morning. If your onward departure leaves room, the Museum of Egyptian Civilisation and its royal mummies is the right final hour, because it puts faces to names you have been reading on walls for nine days. Otherwise the transfer runs straight to the terminal with the same assistance you had on arrival. This itinerary was built around temples rather than around cities, which is why it went north to Dendera and Abydos before it went south at all.$D$)),
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
WHERE t.slug = $D$10-day-spiritual-egypt$D$;

-- Rolls the file back rather than leaving a half written itinerary. The old
-- JSON for two of these six had missing days in the middle, so the 1..n check
-- is the point of this block rather than a formality.
DO $GUARD$
DECLARE
  n int; gaps int; dupes int;
BEGIN
  SELECT jsonb_array_length(itinerary) INTO n FROM tours WHERE slug = $D$10-day-spiritual-egypt$D$;
  IF n IS DISTINCT FROM 10 THEN
    RAISE EXCEPTION $D$expected 10 days, got %$D$, n;
  END IF;

  SELECT count(*) INTO gaps
  FROM tours t, jsonb_array_elements(t.itinerary) WITH ORDINALITY AS e(d, ord)
  WHERE t.slug = $D$10-day-spiritual-egypt$D$ AND (e.d->>$D$day$D$)::int <> e.ord;
  IF gaps > 0 THEN
    RAISE EXCEPTION $D$day numbers are not 1..10 in order$D$;
  END IF;

  SELECT count(*) INTO dupes FROM (
    SELECT e.d->>$D$image$D$ AS img
    FROM tours t, jsonb_array_elements(t.itinerary) AS e(d)
    WHERE t.slug = $D$10-day-spiritual-egypt$D$ AND e.d->>$D$image$D$ <> $D$PENDING_UPLOAD$D$
    GROUP BY 1 HAVING count(*) > 1
  ) x;
  IF dupes > 0 THEN
    RAISE NOTICE $D$% photograph(s) are used on more than one day; see the SHARED rows below$D$, dupes;
  END IF;
END
$GUARD$;

COMMIT;

\echo
\echo 10-day-spiritual-egypt

SELECT jsonb_array_length(itinerary) AS day_count
FROM tours WHERE slug = $D$10-day-spiritual-egypt$D$;

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
WHERE t.slug = $D$10-day-spiritual-egypt$D$
ORDER BY 1;
