-- Wave "rewrite-phase-a": 4 articles, loaded in one file.
--
--   best-time-to-visit-egypt  (best time to visit egypt)
--   luxury-egypt-tours  (luxury egypt tours)
--   do-us-citizens-need-a-visa-for-egypt becomes egypt-visa-for-us-citizens  (egypt visa for us citizens)
--   is-egypt-safe-for-american-tourists becomes is-egypt-safe-for-americans  (is egypt safe for americans)
--
-- These rows are ALREADY PUBLISHED and already indexed. This file rewrites
-- their body and their SEO fields in place. published_at is never touched, so
-- each article keeps the date it first went out, which is what its BlogPosting
-- has been telling crawlers since. updated_at carries the rewrite, and
-- dateModified follows from it.
--
-- 2 of these slugs change: do-us-citizens-need-a-visa-for-egypt to egypt-visa-for-us-citizens, is-egypt-safe-for-american-tourists to is-egypt-safe-for-americans.
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
--   best-time-to-visit-egypt
--     Winter morning light on the Giza pyramids, the best time to visit egypt for sightseeing
--   luxury-egypt-tours
--     Private guide and guests alone in a temple court at dawn on one of our luxury egypt tours
--   egypt-visa-for-us-citizens
--     US passport and boarding pass on a desk while arranging an egypt visa for us citizens
--   is-egypt-safe-for-americans
--     American visitors walking with their guide at Karnak, part of answering is egypt safe for americans
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
WHERE slug IN ('best-time-to-visit-egypt', 'luxury-egypt-tours', 'egypt-visa-for-us-citizens', 'do-us-citizens-need-a-visa-for-egypt', 'is-egypt-safe-for-americans', 'is-egypt-safe-for-american-tourists')
ORDER BY published_at NULLS LAST, slug;

BEGIN;

-- best-time-to-visit-egypt
UPDATE posts SET
  slug = 'best-time-to-visit-egypt',
  title_en = 'Best Time to Visit Egypt: A Month by Month Guide',
  body_en = '<p>October to April. If you can pick freely, November to February.</p>

<p>The best time to visit egypt is the half of the year when Upper Egypt is comfortable to walk around in. That is October through April, and the strongest weeks inside it are November, December, January and February. Summer is not impossible, but it changes what a day looks like: you are out at six and indoors by eleven.</p>

<p>Everything below is the detail behind that answer, including the weeks to avoid and the two dates worth planning around.</p>

<h2>Month by Month, at a Glance</h2>

<table>
<thead>
<tr><th>Month</th><th>Cairo, typical day</th><th>Luxor, typical day</th><th>Crowds</th><th>Verdict</th></tr>
</thead>
<tbody>
<tr><td>January</td><td>19C</td><td>23C</td><td>High to mid month, then easing</td><td>Excellent, cold at night</td></tr>
<tr><td>February</td><td>21C</td><td>25C</td><td>Moderate</td><td>Excellent</td></tr>
<tr><td>March</td><td>24C</td><td>29C</td><td>Moderate</td><td>Very good, wind possible</td></tr>
<tr><td>April</td><td>28C</td><td>35C</td><td>Easter spike</td><td>Good, warming fast</td></tr>
<tr><td>May</td><td>32C</td><td>39C</td><td>Low</td><td>Hot in the south</td></tr>
<tr><td>June to August</td><td>35C</td><td>41C and above</td><td>Low</td><td>Early starts only</td></tr>
<tr><td>September</td><td>32C</td><td>38C</td><td>Low</td><td>Still hot, improving</td></tr>
<tr><td>October</td><td>29C</td><td>34C</td><td>Building</td><td>Very good</td></tr>
<tr><td>November</td><td>24C</td><td>29C</td><td>High</td><td>Excellent</td></tr>
<tr><td>December</td><td>20C</td><td>24C</td><td>Peak from the 20th</td><td>Excellent, book early</td></tr>
</tbody>
</table>

<p>Those are typical daytime highs rather than records. Nights in Luxor and Aswan in December and January fall to single figures, which surprises people who packed for a desert.</p>

<p>Read the table for the south rather than the north. Cairo is comfortable across far more of the year than Luxor is, so the best time of year to visit egypt is really a question about how long you want to spend standing in an unshaded courtyard 700 kilometres up the river.</p>

<h2>When Is the Best Time to Visit Egypt for Weather Alone</h2>

<p>Mid November to mid February, and it is not close.</p>

<p>In those weeks Luxor sits in the mid twenties by day, the Valley of the Kings is bearable at ten in the morning rather than only at seven, and you can stand on the west bank at noon without counting the minutes. Cairo is cooler still, which matters for a day at Saqqara or a morning walking Islamic Cairo.</p>

<p>The trade is light. The sun is lower, so the great facades are lit for fewer hours, and temple interiors are darker. Bring a torch and start earlier than you think you need to.</p>

<p>The other trade is the evenings. A Nile cruise deck in January is a jumper and a blanket after sunset, not a shirt.</p>

<!-- OWNER: first-hand paragraph fits well here, on what a January morning on the west bank is actually like -->

<h2>The Best Month to Visit Egypt if You Only Get One</h2>

<p>February, narrowly.</p>

<p>It has the weather of January without the Christmas and New Year pricing that runs into the first week or so. Luxor sits around twenty five by day. The light is still low enough to be good and high enough to reach into the courts at Karnak and Medinet Habu. Half term weeks push British and European families through in the middle of the month, which is worth avoiding if you can, but the rest of it is quiet by peak season standards.</p>

<p>November is the close second and is warmer. December is the equal of both until the twentieth, after which it becomes the most expensive fortnight of the year.</p>

<h2>Summer, and Why Upper Egypt Is a Different Country</h2>

<p>Cairo in July is hot. Luxor and Aswan in July are something else.</p>

<p>Daytime temperatures above forty are normal from June to the middle of September, and the Valley of the Kings sits in a rock bowl that holds the heat. This is not a matter of discomfort. It is a real risk for anyone who is older, unfit, or arriving from a northern winter.</p>

<p>The summer itinerary works, but it is a different shape. Sites at opening, back to the hotel or the boat by eleven, the middle of the day indoors, then out again after four. You see the same things and you see them in better light at both ends.</p>

<p>The compensations are real. Prices drop, the Valley is close to empty, and the Red Sea is at its warmest. If your reason for coming is diving rather than temples, summer is a good time.</p>

<h2>October and April, the Shoulder Weeks</h2>

<p>The best months to visit egypt if you want the weather without the crowd are October and, at a push, early April.</p>

<p>October cools steadily through the month. The first week can still feel like September in the south; by the last week Luxor is in the low thirties and falling. Crowds build across the same weeks, so the earlier you go the emptier it is, and the hotter.</p>

<p>April runs the same trade in reverse, with the added complication of Easter, which moves each year and brings both international and Egyptian holiday traffic. After Easter the country empties and the temperature climbs.</p>

<h2>Cairo Runs on a Slightly Wider Calendar</h2>

<p>The capital is a couple of degrees cooler than Luxor in every month and has more indoor sightseeing, so the best time to visit cairo egypt built on the Nile stretches a little further at both ends than the window for Upper Egypt does.</p>

<p>A museum morning and an afternoon in the Khan work in May and in early October. The pyramids do not, at least not at midday.</p>

<p>Cairo has one seasonal problem the south does not: air quality. Late autumn brings still, hazy days when rice straw is burned in the Delta, and the haze can flatten photographs of the plateau for a week at a time. It passes.</p>

<h2>Ramadan, and What It Actually Changes</h2>

<p>Ramadan moves about eleven days earlier each year, so it drifts through the seasons rather than sitting in one. Check the dates for your year before you book.</p>

<p>What changes: some restaurants close during daylight, opening hours at a few sites shorten, traffic in Cairo is dreadful in the hour before sunset and empty for the hour after, and the atmosphere in the evenings is one of the best things you will see in Egypt.</p>

<p>What does not change: hotels, cruise boats, guides and drivers all work normally, and every major site stays open.</p>

<p>Travelling in Ramadan is not a mistake. It is a different trip, quieter by day and far livelier at night, and the Iftar tables set up in the street in Cairo are worth arranging your evening around.</p>

