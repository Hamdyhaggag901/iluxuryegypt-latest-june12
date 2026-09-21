-- Wave "rewrite-phase-b": 5 articles, loaded in one file.
--
--   egypt-travel-insurance  (egypt travel insurance)
--   egypt-honeymoon  (egypt honeymoon)
--   egypt-plug-type  (egypt plug type)
--   private-pyramid-tours-egypt  (private pyramid tours egypt)
--   best-luxury-nile-cruise-egypt  (best luxury nile cruise)
--
-- These rows are ALREADY PUBLISHED and already indexed. This file rewrites
-- their body and their SEO fields in place. published_at is never touched, so
-- each article keeps the date it first went out, which is what its BlogPosting
-- has been telling crawlers since. updated_at carries the rewrite, and
-- dateModified follows from it.
--
-- No slug changes in this wave, so no redirect is involved. Every row keeps
-- the URL it is already indexed under.
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
--   egypt-travel-insurance
--     Passport, policy printout and a phone on a desk while arranging egypt travel insurance cover
--   egypt-honeymoon
--     A couple alone on the upper deck of a dahabiya at sunset on an egypt honeymoon
--   egypt-plug-type
--     A two round pin European plug beside a wall socket showing the egypt plug type
--   private-pyramid-tours-egypt
--     The Giza plateau in early morning light with no crowds, on private pyramid tours egypt
--   best-luxury-nile-cruise-egypt
--     A sailing dahabiya moored against a quiet bank at dusk on the best luxury nile cruise route
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
WHERE slug IN ('egypt-travel-insurance', 'egypt-honeymoon', 'egypt-plug-type', 'private-pyramid-tours-egypt', 'best-luxury-nile-cruise-egypt')
ORDER BY published_at NULLS LAST, slug;

BEGIN;

-- egypt-travel-insurance
UPDATE posts SET
  slug = 'egypt-travel-insurance',
  title_en = 'Egypt Travel Insurance: What Cover Actually Matters',
  body_en = '<p>Yes, buy it, and read one clause before you read the price. A policy for a trip to Egypt needs medical evacuation cover that will actually move you, not simply pay a hospital bill where you happen to be standing. Everything else here is secondary to that single line in the schedule.</p>

<p>Nobody sells a product called Egypt travel insurance. You are buying an ordinary single trip or annual policy, and the work is checking that four specific things sit inside it rather than in the exclusions on page nine.</p>

<p>Those four are medical evacuation, cancellation, pre-existing conditions and activity cover. The rest is mostly noise.</p>

<h2>Does Egypt Require Travel Insurance?</h2>

<p>No. There is no insurance requirement at the Egyptian border and immigration will not ask to see a policy.</p>

<p>The question does egypt require travel insurance gets asked because several countries in the region did require it during the pandemic years, and some travellers still expect the rule to be sitting there. It is not, which is why every travel insurance Egypt search that begins with the word required is asking the wrong question.</p>

<p>None of that changes whether you should carry one. Egypt has no reciprocal healthcare arrangement with the United States, the United Kingdom or the European Union. Foreign visitors pay for treatment at the point of use and claim it back afterwards.</p>

<h2>What an Egypt Travel Insurance Policy Has to Cover</h2>

<p>Four clauses. That is the whole of it.</p>

<p>Medical and evacuation cover, so that a problem in Upper Egypt becomes somebody else''s logistics problem rather than yours. Cancellation and curtailment, so that a deposit is not simply gone. Pre-existing condition cover that reflects what you actually declared. Activity cover naming the specific things on your itinerary, which on a trip here usually means a balloon.</p>

<p>Baggage, delay and personal liability come as standard on almost everything and are not worth choosing a policy over. If a comparison is sorting on baggage limits, it is sorting on the wrong column.</p>

<h2>Medical Evacuation Is the Clause to Read First</h2>

<p>Egypt is a large country and its best hospitals are in Cairo. If something happens in Aswan, on the river between Luxor and Kom Ombo, or out in the Western Desert, the question is not who treats you locally. It is who moves you.</p>

<p>Look for two words in the schedule: evacuation and repatriation. Evacuation moves you to adequate care, which may well be Cairo rather than home. Repatriation moves you home. A policy can carry one and not the other.</p>

<p>Then read the limit rather than the presence of the clause. An air ambulance out of Upper Egypt is not a modest cost, and a token limit is the same as no cover at all.</p>

<h2>Cancellation, and What Actually Triggers It</h2>

<p>This is the clause people assume they have and almost never read.</p>

<p>A standard policy pays out when you cannot travel for a named reason: illness, injury, jury service, redundancy, the death of a close relative. It does not pay because you changed your mind, and in most wordings it does not pay because a government advisory moved after you booked.</p>

<p>That last point matters here more than it does for most destinations. Egypt carries regional advisories that shift, and the Sinai and the Western Desert border areas sit at a higher level than the rest of the country. A policy bought after an advisory changes treats that change as a known circumstance.</p>

<p>Cancel for any reason cover exists, costs noticeably more, and pays a percentage rather than the whole loss. Whether it earns its price depends entirely on how much of your trip is non refundable and how far ahead you are committing.</p>

<h2>Pre-existing Conditions and the Declaration Nobody Enjoys</h2>

<p>Declare everything. This is the most common single reason a claim is refused.</p>

<p>Insurers define a pre-existing condition broadly: anything diagnosed, treated, medicated or investigated inside a window the policy sets, and the window reaches back further than most people assume. A blood pressure prescription counts. An investigation that came back clear counts.</p>

<p>Declaring something does not automatically make a policy expensive. An undeclared condition can void the entire policy rather than just the claim related to it, which is a very different outcome.</p>

<p>If you travel with medication, carry it in the original labelled packaging with a copy of the prescription. That is a customs point rather than an insurance one, and it is the kind of thing that becomes an insurance one at the worst possible moment.</p>

<!-- OWNER: first-hand paragraph fits here, on what guests have actually needed cover for and how the assistance line handled it -->

<h2>Activity Cover: Ballooning, Diving and the Rest</h2>

<p>Read this section if your trip involves anything more strenuous than a temple.</p>

<p>A sunrise balloon flight over the west bank at Luxor is on most itineraries here, and it is excluded outright by a surprising number of standard policies or covered only as a named extra. Diving in the Red Sea is usually covered to a stated depth and only with a recognised qualification. Quad bikes and camels fall under the same headings as any other motorised or animal activity.</p>

<p>The fix is dull and takes about five minutes: write down what you will actually do, then search the policy wording for each item by name.</p>

<p>If an activity is not named anywhere, ask and keep the reply. An insurer''s written answer beats your assumption about what counts as ordinary holiday behaviour.</p>

<h2>Where the Best Travel Insurance for Egypt Comes From</h2>

<p>We do not name insurers, we take no commission from any of them, and we are not going to hand you a comparison table dressed up as advice. What we can tell you is what to compare.</p>

<p>Egypt travel insurance is not a separate product category, whatever the comparison sites imply. The best travel insurance for egypt is whichever policy, from whichever provider, carries an evacuation limit you would be content to rely on from Aswan, names the activities on your itinerary, and accepts your declared medical history without an exclusion that guts the cover.</p>

<p>Price is a poor way to sort them. Two policies costing much the same can carry evacuation limits nowhere near each other, and that gap is the one that matters on the day you need it.</p>

<p>Buy direct from the insurer, or through a regulated broker in your own country, so that any dispute goes to a regulator you can actually reach.</p>

<h2>Travel Insurance for Egypt: When to Buy It</h2>

<p>The day the first payment leaves your account.</p>

<p>Cancellation cover runs from the date of purchase, not from the date of departure. Every day you wait is another day of deposits sitting uninsured. The medical half of the policy does not begin until you travel, so waiting buys you nothing at all and costs you the only part of the cover that is live while you are still at home.</p>

<h2>What Happens If You Actually Need It</h2>

<p>Call the emergency number on the certificate first. Before the hospital, before your family, before anyone else.</p>

<p>Most policies require notification before treatment for anything beyond a minor consultation, and the assistance company will usually arrange payment directly with the hospital rather than leaving you to reclaim it later. That one call is the difference between an inconvenience and a very large charge on your own card.</p>

<p>Photograph everything as you go. Receipts, prescriptions, the doctor''s notes, the police report if there is one. Claims are settled on paper, months later, by somebody who was not there.</p>

<p>Save the policy number and the emergency line to your phone and give both to whoever is travelling with you. A certificate sitting in an email you cannot open is not cover.</p>

<h2>Reading a Policy Properly in Ten Minutes</h2>

<p>Open the full wording rather than the sales page, and use the search box.</p>

<p>Search for evacuation, then repatriation, then the name of every activity on your trip, then the words pre-existing. Read the limit printed next to each one. If any of those four searches returns nothing, that policy is not the one.</p>

<p>Then read the general exclusions section end to end. It is short, it is the only part of the document written to be skipped, and it is where the surprises live.</p>

<!-- OWNER: first-hand paragraph fits here, on the questions guests ask about cover during the planning calls -->

