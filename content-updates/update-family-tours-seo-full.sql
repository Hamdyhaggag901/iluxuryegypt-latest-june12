-- 12-point SEO pass for the three "Luxury Family Egypt" tours: slug
-- changes, image alt text, FAQ sections, internal links, an H2/H3 keyword
-- variation, and TouristTrip structured data. Run AFTER
-- update-family-tours-full.sql (which set title/duration/itinerary/
-- includes/excludes under the OLD slugs) — this script both renames the
-- slug and updates the remaining SEO fields in the same statement, so it
-- must run against the old slugs.
--
-- Requires tours.faqs and tours.schema_markup to exist first — run the
-- admin migration (Settings -> "Run migrations", POST
-- /api/cms/settings/run-migrations) before this script, or the faqs/
-- schema_type columns won't exist yet and every statement below will fail.
--
-- Old -> new slugs (301 redirects for these three are now handled in code —
-- see server/tour-redirects.ts):
--   10-day-egypt-family-tour -> family-tours-egypt
--   egypt-luxury-family-tour -> egypt-family-vacation-packages
--   14-day-egypt-family-tour -> egypt-tours-family
--
-- description is now real HTML (a <h3> subheading carrying a natural
-- keyword variation, plus 1-2 internal links to hotel/destination pages
-- with real, existing slugs verified against this project's seed data and
-- other content-update scripts) rather than the plain text
-- update-family-tours-full.sql wrote — legacyTextToHtml.ts only
-- auto-wraps plain text in <p> tags when it detects NO html tags at all,
-- so once any tag is present the content must already be fully-formed HTML.
--
-- FAQ entries include a generated "id" (client/src/pages/tour-detail.tsx
-- renders tour.faqs directly; shared/schema.ts's faqSchema requires a
-- non-empty id) — content-updates/backfill-faq-ids.sql fixed the exact
-- same omission for destinations.faqs after it silently broke that
-- table's admin "Update" button; writing it correctly from the start here
-- avoids reproducing that bug for tours.
--
-- gallery_alt is jsonb keyed by the gallery image's own URL (see
-- shared/schema.ts), so each tour's alt text list is mapped positionally
-- against whatever gallery array actually exists for that row (unnest
-- ... WITH ORDINALITY joined by position) rather than assuming URLs —
-- correct regardless of how many gallery photos exist, same approach as
-- content-updates/update-fairmont-gallery-alt.sql.

-- 10-day-egypt-family-tour -> family-tours-egypt
UPDATE tours
SET
  slug = 'family-tours-egypt',
  hero_image_alt = 'Family tours Egypt — private Egyptologist guide at the Great Pyramid of Giza',
  gallery_alt = (
    SELECT COALESCE(jsonb_object_agg(g.url, a.alt_text), '{}'::jsonb)
    FROM unnest(gallery) WITH ORDINALITY AS g(url, ord)
    JOIN unnest(ARRAY['Family tours Egypt — the Great Pyramid of Giza at sunrise', 'Family tours Egypt — exploring the Egyptian Museum in Cairo', 'Family tours Egypt — Karnak Temple''s columned halls in Luxor', 'Family tours Egypt — the Valley of the Kings in Luxor', 'Family tours Egypt — Kom Ombo Temple on the Nile', 'Family tours Egypt — felucca sailing on the Nile in Aswan', 'Family tours Egypt — a Nubian village near Aswan', 'Family tours Egypt — a family exploring ancient Egyptian temples together']) WITH ORDINALITY AS a(alt_text, ord) ON g.ord = a.ord
  ),
  description = '<p>Egypt has a rare gift for making history feel alive, and nowhere is that clearer than on a week built for the whole family. This family tours Egypt itinerary moves from the Great Pyramid of Giza to the temples of Luxor and the quiet Nile waters of Aswan, giving children and parents alike the space to stand before ancient monuments and ask questions no history book answers quite as vividly.</p>
