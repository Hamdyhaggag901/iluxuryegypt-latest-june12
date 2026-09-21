-- Wave "rewrite-phase-c": 7 articles, loaded in one file.
--
--   vaccines-for-egypt-travel becomes vaccinations-needed-for-egypt  (vaccinations needed for egypt)
--   how-to-plan-a-luxury-egypt-trip becomes planning-a-trip-to-egypt  (planning a trip to egypt)
--   things-to-know-before-traveling-to-egypt becomes egypt-travel-tips  (egypt travel tips)
--   egypt-packing-list becomes what-to-pack-for-egypt  (what to pack for egypt)
--   private-egypt-tour becomes private-tours-in-cairo-egypt  (private tours in cairo egypt)
--   bespoke-egypt-travel becomes tailor-made-egypt-tours  (tailor-made egypt tours)
--   what-currency-does-egypt-use becomes currency-in-egypt  (currency in egypt)
--
-- These rows are ALREADY PUBLISHED and already indexed. This file rewrites
-- their body and their SEO fields in place. published_at is never touched, so
-- each article keeps the date it first went out, which is what its BlogPosting
-- has been telling crawlers since. updated_at carries the rewrite, and
-- dateModified follows from it.
--
-- 7 of these slugs change: vaccines-for-egypt-travel to vaccinations-needed-for-egypt, how-to-plan-a-luxury-egypt-trip to planning-a-trip-to-egypt, things-to-know-before-traveling-to-egypt to egypt-travel-tips, egypt-packing-list to what-to-pack-for-egypt, private-egypt-tour to private-tours-in-cairo-egypt, bespoke-egypt-travel to tailor-made-egypt-tours, what-currency-does-egypt-use to currency-in-egypt.
-- server/path-redirects.ts sends every old path to its new one with a 301, and
-- scripts/test-redirects.ts proves it over HTTP for GET and for HEAD. Deploy
-- the server BEFORE running this file, or the old URLs 404 in the window
-- between the two.
--
-- RUN THIS BEFORE scripts/fill-post-images.ts, not after. The rewrite replaces
-- body_en outright, which is the point, and that discards any <figure> the
-- image script had inserted. Fill the images once the prose is in place.
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
--
-- The hero alt text each article wants, carrying its focus keyword, which is
-- one of the required keyword placements. featured_image_alt stays NULL until
-- there is an image to describe; these are the strings to use when there is:
--
--   vaccinations-needed-for-egypt
--     A travel clinic desk with a vaccination record card while arranging vaccinations needed for egypt
--   planning-a-trip-to-egypt
--     A map, notebook and passport spread across a table while planning a trip to egypt
--   egypt-travel-tips
--     A busy Cairo street at dusk with a tea seller, the setting behind most egypt travel tips
--   what-to-pack-for-egypt
--     An open suitcase with linen shirts, a scarf and walking shoes showing what to pack for egypt
--   private-tours-in-cairo-egypt
--     A guide and two travellers alone at a Saqqara tomb entrance on private tours in cairo egypt
--   tailor-made-egypt-tours
--     An itinerary draft and a Nile map on a desk during the planning of tailor-made egypt tours
--   currency-in-egypt
--     A hand holding folded Egyptian pound notes at a market stall, the currency in egypt
--
-- Safe to run twice. Each UPDATE matches the old slug and the new one, so a
-- second run finds the row it renamed on the first and writes the same values
-- to it again.

-- ---------------------------------------------------------------------------
-- Before: what is already in the database for these slugs.
-- On a first run this returns no rows, which is the expected result.
-- ---------------------------------------------------------------------------
SELECT slug,
       status,
       scheduled_at,
       published_at,
       length(body_en) AS body_chars,
       (body_en LIKE '%<figure%') AS has_images,
       updated_at
FROM posts
WHERE slug IN ('vaccinations-needed-for-egypt', 'vaccines-for-egypt-travel', 'planning-a-trip-to-egypt', 'how-to-plan-a-luxury-egypt-trip', 'egypt-travel-tips', 'things-to-know-before-traveling-to-egypt', 'what-to-pack-for-egypt', 'egypt-packing-list', 'private-tours-in-cairo-egypt', 'private-egypt-tour', 'tailor-made-egypt-tours', 'bespoke-egypt-travel', 'currency-in-egypt', 'what-currency-does-egypt-use')
ORDER BY published_at NULLS LAST, slug;

BEGIN;

-- vaccines-for-egypt-travel becomes vaccinations-needed-for-egypt
UPDATE posts SET
  slug = 'vaccinations-needed-for-egypt',
  title_en = 'Vaccinations Needed for Egypt: What to Ask a Clinic',
  body_en = '<p><strong>Last reviewed: September 2026.</strong> This is not medical advice and it is not a list of what you need. Health requirements change and only a clinician who knows your history can answer for you. The official source is linked below.</p>

<p>No vaccination is required to enter Egypt from the United States, the United Kingdom or Europe. What matters is that your routine vaccinations are current, and that a travel clinic looks at your itinerary four to six weeks before you fly. That appointment is the whole job.</p>

<p>The honest answer on vaccinations needed for egypt is that there is no fixed list. Anyone who hands you one without asking where you are going, how long for, and what your history is should not be trusted with the question.</p>

<h2>Do I Need a Vaccination for Egypt?</h2>

<p>Not to be let in. The question do i need a vaccination for egypt is usually asked about entry requirements, and for travellers from North America and Europe the entry answer is no.</p>

<p>The exception is yellow fever. Egypt asks for a certificate from travellers arriving from a country where yellow fever is present, which is about where you have been rather than where you are going. If your trip routes through sub-Saharan Africa or parts of South America, check the current position before you book.</p>

<p>Everything else is a recommendation rather than a rule, which is exactly why it needs a person rather than a page.</p>

<p>The phrase vaccinations needed for egypt suggests a checklist exists somewhere. It does not, and that is not evasion. It is the reason the appointment matters.</p>

<h2>Vaccinations Needed for Egypt: Two Different Lists</h2>

<table>
<thead>
<tr><th>Routine, and worth checking anyway</th><th>Commonly raised for Egypt, decided by your clinic</th></tr>
</thead>
<tbody>
<tr><td>The childhood schedule your own country recommends</td><td>Hepatitis A</td></tr>
<tr><td>Tetanus, diphtheria and polio boosters</td><td>Typhoid</td></tr>
<tr><td>Measles, mumps and rubella</td><td>Hepatitis B</td></tr>
<tr><td>Seasonal flu, and whatever your country currently advises</td><td>Rabies, for longer or rural trips</td></tr>
</tbody>
</table>

<p>The right hand column is not a prescription. It is what a travel clinic will usually put on the table for a trip to Egypt, and what they actually advise depends on your itinerary, your age, your history and how long you are staying.</p>

<h2>The Routine Ones Nobody Thinks About</h2>

<p>This is where most of the value is, and it has nothing to do with Egypt.</p>

<p>Adults are routinely behind on tetanus and on measles, and a trip abroad is the thing that makes anyone check. A booster you were due anyway is not a travel vaccine, it is just a vaccine, and the appointment is a good moment to catch it.</p>

<p>Adults travelling abroad for the first time in a decade are the common case here. The trip is the prompt, the clinic is the place, and two of the three things they leave with have nothing to do with Egypt at all.</p>

<p>Bring your record card or your digital record to the appointment. A clinic working from memory has to guess, and guessing usually means giving you something you already have.</p>

<h2>The Recommended Vaccinations for Egypt Question</h2>

<p>What people mean by recommended vaccinations for egypt is the right hand column above, and the word recommended is doing a lot of work in that phrase.</p>

<p>Recommended by whom, for whom, and for what kind of trip. A two week itinerary through Cairo, the Nile and a good hotel each night is a different risk profile from three months of backpacking, and the same list does not serve both.</p>

<p>That is the conversation to have, and it takes about twenty minutes with someone qualified to have it.</p>

<!-- OWNER: first-hand paragraph fits here, on what guests normally report their clinics telling them -->

<h2>Children, Pregnancy and Anything Ongoing</h2>

<p>All three change the conversation, and all three are reasons to book earlier rather than later.</p>

<p>Children are on a different schedule and some things are given at different ages, so a family trip needs the appointment sooner. Pregnancy rules certain options out and changes the timing advice. An ongoing condition, or anything that suppresses the immune system, moves the whole discussion into territory a travel page has no business in.</p>

<p>Say all of it at the appointment. The list of vaccinations for egypt that suits a healthy adult on a two week trip is not the list for any of these cases.</p>

<h2>When to Book the Appointment</h2>

<p>Four to six weeks before you fly.</p>

<p>Some courses need more than one dose and some need time to take effect, and both of those facts are inconvenient to discover a week out. Earlier is fine. Later is usually still worth doing, because partial protection beats none and a clinician can tell you what is still useful.</p>

<p>Book it at the same time as the visa, which is the other errand people postpone until it is a problem.</p>

<h2>Where the Actual Guidance Lives</h2>

<p>One page, and it is not this one.</p>

<p>The United States Centers for Disease Control publishes a destination page for Egypt at <a href="https://wwwnc.cdc.gov/travel/destinations/traveler/none/egypt">wwwnc.cdc.gov</a> covering vaccines, food and water advice and the current health notices. It is updated when the position changes and it is written by people qualified to write it.</p>

<p>Read that, then take it to a travel clinic. Travellers outside the United States should also check their own national health service guidance, which sometimes differs.</p>

<p>No page can give you the vaccinations needed for egypt as they apply to you, and the CDC page does not pretend to. It tells you what the discussion should cover.</p>

<h2>Malaria and the Questions That Follow</h2>

<p>Malaria does not usually come up for the classical route, and your clinic will confirm that against where you are actually going rather than against a general statement on a travel page.</p>

<p>Mosquito bites are still worth avoiding, mostly because they are unpleasant. Repellent, long sleeves at dusk on the river, and the air conditioning on at night covers it.</p>

<p>If your trip includes anywhere outside the usual Cairo, Nile and Red Sea route, say so at the appointment. That is the sentence that changes the advice.</p>

<h2>The Risk That Actually Catches People</h2>

<p>Stomach trouble, and no vaccine prevents most of it.</p>

<p>Drink bottled or filtered water, including for brushing teeth. Eat hot food that is hot and cold food from somewhere you trust. Peel fruit yourself. The hotels and boats on this kind of trip are careful, and the risk is mostly a street stall on an afternoon off.</p>

<p>Pack oral rehydration sachets and whatever your doctor suggests for the usual case. Two days of feeling wrong is the common outcome and it is a nuisance rather than an emergency.</p>

<p>Wash your hands more often than feels necessary. It is unglamorous and it is the single most effective thing on this page.</p>

<!-- OWNER: first-hand paragraph fits here, on how often this actually affects guests and what the guides carry -->

<h2>Vaccines for Egypt and the Rest of the Admin</h2>

<p>The health appointment is one of four errands before a trip here, and it is the only one with a lead time you cannot compress.</p>

<p>The other three are the visa, the insurance and the packing. <a href="/blog/egypt-travel-insurance">The insurance article</a> covers what a policy has to carry, which matters here because a medical problem abroad is the thing the policy exists for, and <a href="/blog/egypt-travel-tips">the practical notes</a> cover the water, the food and the rest of the day to day.</p>

<p>The <a href="/egypt-travel-guide/cairo-travel-guide">Cairo guide</a> covers where the good hospitals are. Guests on our <a href="/best-luxury-egypt-tours">longer Egypt tours</a> travel with a guide who knows which pharmacy is open and where to go if something is wrong, which is not a substitute for the appointment but does shorten the distance to help.</p>

