-- Seeds the Speak to an Expert image keys into site_config.
--
--   psql "$DATABASE_URL" -f content-updates/seed-speak-expert-images.sql
--
-- No schema change. site_config already has key, value, type, updated_at and
-- updated_by, and key already carries a unique constraint, which is what makes
-- ON CONFLICT DO NOTHING work here.
--
-- Each key is seeded with the URL that was hardcoded in the component before
-- this became editable, so nothing changes visually after deploy. ON CONFLICT
-- DO NOTHING means running this again never overwrites a value an editor has
-- since changed in the CMS.
--
-- The same URLs live in shared/speak-expert-images.ts, which the modal uses as
-- its fallback and the admin settings page uses to label the fields. If you
-- change one, change the other.
--
-- NOTE ON THE KEY LIST: the modal is a single step form, so there is exactly
-- one image in the whole Speak to an Expert flow. There are no per step images
-- to seed. floating-speak-expert-button.tsx and call-to-action-section.tsx use
-- lucide icon components rather than image URLs, so they have nothing to make
-- editable. To add a key later, add it both here and to
-- shared/speak-expert-images.ts; the endpoint, the admin fields and the modal
-- all iterate that list and need no further change.

\set ON_ERROR_STOP on

BEGIN;

INSERT INTO site_config (key, value, type)
VALUES (
  'speak_expert_image_main',
  'https://iluxuryegypt.com/api/assets/uploads/ee366046-f7f3-4c54-a946-878414a60aa0.jpg',
  'image'
)
ON CONFLICT (key) DO NOTHING;

COMMIT;

\echo
\echo speak-expert-images

SELECT key, type, value
FROM site_config
WHERE key LIKE 'speak\_expert\_image\_%'
ORDER BY key;
