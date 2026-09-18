-- Things to Do in Aswan, in the Order That Actually Matters
-- Blog post 10 of 13. Primary keyword: things to do in aswan
--
-- Scheduled for 2026-10-17T09:00:00+03:00 via posts.scheduled_at, so it stays out of
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
  'things-to-do-in-aswan',
  'Things to Do in Aswan, in the Order That Actually Matters',
  '<p>Aswan is the one Egyptian city where the river is the attraction.</p>

<p>That sounds like a line from a brochure and it is not. Every other stop on a standard trip is a building you go and look at; here the granite islands, the sails, the light on the water and the desert starting at the far bank are the thing itself, and the monuments are arranged around it. Which is why most lists of things to do in aswan get the order wrong: they rank by what is easy to group into a morning rather than by what you would be sorry to have missed.</p>

<p>Here is the order that actually matters, and then how it collapses into one day, two or three.</p>

<h2>1. Philae Temple</h2>

<p>The first thing, on any length of stay. Philae is a Ptolemaic temple of Isis on an island, reached by a ten minute motorboat, and the approach across open water is half the experience.</p>

<p>It was moved. The original island flooded when the first Aswan dam was raised, leaving the temple underwater for most of the year for six decades, and in the 1970s the whole thing was cut into more than 40,000 blocks and rebuilt on Agilkia island nearby. The engineers reshaped Agilkia to match the original profile.</p>

<p>Go at opening or in the last two hours. The middle of the day here is an island of hot stone with almost no shade.</p>

<p>Allow ninety minutes ashore plus the boat each way. The sound and light show runs in the evening and divides opinion sharply: the temple lit at night is genuinely beautiful and the narration is not, so treat it as a second visit rather than a first.</p>

<h2>2. A Felucca at Sunset</h2>

<p>An hour on a sailing boat, no engine, between Elephantine and the west bank. This is the thing people remember a year later, and it is close to the cheapest item on the list.</p>

<p>The wind is reliable in the late afternoon and unreliable at other hours, which is why every boatman will push you toward five o''clock. They are right.</p>

<p>Agree the price and the duration before you step aboard, and be specific about whether you are stopping anywhere. An hour of sailing and a two hour trip with a village stop are different products at different prices.</p>

<h2>3. The Nubian Villages</h2>

<p>An afternoon in a living community rather than a monument, on the west bank at Gharb Soheil or on Elephantine at Koti. Tea in a family house, painted streets, a boat crossing each way.</p>

<p>It is the one half day here that is about people who live in Aswan now rather than people who died three thousand years ago, and for many visitors that is a relief by day three. The <a href="/blog/nubian-village-aswan-egypt">guide to visiting one</a> covers what to expect and how to be a reasonable guest.</p>

<h2>4. Elephantine Island</h2>

<p>The island opposite the corniche, with two Nubian villages, a ruined town site, a museum and a nilometer cut into the rock at the water''s edge.</p>

<p>Elephantine was the frontier town: the southern border of Egypt proper, the customs post, the garrison, and the place where the annual flood was first measured each year. The ruins are modest and the location is extraordinary.</p>

<p>The public ferry costs almost nothing and runs constantly from the corniche. Most visitors never take it, which is the main reason to take it.</p>

<h2>5. The Unfinished Obelisk</h2>

<p>A granite obelisk still attached to the bedrock, abandoned when it cracked, lying in the quarry where it was being cut. Had it been raised it would have stood about 42 metres and weighed over a thousand tonnes, larger than any obelisk ever erected.</p>

<p>Thirty minutes is enough. What makes it worth those thirty minutes is that it is the only place you see the process rather than the product: the trenches, the pounding marks, the point where the stone failed and the whole project stopped.</p>

<p>Go early. It is an open quarry with no shade at all and it faces the sun for most of the day.</p>

<h2>6. The High Dam and Lake Nasser</h2>

<p>Usually bundled with Philae because they are close together. The dam itself is twenty minutes of looking at a very large embankment and reading a monument to the Soviet engineering partnership.</p>

<p>The lake behind it is the interesting part: 500 kilometres long, reaching into Sudan, the reason Abu Simbel and Philae both had to move and the reason some 50,000 Egyptian Nubians were resettled. Seeing it explains half the modern history of this region.</p>

<p>If your day is tight, this is the first thing to cut.</p>

<h2>7. The Tombs of the Nobles and Qubbet el Hawa</h2>

<p>On the west bank cliff facing the town, a row of Old and Middle Kingdom tombs cut for the governors of Elephantine, reached by a steep climbed staircase.</p>

