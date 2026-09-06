-- Restores Hurghada's (slug: hurghada) full original 12-entry attractions
-- list -- a mix of Red Sea/marine sites and cultural landmarks -- in
-- place of the 3-entry cultural-only subset shipped in
-- update-hurghada-destination.sql. That earlier migration's filtering
-- down to only cultural sites was a wrong call; this restores the
-- complete list with freshly written descriptions for every entry
-- (30-50 words each, zero em/en dashes).
--
-- Only attractions is touched here -- description/seo_title/
-- meta_description/focus_keyword/faqs from the earlier migration are
-- left as they are.
--
-- None of the 12 photos are a dedicated match for their site yet (no
-- real photo of Giftun Island, the Thistlegorm wreck, Dolphin House,
-- etc. exists in the media library) -- reef/coast/marina drone shots
-- and the earlier placeholders are reused across sites by rough fit.
-- All 12 should be swapped for real photos via the admin's
-- "Suggest Photo" flow once available.
--
-- Run with: psql "$DATABASE_URL" -f content-updates/restore-hurghada-full-attractions.sql

BEGIN;

UPDATE destinations SET
  attractions = $attr$[
    {"id": "517aa86a-2852-4769-908c-1fa3062a9387", "name": "Giftun Island", "image": "https://iluxuryegypt.com/api/assets/uploads/89f2db6b-f512-4745-9c8d-73800f4653fb.webp", "imageAlt": "Giftun Island scenic view", "description": "Giftun Island, a protected national park 45 minutes off Hurghada's coast, shelters untouched coral reefs and white sand beaches among the clearest waters in Egypt, making it a favorite Red Sea day trip."},
    {"id": "64e3d4f4-2346-47b5-b40f-5c53169fbe1d", "name": "SS Thistlegorm Wreck", "image": "https://iluxuryegypt.com/api/assets/uploads/694634fa-187e-4ee4-b48e-04b0d56bd163.webp", "imageAlt": "SS Thistlegorm wreck dive site near Hurghada", "description": "The SS Thistlegorm, a British WWII cargo ship sunk in 1941, rests 30 meters beneath the Red Sea near Hurghada, its cargo of motorcycles and trucks still remarkably intact for wreck diving enthusiasts."},
    {"id": "c91ced2f-a718-4c01-a75a-a275bee6df83", "name": "Dolphin House", "image": "https://iluxuryegypt.com/api/assets/uploads/91fabc8c-6fcb-406e-9b56-73ece6f870de.webp", "imageAlt": "Dolphin House spinner dolphins near Hurghada", "description": "Dolphin House, known locally as Shaab El Erg, shelters a resident pod of wild spinner dolphins that gathers each morning in shallow reef waters north of Hurghada, a highlight for marine life lovers."},
    {"id": "d29bb3c9-5fb8-44d9-917b-ec2b773de14e", "name": "Mahmya Island", "image": "https://iluxuryegypt.com/api/assets/uploads/91fabc8c-6fcb-406e-9b56-73ece6f870de.webp", "imageAlt": "Mahmya Island white sand beach in Hurghada", "description": "Mahmya Island, a protected stretch of Orange Bay within the Giftun archipelago, offers powder white sand and shallow turquoise water framed by the open Red Sea, ideal for a relaxed Hurghada beach day."},
    {"id": "650b9a71-3752-4169-86d2-799b13714b4b", "name": "Hurghada Grand Aquarium", "image": "https://iluxuryegypt.com/api/assets/uploads/694634fa-187e-4ee4-b48e-04b0d56bd163.webp", "imageAlt": "Hurghada Grand Aquarium marine life displays", "description": "The Hurghada Grand Aquarium houses Red Sea and international marine species within themed tunnels and tanks, offering an up close introduction to Egypt's coral reef ecosystem for visitors of all ages."},
    {"id": "75c7e64f-9505-49a5-a66a-414cd5b34bdd", "name": "Sindbad Submarine", "image": "https://iluxuryegypt.com/api/assets/uploads/694634fa-187e-4ee4-b48e-04b0d56bd163.webp", "imageAlt": "Sindbad Submarine Red Sea excursion in Hurghada", "description": "The Sindbad Submarine descends 22 meters into the Red Sea near Hurghada, revealing coral reefs and marine life through observation windows without requiring a dive certification, making it perfect for families and non divers."},
    {"id": "571ce15d-32b8-4d5c-9519-e01d45574f56", "name": "Abu Ramada Island", "image": "https://iluxuryegypt.com/api/assets/uploads/89f2db6b-f512-4745-9c8d-73800f4653fb.webp", "imageAlt": "Abu Ramada Island coral reefs near Hurghada", "description": "Abu Ramada Island, a protected reef system south of Hurghada known locally as the Aquarium, draws snorkelers and divers to its shallow, exceptionally clear coral gardens teeming with reef fish."},
    {"id": "733ded52-b42e-4b28-9d58-220b5d556dcc", "name": "Careless Reef", "image": "https://iluxuryegypt.com/api/assets/uploads/89f2db6b-f512-4745-9c8d-73800f4653fb.webp", "imageAlt": "Careless Reef coral walls near Hurghada", "description": "Careless Reef, a horseshoe shaped offshore reef near Hurghada, drops into dramatic coral walls favored by divers for encounters with reef sharks and vivid soft coral formations along the Red Sea."},
    {"id": "91b0655d-8937-4eab-8284-9ebd217a16d5", "name": "Hurghada Marina", "image": "https://iluxuryegypt.com/api/assets/uploads/e0b5a45b-f70e-4c81-9684-3ef2be0f9ddf.webp", "imageAlt": "Hurghada Marina waterfront promenade and yachts", "description": "Hurghada Marina, a waterfront promenade lined with private yachts and boutique shops, serves as the city's departure point for Red Sea snorkeling trips and sunset cruises along the coast each evening."},
    {"id": "4c0ab570-b441-4273-a08b-cdc967eff287", "name": "El Mina Mosque", "image": "https://iluxuryegypt.com/api/assets/uploads/e0b5a45b-f70e-4c81-9684-3ef2be0f9ddf.webp", "imageAlt": "El Mina Mosque twin minarets overlooking Hurghada marina", "description": "El Mina Mosque, Hurghada's largest and most photographed Islamic landmark, rises above the marina with twin minarets and a striking white facade overlooking the Red Sea, a favorite stop for visitors."},
    {"id": "6865cfa1-3177-415d-95e0-1364769eedc0", "name": "El Dahar (Old Hurghada)", "image": "https://iluxuryegypt.com/api/assets/uploads/be153ebc-8259-42d6-8091-f59dc0320161.webp", "imageAlt": "El Dahar old town narrow lanes in Hurghada", "description": "El Dahar, Hurghada's original old town, preserves narrow lanes, traditional coffeehouses, and a working local market that predates the city's growth into a Red Sea resort hub, offering a quieter glimpse of daily life."},
    {"id": "c89e118d-6dbf-4a72-a374-5316dc1c10a3", "name": "Hurghada Museum", "image": "https://iluxuryegypt.com/api/assets/uploads/499755c6-cefe-458c-a862-97b3c0fbf144.webp", "imageAlt": "Ancient Egyptian artifacts displayed at Hurghada Museum", "description": "The Hurghada Museum displays ancient Egyptian artifacts and royal statuary within a modern gallery space, offering a compact cultural counterpoint to the city's marine attractions and a worthwhile stop for history minded travelers."}
  ]$attr$::jsonb,
  updated_at = now()
WHERE slug = 'hurghada';

-- Review the output above (row count, any 0-row UPDATE means a slug
-- mismatch) before committing.
COMMIT;
