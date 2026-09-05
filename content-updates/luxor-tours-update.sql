-- Luxor Day Tours content update (12 tours)
-- Same pattern as content-updates/cairo-tours-update-v2.sql and
-- content-updates/aswan-tours-update.sql: itinerary day description
-- rewritten in a "luxury but simple" voice, meals verified against the
-- new text, includes lightly polished, standard excludes list added
-- (tips/personal expenses/travel insurance — except the balloon tour,
-- which already includes insurance in its own includes list), full SEO
-- fields, tour titles reviewed for focus-keyword alignment, and
-- "The Experience" split into 3 balanced <p> paragraphs at sentence
-- boundaries.
--
-- Flagged data-quality issues fixed or noted here (see the delivered
-- summary for full detail):
--   - luxor-cairo-day-trip-flight: imageAlt corrected from "Egyptian
--     Museum, Luxor" (geographically wrong) to "...Cairo".
--   - luxor-from-cairo-plane: imageAlt corrected from "Valley of the
--     Kings, CAIRO" (geographically wrong) to "...Luxor"; title changed
--     to "Luxor Day Trip from Cairo by Plane" for clearer keyword match.
--   - luxor-hot-air-balloon-sunrise-tour: placeName changed from "Valley
--     of the Kings" to "Luxor" (panoramic aerial view) — note its image
--     file is shared with luxor-from-cairo-plane, not changed here.
--   - dandara-abydos-temples-tour-luxor: placeName corrected from the
--     generic "Luxor" to "Temple of Hathor" (Dandara/Abydos are north of
--     Luxor, not in it).
--   - edfu-kom-ombo-temples-tour-luxor: no image at all — placeName/
--     imageAlt proposed, actual image still needs Suggest Photo or a
--     manual upload from the admin panel.
--   - luxor-east-bank-day-tour vs luxor-karnak-temples-day-tour: cover
--     the identical Karnak + Luxor Temple content with no real practical
--     difference found in the source text (unlike the Cairo #17/#19 or
--     Aswan Luxor/Aswan-departure cases) — kept as two separate tours
--     with differentiated keywords/copy per explicit instruction, but
--     flagged as a likely genuine duplicate worth a merge/deprecate
--     decision in a future session, not resolved here.
--
-- Run with: psql "$DATABASE_URL" -f content-updates/luxor-tours-update.sql

BEGIN;

-- ============================================================
-- Luxor Hot Air Balloon Tour  (slug: luxor-hot-air-balloon-sunrise-tour)
-- ============================================================
UPDATE tours SET
  title = 'Luxor Hot Air Balloon Tour',
  description = '<p>A Luxor Hot Air Balloon Tour is the clearest way to see how ancient Thebes was actually laid out — temples and tombs spread across a landscape that only really makes sense from above. Pickup is well before dawn, since the flight depends on calm early-morning air; after a safety briefing, the balloon lifts off around sunrise as the sky turns from grey to gold.</p><p>Climbing to around 1,000 to 1,500 feet, the flight passes directly over the West Bank necropolis: the Valley of the Kings, a maze of dry ravines hiding royal tombs, followed by Hatshepsut''s temple set into the cliffs at Deir el-Bahari, the ruined Ramesseum, and the two seated Colossi of Memnon standing alone in the fields.</p><p>From up here, the sharp line between irrigated farmland and open desert is impossible to miss. After roughly an hour in the air, the balloon descends for landing, followed immediately by a champagne toast and a printed flight certificate, timed so there''s still a proper breakfast waiting back at the hotel. Because timing depends on the weather, mornings with some flexibility work best.</p>',
  itinerary = '[{"day":1,"lat":25.7404899,"lng":32.6017581,"image":"/api/assets/uploads/ee0ddf79-41ed-48d1-ab1a-7b5e75e1105d.webp","meals":["Breakfast"],"title":"Day 1 | Luxor - Sunrise Hot Air Balloon Flight Over Ancient Thebes","placeName":"Luxor","imageAlt":"Aerial sunrise view over the Valley of the Kings and Theban hills from a hot air balloon","activities":[],"description":"Pickup is before dawn, around 4:30 AM, for the transfer to the West Bank launch site, where the balloon inflates as the sky begins to lighten. After boarding, the flight lifts off around sunrise, climbing to roughly 1,000–1,500 feet for open views across ancient Thebes. Below, the Valley of the Kings appears as a maze of rocky ravines, followed by Hatshepsut''s temple carved into the cliffs at Deir el-Bahari, the Ramesseum, and the Colossi of Memnon, with green farmland giving way to open desert at the valley''s edge. After about an hour aloft, the balloon lands, followed by a champagne toast and a flight certificate before breakfast."}]'::jsonb,
  includes = ARRAY['Hot air balloon flight (shared basket)', 'Professional pilot and ground crew', 'Hotel pickup and drop-off in Luxor', 'Pre-flight light refreshments', 'Champagne celebration after landing', 'Flight certificate', 'All safety equipment', 'Insurance', 'All taxes and service charges']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses']::text[],
  duration = '3 hours',
  duration_days = 1,
  group_size = '2-8',
  destinations = ARRAY['Luxor']::text[],
  seo_title = 'Luxor Hot Air Balloon Tour | Sunrise Flight',
  meta_description = 'Sunrise hot air balloon flight over Luxor''s West Bank, with views of the Valley of the Kings, Hatshepsut Temple, and Colossi of Memnon, champagne included.',
  focus_keyword = 'Luxor Hot Air Balloon Tour',
  canonical_url = 'https://iluxuryegypt.com/luxor-hot-air-balloon-sunrise-tour',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'luxor-hot-air-balloon-sunrise-tour';

