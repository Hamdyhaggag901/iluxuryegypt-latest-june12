-- On page SEO for the two categories: body, FAQs, canonical, robots, schema
-- type and og image.
--
--   psql "$DATABASE_URL" -f content-updates/seo-categories.sql
--
-- RUN content-updates/category-keywords.sql FIRST. This file assumes
-- focus_keyword, meta_description and seo_title are already set.
--
-- CATEGORIES HAVE NO schema_markup COLUMN
-- The brief asks for a CollectionPage plus an FAQPage written into
-- schema_markup. That column does not exist on categories: shared/schema.ts
-- gives them seo_title, meta_description, focus_keyword, canonical_url,
-- robots, schema_type, og_image and faqs, and server/seo-meta.ts says so in as
-- many words ("categories have no custom-JSON-LD override field"). Adding the
-- column would be a migration, which is out of scope here.
--
-- What this file does instead, which gets to the same place without one:
--   schema_type is set to CollectionPage, which is what drives the generated
--   JSON-LD node in server/seo-meta.ts, and
--   faqs is populated, from which client/src/components/faq-section.tsx builds
--   the FAQPage node at render time in buildFaqJsonLd.
-- The FAQPage is therefore generated from the faqs column rather than stored
-- beside it, which satisfies the "cannot drift" requirement more strongly than
-- a stored copy would. The CollectionPage node it produces does not list the
-- three tours; storing a graph that does needs the column.
--
-- The body links to all three tours by name and says how they differ, so a
-- visitor can pick without opening all three.
--
-- Canonicals follow server/routes.ts: the base path comes from category_type,
-- defaulting to luxury-egypt-tour-packages, then the slug. No slug is changed.
--
-- Safe to run twice. Dollar quoting on every text value.

\set ON_ERROR_STOP on

BEGIN;

DO $GUARD$
DECLARE missing text;
BEGIN
  SELECT string_agg(n, $D$, $D$) INTO missing FROM (
    SELECT n FROM unnest(ARRAY[$D$Luxury Honeymoon Egypt$D$, $D$Spiritual Journeys Egypt$D$]) AS n
    WHERE NOT EXISTS (SELECT 1 FROM categories WHERE categories.name = n)) x;
  IF missing IS NOT NULL THEN RAISE EXCEPTION $D$categories not found by name: %$D$, missing; END IF;
END
$GUARD$;

UPDATE categories SET
  description   = $D$<p>The three egypt honeymoon packages here were built so that they do not overlap, which makes choosing between them quicker than it usually is.</p>
<p>Each one commits to a different second half, and that is the decision that matters rather than the day count.</p>

<h2>How These Egypt Honeymoon Packages Differ</h2>
<p>The seven day <a href="/all-inclusive-romantic-vacations-egypt-honeymoon">Honeymoon Package in Egypt</a> sees the Giza plateau and Karnak in the first three days and then spends four nights on the Red Sea at Sahl Hasheesh with nothing scheduled.</p>
<p>It is the shortest, the least demanding, and the right answer for a couple coming straight out of a wedding.</p>
<p>The nine day <a href="/luxury-egypt-honeymoon">Luxury Honeymoon in Egypt</a> replaces the beach with the Nile, boarding at Aswan and reaching Edfu and Kom Ombo from the mooring rather than after a drive.</p>
<p>It has no Red Sea day and no Abu Simbel, and it spreads nine days across four places rather than seven, so there is less packing and more sitting still.</p>
<p>The ten day <a href="/egypt-honeymoon-couples">Egypt Honeymoon Tours</a> itinerary is the widest of the three, adding Abu Simbel in the far south and Alexandria on the Mediterranean.</p>
<p>It is also the busiest, with one pre dawn start and only two genuinely free afternoons.</p>

<h2>Choosing Between Them</h2>
<p>If you want to rest, take the seven day.</p>
<p>If you want to move slowly without resting, take the nine day.</p>
<p>If you want to see as much of the country as a fortnight allows, take the ten day and accept the early starts.</p>
<p>Alexandria replaced a second Red Sea stop on the ten day route, because two of the three itineraries previously ended on the same beach and that made them harder to tell apart than they deserved.</p>

