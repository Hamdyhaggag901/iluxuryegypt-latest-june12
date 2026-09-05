-- Comprehensive SEO/facilities review for the 6 hotels inserted in
-- content-updates/insert-cairo-aswan-hotels.sql.
--
-- What changed and why:
--   1. facilities: expanded from the original 4-7 items to 6-12 real
--      items per hotel, by splitting bundled content (e.g. "Hammam,
--      Jacuzzi, Steam Room" -> separate entries) rather than inventing
--      anything new.
--   2. meta_description: resized to exactly 150-160 characters for all
--      6 (measured with Python len(), not estimated) -- Sofitel and Old
--      Cataract were previously short, the rest were already in range
--      but re-verified here.
--   3. seo_title: Cairo Marriott's was 68 chars (over the ~60-char
--      guideline); shortened to 46 chars, still containing the focus
--      keyword "cairo marriott hotel" verbatim. The other 5 were already
--      46-56 chars and unchanged.
--   4. focus_keyword presence: verified the exact focus-keyword phrase
--      appears in each hotel's opening paragraph. 5 of 6 already did;
--      Movenpick's did not -- its full_description said "Movenpick
--      Resort Aswan" (with "Resort" breaking the phrase, and the
--      accented "o"), which doesn't literally contain "movenpick aswan".
--      Patched its opening paragraph to also introduce the property as
--      "Movenpick Aswan" (plain spelling) so the exact keyword phrase is
--      present, while keeping the branded "Mövenpick Resort Aswan" name
--      everywhere else.
--   5. canonical_url, robots, and schema_type were re-checked against
--      the original INSERT -- already correct (https://iluxuryegypt.com
--      /stay/<slug>, "index, follow", "Hotel") for all 6, so they are not
--      touched by this file.
--
-- Note: the schema has a single seo_title column, not separate "Meta
-- Title" and "SEO Title" fields -- what earlier summaries called "Meta
-- Title" is this same column, so there's no cross-field consistency to
-- reconcile beyond what's updated here.
--
-- Run with: psql "$DATABASE_URL" -f content-updates/update-hotels-seo-review.sql

BEGIN;

-- ============================================================
-- waldorf-astoria-cairo-heliopolis
-- ============================================================
UPDATE hotels SET
  facilities = '[{"icon":"spa","label":"Waldorf Astoria Spa"},{"icon":"droplet","label":"Hammam, Steam Room & Sauna"},{"icon":"dumbbell","label":"Technogym 24-Hour Fitness Center"},{"icon":"pool","label":"Outdoor Pool with Cabanas"},{"icon":"building","label":"Grand Ballroom (1,600 Guests)"},{"icon":"users","label":"6 Meeting Rooms + Boardroom"},{"icon":"star","label":"Rosetta Club Lounge Access"},{"icon":"utensils","label":"3 Restaurants & Bars"}]'::jsonb,
  meta_description = 'Waldorf Astoria Cairo Heliopolis: a 252-room Art Deco hotel with an Egyptian-inspired spa, 10 minutes from Cairo Airport. Rooms, dining, and location guide.',
  updated_at = now()
WHERE slug = 'waldorf-astoria-cairo-heliopolis';

-- ============================================================
-- sofitel-cairo-downtown-nile
-- ============================================================
UPDATE hotels SET
  facilities = '[{"icon":"spa","label":"Sofitel Spa (1,000 sqm)"},{"icon":"droplet","label":"Jacuzzi"},{"icon":"droplet","label":"Sauna"},{"icon":"pool","label":"Outdoor Pool (300 sqm) with Cabanas"},{"icon":"dumbbell","label":"Sofitel Fitness (Technogym)"},{"icon":"users","label":"18 Event Venues"},{"icon":"star","label":"Club Millésime (22nd Floor)"},{"icon":"utensils","label":"4 Restaurants & 2 Bars"}]'::jsonb,
  meta_description = 'Sofitel Cairo Downtown Nile: 615 balcony rooms, a 1,000 sqm spa, and four restaurants on the Nile Corniche in the heart of downtown Cairo, Egypt today.',
  updated_at = now()
WHERE slug = 'sofitel-cairo-downtown-nile';