-- ============================================================
-- Luxor Horse Carriage City Tour  (slug: luxor-horse-carriage-ride-city-tour)
-- ============================================================
UPDATE tours SET
  title = 'Luxor Horse Carriage City Tour',
  description = '<p>A Luxor Horse Carriage City Tour covers the city at street level, in a horse-drawn carriage decorated with colorful fabric — a slower, older way to see Luxor than a car allows. The route starts along the Nile corniche, with feluccas under sail on one side and the West Bank''s mountains forming a backdrop on the other, passing the historic Winter Palace hotel and its gardens thick with bougainvillea.</p><p>From the riverfront, the carriage turns into central Luxor for a view of Luxor Temple''s illuminated pylons and standing obelisk from outside, before entering the old town''s narrower streets. Luxor Souk is the main stop here: covered stalls selling spices, textiles, alabaster carvings, and papyrus paintings, with the smell of hibiscus and fresh herbs carrying through the lanes.</p><p>The final stretch passes through residential streets where ordinary daily life continues around the carriage rather than for it, before the return to the hotel. It''s a short, unhurried way to see the city rather than a single-site tour.</p>',
  itinerary = '[{"day":1,"lat":25.699525,"lng":32.6390695,"image":"/api/assets/uploads/9ad9550e-9032-48a6-b26e-a962f8e9f3c3.webp","title":"Day 1 | Luxor - Traditional Horse Carriage City & Corniche Exploration","placeName":"Luxor Temple","imageAlt":"Horse-drawn carriage passing Luxor Temple''s illuminated pylons at night","activities":[],"description":"A horse-drawn carriage, decorated with colorful fabric, sets off along the Nile corniche, passing feluccas under sail and cruise ships docked against the West Bank''s mountain backdrop. The route continues past the historic Winter Palace hotel and its bougainvillea gardens, then into central Luxor for a view of Luxor Temple''s illuminated pylons and obelisk from outside. From there, the carriage enters the old town''s narrower streets, stopping at Luxor Souk, where stalls sell spices, textiles, alabaster carvings, and papyrus paintings. The ride continues through residential streets before returning to the hotel."}]'::jsonb,
  includes = ARRAY['Horse-drawn carriage', 'Experienced carriage driver', 'Hotel pickup and drop-off in Luxor', 'Souk visit with a brief guided walk', 'All taxes and service charges']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses', 'Travel insurance']::text[],
  duration = '2 hours',
  duration_days = 1,
  group_size = '2-8',
  destinations = ARRAY['Luxor']::text[],
  seo_title = 'Luxor Horse Carriage City Tour | Souk & Corniche',
  meta_description = 'Horse-drawn carriage tour of Luxor, along the Nile corniche, past Luxor Temple, and through the historic Luxor Souk market.',
  focus_keyword = 'Luxor Horse Carriage Tour',
  canonical_url = 'https://iluxuryegypt.com/luxor-horse-carriage-ride-city-tour',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'luxor-horse-carriage-ride-city-tour';

-- ============================================================
-- Karnak Temple Sound and Light Show Tour  (slug: karnak-temple-sound-light-show-luxor)
-- ============================================================
UPDATE tours SET
  title = 'Karnak Temple Sound and Light Show Tour',
  description = '<p>The Karnak Temple Sound and Light Show turns ancient Thebes''s largest religious complex into a stage after dark. Pickup is in the late afternoon, timed so you''re seated as the sun goes down and the temple''s silhouette darkens against the evening sky.</p><p>Once the show begins, colored lighting and laser projection pick out columns, pylons, and obelisks in sequence, timed to a narrated history spanning more than 2,000 years of construction — from the Middle Kingdom through the New Kingdom and into the Ptolemaic period — centered on Amun-Ra, the chief god worshipped here across that entire span. Narration rotates through several languages depending on the evening.</p><p>Partway through, the audience walks into the complex itself rather than staying seated throughout, passing beneath the Great Hypostyle Hall''s 134 columns and along the edge of the sacred lake where priests once performed daily purification rituals. At around 50 minutes, the show is a compact way to see Karnak''s scale and history in a single sitting, distinct from a daytime visit.</p>',
  itinerary = '[{"day":1,"lat":25.7204345,"lng":32.6541346,"image":"/api/assets/uploads/d864a7fc-4143-4e6d-b166-25c5efc0c999.webp","title":"Day 1 | Karnak Temple - Evening Sound & Light Spectacular Journey","placeName":"Karnak Temple","imageAlt":"Karnak Temple''s Great Hypostyle Hall illuminated for its evening sound and light show","activities":[],"description":"Pickup is in the late afternoon for the transfer to Karnak Temple, where the sound and light show begins as darkness falls over the complex. Colored lighting and laser projections pick out the site''s architecture while narration, in a rotating set of languages, tells the story of Karnak''s construction across more than 2,000 years, from the Middle Kingdom through the Ptolemaic period, centered on Amun-Ra, chief god of ancient Thebes. Partway through, the audience walks into sections of the illuminated complex, passing the Great Hypostyle Hall''s 134 columns, the sacred lake, and standing obelisks. The roughly 50-minute show ends with the return to your hotel."}]'::jsonb,
  includes = ARRAY['Air-conditioned vehicle', 'Hotel pickup and drop-off in Luxor', 'Sound and Light Show entrance ticket', 'All taxes and service charges']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses', 'Travel insurance']::text[],
  duration = '3 hours',
  duration_days = 1,
  group_size = '2-8',
  destinations = ARRAY['Luxor']::text[],
  seo_title = 'Karnak Temple Sound and Light Show | Luxor',
  meta_description = 'Evening sound and light show at Karnak Temple in Luxor, with illuminated columns, laser projections, and a narrated 2,000-year history.',
  focus_keyword = 'Karnak Temple Sound and Light Show',
  canonical_url = 'https://iluxuryegypt.com/karnak-temple-sound-light-show-luxor',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'karnak-temple-sound-light-show-luxor';

