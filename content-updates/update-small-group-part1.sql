-- Small Group Egypt Tours, phase 1: the category landing page plus the
-- first three tours in it.
--
-- Category slug rename (301 added to server/path-redirects.ts):
--   small-group-tours-egypt -> small-group-egypt-tours
--
-- Tour slug renames (301s added to server/tour-redirects.ts):
--   14-day-royal-egypt             -> egypt-private-tour-packages
--   9-day-egypt-pyramids-luxor-sea -> egypt-private-tours
--
--   14-day-egypt-small-group-tour  -> egypt-small-group-tour
--
-- That last one was originally requested as "luxury-egypt-tour-packages",
-- which is not usable: tours are served from the site root (App.tsx's
-- catch-all "/:slug"), and "/luxury-egypt-tour-packages" is already the
-- packages landing page (an earlier App.tsx route, the target of the
-- /egypt-tour-packages 301 in server/path-redirects.ts, and a main nav
-- entry). Wouter matches routes in order, so the tour page would have been
-- unreachable, and that landing page already targets that keyword. The tour
-- was re-pointed at "egypt small group tour" instead, which nothing else
-- claims.
--
-- Requires the categories.faqs column (added to the idempotent ALTER TABLE
-- runner in server/routes.ts, applied on server start).
--
-- categories.name changes here, and tours.category stores the category's
-- display NAME as free text (matched by exact string equality in
-- server/routes.ts), so the rename is cascaded onto tours.category by the
-- OLD name below. There is no foreign key between the two tables.
--
-- No em dash or en dash in any text field (enforced by the generator that
-- produced this file). description fields are real HTML because
-- legacyTextToHtml.ts only auto-wraps plain text when it detects zero HTML
-- tags. Every FAQ entry carries a generated id, which faqSchema requires
-- (see backfill-faq-ids.sql for what happens when it is missing).

BEGIN;

-- ---------------------------------------------------------------------------
-- Landing page: categories row
-- ---------------------------------------------------------------------------
UPDATE categories
SET
  slug = 'small-group-egypt-tours',
  name = 'Small Group Egypt Tours',
  description = '<p>Our small group Egypt tours are built for travellers who want company without compromise. Each journey is limited to a handful of guests, which changes everything: you move through temples without waiting, your Egyptologist can actually answer every question, and the itinerary flexes when something captures the group''s interest.</p>
<p>These are not coach tours with forty strangers. A <a href="/egypt-private-tour-packages">private Nile cruise</a> carries only your group, five-star stays are selected for character rather than capacity, and every transfer is handled privately. What you gain is the ease of shared travel with the access and pace of a private journey.</p>
<h2>Why Choose Luxury Small Group Tours in Egypt</h2>
<p>Travelling in a small group means the guide is genuinely yours, the vehicle is comfortable rather than crowded, and access to <a href="/private-access">restricted sites</a> becomes possible in ways large groups cannot manage. It also makes an <a href="/egypt-private-tours">Egypt private tour</a> experience more affordable, without sacrificing the quality that defines it.</p>
<h3>What Makes Our Small Group Tours of Egypt Different</h3>
<p>Group sizes stay small by design, itineraries avoid the midday crush at major sites, and every journey includes at least one experience reserved for a privileged few, whether that means a temple after closing or a <a href="/egypt-small-group-tour">pyramid chamber before the gates open</a>.</p>',
  short_description = 'Small group Egypt tours limited to a handful of travellers, with private Nile cruises, licensed Egyptologist guides, and five-star stays throughout.',
  seo_title = 'Small Group Egypt Tours | Private Luxury Journeys',
  meta_description = 'Discover small group Egypt tours limited to a handful of travellers, with private Nile cruises, expert Egyptologists, and five-star stays throughout.',
  focus_keyword = 'small group egypt tours',
  schema_type = 'CollectionPage',
  faqs = '[{"id":"26671a16-8cdc-4a31-b724-5ffcd4217d75","question":"How many people are in a small group Egypt tour?","answer":"Our small group Egypt tours are limited to a small number of travellers, typically under twelve, which keeps the experience intimate and allows genuine flexibility in the daily schedule."},{"id":"c260c9ed-4067-4f7e-a2ed-2634c6712b79","question":"What is the difference between a small group tour and an Egypt private tour?","answer":"A private tour is exclusively yours, while a small group tour shares the journey with a handful of other travellers. Both include private guides and transfers, but small groups offer better value while retaining most of the same access."},{"id":"962ceb57-bcf6-4ece-9368-b497ac5475bb","question":"Are luxury small group tours Egypt suitable for solo travellers?","answer":"Yes, small groups work particularly well for solo travellers who want company and shared experiences without booking an entirely private itinerary."},{"id":"14b95408-2436-4e80-afae-b589ea4092f6","question":"Do small group tours of Egypt include a Nile cruise?","answer":"Most of our itineraries include a Nile cruise segment, with vessels selected for their size and character rather than capacity."},{"id":"4a097cd6-4ade-4b27-851e-fd6ffdb14934","question":"Which sites do these tours cover?","answer":"Itineraries range from the Pyramids of Giza and Luxor''s Valley of the Kings to Abu Simbel, Aswan, and in longer journeys, Siwa Oasis and the Red Sea."},{"id":"b98648bc-b6a4-45eb-ad3a-e2dc5def7c5d","question":"How far in advance should I book?","answer":"Because group sizes are capped, popular dates fill early, particularly between October and April. Booking three to six months ahead is recommended."},{"id":"0b8c4c97-e304-4d49-a793-f246300c616d","question":"Can I extend a small group tour with private days?","answer":"Yes, additional private days can be added before or after any group itinerary, whether for the Red Sea, Alexandria, or further archaeological sites."}]'::jsonb,
  updated_at = now()
