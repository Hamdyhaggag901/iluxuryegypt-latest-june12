// End to end checks for the brochure generator, against a real database and a
// real Chrome. Everything asserted here is something that fails silently
// otherwise: a PDF that is not a PDF, a template that drops days, a broken
// image, a price that slipped into an evergreen document.
//
//   DATABASE_URL=... npx tsx scripts/test-brochure.ts

import { ENV_REPORT } from "./lib/script-env";
void ENV_REPORT;

import fs from "fs/promises";
import zlib from "zlib";
import { BROCHURE_TOUR_SLUGS } from "../shared/brochure-tours";
import { renderBrochureHtml } from "../server/brochure/template";
import {
  brochurePath,
  closeBrochureBrowser,
  generateBrochurePdfWithMeta,
} from "../server/brochure/generate";
const { storage } = await import("../server/storage");
import type { Hotel } from "../shared/schema";

let fails = 0;
const ok = (n: string, c: boolean, d = "") => { if (!c) fails++; console.log(`${c ? "PASS" : "FAIL"}  ${n}${d ? "  " + d : ""}`); };

/** Page count straight out of the PDF, by counting /Type /Page objects. */
function pdfPageCount(pdf: Buffer): number {
  const s = pdf.toString("latin1");
  const counts = [...s.matchAll(/\/Count\s+(\d+)/g)].map((m) => Number(m[1]));
  if (counts.length > 0) return Math.max(...counts);
  return (s.match(/\/Type\s*\/Page[^s]/g) ?? []).length;
}

/**
 * Every character the PDF's embedded fonts carry a ToUnicode entry for.
 *
 * Used as a diagnostic and as a non-vacuity check, NOT as the price gate, and
 * the distinction cost three attempts to get right.
 *
 * Reading the page text back is not practical here: Chrome subsets its fonts,
 * writes glyph ids as hex (`<37> Tj` rather than `(L) Tj`), and emits a
 * separate subset per page, so a document like this carries 24 CMaps and
 * decoding needs the per page resource dictionary to know which one applies.
 * Two earlier versions of this file tried to shortcut that and both PASSED
 * every absence check while reading nothing at all: the first searched the
 * compressed bytes and "found" a pound sign and the number 537 in every
 * brochure, the second looked for literal strings that Chrome never writes,
 * and injecting "From $4,500 per person" into the cover failed neither.
 *
 * Nor is the glyph set a sound gate on its own. Chrome's subsetting is not
 * minimal: best-luxury-egypt-tours carries a "$" glyph while its HTML contains
 * no dollar sign anywhere. Absence from every subset would prove absence from
 * the document, but presence proves nothing, so gating on it reports a price
 * in a brochure that has none.
 *
 * The gate is therefore the HTML, which is exact rather than approximate: the
 * only two sources of a glyph in this PDF are the document's text nodes and
 * CSS `content`, and section 6 checks both.
 */
function pdfGlyphs(pdf: Buffer): Set<string> {
  const glyphs = new Set<string>();
  let at = 0;
  while (true) {
    const start = pdf.indexOf("stream", at);
    if (start === -1) break;
    let from = start + "stream".length;
    if (pdf[from] === 0x0d) from++;
    if (pdf[from] === 0x0a) from++;
    const end = pdf.indexOf("endstream", from);
    if (end === -1) break;
    at = end + "endstream".length;

    let body: string;
    try {
      body = zlib.inflateSync(pdf.subarray(from, end)).toString("latin1");
    } catch {
      continue; // A font file or an image, not a CMap.
    }
    if (!body.includes("beginbfchar") && !body.includes("beginbfrange")) continue;
    for (const m of body.matchAll(/<[0-9a-fA-F]+>\s*<([0-9a-fA-F]+)>/g)) {
      for (const hex of m[1].match(/.{4}/g) ?? []) {
        glyphs.add(String.fromCharCode(parseInt(hex, 16)));
      }
    }
  }
  return glyphs;
}

