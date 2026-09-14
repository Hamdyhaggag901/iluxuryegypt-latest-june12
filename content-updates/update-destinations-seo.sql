-- Part B of the destinations move: informational SEO copy for the six city
-- pages under /egypt-travel-guide.
--
-- RUN AFTER content-updates/update-destination-slugs.sql. Every WHERE below
-- keys on the NEW slug, so running this first would match nothing.
--
-- The tone here is deliberately informational rather than commercial. These
-- pages answer "what is there and when should I go"; the tours that sell
-- against those answers live under /luxury-egypt-tour-packages and keep their
-- own commercial copy.
--
-- Touches four columns only: description, seo_title, meta_description and
-- focus_keyword. attractions, faqs, highlights, gallery and hero_image are
-- left exactly as they are.
--
-- focus_keyword is not just metadata here. client/src/pages/destination-detail.tsx
-- renders the page H1 and the hero image alt from it (title-cased), which is
-- how the keyword reaches those two places without turning the short
-- destinations.name used on cards and breadcrumbs into a long phrase.
--
-- The generator that produced this file enforces, per city: seo_title within
-- 60 characters and containing the keyword, meta_description between 150 and
-- 160 and containing it, a description of 100 to 150 words with the keyword in
-- the first paragraph, at least one H2 or H3 carrying a variation, and no em
-- or en dashes anywhere.

BEGIN;

-- cairo-travel-guide
UPDATE destinations
SET
  description = '<p>This Cairo travel guide covers a city that holds far more than most visitors plan for. The Giza plateau sits on the western edge, the Grand Egyptian Museum a short drive from it, and the medieval core of Islamic Cairo several kilometres east, each needing the better part of a day.</p>
<h2>What a Cairo Egypt Travel Guide Should Cover First</h2>
<p>Start early. The plateau opens at eight and the light is best long before the coaches arrive, while the museum rewards a slower afternoon. Islamic Cairo suits the end of the day, when Al Muizz Street cools and the mosques empty out.</p>
<h3>How Long to Stay</h3>
<p>Three full days covers the essentials without rushing. A fourth leaves room for Saqqara and Dahshur, quieter than Giza and, for many people, more memorable.</p>',
  seo_title = 'Cairo Travel Guide | Pyramids, Museums and Old Cairo',
  meta_description = 'A Cairo travel guide to the Giza pyramids, the Grand Egyptian Museum and Islamic Cairo, with practical notes on timing, transport and how long each needs.',
  focus_keyword = 'cairo travel guide',
  updated_at = now()
WHERE slug = 'cairo-travel-guide';

-- attractions-in-luxor
UPDATE destinations
SET
  description = '<p>The attractions in Luxor divide neatly across the Nile. The east bank holds Karnak and Luxor Temple, both walkable from the corniche. The west bank holds the burial ground: the Valley of the Kings, the Valley of the Queens, Hatshepsut''s terraced temple and the artisan village at Deir el Medina.</p>
<h2>The Main Luxor Attractions by Bank</h2>
<p>Most itineraries give the west bank a full morning and the east bank an afternoon, which is workable but tight. Karnak alone can absorb three hours, and the painted tombs reward slow looking rather than a quick circuit of three.</p>
<h3>When to Visit These Luxor Egypt Attractions</h3>
<p>October through April is comfortable. Between June and September, start at sunrise and treat the middle of the day as rest.</p>',
  seo_title = 'Attractions in Luxor | Tombs, Temples and the West Bank',
  meta_description = 'The attractions in Luxor split across two banks of the Nile, from Karnak and the temple colonnades to the royal tombs, with notes on timing and pacing.',
  focus_keyword = 'attractions in luxor',
  updated_at = now()
WHERE slug = 'attractions-in-luxor';

-- aswan-egypt-attractions
UPDATE destinations
SET
  description = '<p>The Aswan Egypt attractions sit closer together than Luxor''s, and most are reached by water rather than road. Philae Temple stands on its own island, moved there stone by stone when the High Dam flooded its original site. Elephantine and the Nubian villages opposite are a short felucca crossing.</p>
<h2>Getting Between the Aswan Attractions</h2>
<p>A boat is the default here. The river is narrow and granite-strewn at Aswan, and the crossings between the corniche, the islands and the west bank take minutes rather than an hour of driving.</p>
<h3>Day Trips from Aswan</h3>
<p>Abu Simbel lies three hours south by road or a short flight. Among the attractions in Aswan reachable in half a day, the Unfinished Obelisk and the Nubian Museum are the ones most often skipped and least often regretted.</p>',
  seo_title = 'Aswan Egypt Attractions | Philae, Nubia and the Nile',
  meta_description = 'Aswan Egypt attractions from Philae Temple and the High Dam to Nubian villages and Elephantine Island, with notes on river transport and the best season.',
  focus_keyword = 'aswan egypt attractions',
  updated_at = now()
WHERE slug = 'aswan-egypt-attractions';

-- alexandria-egypt-attractions
UPDATE destinations
SET
  description = '<p>The Alexandria Egypt attractions belong to a different Egypt entirely. There are no pharaonic temples here. What survives is Greco-Roman and later: the catacombs of Kom el Shoqafa cut three levels into rock, the Roman theatre at Kom el Dikka, and Qaitbay Citadel standing where the Pharos lighthouse once did.</p>
