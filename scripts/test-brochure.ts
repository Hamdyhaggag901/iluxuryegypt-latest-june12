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
import puppeteer from "puppeteer";
import { BROCHURE_TOUR_SLUGS } from "../shared/brochure-tours";
import { renderBrochureHtml } from "../server/brochure/template";
import { SITE_URL } from "../server/seo-meta";
import {
  brochurePath,
  closeBrochureBrowser,
  generateBrochurePdfWithMeta,
} from "../server/brochure/generate";
const { storage } = await import("../server/storage");
import type { Hotel, ItineraryDay } from "../shared/schema";

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

    // bfchar entries are pairs, `<src> <dst>`.
    for (const block of body.matchAll(/beginbfchar([\s\S]*?)endbfchar/g)) {
      for (const m of block[1].matchAll(/<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>/g)) {
        for (const hex of m[2].match(/.{4}/g) ?? []) glyphs.add(String.fromCharCode(parseInt(hex, 16)));
      }
    }

    // bfrange entries are TRIPLES, `<lo> <hi> <dst>`, and reading them as
    // pairs is how an earlier version of this lost F, G, q and r: it matched
    // <lo> <hi> and treated the range's end as a codepoint. The destination
    // increments across the range, or is given as an explicit array.
    for (const block of body.matchAll(/beginbfrange([\s\S]*?)endbfrange/g)) {
      for (const m of block[1].matchAll(/<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>\s*(?:<([0-9a-fA-F]+)>|\[([^\]]*)\])/g)) {
        const lo = parseInt(m[1], 16);
        const hi = parseInt(m[2], 16);
        if (m[3] !== undefined) {
          const base = parseInt(m[3].slice(-4), 16);
          for (let i = 0; i <= hi - lo; i++) glyphs.add(String.fromCharCode(base + i));
        } else if (m[4] !== undefined) {
          for (const dst of m[4].matchAll(/<([0-9a-fA-F]+)>/g)) {
            for (const hex of dst[1].match(/.{4}/g) ?? []) glyphs.add(String.fromCharCode(parseInt(hex, 16)));
          }
        }
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
  // The journey, team and inclusions sections can each run to more than one
  // sheet now, so the expected count is the number of .pg divs the template
  // actually produced rather than a fixed formula. What this asserts is that
  // the PDF has exactly as many sheets as the HTML has pages, which is the
  // invariant that broke when a page was added without the folio following.
  const hotelIds: string[] = Array.isArray(tour.hotelIds) ? tour.hotelIds : [];
  const hotelCount = (await Promise.all(hotelIds.map((id) => storage.getHotel(id)))).filter(Boolean).length;
  const hotels = (await Promise.all(hotelIds.map((id) => storage.getHotel(id)))).filter((h): h is Hotel => Boolean(h));
  const expected = (renderBrochureHtml(tour, hotels).match(/<div class="pg[ "]/g) ?? []).length;
  console.log(
    `  ${slug.padEnd(32)} ${days} days  ${hotelCount} hotels  ${String(pdf.length).padStart(8)} bytes  ${String(pages).padStart(2)} pages  ${String(first[slug]).padStart(5)}ms${cached ? "  (cached)" : ""}`
  );
  ok(`${slug}: starts with %PDF`, magic === "%PDF", magic);
  ok(`${slug}: the PDF has one sheet per template page`, pages === expected, `PDF ${pages}, HTML ${expected}`);
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
  const fallbacks = (html.match(/class="[^"]*\bfallback\b/g) ?? []).length;

  console.log(`  ${pendingDays} day images and ${pendingHotels} hotel images are missing or PENDING_UPLOAD`);
  ok("no src attribute anywhere points at PENDING_UPLOAD", !/src="[^"]*PENDING_UPLOAD/.test(html));
  ok("no src attribute is empty", !/src=""/.test(html));
  ok("every missing image became a navy fallback panel",
     fallbacks === pendingDays + pendingHotels, `${fallbacks} fallbacks for ${pendingDays + pendingHotels} missing images`);
  ok("the fallback carries the place name", /\bfallback"><span>[^<]+<\/span>/.test(html));

  // The last day has no accommodation. An empty "Stay" line would read as a
  // missing value rather than as a departure day.
  const lastDay = days[days.length - 1] ?? {};
  ok("the last day has no accommodation in the data", !lastDay.accommodation);
  // The approved design carries no accommodation line on a day page at all, so
  // the last day cannot print an empty one and neither can any other.
  const stayLines = (html.match(/\bStay\b/g) ?? []).length;
  ok("no day page prints a Stay line", stayLines === 0, `${stayLines} Stay lines`);
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

console.log("\n=== 3b. A URL that fails to load also becomes the navy panel ===\n");
{
  // PENDING_UPLOAD and empty are caught statically. This is the other half:
  // a present, well formed URL that does not resolve. It is not hypothetical,
  // it is what a deleted upload looks like, and the only place it shows up is
  // as a broken image in a document already sent to a client.
  const tour = (await storage.getTourBySlug(BROCHURE_TOUR_SLUGS[0]))!;
  const broken = {
    ...tour,
    heroImage: "https://127.0.0.1:9/does-not-resolve.jpg",
    itinerary: (tour.itinerary as ItineraryDay[]).map((d) => ({ ...d, image: "https://127.0.0.1:9/nope.jpg" })),
  } as typeof tour;
  const html = renderBrochureHtml(broken, []);
  ok("the markup still carries an img, so this is a runtime swap not a static one",
     (html.match(/<img /g) ?? []).length > 0);
  ok("every img has an onerror and a label to fall back to",
     (html.match(/<img [^>]*onerror="brochureFallback\(this\)"[^>]*data-fallback="/g) ?? []).length === (html.match(/<img /g) ?? []).length);

  const browser = await puppeteer.launch({
    headless: "new" as unknown as boolean,
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
  });
  const page = await browser.newPage();
  try {
    await page.setContent(html, { waitUntil: "networkidle0" });
    const counts = await page.evaluate(() => ({
      imgs: document.querySelectorAll("img").length,
      panels: document.querySelectorAll(".fallback").length,
      broken: [...document.querySelectorAll("img")].filter((i) => !(i as HTMLImageElement).naturalWidth).length,
    }));
    console.log(`  after load: ${counts.imgs} img, ${counts.panels} panels, ${counts.broken} broken`);
    ok("no broken image survives to the print", counts.broken === 0, `${counts.broken} broken`);
    ok("each failed image became a panel", counts.imgs === 0 && counts.panels > 0, `${counts.imgs} img left`);
    const label = await page.evaluate(() => document.querySelector(".fallback span")?.textContent ?? "");
    ok("the panel carries the place name", label.trim().length > 0, JSON.stringify(label));
  } finally {
    await page.close().catch(() => undefined);
    await browser.close().catch(() => undefined);
  }
}

console.log("\n=== 3c. The folio goes cream on flip pages, and only there ===\n");
{
  // On a flipped day page the image band occupies the bottom 116mm, so the
  // folio prints over the photograph. The rule uses :has(), which cannot be
  // checked by looking for the selector in the stylesheet: a Chrome that did
  // not support it would parse the rule, ignore it, and leave the folio grey
  // on the picture with nothing to show for it. So this reads the COMPUTED
  // colour off a real flip page and a real unflipped one.
  const tour = (await storage.getTourBySlug("egypt-private-tours"))!;
  const html = renderBrochureHtml(tour, []);
  ok("the rule is in the stylesheet", html.includes(".pg:has(.dpg.flip) .fol{color:rgba(247,244,239,.75)}"));

  const browser = await puppeteer.launch({
    headless: "new" as unknown as boolean,
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
  });
  const page = await browser.newPage();
  try {
    await page.setContent(html, { waitUntil: "networkidle0" });
    const colours = await page.evaluate(() =>
      [...document.querySelectorAll(".pg")].map((pg) => ({
        flip: Boolean(pg.querySelector(".dpg.flip")),
        day: Boolean(pg.querySelector(".dpg")),
        colour: (() => {
          const fol = pg.querySelector(".fol");
          return fol ? getComputedStyle(fol).color : null;
        })(),
      }))
    );
    const CREAM = "rgba(247, 244, 239, 0.75)";
    const GREY = "rgb(154, 162, 173)";
    const flips = colours.filter((c) => c.flip);
    const others = colours.filter((c) => !c.flip && c.colour !== null);
    console.log(`  ${flips.length} flip pages, ${others.length} other pages with a folio`);
    ok("every flip page's folio computes cream", flips.length > 0 && flips.every((c) => c.colour === CREAM),
       flips.map((c) => c.colour).join(" "));
    ok("no other page's folio changed", others.every((c) => c.colour === GREY),
       others.filter((c) => c.colour !== GREY).map((c) => c.colour).join(" "));
    // The unflipped day pages are the ones that prove this is scoped to the
    // flip and not to day pages in general.
    const unflippedDays = colours.filter((c) => c.day && !c.flip);
    ok("unflipped day pages keep the grey folio", unflippedDays.length > 0 && unflippedDays.every((c) => c.colour === GREY),
       `${unflippedDays.length} pages`);
    ok("the folio did not move", html.includes(".fol{position:absolute;bottom:10mm;left:18mm;right:18mm;"));
  } finally {
    await page.close().catch(() => undefined);
    await browser.close().catch(() => undefined);
  }
}

console.log("\n=== 8. Images come from the row, resolved against the site origin ===\n");
for (const slug of BROCHURE_TOUR_SLUGS) {
  const tour = (await storage.getTourBySlug(slug))!;
  const hotelIds: string[] = Array.isArray(tour.hotelIds) ? tour.hotelIds : [];
  const hotels = (await Promise.all(hotelIds.map((id) => storage.getHotel(id)))).filter((h): h is Hotel => Boolean(h));
  const html = renderBrochureHtml(tour, hotels);
  const days = (tour.itinerary as ItineraryDay[]) ?? [];

  // "Matches exactly" means the stored path, made absolute. A bare relative
  // src resolves against about:blank under setContent and loads nothing, so
  // the origin is the difference between photographs and a blank brochure.
  const origin = (process.env.BROCHURE_ASSET_ORIGIN || SITE_URL).replace(/\/+$/, "");
  const absolute = (v: string) => `${origin}${v.startsWith("/") ? "" : "/"}${v}`;

  const cover = html.match(/<img class="bleed" src="([^"]+)"/)?.[1];
  ok(`${slug}: the cover uses the tour's own hero_image`,
     cover === absolute(String(tour.heroImage)), `${cover} vs ${absolute(String(tour.heroImage))}`);
  ok(`${slug}: and it carries the stored path unchanged`,
     Boolean(cover && cover.endsWith(String(tour.heroImage))), String(cover));

  // Day images, in order, each against its own itinerary entry.
  const dayImgs = [...html.matchAll(/<div class="dimg">(?:<img src="([^"]+)"|<div)/g)].map((m) => m[1]);
  ok(`${slug}: one image slot per day`, dayImgs.length === days.length, `${dayImgs.length} for ${days.length}`);
  const wrong = days
    .map((d, i) => {
      const stored = String(d.image || "");
      const rendered = dayImgs[i];
      if (!stored || stored === "PENDING_UPLOAD") return rendered === undefined ? null : `day ${i + 1} should be a panel`;
      return rendered === absolute(stored) ? null : `day ${i + 1}: ${rendered} vs ${absolute(stored)}`;
    })
    .filter(Boolean);
  ok(`${slug}: every day image is that day's itinerary[n].image`, wrong.length === 0, wrong.slice(0, 2).join("; "));

  const hotelImgs = [...html.matchAll(/<div class="hrow">\s*(?:<img src="([^"]+)"|<div)/g)].map((m) => m[1]);
  const hotelWrong = hotels
    .map((h, i) => {
      const stored = String(h.image || "");
      if (!stored || stored === "PENDING_UPLOAD") return hotelImgs[i] === undefined ? null : `hotel ${i + 1} should be a panel`;
      return hotelImgs[i] === absolute(stored) ? null : `hotel ${i + 1}: ${hotelImgs[i]}`;
    })
    .filter(Boolean);
  ok(`${slug}: every hotel image is that hotel's own image`, hotelWrong.length === 0, hotelWrong.slice(0, 2).join("; "));

  ok(`${slug}: no src is left relative`, !/src="\/(?!\/)/.test(html));
  ok(`${slug}: no src points at PENDING_UPLOAD`, !/src="[^"]*PENDING_UPLOAD/.test(html));
}

console.log("\n=== 9. No markup reaches the page as visible text ===\n");
{
  // Checked as innerText from real Chrome, not as the source with its tags
  // stripped. The difference matters in both directions: the approved cover
  // line uses &nbsp; as a deliberate spacer and an escaped "&" is correctly
  // stored as &amp;, so a source level check fails on markup that is right;
  // and a literal "<p>" that leaked into a text node is only visible once the
  // page is laid out. innerText is what a reader sees.
  const browser = await puppeteer.launch({
    headless: "new" as unknown as boolean,
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
  });
  const page = await browser.newPage();
  try {
    for (const slug of BROCHURE_TOUR_SLUGS) {
      const tour = (await storage.getTourBySlug(slug))!;
      const hotelIds: string[] = Array.isArray(tour.hotelIds) ? tour.hotelIds : [];
      const hotels = (await Promise.all(hotelIds.map((id) => storage.getHotel(id)))).filter((h): h is Hotel => Boolean(h));
      const html = renderBrochureHtml(tour, hotels);

      // Not a vacuous check: the source really does hold markup.
      const sources = String(tour.description)
        + (tour.itinerary as ItineraryDay[]).map((d) => String(d.description || "")).join("")
        + hotels.map((h) => String(h.description || "")).join("");
      ok(`${slug}: the source fields do contain markup`, /<p>|<a\s+href=|&nbsp;|&amp;/.test(sources));

      await page.setContent(html, { waitUntil: "domcontentloaded" });
      const visible = (await page.evaluate(() => document.body.innerText)).replace(/\s+/g, " ");

      for (const needle of ["<p>", "</p>", "href=", "&nbsp;", "<h3>", "<div", "<a ", "&amp;", "&lt;", "&quot;", "<br"]) {
        const at = visible.indexOf(needle);
        ok(`${slug}: no "${needle}" in the rendered page text`, at === -1,
           at === -1 ? "" : visible.slice(Math.max(0, at - 45), at + 45));
      }
      // Decoded rather than merely deleted: the ampersand survives as a word.
      ok(`${slug}: an escaped ampersand reads as "&"`, / & /.test(visible));
      // And the anchor's words survive while its href does not.
      ok(`${slug}: link text is kept as words`, visible.includes("sites"), "");
      // Stripping a tag leaves a space where it was, so an inline element that
      // closes before punctuation produces "the Nile ." unless it is closed up.
      const looseStops = visible.match(/\w \./g) ?? [];
      ok(`${slug}: no space left before a full stop`, looseStops.length === 0, looseStops.slice(0, 2).join(" | "));
      const looseCommas = visible.match(/\w ,/g) ?? [];
      ok(`${slug}: no space left before a comma`, looseCommas.length === 0, looseCommas.slice(0, 2).join(" | "));

      // The pulled quote is no longer a sentence the reader has just read.
      const dup = await page.evaluate(() => {
        const paras = [...document.querySelectorAll("p")].map((el) => (el.textContent ?? "").trim());
        return [...document.querySelectorAll(".quote")]
          .map((el) => (el.textContent ?? "").trim())
          .filter((q) => q.length > 0 && paras.some((para) => para.includes(q)));
      });
      ok(`${slug}: no pulled quote repeats a sentence from its own body`, dup.length === 0,
         dup.slice(0, 1).map((q) => q.slice(0, 60)).join(""));
      const quoteCount = await page.evaluate(() => document.querySelectorAll(".quote").length);
      ok(`${slug}: there are quotes to check`, quoteCount > 0, String(quoteCount));
    }
  } finally {
    await page.close().catch(() => undefined);
    await browser.close().catch(() => undefined);
  }
}

console.log("\n=== 10. The hotels page has a heading of its own ===\n");
for (const slug of BROCHURE_TOUR_SLUGS) {
  const tour = (await storage.getTourBySlug(slug))!;
  const hotelIds: string[] = Array.isArray(tour.hotelIds) ? tour.hotelIds : [];
  const hotels = (await Promise.all(hotelIds.map((id) => storage.getHotel(id)))).filter((h): h is Hotel => Boolean(h));
  const html = renderBrochureHtml(tour, hotels);
  const hotBlocks = [...html.matchAll(/<div class="hot">([\s\S]*?)\n  <\/div>/g)].map((m) => m[1]);
  if (hotels.length === 0) {
    ok(`${slug}: no hotels, so no hotels page and no heading`, hotBlocks.length === 0 && !html.includes("Where the nights are spent"));
    continue;
  }
  const headings = hotBlocks.map((b) => b.match(/<h3>([^<]+)<\/h3>/)?.[1] ?? "");
  ok(`${slug}: every hotels page carries a heading`, headings.every((h) => h.length > 0), headings.join(" | "));
  ok(`${slug}: the first reads "Where the nights are spent."`, headings[0] === "Where the nights are spent.", headings[0]);
  ok(`${slug}: any further page reads "continued"`,
     headings.slice(1).every((h) => h === "Where the nights are spent, continued."), headings.slice(1).join(" | "));
  ok(`${slug}: the heading uses the standard kicker`,
     hotBlocks.every((b) => b.includes('<div class="kick">The detail</div>')));
  ok(`${slug}: the heading sits above the first hotel row`,
     hotBlocks.every((b) => b.indexOf('class="hothead"') < b.indexOf('class="hrow"')));
  ok(`${slug}: the folio still reads WHERE YOU WILL STAY`,
     (html.match(/<span>WHERE YOU WILL STAY<\/span>/g) ?? []).length === hotBlocks.length);
  ok(`${slug}: the grid makes room for the heading`, html.includes("grid-template-rows:auto 1fr 1fr"));
}

console.log("\n=== 7. The approved layout, per tour ===\n");
for (const slug of BROCHURE_TOUR_SLUGS) {
  const tour = (await storage.getTourBySlug(slug))!;
  const hotelIds: string[] = Array.isArray(tour.hotelIds) ? tour.hotelIds : [];
  const hotels = (await Promise.all(hotelIds.map((id) => storage.getHotel(id)))).filter((h): h is Hotel => Boolean(h));
  const html = renderBrochureHtml(tour, hotels);
  const days = (tour.itinerary as ItineraryDay[]) ?? [];
  console.log(`  --- ${slug} (${days.length} days, ${hotels.length} hotels)`);

  // Day pages alternate strictly, and the flipped ones put the body BEFORE
  // the image in the markup, which is what the approved design specifies and
  // what a reader of the HTML alone would get wrong.
  const dayBlocks = [...html.matchAll(/<div class="dpg( flip)?">([\s\S]*?)\n  <\/div>/g)];
  ok(`${slug}: one dpg block per itinerary day`, dayBlocks.length === days.length, `${dayBlocks.length} for ${days.length}`);
  const flips = dayBlocks.map((m) => Boolean(m[1]));
  ok(`${slug}: day pages alternate, starting unflipped`,
     flips.every((f, i) => f === (i % 2 === 1)), flips.map((f) => (f ? "F" : "-")).join(""));
  const orderWrong = dayBlocks.filter((m) => {
    const inner = m[2];
    const imgAt = inner.indexOf('<div class="dimg">');
    const bodyAt = inner.indexOf('<div class="body">');
    return m[1] ? bodyAt > imgAt : imgAt > bodyAt;
  });
  ok(`${slug}: flipped days put the body first, unflipped put the image first`, orderWrong.length === 0, `${orderWrong.length} wrong`);
  const nums = [...html.matchAll(/<div class="num">(\d+)<\/div>/g)].map((m) => m[1]);
  ok(`${slug}: every day number is two digits, zero padded`,
     nums.length === days.length && nums.every((x) => /^\d{2}$/.test(x)), nums.join(","));

  // The hotels page: .hot with .hrow children, two a page, in hotel_ids order.
  const hotBlocks = [...html.matchAll(/<div class="hot">([\s\S]*?)\n  <\/div>/g)];
  ok(`${slug}: ${Math.ceil(hotels.length / 2)} hotel page(s)`, hotBlocks.length === Math.ceil(hotels.length / 2), String(hotBlocks.length));
  const rowsPerPage = hotBlocks.map((m) => (m[1].match(/<div class="hrow">/g) ?? []).length);
  ok(`${slug}: two hrow a page, the last carrying the remainder`,
     rowsPerPage.every((r, i) => r === (i === hotBlocks.length - 1 ? hotels.length - i * 2 : 2)) &&
       rowsPerPage.reduce((a, b) => a + b, 0) === hotels.length,
     rowsPerPage.join("+"));
  if (hotels.length > 0) {
    const names = [...html.matchAll(/<h5>([^<]+)<\/h5>/g)].map((m) => m[1]);
    ok(`${slug}: hotels are in hotel_ids order`,
       names.join("|") === hotels.map((x) => x.name).join("|"), names.join(", "));
    ok(`${slug}: the hotels page carries no price, tier or star rating`,
       !/price|tier|star|rating|room categor/i.test(hotBlocks.map((m) => m[1]).join(" ")));
  }

  // The route: a gold timeline, not a map.
  const routeBlock = html.match(/<div class="route">([\s\S]*?)<\/div>\n  <\/div>/)?.[1] ?? "";
  const stopCount = (routeBlock.match(/<div class="stop">/g) ?? []).length;
  const expectedStops = (() => {
    const out: string[] = [];
    for (const d of days) {
      const raw = String(d.placeName || "").trim();
      if (!raw) continue;
      // Mirrors the template's site-to-region mapping for the places this
      // fixture actually uses.
      const broad = /giza|great pyramid/i.test(raw) ? "Giza"
        : /saqqara/i.test(raw) ? "Saqqara"
        : /karnak|valley of the kings|luxor/i.test(raw) ? "Luxor"
        : /philae|aswan/i.test(raw) ? "Aswan"
        : /edfu/i.test(raw) ? "Edfu"
        : /kom ombo/i.test(raw) ? "Kom Ombo"
        : raw;
      if (out[out.length - 1] !== broad) out.push(broad);
    }
    return out;
  })();
  ok(`${slug}: ${expectedStops.length} stops after collapsing consecutive repeats`,
     stopCount === expectedStops.length, `${stopCount} vs ${expectedStops.length}: ${expectedStops.join(" > ")}`);
  ok(`${slug}: no consecutive repeat survived`,
     !expectedStops.some((x, i) => i > 0 && x === expectedStops[i - 1]));
  ok(`${slug}: the route page has no svg and no map tile`, !/<svg|leaflet|mapbox|tile/i.test(html));

  // Folios: sequential, correct for this tour's own page count, none on the
  // cover or the closing page.
  const pageCount = (html.match(/<div class="pg[ "]/g) ?? []).length;
  const folios = [...html.matchAll(/<div class="fol">.*?<span>(\d+)<\/span><\/div>/g)].map((m) => Number(m[1]));
  ok(`${slug}: ${pageCount} pages, ${folios.length} folios`, folios.length === pageCount - 2, `${folios.length} for ${pageCount} pages`);
  ok(`${slug}: folios run 02 to ${String(pageCount - 1).padStart(2, "0")} with no gaps`,
     folios.every((x, i) => x === i + 2), folios.join(","));
  const firstPage = html.slice(html.indexOf('<div class="pg">'), html.indexOf('<div class="pg">', 10));
  ok(`${slug}: the cover carries no folio`, !firstPage.includes('class="fol"'));
  ok(`${slug}: the closing page carries no folio`,
     !(html.match(/<div class="pg end">[\s\S]*$/)?.[0] ?? "").includes('class="fol"'));

  // The approved stylesheet, and the pieces of it that are easy to lose.
  ok(`${slug}: the drop cap rule is present`, html.includes("p.first::first-letter"));
  ok(`${slug}: the quote rule is present`, html.includes('.quote{margin:9mm 0;padding-left:7mm;border-left:1px solid var(--g)'));
  ok(`${slug}: the day numbers hang off the page edges`,
     html.includes(".dpg .num{bottom:-12mm}") && html.includes(".dpg.flip .num{top:-14mm;bottom:auto}"));
  ok(`${slug}: the cover veil keeps its three gradient stops`,
     html.includes("linear-gradient(180deg,rgba(38,48,63,.5),rgba(38,48,63,.12) 42%,rgba(38,48,63,.82))"));
  ok(`${slug}: the hotel row keeps its 88mm image column`, html.includes("grid-template-columns:88mm 1fr"));
  ok(`${slug}: fonts stay embedded, with no Google request`,
     html.includes("data:font/woff2;base64,") && !html.includes("fonts.googleapis.com") && !html.includes("fonts.gstatic.com"));

  // Copy rules, across everything the template writes rather than only the
  // paragraph the earlier check looked at.
  const prose = visibleText(html);
  const banned = ["delve", "nestled", "boasts", "hidden gem", "testament to", "tapestry", "meticulously", "unparalleled", "iconic", "breathtaking", "stunning", "in conclusion"];
  const hits = banned.filter((b) => new RegExp(`\\b${b}\\b`, "i").test(prose));
  ok(`${slug}: no banned word`, hits.length === 0, hits.join(", "));
  ok(`${slug}: no em or en dash`, !/[\u2013\u2014]/.test(html));
}

console.log("\n=== 11. Nothing oversets, and a long list paginates ===\n");
{
  // Measured in real Chrome, not estimated. The template's own fitting model
  // is a mechanism; this is the guarantee. .pg is height:297mm with
  // overflow:hidden, so content that runs past the box is clipped silently
  // and a reader simply never sees the last lines.
  const browser = await puppeteer.launch({
    headless: "new" as unknown as boolean,
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
  });
  const page = await browser.newPage();
  try {
    for (const slug of BROCHURE_TOUR_SLUGS) {
      const tour = (await storage.getTourBySlug(slug))!;
      const hotelIds: string[] = Array.isArray(tour.hotelIds) ? tour.hotelIds : [];
      const hotels = (await Promise.all(hotelIds.map((id) => storage.getHotel(id)))).filter((h): h is Hotel => Boolean(h));
      const html = renderBrochureHtml(tour, hotels);
      await page.setContent(html, { waitUntil: "domcontentloaded" });

      const overset = await page.evaluate(() => {
        const out: Array<{ index: number; kind: string; over: number }> = [];
        document.querySelectorAll(".pg").forEach((pg, index) => {
          const box = pg.getBoundingClientRect();
          // The day number hangs off its band on purpose and the folio is
          // pinned inside; everything else must end within the sheet.
          let bottom = 0;
          pg.querySelectorAll(".pad, .hot, .body, .cov, .tm, .cols, .route, p, h3, h4, li, .quote").forEach((el) => {
            if (el.closest(".num") || el.classList.contains("num")) return;
            const r = el.getBoundingClientRect();
            if (r.height > 0) bottom = Math.max(bottom, r.bottom - box.top);
          });
          const kind = pg.querySelector(".dpg") ? "day"
            : pg.querySelector(".hot") ? "hotels"
            : pg.querySelector(".route") ? "route"
            : pg.querySelector(".cov") ? "cover"
            : pg.classList.contains("end") ? "closing"
            : "text";
          if (bottom > box.height + 1) out.push({ index, kind, over: Math.round(bottom - box.height) });
        });
        return out;
      });
      ok(`${slug}: no page's content passes the page box`, overset.length === 0,
         overset.slice(0, 3).map((o) => `page ${o.index} (${o.kind}) over by ${o.over}px`).join("; "));
    }

    // The deployment's own shape: 9 nights and a list too long for one page.
    const long = (await storage.getTourBySlug("egypt-private-tour-packages"))!;
    const longHotels = (await Promise.all((long.hotelIds as string[]).map((id) => storage.getHotel(id))))
      .filter((h): h is Hotel => Boolean(h));
    const longHtml = renderBrochureHtml(long, longHotels);
    const inclusionHeads = [...longHtml.matchAll(/<h3>(What is carried for you[^<]*)<\/h3>/g)].map((m) => m[1]);
    console.log(`  ${long.slug}: ${(long.includes as string[]).length} includes, ${(long.excludes as string[]).length} excludes, ${inclusionHeads.length} inclusions page(s)`);
    ok("a long inclusions list runs to a second page", inclusionHeads.length >= 2, `${inclusionHeads.length}`);
    ok("the second inclusions page repeats the heading with continued",
       inclusionHeads[1] === "What is carried for you, and what is not, continued.", inclusionHeads[1]);
    ok("the folio reads INCLUSIONS on both",
       (longHtml.match(/<span>INCLUSIONS<\/span>/g) ?? []).length === inclusionHeads.length);
    // Every item survives the split.
    const rendered = [...longHtml.matchAll(/<li>([^<]+)<\/li>/g)].map((m) => m[1]);
    const wanted = [...(long.includes as string[]), ...(long.excludes as string[])];
    const missing = wanted.filter((w) => !rendered.some((r) => r === w.replace(/&/g, "&amp;")));
    ok("no inclusion is lost in the split", missing.length === 0, missing.slice(0, 2).join(" | "));

    // And the type was not shrunk to make it fit.
    ok("the approved list type size is unchanged", longHtml.includes(".cols li{list-style:none;font-size:9.5pt;"));
    ok("the approved body type size is unchanged", longHtml.includes("p{font-size:10.5pt;line-height:1.85;"));
    ok("the approved h3 size is unchanged", longHtml.includes("h3{font-family:Playfair Display,serif;font-weight:400;font-size:30pt;"));
  } finally {
    await page.close().catch(() => undefined);
    await browser.close().catch(() => undefined);
  }
}

console.log("\n=== 12. The day pages, cover and closing page are untouched ===\n");
{
  const tour = (await storage.getTourBySlug("egypt-private-tours"))!;
  const html = renderBrochureHtml(tour, []);
  // The approved rules for everything that was explicitly out of scope.
  for (const rule of [
    ".dpg{position:absolute;inset:0;display:grid;grid-template-rows:116mm 1fr}",
    ".dpg.flip{grid-template-rows:1fr 116mm}",
    ".dpg .num{bottom:-12mm}",
    ".dpg.flip .num{top:-14mm;bottom:auto}",
    ".body{padding:15mm 18mm}",
    "p{font-size:10.5pt;line-height:1.85;color:#3d4653;font-weight:300;max-width:132mm}",
    "p+p{margin-top:4mm}",
    ".cov{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:22mm 18mm;color:var(--w)}",
    ".end{background:var(--n);color:var(--w)}",
    ".end p{color:rgba(247,244,239,.72);max-width:118mm}",
    "h1{font-family:Playfair Display,serif;font-weight:400;font-size:38pt;line-height:1.06;max-width:152mm}",
  ]) {
    ok(`unchanged: ${rule.slice(0, 44)}`, html.includes(rule));
  }
  // And the two rules that were asked to change, did.
  ok("the team block has more room", html.includes(".tm{padding:11mm 0;"));
  ok("the team subhead has more room", html.includes(".tm h4{font-family:Playfair Display,serif;font-weight:400;font-size:15pt;color:var(--n);margin-bottom:5mm}"));
  ok("the list items have more room", html.includes(".cols li{list-style:none;font-size:9.5pt;font-weight:300;line-height:1.8;color:#3d4653;padding:4mm 0;"));
}

console.log("\n=== House rules ===\n");
{
  const tour = (await storage.getTourBySlug(BROCHURE_TOUR_SLUGS[0]))!;
  const html = renderBrochureHtml(tour, []);
  ok("no em or en dash in the rendered HTML", !/[\u2013\u2014]/.test(html));
  ok("A4 page size with no margin", /@page\s*\{\s*size:\s*A4;\s*margin:\s*0\s*;?\s*\}/.test(html));
  ok("every page breaks after itself", /page-break-after:\s*always/.test(html));
  ok("fonts are embedded as data URIs, not linked", html.includes("data:font/woff2;base64,") && !html.includes("fonts.googleapis.com"));
  ok("a tour with no hotels simply omits the hotels page", !html.includes("WHERE YOU WILL STAY"));
}

await closeBrochureBrowser();
console.log(fails === 0 ? "\nAll brochure cases passed." : `\n${fails} failure(s)`);
process.exit(fails === 0 ? 0 : 1);
