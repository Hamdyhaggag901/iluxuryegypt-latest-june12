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
  status, scheduled_at, faqs, schema_type
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

<p>If all three are open, take Thutmose III, Ramesses III and Merenptah. Here is why.</p>

<p><strong>KV34, Thutmose III.</strong> The strangest tomb open on the general ticket. You reach it by a steep staircase up a cleft in the cliff, the burial chamber is oval rather than rectangular, and the walls carry the Amduat drawn in a cursive, almost sketched hand that looks nothing like the formal painting everywhere else. The climb puts people off, which is part of the appeal.</p>

<p><strong>KV11, Ramesses III.</strong> Notable for the side chambers, which carry scenes of daily life rather than the usual funerary formulas. Boats, harvests, craftsmen, musicians. After two tombs of gods and gates, it is a change of register that makes the whole valley read differently.</p>

<p><strong>KV8, Merenptah.</strong> Big, steep, and less visited than the two above. The descent is dramatic and the sarcophagus lid in the burial chamber is worth the walk down.</p>

<p>If one of those is shut, Ramesses IV (KV2) is the easiest substitute: short, bright, heavily decorated, and right near the entrance.</p>

<p>The rotating list your three are drawn from usually holds KV2 Ramesses IV, KV6 Ramesses IX, KV8 Merenptah, KV11 Ramesses III, KV14 Tausert and Setnakht, KV15 Seti II, KV34 Thutmose III, KV43 Thutmose IV and KV47 Siptah.</p>

<h2>What the Separate Tickets Buy You</h2>

<p>Four tombs inside the valley carry their own charge on top of the general ticket. They are not upsells in the usual sense; they are genuinely different propositions.</p>

<p>All prices below were checked in September 2026 and change without much warning, so treat them as a guide rather than a quote.</p>

<table>
<thead>
<tr><th>Tomb</th><th class="price">Price</th><th>Worth the extra?</th></tr>
</thead>
<tbody>
<tr><td>Ramesses V and VI (KV9)</td><td class="price">220 EGP, about 4 USD</td><td>Yes. The best value on the west bank, for an astronomical ceiling that runs the full length of the tomb</td></tr>
<tr><td>Tutankhamun (KV62)</td><td class="price">700 EGP, about 13 USD</td><td>Only if the story matters more to you than the painting</td></tr>
<tr><td>Seti I (KV17)</td><td class="price">2,000 EGP, about 42 USD</td><td>For the art, and only if one splurge is in the budget</td></tr>
<tr><td>Ay (WV23)</td><td class="price">200 EGP</td><td>Rarely, and only if you are already deep in the subject</td></tr>
</tbody>
</table>

<p>If you buy one of these, make it KV9. Two hundred and twenty pounds is the smallest sum on the west bank that changes a day, and that ceiling is the best single thing most visitors will see here.</p>

<p>Nefertari is not on this list, and the reason surprises people.</p>

<h2>Tutankhamun: The Honest Assessment</h2>

<p>KV62 is small. It was cut for someone else, adapted in a hurry, and consists of an antechamber and a burial chamber with decoration on one wall.</p>

<p>Everything that made it famous is in the Grand Egyptian Museum now. What remains here is the outermost coffin, the sarcophagus, and the mummy itself in a climate controlled case.</p>

<p>Whether that is worth 700 pounds depends entirely on what you want. If you have read about Carter and 1922 and want to stand where it happened, go. If you came for painted walls, the 220 pounds for KV9 next door buys a great deal more of them.</p>

<h2>Seti I: The One That Justifies the Price</h2>

<p>KV17 was closed for decades and reopened with a high separate charge. It is the deepest, longest and most completely decorated tomb in the valley, and the relief carving is on a level nothing else here matches.</p>

<p>The ticket is expensive enough that most visitors walk past it. If you are choosing one thing to spend extra on and you care about ancient art rather than ancient celebrity, this is it.</p>

<p>Allow longer than you think. The descent is substantial and stopping to look is the entire point.</p>

<h2>Nefertari Is Not in the Valley of the Kings</h2>

