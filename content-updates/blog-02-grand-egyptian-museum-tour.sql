-- Grand Egyptian Museum Tour: A Visitor's Guide
-- Blog post 2 of 5. Primary keyword: grand egyptian museum tour
--
-- Scheduled for 2026-09-24T09:00:00+03:00 via posts.scheduled_at, so it stays out of
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
  'grand-egyptian-museum-tour',
  'Grand Egyptian Museum Tour: A Visitor''s Guide',
  '<p>You cannot see this building in two hours. People try, because two hours is what most Cairo itineraries allow, and they come out having walked past about a third of it without stopping.</p>

<p>A grand egyptian museum tour done properly needs half a day. If you only have a morning, the useful question is not how to see everything but which parts you are willing to skip, and this guide is built around that decision.</p>

<h2>What Is Actually on Display</h2>

<p>The collection runs to more than a hundred thousand objects, with around fifty thousand on show at any time. It is arranged chronologically across twelve main galleries, from predynastic Egypt through to the Greco Roman period.</p>

<p>Three things stand out from everything else.</p>

<p>The Grand Staircase is the first. It climbs six storeys and is lined with royal statues, sarcophagi and columns, arranged so that you rise through the chronology as you walk. At the top the window frames the Giza pyramids directly, which is the single best piece of museum design in Egypt.</p>

<p>The Tutankhamun galleries are the second. For the first time the complete contents of the tomb are shown together, over five thousand objects, rather than the selection that used to sit in Tahrir. This is the part people travel for.</p>

<p>The Khufu solar boat is the third. A 43 metre cedar vessel, buried beside the Great Pyramid and moved here in one piece, which is a feat of transport worth reading about before you stand in front of it.</p>

<h2>How Long a Grand Egyptian Museum Tour Really Takes</h2>

<table>
<thead>
<tr><th>Time available</th><th>What you can cover</th></tr>
</thead>
<tbody>
<tr><td>2 hours</td><td>The Grand Staircase, the atrium, and Tutankhamun. Nothing else, and you will be moving.</td></tr>
<tr><td>3 to 4 hours</td><td>The above plus two or three chronological galleries chosen in advance.</td></tr>
<tr><td>Half a day</td><td>All twelve galleries at a steady pace, with a break. This is the honest recommendation.</td></tr>
<tr><td>Full day</td><td>Everything, including the solar boat building and time to sit with what you liked.</td></tr>
</tbody>
</table>

<p>The building is large enough that distance alone eats time. Walking from the entrance to the far end of the chronological galleries and back is a real walk, not a stroll between rooms.</p>

<h2>How It Differs from the Tahrir Museum</h2>

<p>The old Egyptian Museum on Tahrir Square is still open, still worth visiting, and now holds a different collection from the one it held five years ago.</p>

<p>Tahrir is dense, dim and crowded with objects on every surface. Cases sit close together, labels are inconsistent, and the effect is of a vast attic belonging to a civilisation. Some people find it overwhelming. Others think it is the more atmospheric of the two, and they have a point.</p>

<p>Giza is the opposite. Wide sightlines, generous spacing, strong lighting, and labels written for visitors rather than for curators. It is easier to understand and harder to feel lost in.</p>

<table>
<thead>
<tr><th>&nbsp;</th><th>Grand Egyptian Museum</th><th>Egyptian Museum, Tahrir</th></tr>
</thead>
<tbody>
<tr><td>Location</td><td>Giza, near the pyramids</td><td>Central Cairo, Tahrir Square</td></tr>
<tr><td>Feel</td><td>Spacious, lit, modern</td><td>Dense, dim, historic</td></tr>
<tr><td>Tutankhamun</td><td>The complete tomb contents</td><td>No longer the main display</td></tr>
<tr><td>Time needed</td><td>Half a day minimum</td><td>2 to 3 hours</td></tr>
<tr><td>Best for</td><td>First visit, families, anyone who wants context</td><td>Return visitors, anyone who likes old museums</td></tr>
</tbody>
</table>

<p>If you have one day in Cairo, go to Giza. If you have two, do both, and put Tahrir second so that you already have the chronology in your head.</p>

