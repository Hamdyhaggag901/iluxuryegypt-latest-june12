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
export const PROVIDER_ORDER: Provider[] = ["pexels", "pixabay", "unsplash"];

export const UPLOAD_DIR = path.resolve(import.meta.dirname, "..", "..", "attached_assets", "uploads");
export const UPLOAD_URL_PREFIX = "/api/assets/uploads/";
const CONTENT_MAX_WIDTH = 1600;
const PER_PAGE = 20;

// Matches the throttles server/routes.ts already applies to these APIs.
const SPACING_MS: Record<Provider, number> = { pexels: 1100, pixabay: 1100, unsplash: 1400 };

export const KEYS: Record<Provider, string> = {
  pexels: (process.env.PEXELS_API_KEY ?? "").trim(),
  pixabay: (process.env.PIXABAY_API_KEY ?? "").trim(),
  unsplash: (process.env.UNSPLASH_ACCESS_KEY ?? "").trim(),
};

// Overridable only so the whole path can be exercised against a local receiver
// during testing. All three are unset in production.
const BASES: Record<Provider, string> = {
  pexels: process.env.PEXELS_API_BASE?.trim() || "https://api.pexels.com/v1",
  pixabay: process.env.PIXABAY_API_BASE?.trim() || "https://pixabay.com/api",
  unsplash: process.env.UNSPLASH_API_BASE?.trim() || "https://api.unsplash.com",
};

export interface Candidate {
  provider: Provider;
  id: string;
  fullUrl: string;
  /** The provider's OWN description. The guard and the alt read only this. */
  description: string;
  photographer: string;
  pageUrl: string;
  downloadLocation?: string;
}

const lastCall: Record<Provider, number> = { pexels: 0, pixabay: 0, unsplash: 0 };
async function throttle(provider: Provider): Promise<void> {
  const wait = SPACING_MS[provider] - (Date.now() - lastCall[provider]);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastCall[provider] = Date.now();
}

const searchCache = new Map<string, Candidate[]>();