-- ============================================================
-- Edfu & Kom Ombo Tour from Luxor  (slug: edfu-kom-ombo-temples-tour-luxor)
-- ============================================================
UPDATE tours SET
  title = 'Edfu & Kom Ombo Tour from Luxor',
  description = '<p>An Edfu and Kom Ombo tour from Luxor reaches two temples built within a century of each other, both unusually intact for their age. The roughly two-hour drive south leads first to Edfu, where the Temple of Horus stands as Egypt''s best-preserved temple — built entirely during the Ptolemaic period, between 237 and 57 BCE, with 36-meter pylons and a columned hall that survive close to their original form, decorated throughout with reliefs recounting the mythological battle between Horus and his rival Seth.</p><p>Kom Ombo, further south on a bend in the Nile, is unusual in being a double temple: dedicated equally to Sobek, the crocodile god, and to Horus the Elder, its halls, sanctuaries, and courts are built in mirrored symmetry for each deity.</p><p>Reliefs here include a rare depiction of ancient surgical instruments and a Nilometer once used to measure the Nile''s flood. The adjacent Crocodile Museum, built around mummified crocodiles recovered locally, rounds out the visit before the drive back to Luxor by evening. Together, the two temples make it easy to compare single-deity and double-deity Ptolemaic temple design in one day.</p>',
  itinerary = '[{"day":1,"lat":24.9783733,"lng":32.8735047,"title":"Day 1 | Edfu & Kom Ombo - Temple of Horus & Dual Deity Sanctuary Exploration","placeName":"Temple of Horus","imageAlt":"The 36-meter pylons of the Temple of Horus at Edfu","activities":[],"description":"The drive south from Luxor to Edfu takes about two hours, arriving at the Temple of Horus — Egypt''s best-preserved temple, built entirely during the Ptolemaic period between 237 and 57 BCE. Its pylons rise 36 meters, fronting a columned courtyard and hypostyle hall decorated with reliefs of the mythological battle between Horus and Seth. From Edfu, the route continues to Kom Ombo, a double temple set on a bend in the Nile, dedicated equally to the crocodile god Sobek and to Horus the Elder in a mirrored, symmetrical layout. Reliefs here include ancient surgical instruments and a Nilometer once used to track flood levels, with a Crocodile Museum nearby before the drive back to Luxor."}]'::jsonb,
  includes = ARRAY['Air-conditioned vehicle', 'Professional Egyptologist guide', 'Hotel pickup and drop-off in Luxor', 'Entrance fees to Edfu and Kom Ombo temples', 'Entrance to Crocodile Museum', 'Bottled water', 'All taxes and service charges']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses', 'Travel insurance']::text[],
  duration = '9 hours',
  duration_days = 1,
  group_size = '2-8',
  destinations = ARRAY['Luxor']::text[],
  seo_title = 'Edfu Kom Ombo Tour from Luxor | Temple Day Trip',
  meta_description = 'Private day trip from Luxor to the Temple of Horus at Edfu and the double temple of Kom Ombo, with the Crocodile Museum and an Egyptologist guide.',
  focus_keyword = 'Edfu Kom Ombo Tour from Luxor',
  canonical_url = 'https://iluxuryegypt.com/edfu-kom-ombo-temples-tour-luxor',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'edfu-kom-ombo-temples-tour-luxor';