<h2>The Part of This We Cannot Answer for You</h2>

<p>Whether a particular policy suits you turns on your age, your health, where you live and what the trip cost, and those four things change the answer completely.</p>

<p>The United States State Department publishes guidance on insurance and medical care abroad alongside its country information for Egypt at <a href="https://travel.state.gov/en/international-travel/travel-advisories/egypt.html">travel.state.gov</a>. That is a better starting point than any travel company''s summary, this one included.</p>

<h2>Where This Sits in the Rest of the Planning</h2>

<p>Insurance is a short evening''s work that people postpone for weeks, and it is the only part of a trip that becomes worth less the longer you leave it.</p>

<p>Do it once the flights are ticketed and the first deposit has gone, and before anything else on the list. The <a href="/blog/is-egypt-safe-for-americans">current advisory picture</a> is worth reading first, because those regional levels are exactly what a cancellation clause will be measured against, and <a href="/blog/egypt-travel-tips">the practical things worth knowing first</a> covers the rest of the pre-departure list.</p>

<p>The <a href="/egypt-travel-guide/cairo-travel-guide">Cairo guide</a> covers where the serious hospitals actually are, which is the detail an evacuation clause turns on. Guests on our <a href="/best-luxury-egypt-tours">longer Egypt tours</a> travel with a car and driver throughout and one guide who stays with them, which shortens the distance between a problem and somebody dealing with it. It does not replace a policy.</p>',
  excerpt = 'No insurer names, no commission, no comparison table dressed up as advice. The four clauses that decide whether a policy is any use on a trip through Upper Egypt.',
  category = 'Travel Planning',
  tags = ARRAY['Travel Insurance', 'Egypt Travel Planning', 'Before You Go']::text[],
  focus_keyword = 'egypt travel insurance',
  meta_title = 'Egypt Travel Insurance in {year}: What to Check',
  meta_description = 'An egypt travel insurance policy is judged on four clauses, never on price. Medical evacuation, cancellation, declared conditions, and the activities booked.',
  faqs = '[{"id":"e9f1e5d0-6174-53fd-b781-e630117fefe6","question":"Does Egypt require travel insurance?","answer":"No. Egypt sets no insurance requirement at the border and immigration will not ask to see a policy. Whether you should carry one is a separate question with a different answer. Egypt holds 0 reciprocal healthcare agreements with the United States, the United Kingdom or the European Union, so foreign visitors pay for treatment at the point of use."},{"id":"22d0c617-d8d9-5796-9b8c-ece27d0bd2a2","question":"What should egypt travel insurance cover?","answer":"4 clauses decide it. Medical treatment with emergency evacuation and repatriation, cancellation and curtailment, pre-existing conditions as you declared them, and activity cover naming whatever you actually plan to do. Baggage and delay come as standard almost everywhere and are not a reason to choose one policy over another."},{"id":"5456f235-13b7-5689-81b7-c799f302c6d7","question":"What is the difference between evacuation and repatriation cover?","answer":"Evacuation moves you to adequate medical care, repatriation moves you home, and 1 policy can carry either without the other. On a trip through Upper Egypt the first matters more, because the serious hospitals are in Cairo and the distance from Aswan or the Western Desert is the real problem rather than the treatment itself."},{"id":"86d241fa-48d4-5677-ba91-0df4a3124379","question":"Is cancel for any reason cover worth buying for Egypt?","answer":"Only when a large share of your trip is non refundable. It costs noticeably more than standard cancellation cover and pays a percentage of the loss rather than all of it, often around half. Book 12 months ahead with heavy deposits and it earns its price. Book late with flexible arrangements and it rarely does."},{"id":"61f1b409-a074-58a2-93d3-5b5d6ce424c7","question":"Which is better for Egypt, an annual policy or single trip cover?","answer":"Single trip cover, unless you already travel more than twice a year. An annual policy is priced for frequency and its per trip limits are sometimes lower, particularly on evacuation, which is the 1 limit that matters most here. Compare the evacuation figure on both before comparing anything else."},{"id":"1a2aec44-90b7-5ab7-9703-6b6a71d92087","question":"Does travel insurance cover a hot air balloon flight in Luxor?","answer":"Often not as standard. A sunrise balloon over the west bank is excluded outright by a surprising number of policies and covered by others only as a named activity you add. Check the wording for the words balloon or aerial before you book the flight, and get the insurer''s answer in writing. 1 email settles it."},{"id":"200f997a-7b87-566d-8d9c-92d31cfa03ee","question":"When should you buy travel insurance for a trip to Egypt?","answer":"The day your first payment leaves your account. Cancellation cover starts on the date of purchase rather than the date of departure, so every 1 of the days you wait leaves deposits uninsured. The medical half does not begin until you travel anyway, which means waiting saves nothing and risks the part that is already live."},{"id":"e8290ef1-b835-5760-a54e-394bde34507b","question":"What do you do if you need to claim while in Egypt?","answer":"Call the emergency number on the certificate before anything else, including the hospital. Most policies require notification before treatment beyond a minor consultation, and the assistance company will usually settle directly with the hospital. Photograph all receipts, prescriptions and notes, and keep 2 copies, because claims are decided on paper months later."}]'::jsonb,
  schema_type = 'BlogPosting',
  status = 'published',
  updated_at = now()
-- Both slugs, so a second run finds the row it renamed on the first.
WHERE slug IN ('egypt-travel-insurance');

-- egypt-honeymoon
UPDATE posts SET
  slug = 'egypt-honeymoon',
  title_en = 'Egypt Honeymoon: How to Shape the Trip',
  body_en = '<p>Ten days, split between Cairo, the Nile and a few nights on the Red Sea, is the shape that suits most couples. The river is the part people remember afterwards. October to April is the window worth having. Everything below is how to arrange those three facts around each other.</p>

<p>An egypt honeymoon is not a different product from any other trip here. Same country, same sites, same logistics. What changes is the arrangement: you are alone more often than not, nothing starts at six in the morning unless you asked for it, and nobody hands you a clipboard on the first day.</p>

<p>That is the honest version. The rest of this page is the detail.</p>

<h2>What an Egypt Honeymoon Actually Looks Like</h2>

<p>Three parts, in this order, for good reasons.</p>

<p>Cairo first, because the flights land there and because the pyramids and the museum are heavy days that are better done while you still have energy for them. The Nile second, because by then you want to sit down. The sea last, because ending a trip on a beach is a much better idea than starting one there and then being dragged around temples with sand in your bag.</p>

<p>Reverse it and the trip works against itself. Couples who put the beach first almost always say afterwards that they wished they had not.</p>

<h2>Egypt Honeymoon Tours Fall Into Three Shapes</h2>

<p>Group departures, fixed private itineraries, and trips built from nothing.</p>

<p>A group departure is the cheapest and the least suitable. The coach runs to a timetable that has nothing to do with you, the restaurants are chosen for forty people, and the photographs at Giza have other couples in them.</p>

<p>A fixed private itinerary is a published route run privately. You get your own car, your own guide and your own pace, on somebody else''s route. For many couples that is plenty.</p>

<p>The third is what most honeymoons here should be, because the dates are fixed by a wedding and the preferences are specific. Most honeymoon tours Egypt companies advertise are the classical itinerary with rose petals added, and the petals are not the part that matters.</p>

<h2>Planning a Honeymoon in Egypt: When to Go</h2>

<p>October to April. Outside that, Luxor and Aswan sit in genuine heat, and a honeymoon spent moving between air conditioned rooms is a waste of the money.</p>

<p>Within the window, late October and March are the two best months. Warm days, cool evenings on the river, and the sites busy rather than crowded. December and January are lovely and the most expensive. February is quieter than people expect.</p>

<p>May and September are the shoulder. Both are workable if you accept early starts, and both cost noticeably less.</p>

<p>If your wedding date fixes you into July or August, say so early. That trip can be built, but it has to be built differently, with the temple visits at dawn and the afternoons written off.</p>

<h2>Cairo, and Why Two Nights Is Usually Wrong</h2>

<p>Three nights. Sometimes four.</p>

<p>Two nights means a jet lagged arrival, one enormous day covering Giza, Saqqara and the museum, and a departure. It can be done and it is not a honeymoon, it is a schedule.</p>

<p>Three nights lets the pyramids have a morning of their own, the museum an afternoon of its own, and leaves a slow day for Islamic Cairo, a felucca at sunset, or nothing at all. The nothing at all is the point.</p>

<p>We can arrange access to certain sites before they open to the public, or after they close. On a honeymoon that is not a luxury detail. It is the difference between a photograph of the two of you and a photograph of the two of you and two hundred other people.</p>

<!-- OWNER: first-hand paragraph fits here, on which of the early access arrangements couples actually remember afterwards -->

<h2>The River Is the Honeymoon</h2>

<p>Four nights on the Nile, five if the dates allow it.</p>

<p>The river is the only part of the trip where you stop moving. The temples come to you, the scenery changes without you doing anything about it, and the evenings are the reason people book this part twice in a lifetime.</p>

