-- Small Group Egypt Tours, phase 2: the remaining three tours in the
-- category, plus the category description rewritten to link all six.
--
-- Tour slug renames (301s added to server/tour-redirects.ts):
--   10-day-nile-cruise           -> egypt-nile-cruise-packages
--   luxury-siwa-oasis-expedition -> best-luxury-egypt-tours
--   7-day-vip-egypt              -> luxury-small-group-tours-egypt
--
-- All three new slugs were checked against App.tsx's routes, the prefix map
-- in server/path-redirects.ts, STATIC_PAGE_META and the category/tour tables,
-- and nothing claims them. In particular "egypt-nile-cruise-packages" does
-- not collide with the listing regex in server/seo-meta.ts: that pattern
-- requires the literal segment "egypt-nile-cruise-tours" followed by a
-- second path segment, so a one-segment root path cannot match it.
--
-- RUN AFTER content-updates/update-small-group-part1.sql. The category
-- UPDATE below keys on the renamed slug "small-group-egypt-tours" and
-- replaces the description that script wrote.
--
-- Same conventions as part 1: no em/en dash in any text field (enforced by
-- the generator), description fields are real HTML because legacyTextToHtml.ts
-- only auto-wraps plain text when it sees zero tags, and every FAQ entry
-- carries a generated id, which faqSchema requires.
--
-- Ordering note: placeName corrections run BEFORE the imageAlt catch-all,
-- because that catch-all builds alt text out of placeName.

BEGIN;

-- ---------------------------------------------------------------------------
-- Category description: now links all six tours
-- ---------------------------------------------------------------------------
UPDATE categories
SET description = '<p>Our small group Egypt tours are built for travellers who want company without compromise. Each journey is limited to a handful of guests, which changes everything: you move through temples without waiting, your Egyptologist can actually answer every question, and the itinerary flexes when something captures the group''s interest.</p>
<p>These are not coach tours with forty strangers. A private Nile cruise carries only your group, five-star stays are selected for character rather than capacity, and every transfer is handled privately. What you gain is the ease of shared travel with the access and pace of a private journey.</p>
<h2>Why Choose Luxury Small Group Tours in Egypt</h2>
<p>Travelling in a small group means the guide is genuinely yours, the vehicle is comfortable rather than crowded, and access to <a href="/private-access">restricted sites</a> becomes possible in ways large groups cannot manage. It also makes a private Egypt tour experience more affordable, without sacrificing the quality that defines it.</p>
<h3>What Makes Our Small Group Tours of Egypt Different</h3>
<p>Group sizes stay small by design, itineraries avoid the midday crush at major sites, and every journey includes at least one experience reserved for a privileged few, whether that means a temple after closing or a pyramid chamber before the gates open.</p>
<h3>Choosing Between Our Six Itineraries</h3>
<p>The collection opens with a <a href="/luxury-small-group-tours-egypt">seven-day journey</a> covering the Pyramids, Abu Simbel and a Nile cruise, and a <a href="/egypt-private-tours">nine-day route</a> pairing Luxor''s royal tombs with three days on the Red Sea. For travellers who want the river at the centre, <a href="/egypt-nile-cruise-packages">ten days sail Luxor to Aswan</a> aboard a single vessel.</p>
<p>The longer journeys go further in different directions: <a href="/egypt-small-group-tour">fourteen days</a> add the rarely visited rock tombs of Middle Egypt, <a href="/egypt-private-tour-packages">fourteen days of privileged access</a> open the King''s Chamber and the Sphinx enclosure before the public arrives, and <a href="/best-luxury-egypt-tours">sixteen days</a> reach Alexandria and the Berber settlements of Siwa Oasis.</p>',
    updated_at = now()
WHERE slug = 'small-group-egypt-tours';

-- ---------------------------------------------------------------------------
-- Tours: content + SEO
-- ---------------------------------------------------------------------------
-- 10-day-nile-cruise -> egypt-nile-cruise-packages
UPDATE tours
SET
  slug = 'egypt-nile-cruise-packages',
  title = 'Egypt Nile Cruise Packages: 10-Day Luxury Journey',
  description = '<p>Our Egypt Nile cruise packages place the river at the centre of the journey rather than treating it as transport between temples. After three days in Cairo and Giza, including <a href="/private-access">pre-opening access to the King''s Chamber</a> inside the Great Pyramid, you board MS Le Fayan at <a href="/destinations/luxor">Luxor</a> for the sail south toward <a href="/destinations/aswan">Aswan</a>.</p>
