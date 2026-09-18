-- Dendera Temple Egypt and Abydos: One Long Day from Luxor
-- Blog post 7 of 13. Primary keyword: dendera temple egypt
--
-- Scheduled for 2026-10-08T09:00:00+03:00 via posts.scheduled_at, so it stays out of
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
  'dendera-temple-egypt',
  'Dendera Temple Egypt and Abydos: One Long Day from Luxor',
  '<p>The ceiling at Dendera is blue.</p>

<p>Not faded blue, not blue if you squint. Blue the way it was painted about two thousand years ago, with gold stars on it, cleaned of nineteen centuries of soot in a restoration that ran through the 2000s and 2010s and that almost nobody outside Egypt has heard about. The dendera temple egypt day trip exists because of that ceiling, and it stays worth doing because of what else is under it.</p>

<p>The trip is usually sold as a pair with Abydos, ninety minutes further on. That pairing is the right call for some people and the wrong one for others, and it is worth being honest about which you are before you spend a day on the road.</p>

<h2>Where These Two Places Are</h2>

<p>Dendera sits near Qena, about 60 kilometres north of Luxor. The drive takes an hour to an hour and a half depending on the traffic through the towns.</p>

<p>Abydos is further, near El Balyana, roughly 150 kilometres from Luxor and two and a half hours each way. They are not next to each other in any useful sense. You are driving north, stopping, driving further north, stopping, then driving all the way back.</p>

<p>The old convoy system, where foreign vehicles travelled in police escorted groups at fixed hours, is gone. You leave when you want to.</p>

<p>That matters more than it sounds. Under the convoys you arrived at both temples at the same hour as everyone else, in the heat, in a crowd of forty vehicles. Now a car leaving Luxor at six can have the Dendera hypostyle hall to itself for twenty minutes.</p>

<h2>The Ceiling at Dendera Temple Egypt Is the Reason to Come</h2>

<p>The hypostyle hall has twenty four columns with Hathor heads on all four faces, and above them a ceiling divided into seven bands of astronomical scenes: the sky goddess Nut swallowing the sun and giving birth to it, the decans, the planets drawn as travelling gods.</p>

<p>For most of the modern era this was black. Generations of people sheltering and cooking inside the hall left a layer of soot that photographs from the 1980s show as an even dark grey. The cleaning ran in phases over more than a decade and the effect on arrival is genuinely startling, because nothing prepares you for colour at that saturation on a two thousand year old ceiling.</p>

<p>Look up before you look at anything else. Everyone does it in the wrong order and spends the first ten minutes photographing columns.</p>

<p>The hall is also darker than photographs suggest. Your eyes need a minute, and the guardians carry torches and will light a band of the ceiling for you if you ask, which turns a flat blue expanse into figures and boats and stars.</p>

<h2>What Else Is Inside</h2>

<p>The Temple of Hathor at Dendera is unusually complete, and completeness is what makes it readable. There is a roof you can climb to, with chapels where the new year ritual took place and a good view over the mudbrick enclosure wall.</p>

<p>There are crypts under the floor, narrow and low, carrying relief so crisp it looks recut. One is usually open and it involves a bent walk of about fifteen metres.</p>

<p>On the rear exterior wall is a well known relief of Cleopatra VII with her son Caesarion, making offerings. It is one of the few images of her carved in Egypt during her lifetime, and it is nothing like the face on the coins.</p>

<p>The zodiac everyone asks about is a circular sky map from a roof chapel. The original was cut out of the ceiling in 1821 and is in the Louvre. What is in place is a cast, and nobody at the site pretends otherwise.</p>

<h2>Abydos: A Different Kind of Building</h2>

<p>The abydos temple most people mean is the Temple of Seti I, and it is a strange, sober, beautiful thing after the exuberance of Dendera.</p>

<p>Seti built it in the early Nineteenth Dynasty as a cult centre for Osiris, whose most important shrine stood here. It has seven sanctuaries side by side rather than the usual one, an L shaped plan that survives from a change of design, and relief carving that Egyptologists have been using as the benchmark for the period since the first surveys.</p>

<p>The relief carving in the Temple of Seti I Abydos is the best preserved of its period anywhere in Egypt. Raised relief, cut shallow, with the modelling of a shoulder or a hand still legible under a torch. Ramesses II finished parts of the building after his father died and the drop in quality between the two is visible in a single corridor, which is an education in itself.</p>

<h2>The King List, and Why Historians Care</h2>

