-- What to See in Luxor: Two Days, Two Banks
-- Blog post 4 of 5. Primary keyword: what to see in luxor
--
-- Scheduled for 2026-09-29T09:00:00+03:00 via posts.scheduled_at, so it stays out of
-- the blog list, the sitemap and the server rendered meta until that moment.
-- See shared/post-visibility.ts for the rule.
--
-- RUN THE MIGRATION FIRST (Admin > Settings > Run Migrations). This needs
-- posts.scheduled_at, posts.faqs and posts.schema_markup.
--
-- Only the English columns are filled. title_es/fr/jp and body_es/fr/jp are
-- deliberately left NULL rather than machine translated.
--
-- Images are NOT set here. scripts/fill-post-images.ts fetches them, checks
-- each candidate against the provider's own description, and writes
-- featured_image plus the in-body figures. Run it after this file.

BEGIN;

INSERT INTO posts (
  slug, title_en, body_en, excerpt, category, tags,
  focus_keyword, meta_title, meta_description,
  status, scheduled_at, faqs, schema_type
) VALUES (
  'what-to-see-in-luxor',
  'What to See in Luxor: Two Days, Two Banks',
  '<p>Two days, one bank each, west first. That is the answer, and the rest of this article is why.</p>

<p>Most people arrive with one day and try to do both banks in it. It is possible. It is also the version where you are standing in the Valley of the Kings at eleven in the morning wishing you were anywhere cooler, and walking into Karnak at two with nothing left. Working out what to see in Luxor is really a question about time of day, not about which monuments are best.</p>

<h2>Why the Two Banks Are Not Interchangeable</h2>

<p>The ancient city ran on a simple logic. The east bank, where the sun rises, was for the living: temples, processions, the city itself. The west bank, where it sets, was for the dead: tombs cut into the hills, mortuary temples at their feet.</p>

<p>That division still shapes a visit, because it maps onto the weather. The west bank is desert, exposed, with no shade and a lot of climbing. The east bank temples are flat, walkable and partly shaded by their own columns.</p>

<p>So the west bank belongs to the early morning and the east bank to the late afternoon. Every good Luxor itinerary is built on that one fact.</p>

<h2>What to See in Luxor on Day One: The West Bank</h2>

<p>Leave at first light. The ticket offices open early and the difference between arriving at opening and arriving at nine is the difference between a pleasant morning and an endurance exercise.</p>

<p><strong>Valley of the Kings</strong> first, always. Your general ticket covers three tombs and choosing them well matters more than most guides admit. We wrote a whole piece on <a href="/blog/tombs-in-the-valley-of-kings">which three tombs to pick</a>, because it is the decision people most often get wrong.</p>

<p><strong>Hatshepsut''s temple at Deir el Bahari</strong> next. Three terraces built straight into a cliff, and from a distance it looks more like modern architecture than anything else in Egypt. It is also a heat trap by mid morning, with pale stone and no cover, so this is a second stop and not a third.</p>

<p><strong>Medinet Habu</strong> to finish. This is the one people skip and the one they should not. Ramesses III''s mortuary temple keeps more original paint than anywhere else on the west bank, and because the coaches do not stop here you will often have whole courtyards to yourself.</p>

<h2>What Else Is on the West Bank</h2>

<p>If you have appetite left, three more places are worth knowing about.</p>

<p>The <strong>Valley of the Queens</strong> holds Nefertari''s tomb, which carries the best preserved painting to survive from the ancient world. Entry is limited and separately ticketed and ten minutes is the allowance.</p>

<p>The <strong>Ramesseum</strong> is a ruin rather than a monument, and better for it. The fallen colossus of Ramesses II lying in pieces is what Shelley was writing about, and standing next to it does something no intact statue manages.</p>

<p><strong>Deir el Medina</strong> is the village where the men who cut the royal tombs lived, with their own small painted tombs above it. It is the most human place on the west bank and almost always empty.</p>

<p>You cannot fit all of this into one morning. Pick one.</p>

<h2>Day Two, East Bank: Karnak and Luxor Temple</h2>

<p>The east bank is a shorter day and a later start, which is the point after a 5am alarm.</p>

<p><strong>Karnak</strong> needs three hours and most itineraries give it ninety minutes. It is not one temple but a complex built and rebuilt across two thousand years, and the hypostyle hall alone holds 134 columns, the tallest of them around 21 metres. Go late in the afternoon when the light comes in sideways between them.</p>

<p><strong>Luxor Temple</strong> in the evening, after dark. This is the single best decision in Luxor sightseeing and it costs nothing extra. The temple is lit at night, it sits in the middle of the modern town, and walking in from the corniche after dinner is completely different from seeing it at noon.</p>

<p>Between the two, the avenue of sphinxes now runs almost three kilometres between Karnak and Luxor Temple. You can walk sections of it.</p>

<h2>The Sound and Light Show Question</h2>

<p>Karnak runs an evening sound and light show. Opinions on it are strongly divided and both sides are right about different things.</p>

<p>Against: the narration is dated, the music is heavy, and the script tells you how to feel about everything. If you dislike being guided emotionally you will spend an hour resisting it.</p>

<p>For: you walk through Karnak at night in a small group with the columns lit from below, and there is no other way to do that. The building is worth the script.</p>

<p>If you only have one evening, spend it at Luxor Temple instead. If you have two, the show is a reasonable use of the second.</p>

<h2>Getting Around Between Sites</h2>

<p>The west bank sites are spread across several kilometres of desert road and walking between them is not realistic. You need a vehicle for the morning, and the standard arrangement is a driver who waits at each stop.</p>

<p>Agree the stop list before you set off, not at the first stop. Drivers work to a normal route and if Medinet Habu or Deir el Medina is not on it you will get gentle resistance.</p>

<p>On the east bank, Karnak to Luxor Temple is about three kilometres along the corniche. It is a pleasant walk in the evening and a bad one at two in the afternoon.</p>

<h2>A Two Day Plan at a Glance</h2>

<table>
<thead>
<tr><th>&nbsp;</th><th>Morning</th><th>Afternoon</th><th>Evening</th></tr>
</thead>
<tbody>
<tr><td>Day 1</td><td>Valley of the Kings, Hatshepsut, Medinet Habu</td><td>Rest, or the Luxor Museum</td><td>Free</td></tr>
<tr><td>Day 2</td><td>Slow start, Luxor Museum if not yet done</td><td>Karnak</td><td>Luxor Temple, lit</td></tr>
</tbody>
</table>

<p>If you genuinely only have one day, do the Valley of the Kings and Hatshepsut in the morning, rest through the middle of the day, and give the late afternoon and evening to Karnak and Luxor Temple. Cut Medinet Habu rather than compressing everything.</p>

<h2>The Luxor Museum, Which Nobody Plans For</h2>

<p>It sits on the corniche between the two temples and it is the best small museum in Egypt.</p>

<p>The collection is deliberately limited and beautifully lit, which after the density of Karnak is a relief. Two royal mummies, a wall of Akhenaten''s Amarna blocks reassembled, and a cache of statues found buried under Luxor Temple in 1989.</p>

<p>An hour is enough. It is the ideal thing to do in the dead middle of the day when everything outdoors is unbearable, and almost nobody schedules it that way.</p>

<h2>What to Do in Luxor Egypt Beyond the Monuments</h2>

<p>Temple fatigue is real and two solid days of it is a lot. Three things break it up.</p>

<p>A <strong>balloon flight</strong> over the west bank at dawn. It launches before sunrise, it is over in an hour, and seeing the mortuary temples and the green strip of cultivation from above reorganises the whole geography in your head.</p>

<p>A <strong>felucca</strong> at sunset. Not a motor boat, a sail. An hour on the water costs very little and the bank you have been walking on all day looks different from the middle of the river.</p>

<p>The <strong>souk</strong> behind Luxor Temple in the evening. It is a working market with a tourist strip attached, and if you walk two streets past the tourist strip it stops performing for you.</p>

<h2>How Many Days Luxor Needs</h2>

<p>Two full days is the honest minimum for what to see in Luxor without rushing. Three is comfortable and lets you add the Valley of the Queens, Dendera or Abydos as a day trip north.</p>

<p>One day is a highlights visit. You will see the Valley of the Kings and Karnak and you will not see Luxor.</p>

<p>Most Nile cruises allocate a day and a half, which is why cruise passengers often come away thinking Luxor is Karnak and some tombs. If Luxor is the reason you are coming to Egypt, stay on land for it.</p>

<h2>Day Trips If You Have a Third Day</h2>

<p>Two are worth the drive and one is not.</p>

<p>Dendera, about an hour and a half north, is one of the most complete temple complexes in Egypt and keeps original colour on its hypostyle ceiling that almost nowhere else does. On a quiet morning you can stand in that hall alone, which never happens at Karnak.</p>

<p>Abydos, further north again, holds the Temple of Seti I and relief carving widely considered the finest to survive from any period. It is a long day and very few visitors make it, which is most of the appeal.</p>

<p>Esna, the usual third suggestion, is a short stop rather than a day trip. Worth ten minutes if you are passing on a cruise, not worth a dedicated drive.</p>

<h2>Practical Notes</h2>

<p>Tickets are bought per site, mostly at the entrance, and there is no single pass. Most west bank tickets are sold at a central office on the road in, not at the monuments, which catches people out. Current prices are <mark data-placeholder="luxor-tickets">FILL IN: current ticket prices for Valley of the Kings, Hatshepsut, Medinet Habu, Karnak and Luxor Temple</mark>.</p>

<p>Crossing the river is easy. The bridge is a long way south, so most people use the local ferry or a private boat, and both run frequently.</p>

<p>Season matters more here than anywhere else in Egypt. October to April is comfortable. June to September, the middle of the day is genuinely dangerous for anyone not used to it, and every plan above needs to shift earlier.</p>

<p>Our <a href="/10-day-egypt-tour">ten day Egypt itinerary</a> gives Luxor two full days on land for exactly the reasons above, and the <a href="/egypt-travel-guide/attractions-in-luxor">Luxor area guide</a> has the site by site detail if you are building your own days.</p>

<h2>Mistakes That Cost People a Day</h2>

<p>Three come up repeatedly.</p>

<p>Booking a west bank tour that starts at nine. By the time you reach the second tomb it is hot enough to shorten the visit, and you will blame the tombs rather than the timetable.</p>

<p>Giving Karnak ninety minutes because it is on the way to something else. It is not on the way to anything. It is the reason people come.</p>

<p>Treating the Luxor Museum as optional. It is the only air conditioned hour in a plan that is otherwise entirely outdoors, and skipping it usually means sitting in a hotel room instead.</p>

<p>The fourth, less common but worse: arriving on a cruise with a day and a half and assuming that is what Luxor takes. It is not, and there is no version of a day and a half that covers what to see in Luxor properly.</p>

<h2>One Thing to Book Before You Arrive</h2>

<p>The balloon. It has a hard capacity, it flies in a narrow weather window, and in high season it sells out days ahead. Everything else in Luxor can be decided the night before. That one cannot.</p>',
  'Luxor splits across two banks of the Nile, and the split is not just geography. It decides what you see in the morning and what you leave for the afternoon.',
  'Destinations',
  ARRAY['Luxor', 'Karnak', 'West Bank', 'Itineraries']::text[],
  'what to see in luxor',
  'What to See in Luxor: A Two Day Plan',
  'What to see in Luxor across two days, split by bank and by time of day. West bank mornings, east bank afternoons, and the pairings that actually work.',
  'published',
  '2026-09-29T09:00:00+03:00'::timestamptz,
  '[{"id":"cd42118b-7ad8-4751-99c9-0ff3966b422d","question":"How many days do you need in Luxor?","answer":"2 full days is the honest minimum, 1 for each bank of the Nile. 3 is comfortable and leaves room for the Valley of the Queens or a day trip to Dendera. 1 day is a highlights visit: you will see the Valley of the Kings and Karnak, and you will not see Luxor."},{"id":"d575c4df-d412-4612-976e-c4dbea204fee","question":"Should you do the west bank or the east bank first?","answer":"West bank first, starting at first light and ideally finished by 10am. It is open desert with no shade and a lot of climbing, so it has to happen in the cool hours. The east bank temples are flat, walkable and partly shaded by their own columns, which makes them better in the late afternoon and after dark."},{"id":"006a95c4-9161-4c02-b85c-6b32c59a617c","question":"Which is better, Karnak or Luxor Temple?","answer":"Karnak is the larger and more overwhelming of the 2 and needs about 3 hours; its hypostyle hall alone holds 134 columns, the tallest around 21 metres. Luxor Temple is smaller and at its best after dark, lit and sitting in the middle of the modern town. See both, and see Luxor Temple at night."},{"id":"7272f7c2-518f-4203-afc5-e37d4a8a3e6e","question":"What is the best thing to do in the middle of the day in Luxor?","answer":"The Luxor Museum. It is air conditioned, beautifully lit and takes about 1 hour, which makes it the ideal use of the hours when everything outdoors is too hot. It holds 2 royal mummies and a cache of statues found buried under Luxor Temple in 1989. Very few itineraries schedule it there."},{"id":"59991f28-c8b5-4a83-8ea3-76292bb8d3f3","question":"Is a hot air balloon over Luxor worth booking?","answer":"Yes, and it is the 1 thing to book before you arrive, because capacity is limited and it sells out in high season. Flights launch before sunrise and last about 1 hour. Seeing the mortuary temples and the green strip of cultivation from above reorganises the whole geography in your head."},{"id":"3d2a2d98-af80-4af8-a08a-f3c8a29fa26f","question":"When is the best time of year to visit Luxor?","answer":"October to April. Between June and September the middle of the day is genuinely difficult for anyone not used to it, and every plan has to shift earlier: west bank finished before 10am, east bank left until evening. Season matters more in Luxor than almost anywhere else in Egypt."},{"id":"33f6ee49-f02c-4fb7-95dd-726c29cf640a","question":"How do you cross between the two banks of the Nile in Luxor?","answer":"By the local ferry or a private boat, both of which run frequently and take a few minutes. The road bridge is a long way south of the town, so almost nobody drives across. Budget a few minutes each way rather than planning around it, and expect to cross twice in a 2 day visit."},{"id":"9ff94913-91a3-480a-9eb5-cafbe0758c90","question":"Is Luxor worth staying overnight or is a cruise stop enough?","answer":"Stay overnight if Luxor is a reason you are coming to Egypt. Most Nile cruises allocate about 1.5 days, which covers Karnak and some tombs and leaves the museum, Medinet Habu and Luxor Temple at night undone. On land you can split the 2 banks across 2 mornings instead of compressing them."}]'::jsonb,
  -- The other SEO overrides stay NULL on purpose: canonical_url falls back to
  -- the page's own URL, robots to "index, follow", og_image to the hero. An
  -- empty string in any of them would defeat that fallback.
  'BlogPosting'
)
ON CONFLICT (slug) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  body_en = EXCLUDED.body_en,
  excerpt = EXCLUDED.excerpt,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  focus_keyword = EXCLUDED.focus_keyword,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  status = EXCLUDED.status,
  scheduled_at = EXCLUDED.scheduled_at,
  faqs = EXCLUDED.faqs,
  schema_type = EXCLUDED.schema_type,
  updated_at = now();

