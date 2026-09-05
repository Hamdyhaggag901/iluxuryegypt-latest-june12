-- Fills the previously-empty SEO fields for Sofitel Cairo Nile El
-- Gezirah (sofitel-cairo-nile-el-gezirah), extracted directly from its
-- existing article's first two sections ("A Refined Nile-Side Luxury
-- Stay in Cairo" + "Why Stay at Sofitel Cairo Nile El Gezirah?").
-- article and facilities (8 items, no mismatches found) are untouched.
-- focus_keyword was already correct and is unchanged.
--
-- IMPORTANT: this hotel has real photos already live (confirmed by the
-- user before this file was written) -- image, gallery, and gallery_alt
-- are intentionally NOT touched anywhere in this file.
--
-- Run with: psql "$DATABASE_URL" -f content-updates/update-sofitel-cairo-nile-el-gezirah.sql

BEGIN;

UPDATE hotels SET
  full_description = 'Sofitel Cairo Nile El Gezirah offers a distinctive way to experience Egypt''s capital, combining a prime Nile-side setting on Gezira Island with the elegance and character associated with the Sofitel brand. For luxury travelers, the attraction is more than its five-star positioning — the hotel provides a comfortable base between Cairo''s major cultural attractions, with the Nile forming an ever-present part of the experience. Its location on Gezira makes it particularly appealing to travelers who want to experience Cairo from the river while remaining close to Downtown Cairo, Zamalek and many of the city''s cultural highlights.

Choosing the right Cairo hotel can significantly influence the rhythm of an Egypt journey, and a well-positioned property allows travelers to explore during the day while returning to an environment that feels calm and refined in the evening. Sofitel Cairo Nile El Gezirah provides exactly that balance, combining a central location with the atmosphere of a Nile-side retreat. The hotel sits on Gezira Island, a distinctive part of Cairo surrounded by the Nile, giving guests convenient access to several of the city''s most interesting neighborhoods while offering a different perspective from hotels located directly in Downtown Cairo or around Giza.

The Nile itself is central to that experience. Depending on the accommodation selected, guests can enjoy views toward the river and Cairo''s changing skyline, with morning light over the water and the city''s illuminated skyline after sunset creating two very different moods from the same setting. What follows covers the hotel''s rooms, dining, wellness facilities, and how it compares with Cairo''s other leading Nile-side hotels.',
  seo_title = 'Sofitel Cairo Nile El Gezirah | Luxury Nile Hotel',
  meta_description = 'Sofitel Cairo Nile El Gezirah: a five-star hotel on Gezira Island with Nile views, elegant rooms, fine dining, and easy access to Zamalek and central Cairo.',
  canonical_url = 'https://iluxuryegypt.com/hotel/sofitel-cairo-nile-el-gezirah',
  robots = 'index, follow',
  schema_type = 'Hotel',
  updated_at = now()
WHERE slug = 'sofitel-cairo-nile-el-gezirah';

-- Review the output above (row count, any 0-row UPDATE means a slug
-- mismatch) before committing.
COMMIT;
