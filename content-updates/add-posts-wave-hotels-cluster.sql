-- Wave "hotels-cluster": 6 articles, loaded in one file.
--
--   2026-11-18T09:00:00+02:00  where-to-stay-in-cairo  (where to stay in cairo)
--   2026-11-21T09:00:00+02:00  luxury-hotels-cairo  (luxury hotels cairo)
--   2026-11-24T09:00:00+02:00  cairo-hotel-with-pyramid-view  (cairo hotel with pyramid view)
--   2026-11-27T09:00:00+02:00  best-hotels-in-luxor-egypt  (best hotels in luxor egypt)
--   2026-11-30T09:00:00+02:00  best-hotels-in-aswan  (best hotels in aswan)
--   2026-12-03T09:00:00+02:00  5-star-hotels-in-egypt  (5 star hotels in egypt)
--
-- Scheduled via posts.scheduled_at, so every row stays out of the blog list,
-- the sitemap and the server rendered meta until its moment. published_at
-- carries the same instant as the article's own date. See
-- shared/post-visibility.ts for the visibility rule.
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
--   where-to-stay-in-cairo
--     The Nile corniche at dusk from a riverside balcony, one answer to where to stay in cairo
--   luxury-hotels-cairo
--     A river facing suite balcony above the corniche at one of the luxury hotels cairo has on the Nile
--   cairo-hotel-with-pyramid-view
--     The Giza pyramids seen over a terrace at dusk from a cairo hotel with pyramid view
--   best-hotels-in-luxor-egypt
--     A hotel terrace above the Nile at dawn, the setting for the best hotels in luxor egypt
--   best-hotels-in-aswan
--     Feluccas on the water below a terrace at one of the best hotels in aswan at sunset
--   5-star-hotels-in-egypt
--     A hotel terrace above the Nile at dusk, the standard people expect from 5 star hotels in egypt
--
-- Safe to run twice. See the ON CONFLICT block: a row whose body already has
-- figures in it keeps that body rather than losing the images.

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
WHERE slug IN ('where-to-stay-in-cairo', 'luxury-hotels-cairo', 'cairo-hotel-with-pyramid-view', 'best-hotels-in-luxor-egypt', 'best-hotels-in-aswan', '5-star-hotels-in-egypt')
ORDER BY scheduled_at;

BEGIN;

