-- Rewrites the itinerary for private-spiritual-tours-egypt-14-days-sacred-journey.
--
--   psql "$DATABASE_URL" -f content-updates/spiritual-14.sql
--
-- Fourteen days, unchanged in length. THIS FIXES A BROKEN ITINERARY: the live
-- JSON had days 1 to 7, then 10, 11, 13 and 14, with days 8, 9 and 12 missing
-- entirely, so the page rendered gaps in the middle of the route.
--
-- Hurghada is removed. It occupied two of the old fourteen days and is the main
-- reason this tour read as a generic package rather than a sacred sites route.
--
-- Siwa is moved from day 13, where it appeared out of nowhere at the end, to
-- days 4 to 6, and the two ten hour road transfers are real days in the
-- itinerary rather than being absorbed into a sightseeing day. Doing it early
-- means one drive out and one drive back, instead of crossing the country twice.
-- Siwa has no confirmed property, so accommodation there is the place name.
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
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $D$private-spiritual-tours-egypt-14-days-sacred-journey$D$) THEN
    RAISE EXCEPTION $D$tour private-spiritual-tours-egypt-14-days-sacred-journey not found; nothing was changed$D$;
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
   $D$You land at Cairo and are met before the immigration hall rather than after it. The visa, the passport queue and the bags are handled while you wait somewhere cooler. The car runs out to Giza and you check in at the Marriott Mena House. Nothing is scheduled today. Fourteen days is a long route with two long road days in it, and the first evening is better spent asleep.$D$),
  (2,
   $D$Pyramids of Giza$D$,
   $D$Giza: The Plateau$D$,
   29.9792, 31.1342,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Marriott Mena House, Cairo$D$,
   ARRAY[$D$%Pyramids of Giza%$D$, $D$%Giza plateau%$D$, $D$%Great Pyramid%$D$, $D$%Sphinx%$D$, $D$%Giza%$D$],
   ARRAY[$D$%Mena House%$D$, $D$%Saqqara%$D$, $D$%Serapeum%$D$],
   $D$The Giza plateau at first light with the Great Pyramid and the Sphinx$D$,
   $D$You are on the plateau early, while the light is flat and the coaches are still in the city. The three pyramids are taken in turn and the change in engineering across them is the thing to watch for. The Grand Gallery inside the Great Pyramid is the reason to go in, and the low steep passage to reach it is the reason some people do not. The Sphinx follows along the causeway, at the level it was carved to be seen from. The afternoon stays free.$D$),
  (3,
   $D$Serapeum of Saqqara$D$,
   $D$Saqqara: The Serapeum and the Step Pyramid$D$,
   29.8767, 31.2158,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Marriott Mena House, Cairo$D$,
   ARRAY[$D$%Serapeum%$D$, $D$%Apis%$D$, $D$%Step Pyramid%$D$, $D$%Saqqara%$D$],
   ARRAY[$D$%Giza%$D$, $D$%Mena House%$D$],
   $D$A granite sarcophagus in the Serapeum galleries at Saqqara$D$,
   $D$The Serapeum is an underground gallery cut into the rock at Saqqara to hold the burials of the Apis bulls. What is down there is a corridor lined with granite sarcophagi, each one carved from a single block and each one large enough to stand in. How they were brought down and positioned in a tunnel this size is a question nobody has a complete answer to, and standing beside one makes the question feel much more pressing than reading about it does. Djoser's Step Pyramid is above ground and predates everything at Giza. The afternoon returns you to Giza, because tomorrow is a very long drive.$D$),
  (4,
   $D$Siwa Oasis$D$,
   $D$Siwa: The Road West$D$,
   29.2041, 25.5195,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Siwa Oasis$D$,
   ARRAY[$D$%Siwa Oasis%$D$, $D$%Siwa%$D$],
   ARRAY[$D$%Oracle%$D$, $D$%Aghurmi%$D$, $D$%Shali%$D$, $D$%Sand Sea%$D$, $D$%Cleopatra%$D$, $D$%salt lake%$D$],
   $D$Palm groves at Siwa Oasis seen from the Shali fortress ruins$D$,
   $D$Today is a road day and nothing else. Siwa is roughly ten hours from Cairo by car and there is no civil airport, so this is the only way in. The route runs up to the coast at Marsa Matruh and then turns south into the desert, and the second half is emptier than the first. There are stops for food and for standing up, and because the car is yours they happen when you want them. You arrive in the evening, tired, and see nothing today. It is said plainly here because a day like this is what Siwa costs, and it is better known before you book than after.$D$),
  (5,
   $D$Temple of the Oracle$D$,
   $D$Siwa: The Oracle at Aghurmi$D$,
   29.2006, 25.5444,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Siwa Oasis$D$,
   ARRAY[$D$%Oracle%$D$, $D$%Aghurmi%$D$, $D$%Siwa%$D$],
   ARRAY[$D$%Shali%$D$, $D$%Sand Sea%$D$, $D$%salt lake%$D$],
   $D$The Temple of the Oracle at Aghurmi above the Siwa palm groves$D$,
   $D$The Temple of the Oracle stands on the rock at Aghurmi, above the palm groves, and the climb up to it is short and steep. Alexander came here in 331 BC to consult it and left without recording what he was told, which is most of the reason the place is still famous. The ruins themselves are modest, and the position rather than the architecture is what holds people. The oracle at Siwa was known across the Greek world long before that, which is remarkable for somewhere this far from anything. The rest of the day is spent in the groves below, which are cooler than the town.$D$),
  (6,
   $D$Shali Fortress$D$,
   $D$Siwa: Shali and the Springs$D$,
   29.2036, 25.5197,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Siwa Oasis$D$,
   ARRAY[$D$%Shali%$D$, $D$%Cleopatra%$D$, $D$%spring%$D$, $D$%Siwa%$D$],
   ARRAY[$D$%Oracle%$D$, $D$%Aghurmi%$D$, $D$%Sand Sea%$D$],
   $D$The ruined salt and mud walls of the Shali fortress at Siwa$D$,
   $D$Shali is the old town, built from salt and mud on a rock in the middle of the oasis, and it partly dissolved when the rain came hard enough. Seeing a dissolved building still standing is a strange hour, and the streets that survive are narrow enough to be dark at midday. The spring at the edge of the town, stone lined and fed from below, is where the day ends, and swimming in it is an ordinary thing here rather than an arrangement anyone has to make. The salt lakes further out are the colour they are because of what is dissolved in them. This is the last day before the road back.$D$),
  (7,
   $D$Cairo$D$,
   $D$Cairo: The Road Back$D$,
   30.0444, 31.2357,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Four Seasons Hotel Cairo at The First Residence$D$,
   ARRAY[$D$%Marsa Matruh%$D$, $D$%Cairo skyline%$D$, $D$%Cairo%$D$],
   ARRAY[$D$%Giza%$D$, $D$%Coptic%$D$, $D$%Al-Muizz%$D$, $D$%Islamic Cairo%$D$, $D$%Egyptian Museum%$D$, $D$%Ibn Tulun%$D$, $D$%Saqqara%$D$, $D$%Siwa%$D$, $D$%airport%$D$, $D$%Oracle%$D$],
   $D$The desert road east from Marsa Matruh back towards Cairo$D$,
   $D$The same ten hours, in reverse. You leave early so the long middle stretch is behind you before the afternoon. Lunch is on the coast at Marsa Matruh, and after that the road fills as you come back down into the delta. You check in at the Four Seasons in Cairo and the evening is deliberately empty, because tomorrow starts with a flight south.$D$),
  (8,
   $D$Dendera Temple$D$,
   $D$Dendera: The Painted Ceiling of Hathor$D$,
   26.1417, 32.6700,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Sofitel Winter Palace Luxor$D$,
   ARRAY[$D$%Dendera%$D$, $D$%Hathor%$D$],
   ARRAY[$D$%Abydos%$D$, $D$%Karnak%$D$, $D$%Winter Palace%$D$],
   $D$The painted ceiling of the Temple of Hathor at Dendera after cleaning$D$,
   $D$A morning flight puts you in Luxor and you drive north to Dendera the same day. The temple of Hathor is among the most complete in Egypt, and the reason to come is overhead: a ceiling cleaned of centuries of soot, with the blues and golds underneath close to what was first painted there. The zodiac on the ceiling of one of the roof chapels is a replica, and the original is in Paris, which is worth knowing before you look for it. There is a crypt below reached by a narrow stair, carved on every surface. Few coaches come this far north, so the hall is usually quiet.$D$),
  (9,
   $D$Abydos Temple$D$,
   $D$Abydos: The Osireion and the King List$D$,
   26.1847, 31.9192,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Sofitel Winter Palace Luxor$D$,
   ARRAY[$D$%Osireion%$D$, $D$%Abydos%$D$, $D$%Seti I%$D$],
   ARRAY[$D$%Dendera%$D$, $D$%Karnak%$D$, $D$%Winter Palace%$D$],
   $D$The Osireion behind the Temple of Seti I at Abydos$D$,
   $D$Abydos is about three hours north of Luxor, and the temple Seti I built there holds the finest raised relief carving in Egypt, with pigment surviving in places. The king list cut into one wall names his predecessors in order, with the ones he preferred to forget left off. Behind the temple is the Osireion, a structure of enormous granite blocks sunk below the water table and reached down a passage, built to a heavier and plainer style than the temple in front of it. Its date has been argued over for a century, and standing in it you can see why the argument started. Abydos was the cult centre of Osiris, which is what makes this the anchor of a sacred sites route rather than one stop among many.$D$),
  (10,
   $D$Karnak Temple$D$,
   $D$Luxor: Karnak$D$,
   25.7188, 32.6573,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Sofitel Winter Palace Luxor$D$,
   ARRAY[$D$%Karnak%$D$, $D$%Luxor Temple%$D$, $D$%Luxor%$D$],
   ARRAY[$D$%Valley of the%$D$, $D$%Medinet Habu%$D$, $D$%Winter Palace%$D$, $D$%Dendera%$D$],
   $D$The hypostyle hall at Karnak Temple in Luxor$D$,
   $D$Karnak is roughly two thousand years of building on one site, and no single reign accounts for it. Reach the hypostyle hall early, because the scale stops registering once it fills. The sacred lake, the Sekhmet statues in the Ptah precinct and the Ptolemaic gate behind it take another hour and most visitors see none of them. Luxor Temple is lit after dark, with the cleared avenue of sphinxes running north out of it, and after ten days it is reasonable to take the evening off instead.$D$),
  (11,
   $D$Medinet Habu$D$,
   $D$Luxor: Medinet Habu and the West Bank$D$,
   25.7194, 32.6008,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Sofitel Winter Palace Luxor$D$,
   ARRAY[$D$%Medinet Habu%$D$, $D$%west bank%$D$, $D$%Valley of the Kings%$D$, $D$%Luxor%$D$],
   ARRAY[$D$%Karnak%$D$, $D$%Luxor Temple%$D$, $D$%Winter Palace%$D$, $D$%Hatshepsut%$D$],
   $D$Sunk relief on the outer wall of the mortuary temple at Medinet Habu$D$,
   $D$Medinet Habu is the mortuary temple of Ramesses III and the least visited of the large west bank sites, which stops making sense the moment you are inside it. Colour survives in the shaded parts of the ceiling, and the sunk relief is cut deep enough to hold shadow at any hour. The outer walls carry the record of a war against the Sea Peoples, with the dead counted in severed hands, which is not a figure of speech. The Valley of the Kings follows in the afternoon, with the tombs chosen by what is open and least crowded. It is a long day and the last one on this side of the river.$D$),
  (12,
   $D$Philae Temple$D$,
   $D$Aswan: Philae by Boat$D$,
   24.0256, 32.8844,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Sofitel Legend Old Cataract Aswan$D$,
   ARRAY[$D$%Philae%$D$, $D$%Isis%$D$, $D$%Aswan%$D$],
   ARRAY[$D$%Abu Simbel%$D$, $D$%Old Cataract%$D$, $D$%Kom Ombo%$D$],
   $D$Philae Temple on its island seen from the approaching boat at Aswan$D$,
   $D$You move south to Aswan and reach Philae by boat, which is the only way onto the island. Isis was worshipped here after the rest of Egypt had turned Christian, and the last hieroglyphic inscription known anywhere was cut on this island. Crosses were later carved over parts of the earlier work, and both are still there on the same walls. The temple was cut into blocks and moved when the High Dam raised the lake over the island it was built on. You are staying at the Old Cataract, above the river.$D$),
  (13,
   $D$Abu Simbel$D$,
   $D$Abu Simbel: Before Dawn$D$,
   22.3372, 31.6258,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Sofitel Legend Old Cataract Aswan$D$,
   ARRAY[$D$%Abu Simbel%$D$, $D$%Ramesses II%$D$],
   ARRAY[$D$%Philae%$D$, $D$%Aswan%$D$],
   $D$The colossal seated figures of Ramesses II at Abu Simbel at first light$D$,
   $D$You leave Aswan in the dark, because Abu Simbel is a long way south and the temples are best before the middle of the day. Ramesses cut them into a cliff to be seen by anyone coming north into Egypt, so the four seated figures are as much a border marker as a temple front. Twice a year the sun reaches the length of the inner sanctuary and lights three of the four statues at the back, and the one left in shadow is Ptah, a god of the underworld. The whole site was cut into blocks and lifted above the waterline in the nineteen sixties, and the join lines are visible once you know to look. The smaller temple for Nefertari is the one people underestimate. You are back in Aswan by the afternoon.$D$),
  (14,
   $D$Cairo$D$,
   $D$Cairo: Departure$D$,
   30.0444, 31.2357,
   ARRAY[$D$Breakfast$D$],
   $D$$D$,
   ARRAY[$D$%airport%$D$, $D$%Cairo skyline%$D$, $D$%Cairo%$D$],
   ARRAY[$D$%Giza%$D$, $D$%Coptic%$D$, $D$%Al-Muizz%$D$, $D$%Islamic Cairo%$D$, $D$%Egyptian Museum%$D$, $D$%Ibn Tulun%$D$, $D$%Saqqara%$D$, $D$%Abu Simbel%$D$, $D$%Philae%$D$, $D$%Siwa%$D$],
   $D$The Cairo skyline from the Nile before departure$D$,
   $D$You fly back to Cairo in the morning, and the last day is built around your departure rather than a check out time. If there is room, the Museum of Egyptian Civilisation and its royal mummies is the right final hour. The transfer runs to the terminal with the same assistance through check in that you had two weeks ago. Fourteen days took you from the Serapeum to the oracle at Siwa to the Osireion at Abydos and on to Abu Simbel, which is a coherent route rather than a long one.$D$)),
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
WHERE t.slug = $D$private-spiritual-tours-egypt-14-days-sacred-journey$D$;

