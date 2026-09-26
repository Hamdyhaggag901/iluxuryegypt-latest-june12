-- On page SEO for the three honeymoon tours: body, FAQs, schema, canonical,
-- robots, schema type, og image and internal links.
--
--   psql "$DATABASE_URL" -f content-updates/seo-honeymoon-tours.sql
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
    SELECT s FROM unnest(ARRAY[$D$all-inclusive-romantic-vacations-egypt-honeymoon$D$, $D$luxury-egypt-honeymoon$D$, $D$egypt-honeymoon-couples$D$]) AS s
    WHERE NOT EXISTS (SELECT 1 FROM tours WHERE tours.slug = s)) x;
  IF missing IS NOT NULL THEN RAISE EXCEPTION $D$tours not found: %$D$, missing; END IF;
  IF NOT EXISTS (SELECT 1 FROM categories WHERE name = $D$Luxury Honeymoon Egypt$D$) THEN
    RAISE EXCEPTION $D$category Luxury Honeymoon Egypt not found by name$D$;
  END IF;
END
$GUARD$;

UPDATE tours SET
  description   = replace($D$<p>A honeymoon package in egypt has to decide early what it is actually for.</p>
<p>This one is seven days long and it spends three of them on the Red Sea, which is the decision that shapes everything else about it.</p>
<p>You see the Giza plateau and the Sphinx on day two and Karnak on day three, and after that the itinerary stops asking anything of you at all.</p>
<p>That suits two people who have just come out of a wedding and do not want a second fortnight of logistics immediately afterwards.</p>

<h2>Who This Honeymoon Package in Egypt Suits</h2>
<p>It suits a couple with a week rather than a fortnight, and a couple who would rather do two things properly than six things quickly.</p>
<p>It suits anyone who wants to have seen the pyramids without building an entire trip around monuments.</p>
<p>It is the wrong choice for a first visit where the point is to cover as much of the country as possible, because three of the seven days are deliberately unstructured.</p>
<p>If that trade sounds wrong, the nine day <a href="/luxury-egypt-honeymoon">Luxury Honeymoon in Egypt</a> puts those same days on the Nile between Aswan and Luxor, and the ten day <a href="/egypt-honeymoon-couples">Egypt Honeymoon Tours</a> itinerary swaps the beach for Abu Simbel and the Mediterranean at Alexandria.</p>

<h2>The Pace, Honestly</h2>
<p>Two early starts, and then nothing.</p>
<p>The plateau is done before the coaches come out from the city, and Karnak the following morning for the same reason.</p>
<p>The transfer east from Luxor to the coast is a real road crossing of open desert and takes most of a morning, which is better known in advance than discovered on the day.</p>
<p>From the moment you check in at Sahl Hasheesh there is no fixed schedule, and the reef starts close enough to the shore that you do not need a boat to reach it.</p>
<p>Nobody is going to knock on your door at six in the morning after day three.</p>

<h2>What Is Decided Later</h2>
<p>Whether you go inside the Great Pyramid is left as a decision for the morning, because the passage is low, steep and warm and it genuinely suits some people and not others.</p>
<p>Diving and boat trips are arranged locally rather than booked months ahead, so you can choose over breakfast on the day.</p>
<p>Room type, flight timings and whether you want dinner somewhere particular on the last night are settled with your planner before you travel.</p>
<p>Everything else in this honeymoon package in egypt has been left deliberately loose across the second half of the week.</p>
<p>The three itineraries listed under <a href="CATLINK">Egypt Honeymoon Packages</a> were built not to overlap, so comparing them takes a couple of minutes rather than an evening.</p>$D$, $D$CATLINK$D$, (SELECT $D$/$D$ || CASE c.category_type WHEN $D$day-tours$D$ THEN $D$egypt-day-tours$D$ WHEN $D$nile-cruise$D$ THEN $D$egypt-nile-cruise-tours$D$ ELSE $D$luxury-egypt-tour-packages$D$ END || $D$/$D$ || c.slug FROM categories c WHERE c.name = $D$Luxury Honeymoon Egypt$D$)),
  faqs          = $D$[
  {
    "id": "hm07-0001-4000-8000-000000000001",
    "question": "Is this honeymoon package in egypt long enough to see the country?",
    "answer": "Seven days is enough for the Giza plateau, Karnak and a proper stretch of the Red Sea, and it is not enough for Aswan, Abu Simbel or Alexandria. It is designed as a short trip that does a few things well rather than a survey. Couples wanting more ground usually take the nine or ten day itinerary in the same category."
  },
  {
    "id": "hm07-0002-4000-8000-000000000002",
    "question": "How much of the week is actually on the beach?",
    "answer": "Three full days and four nights, from the afternoon of day four to the morning of day seven. Nothing is scheduled across those days beyond the transfers at either end. That is roughly half the trip, which is the highest proportion of the three honeymoon itineraries."
  },
  {
    "id": "hm07-0003-4000-8000-000000000003",
    "question": "Is the drive from Luxor to the Red Sea difficult?",
    "answer": "It is long rather than difficult. The road crosses open desert and takes most of a morning in an air conditioned private vehicle, with stops when you want them. It is a genuine transfer day and the itinerary treats it as one rather than pretending it is scenic."
  },
  {
    "id": "hm07-0004-4000-8000-000000000004",
    "question": "Can we snorkel without any experience?",
    "answer": "Yes. The reef at Sahl Hasheesh begins close to the shore in shallow water, which makes it one of the easier places in Egypt to snorkel for the first time. Equipment and guidance are arranged locally on the day rather than booked in advance."
  },
  {
    "id": "hm07-0005-4000-8000-000000000005",
    "question": "Is the room a double, and can we ask for something specific?",
    "answer": "Rooms are booked as a double for two people sharing throughout. Bed configuration, a sea view or a particular room category are all requests your planner makes with the hotel before you arrive. Nothing about the itinerary assumes separate rooms at any point."
  },
  {
    "id": "hm07-0006-4000-8000-000000000006",
    "question": "When should we book for a specific date?",
    "answer": "Egyptian high season runs from October to April and the Red Sea hotels fill for the same weeks every year. If your dates are fixed by a wedding, the hotels are the constraint rather than the guiding or the flights. Booking several months out gives you a real choice of property rather than whatever is left."
  }
]$D$::jsonb,
  canonical_url = $D$https://iluxuryegypt.com/all-inclusive-romantic-vacations-egypt-honeymoon$D$,
  robots        = $D$index, follow$D$,
  schema_type   = $D$TouristTrip$D$,
  og_image      = CASE WHEN og_image IS NULL OR og_image = $D$$D$
                       THEN NULLIF(hero_image, $D$$D$) ELSE og_image END
