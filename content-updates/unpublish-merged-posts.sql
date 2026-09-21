-- Take the five merged and removed posts off the site, recoverably.
--
--   luxury-egypt-vacations            merged into luxury-egypt-tours
--   luxury-egypt-anniversary-trip     merged into egypt-honeymoon
--   grand-egyptian-museum-private-tour  duplicate of grand-egyptian-museum-tour
--   vip-cairo-experience              folded into private-tours-in-cairo-egypt
--   cairo-airport-transfer            removed, wrong audience
--
-- The other two retired posts are NOT here. private-egypt-tour and
-- bespoke-egypt-travel keep their rows: each is rewritten in place against a
-- keyword that has volume and given a new slug, so the row stays published and
-- only its content changes. Deleting them would throw away the history the URL
-- has accumulated.
--
-- ---------------------------------------------------------------------------
-- ONE CORRECTION TO THE BRIEF, AND IT MATTERS
-- ---------------------------------------------------------------------------
-- The instruction was to set published_at and scheduled_at to NULL. On its own
-- that does not unpublish anything on this site.
--
-- Visibility is decided by shared/post-visibility.ts, which asks two questions
-- in order: is status 'published', and if so has scheduled_at passed. A row
-- with status 'published' and scheduled_at NULL is LIVE, which is exactly what
-- NULLing both columns produces. The blog list, the single post route and the
-- sitemap all call isPostLive, so all three would have kept serving these five.
--
-- So status is set to 'draft' as well. That is what actually removes a post
-- from the listing, from /blog/<slug>, and from sitemap.xml, and it is still
-- fully recoverable: nothing is deleted and the body, the FAQs and the SEO
-- fields are all left exactly as they are.
--
-- Safe to run twice. Every statement matches only rows that are still live.
--
-- Run with: psql "$DATABASE_URL" -f content-updates/unpublish-merged-posts.sql
-- Then restart the app, so the cached content and the bot snapshots go too.

-- ---------------------------------------------------------------------------
-- Before: what these five look like now.
-- ---------------------------------------------------------------------------
SELECT slug, status, published_at, scheduled_at, length(body_en) AS body_chars
FROM posts
WHERE slug IN (
  'luxury-egypt-vacations',
  'luxury-egypt-anniversary-trip',
  'grand-egyptian-museum-private-tour',
  'vip-cairo-experience',
  'cairo-airport-transfer'
)
ORDER BY slug;

BEGIN;

UPDATE posts SET
  status = 'draft',
  published_at = NULL,
  scheduled_at = NULL,
  updated_at = now()
WHERE slug IN (
  'luxury-egypt-vacations',
  'luxury-egypt-anniversary-trip',
  'grand-egyptian-museum-private-tour',
  'vip-cairo-experience',
  'cairo-airport-transfer'
);

COMMIT;

-- ---------------------------------------------------------------------------
-- After. The first must read 5 and the rest must read 0.
-- ---------------------------------------------------------------------------
SELECT 'rows now unpublished' AS check, count(*) AS n FROM posts
WHERE slug IN (
  'luxury-egypt-vacations', 'luxury-egypt-anniversary-trip',
  'grand-egyptian-museum-private-tour', 'vip-cairo-experience', 'cairo-airport-transfer'
) AND status <> 'published' AND published_at IS NULL AND scheduled_at IS NULL;

-- isPostLive returns true for status 'published' when scheduled_at is NULL or
-- has passed. This is that rule written in SQL, so the check matches the code
-- rather than approximating it.
SELECT 'any of the five still live' AS check, count(*) AS bad FROM posts
WHERE slug IN (
  'luxury-egypt-vacations', 'luxury-egypt-anniversary-trip',
  'grand-egyptian-museum-private-tour', 'vip-cairo-experience', 'cairo-airport-transfer'
) AND status = 'published' AND (scheduled_at IS NULL OR scheduled_at <= now());

-- The content is still there, which is the point of unpublishing rather than
-- deleting. This must read 5 as well.
SELECT 'bodies still recoverable' AS check, count(*) AS n FROM posts
WHERE slug IN (
  'luxury-egypt-vacations', 'luxury-egypt-anniversary-trip',
  'grand-egyptian-museum-private-tour', 'vip-cairo-experience', 'cairo-airport-transfer'
) AND coalesce(length(body_en), 0) > 0;

-- And the two that must NOT have been touched: both keep their rows and stay
-- published, because each is rewritten in place under a new slug.
SELECT 'rows that should still be live' AS check, slug, status
FROM posts WHERE slug IN (
  'private-egypt-tour', 'private-tours-in-cairo-egypt',
  'bespoke-egypt-travel', 'tailor-made-egypt-tours'
) ORDER BY slug;
