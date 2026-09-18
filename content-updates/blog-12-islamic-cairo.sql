-- Islamic Cairo: Walking Al Muizz Street End to End
-- Blog post 12 of 13. Primary keyword: islamic cairo
--
-- Scheduled for 2026-10-23T09:00:00+03:00 via posts.scheduled_at, so it stays out of
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
  'islamic-cairo',
  'Islamic Cairo: Walking Al Muizz Street End to End',
  '<p>There is a street in this city with a thousand years of architecture standing along it, still in use, with people shopping on it.</p>

<p>Al Muizz li Din Allah runs roughly a kilometre north to south through the medieval core, from the Bab al Futuh gate down to Bab Zuweila, and it carries Fatimid, Ayyubid, Mamluk and Ottoman buildings in a more or less unbroken sequence. UNESCO describes this district as holding the greatest concentration of medieval Islamic architecture anywhere. Islamic cairo is not a museum quarter, and that is the whole point of it.</p>

<p>The walk takes three hours if you stop, ninety minutes if you do not. Here is what to stop for.</p>

<h2>Start at the North Gate</h2>

<p>Bab al Futuh, the Gate of Conquests, is where to begin, because walking south means the street opens up in front of you rather than closing behind.</p>

<p>The gate is late eleventh century, built by Armenian architects for the Fatimid vizier Badr al Jamali, and it is military engineering rather than decoration: round towers, arrow slits, a passage designed to be defended. Bab al Nasr, its twin a short walk east, carries Napoleonic graffiti where French troops named the towers after their officers.</p>

<p>You can usually walk on top of the walls between the two gates. Ask at the ticket office; it is not always offered and it is the best view of the district you will get.</p>

<h2>Al Hakim Mosque</h2>

<p>Immediately inside the gate is one of the oldest mosques in the city, begun in 990 and finished by the caliph al Hakim, who is one of the stranger figures in Egyptian history.</p>

<p>Its restoration in the 1980s divides people sharply. The courtyard was resurfaced in white marble that nothing about the original resembles, and purists consider it ruined. Go anyway, because the scale and the two unusual minarets encased in stone salients are still there, and because the courtyard is empty and quiet at almost any hour.</p>

<h2>Walking Al Muizz Street</h2>

<p>South of al Hakim the street becomes a sequence. The Qalawun complex, with its hospital, madrasa and mausoleum behind one enormous Mamluk facade. The Barquq complex next door. The Sabil Kuttab of Abdel Rahman Katkhuda standing in the middle of the road where the street forks.</p>

<p>Al muizz street cairo pedestrianised in the 2000s, so the northern section is free of cars and lit at night, which changed it completely. The southern end below the fork is still a working market with trucks in it.</p>

<p>Look up constantly. The ground floors are shops and the shops are ordinary; everything you came for is above shopfront height.</p>

<p>The sabils are worth knowing about while you do it. A sabil was a public drinking fountain, usually with a Quranic school on the floor above, and a wealthy patron built one as a charitable endowment. They are the small, heavily decorated buildings you keep passing without a name on them.</p>

<h2>Which Buildings to Actually Enter</h2>

<p>You cannot go inside everything, and trying is how people run out of energy by noon. Three are worth the time.</p>

<p>The Qalawun complex, for the mausoleum interior: coloured marble, stucco, and a dome on a plan that borrows from the Dome of the Rock. It is the most ambitious Mamluk interior on the street.</p>

<p>The Sultan al Ghuri complex at the southern end, two buildings facing each other across the street, one a mosque and madrasa and one a mausoleum, with a courtyard that hosts a Sufi dance performance several evenings a week.</p>

<p>Bayt al Suhaymi, an Ottoman merchant''s house down a side alley off the main street. Courtyard, mashrabiya screens, cool upper rooms, and a plan that explains domestic privacy in the period better than any label could. It is the quietest building on the walk and the one most people miss.</p>

<h2>Bab Zuweila and the Minarets</h2>

<p>The southern gate, and the one to climb. Two minarets belonging to the mosque next door rise directly from its towers, and the staircase up is narrow, dark and worth it.</p>