<p>Book the clinic first. Everything else on the list can be done in an evening.</p>',
  excerpt = 'There is no fixed list, and anyone who hands you one without asking where you are going is guessing. What the appointment actually covers, and when to make it.',
  category = 'Travel Planning',
  tags = ARRAY['Health', 'Before You Go', 'Egypt Travel Planning']::text[],
  focus_keyword = 'vaccinations needed for egypt',
  meta_title = 'Vaccinations Needed for Egypt in {year}: Basics',
  meta_description = 'No vaccinations needed for egypt are required at the border from the US or Europe. What is routine, what a clinic will raise, and when to book the appointment.',
  faqs = '[{"id":"6cb92a48-6271-55df-b9a2-869aa4c2936f","question":"What vaccinations are required to enter Egypt?","answer":"None, for travellers arriving from the United States, the United Kingdom or Europe. The 1 exception is yellow fever: Egypt asks for a certificate from anyone arriving from a country where it is present, which depends on where you have been rather than where you are going. Check before booking a routed trip."},{"id":"e815bc5c-46e7-5372-9e0e-4524f5aa7853","question":"What is the difference between required and recommended vaccinations for Egypt?","answer":"Required means the border asks for it, and for Egypt that is yellow fever alone, and only on certain routes. Recommended means a clinician suggests it for your trip. A travel clinic will normally raise the same 4 for Egypt: hepatitis A, typhoid, hepatitis B and rabies for longer or rural stays."},{"id":"aef9cd08-e2f3-5605-93c6-140319c68af3","question":"How far in advance should you see a travel clinic?","answer":"4 to 6 weeks before departure. Some courses need more than 1 dose and some need time to become effective, and both are awkward to discover a week before a flight. Later is still worth doing, because partial protection beats none and a clinician can say what remains useful."},{"id":"294c03ed-fa48-51f9-81aa-9cec4fbbc34b","question":"Is a yellow fever certificate needed for Egypt?","answer":"Only if you are arriving from a country where yellow fever is present. It is 1 of the few genuine entry rules and it turns on your route rather than your destination, so a direct flight from North America or Europe is unaffected. A connection through affected regions is not."},{"id":"51c4fbb3-88b0-5150-a16e-578efe04d760","question":"Do you need malaria tablets in Egypt?","answer":"Usually not for the classical Cairo, Nile and Red Sea route, but that is a question for your clinic rather than a travel page. Mention every place on your itinerary at the appointment, because 1 stop outside the usual route is what changes the answer. Avoiding bites is worth doing regardless."},{"id":"2180f70d-0190-56d4-ac3b-76bf713952d7","question":"Which is better protection in Egypt, vaccines or food and water care?","answer":"Food and water care, for most travellers. Stomach upset is the complaint that actually affects people and no vaccine prevents most of it. Drink bottled or filtered water including for teeth, eat hot food hot, peel your own fruit, and wash your hands more than the 2 or 3 times a day that feels normal."},{"id":"68d6cd74-edb6-5278-9981-87cf6dbb7b7e","question":"Where should you check current health guidance for Egypt?","answer":"The CDC destination page for Egypt at wwwnc.cdc.gov, which covers vaccines, food and water advice and current health notices, and is updated when the position changes. Travellers outside the United States should also read their own national guidance, because the 2 sets of advice sometimes differ on what is recommended."},{"id":"1459d3af-6e44-5589-b03e-22a21602c90e","question":"Should you bring your vaccination records to the appointment?","answer":"Yes, and it is the 1 thing most people forget. A clinic working from your memory has to guess what you have had, and guessing usually means being given something you already carry. Bring the paper card or the digital record, and the appointment gets shorter and cheaper."}]'::jsonb,
  schema_type = 'BlogPosting',
  status = 'published',
  updated_at = now()
-- Both slugs, so a second run finds the row it renamed on the first.
WHERE slug IN ('vaccines-for-egypt-travel', 'vaccinations-needed-for-egypt');

-- how-to-plan-a-luxury-egypt-trip becomes planning-a-trip-to-egypt
UPDATE posts SET
  slug = 'planning-a-trip-to-egypt',
  title_en = 'Planning a Trip to Egypt: Where to Start',
  body_en = '<p>Dates first, then length, then the shape of the trip, then the boat, then the flights. Everything else follows from those five, and almost nothing is reversible once the internal flights are ticketed. Ten to twelve days between October and April is where most of it lands.</p>

<p>Planning a trip to egypt goes wrong in a predictable way. People start with the sites, build a list of everything they have heard of, and then try to fit dates and flights around a list that was never a route.</p>

<p>Start at the other end.</p>

<h2>Planning a Trip to Egypt: the Order That Works</h2>

<p>Dates, length, shape, river, flights, admin. Six steps, and the sequence matters more than any individual answer.</p>

<p>Each step narrows the next one. Pick the dates and the boat options narrow. Pick the length and the route decides itself. Do it out of order and you will book something twice.</p>

<p>The whole sequence takes an evening if you already know what you want, and a fortnight of thinking if you do not. Neither is wrong.</p>

<h2>Step One: Fix the Dates</h2>

<p>Nothing else can happen until this does.</p>

<p>October to April is the season. Outside it, Luxor and Aswan are genuinely hot and the itinerary has to be rebuilt around dawn starts. Late October, November, February and March are the best of the window. December and January are the busiest and the most expensive.</p>

<p>If your dates are fixed by work or by school, say so immediately and build around them rather than pretending they are flexible. A trip designed for March and then moved to July is a different trip.</p>

<p>The <a href="/blog/best-time-to-visit-egypt">month by month guide</a> covers what each month actually feels like, including the two or three we would talk you out of.</p>

<h2>Step Two: Decide the Shape, Not the Sites</h2>

<p>This is the step people skip, and it is the one that does the most work.</p>

<p>There are three shapes. Cairo and the Nile. Cairo, the Nile and the Red Sea. Cairo, the Nile and something further out, meaning Abu Simbel, the Western Desert or Alexandria.</p>

<p>Pick the shape before you pick a single temple. Once the shape is set, the sites inside it are obvious and the arguments about what to cut stop happening, because the shape has already made those decisions.</p>

<p>Most people arrive at shape two or shape three and then argue about it for a week. The argument is usually really about length, and it resolves itself the moment the number of nights is fixed.</p>

<p>A list of sites is not an itinerary. It is a wish list with no travel time in it, and travel time is most of what a trip here is made of.</p>

<h2>Step Three: How Long</h2>

<p>Eight days is the floor. Ten to twelve is the sweet spot. Fourteen buys the things that usually get cut.</p>

<p>Eight covers Cairo and a short cruise and nothing else, with no slack in it. Ten adds a proper Cairo, a four night sailing and a day that is not scheduled. Twelve adds the Red Sea or Abu Simbel without taking anything away.</p>

<p>Count the flying days honestly. A ten day trip from the United States is eight days on the ground, and from Europe it is nine. People plan the first number and live the second.</p>

<p>Under a week, the internal flights and the transfers eat so much of the time that the trip becomes a series of airports. It can be done and it is rarely worth the airfare.</p>

<h2>Step Four: Group, Fixed Private, or Built From Nothing</h2>

<p>Three ways to buy the same country.</p>

<p>A group departure is the cheapest and runs to a timetable set by the coach. A fixed private itinerary is a published route run privately, which for many travellers is the right balance. The third is a route built around your dates and your interests, which is what fixed dates and specific preferences usually end up needing.</p>

<p>The difference is not luxury. It is who controls the clock, and at Giza and Abu Simbel the clock decides what you actually see.</p>

<!-- OWNER: first-hand paragraph fits here, on what people change most often between the first call and the final itinerary -->

<h2>Who Is Actually Travelling</h2>

<p>The same ten days are three different trips depending on who is in the party.</p>

<p>Two people can start at six in the morning every day and be perfectly happy. A family with children under ten cannot, and should not try: that trip wants a pool in the afternoons and fewer temples before lunch. Parents in their seventies want the same sites at a slower pace, with the steps and the heat planned around rather than endured.</p>

<p>Say this at the start rather than halfway through. It is the most useful single thing you can tell whoever is building the route, and it is the thing people most often leave out because saying it feels like an apology.</p>

<p>Mobility in particular is worth being blunt about. Several of the best things here involve uneven ground, narrow passages and a great many steps, and there is a good alternative for every one of them if somebody knows in advance.</p>

<h2>Step Five: The River Decides Itself</h2>

<p>Four nights, Aswan to Luxor, and then the only real question is the boat.</p>

<p>Dahabiya, boutique ship or large cruiser, and the answer changes the whole feel of the middle of your trip. Book this earlier than feels necessary. The small boats in the good months go first, and a cruise booked late is a cruise chosen from what is left.</p>

<p>Fly into Aswan and out of Luxor, or the reverse, rather than doubling back. Doubling back costs a day and there is nothing to see on it.</p>

<h2>Step Six: Flights, in the Right Order</h2>

<p>International first, internal second, and never the other way round.</p>

<p>The international ticket sets your arrival and departure days and therefore everything else. Buy it once the shape and the length are settled and before anything internal is booked. Internal flights between Cairo, Aswan, Luxor and Hurghada are short, frequent and cheap, and they are the part your operator should be handling because the schedules move.</p>

<p>Do not book a tight onward connection on your arrival day. A long haul landing, the visa counter and immigration at Cairo is not a thirty minute business on a busy evening.</p>

<h2>Step Seven: The Admin</h2>

<p>Four errands, and only one of them has a lead time you cannot compress.</p>

<p>The health appointment is the one to book first, four to six weeks out. The visa is an evening''s work at the official portal. The insurance should be bought the day your first deposit leaves. The packing can wait.</p>

<p>Check your passport expiry today, before any of the above. Egypt wants at least six months of validity beyond your arrival date, and a passport renewal is the only item on this page that can actually stop the trip.</p>

<p><a href="/blog/egypt-visa-for-us-citizens">The visa article</a> covers the two routes and what each needs.</p>

<h2>How to Plan a Trip to Egypt Without an Operator</h2>

<p>It is entirely possible and it is more work than people expect.</p>

<p>You are arranging international flights, three or four internal flights, hotels in three cities, a cruise, transfers at both ends of every leg, guides in each place, and entrance arrangements. Each of those is easy. The joins between them are where the days go missing.</p>

<p>The two things hardest to do alone are the boat, because the good ones are not all sold online, and the timing at the major sites, because being at Giza at opening rather than at ten is an arrangement rather than a booking.</p>

<p>If you do it yourself, build the day sheet with travel times written in. That single document is what separates a plan from a list.</p>

<h2>What an Egypt Trip Planner Should Ask You</h2>

<p>Judge anyone you speak to by their questions rather than their brochure.</p>

<p>A serious egypt trip planner asks your dates first, then how long, then what you actually want out of it, then who is travelling and how they handle early mornings and heat. They should ask what you do not want, which is more informative than what you do.</p>

<p>If the first thing you receive is a price and an itinerary you did not describe, that is a catalogue rather than a plan.</p>

<p>Planning a trip to egypt well is mostly a matter of asking the right things early. That is as true when you are doing it yourself as when somebody else is.</p>

<p>Here the owner takes every one of those calls himself, which is the only reason those questions get asked in that order.</p>

<h2>The Mistakes That Cost the Most</h2>

<p>Planning a trip to egypt around a list of sites rather than a shape. That is the root of most of the rest of this list, and it is the easiest of them to avoid.</p>

<p>Booking the international flights before deciding the shape. It fixes your arrival city and your length, and then the trip is designed around an airline rather than a country.</p>

<p>Giving Cairo two nights. The pyramids, Saqqara and the museum do not fit into one day, and the attempt is the most common regret people report.</p>

<p>Choosing the boat last. It is the part of the trip people remember and the part with the least availability.</p>

<p>And leaving the passport check until the month before, which is the one mistake on this list that cannot be fixed with money.</p>

<!-- OWNER: first-hand paragraph fits here, on the questions asked on a first call and what they usually reveal -->

<h2>A Realistic Timeline</h2>

<p>Six months out for high season, three for the shoulder, and six weeks is the point at which choice starts disappearing rather than the point at which it becomes impossible.</p>

<p>Six months: dates, shape, length, boat held. Four months: international flights ticketed, hotels confirmed. Two months: internal flights, guides, the day sheet.</p>

<p>Six weeks: the clinic. One month: visa, insurance already bought, final payments.</p>

<p>Last minute works better here than in most destinations outside December and January, because the infrastructure is large and there is a great deal of it. The thing that runs out first is always the small boats, and it runs out months before anything else does.</p>

<h2>Where to Start This Evening</h2>

<p>Two things, and neither takes long.</p>

<p>Open your passport and read the expiry date. Then write down your earliest and latest possible departure dates and how many nights you can actually be away, including the days you lose to flying.</p>

<p>Those two facts are enough to plan a trip to egypt around, and they are the two that people most often have not settled when they make the first call. Everything else on this page can be decided afterwards.</p>

