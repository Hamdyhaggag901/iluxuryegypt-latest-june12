// Repairs the itinerary day photos that scripts/fill-itinerary-images.ts got
// wrong, and audits the rest.
//
// The original script trusted whatever the first unused search result was. That
// works when a site is well tagged in a stock library and fails badly when it
// is not: a search for "ancient underground catacombs carved stone Egypt"
// returned the catacombs of PARIS, and "scuba diver coral reef Red Sea"
// returned a white yacht. The search query is not evidence about the
// photograph — only the photograph's own metadata is.
//
// So this script inverts the check. For every candidate it reads the
// provider's own description of that photo (Pexels `alt`, Pixabay `tags`,
// Unsplash `alt_description`/`description`/`tags`) and requires that text to
// positively confirm the place, and to contain none of the words that mark a
// known confusion (Paris for catacombs, Hatshepsut for the Valley of the
// Queens, a yacht for a dive site). A candidate that cannot be confirmed is
// rejected, and if every candidate from every query and every provider is
// rejected, THE OLD IMAGE STAYS and the day is reported as unresolved.
// Leaving a known-bad photo in place and saying so is the correct outcome;
// replacing it with a differently-bad photo is not.
//
// ---------------------------------------------------------------------------
// What it does
// ---------------------------------------------------------------------------
//   --audit     Reads all 58 days, re-fetches each photo's metadata from the
//               provider that supplied it, and runs the same confirmation
//               check. This is how days beyond the seven known-bad ones get
//               found. Read-only: no writes, no downloads.
//
//   (repair)    For each targeted day: searches Pexels, then Pixabay, then
//               Unsplash (the same order the admin "Suggest Photo" button
//               uses) across several phrasings, takes the first candidate the
//               guard confirms, downloads it, converts it to WebP through
//               server/image-optimize.ts, writes a relative
//               /api/assets/uploads/ path, writes an alt sentence chosen to
//               match what that photo actually shows, updates any gallery
//               entry pointing at the replaced image, and deletes the old
//               file from disk and from the media table.
//
// ---------------------------------------------------------------------------
// Running it
// ---------------------------------------------------------------------------
//   # Check all 58 first. Network, but no writes.
//   npx tsx scripts/refix-itinerary-images.ts --audit
//
//   # Review the repair plan. No network, no writes.
//   npx tsx scripts/refix-itinerary-images.ts --plan
//
//   # Rehearse: downloads, prints the report, rolls back, removes what it wrote.
//   npx tsx scripts/refix-itinerary-images.ts --dry-run
//
//   # For real.
//   npx tsx scripts/refix-itinerary-images.ts
//
// Flags:
//   --target=<slug>:<day>   repair an extra day the audit flagged (repeatable)
//   --only=<slug>:<day>     repair ONLY these days instead of the default set
//   --keep-old-files        update the database but leave the old files on disk
//
// Needs DATABASE_URL and PEXELS_API_KEY. PIXABAY_API_KEY and
// UNSPLASH_ACCESS_KEY are optional: a provider with no key is skipped with a
// note rather than failing the run.

import "dotenv/config";
import path from "path";
import fs from "fs/promises";
import { randomUUID } from "crypto";
import { pool } from "../server/db";
import { optimizeUploadedImage } from "../server/image-optimize";
import { OUTSIDE_EGYPT as GLOBAL_DENY } from "./lib/provider-images";

// ---------------------------------------------------------------------------
// The 58 days, as fill-itinerary-images.ts left them
// ---------------------------------------------------------------------------
// Deliberately duplicated from that script rather than shared through a module:
// that one has finished its job and been run, and this one needs to be able to
// describe days in terms of what is in the database NOW, which is its output
// rather than its input. `place` here is the placeName the first script wrote.

interface DaySpec {
  day: number;
  place: string;
  city: string;
}

const DAYS: Record<string, DaySpec[]> = {
  "family-tours-egypt": [
    { day: 1, place: "Great Pyramid of Khufu", city: "Giza" },
    { day: 2, place: "Egyptian Museum", city: "Cairo" },
    { day: 3, place: "Karnak Temple", city: "Luxor" },
    { day: 4, place: "Valley of the Kings", city: "Luxor" },
    { day: 5, place: "Kom Ombo Temple", city: "Aswan" },
    { day: 6, place: "Nubian Village", city: "Aswan" },
    { day: 7, place: "Cairo", city: "Cairo" },
  ],
  "egypt-family-vacation-packages": [
    { day: 1, place: "Great Pyramid of Khufu", city: "Giza" },
    { day: 2, place: "Egyptian Museum", city: "Cairo" },
    { day: 3, place: "Step Pyramid of Djoser", city: "Saqqara" },
    { day: 4, place: "Karnak Temple", city: "Luxor" },
    { day: 5, place: "Valley of the Kings", city: "Luxor" },
    { day: 6, place: "Kom Ombo Temple", city: "Aswan" },
    { day: 7, place: "Nubian Village", city: "Aswan" },
    { day: 8, place: "Hurghada", city: "Hurghada" },
    { day: 9, place: "Red Sea", city: "Hurghada" },
    { day: 10, place: "Cairo", city: "Cairo" },
  ],
  "egypt-tours-family": [
    { day: 1, place: "Great Pyramid of Khufu", city: "Giza" },
    { day: 2, place: "Egyptian Museum", city: "Cairo" },
    { day: 3, place: "Qaitbay Citadel", city: "Alexandria" },
    { day: 4, place: "Catacombs of Kom el Shoqafa", city: "Alexandria" },
    { day: 5, place: "Karnak Temple", city: "Luxor" },
    { day: 6, place: "Valley of the Kings", city: "Luxor" },
    { day: 7, place: "Kom Ombo Temple", city: "Aswan" },
    { day: 8, place: "Nubian Village", city: "Aswan" },
    { day: 9, place: "Siwa Oasis", city: "Siwa Oasis" },
    { day: 10, place: "Temple of the Oracle", city: "Siwa Oasis" },
    { day: 11, place: "Cleopatra's Bath", city: "Siwa Oasis" },
    { day: 12, place: "Cairo", city: "Cairo" },
  ],
  "7-day-egypt-tour": [
    { day: 1, place: "Red Pyramid of Dahshur", city: "Giza" },
    { day: 2, place: "Giza Pyramids", city: "Giza" },
    { day: 3, place: "Ibn Tulun Mosque", city: "Cairo" },
    { day: 4, place: "Deir el-Medina", city: "Luxor" },
    { day: 5, place: "Dendera Temple", city: "Luxor" },
    { day: 6, place: "Nubian Village", city: "Aswan" },
    { day: 7, place: "Cairo", city: "Cairo" },
  ],
  "10-day-egypt-tour": [
    { day: 1, place: "Abu Rawash", city: "Giza" },
    { day: 2, place: "Giza Pyramids", city: "Giza" },
    { day: 3, place: "Coptic Cairo", city: "Cairo" },
    { day: 4, place: "Siwa Oasis", city: "Siwa Oasis" },
    { day: 5, place: "Temple of the Oracle", city: "Siwa Oasis" },
    { day: 6, place: "Great Sand Sea", city: "Siwa Oasis" },
    { day: 7, place: "Karnak Temple", city: "Luxor" },
    { day: 8, place: "Abydos Temple", city: "Luxor" },
    { day: 9, place: "Elephantine Island", city: "Aswan" },
    { day: 10, place: "Cairo", city: "Cairo" },
  ],
  "12-days-egypt-tour": [
    { day: 1, place: "Saqqara", city: "Giza" },
    { day: 2, place: "Giza Pyramids", city: "Giza" },
    { day: 3, place: "Catacombs of Kom el Shoqafa", city: "Alexandria" },
    { day: 4, place: "Kom el Dikka", city: "Alexandria" },
    { day: 5, place: "Medinet Habu", city: "Luxor" },
    { day: 6, place: "Valley of the Queens", city: "Luxor" },
    { day: 7, place: "Philae Temple", city: "Aswan" },
    { day: 8, place: "Abu Simbel", city: "Aswan" },
    { day: 9, place: "Hurghada", city: "Hurghada" },
    { day: 10, place: "Red Sea", city: "Hurghada" },
    { day: 11, place: "Al-Muizz Street", city: "Cairo" },
    { day: 12, place: "Cairo", city: "Cairo" },
  ],
};