<p>From the top you see the whole medieval city as a field of domes and minarets, with the Citadel on its ridge to the south and the modern city beyond. This is the photograph that makes people understand the scale of what they have been walking through.</p>

<p>The gate has a grim history. It was the execution site for centuries, and the heads of the condemned were displayed on it. Nobody mentions this on the way up.</p>

<h2>Ibn Tulun, Which Is Not on This Street</h2>

<p>The oldest mosque in Cairo surviving in its original form sits about two kilometres southwest, and it is worth the separate trip.</p>

<p>Built between 876 and 879, it is enormous, almost empty, and built of brick rather than stone, with a spiral minaret you can climb and a footprint of about six and a half acres. The style is Samarran, from Iraq, and it looks like nothing else in the city.</p>

<p>Go at midday when the shadows are hard and the arcades are at their most graphic. Next door, the Gayer Anderson Museum occupies two merchant houses and is one of the most enjoyable small museums in Egypt.</p>

<h2>Al Azhar</h2>

<p>Founded in 970, a functioning university since 972, and by most reckonings the second oldest continuously operating university in the world.</p>

<p>The courtyard is open to visitors outside prayer times and the building is a layered record of a thousand years of patronage, with each dynasty adding a minaret or a gate. It sits across a busy road from Khan al Khalili, and the underpass is the safe way across.</p>

<h2>Khan al Khalili</h2>

<p>The famous bazaar, and the honest assessment is that most of it sells the same things as every tourist site in the country.</p>

<p>The interesting part is the section away from the main tourist lanes, where the trades are still grouped: metalworkers, then fabric, then spices, then gold. Walk five minutes past where the coach groups stop and it becomes a working market again.</p>

<p>El Fishawy, the old coffee house in the middle, is a tourist institution at tourist prices. Sit there once for the room and then find a cheaper one down any side alley.</p>

<p>Haggling is expected and the opening figure is usually two to three times what the seller will take. If that is not how you want to spend an afternoon, the fixed price craft shops near Bayt al Suhaymi sell better work without the performance.</p>

<h2>When to Walk Islamic Cairo</h2>

<p>Twice, if you can. Mid morning for the interiors, because the mosques are open, the light comes through the screens and the street is calm.</p>

<p>Then after dark for the street itself. The pedestrianised northern section is lit building by building, the shops stay open, families come out, and the whole thing turns into somewhere people are rather than somewhere people visit. Between eight and ten in the evening is the best two hours anyone gets in this city.</p>

<p>Friday midday is the one time to avoid. Mosques close to visitors around the noon prayer and the district is busy with people who are there to pray.</p>

<h2>Entering a Mosque</h2>

<p>Shoes off, and there is somewhere to leave them at every entrance. Shoulders and knees covered for everyone; women should also cover their hair, and most mosques here keep scarves at the door.</p>

<p>Do not walk in front of someone praying, and do not photograph people at prayer. Both are obvious and both happen constantly.</p>

<p>There is often a small charge or a custodian expecting a tip, and in several buildings a ticket covers a group of monuments. Carry small notes, because almost nothing on this street takes a card.</p>

<h2>Practical Notes</h2>

<p>Entry prices across the district change most years and several sites now take card only. Check the current rate before you go, or ask your operator to confirm it with your itinerary.</p>

<p>Wear shoes you can take on and off ten times, because you will. The street is uneven, partly cobbled and dusty, and the stairs in the gates and minarets are steep.</p>

<p>Several of the monuments share a combined ticket sold at the first one you enter, and which monuments it covers changes. Ask what is on it when you buy rather than paying twice at the third door, which is the usual outcome.</p>

<p>The part of islamic cairo egypt has spent two decades restoring is far more accessible than it was, but this is still a dense, busy district where getting lost is the normal state. That is fine. Every alley off al muizz street rejoins it within a few hundred metres.</p>