INSERT INTO posts (
  slug, title_en, body_en, excerpt, category, tags,
  focus_keyword, meta_title, meta_description,
  status, scheduled_at, published_at, updated_at, faqs, schema_type
) VALUES
(
  'where-to-stay-in-cairo',
  'Where to Stay in Cairo: Choosing by Neighbourhood',
  '<p class="post-byline">By <span>Hamdy Haggag</span>. Last updated: <time datetime="2026-11-18">18 November 2026</time>.</p>

<p>Deciding where to stay in cairo comes down to four areas: the Nile corniche, Zamalek on the island, the Giza side near the pyramids, and Heliopolis by the airport. The river suits most first visits. Giza suits anyone starting at the plateau at opening. Traffic decides the rest.</p>

<aside class="key-takeaways" aria-label="Key takeaways"><h2 id="key-takeaways">Key takeaways</h2><ul><li>Four areas matter: the river, Zamalek, the Giza side and Heliopolis near the airport.</li><li>The river and Zamalek suit most first visits. They put dinner and the museums within reach.</li><li>The Giza side saves 40 minutes on a dawn start at the pyramids and costs you the evenings.</li><li>Traffic, not distance, decides everything. Judge a hotel by the hour of the day you will leave it.</li><li>Three nights minimum. Two forces the pyramids and a major museum into one day.</li></ul></aside>

<nav class="toc" aria-label="On this page"><p>On this page</p><ol><li><a href="#the-four-areas-side-by-side">The Four Areas, Side by Side</a></li><li><a href="#the-river-and-why-it-is-the-default">The River, and Why It Is the Default</a></li><li><a href="#zamalek-for-a-slower-version">Zamalek, for a Slower Version</a></li><li><a href="#where-to-stay-in-cairo-near-pyramids">Where to Stay in Cairo Near Pyramids</a></li><li><a href="#heliopolis-and-when-it-makes-sense">Heliopolis, and When It Makes Sense</a></li><li><a href="#where-to-stay-in-cairo-egypt-against-the-other-cities">Where to Stay in Cairo Egypt, Against the Other Cities</a></li><li><a href="#where-to-stay-in-cairo-first-time">Where to Stay in Cairo First Time</a></li><li><a href="#what-5-star-hotels-in-cairo-egypt-actually-give-you">What 5 Star Hotels in Cairo Egypt Actually Give You</a></li><li><a href="#what-to-ask-before-you-book-a-room">What to Ask Before You Book a Room</a></li><li><a href="#traffic-which-decides-more-than-location">Traffic, Which Decides More Than Location</a></li><li><a href="#how-many-nights">How Many Nights</a></li><li><a href="#booking-it">Booking It</a></li></ol></nav>

<h2 id="the-four-areas-side-by-side">The Four Areas, Side by Side</h2>

<table>
<thead>
<tr><th>Area</th><th>Good for</th><th>Costs you</th><th>Suits</th></tr>
</thead>
<tbody>
<tr><td>Nile corniche, Garden City and Downtown</td><td>The river, the museums, dinner on foot</td><td>40 minutes to Giza in the morning</td><td>Most first visits</td></tr>
<tr><td>Zamalek, on Gezira island</td><td>Quiet streets, restaurants, a calmer city</td><td>Bridges, which jam at rush hour</td><td>Second visits and longer stays</td></tr>
<tr><td>Giza, near the plateau</td><td>Being at the gate when it opens</td><td>The evenings, and most of the city</td><td>Short stays built around the pyramids</td></tr>
<tr><td>Heliopolis, near the airport</td><td>An early flight or a late arrival</td><td>Everything else, by a long way</td><td>One night at either end</td></tr>
</tbody>
</table>

<p>Nothing else on this page changes that table. The rest is what each row means in practice.</p>

<h2 id="the-river-and-why-it-is-the-default">The River, and Why It Is the Default</h2>

<p>Garden City, Downtown and the corniche between them put you where the city actually happens.</p>

<p>The Egyptian collections, the older quarters, the restaurants and the river itself are all within a short drive or a walk. Evenings work without planning, which matters more than people expect on a trip where the mornings are early.</p>

<p>The <a href="/hotel/four-seasons-nile-plaza">Four Seasons at Nile Plaza</a> and the <a href="/hotel/fairmont-nile-city">Fairmont Nile City</a> sit on this stretch. <a href="/hotel/kempinski-nile-hotel-cairo">The Kempinski</a> is the smallest of them and the one people pick when they want fewer rooms.</p>

<p>The cost is the morning run to Giza, which is forty minutes on a good day and rather more at eight.</p>

<h2 id="zamalek-for-a-slower-version">Zamalek, for a Slower Version</h2>

<p>An island in the middle of the river, and the quietest central address in Cairo.</p>

<p>It is also the easiest part of Cairo to walk in, which sounds minor until you have spent two days being driven everywhere. An hour on foot here is the closest thing to a day off the trip offers.</p>

<p>Tree lined streets, embassies, galleries and the best concentration of restaurants in the city. It feels like a different place from the corniche two hundred metres away, and travellers on a second visit very often move here.</p>

<p>The <a href="/hotel/sofitel-cairo-nile-el-gezirah">Sofitel El Gezirah</a> sits at the southern tip of the island with water on three sides.</p>

<p>The catch is bridges. Everything off the island crosses one, and at the wrong hour a bridge is where twenty minutes goes to die.</p>

<!-- OWNER: first-hand paragraph fits here, on which area guests ask to move to on a second trip -->

<h2 id="where-to-stay-in-cairo-near-pyramids">Where to Stay in Cairo Near Pyramids</h2>

<p>The Giza side, and it is a real trade rather than an upgrade.</p>

<p>What you gain is the morning. Being at the gate when the plateau opens is the single change that most improves a Cairo visit, and staying twenty minutes away rather than an hour makes it painless instead of brutal.</p>

<p>What you lose is the evening and most of the rest of the city. Giza is not a place to walk out into after dark, and every dinner becomes a drive.</p>

<p>The <a href="/hotel/mena-house-hotel-egypt">Marriott Mena House</a> sits at the foot of the plateau and is the one with pyramid views on its own record. For a short stay built entirely around the plateau, it is the obvious answer and it is not close.</p>

<p>Anyone staying out this way should plan dinner rather than assume it. The hotel restaurants are the realistic options most evenings, which is fine for two nights and wears thin over four.</p>

<h2 id="heliopolis-and-when-it-makes-sense">Heliopolis, and When It Makes Sense</h2>

<p>Near the airport, a long way from everything else, and occasionally exactly right.</p>

<p>A 4am flight to Luxor or a landing at midnight are the two cases. One night here at the start or end of a trip saves an hour of driving at a time when an hour matters.</p>

<p><a href="/hotel/waldorf-astoria-cairo-heliopolis">The Waldorf Astoria</a> sits out this way, and there are other options nearby on the listing page.</p>

<p>Do not base a whole stay here. The distance to the pyramids and to the river is the distance across a city of twenty million people.</p>

<p>The airport itself has three terminals and moving between them is not quick, so if you are connecting rather than staying, check which one you land at before booking anything on this side.</p>

<h2 id="where-to-stay-in-cairo-egypt-against-the-other-cities">Where to Stay in Cairo Egypt, Against the Other Cities</h2>

<p>One more thing worth saying, because the search often means something broader.</p>

<p>People asking where to stay in cairo egypt are frequently asking about the whole trip rather than one city, and the honest answer is that Cairo is the only place where the choice of area genuinely changes the holiday. Luxor and Aswan are small enough that the address matters far less, and on the river you are not choosing an area at all.</p>

<p>So spend the deliberation here and take the obvious option everywhere else.</p>

<h2 id="where-to-stay-in-cairo-first-time">Where to Stay in Cairo First Time</h2>

<p>The river, three nights, and stop deliberating.</p>

<p>That is the answer for perhaps four travellers in five, and the deliberation people put into it rarely changes it.</p>

<p>A first visit wants the museums, the plateau and the older quarters, and the corniche is the only address that reaches all three without a bad drive to at least one of them. The Giza option is better for exactly one of those things and worse for the other two.</p>

<p>If you are here for four nights or more, the case for a split changes: two nights on the river, then one at Giza before an early plateau morning, then out. That works well and costs you a packing session.</p>

<h2 id="what-5-star-hotels-in-cairo-egypt-actually-give-you">What 5 Star Hotels in Cairo Egypt Actually Give You</h2>

<p>Reliable air conditioning, water you can drink, a kitchen you can trust, and staff who will sort a problem at six in the morning.</p>

<p>Those four are what the category reliably delivers here, and none of them is glamorous.</p>

<p>That sounds like a low bar and it is the whole point. On a trip with dawn starts and long hot days, the difference a good hotel makes is not the marble. It is that the car is there when it said it would be.</p>

<p>Beyond that, judge the building rather than the stars. The full listing of <a href="/luxury-hotels-in-egypt">the hotels we actually use</a> gives the specifics for each one.</p>

<!-- OWNER: first-hand paragraph fits here, on what guests actually notice about the hotels after the trip -->

<h2 id="what-to-ask-before-you-book-a-room">What to Ask Before You Book a Room</h2>

<p>Four questions, and none of them is about the hotel.</p>

<p>What time does the car leave for the pyramids. How long is that drive at that hour. Is breakfast available before we go, or is it a box. And is there somewhere to sit with a coffee at five in the morning, because on temple days that is when you will be up.</p>

<p>A good hotel here answers all four without checking. A grand one that cannot answer the last two will still be grand and you will still be standing in a dark lobby at dawn.</p>

<h2 id="traffic-which-decides-more-than-location">Traffic, Which Decides More Than Location</h2>

<p>Cairo distances are measured in hours, not kilometres, and the hour changes the answer.</p>

<p>Between four and eight in the evening, allow double. Friday mornings are the quietest time of the week and Friday afternoons are not. Anything that crosses the river at the wrong moment costs more than the same trip on the same side.</p>

<p>This is why a hotel forty minutes away at seven in the morning is a perfectly good choice, and the same hotel is a poor one if your day starts at nine.</p>

<p>The practical version: ask what time the car leaves, not how far the hotel is. Any operator who answers the second question when you asked the first is not thinking about your morning.</p>

<h2 id="how-many-nights">How Many Nights</h2>

<p>Three, and two is the most common regret people report about an Egypt itinerary.</p>

<p>One day for the plateau and the older pyramid fields, one for the museums, one for Islamic and Coptic Cairo. Two nights forces the first two into a single exhausting day and drops the third entirely.</p>

<p>Four nights adds Alexandria as a long day out, or simply an afternoon with nothing in it, which after two early starts is worth more than another site.</p>

<p>Whatever the number, put them at the front of the trip rather than the back. The pyramid days are the heaviest walking of the whole itinerary and they go better before a week on a boat than after one.</p>

<h2 id="booking-it">Booking It</h2>

<p>Hotels here rarely sell out the way the river boats do, so this is not the part of the trip to book first.</p>

<p>Settle the dates, the river and the internal flights, then pick the address. The one exception is Christmas and New Year, when the good Cairo rooms go the same way as everything else.</p>

<p>Book the airport transfer with the room or with the trip rather than arranging it on arrival. A first landing here at eleven at night is not the moment to start negotiating, and it is the single most common place a good trip starts badly.</p>

<p><a href="/egypt-travel-guide/cairo-travel-guide">The Cairo guide</a> covers the city itself, and our <a href="/egypt-private-tour-packages">private itineraries</a> show how many nights the city usually gets inside a full route.</p>

<aside class="related-posts" aria-label="Related reading"><h2 id="related-reading">Related reading</h2><ul><li><a href="/blog/private-tours-in-cairo-egypt">how three days in the city fit together</a></li><li><a href="/blog/planning-a-trip-to-egypt">the order the whole trip gets decided in</a></li><li><a href="/blog/egypt-travel-tips">the practical things that come up daily</a></li></ul></aside>

<p class="author-bio">Written by Hamdy Haggag, who has planned and run private journeys in Egypt for more than a decade and still takes the first call for every itinerary.</p>',
  'Four parts of a very large city, and the one you pick decides how much of your holiday you spend in a car. What each side is good for, and who it suits.',
  'Travel Planning',
  ARRAY['Cairo', 'Hotels', 'Egypt Travel Planning']::text[],
  'where to stay in cairo',
  'Where to Stay in Cairo: Picking the Right Side',
  'Deciding where to stay in cairo is really a choice between the river, the old city and the Giza side. What each one costs you in traffic, and who each suits.',
  'published',
  '2026-11-18T09:00:00+02:00'::timestamptz,
  -- published_at and updated_at both take the scheduled moment as written.
  --
  -- published_at used to carry "AT TIME ZONE 'Africa/Cairo'" here, which is
  -- what you reach for when a value needs moving INTO Cairo time and is wrong
  -- for a string that already says +02:00. It converted the timestamptz to a
  -- naive local time and then let the server read it back as UTC, so every
  -- article in the two earlier waves stored 11:00 Cairo rather than 09:00.
  -- Nothing had noticed because scheduled_at, which decides visibility, never
  -- had the conversion and was always right; only datePublished in the
  -- BlogPosting was two hours out.
  --
  -- updated_at matches, so dateModified agrees with the "Last updated" line
  -- the article prints under its title. A row inserted today for November
  -- would otherwise claim it was last touched in September.
  '2026-11-18T09:00:00+02:00'::timestamptz,
  '2026-11-18T09:00:00+02:00'::timestamptz,
  '[{"id":"7997e188-d4d4-5a5d-8763-c90ef41d8686","question":"Where should you stay in Cairo for a first visit?","answer":"The Nile corniche, Garden City or Downtown, for 3 nights. That stretch reaches the Egyptian collections, the older quarters and dinner without a bad drive to any of them. The Giza side is better for exactly 1 thing, the pyramid morning, and worse for the other 2."},{"id":"1482ba24-1ebd-5255-8011-7ef63f52ab98","question":"Is it better to stay near the pyramids or on the Nile?","answer":"The Nile for most trips, Giza for short stays built around the plateau. Staying at Giza turns a 40 minute dawn drive into a 20 minute one, which makes an opening-time start painless. It costs you the evenings, because Giza is not somewhere to walk out into after dark."},{"id":"8c8bc761-f46a-5c4d-9a1d-18b7cd3e6615","question":"Which Cairo hotel has a view of the pyramids?","answer":"Marriott Mena House, at the foot of the Giza plateau, is the 1 on our list whose own record describes pyramid views. Several other Cairo hotels mention the pyramids as a distance away, usually around a 30 minute drive, which is a different claim entirely."},{"id":"9556205d-d723-58c9-b689-369363dbf4e9","question":"How many nights do you need in Cairo?","answer":"3. 1 day for Giza, Saqqara and Dahshur, 1 for the museums, 1 for Islamic and Coptic Cairo. 2 nights forces the first 2 into a single exhausting day and drops the third, and it is the most common regret people report about an Egypt itinerary afterwards."},{"id":"3f2b0ee9-53ad-50c1-97ff-55fda9676f63","question":"Is Zamalek a good area to stay in?","answer":"Yes, particularly on a second visit. It is an island in the river with tree lined streets, embassies and the best concentration of restaurants in the city, and it is the quietest central address. The catch is bridges: everything off the island crosses 1, and at rush hour that is where 20 minutes goes."},{"id":"89991dbf-3dde-5851-afcb-c545b520da6e","question":"Should you stay near Cairo airport?","answer":"Only for 1 night at either end of a trip. A 4am flight to Luxor or a landing at midnight are the 2 cases where Heliopolis earns its distance. Basing a whole stay there means crossing a city of 20 million people to reach anything you came to see."},{"id":"1a54167b-f2cb-59f0-afd4-1b3d2dec1364","question":"Is a 5 star hotel in Cairo worth it?","answer":"Not for the marble. What the category actually buys on a trip with dawn starts is reliable air conditioning, a kitchen you can trust and staff who will fix a problem at 6am. On 3 days of early mornings, the car being there when it said it would be is the thing that matters."},{"id":"bebe1696-80ff-5508-87c0-fc1b40f5ae9d","question":"How far in advance should you book a Cairo hotel?","answer":"Later than the rest of the trip. Cairo rooms rarely sell out the way the river boats do, so settle the dates, the cruise and the internal flights first. The 1 exception is Christmas and New Year, when the good rooms go months ahead like everything else."}]'::jsonb,
  'BlogPosting'
),
(
  'luxury-hotels-cairo',
  'Luxury Hotels Cairo: How the Good Ones Differ',
  '<p class="post-byline">By <span>Hamdy Haggag</span>. Last updated: <time datetime="2026-11-21">21 November 2026</time>.</p>

<p>The luxury hotels cairo has are concentrated in three places: along the Nile corniche, on Zamalek island, and out at Giza facing the plateau. They differ far less in their rooms than in where they put you, how early they will feed you, and whether the car is waiting when you come down.</p>

<aside class="key-takeaways" aria-label="Key takeaways"><h2 id="key-takeaways">Key takeaways</h2><ul><li>Location beats interiors here. A river address and a Giza address are different holidays.</li><li>Service on a trip with dawn starts means breakfast at 5am and a car that is waiting.</li><li>Room view is worth paying for on the river and worth nothing away from it.</li><li>Ask about noise, the pool in winter, and whether the spa and gym are actually open.</li></ul></aside>

<nav class="toc" aria-label="On this page"><p>On this page</p><ol><li><a href="#what-luxury-hotels-cairo-offers-actually-means">What Luxury Hotels Cairo Offers Actually Means</a></li><li><a href="#the-three-locations">The Three Locations</a></li><li><a href="#best-hotels-in-cairo-what-separates-them">Best Hotels in Cairo: What Separates Them</a></li><li><a href="#the-river-properties">The River Properties</a></li><li><a href="#zamalek-and-why-people-move-there">Zamalek, and Why People Move There</a></li><li><a href="#5-star-hotels-in-cairo-and-what-the-rating-does-not-tell-you">5 Star Hotels in Cairo, and What the Rating Does Not Tell You</a></li><li><a href="#what-to-ask-before-booking">What to Ask Before Booking</a></li><li><a href="#families-and-what-changes">Families, and What Changes</a></li><li><a href="#noise-which-nobody-mentions">Noise, Which Nobody Mentions</a></li><li><a href="#the-best-luxury-hotel-in-cairo-is-the-wrong-question">The Best Luxury Hotel in Cairo Is the Wrong Question</a></li><li><a href="#cairo-luxury-hotels-against-the-rest-of-the-trip">Cairo Luxury Hotels Against the Rest of the Trip</a></li><li><a href="#where-luxury-hotels-in-cairo-egypt-sit-against-other-capital">Where Luxury Hotels in Cairo Egypt Sit Against Other Capitals</a></li></ol></nav>

<h2 id="what-luxury-hotels-cairo-offers-actually-means">What Luxury Hotels Cairo Offers Actually Means</h2>

<p>More than in most cities, and less than the photographs suggest.</p>

<p>Cairo has genuinely grand hotels, several of them historic, and the gap between the top of the market and the middle is wide. What closes that gap in a brochure is interiors, which every property in the bracket has. What does not close is the things you use at six in the morning.</p>

<p>So the useful comparison is not which lobby is more impressive. It is which building puts you nearest the thing you came for, and which staff have done a 5am departure before.</p>

<h2 id="the-three-locations">The Three Locations</h2>

<table>
<thead>
<tr><th>Where</th><th>What it gives you</th><th>What it costs</th></tr>
</thead>
<tbody>
<tr><td>Nile corniche</td><td>The river, the museums, dinner without a drive</td><td>A 40 minute run to Giza in the morning</td></tr>
<tr><td>Zamalek island</td><td>Quiet streets, the best restaurants, a walkable hour</td><td>Bridges at rush hour</td></tr>
<tr><td>Giza, at the plateau</td><td>Being first through the gate</td><td>The evenings, and most of the city</td></tr>
</tbody>
</table>

<p>That is the entire decision. Everything after it is preference.</p>

<p>Most of the luxury hotels cairo travellers end up choosing between sit in the first row of that table, which is why the corniche gets most of this page.</p>

<h2 id="best-hotels-in-cairo-what-separates-them">Best Hotels in Cairo: What Separates Them</h2>

<p>Four things, in this order.</p>

<p>Location, which the table above settles. Then whether the room faces the river, which matters on the corniche and not at all anywhere else. Then breakfast timing, because a hotel that starts service at seven is useless on a day you leave at six. Then the car: whose it is, where it waits, and whether the driver knows the route.</p>

<p>Almost nothing in a hotel review covers the last two, and they decide more of your week than the thread count does.</p>

<p>The reason is that a review is written by someone who stayed for a weekend and left at ten. A trip here leaves at six on at least two mornings, which is a different hotel to be a guest in and a different set of things to judge it by.</p>

<p>Judge it by the mornings. That single reframing settles most of the choices on this page.</p>

<h2 id="the-river-properties">The River Properties</h2>

<p>The corniche between Garden City and Bulaq holds most of the category.</p>

<p><a href="/hotel/four-seasons-nile-plaza">The Four Seasons at Nile Plaza</a> and <a href="/hotel/four-seasons-first-residence-cairo">the First Residence</a> are the two Four Seasons addresses, one on the river and one behind it in Giza''s residential side. <a href="/hotel/fairmont-nile-city">The Fairmont Nile City</a> sits further north on the water.</p>

<p><a href="/hotel/kempinski-nile-hotel-cairo">The Kempinski</a> is the smallest of them by some margin, which is the reason people choose it, and <a href="/hotel/sofitel-cairo-downtown-nile">the Sofitel Downtown</a> is the one nearest the older centre on foot.</p>

<p>All five are within a short drive of each other and of the Egyptian collections, so the choice between them is about the building rather than the position.</p>

<p>Ask for a river facing room in writing rather than at check in. On this stretch the difference between the two sides of the building is the difference between the Nile and a car park.</p>

<!-- OWNER: first-hand paragraph fits here, on which of these guests ask to return to -->

<h2 id="zamalek-and-why-people-move-there">Zamalek, and Why People Move There</h2>

<p><a href="/hotel/sofitel-cairo-nile-el-gezirah">The Sofitel El Gezirah</a> occupies the southern tip of the island with water on three sides.</p>

<p>Zamalek is the quietest central address in the city and the only one where an hour on foot is a pleasure rather than an errand. Travellers on a second visit move here in large numbers.</p>

<p>The bridges are the cost, and on a Thursday evening they are a real one.</p>

<p>It is also the part of Cairo with the shortest walk to somewhere worth eating, which after three days of being driven everywhere turns out to matter more than most people expect when they book.</p>

<h2 id="5-star-hotels-in-cairo-and-what-the-rating-does-not-tell-you">5 Star Hotels in Cairo, and What the Rating Does Not Tell You</h2>

<p>The classification is issued by the Ministry of Tourism and Antiquities rather than by a guidebook or a review site.</p>

<p>It is a licensing category based on facilities and capacity, not a running score of how well a hotel is doing this year. Two properties with the same five stars can be a decade apart in condition, and the rating will not move to tell you.</p>

<p>So read the stars as a floor rather than a verdict. It guarantees a pool, a certain room size and a certain number of restaurants. It guarantees nothing about whether the air conditioning in your particular room works.</p>

<p>What to check instead is in the questions two sections down, and none of it is on a star plaque.</p>

<h2 id="what-to-ask-before-booking">What to Ask Before Booking</h2>

<p>Six questions, and none of them appears in a brochure.</p>

<p>What time does breakfast start, and is there an earlier option. Where does the car wait. Which side of the building is the room on.</p>

<p>Is the pool heated in winter. Is the spa or the gym closed for works. And how far is it, in minutes, at the hour we will actually leave.</p>

<p>A hotel that answers all six quickly is telling you what kind of operation it runs.</p>

<h2 id="families-and-what-changes">Families, and What Changes</h2>

<p>Two things, and neither is the room.</p>

<p>The pool stops being a facility and becomes part of the itinerary. On a Cairo trip with two heavy sightseeing mornings, an afternoon in the water is what makes the second morning possible, so a heated pool in winter moves from a nice extra to the deciding feature.</p>

<p>Then connecting rooms, which are genuinely scarce at this level in Cairo and are almost never bookable online. Ask directly and ask early. A hotel that cannot offer them will usually say so straight away, which saves everyone a week.</p>

<p>Cots, high chairs and early dinner are all straightforward here. Egyptian hospitality is good with children in a way that surprises visitors from colder places.</p>

<h2 id="noise-which-nobody-mentions">Noise, Which Nobody Mentions</h2>

<p>Cairo is loud and some of the grandest addresses are on the loudest roads.</p>

<p>The corniche carries traffic all night. Rooms facing it have the view and the noise together, and higher floors solve most but not all of it. Zamalek is quieter by a wide margin.</p>

<p>The call to prayer sounds across the whole city five times a day and will wake you the first morning wherever you are. By the third it is the thing people say they miss afterwards, and no hotel can or should do anything about it.</p>

<p>If you are a light sleeper, say so when booking rather than after the first night. It is the single easiest thing for a hotel to fix in advance and the hardest once the hotel is full.</p>

<h2 id="the-best-luxury-hotel-in-cairo-is-the-wrong-question">The Best Luxury Hotel in Cairo Is the Wrong Question</h2>

<p>There is no single answer and anyone giving you one is selling something.</p>

<p>A couple spending three nights on the museums and the older quarters wants the river. A family with an 8am flight to Aswan on day three wants something different again. A traveller whose whole reason for coming is to be at the plateau at opening should be at Giza and should not be talked out of it.</p>

<p>Describe your mornings and the answer follows. That is genuinely how this gets decided.</p>

<p>The question worth asking instead is which of these three locations fits the week you have planned, and then which building in that location has rooms facing the right way on your dates.</p>

<!-- OWNER: first-hand paragraph fits here, on how the choice is usually made on a planning call -->

<h2 id="cairo-luxury-hotels-against-the-rest-of-the-trip">Cairo Luxury Hotels Against the Rest of the Trip</h2>

<p>This is the one city where the address changes the holiday, so it deserves the deliberation. Luxor and Aswan are small, and on the river you are choosing a boat rather than a neighbourhood.</p>

<p>Judged that way, the luxury hotels cairo has are a smaller decision than they look, and a larger one than the equivalent choice in Luxor.</p>

<p>Book the room after the dates, the boat and the internal flights are settled, because Cairo rooms rarely run out the way the good boats do.</p>

<p>The full list of <a href="/luxury-hotels-in-egypt">the properties we actually use</a> carries the specifics for each, <a href="/egypt-travel-guide/cairo-travel-guide">the Cairo guide</a> covers the city around them, and our <a href="/egypt-private-tour-packages">private itineraries</a> show how many nights it usually gets.</p>

<h2 id="where-luxury-hotels-in-cairo-egypt-sit-against-other-capital">Where Luxury Hotels in Cairo Egypt Sit Against Other Capitals</h2>

<p>Better value than the equivalent in Europe, and the reason is the exchange rate rather than the standard.</p>

<p>A room that would be the top of the market in London or Paris costs less here, and the service ratio is higher because staffing costs less. That is worth knowing because it changes what is reasonable to expect: a hotel at this level in Cairo should feel generously staffed.</p>

<p>The other difference is scale. Several of these buildings are very large by European standards, with a thousand rooms or more, and a hotel that size feels different from a hundred room property whatever the category on the door says. That is the real reason people choose the smallest one on the list.</p>

<p>Where it lags is consistency. The best are excellent and the variation across the bracket is wider than you would find in a European capital, which is why the six questions above matter more here.</p>

<aside class="related-posts" aria-label="Related reading"><h2 id="related-reading">Related reading</h2><ul><li><a href="/blog/where-to-stay-in-cairo">picking the right side of the city first</a></li><li><a href="/blog/private-tours-in-cairo-egypt">what three days here should hold</a></li><li><a href="/blog/planning-a-trip-to-egypt">where the city sits in the whole trip</a></li></ul></aside>

<p class="author-bio">Written by Hamdy Haggag, who has planned and run private journeys in Egypt for more than a decade and still takes the first call for every itinerary.</p>',
  'The category is crowded and the differences are not where the photographs suggest. What separates one grand Cairo hotel from another, and what to ask.',
  'Travel Planning',
  ARRAY['Cairo', 'Hotels', 'Luxury Travel']::text[],
  'luxury hotels cairo',
  'Luxury Hotels Cairo: What Separates Them',
  'Choosing between luxury hotels cairo offers is a choice about location and service, not about marble. What actually differs, and what to check before booking.',
  'published',
  '2026-11-21T09:00:00+02:00'::timestamptz,
  -- published_at and updated_at both take the scheduled moment as written.
  --
  -- published_at used to carry "AT TIME ZONE 'Africa/Cairo'" here, which is
  -- what you reach for when a value needs moving INTO Cairo time and is wrong
  -- for a string that already says +02:00. It converted the timestamptz to a
  -- naive local time and then let the server read it back as UTC, so every
  -- article in the two earlier waves stored 11:00 Cairo rather than 09:00.
  -- Nothing had noticed because scheduled_at, which decides visibility, never
  -- had the conversion and was always right; only datePublished in the
  -- BlogPosting was two hours out.
  --
  -- updated_at matches, so dateModified agrees with the "Last updated" line
  -- the article prints under its title. A row inserted today for November
  -- would otherwise claim it was last touched in September.
  '2026-11-21T09:00:00+02:00'::timestamptz,
  '2026-11-21T09:00:00+02:00'::timestamptz,
  '[{"id":"9e35c707-0aec-559a-b770-9c1b12bfd678","question":"Which area has the best luxury hotels in Cairo?","answer":"3 areas hold almost all of them: the Nile corniche between Garden City and Bulaq, Zamalek on the island, and Giza facing the plateau. The corniche suits most first visits because it reaches the museums and dinner without a drive. Giza suits anyone starting at the pyramids at opening."},{"id":"caf603e2-3c4d-5ae3-a21a-6474939c76af","question":"Is a 5 star rating in Egypt the same as elsewhere?","answer":"No. The classification is issued by the Ministry of Tourism and Antiquities and is a licensing category based on facilities and capacity rather than a running quality score. 2 hotels with the same 5 stars can be a decade apart in condition, and the rating does not move to say so."},{"id":"3f527781-f98d-5602-9da6-0b2d2c441ad3","question":"What is the difference between a river view and a city view room?","answer":"On the corniche it is the difference between the Nile and a car park, and it is the 1 upgrade reliably worth paying for. Away from the river it buys almost nothing. Ask for the side in writing at booking rather than at check in, when the good rooms have gone."},{"id":"cc54d919-cb6f-5394-af33-f9479dcefc37","question":"Do Cairo hotels serve breakfast early enough for a pyramid start?","answer":"The good ones do, and it is worth confirming rather than assuming. A hotel whose service starts at 7 is no use on a day you leave at 6, and most will arrange an earlier option or a box if asked in advance. It is 1 of the questions a brochure never answers."},{"id":"ce6e42a2-d1e4-55df-9252-c9be6c80b7a1","question":"Are Cairo luxury hotels noisy?","answer":"Some of the grandest addresses sit on the loudest roads, and the corniche carries traffic through all 24 hours. Higher floors solve most of it. Zamalek is quieter by a wide margin. Say you are a light sleeper when booking, because it is the easiest thing to fix before arrival."},{"id":"ff39a6a6-9027-5322-b673-930a33eb4abf","question":"Is it worth staying somewhere expensive in Cairo?","answer":"For what it buys at 6am, yes. On a trip with dawn starts the useful differences are reliable air conditioning, a kitchen you can trust, an early breakfast and a car that is waiting. Those 4 things, rather than the lobby, are what the category actually delivers here."},{"id":"e335a276-6ea7-5a30-bfc2-bee1a28b5d19","question":"How do Cairo hotels compare with European capitals?","answer":"Better value at the same standard, because of the exchange rate rather than the service, and more generously staffed for the same reason. The gap is consistency: the variation across the 5 star bracket is wider here than in a European capital, which is why the questions matter more."},{"id":"8b8c5439-cb9d-506b-b7ad-470964a0104d","question":"How far ahead should you book a luxury hotel in Cairo?","answer":"After the rest of the trip. Rooms here rarely run out the way the good river boats do, so settle the dates, the cruise and the internal flights first. The 1 exception is Christmas and New Year, when the best rooms go months ahead along with everything else."}]'::jsonb,
  'BlogPosting'
),
(
  'cairo-hotel-with-pyramid-view',
  'Cairo Hotel With Pyramid View: The Honest List',
  '<p class="post-byline">By <span>Hamdy Haggag</span>. Last updated: <time datetime="2026-11-24">24 November 2026</time>.</p>

<p>A cairo hotel with pyramid view means a hotel at Giza. The plateau sits on the far southwestern edge of the metropolitan area, an hour from the corniche in traffic, and nothing in central Cairo sees it. The question is really which Giza rooms face the right way, and how many of them there are.</p>

<aside class="key-takeaways" aria-label="Key takeaways"><h2 id="key-takeaways">Key takeaways</h2><ul><li>A real view means being at Giza. Central Cairo is an hour away and sees nothing.</li><li>Ask for the view in writing, by room category, and ask what percentage of rooms have one.</li><li>A partial or distant view is common and is not the same thing.</li><li>The view is worth most at dawn and dusk. Midday haze removes it several days a month.</li></ul></aside>

<nav class="toc" aria-label="On this page"><p>On this page</p><ol><li><a href="#why-this-is-a-giza-question">Why This Is a Giza Question</a></li><li><a href="#what-a-cairo-hotel-with-pyramid-view-actually-shows-you">What a Cairo Hotel With Pyramid View Actually Shows You</a></li><li><a href="#best-hotels-in-giza-with-pyramid-view">Best Hotels in Giza With Pyramid View</a></li><li><a href="#a-pyramid-view-hotel-giza-side-is-a-trade">A Pyramid View Hotel Giza Side Is a Trade</a></li><li><a href="#what-to-ask-before-you-pay-the-supplement">What to Ask Before You Pay the Supplement</a></li><li><a href="#partial-distant-and-other-careful-words">Partial, Distant and Other Careful Words</a></li><li><a href="#the-hours-when-the-view-is-worth-having">The Hours When the View Is Worth Having</a></li><li><a href="#sound-and-light-and-what-it-does-to-the-evening">Sound and Light, and What It Does to the Evening</a></li><li><a href="#hotels-in-cairo-with-pyramid-view-and-the-ones-that-say-so-l">Hotels in Cairo With Pyramid View, and the Ones That Say So Loosely</a></li><li><a href="#booking-a-cairo-hotel-with-pyramid-view">Booking a Cairo Hotel With Pyramid View</a></li><li><a href="#is-the-supplement-worth-it">Is the Supplement Worth It</a></li></ol></nav>

<h2 id="why-this-is-a-giza-question">Why This Is a Giza Question</h2>

<p>Cairo is enormous and the pyramids are at one end of it.</p>

<p>From the Nile corniche, where most of the city''s grand hotels stand, the plateau is roughly fifteen kilometres away across a dense, low, dusty skyline. On the clearest winter mornings you can make out the outline from a high floor. That is not a view, it is a sighting, and paying for it would be a mistake.</p>

<p>Anything advertised as a pyramid view from a central address deserves a direct question about which floor, which direction and what you would actually see in the photograph you take.</p>

<p>The geography is worth holding on to, because it explains every other answer on this page. Giza is not a district of Cairo the way Zamalek is. It is a separate city on the west bank that the metropolis has grown into, and the plateau sits at the edge of the desert beyond it.</p>

<p>Everything that makes the view good makes the location awkward, and the two facts are the same fact.</p>

<h2 id="what-a-cairo-hotel-with-pyramid-view-actually-shows-you">What a Cairo Hotel With Pyramid View Actually Shows You</h2>

<p>Close enough that the pyramids fill a window rather than punctuate a horizon.</p>

<p>At the foot of the plateau the Great Pyramid is a few hundred metres away and reads as architecture rather than as scenery. From a terrace at that distance you can see the courses of stone, the colour change through the day, and the queue forming at the entrance in the morning.</p>

<p>That is the thing people book this for, and it is genuinely worth booking. It is also rarer than the search results suggest.</p>

<p>The number of buildings close enough to deliver it is small, and a cairo hotel with pyramid view listing that runs to twenty properties is counting something else.</p>

<h2 id="best-hotels-in-giza-with-pyramid-view">Best Hotels in Giza With Pyramid View</h2>

<p>The <a href="/hotel/mena-house-hotel-egypt">Marriott Mena House</a> sits at the foot of the plateau on Pyramids Road and its own record describes pyramid views. It is the one property on our list where that claim is on the record rather than inferred.</p>

<p>There are other buildings at Giza with rooms facing the plateau, including a number of small guesthouses along the approach roads whose roof terraces are locally famous. We do not list them because we have not put guests in them, and recommending a hotel we do not use would be the same kind of guessing this page exists to avoid.</p>

<!-- OWNER: confirm which hotel belongs here -->

<!-- OWNER: first-hand paragraph fits here, on which rooms actually have the view and what guests say about it -->

<h2 id="a-pyramid-view-hotel-giza-side-is-a-trade">A Pyramid View Hotel Giza Side Is a Trade</h2>

<p>You gain the morning and the window. You lose the rest of the city.</p>

<p>Being twenty minutes from the gate rather than an hour turns an opening-time start from brutal into ordinary, and that single change improves a Cairo visit more than anything else available to you.</p>

<p>Against that: Giza is not somewhere to walk out into after dark, every dinner becomes a drive, and the museums and the older quarters are back across the city. For two nights that is a good trade. For five it is not.</p>

<p>The split most people end up happy with is two nights on the river and one at Giza before an early plateau morning. <a href="/blog/where-to-stay-in-cairo">The comparison of the four areas</a> goes through what each one costs you.</p>

<h2 id="what-to-ask-before-you-pay-the-supplement">What to Ask Before You Pay the Supplement</h2>

<p>Five questions, and the wording matters.</p>

<p>Which room categories face the pyramids, by name. What proportion of the rooms in that category have the view, because a pyramid view category sometimes means some of them.</p>

<p>Is it a full or a partial view. Is it from the room itself or from a balcony you share. And is the view confirmed on the booking, or merely requested.</p>

<p>Get the answer in writing. A view allocated on arrival is a view allocated to whoever checked in first.</p>

<h2 id="partial-distant-and-other-careful-words">Partial, Distant and Other Careful Words</h2>

<p>The vocabulary in this corner of the market does a lot of quiet work.</p>

<p>A partial view usually means you can see one pyramid, or part of one, past a building. A distant view means the plateau is visible and small. A side view means from the balcony if you lean. None of these is dishonest and none of them is the photograph you have in your head.</p>

<table>
<thead>
<tr><th>What it is called</th><th>What it usually means</th><th>Worth paying for</th></tr>
</thead>
<tbody>
<tr><td>Pyramid view</td><td>The plateau fills the window from the room</td><td>Yes, for one or two nights</td></tr>
<tr><td>Partial view</td><td>One pyramid, or part of one, past a building</td><td>Sometimes, at a smaller supplement</td></tr>
<tr><td>Distant view</td><td>The plateau is visible and small</td><td>Rarely</td></tr>
<tr><td>Side view</td><td>From the balcony, if you lean</td><td>No</td></tr>
<tr><td>Near the pyramids</td><td>A distance, not a view at all</td><td>Not a view claim</td></tr>
</tbody>
</table>

<p>If the description includes an adjective before the word view, ask what the adjective is doing.</p>

<p>The same applies to photographs. A wide lens from a roof terrace at the far end of a property tells you what the building can see, not what your room can, and the two are frequently different floors and different directions.</p>

<h2 id="the-hours-when-the-view-is-worth-having">The Hours When the View Is Worth Having</h2>

<p>Dawn and the last hour of daylight, and the difference is not small.</p>

<p>Early morning gives low gold light and clear air before the city has warmed up. The last hour before sunset does something similar from the other side. In between, and particularly from late morning to mid afternoon, haze reduces contrast and the pyramids flatten into the background.</p>

<p>Several days a month in spring the khamaseen puts enough dust in the air to remove the view altogether for a day or two. Nobody can promise otherwise and nobody should.</p>

<p>Plan to be on the terrace at both ends of the day. That is when the room earns what it cost.</p>

<p>Winter gives the better light and the clearer air of the two halves of the year. Summer mornings are workable and summer afternoons rarely are, which is another reason the season matters more here than at a hotel where the view is not the point.</p>

<h2 id="sound-and-light-and-what-it-does-to-the-evening">Sound and Light, and What It Does to the Evening</h2>

<p>There is a nightly sound and light show at the plateau, projected onto the monuments with a soundtrack.</p>

<p>From a hotel terrace nearby you will hear it and see the coloured lighting on the stone. Some guests find this the best free entertainment of the trip and some find it an intrusion on exactly the view they paid for.</p>

<p>Ask what time it runs on your dates if you have a strong feeling either way. It is predictable and easy to plan around once you know.</p>

<!-- OWNER: first-hand paragraph fits here, on how guests actually react to the evening show from the terrace -->

<h2 id="hotels-in-cairo-with-pyramid-view-and-the-ones-that-say-so-l">Hotels in Cairo With Pyramid View, and the Ones That Say So Loosely</h2>

<p>Several central Cairo hotels mention the pyramids in their descriptions. Read those mentions carefully, because most of them are measuring a distance rather than describing a window.</p>

<p>A hotel that says the Great Pyramid is roughly a thirty minute drive away has told you something true and useful. It has not told you there is a view, and the two sentences look similar in a list of search results.</p>

<p>The full list of <a href="/luxury-hotels-in-egypt">the hotels we actually use</a> carries each property''s own description, which is where that distinction is visible.</p>

<h2 id="booking-a-cairo-hotel-with-pyramid-view">Booking a Cairo Hotel With Pyramid View</h2>

<p>Earlier than the rest of the Cairo stay, because the rooms that face the right way are a small share of a small number of buildings.</p>

<p>Winter is the tight season, and Christmas and New Year are tighter still. If the view is the reason for the trip rather than a bonus on it, treat it the way you would treat a small boat on the river and hold it before anything else is ticketed.</p>

<p>Ask about the cancellation terms on the view specifically. A room that is refundable and a view that is not is an arrangement that exists.</p>

<h2 id="is-the-supplement-worth-it">Is the Supplement Worth It</h2>

<p>For one or two nights, on a first visit, yes. A hotel with pyramid view is one of the few room upgrades in Egypt that changes the trip rather than the comfort.</p>

<p>For a longer Cairo stay, no. The view stops registering after the second morning and the location cost keeps being paid every evening.</p>

<p>The <a href="/egypt-travel-guide/cairo-travel-guide">Cairo guide</a> covers the rest of the city, and our <a href="/egypt-private-tour-packages">private itineraries</a> show how the plateau morning is usually built.</p>

<aside class="related-posts" aria-label="Related reading"><h2 id="related-reading">Related reading</h2><ul><li><a href="/blog/where-to-stay-in-cairo">choosing which side of the city to sleep on</a></li><li><a href="/blog/private-pyramid-tours-egypt">what a private morning at the plateau buys</a></li><li><a href="/blog/luxury-hotels-cairo">how the grand city hotels differ</a></li></ul></aside>

<p class="author-bio">Written by Hamdy Haggag, who has planned and run private journeys in Egypt for more than a decade and still takes the first call for every itinerary.</p>',
  'The plateau is an hour from central Cairo, so the view is a Giza question rather than a Cairo one. What a real one looks like, and what to ask about it.',
  'Travel Planning',
  ARRAY['Cairo', 'Hotels', 'Giza Pyramids']::text[],
  'cairo hotel with pyramid view',
  'Cairo Hotel With Pyramid View: What Is Real',
  'A cairo hotel with pyramid view has to be at Giza, not in the city. What a real view means, which rooms have one, and what to ask before you pay for it.',
  'published',
  '2026-11-24T09:00:00+02:00'::timestamptz,
  -- published_at and updated_at both take the scheduled moment as written.
  --
  -- published_at used to carry "AT TIME ZONE 'Africa/Cairo'" here, which is
  -- what you reach for when a value needs moving INTO Cairo time and is wrong
  -- for a string that already says +02:00. It converted the timestamptz to a
  -- naive local time and then let the server read it back as UTC, so every
  -- article in the two earlier waves stored 11:00 Cairo rather than 09:00.
  -- Nothing had noticed because scheduled_at, which decides visibility, never
  -- had the conversion and was always right; only datePublished in the
  -- BlogPosting was two hours out.
  --
  -- updated_at matches, so dateModified agrees with the "Last updated" line
  -- the article prints under its title. A row inserted today for November
  -- would otherwise claim it was last touched in September.
  '2026-11-24T09:00:00+02:00'::timestamptz,
  '2026-11-24T09:00:00+02:00'::timestamptz,
  '[{"id":"941c968c-9787-567c-a202-a3c4082f4cb3","question":"Which Cairo hotel has a real view of the pyramids?","answer":"Marriott Mena House at the foot of the Giza plateau is the 1 on our list whose own record describes pyramid views. Other buildings at Giza have rooms facing the plateau, including small guesthouses on the approach roads, but we do not list hotels we have not put guests in."},{"id":"0c0b99bc-f661-5d82-a222-2148e415431b","question":"Can you see the pyramids from central Cairo hotels?","answer":"Barely, and not in any way worth paying for. The plateau is roughly 15 kilometres from the Nile corniche across a dense low skyline. On the clearest winter mornings a high floor can make out the outline. That is a sighting rather than a view, and haze removes it most days."},{"id":"7d8d2ba4-5199-575e-9470-65ee59660e56","question":"Is a pyramid view room worth the extra cost?","answer":"For 1 or 2 nights on a first visit, yes. It is 1 of the few upgrades in Egypt that changes the trip rather than the comfort. For a longer Cairo stay, no: the view stops registering after the second morning while the Giza location keeps costing you every evening."},{"id":"d353149c-2d80-510d-972c-24e65a00b9a6","question":"What is the difference between a full and a partial pyramid view?","answer":"A partial view usually means 1 pyramid, or part of 1, seen past a building. A distant view means the plateau is visible and small. A side view means from the balcony if you lean. None is dishonest and none is the photograph in your head, so ask what the adjective is doing."},{"id":"f3ce214c-854b-54e1-9371-7925b2c72693","question":"When is the pyramid view at its best?","answer":"Dawn and the last hour of daylight. Early morning gives low gold light and clear air; late afternoon does the same from the other side. Between late morning and mid afternoon haze flattens the pyramids into the background, and in spring the khamaseen can remove them for 1 or 2 days."},{"id":"a863ee15-b5d5-5d7d-ad2b-0fe4841e9d02","question":"Should you stay at Giza or on the Nile?","answer":"Giza for a short stay built around the plateau, the river for everything else. Staying at Giza turns a 60 minute dawn drive into a 20 minute one. The split most people end up happy with is 2 nights on the river and 1 at Giza before an early pyramid morning."},{"id":"c294cf0a-c4c2-5fad-b7db-ff0ffdb2f5b2","question":"How do you guarantee a pyramid view room?","answer":"Get it confirmed on the booking rather than requested. Then ask 5 things: which room categories face the plateau by name, what proportion of that category actually has it, whether the view is full or partial, whether it is from the room or a shared balcony, and whether it is guaranteed in writing."},{"id":"5d97b5dc-df3f-5eb3-9a19-220b0776bc62","question":"Can you see the sound and light show from a hotel at Giza?","answer":"From a nearby terrace, yes: both the coloured lighting on the stone and the soundtrack carry. Of 2 reactions, some guests call it the best free entertainment of the trip and others find it an intrusion on the view they paid for. Ask what time it runs on your dates and plan around it."}]'::jsonb,
  'BlogPosting'
),
(
  'best-hotels-in-luxor-egypt',
  'Best Hotels in Luxor Egypt: East Bank or West',
  '<p class="post-byline">By <span>Hamdy Haggag</span>. Last updated: <time datetime="2026-11-27">27 November 2026</time>.</p>

<p>Choosing among the best hotels in luxor egypt has to offer is a choice of river bank before it is a choice of building. The east bank gives you the town, the corniche and the two great temples. The west bank gives you the tombs, farmland and silence. The ferry between them takes about ten minutes.</p>

<aside class="key-takeaways" aria-label="Key takeaways"><h2 id="key-takeaways">Key takeaways</h2><ul><li>The choice is east bank or west bank, and it changes the trip more than the building does.</li><li>East bank: the town, the corniche, Karnak and Luxor Temple, restaurants, the airport.</li><li>West bank: quiet, farmland, the tombs on your doorstep and almost nothing open at night.</li><li>We do not currently list a Luxor hotel, so this page names none rather than guessing.</li></ul></aside>

<nav class="toc" aria-label="On this page"><p>On this page</p><ol><li><a href="#a-note-on-what-this-page-does-not-do">A Note on What This Page Does Not Do</a></li><li><a href="#east-bank-west-bank">East Bank, West Bank</a></li><li><a href="#the-case-for-the-east-bank">The Case for the East Bank</a></li><li><a href="#the-case-for-the-west-bank">The Case for the West Bank</a></li><li><a href="#where-to-stay-in-luxor-egypt-for-a-short-trip">Where to Stay in Luxor Egypt for a Short Trip</a></li><li><a href="#what-to-check-before-booking-anything-here">What to Check Before Booking Anything Here</a></li><li><a href="#getting-between-the-banks-and-why-it-shapes-the-day">Getting Between the Banks, and Why It Shapes the Day</a></li><li><a href="#the-season-matters-more-here-than-in-cairo">The Season Matters More Here Than in Cairo</a></li><li><a href="#families-and-longer-stays">Families and Longer Stays</a></li><li><a href="#luxury-hotels-in-luxor-egypt-and-the-historic-ones">Luxury Hotels in Luxor Egypt, and the Historic Ones</a></li><li><a href="#best-hotels-in-luxor-egypt-what-we-would-actually-do">Best Hotels in Luxor Egypt: What We Would Actually Do</a></li></ol></nav>

<h2 id="a-note-on-what-this-page-does-not-do">A Note on What This Page Does Not Do</h2>

<p>We do not currently have a Luxor property on our own list, so this page names no hotels.</p>

<p>That is deliberate rather than an oversight. Recommending a building we have not put guests into would be worth nothing to you, and the rest of this site is built on the opposite principle. What follows is the decision framework, which is the part that actually transfers.</p>

<!-- OWNER: confirm which hotel belongs here -->

<h2 id="east-bank-west-bank">East Bank, West Bank</h2>

<table>
<thead>
<tr><th></th><th>East bank</th><th>West bank</th></tr>
</thead>
<tbody>
<tr><td>On your doorstep</td><td>Karnak, Luxor Temple, the corniche, the souk</td><td>Valley of the Kings, Hatshepsut, the Nobles, Medinet Habu</td></tr>
<tr><td>Evenings</td><td>Restaurants, lit temples, a town that is awake</td><td>Almost nothing, and that is the point</td></tr>
<tr><td>Mornings</td><td>A ferry or a bridge before the tombs</td><td>Fifteen minutes to the first tomb</td></tr>
<tr><td>Airport</td><td>Close</td><td>Across the river, add half an hour</td></tr>
<tr><td>Suits</td><td>First visits, short stays, anyone who wants dinner out</td><td>Second visits, photographers, balloon mornings</td></tr>
</tbody>
</table>

<p>Neither is wrong. They are different holidays in the same town.</p>

<p>Anyone searching for the best hotels in luxor egypt is usually really asking which of those two columns they want, and the building question only starts once that is settled.</p>

<h2 id="the-case-for-the-east-bank">The Case for the East Bank</h2>

<p>It is where Luxor happens.</p>

<p>The corniche runs along the water with the temples at either end of a walkable stretch. Restaurants, the souk, the museum and the ferry are all within reach on foot, which after a week of being driven is a genuine relief. Most of the luxor egypt luxury hotels that exist are along this water.</p>

<p>Luxor Temple lit at night is a five minute walk from a good deal of that accommodation, and it is the best free thing in the city.</p>

<p>The corniche itself is worth the address. It is one of the few stretches in Egypt where walking beside the river in the evening is pleasant and unremarkable, and after Cairo that lands as a small luxury rather than a feature.</p>

<p>The cost is the morning. A west bank start means a ferry or a drive over the bridge south of town, and on a balloon morning that is a very early crossing.</p>

<!-- OWNER: first-hand paragraph fits here, on which bank guests choose and what they say afterwards -->

<h2 id="the-case-for-the-west-bank">The Case for the West Bank</h2>

<p>Quiet, and fifteen minutes from the tombs.</p>

<p>The west bank is farmland, villages and the Theban hills behind them. Waking up there puts you at the Valley of the Kings before the coaches, which is the same argument as staying at Giza and it works the same way.</p>

<p>It is also where the balloons launch, and a launch is well before dawn. Staying on that side turns a punishing start into a manageable one.</p>

<p>The cost is everything after six in the evening. There are few restaurants, the ferry runs less often after dark, and the town is across the water. Some travellers find that the best thing about it.</p>

<h2 id="where-to-stay-in-luxor-egypt-for-a-short-trip">Where to Stay in Luxor Egypt for a Short Trip</h2>

<p>East bank, near the corniche, if you have two nights.</p>

<p>Two nights in Luxor means one east bank day and one west bank day, and basing yourself where the evenings work makes the most of the little time there is. Add the ferry crossing to the west bank morning and accept it.</p>

<p>Three nights or more, and the split becomes interesting: two nights east, one west before a balloon or a dawn start at the tombs.</p>

<p>Packing twice for a three night stay sounds tiresome and takes about ten minutes in practice, since most of the luggage can stay in the car between the two.</p>

<h2 id="what-to-check-before-booking-anything-here">What to Check Before Booking Anything Here</h2>

<p>Six things, and they matter more in Luxor than in Cairo because the range of standards is wider.</p>

<p>Air conditioning that works in the room rather than in the corridor. A pool, which between May and September is not a luxury. Whether breakfast can start before a balloon pickup.</p>

<p>Then: how far the building actually is from the corniche or the ferry on foot, whether the river facing rooms are a separate category, and what the plan is if the power goes out.</p>

<p>Those six separate the good from the grand more reliably than any star rating does.</p>

<h2 id="getting-between-the-banks-and-why-it-shapes-the-day">Getting Between the Banks, and Why It Shapes the Day</h2>

<p>A public ferry crosses from the corniche all day and takes about ten minutes.</p>

<p>It is cheap, it is used by everybody, and it is the reason the two banks feel closer than a map suggests. Cars cross by the bridge south of town, which is a longer way round, so a west bank day usually means the ferry on foot and a car waiting on the other side.</p>

<p>After dark the ferry thins out. That single fact is most of why the west bank evenings are quiet and why an east bank base suits anyone who wants to eat out.</p>

<p>If you are ballooning, the pickup is before the ferry starts and is arranged by road regardless of which side you sleep on.</p>

<h2 id="the-season-matters-more-here-than-in-cairo">The Season Matters More Here Than in Cairo</h2>

<p>Luxor in July is a different town from Luxor in January.</p>

<p>Between May and September the middle of the day is not usable and the hotel becomes somewhere you sit for six hours rather than somewhere you sleep. The pool, the shade and the indoor space stop being extras and become the reason you chose the place.</p>

<p>In winter the opposite: you are out from dawn until dark and the building matters far less. A modest hotel in January and the same hotel in August are not the same purchase.</p>

<h2 id="families-and-longer-stays">Families and Longer Stays</h2>

<p>Luxor rewards a longer stay more than most people expect, and a pool is the reason.</p>

<p>Sites here are morning work. An afternoon at the hotel is not a wasted half day, it is what makes the next morning possible, and with children it is the whole difference between a good week and a mutiny. Judge the pool, the shade around it and whether it is heated in winter.</p>

<p>For a stay of four nights or more, the east bank wins again simply because there is somewhere to walk to when the afternoon gets long.</p>

<h2 id="luxury-hotels-in-luxor-egypt-and-the-historic-ones">Luxury Hotels in Luxor Egypt, and the Historic Ones</h2>

<p>Luxor has a handful of properties with genuine history on the corniche, of the kind that were built for the first generation of Nile travellers.</p>

<p>They are worth considering and they are worth reading about carefully, because age cuts both ways. A historic building can be the most memorable night of a trip or a room with plumbing from another era, and the same name covers both in different wings.</p>

<p>Ask which wing, which year it was last refurbished, and whether the room you are being sold is in the original building or a later addition.</p>

<p>Lists of the best hotels in luxor tend to lead with these properties for the history rather than the rooms, which is fair enough as long as you know that is what is being ranked.</p>

<h2 id="best-hotels-in-luxor-egypt-what-we-would-actually-do">Best Hotels in Luxor Egypt: What We Would Actually Do</h2>

<p>Base on the east bank for a first visit, cross early for the west bank day, and give Luxor three nights rather than two.</p>

<p>The temples here are the densest concentration of the ancient world anywhere, and two nights turns that into a forced march. The third night is the one that makes the difference between seeing Luxor and completing it.</p>

<p>The <a href="/egypt-travel-guide/attractions-in-luxor">Luxor guide</a> covers what is on each bank, <a href="/blog/nile-cruise-luxor-to-aswan">the river route</a> covers arriving or leaving by boat, and the full list of <a href="/luxury-hotels-in-egypt">the hotels we do use</a> covers Cairo and Aswan.</p>

<p>Our <a href="/egypt-private-tour-packages">private itineraries</a> show how many nights the town usually gets, which is more than most first drafts give it.</p>

<aside class="related-posts" aria-label="Related reading"><h2 id="related-reading">Related reading</h2><ul><li><a href="/blog/where-to-stay-in-cairo">the same decision in a much larger city</a></li><li><a href="/blog/luxury-hotels-cairo">how the grand Cairo properties differ</a></li><li><a href="/blog/cairo-hotel-with-pyramid-view">when a view is worth the location it costs</a></li></ul></aside>

<p class="author-bio">Written by Hamdy Haggag, who has planned and run private journeys in Egypt for more than a decade and still takes the first call for every itinerary.</p>',
  'A river runs through the decision. East bank for the town and the temples, west for the quiet and the tombs, and the ferry between them decides the rest.',
  'Travel Planning',
  ARRAY['Luxor', 'Hotels', 'Egypt Travel Planning']::text[],
  'best hotels in luxor egypt',
  'Best Hotels in Luxor Egypt: Which Bank to Pick',
  'Choosing between the best hotels in luxor egypt is really a choice of river bank. What each side gives you, what it costs at dawn, and what to check first.',
  'published',
  '2026-11-27T09:00:00+02:00'::timestamptz,
  -- published_at and updated_at both take the scheduled moment as written.
  --
  -- published_at used to carry "AT TIME ZONE 'Africa/Cairo'" here, which is
  -- what you reach for when a value needs moving INTO Cairo time and is wrong
  -- for a string that already says +02:00. It converted the timestamptz to a
  -- naive local time and then let the server read it back as UTC, so every
  -- article in the two earlier waves stored 11:00 Cairo rather than 09:00.
  -- Nothing had noticed because scheduled_at, which decides visibility, never
  -- had the conversion and was always right; only datePublished in the
  -- BlogPosting was two hours out.
  --
  -- updated_at matches, so dateModified agrees with the "Last updated" line
  -- the article prints under its title. A row inserted today for November
  -- would otherwise claim it was last touched in September.
  '2026-11-27T09:00:00+02:00'::timestamptz,
  '2026-11-27T09:00:00+02:00'::timestamptz,
  '[{"id":"63f78457-d5d3-5f6d-9078-09c98aeb6ee3","question":"Should you stay on the east or west bank in Luxor?","answer":"East bank for a first visit and for any stay of 2 nights or fewer. It has the corniche, both great temples, the restaurants and the airport, and evenings work without a plan. The west bank is quieter, 15 minutes from the tombs, and has almost nothing open after dark."},{"id":"aa6f9d05-0d43-56ba-afcd-2f8f32167315","question":"How many nights do you need in Luxor?","answer":"3 rather than 2. Luxor holds the densest concentration of ancient sites anywhere, and 2 nights turns that into a forced march with 1 east bank day and 1 west bank day and no slack. The third night is the difference between seeing the town and completing it."},{"id":"269d996d-1578-583b-bff2-512059a4962a","question":"Is it better to stay near the tombs or near the temples?","answer":"Near the temples, for most travellers. The east bank puts Karnak, Luxor Temple, dinner and the ferry within walking distance, and the west bank crossing takes about 10 minutes. Staying near the tombs only wins if you are ballooning or want to be at the Valley before the coaches."},{"id":"739138a3-1d5a-54d2-9830-8a3be637c104","question":"Which hotels do you recommend in Luxor?","answer":"None on this page, because we do not currently have a Luxor property on our own list. Recommending a building we have not put guests into would be guessing. The 6 checks further up transfer to any hotel you are considering, and they matter more here than in Cairo."},{"id":"4060a44f-4331-5aad-9e0b-56d55dd9d66c","question":"Does the season change which hotel to pick in Luxor?","answer":"More than anywhere else in Egypt. Between May and September the middle of the day is unusable, so the pool, the shade and the indoor space become the reason you chose the place. In the other 6 months you are out from dawn until dark and the building matters far less."},{"id":"0d773eed-9bb1-55bd-bf66-3494d9e9687e","question":"Are the historic hotels in Luxor worth it?","answer":"Sometimes, and the same name covers 2 quite different experiences. A historic wing can be the most memorable night of a trip or a room with plumbing from another era. Ask which wing, what year it was last refurbished, and whether the room is in the original building."},{"id":"2d95c876-4954-5bfe-be0f-cfdaed585452","question":"How do you get between the two banks?","answer":"A public ferry that takes about 10 minutes and runs frequently in daylight, or the bridge south of town by road, which is longer. The ferry is cheap, used by everyone, and less frequent after dark, which is 1 of the reasons the west bank evenings are so quiet."},{"id":"d05675b8-a905-540c-bf0f-35bc0e1c1062","question":"What should you check before booking a Luxor hotel?","answer":"6 things, and none of them is the star rating. Air conditioning in the room rather than the corridor. A working pool. Whether breakfast can start before a balloon pickup. The real walking distance to the corniche or ferry. Whether river facing rooms are a separate category. And the plan for a power cut."}]'::jsonb,
  'BlogPosting'
),
(
  'best-hotels-in-aswan',
  'Best Hotels in Aswan: The River Decides It',
  '<p class="post-byline">By <span>Hamdy Haggag</span>. Last updated: <time datetime="2026-11-30">30 November 2026</time>.</p>

<p>The best hotels in aswan are sorted by one thing before any other: what the window looks at. The town is small enough that location barely matters, and the river is wide enough here, full of islands and granite, that a room facing the wrong way misses the entire reason to be in Aswan.</p>

<aside class="key-takeaways" aria-label="Key takeaways"><h2 id="key-takeaways">Key takeaways</h2><ul><li>Aswan is small. The view from the room matters more here than the location does.</li><li>Three positions: the corniche, an island in the river, or the west bank looking back.</li><li>Two nights, either side of the cruise. It is the gentler of the two river cities.</li><li>Ask which way the room faces and whether the view is guaranteed or requested.</li></ul></aside>

<nav class="toc" aria-label="On this page"><p>On this page</p><ol><li><a href="#best-hotels-in-aswan-three-positions-on-the-water">Best Hotels in Aswan: Three Positions on the Water</a></li><li><a href="#the-corniche-and-why-most-people-are-there">The Corniche, and Why Most People Are There</a></li><li><a href="#philae-the-dam-and-what-fills-the-first-day">Philae, the Dam and What Fills the First Day</a></li><li><a href="#islands-and-what-they-change">Islands, and What They Change</a></li><li><a href="#the-west-bank-and-the-long-view">The West Bank, and the Long View</a></li><li><a href="#where-to-stay-in-aswan-for-a-cruise">Where to Stay in Aswan for a Cruise</a></li><li><a href="#how-many-nights">How Many Nights</a></li><li><a href="#evenings-in-aswan">Evenings in Aswan</a></li><li><a href="#what-to-check-before-you-book">What to Check Before You Book</a></li><li><a href="#the-best-hotel-in-aswan-egypt-depends-on-the-month">The Best Hotel in Aswan Egypt Depends on the Month</a></li><li><a href="#nubian-aswan-and-staying-in-it">Nubian Aswan, and Staying In It</a></li><li><a href="#what-we-would-actually-do">What We Would Actually Do</a></li></ol></nav>

<h2 id="best-hotels-in-aswan-three-positions-on-the-water">Best Hotels in Aswan: Three Positions on the Water</h2>

<table>
<thead>
<tr><th>Where</th><th>What you look at</th><th>Suits</th></tr>
</thead>
<tbody>
<tr><td>The corniche, east bank</td><td>The river, the feluccas and Elephantine opposite</td><td>Most stays, and anyone boarding a cruise</td></tr>
<tr><td>An island in the river</td><td>Water on more than one side, and the town from outside it</td><td>Anyone wanting quiet without distance</td></tr>
<tr><td>The west bank</td><td>The dunes, the tombs above, and the town across the water</td><td>Second visits and long afternoons</td></tr>
</tbody>
</table>

<p>Everything in Aswan is within twenty minutes of everything else, so this table is about outlook rather than convenience.</p>

<h2 id="the-corniche-and-why-most-people-are-there">The Corniche, and Why Most People Are There</h2>

<p>The east bank waterfront is where the town, the souk and the boats are.</p>

<p><a href="/hotel/old-cataract-aswan">The Old Cataract</a> sits on a granite bluff at the southern end of it, above the water and facing Elephantine. <a href="/hotel/movenpick-aswan">The Movenpick</a> is on Elephantine island itself, a short ferry from the corniche, which puts it in the second row of the table rather than the first.</p>

<p>Cruise boats moor along this stretch, which matters if you are joining one: an east bank address means walking to the boat rather than driving to it.</p>

<p>The souk is here too, and it is one of the better ones in Egypt for actually buying things rather than being sold them. Spices, scarves and Nubian basketwork, at prices that start high and settle quickly.</p>

<p>Everything on the east bank is walkable from everything else on it, which is not true of anywhere else on a classic Egypt route.</p>

<!-- OWNER: first-hand paragraph fits here, on which rooms and which outlooks guests remember -->

<h2 id="philae-the-dam-and-what-fills-the-first-day">Philae, the Dam and What Fills the First Day</h2>

<p>Worth knowing before you choose an address, because it is where you will actually be going.</p>

<p>Philae sits on an island reached by motorboat from a jetty south of town, and it is the reason most people come. The granite quarry with the unfinished obelisk is a short stop on the same road. The High Dam is beyond that, and it is more interesting as an explanation of the lake than as a sight in itself.</p>

<p>All three are south of the corniche and all three are a short drive from any hotel on this page. The address does not change that day.</p>

<h2 id="islands-and-what-they-change">Islands, and What They Change</h2>

<p>Elephantine sits in the middle of the river opposite the town, with Nubian villages on it and ruins at its southern tip.</p>

<p>Staying on an island means a ferry every time you want the corniche, which takes a few minutes and is charming twice and then is a ferry. What you get for it is water on several sides and evenings with no traffic at all.</p>

<p>For two nights that trade is usually worth making. For anyone who wants to wander into town after dinner it is not.</p>

<p>Check the last crossing time before you book rather than after. An island hotel whose boat stops at ten is a different proposition from one running until midnight, and neither publishes it prominently.</p>

<h2 id="the-west-bank-and-the-long-view">The West Bank, and the Long View</h2>

<p>Across the water there are dunes, the Tombs of the Nobles cut into the cliff, and the monastery behind.</p>

<p>A west bank room looks back at the town over the widest, prettiest stretch of the river in Egypt. The light in the late afternoon here is the thing photographers come for.</p>

<p>The cost is a boat for everything. There is no bridge at this point and no road round, so every trip into town is a crossing.</p>

<p>That suits a second visit rather than a first. If you have already done Philae and the souk and want two days of river and light, this is where to have them.</p>

<h2 id="where-to-stay-in-aswan-for-a-cruise">Where to Stay in Aswan for a Cruise</h2>

<p>The corniche, and confirm which side of the hotel the room is on.</p>

<p>If you are boarding a Nile boat here, an east bank address turns embarkation into a short walk with your bags. It also puts you near Philae and the airport road, which are the two things you will be leaving for.</p>

<p><a href="/blog/nile-cruise-luxor-to-aswan">The route between the two cities</a> covers what happens once you are aboard, in both directions.</p>

<h2 id="how-many-nights">How Many Nights</h2>

<p>Two, and they are among the easiest nights of an Egypt trip.</p>

<p>One day covers Philae, the granite quarry and the High Dam. The second is for a felucca, the Nubian villages, or doing very little, which in Aswan is a legitimate use of a day in a way it is not in Luxor.</p>

<p>Abu Simbel is a third day if you want it, out and back by road or air. It does not fit into either of the two above.</p>

<p>If your trip includes a sailing, those two nights usually sit at one end of it rather than both. Arriving the day before a cruise and leaving the morning after one is the common shape, and it works.</p>

<h2 id="evenings-in-aswan">Evenings in Aswan</h2>

<p>Quieter than Luxor and much quieter than Cairo, which is the point of the place.</p>

<p>The corniche walk after dark is pleasant and unremarkable, the souk stays open late, and a felucca at sunset is on almost every itinerary for the good reason that it is the best hour of the day here. Restaurants outside the hotels are fewer and simpler than in Luxor.</p>

<p>Most guests end up eating where they are staying more often than they expected, which makes the hotel restaurant a fair thing to ask about rather than an afterthought.</p>

<h2 id="what-to-check-before-you-book">What to Check Before You Book</h2>

<p>Five things, and the first is the whole game.</p>

<p>Which way does the room face, and is that guaranteed or requested. Is there a terrace or a balcony, because in Aswan you will use it. Is the pool heated in winter, since the evenings here are cooler than people expect.</p>

<p>Then: how long is the transfer from the airport, and if the hotel is on an island, what time does the last boat run.</p>

<p>Get the outlook confirmed in writing. A river view allocated at check in is a river view allocated to whoever arrived first.</p>

<!-- OWNER: first-hand paragraph fits here, on what guests do with the second day -->

<h2 id="the-best-hotel-in-aswan-egypt-depends-on-the-month">The Best Hotel in Aswan Egypt Depends on the Month</h2>

<p>Aswan is the hottest of the three cities on a classic itinerary and the difference between seasons is larger here than anywhere else.</p>

<p>From November to February it is close to perfect: warm days, cool evenings, and a terrace you will sit on. From May to September the shade, the pool and the air conditioning are the reason you picked the hotel, and everything else is secondary.</p>

<p>That shifts the answer. A beautiful room with a modest pool is right in January and wrong in August.</p>

<h2 id="nubian-aswan-and-staying-in-it">Nubian Aswan, and Staying In It</h2>

<p>There are guesthouses in the Nubian villages on the west bank and on Elephantine, painted and family run, and they are a genuinely different way to spend a night here.</p>

<p>We do not list them, because we have not put guests in them, and the standard varies in a way that a page like this cannot usefully summarise. If that appeals, ask rather than book blind.</p>

<p><a href="/egypt-travel-guide/aswan-egypt-attractions">The Aswan guide</a> covers the villages and what else is worth the time.</p>

<h2 id="what-we-would-actually-do">What We Would Actually Do</h2>

<p>Two nights on the corniche with a river facing room, boarding or leaving a boat at one end of it.</p>

<p>That is the shape almost every good Aswan stay takes, and the variations are about the view rather than the address. The best hotels in aswan egypt has are the ones where that view is confirmed rather than hoped for.</p>

<p>Judged that way the shortlist is short, which is the opposite of how it looks from a booking site.</p>

<p>The full list of <a href="/luxury-hotels-in-egypt">the hotels we use</a> carries each property''s own description, and our <a href="/egypt-nile-cruise-packages">Nile cruise itineraries</a> show how the nights either side of the sailing usually fall.</p>

<aside class="related-posts" aria-label="Related reading"><h2 id="related-reading">Related reading</h2><ul><li><a href="/blog/best-hotels-in-luxor-egypt">the same decision at the other river city</a></li><li><a href="/blog/where-to-stay-in-cairo">the version of this question in a huge city</a></li><li><a href="/blog/luxury-hotels-cairo">what separates the grand city properties</a></li></ul></aside>

<p class="author-bio">Written by Hamdy Haggag, who has planned and run private journeys in Egypt for more than a decade and still takes the first call for every itinerary.</p>',
  'A smaller, gentler town where the view from the room is most of the decision. What the three positions on the water give you, and which nights they suit.',
  'Travel Planning',
  ARRAY['Aswan', 'Hotels', 'Nubia']::text[],
  'best hotels in aswan',
  'Best Hotels in Aswan: Which Side of the Water',
  'The best hotels in aswan are judged on one thing above all: what the room looks at. Islands, the west bank dunes, or the corniche, and what each one suits.',
  'published',
  '2026-11-30T09:00:00+02:00'::timestamptz,
  -- published_at and updated_at both take the scheduled moment as written.
  --
  -- published_at used to carry "AT TIME ZONE 'Africa/Cairo'" here, which is
  -- what you reach for when a value needs moving INTO Cairo time and is wrong
  -- for a string that already says +02:00. It converted the timestamptz to a
  -- naive local time and then let the server read it back as UTC, so every
  -- article in the two earlier waves stored 11:00 Cairo rather than 09:00.
  -- Nothing had noticed because scheduled_at, which decides visibility, never
  -- had the conversion and was always right; only datePublished in the
  -- BlogPosting was two hours out.
  --
  -- updated_at matches, so dateModified agrees with the "Last updated" line
  -- the article prints under its title. A row inserted today for November
  -- would otherwise claim it was last touched in September.
  '2026-11-30T09:00:00+02:00'::timestamptz,
  '2026-11-30T09:00:00+02:00'::timestamptz,
  '[{"id":"76ae1380-1b7b-5176-a7ad-4cb1b42e040e","question":"Where should you stay in Aswan?","answer":"The east bank corniche, with a river facing room, for most stays. The town is small enough that everything is within 20 minutes, so the outlook matters more than the address. Islands give you quiet at the cost of a ferry, and the west bank gives the best light and needs a boat for everything."},{"id":"adee6c4a-9a04-547f-9042-1b6e1e084aa1","question":"How many nights do you need in Aswan?","answer":"2, and they are among the easiest of an Egypt trip. 1 day covers Philae, the granite quarry and the High Dam. The second is for a felucca, the Nubian villages or doing very little. Abu Simbel needs a third day, out and back by road or air, and does not fit into either."},{"id":"b029b66b-8401-5d01-be0c-fec1b24dc0fc","question":"Is it better to stay on an island or on the corniche?","answer":"The corniche, unless quiet is the priority. An island means a ferry every time you want the town, which is charming twice and then is a ferry. What you get is water on several sides and evenings with 0 traffic, which for 2 nights is often worth the crossing."},{"id":"05fa87fc-28ec-5af1-a900-6f4c6367fa30","question":"Which Aswan hotel is best for boarding a Nile cruise?","answer":"An east bank corniche address, because the boats moor along that stretch and embarkation becomes a walk rather than a drive with bags. It also puts you near Philae and the airport road, which are the 2 places you will be heading for either side of the sailing."},{"id":"297a9c36-bbc3-5ff5-bf33-5135021d741b","question":"Does the season change the best hotel in Aswan?","answer":"More than in Cairo or Luxor, because Aswan is the hottest of the 3 cities. From November to February a terrace and a view are what you want. From May to September the shade, the pool and the air conditioning become the reason you chose the place and everything else is secondary."},{"id":"0894ea6d-b85b-5cec-ae0e-dc505271d731","question":"Can you stay in a Nubian guesthouse in Aswan?","answer":"Yes, in the villages on the west bank and on Elephantine, and they are a genuinely different night. We do not list any, because we have not put guests in them and the standard varies in a way 1 page cannot usefully summarise. Ask rather than book blind."},{"id":"f2e58961-030a-5e89-8a1a-f87c81842d11","question":"What should you check before booking an Aswan hotel?","answer":"5 things, and the first is most of it. Which way the room faces and whether that is guaranteed. Whether there is a terrace or balcony, because here you will use it. Whether the pool is heated in winter. The airport transfer time. And on an island, what time the last boat runs."},{"id":"f05f4922-5d67-5838-a75b-eb6b7533badf","question":"Is Aswan worth more time than Luxor?","answer":"Less time, and it is the gentler of the 2. Luxor holds the densest concentration of ancient sites anywhere and rewards 3 nights. Aswan rewards 2, and rewards them differently: the pleasure here is the river and the pace rather than the number of monuments you get through."}]'::jsonb,
  'BlogPosting'
),
(
  '5-star-hotels-in-egypt',
  '5 Star Hotels in Egypt: What the Rating Means',
  '<p class="post-byline">By <span>Hamdy Haggag</span>. Last updated: <time datetime="2026-12-03">3 December 2026</time>.</p>

<p>The 5 star hotels in egypt you see listed share a licence rather than a standard. The classification is issued by the Ministry of Tourism and Antiquities and describes facilities and capacity: room sizes, restaurant counts, a pool, a certain level of staffing. It says very little about the condition of the building you will actually sleep in.</p>

<aside class="key-takeaways" aria-label="Key takeaways"><h2 id="key-takeaways">Key takeaways</h2><ul><li>The rating is issued by the Ministry of Tourism and Antiquities, not by a guide or a review site.</li><li>It classifies facilities and capacity. It is a licence to operate at a level, not a quality score.</li><li>Two hotels with the same five stars can be a decade apart in condition.</li><li>Check the seven things below instead. None of them appears on a star plaque.</li></ul></aside>

<nav class="toc" aria-label="On this page"><p>On this page</p><ol><li><a href="#who-awards-the-stars">Who Awards the Stars</a></li><li><a href="#what-5-star-hotels-in-egypt-are-guaranteed-to-have">What 5 Star Hotels in Egypt Are Guaranteed to Have</a></li><li><a href="#why-two-egypt-hotels-5-star-rated-can-be-so-different">Why Two Egypt Hotels 5 Star Rated Can Be So Different</a></li><li><a href="#the-seven-things-to-check-instead">The Seven Things to Check Instead</a></li><li><a href="#a-5-star-hotel-in-egypt-against-one-in-europe">A 5 Star Hotel in Egypt Against One in Europe</a></li><li><a href="#where-the-rating-matters-least">Where the Rating Matters Least</a></li><li><a href="#luxor-egypt-5-star-hotels-and-the-regional-spread">Luxor Egypt 5 Star Hotels and the Regional Spread</a></li><li><a href="#reading-a-listing-honestly">Reading a Listing Honestly</a></li><li><a href="#does-it-matter-at-all">Does It Matter at All</a></li><li><a href="#how-to-use-all-of-this">How to Use All of This</a></li></ol></nav>

<h2 id="who-awards-the-stars">Who Awards the Stars</h2>

<p>The Ministry of Tourism and Antiquities, as part of licensing a hotel to operate.</p>

<p>This matters because it is a different thing from the star systems travellers are used to. A rating from a guidebook or a review platform is an opinion about quality, renewed as opinion changes. A government classification is a permit that says a property meets a defined specification.</p>

<p>Both use the same symbol. They are not measuring the same thing, and the gap between them is where most disappointment in this category comes from.</p>

<p>It is also why the rating does not fall when a hotel does. A licence is reassessed against the specification, not against how the last hundred guests felt about the carpet.</p>

<h2 id="what-5-star-hotels-in-egypt-are-guaranteed-to-have">What 5 Star Hotels in Egypt Are Guaranteed to Have</h2>

<table>
<thead>
<tr><th>The rating covers</th><th>The rating says nothing about</th></tr>
</thead>
<tbody>
<tr><td>Minimum room sizes and a proportion of suites</td><td>When the rooms were last refurbished</td></tr>
<tr><td>A pool, and usually more than one restaurant</td><td>Whether the pool is heated in winter</td></tr>
<tr><td>Staffing levels and 24 hour reception</td><td>Whether anyone will answer at 5am</td></tr>
<tr><td>Air conditioning throughout</td><td>Whether it works in your particular room</td></tr>
<tr><td>Lifts, parking, conference space</td><td>Noise, outlook, or which way the room faces</td></tr>
</tbody>
</table>

<p>Read the left column as a floor and the right column as the actual decision.</p>

<p>Almost every complaint about 5 star hotels in egypt comes from the right hand column, and almost every defence of the rating comes from the left. Both sides are describing the same building accurately.</p>

<h2 id="why-two-egypt-hotels-5-star-rated-can-be-so-different">Why Two Egypt Hotels 5 Star Rated Can Be So Different</h2>

<p>Age, refurbishment cycle and ownership, mostly.</p>

<p>A property licensed at five stars in the 1990s keeps the classification as long as it keeps meeting the specification. Meeting a specification and being in good condition are different achievements, and a hotel can do the first for years while slipping on the second.</p>

<p>The international chains apply their own internal standards on top, which is the main reason a branded five star and an independent five star often feel a category apart. That is not a rule and there are excellent independents, but it explains the pattern.</p>

<p>The other factor is scale. Several Egyptian five star hotels are very large by European standards, and a thousand room property runs differently from a hundred room one whatever is on the plaque.</p>

<!-- OWNER: first-hand paragraph fits here, on where the rating has and has not matched what guests found -->

<h2 id="the-seven-things-to-check-instead">The Seven Things to Check Instead</h2>

<p>None of these appears on a star plaque and all of them decide your week.</p>

<p>When the rooms were last refurbished, and which wing. Whether breakfast can start before a dawn departure. Which way the room faces, and whether that is guaranteed or requested. Whether the pool is heated between November and February.</p>

<p>Then: whether the spa, gym or a restaurant is closed for works on your dates. How long the transfer takes at the hour you will actually travel. And what the plan is if the power goes out, because it occasionally does.</p>

<p>A hotel that answers all seven without hesitating is telling you how it is run. That is worth more than the classification.</p>

<p>Ask them by email rather than by phone, and keep the reply. A written answer about a guaranteed river view is worth something at check in; a remembered conversation is not.</p>

<h2 id="a-5-star-hotel-in-egypt-against-one-in-europe">A 5 Star Hotel in Egypt Against One in Europe</h2>

<p>Better value at the same nominal level, and more variable.</p>

<p>The exchange rate means a room at this level costs less here than the equivalent in a European capital, and staffing costs less too, so the service ratio is higher. A good Egyptian five star feels generously staffed in a way that has become rare elsewhere.</p>

<p>The variability is the other side of it. The spread between the best and the weakest carrying the same rating is wider here, which is precisely why the seven questions matter more.</p>

<h2 id="where-the-rating-matters-least">Where the Rating Matters Least</h2>

<p>On the river, and it is worth saying because the same word gets used.</p>

<p>Nile cruise boats carry star ratings too, awarded on a separate scale, and a five star boat and a five star hotel have almost nothing in common. On a boat the things that decide the week are the number of cabins, where it moors and whether it sails. The classification tells you none of that.</p>

<p>The same applies in the desert, where a camp is judged on its site and its crew rather than on facilities it does not have. A star rating for a tent under the chalk formations of the White Desert would be measuring the wrong thing entirely.</p>

<p>So the useful scope for the classification is city hotels, where it began and where the specification it describes actually maps onto what you are buying.</p>

<h2 id="luxor-egypt-5-star-hotels-and-the-regional-spread">Luxor Egypt 5 Star Hotels and the Regional Spread</h2>

<p>The rating behaves differently in different cities, because the market does.</p>

<p>Cairo has the deepest competition in the category and the most international brands, which tends to hold standards up. Aswan has a small number of properties and the view decides more than the rating. In Luxor the spread is the widest of the three, and the historic buildings on the corniche are the clearest example of a name covering two quite different experiences in different wings.</p>

<p>On the Red Sea the category means something else again, since a five star there is a resort rather than a city hotel, judged on beach, reef access and food over a week rather than on two nights.</p>

<h2 id="reading-a-listing-honestly">Reading a Listing Honestly</h2>

<p>Three phrases do most of the work and all three are worth pausing on.</p>

<p>Recently renovated, which has no defined meaning and can describe a lobby while the rooms are untouched. Deluxe or superior, which are the hotel''s own internal ladder rather than anything external. And city view, which in a building beside the Nile means the side away from the water.</p>

<p>None of these is dishonest. They are a vocabulary, and the useful move is to ask what each one means at that specific property rather than assuming it means what it did at the last one.</p>

<p>Photographs need the same treatment. A gallery shows the best room in the best category, and the category you booked may be two rungs below it.</p>

<h2 id="does-it-matter-at-all">Does It Matter at All</h2>

<p>Yes, as a floor, and that is not nothing on a trip like this.</p>

<p>On days that start at five in the morning and involve several hours in the heat, the things a five star licence reliably delivers are the things you actually need: working air conditioning, water you can drink, a kitchen you can trust and staff on duty at any hour. That is an unglamorous list and it is the honest answer.</p>

<p>Where it stops helping is in choosing between two properties that both have it. At that point the plaque is identical and everything that differs is in the seven questions.</p>

<!-- OWNER: first-hand paragraph fits here, on which properties have earned their rating over time -->

<h2 id="how-to-use-all-of-this">How to Use All of This</h2>

<p>Treat the stars as a filter and then ignore them. That is the whole of the advice on this page, and everything above is why.</p>

<p>Use the classification to narrow a long list to a short one, because the floor it guarantees is genuinely worth having. Then choose between what remains on outlook, condition and the answers to the seven questions, none of which the rating can give you.</p>

<p>The full list of <a href="/luxury-hotels-in-egypt">the hotels we actually use</a> carries each property''s own description. <a href="/egypt-travel-guide/cairo-travel-guide">The Cairo guide</a> covers the city most of them sit in, and our <a href="/egypt-private-tour-packages">private itineraries</a> show which nights usually go where.</p>

<p>Whatever else you take from this, do not book a 5 star hotels egypt search result on the strength of the number alone. It is a licence, and a licence is a starting point.</p>

<aside class="related-posts" aria-label="Related reading"><h2 id="related-reading">Related reading</h2><ul><li><a href="/blog/luxury-hotels-cairo">how the grand city properties differ</a></li><li><a href="/blog/best-hotels-in-aswan">where the view decides the choice</a></li><li><a href="/blog/best-hotels-in-luxor-egypt">picking a bank of the river first</a></li></ul></aside>

<p class="author-bio">Written by Hamdy Haggag, who has planned and run private journeys in Egypt for more than a decade and still takes the first call for every itinerary.</p>',
  'The rating is a licence, not a verdict, and two properties carrying it can be a decade apart. Who awards it, what it covers, and what to check instead.',
  'Travel Planning',
  ARRAY['Hotels', 'Egypt Travel Planning', 'Luxury Travel']::text[],
  '5 star hotels in egypt',
  '5 Star Hotels in Egypt: What the Stars Mean',
  'Not all 5 star hotels in egypt are the same hotel. Who awards the rating, what it actually guarantees, and the seven things to check instead of counting stars.',
  'published',
  '2026-12-03T09:00:00+02:00'::timestamptz,
  -- published_at and updated_at both take the scheduled moment as written.
  --
  -- published_at used to carry "AT TIME ZONE 'Africa/Cairo'" here, which is
  -- what you reach for when a value needs moving INTO Cairo time and is wrong
  -- for a string that already says +02:00. It converted the timestamptz to a
  -- naive local time and then let the server read it back as UTC, so every
  -- article in the two earlier waves stored 11:00 Cairo rather than 09:00.
  -- Nothing had noticed because scheduled_at, which decides visibility, never
  -- had the conversion and was always right; only datePublished in the
  -- BlogPosting was two hours out.
  --
  -- updated_at matches, so dateModified agrees with the "Last updated" line
  -- the article prints under its title. A row inserted today for November
  -- would otherwise claim it was last touched in September.
  '2026-12-03T09:00:00+02:00'::timestamptz,
  '2026-12-03T09:00:00+02:00'::timestamptz,
  '[{"id":"05df4ffa-fe15-5118-aa28-5482fab9907d","question":"Who awards 5 star ratings to hotels in Egypt?","answer":"The Ministry of Tourism and Antiquities, as part of licensing a hotel to operate at that level. It is 1 of 2 quite different things sharing a symbol: a government classification of facilities and capacity, rather than an opinion about quality of the kind a guidebook or a review platform publishes."},{"id":"890ca773-def4-521a-b0bf-7254f5d40664","question":"Are 5 star hotels in Egypt the same as 5 star hotels in Europe?","answer":"Better value at the same nominal level and more variable. The exchange rate makes a room cheaper and staffing cheaper, so the service ratio is higher. The spread between the best and the weakest carrying the rating is wider here, which is why the 7 checks matter more."},{"id":"26f1ca26-403b-50e3-a47d-a411b1961157","question":"What does a 5 star rating actually guarantee?","answer":"Minimum room sizes, a proportion of suites, a pool, usually more than 1 restaurant, staffing levels, 24 hour reception, air conditioning throughout, lifts and parking. It guarantees nothing about when the rooms were last refurbished or whether the air conditioning works in yours."},{"id":"322fa01f-fe67-5ef6-84ba-6a0c31d05825","question":"Why do two 5 star hotels in Egypt feel so different?","answer":"Age, refurbishment cycle, ownership and scale. A hotel licensed in the 1990s keeps the rating while it keeps meeting the specification, and meeting a specification is not the same as being in good condition. International chains add their own standards on top, which is most of the pattern."},{"id":"005f851e-6176-5687-883a-54de98463293","question":"What should you check instead of the star rating?","answer":"7 things, and none is on the plaque. When the rooms were last refurbished and which wing. Whether breakfast can start before a dawn departure. Which way the room faces, and whether that is guaranteed. Whether the pool is heated in winter. What is closed for works. The real transfer time. The plan for a power cut."},{"id":"6d0de43a-114e-5210-8fcb-fc96977677b0","question":"Do Nile cruise boats use the same star rating?","answer":"They carry ratings awarded on a separate scale, and a 5 star boat and a 5 star hotel have almost nothing in common. On the water the 3 things that decide the week are the number of cabins, where it moors at night and whether it sails, and no classification covers any of them."},{"id":"457a58b3-5e2b-5674-b573-b6fdbd250a19","question":"Is a 5 star hotel worth it in Egypt?","answer":"As a floor, yes. On days starting at 5am in real heat, what the licence reliably delivers is working air conditioning, water you can drink, a kitchen you can trust and staff on duty at any hour. Where it stops helping is choosing between 2 properties that both have it."},{"id":"44bc781b-d076-55f5-a358-0c101ca6abef","question":"Does the rating mean the same thing on the Red Sea?","answer":"No. A 5 star on the coast is a resort rather than a city hotel and is judged over a week on the beach, the reef access and the food, rather than over 2 nights on the room and the location. The same 5 stars describe a quite different kind of stay."}]'::jsonb,
  'BlogPosting'
)
ON CONFLICT (slug) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  -- The body is NOT overwritten once images are in it. Re-running a file after
  -- scripts/fill-post-images.ts once deleted every <figure> that script had
  -- inserted, silently, with the file reporting success.
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
  published_at = EXCLUDED.published_at,
  faqs = EXCLUDED.faqs,
  schema_type = EXCLUDED.schema_type,
  updated_at = now();