-- Rolls the file back rather than leaving a half written itinerary. The old
-- JSON for two of these six had missing days in the middle, so the 1..n check
-- is the point of this block rather than a formality.
DO $GUARD$
DECLARE
  n int; gaps int; dupes int;
BEGIN
  SELECT jsonb_array_length(itinerary) INTO n FROM tours WHERE slug = $D$private-spiritual-tours-egypt-14-days-sacred-journey$D$;
  IF n IS DISTINCT FROM 14 THEN
    RAISE EXCEPTION $D$expected 14 days, got %$D$, n;
  END IF;

  SELECT count(*) INTO gaps
  FROM tours t, jsonb_array_elements(t.itinerary) WITH ORDINALITY AS e(d, ord)
  WHERE t.slug = $D$private-spiritual-tours-egypt-14-days-sacred-journey$D$ AND (e.d->>$D$day$D$)::int <> e.ord;
  IF gaps > 0 THEN
    RAISE EXCEPTION $D$day numbers are not 1..14 in order$D$;
  END IF;

  SELECT count(*) INTO dupes FROM (
    SELECT e.d->>$D$image$D$ AS img
    FROM tours t, jsonb_array_elements(t.itinerary) AS e(d)
    WHERE t.slug = $D$private-spiritual-tours-egypt-14-days-sacred-journey$D$ AND e.d->>$D$image$D$ <> $D$PENDING_UPLOAD$D$
    GROUP BY 1 HAVING count(*) > 1
  ) x;
  IF dupes > 0 THEN
    RAISE NOTICE $D$% photograph(s) are used on more than one day; see the SHARED rows below$D$, dupes;
  END IF;
END
$GUARD$;

COMMIT;

\echo
\echo private-spiritual-tours-egypt-14-days-sacred-journey

SELECT jsonb_array_length(itinerary) AS day_count
FROM tours WHERE slug = $D$private-spiritual-tours-egypt-14-days-sacred-journey$D$;

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
WHERE t.slug = $D$private-spiritual-tours-egypt-14-days-sacred-journey$D$
ORDER BY 1;
