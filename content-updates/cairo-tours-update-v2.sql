-- Cairo/Alexandria Day Tours content update — v2 (20 tours)
-- Fixes two issues found after v1 (content-updates/cairo-tours-update.sql)
-- went live:
--   1. "The Experience" (description) is now 3 separate <p> paragraphs,
--      split at sentence boundaries and balanced by word count, instead of
--      one single dense <p> block. Same wording, no rewrite.
--   2. Photo placeName/imageAlt reviewed for all 20 tours: 5 tours that
--      have no image at all (Royal Palaces, Citadel & Mosque Heritage,
--      NMEC, Coptic Cairo, and the pilot Cairo Pyramids tour — one more
--      than the 4 originally flagged, found on a closer pass) get a
--      proposed placeName + imageAlt; the other 15 get imageAlt rewritten
--      to be specific to the day's actual content instead of the generic
--      "Private guided visit to X" template. private-nile-sunset-felucca's
--      placeName also corrected from "Felucca" (not a real place) to
--      "Cairo". This UPDATE still does not assign an actual image file for
--      the 5 photo-less tours — that still needs Suggest Photo (or a
--      manual upload) run from the live admin panel.
-- Run with: psql "$DATABASE_URL" -f content-updates/cairo-tours-update-v2.sql
-- Safe to run after v1 or standalone — this is a full re-UPDATE of every
-- field v1 touched, using the same values except description/itinerary.

BEGIN;

-- ============================================================
-- Tour of Cairo - Royal Palaces of Cairo Private Tour  (slug: tour-of-cairo-royal-palaces-of-cairo-private-tour)
-- ============================================================
UPDATE tours SET
  title = 'Tour of Cairo - Royal Palaces of Cairo Private Tour',
  description = '<p>This Cairo Royal Palaces Tour opens a side of Egypt''s history most visitors miss: the country''s royal and colonial-era past, told through three very different buildings. Manial Palace Museum, set on the Nile island of Rhoda, was the private residence of Prince Mohammed Ali Tewfik, and its rooms mix Ottoman, Moorish, and European design in equal measure — look for the mother-of-pearl inlay in the reception halls and the eclectic royal collections in the hunting museum.</p><p>From there, the tour moves to Abdeen Palace, the official seat of Egypt''s rulers from 1872 until the 1952 revolution, where the palace museum displays royal weapons, decorations, and gifts exchanged with foreign heads of state.</p><p>The final stop, in the northeastern district of Heliopolis, is the exterior of Baron Empain Palace — a striking building modeled on the temples of Angkor Wat, built by the Belgian industrialist who founded the district itself. A guide trained in Egypt''s royal history accompanies you throughout, with lunch included between sites. It''s a compact, well-paced day for travelers who want Cairo''s story beyond the pharaohs.</p>',
  itinerary = '[{"day":1,"meals":["Lunch"],"title":"Day 1 | Cairo – Manial Palace Museum, Abdeen Palace & Baron Empain","activities":[],"placeName":"Manial Palace","description":"Start at Manial Palace Museum on Rhoda Island, once home to Prince Mohammed Ali Tewfik, where Ottoman, Moorish, and European styles meet in reception halls inlaid with mother-of-pearl. A palace historian walks you through the hunting museum''s royal collections and the surrounding gardens. From there, visit Abdeen Palace, Egypt''s seat of power from 1872 to 1952, its museum holding royal weapons, decorations, and state gifts. In Heliopolis, see the exterior of Baron Empain Palace, built in the style of Cambodia''s Angkor Wat by the city''s Belgian founder. Lunch follows at a well-regarded restaurant nearby.","imageAlt":"Ottoman and Moorish interior details at Manial Palace Museum, Rhoda Island"}]'::jsonb,
  includes = ARRAY['Private vehicle with professional driver', 'Private royal history guide', 'Manial Palace Museum & Abdeen Palace entrance fees', 'Baron Empain Palace exterior visit', 'Lunch at a local restaurant', 'Bottled water', 'Hotel pickup and drop-off (Cairo/Giza)', 'All taxes and service charges']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses', 'Travel insurance']::text[],
  duration = '8 hours',
  duration_days = 1,
  group_size = '2-8',
  destinations = ARRAY['Cairo']::text[],
  seo_title = 'Cairo Royal Palaces Tour | Manial, Abdeen & Baron Empain',
  meta_description = 'Private tour of Cairo''s royal palaces: Manial Palace Museum, Abdeen Palace, and Baron Empain Palace, with a royal history guide and lunch included.',
  focus_keyword = 'Cairo Royal Palaces Tour',
  canonical_url = 'https://iluxuryegypt.com/tour-of-cairo-royal-palaces-of-cairo-private-tour',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'tour-of-cairo-royal-palaces-of-cairo-private-tour';

-- ============================================================
-- Grand Egyptian Museum & Pyramids Private Luxury Tour  (slug: private-grand-museum-pyramids)
-- ============================================================
UPDATE tours SET
  title = 'Grand Egyptian Museum & Pyramids Private Luxury Tour',
  description = '<p>A Grand Egyptian Museum Pyramids Tour pairs Egypt''s newest cultural landmark with its oldest. The museum, opened after decades of construction beside the Giza Plateau, holds the most complete display of Tutankhamun''s treasures ever assembled in one place — the golden mask, ceremonial thrones, and chariots are shown together for the first time since their discovery in 1922.</p><p>An Egyptologist guides you through the main galleries, explaining how the museum''s design and lighting were built specifically around these objects. From the museum, it''s a short drive to the Pyramids themselves: the tour continues on foot around the Pyramids of Khufu, Khafre, and Menkaure, with time to approach the Great Sphinx separately.</p><p>Lunch is served at a restaurant overlooking the plateau, a practical break between two very different kinds of history — one told through objects behind glass, the other through stone still standing after four and a half thousand years. A private vehicle and driver handle every transfer, so the day moves at a comfortable, unhurried pace.</p>',
  itinerary = '[{"day":1,"lat":29.9945754,"lng":31.1190738,"image":"/api/assets/uploads/ca22ab3f-37ef-432e-a3b5-7da657edbb9e.webp","meals":["Lunch"],"title":"Day 1 | Cairo – Grand Egyptian Museum & Giza Pyramids Complex","imageAlt":"Grand Egyptian Museum''s Tutankhamun galleries beside the Giza Pyramids","placeName":"Grand Egyptian Museum","activities":[],"description":"A private driver brings you to the Grand Egyptian Museum, the world''s largest archaeological museum, where an Egyptologist walks you through more than 100,000 artifacts, including King Tutankhamun''s full collection of treasures. From there, continue to the Giza Plateau to see the Pyramids of Khufu, Khafre, and Menkaure up close, followed by the Great Sphinx. Your guide explains how the pyramids were built and what each one tells us about the pharaohs who commissioned them. Lunch is at a restaurant with pyramid views before the return to your hotel."}]'::jsonb,
  includes = ARRAY['Private vehicle with professional driver', 'Expert Egyptologist guide (English-speaking)', 'All Giza Pyramids complex entrance fees', 'Gourmet lunch at premium pyramid-view restaurant', 'Bottled mineral water and refreshments', 'Hotel pickup and drop-off (Cairo/Giza)', 'All taxes and service charges']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses', 'Travel insurance']::text[],
  duration = '8 hours',
  duration_days = 1,
  group_size = '2-8',
  destinations = ARRAY['Cairo', 'Giza']::text[],
  seo_title = 'Grand Egyptian Museum & Pyramids Tour | Cairo',
  meta_description = 'Private day tour combining the Grand Egyptian Museum''s Tutankhamun collection with the Pyramids of Giza and Great Sphinx, with an Egyptologist guide.',
  focus_keyword = 'Grand Egyptian Museum Pyramids Tour',
  canonical_url = 'https://iluxuryegypt.com/private-grand-museum-pyramids',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'private-grand-museum-pyramids';