<p>The <a href="/egypt-travel-guide/cairo-travel-guide">Cairo area guide</a> covers how the districts fit into a stay, and the <a href="/blog/coptic-cairo">Coptic quarter guide</a> covers the older religious layer to the south. Our <a href="/egypt-private-tours">private Cairo itineraries</a> split this district across a morning and an evening rather than one long walk, which is the only way to get both the interiors and the lit street.</p>

<p>One thing to know that nobody prints. The public toilets in this district are poor to nonexistent, and the reliable option is to buy a coffee somewhere with a proper cafe and use theirs.</p>',
  'One street carries Fatimid gates, Mamluk facades and Ottoman houses in an unbroken line. Walking it end to end takes three hours and is the best thing to do in the city after dark.',
  'Culture & History',
  ARRAY['Cairo', 'Al Muizz', 'Mosques', 'Walking']::text[],
  'islamic cairo',
  'Islamic Cairo: Walking Al Muizz Street End to End',
  'Islamic cairo holds a thousand years of architecture on one walkable street. What to see, when to go for the light, and the rules for entering a working mosque.',
  'published',
  '2026-10-23T09:00:00+03:00'::timestamptz,
  '[{"id":"f9c20fa3-eb6b-569b-b73d-1d3082e6326e","question":"What is Islamic Cairo and where does it start?","answer":"The medieval core of the city, centred on Al Muizz li Din Allah street, which runs about 1 km from Bab al Futuh in the north to Bab Zuweila in the south. UNESCO describes the district as holding the greatest concentration of medieval Islamic architecture in the world, spanning the Fatimid, Ayyubid, Mamluk and Ottoman periods."},{"id":"7bfbf846-4837-5a80-b406-26872d13d45e","question":"How long does it take to walk Al Muizz Street?","answer":"90 minutes without stopping and about 3 hours if you go inside things. Walk north to south from Bab al Futuh so the street opens ahead of you. Entering 3 buildings properly, the Qalawun complex, Bayt al Suhaymi and the al Ghuri complex, is a better use of the time than glancing into 10."},{"id":"5c49ba86-2148-56c3-9678-7e4892ff6c02","question":"When is the best time to visit Islamic Cairo?","answer":"Twice if you can: mid morning for the interiors, when mosques are open and light comes through the screens, and again between 8 and 10 in the evening for the lit street. Avoid Friday around midday, when mosques close to visitors for the noon prayer and the district belongs to worshippers."},{"id":"211152b8-ce6b-5296-a772-21783275b9b4","question":"Which is better, Ibn Tulun or Al Azhar?","answer":"Ibn Tulun, for the building. Built between 876 and 879, it is the oldest mosque in Cairo surviving in its original form, covering about 6.5 acres, built of brick, with a spiral minaret you can climb. Al Azhar matters more as an institution: a working university since 972 and among the oldest in the world."},{"id":"fc17817f-6265-5ed0-a31e-a0b28fc7cce7","question":"Can non Muslims enter the mosques in Cairo?","answer":"Yes, outside prayer times, at every major mosque in the district. Shoes come off at the door and there is somewhere to leave them at all 5 of the main sites. Shoulders and knees covered for everyone, and women cover their hair; most mosques keep scarves at the entrance. Do not walk in front of anyone praying or photograph them."},{"id":"66f4f003-0f63-51f4-8d04-0d19784a644a","question":"Is Khan al Khalili worth visiting?","answer":"The famous lanes sell much the same goods as every tourist site in Egypt. Walk 5 minutes past where the coach groups stop and it becomes a working market again, with the trades still grouped: metalworkers, then fabric, then spices, then gold. That part is worth an hour; the first part is worth 10 minutes."},{"id":"0439631d-ac34-5268-8ff1-9078ccfb1754","question":"Should you climb Bab Zuweila?","answer":"Yes. The southern gate carries 2 minarets belonging to the mosque beside it, and the narrow staircase up gives the best view of the medieval city as a field of domes, with the Citadel on its ridge beyond. It also has a grim past as the execution site of the city for several centuries."},{"id":"33a1c5d2-0387-5ee6-9fc1-b7c26294e43c","question":"How does Islamic Cairo compare with Coptic Cairo?","answer":"They are different scales. Coptic Cairo is a walled enclosure about 300 metres across that takes 2 hours; this district is a square kilometre of living streets that takes a day. Do the Coptic quarter for early Christian history and this one for architecture, and see them on separate days rather than back to back."}]'::jsonb,
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
FROM posts WHERE slug = 'islamic-cairo';
SELECT slug,
       length(meta_title) AS title_len,
       length(meta_description) AS meta_len,
       jsonb_array_length(faqs) AS faq_count,
       array_length(regexp_split_to_array(regexp_replace(body_en, '<[^>]+>', ' ', 'g'), '\s+'), 1) AS body_words,
       scheduled_at,
       schema_type,
       (SELECT count(*) FROM regexp_matches(body_en, 'islamic cairo', 'gi')) AS primary_hits