<p>The <a href="/egypt-travel-guide/cairo-travel-guide">Cairo guide</a> is the best next read if you want to see what three days there actually contains, and our <a href="/egypt-private-tour-packages">private itineraries</a> show the shapes above as they are usually built, which is a faster way to react than starting from a blank page.</p>',
  excerpt = 'Most trips here go wrong in the same place, and it is not the itinerary. The order the decisions have to be made in, and which ones stop being reversible.',
  category = 'Travel Planning',
  tags = ARRAY['Egypt Travel Planning', 'Itineraries', 'Before You Go']::text[],
  focus_keyword = 'planning a trip to egypt',
  meta_title = 'Planning a Trip to Egypt: The Order to Do It In',
  meta_description = 'Planning a trip to egypt in the right order saves the most money and the most regret. Dates, then length, then shape, then the river, then the flights.',
  faqs = '[{"id":"a2d53047-19ac-5cab-abeb-b1e65e3a1451","question":"How long do you need in Egypt?","answer":"10 to 12 days for most people. 8 is the floor and covers Cairo and a short cruise with no slack in it. 12 adds the Red Sea or Abu Simbel without cutting anything. Under 7 days the internal flights and transfers consume so much of the trip that it becomes a series of airports."},{"id":"fd6098d8-ca79-5357-a63d-7e393ac357f8","question":"In what order should you book an Egypt trip?","answer":"Dates, length, shape, boat, flights, admin. All 6 in that sequence, because each one narrows the next. Booking the international flights before deciding the shape is the most expensive mistake, since it fixes your arrival city and your length before the trip has been designed."},{"id":"8d3a114b-6e7f-50b8-90e9-f17d095d40c5","question":"Is it better to book a package or plan Egypt yourself?","answer":"Yourself is possible and it is more work than people expect. There are 3 or 4 internal flights, hotels in 3 cities, a cruise and transfers at both ends of every leg. The 2 hardest parts alone are the boat, because the good ones are not all sold online, and the timing at major sites."},{"id":"1eec1dcf-ba93-5896-a9cd-3b9ec501e820","question":"How far in advance should you book Egypt?","answer":"6 months for December and January, 3 for the shoulder months. 6 weeks is when choice starts thinning rather than when it becomes impossible. The 1 thing that always runs out first is the small boats, so hold the cruise early even if the rest of the trip is still moving."},{"id":"7d8239a4-0912-5e7b-b791-a626a89e50fc","question":"What is the difference between a private and a group trip to Egypt?","answer":"Who controls the clock. A group departure runs to a coach timetable, which means arriving at Giza and Abu Simbel in the busiest 2 or 3 hours of the day. Private means you choose the hour. The difference shows up in what you actually see rather than in the hotel category."},{"id":"c210b9a9-fb62-52ef-a324-0f32887053e2","question":"Should you book international or internal flights first?","answer":"International first, always. That 1 ticket sets your arrival and departure days and therefore everything else. Internal legs between Cairo, Aswan, Luxor and Hurghada are short and frequent, and their schedules move, which is why they belong to whoever is running the trip rather than to you."},{"id":"13a5c290-3dfa-5f62-b061-932a3f8f71f4","question":"What should a good Egypt trip planner ask you?","answer":"Your dates first, then the length, then what you want out of it, then who is travelling and how they cope with early starts and heat. Roughly 5 questions before any itinerary appears. If the first thing you receive is a price and a route you did not describe, that is a catalogue."},{"id":"1e91af2d-42ea-59f5-b6e5-026e5ebca3d4","question":"What is the most common planning mistake in Egypt?","answer":"Giving Cairo only 2 nights. The pyramids, Saqqara and the Egyptian collections do not fit into 1 day, and attempting it is the regret people report most often. The mistake that cannot be fixed with money is leaving the passport expiry check until the month before departure."}]'::jsonb,
  schema_type = 'BlogPosting',
  status = 'published',
  updated_at = now()
-- Both slugs, so a second run finds the row it renamed on the first.
WHERE slug IN ('how-to-plan-a-luxury-egypt-trip', 'planning-a-trip-to-egypt');

-- things-to-know-before-traveling-to-egypt becomes egypt-travel-tips
UPDATE posts SET
  slug = 'egypt-travel-tips',
  title_en = 'Egypt Travel Tips That Change the Day',
  body_en = '<p>Carry small notes for tipping, drink only bottled or filtered water, cover shoulders and knees at religious sites, and treat every quoted price as an opening position. Those four cover most of the difference between a smooth day here and a frustrating one. The rest is detail.</p>

<p>Most egypt travel tips are written by people who spent a week here. These are the things that come up every day, roughly in the order they come up.</p>

<h2>Tipping Is Constant, and It Is Not Optional</h2>

<p>Baksheesh runs through everything, and misreading it is the single most common source of friction for visitors.</p>

<p>It is given for a service rendered: the man who carries your bag, the attendant who keeps an eye on the bathroom, the boatman, the driver, the guide. It is small, it is frequent, and it is normal. Treating it as a scam will make your whole trip feel like one.</p>

<p>Carry a thick wad of the smallest notes you can get and keep them somewhere separate from your real money. Breaking a large note for every small service is the thing that makes tipping annoying, not the tipping itself.</p>

<p>For guides and drivers on a longer trip, one sum at the end is normal and easier for everyone.</p>

<p>Nobody expects a particular amount and nobody is counting. A small note handed over without ceremony is the whole transaction.</p>

<h2>Cash, Cards and Where Each Actually Works</h2>

<p>Cards work in hotels, good restaurants and larger shops. Everywhere else is cash.</p>

<p>Withdraw from a bank ATM rather than a standalone machine in a shop lobby, and take out a decent amount at a time so you are not paying a fee every day. Tell your bank you are travelling or expect the first attempt to be blocked.</p>

<p>Keep a small amount of US dollars as backup. It is not for spending, it is for the situations where nothing else works.</p>

<p><a href="/blog/currency-in-egypt">The currency article</a> covers where to change money and where not to, which is a longer answer than it sounds.</p>

<h2>Water: the One Rule Nobody Should Bend</h2>

<p>Bottled or filtered, including for brushing your teeth, for the whole trip.</p>

<p>This is not about the tap water being dramatic. It is about a different mineral and bacterial profile from the one you are used to, and the outcome of ignoring it is two days you did not plan for.</p>

<p>Check the seal on the bottle. Skip ice in places you have not chosen carefully. Good hotels and the boats filter their own supply and will tell you so if you ask.</p>

<p>Carry a bottle with you at all times in the warm months, and drink from it before you feel thirsty. Dehydration at Giza and in the Valley of the Kings is far more common than anything you eat.</p>

<h2>What to Wear, and Where It Matters</h2>

<p>Egypt is more relaxed than people expect and more conservative than a resort brochure suggests.</p>

<p>At hotels and on the Red Sea, wear whatever you would anywhere. In Cairo, at temples and walking around cities, shoulders and knees covered is comfortable and respectful, and it is also cooler than the alternative once you try it.</p>

<p>Mosques require covered arms and legs for everyone, and covered hair for women. Carry a scarf and it becomes a non issue. Shoes come off at the door.</p>

<p>Closed shoes with grip for every site, without exception. Sand, loose rock and worn stone steps are not sandal territory.</p>

<!-- OWNER: first-hand paragraph fits here, on what guests actually get wrong about dress and what nobody minds -->

<h2>Friday, Prayer Times and the Rhythm of the Week</h2>

<p>Friday is the day off, not Sunday.</p>

<p>Mosques close to visitors around midday prayers on Friday and the traffic pattern across Cairo changes. Museums and monuments stay open. Some government offices and smaller shops close or open late.</p>

<p>The call to prayer sounds five times a day across the whole country and it will wake you the first morning. By the third it is the thing people say they miss afterwards.</p>

<h2>Haggling Without Enjoying It Too Much</h2>

<p>In markets and with taxis, the first price is an opening position and both of you know it.</p>

<p>Decide what the thing is worth to you, offer well below it, settle somewhere in between, and be prepared to walk away cheerfully. Walking away is a normal move rather than an insult, and it frequently ends with a better price called after you.</p>

<p>Fixed price shops exist and are marked. Do not haggle in them, and do not haggle over small amounts with someone whose day it will genuinely affect.</p>

<p>Never accept anything described as a free gift. It is not one.</p>

<h2>Photography, Drones and Where the Line Sits</h2>

<p>Photograph the monuments freely. Some tombs and museums charge a camera ticket and some ban photography outright, and both are enforced.</p>

<p>Ask before photographing people. Most will say yes and some will then ask for a tip, which is fair enough.</p>

<p>Do not photograph military installations, police, bridges, airports or anything that looks official. This is taken seriously in a way that surprises visitors.</p>

<p>Leave the drone at home. Drones are routinely confiscated at Egyptian airports and getting one back is a process rather than a conversation.</p>

<h2>Cairo Egypt Travel Tips: Getting Across the City</h2>

<p>Cairo traffic is the thing nobody prepares you for, and it changes how you plan a day.</p>

<p>Ride hailing apps work well and remove the fare negotiation entirely, which on a hot afternoon is worth the small premium. Street taxis need the price agreed before you get in. The metro is fast, cheap and has carriages reserved for women.</p>

<p>Crossing the road is a genuine skill. Walk at a steady predictable pace and let the traffic flow around you. Stopping suddenly in the middle is the only way to get it wrong.</p>

<p>Allow twice the journey time you think you need between four and eight in the evening.</p>

<h2>Heat, and How to Work Around It</h2>

<p>Between May and September the middle of the day is not usable for sightseeing, and pretending otherwise ruins trips.</p>

<p>Start at opening, stop by noon, rest, and go out again after four. This is how people actually live here and it is not a compromise, it is the correct schedule.</p>

<p>Hat, sunglasses, high factor sun cream, and more water than seems reasonable. There is no shade on the Giza plateau, none in the Valley of the Kings, and very little at Karnak.</p>

<p>The heat in Aswan and Luxor is drier than the heat in Cairo, which makes it both more bearable and more dangerous, because you sweat without ever noticing that you are.</p>

<h2>Food, and What Is Worth Ordering</h2>

<p>Egyptian food is considerably better than its reputation abroad, and almost none of the good version reaches a hotel buffet.</p>

<p>Koshari is the national dish and costs almost nothing: rice, lentils, pasta, fried onions and a tomato sauce that changes from shop to shop. Ful and taameya are breakfast. Molokhia divides visitors sharply and is worth trying once. Fresh bread arrives at every table and is genuinely good.</p>

<p>Ask your guide where they eat rather than where they take people. The two answers are often different, and the first one is better.</p>

<p>Juice stands are everywhere and are excellent, with the usual caution about ice and about fruit washed somewhere you have not chosen.</p>

<h2>A Little Arabic Goes Further Than You Think</h2>

<p>Nobody expects you to speak it, and four words change how you are treated.</p>

<p>Shukran for thank you, min fadlak for please, la shukran for no thank you, and salaam alaikum as a greeting. That is the whole list and it is genuinely enough.</p>

<p>La shukran, said once with a smile and then not repeated or discussed, is the most useful phrase on this page. It is the polite close to a conversation you did not want to start.</p>

<h2>The Small Practical Things</h2>

<p>Carry tissues. Many public toilets do not supply paper, and there is often a small charge and an attendant who should be tipped.</p>

<p>Bring hand sanitiser and use it before eating rather than after.</p>

<p>Get a local SIM or an eSIM at the airport. Data is cheap, and maps plus a ride hailing app solve a large share of the problems on this page.</p>

<p>Download an offline map of Cairo and Luxor before you go. Signal inside the older parts of the city is not reliable, and the alleys of Islamic Cairo are exactly where you will want it.</p>

<p>Bring a small torch or use the one on your phone. Several tombs are lit for atmosphere rather than for reading the wall in front of you.</p>

<h2>Security Checks Are Routine Here</h2>

<p>There are metal detectors at hotel entrances, museums and most monuments, and armed police at the major sites.</p>

<p>This registers as alarming on the first day and stops registering by the third. It is routine rather than a response to anything happening that week, and the officers are generally friendly and often curious about where you are from.</p>

<p>Keep your passport or a copy of it on you. Convoys on certain desert routes are a permit matter rather than a danger signal, and whoever is running your trip deals with them.</p>

<h2>Ramadan, If Your Dates Fall in It</h2>

<p>The dates move each year, so check them against your trip rather than assuming.</p>

<p>Monuments and hotels operate normally. Restaurants outside hotels may close during daylight, hours shift, and the whole country slows in the afternoon and comes alive after sunset.</p>