<p>In a corridor off the main temple is a wall carrying 76 cartouches: Seti and his son standing before the names of the kings who came before them, in order, back to the first dynasty.</p>

<p>It is one of the main sources for the sequence of Egyptian rulers, and it is also an edited one. Hatshepsut is missing. Akhenaten, Smenkhkare, Tutankhamun and Ay are all missing. The list runs from Ramesses I straight back past the Amarna period as though it never happened.</p>

<p>Standing in front of an official document that quietly deletes four reigns is more interesting than most things carved on a wall, and it takes thirty seconds to explain to anyone travelling with you.</p>

<h2>The Osireion</h2>

<p>Behind the temple, down a slope and usually holding water, is a structure of enormous rough granite blocks on a completely different scale from everything around it.</p>

<p>The Osireion was built as a symbolic tomb of Osiris, its central platform surrounded by groundwater so that it reads as an island rising from the primeval waters. The water table has risen since, so it is often flooded and you look at it from above rather than walking in.</p>

<p>It is usually the part visitors remember, partly because it looks nothing like a temple and partly because the masonry is so unlike anything else at the site that people assume it is far older. There is no good evidence for that, and it does not need to be older to be remarkable.</p>

<h2>The Marks on the Architrave</h2>

<p>Somewhere on your visit a guide will point out a block carrying shapes that look like a helicopter and an aircraft. It is worth knowing what you are looking at before someone tells you it is proof of something.</p>

<p>It is a palimpsest. Seti''s original inscription was plastered over and recut with Ramesses II''s titles, the plaster fell away over the centuries, and two sets of overlapping signs now read as one image. Both original texts are known and both are ordinary royal titles.</p>

<p>This is not a fringe reading of the evidence. It is what the two inscriptions say when they are read separately, which they have been, repeatedly, since the 1990s.</p>

<h2>Should You Do This Trip at All</h2>

<p>Here is the part most articles leave out. If you have one day in Luxor, do not do this. You would be trading Karnak, the Valley of the Kings and Hatshepsut for ten hours in a car and two temples that will mean much less without the context those sites give you.</p>

<p>Three full days in Luxor is the point where this becomes a good idea. By then you have seen enough New Kingdom temple architecture that Dendera''s Ptolemaic exuberance and Seti''s restraint both land as deliberate choices rather than as more of the same.</p>

<p>If you have two days and you want one of the two, take Dendera. It is a third of the driving and the ceiling is the single most surprising thing on this stretch of the Nile.</p>

<h2>How the Day Actually Runs</h2>

<p>Leave Luxor at 6 or 7. Doing Abydos first and Dendera on the way back is the order most drivers prefer, because it puts the long leg at the start while everyone is fresh and gets you to Dendera in better light.</p>

<p>Allow an hour and a half at Abydos and two hours at Dendera. Both are open early, and in summer the first hour of the day at each is worth more than the next three.</p>

<p>Budget ten to twelve hours door to door. Take food. There is very little at either site and the road between them runs through towns rather than anywhere set up to feed visitors.</p>

<p>One more thing about the order. If you are doing the dendera temple egypt trip in summer, reverse it and take Dendera first at opening, because the hypostyle hall is the one interior on the route that stays cool and you want it before the day builds rather than after.</p>

<h2>Going Without a Driver</h2>

<p>It is possible and it is not comfortable. There are trains from Luxor to Qena, about an hour, and from Qena you would need a taxi for the last eight kilometres to Dendera temple and back. That works as a half day for one site.</p>

<p>Abydos by public transport is a different proposition. Trains to El Balyana run, the station is some way from the temple, and the return timings are the problem rather than the outward leg. People do it. Most who have done it once hire a car the second time.</p>

<p>A driver for the full day, shared between two or four people, usually costs less per head than two sets of train tickets plus four taxis, and it removes the part of the day where you are standing on a platform at four in the afternoon doing arithmetic.</p>

<p>If you are already on a Nile cruise, check your itinerary before booking anything. A few longer cruises include Dendera on the Luxor to Qena stretch, and paying twice for the same temple is a common and avoidable mistake.</p>

<h2>Tickets, and What Nobody Can Tell You in Advance</h2>

<p>Entry prices at both sites change most years and are card only, as they are across Upper Egypt now. Check the current rate before you go, or ask your operator to confirm it alongside your itinerary.</p>

<p>Photography inside both temples has been free for phones for several seasons, with a permit required for a tripod or a professional body. Ask at the window rather than assuming, because this is the rule that changes most often.</p>

<h2>What to Read Before You Go</h2>