<p>This one catches almost everybody, guidebooks included. Nefertari''s tomb is QV66, and the QV stands for Queens. It sits in the Valley of the Queens, a separate site about two kilometres away with its own entrance, its own ticket office and its own opening hours.</p>

<p>So you cannot add her to a Valley of the Kings ticket, and asking at the Kings gate is how most people find that out, usually with half a morning left. If she is on your list, plan a second stop.</p>

<p>The Valley of the Queens general ticket is 220 pounds and covers four tombs. Nefertari is 1,700 pounds on top of that, about 36 US dollars, with entry capped at roughly ten minutes.</p>

<p>She is worth it. The painting is the finest surviving from the ancient world, for a slightly grim reason: the tomb was shut for most of the twentieth century, so it has not been breathed on. Ten minutes is enough to understand why conservators fought so hard over it.</p>

<h2>Valley of the Kings Tickets and How Buying Works</h2>

<p>Everything is bought at the ticket office before the shuttle, not at the tomb entrances, and payment is by card only. There is no cash desk, which strands a surprising number of people every morning. The Seti I ticket is the exception: it is sold at the visitor centre before the electric train.</p>

<p>Decide your three before you get to the window, because the queue behind you is not a good place to deliberate.</p>

<p>General entry is 750 Egyptian pounds, about 16 US dollars, and it still covers three tombs. A foreign student or a child aged 6 to 12 pays 380.</p>

<p>Photography has settled into something workable: a phone is free as long as the flash is off, a DSLR needs a 300 pound permit, and inside Tutankhamun''s tomb no camera of any kind is allowed. That last one is enforced.</p>

<p>Valley of the kings tickets do not include the tram between the office and the tomb area. It is a small extra and most people pay it; the walk is about fifteen minutes uphill in full sun.</p>

<h2>The Ones to Skip, and Why</h2>

<p>Nobody publishes this list, so here it is.</p>

<p>Ramesses I (KV16) is short and lightly decorated. It is a fine tomb and it is not one of your three.</p>

<p>Tausert and Setnakht (KV14) is enormous and confusing, with two overlapping schemes of decoration from two different occupants. Interesting if you already know the period well, frustrating if you do not.</p>

<p>The smaller Eighteenth Dynasty shafts, when they are open, are historically important and visually sparse. Thutmose III (KV34) is the exception, which is why it is one of the three above rather than a fallback.</p>

