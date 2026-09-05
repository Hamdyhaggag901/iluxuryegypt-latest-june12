-- Fills the previously-empty SEO fields for Four Seasons Hotel Cairo at
-- Nile Plaza (four-seasons-nile-plaza), extracted directly from its
-- existing article's first two sections ("A Luxury Stay on the Nile" +
-- "Why Stay at Four Seasons Nile Plaza?"). article and its 8-item
-- facilities count are untouched -- only 2 of the 8 facility icons are
-- corrected to match their existing labels (icon didn't match label;
-- label/count unchanged):
--   {"icon":"breakfast","label":"Nile Views"}         -> icon "view"
--   {"icon":"transfers","label":"24-Hour Room Service"} -> icon "room-service"
--
-- focus_keyword is NOT changed here -- confirmed already correct in the
-- database as "Four Seasons Hotel Cairo at Nile Plaza" (the full name,
-- appearing at word #1 of the article's opening paragraph). seo_title
-- and meta_description below were rewritten to contain that exact
-- phrase, since the earlier draft used the shorter "Four Seasons Nile
-- Plaza" instead.
--
-- Run with: psql "$DATABASE_URL" -f content-updates/update-four-seasons-nile-plaza.sql

BEGIN;

UPDATE hotels SET
  full_description = 'Four Seasons Hotel Cairo at Nile Plaza brings the personalized service the Four Seasons name is known for to one of Cairo''s most elegant Nile-side addresses. Set in Garden City, one of central Cairo''s established residential and diplomatic neighborhoods, the hotel puts guests directly on the river while keeping many of the city''s most important cultural attractions within easy reach. For travelers who want to experience Cairo''s contrast of ancient history and contemporary luxury from an address that captures the city itself, Four Seasons Nile Plaza offers a genuinely different base than a hotel built around a single monument, one shaped by the river and the capital rather than by a single ancient site.

The hotel''s position along the Nile is central to that experience. It gives guests a central Cairo base while still offering a sense of calm and privacy on return from a day of sightseeing, letting a private itinerary connect the city''s ancient landmarks, museums, historic neighborhoods and contemporary dining without every day feeling like a long transfer across the city.

Where Mena House places the Pyramids at the center of the stay, Four Seasons Nile Plaza offers something different: Cairo''s skyline, the Nile and the energy of the capital itself become the backdrop. For travelers returning to Egypt for a second visit, or anyone who wants to experience more of the city than its ancient monuments, this is a particularly compelling choice. What follows covers the hotel''s rooms, dining, spa and wellness facilities, and how it fits into a wider private Egypt journey.',
  seo_title = 'Four Seasons Hotel Cairo at Nile Plaza | Luxury Stay',
  meta_description = 'Four Seasons Hotel Cairo at Nile Plaza: a Garden City hotel on the Nile with elegant rooms, fine dining, and easy access to Cairo''s top cultural sights.',
  canonical_url = 'https://iluxuryegypt.com/hotel/four-seasons-nile-plaza',
  robots = 'index, follow',
  schema_type = 'Hotel',
  facilities = (
    SELECT jsonb_agg(
      CASE
        WHEN item->>'label' = 'Nile Views' THEN jsonb_set(item, '{icon}', '"view"')
        WHEN item->>'label' = '24-Hour Room Service' THEN jsonb_set(item, '{icon}', '"room-service"')
        ELSE item
      END
    )
    FROM jsonb_array_elements(facilities) AS item
  ),
  updated_at = now()
WHERE slug = 'four-seasons-nile-plaza';

-- Review the output above (row count, any 0-row UPDATE means a slug
-- mismatch) before committing.
COMMIT;
