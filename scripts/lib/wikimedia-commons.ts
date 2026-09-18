// Wikimedia Commons: search, licence screening, quality screening and the
// caption that records where a picture came from.
//
// Split out of fetch-wikimedia-image.ts so scripts/test-wikimedia-guard.ts can
// exercise the licence and quality rules directly. A licence filter that is only
// ever tested by running the whole script against the live API is a licence
// filter nobody has tested.

import {
  type Candidate, type Guard, checkRelevance,
} from "./provider-images";

// ---------------------------------------------------------------------------
// Licensing
// ---------------------------------------------------------------------------
// Commons exposes a machine readable licence code in extmetadata.License, such
// as "cc-by-sa-4.0", "cc0" or "pd". It is the field to trust; LicenseShortName
// is free text and varies. A file with no License value at all is rejected,
// because "no licence stated" is not the same as "freely licensed".

/** Any of these as a hyphen separated segment means the file is not usable here. */
const FORBIDDEN_SEGMENTS = ["nc", "nd", "sampling", "devnations"];

/** Phrases in the human readable licence fields that override everything else. */
const FORBIDDEN_PHRASES = [
  "non-commercial", "noncommercial", "no derivative", "noderiv", "fair use",
  "non-free", "nonfree", "all rights reserved", "copyrighted", "with permission",
  "gfdl", "free art license", "attribution required for commercial",
];

export function licenceVerdict(meta: Record<string, { value?: string }>): { ok: boolean; label: string; reason: string } {
  const code = String(meta.License?.value ?? "").trim().toLowerCase();
  const short = String(meta.LicenseShortName?.value ?? "").trim();
  const terms = String(meta.UsageTerms?.value ?? "").trim();
  const label = short || code || "unstated";
  const human = `${short} ${terms}`.toLowerCase();

  if (!code) return { ok: false, label, reason: "Commons states no machine readable licence" };
  for (const phrase of FORBIDDEN_PHRASES) {
    if (human.includes(phrase)) return { ok: false, label, reason: `licence text says "${phrase}"` };
  }
  const segments = code.split("-");
  for (const bad of FORBIDDEN_SEGMENTS) {
    if (segments.includes(bad)) return { ok: false, label, reason: `licence code "${code}" carries the ${bad.toUpperCase()} restriction` };
  }

  // Public domain, in all the forms Commons writes it.
  if (code === "cc0" || code === "cc-zero" || code === "pd" || code.startsWith("pd-")) {
    return { ok: true, label, reason: "public domain or CC0" };
  }
  // CC BY and CC BY-SA, any version, including the country ports.
  if (/^cc-by(-sa)?-\d/.test(code)) {
    return { ok: true, label, reason: "CC BY or CC BY-SA" };
  }
  return { ok: false, label, reason: `licence code "${code}" is not one of CC0, public domain, CC BY or CC BY-SA` };
}

// ---------------------------------------------------------------------------
// Quality
// ---------------------------------------------------------------------------
// The site serves images at 1600px wide. A source narrower than that is being
// enlarged, which shows. 2500 and above is the comfortable margin, and Commons
// has enough of those that preferring them costs nothing.
export const MIN_WIDTH = 1600;
export const PREFER_WIDTH = 2500;
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

/**
 * Words that mark a file as a drawing, a document or a reproduction rather than
 * a photograph of the place. Checked against the title, the description and the
 * Commons categories, which is where this kind of thing is always declared.
 */
const NOT_A_PHOTOGRAPH = [
  "engraving", "engravings", "lithograph", "lithography", "woodcut", "etching",
  "drawing", "drawings", "sketch", "sketches", "illustration", "illustrated",
  "painting", "watercolour", "watercolor", "diagram", "schematic", "blueprint",
  "map", "maps", "plan of", "floor plan", "cross section", "elevation drawing",
  "scan", "scanned", "book", "manuscript", "postcard", "stamp", "banknote",
  "coin", "logo", "coat of arms", "flag of", "poster", "screenshot",
  "description de l'egypte", "description de l'égypte", "lepsius", "denkmaeler",
  "3d model", "reconstruction drawing", "replica", "model of",
];

