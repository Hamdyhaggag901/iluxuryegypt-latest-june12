-- Focus keyword, meta description, hero image alt and title for the six
-- honeymoon and spiritual tours, and for their two categories.
--
--   psql "$DATABASE_URL" -f content-updates/category-keywords.sql
--
-- The eight phrases come from search volume data and are deliberately all
-- different so the eight pages cannot compete with one another. None of them is
-- a substring of another. They are written here exactly as given.
--
-- TITLES ARE ONLY REWRITTEN WHEN THE PHRASE IS MISSING
-- Each title assignment is a CASE that leaves the existing title alone when it
-- already carries the focus phrase, and replaces it only when it does not. That
-- is what the brief asks for, and it also makes the file a no-op on a second
-- run whichever branch it took the first time.
--
-- Categories are matched BY NAME, not by slug, because the brief identifies
-- them that way and this file does not know their slugs.
--
-- No slug is changed anywhere in this file.
--
-- Dollar quoting on every text value.

\set ON_ERROR_STOP on

BEGIN;

DO $GUARD$
DECLARE
  missing text;
BEGIN
  SELECT string_agg(s, $D$, $D$) INTO missing FROM (
    SELECT s FROM unnest(ARRAY[
      $D$all-inclusive-romantic-vacations-egypt-honeymoon$D$,
      $D$luxury-egypt-honeymoon$D$,
      $D$egypt-honeymoon-couples$D$,
      $D$white-desert-luxury-camping$D$,
      $D$10-day-spiritual-egypt$D$,
      $D$private-spiritual-tours-egypt-14-days-sacred-journey$D$
    ]) AS s
    WHERE NOT EXISTS (SELECT 1 FROM tours WHERE tours.slug = s)
  ) x;
  IF missing IS NOT NULL THEN
    RAISE EXCEPTION $D$tours not found: %$D$, missing;
  END IF;

  SELECT string_agg(n, $D$, $D$) INTO missing FROM (
    SELECT n FROM unnest(ARRAY[      $D$Luxury Honeymoon Egypt$D$,
      $D$Spiritual Journeys Egypt$D$
    ]) AS n
    WHERE NOT EXISTS (SELECT 1 FROM categories WHERE categories.name = n)
  ) y;
  IF missing IS NOT NULL THEN
    RAISE EXCEPTION $D$categories not found by name: %$D$, missing;
  END IF;
END
$GUARD$;

UPDATE tours SET
  focus_keyword    = $D$honeymoon package in egypt$D$,
  meta_description = $D$A honeymoon package in egypt built for seven days: the Giza plateau, a day at Karnak in Luxor, and then four nights on the Red Sea coast at Sahl Hasheesh.$D$,
  hero_image_alt   = $D$Honeymoon package in egypt: a couple on the Red Sea shore at Sahl Hasheesh at sunset$D$,
  title            = CASE WHEN lower(title) LIKE $D$%honeymoon package in egypt%$D$ THEN title ELSE $D$Honeymoon Package in Egypt: Seven Days from Giza to the Red Sea$D$ END
WHERE slug = $D$all-inclusive-romantic-vacations-egypt-honeymoon$D$;
UPDATE tours SET
  focus_keyword    = $D$luxury honeymoon in egypt$D$,
  meta_description = $D$A luxury honeymoon in egypt across nine days, from the Giza plateau and the Grand Egyptian Museum to Aswan, and then the Nile by boat all the way to Luxor.$D$,
  hero_image_alt   = $D$Luxury honeymoon in egypt: the sun deck of a Nile boat between Aswan and Luxor$D$,
  title            = CASE WHEN lower(title) LIKE $D$%luxury honeymoon in egypt%$D$ THEN title ELSE $D$Luxury Honeymoon in Egypt: Nine Days on the Nile$D$ END
WHERE slug = $D$luxury-egypt-honeymoon$D$;
UPDATE tours SET
  focus_keyword    = $D$egypt honeymoon tours$D$,
  meta_description = $D$Egypt honeymoon tours across ten days: Giza and Saqqara, then Aswan and Abu Simbel, the Luxor west bank, and the Mediterranean coast up at Alexandria.$D$,
  hero_image_alt   = $D$Egypt honeymoon tours: the Mediterranean corniche at Alexandria in the evening$D$,
  title            = CASE WHEN lower(title) LIKE $D$%egypt honeymoon tours%$D$ THEN title ELSE $D$Egypt Honeymoon Tours: Ten Days from Giza to Alexandria$D$ END
WHERE slug = $D$egypt-honeymoon-couples$D$;
UPDATE tours SET
  focus_keyword    = $D$white desert egypt$D$,
  meta_description = $D$White desert egypt camping over eight days, from Bahariya and the Black Desert out to the chalk formations, Crystal Mountain and the oasis town of Farafra.$D$,
  hero_image_alt   = $D$White desert egypt: wind carved chalk formations standing on the sand at dusk$D$,
  title            = CASE WHEN lower(title) LIKE $D$%white desert egypt%$D$ THEN title ELSE $D$White Desert Egypt: Eight Days Camping in the Western Desert$D$ END
WHERE slug = $D$white-desert-luxury-camping$D$;
UPDATE tours SET
  focus_keyword    = $D$spiritual egypt$D$,
  meta_description = $D$A spiritual egypt itinerary of ten days built around temples: Giza and Saqqara, Dendera and Abydos, the Luxor west bank, and then Aswan and Philae island.$D$,
  hero_image_alt   = $D$Spiritual egypt: the painted ceiling of the Temple of Hathor at Dendera$D$,
  title            = CASE WHEN lower(title) LIKE $D$%spiritual egypt%$D$ THEN title ELSE $D$Spiritual Egypt: Ten Days of Temples from Giza to Philae$D$ END
