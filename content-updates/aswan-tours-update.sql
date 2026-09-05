-- Aswan Day Tours content update (10 tours)
-- Same pattern as content-updates/cairo-tours-update-v2.sql: itinerary day
-- description rewritten in a "luxury but simple" voice, meals verified
-- against the new text, includes lightly polished, excludes added (tips/
-- personal expenses/travel insurance — except the balloon tour, which
-- already includes insurance in its own includes list), full SEO fields,
-- and "The Experience" split into 3 balanced <p> paragraphs at sentence
-- boundaries.
--
-- Flagged data-quality issues fixed or noted here (see the delivered
-- summary for full detail):
--   - private-hot-air-balloon-aswan-sunrise: placeName/imageAlt corrected
--     (were copied verbatim from felucca-ride-nile-aswan) — the image
--     FILE itself is still the felucca photo and likely needs replacing
--     from the admin panel; this SQL cannot fetch a new one.
--   - aswan-felucca-night-tour: imageAlt improved, but its image file is
--     identical to Cairo's private-nile-sunset-felucca tour — flagged for
--     verification, not changed here.
--   - aswan-cairo-day-trip-flight: imageAlt corrected from "Egyptian
--     Museum, Aswan" (geographically wrong) to "...Cairo".
--   - aswan-day-trip-from-luxor vs aswan-city-highlights-sightseeing-tour:
--     cover the same 3 sites but for Luxor-based vs Aswan-based travelers
--     (different duration, the Luxor version includes lunch) — kept as
--     two distinct tours with differentiated keywords/copy, not merged.
--
-- Run with: psql "$DATABASE_URL" -f content-updates/aswan-tours-update.sql

BEGIN;

-- ============================================================
-- Aswan Day Trip from Luxor  (slug: aswan-day-trip-from-luxor)
-- ============================================================
UPDATE tours SET
  title = 'Aswan Day Trip from Luxor',
  description = '<p>An Aswan Day Trip from Luxor covers the three sites that define the city in a single, well-paced day, reached by a three-hour drive along the Nile from Luxor. The Aswan High Dam is the first stop — completed in 1970, it holds back Lake Nasser, a reservoir 550 kilometers long, and still supplies hydroelectric power to much of Egypt.</p><p>Nearby, the Unfinished Obelisk sits exactly where ancient workers left it, abandoned mid-carving after a crack appeared in the granite; finished, it would have been the largest obelisk ever raised, at 42 meters and roughly 1,200 tons. It''s one of the clearest windows anywhere into how these monuments were actually quarried.</p><p>From there, a short motorboat crossing reaches Agilkia Island and Philae Temple, built for the goddess Isis and relocated here, block by block, when the High Dam''s reservoir threatened to submerge its original site. Ptolemaic reliefs and columns remain remarkably intact. Lunch is included before the return drive to Luxor, making this a long day best suited to travelers staying in Luxor who want Aswan added without changing hotels.</p>',
  itinerary = '[{"day":1,"lat":24.0769125,"lng":32.8954118,"meals":["Lunch"],"title":"Day 1 | Aswan - High Dam, Unfinished Obelisk & Philae Temple Discovery","placeName":"Unfinished Obelisk","imageAlt":"The Unfinished Obelisk lying in its ancient granite quarry at Aswan","activities":[],"description":"The day starts with an early pickup in Luxor for the three-hour drive south to Aswan, tracing the Nile past villages and farmland. First stop is the Aswan High Dam, completed in 1970, which holds back Lake Nasser — a reservoir stretching 550 kilometers — and supplies hydroelectric power across Egypt. Nearby, the Unfinished Obelisk lies in its original quarry, abandoned mid-carving after a crack appeared; had it been finished, it would have stood 42 meters tall. A motorboat crossing to Agilkia Island leads to Philae Temple, dedicated to Isis and moved here stone by stone when Lake Nasser was created. Lunch precedes the drive back to Luxor."}]'::jsonb,
  includes = ARRAY['Air-conditioned vehicle', 'Professional Egyptologist guide', 'Hotel pickup and drop-off in Luxor', 'Motorboat to Philae Temple', 'Entrance fees to all sites', 'Lunch at a local restaurant', 'Bottled water', 'All taxes and service charges']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses', 'Travel insurance']::text[],
  duration = '12 hours',
  duration_days = 1,
  group_size = '2-8',
  destinations = ARRAY['Aswan']::text[],
  seo_title = 'Aswan Day Trip from Luxor | High Dam & Philae Temple',
  meta_description = 'Private day trip from Luxor to Aswan''s High Dam, Unfinished Obelisk, and Philae Temple, with an Egyptologist guide and lunch included.',
  focus_keyword = 'Aswan Day Trip from Luxor',
  canonical_url = 'https://iluxuryegypt.com/aswan-day-trip-from-luxor',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'aswan-day-trip-from-luxor';

