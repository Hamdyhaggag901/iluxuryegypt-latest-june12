// Rewrites every itinerary day's alt text from the photograph that is actually
// installed on that day, and rebalances each tour's focus keyword.
//
// fill-itinerary-images.ts wrote its alt text BEFORE choosing a photo, so some
// alts describe a picture that was never downloaded: day 2 of 10-day-egypt-tour
// promises "the reassembled solar boat" over the result of a plain "Giza
// Pyramids Egypt" search, day 1 of 12-days-egypt-tour promises "granite
// sarcophagi ... Serapeum" over a plain "Saqqara" search, and day 9 promises
// "Nilometer steps". An alt that describes something not in the frame is worse
// than a vague one: a screen reader user is told about detail that is not
// there, and a search engine is given a false signal.
//
// So the alt is rebuilt from the only evidence there is about a photograph:
// the provider's own description of it. Every content word in a generated alt
// must trace back to a word in that description, or be part of the placeName
// this project already stores for the day. Nothing else can get in. That is
// enforced twice — once over the phrase tables at startup, so a careless entry
// cannot ship, and once over each finished sentence before it is written.
//
// Where the description is too thin to build an honest 8 word sentence from,
// the day KEEPS ITS EXISTING ALT and is reported. Inventing a plausible
// sentence is the failure mode this script exists to remove, so it does not
// get to reintroduce it at the bottom of the funnel.
//
// ---------------------------------------------------------------------------
// Confidence tiers
// ---------------------------------------------------------------------------
// How much of the place can honestly be named depends on what the description
// confirms, and the report prints which tier each day landed in:
//
//   PLACE   the description names the site (or part of it), so the alt names it
//   CITY    the description confirms only the city or Egypt, so the alt says that
//   VISUAL  the description confirms neither, so the alt describes the frame and
//           names no location at all. Worth opening these by hand.
//
// ---------------------------------------------------------------------------
// Focus keyword
// ---------------------------------------------------------------------------
// The convention on this project is that a tour's focus keyword appears in two
// or three of its day alts, never all of them. 10-day-egypt-tour and
// 12-days-egypt-tour are down to one after the photo repairs. The keyword is
// editorial context rather than a claim about the picture, so it is exempt from
// the no-invention rule, but it is only ever appended to a day whose sentence
// has room for it, and only as a natural trailing phrase.
//
// ---------------------------------------------------------------------------
// Running it
// ---------------------------------------------------------------------------
//   # No network, no writes. Shows the current alts and the keyword balance.
//   npx tsx scripts/rewrite-itinerary-alts.ts --plan
//
//   # Full run, prints the before/after table, then rolls back.
//   npx tsx scripts/rewrite-itinerary-alts.ts --dry-run
//
//   # For real.
//   npx tsx scripts/rewrite-itinerary-alts.ts
//
// Flags:
//   --only=<slug>          restrict to one tour (repeatable)
//   --skip-keyword         rewrite alts but leave the keyword balance alone
//
// Touches tours.itinerary[].imageAlt and tours.gallery_alt ONLY. The photos
// themselves, placeName, lat, lng and the day titles are never written.

import "dotenv/config";
import { pool } from "../server/db";

// ---------------------------------------------------------------------------
// Providers
// ---------------------------------------------------------------------------
type Provider = "pexels" | "pixabay" | "unsplash";

const KEYS: Record<Provider, string> = {
  pexels: (process.env.PEXELS_API_KEY ?? "").trim(),
  pixabay: (process.env.PIXABAY_API_KEY ?? "").trim(),
  unsplash: (process.env.UNSPLASH_ACCESS_KEY ?? "").trim(),
};

const BASES: Record<Provider, string> = {
  pexels: process.env.PEXELS_API_BASE?.trim() || "https://api.pexels.com/v1",
  pixabay: process.env.PIXABAY_API_BASE?.trim() || "https://pixabay.com/api",
  unsplash: process.env.UNSPLASH_API_BASE?.trim() || "https://api.unsplash.com",
};

const SPACING_MS: Record<Provider, number> = { pexels: 1100, pixabay: 1100, unsplash: 1400 };
const lastCall: Record<Provider, number> = { pexels: 0, pixabay: 0, unsplash: 0 };

async function throttle(provider: Provider): Promise<void> {
  const wait = SPACING_MS[provider] - (Date.now() - lastCall[provider]);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastCall[provider] = Date.now();
}

/** Reads the provider and photo id back out of a media.caption credit line. */
function parseCredit(caption: string | null): { provider: Provider; id: string } | null {
  if (!caption) return null;
  let m = caption.match(/pexels\.com\/photo\/(?:[^/\s]*-)?(\d+)/i);
  if (m) return { provider: "pexels", id: m[1] };
  m = caption.match(/pixabay\.com\/[^\s)]*-(\d+)/i);
  if (m) return { provider: "pixabay", id: m[1] };
  m = caption.match(/unsplash\.com\/photos\/(?:[^/\s]*-)?([A-Za-z0-9_-]{8,})/i);
  if (m) return { provider: "unsplash", id: m[1] };
  return null;
}