-- ============================================================
-- Islamic Cairo Architecture Private Walking Tour  (slug: islamic-cairo-walk)
-- ============================================================
UPDATE tours SET
  title = 'Islamic Cairo Architecture Private Walking Tour',
  description = '<p>This Islamic Cairo Walking Tour traces roughly a thousand years of building in the old city, on foot and at a relaxed pace. It starts at Al-Azhar Mosque, founded in 970 CE and still one of the Islamic world''s most important centers of religious study, before moving along Al-Muizz Street — a stretch lined with some of the best-preserved medieval Islamic architecture anywhere, including the Qalawun Complex''s hospital and mausoleum.</p><p>A guide trained in Islamic art and architecture points out details easy to miss on your own: carved stucco, mashrabiya screens, and the striped ablaq stonework that became a signature of Mamluk building under Sultan Barquq.</p><p>The walk finishes in Khan El Khalili, the bazaar that grew up alongside these monuments in the 14th century and still functions as a working market today, its covered lanes largely unchanged since. Lunch is served at a restaurant inside a restored historic building along the route. Comfortable shoes are the only real requirement — everything else, from pacing to translation, is handled for you.</p>',
  itinerary = '[{"day":1,"lat":30.0443879,"lng":31.2357257,"image":"/api/assets/uploads/947f1951-086a-45b2-8453-49822ed574a6.webp","meals":["Lunch"],"title":"Day 1 | Cairo – Fatimid & Ayyubid Heritage, Mamluk Magnificence","imageAlt":"Medieval alleyways and workshops in Khan el-Khalili, Islamic Cairo","placeName":"Khan el-Khalili","activities":[],"description":"The walk begins at Al-Azhar Mosque, founded in 970 CE as Cairo''s first Fatimid mosque and still a working center of Islamic learning. From there, follow Al-Muizz Street past the restored Qalawun Complex, noting its carved stonework and geometric tilework, then on to the Sultan Barquq Complex with its distinctive striped stonework. A guide explains how Mamluk-era builders developed Cairo''s skyline of minarets and domed courtyards. The walk ends in Khan El Khalili, where covered alleys built during the same period still house working workshops. Lunch follows at a restaurant inside a restored historic building."}]'::jsonb,
  includes = ARRAY['Expert architectural historian guide (English-speaking)', 'All mosque and monument entrance fees', 'Al-Azhar Mosque admission', 'Historic site access throughout walking tour', 'Lunch at a premium historic restaurant', 'Bottled mineral water throughout', 'Hotel pickup and drop-off via luxury vehicle', 'All taxes and service charges']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses', 'Travel insurance']::text[],
  duration = '7 hours',
  duration_days = 1,
  group_size = '2-8',
  destinations = ARRAY['Cairo']::text[],
  seo_title = 'Islamic Cairo Walking Tour | Al-Azhar to Khan El Khalili',
  meta_description = 'Guided walking tour of Islamic Cairo, from Al-Azhar Mosque and Al-Muizz Street''s Mamluk monuments to the historic Khan El Khalili bazaar, with lunch.',
  focus_keyword = 'Islamic Cairo Walking Tour',
  canonical_url = 'https://iluxuryegypt.com/islamic-cairo-walk',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'islamic-cairo-walk';

-- ============================================================
-- Private Archaeological Tour Memphis, Saqqara & Dahshur  (slug: exclusive-memphis-saqqara-dahshur)
-- ============================================================
UPDATE tours SET
  title = 'Private Archaeological Tour Memphis, Saqqara & Dahshur',
  description = '<p>This Saqqara Dahshur Memphis Tour covers three sites that, together, trace the early evolution of pyramid building better than anywhere else in Egypt. Saqqara''s Step Pyramid, built for the pharaoh Djoser around 2670 BCE, was the first large structure in the world built entirely of stone — a direct predecessor to Giza''s smooth-sided pyramids a century later.</p><p>The surrounding mastaba tombs are decorated with some of the best-preserved reliefs from the Old Kingdom, and the nearby Pyramid of Unas contains the first known religious inscriptions carved inside a pyramid, known as the Pyramid Texts. At Dahshur, the Bent Pyramid shows an early, unsuccessful attempt at a smooth pyramid shape, corrected in the Red Pyramid built right after it — the first true smooth-sided pyramid in Egypt, with chambers open for those who want to go inside.</p><p>The tour finishes in Memphis, once Egypt''s capital for over three thousand years, where a fallen colossus of Ramses II and a large alabaster sphinx are all that remain visible above ground. An Egyptologist accompanies you throughout, with lunch included and private transport between all three sites.</p>',
  itinerary = '[{"day":1,"image":"/api/assets/uploads/6bd816b9-8986-43ee-aaa5-22d358eac921.webp","meals":["Lunch"],"title":"Day 1 | Cairo – Saqqara Necropolis, Dahshur & Memphis","imageAlt":"Djoser''s Step Pyramid at Saqqara, Egypt''s oldest stone monument","placeName":"Step Pyramid","activities":[],"description":"Saqqara is home to the Step Pyramid of Djoser, built around 2670 BCE as the world''s oldest stone structure, along with mastaba tombs whose walls carry vivid hieroglyphs and scenes of daily life. Nearby, the Pyramid of Unas holds some of the earliest religious texts carved into stone. At Dahshur, you''ll see the Bent Pyramid and Red Pyramid from outside, with the option to descend into the Red Pyramid''s burial chambers. The day ends in Memphis, Egypt''s ancient capital, where a colossal statue of Ramses II and an alabaster sphinx remain on open display. Lunch is included."}]'::jsonb,
  includes = ARRAY['Private vehicle with professional driver', 'Expert Egyptologist guide (English-speaking)', 'Saqqara, Dahshur, and Memphis entrance fees', 'Red Pyramid interior access', 'Gourmet lunch at premium restaurant', 'Bottled mineral water and refreshments', 'Hotel pickup and drop-off (Cairo/Giza)', 'All taxes and service charges']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses', 'Travel insurance']::text[],
  duration = '8 hours',
  duration_days = 1,
  group_size = '2-8',
  destinations = ARRAY['Giza', 'Cairo']::text[],
  seo_title = 'Saqqara Dahshur Memphis Tour | Private Egypt Day Trip',
  meta_description = 'Private day tour of Saqqara''s Step Pyramid, the Bent and Red Pyramids at Dahshur, and ancient Memphis, with an Egyptologist guide and lunch included.',
  focus_keyword = 'Saqqara Dahshur Memphis Tour',
  canonical_url = 'https://iluxuryegypt.com/exclusive-memphis-saqqara-dahshur',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'exclusive-memphis-saqqara-dahshur';

-- ============================================================
-- Cairo Tour - Exclusive After-Hours Pyramids Experience  (slug: cairo-tour-exclusive-after-hours-pyramids-experience)
-- ============================================================
UPDATE tours SET
  title = 'Cairo Tour - Exclusive After-Hours Pyramids Experience',
  description = '<p>Most Giza itineraries end by early afternoon, once the site''s regular visiting hours are over — this Cairo Pyramids After-Hours Tour is built around the opposite idea. Timed to arrive as day-trippers are leaving, it gives you the Pyramids of Khufu, Khafre, and Menkaure with a fraction of the usual crowds, in the warmer light of late afternoon rather than the flat glare of midday.</p><p>Your guide covers the same ground as a standard visit — how the pyramids were built, what''s known about their construction crews, the layout of the surrounding tombs — but with more room to actually look and photograph without queuing. The Great Sphinx is next, seen as the light turns gold and then fades.</p><p>As dusk sets in, the monuments are lit for the evening, a sight limited to the small number of visitors still on-site at that hour. Dinner is served afterward at a restaurant with direct views of the plateau, a quiet close to a day built around timing rather than extra sights.</p>',
  itinerary = '[{"day":1,"lat":29.9752811,"lng":31.1375124,"image":"/api/assets/uploads/43f58122-2fee-49f4-8c22-2b9fbc9ec671.webp","meals":["Dinner"],"title":"Day 1 | Cairo – Private After-Hours Pyramids Experience","imageAlt":"The Great Sphinx and Giza Pyramids lit at sunset","placeName":"Great Sphinx","activities":[],"description":"Your driver collects you in the late afternoon, timed so you reach Giza as the day''s regular visitors are leaving. With the crowds gone, a guide walks you around the Pyramids of Khufu, Khafre, and Menkaure in the soft light of early evening, followed by a stop at the Great Sphinx as the sun drops toward the horizon. As the sky darkens, the pyramids are lit against the night — a view very few visitors see, since most tours end by mid-afternoon. Dinner follows at a restaurant overlooking the plateau, with the illuminated monuments visible through the evening."}]'::jsonb,
  includes = ARRAY['Private vehicle with professional driver', 'Expert Egyptologist guide (English-speaking)', 'Special after-hours access permit', 'Giza Pyramids and Sphinx entrance fees', 'Dinner at a pyramid-view restaurant', 'Bottled mineral water and refreshments', 'Hotel pickup and drop-off (Cairo/Giza)', 'All taxes and service charges']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses', 'Travel insurance']::text[],
  duration = '5 hours',
  duration_days = 1,
  group_size = '2-8',
  destinations = ARRAY['Giza']::text[],
  seo_title = 'Cairo Pyramids After-Hours Tour | Private Evening Access',
  meta_description = 'Private late-afternoon and evening tour of the Giza Pyramids and Great Sphinx, timed to avoid crowds, with dinner at a restaurant overlooking the plateau.',
  focus_keyword = 'Cairo Pyramids After Hours Tour',
  canonical_url = 'https://iluxuryegypt.com/cairo-tour-exclusive-after-hours-pyramids-experience',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'cairo-tour-exclusive-after-hours-pyramids-experience';