<h2>When It Is Least Crowded</h2>

<p>Opening time on a weekday is the quietest the building gets. The first hour is noticeably calmer than the rest of the day, and the Tutankhamun galleries in particular go from comfortable to congested somewhere around eleven.</p>

<p>The worst window is late morning through early afternoon, when the coach groups that did the pyramids at sunrise arrive together. If your schedule forces you into that window, invert the usual route: start at the far chronological galleries and work back toward Tutankhamun in the late afternoon, when the groups have gone.</p>

<p>Fridays and public holidays are busier with local visitors. That is not a reason to avoid them, and the atmosphere on a Friday afternoon is one of the nicer things about the place, but do not expect a quiet Tutankhamun gallery.</p>

<p>Current opening hours are <mark data-placeholder="gem-hours">FILL IN: current Grand Egyptian Museum opening hours, including any late evening</mark>.</p>

<h2>The Galleries Worth Choosing if You Must Choose</h2>

<p>Twelve galleries is more chronology than anyone absorbs in one visit. If you have to cut, cut from the middle rather than the ends.</p>

<p>The Old Kingdom rooms carry the material most people came for outside of Tutankhamun: Fourth Dynasty statuary, the tomb reliefs, the objects that sit behind every documentary about the pyramid age. This is the gallery where the Giza plateau you saw that morning suddenly has people in it.</p>

<p>The New Kingdom rooms are the other end of the scale. Colossal statuary, temple fragments, and the Amarna material, which is the strangest art ancient Egypt ever produced and holds people longer than they expect.</p>

<p>The Greco Roman gallery is the one most visitors skip and the one that most changes how the rest reads. Egyptian forms carved by people working in a Greek tradition, with results that belong to neither. Ten minutes there is a better use of time than a fast lap of everything.</p>

<p>Predynastic is the gallery to sacrifice if something has to go. It matters enormously and it is also small objects in cases, which is a hard sell on hour four.</p>

<h2>Tickets and What They Cover</h2>

<p>Tickets are timed, which is unusual in Egypt and works in your favour: it keeps the entry crush down. Book ahead in high season rather than turning up.</p>

<p>Entry is <mark data-placeholder="gem-ticket">FILL IN: current general entry ticket price, and the separate Tutankhamun gallery supplement if one applies</mark>. Photography rules vary by gallery, and the ones that restrict it are signed.</p>

<p>The solar boat building is a separate structure and sometimes carries a separate charge. Check when you book rather than at the gate.</p>

<h2>What Grand Egyptian Museum Reviews Get Right, and Wrong</h2>

<p>Two complaints come up again and again in grand egyptian museum reviews, and both are fair.</p>

<p>The first is walking distance. This is a very large building on a sloped site and there is a lot of ground between the entrance and the galleries. If anyone in your group has limited mobility, plan around it: wheelchairs are available, and the lifts work, but the default route assumes you can walk for hours.</p>

<p>The second is food. On site catering is limited relative to the number of visitors, and queues at midday are long. Eat before you come or eat late.</p>

<p>The complaint that is usually unfair is the one about it being cold and corporate compared with Tahrir. It is a different kind of building doing a different job, and the Grand Staircase alone answers the charge.</p>

<h2>How to Order Your Visit</h2>

<p>Start at the Grand Staircase and walk up. Do not take the lift, even though it is right there. The staircase is the introduction the building was designed around and skipping it makes everything after it harder to place.</p>

<p>At the top, stop at the window and look at the pyramids. Then go to Tutankhamun, because it is the one room you will regret rushing.</p>

<p>After that, pick two or three chronological galleries rather than attempting all twelve. The Old Kingdom rooms and the New Kingdom rooms carry the most recognisable material. Save the solar boat for last, because it sits slightly apart and works better as a closing act than as a detour.</p>

<p>Build in a sit down. There is more seating than most museums provide and using it is not a failure of stamina.</p>

<h2>Guided or On Your Own</h2>

<p>The labelling here is good enough that you can do this unguided and understand what you are looking at, which was not true of Tahrir. That is a genuine change.</p>