<h3>What the Cruise Segment Includes</h3>
<p>Between Luxor and Aswan the vessel stops at Edfu, reached by traditional horse-drawn carriage, and Kom Ombo, where a rare dual temple honours both Sobek and Harpoeris. Private access to the Khonsu Temple at Karnak, closed to regular visitors, opens the cruise segment before the first night aboard.</p>
<p>A pre-dawn departure reaches Abu Simbel as sunrise strikes the colossal statues of Ramses II, followed by the High Dam, a Nubian village, and a sunset felucca sail with champagne. Each luxury Egypt tour package on this route includes a Luxury Suite with private balcony throughout the cruise, and ten days allows the river to set the pace, which is precisely what makes this egypt luxury tour different from a temple checklist. It sits in the middle of our <a href="/luxury-egypt-tour-packages/small-group-egypt-tours">small group Egypt tours</a> range.</p>',
  hero_image_alt = 'MS Le Fayan sailing the Nile at sunset on an Egypt Nile cruise package',
  focus_keyword = 'egypt nile cruise packages',
  seo_title = 'Egypt Nile Cruise Packages | 10-Day Luxury Journey',
  meta_description = 'Egypt Nile cruise packages aboard MS Le Fayan, sailing Luxor to Aswan with private pyramid access, Abu Simbel at dawn, and five-star suites.',
  schema_type = 'TouristTrip',
  faqs = '[{"id":"418bebcd-c9e6-48fa-aafe-756e7b9e99c3","question":"What''s included in your Egypt Nile cruise packages?","answer":"Nine nights of accommodation split between the Marriott Mena House in Giza and a Luxury Suite aboard MS Le Fayan, all meals, private Egyptologist guiding, domestic flights, and pre-opening Giza access."},{"id":"efe46e87-96a8-44a9-9054-e89a74ca3007","question":"How long is the Nile cruise portion?","answer":"Five nights aboard MS Le Fayan, sailing between Luxor and Aswan with stops at Edfu and Kom Ombo along the route."},{"id":"869dc7bb-ec1e-4500-bbbc-094dcd6721c1","question":"Is private pyramid access really included?","answer":"Yes. The itinerary includes pre-opening entry to the Great Pyramid''s inner chambers and the Sphinx enclosure permit, both arranged in advance."},{"id":"9ce67d91-e396-4756-b4a6-fdd2f3a1379d","question":"What is the Khonsu Temple?","answer":"A smaller temple within the Karnak complex, normally closed to visitors. Access is arranged specifically for this itinerary."},{"id":"752064c4-c4e3-4413-ad93-c614a795f8e3","question":"When is the best time for these luxury Egypt tours?","answer":"October through April offers the most comfortable sailing and temple conditions. Summer departures run but require earlier starts."}]'::jsonb,
  updated_at = now()
WHERE slug = '10-day-nile-cruise';

-- luxury-siwa-oasis-expedition -> best-luxury-egypt-tours
UPDATE tours
SET
  slug = 'best-luxury-egypt-tours',
  title = 'Best Luxury Egypt Tours: 16-Day Grand Discovery',
  description = '<p>For travellers researching the best luxury Egypt tours, this sixteen-day archaeological journey reaches sites that appear on almost no other itinerary. Abu Rawash and Abu Sir require <a href="/private-access">special permissions</a>. Meidum, Hawara''s legendary Labyrinth, and Beni Hassan sit in Middle Egypt, a region most visitors pass through without stopping.</p>
