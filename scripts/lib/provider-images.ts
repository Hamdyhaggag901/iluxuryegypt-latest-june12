// Shared image sourcing for the content scripts: provider search across Pexels,
// Pixabay and Unsplash, the relevance guard that decides whether a candidate is
// actually a picture of the place, download and WebP conversion, and alt text
// composed from the provider's own description.
//
// This consolidates the logic that scripts/refix-itinerary-images.ts and
// scripts/rewrite-itinerary-alts.ts each introduced. Those two have already run
// against production and are left untouched on purpose; anything new belongs
// here so there is one home for it going forward.
//
// Two rules carried over, both of which exist because of real failures:
//
//   1. A search query is not evidence about the photograph it returned. Only
//      the provider's own description is. Searching "ancient underground
//      catacombs carved stone Egypt" once returned the catacombs of Paris.
//
//   2. Alt text is written AFTER the photo is chosen, from that description.
//      Writing it first produced alts promising detail the picture never had.

import path from "path";
import fs from "fs/promises";
import { randomUUID } from "crypto";
import { optimizeUploadedImage } from "../../server/image-optimize";

export type Provider = "pexels" | "pixabay" | "unsplash";
export const ALL_PROVIDERS: Provider[] = ["unsplash", "pixabay", "pexels"];

/**
 * Priority order, best first.
 *
 * Unsplash and Pixabay return modern photographs of these sites. Pexels is
 * thinner on named Egyptian monuments, and Wikimedia Commons, which is a
 * `Source` rather than a `Provider` and sits last of all, keeps offering
 * nineteenth century engravings and scanned book plates. Those are correctly
 * licensed and correctly of the place, and they are not what a travel article
 * should be illustrated with.
 */
export const PROVIDER_ORDER: Provider[] = ["unsplash", "pixabay", "pexels"];

/** The full order including Wikimedia, which is only ever a last resort. */
export const DEFAULT_SOURCE_ORDER: Source[] = [...PROVIDER_ORDER, "wikimedia"];

export function isProvider(value: string): value is Provider {
  return (ALL_PROVIDERS as string[]).includes(value);
}
export function isSource(value: string): value is Source {
  return isProvider(value) || value === "wikimedia";
}

/**
 * Parses a --provider-order= value into a source list, so the order can be
 * changed for one run without a code change.
 */
export function resolveSourceOrder(flag: string | undefined): { order: Source[]; error?: string } {
  if (!flag?.trim()) return { order: DEFAULT_SOURCE_ORDER };
  const parts = flag.split(",").map((p) => p.trim().toLowerCase()).filter(Boolean);
  const bad = parts.filter((p) => !isSource(p));
  if (bad.length > 0) {
    return {
      order: DEFAULT_SOURCE_ORDER,
      error: `unknown source(s) in --provider-order: ${bad.join(", ")}. Known: ${[...ALL_PROVIDERS, "wikimedia"].join(", ")}`,
    };
  }
  const seen = new Set<string>();
  const order = parts.filter((p): p is Source => isSource(p) && !seen.has(p) && (seen.add(p), true));
  return { order };
}

/**
 * Where a candidate came from. Wikimedia Commons is deliberately NOT a
 * `Provider`: it needs no API key, it is searched by a different endpoint, and
 * putting it in PROVIDER_ORDER would silently change what the existing scripts
 * fetch. fetch-wikimedia-image.ts builds its own candidates and hands them to
 * the same guard, composer and download path.
 */
export type Source = Provider | "wikimedia";

export const UPLOAD_DIR = path.resolve(import.meta.dirname, "..", "..", "attached_assets", "uploads");
export const UPLOAD_URL_PREFIX = "/api/assets/uploads/";
const CONTENT_MAX_WIDTH = 1600;
const PER_PAGE = 20;

// Matches the throttles server/routes.ts already applies to these APIs.
const SPACING_MS: Record<Provider, number> = { pexels: 1100, pixabay: 1100, unsplash: 1400 };

export const ENV_VAR: Record<Provider, string> = {
  pexels: "PEXELS_API_KEY",
  pixabay: "PIXABAY_API_KEY",
  unsplash: "UNSPLASH_ACCESS_KEY",
};

/**
 * Keys are read on every access, not captured at import time.
 *
 * As plain consts these were evaluated when this module was first imported,
 * which made every caller depend on having loaded its .env before the import
 * statement that pulls this file in. Nothing enforced that and nothing warned
 * when it was wrong: the object simply held empty strings and every run
 * reported the provider as unconfigured. Getters remove the ordering question
 * entirely, and cost one property read per search.
 */
export const KEYS: Record<Provider, string> = {
  get pexels() { return (process.env.PEXELS_API_KEY ?? "").trim(); },
  get pixabay() { return (process.env.PIXABAY_API_KEY ?? "").trim(); },
  get unsplash() { return (process.env.UNSPLASH_ACCESS_KEY ?? "").trim(); },
} as Record<Provider, string>;

// Overridable only so the whole path can be exercised against a local receiver
// during testing. All three are unset in production.
const BASES: Record<Provider, string> = {
  get pexels() { return process.env.PEXELS_API_BASE?.trim() || "https://api.pexels.com/v1"; },
  get pixabay() { return process.env.PIXABAY_API_BASE?.trim() || "https://pixabay.com/api"; },
  get unsplash() { return process.env.UNSPLASH_API_BASE?.trim() || "https://api.unsplash.com"; },
} as Record<Provider, string>;