<p>What a guide adds is editing. Most grand egyptian museum tours exist to solve the problem this article is about: somebody who knows the building deciding, in advance, which thirty objects out of fifty thousand you are going to stand in front of. On a half day that editing is worth more than the commentary.</p>

<p>What a guide cannot add is time. A two hour guided visit is still a two hour visit, and no guide can make the Tutankhamun galleries unhurried inside it. If you are choosing between a longer unguided visit and a shorter guided one, take the longer one.</p>

<p>If you do go guided, ask before booking how long the ground time is, not how long the tour is. The difference is usually the drive.</p>

<h2>Combining It with the Pyramids</h2>

<p>The museum is a short drive from the Giza plateau, which makes the pairing obvious. It is also the single most common way people ruin both.</p>

<p>Pyramids at sunrise, museum from mid morning, is the version that works. You get the plateau in good light and near silence, then you are indoors and air conditioned when the day heats up.</p>

<p>Museum first, pyramids after lunch, is the version that does not. You arrive on the plateau in flat midday light, tired, with three hours of walking already behind you.</p>

<p>Our <a href="/7-day-egypt-tour">seven day Egypt itinerary</a> puts the plateau first for exactly this reason, and gives a grand egyptian museum tour its own half day rather than an afternoon slot.</p>

<h2>Worth Knowing Before You Go</h2>

<p>Read one thing about Tutankhamun before you arrive. Not a book, just enough to know who Howard Carter was and why the tomb mattered. The galleries assume a little background and reward it heavily.</p>

<p>Give yourself permission to skip periods that do not interest you. Twelve galleries is a lot of chronology and nobody is grading you.</p>

<p>If you want the wider Cairo picture, the <a href="/egypt-travel-guide/cairo-travel-guide">Cairo area guide</a> covers Islamic Cairo, Saqqara and the timings that make a multi day stay work. For what to do with an Aswan stop later in the same trip, the <a href="/blog/abu-simbel-tour-from-aswan">Abu Simbel comparison</a> covers the flight and road question in the same detail.</p>

<p>And one practical note that sounds trivial and is not: wear the shoes you would wear for a long walk outdoors, not the ones you would wear to a museum. The floors are hard, the distances are long, and this is the single most common regret people report.</p>

<h2>One Thing to Do Before You Leave</h2>

<p>Go back to the window at the top of the Grand Staircase on your way out. You will have spent hours with objects that came out of the ground on the plateau you can see through that glass, and the second look lands very differently from the first.</p>

<p>It takes two minutes and nobody tells you to do it.</p>',
  'Twelve galleries, a staircase built around royal statues, and the full Tutankhamun collection in one place. Here is how much of it you can realistically see in a morning.',
  'Travel Guides',
  ARRAY['Grand Egyptian Museum', 'Giza', 'Cairo', 'Museums']::text[],
  'grand egyptian museum tour',
  'Grand Egyptian Museum Tour: Visitor''s Guide',
  'What a grand egyptian museum tour actually covers, how many hours you need, how it differs from the Tahrir museum, and the times of day worth avoiding.',
  'published',
  '2026-09-24T09:00:00+03:00'::timestamptz,
  '[{"id":"581c2342-1a77-432a-8efb-af2c226e3487","question":"How long do you need at the Grand Egyptian Museum?","answer":"Half a day is the realistic minimum to see all twelve galleries at a steady pace. Two hours covers the Grand Staircase and the Tutankhamun collection and nothing else. A full day lets you include the solar boat building without rushing."},{"id":"661d70af-3400-43e8-a1df-5a3909b62a43","question":"Is the Grand Egyptian Museum better than the Egyptian Museum in Tahrir?","answer":"They are different rather than ranked. Giza is spacious, well lit and easier to follow, and holds the complete Tutankhamun collection. Tahrir is dense and atmospheric and suits return visitors. If you have one day, go to Giza."},{"id":"29b2673c-8acb-4d07-bc1f-d188943021a4","question":"When is the Grand Egyptian Museum least crowded?","answer":"The first hour after opening on a weekday. Late morning through early afternoon is the busiest window, when coach groups arrive from the pyramids. Fridays and public holidays are busier with local visitors."},{"id":"7b7d1948-8612-4bb4-9969-ab6000127563","question":"Is the full Tutankhamun collection at the Grand Egyptian Museum?","answer":"Yes. For the first time the complete contents of the tomb, over five thousand objects, are displayed together in dedicated galleries rather than as the smaller selection that used to be shown in Tahrir."},{"id":"a701c597-b007-458b-84e2-37de4aa3cb4f","question":"Can you visit the Grand Egyptian Museum and the pyramids in one day?","answer":"Yes, and the order matters. Do the pyramids at sunrise and the museum from mid morning. Doing it the other way round puts you on the plateau in flat midday light after hours of walking indoors."},{"id":"3b7d16b2-1925-4840-8482-21d2f28216fc","question":"Do you need to book Grand Egyptian Museum tickets in advance?","answer":"In high season yes, because entry is timed. Booking ahead also avoids the entry queue. Photography rules vary by gallery and the restricted ones are signed at the door."},{"id":"0ff10f59-b64b-4301-bf84-f502dbe2c960","question":"Is the Grand Egyptian Museum suitable for children?","answer":"It suits children better than most Egyptian museums because the labels are written plainly and there is room to move. The main limit is walking distance, so plan a break and use the seating rather than pushing through in one go."}]'::jsonb
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
       (SELECT count(*) FROM regexp_matches(body_en, 'grand egyptian museum tour', 'gi')) AS primary_hits