<h3>Where These Luxury Egypt Tours Go That Others Do Not</h3>
<p>The route continues to Tell el-Amarna, Akhenaten''s erased capital, then Abydos and Dendera before reaching <a href="/destinations/luxor">Luxor</a>''s Lost Golden City, discovered in 2020 and the most significant find since Tutankhamun. <a href="/destinations/alexandria">Alexandria</a> follows with its Greco-Roman catacombs, then five days in <a href="/destinations/siwa-oasis">Siwa Oasis</a>, a Berber settlement isolated from the world until the 1980s.</p>
<p>Guiding is handled by a PhD-level Egyptologist throughout, and the itinerary closes with a private lecture from a renowned specialist connecting everything you have seen. Accommodation spans the <a href="/hotel/mena-house-hotel-egypt">Marriott Mena House</a>, Sofitel Winter Palace, Four Seasons Alexandria, and a kershef-built eco-lodge in Siwa. Sixteen days of this egypt luxury tour covers ground that shorter <a href="/luxury-egypt-tour-packages/small-group-egypt-tours">small group Egypt tours</a> simply cannot attempt.</p>',
  hero_image_alt = 'Great Sand Sea dunes at Siwa Oasis on one of the best luxury Egypt tours',
  focus_keyword = 'best luxury egypt tours',
  seo_title = 'Best Luxury Egypt Tours | 16-Day Grand Discovery',
  meta_description = 'Among the best luxury Egypt tours available, this 16-day archaeology journey reaches Abu Rawash, Amarna, the Lost Golden City, and Siwa Oasis.',
  schema_type = 'TouristTrip',
  faqs = '[{"id":"bfc8e34e-b39d-415d-a4ae-3f82bb3de8b4","question":"What makes this one of the best luxury Egypt tours?","answer":"Access to restricted sites. Abu Rawash, Abu Sir, the Hawara Labyrinth, and the Lost Golden City all require permissions arranged in advance, and few operators include them."},{"id":"c5dc6de3-f07d-4cc7-a390-24c97ae4ce15","question":"Is sixteen days too long for Egypt?","answer":"Not for this route. The itinerary covers Cairo, Middle Egypt, Luxor, Alexandria, and Siwa, with genuine rest days built into the Alexandria and Siwa segments."},{"id":"96815e6f-053f-451c-b76f-fa3a8bf12b26","question":"How remote is Siwa Oasis?","answer":"Siwa sits in the Western Desert near the Libyan border, eighteen metres below sea level, and remained largely cut off until the 1980s. Its Berber culture and language remain distinct from the rest of Egypt."},{"id":"3af3e623-f418-4ef3-87ad-c908e22dfca6","question":"Who guides this egypt luxury tour?","answer":"A PhD-level Egyptologist accompanies the entire journey, and a separate private lecture with a renowned specialist closes the itinerary in Cairo."},{"id":"09f54a7d-a8cf-4e48-bec1-3ee6d9419431","question":"Is this itinerary physically demanding?","answer":"Moderately. Several sites involve uneven terrain and descending into tombs, and the desert segments require long drives. It suits travellers in reasonable health."}]'::jsonb,
  updated_at = now()
WHERE slug = 'luxury-siwa-oasis-expedition';

-- 7-day-vip-egypt -> luxury-small-group-tours-egypt
UPDATE tours
SET
  slug = 'luxury-small-group-tours-egypt',
  title = 'Luxury Small Group Tours Egypt: 7-Day Pyramids, Aswan & Abu Simbel',
  description = '<p>Our luxury small group tours Egypt itineraries prove that seven days is enough when the group stays small and the access is real. This journey includes <a href="/private-access">after-hours entry to the King''s Chamber</a> inside the Great Pyramid, standing between the paws of the Sphinx with a permit reserved for dignitaries, and a pre-dawn flight to Abu Simbel.</p>