<p>The general rule with tombs in the valley of kings is that later usually means bigger and brighter. If you are choosing on looks alone, favour the Twentieth Dynasty, with KV34 as the one worth breaking the rule for.</p>

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
  'Culture & History',
  ARRAY['Valley of the Kings', 'Luxor', 'Tombs', 'West Bank']::text[],
  'tombs in the valley of kings',
  'Tombs in the Valley of Kings: Which to Choose',
  'Your ticket covers three tombs in the valley of kings out of roughly a dozen open. Here is how to choose them, and which separate tickets are worth paying for.',
  'published',
  '2026-09-27T09:00:00+03:00'::timestamptz,
  '[{"id":"c831bd8a-3ba3-4d72-bfcd-8d8e871f9da1","question":"How many tombs does the general Valley of the Kings ticket cover?","answer":"3 tombs, chosen by you at the gate from whatever is open that day, for 750 Egyptian pounds as of September 2026. The open list is usually between 8 and 12 and changes as conservation work moves around the valley, because visitor breath and sweat damage painted plaster. Payment at the office is by card only, with no cash desk."},{"id":"015bd907-c701-4893-89a5-cacb495a5fe6","question":"How many tombs are in the Valley of the Kings in total?","answer":"65 have been found and numbered, from KV1 to KV65. Only 8 to 12 are open to visitors at any one time. The number has moved before and may move again: KV64 and KV65 were both identified in the 2000s, so the valley is not a closed set even after 2 centuries of excavation."},{"id":"a93874b5-55b5-4574-9235-953a9d232295","question":"Which 3 tombs should you choose in the Valley of the Kings?","answer":"Thutmose III (KV34), Ramesses III (KV11) and Merenptah (KV8), if all 3 are open. KV34 has an oval burial chamber and a cursive Amduat, KV11 has side chambers of daily life scenes, and KV8 has the most dramatic descent. Ramesses VI (KV9) is often recommended but cannot be one of your three: it carries its own 220 pound ticket."},{"id":"d728ca68-0ca6-41dc-9e96-e795bc63be9b","question":"Is the Tutankhamun tomb worth the separate ticket?","answer":"Only if the discovery story matters more to you than the painting. KV62 costs 700 Egyptian pounds on top of general entry, about 13 US dollars, and it is small: cut for someone else, adapted in a hurry, with decoration on 1 wall. Everything famous from it is in the Grand Egyptian Museum. Cameras of any kind are banned inside."},{"id":"ffedd4e7-cd62-4dca-b6c3-76bae15fc3e6","question":"Is the Seti I tomb worth the extra cost?","answer":"Yes, if you are making 1 splurge and you care about ancient art rather than ancient celebrity. KV17 costs 2,000 Egyptian pounds, about 42 US dollars, which is why most visitors walk past it. It is the deepest and most completely decorated tomb in the valley, and its relief carving beats anything else on the west bank. Buy that ticket at the visitor centre."},{"id":"f4704ff4-d0ae-46be-a62e-e04a0a747f28","question":"Which is better, Nefertari''s tomb or Tutankhamun''s?","answer":"Nefertari (QV66) for almost everyone, but the 2 are not in the same place. QV66 is in the Valley of the Queens, a separate site about 2 km away, and costs 1,700 Egyptian pounds on top of that valley''s own 220 pound ticket. Its painting is the best preserved to survive from the ancient world, and visits are capped at about 10 minutes."},{"id":"e200c02b-7e45-40f9-a54c-7792f203d629","question":"What is the best time of day to visit the Valley of the Kings?","answer":"Opening time, and in summer be finished by 10am. The valley is a rock bowl with no shade that stores heat all day, and the deeper tombs are hot, still and airless rather than cool. Between October and April the timing is more forgiving, but early still means fewer people inside each tomb."},{"id":"8f09f864-5039-4511-a500-99644b1a3851","question":"Do you need a photography permit inside the tombs?","answer":"Only for a proper camera. A phone is free as long as the flash is off, a DSLR needs a 300 pound permit bought at the ticket office, and inside Tutankhamun''s tomb no camera of any kind is allowed. Carry small notes as well: the guardian at each of your 3 tombs will often light a ceiling detail you would otherwise miss."}]'::jsonb,
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
       (SELECT count(*) FROM regexp_matches(body_en, 'tombs in the valley of kings', 'gi')) AS primary_hits
FROM posts WHERE slug = 'tombs-in-the-valley-of-kings';

SELECT 'seo lengths out of range' AS check, count(*) AS bad FROM posts
WHERE slug = 'tombs-in-the-valley-of-kings' AND (length(meta_title) > 60 OR length(meta_description) NOT BETWEEN 150 AND 160);

SELECT 'faq count out of range' AS check, count(*) AS bad FROM posts
WHERE slug = 'tombs-in-the-valley-of-kings' AND jsonb_array_length(faqs) NOT BETWEEN 7 AND 8;

-- Answers are written to be quoted on their own by an AI answer engine, which
-- means 40 to 80 words each. Outside that they are either empty or too long.
SELECT 'faq answers outside 40-80 words' AS check, count(*) AS bad
FROM posts p, jsonb_array_elements(p.faqs) f
WHERE p.slug = 'tombs-in-the-valley-of-kings'
  AND array_length(regexp_split_to_array(trim(f->>'answer'), '\s+'), 1) NOT BETWEEN 40 AND 80;

-- The SEO overrides must be NULL, not empty strings, or the fallbacks break.
SELECT 'seo overrides stored as empty strings' AS check, count(*) AS bad FROM posts
WHERE slug = 'tombs-in-the-valley-of-kings'
  AND (canonical_url = '' OR robots = '' OR og_image = '' OR schema_type = '' OR featured_image_alt = '');

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
