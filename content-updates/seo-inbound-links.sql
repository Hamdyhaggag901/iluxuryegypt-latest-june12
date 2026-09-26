-- Four inbound links from existing live posts to the two category pages.
--
--   psql "$DATABASE_URL" -f content-updates/seo-inbound-links.sql
--
-- EVERY STATEMENT IS INDEPENDENTLY RE-RUNNABLE. Each carries a NOT LIKE guard
-- against the link it is about to add, so running the file twice appends
-- nothing and each statement reports UPDATE 0 on a second run. A previous
-- internal links file on this site lacked that guard and duplicated every
-- paragraph it touched.
--
-- Honeymoon and spiritual pages are not cross linked. Three of these four posts
-- point at the honeymoon category and one at the spiritual category, chosen by
-- which is actually relevant to the post rather than to spread the links evenly.
--
-- The category path is resolved from the category row at run time, the same way
-- server/routes.ts builds it, so these links cannot go stale if a slug changes.
--
-- Dollar quoting on every text value; the appended HTML uses $L$.

\set ON_ERROR_STOP on

BEGIN;

UPDATE posts SET
  body_en    = body_en || replace($L$<p>If you are choosing between itineraries rather than reading around the subject, the three <a href="CATLINK">egypt honeymoon packages</a> are built not to overlap: seven days ending on the Red Sea, nine on the Nile, or ten running out to Alexandria.</p>$L$, $D$CATLINK$D$, (SELECT $D$/$D$ || CASE c.category_type WHEN $D$day-tours$D$ THEN $D$egypt-day-tours$D$ WHEN $D$nile-cruise$D$ THEN $D$egypt-nile-cruise-tours$D$ ELSE $D$luxury-egypt-tour-packages$D$ END || $D$/$D$ || c.slug FROM categories c WHERE c.name = $D$Luxury Honeymoon Egypt$D$)),
  updated_at = now()
WHERE slug = $D$egypt-honeymoon$D$
  AND body_en IS NOT NULL
  AND body_en NOT LIKE $D$%$D$ || (SELECT $D$/$D$ || CASE c.category_type WHEN $D$day-tours$D$ THEN $D$egypt-day-tours$D$ WHEN $D$nile-cruise$D$ THEN $D$egypt-nile-cruise-tours$D$ ELSE $D$luxury-egypt-tour-packages$D$ END || $D$/$D$ || c.slug FROM categories c WHERE c.name = $D$Luxury Honeymoon Egypt$D$) || $D$%$D$;

UPDATE posts SET
  body_en    = body_en || replace($L$<p>Dates matter more than usual when a wedding fixes the week, and the <a href="CATLINK">egypt honeymoon packages</a> page sets out which of the three itineraries copes best with the summer months and which really wants October to April.</p>$L$, $D$CATLINK$D$, (SELECT $D$/$D$ || CASE c.category_type WHEN $D$day-tours$D$ THEN $D$egypt-day-tours$D$ WHEN $D$nile-cruise$D$ THEN $D$egypt-nile-cruise-tours$D$ ELSE $D$luxury-egypt-tour-packages$D$ END || $D$/$D$ || c.slug FROM categories c WHERE c.name = $D$Luxury Honeymoon Egypt$D$)),
  updated_at = now()
WHERE slug = $D$best-time-to-visit-egypt$D$
  AND body_en IS NOT NULL
  AND body_en NOT LIKE $D$%$D$ || (SELECT $D$/$D$ || CASE c.category_type WHEN $D$day-tours$D$ THEN $D$egypt-day-tours$D$ WHEN $D$nile-cruise$D$ THEN $D$egypt-nile-cruise-tours$D$ ELSE $D$luxury-egypt-tour-packages$D$ END || $D$/$D$ || c.slug FROM categories c WHERE c.name = $D$Luxury Honeymoon Egypt$D$) || $D$%$D$;

UPDATE posts SET
  body_en    = body_en || replace($L$<p>If the sites themselves are the reason you are going rather than the country in general, the <a href="CATLINK">egypt spiritual tours</a> page compares a ten day temple route, a fourteen day itinerary that reaches Siwa, and eight days of desert camping with no temple in it.</p>$L$, $D$CATLINK$D$, (SELECT $D$/$D$ || CASE c.category_type WHEN $D$day-tours$D$ THEN $D$egypt-day-tours$D$ WHEN $D$nile-cruise$D$ THEN $D$egypt-nile-cruise-tours$D$ ELSE $D$luxury-egypt-tour-packages$D$ END || $D$/$D$ || c.slug FROM categories c WHERE c.name = $D$Spiritual Journeys Egypt$D$)),
  updated_at = now()
WHERE slug = $D$planning-a-trip-to-egypt$D$
  AND body_en IS NOT NULL
  AND body_en NOT LIKE $D$%$D$ || (SELECT $D$/$D$ || CASE c.category_type WHEN $D$day-tours$D$ THEN $D$egypt-day-tours$D$ WHEN $D$nile-cruise$D$ THEN $D$egypt-nile-cruise-tours$D$ ELSE $D$luxury-egypt-tour-packages$D$ END || $D$/$D$ || c.slug FROM categories c WHERE c.name = $D$Spiritual Journeys Egypt$D$) || $D$%$D$;

UPDATE posts SET
  body_en    = body_en || replace($L$<p>Couples travelling for a honeymoon rather than a general tour will find the <a href="CATLINK">egypt honeymoon packages</a> page more useful, since all three itineraries there are written for two people and none of them repeats another.</p>$L$, $D$CATLINK$D$, (SELECT $D$/$D$ || CASE c.category_type WHEN $D$day-tours$D$ THEN $D$egypt-day-tours$D$ WHEN $D$nile-cruise$D$ THEN $D$egypt-nile-cruise-tours$D$ ELSE $D$luxury-egypt-tour-packages$D$ END || $D$/$D$ || c.slug FROM categories c WHERE c.name = $D$Luxury Honeymoon Egypt$D$)),
  updated_at = now()
WHERE slug = $D$luxury-egypt-tours$D$
  AND body_en IS NOT NULL
  AND body_en NOT LIKE $D$%$D$ || (SELECT $D$/$D$ || CASE c.category_type WHEN $D$day-tours$D$ THEN $D$egypt-day-tours$D$ WHEN $D$nile-cruise$D$ THEN $D$egypt-nile-cruise-tours$D$ ELSE $D$luxury-egypt-tour-packages$D$ END || $D$/$D$ || c.slug FROM categories c WHERE c.name = $D$Luxury Honeymoon Egypt$D$) || $D$%$D$;

COMMIT;

\echo
\echo seo-inbound-links

SELECT
  p.slug,
  p.body_en LIKE $D$%/luxury-egypt-tour-packages/%$D$ AS links_to_a_category,
  (length(p.body_en) - length(replace(p.body_en, $D$/luxury-egypt-tour-packages/$D$, $D$$D$)))
    / length($D$/luxury-egypt-tour-packages/$D$)       AS category_link_count
FROM posts p
WHERE p.slug IN ($D$egypt-honeymoon$D$, $D$best-time-to-visit-egypt$D$, $D$planning-a-trip-to-egypt$D$, $D$luxury-egypt-tours$D$)
ORDER BY 1;