<p>It is a genuinely good time to visit if you are curious and a frustrating one if you want everything on a normal schedule. Eat and drink discreetly in public during fasting hours.</p>

<!-- OWNER: first-hand paragraph fits here, on what a Ramadan trip is actually like for guests -->

<h2>What Turns Out Not to Matter</h2>

<p>Most of the things people worry about before arriving.</p>

<p>Language is not a barrier in the tourism industry. Getting lost is hard when you have a driver. The food is excellent and the hygiene at the level of hotel and boat used on these trips is not a concern. Nobody minds that you are a foreigner.</p>

<p>Solo travellers and women travelling together do this constantly and describe the attention as tiring rather than threatening. That is worth knowing in advance rather than discovering.</p>

<p>The useful travel tips for egypt are all small and practical, and the large anxieties mostly evaporate on the second day.</p>

<h2>Where to Put This Next</h2>

<p>These are the things that matter once you have arrived. The things that matter before you leave are a different list.</p>

<p><a href="/blog/what-to-pack-for-egypt">The packing guide</a> covers what to bring, including the scarf and the small notes mentioned above, and <a href="/egypt-travel-guide/cairo-travel-guide">the Cairo guide</a> covers the city itself in the detail this page does not.</p>

<p>Guests on our <a href="/best-luxury-egypt-tours">longer Egypt tours</a> have a guide who handles most of what is on this page before it becomes a question, which is the real argument for one. The rest of these egypt travel tips are worth knowing anyway, because the good days are the ones where you are not asking anybody anything.</p>',
  excerpt = 'Tipping, cash, water, dress and the selling. The handful of things that decide whether a day here runs smoothly, and the ones that turn out not to matter at all.',
  category = 'Travel Tips',
  tags = ARRAY['Travel Tips', 'Before You Go', 'Cairo']::text[],
  focus_keyword = 'egypt travel tips',
  meta_title = 'Egypt Travel Tips: What Actually Matters There',
  meta_description = 'The egypt travel tips that come up every single day: tipping, cash, water, what to wear, and how to handle the selling. Written from the ground, not a listicle.',
  faqs = '[{"id":"f6d4ea55-c735-53ad-9de6-f77e168f4b2f","question":"How much should you tip in Egypt?","answer":"Small amounts, constantly. Baksheesh is given for a service rendered: carrying a bag, watching a bathroom, handling a boat. Carry a thick wad of the 2 or 3 smallest note denominations and keep them apart from your real money. For a guide or driver on a longer trip, 1 sum at the end is normal."},{"id":"b6dd8063-f280-5a7f-9e14-994f36d9d43d","question":"Can you drink the tap water in Egypt?","answer":"No, and do not bend the rule for teeth brushing either. The issue is a different mineral and bacterial profile from the one you are used to, and the cost of ignoring it is about 2 days you did not plan for. Check bottle seals and skip ice outside places you have chosen carefully."},{"id":"ec382eea-ebed-5bf0-8e44-038c78743ead","question":"What should women wear in Egypt?","answer":"Shoulders and knees covered in cities and at temples, anything at all at a Red Sea resort or a hotel pool. Mosques ask for covered arms, legs and hair, so 1 scarf in the day bag settles it. Closed shoes with grip at every site, because sand and worn stone are not sandal territory."},{"id":"c7dd4fee-d9c8-58cc-bda7-6e2943bef96a","question":"Is it better to use cash or cards in Egypt?","answer":"Both, in different places. Cards work in hotels, good restaurants and larger shops, and everything else is cash. Withdraw from a bank ATM rather than a lobby machine, take out a decent amount at a time to avoid paying a fee 5 times a week, and tell your bank before you travel."},{"id":"e7265a97-1cad-5193-b902-2155f274dc64","question":"How do you handle haggling in Egyptian markets?","answer":"Decide what it is worth to you, open well below that, and settle in between. Walking away cheerfully is a normal move rather than an insult and often produces a better price 10 seconds later. Fixed price shops are marked and should not be haggled in, and no gift offered to you is free."},{"id":"9f8efc0f-fa21-57fc-8c18-9ed8d408c975","question":"Which is more useful in Cairo, taxis or ride hailing apps?","answer":"Apps, in almost every case. They remove the fare negotiation entirely, which on a 35 degree afternoon is worth the small premium. Street taxis need the price agreed before you get in. The metro is fast and cheap and has carriages reserved for women, and it beats both in rush hour."},{"id":"a3d6a530-a1a9-596d-a0bf-e40efd062fb6","question":"What time of day should you sightsee in Egypt?","answer":"Start at opening and stop by noon, then go out again after 4pm. Between May and September the middle of the day is not usable, and there is no shade at Giza, in the Valley of the Kings or across most of Karnak. This is how people live here rather than a compromise."},{"id":"f0af2f67-eb3b-52a3-a0b2-8067a04fd145","question":"Is it worth visiting Egypt during Ramadan?","answer":"Yes if you are curious, no if you want everything on a normal schedule. Monuments and hotels run as usual, but restaurants outside hotels may close during daylight and the country slows for several hours in the afternoon. The dates move about 11 days earlier each year, so check them against your own rather than assuming."}]'::jsonb,
  schema_type = 'BlogPosting',
  status = 'published',
  updated_at = now()
-- Both slugs, so a second run finds the row it renamed on the first.
WHERE slug IN ('things-to-know-before-traveling-to-egypt', 'egypt-travel-tips');

-- egypt-packing-list becomes what-to-pack-for-egypt
UPDATE posts SET
  slug = 'what-to-pack-for-egypt',
  title_en = 'What to Pack for Egypt, Month by Month',
  body_en = '<p>Closed shoes with grip, layers for cold mornings and hot afternoons, a scarf that covers shoulders and hair, high factor sun cream, and a thick stack of small notes for tipping. Everything else is replaceable in Cairo. Those five are the ones people wish they had brought.</p>

<p>The honest version of what to pack for egypt is shorter than most lists suggest, because the country has shops and because the winter here is not the tropics.</p>

<p>The one thing that catches almost everybody is the temperature swing. A December morning at Giza and a December afternoon in Aswan are two different climates on the same day.</p>

<h2>The Bag, by Season</h2>

<table>
<thead>
<tr><th>When</th><th>Days</th><th>Early mornings and evenings</th><th>What the bag needs</th></tr>
</thead>
<tbody>
<tr><td>December to February</td><td>Warm and pleasant</td><td>Genuinely cold, especially in Cairo</td><td>Layers, a fleece or a proper jacket, long trousers</td></tr>
<tr><td>March and November</td><td>Warm to hot</td><td>Mild</td><td>Layers, one light jacket, more short sleeves</td></tr>
<tr><td>April and October</td><td>Hot</td><td>Warm</td><td>Light everything, one layer for the river at night</td></tr>
<tr><td>May to September</td><td>Very hot</td><td>Warm</td><td>Loose, light, covering, and twice the sun protection</td></tr>
</tbody>
</table>

<p>The column people ignore is the third one. Sunrise at a temple in January is cold enough to be uncomfortable in a shirt, and the balloon flight over Luxor takes off before dawn.</p>

<h2>Clothes, and the One Rule Worth Following</h2>

<p>Loose, light, and covering. All three at once, which sounds contradictory and is not.</p>

<p>Linen and cotton in light colours, long sleeves and long trousers or skirts. This is cooler in direct sun than bare arms, it is respectful in cities and at religious sites, and it means you are never the person being handed a shawl at a mosque door.</p>

<p>Pack one outfit you would be comfortable wearing to a good restaurant. Dinner on a dahabiya or in a Cairo hotel is not formal, and it is not the beach either.</p>

<p>Pale colours over dark ones, for the heat and for the dust. Everything here picks up a fine sand that shows more on black than on stone colours, and it brushes off rather than washing out.</p>

<p>Swimwear for the hotel pool and the Red Sea, worn there and not elsewhere.</p>

<h2>Shoes, Which Matter More Than Anything Else</h2>

<p>One pair of closed walking shoes with real grip, broken in before you fly.</p>

<p>The ground at Giza is sand and loose rock. The Valley of the Kings involves ramps and steps. Karnak is uneven stone and Islamic Cairo is uneven everything. Sandals are the single most common packing mistake on this trip.</p>

<p>Then one pair of sandals or slip ons for the boat, the hotel and the evening, and nothing else. Two pairs is enough and three is luggage you are carrying for no reason.</p>

<p>Socks, for the same reason as the shoes. Sandals plus a temple floor plus dust equals feet you will want to wash before dinner.</p>

<h2>What to Pack for Egypt in December</h2>

<p>The warmest clothes of any month on this page, which surprises people who booked expecting desert heat.</p>

<p>Days are comfortable and often lovely. Mornings and evenings in Cairo are cold, genuinely cold, and the wind on the Nile after dark makes it colder. Bring a real jacket rather than a token one, plus a jumper or fleece for under it.</p>

<p>December is also the busiest month, so nothing here saves you from queues. It only saves you from being cold in them.</p>

<h2>What to Pack for Egypt in January</h2>

<p>The same as December, and if anything slightly more of it.</p>

<p>January is the coldest month here. The daytime is still pleasant for sightseeing and that is exactly the trap: people pack for the day they were promised and then stand at a temple at seven in the morning wishing they had not.</p>

<p>A hat that keeps heat in as well as sun off is worth the space. So are socks, which sounds obvious until you have packed only sandals.</p>

<h2>What to Pack for Egypt in February</h2>

<p>Still a layered month, with the balance starting to shift.</p>

<p>Mornings remain cold and afternoons warm up more reliably than in January. The fleece still earns its place and the heavy jacket starts to feel optional, particularly if your trip is weighted towards Luxor and Aswan rather than Cairo.</p>

<p>February is quieter than the months either side of it, which is the real argument for going then.</p>

<!-- OWNER: first-hand paragraph fits here, on what guests actually end up borrowing or buying once they arrive -->

<h2>What to Pack for Egypt in March</h2>

<p>The easiest month to pack for, and one of the best to travel in.</p>

<p>Warm days, mild evenings, and one light layer covers the difference. Short sleeves become usable during the day and the jacket can stay at home in favour of something thinner.</p>

<p>Watch for the khamaseen, the dusty wind that can blow in spring. It is not dangerous and it is unpleasant if you wear contact lenses, so bring glasses as a backup and something to cover your face.</p>

<h2>If You Are Going in Summer Anyway</h2>

<p>Sometimes the dates are not negotiable, and the packing changes rather than the principle.</p>

<p>Loose long sleeves in the lightest fabric you own, a wide brimmed hat rather than a cap, sunglasses that actually block properly, and the highest factor sun cream you can find. A cooling cloth or a small towel you can wet is worth more than it sounds.</p>

<p>Double the water you would normally carry and add electrolyte sachets. The mistake in summer is never what you wore, it is what you did not drink.</p>

<h2>The Boat and the Desert</h2>

<p>Cabins are smaller than hotel rooms, so a soft bag beats a hard case if you have the choice.</p>

<p>For the river: one warm layer for the deck after dark in any month, and a power bank, because sockets on a sailing boat are fewer and the generator may run to a schedule.</p>

<p>For the Western Desert: a head torch, a warm layer that would seem absurd in Cairo, and a scarf for the dust. Desert nights are cold in a way that catches out everyone who has only seen the daytime photographs.</p>

<h2>The Small Bag Nobody Regrets</h2>

<p>Rehydration sachets, whatever your doctor suggests for an upset stomach, plasters, hand sanitiser and tissues.</p>

<p>Tissues deserve their own line. Many public toilets do not supply paper and there is often an attendant expecting a small tip.</p>

<p>Prescription medicine travels in its original labelled packaging with a copy of the prescription. That is a customs matter and it is not the place to improvise.</p>

<h2>The Day Bag</h2>

<p>Separate from the suitcase, and it is the bag that decides whether a morning is comfortable.</p>

<p>Water, sun cream, the scarf, tissues, hand sanitiser, small notes, sunglasses, a power bank and a photocopy of your passport. That is the whole list, and it fits into something small.</p>

<p>A small backpack beats a shoulder bag on a long morning, and a bag that closes properly beats one that does not in a crowd.</p>

<p>Leave the real passport in the hotel safe unless you are flying that day or a guide has asked for it. A copy covers every ordinary situation, and losing a copy costs nothing at all.</p>

<h2>What to Leave at Home</h2>

