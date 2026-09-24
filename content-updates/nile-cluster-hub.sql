-- Cluster 1, the Nile: the pillar hub block and its ItemList.
--
-- The pillar is /blog/best-luxury-nile-cruise-egypt. The five articles in the
-- wave file sit under it and each links UP to it in prose. This file is the
-- other half: the pillar linking DOWN to all five, plus the ItemList that
-- tells a crawler they are an ordered set rather than five unrelated pages.
--
-- RUN THIS AFTER add-posts-wave-nile-cluster.sql, and after
-- scripts/fill-post-images.ts. The wave file assigns body_en to the pillar
-- from the generator, which knows nothing about this block, so running it
-- afterwards would discard the hub.
--
-- WHY THE HUB IS NOT IN THE GENERATOR: the five articles it points at publish
-- between 3 and 15 November. A hub block written into the pillar's source
-- would be live from the day the rewrite wave runs, with five links that 404
-- for up to six weeks. This file can be run on 15 November, once they are all
-- up, and until then the pillar is simply a pillar without a hub.
--
-- The block is counted as furniture rather than editorial, the same as the
-- related reading list at the foot of every article, so it does not put the
-- pillar over its four link cap.
--
-- Idempotent: the hub is removed and rewritten rather than appended, so a
-- second run produces the same row as the first.

BEGIN;

-- Guard: refuse to build a hub pointing at articles that are not there yet.
-- Without this the file would happily write five links to nothing.
DO $$
DECLARE missing text;
BEGIN
  SELECT string_agg(s, ', ') INTO missing
  FROM unnest(ARRAY['dahabiya-nile-cruise', 'nile-cruise-luxor-to-aswan', '7-night-nile-cruise', 'lake-nasser-cruise', 'best-time-to-go-to-egypt-nile-cruise']) AS s
  WHERE NOT EXISTS (SELECT 1 FROM posts p WHERE p.slug = s);
  IF missing IS NOT NULL THEN
    RAISE EXCEPTION 'Not all cluster articles exist yet, missing: %. Run add-posts-wave-nile-cluster.sql first.', missing;
  END IF;
END $$;

UPDATE posts SET
  -- Strip any previous hub before adding this one, which is what makes a
  -- re-run safe and what lets the block be edited later without stacking.
  body_en = regexp_replace(body_en, '<aside class="cluster-hub".*?</aside>', '', 'g') || '<aside class="cluster-hub" aria-label="Planning your Nile cruise"><h2 id="planning-your-nile-cruise">Planning your Nile cruise</h2><p>Five pages under this one, each taking a single decision further.</p><ol><li><a href="/blog/dahabiya-nile-cruise">sailing boats, and what a small hull changes</a></li><li><a href="/blog/nile-cruise-luxor-to-aswan">the route between the two cities, day by day</a></li><li><a href="/blog/7-night-nile-cruise">how many nights the river actually deserves</a></li><li><a href="/blog/lake-nasser-cruise">the quieter water south of the dam</a></li><li><a href="/blog/best-time-to-go-to-egypt-nile-cruise">picking the month, and why the deck decides it</a></li></ol></aside>',
  schema_markup = '{"@context": "https://schema.org","@type": "ItemList","name": "Planning your Nile cruise","itemListOrder": "https://schema.org/ItemListOrderAscending","numberOfItems": 5,"itemListElement": [{"@type": "ListItem","position": 1,"url": "https://iluxuryegypt.com/blog/dahabiya-nile-cruise","name": "Dahabiya Nile Cruise: Choosing Your Boat"},{"@type": "ListItem","position": 2,"url": "https://iluxuryegypt.com/blog/nile-cruise-luxor-to-aswan","name": "Nile Cruise Luxor to Aswan: What You See and When"},{"@type": "ListItem","position": 3,"url": "https://iluxuryegypt.com/blog/7-night-nile-cruise","name": "7 Night Nile Cruise: Is the Longer Sailing Worth It"},{"@type": "ListItem","position": 4,"url": "https://iluxuryegypt.com/blog/lake-nasser-cruise","name": "Lake Nasser Cruise: Nubia on the Quieter Water"},{"@type": "ListItem","position": 5,"url": "https://iluxuryegypt.com/blog/best-time-to-go-to-egypt-nile-cruise","name": "Best Time to Go to Egypt Nile Cruise, Month by Month"}]}',
  updated_at = now()
WHERE slug = 'best-luxury-nile-cruise-egypt';

COMMIT;

-- ---------------------------------------------------------------------------
-- Verification. Every "bad" must read 0.
-- ---------------------------------------------------------------------------

SELECT 'pillar row found' AS check, count(*) AS n FROM posts WHERE slug = 'best-luxury-nile-cruise-egypt';

-- Exactly one hub block, never two.
SELECT 'duplicate hub blocks' AS check,
       (SELECT count(*) FROM regexp_matches(body_en, '<aside class="cluster-hub"', 'g')) - 1 AS bad
FROM posts WHERE slug = 'best-luxury-nile-cruise-egypt';

-- All five links present and pointing at rows that exist.
SELECT 'cluster links missing from the pillar' AS check, count(*) AS bad
FROM unnest(ARRAY['dahabiya-nile-cruise', 'nile-cruise-luxor-to-aswan', '7-night-nile-cruise', 'lake-nasser-cruise', 'best-time-to-go-to-egypt-nile-cruise']) AS s
WHERE NOT EXISTS (
  SELECT 1 FROM posts p WHERE p.slug = 'best-luxury-nile-cruise-egypt'
    AND p.body_en LIKE '%/blog/' || s || '%'
);

-- The ItemList has to be valid JSON with five ordered members, because
-- seo-meta.ts drops it silently if it is not.
SELECT 'ItemList members' AS check,
       jsonb_array_length((schema_markup::jsonb) -> 'itemListElement') AS n,
       (schema_markup::jsonb) ->> '@type' AS type
FROM posts WHERE slug = 'best-luxury-nile-cruise-egypt';

-- Every cluster article links UP to the pillar exactly once, and the pillar
-- links DOWN to every one of them. That is the orphan check.
SELECT s AS cluster_article,
       (SELECT count(*) FROM regexp_matches(p.body_en, '/blog/best-luxury-nile-cruise-egypt', 'g')) AS links_up
FROM unnest(ARRAY['dahabiya-nile-cruise', 'nile-cruise-luxor-to-aswan', '7-night-nile-cruise', 'lake-nasser-cruise', 'best-time-to-go-to-egypt-nile-cruise']) AS s
JOIN posts p ON p.slug = s
ORDER BY s;

SELECT 'cluster articles without exactly one link up' AS check, count(*) AS bad FROM (
  SELECT s FROM unnest(ARRAY['dahabiya-nile-cruise', 'nile-cruise-luxor-to-aswan', '7-night-nile-cruise', 'lake-nasser-cruise', 'best-time-to-go-to-egypt-nile-cruise']) AS s
  JOIN posts p ON p.slug = s
  WHERE (SELECT count(*) FROM regexp_matches(p.body_en, '/blog/best-luxury-nile-cruise-egypt', 'g')) <> 1
) bad_rows;