COMMIT;

-- ---------------------------------------------------------------------------
-- Verification. Every "bad" column below must read 0.
-- ---------------------------------------------------------------------------
SELECT slug,
       length(meta_title) AS title_len,
       length(meta_description) AS meta_len,
       jsonb_array_length(faqs) AS faq_count,
       array_length(regexp_split_to_array(regexp_replace(body_en, '<[^>]+>', ' ', 'g'), '\s+'), 1) AS body_words,
       scheduled_at,
       schema_type,
       (SELECT count(*) FROM regexp_matches(body_en, 'what to see in luxor', 'gi')) AS primary_hits
FROM posts WHERE slug = 'what-to-see-in-luxor';

SELECT 'seo lengths out of range' AS check, count(*) AS bad FROM posts
WHERE slug = 'what-to-see-in-luxor' AND (length(meta_title) > 60 OR length(meta_description) NOT BETWEEN 150 AND 160);

SELECT 'faq count out of range' AS check, count(*) AS bad FROM posts
WHERE slug = 'what-to-see-in-luxor' AND jsonb_array_length(faqs) NOT BETWEEN 7 AND 8;

-- Answers are written to be quoted on their own by an AI answer engine, which
-- means 40 to 80 words each. Outside that they are either empty or too long.
SELECT 'faq answers outside 40-80 words' AS check, count(*) AS bad
FROM posts p, jsonb_array_elements(p.faqs) f
WHERE p.slug = 'what-to-see-in-luxor'
  AND array_length(regexp_split_to_array(trim(f->>'answer'), '\s+'), 1) NOT BETWEEN 40 AND 80;