FROM posts WHERE slug = 'grand-egyptian-museum-tour';

SELECT 'seo lengths out of range' AS check, count(*) AS bad FROM posts
WHERE slug = 'grand-egyptian-museum-tour' AND (length(meta_title) > 60 OR length(meta_description) NOT BETWEEN 150 AND 160);

SELECT 'faq count out of range' AS check, count(*) AS bad FROM posts
WHERE slug = 'grand-egyptian-museum-tour' AND jsonb_array_length(faqs) NOT BETWEEN 5 AND 7;

SELECT 'faq entries missing id, question or answer' AS check, count(*) AS bad
FROM posts p, jsonb_array_elements(p.faqs) f
WHERE p.slug = 'grand-egyptian-museum-tour'
  AND (coalesce(f->>'id','') = '' OR coalesce(f->>'question','') = '' OR coalesce(f->>'answer','') = '');

SELECT 'em or en dash present' AS check, count(*) AS bad FROM posts
WHERE slug = 'grand-egyptian-museum-tour'
  AND (body_en ~ '[\u2013\u2014]' OR meta_title ~ '[\u2013\u2014]' OR meta_description ~ '[\u2013\u2014]' OR title_en ~ '[\u2013\u2014]');

-- Tour links must sit at the site root. Anything under the category path 404s.
SELECT 'tour links under /luxury-egypt-tour-packages/' AS check, count(*) AS bad FROM posts
WHERE slug = 'grand-egyptian-museum-tour' AND body_en ~ 'href="/luxury-egypt-tour-packages/[^"]';

SELECT 'root-relative internal links' AS check,
       (SELECT count(*) FROM regexp_matches(body_en, 'href="/[^"]+"', 'g')) AS good,
       (SELECT count(*) FROM regexp_matches(body_en, 'href="(?!/)[^"]+"', 'g')) AS bad
FROM posts WHERE slug = 'grand-egyptian-museum-tour';

SELECT 'unfilled placeholders' AS check,
       (SELECT count(*) FROM regexp_matches(body_en, 'data-placeholder=', 'g'))
     + (SELECT count(*) FROM regexp_matches(body_en, '\{\{[A-Z_]+\}\}', 'g')) AS remaining
FROM posts WHERE slug = 'grand-egyptian-museum-tour';

SELECT 'other language columns left empty' AS check, count(*) AS bad FROM posts
WHERE slug = 'grand-egyptian-museum-tour'
  AND (title_es IS NOT NULL OR title_fr IS NOT NULL OR title_jp IS NOT NULL
       OR body_es IS NOT NULL OR body_fr IS NOT NULL OR body_jp IS NOT NULL);