<h3>Why This Family Tour of Egypt Works So Well for Every Age</h3>
<p>Each day is paced to hold a child''s attention without exhausting it, blending short educational stops with moments simply to look, wonder, and take in the scenery. A private guide and vehicle remove the friction of navigating a new country, so energy goes toward experiences rather than logistics.</p>
<p>A felucca sail on the Nile offers a natural pause between temple visits, while Nubian villages along the riverbank introduce a living culture alongside the ancient one. In <a href="/destinations/aswan">Aswan</a>, evenings unfold at the <a href="/hotel/old-cataract-hotel">Sofitel Legend Old Cataract</a>, a storied riverside hotel that has hosted travelers for over a century. Families leave not just with photographs, but with stories from standing inside a pyramid together and watching their children fall in love with a civilization thousands of years old.</p>',
  schema_type = 'TouristTrip',
  faqs = '[{"id":"dfb5f937-6236-403e-ba9a-3313b5fe5cd8","question":"What is included in a 7-day family tour to Egypt?","answer":"This 7-day family tour includes six nights of five-star accommodation, all meals, a private Egyptologist guide, domestic flights between Cairo, Luxor, and Aswan, private transfers, entry fees to every listed site, a Nile felucca sail, and gratuities. International flights and visas are arranged separately."},{"id":"b7eed34c-de29-4b76-8ff2-79855778022f","question":"How much do family tours Egypt typically cost?","answer":"Pricing for family tours Egypt varies by season, hotel category, and group size, since private guides and five-star stays are tailored per family rather than sold as a fixed package. Contact our travel specialists for a quote matched to your exact dates and preferences."},{"id":"567b3cf0-318f-4441-9456-978a6f84f30e","question":"Is Egypt safe for family travel?","answer":"Yes. Egypt''s major tourist sites see millions of family visitors each year, and tourist areas maintain a visible security presence. Traveling with a private guide and vehicle, as this itinerary does, adds an extra layer of comfort, especially with young children in unfamiliar cities."},{"id":"fdc4dfb5-c09b-4a37-af11-0bfe37c4ea7f","question":"What is the best age for kids to visit Egypt?","answer":"Most families find ages six and up ideal, since children can walk moderate distances, handle warm daytime temperatures, and genuinely engage with the history rather than just enduring it. Younger children can still enjoy the trip, particularly with a paced, private itinerary like this one."},{"id":"5ac76066-d110-43a7-9ebe-591dcccd7fc1","question":"Do family tours Egypt include flights between cities?","answer":"Yes, this itinerary includes the domestic flights connecting Cairo, Luxor, and Aswan, since covering those distances by road would eat into time better spent exploring. Only international flights to and from Egypt are left for families to book separately."},{"id":"d267dcce-8223-402b-93d9-9646c166552f","question":"How much walking is involved in this itinerary?","answer":"Expect moderate walking at sites like Karnak Temple and the Valley of the Kings, often on uneven ground and in warm weather. Private guides pace each visit to the family''s comfort, and vehicles wait nearby, so there''s no need to cover long distances on foot unsupported."},{"id":"9e50bf9b-bb66-4185-a093-bfacaee90dcf","question":"Can dietary restrictions be accommodated on family tours Egypt?","answer":"Yes. Hotels and restaurants on this itinerary are used to accommodating vegetarian, gluten-free, halal, and other common dietary needs. Let your travel specialist know about any restrictions when booking so arrangements can be confirmed with each property in advance."}]'::jsonb
WHERE slug = '10-day-egypt-family-tour';

-- egypt-luxury-family-tour -> egypt-family-vacation-packages
UPDATE tours
SET
  slug = 'egypt-family-vacation-packages',
  hero_image_alt = 'Egypt family vacation packages — Nile temples and Red Sea coastline',
  gallery_alt = (
    SELECT COALESCE(jsonb_object_agg(g.url, a.alt_text), '{}'::jsonb)
    FROM unnest(gallery) WITH ORDINALITY AS g(url, ord)
    JOIN unnest(ARRAY['Egypt family vacation packages — the Great Pyramid of Giza', 'Egypt family vacation packages — Karnak Temple in Luxor', 'Egypt family vacation packages — the Valley of the Kings', 'Egypt family vacation packages — felucca sailing on the Nile in Aswan', 'Egypt family vacation packages — a Nubian village near Aswan', 'Egypt family vacation packages — Red Sea coastline in Hurghada', 'Egypt family vacation packages — a family relaxing by the Red Sea', 'Egypt family vacation packages — snorkeling near Hurghada''s coral reefs']) WITH ORDINALITY AS a(alt_text, ord) ON g.ord = a.ord
  ),
  description = '<p>Ten days gives a family the rare luxury of time, enough to explore Egypt''s ancient wonders without rushing and still leave room to unwind by the Red Sea. This egypt family vacation packages itinerary carries families from the pyramids of Giza through the temples of Luxor and Aswan, then west to the warm waters of Hurghada for a few days of pure relaxation before returning to Cairo.</p>
