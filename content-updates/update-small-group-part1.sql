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
--   14-day-egypt-small-group-tour -> 14-day-luxury-egypt-tour-package
--
-- That last one was requested as "luxury-egypt-tour-packages", which is not
-- usable: tours are served from the site root (App.tsx's catch-all
-- "/:slug"), and "/luxury-egypt-tour-packages" is already the packages
-- landing page (an earlier App.tsx route, the target of the
-- /egypt-tour-packages 301 in server/path-redirects.ts, and a main nav
-- entry). Wouter matches routes in order, so the tour page would have been
-- unreachable, and that landing page already targets the same keyword. The
-- slug below keeps the keyword without the collision; seo_title,
-- meta_description and focus_keyword still target the phrase itself.
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
<p>Group sizes stay small by design, itineraries avoid the midday crush at major sites, and every journey includes at least one experience reserved for a privileged few, whether that means a temple after closing or a <a href="/14-day-luxury-egypt-tour-package">pyramid chamber before the gates open</a>.</p>',
  short_description = 'Small group Egypt tours limited to a handful of travellers, with private Nile cruises, licensed Egyptologist guides, and five-star stays throughout.',
  seo_title = 'Small Group Egypt Tours | Private Luxury Journeys',
  meta_description = 'Discover small group Egypt tours limited to a handful of travellers, with private Nile cruises, expert Egyptologists, and five-star stays throughout.',
  focus_keyword = 'small group egypt tours',
  schema_type = 'CollectionPage',
  faqs = '[{"id":"357670cc-7a7a-4548-8d47-f18ee7f355f2","question":"How many people are in a small group Egypt tour?","answer":"Our small group Egypt tours are limited to a small number of travellers, typically under twelve, which keeps the experience intimate and allows genuine flexibility in the daily schedule."},{"id":"6f2e2c17-b0a0-4796-a441-58323db9603f","question":"What is the difference between a small group tour and an Egypt private tour?","answer":"A private tour is exclusively yours, while a small group tour shares the journey with a handful of other travellers. Both include private guides and transfers, but small groups offer better value while retaining most of the same access."},{"id":"1f24dd5b-6fdf-4320-bed0-7ba3ff6bb897","question":"Are luxury small group tours Egypt suitable for solo travellers?","answer":"Yes, small groups work particularly well for solo travellers who want company and shared experiences without booking an entirely private itinerary."},{"id":"c9ace741-84cb-4427-8d3c-faf5c1e12439","question":"Do small group tours of Egypt include a Nile cruise?","answer":"Most of our itineraries include a Nile cruise segment, with vessels selected for their size and character rather than capacity."},{"id":"ba015257-d86b-45d9-a460-60aadd55315f","question":"Which sites do these tours cover?","answer":"Itineraries range from the Pyramids of Giza and Luxor''s Valley of the Kings to Abu Simbel, Aswan, and in longer journeys, Siwa Oasis and the Red Sea."},{"id":"21f3b76c-9c98-4f26-a59a-bd95f4aae8a9","question":"How far in advance should I book?","answer":"Because group sizes are capped, popular dates fill early, particularly between October and April. Booking three to six months ahead is recommended."},{"id":"4f4ca784-4b1d-42b7-bc3a-b1dfaabb1cec","question":"Can I extend a small group tour with private days?","answer":"Yes, additional private days can be added before or after any group itinerary, whether for the Red Sea, Alexandria, or further archaeological sites."}]'::jsonb,
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
-- 14-day-egypt-small-group-tour -> 14-day-luxury-egypt-tour-package
UPDATE tours
SET
  slug = '14-day-luxury-egypt-tour-package',
  title = 'Luxury Egypt Tour Packages: 14-Day Nile Cruise & Temples',
  description = '<p>Our luxury Egypt tour packages reach their fullest expression over fourteen days, long enough to include the sites almost no visitor reaches. This journey travels through Middle Egypt to Beni Hassan''s painted rock tombs and Tell el-Amarna, the lost capital of Akhenaten and Nefertiti, before joining the Nile at <a href="/destinations/luxor">Luxor</a>.</p>
