-- Content refresh for the Alexandria destination (slug: alexandria):
-- description, SEO fields, a new 10-question faqs array, and a single
-- attraction photo swap.
--
-- attractions is intentionally NOT replaced wholesale: this script never
-- ran against Alexandria's real production row (it doesn't exist in the
-- local dev database used to build/test this migration), so the exact
-- current content of its 16 attraction entries is unknown here. Instead,
-- the UPDATE below operates on whatever is already stored: it matches
-- the Abu Abbas al-Mursi Mosque entry by name (case-insensitive, tolerant
-- of "Abu al-Abbas" vs "Abu Abbas" spelling) and swaps only its
-- image/imageAlt, leaving that entry's id/name/description and all other
-- 15 entries completely untouched. Every entry also gets a defensive id
-- backfill if it's missing one (harmless no-op if all ids are already
-- present) -- the same missing-id bug fixed for Cairo/Luxor in
-- DestinationForm.tsx would otherwise silently break this destination's
-- Update button the same way.
--
-- IMPORTANT: after running, verify manually that exactly 1 row's
-- attractions array actually changed (see the verification query in the
-- comment at the bottom) -- if the mosque entry's name doesn't match the
-- ILIKE patterns below, NO image gets swapped and this becomes a silent
-- no-op for that part.
--
-- Run with: psql "$DATABASE_URL" -f content-updates/update-alexandria-destination.sql

BEGIN;

UPDATE destinations SET
  description = 'Alexandria was founded by Alexander the Great in 331 BC and became the ancient world''s wealthiest, most cosmopolitan city, home to the Great Library and the legendary Lighthouse. Greek, Roman, Coptic, and Islamic layers still define its streets today, from underground catacombs to soaring mosque minarets. A luxury Alexandria tour reveals a city facing the Mediterranean rather than the Nile, where ancient wonders sit beside Belle Epoque palaces and cosmopolitan museums. Alexandria feels unlike anywhere else in Egypt, rewarding travelers who venture beyond Cairo and Luxor.',
  seo_title = 'Luxury Alexandria Tours | Mediterranean - iLuxury Egypt',
  meta_description = 'Explore Alexandria''s ancient wonders and cosmopolitan history with a private luxury tour — catacombs, museums, and Mediterranean charm await.',
  focus_keyword = 'luxury Alexandria tours',
  faqs = $faqs$[
    {"id": "aaf84b61-ee09-4588-b66c-3463281e9235", "question": "What is Alexandria famous for historically?", "answer": "Alexandria is famous as the site of the ancient Great Library and the legendary Lighthouse, one of the Seven Wonders of the Ancient World, both founded during the reign of Alexander the Great in 331 BC and his successors."},
    {"id": "3c24203e-8127-4700-907f-fdcecb26a352", "question": "Is the ancient Lighthouse of Alexandria still standing?", "answer": "No, the original lighthouse collapsed after a series of earthquakes centuries ago, but Qaitbay Citadel now stands on its former site along the Mediterranean shore, built partly from the lighthouse's own fallen stone blocks."},
    {"id": "b2772818-fa2b-4340-8958-1b71cf76026e", "question": "What is the Bibliotheca Alexandrina?", "answer": "The Bibliotheca Alexandrina is a modern library and cultural complex opened in 2002 as a tribute to the ancient Great Library, featuring a distinctive tilted disc roof facing the sea and vast collections of manuscripts."},
    {"id": "02ab5f5d-eafa-40d0-8b5b-8d5cb2b0d688", "question": "Are the Catacombs of Kom el Shoqafa worth visiting?", "answer": "Yes, they form Egypt's largest known Roman funerary complex, carved deep into bedrock during the 2nd century AD and once considered one of the Seven Wonders of the Middle Ages by medieval travelers."},
    {"id": "8eea45d1-aff5-4eb0-8d85-a868cc88a8d7", "question": "How many days do you need in Alexandria?", "answer": "One to two days allow time to properly see the main historic sites, including Qaitbay Citadel, the catacombs, and the Greco Roman Museum, without feeling rushed through the city's layered history."},
    {"id": "52e4307d-ecb1-4a3a-b381-9031fcdf930d", "question": "Can Alexandria be visited as a day trip from Cairo?", "answer": "Yes, Alexandria sits roughly three hours from Cairo by private car, making it a popular day trip for many travelers, though an overnight stay allows a noticeably more relaxed and thorough pace."},
    {"id": "98efeace-8ffa-437f-a5fa-a3cd7685da3b", "question": "What is Pompey's Pillar?", "answer": "Pompey's Pillar is a single 27 meter column of polished red Aswan granite erected in 297 AD, once part of Alexandria's ancient Serapeum temple complex and now a striking solitary landmark."},
    {"id": "471d1dd7-fef4-491e-a4eb-cd80fd518ecd", "question": "Is Alexandria different from the rest of Egypt?", "answer": "Yes, Alexandria faces the Mediterranean Sea rather than the Nile, giving it a distinctly cosmopolitan atmosphere shaped by centuries of Greek, Roman, and European influence unlike Cairo, Luxor, or Aswan."},
    {"id": "54175b74-1a36-4ed5-b218-234ff5b1885e", "question": "What religious sites can I visit in Alexandria?", "answer": "Alexandria holds St. Mark's Cathedral, the Abu Abbas al Mursi Mosque, and the historic Eliyahu Hanavi Synagogue, together reflecting the city's remarkably diverse religious history across Christian, Muslim, and Jewish communities."},
    {"id": "833060ae-ee53-4b8a-a83d-5622ebbb1a29", "question": "Is Montazah Palace open to visitors?", "answer": "The expansive palace gardens at Montazah are open to the public, offering sweeping Mediterranean views and elegant royal era architecture, though the palace interior itself has restricted access for most visitors."}
  ]$faqs$::jsonb,
  attractions = (
    SELECT jsonb_agg(
      CASE
        WHEN entry->>'name' ILIKE '%abbas%mursi%' OR entry->>'name' ILIKE '%abu abbas%'
          THEN entry || jsonb_build_object(
            'id', COALESCE(NULLIF(entry->>'id', ''), gen_random_uuid()::text),
            'image', 'https://iluxuryegypt.com/api/assets/uploads/09dfda0e-9198-4dde-83a5-738f16237262.webp',
            'imageAlt', 'Abu Abbas al-Mursi Mosque minarets in Alexandria'
          )
        ELSE entry || jsonb_build_object('id', COALESCE(NULLIF(entry->>'id', ''), gen_random_uuid()::text))
      END
    )
    FROM jsonb_array_elements(attractions) AS entry
  ),
  updated_at = now()
WHERE slug = 'alexandria';

-- Review the output above (row count, any 0-row UPDATE means a slug
-- mismatch) before committing.
COMMIT;

-- Verification query to run manually afterward:
-- SELECT jsonb_pretty(entry) FROM destinations, jsonb_array_elements(attractions) AS entry
-- WHERE slug = 'alexandria' AND entry->>'image' LIKE '%09dfda0e%';
-- (should return exactly 1 row -- the mosque)
