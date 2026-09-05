-- Fixes region/type/price_tier for the 6 hotels inserted in
-- content-updates/insert-cairo-aswan-hotels.sql so they match the
-- fixed dropdown values HotelForm.tsx actually expects (the original
-- INSERT used freeform values -- "Cairo", "Hotel", "Resort", "Luxury"
-- -- that don't exist in the form's enums, so the Region/Type/Price Tier
-- fields showed blank in the admin edit form even though the raw data
-- was present).
--
-- Confirmed valid values (client/src/components/HotelForm.tsx):
--   region:     "Cairo & Giza" | "Luxor" | "Aswan" | "Alexandria" |
--               "Red Sea" | "Sinai" | "Siwa Oasis" | "Western Desert"
--   type:       "Nile-view" | "Historic palace" | "Desert resort" |
--               "Nile cruise"
--   price_tier: "$" | "$$" | "$$$" | "$$$$" | "$$$$$"
--
-- Run with: psql "$DATABASE_URL" -f content-updates/update-hotels-enum-fields.sql

BEGIN;

UPDATE hotels SET region = 'Cairo & Giza', type = 'Nile-view', price_tier = '$$$$$', updated_at = now()
WHERE slug = 'waldorf-astoria-cairo-heliopolis';

UPDATE hotels SET region = 'Cairo & Giza', type = 'Nile-view', price_tier = '$$$$$', updated_at = now()
WHERE slug = 'sofitel-cairo-downtown-nile';

UPDATE hotels SET region = 'Cairo & Giza', type = 'Nile-view', price_tier = '$$$$$', updated_at = now()
WHERE slug = 'kempinski-nile-hotel-cairo';

UPDATE hotels SET region = 'Cairo & Giza', type = 'Historic palace', price_tier = '$$$$$', updated_at = now()
WHERE slug = 'cairo-marriott-hotel';

UPDATE hotels SET region = 'Aswan', type = 'Historic palace', price_tier = '$$$$$', updated_at = now()
WHERE slug = 'old-cataract-aswan';

UPDATE hotels SET region = 'Aswan', type = 'Nile-view', price_tier = '$$$$$', updated_at = now()
WHERE slug = 'movenpick-aswan';

-- Review the output above (row counts, any 0-row UPDATE means a slug
-- mismatch, i.e. the INSERT above hasn't been run on this database yet)
-- before committing.
COMMIT;
