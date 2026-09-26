-- On page SEO for the three spiritual tours: body, FAQs, schema, canonical,
-- robots, schema type, og image and internal links.
--
--   psql "$DATABASE_URL" -f content-updates/seo-spiritual-tours.sql
--
-- RUN content-updates/category-keywords.sql AND THE ITINERARY FILES FIRST.
-- This file assumes focus_keyword, meta_description, hero_image_alt, the titles
-- and the itinerary are already in place, and it builds the schema graph from
-- tours.itinerary.
--
-- KEYWORDS
-- Each page carries its own focus phrase as an exact phrase inside the first
-- 100 words, in at least one h2, and three times in total across the body. None
-- of the other seven phrases appears as a heading on any of these pages, which
-- is checked by matching the full phrase in order rather than word by word.
--
-- SCHEMA BUILT FROM THE DATA
-- The FAQPage node is built from the faqs column and the itinerary ItemList
-- from tours.itinerary, both in SQL, so neither can drift from its source. No
-- offers, no priceRange and no price property appears anywhere in the graph.
--
-- CANONICALS
-- A tour's canonical on this site is SITE_URL plus the slug at the root, not
-- the category path: server/seo-meta.ts builds it as `${{SITE_URL}}/${{tour.slug}}`
-- and the sitemap emits the same. No slug is changed by this file.
--
-- LINKS
-- Every tour links to its two siblings once each, in a sentence that says why
-- someone might prefer the other one, and once to its category. Honeymoon and
-- spiritual tours are not cross linked, because the audiences are different.
--
-- Safe to run twice. Dollar quoting on every text value.

\set ON_ERROR_STOP on

BEGIN;

DO $GUARD$
DECLARE missing text;
BEGIN
  SELECT string_agg(s, $D$, $D$) INTO missing FROM (
    SELECT s FROM unnest(ARRAY[$D$white-desert-luxury-camping$D$, $D$10-day-spiritual-egypt$D$, $D$private-spiritual-tours-egypt-14-days-sacred-journey$D$]) AS s
    WHERE NOT EXISTS (SELECT 1 FROM tours WHERE tours.slug = s)) x;
  IF missing IS NOT NULL THEN RAISE EXCEPTION $D$tours not found: %$D$, missing; END IF;
  IF NOT EXISTS (SELECT 1 FROM categories WHERE name = $D$Spiritual Journeys Egypt$D$) THEN
    RAISE EXCEPTION $D$category Spiritual Journeys Egypt not found by name$D$;
  END IF;
END
$GUARD$;