<p>The tombs themselves are modest next to anything in Luxor. The climb, and the view back over the river, the islands and the town from the terrace outside them, is one of the best half hours in Aswan and almost nobody does it.</p>

<p>One tomb here is worth knowing about before you climb. Harkhuf was a governor who led four expeditions south into Nubia in the sixth dynasty, and the autobiography carved at his entrance quotes a letter from the boy king Pepi II telling him to take good care of the dancing pygmy he was bringing back. It is one of the oldest royal letters to survive, and it was written by an excited child.</p>

<h2>8. The Monastery of St Simeon and the Aga Khan Mausoleum</h2>

<p>A seventh century fortified monastery in the desert behind the west bank, reached by boat and then a short walk or a camel ride, with the domed mausoleum of Aga Khan III on the hillside nearby.</p>

<p>The monastery is substantially intact, with vaulted cells and a refectory, and there is usually nobody there. It pairs well with the Nobles'' tombs on the same west bank half day.</p>

<h2>9. The Nubian Museum</h2>

<p>The best museum between Cairo and Abu Simbel, built in the 1990s to hold what was recovered before the flooding and to tell the Nubian story properly rather than as a footnote to pharaonic Egypt.</p>

<p>It is air conditioned, well lit and takes about an hour. Put it in the middle of a hot afternoon, which is the slot nothing outdoors can fill between May and September.</p>

<p>The section on the resettlement is the part to give time to. Photographs of the villages before the water, the salvage archaeology, the lists of what was moved and what was not. Most visitors arrive knowing Abu Simbel was relocated and leave understanding that a whole region was.</p>

<h2>Ranking the Things to Do in Aswan Egypt Actually Rewards</h2>

<p>Aswan punishes a packed schedule more than any other Egyptian city, because the heat is worse and the distances involve boats. Three sites in a day is a full day here. Five is a bad day.</p>

<p>So the ranking above is not a list to work through. It is an order of sacrifice: start at the top, stop when the day is full, and leave the rest rather than compressing everything into forty minute stops.</p>

<p>The other thing worth saying plainly is that two of the top three are not monuments. A sunset sail and an afternoon in a village beat six of the ancient sites on this list for most visitors, and almost every itinerary sold puts them last or leaves them out.</p>

<h2>What to Cut, by How Long You Have</h2>

<p>One full day: Philae at opening, the unfinished obelisk on the way back, the Nubian Museum through the hot hours, a felucca at five. That is the day. Do not try to add the dam.</p>

<p>Two days: add the Nubian village on the second afternoon and Elephantine by public ferry in the morning. If you want Abu Simbel, it eats one of these days entirely.</p>

<p>Three days: add the west bank half day, the Nobles'' tombs and St Simeon, and keep the third afternoon free. The best things to do in aswan on a third day are usually nothing in particular, on a boat.</p>

<h2>What Most Lists Get Wrong</h2>

<p>They put the High Dam second because it is next to Philae. It is a twenty minute stop that ends up eating a morning with the driving and the security checks, and visitors regularly tell you afterwards that they saw a dam.</p>

<p>They also leave the felucca to the end as an optional extra. On a two day stay in this city, an hour on the water at sunset is worth more than any monument except Philae, and it is the one thing you cannot get in Luxor or Cairo.</p>

<p>And they schedule Abu Simbel as if it were an Aswan attraction. It is 280 kilometres away and it is a day, not an outing. The <a href="/blog/abu-simbel-tour-from-aswan">Abu Simbel guide</a> covers the flight and road decision, and the honest summary is that it costs you a full day either way.</p>

<h2>Practical Things That Save Time</h2>

<p>Buy the Philae boat separately from the ticket. The boatmen work on a fixed rate per boat, not per person, so a group of four pays the same as one person and it is worth pairing up at the jetty.</p>

<p>Entry prices at the Aswan sites change most years and are card only now. Check the current rate before you go, or ask your operator to confirm it with your itinerary.</p>

<p>Almost everything worth doing here is on or across the water, so build days around boat movements rather than road distances. Two sites on the same bank are closer in practice than two sites the map puts side by side.</p>

<p>The <a href="/egypt-travel-guide/aswan-egypt-attractions">Aswan destination guide</a> has the site by site detail, and our <a href="/egypt-nile-cruise-packages">Nile cruise itineraries</a> generally give the city two nights rather than the single night most schedules allow, which is the difference between seeing Philae and seeing Aswan.</p>

