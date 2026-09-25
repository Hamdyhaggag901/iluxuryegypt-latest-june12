-- Cluster 3, planning: the pillar hub block, its ItemList, and the one
-- cross-link that could not be written into the generator.
--
-- The pillar is /blog/planning-a-trip-to-egypt. Five articles sit under it:
-- three that were already live and two from Phase C. Each links UP to the
-- pillar exactly once, in prose. This file is the other half, the pillar
-- linking DOWN to all five, plus the ItemList that tells a crawler they are
-- an ordered set rather than five unrelated pages.
--
-- RUN THIS ON OR AFTER 9 DECEMBER 2026, once valley-of-the-whales is live.
-- It refuses to run before both Phase C members exist, the same way the Nile
-- and hotels hubs do.
--
-- RUN IT AFTER add-posts-wave-planning-cluster.sql and after
-- add-posts-wave-rewrite-phase-a/b/c.sql. Those files assign body_en to the
-- pillar and to two of the members from the generator, which knows nothing
-- about this block, so running them afterwards would discard it.
--
-- WHY THE CROSS-LINK IS HERE. fayoum-oasis-egypt publishes on 6 December and
-- valley-of-the-whales on 9 December. A link from the first to the second,
-- written into the generator, would 404 for three days, which is exactly what
-- the generator's link-recency guard refuses to emit. The reverse direction
-- (whales to Fayoum) is in the generator, because that target is already live
-- by then. So the forward link is deferred to this file.
--
-- The hub block is counted as furniture rather than editorial, the same as
-- the related reading list at the foot of every article, so it does not put
-- the pillar over its four link cap. The cross-link below IS editorial, and
-- takes fayoum-oasis-egypt from three prose links to four, which is the cap.
--
-- Idempotent: the hub is stripped and rewritten rather than appended, and the
-- cross-link is guarded on its own absence. A second run is a no-op.

BEGIN;

-- Guard: refuse to build a hub pointing at articles that are not there yet.
DO $$
DECLARE missing text;
BEGIN
  SELECT string_agg(s, ', ') INTO missing
  FROM unnest(ARRAY[
    'planning-a-trip-to-egypt',
    'best-time-to-visit-egypt',
    'private-tours-in-cairo-egypt',
    'egypt-travel-tips',
    'fayoum-oasis-egypt',
    'valley-of-the-whales'
  ]) AS s
  WHERE NOT EXISTS (SELECT 1 FROM posts p WHERE p.slug = s);
  IF missing IS NOT NULL THEN
    RAISE EXCEPTION 'Not all planning cluster rows exist yet, missing: %. Run add-posts-wave-planning-cluster.sql and the rewrite waves first.', missing;
  END IF;
END $$;

-- 1. The pillar links down to all five.
UPDATE posts SET
  body_en = regexp_replace(body_en, '<aside class="cluster-hub".*?</aside>', '', 'g') || '<aside class="cluster-hub" aria-label="Planning the trip, step by step"><h2 id="planning-the-trip-step-by-step">Planning the trip, step by step</h2><p>Five pages under this one, each taking a single decision further.</p><ol><li><a href="/blog/best-time-to-visit-egypt">picking the month, and what it costs you</a></li><li><a href="/blog/private-tours-in-cairo-egypt">how the Cairo days actually divide</a></li><li><a href="/blog/egypt-travel-tips">the practical things that come up daily</a></li><li><a href="/blog/fayoum-oasis-egypt">the day trip most itineraries skip</a></li><li><a href="/blog/valley-of-the-whales">the fossil site, and what is really on show</a></li></ol></aside>',
  schema_markup = '{"@context": "https://schema.org","@type": "ItemList","name": "Planning the trip, step by step","itemListOrder": "https://schema.org/ItemListOrderAscending","numberOfItems": 5,"itemListElement": [{"@type": "ListItem","position": 1,"url": "https://iluxuryegypt.com/blog/best-time-to-visit-egypt","name": "Best Time to Visit Egypt: A Month by Month Guide"},{"@type": "ListItem","position": 2,"url": "https://iluxuryegypt.com/blog/private-tours-in-cairo-egypt","name": "Private Tours in Cairo Egypt: Three Days Planned"},{"@type": "ListItem","position": 3,"url": "https://iluxuryegypt.com/blog/egypt-travel-tips","name": "Egypt Travel Tips That Change the Day"},{"@type": "ListItem","position": 4,"url": "https://iluxuryegypt.com/blog/fayoum-oasis-egypt","name": "Fayoum Oasis Egypt: What Is Actually There"},{"@type": "ListItem","position": 5,"url": "https://iluxuryegypt.com/blog/valley-of-the-whales","name": "Valley of the Whales: What Is Actually on Show"}]}',
  updated_at = now()