-- ============================================================
-- Private Hot Air Balloon Over Aswan at Sunrise  (slug: private-hot-air-balloon-aswan-sunrise)
-- ============================================================
UPDATE tours SET
  title = 'Private Hot Air Balloon Over Aswan at Sunrise',
  description = '<p>A private hot air balloon flight over Aswan at sunrise is one of the few ways to see how the Nile Valley actually sits inside the desert — a green ribbon a few kilometers wide, bounded on both sides by sand that begins almost at the water''s edge. Pickup is well before dawn, since the flight depends on calm early-morning air; after a safety briefing, you board a basket reserved exclusively for your group as the balloon inflates in the half-light before sunrise.</p><p>Airborne, the balloon climbs to around 1,000 to 1,500 feet, holding that height for the roughly hour-long flight. From up there, Elephantine Island, the Aga Khan Mausoleum on its hilltop, and the painted houses of the Nubian villages along the riverbank are all visible at once, along with feluccas that look like paper boats on the water far below.</p><p>Landing is followed immediately by a champagne toast and a printed flight certificate, timed so you''re back at your hotel in time for a proper breakfast. Because conditions have to be right, mornings with flexible timing work best for this experience.</p>',
  itinerary = '[{"day":1,"lat":24.0910553,"lng":32.890111,"image":"/api/assets/uploads/e9600c2a-2016-44be-aa26-6fbcce796b21.webp","meals":["Breakfast"],"title":"Day 1 | Aswan - Private Sunrise Hot Air Balloon Flight & Aerial Exploration","placeName":"Aswan","imageAlt":"Aerial sunrise view over the Nile and Elephantine Island from a private hot air balloon","activities":[],"description":"Pickup is before dawn, around 4:30 AM, for the transfer to the launch site on Aswan''s West Bank. After a safety briefing, you board a private basket as the balloon inflates in the pre-sunrise light. Lifting off around sunrise, the flight climbs to roughly 1,000–1,500 feet, giving open views over the Nile, Elephantine Island, the Aga Khan Mausoleum, and the Nubian villages along the riverbank, with the desert meeting the cultivated valley in sharp contrast below. After 45 to 60 minutes aloft, the balloon descends for landing, followed by a champagne toast and a flight certificate before breakfast."}]'::jsonb,
  includes = ARRAY['Private hot air balloon flight (exclusive basket)', 'Professional pilot and ground crew', 'Hotel pickup and drop-off in Aswan', 'Pre-flight light refreshments', 'Champagne celebration after landing', 'Flight certificate', 'All safety equipment', 'Insurance', 'All taxes and service charges']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses']::text[],
  duration = '3 hours',
  duration_days = 1,
  group_size = '2-6',
  destinations = ARRAY['Aswan']::text[],
  seo_title = 'Aswan Hot Air Balloon Sunrise Tour | Private Flight',
  meta_description = 'Private sunrise hot air balloon flight over Aswan and the Nile Valley, with a private basket, professional pilot, and champagne on landing.',
  focus_keyword = 'Aswan Hot Air Balloon Sunrise',
  canonical_url = 'https://iluxuryegypt.com/private-hot-air-balloon-aswan-sunrise',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'private-hot-air-balloon-aswan-sunrise';

