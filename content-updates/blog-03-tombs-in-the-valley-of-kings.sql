-- Tombs in the Valley of Kings: Which Three to Pick
-- Blog post 3 of 5. Primary keyword: tombs in the valley of kings
--
-- Scheduled for 2026-09-27T09:00:00+03:00 via posts.scheduled_at, so it stays out of
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
  status, scheduled_at, faqs
) VALUES (
  'tombs-in-the-valley-of-kings',
  'Tombs in the Valley of Kings: Which Three to Pick',
  '<p>Your general ticket covers three tombs. Not all of them, not a timed loop, just three, chosen by you at the gate from whatever is open that day.</p>

<p>Most people do not know this until they are standing at the entrance, and they pick the first three signposted. That is how you end up having seen three small Nineteenth Dynasty tombs with similar layouts and wondering why everyone else seems more impressed than you are. Choosing well among the tombs in the valley of kings is the single biggest difference between a good morning here and a forgettable one.</p>

<h2>How Many Tombs Are in the Valley of the Kings</h2>

<p>Sixty five have been found and numbered, from KV1 to KV65. That is the answer to how many tombs are in the valley of the kings, though it is a number that has moved before and may move again.</p>

<p>What matters more for a visit is how many are open, and that is usually somewhere between eight and a dozen. Tombs rotate in and out of closure for conservation, because visitor breath and sweat do measurable damage to painted plaster. The list on the day is the list you work from, and it is not published far enough ahead to plan around.</p>

<p>So treat what follows as a priority order rather than an itinerary. If your first choice is closed, go down the list.</p>

<h2>Which Tombs in the Valley of Kings to Choose</h2>

<p>If all three are open, take Ramesses VI, Ramesses III and Merenptah. Here is why.</p>

<p><strong>KV9, Ramesses VI.</strong> The best value on the general ticket by a wide margin. A long straight descent with the ceiling covered end to end in astronomical scenes, and colour that has survived unusually well. It is also large enough to absorb a crowd without feeling like a queue.</p>

<p><strong>KV11, Ramesses III.</strong> Notable for the side chambers, which carry scenes of daily life rather than the usual funerary formulas. Boats, harvests, craftsmen, musicians. After two tombs of gods and gates, it is a change of register that makes the whole valley read differently.</p>

<p><strong>KV8, Merenptah.</strong> Big, steep, and less visited than the two above. The descent is dramatic and the sarcophagus lid in the burial chamber is worth the walk down.</p>

<p>If one of those is shut, Ramesses IV (KV2) is the easiest substitute: short, bright, heavily decorated, and right near the entrance.</p>

<h2>What the Separate Tickets Buy You</h2>

<p>Three tombs carry their own charge on top of the general ticket. They are not upsells in the usual sense; they are genuinely different propositions.</p>

<table>
<thead>
<tr><th>Tomb</th><th>What you get</th><th>Worth the extra?</th></tr>
</thead>
<tbody>
<tr><td>Tutankhamun (KV62)</td><td>A small, plain tomb with the mummy on display in situ</td><td>Only if the story matters more to you than the painting</td></tr>
<tr><td>Seti I (KV17)</td><td>The largest and finest tomb in the valley, recently reopened</td><td>Yes, if you can afford one splurge</td></tr>
<tr><td>Nefertari (QV66)</td><td>The best preserved painted tomb in Egypt, in the Valley of the Queens</td><td>Yes, and it is the one people regret skipping</td></tr>
</tbody>
</table>

<p>Current prices are <mark data-placeholder="vok-separate-tickets">FILL IN: current separate ticket prices for Tutankhamun, Seti I and Nefertari</mark>.</p>

<h2>Tutankhamun: The Honest Assessment</h2>

<p>KV62 is small. It was cut for someone else, adapted in a hurry, and consists of an antechamber and a burial chamber with decoration on one wall.</p>

<p>Everything that made it famous is in the Grand Egyptian Museum now. What remains here is the outermost coffin, the sarcophagus, and the mummy itself in a climate controlled case.</p>

<p>Whether that is worth a separate ticket depends entirely on what you want. If you have read about Carter and 1922 and want to stand where it happened, go. If you came for painted walls, spend the same money on Nefertari and you will be far happier.</p>

<h2>Seti I: The One That Justifies the Price</h2>

<p>KV17 was closed for decades and reopened with a high separate charge. It is the deepest, longest and most completely decorated tomb in the valley, and the relief carving is on a level nothing else here matches.</p>

<p>The ticket is expensive enough that most visitors walk past it. If you are choosing one thing to spend extra on and you care about ancient art rather than ancient celebrity, this is it.</p>

<p>Allow longer than you think. The descent is substantial and stopping to look is the entire point.</p>

<h2>Nefertari and the Valley of the Queens</h2>

<p>Strictly this is not in the same valley, which is why people miss it. The Valley of the Queens is a short drive away and holds QV66, the tomb of Ramesses II''s principal wife.</p>

<p>The painting is the finest surviving from the ancient world, and the reason is slightly grim: the tomb was closed to the public for most of the twentieth century, so it has not been breathed on. Visits are limited in number and duration to keep it that way.</p>

<p>Ten minutes inside is the allowance, and ten minutes is enough to understand why conservators fought so hard over it.</p>

<h2>Valley of the Kings Tickets and How Buying Works</h2>

<p>Everything is bought at the ticket office before the shuttle, not at the tomb entrances. Decide your three before you get to the window, because the queue behind you is not a good place to deliberate.</p>

<p>General entry is <mark data-placeholder="vok-general-ticket">FILL IN: current general Valley of the Kings ticket price, and whether it still covers three tombs</mark>. Photography inside carries a separate permit, and the rules change, so ask when you buy rather than assuming.</p>

<p>Valley of the kings tickets do not include the tram between the office and the tomb area. It is a small extra and most people pay it; the walk is about fifteen minutes uphill in full sun.</p>

<h2>The Ones to Skip, and Why</h2>

<p>Nobody publishes this list, so here it is.</p>

<p>Ramesses I (KV16) is short and lightly decorated. It is a fine tomb and it is not one of your three.</p>

<p>Tausert and Setnakht (KV14) is enormous and confusing, with two overlapping schemes of decoration from two different occupants. Interesting if you already know the period well, frustrating if you do not.</p>

<p>The smaller Eighteenth Dynasty shafts, when they are open, are historically important and visually sparse. Thutmose III (KV34) is the exception and worth a slot if it is open, partly for the near vertical climb to reach it.</p>

<p>The general rule with tombs in the valley of kings is that later usually means bigger and brighter. If you are choosing on looks alone, favour the Twentieth Dynasty.</p>

<h2>Timing, Heat and the Thing Nobody Warns You About</h2>

<p>Get there at opening. Not an hour after, at opening.</p>

<p>The valley is a rock bowl with no shade and it stores heat all day. By eleven in summer the walk between tomb entrances is genuinely unpleasant, and inside the tombs it is worse: the deeper shafts are hot, still and crowded, and there is no airflow.</p>

<p>That is the part nobody warns you about. People imagine tombs as cool. They are not. Seti I in the afternoon in August is a test of character.</p>

<p>Go in October to April if you have the choice. If you are here in summer, be at the gate when it opens and be finished by ten.</p>

<h2>How Long to Allow</h2>

<p>Two and a half hours covers three tombs at an unhurried pace plus the shuttle and the walking. Add forty minutes if you are adding Seti I, and another hour if you are including the Valley of the Queens.</p>

<p>Most west bank itineraries pair this with Hatshepsut''s temple and either Medinet Habu or the Colossi of Memnon, which makes a full morning. That is the right shape: the valley first while it is cool, the temples after.</p>

<p>Our <a href="/12-days-egypt-tour">twelve day Egypt itinerary</a> splits the west bank across two mornings rather than one, which is the main thing that makes Nefertari and Seti I fit without a forced march.</p>

<h2>Before You Go</h2>

<p>Bring water and small notes for the tram and the permits. Wear something you can climb stairs in, because every tomb is a descent and a return.</p>

<p>Take small change for the tomb guardians. Nobody asks for it outright and a note handed over quietly will often get you a torch pointed at a ceiling detail you would otherwise have walked past. It is part of how the place works.</p>

<p>Read one page about the Book of Gates before you arrive. The wall scenes in most of these tombs are illustrating the same journey, and once you recognise the sequence you stop seeing decoration and start seeing a text.</p>

<p>For the rest of the city, the <a href="/egypt-travel-guide/attractions-in-luxor">Luxor area guide</a> covers the east bank temples and how to split the two sides. If you are heading further south afterwards, the <a href="/blog/abu-simbel-tour-from-aswan">Abu Simbel guide</a> covers the flight and road decision from Aswan.</p>

<p>One last practical note: the tomb numbers are painted above the entrances but the names are not always signed clearly. Write your three down, with the KV numbers, before you hand over your ticket. Staff at the doors work from numbers, not from pharaohs.</p>',
  'The general ticket buys you three tombs out of about a dozen open on the day. Choosing badly is the most common mistake visitors make on the Luxor west bank.',
  'Travel Guides',
  ARRAY['Valley of the Kings', 'Luxor', 'Tombs', 'West Bank']::text[],
  'tombs in the valley of kings',
  'Tombs in the Valley of Kings: Which to Choose',
  'Your ticket covers three tombs in the valley of kings out of roughly a dozen open. Here is how to choose them, and which separate tickets are worth paying for.',
  'published',
  '2026-09-27T09:00:00+03:00'::timestamptz,
  '[{"id":"6992e93c-7f9f-4201-9511-b08d136db3ed","question":"How many tombs does the general Valley of the Kings ticket cover?","answer":"Three, chosen by you from whatever is open on the day. Tombs rotate in and out of closure for conservation, so the available list is usually between eight and a dozen and is not published far in advance."},{"id":"42bf711c-ee99-4b3d-bb40-a4e26ce7fca1","question":"How many tombs are in the Valley of the Kings in total?","answer":"Sixty five have been found and numbered, from KV1 to KV65. Only a fraction are open to visitors at any one time, and the open list changes as conservation work moves around the valley."},{"id":"e0ca0d59-73e1-421e-aab1-9a92a4665c24","question":"Which three tombs should I choose?","answer":"Ramesses VI for its astronomical ceiling, Ramesses III for the daily life scenes in its side chambers, and Merenptah for the scale of the descent. If one is closed, Ramesses IV near the entrance is the easiest substitute."},{"id":"af8189e0-53dc-4db7-811d-e420500fc80c","question":"Is the Tutankhamun tomb worth the separate ticket?","answer":"Only if the discovery story matters more to you than the painting. The tomb is small and nearly bare because the contents are now in the Grand Egyptian Museum. What remains is the sarcophagus, the outer coffin and the mummy itself."},{"id":"e0f4250c-7f98-4cf5-a8cc-10f1a86a6095","question":"Is the Seti I tomb worth the extra cost?","answer":"Yes if you are making one splurge and you care about ancient art. KV17 is the deepest and most completely decorated tomb in the valley and the relief carving is better than anything else on the west bank."},{"id":"49b2fd85-2130-4a1a-b884-13a62d2490e3","question":"What is the best time of day to visit?","answer":"Opening time. The valley is a rock bowl with no shade and it holds heat, and the deeper tombs get hot and airless by late morning. Between October and April the timing is more forgiving, but early is still better."},{"id":"4cb87230-6f24-422b-a348-811267e4616a","question":"Do I need a photography permit inside the tombs?","answer":"Usually yes, bought separately at the ticket office, and the rules change from season to season. Ask at the window when you buy your entry rather than finding out at a tomb door."}]'::jsonb
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
       (SELECT count(*) FROM regexp_matches(body_en, 'tombs in the valley of kings', 'gi')) AS primary_hits
FROM posts WHERE slug = 'tombs-in-the-valley-of-kings';

SELECT 'seo lengths out of range' AS check, count(*) AS bad FROM posts
WHERE slug = 'tombs-in-the-valley-of-kings' AND (length(meta_title) > 60 OR length(meta_description) NOT BETWEEN 150 AND 160);

SELECT 'faq count out of range' AS check, count(*) AS bad FROM posts
WHERE slug = 'tombs-in-the-valley-of-kings' AND jsonb_array_length(faqs) NOT BETWEEN 5 AND 7;

SELECT 'faq entries missing id, question or answer' AS check, count(*) AS bad
FROM posts p, jsonb_array_elements(p.faqs) f
WHERE p.slug = 'tombs-in-the-valley-of-kings'
  AND (coalesce(f->>'id','') = '' OR coalesce(f->>'question','') = '' OR coalesce(f->>'answer','') = '');

SELECT 'em or en dash present' AS check, count(*) AS bad FROM posts
WHERE slug = 'tombs-in-the-valley-of-kings'
  AND (body_en ~ '[\u2013\u2014]' OR meta_title ~ '[\u2013\u2014]' OR meta_description ~ '[\u2013\u2014]' OR title_en ~ '[\u2013\u2014]');

-- Tour links must sit at the site root. Anything under the category path 404s.
SELECT 'tour links under /luxury-egypt-tour-packages/' AS check, count(*) AS bad FROM posts
WHERE slug = 'tombs-in-the-valley-of-kings' AND body_en ~ 'href="/luxury-egypt-tour-packages/[^"]';

SELECT 'root-relative internal links' AS check,
       (SELECT count(*) FROM regexp_matches(body_en, 'href="/[^"]+"', 'g')) AS good,
       (SELECT count(*) FROM regexp_matches(body_en, 'href="(?!/)[^"]+"', 'g')) AS bad
FROM posts WHERE slug = 'tombs-in-the-valley-of-kings';

SELECT 'unfilled placeholders' AS check,
       (SELECT count(*) FROM regexp_matches(body_en, 'data-placeholder=', 'g'))
     + (SELECT count(*) FROM regexp_matches(body_en, '\{\{[A-Z_]+\}\}', 'g')) AS remaining
FROM posts WHERE slug = 'tombs-in-the-valley-of-kings';

SELECT 'other language columns left empty' AS check, count(*) AS bad FROM posts
WHERE slug = 'tombs-in-the-valley-of-kings'
  AND (title_es IS NOT NULL OR title_fr IS NOT NULL OR title_jp IS NOT NULL
       OR body_es IS NOT NULL OR body_fr IS NOT NULL OR body_jp IS NOT NULL);
