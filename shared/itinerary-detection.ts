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

// Activity → luxury alt-text phrase, keyed by the same style of keyword
// pattern as tour-highlights.ts's NOTABLE_ACTIVITY_PATTERNS (kept as a
// separate list here since these need to read as short image captions —
// "Private camel excursion" — rather than that file's full body sentences).
// Checked in order against the day's own description/activities text, first
// match wins, so a more specific pattern (hot air balloon) is listed above a
// broader one it could otherwise be mistaken for.
const ACTIVITY_ALT_PHRASES: Array<{ pattern: RegExp; activity: string; qualifier: string }> = [
  { pattern: /hot air balloon/i, activity: "Sunrise hot air balloon flight", qualifier: "with panoramic views over the Nile Valley" },
  { pattern: /felucca/i, activity: "Private felucca sail", qualifier: "with a private crew and traditional sailing rig" },
  { pattern: /private (dinner|lunch)|fine dining/i, activity: "Private fine dining experience", qualifier: "with bespoke table service" },
  { pattern: /camel/i, activity: "Private camel excursion", qualifier: "with luxury desert guide service" },
  { pattern: /snorkel|diving|dive/i, activity: "Private Red Sea snorkeling excursion", qualifier: "with a dedicated dive guide" },
  { pattern: /desert|4x4|jeep/i, activity: "Private desert excursion", qualifier: "with an expert local guide" },
  { pattern: /sunset/i, activity: "Private sunset viewing experience", qualifier: "arranged exclusively for your journey" },
];

const ARRIVAL_PATTERN = /\b(arrive|arrival|check-?in|welcome)\b/i;

// Rotating clauses appended (by variantIndex) so a second, third, etc. photo
// of the same place in the same tour never gets the literal same alt text —
// varying the angle/time framing rather than inventing new scene content.
const ALT_TEXT_VARIANT_SUFFIXES = [
  ", captured at golden hour",
  ", from an exclusive morning departure",
  ", arranged as a private evening experience",
  ", during an intimate small-group visit",
];

// English convention takes "the" before a handful of landmark-name shapes
// ("the Great Pyramids of Giza", "the Valley of the Kings") but not most
// others ("Karnak Temple", "Abu Simbel") — this covers the common shapes in
// KNOWN_EGYPT_LANDMARKS above without hardcoding per-landmark grammar.
function withArticle(placeName: string): string {
  const needsThe = /^(great |valley of|pyramids of|tombs of|colossi of|temples of)/i.test(placeName) || /pyramids$/i.test(placeName);
  return needsThe ? `the ${placeName}` : placeName;
}

/**
 * Builds a luxury-toned, SEO-oriented alt-text suggestion for an itinerary
 * day's photo, e.g. "Private camel excursion at the Great Pyramids of Giza
 * with luxury desert guide service". Mines the day's own description/
 * activities text for a recognizable activity (the same keyword-family
 * approach as tour-highlights.ts's notable-activity detection) rather than
 * inventing scene details that aren't knowable from the record; falls back
 * to a generic private-guide phrasing, or an arrival/stay phrasing when an
 * accommodation is known and no specific activity was detected.
 *
 * @param variantIndex 0-based count of prior photos already suggested for
 *   this same place name within the same tour — pass the running count so
 *   repeated place photos get a distinguishing clause instead of identical
 *   alt text.
 */
export function suggestDayPhotoAlt(params: {
  placeName: string;
  description?: string;
  activities?: string[];
  accommodation?: string;
  variantIndex?: number;
}): string {
  const { placeName, description = "", activities = [], accommodation, variantIndex = 0 } = params;
  const text = `${description} ${activities.join(" ")}`;
  const matched = ACTIVITY_ALT_PHRASES.find(({ pattern }) => pattern.test(text));
  // Most days have an accommodation set regardless of what the day is
  // actually about, so the arrival/stay phrasing below is only used when the
  // day's own text is actually about arriving or checking in — not just
  // because a hotel happens to be attached to a landmark-visit day.
  const isArrivalDay = ARRIVAL_PATTERN.test(text);

  let base: string;
  if (matched) {
    base = `${matched.activity} at ${withArticle(placeName)} ${matched.qualifier}`;
  } else if (accommodation?.trim() && isArrivalDay) {
    base = `Luxury arrival experience at ${accommodation.trim()}, ${placeName}`;
  } else {
    base = `Private guided visit to ${withArticle(placeName)} with a private Egyptologist guide`;
  }

  if (variantIndex > 0) {
    base += ALT_TEXT_VARIANT_SUFFIXES[(variantIndex - 1) % ALT_TEXT_VARIANT_SUFFIXES.length];
  }
  return base;
}
