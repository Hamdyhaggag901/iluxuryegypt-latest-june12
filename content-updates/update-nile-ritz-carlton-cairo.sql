-- Fills the previously-empty SEO fields for The Nile Ritz-Carlton, Cairo
-- (nile-ritz-carlton-cairo), extracted directly from its existing
-- article's first two sections ("Nile Ritz Carlton: A Refined Five-Star
-- Stay in the Heart of Cairo" + "Why Stay at The Nile Ritz-Carlton,
-- Cairo?"). article is untouched.
--
-- Also corrects focus_keyword itself: the stored value was "The Nile
-- Ritz Carlton, Cairo" (missing the hyphen in "Ritz-Carlton"), which
-- doesn't match the real brand's correct spelling or the hyphenated form
-- used consistently throughout the hotel's own article. Corrected to
-- "The Nile Ritz-Carlton, Cairo"; seo_title and meta_description are
-- written with the same hyphenated spelling.
--
-- Also fixes a facilities icon mismatch: {"icon":"concierge","label":
-- "Private Airport Transfers"} -- concierge and airport transfers are
-- different services -- icon changed to "transfers"; label/count
-- unchanged.
--
-- Run with: psql "$DATABASE_URL" -f content-updates/update-nile-ritz-carlton-cairo.sql

BEGIN;

UPDATE hotels SET
  full_description = 'The Nile Ritz-Carlton, Cairo combines a prime central location with the polished service and elegance expected from one of Cairo''s leading five-star hotels. Set beside the Nile in the heart of downtown Cairo, the hotel places guests within easy reach of the city''s most important cultural landmarks, while offering a refined retreat to return to after a day of exploring the Egyptian capital. For a luxury Egypt journey, the appeal isn''t simply the hotel itself — it is the combination of Nile views, central access, sophisticated accommodation and effortless proximity to Cairo''s cultural experiences.

That central position is the hotel''s defining advantage. Cairo is a destination that rewards travelers who choose their base carefully, and a centrally located hotel makes it considerably easier to experience the city without spending unnecessary time crossing between distant neighborhoods. The Nile Ritz-Carlton''s position beside the river gives guests access to the Egyptian Museum and other major cultural attractions, with Downtown Cairo, historic neighborhoods and the Nile itself all forming part of the surrounding experience.

The river itself is part of that experience too. Selected rooms and suites look toward the Nile, and the atmosphere shifts throughout the day — from the calm of the river in the morning to the illuminated Cairo skyline after sunset. For travelers choosing a five-star hotel in Cairo, that sense of place matters as much as the room itself. What follows covers the hotel''s rooms, dining, wellness facilities, and how it compares with Cairo''s other leading Nile-side addresses in the capital.',
  seo_title = 'The Nile Ritz-Carlton, Cairo | Luxury Nile Hotel',
  meta_description = 'The Nile Ritz-Carlton, Cairo: a five-star hotel beside the Nile in downtown Cairo, with elegant rooms, fine dining, and easy access to the Egyptian Museum.',
  focus_keyword = 'The Nile Ritz-Carlton, Cairo',
  canonical_url = 'https://iluxuryegypt.com/hotel/nile-ritz-carlton-cairo',
  robots = 'index, follow',
  schema_type = 'Hotel',
  facilities = (
    SELECT jsonb_agg(
      CASE
        WHEN item->>'label' = 'Private Airport Transfers' THEN jsonb_set(item, '{icon}', '"transfers"')
        ELSE item
      END
    )
    FROM jsonb_array_elements(facilities) AS item
  ),
  updated_at = now()
WHERE slug = 'nile-ritz-carlton-cairo';

-- Review the output above (row count, any 0-row UPDATE means a slug
-- mismatch) before committing.
COMMIT;