<h2>Ancient and Modern Alexandria Egypt Tourist Attractions</h2>
<p>The Bibliotheca Alexandrina answers the ancient library rather than replacing it, and the corniche curving around the eastern harbour is the city''s own daily ritual.</p>
<h3>How Much Time to Allow</h3>
<p>The main tourist attractions in Alexandria Egypt fit into a long day from Cairo, though staying overnight lets you see the harbour at dusk, which is when the city is at its best.</p>',
  seo_title = 'Alexandria Egypt Attractions | Greco-Roman Coast',
  meta_description = 'Alexandria Egypt attractions from the catacombs and Roman theatre to the Bibliotheca Alexandrina, a Mediterranean city layered over its Greco-Roman past.',
  focus_keyword = 'alexandria egypt attractions',
  updated_at = now()
WHERE slug = 'alexandria-egypt-attractions';

-- things-to-do-in-hurghada
UPDATE destinations
SET
  description = '<p>The things to do in Hurghada start in the water. The Red Sea reefs here are among the most accessible in the world, and the Giftun Islands Marine Reserve, forty minutes offshore, is the usual destination for snorkelling and diving trips.</p>
<h2>Things to Do in Hurghada Egypt Beyond the Reef</h2>
<p>Inland, the Eastern Desert opens quickly. Half-day trips reach Bedouin settlements and the mountains behind the coast, and the light at either end of the day is worth the early start.</p>
<h3>When to Go</h3>
<p>Among Hurghada things to do, diving is year-round, though the water is warmest between May and October. The other attractions in Hurghada, the marina, the old town at El Dahar, and the fish markets, suit the cooler months.</p>',
  seo_title = 'Things to Do in Hurghada | Reefs, Islands and Desert',
  meta_description = 'Things to do in Hurghada beyond the beach, from Giftun Island snorkelling and reef diving to desert excursions, with notes on seasons and sea conditions.',
  focus_keyword = 'things to do in hurghada',
  updated_at = now()
WHERE slug = 'things-to-do-in-hurghada';

-- siwa-oasis-egypt
UPDATE destinations
SET
  description = '<p>Siwa Oasis Egypt lies in the Western Desert near the Libyan border, roughly eighteen metres below sea level and about ten hours by road from Cairo. It stayed largely cut off until a paved road reached it in the 1980s, and the isolation shows: Siwi, a Berber language, is still spoken here.</p>
<h2>What to See Around Egypt Siwa Oasis</h2>
<p>The mud-brick ruins of Shali rise over the town, the Temple of the Oracle sits at Aghurmi, and salt lakes and palm groves fill the basin between them. The Great Sand Sea begins at the edge of the cultivation.</p>
<h3>Getting There</h3>
<p>Check any Siwa Oasis Egypt map before travelling: the route runs via Marsa Matruh on the coast, not directly west from Cairo.</p>',
  seo_title = 'Siwa Oasis Egypt | Berber Desert Oasis Travel Guide',
  meta_description = 'Siwa Oasis Egypt sits near the Libyan border, a Berber settlement of salt lakes, mud-brick ruins and desert springs, with notes on getting there and when.',
  focus_keyword = 'siwa oasis egypt',
  updated_at = now()
WHERE slug = 'siwa-oasis-egypt';

COMMIT;

-- ---------------------------------------------------------------------------
-- Verification
-- ---------------------------------------------------------------------------
SELECT slug,
       length(seo_title) AS seo_len,
       length(meta_description) AS meta_len,
       focus_keyword,
       array_length(regexp_split_to_array(regexp_replace(description, '<[^>]+>', ' ', 'g'), '\s+'), 1) AS desc_words,
       position(lower(focus_keyword) in lower(regexp_replace(description, '<[^>]+>', ' ', 'g'))) AS kw_pos
FROM destinations
WHERE slug IN ('cairo-travel-guide', 'attractions-in-luxor', 'aswan-egypt-attractions', 'alexandria-egypt-attractions', 'things-to-do-in-hurghada', 'siwa-oasis-egypt')
ORDER BY slug;

-- Every row must be within limits and carry its keyword in all three fields.
SELECT 'rows failing a limit' AS check, count(*) AS bad
FROM destinations
WHERE slug IN ('cairo-travel-guide', 'attractions-in-luxor', 'aswan-egypt-attractions', 'alexandria-egypt-attractions', 'things-to-do-in-hurghada', 'siwa-oasis-egypt')
  AND (
    length(seo_title) > 60
    OR length(meta_description) NOT BETWEEN 150 AND 160
    OR position(lower(focus_keyword) in lower(seo_title)) = 0
    OR position(lower(focus_keyword) in lower(meta_description)) = 0
    OR position(lower(focus_keyword) in lower(regexp_replace(description, '<[^>]+>', ' ', 'g'))) = 0
  );

-- The columns this script must not have touched.
SELECT 'attractions or faqs emptied' AS check, count(*) AS bad
FROM destinations
WHERE slug IN ('cairo-travel-guide', 'attractions-in-luxor', 'aswan-egypt-attractions', 'alexandria-egypt-attractions', 'things-to-do-in-hurghada', 'siwa-oasis-egypt')
  AND (jsonb_array_length(attractions) = 0 OR jsonb_array_length(faqs) = 0);

SELECT 'em or en dash present' AS check, count(*) AS bad
FROM destinations
WHERE slug IN ('cairo-travel-guide', 'attractions-in-luxor', 'aswan-egypt-attractions', 'alexandria-egypt-attractions', 'things-to-do-in-hurghada', 'siwa-oasis-egypt')
  AND (description ~ '[\u2013\u2014]' OR seo_title ~ '[\u2013\u2014]' OR meta_description ~ '[\u2013\u2014]');