-- ============================================================
-- Cairo Citadel & Mosque Heritage Tour  (slug: cairo-tour-islamic-cairo-private-heritage-tour)
-- ============================================================
UPDATE tours SET
  title = 'Cairo Citadel & Mosque Heritage Tour',
  description = '<p>This Cairo Citadel Mosque Tour moves through roughly seven centuries of religious architecture in a single day, starting at the Citadel of Saladin, built as a fortress in the 1170s and still crowned by the 19th-century Muhammad Ali Mosque, whose alabaster-clad walls and Ottoman-style domes give it its local nickname, the Alabaster Mosque.</p><p>From the Citadel''s terraces, the view takes in most of historic Cairo. Down in the city, Sultan Hassan Mosque represents Mamluk architecture at its most ambitious — a single building combining a mosque, a religious school, and a mausoleum on a scale rarely attempted before it — standing beside the smaller Al-Rifa''i Mosque, where several of Egypt''s 20th-century royals are buried.</p><p>The tour''s last stop, Ibn Tulun Mosque, is Cairo''s oldest mosque to survive largely unchanged since it was built in 879 CE, recognizable by its spiral minaret, modeled on examples from Samarra in Iraq. Next door, the Gayer-Anderson house shows how a wealthy Ottoman-era family actually lived. Lunch, at a restaurant on historic Al-Muizz Street, closes out the day.</p>',
  itinerary = '[{"day":1,"meals":["Lunch"],"title":"Day 1 | Cairo – Citadel & Major Mosques, Medieval Islamic Quarter","placeName":"Citadel of Saladin","activities":[],"description":"Start at the Citadel of Saladin, built in the 12th century, where the Ottoman-era Muhammad Ali Mosque overlooks the city from its hilltop domes and minarets. Walk down to Sultan Hassan Mosque, a Mamluk-era complex known for its scale and geometric stonework, and the neighboring Al-Rifa''i Mosque, burial place of several members of Egypt''s royal family. The tour continues to Ibn Tulun Mosque, Cairo''s oldest mosque still standing in its original form, notable for its spiral minaret, and to the Gayer-Anderson house next door, furnished as an Ottoman-era home. Lunch is served at a restaurant along Al-Muizz Street.","imageAlt":"The Ottoman-era domes of Muhammad Ali Mosque inside the Citadel of Saladin"}]'::jsonb,
  includes = ARRAY['Private vehicle with professional driver', 'Expert Islamic history and architecture guide', 'Citadel and all mosque entrance fees', 'Gayer-Anderson Museum admission', 'Lunch at a local restaurant', 'Bottled mineral water and refreshments', 'Hotel pickup and drop-off (Cairo/Giza)', 'All taxes and service charges']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses', 'Travel insurance']::text[],
  duration = '8 hours',
  duration_days = 1,
  group_size = '2-8',
  destinations = ARRAY['Cairo']::text[],
  seo_title = 'Cairo Citadel Mosque Tour | Islamic Heritage',
  meta_description = 'Private tour of the Citadel of Saladin, Muhammad Ali Mosque, Sultan Hassan Mosque, and Ibn Tulun Mosque, Cairo''s oldest, with a guide and lunch included.',
  focus_keyword = 'Cairo Citadel Mosque Tour',
  canonical_url = 'https://iluxuryegypt.com/cairo-tour-islamic-cairo-private-heritage-tour',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'cairo-tour-islamic-cairo-private-heritage-tour';

-- ============================================================
-- Pyramids Hot Air Balloon at Sunrise  (slug: pyramids-balloon-sunrise)
-- ============================================================
UPDATE tours SET
  title = 'Pyramids Hot Air Balloon at Sunrise',
  description = '<p>A Pyramids Hot Air Balloon Sunrise Tour puts you above the Giza Plateau at the one time of day when the desert light is at its best — the hour just after sunrise, when long shadows fall across the sand and the Pyramids catch the first color of the day.</p><p>Pickup is well before dawn, since timing is everything: balloon flights depend on calm morning air, and the crew will confirm conditions before you head to the launch site. Once airborne, the flight covers roughly an hour, drifting over the pyramid complex and the desert beyond, with the Sphinx and the edge of the city visible from altitude — a perspective on Giza that isn''t available from the ground.</p><p>A licensed pilot handles the flying and narrates the route; a full safety briefing is given before boarding. After landing, there''s a short toast with refreshments and a printed flight certificate before the drive back to your hotel in time for breakfast. Because it depends on weather, this experience is best booked with a flexible morning.</p>',
  itinerary = '[{"day":1,"lat":29.9752811,"lng":31.1375124,"image":"/api/assets/uploads/7a05512a-9bbc-47e8-9fc4-5585bf629a84.webp","meals":["Breakfast"],"title":"Day 1 | Cairo – Sunrise Balloon Flight Over Pyramids","imageAlt":"Sunrise hot air balloon flight at the Pyramids of Giza with panoramic views over the Nile Valley","placeName":"Pyramids of Giza","activities":[],"description":"Pickup is before dawn, timed to reach the launch site near Giza while it''s still dark. After a safety briefing, you board a private hot air balloon as the crew prepares for lift-off. As the balloon rises, the first light catches the Pyramids and the surrounding desert, with the view opening up over the Sphinx and the edge of Cairo in the distance. The flight lasts about an hour, drifting with the wind at a gentle pace. After landing, the crew offers refreshments and a flight certificate before the drive back to your hotel for breakfast."}]'::jsonb,
  includes = ARRAY['Private vehicle with professional driver', 'Private hot air balloon flight (approximately 1 hour)', 'Expert licensed pilot and professional crew', 'Comprehensive safety briefing and equipment', 'Flight certificate', 'Light refreshments post-flight', 'Hotel pickup and drop-off (Cairo/Giza)', 'All taxes, permits, and insurance']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses', 'Travel insurance']::text[],
  duration = '3 hours',
  duration_days = 1,
  group_size = '2-6',
  destinations = ARRAY['Giza']::text[],
  seo_title = 'Pyramids Hot Air Balloon Sunrise Tour | Cairo',
  meta_description = 'Private sunrise hot air balloon flight over the Giza Pyramids, with a licensed pilot, safety briefing, flight certificate, and hotel transfers included.',
  focus_keyword = 'Pyramids Hot Air Balloon Sunrise Tour',
  canonical_url = 'https://iluxuryegypt.com/pyramids-balloon-sunrise',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'pyramids-balloon-sunrise';