WHERE slug = 'small-group-tours-egypt';

-- Cascade the category rename onto the tours filed under the OLD display
-- name. Keyed on the old name, not on slug, because tours.category holds
-- the name.
UPDATE tours
SET category = 'Small Group Egypt Tours', updated_at = now()
WHERE category = 'Small Group Tours Egypt';

-- ---------------------------------------------------------------------------
-- Tours: content + SEO
-- ---------------------------------------------------------------------------
-- 14-day-egypt-small-group-tour -> egypt-small-group-tour
UPDATE tours
SET
  slug = 'egypt-small-group-tour',
  title = 'Egypt Small Group Tour: 14-Day Nile Cruise & Temples',
  description = '<p>This Egypt small group tour reaches its fullest expression over fourteen days, long enough to include the sites almost no visitor sees. The journey travels through Middle Egypt to Beni Hassan''s painted rock tombs and Tell el-Amarna, the lost capital of Akhenaten and Nefertiti, before joining the Nile at <a href="/destinations/luxor">Luxor</a>.</p>
<p>What follows is a private cruise aboard MS Le Fayan carrying only your group, after-hours access to the Valley of the Kings when the gates close to everyone else, and a dawn flight to Abu Simbel. <a href="/luxury-egypt-tour-packages/small-group-egypt-tours">Small group tours of Egypt</a> work best when the group stays genuinely small, and this one is capped at twelve guests with private Egyptologist guiding throughout.</p>
<p>Fourteen days covers Saqqara and Giza with <a href="/private-access">VIP pyramid access</a>, the Grand Egyptian Museum, Abydos and Dendera, the full Nile route to <a href="/destinations/aswan">Aswan</a>, <a href="/destinations/alexandria">Alexandria</a>''s Greco-Roman sites, and exclusive entry to the active excavation at Taposiris Magna. Shorter itineraries force difficult choices between famous monuments and rare ones. This one removes most of them.</p>',
  hero_image_alt = 'Private Nile cruise vessel at sunset on an Egypt small group tour',
  focus_keyword = 'egypt small group tour',
  seo_title = 'Egypt Small Group Tour | 14-Day Nile Cruise & Temples',
  meta_description = 'This Egypt small group tour spans fourteen days of private Nile cruising, rare Middle Egypt sites, and five-star stays, capped at twelve guests.',
  schema_type = 'TouristTrip',
  faqs = '[{"id":"68fd3c8c-9371-4591-a855-5c424ecf3617","question":"What''s included in this Egypt small group tour?","answer":"All fourteen nights of five-star accommodation, the full Nile cruise aboard MS Le Fayan, private Egyptologist guiding, domestic flights, VIP pyramid access, and every transfer, with all meals from the welcome dinner onward."},{"id":"7a8a4a97-7823-43d8-923e-edad03a9dca1","question":"How many travellers join this tour?","answer":"Groups are capped at twelve guests, with a typical size of eight to ten, which keeps guiding personal and the pace flexible."},{"id":"741eaf3f-7b02-44d9-b77f-188a3a33fbda","question":"What makes this different from other small group tours of Egypt?","answer":"Middle Egypt. Beni Hassan and Tell el-Amarna sit between Cairo and Luxor, and almost no itinerary includes them. Add after-hours access to the Valley of the Kings and the active dig at Taposiris Magna, and the route becomes genuinely rare."},{"id":"32e67109-e4a6-4b00-a507-daa9faa2a566","question":"Is the Nile cruise private?","answer":"The MS Le Fayan carries only your group, so the vessel functions as a private Nile cruise rather than a shared ship with two hundred passengers."},{"id":"65417553-6864-414b-ae55-e79a830e557d","question":"When should I book this Egypt small group tour?","answer":"October through April offers the most comfortable weather, and because group sizes are capped, these dates often fill three to six months ahead."}]'::jsonb,
  updated_at = now()