-- ============================================================
-- Felucca Ride on the Nile in Aswan  (slug: felucca-ride-nile-aswan)
-- ============================================================
UPDATE tours SET
  title = 'Felucca Ride on the Nile in Aswan',
  description = '<p>A felucca ride on the Nile in Aswan uses the same wooden sailboat design that''s worked this stretch of the river for generations — no engine, just a Nubian captain reading the wind. From the water, the city looks different: Elephantine Island''s Nubian villages and scattered ruins slide past first, followed by Kitchener''s Island, whose Aswan Botanical Garden holds palms and exotic trees planted more than a century ago.</p><p>Further along, the Aga Khan Mausoleum sits on the western hills above the river, and the Old Cataract Hotel''s colonial-era facade comes into view from an angle most visitors on land never see. The sail has no fixed schedule — how far it goes and how long it takes depends on the wind that day.</p><p>Along the banks, ordinary Aswan life continues around you: fishermen working the shallows, children playing at the water''s edge, birds moving between the palms. It''s a quiet, unstructured hour on the water, well suited either as a stand-alone outing or paired with a longer day of sightseeing.</p>',
  itinerary = '[{"day":1,"lat":24.0910553,"lng":32.890111,"image":"/api/assets/uploads/e9600c2a-2016-44be-aa26-6fbcce796b21.webp","title":"Day 1 | Aswan - Traditional Felucca Sailing & Nile Island Views","placeName":"Elephantine Island","imageAlt":"Traditional felucca sailing past Elephantine Island on the Nile at Aswan","meals":[],"activities":[],"description":"Board a traditional wooden felucca at the Aswan waterfront, where a Nubian captain raises the sail to catch the river breeze. The route passes Elephantine Island''s villages and ancient ruins, then Kitchener''s Island, home to the Aswan Botanical Garden and its collection of exotic trees and palms. From the water, the Aga Khan Mausoleum is visible on the western hills, along with the Old Cataract Hotel''s colonial-era facade. Along the way, local fishermen work the shallows and children play on the riverbanks. The sail returns to the same landing point for transfer back to your hotel."}]'::jsonb,
  includes = ARRAY['Private traditional felucca sailboat', 'Experienced Nubian captain', 'Hotel pickup and drop-off in Aswan', 'Comfortable cushioned seating', 'All taxes and service charges']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses', 'Travel insurance']::text[],
  duration = '2 hours',
  duration_days = 1,
  group_size = '2-8',
  destinations = ARRAY['Aswan']::text[],
  seo_title = 'Felucca Ride Aswan | Traditional Nile Sailing',
  meta_description = 'Traditional felucca sail on the Nile in Aswan, past Elephantine Island, the Aswan Botanical Garden, and the Aga Khan Mausoleum, with a Nubian captain.',
  focus_keyword = 'Felucca Ride Aswan',
  canonical_url = 'https://iluxuryegypt.com/felucca-ride-nile-aswan',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'felucca-ride-nile-aswan';