-- ============================================================
-- Day Trip to Luxor East Bank  (slug: luxor-east-bank-day-tour)
-- ============================================================
UPDATE tours SET
  title = 'Day Trip to Luxor East Bank',
  description = '<p>A Luxor East Bank Day Tour covers the two temples that anchor ancient Thebes on the river''s eastern side, both still standing close to where they were built more than three thousand years ago. Karnak Temple comes first — the largest religious complex ever constructed, covering over 100 hectares and built up over more than 2,000 years by successive pharaohs.</p><p>The Avenue of Ram-Headed Sphinxes leads into the Great Hypostyle Hall, where 134 columns rise 23 meters, still carrying traces of their original color. Beyond the hall, the sacred lake once used for priestly purification rituals, Queen Hatshepsut''s towering granite obelisk, and the Festival Hall of Thutmose III round out a site large enough to spend a full morning in on its own.</p><p>A short drive connects to Luxor Temple, built primarily by Amenhotep III and later added to by Ramses II, linked to Karnak by the ceremonial Avenue of Sphinxes that once ran between them. Its pylon, colonnade, and inner courts are compact enough to see thoroughly in an hour, a fitting close to a day spent entirely on Thebes''s east bank.</p>',
  itinerary = '[{"day":1,"lat":25.7204345,"lng":32.6541346,"image":"/api/assets/uploads/d864a7fc-4143-4e6d-b166-25c5efc0c999.webp","title":"Day 1 | Luxor East Bank - Karnak Temple Complex & Luxor Temple Exploration","placeName":"Karnak Temple","imageAlt":"The Great Hypostyle Hall''s 134 columns at Karnak Temple, Luxor","activities":[],"description":"The day begins with pickup at your Luxor hotel for a visit to Karnak Temple, the largest religious complex ever built, spanning more than 100 hectares. Entering along the Avenue of Ram-Headed Sphinxes, the Great Hypostyle Hall''s 134 columns rise 23 meters, covered in reliefs built up by successive pharaohs over 2,000 years. Beyond the hall, the sacred lake, Hatshepsut''s granite obelisk, and the Festival Hall of Thutmose III complete the site. A short drive leads to Luxor Temple, built mainly by Amenhotep III and Ramses II and linked to Karnak by the Avenue of Sphinxes, with its own pylon, courts, and colonnade."}]'::jsonb,
  includes = ARRAY['Air-conditioned vehicle', 'Professional Egyptologist guide', 'Hotel pickup and drop-off in Luxor', 'Entrance fees to Karnak and Luxor temples', 'Bottled water', 'All taxes and service charges']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses', 'Travel insurance']::text[],
  duration = '6 hours',
  duration_days = 1,
  group_size = '2-8',
  destinations = ARRAY['Luxor']::text[],
  seo_title = 'Luxor East Bank Day Tour | Karnak & Luxor Temple',
  meta_description = 'Full-day East Bank tour in Luxor, covering the Karnak Temple complex and Luxor Temple, connected by the ancient Avenue of Sphinxes.',
  focus_keyword = 'Luxor East Bank Day Tour',
  canonical_url = 'https://iluxuryegypt.com/luxor-east-bank-day-tour',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'luxor-east-bank-day-tour';

-- ============================================================
-- Tour to Dandara and Abydos from Luxor  (slug: dandara-abydos-temples-tour-luxor)
-- ============================================================
UPDATE tours SET
  title = 'Tour to Dandara and Abydos from Luxor',
  description = '<p>A Dandara and Abydos tour from Luxor reaches two of Upper Egypt''s most significant temples, both well north of the city and rarely crowded compared to Luxor''s own sites. The roughly 90-minute drive arrives first at Dandara, where the Temple of Hathor survives from the Ptolemaic and Roman periods with an unusual amount of its original detail intact — an astronomical ceiling showing the zodiac still carries visible color after 2,000 years, and a relief of Cleopatra VII with her son Caesarion remains on the temple''s rear wall, one of the few surviving images connected to her.</p><p>Underground crypts and rooftop chapels, both open to visitors, add depth beyond the main sanctuary. From Dandara, the route continues to Abydos, ancient Egypt''s most important pilgrimage site, where the Temple of Seti I holds some of the finest carved reliefs anywhere in the country.</p><p>Nearby, the Osireion — a sunken structure whose exact purpose is still debated — sits close to the Abydos King List, a carved sequence naming 76 pharaohs in order. Lunch is included before the drive back to Luxor, closing out a day focused on sites most standard itineraries skip entirely.</p>',
  itinerary = '[{"day":1,"lat":25.702096,"lng":32.647186,"image":"/api/assets/uploads/bc5f0469-7a20-40ef-ad82-aaa3a5dcdac8.webp","meals":["Lunch"],"title":"Day 1 | Dandara & Abydos - Temple of Hathor & Seti I''s Sacred Sanctuary","placeName":"Temple of Hathor","imageAlt":"The astronomical ceiling and Ptolemaic reliefs at the Temple of Hathor, Dandara","activities":[],"description":"An early drive north from Luxor, about 90 minutes, reaches Dandara and the Temple of Hathor, one of Egypt''s best-preserved temples, built during the Ptolemaic and Roman periods. Its astronomical ceiling still carries visible color after 2,000 years, and a relief of Cleopatra VII with her son Caesarion remains on the rear wall. Underground crypts and rooftop chapels are open to explore. Continuing to Abydos, the Temple of Seti I holds some of Egypt''s finest carved reliefs, alongside the Osireion, a mysterious sunken structure linked to Osiris worship, and the Abydos King List, naming 76 pharaohs in sequence. Lunch precedes the drive back to Luxor."}]'::jsonb,
  includes = ARRAY['Air-conditioned vehicle', 'Professional Egyptologist guide', 'Hotel pickup and drop-off in Luxor', 'Entrance fees to Dandara and Abydos temples', 'Lunch at a local restaurant', 'Bottled water', 'All taxes and service charges']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses', 'Travel insurance']::text[],
  duration = '9 hours',
  duration_days = 1,
  group_size = '2-8',
  destinations = ARRAY['Luxor']::text[],
  seo_title = 'Dandara Abydos Tour from Luxor | Temple of Hathor',
  meta_description = 'Private day trip from Luxor to Dandara''s Temple of Hathor and the Temple of Seti I at Abydos, with the Abydos King List, guide, and lunch included.',
  focus_keyword = 'Dandara Abydos Tour from Luxor',
  canonical_url = 'https://iluxuryegypt.com/dandara-abydos-temples-tour-luxor',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'dandara-abydos-temples-tour-luxor';