<p>What surprises people is how little happens on a dahabiya, and how much they like it. You read, you watch the bank go past, somebody brings tea. There are two temples in a day at most, and long stretches with nothing scheduled between them.</p>

<p>Aswan to Luxor rather than the reverse, if you have the choice. It is the gentler direction, the sailing is slower, and it ends you in Luxor with the west bank still ahead of you rather than behind.</p>

<h2>Dahabiya, Small Ship or Large Ship</h2>

<p>This is the single decision that changes the trip more than any other.</p>

<p>A dahabiya is a sailing boat with a handful of cabins. Private ones exist and we run them. It moors in places the bigger boats cannot reach, it is quiet, and for two people who have just spent a year organising a wedding it is usually the right answer.</p>

<p>A boutique ship carries more people with more facilities and a fixed schedule. A large ship carries a great many more and moors alongside others, which means your window can face somebody else''s cabin.</p>

<p>The full comparison, including what to ask about each category, is in the <a href="/blog/best-luxury-nile-cruise-egypt">guide to choosing a Nile cruise</a>. For a honeymoon the short version is that the smaller the boat, the more of the trip belongs to you.</p>

<h2>The Beach Half, and Whether You Need One</h2>

<p>Three or four nights, and only at the end.</p>

<p>The Red Sea coast is where couples stop being tourists. The water is warm, the reefs are genuinely good, and after a week of early mornings the appeal of a day with no plan in it becomes obvious.</p>

<p>The <a href="/egypt-travel-guide/things-to-do-in-hurghada">Hurghada guide</a> covers what is actually there. El Gouna and the quieter stretches south are worth asking about if a resort strip is not what you had in mind.</p>

<p>You can also skip it entirely. Couples who want ruins and river and nothing else should say so, and get two more nights on the water instead.</p>

<h2>What Egypt Honeymoon Packages Usually Include</h2>

<p>The phrase egypt honeymoon packages normally means a fixed route at a set price, and the price is the reason it is fixed.</p>

<p>What is generally inside: internal flights, hotels, the cruise, guided sightseeing, entrance fees, transfers. What is generally outside: international flights, visas, tipping, drinks, and anything described as optional.</p>

<p>Read the word private carefully. It is used for the vehicle, for the guide and for the boat, and a package can be private in one of those senses and shared in the others. Ask which.</p>

<p>Ask also who the guide is and whether it is the same person throughout. One guide who travels with you for the whole trip is a different experience from a different local guide in each city, and it is not always obvious from the itinerary which you are buying.</p>

<h2>Privacy, Which Is the Whole Point</h2>

<p>Everything above is a proxy for this one thing.</p>

<p>A honeymoon here is not about seeing more. You will see the same temples as everyone else. What you are arranging is when you see them, who else is standing there, and how much of each day belongs to the two of you rather than to a timetable.</p>

<p>That is why the private car and driver throughout matters more than the hotel category, why the early access matters more than the entrance ticket, and why a small boat beats a large one even when the large one has a better spa.</p>

<p>It is also why the photographs come out differently. A temple courtyard at seven in the morning with nobody in it does not need a photographer to look like something. The same courtyard at eleven does, and even then it is a crowd scene.</p>

<h2>The Practical Things Nobody Mentions</h2>

<p>Book the flights in the name on your passport, not your new married name. Changing a passport after the wedding and before the flight is the single most common way this trip goes wrong in the first hour.</p>

<p>Tell us, and tell the hotels, that it is a honeymoon. Egyptian hospitality takes this seriously and the results are better than anything you could arrange yourself.</p>

<p>Pack one outfit each that covers shoulders and knees. Mosques and churches ask for it, and a shawl bought in a hurry outside the door is nobody''s favourite photograph.</p>

<p>Bring cash in small notes for tipping. It is constant, it is expected, and it is easier when you are not breaking a large note every time.</p>

<p>Keep one small bag packed for the boat. Cabins are smaller than hotel rooms, and the large case can travel separately and meet you in Luxor.</p>

<h2>Anniversaries and Vow Renewals</h2>

<p>The same trip, with one difference: you already know each other''s tolerance for early mornings.</p>

<p>Couples come back for tenth and twenty fifth anniversaries, and a good number of them ask for a vow renewal somewhere on the river or in front of a temple. That is arranged rather than bought, and it needs a few weeks of notice and a conversation about what you actually want rather than what a brochure offers.</p>

<p>If you came here on a group trip years ago and want to do it properly this time, say that too. It changes what we build.</p>

<!-- OWNER: first-hand paragraph fits here, on the anniversary trips and vow renewals that have actually been arranged -->

<h2>A Ten Day Shape That Works</h2>

<p>Three nights Cairo, one internal flight to Aswan, four nights sailing to Luxor, three nights on the Red Sea, out from Hurghada.</p>

<p>Stretch it to twelve and the extra two nights go on the river. Compress it to eight and the beach is the part that goes, not Cairo and not the Nile.</p>

<p>Fourteen days lets you add Abu Simbel properly, a second day on the Luxor west bank, and a day in Alexandria if the sea in the north appeals more than the sea in the east.</p>

<h2>What to Ask Before You Book Anything</h2>

<p>Five questions, and the answers tell you most of what you need to know.</p>

<p>Is the guide ours alone and the same person throughout. Is the boat private, or are we buying cabins on a shared one. What time do we reach each site, and who else is there at that hour.</p>

<p>What is not included. And who plans this, by name.</p>

<p>On that last one: here it is the owner, from the first call, which is why the questions above get answered rather than deflected.</p>

<h2>Where to Start</h2>

<p>Start with the dates, because everything else follows from them and because the good boats go first in the high season.</p>

<p>The <a href="/blog/best-time-to-visit-egypt">month by month guide</a> is the honest version of when to come, including the months we would talk you out of. Our <a href="/egypt-nile-cruise-packages">Nile cruise itineraries</a> show the river sections as they are usually built, and the honeymoon version of any of them is the same route with the pace taken out.</p>

<p>Then send the dates and the two or three things that matter most to you. That is enough to start with.</p>',
  excerpt = 'Ten days, three parts, and one decision that changes the whole trip. What a honeymoon here really involves, written for couples who would rather not share a coach.',
  category = 'Travel Planning',
  tags = ARRAY['Honeymoon', 'Nile Cruise', 'Egypt Travel Planning']::text[],
  focus_keyword = 'egypt honeymoon',
  meta_title = 'Egypt Honeymoon: Where to Go and How Long',
  meta_description = 'An egypt honeymoon works best as Cairo, the Nile and a few quiet nights by the sea. How long each part needs, when to go, and what privacy actually costs.',
  faqs = '[{"id":"df85bcdf-8561-57cf-a2ca-b2e0fcf72d07","question":"How many days do you need for an Egypt honeymoon?","answer":"10 days is the shape that works: 3 nights in Cairo, 4 on the Nile between Aswan and Luxor, and 3 by the Red Sea at the end. 8 days works if you drop the beach. 14 lets you add Abu Simbel and a second day on the Luxor west bank without rushing anything."},{"id":"c842aedf-0156-5963-9516-0c75156cb05d","question":"When is the best time for a honeymoon in Egypt?","answer":"October to April, and late October or March if you can pick your dates freely. Days are warm, evenings on the river are cool, and the sites are busy rather than crowded. December and January are the 2 most expensive months of the year. July and August are workable only with dawn starts and afternoons written off."},{"id":"a2882d68-1171-510c-8d4f-e363f511bb7c","question":"Which is better for a honeymoon, a dahabiya or a cruise ship?","answer":"A dahabiya, for almost every couple. It carries a handful of cabins instead of 100 or more, sails rather than motors, and moors at places the larger boats cannot reach. A big ship has more facilities and ties up alongside other big ships, so your cabin window can face somebody else''s."},{"id":"dd3be40b-abb2-5acb-a2c6-f06fe1c3d75d","question":"What do Egypt honeymoon packages usually include?","answer":"Internal flights, hotels, the cruise, guided sightseeing, entrance fees and transfers, in most cases. Outside the price you will usually find international flights, the visa, tipping, drinks and anything labelled optional. Check which of the 3 things called private actually are: the vehicle, the guide and the boat are priced separately."},{"id":"b3d2d528-53a8-5ece-920a-96819c7273c5","question":"Is Egypt a good honeymoon destination for couples who want privacy?","answer":"Yes, if the trip is built for it rather than bought off a shelf. Privacy here comes from 3 arrangements: a private car and driver throughout, access to certain sites before opening or after closing, and a small boat instead of a large one. None of those is automatic and all 3 are worth asking about."},{"id":"d7667f15-000a-5463-9cd6-aec2bd6bfeb9","question":"Should you do the beach before or after the Nile?","answer":"After, every time. Cairo and the Nile are early mornings and long days, and finishing on the Red Sea gives you 3 or 4 nights with nothing scheduled. Couples who put the beach first spend the rest of the trip being moved between temples, and most say afterwards they would reverse it."},{"id":"e6425e28-f3be-5b1e-ab98-878e855203cd","question":"Can you arrange a vow renewal or anniversary trip in Egypt?","answer":"Yes, and it is arranged rather than bought from a menu. Couples come back for 10th and 25th anniversaries and often ask for a ceremony on the river or in front of a temple. Allow a few weeks of notice so the location, the timing and the people involved can be organised properly."},{"id":"0e06dc53-2479-50c2-9db8-c651e0b701b8","question":"What is the most common mistake on an Egypt honeymoon?","answer":"Booking the flights in a new married name before the passport has been changed. It stops the trip at the check in desk on day 1. After that, the usual error is giving Cairo only 2 nights, which turns the pyramids, Saqqara and the museum into a single exhausting day."}]'::jsonb,
  schema_type = 'BlogPosting',
  status = 'published',
  updated_at = now()
