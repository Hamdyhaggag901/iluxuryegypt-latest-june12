-- Wave "one-october": 5 articles, loaded in one file.
--
--   2026-10-15T09:00:00+03:00  valley-of-the-queens  (valley of the queens)
--   2026-10-16T09:00:00+03:00  egypt-diving-red-sea  (egypt diving red sea)
--   2026-10-19T09:00:00+03:00  black-and-white-desert-egypt  (black and white desert egypt)
--   2026-10-21T09:00:00+03:00  tombs-of-the-nobles  (tombs of the nobles)
--   2026-10-24T09:00:00+03:00  open-air-museum-memphis-egypt  (open air museum memphis egypt)
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
--   valley-of-the-queens
--     Painted wall in the tomb of Nefertari in the valley of the queens, Luxor
--   egypt-diving-red-sea
--     Coral reef and shoal of anthias on an egypt diving red sea site near Hurghada
--   black-and-white-desert-egypt
--     Chalk rock formations at sunset in the black and white desert egypt route near Farafra
--   tombs-of-the-nobles
--     Painted banquet scene with musicians in the tombs of the nobles at Sheikh Abd el-Qurna, Luxor
--   open-air-museum-memphis-egypt
--     The fallen colossus of Ramesses II in the open air museum memphis egypt at Mit Rahina
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
WHERE slug IN ('valley-of-the-queens', 'egypt-diving-red-sea', 'black-and-white-desert-egypt', 'tombs-of-the-nobles', 'open-air-museum-memphis-egypt')
ORDER BY scheduled_at;

BEGIN;

