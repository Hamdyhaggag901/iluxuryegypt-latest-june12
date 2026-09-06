-- Full content refresh for the Hurghada destination (slug: hurghada):
-- description, SEO fields, a new 5-question faqs array (fewer than the
-- 10 used for Cairo/Luxor/Aswan since Hurghada, a Red Sea resort city,
-- has far fewer cultural landmarks to cover), and a full 3-entry
-- attractions array.
--
-- attractions IS replaced wholesale here, unlike Alexandria's migration:
-- confirmed directly with the site owner that these 3 entries
-- (El Mina Mosque, El Dahar, Hurghada Museum) are Hurghada's complete
-- attractions list, not a subset of a larger existing array.
--
-- None of the 3 photos are a dedicated match for their site (no real
-- photo of El Mina Mosque, El Dahar, or Hurghada Museum exists in the
-- media library yet) -- 2 are Hurghada coastline drone shots used as
-- the closest available placeholders, and 1 reuses a Cairo mosque photo
-- for a museum/heritage feel. All 3 should be swapped for real photos
-- via the admin's "Suggest Photo" flow once available.
--
-- Run with: psql "$DATABASE_URL" -f content-updates/update-hurghada-destination.sql

BEGIN;

UPDATE destinations SET
  description = 'Hurghada sits along Egypt''s Red Sea coast, better known for coral reefs and diving than ancient monuments. Yet the city holds a handful of cultural landmarks worth a detour from the beach, from a striking mosque overlooking the marina to the narrow lanes of its original old town. A luxury Hurghada tour can pair Red Sea relaxation with a compact dose of Egyptian heritage, including a small museum of ancient artifacts. For travelers combining Cairo or Luxor with coastal downtime, Hurghada offers a different, more laid back side of Egypt.',
  seo_title = 'Luxury Hurghada Tours | Red Sea Egypt - iLuxury Egypt',
  meta_description = 'Combine Red Sea relaxation with Egyptian heritage on a luxury Hurghada tour — historic mosques, old town charm, and coastal comfort.',
  focus_keyword = 'luxury Hurghada tours',
  attractions = $attr$[
    {"id": "24da9f34-a8ed-4ec5-af0b-55e99bdd8de9", "name": "El Mina Mosque", "image": "https://iluxuryegypt.com/api/assets/uploads/e0b5a45b-f70e-4c81-9684-3ef2be0f9ddf.webp", "imageAlt": "El Mina Mosque twin minarets overlooking Hurghada marina", "description": "El Mina Mosque, Hurghada's largest and most photographed Islamic landmark, rises above the marina with twin minarets and a striking white facade overlooking the Red Sea, a favorite stop for visitors."},
    {"id": "0b64f90d-5455-4645-8ef5-046fa66ae6a4", "name": "El Dahar (Old Hurghada)", "image": "https://iluxuryegypt.com/api/assets/uploads/be153ebc-8259-42d6-8091-f59dc0320161.webp", "imageAlt": "El Dahar old town narrow lanes in Hurghada", "description": "El Dahar, Hurghada's original old town, preserves narrow lanes, traditional coffeehouses, and a working local market that predates the city's growth into a Red Sea resort hub, offering a quieter glimpse of daily life."},
    {"id": "02e47cb8-d94d-4cea-ae93-8747651270b7", "name": "Hurghada Museum", "image": "https://iluxuryegypt.com/api/assets/uploads/499755c6-cefe-458c-a862-97b3c0fbf144.webp", "imageAlt": "Ancient Egyptian artifacts displayed at Hurghada Museum", "description": "The Hurghada Museum displays ancient Egyptian artifacts and royal statuary within a modern gallery space, offering a compact cultural counterpoint to the city's marine attractions and a worthwhile stop for history minded travelers."}
  ]$attr$::jsonb,
  faqs = $faqs$[
    {"id": "269a690c-d811-4d1c-8c47-dd976289d4f9", "question": "Are there historical sites in Hurghada?", "answer": "Hurghada holds a handful of cultural landmarks, including El Mina Mosque and the old town of El Dahar, though the city is primarily known for its Red Sea coastline rather than ancient monuments."},
    {"id": "6582b03d-aa59-487b-b2a9-b1dd55fcc441", "question": "What is El Dahar in Hurghada?", "answer": "El Dahar is Hurghada's original old town, preserving narrow lanes, traditional coffeehouses, and a working local market that predates the city's growth into a major Red Sea resort destination in recent decades."},
    {"id": "af517153-5b1a-4134-8a8a-a238386e8c8e", "question": "Is Hurghada Museum worth visiting?", "answer": "Yes, it offers a compact collection of ancient Egyptian artifacts and royal statuary, providing a worthwhile cultural counterpoint for travelers spending most of their time at Hurghada's beaches and coral reefs."},
    {"id": "92a56c66-6ab4-4c7b-bcc7-a50799afc424", "question": "Can Hurghada be combined with Luxor or Cairo?", "answer": "Yes, many travelers pair a few days in Hurghada with cultural stops in Luxor or Cairo, balancing Red Sea relaxation with Egypt's ancient history on a single well planned itinerary."},
    {"id": "b4543a37-01ef-4c45-9f92-e85206e1a77e", "question": "What is El Mina Mosque known for?", "answer": "El Mina Mosque is Hurghada's largest and most photographed Islamic landmark, recognized for its twin minarets and striking white facade overlooking the marina and the wider Red Sea coastline beyond."}
  ]$faqs$::jsonb,
  updated_at = now()
WHERE slug = 'hurghada';

-- Review the output above (row count, any 0-row UPDATE means a slug
-- mismatch) before committing.
COMMIT;