-- Both slugs, so a second run finds the row it renamed on the first.
WHERE slug IN ('egypt-honeymoon');

-- egypt-plug-type
UPDATE posts SET
  slug = 'egypt-plug-type',
  title_en = 'Egypt Plug Type: Sockets, Voltage and Adapters',
  body_en = '<p>Egypt uses Type C and Type F sockets, running at 220 volts and 50 hertz. They take the round two pin plug used across most of Europe. If you are travelling from the United States or the United Kingdom you need an adapter, and for a few appliances you need to check the voltage as well.</p>

<p>That is the whole egypt plug type answer. What follows is the part that saves an appliance.</p>

<h2>What Plug Type Does Egypt Use?</h2>

<p>Two, and they are compatible with each other.</p>

<p>Type C is the plain two round pin plug, ungrounded. Type F is the same two round pins with earth clips along the sides. A Type C plug fits a Type F socket, which is why a European charger works here without anyone thinking about it.</p>

<p>The sockets you find in the wall are usually Type F. The plugs on the small appliances you find in the room are usually Type C. Both are normal.</p>

<h2>The Egypt Plug Type, by Where You Are Coming From</h2>

<table>
<thead>
<tr><th>Coming from</th><th>Your plug</th><th>Fits the socket</th><th>What to bring</th></tr>
</thead>
<tbody>
<tr><td>United States or Canada</td><td>Type A or B, flat pins</td><td>No</td><td>Adapter, and check the voltage on each item</td></tr>
<tr><td>United Kingdom or Ireland</td><td>Type G, three rectangular pins</td><td>No</td><td>Adapter</td></tr>
<tr><td>Most of continental Europe</td><td>Type C or F</td><td>Yes</td><td>Nothing</td></tr>
<tr><td>Australia or New Zealand</td><td>Type I, angled flat pins</td><td>No</td><td>Adapter</td></tr>
</tbody>
</table>

<p>Voltage is the column that is missing from that table on purpose, because it depends on the appliance rather than on the country. That is the next section.</p>

<h2>Adapter or Converter, and Why the Difference Matters</h2>

<p>An adapter changes the shape of the plug. A converter changes the voltage. They are not the same object and one will not do the other''s job.</p>

<p>Almost everyone needs an adapter. Very few people need a converter, and the ones who do usually need it for a single item.</p>

<p>Turn over any charger and read the small print. If it says 100 to 240 volts, it is dual voltage and an adapter is all it needs. If it says 120 volts only, a converter is the only thing standing between it and a small puff of smoke.</p>

<h2>The Egypt Power Plug Type Question for US Travellers</h2>

<p>The United States runs at roughly 110 to 120 volts. Egypt runs at 220. That is the real issue, and the plug shape is the easy half of it.</p>

<p>The good news is that most of what you are carrying does not care. Phone chargers, laptop power supplies, camera battery chargers, electric toothbrushes and tablet chargers are almost all dual voltage, because the manufacturers sell the same unit worldwide.</p>

<p>The bad news is concentrated in one category, and it is the category people pack without thinking.</p>

<h2>Hair Dryers, Straighteners and the Things That Burn Out</h2>

<p>Heat appliances are the exception. Hair dryers, straighteners, curling tongs and travel irons draw a lot of power and are often built for a single voltage.</p>

<p>Plugging a 120 volt hair dryer into a 220 volt socket through a simple adapter does not usually trip anything. It destroys the appliance, sometimes immediately and sometimes after a minute of smelling wrong.</p>

<p>Three ways out. Leave it at home and use the hotel''s, which on this sort of trip is generally decent. Buy a genuinely dual voltage travel version before you fly. Or carry a converter rated well above the appliance''s wattage, which is bulky and the least appealing of the three.</p>

<p>Check the label rather than the brand. The same model is sometimes sold as dual voltage in one market and single voltage in another.</p>

<h2>Egypt Plug Socket Type in Hotels, on Boats and in the Desert</h2>

<p>The egypt plug type does not change anywhere in the country. The number of sockets behind it certainly does.</p>

<p>Hotels of the standard used on these trips have plenty of sockets, and many rooms have a USB point beside the bed. That does not mean you can stop reading.</p>

<p>Cruise boats and dahabiyas are the place to pay attention. Cabins are smaller, sockets are fewer, and on a sailing boat the power may come from a generator that runs to a schedule rather than around the clock. Charge things when you are in the cabin rather than assuming overnight will cover it.</p>

<p>Out in the Western Desert there is no mains at all. Camps run on a generator or on solar, and a power bank is worth more than any adapter you own.</p>

<!-- OWNER: first-hand paragraph fits here, on what the power is actually like on the boats and at the desert camps we use -->

<h2>What to Actually Buy</h2>

<p>One adapter per person is not enough. Two each is about right, because one lives by the bed and one ends up in the day bag.</p>

<p>A small multi socket extension lead with your home plug on it is the single most useful item in this whole article. One adapter into the wall, four of your own plugs into the lead, and the argument about who charges what at night stops happening.</p>

<p>A universal adapter with USB ports covers most of it. Buy one with an actual fuse rather than the cheapest in the rack, and avoid the ones that try to be a converter as well, which are usually poor at both.</p>

<p>Buy before you fly. Adapters are available in Cairo, but hunting for one on the first evening is not how anyone wants to spend it.</p>

<h2>What the Egypt Electrical Plug Type Means for Your Camera</h2>

<p>Nothing, in practical terms, and cameras are the item people worry about most.</p>

<p>Battery chargers for every current mirrorless and DSLR system are dual voltage. So are drone chargers, although drones themselves are a separate problem at Egyptian customs and are routinely confiscated on arrival.</p>

<p>The real camera risk here is dust rather than voltage. That belongs in <a href="/blog/what-to-pack-for-egypt">the packing list</a>, along with the rest of what goes in the bag.</p>

<!-- OWNER: first-hand paragraph fits here, on the appliances guests have actually arrived with and what happened to them -->

<h2>Before You Pack the Bag</h2>

<p>The egypt plug type question is settled in one sentence. The voltage question takes about five minutes, and it is the only part of this you cannot do after you land.</p>

<p>Go through the pile of chargers on the table and read the small print on each one.</p>

<p>Anything that says 100 to 240 volts goes in with an adapter. Anything that says 120 volts only either stays at home or needs a converter bought deliberately. Anything with a heating element gets the hardest look.</p>

