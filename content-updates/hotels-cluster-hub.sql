-- Cluster 2, hotels: the pillar hub block on /luxury-hotels-in-egypt.
--
-- The pillar is a static page rather than a post, so there is no body_en to
-- append to. Its prose lives in stay_listing_settings.description, which the
-- admin edits and which server/seo-content.ts now renders: until the change
-- that shipped with this file, the server rendered version of that page was a
-- heading and a list of hotel names with no prose at all, so anything put here
-- would have been invisible to a crawler.
--
-- RUN THIS ON OR AFTER 12 DECEMBER 2026, once all seven articles are live.
-- It refuses to run before that, the same way the other two hubs do.
--
-- WHY 12 DECEMBER AND NOT 3 DECEMBER. The six Phase B articles are all live by
-- 3 December, but aswan-old-cataract-hotel-egypt is Phase C and publishes on
-- the 12th. Running this file twice, once for six and once for seven, would
-- put the hub up nine days earlier at the cost of a second run and a second
-- chance to get it wrong. The six are not orphans in the meantime: every one
-- of them already links UP to the pillar in its own prose, which is the half
-- of the cluster that matters for discovery. So this is one run, on one date,
-- with all seven.
--
-- Idempotent: the hub is stripped and rewritten, so a second run is a no-op.

BEGIN;

DO $$
DECLARE missing text;
BEGIN
  SELECT string_agg(s, ', ') INTO missing
  FROM unnest(ARRAY['where-to-stay-in-cairo', 'luxury-hotels-cairo', 'cairo-hotel-with-pyramid-view', 'best-hotels-in-luxor-egypt', 'best-hotels-in-aswan', '5-star-hotels-in-egypt', 'aswan-old-cataract-hotel-egypt']) AS s
  WHERE NOT EXISTS (SELECT 1 FROM posts p WHERE p.slug = s);
  IF missing IS NOT NULL THEN
    RAISE EXCEPTION 'Not all hotel cluster articles exist yet, missing: %. Run add-posts-wave-hotels-cluster.sql and add-posts-wave-planning-cluster.sql first.', missing;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM stay_listing_settings) THEN
    RAISE EXCEPTION 'stay_listing_settings has no row, so the hotels pillar has nowhere to put the hub.';
  END IF;
END $$;

UPDATE stay_listing_settings SET
  description = regexp_replace(coalesce(description, ''), '<aside class="cluster-hub".*?</aside>', '', 'g') || '<aside class="cluster-hub" aria-label="Choosing where to stay"><h2 id="choosing-where-to-stay">Choosing where to stay</h2><p>Seven pages on picking a hotel in Egypt, each taking one decision further.</p><ul><li><a href="/blog/where-to-stay-in-cairo">picking the right side of Cairo</a></li><li><a href="/blog/luxury-hotels-cairo">how the grand Cairo properties differ</a></li><li><a href="/blog/cairo-hotel-with-pyramid-view">which rooms really face the plateau</a></li><li><a href="/blog/best-hotels-in-luxor-egypt">east bank or west bank in Luxor</a></li><li><a href="/blog/best-hotels-in-aswan">where the view decides it in Aswan</a></li><li><a href="/blog/aswan-old-cataract-hotel-egypt">the one hotel people come to Aswan for</a></li><li><a href="/blog/5-star-hotels-in-egypt">what the star rating actually means</a></li></ul></aside>',
  updated_at = now();

COMMIT;

-- ---------------------------------------------------------------------------
-- Verification. Every "bad" must read 0.
-- ---------------------------------------------------------------------------

SELECT 'duplicate hub blocks' AS check,
       (SELECT count(*) FROM regexp_matches(description, '<aside class="cluster-hub"', 'g')) - 1 AS bad
FROM stay_listing_settings;

SELECT 'cluster links missing from the pillar' AS check, count(*) AS bad
FROM unnest(ARRAY['where-to-stay-in-cairo', 'luxury-hotels-cairo', 'cairo-hotel-with-pyramid-view', 'best-hotels-in-luxor-egypt', 'best-hotels-in-aswan', '5-star-hotels-in-egypt', 'aswan-old-cataract-hotel-egypt']) AS s
WHERE NOT EXISTS (
  SELECT 1 FROM stay_listing_settings st WHERE st.description LIKE '%/blog/' || s || '%'
);

-- Every cluster article links UP to the pillar exactly once. That is the
-- orphan check for this cluster.
SELECT s AS cluster_article,
       (SELECT count(*) FROM regexp_matches(p.body_en, '/luxury-hotels-in-egypt', 'g')) AS links_up
FROM unnest(ARRAY['where-to-stay-in-cairo', 'luxury-hotels-cairo', 'cairo-hotel-with-pyramid-view', 'best-hotels-in-luxor-egypt', 'best-hotels-in-aswan', '5-star-hotels-in-egypt', 'aswan-old-cataract-hotel-egypt']) AS s
JOIN posts p ON p.slug = s ORDER BY s;

SELECT 'cluster articles without exactly one link up' AS check, count(*) AS bad FROM (
  SELECT s FROM unnest(ARRAY['where-to-stay-in-cairo', 'luxury-hotels-cairo', 'cairo-hotel-with-pyramid-view', 'best-hotels-in-luxor-egypt', 'best-hotels-in-aswan', '5-star-hotels-in-egypt', 'aswan-old-cataract-hotel-egypt']) AS s
  JOIN posts p ON p.slug = s
  WHERE (SELECT count(*) FROM regexp_matches(p.body_en, '/luxury-hotels-in-egypt', 'g')) <> 1
) bad_rows;

-- No article may put a hotel under the listing path; hotels are /hotel/<slug>.
SELECT 'hotels linked under the listing page' AS check, count(*) AS bad FROM posts
WHERE slug IN (SELECT * FROM unnest(ARRAY['where-to-stay-in-cairo', 'luxury-hotels-cairo', 'cairo-hotel-with-pyramid-view', 'best-hotels-in-luxor-egypt', 'best-hotels-in-aswan', '5-star-hotels-in-egypt', 'aswan-old-cataract-hotel-egypt']))
  AND body_en ~ 'href="/luxury-hotels-in-egypt/[^"]';
