-- Two things in one file:
--
-- 1. Fills the previously-empty SEO fields for Marriott Mena House, Cairo
--    (mena-house-hotel-egypt), extracted directly from its existing
--    article -- facilities (7 items) and article are untouched, exactly
--    as agreed.
--
-- 2. Fixes canonical_url for the 6 hotels inserted today
--    (content-updates/insert-cairo-aswan-hotels.sql), which were wrongly
--    built from the "/stay" nav-button label instead of the real route.
--    Confirmed directly in client/src/App.tsx: "/stay" is the listing
--    page, "/hotel/:slug" is the actual hotel detail route -- so
--    canonical_url must be https://iluxuryegypt.com/hotel/<slug>, not
--    /stay/<slug>.
--
-- Run with: psql "$DATABASE_URL" -f content-updates/update-mena-house-and-canonical-fix.sql

BEGIN;

-- ============================================================
-- 1. Marriott Mena House, Cairo -- fill empty SEO fields
-- ============================================================
UPDATE hotels SET
  full_description = 'Marriott Mena House, Cairo is one of Egypt''s most distinctive luxury hotels, set at the foot of the Giza Plateau within sight of the Great Pyramids and the Great Sphinx. Rather than simply offering a place to stay near Egypt''s most famous monuments, Mena House folds that landscape directly into the guest experience — a rare quality among five-star properties in Cairo. For travelers researching a Mena House Hotel Egypt stay, the appeal extends well beyond the hotel''s own walls: it is the chance to make one of the world''s most extraordinary archaeological sites part of daily life during a trip, rather than just a few hours on a busy sightseeing itinerary.

The hotel''s greatest advantage is its location on Pyramids Road in Giza, which gives guests a natural base for exploring the Plateau and its surrounding sites without the long cross-city transfers other Cairo hotels require. A private morning with an expert Egyptologist can be followed by a relaxed return to the hotel for lunch, wellness, or an afternoon by the pool — a flexibility that matters for travelers building a private, unhurried Egypt itinerary.

Beyond logistics, Mena House offers something harder to manufacture: a genuine historic sense of place. The property blends that character with the standards expected of an international five-star hotel, creating an atmosphere distinctly tied to Giza rather than a generic luxury interior that could belong anywhere in the world. What follows covers the hotel''s rooms, dining, spa and wellness facilities, and how it fits into a wider private Egypt journey.',
  seo_title = 'Mena House Hotel Egypt | Luxury Stay by the Pyramids',
  meta_description = 'Marriott Mena House, Cairo: a five-star hotel at the foot of the Giza Plateau with Pyramid views, elegant rooms, and fine dining minutes from the Sphinx.',
  focus_keyword = 'Mena House Hotel Egypt',
  canonical_url = 'https://iluxuryegypt.com/hotel/mena-house-hotel-egypt',
  robots = 'index, follow',
  schema_type = 'Hotel',
  updated_at = now()
WHERE slug = 'mena-house-hotel-egypt';

-- ============================================================
-- 2. Canonical URL fix for the 6 hotels inserted today
-- ============================================================
UPDATE hotels SET canonical_url = 'https://iluxuryegypt.com/hotel/' || slug, updated_at = now()
WHERE slug IN (
  'waldorf-astoria-cairo-heliopolis',
  'sofitel-cairo-downtown-nile',
  'kempinski-nile-hotel-cairo',
  'cairo-marriott-hotel',
  'old-cataract-aswan',
  'movenpick-aswan'
);

-- Review the output above (row counts, any 0-row UPDATE means a slug
-- mismatch) before committing.
COMMIT;
