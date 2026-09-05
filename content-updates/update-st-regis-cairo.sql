-- Fills the previously-empty SEO fields for The St. Regis Cairo
-- (st-regis-cairo), extracted directly from its existing article's
-- first two sections ("St Regis Cairo: A Refined Luxury Hotel on the
-- Nile" + "Why Stay at The St. Regis Cairo?"). article is untouched.
-- focus_keyword is NOT changed -- confirmed already correct in the
-- database as "St Regis Cairo" (no period after "St"), appearing at
-- word #1 of the article's opening paragraph.
--
-- Also fixes a real data-quality bug found in facilities: one item read
-- {"icon":"spa","label":"Fairmont Spa"} -- "Fairmont Spa" is a different
-- hotel's (Fairmont Nile City) spa name, evidently copied in by mistake
-- during original data entry. Replaced with a generic "Spa & Wellness"
-- label until the real spa name is confirmed; the other 7 facilities
-- items are untouched.
--
-- Run with: psql "$DATABASE_URL" -f content-updates/update-st-regis-cairo.sql

BEGIN;

UPDATE hotels SET
  full_description = 'St Regis Cairo brings a refined, contemporary five-star stay to a Nile-front address in the heart of Egypt''s capital. Set along the river in central Cairo, The St. Regis Cairo pairs the brand''s distinctive hospitality traditions with a setting that lets guests experience the city''s historic attractions by day and return to an elegant, highly personalized environment each evening. For HNW travelers, the appeal goes beyond the room itself: it is a polished base for discovering Cairo, with the Nile, private service and carefully curated experiences all forming part of the stay.

The hotel''s location is central to that experience. Sitting directly on the Nile, it offers a different perspective on Cairo than properties near Giza or deeper within the city, with the river providing a constantly changing backdrop from the soft light of early morning to the illuminated Cairo skyline after sunset. For travelers who treat location as part of the hotel experience itself, this riverfront setting is one of the property''s defining advantages over hotels set further from the water.

That setting is matched by the brand''s own character. The St. Regis name is associated with personalized hospitality, elegant surroundings and distinctive service traditions, and at The St. Regis Cairo those elements are combined with a distinctly Egyptian sense of place — a hotel experience that feels international in its standards while staying genuinely connected to the energy of the city. What follows covers the hotel''s rooms, dining, wellness facilities, and how it compares with Cairo''s other leading luxury addresses.',
  seo_title = 'St Regis Cairo | Luxury Nile-Front Hotel',
  meta_description = 'St Regis Cairo: a refined five-star hotel on the Nile in central Cairo, with elegant rooms, personal butler service, and dining overlooking the river.',
  canonical_url = 'https://iluxuryegypt.com/hotel/st-regis-cairo',
  robots = 'index, follow',
  schema_type = 'Hotel',
  facilities = (
    SELECT jsonb_agg(
      CASE
        WHEN item->>'label' = 'Fairmont Spa' THEN jsonb_set(item, '{label}', '"Spa & Wellness"')
        ELSE item
      END
    )
    FROM jsonb_array_elements(facilities) AS item
  ),
  updated_at = now()
WHERE slug = 'st-regis-cairo';

-- Review the output above (row count, any 0-row UPDATE means a slug
-- mismatch) before committing.
COMMIT;
