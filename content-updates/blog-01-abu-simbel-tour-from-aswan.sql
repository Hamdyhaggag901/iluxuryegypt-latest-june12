-- Abu Simbel Tour from Aswan: Flight or Road
-- Blog post 1 of 5. Primary keyword: abu simbel tour from aswan
--
-- Scheduled for 2026-09-22T09:00:00+03:00 via posts.scheduled_at, so it stays out of
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
  'abu-simbel-tour-from-aswan',
  'Abu Simbel Tour from Aswan: Flight or Road',
  '<p>The drive to Abu Simbel takes about three hours each way. The flight takes about forty minutes. Which one you pick depends less on budget than on what time you want to be standing in front of the temple, and how much of that day you are willing to spend sitting down.</p>

<p>Most people book an abu simbel tour from aswan without thinking much about the transport, then spend the return leg wishing they had. This is the comparison nobody gives you up front.</p>

<h2>Abu Simbel Tour from Aswan: The Two Ways to Get There</h2>

<p>Abu Simbel sits roughly 280 kilometres south of Aswan, close to the Sudanese border. There is no railway. You go by road or you fly, and the two produce very different days.</p>

<p>A standard abu simbel day trip from aswan is a single long push in one direction and back, whichever transport you take. Nobody sells it as a two day trip because almost nobody wants one.</p>

<p>The road option leaves early. Convoys used to be compulsory and are no longer enforced the way they once were, but the operating rhythm stuck: vehicles still tend to leave Aswan in the small hours so that visitors reach the site before the heat builds. You arrive tired. You also arrive early, which matters more than it sounds.</p>

<p>The flight is a short hop on a domestic turboprop. You are at the site inside an hour of leaving your hotel, and back in Aswan by lunch.</p>

<h2>A Side by Side Comparison</h2>

<table>
<thead>
<tr><th>&nbsp;</th><th>By road</th><th>By air</th></tr>
</thead>
<tbody>
<tr><td>Travel time each way</td><td>About 3 to 3.5 hours</td><td>About 40 to 45 minutes</td></tr>
<tr><td>Typical departure</td><td>Between 3am and 4am</td><td>Early morning, hotel pickup around dawn</td></tr>
<tr><td>Time at the site</td><td>Usually 2 hours</td><td>Usually 2 hours, sometimes less</td></tr>
<tr><td>Back in Aswan</td><td>Early afternoon</td><td>Late morning</td></tr>
<tr><td>Cost</td><td><mark data-placeholder="abu-simbel-road-cost">FILL IN: typical road trip cost per person</mark></td><td><mark data-placeholder="abu-simbel-air-cost">FILL IN: typical flight package cost per person</mark></td></tr>
<tr><td>Suits</td><td>Anyone who wants the desert and the early light</td><td>Anyone short on days, or travelling with children or older parents</td></tr>
</tbody>
</table>

<h2>What the Road Trip Actually Feels Like</h2>

<p>You will be woken between 2:30am and 3am. There is no way around this and no operator who can make it pleasant. Coffee in the lobby, a cool bus, and then three hours of darkness turning slowly into desert.</p>

<p>The drive itself is more interesting than people expect. The road runs through the Western Desert with nothing on either side, and about an hour before you arrive the sky starts to go pale behind the dunes. If you can sleep in a moving vehicle, you will wake up to that.</p>

<p>If you cannot sleep in a moving vehicle, you will arrive at one of the most extraordinary places in Egypt running on four hours of rest, and you will feel it in the afternoon. That is the honest trade.</p>

<p>The return leg is the hard part. It is the same three hours, in full sun, with nothing new to look at. Most people sleep through it.</p>

<h2>What You Give Up by Flying</h2>

<p>The flight removes the exhaustion and most of the day. You will be back at your hotel or your cruise boat before noon with the afternoon intact.</p>

<p>What you lose is control of your clock. Flights land in a window set by the airline, not by the light, and the aircraft arrives with everyone else''s aircraft. You walk in as part of a wave. The road groups that left Aswan at 3am are often already leaving as you arrive, which means you get the site at its busiest rather than its quietest.</p>

<p>You also lose the desert. On the plane it is forty minutes of brown through a small window.</p>

<h2>How Long You Actually Spend at the Temples</h2>

<p>This is where most itineraries quietly disappoint. Whichever way you travel, the standard allowance on the ground is about two hours, and two hours is enough to see both temples properly only if you do not linger.</p>