WHERE slug = $D$10-day-spiritual-egypt$D$;
UPDATE tours SET
  focus_keyword    = $D$egypt spiritual retreat$D$,
  meta_description = $D$An egypt spiritual retreat of fourteen days: the Serapeum at Saqqara, the oracle at Siwa, the Osireion at Abydos, and then Philae island and Abu Simbel.$D$,
  hero_image_alt   = $D$Egypt spiritual retreat: the Osireion behind the Temple of Seti I at Abydos$D$,
  title            = CASE WHEN lower(title) LIKE $D$%egypt spiritual retreat%$D$ THEN title ELSE $D$Egypt Spiritual Retreat: Fourteen Days of Sacred Sites$D$ END
WHERE slug = $D$private-spiritual-tours-egypt-14-days-sacred-journey$D$;
UPDATE categories SET
  focus_keyword    = $D$egypt honeymoon packages$D$,
  meta_description = $D$Three egypt honeymoon packages that do not overlap: seven days ending on the Red Sea, nine days on the Nile by boat, or ten days running to Alexandria.$D$,
  seo_title        = CASE WHEN lower(coalesce(seo_title, $D$$D$)) LIKE $D$%egypt honeymoon packages%$D$ THEN seo_title ELSE $D$Egypt Honeymoon Packages: Three Private Itineraries$D$ END
WHERE name = $D$Luxury Honeymoon Egypt$D$;
UPDATE categories SET
  focus_keyword    = $D$egypt spiritual tours$D$,
  meta_description = $D$Egypt spiritual tours in three shapes: eight days camping in the White Desert, ten days of temples, or fourteen days of sacred sites that include Siwa.$D$,
  seo_title        = CASE WHEN lower(coalesce(seo_title, $D$$D$)) LIKE $D$%egypt spiritual tours%$D$ THEN seo_title ELSE $D$Egypt Spiritual Tours: Temples, Desert and Sacred Sites$D$ END
WHERE name = $D$Spiritual Journeys Egypt$D$;

DO $GUARD$
DECLARE
  bad text;
BEGIN
  -- Every phrase must end up in its own title and meta description, and the
  -- meta descriptions must all be 150 to 160 characters.
  SELECT string_agg(slug, $D$, $D$) INTO bad FROM tours
  WHERE focus_keyword IS NOT NULL
    AND slug IN ($D$all-inclusive-romantic-vacations-egypt-honeymoon$D$, $D$luxury-egypt-honeymoon$D$, $D$egypt-honeymoon-couples$D$, $D$white-desert-luxury-camping$D$, $D$10-day-spiritual-egypt$D$, $D$private-spiritual-tours-egypt-14-days-sacred-journey$D$)
    AND (position(lower(focus_keyword) in lower(title)) = 0
      OR position(lower(focus_keyword) in lower(meta_description)) = 0
      OR position(lower(focus_keyword) in lower(hero_image_alt)) = 0
      OR length(meta_description) NOT BETWEEN 150 AND 160);
  IF bad IS NOT NULL THEN
    RAISE EXCEPTION $D$focus phrase or meta length wrong on: %$D$, bad;
  END IF;

  SELECT string_agg(name, $D$, $D$) INTO bad FROM categories
  WHERE name IN ($D$Luxury Honeymoon Egypt$D$, $D$Spiritual Journeys Egypt$D$)
    AND (position(lower(focus_keyword) in lower(seo_title)) = 0
      OR position(lower(focus_keyword) in lower(meta_description)) = 0
      OR length(meta_description) NOT BETWEEN 150 AND 160);
  IF bad IS NOT NULL THEN
    RAISE EXCEPTION $D$focus phrase or meta length wrong on category: %$D$, bad;
  END IF;

  -- The eight phrases must stay distinct from one another.
  SELECT string_agg(k, $D$, $D$) INTO bad FROM (
    SELECT focus_keyword AS k FROM tours WHERE slug IN ($D$all-inclusive-romantic-vacations-egypt-honeymoon$D$, $D$luxury-egypt-honeymoon$D$, $D$egypt-honeymoon-couples$D$, $D$white-desert-luxury-camping$D$, $D$10-day-spiritual-egypt$D$, $D$private-spiritual-tours-egypt-14-days-sacred-journey$D$)
    UNION ALL
    SELECT focus_keyword FROM categories WHERE name IN ($D$Luxury Honeymoon Egypt$D$, $D$Spiritual Journeys Egypt$D$)
  ) z GROUP BY k HAVING count(*) > 1;
  IF bad IS NOT NULL THEN
    RAISE EXCEPTION $D$duplicate focus keyword: %$D$, bad;
  END IF;
END
$GUARD$;

COMMIT;

\echo
\echo category-keywords

SELECT slug AS page, focus_keyword, length(meta_description) AS meta_chars, title
FROM tours WHERE slug IN ($D$all-inclusive-romantic-vacations-egypt-honeymoon$D$, $D$luxury-egypt-honeymoon$D$, $D$egypt-honeymoon-couples$D$, $D$white-desert-luxury-camping$D$, $D$10-day-spiritual-egypt$D$, $D$private-spiritual-tours-egypt-14-days-sacred-journey$D$)
ORDER BY 1;

SELECT name AS page, focus_keyword, length(meta_description) AS meta_chars, seo_title
FROM categories WHERE name IN ($D$Luxury Honeymoon Egypt$D$, $D$Spiritual Journeys Egypt$D$)
ORDER BY 1;
