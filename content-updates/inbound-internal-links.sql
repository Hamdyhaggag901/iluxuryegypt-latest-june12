-- Inbound internal links to the sixteen rewritten articles.
--
-- The outbound links live in each article's own body and are generated. These
-- are the other direction: one contextual link TO each rewritten article from
-- two or three pages that are already live. Inbound links are what actually
-- move a page, and an article that links out four times and is linked to zero
-- times is a page the site itself does not vouch for.
--
-- 73 links, across 19 source pages, to 27 targets. The last 18 point at the
-- six hotels cluster articles. Every target has at
-- least two sources and most have three, so one source page being missing
-- or already at its link cap does not leave a target with one inbound link.
--
-- RUN THIS LAST.
--
-- Run it after the three wave files and after scripts/fill-post-images.ts.
-- The wave files assign body_en from the generator, which knows nothing about
-- these links, so running a wave file afterwards would discard the ones that
-- land on posts. Nothing here touches posts today, but that ordering is the
-- safe habit rather than a coincidence to rely on.
--
-- SOURCES ARE DESTINATION GUIDES AND TOUR PAGES ONLY.
--
-- Deliberately not the blog posts. Those bodies are generated from
-- content-updates/blog-generator, and a link added here would be silently
-- discarded the next time a wave file ran. An inbound link from one article to
-- another belongs in that article's .mjs source, where the generator's four
-- link cap can see it.
--
-- ---------------------------------------------------------------------------
-- The plain text problem, and why this file converts before it appends
-- ---------------------------------------------------------------------------
-- client/src/lib/legacy-text-to-html.ts treats a description as HTML the
-- moment it contains a single tag, and otherwise splits it on blank lines into
-- paragraphs. Appending a <p> to a description that is currently plain text
-- would therefore flip that switch and collapse the whole thing into one run
-- on block.
--
-- So a plain text description is converted here first, using exactly the same
-- algorithm: escape & < >, split on two or more newlines, wrap each part in
-- <p>, turn single newlines into <br>. The rendered output is byte for byte
-- what the client was already producing on the fly, so the conversion changes
-- nothing a reader sees. It does change what a crawler sees, for the better:
-- server/seo-content.ts passes the description through trusted() without that
-- conversion, so a plain text description currently reaches crawlers as one
-- unbroken paragraph while a browser sees several.
--
-- ---------------------------------------------------------------------------
-- The four link cap
-- ---------------------------------------------------------------------------
-- A source page that already carries four or more internal links is skipped
-- and named in the report at the bottom, rather than being pushed to five. The
-- count is taken fresh on each iteration, so a page receiving two links from
-- this file is checked again before the second one.
--
-- Idempotent. A link already present is skipped, so a second run changes
-- nothing and reports the same table.

BEGIN;

CREATE TEMP TABLE inbound_links (
  source_table text,
  source_slug  text,
  target_slug  text,
  anchor       text,
  sentence     text   -- carries {{A}} where the anchor tag goes
);
-- These are session scoped on purpose rather than dropped at commit: the
-- report at the bottom of this file runs after COMMIT and has to read them.
-- They are dropped explicitly at the end instead.