// ---------------------------------------------------------------------------
// The relevance guard
// ---------------------------------------------------------------------------
// `require` is a list of groups, ALL of which must be satisfied, each by ANY
// one of its tokens appearing in the photo's own description. `deny` rejects
// outright. Matching is whole-word and case-insensitive, so "rome" never
// matches "roman" (which is a legitimate word for a site in Alexandria).

interface Guard {
  require: string[][];
  deny: string[];
}

// Applies to every day on top of its own guard: anywhere that is not Egypt.
//
// This was a local copy of a forty entry list, and it had the same hole as the
// one in lib/provider-images.ts, which let a photograph of Bethlehem through
// for the Theban hills. The list is now shared, so a place added there is
// refused here too. It is the only change to this file since it ran, and it can
// only reject more, never accept more. See the import at the top of the file.

// Every day gets this unless it overrides `require`: the photo has to be
// claimed by its own metadata as being in Egypt, or to name the site itself.
function defaultGuard(spec: DaySpec): Guard {
  const placeTokens = spec.place
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter((w) => w.length > 3 && !["the", "of", "and"].includes(w));
  return {
    require: [["egypt", "egyptian", "nile", spec.city.toLowerCase(), ...placeTokens]],
    deny: [],
  };
}

// ---------------------------------------------------------------------------
// Per-day repair specs
// ---------------------------------------------------------------------------
// `queries` are tried in order against each provider in turn. `altVariants`
// are checked against the chosen photo's description after the pick, so the
// alt text describes the photograph that was actually taken rather than an
// idea of what the search might return. That was the other defect in the
// original script: its alt text was written before the photo existed, so an
// alt could promise "the reassembled solar boat" over a plain pyramid shot.

interface AltVariant {
  when: string[];
  alt: string;
}

interface RepairSpec {
  slug: string;
  day: number;
  queries: string[];
  guard: Guard;
  altVariants: AltVariant[];
  /** Used when no variant matches: claims nothing beyond the place itself. */
  altFallback: string;
  /** Why this day is being repaired, for the report. */
  reason: string;
}

