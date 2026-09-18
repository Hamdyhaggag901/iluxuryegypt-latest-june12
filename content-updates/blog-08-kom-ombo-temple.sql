-- Kom Ombo Temple and Edfu: The Two Temples You See from the River
-- Blog post 8 of 13. Primary keyword: kom ombo temple
--
-- Scheduled for 2026-10-11T09:00:00+03:00 via posts.scheduled_at, so it stays out of
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
  'kom-ombo-temple',
  'Kom Ombo Temple and Edfu: The Two Temples You See from the River',
  '<p>One of these temples is built for two gods who could not share a room.</p>

<p>Kom ombo temple has two of everything. Two entrances, two hypostyle halls, two sanctuaries, twin axes running side by side down the length of the building with an invisible line between them. Sobek the crocodile god on the south, Haroeris the elder Horus on the north, each with a complete temple of his own inside one set of walls. There is nothing else quite like it in Egypt.</p>

<p>Ninety minutes downstream, Edfu is the opposite proposition: one god, one axis, and a building so complete that walking into it is the closest you will get to seeing an Egyptian temple as it was meant to be seen.</p>

<h2>Why You See These Two and Not Others</h2>

<p>Both sit on the stretch of river between Aswan and Luxor, and both are within walking distance of a mooring. That is the whole reason they are on every itinerary: the boat stops at the door.</p>

<p>It also explains the strange hours. Cruises sail overnight and moor early, so Edfu usually happens between six and eight in the morning and Kom Ombo in the late afternoon or after dark. Neither timing was chosen for your benefit, but both turn out to be the best hours at each site anyway.</p>

<h2>What Makes Kom Ombo Temple Unusual</h2>

<p>Start at the front and look along the building rather than into it. The symmetry is the point and it is easiest to read from the outside edge of the forecourt, where you can see both axes at once.</p>

<p>The sharing was not a compromise. Sobek and Haroeris had separate priesthoods, separate offerings and separate festivals, and the architecture keeps them apart at every stage while giving neither the better half. Where a normal temple narrows toward one sanctuary, this one narrows toward two.</p>

<p>The Temple of Kom Ombo we see is Ptolemaic, begun in the second century BC on a site used long before that, with Roman additions on the front. Much of the outer structure has gone, taken by the river and by people needing stone, which is why the plan is so legible: you are looking at a cutaway.</p>

<h2>The Relief Everyone Photographs</h2>

<p>On the rear wall of the outer corridor is a panel showing what are usually described as surgical instruments: scalpels, forceps, suction cups, scales, a case of blades.</p>

<p>The identification is not certain and some Egyptologists read several of the objects as ritual rather than medical. What is not in doubt is the connection to healing, because this was a place people came to be cured, and the same wall carries the goddess of childbirth on her birthing stool.</p>

<p>Nearby is a set of carved calendars and, in the courtyard, a deep nilometer shaft cut down to the water table, used to measure the flood and set the year''s taxes.</p>

<p>The nilometer is worth a minute of attention. A high reading meant a good harvest and a heavy tax assessment, a low one meant famine, and the priests who read the marks held a genuinely political job. The steps go down further than the current water level and you can see the graduations cut into the wall.</p>

<h2>The Crocodile Museum</h2>

<p>A small building beside the temple holds a couple of dozen mummified crocodiles, laid out in a dim, cool, well designed room that takes fifteen minutes and costs a separate ticket.</p>

<p>Some are hatchlings and some are close to five metres. They were votive offerings to Sobek, bred and mummified in enormous numbers, and seeing them graded by size does more to explain what this temple was for than anything on the walls.</p>

<p>If your group skips it, go anyway. It is the best use of a quarter of an hour on the whole stretch of river.</p>

<h2>Edfu, and Why It Survived</h2>

<p>The Temple of Horus Edfu is the most complete ancient building left standing in Egypt, and completeness is a rarer quality than size. Roof on, pylon intact, gates in place, the sanctuary still holding a granite shrine.</p>

<p>It survived by being buried. Sand and the debris of the village built on top of it covered the temple almost to the tops of the pylons, and it stayed covered until Auguste Mariette cleared it in the 1860s. What protects a temple from weather and quarrying, it turns out, is forty feet of rubbish.</p>

<p>Construction ran from 237 BC to 57 BC. Nearly two centuries for one building, and the texts covering its walls record the process, which is why we know more about how this temple was built and run than about almost any other.</p>

