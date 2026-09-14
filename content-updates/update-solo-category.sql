-- Egypt Tours for Solo Travellers: long-form copy and FAQs for the category
-- landing page.
--
-- The slug, name, seo_title and meta_description are already correct from the
-- earlier rename (update-solo-category-slug.sql) and are deliberately NOT
-- touched here. This script only fills in the two things that were still
-- missing: a real description and the FAQ set.
--
-- No cascade is needed. tours.category was already updated to the current
-- display name when the category was renamed, so the three solo tours still
-- resolve to this page.
--
-- Internal links point at /7-day-egypt-tour, /10-day-egypt-tour and
-- /12-days-egypt-tour. Those are TOUR slugs, and tours are served from the site
-- root (App.tsx's catch-all "/:slug"), so the category-path form would fall
-- through to the CategoryDetail route and 404: no category carries those slugs.
-- The generator that produced this file fails if that form appears, and also
-- checks the word count, the focus keyword's position, and the secondary
-- keywords.
--
-- Requires the categories.faqs column. That runner is not automatic on boot:
-- an admin triggers it once after deploying, via the "Run Migrations" button
-- in Admin Settings (POST /api/cms/settings/run-migrations).
--
-- No em dash or en dash in any text field. Every FAQ entry carries a generated
-- id, which faqSchema requires (see backfill-faq-ids.sql for what happens when
-- it is missing).

BEGIN;

UPDATE categories
SET
  description = '<p>Our Egypt tours for solo travellers are private journeys, not group departures. You travel with your own Egyptologist and your own driver, which means the day belongs to you: linger in a tomb that holds your attention, skip what does not, and stop for lunch when you are hungry rather than when a coach timetable says so.</p>
<p>That privacy changes what solo travel Egypt actually feels like on the ground. The friction independent visitors describe most often, negotiating at every gate, working out transport between cities, being quoted three prices for the same thing, is simply handled before you arrive. What is left is the country itself, and a guide with time to answer properly.</p>
<h2>Why Choose Private Egypt Solo Travel</h2>
<p>Egypt solo travel arranged privately costs more than joining a group, and what it buys is specific: quiet at the right moments. These itineraries favour places that reward an unhurried visit, Dahshur before the coaches reach Giza, Deir el-Medina where the tomb builders themselves lived, the painted ceilings at Dendera. Evenings are left unscheduled, because travelling alone is partly about having them to yourself.</p>
<h3>Safety and Comfort on Solo Trips to Egypt</h3>
<p>Solo trips to Egypt raise practical questions, particularly for women travelling alone. Every transfer is private and arranged in advance, accommodation is chosen for security as much as character, and someone from our team stays reachable at any hour. Single occupancy is the standard here rather than a surcharge negotiated after booking.</p>
<h3>Choosing Between the Three Routes</h3>
<p>Three itineraries anchor this collection. <a href="/7-day-egypt-tour">A week built around the quieter sites</a> trades the busiest monuments for their emptier equivalents across Giza, Luxor and Aswan. <a href="/10-day-egypt-tour">Ten days reaching Siwa Oasis</a> adds the Western Desert, among the most isolated inhabited places in the country. <a href="/12-days-egypt-tour">The longest route, through Alexandria to the Red Sea</a>, closes with time on the coast.</p>',
  faqs = '[{"id":"43e17714-94b3-4529-a1ff-1a3a78c193af","question":"Are these Egypt tours for solo travellers private or group tours?","answer":"Every itinerary here is fully private. The guide, the driver and the schedule belong to you alone, so nothing depends on reaching a minimum number of travellers or on a group reaching consensus."},{"id":"63d69b9b-009d-477f-999e-7a7d91f1d360","question":"Is Egypt safe for solo female travellers?","answer":"Egypt is generally safe for women travelling alone, and a private guide and driver remove most of the situations that cause difficulty. Accommodation is selected with security in mind, and our team stays reachable throughout the journey."},{"id":"576613a4-0318-4db6-8049-9a2ce120662e","question":"Is there a single supplement on solo trips to Egypt?","answer":"Pricing reflects private accommodation without sharing, so single occupancy is built into the quote rather than added later. Exact figures depend on travel dates and hotel selection, and the breakdown is clear before you book."},{"id":"216b596e-dab2-44d3-85fb-e01f26946e42","question":"What is included in these itineraries?","answer":"Accommodation throughout, a private licensed Egyptologist, all internal flights and transfers, entry to every listed site, and round-the-clock contact with our team. Meals vary by itinerary and are listed in full on each tour page."},{"id":"a6eb8b77-b68a-4143-ba6a-d2d6dcd2b9de","question":"How long should a solo trip to Egypt be?","answer":"Seven days covers Giza, Luxor and Aswan at an unhurried pace. Ten days adds Siwa Oasis in the Western Desert, and twelve reaches Alexandria and the Red Sea for travellers who want coastal time at the end."},{"id":"a8f44943-69cd-4983-be4d-8f8b42fee037","question":"Can the itinerary change once I arrive?","answer":"Yes, and this is one of the real advantages of travelling alone. With no group to accommodate, your guide can extend a site that captures your interest or move on early when it does not."},{"id":"ab74f56d-8dc8-4af8-9e32-98826301b1d8","question":"When is the best time of year to travel?","answer":"October through April offers the most comfortable temperatures for walking sites in Upper Egypt. Summer travel works with earlier starts and longer midday breaks, and the sites are noticeably quieter."}]'::jsonb,
  updated_at = now()
WHERE slug = 'egypt-tours-for-solo-travellers';

COMMIT;

-- ---------------------------------------------------------------------------
-- Verification
-- ---------------------------------------------------------------------------
-- The fields this script must not have touched, shown so a stray edit is obvious.
SELECT slug, name, seo_title, focus_keyword,
       length(meta_description) AS meta_len,
       jsonb_array_length(faqs) AS faq_count,
       array_length(regexp_split_to_array(regexp_replace(description, '<[^>]+>', ' ', 'g'), '\s+'), 1) AS desc_words
FROM categories WHERE slug = 'egypt-tours-for-solo-travellers';

SELECT 'faqs missing id' AS check, count(*) AS bad
FROM categories, jsonb_array_elements(faqs) f
WHERE slug = 'egypt-tours-for-solo-travellers' AND NOT (f ? 'id');

-- All three tours must be linked at the site root, and none under the category path.
SELECT 'tour links' AS check,
       (SELECT count(*) FROM regexp_matches(description, 'href="/(7-day-egypt-tour|10-day-egypt-tour|12-days-egypt-tour)"', 'g')) AS root_path_links,
       (SELECT count(*) FROM regexp_matches(description, 'href="/luxury-egypt-tour-packages/', 'g')) AS category_path_links
FROM categories WHERE slug = 'egypt-tours-for-solo-travellers';

-- The three solo tours still resolve to this category.
SELECT slug, category FROM tours
WHERE slug IN ('7-day-egypt-tour', '10-day-egypt-tour', '12-days-egypt-tour')
ORDER BY slug;