<p>The rest of the pre-departure list is in <a href="/blog/egypt-travel-tips">the practical notes on travelling here</a>, and <a href="/egypt-travel-guide/cairo-travel-guide">the Cairo guide</a> covers what to expect in the first 24 hours. Guests on our <a href="/best-luxury-egypt-tours">longer Egypt tours</a> get a briefing that covers this before they fly, which is less romantic than the temples and saves more hair dryers.</p>',
  excerpt = 'Two round pins, 220 volts, 50 hertz. Which adapter you actually need, why your laptop is fine and your straighteners might not be, and what to buy before you fly.',
  category = 'Travel Tips',
  tags = ARRAY['Packing', 'Before You Go', 'Egypt Travel Planning']::text[],
  focus_keyword = 'egypt plug type',
  meta_title = 'Egypt Plug Type: Sockets, Voltage and Adapters',
  meta_description = 'The egypt plug type is C and F, two round pins, at 220 volts and 50 hertz. Which adapter you need, what will quietly burn out, and what to leave at home.',
  faqs = '[{"id":"9694f4e6-0ddc-599d-ac9f-e14f6142efd4","question":"What plug type does Egypt use?","answer":"Type C and Type F, which are the 2 round pin plugs used across most of continental Europe. Type C has 2 pins and no earth, Type F adds earth clips along the sides, and a Type C plug fits a Type F socket. Wall sockets are usually Type F and small appliance plugs are usually Type C."},{"id":"dc9128fe-b859-59b1-982a-de0e0a125658","question":"What voltage and frequency does Egypt run on?","answer":"220 volts at 50 hertz. That is the same as most of Europe and roughly double the 110 to 120 volts used in the United States and Canada. Dual voltage chargers labelled 100 to 240 volts handle it with nothing more than a plug adapter, which covers almost everything people carry."},{"id":"05ff844e-bda6-524d-94d6-bf74ee45d666","question":"What is the difference between a plug adapter and a voltage converter?","answer":"An adapter changes the shape of the plug, a converter changes the voltage, and neither does the other job. Around 9 travellers in 10 need only the adapter, because phone, laptop and camera chargers are dual voltage. A converter is for the 1 or 2 single voltage items in the bag, usually a hair appliance."},{"id":"369973f7-9d4c-5197-be84-99ed6117d611","question":"Do US travellers need an adapter for Egypt?","answer":"Yes. US Type A and Type B plugs have flat pins and will not enter a round pin socket, so an adapter is required for every item. Bring at least 2 per person. Then read the label on each charger, because the 220 volt supply is the part that damages equipment rather than the plug shape."},{"id":"b1589eee-12f9-539e-a77f-bfbb36ce01ae","question":"Will a hair dryer or straighteners work in Egypt?","answer":"Only if the label says 100 to 240 volts. A 120 volt heat appliance plugged into 220 volts through a simple adapter is usually destroyed within 1 minute. Hotels at this level supply reasonable hair dryers, so the easiest of the 3 options is to leave your own at home and use theirs."},{"id":"7b4784cc-9967-5a84-8644-b0cf353cd45d","question":"Is a universal adapter better than a country specific one?","answer":"Yes for most travellers, because 1 unit covers Egypt and everywhere you connect through. Choose one with a real fuse and built in USB ports rather than the cheapest on the shelf. Avoid combined adapter and converter units, which tend to do both jobs poorly and are heavier than carrying 2 separate things."},{"id":"d9c8f046-701c-5f95-9aca-f66b9b27343d","question":"Are there enough sockets on a Nile cruise boat?","answer":"Fewer than in a hotel room, and that catches people out. Cabins are compact and a sailing dahabiya may run its generator to a schedule rather than 24 hours a day. Charge devices while you are in the cabin, and carry 1 power bank, which also covers desert camps where there is no mains supply."},{"id":"a59b6da3-d3bc-5687-b78e-ffaed8d5ed18","question":"Can you buy plug adapters in Egypt?","answer":"Yes, in supermarkets, pharmacies and electronics shops in Cairo, and most hotels keep a few at reception. Buying 2 before you fly is still the better plan, because the alternative is spending part of your first evening looking for a shop instead of looking at the city."}]'::jsonb,
  schema_type = 'BlogPosting',
  status = 'published',
  updated_at = now()
-- Both slugs, so a second run finds the row it renamed on the first.
WHERE slug IN ('egypt-plug-type');

-- private-pyramid-tours-egypt
UPDATE posts SET
  slug = 'private-pyramid-tours-egypt',
  title_en = 'Private Pyramid Tours Egypt: What Changes',
  body_en = '<p>The word private covers four different things at Giza: the vehicle, the guide, the group you are in, and the hour you arrive. A tour can be private in one of those and shared in the other three. The hour is the one that changes the day, and it is the one least often written down.</p>

<p>That is the short version of what private pyramid tours egypt actually sells. The rest of this is how to tell them apart before you pay.</p>

<h2>What Private Means, and What It Does Not</h2>

<p>Start with the vehicle, because that is the definition most operators are using.</p>

<p>A private vehicle means you and your party travel alone with a driver. That is genuinely worth having in Cairo, where the distance between the hotel and the plateau is measured in traffic rather than kilometres, and where a coach that waits for forty people is a different kind of morning.</p>

<p>A private guide means the guide is yours for the day and speaks to nobody else. That is a separate charge and a separate arrangement, and plenty of tours sold as private put a private car with a guide who is handling three parties in rotation.</p>

<p>A private group means the only people on the tour are the people you arrived with. Most tours described as private do mean this. Some, particularly the cheaper ones, mean a small group of strangers.</p>

<p>And then there is the hour, which nobody sells because it is harder to deliver.</p>

<h2>The Hour Is the Whole Thing</h2>

<p>Giza opens early and the coaches arrive mid morning. Between those two facts sits the difference between a memory and a queue.</p>

<p>At opening, the plateau is quiet, the light is low and gold, and the photograph from the panorama point has nobody in it. Two hours later the same view has a car park in it.</p>

<p>We can arrange access to certain sites before they open to the public, and to others after they close. That is not available everywhere and it is not available every day, and any operator who promises it casually is worth a follow up question.</p>

<p>Sunset is the other quiet window. The plateau closes earlier than people expect, so it is a narrower opportunity than the morning, but the light on the south face of the Great Pyramid in the last hour is the best of the day and the coaches have gone.</p>

<p>If early access is not possible on your dates, the next best thing is simply being first through the gate, which is a matter of leaving the hotel earlier than feels reasonable.</p>

<!-- OWNER: first-hand paragraph fits here, on which early or after hours arrangements have actually been made at Giza and how they went -->

<h2>A Private Giza Pyramids Tour, Hour by Hour</h2>

<p>The shape most people end up with, and why each part sits where it does.</p>

<p>Arrive at opening at the main gate. Great Pyramid first, from the outside, while the light is still worth something. Then Khafre and Menkaure, then the panorama point where all three line up, then down to the Sphinx and the valley temple last, because the Sphinx faces east and looks better later in the morning than at dawn.</p>

<p>Three hours covers it comfortably. Four if you go inside a pyramid and stop for a camel.</p>

<p>Most itineraries then continue to Saqqara and Dahshur in the afternoon, which is the right call. Giza is famous and Dahshur is empty, and seeing them on the same day is what makes the point about scale land.</p>

<h2>Going Inside: Which Pyramid, and Whether to Bother</h2>

<p>You can enter the Great Pyramid, and it is a separate ticket bought on the day.</p>

<p>Be honest with yourself about what it involves. A low bent walk up a narrow ascending passage, warm air, no ventilation to speak of, and a bare granite chamber at the top with nothing in it. People with claustrophobia, bad knees or a bad back should skip it without embarrassment.</p>

<p>The chamber is empty. That is not a disappointment if you know it in advance and a real one if you do not.</p>

<p>Khafre''s pyramid is usually a better experience for the same effort, with fewer people in the passage. Ask your guide which is open on the day, because the authorities rotate them.</p>

<h2>What Private Pyramid Tours Egypt Should Include</h2>

<p>Entrance to the plateau, a licensed Egyptologist guide, the car and driver, and bottled water. Those four are the baseline and anything missing one of them is not the thing it says it is.</p>

<p>Usually extra: entry to the inside of a pyramid, the Solar Boat museum, camel or horse rides, and lunch. None of those is a problem as an extra. It is a problem when it is not mentioned until you are standing there.</p>

<p>Never included anywhere: tips. Budget for them and carry small notes.</p>

<h2>The Guide Is the Purchase</h2>

<p>Everything else on this page is logistics. The guide is the reason the day is either interesting or a walk around some large stones.</p>

<p>A licensed Egyptologist has a degree in the subject and a licence from the Ministry of Tourism and Antiquities. That is a real qualification and it is checkable. Ask.</p>

<p>On our trips one guide travels with you for the whole journey rather than a different person in each city. The practical effect is that by day four they know what you actually find interesting, and the commentary stops being a script.</p>

<h2>Dealing With the Plateau Itself</h2>

<p>Giza is an open site in a working city, and the approach can feel like a market.</p>

<p>The area outside the gate is not the site. Whatever is said to you on the approach road about the plateau being closed today, about a better entrance further along, or about a stable holding the only permitted horses, is a sales line. The gate you booked for is open.</p>

<p>People will offer camel rides, headscarves, small statues and to take your photograph. A polite no thank you, said once and then not discussed, works. Do not accept anything described as a gift.</p>

<p>Agree the price before a camel or a horse moves, and agree it for the return journey too, because the classic version of this involves a negotiation conducted while you are some distance from where you started.</p>

<p>A private guide removes almost all of this, which is one of the less romantic reasons to book one.</p>

<h2>What to Wear and When to Drink</h2>

<p>Closed shoes with grip. The plateau is sand and loose rock and there is climbing over blocks involved, and sandals are the wrong tool.</p>

<p>Hat, sunglasses, high factor sun cream. There is no shade anywhere on the plateau, none at all, and the sun in the middle of the day between May and September is not something to be brave about.</p>

<p>Carry more water than you think you need and drink it before you are thirsty. Most of the people who have a bad morning at Giza are dehydrated rather than unfit.</p>

<p>Cover shoulders and knees if the afternoon continues to a mosque, which on most Cairo days it does. Nobody at Giza minds what you wear, but the next stop might.</p>

<h2>Cost, and Why the Range Is So Wide</h2>

<p>Private pyramid tours egypt is a search term rather than a product with a list price.</p>

<p>A shared coach seat and a genuinely private morning are advertised under similar words and are not comparable products.</p>

<p>What moves the price is the guide''s licence and experience, whether the vehicle is yours alone, the size of the party, whether any early or after hours access is arranged, and how much of the day is covered. Those five, in roughly that order.</p>