<p>The drone, first and above everything. Drones are routinely confiscated at Egyptian airports and recovering one is a process rather than a conversation.</p>

<p>Heavy hair appliances, unless the label says 100 to 240 volts. The hotels used on this sort of trip supply decent hair dryers and a single voltage one from the United States will not survive the socket.</p>

<p>Most of the clothes you packed. Laundry is fast and cheap here, hotels and boats both do it, and a week''s worth covers a fortnight comfortably.</p>

<!-- OWNER: first-hand paragraph fits here, on the item guests most often say afterwards that they should have brought -->

<h2>Before You Close the Case</h2>

<p>Three checks, and none of them is clothing.</p>

<p>Passport expiry at least six months beyond your arrival date. Small notes for tipping, obtained before you need them rather than by breaking a large one at every stop. And the adapter, because the sockets here take a round two pin plug.</p>

<p><a href="/blog/egypt-plug-type">The plug article</a> covers which adapter and why the voltage matters more than the shape, and <a href="/blog/egypt-travel-tips">the practical notes</a> cover the tipping, the water and the rest of the daily rhythm.</p>

<p>The <a href="/egypt-travel-guide/attractions-in-luxor">Luxor guide</a> shows the ground you will actually be walking on, which is the best argument for the shoes. Guests on our <a href="/best-luxury-egypt-tours">longer Egypt tours</a> get a briefing tuned to the month they are travelling in, and it is mostly this page with the irrelevant months removed.</p>',
  excerpt = 'Shorter than most lists, because Cairo has shops. The five things people wish they had brought, and the month by month version for a winter trip.',
  category = 'Travel Tips',
  tags = ARRAY['Packing', 'Before You Go', 'Egypt Travel Planning']::text[],
  focus_keyword = 'what to pack for egypt',
  meta_title = 'What to Pack for Egypt: The List That Matters',
  meta_description = 'A short answer on what to pack for egypt: grip shoes, layers, a scarf, sun cream, small notes. Plus the month by month list, because winter mornings are cold.',
  faqs = '[{"id":"93b53682-8bd8-56b7-8d5c-99eb0d8fb074","question":"What should you wear in Egypt as a tourist?","answer":"Loose, light and covering, all 3 at once. Linen or cotton in pale colours, long sleeves and long trousers or skirts. That is cooler in direct sun than bare arms, it works at every religious site, and it means you are never the 1 person being handed a shawl at a mosque door."},{"id":"4633d828-bddd-5006-be2f-3be34fb2d7d9","question":"Is Egypt cold in December and January?","answer":"Mornings and evenings are genuinely cold, particularly in Cairo, while the days stay pleasant. January is the coldest of the 12 months. People pack for the daytime they were promised and then stand at a temple at 7am regretting it, so bring a real jacket and a layer for under it."},{"id":"dec38bb2-761c-5892-b925-00f3d9099e7f","question":"What shoes should you take to Egypt?","answer":"1 pair of closed walking shoes with real grip, broken in before you fly, plus 1 pair of sandals for the boat and the evening. Giza is sand and loose rock, the Valley of the Kings has ramps and steps, and Karnak is uneven stone. Sandals are the most common packing mistake here."},{"id":"36e48fc5-e468-59c8-ab37-98dbc8a88a53","question":"Do you need to cover your hair in Egypt?","answer":"Only inside mosques, where women cover hair, arms and legs and everyone removes their shoes. Nowhere else requires it. 1 scarf in the day bag solves the whole question and doubles as sun cover, which is why it appears near the top of almost every list written by people who live here."},{"id":"5e0ed89a-28c1-5e4e-b9a7-004d2a164988","question":"Is it better to pack a hard case or a soft bag for Egypt?","answer":"A soft bag, if your trip includes the river. Cruise cabins, and dahabiya cabins in particular, are smaller than hotel rooms, and a soft bag stows in the 1 gap where a hard case will not. For a Cairo and Red Sea trip with no boat, either works and the difference stops mattering."},{"id":"024be7a7-dd62-551a-9a0f-90b5e67e69f6","question":"What is not worth bringing to Egypt, and what to pack instead?","answer":"A drone, above everything else: they are routinely confiscated at airports and recovery is a process rather than a conversation. Also leave single voltage hair appliances, which will not survive a 220 volt socket, and about half the clothes you packed, since laundry is fast and cheap."},{"id":"c634c62d-9098-5e29-b1a1-40d62bcfa816","question":"What do you need to pack for a Nile cruise specifically?","answer":"1 warm layer for the deck after dark, in any month. Then a power bank, because cabin sockets are fewer than in a hotel and a sailing boat may run its generator to a schedule, and swimwear if the boat has a pool. Evenings are smart casual, so 1 decent outfit covers the week."},{"id":"973d108b-3537-5f85-87c7-3e5ba57959d6","question":"What is the khamaseen and should it change your packing?","answer":"A dusty spring wind that can blow through Egypt for a few days at a time, mostly between March and May. It is not dangerous and it is unpleasant in contact lenses, so pack glasses as a backup and 1 scarf you can pull across your face. Otherwise it changes nothing."}]'::jsonb,
  schema_type = 'BlogPosting',
  status = 'published',
  updated_at = now()
-- Both slugs, so a second run finds the row it renamed on the first.
WHERE slug IN ('egypt-packing-list', 'what-to-pack-for-egypt');

-- private-egypt-tour becomes private-tours-in-cairo-egypt
UPDATE posts SET
  slug = 'private-tours-in-cairo-egypt',
  title_en = 'Private Tours in Cairo Egypt: Three Days Planned',
  body_en = '<p>Three days, not two. One for the pyramid fields, one for the museums, one for Islamic and Coptic Cairo. The word private should cover the car, the guide, the group and the arrival time, and most quotes only cover the first two.</p>

<p>That is the short version of what private tours in cairo egypt should mean. The rest of this page is the detail that separates one quote from another.</p>

<h2>What Private Covers, and What It Usually Does Not</h2>

<p>Four separate things hide behind the word.</p>

<p>The vehicle, which almost always is private and is the definition most operators are using. The guide, which is a separate arrangement and frequently shared between parties. The group, meaning whether strangers are with you. And the hour you arrive, which nobody advertises because it is the hardest to deliver.</p>

<p>Ask which of the four you are buying. A quote that is cheaper than the others is usually cheaper on the second and fourth.</p>

<p>Private tours in cairo egypt are quoted across a very wide range, and that range is mostly explained by those four lines rather than by anything else.</p>

<h2>Day One: Giza, Saqqara and Dahshur</h2>

<p>The pyramid fields in one day, in that order, starting at opening.</p>

<p>Giza first while the light is low and the coaches have not arrived. Then Saqqara, where the step pyramid and the tombs with their carved walls are, and where you can usually hear yourself think. Then Dahshur, which is almost empty and has the two pyramids that explain how the shape was arrived at.</p>

<p>Doing all three on one day is long and it is the right call. Seeing Giza alone leaves you with the famous thing and no context for it.</p>

<p>Bring the water and the closed shoes for this one. It is the longest of the three days and almost all of it is outdoors on uneven ground.</p>

<p><a href="/blog/private-pyramid-tours-egypt">The pyramids article</a> goes through the Giza morning in more detail, including which pyramid is worth entering.</p>

<h2>Day Two: The Museums, and Which One</h2>

<p>There are two major collections and choosing between them is a real decision rather than a formality.</p>

<p>Ask which objects are in which building on your dates. Material has been moving between the collections, the position changes, and a guide who was there last week is a better source than anything written down, including this.</p>

<p>Whichever you visit, give it a proper half day rather than ninety minutes. A museum on this scale rewards a guide who edits it down to forty things and tells you why those forty.</p>

<p>Afternoon is the time for it. The morning belongs outdoors, and a museum is the right place to be when the sun is at its worst.</p>

<p>Book any timed entry in advance where one exists. The middle of the day in a major museum is the middle of the day everywhere else too, and it shows.</p>

<h2>Day Three: Islamic and Coptic Cairo</h2>

<p>The day that is cut first and the day people most often say they wish they had kept.</p>

<p>Islamic Cairo is a living medieval city: mosques, madrasas, the Khan el Khalili, minarets you can climb, and streets that have been doing the same work for eight hundred years. Coptic Cairo is quieter and older in feel, a compact quarter of churches and a synagogue within a few minutes of each other.</p>

<p>This is the day a guide earns their fee most obviously, because almost nothing here is labelled and the interesting parts are behind doors you would walk past.</p>

<p>Finish with tea somewhere ordinary rather than a rooftop with a view. The view is not the point of this day.</p>

<!-- OWNER: first-hand paragraph fits here, on which of the three days guests react to most strongly -->

<h2>What Private Tours in Cairo Egypt Should Include</h2>

<p>Entrance fees to everything on the day''s list, a licensed Egyptologist guide, a car and driver for the whole day, and water.</p>

<p>Usually extra and reasonably so: lunch, the inside of a pyramid, camel or horse rides, and any museum photography ticket. None of those is a problem as an extra and all of them are a problem as a surprise.</p>

<p>Never included: tips. Carry small notes and budget for them separately.</p>

<h2>Where You Stay Changes the Day</h2>

<p>Two broad choices, and they suit different trips.</p>

<p>A hotel on the Giza side puts the pyramids outside the window and cuts the first morning''s drive to almost nothing, which on a day that starts at opening is worth a great deal. It also puts you a long way from the rest of the city in the evening.</p>

<p>A hotel in the centre, along the river or in Zamalek, puts dinner, the museums and the older quarters within reach, and adds forty minutes to the pyramid morning. Neither is wrong. Decide which of the two mornings matters more to you.</p>

<h2>If You Have a Fourth Day</h2>

<p>Three things compete for it, and they suit different people.</p>

<p>Alexandria is a long day out on the coast with a different history and a Mediterranean feel that surprises people. The Citadel and the older mosques above the city are a half day with the best view in Cairo attached. A felucca at sunset is an hour rather than a day, and it is the thing couples describe afterwards.</p>

<p>A fourth day is also a perfectly good thing to leave empty. Cairo is tiring in a way that three scheduled days makes very clear.</p>

<h2>The VIP Cairo Tour Question</h2>

<p>A vip cairo tour is a marketing phrase rather than a category, and it is worth asking what it actually buys.</p>

<p>Sometimes it means a better car and a bottle of water with a label on it. Sometimes it means a genuinely different day: access before opening, a skip of the main entrance queue, a guide who is the best rather than the next available.</p>

<p>The test is simple. Ask what time you arrive at Giza and what happens that would not happen otherwise. If the answer is about the vehicle, you are paying for a vehicle.</p>

<h2>The Guide Is What You Are Buying</h2>

<p>Everything else is logistics that any competent operator can arrange.</p>

<p>A licensed Egyptologist holds a degree in the subject and a permit from the Ministry of Tourism and Antiquities. That is checkable and worth checking. A good one turns a wall of carvings into a story and reads whether you want more detail or less.</p>

<p>On our longer journeys one guide travels with you from the first day to the last, which by day three means they already know what you find interesting.</p>

<h2>Traffic Decides the Shape of the Day</h2>

<p>Cairo traffic is not a nuisance to be routed around. It is a constraint the day has to be built on.</p>

<p>Giza to Saqqara to Dahshur works because the three sit roughly in a line away from the city. Crossing the river at the wrong hour can cost an hour on its own. Anything scheduled between four and eight in the evening needs twice the time it looks like it needs.</p>

<p>This is the practical argument for a private car over a taxi and an app: the driver knows which bridge, and waits while you are inside.</p>

<h2>What to Ask Before You Book</h2>

<p>Five questions, and the answers sort the quotes quickly.</p>

<p>What time do we reach the first site. Is the guide ours alone for the whole day. Which entrance fees are inside the price.</p>

<p>Is the vehicle ours, and does it wait while we are inside. And who is the guide, by name and by qualification.</p>

<p>A private cairo tour that answers all five plainly is a different product from one that answers two of them and changes the subject.</p>

<!-- OWNER: first-hand paragraph fits here, on what the early access at Giza and Saqqara has actually looked like for guests -->

<h2>Where Cairo Sits in a Longer Trip</h2>

<p>Three days here and then the river, which is how almost every good itinerary through Egypt is shaped.</p>

<p>Cairo first, because the flights land there and because the pyramid days are heavy ones better done while you still have the energy. Then Aswan and the sailing north to Luxor, by which point sitting on a deck is exactly what you want.</p>