UPDATE tours SET
  description   = replace($D$<p>The white desert egypt trip is the one itinerary in this category that has no temple in it at all.</p>
<p>Eight days run from Giza out to Bahariya, south through the Black Desert to the chalk formations, on to Crystal Mountain and the oasis town of Farafra, and back the same way.</p>
<p>Four of the seven nights are spent in a camp in the open with no building of any kind between you and the sky.</p>
<p>It sits in this category because people come to it for the same reason they come to the temples, and not because anything here is being claimed on its behalf.</p>

<h2>What a White Desert Egypt Camping Trip Actually Involves</h2>
<p>You transfer to a four wheel drive at Bahariya, because the vehicle that brings you from Cairo cannot go where the rest of the week goes.</p>
<p>The camp is set up and taken down each time you move, and the facilities are what a desert camp has rather than what a hotel has.</p>
<p>Nights are colder than people expect, even in summer, and the sky after dark is as dark as it gets anywhere in the country.</p>
<p>The drive out from Cairo is several hours on a single desert road and the drive back is the same, which the itinerary treats as two real days rather than hiding.</p>

<h2>Who It Suits</h2>
<p>It suits people who are comfortable without a room for four nights and who find an empty landscape more interesting than a carved wall.</p>
<p>It does not suit anyone who needs a shower every evening, and a white desert egypt trip is not a sensible first visit to the country if you have never seen the pyramids.</p>
<p>If the sites are what you are after, the ten day <a href="/10-day-spiritual-egypt">Spiritual Egypt</a> itinerary is built entirely around temples, and the fourteen day <a href="/private-spiritual-tours-egypt-14-days-sacred-journey">Egypt Spiritual Retreat</a> combines sacred sites with the oasis at Siwa if you want both.</p>

<h2>What Is Decided Later</h2>
<p>Which formations you walk among on the chalk plateau depends on where the camp is set that night and what the wind has done recently.</p>
<p>Whether you swim at the hot springs at Bahariya or at Bir Sitta outside Farafra is a choice on the day.</p>
<p>Sleeping arrangements, dietary requirements and how much of the driving you want in one go are settled with your planner before you travel, because in the desert they cannot be changed once you are out there.</p>
<p>The other two itineraries in <a href="CATLINK">Egypt Spiritual Tours</a> are both site based, so this one is the outlier and it is meant to be.</p>$D$, $D$CATLINK$D$, (SELECT $D$/$D$ || CASE c.category_type WHEN $D$day-tours$D$ THEN $D$egypt-day-tours$D$ WHEN $D$nile-cruise$D$ THEN $D$egypt-nile-cruise-tours$D$ ELSE $D$luxury-egypt-tour-packages$D$ END || $D$/$D$ || c.slug FROM categories c WHERE c.name = $D$Spiritual Journeys Egypt$D$)),
  faqs          = $D$[
  {
    "id": "sp08-0001-4000-8000-000000000001",
    "question": "Is a white desert egypt camping trip suitable for someone who has never camped?",
    "answer": "Yes, provided you know what you are agreeing to. The camp is set up for you and the cooking is done for you, but there is no building, no running water and no power beyond what the vehicles carry. People who have never camped often manage well; people who need a shower every evening do not."
  },
  {
    "id": "sp08-0002-4000-8000-000000000002",
    "question": "How cold does it get at night?",
    "answer": "Colder than most visitors expect, including in summer, because the desert loses its heat quickly once the sun goes. Bedding is provided and warm layers are worth packing even for an August departure. The contrast between afternoon and midnight is the thing people are least prepared for."
  },
  {
    "id": "sp08-0003-4000-8000-000000000003",
    "question": "How long is the drive from Cairo?",
    "answer": "Several hours each way on a single desert road, and the itinerary gives it a full day in each direction rather than absorbing it into a sightseeing day. There are stops for food and for standing up whenever you want them. The drive is empty rather than scenic for most of its length."
  },
  {
    "id": "sp08-0004-4000-8000-000000000004",
    "question": "Is there a signal, and can we charge anything?",
    "answer": "Mobile coverage is intermittent around Bahariya and effectively absent in the deeper desert. Charging is from the vehicles, so a power bank is worth bringing. Most people find four days without a signal is part of the appeal rather than a problem."
  },
  {
    "id": "sp08-0005-4000-8000-000000000005",
    "question": "Do we need a four wheel drive licence or any experience?",
    "answer": "No. The driving is done by a local driver who reads the route rather than following a map, because the dunes and tracks move. Your only job is to be in the vehicle. Off road driving by guests is not part of this itinerary."
  },
  {
    "id": "sp08-0006-4000-8000-000000000006",
    "question": "Can this be combined with the pyramids and Luxor?",
    "answer": "The itinerary already includes the arrival night at Giza, and extra days in Cairo or Luxor can be added at either end. Combining it with a full temple route inside the same eight days is not realistic given the two long transfer days. Most people who want both take the fourteen day itinerary instead."
  }
]$D$::jsonb,
  canonical_url = $D$https://iluxuryegypt.com/white-desert-luxury-camping$D$,
  robots        = $D$index, follow$D$,
  schema_type   = $D$TouristTrip$D$,
  og_image      = CASE WHEN og_image IS NULL OR og_image = $D$$D$
                       THEN NULLIF(hero_image, $D$$D$) ELSE og_image END