<h3>What Sets This Egypt Family Vacation Package Apart</h3>
<p>Children experience history not as something read about but as something walked through, standing inside temples built thousands of years ago and sailing waters that once carried pharaohs. Nights along the Nile are spent at properties like the <a href="/hotel/mena-house-hotel-egypt">Marriott Mena House</a>, set at the foot of the pyramids themselves. The pacing allows for real rest between cultural stops, avoiding the exhaustion that shorter, more compressed itineraries often bring to younger travelers.</p>
<p>By blending ancient sites with beach days in <a href="/destinations/hurghada">Hurghada</a>, this journey gives every member of the family something to look forward to each morning, whether that means exploring a tomb or simply floating in the Red Sea. Ten days proves long enough to see Egypt properly, and short enough to keep everyone excited until the final day.</p>',
  schema_type = 'TouristTrip',
  faqs = '[{"id":"88133b07-9509-4312-8401-e96dd3a02914","question":"What makes this different from other egypt family vacation packages?","answer":"Unlike group-based egypt family vacation packages, this journey is entirely private, with your own guide and vehicle throughout. It also balances ten days between cultural sites along the Nile and genuine beach relaxation in Hurghada, rather than packing every day with sightseeing alone."},{"id":"6994c2bf-ffa0-408d-a4f2-74f879ff84ad","question":"Is Hurghada suitable for young children?","answer":"Yes. Hurghada''s calm Red Sea coastline and family-oriented resorts make it well suited to young children, offering shallow swimming areas, pools, and simple beach days after a week of temple visits. It''s the itinerary''s deliberate change of pace for younger travelers."},{"id":"4d0909b5-807d-481b-bd65-7b60394ca505","question":"How many days should a family spend in Egypt?","answer":"Ten days is enough time to see Cairo, Luxor, and Aswan''s major sites without rushing, plus two to three days to unwind by the Red Sea. Shorter trips often feel like a checklist; this length leaves room to actually enjoy each stop."},{"id":"3a1349f0-3b01-4fa8-929d-93ed897b7ce0","question":"What is included in this Egypt family vacation package?","answer":"This package includes nine nights of five-star accommodation, all meals, a private Egyptologist guide, domestic flights between Cairo, Luxor, Aswan, and Hurghada, private transfers, entry fees, a Nile felucca sail, and gratuities. International flights and visas are booked separately."},{"id":"dd74aab6-9c4e-4506-b5c4-bd44ce65b8d0","question":"Are private guides included in egypt family vacation packages?","answer":"Yes, a private, licensed Egyptologist guide accompanies your family throughout this entire ten-day journey, not just at select stops. This keeps pacing flexible around children''s energy levels and allows questions to be answered as they come up at each site."},{"id":"d3c28c4e-b22f-46c7-b7e5-64a67f2ec2c6","question":"What is the best time of year for this itinerary?","answer":"October through April offers the most comfortable temperatures for both temple visits and Red Sea days, avoiding Egypt''s peak summer heat. Winter holidays are popular, so booking a few months ahead is worthwhile if your dates are fixed."},{"id":"fd12d196-e784-4dd0-af6d-101599546951","question":"Can this package be customized for larger families?","answer":"Yes, itineraries and accommodation can be adjusted for larger family groups, including connecting rooms or suites where needed. Speak with a travel specialist about your group size so hotels and vehicles can be arranged to comfortably fit everyone together."}]'::jsonb
WHERE slug = 'egypt-luxury-family-tour';

-- 14-day-egypt-family-tour -> egypt-tours-family
UPDATE tours
SET
  slug = 'egypt-tours-family',
  hero_image_alt = 'Egypt tours family — Alexandria coastline, Nile temples, and Siwa Oasis desert',
  gallery_alt = (
    SELECT COALESCE(jsonb_object_agg(g.url, a.alt_text), '{}'::jsonb)
    FROM unnest(gallery) WITH ORDINALITY AS g(url, ord)
    JOIN unnest(ARRAY['Egypt tours family — the Great Pyramid of Giza', 'Egypt tours family — Qaitbay Citadel in Alexandria', 'Egypt tours family — the Bibliotheca Alexandrina', 'Egypt tours family — Karnak Temple in Luxor', 'Egypt tours family — the Valley of the Kings', 'Egypt tours family — felucca sailing on the Nile in Aswan', 'Egypt tours family — the Temple of the Oracle in Siwa Oasis', 'Egypt tours family — Shali Fortress in Siwa Oasis']) WITH ORDINALITY AS a(alt_text, ord) ON g.ord = a.ord
  ),
  description = '<p>Twelve days transforms an Egypt family trip from a highlights tour into a genuine journey through the country''s full range, from Mediterranean shores to ancient temples and finally the silence of the Western Desert. This egypt tours family itinerary begins at the pyramids of Giza, travels north to cosmopolitan Alexandria, south through the temples of Luxor and Aswan, and west into the remote beauty of Siwa Oasis before returning to Cairo.</p>
