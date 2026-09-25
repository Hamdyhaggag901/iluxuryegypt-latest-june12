-- Wave "planning-cluster": 3 articles, loaded in one file.
--
--   2026-12-06T09:00:00+02:00  fayoum-oasis-egypt  (fayoum oasis egypt)
--   2026-12-09T09:00:00+02:00  valley-of-the-whales  (valley of the whales)
--   2026-12-12T09:00:00+02:00  aswan-old-cataract-hotel-egypt  (aswan old cataract hotel egypt)
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
--   fayoum-oasis-egypt
--     Palms and farmland running down to the water in fayoum oasis egypt at low sun
--   valley-of-the-whales
--     A fossil skeleton half exposed in pale sandstone at the valley of the whales in the Egyptian desert
--   aswan-old-cataract-hotel-egypt
--     The granite bluff and the Nile below the aswan old cataract hotel egypt at sunset
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
WHERE slug IN ('fayoum-oasis-egypt', 'valley-of-the-whales', 'aswan-old-cataract-hotel-egypt')
ORDER BY scheduled_at;

BEGIN;

INSERT INTO posts (
  slug, title_en, body_en, excerpt, category, tags,
  focus_keyword, meta_title, meta_description,
  status, scheduled_at, published_at, updated_at, faqs, schema_type
) VALUES
(
  'fayoum-oasis-egypt',
  'Fayoum Oasis Egypt: What Is Actually There',
  '<p class="post-byline">By <span>Hamdy Haggag</span>. Last updated: <time datetime="2026-12-06">6 December 2026</time>.</p>

<p>Fayoum oasis egypt is a wide green depression about ninety minutes southwest of Cairo, fed by a canal from the Nile rather than by springs. It holds a large salt lake, a protected desert with waterfalls, and a fossil site of genuine international importance. Most visitors see half of it and leave.</p>

<aside class="key-takeaways" aria-label="Key takeaways"><h2 id="key-takeaways">Key takeaways</h2><ul><li>Ninety minutes southwest of Cairo, fed by a canal from the Nile rather than by springs.</li><li>Lake Qarun, the Wadi Rayan waterfalls and the Valley of the Whales are the three draws.</li><li>One long day covers two of the three. Two days covers all of it without rushing.</li><li>Go between October and April. The desert half is unusable in summer heat.</li><li>A 4x4 and a permit are needed for the protected areas, so this is not a self drive trip.</li></ul></aside>

<nav class="toc" aria-label="On this page"><p>On this page</p><ol><li><a href="#not-actually-an-oasis">Not Actually an Oasis</a></li><li><a href="#fayoum-oasis-egypt-the-five-things-worth-the-drive">Fayoum Oasis Egypt: the Five Things Worth the Drive</a></li><li><a href="#qarun-lake-fayoum-egypt-and-what-to-expect">Qarun Lake Fayoum Egypt, and What to Expect</a></li><li><a href="#wadi-rayan-and-the-waterfalls">Wadi Rayan and the Waterfalls</a></li><li><a href="#the-valley-of-the-whales">The Valley of the Whales</a></li><li><a href="#tunis-village">Tunis Village</a></li><li><a href="#a-fayoum-day-trip-from-cairo-honestly">A Fayoum Day Trip From Cairo, Honestly</a></li><li><a href="#getting-there-and-getting-around">Getting There and Getting Around</a></li><li><a href="#the-ancient-sites-and-whether-to-bother">The Ancient Sites, and Whether to Bother</a></li><li><a href="#when-to-go">When to Go</a></li><li><a href="#what-to-bring">What to Bring</a></li><li><a href="#where-this-fits-in-a-trip">Where This Fits in a Trip</a></li></ol></nav>

<h2 id="not-actually-an-oasis">Not Actually an Oasis</h2>

<p>The name is a convenience rather than a description, and the distinction explains the place.</p>

<p>A true oasis sits on groundwater. Fayoum sits in a depression below sea level that has been fed for thousands of years by the Bahr Yussef, a channel branching from the Nile near Asyut. That makes it an irrigated basin, which is why it is farmland rather than palm groves around a spring.</p>

<p>The practical consequence is scale. This is a governorate with a city in it, over two million people, canals, fields and villages, not a scattering of huts around water. Arriving expecting a desert idyll is the most common disappointment here.</p>

<p>What it is instead is a green sheet with a lake at one end and a protected desert beyond that, which is a more interesting thing.</p>

<h2 id="fayoum-oasis-egypt-the-five-things-worth-the-drive">Fayoum Oasis Egypt: the Five Things Worth the Drive</h2>

<table>
<thead>
<tr><th>What</th><th>Where</th><th>Time needed</th><th>Verdict</th></tr>
</thead>
<tbody>
<tr><td>Lake Qarun</td><td>North edge of the depression</td><td>1 to 2 hours</td><td>Best at either end of the day</td></tr>
<tr><td>Wadi Rayan waterfalls and lakes</td><td>Protected area southwest</td><td>Half a day</td><td>Modest falls, good desert</td></tr>
<tr><td>Valley of the Whales</td><td>Deep in Wadi Rayan</td><td>Half a day, 4x4 only</td><td>The reason to come</td></tr>
<tr><td>Tunis village and its pottery</td><td>South shore of the lake</td><td>1 to 2 hours</td><td>Genuinely pleasant</td></tr>
<tr><td>Ancient sites: Karanis, Hawara, Meidum</td><td>Scattered</td><td>1 hour each</td><td>For the already interested</td></tr>
</tbody>
</table>

<p>Two of those five in one day is comfortable. Three is a long day. All five needs two.</p>

<p>Most people arriving at fayoum oasis egypt for the first time try for four and see three badly. The depression is wider than it looks on a map and the roads inside it are slower than the road that got you there.</p>

<h2 id="qarun-lake-fayoum-egypt-and-what-to-expect">Qarun Lake Fayoum Egypt, and What to Expect</h2>

<p>A large, shallow, salt lake at the lowest point of the depression, and older than almost anything else in the country.</p>

<p>It is the remnant of a far larger prehistoric lake, it has no outlet, and it has been getting saltier for millennia. That is why the fishing villages along it work a brackish lake rather than a freshwater one, and why the water looks the colour it does.</p>

<p>The north shore is bare and dramatic, with the desert coming down to the water. The south shore is farmland and villages. Birds are the reason a lot of visitors come: the lake sits on a major migration route and the winter counts are substantial.</p>

<p>Go at the beginning or the end of the day. In the middle it is a flat sheet of pale water under a white sky and it photographs like nothing at all.</p>

<!-- OWNER: first-hand paragraph fits here, on what guests react to most at the lake -->

<h2 id="wadi-rayan-and-the-waterfalls">Wadi Rayan and the Waterfalls</h2>

<p>A protected area southwest of the lake, with two artificial lakes and the waterfalls between them.</p>

<p>Manage the expectation on the falls. They are a few metres high, created in the 1970s when agricultural drainage was channelled into the depression, and they are a pleasant stop rather than a spectacle. Egyptians visit them in numbers at weekends and the atmosphere is the point.</p>

<p>The surrounding desert is the better half: dunes, ridges and long empty views, with the lakes below. There is a permit fee to enter the protected area and it is collected at a gate.</p>

<p>This is also the road to the fossil site, which is what most foreign visitors are really here for.</p>

<h2 id="the-valley-of-the-whales">The Valley of the Whales</h2>

<p>Deep inside Wadi Rayan, reachable only by 4x4, sits a UNESCO World Heritage Site holding the fossilised remains of early whales.</p>

<p>It is the single most internationally significant thing in the depression and it needs its own half day. The drive in is over soft sand and takes about an hour from the falls.</p>

<p>What is actually on display there is more modest than the name suggests and more interesting than the modesty implies, and it is the part of this trip people most often plan badly. Allow half a day and treat it as the destination rather than a stop.</p>

<h2 id="tunis-village">Tunis Village</h2>

<p>A small village on the ridge above the south shore, known for pottery.</p>

<p>A Swiss potter set up a school here decades ago and the craft took root. There are working studios, a pottery school, a handful of guesthouses and eco lodges, and views down over the lake. It has become the place people stay if they give Fayoum a night rather than a day.</p>

<p>It is genuinely pleasant and it is small. An hour or two, not an afternoon.</p>

<p>Buy something if you stop. The studios are working businesses rather than a display, and the pottery is good and absurdly cheap by the standards of anywhere you flew in from.</p>

<h2 id="a-fayoum-day-trip-from-cairo-honestly">A Fayoum Day Trip From Cairo, Honestly</h2>

<p>Possible, tiring, and better as two days if the fossils matter to you.</p>

<p>A fayoum day trip from cairo is roughly ninety minutes each way on a good road, which leaves seven or eight useful hours. That covers the lake and Wadi Rayan comfortably, or the lake and the Valley of the Whales at a push, but not all three.</p>

<p>Leaving Cairo at seven rather than nine changes what fits. The difference is an hour of traffic on the ring road, and it is the single most useful decision in planning this.</p>

<p>If you want the fossils without rushing, stay a night in Tunis village and do the desert on the second morning.</p>

<!-- OWNER: first-hand paragraph fits here, on how guests usually split the two days -->

<h2 id="getting-there-and-getting-around">Getting There and Getting Around</h2>

<p>A car and driver from Cairo, and a 4x4 with a local driver for the protected areas.</p>

<p>The road to Fayoum is straightforward. Inside the depression the distances are larger than a map suggests and the signage is thin. Into Wadi Rayan and out to the fossil site, a saloon car is not an option: the sand is soft and vehicles get stuck there regularly.</p>

<p>Permits for the protected area are bought at the gate and are the driver''s business rather than yours on an arranged trip.</p>

<p>Public transport reaches the city of al fayoum oasis egypt travellers pass through, and does not usefully reach any of the five things in the table above.</p>

<h2 id="the-ancient-sites-and-whether-to-bother">The Ancient Sites, and Whether to Bother</h2>

<p>Three of them, and they suit people who already care rather than people being introduced.</p>

<p>Karanis on the northern edge is a Graeco Roman town with standing mudbrick and two temples, and it is where the Fayoum mummy portraits came from. Hawara and Meidum are pyramid sites at the entrance to the depression, both badly weathered and both quieter than anything at Giza.</p>

<p>None of the three is a reason to make the drive on its own. All three are worth an hour if you are passing and the pyramids at Meidum in particular are a strange, steep, collapsed shape that no photograph prepares you for.</p>

<p>Add one of them to a day that is otherwise the lake and the desert, rather than trying to make an archaeological circuit of it.</p>

<h2 id="when-to-go">When to Go</h2>

<p>October to April, and the desert half decides it.</p>

<p>The lake and the villages are tolerable most of the year. Wadi Rayan and the fossil site are open desert with no shade at all, and between May and September the middle of the day there is genuinely dangerous rather than merely unpleasant.</p>

<p>Winter weekends are busy with Cairene visitors, which is fun at the waterfalls and less so if you came for quiet. A weekday in November or February is the best version of this trip.</p>

<h2 id="what-to-bring">What to Bring</h2>

<p>More water than you think, closed shoes, a hat and a wind layer.</p>

<p>The desert here is cold in the early morning in winter and windy most of the year. Sand gets into everything, which matters if you carry a camera with interchangeable lenses.</p>

<p>There is very little to buy once you leave the towns. Food and water for the desert half should be in the car before you set off.</p>

<p>Phone signal is patchy in Wadi Rayan and absent in places. That is worth knowing rather than worrying about, since the trip runs with a driver who knows the tracks, but it does mean telling somebody the plan before you go in.</p>

<h2 id="where-this-fits-in-a-trip">Where This Fits in a Trip</h2>

<p>As a day or two from Cairo, at either end of the classic route rather than in the middle of it.</p>

<p>El fayoum egypt is not on the way to anywhere you are going next. It is a detour from the capital, which is why it usually lands on an extra day at the start or after the Nile section rather than between them.</p>

<p><a href="/blog/planning-a-trip-to-egypt">The planning guide</a> covers the order the whole trip gets decided in, and where an extra day is best spent. <a href="/egypt-travel-guide/cairo-travel-guide">The Cairo guide</a> covers the city you will be leaving from.</p>

<p>Our <a href="/egypt-private-tour-packages">private itineraries</a> show the routes this usually attaches to, and adding it is a matter of one day rather than a redesign.</p>

<aside class="related-posts" aria-label="Related reading"><h2 id="related-reading">Related reading</h2><ul><li><a href="/blog/private-tours-in-cairo-egypt">the three days the city itself deserves</a></li><li><a href="/blog/best-time-to-visit-egypt">which months suit the desert</a></li><li><a href="/blog/egypt-travel-tips">the practical things that come up daily</a></li></ul></aside>

<p class="author-bio">Written by Hamdy Haggag, who has planned and run private journeys in Egypt for more than a decade and still takes the first call for every itinerary.</p>',
  'Not a true oasis, and not quite a day trip either. What the depression southwest of Cairo actually holds, which half of it is worth the drive, and when to go.',
  'Destinations',
  ARRAY['Fayoum', 'Day Trips', 'Western Desert']::text[],
  'fayoum oasis egypt',
  'Fayoum Oasis Egypt: A Day Trip Worth Making',
  'Fayoum oasis egypt is a depression fed by a canal rather than a spring, ninety minutes from Cairo. The lake, the fossils, the waterfalls, and what to skip.',
  'published',
  '2026-12-06T09:00:00+02:00'::timestamptz,
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
  '2026-12-06T09:00:00+02:00'::timestamptz,
  '2026-12-06T09:00:00+02:00'::timestamptz,
  '[{"id":"ef10623c-730f-5dd2-ae0e-7c8ea207c5b8","question":"Is Fayoum worth visiting from Cairo?","answer":"Yes, for 1 of 3 specific things: the fossil site in Wadi Rayan, the desert around it, or the pottery village above Lake Qarun. If none of those appeals, it is farmland 90 minutes from Cairo and there are better uses of the day. Go for the desert half rather than the green half."},{"id":"357ef621-96c7-5e40-921f-1747f084e5df","question":"Is Fayoum a real oasis?","answer":"Not in the strict sense. A true oasis sits on groundwater, and Fayoum is a depression fed by the Bahr Yussef, a channel branching from the Nile. That makes it an irrigated basin with over 2 million people, a city and canals, rather than palms around a spring."},{"id":"00fca973-c7ec-5886-b214-3336c9bdf10f","question":"How long does a Fayoum day trip from Cairo take?","answer":"About 90 minutes each way on a good road, leaving 7 or 8 useful hours. That covers 2 of the main sights comfortably. Leaving Cairo at 7 rather than 9 changes what fits, because the difference is an hour of ring road traffic at the start and again at the end."},{"id":"47714cb4-2a90-5dfe-9157-e75ed846bb8d","question":"Are the Wadi Rayan waterfalls worth seeing?","answer":"Manage the expectation. They are a few metres high and were created in the 1970s when agricultural drainage was channelled into the depression. The surrounding desert is the better half of the stop, and the falls are pleasant rather than a spectacle. Egyptians visit in numbers at weekends."},{"id":"c8b50e7a-4b89-5519-81e3-1a679d0b00a9","question":"Do you need a 4x4 in Fayoum?","answer":"For the protected areas, yes. The road into Fayoum is fine in any car, but the track to the fossil site is soft sand where vehicles get stuck regularly, and it is about 1 hour in from the waterfalls. Permits for the protected area are bought at the gate."},{"id":"65a238fb-b5f6-57cb-8789-e66976a27adf","question":"What is Lake Qarun?","answer":"A large shallow salt lake at the lowest point of the depression, and the remnant of a far larger prehistoric one. It has 0 outlet, so it has been getting saltier for millennia. It sits on a major bird migration route, which is why the winter counts draw visitors of their own."},{"id":"6f6222b4-2b78-51fb-983b-d647ffe6493e","question":"Is it better to visit Fayoum in 1 day or 2?","answer":"2 if the fossils matter to you. 1 long day covers the lake and the waterfalls, or the lake and the Valley of the Whales, but not all 3. Staying a night in Tunis village and doing the desert on the second morning is the version people come back happiest from."},{"id":"59513a82-b1f3-5359-b8e6-247a89724878","question":"When is the best time to visit Fayoum?","answer":"October to April, and the desert decides it. Wadi Rayan and the fossil site are open desert with 0 shade, and between May and September the middle of the day there is dangerous rather than uncomfortable. A weekday in November or February is the best version of the trip."}]'::jsonb,
  'BlogPosting'
),
(
  'valley-of-the-whales',
  'Valley of the Whales: What Is Actually on Show',
  '<p class="post-byline">By <span>Hamdy Haggag</span>. Last updated: <time datetime="2026-12-09">9 December 2026</time>.</p>

<p>Valley of the whales is a UNESCO World Heritage Site in the Egyptian Western Desert, inside the Wadi Rayan protected area southwest of Cairo. It holds fossil skeletons of early whales from a time when the Sahara was a shallow sea. They are laid out where they were found, on an open walking trail, with no roof over any of it.</p>

<aside class="key-takeaways" aria-label="Key takeaways"><h2 id="key-takeaways">Key takeaways</h2><ul><li>A UNESCO World Heritage Site in the Wadi Rayan protected area, in Fayoum governorate.</li><li>The fossils are skeletons of early whales that still had hind limbs, left where they were found.</li><li>It is an outdoor walking trail across desert, not a museum full of mounted skeletons.</li><li>4x4 only, about an hour of soft sand in from the waterfalls. Allow half a day.</li><li>October to April. There is no shade anywhere on the trail.</li></ul></aside>

<nav class="toc" aria-label="On this page"><p>On this page</p><ol><li><a href="#what-wadi-el-hitan-actually-is">What Wadi El Hitan Actually Is</a></li><li><a href="#what-you-can-actually-see">What You Can Actually See</a></li><li><a href="#the-whales-themselves">The Whales Themselves</a></li><li><a href="#why-that-distinction-matters-before-you-go">Why That Distinction Matters Before You Go</a></li><li><a href="#getting-to-the-valley-of-the-whales-egypt-keeps-behind-a-gat">Getting to the Valley of the Whales Egypt Keeps Behind a Gate</a></li><li><a href="#how-long-it-takes">How Long It Takes</a></li><li><a href="#when-to-go">When to Go</a></li><li><a href="#what-to-bring">What to Bring</a></li><li><a href="#the-rules-and-why-they-are-enforced">The Rules, and Why They Are Enforced</a></li><li><a href="#wadi-el-hitan-egypt-against-the-other-desert-days">Wadi El Hitan Egypt Against the Other Desert Days</a></li><li><a href="#facilities-and-what-is-not-there">Facilities, and What Is Not There</a></li><li><a href="#fitting-it-into-a-trip">Fitting It Into a Trip</a></li></ol></nav>

<h2 id="what-wadi-el-hitan-actually-is">What Wadi El Hitan Actually Is</h2>

<p>A stretch of eroded desert that was once seabed, now exposed by wind.</p>

<p>The Arabic name means the valley of the whales, and the whales in question are archaeocetes: early whales from a period when the group still had recognisable hind limbs. Those limbs are the reason the site matters. They are physical evidence of the transition from a land animal to a fully marine one, in a lineage where that transition is otherwise argued about rather than looked at.</p>

<p>The sea that laid the rock down is gone. What is left is pale sandstone and mudstone, shaped into ridges and hollows, with skeletal material weathering out of it.</p>

<p>UNESCO inscribed it in 2005. That is a shorthand for the fact that the concentration and the completeness of the material here are not matched elsewhere.</p>

<p>The site sits inside a larger protected area rather than standing alone, which is why reaching it involves a gate, a permit and a second drive after the one that got you to Fayoum. The protection is the reason the material is still in the ground to look at.</p>

<h2 id="what-you-can-actually-see">What You Can Actually See</h2>

<table>
<thead>
<tr><th>What is there</th><th>What it looks like</th><th>Expectation</th></tr>
</thead>
<tbody>
<tr><td>In situ skeletons</td><td>Vertebrae and ribs part exposed in pale rock</td><td>Real, and subtle. Look, do not expect a display</td></tr>
<tr><td>The marked trail</td><td>A walking loop across open desert with signs</td><td>Flat, sandy, no shade at all</td></tr>
<tr><td>The visitor centre</td><td>A small building with interpretation and some material</td><td>Modest. Check it is open</td></tr>
<tr><td>The landscape</td><td>Eroded ridges, hollows, and long empty views</td><td>The other half of the visit</td></tr>
<tr><td>Mangrove root fossils and shark teeth</td><td>Scattered in the rock along the trail</td><td>Easy to walk past without a guide</td></tr>
</tbody>
</table>

<p>Say the part nobody says: this is not a hall of mounted skeletons. It is a site where fossils are left in the ground and you walk past them, and that is the point of it rather than a shortcoming.</p>

<h2 id="the-whales-themselves">The Whales Themselves</h2>

<p>Worth a paragraph, because it is the reason anybody made the drive.</p>

<p>The animals preserved here belong to a group that had already gone back to the water but had not finished the journey. They were long bodied and fully aquatic in habit, and they still carried small hind limbs with recognisable feet, which served no purpose for swimming and had not yet disappeared.</p>

<p>That is the whole significance in one sentence: a limb on its way out, on an animal already committed to the sea. Almost nowhere else is that stage represented by this many reasonably complete individuals in one place.</p>

<p>Other things from the same seabed turn up along the trail, including sharks and sea cows, and the guides will point at them if asked.</p>

<h2 id="why-that-distinction-matters-before-you-go">Why That Distinction Matters Before You Go</h2>

<p>Because the name sets an expectation the place does not try to meet.</p>

<p>People arrive imagining something like a natural history museum in a desert setting. What is there is quieter: partly exposed bone in rock, marked and protected, across a landscape that does most of the emotional work.</p>

<p>Visitors who understand that in advance describe it as one of the best days of the trip. Visitors who do not tend to be finished in twenty minutes and disappointed.</p>

<p>Take a guide who knows the trail. Half of what is on it is invisible until somebody points at it, and that is not a failure of attention on your part.</p>

<!-- OWNER: first-hand paragraph fits here, on how guests actually react once they are on the trail -->

<h2 id="getting-to-the-valley-of-the-whales-egypt-keeps-behind-a-gat">Getting to the Valley of the Whales Egypt Keeps Behind a Gate</h2>

<p>4x4 only, with a driver who has done it.</p>

<p>The route runs from Cairo to Fayoum, through the Wadi Rayan protected area past the waterfalls, and then about an hour further on soft sand tracks. A saloon car does not make the last stretch and vehicles get stuck there regularly.</p>

<p>There is a permit for the protected area, bought at the gate, and a separate charge at the site itself. On an arranged trip both are the driver''s business.</p>

<p>Total driving from Cairo is roughly three hours each way once the sand is counted. That is what makes this a full day rather than a stop.</p>

<h2 id="how-long-it-takes">How Long It Takes</h2>

<p>Half a day at the site, and a full day door to door from Cairo.</p>

<p>The trail itself is a walk of an hour or two at a reasonable pace, longer if you stop at everything and have somebody explaining it. The visitor centre adds twenty minutes if it is open.</p>

<p>Combining it with the waterfalls and Lake Qarun in one day from Cairo is possible and rushed. Staying a night in Fayoum and coming out in the morning is better and is what we would suggest.</p>

<p><a href="/blog/fayoum-oasis-egypt">The wider Fayoum guide</a> covers the lake, the pottery village and how the two days usually split.</p>

<h2 id="when-to-go">When to Go</h2>

<p>October to April, and this is not a preference.</p>

<p>The trail is open desert with no shade on any part of it and the walk takes an hour or more. Between May and September the middle of the day there is genuinely unsafe rather than uncomfortable, and a morning start is the only version that works even at the edges of the season.</p>

<p>Winter mornings are cold in the desert before the sun gets up. Bring a layer you can take off.</p>

<p>Weekends bring Egyptian visitors to the waterfalls in numbers, but relatively few make it this far in. A weekday is quieter and a weekend is still fine.</p>

<h2 id="what-to-bring">What to Bring</h2>

<p>Water, closed shoes with grip, a hat, sun cream and something for the wind.</p>

<p>There is nothing to buy once you are past the gate. The sand is fine and gets into cameras, so anything with interchangeable lenses wants a bag that closes.</p>

<p>Binoculars are more useful than you would think, for reading the far ridges rather than for wildlife.</p>

<p>A printed or downloaded map of the trail is worth having if you are the kind of visitor who likes to know where the loop goes. Signal is unreliable and the signage on the ground assumes you are with somebody who has been before.</p>

<h2 id="the-rules-and-why-they-are-enforced">The Rules, and Why They Are Enforced</h2>

<p>Stay on the marked trail, touch nothing, remove nothing.</p>

<p>These are not decorative rules. The material is fragile, it is in the open, and the site has an active problem with visitors picking things up. Fossil theft is the reason some of the most significant specimens have been moved.</p>

<p>Drones are prohibited, as they are at most protected and archaeological sites in Egypt, and the prohibition here is enforced.</p>

<p>Photography of the fossils and the landscape is fine and expected.</p>

<p>There is a practical reason the trail is marked rather than open. The surface is soft in places and footfall damages material that has not yet been mapped, which in a site of this size is most of it.</p>

<!-- OWNER: first-hand paragraph fits here, on what the guides say about how the site has changed -->

<h2 id="wadi-el-hitan-egypt-against-the-other-desert-days">Wadi El Hitan Egypt Against the Other Desert Days</h2>

<p>It is the most significant and the least dramatic of Egypt''s desert excursions, and both halves of that are true.</p>

<p>The White Desert has the more extraordinary landscape. The Western Desert oases have more to do in them. This has the thing that is scientifically irreplaceable, in a setting that is good rather than spectacular.</p>

<p>If you have one desert day and want to be astonished, go north to the chalk formations. If you have one desert day and want to stand next to something that changed what we know, come here.</p>

<h2 id="facilities-and-what-is-not-there">Facilities, and What Is Not There</h2>

<p>Almost nothing, and planning around that is most of the preparation.</p>

<p>There is a visitor centre, there are shelters at intervals along the trail, and there are basic toilets. There is no cafe, no shop, and no reliable phone signal. Everything you will eat and drink has to be in the car before you pass the gate.</p>

<p>Opening hours are daylight and it is sensible to confirm them for your date rather than assume, since the protected area gate and the site itself are separate operations and either can change.</p>

<p>Accessibility is limited by the ground rather than by the facilities. The trail is sand and uneven rock, and there is no alternative route.</p>

<h2 id="fitting-it-into-a-trip">Fitting It Into a Trip</h2>

<p>A day out of Cairo, at the start of a trip or after the Nile section rather than between them.</p>

<p>It is a detour rather than a waypoint, which is the same shape as the rest of Fayoum. <a href="/blog/planning-a-trip-to-egypt">The planning guide</a> covers where a spare day does most good, and the answer is usually here or in Cairo itself.</p>

<p><a href="/egypt-travel-guide/cairo-travel-guide">The Cairo guide</a> covers the city you will leave from at seven in the morning, and our <a href="/egypt-private-tour-packages">private itineraries</a> show the routes an extra desert day attaches to most easily.</p>

<aside class="related-posts" aria-label="Related reading"><h2 id="related-reading">Related reading</h2><ul><li><a href="/blog/private-tours-in-cairo-egypt">what the city itself needs first</a></li><li><a href="/blog/best-time-to-visit-egypt">the months that make the desert possible</a></li><li><a href="/blog/egypt-travel-tips">the practical rules for days like this</a></li></ul></aside>

<p class="author-bio">Written by Hamdy Haggag, who has planned and run private journeys in Egypt for more than a decade and still takes the first call for every itinerary.</p>',
  'A UNESCO desert site with fossil whales left where they were found. What is genuinely visible, what a museum would show you instead, and how to plan the day.',
  'Destinations',
  ARRAY['Fayoum', 'Western Desert', 'Day Trips']::text[],
  'valley of the whales',
  'Valley of the Whales: The Fossils, Honestly',
  'Valley of the whales is a UNESCO site in the Egyptian desert holding fossil skeletons of early whales. What you can see, what you cannot, and how to get there.',
  'published',
  '2026-12-09T09:00:00+02:00'::timestamptz,
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
  '2026-12-09T09:00:00+02:00'::timestamptz,
  '2026-12-09T09:00:00+02:00'::timestamptz,
  '[{"id":"9382f2af-c113-5180-9099-c64f2dcc809d","question":"What is the Valley of the Whales?","answer":"A UNESCO World Heritage Site in the Egyptian Western Desert, inscribed in 2005, holding fossil skeletons of early whales from a period when the group still had hind limbs. The rock was seabed. The fossils are left where they were found, on an open walking trail."},{"id":"0ed2cd56-14fc-5d6e-8a3b-23fdbbc9d74b","question":"Is the Valley of the Whales worth visiting?","answer":"Yes, if you know what it is before you go. It is not a hall of mounted skeletons. It is partly exposed bone in rock across open desert, marked and protected, and about half of it is invisible without a guide. Visitors who expect a museum are usually finished in 20 minutes."},{"id":"6c02b20e-c6f8-5471-9c6e-19bccfb8ccec","question":"How do you get to Wadi El Hitan?","answer":"4x4 only, with a driver who has done it. The route runs Cairo to Fayoum, through the Wadi Rayan protected area past the waterfalls, then about 1 hour further on soft sand. A saloon car does not make that last stretch, and vehicles get stuck there regularly."},{"id":"6711f5ba-9e6e-5eda-973d-be99fbf838fe","question":"How long does the visit take?","answer":"Half a day at the site and a full day door to door from Cairo, since the driving is around 3 hours each way once the sand is counted. The trail itself is a walk of 1 to 2 hours, longer with someone explaining it, and the visitor centre adds about 20 minutes."},{"id":"f6c3824f-7362-50e1-a32f-e3117f7e001b","question":"What is the difference between Wadi El Hitan and the White Desert?","answer":"Significance against spectacle. This site holds material that is scientifically irreplaceable in a landscape that is good rather than extraordinary. The White Desert, several hours further out, has the more astonishing scenery and nothing of comparable scientific weight. 2 quite different desert days."},{"id":"b7b8c581-85f0-5ccb-93f3-0cce8b695fbb","question":"When is the best time to visit?","answer":"October to April, and it is not a preference. The trail is open desert with 0 shade and the walk takes an hour or more, so between May and September the middle of the day is unsafe rather than uncomfortable. Winter mornings are cold before the sun is up."},{"id":"1ab3f0d6-1e22-5201-9b32-76543fc08ec8","question":"Can you touch or collect the fossils?","answer":"No, and all 3 parts of the rule are enforced. Stay on the marked trail, touch nothing, remove nothing. The material is fragile and in the open, and fossil theft is the reason several of the most significant specimens have been moved. Drones are prohibited, as at most protected sites in Egypt."},{"id":"50fdbbd0-d741-5e13-8b3e-bc9bb589c907","question":"Can you combine it with the Fayoum waterfalls in one day?","answer":"Possible and rushed. A single day from Cairo covers 2 of the 3 main stops comfortably and 3 at a push, with 6 hours of driving around them. Staying 1 night in Fayoum and coming out to the desert in the morning is the version people come back happiest from."}]'::jsonb,
  'BlogPosting'
),
(
  'aswan-old-cataract-hotel-egypt',
  'Aswan Old Cataract Hotel Egypt: History and Terrace',
  '<p class="post-byline">By <span>Hamdy Haggag</span>. Last updated: <time datetime="2026-12-12">12 December 2026</time>.</p>

<p>The aswan old cataract hotel egypt travellers ask for by name sits on a granite bluff above the Nile, facing Elephantine Island. It was built for the first generation of people who came up the river to spend a winter somewhere warm. Most of its modern fame, though, comes from Agatha Christie rather than from anything an architect did.</p>

<aside class="key-takeaways" aria-label="Key takeaways"><h2 id="key-takeaways">Key takeaways</h2><ul><li>A Victorian hotel on a granite bluff facing Elephantine Island, built for the first Nile travellers.</li><li>Its fame comes from Agatha Christie and Death on the Nile more than from anything architectural.</li><li>The terrace at sunset is the thing people come for, and non residents can often visit it.</li><li>Booking is direct with the hotel. We are not its agent and quote no rates.</li></ul></aside>

<nav class="toc" aria-label="On this page"><p>On this page</p><ol><li><a href="#what-the-aswan-old-cataract-hotel-egypt-actually-is">What the Aswan Old Cataract Hotel Egypt Actually Is</a></li><li><a href="#the-old-cataract-hotel-aswan-and-agatha-christie">The Old Cataract Hotel Aswan and Agatha Christie</a></li><li><a href="#the-terrace-which-is-the-real-attraction">The Terrace, Which Is the Real Attraction</a></li><li><a href="#the-three-ways-people-do-it">The Three Ways People Do It</a></li><li><a href="#visiting-without-staying">Visiting Without Staying</a></li><li><a href="#staying-there">Staying There</a></li><li><a href="#where-the-old-cataract-aswan-sits-in-the-town">Where the Old Cataract Aswan Sits in the Town</a></li><li><a href="#what-it-is-not">What It Is Not</a></li><li><a href="#when-to-come">When to Come</a></li><li><a href="#how-to-actually-plan-it">How to Actually Plan It</a></li></ol></nav>

<h2 id="what-the-aswan-old-cataract-hotel-egypt-actually-is">What the Aswan Old Cataract Hotel Egypt Actually Is</h2>

<p>A late Victorian hotel of the kind that went up along the river once Nile travel turned into an industry.</p>

<p>It stands on rock rather than on the flat, and that is the single thing that makes it work. The terrace looks down and across at the islands and the west bank dunes instead of out at the same level as everything else. That elevation is why the photographs all look the same, and why they are all good.</p>

<p>It has been extended and restored more than once, and there is a modern wing alongside the historic building. The two are not the same experience, and the distinction matters a great deal if you are booking a room rather than a table.</p>

<p>The setting does most of the work. Granite, water, palms on the far bank, and a stretch of the river that is wider and slower here than anywhere downstream. Take the building away and the view from that rock would still be the best in the town.</p>

<!-- OWNER: confirm the build date, the original operator and the current wing names before publishing -->

<h2 id="the-old-cataract-hotel-aswan-and-agatha-christie">The Old Cataract Hotel Aswan and Agatha Christie</h2>

<p>This is the association that drives almost every search for the place, and it is worth being precise about it.</p>

<p>Christie stayed here, and the hotel is the one most firmly attached to Death on the Nile in the public imagination. The novel is set on a Nile steamer rather than in a hotel, but Aswan and this building sit in the background of the story and of the screen versions that followed it.</p>

<p>There is a suite named for her. Whether any particular passage was written inside this building is the kind of claim that gets repeated far more confidently than the evidence supports, and we are not going to repeat it.</p>

<!-- OWNER: confirm the Agatha Christie suite name and which film adaptations actually filmed here -->

<p>What is true and checkable is that the agatha christie hotel egypt visitors ask for by that name is this one, and that the staff are entirely used to the question. Nobody at the desk will be surprised by it.</p>

<p>If the books are the reason you are coming, read the novel before you sit on the terrace rather than after. The geography in it makes a great deal more sense once you have seen the river from up there.</p>

<h2 id="the-terrace-which-is-the-real-attraction">The Terrace, Which Is the Real Attraction</h2>

<p>An open terrace above the river, facing west, at the hour the sun goes down behind the dunes.</p>

<p>Feluccas cross below, the light goes orange and then pink on the granite, and the whole thing lasts about forty minutes. It is the single best sit down hour in Aswan and it is not close.</p>

<p>Afternoon tea on that terrace is an institution. It is also the way most people experience the hotel, because you do not have to be staying there to do it.</p>

<p>Go early enough to get a table at the rail. The difference between the front row and the row behind it is the difference between the view and a view of other people enjoying the view.</p>

<h2 id="the-three-ways-people-do-it">The Three Ways People Do It</h2>

<p>Visit for an hour, stay in the historic building, or stay in the modern wing. Three different decisions, with three different booking problems attached to them.</p>

<table>
<thead>
<tr><th>How you do it</th><th>What it gets you</th><th>What to book</th><th>Who it suits</th></tr>
</thead>
<tbody>
<tr><td>Tea or a drink on the terrace</td><td>The view, the building and the atmosphere for an hour or so</td><td>A table, direct with the hotel, timed for sunset</td><td>Anyone already in Aswan for a night or two</td></tr>
<tr><td>A night in the historic building</td><td>The rooms and corridors people come for, with the terrace downstairs</td><td>A river facing room in the historic wing, early for winter</td><td>Travellers for whom the hotel is the point of the stop</td></tr>
<tr><td>A night in the modern wing</td><td>The same view from a contemporary room, without the age</td><td>A river facing room, with the wing confirmed in writing</td><td>Travellers who want the setting and not the period</td></tr>
</tbody>
</table>

<h2 id="visiting-without-staying">Visiting Without Staying</h2>

<p>Usually possible, often with conditions, and worth arranging rather than turning up for.</p>

<p>Non residents are commonly admitted to the terrace for tea or a drink, sometimes with a minimum spend, and access sits at the hotel''s discretion and can be restricted when it is full. A dress code applies in the evening.</p>

<p>Book it. A table at sunset in high season is not something to gamble a taxi ride on, and the hotel takes those bookings directly rather than through an agent.</p>

<p>Allow more time than the hour you think you need. People arrive for a drink, watch the light change, and find that two hours have gone.</p>

<!-- OWNER: first-hand paragraph fits here, on how guests have actually arranged the terrace visit -->

<h2 id="staying-there">Staying There</h2>

<p>Two quite different propositions under one name, and the wing decides which one you get.</p>

<p>The historic building is the reason to come. The modern wing is a comfortable hotel with the same view and none of the age, which some travellers prefer and which is not what the search was about.</p>

<p>Ask which building the room is in, which floor, and whether the room faces the river or the town. On a bluff above a river, the side of the building is most of the value you are paying for.</p>

<p>Get the answer in writing. A room type described on a booking page is not the same thing as a confirmation that names the wing, and the two have been known to part company.</p>

<p>Book direct with the hotel. We do not act as its agent, we take nothing on a booking there, and we quote no rates because they move and because it is not our inventory to price.</p>

<h2 id="where-the-old-cataract-aswan-sits-in-the-town">Where the Old Cataract Aswan Sits in the Town</h2>

<p>At the southern end of the corniche, above the water, a short drive from the centre and the souk.</p>

<p>That position is good for the view and slightly away from the walking. The market, the ferry jetties and most of the restaurants are north of it along the water, which is a ten minute drive or a long and pleasant walk.</p>

<p>Philae, the quarry and the High Dam are all south, so the location is convenient for the sightseeing day and less so for an evening on foot.</p>

<p><a href="/blog/best-hotels-in-aswan">The wider comparison of where to stay here</a> covers the corniche, the islands and the west bank, and where this building fits among them.</p>

<h2 id="what-it-is-not">What It Is Not</h2>

<p>Worth saying plainly, because the expectation gap does the damage.</p>

<p>It is not a museum and there is no tour of it. It is a working hotel that happens to be old and famous, and the parts a visitor sees are the terrace, the bar and the public rooms.</p>

<p>The aswan old cataract hotel egypt is also not the only good address in the town, and for some travellers it is not the best one for their week. A river facing room somewhere newer, at a lower price, is a perfectly rational choice and nobody should feel they got it wrong.</p>

<h2 id="when-to-come">When to Come</h2>

<p>November to February for the terrace, and the season matters here more than at most addresses.</p>

<p>Aswan is the hottest stop on a classic route. In winter the terrace at five in the afternoon is close to perfect. In July it is somewhere you retreat from rather than sit on, and the whole point of the building is outdoors.</p>

<p>Sunset moves through the year, so check the hour locally rather than booking a table for a time that was right in a guidebook.</p>

<p>The shoulder weeks either side of that window are the compromise. Warmer than you want by the middle of the day, still workable on the terrace at dusk, and easier to book at short notice.</p>

<h2 id="how-to-actually-plan-it">How to Actually Plan It</h2>

<p>Decide first whether you want to stay or to visit, because they are different arrangements and they fail in different ways.</p>

<p>To visit: book the terrace directly, for sunset, on a day you are already in Aswan. To stay: book direct, specify the historic wing and a river facing room, and do it early for the winter months.</p>

<p><a href="/egypt-travel-guide/aswan-egypt-attractions">The Aswan guide</a> covers what else is worth the time here, and our <a href="/egypt-nile-cruise-packages">Nile cruise itineraries</a> show how the nights in this town usually fall either side of a sailing.</p>

<p>The full list of <a href="/luxury-hotels-in-egypt">the hotels we use</a> includes <a href="/hotel/old-cataract-aswan">this one''s own record</a>, which carries the hotel''s description rather than ours.</p>

<aside class="related-posts" aria-label="Related reading"><h2 id="related-reading">Related reading</h2><ul><li><a href="/blog/best-hotels-in-aswan">the other places to sleep in this town</a></li><li><a href="/blog/luxury-hotels-cairo">the equivalent decision in the capital</a></li><li><a href="/blog/where-to-stay-in-cairo">picking a base in a much larger city</a></li></ul></aside>

<p class="author-bio">Written by Hamdy Haggag, who has planned and run private journeys in Egypt for more than a decade and still takes the first call for every itinerary.</p>',
  'A Victorian hotel on a granite bluff above the Nile, and the reason half its visitors arrive holding a paperback. The history, the terrace, and how to visit.',
  'Travel Planning',
  ARRAY['Aswan', 'Hotels', 'History']::text[],
  'aswan old cataract hotel egypt',
  'Aswan Old Cataract Hotel Egypt: The Story',
  'The aswan old cataract hotel egypt travellers ask for by name: what the building is, the Agatha Christie connection, and how to see the terrace without staying.',
  'published',
  '2026-12-12T09:00:00+02:00'::timestamptz,
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
  '2026-12-12T09:00:00+02:00'::timestamptz,
  '2026-12-12T09:00:00+02:00'::timestamptz,
  '[{"id":"f7f16ab1-8984-5986-bb9c-0b4481a2e3ac","question":"Why is the Old Cataract hotel in Aswan famous?","answer":"2 reasons, and the second is bigger. It is a late Victorian hotel built on a granite bluff for the first generation of Nile travellers, with a terrace that looks across at Elephantine Island. And it is the hotel most firmly attached to Agatha Christie and Death on the Nile."},{"id":"28afdfb3-d6c1-5682-8180-da3659198827","question":"Did Agatha Christie write Death on the Nile at the hotel?","answer":"She stayed there and the hotel carries a suite named for her, but the claim that a particular passage was written in the building is repeated more confidently than the evidence supports. The novel, published in 1937, is set on a Nile steamer rather than in a hotel."},{"id":"4eff292c-be8a-5293-a505-d843d7653cf7","question":"Can you visit the Old Cataract without staying there?","answer":"Usually yes, for tea or a drink on the terrace, sometimes with a minimum spend and always at the hotel''s discretion. A dress code applies in the evening. Book directly a day or 2 ahead rather than turning up: a sunset table in high season is not worth gambling a taxi ride on."},{"id":"e8d75e5f-04a5-5fda-8d7c-df255afb4b0e","question":"Is the terrace worth it?","answer":"It is the best sit down hour in Aswan and it is not close. The terrace faces west above the water, and the 40 minutes while the sun goes behind the dunes is what almost everybody comes for. Afternoon tea there is an institution and is how most visitors see the building."},{"id":"eebc2efa-f1ea-5a00-8348-6dfea7cacee5","question":"What is the difference between the historic building and the new wing?","answer":"2 quite different stays under 1 name. The historic building is the reason to come. The modern wing is a comfortable hotel with the same view and none of the age, which suits some travellers and is not what the search was about. Ask which wing the room is in."},{"id":"a65f5ff6-8067-5739-936e-f905d0917508","question":"How do you book the Old Cataract?","answer":"Directly with the hotel. We do not act as its agent, take nothing on a booking there and quote no rates, because they move and it is not our inventory to price. There are 3 things to specify: the wing, a river facing room and the floor. Book early for the winter months."},{"id":"a57e2ac7-cb77-59f2-b3de-c93a14515832","question":"When is the best time to visit?","answer":"November to February. Aswan is the hottest stop on a classic Egypt route, and the whole point of this building is outdoors. In winter the terrace at 5pm is close to perfect. In July it is somewhere you retreat from rather than sit on, which removes the reason to be there."},{"id":"46cc316d-7a44-55d2-8916-1e73bc666a7e","question":"Is it the best hotel in Aswan?","answer":"Not automatically, and for some travellers not at all. It is the most famous of them and the most striking to look at. A river facing room somewhere newer at a lower price is a perfectly rational choice, and the 3 positions on the water matter more than the name on the door."}]'::jsonb,
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
-- be 3.
-- ---------------------------------------------------------------------------
SELECT count(*) AS rows_present FROM posts WHERE slug IN ('fayoum-oasis-egypt', 'valley-of-the-whales', 'aswan-old-cataract-hotel-egypt');

SELECT slug,
       length(meta_title) AS title_len,
       length(meta_description) AS meta_len,
       jsonb_array_length(faqs) AS faq_count,
       array_length(regexp_split_to_array(regexp_replace(body_en, '<[^>]+>', ' ', 'g'), '\s+'), 1) AS body_words,
       scheduled_at,
       published_at,
       CASE WHEN body_en LIKE '%<figure%' THEN 'body kept, it has figures in it'
            ELSE 'body written from this file' END AS body_en_outcome
FROM posts WHERE slug IN ('fayoum-oasis-egypt', 'valley-of-the-whales', 'aswan-old-cataract-hotel-egypt') ORDER BY scheduled_at;

SELECT 'fayoum-oasis-egypt' AS slug,
       (SELECT count(*) FROM regexp_matches(body_en, 'fayoum oasis egypt', 'gi')) AS primary_hits
FROM posts WHERE slug = 'fayoum-oasis-egypt';
SELECT 'valley-of-the-whales' AS slug,
       (SELECT count(*) FROM regexp_matches(body_en, 'valley of the whales', 'gi')) AS primary_hits
FROM posts WHERE slug = 'valley-of-the-whales';
SELECT 'aswan-old-cataract-hotel-egypt' AS slug,
       (SELECT count(*) FROM regexp_matches(body_en, 'aswan old cataract hotel egypt', 'gi')) AS primary_hits
FROM posts WHERE slug = 'aswan-old-cataract-hotel-egypt';

SELECT 'seo lengths out of range' AS check, count(*) AS bad FROM posts
WHERE slug IN ('fayoum-oasis-egypt', 'valley-of-the-whales', 'aswan-old-cataract-hotel-egypt') AND (length(meta_title) > 60 OR length(meta_description) NOT BETWEEN 150 AND 160);

SELECT 'faq count out of range' AS check, count(*) AS bad FROM posts
WHERE slug IN ('fayoum-oasis-egypt', 'valley-of-the-whales', 'aswan-old-cataract-hotel-egypt') AND jsonb_array_length(faqs) NOT BETWEEN 7 AND 8;

-- Answers are written to be quoted on their own by an AI answer engine, which
-- means 40 to 80 words each. Outside that they are either empty or too long.
SELECT 'faq answers outside 40-80 words' AS check, count(*) AS bad
FROM posts p, jsonb_array_elements(p.faqs) f
WHERE p.slug IN ('fayoum-oasis-egypt', 'valley-of-the-whales', 'aswan-old-cataract-hotel-egypt')
  AND array_length(regexp_split_to_array(trim(f->>'answer'), '\s+'), 1) NOT BETWEEN 40 AND 80;

-- The SEO overrides must be NULL, not empty strings, or the fallbacks break.
SELECT 'seo overrides stored as empty strings' AS check, count(*) AS bad FROM posts
WHERE slug IN ('fayoum-oasis-egypt', 'valley-of-the-whales', 'aswan-old-cataract-hotel-egypt')
  AND (canonical_url = '' OR robots = '' OR og_image = '' OR schema_type = '' OR featured_image_alt = '');

SELECT 'faq entries missing id, question or answer' AS check, count(*) AS bad
FROM posts p, jsonb_array_elements(p.faqs) f
WHERE p.slug IN ('fayoum-oasis-egypt', 'valley-of-the-whales', 'aswan-old-cataract-hotel-egypt')
  AND (coalesce(f->>'id','') = '' OR coalesce(f->>'question','') = '' OR coalesce(f->>'answer','') = '');

SELECT 'em or en dash present' AS check, count(*) AS bad FROM posts
WHERE slug IN ('fayoum-oasis-egypt', 'valley-of-the-whales', 'aswan-old-cataract-hotel-egypt')
  AND (body_en ~ '[\u2013\u2014]' OR meta_title ~ '[\u2013\u2014]' OR meta_description ~ '[\u2013\u2014]' OR title_en ~ '[\u2013\u2014]');

-- Tour links must sit at the site root. Anything under the category path 404s.
SELECT 'tour links under /luxury-egypt-tour-packages/' AS check, count(*) AS bad FROM posts
WHERE slug IN ('fayoum-oasis-egypt', 'valley-of-the-whales', 'aswan-old-cataract-hotel-egypt') AND body_en ~ 'href="/luxury-egypt-tour-packages/[^"]';

-- The hotel listing moved. A link to the old path still works through the 301,
-- and costs every reader a hop for no reason.
SELECT 'links to the old /stay path' AS check, count(*) AS bad FROM posts
WHERE slug IN ('fayoum-oasis-egypt', 'valley-of-the-whales', 'aswan-old-cataract-hotel-egypt') AND body_en ~ 'href="/stay';

SELECT 'unfilled placeholders' AS check, count(*) AS bad FROM posts
WHERE slug IN ('fayoum-oasis-egypt', 'valley-of-the-whales', 'aswan-old-cataract-hotel-egypt') AND (body_en LIKE '%data-placeholder=%' OR body_en ~ '\{\{[A-Z_]+\}\}');

SELECT 'other language columns left empty' AS check, count(*) AS bad FROM posts
WHERE slug IN ('fayoum-oasis-egypt', 'valley-of-the-whales', 'aswan-old-cataract-hotel-egypt')
  AND (title_es IS NOT NULL OR title_fr IS NOT NULL OR title_jp IS NOT NULL
       OR body_es IS NOT NULL OR body_fr IS NOT NULL OR body_jp IS NOT NULL);

-- The owner paragraphs are deliberately left as HTML comments for someone to
-- replace with a real first hand voice. This is a reminder, not a failure.
SELECT slug,
       (length(body_en) - length(replace(body_en, '<!-- OWNER:', ''))) / 11 AS owner_notes_awaiting_a_paragraph
FROM posts WHERE slug IN ('fayoum-oasis-egypt', 'valley-of-the-whales', 'aswan-old-cataract-hotel-egypt') ORDER BY slug;
