-- Rewrite of the egypt-solar-eclipse-luxury-tour page.
--
--   psql "$DATABASE_URL" -f content-updates/eclipse-tour.sql
--
-- The slug is NOT changed. It is live, and changing it would break the URL for
-- no gain. Nothing here touches includes, excludes, price or any code.
--
-- THE ITINERARY PROBLEM THIS FIXES
-- The old day sequence ran Giza, Sphinx, Karnak, Valley of the Kings, Luxor,
-- Cairo Citadel, Cairo: day 5 was the eclipse but was labelled only "Luxor"
-- with nothing about the eclipse in it, and days 6 and 7 went back to Cairo
-- for sightseeing after the event the whole trip exists for. The new sequence
-- finishes every major site before day 5, makes day 5 the eclipse and nothing
-- else, and leaves day 6 deliberately quiet.
--
-- KEYWORDS
-- This page owns the commercial phrase. "egypt solar eclipse 2027 tour
-- packages" appears in title (the H1), seo_title, meta_description, the first
-- 100 words of description, one h2, hero_image_alt and one FAQ question. The
-- article's phrase, "6 minute solar eclipse 2027", appears nowhere on this
-- page, as a heading or otherwise.
--
-- NO PRICE OF ANY KIND
-- schema_markup carries a TouristTrip node with no offers, no priceRange and
-- no price property. The description and FAQs name no figure either.
--
-- IMAGES
-- Same resolution as the solo itinerary files: ordered include patterns and a
-- per day exclude list matched against media.alt_en with ILIKE, first pattern
-- that matches wins, lowest id within it, PENDING_UPLOAD when nothing matches,
-- and imageAlt taken from the same row. Exclusions apply from the second
-- pattern onwards, never to the first. Day 5 has no obvious library subject
-- and is expected to fall back to PENDING_UPLOAD.
--
-- schema_markup is built from the faqs column rather than written twice, so
-- the FAQPage text cannot drift from the faqs text.
--
-- Dollar quoting on every text value.

\set ON_ERROR_STOP on

BEGIN;

DO $GUARD$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM tours WHERE slug = $A$egypt-solar-eclipse-luxury-tour$A$) THEN
    RAISE EXCEPTION $A$tour egypt-solar-eclipse-luxury-tour not found; nothing was changed$A$;
  END IF;
END
$GUARD$;