FROM posts WHERE slug = 'islamic-cairo';

SELECT 'seo lengths out of range' AS check, count(*) AS bad FROM posts
WHERE slug = 'islamic-cairo' AND (length(meta_title) > 60 OR length(meta_description) NOT BETWEEN 150 AND 160);

SELECT 'faq count out of range' AS check, count(*) AS bad FROM posts
WHERE slug = 'islamic-cairo' AND jsonb_array_length(faqs) NOT BETWEEN 7 AND 8;

-- Answers are written to be quoted on their own by an AI answer engine, which
-- means 40 to 80 words each. Outside that they are either empty or too long.
SELECT 'faq answers outside 40-80 words' AS check, count(*) AS bad
FROM posts p, jsonb_array_elements(p.faqs) f
WHERE p.slug = 'islamic-cairo'
  AND array_length(regexp_split_to_array(trim(f->>'answer'), '\s+'), 1) NOT BETWEEN 40 AND 80;

-- The SEO overrides must be NULL, not empty strings, or the fallbacks break.
SELECT 'seo overrides stored as empty strings' AS check, count(*) AS bad FROM posts
WHERE slug = 'islamic-cairo'
  AND (canonical_url = '' OR robots = '' OR og_image = '' OR schema_type = '' OR featured_image_alt = '');

SELECT 'faq entries missing id, question or answer' AS check, count(*) AS bad
FROM posts p, jsonb_array_elements(p.faqs) f
WHERE p.slug = 'islamic-cairo'
  AND (coalesce(f->>'id','') = '' OR coalesce(f->>'question','') = '' OR coalesce(f->>'answer','') = '');

SELECT 'em or en dash present' AS check, count(*) AS bad FROM posts
WHERE slug = 'islamic-cairo'
  AND (body_en ~ '[\u2013\u2014]' OR meta_title ~ '[\u2013\u2014]' OR meta_description ~ '[\u2013\u2014]' OR title_en ~ '[\u2013\u2014]');

-- Tour links must sit at the site root. Anything under the category path 404s.
SELECT 'tour links under /luxury-egypt-tour-packages/' AS check, count(*) AS bad FROM posts
WHERE slug = 'islamic-cairo' AND body_en ~ 'href="/luxury-egypt-tour-packages/[^"]';

SELECT 'root-relative internal links' AS check,
       (SELECT count(*) FROM regexp_matches(body_en, 'href="/[^"]+"', 'g')) AS good,
       (SELECT count(*) FROM regexp_matches(body_en, 'href="(?!/)[^"]+"', 'g')) AS bad
FROM posts WHERE slug = 'islamic-cairo';

SELECT 'unfilled placeholders' AS check,
       (SELECT count(*) FROM regexp_matches(body_en, 'data-placeholder=', 'g'))
     + (SELECT count(*) FROM regexp_matches(body_en, '\{\{[A-Z_]+\}\}', 'g')) AS remaining
FROM posts WHERE slug = 'islamic-cairo';

SELECT 'other language columns left empty' AS check, count(*) AS bad FROM posts
WHERE slug = 'islamic-cairo'
  AND (title_es IS NOT NULL OR title_fr IS NOT NULL OR title_jp IS NOT NULL
       OR body_es IS NOT NULL OR body_fr IS NOT NULL OR body_jp IS NOT NULL);