<h3>How Seven Days Covers Egypt''s Essentials</h3>
<p>From <a href="/destinations/aswan">Aswan</a> the itinerary continues aboard MS Le Fayan, with a Luxury Suite and private balcony, sailing north past Kom Ombo and Edfu toward <a href="/destinations/luxor">Luxor</a>. The Valley of the Kings and Karnak Temple follow, before the return flight to Cairo and a final night overlooking the Nile.</p>
<p>Accommodation runs from the <a href="/hotel/mena-house-hotel-egypt">Marriott Mena House</a> at the foot of the pyramids, through the Nile cruise, to the <a href="/hotel/four-seasons-first-residence-cairo">Four Seasons Cairo at The First Residence</a>. All domestic flights, private guiding, and site entries are included. A small group means the guide is genuinely yours, which makes this luxury Egypt tour feel far closer to private than shared. It is the shortest of our <a href="/luxury-egypt-tour-packages/small-group-egypt-tours">small group Egypt tours</a>.</p>',
  hero_image_alt = 'Abu Simbel temples at sunrise on a luxury small group tour Egypt',
  focus_keyword = 'luxury small group tours egypt',
  seo_title = 'Luxury Small Group Tours Egypt | 7-Day Journey',
  meta_description = 'Luxury small group tours Egypt with private pyramid access, a Nile cruise, and Abu Simbel at sunrise, limited to a handful of travellers.',
  schema_type = 'TouristTrip',
  faqs = '[{"id":"b2205c32-60d8-4dad-8bd5-aa387f8ea7bc","question":"How many travellers join these luxury small group tours Egypt?","answer":"Groups are capped at twelve guests, with a typical size of eight to ten, which keeps guiding personal and allows the pace to adjust."},{"id":"003f0257-e8ad-4cdc-9fb0-9a29f829eed3","question":"Is private pyramid access included?","answer":"Yes. The itinerary includes after-hours entry to the Great Pyramid''s King''s Chamber and a permit to stand between the Sphinx''s paws, both arranged in advance."},{"id":"56d49cf1-d09b-429f-b7bb-2a6a34380461","question":"Is seven days enough for Egypt?","answer":"For the Pyramids, Abu Simbel, a Nile cruise, and Luxor''s royal tombs, yes. Travellers wanting Alexandria, Siwa, or the Red Sea should consider our longer itineraries."},{"id":"d85ce4fb-fb85-42ea-b2cd-a18e2dbf7abf","question":"How does this compare to your other luxury Egypt tours?","answer":"It is the shortest itinerary that still includes both private pyramid access and a Nile cruise, making it the most efficient way to see Egypt''s essentials."},{"id":"3b0cd115-7afa-4586-a883-727903afbffa","question":"What is MS Le Fayan?","answer":"A five-star Nile vessel where your small group occupies only a handful of suites, each with a private balcony, sailing between Aswan and Luxor."}]'::jsonb,
  updated_at = now()
WHERE slug = '7-day-vip-egypt';

-- ---------------------------------------------------------------------------
-- placeName corrections (must precede the imageAlt catch-all)
-- ---------------------------------------------------------------------------
-- best-luxury-egypt-tours: placeNames that were inconsistent, truncated ("Lost Golden City,d") or plain wrong for the day's actual stops.
UPDATE tours
SET itinerary = (
  SELECT jsonb_agg(
    CASE
      WHEN (NULLIF(day_entry->>'day', ''))::int = 5
        THEN jsonb_set(day_entry, '{placeName}', '"Meidum and Beni Hassan"'::jsonb)
      WHEN (NULLIF(day_entry->>'day', ''))::int = 7
        THEN jsonb_set(day_entry, '{placeName}', '"Abydos and Dendera"'::jsonb)
      WHEN (NULLIF(day_entry->>'day', ''))::int = 8
        THEN jsonb_set(day_entry, '{placeName}', '"Lost Golden City"'::jsonb)
      WHEN (NULLIF(day_entry->>'day', ''))::int = 10
        THEN jsonb_set(day_entry, '{placeName}', '"Roman Theatre, Alexandria"'::jsonb)
      WHEN (NULLIF(day_entry->>'day', ''))::int = 12
        THEN jsonb_set(day_entry, '{placeName}', '"Siwa Oasis"'::jsonb)
      WHEN (NULLIF(day_entry->>'day', ''))::int = 14
        THEN jsonb_set(day_entry, '{placeName}', '"Cairo"'::jsonb)
      ELSE day_entry
    END
    ORDER BY ord
  )
  FROM jsonb_array_elements(itinerary) WITH ORDINALITY AS t(day_entry, ord)
), updated_at = now()
WHERE slug = 'best-luxury-egypt-tours' AND jsonb_typeof(itinerary) = 'array';