<h2>The Weeks Most People Should Avoid</h2>

<p>Three of them, for three different reasons.</p>

<p>Christmas to the first days of January: the highest prices of the year, full boats, and the Valley of the Kings at a density that changes the experience. Book eight or nine months out or go elsewhere in the calendar.</p>

<p>The week around Easter: Egyptian and European holidays overlap, and Sham el Nessim the day after Coptic Easter puts most of the country outdoors at once.</p>

<p>Mid July to the end of August in the south: see above.</p>

<!-- OWNER: first-hand paragraph fits well here, on what the west bank feels like in the last week of December -->

<h2>The Red Sea Keeps Its Own Calendar</h2>

<p>Hurghada and Marsa Alam do not follow the temple seasons. Water temperature runs from about twenty two degrees in February to twenty nine in August, air temperature is high all summer, and the diving is good year round.</p>

<p>That makes the coast the natural second half of a summer trip and a slightly cool one in January, when a five millimetre wetsuit stops being optional.</p>

<p>If the sea is the point rather than the temples, invert the usual advice: come between May and October and take the heat inland as the price.</p>

<h2>Two Dates Worth Planning Around</h2>

<p>On 22 February and 22 October the rising sun reaches down the axis of the great temple at Abu Simbel and lights the seated figures in the sanctuary. It is a genuine piece of ancient engineering and it draws a crowd to match, so it needs booking well ahead and an early start.</p>

<p>The other is the Egyptian Museum and the newer museum by the pyramids on a Friday morning, which is quieter than any other time of the week.</p>

<p>Neither is a reason to move a whole trip. Both are worth a day''s adjustment if you are already close.</p>

<p>A third, if you are in Aswan in the second half of the year: the Nile is at its fullest in September and October, which is when a felucca sits highest against the granite on the west bank and the islands are greenest. It is a small thing and it photographs beautifully.</p>

<h2>Humidity, Wind and the Things the Table Does Not Show</h2>

<p>Temperature is the headline and it is not the whole story.</p>

<p>Upper Egypt is dry. Forty degrees in Luxor with ten per cent humidity is a different experience from thirty two in a humid climate, and most people find they cope better than the number suggested. The risk is that you stop noticing how much water you are losing.</p>

<p>The coast is the reverse. Hurghada and Alexandria carry sea humidity, and an August day in Alexandria feels heavier than a hotter one inland.</p>

<p>Then there is the khamsin, a hot wind out of the south that blows for a day or two at a time between about March and May. It carries enough sand to close the horizon, flatten the light and make photography pointless. It is not dangerous where you will be and it does not happen often, but it is a reason to keep a spare afternoon in a spring itinerary rather than booking every hour of it.</p>

<p>Rain barely features. Cairo gets a handful of wet days a year, Luxor and Aswan almost none. When it does rain in the south it is an event, and the drainage was not built for it.</p>

<h2>What the Season Does to the Price</h2>

<p>More than the month does to the weather, in some cases.</p>

<p>The curve has three steps. Christmas and New Year sit at the top on their own. November, February and March form a high plateau underneath. May to September is the floor, and the gap between the floor and the peak on the same boat in the same cabin is substantial.</p>

<p>The shoulder weeks are where the value sits. Late October and the first half of April buy most of the winter weather at close to summer prices, and they are the weeks experienced repeat visitors tend to book.</p>

<p>Which is worth saying plainly: the best time to visit egypt on a budget and the best time on weather alone are three or four weeks apart, not six months. Moving a January trip to late October costs you a few degrees and saves a great deal.</p>

<p>One thing that does not follow the curve: guides. The good ones are booked months ahead for the winter regardless of what the hotels are doing, which is the real argument for deciding early rather than waiting for a deal.</p>

<h2>What to Book First, and When</h2>

<p>For November to February, start eight to ten months out. Nile boats are the constraint rather than hotels: a small boat has a dozen cabins and sells out long before a hotel does.</p>

<p>For the shoulder months, four to six is usually enough. For summer, you can move at short notice.</p>

<p>Whatever month you land on, the packing changes more than people expect between them. The <a href="/blog/what-to-pack-for-egypt">packing guide</a> works month by month, and the <a href="/blog/egypt-travel-tips">practical tips</a> cover the things that catch first time visitors out whatever the season. For how the Luxor sites divide across a stay, the <a href="/egypt-travel-guide/attractions-in-luxor">Luxor area guide</a> is the place to start.</p>

<p>Our <a href="/best-luxury-egypt-tours">longer Egypt itineraries</a> are built around early starts in every month, because the difference between leaving at seven and leaving at nine is larger than the difference between two adjacent months.</p>

<p>One instruction if you are still choosing: pick the month for Luxor and Aswan, not for Cairo. The capital is comfortable across a far wider range, and the south is where a bad choice actually costs you.</p>

<p>And if the dates are fixed by work or school and you cannot choose at all, the answer is that there is no month Egypt is closed. The best time to visit egypt in the abstract is November to February, and the right time for you is the one you can actually take, adjusted by starting earlier in the day the hotter it gets.</p>',
  excerpt = 'October to April, and November to February if you can choose freely. Here is what each month actually does to a day in Luxor, and the three weeks most people should avoid.',
  category = 'Travel Planning',
  tags = ARRAY['Best Time to Visit', 'Weather', 'Egypt Travel Planning']::text[],
  focus_keyword = 'best time to visit egypt',
  meta_title = 'Best Time to Visit Egypt in {year}: Month by Month',
  meta_description = 'The best time to visit Egypt is October to April, and November to February is the pick of it. Month by month temperatures, crowds and what each one costs you.',
  faqs = '[{"id":"b36d1797-7e16-5e3e-9896-620156904e69","question":"What is the best time of year to visit Egypt?","answer":"October to April, and November to February inside that. Those 4 winter months keep Luxor in the mid 20s by day, which is what makes the Valley of the Kings bearable after 10am. Summer works only with a 6am start and the middle of the day indoors, because Upper Egypt runs past 40 degrees."},{"id":"bab4ad20-5fa9-5c10-8b9a-1b89b7ad9c3a","question":"Which is better for Egypt, December or February?","answer":"February, unless you want Christmas in Egypt specifically. The weather is near identical at around 25 degrees in Luxor, but December pricing climbs from about the 20th and stays at the year''s peak into early January. February has the same light and a fraction of the cost, with half term weeks the only busy stretch."},{"id":"ee5b9a1c-07fd-5ca2-8ae8-75ec0bb3a588","question":"What is the hottest month in Egypt?","answer":"July, with August close behind. Luxor and Aswan sit above 40 degrees most days and have touched the high 40s. Cairo runs about 5 degrees cooler. The heat is the reason summer itineraries start at 6am and go back indoors by 11, rather than a reason to stay away altogether."},{"id":"e1bbee92-0b15-5921-ad50-5ac02244dd9d","question":"Is it worth visiting Egypt in summer?","answer":"Yes, if the Red Sea is part of the plan or the budget matters more than comfort. Prices fall, the Valley of the Kings is close to empty, and sea temperatures reach 29 degrees. The trade is a 6am start and 5 hours indoors in the middle of every day, which suits some travellers and not others."},{"id":"95120d9d-f6e8-52cd-aad5-730f47b18b8b","question":"When should you avoid Egypt?","answer":"3 windows. Christmas to the first days of January is the most expensive and most crowded fortnight of the year. The week around Easter overlaps European and Egyptian holidays. Mid July to the end of August in Luxor and Aswan is genuinely punishing rather than merely hot."},{"id":"1b49e6be-0fe0-57df-b5ca-cd18cac94659","question":"How cold does Egypt get in winter?","answer":"Colder than most people pack for. Luxor and Aswan nights in December and January drop to single figures, sometimes near 5 degrees, while the same day may reach 24. Cairo is similar. Days are shirt weather and evenings on a cruise deck need a proper jacket rather than a light layer."},{"id":"f2b906d0-696c-5512-82e9-3ec57fec795d","question":"Does Ramadan affect travel in Egypt?","answer":"It changes the rhythm, not the access. Every major site stays open and hotels, boats, guides and drivers work normally. Some restaurants close during daylight and a few sites trim their hours. Cairo traffic is worst in the 1 hour before sunset and empty for the hour after. The evenings are the best part of the month to be there."},{"id":"2a4968f8-0c1d-5282-9bfc-b3b1562862dd","question":"When is the best time for a Nile cruise?","answer":"The same window as the temples, October to April, because a cruise is a way of reaching temples. November to February is ideal on deck by day and needs a jacket after dark. Small boats carry around 12 cabins and sell out 8 to 10 months ahead for the winter, far earlier than hotels do."}]'::jsonb,
  schema_type = 'BlogPosting',
  status = 'published',
  updated_at = now()