WHERE slug IN ('14-day-egypt-small-group-tour', '14-day-luxury-egypt-tour-package');

-- 14-day-royal-egypt -> egypt-private-tour-packages
UPDATE tours
SET
  slug = 'egypt-private-tour-packages',
  title = 'Egypt Private Tour Packages: Private Pyramids, Nile & Abu Simbel',
  description = '<p>Our Egypt private tour packages are defined by access rather than itinerary length. Over fourteen days this journey opens the King''s Chamber inside the Great Pyramid at <a href="/private-access">private sunrise</a>, before the site admits the public, and grants entry to the Sphinx Enclosure at a level normally reserved for archaeologists and visiting heads of state.</p>
<h3>How These Private Egypt Tour Packages Secure Their Access</h3>
<p>Every permit is secured in advance through direct coordination with Egyptian authorities. A private charter flight reaches Abu Simbel at dawn, avoiding the long desert drive standard tours require, and the rarely opened Pyramid Builders'' Tombs at Dahshur are included in the route south toward <a href="/destinations/aswan">Aswan</a>.</p>
<p>The Nile segment runs seven nights aboard MS Le Fayan in a Deluxe Suite with private balcony, with nights in the capital at the <a href="/hotel/four-seasons-first-residence-cairo">Four Seasons at The First Residence</a>. Between temples, the itinerary includes the Lost Golden City discovered in 2020 near <a href="/destinations/luxor">Luxor</a>, Deir el-Medina, and a private tea ceremony with a calligrapher who inscribes your name in hieroglyphs. These private pyramid tours Egypt experiences are not upgrades added to a group itinerary. They are the reason it exists. Compare it with our other <a href="/luxury-egypt-tour-packages/small-group-egypt-tours">small group Egypt tours</a>.</p>',
  hero_image_alt = 'Private sunrise access to the Great Pyramid on an Egypt private tour package',
  focus_keyword = 'egypt private tour packages',
  seo_title = 'Egypt Private Tour Packages | 14-Day Pyramids & Nile',
  meta_description = 'Egypt private tour packages built around privileged access, from the King''s Chamber at sunrise to Abu Simbel by private charter flight.',
  schema_type = 'TouristTrip',
  faqs = '[{"id":"653e9836-e0c6-402f-b411-e39bb347e9e0","question":"What private access is included in your Egypt private tour packages?","answer":"Private sunrise entry to the King''s Chamber, the Sphinx Enclosure at archaeologist level, the Pyramid Builders'' Tombs at Dahshur, a private viewing of Tutankhamun''s tomb, and a charter flight to Abu Simbel at dawn."},{"id":"72f7d4d4-55e2-4001-8f76-49c016a51912","question":"How is this different from your other luxury Egypt tours?","answer":"Access. Other itineraries visit the same monuments during public hours. This one opens them before or after, through permits arranged individually for each departure."},{"id":"2a36b4d6-ecaf-428c-8cc3-df6cd4684846","question":"Is the charter flight to Abu Simbel really private?","answer":"Yes, the pre-dawn flight is chartered for your group alone, which is what makes arriving before the tour buses possible."},{"id":"d6f05218-2489-4bd4-8a74-f7c840ef6c42","question":"What is the Lost Golden City?","answer":"Discovered in 2020, it is the largest ancient urban settlement ever found in Egypt, with preserved workshops, bakeries, and homes from Amenhotep III''s reign, roughly thirty-four hundred years ago."},{"id":"9cb994b2-6190-46aa-a61a-343464d10194","question":"How far ahead should I book this egypt private tour?","answer":"Six months is recommended. The permits required for private pyramid access are limited and allocated well in advance."}]'::jsonb,
  updated_at = now()
WHERE slug = '14-day-royal-egypt';

