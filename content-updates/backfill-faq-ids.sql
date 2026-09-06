-- Backfills a missing "id" key onto every entry of destinations.faqs that
-- doesn't already have one. The Zod schema for FAQ entries (shared/schema.ts,
-- faqSchema) requires a non-optional string id; entries written directly via
-- earlier content-update SQL scripts (update-cairo-destination.sql,
-- update-luxor-destination.sql) omitted it. That silently failed
-- react-hook-form's zodResolver validation on the admin "Update Destination"
-- button with no visible error, blocking every future save for those rows.
-- Written generically (all destinations, not just Cairo/Luxor) so it also
-- repairs any other row with the same issue, present or future.
BEGIN;

UPDATE destinations
SET faqs = (
  SELECT jsonb_agg(
    CASE
      WHEN entry ? 'id' THEN entry
      ELSE entry || jsonb_build_object('id', gen_random_uuid()::text)
    END
  )
  FROM jsonb_array_elements(faqs) AS entry
)
WHERE faqs IS NOT NULL
  AND jsonb_typeof(faqs) = 'array'
  AND jsonb_array_length(faqs) > 0
  AND EXISTS (
    SELECT 1 FROM jsonb_array_elements(faqs) AS entry WHERE NOT (entry ? 'id')
  );

-- Same class of bug, different field: insertDestinationSchema caps seoTitle
-- at 60 characters (shared/schema.ts), but Luxor's was written at 66 by an
-- earlier content-update script in this same project. That silently failed
-- validation the same way, blocking every save on this row regardless of
-- the faqs fix above.
UPDATE destinations
SET seo_title = 'Luxury Luxor Tours | Ancient Thebes Travel – iLuxury Egypt'
WHERE slug = 'luxor' AND length(seo_title) > 60;

COMMIT;
