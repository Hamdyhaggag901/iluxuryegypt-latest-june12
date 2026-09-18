-- Coptic Cairo: Four Sites in One Walk, and How to Read Them
-- Blog post 11 of 13. Primary keyword: coptic cairo
--
-- Scheduled for 2026-10-20T09:00:00+03:00 via posts.scheduled_at, so it stays out of
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
  'coptic-cairo',
  'Coptic Cairo: Four Sites in One Walk, and How to Read Them',
  '<p>You walk down into it.</p>

<p>Street level in this part of the city has risen several metres over nineteen centuries, so the entrance to Coptic Cairo is a staircase going down to the ground everything here was built on. That descent is the most useful thing about the visit, because it tells you immediately that you are standing in an older layer of the city rather than a quarter that happens to have old buildings in it.</p>

<p>Inside a walled enclosure a few hundred metres across are a church built into a Roman gate, one of the oldest synagogues in Egypt, several other churches, a cemetery and a museum. You can walk the whole thing in two hours.</p>

<h2>What Coptic Cairo Is</h2>

<p>The enclosure is the remains of Babylon, a Roman fortress that guarded the point where a canal met the Nile. Two of its round towers still stand, and the river has since moved several hundred metres west, which is why a fort built on a waterfront is now inland.</p>

<p>Copts are Egyptian Christians, and the Coptic Orthodox Church traces its founding to the evangelist Mark in the first century. Estimates of the Christian share of Egypt''s population range from about 5 to 15 per cent and no census settles it, but by any of them this is the largest Christian community in the Middle East.</p>

<p>The buildings here span from the Roman fort through the early churches to a nineteenth century synagogue restoration. They are working religious sites, not a museum quarter, and several hold services you may walk into.</p>

<p>The enclosure also holds a Greek Orthodox church, a convent, and a cemetery that is still in use. It is a quarter of a living city that happens to be very old, which is a different thing from a preserved site.</p>

<h2>The Hanging Church</h2>

<p>Al Muallaqa, the suspended one, is built across the gap between two towers of the Roman gate, its nave resting on the old masonry with nothing underneath. A section of glass floor inside lets you look down the drop.</p>

<p>The present building is mostly eleventh century and later, with a facade and twin bell towers from the nineteenth. Inside are a marble pulpit on thirteen columns, ebony and ivory screens, and a set of icons in the dim light behind them.</p>

<p>The hanging church cairo visitors queue for is the most photographed building in the enclosure and the most crowded. Go first thing, or in the last hour before closing, and you will have the nave to yourself for a few minutes.</p>

<h2>The Church of St Sergius and Bacchus</h2>

<p>Abu Serga is the one to see if you see only one interior. It is fifth century in origin, built over a crypt that tradition identifies as a resting place of the Holy Family during their flight into Egypt.</p>

<p>The crypt is often closed because of groundwater, and this is worth knowing before you go rather than discovering at the steps. When it is open it is a small, plain, waterlogged room, and the queue is long.</p>

<p>The church above is the better building anyway: a basilica plan with ancient columns reused from earlier structures, a wooden ark ceiling shaped like an upturned boat, and far fewer people in it than in the Hanging Church a hundred metres away.</p>

<h2>Ben Ezra Synagogue</h2>

<p>A synagogue since the ninth century, on the site of a church that was sold to pay a tax, standing where a Jewish community lived in Cairo for well over a thousand years.</p>

<p>Its importance is documentary. A geniza, a storeroom for papers bearing the name of God that could not be destroyed, was walled up here and left. When it was opened in the nineteenth century it held around 300,000 fragments: letters, contracts, shopping lists, schoolwork, court records, poetry, spanning roughly the ninth to the nineteenth centuries.</p>

<p>The Cairo Geniza is one of the greatest single sources for medieval Mediterranean life anywhere, and almost everything scholars know about ordinary Jewish, Muslim and Christian commerce in that world comes out of this building. The interior is restored and modest. Photography inside is not allowed.</p>