-- ---------------------------------------------------------------------------
-- imageAlt
-- ---------------------------------------------------------------------------
-- egypt-nile-cruise-packages: alts given explicitly per day.
UPDATE tours
SET itinerary = (
  SELECT jsonb_agg(
    CASE
      WHEN (NULLIF(day_entry->>'day', ''))::int = 1
        THEN jsonb_set(day_entry, '{imageAlt}', '"Pyramids of Giza viewed from Marriott Mena House"'::jsonb)
      WHEN (NULLIF(day_entry->>'day', ''))::int = 2
        THEN jsonb_set(day_entry, '{imageAlt}', '"Step Pyramid of Djoser at Saqqara"'::jsonb)
      WHEN (NULLIF(day_entry->>'day', ''))::int = 3
        THEN jsonb_set(day_entry, '{imageAlt}', '"Great Sphinx at the Giza Plateau on an Egypt Nile cruise package"'::jsonb)
      WHEN (NULLIF(day_entry->>'day', ''))::int = 4
        THEN jsonb_set(day_entry, '{imageAlt}', '"Karnak Temple Hypostyle Hall in Luxor"'::jsonb)
      WHEN (NULLIF(day_entry->>'day', ''))::int = 5
        THEN jsonb_set(day_entry, '{imageAlt}', '"Valley of the Kings royal tombs in Luxor"'::jsonb)
      WHEN (NULLIF(day_entry->>'day', ''))::int = 9
        THEN jsonb_set(day_entry, '{imageAlt}', '"Tutankhamun collection at the Grand Egyptian Museum"'::jsonb)
      WHEN (NULLIF(day_entry->>'day', ''))::int = 10
        THEN jsonb_set(day_entry, '{imageAlt}', '"Nile view from Four Seasons Cairo at The First Residence"'::jsonb)
      ELSE day_entry
    END
    ORDER BY ord
  )
  FROM jsonb_array_elements(itinerary) WITH ORDINALITY AS t(day_entry, ord)
), updated_at = now()
WHERE slug = 'egypt-nile-cruise-packages' AND jsonb_typeof(itinerary) = 'array';

-- best-luxury-egypt-tours: departure day, which the catch-all below cannot reach because its alt carries no boilerplate marker.
UPDATE tours
SET itinerary = (
  SELECT jsonb_agg(
    CASE
      WHEN (NULLIF(day_entry->>'day', ''))::int = 16
        THEN jsonb_set(day_entry, '{imageAlt}', '"Departure from Cairo after a 16-day luxury Egypt tour"'::jsonb)
      ELSE day_entry
    END
    ORDER BY ord
  )
  FROM jsonb_array_elements(itinerary) WITH ORDINALITY AS t(day_entry, ord)
), updated_at = now()
WHERE slug = 'best-luxury-egypt-tours' AND jsonb_typeof(itinerary) = 'array';

-- luxury-small-group-tours-egypt: alts given explicitly per day.
UPDATE tours
SET itinerary = (
  SELECT jsonb_agg(
    CASE
      WHEN (NULLIF(day_entry->>'day', ''))::int = 1
        THEN jsonb_set(day_entry, '{imageAlt}', '"Pyramids of Giza viewed from Marriott Mena House"'::jsonb)
      WHEN (NULLIF(day_entry->>'day', ''))::int = 2
        THEN jsonb_set(day_entry, '{imageAlt}', '"Tutankhamun collection at the Grand Egyptian Museum"'::jsonb)
      WHEN (NULLIF(day_entry->>'day', ''))::int = 3
        THEN jsonb_set(day_entry, '{imageAlt}', '"Abu Simbel colossal statues at sunrise on a luxury small group tour Egypt"'::jsonb)
      WHEN (NULLIF(day_entry->>'day', ''))::int = 4
        THEN jsonb_set(day_entry, '{imageAlt}', '"Kom Ombo dual temple beside the Nile"'::jsonb)
      WHEN (NULLIF(day_entry->>'day', ''))::int = 5
        THEN jsonb_set(day_entry, '{imageAlt}', '"Valley of the Kings royal tombs in Luxor"'::jsonb)
      WHEN (NULLIF(day_entry->>'day', ''))::int = 6
        THEN jsonb_set(day_entry, '{imageAlt}', '"Karnak Temple Avenue of Sphinxes in Luxor"'::jsonb)
      WHEN (NULLIF(day_entry->>'day', ''))::int = 7
        THEN jsonb_set(day_entry, '{imageAlt}', '"Nile view from Four Seasons Cairo at The First Residence"'::jsonb)
      ELSE day_entry
    END
    ORDER BY ord
  )
  FROM jsonb_array_elements(itinerary) WITH ORDINALITY AS t(day_entry, ord)
), updated_at = now()
WHERE slug = 'luxury-small-group-tours-egypt' AND jsonb_typeof(itinerary) = 'array';

