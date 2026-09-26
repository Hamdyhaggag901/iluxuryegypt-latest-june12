-- Rewrites the itinerary for luxury-egypt-honeymoon.
--
--   psql "$DATABASE_URL" -f content-updates/honeymoon-9.sql
--
-- Nine days, unchanged. This is the river tour: Giza, the Grand Egyptian
-- Museum, then Aswan and the Nile by boat down to Luxor. There is no Red Sea
-- day in it at all, which is what keeps it clear of the seven day tour, and no
-- Abu Simbel, which keeps it clear of the ten day one.
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
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $D$luxury-egypt-honeymoon$D$) THEN
    RAISE EXCEPTION $D$tour luxury-egypt-honeymoon not found; nothing was changed$D$;
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
   $D$You land at Cairo and are met before the immigration hall rather than after it. Someone handles the visa, the queue and the bags while the two of you wait somewhere cooler. The car runs out to Giza and you check in at the Marriott Mena House. There is no sightseeing today and none should be. Nine days is a long itinerary and arriving rested is worth more than a hurried hour this evening.$D$),
  (2,
   $D$Pyramids of Giza$D$,
   $D$Giza: The Plateau at First Light$D$,
   29.9792, 31.1342,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Marriott Mena House, Cairo$D$,
   ARRAY[$D$%Pyramids of Giza%$D$, $D$%Giza plateau%$D$, $D$%Great Pyramid%$D$, $D$%Sphinx%$D$, $D$%Giza%$D$],
   ARRAY[$D$%Mena House%$D$, $D$%Saqqara%$D$, $D$%Grand Egyptian Museum%$D$],
   $D$The Giza plateau at first light with the Great Pyramid and the Sphinx$D$,
   $D$You are on the plateau early, while the light is still low and the coaches are still in the city. Your guide takes the three pyramids in turn, and the differences between them only become obvious once you are standing among them rather than looking from the road. The Sphinx follows along the causeway, which is the line it was carved to be seen from. The panoramic point to the south is where most photographs of the three together are taken, and it is worth the extra twenty minutes for two people who will want one. The afternoon is free, and the hotel terrace faces what you spent the morning walking around.$D$),
  (3,
   $D$Grand Egyptian Museum$D$,
   $D$Giza: The Grand Egyptian Museum$D$,
   29.9937, 31.1195,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Marriott Mena House, Cairo$D$,
   ARRAY[$D$%Grand Egyptian Museum%$D$, $D$%GEM%$D$, $D$%Tutankhamun%$D$, $D$%Giza%$D$],
   ARRAY[$D$%Mena House%$D$, $D$%Sphinx%$D$, $D$%plateau%$D$],
   $D$The grand staircase of the Grand Egyptian Museum with its royal statues$D$,
   $D$The museum sits within sight of the plateau, which is the point of putting it here. The Tutankhamun galleries hold the full burial assemblage together rather than split between buildings, and that is the single strongest reason to give it a whole day. The grand staircase is lined with royal statues arranged so that you climb through a chronology rather than past a collection. Travelling as two rather than with a group, you set the pace, and in a building this size that matters more than it sounds. Go slowly, stop when you want to, and leave the rest for another trip.$D$),
  (4,
   $D$Philae Temple$D$,
   $D$Aswan: Philae by Boat$D$,
   24.0256, 32.8844,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Sofitel Legend Old Cataract Aswan$D$,
   ARRAY[$D$%Philae%$D$, $D$%Aswan%$D$],
   ARRAY[$D$%Abu Simbel%$D$, $D$%Kom Ombo%$D$, $D$%Old Cataract%$D$, $D$%Nubian%$D$],
   $D$Philae Temple on its island seen from the approaching boat at Aswan$D$,
   $D$A morning flight takes you south to Aswan, where the river is wider and the pace drops. Philae is reached by boat, which is the only way onto the island. The temple was cut into blocks and moved here when the High Dam raised the water, and the island it was built on is under the lake. Isis was still worshipped at Philae after the rest of Egypt had turned Christian, which is why the carving runs so late and why crosses are cut over parts of it. You are staying at the Old Cataract, above the river, and the terrace there at sunset is the reason people book it.$D$),
  (5,
   $D$MS Le Fayan$D$,
   $D$Aswan: Boarding the Nile Boat$D$,
   24.0889, 32.8998,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$MS Le Fayan$D$,
   ARRAY[$D$%Le Fayan%$D$, $D$%Nile cruise%$D$, $D$%cruise%$D$, $D$%dahabiya%$D$, $D$%felucca%$D$],
   ARRAY[$D$%Philae%$D$, $D$%Abu Simbel%$D$],
   $D$The MS Le Fayan moored on the Nile$D$,
   $D$You board late in the morning and the boat casts off in the afternoon. The first hours go by on the sun deck with the east bank sliding past, which is a slower way to look at Egypt than anything else in these nine days. There is no schedule today beyond being aboard when it leaves. A felucca can be arranged at Aswan before you board if you would rather see the islands under sail first, and that is a decision for the morning rather than now.$D$),
  (6,
   $D$Temple of Horus$D$,
   $D$Edfu and Kom Ombo from the Deck$D$,
   24.9780, 32.8733,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$MS Le Fayan$D$,
   ARRAY[$D$%Edfu%$D$, $D$%Horus%$D$, $D$%Kom Ombo%$D$],
   ARRAY[$D$%Philae%$D$, $D$%Karnak%$D$],
   $D$The falcon statue in the forecourt of the Temple of Horus at Edfu$D$,
   $D$Edfu is reached from the mooring, and the Temple of Horus is the most completely preserved in Egypt, roof included. Walking it is the clearest lesson anywhere in how these buildings worked, because you pass from open court to dark sanctuary the way a priest did and the light drops at every step. Kom Ombo comes in the late afternoon, built for two gods at once and doubled down the middle, with two entrances and two sanctuaries. The crocodile museum beside it holds mummified crocodiles from the site itself. Both are close to the water, so neither day costs you a long drive, which is the whole argument for seeing this stretch by boat.$D$),
  (7,
   $D$Valley of the Kings$D$,
   $D$Luxor: The West Bank$D$,
   25.7402, 32.6014,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Sofitel Winter Palace Luxor$D$,
   ARRAY[$D$%Valley of the Kings%$D$, $D$%Hatshepsut%$D$, $D$%west bank%$D$, $D$%Luxor%$D$],
   ARRAY[$D$%Karnak%$D$, $D$%Luxor Temple%$D$, $D$%Winter Palace%$D$, $D$%cruise%$D$],
   $D$Tomb entrances cut into the hillside at the Valley of the Kings$D$,
   $D$You come off the boat at Luxor and cross to the west bank the same morning. The general ticket admits you to a set number of tombs, and your guide chooses them by what is open and least crowded that day. Seti I and Tutankhamun carry their own tickets, and whether they are worth it is a conversation to have there rather than in advance. Hatshepsut's temple comes next, cut back into the cliff at Deir el-Bahari in three terraces that read as modern until you are standing on them. You check in at the Winter Palace for the last two nights.$D$),
  (8,
   $D$Luxor Temple$D$,
   $D$Luxor: The Temple After Dark$D$,
   25.6995, 32.6391,
   ARRAY[$D$Breakfast$D$, $D$Lunch$D$, $D$Dinner$D$],
   $D$Sofitel Winter Palace Luxor$D$,
   ARRAY[$D$%Luxor Temple%$D$, $D$%avenue of sphinxes%$D$, $D$%Karnak%$D$, $D$%Luxor%$D$],
   ARRAY[$D$%Valley of the%$D$, $D$%Hatshepsut%$D$, $D$%Winter Palace%$D$, $D$%west bank%$D$],
   $D$Luxor Temple lit at night with the avenue of sphinxes$D$,
   $D$The day is yours until the afternoon. Karnak is a short drive if you want it, and the hypostyle hall rewards a second visit more than most places do. Luxor Temple itself is saved for the evening, because it is lit after dark and the avenue of sphinxes running north out of it is picked out along its whole length. The two temples were joined by that avenue, and now that it has been cleared you can see what the connection meant rather than be told. It is a quiet last evening, which is the right shape for the end of a trip like this.$D$),
  (9,
   $D$Cairo$D$,
   $D$Cairo: Departure$D$,
   30.0444, 31.2357,
   ARRAY[$D$Breakfast$D$],
   $D$$D$,
   ARRAY[$D$%airport%$D$, $D$%Cairo skyline%$D$, $D$%Cairo%$D$],
   ARRAY[$D$%Giza%$D$, $D$%Coptic%$D$, $D$%Al-Muizz%$D$, $D$%Islamic Cairo%$D$, $D$%Egyptian Museum%$D$, $D$%Ibn Tulun%$D$, $D$%Saqqara%$D$, $D$%cruise%$D$, $D$%Nile%$D$],
   $D$The Cairo skyline from the Nile before departure$D$,
   $D$A morning flight returns you to Cairo. If your onward departure is late enough there is room for one more stop on the way, and your planner will have asked in advance which you would rather it was. Otherwise the transfer runs straight to the terminal with the same assistance you had on arrival. You will have come down the river from Aswan to Luxor by boat, which is the only part of this country that is easier to see from the water than the road.$D$)),
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
WHERE t.slug = $D$luxury-egypt-honeymoon$D$;