<h2>What Applies to All Three</h2>
<p>All three egypt honeymoon packages are private, which on a honeymoon mostly means nobody else decides when you leave a site.</p>
<p>Day one is an arrival day in every case, with an airport meet and a transfer to Giza and nothing else in it.</p>
<p>Rooms are booked as a double for two people sharing throughout, and bed configuration and views are requests your planner makes before you arrive.</p>
<p>Flight timings, room categories and anything you want arranged for a particular evening are settled in advance rather than on the ground.</p>$D$,
  faqs          = $D$[
  {
    "id": "cath-0001-4000-8000-000000000001",
    "question": "Which of these egypt honeymoon packages is best for a first visit?",
    "answer": "The ten day itinerary covers the most ground and is the usual choice for a first trip, taking in Giza, Aswan, Abu Simbel, Luxor and Alexandria. If you would rather rest than cover ground, the seven day is the better first visit despite seeing less. The nine day sits between the two and suits couples who dislike repacking."
  },
  {
    "id": "cath-0002-4000-8000-000000000002",
    "question": "Can we combine two of these itineraries?",
    "answer": "They are built not to overlap, so combining the nine and ten day routes would repeat Aswan and Luxor rather than adding to them. Extending a single itinerary with extra nights at either end is the more common approach. Your planner will say which combination actually adds something."
  },
  {
    "id": "cath-0003-4000-8000-000000000003",
    "question": "Is a private honeymoon itinerary very different from a group departure?",
    "answer": "On a honeymoon the practical difference is control of the clock. You decide when to leave a site, when to eat and whether to add an hour somewhere, and nothing waits on a group consensus. It also means the guide is answering your questions rather than everyone's."
  },
  {
    "id": "cath-0004-4000-8000-000000000004",
    "question": "What time of year suits a honeymoon in Egypt?",
    "answer": "October to April gives the most comfortable temperatures for Upper Egypt, which is where most of these itineraries spend their time. May to September is hot enough that site visits move to early morning and late afternoon. The Red Sea itinerary copes with summer better than the other two."
  },
  {
    "id": "cath-0005-4000-8000-000000000005",
    "question": "How far ahead should we book?",
    "answer": "Six months is comfortable for high season dates, and longer if a wedding fixes your week exactly. Hotels are usually the binding constraint rather than guiding or internal flights. If your dates cannot move, booking early is the difference between a choice of property and whatever remains."
  }
]$D$::jsonb,
  canonical_url = $D$https://iluxuryegypt.com$D$ || $D$/$D$ || CASE category_type
                    WHEN $D$day-tours$D$   THEN $D$egypt-day-tours$D$
                    WHEN $D$nile-cruise$D$ THEN $D$egypt-nile-cruise-tours$D$
                    ELSE $D$luxury-egypt-tour-packages$D$ END || $D$/$D$ || slug,
  robots        = $D$index, follow$D$,
  schema_type   = $D$CollectionPage$D$,
  og_image      = CASE WHEN og_image IS NULL OR og_image = $D$$D$
                       THEN NULLIF(image, $D$$D$) ELSE og_image END
WHERE name = $D$Luxury Honeymoon Egypt$D$;

UPDATE categories SET
  description   = $D$<p>The three egypt spiritual tours listed here take three genuinely different shapes, and only two of them involve temples at all.</p>
<p>What they share is that each is private and each gives real time to a smaller number of places rather than a photograph of a larger number.</p>

<h2>The Three Egypt Spiritual Tours, and How They Differ</h2>
<p>The ten day <a href="/10-day-spiritual-egypt">Spiritual Egypt</a> itinerary is the temple route, and it is the only one that goes north from Luxor to Dendera and Abydos before it goes south.</p>
<p>Both of those are day trips that most itineraries skip because of the drive, and this one gives each a full day.</p>
<p>The fourteen day <a href="/private-spiritual-tours-egypt-14-days-sacred-journey">Egypt Spiritual Retreat</a> is the long version: the Serapeum at Saqqara, the oracle at Siwa, the Osireion at Abydos, Philae and Abu Simbel.</p>
<p>It reaches sites the ten day cannot, and it costs two full days of road to and from Siwa, which is the only way in.</p>
<p>The eight day <a href="/white-desert-luxury-camping">White Desert Egypt</a> trip has no temple in it at all, and spends four nights camping in the open desert between Bahariya and Farafra.</p>
<p>It is here because people come to it for the same reason, not because anything is being claimed on its behalf.</p>