<p><a href="/blog/planning-a-trip-to-egypt">The planning guide</a> covers the order the whole trip has to be decided in, and <a href="/egypt-travel-guide/cairo-travel-guide">the Cairo guide</a> covers the city itself beyond the three days above.</p>

<p>These <a href="/egypt-private-tour-packages">private itineraries</a> show the usual shapes with Cairo already built in at three days rather than two, which is the single change most worth making to a trip here.</p>',
  excerpt = 'Cairo needs three days and most itineraries give it two. What each day should hold, what the word private covers, and the questions that separate the quotes.',
  category = 'Travel Planning',
  tags = ARRAY['Cairo', 'Private Touring', 'Giza Pyramids']::text[],
  focus_keyword = 'private tours in cairo egypt',
  meta_title = 'Private Tours in Cairo Egypt: What to Book',
  meta_description = 'What private tours in cairo egypt should cover across three days, what the word private means on each line of the quote, and the hour that decides the morning.',
  faqs = '[{"id":"618001db-abfd-5d1d-98a6-dffc6d8c39c4","question":"How many days do you need in Cairo?","answer":"3 full days. 1 for Giza, Saqqara and Dahshur, 1 for the museums, and 1 for Islamic and Coptic Cairo. 2 days forces the pyramids and a major museum into the same exhausting day, and it is the most common regret people report about an Egypt itinerary afterwards."},{"id":"ea0b5828-6db1-53a9-83fc-7dc0cdee0889","question":"What does private mean on a Cairo tour?","answer":"Up to 4 different things: a private vehicle, a private guide, a group containing only your own party, and a privately arranged arrival time. A tour can be private in 1 of those and shared in the others, so the word alone tells you very little. Ask which of the 4 applies."},{"id":"25e7d9b2-9c5d-5878-b94f-45583829e67d","question":"Is a VIP Cairo tour worth the extra money?","answer":"Only if it changes the day rather than the car. Ask 1 question: what time do we reach Giza, and what happens that would not happen otherwise. If the answer is about the vehicle or the bottled water, you are paying for a vehicle. If it is about access before opening, that is real."},{"id":"883dd28d-5e5b-5cc7-9fd9-1dced03d3d8e","question":"Which Cairo museum should you visit?","answer":"Ask which objects are in which building on your dates, because material has been moving between the 2 major collections and the position changes. Then give whichever you choose a proper half day rather than 90 minutes. A guide who edits a collection this size down to 40 objects is the difference."},{"id":"f6db499e-6b81-513d-92db-2e1d9228e3bf","question":"What is the difference between a private Cairo tour and a group one?","answer":"Departure time, mostly. A group leaves when the coach leaves, which is after breakfast and therefore into the busiest 3 hours at Giza. Private means you choose the hour and the driver waits while you are inside. The guide and the vehicle matter too, but the hour changes what you see."},{"id":"be13b483-42a2-5f83-b5cb-4fe687a0cf86","question":"Should you visit Islamic Cairo with a guide?","answer":"Yes, more than anywhere else in the city. Almost nothing in the quarter is labelled and the best of it sits behind doors you would walk past, so an unguided visit becomes 1 long walk through a busy market. It is the day a guide most obviously earns the fee."},{"id":"ab646e8c-be96-5d43-8cd5-3f4378b2fc5b","question":"How does Cairo traffic affect a tour day?","answer":"It sets the shape of it. Giza, Saqqara and Dahshur work as 1 day because they sit roughly in a line away from the city, while crossing the river at the wrong hour can cost an hour by itself. Anything scheduled between 4pm and 8pm needs twice the time it appears to need."},{"id":"fe6878cf-f538-5ba4-abee-5616712e4d10","question":"What should be included in a private Cairo tour price?","answer":"4 things as a baseline: entrance fees for everything on that day''s list, a licensed Egyptologist guide, a car and driver for the whole day, and water. Lunch, pyramid interiors, camel rides and museum photography tickets are usually extra, which is fine when it is said in advance."}]'::jsonb,
  schema_type = 'BlogPosting',
  status = 'published',
  updated_at = now()
-- Both slugs, so a second run finds the row it renamed on the first.
WHERE slug IN ('private-egypt-tour', 'private-tours-in-cairo-egypt');

-- bespoke-egypt-travel becomes tailor-made-egypt-tours
UPDATE posts SET
  slug = 'tailor-made-egypt-tours',
  title_en = 'Tailor-Made Egypt Tours: What You Actually Choose',
  body_en = '<p>Five things change: the dates, the length, the pace, where you sleep, and which doors open at which hour. Everything else is the same country everybody else sees. That is the honest scope, and it is larger than it sounds because the fifth item is what most people are really buying.</p>

<p>Tailor-made egypt tours are sold as though the itinerary were infinitely variable. It is not. The Nile runs where it runs and Abu Simbel is where it is, and any route that ignores that wastes your days in transit.</p>

<p>What is genuinely variable is how the fixed geography is arranged around you.</p>

<h2>What Tailor-Made Egypt Tours Actually Change</h2>

<p>Start with the dates, because a fixed departure is the constraint that makes everything else worse.</p>

<p>Then the length, which is where most of the real design happens. Then the pace, meaning how many sites a day and whether there is a morning with nothing in it. Then the accommodation, which is a spectrum rather than a category. Then the access: before opening, after closing, and which guide.</p>

<p>Those five, arranged around your party rather than around a coach schedule, are the whole product.</p>

<h2>What Does Not Change, and Should Not</h2>

<p>The route, mostly, and anyone promising otherwise is selling you transit time as though it were sightseeing.</p>

<p>Cairo for the pyramid fields and the collections. Aswan to Luxor on the river, because the temples sit on the river. Abu Simbel as a flight or a very long drive from Aswan. That sequence is not a lack of imagination, it is the geography.</p>

<p>The good version of a custom trip does not reinvent that. It decides how many nights each part gets and what happens inside them.</p>

<h2>The Five Things That Drive Egypt Tour Cost</h2>

<p>Length, season, the boat, the access, and the size of your party. In roughly that order.</p>

<p>Ask any operator to break a quote down along those five lines. A single total tells you nothing and cannot be compared with another single total, because the two quotes are almost certainly making different assumptions on at least three of them.</p>

<p>Those five are what any quote for tailor-made egypt tours is actually made of, whoever is writing it and whatever it is called on the invoice.</p>

<p>What follows is what each one does.</p>

<h2>Length</h2>

<p>The most straightforward of the five and the one people underestimate.</p>

<p>Every extra night adds a room, a day of the guide and the driver, and usually a meal plan. Internal flights are the step changes: adding Abu Simbel or the Red Sea adds a flight rather than a drive, and that is a jump rather than a slope.</p>

<p>Our private itineraries run seven to fourteen days and start at 4,000 USD per person, which is the floor rather than the typical figure, and the paragraphs below are what moves a trip above it.</p>

<h2>Season</h2>

<p>December and January are the most expensive weeks of the year here, and the difference is not small.</p>

<p>Late October, November, February and March are excellent months at a lower price. May and September cost noticeably less again and demand early starts. July and August are the cheapest and the hardest.</p>

<p>Moving your dates by three weeks is frequently the single largest saving available, and it costs you nothing in what you see.</p>

<h2>The Boat Is the Biggest Line</h2>

<p>The river is four or five nights of the trip and often the largest single item in the quote.</p>

<p>A cabin on a large cruiser, a cabin on a boutique ship, a cabin on a shared dahabiya and a dahabiya chartered privately are four quite different numbers for the same stretch of water. The sightseeing is identical. What differs is how many people are on board with you and where it ties up at night.</p>

<p><a href="/blog/best-luxury-nile-cruise-egypt">The cruise guide</a> compares the categories properly, and it is the decision worth spending the most time on.</p>

<h2>Access, and Why It Is Not a Gimmick</h2>

<p>Arranging a site before it opens or after it closes is the line people query most and understand least.</p>

<p>It is not an entrance ticket. It is a permission, it is not available everywhere or every day, and it carries a real cost because somebody is opening a monument outside its hours.</p>

<p>Whether it is worth it depends entirely on what you want from the trip. For a first visit with a camera and a specific idea of the photograph, it is the difference between the trip you imagined and the trip you got. For a returning traveller who has already had the plateau to themselves, it matters less.</p>

<!-- OWNER: first-hand paragraph fits here, on which access arrangements guests ask for and which they actually value afterwards -->

<h2>Party Size</h2>

<p>The one that works in your favour and is rarely mentioned.</p>

<p>A private guide, a private car and a private boat cost roughly the same whether two people or six are using them. Per person, a family or two couples travelling together pay considerably less for exactly the same arrangement.</p>

<p>Two travelling alone carry the whole of it, which is why a solo or couple quote looks high against a group departure advertised per seat. They are not the same product and the comparison misleads in both directions.</p>

<h2>Where You Sleep Is a Spectrum</h2>

<p>Accommodation is the line most often treated as one choice, and it is really a series of them.</p>

<p>A historic hotel with the pyramids in the window, a modern international property on the river, and a small place in a quieter quarter are three different trips at broadly similar prices. The room is rarely the variable that matters. The location is, because it decides how long you sit in a car each morning.</p>

<p>Ask where each proposed hotel actually sits rather than how many stars it carries. A property rated one level lower and fifteen minutes closer to where your day starts is usually the better trade.</p>

<h2>The Parts People Regret Cutting</h2>

<p>Three, and it is the same three every time.</p>

<p>The third night in Cairo, which is the day of Islamic and Coptic Cairo. The fifth night on the river, which is the one with nothing scheduled in it. And the step up from a shared boat to a private one, which is the largest number on the page and the one people most often wish they had paid.</p>

<p>Cut the Red Sea instead, if something has to go. It is the most replaceable part of the trip and the only part you can get a version of somewhere closer to home.</p>

<h2>Egypt Tailor Made Tours Against a Fixed Itinerary</h2>

<p>A published private route is cheaper to run and suits more people than the industry admits.</p>

<p>If your dates are flexible, your party is two adults and you have no strong preferences, a fixed private itinerary gives you the private car, the private guide and most of the benefit. The gap between that and a custom route is smaller than the marketing suggests.</p>

<p>Custom earns its cost when something is genuinely fixed or genuinely specific: a wedding anniversary in a particular week, a child who cannot do three temples before lunch, a returning visitor who has seen Giza and wants Dendera and Abydos instead, or a mobility requirement that has to be designed around rather than apologised for.</p>

<p>If none of those applies, say so and ask for the published route. A good operator will tell you the same thing.</p>

<h2>How the Process Actually Runs</h2>

<p>A conversation, a draft, two or three revisions, then a deposit.</p>

<p>Tailor-made egypt tours live or die on that first conversation. Everything after it is drafting.</p>

<p>The first call is the one that matters and it should be mostly questions. Here the owner takes that call himself and plans every itinerary from it, which is the reason the questions come before the price rather than after.</p>

<p>Expect the first draft to be wrong in one or two places. That is what a draft is for. The version that arrives perfect on the first attempt is usually a template with your dates typed into it.</p>

<h2>What to Send in the First Email</h2>

<p>Four things, and they are enough to produce a real draft rather than a brochure.</p>

<p>Your earliest and latest possible dates and how many nights you can be away. Who is travelling, including ages and anything that affects walking, heat or early mornings. What you most want to see, and more usefully what you do not care about. And a range you are working within, because withholding it produces a quote nobody can act on.</p>

<p>That last one is the item people leave out. It costs a round of revisions every time.</p>

<!-- OWNER: first-hand paragraph fits here, on what a first planning call usually reveals that the email did not -->

<h2>Questions That Sort One Quote From Another</h2>

<p>Ask all of these in writing and compare the answers rather than the totals.</p>

<p>Which boat, and is it private or are we buying cabins on it. Is the guide the same person throughout. Which entrance fees are included.</p>

<p>Are the internal flights inside the price. And what is explicitly excluded.</p>

<p>Then one more that is worth more than the rest combined: who plans this, and will I speak to them.</p>

<h2>Where to Start</h2>

<p>With the dates and the number of nights, because every one of the five cost drivers above hangs off those two facts.</p>

<p>Then read the two pages that make the biggest difference to the shape of the trip. <a href="/blog/luxury-egypt-tours">The overview of what a private journey here involves</a> covers what the days actually contain, and <a href="/egypt-travel-guide/attractions-in-luxor">the Luxor guide</a> covers the part of the country where the extra nights usually go.</p>