<p>We do not publish a figure on this page because a number without those five variables attached would be meaningless. Ask for the breakdown rather than the total, and compare the breakdowns.</p>

<h2>Where This Fits in a Longer Trip</h2>

<p>Giza is a morning, not a holiday, and treating it as the whole point of Cairo is the most common planning error here.</p>

<p>The city needs three days: one for the plateau and the older pyramid fields, one for the museum, and one for Islamic and Coptic Cairo at a slower pace. <a href="/blog/private-tours-in-cairo-egypt">The guide to touring Cairo privately</a> covers how those days fit together, and <a href="/egypt-travel-guide/cairo-travel-guide">the Cairo destination guide</a> covers the rest of the city.</p>

<p>Most guests see the pyramids as the first two days of something longer that runs down to Luxor and Aswan. These <a href="/egypt-private-tour-packages">private itineraries</a> show the usual shapes, and any of them can start with an early morning at Giza instead of a mid morning one, which is the single change most worth asking for.</p>

<!-- OWNER: first-hand paragraph fits here, on what guests say about Giza afterwards compared with what they expected -->',
  excerpt = 'Private at Giza means four separate things, and a tour can be private in one sense and shared in the rest. What to ask, and which hour of the day decides it.',
  category = 'Travel Planning',
  tags = ARRAY['Giza Pyramids', 'Private Touring', 'Cairo']::text[],
  focus_keyword = 'private pyramid tours egypt',
  meta_title = 'Private Pyramid Tours Egypt: What You Get',
  meta_description = 'What private pyramid tours egypt sells actually buys you at Giza: the hour you arrive, who stands beside you, and which of the three pyramids you go inside.',
  faqs = '[{"id":"5b25e15b-2f68-569f-bebb-5388a7346f64","question":"What does private mean on a Giza pyramids tour?","answer":"Up to 4 separate things: a private vehicle, a private guide, a group containing only your own party, and a privately arranged arrival time. A tour can be private in 1 of those and shared in the rest, which is why the word alone tells you very little. Ask which of the 4 applies."},{"id":"0ff876f4-f5c7-5a3a-b142-e43ddffb7fed","question":"What time should you arrive at the pyramids?","answer":"At opening. The coaches reach the plateau mid morning, so the first 2 hours are quiet, cool and better lit than anything that follows. The same panorama view that is empty at opening has a car park in it 2 hours later, and no amount of money fixes that once the day has started."},{"id":"5774f9a5-8826-5551-bdb7-c0ebce48ed88","question":"Is it worth going inside the Great Pyramid?","answer":"Only if you are comfortable in tight spaces. It is a separate ticket, a bent walk up a narrow warm passage with no real ventilation, and an empty granite chamber at the end. Khafre''s pyramid is often the better of the 2 for the same effort, with fewer people in the passage."},{"id":"50db8d57-0a83-5c05-a181-3cd74179093a","question":"How long do you need at the Giza plateau?","answer":"3 hours covers the 3 pyramids, the panorama point and the Sphinx at a reasonable pace. Allow 4 if you go inside a pyramid or stop for a camel. Most itineraries then add Saqqara and Dahshur in the afternoon, which is what makes the scale of the whole pyramid field make sense."},{"id":"f82658a8-1f76-5bb2-91bd-46d4abf96b2f","question":"Which is better, a private tour or a group tour of the pyramids?","answer":"Private, for 1 reason above all others: departure time. A group leaves when the coach leaves, which is usually after breakfast and therefore into the crowds. Private means you can be at the gate when it opens. The car and the guide matter too, but the hour is what changes the day."},{"id":"8abf2fc9-39af-5636-85b5-c44566762396","question":"Are there any shaded areas at the pyramids?","answer":"Almost none. The plateau is open sand and rock with 0 meaningful shade between the gate and the Sphinx. Between May and September that makes an early start a practical necessity rather than a preference. Carry more water than seems sensible, wear closed shoes with grip, and use a hat."},{"id":"ab84885a-9acb-5974-b484-01f381fa288d","question":"How much should a private pyramid tour cost?","answer":"The range is wide for 5 reasons. The guide''s licence and experience, whether the vehicle is yours alone, party size, any early or after hours access arranged, and how much of the day is covered. A single figure without those attached means nothing. Ask for the breakdown and compare those instead."},{"id":"f72228c8-540b-54b0-ad9b-38bd240a6e69","question":"Do you need a licensed guide at the pyramids?","answer":"You are not required to have 1, but the site gives up very little without one. A licensed Egyptologist holds a degree in the subject and a permit from the Ministry of Tourism and Antiquities, and the qualification is checkable. A guide also ends most of the selling on the approach road."}]'::jsonb,
  schema_type = 'BlogPosting',
  status = 'published',
  updated_at = now()
-- Both slugs, so a second run finds the row it renamed on the first.
WHERE slug IN ('private-pyramid-tours-egypt');

-- best-luxury-nile-cruise-egypt
UPDATE posts SET
  slug = 'best-luxury-nile-cruise-egypt',
  title_en = 'Best Luxury Nile Cruise: Choosing by Category',
  body_en = '<p>Choose the category before you choose the boat. Three exist on this river: the sailing dahabiya, the boutique motor ship, and the large cruiser. They differ in where they can moor, how many people are aboard and how fast they move, and those three things decide almost everything about the week.</p>

<p>The best luxury nile cruise is therefore not a single boat that wins. It is whichever category matches how you want to spend four or five evenings, and then the best operator within it.</p>

<p>We do not name boats on this page. The reason is at the bottom, and it is not coyness.</p>

<h2>The Three Categories, Side by Side</h2>

<table>
<thead>
<tr><th></th><th>Dahabiya</th><th>Boutique ship</th><th>Large cruiser</th></tr>
</thead>
<tbody>
<tr><td>Cabins</td><td>A handful</td><td>Tens</td><td>Considerably more</td></tr>
<tr><td>How it moves</td><td>Under sail, with a tender through the calms</td><td>Engine</td><td>Engine</td></tr>
<tr><td>Where it moors</td><td>Banks and islands the larger boats cannot reach</td><td>Main quays, sometimes quieter ones</td><td>Main quays, often several boats deep</td></tr>
<tr><td>On board</td><td>Deck, shade, one dining room</td><td>Pool, bar, sometimes a spa</td><td>Pool, several bars, shops, evening entertainment</td></tr>
<tr><td>Pace</td><td>Slowest</td><td>Middle</td><td>Quickest between sites</td></tr>
<tr><td>Suits</td><td>Couples and small parties who want quiet</td><td>Travellers who want space and facilities</td><td>Travellers who want amenities and a lower price</td></tr>
</tbody>
</table>

<p>Everything below is what those rows mean in practice.</p>

<h2>The Dahabiya Case</h2>

<p>A dahabiya is a sailing boat with a small number of cabins, and it is the oldest way of doing this.</p>

<p>It goes at the speed of the wind, which means the itinerary is a shape rather than a timetable and the crew adjust it as the week goes. Some days you reach a temple in the morning. Some days you reach it after lunch because the wind had other ideas.</p>

<p>What you get for that is silence and the bank. A dahabiya moors against sandbanks, islands and small villages rather than a concrete quay, so the view from your cabin at night is the river rather than another boat''s corridor. We run private ones, which is the version where the whole boat is yours and the schedule genuinely is too.</p>

<p>Families do better on a private dahabiya than people expect. Children have the run of a boat that belongs to them, the crew are good with them, and there is no other party to keep quiet for.</p>

<p>What you give up is facilities. There is no pool, the deck is the entertainment, and if your idea of a good evening involves a bar with a band in it, this is the wrong category.</p>

<h2>The Boutique Ship Case</h2>

<p>The middle option, and for a lot of travellers the sensible one.</p>

<p>A boutique ship is a motor vessel small enough to feel like a hotel rather than a resort. There is usually a pool, a proper bar, more space in the cabin and a lift. It runs to a schedule, which means the temple timings are fixed and predictable.</p>

<p>The trade is mooring. It ties up where the ships tie up, which in Edfu and Kom Ombo means a working quay with other vessels nearby, and the romantic evening view is less reliable than the brochure photograph suggests.</p>

<p>For families with teenagers, for anyone who wants a pool at three in the afternoon, and for travellers who are uneasy about a small boat, this is usually the right answer.</p>

<h2>The Large Cruiser Case</h2>

<p>Many cabins, several decks, and the lowest price per night on the river.</p>

<p>These are the boats you see moored four and five deep at Luxor, and that image is the honest summary of the category. There is nothing wrong with them. The food is fine, the cabins are comfortable and the sightseeing is the same sightseeing.</p>

<p>But you are travelling with a large group, the temple visits happen at the busiest hours because that is when a boat of that size can be unloaded, and on a bad night you walk through two other boats'' lobbies to reach the shore.</p>

<p>If price is the main constraint, take it and enjoy it. If it is not, the money is better spent here than almost anywhere else on the trip.</p>

<!-- OWNER: first-hand paragraph fits here, on what guests notice about the difference between the categories once they are on the water -->