// ---------------------------------------------------------------------------
// Commons search
// ---------------------------------------------------------------------------
const API = process.env.WIKIMEDIA_API_BASE?.trim() || "https://commons.wikimedia.org/w/api.php";
// Commons asks every automated client to identify itself and to stay polite.
const USER_AGENT = "iLuxuryEgypt-image-fetcher/1.0 (https://iluxuryegypt.com; site content images)";
const SPACING_MS = 1200;
const PER_PAGE = 40;

let lastCall = 0;
async function throttle(): Promise<void> {
  const wait = SPACING_MS - (Date.now() - lastCall);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastCall = Date.now();
}

export interface CommonsCandidate extends Candidate {
  width: number;
  height: number;
  mime: string;
  licence: string;
  categories: string;
  title: string;
}

/** Strips the HTML Commons puts in ImageDescription and Artist. */
export function plain(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/** "File:Abu Simbel temples 2019.jpg" reads as a sentence once it is cleaned up. */
export function titleToWords(title: string): string {
  return title
    .replace(/^File:/i, "")
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const searchCache = new Map<string, CommonsCandidate[]>();

export async function searchCommons(query: string): Promise<CommonsCandidate[]> {
  const cached = searchCache.get(query);
  if (cached) return cached;
  await throttle();

  const url = new URL(API);
  url.searchParams.set("action", "query");
  url.searchParams.set("format", "json");
  url.searchParams.set("formatversion", "2");
  url.searchParams.set("generator", "search");
  url.searchParams.set("gsrsearch", query);
  url.searchParams.set("gsrnamespace", "6"); // File: pages only
  url.searchParams.set("gsrlimit", String(PER_PAGE));
  url.searchParams.set("prop", "imageinfo|categories");
  url.searchParams.set("iiprop", "url|size|mime|extmetadata|user");
  url.searchParams.set("cllimit", "50");

  let out: CommonsCandidate[] = [];
  try {
    const r = await fetch(url, { headers: { "User-Agent": USER_AGENT, Accept: "application/json" } });
    if (!r.ok) throw new Error(`Commons responded with ${r.status}`);
    const pages = ((await r.json()) as { query?: { pages?: any[] } }).query?.pages ?? [];
    out = pages.flatMap((page: any) => {
      const info = page.imageinfo?.[0];
      if (!info) return [];
      const meta: Record<string, { value?: string }> = info.extmetadata ?? {};
      const description = plain(String(meta.ImageDescription?.value ?? ""));
      const objectName = plain(String(meta.ObjectName?.value ?? ""));
      const title = String(page.title ?? "");
      const categories = (page.categories ?? [])
        .map((c: any) => String(c.title ?? "").replace(/^Category:/i, ""))
        .join(" ");
      return [{
        provider: "wikimedia" as const,
        id: String(page.pageid ?? title),
        fullUrl: String(info.url ?? ""),
        // The guard and the alt composer read this and nothing else. It is what
        // a person wrote about the file, plus the file's own title, which on
        // Commons is usually a caption. Categories are deliberately left out:
        // they are useful evidence that something is a drawing, and useless as
        // a source of words for an alt.
        description: [description, objectName, titleToWords(title)]
          .filter(Boolean).join(". "),
        photographer: plain(String(meta.Artist?.value ?? info.user ?? "")),
        pageUrl: String(info.descriptionurl ?? ""),
        width: Number(info.width ?? 0),
        height: Number(info.height ?? 0),
        mime: String(info.mime ?? ""),
        licence: "",
        categories,
        title,
        _meta: meta,
      } as CommonsCandidate & { _meta: Record<string, { value?: string }> }];
    });
  } catch (error) {
    console.warn(`  ! Commons search failed for "${query}": ${error instanceof Error ? error.message : error}`);
    out = [];
  }

  searchCache.set(query, out);
  return out;
}

// ---------------------------------------------------------------------------
// Picking
// ---------------------------------------------------------------------------
export interface Rejection { title: string; reason: string }

/**
 * Everything that can be decided about a file without knowing what it is
 * supposed to be of: licence, format, size, and whether it is a photograph at
 * all rather than an engraving, a map or a scanned plate.
 *
 * Split out from screen() so fill-post-images.ts can use Commons as the last
 * source in its priority list: it applies the relevance guard itself, once, to
 * candidates from every source, and only needs Commons to hand it files that
 * are usable in the first place.
 */
export function screenSource(
  c: CommonsCandidate & { _meta?: Record<string, { value?: string }> }
): { ok: true; licence: string } | { ok: false; reason: string } {
  if (!c.fullUrl) return { ok: false, reason: "no file URL" };
  if (!ALLOWED_MIME.has(c.mime)) return { ok: false, reason: `${c.mime || "unknown type"} is not a photograph format` };

  const licence = licenceVerdict(c._meta ?? {});
  if (!licence.ok) return { ok: false, reason: licence.reason };

  if (c.width < MIN_WIDTH) {
    return { ok: false, reason: `${c.width}px wide, under the ${MIN_WIDTH}px minimum` };
  }

  const haystack = `${c.title} ${c.description} ${c.categories}`.toLowerCase();
  for (const term of NOT_A_PHOTOGRAPH) {
    if (haystack.includes(term)) return { ok: false, reason: `looks like a ${term} rather than a photograph` };
  }

  return { ok: true, licence: licence.label };
}

export function screen(
  c: CommonsCandidate & { _meta?: Record<string, { value?: string }> },
  guard: Guard
): { ok: true; licence: string } | { ok: false; reason: string } {
  const source = screenSource(c);
  if (!source.ok) return source;

  const verdict = checkRelevance(c.description, guard);
  if (!verdict.ok) return { ok: false, reason: verdict.reason };

  return { ok: true, licence: source.licence };
}

/**
 * Commons files that are free, large enough and actually photographs, as plain
 * Candidates. The caller applies the relevance guard, so this is the shape
 * fill-post-images.ts plugs into findConfirmed as its last resort source.
 */
export async function searchCommonsUsable(query: string): Promise<Candidate[]> {
  const out: Candidate[] = [];
  for (const c of await searchCommons(query)) {
    const verdict = screenSource(c);
    if (!verdict.ok) continue;
    c.licence = verdict.licence;
    // The caption has to survive the trip through findConfirmed, which only
    // knows about Candidate, so the licence rides along in the credit fields
    // rather than in a Commons specific shape the caller cannot see.
    out.push({
      provider: "wikimedia",
      id: c.id,
      fullUrl: c.fullUrl,
      description: c.description,
      photographer: c.photographer,
      pageUrl: c.pageUrl,
      width: c.width,
      height: c.height,
      licence: verdict.licence,
    });
  }
  return out;
}

/**
 * Best candidate across all the queries, or the reasons nothing passed.
 *
 * Everything that passes is collected before anything is chosen, so the widest
 * image wins rather than the first one the search happened to return. Commons
 * search ranking is about page text, not picture quality.
 */
export async function findOnCommons(
  queries: string[], guard: Guard, usedIds: Set<string>
): Promise<{ candidate: CommonsCandidate; query: string } | { rejections: Rejection[]; tried: number }> {
  const accepted: { candidate: CommonsCandidate; query: string }[] = [];
  const rejections: Rejection[] = [];
  let tried = 0;

  for (const query of queries) {
    for (const c of await searchCommons(query)) {
      if (usedIds.has(`wikimedia:${c.id}`)) continue;
      if (accepted.some((a) => a.candidate.id === c.id)) continue;
      tried++;
      const verdict = screen(c, guard);
      if (verdict.ok) {
        c.licence = verdict.licence;
        accepted.push({ candidate: c, query });
      } else if (rejections.length < 15) {
        rejections.push({ title: titleToWords(c.title), reason: verdict.reason });
      }
    }
  }

  if (accepted.length === 0) return { rejections, tried };

  accepted.sort((a, b) => {
    // Anything at or above the preferred width is in the top group; inside each
    // group the wider file wins.
    const ga = a.candidate.width >= PREFER_WIDTH ? 1 : 0;
    const gb = b.candidate.width >= PREFER_WIDTH ? 1 : 0;
    if (ga !== gb) return gb - ga;
    return b.candidate.width - a.candidate.width;
  });
  const best = accepted[0];
  usedIds.add(`wikimedia:${best.candidate.id}`);
  return best;
}

/** What goes in media.caption, and therefore what an admin reads in the library. */
export function commonsCaption(c: CommonsCandidate): string {
  const who = c.photographer || "an unnamed contributor";
  return `Photo by ${who} on Wikimedia Commons. Licence: ${c.licence}. Source: ${c.pageUrl}`;
}
