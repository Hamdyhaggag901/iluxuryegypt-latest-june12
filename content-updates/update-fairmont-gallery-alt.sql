-- Fairmont Nile City (slug: fairmont-nile-city) — gallery_alt was empty
-- ({}) despite the gallery holding 14 photos. hotels.gallery_alt is jsonb,
-- keyed by the gallery image's own URL (see shared/schema.ts), not a plain
-- array — so this maps each URL to alt text by its position in the
-- existing `gallery` array (unnest ... WITH ORDINALITY on both sides,
-- joined by that position) rather than hardcoding URLs, which keeps this
-- correct regardless of what the real stored URLs are. If gallery ever has
-- fewer than 14 photos, the extra alt text entries are simply not matched;
-- any photo beyond 14 keeps falling back to auto-generated alt text, same
-- as before (see the column's own comment in shared/schema.ts).
--
-- Alt text is generic (couldn't view the actual 14 photos), following the
-- typical luxury hotel gallery order — exterior, rooms, lobby, suite,
-- pool, restaurant, bathroom, view, spa, bar, gym, corridor, event space,
-- evening exterior — each including "Fairmont Nile City" as a keyword.
UPDATE hotels
SET gallery_alt = (
  SELECT jsonb_object_agg(g.url, a.alt_text)
  FROM unnest(hotels.gallery) WITH ORDINALITY AS g(url, ord)
  JOIN unnest(ARRAY[
    'Fairmont Nile City hotel exterior view along the Nile',
    'Luxury guest room at Fairmont Nile City with Nile views',
    'Fairmont Nile City hotel lobby with elegant interior design',
    'Spacious suite bedroom at Fairmont Nile City',
    'Fairmont Nile City rooftop swimming pool overlooking Cairo',
    'Fine dining restaurant at Fairmont Nile City',
    'Fairmont Nile City hotel bathroom with modern fixtures',
    'Panoramic Nile view from a room at Fairmont Nile City',
    'Fairmont Nile City spa and wellness facilities',
    'Elegant bar and lounge area at Fairmont Nile City',
    'Fairmont Nile City fitness center overlooking the Nile',
    'Hotel corridor and interior design at Fairmont Nile City',
    'Event space and ballroom at Fairmont Nile City',
    'Evening view of Fairmont Nile City illuminated at sunset'
  ]) WITH ORDINALITY AS a(alt_text, ord) ON g.ord = a.ord
)
WHERE slug = 'fairmont-nile-city';