WHERE slug = $D$white-desert-luxury-camping$D$;

UPDATE tours tr SET schema_markup = jsonb_pretty(
  jsonb_build_object(
    $D$@context$D$, $D$https://schema.org$D$,
    $D$@graph$D$, jsonb_build_array(
      jsonb_build_object(
        $D$@type$D$, $D$TouristTrip$D$,
        $D$@id$D$, tr.canonical_url,
        $D$name$D$, tr.title,
        $D$description$D$, tr.meta_description,
        $D$url$D$, tr.canonical_url,
        $D$provider$D$, jsonb_build_object($D$@type$D$, $D$Organization$D$, $D$name$D$, $D$iLuxury Egypt$D$),
        $D$itinerary$D$, jsonb_build_object(
          $D$@type$D$, $D$ItemList$D$,
          $D$numberOfItems$D$, jsonb_array_length(tr.itinerary),
          $D$itemListElement$D$, (
            SELECT jsonb_agg(jsonb_build_object(
              $D$@type$D$, $D$ListItem$D$,
              $D$position$D$, (e->>$D$day$D$)::int,
              $D$item$D$, jsonb_build_object(
                $D$@type$D$, $D$TouristAttraction$D$,
                $D$name$D$, e->>$D$placeName$D$,
                $D$description$D$, e->>$D$title$D$)))
            FROM jsonb_array_elements(tr.itinerary) AS e))
      ),
      jsonb_build_object(
        $D$@type$D$, $D$FAQPage$D$,
        $D$mainEntity$D$, (
          SELECT jsonb_agg(jsonb_build_object(
            $D$@type$D$, $D$Question$D$,
            $D$name$D$, e->>$D$question$D$,
            $D$acceptedAnswer$D$, jsonb_build_object($D$@type$D$, $D$Answer$D$, $D$text$D$, e->>$D$answer$D$)))
          FROM jsonb_array_elements(tr.faqs) AS e))
    )))
WHERE tr.slug = $D$white-desert-luxury-camping$D$;