<p>Stand in it for a minute anyway. The room is small and plain and the documents that came out of the roof space above it rewrote a field, which is a strange thing to be standing inside.</p>

<h2>The Coptic Museum</h2>

<p>Most visitors walk past it, and it is the best thing in the enclosure.</p>

<p>The coptic museum cairo keeps is a purpose built house of Coptic art founded in 1908, with carved wooden ceilings and mashrabiya screens that are worth the ticket before you look at a single exhibit. Inside are textiles, stonework, manuscripts and icons covering the period between pharaonic Egypt and Islamic Egypt, which is the gap almost nobody fills in.</p>

<p>It also holds part of the Nag Hammadi library, the codices found in Upper Egypt in 1945 that contain the Gospel of Thomas and other texts left out of the canon. Seeing the actual bound papyrus is not something the Grand Egyptian Museum can offer.</p>

<p>Allow forty five minutes. It is air conditioned, which on a Cairo afternoon is not a small consideration.</p>

<h2>How to Walk It</h2>

<p>Start at the Coptic Museum while you are fresh, then the Hanging Church, then down the sunken lane to Abu Serga, then Ben Ezra, then out past the cemetery. That is roughly a loop and it takes two hours at a steady pace.</p>

<p>Doing the museum last, which is what most groups do, means arriving at the best building of the four already tired and out of time. It is the single change that improves the visit most.</p>

<p>The lane between the churches is sunken, narrow and partly covered, which makes it several degrees cooler than the street above. In July that matters, and it is the reason this is one of the few Cairo walks that works at two in the afternoon.</p>

<p>The Metro stops at Mar Girgis, directly outside the entrance, which makes this one of the few Cairo sites where public transport is genuinely the easiest option. Line 1, about twenty minutes from downtown.</p>

<h2>Visiting a Working Church</h2>

<p>Dress as you would for any place of worship: shoulders and knees covered, for everyone. Nobody will hand you a robe at the door, and nobody will say anything if you get it wrong, which is precisely why it is worth getting right.</p>

<p>Services run on Sundays and on Coptic feast days, and the enclosure is busy with worshippers rather than visitors on those mornings. You are not excluded, but you are a guest at something that is happening rather than a spectator at something arranged.</p>

<p>Keep your voice down inside and your phone silent. Photography is allowed in most of the churches and not in Ben Ezra; the rule is posted at each door and it is followed.</p>

<h2>What Is Not Worth Your Time</h2>

<p>The souvenir stalls along the lane sell the same machine made items as every other site in the country, at the same prices, and they take up the walk between two of the best buildings here.</p>

<p>The Church of St George, the round one on the north side, is a twentieth century rebuild after a fire and is rarely open to visitors. It photographs well from outside and that is about the size of it.</p>

<p>And if the Abu Serga crypt is closed, do not wait around hoping. It stays closed for months at a time when the water is high.</p>

<h2>Where It Fits in a Cairo Day</h2>

<p>Half a day, easily. It pairs naturally with a visit to the Amr ibn al As mosque a short walk north, which is the oldest mosque in Africa, or with Islamic Cairo further north for a full day of the city''s religious history in chronological order.</p>

<p>Coptic Cairo Egypt visitors reach by metro is also one of the few parts of the city that works in the middle of the day, because most of what you came for is indoors and cool.</p>

<p>The <a href="/egypt-travel-guide/cairo-travel-guide">Cairo area guide</a> covers how the districts fit together, and the <a href="/blog/grand-egyptian-museum-tour">Grand Egyptian Museum guide</a> covers the other half of a Cairo stay. Our <a href="/egypt-private-tours">private Cairo itineraries</a> usually pair this enclosure with Old Cairo rather than with Giza, because the two halves of that day belong to the same city and the pyramids do not.</p>

