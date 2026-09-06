-- Restores Siwa Oasis's (slug: siwa-oasis) full original 12-entry
-- attractions list -- ancient/cultural sites plus natural desert
-- landmarks -- in place of the 7-entry ancient-sites-only subset
-- shipped in update-siwa-destination.sql. That earlier migration's
-- filtering down to only ancient sites was a wrong call; this
-- restores the complete list with freshly written descriptions for
-- every entry (30-50 words each, zero em/en dashes).
--
-- Only attractions is touched here -- description/seo_title/
-- meta_description/focus_keyword/faqs from the earlier migration are
-- left as they are.
--
-- IMPORTANT: the slug is siwa-oasis, not siwa -- a prior migration for
-- this same destination shipped with the wrong slug and had to be
-- fixed after returning "UPDATE 0" against production.
--
-- None of the 12 photos are a dedicated match for their site yet --
-- desert/spring/dune photos and the earlier placeholders are reused
-- across sites by rough fit. All 12 should be swapped for real photos
-- via the admin's "Suggest Photo" flow once available.
--
-- Run with: psql "$DATABASE_URL" -f content-updates/restore-siwa-full-attractions.sql

BEGIN;

UPDATE destinations SET
  attractions = $attr$[
    {"id": "1d6f2461-97e3-4d85-9198-a21b7c9d90e0", "name": "Temple of the Oracle", "image": "https://iluxuryegypt.com/api/assets/uploads/572026c0-f5dc-466b-9fa7-ee5a26162f12.webp", "imageAlt": "Temple of the Oracle ancient ruins at Siwa Oasis", "description": "The Temple of the Oracle at Siwa, built in the 6th century BC, drew Alexander the Great across the Sahara in 331 BC to confirm his divine destiny, remaining a highlight of any luxury Siwa tour."},
    {"id": "7fede22d-8849-41f2-aa83-22081d7dfe8d", "name": "Aghurmi Village", "image": "https://iluxuryegypt.com/api/assets/uploads/572026c0-f5dc-466b-9fa7-ee5a26162f12.webp", "imageAlt": "Aghurmi Village mudbrick ruins at Siwa Oasis", "description": "Aghurmi Village, a fortified hilltop settlement predating the Oracle Temple, preserves mudbrick ruins where ancient Siwans once lived alongside the sacred sanctuary that later drew Alexander the Great across the desert."},
    {"id": "acd46cb0-7ac2-421c-bfee-49f846a12a8d", "name": "Temple of Umm Ubayda", "image": "https://iluxuryegypt.com/api/assets/uploads/572026c0-f5dc-466b-9fa7-ee5a26162f12.webp", "imageAlt": "Temple of Umm Ubayda remaining wall at Siwa", "description": "The Temple of Umm Ubayda, a smaller Amun sanctuary near Aghurmi, once mirrored the Oracle Temple in scale before an 1897 explosion left only a single carved wall standing at this Siwa site."},
    {"id": "2dec42ea-4192-459a-b846-3779df74db87", "name": "Shali Fortress", "image": "https://iluxuryegypt.com/api/assets/uploads/3aefb5f7-d98e-4600-a712-75f23bc8e849.webp", "imageAlt": "Shali Fortress mudbrick ruins in Siwa town", "description": "Shali Fortress rises from the center of Siwa town, built in the 13th century entirely from kershef, a local material of salt rock and mud, forming one of the oasis's most iconic landmarks."},
    {"id": "347e3533-1121-491d-8248-9fdbc2a908d8", "name": "Mountain of the Dead", "image": "https://iluxuryegypt.com/api/assets/uploads/572026c0-f5dc-466b-9fa7-ee5a26162f12.webp", "imageAlt": "Mountain of the Dead tombs carved into sandstone at Siwa", "description": "The Mountain of the Dead at Siwa, known locally as Gebel el Mawta, honeycombs a sandstone hill with 26th Dynasty tombs where residents sheltered during World War II air raids on the oasis."},
    {"id": "a8df3a66-9658-42ad-a5c3-814673182624", "name": "Cleopatra's Bath", "image": "https://iluxuryegypt.com/api/assets/uploads/c8434655-1e26-46c1-aaa6-e0cb1379e527.webp", "imageAlt": "Cleopatra's Bath circular spring at Siwa Oasis", "description": "Cleopatra's Bath is a perfectly circular spring of warm, mineral rich water in Siwa, said by legend to have once drawn the queen herself, remaining a popular stop on any Siwa Oasis tour."},
    {"id": "1984f951-05b8-4c16-9bb9-b4b2fa7bbc0e", "name": "Siwa House Museum", "image": "https://iluxuryegypt.com/api/assets/uploads/3aefb5f7-d98e-4600-a712-75f23bc8e849.webp", "imageAlt": "Siwa House Museum traditional artifacts and textiles", "description": "The Siwa House Museum preserves traditional Siwan domestic life through handwoven textiles, silver jewelry, and palm wood furnishings inside a restored historic mudbrick residence in the heart of the oasis town."},
    {"id": "fb933253-8b72-4453-9776-5c8a190550e5", "name": "Fatnas Island", "image": "https://iluxuryegypt.com/api/assets/uploads/c8434655-1e26-46c1-aaa6-e0cb1379e527.webp", "imageAlt": "Fatnas Island sunset view over Siwa's salt lake", "description": "Fatnas Island, a palm covered promontory jutting into Siwa's salt lake, offers the oasis's most celebrated sunset views across still water framed by distant desert dunes, a must see Siwa spot."},
    {"id": "bc9f7251-097f-40da-b6e7-902e3688823c", "name": "Siwa Salt Lakes", "image": "https://iluxuryegypt.com/api/assets/uploads/d295b4c0-c2e0-4ff7-883e-360f5ad5f07d.webp", "imageAlt": "Siwa Salt Lakes floating pools in the oasis", "description": "The Siwa Salt Lakes, mineral rich pools scattered across the oasis floor, allow visitors to float effortlessly on dense, buoyant water framed by palm groves and desert silence, unique to Siwa Oasis."},
    {"id": "3318c285-62f4-4670-a38c-4cd9fd0c69e9", "name": "Dakrour Mountain", "image": "https://iluxuryegypt.com/api/assets/uploads/e0f797c9-2ac1-4da0-98b5-b41de2bd06c4.webp", "imageAlt": "Dakrour Mountain sand bathing site near Siwa", "description": "Dakrour Mountain, revered for centuries as a site of therapeutic sand bathing, rises above Siwa's palm groves and draws visitors each August for its ancient healing festival, a cultural highlight of the oasis."},
    {"id": "6a3556e4-cab5-4558-9238-eb33698712cf", "name": "Great Sand Sea", "image": "https://iluxuryegypt.com/api/assets/uploads/c559dd9e-eefd-4596-98a1-bc504a778ee3.webp", "imageAlt": "Great Sand Sea golden dunes near Siwa Oasis", "description": "The Great Sand Sea stretches from Siwa deep into Libya, its 72,000 square kilometers of rolling golden dunes forming one of Earth's largest deserts, perfect for a Siwa desert safari."},
    {"id": "58318de1-3226-4c84-8a40-7d0bc9401f20", "name": "Bir Wahed", "image": "https://iluxuryegypt.com/api/assets/uploads/e11c0e28-739f-4719-a169-3096e3f8dadf.webp", "imageAlt": "Bir Wahed hot spring in the Great Sand Sea", "description": "Bir Wahed, a remote hot spring bubbling deep within the Great Sand Sea, pairs steaming mineral waters with a neighboring cold spring beneath towering desert dunes, a favorite Siwa adventure stop."}
  ]$attr$::jsonb,
  updated_at = now()
WHERE slug = 'siwa-oasis';

-- Review the output above (row count, any 0-row UPDATE means a slug
-- mismatch) before committing.
COMMIT;