/** The provider's own description of one already-installed photo. */
async function fetchDescription(provider: Provider, id: string): Promise<string | null> {
  if (!KEYS[provider]) return null;
  await throttle(provider);
  try {
    if (provider === "pexels") {
      const r = await fetch(`${BASES.pexels}/photos/${id}`, { headers: { Authorization: KEYS.pexels } });
      if (!r.ok) return null;
      return String(((await r.json()) as any).alt ?? "");
    }
    if (provider === "pixabay") {
      const url = new URL(`${BASES.pixabay}/`);
      url.searchParams.set("key", KEYS.pixabay);
      url.searchParams.set("id", id);
      const r = await fetch(url);
      if (!r.ok) return null;
      const hit = ((await r.json()) as { hits?: any[] }).hits?.[0];
      // Pixabay's tags are a comma list; commas become spaces so the tokeniser
      // sees them as ordinary words.
      return hit ? String(hit.tags ?? "").replace(/,/g, " ") : null;
    }
    const r = await fetch(`${BASES.unsplash}/photos/${id}`, {
      headers: { Authorization: `Client-ID ${KEYS.unsplash}` },
    });
    if (!r.ok) return null;
    const u = (await r.json()) as any;
    return [u.alt_description, u.description, (u.tags ?? []).map((t: any) => t?.title).join(" ")]
      .filter(Boolean)
      .join(" ");
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Vocabulary
// ---------------------------------------------------------------------------
// Every phrase below may only use words that appear in its own `match` list or
// in FUNCTION_WORDS. That is what makes the no-invention rule checkable rather
// than aspirational: if a phrase said "limestone" on a match of "stone", the
// startup guard would refuse to run. Synonyms are therefore not allowed, which
// is why some phrasing is plainer than it would otherwise be.

const FUNCTION_WORDS = new Set([
  "a", "an", "the", "and", "at", "in", "of", "on", "with", "under", "over",
  "into", "from", "this", "its", "view", "seen", "standing", "photographed",
]);

interface Entry {
  match: string[];
  phrase: string;
}

// Ordered: the first entry that fires becomes the sentence's primary subject,
// so the most specific subjects come first.
const SUBJECTS: Entry[] = [
  { match: ["sphinx"], phrase: "the sphinx" },
  { match: ["pyramid", "pyramids"], phrase: "pyramids" },
  { match: ["obelisk"], phrase: "an obelisk" },
  { match: ["sarcophagus", "sarcophagi"], phrase: "sarcophagi" },
  { match: ["hieroglyph", "hieroglyphs", "hieroglyphics"], phrase: "hieroglyphs" },
  { match: ["relief", "reliefs", "carving", "carvings", "carved"], phrase: "carved reliefs" },
  { match: ["mural", "murals", "fresco", "frescoes", "painting", "paintings", "painted"], phrase: "paintings" },
  { match: ["column", "columns", "pillar", "pillars", "colonnade"], phrase: "columns" },
  { match: ["statue", "statues", "sculpture", "sculptures"], phrase: "statues" },
  { match: ["tomb", "tombs", "burial", "crypt", "catacomb", "catacombs"], phrase: "a tomb" },
  { match: ["temple", "temples"], phrase: "a temple" },
  { match: ["minaret", "minarets"], phrase: "a minaret" },
  { match: ["dome", "domes"], phrase: "a dome" },
  { match: ["courtyard", "courtyards"], phrase: "a courtyard" },
  { match: ["mosque", "mosques"], phrase: "a mosque" },
  { match: ["church", "churches", "cathedral", "synagogue"], phrase: "a church" },
  { match: ["citadel", "fortress", "fort", "castle"], phrase: "a fortress" },
  { match: ["museum", "gallery", "exhibit", "exhibition"], phrase: "a museum gallery" },
  { match: ["theatre", "theater", "amphitheatre", "amphitheater"], phrase: "a theatre" },
  { match: ["seating", "seats", "bench", "benches"], phrase: "seating" },
  { match: ["hall", "halls"], phrase: "a hall" },
  { match: ["village", "villages"], phrase: "a village" },
  { match: ["ruin", "ruins"], phrase: "ruins" },
  { match: ["arch", "arches", "archway"], phrase: "arches" },
  { match: ["gate", "gateway", "doorway", "entrance"], phrase: "an entrance" },
  { match: ["stair", "stairs", "staircase", "steps"], phrase: "steps" },
  { match: ["corridor", "hallway", "passage"], phrase: "a corridor" },
  { match: ["terrace", "terraces"], phrase: "terraces" },
  { match: ["window", "windows"], phrase: "windows" },
  { match: ["roof", "rooftop", "rooftops"], phrase: "rooftops" },
  { match: ["bridge", "bridges"], phrase: "a bridge" },
  { match: ["coral", "reef"], phrase: "coral reef" },
  { match: ["fish", "shoal"], phrase: "fish" },
  { match: ["dune", "dunes"], phrase: "dunes" },
  { match: ["desert", "sand"], phrase: "desert sand" },
  { match: ["camel", "camels"], phrase: "camels" },
  { match: ["felucca", "sailboat", "boat", "boats", "ship"], phrase: "a boat" },
  { match: ["river", "nile"], phrase: "the river" },
  { match: ["lake", "pool", "spring", "water"], phrase: "water" },
  { match: ["sea", "ocean"], phrase: "the sea" },
  { match: ["coast", "shore", "beach"], phrase: "the shore" },
  { match: ["palm", "palms"], phrase: "palms" },
  { match: ["tree", "trees", "grove", "garden"], phrase: "trees" },
  { match: ["market", "bazaar", "souk", "stall", "stalls", "shop", "shops"], phrase: "market stalls" },
  { match: ["street", "alley", "alleyway", "lane", "road"], phrase: "a street" },
  { match: ["lantern", "lanterns", "lamp", "lamps"], phrase: "lanterns" },
  { match: ["skyline", "cityscape"], phrase: "a skyline" },
  { match: ["island", "islands"], phrase: "an island" },
  { match: ["valley", "valleys"], phrase: "a valley" },
  { match: ["oasis"], phrase: "an oasis" },
  { match: ["field", "fields", "farmland"], phrase: "fields" },
  { match: ["grass"], phrase: "grass" },
  { match: ["flower", "flowers"], phrase: "flowers" },
  { match: ["bird", "birds"], phrase: "birds" },
  { match: ["cliff", "cliffs", "mountain", "mountains", "hill", "hills"], phrase: "cliffs" },
  { match: ["building", "buildings", "house", "houses", "architecture"], phrase: "buildings" },
  { match: ["wall", "walls"], phrase: "walls" },
  { match: ["stone", "rock", "granite", "limestone", "sandstone"], phrase: "stone" },
  { match: ["city", "town", "village"], phrase: "a town" },
];

// Rendered as a trailing "under a <colour> sky", and only when the description
// actually gives the sky a colour: "under the sky" says nothing.
const SKY: Entry = { match: ["sky", "skies"], phrase: "sky" };

const PEOPLE: Entry = {
  match: ["people", "person", "man", "woman", "men", "women", "tourist", "tourists", "crowd", "visitor", "visitors", "diver", "divers"],
  phrase: "with people",
};

const COLOURS: Entry[] = [
  { match: ["golden", "gold"], phrase: "golden" },
  { match: ["turquoise"], phrase: "turquoise" },
  { match: ["blue"], phrase: "blue" },
  { match: ["green"], phrase: "green" },
  { match: ["white"], phrase: "white" },
  { match: ["brown"], phrase: "brown" },
  { match: ["grey", "gray"], phrase: "grey" },
  { match: ["orange"], phrase: "orange" },
  { match: ["red"], phrase: "red" },
  { match: ["yellow"], phrase: "yellow" },
  { match: ["beige"], phrase: "beige" },
  { match: ["black"], phrase: "black" },
];

const LIGHT: Entry[] = [
  { match: ["sunset"], phrase: "at sunset" },
  { match: ["sunrise"], phrase: "at sunrise" },
  { match: ["dusk"], phrase: "at dusk" },
  { match: ["dawn"], phrase: "at dawn" },
  { match: ["night", "nighttime"], phrase: "at night" },
  { match: ["illuminated", "lit"], phrase: "illuminated" },
  { match: ["daylight", "daytime"], phrase: "in daylight" },
  { match: ["sunny", "sunlight", "sunlit"], phrase: "in sunlight" },
  { match: ["shadow", "shadows"], phrase: "in shadow" },
  { match: ["cloudy", "overcast"], phrase: "overcast" },
];

const ANGLE: Entry[] = [
  { match: ["aerial", "drone", "overhead"], phrase: "in an aerial view" },
  { match: ["closeup", "close-up", "macro"], phrase: "in close-up" },
  { match: ["panorama", "panoramic"], phrase: "in a panoramic view" },
  { match: ["silhouette", "silhouetted"], phrase: "in silhouette" },
  { match: ["reflection", "reflected"], phrase: "with its reflection" },
  { match: ["underwater"], phrase: "underwater" },
];

// ---------------------------------------------------------------------------
// Matching
// ---------------------------------------------------------------------------
function stem(word: string): string {
  const w = word.toLowerCase().replace(/[^a-z-]/g, "");
  return w.replace(/(ies)$/, "y").replace(/(sses|shes|ches|xes)$/, "").replace(/(ing|ed|es|s)$/, "");
}

function tokenSet(text: string): Set<string> {
  const set = new Set<string>();
  for (const raw of text.toLowerCase().split(/[^a-z0-9-]+/)) {
    if (!raw) continue;
    set.add(raw);
    set.add(stem(raw));
  }
  return set;
}

function fires(entry: Entry, tokens: Set<string>): boolean {
  return entry.match.some((m) => tokens.has(m) || tokens.has(stem(m)));
}

function contentWords(phrase: string): string[] {
  return phrase
    .split(/\s+/)
    .map((w) => w.replace(/[^A-Za-z-]/g, ""))
    .filter((w) => w && !FUNCTION_WORDS.has(w.toLowerCase()));
}

// ---------------------------------------------------------------------------
// Startup guard over the phrase tables
// ---------------------------------------------------------------------------
// Proves, before a single request is made, that no phrase can put a word into
// an alt that its own trigger does not attest.
function auditVocabulary(): void {
  const problems: string[] = [];
  const all: Array<[string, Entry[]]> = [
    ["SUBJECTS", SUBJECTS], ["COLOURS", COLOURS], ["LIGHT", LIGHT], ["ANGLE", ANGLE], ["PEOPLE", [PEOPLE]], ["SKY", [SKY]],
  ];
  for (const [name, entries] of all) {
    for (const entry of entries) {
      const attested = new Set(entry.match.flatMap((m) => [m.toLowerCase(), stem(m)]));
      for (const word of contentWords(entry.phrase)) {
        if (!attested.has(word.toLowerCase()) && !attested.has(stem(word))) {
          problems.push(`${name}: phrase "${entry.phrase}" uses "${word}", which none of [${entry.match.join(", ")}] attests`);
        }
      }
    }
  }
  if (problems.length > 0) {
    console.error("VOCABULARY GUARD FAILED:\n  " + problems.join("\n  "));
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// Composition
// ---------------------------------------------------------------------------
type Tier = "PLACE" | "CITY" | "VISUAL";

interface Composed {
  alt: string;
  tier: Tier;
}

/** Words that may legitimately appear because the day's own placeName supplies them. */
function placeVocabulary(place: string, city: string): Set<string> {
  return tokenSet(`${place} ${city} Egypt`);
}

function titleCase(sentence: string): string {
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function compose(description: string, place: string, city: string, maxWords = 15): Composed | null {
  const tokens = tokenSet(description);

  // Which location words the description itself backs up decides the tier.
  const placeTokens = contentWords(place).filter((w) => w.length > 3);
  const namesPlace = placeTokens.some((w) => tokens.has(w.toLowerCase()) || tokens.has(stem(w)));
  const namesCity = tokens.has(city.toLowerCase()) || tokens.has("egypt") || tokens.has("egyptian");
  const tier: Tier = namesPlace ? "PLACE" : namesCity ? "CITY" : "VISUAL";

  // A subject already named by the placeName adds nothing: "Pyramids at the
  // Great Pyramid of Khufu" is not a description, it is a stutter. Those are
  // dropped, which can leave no subject at all, handled below.
  const placeWords = new Set(contentWords(place).map((w) => stem(w)));
  const redundant = (entry: Entry) => contentWords(entry.phrase).every((w) => placeWords.has(stem(w)));
  const subjects = SUBJECTS.filter((e) => fires(e, tokens) && !redundant(e));

  const light = LIGHT.find((e) => fires(e, tokens));
  const angle = ANGLE.find((e) => fires(e, tokens));
  const people = fires(PEOPLE, tokens);

  // A colour is only used for the noun it actually modifies. "brown pyramid
  // under blue sky" must not become "blue pyramids": the source says the sky is
  // blue and the pyramid is brown, and picking the wrong one is the same class
  // of error this whole script exists to remove. A colour with no noun next to
  // it in the description is dropped rather than guessed at.
  const words = description.toLowerCase().split(/[^a-z0-9-]+/).filter(Boolean);
  const colourFor = (entry: Entry | undefined): Entry | undefined => {
    if (!entry) return undefined;
    const targets = new Set(entry.match.map(stem));
    for (let i = 0; i < words.length; i++) {
      if (!targets.has(stem(words[i]))) continue;
      // Adjectives sit before their noun in these descriptions, optionally with
      // an article or a second adjective between.
      for (let back = 1; back <= 3 && i - back >= 0; back++) {
        const candidate = COLOURS.find((c) => c.match.some((m) => stem(m) === stem(words[i - back])));
        if (candidate) return candidate;
        if (!["a", "an", "the", "of", "clear", "bright", "dark", "pale"].includes(words[i - back])) break;
      }
    }
    return undefined;
  };

  const chosen = subjects.slice(0, 4);
  const colours = chosen.map((e) => colourFor(e));
  const skyColour = fires(SKY, tokens) ? colourFor(SKY) : undefined;
  const skyClause = skyColour ? `under ${/^[aeiou]/i.test(skyColour.phrase) ? "an" : "a"} ${skyColour.phrase} sky` : "";

  const locationClause =
    tier === "PLACE"
      // "at Giza Pyramids in Giza" repeats itself, so the city is dropped when
      // the placeName already contains it.
      ? contentWords(city).every((w) => placeWords.has(stem(w))) ? `at ${place}` : `at ${place} in ${city}`
      : tier === "CITY" ? `in ${city}, Egypt` : "";

  const withColour = (entry: Entry | undefined, colour: Entry | undefined, use: boolean) => {
    if (!entry) return "";
    if (!use || !colour) return entry.phrase;
    const m = entry.phrase.match(/^(a|an|the)\s+(.*)$/i);
    if (!m) return `${colour.phrase} ${entry.phrase}`;
    // "a" before a vowel sound has to become "an", and vice versa.
    const article = m[1].toLowerCase() === "the" ? "the" : /^[aeiou]/i.test(colour.phrase) ? "an" : "a";
    return `${article} ${colour.phrase} ${m[2]}`;
  };

  // Slots are assembled longest-first and then shortened by dropping the
  // optional ones from the end, so the sentence degrades rather than breaks.
  const build = (opts: { colour: boolean; nouns: number; people: boolean; angle: boolean; light: boolean; location: boolean; sky: boolean }) => {
    // Subjects read as a list ("A, B and C"), never as a chain of "and"s.
    const nouns = chosen
      .slice(0, opts.nouns)
      .map((entry, i) => withColour(entry, colours[i], opts.colour))
      .filter(Boolean);
    const head =
      nouns.length === 0
        // Everything the description named is already in the placeName, so the
        // place itself leads and the rest of the sentence qualifies it.
        ? titleCase(locationClause.replace(/^at /, "").replace(/^in /, "")) || place
        : nouns.length === 1
          ? nouns[0]
          : `${nouns.slice(0, -1).join(", ")} and ${nouns[nouns.length - 1]}`;
    const extras = [
      opts.people && people ? PEOPLE.phrase : "",
      opts.angle && angle ? angle.phrase : "",
      opts.location && locationClause && nouns.length > 0 ? locationClause : "",
      opts.sky && skyClause ? skyClause : "",
      opts.light && light ? light.phrase : "",
    ].filter(Boolean);
    return titleCase([head, ...extras].join(" ").replace(/\s+/g, " ").trim());
  };

  if (subjects.length === 0 && tier !== "PLACE") return null;

  const full = { colour: true, nouns: 4, people: true, angle: true, light: true, location: true, sky: true };

  // Built at four nouns first and trimmed back only as far as it has to be, so
  // the sentence keeps as much attested detail as the word budget allows.
  const opts = { ...full };
  let alt = build(opts);
  while (wordCount(alt) > maxWords && opts.nouns > 3) {
    opts.nouns--;
    alt = build(opts);
  }
  const shrinkOrder: Array<"people" | "colour" | "angle" | "sky" | "light"> = ["people", "colour", "angle", "sky", "light"];
  for (const key of shrinkOrder) {
    if (wordCount(alt) <= maxWords) break;
    opts[key] = false;
    alt = build(opts);
  }
  while (wordCount(alt) > maxWords && opts.nouns > 1) {
    opts.nouns--;
    alt = build(opts);
  }

  // Still short: there is nothing honest left to add, so this day keeps the alt
  // it has rather than being padded out with something invented.
  if (wordCount(alt) < 8 || wordCount(alt) > maxWords) return null;

  return { alt, tier };
}

/**
 * Final check on a finished sentence. Belt and braces over auditVocabulary():
 * that one proves the tables are sound, this one proves the assembly did not
 * smuggle anything in.
 */
function assertNoInvention(alt: string, description: string, place: string, city: string, keyword: string | null): string[] {
  const attested = tokenSet(description);
  for (const w of placeVocabulary(place, city)) attested.add(w);
  if (keyword) for (const w of tokenSet(keyword)) attested.add(w);
  // Phrase words are attested by whichever entry emitted them; a phrase can
  // only fire when its match list is present, which auditVocabulary() ties to
  // the phrase's own words.
  for (const entry of [...SUBJECTS, ...COLOURS, ...LIGHT, ...ANGLE, PEOPLE, SKY]) {
    if (fires(entry, attested)) for (const w of contentWords(entry.phrase)) { attested.add(w.toLowerCase()); attested.add(stem(w)); }
  }
  return contentWords(alt).filter((w) => !attested.has(w.toLowerCase()) && !attested.has(stem(w)));
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
const argv = process.argv.slice(2);
const PLAN_ONLY = argv.includes("--plan");
const DRY_RUN = argv.includes("--dry-run");
const SKIP_KEYWORD = argv.includes("--skip-keyword");
const ONLY = argv.filter((a) => a.startsWith("--only=")).map((a) => a.slice("--only=".length));

const SLUGS = [
  "family-tours-egypt",
  "egypt-family-vacation-packages",
  "egypt-tours-family",
  "7-day-egypt-tour",
  "10-day-egypt-tour",
  "12-days-egypt-tour",
];

// ---------------------------------------------------------------------------
// Database
// ---------------------------------------------------------------------------
interface TxClient {
  query(text: string, values?: unknown[]): Promise<{ rows: any[] }>;
  release(): void;
}
const connectable = pool as unknown as { connect(): Promise<TxClient> };

interface ItineraryDayRow {
  day?: number;
  placeName?: string;
  image?: string;
  imageAlt?: string;
  [key: string]: unknown;
}

interface Row {
  slug: string;
  day: number;
  place: string;
  image: string;
  oldAlt: string;
  newAlt: string;
  description: string;
  city: string;
  tier: Tier | "-";
  outcome: "rewritten" | "unchanged" | "kept";
  note: string;
  keyworded: boolean;
}

const rows: Row[] = [];
const notes: string[] = [];
const keywordBySlug = new Map<string, string>();

/** The city the day sits in, taken from the placeName's own tour context. */
const CITY_BY_PLACE: Record<string, string> = {
  "Great Pyramid of Khufu": "Giza", "Giza Pyramids": "Giza", "Red Pyramid of Dahshur": "Giza",
  "Abu Rawash": "Giza", "Saqqara": "Giza", "Step Pyramid of Djoser": "Saqqara",
  "Egyptian Museum": "Cairo", "Coptic Cairo": "Cairo", "Ibn Tulun Mosque": "Cairo",
  "Al-Muizz Street": "Cairo", "Cairo": "Cairo",
  "Karnak Temple": "Luxor", "Valley of the Kings": "Luxor", "Valley of the Queens": "Luxor",
  "Deir el-Medina": "Luxor", "Dendera Temple": "Luxor", "Abydos Temple": "Luxor", "Medinet Habu": "Luxor",
  "Kom Ombo Temple": "Aswan", "Nubian Village": "Aswan", "Elephantine Island": "Aswan",
  "Philae Temple": "Aswan", "Abu Simbel": "Aswan",
  "Qaitbay Citadel": "Alexandria", "Catacombs of Kom el Shoqafa": "Alexandria", "Kom el Dikka": "Alexandria",
  "Siwa Oasis": "Siwa Oasis", "Temple of the Oracle": "Siwa Oasis", "Great Sand Sea": "Siwa Oasis",
  "Cleopatra's Bath": "Siwa Oasis",
  "Hurghada": "Hurghada", "Red Sea": "Hurghada",
};

async function run(): Promise<void> {
  auditVocabulary();
  console.log(`Vocabulary guard passed: ${SUBJECTS.length + COLOURS.length + LIGHT.length + ANGLE.length + 1} phrase(s), none inventing a word.`);

  const slugs = ONLY.length > 0 ? SLUGS.filter((s) => ONLY.includes(s)) : SLUGS;
  if (slugs.length === 0) {
    console.error(`No tour matched --only=. Known slugs:\n  ${SLUGS.join("\n  ")}`);
    process.exit(1);
  }

  if (!PLAN_ONLY && !KEYS.pexels && !KEYS.pixabay && !KEYS.unsplash) {
    console.error("No image provider key is set, so no description can be read. Set PEXELS_API_KEY.");
    process.exit(1);
  }

  const client = await connectable.connect();
  let committed = false;

  try {
    await client.query("BEGIN");

    for (const slug of slugs) {
      const { rows: tourRows } = await client.query(
        `SELECT id, focus_keyword, itinerary, gallery, gallery_alt FROM tours WHERE slug = $1`,
        [slug]
      );
      if (!tourRows[0]) {
        notes.push(`${slug}: tour not found, skipped`);
        continue;
      }
      const tour = tourRows[0];
      const itinerary: ItineraryDayRow[] = Array.isArray(tour.itinerary) ? tour.itinerary : [];
      const gallery: string[] = Array.isArray(tour.gallery) ? tour.gallery : [];
      const galleryAlt: Record<string, string> = { ...(tour.gallery_alt ?? {}) };
      const keyword = String(tour.focus_keyword ?? "").trim();
      if (keyword) keywordBySlug.set(slug, keyword);
      let changed = false;

      for (const day of itinerary) {
        const dayNumber = Number(day.day);
        const place = String(day.placeName ?? "").trim();
        const city = CITY_BY_PLACE[place] ?? place;
        const image = String(day.image ?? "");
        const oldAlt = String(day.imageAlt ?? "");

        const base: Row = {
          slug, day: dayNumber, place, image, oldAlt, newAlt: oldAlt,
          description: "", city, tier: "-", outcome: "kept", note: "", keyworded: false,
        };

        if (!image) {
          rows.push({ ...base, note: "day has no image" });
          continue;
        }
        if (PLAN_ONLY) {
          rows.push({ ...base, outcome: "kept", note: "plan only, no description fetched" });
          continue;
        }

        const filename = image.split("/").pop() ?? "";
        const { rows: mediaRows } = await client.query(
          `SELECT caption FROM media WHERE filename = $1 LIMIT 1`,
          [filename]
        );
        const credit = parseCredit(mediaRows[0]?.caption ?? null);
        if (!credit) {
          rows.push({ ...base, note: "no provider id in media.caption, alt left alone" });
          continue;
        }

        const description = await fetchDescription(credit.provider, credit.id);
        if (description === null) {
          rows.push({ ...base, note: `${credit.provider} did not return photo ${credit.id}, alt left alone` });
          continue;
        }

        const composed = compose(description, place, city);
        if (!composed) {
          // Exactly the case the brief asked to be honest about: the source
          // says too little to describe the picture, so nothing is written.
          rows.push({
            ...base, description,
            note: description.trim()
              ? "description too thin to build an honest 8 word alt, old alt kept"
              : "provider returned an empty description, old alt kept",
          });
          continue;
        }

        const invented = assertNoInvention(composed.alt, description, place, city, null);
        if (invented.length > 0) {
          // Should be unreachable given auditVocabulary(); treated as a bug
          // rather than a content problem, so it stops the run.
          throw new Error(
            `${slug} D${dayNumber}: generated alt "${composed.alt}" contains word(s) not attested by ` +
              `the description "${description}": ${invented.join(", ")}`
          );
        }

        rows.push({
          ...base, description, newAlt: composed.alt, tier: composed.tier,
          outcome: composed.alt === oldAlt ? "unchanged" : "rewritten",
        });
      }

      if (!PLAN_ONLY && !SKIP_KEYWORD && keyword) {
        balanceKeyword(slug, keyword);
      }

      // Write the alts back onto the day objects, leaving image, placeName,
      // lat, lng, title and everything else exactly as they were.
      for (const day of itinerary) {
        const row = rows.find((r) => r.slug === slug && r.day === Number(day.day));
        if (!row || row.newAlt === String(day.imageAlt ?? "")) continue;
        const previous = String(day.imageAlt ?? "");
        day.imageAlt = row.newAlt;
        changed = true;
        // A gallery entry is keyed by image URL and carries its own alt, so a
        // day photo that also appears in the gallery has to be updated there.
        const url = String(day.image ?? "");
        if (url && gallery.includes(url) && galleryAlt[url] === previous) {
          galleryAlt[url] = row.newAlt;
          notes.push(`${slug}: gallery_alt for the day ${day.day} photo updated to match`);
        }
      }

      if (!PLAN_ONLY && changed) {
        await client.query(
          `UPDATE tours SET itinerary = $1::jsonb, gallery_alt = $2::jsonb, updated_at = now() WHERE id = $3`,
          [JSON.stringify(itinerary), JSON.stringify(galleryAlt), tour.id]
        );
      }
    }

    printReport();
    verifyFinalState();

    if (PLAN_ONLY) {
      await client.query("ROLLBACK");
      console.log("\n--plan: nothing was written and no description was fetched.");
    } else if (DRY_RUN) {
      await client.query("ROLLBACK");
      console.log("\n--dry-run: rolled back, nothing was written.");
    } else {
      await client.query("COMMIT");
      committed = true;
      console.log(`\nCOMMITTED. ${rows.filter((r) => r.outcome === "rewritten").length} alt(s) rewritten.`);
      console.log("Next: press “Notify Search Engines” in Admin → Settings.");
    }
  } catch (error) {
    if (!committed) await client.query("ROLLBACK").catch(() => {});
    throw error;
  } finally {
    client.release();
    await (pool as unknown as { end(): Promise<void> }).end();
  }
}

// ---------------------------------------------------------------------------
// Focus keyword balance
// ---------------------------------------------------------------------------
/**
 * Brings a tour to two alts carrying its focus keyword. The keyword is appended
 * as a trailing phrase to days that have room for it, spread across the tour
 * rather than clustered, and never to a day whose sentence names no location
 * (a VISUAL-tier day is the one already least certain about its own subject).
 */
function balanceKeyword(slug: string, keyword: string): void {
  const tourRows = rows.filter((r) => r.slug === slug);
  const carrying = tourRows.filter((r) => r.newAlt.toLowerCase().includes(keyword.toLowerCase()));

  if (carrying.length > 3) {
    for (const row of carrying.slice(3)) {
      const stripped = row.newAlt.replace(new RegExp(`\\s*on this ${keyword}\\b`, "i"), "").trim();
      if (stripped !== row.newAlt && wordCount(stripped) >= 8) {
        row.newAlt = stripped;
        row.keyworded = false;
        notes.push(`${slug} D${row.day}: keyword removed, the tour had ${carrying.length}`);
      }
    }
    return;
  }
  if (carrying.length >= 2) return;

  // "10 day egypt tour" reads badly mid-sentence with a lowercase country, so
  // Egypt is capitalised. The phrase itself is untouched, which is what any
  // keyword check looks at.
  const readable = keyword.replace(/\begypt\b/gi, "Egypt");
  const suffix = ` on this ${readable}`;
  const need = 2 - carrying.length;

  // Day 1 first, then the last day, then the rest ascending: the two ends of an
  // itinerary are where a reader meets the tour, and spreading beats clustering.
  const suffixWords = wordCount(suffix);

  const candidates = tourRows
    .filter((r) => r.outcome === "rewritten" && r.tier !== "VISUAL" && !carrying.includes(r))
    .sort((a, b) => {
      const rank = (r: Row) => (r.day === 1 ? 0 : r.day === Math.max(...tourRows.map((t) => t.day)) ? 1 : 2 + r.day);
      return rank(a) - rank(b);
    });

  let added = 0;
  for (const row of candidates) {
    if (added >= need) break;
    // A sentence built to the full 15 words has no room left, so it is rebuilt
    // against a budget that reserves space for the keyword. Appending to the
    // long version instead would either overflow or force the keyword onto a
    // day that describes less.
    const tightened = compose(row.description, row.place, row.city, 15 - suffixWords);
    if (!tightened) continue;
    const withKeyword = tightened.alt + suffix;
    if (wordCount(withKeyword) > 15) continue;
    row.newAlt = withKeyword;
    row.tier = tightened.tier;
    row.keyworded = true;
    added++;
  }

  if (added < need) {
    notes.push(
      `WARNING ${slug}: focus keyword "${keyword}" ended in ${carrying.length + added} alt(s). ` +
        `Only ${added} of the ${need} needed day(s) could carry it and still describe the photo in 15 words.`
    );
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
function printReport(): void {
  const w = (n: number) => (s: string) => (s.length > n ? s.slice(0, n - 1) + "…" : s).padEnd(n);
  const cols: Array<[number, string]> = [[30, "TOUR"], [3, "DAY"], [24, "PLACENAME"], [7, "TIER"], [10, "OUTCOME"], [4, "WDS"]];
  console.log("\n" + cols.map(([n, h]) => w(n)(h)).join("  "));
  console.log(cols.map(([n]) => "-".repeat(n)).join("  "));
  for (const r of rows) {
    console.log([w(30)(r.slug), w(3)(String(r.day)), w(24)(r.place), w(7)(r.tier), w(10)(r.outcome), w(4)(String(wordCount(r.newAlt)))].join("  "));
  }

  console.log("\nBefore and after, with the evidence each new alt was built from:");
  for (const r of rows) {
    console.log(`\n  ${r.slug} D${r.day} — ${r.place}${r.keyworded ? "  [focus keyword added]" : ""}`);
    console.log(`    the photo's own description: ${r.description ? `"${r.description}"` : "(none)"}`);
    console.log(`    old alt: ${r.oldAlt || "(none)"}`);
    console.log(`    new alt: ${r.outcome === "rewritten" ? r.newAlt : `(unchanged) ${r.newAlt || "(none)"}`}`);
    if (r.note) console.log(`    note: ${r.note}`);
  }

  const kept = rows.filter((r) => r.outcome === "kept" && r.note);
  if (kept.length > 0) {
    console.log(`\n${kept.length} day(s) kept their existing alt. These are the ones to look at by hand:`);
    for (const r of kept) console.log(`  ${r.slug} D${r.day} (${r.place}): ${r.note}`);
  }

  const visual = rows.filter((r) => r.tier === "VISUAL");
  if (visual.length > 0) {
    console.log(`\n${visual.length} day(s) landed in the VISUAL tier: the description confirms neither the site nor`);
    console.log("the city, so the alt names no location. Worth opening these photos to check they are Egypt at all:");
    for (const r of visual) console.log(`  ${r.slug} D${r.day} (${r.place}): "${r.description}"`);
  }

  if (notes.length > 0) {
    console.log("\nNotes:");
    for (const note of notes) console.log(`  ${note}`);
  }
}

/** Last look over what is about to be committed, so the report cannot claim more than is true. */
function verifyFinalState(): void {
  const problems: string[] = [];
  for (const r of rows) {
    if (r.outcome !== "rewritten") continue;
    const words = wordCount(r.newAlt);
    if (words < 8 || words > 15) problems.push(`${r.slug} D${r.day}: new alt is ${words} words`);
    if (/[–—]/.test(r.newAlt)) problems.push(`${r.slug} D${r.day}: new alt contains an em or en dash`);
  }

  console.log("\nFocus keyword balance:");
  for (const slug of new Set(rows.map((r) => r.slug))) {
    const keyword = keywordBySlug.get(slug);
    if (!keyword) continue;
    const tourRows = rows.filter((r) => r.slug === slug);
    // Counted against the tour's actual focus_keyword, over the alts that are
    // about to be written, so this measures the committed state rather than
    // what this run happens to have touched.
    const total = tourRows.filter((r) => r.newAlt.toLowerCase().includes(keyword.toLowerCase())).length;
    const added = tourRows.filter((r) => r.keyworded).length;
    console.log(`  ${slug.padEnd(32)} ${total} alt(s) carry "${keyword}"${added ? ` (${added} added here)` : ""}`);
    if (!PLAN_ONLY && !SKIP_KEYWORD && (total < 2 || total > 3)) {
      problems.push(`${slug}: ${total} alt(s) carry the focus keyword, the convention is 2-3`);
    }
  }

  if (problems.length > 0) {
    console.error("\nFINAL CHECK FAILED:\n  " + problems.join("\n  "));
    throw new Error("the result did not satisfy its own rules, so nothing was committed");
  }
}

run().catch((error) => {
  console.error("\nFAILED, nothing was committed:\n", error instanceof Error ? error.message : error);
  process.exit(1);
});
