-- Part A of the destinations move: renames the six destination slugs to match
-- the keywords their pages target. The route itself changed from /destinations
-- to /egypt-travel-guide in the same commit (client/src/App.tsx), and every
-- old URL is 301'd in server/path-redirects.ts.
--
--   cairo      -> cairo-travel-guide
--   luxor      -> attractions-in-luxor
--   aswan      -> aswan-egypt-attractions
--   alexandria -> alexandria-egypt-attractions
--   hurghada   -> things-to-do-in-hurghada
--   siwa-oasis -> siwa-oasis-egypt
--
-- Matched on the old slug, so re-running is a no-op once applied.
--
-- Nothing references destinations.slug by foreign key. The client builds
-- /egypt-travel-guide/:slug from the row itself and the sitemap does the same,
-- so both follow automatically.
--
-- The second half rewrites the /destinations/<slug> links that earlier content
-- scripts baked into published tour and category copy. Those would still
-- resolve through the 301s, but an internal link that costs a redirect hop is
-- worth fixing at the source. Content-only: no schema or slug changes there.

BEGIN;

-- ---------------------------------------------------------------------------
-- Destination slugs
-- ---------------------------------------------------------------------------
UPDATE destinations SET slug = 'cairo-travel-guide', updated_at = now() WHERE slug = 'cairo';
UPDATE destinations SET slug = 'attractions-in-luxor', updated_at = now() WHERE slug = 'luxor';
UPDATE destinations SET slug = 'aswan-egypt-attractions', updated_at = now() WHERE slug = 'aswan';
UPDATE destinations SET slug = 'alexandria-egypt-attractions', updated_at = now() WHERE slug = 'alexandria';
UPDATE destinations SET slug = 'things-to-do-in-hurghada', updated_at = now() WHERE slug = 'hurghada';
UPDATE destinations SET slug = 'siwa-oasis-egypt', updated_at = now() WHERE slug = 'siwa-oasis';

-- ---------------------------------------------------------------------------
-- Repoint the destination links inside published copy
--
-- Longest-first within each statement is not a concern here because each old
-- path is matched with its closing quote, so /destinations/aswan cannot also
-- match /destinations/aswan-something.
-- ---------------------------------------------------------------------------
UPDATE tours
SET description = replace(replace(replace(replace(replace(replace(description,
      '"/destinations/cairo"',      '"/egypt-travel-guide/cairo-travel-guide"'),
      '"/destinations/luxor"',      '"/egypt-travel-guide/attractions-in-luxor"'),
      '"/destinations/aswan"',      '"/egypt-travel-guide/aswan-egypt-attractions"'),
      '"/destinations/alexandria"', '"/egypt-travel-guide/alexandria-egypt-attractions"'),
      '"/destinations/hurghada"',   '"/egypt-travel-guide/things-to-do-in-hurghada"'),
      '"/destinations/siwa-oasis"', '"/egypt-travel-guide/siwa-oasis-egypt"'),
    updated_at = now()
WHERE description LIKE '%"/destinations/%';

UPDATE categories
SET description = replace(replace(replace(replace(replace(replace(description,
      '"/destinations/cairo"',      '"/egypt-travel-guide/cairo-travel-guide"'),
      '"/destinations/luxor"',      '"/egypt-travel-guide/attractions-in-luxor"'),
      '"/destinations/aswan"',      '"/egypt-travel-guide/aswan-egypt-attractions"'),
      '"/destinations/alexandria"', '"/egypt-travel-guide/alexandria-egypt-attractions"'),
      '"/destinations/hurghada"',   '"/egypt-travel-guide/things-to-do-in-hurghada"'),
      '"/destinations/siwa-oasis"', '"/egypt-travel-guide/siwa-oasis-egypt"'),
    updated_at = now()
WHERE description LIKE '%"/destinations/%';

COMMIT;

-- ---------------------------------------------------------------------------
-- Verification
-- ---------------------------------------------------------------------------
SELECT slug, name FROM destinations
WHERE slug IN ('cairo-travel-guide', 'attractions-in-luxor', 'aswan-egypt-attractions',
               'alexandria-egypt-attractions', 'things-to-do-in-hurghada', 'siwa-oasis-egypt')
ORDER BY slug;

SELECT 'destinations still on an old slug' AS check, count(*) AS bad
FROM destinations
WHERE slug IN ('cairo', 'luxor', 'aswan', 'alexandria', 'hurghada', 'siwa-oasis');

SELECT 'published copy still linking /destinations/' AS check,
       (SELECT count(*) FROM tours WHERE description LIKE '%"/destinations/%') AS tours,
       (SELECT count(*) FROM categories WHERE description LIKE '%"/destinations/%') AS categories;
