-- /stay -> /luxury-hotels-in-egypt: the rows that hold the old path.
--
-- The code side of this rename is in the branch; this file covers what lives
-- in the database instead of in source. Nothing here is required for the site
-- to work: /stay 301s to the new path either way. It is here so an internal
-- link points straight at the destination rather than costing every visitor
-- and every crawler an extra hop.
--
-- Hotel pages are NOT affected. They are served at /hotel/<slug>, which this
-- rename does not touch, so hotels.canonical_url stays exactly as
-- content-updates/update-mena-house-and-canonical-fix.sql set it.
--
-- Safe to run more than once: every statement matches only the old value.
--
-- Run with: psql "$DATABASE_URL" -f content-updates/rename-stay-path.sql
-- Then restart the app, because a direct SQL edit goes through no handler and
-- so clears neither the server rendered content cache nor the bot snapshots.

BEGIN;

-- ============================================================
-- 1. Before: what still points at the old path
-- ============================================================
SELECT 'nav_items' AS source, id::text, label AS context, href AS value FROM nav_items WHERE href = '/stay' OR href LIKE '/stay/%'
UNION ALL
SELECT 'footer_links', id::text, label, href FROM footer_links WHERE href = '/stay' OR href LIKE '/stay/%'
UNION ALL
SELECT 'stay_cta.primary', id::text, primary_button_text, primary_button_link FROM stay_cta WHERE primary_button_link = '/stay' OR primary_button_link LIKE '/stay/%'
UNION ALL
SELECT 'stay_cta.secondary', id::text, secondary_button_text, secondary_button_link FROM stay_cta WHERE secondary_button_link = '/stay' OR secondary_button_link LIKE '/stay/%';

-- ============================================================
-- 2. Navigation and footer links
-- ============================================================
UPDATE nav_items
SET href = '/luxury-hotels-in-egypt', updated_at = now()
WHERE href = '/stay';

UPDATE footer_links
SET href = '/luxury-hotels-in-egypt', updated_at = now()
WHERE href = '/stay';

-- A saved /stay/<slug> link was always a link to a hotel page, which lives at
-- /hotel/<slug>. Same target the server side redirect sends it to.
UPDATE nav_items
SET href = '/hotel' || substring(href from 6), updated_at = now()
WHERE href LIKE '/stay/%';

UPDATE footer_links
SET href = '/hotel' || substring(href from 6), updated_at = now()
WHERE href LIKE '/stay/%';

-- ============================================================
-- 3. The hotel listing page's own call to action buttons
-- ============================================================
UPDATE stay_cta
SET primary_button_link = '/luxury-hotels-in-egypt', updated_at = now()
WHERE primary_button_link = '/stay';

UPDATE stay_cta
SET secondary_button_link = '/luxury-hotels-in-egypt', updated_at = now()
WHERE secondary_button_link = '/stay';

-- ============================================================
-- 4. Editor written HTML: reported, never rewritten
-- ============================================================
-- Article and description bodies are hand authored, and a blind
-- search and replace inside stored HTML is how an article gets mangled. These
-- rows are listed so they can be fixed in the admin, one at a time, by someone
-- looking at the sentence the link sits in. Until then they keep working
-- through the 301.
SELECT 'posts.body_en' AS source, slug, title_en AS context FROM posts WHERE body_en LIKE '%"/stay%' OR body_en LIKE '%''/stay%'
UNION ALL
SELECT 'tours.description', slug, title FROM tours WHERE description LIKE '%"/stay%' OR description LIKE '%''/stay%'
UNION ALL
SELECT 'destinations.description', slug, name FROM destinations WHERE description LIKE '%"/stay%' OR description LIKE '%''/stay%'
UNION ALL
SELECT 'hotels.full_description', slug, name FROM hotels WHERE full_description LIKE '%"/stay%' OR full_description LIKE '%''/stay%';

-- ============================================================
-- 5. After: should return no rows
-- ============================================================
SELECT 'nav_items' AS source, href AS value FROM nav_items WHERE href = '/stay' OR href LIKE '/stay/%'
UNION ALL
SELECT 'footer_links', href FROM footer_links WHERE href = '/stay' OR href LIKE '/stay/%';

COMMIT;
