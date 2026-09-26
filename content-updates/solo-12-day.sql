-- Rewrites the itinerary for 12-days-egypt-tour (Egypt Tours for Solo Travellers).
--
--   psql "$DATABASE_URL" -f content-updates/solo-12-day.sql
--
-- Twelve days, unchanged. Day 1 is arrival only and day 12 is departure only.
--
-- THE CRUISE FIXES THE START DATE
-- The MS Le Fayan sails from Luxor on Thursdays, so day 6 is the fixed point
-- and the first five days are counted backwards from it rather than forwards
-- from the guest's preferred arrival. Day 6 says so on the page, because a
-- guest who picks a Monday arrival and is then moved has been moved for a
-- reason worth explaining.
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
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $D$12-days-egypt-tour$D$) THEN
    RAISE EXCEPTION $D$tour 12-days-egypt-tour not found; nothing was changed$D$;
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
   ARRAY[$D$%Sphinx%$D$, $D$%Great Pyramid%$D$, $D$%Pyramids of Giza%$D$, $D$%Saqqara%$D$, $D$%Step Pyramid%$D$],
   $D$Marriott Mena House at Giza with the pyramid plateau behind it$D$,
   $D$You are met at Cairo airport before the immigration hall, and the visa and the bags are handled while you wait. The car runs out to Giza and you check in at the Marriott Mena House, which faces the plateau. There is no sightseeing today, deliberately. Twelve days is a long itinerary and a first evening spent adjusting to the time is worth more than a site started badly. Dinner is at the hotel and the rest of the night is yours.$D$),
  (2,
   $D$Pyramids of Giza$D$,
   $D$Giza and Saqqara: The Plateau and the Step Pyramid$D$,
   29.9792, 31.1342,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Marriott Mena House, Cairo$D$,
   ARRAY[$D$%Pyramids of Giza%$D$, $D$%Giza plateau%$D$, $D$%Great Pyramid%$D$, $D$%Saqqara%$D$, $D$%Step Pyramid%$D$, $D$%Giza%$D$],
   ARRAY[$D$%Mena House%$D$],
   $D$The Giza plateau with the Step Pyramid of Saqqara visited the same day$D$,
   $D$The plateau in the morning, starting at the Great Pyramid and working down the line. Going inside is possible and is not for everyone: the passage is low, steep and warm, and there is nothing at the end of it but an empty granite chamber, which is either the whole point or a wasted hour depending on the person. Saqqara takes the afternoon, a short drive south, where Djoser's Step Pyramid predates everything at Giza. The tomb chapels around it are the reason to linger, because their reliefs show farming, butchery, boat building and accounting rather than gods, and Egypt becomes much easier to picture once you have seen ordinary work carved on a wall.$D$),
  (3,
   $D$Catacombs of Kom el Shoqafa$D$,
   $D$Alexandria: The Catacombs of Kom el Shoqafa$D$,
   31.1784, 29.8925,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Four Seasons Hotel Alexandria at San Stefano$D$,
   ARRAY[$D$%Kom el Shoqafa%$D$, $D$%Catacomb%$D$, $D$%Alexandria%$D$],
   ARRAY[$D$%Kom el Dikka%$D$, $D$%Roman theatre%$D$, $D$%San Stefano%$D$],
   $D$The spiral stair down into the Catacombs of Kom el Shoqafa in Alexandria$D$,
   $D$The drive to Alexandria takes most of the morning along the desert road. Kom el Shoqafa is a Roman tomb complex cut three levels down into the rock. The lowest level is usually under water. What makes it worth the trip is the carving: Egyptian gods rendered in Roman dress, Anubis in a legionary's uniform, two religions visibly arguing on one wall. A spiral stair wraps a shaft down which the bodies were lowered, and you walk down beside it. You stay in Alexandria tonight, which is the right call, because the city is a different country from Cairo after dark.$D$),
  (4,
   $D$Kom el Dikka$D$,
   $D$Alexandria: The Roman Theatre, Then South to Cairo$D$,
   31.1959, 29.9058,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Four Seasons Hotel Cairo at The First Residence$D$,
   ARRAY[$D$%Kom el Dikka%$D$, $D$%Roman theatre%$D$, $D$%Bibliotheca%$D$, $D$%Alexandria%$D$],
   ARRAY[$D$%Kom el Shoqafa%$D$, $D$%Catacomb%$D$],
   $D$The Roman theatre at Kom el Dikka in central Alexandria$D$,
   $D$Kom el Dikka holds the only Roman theatre found in Egypt, uncovered by accident when the ground was being cleared for a housing block. Around it are lecture halls from a late antique school, with tiered stone seating and a teacher's chair, which is about as close as anywhere comes to a picture of how the ancient world taught. The Bibliotheca Alexandrina is a short walk if you want it, though it is a modern building making a very old argument. You drive back to Cairo in the afternoon and check in at the Four Seasons. Tomorrow you fly south, so the evening stays free.$D$),
  (5,
   $D$Medinet Habu$D$,
   $D$Luxor: Medinet Habu and the Valley of the Queens$D$,
   25.7194, 32.6008,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Sofitel Winter Palace Luxor$D$,
   ARRAY[$D$%Medinet Habu%$D$, $D$%Valley of the Queens%$D$, $D$%west bank%$D$, $D$%Luxor%$D$],
   ARRAY[$D$%Le Fayan%$D$, $D$%cruise%$D$, $D$%Winter Palace%$D$, $D$%Karnak%$D$, $D$%Luxor Temple%$D$],
   $D$Sunk relief on the outer wall of the mortuary temple at Medinet Habu$D$,
   $D$You fly to Luxor and cross to the west bank the same day. Medinet Habu is the mortuary temple of Ramesses III and the least visited of the large west bank sites, which stops making sense the moment you are inside it. Colour survives in the shaded parts of the ceiling. The sunk relief is cut deep enough to hold shadow at any hour of the day. The outer walls carry the record of a war against the Sea Peoples, the dead counted in severed hands, which is not a figure of speech. The Valley of the Queens follows, and whether Nefertari's tomb is open that day is worth asking about, because the painting in it is the best preserved in Egypt.$D$),
  (6,
   $D$MS Le Fayan$D$,
   $D$Luxor: Boarding the MS Le Fayan$D$,
   25.6975, 32.6355,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$MS Le Fayan$D$,
   ARRAY[$D$%Le Fayan%$D$, $D$%cruise%$D$, $D$%dahabiya%$D$, $D$%Nile at Luxor%$D$],
   ARRAY[$D$%Medinet Habu%$D$, $D$%Karnak%$D$],
   $D$The MS Le Fayan moored on the Nile at Luxor$D$,
   $D$The MS Le Fayan sails from Luxor on Thursdays, which is what fixes the start date of the whole itinerary rather than the other way round. You board late in the morning and the ship casts off in the afternoon. The first hours go by on the sun deck watching the east bank, which is a slower way to look at Egypt than anything else on this trip. For someone travelling alone the ship changes the arithmetic: the guide stays private when you go ashore, and on board there is a dining room where you are not the only person eating by yourself. Nothing else is asked of you today.$D$),
  (7,
   $D$Temple of Horus$D$,
   $D$Edfu and Kom Ombo: Two Temples from the Deck$D$,
   24.9780, 32.8733,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$MS Le Fayan$D$,
   ARRAY[$D$%Edfu%$D$, $D$%Horus%$D$, $D$%Kom Ombo%$D$],
   ARRAY[$D$%Philae%$D$],
   $D$The falcon statue in the forecourt of the Temple of Horus at Edfu$D$,
   $D$Edfu is reached from the mooring, and the Temple of Horus is the most completely preserved in Egypt, roof included. Walking it is the clearest lesson anywhere in how these buildings worked, because you pass from open court to dark sanctuary the way a priest did and the light drops at every step. The granite falcons in the forecourt are the ones every photograph is of, and they are worth stopping at. Kom Ombo comes in the late afternoon, built for two gods at once and therefore doubled down the middle, with two entrances, two sanctuaries and one wall between them. The crocodile museum beside it holds mummified crocodiles from the site, which is less grim than it sounds and explains exactly what the temple was for.$D$),
  (8,
   $D$Philae Temple$D$,
   $D$Aswan: Disembarking for Philae$D$,
   24.0256, 32.8844,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Sofitel Legend Old Cataract Aswan$D$,
   ARRAY[$D$%Philae%$D$, $D$%Aswan%$D$],
   ARRAY[$D$%Abu Simbel%$D$, $D$%Kom Ombo%$D$, $D$%Old Cataract%$D$],
   $D$Philae Temple on its island seen from the approaching boat at Aswan$D$,
   $D$You come off the ship at Aswan in the morning. Philae is reached by boat, and the temple on that island is not standing where it was built: the whole thing was cut into blocks and moved when the High Dam raised the lake over its original island. Isis was still worshipped here after the rest of Egypt had turned Christian, which is why the latest carving runs so late and why there are crosses cut over parts of it. You are staying at the Old Cataract, on the rock above the river, which has enough history of its own to be worth asking about, and the free afternoon is usually spent on a felucca as the sun goes down.$D$),
  (9,
   $D$Abu Simbel$D$,
   $D$Abu Simbel: Before Dawn$D$,
   22.3372, 31.6258,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Sofitel Legend Old Cataract Aswan$D$,
   ARRAY[$D$%Abu Simbel%$D$, $D$%Ramesses II%$D$],
   ARRAY[$D$%Philae%$D$, $D$%Aswan%$D$],
   $D$The colossal seated figures of Ramesses II at Abu Simbel at first light$D$,
   $D$You leave Aswan in the dark, because Abu Simbel is a long way south and the temples are best before the middle of the day. Ramesses cut them into a cliff to be seen by anyone coming north into Egypt, so the four seated figures outside are as much a border sign as a religious building. The whole site was cut into blocks and lifted above the waterline in the nineteen sixties, and the join lines are visible once you know to look for them. Inside, the smaller temple built for Nefertari is the one people underestimate, and it is the better building of the two. You are back in Aswan by the afternoon and you will want a quiet evening.$D$),
  (10,
   $D$Red Sea$D$,
   $D$Hurghada: The Red Sea$D$,
   27.0333, 33.8833,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$The Oberoi Beach Resort, Sahl Hasheesh$D$,
   ARRAY[$D$%Sahl Hasheesh%$D$, $D$%Red Sea%$D$, $D$%Hurghada%$D$],
   ARRAY[$D$%Nile%$D$],
   $D$The Red Sea reef seen through clear water at Sahl Hasheesh$D$,
   $D$A short flight crosses to the coast and the country changes completely. The reef here starts close enough to the shore that you do not need a boat to see it. The water is clear in a way the Nile never is. Sahl Hasheesh is quieter than Hurghada itself, which is the reason to be down there rather than in the town. Nothing is scheduled today and that is the design: nine days of sites has earned one where the only decision is what time to eat. Diving and snorkelling are arranged on the spot rather than booked in advance.$D$),
  (11,
   $D$Al-Muizz Street$D$,
   $D$Cairo: Al-Muizz Street After Dark$D$,
   30.0486, 31.2614,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Four Seasons Hotel Cairo at The First Residence$D$,
   ARRAY[$D$%Al-Muizz%$D$, $D$%Muizz%$D$, $D$%Islamic Cairo%$D$, $D$%Ibn Tulun%$D$],
   ARRAY[$D$%Coptic%$D$, $D$%Giza%$D$],
   $D$Al-Muizz Street in Cairo lit at night with its Mamluk facades$D$,
   $D$You fly back to Cairo in the morning and the last day of substance is spent on foot. Al-Muizz Street runs through the medieval city and is closed to cars along its main stretch, which is rarer in Cairo than it sounds. The buildings along it are Fatimid, then Mamluk, then Ottoman in sequence, so one walk covers about a thousand years without leaving the street. Go in the evening, when the facades are lit, the shops are open and the heat has gone out of the day. The sabil kuttab buildings, half public fountain and half school, are the ones to stop at, because there is very little like them anywhere else.$D$),
  (12,
   $D$Cairo$D$,
   $D$Cairo: Departure$D$,
   30.0444, 31.2357,
   ARRAY[$D$Breakfast$D$],
   $D$$D$,
   ARRAY[$D$%airport%$D$, $D$%Cairo skyline%$D$, $D$%Cairo%$D$],
   ARRAY[$D$%Giza%$D$, $D$%Coptic%$D$, $D$%Al-Muizz%$D$, $D$%Islamic Cairo%$D$, $D$%Egyptian Museum%$D$, $D$%Ibn Tulun%$D$, $D$%Red Sea%$D$, $D$%Hurghada%$D$],
   $D$The Cairo skyline from the Nile before departure$D$,
   $D$The last morning is unscheduled and the transfer is built around your flight rather than a check out time. If there is room for it, the Museum of Egyptian Civilisation and its royal mummies is the right final hour, because it puts faces to names you have been hearing for a fortnight. You are taken through check in the same way you were met on arrival. Twelve days covering the delta, the valley, the lake and the coast is a great deal of country, and doing it alone with a guide is what keeps that pace survivable.$D$)),
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
WHERE t.slug = $D$12-days-egypt-tour$D$;

-- Raises rather than leaving a half written itinerary behind. A repeated
-- photograph is a notice, not a failure: it is worth seeing but it is not a
-- reason to roll back a content update.
DO $GUARD$
DECLARE
  n     int;
  gaps  int;
  dupes int;
BEGIN
  SELECT jsonb_array_length(itinerary) INTO n FROM tours WHERE slug = $D$12-days-egypt-tour$D$;
  IF n IS DISTINCT FROM 12 THEN
    RAISE EXCEPTION $D$expected 12 days, got %$D$, n;
  END IF;

  SELECT count(*) INTO gaps
  FROM tours t, jsonb_array_elements(t.itinerary) WITH ORDINALITY AS e(d, ord)
  WHERE t.slug = $D$12-days-egypt-tour$D$ AND (e.d->>$D$day$D$)::int <> e.ord;
  IF gaps > 0 THEN
    RAISE EXCEPTION $D$day numbers are not 1..12 in order$D$;
  END IF;

  SELECT count(*) INTO dupes FROM (
    SELECT e.d->>$D$image$D$ AS img
    FROM tours t, jsonb_array_elements(t.itinerary) AS e(d)
    WHERE t.slug = $D$12-days-egypt-tour$D$ AND e.d->>$D$image$D$ <> $D$PENDING_UPLOAD$D$
    GROUP BY 1 HAVING count(*) > 1
  ) x;
  IF dupes > 0 THEN
    RAISE NOTICE $D$% photograph(s) are used on more than one day; see the SHARED rows below$D$, dupes;
  END IF;
END
$GUARD$;

COMMIT;

\echo
\echo 12-days-egypt-tour

SELECT jsonb_array_length(itinerary) AS day_count
FROM tours WHERE slug = $D$12-days-egypt-tour$D$;

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
WHERE t.slug = $D$12-days-egypt-tour$D$
ORDER BY 1;