-- ============================================================
-- Day Trip from Luxor to Cairo by Plane  (slug: luxor-cairo-day-trip-flight)
-- ============================================================
UPDATE tours SET
  title = 'Day Trip from Luxor to Cairo by Plane',
  description = '<p>A Luxor to Cairo day trip by air covers, in a single day, the two sites most associated with ancient Egypt anywhere in the world. A short flight from Luxor puts you in Cairo by mid-morning, where a guide takes over for the drive to the Giza Plateau — home to the Pyramids of Khufu, Khafre, and Menkaure, the only one of the ancient world''s Seven Wonders still standing, and the Great Sphinx, carved directly from the plateau''s own bedrock rather than built from blocks.</p><p>From Giza, the day moves to the Egyptian Museum in Tahrir Square, holding more than 120,000 artifacts across ancient Egyptian history. Tutankhamun''s complete burial treasures are the centerpiece — his gold mask, throne, jewelry, and ceremonial chariots — displayed alongside a hall of preserved royal mummies that puts the pyramids'' builders in more human context.</p><p>Lunch at a local restaurant sits between the two stops, and the day ends with an evening flight back to Luxor. It''s a long day, but it adds Cairo''s two essential sights to a Luxor stay without needing a separate trip.</p>',
  itinerary = '[{"day":1,"lat":30.0479664,"lng":31.2336093,"image":"/api/assets/uploads/9720e9f8-04a4-4290-ab18-78d32a0246a2.webp","meals":["Lunch"],"title":"Day 1 | Cairo - Pyramids of Giza, Sphinx & Egyptian Museum Expedition","placeName":"Egyptian Museum","imageAlt":"Tutankhamun''s gold mask and treasures inside the Egyptian Museum, Cairo","activities":[],"description":"An early transfer to Luxor Airport connects to a flight to Cairo, where a guide meets you for the drive to Giza. The Pyramids of Khufu, Khafre, and Menkaure — the last of the ancient world''s Seven Wonders still standing — rise beside the Great Sphinx, carved from the plateau''s own bedrock. From there, the Egyptian Museum in Tahrir Square holds more than 120,000 artifacts, including Tutankhamun''s complete burial treasures: his gold mask, throne, jewelry, and chariots, displayed alongside a hall of royal mummies. Lunch follows before the transfer to Cairo Airport for the evening flight back to Luxor."}]'::jsonb,
  includes = ARRAY['Domestic flights (Luxor-Cairo-Luxor)', 'Air-conditioned vehicle in Cairo', 'Professional Egyptologist guide', 'Hotel pickup and drop-off in Luxor', 'Airport transfers in Cairo', 'Entrance fees to all sites', 'Lunch at a local restaurant', 'Bottled water', 'All taxes and service charges']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses', 'Travel insurance']::text[],
  duration = '14 hours',
  duration_days = 1,
  group_size = '2-8',
  destinations = ARRAY['Luxor', 'Cairo']::text[],
  seo_title = 'Luxor to Cairo Day Trip | Pyramids & Egyptian Museum',
  meta_description = 'Day trip by air from Luxor to Cairo, covering the Giza Pyramids, Great Sphinx, and Egyptian Museum''s Tutankhamun treasures, with lunch included.',
  focus_keyword = 'Luxor to Cairo Day Trip',
  canonical_url = 'https://iluxuryegypt.com/luxor-cairo-day-trip-flight',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'luxor-cairo-day-trip-flight';