<h2>Choosing Between Them</h2>
<p>If you want the temples and have ten days, take the ten day.</p>
<p>If you want Siwa and Abu Simbel as well and can accept twenty hours of road, take the fourteen day.</p>
<p>If carved walls are not what draws you, take the desert one and do not feel it is the lesser trip.</p>

<h2>What Applies to All Three</h2>
<p>Day one is an arrival day in each case, with an airport meet and a transfer to Giza and no sightseeing in it.</p>
<p>Long road transfers are written into the itineraries as full days rather than absorbed into a sightseeing day, because that is how they actually work.</p>
<p>These egypt spiritual tours make no claim about what any of these places will do for a visitor; the sites are described as they are and the rest is yours.</p>$D$,
  faqs          = $D$[
  {
    "id": "cats-0001-4000-8000-000000000001",
    "question": "What do these egypt spiritual tours have in common?",
    "answer": "Each is private, each gives extended time at a small number of places, and each writes long transfers in as real days rather than hiding them. Beyond that they are deliberately different from one another. Two are built around temples and one has no temple in it at all."
  },
  {
    "id": "cats-0002-4000-8000-000000000002",
    "question": "Why is a desert camping trip in a spiritual category?",
    "answer": "Because people choose it for the same reason they choose the temple routes, and it would be dishonest to pretend otherwise or to dress it up with claims about the landscape. It is listed here as what it is: eight days in the Western Desert with four nights under the sky."
  },
  {
    "id": "cats-0003-4000-8000-000000000003",
    "question": "Which itinerary reaches the most sites?",
    "answer": "The fourteen day route, which takes in the Serapeum, Siwa, Dendera, Abydos and the Osireion, Karnak, Medinet Habu, Philae and Abu Simbel. The ten day covers the core temples without Siwa or Abu Simbel. The eight day desert trip reaches none of them."
  },
  {
    "id": "cats-0004-4000-8000-000000000004",
    "question": "Do we need to be fit for these?",
    "answer": "Reasonable mobility helps on all three, since temple floors are uneven and the west bank involves a few hours on foot in heat. Nothing requires climbing. The desert itinerary asks less of you physically and more of you in terms of comfort, since there is no room for four nights."
  },
  {
    "id": "cats-0005-4000-8000-000000000005",
    "question": "Can the itineraries be adjusted?",
    "answer": "Dates, hotel choices and extra nights at either end are straightforward to change. The fixed parts are the ones dictated by distance, particularly the two road days to and from Siwa on the fourteen day route. Your planner will be explicit about which elements cannot move."
  }
]$D$::jsonb,
  canonical_url = $D$https://iluxuryegypt.com$D$ || $D$/$D$ || CASE category_type
                    WHEN $D$day-tours$D$   THEN $D$egypt-day-tours$D$
                    WHEN $D$nile-cruise$D$ THEN $D$egypt-nile-cruise-tours$D$
                    ELSE $D$luxury-egypt-tour-packages$D$ END || $D$/$D$ || slug,
  robots        = $D$index, follow$D$,
  schema_type   = $D$CollectionPage$D$,
  og_image      = CASE WHEN og_image IS NULL OR og_image = $D$$D$
                       THEN NULLIF(image, $D$$D$) ELSE og_image END
WHERE name = $D$Spiritual Journeys Egypt$D$;

DO $GUARD$
DECLARE bad text;
BEGIN
  SELECT string_agg(name, $D$, $D$) INTO bad FROM categories
  WHERE name IN ($D$Luxury Honeymoon Egypt$D$, $D$Spiritual Journeys Egypt$D$)
    AND (position(lower(focus_keyword) in lower(description)) = 0
      OR jsonb_array_length(faqs) <> 5
      OR canonical_url IS NULL);
  IF bad IS NOT NULL THEN RAISE EXCEPTION $D$body, faqs or canonical missing on: %$D$, bad; END IF;
END
$GUARD$;

COMMIT;

\echo
\echo seo-categories

SELECT
  name,
  focus_keyword,
  (length(lower(description)) - length(replace(lower(description), lower(focus_keyword), $D$$D$)))
    / length(focus_keyword)                              AS phrase_uses_in_body,
  jsonb_array_length(faqs)                               AS faqs,
  schema_type,
  canonical_url
FROM categories WHERE name IN ($D$Luxury Honeymoon Egypt$D$, $D$Spiritual Journeys Egypt$D$)
ORDER BY 1;