<h3>What a Fourteen Day Luxury Egypt Tour Makes Possible</h3>
<p>What follows is a private cruise aboard MS Le Fayan carrying only your small group, after-hours access to the Valley of the Kings when the gates close to everyone else, and a dawn flight to Abu Simbel. Each luxury Egypt tour on this itinerary includes private Egyptologist guiding throughout, with a maximum of twelve guests, and nights at the <a href="/hotel/mena-house-hotel-egypt">Marriott Mena House</a> beneath the pyramids.</p>
<p>Fourteen days covers Saqqara and Giza with <a href="/private-access">VIP pyramid access</a>, the Grand Egyptian Museum, Abydos and Dendera, the full Nile route to <a href="/destinations/aswan">Aswan</a>, <a href="/destinations/alexandria">Alexandria</a>''s Greco-Roman sites, and exclusive entry to the active excavation at Taposiris Magna. Shorter itineraries force difficult choices between famous monuments and rare ones. This one removes most of them. Browse the full range of <a href="/luxury-egypt-tour-packages/small-group-egypt-tours">small group Egypt tours</a> for shorter alternatives.</p>',
  hero_image_alt = 'Private Nile cruise vessel at sunset on a luxury Egypt tour package',
  focus_keyword = 'luxury egypt tour packages',
  seo_title = 'Luxury Egypt Tour Packages | 14-Day Nile & Temples',
  meta_description = 'Our luxury Egypt tour packages span fourteen days of private Nile cruising, rare Middle Egypt sites, and five-star stays in a small group.',
  schema_type = 'TouristTrip',
  faqs = '[{"id":"9c51579e-2f2b-4124-a32f-82b93431cc9f","question":"What''s included in your luxury Egypt tour packages?","answer":"All fourteen nights of five-star accommodation, the full Nile cruise aboard MS Le Fayan, private Egyptologist guiding, domestic flights, VIP pyramid access, and every transfer. These luxury Egypt tours include all meals from the welcome dinner onward."},{"id":"6be87698-b9dd-42cf-a76e-24e2da70cdd7","question":"How many travellers join this tour?","answer":"Groups are capped at twelve guests, with a typical size of eight to ten. This keeps the experience closer to a private Egypt tour while remaining more accessible in price."},{"id":"011c7346-81e8-4046-9024-6e7b8f846623","question":"What makes this different from other luxury Egypt tours?","answer":"Middle Egypt. Beni Hassan and Tell el-Amarna sit between Cairo and Luxor, and almost no itinerary includes them. Add after-hours access to the Valley of the Kings and the active dig at Taposiris Magna, and the route becomes genuinely rare."},{"id":"bd5c1474-1d40-42ad-9eb4-17a9084757ee","question":"Is the Nile cruise private?","answer":"The MS Le Fayan carries only your group, so the vessel functions as a private Nile cruise rather than a shared ship with two hundred passengers."},{"id":"50188cfd-c6d9-4082-8aa3-8c8fbb7ed5a4","question":"When is the best time to book this egypt luxury tour package?","answer":"October through April offers the most comfortable weather. Because group sizes are capped, these dates often fill three to six months ahead."}]'::jsonb,
  updated_at = now()