-- Both slugs, so a second run finds the row it renamed on the first.
WHERE slug IN ('best-time-to-visit-egypt');

-- luxury-egypt-tours
UPDATE posts SET
  slug = 'luxury-egypt-tours',
  title_en = 'Luxury Egypt Tours: What the Word Should Actually Buy',
  body_en = '<p>Luxury egypt tours are sold on adjectives and bought on details. Six of them decide the trip: who guides it, how many people share the car, what hour you reach the gate, where you sleep on the river, how the itinerary was written, and whether anyone told you the price before you asked.</p>

<p>Everything else is a photograph of a hotel lobby.</p>

<p>This is what to ask, and what a straight answer sounds like.</p>

<h2>What Luxury Egypt Tours Are Competing On</h2>

<p>Almost nothing visible. The sites are fixed, the seasons are fixed, and the hotel list is short enough that every serious operator uses most of it.</p>

<p>So the competition happens in places a brochure cannot photograph: the hour of the morning, the person standing next to you, and how much of the plan was written for you rather than adapted. Those are the axes worth comparing, and they are the ones least often put in writing.</p>

<h2>The Hotels Are the Easy Part</h2>

<p>Every operator in this market books the same handful of properties. There are not many five star hotels with pyramid views, and the good Nile boats can be counted without taking your shoes off.</p>

<p>So a brochure full of hotel photographs is telling you almost nothing about the difference between one company and another. It is telling you they can make a booking.</p>

<p>Ask instead which room category, which side of the building, and whether the pyramid view is from the room or from the roof terrace two floors up. Those answers vary enormously and they are what you are actually paying for.</p>

<!-- OWNER: first-hand paragraph fits well here, on a specific room or property and why you keep using it -->

<h2>Who Is Standing Next to You at Karnak</h2>

<p>This is the one that changes the week.</p>

<p>An Egyptologist who has spent twenty years on these sites is a different experience from a licensed guide working from a script, and both are sold with the same word. The difference shows up in the first hour and compounds every day after it.</p>

<p>The question that gets a real answer is not "are your guides qualified". It is: will the same person be with us for the whole trip, or a different one in each city? A single guide across Cairo, Luxor and Aswan builds on what you saw yesterday. Three separate guides each start again at the beginning.</p>

<p>We use one guide per trip for exactly that reason, and the itinerary is planned from the first call by someone who has guided these sites himself rather than by a booking desk working from a template.</p>

<h2>How Many People Are in the Car</h2>

<p>Private means your party and nobody else''s. It does not mean a small group, a maximum of twelve, or a guaranteed departure with eight other people on it.</p>

<p>The words blur deliberately in this market, so ask the closed question: apart from my party, who else is in the vehicle? Then ask the same about the boat.</p>

<p>Car and driver throughout is the baseline, not an upgrade. If a transfer is shared with strangers on any day of the itinerary, that day is not private and the itinerary should say so.</p>

<h2>What Time You Reach the Gate</h2>

<p>The single largest difference between a good day and an ordinary one in Egypt is the hour.</p>

<p>The Valley of the Kings at seven is a different place from the Valley of the Kings at ten. So is Abu Simbel, so is Karnak, so is the plateau at Giza. Every serious operator knows this and not all of them build for it, because early starts are harder to sell than a relaxed breakfast.</p>

<p>Beyond that there is private access: arrangements made in advance to be inside a site before it opens to the public, or after it closes. It is not available everywhere and it is not available every day, and anyone implying otherwise is overselling. Where it does work, it is the thing guests remember for years.</p>

<p>Ask which specific sites, on which days, and what happens if the arrangement falls through.</p>

<h2>The Boat Decides the Middle of the Trip</h2>

<p>Three categories, and they are not versions of the same thing.</p>

<p>A large cruise ship carries a hundred and fifty or more passengers, moors abreast of four others, and runs a fixed schedule. A boutique ship carries thirty or forty and moves more freely. A dahabiya is a wooden sailing boat with a handful of cabins that takes the whole party and moors where the schedule does not reach.</p>

<p>All three are sold as luxury. Only one of them puts you somewhere the others cannot go.</p>

<p>Which one belongs in the middle of your trip is worth deciding before the hotels, because it constrains the route rather than following it.</p>

<h2>Who Wrote the Itinerary</h2>

<p>Two models exist. In one, a template is adjusted at the edges and sold with your name on it. In the other, someone asks what you care about and builds from there, and the answer changes the route rather than the wording.</p>

<p>The test is simple. Describe something specific you want, ideally something slightly awkward, and see whether the reply reorganises the trip or explains why the existing plan already covers it.</p>

<p>Two people wanting the same fourteen days will not want the same fourteen days. One wants three mornings on the Theban west bank and no shopping. The other wants a day in the Western Desert and an afternoon free in Cairo. A template cannot hold both.</p>

<!-- OWNER: first-hand paragraph fits well here, on a request that changed an itinerary completely -->

<h2>What the Best Luxury Egypt Tours Cost, and Why Nobody Says</h2>

<p>Most operators in this market will not put a number on a page. You are asked to enquire, you have a discovery call, and a price arrives afterwards shaped by what the call suggested you would pay.</p>

<p>Our itineraries run seven to fourteen days and start at 4,000 USD per person. That is published rather than negotiated into existence, and it is a floor rather than an average: length, season, the boat and the amount of private access move it.</p>

<p>The <a href="/blog/tailor-made-egypt-tours">piece on how a tailor made trip is costed</a> sets out which of those moves the number most, which is worth reading before you compare two quotes that look similar.</p>

<p>A quote with no breakdown is not a quote. Ask what is in it and what is not, particularly entrance fees, internal flights, tips and the Abu Simbel leg.</p>

<h2>Where Egypt Luxury Tours Usually Go Wrong</h2>

<p>Not in the hotels. In the pacing.</p>

<p>The commonest mistake is a ten day itinerary carrying fourteen days of sites, with a four in the morning wake up on three of them and a domestic flight on two. It reads impressively and it is exhausting to live through.</p>

<p>The second commonest is the west bank in one morning. Four royal tombs, Hatshepsut, the Colossi and out by lunch, which is enough to see all of it and remember none of it.</p>

<p>The third is arriving at Giza at eleven in the morning in April. The hour is the problem rather than the month, and it is fixed by leaving two hours earlier rather than by moving the trip.</p>

<h2>What Luxury Egypt Vacations Should Include Without Asking</h2>

<p>Entrance fees to everything on the itinerary, not a list of optional extras priced on the day. A car and driver held for your party rather than shared. Water in the vehicle. A guide who meets you at the airport rather than a placard held by a stranger.</p>

<p>And a number to call that is answered by someone who knows your itinerary, in Egypt, at the hour you actually need it, which is rarely office hours.</p>

<p>None of that is exotic. It is simply the difference between a trip that has been organised and one that has been booked.</p>

<h2>Reading a Quote, and What the Packages Hide</h2>

<p>Luxury egypt tour packages are usually quoted as one number per person, and the number is the least informative part of the document.</p>

<p>What matters is the shape underneath it. Two quotes at the same figure can differ by a category of hotel room, by whether the Abu Simbel leg flies or drives, by four entrance fees, and by whether the guide is with you for eleven days or for three. None of that is visible in the total.</p>

<p>Ask for it itemised. A planner who has actually built the trip can produce that in an afternoon, because it is how they costed it in the first place. A reseller adjusting a template usually cannot.</p>