COMMIT;

-- ---------------------------------------------------------------------------
-- Verification. Every "bad" column below must read 0, and the row count must
-- be 6.
-- ---------------------------------------------------------------------------
SELECT count(*) AS rows_present FROM posts WHERE slug IN ('where-to-stay-in-cairo', 'luxury-hotels-cairo', 'cairo-hotel-with-pyramid-view', 'best-hotels-in-luxor-egypt', 'best-hotels-in-aswan', '5-star-hotels-in-egypt');

SELECT slug,
       length(meta_title) AS title_len,
       length(meta_description) AS meta_len,
       jsonb_array_length(faqs) AS faq_count,
       array_length(regexp_split_to_array(regexp_replace(body_en, '<[^>]+>', ' ', 'g'), '\s+'), 1) AS body_words,
       scheduled_at,
       published_at,
       CASE WHEN body_en LIKE '%<figure%' THEN 'body kept, it has figures in it'
            ELSE 'body written from this file' END AS body_en_outcome
FROM posts WHERE slug IN ('where-to-stay-in-cairo', 'luxury-hotels-cairo', 'cairo-hotel-with-pyramid-view', 'best-hotels-in-luxor-egypt', 'best-hotels-in-aswan', '5-star-hotels-in-egypt') ORDER BY scheduled_at;