-- ============================================================
-- GEM Behind-the-Scenes VIP Tour  (slug: gem-vip-behind-scenes)
-- ============================================================
UPDATE tours SET
  title = 'GEM Behind-the-Scenes VIP Tour',
  description = '<p>A Grand Egyptian Museum VIP Tour goes beyond the public galleries into the parts of the museum built for preservation rather than display. Conservation labs, normally off-limits, are where specialists examine and stabilize artifacts using equipment rarely seen by visitors — a curator walks you through what''s involved in keeping objects thousands of years old stable enough to exhibit.</p><p>You''ll also see storage rooms holding pieces not yet on public view, and get a sense of how the museum''s cataloging system works. From there, a private curator takes over for the main collection, with particular focus on Tutankhamun''s treasures — displayed here in full for the first time, over five thousand objects including the gold mask, the sarcophagi, and the young king''s chariots — alongside the royal mummies and the museum''s largest statues, viewed with commentary that goes further than a standard visit allows.</p><p>Lunch is served at the museum''s own restaurant, with views toward the Pyramids. It''s a longer, more detailed day than a typical museum visit, built for travelers who want the full picture rather than the highlights.</p>',
  itinerary = '[{"day":1,"lat":29.9945754,"lng":31.1190738,"image":"/api/assets/uploads/ca22ab3f-37ef-432e-a3b5-7da657edbb9e.webp","meals":["Lunch"],"title":"Day 1 | Cairo – Conservation Labs & Restricted Access, Private Curator Tour & King Tut Collection","imageAlt":"Grand Egyptian Museum''s Tutankhamun collection viewed with a private curator","placeName":"Grand Egyptian Museum","activities":[],"description":"Access begins in the Grand Egyptian Museum''s conservation labs, normally closed to visitors, where a curator explains how specialists clean, stabilize, and study artifacts before they go on display. You''ll also see storage areas holding objects not yet exhibited, and learn how the museum catalogs new finds. A private curator then leads you through the main galleries, focusing on the complete Tutankhamun collection — more than five thousand objects shown together for the first time — along with the royal mummies and the museum''s largest statues. Lunch follows at the museum''s own restaurant, which looks out toward the Pyramids."}]'::jsonb,
  includes = ARRAY['Private vehicle with professional driver', 'Private museum curator guide', 'VIP Grand Egyptian Museum access', 'Restricted conservation lab access', 'Exclusive King Tut collection viewing', 'Lunch at the museum''s premium restaurant', 'Bottled mineral water and refreshments', 'Hotel pickup and drop-off (Cairo/Giza)', 'All taxes and special permits']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses', 'Travel insurance']::text[],
  duration = '8 hours',
  duration_days = 1,
  group_size = '2-6',
  destinations = ARRAY['Cairo', 'Giza']::text[],
  seo_title = 'Grand Egyptian Museum VIP Tour | Behind the Scenes',
  meta_description = 'Private VIP tour of the Grand Egyptian Museum''s conservation labs and storage areas, plus the full Tutankhamun collection, with a curator and lunch.',
  focus_keyword = 'Grand Egyptian Museum VIP Tour',
  canonical_url = 'https://iluxuryegypt.com/gem-vip-behind-scenes',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'gem-vip-behind-scenes';

-- ============================================================
-- NMEC & Old Cairo Luxury Day Tour  (slug: nmec-old-cairo)
-- ============================================================
UPDATE tours SET
  title = 'NMEC & Old Cairo Luxury Day Tour',
  description = '<p>This NMEC Old Cairo Tour pairs one of Cairo''s newest museums with some of its oldest streets. The National Museum of Egyptian Civilization, opened in the historic Fustat district, covers seven thousand years of Egyptian life in a single, well-paced set of galleries — textiles, everyday objects, and jewelry sit alongside its main draw, the Royal Mummies Hall, where twenty pharaohs and queens rest in specially designed display cases.</p><p>From the museum, the day moves to the Citadel of Saladin, a 12th-century fortress crowned by the 19th-century Muhammad Ali Mosque, whose pale alabaster walls give it its local name, the Alabaster Mosque, and whose terraces offer one of the best views in the city.</p><p>The final stop is Khan El Khalili, the market that has occupied this stretch of Cairo since the 14th century, where a guide can point you toward the coppersmiths, perfume blenders, and jewelers still working the traditional way rather than for tourists. Lunch, at a restaurant along the way, breaks up a day that moves from museum displays to a living, working part of the city.</p>',
  itinerary = '[{"day":1,"meals":["Lunch"],"title":"Day 1 | Cairo – National Museum of Egyptian Civilization & Old Cairo Heritage District","placeName":"National Museum of Egyptian Civilization","imageAlt":"The Royal Mummies Hall at the National Museum of Egyptian Civilization","activities":[],"description":"The National Museum of Egyptian Civilization, in the old district of Fustat, traces Egyptian life from prehistory to the present across a series of well-organized galleries. Its centerpiece is the Royal Mummies Hall, where 20 pharaohs and queens are displayed in climate-controlled cases. From there, continue to the Citadel of Saladin and its Muhammad Ali Mosque, known locally as the Alabaster Mosque for its pale stone walls. The afternoon moves into Khan El Khalili, where you can watch coppersmiths, perfume blenders, and jewelers still working by hand in the same alleys as generations before them. Lunch is included."}]'::jsonb,
  includes = ARRAY['Private vehicle with professional driver', 'Expert Egyptologist guide (English-speaking)', 'National Museum of Egyptian Civilization entrance', 'Royal Mummies Hall admission', 'Citadel of Saladin and mosque entrance fees', 'Lunch at a local restaurant', 'Bottled mineral water and refreshments', 'Hotel pickup and drop-off (Cairo/Giza)', 'All taxes and service charges']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses', 'Travel insurance']::text[],
  duration = '8 hours',
  duration_days = 1,
  group_size = '2-8',
  destinations = ARRAY['Cairo']::text[],
  seo_title = 'NMEC Old Cairo Tour | Museum, Citadel & Bazaar',
  meta_description = 'Private tour combining the National Museum of Egyptian Civilization''s Royal Mummies Hall with the Citadel of Saladin and Khan El Khalili, lunch included.',
  focus_keyword = 'NMEC Old Cairo Tour',
  canonical_url = 'https://iluxuryegypt.com/nmec-old-cairo',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'nmec-old-cairo';

-- ============================================================
-- Coptic Cairo & Hanging Church Tour  (slug: coptic-cairo-tour)
-- ============================================================
UPDATE tours SET
  title = 'Coptic Cairo & Hanging Church Tour',
  description = '<p>A Coptic Cairo Tour covers a small area with an unusually dense concentration of religious history, all within walking distance inside the walls of the old Roman fortress of Babylon. The Hanging Church, suspended above the fortress''s gatehouse, is one of Egypt''s oldest churches, its interior lined with icons and carved wood screens dating back centuries.</p><p>Close by, the Church of St. Sergius marks the traditional site where the Holy Family is said to have sheltered during their flight into Egypt. The Ben Ezra Synagogue, a short walk further, is where a 19th-century discovery of thousands of preserved documents — known as the Cairo Geniza — gave historians an unmatched record of Jewish life in medieval Egypt.</p><p>The Coptic Museum, housing the largest collection of Coptic art, textiles, and manuscripts in the world, rounds out the visit with pieces spanning the earliest centuries of Christianity in Egypt through the Islamic period. A guide familiar with the district''s layered religious history leads the way, with lunch at a nearby restaurant closing out the morning.</p>',
  itinerary = '[{"day":1,"lat":30.0052552,"lng":31.2300307,"meals":["Lunch"],"title":"Day 1 | Cairo – Coptic Cairo Complex, Ben Ezra Synagogue & Coptic Museum","placeName":"Hanging Church","imageAlt":"The Hanging Church''s icons and carved wood screens in Coptic Cairo","activities":[],"description":"The Hanging Church, built above the gatehouse of the old Roman fortress of Babylon, is the starting point for this walk through Coptic Cairo. Nearby, the Church of St. Sergius marks the site where tradition says the Holy Family sheltered during their time in Egypt. The Ben Ezra Synagogue, where a 19th-century discovery of hidden manuscripts known as the Geniza rewrote parts of Jewish-Egyptian history, is a short walk away. The Coptic Museum, with the largest collection of Coptic art and manuscripts anywhere, completes the visit. Lunch follows at a restaurant nearby."}]'::jsonb,
  includes = ARRAY['Private vehicle with professional driver', 'Expert religious history guide (English-speaking)', 'All Coptic Cairo entrance fees (churches, synagogue, museum)', 'Coptic Museum admission', 'Lunch at a local restaurant', 'Bottled mineral water and refreshments', 'Hotel pickup and drop-off (Cairo/Giza)', 'All taxes and service charges']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses', 'Travel insurance']::text[],
  duration = '6 hours',
  duration_days = 1,
  group_size = '2-8',
  destinations = ARRAY['Cairo']::text[],
  seo_title = 'Coptic Cairo Tour | Hanging Church & Ben Ezra Synagogue',
  meta_description = 'Private walking tour of Coptic Cairo: the Hanging Church, Ben Ezra Synagogue, and the Coptic Museum, with a guide and lunch at a nearby restaurant.',
  focus_keyword = 'Coptic Cairo Tour',
  canonical_url = 'https://iluxuryegypt.com/coptic-cairo-tour',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'coptic-cairo-tour';

