-- Medinet Habu: The Luxor Temple Almost Everyone Drives Past
-- Blog post 9 of 13. Primary keyword: medinet habu
--
-- Scheduled for 2026-10-14T09:00:00+03:00 via posts.scheduled_at, so it stays out of
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
  'medinet-habu',
  'Medinet Habu: The Luxor Temple Almost Everyone Drives Past',
  '<p>You can still see the paint.</p>

<p>Not a trace of pigment in a protected corner. Actual colour, on actual walls, at eye level, in rooms you can stand in: reds and blues and yellows that were put on in the twelfth century BC and are still doing their job. Medinet habu holds more of its original decoration than anywhere else open in Luxor, and on most mornings there are more guardians than visitors inside it.</p>

<p>It sits about two kilometres from the Colossi of Memnon, on the same road as everything else on the west bank. Almost every itinerary drives past the gate.</p>

<h2>What Medinet Habu Actually Is</h2>

<p>A mortuary temple built by Ramesses III in the early twelfth century BC, on a scale that makes sense only when you are standing in the second court and realise the enclosure wall is a fortification.</p>

<p>Mortuary temple is a slightly misleading label. These buildings were not tombs; they were where the cult of a dead king was maintained, funded by estates, staffed by priests and running for as long as the money held out. The king himself was buried across the valley in the rock.</p>

<p>The complex is large: an outer enclosure, a fortified gatehouse modelled on a Syrian fort, a small earlier temple of the Eighteenth Dynasty, palace remains against the south side of the first court, and the main temple running back through two courts to the sanctuary.</p>

<h2>Why the Colour Survived Here</h2>

<p>Three things. The temple was built late enough that its decoration was cut deep rather than in fine raised relief, which protects pigment in the shadow of the cut. It was buried for centuries under the Coptic town of Djeme, which grew inside the walls. And it faces away from the prevailing wind.</p>

<p>Cleaning and consolidation over the last two decades have brought a great deal of it back. The ceilings of the columned halls and the upper registers on the inner walls are where to look, because those are the surfaces nobody could reach to scrub.</p>

<p>This is the closest most visitors will get to seeing what Karnak looked like when it was finished. Karnak is bigger and it is bare stone; the temple of medinet habu is the one that still tells you these buildings were painted from floor to ceiling.</p>

<h2>The Sea Peoples Wall</h2>

<p>On the exterior of the north wall is a long sequence of battle reliefs recording Ramesses III''s campaigns against a confederation the texts call the Sea Peoples, around 1175 BC.</p>

<p>These reliefs are one of the main historical sources for the collapse that ended the Bronze Age across the eastern Mediterranean. Ships with bird head prows, warriors in feathered headdresses, a naval battle in the Nile Delta, and beside it a scene of scribes counting severed hands to tally the dead.</p>

<p>Whatever you think of the arithmetic, this is a contemporary account of an event that brought down several civilisations, carved by the side that survived it. Very little else on the west bank is doing anything comparable.</p>

<p>Walk the whole wall. It takes ten minutes and most groups stop at the first panel.</p>

<h2>The Gatehouse</h2>

<p>The entrance building, usually called the migdol, is modelled on a Levantine fortress gate, complete with towers and a narrow passage. Egypt did not build like this; Ramesses III copied a form he had seen abroad.</p>

<p>Upstairs were private royal apartments, and their reliefs are a considerable change of register from the battles outside: the king relaxed, with women of the household, in scenes carved with real delicacy.</p>

<p>Access to the upper rooms depends on the day. Ask at the gate rather than assuming, and if they are open, take the stairs.</p>

<p>The passage through the gate is worth a moment on its own. It is narrow, it turns, and the walls carry the king smiting foreigners on both sides, which is what everyone arriving on business had to walk between. The building is making an argument before you are through the door.</p>

<h2>The Christian Town Nobody Mentions</h2>

<p>For several hundred years after the temple stopped functioning, a Coptic town called Djeme filled the enclosure. Houses, churches, streets, a working community living inside a pharaonic monument.</p>

<p>It was cleared by excavators in the early twentieth century, which is why the courts are empty now. You can still find Coptic crosses cut into pharaonic columns, and in the second court the bases where a basilica once stood.</p>

<p>The papyri from Djeme are one of the richest sources we have for daily life in Byzantine Egypt: contracts, letters, complaints about neighbours. The building has two lives and the second one is barely signposted.</p>

<h2>How Long to Allow, and When</h2>

<p>Ninety minutes is right. An hour if you are moving, two if you walk the battle reliefs properly and go up the gatehouse.</p>

<p>That makes it the cheapest addition on the west bank in time terms. Hatshepsut needs an hour, the tombs need two and a half, and this fits after both without pushing anyone past lunch.</p>

<p>Go last on a west bank morning rather than first. The Valley of the Kings is unbearable after nine and this site is not, because the courts hold shade and the inner halls stay cool. Tombs at opening, Hatshepsut next, this at ten or eleven.</p>

<p>The other option is the late afternoon, an hour before closing, when the low sun comes in through the courts from the west and lights the columns along their length. Fewer people still. This is the better photograph by a distance.</p>