SELECT 'where-to-stay-in-cairo' AS slug,
       (SELECT count(*) FROM regexp_matches(body_en, 'where to stay in cairo', 'gi')) AS primary_hits
FROM posts WHERE slug = 'where-to-stay-in-cairo';
SELECT 'luxury-hotels-cairo' AS slug,
       (SELECT count(*) FROM regexp_matches(body_en, 'luxury hotels cairo', 'gi')) AS primary_hits
FROM posts WHERE slug = 'luxury-hotels-cairo';
SELECT 'cairo-hotel-with-pyramid-view' AS slug,
       (SELECT count(*) FROM regexp_matches(body_en, 'cairo hotel with pyramid view', 'gi')) AS primary_hits
FROM posts WHERE slug = 'cairo-hotel-with-pyramid-view';
SELECT 'best-hotels-in-luxor-egypt' AS slug,
       (SELECT count(*) FROM regexp_matches(body_en, 'best hotels in luxor egypt', 'gi')) AS primary_hits
FROM posts WHERE slug = 'best-hotels-in-luxor-egypt';
SELECT 'best-hotels-in-aswan' AS slug,
       (SELECT count(*) FROM regexp_matches(body_en, 'best hotels in aswan', 'gi')) AS primary_hits
FROM posts WHERE slug = 'best-hotels-in-aswan';
SELECT '5-star-hotels-in-egypt' AS slug,
       (SELECT count(*) FROM regexp_matches(body_en, '5 star hotels in egypt', 'gi')) AS primary_hits