-- 9-day-egypt-pyramids-luxor-sea -> egypt-private-tours
UPDATE tours
SET
  slug = 'egypt-private-tours',
  title = 'Egypt Private Tours: Pyramids, Luxor & Red Sea',
  description = '<p>Our Egypt private tours balance ancient history with genuine rest, and this nine-day itinerary is the clearest example. Five days cover the Giza Plateau with its pyramids and Sphinx, the Grand Egyptian Museum, Karnak Temple, and <a href="/destinations/luxor">Luxor</a>''s Valley of the Kings, before the journey shifts entirely to the Red Sea coast.</p>
<h3>Why These Private Egypt Tours Build In Rest</h3>
<p>Three days at The Oberoi Sahl Hasheesh follow, including a private boat excursion to the Giftun Islands Marine Reserve off <a href="/destinations/hurghada">Hurghada</a>, guided by a marine biologist. For travellers who want Egypt''s monuments without returning home exhausted, this luxury Egypt tour builds recovery into the schedule rather than treating it as an afterthought.</p>
<p>Groups are capped at twelve guests, which means every question reaches the guide and the pace adjusts to the group rather than a fixed timetable. All internal flights are included, so no day is lost to long road transfers between Cairo, Luxor, and Hurghada. Five days of archaeology is demanding. Three days of open water afterward is what makes this egypt private tour sustainable. Longer routes are covered in our <a href="/luxury-egypt-tour-packages/small-group-egypt-tours">small group Egypt tours</a> collection.</p>',
  hero_image_alt = 'Red Sea coastline at Hurghada on a nine-day Egypt private tour',
  focus_keyword = 'egypt private tours',
  seo_title = 'Egypt Private Tours | 9-Day Pyramids, Luxor & Red Sea',
  meta_description = 'Egypt private tours combining the Pyramids and Luxor''s royal tombs with three days of Red Sea beach time, in a small group of twelve.',
  schema_type = 'TouristTrip',
  faqs = '[{"id":"3ac74857-b72e-4047-aac2-06bb80be4a91","question":"What is included in your Egypt private tours?","answer":"Eight nights of five-star accommodation, all internal flights, a private Egyptologist throughout the cultural days, the Giftun Islands snorkelling excursion with a marine biologist, and all transfers."},{"id":"0ebbcae6-532d-458a-b561-479324122e60","question":"Is this a private tour or a small group tour?","answer":"Groups are capped at twelve travellers. Guiding, vehicles, and site entries are handled privately for the group, which delivers most of the benefits of a fully private Egypt tour at a more accessible price."},{"id":"6e6b94a1-6d37-4c6d-83ba-01db812b9f2d","question":"How much of the itinerary is beach time?","answer":"Three of the nine days are on the Red Sea, with one dedicated snorkelling excursion and two days entirely at leisure."},{"id":"ca2d7cc5-8acd-41ef-91fc-45b85c8e4c80","question":"Do I need to dive or snorkel to enjoy the Red Sea days?","answer":"No. The Giftun excursion is optional for non-swimmers, and the resort days are unstructured, so time by the pool or in the gardens works equally well."},{"id":"1261b98c-68fc-4487-ae5a-96dded6cbf64","question":"Is nine days enough for these luxury Egypt tours?","answer":"Nine days covers Egypt''s essential monuments comfortably while leaving room to rest. Travellers wanting Aswan, Abu Simbel, or a Nile cruise should consider our longer itineraries."}]'::jsonb,
  updated_at = now()
WHERE slug = '9-day-egypt-pyramids-luxor-sea';

-- ---------------------------------------------------------------------------
-- Itinerary corrections
--
-- Surgical and idempotent: each one either matches an exact wrong value and
-- replaces it, or sets a specific day's field to a known-correct value. The
-- itinerary jsonb is otherwise left untouched.
-- ---------------------------------------------------------------------------

-- egypt-small-group-tour: "House of Life, Abydo" -> "... Abydos"
-- (days 4 and 5). Scoped to the accommodation key so prose mentioning
-- Abydos is untouched, and matched on the exact wrong value so re-running
-- cannot produce "Abydoss".
UPDATE tours
SET itinerary = (
  SELECT jsonb_agg(
    CASE
      WHEN day_entry->>'accommodation' = 'House of Life, Abydo'
        THEN jsonb_set(day_entry, '{accommodation}', '"House of Life, Abydos"'::jsonb)
      ELSE day_entry
    END
    ORDER BY ord
  )
  FROM jsonb_array_elements(itinerary) WITH ORDINALITY AS t(day_entry, ord)
), updated_at = now()
WHERE slug = 'egypt-small-group-tour'
  AND jsonb_typeof(itinerary) = 'array'
  AND EXISTS (
    SELECT 1 FROM jsonb_array_elements(itinerary) AS d
    WHERE d->>'accommodation' = 'House of Life, Abydo'
  );