<h2>How It Compares with the Ramesseum</h2>

<p>They invite comparison, because Ramesses III built his temple with the Ramesseum of Ramesses II in front of him as the model, and the plans are close.</p>

<p>The difference is what is left. The Ramesseum is a romantic ruin with a fallen colossus, the one that prompted Shelley''s poem, and it is largely roofless and bare. Medinet habu luxor keeps its walls, its colour and its enclosure.</p>

<p>If you have one slot, take this one. If you have two mornings on the west bank, do both and do them back to back, because the same plan in two states of preservation teaches you more than either does alone.</p>

<h2>Tickets and Getting There</h2>

<p>Medinet habu temple has its own ticket, bought at the site rather than at the central west bank office, which is unusual and catches people out. Entry prices here change yearly and are card only. Check the current rate before you go, or ask your operator to confirm it with your itinerary.</p>

<p>It is a five minute drive from the Colossi of Memnon and about fifteen from the Valley of the Kings. Any west bank driver knows it, though you may have to insist, because it is not on the default circuit and some will try to talk you into Deir el Medina instead.</p>

<p>There is a cafe opposite the entrance with shade and cold drinks, which is more than most west bank sites offer.</p>

<p>Bring water anyway. The walk from the car park through the enclosure to the far end of the battle wall and back is close to a kilometre on open ground, and there is nothing to buy once you are inside the gate.</p>

<h2>What to Look at First</h2>

<p>Go through the migdol without stopping, cross the first court, and stand in the second court with your back to the sanctuary. That is where the colour is best and where the scale of the place lands.</p>

<p>Then work outward: the second court ceilings, the inner halls, the north exterior wall for the battles, the gatehouse last. Doing it in that order means you see the painted surfaces while your eyes are still fresh and the crowds, such as they are, have not arrived.</p>

<p>For how the west bank fits together across a stay, the <a href="/egypt-travel-guide/attractions-in-luxor">Luxor area guide</a> covers the two bank split, and the <a href="/blog/tombs-in-the-valley-of-kings">tomb choosing guide</a> covers the morning before this one. Our <a href="/best-luxury-egypt-tours">longer Egypt itineraries</a> put the west bank across two mornings rather than one, which is the only way this temple gets the time it deserves.</p>

<p>One thing to carry: a torch, or a phone with a good one. The painted ceilings are high and the inner rooms are dim, and the difference between a torch and no torch here is the difference between grey stone and a blue and gold ceiling.</p>',
  'The colour on these walls is the real thing, not a reconstruction, and you will often have a courtyard to yourself. It is the strongest argument on the west bank for a second morning.',
  'Culture & History',
  ARRAY['Medinet Habu', 'Luxor', 'West Bank', 'Ramesses III']::text[],
  'medinet habu',
  'Medinet Habu: The Luxor Temple People Drive Past',
  'Medinet habu keeps more original paint than anywhere else in Luxor and is usually half empty. What to look for on the walls, and the best hour to be there.',
  'published',
  '2026-10-14T09:00:00+03:00'::timestamptz,
  '[{"id":"9afa6ab5-3617-53dd-a29b-43d01e23257b","question":"Is Medinet Habu worth visiting?","answer":"Yes, and it is the most under visited major site on the Luxor west bank. It keeps more original paint than anywhere else open in the city, its north exterior wall carries the main historical record of the Sea Peoples invasion of about 1175 BC, and you will often have a courtyard to yourself."},{"id":"eb69d2c8-6783-5a64-a5d0-fe7b3034145e","question":"Why is the paint at Medinet Habu so well preserved?","answer":"Three reasons. The decoration was cut deep rather than in fine raised relief, which shelters pigment inside the cut. A Coptic town called Djeme buried much of the complex for centuries. And the temple faces away from the prevailing wind. Cleaning over the last 2 decades has recovered a great deal more."},{"id":"1dfa037b-94e4-5afa-af4e-b20d6f7ea5eb","question":"Which is better, Medinet Habu or the Ramesseum?","answer":"Medinet Habu, if you are choosing 1. Ramesses III used the Ramesseum as his model so the 2 plans are close, but the Ramesseum is largely roofless and bare while Medinet Habu keeps its walls, its colour and its enclosure. See both back to back if you have 2 west bank mornings."},{"id":"e195e556-4023-5a09-bcb5-67637c60a5c3","question":"What are the Sea Peoples reliefs at Medinet Habu?","answer":"A sequence of battle scenes on the outer north wall recording Ramesses III''s campaigns against a confederation the texts call the Sea Peoples, around 1175 BC. They are a main source for the Bronze Age collapse, showing ships with bird head prows, a naval battle in the Delta and scribes tallying severed hands."},{"id":"c4473303-b101-52cd-8150-6396b8b47ddf","question":"How long do you need at Medinet Habu?","answer":"About 90 minutes. An hour covers the courts and inner halls at a steady pace, and 2 hours lets you walk the full battle wall and climb the gatehouse if its upper rooms are open that day. Most groups that stop here allow 40 minutes, which is enough to see the scale and none of the detail."},{"id":"dc6880d4-24d1-5b3a-8c21-41516a3976ff","question":"When is the best time of day to visit Medinet Habu?","answer":"Late in a west bank morning, around 10 or 11, or the last hour before closing. The tombs have to be done at opening because the valley is unbearable after 9, and this site is not: the courts hold shade. The late afternoon sun comes in from the west along the columns and is the better photograph."},{"id":"a7a9aece-520d-5d08-a893-194d564fb0e7","question":"Where do you buy tickets for Medinet Habu?","answer":"At the site itself, not at the central west bank ticket office where most Luxor tickets are sold. This is unusual and catches people out, especially anyone who has already bought a stack of tickets on the road in. Payment is by card across the west bank, with no cash desk. Prices change most years, so confirm the current rate within 1 month of travelling."},{"id":"e30d0ba2-10ea-5154-9982-f0410c005434","question":"What was the Coptic town inside the temple?","answer":"Djeme, a Christian settlement that filled the temple enclosure for around 500 years with houses, streets and churches. Excavators cleared it in the early 20th century, which is why the courts are empty today. Its papyri are among the richest sources for daily life in Byzantine Egypt, and Coptic crosses are still cut into pharaonic columns."}]'::jsonb,
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
FROM posts WHERE slug = 'medinet-habu';
SELECT slug,
       length(meta_title) AS title_len,
       length(meta_description) AS meta_len,
       jsonb_array_length(faqs) AS faq_count,
       array_length(regexp_split_to_array(regexp_replace(body_en, '<[^>]+>', ' ', 'g'), '\s+'), 1) AS body_words,
       scheduled_at,
       schema_type,
       (SELECT count(*) FROM regexp_matches(body_en, 'medinet habu', 'gi')) AS primary_hits