-- ============================================================
-- Luxury Nile Felucca Sailing Private Cairo Tour  (slug: private-nile-sunset-felucca)
-- ============================================================
UPDATE tours SET
  title = 'Luxury Nile Felucca Sailing Private Cairo Tour',
  description = '<p>A Nile Felucca Sailing Cairo tour is the simplest way to see the city from the water, using a wooden sailboat design that hasn''t changed much since it first appeared on the river centuries ago. There''s no engine and no fixed schedule — your captain reads the wind and current, which means every sail moves at its own pace rather than a set route.</p><p>Reclining on cushioned seating, you''ll pass Cairo''s riverside skyline: bridges, mosque minarets, and the gardens of older neighborhoods that back onto the Nile. The crew serves pastries, fruit, tea, and cold drinks throughout, timed so that the strongest light of the evening — the hour when the water turns amber and rose and the skyline is lit gold — falls in the middle of the sail rather than at the start or the end.</p><p>Traditional music plays softly in the background. At around two hours, it''s a shorter outing than a full day tour, well suited as an evening add-on rather than a stand-alone day.</p>',
  itinerary = '[{"day":1,"lat":30.0443879,"lng":31.2357257,"image":"/api/assets/uploads/227f0e28-dd3a-4375-b586-4d4e5125cb6a.webp","title":"Day 1 | Cairo – Private Felucca Sailing","imageAlt":"Private felucca sail at Cairo with a private crew and traditional sailing rig","placeName":"Cairo","meals":[],"activities":[],"description":"Board a traditional felucca at a quiet mooring point along the Nile, fitted out with cushioned seating for comfort. Your captain explains how these wooden sailboats have worked the river for generations, relying on wind alone. As you set off, Cairo''s skyline slides past — bridges, mosques, and riverside gardens — while the crew serves pastries, fresh fruit, tea, and cold drinks. Around sunset, the water takes on shades of amber and rose, with the city''s minarets silhouetted against the sky. The sail lasts about two hours, with traditional music playing quietly in the background."}]'::jsonb,
  includes = ARRAY['Private vehicle with professional driver', 'Private traditional felucca with luxury appointments', 'Experienced captain and crew', 'Pastries, fruit, and beverages', 'Traditional music and ambient atmosphere', 'Hotel pickup and drop-off (Cairo/Giza)', 'All taxes and service charges']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses', 'Travel insurance']::text[],
  duration = '3 hours',
  duration_days = 1,
  group_size = '2-8',
  destinations = ARRAY['Cairo']::text[],
  seo_title = 'Nile Felucca Sunset Cairo | Private Sailing Tour',
  meta_description = 'Private traditional felucca sail on the Nile at sunset in Cairo, with a captain and crew, pastries and refreshments, and about two hours on the water.',
  focus_keyword = 'Nile Felucca Sailing Cairo Tour',
  canonical_url = 'https://iluxuryegypt.com/private-nile-sunset-felucca',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'private-nile-sunset-felucca';

-- ============================================================
-- Cairo Highlights Pyramids, Citadel & Khan El Khalili  (slug: day-tour-from-cairo-pyramids-citadel-khan-el-khalili-full-day-adventure)
-- ============================================================
UPDATE tours SET
  title = 'Cairo Highlights Pyramids, Citadel & Khan El Khalili',
  description = '<p>This Cairo Pyramids Day Tour is a private, full-day journey through the layers of history that define Egypt''s capital. Beginning at the Giza Plateau, an expert Egyptologist guide leads you past the Pyramids of Khufu, Khafre, and Menkaure before bringing you face to face with the Great Sphinx — with privileged access that avoids the tourist crowds.</p><p>From there, travel in air-conditioned comfort to the Citadel of Saladin, where the alabaster domes of the Muhammad Ali Mosque frame sweeping views across Cairo''s skyline. The afternoon unfolds in Khan El Khalili, the city''s 14th-century bazaar, where master craftsmen still practice traditional trades in its historic, lantern-lit alleyways. A refined lunch at a distinguished local restaurant punctuates the day, giving you a genuine taste of contemporary Egyptian cuisine between sites.</p><p>Every detail — private transport, a dedicated guide, and a pace set entirely by you — is arranged for travelers who want Cairo''s essential landmarks without compromising on comfort or exclusivity. It''s a single day that spans over 4,500 years of history, from the age of the pharaohs to the Ottoman era, ending with the living heritage of one of the Middle East''s oldest markets.</p>',
  itinerary = '[{"day":1,"meals":["Lunch"],"title":"Day 1 | Cairo – Giza Pyramids & Sphinx, Citadel & Khan El Khalili","placeName":"Giza Pyramids","activities":[],"description":"Begin at the Giza Plateau, where a private Egyptologist guide leads you through the Pyramids of Khufu, Khafre, and Menkaure before an intimate viewing of the Great Sphinx. Travel in air-conditioned comfort to the Citadel of Saladin, home to the domed Muhammad Ali Mosque and sweeping views over Cairo. Conclude at Khan El Khalili, the 14th-century bazaar where master craftsmen still work its historic alleyways. Enjoy a refined lunch at a distinguished local restaurant along the way, with personalized attention throughout this full-day journey through Cairo''s ancient and Ottoman heritage.","imageAlt":"The Pyramids of Khufu, Khafre, and Menkaure with the Great Sphinx at Giza"}]'::jsonb,
  includes = ARRAY['Private air-conditioned vehicle', 'Private Egyptologist guide', 'Giza Pyramids & Sphinx entrance fees', 'Citadel of Saladin & Muhammad Ali Mosque admission', 'Guided exploration of Khan El Khalili bazaar', 'Gourmet lunch at a local restaurant', 'Bottled water & refreshments', 'Hotel pickup and drop-off', 'All taxes and service charges']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses', 'Travel insurance']::text[],
  duration = '8 hours',
  duration_days = 1,
  group_size = '2-8',
  destinations = ARRAY['Cairo', 'Giza']::text[],
  seo_title = 'Cairo Pyramids Day Tour | Citadel & Khan El Khalili',
  meta_description = 'Private full-day Cairo tour to the Pyramids of Giza, Great Sphinx, Citadel of Saladin & Khan El Khalili bazaar. Expert Egyptologist guide, lunch included.',
  focus_keyword = 'Cairo Pyramids Day Tour',
  canonical_url = 'https://iluxuryegypt.com/day-tour-from-cairo-pyramids-citadel-khan-el-khalili-full-day-adventure',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'day-tour-from-cairo-pyramids-citadel-khan-el-khalili-full-day-adventure';