<p>One last practical note. There are clean public toilets by the museum entrance and effectively nowhere else in the enclosure, which is the sort of thing no guidebook prints and everybody needs to know.</p>',
  'A church built on a Roman gate tower, a synagogue that held a thousand years of documents, and a museum most visitors walk past. All within about three hundred metres.',
  'Culture & History',
  ARRAY['Cairo', 'Coptic', 'Churches', 'Walking']::text[],
  'coptic cairo',
  'Coptic Cairo: Four Sites in a Single Short Walk',
  'Coptic cairo puts a church, a synagogue, a Roman gate and a museum in one small enclosure. What each one is, the order to walk them, and how to visit well.',
  'published',
  '2026-10-20T09:00:00+03:00'::timestamptz,
  '[{"id":"ca9add22-e285-5f37-b7dc-0a426bbca8b4","question":"What is Coptic Cairo and why is it below street level?","answer":"It is a walled enclosure built around the Roman fortress of Babylon, holding several early churches, a synagogue, a cemetery and a museum. You enter by walking down a staircase because street level in this part of the city has risen several metres over roughly 19 centuries, so the original ground is now underground."},{"id":"542a72b0-56ee-5b19-a758-f8845c77fd26","question":"How long does it take to see Coptic Cairo?","answer":"About 2 hours at a steady pace, covering all 4 main sites within roughly 300 metres of each other. Allow 45 minutes for the Coptic Museum alone, which most visitors underestimate, and 20 to 30 for the Hanging Church. Half a day is comfortable if you add the Amr ibn al As mosque a short walk north."},{"id":"73ea194b-24d0-5559-bcf8-f1f17ded9966","question":"Why is the Hanging Church called that?","answer":"Because it is built across the gap between 2 towers of the Roman gate, with its nave resting on the old masonry and nothing beneath it. A section of glass floor inside lets you look down the drop. The present building is mostly 11th century and later, with the facade and twin bell towers added in the 19th."},{"id":"5186c28f-f886-52d2-a610-8d1827a09b54","question":"Which is better, the Hanging Church or the Coptic Museum?","answer":"The museum, and it is not close. Founded in 1908, it has carved wooden ceilings and mashrabiya screens worth the ticket on their own, plus textiles, icons and part of the Nag Hammadi library including the Gospel of Thomas. It is also air conditioned. Most visitors walk straight past it to the church."},{"id":"0815dec4-fcee-5698-98b2-0dde73ce0f16","question":"What is the Cairo Geniza?","answer":"A storeroom in Ben Ezra Synagogue where papers bearing the name of God were placed rather than destroyed, then walled up and forgotten. Opened in the 19th century, it held around 300,000 fragments spanning roughly the 9th to 19th centuries: letters, contracts, court records, schoolwork. It is a major source for medieval Mediterranean daily life."},{"id":"e6fa8332-77c4-55d8-97ab-7550697c53d8","question":"Is the Holy Family crypt worth queueing for?","answer":"Sometimes. The crypt under the Church of St Sergius and Bacchus is closed for months at a time when groundwater is high, and the queue is long when it is open. The church above it is the better building anyway: a 5th century basilica with reused ancient columns and a wooden ceiling shaped like an upturned boat."},{"id":"d453febd-d71b-54ba-9b3a-508241568ed2","question":"What should you wear to visit Coptic Cairo?","answer":"Shoulders and knees covered, for everyone. These are working churches with services on Sundays and Coptic feast days, not a museum quarter, and at least 3 of them hold regular worship. Nobody will hand you a robe at the door or comment if you get it wrong, which is exactly why it is worth getting right before you arrive."},{"id":"ca0ed992-c8f0-55bc-8d78-826114e2563c","question":"How do you get to Coptic Cairo?","answer":"By Metro to Mar Girgis station on Line 1, which stops directly outside the entrance and takes about 20 minutes from downtown. This is 1 of the few Cairo sites where public transport beats a taxi outright, because the station exit opens onto the enclosure gate and traffic here is heavy at most hours."}]'::jsonb,
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
FROM posts WHERE slug = 'coptic-cairo';
SELECT slug,
       length(meta_title) AS title_len,
       length(meta_description) AS meta_len,
       jsonb_array_length(faqs) AS faq_count,
       array_length(regexp_split_to_array(regexp_replace(body_en, '<[^>]+>', ' ', 'g'), '\s+'), 1) AS body_words,
       scheduled_at,
       schema_type,
       (SELECT count(*) FROM regexp_matches(body_en, 'coptic cairo', 'gi')) AS primary_hits