<h2>What to Look For Inside</h2>

<p>The falcon. Two black granite statues of Horus stand in the court, and the one by the entrance, wearing the double crown, is the image on half the postcards in Upper Egypt.</p>

<p>The walls of the ambulatory carry the Triumph of Horus, a sequence showing his battle with Set, who appears as a comically small hippopotamus so that the god is never shown struggling. It was performed as a drama here, and the text reads like a script because it was one.</p>

<p>Then find the stairs. The temple of edfu egypt is best understood from is the roof route, where the new year procession carried the god''s statue up to be touched by sunlight. The staircases are decorated with that procession, walking up on one side and down on the other.</p>

<h2>The Horses at Edfu</h2>

<p>Here is the uncomfortable part. The mooring is about two kilometres from the temple and the traditional transfer is a caleche, a horse drawn carriage, past a line of them waiting at the quay.</p>

<p>The condition of the animals varies a great deal and many visitors find the experience distressing. There is no requirement to take one. Taxis and minibuses cover the same distance, most cruise directors will arrange one if asked the night before, and asking costs nothing.</p>

<p>If you do take a caleche, look at the horse before you choose the carriage. Drivers notice which animals get picked, and that is the only pressure that has ever changed anything here.</p>

<h2>How Long Each One Takes</h2>

<p>Kom Ombo needs forty five minutes plus fifteen for the crocodiles. It is a small site and a flat one, and an hour is genuinely enough.</p>

<p>Edfu needs ninety minutes to do properly, including the roof stairs and the outer corridor. Many cruises allow forty. If yours does, skip the courtyard photographs, walk straight through to the hypostyle hall and work outward from the sanctuary, because the interior is what you came for.</p>

<p>Being honest about that trade is better than pretending it is not happening. A forty minute stop at the most complete temple in Egypt is a glimpse, not a visit.</p>

<p>The same applies in reverse. Some itineraries allow two hours at Kom Ombo, which is roughly an hour more than the site needs, and the extra is usually spent in the bazaar on the way back to the boat. If you would rather read on deck, nobody will mind.</p>

<h2>Kom Ombo After Dark</h2>

<p>The site is floodlit, and a fair number of cruises moor there in the evening rather than the afternoon. If yours does, you have drawn the better card.</p>

<p>The lighting is aimed along the columns rather than at them, which throws the relief into much sharper contrast than flat daylight ever does. The twin axes read more clearly too, because the two halves are lit separately and the division between them becomes a line of shadow down the middle of the building.</p>

<p>It is also twenty degrees cooler and the river is right there. A kom ombo temple visit at nine at night, with the boat moored fifty metres away and almost nobody on the site, is the quietest hour anyone gets on a standard cruise itinerary.</p>

<h2>Going Without a Cruise</h2>

<p>Both are reachable by road. Edfu is about an hour and forty minutes south of Luxor, Kom Ombo about forty five minutes north of Aswan, and a car between the two cities can take in both with an early start.</p>

<p>That is the way to see them without a clock on you, and it is the only way to be at Edfu at opening without being one of four hundred people off the boats. The gate opens at seven and the coaches arrive at eight.</p>

<p>Most people will still see them from the water, and that is not a bad thing. Our <a href="/egypt-nile-cruise-packages">Nile cruise itineraries</a> are built around these moorings, and arriving at a temple by river rather than by car bus is genuinely different.</p>

<h2>Tickets and Practical Notes</h2>

<p>Entry prices at both sites change most years and are card only, as they now are across Upper Egypt. Check the current rate before you go, or ask your operator to confirm it alongside your itinerary. The Crocodile Museum is a separate charge from the temple next to it.</p>

<p>Take a torch or use your phone. The interiors at Edfu are genuinely dark and the best relief is in the corridors where no daylight reaches.</p>

<p>Wear something with sleeves if you are visiting in the middle of the day. Neither site has a dress code, but the walk in at both is exposed and the forecourt at Edfu holds heat like a pan.</p>

<p>Both sites have a bazaar between the gate and the transport, and at Edfu it is unavoidable on the way out. Prices start high and the sellers expect it; if you are not buying, a friendly no and a steady walking pace works better than avoiding eye contact.</p>