<p>The Great Temple of Ramesses II takes most of it. The four seated colossi outside are the photograph everyone knows, but the interior is the part that stays with you: a hall of eight standing statues, then chamber after chamber cut back into what used to be solid cliff. Photography rules inside change from time to time, so check on the day.</p>

<p>The smaller Temple of Hathor and Nefertari sits a short walk north. It gets far less attention and rewards ten unhurried minutes. The facade carries six standing figures, and unusually for ancient Egypt the queen is carved at the same height as the king.</p>

<p>Then there is the thing almost nobody allows time for. Both temples were cut into pieces in the 1960s and moved uphill to escape the rising water behind the High Dam. You can walk around the back of the artificial mountain they now sit inside. It takes fifteen minutes and it changes how you read the whole site.</p>

<h2>The Sun Festival in February and October</h2>

<p>Twice a year, on 22 February and 22 October, the sunrise reaches straight down the axis of the Great Temple and lights the seated figures in the innermost sanctuary. Three of the four catch the light. Ptah, a god associated with the underworld, stays in shadow, which is generally read as deliberate.</p>

<p>If you want to be there for it, understand what you are signing up for. The site fills long before dawn, the crowd is large and loud, and there is a festival atmosphere outside the temple that some people love and others find completely at odds with the place. Accommodation in Abu Simbel village and flights from Aswan get booked out well in advance.</p>

<p>The alignment itself lasts about twenty minutes. Whether that is worth planning a trip around is a personal question, and the honest answer for most visitors is that an ordinary quiet morning at the temple is the better experience.</p>

<h2>What Most People Get Wrong About the Move</h2>

<p>Between 1964 and 1968 both temples were sawn into more than a thousand blocks, lifted 65 metres up and 200 metres back, and reassembled inside a hollow artificial hill. Lake Nasser now sits where the original cliff face stood.</p>

<p>The cuts are still visible if you look. Thin seams run across the colossi and through the interior walls, and once you have seen one you will see them everywhere. Guides often skip this because it feels like it diminishes the site. It does the opposite.</p>

<p>Walk around to the back and you can go inside the dome that holds the whole thing up. It is a concrete shell, unglamorous and completely at odds with what is on the other side of the wall. Ten minutes there is the best context anyone gets on an abu simbel tour from aswan, and it is free.</p>

<h2>Heat, Light and the Best Hour to Arrive</h2>

<p>Abu Simbel is hot. Between May and September the middle of the day is genuinely difficult, and there is very little shade between the car park and the temples.</p>

<p>The temples face east, so the facade is lit from sunrise until roughly mid morning. After that the front goes flat and the light gets harsh. This is the real argument for the road trip: an early arrival puts you in front of the colossi while the stone is still warm orange rather than washed out white.</p>

<p>Bring more water than you think you need, and a hat. The walk from the entrance around the shoulder of the hill to the temple facade is longer than it looks in photographs, and it is entirely in the open.</p>

<h2>Where Abu Simbel Fits in a Longer Trip</h2>

<p>Going to Abu Simbel from Aswan as a day trip is the usual approach, and for most people it is the right one. This is not a place you need two days for.</p>

<p>The alternative is to stay overnight in Abu Simbel village. It is quiet, the options are limited, and the reward is having the site at opening time with almost nobody else there. If you have the flexibility, it is the best version of this trip.</p>

<p>Either way, it fits naturally into an Aswan stop, which is why it appears on most Nile itineraries. Our <a href="/12-days-egypt-tour">twelve day Egypt itinerary</a> builds in a full Abu Simbel morning rather than treating it as an add-on, and the <a href="/egypt-nile-cruise-packages">Nile cruise options</a> include it as a shore excursion.</p>

<h2>Practical Notes Before You Book</h2>

<p>Tickets are bought at the site and prices change; check the current rate rather than trusting a figure in an article. Current entry cost is <mark data-placeholder="abu-simbel-ticket">FILL IN: current Abu Simbel entry ticket price</mark>, and the site opens at <mark data-placeholder="abu-simbel-hours">FILL IN: current opening hours</mark>.</p>