const REPAIRS: RepairSpec[] = [
  {
    slug: "egypt-tours-family",
    day: 4,
    reason: "returned the catacombs of Paris",
    queries: [
      "Kom el Shoqafa catacombs Alexandria",
      "Catacombs of Kom el Shoqafa Egypt",
      "Alexandria Egypt ancient tomb underground",
      "Egyptian rock cut tomb chamber Alexandria",
    ],
    guard: {
      require: [["egypt", "egyptian", "alexandria", "shoqafa", "shuqafa"]],
      deny: ["paris", "catacombes", "ossuary", "skull", "bone", "napoli", "naples", "vienna"],
    },
    altVariants: [
      { when: ["stair", "step", "descend", "spiral", "shaft"],
        alt: "Stone staircase descending into the rock cut catacombs of Kom el Shoqafa" },
      { when: ["column", "pillar", "carv", "relief", "statue", "sculpt"],
        alt: "Carved columns and funerary niches inside the Kom el Shoqafa catacombs, Alexandria" },
      { when: ["tomb", "burial", "sarcophag", "niche", "chamber", "crypt"],
        alt: "Rock cut burial chambers in the Catacombs of Kom el Shoqafa at Alexandria" },
    ],
    altFallback: "Underground burial galleries of the Catacombs of Kom el Shoqafa in Alexandria",
  },
  {
    slug: "egypt-tours-family",
    day: 11,
    reason: "returned a beach with a lifeguard tower",
    queries: [
      "Cleopatra Bath Siwa Oasis spring",
      "Siwa Oasis natural spring Egypt",
      "Siwa Oasis palm grove water Egypt",
      "desert oasis spring palm trees Egypt",
    ],
    guard: {
      require: [["siwa", "oasis", "egypt", "egyptian"]],
      deny: [
        "lifeguard", "beach", "ocean", "surf", "sea", "coast", "resort", "waterpark",
        "swimming pool", "hotel pool", "pamukkale", "hot tub", "spa",
      ],
    },
    altVariants: [
      { when: ["palm", "tree", "grove"],
        alt: "Natural spring pool at Cleopatra's Bath ringed by palm trees in Siwa" },
      { when: ["stone", "wall", "rock", "brick"],
        alt: "Stone rimmed spring of Cleopatra's Bath in the Siwa Oasis, Egypt" },
      { when: ["desert", "sand", "dune"],
        alt: "Cleopatra's Bath spring set against the desert landscape of Siwa Oasis" },
    ],
    altFallback: "Clear spring water of Cleopatra's Bath in the Siwa Oasis, Egypt",
  },
  {
    slug: "10-day-egypt-tour",
    day: 4,
    reason: "returned a generic campsite",
    queries: [
      "Siwa Oasis Egypt palm groves",
      "Siwa Oasis salt lake Egypt",
      "Siwa Oasis mudbrick village Egypt",
      "Egypt Western Desert oasis palm trees",
    ],
    guard: {
      require: [["siwa", "oasis", "egypt", "egyptian"]],
      deny: ["camping", "campsite", "campfire", "tent", "caravan", "motorhome", "rv", "glamping", "backpack"],
    },
    altVariants: [
      { when: ["palm", "grove", "tree", "olive"],
        alt: "Dense palm groves spreading across the Siwa Oasis in Egypt's Western Desert" },
      { when: ["lake", "salt", "water", "pool"],
        alt: "Salt lake reflecting the sky at Siwa Oasis in Egypt's Western Desert" },
      { when: ["mud", "brick", "shali", "fortress", "ruin", "village", "house"],
        alt: "Mudbrick buildings of Siwa Oasis standing against Egypt's Western Desert" },
    ],
    altFallback: "Palm groves and desert edge at Siwa Oasis in Egypt's Western Desert",
  },
  {
    slug: "10-day-egypt-tour",
    day: 6,
    reason: "returned camels at the Giza pyramids",
    queries: [
      "Great Sand Sea Egypt dunes",
      "Egypt Western Desert sand dunes",
      "Sahara sand dunes Egypt landscape",
      "desert dunes Siwa Egypt",
    ],
    guard: {
      require: [["dune", "sand", "desert", "sahara"], ["egypt", "egyptian", "sahara", "siwa", "libyan", "western desert"]],
      deny: ["pyramid", "sphinx", "giza", "cairo", "temple", "city", "road", "car"],
    },
    altVariants: [
      { when: ["sunset", "sunrise", "dusk", "dawn", "golden"],
        alt: "Low sun raking across the dunes of the Great Sand Sea in Egypt" },
      { when: ["dune", "ripple", "wave"],
        alt: "Wind sculpted dunes of the Great Sand Sea stretching across Egypt's Western Desert" },
    ],
    altFallback: "Unbroken sand of the Great Sand Sea in Egypt's Western Desert near Siwa",
  },
  {
    slug: "12-days-egypt-tour",
    day: 4,
    reason: "returned desert",
    queries: [
      "Kom el Dikka Alexandria Roman theatre",
      "Roman amphitheatre Alexandria Egypt",
      "Roman theatre Alexandria Egypt ruins",
      "ancient Roman ruins Alexandria Egypt",
    ],
    guard: {
      require: [["alexandria", "egypt", "egyptian", "dikka"], ["roman", "theatre", "theater", "amphitheatre", "amphitheater", "ruin", "column", "marble"]],
      deny: ["colosseum", "rome", "italy", "greece", "athens", "ephesus", "jerash", "turkey", "desert", "dune", "pyramid", "sphinx"],
    },
    altVariants: [
      { when: ["seat", "tier", "row", "step", "bench"],
        alt: "Tiered stone seating of the Roman theatre at Kom el Dikka in Alexandria" },
      { when: ["column", "marble", "pillar", "colonnade"],
        alt: "Marble columns beside the Roman theatre at Kom el Dikka, Alexandria" },
    ],
    altFallback: "Roman theatre ruins at Kom el Dikka in the centre of Alexandria, Egypt",
  },
  {
    slug: "12-days-egypt-tour",
    day: 6,
    reason: "returned the Temple of Hatshepsut",
    queries: [
      "Valley of the Queens Luxor Egypt",
      "Valley of the Queens tomb Egypt",
      "Luxor west bank tomb entrance Egypt",
      "ancient Egyptian painted tomb Luxor",
    ],
    guard: {
      require: [["queen", "tomb", "luxor", "theban", "thebes", "valley"], ["egypt", "egyptian", "luxor", "nile", "thebes"]],
      deny: [
        "hatshepsut", "deir el-bahari", "deir el bahari", "mortuary temple", "terrace",
        "karnak", "abu simbel", "philae", "pyramid", "sphinx", "giza",
      ],
    },
    altVariants: [
      { when: ["paint", "colour", "color", "relief", "wall", "fresco", "hieroglyph"],
        alt: "Painted tomb wall in the Valley of the Queens on Luxor's west bank" },
      { when: ["entrance", "door", "chamber", "corridor", "tomb"],
        alt: "Rock cut tomb entrance in the Valley of the Queens on Luxor's west bank" },
      { when: ["hill", "cliff", "rock", "desert", "valley", "mountain"],
        alt: "Barren cliffs enclosing the Valley of the Queens on the Luxor west bank" },
    ],
    altFallback: "Desert valley holding the royal tombs of the Valley of the Queens at Luxor",
  },
  {
    slug: "12-days-egypt-tour",
    day: 10,
    reason: "returned a generic white yacht",
    queries: [
      "Red Sea scuba diving coral reef Egypt",
      "Red Sea underwater coral reef fish",
      "scuba diver coral reef underwater",
      "Hurghada diving underwater Egypt",
    ],
    guard: {
      // The failure here was a photo taken ABOVE the water. Requiring an
      // underwater subject is the whole point of this day's guard.
      require: [["underwater", "diver", "diving", "scuba", "snorkel", "coral", "reef", "fish"]],
      deny: ["yacht", "sailboat", "sailing", "marina", "harbour", "harbor", "cruise ship", "deck", "aquarium", "pool"],
    },
    altVariants: [
      { when: ["diver", "scuba", "snorkel"],
        alt: "Diver gliding above a coral reef in the clear water of the Red Sea" },
      { when: ["fish", "shoal", "school"],
        alt: "Shoal of reef fish over coral in the clear water of the Red Sea" },
      { when: ["coral", "reef", "anemone"],
        alt: "Coral reef growing in the clear shallow water of the Red Sea off Hurghada" },
    ],
    altFallback: "Underwater view of the Red Sea reef off the Hurghada coast in Egypt",
  },
];