UPDATE tours SET
  description   = replace($D$<p>A spiritual egypt itinerary is only as good as the temples it chooses and the order it puts them in.</p>
<p>This ten day route goes north before it goes south, which is the decision that separates it from almost every other temple itinerary in the country.</p>
<p>Dendera and Abydos are both north of Luxor and both are day trips that most tours skip because of the drive, and this one gives each of them a full day.</p>
<p>Giza and Saqqara open the trip, Karnak and the west bank follow, and Aswan and Philae close it.</p>

<h2>Why This Spiritual Egypt Route Goes North First</h2>
<p>Dendera has the cleaned ceiling, with blues and golds underneath the soot that are close to what was first painted there.</p>
<p>Abydos has the finest raised relief carving in Egypt and the king list, and it was the cult centre of Osiris for thousands of years.</p>
<p>Both are three hours or less from Luxor and both are usually quiet, which is a combination that does not exist on the standard route.</p>
<p>Doing them on days four and five, before Karnak, means you arrive at the largest temple complex in the country with your eye already trained.</p>

<h2>The Pace</h2>
<p>Two long road days, at Dendera and Abydos, and the rest of it steady.</p>
<p>Site visits start early because Upper Egypt in the middle of the day is not where you want to be walking.</p>
<p>There is a free afternoon on day two and another at Aswan, and the Nubian Museum on day eight is a sitting down afternoon rather than a walking one.</p>
<p>Nothing here requires a pre dawn start, because Abu Simbel is deliberately not on this itinerary.</p>

<h2>Who It Suits and What Is Decided Later</h2>
<p>A spiritual egypt route of this kind suits people who came for the sites themselves and want time in front of them rather than a photograph from the coach park.</p>
<p>It is a reasonable first trip to Egypt as long as you accept that two of the ten days are spent largely in a car.</p>
<p>Which tombs you take on in the Valley of the Kings depends on what is open that morning, and that is a conversation on the day rather than a plan.</p>
<p>If you want Abu Simbel, Siwa and the Osireion as well, the fourteen day <a href="/private-spiritual-tours-egypt-14-days-sacred-journey">Egypt Spiritual Retreat</a> is the longer version of this idea, and the eight day <a href="/white-desert-luxury-camping">White Desert Egypt</a> trip is the one with no temples at all.</p>
<p>All three sit under <a href="CATLINK">Egypt Spiritual Tours</a>.</p>$D$, $D$CATLINK$D$, (SELECT $D$/$D$ || CASE c.category_type WHEN $D$day-tours$D$ THEN $D$egypt-day-tours$D$ WHEN $D$nile-cruise$D$ THEN $D$egypt-nile-cruise-tours$D$ ELSE $D$luxury-egypt-tour-packages$D$ END || $D$/$D$ || c.slug FROM categories c WHERE c.name = $D$Spiritual Journeys Egypt$D$)),
  faqs          = $D$[
  {
    "id": "sp10-0001-4000-8000-000000000001",
    "question": "What makes this a spiritual egypt itinerary rather than a standard temple tour?",
    "answer": "Mostly the choice of sites and the time given to each. Dendera and Abydos get a full day each rather than being skipped for the drive, and the route is built around temples rather than around cities. No claim is made here about what any of these places will do for you; that part is yours."
  },
  {
    "id": "sp10-0002-4000-8000-000000000002",
    "question": "What does this route take instead of Abu Simbel?",
    "answer": "It takes Dendera and Abydos, two northern temples that most itineraries skip because of the drive. Including Abu Simbel as well would mean a pre dawn start and would push one of them off the ten days. The fourteen day route in this category is the one that fits both."
  },
  {
    "id": "sp10-0003-4000-8000-000000000003",
    "question": "How long are the drives to Dendera and Abydos?",
    "answer": "Dendera is roughly an hour and a half north of Luxor and Abydos about three hours. Both are done as day trips with a private vehicle and driver, returning to Luxor in the evening. They are the two longest days of the ten."
  },
  {
    "id": "sp10-0004-4000-8000-000000000004",
    "question": "Is this suitable for a first visit to Egypt?",
    "answer": "Yes, with one caveat. It covers Giza, Saqqara, Luxor and Aswan, which is the standard first visit framework, plus two temples most first visits miss. The caveat is that two days are spent largely in a vehicle, which some people would rather spend elsewhere."
  },
  {
    "id": "sp10-0005-4000-8000-000000000005",
    "question": "How much walking is involved?",
    "answer": "Karnak and the west bank are the demanding days, each a few hours on uneven ground in heat. Dendera and Abydos involve less walking but more sitting in a car. The pace inside each site is yours to set because the guide is private."
  },
  {
    "id": "sp10-0006-4000-8000-000000000006",
    "question": "What is the best time of year for this route?",
    "answer": "October to April, because the itinerary is almost entirely outdoors in Upper Egypt. Summer departures are possible with earlier starts and longer midday breaks. The northern day trips are the ones that suffer most in high summer, since they add road hours to the heat."
  }
]$D$::jsonb,
  canonical_url = $D$https://iluxuryegypt.com/10-day-spiritual-egypt$D$,
  robots        = $D$index, follow$D$,
  schema_type   = $D$TouristTrip$D$,
  og_image      = CASE WHEN og_image IS NULL OR og_image = $D$$D$
                       THEN NULLIF(hero_image, $D$$D$) ELSE og_image END
WHERE slug = $D$10-day-spiritual-egypt$D$;