FROM posts WHERE slug = '5-star-hotels-in-egypt';

SELECT 'seo lengths out of range' AS check, count(*) AS bad FROM posts
WHERE slug IN ('where-to-stay-in-cairo', 'luxury-hotels-cairo', 'cairo-hotel-with-pyramid-view', 'best-hotels-in-luxor-egypt', 'best-hotels-in-aswan', '5-star-hotels-in-egypt') AND (length(meta_title) > 60 OR length(meta_description) NOT BETWEEN 150 AND 160);

SELECT 'faq count out of range' AS check, count(*) AS bad FROM posts
WHERE slug IN ('where-to-stay-in-cairo', 'luxury-hotels-cairo', 'cairo-hotel-with-pyramid-view', 'best-hotels-in-luxor-egypt', 'best-hotels-in-aswan', '5-star-hotels-in-egypt') AND jsonb_array_length(faqs) NOT BETWEEN 7 AND 8;

-- Answers are written to be quoted on their own by an AI answer engine, which
-- means 40 to 80 words each. Outside that they are either empty or too long.
SELECT 'faq answers outside 40-80 words' AS check, count(*) AS bad
FROM posts p, jsonb_array_elements(p.faqs) f
WHERE p.slug IN ('where-to-stay-in-cairo', 'luxury-hotels-cairo', 'cairo-hotel-with-pyramid-view', 'best-hotels-in-luxor-egypt', 'best-hotels-in-aswan', '5-star-hotels-in-egypt')
  AND array_length(regexp_split_to_array(trim(f->>'answer'), '\s+'), 1) NOT BETWEEN 40 AND 80;