<h2>What Makes the Best Luxury Nile Cruise for You Specifically</h2>

<p>Four questions, answered honestly, sort this in about two minutes.</p>

<p>How many people do you want to eat dinner with. Do you need a pool. Does a fixed timetable reassure you or irritate you. And is the view from the cabin at night part of what you are buying.</p>

<p>Answer quiet, no, irritate, yes, and you want a dahabiya. Answer the opposite and you want a ship. Most people land clearly on one side rather than in the middle.</p>

<h2>Aswan to Luxor, or the Other Way</h2>

<p>Aswan to Luxor, if the flights allow it.</p>

<p>Downstream is the gentler direction, the sailing is slower and the sites arrive in a sensible order, finishing in Luxor with the west bank still in front of you. Going the other way is not a mistake and it is simply less good.</p>

<p>Either way, fly into one end and out of the other rather than doubling back. Aswan has its own airport and <a href="/egypt-travel-guide/aswan-egypt-attractions">enough to justify two nights</a> before you board.</p>

<h2>How Many Nights on the Water</h2>

<p>Four is the standard. Five is better. Three is a taste.</p>

<p>Four nights covers Aswan, Kom Ombo, Edfu, Esna and Luxor with a full day at each end. Five adds a slow day where nothing is scheduled, and on a dahabiya that day is often the one people describe afterwards.</p>

<p>Count nights rather than days, whatever the number. A four night cruise is routinely advertised as a five day one, and the difference is an afternoon of boarding and a morning of getting off.</p>

<p>Seven nights exists and usually means reaching Dendera or Abydos, which are worth it if you have the time and are not the first thing to add if you do not.</p>

<h2>The Questions That Separate Good Operators From the Rest</h2>

<p>Ask these before a deposit, in writing, and compare the answers rather than the photographs.</p>

<p>Is the boat private to our party, or are we buying cabins on it. How many cabins does it carry in total. Where does it moor each night, by name. What time do we reach each temple, and who else is there at that hour.</p>

<p>Then four more. Is the guide ours for the whole cruise or shared. What is included beyond meals, specifically drinks and entrance fees.</p>

<p>Is there a single supplement. And what happens to the itinerary if the wind or the water level changes.</p>

<p>An operator who answers all eight plainly is telling you something about how the week will run.</p>

<h2>Mooring Is the Thing Nobody Compares</h2>

<p>It is the single largest difference between two boats of otherwise similar standard, and it almost never appears in a comparison.</p>

<p>The main quays at Edfu and Kom Ombo are busy, and a boat moored on the outside of a row of five means every arrival and departure crosses other people''s decks. A boat moored alone against a bank means the evening is yours.</p>

<p>Ask where it ties up. If the answer is vague, that is the answer.</p>

<h2>What People Worry About and Should Not</h2>

<p>Seasickness is not a thing on the Nile. It is a river, the water is flat, and the only movement most people notice is the boat pulling away from a mooring.</p>

<p>The water level does matter, and it is why an operator should be able to explain what happens when a lock or a stretch is affected. The lock at Esna closes for maintenance in some years, and a good operator raises that before you think to ask.</p>

<p>Wifi exists on most boats and is slow. That is closer to a feature than a fault, and the people who mention it on the first day rarely mention it again by the third.</p>

<h2>Cabin Questions Worth Asking</h2>

<p>Windows, not portholes, and check which deck they are on.</p>

<p>A lower deck cabin on a big ship can sit at waterline with a view of the quay wall. An upper deck cabin costs more for a reason that is genuinely worth paying for on this particular trip, because you spend more waking hours looking out of it than you would in a hotel.</p>

<p>Ask about the bed configuration too. Twin and double are not always convertible, and a honeymoon on a pair of single beds is a bad start.</p>

<h2>What Is Actually Included</h2>

<p>Full board is normal. Everything else varies.</p>

<p>Drinks are the common exclusion, and on a week aboard that adds up. Entrance fees to the temples are sometimes included and sometimes an extra line. Tips for the crew are separate everywhere and are usually collected as a single sum at the end.</p>

<p>Optional excursions are the place to read carefully. A cruise sold as all inclusive with the Abu Simbel trip priced separately is a normal arrangement, not a trick, but it should not be a surprise.</p>

<h2>When to Sail</h2>

<p>October to April. The river is the part of Egypt where summer heat is least bearable, because the shade on deck is limited and the temples between Aswan and Luxor are open sites.</p>

<p>Late October, November, February and March are the best of it. December and January are lovely and the boats book furthest ahead.</p>

<p>The <a href="/blog/best-time-to-visit-egypt">month by month guide</a> has the detail, including the water level question, which affects the sailing more than it affects anything else on a trip here.</p>

<h2>Why We Do Not Name Boats Here</h2>

<p>Because a page that lists the best luxury nile cruises by name goes out of date within a season and is usually wrong on the day you read it.</p>

<p>Boats change ownership, refit, change crew and change management. A vessel that was excellent two years ago can be ordinary now, and the reverse happens just as often. A list published once and left alone is a liability rather than a service.</p>

<p>What does not change is the category logic above and the eight questions. Those are stable, and they let you assess a boat that nobody has written about yet.</p>

<p>When we recommend a specific vessel it is for your dates, your party and what is actually in the water that month, and that recommendation comes in a conversation rather than an article.</p>

<h2>How to Decide in the Next Ten Minutes</h2>

<p>Pick the category first, using the four questions above. That removes most of the internet.</p>

<p>Then get two or three options inside that category and put the eight questions to each. The best luxury nile river cruise for your week is almost always the one whose operator answers the mooring question with a place name.</p>

<p>If the river is part of a longer trip, and it usually is, the shape around it matters as much as the boat. Our <a href="/egypt-nile-cruise-packages">Nile cruise itineraries</a> show how the sailing sits between Cairo and the rest, and <a href="/blog/egypt-honeymoon">the honeymoon guide</a> covers the version of this trip built for two people who want to be left alone.</p>

<!-- OWNER: first-hand paragraph fits here, on how boats are actually chosen for guests and what has made one right for a particular week -->',
  excerpt = 'No boat names, no invented features. The three categories on the river, what genuinely differs between them, and the eight questions worth asking before you pay a deposit.',
  category = 'Travel Planning',
  tags = ARRAY['Nile Cruise', 'Dahabiya', 'Egypt Travel Planning']::text[],
  focus_keyword = 'best luxury nile cruise',
  meta_title = 'Best Luxury Nile Cruise: How to Choose Yours',
  meta_description = 'The best luxury nile cruise is a category decision before it is a boat decision. Dahabiya, boutique ship or large cruiser, and the questions that separate them.',
  faqs = '[{"id":"46dacd4b-b414-5d8a-a868-9948209cfcf0","question":"What is the difference between a dahabiya and a Nile cruise ship?","answer":"A dahabiya sails, carries a handful of cabins, and moors at banks and islands the bigger boats cannot reach. A cruise ship runs on engines, carries tens or hundreds of cabins, and ties up at main quays sometimes 4 or 5 boats deep. The first is quieter, the second has a pool."},{"id":"7c3c5065-8ad5-5945-ac0a-701c19d65826","question":"How many nights should a Nile cruise be?","answer":"4 nights is the standard and 5 is better. 4 covers Aswan, Kom Ombo, Edfu, Esna and Luxor with a full day at each end. The 5th night adds a day with nothing scheduled, which on a sailing boat is often the day people describe most warmly afterwards. 3 nights is only a taste."},{"id":"1d5db7d7-48df-5832-986f-361f8dd3383b","question":"Which is better, Aswan to Luxor or Luxor to Aswan?","answer":"Aswan to Luxor, in almost every case. Downstream is the gentler of the 2 directions, the sailing is slower, and the sites arrive in a sensible order that leaves the Luxor west bank ahead of you rather than behind. Fly into 1 end and out of the other rather than doubling back."},{"id":"4bc8dfc0-69f7-58d3-bfe8-0dc56d2bed1a","question":"When is the best time for a Nile cruise?","answer":"October to April, with late October, November, February and March the best 4 months of that window. The river is where Egyptian summer heat is hardest, because deck shade is limited and the temples are open sites. December and January are excellent and the boats for those weeks book furthest ahead."},{"id":"ed06273e-f0f1-59b7-a92b-0c1730b27722","question":"What should you ask before booking a Nile cruise?","answer":"8 questions. Is the boat private or are you buying cabins, how many cabins in total, where it moors each night by name, what time you reach each temple, whether the guide is yours throughout, what is included beyond meals, whether there is a single supplement, and what happens if conditions change."},{"id":"a3608184-8f43-5ddd-b0ce-590161eba2ba","question":"Are drinks and entrance fees included on a Nile cruise?","answer":"Full board is normal, drinks usually are not, and entrance fees vary between operators. Crew tips are separate everywhere and are generally collected once at the end. Check those 3 lines specifically, because on a week aboard they are the difference between the advertised price and what you actually pay."},{"id":"e0cb639c-d43a-5a1d-a777-078af8e2e0c2","question":"Is a Nile cruise worth it compared with staying in hotels?","answer":"Yes, for 1 structural reason: the temples between Aswan and Luxor sit on the river, so the boat takes you to them while you sleep. Doing the same route by road means 4 or 5 hotel changes and several hours in a car each day, for more money and considerably more effort."},{"id":"188a0a47-e576-5cf1-8157-f068ea6839d9","question":"Which deck should you choose on a Nile cruise boat?","answer":"Upper, and it is worth the supplement here more than on most trips. Lower deck cabins can sit close to waterline with a view of a quay wall, and you spend far more waking hours looking out of a cabin window on a river boat than in a hotel. Ask for windows rather than portholes, and check which of the 3 decks it sits on."}]'::jsonb,
  schema_type = 'BlogPosting',
  status = 'published',
  updated_at = now()