-- ============================================================
-- Day Trip from Aswan to Cairo by Plane  (slug: aswan-cairo-day-trip-flight)
-- ============================================================
UPDATE tours SET
  title = 'Day Trip from Aswan to Cairo by Plane',
  description = '<p>An Aswan to Cairo day trip by air covers, in a single day, two sites most visitors need a full Cairo stay to see. A short flight from Aswan puts you in Cairo by mid-morning, where a guide takes over for the drive to the Giza Plateau — home to the Pyramids of Khufu, Khafre, and Menkaure, still the largest stone structures ever built, and the Great Sphinx, carved directly from the plateau''s bedrock rather than assembled from blocks.</p><p>From Giza, the day moves to the Egyptian Museum in Tahrir Square, which holds over 120,000 artifacts spanning the length of ancient Egyptian history. Tutankhamun''s gold mask and burial treasures are the highlight, displayed alongside royal mummies and statuary that give a fuller picture of pharaonic Egypt than the pyramids alone can.</p><p>Lunch at a local restaurant sits between the two stops, and the day ends with an evening flight back to Aswan. It''s a long day by any measure, but it means seeing Cairo''s two essential sights without needing to change hotels or plan a separate trip.</p>',
  itinerary = '[{"day":1,"lat":30.0479664,"lng":31.2336093,"image":"/api/assets/uploads/9720e9f8-04a4-4290-ab18-78d32a0246a2.webp","meals":["Lunch"],"title":"Day 1 | Cairo - Pyramids of Giza, Sphinx & Egyptian Museum Expedition","placeName":"Egyptian Museum","imageAlt":"Tutankhamun''s treasures inside the Egyptian Museum, Cairo","activities":[],"description":"An early transfer to Aswan Airport connects to a flight to Cairo, where a guide meets you for the drive to the Giza Plateau. The Pyramids of Khufu, Khafre, and Menkaure stand as they have for roughly 4,500 years, alongside the Great Sphinx, carved from the plateau''s own bedrock. From there, the Egyptian Museum in Tahrir Square holds more than 120,000 artifacts, including Tutankhamun''s golden treasures and a hall of royal mummies. Lunch follows at a local restaurant before the transfer to Cairo Airport for the evening flight back to Aswan and your hotel."}]'::jsonb,
  includes = ARRAY['Domestic flights (Aswan-Cairo-Aswan)', 'Private vehicle with professional driver in Cairo', 'Professional Egyptologist guide', 'Hotel pickup and drop-off in Aswan', 'Airport transfers in Cairo', 'Entrance fees to all sites', 'Lunch at a local restaurant', 'Bottled water', 'All taxes and service charges']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses', 'Travel insurance']::text[],
  duration = '14 hours',
  duration_days = 1,
  group_size = '2-8',
  destinations = ARRAY['Aswan', 'Cairo']::text[],
  seo_title = 'Aswan to Cairo Day Trip | Pyramids & Egyptian Museum',
  meta_description = 'Day trip by air from Aswan to Cairo, covering the Giza Pyramids, Great Sphinx, and Egyptian Museum''s Tutankhamun collection, with lunch included.',
  focus_keyword = 'Aswan to Cairo Day Trip',
  canonical_url = 'https://iluxuryegypt.com/aswan-cairo-day-trip-flight',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'aswan-cairo-day-trip-flight';

-- ============================================================
-- Private Abu Simbel Day Trip from Aswan by Vehicle  (slug: private-abu-simbel-day-trip-aswan)
-- ============================================================
UPDATE tours SET
  title = 'Private Abu Simbel Day Trip from Aswan by Vehicle',
  description = '<p>A private Abu Simbel day trip from Aswan covers one of the longest drives of any Egypt day tour — roughly three hours each way across open desert — for two temples that justify the distance. Pickup is around 4:00 AM, ahead of the heat and the day''s other traffic on the road south.</p><p>The Great Temple of Ramses II is the main event: four seated statues of the pharaoh, each about 20 meters tall, flank the entrance, and the interior halls carry detailed reliefs recording his military campaigns, particularly the Battle of Kadesh. Next door, the smaller Temple of Hathor, dedicated to Queen Nefertari, is decorated with equal care despite its smaller scale.</p><p>Both temples were originally cut directly into the sandstone cliff face in the 13th century BCE, then cut apart and reassembled on higher ground in the 1960s, in a UNESCO-led operation that saved them from the rising waters of Lake Nasser. The return drive puts you back in Aswan by early afternoon, with the rest of the day free.</p>',
  itinerary = '[{"day":1,"lat":25.7174295,"lng":32.6602847,"title":"Day 1 | Abu Simbel - Ramses II Great Temple & Nefertari Temple Exploration","placeName":"Temple of Ramses II","imageAlt":"The four colossal statues of Ramses II at the Great Temple of Abu Simbel","activities":[],"description":"Pickup is around 4:00 AM for the roughly three-hour drive, 280 kilometers southwest across the desert, to Abu Simbel. The Great Temple of Ramses II fronts onto four seated statues of the pharaoh, each about 20 meters tall, with hieroglyphic reliefs inside recording his military campaigns. Next door, the smaller Temple of Hathor, built for Queen Nefertari, carries equally detailed decoration. Both temples were cut into the cliffside in the 13th century BCE, then relocated in the 1960s in a UNESCO engineering effort that saved them from Lake Nasser''s rising waters. The drive back reaches Aswan by early afternoon."}]'::jsonb,
  includes = ARRAY['Private vehicle with professional driver', 'Professional Egyptologist guide', 'Hotel pickup and drop-off in Aswan', 'Entrance fees to Abu Simbel temples', 'Bottled water during transfer', 'All taxes and service charges']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses', 'Travel insurance']::text[],
  duration = '10 hours',
  duration_days = 1,
  group_size = '2-8',
  destinations = ARRAY['Abu Simbel']::text[],
  seo_title = 'Abu Simbel Day Trip from Aswan | Ramses II Temple',
  meta_description = 'Private day trip from Aswan to Abu Simbel, visiting the Great Temple of Ramses II and the Temple of Hathor, relocated by UNESCO in the 1960s.',
  focus_keyword = 'Abu Simbel Day Trip from Aswan',
  canonical_url = 'https://iluxuryegypt.com/private-abu-simbel-day-trip-aswan',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'private-abu-simbel-day-trip-aswan';