-- egypt-nile-cruise-packages: any remaining boilerplate alt, rebuilt from the day's own
-- placeName (corrected above where needed), so it is right by construction.
UPDATE tours
SET itinerary = (
  SELECT jsonb_agg(
    CASE
      WHEN day_entry->>'imageAlt' LIKE '%iLuxury Egypt%'
           AND COALESCE(day_entry->>'placeName', '') NOT IN ('', '-')
        THEN jsonb_set(day_entry, '{imageAlt}', to_jsonb((day_entry->>'placeName') || ' on an Egypt Nile cruise package'))
      ELSE day_entry
    END
    ORDER BY ord
  )
  FROM jsonb_array_elements(itinerary) WITH ORDINALITY AS t(day_entry, ord)
), updated_at = now()
WHERE slug = 'egypt-nile-cruise-packages'
  AND jsonb_typeof(itinerary) = 'array'
  AND itinerary::text LIKE '%iLuxury Egypt%';

-- best-luxury-egypt-tours: any remaining boilerplate alt, rebuilt from the day's own
-- placeName (corrected above where needed), so it is right by construction.
UPDATE tours
SET itinerary = (
  SELECT jsonb_agg(
    CASE
      WHEN day_entry->>'imageAlt' LIKE '%iLuxury Egypt%'
           AND COALESCE(day_entry->>'placeName', '') NOT IN ('', '-')
        THEN jsonb_set(day_entry, '{imageAlt}', to_jsonb((day_entry->>'placeName') || ' on one of the best luxury Egypt tours'))
      ELSE day_entry
    END
    ORDER BY ord
  )
  FROM jsonb_array_elements(itinerary) WITH ORDINALITY AS t(day_entry, ord)
), updated_at = now()
WHERE slug = 'best-luxury-egypt-tours'
  AND jsonb_typeof(itinerary) = 'array'
  AND itinerary::text LIKE '%iLuxury Egypt%';

-- luxury-small-group-tours-egypt: any remaining boilerplate alt, rebuilt from the day's own
-- placeName (corrected above where needed), so it is right by construction.
UPDATE tours
SET itinerary = (
  SELECT jsonb_agg(
    CASE
      WHEN day_entry->>'imageAlt' LIKE '%iLuxury Egypt%'
           AND COALESCE(day_entry->>'placeName', '') NOT IN ('', '-')
        THEN jsonb_set(day_entry, '{imageAlt}', to_jsonb((day_entry->>'placeName') || ' on a luxury small group tour Egypt'))
      ELSE day_entry
    END
    ORDER BY ord
  )
  FROM jsonb_array_elements(itinerary) WITH ORDINALITY AS t(day_entry, ord)
), updated_at = now()
WHERE slug = 'luxury-small-group-tours-egypt'
  AND jsonb_typeof(itinerary) = 'array'
  AND itinerary::text LIKE '%iLuxury Egypt%';

-- ---------------------------------------------------------------------------
-- Factual and wording corrections
-- ---------------------------------------------------------------------------
-- Day 7: only two of the six statues depict Nefertari at the pharaoh's scale, which is the part that was actually unprecedented.
UPDATE tours
SET itinerary = replace(itinerary::text, 'six equal-sized colossal statues honoring her extraordinary status', 'six colossal statues, two of which depict Nefertari at equal scale to the pharaoh, an honour without precedent')::jsonb,
    updated_at = now()
WHERE slug = 'egypt-nile-cruise-packages' AND itinerary::text LIKE '%six equal-sized colossal statues honoring her extraordinary status%';

-- Day 7: metric, matching the rest of the copy.
UPDATE tours
SET itinerary = replace(itinerary::text, 'sixty-five-foot statues', 'twenty-metre statues')::jsonb,
    updated_at = now()
WHERE slug = 'egypt-nile-cruise-packages' AND itinerary::text LIKE '%sixty-five-foot statues%';

-- Day 4: the suite count described the whole vessel, not the group.
UPDATE tours
SET itinerary = replace(itinerary::text, 'only fifty suites', 'your small group occupying only a handful of its suites')::jsonb,
    updated_at = now()
WHERE slug = 'egypt-nile-cruise-packages' AND itinerary::text LIKE '%only fifty suites%';

-- Day 3: same suite-count wording as above.
UPDATE tours
SET itinerary = replace(itinerary::text, 'only fifty suites', 'your small group occupying only a handful of its suites')::jsonb,
    updated_at = now()
WHERE slug = 'luxury-small-group-tours-egypt' AND itinerary::text LIKE '%only fifty suites%';

-- Day 2: the pyramid at Saqqara is Teti I's.
UPDATE tours
SET itinerary = replace(itinerary::text, 'Teti''s', 'Teti I''s')::jsonb,
    updated_at = now()
WHERE slug = 'best-luxury-egypt-tours' AND itinerary::text LIKE '%Teti''s%';