-- ============================================================
-- kempinski-nile-hotel-cairo
-- ============================================================
UPDATE hotels SET
  facilities = '[{"icon":"spa","label":"Kempinski The Spa (5 Treatment Rooms)"},{"icon":"heart","label":"Spa Suite for Couples"},{"icon":"droplet","label":"Jacuzzi"},{"icon":"droplet","label":"Steam Room"},{"icon":"droplet","label":"Sauna"},{"icon":"pool","label":"Rooftop Pool"},{"icon":"users","label":"3 Private Meeting Rooms + Ballroom"},{"icon":"concierge-bell","label":"Butler Service"},{"icon":"utensils","label":"5 Restaurants & Bars"}]'::jsonb,
  meta_description = 'Kempinski Nile Hotel Cairo: a boutique 191-key hotel in Garden City with Nile-view suites, five restaurants, and a rooftop pool near the Egyptian Museum.',
  updated_at = now()
WHERE slug = 'kempinski-nile-hotel-cairo';

-- ============================================================
-- cairo-marriott-hotel
-- ============================================================
UPDATE hotels SET
  facilities = '[{"icon":"trees","label":"6-Acre Nile-Front Gardens"},{"icon":"pool","label":"Outdoor Pool"},{"icon":"dumbbell","label":"Fitness Center"},{"icon":"users","label":"Historic Event Rooms (Salon Royal, Eugenie, Verdi & More)"},{"icon":"dice","label":"Omar Khayyam Casino"},{"icon":"utensils","label":"Saraya Gallery & Billiard Bar"}]'::jsonb,
  meta_description = 'Cairo Marriott Hotel: a 19th-century royal palace on Zamalek island with six acres of Nile-front gardens, historic event rooms, and central Cairo access.',
  seo_title = 'Cairo Marriott Hotel | Historic Zamalek Palace',
  updated_at = now()
WHERE slug = 'cairo-marriott-hotel';

-- ============================================================
-- old-cataract-aswan
-- ============================================================
UPDATE hotels SET
  facilities = '[{"icon":"spa","label":"So SPA"},{"icon":"droplet","label":"Hammam"},{"icon":"droplet","label":"Jacuzzi"},{"icon":"pool","label":"Heated Indoor Pool (Adults Only)"},{"icon":"pool","label":"Olympic-Size Outdoor Pool with Cabanas"},{"icon":"users","label":"Kids Club"},{"icon":"briefcase","label":"Car Rental & Currency Exchange"},{"icon":"compass","label":"Nile Excursion Desk"}]'::jsonb,
  meta_description = 'Sofitel Legend Old Cataract Aswan: the 1899 Nile-side hotel behind Agatha Christie''s Death on the Nile, with Moorish architecture and riverside terraces.',
  updated_at = now()
WHERE slug = 'old-cataract-aswan';

-- ============================================================
-- movenpick-aswan
-- ============================================================
UPDATE hotels SET
  facilities = '[{"icon":"pool","label":"2 Outdoor Pools"},{"icon":"droplet","label":"Indoor Jacuzzi"},{"icon":"spa","label":"Spa with Steam Room & Sauna"},{"icon":"dumbbell","label":"Fully Equipped Gym"},{"icon":"users","label":"800+ sqm Event Space"},{"icon":"ship","label":"24-Hour Complimentary Boat Transfer"},{"icon":"leaf","label":"Bird-Watching Station & Organic Farm"},{"icon":"utensils","label":"4 Restaurants & 3 Bars"}]'::jsonb,
  meta_description = 'Movenpick Aswan: an island resort on the Nile''s Elephantine Island, with panoramic river views, ancient ruins, and Nubian villages steps from the hotel.',
  full_description = 'The Mövenpick Resort Aswan — widely known simply as Movenpick Aswan — occupies one of the most distinctive settings of any hotel on the Nile: the entirety of Elephantine Island''s southern tip, an islet in the middle of the river directly opposite central Aswan. Where the Old Cataract looks out at the island from the east bank, the Mövenpick sits inside that view — surrounded by the Nile on nearly every side, with the ancient ruins, Nubian villages, and the Aswan Museum sharing the same island a short walk to the north.

That island setting shapes the entire stay here. Guests reach the mainland by a short boat crossing included as part of the hotel''s own transfer service, and once on the island, the resort''s tower and gardens are positioned to take in views of the river, the granite hills of the west bank, and central Aswan''s skyline from nearly every angle. It is a genuinely different proposition from a riverside hotel on the mainland — closer, in feel, to a private island resort than to a conventional city-adjacent property, despite sitting only a few minutes by boat from downtown Aswan.

Originally opened in 1976, renovated in 2008, and expanded with the Elephantine Extension wing in 2016, the resort blends an established island layout with more recently built accommodation. This guide covers its rooms, dining, facilities, and island setting, along with what remains unconfirmed and worth checking before publishing specific claims.',
  updated_at = now()
WHERE slug = 'movenpick-aswan';

-- Review the output above (row counts, any 0-row UPDATE means a slug
-- mismatch) before committing.
COMMIT;