<p>Watch for two specific line items. Internal flights are a real cost and some quotes leave Cairo to Luxor out to look competitive. Tipping in Egypt is customary and widespread, and an operator who tells you roughly what to budget for it is being useful rather than grasping.</p>

<h2>Solo, Couples and Families Are Not the Same Trip</h2>

<p>The word covers all three and the itineraries should not.</p>

<p>A couple on a fourteen day trip can be moved at short notice and will usually take the early start. A family with a nine year old cannot do four temples in a day and should not try, and the fix is fewer sites with more time in each rather than the same list at a gentler walk.</p>

<p>Travelling alone changes the economics rather than the content. Single supplements on a small boat are real and sometimes large, because a cabin is a cabin whoever is in it, and an honest operator will tell you the number before you ask twice.</p>

<p>Multi generational groups are the hardest to plan and the most rewarding when it works. The trick is building parallel mornings, so the grandparents take the museum and the teenagers take the plateau, and everyone meets for lunch.</p>

<h2>The Four Questions Worth Asking Before You Book</h2>

<p>Who guides us, and is it the same person all week. Who else is in our vehicle. Which sites do we reach before they open, on which days. And what does the price include, itemised.</p>

<p>An operator who answers all four plainly is worth talking to further. One who answers with adjectives is telling you something too.</p>

<p>If you want to see how we answer them, the <a href="/">itineraries and pricing</a> are on the site rather than behind a form, our <a href="/best-luxury-egypt-tours">longer Egypt journeys</a> show what fourteen days looks like when it is paced properly, and the <a href="/egypt-travel-guide/attractions-in-luxor">Luxor guide</a> shows the level of detail the planning runs at.</p>

<p>The pattern in all four is the same. Ask closed questions, because the best luxury egypt tours and the ordinary ones describe themselves in identical language and differ entirely in the answers.</p>

<p>One last thing to do before you send an enquiry anywhere: write down the three things you would be disappointed to miss. Not ten. Three. The reply you get back will tell you almost everything about how the trip would be built, because a good planner will use them and a template cannot.</p>',
  excerpt = 'Five star hotels are the easy part and almost nobody differs on them. The trip is decided by who guides it, how many people are in the car, and which hour you reach the gate.',
  category = 'Travel Planning',
  tags = ARRAY['Luxury Travel', 'Egypt Tours', 'Trip Planning']::text[],
  focus_keyword = 'luxury egypt tours',
  meta_title = 'Luxury Egypt Tours: What the Word Should Buy',
  meta_description = 'Luxury egypt tours are sold on adjectives and bought on details. The six that decide the trip, what they cost, and the questions that separate the operators.',
  faqs = '[{"id":"4d34a9bf-475e-58af-aaee-e7c1cec8d28e","question":"What makes a luxury Egypt tour different from a standard one?","answer":"6 things, and the hotel is the least of them. Who guides you and whether it is the same person for all 3 cities, who else is in the vehicle, what hour you reach each gate, which boat you take on the river, whether the itinerary was written or adapted from a template, and whether the price was published."},{"id":"8055f3e0-fc10-58dc-826b-67c4a7a71e25","question":"How much do luxury Egypt tours cost?","answer":"Ours run 7 to 14 days and start at 4,000 USD per person, published rather than quoted after a call. That is a floor rather than an average: trip length, season, the choice of boat and the amount of private access all move it. Most operators in this market will not put any number on a page at all."},{"id":"601eeb4c-7593-5c3c-9c9c-f02bb47947cf","question":"Which is better, a large cruise ship or a dahabiya?","answer":"A dahabiya for the river itself, a larger ship for space and facilities. A big ship carries 150 or more passengers and moors abreast of several others. A dahabiya is a wooden sailing boat with a handful of cabins that takes your party alone and reaches moorings the fixed schedules cannot. Both are sold as luxury."},{"id":"a347e72e-b1cf-597c-a869-ba7a0813a647","question":"Does private actually mean private?","answer":"Not always, which is why it is worth asking as a closed question. Private should mean your party and nobody else in the car or on the tour. It is frequently used for a small group of 8 to 12 or a guaranteed departure. Ask who else is in the vehicle on each day of the itinerary rather than reading the brochure."},{"id":"1d47ec1d-8005-55d0-b557-c619be376e5f","question":"Can you really get into temples before they open?","answer":"At some sites, on some days, arranged in advance. It is not available everywhere and not every day, and an operator implying otherwise is overselling it. Where it works it is the single thing guests remember years later, because 20 minutes alone in a court changes what the building feels like."},{"id":"c7521a77-23bf-58ca-ae55-c3116fbfb238","question":"How long should a luxury Egypt trip be?","answer":"10 to 14 days for Cairo, Luxor, Aswan and the Nile without rushing. 7 days covers the essentials with 1 early start too many. The commonest planning mistake is a 10 day itinerary carrying 14 days of sites, which reads well and is exhausting to live through."},{"id":"c1f504d6-ff49-545e-a418-d6e99567cb86","question":"What should be included in the price?","answer":"Entrance fees for everything on the itinerary, not a list of extras priced on the day. Then a car and driver held for your party alone, internal flights where the route needs them, and a guide who meets you at arrivals. Ask about the 4 usual exclusions specifically: tips, drinks, optional sites and the Abu Simbel leg."},{"id":"af1c8736-7c7b-591b-873c-80934facbaee","question":"When is the best time of year for a luxury Egypt tour?","answer":"October to April, with November to February the strongest 4 months. Luxor sits in the mid 20s then, which is what makes an unshaded courtyard pleasant rather than an endurance test. Small Nile boats sell out 8 to 10 months ahead for those weeks, far earlier than the hotels do."}]'::jsonb,
  schema_type = 'BlogPosting',
  status = 'published',
  updated_at = now()
-- Both slugs, so a second run finds the row it renamed on the first.
WHERE slug IN ('luxury-egypt-tours');

-- do-us-citizens-need-a-visa-for-egypt becomes egypt-visa-for-us-citizens
UPDATE posts SET
  slug = 'egypt-visa-for-us-citizens',
  title_en = 'Egypt Visa for US Citizens: Options, Steps and Timing',
  body_en = '<p><strong>Last reviewed: September 2026.</strong> Entry rules change without much notice. Check the official pages linked below before you travel rather than relying on any summary, including this one.</p>

<p>Yes, you need one. An egypt visa for us citizens can be bought on arrival at the airport or applied for online before departure. Both are tourist visas, both are usually issued for a single entry, and the e-visa is the one to choose if you would rather not join a queue after a 12 hour flight.</p>

<p>That is the whole answer. The rest of this is the detail that decides which route suits you.</p>

<h2>An Egypt Visa for US Citizens: the Two Routes</h2>

<table>
<thead>
<tr><th></th><th>Visa on arrival</th><th>e-Visa</th></tr>
</thead>
<tbody>
<tr><td>Where</td><td>Bank counter in the arrivals hall, before immigration</td><td>Online at the official portal</td></tr>
<tr><td>When</td><td>On the day you land</td><td>Apply before you fly</td></tr>
<tr><td>Payment</td><td>Cash, US dollars, at the counter</td><td>Card, on the portal</td></tr>
<tr><td>Proof</td><td>A sticker in your passport</td><td>A printed or saved approval</td></tr>
<tr><td>Suits</td><td>Travellers arriving with a group or a met-on-arrival service</td><td>Anyone who wants it settled in advance</td></tr>
</tbody>
</table>

<!-- OWNER: confirm current visa fee and validity before publishing -->

<p>Both routes issue a tourist visa. Neither is materially harder than the other. The e-visa removes a step at the airport at the cost of a form a few days earlier.</p>

<p>Nothing else is on the table. There is no waiver, no landing card that substitutes for one, and no arrangement under which an egypt visa for us citizens is waived because the stay is short.</p>

<h2>Do US Citizens Need a Visa for Egypt at All</h2>

<p>The question do us citizens need a visa for egypt gets asked because a handful of countries in the region waive it, and Egypt is not one of them.</p>

<p>There is one partial exception worth knowing about. Travellers flying into Sharm el Sheikh and staying within the South Sinai resort area can sometimes receive a free entry permission stamp valid for a short stay, rather than a full visa. It does not cover travel to Cairo, Luxor or anywhere else in the country, so it is irrelevant to almost every itinerary that includes the Nile.</p>

