// Pure, dependency-free text-matching helpers used to auto-suggest itinerary
// fields (place name, accommodation, meals) from a day's free-text
// description. Shared between the client (TourForm, live suggestions while
// editing) and the server (bulk auto-enrich job) so the matching logic and
// landmark list only live in one place.
//
// Everything here only ever SUGGESTS a value for an already-empty field —
// callers are responsible for never overwriting a value the admin already
// set. No network calls, no invented data: a hotel/place name is only
// returned if it is an exact substring match against real data (the hotel
// list from the DB, or this landmark list).

// Curated baseline of well-known Egyptian tourist landmarks, independent of
// whatever an admin has (or hasn't) entered into destinations.attractions —
// that field isn't seeded in this codebase and coverage there is unknown, so
// this list is the reliable floor. Callers may pass additional names (e.g.
// from destinations.attractions) to merge in on top of this baseline.
export const KNOWN_EGYPT_LANDMARKS: string[] = [
  "Great Pyramid of Giza",
  "Pyramids of Giza",
  "Giza Pyramids",
  "Great Sphinx",
  "Sphinx",
  "Saqqara",
  "Step Pyramid",
  "Dahshur",
  "Red Pyramid",
  "Bent Pyramid",
  "Egyptian Museum",
  "Grand Egyptian Museum",
  "Khan el-Khalili",
  "Citadel of Saladin",
  "Cairo Citadel",
  "Mohamed Ali Mosque",
  "Coptic Cairo",
  "Hanging Church",
  "Karnak Temple",
  "Luxor Temple",
  "Valley of the Kings",
  "Valley of the Queens",
  "Hatshepsut Temple",
  "Temple of Hatshepsut",
  "Colossi of Memnon",
  "Medinet Habu",
  "Tombs of the Nobles",
  "Deir el-Medina",
  "Kom Ombo Temple",
  "Kom Ombo",
  "Edfu Temple",
  "Temple of Horus",
  "Aswan High Dam",
  "Philae Temple",
  "Unfinished Obelisk",
  "Nubian Village",
  "Elephantine Island",
  "Abu Simbel",
  "Temple of Ramses II",
  "Temple of Nefertari",
  "Alexandria Library",
  "Bibliotheca Alexandrina",
  "Qaitbay Citadel",
  "Catacombs of Kom el Shoqafa",
  "Pompey's Pillar",
  "White Desert",
  "Black Desert",
  "Bahariya Oasis",
  "Siwa Oasis",
  "Shali Fortress",
  "Cleopatra's Bath",
  "Great Sand Sea",
  "Ras Mohammed National Park",
  "Colored Canyon",
  "Mount Sinai",
  "Saint Catherine's Monastery",
  "Dahab",
  "Naama Bay",
  "Nile River",
  "Felucca",
  "Aswan",
  "Luxor",
  "Cairo",
  "Giza",
  "Alexandria",
  "Sharm El Sheikh",
  "Hurghada",
  "Marsa Alam",
  "Abu Simbel Temples",
];

const norm = (s: string) => s.toLowerCase();

/**
 * Normalizes text for loose matching against filenames — media filenames use
 * hyphens/underscores/dots instead of spaces (e.g. "karnak-temple-columns.jpg"),
 * so a naive substring check against "karnak temple" would never match. This
 * collapses separators to spaces on both sides of the comparison.
 */
export function normalizeForMatch(s: string): string {
  return s.toLowerCase().replace(/[-_.]+/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * Returns the longest known landmark name found as a substring of the
 * description, or null if none match. Longest-match-wins so "Karnak Temple"
 * is preferred over a shorter contained match like "Temple".
 */
export function detectPlaceName(description: string, extraNames: string[] = []): string | null {
  if (!description?.trim()) return null;
  const haystack = norm(description);

  const candidates = Array.from(new Set([...KNOWN_EGYPT_LANDMARKS, ...extraNames]))
    .filter((name) => name.trim().length > 2)
    .sort((a, b) => b.length - a.length);

  for (const name of candidates) {
    if (haystack.includes(norm(name))) return name;
  }
  return null;
}

/**
 * Returns the longest real hotel name (from hotelNames, e.g. the site's own
 * hotels table) found as a substring of the description, or null. Never
 * invents a name — only matches against hotels that actually exist.
 */
export function detectAccommodation(description: string, hotelNames: string[]): string | null {
  if (!description?.trim() || hotelNames.length === 0) return null;
  const haystack = norm(description);

  const candidates = [...hotelNames].filter((n) => n.trim().length > 2).sort((a, b) => b.length - a.length);
  for (const name of candidates) {
    if (haystack.includes(norm(name))) return name;
  }
  return null;
}

const MEAL_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  { label: "Breakfast", pattern: /\bbreakfasts?\b/i },
  { label: "Lunch", pattern: /\blunch(es)?\b/i },
  { label: "Dinner", pattern: /\b(dinners?|suppers?)\b/i },
];

/** Returns the subset of ["Breakfast","Lunch","Dinner"] mentioned in the description. */
export function detectMeals(description: string): string[] {
  if (!description?.trim()) return [];
  return MEAL_PATTERNS.filter(({ pattern }) => pattern.test(description)).map(({ label }) => label);
}

/**
 * Builds a descriptive alt-text suggestion from a detected place name plus
 * the tour's own destinations/title, e.g. "Karnak Temple – iLuxury Egypt".
 * Only ever combines real data already on the tour; never invents scene
 * details (lighting, angle, etc.) that aren't knowable from the record.
 */
export function suggestDayPhotoAlt(placeName: string, locationHint?: string): string {
  const location = locationHint?.trim();
  return location ? `${placeName}, ${location} – iLuxury Egypt` : `${placeName} – iLuxury Egypt`;
}