<p>Last thing, and it is the sentence most visitors wish someone had told them. The corniche in the evening, walking north with the sun going down behind Elephantine, is free, takes twenty minutes and is better than several of the things on this list.</p>',
  'Most lists here are organised by geography, which is why people spend a morning on a quarry and skip the river. This one is ordered by what you would be sorry to have missed.',
  'Destinations',
  ARRAY['Aswan', 'Philae', 'Nubia', 'Nile']::text[],
  'things to do in aswan',
  'Things to Do in Aswan: What to See First',
  'The best things to do in aswan, ranked by what you would regret missing rather than by what sits close together. One day, two day and three day versions.',
  'published',
  '2026-10-17T09:00:00+03:00'::timestamptz,
  '[{"id":"50ae3201-fa89-51a3-9f9f-c69a1613ab06","question":"How many days do you need in Aswan?","answer":"2 days is the honest minimum and 3 is comfortable. 1 day covers Philae at opening, the unfinished obelisk, the Nubian Museum through the hot hours and a felucca at sunset. A second day adds a Nubian village and Elephantine Island. Abu Simbel is not an outing from Aswan; it eats a full day by itself."},{"id":"4bf5bec6-5c59-5b7f-a151-d505d829b7b1","question":"What is the single best thing to do in Aswan?","answer":"Philae Temple, reached by a 10 minute motorboat to its island. The Ptolemaic temple of Isis was cut into more than 40,000 blocks in the 1970s and rebuilt on higher ground after the original island flooded. Go at opening or in the last 2 hours, because the middle of the day is hot stone with almost no shade."},{"id":"153e4bba-5098-592e-923a-4b76e6117b4d","question":"Is the Aswan High Dam worth visiting?","answer":"It is the first thing to cut if your time is short. The dam itself is about 20 minutes of looking at a large embankment, and with the driving and security checks it can absorb a morning. Lake Nasser behind it is the interesting part: 500 km long, and the reason Abu Simbel, Philae and some 50,000 Egyptian Nubians all had to move."},{"id":"a3c75add-4371-5826-b2bf-cbaa321b3550","question":"Which is better, Aswan or Luxor?","answer":"They do different jobs. Luxor has far more to see, with Karnak, the Valley of the Kings and about a dozen major temples, and needs 2 to 3 days. Aswan has 1 great temple and a river, is slower and warmer, and suits 2 days. Most people prefer Luxor for sights and Aswan for the time they spend there."},{"id":"3a75adb2-bc12-51dc-bdbb-b13bbab00551","question":"Is a felucca ride in Aswan worth it?","answer":"Yes, and on a 2 day stay it is worth more than any monument except Philae. An hour under sail between Elephantine and the west bank costs very little and is the thing most visitors remember a year later. Take it around 5pm, when the wind is reliable, and agree the price and duration before boarding."},{"id":"414cb629-ef1f-506d-a2dd-ebfb1037b9d6","question":"What is there to do in Aswan in the afternoon heat?","answer":"The Nubian Museum, which is air conditioned, well lit and takes about 1 hour. It was built in the 1990s to hold what was recovered before the flooding and tells the Nubian story on its own terms. Between May and September it is the only indoor option in the city worth an hour of anyone''s day."},{"id":"4a9aa288-dc7f-5caf-b6e4-3c13c1125219","question":"Can you visit Elephantine Island independently?","answer":"Yes. A public ferry runs constantly from the corniche and costs almost nothing. The island holds 2 Nubian villages, a ruined frontier town, a museum and a nilometer cut into the rock at the water''s edge. Elephantine was Egypt''s southern border post, and most visitors never cross to it at all."},{"id":"4bae4721-d503-5163-bac3-11eb32183737","question":"What is the unfinished obelisk and how long does it take?","answer":"A granite obelisk still attached to the bedrock in its quarry, abandoned when the stone cracked. Raised, it would have stood about 42 metres and weighed over 1,000 tonnes, larger than any obelisk ever erected. 30 minutes is enough, and go early: the quarry is fully open with no shade at any hour."}]'::jsonb,
  -- The other SEO overrides stay NULL on purpose: canonical_url falls back to
  -- the page's own URL, robots to "index, follow", og_image to the hero. An
  -- empty string in any of them would defeat that fallback.
  'BlogPosting'
)
ON CONFLICT (slug) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  -- The body is NOT overwritten once images are in it.
  --
  -- This file used to assign EXCLUDED.body_en unconditionally, and re-running
  -- it after scripts/fill-post-images.ts deleted every <figure> that script had
  -- inserted. Silently, with the file reporting success. The CASE makes a
  -- re-run safe: a row that has already been illustrated keeps its body, and
  -- the verification below says which rows were kept so it is never a surprise.
  --
  -- To change the prose of a row that has figures, patch it surgically instead.
  -- See content-updates/blog-generator/README.md.
  body_en = CASE
    WHEN posts.body_en LIKE '%<figure%' THEN posts.body_en
    ELSE EXCLUDED.body_en
  END,
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