<p>If your trip touches anything outside that resort strip, you need a proper visa.</p>

<h2>The Egypt E Visa for US Citizens, Step by Step</h2>

<p>Apply at the official government portal, <a href="https://visa2.egypt.gov.eg">visa2.egypt.gov.eg</a>. That address matters: a large number of commercial sites rank for this search, charge a service fee on top of the government charge, and are not connected to the Egyptian government in any way.</p>

<p>You will need a passport valid for at least six months beyond your arrival date, a scan or clear photograph of its data page, your travel dates, and your first night''s accommodation.</p>

<p>Apply at least a week before you fly. Approvals often arrive much faster, but a week gives you room if something is queried, and the portal is not the place to discover a problem the night before a flight.</p>

<p>When it is approved, save the PDF to your phone and print a copy. Airline check-in staff in the US sometimes ask to see it before they will board you.</p>

<!-- OWNER: first-hand paragraph fits well here, on how guests usually handle this and what has gone wrong -->

<h2>Egypt Visa on Arrival for US Citizens, in Practice</h2>

<p>The egypt visa on arrival for us citizens is bought at a bank counter in the arrivals hall, before you reach passport control. The counters are marked and the staff at them do this all day.</p>

<p>Bring clean US dollar notes. Worn or torn notes are sometimes refused, and the counters have historically not been reliable for card payment. Have the exact amount if you can.</p>

<p>The sequence is: get off the aircraft, find the bank counter, buy the visa sticker, then join the immigration queue with the sticker already in your passport. People who go straight to immigration get sent back.</p>

<p>If you are being met on arrival, your representative will usually take your passport and handle the counter while you wait. That is normal here and not a warning sign.</p>

<h2>Egypt Visa Requirements for US Citizens</h2>

<p>The list is short. The egypt visa requirements for us citizens are a passport with at least six months of validity remaining beyond your arrival date, at least one blank page, an onward or return ticket, and an address in Egypt for the arrival form.</p>

<p>The six month rule is the one that catches people out, because it is measured from arrival rather than from departure, and a passport that looks fine for a trip in three weeks may not be.</p>

<p>Check yours today rather than the week before. Renewals take longer than people expect.</p>

<h2>What Arrival Actually Looks Like at Cairo</h2>

<p>Worth knowing in advance, because the hall is busy and the signage is not generous.</p>

<p>You come off the aircraft into a corridor, pass a health desk that is usually waving people through, and arrive at a wide hall with bank counters along one side and immigration booths ahead. If you have an e-visa you walk past the counters. If you do not, that is where you stop.</p>

<p>After immigration comes baggage reclaim, then a customs channel, then the arrivals concourse where drivers and representatives wait. There is a duty free shop before customs that Egyptians use seriously and most visitors walk past.</p>

<p>Budget an hour from wheels down to the car on a normal day, and rather more when three wide body aircraft land together, which happens most evenings in the winter season.</p>

<h2>What About Longer Stays and Second Entries</h2>

<p>The standard tourist visa is single entry. If your itinerary leaves Egypt and comes back, for example a side trip to Jordan, you need to say so, because re-entering on a spent single entry visa does not work.</p>

<p>Multiple entry tourist visas exist and are applied for through the same portal or an Egyptian consulate. Arrange that in advance rather than at the airport.</p>

<p>Extensions beyond the standard tourist period are handled inside Egypt at a passport office and are a genuine errand rather than a formality. If you are planning a long stay, start from the consulate rather than from the arrival counter.</p>

<h2>Timing It Against the Rest of the Booking</h2>

<p>The visa is not the thing to do first, and it is not the thing to leave last.</p>

<p>Do it after the flights are ticketed, because the application asks for your arrival date and your first night''s address, and doing it before you have either means doing it twice. Do it before the six week mark, because that is roughly when a passport renewal stops being comfortable if the expiry date turns out to be a problem.</p>

<p>The one genuinely time critical item in the whole sequence is the passport, and it is the one nobody checks early. Everything else on this page can be done in a single evening at almost any point before departure.</p>

<h2>Where the Rules Actually Live</h2>

<p>Two pages, both official, both worth reading before you book anything.</p>

<p>The Egyptian government portal is where the e-visa is issued and where the current requirements and charges are published. <a href="https://visa2.egypt.gov.eg">Apply for the e-visa here</a> and nowhere else.</p>

<p>The US State Department''s Egypt country page at <a href="https://travel.state.gov/en/international-travel/travel-advisories/egypt.html">travel.state.gov</a> carries entry and exit requirements for US citizens alongside the current travel advisory, and is updated when the position changes.</p>

<p>Anything else, including this article, is a summary written on a particular day. Those two are the record.</p>

<h2>Children, Dual Nationals and Other Awkward Cases</h2>

<p>Children need their own visa on the same terms as an adult, including the six month passport rule. There is no family application.</p>

<p>Dual nationals travelling on a US passport are treated as US citizens for entry. If you also hold Egyptian nationality the position is different and is worth checking with an Egyptian consulate rather than reading a travel blog, because the rules on military service and exit formalities are not something a summary should be trusted on.</p>

<p>Journalists, researchers and anyone intending to fly a drone or carry professional camera equipment are outside the ordinary tourist case and should ask before travelling. Drones in particular are routinely confiscated at Egyptian airports.</p>

<h2>The Mistakes That Actually Cost People Time</h2>

<p>Paying a third party site that looked official. It works, eventually, and it costs more than it should.</p>

<p>Arriving with a passport inside the six month window and discovering it at check-in in the US rather than at the gate in Cairo.</p>

<p>Assuming a Sinai entry stamp covers a trip to Luxor. It does not.</p>

<p>Bringing only cards and no cash for a visa on arrival, which turns a five minute stop into a search for a working ATM in an arrivals hall.</p>

<p>And booking a tight connection onward to Luxor on the same evening as a long haul arrival, on the assumption that the visa and immigration take ten minutes. On a busy night in January they do not.</p>

<h2>Where This Sits in Planning the Rest</h2>

<p>An egypt visa for us citizens is the smallest of the decisions in a trip like this and the one people worry about most. It takes an evening.</p>

<p>The <a href="/blog/planning-a-trip-to-egypt">trip planning guide</a> covers the order to do everything else in, and the <a href="/blog/is-egypt-safe-for-americans">safety article</a> covers the current advisory level and the two regions that are not on any itinerary we run. The <a href="/egypt-travel-guide/cairo-travel-guide">Cairo guide</a> covers what happens after you clear the hall, and our <a href="/best-luxury-egypt-tours">longer Egypt journeys</a> include arrival assistance, which is the part of this most guests would rather not think about after a long flight.</p>