WHERE slug = $D$all-inclusive-romantic-vacations-egypt-honeymoon$D$;

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
WHERE tr.slug = $D$all-inclusive-romantic-vacations-egypt-honeymoon$D$;

UPDATE tours SET
  description   = replace($D$<p>A luxury honeymoon in egypt does not have to mean a longer list of sites.</p>
<p>This nine day itinerary is the river one, and it is built around the stretch of the Nile between Aswan and Luxor that is genuinely easier to see from the water than the road.</p>
<p>Giza and the Grand Egyptian Museum come first, then a flight south to Aswan, and from there you are aboard for two nights with Edfu and Kom Ombo reached from the mooring rather than after a drive.</p>
<p>There is no Red Sea day in it and no Abu Simbel, which is deliberate.</p>

<h2>What This Luxury Honeymoon in Egypt Includes That the Others Do Not</h2>
<p>The boat is the whole difference.</p>
<p>Two of the nine nights are spent moving, so the temples on that stretch arrive without a transfer attached to them, and the hours between them are spent on a sun deck rather than in a vehicle.</p>
<p>It also gives a full day to the Grand Egyptian Museum instead of an afternoon, which the seven day <a href="/all-inclusive-romantic-vacations-egypt-honeymoon">Honeymoon Package in Egypt</a> does not have room for.</p>
<p>If you would rather have Abu Simbel and Alexandria than two nights afloat, the ten day <a href="/egypt-honeymoon-couples">Egypt Honeymoon Tours</a> itinerary is the one to compare against this.</p>

<h2>The Pace</h2>
<p>Three early starts in nine days, and the rest of it slow.</p>
<p>The plateau is done at first light, the museum at whatever speed you want, and the two sailing days have almost nothing fixed in them.</p>
<p>The west bank on day seven is the one genuinely long day, because the Valley of the Kings and Deir el-Bahari in one morning is a lot of walking in the heat.</p>
<p>Luxor Temple is saved for after dark on the last full evening, when it is lit and the avenue of sphinxes is picked out.</p>

<h2>Who It Suits and What Is Decided Later</h2>
<p>It suits couples who want the country to arrive at them rather than the other way round.</p>
<p>It suits anyone who dislikes packing and unpacking, since nine days are spread across four places rather than seven.</p>
<p>A felucca at Aswan before you board is a decision for the morning rather than a booking, and so is how many tombs you take on in the Valley of the Kings.</p>
<p>Cabin category, flight timings and the question of whether you want the same guide throughout are settled with your planner in advance.</p>
<p>A luxury honeymoon in egypt is easier to get right when the itinerary has fewer moving parts, and this one has the fewest of the three.</p>
<p>The full set sits under <a href="CATLINK">Egypt Honeymoon Packages</a>.</p>$D$, $D$CATLINK$D$, (SELECT $D$/$D$ || CASE c.category_type WHEN $D$day-tours$D$ THEN $D$egypt-day-tours$D$ WHEN $D$nile-cruise$D$ THEN $D$egypt-nile-cruise-tours$D$ ELSE $D$luxury-egypt-tour-packages$D$ END || $D$/$D$ || c.slug FROM categories c WHERE c.name = $D$Luxury Honeymoon Egypt$D$)),
  faqs          = $D$[
  {
    "id": "hm09-0001-4000-8000-000000000001",
    "question": "What makes this a luxury honeymoon in egypt rather than a standard Nile trip?",
    "answer": "The difference is the shape rather than a list of extras. Nine days are spread across four places instead of seven, two of the nights are spent moving between temples rather than driving to them, and the Grand Egyptian Museum gets a full day. Everything is private, which on a honeymoon mostly means nobody else sets the pace."
  },
  {
    "id": "hm09-0002-4000-8000-000000000002",
    "question": "How many nights are actually on the boat?",
    "answer": "Two. You board at Aswan late on day five and come off at Luxor on the morning of day seven. Edfu and Kom Ombo are both reached from the mooring on the day in between."
  },
  {
    "id": "hm09-0003-4000-8000-000000000003",
    "question": "Why is Abu Simbel not included?",
    "answer": "Because it requires leaving Aswan before dawn and it would displace one of the sailing days. The ten day itinerary in this category includes it properly, with the early start and a quiet evening afterwards. Adding it here would make the nine days busier than the trip is meant to be."
  },
  {
    "id": "hm09-0004-4000-8000-000000000004",
    "question": "Is there much walking?",
    "answer": "The west bank day is the demanding one, with the Valley of the Kings and Deir el-Bahari in a single morning on uneven ground in heat. Karnak and the plateau involve a couple of hours on foot each. The two sailing days involve almost none, which is part of why they sit where they do."
  },
  {
    "id": "hm09-0005-4000-8000-000000000005",
    "question": "Can we do this in summer?",
    "answer": "Yes, and the boat makes it more bearable than a land based itinerary in the same months. Upper Egypt in July and August is hot enough that site visits move to early morning and late afternoon. Most couples with flexible dates choose October to April instead."
  },
  {
    "id": "hm09-0006-4000-8000-000000000006",
    "question": "Do we see the same guide the whole way?",
    "answer": "That is a question to settle with your planner before you travel, because it depends on the route rather than the price. Some couples prefer one Egyptologist throughout for continuity, others prefer a specialist in each region. Both are arranged in advance rather than on arrival."
  }
]$D$::jsonb,
  canonical_url = $D$https://iluxuryegypt.com/luxury-egypt-honeymoon$D$,
  robots        = $D$index, follow$D$,
  schema_type   = $D$TouristTrip$D$,
  og_image      = CASE WHEN og_image IS NULL OR og_image = $D$$D$
                       THEN NULLIF(hero_image, $D$$D$) ELSE og_image END