-- ============================================================
-- Private Helicopter Tour Cairo & Pyramids  (slug: cairo-helicopter-tour)
-- ============================================================
UPDATE tours SET
  title = 'Private Helicopter Tour Cairo & Pyramids',
  description = '<p>A Cairo Helicopter Tour is the fastest way to see how the city and the pyramids actually relate to each other geographically — something that''s hard to grasp from ground level. After a safety briefing, the helicopter lifts off and heads directly for Giza, where the Pyramids of Khufu, Khafre, and Menkaure appear as a precise, deliberate layout rather than three separate monuments, with the Great Sphinx visible just beside them.</p><p>The return leg follows the line of the Nile back into central Cairo, passing above the Egyptian Museum, the Citadel of Saladin, and Cairo Tower before landing at a hotel helipad. Champagne and a printed flight certificate mark the end of the flight.</p><p>At around thirty minutes in the air, it''s a short experience by design — less a full excursion than a fast, direct way to frame the rest of a Cairo trip, and it pairs well as an add-on to a ground-based pyramids tour rather than a replacement for one.</p>',
  itinerary = '[{"day":1,"lat":30.0146348,"lng":31.0721063,"image":"/api/assets/uploads/fc0c9f72-e3a0-41ab-a009-a2fc1f5d1160.webp","meals":[],"title":"Day 1 | Cairo — Private Helicopter Flight Over the Pyramids","imageAlt":"Aerial view of the Giza Pyramids from a private helicopter","placeName":"Pyramids of Giza","activities":[],"description":"After a safety briefing at the helipad, your private helicopter lifts off toward Giza. From the air, the geometry of the Pyramids of Khufu, Khafre, and Menkaure is visible in a way it never is from the ground, along with the Great Sphinx beside them. The flight path follows the Nile back into the city, passing over the Egyptian Museum, the Citadel, and Cairo Tower before landing at a hotel helipad. Champagne is served on arrival, along with a printed flight certificate. The full flight lasts about thirty minutes."}]'::jsonb,
  includes = ARRAY['Private vehicle with professional driver', 'Private luxury helicopter flight (30 minutes)', 'Expert licensed pilot and professional crew', 'Comprehensive safety briefing and equipment', 'Personalized flight certificate', 'Hotel pickup and drop-off (Cairo/Giza)', 'All taxes and special permits']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses', 'Travel insurance']::text[],
  duration = '2 hours',
  duration_days = 1,
  group_size = '2-4',
  destinations = ARRAY['Cairo', 'Giza']::text[],
  seo_title = 'Cairo Helicopter Tour | Private Flight Over the Pyramids',
  meta_description = 'Private 30-minute helicopter flight over the Giza Pyramids and Great Sphinx, tracing the Nile past central Cairo landmarks, with champagne on landing.',
  focus_keyword = 'Cairo Helicopter Tour',
  canonical_url = 'https://iluxuryegypt.com/cairo-helicopter-tour',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'cairo-helicopter-tour';

-- ============================================================
-- Luxury Nile Dinner Cruise & Show  (slug: cairo-nile-dinner-cruise)
-- ============================================================
UPDATE tours SET
  title = 'Luxury Nile Dinner Cruise & Show',
  description = '<p>A Cairo Nile Dinner Cruise covers dinner and a full evening of entertainment in one outing, on a boat that spends about two hours moving slowly along the river. Dinner is a buffet, mixing Egyptian dishes with Mediterranean and international dishes, served at a reserved table with river views and soft drinks included for the whole cruise.</p><p>The entertainment runs through most of the evening: a Tanoura performer spinning through the traditional Sufi-inspired routine, a belly dancing set, and folkloric numbers, all backed by a live band rather than recorded music. Outside, Cairo''s skyline is lit for the night — the Cairo Tower, the bridges crossing the Nile, and the buildings lining the riverbank slide past as the boat moves.</p><p>It''s a straightforward format — dinner, a show, and the river — that works well as an evening activity after a full day of sightseeing rather than a full day itself, and needs no advance planning beyond the reservation.</p>',
  itinerary = '[{"day":1,"lat":30.0443879,"lng":31.2357257,"image":"/api/assets/uploads/947f1951-086a-45b2-8453-49822ed574a6.webp","title":"Day 1 | Cairo – Nile Dinner Cruise","imageAlt":"Private dinner cruise on the Nile at Cairo with live entertainment","placeName":"Cairo","meals":["Dinner"],"activities":[],"description":"Board your reserved table on a Nile cruise boat as it sets off for a two-hour dinner cruise along the river. Dinner is served buffet-style, mixing Egyptian dishes with Mediterranean and international options, with soft drinks included throughout. Live entertainment runs for most of the evening: a Tanoura dancer performing the traditional spinning routine, a belly dance set, and folkloric numbers backed by a live band. Outside, Cairo passes by lit up for the night — the Cairo Tower, the city''s bridges, and riverside buildings along the water."}]'::jsonb,
  includes = ARRAY['Private vehicle with professional driver', 'Reserved table on a premium cruise vessel', 'Buffet dinner with Egyptian and international dishes', 'Unlimited soft beverages throughout cruise', 'Traditional entertainment (Tanoura, belly dancing, folkloric show)', 'Live band performance', 'Hotel pickup and drop-off (Cairo/Giza)', 'All taxes and service charges']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses', 'Travel insurance']::text[],
  duration = '3 hours',
  duration_days = 1,
  group_size = '2-8',
  destinations = ARRAY['Cairo']::text[],
  seo_title = 'Cairo Nile Dinner Cruise | Dinner & Live Show',
  meta_description = 'Two-hour Nile dinner cruise in Cairo with an international buffet, Tanoura and belly dance shows, live band, and views of the city lit up at night.',
  focus_keyword = 'Cairo Nile Dinner Cruise',
  canonical_url = 'https://iluxuryegypt.com/cairo-nile-dinner-cruise',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'cairo-nile-dinner-cruise';

-- ============================================================
-- Alexandria Luxury Day Trip from Cairo  (slug: alexandria-from-cairo)
-- ============================================================
UPDATE tours SET
  title = 'Alexandria Luxury Day Trip from Cairo',
  description = '<p>An Alexandria Day Trip from Cairo trades the desert and pharaonic monuments of most Egypt tours for something different: a Mediterranean port city built by the Greeks, ruled by Rome, and shaped since by every power that controlled the eastern Mediterranean. The Bibliotheca Alexandrina, opened in 2002 as a modern successor to the ancient Library of Alexandria, anchors the day, its manuscript collections and exhibitions giving a sense of the city''s intellectual history.</p><p>From there, the Roman Amphitheater — the only one of its kind still standing in Egypt — and the third-century granite column known as Pompey''s Pillar cover the Roman period. The Qaitbay Citadel, a 15th-century fortress built on the exact site of the ancient Lighthouse of Alexandria, one of the Seven Wonders of the Ancient World, sits at the harbor mouth with sweeping Mediterranean views.</p><p>A walk along the Corniche and through the gardens of Montazah Palace rounds out the afternoon before a seafood lunch by the water. Given the drive, this is a longer day than an in-Cairo tour, best suited to travelers with a full day free.</p>',
  itinerary = '[{"day":1,"lat":31.2086605,"lng":29.9089329,"image":"/api/assets/uploads/8855c6f7-a7eb-4cc3-825f-565bb10b1b61.webp","meals":["Lunch"],"title":"Day 1 | Alexandria – Bibliotheca Alexandrina, Roman Heritage, Citadel & Corniche","imageAlt":"The Bibliotheca Alexandrina''s modern library building in Alexandria","placeName":"Bibliotheca Alexandrina","activities":[],"description":"The coastal drive from Cairo takes a little under three hours, arriving at the Bibliotheca Alexandrina, a modern library built as a tribute to the ancient Library of Alexandria. From there, visit the Roman Amphitheater, the only Roman theater still standing in Egypt, and Pompey''s Pillar, a third-century granite column. The Qaitbay Citadel, built on the site of the ancient Lighthouse of Alexandria, one of the Seven Wonders of the Ancient World, looks out over the Mediterranean. After walking the Corniche and seeing the gardens of Montazah Palace, lunch is served at a seafood restaurant by the water."}]'::jsonb,
  includes = ARRAY['Private vehicle with professional driver', 'Expert guide specializing in Greco-Roman history', 'Bibliotheca Alexandrina and all site entrance fees', 'Qaitbay Citadel and Montazah Palace admission', 'Seafood lunch at a premium restaurant', 'Bottled mineral water and refreshments', 'Hotel pickup and drop-off (Cairo/Giza)', 'All taxes and service charges']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses', 'Travel insurance']::text[],
  duration = '10 hours',
  duration_days = 1,
  group_size = '2-8',
  destinations = ARRAY['Alexandria']::text[],
  seo_title = 'Alexandria Day Trip from Cairo | Private Tour',
  meta_description = 'Private day trip from Cairo to Alexandria, covering the Bibliotheca Alexandrina, Qaitbay Citadel, Roman Amphitheater, and a seafood lunch by the sea.',
  focus_keyword = 'Alexandria Day Trip from Cairo',
  canonical_url = 'https://iluxuryegypt.com/alexandria-from-cairo',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'alexandria-from-cairo';

