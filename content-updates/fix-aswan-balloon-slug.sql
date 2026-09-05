-- Fixes the duplicate-slug issue found in the Aswan tour list: two
-- different tours both had slug 'private-abu-simbel-day-trip-aswan' —
-- "Private Abu Simbel Day Trip from Aswan by Vehicle" (id 4444d2e8-ed6a-4626-bc3c-bd0608856603,
-- keeps the original slug) and "Private Hot Air Balloon Over Aswan at
-- Sunrise" (id df3041dd-48c3-42f2-98d9-7dd78460b39c, gets the new slug below).
--
-- Targets by id, not the old slug, so this can't accidentally match the
-- wrong row even though both currently share the same slug value.
--
-- Run with: psql "$DATABASE_URL" -f content-updates/fix-aswan-balloon-slug.sql

BEGIN;

UPDATE tours
SET slug = 'private-hot-air-balloon-aswan-sunrise', updated_at = now()
WHERE id = 'df3041dd-48c3-42f2-98d9-7dd78460b39c';

COMMIT;