WITH spec(day, place_name, title, lat, lng, meals, accommodation, patterns, excludes, alt_fallback, description) AS (
  VALUES
  (1,
   $A$Giza$A$,
   $A$Giza: Arrival and Check In$A$,
   29.9870, 31.2118,
   ARRAY[$A$Dinner$A$],
   $A$Marriott Mena House, Cairo$A$,
   ARRAY[$A$%Mena House%$A$, $A$%Giza%$A$],
   ARRAY[$A$%Sphinx%$A$, $A$%Great Pyramid%$A$, $A$%Pyramids of Giza%$A$],
   $A$Marriott Mena House at Giza with the pyramid plateau behind it$A$,
   $A$You are met at Cairo airport before the immigration hall, and the visa, the queue and the bags are handled while you wait. The car runs out to Giza and you check in at the Marriott Mena House. There is no sightseeing today. The eclipse is four days away and the week is arranged so that you arrive rested rather than already behind it. Dinner is at the hotel and the evening is yours.$A$),

  (2,
   $A$Pyramids of Giza$A$,
   $A$Giza: The Plateau, the Sphinx and the Grand Egyptian Museum$A$,
   29.9792, 31.1342,
   ARRAY[$A$Breakfast$A$, $A$Lunch$A$, $A$Dinner$A$],
   $A$Marriott Mena House, Cairo$A$,
   ARRAY[$A$%Pyramids of Giza%$A$, $A$%Giza plateau%$A$, $A$%Great Pyramid%$A$, $A$%Sphinx%$A$, $A$%Giza%$A$],
   ARRAY[$A$%Mena House%$A$],
   $A$The Giza plateau at first light with the Great Pyramid and the Sphinx$A$,
   $A$You are on the plateau early, before the coaches come out from the city and while the light is still low. Your guide works outward from the Great Pyramid, and the Sphinx follows along the causeway rather than from the viewing terrace. The afternoon belongs to the Grand Egyptian Museum, where the Tutankhamun material is held together as a single assemblage rather than split between buildings. It is a long day and a deliberate one, because everything on this scale is finished before the eclipse instead of being left until afterwards.$A$),

  (3,
   $A$Karnak Temple$A$,
   $A$Luxor: Karnak and Luxor Temple$A$,
   25.7188, 32.6573,
   ARRAY[$A$Breakfast$A$, $A$Lunch$A$, $A$Dinner$A$],
   $A$Sofitel Winter Palace Luxor$A$,
   ARRAY[$A$%Karnak%$A$, $A$%Luxor Temple%$A$, $A$%Luxor%$A$],
   ARRAY[$A$%Valley of the%$A$, $A$%Winter Palace%$A$, $A$%Medinet Habu%$A$, $A$%Deir el-Medina%$A$],
   $A$The hypostyle hall at Karnak Temple in Luxor$A$,
   $A$A morning flight puts you in Luxor before the heat builds. Karnak was built and rebuilt over roughly two thousand years, and no single pharaoh is responsible for what you walk through. The hypostyle hall is the part everyone remembers, and it is worth reaching before the crowd arrives and the scale stops registering. Luxor Temple is better at the end of the day, when the lights come on and the avenue of sphinxes running north out of it is picked out. You check in at the Sofitel Winter Palace, which is where you stay for the rest of the week.$A$),

  (4,
   $A$Valley of the Kings$A$,
   $A$Luxor: The West Bank, Hatshepsut and the Colossi$A$,
   25.7402, 32.6014,
   ARRAY[$A$Breakfast$A$, $A$Lunch$A$, $A$Dinner$A$],
   $A$Sofitel Winter Palace Luxor$A$,
   ARRAY[$A$%Valley of the Kings%$A$, $A$%Hatshepsut%$A$, $A$%Colossi%$A$, $A$%west bank%$A$, $A$%Luxor%$A$],
   ARRAY[$A$%Karnak%$A$, $A$%Luxor Temple%$A$, $A$%Winter Palace%$A$],
   $A$Tomb entrances cut into the hillside at the Valley of the Kings$A$,
   $A$The west bank takes the whole day, starting in the Valley of the Kings while the light is still low. The general ticket admits you to a set number of tombs, and your guide chooses them by what is open and least crowded that morning. Hatshepsut's temple comes next, cut back into the cliff at Deir el-Bahari in three terraces that read as modern until you are standing on them. The Colossi of Memnon close the day, two seated figures left in a field where the temple behind them has gone. Tomorrow you will not be looking at anything on the ground, so today is the last of the monuments.$A$),

  (5,
   $A$Luxor Eclipse Viewing$A$,
   $A$Luxor: Totality, 6 Minutes and 23 Seconds$A$,
   25.6872, 32.6396,
   ARRAY[$A$Breakfast$A$, $A$Lunch$A$, $A$Dinner$A$],
   $A$Sofitel Winter Palace Luxor$A$,
   ARRAY[$A$%total solar eclipse%$A$, $A$%solar eclipse%$A$, $A$%eclipse%$A$, $A$%totality%$A$, $A$%corona%$A$],
   ARRAY[]::text[],
   $A$The corona of a total solar eclipse above the desert outside Luxor$A$,
   $A$This is the day the whole itinerary exists for. You leave early and are in position in the Luxor area well before first contact, at a location chosen away from the main concentration of visitors rather than at a public viewpoint. Certified eclipse filters are handed out before anything begins, and they stay on through every partial phase, because the sun cannot be looked at safely until the disc is completely covered. The whole event spans almost three hours, and through the first part of it very little appears to happen beyond a bite growing out of the sun's edge. Maximum eclipse is at 13:05 local time with the sun 82 degrees above the horizon, almost directly overhead, and totality lasts 6 minutes and 23 seconds. The filters come off for those six minutes and go back on the instant the first point of sunlight returns.$A$),

  (6,
   $A$Dendera Temple$A$,
   $A$Dendera: A Quiet Day After$A$,
   26.1417, 32.6700,
   ARRAY[$A$Breakfast$A$, $A$Lunch$A$, $A$Dinner$A$],
   $A$Sofitel Winter Palace Luxor$A$,
   ARRAY[$A$%Dendera%$A$, $A$%Hathor%$A$],
   ARRAY[$A$%Abydos%$A$],
   $A$The painted ceiling of the Temple of Hathor at Dendera$A$,
   $A$The day after a total eclipse is not a day for an early start, and this one does not ask for it. Dendera is a drive north along the river, through farmland rather than desert. The temple of Hathor is among the most complete in Egypt, and the reason to come is overhead: a ceiling cleaned of centuries of soot, with blues and golds underneath close to what was first painted there. You can climb to the roof chapels and go down into a crypt reached by a narrow stair. Few coaches make the trip, so the hypostyle hall is usually yours to stand in.$A$),

  (7,
   $A$Cairo$A$,
   $A$Cairo: Departure$A$,
   30.0444, 31.2357,
   ARRAY[$A$Breakfast$A$],
   $A$$A$,
   ARRAY[$A$%airport%$A$, $A$%Cairo skyline%$A$, $A$%Cairo%$A$],
   ARRAY[$A$%Giza%$A$, $A$%Coptic%$A$, $A$%Al-Muizz%$A$, $A$%Islamic Cairo%$A$, $A$%Egyptian Museum%$A$, $A$%Ibn Tulun%$A$],
   $A$The Cairo skyline from the Nile before departure$A$,
   $A$A morning flight returns you to Cairo. Depending on your onward departure there may be room for one last stop, and your planner will have asked in advance which you would rather it was. Otherwise the transfer runs straight to the terminal, with the same assistance through check in that you had on arrival. You will have seen the pyramids, Karnak, the west bank and Dendera, and stood under six minutes of darkness in the middle of an afternoon.$A$)

),
resolved AS (
  SELECT s.*, hit.url AS image_url, hit.alt_en AS image_alt
  FROM spec s
  LEFT JOIN LATERAL (
    SELECT m.url, m.alt_en
    FROM unnest(s.patterns) WITH ORDINALITY AS p(pat, ord)
    JOIN media m ON m.alt_en ILIKE p.pat
    WHERE m.url <> $A$$A$
      AND (p.ord = 1 OR NOT (m.alt_en ILIKE ANY (s.excludes)))
      AND (m.mime_type LIKE $A$image/%$A$ OR m.url ~* $A$[.](webp|jpe?g|png|avif)$$A$)
    ORDER BY p.ord, m.id
    LIMIT 1
  ) AS hit ON TRUE
)
UPDATE tours tr
SET
  title            = $A$Egypt Solar Eclipse 2027 Tour Packages: Seven Days to Totality in Luxor$A$,
  description      = $A$<p>Egypt solar eclipse 2027 tour packages exist for one afternoon: 2 August 2027, when the moon covers the sun over Luxor for 6 minutes and 23 seconds.</p>
<p>This seven day itinerary is built backwards from that afternoon.</p>
<p>Giza, Karnak and the Valley of the Kings all come first, so that nothing of consequence is left to be seen after the event you travelled for.</p>
<p>Day five is the eclipse, and nothing else is scheduled on it.</p>
<p>Day six is deliberately quiet, a drive north to Dendera, because the day after a total eclipse is not a day for a demanding schedule.</p>

<h2>What These Egypt Solar Eclipse 2027 Tour Packages Include</h2>
<p>Six nights split between the Marriott Mena House under the pyramids at Giza and the Sofitel Winter Palace in Luxor.</p>
<p>Domestic flights south to Luxor on day three and back to Cairo on day seven.</p>
<p>Certified eclipse filters for every guest, because ordinary sunglasses are not protection at any point during the partial phases.</p>
<p>A viewing position in the Luxor area away from the main concentration of visitors, with the group in place well before first contact rather than arriving for the main event.</p>
<p>The full published inclusions are listed below this itinerary.</p>

<h2>Why Luxor and Not Cairo</h2>
<p>Cairo is not in the path of totality, and from Cairo the eclipse is a partial one only.</p>
<p>Luxor sits close to the point of greatest duration, which falls roughly 60 km southeast of the city.</p>
<p>Maximum eclipse over Luxor is at 13:05 local time, with the sun 82 degrees above the horizon.</p>
<p>Aswan is inside the path as well, but it receives four to five minutes rather than the full six.</p>
<p>No future eclipse offers this much totality until 2114, which is 87 years away.</p>

<h2>The Shape of the Week</h2>
<p>Days one to four are Egypt as you would want to see it anyway, arranged in the order that leaves the fifth day clear.</p>
<p>Day five runs to the sky's schedule rather than ours, and the whole event from first contact to last spans almost three hours.</p>
<p>Days six and seven bring you back north without asking anything of you.</p>$A$,
  focus_keyword    = $A$egypt solar eclipse 2027 tour packages$A$,
  seo_title        = $A$Egypt Solar Eclipse 2027 Tour Packages | Luxor$A$,
  meta_description = $A$Egypt solar eclipse 2027 tour packages built around 6 minutes 23 seconds of totality at Luxor on 2 August, with Giza, Karnak and the Valley of the Kings.$A$,
  hero_image_alt   = $A$Egypt solar eclipse 2027 tour packages: the sun in total eclipse above the desert outside Luxor$A$,
  canonical_url    = $A$https://iluxuryegypt.com/egypt-solar-eclipse-luxury-tour$A$,
  robots           = $A$index, follow$A$,
  schema_type      = $A$TouristTrip$A$,
  faqs             = $A$[
  {
    "id": "7b2d4e60-0001-4b20-9d02-ec2027100001",
    "question": "What makes these Egypt solar eclipse 2027 tour packages different from a standard Egypt itinerary?",
    "answer": "The date cannot move, so the itinerary is built backwards from 2 August 2027. Giza, Karnak and the Valley of the Kings are all seen before eclipse day, and day six is deliberately quiet. Nothing is scheduled on day five except the eclipse itself."
  },
  {
    "id": "7b2d4e60-0002-4b20-9d02-ec2027100002",
    "question": "How long will totality last?",
    "answer": "Totality at maximum lasts 6 minutes and 23 seconds. The point of greatest duration is roughly 60 km southeast of Luxor, and Luxor receives the full six minutes. Maximum eclipse over Luxor is at 13:05 local time."
  },
  {
    "id": "7b2d4e60-0003-4b20-9d02-ec2027100003",
    "question": "Why does the tour stay in Luxor rather than Cairo for the eclipse?",
    "answer": "Cairo is not in the path of totality. From Cairo you would see a partial eclipse only, with no darkness and no corona. Luxor is inside the path and close to the point of greatest duration."
  },
  {
    "id": "7b2d4e60-0004-4b20-9d02-ec2027100004",
    "question": "Is eye protection provided?",
    "answer": "Yes. Certified eclipse filters are provided for every guest. During every partial phase the sun must never be viewed without them, and ordinary sunglasses are not protection. Only during totality itself, when the disc is fully covered, is direct viewing safe."
  },
  {
    "id": "7b2d4e60-0005-4b20-9d02-ec2027100005",
    "question": "What are the chances of cloud on the day?",
    "answer": "Cloud cover probability for the Luxor area in early August is low, and the region has roughly an 80 percent likelihood of clear skies on eclipse day. No operator can promise weather, but the odds in Upper Egypt in August are among the best anywhere along the path."
  },
  {
    "id": "7b2d4e60-0006-4b20-9d02-ec2027100006",
    "question": "Will there be another eclipse like this one?",
    "answer": "No future eclipse offers this much totality until 2114, which is 87 years away. Most total eclipses give two or three minutes, and the North American eclipse of 2024 reached about four and a half minutes at its best point."
  }
]$A$::jsonb,
  itinerary = (
    SELECT jsonb_agg(
      jsonb_build_object(
        $A$day$A$,           r.day,
        $A$title$A$,         r.title,
        $A$description$A$,   r.description,
        $A$activities$A$,    $A$[]$A$::jsonb,
        $A$lat$A$,           r.lat,
        $A$lng$A$,           r.lng,
        $A$placeName$A$,     r.place_name,
        $A$image$A$,         COALESCE(r.image_url, $A$PENDING_UPLOAD$A$),
        $A$imageAlt$A$,      COALESCE(r.image_alt, r.alt_fallback),
        $A$accommodation$A$, r.accommodation,
        $A$meals$A$,         to_jsonb(r.meals)
      )
      ORDER BY r.day
    )
    FROM resolved r
  )
WHERE tr.slug = $A$egypt-solar-eclipse-luxury-tour$A$;

-- Built from the row's own faqs and itinerary. No offers, no priceRange, no
-- price property anywhere in this node.
UPDATE tours tr
SET schema_markup = jsonb_pretty(
  jsonb_build_object(
    $A$@context$A$, $A$https://schema.org$A$,
    $A$@graph$A$, jsonb_build_array(
      jsonb_build_object(
        $A$@type$A$, $A$TouristTrip$A$,
        $A$@id$A$, $A$https://iluxuryegypt.com/egypt-solar-eclipse-luxury-tour$A$,
        $A$name$A$, tr.title,
        $A$description$A$, tr.meta_description,
        $A$url$A$, $A$https://iluxuryegypt.com/egypt-solar-eclipse-luxury-tour$A$,
        $A$touristType$A$, $A$Eclipse travellers$A$,
        $A$provider$A$, jsonb_build_object($A$@type$A$, $A$Organization$A$, $A$name$A$, $A$iLuxury Egypt$A$),
        $A$itinerary$A$, jsonb_build_object(
          $A$@type$A$, $A$ItemList$A$,
          $A$numberOfItems$A$, jsonb_array_length(tr.itinerary),
          $A$itemListElement$A$, (
            SELECT jsonb_agg(jsonb_build_object(
              $A$@type$A$, $A$ListItem$A$,
              $A$position$A$, (e->>$A$day$A$)::int,
              $A$item$A$, jsonb_build_object(
                $A$@type$A$, $A$TouristAttraction$A$,
                $A$name$A$, e->>$A$placeName$A$,
                $A$description$A$, e->>$A$title$A$)))
            FROM jsonb_array_elements(tr.itinerary) AS e))
      ),
      jsonb_build_object(
          $A$@type$A$, $A$FAQPage$A$,
          $A$mainEntity$A$, (
            SELECT jsonb_agg(jsonb_build_object(
              $A$@type$A$, $A$Question$A$,
              $A$name$A$, e->>$A$question$A$,
              $A$acceptedAnswer$A$, jsonb_build_object(
                $A$@type$A$, $A$Answer$A$,
                $A$text$A$, e->>$A$answer$A$)))
            FROM jsonb_array_elements(tr.faqs) AS e)),
      jsonb_build_object(
        $A$@type$A$, $A$Event$A$,
        $A$name$A$, $A$Total Solar Eclipse of 2 August 2027$A$,
        $A$startDate$A$, $A$2027-08-02$A$,
        $A$eventAttendanceMode$A$, $A$https://schema.org/OfflineEventAttendanceMode$A$,
        $A$location$A$, jsonb_build_object(
          $A$@type$A$, $A$Place$A$,
          $A$name$A$, $A$Luxor, Egypt$A$,
          $A$address$A$, jsonb_build_object($A$@type$A$, $A$PostalAddress$A$, $A$addressLocality$A$, $A$Luxor$A$, $A$addressCountry$A$, $A$EG$A$))
      )
    )))
WHERE tr.slug = $A$egypt-solar-eclipse-luxury-tour$A$;

DO $GUARD$
DECLARE
  n int; gaps int; dupes int;
BEGIN
  SELECT jsonb_array_length(itinerary) INTO n FROM tours WHERE slug = $A$egypt-solar-eclipse-luxury-tour$A$;
  IF n IS DISTINCT FROM 7 THEN
    RAISE EXCEPTION $A$expected 7 days, got %$A$, n;
  END IF;

  SELECT count(*) INTO gaps
  FROM tours tr, jsonb_array_elements(tr.itinerary) WITH ORDINALITY AS e(d, ord)
  WHERE tr.slug = $A$egypt-solar-eclipse-luxury-tour$A$ AND (e.d->>$A$day$A$)::int <> e.ord;
  IF gaps > 0 THEN
    RAISE EXCEPTION $A$day numbers are not 1..7 in order$A$;
  END IF;

  IF EXISTS (SELECT 1 FROM tours WHERE slug = $A$egypt-solar-eclipse-luxury-tour$A$
             AND (schema_markup ILIKE $A$%priceRange%$A$
               OR schema_markup ILIKE $A$%"offers"%$A$
               OR schema_markup ILIKE $A$%"price"%$A$)) THEN
    RAISE EXCEPTION $A$a price property reached the tour schema$A$;
  END IF;

  SELECT count(*) INTO dupes FROM (
    SELECT e.d->>$A$image$A$ AS img
    FROM tours tr, jsonb_array_elements(tr.itinerary) AS e(d)
    WHERE tr.slug = $A$egypt-solar-eclipse-luxury-tour$A$ AND e.d->>$A$image$A$ <> $A$PENDING_UPLOAD$A$
    GROUP BY 1 HAVING count(*) > 1
  ) x;
  IF dupes > 0 THEN
    RAISE NOTICE $A$% photograph(s) are used on more than one day; see the SHARED rows below$A$, dupes;
  END IF;
END
$GUARD$;

COMMIT;

\echo
\echo eclipse-tour

SELECT
  slug,
  jsonb_array_length(itinerary) AS days,
  focus_keyword,
  length(description)           AS description_chars,
  jsonb_array_length(faqs)      AS faq_count
FROM tours WHERE slug = $A$egypt-solar-eclipse-luxury-tour$A$;

SELECT
  (d->>$A$day$A$)::int   AS day,
  d->>$A$placeName$A$    AS place_name,
  CASE WHEN d->>$A$image$A$ = $A$PENDING_UPLOAD$A$
       THEN $A$FALLBACK, needs upload$A$ ELSE $A$resolved$A$ END AS image_status,
  CASE WHEN d->>$A$image$A$ <> $A$PENDING_UPLOAD$A$
        AND count(*) OVER (PARTITION BY d->>$A$image$A$) > 1
       THEN $A$SHARED with another day$A$ ELSE $A$$A$ END AS note,
  d->>$A$accommodation$A$ AS accommodation,
  d->>$A$meals$A$         AS meals
FROM tours tr, jsonb_array_elements(tr.itinerary) AS d
WHERE tr.slug = $A$egypt-solar-eclipse-luxury-tour$A$
ORDER BY 1;