-- ============================================================
-- Nubian Village Tour from Aswan  (slug: nubian-village-tour-aswan)
-- ============================================================
UPDATE tours SET
  title = 'Nubian Village Tour from Aswan',
  description = '<p>A Nubian Village Tour from Aswan is a short crossing — just a few minutes by motorboat — to a community with a distinct culture, language, and history from the rest of Egypt. The West Bank villages are immediately recognizable by their houses, painted in bright blue, yellow, and orange, a Nubian tradition that continues today.</p><p>A visit to a local family''s home is at the center of the tour: guests are welcomed with tea or hibiscus drink inside rooms decorated with traditional patterned artwork, and hosts talk openly about Nubian history, including the displacement many families experienced when the Aswan High Dam''s reservoir flooded their original villages in the 1960s.</p><p>Henna painting is available for anyone who wants it. A walk through the village passes the local school and stalls selling handwoven baskets and textiles, giving a sense of daily life rather than a staged performance. The boat ride back to Aswan closes out a visit built around genuine cultural exchange rather than sightseeing alone.</p>',
  itinerary = '[{"day":1,"lat":24.0811994,"lng":32.8785457,"image":"/api/assets/uploads/d8950123-7ddd-4a81-8ec9-6154e7cbf2c8.webp","title":"Day 1 | Nubian Village - Cultural Immersion & Traditional Lifestyle Experience","placeName":"Nubian Village","imageAlt":"Colorfully painted houses in a Nubian village on Aswan''s West Bank","activities":[],"description":"A short motorboat crossing from Aswan''s east bank reaches the Nubian villages on the West Bank, where houses painted in blue, yellow, and orange line the riverside. A local family hosts a visit inside their home, decorated with traditional patterns, sharing the history of Nubian displacement during the High Dam''s construction over tea or hibiscus drink. Henna painting is available for those who want it. A walk through the village passes the local school and craft stalls selling handwoven baskets and textiles. The boat returns to Aswan afterward for transfer back to your hotel."}]'::jsonb,
  includes = ARRAY['Private vehicle with professional driver', 'Motorboat transfers to/from Nubian village', 'Village guide', 'Hotel pickup and drop-off in Aswan', 'Traditional Nubian tea/drink', 'Henna painting (optional)', 'All taxes and service charges']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses', 'Travel insurance']::text[],
  duration = '4 hours',
  duration_days = 1,
  group_size = '2-8',
  destinations = ARRAY['Aswan']::text[],
  seo_title = 'Nubian Village Tour Aswan | Cultural Boat Trip',
  meta_description = 'Motorboat visit to a Nubian village on Aswan''s West Bank, with a local family home visit, traditional tea, and optional henna painting.',
  focus_keyword = 'Nubian Village Tour Aswan',
  canonical_url = 'https://iluxuryegypt.com/nubian-village-tour-aswan',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'nubian-village-tour-aswan';