<p>One page on Osiris will change the Abydos visit completely. The seven sanctuaries, the king list and the Osireion are all doing one job, which is tying a living king to a dead god, and the building stops being a set of rooms once that clicks.</p>

<p>For Dendera, read about the Ptolemaic period for five minutes. Knowing that Greek speaking rulers commissioned a thoroughly Egyptian temple, and that Roman emperors are carved on it making offerings as pharaohs, explains most of what looks odd about the place.</p>

<p>Both sites pair naturally with the west bank. The <a href="/egypt-travel-guide/attractions-in-luxor">Luxor area guide</a> covers how the banks split across a stay, and the <a href="/blog/tombs-in-the-valley-of-kings">guide to choosing tombs</a> is the other decision worth making before you arrive rather than at a ticket window. For a longer trip that fits both in without a forced march, our <a href="/12-days-egypt-tour">twelve day itinerary</a> spreads the area across several mornings.</p>

<p>Last practical note. Both temples face roughly north and their best interior light is mid morning, which is another argument for Abydos first: arrive there at nine, reach Dendera by one, and you will have caught each of them close to its hour.</p>',
  'Two of the best preserved temples in Egypt sit north of Luxor in opposite directions, and almost every visitor drives past both. Here is what they hold and whether the day is worth giving up.',
  'Culture & History',
  ARRAY['Dendera', 'Abydos', 'Luxor', 'Temples']::text[],
  'dendera temple egypt',
  'Dendera Temple Egypt and Abydos: A Day from Luxor',
  'The dendera temple egypt day trip pairs a painted astronomical ceiling with the finest relief carving in the country. Timings, order and who should skip it.',
  'published',
  '2026-10-08T09:00:00+03:00'::timestamptz,
  '[{"id":"4f46be11-20da-518f-80cd-22d0b311b29f","question":"Can you visit Dendera and Abydos in one day from Luxor?","answer":"Yes, and it takes 10 to 12 hours door to door. Dendera is about 60 km north of Luxor, roughly 90 minutes, and Abydos is about 150 km, around 2.5 hours. Most drivers do Abydos first and Dendera on the way back, which puts the long leg at the start of the day and improves the light at Dendera."},{"id":"f6b3ecd2-d4dc-553f-a0e6-6cdb10224dae","question":"Is the Dendera ceiling really restored?","answer":"Yes. A cleaning project running through the 2000s and 2010s removed roughly 19 centuries of soot from the hypostyle hall ceiling, revealing the original blue ground and gold stars. Photographs from the 1980s show the same ceiling as an even dark grey. The colour is original paint, not repainting, which is why it surprises people."},{"id":"060564e2-8ad6-5f30-9314-7974138b48d6","question":"Which is better, Dendera or Abydos?","answer":"Dendera, if you can only do 1. It is a third of the driving from Luxor and the restored astronomical ceiling is the most surprising thing on this stretch of the Nile. Abydos rewards anyone interested in relief carving or in Osiris, and its king list of 76 cartouches is a major historical document, but it asks more of you."},{"id":"3a587517-8ef3-5412-8371-92c83995bdf9","question":"Is the Dendera zodiac still at the temple?","answer":"No. The circular zodiac was cut out of a roof chapel ceiling in 1821 and has been in the Louvre in Paris ever since. What you see in place is a cast, and the site does not pretend otherwise. The rest of the roof chapels are original, as is the 7 band astronomical ceiling in the main hall below."},{"id":"d3d05e73-dc99-51c4-bcda-6adb6f43d8d9","question":"What is the Abydos king list?","answer":"A wall carrying 76 cartouches in a corridor of the Temple of Seti I, naming the kings before Seti in order back to the first dynasty. It is a main source for Egyptian chronology and an edited one: Hatshepsut, Akhenaten, Smenkhkare, Tutankhamun and Ay are all left out, so the Amarna period disappears entirely."},{"id":"c541f3bb-3c00-5a65-adf7-1faac2ab321a","question":"Are the Abydos helicopter hieroglyphs real?","answer":"They are real carvings and they are not aircraft. Seti I''s original inscription was plastered over and recut with the titles of Ramesses II; the plaster later fell away and the 2 overlapping texts now read as one image. Both original inscriptions are known and both are ordinary royal titles, nothing more."},{"id":"faed27d6-d97d-5733-992e-9c4a7893b519","question":"Is the Dendera and Abydos trip worth it with only one day in Luxor?","answer":"No. With 1 day you would be trading Karnak, the Valley of the Kings and Hatshepsut for about 10 hours in a car. This trip makes sense from day 3 onwards, when you have seen enough New Kingdom architecture for Dendera''s Ptolemaic style and Seti''s restraint to register as deliberate choices."},{"id":"66d66a7c-ac93-5e33-b8af-95ea56ddb335","question":"How much time do you need at each temple?","answer":"About 2 hours at Dendera and 90 minutes at Abydos. Dendera takes longer because of the roof chapels, the crypts and the rear wall relief of Cleopatra VII with Caesarion. Both open early, and in summer the first hour of the day at either site is worth more than the 3 that follow it."}]'::jsonb,
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
FROM posts WHERE slug = 'dendera-temple-egypt';
SELECT slug,
       length(meta_title) AS title_len,
       length(meta_description) AS meta_len,
       jsonb_array_length(faqs) AS faq_count,
       array_length(regexp_split_to_array(regexp_replace(body_en, '<[^>]+>', ' ', 'g'), '\s+'), 1) AS body_words,
       scheduled_at,
       schema_type,
       (SELECT count(*) FROM regexp_matches(body_en, 'dendera temple egypt', 'gi')) AS primary_hits