-- ============================================================
-- Day Tour to Luxor East and West Banks  (slug: luxor-east-west-banks-full-day-tour)
-- ============================================================
UPDATE tours SET
  title = 'Day Tour to Luxor East and West Banks',
  description = '<p>A Luxor East and West Bank Tour is the most complete single-day introduction to ancient Thebes, covering the necropolis and the temple district on opposite sides of the Nile. The West Bank comes first: three decorated tombs in the Valley of the Kings, each with wall paintings and passages from the Book of the Dead guiding the pharaoh through the underworld, followed by Hatshepsut''s mortuary temple at Deir el-Bahari, its three colonnaded terraces cut directly into the limestone cliffs.</p><p>A brief stop at the seated Colossi of Memnon completes the West Bank before lunch at a restaurant overlooking the Nile. Crossing to the East Bank, the afternoon opens at Karnak, the largest religious complex ever built, where the Great Hypostyle Hall''s 134 columns lead through courts and sanctuaries built up by pharaohs over two millennia, past the sacred lake once used for priestly rituals.</p><p>The day ends at Luxor Temple, connected to Karnak by the ceremonial Avenue of Sphinxes, its pylons and colonnades a more compact counterpart to Karnak''s scale. Seeing both banks in one day gives a far more complete picture of Thebes than either half alone.</p>',
  itinerary = '[{"day":1,"lat":25.7372398,"lng":32.6086902,"image":"/api/assets/uploads/f2a1b83d-fabd-4cbf-a758-189600798859.webp","meals":["Lunch"],"title":"Day 1 | Luxor - Complete East & West Bank Archaeological Journey","placeName":"Temple of Hatshepsut","imageAlt":"Queen Hatshepsut''s temple carved into the cliffs at Deir el-Bahari","activities":[],"description":"The day starts on the West Bank, entering three decorated tombs in the Valley of the Kings, each carrying wall paintings and passages from the Book of the Dead. A short drive reaches Hatshepsut''s temple at Deir el-Bahari, cut into the cliffs in three colonnaded terraces, followed by a photo stop at the Colossi of Memnon. Lunch at a Nile-view restaurant marks the crossing to the East Bank, where Karnak Temple''s Great Hypostyle Hall and its 134 columns lead into the sacred lake and surrounding sanctuaries. The day closes at Luxor Temple, linked to Karnak by the Avenue of Sphinxes."}]'::jsonb,
  includes = ARRAY['Air-conditioned vehicle', 'Professional Egyptologist guide', 'Hotel pickup and drop-off in Luxor', 'Entrance fees to all sites', 'Lunch at a local restaurant', 'Bottled water', 'All taxes and service charges']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses', 'Travel insurance']::text[],
  duration = '9 hours',
  duration_days = 1,
  group_size = '2-8',
  destinations = ARRAY['Luxor']::text[],
  seo_title = 'Luxor East and West Bank Tour | Full-Day',
  meta_description = 'Full-day Luxor tour covering the Valley of the Kings, Hatshepsut Temple, Karnak Temple, and Luxor Temple, with lunch and an Egyptologist guide.',
  focus_keyword = 'Luxor East and West Bank Tour',
  canonical_url = 'https://iluxuryegypt.com/luxor-east-west-banks-full-day-tour',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'luxor-east-west-banks-full-day-tour';

-- ============================================================
-- Luxor Day Trip from Cairo by Plane  (slug: luxor-from-cairo-plane)
-- ============================================================
UPDATE tours SET
  title = 'Luxor Day Trip from Cairo by Plane',
  description = '<p>A Luxor Day Trip from Cairo covers both banks of the Nile at Thebes in a single day, reached by a short flight rather than the long overland drive. On arrival, a guide leads straight into Karnak Temple, the largest religious complex ever built in ancient Egypt, its Great Hypostyle Hall''s 134 columns opening onto a sacred lake and courts added by pharaohs over two thousand years.</p><p>A short walk along the Avenue of Sphinxes reaches Luxor Temple, built primarily by Amenhotep III and later expanded by Ramses II. Crossing the Nile to the West Bank, the Valley of the Kings holds some of the best-known royal tombs in Egypt, including that of Tutankhamun, found undisturbed by Howard Carter in 1922.</p><p>Hatshepsut''s temple, cut into the cliffs at Deir el-Bahari, and the seated Colossi of Memnon complete the West Bank itinerary. Lunch at a restaurant overlooking the Nile closes out the sightseeing before the evening flight back to Cairo — a full Luxor day compressed into a single round trip, without an overnight stay.</p>',
  itinerary = '[{"day":1,"lat":25.7404899,"lng":32.6017581,"image":"/api/assets/uploads/ee0ddf79-41ed-48d1-ab1a-7b5e75e1105d.webp","meals":["Lunch"],"title":"Day 1 | Luxor – East Bank Temples & West Bank Necropolis","placeName":"Valley of the Kings","imageAlt":"Tutankhamun''s tomb in the Valley of the Kings, Luxor","activities":[],"description":"A private flight from Cairo lands in Luxor, where a guide leads the way into Karnak Temple, the largest religious site built in ancient Egypt, with its Hypostyle Hall''s 134 columns and sacred lake. A short walk along the Avenue of Sphinxes reaches Luxor Temple, built mainly by Amenhotep III and Ramses II. Crossing the Nile, the Valley of the Kings holds decorated royal tombs, including Tutankhamun''s, discovered in 1922. Hatshepsut''s temple at Deir el-Bahari and the Colossi of Memnon complete the West Bank before lunch at a Nile-view restaurant and the evening flight back to Cairo."}]'::jsonb,
  includes = ARRAY['Private round-trip flights Cairo-Luxor-Cairo', 'Private vehicle with driver in Luxor', 'Expert Egyptologist guide (English-speaking)', 'All Luxor site entrance fees (Karnak, Luxor Temple, Valley of Kings, Hatshepsut)', 'Gourmet lunch at a premium Nile-view restaurant', 'Bottled mineral water and refreshments', 'Hotel pickup and drop-off (Cairo/Giza)', 'All taxes and service charges']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses', 'Travel insurance']::text[],
  duration = '13 hours',
  duration_days = 1,
  group_size = '2-8',
  destinations = ARRAY['Cairo', 'Luxor']::text[],
  seo_title = 'Luxor Day Trip from Cairo | Karnak & Valley of Kings',
  meta_description = 'Private day trip by air from Cairo to Luxor, covering Karnak Temple, Luxor Temple, and the Valley of the Kings, with lunch and a guide included.',
  focus_keyword = 'Luxor Day Trip from Cairo',
  canonical_url = 'https://iluxuryegypt.com/luxor-from-cairo-plane',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'luxor-from-cairo-plane';