-- ============================================================
-- Day Trip from Aswan to Edfu & Kom Ombo Temples  (slug: aswan-edfu-kom-ombo-temples-day-trip)
-- ============================================================
UPDATE tours SET
  title = 'Day Trip from Aswan to Edfu & Kom Ombo Temples',
  description = '<p>An Edfu and Kom Ombo day trip from Aswan covers two temples built roughly a century apart, both remarkably intact by Egyptian standards. The Temple of Horus at Edfu is widely considered the best-preserved temple in the country — built entirely during the Ptolemaic period rather than added to over centuries, its pylons, courtyard, and hypostyle hall survive close to their original form, with wall reliefs recounting the mythological battle between Horus and his rival Seth in detail.</p><p>Kom Ombo, further along the Nile, is unusual in being a double temple: dedicated equally to Sobek, the crocodile god, and Horus the Elder, its layout mirrors itself down the center, with matching halls, sanctuaries, and courts for each deity.</p><p>Reliefs here include a rare depiction of ancient surgical instruments and a Nilometer, once used to measure the Nile''s annual flood. The adjacent Crocodile Museum, built to house mummified crocodiles recovered locally, rounds out the visit before the drive back to Aswan. Seeing both temples in one day makes it easy to compare how Ptolemaic-era builders approached single-deity and dual-deity temple design differently.</p>',
  itinerary = '[{"day":1,"lat":24.9783733,"lng":32.8735047,"title":"Day 1 | Edfu & Kom Ombo - Temple of Horus & Dual Deity Temple Exploration","placeName":"Temple of Horus","imageAlt":"The pylons and columned hall of the Temple of Horus at Edfu","activities":[],"description":"The drive north from Aswan reaches Edfu first, home to the Temple of Horus — the best-preserved temple in Egypt, built during the Ptolemaic period with its pylons and columned hall still largely intact. Reliefs throughout depict the mythological battle between Horus and Seth. Continuing to Kom Ombo, a double temple sits on a bend in the Nile, dedicated equally to the crocodile god Sobek and to Horus the Elder, with matching halls and sanctuaries built in mirror symmetry. Reliefs here include a set of ancient surgical instruments and a Nilometer once used to track the Nile''s flood levels. The nearby Crocodile Museum displays mummified crocodiles before the return to Aswan."}]'::jsonb,
  includes = ARRAY['Private vehicle with professional driver', 'Professional Egyptologist guide', 'Hotel pickup and drop-off in Aswan', 'Entrance fees to Edfu and Kom Ombo temples', 'Entrance to Crocodile Museum', 'Bottled water', 'All taxes and service charges']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses', 'Travel insurance']::text[],
  duration = '8 hours',
  duration_days = 1,
  group_size = '2-8',
  destinations = ARRAY['Aswan']::text[],
  seo_title = 'Edfu Kom Ombo Day Trip from Aswan | Temple Tour',
  meta_description = 'Private day trip from Aswan to the Temple of Horus at Edfu and the double temple of Kom Ombo, with the Crocodile Museum, and an Egyptologist guide.',
  focus_keyword = 'Edfu Kom Ombo Day Trip from Aswan',
  canonical_url = 'https://iluxuryegypt.com/aswan-edfu-kom-ombo-temples-day-trip',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'aswan-edfu-kom-ombo-temples-day-trip';