FROM posts WHERE slug = 'medinet-habu';

SELECT 'seo lengths out of range' AS check, count(*) AS bad FROM posts
WHERE slug = 'medinet-habu' AND (length(meta_title) > 60 OR length(meta_description) NOT BETWEEN 150 AND 160);

SELECT 'faq count out of range' AS check, count(*) AS bad FROM posts
WHERE slug = 'medinet-habu' AND jsonb_array_length(faqs) NOT BETWEEN 7 AND 8;

-- Answers are written to be quoted on their own by an AI answer engine, which
-- means 40 to 80 words each. Outside that they are either empty or too long.
SELECT 'faq answers outside 40-80 words' AS check, count(*) AS bad
FROM posts p, jsonb_array_elements(p.faqs) f
WHERE p.slug = 'medinet-habu'
  AND array_length(regexp_split_to_array(trim(f->>'answer'), '\s+'), 1) NOT BETWEEN 40 AND 80;

-- The SEO overrides must be NULL, not empty strings, or the fallbacks break.
SELECT 'seo overrides stored as empty strings' AS check, count(*) AS bad FROM posts
WHERE slug = 'medinet-habu'
  AND (canonical_url = '' OR robots = '' OR og_image = '' OR schema_type = '' OR featured_image_alt = '');

SELECT 'faq entries missing id, question or answer' AS check, count(*) AS bad
FROM posts p, jsonb_array_elements(p.faqs) f
WHERE p.slug = 'medinet-habu'
  AND (coalesce(f->>'id','') = '' OR coalesce(f->>'question','') = '' OR coalesce(f->>'answer','') = '');

SELECT 'em or en dash present' AS check, count(*) AS bad FROM posts
WHERE slug = 'medinet-habu'
  AND (body_en ~ '[\u2013\u2014]' OR meta_title ~ '[\u2013\u2014]' OR meta_description ~ '[\u2013\u2014]' OR title_en ~ '[\u2013\u2014]');

-- Tour links must sit at the site root. Anything under the category path 404s.
SELECT 'tour links under /luxury-egypt-tour-packages/' AS check, count(*) AS bad FROM posts
WHERE slug = 'medinet-habu' AND body_en ~ 'href="/luxury-egypt-tour-packages/[^"]';

SELECT 'root-relative internal links' AS check,
       (SELECT count(*) FROM regexp_matches(body_en, 'href="/[^"]+"', 'g')) AS good,
       (SELECT count(*) FROM regexp_matches(body_en, 'href="(?!/)[^"]+"', 'g')) AS bad
FROM posts WHERE slug = 'medinet-habu';

SELECT 'unfilled placeholders' AS check,
       (SELECT count(*) FROM regexp_matches(body_en, 'data-placeholder=', 'g'))
     + (SELECT count(*) FROM regexp_matches(body_en, '\{\{[A-Z_]+\}\}', 'g')) AS remaining
FROM posts WHERE slug = 'medinet-habu';

SELECT 'other language columns left empty' AS check, count(*) AS bad FROM posts
WHERE slug = 'medinet-habu'
  AND (title_es IS NOT NULL OR title_fr IS NOT NULL OR title_jp IS NOT NULL
       OR body_es IS NOT NULL OR body_fr IS NOT NULL OR body_jp IS NOT NULL);