-- Day 10 is in Alexandria, so the hotel is the San Stefano property, not the Marsa Matruh resort. Covers the description, the Overnight line and accommodation in one pass.
UPDATE tours
SET itinerary = replace(itinerary::text, 'Jaz Almaza Beach Resort', 'Four Seasons Hotel Alexandria at San Stefano')::jsonb,
    updated_at = now()
WHERE slug = 'best-luxury-egypt-tours' AND itinerary::text LIKE '%Jaz Almaza Beach Resort%';

-- Day 6: unify the Cairo hotel on the First Residence property.
UPDATE tours
SET itinerary = replace(itinerary::text, 'Four Seasons Hotel Cairo at Nile Plaza', 'Four Seasons Hotel Cairo at The First Residence')::jsonb,
    updated_at = now()
WHERE slug = 'luxury-small-group-tours-egypt' AND itinerary::text LIKE '%Four Seasons Hotel Cairo at Nile Plaza%';

-- Day 6: unify the Cairo hotel on the First Residence property.
UPDATE tours
SET itinerary = replace(itinerary::text, 'Four Seasons Nile Plaza', 'Four Seasons Hotel Cairo at The First Residence')::jsonb,
    updated_at = now()
WHERE slug = 'luxury-small-group-tours-egypt' AND itinerary::text LIKE '%Four Seasons Nile Plaza%';

-- El-Alamein sits inland from Marsa Matruh, not Alexandria, so the mention
-- belongs to the coordinates this day used to carry rather than to the day
-- itself. Removes the sentence containing it; idempotent because the match
-- is gone afterwards.
UPDATE tours
SET itinerary = (
  SELECT jsonb_agg(
    CASE
      WHEN (NULLIF(day_entry->>'day', ''))::int = 10
           AND day_entry->>'description' LIKE '%El-Alamein%'
        THEN jsonb_set(
               day_entry,
               '{description}',
               to_jsonb(btrim(regexp_replace(day_entry->>'description', '[^.]*El-Alamein[^.]*\.\s*', '', 'g')))
             )
      ELSE day_entry
    END
    ORDER BY ord
  )
  FROM jsonb_array_elements(itinerary) WITH ORDINALITY AS t(day_entry, ord)
), updated_at = now()
WHERE slug = 'best-luxury-egypt-tours' AND jsonb_typeof(itinerary) = 'array';

-- Day 3's copy mentioned a pre-dawn flight without saying where from or
-- where to. Appended as its own sentence rather than edited into the
-- existing one, so the surrounding wording is untouched.
UPDATE tours
SET itinerary = (
  SELECT jsonb_agg(
    CASE
      WHEN (NULLIF(day_entry->>'day', ''))::int = 3
           AND day_entry->>'description' NOT LIKE '%continues to Aswan after Abu Simbel%'
        THEN jsonb_set(
               day_entry,
               '{description}',
               to_jsonb((day_entry->>'description') || ' The flight leaves Cairo and continues to Aswan after Abu Simbel.')
             )
      ELSE day_entry
    END
    ORDER BY ord
  )
  FROM jsonb_array_elements(itinerary) WITH ORDINALITY AS t(day_entry, ord)
), updated_at = now()
WHERE slug = 'luxury-small-group-tours-egypt' AND jsonb_typeof(itinerary) = 'array';

-- ---------------------------------------------------------------------------
-- Coordinates and accommodation
-- ---------------------------------------------------------------------------
-- Saqqara had no coordinates, so day 2 was missing from the itinerary map.
UPDATE tours
SET itinerary = (
  SELECT jsonb_agg(
    CASE
      WHEN (NULLIF(day_entry->>'day', ''))::int = 2 AND NOT (day_entry ? 'lat')
        THEN day_entry || '{"lat":29.8711,"lng":31.2165}'::jsonb
      ELSE day_entry
    END
    ORDER BY ord
  )
  FROM jsonb_array_elements(itinerary) WITH ORDINALITY AS t(day_entry, ord)
), updated_at = now()
WHERE slug = 'egypt-nile-cruise-packages' AND jsonb_typeof(itinerary) = 'array';