INSERT INTO posts (
  slug, title_en, body_en, excerpt, category, tags,
  focus_keyword, meta_title, meta_description,
  status, scheduled_at, published_at, updated_at, faqs, schema_type
) VALUES
(
  'valley-of-the-queens',
  'Valley of the Queens: Nefertari and the Three Other Tombs',
  '<p>Ten minutes. That is roughly what the ticket to Nefertari''s tomb buys you inside it, and people spend the whole time deciding where to look.</p>

<p>The valley of the queens egypt put its royal women and its royal children in is a narrow bowl at the southern end of the Theban west bank, about a kilometre past Medinet Habu. Around ninety tombs have been found cut into its walls. Four are usually open. One of those four is, by a wide margin, the best preserved painted interior surviving from the ancient world, and it is sold on a separate ticket that catches out visitors who did not know to ask.</p>

<p>Get the ticket question settled before the car leaves the hotel. Everything else here is straightforward.</p>

<h2>What the Valley of the Queens Actually Is</h2>

<p>The ancient name was Ta Set Neferu, which is usually rendered as the place of beauty or the place of the royal children. Both readings are defensible and the second one is closer to what the site was used for.</p>

<p>Queens are buried here, but so are princes, princesses and a scattering of high officials. Use began in the Eighteenth Dynasty and the valley did its real work under the Nineteenth and Twentieth, which is to say under the Ramesside kings. If a king of that period had a favourite wife or a son who died young, this is where the tomb was cut.</p>

<p>The geology is softer and more broken than the rock across the hill, which is part of why the tombs here are smaller and shallower. A corridor, a stair, a chamber or two. Nothing on the scale of a king''s tomb.</p>

<p>That turns out to matter less than it sounds. The decoration is what people come for, and a small room holds paint better than a long corridor.</p>

<!-- OWNER: first-hand paragraph fits well here, on what the valley feels like when you walk in from the car park -->

<h2>Nefertari, and What the Separate Ticket Buys</h2>

<p>QV66 belonged to Nefertari Meritmut, principal wife of Ramesses II, and it was cut and painted around 1255 BC. Ernesto Schiaparelli found it in 1904. It had been robbed in antiquity and what was left inside was fragments, which is not the point of the tomb.</p>

<p>The point is the walls. Around five hundred square metres of painted plaster showing the queen led through the underworld by one god after another, her linen rendered in thin white layers you can still see the brushwork in, her jewellery picked out in detail, the ceiling a deep blue field of yellow stars.</p>

<p>Salt crystallising behind the plaster nearly destroyed all of it. A long conservation campaign by the Getty Conservation Institute with the Egyptian authorities, running through the late 1980s and into the 1990s, stabilised the surface and stopped the loss. The colour you see is original. Almost none of it is repainted.</p>

<p>Entry is limited, both in the number of people admitted and in how long each group stays. The ticket is bought separately from the general valley ticket and is by a distance the most expensive single entry on the west bank. Photography rules for this tomb have changed several times, so confirm on the day rather than assuming.</p>

<p>Is it worth it? If painted decoration is the reason you came to Luxor at all, yes, without qualification. If you are three days into a packed itinerary and monuments have started to blur, the money is better spent on a second morning somewhere else.</p>

<h2>The Three Tombs on the General Ticket</h2>

<p>Rotation happens, so treat this as the usual set rather than a guarantee.</p>

<p>QV55 belongs to Amunherkhepshef, a son of Ramesses III who died as a boy. The reliefs show his father leading him by the hand and presenting him to the gods, and the king''s hand on the child''s is the detail everyone remembers. The colour is strong, the chamber is small, and the whole visit takes ten minutes.</p>

<p>QV44 is the tomb of Khaemwaset, another son of the same king, and it follows the same pattern of the father making the introductions. The painting is arguably crisper here. Fewer people stop.</p>

<p>QV52 belonged to Queen Tyti, whose husband is not securely identified, which is a small mystery given how much else we know about the period. The tomb is larger than the two princes'' tombs and the decoration is more worn.</p>

<p>Together these three take about forty minutes at an unhurried pace. None of them is deep and none involves more than a short flight of steps, which makes this the easiest of the Theban tomb sites for anyone who found the royal valley hard going.</p>

<p>The princes'' tombs reward a particular kind of attention. These were children, and the decoration was commissioned by a father who outlived them, so the scenes are not the standard royal programme. They are a king doing the introductions personally, over and over, in room after room.</p>

<h2>The Other Eighty Six Tombs</h2>

<p>Most of the valley is closed, and most of what is closed is not spectacular. Shaft burials, unfinished chambers, tombs reused in the Third Intermediate Period and again by Coptic monks, and a great deal that was emptied long before anyone recorded what was in it.</p>

<p>The Italian mission that found Nefertari in 1904 worked through dozens of these. Their notebooks are the reason we know the site was in use for four hundred years rather than one dynasty, and the reason the numbering runs as high as it does.</p>

<p>You will walk past the closed doors on your way between the open tombs. It is worth registering how many there are, because the number is the argument: this was not a handful of special burials, it was an industrial cemetery run by the state for the families of kings.</p>

<p>The men who cut and painted all of it lived in a village on the other side of the hill, a twenty minute walk away, and went home every night.</p>

<h2>Where It Sits, and What the Site Plan Shows</h2>

<p>The site is at the end of a short spur road that turns off the main west bank route just past Medinet Habu. Coming from the ferry it is the furthest of the main sites from the river, which is why it gets skipped.</p>

<p>Any valley of the queens map you are handed at the gate will show the tomb numbers scattered across a rough Y shape: a main wadi running roughly north to south with two shorter arms. Nefertari is low down and close to the entrance, on the left as you walk in. The princes'' tombs sit further up the main arm. The numbered tombs that are not open are still visible as closed metal doors set into the rock, and there are a lot of them.</p>

<p>Distances are short. From the gate to the furthest open tomb is a few hundred metres of level gravel.</p>

<h2>How This Fits a West Bank Morning</h2>

<p>Badly, if you try to bolt it onto a full day that already has three sites in it. Well, if you plan the west bank across two mornings rather than one.</p>

<p>The standard single west bank morning is the royal tombs, Hatshepsut, the Colossi of Memnon, and out by lunch. Adding the valley of the queens luxor keeps at its southern end to that sequence means arriving here at the hottest part of the day with your attention already spent, which is the worst possible way to look at painted plaster.</p>

<p>The better shape is this one. First morning: the royal tombs at opening, then Hatshepsut. Second morning: this valley first, Medinet Habu second, both of them quiet, both of them in shade or indoors before ten.</p>

<p>The <a href="/blog/tombs-in-the-valley-of-kings">guide to choosing royal tombs</a> covers the other half of that plan, and the wider <a href="/egypt-travel-guide/attractions-in-luxor">Luxor area guide</a> sets out how the two banks divide up across a stay. Our <a href="/best-luxury-egypt-tours">longer Egypt itineraries</a> build the west bank as two mornings for exactly this reason.</p>

<h2>Heat, Light and the Hour to Arrive</h2>

<p>The valley is a bowl. It has almost no shade, it faces the sun for most of the day, and it holds heat the way a stone oven does. From April to October the difference between eight in the morning and eleven is the difference between comfortable and miserable.</p>

<p>Be at the gate when it opens. That is the single most useful sentence in this article.</p>

<p>Inside the tombs the light is artificial and dim, deliberately so, because light damages pigment. Your eyes need a minute to adjust each time you go down a stair, so do not walk straight in and start photographing. Stand still, let the chamber come up, then look.</p>

<p>Late afternoon is the second best option and a distant second. The tombs close earlier than you would expect and the last entry is earlier still.</p>

<!-- OWNER: first-hand paragraph fits well here, on the ten minutes inside QV66 and what you actually notice -->

<h2>Tickets, in the Order You Need Them</h2>

<p>Two purchases, not one. The general valley ticket covers the three tombs on rotation. The Nefertari ticket is separate, costs several times as much, and is the one to sort out first because daily numbers are capped.</p>

<p>Where each is sold has changed over the years, and the west bank has both a central ticket office on the road in and desks at individual sites. Ask your driver or guide to confirm the current arrangement the day before rather than the morning of. Payment across the west bank is by card, with no cash desk, which surprises people every season.</p>

<p>Prices here, and for Nefertari in particular, are revised most years. Anything written down more than a few months ago will be wrong, so check the current rate close to your travel date.</p>

<p>A search for valley of the queens egypt will return Nefertari and very little else, and that is a fair reflection of how the site is sold rather than of what is in it. The princes are worth your forty minutes.</p>

<h2>What to Look at First in QV66</h2>

<p>You have ten minutes and your instinct will be to photograph everything. Do not.</p>

<p>Go down the stair, turn, and look at the queen''s face in the first scene on your left, where Isis takes her hand. Then look up at the ceiling.</p>

<p>Then find the panel of Nefertari playing senet, the board game, alone. It is the most human image in any royal tomb in Egypt, and it is easy to walk past.</p>

<p>Those three things, properly looked at, are worth more than forty photographs of walls you will not be able to identify afterwards. Photograph whatever is left of your time.</p>

<p>On the way out, stop at the top of the stair and turn round. From there the whole painted corridor is in front of you at once, and it is the only view that gives you the scale of what one woman''s burial chamber was worth to a king who outlived her by half a century.</p>',
  'Four tombs are usually open and one of them is the finest painted interior left from the ancient world. Knowing which ticket to buy before you arrive is most of the battle.',
  'Culture & History',
  ARRAY['Valley of the Queens', 'Nefertari', 'Luxor', 'West Bank']::text[],
  'valley of the queens',
  'Valley of the Queens: Nefertari and What Else Opens',
  'The valley of the queens holds the best preserved painted tomb in Egypt. Which tombs open, what the Nefertari ticket buys, and the hour to be at the gate.',
  'published',
  '2026-10-15T09:00:00+03:00'::timestamptz,
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
  '2026-10-15T09:00:00+03:00'::timestamptz,
  '2026-10-15T09:00:00+03:00'::timestamptz,
  '[{"id":"970bf2ef-bf02-5ec4-bfd6-b4081e4b922d","question":"Is the Valley of the Queens worth visiting?","answer":"Yes, mainly for 1 tomb. Nefertari''s QV66 is the best preserved painted interior surviving from the ancient world, with around 500 square metres of original colour. The 3 tombs on the general ticket take about 40 minutes between them and are genuinely good, but they are not the reason to make the trip."},{"id":"45001098-ba60-5783-a9e4-c16397dbf1a8","question":"Which is better, the Valley of the Queens or the Valley of the Kings?","answer":"The Kings for scale and for the number of tombs open, the Queens for the single finest painted interior in Egypt. Most visitors with 2 west bank mornings do both. With only 1 morning, the royal tombs give you more for the time, unless painted decoration is specifically why you came."},{"id":"87dee58b-ad98-5b0b-be13-89e85e261330","question":"How much does the Nefertari tomb ticket cost?","answer":"It is sold separately from the general valley ticket and is several times the price of any other single entry on the west bank. The exact figure is revised most years, so confirm it within about 1 month of travelling. Daily visitor numbers are capped, which is the more important practical point."},{"id":"e33fb15c-2660-5de8-8fd7-3d2941fe01ee","question":"How long can you stay inside Nefertari''s tomb?","answer":"Around 10 minutes per group, and the limit is enforced. Entry numbers are capped each day and the stay is kept short because breath and body heat raise humidity, which is what damaged the plaster in the first place. Plan what you want to look at before you go down the stair."},{"id":"f8b56d65-d505-5e7d-babc-c47ac337f5bf","question":"Which tombs are open in the Valley of the Queens?","answer":"Usually 4. Nefertari''s QV66 on its own ticket, plus QV55 for prince Amunherkhepshef, QV44 for prince Khaemwaset and QV52 for Queen Tyti on the general ticket. The 3 on the general ticket rotate for conservation, so the exact set changes and is confirmed at the gate on the day."},{"id":"d6f0edcd-00e5-5563-bcb3-9c5edc1c1303","question":"How long do you need at the Valley of the Queens?","answer":"About 90 minutes with the Nefertari ticket, or 45 without it. The 3 general ticket tombs are small and shallow, taking roughly 10 minutes each, and the walk from the gate to the furthest open tomb is only a few hundred metres of level ground. Allow longer in summer for the heat."},{"id":"1bcf00cc-a4bb-5861-b25b-7b42b50961a2","question":"What is the best time of day to visit?","answer":"Opening time, and it is not close. The valley is a bowl with almost no shade and it holds heat badly, so between April and October the 3 hours after 8am are the difference between comfortable and unbearable. Late afternoon is the fallback, but last entry is earlier than most people expect."},{"id":"122cb37c-b93a-5d39-be0e-2eab0921130e","question":"Where is the Valley of the Queens?","answer":"On the Theban west bank at Luxor, at the southern end, about 1 kilometre past the temple of Medinet Habu on a short spur road. It is the furthest of the main west bank sites from the Nile ferry crossing, which is 1 reason itineraries drop it when a morning runs late."}]'::jsonb,
  'BlogPosting'
),
(
  'egypt-diving-red-sea',
  'Egypt Diving Red Sea Guide: Seasons, Sites and First Dives',
  '<p>The water is 22 degrees in February and 29 in August. That single fact shapes more of the planning than anything else.</p>

<p>People planning an egypt diving red sea week for the first time usually ask about sharks, then about wrecks, then about whether they need a licence. The more useful questions are when to come, how many days to allow, and whether the diving goes before or after the ancient sites. Those three decide whether the trip works.</p>

<p>This is a primer, not a sales page. Dive centres operate out of every resort town on the coast and they are the people to book with.</p>

<h2>What Diving in Egypt Red Sea Waters Is Like</h2>

<p>Clear, warm, and busy with fish in a way that surprises people who learned to dive in the Atlantic. Visibility commonly runs twenty to thirty metres and sometimes more. Hard coral cover on the better reefs is still good, and the fish life is dense rather than large: anthias in clouds, fusiliers, bannerfish, the occasional napoleon wrasse coming in to look at you.</p>

<p>The coast has almost no river running into it, which is why the water is so clear. It is also effectively tideless compared with the Atlantic, and there is very little rain.</p>

<p>Conditions are gentle at the inshore sites and can be serious offshore. Elphinstone, the Brothers and Daedalus sit in open water with current, and they are not beginner dives whatever a brochure says.</p>

<p>Anyone diving the Red Sea Egypt coast for the first time tends to underestimate how much of the interest is in the small things. Nudibranchs on the wall, a crocodilefish flat on the sand pretending to be sand, octopus in the rubble at the reef edge. The big animals make the photographs and the small ones make the dive.</p>

<!-- OWNER: first-hand paragraph fits well here, on a specific dive and what was on the reef that morning -->

<h2>Seasons, Month by Month</h2>

<p>Water temperature bottoms out in February and March at around 21 to 23 degrees, which most people dive in a five millimetre suit. It climbs through spring, sits near 28 or 29 from July to September, and falls away slowly through autumn.</p>

<p>Air temperature is the other half of the picture. July and August on this coast are genuinely hot, which is fine on a boat and unpleasant on land. The surface interval in August is spent looking for shade.</p>

<p>Spring and autumn are the sweet spot. March to May and September to November give you warm water, tolerable air, and the best chance of calm crossings. Winter diving is perfectly good and the reefs are quieter, but wind can cancel offshore days at short notice.</p>

<p>The <a href="/blog/best-time-to-visit-egypt">month by month guide to visiting Egypt</a> covers how this lines up with Luxor and Aswan, which run on the opposite logic: the desert sites are best in the months when the sea is coolest.</p>

<h2>The Wrecks</h2>

<p>The Thistlegorm is the reason a lot of people come. A British merchant ship carrying war supplies, bombed and sunk in the Strait of Gubal in October 1941, sitting upright in about thirty metres with motorcycles, trucks, rifles and railway rolling stock still in the holds.</p>

<p>It is reachable as a long day boat trip from Sharm el Sheikh and on overnight or liveaboard itineraries from Hurghada. It is also crowded, and the best dives on it are the early ones before the other boats arrive.</p>

<p>Abu Nuhas is the other wreck site worth the fuel. A reef on the northern shipping approach that has collected four wrecks over the last hundred and fifty years, the Giannis D and the Carnatic being the two most dived. The Carnatic went down in 1869 and its wooden ribs have gone soft and coral covered, which makes it look more like a reef than a ship.</p>

<p>Scuba diving egypt red sea wrecks is mostly recreational depth work. Thistlegorm''s deck is shallow enough to spend real time on, and the holds are open.</p>

<h2>The Reefs and the Big Animals</h2>

<p>Ras Mohammed, at the southern tip of Sinai, is the classic wall diving: Shark and Yolanda reefs, strong current, big schools of barracuda and jacks in summer.</p>

<p>From Marsa Alam southwards the character changes. Elphinstone is an offshore pinnacle with oceanic whitetip sharks around in autumn. Sha''ab Samadai, usually called Dolphin House, holds a resident pod of spinner dolphins in a protected lagoon with access rules that limit how close boats and swimmers go.</p>

<p>Dugongs graze the seagrass beds around Marsa Abu Dabbab. Sightings are luck, not a schedule.</p>

<p>Further north the Giftun islands off Hurghada are the everyday diving: easy reefs, good for a first day back in the water after a few years out.</p>

<h2>If You Have Never Dived</h2>

<p>Two options. A supervised introductory dive takes an afternoon and gets you to about six metres with an instructor holding on, and it is enough to know whether you want more. A full open water certification takes three to four days including theory, pool sessions and four open water dives.</p>

<p>Doing the course here is common and the conditions are about as forgiving as they get: warm, clear, shallow entry points, and house reefs you can walk into from the beach at several resorts.</p>

<p>Snorkelling is not a consolation prize on this coast. The reef tops sit in three to five metres of water with the same fish on them, and a good snorkel day off a boat sees most of what the divers saw.</p>

<h2>Where Egypt Diving Red Sea Trips Start</h2>

<p>Hurghada has the most flights, the most dive centres and the shortest transfers, which is why it is the default. El Gouna is quieter and twenty minutes north. Safaga is a working port with good reefs and very little else.</p>

<p>Marsa Alam is three or four hours further south and is where the diving gets serious. Fewer boats, better reefs, longer journeys.</p>

<p>Liveaboards are the other model entirely. A week on a boat covers the offshore reefs that day trips cannot reach, sleeps you above the site so the first dive is at sunrise, and takes you out of contact with land for the duration. An egypt diving red sea itinerary built around a liveaboard is a different holiday from one built around a hotel, and mixing the two in a single week rarely works.</p>

<p>Sharm el Sheikh sits across the gulf in Sinai with Ras Mohammed on its doorstep and the shortest run to Thistlegorm. The <a href="/egypt-travel-guide/things-to-do-in-hurghada">Hurghada area guide</a> covers what the town itself is like, including the parts of it that have nothing to do with the water.</p>

<h2>Fitting Diving Red Sea Egypt Days Into a Wider Trip</h2>

<p>Almost always at the end. A diving red sea egypt block after Cairo, Luxor and Aswan works because the order matches your energy: the temples need early starts and concentration, the coast does not.</p>

<p>Three days is the practical minimum for a dive stop. Two is one weather day away from being none.</p>

<p>There is a case for the other order. If the group contains one diver and three people who would rather be by a pool, putting the coast first means the divers arrive rested and the rest of the party is not counting down to the beach through four temples. It is a group composition question, not a logistics one.</p>

<p>Allow for the flying rule when you build the last leg. The usual guidance is at least eighteen hours between your final dive and a flight, and many operators ask for twenty four after several days of repetitive diving. That means your last dive day cannot be the day before an international departure, and it is the single most common planning mistake on this coast.</p>

<p>Our <a href="/best-luxury-egypt-tours">longer Egypt itineraries</a> put the sea at the end for the same reason.</p>

<!-- OWNER: first-hand paragraph fits well here, on how guests react to the Nile week ending at the coast -->

<h2>What to Sort Out Before You Fly</h2>

<p>Bring your certification card and your logbook. Centres will ask for both, and a card without recent logged dives usually means a check dive before they put you on a boat, which costs you a morning.</p>

<p>Dive insurance that specifically covers diving is worth having and normal travel policies often exclude it. Check the wording rather than assuming.</p>

<p>If you have not been in the water for more than a year, book a refresher for your first morning and treat it as part of the plan rather than an admission of anything. It turns a wasted first morning into a good one.</p>

<p>Last thing: pack a three millimetre suit for summer and a five for winter, or confirm the rental sizes in advance. Standing on a boat deck in February in a suit that does not fit is a long two hours.</p>',
  'Warm water, thirty metre visibility and a wreck that has been photographed more than any other in the world. What the seasons actually do, and where the diving sits in a wider Egypt trip.',
  'Destinations',
  ARRAY['Red Sea', 'Diving', 'Hurghada', 'Marsa Alam']::text[],
  'egypt diving red sea',
  'Egypt Diving Red Sea: Seasons, Sites, First Dives',
  'An egypt diving red sea primer: water temperature month by month, which wrecks and reefs are worth the boat time, and how a few dive days follow a Nile week.',
  'published',
  '2026-10-16T09:00:00+03:00'::timestamptz,
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
  '2026-10-16T09:00:00+03:00'::timestamptz,
  '2026-10-16T09:00:00+03:00'::timestamptz,
  '[{"id":"67efc13a-32f9-5e13-82d7-0396f0ebcd65","question":"When is the best time for diving in the Red Sea in Egypt?","answer":"Spring and autumn. March to May and September to November give water around 25 to 27 degrees, air that is warm without being punishing, and the calmest crossings to offshore sites. July and August have the warmest water at 28 or 29 degrees but brutal air temperatures, and winter drops to about 22 with more wind cancellations."},{"id":"cab21693-7cfb-548a-8582-6e19fdb0c0e7","question":"Do you need a diving licence to dive in the Red Sea?","answer":"Not for an introductory dive, which takes an afternoon, reaches about 6 metres and is run with an instructor alongside you. Anything beyond that needs certification. A full open water course takes 3 to 4 days here, covering theory, confined water sessions and 4 open water dives, and the conditions make it an easy place to learn."},{"id":"8b79987a-4177-526e-a35c-36327a824544","question":"Which is better for diving, Hurghada or Marsa Alam?","answer":"Hurghada for convenience, Marsa Alam for the diving itself. Hurghada has the most flights, the most dive centres and transfers measured in minutes. Marsa Alam is 3 to 4 hours further south with fewer boats on better reefs, plus Elphinstone and the dugong seagrass beds. First trip, Hurghada. Second trip, go south."},{"id":"4b0c09e3-452e-5a30-b746-3ac3c5971283","question":"Is the Thistlegorm worth the trip?","answer":"Yes, and it is the 1 dive most people plan a whole week around. A British supply ship sunk in 1941, sitting upright in about 30 metres with motorcycles, trucks and railway stock still in the holds. It is a long day boat run from Sharm el Sheikh or an overnight trip from Hurghada, and the early dive beats the crowd."},{"id":"cf6b0096-b560-55d4-924b-7a3c48907a57","question":"How long should you allow for a diving stop in Egypt?","answer":"3 days minimum, 5 if the diving is the point of the trip. 2 days leaves no margin, and 1 windy day on this coast cancels the offshore sites and turns a short stop into nothing. 3 days gives you 5 or 6 dives plus a buffer for weather."},{"id":"ddca129e-05cc-5d97-8bd8-03482fe09a0b","question":"How long after diving can you fly?","answer":"At least 18 hours after repetitive diving, and many operators ask for 24 after several days in the water. This is the most common planning mistake on the Red Sea coast, because it means your last dive cannot be the day before an international flight home. Build the final 2 days of the itinerary around it."},{"id":"7d457af5-00b9-57d5-9622-db11ea7f2305","question":"Are there sharks in the Egyptian Red Sea?","answer":"Yes, and encounters are uncommon rather than routine. Oceanic whitetips appear around offshore pinnacles such as Elphinstone in autumn, and reef sharks turn up on southern sites. Grey reef and whitetip reef sharks are the usual sightings. The 3 big offshore reefs are where the odds are best, and they are advanced dives with current."},{"id":"5e60ad78-78c4-51c2-8a1a-f6dc5ef4063a","question":"Can you snorkel instead of diving?","answer":"Yes, and on this coast it is a real alternative rather than a consolation. The reef tops sit in 3 to 5 metres of water carrying the same fish life the divers see below them. Several resorts have house reefs you walk into from the beach, and a boat snorkel day covers 2 or 3 sites."}]'::jsonb,
  'BlogPosting'
),
(
  'black-and-white-desert-egypt',
  'Black and White Desert Egypt: Two Deserts in One Drive',
  '<p>You will change your mind about which one you preferred at least twice.</p>

<p>The black and white desert egypt keeps in its Western Desert are two separate landscapes with a road between them, and they are almost always visited as a pair because the pair is what makes the drive make sense. Dark volcanic hills first, then a plateau, then a plain of white chalk towers that looks like nothing else on the continent. About an hour apart.</p>

<p>Both sit south of Bahariya Oasis, which is four to five hours from Cairo on a good tarmac road.</p>

<h2>What the Black and White Desert Egypt Route Covers</h2>

<p>Start at Bahariya. Everything runs south from there.</p>

<p>The Black Desert begins about twenty minutes out of the oasis: low conical hills scattered across an open plain, each one capped and strewn with dark dolerite fragments that have weathered out of the rock above. From a distance it reads as burnt. Close up it is loose black gravel over orange sandstone, and you can climb the smaller cones in ten minutes for the view across the rest.</p>

<p>Next comes Crystal Mountain, which is not a mountain. It is a low ridge of calcite and barite crystals beside the road, small enough to walk around in a few minutes and worth stopping for because the light goes through it.</p>

<p>Then the Agabat valley, where white chalk starts appearing against orange sand in a way that feels like a rehearsal for what is coming.</p>

<p>Then the White Desert proper, which has been a national park since 2002.</p>

<p>The sequence matters more than any single stop. Each landscape resets your eye for the next one, and the black hills are what make the chalk land the way it does two hours later. Reversing the order, which happens if you come up from Farafra instead of down from Bahariya, is a noticeably weaker day.</p>

<!-- OWNER: first-hand paragraph fits well here, on the first sight of the chalk formations coming over the rise -->

<h2>The Chalk, and Why It Looks Like That</h2>

<p>The white is Cretaceous seabed. Chalk laid down when this was under water, then lifted, then worked on by wind carrying sand for a very long time.</p>

<p>Wind erosion cuts from the bottom, because that is where the sand is travelling. Soft lower layers go first and harder caps survive, which is how you end up with formations balanced on stems. The mushroom shapes get photographed most. There are also towers, fins, and a few things that look uncomfortably like animals, which is why one of them is called the chicken and another the rabbit.</p>

<p>The scale is smaller than photographs suggest. Most formations are between two and ten metres, not hundreds, and you walk among them rather than looking up at them from a distance.</p>

<p>Colour is the variable that matters. At midday it is flat and glaring. In the last hour of light it goes cream, then apricot, then pink, and after dark under a moon it goes silver and slightly unreal.</p>

<h2>Camping White Desert Egypt Nights</h2>

<p>The overnight is the point. A day trip that turns round at four in the afternoon misses both ends of the good light and all of the sky.</p>

<p>A white desert camp is a simple affair: mattresses and blankets laid out on rugs inside a windbreak, a cooking fire, and no structures. Operators carry everything in and out. There is no lodge, no permanent site and no plumbing, and anyone expecting a tented camp in the safari sense should reset that expectation now.</p>

<p>Dinner is usually cooked on the fire, often chicken and rice and vegetables in a covered pot buried in embers. Then the fire burns down, the temperature drops, and the sky arrives.</p>

<p>There is a more comfortable version of the same night. The <a href="/white-desert-luxury-camping">luxury camping trip</a> runs the identical route with proper beds, a cook and a support vehicle, which is the difference between enduring the cold and sitting out in it.</p>

<p>There is effectively no light pollution for a hundred kilometres in any direction. The Milky Way is not a faint smudge here, it is the brightest thing overhead, and satellites cross it every few minutes.</p>

<p>Fennec foxes come into camps at night looking for scraps. They are small, enormous eared, entirely unafraid, and they will take food out of an open bag.</p>

<p>Sleeping arrangements are worth understanding before you agree to them. Most camps lay bedding straight onto rugs in the open with a windbreak of blankets on one side, so you fall asleep looking at the sky. Some operators carry small tents for anyone who would rather have walls.</p>

<p>Ask which you are getting. It is the difference between the best night of the trip and a long one.</p>

<h2>The Cold Nobody Warns You About</h2>

<p>Desert nights in winter here get close to freezing. Not chilly. Actually cold, with a wind, in a place where you are sleeping outdoors under blankets.</p>

<p>December through February is the coldest stretch, and it is also the best time to come because the daytime temperature is pleasant. So the answer is not to avoid winter, it is to pack for it: a proper fleece or down layer, a hat, socks to sleep in, and something windproof over the top.</p>

<p>Summer is the reverse problem and a worse one. Daytime heat in the open desert from June to August is dangerous rather than uncomfortable, and most operators do not run overnights then.</p>

<p>March to May and October to November are the compromise months. Warm days, cold but not bitter nights.</p>

<p>Wind is the other seasonal variable and it gets less attention than it should. The khamsin blows out of the south in spring, usually somewhere between March and May, carrying enough sand to close the horizon for a day or two at a time. It does not happen often and it is not dangerous where you will be, but it flattens the light and makes photography pointless.</p>

<p>Operators watch the forecast and will move a night if one is coming. Ask, rather than assuming the itinerary is fixed.</p>

<h2>Getting There and How Long to Allow</h2>

<p>Two nights is the honest minimum for the whole thing: Cairo to Bahariya, a night in the oasis or straight out to the sand, the desert day, the camp, and back. One night works if you leave Cairo early and accept a long final drive.</p>

<p>Three days lets you add the oasis itself, which most people skip and then regret skipping. Bahariya has hot and cold springs, palm groves, a small museum holding some of the Greco Roman Golden Mummies found nearby in the late 1990s, and a hill called the Black Mountain with an English officer''s lookout on top of it from the First World War.</p>

<p>The oasis is also where your driver and cook come from, and where the vehicles are fixed.</p>

<p>The road is tarmac the whole way to Bahariya and the desert driving beyond it is off road in a four wheel drive with a driver who knows the tracks. This is not somewhere to attempt independently. The national park requires a licensed operator, and the practical reason behind the rule is that there is no phone signal and no water.</p>

<p>Most black and white desert egypt tours are sold as a package from Cairo including the transfer, the vehicle, the permits and the camp, because assembling those separately from abroad is more trouble than it saves.</p>

<h2>Where It Fits in an Egypt Trip</h2>

<p>After Cairo, before or after the Nile, and not squeezed between two flights.</p>

<p>The desert is the strongest contrast available to the temple circuit, which is exactly why it works: three days of tombs and colonnades followed by two days where the only built thing is your own fire. Seasonally it lines up with the same window as Luxor and Aswan, so the <a href="/blog/best-time-to-visit-egypt">month by month guide</a> applies here too.</p>

<p>Further west, Siwa is the other desert option and a completely different one, with springs, a fortress town and a salt lake. The <a href="/egypt-travel-guide/siwa-oasis-egypt">Siwa area guide</a> covers that side. Our <a href="/best-luxury-egypt-tours">longer Egypt itineraries</a> treat the Western Desert as a two or three night block rather than a day trip.</p>

<!-- OWNER: first-hand paragraph fits well here, on a specific night at camp and what the cold was actually like -->

<h2>What to Take Into the Sand</h2>

<p>More water than you think, and then more again. Four litres a person a day is not excessive in the cooler months and the camp will carry it for you, but carry your own bottle during the day.</p>

<p>A head torch, because finding anything in a camp with no lighting using a phone screen is miserable. Wet wipes, because there is no washing. A dry bag or a zip bag for a camera, because fine chalk dust gets into everything and sensors do not like it.</p>

<p>Leave the suitcase in Cairo or at the hotel in Bahariya and take an overnight bag. Vehicle space is limited and you will be lifting it in and out of soft sand.</p>

<p>Last thing, and this one people ignore: set an alarm for an hour before sunrise. The chalk at first light, before the wind picks up and before anyone else in camp is awake, is the reason to have come.</p>',
  'Two landscapes about an hour apart, and almost nobody sees one without the other. What the drive covers, what a night out there is actually like, and how cold it gets.',
  'Destinations',
  ARRAY['Western Desert', 'White Desert', 'Black Desert', 'Bahariya']::text[],
  'black and white desert egypt',
  'Black and White Desert Egypt: What the Trip Is Like',
  'The black and white desert egypt route runs from volcanic hills to chalk towers in a single afternoon. Distances, the overnight camp, and what the cold does.',
  'published',
  '2026-10-19T09:00:00+03:00'::timestamptz,
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
  '2026-10-19T09:00:00+03:00'::timestamptz,
  '2026-10-19T09:00:00+03:00'::timestamptz,
  '[{"id":"478ce8f0-f712-5781-a38b-daa4f3a0fd75","question":"Is the Black and White Desert worth the trip from Cairo?","answer":"Yes, if you can give it 2 nights. It is a 4 to 5 hour drive each way to Bahariya, and a day trip that turns round mid afternoon misses the last hour of light and the night sky, which are the 2 best parts. With 2 nights it is the strongest landscape contrast available to a temple itinerary."},{"id":"2bdd87a6-3ba8-50c3-bc0d-e84a9243ac00","question":"Which is better, the White Desert or Siwa Oasis?","answer":"Different trips entirely. The White Desert is 1 extraordinary landscape and a night camping in it, reachable in 2 or 3 days from Cairo. Siwa is a town, a culture, springs and a salt lake, roughly 10 hours from Cairo and worth 3 or 4 nights. Choose the desert for scenery, Siwa for place."},{"id":"1f533b2f-9979-5ae5-9469-7e74a43b348a","question":"How cold does it get camping in the White Desert?","answer":"Close to freezing on winter nights, from December to February, with wind. Daytime in those months is pleasant at around 20 degrees, which catches people out. Pack a down or fleece layer, a hat, socks to sleep in and a windproof shell. Camps supply blankets but they are not sleeping bags."},{"id":"022479df-d92e-5fd8-aaf2-4c04c4139fdc","question":"Can you camp in the White Desert independently?","answer":"No. It has been a national park since 2002 and overnight stays run through licensed operators who hold the permits. The practical reasons are the same as the legal ones: there is no phone signal, no water and no marked track, and the off road driving between formations needs someone who knows the ground."},{"id":"69d0eb79-74d6-5e54-8bbe-8a5cbc892041","question":"How long does the Black and White Desert trip take?","answer":"2 nights is the realistic minimum and 3 is better. Day 1 is the 5 hour drive from Cairo plus the Black Desert and Crystal Mountain, night 1 is the camp, day 2 covers sunrise and the drive back. A third day adds Bahariya itself, including the springs and the Golden Mummies museum."},{"id":"4ad771be-8101-5535-82de-c9155915cdcb","question":"What is the Black Desert made of?","answer":"Dark dolerite, a volcanic rock, broken into fragments that cap and coat hundreds of low conical hills over an orange sandstone plain. It sits about 20 minutes south of Bahariya. The smaller cones take around 10 minutes to climb and the view from the top across the rest of the field is what the stop is for."},{"id":"e5445319-daa9-537b-9b80-08de8e52da9d","question":"What is the best time of year to visit the Western Desert?","answer":"October to November and March to May. Those 4 months give warm days around 25 degrees and cold but tolerable nights. December to February has the most comfortable daytime temperatures but nights near freezing. June to August is genuinely dangerous in open desert and most operators suspend overnight trips then."},{"id":"7e545ba5-e535-541e-9e82-740d5d9180df","question":"Is there phone signal or electricity at the camps?","answer":"Neither. Camps are temporary, carried in and out by the operator, with no structures, no plumbing and no power beyond a vehicle. Bring a power bank and a head torch. The lack of signal is the trade for the 1 thing everybody remembers, which is a sky with no light pollution for 100 kilometres."}]'::jsonb,
  'BlogPosting'
),
(
  'tombs-of-the-nobles',
  'Tombs of the Nobles: Where Ancient Egypt Painted Daily Life',
  '<p>A man is counting geese. Beside him a scribe writes the number down, and behind them both a farmer is arguing about it.</p>

<p>That scene is on a wall in the tombs of the nobles at Luxor, and there is nothing like it in a royal tomb. Kings were painted meeting gods. Their officials were painted doing their jobs, and the jobs turn out to be far more interesting: ploughing, brewing, weighing gold, catching fish, hosting a party with musicians and a great deal of wine.</p>

<p>These are the rooms to go to if you want to know what Egypt actually looked like rather than what it believed.</p>

<h2>Where the Tombs of the Nobles Are</h2>

<p>On the Theban west bank, in the low hill of Sheikh Abd el Qurna, between the Ramesseum and the approach to Hatshepsut''s temple. You drive past the entrance on every standard west bank itinerary.</p>

<p>Several hundred tombs are cut into this hillside and the numbered ones run past four hundred. A handful are open on any given day, sold in small groups on combined tickets rather than individually.</p>

<p>Until recently a village sat directly on top of them. Qurna had been there for generations, built over and sometimes into the tombs, and its residents were relocated to a new settlement between roughly 2006 and 2010. The cleared hillside you see now is very recent.</p>

<h2>The Four Worth Your Morning</h2>

<p>Nakht, TT52, is the one everybody photographs. He was an astronomer of Amun and his chamber is tiny, but it holds the blind harper and the three female musicians, and a marsh hunting scene with a cat in the papyrus. Ten minutes and you have seen it.</p>

<p>Menna, TT69, is the agricultural sequence: surveying a field with a knotted rope, harvesting, winnowing, a girl pulling a thorn out of another girl''s foot at the edge of the crop. The colour is exceptional.</p>

<p>Ramose, TT55, is different in kind. He was vizier under Amenhotep III and then under his son, and the tomb was abandoned half finished when the court moved to Amarna.</p>

<p>One wall is polished raised relief of extraordinary delicacy. The next wall is unfinished Amarna style, elongated and strange. You are looking at the exact moment Egyptian art changed, frozen because the workmen walked away.</p>

<p>Rekhmire, TT100, is a long tall corridor belonging to another vizier, this time under Thutmose III. The walls carry foreign tribute arriving from Nubia, Crete and Syria, and a famous sequence of craftsmen making things: metal, leather, rope, bricks.</p>

<p>Sennefer, TT96, is the fifth if your ticket allows it. He was mayor of Thebes and he had the ceiling of his burial chamber painted as a grape arbour, vines and bunches hanging over your head across the whole room. It is usually called the Tomb of the Vines and the steps down to it are steep and uneven.</p>

<!-- OWNER: first-hand paragraph fits well here, on the moment you first stand in Ramose and see the two halves of the wall -->

<h2>What Makes a Tomb of the Nobles Different</h2>

<p>Scale, method and subject, in that order.</p>

<p>These are small. Most are a courtyard, a transverse hall and a passage, and you will be stooping in several of them. After the royal valley the change of register is abrupt.</p>

<p>The limestone in this hill is poor, so instead of carving into it the decorators plastered the walls and painted onto the plaster. That is why the colour is so immediate: it is paint on a flat ground, not shadow in cut stone, and the palette has barely faded in the sealed chambers.</p>

<p>The subject is the real difference. A king needed the afterlife written on his walls. An official needed to show the office he held and the estate he ran, because that was the claim his eternity rested on. So we get the cattle count, the grain store, the tribute line and the banquet, painted in obsessive detail by people who had seen them.</p>

<h2>Practical Notes for Tombs of the Nobles Luxor Visits</h2>

<p>Tickets are sold in combinations, typically two or three tombs to a ticket, and which combinations exist changes. Buy at the west bank ticket office on the road in or at the site, and expect to pay by card rather than cash.</p>

<p>Allow ninety minutes for three tombs at a proper pace, including the walk between entrances, which is up and down a dusty slope.</p>

<p>Photography rules vary tomb by tomb and year by year. Some allow it with a separate photo ticket, some do not allow it at all, and guardians enforce the current rule rather than last year''s.</p>

<p>Take a torch. Lighting inside is minimal and the best details are on the upper registers.</p>

<p>The ground is the other thing to plan for. Entrances sit at different heights on a slope of loose rubble and dust, there are no handrails, and several tombs are entered down steps cut for people carrying a coffin rather than for visitors in trainers. Anyone with a knee that objects to steep descents should say so at the ticket desk, because the guardians know which of the open tombs are the flat ones.</p>

<p>Nobody sells water on the hill. Buy it before you leave the ticket office.</p>

<h2>The Cliff Tombs Above Aswan</h2>

<p>Six hundred kilometres upriver there is a second site with the same name and a completely different character. Qubbet el Hawa sits in the cliff on the west bank opposite Aswan, and the tombs cut into it belong to the Old and Middle Kingdom governors who ran the southern frontier from Elephantine Island.</p>

<p>These men were not courtiers. They were expedition leaders who went into Nubia and came back, and their autobiographies are carved beside their doors.</p>

<p>Harkhuf''s is the one to read. He led four trading expeditions south under Pepi II and brought back a dancing pygmy, and the letter the boy king wrote him about it, all excitement and instructions not to let the man fall in the river, is reproduced on the tomb facade. It is the oldest piece of personal correspondence most visitors will ever stand in front of.</p>

<p>Sarenput II is the best preserved chamber, with painted pillars and a niche at the back. Mekhu and Sabni share a double tomb reached by the same stair.</p>

<p>Getting there means a boat across the river and then a climb, either up the old causeway steps or by a road that goes round. The view back over Elephantine and the cataract from the terrace is worth the effort on its own, and late afternoon is when to be up there. The <a href="/blog/things-to-do-in-aswan">Aswan guide</a> covers how this fits with the island sites and the ferries.</p>

<h2>How to Fit Them Into a West Bank Day</h2>

<p>Second, not first. The royal valley has to be done at opening because the heat is unmanageable later, and the nobles'' hill is more forgiving: the chambers are shaded and the walking is short.</p>

<p>The sequence that works is tombs at opening, Hatshepsut next, then this hillside, then out. Most groups replace this stop with the Colossi of Memnon, which takes four minutes and shows you two statues from a car park.</p>

<p>Anyone planning tombs of the nobles egypt keeps on this hill into a longer stay should read the <a href="/egypt-travel-guide/attractions-in-luxor">Luxor area guide</a> for how the two banks split up. Our <a href="/best-luxury-egypt-tours">longer Egypt itineraries</a> give the west bank two mornings, which is what makes this stop possible at all.</p>

<!-- OWNER: first-hand paragraph fits well here, on which tomb guests remember afterwards and why -->

<h2>What to Look for Once You Are Inside</h2>

<p>Faces. The painters of these chambers were not working to the royal template and individual faces appear, especially among servants and musicians.</p>

<p>Then look for mistakes. Guide lines under the paint, a figure redrawn, a scene squeezed to fit a corner. The royal tombs were finished by the best workshops in the country and these were not always, which means you can see the working.</p>

<p>Then look at the food. Every banquet wall is an inventory of what people actually ate, down to the shape of the loaves and the cut of the meat.</p>

<p>Then look at the women. The banquet scenes put them in sheer pleated linen with cones of scented fat on their wigs, holding lotus flowers, being served by girls half their size because size means rank rather than age. Nothing in the royal valley is remotely this social.</p>

<p>One instruction before you go in: ask the guardian which wall has the harvest scene, then start there and work left. The entrance wall is usually the most damaged, and starting with it sets the wrong expectation for the room.</p>',
  'Kings got the underworld. Officials got the harvest, the banquet and the cattle count, which is why these small painted rooms tell you more about how Egypt worked.',
  'Culture & History',
  ARRAY['Tombs of the Nobles', 'Luxor', 'Aswan', 'West Bank']::text[],
  'tombs of the nobles',
  'Tombs of the Nobles: Daily Life on Painted Walls',
  'The tombs of the nobles show harvests, banquets and hunting rather than gods. Which chambers to pick on the Luxor hillside, plus the cliff tombs above Aswan.',
  'published',
  '2026-10-21T09:00:00+03:00'::timestamptz,
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
  '2026-10-21T09:00:00+03:00'::timestamptz,
  '2026-10-21T09:00:00+03:00'::timestamptz,
  '[{"id":"9066134a-1f75-5bda-89e6-30c937a812d8","question":"Are the Tombs of the Nobles worth visiting?","answer":"Yes, and they answer a different question from the royal tombs. These are painted with harvests, banquets, craftsmen and cattle counts rather than gods, so they show how Egypt worked rather than what it believed. 3 tombs take about 90 minutes and you will often share the hillside with almost nobody."},{"id":"f7ff86b7-4626-5c01-8da3-d58b0664b03f","question":"Which is better, the Tombs of the Nobles or the Valley of the Kings?","answer":"The royal valley for scale and for the sheer ambition of the decoration, the nobles'' hill for daily life and for colour on flat plaster. Most visitors with 2 west bank mornings do both. With only 1 morning the royal tombs win, but the officials'' chambers are the better second visit."},{"id":"19161266-d1ee-5186-ae86-2217c92845fd","question":"Which Tombs of the Nobles should you choose?","answer":"Nakht TT52, Menna TT69, Ramose TT55 and Rekhmire TT100. Nakht holds the blind harper and the 3 musicians. Menna has the harvest sequence. Ramose has the unfinished wall where Egyptian art visibly changes mid room. Rekhmire covers foreign tribute and craftsmen. Tickets are sold in groups of 2 or 3, so the combinations decide part of it."},{"id":"4808167d-ce02-500d-879a-2327ef7a7cff","question":"How long do you need at the Tombs of the Nobles?","answer":"About 90 minutes for 3 tombs. Each chamber takes roughly 10 to 15 minutes, and the rest is walking between entrances on a dusty slope. The tombs are small, with low ceilings that require stooping in places, so the time is spent looking rather than covering ground."},{"id":"0eee5bbf-b81d-59a9-96f8-7993ebda7ca5","question":"Where are the Tombs of the Nobles at Aswan?","answer":"At Qubbet el Hawa, in the cliff on the west bank of the Nile opposite Aswan town. They hold the Old and Middle Kingdom governors of Elephantine, including Harkhuf, who led 4 expeditions into Nubia. Reaching them means a boat across the river and a climb, and the view over the cataract is worth it."},{"id":"f974a610-d84c-5248-b7bf-f5b3a015c284","question":"Can you take photographs inside?","answer":"In some chambers yes, in others no, and the rule changes from year to year. Where it is allowed a separate photo ticket is usually required, and guardians enforce whatever the current arrangement is rather than last season''s. Carry a torch either way, because lighting is minimal and the best details sit 2 metres or more above your head."},{"id":"496ec524-4042-5d66-9d9f-487eb78e156d","question":"Why is the painting so well preserved?","answer":"Because it is paint on plaster in sealed chambers rather than relief cut into stone exposed to weather. The limestone of this hill is poor quality, so decorators plastered the walls first. The colour has barely faded in over 3000 years, and in the better tombs it looks close to the day it was applied."},{"id":"7fff2a2a-3154-5a2e-bc18-4f203742ca92","question":"Where exactly is the Luxor site?","answer":"In the hill of Sheikh Abd el Qurna on the Theban west bank, between the Ramesseum and the approach road to Hatshepsut''s temple. Several hundred tombs are cut into the slope, with numbers running past 400, and a handful are open at any time. Every standard west bank itinerary drives past the entrance."}]'::jsonb,
  'BlogPosting'
),
(
  'open-air-museum-memphis-egypt',
  'Open Air Museum Memphis Egypt: The Colossus on Its Back',
  '<p>He is lying on his back, ten metres of him, looking at the ceiling.</p>

<p>The open air museum memphis egypt keeps at the village of Mit Rahina is built around one object, and that object is a fallen statue of Ramesses II that nobody has ever managed to stand up again. You walk in at ground level, then up onto a gallery, and you end up looking down at a king''s face from about the height of his shoulder. There is no other view like it in the country.</p>

<p>The whole visit takes forty minutes. Plan accordingly, because the value here is not in the time it takes.</p>

<h2>The Open Air Museum Memphis Egypt Built Around a Fallen King</h2>

<p>The colossus was found in 1820 by Giovanni Caviglia, face down in mud near the site of the great temple of Ptah. It is limestone, it was carved in the thirteenth century BC, and it is missing its lower legs, which is why it has never been re erected.</p>

<p>For a long time it lay in the open under a simple shelter. It now has a purpose built hall with a raised walkway running along one side, so you can see the face from above and then go down and walk the length of the body.</p>

<p>Look at the workmanship close up. The fingernails are carved. The cartouches on the belt and the shoulder are crisp. Whatever you think of Ramesses II as a self publicist, and the case against him is strong, the sculptors who worked for him were the best in the world at the time.</p>

<p>A second colossus from the same site stood for decades in a traffic square in central Cairo, breathing exhaust fumes, until it was moved out to the new museum near the pyramids. This one stayed where it fell.</p>

<!-- OWNER: first-hand paragraph fits well here, on what guests say when they come up onto the gallery -->

<h2>The Alabaster Sphinx</h2>

<p>Outside in the garden, and easy to walk past because it sits low.</p>

<p>Roughly eight metres long and estimated at around eighty tonnes, carved from a single block of Egyptian alabaster, which is calcite rather than the softer gypsum alabaster of European sculpture. It has no inscription, so the attribution is argued: Hatshepsut, Amenhotep II and Thutmose III have all been proposed on stylistic grounds.</p>

<p>It is the largest alabaster statue known. The surface has weathered to a soft cream and in late afternoon light it goes almost translucent at the edges.</p>

<p>Walk round the back. The rear legs and tail are carved with the same care as the face, which is not something the original viewers would often have seen.</p>

<h2>What Else Is Actually on Display</h2>

<p>Less than you might expect, and that is worth knowing before you arrive.</p>

<p>The garden holds a scattering of statuary, mostly Ramesses II again, plus sarcophagi, temple column fragments, Hathor headed capitals and a run of sphinxes. Much of it is unlabelled or labelled minimally.</p>

<p>The one item people miss is the alabaster embalming table, a large slab carved with channels, used in the mummification of the Apis bulls that were the living form of Ptah and were buried in enormous stone sarcophagi at Saqqara. It is flat, it is in the open, and it explains the bull galleries up the road better than any sign at Saqqara does.</p>

<p>There is a small indoor room with minor objects. It takes five minutes.</p>

<p>What the open air museum memphis egypt has assembled here is a rescue collection rather than a curated one. These are the pieces that were too big to move, too broken to sell, or found after the era when finds left the country. That is not a criticism. It is the reason the two great objects are still standing in the fields they were carved for.</p>

<h2>Why There Is So Little Left of Memphis</h2>

<p>Because the city was built of mud brick, and because the stone that was not mud brick was carried away to build Cairo.</p>

<p>Memphis was the capital of Egypt for most of the Old Kingdom and stayed a major city for two thousand years after that. The temple of Ptah at its centre was called Hut ka Ptah, and the Greek rendering of that name is where the word Egypt ultimately comes from.</p>

<p>Ptah was the craftsman god, patron of sculptors and metalworkers, and the city was the country''s workshop as much as its capital. That is a useful thing to hold in mind while looking at the fingernails on the colossus.</p>

<p>The Apis bull lived in the temple precinct here as the god made flesh. One bull at a time, selected by its markings, kept, fed, consulted as an oracle, and on its death embalmed on a table like the one in the garden and carried up to Saqqara for burial.</p>

<p>What is above ground today is a village, palm groves, farmland and a few enclosures of excavated rubble. The water table has risen since antiquity and much of the ancient city sits below it, waterlogged and unexcavated.</p>

<p>So the memphis open air museum is not a ruin you walk around. It is a collection of what survived, gathered into a garden beside the village, with the city itself under the fields behind it.</p>

<h2>Fitting It Into a Saqqara Morning</h2>

<p>This is the part that matters. On its own the site is a curiosity. In sequence it is the thing that makes the whole day legible.</p>

<p>Mit Rahina sits about three kilometres from Saqqara and roughly twenty five south of central Cairo. Saqqara is the necropolis of Memphis: the stepped royal tomb, the mastabas of officials, the bull galleries. The city those tombs belonged to is this one.</p>

<p>Visit the city first, then the cemetery. Forty minutes here, then two or three hours at Saqqara, and the tombs stop being isolated monuments in sand.</p>

<p>Dahshur is ten kilometres further south and adds the two pyramids of Sneferu, which are the best argument in Egypt for how pyramid building was worked out by trial and error. The <a href="/blog/dahshur-pyramids-egypt">guide to Dahshur</a> covers that pair in detail and why the Bent Pyramid is the more interesting of the two.</p>

<p>All three in one day is a long morning and an early start. It is also the single best day trip out of the capital, and the <a href="/egypt-travel-guide/cairo-travel-guide">Cairo area guide</a> sets out how it compares with the Giza plateau. Our <a href="/10-day-egypt-tour">longer Egypt itineraries</a> run this trio as one full day rather than splitting it.</p>

<!-- OWNER: first-hand paragraph fits well here, on the drive through Mit Rahina village and what it looks like now -->

<h2>Practical Detail</h2>

<p>Tickets are bought at the gate and are inexpensive compared with the major sites. Payment across the Cairo area has largely moved to card, so do not rely on cash.</p>

<p>There is a car park, a row of souvenir stalls and a toilet block. The stalls are persistent and there is no way round them to the entrance.</p>

<p>Shade is limited in the garden. The colossus hall is covered and cool, everything else is open, and between May and September the middle of the day is unpleasant.</p>

<p>Guides are not supplied at the gate and the labelling will not do the job for you. If you are travelling with an Egyptologist they will spend most of the stop on the colossus and the embalming table, which is the right allocation. If you are not, read about Ptah and the Apis bull before you arrive, because those two things are what the site is about and neither is explained on any sign in the garden.</p>

<p>The site is flat and the walkway in the colossus hall has a ramp as well as steps, which makes this one of the more accessible ancient sites near Cairo. Saqqara, half an hour later, is the opposite.</p>

<h2>When to Go and What to Photograph</h2>

<p>Early, for the same reason as everywhere else in Egypt, but here there is a second argument for late.</p>

<p>The colossus is indoors under a roof, so its light does not change much through the day. The sphinx is outdoors and it does. Around four in the afternoon the low sun comes across the alabaster from the side and picks out the tool marks, and that is the photograph.</p>

<p>If you are doing memphis open air museum egypt style sightseeing as part of a Saqqara day, you will be here in the morning and the sphinx will be flatly lit. That is the trade, and it is the right one.</p>

<p>One instruction for the colossus hall: go up to the gallery first, walk the full length of it, and only then go down to floor level. In the other order the face from above loses most of its effect, because you have already seen the whole statue and your eye has stopped being surprised by the scale.</p>',
  'Forty minutes, two extraordinary objects and a lot of broken stone in a garden. It is a short stop, and it makes far more sense of Saqqara than Saqqara does on its own.',
  'Culture & History',
  ARRAY['Memphis', 'Mit Rahina', 'Saqqara', 'Ramesses II']::text[],
  'open air museum memphis egypt',
  'Open Air Museum Memphis Egypt: What Is on Display',
  'The open air museum memphis egypt keeps at Mit Rahina holds a fallen colossus and an alabaster sphinx. What is there, how long it takes, what to pair it with.',
  'published',
  '2026-10-24T09:00:00+03:00'::timestamptz,
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
  '2026-10-24T09:00:00+03:00'::timestamptz,
  '2026-10-24T09:00:00+03:00'::timestamptz,
  '[{"id":"58d47270-f800-5e76-a949-f5be7f462bf4","question":"Is the Memphis open air museum worth visiting?","answer":"Yes, as a 40 minute stop rather than a destination. It holds 2 objects of the first rank, a 10 metre fallen colossus of Ramesses II and the largest known alabaster statue, and it gives Saqqara 3 kilometres away the context it otherwise lacks. Visited on its own it will feel thin."},{"id":"dee49ff6-7f5c-5112-8b5f-40410492159a","question":"How long do you need at Memphis?","answer":"About 40 minutes. 15 in the colossus hall, 10 around the alabaster sphinx, and the rest walking the garden of statuary and sarcophagi. There is a small indoor room that takes 5 minutes. Nobody needs longer, and building an hour and a half into a schedule for it wastes time better spent at Saqqara."},{"id":"7149bce0-a9eb-56d6-93a9-5b14fc7eae21","question":"Which is better, Memphis or Saqqara?","answer":"Saqqara, by a wide margin, and the honest answer is that they are not alternatives. Saqqara is a vast necropolis worth 2 or 3 hours. Memphis is the city those tombs belonged to and takes 40 minutes. Doing Memphis first makes Saqqara make sense, which is the whole argument for the stop."},{"id":"6808e2df-fe2f-5e0e-8d39-3682118473c1","question":"What is on display at the Memphis museum?","answer":"2 major objects and a garden of fragments. The fallen limestone colossus of Ramesses II sits in a covered hall with a viewing gallery. The alabaster sphinx of around 80 tonnes stands outside. Around them are sarcophagi, Hathor headed capitals and sphinxes, plus the alabaster embalming table used for the Apis bulls, which most people walk straight past."},{"id":"f510d8d2-8ed9-5189-b393-d1e16235d889","question":"Why is so little of ancient Memphis left?","answer":"It was built in mud brick, and the stone that was not mud brick was quarried away to build medieval Cairo. The capital stood for over 2000 years, and what remains above ground today is a village, palm groves and farmland. The water table has risen since antiquity, leaving much of the city waterlogged."},{"id":"2d09b281-c132-5d74-8211-9209b01b2b92","question":"How far is Memphis from Cairo?","answer":"Roughly 25 kilometres south of central Cairo, at the village of Mit Rahina, which is about 45 minutes by road depending on traffic. Saqqara is 3 kilometres further and Dahshur about 10 beyond that, so all 3 sit on 1 route and are normally done as a single day trip."},{"id":"508122ff-8f7c-5157-99a9-4855c9203e40","question":"Can you stand the Ramesses colossus upright?","answer":"No, because its lower legs are missing. It was found face down in mud in 1820 and has been displayed lying on its back ever since, now under a purpose built roof with a raised walkway along 1 side. A second colossus from the same site was moved to the new museum near the pyramids."},{"id":"ba1c5e97-9c54-5847-abe2-a22517b8b014","question":"Is the site accessible for limited mobility?","answer":"Largely yes, which is unusual for an ancient site here. The garden is flat, the distances are short, and the colossus hall has a ramp as well as steps up to the viewing gallery. Saqqara, the next stop on most itineraries, is the opposite, with sand, steep descents and 1 long climb."}]'::jsonb,
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
-- be 5.
-- ---------------------------------------------------------------------------
SELECT count(*) AS rows_present FROM posts WHERE slug IN ('valley-of-the-queens', 'egypt-diving-red-sea', 'black-and-white-desert-egypt', 'tombs-of-the-nobles', 'open-air-museum-memphis-egypt');

SELECT slug,
       length(meta_title) AS title_len,
       length(meta_description) AS meta_len,
       jsonb_array_length(faqs) AS faq_count,
       array_length(regexp_split_to_array(regexp_replace(body_en, '<[^>]+>', ' ', 'g'), '\s+'), 1) AS body_words,
       scheduled_at,
       published_at,
       CASE WHEN body_en LIKE '%<figure%' THEN 'body kept, it has figures in it'
            ELSE 'body written from this file' END AS body_en_outcome
FROM posts WHERE slug IN ('valley-of-the-queens', 'egypt-diving-red-sea', 'black-and-white-desert-egypt', 'tombs-of-the-nobles', 'open-air-museum-memphis-egypt') ORDER BY scheduled_at;

SELECT 'valley-of-the-queens' AS slug,
       (SELECT count(*) FROM regexp_matches(body_en, 'valley of the queens', 'gi')) AS primary_hits
FROM posts WHERE slug = 'valley-of-the-queens';
SELECT 'egypt-diving-red-sea' AS slug,
       (SELECT count(*) FROM regexp_matches(body_en, 'egypt diving red sea', 'gi')) AS primary_hits
FROM posts WHERE slug = 'egypt-diving-red-sea';
SELECT 'black-and-white-desert-egypt' AS slug,
       (SELECT count(*) FROM regexp_matches(body_en, 'black and white desert egypt', 'gi')) AS primary_hits
FROM posts WHERE slug = 'black-and-white-desert-egypt';
SELECT 'tombs-of-the-nobles' AS slug,
       (SELECT count(*) FROM regexp_matches(body_en, 'tombs of the nobles', 'gi')) AS primary_hits
FROM posts WHERE slug = 'tombs-of-the-nobles';
SELECT 'open-air-museum-memphis-egypt' AS slug,
       (SELECT count(*) FROM regexp_matches(body_en, 'open air museum memphis egypt', 'gi')) AS primary_hits
FROM posts WHERE slug = 'open-air-museum-memphis-egypt';

SELECT 'seo lengths out of range' AS check, count(*) AS bad FROM posts
WHERE slug IN ('valley-of-the-queens', 'egypt-diving-red-sea', 'black-and-white-desert-egypt', 'tombs-of-the-nobles', 'open-air-museum-memphis-egypt') AND (length(meta_title) > 60 OR length(meta_description) NOT BETWEEN 150 AND 160);

SELECT 'faq count out of range' AS check, count(*) AS bad FROM posts
WHERE slug IN ('valley-of-the-queens', 'egypt-diving-red-sea', 'black-and-white-desert-egypt', 'tombs-of-the-nobles', 'open-air-museum-memphis-egypt') AND jsonb_array_length(faqs) NOT BETWEEN 7 AND 8;

-- Answers are written to be quoted on their own by an AI answer engine, which
-- means 40 to 80 words each. Outside that they are either empty or too long.
SELECT 'faq answers outside 40-80 words' AS check, count(*) AS bad
FROM posts p, jsonb_array_elements(p.faqs) f
WHERE p.slug IN ('valley-of-the-queens', 'egypt-diving-red-sea', 'black-and-white-desert-egypt', 'tombs-of-the-nobles', 'open-air-museum-memphis-egypt')
  AND array_length(regexp_split_to_array(trim(f->>'answer'), '\s+'), 1) NOT BETWEEN 40 AND 80;

-- The SEO overrides must be NULL, not empty strings, or the fallbacks break.
SELECT 'seo overrides stored as empty strings' AS check, count(*) AS bad FROM posts
WHERE slug IN ('valley-of-the-queens', 'egypt-diving-red-sea', 'black-and-white-desert-egypt', 'tombs-of-the-nobles', 'open-air-museum-memphis-egypt')
  AND (canonical_url = '' OR robots = '' OR og_image = '' OR schema_type = '' OR featured_image_alt = '');

SELECT 'faq entries missing id, question or answer' AS check, count(*) AS bad
FROM posts p, jsonb_array_elements(p.faqs) f
WHERE p.slug IN ('valley-of-the-queens', 'egypt-diving-red-sea', 'black-and-white-desert-egypt', 'tombs-of-the-nobles', 'open-air-museum-memphis-egypt')
  AND (coalesce(f->>'id','') = '' OR coalesce(f->>'question','') = '' OR coalesce(f->>'answer','') = '');

SELECT 'em or en dash present' AS check, count(*) AS bad FROM posts
WHERE slug IN ('valley-of-the-queens', 'egypt-diving-red-sea', 'black-and-white-desert-egypt', 'tombs-of-the-nobles', 'open-air-museum-memphis-egypt')
  AND (body_en ~ '[\u2013\u2014]' OR meta_title ~ '[\u2013\u2014]' OR meta_description ~ '[\u2013\u2014]' OR title_en ~ '[\u2013\u2014]');

-- Tour links must sit at the site root. Anything under the category path 404s.
SELECT 'tour links under /luxury-egypt-tour-packages/' AS check, count(*) AS bad FROM posts
WHERE slug IN ('valley-of-the-queens', 'egypt-diving-red-sea', 'black-and-white-desert-egypt', 'tombs-of-the-nobles', 'open-air-museum-memphis-egypt') AND body_en ~ 'href="/luxury-egypt-tour-packages/[^"]';

-- The hotel listing moved. A link to the old path still works through the 301,
-- and costs every reader a hop for no reason.
SELECT 'links to the old /stay path' AS check, count(*) AS bad FROM posts
WHERE slug IN ('valley-of-the-queens', 'egypt-diving-red-sea', 'black-and-white-desert-egypt', 'tombs-of-the-nobles', 'open-air-museum-memphis-egypt') AND body_en ~ 'href="/stay';

SELECT 'unfilled placeholders' AS check, count(*) AS bad FROM posts
WHERE slug IN ('valley-of-the-queens', 'egypt-diving-red-sea', 'black-and-white-desert-egypt', 'tombs-of-the-nobles', 'open-air-museum-memphis-egypt') AND (body_en LIKE '%data-placeholder=%' OR body_en ~ '\{\{[A-Z_]+\}\}');

SELECT 'other language columns left empty' AS check, count(*) AS bad FROM posts
WHERE slug IN ('valley-of-the-queens', 'egypt-diving-red-sea', 'black-and-white-desert-egypt', 'tombs-of-the-nobles', 'open-air-museum-memphis-egypt')
  AND (title_es IS NOT NULL OR title_fr IS NOT NULL OR title_jp IS NOT NULL
       OR body_es IS NOT NULL OR body_fr IS NOT NULL OR body_jp IS NOT NULL);

-- The owner paragraphs are deliberately left as HTML comments for someone to
-- replace with a real first hand voice. This is a reminder, not a failure.
SELECT slug,
       (length(body_en) - length(replace(body_en, '<!-- OWNER:', ''))) / 11 AS owner_notes_awaiting_a_paragraph
FROM posts WHERE slug IN ('valley-of-the-queens', 'egypt-diving-red-sea', 'black-and-white-desert-egypt', 'tombs-of-the-nobles', 'open-air-museum-memphis-egypt') ORDER BY slug;