<h3>Why This Egypt Tour Suits Families of Every Size</h3>
<p>This is not a repeat of Egypt''s most familiar postcard images stretched over more days, but a deliberately varied journey that gives children a fuller picture of the country, its Mediterranean history, its pharaonic monuments, and its desert culture, all within a single family trip. In <a href="/destinations/alexandria">Alexandria</a>, Roman catacombs sit a short drive from a coastline the children won''t expect from Egypt. Each region offers a different rhythm, keeping the itinerary fresh even for children who tire easily of repetition.</p>
<p>By the journey''s end, families have touched nearly every corner of Egypt''s character, from ancient tombs to salt lakes shimmering in the desert sun of <a href="/destinations/siwa-oasis">Siwa Oasis</a>. Twelve days proves long enough to make Egypt feel fully explored rather than merely visited, a rare achievement for a single family vacation.</p>',
  schema_type = 'TouristTrip',
  faqs = '[{"id":"af010e55-067b-497e-897c-46334c6a4115","question":"Is 12 days enough for egypt tours family covering this many destinations?","answer":"Yes, twelve days comfortably covers Giza, Cairo, Alexandria, Luxor, Aswan, and Siwa Oasis without feeling rushed, since travel between regions is handled by flights and a scenic desert drive rather than long overland journeys. Each stop gets enough time to be genuinely explored."},{"id":"1e528fb9-2f5f-4c37-9211-f1fcad116ea8","question":"What is included in this Alexandria, Nile, and Siwa itinerary?","answer":"This itinerary includes eleven nights of five-star accommodation, all meals, a private Egyptologist guide, a domestic flight between Cairo and Luxor, private transfers throughout, entry fees to every listed site, a Nile felucca sail, and gratuities. International flights and visas are separate."},{"id":"7023fad7-bda2-43ab-9e31-b4fd973c3b62","question":"Is the drive to Siwa Oasis comfortable for children?","answer":"The drive to Siwa takes several hours through changing desert scenery, which most children find genuinely engaging rather than tiring, especially framed as part of the adventure. A private, air-conditioned vehicle with stops as needed keeps the journey comfortable."},{"id":"6d706d4d-5f42-4a47-a97d-f27d2415288f","question":"How does this differ from a standard Nile Valley family tour?","answer":"Most Nile Valley itineraries stop at Cairo, Luxor, and Aswan. This one adds Alexandria''s Mediterranean coast and the remote Siwa Oasis, giving families a fuller picture of Egypt beyond its best-known temples, from Roman catacombs to salt lakes in the Western Desert."},{"id":"e410a859-3eb9-4bac-981e-824760a1081d","question":"Are domestic flights included in egypt tours family packages?","answer":"This itinerary includes one domestic flight, between Cairo and Luxor, with Alexandria reached by road and Siwa Oasis by a scenic desert drive, both round trip from Cairo. This mix keeps the journey varied rather than moving between airports every few days."},{"id":"7235baff-0f31-4152-bc14-648c750177b3","question":"What should families pack for the desert portion of the trip?","answer":"Pack light, breathable layers for daytime heat, a warmer layer for cool desert evenings, sturdy walking shoes, sunscreen, and a reusable water bottle. Siwa Oasis is more remote than Egypt''s main tourist cities, so comfortable, practical clothing matters more there than elsewhere on the trip."},{"id":"ea12c30b-b919-42c1-b441-ca23f57bfb6f","question":"Can this itinerary be shortened or extended?","answer":"Yes, this twelve-day journey can be adjusted, whether that means trimming a day in Cairo or adding extra time in Siwa Oasis. Speak with a travel specialist about which stops matter most to your family so the itinerary can be tailored accordingly."}]'::jsonb
WHERE slug = '14-day-egypt-family-tour';