<p>One instruction before you close this tab: open your passport and read the expiry date. If it is inside six months of your travel dates, that is today''s job, and everything else on this page can wait until it is sorted.</p>',
  excerpt = 'Two routes, both straightforward, and one of them can be done from your sofa. What each needs, what catches people out at Cairo arrivals, and where to check the current rules.',
  category = 'Travel Planning',
  tags = ARRAY['Visa', 'US Travellers', 'Egypt Travel Planning']::text[],
  focus_keyword = 'egypt visa for us citizens',
  meta_title = 'Egypt Visa for US Citizens in {year}: Your Options',
  meta_description = 'An egypt visa for us citizens can be bought on arrival or online before you fly. What each route needs, how long it takes, and the official pages to check.',
  faqs = '[{"id":"60d90af1-ad6c-5262-bf28-11bf082f1432","question":"Do US citizens need a visa for Egypt?","answer":"Yes. There is no visa waiver for US tourists. You can buy one on arrival at a bank counter in the airport before immigration, or apply for an e-visa online in advance at the official portal. Both are tourist visas and both are normally issued for a single entry, valid for a stay of up to 30 days."},{"id":"ef6fb2b3-a4e0-5ac8-894f-bbc451769851","question":"Which is better, the e-visa or the visa on arrival?","answer":"The e-visa if you want it settled before you fly, the visa on arrival if you are being met at the airport. The e-visa removes 1 step from a long arrival day and is paid by card. The arrival counter needs clean US dollar notes in cash and takes a few minutes when the hall is quiet."},{"id":"eac91161-ed1d-5f5b-9bdf-45e77c43e844","question":"How long does the Egypt e-visa take?","answer":"Often a few days, sometimes much faster, but apply at least 1 week before you fly. That margin is not about the usual case. It is so that a query on your application is something you deal with calmly rather than the night before a flight, when the portal is the worst possible place to find a problem."},{"id":"9802d37f-3d37-5d86-8e5f-c51bc7408459","question":"How much does an Egypt visa cost for US citizens?","answer":"The current charge is published on the official Egyptian government portal at visa2.egypt.gov.eg, which is the only place worth reading it. Fees are revised from time to time and commercial sites add their own service charge on top, sometimes doubling what you pay for exactly the same document."},{"id":"13b95f4a-7568-5a21-aa72-a65fa99b1b80","question":"What is the difference between passport validity and the 6 month rule?","answer":"No, and the difference is what catches people out. Egypt asks for at least 6 months of validity beyond the date you arrive, with at least 1 blank page, rather than simply an unexpired passport. A passport that expires in 4 months is perfectly valid and will still be refused at check-in."},{"id":"f57d84dc-dd11-5c35-bf1a-085b92b16441","question":"Can you get an Egypt visa at Sharm el Sheikh without paying?","answer":"Sometimes, and it is narrower than it sounds. Travellers flying into Sharm and staying inside the South Sinai resort area can receive a free entry permission stamp for a short stay. It covers 0 of the Nile valley: not Cairo, not Luxor, not Aswan, so it is no use on any itinerary that leaves the resort strip."},{"id":"9ff6d70e-fb5c-5452-929f-2422ddcd673d","question":"Is the tourist visa single or multiple entry?","answer":"Single entry as standard, which covers 1 arrival and no more. If your trip leaves Egypt and returns, a side trip to Jordan for example, you need a multiple entry visa arranged in advance through the portal or an Egyptian consulate. Re-entering on a spent single entry visa does not work, and a border is a bad place to find that out."},{"id":"562e5ffa-1b06-55c5-a7ba-f3984a550454","question":"Where should you check the current rules?","answer":"2 official pages. The Egyptian government portal visa2.egypt.gov.eg for the e-visa itself and the current requirements, and travel.state.gov for the US State Department''s entry and exit information alongside the travel advisory. Every other source is a summary written on a particular day, and requirements change without much notice."}]'::jsonb,
  schema_type = 'BlogPosting',
  status = 'published',
  updated_at = now()
-- Both slugs, so a second run finds the row it renamed on the first.
WHERE slug IN ('do-us-citizens-need-a-visa-for-egypt', 'egypt-visa-for-us-citizens');

-- is-egypt-safe-for-american-tourists becomes is-egypt-safe-for-americans
UPDATE posts SET
  slug = 'is-egypt-safe-for-americans',
  title_en = 'Is Egypt Safe for Americans? What the Advisory Says',
  body_en = '<p><strong>Last reviewed: September 2026.</strong> Advisories change. Read the official page linked below before you travel rather than relying on any summary, including this one.</p>

<p>So, is egypt safe for americans. The US State Department has Egypt at Level 2, Exercise Increased Caution, which is the same level it gives France, the United Kingdom, Germany and Italy. Two areas are excluded at Level 4, Do Not Travel: Northern and Middle Sinai, and parts of the Western Desert.</p>

<p>Neither excluded area sits on a standard Egypt itinerary. The detail below is where the lines are actually drawn and what they mean for a trip that includes the Western Desert, which is the one case where it matters.</p>

<h2>What Level 2 Actually Means</h2>

<p>The State Department runs four levels, from Exercise Normal Precautions at Level 1 to Do Not Travel at Level 4. Exercise Increased Caution is Level 2 and Reconsider Travel is Level 3.</p>

<p>Level 2 is the level most of Western Europe sits at. France, Germany, Italy, Spain and the United Kingdom have all carried it, for reasons ranging from terrorism risk to pickpocketing. It is a long way from a warning against going.</p>

<p>It is also not nothing. Level 2 means there are identified risks that an ordinary traveller should be aware of and take account of, and the advisory names them rather than leaving you to guess.</p>

<p>The full text, and any change to it, lives at <a href="https://travel.state.gov/en/international-travel/travel-advisories/egypt.html">the State Department''s Egypt advisory page</a>. That is the source. Read it yourself.</p>

<h2>The Two Regions at Do Not Travel</h2>

<p>This is the part that gets summarised badly, so here it is plainly.</p>

<p>Northern and Middle Sinai are at Level 4, Do Not Travel. That is a security situation and it has been in place for years.</p>

<p>It does not include the South Sinai resort area around Sharm el Sheikh and Dahab, which is treated separately. Nor does it include St Catherine''s, though the access routes there have their own restrictions at times.</p>

<p><strong>Parts of the Western Desert are also at Level 4, Do Not Travel.</strong> The desert is enormous and the advisory does not put all of it in that category, but some of it is there, and any article that tells you the Western Desert is simply fine is not describing the advisory accurately.</p>

<p>This matters to real itineraries, because Bahariya and the White Desert are in the Western Desert and are genuinely popular. The answer is not that the warning does not apply. The answer is that the permitted routes and the excluded areas are different things.</p>

<h2>How We Handle the Western Desert</h2>

<p>Our Bahariya and White Desert trips run only with a licensed operator, on permitted routes, with the permits that requires. That is not a marketing position. It is the legal condition for being out there at all: the White Desert is a national park, independent camping is not allowed, and the tracks that are open are not the ones you would choose from a map.</p>

<p>If you want the chalk formations and the black hills, that is how it is done. If an operator offers to take you into the Western Desert without a licence and without permits, the problem is larger than the advisory.</p>

<p>And if the current advisory position for a particular route changes, the trip changes. That is the honest version and it is the one worth hearing before you book.</p>

<!-- OWNER: first-hand paragraph fits well here, on how guests raise safety and what actually reassures them -->

<h2>Is Egypt Safe for Americans in Practice, Away From the Advisory</h2>

<p>The question is it safe for americans to travel to egypt usually means something narrower than the advisory answers: will I be targeted for being American. Anyone asking is egypt safe for americans in that sense is asking about reception rather than about security policy.</p>

<p>In ordinary tourist Egypt, no. Americans are a large and long standing share of visitors, the tourism economy is enormous and visible, and the reception is warm to the point of being tiring. You will be asked where you are from constantly and the answer is received with enthusiasm rather than anything else.</p>

<p>The risks that actually affect visitors are mundane. Road traffic is the big one, by a wide margin. Then heat, then stomach upsets, then the persistent commercial attention at major sites that wears people down and is not dangerous.</p>

<p>Violent crime against tourists is rare. Petty theft exists at the level of any busy city.</p>

<h2>How Safe Is Egypt for Americans Compared With Home</h2>

<p>An awkward comparison, and worth making anyway. The question how safe is egypt for americans is usually asked by people who do not ask it about a trip to a major US city.</p>

<p>On the measures that can be compared, violent crime rates in Egypt are low. The country''s serious risk is concentrated in specific regions, which is exactly why the advisory is regional rather than national.</p>

<p>The thing that is genuinely more dangerous than at home is the road. Egyptian traffic is fast, dense, and governed by conventions rather than rules, and road deaths per vehicle are high. This is the argument for a driver rather than a hire car, and it is a stronger argument than anything on the advisory page.</p>

<h2>Women Travelling, and Travelling Alone</h2>

<p>Street harassment is common in Egypt and it is mostly verbal. Women travelling without a male companion should expect comment in crowded public places, particularly in Cairo, and it is wearing rather than threatening.</p>

<p>What reduces it, in order: being with a guide, dressing to cover shoulders and knees at sites and in neighbourhoods away from resorts, and using arranged transport rather than hailing in the street.</p>

<p>Solo travel here works and plenty of people do it. Solo travel with a private guide and driver works better, and that is a practical observation rather than a sales line.</p>