<p>If a published route turns out to fit, take it. Our <a href="/best-luxury-egypt-tours">longer Egypt journeys</a> are the fixed versions of exactly this, and the custom version starts from whichever of them is closest rather than from a blank page.</p>',
  excerpt = 'Not a different country, a different arrangement of it. The five decisions that are genuinely yours, and the five variables behind every quote you will be sent.',
  category = 'Travel Planning',
  tags = ARRAY['Private Touring', 'Itineraries', 'Egypt Travel Planning']::text[],
  focus_keyword = 'tailor-made egypt tours',
  meta_title = 'Tailor-Made Egypt Tours: What Drives the Price',
  meta_description = 'Tailor-made egypt tours change five things and leave the rest alone. What you actually get to choose, and the five variables that move the price either way.',
  faqs = '[{"id":"8ad1df6a-984a-5e61-859c-636bf4942797","question":"What can you actually change on a tailor-made Egypt tour?","answer":"5 things: the dates, the length, the pace, where you sleep, and which sites open outside their normal hours for you. The route itself barely moves, because the temples sit on the Nile and Abu Simbel is where it is. Anyone promising a radically different route is selling you transit time."},{"id":"62b428aa-8021-500e-a8c3-385a6c9e676f","question":"What drives the cost of an Egypt tour?","answer":"5 variables: length, season, the boat, any private access arranged, and the size of your party. Ask for a quote broken down along those lines, because 1 total figure cannot be compared with another. Two quotes for the same trip usually differ on at least 3 of the 5 assumptions."},{"id":"85b04d1a-4c5e-52dc-8458-a96e60b4eb5d","question":"How much does a private Egypt tour cost?","answer":"Our own private itineraries run 7 to 14 days and start at 4,000 USD per person, which is a floor rather than a typical figure. What moves a trip above it is mostly the boat and the season. December and January are the 2 most expensive months and a dahabiya charter is the largest single line."},{"id":"9f73f13d-4599-5198-95f1-3209e8f6c8ad","question":"Is a tailor-made tour better than a fixed private itinerary?","answer":"Not automatically, and for maybe half of travellers a published private route is the better buy. It gives you the private car and guide at a lower price. Custom earns its cost when something is fixed or specific: 1 particular week, a child''s pace, a mobility need, or a second visit."},{"id":"a7627aeb-018a-53c1-b48d-f5ae768092d4","question":"How far ahead should you start planning a custom Egypt trip?","answer":"6 months for December and January, 3 months for the shoulder season. The process itself is a call, a draft and 2 or 3 revisions, which takes a fortnight of calendar time at most. The reason to start early is the boats: small dahabiyas in the good months go first by a wide margin."},{"id":"06591ce7-4027-529f-bb7a-03e4633c8715","question":"Does the number of people change the price per person?","answer":"Considerably, and in your favour. A private guide, car and boat cost roughly the same for 2 people as for 6, so a family or 2 couples travelling together pay much less each for an identical arrangement. That is also why a couple''s quote looks high beside a group departure priced per seat."},{"id":"36a5b43c-1c6c-50a9-8bbd-2613e1c470d8","question":"What should you send in the first email to an Egypt operator?","answer":"4 things. Your earliest and latest dates with the number of nights, who is travelling including ages and anything affecting walking or heat, what you most want to see and what you do not care about, and the range you are working within. Withholding the last one costs a round of revisions."},{"id":"ac8854fb-bcaf-50ad-84ab-1fb90c8aec31","question":"Is private access to temples worth paying for?","answer":"Sometimes, and it turns on what you want from the trip. It is a real permission rather than a ticket, available at some sites and not on every day, which is why it carries a cost. For a first visit with a specific photograph in mind it is the difference between 2 quite different mornings."}]'::jsonb,
  schema_type = 'BlogPosting',
  status = 'published',
  updated_at = now()
-- Both slugs, so a second run finds the row it renamed on the first.
WHERE slug IN ('bespoke-egypt-travel', 'tailor-made-egypt-tours');

-- what-currency-does-egypt-use becomes currency-in-egypt
UPDATE posts SET
  slug = 'currency-in-egypt',
  title_en = 'Currency in Egypt: Cash, Cards and Changing Money',
  body_en = '<p>Egypt uses the Egyptian pound, written LE or EGP. Bring a debit card and withdraw from bank ATMs on arrival rather than changing cash at home. Carry a small reserve of US dollars for emergencies, and get a thick stack of the smallest notes for tipping.</p>

<p>That is the whole practical answer on currency in egypt. What follows is the detail, plus the one thing this page will not do, which is tell you what a pound is worth today.</p>

<h2>What Currency for Egypt, and What to Call It</h2>

<p>The Egyptian pound. You will see it written as LE, as EGP, and as a symbol that looks like a stylised pound sign.</p>

<p>It divides into piastres, which in practice you can ignore. Notes are what you will handle, in a range from very small to fairly large, and the small ones are the ones that matter.</p>

<p>The question what currency for egypt occasionally gets the answer dollars or euros, and that is wrong. Some tourist businesses accept them, at a rate chosen by whoever is holding the calculator. Pay in pounds.</p>

<h2>Why This Page Will Not Quote You a Rate</h2>

<p>The pound floats, and it has moved a great deal over recent years.</p>

<p>Any number printed in an article is a number that was true on the day it was typed, and travel pages are rarely retyped. A rate quoted here would be wrong before you read it, and worse, it would look authoritative while being wrong.</p>

<p>Search egypt currency to usd on the day you need it, or open your banking app, and use the figure you find there. That is a thirty second job and it is the only reliable version of it.</p>

<p>Take a photograph of the rate on the morning you arrive so you have a reference point for the week. It stops the mental arithmetic becoming a running argument.</p>

<h2>Where to Change Money, and Where Not To</h2>

<p>Bank ATMs in Egypt, for almost everybody.</p>

<p>Changing money at home before you fly is the most expensive option and the most common. Your home bank is not competing for the business and the rate shows it. Airport exchange desks are the second most expensive, wherever the airport is.</p>

<p>Bank branches and official exchange offices inside Egypt are fine and give a reasonable rate. Hotel reception desks are convenient and cost you for the convenience, which is a fair trade for a small amount on arrival and a poor one for the week''s spending.</p>

<p>Never change money with someone who approaches you in the street, whatever the rate offered.</p>

<h2>ATMs, and the Rules That Save Money</h2>

<p>Use a machine attached to an actual bank branch rather than a standalone one in a shop lobby or a hotel corridor.</p>

<p>Withdraw a decent amount at a time. Most cards charge a fixed fee per withdrawal, so four small withdrawals cost four times what one larger one does.</p>

<p>When the machine offers to bill you in your own currency, always decline. That option is dynamic currency conversion and the rate is set by the machine''s operator rather than by your bank. Choosing to be charged in Egyptian pounds is always the cheaper answer.</p>

<p>Tell your bank you are travelling before you leave, or expect the first attempt to be declined and the second to be blocked.</p>

<!-- OWNER: first-hand paragraph fits here, on which ATMs guests actually find reliable and where the queues are -->

<h2>Using Currency in Egypt Day to Day</h2>

<p>Cash for most things, card for the large ones.</p>

<p>Cards work in hotels, better restaurants, larger shops and for pre-booked arrangements. Markets, taxis, tips, small cafes, entrance charges at minor sites and anything bought from a person rather than a till are cash.</p>

<p>Carry less than you think you need in your wallet and leave the rest in the hotel safe. Not because the streets are dangerous, but because a lost wallet is a bad afternoon and there is no reason to make it a worse one.</p>

<h2>The Small Note Problem</h2>

<p>This is the practical thing nobody tells you and it affects every day of the trip.</p>

<p>Tipping here is constant and small, and ATMs dispense large notes. If your pockets contain only large notes you will either overtip every time or spend the week asking people to break them.</p>

<p>Ask at the hotel desk to change one large note into small ones, on the first day and again mid trip. Keep them in a separate pocket from your real money. This single habit removes most of the friction visitors report about tipping.</p>

<p>Break large notes at hotels, supermarkets and restaurants, which can do it, rather than at a market stall, which usually cannot.</p>

<h2>Prices, and Why They Move</h2>

<p>Egypt has had real inflation for several years, and one consequence catches visitors out.</p>

<p>A price you read in an article, a guidebook or a forum post from last year is not a guide to what anything costs now. That applies to taxis, entrance charges, meals and tips alike, and it applies in both directions since the exchange rate has moved too.</p>

<p>Ask your guide or the hotel what something should cost before you agree to it, rather than working from a number you read at home. Prices in local currency in egypt move faster than the pages describing them do.</p>

<h2>Do You Need US Dollars?</h2>

<p>A small amount, as a reserve rather than as spending money.</p>

<p>Clean, untorn notes are useful for a visa on arrival, which is bought at a bank counter in the airport in cash, and as a fallback if a card stops working. Worn or damaged notes are sometimes refused.</p>

<p>Do not plan to spend dollars. Paying in them means accepting whoever''s rate, and you will lose on every transaction without ever seeing the number.</p>

<h2>What Not to Do</h2>

<p>Do not accept the machine''s offer to charge you in your home currency. Do not change large sums at a hotel desk. Do not change money on the street.</p>

<p>Do not arrive with a pile of Egyptian pounds bought at home. Beyond a very small amount for the first taxi, it is money spent for no reason.</p>

<p>And do not rely on a single card. One card and one backup, kept in different places, covers the situation that actually goes wrong.</p>

<!-- OWNER: first-hand paragraph fits here, on how guests usually handle money across a longer itinerary -->

<h2>Leaving, and What Is Left Over</h2>

<p>Spend it or keep it as a souvenir. Egyptian pounds are not easy to change back at a good rate once you are outside the country.</p>

<p>Plan the last withdrawal for the last few days rather than taking out a round number on arrival and hoping it works out.</p>

<p>Airport shops before security take pounds and cards, which is the easiest place to use up the last of it.</p>

<h2>Where This Fits</h2>

<p>Money here is a small problem that people spend a disproportionate amount of time worrying about before they arrive, and almost none of that worry survives the first day.</p>

<p>The egypt currency question is really two questions: where do I get it, and what do I need small notes for. Bank ATM, and tipping.</p>

<p>Handling currency in egypt takes about ten minutes of preparation and no thought at all after that, provided the small notes are sorted on the first day.</p>

<p><a href="/blog/egypt-travel-tips">The practical notes on travelling here</a> cover the tipping in more detail, and <a href="/blog/what-to-pack-for-egypt">the packing guide</a> covers the separate pocket for the small notes, which sounds trivial until the third day.</p>