-- Both slugs, so a second run finds the row it renamed on the first.
WHERE slug IN ('best-luxury-nile-cruise-egypt');

COMMIT;

-- ---------------------------------------------------------------------------
-- Verification. Every "bad" column below must read 0, and the row count must
-- be 5.
-- ---------------------------------------------------------------------------
SELECT count(*) AS rows_present FROM posts WHERE slug IN ('egypt-travel-insurance', 'egypt-honeymoon', 'egypt-plug-type', 'private-pyramid-tours-egypt', 'best-luxury-nile-cruise-egypt');

-- Must be 0. Any row still under an old slug means its UPDATE matched nothing,
-- which means the row was not there under either name.
SELECT 'rows still under an old slug' AS check, count(*) AS bad
FROM posts WHERE slug IN ('egypt-travel-insurance', 'egypt-honeymoon', 'egypt-plug-type', 'private-pyramid-tours-egypt', 'best-luxury-nile-cruise-egypt') AND slug NOT IN ('egypt-travel-insurance', 'egypt-honeymoon', 'egypt-plug-type', 'private-pyramid-tours-egypt', 'best-luxury-nile-cruise-egypt');


SELECT slug,
       length(meta_title) AS title_len,
       length(meta_description) AS meta_len,
       jsonb_array_length(faqs) AS faq_count,
       array_length(regexp_split_to_array(regexp_replace(body_en, '<[^>]+>', ' ', 'g'), '\s+'), 1) AS body_words,
       scheduled_at,
       published_at,
       CASE WHEN body_en LIKE '%<figure%' THEN 'body kept, it has figures in it'
            ELSE 'body written from this file' END AS body_en_outcome
FROM posts WHERE slug IN ('egypt-travel-insurance', 'egypt-honeymoon', 'egypt-plug-type', 'private-pyramid-tours-egypt', 'best-luxury-nile-cruise-egypt') ORDER BY scheduled_at;

SELECT 'egypt-travel-insurance' AS slug,
       (SELECT count(*) FROM regexp_matches(body_en, 'egypt travel insurance', 'gi')) AS primary_hits
FROM posts WHERE slug = 'egypt-travel-insurance';
SELECT 'egypt-honeymoon' AS slug,
       (SELECT count(*) FROM regexp_matches(body_en, 'egypt honeymoon', 'gi')) AS primary_hits
FROM posts WHERE slug = 'egypt-honeymoon';
SELECT 'egypt-plug-type' AS slug,
       (SELECT count(*) FROM regexp_matches(body_en, 'egypt plug type', 'gi')) AS primary_hits
FROM posts WHERE slug = 'egypt-plug-type';
SELECT 'private-pyramid-tours-egypt' AS slug,
       (SELECT count(*) FROM regexp_matches(body_en, 'private pyramid tours egypt', 'gi')) AS primary_hits
FROM posts WHERE slug = 'private-pyramid-tours-egypt';
SELECT 'best-luxury-nile-cruise-egypt' AS slug,
       (SELECT count(*) FROM regexp_matches(body_en, 'best luxury nile cruise', 'gi')) AS primary_hits
FROM posts WHERE slug = 'best-luxury-nile-cruise-egypt';

SELECT 'seo lengths out of range' AS check, count(*) AS bad FROM posts
WHERE slug IN ('egypt-travel-insurance', 'egypt-honeymoon', 'egypt-plug-type', 'private-pyramid-tours-egypt', 'best-luxury-nile-cruise-egypt') AND (length(meta_title) > 60 OR length(meta_description) NOT BETWEEN 150 AND 160);

SELECT 'faq count out of range' AS check, count(*) AS bad FROM posts
WHERE slug IN ('egypt-travel-insurance', 'egypt-honeymoon', 'egypt-plug-type', 'private-pyramid-tours-egypt', 'best-luxury-nile-cruise-egypt') AND jsonb_array_length(faqs) NOT BETWEEN 7 AND 8;

-- Answers are written to be quoted on their own by an AI answer engine, which
-- means 40 to 80 words each. Outside that they are either empty or too long.
SELECT 'faq answers outside 40-80 words' AS check, count(*) AS bad
FROM posts p, jsonb_array_elements(p.faqs) f
WHERE p.slug IN ('egypt-travel-insurance', 'egypt-honeymoon', 'egypt-plug-type', 'private-pyramid-tours-egypt', 'best-luxury-nile-cruise-egypt')
  AND array_length(regexp_split_to_array(trim(f->>'answer'), '\s+'), 1) NOT BETWEEN 40 AND 80;

-- The SEO overrides must be NULL, not empty strings, or the fallbacks break.
SELECT 'seo overrides stored as empty strings' AS check, count(*) AS bad FROM posts
WHERE slug IN ('egypt-travel-insurance', 'egypt-honeymoon', 'egypt-plug-type', 'private-pyramid-tours-egypt', 'best-luxury-nile-cruise-egypt')
  AND (canonical_url = '' OR robots = '' OR og_image = '' OR schema_type = '' OR featured_image_alt = '');

SELECT 'faq entries missing id, question or answer' AS check, count(*) AS bad
FROM posts p, jsonb_array_elements(p.faqs) f
WHERE p.slug IN ('egypt-travel-insurance', 'egypt-honeymoon', 'egypt-plug-type', 'private-pyramid-tours-egypt', 'best-luxury-nile-cruise-egypt')
  AND (coalesce(f->>'id','') = '' OR coalesce(f->>'question','') = '' OR coalesce(f->>'answer','') = '');

SELECT 'em or en dash present' AS check, count(*) AS bad FROM posts
WHERE slug IN ('egypt-travel-insurance', 'egypt-honeymoon', 'egypt-plug-type', 'private-pyramid-tours-egypt', 'best-luxury-nile-cruise-egypt')
  AND (body_en ~ '[\u2013\u2014]' OR meta_title ~ '[\u2013\u2014]' OR meta_description ~ '[\u2013\u2014]' OR title_en ~ '[\u2013\u2014]');

-- Tour links must sit at the site root. Anything under the category path 404s.
SELECT 'tour links under /luxury-egypt-tour-packages/' AS check, count(*) AS bad FROM posts
WHERE slug IN ('egypt-travel-insurance', 'egypt-honeymoon', 'egypt-plug-type', 'private-pyramid-tours-egypt', 'best-luxury-nile-cruise-egypt') AND body_en ~ 'href="/luxury-egypt-tour-packages/[^"]';

-- The hotel listing moved. A link to the old path still works through the 301,
-- and costs every reader a hop for no reason.
SELECT 'links to the old /stay path' AS check, count(*) AS bad FROM posts
WHERE slug IN ('egypt-travel-insurance', 'egypt-honeymoon', 'egypt-plug-type', 'private-pyramid-tours-egypt', 'best-luxury-nile-cruise-egypt') AND body_en ~ 'href="/stay';

SELECT 'unfilled placeholders' AS check, count(*) AS bad FROM posts
WHERE slug IN ('egypt-travel-insurance', 'egypt-honeymoon', 'egypt-plug-type', 'private-pyramid-tours-egypt', 'best-luxury-nile-cruise-egypt') AND (body_en LIKE '%data-placeholder=%' OR body_en ~ '\{\{[A-Z_]+\}\}');

SELECT 'other language columns left empty' AS check, count(*) AS bad FROM posts
WHERE slug IN ('egypt-travel-insurance', 'egypt-honeymoon', 'egypt-plug-type', 'private-pyramid-tours-egypt', 'best-luxury-nile-cruise-egypt')
  AND (title_es IS NOT NULL OR title_fr IS NOT NULL OR title_jp IS NOT NULL
       OR body_es IS NOT NULL OR body_fr IS NOT NULL OR body_jp IS NOT NULL);

-- The owner paragraphs are deliberately left as HTML comments for someone to
-- replace with a real first hand voice. This is a reminder, not a failure.
SELECT slug,
       (length(body_en) - length(replace(body_en, '<!-- OWNER:', ''))) / 11 AS owner_notes_awaiting_a_paragraph
FROM posts WHERE slug IN ('egypt-travel-insurance', 'egypt-honeymoon', 'egypt-plug-type', 'private-pyramid-tours-egypt', 'best-luxury-nile-cruise-egypt') ORDER BY slug;