<p>The question is egypt safe to visit for americans travelling alone usually comes from women, and the honest answer separates the two halves of it. The security picture is the same whoever you are. The daily experience is not, and the difference is comment in the street rather than anything more serious.</p>

<h2>What Changed, and What Did Not</h2>

<p>People remember headlines from years ago and carry them into a booking decision without checking whether they still describe the country.</p>

<p>The attacks that shaped Egypt''s reputation with American travellers were in the 1990s and in the years after 2011, and they were concentrated in places and periods that are not the present one. Tourist numbers collapsed and have since recovered substantially, which is itself a piece of evidence: a great many people are going and coming back without incident.</p>

<p>What has not changed is the regional pattern. Sinai has been a genuine security problem for over a decade and remains one. The border areas with Libya and Sudan are not casual destinations. Those facts sit alongside a Nile valley that is heavily policed and heavily visited.</p>

<p>Reading a fifteen year old article about Egyptian security is like reading a fifteen year old article about anywhere. The advisory is updated and this page is not the record. Anyone answering is egypt safe for americans from memory is answering about a country that has moved on.</p>

<h2>What Your Operator Should Be Doing</h2>

<p>Three things, and you can ask about all of them before you book.</p>

<p>Knowing the current advisory position for every region on your itinerary, not just the country headline. Holding the licences and permits for any restricted route, which in practice means the Western Desert. And having a contact in Egypt who answers at two in the morning rather than during office hours in another time zone.</p>

<p>Beyond that, the ordinary things: a driver who is employed rather than hired at the roadside, vehicles that are maintained, and a guide who stays with you rather than handing you between local agents in each city.</p>

<p>None of that is exotic and all of it is checkable. An operator who cannot answer the Western Desert licence question in a sentence has told you something useful.</p>

<h2>The Things That Actually Go Wrong</h2>

<p>Almost never the things people worry about before they come.</p>

<p>Dehydration and heat exhaustion, especially in the Valley of the Kings between May and September. Stomach upsets in the first three days, usually from ice or salad rather than anything exotic. A fall on uneven ground at a site with no handrails. A missed connection because an arrival hall took ninety minutes.</p>

<p>Travel insurance that covers medical evacuation is the single most useful precaution for a trip here, and it is the one most people skip. The <a href="/blog/egypt-travel-insurance">insurance article</a> covers what to check in a policy for this specific destination.</p>

<!-- OWNER: first-hand paragraph fits well here, on the most common thing that has actually gone wrong on a trip -->

<h2>Tourist Police, Convoys and the Visible Security</h2>

<p>You will see more armed police in Egypt than at home, at hotels, at site entrances, and on the roads between cities. Vehicles are often stopped and checked.</p>

<p>This surprises first time visitors and reads as evidence of danger. It is better understood as the opposite: tourism is a central national industry and it is protected accordingly.</p>

<p>Convoy requirements for some desert and Upper Egypt routes come and go. Your operator will know the current position, and if the answer is vague, that is information.</p>

<h2>Health, and the Thing Nobody Plans For</h2>

<p>Serious illness abroad is rarer than a stomach upset and far more expensive.</p>

<p>Cairo has private hospitals that meet international standards and are used to treating visitors. Luxor and Aswan have decent facilities for ordinary problems. The gap opens up on a Nile boat between towns, in the Western Desert, or on a dive boat offshore, where the answer to a real emergency is evacuation rather than treatment.</p>

<p>That is why medical evacuation cover matters here more than in most destinations, and why it is worth reading the policy wording rather than the summary page. Many standard policies exclude diving below a certain depth, and some exclude it entirely.</p>

<p>Nothing on this page is medical advice. A travel clinic four to six weeks before departure is the right place for the health side of the question.</p>

<h2>What to Do Before You Fly</h2>

<p>Read the advisory itself rather than a summary of it. Enrol in STEP, the State Department''s free traveller enrolment programme, which puts you on the embassy''s list for alerts. Take a photograph of your passport and keep it somewhere separate.</p>

<p>Then check the practical things. The <a href="/blog/egypt-visa-for-us-citizens">visa guide</a> covers entry requirements, and our <a href="/best-luxury-egypt-tours">longer Egypt journeys</a> run with a driver throughout, which addresses the one risk on this page that is genuinely higher than at home.</p>

<p>For the Nile itself, the <a href="/egypt-travel-guide/aswan-egypt-attractions">Aswan guide</a> covers the south, which is the calmest part of the country and the part visitors are most surprised by.</p>

<p>One instruction, and it is the most useful one on this page: before you book anything in the Western Desert, ask the operator for the name of the licence holder and the permitted route. A company running it properly will answer in a sentence.</p>',
  excerpt = 'Level 2, the same level as France, Germany and the UK, with two specific regions excluded entirely. Here is what the advisory actually says and where the lines are drawn.',
  category = 'Travel Planning',
  tags = ARRAY['Safety', 'US Travellers', 'Egypt Travel Planning']::text[],
  focus_keyword = 'is egypt safe for americans',
  meta_title = 'Is Egypt Safe for Americans in {year}? The Advisory',
  meta_description = 'Is Egypt safe for Americans? State Department Level 2, the same as France and the UK, with two regions at Do Not Travel. What that means for a real trip.',
  faqs = '[{"id":"a82a790b-da0d-562c-8270-7832a1547b7e","question":"Is Egypt safe for American tourists right now?","answer":"The US State Department has Egypt at Level 2, Exercise Increased Caution, which is the same level as France, Germany, Italy and the United Kingdom. 2 regions are excluded at Level 4, Do Not Travel: Northern and Middle Sinai, and parts of the Western Desert. Neither sits on a standard itinerary."},{"id":"5c105ffb-78df-5f70-bbcb-b14497f58ee3","question":"What does a Level 2 travel advisory mean?","answer":"Exercise Increased Caution, the second of 4 levels. It means identified risks exist that a traveller should account for, and the advisory names them. Most of Western Europe carries the same level. It is 2 steps below Do Not Travel and is not a recommendation against going, but it is not nothing either."},{"id":"819aef6e-4749-5e34-90c4-01cd708529e1","question":"Is the Western Desert safe to visit?","answer":"Parts of the Western Desert are at Level 4, Do Not Travel, and any source that says the whole desert is fine is misreading the advisory. Bahariya and the White Desert are visited on permitted routes with a licensed operator holding the required permits, which is also the legal condition for being in a national park."},{"id":"7a43521b-1cf1-55ee-98ed-91458f1bc4e3","question":"Is Sinai safe?","answer":"Northern and Middle Sinai are at Level 4, Do Not Travel, and have been for years. The South Sinai resort area around Sharm el Sheikh and Dahab is treated separately and is where the diving happens. Access to St Catherine''s has its own restrictions that change, so check the current position before relying on it."},{"id":"d026c2d1-ffd8-5b77-9f8f-1da286c17741","question":"What is the difference between the biggest actual risk in Egypt and the one people worry about?","answer":"Road traffic, by a wide margin, ahead of anything on the security page. Egyptian roads are fast, dense and governed by convention rather than rule, and deaths per vehicle are high. Heat is 2nd, particularly in the Valley of the Kings between May and September. Violent crime against visitors is rare."},{"id":"393c5a51-db09-5f03-af70-3e0148de3c03","question":"Is Egypt safe to visit for American women alone, or is it better as a couple?","answer":"Yes, with the caveat that street harassment is common and mostly verbal. It is wearing rather than threatening and it is worst in crowded parts of Cairo. 3 things reduce it: travelling with a guide, covering shoulders and knees away from resorts, and using arranged transport instead of hailing in the street."},{"id":"4e055963-ee3e-54d0-b103-f7db4396c500","question":"Is Egypt more dangerous than a European city, or is that a difference of perception?","answer":"On violent crime rates they are comparable, and Egypt''s serious risk is concentrated in 2 named regions rather than spread nationally, which is why the advisory is regional. The genuine difference is the road, where Egypt is clearly more dangerous. That argues for a driver rather than a hire car, not against the trip."},{"id":"677b65ca-8c38-56db-8fd2-a0bfc2a9b119","question":"Should you enrol in STEP before travelling?","answer":"Yes. STEP is the State Department''s free Smart Traveler Enrollment Program, and it puts you on the US Embassy Cairo list for alerts and makes you easier to reach in an emergency. It takes about 5 minutes. Pair it with travel insurance that covers medical evacuation, which matters more here than most people expect."}]'::jsonb,
  schema_type = 'BlogPosting',
  status = 'published',
  updated_at = now()