-- Day 10's coordinates pointed at Marsa Matruh, roughly 300km west of
-- Alexandria, which put the map pin in the wrong place entirely. Also sets
-- accommodation directly, so the field is right regardless of how it was
-- worded before the text swap above.
UPDATE tours
SET itinerary = (
  SELECT jsonb_agg(
    CASE
      WHEN (NULLIF(day_entry->>'day', ''))::int = 10
        THEN jsonb_set(
               day_entry || '{"lat":31.2001,"lng":29.9187}'::jsonb,
               '{accommodation}',
               '"Four Seasons Hotel Alexandria at San Stefano"'::jsonb
             )
      ELSE day_entry
    END
    ORDER BY ord
  )
  FROM jsonb_array_elements(itinerary) WITH ORDINALITY AS t(day_entry, ord)
), updated_at = now()
WHERE slug = 'best-luxury-egypt-tours' AND jsonb_typeof(itinerary) = 'array';

-- luxury-small-group-tours-egypt: day 6 accommodation, set directly so all three mentions agree.
UPDATE tours
SET itinerary = (
  SELECT jsonb_agg(
    CASE
      WHEN (NULLIF(day_entry->>'day', ''))::int = 6
        THEN jsonb_set(day_entry, '{accommodation}', '"Four Seasons Hotel Cairo at The First Residence"'::jsonb)
      ELSE day_entry
    END
    ORDER BY ord
  )
  FROM jsonb_array_elements(itinerary) WITH ORDINALITY AS t(day_entry, ord)
), updated_at = now()
WHERE slug = 'luxury-small-group-tours-egypt' AND jsonb_typeof(itinerary) = 'array';

-- ---------------------------------------------------------------------------
-- Asset URL shape and dash cleanup, same rules as part 1
-- ---------------------------------------------------------------------------
UPDATE tours
SET itinerary = regexp_replace(itinerary::text, 'https?://[^/"]+/api/assets/', '/api/assets/', 'g')::jsonb,
    updated_at = now()
WHERE slug IN ('egypt-nile-cruise-packages', 'best-luxury-egypt-tours', 'luxury-small-group-tours-egypt')
  AND itinerary::text ~ 'https?://[^/"]+/api/assets/';

UPDATE tours
SET itinerary = replace(replace(itinerary::text, ' — ', ', '), ' – ', ', ')::jsonb,
    updated_at = now()
WHERE slug IN ('egypt-nile-cruise-packages', 'best-luxury-egypt-tours', 'luxury-small-group-tours-egypt')
  AND (itinerary::text LIKE '% — %' OR itinerary::text LIKE '% – %');

COMMIT;

-- ---------------------------------------------------------------------------
-- Verification
-- ---------------------------------------------------------------------------
SELECT slug, category, focus_keyword, length(seo_title) AS seo_len,
       length(meta_description) AS meta_len, jsonb_array_length(faqs) AS faq_count
FROM tours WHERE slug IN ('egypt-nile-cruise-packages', 'best-luxury-egypt-tours', 'luxury-small-group-tours-egypt') ORDER BY slug;

SELECT 'faqs missing id' AS check, count(*) AS bad
FROM tours, jsonb_array_elements(faqs) f
WHERE slug IN ('egypt-nile-cruise-packages', 'best-luxury-egypt-tours', 'luxury-small-group-tours-egypt') AND NOT (f ? 'id');

SELECT slug,
  (itinerary::text LIKE '%iLuxury Egypt%')          AS boilerplate_alt_left,
  (itinerary::text ~ 'https?://[^/"]+/api/assets/') AS absolute_urls_left,
  (itinerary::text ~ '[–—]')              AS dashes_left,
  (itinerary::text LIKE '%Nile Plaza%')             AS nile_plaza_left,
  (itinerary::text LIKE '%Jaz Almaza%')             AS wrong_hotel_left,
  (itinerary::text LIKE '%El-Alamein%')             AS elalamein_left,
  (itinerary::text LIKE '%only fifty suites%')      AS suite_count_left
FROM tours WHERE slug IN ('egypt-nile-cruise-packages', 'best-luxury-egypt-tours', 'luxury-small-group-tours-egypt') ORDER BY slug;

-- All six tours should now be linked from the category description.
SELECT 'category tour links' AS check,
       (SELECT count(*) FROM regexp_matches(description, 'href="/(egypt-small-group-tour|egypt-private-tour-packages|egypt-private-tours|egypt-nile-cruise-packages|best-luxury-egypt-tours|luxury-small-group-tours-egypt)"', 'g')) AS links
FROM categories WHERE slug = 'small-group-egypt-tours';