UPDATE tours tr SET schema_markup = jsonb_pretty(
  jsonb_build_object(
    $D$@context$D$, $D$https://schema.org$D$,
    $D$@graph$D$, jsonb_build_array(
      jsonb_build_object(
        $D$@type$D$, $D$TouristTrip$D$,
        $D$@id$D$, tr.canonical_url,
        $D$name$D$, tr.title,
        $D$description$D$, tr.meta_description,
        $D$url$D$, tr.canonical_url,
        $D$provider$D$, jsonb_build_object($D$@type$D$, $D$Organization$D$, $D$name$D$, $D$iLuxury Egypt$D$),
        $D$itinerary$D$, jsonb_build_object(
          $D$@type$D$, $D$ItemList$D$,
          $D$numberOfItems$D$, jsonb_array_length(tr.itinerary),
          $D$itemListElement$D$, (
            SELECT jsonb_agg(jsonb_build_object(
              $D$@type$D$, $D$ListItem$D$,
              $D$position$D$, (e->>$D$day$D$)::int,
              $D$item$D$, jsonb_build_object(
                $D$@type$D$, $D$TouristAttraction$D$,
                $D$name$D$, e->>$D$placeName$D$,
                $D$description$D$, e->>$D$title$D$)))
            FROM jsonb_array_elements(tr.itinerary) AS e))
      ),
      jsonb_build_object(
        $D$@type$D$, $D$FAQPage$D$,
        $D$mainEntity$D$, (
          SELECT jsonb_agg(jsonb_build_object(
            $D$@type$D$, $D$Question$D$,
            $D$name$D$, e->>$D$question$D$,
            $D$acceptedAnswer$D$, jsonb_build_object($D$@type$D$, $D$Answer$D$, $D$text$D$, e->>$D$answer$D$)))
          FROM jsonb_array_elements(tr.faqs) AS e))
    )))
WHERE tr.slug = $D$10-day-spiritual-egypt$D$;