-- Both slugs, so a second run finds the row it renamed on the first.
WHERE slug IN ('is-egypt-safe-for-american-tourists', 'is-egypt-safe-for-americans');

COMMIT;

-- ---------------------------------------------------------------------------
-- Verification. Every "bad" column below must read 0, and the row count must
-- be 4.
-- ---------------------------------------------------------------------------
SELECT count(*) AS rows_present FROM posts WHERE slug IN ('best-time-to-visit-egypt', 'luxury-egypt-tours', 'egypt-visa-for-us-citizens', 'is-egypt-safe-for-americans');

-- Must be 0. Any row still under an old slug means its UPDATE matched nothing,
-- which means the row was not there under either name.
SELECT 'rows still under an old slug' AS check, count(*) AS bad
FROM posts WHERE slug IN ('best-time-to-visit-egypt', 'luxury-egypt-tours', 'egypt-visa-for-us-citizens', 'do-us-citizens-need-a-visa-for-egypt', 'is-egypt-safe-for-americans', 'is-egypt-safe-for-american-tourists') AND slug NOT IN ('best-time-to-visit-egypt', 'luxury-egypt-tours', 'egypt-visa-for-us-citizens', 'is-egypt-safe-for-americans');


SELECT slug,
       length(meta_title) AS title_len,
       length(meta_description) AS meta_len,
       jsonb_array_length(faqs) AS faq_count,
       array_length(regexp_split_to_array(regexp_replace(body_en, '<[^>]+>', ' ', 'g'), '\s+'), 1) AS body_words,
       scheduled_at,
       published_at,
       CASE WHEN body_en LIKE '%<figure%' THEN 'body kept, it has figures in it'
            ELSE 'body written from this file' END AS body_en_outcome
FROM posts WHERE slug IN ('best-time-to-visit-egypt', 'luxury-egypt-tours', 'egypt-visa-for-us-citizens', 'is-egypt-safe-for-americans') ORDER BY scheduled_at;

SELECT 'best-time-to-visit-egypt' AS slug,
       (SELECT count(*) FROM regexp_matches(body_en, 'best time to visit egypt', 'gi')) AS primary_hits
FROM posts WHERE slug = 'best-time-to-visit-egypt';
SELECT 'luxury-egypt-tours' AS slug,
       (SELECT count(*) FROM regexp_matches(body_en, 'luxury egypt tours', 'gi')) AS primary_hits
FROM posts WHERE slug = 'luxury-egypt-tours';
SELECT 'egypt-visa-for-us-citizens' AS slug,
       (SELECT count(*) FROM regexp_matches(body_en, 'egypt visa for us citizens', 'gi')) AS primary_hits
FROM posts WHERE slug = 'egypt-visa-for-us-citizens';
SELECT 'is-egypt-safe-for-americans' AS slug,
       (SELECT count(*) FROM regexp_matches(body_en, 'is egypt safe for americans', 'gi')) AS primary_hits
FROM posts WHERE slug = 'is-egypt-safe-for-americans';

SELECT 'seo lengths out of range' AS check, count(*) AS bad FROM posts
WHERE slug IN ('best-time-to-visit-egypt', 'luxury-egypt-tours', 'egypt-visa-for-us-citizens', 'is-egypt-safe-for-americans') AND (length(meta_title) > 60 OR length(meta_description) NOT BETWEEN 150 AND 160);

SELECT 'faq count out of range' AS check, count(*) AS bad FROM posts
WHERE slug IN ('best-time-to-visit-egypt', 'luxury-egypt-tours', 'egypt-visa-for-us-citizens', 'is-egypt-safe-for-americans') AND jsonb_array_length(faqs) NOT BETWEEN 7 AND 8;

-- Answers are written to be quoted on their own by an AI answer engine, which
-- means 40 to 80 words each. Outside that they are either empty or too long.
SELECT 'faq answers outside 40-80 words' AS check, count(*) AS bad
FROM posts p, jsonb_array_elements(p.faqs) f
WHERE p.slug IN ('best-time-to-visit-egypt', 'luxury-egypt-tours', 'egypt-visa-for-us-citizens', 'is-egypt-safe-for-americans')
  AND array_length(regexp_split_to_array(trim(f->>'answer'), '\s+'), 1) NOT BETWEEN 40 AND 80;

-- The SEO overrides must be NULL, not empty strings, or the fallbacks break.
SELECT 'seo overrides stored as empty strings' AS check, count(*) AS bad FROM posts
WHERE slug IN ('best-time-to-visit-egypt', 'luxury-egypt-tours', 'egypt-visa-for-us-citizens', 'is-egypt-safe-for-americans')
  AND (canonical_url = '' OR robots = '' OR og_image = '' OR schema_type = '' OR featured_image_alt = '');

SELECT 'faq entries missing id, question or answer' AS check, count(*) AS bad
FROM posts p, jsonb_array_elements(p.faqs) f
WHERE p.slug IN ('best-time-to-visit-egypt', 'luxury-egypt-tours', 'egypt-visa-for-us-citizens', 'is-egypt-safe-for-americans')
  AND (coalesce(f->>'id','') = '' OR coalesce(f->>'question','') = '' OR coalesce(f->>'answer','') = '');

SELECT 'em or en dash present' AS check, count(*) AS bad FROM posts
WHERE slug IN ('best-time-to-visit-egypt', 'luxury-egypt-tours', 'egypt-visa-for-us-citizens', 'is-egypt-safe-for-americans')
  AND (body_en ~ '[\u2013\u2014]' OR meta_title ~ '[\u2013\u2014]' OR meta_description ~ '[\u2013\u2014]' OR title_en ~ '[\u2013\u2014]');

-- Tour links must sit at the site root. Anything under the category path 404s.
SELECT 'tour links under /luxury-egypt-tour-packages/' AS check, count(*) AS bad FROM posts
WHERE slug IN ('best-time-to-visit-egypt', 'luxury-egypt-tours', 'egypt-visa-for-us-citizens', 'is-egypt-safe-for-americans') AND body_en ~ 'href="/luxury-egypt-tour-packages/[^"]';

-- The hotel listing moved. A link to the old path still works through the 301,
-- and costs every reader a hop for no reason.
SELECT 'links to the old /stay path' AS check, count(*) AS bad FROM posts
WHERE slug IN ('best-time-to-visit-egypt', 'luxury-egypt-tours', 'egypt-visa-for-us-citizens', 'is-egypt-safe-for-americans') AND body_en ~ 'href="/stay';

SELECT 'unfilled placeholders' AS check, count(*) AS bad FROM posts
WHERE slug IN ('best-time-to-visit-egypt', 'luxury-egypt-tours', 'egypt-visa-for-us-citizens', 'is-egypt-safe-for-americans') AND (body_en LIKE '%data-placeholder=%' OR body_en ~ '\{\{[A-Z_]+\}\}');

SELECT 'other language columns left empty' AS check, count(*) AS bad FROM posts
WHERE slug IN ('best-time-to-visit-egypt', 'luxury-egypt-tours', 'egypt-visa-for-us-citizens', 'is-egypt-safe-for-americans')
  AND (title_es IS NOT NULL OR title_fr IS NOT NULL OR title_jp IS NOT NULL
       OR body_es IS NOT NULL OR body_fr IS NOT NULL OR body_jp IS NOT NULL);

-- The owner paragraphs are deliberately left as HTML comments for someone to
-- replace with a real first hand voice. This is a reminder, not a failure.
SELECT slug,
       (length(body_en) - length(replace(body_en, '<!-- OWNER:', ''))) / 11 AS owner_notes_awaiting_a_paragraph
FROM posts WHERE slug IN ('best-time-to-visit-egypt', 'luxury-egypt-tours', 'egypt-visa-for-us-citizens', 'is-egypt-safe-for-americans') ORDER BY slug;