// A day added with --target= has no hand-written spec, so one is derived from
// its placeName. Weaker than a curated spec, but the guard still applies and
// the alt still claims nothing the photo cannot support.
function deriveSpec(slug: string, day: number): RepairSpec {
  const spec = DAYS[slug]?.find((d) => d.day === day);
  if (!spec) throw new Error(`Unknown day: ${slug}:${day}`);
  const article = /^[aeiou]/i.test(spec.place) ? "an" : "a";
  return {
    slug,
    day,
    reason: "flagged manually with --target",
    queries: [
      `${spec.place} ${spec.city} Egypt`,
      `${spec.place} Egypt`,
      `${spec.city} Egypt landmark`,
    ],
    guard: defaultGuard(spec),
    altVariants: [],
    altFallback:
      spec.place === spec.city
        ? `View across ${spec.place} in Egypt on a clear day during the tour`
        : `View of ${spec.place} ${article === "an" ? "" : ""}in ${spec.city}, Egypt, during the tour`.replace(/\s+/g, " "),
  };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
const argv = process.argv.slice(2);
const AUDIT = argv.includes("--audit");
const PLAN_ONLY = argv.includes("--plan");
const DRY_RUN = argv.includes("--dry-run");
const KEEP_OLD_FILES = argv.includes("--keep-old-files");
const parsePairs = (prefix: string) =>
  argv.filter((a) => a.startsWith(prefix)).map((a) => {
    const [slug, day] = a.slice(prefix.length).split(":");
    if (!slug || !day || Number.isNaN(Number(day))) {
      console.error(`Malformed ${prefix} value: "${a}". Expected ${prefix}<slug>:<day>.`);
      process.exit(1);
    }
    return { slug, day: Number(day) };
  });
const EXTRA = parsePairs("--target=");
const ONLY = parsePairs("--only=");

const UPLOAD_DIR = path.resolve(import.meta.dirname, "..", "attached_assets", "uploads");
const UPLOAD_URL_PREFIX = "/api/assets/uploads/";
const CONTENT_MAX_WIDTH = 1600;
const PER_PAGE = 20;

// Matches the throttles server/routes.ts already applies to these three APIs.
const SPACING_MS: Record<Provider, number> = { pexels: 1100, pixabay: 1100, unsplash: 1400 };

// ---------------------------------------------------------------------------
// Providers
// ---------------------------------------------------------------------------
type Provider = "pexels" | "pixabay" | "unsplash";

interface Candidate {
  provider: Provider;
  id: string;
  fullUrl: string;
  /** The provider's OWN description of the photo. The guard reads only this. */
  description: string;
  photographer: string;
  pageUrl: string;
  /** Unsplash asks to be pinged when a photo is actually downloaded. */
  downloadLocation?: string;
}

const KEYS: Record<Provider, string> = {
  pexels: (process.env.PEXELS_API_KEY ?? "").trim(),
  pixabay: (process.env.PIXABAY_API_KEY ?? "").trim(),
  unsplash: (process.env.UNSPLASH_ACCESS_KEY ?? "").trim(),
};

// Overridable so the whole path can be exercised against a local receiver
// during testing. All three are unset in production.
const BASES: Record<Provider, string> = {
  pexels: process.env.PEXELS_API_BASE?.trim() || "https://api.pexels.com/v1",
  pixabay: process.env.PIXABAY_API_BASE?.trim() || "https://pixabay.com/api",
  unsplash: process.env.UNSPLASH_API_BASE?.trim() || "https://api.unsplash.com",
};

const lastCall: Record<Provider, number> = { pexels: 0, pixabay: 0, unsplash: 0 };
async function throttle(provider: Provider): Promise<void> {
  const wait = SPACING_MS[provider] - (Date.now() - lastCall[provider]);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastCall[provider] = Date.now();
}

const searchCache = new Map<string, Candidate[]>();

async function search(provider: Provider, query: string): Promise<Candidate[]> {
  const key = `${provider}::${query}`;
  const cached = searchCache.get(key);
  if (cached) return cached;
  if (!KEYS[provider]) return [];

  await throttle(provider);
  let out: Candidate[] = [];

  try {
    if (provider === "pexels") {
      const url = new URL(`${BASES.pexels}/search`);
      url.searchParams.set("query", query);
      url.searchParams.set("per_page", String(PER_PAGE));
      url.searchParams.set("orientation", "landscape");
      const r = await fetch(url, { headers: { Authorization: KEYS.pexels } });
      if (!r.ok) throw new Error(`Pexels responded with ${r.status}`);
      const data = (await r.json()) as { photos?: any[] };
      out = (data.photos ?? []).map((p) => ({
        provider,
        id: String(p.id),
        fullUrl: p.src?.large2x || p.src?.large || p.src?.original,
        description: String(p.alt ?? ""),
        photographer: String(p.photographer ?? ""),
        pageUrl: String(p.url ?? ""),
      }));
    } else if (provider === "pixabay") {
      const url = new URL(`${BASES.pixabay}/`);
      url.searchParams.set("key", KEYS.pixabay);
      url.searchParams.set("q", query);
      url.searchParams.set("image_type", "photo");
      url.searchParams.set("orientation", "horizontal");
      url.searchParams.set("per_page", String(PER_PAGE));
      url.searchParams.set("safesearch", "true");
      const r = await fetch(url);
      if (!r.ok) throw new Error(`Pixabay responded with ${r.status}`);
      const data = (await r.json()) as { hits?: any[] };
      out = (data.hits ?? []).map((h) => ({
        provider,
        id: String(h.id),
        fullUrl: h.largeImageURL,
        description: String(h.tags ?? ""),
        photographer: String(h.user ?? ""),
        pageUrl: String(h.pageURL ?? ""),
      }));
    } else {
      const url = new URL(`${BASES.unsplash}/search/photos`);
      url.searchParams.set("query", query);
      url.searchParams.set("per_page", String(PER_PAGE));
      url.searchParams.set("orientation", "landscape");
      const r = await fetch(url, { headers: { Authorization: `Client-ID ${KEYS.unsplash}` } });
      if (!r.ok) throw new Error(`Unsplash responded with ${r.status}`);
      const data = (await r.json()) as { results?: any[] };
      out = (data.results ?? []).map((u) => ({
        provider,
        id: String(u.id),
        fullUrl: u.urls?.regular,
        // Three fields concatenated: Unsplash spreads its description across
        // all of them and any one alone is often empty.
        description: [u.alt_description, u.description, (u.tags ?? []).map((t: any) => t?.title).join(" ")]
          .filter(Boolean)
          .join(" "),
        photographer: String(u.user?.name ?? ""),
        pageUrl: String(u.links?.html ?? ""),
        downloadLocation: u.links?.download_location,
      }));
    }
  } catch (error) {
    console.warn(`  ! ${provider} search failed for "${query}": ${error instanceof Error ? error.message : error}`);
    out = [];
  }

  out = out.filter((c) => c.fullUrl);
  searchCache.set(key, out);
  return out;
}

/** Re-reads one already-chosen photo's metadata, for --audit. */
async function fetchPhotoMeta(provider: Provider, id: string): Promise<string | null> {
  if (!KEYS[provider]) return null;
  await throttle(provider);
  try {
    if (provider === "pexels") {
      const r = await fetch(`${BASES.pexels}/photos/${id}`, { headers: { Authorization: KEYS.pexels } });
      if (!r.ok) return null;
      const p = (await r.json()) as any;
      return String(p.alt ?? "");
    }
    if (provider === "pixabay") {
      const url = new URL(`${BASES.pixabay}/`);
      url.searchParams.set("key", KEYS.pixabay);
      url.searchParams.set("id", id);
      const r = await fetch(url);
      if (!r.ok) return null;
      const data = (await r.json()) as { hits?: any[] };
      return data.hits?.[0] ? String(data.hits[0].tags ?? "") : null;
    }
    const r = await fetch(`${BASES.unsplash}/photos/${id}`, {
      headers: { Authorization: `Client-ID ${KEYS.unsplash}` },
    });
    if (!r.ok) return null;
    const u = (await r.json()) as any;
    return [u.alt_description, u.description].filter(Boolean).join(" ");
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// The guard itself
// ---------------------------------------------------------------------------
function hasToken(haystack: string, token: string): boolean {
  const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Whole-word so "rome" never matches "roman" and "sea" never matches "search".
  return new RegExp(`\\b${escaped}\\b`, "i").test(haystack);
}

interface Verdict {
  ok: boolean;
  reason: string;
}

function checkRelevance(description: string, guard: Guard): Verdict {
  const text = description.trim();
  if (!text) {
    // No description at all means nothing confirms the place. Under this
    // script's rule that is a rejection, not a shrug.
    return { ok: false, reason: "provider gave no description, so the place cannot be confirmed" };
  }

  for (const token of [...guard.deny, ...GLOBAL_DENY]) {
    if (hasToken(text, token)) return { ok: false, reason: `description mentions "${token}"` };
  }

  for (const group of guard.require) {
    if (!group.some((token) => hasToken(text, token))) {
      return { ok: false, reason: `description confirms none of: ${group.slice(0, 6).join(", ")}` };
    }
  }

  return { ok: true, reason: "confirmed by the provider's own description" };
}

function chooseAlt(spec: RepairSpec, description: string): string {
  for (const variant of spec.altVariants) {
    if (variant.when.some((token) => hasToken(description, token))) return variant.alt;
  }
  return spec.altFallback;
}

// ---------------------------------------------------------------------------
// Guards over the curated copy, run before anything touches the network
// ---------------------------------------------------------------------------
function runStaticGuards(): void {
  const problems: string[] = [];
  const seen = new Set<string>();

  for (const spec of REPAIRS) {
    const label = `${spec.slug} D${spec.day}`;
    const key = `${spec.slug}:${spec.day}`;
    if (seen.has(key)) problems.push(`${label}: listed twice in REPAIRS`);
    seen.add(key);

    if (!DAYS[spec.slug]?.some((d) => d.day === spec.day)) problems.push(`${label}: not a known day`);
    if (spec.queries.length < 2) problems.push(`${label}: only ${spec.queries.length} query phrasing(s), want at least 2`);
    if (spec.guard.require.length === 0) problems.push(`${label}: guard requires nothing, so it would confirm anything`);

    for (const alt of [...spec.altVariants.map((v) => v.alt), spec.altFallback]) {
      const words = alt.trim().split(/\s+/).length;
      if (words < 8 || words > 15) problems.push(`${label}: alt is ${words} words (want 8-15) -> "${alt}"`);
      if (/[–—]/.test(alt)) problems.push(`${label}: alt contains an em or en dash`);
    }

    // A deny token that also appears in a require group would make the guard
    // unsatisfiable, and the day could never be repaired.
    for (const token of spec.guard.deny) {
      if (spec.guard.require.some((g) => g.includes(token))) {
        problems.push(`${label}: "${token}" is both required and denied`);
      }
    }
    for (const token of GLOBAL_DENY) {
      if (spec.guard.require.some((g) => g.includes(token))) {
        problems.push(`${label}: "${token}" is required here but denied globally`);
      }
    }
  }

  if (problems.length > 0) {
    console.error("GUARD FAILURES:\n  " + problems.join("\n  "));
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// Database
// ---------------------------------------------------------------------------
// server/db.ts exports either a Neon pool or a node-postgres pool; only
// connect/query/release are used here and both expose them identically.
interface TxClient {
  query(text: string, values?: unknown[]): Promise<{ rows: any[] }>;
  release(): void;
}
const connectable = pool as unknown as { connect(): Promise<TxClient> };

interface ItineraryDayRow {
  day?: number;
  title?: string;
  placeName?: string;
  image?: string;
  imageAlt?: string;
  [key: string]: unknown;
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

// ---------------------------------------------------------------------------
// Audit
// ---------------------------------------------------------------------------
async function runAudit(client: TxClient): Promise<void> {
  console.log("Auditing all 58 day photos against the metadata of the photo each one actually is.\n");

  const known = new Set(REPAIRS.map((r) => `${r.slug}:${r.day}`));
  const rows: Array<{ slug: string; day: number; place: string; verdict: string; detail: string; description: string }> = [];

  for (const [slug, days] of Object.entries(DAYS)) {
    const { rows: tourRows } = await client.query(
      `SELECT itinerary FROM tours WHERE slug = $1`,
      [slug]
    );
    if (!tourRows[0]) {
      console.warn(`! tour "${slug}" not found, skipped`);
      continue;
    }
    const itinerary: ItineraryDayRow[] = tourRows[0].itinerary ?? [];

    for (const spec of days) {
      const stored = itinerary.find((d) => Number(d.day) === spec.day);
      const image = String(stored?.image ?? "");
      const label = `${slug}:${spec.day}`;

      if (!image) {
        rows.push({ slug, day: spec.day, place: spec.place, verdict: "NO IMAGE", detail: "day has no image", description: "" });
        continue;
      }
      if (known.has(label)) {
        rows.push({ slug, day: spec.day, place: spec.place, verdict: "KNOWN BAD", detail: REPAIRS.find((r) => `${r.slug}:${r.day}` === label)!.reason, description: "" });
        continue;
      }

      const filename = image.split("/").pop() ?? "";
      const { rows: mediaRows } = await client.query(`SELECT caption FROM media WHERE filename = $1 LIMIT 1`, [filename]);
      const credit = parseCredit(mediaRows[0]?.caption ?? null);
      if (!credit) {
        rows.push({ slug, day: spec.day, place: spec.place, verdict: "UNCHECKED", detail: "no provider id in media.caption", description: "" });
        continue;
      }

      const description = await fetchPhotoMeta(credit.provider, credit.id);
      if (description === null) {
        rows.push({ slug, day: spec.day, place: spec.place, verdict: "UNCHECKED", detail: `${credit.provider} did not return photo ${credit.id}`, description: "" });
        continue;
      }

      const verdict = checkRelevance(description, defaultGuard(spec));
      rows.push({
        slug,
        day: spec.day,
        place: spec.place,
        verdict: verdict.ok ? "OK" : "SUSPECT",
        detail: verdict.reason,
        description,
      });
    }
  }

  const width = (n: number) => (s: string) => (s.length > n ? s.slice(0, n - 1) + "…" : s).padEnd(n);
  console.log(
    width(30)("TOUR") + "  " + width(3)("DAY") + "  " + width(28)("PLACENAME") + "  " +
    width(10)("VERDICT") + "  " + width(52)("WHAT THE PHOTO'S OWN DESCRIPTION SAYS")
  );
  console.log("-".repeat(30) + "  " + "-".repeat(3) + "  " + "-".repeat(28) + "  " + "-".repeat(10) + "  " + "-".repeat(52));
  for (const r of rows) {
    console.log(
      width(30)(r.slug) + "  " + width(3)(String(r.day)) + "  " + width(28)(r.place) + "  " +
      width(10)(r.verdict) + "  " + width(52)(r.description || r.detail)
    );
  }

  const suspect = rows.filter((r) => r.verdict === "SUSPECT");
  console.log(`\n${rows.filter((r) => r.verdict === "OK").length} confirmed, ${suspect.length} suspect, ` +
    `${rows.filter((r) => r.verdict === "KNOWN BAD").length} already queued for repair, ` +
    `${rows.filter((r) => r.verdict === "UNCHECKED").length} not checkable.`);

  if (suspect.length > 0) {
    console.log("\nSuspect days, with why:");
    for (const r of suspect) console.log(`  ${r.slug} D${r.day} (${r.place}): ${r.detail}\n      "${r.description}"`);
    console.log("\nTo repair these as well, re-run the repair with:");
    console.log("  " + suspect.map((r) => `--target=${r.slug}:${r.day}`).join(" "));
  }

  console.log(
    "\nNote: SUSPECT means the provider's description does not confirm the place, which is " +
    "not proof the photo is wrong. Open the ones listed above before deciding."
  );
}

// ---------------------------------------------------------------------------
// Repair
// ---------------------------------------------------------------------------
interface ReportRow {
  slug: string;
  day: number;
  place: string;
  outcome: "replaced" | "unresolved";
  oldImage: string;
  newImage: string;
  provider: string;
  query: string;
  description: string;
  alt: string;
  rejected: number;
  detail: string;
  /** Populated only for an unresolved day: what was offered and why it failed. */
  rejections?: string[];
}

const report: ReportRow[] = [];
const galleryNotes: string[] = [];
const writtenFiles: string[] = [];
/** Old files to remove, but only once the transaction has actually committed. */
const pendingDeletes: string[] = [];

async function downloadAndOptimise(candidate: Candidate): Promise<{ url: string; filename: string; size: number }> {
  // Unsplash's API terms ask for a download ping whenever a photo is actually
  // used, separate from the search call. Failure here is not fatal.
  if (candidate.provider === "unsplash" && candidate.downloadLocation && KEYS.unsplash) {
    await fetch(candidate.downloadLocation, { headers: { Authorization: `Client-ID ${KEYS.unsplash}` } }).catch(() => {});
  }

  const response = await fetch(candidate.fullUrl);
  if (!response.ok) throw new Error(`Failed to download ${candidate.provider} photo ${candidate.id} (${response.status})`);
  const buffer = Buffer.from(await response.arrayBuffer());

  const tempName = `${randomUUID()}.jpg`;
  await fs.writeFile(path.join(UPLOAD_DIR, tempName), buffer);
  writtenFiles.push(path.join(UPLOAD_DIR, tempName));

  const optimised = await optimizeUploadedImage(UPLOAD_DIR, tempName, CONTENT_MAX_WIDTH);
  if (!optimised) throw new Error(`Optimisation returned nothing for ${candidate.provider} photo ${candidate.id}`);
  writtenFiles.push(path.join(UPLOAD_DIR, optimised.filename));

  return { url: `${UPLOAD_URL_PREFIX}${optimised.filename}`, filename: optimised.filename, size: optimised.size };
}

/**
 * Walks provider by provider, query by query, and returns the first candidate
 * the guard confirms. Returns null (rather than a best effort) when nothing
 * passes, which is what keeps the old photo in place.
 */
type PhotoSearchResult =
  | { candidate: Candidate; query: string; rejected: number; rejectionsByReason: string[] }
  | { rejected: number; rejectionsByReason: string[] };

async function findConfirmedPhoto(spec: RepairSpec, usedIds: Set<string>): Promise<PhotoSearchResult> {
  const providers: Provider[] = ["pexels", "pixabay", "unsplash"];
  let rejected = 0;
  const rejectionsByReason: string[] = [];

  for (const provider of providers) {
    if (!KEYS[provider]) {
      rejectionsByReason.push(`${provider}: no API key configured, skipped`);
      continue;
    }
    for (const query of spec.queries) {
      const candidates = await search(provider, query);
      for (const candidate of candidates) {
        if (usedIds.has(`${candidate.provider}:${candidate.id}`)) continue;
        const verdict = checkRelevance(candidate.description, spec.guard);
        if (verdict.ok) {
          usedIds.add(`${candidate.provider}:${candidate.id}`);
          return { candidate, query, rejected, rejectionsByReason };
        }
        rejected++;
        if (rejectionsByReason.length < 12) {
          rejectionsByReason.push(`${provider} ${candidate.id}: ${verdict.reason} ("${candidate.description.slice(0, 70)}")`);
        }
      }
    }
  }

  return { rejected, rejectionsByReason };
}

/** Every place a filename could still be referenced, so nothing in use is deleted. */
async function isStillReferenced(client: TxClient, url: string, excludeTour: string): Promise<boolean> {
  const { rows } = await client.query(
    `SELECT
       (SELECT count(*) FROM tours t, jsonb_array_elements(t.itinerary) d
          WHERE d->>'image' = $1 AND t.slug <> $2) +
       (SELECT count(*) FROM tours WHERE (($1 = ANY(gallery)) OR hero_image = $1) AND slug <> $2) +
       (SELECT count(*) FROM hotels WHERE image = $1 OR $1 = ANY(gallery)) +
       (SELECT count(*) FROM categories WHERE image = $1) +
       (SELECT count(*) FROM destinations WHERE hero_image = $1 OR $1 = ANY(gallery)) AS refs`,
    [url, excludeTour]
  );
  return Number(rows[0]?.refs ?? 0) > 0;
}

async function run(): Promise<void> {
  runStaticGuards();

  const configured = (Object.keys(KEYS) as Provider[]).filter((p) => KEYS[p]);
  const missing = (Object.keys(KEYS) as Provider[]).filter((p) => !KEYS[p]);

  const client = await connectable.connect();
  let committed = false;

  try {
    if (AUDIT) {
      if (!KEYS.pexels) {
        console.error("PEXELS_API_KEY is not set, and every current photo came from Pexels. Nothing to audit against.");
        process.exit(1);
      }
      await runAudit(client);
      return;
    }

    console.log(`Providers configured: ${configured.join(", ") || "none"}${missing.length ? `  (skipped: ${missing.join(", ")})` : ""}`);
    if (!PLAN_ONLY && configured.length === 0) {
      console.error("No image provider is configured. Set at least PEXELS_API_KEY.");
      process.exit(1);
    }

    // Build the work list.
    let specs: RepairSpec[];
    if (ONLY.length > 0) {
      specs = ONLY.map(({ slug, day }) => REPAIRS.find((r) => r.slug === slug && r.day === day) ?? deriveSpec(slug, day));
    } else {
      specs = [...REPAIRS, ...EXTRA.map(({ slug, day }) => deriveSpec(slug, day))];
    }
    console.log(`Repairing ${specs.length} day(s).\n`);

    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await client.query("BEGIN");

    const { rows: userRows } = await client.query(
      `SELECT id FROM users WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1`
    );
    const uploader: string | null = userRows[0]?.id ?? null;

    // Seeded with every photo already in use, so a repair never lands on a
    // photo another day is already showing.
    const usedIds = new Set<string>();
    const { rows: existingCredits } = await client.query(
      `SELECT caption FROM media WHERE caption ILIKE '%pexels%' OR caption ILIKE '%pixabay%' OR caption ILIKE '%unsplash%'`
    );
    for (const row of existingCredits) {
      const credit = parseCredit(row.caption);
      if (credit) usedIds.add(`${credit.provider}:${credit.id}`);
    }

    // Grouped by tour so each tour's itinerary and gallery are written once.
    const bySlug = new Map<string, RepairSpec[]>();
    for (const spec of specs) {
      if (!bySlug.has(spec.slug)) bySlug.set(spec.slug, []);
      bySlug.get(spec.slug)!.push(spec);
    }

    for (const [slug, tourSpecs] of bySlug) {
      const { rows } = await client.query(
        `SELECT id, itinerary, gallery, gallery_alt FROM tours WHERE slug = $1`,
        [slug]
      );
      if (!rows[0]) throw new Error(`Tour "${slug}" was not found.`);
      const tour = rows[0];
      const itinerary: ItineraryDayRow[] = Array.isArray(tour.itinerary) ? tour.itinerary : [];
      let gallery: string[] = Array.isArray(tour.gallery) ? [...tour.gallery] : [];
      const galleryAlt: Record<string, string> = { ...(tour.gallery_alt ?? {}) };

      let tourChanged = false;
      let galleryChanged = false;
      const retirable: Array<{ url: string; slug: string; day: number }> = [];

      for (const spec of tourSpecs) {
        const dayInfo = DAYS[slug].find((d) => d.day === spec.day)!;
        const stored = itinerary.find((d) => Number(d.day) === spec.day);
        if (!stored) throw new Error(`Tour "${slug}" has no day ${spec.day}`);
        const oldImage = String(stored.image ?? "");

        if (PLAN_ONLY) {
          report.push({
            slug, day: spec.day, place: dayInfo.place, outcome: "replaced",
            oldImage, newImage: "(would be downloaded)",
            provider: configured.join(" then ") || "none",
            query: spec.queries.join("  |  "),
            description: "", alt: `${spec.altVariants.length} variant(s) + fallback`,
            rejected: 0, detail: spec.reason,
          });
          continue;
        }

        const found = await findConfirmedPhoto(spec, usedIds);

        if (!("candidate" in found)) {
          // The whole point of this script. Nothing confirmed, so nothing
          // changes: the day keeps the photo it has. The rejection reasons go
          // into the report, because "no photo could be found" is only
          // actionable if you can see what was offered and why it was refused.
          report.push({
            slug, day: spec.day, place: dayInfo.place, outcome: "unresolved",
            oldImage, newImage: oldImage, provider: "", query: spec.queries.join(" | "),
            description: "", alt: String(stored.imageAlt ?? ""), rejected: found.rejected,
            detail: "no candidate could be confirmed, old image kept",
            rejections: found.rejectionsByReason,
          });
          console.warn(`  ! ${slug} D${spec.day} (${dayInfo.place}): nothing confirmed out of ${found.rejected} candidate(s), keeping the old image.`);
          continue;
        }

        const saved = await downloadAndOptimise(found.candidate);
        const alt = chooseAlt(spec, found.candidate.description);
        const credit =
          `Photo by ${found.candidate.photographer} on ` +
          `${found.candidate.provider[0].toUpperCase()}${found.candidate.provider.slice(1)}` +
          `${found.candidate.pageUrl ? ` (${found.candidate.pageUrl})` : ""}`;

        stored.image = saved.url;
        stored.imageAlt = alt;
        tourChanged = true;

        await client.query(
          `INSERT INTO media (filename, original_name, mime_type, size, url, alt_en, caption, uploaded_by)
           VALUES ($1, $2, 'image/webp', $3, $4, $5, $6, $7)`,
          [
            saved.filename,
            `${found.candidate.provider}-${dayInfo.place.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
            saved.size, saved.url, alt, credit, uploader,
          ]
        );

        // Gallery entries point at the day image by URL, so a replaced day
        // photo has to be swapped there too and its alt key moved with it.
        const index = gallery.indexOf(oldImage);
        if (index !== -1) {
          gallery[index] = saved.url;
          delete galleryAlt[oldImage];
          galleryAlt[saved.url] = alt;
          galleryChanged = true;
          galleryNotes.push(`${slug}: gallery slot ${index + 1} repointed from the day ${spec.day} photo to its replacement`);
        }

        // Retiring the old file is deferred until after this tour's itinerary
        // and gallery have been written. Checking now would still see the old
        // URL in the tour's own gallery column and conclude, wrongly, that the
        // file is in use somewhere else.
        if (oldImage && oldImage.startsWith(UPLOAD_URL_PREFIX)) {
          retirable.push({ url: oldImage, slug, day: spec.day });
        }

        report.push({
          slug, day: spec.day, place: dayInfo.place, outcome: "replaced",
          oldImage, newImage: saved.url, provider: found.candidate.provider,
          query: found.query, description: found.candidate.description, alt,
          rejected: found.rejected, detail: spec.reason,
        });
      }

      if (!PLAN_ONLY && tourChanged) {
        await client.query(`UPDATE tours SET itinerary = $1::jsonb, updated_at = now() WHERE id = $2`, [
          JSON.stringify(itinerary),
          tour.id,
        ]);
      }
      if (!PLAN_ONLY && galleryChanged) {
        await client.query(
          `UPDATE tours SET gallery = $1::text[], gallery_alt = $2::jsonb, updated_at = now() WHERE id = $3`,
          [gallery, JSON.stringify(galleryAlt), tour.id]
        );
      }

      // Now that this tour no longer points at them, the old files can be
      // retired, but only if nothing ELSE does. A photo shared with another
      // tour, a hotel or a destination stays exactly where it is.
      for (const old of retirable) {
        if (await isStillReferenced(client, old.url, slug)) {
          galleryNotes.push(`${slug} D${old.day}: old file kept on disk, still used elsewhere (${old.url})`);
          continue;
        }
        await client.query(`DELETE FROM media WHERE url = $1`, [old.url]);
        if (!KEEP_OLD_FILES) pendingDeletes.push(path.join(UPLOAD_DIR, old.url.slice(UPLOAD_URL_PREFIX.length)));
      }
    }

    if (!PLAN_ONLY) await verifyKeywordBalance(client);
    printReport();

    if (PLAN_ONLY) {
      await client.query("ROLLBACK");
      console.log("\n--plan: nothing was written and nothing was downloaded.");
    } else if (DRY_RUN) {
      await client.query("ROLLBACK");
      for (const file of writtenFiles) await fs.unlink(file).catch(() => {});
      console.log(`\n--dry-run: rolled back. Removed ${writtenFiles.length} newly written file(s); no old file was deleted.`);
    } else {
      await client.query("COMMIT");
      committed = true;
      // Only now, with the transaction durable, are the old files removed.
      // Doing it earlier would leave the site pointing at deleted files if the
      // transaction failed.
      let deleted = 0;
      for (const file of pendingDeletes) {
        await fs.unlink(file).then(() => { deleted++; }).catch(() => {});
      }
      console.log(`\nCOMMITTED. ${report.filter((r) => r.outcome === "replaced").length} photo(s) replaced, ${deleted} old file(s) deleted.`);
      const unresolved = report.filter((r) => r.outcome === "unresolved");
      if (unresolved.length > 0) {
        console.log(`${unresolved.length} day(s) kept their old image because nothing could be confirmed. See the table above.`);
      }
      console.log("Next: press “Notify Search Engines” in Admin → Settings.");
    }
  } catch (error) {
    if (!committed) {
      await client.query("ROLLBACK").catch(() => {});
      for (const file of writtenFiles) await fs.unlink(file).catch(() => {});
    }
    throw error;
  } finally {
    client.release();
    await (pool as unknown as { end(): Promise<void> }).end();
  }
}

/**
 * The original script put each tour's focus keyword in exactly two or three
 * day alts. Rewriting an alt could quietly drop one, so the balance is
 * re-checked against the whole itinerary before the report is printed.
 */
async function verifyKeywordBalance(client: TxClient): Promise<void> {
  const touched = new Set(report.map((r) => r.slug));
  for (const slug of touched) {
    const { rows } = await client.query(`SELECT focus_keyword, itinerary FROM tours WHERE slug = $1`, [slug]);
    const keyword = String(rows[0]?.focus_keyword ?? "").toLowerCase();
    if (!keyword) continue;
    const days: ItineraryDayRow[] = rows[0].itinerary ?? [];
    const count = days.filter((d) => String(d.imageAlt ?? "").toLowerCase().includes(keyword)).length;
    if (count < 2 || count > 3) {
      galleryNotes.push(
        `WARNING ${slug}: focus keyword "${keyword}" now appears in ${count} day alt(s); the convention is 2-3. ` +
          `No alt rewritten here carried it, so check whether an untouched day changed.`
      );
    }
  }
}

function printReport(): void {
  const w = (n: number) => (s: string) => (s.length > n ? s.slice(0, n - 1) + "…" : s).padEnd(n);
  const cols: Array<[number, string]> = [[30, "TOUR"], [3, "DAY"], [28, "PLACENAME"], [10, "OUTCOME"], [9, "PROVIDER"], [34, "SOURCE QUERY"], [4, "REJ"]];
  console.log("\n" + cols.map(([n, h]) => w(n)(h)).join("  "));
  console.log(cols.map(([n]) => "-".repeat(n)).join("  "));
  for (const r of report) {
    console.log([w(30)(r.slug), w(3)(String(r.day)), w(28)(r.place), w(10)(r.outcome), w(9)(r.provider), w(34)(r.query), w(4)(String(r.rejected))].join("  "));
  }

  console.log("\nPer day:");
  for (const r of report) {
    console.log(`\n  ${r.slug} D${r.day} — ${r.place}`);
    console.log(`    was wrong because: ${r.detail}`);
    console.log(`    old: ${r.oldImage || "(none)"}`);
    console.log(`    new: ${r.newImage}`);
    if (r.description) console.log(`    the photo's own description: "${r.description}"`);
    console.log(`    alt: ${r.alt}`);
    if (r.outcome === "unresolved") {
      console.log(`    NOTHING WAS CHANGED. ${r.rejected} candidate(s) offered, all rejected:`);
      for (const reason of r.rejections ?? []) console.log(`      - ${reason}`);
      console.log(`    Fix by hand, or widen this day's queries/guard in REPAIRS and run again.`);
    } else if (r.rejected > 0) {
      console.log(`    ${r.rejected} candidate(s) rejected by the guard before this one`);
    }
  }

  if (galleryNotes.length > 0) {
    console.log("\nNotes:");
    for (const note of galleryNotes) console.log(`  ${note}`);
  }
}

run().catch((error) => {
  console.error("\nFAILED, nothing was committed:\n", error instanceof Error ? error.message : error);
  process.exit(1);
});