WHERE slug = $D$luxury-egypt-honeymoon$D$;

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
WHERE tr.slug = $D$luxury-egypt-honeymoon$D$;

UPDATE tours SET
  description   = replace($D$<p>Most egypt honeymoon tours stop at Luxor and then turn round.</p>
<p>This ten day itinerary is the one that keeps going, south to Abu Simbel and then north to the Mediterranean at Alexandria, and it covers more ground than anything else in the category.</p>
<p>Giza and Saqqara open it, Aswan and Philae follow, Abu Simbel takes a full day with an early start, and the Luxor west bank comes after that.</p>
<p>The back half is the part that makes it unusual, because Alexandria has almost nothing in common with the rest of the country.</p>

<h2>Why These Egypt Honeymoon Tours End on the Mediterranean</h2>
<p>Alexandria replaced a second Red Sea stop on this itinerary, and the change was deliberate.</p>
<p>Two of the three honeymoon itineraries used to finish on the same beach, which made them harder to tell apart than they should have been.</p>
<p>The catacombs at Kom el Shoqafa and the Roman theatre at Kom el Dikka give the last two days a completely different texture from Upper Egypt.</p>
<p>If the beach is what you actually want, the seven day <a href="/all-inclusive-romantic-vacations-egypt-honeymoon">Honeymoon Package in Egypt</a> is the one built for it, and the nine day <a href="/luxury-egypt-honeymoon">Luxury Honeymoon in Egypt</a> is the slower river alternative.</p>

<h2>The Pace, Which Is the Real Question</h2>
<p>This is the busiest of the three and it does not pretend otherwise.</p>
<p>Abu Simbel means leaving Aswan in the dark, and the evening after it is deliberately left empty for that reason.</p>
<p>Day eight moves you from Luxor to Alexandria across two legs and takes most of the day.</p>
<p>There is one genuinely free afternoon in Luxor and another in Alexandria, and everything else has something in it.</p>
<p>Couples who want to be horizontal for half their honeymoon should look at one of the other two.</p>

<h2>Who It Suits and What Is Decided Later</h2>
<p>It suits a first visit where seeing the country matters more than resting, and it suits two people who travel well together on early starts.</p>
<p>Whether Nefertari's tomb is open on your west bank day is worth asking about there rather than planning around.</p>
<p>How you travel between Luxor and Alexandria, and whether the last night is on the seafront or nearer the airport, are settled with your planner in advance.</p>
<p>The other egypt honeymoon tours in this category sit under <a href="CATLINK">Egypt Honeymoon Packages</a>, and none of the three overlap.</p>$D$, $D$CATLINK$D$, (SELECT $D$/$D$ || CASE c.category_type WHEN $D$day-tours$D$ THEN $D$egypt-day-tours$D$ WHEN $D$nile-cruise$D$ THEN $D$egypt-nile-cruise-tours$D$ ELSE $D$luxury-egypt-tour-packages$D$ END || $D$/$D$ || c.slug FROM categories c WHERE c.name = $D$Luxury Honeymoon Egypt$D$)),
  faqs          = $D$[
  {
    "id": "hm10-0001-4000-8000-000000000001",
    "question": "How do these egypt honeymoon tours differ from the shorter itineraries?",
    "answer": "Ten days buys Abu Simbel and Alexandria, neither of which fits into seven or nine. The trade is pace, because this is the busiest of the three and has the fewest unstructured days. Couples who want half their honeymoon unscheduled are usually better served by the seven day itinerary."
  },
  {
    "id": "hm10-0002-4000-8000-000000000002",
    "question": "Is Abu Simbel worth the early start?",
    "answer": "For most people yes, though it is a genuine pre dawn departure and a long day. The four seated figures and the smaller temple built for Nefertari are unlike anything else in Egypt. The itinerary leaves the following evening empty precisely because the day is demanding."
  },
  {
    "id": "hm10-0003-4000-8000-000000000003",
    "question": "What is Alexandria actually like compared to Cairo?",
    "answer": "It reads as a Mediterranean city rather than an Egyptian one, with a long corniche, faded European architecture and a completely different climate. The Roman material there has no equivalent in Upper Egypt. Two days is enough to feel the contrast without running out of things to do."
  },
  {
    "id": "hm10-0004-4000-8000-000000000004",
    "question": "Is ten days too much for a first trip to Egypt?",
    "answer": "Ten days is close to ideal for a first visit if you want breadth. It covers the pyramids, the far south, the Luxor west bank and the Mediterranean coast without repeating a city. The one thing it does not give you is a stretch of doing nothing."
  },
  {
    "id": "hm10-0005-4000-8000-000000000005",
    "question": "How much walking should we expect?",
    "answer": "More than the other two itineraries. Saqqara, the west bank and the Alexandria sites all involve a few hours on foot, often on uneven ground. Nothing requires climbing, and the pace within each day is yours since the guide is private."
  },
  {
    "id": "hm10-0006-4000-8000-000000000006",
    "question": "What actually constrains a late booking on this itinerary?",
    "answer": "The Abu Simbel flights and the Aswan hotels, in that order. Both have limited capacity on any given date and both sit in the middle of the route, so neither can be moved a day either way. Your planner will tell you which of the two is binding for your dates."
  }
]$D$::jsonb,
  canonical_url = $D$https://iluxuryegypt.com/egypt-honeymoon-couples$D$,
  robots        = $D$index, follow$D$,
  schema_type   = $D$TouristTrip$D$,
  og_image      = CASE WHEN og_image IS NULL OR og_image = $D$$D$
                       THEN NULLIF(hero_image, $D$$D$) ELSE og_image END