export async function search(provider: Provider, query: string): Promise<Candidate[]> {
  const cacheKey = `${provider}::${query}`;
  const cached = searchCache.get(cacheKey);
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
      if (!r.ok) throw new Error(`Unsplash responded with ${r.status}`);
      out = (((await r.json()) as { results?: any[] }).results ?? []).map((u) => ({
        provider, id: String(u.id),
        fullUrl: u.urls?.regular,
        description: [u.alt_description, u.description, (u.tags ?? []).map((t: any) => t?.title).join(" ")]
          .filter(Boolean).join(" "),
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
  searchCache.set(cacheKey, out);
  return out;
}

// ---------------------------------------------------------------------------
// Relevance guard
// ---------------------------------------------------------------------------
export interface Guard {
  /** All groups must match, each by any one of its tokens. */
  require: string[][];
  /** Any match rejects the candidate. */
  deny: string[];
}

// Places whose photographs turn up under Egyptian search terms and are not Egypt.
export const GLOBAL_DENY = [
  "paris", "france", "french", "rome", "italy", "italian", "athens", "turkey",
  "turkish", "istanbul", "cappadocia", "jordan", "petra", "morocco", "marrakech",
  "tunisia", "dubai", "uae", "abu dhabi", "qatar", "saudi", "india", "mexico",
  "peru", "thailand", "bali", "indonesia", "spain", "portugal", "prague",
  "vienna", "budapest", "china", "japan", "vietnam", "israel", "jerusalem",
  "malta", "cyprus", "sicily", "odessa",
];

/** Whole word so "rome" never matches "roman", which is a real word here. */
export function hasToken(haystack: string, token: string): boolean {
  const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\b`, "i").test(haystack);
}

export function checkRelevance(description: string, guard: Guard): { ok: boolean; reason: string } {
  const text = description.trim();
  if (!text) return { ok: false, reason: "provider gave no description, so the place cannot be confirmed" };
  for (const token of [...guard.deny, ...GLOBAL_DENY]) {
    if (hasToken(text, token)) return { ok: false, reason: `description mentions "${token}"` };
  }
  for (const group of guard.require) {
    if (!group.some((t) => hasToken(text, t))) {
      return { ok: false, reason: `description confirms none of: ${group.slice(0, 6).join(", ")}` };
    }
  }
  return { ok: true, reason: "confirmed by the provider's own description" };
}

/** First candidate the guard confirms, or the rejection reasons if none. */
export async function findConfirmed(
  queries: string[],
  guard: Guard,
  usedIds: Set<string>
): Promise<{ candidate: Candidate; query: string } | { rejections: string[]; tried: number }> {
  const rejections: string[] = [];
  let tried = 0;
  for (const provider of PROVIDER_ORDER) {
    if (!KEYS[provider]) {
      rejections.push(`${provider}: no API key configured, skipped`);
      continue;
    }
    for (const query of queries) {
      for (const candidate of await search(provider, query)) {
        if (usedIds.has(`${candidate.provider}:${candidate.id}`)) continue;
        tried++;
        const verdict = checkRelevance(candidate.description, guard);
        if (verdict.ok) {
          usedIds.add(`${candidate.provider}:${candidate.id}`);
          return { candidate, query };
        }
        if (rejections.length < 12) {
          rejections.push(`${provider} ${candidate.id}: ${verdict.reason} ("${candidate.description.slice(0, 70)}")`);
        }
      }
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
  { match: ["cliff", "cliffs", "mountain", "mountains", "hill", "hills"], phrase: "cliffs" },
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
  description: string, place: string, city: string, opts: { suffix?: string } = {}
): { alt: string; tier: Tier } | null {
  const tokens = tokenSet(description);
  const placeWords = new Set(contentWords(place).map((w) => stem(w)));
  const namesPlace = contentWords(place).filter((w) => w.length > 3)
    .some((w) => tokens.has(w.toLowerCase()) || tokens.has(stem(w)));
  const namesCity = tokens.has(city.toLowerCase()) || tokens.has("egypt") || tokens.has("egyptian");
  const tier: Tier = namesPlace ? "PLACE" : namesCity ? "CITY" : "VISUAL";

  // A subject already in the placeName is a stutter, not a description.
  const redundant = (e: Entry) => contentWords(e.phrase).every((w) => placeWords.has(stem(w)));
  const chosen = SUBJECTS.filter((e) => fires(e, tokens) && !redundant(e)).slice(0, 4);
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
  const locationClause = tier === "PLACE"
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

  const build = (o: { colour: boolean; nouns: number; angle: boolean; light: boolean; sky: boolean }) => {
    const nouns = chosen.slice(0, o.nouns).map((e, i) => withColour(e, colours[i], o.colour)).filter(Boolean);
    const head = nouns.length === 0
      ? (locationClause.replace(/^at /, "").replace(/^in /, "") || place)
      : nouns.length === 1 ? nouns[0]
      : `${nouns.slice(0, -1).join(", ")} and ${nouns[nouns.length - 1]}`;
    const extras = [
      o.angle && angle ? angle.phrase : "",
      locationClause && nouns.length > 0 ? locationClause : "",
      o.sky && skyClause ? skyClause : "",
      o.light && light ? light.phrase : "",
    ].filter(Boolean);
    const sentence = [head, ...extras].join(" ").replace(/\s+/g, " ").trim();
    return sentence.charAt(0).toUpperCase() + sentence.slice(1);
  };

  const o = { colour: true, nouns: 4, angle: true, light: true, sky: true };
  let alt = build(o);
  while (wordCount(alt) > maxWords && o.nouns > 3) { o.nouns--; alt = build(o); }
  for (const key of ["colour", "angle", "sky", "light"] as const) {
    if (wordCount(alt) <= maxWords) break;
    o[key] = false; alt = build(o);
  }
  while (wordCount(alt) > maxWords && o.nouns > 1) { o.nouns--; alt = build(o); }

  const final = suffix ? alt + suffix : alt;
  if (wordCount(final) < 8 || wordCount(final) > 15) return null;
  return { alt: final, tier };
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

export function creditLine(candidate: Candidate): string {
  const name = candidate.provider[0].toUpperCase() + candidate.provider.slice(1);
  return `Photo by ${candidate.photographer} on ${name}${candidate.pageUrl ? ` (${candidate.pageUrl})` : ""}`;
}
