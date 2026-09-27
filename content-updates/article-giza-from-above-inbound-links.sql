-- Inbound internal links to the new Giza from above article.
--
--   psql "$DATABASE_URL" -f content-updates/article-giza-from-above-inbound-links.sql
--
-- RUN content-updates/article-giza-pyramids-from-above.sql FIRST so the target
-- exists before anything links to it.
--
-- EVERY STATEMENT IS INDEPENDENTLY RE-RUNNABLE. Each carries a NOT LIKE guard
-- against the exact link it adds, so running this twice appends nothing and
-- each statement reports UPDATE 0 on a second run. Each also checks the target
-- article exists, so a link is never added to a page that has not been created.
--
-- Dollar quoting on every text value; the appended HTML uses $L$.

\set ON_ERROR_STOP on

BEGIN;

UPDATE posts SET
  body_en    = body_en || $L$<p>The museum pairs naturally with a morning on the plateau, and there is now a further reason to give the day some room: <a href="/blog/giza-pyramids-from-above">a tethered balloon near the plateau</a> has entered trial operation, which for the first time gives visitors a way to see the pyramids from the air.</p>$L$,
  updated_at = now()
WHERE slug = $A$grand-egyptian-museum-tour$A$
  AND body_en IS NOT NULL
  AND body_en NOT LIKE $A$%/blog/giza-pyramids-from-above%$A$
  AND EXISTS (SELECT 1 FROM posts t WHERE t.slug = $A$giza-pyramids-from-above$A$);

UPDATE posts SET
  body_en    = body_en || $L$<p>One thing worth watching before you fix your dates is the tethered balloon installed near the plateau, which entered trial operation at the end of August 2026 and is covered in <a href="/blog/giza-pyramids-from-above">our guide to seeing the Giza pyramids from above</a>.</p>$L$,
  updated_at = now()
WHERE slug = $A$private-pyramid-tours-egypt$A$
  AND body_en IS NOT NULL
  AND body_en NOT LIKE $A$%/blog/giza-pyramids-from-above%$A$
  AND EXISTS (SELECT 1 FROM posts t WHERE t.slug = $A$giza-pyramids-from-above$A$);

UPDATE posts SET
  body_en    = body_en || $L$<p>A pyramid view room is one way to look at the plateau from a height, and it is no longer the only one: <a href="/blog/giza-pyramids-from-above">the new tethered balloon near Giza</a> is in trial operation and explained here, along with the viewpoints that already work today.</p>$L$,
  updated_at = now()
WHERE slug = $A$cairo-hotel-with-pyramid-view$A$
  AND body_en IS NOT NULL
  AND body_en NOT LIKE $A$%/blog/giza-pyramids-from-above%$A$
  AND EXISTS (SELECT 1 FROM posts t WHERE t.slug = $A$giza-pyramids-from-above$A$);

UPDATE posts SET
  body_en    = body_en || $L$<p>If it is the shape of a pyramid field that interests you rather than the crowds at Giza, it is worth reading <a href="/blog/giza-pyramids-from-above">how the new tethered balloon changes the view of the Giza plateau</a>, since seeing a complex from above makes its layout legible in a way ground level never does.</p>$L$,
  updated_at = now()
WHERE slug = $A$dahshur-pyramids-egypt$A$
  AND body_en IS NOT NULL
  AND body_en NOT LIKE $A$%/blog/giza-pyramids-from-above%$A$
  AND EXISTS (SELECT 1 FROM posts t WHERE t.slug = $A$giza-pyramids-from-above$A$);

UPDATE posts SET
  body_en    = body_en || $L$<p>Anyone planning a Cairo itinerary for the coming season should know about the tethered balloon near the Giza plateau, which is in trial operation with no confirmed opening date; <a href="/blog/giza-pyramids-from-above">our article on seeing the Giza pyramids from above</a> sets out what is settled and what is not.</p>$L$,
  updated_at = now()
WHERE slug = $A$private-tours-in-cairo-egypt$A$
  AND body_en IS NOT NULL
  AND body_en NOT LIKE $A$%/blog/giza-pyramids-from-above%$A$
  AND EXISTS (SELECT 1 FROM posts t WHERE t.slug = $A$giza-pyramids-from-above$A$);

COMMIT;

\echo
\echo article-giza-from-above-inbound-links

SELECT p.slug AS source_post,
  p.body_en LIKE $A$%/blog/giza-pyramids-from-above%$A$ AS link_present,
  (length(p.body_en) - length(replace(p.body_en, $A$/blog/giza-pyramids-from-above$A$, $A$$A$)))
    / length($A$/blog/giza-pyramids-from-above$A$) AS link_count
FROM posts p
WHERE p.slug IN ($A$grand-egyptian-museum-tour$A$, $A$private-pyramid-tours-egypt$A$, $A$cairo-hotel-with-pyramid-view$A$, $A$dahshur-pyramids-egypt$A$, $A$private-tours-in-cairo-egypt$A$)
ORDER BY 1;