INSERT INTO inbound_links (source_table, source_slug, target_slug, anchor, sentence) VALUES
  ('destinations', 'cairo-travel-guide', 'best-time-to-visit-egypt', 'which months actually suit a first visit', 'Cairo is comfortable for most of the year and the rest of the country is not, so it is worth reading {{A}} before fixing your dates.'),
  ('destinations', 'cairo-travel-guide', 'egypt-visa-for-us-citizens', 'the two visa routes for US travellers', 'Everyone arriving here needs a visa, and {{A}} covers which of them suits an arrival at Cairo airport.'),
  ('destinations', 'cairo-travel-guide', 'private-tours-in-cairo-egypt', 'how three days in the city fit together', 'Two days is the usual allocation and it is not enough; {{A}} sets out what each day should hold.'),
  ('destinations', 'attractions-in-luxor', 'best-time-to-visit-egypt', 'when the west bank is bearable', 'Luxor in high summer is a different proposition from Luxor in February, and {{A}} is the honest version of that.'),
  ('destinations', 'attractions-in-luxor', 'best-luxury-nile-cruise-egypt', 'how to compare boats properly', 'Most visitors arrive or leave by river, and {{A}} covers what separates one boat from another.'),
  ('destinations', 'attractions-in-luxor', 'currency-in-egypt', 'cash, cards and small notes', 'Entrance charges, taxis and tipping here are all cash, so {{A}} is worth reading before you arrive.'),
  ('destinations', 'aswan-egypt-attractions', 'egypt-honeymoon', 'how couples usually shape the week', 'Aswan is where most honeymoons here begin, and {{A}} covers the rest of the trip around it.'),
  ('destinations', 'aswan-egypt-attractions', 'best-luxury-nile-cruise-egypt', 'which boat suits which traveller', 'Almost every sailing to Luxor starts from here, and {{A}} is the decision worth spending the most time on.'),
  ('destinations', 'alexandria-egypt-attractions', 'planning-a-trip-to-egypt', 'how a trip here is usually sequenced', 'Alexandria is normally a day out rather than a base, and {{A}} shows where it fits against Cairo and the river.'),
  ('destinations', 'alexandria-egypt-attractions', 'egypt-travel-tips', 'tipping, water and what to wear', 'The practical rules are the same here as everywhere else in the country, and {{A}} covers them.'),
  ('destinations', 'things-to-do-in-hurghada', 'egypt-travel-insurance', 'what a policy needs to cover for diving', 'Diving and watersports are excluded by a surprising number of standard policies, so {{A}} is worth checking before you book anything.'),
  ('destinations', 'things-to-do-in-hurghada', 'egypt-plug-type', 'what will and will not survive the socket', 'Resorts here run on the same 220 volt supply as the rest of the country, and {{A}} explains which of your chargers care.'),
  ('destinations', 'siwa-oasis-egypt', 'is-egypt-safe-for-americans', 'which regions are genuinely off limits', 'Parts of the Western Desert sit under a Do Not Travel advisory and parts do not, and {{A}} sets out where the line falls.'),
  ('destinations', 'siwa-oasis-egypt', 'vaccinations-needed-for-egypt', 'the health questions worth asking early', 'A trip this far from Cairo is one to mention at a travel clinic, and {{A}} covers what that appointment is for.'),
  ('tours', '7-day-egypt-tour', 'best-time-to-visit-egypt', 'the month by month guide', 'A week here works in almost any season with the right pacing, and {{A}} covers what each month actually feels like.'),
  ('tours', '7-day-egypt-tour', 'private-pyramid-tours-egypt', 'the hour that changes the plateau', 'Giza is the first morning of this itinerary, and {{A}} explains why the arrival time matters more than anything else about it.'),
  ('tours', '7-day-egypt-tour', 'egypt-plug-type', 'sockets, voltage and which adapter', 'One small piece of preparation saves an appliance: {{A}}.'),
  ('tours', '10-day-egypt-tour', 'luxury-egypt-tours', 'how these journeys are put together', 'If you are weighing this against a longer or shorter route, {{A}} covers what the days actually contain.'),
  ('tours', '10-day-egypt-tour', 'planning-a-trip-to-egypt', 'the order the decisions have to be made in', 'Ten days is the length most travellers settle on, and {{A}} explains how that number is arrived at.'),
  ('tours', '12-days-egypt-tour', 'egypt-visa-for-us-citizens', 'what to arrange before you fly', 'The visa is an evening''s work and the passport check is not, so {{A}} is the page to read first.'),
  ('tours', '12-days-egypt-tour', 'tailor-made-egypt-tours', 'the five things that move the price', 'This route can be rebuilt around your own dates and interests, and {{A}} covers what that changes.'),
  ('tours', 'family-tours-egypt', 'what-to-pack-for-egypt', 'the month by month packing list', 'Packing for children here is mostly about shoes, shade and layers, and {{A}} covers all three by season.'),
  ('tours', 'family-tours-egypt', 'currency-in-egypt', 'what to carry and why small notes matter', 'Families get through more small cash than anyone expects, and {{A}} explains where to get it.'),
  ('tours', 'egypt-family-vacation-packages', 'vaccinations-needed-for-egypt', 'what a travel clinic will raise', 'Children are on a different schedule from adults, so book the appointment early and read {{A}} before it.'),
  ('tours', 'egypt-tours-family', 'egypt-travel-tips', 'the practical things that come up daily', 'Tipping, water and the rhythm of the day are what shape a family trip here, and {{A}} covers them.'),
  ('tours', 'egypt-tours-family', 'currency-in-egypt', 'where to change money and where not to', 'Cash matters more here than cards for most of what you will actually buy, and {{A}} explains why.'),
  ('tours', 'egypt-small-group-tour', 'egypt-travel-insurance', 'the cover worth checking before you book', 'Medical evacuation is the clause that matters on any itinerary reaching Upper Egypt, and {{A}} covers what else to look for.'),
  ('tours', 'egypt-private-tours', 'is-egypt-safe-for-americans', 'the current advisory, in plain terms', 'The question comes up on almost every first call, and {{A}} answers it including the two regions nobody should be visiting.'),
  ('tours', 'egypt-private-tours', 'private-tours-in-cairo-egypt', 'what private actually covers in Cairo', 'The word private means up to four different things, and {{A}} sets out which of them to ask about.'),
  ('tours', 'egypt-private-tour-packages', 'private-pyramid-tours-egypt', 'what a private morning at Giza buys', 'The pyramid days are the ones the arrival hour changes most, and {{A}} explains how.'),
  ('tours', 'egypt-private-tour-packages', 'tailor-made-egypt-tours', 'what you actually get to choose', 'Any of these routes can be rebuilt around your own dates, and {{A}} covers what is genuinely variable.'),
  ('tours', 'egypt-nile-cruise-packages', 'best-luxury-nile-cruise-egypt', 'choosing between the three categories', 'Dahabiya, boutique ship or large cruiser is the decision that changes the week most, and {{A}} compares them properly.'),
  ('tours', 'egypt-nile-cruise-packages', 'egypt-honeymoon', 'the version of this trip built for two', 'The river is the part couples remember, and {{A}} covers how a honeymoon here is usually shaped.'),
  ('tours', 'best-luxury-egypt-tours', 'luxury-egypt-tours', 'what a private journey here involves', 'If you are deciding between these routes, {{A}} covers what the days actually contain.'),
  ('tours', 'luxury-small-group-tours-egypt', 'planning-a-trip-to-egypt', 'where to start if the dates are not fixed', 'Departure dates drive everything else on a trip here, and {{A}} explains the order to settle them in.'),
  ('tours', 'luxury-small-group-tours-egypt', 'egypt-travel-insurance', 'which clauses actually matter here', 'Every traveller on this route should be covered for medical evacuation, and {{A}} explains what else to look for.'),
  ('tours', 'egypt-family-vacation-packages', 'egypt-plug-type', 'the adapter question, settled', 'Families arrive with more chargers than anyone, so {{A}} is worth five minutes before you pack.'),
  ('tours', 'best-luxury-egypt-tours', 'is-egypt-safe-for-americans', 'what the advisory actually says', 'If the question has come up at home, {{A}} covers the current position and the regions that are genuinely excluded.'),
  ('tours', 'egypt-small-group-tour', 'vaccinations-needed-for-egypt', 'what to ask a travel clinic', 'Nothing is required at the border, but {{A}} covers the appointment worth booking four to six weeks out.'),
  ('tours', 'white-desert-luxury-camping', 'what-to-pack-for-egypt', 'what the desert nights need', 'Nights out here are colder than anyone expects from the daytime photographs, and {{A}} covers the layer that matters.'),
  ('destinations', 'aswan-egypt-attractions', 'dahabiya-nile-cruise', 'sailing north under canvas', 'Most sailings leave from here, and {{A}} covers what a small boat changes about the week.'),
  ('destinations', 'aswan-egypt-attractions', 'lake-nasser-cruise', 'the quieter water south of the dam', 'South of the High Dam the water is emptier again, and {{A}} covers the rescued Nubian temples along it.'),
  ('destinations', 'attractions-in-luxor', 'nile-cruise-luxor-to-aswan', 'the route between the two cities', 'Most visitors arrive or leave by river, and {{A}} sets out which temple lands on which morning.'),
  ('destinations', 'attractions-in-luxor', '7-night-nile-cruise', 'how many nights the river deserves', 'Whether to give the water four nights or seven is the question worth settling first, and {{A}} answers it.'),
  ('tours', 'egypt-nile-cruise-packages', 'dahabiya-nile-cruise', 'choosing a sailing boat over a ship', 'The vessel changes this week more than the route does, and {{A}} covers the smallest of the three categories.'),
  ('tours', 'egypt-nile-cruise-packages', 'best-time-to-go-to-egypt-nile-cruise', 'picking the month', 'The deck decides the season on a river boat, and {{A}} goes through it month by month.'),
  ('tours', 'egypt-private-tour-packages', 'nile-cruise-luxor-to-aswan', 'the sailing, day by day', 'Every one of these routes has the river in the middle of it, and {{A}} covers what those days hold.'),
  ('tours', 'best-luxury-egypt-tours', '7-night-nile-cruise', 'four nights on the water against seven', 'How long to spend on the river is the decision that moves this itinerary most, and {{A}} works through it.'),
  ('tours', '12-days-egypt-tour', 'lake-nasser-cruise', 'adding the southern lake', 'Twelve days is enough to add the quieter water below Aswan, and {{A}} covers what that leg involves.'),
  ('tours', '10-day-egypt-tour', 'best-time-to-go-to-egypt-nile-cruise', 'when to sail', 'The month matters more on the water than anywhere else on this route, and {{A}} explains why.'),
  ('tours', 'luxury-small-group-tours-egypt', 'dahabiya-nile-cruise', 'what a small hull changes', 'If the size of the boat matters to you, {{A}} is the page to read before choosing a departure.'),
  ('tours', '7-day-egypt-tour', 'nile-cruise-luxor-to-aswan', 'the river half of this week', 'The sailing is the middle of this itinerary, and {{A}} covers the temples it reaches.'),
  ('destinations', 'alexandria-egypt-attractions', 'best-time-to-go-to-egypt-nile-cruise', 'the season on the river', 'If the Nile is also on your itinerary, {{A}} covers a narrower window than the one that applies up here.'),
  ('tours', 'egypt-small-group-tour', '7-night-nile-cruise', 'the length of the sailing', 'Departures run to different river lengths, and {{A}} covers what each one actually adds.'),
  ('tours', 'family-tours-egypt', 'lake-nasser-cruise', 'the southern alternative', 'For families returning to Egypt, {{A}} covers a quieter week than the classic route.'),
  ('destinations', 'cairo-travel-guide', 'where-to-stay-in-cairo', 'picking which side of the city to sleep on', 'The address matters more here than in any other Egyptian city, and {{A}} works through the four areas.'),
  ('destinations', 'cairo-travel-guide', 'luxury-hotels-cairo', 'what separates the grand properties', 'If you are choosing between the big riverside names, {{A}} covers what actually differs between them.'),
  ('destinations', 'attractions-in-luxor', 'best-hotels-in-luxor-egypt', 'east bank or west bank', 'Where you sleep here decides how your mornings run, and {{A}} sets out the trade between the two banks.'),
  ('destinations', 'aswan-egypt-attractions', 'best-hotels-in-aswan', 'what the room should be facing', 'The town is small enough that the view matters more than the address, and {{A}} explains the three positions.'),
  ('destinations', 'things-to-do-in-hurghada', '5-star-hotels-in-egypt', 'what the star rating actually covers', 'A five star on this coast means something different from a five star in Cairo, and {{A}} explains why.'),
  ('tours', 'egypt-private-tour-packages', 'where-to-stay-in-cairo', 'choosing a Cairo base', 'Cairo is the one city on this route where the neighbourhood changes the holiday, and {{A}} covers the choice.'),
  ('tours', 'best-luxury-egypt-tours', 'luxury-hotels-cairo', 'how the Cairo hotels differ', 'The city nights on this journey sit in the properties {{A}} compares.'),
  ('tours', 'egypt-nile-cruise-packages', 'best-hotels-in-aswan', 'the nights either side of the sailing', 'Most sailings start or finish here, and {{A}} covers where to spend the land nights around them.'),
  ('tours', '7-day-egypt-tour', 'cairo-hotel-with-pyramid-view', 'whether a pyramid view is worth it', 'A week here usually includes a Giza morning, and {{A}} covers whether sleeping beside the plateau earns its cost.'),
  ('tours', '10-day-egypt-tour', 'best-hotels-in-luxor-egypt', 'which bank to stay on in Luxor', 'Two nights in Luxor go differently depending on the bank, and {{A}} explains the choice.'),
  ('tours', '12-days-egypt-tour', '5-star-hotels-in-egypt', 'reading a star rating honestly', 'Hotels on this route are all rated five stars and are not all the same, and {{A}} covers what the rating means.'),
  ('tours', 'egypt-small-group-tour', 'where-to-stay-in-cairo', 'where the city nights sit', 'If you are extending either end of this departure, {{A}} covers which part of Cairo to add them in.'),
  ('tours', 'luxury-small-group-tours-egypt', 'luxury-hotels-cairo', 'the Cairo properties compared', 'The hotels used on this route are the ones {{A}} goes through in detail.'),
  ('tours', 'family-tours-egypt', 'best-hotels-in-aswan', 'picking an Aswan room', 'Aswan is the gentlest stop on a family route, and {{A}} covers what to ask about the room and the pool.'),
  ('tours', 'egypt-tours-family', 'cairo-hotel-with-pyramid-view', 'the view, and what it costs', 'Children remember the pyramids from the window, and {{A}} covers which hotels genuinely have that.'),
  ('tours', 'egypt-private-tours', 'best-hotels-in-luxor-egypt', 'the Luxor bank question', 'Luxor nights are where private itineraries diverge most, and {{A}} explains the two options.'),
  ('destinations', 'alexandria-egypt-attractions', '5-star-hotels-in-egypt', 'what five stars guarantees', 'The classification works the same way here as everywhere else in Egypt, and {{A}} covers what it does and does not cover.'),
  ('destinations', 'siwa-oasis-egypt', '5-star-hotels-in-egypt', 'why the rating stops helping out here', 'A desert camp is judged on its site and its crew rather than on facilities, which is part of what {{A}} explains.');