<p>If you are already planning time in the south, the <a href="/egypt-travel-guide/aswan-egypt-attractions">Aswan area guide</a> covers Philae, the quarries and the Nubian villages, which is what most people fill the rest of an Aswan stay with. For the wider region, the <a href="/egypt-travel-guide/attractions-in-luxor">Luxor guide</a> is the natural next stop north, and <a href="/blog/{{RELATED_POST_SLUG}}">{{RELATED_POST_ANCHOR}}</a> covers the Nile stretch between them.</p>

<h2>What to Bring, and What to Leave</h2>

<p>Water, a hat, and sunglasses. That is most of it. There is a small cafeteria near the entrance but nothing on the road, so anything you want on a three hour drive has to come with you.</p>

<p>Leave the tripod. It will not be allowed inside and carrying it across the open ground in front of the temples is a job you will resent by the second hour. A phone and a light camera cover everything the site gives you.</p>

<p>If you are flying, note that the baggage rules on the domestic hop are tighter than you might assume, and most people leave their main luggage at the hotel in Aswan for the morning.</p>

<p>One last thing that catches people out: the temperature difference between an air conditioned bus and the open air at 6am can be twenty degrees in either direction depending on the season. Take a layer you can drop in your bag by nine.</p>',
  'Three hours by road or forty minutes by air. The choice shapes what time you reach the temple, how tired you are when you get there, and how long you can stay.',
  'Destinations',
  ARRAY['Abu Simbel', 'Aswan', 'Day Trips', 'Nile Valley']::text[],
  'abu simbel tour from aswan',
  'Abu Simbel Tour from Aswan: Flight vs Road',
  'An abu simbel tour from aswan runs three hours by road or forty minutes by air. Here is how the two really compare on time, heat, sleep and what you see.',
  'published',
  '2026-09-22T09:00:00+03:00'::timestamptz,
  '[{"id":"af5c7385-1d73-4d8e-9aba-d01a148030a5","question":"How long is the drive from Aswan to Abu Simbel?","answer":"About 3 to 3.5 hours each way, covering roughly 280 km of desert road. Most road trips leave Aswan between 3am and 4am so you reach the temples before the heat builds. There is no railway and no useful public transport on the route, so nearly everyone books the transport as part of a package."},{"id":"0bc7aadc-d399-499e-b2f3-74f953651341","question":"Is it better to fly or drive to Abu Simbel from Aswan?","answer":"Fly if your days are short or you are travelling with children or older parents: the flight is about 40 minutes each way and puts you back in Aswan by late morning. Drive if you want the desert crossing and the early light on the temple facade, and you can function on 4 hours of sleep."},{"id":"275c0374-2164-4285-ad59-289d8317a03a","question":"How much time do you actually get at Abu Simbel?","answer":"About 2 hours on the ground, whichever way you travel. That covers both temples at a steady pace, roughly 70 minutes for the Great Temple of Ramesses II and 15 for the smaller Temple of Hathor and Nefertari, and leaves time to walk behind the artificial hill the 2 temples were moved into."},{"id":"66e76922-754c-4a0d-bf35-1998ab85ba37","question":"When is the Abu Simbel sun festival?","answer":"On 22 February and 22 October each year, when sunrise runs straight down the temple axis and lights 3 of the 4 seated statues in the inner sanctuary. The alignment lasts about 20 minutes. Both dates draw very large crowds, and flights and rooms in Abu Simbel village sell out months ahead."},{"id":"ed47b127-d24c-4541-99a9-de63dfd25702","question":"Can you visit Abu Simbel without booking a tour?","answer":"Yes, by road or on a domestic flight, but there is no public transport worth using across the 280 km from Aswan. The whole day is built around one early window, which is hard to hit independently, so most visitors book transport as a package. iLuxury Egypt runs it as a private day trip for that reason."},{"id":"861dec18-0b52-4dd2-8e05-21b676869b45","question":"Is one day at Abu Simbel enough, or is an overnight stay worth it?","answer":"One day is enough for most visitors, because the 2 temples take about 2 hours at an unhurried pace. An overnight in Abu Simbel village is worth it only if you want the site at opening time with almost nobody else there, which is the single thing a day trip from Aswan cannot give you."},{"id":"2cc45ca5-a050-4ae2-88f1-fdc04f446c26","question":"What is the best time of year to visit Abu Simbel?","answer":"October to April. Between May and September the middle of the day is genuinely difficult, with very little shade on the 10 minute walk between the car park and the temples. The facade faces east, so it is lit from sunrise until about 10am in any season, which is the real argument for arriving early."},{"id":"5abf72e9-dce4-4193-9e83-889a3b1d62ae","question":"Why were the Abu Simbel temples moved?","answer":"To save them from Lake Nasser, which rose behind the Aswan High Dam. Between 1964 and 1968 both temples were cut into more than 1,000 blocks, lifted about 65 metres up and 200 metres back from the original cliff, and rebuilt inside a hollow artificial hill. The cut lines are still visible on the colossi."}]'::jsonb,
  -- The other SEO overrides stay NULL on purpose: canonical_url falls back to
  -- the page's own URL, robots to "index, follow", og_image to the hero. An
  -- empty string in any of them would defeat that fallback.
  'BlogPosting'
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
  schema_type = EXCLUDED.schema_type,
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
       schema_type,
       (SELECT count(*) FROM regexp_matches(body_en, 'abu simbel tour from aswan', 'gi')) AS primary_hits