-- ============================================================
-- Luxor Trip to Valley of the Kings & Hatshepsut Temple  (slug: valley-kings-hatshepsut-temple-luxor)
-- ============================================================
UPDATE tours SET
  title = 'Luxor Trip to Valley of the Kings & Hatshepsut Temple',
  description = '<p>A Valley of the Kings and Hatshepsut Temple tour is the standard introduction to Luxor''s West Bank necropolis, covering the two sites most visitors picture when they think of ancient Thebes. The Valley of the Kings held New Kingdom pharaohs for close to 500 years, and of the 63 tombs discovered there, three open ones are entered on this visit, each decorated with scenes from the Book of the Dead guiding the pharaoh through the underworld — the same valley where Howard Carter uncovered Tutankhamun''s intact tomb in 1922.</p><p>From the valley, Hatshepsut''s mortuary temple at Deir el-Bahari rises in three colonnaded terraces cut directly into the limestone cliffs, one of ancient Egypt''s most distinctive pieces of architecture. Reliefs across its terraces record her divine birth story and a trading expedition to the Land of Punt, an unusually detailed record for a female pharaoh whose monuments were later defaced by her successors.</p><p>A stop at the seated Colossi of Memnon, weathered but still imposing after 3,400 years, closes out the visit before the return to Luxor.</p>',
  itinerary = '[{"day":1,"lat":25.7372398,"lng":32.6086902,"image":"/api/assets/uploads/f2a1b83d-fabd-4cbf-a758-189600798859.webp","title":"Day 1 | Valley of the Kings & Hatshepsut Temple - Royal Tombs & Monuments","placeName":"Temple of Hatshepsut","imageAlt":"Queen Hatshepsut''s three-terraced mortuary temple at Deir el-Bahari","activities":[],"description":"Crossing the Nile to the West Bank, the Valley of the Kings holds 63 known tombs, the burial ground of New Kingdom pharaohs for close to 500 years. Three decorated tombs are entered, their walls carrying scenes from the Book of the Dead guiding the pharaoh into the afterlife — among them the same valley where Howard Carter found Tutankhamun''s intact tomb in 1922. From there, Hatshepsut''s temple at Deir el-Bahari rises in three colonnaded terraces cut into the limestone cliffs, its reliefs recording her divine birth story and a trading expedition to the Land of Punt. The Colossi of Memnon mark the final stop before returning to your hotel."}]'::jsonb,
  includes = ARRAY['Air-conditioned vehicle', 'Professional Egyptologist guide', 'Hotel pickup and drop-off in Luxor', 'Entrance fees to all sites', 'Bottled water', 'All taxes and service charges']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses', 'Travel insurance']::text[],
  duration = '5 hours',
  duration_days = 1,
  group_size = '2-8',
  destinations = ARRAY['Luxor']::text[],
  seo_title = 'Valley of the Kings Hatshepsut Temple Tour | Luxor',
  meta_description = 'Luxor West Bank tour of the Valley of the Kings'' royal tombs and Hatshepsut''s mortuary temple at Deir el-Bahari, with the Colossi of Memnon.',
  focus_keyword = 'Valley of the Kings Hatshepsut Temple Tour',
  canonical_url = 'https://iluxuryegypt.com/valley-kings-hatshepsut-temple-luxor',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'valley-kings-hatshepsut-temple-luxor';