-- ============================================================
-- Egyptian Museum & Downtown Cairo Tour  (slug: egyptian-museum-downtown)
-- ============================================================
UPDATE tours SET
  title = 'Egyptian Museum & Downtown Cairo Tour',
  description = '<p>An Egyptian Museum Downtown Cairo Tour splits the day between two very different collections: one behind glass, the other built into the streets themselves. The Egyptian Museum in Tahrir Square, still the single largest collection of pharaonic artifacts anywhere despite the newer Grand Egyptian Museum''s opening, holds around 120,000 objects, among them Tutankhamun''s gold mask and sarcophagi and a hall of preserved royal mummies — a guide familiar with the collection can point out pieces easy to miss in a museum this size.</p><p>Outside, downtown Cairo''s Belle Époque district was largely built in the early 20th century, when European-trained architects designed much of the area around Talaat Harb Street and the Cairo Opera House, giving central Cairo a distinct look that survives despite decades of change.</p><p>Café Riche, open since the early 1900s and a longtime meeting place for writers and political figures, is worth a stop along the walk. Lunch, at a restaurant in the same downtown streets, closes out the afternoon.</p>',
  itinerary = '[{"day":1,"lat":30.0479664,"lng":31.2336093,"image":"/api/assets/uploads/9720e9f8-04a4-4290-ab18-78d32a0246a2.webp","meals":["Lunch"],"title":"Day 1 | Cairo – Egyptian Museum Tahrir & Downtown Cairo Heritage","imageAlt":"Tutankhamun''s treasures inside the Egyptian Museum, Tahrir Square","placeName":"Egyptian Museum","activities":[],"description":"The Egyptian Museum in Tahrir Square holds around 120,000 artifacts spanning five thousand years, including Tutankhamun''s gold mask, sarcophagi, and jewelry, alongside a hall of royal mummies. From there, walk through downtown Cairo''s Belle Époque district, built in the early 20th century when European architects shaped much of the area around Talaat Harb Street and the Cairo Opera House. Café Riche, a longtime meeting place for writers and political figures, is a stop along the way. Lunch follows at a restaurant in the same downtown district."}]'::jsonb,
  includes = ARRAY['Private vehicle with professional driver', 'Expert Egyptologist guide (English-speaking)', 'Egyptian Museum entrance and Tutankhamun galleries', 'Guided downtown Cairo architectural tour', 'Lunch at a local restaurant', 'Bottled mineral water and refreshments', 'Hotel pickup and drop-off (Cairo/Giza)', 'All taxes and service charges']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses', 'Travel insurance']::text[],
  duration = '7 hours',
  duration_days = 1,
  group_size = '2-8',
  destinations = ARRAY['Cairo']::text[],
  seo_title = 'Egyptian Museum Downtown Cairo Tour | Tahrir & Belle Époque',
  meta_description = 'Private tour of the Egyptian Museum in Tahrir Square, home to Tutankhamun''s treasures, followed by a walk through downtown Cairo''s Belle Époque district.',
  focus_keyword = 'Egyptian Museum Downtown Cairo Tour',
  canonical_url = 'https://iluxuryegypt.com/egyptian-museum-downtown',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'egyptian-museum-downtown';

-- ============================================================
-- Giza Pyramids, Memphis & Sphinx Tour  (slug: giza-saqqara-memphis)
-- ============================================================
UPDATE tours SET
  title = 'Giza Pyramids, Memphis & Sphinx Tour',
  description = '<p>A Giza Memphis Sphinx Tour connects the two halves of Old Kingdom Egypt that are usually seen separately: the pyramids where pharaohs were buried, and the city where they actually ruled. At Giza, the Pyramids of Khufu, Khafre, and Menkaure remain the largest stone structures built anywhere in the ancient world, with the Great Sphinx — carved directly from the plateau''s bedrock rather than built from blocks — standing guard nearby.</p><p>Memphis, a short drive away, was Egypt''s capital for most of the Old and Middle Kingdoms, though little of the ancient city survives above ground; what remains is concentrated in an open-air museum, centered on a fallen colossus of Ramses II housed under a covered pavilion and a second, smaller sphinx carved from alabaster.</p><p>A guide draws the connection between the two sites directly — Memphis as the administrative and religious capital, Giza as the necropolis built for its rulers just across the Nile. Lunch is included, with private transport handling the roughly thirty-minute drive between sites.</p>',
  itinerary = '[{"day":1,"lat":29.9752811,"lng":31.1375124,"image":"/api/assets/uploads/43f58122-2fee-49f4-8c22-2b9fbc9ec671.webp","meals":["Lunch"],"title":"Day 1 | Cairo – Giza Pyramids Complex & Ancient Memphis","imageAlt":"The Great Sphinx and Pyramids of Giza","placeName":"Great Sphinx","activities":[],"description":"The Pyramids of Khufu, Khafre, and Menkaure anchor the morning at Giza, followed by a close look at the Great Sphinx carved from the plateau''s limestone bedrock. From there, drive to Memphis, capital of Egypt for much of the Old and Middle Kingdoms, where a fallen colossus of Ramses II lies under a covered pavilion and a smaller alabaster sphinx stands nearby in the open-air museum grounds. A guide covers how the two sites relate — Memphis as the seat of power, Giza as its royal burial ground just across the river. Lunch is included."}]'::jsonb,
  includes = ARRAY['Private vehicle with professional driver', 'Expert Egyptologist guide (English-speaking)', 'Giza Pyramids complex entrance fees', 'Great Sphinx viewing access', 'Memphis open-air museum admission', 'Lunch at a local restaurant', 'Bottled mineral water and refreshments', 'Hotel pickup and drop-off (Cairo/Giza)', 'All taxes and service charges']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses', 'Travel insurance']::text[],
  duration = '8 hours',
  duration_days = 1,
  group_size = '2-8',
  destinations = ARRAY['Giza', 'Cairo']::text[],
  seo_title = 'Giza Memphis Sphinx Tour | Pyramids & Ancient Capital',
  meta_description = 'Private day tour of the Giza Pyramids and Great Sphinx paired with ancient Memphis, Egypt''s Old Kingdom capital, with a guide and lunch included.',
  focus_keyword = 'Giza Memphis Sphinx Tour',
  canonical_url = 'https://iluxuryegypt.com/giza-saqqara-memphis',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'giza-saqqara-memphis';

-- ============================================================
-- Grand Egyptian Museum & Khan Khalili  (slug: gem-khan-khalili)
-- ============================================================
UPDATE tours SET
  title = 'Grand Egyptian Museum & Khan Khalili',
  description = '<p>A Grand Egyptian Museum Khan El Khalili Tour pairs Egypt''s newest museum with one of Cairo''s oldest markets. The museum''s collection, over 100,000 objects, spans the full length of ancient Egyptian history — from the Narmer Palette, among the earliest known records of Egypt unified under a single ruler, through to the complete set of grave goods recovered from Tutankhamun''s tomb, shown together for the first time since 1922.</p><p>A guide focuses the visit on the most significant pieces rather than attempting the entire collection in one pass. From there, the day moves into Khan El Khalili, a market that has operated on this site since the 14th century, where the trades on display — copper engraving, perfume blending, jewelry making, carpet weaving — are largely unchanged from their medieval origins, close to the Al-Hussein Mosque.</p><p>Lunch is served at a restaurant overlooking the bazaar''s rooftops, a practical midpoint between the museum''s controlled galleries and the market''s open-air pace.</p>',
  itinerary = '[{"day":1,"lat":29.9945754,"lng":31.1190738,"image":"/api/assets/uploads/ca22ab3f-37ef-432e-a3b5-7da657edbb9e.webp","meals":["Lunch"],"title":"Day 1 | Cairo – Grand Egyptian Museum & Khan El Khalili Bazaar","imageAlt":"Grand Egyptian Museum''s ancient Egyptian collection","placeName":"Grand Egyptian Museum","activities":[],"description":"The Grand Egyptian Museum''s collection runs to more than 100,000 artifacts, from the Narmer Palette, one of the earliest surviving records of a unified Egypt, to the full set of Tutankhamun''s grave goods. A guide highlights key pieces across the main galleries before the day shifts to Khan El Khalili, the market that has stood in this part of Islamic Cairo since the 14th century. Its narrow lanes still hold working coppersmiths, perfume blenders, jewelers, and carpet weavers, close to the Al-Hussein Mosque. Lunch is served at a restaurant overlooking the bazaar."}]'::jsonb,
  includes = ARRAY['Private vehicle with professional driver', 'Expert Egyptologist guide (English-speaking)', 'Grand Egyptian Museum entrance', 'Khan El Khalili guided exploration', 'Lunch at a restaurant overlooking the bazaar', 'Bottled mineral water and refreshments', 'Hotel pickup and drop-off (Cairo/Giza)', 'All taxes and service charges']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses', 'Travel insurance']::text[],
  duration = '8 hours',
  duration_days = 1,
  group_size = '2-8',
  destinations = ARRAY['Cairo', 'Giza']::text[],
  seo_title = 'Grand Egyptian Museum Khan El Khalili Tour | Cairo',
  meta_description = 'Private tour combining the Grand Egyptian Museum''s Tutankhamun collection with the historic Khan El Khalili bazaar, with a guide and lunch included.',
  focus_keyword = 'Grand Egyptian Museum Khan El Khalili Tour',
  canonical_url = 'https://iluxuryegypt.com/gem-khan-khalili',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'gem-khan-khalili';