-- ============================================================
-- Aswan City Highlights Tour  (slug: aswan-city-highlights-sightseeing-tour)
-- ============================================================
UPDATE tours SET
  title = 'Aswan City Highlights Tour',
  description = '<p>An Aswan City Highlights Tour covers the three sites that define a first visit to Aswan, all reachable within the city''s immediate surroundings rather than requiring a long transfer. The Aswan High Dam, completed in 1970, is the starting point — an engineering project on the scale of a small mountain range, holding back Lake Nasser''s 550-kilometer reservoir and generating hydroelectric power for much of the country.</p><p>From the dam, the ancient granite quarries hold the Unfinished Obelisk, left exactly where ancient workers abandoned it after a crack appeared partway through carving; complete, it would have been the largest obelisk ever raised. It remains one of the clearest records anywhere of how these monuments were actually cut from bedrock.</p><p>A short motorboat ride to Agilkia Island completes the day at Philae Temple, built for the goddess Isis and moved here, block by block, in a 20th-century engineering rescue of its own. Well-preserved Ptolemaic reliefs and columns make this one of Egypt''s most intact temple complexes, a fitting close to a day spent entirely within Aswan.</p>',
  itinerary = '[{"day":1,"lat":24.0769125,"lng":32.8954118,"title":"Day 1 | Aswan - High Dam, Unfinished Obelisk & Philae Temple Discovery","placeName":"Unfinished Obelisk","imageAlt":"The Unfinished Obelisk in its ancient granite quarry near Aswan","activities":[],"description":"Pickup from your Aswan hotel starts the day at the Aswan High Dam, completed in 1970, which holds back Lake Nasser and supplies hydroelectric power to much of Egypt. From there, the ancient granite quarries reveal the Unfinished Obelisk, abandoned mid-carving after a crack appeared — intact, it would have been the largest obelisk ever raised, at 42 meters. A motorboat crossing to Agilkia Island leads to Philae Temple, built for the goddess Isis and relocated here, stone by stone, when the High Dam''s reservoir was created. Reliefs, columns, and inscriptions from the Ptolemaic period remain well preserved throughout."}]'::jsonb,
  includes = ARRAY['Private vehicle with professional driver', 'Professional Egyptologist guide', 'Hotel pickup and drop-off in Aswan', 'Motorboat to Philae Temple', 'Entrance fees to all sites', 'Bottled water', 'All taxes and service charges']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses', 'Travel insurance']::text[],
  duration = '8 hours',
  duration_days = 1,
  group_size = '2-8',
  destinations = ARRAY['Aswan']::text[],
  seo_title = 'Aswan City Highlights Tour | Dam, Obelisk & Philae',
  meta_description = 'Full-day Aswan sightseeing tour covering the High Dam, Unfinished Obelisk, and Philae Temple, with an Egyptologist guide, departing directly from Aswan.',
  focus_keyword = 'Aswan City Highlights Tour',
  canonical_url = 'https://iluxuryegypt.com/aswan-city-highlights-sightseeing-tour',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'aswan-city-highlights-sightseeing-tour';

-- ============================================================
-- Philae Temple Sound and Light Show Tour  (slug: philae-temple-sound-light-show-aswan)
-- ============================================================
UPDATE tours SET
  title = 'Philae Temple Sound and Light Show Tour',
  description = '<p>The Philae Temple Sound and Light Show turns one of Aswan''s best-preserved monuments into a stage after dark. A late-afternoon pickup times the motorboat crossing to Agilkia Island for sunset, so the approach to the island itself is part of the experience before the show begins.</p><p>Once seated, the roughly 50-minute presentation uses colored lighting and laser projection to pick out the temple''s columns, reliefs, and sanctuaries in sequence, timed to a narrated telling of Philae''s construction and the story of Isis, goddess of magic and motherhood, and her husband Osiris. Narration rotates through multiple languages depending on the evening''s audience.</p><p>Partway through, the show moves from the seating area into the temple complex itself, letting you walk among the illuminated columns rather than watching from a fixed viewpoint — a different way to see a site most visitors only experience by daylight. The boat ride back to the mainland closes out the evening, with transfer to your hotel.</p>',
  itinerary = '[{"day":1,"lat":24.0252548,"lng":32.8841893,"image":"/api/assets/uploads/a16d0a43-e65b-41a9-aac3-a2ca0474194f.webp","title":"Day 1 | Philae Temple - Evening Sound & Light Spectacular","placeName":"Philae Temple","imageAlt":"Philae Temple illuminated for its evening sound and light show","activities":[],"description":"Pickup is in the late afternoon, timed for a motorboat crossing to Agilkia Island as the sun sets over the Nile. Philae Temple, lit for the evening, hosts a sound and light show that runs about 50 minutes, narrating the story of its construction and the worship of Isis, goddess of magic and motherhood, in a rotating set of languages. Colored lighting picks out columns, reliefs, and sanctuaries in sequence as the story unfolds, and the audience walks through part of the illuminated complex partway through. The boat returns to the mainland once the show ends, with transfer back to your hotel."}]'::jsonb,
  includes = ARRAY['Private vehicle with professional driver', 'Hotel pickup and drop-off in Aswan', 'Motorboat transfers to/from Philae Temple', 'Sound and Light Show entrance ticket', 'All taxes and service charges']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses', 'Travel insurance']::text[],
  duration = '3 hours',
  duration_days = 1,
  group_size = '2-8',
  destinations = ARRAY['Aswan']::text[],
  seo_title = 'Philae Temple Sound and Light Show | Aswan',
  meta_description = 'Evening sound and light show at Philae Temple in Aswan, with a sunset motorboat crossing, illuminated temple complex, and multilingual narration.',
  focus_keyword = 'Philae Temple Sound and Light Show',
  canonical_url = 'https://iluxuryegypt.com/philae-temple-sound-light-show-aswan',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'philae-temple-sound-light-show-aswan';