export interface Candidate {
  provider: Source;
  id: string;
  fullUrl: string;
  /** The provider's OWN description. The guard and the alt read only this. */
  description: string;
  photographer: string;
  pageUrl: string;
  downloadLocation?: string;
  /** Pixel width of the source file where the provider reports it. */
  width?: number;
  height?: number;
  /** The photographer's own page, which Unsplash attribution requires. */
  photographerUrl?: string;
  /** Licence label, where the source has one to state. Wikimedia always does. */
  licence?: string;
}

/** Thrown on HTTP 429 so a caller can stop cleanly instead of failing a run. */
export class RateLimitError extends Error {
  constructor(public readonly provider: Provider) {
    super(`${provider} returned HTTP 429`);
    this.name = "RateLimitError";
  }
}

/**
 * Unsplash gives two texts and either may be null. The photographer's own
 * `description` is the better evidence about the photograph, so it leads and
 * `alt_description` fills in when it is missing, which is most of the time.
 */
export function unsplashDescription(u: {
  description?: string | null;
  alt_description?: string | null;
  tags?: Array<{ title?: string }> | null;
}): string {
  const tags = (u.tags ?? []).map((t) => t?.title).filter(Boolean).join(" ");
  return [u.description, u.alt_description, tags]
    .map((x) => (x ?? "").trim())
    .filter(Boolean)
    .join(". ");
}

const lastCall: Record<Provider, number> = { pexels: 0, pixabay: 0, unsplash: 0 };
async function throttle(provider: Provider): Promise<void> {
  const wait = SPACING_MS[provider] - (Date.now() - lastCall[provider]);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastCall[provider] = Date.now();
}

// ---------------------------------------------------------------------------
// Request budget
// ---------------------------------------------------------------------------
// An Unsplash demo key allows 50 requests an hour. A thirteen post run asks for
// four positions each with up to three queries, which is 156 searches: enough
// to burn the hour's allowance inside the first few posts and get 429s for the
// rest. The budget stops the run asking for more than it is allowed, and a 429
// retires the provider for the remainder of the run rather than being retried
// into a longer ban.

const BUDGET: Record<Provider, number> = {
  unsplash: 45, // of 50 an hour, leaving headroom for anything else using the key
  pixabay: 100,
  pexels: 100,
};

const spent: Record<Provider, number> = { pexels: 0, pixabay: 0, unsplash: 0 };
const retired = new Map<Provider, string>();

/** Providers that stopped early this run, and why. Empty when all is well. */
export function retiredProviders(): Array<{ provider: Provider; reason: string }> {
  return [...retired].map(([provider, reason]) => ({ provider, reason }));
}

/** True once a provider has been rate limited or has used its budget. */
export function isRetired(provider: Provider): boolean {
  return retired.has(provider);
}

export function requestsUsed(): Record<Provider, number> {
  return { ...spent };
}

/** Test seam: forget budgets and retirements between cases. */
export function resetBudgets(): void {
  for (const p of ALL_PROVIDERS) spent[p] = 0;
  retired.clear();
  searchCache.clear();
}

const searchCache = new Map<string, Candidate[]>();