-- The SEO overrides must be NULL, not empty strings, or the fallbacks break.
SELECT 'seo overrides stored as empty strings' AS check, count(*) AS bad FROM posts
WHERE slug IN ('where-to-stay-in-cairo', 'luxury-hotels-cairo', 'cairo-hotel-with-pyramid-view', 'best-hotels-in-luxor-egypt', 'best-hotels-in-aswan', '5-star-hotels-in-egypt')
  AND (canonical_url = '' OR robots = '' OR og_image = '' OR schema_type = '' OR featured_image_alt = '');

SELECT 'faq entries missing id, question or answer' AS check, count(*) AS bad
FROM posts p, jsonb_array_elements(p.faqs) f
WHERE p.slug IN ('where-to-stay-in-cairo', 'luxury-hotels-cairo', 'cairo-hotel-with-pyramid-view', 'best-hotels-in-luxor-egypt', 'best-hotels-in-aswan', '5-star-hotels-in-egypt')
  AND (coalesce(f->>'id','') = '' OR coalesce(f->>'question','') = '' OR coalesce(f->>'answer','') = '');

SELECT 'em or en dash present' AS check, count(*) AS bad FROM posts
WHERE slug IN ('where-to-stay-in-cairo', 'luxury-hotels-cairo', 'cairo-hotel-with-pyramid-view', 'best-hotels-in-luxor-egypt', 'best-hotels-in-aswan', '5-star-hotels-in-egypt')
  AND (body_en ~ '[\u2013\u2014]' OR meta_title ~ '[\u2013\u2014]' OR meta_description ~ '[\u2013\u2014]' OR title_en ~ '[\u2013\u2014]');