-- ============================================================
-- Aswan Felucca Tour by Night  (slug: aswan-felucca-night-tour)
-- ============================================================
UPDATE tours SET
  title = 'Aswan Felucca Tour by Night',
  description = '<p>An Aswan Felucca Tour by Night trades the daytime sail for one built entirely around sunset and the hours just after. Pickup is in the late afternoon, once the day''s heat has started to ease, for a short walk to the embankment where a felucca fitted with cushions and lanterns is already waiting.</p><p>The boat sets off as the sun begins its descent, giving a clear view of the sky turning through orange, pink, and purple over the water. As the light fades further, Aswan''s landmarks begin to glow along the shoreline — the Old Cataract Hotel lit up in its Victorian grandeur, and the Aga Khan Mausoleum illuminated on the hills above the west bank, both reflected in the calm evening water.</p><p>By full dark, the sail continues quietly under an emerging sky of stars, sometimes accompanied by Nubian music if the captain has brought his instruments along. It''s a slower, quieter counterpart to a daytime sail, better suited to travelers looking for atmosphere over sightseeing detail.</p>',
  itinerary = '[{"day":1,"lat":27.2236824,"lng":33.8409556,"image":"/api/assets/uploads/227f0e28-dd3a-4375-b586-4d4e5125cb6a.webp","title":"Day 1 | Aswan - Sunset & Nighttime Felucca Sailing Experience","placeName":"Aswan","imageAlt":"Traditional felucca sailing at sunset on the Nile in Aswan, with the Aga Khan Mausoleum and Old Cataract Hotel lit at dusk","activities":[],"description":"Late-afternoon pickup leads to the Nile embankment, where a traditional felucca fitted with cushions and lanterns waits at the shore. The sail sets off as the sun begins to set, with the sky shifting through orange, pink, and purple over the water. As dusk deepens, Aswan''s shoreline lights up — the illuminated Old Cataract Hotel, the glowing Aga Khan Mausoleum on the hills, and the city''s lights reflected on the calm river. The boat continues sailing quietly as the stars and moon appear, with Nubian music playing if the captain has his instruments aboard. The felucca returns to shore for transfer back to your hotel."}]'::jsonb,
  includes = ARRAY['Private traditional felucca sailboat', 'Experienced Nubian captain', 'Hotel pickup and drop-off in Aswan', 'Comfortable cushioned seating', 'Lanterns for evening ambiance', 'All taxes and service charges']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses', 'Travel insurance']::text[],
  duration = '2 hours',
  duration_days = 1,
  group_size = '2-8',
  destinations = ARRAY['Aswan']::text[],
  seo_title = 'Aswan Felucca Night Tour | Sunset Nile Sailing',
  meta_description = 'Evening felucca sail on the Nile in Aswan at sunset, past the illuminated Old Cataract Hotel and Aga Khan Mausoleum, with Nubian music.',
  focus_keyword = 'Aswan Felucca Night Tour',
  canonical_url = 'https://iluxuryegypt.com/aswan-felucca-night-tour',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'aswan-felucca-night-tour';

-- Review the output above (row counts, any 0-row UPDATE means a slug
-- mismatch) before committing.
COMMIT;