-- egypt-private-tour-packages: the Cairo hotel is the First Residence
-- property, not Nile Plaza (days 11, 12, 13). Exact-match on the wrong
-- value, scoped to accommodation.
UPDATE tours
SET itinerary = (
  SELECT jsonb_agg(
    CASE
      WHEN day_entry->>'accommodation' = 'Four Seasons Hotel Cairo at Nile Plaza'
        THEN jsonb_set(day_entry, '{accommodation}', '"Four Seasons Hotel Cairo at The First Residence"'::jsonb)
      ELSE day_entry
    END
    ORDER BY ord
  )
  FROM jsonb_array_elements(itinerary) WITH ORDINALITY AS t(day_entry, ord)
), updated_at = now()
WHERE slug = 'egypt-private-tour-packages'
  AND jsonb_typeof(itinerary) = 'array'
  AND EXISTS (
    SELECT 1 FROM jsonb_array_elements(itinerary) AS d
    WHERE d->>'accommodation' = 'Four Seasons Hotel Cairo at Nile Plaza'
  );

-- egypt-private-tour-packages: "Teti's pyramid" -> "Teti I's pyramid".
-- Whole-itinerary text swap; naturally idempotent because the corrected
-- string does not contain the wrong one.
UPDATE tours
SET itinerary = replace(itinerary::text, 'Teti''s pyramid', 'Teti I''s pyramid')::jsonb,
    updated_at = now()
WHERE slug = 'egypt-private-tour-packages'
  AND itinerary::text LIKE '%Teti''s pyramid%';

-- egypt-private-tours: unify the Cairo hotel name on day 8 (the itinerary
-- named the Kempinski in some places and the Four Seasons in others).
UPDATE tours
SET itinerary = replace(itinerary::text, 'Kempinski Nile Hotel', 'Four Seasons Hotel Cairo at The First Residence')::jsonb,
    updated_at = now()
WHERE slug = 'egypt-private-tours'
  AND itinerary::text LIKE '%Kempinski Nile Hotel%';

-- egypt-private-tours: days 4, 5, 6 and 8 listed "Breakfast, Dinner" in the
-- prose while the meals array already carried all three. The corrected
-- string does not contain the wrong one, so this is idempotent.
UPDATE tours
SET itinerary = replace(itinerary::text, 'Breakfast, Dinner', 'Breakfast, Lunch, Dinner')::jsonb,
    updated_at = now()
WHERE slug = 'egypt-private-tours'
  AND itinerary::text LIKE '%Breakfast, Dinner%';

-- Day-keyed corrections: meals arrays, missing coordinates, the Red Sea
-- accommodation label, and day 6's image alt (a leisure day, so the
-- "private Egyptologist guide" phrasing was wrong).
UPDATE tours
SET itinerary = (
  SELECT jsonb_agg(
    CASE
      WHEN (day_entry->>'day')::int IN (8, 12)
        THEN jsonb_set(day_entry, '{meals}', '["Breakfast","Lunch","Dinner"]'::jsonb)
      ELSE day_entry
    END
    ORDER BY ord
  )
  FROM jsonb_array_elements(itinerary) WITH ORDINALITY AS t(day_entry, ord)
), updated_at = now()
WHERE slug = 'egypt-private-tour-packages' AND jsonb_typeof(itinerary) = 'array';

UPDATE tours
SET itinerary = (
  SELECT jsonb_agg(
    CASE
      WHEN (day_entry->>'day')::int = 10 AND NOT (day_entry ? 'lat')
        THEN day_entry || '{"lat":24.9,"lng":32.87}'::jsonb
      WHEN (day_entry->>'day')::int = 12 AND NOT (day_entry ? 'lat')
        THEN day_entry || '{"lat":30.0444,"lng":31.2357}'::jsonb
      ELSE day_entry
    END
    ORDER BY ord
  )
  FROM jsonb_array_elements(itinerary) WITH ORDINALITY AS t(day_entry, ord)
), updated_at = now()
WHERE slug = 'egypt-private-tour-packages' AND jsonb_typeof(itinerary) = 'array';

UPDATE tours
SET itinerary = (
  SELECT jsonb_agg(
    CASE
      WHEN (day_entry->>'day')::int IN (4, 5, 6, 8)
        THEN jsonb_set(day_entry, '{meals}', '["Breakfast","Lunch","Dinner"]'::jsonb)
      ELSE day_entry
    END
    ORDER BY ord
  )
  FROM jsonb_array_elements(itinerary) WITH ORDINALITY AS t(day_entry, ord)
), updated_at = now()
WHERE slug = 'egypt-private-tours' AND jsonb_typeof(itinerary) = 'array';