-- Mirrors client/src/lib/legacy-text-to-html.ts. See the note above.
CREATE OR REPLACE FUNCTION pg_temp.to_html(raw text) RETURNS text AS $$
DECLARE
  escaped text;
BEGIN
  IF raw IS NULL OR btrim(raw) = '' THEN RETURN raw; END IF;
  -- Already HTML: returned untouched, exactly as the client does.
  IF raw ~ '</?[a-zA-Z][^>]*>' THEN RETURN raw; END IF;

  escaped := replace(replace(replace(raw, '&', '&amp;'), '<', '&lt;'), '>', '&gt;');

  RETURN (
    SELECT coalesce(string_agg('<p>' || replace(btrim(part), E'\n', '<br>') || '</p>', ''), '')
    FROM regexp_split_to_table(escaped, E'\n{2,}') AS part
    WHERE btrim(part) <> ''
  );
END;
$$ LANGUAGE plpgsql;

-- Internal links already in a body, so the cap is measured rather than assumed.
CREATE OR REPLACE FUNCTION pg_temp.link_count(body text) RETURNS integer AS $$
BEGIN
  IF body IS NULL THEN RETURN 0; END IF;
  RETURN (length(body) - length(replace(body, 'href="/', ''))) / length('href="/');
END;
$$ LANGUAGE plpgsql;