-- ============================================================
-- Day Tour to Valley of the Queens, Habu & Ramesseum  (slug: valley-queens-medinet-habu-ramesseum-tour)
-- ============================================================
UPDATE tours SET
  title = 'Day Tour to Valley of the Queens, Habu & Ramesseum',
  description = '<p>A Valley of the Queens, Medinet Habu, and Ramesseum tour reaches three West Bank sites that get a fraction of the attention paid to the Valley of the Kings, despite comparable craftsmanship. The Valley of the Queens holds tombs built for royal wives, princes, and princesses across the 18th, 19th, and 20th dynasties, decorated with wall paintings whose color and detail rank among the finest surviving anywhere in Egypt.</p><p>From there, Medinet Habu is Ramses III''s mortuary temple, built behind fortress-like walls and covered with reliefs recording his naval victory over the Sea Peoples, alongside scenes of religious festivals and ordinary daily life that are rare survivals from this period.</p><p>The nearby Ramesseum, built for Ramses II, is known today mainly for its fallen colossal statue — the inspiration, secondhand, for Shelley''s poem ''Ozymandias'' — though its standing columns and reliefs of the Battle of Kadesh are just as significant to see in person. Together, the three sites round out a fuller picture of New Kingdom Egypt than the more famous Valley of the Kings alone provides.</p>',
  itinerary = '[{"day":1,"lat":25.7277168,"lng":32.5927578,"image":"/api/assets/uploads/54c322b5-e1bb-4dba-94e9-ea09bca6c5ef.webp","title":"Day 1 | Valley of Queens, Medinet Habu & Ramesseum - Royal Tombs & Temples Exploration","placeName":"Valley of the Queens","imageAlt":"Finely decorated royal tombs in the Valley of the Queens, Luxor","activities":[],"description":"The Valley of the Queens, burial ground for royal wives and children of the 18th to 20th dynasties, opens with tombs decorated in fine, still-vivid wall paintings. From there, Medinet Habu, the fortified mortuary temple of Ramses III, carries reliefs of his naval victory over the Sea Peoples across its pylons, alongside scenes of religious ceremony and daily life. The nearby Ramesseum, built for Ramses II, is known for its fallen colossal statue — the inspiration for Shelley''s poem ''Ozymandias'' — along with surviving columns and reliefs depicting the Battle of Kadesh."}]'::jsonb,
  includes = ARRAY['Air-conditioned vehicle', 'Professional Egyptologist guide', 'Hotel pickup and drop-off in Luxor', 'Entrance fees to all sites', 'Bottled water', 'All taxes and service charges']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses', 'Travel insurance']::text[],
  duration = '5 hours',
  duration_days = 1,
  group_size = '2-8',
  destinations = ARRAY['Luxor']::text[],
  seo_title = 'Valley of the Queens Medinet Habu Tour | Luxor',
  meta_description = 'Luxor West Bank tour of the Valley of the Queens, Medinet Habu''s fortified temple, and the Ramesseum, with an Egyptologist guide.',
  focus_keyword = 'Valley of the Queens Medinet Habu Tour',
  canonical_url = 'https://iluxuryegypt.com/valley-queens-medinet-habu-ramesseum-tour',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'valley-queens-medinet-habu-ramesseum-tour';

-- ============================================================
-- Luxor Day Tour to Karnak and Luxor Temples  (slug: luxor-karnak-temples-day-tour)
-- ============================================================
UPDATE tours SET
  title = 'Luxor Day Tour to Karnak and Luxor Temples',
  description = '<p>A Karnak and Luxor Temple Tour is built around a theme that''s easy to miss on a quick visit: how each generation in Thebes built on top of what came before rather than starting fresh. At Karnak, that layering spans more than 2,000 years — successive pharaohs from the Middle Kingdom onward kept adding chapels, courts, and pylons to the same religious complex, now the largest ever built, covering over 100 hectares around the Great Hypostyle Hall''s 134 towering columns.</p><p>Luxor Temple carries the same idea further. Built primarily by Amenhotep III and expanded by Ramses II, it was later built into directly — the medieval Abu Haggag Mosque still stands on part of the ancient structure today, a rare case of a working mosque incorporated into a pharaonic temple rather than built beside it.</p><p>The Avenue of Sphinxes, now partly restored, once linked both sites directly, letting priests process between them along a single ceremonial road. Seeing both temples together makes that continuous layering of history, spanning ancient Egyptian, Ptolemaic, and Islamic periods, far easier to follow than visiting either site alone.</p>',
  itinerary = '[{"day":1,"lat":25.7204345,"lng":32.6541346,"image":"/api/assets/uploads/d864a7fc-4143-4e6d-b166-25c5efc0c999.webp","title":"Day 1 | Karnak & Luxor Temples - Sacred Sanctuaries of Ancient Thebes","placeName":"Karnak Temple","imageAlt":"The Avenue of Sphinxes linking Karnak Temple and Luxor Temple","activities":[],"description":"Pickup from your Luxor hotel leads first to Karnak Temple, the largest religious complex ever built, covering more than 100 hectares. Past the Avenue of Ram-Headed Sphinxes, the Great Hypostyle Hall''s 134 columns rise 23 meters, surrounded by chapels and courts added by pharaohs over more than 2,000 years, along with the sacred lake and Hatshepsut''s obelisk. From there, Luxor Temple, built mainly by Amenhotep III and Ramses II, shows a different kind of layering: the medieval Abu Haggag Mosque still stands built directly atop part of the ancient structure. The Avenue of Sphinxes once connected both sites directly."}]'::jsonb,
  includes = ARRAY['Air-conditioned vehicle', 'Professional Egyptologist guide', 'Hotel pickup and drop-off in Luxor', 'Entrance fees to Karnak and Luxor temples', 'Bottled water', 'All taxes and service charges']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses', 'Travel insurance']::text[],
  duration = '6 hours',
  duration_days = 1,
  group_size = '2-8',
  destinations = ARRAY['Luxor']::text[],
  seo_title = 'Karnak and Luxor Temple Tour | Layered History',
  meta_description = 'Luxor day tour of Karnak Temple and Luxor Temple, including the Abu Haggag Mosque built atop the ancient structure, with an Egyptologist guide.',
  focus_keyword = 'Karnak and Luxor Temple Tour',
  canonical_url = 'https://iluxuryegypt.com/luxor-karnak-temples-day-tour',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'luxor-karnak-temples-day-tour';

-- Review the output above (row counts, any 0-row UPDATE means a slug
-- mismatch) before committing.
COMMIT;