-- ============================================================
-- Giza, Saqqara & Memphis Discovery  (slug: giza-saqqara-memphis-discovery)
-- ============================================================
UPDATE tours SET
  title = 'Giza, Saqqara & Memphis Discovery',
  description = '<p>This Saqqara Memphis Giza Discovery Tour is built around a single question: how did the pyramid, as a shape, actually develop? The answer unfolds across three sites in roughly the order they were built. Saqqara comes first, where Djoser''s Step Pyramid, raised around 2670 BCE, was Egypt''s first large stone monument — a stack of mastabas rather than a true pyramid, surrounded by tombs whose walls still carry sharp, well-preserved reliefs of daily Old Kingdom life.</p><p>A century later at Giza, the design reaches its final, smooth-sided form in the Pyramids of Khufu, Khafre, and Menkaure, with the Great Sphinx carved from the plateau''s own bedrock nearby.</p><p>The day closes in Memphis, the capital these pyramids were built to serve, where a fallen colossus of Ramses II and a second, smaller alabaster sphinx sit in an open-air museum on part of the ancient city''s original site. Seeing all three in sequence, rather than as separate day trips, makes the progression from stepped to smooth pyramid design far easier to follow than reading about it beforehand. Lunch is included between sites.</p>',
  itinerary = '[{"day":1,"lat":29.9752811,"lng":31.1375124,"image":"/api/assets/uploads/43f58122-2fee-49f4-8c22-2b9fbc9ec671.webp","meals":["Lunch"],"title":"Day 1 | Cairo – Giza Pyramids Complex, Saqqara & Memphis","imageAlt":"The Great Sphinx and Giza Pyramids complex","placeName":"Great Sphinx","activities":[],"description":"Start at Giza to see the Pyramids of Khufu, Khafre, and Menkaure alongside the Great Sphinx, then continue south to Saqqara for the Step Pyramid of Djoser, the oldest large stone monument in Egypt, along with mastaba tombs decorated with scenes of daily life from the Old Kingdom. The route ends in Memphis, Egypt''s ancient capital, where a colossal fallen statue of Ramses II and a smaller alabaster sphinx are displayed in an open-air setting. Covering three sites in one day traces how pyramid design changed, from Saqqara''s stepped form to Giza''s smooth-sided design a century later. Lunch is included."}]'::jsonb,
  includes = ARRAY['Private vehicle with professional driver', 'Expert Egyptologist guide (English-speaking)', 'Giza Pyramids, Saqqara, and Memphis entrance fees', 'All site admissions and permits', 'Lunch at a local restaurant', 'Bottled mineral water and refreshments', 'Hotel pickup and drop-off (Cairo/Giza)', 'All taxes and service charges']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses', 'Travel insurance']::text[],
  duration = '8 hours',
  duration_days = 1,
  group_size = '2-8',
  destinations = ARRAY['Giza', 'Cairo']::text[],
  seo_title = 'Saqqara Memphis Giza Discovery Tour | Pyramid Evolution',
  meta_description = 'Private day tour tracing the evolution of pyramid design across Saqqara''s Step Pyramid, Giza''s Great Pyramids, and ancient Memphis, lunch included.',
  focus_keyword = 'Saqqara Memphis Giza Discovery Tour',
  canonical_url = 'https://iluxuryegypt.com/giza-saqqara-memphis-discovery',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'giza-saqqara-memphis-discovery';

-- ============================================================
-- Private Cairo Food & Culture Tour  (slug: gourmet-cairo-food-tour)
-- ============================================================
UPDATE tours SET
  title = 'Private Cairo Food & Culture Tour',
  description = '<p>A Cairo Food Tour is built around eating the way locals actually eat, rather than a fixed restaurant list. It starts in a neighborhood market, where a guide walks you past spice vendors, produce stalls, and bakeries pulling flatbread straight from wood-fired ovens, before a stop at a falafel stand for ta''meya — the Egyptian version made from fava beans rather than chickpeas, and the standard local breakfast.</p><p>From there, the day moves through a working cross-section of Cairo''s food scene: a kushari spot for the rice, lentil, and pasta dish considered Egypt''s national meal, a small eatery for mezze, and a traditional ahwa, or coffeehouse, for Egyptian coffee alongside desserts like kunafa and basbousa.</p><p>Depending on the day, the guide can also arrange a stop with an artisan food producer — a cheese maker, a pickle seller, or a sweet shop — for a closer look at how specific products are made. Lunch, at a local restaurant, rounds out the day. It''s paced for tasting rather than large portions, with plenty of stops along the way.</p>',
  itinerary = '[{"day":1,"lat":30.0443879,"lng":31.2357257,"image":"/api/assets/uploads/947f1951-086a-45b2-8453-49822ed574a6.webp","meals":["Breakfast","Lunch"],"title":"Day 1 | Cairo – Markets & Street Food, Traditional Tastings & Culture","imageAlt":"Spice vendors and market stalls in a Cairo food market","placeName":"Cairo","activities":[],"description":"The day starts at a local market, where a guide introduces Egypt''s everyday food culture — fresh spices, produce stalls, and bread straight from wood-fired ovens. A stop at a falafel stand serves ta''meya, the Egyptian version made from fava beans, for breakfast. Later stops include a kushari restaurant for Egypt''s national dish, a small eatery for mezze, and a traditional ahwa coffeehouse for coffee and desserts like kunafa and basbousa. Along the way, the guide can arrange visits to a cheese maker, pickle seller, or sweet shop. Lunch closes out the tour at a local restaurant."}]'::jsonb,
  includes = ARRAY['Private vehicle with professional driver', 'Expert culinary and culture guide', 'All food tastings and samples throughout tour', 'Traditional Egyptian coffee and desserts', 'Lunch at a local restaurant', 'Bottled mineral water and refreshments', 'Hotel pickup and drop-off (Cairo/Giza)', 'All taxes and service charges']::text[],
  excludes = ARRAY['Gratuities/tips', 'Personal expenses', 'Travel insurance']::text[],
  duration = '7 hours',
  duration_days = 1,
  group_size = '2-6',
  destinations = ARRAY['Cairo']::text[],
  seo_title = 'Cairo Food Tour | Private Markets & Culture Tour',
  meta_description = 'Private Cairo food tour through local markets, a falafel breakfast, kushari, mezze, and traditional coffeehouse desserts, with lunch included.',
  focus_keyword = 'Cairo Food Tour',
  canonical_url = 'https://iluxuryegypt.com/gourmet-cairo-food-tour',
  robots = 'index, follow',
  schema_type = 'TouristTrip',
  updated_at = now()
WHERE slug = 'gourmet-cairo-food-tour';

-- Review the output above (row counts, any 0-row UPDATE means a slug
-- mismatch) before committing.
COMMIT;