CREATE TEMP TABLE inbound_outcome (
  source_table text, source_slug text, target_slug text, anchor text, outcome text
);

DO $$
DECLARE
  r          record;
  body       text;
  converted  text;
  links      integer;
  paragraph  text;
BEGIN
  FOR r IN SELECT * FROM inbound_links ORDER BY source_table, source_slug, target_slug LOOP
    -- Read the current description from whichever table this source lives in.
    IF r.source_table = 'destinations' THEN
      SELECT d.description INTO body FROM destinations d WHERE d.slug = r.source_slug;
    ELSE
      SELECT t.description INTO body FROM tours t WHERE t.slug = r.source_slug;
    END IF;

    IF NOT FOUND THEN
      INSERT INTO inbound_outcome VALUES (r.source_table, r.source_slug, r.target_slug, r.anchor,
        'SKIPPED: no row with that slug');
      CONTINUE;
    END IF;

    IF position('/blog/' || r.target_slug IN coalesce(body, '')) > 0 THEN
      INSERT INTO inbound_outcome VALUES (r.source_table, r.source_slug, r.target_slug, r.anchor,
        'skipped: already links there');
      CONTINUE;
    END IF;

    converted := pg_temp.to_html(coalesce(body, ''));
    links := pg_temp.link_count(converted);
    IF links >= 4 THEN
      INSERT INTO inbound_outcome VALUES (r.source_table, r.source_slug, r.target_slug, r.anchor,
        format('SKIPPED: page already has %s internal links, at the cap', links));
      CONTINUE;
    END IF;

    paragraph := '<p>' || replace(
      r.sentence,
      '{{A}}',
      '<a href="/blog/' || r.target_slug || '">' || r.anchor || '</a>'
    ) || '</p>';

    IF r.source_table = 'destinations' THEN
      UPDATE destinations SET description = converted || paragraph, updated_at = now()
      WHERE slug = r.source_slug;
    ELSE
      UPDATE tours SET description = converted || paragraph, updated_at = now()
      WHERE slug = r.source_slug;
    END IF;

    INSERT INTO inbound_outcome VALUES (r.source_table, r.source_slug, r.target_slug, r.anchor,
      format('added (page had %s internal links, now %s)', links, links + 1));
  END LOOP;
