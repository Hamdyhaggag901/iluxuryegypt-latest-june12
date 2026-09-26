-- Rewrites the itinerary for 10-day-egypt-tour (Egypt Tours for Solo Travellers).
--
--   psql "$DATABASE_URL" -f content-updates/solo-10-day.sql
--
-- Ten days, unchanged. Day 1 is arrival only and day 10 is departure only.
--
-- THE TWO ROAD DAYS ARE NOT PADDING
-- Days 4 and 7 are full day transfers between Cairo and Siwa and back. Siwa is
-- roughly ten hours from Cairo by road and has no civil airport, so there is no
-- version of this itinerary in which the Great Sand Sea and Karnak sit next to
-- each other. Both days say so in plain words rather than calling it a scenic
-- drive. Do not compress them into the days either side.
--
-- Siwa has no confirmed property, so accommodation there stays as the plain
-- string Siwa Oasis rather than an invented hotel name.
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
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $D$10-day-egypt-tour$D$) THEN
    RAISE EXCEPTION $D$tour 10-day-egypt-tour not found; nothing was changed$D$;
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
   ARRAY[$D$%Sphinx%$D$, $D$%Great Pyramid%$D$, $D$%Pyramids of Giza%$D$, $D$%Abu Rawash%$D$],
   $D$Marriott Mena House at Giza with the pyramid plateau behind it$D$,
   $D$You land at Cairo and are met before the immigration hall rather than after it. The visa, the passport queue and the bags are handled while you wait. The car runs out to Giza and you check in at the Marriott Mena House. Nothing is scheduled today and nothing should be, because the road west begins in three days and this itinerary asks more of a traveller than most. The evening is for sleeping.$D$),
  (2,
   $D$Pyramids of Giza$D$,
   $D$Giza: The Plateau and the Ruined Pyramid at Abu Rawash$D$,
   29.9792, 31.1342,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Marriott Mena House, Cairo$D$,
   ARRAY[$D$%Pyramids of Giza%$D$, $D$%Giza plateau%$D$, $D$%Abu Rawash%$D$, $D$%Great Pyramid%$D$, $D$%Giza%$D$],
   ARRAY[$D$%Mena House%$D$],
   $D$The Giza plateau with the ruined pyramid of Abu Rawash beyond$D$,
   $D$The plateau comes first, early, while the light is still flat and the coaches are still in the city. After the three pyramids and the Sphinx the day turns north to Abu Rawash, which almost nobody visits. Djedefre built there instead of at Giza, on higher ground, and what survives is a quarried out base and a deep passage cut down into the rock. Stone was carried away from it for centuries, so the ruin records what happened afterwards as much as what was built. From the top you can see the Giza pyramids on the horizon, which is the whole argument for the detour.$D$),
  (3,
   $D$Coptic Cairo$D$,
   $D$Cairo: Coptic Cairo and the Egyptian Museum$D$,
   30.0055, 31.2300,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Four Seasons Hotel Cairo at The First Residence$D$,
   ARRAY[$D$%Coptic Cairo%$D$, $D$%Hanging Church%$D$, $D$%Ben Ezra%$D$, $D$%Coptic%$D$, $D$%Egyptian Museum%$D$],
   ARRAY[$D$%Grand Egyptian Museum%$D$],
   $D$The Hanging Church in Coptic Cairo above the Roman gatehouse$D$,
   $D$Coptic Cairo sits inside the walls of a Roman fortress. The churches were built on top of it rather than beside it. The Hanging Church is suspended over a gatehouse, and a glass panel in the floor lets you see the drop. Ben Ezra Synagogue is a short walk from it, and three faiths sharing one small quarter is the point of the morning. The afternoon goes to the Egyptian Museum on Tahrir, which still holds the bulk of the collection even after the Tutankhamun material moved out to Giza. It is crowded and unevenly labelled and still better than almost any museum anywhere, and a guide is the difference between a good afternoon and a tiring one.$D$),
  (4,
   $D$Siwa Oasis$D$,
   $D$Siwa: The Road West$D$,
   29.2041, 25.5195,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Siwa Oasis$D$,
   ARRAY[$D$%Siwa Oasis%$D$, $D$%Siwa%$D$],
   ARRAY[$D$%Sand Sea%$D$, $D$%Oracle%$D$, $D$%Aghurmi%$D$, $D$%Shali%$D$, $D$%salt lake%$D$, $D$%Cleopatra%$D$, $D$%dune%$D$],
   $D$The road west across open desert on the drive to Siwa$D$,
   $D$Today is a road day and nothing else. Siwa is roughly ten hours from Cairo by car and there is no civil airport, so this is the only way in. The route runs up to the coast at Marsa Matruh and then turns south into the desert, and the second half is emptier than the first. There are stops for food and for standing up, and because the car is yours they happen when you want them rather than on a schedule. You arrive in the evening, tired, and see nothing today. A day like this is what Siwa costs, and it is better said before you book than after.$D$),
  (5,
   $D$Temple of the Oracle$D$,
   $D$Siwa: The Oracle, Shali and Cleopatra's Spring$D$,
   29.2006, 25.5444,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Siwa Oasis$D$,
   ARRAY[$D$%Oracle%$D$, $D$%Aghurmi%$D$, $D$%Shali%$D$, $D$%Cleopatra%$D$, $D$%Siwa%$D$],
   ARRAY[$D$%Sand Sea%$D$, $D$%salt lake%$D$, $D$%dune%$D$],
   $D$The Temple of the Oracle at Aghurmi above the Siwa palm groves$D$,
   $D$The Temple of the Oracle stands on the rock at Aghurmi, above the palm groves. Alexander came here to be told he was the son of Amun, and whatever he was told was never written down; the ruins themselves are modest, and the position is the reason to climb up to them. Shali follows, the old town built from salt and mud, which partly dissolved when the rain came hard enough, and seeing a dissolved building still standing is a strange half hour. The spring, stone lined and fed from below, is where the day finishes, and swimming in it is an ordinary thing to do rather than an arrangement anyone has to make.$D$),
  (6,
   $D$Great Sand Sea$D$,
   $D$Siwa: The Great Sand Sea and the Salt Lakes$D$,
   29.1500, 25.4000,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Siwa Oasis$D$,
   ARRAY[$D$%Great Sand Sea%$D$, $D$%Sand Sea%$D$, $D$%salt lake%$D$, $D$%dune%$D$],
   ARRAY[$D$%Oracle%$D$, $D$%Aghurmi%$D$, $D$%Shali%$D$],
   $D$Dunes of the Great Sand Sea west of Siwa at sunset$D$,
   $D$The Great Sand Sea starts a short drive from the town and runs west into Libya. You go in by four wheel drive with a local driver, because the dunes move and the route is read rather than mapped. There are fossil beds out there from when all of this was seabed, and the shells lie on the surface where the wind has stripped the sand off them. The salt lakes on the way back are the colour they are because of what is dissolved in them, and they are shallow enough to stand in. Sunset in the dunes is the reason people come to Siwa and then stay longer than they planned.$D$),
  (7,
   $D$Cairo$D$,
   $D$Cairo: The Road Back$D$,
   30.0444, 31.2357,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Four Seasons Hotel Cairo at The First Residence$D$,
   ARRAY[$D$%Marsa Matruh%$D$, $D$%Cairo skyline%$D$, $D$%Cairo%$D$],
   ARRAY[$D$%Giza%$D$, $D$%Coptic%$D$, $D$%Al-Muizz%$D$, $D$%Islamic Cairo%$D$, $D$%Egyptian Museum%$D$, $D$%Ibn Tulun%$D$, $D$%airport%$D$, $D$%Siwa%$D$, $D$%Sand Sea%$D$],
   $D$The desert road east from Marsa Matruh back towards Cairo$D$,
   $D$The same ten hours, in reverse. You leave early so the long middle stretch is behind you before the afternoon, and the desert looks different heading east, which is a small mercy but a real one. Lunch is on the coast at Marsa Matruh, and after that the road fills up as you come back down into the delta. You check in at the Four Seasons in Cairo and the evening is deliberately empty, because tomorrow starts with a flight.$D$),
  (8,
   $D$Karnak Temple$D$,
   $D$Luxor: Karnak and Luxor Temple$D$,
   25.7188, 32.6573,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Sofitel Winter Palace Luxor$D$,
   ARRAY[$D$%Karnak%$D$, $D$%Luxor Temple%$D$, $D$%Luxor%$D$],
   ARRAY[$D$%Valley of the%$D$, $D$%Medinet Habu%$D$, $D$%Winter Palace%$D$, $D$%Deir el-Medina%$D$],
   $D$The hypostyle hall at Karnak Temple in Luxor$D$,
   $D$Karnak was built and rebuilt over roughly two thousand years. No single pharaoh is responsible for what you walk through. The hypostyle hall is the part everyone remembers, its columns carrying a roof that is mostly gone, and it is worth arriving before the hall fills up and the scale stops registering. Luxor Temple is better at the end of the day, when the lights come on and the avenue of sphinxes running north out of it is picked out. The two temples were joined by that avenue, and now that it has been cleared along its whole length the connection between them is something you can see rather than be told. A private guide earns their place here more than anywhere else on this trip, because Karnak without one is a very large pile of stone.$D$),
  (9,
   $D$Abydos Temple$D$,
   $D$Abydos and Dendera: A Long Day North, Then the Flight to Cairo$D$,
   26.1847, 31.9192,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Four Seasons Hotel Cairo at The First Residence$D$,
   ARRAY[$D$%Abydos%$D$, $D$%Seti I%$D$, $D$%Dendera%$D$],
   ARRAY[$D$%Karnak%$D$],
   $D$Raised relief carving in the Temple of Seti I at Abydos$D$,
   $D$This is a long day by road and it earns itself. Abydos is about three hours north of Luxor, and the temple Seti I built there holds the finest raised relief carving in Egypt, with pigment still on it in places. The king list cut into one wall names his predecessors in order, with the ones he preferred to forget left out of it. Dendera comes on the way back, and its cleaned ceiling is the other half of the reason anyone makes this drive. You return to Luxor for an evening flight to Cairo, which is the right way round: the driving happens in daylight and the moving happens after dark.$D$),
  (10,
   $D$Cairo$D$,
   $D$Cairo: Departure$D$,
   30.0444, 31.2357,
   ARRAY[$D$Breakfast$D$],
   $D$$D$,
   ARRAY[$D$%airport%$D$, $D$%Cairo skyline%$D$, $D$%Cairo%$D$],
   ARRAY[$D$%Giza%$D$, $D$%Coptic%$D$, $D$%Al-Muizz%$D$, $D$%Islamic Cairo%$D$, $D$%Egyptian Museum%$D$, $D$%Ibn Tulun%$D$, $D$%Marsa Matruh%$D$, $D$%Siwa%$D$],
   $D$The Cairo skyline from the Nile before departure$D$,
   $D$There is no itinerary today beyond the one you make. Cairo rewards a slow morning if your flight allows it, and the transfer is built around the time you actually need to leave rather than a default check out. The same assistance meets you at the terminal and takes you through. Ten days that included twenty hours in a car is an unusual shape for a trip, and it is the only shape in which Siwa and Karnak fit into the same fortnight.$D$)),
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
WHERE t.slug = $D$10-day-egypt-tour$D$;