WHERE slug = 'planning-a-trip-to-egypt';

-- 2. The deferred cross-link, Fayoum to the Valley of the Whales.
--
-- Anchored on the closing sentence of the fossil section rather than on a
-- position, so it lands in the paragraph it belongs to. If that sentence has
-- been edited the UPDATE matches nothing and the verification below reports
-- it as missing, which is the correct failure: silently appending the link
-- somewhere else would be worse.
UPDATE posts SET
  body_en = replace(
    body_en,
    'Allow half a day and treat it as the destination rather than a stop.</p>',
    'Allow half a day and treat it as the destination rather than a stop. <a href="/blog/valley-of-the-whales">The full account of the fossil site</a> covers what is there and how the visit runs.</p>'
  ),
  updated_at = now()
WHERE slug = 'fayoum-oasis-egypt'
  AND body_en NOT LIKE '%/blog/valley-of-the-whales%';

COMMIT;

-- ---------------------------------------------------------------------------
-- Verification. Every "bad" must read 0.
-- ---------------------------------------------------------------------------

SELECT 'pillar row found' AS check, count(*) AS n FROM posts WHERE slug = 'planning-a-trip-to-egypt';

-- Exactly one hub block, never two.
SELECT 'duplicate hub blocks' AS check,
       (SELECT count(*) FROM regexp_matches(body_en, '<aside class="cluster-hub"', 'g')) - 1 AS bad
FROM posts WHERE slug = 'planning-a-trip-to-egypt';

-- All five links present on the pillar.
SELECT 'cluster links missing from the pillar' AS check, count(*) AS bad
FROM unnest(ARRAY['best-time-to-visit-egypt', 'private-tours-in-cairo-egypt', 'egypt-travel-tips', 'fayoum-oasis-egypt', 'valley-of-the-whales']) AS s
WHERE NOT EXISTS (
  SELECT 1 FROM posts p WHERE p.slug = 'planning-a-trip-to-egypt'
    AND p.body_en LIKE '%/blog/' || s || '%'
);

-- The ItemList has to be valid JSON with five ordered members, because
-- seo-meta.ts drops it silently if it is not.
SELECT 'ItemList members' AS check,
       jsonb_array_length((schema_markup::jsonb) -> 'itemListElement') AS n,
       (schema_markup::jsonb) ->> '@type' AS type
FROM posts WHERE slug = 'planning-a-trip-to-egypt';

-- Every cluster article links UP to the pillar exactly once.
SELECT s AS cluster_article,
       (SELECT count(*) FROM regexp_matches(p.body_en, '/blog/planning-a-trip-to-egypt', 'g')) AS links_up
FROM unnest(ARRAY['best-time-to-visit-egypt', 'private-tours-in-cairo-egypt', 'egypt-travel-tips', 'fayoum-oasis-egypt', 'valley-of-the-whales']) AS s
JOIN posts p ON p.slug = s ORDER BY s;

SELECT 'cluster articles without exactly one link up' AS check, count(*) AS bad FROM (
  SELECT s FROM unnest(ARRAY['best-time-to-visit-egypt', 'private-tours-in-cairo-egypt', 'egypt-travel-tips', 'fayoum-oasis-egypt', 'valley-of-the-whales']) AS s
  JOIN posts p ON p.slug = s
  WHERE (SELECT count(*) FROM regexp_matches(p.body_en, '/blog/planning-a-trip-to-egypt', 'g')) <> 1
) bad_rows;

-- The cross-link landed, exactly once.
SELECT 'fayoum cross-link to the whales' AS check,
       (SELECT count(*) FROM regexp_matches(body_en, 'href="/blog/valley-of-the-whales"', 'g')) AS n
FROM posts WHERE slug = 'fayoum-oasis-egypt';

-- And the two Phase C members still point back at each other, both ways.
SELECT 'whales links back to fayoum' AS check,
       (SELECT count(*) FROM regexp_matches(body_en, 'href="/blog/fayoum-oasis-egypt"', 'g')) AS n
FROM posts WHERE slug = 'valley-of-the-whales';