END $$;

COMMIT;

-- ---------------------------------------------------------------------------
-- Report: source page, anchor text, target, outcome
-- ---------------------------------------------------------------------------
-- Anything in capitals in the outcome column needs a human decision. Lower
-- case is either a success or a harmless re-run.
SELECT source_table AS source, source_slug, anchor AS anchor_text,
       '/blog/' || target_slug AS target, outcome
FROM inbound_outcome
ORDER BY source_table, source_slug, target_slug;

SELECT 'links added' AS check, count(*) AS n FROM inbound_outcome WHERE outcome LIKE 'added%';
SELECT 'needs a decision' AS check, count(*) AS n FROM inbound_outcome WHERE outcome LIKE 'SKIPPED%';

-- Every target must end up with at least two inbound links, counted across
-- both source tables. A target below 2 is one this file failed to place.
SELECT t.target_slug, count(*) AS inbound_links
FROM (SELECT DISTINCT target_slug FROM inbound_links) t
JOIN LATERAL (
  SELECT 1 FROM destinations d WHERE d.description LIKE '%/blog/' || t.target_slug || '%'
  UNION ALL
  SELECT 1 FROM tours tr WHERE tr.description LIKE '%/blog/' || t.target_slug || '%'
) hits ON true
GROUP BY t.target_slug
ORDER BY count(*), t.target_slug;