UPDATE tours
SET itinerary = (
  SELECT jsonb_agg(
    CASE
      WHEN (day_entry->>'day')::int IN (5, 6, 7)
        THEN jsonb_set(day_entry, '{accommodation}', '"The Oberoi Sahl Hasheesh, Hurghada"'::jsonb)
      ELSE day_entry
    END
    ORDER BY ord
  )
  FROM jsonb_array_elements(itinerary) WITH ORDINALITY AS t(day_entry, ord)
), updated_at = now()
WHERE slug = 'egypt-private-tours' AND jsonb_typeof(itinerary) = 'array';

UPDATE tours
SET itinerary = (
  SELECT jsonb_agg(
    CASE
      WHEN (day_entry->>'day')::int = 6
        THEN jsonb_set(day_entry, '{imageAlt}', '"Beachfront resort pool overlooking the Red Sea at Hurghada"'::jsonb)
      ELSE day_entry
    END
    ORDER BY ord
  )
  FROM jsonb_array_elements(itinerary) WITH ORDINALITY AS t(day_entry, ord)
), updated_at = now()
WHERE slug = 'egypt-private-tours' AND jsonb_typeof(itinerary) = 'array';

-- ---------------------------------------------------------------------------
-- imageAlt, image URL shape, and one placeName typo
-- ---------------------------------------------------------------------------
-- egypt-small-group-tour: alts given explicitly per day.
UPDATE tours
SET itinerary = (
  SELECT jsonb_agg(
    CASE
      WHEN (NULLIF(day_entry->>'day', ''))::int = 1
        THEN jsonb_set(day_entry, '{imageAlt}', '"Pyramids of Giza viewed from Marriott Mena House on an Egypt small group tour"'::jsonb)
      WHEN (NULLIF(day_entry->>'day', ''))::int = 2
        THEN jsonb_set(day_entry, '{imageAlt}', '"Great Sphinx and Khafre''s Valley Temple at the Giza Plateau"'::jsonb)
      WHEN (NULLIF(day_entry->>'day', ''))::int = 3
        THEN jsonb_set(day_entry, '{imageAlt}', '"Tutankhamun collection at the Grand Egyptian Museum"'::jsonb)
      WHEN (NULLIF(day_entry->>'day', ''))::int = 6
        THEN jsonb_set(day_entry, '{imageAlt}', '"Temple of Seti I reliefs at Abydos"'::jsonb)
      WHEN (NULLIF(day_entry->>'day', ''))::int = 7
        THEN jsonb_set(day_entry, '{imageAlt}', '"Royal tomb interior in the Valley of the Kings, Luxor"'::jsonb)
      WHEN (NULLIF(day_entry->>'day', ''))::int = 8
        THEN jsonb_set(day_entry, '{imageAlt}', '"Tomb of Queen Nefertari in the Valley of the Queens, Luxor"'::jsonb)
      WHEN (NULLIF(day_entry->>'day', ''))::int = 9
        THEN jsonb_set(day_entry, '{imageAlt}', '"Kom Ombo dual temple beside the Nile"'::jsonb)
      WHEN (NULLIF(day_entry->>'day', ''))::int = 10
        THEN jsonb_set(day_entry, '{imageAlt}', '"Nubian village on the Nile near Aswan"'::jsonb)
      WHEN (NULLIF(day_entry->>'day', ''))::int = 12
        THEN jsonb_set(day_entry, '{imageAlt}', '"Bibliotheca Alexandrina on the Mediterranean shore, Alexandria"'::jsonb)
      WHEN (NULLIF(day_entry->>'day', ''))::int = 13
        THEN jsonb_set(day_entry, '{imageAlt}', '"Nile view from Four Seasons Cairo at The First Residence"'::jsonb)
      WHEN (NULLIF(day_entry->>'day', ''))::int = 14
        THEN jsonb_set(day_entry, '{imageAlt}', '"Departure from Cairo after a 14-day Egypt small group tour"'::jsonb)
      ELSE day_entry
    END
    ORDER BY ord
  )
  FROM jsonb_array_elements(itinerary) WITH ORDINALITY AS t(day_entry, ord)
), updated_at = now()
WHERE slug = 'egypt-small-group-tour' AND jsonb_typeof(itinerary) = 'array';

