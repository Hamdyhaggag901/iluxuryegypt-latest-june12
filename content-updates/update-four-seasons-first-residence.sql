-- Fills the previously-empty SEO fields for Four Seasons Hotel Cairo at
-- The First Residence (four-seasons-first-residence-cairo), extracted
-- directly from its existing article's first two sections ("A Refined
-- Luxury Stay Between Cairo and Giza" + "A Prime Location for Exploring
-- Cairo and Giza"). article and facilities (8 items, no mismatches
-- found this time) are untouched. focus_keyword is unchanged --
-- confirmed already correct as "Four Seasons Hotel Cairo at The First
-- Residence", appearing at word #1 of the article's opening paragraph.
--
-- Run with: psql "$DATABASE_URL" -f content-updates/update-four-seasons-first-residence.sql

BEGIN;

UPDATE hotels SET
  full_description = 'Four Seasons Hotel Cairo at The First Residence offers an elegant and private base for travelers who want to experience Cairo without sacrificing comfort, personalized service, or a sense of calm. Set in the First Residence complex in Giza, the hotel combines the understated sophistication of Four Seasons with convenient access to the city''s major cultural landmarks. For discerning travelers, its appeal goes beyond a five-star address: the hotel provides a polished environment where spacious accommodation, attentive service, fine dining, and a quieter atmosphere come together to create a genuinely more relaxed way to experience Egypt''s capital.

One of the hotel''s greatest advantages is its location. Staying at Four Seasons Hotel Cairo at The First Residence places travelers on the Giza side of the city while keeping central Cairo comfortably within easy reach, a positioning particularly convenient for an itinerary that combines Cairo''s historic attractions with the Pyramids of Giza. Guests can explore the Egyptian Museum, historic Cairo, Khan El Khalili, and other cultural highlights before returning to the comfort and privacy of the hotel each evening.

For travelers planning a private Egypt itinerary, this location also makes it considerably easier to combine a relaxed Cairo stay with visits to the Pyramids, Sphinx, and other major archaeological sites nearby, without the property itself feeling as immersed in the Giza Plateau as a hotel built directly beside the monuments. What follows covers the hotel''s rooms, dining, wellness facilities, and how it fits into a wider private Egypt journey around your own pace.',
  seo_title = 'Four Seasons Hotel Cairo at The First Residence | Giza',
  meta_description = 'Four Seasons Hotel Cairo at The First Residence: an elegant Giza-side hotel with spacious rooms, fine dining, and easy access to the Pyramids and Cairo.',
  canonical_url = 'https://iluxuryegypt.com/hotel/four-seasons-first-residence-cairo',
  robots = 'index, follow',
  schema_type = 'Hotel',
  updated_at = now()
WHERE slug = 'four-seasons-first-residence-cairo';

-- Review the output above (row count, any 0-row UPDATE means a slug
-- mismatch) before committing.
COMMIT;