<p>The <a href="/egypt-travel-guide/cairo-travel-guide">Cairo guide</a> covers where the good banks and markets actually are. On our <a href="/best-luxury-egypt-tours">longer Egypt tours</a> the entrance fees and the transfers are already paid, which leaves cash as a tipping and shopping problem rather than a logistical one.</p>',
  excerpt = 'The Egyptian pound floats, so no page should quote you a rate. What to actually do instead: where to withdraw, what cards cover, and the small note problem.',
  category = 'Travel Tips',
  tags = ARRAY['Money', 'Before You Go', 'Travel Tips']::text[],
  focus_keyword = 'currency in egypt',
  meta_title = 'Currency in Egypt: What to Carry in {year}',
  meta_description = 'The currency in egypt is the Egyptian pound, and the rate floats. Where to change money, which ATMs to use, what cards are good for, and why small notes matter.',
  faqs = '[{"id":"07c883db-ecaa-5fdb-8c1e-41929c8fd35c","question":"What currency does Egypt use?","answer":"The currency in Egypt is the Egyptian pound, written LE or EGP and divided into 100 piastres, which you can ignore in practice. Some tourist businesses will take dollars or euros at a rate they choose themselves, so paying in pounds is always cheaper. Notes are what you will handle, and the small ones matter most."},{"id":"2eba4174-8759-568c-afce-5e515decf509","question":"Is it better to change money before you fly or in Egypt?","answer":"In Egypt, almost always. Changing at your home bank is the most expensive of the 3 usual options and airport desks are the second. A bank ATM in Egypt gives you a reasonable rate with 1 fixed fee. Bring at most a very small amount of pounds for the first taxi."},{"id":"d2d7071e-93f0-5024-b6d8-6003e909e69f","question":"What is the exchange rate for the Egyptian pound?","answer":"It floats and it has moved a great deal in recent years, so no travel page should quote you 1 number. Check your banking app or a live currency site on the day. Photographing the rate on your first morning gives you a reference point for the week and stops the arithmetic becoming an argument."},{"id":"f3631057-b298-5f8e-8970-876e54f92021","question":"Should you accept the ATM offer to charge in your own currency?","answer":"No, never. That option is dynamic currency conversion and the rate is set by the machine''s operator rather than by your bank, which means you lose on every withdrawal. Choosing to be billed in Egyptian pounds is cheaper 100 percent of the time, with no exceptions worth looking for."},{"id":"aa424ff0-f4cf-5625-8dba-05d1d9310559","question":"Is it worth bringing US dollars to Egypt?","answer":"A small reserve, yes. Clean untorn notes are useful for a visa on arrival, which is bought in cash at a bank counter, and as a fallback if a card fails. Do not plan to spend them: paying in dollars means accepting somebody else''s rate on all 3 or 4 transactions you use them for."},{"id":"16d6bbe8-bd4a-5713-965d-10036905530f","question":"Do you need cash in Egypt or are cards enough?","answer":"Both, in different places. Cards cover hotels, better restaurants, larger shops and pre-booked arrangements. Cash covers markets, taxis, tips, small cafes and minor entrance charges, which is most of the 10 or so transactions in a normal day. Carry 1 backup card kept somewhere separate."},{"id":"5b8f7003-fdad-5ac3-b0c2-8b218db0a2cf","question":"Why do you need small notes in Egypt?","answer":"Because tipping is constant and ATMs dispense large notes. With only large notes you will either overtip on all 20 of the small services in a week or spend it asking people to break them. Change 1 large note into small ones at the hotel desk on arrival and again mid trip."},{"id":"380445ae-b9ee-56e7-b130-f5b7b0215eec","question":"What should you do with leftover Egyptian pounds?","answer":"Spend them before you leave. Pounds are not easy to change back at a decent rate once you are outside the country, so plan your last withdrawal for the final 2 or 3 days rather than taking a round number out on arrival. Airport shops before security take both pounds and cards."}]'::jsonb,
  schema_type = 'BlogPosting',
  status = 'published',
  updated_at = now()
-- Both slugs, so a second run finds the row it renamed on the first.
WHERE slug IN ('what-currency-does-egypt-use', 'currency-in-egypt');

COMMIT;

-- ---------------------------------------------------------------------------
-- Verification. Every "bad" column below must read 0, and the row count must
-- be 7.
-- ---------------------------------------------------------------------------
SELECT count(*) AS rows_present FROM posts WHERE slug IN ('vaccinations-needed-for-egypt', 'planning-a-trip-to-egypt', 'egypt-travel-tips', 'what-to-pack-for-egypt', 'private-tours-in-cairo-egypt', 'tailor-made-egypt-tours', 'currency-in-egypt');

-- Must be 0. Any row still under an old slug means its UPDATE matched nothing,
-- which means the row was not there under either name.
SELECT 'rows still under an old slug' AS check, count(*) AS bad
FROM posts WHERE slug IN ('vaccinations-needed-for-egypt', 'vaccines-for-egypt-travel', 'planning-a-trip-to-egypt', 'how-to-plan-a-luxury-egypt-trip', 'egypt-travel-tips', 'things-to-know-before-traveling-to-egypt', 'what-to-pack-for-egypt', 'egypt-packing-list', 'private-tours-in-cairo-egypt', 'private-egypt-tour', 'tailor-made-egypt-tours', 'bespoke-egypt-travel', 'currency-in-egypt', 'what-currency-does-egypt-use') AND slug NOT IN ('vaccinations-needed-for-egypt', 'planning-a-trip-to-egypt', 'egypt-travel-tips', 'what-to-pack-for-egypt', 'private-tours-in-cairo-egypt', 'tailor-made-egypt-tours', 'currency-in-egypt');


SELECT slug,
       length(meta_title) AS title_len,
       length(meta_description) AS meta_len,
       jsonb_array_length(faqs) AS faq_count,
       array_length(regexp_split_to_array(regexp_replace(body_en, '<[^>]+>', ' ', 'g'), '\s+'), 1) AS body_words,
       scheduled_at,
       published_at,
       CASE WHEN body_en LIKE '%<figure%' THEN 'body kept, it has figures in it'
            ELSE 'body written from this file' END AS body_en_outcome
FROM posts WHERE slug IN ('vaccinations-needed-for-egypt', 'planning-a-trip-to-egypt', 'egypt-travel-tips', 'what-to-pack-for-egypt', 'private-tours-in-cairo-egypt', 'tailor-made-egypt-tours', 'currency-in-egypt') ORDER BY scheduled_at;

SELECT 'vaccinations-needed-for-egypt' AS slug,
       (SELECT count(*) FROM regexp_matches(body_en, 'vaccinations needed for egypt', 'gi')) AS primary_hits
FROM posts WHERE slug = 'vaccinations-needed-for-egypt';
SELECT 'planning-a-trip-to-egypt' AS slug,
       (SELECT count(*) FROM regexp_matches(body_en, 'planning a trip to egypt', 'gi')) AS primary_hits
FROM posts WHERE slug = 'planning-a-trip-to-egypt';
SELECT 'egypt-travel-tips' AS slug,
       (SELECT count(*) FROM regexp_matches(body_en, 'egypt travel tips', 'gi')) AS primary_hits
FROM posts WHERE slug = 'egypt-travel-tips';
SELECT 'what-to-pack-for-egypt' AS slug,
       (SELECT count(*) FROM regexp_matches(body_en, 'what to pack for egypt', 'gi')) AS primary_hits
FROM posts WHERE slug = 'what-to-pack-for-egypt';
SELECT 'private-tours-in-cairo-egypt' AS slug,
       (SELECT count(*) FROM regexp_matches(body_en, 'private tours in cairo egypt', 'gi')) AS primary_hits
FROM posts WHERE slug = 'private-tours-in-cairo-egypt';
SELECT 'tailor-made-egypt-tours' AS slug,
       (SELECT count(*) FROM regexp_matches(body_en, 'tailor-made egypt tours', 'gi')) AS primary_hits
FROM posts WHERE slug = 'tailor-made-egypt-tours';
SELECT 'currency-in-egypt' AS slug,
       (SELECT count(*) FROM regexp_matches(body_en, 'currency in egypt', 'gi')) AS primary_hits
FROM posts WHERE slug = 'currency-in-egypt';

SELECT 'seo lengths out of range' AS check, count(*) AS bad FROM posts
WHERE slug IN ('vaccinations-needed-for-egypt', 'planning-a-trip-to-egypt', 'egypt-travel-tips', 'what-to-pack-for-egypt', 'private-tours-in-cairo-egypt', 'tailor-made-egypt-tours', 'currency-in-egypt') AND (length(meta_title) > 60 OR length(meta_description) NOT BETWEEN 150 AND 160);

SELECT 'faq count out of range' AS check, count(*) AS bad FROM posts
WHERE slug IN ('vaccinations-needed-for-egypt', 'planning-a-trip-to-egypt', 'egypt-travel-tips', 'what-to-pack-for-egypt', 'private-tours-in-cairo-egypt', 'tailor-made-egypt-tours', 'currency-in-egypt') AND jsonb_array_length(faqs) NOT BETWEEN 7 AND 8;

-- Answers are written to be quoted on their own by an AI answer engine, which
-- means 40 to 80 words each. Outside that they are either empty or too long.
SELECT 'faq answers outside 40-80 words' AS check, count(*) AS bad
FROM posts p, jsonb_array_elements(p.faqs) f
WHERE p.slug IN ('vaccinations-needed-for-egypt', 'planning-a-trip-to-egypt', 'egypt-travel-tips', 'what-to-pack-for-egypt', 'private-tours-in-cairo-egypt', 'tailor-made-egypt-tours', 'currency-in-egypt')
  AND array_length(regexp_split_to_array(trim(f->>'answer'), '\s+'), 1) NOT BETWEEN 40 AND 80;

-- The SEO overrides must be NULL, not empty strings, or the fallbacks break.
SELECT 'seo overrides stored as empty strings' AS check, count(*) AS bad FROM posts
WHERE slug IN ('vaccinations-needed-for-egypt', 'planning-a-trip-to-egypt', 'egypt-travel-tips', 'what-to-pack-for-egypt', 'private-tours-in-cairo-egypt', 'tailor-made-egypt-tours', 'currency-in-egypt')
  AND (canonical_url = '' OR robots = '' OR og_image = '' OR schema_type = '' OR featured_image_alt = '');

SELECT 'faq entries missing id, question or answer' AS check, count(*) AS bad
FROM posts p, jsonb_array_elements(p.faqs) f
WHERE p.slug IN ('vaccinations-needed-for-egypt', 'planning-a-trip-to-egypt', 'egypt-travel-tips', 'what-to-pack-for-egypt', 'private-tours-in-cairo-egypt', 'tailor-made-egypt-tours', 'currency-in-egypt')
  AND (coalesce(f->>'id','') = '' OR coalesce(f->>'question','') = '' OR coalesce(f->>'answer','') = '');

SELECT 'em or en dash present' AS check, count(*) AS bad FROM posts
WHERE slug IN ('vaccinations-needed-for-egypt', 'planning-a-trip-to-egypt', 'egypt-travel-tips', 'what-to-pack-for-egypt', 'private-tours-in-cairo-egypt', 'tailor-made-egypt-tours', 'currency-in-egypt')
  AND (body_en ~ '[\u2013\u2014]' OR meta_title ~ '[\u2013\u2014]' OR meta_description ~ '[\u2013\u2014]' OR title_en ~ '[\u2013\u2014]');

-- Tour links must sit at the site root. Anything under the category path 404s.
SELECT 'tour links under /luxury-egypt-tour-packages/' AS check, count(*) AS bad FROM posts
WHERE slug IN ('vaccinations-needed-for-egypt', 'planning-a-trip-to-egypt', 'egypt-travel-tips', 'what-to-pack-for-egypt', 'private-tours-in-cairo-egypt', 'tailor-made-egypt-tours', 'currency-in-egypt') AND body_en ~ 'href="/luxury-egypt-tour-packages/[^"]';

-- The hotel listing moved. A link to the old path still works through the 301,
-- and costs every reader a hop for no reason.
SELECT 'links to the old /stay path' AS check, count(*) AS bad FROM posts
WHERE slug IN ('vaccinations-needed-for-egypt', 'planning-a-trip-to-egypt', 'egypt-travel-tips', 'what-to-pack-for-egypt', 'private-tours-in-cairo-egypt', 'tailor-made-egypt-tours', 'currency-in-egypt') AND body_en ~ 'href="/stay';

SELECT 'unfilled placeholders' AS check, count(*) AS bad FROM posts
WHERE slug IN ('vaccinations-needed-for-egypt', 'planning-a-trip-to-egypt', 'egypt-travel-tips', 'what-to-pack-for-egypt', 'private-tours-in-cairo-egypt', 'tailor-made-egypt-tours', 'currency-in-egypt') AND (body_en LIKE '%data-placeholder=%' OR body_en ~ '\{\{[A-Z_]+\}\}');

SELECT 'other language columns left empty' AS check, count(*) AS bad FROM posts
WHERE slug IN ('vaccinations-needed-for-egypt', 'planning-a-trip-to-egypt', 'egypt-travel-tips', 'what-to-pack-for-egypt', 'private-tours-in-cairo-egypt', 'tailor-made-egypt-tours', 'currency-in-egypt')
  AND (title_es IS NOT NULL OR title_fr IS NOT NULL OR title_jp IS NOT NULL
       OR body_es IS NOT NULL OR body_fr IS NOT NULL OR body_jp IS NOT NULL);

-- The owner paragraphs are deliberately left as HTML comments for someone to
-- replace with a real first hand voice. This is a reminder, not a failure.
SELECT slug,
       (length(body_en) - length(replace(body_en, '<!-- OWNER:', ''))) / 11 AS owner_notes_awaiting_a_paragraph
FROM posts WHERE slug IN ('vaccinations-needed-for-egypt', 'planning-a-trip-to-egypt', 'egypt-travel-tips', 'what-to-pack-for-egypt', 'private-tours-in-cairo-egypt', 'tailor-made-egypt-tours', 'currency-in-egypt') ORDER BY slug;
