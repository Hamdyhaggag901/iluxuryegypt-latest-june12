-- Full content refresh for the Siwa Oasis destination (slug: siwa-oasis):
-- description, SEO fields, a new 7-question faqs array, and a full
-- 7-entry attractions array.
--
-- Confirmed with the site owner these 7 entries are Siwa's complete
-- attractions list, so attractions is replaced wholesale (same approach
-- as Aswan/Hurghada, not the name-matched partial update used for
-- Alexandria).
--
-- No dedicated photo exists for any of the 7 sites yet: 4 (Temple of
-- the Oracle, Aghurmi Village, Temple of Umm Ubayda, Mountain of the
-- Dead) reuse a generic desert temple ruins photo, 2 (Shali Fortress,
-- Siwa House Museum) reuse a Cairo citadel/fortress photo, and 1
-- (Cleopatra's Bath) reuses a spring/lake photo. All 7 should be
-- swapped for real photos via the admin's "Suggest Photo" flow once
-- available, per the site owner's own note in this content review.
--
-- Run with: psql "$DATABASE_URL" -f content-updates/update-siwa-destination.sql

BEGIN;

UPDATE destinations SET
  description = 'Siwa Oasis lies deep in Egypt''s Western Desert, isolated for centuries by the Great Sand Sea and shaped by a distinct Berber culture found nowhere else in the country. Alexander the Great crossed the desert to consult its ancient Oracle Temple, and mudbrick ruins still rise from the oasis floor today. A luxury Siwa tour reveals fortress remains, sacred springs, and a slower rhythm of life built around date palms and olive groves. Remote and quiet, Siwa offers a side of Egypt entirely different from the Nile Valley or the Red Sea coast.',
  seo_title = 'Luxury Siwa Oasis Tours | Desert Egypt - iLuxury Egypt',
  meta_description = 'Discover Siwa Oasis on a luxury desert tour — the ancient Oracle Temple, Shali Fortress, and a Berber culture unlike anywhere else in Egypt.',
  focus_keyword = 'luxury Siwa Oasis tours',
  attractions = $attr$[
    {"id": "9a66ddb8-e5a8-41be-b51a-0cb56e45e41f", "name": "Temple of the Oracle", "image": "https://iluxuryegypt.com/api/assets/uploads/572026c0-f5dc-466b-9fa7-ee5a26162f12.webp", "imageAlt": "Temple of the Oracle ancient ruins at Siwa Oasis", "description": "The Temple of the Oracle at Siwa, built in the 6th century BC, drew Alexander the Great across the Sahara in 331 BC to confirm his divine destiny, remaining a highlight of any luxury Siwa tour."},
    {"id": "615032ec-4754-481f-a73f-a8130268f213", "name": "Aghurmi Village", "image": "https://iluxuryegypt.com/api/assets/uploads/572026c0-f5dc-466b-9fa7-ee5a26162f12.webp", "imageAlt": "Aghurmi Village mudbrick ruins at Siwa Oasis", "description": "Aghurmi Village, a fortified hilltop settlement predating the Oracle Temple, preserves mudbrick ruins where ancient Siwans once lived alongside the sacred sanctuary that later drew Alexander the Great across the desert."},
    {"id": "1f77c138-ae24-4e40-9f43-85bedb4c7117", "name": "Temple of Umm Ubayda", "image": "https://iluxuryegypt.com/api/assets/uploads/572026c0-f5dc-466b-9fa7-ee5a26162f12.webp", "imageAlt": "Temple of Umm Ubayda remaining wall at Siwa", "description": "The Temple of Umm Ubayda, a smaller Amun sanctuary near Aghurmi, once mirrored the Oracle Temple in scale before an 1897 explosion left only a single carved wall standing at this Siwa site."},
    {"id": "bbb406da-588d-4b03-97cd-f0d0b88dcf58", "name": "Shali Fortress", "image": "https://iluxuryegypt.com/api/assets/uploads/3aefb5f7-d98e-4600-a712-75f23bc8e849.webp", "imageAlt": "Shali Fortress mudbrick ruins in Siwa town", "description": "Shali Fortress rises from the center of Siwa town, built in the 13th century entirely from kershef, a local material of salt rock and mud, forming one of the oasis's most iconic landmarks."},
    {"id": "9734584e-38fa-403c-973d-86aa8dd12b05", "name": "Mountain of the Dead", "image": "https://iluxuryegypt.com/api/assets/uploads/572026c0-f5dc-466b-9fa7-ee5a26162f12.webp", "imageAlt": "Mountain of the Dead tombs carved into sandstone at Siwa", "description": "The Mountain of the Dead at Siwa, known locally as Gebel el Mawta, honeycombs a sandstone hill with 26th Dynasty tombs where residents sheltered during World War II air raids on the oasis."},
    {"id": "5aa5946b-9af2-4823-a826-f25622adc750", "name": "Cleopatra's Bath", "image": "https://iluxuryegypt.com/api/assets/uploads/c8434655-1e26-46c1-aaa6-e0cb1379e527.webp", "imageAlt": "Cleopatra's Bath circular spring at Siwa Oasis", "description": "Cleopatra's Bath is a perfectly circular spring of warm, mineral rich water in Siwa, said by legend to have once drawn the queen herself, remaining a popular stop on any Siwa Oasis tour."},
    {"id": "3dbc7a24-5e4c-4f56-ae07-b08d1580ac79", "name": "Siwa House Museum", "image": "https://iluxuryegypt.com/api/assets/uploads/3aefb5f7-d98e-4600-a712-75f23bc8e849.webp", "imageAlt": "Siwa House Museum traditional artifacts and textiles", "description": "The Siwa House Museum preserves traditional Siwan domestic life through handwoven textiles, silver jewelry, and palm wood furnishings inside a restored historic mudbrick residence in the heart of the oasis town."}
  ]$attr$::jsonb,
  faqs = $faqs$[
    {"id": "89b300b1-ea02-4c3b-b994-5b156fe3beaf", "question": "Why did Alexander the Great visit Siwa?", "answer": "Alexander the Great crossed the desert to Siwa in 331 BC to consult the Oracle of Amun at the Temple of the Oracle, seeking confirmation of his divine destiny as pharaoh."},
    {"id": "2c99367b-a89c-4300-90cd-db931fbbedac", "question": "What is Shali Fortress made of?", "answer": "Shali Fortress is built entirely from kershef, a traditional local material combining salt rock and mud, giving Siwa town's old center its distinctive sand colored appearance that has weathered centuries of desert wind and rare rainfall."},
    {"id": "4de89415-e5d9-4b3d-a239-442d6d312a64", "question": "How far is Siwa from Cairo?", "answer": "Siwa Oasis sits roughly eight hours by road from Cairo, deep in Egypt's Western Desert near the Libyan border, making it a more remote addition to an Egypt itinerary than the Nile Valley sites."},
    {"id": "9c9eeffa-eb27-46f4-b1e1-eed77e8a494b", "question": "Is Cleopatra's Bath actually connected to Cleopatra?", "answer": "The connection is legendary rather than historically confirmed, but the spring's clear, circular waters remain one of Siwa's most photographed natural landmarks and a favorite spot for visitors to cool off."},
    {"id": "1337029d-6b32-4ed6-8090-86ca00171c17", "question": "What is the Mountain of the Dead?", "answer": "Known locally as Gebel el Mawta, this sandstone hill holds tombs dating to the 26th Dynasty and later served as a shelter for Siwan residents during World War II air raids."},
    {"id": "a32516b3-ab25-4e6f-af22-5f09d1e6c4f8", "question": "What makes Siwa's culture different from the rest of Egypt?", "answer": "Siwa is home to a distinct Berber speaking community with its own language, customs, and architecture, setting it apart culturally from the Arabic speaking Nile Valley and the rest of the country."},
    {"id": "a05cbb57-a7b1-4cdb-b826-67d5b359558a", "question": "Is the Siwa House Museum worth a visit?", "answer": "Yes, it offers insight into traditional Siwan domestic life through handwoven textiles, silver jewelry, and palm wood furnishings inside a beautifully restored historic residence in the heart of the oasis."}
  ]$faqs$::jsonb,
  updated_at = now()
WHERE slug = 'siwa-oasis';

-- Review the output above (row count, any 0-row UPDATE means a slug
-- mismatch) before committing.
COMMIT;