-- Not a failure. On a first run this reads "body written". On a re-run against
-- a row that already has images it reads "body kept, it has figures in it",
-- which is the guard above doing its job rather than something going wrong.
SELECT CASE
         WHEN body_en LIKE '%<figure%' THEN 'body kept, it has figures in it'
         ELSE 'body written from this file'
       END AS body_en_outcome,
       (length(body_en) - length(replace(body_en, '<figure', ''))) / 7 AS figures
FROM posts WHERE slug = 'things-to-do-in-aswan';
SELECT slug,
       length(meta_title) AS title_len,
       length(meta_description) AS meta_len,
       jsonb_array_length(faqs) AS faq_count,
       array_length(regexp_split_to_array(regexp_replace(body_en, '<[^>]+>', ' ', 'g'), '\s+'), 1) AS body_words,
       scheduled_at,
       schema_type,
       (SELECT count(*) FROM regexp_matches(body_en, 'things to do in aswan', 'gi')) AS primary_hits
FROM posts WHERE slug = 'things-to-do-in-aswan';

SELECT 'seo lengths out of range' AS check, count(*) AS bad FROM posts
WHERE slug = 'things-to-do-in-aswan' AND (length(meta_title) > 60 OR length(meta_description) NOT BETWEEN 150 AND 160);

SELECT 'faq count out of range' AS check, count(*) AS bad FROM posts
WHERE slug = 'things-to-do-in-aswan' AND jsonb_array_length(faqs) NOT BETWEEN 7 AND 8;

-- Answers are written to be quoted on their own by an AI answer engine, which
-- means 40 to 80 words each. Outside that they are either empty or too long.
SELECT 'faq answers outside 40-80 words' AS check, count(*) AS bad
FROM posts p, jsonb_array_elements(p.faqs) f
WHERE p.slug = 'things-to-do-in-aswan'
  AND array_length(regexp_split_to_array(trim(f->>'answer'), '\s+'), 1) NOT BETWEEN 40 AND 80;

-- The SEO overrides must be NULL, not empty strings, or the fallbacks break.
SELECT 'seo overrides stored as empty strings' AS check, count(*) AS bad FROM posts
WHERE slug = 'things-to-do-in-aswan'
  AND (canonical_url = '' OR robots = '' OR og_image = '' OR schema_type = '' OR featured_image_alt = '');

SELECT 'faq entries missing id, question or answer' AS check, count(*) AS bad
FROM posts p, jsonb_array_elements(p.faqs) f
WHERE p.slug = 'things-to-do-in-aswan'
  AND (coalesce(f->>'id','') = '' OR coalesce(f->>'question','') = '' OR coalesce(f->>'answer','') = '');

SELECT 'em or en dash present' AS check, count(*) AS bad FROM posts
WHERE slug = 'things-to-do-in-aswan'
  AND (body_en ~ '[\u2013\u2014]' OR meta_title ~ '[\u2013\u2014]' OR meta_description ~ '[\u2013\u2014]' OR title_en ~ '[\u2013\u2014]');

-- Tour links must sit at the site root. Anything under the category path 404s.
SELECT 'tour links under /luxury-egypt-tour-packages/' AS check, count(*) AS bad FROM posts
WHERE slug = 'things-to-do-in-aswan' AND body_en ~ 'href="/luxury-egypt-tour-packages/[^"]';

SELECT 'root-relative internal links' AS check,
       (SELECT count(*) FROM regexp_matches(body_en, 'href="/[^"]+"', 'g')) AS good,
       (SELECT count(*) FROM regexp_matches(body_en, 'href="(?!/)[^"]+"', 'g')) AS bad
FROM posts WHERE slug = 'things-to-do-in-aswan';

SELECT 'unfilled placeholders' AS check,
       (SELECT count(*) FROM regexp_matches(body_en, 'data-placeholder=', 'g'))
     + (SELECT count(*) FROM regexp_matches(body_en, '\{\{[A-Z_]+\}\}', 'g')) AS remaining
FROM posts WHERE slug = 'things-to-do-in-aswan';

SELECT 'other language columns left empty' AS check, count(*) AS bad FROM posts
WHERE slug = 'things-to-do-in-aswan'
  AND (title_es IS NOT NULL OR title_fr IS NOT NULL OR title_jp IS NOT NULL
       OR body_es IS NOT NULL OR body_fr IS NOT NULL OR body_jp IS NOT NULL);