-- Raises rather than leaving a half written itinerary behind. A repeated
-- photograph is a notice, not a failure: it is worth seeing but it is not a
-- reason to roll back a content update.
DO $GUARD$
DECLARE
  n     int;
  gaps  int;
  dupes int;
BEGIN
  SELECT jsonb_array_length(itinerary) INTO n FROM tours WHERE slug = $D$10-day-egypt-tour$D$;
  IF n IS DISTINCT FROM 10 THEN
    RAISE EXCEPTION $D$expected 10 days, got %$D$, n;
  END IF;

  SELECT count(*) INTO gaps
  FROM tours t, jsonb_array_elements(t.itinerary) WITH ORDINALITY AS e(d, ord)
  WHERE t.slug = $D$10-day-egypt-tour$D$ AND (e.d->>$D$day$D$)::int <> e.ord;
  IF gaps > 0 THEN
    RAISE EXCEPTION $D$day numbers are not 1..10 in order$D$;
  END IF;

  SELECT count(*) INTO dupes FROM (
    SELECT e.d->>$D$image$D$ AS img
    FROM tours t, jsonb_array_elements(t.itinerary) AS e(d)
    WHERE t.slug = $D$10-day-egypt-tour$D$ AND e.d->>$D$image$D$ <> $D$PENDING_UPLOAD$D$
    GROUP BY 1 HAVING count(*) > 1
  ) x;
  IF dupes > 0 THEN
    RAISE NOTICE $D$% photograph(s) are used on more than one day; see the SHARED rows below$D$, dupes;
  END IF;
END
$GUARD$;

COMMIT;

\echo
\echo 10-day-egypt-tour

SELECT jsonb_array_length(itinerary) AS day_count
FROM tours WHERE slug = $D$10-day-egypt-tour$D$;

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
WHERE t.slug = $D$10-day-egypt-tour$D$
ORDER BY 1;