/** The text a reader sees, from the HTML the PDF was printed from. */
function visibleText(html: string): string {
  return html
    .replace(/<style>[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

console.log("\n=== 1. Every slug renders a real PDF, with its own day count ===\n");
const first: Record<string, number> = {};
for (const slug of BROCHURE_TOUR_SLUGS) {
  const tour = await storage.getTourBySlug(slug);
  if (!tour) { ok(`${slug}: tour row exists`, false); continue; }
  const days = Array.isArray(tour.itinerary) ? tour.itinerary.length : 0;

  const started = Date.now();
  const { pdf, cached } = await generateBrochurePdfWithMeta(slug);
  first[slug] = Date.now() - started;

  const magic = pdf.subarray(0, 4).toString("latin1");
  const pages = pdfPageCount(pdf);
  // cover + intro + N days + inclusions + hotels + route + team + closing
  const expected = 1 + 1 + days + 1 + 1 + 1 + 1 + 1;
  console.log(
    `  ${slug.padEnd(32)} ${days} days  ${String(pdf.length).padStart(8)} bytes  ${String(pages).padStart(2)} pages  ${String(first[slug]).padStart(5)}ms${cached ? "  (cached)" : ""}`
  );
  ok(`${slug}: starts with %PDF`, magic === "%PDF", magic);
  ok(`${slug}: page count matches its ${days} day itinerary`, pages === expected, `got ${pages}, expected ${expected}`);
}

console.log("\n=== 2. The browser is reused and the second call hits the disk cache ===\n");
{
  const slug = BROCHURE_TOUR_SLUGS[0];
  const started = Date.now();
  const second = await generateBrochurePdfWithMeta(slug);
  const ms = Date.now() - started;
  console.log(`  first render ${first[slug]}ms, second call ${ms}ms, cached=${second.cached}`);
  ok("the second call is served from the cache", second.cached === true);
  ok("and is dramatically faster than the render", ms < first[slug] / 2, `${ms}ms vs ${first[slug]}ms`);
  ok("the cached file is on disk where the route will look for it",
     await fs.stat(brochurePath(slug)).then(() => true).catch(() => false));

  // Touching the tour row must invalidate it, or an admin's edit never ships.
  await storage.updateTour((await storage.getTourBySlug(slug))!.id, { title: (await storage.getTourBySlug(slug))!.title });
  const third = await generateBrochurePdfWithMeta(slug);
  ok("saving the tour invalidates the cache", third.cached === false);
}

console.log("\n=== 3. A PENDING_UPLOAD image renders the navy fallback, never a broken image ===\n");
{
  const tour = (await storage.getTourBySlug(BROCHURE_TOUR_SLUGS[0]))!;
  const hotelIds: string[] = Array.isArray(tour.hotelIds) ? tour.hotelIds : [];
  const hotels = (await Promise.all(hotelIds.map((id) => storage.getHotel(id)))).filter((h): h is Hotel => Boolean(h));
  const html = renderBrochureHtml(tour, hotels);

  const days = (tour.itinerary as Array<Record<string, unknown>>) ?? [];
  const pendingDays = days.filter((d) => d.image === "PENDING_UPLOAD" || d.image === "").length;
  const pendingHotels = hotels.filter((h) => !h.image || h.image === "PENDING_UPLOAD").length;
  // Counted on the rendered class attribute, not the bare string: the
  // stylesheet declares .photo-fallback twice and the first version of this
  // check counted those as panels.
  const fallbacks = (html.match(/class="photo photo-fallback/g) ?? []).length;

  console.log(`  ${pendingDays} day images and ${pendingHotels} hotel images are missing or PENDING_UPLOAD`);
  ok("no src attribute anywhere points at PENDING_UPLOAD", !/src="[^"]*PENDING_UPLOAD/.test(html));
  ok("no src attribute is empty", !/src=""/.test(html));
  ok("every missing image became a navy fallback panel",
     fallbacks === pendingDays + pendingHotels, `${fallbacks} fallbacks for ${pendingDays + pendingHotels} missing images`);
  ok("the fallback carries the place name", /photo-fallback[^>]*><span>[^<]+<\/span>/.test(html));

  // The last day has no accommodation. An empty "Stay" line would read as a
  // missing value rather than as a departure day.
  const lastDay = days[days.length - 1] ?? {};
  ok("the last day has no accommodation in the data", !lastDay.accommodation);
  const stayLines = (html.match(/foot-label">Stay</g) ?? []).length;
  ok("and prints no Stay line for it", stayLines === days.length - 1, `${stayLines} Stay lines for ${days.length} days`);
}

console.log("\n=== 6. No prices and no currency symbols anywhere in any brochure ===\n");
for (const slug of BROCHURE_TOUR_SLUGS) {
  const tour = (await storage.getTourBySlug(slug))!;
  const { pdf } = await generateBrochurePdfWithMeta(slug);
  const hotelIds: string[] = Array.isArray(tour.hotelIds) ? tour.hotelIds : [];
  const hotels = (await Promise.all(hotelIds.map((id) => storage.getHotel(id)))).filter((h): h is Hotel => Boolean(h));
  const html = renderBrochureHtml(tour, hotels);
  const visible = visibleText(html);
  const css = html.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? "";

  // The gate. Text nodes and CSS content are the only two ways a character can
  // reach a page of this document, so checking both is exact.
  const currency = visible.match(/[$\u00a3\u20ac\u00a5]|\bUSD\b|\bEUR\b|\bGBP\b/g) ?? [];
  ok(`${slug}: no currency symbol or code in the page text`, currency.length === 0, currency.slice(0, 3).join(" "));
  ok(`${slug}: no currency injected through CSS content`,
     !/content:\s*["'][^"']*[$\u00a3\u20ac\u00a5]/.test(css));

  // Digits on their own are fine and expected: "Day 1", "24/7", the route
  // numbering. A price is a run of three or more, or a grouped thousand.
  const priceish = visible.match(/\b\d{1,3}(?:,\d{3})+\b|\b\d{3,}\b/g) ?? [];
  ok(`${slug}: no number shaped like a price`, priceish.length === 0, priceish.slice(0, 3).join(" "));
  const wording = visible.match(/\bper person\b|\bfrom \d|\bprice[ds]?\b|\brate\b/gi) ?? [];
  ok(`${slug}: no price wording`, wording.length === 0, wording.slice(0, 3).join(" "));
  ok(`${slug}: the tour's own price (${tour.price}) is absent`, !visible.includes(String(tour.price)));

  // The PDF is real and its fonts carry ordinary letters, so the page above
  // was actually printed rather than coming out blank.
  const glyphs = pdfGlyphs(pdf);
  const missing = [..."Dayabcdefghinoprstu"].filter((c) => !glyphs.has(c));
  ok(`${slug}: the printed PDF carries readable text (${glyphs.size} glyphs)`, missing.length === 0, missing.join(""));
}

console.log("\n=== House rules ===\n");
{
  const tour = (await storage.getTourBySlug(BROCHURE_TOUR_SLUGS[0]))!;
  const html = renderBrochureHtml(tour, []);
  ok("no em or en dash in the rendered HTML", !/[\u2013\u2014]/.test(html));
  ok("A4 page size with no margin", html.includes("@page { size: A4; margin: 0; }"));
  ok("every page breaks after itself", html.includes("page-break-after: always"));
  ok("fonts are embedded as data URIs, not linked", html.includes("data:font/woff2;base64,") && !html.includes("fonts.googleapis.com"));
  ok("a tour with no hotels simply omits the hotels page", !html.includes("Where you will stay"));
}

await closeBrochureBrowser();
console.log(fails === 0 ? "\nAll brochure cases passed." : `\n${fails} failure(s)`);
process.exit(fails === 0 ? 0 : 1);
