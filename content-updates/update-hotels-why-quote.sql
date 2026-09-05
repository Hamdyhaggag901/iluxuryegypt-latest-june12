-- Shortens why_we_chose_quote to 15-20 words for the 6 hotels inserted in
-- content-updates/insert-cairo-aswan-hotels.sql. The long-form "Why We
-- Chose This Hotel" reasoning stays intact inside article's own <h2>Why We
-- Chose This Hotel</h2> section -- this UPDATE only replaces the separate
-- why_we_chose_quote field, which needed to be a short 1-2 sentence line
-- for its own UI element rather than a full paragraph.
--
-- Run with: psql "$DATABASE_URL" -f content-updates/update-hotels-why-quote.sql

BEGIN;

UPDATE hotels SET why_we_chose_quote = 'A design-forward Heliopolis stay minutes from the airport, blending Art Deco style with an authentically Egyptian spa tradition.', updated_at = now()
WHERE slug = 'waldorf-astoria-cairo-heliopolis';

UPDATE hotels SET why_we_chose_quote = 'A grand, French-inflected Nile Corniche hotel with 615 balcony rooms and serious event space in central Cairo.', updated_at = now()
WHERE slug = 'sofitel-cairo-downtown-nile';

UPDATE hotels SET why_we_chose_quote = 'A boutique, under-200-room Kempinski in Garden City, steps from the Egyptian Museum on the Nile.', updated_at = now()
WHERE slug = 'kempinski-nile-hotel-cairo';

UPDATE hotels SET why_we_chose_quote = 'A genuine 19th-century royal palace on Zamalek, with six acres of Nile-front gardens and named historic rooms.', updated_at = now()
WHERE slug = 'cairo-marriott-hotel';

UPDATE hotels SET why_we_chose_quote = 'The hotel behind Agatha Christie''s Death on the Nile -- a documented, century-old Moorish landmark above Aswan.', updated_at = now()
WHERE slug = 'old-cataract-aswan';

UPDATE hotels SET why_we_chose_quote = 'A true island resort surrounded by the Nile, minutes by boat from central Aswan''s museums and souk.', updated_at = now()
WHERE slug = 'movenpick-aswan';

-- Review the output above (row counts, any 0-row UPDATE means a slug
-- mismatch, e.g. the INSERT above hasn't been run on this database yet)
-- before committing.
COMMIT;
