-- Five inbound links from existing live posts to the five new articles.
--
--   psql "$DATABASE_URL" -f content-updates/article-inbound-links.sql
--
-- RUN THE FIVE ARTICLE FILES FIRST, so the targets exist before anything links
-- to them.
--
-- EVERY STATEMENT IS INDEPENDENTLY RE-RUNNABLE. Each carries a NOT LIKE guard
-- against the exact link it adds, so running this file twice appends nothing
-- and each statement reports UPDATE 0 on a second run. A previous internal
-- links file on this site lacked that guard and duplicated every paragraph it
-- touched.
--
-- Each statement also checks that the target article exists, so a link is never
-- added to a page that has not been created yet.
--
-- Dollar quoting on every text value; the appended HTML uses $L$.

\set ON_ERROR_STOP on

BEGIN;

UPDATE posts SET
  body_en    = body_en || $L$<p>The reliefs in the crypt below the hypostyle hall are the most argued over images at this temple, and <a href="/blog/dendera-light">the separate article on the Dendera crypt carving</a> covers what is carved, how Egyptologists read it, the lamp argument and whether the crypt is open on the day you go.</p>$L$,
  updated_at = now()
WHERE slug = $A$dendera-temple-egypt$A$
  AND body_en IS NOT NULL
  AND body_en NOT LIKE $A$%/blog/dendera-light%$A$
  AND EXISTS (SELECT 1 FROM posts t WHERE t.slug = $A$dendera-light$A$);

UPDATE posts SET
  body_en    = body_en || $L$<p>Travellers who come this far south for one building often go north for another, and <a href="/blog/egypt-osiris-temple">the article on the Osireion at Abydos</a> covers the unmortared granite structure behind the temple of Seti I, its disputed dating and the three hour road from Luxor.</p>$L$,
  updated_at = now()
WHERE slug = $A$abu-simbel-tour-from-aswan$A$
  AND body_en IS NOT NULL
  AND body_en NOT LIKE $A$%/blog/egypt-osiris-temple%$A$
  AND EXISTS (SELECT 1 FROM posts t WHERE t.slug = $A$egypt-osiris-temple$A$);

UPDATE posts SET
  body_en    = body_en || $L$<p>If you are still deciding whether the country suits the trip at all rather than comparing itineraries, <a href="/blog/honeymoon-in-egypt">the article on honeymooning in Egypt</a> works through safety, the best months, how long to go and how much walking to expect.</p>$L$,
  updated_at = now()
WHERE slug = $A$egypt-honeymoon$A$
  AND body_en IS NOT NULL
  AND body_en NOT LIKE $A$%/blog/honeymoon-in-egypt%$A$
  AND EXISTS (SELECT 1 FROM posts t WHERE t.slug = $A$honeymoon-in-egypt$A$);

UPDATE posts SET
  body_en    = body_en || $L$<p>Couples treating the city as the romantic half of a trip rather than a sightseeing stop will find <a href="/blog/cairo-honeymoon-packages">the article on short Cairo honeymoons</a> more directly useful, since it covers pyramid view rooms, dinner on the river and what a few days cannot do.</p>$L$,
  updated_at = now()
WHERE slug = $A$private-tours-in-cairo-egypt$A$
  AND body_en IS NOT NULL
  AND body_en NOT LIKE $A$%/blog/cairo-honeymoon-packages%$A$
  AND EXISTS (SELECT 1 FROM posts t WHERE t.slug = $A$cairo-honeymoon-packages$A$);

UPDATE posts SET
  body_en    = body_en || $L$<p>An itinerary of this shape passes within reach of Abydos without stopping there, and <a href="/blog/egypt-osiris-temple">the article on the Osireion</a> explains what the detour buys and why it costs a full day out of Luxor.</p>$L$,
  updated_at = now()
WHERE slug = $A$luxury-cairo-luxor-aswan-itinerary$A$
  AND body_en IS NOT NULL
  AND body_en NOT LIKE $A$%/blog/egypt-osiris-temple%$A$
  AND EXISTS (SELECT 1 FROM posts t WHERE t.slug = $A$egypt-osiris-temple$A$);

COMMIT;

\echo
\echo article-inbound-links

SELECT
  p.slug AS source_post,
  x.target,
  p.body_en LIKE $A$%/blog/$A$ || x.target || $A$%$A$ AS link_present,
  (length(p.body_en) - length(replace(p.body_en, $A$/blog/$A$ || x.target, $A$$A$)))
    / length($A$/blog/$A$ || x.target) AS link_count
FROM posts p
JOIN (VALUES ($A$dendera-temple-egypt$A$, $A$dendera-light$A$),
  ($A$abu-simbel-tour-from-aswan$A$, $A$egypt-osiris-temple$A$),
  ($A$egypt-honeymoon$A$, $A$honeymoon-in-egypt$A$),
  ($A$private-tours-in-cairo-egypt$A$, $A$cairo-honeymoon-packages$A$),
  ($A$luxury-cairo-luxor-aswan-itinerary$A$, $A$egypt-osiris-temple$A$))
  AS x(source, target) ON x.source = p.slug
ORDER BY 1, 2;
