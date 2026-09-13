-- Egypt Family Tours landing page: SEO, long-form copy and FAQs for the
-- category that was previously named "Luxury Family Egypt".
--
-- The slug (egypt-family-tours) already matches the focus keyword, so it does
-- not change and no redirect is needed.
--
-- The NAME does change, and tours.category stores the category's display name
-- as free text (matched by exact string equality in server/routes.ts, with no
-- foreign key), so the rename is cascaded onto tours.category by the OLD name
-- below. Without that, the three family tours would silently disappear from
-- this page.
--
-- Internal links point at /family-tours-egypt, /egypt-family-vacation-packages
-- and /egypt-tours-family. Those are TOUR slugs, and tours are served from the
-- site root (App.tsx's catch-all "/:slug"), so the category-path form
-- (/luxury-egypt-tour-packages/family-tours-egypt) would fall through to the
-- CategoryDetail route and 404: no category carries those slugs. The generator
-- that produced this file asserts the category form never appears.
--
-- Requires the categories.faqs column. That runner is not automatic on boot:
-- an admin triggers it once after deploying, via the "Run Migrations" button
-- in Admin Settings (POST /api/cms/settings/run-migrations).
--
-- No em dash or en dash in any text field, and every FAQ entry carries a
-- generated id, which faqSchema requires (see backfill-faq-ids.sql for what
-- happens when it is missing).

BEGIN;

UPDATE categories
SET
  name = 'Egypt Family Tours',
  description = '<p>Our Egypt family tours are built around a question most itineraries ignore: how much can a child absorb in a day before the wonder turns into exhaustion? Every journey here is paced deliberately, with short educational stops, shaded rest points during the hottest hours, and evenings left open rather than scheduled.</p>
<p>A private Egyptologist guide makes the difference. Hieroglyphics become stories, pharaohs become characters, and questions get answered properly instead of being lost in a group of forty. Five-star accommodation is selected for space and family comfort, and every transfer is private, so no day is lost to logistics.</p>
<h2>Why Choose Luxury Family Egypt Tours</h2>
<p>Travelling privately means the schedule bends to your family rather than the reverse. If a child is captivated by a tomb, you stay longer. If energy runs out early, you move on. That flexibility is impossible on a fixed group tour, and with children it matters more than any other single factor.</p>
<h3>What Makes Our Family Tours of Egypt Different</h3>
<p>Itineraries avoid the midday crush at major sites, include at least one genuine rest day, and balance monuments with experiences children remember, whether that means a felucca sail on the Nile or days by the Red Sea.</p>
<p>Three itineraries make up the collection. <a href="/family-tours-egypt">Seven days</a> covers Cairo, Luxor and Aswan at a comfortable pace. <a href="/egypt-family-vacation-packages">Ten days</a> adds Red Sea beach time, and <a href="/egypt-tours-family">twelve</a> reaches Alexandria and Siwa Oasis for families wanting more variety.</p>',
  short_description = 'Egypt family tours paced around children, with private Egyptologist guides, five-star stays, and itineraries that build in genuine rest.',
  seo_title = 'Egypt Family Tours | Private Luxury Journeys',
  meta_description = 'Egypt family tours designed around children''s pace, with private guides, five-star stays, and itineraries that balance ancient history with real rest.',
  focus_keyword = 'egypt family tours',
  schema_type = 'CollectionPage',
  faqs = '[{"id":"53b61a06-7fe2-4846-9d58-041ff90fcdac","question":"Is Egypt safe for family travel?","answer":"Egypt is generally safe for families, particularly with private guides and transfers handling all logistics. Our team stays reachable throughout, and routes are planned with children''s comfort and security in mind."},{"id":"761b6410-90a6-461a-ae5a-511f5e71e503","question":"What is the best age for children to visit Egypt?","answer":"Children from around six upward tend to engage most with the monuments, though our Egypt family tours accommodate younger travellers by shortening site visits and building in more downtime."},{"id":"0ec6c78c-3d46-4491-8035-da6b57acc825","question":"How much walking is involved in these family tours of Egypt?","answer":"Site visits typically involve thirty to sixty minutes of walking, often on uneven ground. Private vehicles wait close by, and the pace adjusts to your family rather than a fixed schedule."},{"id":"209a40a4-9186-4fb6-affd-3cf7ba07ee72","question":"How long should a family spend in Egypt?","answer":"Seven days covers Cairo, Luxor, and Aswan comfortably. Ten days adds Red Sea beach time, and twelve reaches Alexandria and Siwa Oasis for families wanting more variety."},{"id":"ebeaeda3-fa07-41e3-b342-4cee63bd80cf","question":"Do your Egypt family tours include flights between cities?","answer":"Yes, all internal flights are included, which avoids long road transfers and preserves energy for the sites themselves."},{"id":"18552f7f-5240-466d-af12-b7194306a443","question":"Can dietary requirements be accommodated?","answer":"Yes. Restaurants and hotels are briefed in advance, and our team handles allergies, vegetarian preferences, and children''s menus throughout the journey."},{"id":"31eabff4-7215-4c2d-8453-d8dc481f832f","question":"Are these private tours or group tours?","answer":"All family itineraries are fully private, meaning the guide, vehicle, and schedule belong to your family alone."}]'::jsonb,
  updated_at = now()
WHERE slug = 'egypt-family-tours';

-- Cascade the rename onto the tours filed under the OLD display name.
UPDATE tours
SET category = 'Egypt Family Tours', updated_at = now()
WHERE category = 'Luxury Family Egypt';

COMMIT;

-- ---------------------------------------------------------------------------
-- Verification
-- ---------------------------------------------------------------------------
SELECT slug, name, focus_keyword, length(seo_title) AS seo_len,
       length(meta_description) AS meta_len, jsonb_array_length(faqs) AS faq_count
FROM categories WHERE slug = 'egypt-family-tours';

SELECT 'faqs missing id' AS check, count(*) AS bad
FROM categories, jsonb_array_elements(faqs) f
WHERE slug = 'egypt-family-tours' AND NOT (f ? 'id');

-- The three family tours must still resolve to this category after the rename.
SELECT slug, category FROM tours
WHERE slug IN ('family-tours-egypt', 'egypt-family-vacation-packages', 'egypt-tours-family')
ORDER BY slug;

-- Nothing may still point at the old name.
SELECT count(*) AS tours_left_on_old_name FROM tours WHERE category = 'Luxury Family Egypt';

-- All three internal links must use the root tour path, not the category path.
SELECT 'root-path tour links' AS check,
       (SELECT count(*) FROM regexp_matches(description, 'href="/(family-tours-egypt|egypt-family-vacation-packages|egypt-tours-family)"', 'g')) AS ok_links,
       (SELECT count(*) FROM regexp_matches(description, 'href="/luxury-egypt-tour-packages/(family-tours-egypt|egypt-family-vacation-packages|egypt-tours-family)"', 'g')) AS bad_links
FROM categories WHERE slug = 'egypt-family-tours';