-- Tour links must sit at the site root. Anything under the category path 404s.
SELECT 'tour links under /luxury-egypt-tour-packages/' AS check, count(*) AS bad FROM posts
WHERE slug IN ('where-to-stay-in-cairo', 'luxury-hotels-cairo', 'cairo-hotel-with-pyramid-view', 'best-hotels-in-luxor-egypt', 'best-hotels-in-aswan', '5-star-hotels-in-egypt') AND body_en ~ 'href="/luxury-egypt-tour-packages/[^"]';

-- The hotel listing moved. A link to the old path still works through the 301,
-- and costs every reader a hop for no reason.
SELECT 'links to the old /stay path' AS check, count(*) AS bad FROM posts
WHERE slug IN ('where-to-stay-in-cairo', 'luxury-hotels-cairo', 'cairo-hotel-with-pyramid-view', 'best-hotels-in-luxor-egypt', 'best-hotels-in-aswan', '5-star-hotels-in-egypt') AND body_en ~ 'href="/stay';

SELECT 'unfilled placeholders' AS check, count(*) AS bad FROM posts
WHERE slug IN ('where-to-stay-in-cairo', 'luxury-hotels-cairo', 'cairo-hotel-with-pyramid-view', 'best-hotels-in-luxor-egypt', 'best-hotels-in-aswan', '5-star-hotels-in-egypt') AND (body_en LIKE '%data-placeholder=%' OR body_en ~ '\{\{[A-Z_]+\}\}');

SELECT 'other language columns left empty' AS check, count(*) AS bad FROM posts
WHERE slug IN ('where-to-stay-in-cairo', 'luxury-hotels-cairo', 'cairo-hotel-with-pyramid-view', 'best-hotels-in-luxor-egypt', 'best-hotels-in-aswan', '5-star-hotels-in-egypt')
  AND (title_es IS NOT NULL OR title_fr IS NOT NULL OR title_jp IS NOT NULL
       OR body_es IS NOT NULL OR body_fr IS NOT NULL OR body_jp IS NOT NULL);

-- The owner paragraphs are deliberately left as HTML comments for someone to
-- replace with a real first hand voice. This is a reminder, not a failure.
SELECT slug,
       (length(body_en) - length(replace(body_en, '<!-- OWNER:', ''))) / 11 AS owner_notes_awaiting_a_paragraph
FROM posts WHERE slug IN ('where-to-stay-in-cairo', 'luxury-hotels-cairo', 'cairo-hotel-with-pyramid-view', 'best-hotels-in-luxor-egypt', 'best-hotels-in-aswan', '5-star-hotels-in-egypt') ORDER BY slug;