-- Rolls the file back rather than leaving a half written itinerary. The old
-- JSON for two of these six had missing days in the middle, so the 1..n check
-- is the point of this block rather than a formality.
DO $GUARD$
DECLARE
  n int; gaps int; dupes int;
BEGIN
  SELECT jsonb_array_length(itinerary) INTO n FROM tours WHERE slug = $D$luxury-egypt-honeymoon$D$;
  IF n IS DISTINCT FROM 9 THEN
    RAISE EXCEPTION $D$expected 9 days, got %$D$, n;
  END IF;

  SELECT count(*) INTO gaps
  FROM tours t, jsonb_array_elements(t.itinerary) WITH ORDINALITY AS e(d, ord)
  WHERE t.slug = $D$luxury-egypt-honeymoon$D$ AND (e.d->>$D$day$D$)::int <> e.ord;
  IF gaps > 0 THEN
    RAISE EXCEPTION $D$day numbers are not 1..9 in order$D$;
  END IF;

  SELECT count(*) INTO dupes FROM (
    SELECT e.d->>$D$image$D$ AS img
    FROM tours t, jsonb_array_elements(t.itinerary) AS e(d)
    WHERE t.slug = $D$luxury-egypt-honeymoon$D$ AND e.d->>$D$image$D$ <> $D$PENDING_UPLOAD$D$
    GROUP BY 1 HAVING count(*) > 1
  ) x;
  IF dupes > 0 THEN
    RAISE NOTICE $D$% photograph(s) are used on more than one day; see the SHARED rows below$D$, dupes;
  END IF;
END
$GUARD$;

COMMIT;

\echo
\echo luxury-egypt-honeymoon

SELECT jsonb_array_length(itinerary) AS day_count
FROM tours WHERE slug = $D$luxury-egypt-honeymoon$D$;

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
WHERE t.slug = $D$luxury-egypt-honeymoon$D$
ORDER BY 1;