WHERE slug = $D$egypt-honeymoon-couples$D$;

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
WHERE tr.slug = $D$egypt-honeymoon-couples$D$;

DO $GUARD$
DECLARE bad text;
BEGIN
  SELECT string_agg(slug, $D$, $D$) INTO bad FROM tours
  WHERE slug IN ($D$all-inclusive-romantic-vacations-egypt-honeymoon$D$, $D$luxury-egypt-honeymoon$D$, $D$egypt-honeymoon-couples$D$)
    AND (position(lower(focus_keyword) in lower(description)) = 0
      OR jsonb_array_length(faqs) <> 6
      OR schema_markup IS NULL);
  IF bad IS NOT NULL THEN RAISE EXCEPTION $D$body, faqs or schema missing on: %$D$, bad; END IF;

  SELECT string_agg(slug, $D$, $D$) INTO bad FROM tours
  WHERE slug IN ($D$all-inclusive-romantic-vacations-egypt-honeymoon$D$, $D$luxury-egypt-honeymoon$D$, $D$egypt-honeymoon-couples$D$)
    AND (schema_markup ILIKE $D$%priceRange%$D$
      OR schema_markup ILIKE $D$%"offers"%$D$
      OR schema_markup ILIKE $D$%"price"%$D$);
  IF bad IS NOT NULL THEN RAISE EXCEPTION $D$a price property reached the schema on: %$D$, bad; END IF;

  SELECT string_agg(slug, $D$, $D$) INTO bad FROM tours
  WHERE slug IN ($D$all-inclusive-romantic-vacations-egypt-honeymoon$D$, $D$luxury-egypt-honeymoon$D$, $D$egypt-honeymoon-couples$D$)
    AND description NOT LIKE $D$%/luxury-egypt-tour-packages/%$D$
    AND description NOT LIKE $D$%/egypt-day-tours/%$D$
    AND description NOT LIKE $D$%/egypt-nile-cruise-tours/%$D$;
  IF bad IS NOT NULL THEN RAISE EXCEPTION $D$category link missing on: %$D$, bad; END IF;
END
$GUARD$;

COMMIT;

\echo
\echo seo-honeymoon-tours

SELECT
  slug,
  focus_keyword,
  (length(lower(description)) - length(replace(lower(description), lower(focus_keyword), $D$$D$)))
    / length(focus_keyword)                              AS phrase_uses_in_body,
  array_length(regexp_split_to_array(description, $D$<h2>$D$), 1) - 1 AS h2_count,
  jsonb_array_length(faqs)                               AS faqs,
  schema_markup IS NOT NULL                              AS has_schema,
  canonical_url
FROM tours WHERE slug IN ($D$all-inclusive-romantic-vacations-egypt-honeymoon$D$, $D$luxury-egypt-honeymoon$D$, $D$egypt-honeymoon-couples$D$)
ORDER BY 1;
