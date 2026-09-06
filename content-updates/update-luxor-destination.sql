-- Content refresh for the Luxor destination (slug: luxor): description,
-- SEO fields (seo_title, meta_description, focus_keyword), and a new
-- 10-question faqs array. attractions is deliberately left untouched:
-- Luxor's attraction entries already carry real, distinct photos per
-- site, unlike Cairo's or Aswan's placeholder-heavy arrays.
--
-- Run with: psql "$DATABASE_URL" -f content-updates/update-luxor-destination.sql

BEGIN;

UPDATE destinations SET
  description = 'Luxor occupies the site of ancient Thebes, once the capital of Egypt''s New Kingdom and the most powerful city in the ancient world. Karnak and Luxor Temple rise on the east bank, while the Valley of the Kings and Hatshepsut''s temple lie across the river on the west bank''s desert cliffs. A luxury Luxor tour reveals a concentration of pharaonic history unmatched anywhere else on Earth, from the intact tomb of Tutankhamun to the painted burial chambers of ancient queens. Few destinations reward days rather than hours, and Luxor is one of them.',
  seo_title = 'Luxury Luxor Tours | Ancient Thebes Private Travel – iLuxury Egypt',
  meta_description = 'Explore Luxor''s temples and royal tombs with a private luxury tour — Karnak, the Valley of the Kings, and expert Egyptologist guides await.',
  focus_keyword = 'luxury Luxor tours',
  faqs = $faqs$[
    {"question": "How many days should I spend in Luxor?", "answer": "Two to three full days allow time to properly explore both banks of the Nile, from Karnak and Luxor Temple to the Valley of the Kings, Hatshepsut's temple, and the Valley of the Queens without rushing."},
    {"question": "What is the difference between the Valley of the Kings and the Valley of the Queens?", "answer": "The Valley of the Kings holds the tombs of pharaohs including Tutankhamun, while the Valley of the Queens contains burial sites for royal consorts and princes, most famously the tomb of Nefertari."},
    {"question": "Can I see the tomb of Tutankhamun in Luxor?", "answer": "Yes, Tutankhamun's tomb sits within the Valley of the Kings and remains open to visitors, offering a rare glimpse into the only substantially undisturbed royal burial ever discovered in Egypt."},
    {"question": "Is Karnak Temple bigger than Luxor Temple?", "answer": "Yes, Karnak is significantly larger, built and expanded over two thousand years by more than thirty pharaohs, while Luxor Temple is more compact and connected to Karnak by an ancient processional avenue."},
    {"question": "What is the best time of day to visit the Valley of the Kings?", "answer": "Early morning offers cooler temperatures and smaller crowds, making it the ideal time to explore the tombs before the desert heat intensifies later in the day."},
    {"question": "Can Luxor be combined with a Nile cruise to Aswan?", "answer": "Yes, Luxor is the traditional starting point for a private Nile cruise south to Aswan, passing temples at Edfu and Kom Ombo along the way."},
    {"question": "What should I know before visiting the Tomb of Nefertari?", "answer": "Nefertari's tomb often requires a separate ticket due to its fragile, vividly painted interior, considered the most beautifully preserved royal burial chamber in ancient Egypt."},
    {"question": "Is the Mummification Museum worth visiting in Luxor?", "answer": "Yes, it offers a focused look at ancient embalming practices through preserved tools and sacred animal mummies, making it a worthwhile stop along Luxor's Corniche."},
    {"question": "What is Deir el-Medina and why is it significant?", "answer": "Deir el-Medina was the ancient village where the workers who built the royal tombs lived, and it preserves rare insight into daily life during Egypt's New Kingdom period."},
    {"question": "How far is the Valley of the Kings from Luxor city center?", "answer": "The Valley of the Kings sits on the west bank, roughly a twenty minute drive from central Luxor across the Nile, making it an easy half day excursion."}
  ]$faqs$::jsonb,
  updated_at = now()
WHERE slug = 'luxor';

-- Review the output above (row count, any 0-row UPDATE means a slug
-- mismatch) before committing.
COMMIT;