WHERE slug = '14-day-egypt-small-group-tour';

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
  faqs = '[{"id":"87508c12-de10-4f22-a199-c464ae3f2b02","question":"What private access is included in your Egypt private tour packages?","answer":"Private sunrise entry to the King''s Chamber, the Sphinx Enclosure at archaeologist level, the Pyramid Builders'' Tombs at Dahshur, a private viewing of Tutankhamun''s tomb, and a charter flight to Abu Simbel at dawn."},{"id":"fab7dbc5-299f-4a89-9949-397773042815","question":"How is this different from your other luxury Egypt tours?","answer":"Access. Other itineraries visit the same monuments during public hours. This one opens them before or after, through permits arranged individually for each departure."},{"id":"ff2247ef-207f-4e48-8ea7-eee4d0f6d984","question":"Is the charter flight to Abu Simbel really private?","answer":"Yes, the pre-dawn flight is chartered for your group alone, which is what makes arriving before the tour buses possible."},{"id":"3c86e0c0-d9f1-487a-8712-fa49f40a46a3","question":"What is the Lost Golden City?","answer":"Discovered in 2020, it is the largest ancient urban settlement ever found in Egypt, with preserved workshops, bakeries, and homes from Amenhotep III''s reign, roughly thirty-four hundred years ago."},{"id":"9ebb372d-931a-4a9f-bf2b-d5c99878d6ed","question":"How far ahead should I book this egypt private tour?","answer":"Six months is recommended. The permits required for private pyramid access are limited and allocated well in advance."}]'::jsonb,
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
  faqs = '[{"id":"7c81e060-49fd-4d57-af6f-a0bf9d82f09b","question":"What is included in your Egypt private tours?","answer":"Eight nights of five-star accommodation, all internal flights, a private Egyptologist throughout the cultural days, the Giftun Islands snorkelling excursion with a marine biologist, and all transfers."},{"id":"259f1225-cc14-409d-ba8d-2e779513ef54","question":"Is this a private tour or a small group tour?","answer":"Groups are capped at twelve travellers. Guiding, vehicles, and site entries are handled privately for the group, which delivers most of the benefits of a fully private Egypt tour at a more accessible price."},{"id":"4eda94be-58e5-437c-8a0a-13931ff6fb5c","question":"How much of the itinerary is beach time?","answer":"Three of the nine days are on the Red Sea, with one dedicated snorkelling excursion and two days entirely at leisure."},{"id":"215fe699-8239-4bd2-9e97-9be29e0894b7","question":"Do I need to dive or snorkel to enjoy the Red Sea days?","answer":"No. The Giftun excursion is optional for non-swimmers, and the resort days are unstructured, so time by the pool or in the gardens works equally well."},{"id":"554c0809-e5f9-44fe-aa70-d52de50525b0","question":"Is nine days enough for these luxury Egypt tours?","answer":"Nine days covers Egypt''s essential monuments comfortably while leaving room to rest. Travellers wanting Aswan, Abu Simbel, or a Nile cruise should consider our longer itineraries."}]'::jsonb,
  updated_at = now()
WHERE slug = '9-day-egypt-pyramids-luxor-sea';

-- ---------------------------------------------------------------------------
-- Itinerary corrections
--
-- Surgical and idempotent: each one either matches an exact wrong value and
-- replaces it, or sets a specific day's field to a known-correct value. The
-- itinerary jsonb is otherwise left untouched.
-- ---------------------------------------------------------------------------

-- 14-day-luxury-egypt-tour-package: "House of Life, Abydo" -> "... Abydos"
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
WHERE slug = '14-day-luxury-egypt-tour-package'
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

-- Em/en dash cleanup across all three itineraries. The dash-to-comma
-- rewrite is exactly what every punctuation correction in this pass asked
-- for ("in this iconic setting, one that offers", "royal family, a style
-- unlike", "Pyramid Builders' Tombs, a privilege", and so on), so it is
-- applied as the general rule rather than phrase by phrase. Spaced forms
-- only, to leave any numeric range alone.
UPDATE tours
SET itinerary = replace(replace(itinerary::text, ' — ', ', '), ' – ', ', ')::jsonb,
    updated_at = now()
WHERE slug IN ('14-day-luxury-egypt-tour-package', 'egypt-private-tour-packages', 'egypt-private-tours')
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
WHERE slug IN ('14-day-luxury-egypt-tour-package', 'egypt-private-tour-packages', 'egypt-private-tours')
ORDER BY slug;

-- Every FAQ entry must carry an id, or admin saves silently fail validation.
SELECT 'categories' AS tbl, slug, count(*) AS faqs_missing_id
FROM categories, jsonb_array_elements(faqs) AS f
WHERE slug = 'small-group-egypt-tours' AND NOT (f ? 'id')
GROUP BY slug
UNION ALL
SELECT 'tours', slug, count(*)
FROM tours, jsonb_array_elements(faqs) AS f
WHERE slug IN ('14-day-luxury-egypt-tour-package', 'egypt-private-tour-packages', 'egypt-private-tours')
  AND NOT (f ? 'id')
GROUP BY slug;