-- Must be 0. A target with fewer than two inbound links after this ran.
SELECT 'targets with fewer than 2 inbound links' AS check, count(*) AS bad FROM (
  SELECT t.target_slug
  FROM (SELECT DISTINCT target_slug FROM inbound_links) t
  LEFT JOIN LATERAL (
    SELECT 1 FROM destinations d WHERE d.description LIKE '%/blog/' || t.target_slug || '%'
    UNION ALL
    SELECT 1 FROM tours tr WHERE tr.description LIKE '%/blog/' || t.target_slug || '%'
  ) hits ON true
  GROUP BY t.target_slug
  HAVING count(hits) < 2
) low;

-- Must be 0. No source page pushed past the cap by this file.
SELECT 'source pages over the four link cap' AS check, count(*) AS bad FROM (
  SELECT d.slug FROM destinations d
  WHERE d.slug IN (SELECT source_slug FROM inbound_links WHERE source_table = 'destinations')
    AND (length(d.description) - length(replace(d.description, 'href="/', ''))) / length('href="/') > 4
  UNION ALL
  SELECT t.slug FROM tours t
  WHERE t.slug IN (SELECT source_slug FROM inbound_links WHERE source_table = 'tours')
    AND (length(t.description) - length(replace(t.description, 'href="/', ''))) / length('href="/') > 4
) over_cap;

-- Must be 0. Nothing here may point at a slug the redirects still rewrite.
SELECT 'inbound links pointing at an old slug' AS check, count(*) AS bad
FROM inbound_links
WHERE target_slug IN (
  'do-us-citizens-need-a-visa-for-egypt', 'is-egypt-safe-for-american-tourists',
  'vaccines-for-egypt-travel', 'how-to-plan-a-luxury-egypt-trip',
  'things-to-know-before-traveling-to-egypt', 'egypt-packing-list',
  'private-egypt-tour', 'bespoke-egypt-travel'
);

DROP TABLE IF EXISTS inbound_outcome;
DROP TABLE IF EXISTS inbound_links;