-- egypt-small-group-tour: any remaining boilerplate alt, rebuilt from placeName.
UPDATE tours
SET itinerary = (
  SELECT jsonb_agg(
    CASE
      WHEN day_entry->>'imageAlt' LIKE '%iLuxury Egypt%'
           AND COALESCE(day_entry->>'placeName', '') NOT IN ('', '-')
        THEN jsonb_set(
               day_entry,
               '{imageAlt}',
               to_jsonb((day_entry->>'placeName') || ' on an Egypt small group tour')
             )
      ELSE day_entry
    END
    ORDER BY ord
  )
  FROM jsonb_array_elements(itinerary) WITH ORDINALITY AS t(day_entry, ord)
), updated_at = now()
WHERE slug = 'egypt-small-group-tour'
  AND jsonb_typeof(itinerary) = 'array'
  AND itinerary::text LIKE '%iLuxury Egypt%';

-- egypt-private-tour-packages: alts given explicitly per day.
UPDATE tours
SET itinerary = (
  SELECT jsonb_agg(
    CASE
      WHEN (NULLIF(day_entry->>'day', ''))::int = 1
        THEN jsonb_set(day_entry, '{imageAlt}', '"Marriott Mena House at the foot of the Great Pyramids, Giza"'::jsonb)
      WHEN (NULLIF(day_entry->>'day', ''))::int = 2
        THEN jsonb_set(day_entry, '{imageAlt}', '"Step Pyramid of Djoser at Saqqara"'::jsonb)
      WHEN (NULLIF(day_entry->>'day', ''))::int = 4
        THEN jsonb_set(day_entry, '{imageAlt}', '"Private access between the paws of the Great Sphinx on an Egypt private tour"'::jsonb)
      WHEN (NULLIF(day_entry->>'day', ''))::int = 5
        THEN jsonb_set(day_entry, '{imageAlt}', '"Great Hypostyle Hall columns at Karnak Temple, Luxor"'::jsonb)
      WHEN (NULLIF(day_entry->>'day', ''))::int = 6
        THEN jsonb_set(day_entry, '{imageAlt}', '"Private viewing of Tutankhamun''s tomb in the Valley of the Kings"'::jsonb)
      WHEN (NULLIF(day_entry->>'day', ''))::int = 7
        THEN jsonb_set(day_entry, '{imageAlt}', '"Temple of Horus at Edfu, one of Egypt''s best-preserved temples"'::jsonb)
      WHEN (NULLIF(day_entry->>'day', ''))::int = 8
        THEN jsonb_set(day_entry, '{imageAlt}', '"Nubian village near Aswan with traditional painted houses"'::jsonb)
      WHEN (NULLIF(day_entry->>'day', ''))::int = 9
        THEN jsonb_set(day_entry, '{imageAlt}', '"Abu Simbel colossal statues at sunrise on a private charter flight"'::jsonb)
      WHEN (NULLIF(day_entry->>'day', ''))::int = 11
        THEN jsonb_set(day_entry, '{imageAlt}', '"Deir el-Medina workers'' village on Luxor''s west bank"'::jsonb)
      ELSE day_entry
    END
    ORDER BY ord
  )
  FROM jsonb_array_elements(itinerary) WITH ORDINALITY AS t(day_entry, ord)
), updated_at = now()
WHERE slug = 'egypt-private-tour-packages' AND jsonb_typeof(itinerary) = 'array';

-- egypt-private-tour-packages: any remaining boilerplate alt, rebuilt from placeName.
UPDATE tours
SET itinerary = (
  SELECT jsonb_agg(
    CASE
      WHEN day_entry->>'imageAlt' LIKE '%iLuxury Egypt%'
           AND COALESCE(day_entry->>'placeName', '') NOT IN ('', '-')
        THEN jsonb_set(
               day_entry,
               '{imageAlt}',
               to_jsonb((day_entry->>'placeName') || ' on an Egypt private tour')
             )
      ELSE day_entry
    END
    ORDER BY ord
  )
  FROM jsonb_array_elements(itinerary) WITH ORDINALITY AS t(day_entry, ord)
), updated_at = now()
WHERE slug = 'egypt-private-tour-packages'
  AND jsonb_typeof(itinerary) = 'array'
  AND itinerary::text LIKE '%iLuxury Egypt%';


-- egypt-private-tours: any remaining boilerplate alt, rebuilt from placeName.
UPDATE tours
SET itinerary = (
  SELECT jsonb_agg(
    CASE
      WHEN day_entry->>'imageAlt' LIKE '%iLuxury Egypt%'
           AND COALESCE(day_entry->>'placeName', '') NOT IN ('', '-')
        THEN jsonb_set(
               day_entry,
               '{imageAlt}',
               to_jsonb((day_entry->>'placeName') || ' on an Egypt private tour')
             )
      ELSE day_entry
    END
    ORDER BY ord
  )
  FROM jsonb_array_elements(itinerary) WITH ORDINALITY AS t(day_entry, ord)
), updated_at = now()
WHERE slug = 'egypt-private-tours'
  AND jsonb_typeof(itinerary) = 'array'
  AND itinerary::text LIKE '%iLuxury Egypt%';