FROM posts WHERE slug = 'coptic-cairo';

SELECT 'seo lengths out of range' AS check, count(*) AS bad FROM posts
WHERE slug = 'coptic-cairo' AND (length(meta_title) > 60 OR length(meta_description) NOT BETWEEN 150 AND 160);

SELECT 'faq count out of range' AS check, count(*) AS bad FROM posts
WHERE slug = 'coptic-cairo' AND jsonb_array_length(faqs) NOT BETWEEN 7 AND 8;

-- Answers are written to be quoted on their own by an AI answer engine, which
-- means 40 to 80 words each. Outside that they are either empty or too long.
SELECT 'faq answers outside 40-80 words' AS check, count(*) AS bad
FROM posts p, jsonb_array_elements(p.faqs) f
WHERE p.slug = 'coptic-cairo'
  AND array_length(regexp_split_to_array(trim(f->>'answer'), '\s+'), 1) NOT BETWEEN 40 AND 80;

-- The SEO overrides must be NULL, not empty strings, or the fallbacks break.
SELECT 'seo overrides stored as empty strings' AS check, count(*) AS bad FROM posts
WHERE slug = 'coptic-cairo'
  AND (canonical_url = '' OR robots = '' OR og_image = '' OR schema_type = '' OR featured_image_alt = '');

SELECT 'faq entries missing id, question or answer' AS check, count(*) AS bad
FROM posts p, jsonb_array_elements(p.faqs) f
WHERE p.slug = 'coptic-cairo'
  AND (coalesce(f->>'id','') = '' OR coalesce(f->>'question','') = '' OR coalesce(f->>'answer','') = '');

SELECT 'em or en dash present' AS check, count(*) AS bad FROM posts
WHERE slug = 'coptic-cairo'
  AND (body_en ~ '[\u2013\u2014]' OR meta_title ~ '[\u2013\u2014]' OR meta_description ~ '[\u2013\u2014]' OR title_en ~ '[\u2013\u2014]');

-- Tour links must sit at the site root. Anything under the category path 404s.
SELECT 'tour links under /luxury-egypt-tour-packages/' AS check, count(*) AS bad FROM posts
WHERE slug = 'coptic-cairo' AND body_en ~ 'href="/luxury-egypt-tour-packages/[^"]';

SELECT 'root-relative internal links' AS check,
       (SELECT count(*) FROM regexp_matches(body_en, 'href="/[^"]+"', 'g')) AS good,
       (SELECT count(*) FROM regexp_matches(body_en, 'href="(?!/)[^"]+"', 'g')) AS bad
FROM posts WHERE slug = 'coptic-cairo';

SELECT 'unfilled placeholders' AS check,
       (SELECT count(*) FROM regexp_matches(body_en, 'data-placeholder=', 'g'))
     + (SELECT count(*) FROM regexp_matches(body_en, '\{\{[A-Z_]+\}\}', 'g')) AS remaining
FROM posts WHERE slug = 'coptic-cairo';

SELECT 'other language columns left empty' AS check, count(*) AS bad FROM posts
WHERE slug = 'coptic-cairo'
  AND (title_es IS NOT NULL OR title_fr IS NOT NULL OR title_jp IS NOT NULL
       OR body_es IS NOT NULL OR body_fr IS NOT NULL OR body_jp IS NOT NULL);