UPDATE tours SET
  description   = replace($D$<p>An egypt spiritual retreat of fourteen days can either be a long holiday or a coherent route, and the difference is what gets left out.</p>
<p>This itinerary used to include two days at a Red Sea resort, and those days are gone.</p>
<p>What replaced them is the oracle at Siwa, reached by the only means there is, which is roughly ten hours of road in each direction.</p>
<p>Those two transfers are real days in the itinerary rather than being folded into a sightseeing day, because pretending otherwise is how people end up surprised.</p>

<h2>What an Egypt Spiritual Retreat of Fourteen Days Can Reach</h2>
<p>The Serapeum at Saqqara, an underground gallery of granite sarcophagi cut for the Apis bulls, on day three.</p>
<p>The Temple of the Oracle at Aghurmi, which Alexander consulted in 331 BC and left without recording the answer.</p>
<p>The Osireion behind Seti I's temple at Abydos, built of enormous blocks below the water table and argued over for a century.</p>
<p>Philae, where the last known hieroglyphic inscription was cut, and Abu Simbel in the far south.</p>
<p>No shorter itinerary in this category reaches more than half of that list.</p>

<h2>The Pace, and the Two Road Days</h2>
<p>Siwa is done early, on days four to six, so there is one drive out and one drive back rather than crossing the country twice.</p>
<p>Each of those drives is about ten hours with stops when you want them, and the day you arrive in Siwa has no sightseeing in it at all.</p>
<p>The rest of the fortnight is a steady southward run with two internal flights and no other long transfers.</p>
<p>Abu Simbel on day thirteen is the one pre dawn start.</p>

<h2>Who It Suits</h2>
<p>An egypt spiritual retreat this long suits people who have been to Egypt before, or who have not but want the whole thing in one trip rather than two.</p>
<p>It does not suit anyone unwilling to spend twenty hours in a vehicle across a fortnight, and that is the honest test for this route.</p>
<p>If the sites matter but Siwa does not, the ten day <a href="/10-day-spiritual-egypt">Spiritual Egypt</a> itinerary covers the temples without the road days, and the eight day <a href="/white-desert-luxury-camping">White Desert Egypt</a> trip is desert only.</p>
<p>All three are listed under <a href="CATLINK">Egypt Spiritual Tours</a>, and they are built not to duplicate one another.</p>$D$, $D$CATLINK$D$, (SELECT $D$/$D$ || CASE c.category_type WHEN $D$day-tours$D$ THEN $D$egypt-day-tours$D$ WHEN $D$nile-cruise$D$ THEN $D$egypt-nile-cruise-tours$D$ ELSE $D$luxury-egypt-tour-packages$D$ END || $D$/$D$ || c.slug FROM categories c WHERE c.name = $D$Spiritual Journeys Egypt$D$)),
  faqs          = $D$[
  {
    "id": "sp14-0001-4000-8000-000000000001",
    "question": "Why does this egypt spiritual retreat include Siwa when other itineraries do not?",
    "answer": "Because the Temple of the Oracle is one of the few sites in the country with a documented visit by Alexander, and it cannot be reached quickly. Siwa is roughly ten hours from Cairo by road with no civil airport. Fourteen days is the shortest itinerary in which it fits without wrecking everything else."
  },
  {
    "id": "sp14-0002-4000-8000-000000000002",
    "question": "What happened to the Hurghada days this tour used to have?",
    "answer": "They were removed. A beach resort has no place in a sacred sites route, and those two days were the main reason the itinerary read as a generic package. The days now go to Siwa and to the Osireion at Abydos instead."
  },
  {
    "id": "sp14-0003-4000-8000-000000000003",
    "question": "How bad are the two road days really?",
    "answer": "They are long. About ten hours each way on a good road, in a private air conditioned vehicle, with stops for food and for standing up whenever you want them. The day you arrive in Siwa has nothing scheduled after it, and neither does the evening you get back to Cairo."
  },
  {
    "id": "sp14-0004-4000-8000-000000000004",
    "question": "What is the Serapeum and why is it on the itinerary?",
    "answer": "It is an underground gallery cut into the rock at Saqqara to hold the burials of the Apis bulls, lined with granite sarcophagi each carved from a single block. How they were brought down and positioned is still not fully explained. It is one of the strangest places in Egypt and a great many tours skip it."
  },
  {
    "id": "sp14-0005-4000-8000-000000000005",
    "question": "Is fourteen days too long for a first visit?",
    "answer": "It is longer than most first visits and it works if you would rather do the country once than twice. The route repeats no city and has only one pre dawn start. The road days are the part to weigh, not the length."
  },
  {
    "id": "sp14-0006-4000-8000-000000000006",
    "question": "What should we expect from the accommodation at Siwa?",
    "answer": "Siwa has no international property and this itinerary does not pretend otherwise. Accommodation there is local and simple compared to the hotels in Cairo, Luxor and Aswan on the rest of the route. Your planner will tell you exactly what is being booked before you commit."
  }
]$D$::jsonb,
  canonical_url = $D$https://iluxuryegypt.com/private-spiritual-tours-egypt-14-days-sacred-journey$D$,
  robots        = $D$index, follow$D$,
  schema_type   = $D$TouristTrip$D$,
  og_image      = CASE WHEN og_image IS NULL OR og_image = $D$$D$
                       THEN NULLIF(hero_image, $D$$D$) ELSE og_image END
WHERE slug = $D$private-spiritual-tours-egypt-14-days-sacred-journey$D$;