<p>There is no shade at either site except inside the buildings. At Kom Ombo in particular the walk from the road to the temple is fully exposed, which is another argument for the late afternoon slot the cruises use.</p>

<p>For the rest of the river, the <a href="/egypt-travel-guide/aswan-egypt-attractions">Aswan area guide</a> covers the southern end, and the <a href="/blog/what-to-see-in-luxor">Luxor guide</a> covers the northern one. If you are sailing, the two temples here are the only stops between them, which is worth knowing when you are deciding how much time to spend on deck.</p>

<p>One last detail at Kom Ombo, and almost nobody points it out. Stand between the two sanctuaries at the back of the temple and look forward. From that exact spot the two halves of the building line up perfectly, and you can see why the architects went to the trouble.</p>',
  'Every Nile cruise stops at both, usually at odd hours and usually in a hurry. Knowing what you are looking at turns two brief stops into the most interesting morning of the sailing.',
  'Destinations',
  ARRAY['Kom Ombo', 'Edfu', 'Nile Cruise', 'Temples']::text[],
  'kom ombo temple',
  'Kom Ombo Temple and Edfu: The Two River Temples',
  'Kom ombo temple is a double sanctuary for two gods and Edfu is the most complete building left in Egypt. What to look for, and how long each actually takes.',
  'published',
  '2026-10-11T09:00:00+03:00'::timestamptz,
  '[{"id":"999d5947-2e41-542b-a4a1-99f219fd2de2","question":"Why does Kom Ombo have two sanctuaries?","answer":"Because it served 2 gods with separate priesthoods: Sobek the crocodile god on the south side and Haroeris, the elder Horus, on the north. The building gives each a full temple of its own, with 2 entrances, 2 hypostyle halls and 2 sanctuaries running on parallel axes inside 1 set of walls. Nothing else in Egypt is laid out this way."},{"id":"a0e78c85-8622-56c3-92ea-ce761e97a206","question":"Which is better, Edfu or Kom Ombo?","answer":"Edfu, for the building itself. It is the most complete ancient temple standing in Egypt, with its roof, pylon and sanctuary shrine intact, and it needs 90 minutes. Kom Ombo is smaller and takes about 45, but its double plan is unique and the crocodile museum beside it is the best 15 minutes on this stretch of river."},{"id":"7ae40318-477b-5a7a-a51d-bd5560151256","question":"Why is the Edfu temple so well preserved?","answer":"It was buried. Sand and the debris of a village built on top covered it almost to the tops of the pylons, and it stayed covered until Auguste Mariette cleared it in the 1860s. Roughly 40 feet of rubbish protected it from weather and from stone robbing for centuries, which is why the roof is still on."},{"id":"36cfdf07-a6c6-584e-88ab-a0a217423e3c","question":"Do you have to take a horse carriage at Edfu?","answer":"No. The mooring is about 2 km from the temple and the caleche is traditional, not compulsory. The condition of the horses varies and many visitors find it distressing. Taxis and minibuses cover the same distance and most cruise directors will arrange one if you ask the night before, which costs nothing."},{"id":"804b328c-cf02-5724-a822-a878f3bb4739","question":"Are the Kom Ombo carvings really surgical instruments?","answer":"Probably, though it is not settled. The panel shows scalpels, forceps, suction cups, scales and a case of blades on a Ptolemaic wall begun in the 2nd century BC, and some Egyptologists read several objects as ritual rather than medical. The healing connection is not in doubt: people came here to be cured, and the same wall shows the goddess of childbirth on her stool."},{"id":"17fd62a3-3f13-51af-8031-005d2fcec48d","question":"How long do you need at each temple?","answer":"About 1 hour at Kom Ombo including the crocodile museum, and 90 minutes at Edfu. Many cruises allow only 40 minutes at Edfu. If yours does, skip the courtyard photographs and go straight to the hypostyle hall and sanctuary, then work outward, because the interior is the reason the temple is famous."},{"id":"3547da14-82e7-52c8-90a7-055a0d0c4d85","question":"Can you visit Edfu and Kom Ombo without a Nile cruise?","answer":"Yes, by road. Edfu is about 1 hour 40 minutes south of Luxor and Kom Ombo about 45 minutes north of Aswan, so a car travelling between the 2 cities can take in both. It is also the only way to reach Edfu at the 7am opening rather than arriving with the coaches at 8."},{"id":"bf6a09d5-66ee-5a4c-aac9-7b8cfbc5be44","question":"Is the crocodile museum at Kom Ombo worth a separate ticket?","answer":"Yes. A small building beside the temple holds around 20 mummified crocodiles, from hatchlings to specimens near 5 metres, all votive offerings to Sobek. It takes 15 minutes and costs a separate ticket. Seeing them graded by size explains what this temple was for better than anything on the walls does."}]'::jsonb,
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
FROM posts WHERE slug = 'kom-ombo-temple';
SELECT slug,
       length(meta_title) AS title_len,
       length(meta_description) AS meta_len,
       jsonb_array_length(faqs) AS faq_count,
       array_length(regexp_split_to_array(regexp_replace(body_en, '<[^>]+>', ' ', 'g'), '\s+'), 1) AS body_words,
       scheduled_at,
       schema_type,
       (SELECT count(*) FROM regexp_matches(body_en, 'kom ombo temple', 'gi')) AS primary_hits
