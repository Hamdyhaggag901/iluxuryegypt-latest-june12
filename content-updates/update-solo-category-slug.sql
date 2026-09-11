-- Rename the "Luxury Solo Egypt" category slug from egypt-solo-travel to
-- egypt-tours-for-solo-travellers, update its display name to match the new
-- H1 requirement, and refresh its on-page copy + SEO fields around the new
-- focus keyword "egypt tours for solo travellers".
--
-- categories.slug has no foreign key from any other table (verified against
-- shared/schema.ts). tours.category is a free-text column matched by exact
-- string equality (server/routes.ts), not a slug/id reference, so it must be
-- cascade-updated separately for the 3 tours currently filed under the old
-- category name "Luxury Solo Egypt".

BEGIN;

UPDATE categories
SET
  slug = 'egypt-tours-for-solo-travellers',
  name = 'Egypt Tours for Solo Travellers',
  description = 'Egypt tours for solo travellers combine complete independence with five-star comfort. Explore the Pyramids of Giza, cruise the Nile, and wander Luxor and Aswan''s temples with a private Egyptologist guide -- no groups, no fixed schedules, just an itinerary built entirely around your own pace and interests.',
  short_description = 'Egypt tours for solo travellers shaped entirely around your own pace, with private Egyptologist guides, five-star hotels, and quiet access to Egypt''s ancient wonders.',
  seo_title = 'Egypt Tours for Solo Travellers | Private Journeys',
  meta_description = 'Discover Egypt tours for solo travellers, private journeys with expert guides, quiet archaeological sites, and itineraries shaped around your own pace.',
  focus_keyword = 'egypt tours for solo travellers',
  updated_at = now()
WHERE slug = 'egypt-solo-travel';

-- Cascade the category rename onto the 3 tours currently filed under the old
-- category display name (tours.category is matched by exact string equality,
-- not by category id/slug).
UPDATE tours
SET
  category = 'Egypt Tours for Solo Travellers',
  updated_at = now()
WHERE slug IN (
  '7-day-solo-travel-egypt',
  '9-day-solo-egypt',
  'solo-vacation-packages-luxury-egypt-5-day-tour'
)
AND category = 'Luxury Solo Egypt';

COMMIT;