UPDATE tours tr SET schema_markup = jsonb_pretty(
  jsonb_build_object(
    $D$@context$D$, $D$https://schema.org$D$,
    $D$@graph$D$, jsonb_build_array(
      jsonb_build_object(
        $D$@type$D$, $D$TouristTrip$D$,
        $D$@id$D$, tr.canonical_url,
        $D$name$D$, tr.title,
        $D$description$D$, tr.meta_description,
        $D$url$D$, tr.canonical_url,
        $D$provider$D$, jsonb_build_object($D$@type$D$, $D$Organization$D$, $D$name$D$, $D$iLuxury Egypt$D$),
        $D$itinerary$D$, jsonb_build_object(
          $D$@type$D$, $D$ItemList$D$,
          $D$numberOfItems$D$, jsonb_array_length(tr.itinerary),
          $D$itemListElement$D$, (
            SELECT jsonb_agg(jsonb_build_object(
              $D$@type$D$, $D$ListItem$D$,
              $D$position$D$, (e->>$D$day$D$)::int,
              $D$item$D$, jsonb_build_object(
                $D$@type$D$, $D$TouristAttraction$D$,
                $D$name$D$, e->>$D$placeName$D$,
                $D$description$D$, e->>$D$title$D$)))
            FROM jsonb_array_elements(tr.itinerary) AS e))
      ),
      jsonb_build_object(
        $D$@type$D$, $D$FAQPage$D$,
        $D$mainEntity$D$, (
          SELECT jsonb_agg(jsonb_build_object(
            $D$@type$D$, $D$Question$D$,
            $D$name$D$, e->>$D$question$D$,
            $D$acceptedAnswer$D$, jsonb_build_object($D$@type$D$, $D$Answer$D$, $D$text$D$, e->>$D$answer$D$)))
          FROM jsonb_array_elements(tr.faqs) AS e))
    )))
WHERE tr.slug = $D$private-spiritual-tours-egypt-14-days-sacred-journey$D$;

DO $GUARD$
DECLARE bad text;
BEGIN
  SELECT string_agg(slug, $D$, $D$) INTO bad FROM tours
  WHERE slug IN ($D$white-desert-luxury-camping$D$, $D$10-day-spiritual-egypt$D$, $D$private-spiritual-tours-egypt-14-days-sacred-journey$D$)
    AND (position(lower(focus_keyword) in lower(description)) = 0
      OR jsonb_array_length(faqs) <> 6
      OR schema_markup IS NULL);
  IF bad IS NOT NULL THEN RAISE EXCEPTION $D$body, faqs or schema missing on: %$D$, bad; END IF;

  SELECT string_agg(slug, $D$, $D$) INTO bad FROM tours
  WHERE slug IN ($D$white-desert-luxury-camping$D$, $D$10-day-spiritual-egypt$D$, $D$private-spiritual-tours-egypt-14-days-sacred-journey$D$)
    AND (schema_markup ILIKE $D$%priceRange%$D$
      OR schema_markup ILIKE $D$%"offers"%$D$
      OR schema_markup ILIKE $D$%"price"%$D$);
  IF bad IS NOT NULL THEN RAISE EXCEPTION $D$a price property reached the schema on: %$D$, bad; END IF;

  SELECT string_agg(slug, $D$, $D$) INTO bad FROM tours
  WHERE slug IN ($D$white-desert-luxury-camping$D$, $D$10-day-spiritual-egypt$D$, $D$private-spiritual-tours-egypt-14-days-sacred-journey$D$)
    AND description NOT LIKE $D$%/luxury-egypt-tour-packages/%$D$
    AND description NOT LIKE $D$%/egypt-day-tours/%$D$
    AND description NOT LIKE $D$%/egypt-nile-cruise-tours/%$D$;
  IF bad IS NOT NULL THEN RAISE EXCEPTION $D$category link missing on: %$D$, bad; END IF;
END
$GUARD$;

COMMIT;

\echo
\echo seo-spiritual-tours

SELECT
  slug,
  focus_keyword,
  (length(lower(description)) - length(replace(lower(description), lower(focus_keyword), $D$$D$)))
    / length(focus_keyword)                              AS phrase_uses_in_body,
  array_length(regexp_split_to_array(description, $D$<h2>$D$), 1) - 1 AS h2_count,
  jsonb_array_length(faqs)                               AS faqs,
  schema_markup IS NOT NULL                              AS has_schema,
  canonical_url
FROM tours WHERE slug IN ($D$white-desert-luxury-camping$D$, $D$10-day-spiritual-egypt$D$, $D$private-spiritual-tours-egypt-14-days-sacred-journey$D$)
ORDER BY 1;