FROM posts WHERE slug = 'kom-ombo-temple';

SELECT 'seo lengths out of range' AS check, count(*) AS bad FROM posts
WHERE slug = 'kom-ombo-temple' AND (length(meta_title) > 60 OR length(meta_description) NOT BETWEEN 150 AND 160);

SELECT 'faq count out of range' AS check, count(*) AS bad FROM posts
WHERE slug = 'kom-ombo-temple' AND jsonb_array_length(faqs) NOT BETWEEN 7 AND 8;

-- Answers are written to be quoted on their own by an AI answer engine, which
-- means 40 to 80 words each. Outside that they are either empty or too long.
SELECT 'faq answers outside 40-80 words' AS check, count(*) AS bad
FROM posts p, jsonb_array_elements(p.faqs) f
WHERE p.slug = 'kom-ombo-temple'
  AND array_length(regexp_split_to_array(trim(f->>'answer'), '\s+'), 1) NOT BETWEEN 40 AND 80;

-- The SEO overrides must be NULL, not empty strings, or the fallbacks break.
SELECT 'seo overrides stored as empty strings' AS check, count(*) AS bad FROM posts
WHERE slug = 'kom-ombo-temple'
  AND (canonical_url = '' OR robots = '' OR og_image = '' OR schema_type = '' OR featured_image_alt = '');

SELECT 'faq entries missing id, question or answer' AS check, count(*) AS bad
FROM posts p, jsonb_array_elements(p.faqs) f
WHERE p.slug = 'kom-ombo-temple'
  AND (coalesce(f->>'id','') = '' OR coalesce(f->>'question','') = '' OR coalesce(f->>'answer','') = '');

SELECT 'em or en dash present' AS check, count(*) AS bad FROM posts
WHERE slug = 'kom-ombo-temple'
  AND (body_en ~ '[\u2013\u2014]' OR meta_title ~ '[\u2013\u2014]' OR meta_description ~ '[\u2013\u2014]' OR title_en ~ '[\u2013\u2014]');

-- Tour links must sit at the site root. Anything under the category path 404s.
SELECT 'tour links under /luxury-egypt-tour-packages/' AS check, count(*) AS bad FROM posts
WHERE slug = 'kom-ombo-temple' AND body_en ~ 'href="/luxury-egypt-tour-packages/[^"]';

SELECT 'root-relative internal links' AS check,
       (SELECT count(*) FROM regexp_matches(body_en, 'href="/[^"]+"', 'g')) AS good,
       (SELECT count(*) FROM regexp_matches(body_en, 'href="(?!/)[^"]+"', 'g')) AS bad
FROM posts WHERE slug = 'kom-ombo-temple';

SELECT 'unfilled placeholders' AS check,
       (SELECT count(*) FROM regexp_matches(body_en, 'data-placeholder=', 'g'))
     + (SELECT count(*) FROM regexp_matches(body_en, '\{\{[A-Z_]+\}\}', 'g')) AS remaining
FROM posts WHERE slug = 'kom-ombo-temple';

SELECT 'other language columns left empty' AS check, count(*) AS bad FROM posts
WHERE slug = 'kom-ombo-temple'
  AND (title_es IS NOT NULL OR title_fr IS NOT NULL OR title_jp IS NOT NULL
       OR body_es IS NOT NULL OR body_fr IS NOT NULL OR body_jp IS NOT NULL);