FROM posts WHERE slug = 'dendera-temple-egypt';

SELECT 'seo lengths out of range' AS check, count(*) AS bad FROM posts
WHERE slug = 'dendera-temple-egypt' AND (length(meta_title) > 60 OR length(meta_description) NOT BETWEEN 150 AND 160);

SELECT 'faq count out of range' AS check, count(*) AS bad FROM posts
WHERE slug = 'dendera-temple-egypt' AND jsonb_array_length(faqs) NOT BETWEEN 7 AND 8;

-- Answers are written to be quoted on their own by an AI answer engine, which
-- means 40 to 80 words each. Outside that they are either empty or too long.
SELECT 'faq answers outside 40-80 words' AS check, count(*) AS bad
FROM posts p, jsonb_array_elements(p.faqs) f
WHERE p.slug = 'dendera-temple-egypt'
  AND array_length(regexp_split_to_array(trim(f->>'answer'), '\s+'), 1) NOT BETWEEN 40 AND 80;

-- The SEO overrides must be NULL, not empty strings, or the fallbacks break.
SELECT 'seo overrides stored as empty strings' AS check, count(*) AS bad FROM posts
WHERE slug = 'dendera-temple-egypt'
  AND (canonical_url = '' OR robots = '' OR og_image = '' OR schema_type = '' OR featured_image_alt = '');

SELECT 'faq entries missing id, question or answer' AS check, count(*) AS bad
FROM posts p, jsonb_array_elements(p.faqs) f
WHERE p.slug = 'dendera-temple-egypt'
  AND (coalesce(f->>'id','') = '' OR coalesce(f->>'question','') = '' OR coalesce(f->>'answer','') = '');

SELECT 'em or en dash present' AS check, count(*) AS bad FROM posts
WHERE slug = 'dendera-temple-egypt'
  AND (body_en ~ '[\u2013\u2014]' OR meta_title ~ '[\u2013\u2014]' OR meta_description ~ '[\u2013\u2014]' OR title_en ~ '[\u2013\u2014]');

-- Tour links must sit at the site root. Anything under the category path 404s.
SELECT 'tour links under /luxury-egypt-tour-packages/' AS check, count(*) AS bad FROM posts
WHERE slug = 'dendera-temple-egypt' AND body_en ~ 'href="/luxury-egypt-tour-packages/[^"]';

SELECT 'root-relative internal links' AS check,
       (SELECT count(*) FROM regexp_matches(body_en, 'href="/[^"]+"', 'g')) AS good,
       (SELECT count(*) FROM regexp_matches(body_en, 'href="(?!/)[^"]+"', 'g')) AS bad
FROM posts WHERE slug = 'dendera-temple-egypt';

SELECT 'unfilled placeholders' AS check,
       (SELECT count(*) FROM regexp_matches(body_en, 'data-placeholder=', 'g'))
     + (SELECT count(*) FROM regexp_matches(body_en, '\{\{[A-Z_]+\}\}', 'g')) AS remaining
FROM posts WHERE slug = 'dendera-temple-egypt';

SELECT 'other language columns left empty' AS check, count(*) AS bad FROM posts
WHERE slug = 'dendera-temple-egypt'
  AND (title_es IS NOT NULL OR title_fr IS NOT NULL OR title_jp IS NOT NULL
       OR body_es IS NOT NULL OR body_fr IS NOT NULL OR body_jp IS NOT NULL);