-- Normalise absolute asset URLs to the relative form the rest of the table
-- uses. Scoped to /api/assets/ so any genuinely external image host is left
-- alone, and idempotent because a relative path does not match the anchor.
UPDATE tours
SET itinerary = regexp_replace(itinerary::text, 'https?://[^/"]+/api/assets/', '/api/assets/', 'g')::jsonb,
    updated_at = now()
WHERE slug IN ('egypt-small-group-tour', 'egypt-private-tour-packages', 'egypt-private-tours')
  AND itinerary::text ~ 'https?://[^/"]+/api/assets/';

-- Missing comma in a placeName. Idempotent: the corrected value no longer
-- contains the wrong one.
UPDATE tours
SET itinerary = replace(
      itinerary::text,
      'Tell el-Amarna Akhenaten''s Lost City',
      'Tell el-Amarna, Akhenaten''s Lost City'
    )::jsonb,
    updated_at = now()
WHERE slug = 'egypt-small-group-tour'
  AND itinerary::text LIKE '%Tell el-Amarna Akhenaten''s Lost City%';

-- Day 6 travels to Abydos and Dendera (its title is "Abydos & Dendera,
-- Sacred Temples" and the copy covers the Temple of Seti I and Hathor),
-- overnighting in Luxor, so placeName naming Luxor mislabels the day.
-- Day-keyed and matched on the wrong value, so other days legitimately
-- placed in Luxor are untouched and a re-run is a no-op.
UPDATE tours
SET itinerary = (
  SELECT jsonb_agg(
    CASE
      WHEN (NULLIF(day_entry->>'day', ''))::int = 6
           AND day_entry->>'placeName' = 'Luxor'
        THEN jsonb_set(day_entry, '{placeName}', '"Abydos and Dendera"'::jsonb)
      ELSE day_entry
    END
    ORDER BY ord
  )
  FROM jsonb_array_elements(itinerary) WITH ORDINALITY AS t(day_entry, ord)
), updated_at = now()
WHERE slug = 'egypt-small-group-tour' AND jsonb_typeof(itinerary) = 'array';

-- Em/en dash cleanup across all three itineraries. The dash-to-comma
-- rewrite is exactly what every punctuation correction in this pass asked
-- for ("in this iconic setting, one that offers", "royal family, a style
-- unlike", "Pyramid Builders' Tombs, a privilege", and so on), so it is
-- applied as the general rule rather than phrase by phrase. Spaced forms
-- only, to leave any numeric range alone.
UPDATE tours
SET itinerary = replace(replace(itinerary::text, ' — ', ', '), ' – ', ', ')::jsonb,
    updated_at = now()
WHERE slug IN ('egypt-small-group-tour', 'egypt-private-tour-packages', 'egypt-private-tours')
  AND (itinerary::text LIKE '% — %' OR itinerary::text LIKE '% – %');

COMMIT;

-- ---------------------------------------------------------------------------
-- Verification
-- ---------------------------------------------------------------------------
SELECT slug, name, focus_keyword, length(seo_title) AS seo_len,
       length(meta_description) AS meta_len, jsonb_array_length(faqs) AS faq_count
FROM categories WHERE slug = 'small-group-egypt-tours';

SELECT slug, category, focus_keyword, length(seo_title) AS seo_len,
       length(meta_description) AS meta_len, jsonb_array_length(faqs) AS faq_count
FROM tours
WHERE slug IN ('egypt-small-group-tour', 'egypt-private-tour-packages', 'egypt-private-tours')
ORDER BY slug;

-- Every FAQ entry must carry an id, or admin saves silently fail validation.
SELECT 'categories' AS tbl, slug, count(*) AS faqs_missing_id
FROM categories, jsonb_array_elements(faqs) AS f
WHERE slug = 'small-group-egypt-tours' AND NOT (f ? 'id')
GROUP BY slug
UNION ALL
SELECT 'tours', slug, count(*)
FROM tours, jsonb_array_elements(faqs) AS f
WHERE slug IN ('egypt-small-group-tour', 'egypt-private-tour-packages', 'egypt-private-tours')
  AND NOT (f ? 'id')
GROUP BY slug;