export async function search(provider: Provider, query: string): Promise<Candidate[]> {
  const cacheKey = `${provider}::${query}`;
  const cached = searchCache.get(cacheKey);
  if (cached) return cached;
  if (!KEYS[provider]) return [];
  if (retired.has(provider)) return [];
  if (spent[provider] >= BUDGET[provider]) {
    retired.set(provider, `request budget of ${BUDGET[provider]} for this run is spent`);
    console.warn(`  ! ${provider}: ${retired.get(provider)}. Skipping it for the rest of the run.`);
    return [];
  }

  await throttle(provider);
  spent[provider] += 1;
  let out: Candidate[] = [];
  try {
    if (provider === "pexels") {
      const url = new URL(`${BASES.pexels}/search`);
      url.searchParams.set("query", query);
      url.searchParams.set("per_page", String(PER_PAGE));
      url.searchParams.set("orientation", "landscape");
      const r = await fetch(url, { headers: { Authorization: KEYS.pexels } });
      if (!r.ok) throw new Error(`Pexels responded with ${r.status}`);
      out = (((await r.json()) as { photos?: any[] }).photos ?? []).map((p) => ({
        provider, id: String(p.id),
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
      out = (((await r.json()) as { hits?: any[] }).hits ?? []).map((h) => ({
        provider, id: String(h.id),
        fullUrl: h.largeImageURL,
        description: String(h.tags ?? "").replace(/,/g, " "),
        photographer: String(h.user ?? ""),
        pageUrl: String(h.pageURL ?? ""),
      }));
    } else {
      const url = new URL(`${BASES.unsplash}/search/photos`);
      url.searchParams.set("query", query);
      url.searchParams.set("per_page", String(PER_PAGE));
      url.searchParams.set("orientation", "landscape");
      const r = await fetch(url, { headers: { Authorization: `Client-ID ${KEYS.unsplash}` } });
      if (r.status === 429) throw new RateLimitError("unsplash");
      if (!r.ok) throw new Error(`Unsplash responded with ${r.status}`);
      out = (((await r.json()) as { results?: any[] }).results ?? []).map((u) => ({
        provider, id: String(u.id),
        // urls.raw is the unresized original and urls.full is a large JPEG of
        // it. Either is bigger than the 1600px the optimiser outputs, so take
        // the best available and let sharp do the resizing.
        fullUrl: u.urls?.raw || u.urls?.full || u.urls?.regular,
        // `description` is what the photographer wrote and `alt_description`
        // is Unsplash's own generated caption. The photographer's text is the
        // better evidence, so it leads; alt_description carries the load when
        // description is null, which it very often is.
        description: unsplashDescription(u),
        width: Number(u.width ?? 0),
        height: Number(u.height ?? 0),
        photographer: String(u.user?.name ?? ""),
        photographerUrl: String(u.user?.links?.html ?? ""),
        pageUrl: String(u.links?.html ?? ""),
        downloadLocation: u.links?.download_location,
      }));
    }
  } catch (error) {
    if (error instanceof RateLimitError) {
      retired.set(provider, "rate limited by the provider (HTTP 429)");
      console.warn(
        `  ! ${provider}: rate limited (HTTP 429) after ${spent[provider]} request(s). ` +
          `Skipping it for the rest of the run; work already done is kept.`
      );
      out = [];
    } else {
      console.warn(`  ! ${provider} search failed for "${query}": ${error instanceof Error ? error.message : error}`);
      out = [];
    }
  }

  out = out.filter((c) => c.fullUrl);
  searchCache.set(cacheKey, out);
  return out;
}

// ---------------------------------------------------------------------------
// Relevance guard
// ---------------------------------------------------------------------------
export interface Guard {
  /**
   * Tokens that confirm THIS SPECIFIC PLACE or the city it sits in. At least
   * one must appear in the provider's description.
   *
   * This is separate from `require` because of four photos that got through
   * the first version of this guard. A single group mixing the place name with
   * "egypt" let any Egyptian photo pass: a shot of Lake Qarun in Faiyum was
   * accepted for Lake Nasser, and a Luxor temple was accepted for the Luxor
   * west bank hills. Confirming the country is not confirming the place.
   */
  requirePlace: string[];
  /** Further groups, all of which must match, each by any one of its tokens. */
  require: string[][];
  /** Any match rejects the candidate. */
  deny: string[];
  /**
   * Egyptian place names this image is allowed to mention beyond requirePlace.
   * Anything else from EGYPT_PLACES in the description is a contradiction and
   * rejects the candidate, which is what catches "from Luxor, Egypt" on a
   * photo that is supposed to be Saqqara.
   */
  allowPlaces?: string[];
}

// Egyptian place names a description might carry. A description naming one of
// these that the image is not supposed to be about is describing somewhere
// else, whatever else it says.
export const EGYPT_PLACES = [
  "cairo", "giza", "luxor", "aswan", "alexandria", "hurghada", "sharm",
  "dahab", "siwa", "dahshur", "saqqara", "sakkara", "faiyum", "fayoum",
  "fayyum", "abydos", "dendera", "edfu", "esna", "philae", "karnak",
  "memphis", "sinai", "suez", "damietta", "rosetta", "tanta", "minya",
  "sohag", "qena", "asyut", "aswan", "nubia", "abu simbel", "qarun",
  "nasser", "marsa alam", "safaga", "taba", "nuweiba", "bahariya", "farafra",
];

// Places whose photographs turn up under Egyptian search terms and are not Egypt.
export const GLOBAL_DENY = [
  "paris", "france", "french", "rome", "italy", "italian", "athens", "turkey",
  "turkish", "istanbul", "cappadocia", "jordan", "petra", "morocco", "marrakech",
  "tunisia", "dubai", "uae", "abu dhabi", "qatar", "saudi", "india", "mexico",
  "peru", "thailand", "bali", "indonesia", "spain", "portugal", "prague",
  "vienna", "budapest", "china", "japan", "vietnam", "israel", "jerusalem",
  "malta", "cyprus", "sicily", "odessa",
];

// Plurals a suffix rule cannot reach, all of them words these searches actually
// return. Without sarcophagi mapping to sarcophagus, a require list asking for
// "sarcophagus" refused a photograph described as "statues and sarcophagi".
const IRREGULAR_PLURALS: Record<string, string> = {
  sarcophagi: "sarcophagus", colossi: "colossus", oases: "oasis",
  necropoleis: "necropolis", frescoes: "fresco", mummies: "mummy",
  obelisks: "obelisk", hieroglyphics: "hieroglyph",
};

/**
 * Singular form, used only for token matching. Deliberately separate from the
 * composer's stem(): that one is tuned to group word forms and turns "statues"
 * into "statu", which matches nothing. Short words are left alone so "bus"
 * does not become "bu".
 */
function singular(word: string): string {
  const w = word.toLowerCase();
  if (IRREGULAR_PLURALS[w]) return IRREGULAR_PLURALS[w];
  if (w.length <= 3) return w;
  if (/ies$/.test(w) && w.length > 4) return w.slice(0, -3) + "y";
  if (/(sses|shes|ches|xes)$/.test(w)) return w.slice(0, -2);
  if (/s$/.test(w) && !/ss$/.test(w)) return w.slice(0, -1);
  return w;
}

/**
 * Whole word, so "rome" never matches "roman", which is a real word here, and
 * "car" never matches "carved". Singular and plural count as the same word.
 */
export function hasToken(haystack: string, token: string): boolean {
  const t = token.trim().toLowerCase();
  const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // A multi word token is a phrase and is matched as written.
  if (/\s/.test(t)) return new RegExp(`\\b${escaped}\\b`, "i").test(haystack);
  if (new RegExp(`\\b${escaped}\\b`, "i").test(haystack)) return true;

  const target = singular(t);
  for (const word of haystack.toLowerCase().split(/[^a-z0-9'-]+/)) {
    if (word && singular(word) === target) return true;
  }
  return false;
}


export function checkRelevance(description: string, guard: Guard): { ok: boolean; reason: string } {
  const text = description.trim();
  if (!text) return { ok: false, reason: "provider gave no description, so the place cannot be confirmed" };

  for (const token of [...guard.deny, ...GLOBAL_DENY]) {
    if (hasToken(text, token)) return { ok: false, reason: `description mentions "${token}"` };
  }

  // The place itself, not just the country.
  if (!guard.requirePlace.some((t) => hasToken(text, t))) {
    return { ok: false, reason: `description names none of the place itself: ${guard.requirePlace.slice(0, 6).join(", ")}` };
  }

  // A description naming a different Egyptian place is describing a different
  // Egyptian place, however well it satisfies everything above.
  const allowed = new Set(
    [...guard.requirePlace, ...(guard.allowPlaces ?? [])].map((t) => t.toLowerCase())
  );
  for (const place of EGYPT_PLACES) {
    if (allowed.has(place)) continue;
    if (hasToken(text, place)) {
      return { ok: false, reason: `description names "${place}", a different place from the one this image is for` };
    }
  }

  for (const group of guard.require) {
    if (!group.some((t) => hasToken(text, t))) {
      return { ok: false, reason: `description confirms none of: ${group.slice(0, 6).join(", ")}` };
    }
  }

  return { ok: true, reason: "confirmed by the provider's own description" };
}

/** First candidate the guard confirms, or the rejection reasons if none. */
/** The site serves images at 1600px. Anything narrower is being enlarged. */
export const MIN_SOURCE_WIDTH = 1600;

/**
 * A search for a source this module does not own. fill-post-images passes one
 * for Wikimedia so Commons can sit at the end of the same priority list without
 * this file importing the Commons module, which imports this one.
 */
export type SourceSearch = (source: Source, query: string) => Promise<Candidate[]>;

export interface FindOptions {
  /** Priority order, best first. Defaults to the providers, Wikimedia last. */
  order?: Source[];
  /** Handles any source in `order` that is not a keyed provider. */
  search?: SourceSearch;
  /** Ids to refuse even though they pass the guard, for a replacement run. */
  exclude?: Set<string>;
}

export async function findConfirmed(
  queries: string[],
  guard: Guard,
  usedIds: Set<string>,
  opts: FindOptions = {}
): Promise<{ candidate: Candidate; query: string } | { rejections: string[]; tried: number }> {
  const order = opts.order ?? PROVIDER_ORDER;
  const rejections: string[] = [];
  let tried = 0;

  for (const source of order) {
    if (isProvider(source)) {
      if (!KEYS[source]) {
        rejections.push(
          `${source}: no API key configured, skipped. Set ${ENV_VAR[source]} in a .env this script reads.`
        );
        continue;
      }
      if (isRetired(source)) {
        rejections.push(`${source}: ${retired.get(source)}`);
        continue;
      }
    } else if (!opts.search) {
      rejections.push(`${source}: no searcher supplied for this source, skipped`);
      continue;
    }

    for (const query of queries) {
      const found = isProvider(source) ? await search(source, query) : await opts.search!(source, query);
      for (const candidate of found) {
        const id = `${candidate.provider}:${candidate.id}`;
        if (usedIds.has(id)) continue;
        if (opts.exclude?.has(id)) continue;
        tried++;

        // Width is only enforced where the provider reports it. Pexels and
        // Pixabay serve a sized file rather than the original, so there is
        // nothing to check; Unsplash and Commons both give the real number.
        if (candidate.width && candidate.width < MIN_SOURCE_WIDTH) {
          if (rejections.length < 12) {
            rejections.push(`${source} ${candidate.id}: ${candidate.width}px wide, under the ${MIN_SOURCE_WIDTH}px minimum`);
          }
          continue;
        }

        const verdict = checkRelevance(candidate.description, guard);
        if (verdict.ok) {
          usedIds.add(id);
          return { candidate, query };
        }
        if (rejections.length < 12) {
          rejections.push(`${source} ${candidate.id}: ${verdict.reason} ("${candidate.description.slice(0, 70)}")`);
        }
      }
      if (isProvider(source) && isRetired(source)) break; // a 429 mid query list
    }
  }
  return { rejections, tried };
}

// ---------------------------------------------------------------------------
// Alt text, composed from the description after the photo is chosen
// ---------------------------------------------------------------------------
// Every phrase below may only use words its own match list attests, plus the
// function words. auditVocabulary() proves that before anything runs, so a
// careless entry cannot put an invented word into an alt.

// "view" and friends are structural: they carry no claim about the photograph,
// so a phrase may use them without its trigger attesting them.
const FUNCTION_WORDS = new Set([
  "a", "an", "the", "and", "at", "in", "of", "on", "with", "under", "over", "from", "this", "its",
  "view", "seen", "standing", "photographed",
]);

interface Entry { match: string[]; phrase: string }

const SUBJECTS: Entry[] = [
  { match: ["sphinx"], phrase: "the sphinx" },
  { match: ["pyramid", "pyramids"], phrase: "pyramids" },
  { match: ["obelisk"], phrase: "an obelisk" },
  { match: ["sarcophagus", "sarcophagi"], phrase: "sarcophagi" },
  { match: ["hieroglyph", "hieroglyphs", "hieroglyphics"], phrase: "hieroglyphs" },
  { match: ["relief", "reliefs", "carving", "carvings", "carved"], phrase: "carved reliefs" },
  { match: ["mural", "murals", "fresco", "painting", "paintings", "painted"], phrase: "paintings" },
  { match: ["column", "columns", "pillar", "pillars", "colonnade"], phrase: "columns" },
  { match: ["statue", "statues", "sculpture", "sculptures"], phrase: "statues" },
  { match: ["tomb", "tombs", "burial", "crypt", "catacomb", "catacombs"], phrase: "a tomb" },
  { match: ["temple", "temples"], phrase: "a temple" },
  { match: ["minaret", "minarets"], phrase: "a minaret" },
  { match: ["mosque", "mosques"], phrase: "a mosque" },
  { match: ["museum", "gallery", "exhibit", "exhibition"], phrase: "a museum gallery" },
  { match: ["ruin", "ruins"], phrase: "ruins" },
  { match: ["stair", "stairs", "staircase", "steps"], phrase: "steps" },
  { match: ["terrace", "terraces"], phrase: "terraces" },
  { match: ["dune", "dunes"], phrase: "dunes" },
  { match: ["desert", "sand"], phrase: "desert sand" },
  { match: ["camel", "camels"], phrase: "camels" },
  { match: ["felucca", "sailboat", "boat", "boats", "ship"], phrase: "a boat" },
  { match: ["river", "nile"], phrase: "the river" },
  { match: ["lake", "pool", "spring", "water"], phrase: "water" },
  { match: ["palm", "palms"], phrase: "palms" },
  { match: ["tree", "trees", "grove"], phrase: "trees" },
  // Three entries rather than one. The single entry that used to cover all of
  // these emitted "cliffs" for a description that said "hills", which is the
  // exact failure the no-invention rule exists to stop: the vocabulary audit
  // was satisfied, because "cliffs" was in the entry's own match list, while
  // the alt still claimed something the photograph had not been described as
  // showing. A trigger word has to mean what the phrase it emits means.
  { match: ["cliff", "cliffs"], phrase: "cliffs" },
  { match: ["mountain", "mountains"], phrase: "mountains" },
  { match: ["hill", "hills"], phrase: "hills" },
  // Added with the Cairo and Alexandria articles. Without a word for what these
  // photographs are of, the composer had nothing to say about a church, a gate
  // or a bazaar and refused perfectly good pictures as "too thin to describe".
  { match: ["church", "churches", "basilica", "chapel"], phrase: "a church" },
  { match: ["icon", "icons"], phrase: "icons" },
  { match: ["dome", "domes"], phrase: "domes" },
  { match: ["courtyard", "courtyards"], phrase: "a courtyard" },
  { match: ["arch", "arches", "arcade", "arcades"], phrase: "arches" },
  { match: ["gate", "gates", "gateway"], phrase: "a gate" },
  { match: ["fortress", "fort", "citadel"], phrase: "a fortress" },
  { match: ["market", "markets", "bazaar", "souk"], phrase: "a market" },
  { match: ["lantern", "lanterns"], phrase: "lanterns" },
  { match: ["library"], phrase: "a library" },
  { match: ["theatre", "theater", "amphitheatre", "amphitheater"], phrase: "a theatre" },
  { match: ["quarry", "quarries"], phrase: "a quarry" },
  { match: ["building", "buildings", "house", "houses", "architecture"], phrase: "buildings" },
  { match: ["wall", "walls"], phrase: "walls" },
  { match: ["stone", "rock", "granite", "limestone", "sandstone"], phrase: "stone" },
];

const SKY: Entry = { match: ["sky", "skies"], phrase: "sky" };
const COLOURS: Entry[] = [
  { match: ["golden", "gold"], phrase: "golden" }, { match: ["turquoise"], phrase: "turquoise" },
  { match: ["blue"], phrase: "blue" }, { match: ["green"], phrase: "green" },
  { match: ["white"], phrase: "white" }, { match: ["brown"], phrase: "brown" },
  { match: ["grey", "gray"], phrase: "grey" }, { match: ["orange"], phrase: "orange" },
  { match: ["red"], phrase: "red" }, { match: ["yellow"], phrase: "yellow" },
];
const LIGHT: Entry[] = [
  { match: ["sunset"], phrase: "at sunset" }, { match: ["sunrise"], phrase: "at sunrise" },
  { match: ["dusk"], phrase: "at dusk" }, { match: ["dawn"], phrase: "at dawn" },
  { match: ["night", "nighttime"], phrase: "at night" },
  { match: ["illuminated", "lit"], phrase: "illuminated" },
  { match: ["daylight", "daytime"], phrase: "in daylight" },
  { match: ["sunny", "sunlight", "sunlit"], phrase: "in sunlight" },
];
const ANGLE: Entry[] = [
  { match: ["aerial", "drone", "overhead"], phrase: "in an aerial view" },
  { match: ["closeup", "close-up", "macro"], phrase: "in close-up" },
  { match: ["panorama", "panoramic"], phrase: "in a panoramic view" },
  { match: ["silhouette", "silhouetted"], phrase: "in silhouette" },
  { match: ["underwater"], phrase: "underwater" },
];

function stem(word: string): string {
  const w = word.toLowerCase().replace(/[^a-z-]/g, "");
  return w.replace(/(ies)$/, "y").replace(/(sses|shes|ches|xes)$/, "").replace(/(ing|ed|es|s)$/, "");
}
function tokenSet(text: string): Set<string> {
  const set = new Set<string>();
  for (const raw of text.toLowerCase().split(/[^a-z0-9-]+/)) {
    if (!raw) continue;
    set.add(raw); set.add(stem(raw));
  }
  return set;
}
function fires(entry: Entry, tokens: Set<string>): boolean {
  return entry.match.some((m) => tokens.has(m) || tokens.has(stem(m)));
}
function contentWords(phrase: string): string[] {
  return phrase.split(/\s+/).map((w) => w.replace(/[^A-Za-z-]/g, ""))
    .filter((w) => w && !FUNCTION_WORDS.has(w.toLowerCase()));
}
function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/** Proves no phrase can introduce a word its trigger does not attest. */
export function auditVocabulary(): string[] {
  const problems: string[] = [];
  for (const [name, entries] of [["SUBJECTS", SUBJECTS], ["COLOURS", COLOURS], ["LIGHT", LIGHT], ["ANGLE", ANGLE], ["SKY", [SKY]]] as Array<[string, Entry[]]>) {
    for (const entry of entries) {
      const attested = new Set(entry.match.flatMap((m) => [m.toLowerCase(), stem(m)]));
      for (const word of contentWords(entry.phrase)) {
        if (!attested.has(word.toLowerCase()) && !attested.has(stem(word))) {
          problems.push(`${name}: phrase "${entry.phrase}" uses "${word}", which none of [${entry.match.join(", ")}] attests`);
        }
      }
    }
  }
  return problems;
}

export type Tier = "PLACE" | "CITY" | "VISUAL";

/**
 * Builds an 8 to 15 word alt from the provider's description. Returns null when
 * the description is too thin to say anything honest, which the caller must
 * treat as a failure rather than padding it out.
 *
 * `suffix` appends editorial context (a focus keyword) that is exempt from the
 * no-invention rule because it describes the page, not the picture.
 */
export function composeAlt(
  description: string,
  place: string,
  city: string,
  opts: { suffix?: string; placeConfirmed?: boolean; avoidPlaceName?: boolean } = {}
): { alt: string; tier: Tier } | null {
  // No description means no evidence, and the place name fallback below must
  // not become a way to caption a photograph nobody has described. In practice
  // the relevance guard already refuses these, so this is a second lock on the
  // same door.
  if (!description.trim()) return null;

  const tokens = tokenSet(description);
  const placeWords = new Set(contentWords(place).map((w) => stem(w)));
  const namesPlace = contentWords(place).filter((w) => w.length > 3)
    .some((w) => tokens.has(w.toLowerCase()) || tokens.has(stem(w)));
  const namesCity = tokens.has(city.toLowerCase()) || tokens.has("egypt") || tokens.has("egyptian");
  // `placeConfirmed` is the relevance guard's own verdict, and it is the
  // authoritative one: the guard's requirePlace is what let this photo through
  // in the first place. Re-deriving the answer here from the place name alone
  // disagreed with it and threw away correct photos, for instance a desert
  // shot confirmed for the Theban hills by "desert" and "Luxor" but rejected
  // here because the words "Theban hills" were not in the description.
  const tier: Tier = opts.placeConfirmed || namesPlace ? "PLACE" : namesCity ? "CITY" : "VISUAL";

  // A subject already in the placeName is a stutter, not a description.
  const redundant = (e: Entry) => contentWords(e.phrase).every((w) => placeWords.has(stem(w)));
  const firing = SUBJECTS.filter((e) => fires(e, tokens));
  let chosen = firing.filter((e) => !redundant(e)).slice(0, 4);
  // Words for the container rather than the thing: a museum, a building, the
  // stone it is made of. Fine as supporting detail, wrong as the only subject.
  const GENERIC = new Set(["a museum gallery", "buildings", "stone", "walls", "a town"]);
  if (chosen.length > 0 && chosen.every((e) => GENERIC.has(e.phrase)) && firing.some(redundant)) {
    chosen = [];
  }
  if (chosen.length === 0 && tier !== "PLACE") return null;

  // A colour applies only to the noun it modifies in the description:
  // "brown pyramid under blue sky" must never become "blue pyramids".
  const words = description.toLowerCase().split(/[^a-z0-9-]+/).filter(Boolean);
  const colourFor = (entry: Entry | undefined): Entry | undefined => {
    if (!entry) return undefined;
    const targets = new Set(entry.match.map(stem));
    for (let i = 0; i < words.length; i++) {
      if (!targets.has(stem(words[i]))) continue;
      for (let back = 1; back <= 3 && i - back >= 0; back++) {
        const hit = COLOURS.find((c) => c.match.some((m) => stem(m) === stem(words[i - back])));
        if (hit) return hit;
        if (!["a", "an", "the", "of", "clear", "bright", "dark", "pale"].includes(words[i - back])) break;
      }
    }
    return undefined;
  };

  const colours = chosen.map((e) => colourFor(e));
  const light = LIGHT.find((e) => fires(e, tokens));
  const angle = ANGLE.find((e) => fires(e, tokens));
  const skyColour = fires(SKY, tokens) ? colourFor(SKY) : undefined;
  const skyClause = skyColour ? `under ${/^[aeiou]/i.test(skyColour.phrase) ? "an" : "a"} ${skyColour.phrase} sky` : "";
  const cityInPlace = contentWords(city).every((w) => placeWords.has(stem(w)));
  // "Egypt" is added only when the description itself says so, and it is what
  // lets a place-led sentence such as "Giza Pyramids in Egypt under a blue sky"
  // reach eight honest words instead of being thrown away one word short.
  const egyptAttested = tokens.has("egypt") || tokens.has("egyptian");
  const country = egyptAttested ? ", Egypt" : "";
  // `avoidPlaceName` locates the photograph by city instead of by name.
  //
  // It exists for the posts whose focus keyword IS the place name: medinet
  // habu, coptic cairo, islamic cairo, kom ombo temple, dendera temple egypt.
  // There the natural alt for every position contains the keyword, which
  // breaks the one-alt-per-post rule, and the previous behaviour was to
  // compose all of them and then reject the batch, losing the whole post. One
  // position keeps the name and the rest say where they are instead.
  const locationClause = opts.avoidPlaceName
    ? `in ${city}, Egypt`
    : tier === "PLACE"
    ? (cityInPlace ? `at ${place}${egyptAttested ? " in Egypt" : ""}` : `at ${place} in ${city}${country}`)
    : tier === "CITY" ? `in ${city}, Egypt` : "";

  const withColour = (entry: Entry | undefined, colour: Entry | undefined, use: boolean) => {
    if (!entry) return "";
    if (!use || !colour) return entry.phrase;
    const m = entry.phrase.match(/^(a|an|the)\s+(.*)$/i);
    if (!m) return `${colour.phrase} ${entry.phrase}`;
    const article = m[1].toLowerCase() === "the" ? "the" : /^[aeiou]/i.test(colour.phrase) ? "an" : "a";
    return `${article} ${colour.phrase} ${m[2]}`;
  };

  const suffix = opts.suffix ?? "";
  const maxWords = 15 - (suffix ? wordCount(suffix) : 0);

  const build = (o: { colour: boolean; nouns: number; angle: boolean; light: boolean; sky: boolean; location: boolean }) => {
    const nouns = chosen.slice(0, o.nouns).map((e, i) => withColour(e, colours[i], o.colour)).filter(Boolean);
    const head = nouns.length === 0
      ? (locationClause.replace(/^at /, "").replace(/^in /, "") || (opts.avoidPlaceName ? "" : place))
      : nouns.length === 1 ? nouns[0]
      : `${nouns.slice(0, -1).join(", ")} and ${nouns[nouns.length - 1]}`;
    const extras = [
      o.angle && angle ? angle.phrase : "",
      o.location && locationClause && nouns.length > 0 ? locationClause : "",
      o.sky && skyClause ? skyClause : "",
      o.light && light ? light.phrase : "",
    ].filter(Boolean);
    const sentence = [head, ...extras].join(" ").replace(/\s+/g, " ").trim();
    return sentence.charAt(0).toUpperCase() + sentence.slice(1);
  };

  // When the keyword suffix already names the place, the location clause repeats
  // it: "a church at Coptic Cairo in Egypt in coptic cairo". Dropping it up
  // front rather than only when the sentence runs long is what keeps the one
  // keyword-bearing alt on each post readable.
  const suffixNamesPlace = Boolean(suffix) && contentWords(place)
    .filter((w) => w.length > 3)
    .every((w) => suffix.toLowerCase().includes(w.toLowerCase()));

  const o = { colour: true, nouns: 4, angle: true, light: true, sky: true, location: !suffixNamesPlace };
  let alt = build(o);
  while (wordCount(alt) > maxWords && o.nouns > 3) { o.nouns--; alt = build(o); }
  // The keyword suffix usually names the place already, so the location clause
  // is the right thing to drop before the nouns that describe the picture.
  for (const key of ["colour", "angle", "sky", "light", "location"] as const) {
    if (wordCount(alt) <= maxWords) break;
    o[key] = false; alt = build(o);
  }
  while (wordCount(alt) > maxWords && o.nouns > 1) { o.nouns--; alt = build(o); }

  // A confirmed place earns a lower floor. Eight words of real description is
  // the ideal, but refusing a correct photograph because its caption is terse
  // is the worse outcome: five honest words beat no image at all.
  const floor = tier === "PLACE" ? 5 : 8;
  const final = suffix ? alt + suffix : alt;
  const length = wordCount(final);

  if (length >= floor && length <= 15) return { alt: final, tier };

  // Still too short, and the place is confirmed: name the place. This claims
  // nothing about what is in the frame beyond what the guard already
  // established, which is why it is only reachable at PLACE tier.
  // The place name fallback is exactly what avoidPlaceName is here to prevent,
  // so under it a thin description is a refusal rather than a naming.
  if (tier === "PLACE" && length < floor && !opts.avoidPlaceName) {
    const named = placeNameAlt(place, city, placeWords);
    const withSuffix = suffix ? named + suffix : named;
    if (wordCount(withSuffix) <= 15) return { alt: withSuffix, tier };
    if (wordCount(named) <= 15) return { alt: named, tier };
  }

  return null;
}

// Places whose name is a common noun phrase and reads wrong without an
// article. A bare proper name such as Saqqara or Hurghada does not take one.
const ARTICLE_LEADERS = new Set([
  "temple", "valley", "great", "red", "bent", "grand", "step", "stepped",
  "catacombs", "western", "theban", "nile", "serapeum", "citadel", "sphinx", "black",
]);

/** "The Valley of the Kings in Luxor, Egypt". Identifies, never describes. */
function placeNameAlt(place: string, city: string, placeWords: Set<string>): string {
  const first = (contentWords(place)[0] ?? "").toLowerCase();
  const article = /^the\b/i.test(place.trim()) ? "" : ARTICLE_LEADERS.has(first) ? "The " : "";
  const cityInPlace = contentWords(city).every((w) => placeWords.has(stem(w)));
  const where = cityInPlace ? "in Egypt" : `in ${city}, Egypt`;
  return `${article}${place} ${where}`.replace(/\s+/g, " ").trim();
}

/** Every content word must trace to the description, the place, or the suffix. */
export function findInventedWords(
  alt: string, description: string, place: string, city: string, suffix?: string
): string[] {
  const attested = tokenSet(`${description} ${place} ${city} Egypt ${suffix ?? ""}`);
  for (const entry of [...SUBJECTS, ...COLOURS, ...LIGHT, ...ANGLE, SKY]) {
    if (fires(entry, attested)) {
      for (const w of contentWords(entry.phrase)) { attested.add(w.toLowerCase()); attested.add(stem(w)); }
    }
  }
  return contentWords(alt).filter((w) => !attested.has(w.toLowerCase()) && !attested.has(stem(w)));
}

// ---------------------------------------------------------------------------
// Download
// ---------------------------------------------------------------------------
export async function downloadAndOptimise(
  candidate: Candidate, writtenFiles: string[]
): Promise<{ url: string; filename: string; size: number }> {
  // Unsplash asks to be pinged when a photo is actually used. Not fatal.
  if (candidate.provider === "unsplash" && candidate.downloadLocation && KEYS.unsplash) {
    await fetch(candidate.downloadLocation, { headers: { Authorization: `Client-ID ${KEYS.unsplash}` } }).catch(() => {});
  }
  const response = await fetch(candidate.fullUrl);
  if (!response.ok) throw new Error(`Failed to download ${candidate.provider} photo ${candidate.id} (${response.status})`);
  const buffer = Buffer.from(await response.arrayBuffer());

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const tempName = `${randomUUID()}.jpg`;
  await fs.writeFile(path.join(UPLOAD_DIR, tempName), buffer);
  writtenFiles.push(path.join(UPLOAD_DIR, tempName));

  const optimised = await optimizeUploadedImage(UPLOAD_DIR, tempName, CONTENT_MAX_WIDTH);
  if (!optimised) throw new Error(`Optimisation returned nothing for ${candidate.provider} photo ${candidate.id}`);
  writtenFiles.push(path.join(UPLOAD_DIR, optimised.filename));

  // Relative, never an absolute https://iluxuryegypt.com/... URL.
  return { url: `${UPLOAD_URL_PREFIX}${optimised.filename}`, filename: optimised.filename, size: optimised.size };
}

/**
 * What goes in media.caption, and therefore what an admin reads in the Media
 * Library when they need to know where a picture came from.
 *
 * Unsplash's licence requires the photographer to be credited with a link to
 * their profile as well as to the photo, so its line carries both. The others
 * get the photographer and the photo page, which is what they ask for.
 */
export function creditLine(candidate: Candidate): string {
  const name = candidate.provider[0].toUpperCase() + candidate.provider.slice(1);
  const who = candidate.photographer || "an uncredited photographer";
  if (candidate.provider === "unsplash") {
    const profile = candidate.photographerUrl ? ` (${candidate.photographerUrl})` : "";
    const photo = candidate.pageUrl ? ` Photo: ${candidate.pageUrl}` : "";
    return `Photo by ${who}${profile} on Unsplash.${photo}`;
  }
  return `Photo by ${who} on ${name}${candidate.pageUrl ? ` (${candidate.pageUrl})` : ""}`;
}