FROM posts WHERE slug = 'abu-simbel-tour-from-aswan';

SELECT 'seo lengths out of range' AS check, count(*) AS bad FROM posts
WHERE slug = 'abu-simbel-tour-from-aswan' AND (length(meta_title) > 60 OR length(meta_description) NOT BETWEEN 150 AND 160);

SELECT 'faq count out of range' AS check, count(*) AS bad FROM posts
WHERE slug = 'abu-simbel-tour-from-aswan' AND jsonb_array_length(faqs) NOT BETWEEN 7 AND 8;

-- Answers are written to be quoted on their own by an AI answer engine, which
-- means 40 to 80 words each. Outside that they are either empty or too long.
SELECT 'faq answers outside 40-80 words' AS check, count(*) AS bad
FROM posts p, jsonb_array_elements(p.faqs) f
WHERE p.slug = 'abu-simbel-tour-from-aswan'
  AND array_length(regexp_split_to_array(trim(f->>'answer'), '\s+'), 1) NOT BETWEEN 40 AND 80;

-- The SEO overrides must be NULL, not empty strings, or the fallbacks break.
SELECT 'seo overrides stored as empty strings' AS check, count(*) AS bad FROM posts
WHERE slug = 'abu-simbel-tour-from-aswan'
  AND (canonical_url = '' OR robots = '' OR og_image = '' OR schema_type = '' OR featured_image_alt = '');

SELECT 'faq entries missing id, question or answer' AS check, count(*) AS bad
FROM posts p, jsonb_array_elements(p.faqs) f
WHERE p.slug = 'abu-simbel-tour-from-aswan'
  AND (coalesce(f->>'id','') = '' OR coalesce(f->>'question','') = '' OR coalesce(f->>'answer','') = '');

SELECT 'em or en dash present' AS check, count(*) AS bad FROM posts
WHERE slug = 'abu-simbel-tour-from-aswan'
  AND (body_en ~ '[\u2013\u2014]' OR meta_title ~ '[\u2013\u2014]' OR meta_description ~ '[\u2013\u2014]' OR title_en ~ '[\u2013\u2014]');

-- Tour links must sit at the site root. Anything under the category path 404s.
SELECT 'tour links under /luxury-egypt-tour-packages/' AS check, count(*) AS bad FROM posts
WHERE slug = 'abu-simbel-tour-from-aswan' AND body_en ~ 'href="/luxury-egypt-tour-packages/[^"]';

SELECT 'root-relative internal links' AS check,
       (SELECT count(*) FROM regexp_matches(body_en, 'href="/[^"]+"', 'g')) AS good,
       (SELECT count(*) FROM regexp_matches(body_en, 'href="(?!/)[^"]+"', 'g')) AS bad
FROM posts WHERE slug = 'abu-simbel-tour-from-aswan';

SELECT 'unfilled placeholders' AS check,
       (SELECT count(*) FROM regexp_matches(body_en, 'data-placeholder=', 'g'))
     + (SELECT count(*) FROM regexp_matches(body_en, '\{\{[A-Z_]+\}\}', 'g')) AS remaining
FROM posts WHERE slug = 'abu-simbel-tour-from-aswan';

SELECT 'other language columns left empty' AS check, count(*) AS bad FROM posts
WHERE slug = 'abu-simbel-tour-from-aswan'
  AND (title_es IS NOT NULL OR title_fr IS NOT NULL OR title_jp IS NOT NULL
       OR body_es IS NOT NULL OR body_fr IS NOT NULL OR body_jp IS NOT NULL);