-- The SEO overrides must be NULL, not empty strings, or the fallbacks break.
SELECT 'seo overrides stored as empty strings' AS check, count(*) AS bad FROM posts
WHERE slug = 'what-to-see-in-luxor'
  AND (canonical_url = '' OR robots = '' OR og_image = '' OR schema_type = '' OR featured_image_alt = '');

SELECT 'faq entries missing id, question or answer' AS check, count(*) AS bad
FROM posts p, jsonb_array_elements(p.faqs) f
WHERE p.slug = 'what-to-see-in-luxor'
  AND (coalesce(f->>'id','') = '' OR coalesce(f->>'question','') = '' OR coalesce(f->>'answer','') = '');

SELECT 'em or en dash present' AS check, count(*) AS bad FROM posts
WHERE slug = 'what-to-see-in-luxor'
  AND (body_en ~ '[\u2013\u2014]' OR meta_title ~ '[\u2013\u2014]' OR meta_description ~ '[\u2013\u2014]' OR title_en ~ '[\u2013\u2014]');

-- Tour links must sit at the site root. Anything under the category path 404s.
SELECT 'tour links under /luxury-egypt-tour-packages/' AS check, count(*) AS bad FROM posts
WHERE slug = 'what-to-see-in-luxor' AND body_en ~ 'href="/luxury-egypt-tour-packages/[^"]';

SELECT 'root-relative internal links' AS check,
       (SELECT count(*) FROM regexp_matches(body_en, 'href="/[^"]+"', 'g')) AS good,
       (SELECT count(*) FROM regexp_matches(body_en, 'href="(?!/)[^"]+"', 'g')) AS bad
FROM posts WHERE slug = 'what-to-see-in-luxor';

SELECT 'unfilled placeholders' AS check,
       (SELECT count(*) FROM regexp_matches(body_en, 'data-placeholder=', 'g'))
     + (SELECT count(*) FROM regexp_matches(body_en, '\{\{[A-Z_]+\}\}', 'g')) AS remaining
FROM posts WHERE slug = 'what-to-see-in-luxor';

SELECT 'other language columns left empty' AS check, count(*) AS bad FROM posts
WHERE slug = 'what-to-see-in-luxor'
  AND (title_es IS NOT NULL OR title_fr IS NOT NULL OR title_jp IS NOT NULL
       OR body_es IS NOT NULL OR body_fr IS NOT NULL OR body_jp IS NOT NULL);
