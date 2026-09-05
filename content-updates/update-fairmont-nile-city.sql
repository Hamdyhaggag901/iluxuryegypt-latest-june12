-- Fills the previously-empty SEO fields for Fairmont Nile City
-- (fairmont-nile-city), extracted directly from its existing article's
-- first two sections ("A Contemporary Luxury Stay on the Nile in Cairo"
-- + "Why Stay at Fairmont Nile City?"). article and facilities (7
-- items, left as-is per instruction) are untouched. focus_keyword was
-- already correct and is unchanged.
--
-- Last of the 8 pre-existing /stay hotels covered in this pass
-- (Le Meridien Cairo Airport was deleted separately, out of scope here).
--
-- Run with: psql "$DATABASE_URL" -f content-updates/update-fairmont-nile-city.sql

BEGIN;

UPDATE hotels SET
  full_description = 'Fairmont Nile City offers a polished five-star experience for travelers looking to combine contemporary luxury with one of Cairo''s most defining settings: the Nile. Located on the river in the heart of Cairo, the hotel provides an elegant base for discovering the Egyptian capital while giving guests the comfort and convenience expected from a luxury international hotel. For discerning travelers, its appeal lies in the combination of Nile views, sophisticated accommodation, dining, leisure facilities and convenient access to Cairo''s major attractions and historic landmarks.

A luxury hotel in Cairo should do more than simply provide a comfortable room — it should make the city easier to experience. Fairmont Nile City works particularly well for travelers who want to explore Cairo during the day and return to a refined, modern environment in the evening, with its Nile-side location creating a strong sense of place as the river and Cairo skyline become part of the overall stay. The hotel is positioned directly on the Nile, offering convenient access to Downtown Cairo, Zamalek, the Egyptian Museum and other cultural attractions while maintaining a comfortable, relaxed base along the river throughout the trip.

The Nile itself is central to that experience. For guests selecting Nile-facing accommodation, the changing atmosphere of Cairo becomes part of the daily stay — from quiet mornings overlooking the water to the illuminated skyline after sunset each evening. What follows covers the hotel''s rooms, dining, wellness facilities, and how it compares with Cairo''s other leading Nile-side hotels for a private Egypt journey.',
  seo_title = 'Fairmont Nile City | Luxury Nile-Side Hotel',
  meta_description = 'Fairmont Nile City: a contemporary five-star hotel on the Nile in central Cairo, with elegant rooms, fine dining, and easy access to Cairo''s top sights.',
  canonical_url = 'https://iluxuryegypt.com/hotel/fairmont-nile-city',
  robots = 'index, follow',
  schema_type = 'Hotel',
  updated_at = now()
WHERE slug = 'fairmont-nile-city';

-- Review the output above (row count, any 0-row UPDATE means a slug
-- mismatch) before committing.
COMMIT;
