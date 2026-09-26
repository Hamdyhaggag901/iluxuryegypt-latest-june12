// The brochure's HTML, rendered once per tour and printed by Puppeteer.
//
// The stylesheet below is the approved design, copied verbatim. Class names,
// millimetre paddings, point sizes, gradient stops and the negative offsets on
// the day numbers are all as approved; nothing here is a substitute of my own.
// The approved preview is a browser page and pulls its fonts from Google, which
// this must not do: setContent resolves on networkidle0 while an @font-face
// fetch can still be in flight, so a linked font prints a fallback face with no
// error. The faces stay inlined from ./fonts.ts.
//
// NO PRICES. Not the tour price, not a room rate, not a "from" figure. That is
// what keeps the PDF evergreen: a brochure with a number in it is wrong the
// moment a season changes, and the price conversation belongs in the reply to
// the email rather than in a file that gets forwarded.

import type { Hotel, ItineraryDay, Tour } from "@shared/schema";
import { SITE_URL } from "../seo-meta";
import { BROCHURE_FONT_CSS } from "./fonts";

/** Images the admin has not replaced yet. Rendering one gives a broken icon. */
const PENDING = "PENDING_UPLOAD";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * True when a value can actually be rendered as an image.
 *
 * PENDING_UPLOAD is a real value in this database rather than a hypothetical:
 * several hotels carry it, and an <img> pointing at it prints a broken icon
 * into a document that goes to a client.
 */
function usableImage(src: string | null | undefined): src is string {
  if (typeof src !== "string") return false;
  const trimmed = src.trim();
  return trimmed.length > 0 && trimmed !== PENDING;
}

/**
 * An <img>, or a flat navy panel carrying the place name.
 *
 * The fallback reads as a design choice rather than as a missing asset, which
 * means a brochure for a tour whose photography is half uploaded still goes
 * out. `cls` is applied either way so the panel occupies the same box the
 * image would have.
 */
function imageOrFallback(src: string | null | undefined, alt: string, label: string, cls = ""): string {
  const panel = `<div${cls ? ` class="${cls} fallback"` : ` class="fallback"`}><span>${escapeHtml(label)}</span></div>`;
  if (!usableImage(src)) return panel;
  const attr = cls ? ` class="${cls}"` : "";
  // onerror covers the case the static check cannot: a URL that is present and
  // well formed and does not load. PENDING_UPLOAD and empty are caught above,
  // but a deleted upload or an unreachable host is neither, and the difference
  // only shows up as a broken image in a document already sent to a client.
  // Puppeteer runs this before it prints, because networkidle0 waits for the
  // failed request to settle.
  return `<img${attr} src="${escapeHtml(absoluteAsset(src))}" alt="${escapeHtml(alt)}" onerror="brochureFallback(this)" data-fallback="${escapeHtml(label)}">`;
}

function list(items: string[] | null | undefined): string[] {
  return Array.isArray(items) ? items.filter((x) => typeof x === "string" && x.trim().length > 0) : [];
}

/**
 * An asset path made absolute against the site's own origin.
 *
 * Images in this database are stored as site relative paths, mostly under
 * /api/assets/uploads/. Puppeteer is given the page through setContent, whose
 * document has no base URL, so a relative src resolves against about:blank and
 * loads nothing: the brochure prints with no photographs at all and no error
 * anywhere to say why. An http(s) or data URL is already absolute and passes
 * through untouched.
 */
function assetOrigin(): string {
  // Defaults to the public site, which is what these paths are relative to.
  // The override exists because the render is a round trip out to that host
  // and back to the same box, once per image, and a proxy in front of the site
  // can rate limit or simply refuse a request the server makes to itself. Set
  // BROCHURE_ASSET_ORIGIN=http://127.0.0.1:5000 to keep it on the loopback.
  return (process.env.BROCHURE_ASSET_ORIGIN || SITE_URL).replace(/\/+$/, "");
}

function absoluteAsset(src: string): string {
  const trimmed = src.trim();
  if (/^(https?:)?\/\//i.test(trimmed) || /^data:/i.test(trimmed)) return trimmed;
  return `${assetOrigin()}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
}

/**
 * HTML entities, decoded.
 *
 * Needed because the prose fields hold rich text: stripping the tags out of
 * "Cairo &amp; Giza" without this leaves the reader looking at "&amp;".
 */
function decodeEntities(text: string): string {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&(#\d+|#x[0-9a-fA-F]+);/g, (_m, code: string) =>
      String.fromCodePoint(code[0] === "#" && (code[1] === "x" || code[1] === "X")
        ? parseInt(code.slice(2), 16)
        : parseInt(code.slice(1), 10))
    )
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&hellip;/g, "...")
    .replace(/&mdash;/g, "\u2014")
    .replace(/&ndash;/g, "\u2013")
    .replace(/&amp;/g, "&"); // last, so "&amp;lt;" does not become "<"
}

/**
 * A rich text field, as paragraphs of plain text.
 *
 * The tour and hotel descriptions and the itinerary day descriptions are all
 * rich text and hold real markup. Inserting them into this template escaped,
 * which is the only safe way to insert them, printed the markup at the reader:
 * literal <p>, <h3> and <a href="..."> in the middle of a sentence in a PDF
 * that had been emailed to a client.
 *
 * Block boundaries become paragraph breaks, because a field that is one line
 * of HTML has no blank lines to split on and would otherwise collapse into a
 * single wall of text. Anchor text survives as words and the href does not: a
 * link is of no use in a printed page, and the sentence it sits in is.
 */
function richTextParagraphs(value: string | null | undefined): string[] {
  return String(value || "")
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<\s*br\s*\/?>/gi, "\n\n")
    .replace(/<\/\s*(p|div|h[1-6]|li|tr|blockquote|section|article)\s*>/gi, "\n\n")
    .split(/\n{2,}|\r\n\r\n/)
    .map((chunk) =>
      decodeEntities(chunk.replace(/<[^>]*>/g, " "))
        .replace(/\s+/g, " ")
        // Tags become spaces, so an inline element closing before punctuation
        // leaves "the Nile ." behind. Real rich text does that constantly,
        // because a link is usually the last thing in its sentence.
        .replace(/\s+([,.;:!?%)\]])/g, "$1")
        .replace(/([(\[])\s+/g, "$1")
        .trim()
    )
    .filter(Boolean);
}

/** The same, flattened to one line, for a field rendered as a single block. */
function richText(value: string | null | undefined): string {
  return richTextParagraphs(value).join(" ");
}

function sentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+/).map((x) => x.trim()).filter((x) => x.length > 0);
}

/**
 * Takes one sentence OUT of the body to use as the pulled quote.
 *
 * Removing it is the whole point. Both the journey page and every day page
 * used to print a paragraph and then repeat one of its own sentences in the
 * quote rule directly underneath, which reads as a mistake rather than as an
 * emphasis. When there is no second sentence to spare there is no quote.
 */
function pullQuote(paras: string[]): { paras: string[]; quote: string } {
  // Prefer the third paragraph, which is where the approved layout puts the
  // rule, and fall back to the last paragraph that can spare a sentence.
  for (const index of [2, ...paras.map((_, i) => i).reverse()]) {
    const para = paras[index];
    if (!para) continue;
    const parts = sentences(para);
    if (parts.length < 2) continue;
    const quote = index === 2 ? parts[0] : parts[parts.length - 1];
    const kept = parts.filter((_, i) => i !== (index === 2 ? 0 : parts.length - 1)).join(" ");
    const next = [...paras];
    if (kept) next[index] = kept;
    else next.splice(index, 1);
    return { paras: next, quote };
  }
  return { paras, quote: "" };
}

// ---------------------------------------------------------------------------
// Fitting text-only pages
// ---------------------------------------------------------------------------
// The day pages breathe because the image band takes 116mm of the sheet. The
// text-only pages carry far more copy in the same box, so they are the ones
// that overset, and the answer is a second page rather than smaller type: the
// approved sizes are the design and shrinking them to make something fit is
// how a brochure starts looking like a form.
//
// The estimate below is deliberately conservative. It is the mechanism; the
// guarantee is the assertion in scripts/test-brochure.ts, which measures every
// page in real Chrome and fails if any content bottom passes the page box.

const MM_PER_PT = 25.4 / 72;

/** Usable height inside a .pad page: 297mm less its 24mm top and bottom. */
const PAD_CONTENT_MM = 297 - 24 - 24;
/** Content width inside a .pad page: 210mm less its 18mm side padding. */
const PAD_CONTENT_WIDTH_MM = 210 - 18 - 18;
/** Absorbs rounding and the difference between estimated and real leading. */
const SLACK_MM = 4;
/** The kicker and the h3's 8mm margin. The h3 itself is measured per heading. */
const PAGE_HEADER_CHROME_MM = 4.5 + 8;
/** h3 is 30pt/1.1 capped at 140mm by the approved stylesheet. */
const H3_WIDTH_MM = 140;

/**
 * Roughly how tall a run of text will be.
 *
 * Inter and Playfair both average a little under half their point size per
 * character; 0.54 is used rather than 0.5 so the estimate errs towards
 * breaking a page early, which costs a sheet, instead of late, which costs a
 * clipped line the reader never sees.
 */
function textHeightMm(text: string, fontPt: number, lineHeight: number, widthMm: number): number {
  const charMm = fontPt * 0.54 * MM_PER_PT;
  const perLine = Math.max(8, Math.floor(widthMm / charMm));
  const lines = Math.max(1, Math.ceil(text.length / perLine));
  return lines * fontPt * lineHeight * MM_PER_PT;
}

/**
 * The height of a page's heading block, measured from the heading itself.
 *
 * Not a constant, because the h3 wraps: "What is carried for you, and what is
 * not, continued." runs to a second line where the first page's heading fits
 * on one, and assuming one line is what let the second inclusions page run
 * 3.6mm past the sheet. Callers pass the LONGEST heading the section can
 * produce, which is always the continued form, so every page in a section is
 * budgeted for the worst case.
 */
function pageHeaderMm(heading: string): number {
  return PAGE_HEADER_CHROME_MM + textHeightMm(heading, 30, 1.1, H3_WIDTH_MM);
}

/**
 * Splits items across pages, filling each to `capacityMm`.
 *
 * An item taller than a whole page still goes on its own page rather than
 * being dropped: losing content silently is worse than one overfull sheet,
 * and the Chrome assertion will catch it if it ever happens.
 */
function paginate<T>(items: T[], heightOf: (item: T) => number, capacityMm: number): T[][] {
  const pages: T[][] = [];
  let current: T[] = [];
  let used = 0;
  for (const item of items) {
    const h = heightOf(item);
    if (current.length > 0 && used + h > capacityMm) {
      pages.push(current);
      current = [];
      used = 0;
    }
    current.push(item);
    used += h;
  }
  if (current.length > 0) pages.push(current);
  return pages.length > 0 ? pages : [[]];
}

/** "Title" on the first page, "Title, continued." on the rest. */
function continuedHeading(base: string, index: number): string {
  if (index === 0) return base;
  return `${base.replace(/\.\s*$/, "")}, continued.`;
}

/** Two digits, zero padded, as the design specifies for the day numbers. */
function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/**
 * The broad place a site belongs to.
 *
 * The route page wants Giza rather than "Great Pyramid of Giza", because a
 * timeline of individual sites is an itinerary repeated rather than a route.
 * Anything not in this list passes through unchanged, so an unfamiliar place
 * name is printed as the admin typed it rather than dropped.
 */
const SITE_REGIONS: Array<[RegExp, string]> = [
  [/\b(giza|sphinx|great pyramid|khufu|mena house)\b/i, "Giza"],
  [/\b(saqqara|sakkara|dahshur|memphis|step pyramid|bent pyramid|red pyramid)\b/i, "Saqqara"],
  [/\b(karnak|luxor temple|valley of the kings|valley of the queens|hatshepsut|deir el|medinet habu|colossi of memnon|theban|thebes|west bank)\b/i, "Luxor"],
  [/\b(philae|elephantine|high dam|unfinished obelisk|nubian|kitchener)\b/i, "Aswan"],
  [/\b(abu simbel)\b/i, "Abu Simbel"],
  [/\b(egyptian museum|grand egyptian museum|khan el khalili|khan al khalili|islamic cairo|coptic cairo|citadel|old cairo)\b/i, "Cairo"],
  [/\b(edfu|horus temple)\b/i, "Edfu"],
  [/\b(kom ombo)\b/i, "Kom Ombo"],
  [/\b(bibliotheca|qaitbay|montazah)\b/i, "Alexandria"],
  [/\b(wadi el hitan|wadi al hitan|wadi rayan|qarun)\b/i, "Fayoum"],
];

function broadPlace(place: string): string {
  const trimmed = place.trim();
  for (const [pattern, region] of SITE_REGIONS) {
    if (pattern.test(trimmed)) return region;
  }
  return trimmed;
}

/**
 * The itinerary's places in order, mapped to their broad region, with
 * consecutive repeats collapsed.
 *
 * Collapsing is what makes a tour that starts and ends in Cairo show Cairo once
 * at each end rather than four times in a row across the first two days and the
 * last. Non-consecutive repeats are kept, because returning to a city is a real
 * leg of the route.
 */
function routeStops(days: ItineraryDay[]): string[] {
  const stops: string[] = [];
  for (const day of days) {
    const place = broadPlace(String(day.placeName || ""));
    if (!place) continue;
    if (stops[stops.length - 1] !== place) stops.push(place);
  }
  return stops;
}

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------

/**
 * The bottom-of-page line. The cover and the closing page do not carry one,
 * which is why this is called per page rather than appended to every page.
 */
function folio(section: string, pageNumber: number): string {
  return `<div class="fol"><span>ILUXURY EGYPT</span><span>${escapeHtml(section.toUpperCase())}</span><span>${pad2(pageNumber)}</span></div>`;
}

function coverPage(tour: Tour, days: ItineraryDay[]): string {
  const hero = imageOrFallback(tour.heroImage, tour.heroImageAlt?.trim() || tour.title, tour.title, "bleed");

  // Built from what the row actually holds. A part the database does not have
  // is left out rather than invented, which is why this is a filter and not a
  // template string with fallbacks in it.
  const places = routeStops(days);
  const parts = [
    String(tour.duration || "").trim().toUpperCase(),
    places.length > 0 ? places.map((p) => escapeHtml(p.toUpperCase())).join(" &nbsp;") : "",
    String(tour.groupSize || "").trim().toUpperCase(),
  ].filter((p) => p.length > 0);

  return `<div class="pg">
  ${hero}
  <div class="veil"></div>
  <div class="cov">
    <div class="mark">ILUXURY EGYPT</div>
    <div>
      <div class="rule"></div>
      <h1>${escapeHtml(tour.title)}</h1>
      ${parts.length > 0 ? `<div class="meta">${parts.join(" &nbsp;&nbsp; ")}</div>` : ""}
    </div>
  </div>
</div>`;
}

function journeyPages(tour: Tour, firstPageNumber: number): string[] {
  // The description is rich text. Stripped to plain paragraphs before it is
  // escaped, or the markup itself prints on the page.
  const { paras, quote } = pullQuote(richTextParagraphs(tour.description));

  // The quote rule sits after the second paragraph, which is where the
  // approved layout puts it. It is treated as a block of its own here so the
  // page break can fall either side of it rather than through it.
  type Block = { html: string; height: number };
  const blocks: Block[] = [];
  paras.forEach((text, i) => {
    blocks.push({
      html: `<p${i === 0 ? ' class="first"' : ""}>${escapeHtml(text)}</p>`,
      // p is 10.5pt/1.85 capped at 132mm, plus the 4mm p+p margin.
      height: textHeightMm(text, 10.5, 1.85, 132) + (i === 0 ? 0 : 4),
    });
    if (i === 1 && quote) {
      blocks.push({
        html: `<div class="quote">${escapeHtml(quote)}</div>`,
        // 14pt/1.5 at 125mm, plus its 9mm margins top and bottom.
        height: textHeightMm(quote, 14, 1.5, 125) + 18,
      });
    }
  });
  if (quote && paras.length < 2) {
    blocks.push({
      html: `<div class="quote">${escapeHtml(quote)}</div>`,
      height: textHeightMm(quote, 14, 1.5, 125) + 18,
    });
  }

  // Budgeted against the continued heading, which is the taller of the two.
  const capacity = PAD_CONTENT_MM - pageHeaderMm(continuedHeading(`${tour.title}.`, 1)) - SLACK_MM;
  return paginate(blocks, (b) => b.height, capacity).map(
    (page, index) => `<div class="pg">
  <div class="pad">
    <div class="kick">The journey</div>
    <h3>${escapeHtml(continuedHeading(`${tour.title}.`, index))}</h3>
    ${page.map((b) => b.html).join("\n    ")}
  </div>
  ${folio("The journey", firstPageNumber + index)}
</div>`
  );
}

/**
 * One page per itinerary day, strictly alternating.
 *
 * Odd days are `dpg`: the image band on top, text below, the number hanging off
 * the bottom edge of the image. Even days are `dpg flip`: the body div comes
 * FIRST in the markup, the image second, and the number hangs off the top. The
 * alternation is driven by the index so it holds for a four day tour and a
 * twelve day one alike.
 */
function dayPage(day: ItineraryDay, index: number, pageNumber: number): string {
  const flipped = index % 2 === 1;
  const dayNumber = typeof day.day === "number" && Number.isFinite(day.day) ? day.day : index + 1;
  const place = String(day.placeName || "").trim();
  const title = String(day.title || "").trim();
  // Rich text here too, and the same reason: a day description holding <p> or
  // an <a href> printed the tags at the reader.
  const { paras, quote: pulled } = pullQuote(richTextParagraphs(day.description));
  const description = paras.join(" ");
  const photo = imageOrFallback(day.image, String(day.imageAlt || "").trim() || title || place, place || title || `Day ${dayNumber}`);

  const img = `<div class="dimg">${photo}<div class="num">${pad2(dayNumber)}</div></div>`;
  const body = `<div class="body">
      ${place ? `<div class="kick">${escapeHtml(place)}</div>` : ""}
      ${title ? `<h2>${escapeHtml(title)}</h2>` : ""}
      ${description ? `<p class="first">${escapeHtml(description)}</p>` : ""}
      ${pulled ? `<div class="quote">${escapeHtml(pulled)}</div>` : ""}
    </div>`;

  return `<div class="pg">
  <div class="dpg${flipped ? " flip" : ""}">
    ${flipped ? `${body}\n    ${img}` : `${img}\n    ${body}`}
  </div>
  ${folio(`Day ${dayNumber}`, pageNumber)}
</div>`;
}

/**
 * Two hotels a page, each with an 88mm full height image beside its text.
 *
 * A tour with an odd number leaves the lower half of its last page empty, which
 * is the approved behaviour: the grid keeps both rows at 1fr so a single .hrow
 * occupies the top half at its proper size rather than stretching to fill the
 * sheet.
 */
function hotelPages(hotels: Hotel[], firstPageNumber: number): string[] {
  const pages: string[] = [];
  for (let i = 0; i < hotels.length; i += 2) {
    const pair = hotels.slice(i, i + 2);
    const rows = pair
      .map(
        (h) => `    <div class="hrow">
      ${imageOrFallback(h.image, h.imageAlt?.trim() || h.name, h.location || h.name)}
      <div class="hinfo">
        ${h.location ? `<div class="city">${escapeHtml(h.location)}</div>` : ""}
        <h5>${escapeHtml(h.name)}</h5>
        <p>${escapeHtml(richText(h.description))}</p>
      </div>
    </div>`
      )
      .join("\n");

    // The page needs a heading of its own: it followed the itinerary with
    // nothing but photographs, and the only label on it was the folio.
    // Continued rather than a bare repeat on a second page, so a reader
    // landing on it knows it is the same section rather than a new one.
    const heading = pages.length === 0 ? "Where the nights are spent." : "Where the nights are spent, continued.";
    pages.push(`<div class="pg">
  <div class="hot">
    <div class="hothead">
      <div class="kick">The detail</div>
      <h3>${escapeHtml(heading)}</h3>
    </div>
${rows}
  </div>
  ${folio("Where you will stay", firstPageNumber + pages.length)}
</div>`);
  }
  return pages;
}

function routePage(days: ItineraryDay[], pageNumber: number): string {
  const stops = routeStops(days);
  if (stops.length === 0) return "";

  // A long route tightens its own spacing rather than spilling onto a second
  // page. 13mm per stop is the approved padding and fits about twelve; past
  // that the padding closes up so the timeline stays one page.
  const tight = stops.length > 12;
  const override = tight
    ? `<style>.stop{padding-bottom:${stops.length > 18 ? "5mm" : "8mm"}}.stop b{font-size:13pt}</style>`
    : "";

  return `<div class="pg">
  ${override}
  <div class="pad">
    <div class="kick">The detail</div>
    <h3>The route.</h3>
    <div class="route">
      ${stops
        .map((s, i) => `<div class="stop"><b>${escapeHtml(s)}</b><span>STOP ${i + 1}</span></div>`)
        .join("\n      ")}
    </div>
  </div>
  ${folio("Route", pageNumber)}
</div>`;
}

/**
 * The roles, not the people.
 *
 * No names, no photographs, no licence numbers, no years of experience and no
 * phone number: none of that is in the database and a brochure is the wrong
 * place to invent it. Every sentence here is true of how this operator works.
 */
function teamPages(firstPageNumber: number): string[] {
  const blocks: Array<[string, string]> = [
    [
      "Your Egyptologist",
      "A licensed guide who stays with you for the whole journey rather than a different face at every site. They are chosen for the places on your particular route, because the person who is good at Saqqara is not always the person who is good at Karnak.",
    ],
    [
      "Your concierge in Cairo",
      "One planner writes your itinerary and stays with it from the first email to the morning you fly home. Nothing is handed to a call centre, and you are never asked to explain your trip to somebody who has not read it.",
    ],
    [
      "Reachable at any hour",
      "A flight moves, a site closes, somebody wakes up unwell, and the plan has to change before breakfast. Write to travel@iluxuryegypt.com at any hour and the answer comes from the office in Cairo that built the itinerary.",
    ],
  ];

  // 11mm of padding above and below, the 15pt subhead, its 5mm margin, and the
  // paragraph at 10.5pt/1.85 capped at 132mm.
  const height = ([head, body]: [string, string]) =>
    22 + textHeightMm(head, 15, 1.2, 132) + 5 + textHeightMm(body, 10.5, 1.85, 132);

  const capacity = PAD_CONTENT_MM - pageHeaderMm(continuedHeading("Your team on the ground.", 1)) - SLACK_MM;
  return paginate(blocks, height, capacity).map(
    (page, index) => `<div class="pg">
  <div class="pad">
    <div class="kick">The detail</div>
    <h3>${escapeHtml(continuedHeading("Your team on the ground.", index))}</h3>
    ${page
      .map(([head, body]) => `<div class="tm">
      <h4>${escapeHtml(head)}</h4>
      <p>${escapeHtml(body)}</p>
    </div>`)
      .join("\n    ")}
  </div>
  ${folio("Your team", firstPageNumber + index)}
</div>`
  );
}

function inclusionsPages(tour: Tour, firstPageNumber: number): string[] {
  const includes = list(tour.includes);
  const excludes = list(tour.excludes);

  // Each column paginates on its own and the page is as tall as the taller of
  // the two, so a page whose columns each fit the capacity fits the sheet.
  // Column width is the 174mm content box less the 14mm gap, halved.
  const columnWidth = (PAD_CONTENT_WIDTH_MM - 14) / 2;
  // 9.5pt/1.8 plus 4mm of padding top and bottom and the hairline rule.
  const itemHeight = (text: string) => textHeightMm(text, 9.5, 1.8, columnWidth) + 8.4;
  // The h4, its 3mm padding, its rule and its 5mm margin: 13.55mm measured.
  const COLUMN_HEAD_MM = 13.6;
  const capacity =
    PAD_CONTENT_MM
    - pageHeaderMm(continuedHeading("What is carried for you, and what is not.", 1))
    - 4 // .cols margin-top
    - COLUMN_HEAD_MM
    - SLACK_MM;

  const incPages = paginate(includes, itemHeight, capacity);
  const excPages = paginate(excludes, itemHeight, capacity);
  const pageCount = Math.max(incPages.length, excPages.length);

  const items = (rows: string[] | undefined, empty: string) =>
    rows && rows.length > 0
      ? `<ul>${rows.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>`
      : `<ul><li>${empty}</li></ul>`;

  return Array.from({ length: pageCount }, (_, index) => `<div class="pg">
  <div class="pad">
    <div class="kick">The detail</div>
    <h3>${escapeHtml(continuedHeading("What is carried for you, and what is not.", index))}</h3>
    <div class="cols">
      <div><h4>Included</h4>${items(incPages[index], index === 0 ? "Confirmed with your final itinerary." : "Continued opposite.")}</div>
      <div class="ex"><h4>Not included</h4>${items(excPages[index], index === 0 ? "Confirmed with your final itinerary." : "Continued opposite.")}</div>
    </div>
  </div>
  ${folio("Inclusions", firstPageNumber + index)}
</div>`);
}

function closingPage(): string {
  return `<div class="pg end">
  <div class="pad">
    <div class="mark">ILUXURY EGYPT</div>
    <div class="rule"></div>
    <h3>When you are ready, we will build it around your dates.</h3>
    <p>These pages are a starting point rather than a fixed departure, and the shape of a journey changes with who is travelling and when. Write to us with your dates and we will send the version built around them, with the rooms held and the order of the days set against the season you are coming in.</p>
    <div class="sig">TRAVEL@ILUXURYEGYPT.COM<br>ILUXURYEGYPT.COM<br>CAIRO, EGYPT</div>
  </div>
</div>`;
}

// ---------------------------------------------------------------------------

/** The approved stylesheet, verbatim, plus print and fallback rules. */
function styles(): string {
  return `${BROCHURE_FONT_CSS}
:root{--g:#C4A661;--n:#26303F;--w:#F7F4EF}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Inter,sans-serif}
.pg{width:210mm;height:297mm;background:var(--w);position:relative;overflow:hidden}
.bleed{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.veil{position:absolute;inset:0;background:linear-gradient(180deg,rgba(38,48,63,.5),rgba(38,48,63,.12) 42%,rgba(38,48,63,.82))}
.cov{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:22mm 18mm;color:var(--w)}
.mark{font-family:Playfair Display,serif;font-size:15pt;letter-spacing:.42em;color:var(--g)}
.rule{width:14mm;height:1px;background:var(--g);margin:6mm 0}
h1{font-family:Playfair Display,serif;font-weight:400;font-size:38pt;line-height:1.06;max-width:152mm}
.meta{font-size:9pt;font-weight:300;letter-spacing:.2em;margin-top:7mm;opacity:.85}
.pad{padding:24mm 18mm}
.kick{font-family:Playfair Display,serif;font-style:italic;font-size:11pt;color:var(--g)}
h2{font-family:Playfair Display,serif;font-weight:400;font-size:23pt;color:var(--n);line-height:1.18;margin:3mm 0 6mm;max-width:140mm}
h3{font-family:Playfair Display,serif;font-weight:400;font-size:30pt;color:var(--n);line-height:1.1;margin-bottom:8mm}
p{font-size:10.5pt;line-height:1.85;color:#3d4653;font-weight:300;max-width:132mm}
p+p{margin-top:4mm}
p.first::first-letter{font-family:Playfair Display,serif;float:left;font-size:34pt;line-height:.82;padding:2mm 3mm 0 0;color:var(--g)}
.quote{margin:9mm 0;padding-left:7mm;border-left:1px solid var(--g);font-family:Playfair Display,serif;font-style:italic;font-size:14pt;line-height:1.5;color:var(--n);max-width:125mm}
.dpg{position:absolute;inset:0;display:grid;grid-template-rows:116mm 1fr}
.dpg.flip{grid-template-rows:1fr 116mm}
.dimg{position:relative;overflow:hidden}
.dimg img{width:100%;height:100%;object-fit:cover}
.num{position:absolute;right:12mm;font-family:Playfair Display,serif;font-size:76pt;color:var(--w);line-height:1}
.dpg .num{bottom:-12mm}
.dpg.flip .num{top:-14mm;bottom:auto}
.body{padding:15mm 18mm}
.fol{position:absolute;bottom:10mm;left:18mm;right:18mm;display:flex;justify-content:space-between;font-size:7.5pt;letter-spacing:.22em;color:#9aa2ad}
.cols{display:grid;grid-template-columns:1fr 1fr;gap:14mm;margin-top:4mm}
.cols h4{font-family:Playfair Display,serif;font-weight:400;font-size:13pt;color:var(--n);padding-bottom:3mm;border-bottom:1px solid var(--g);margin-bottom:5mm}
.cols li{list-style:none;font-size:9.5pt;font-weight:300;line-height:1.8;color:#3d4653;padding:4mm 0;border-bottom:1px solid rgba(38,48,63,.08)}
.cols .ex li{color:#8d95a1}
.end{background:var(--n);color:var(--w)}
.end .pad{display:flex;flex-direction:column;justify-content:center;height:100%}
.end h3{color:var(--w)}
.end p{color:rgba(247,244,239,.72);max-width:118mm}
.sig{margin-top:14mm;font-size:9pt;letter-spacing:.2em;color:var(--g);line-height:2.2}
.hot{position:absolute;inset:0;display:grid;grid-template-rows:auto 1fr 1fr}
.hothead{padding:24mm 18mm 0}
.hothead h3{margin-bottom:6mm}
.hrow{display:grid;grid-template-columns:88mm 1fr;align-items:stretch;overflow:hidden}
.hrow img{width:100%;height:100%;object-fit:cover}
.hinfo{padding:14mm 16mm}
.hinfo .city{font-family:Playfair Display,serif;font-style:italic;font-size:10.5pt;color:var(--g)}
.hinfo h5{font-family:Playfair Display,serif;font-weight:400;font-size:17pt;color:var(--n);margin:2mm 0 4mm;line-height:1.2}
.hinfo p{font-size:9.5pt;line-height:1.75}
.route{margin-top:12mm;position:relative;padding-left:9mm}
.route:before{content:"";position:absolute;left:2.4mm;top:4mm;bottom:8mm;width:1px;background:var(--g)}
.stop{position:relative;padding:0 0 13mm 0}
.stop:before{content:"";position:absolute;left:-9mm;top:3.2mm;width:5mm;height:5mm;border-radius:50%;background:var(--g)}
.stop b{font-family:Playfair Display,serif;font-weight:400;font-size:15pt;color:var(--n);display:block}
.stop span{font-size:9pt;font-weight:300;letter-spacing:.18em;color:#8d95a1}
.tm{padding:11mm 0;border-bottom:1px solid rgba(38,48,63,.08)}
.tm h4{font-family:Playfair Display,serif;font-weight:400;font-size:15pt;color:var(--n);margin-bottom:5mm}

/* On a flipped day page the image band occupies the bottom 116mm, so the folio
   at bottom:10mm prints over the photograph and #9aa2ad is not legible on it.
   The folio stays exactly where the approved design puts it and goes cream on
   those pages only. :has() rather than a class on the page div, so this stays a
   stylesheet rule and the markup is untouched; Chrome has supported it since
   105 and Puppeteer here is on 146. */
.pg:has(.dpg.flip) .fol{color:rgba(247,244,239,.75)}

/* Print, and the navy panel that stands in for a missing photograph. Neither
   is in the approved stylesheet because the approved preview is a browser page
   that is scrolled rather than printed, and its images all exist. */
@page{size:A4;margin:0}
html,body{width:210mm}
body{-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pg{page-break-after:always;break-after:page}
.pg:last-child{page-break-after:auto;break-after:auto}
.fallback{background:var(--n);display:flex;align-items:center;justify-content:center;text-align:center;padding:10mm;width:100%;height:100%}
.bleed.fallback{position:absolute;inset:0}
.fallback span{font-family:Playfair Display,serif;font-size:17pt;line-height:1.3;color:var(--w);max-width:100%}`;
}

/**
 * The whole brochure for one tour.
 *
 * Page numbers are computed from the real page count rather than hardcoded: a
 * four day tour and a twelve day one put the hotels, route, team and inclusions
 * pages in different places, and a folio that disagrees with the sheet it sits
 * on is worse than no folio at all. The cover and the closing page carry none.
 */
export function renderBrochureHtml(tour: Tour, hotels: Hotel[]): string {
  const days: ItineraryDay[] = Array.isArray(tour.itinerary) ? (tour.itinerary as ItineraryDay[]) : [];

  const pages: string[] = [];
  // The cover is page 1 and carries no folio, so the next page's number is 2.
  let n = 1;
  pages.push(coverPage(tour, days));

  // Every section after the cover can run to more than one sheet, so each
  // returns a list and the folio counter advances by however many it gave
  // back. Hardcoding the count here is what made the numbers disagree with
  // the sheets they sat on the first time this was built.
  const add = (html: string[]) => {
    n += html.length;
    pages.push(...html);
  };

  add(journeyPages(tour, n + 1));
  // forEach rather than for..of over .entries(), which this tsconfig's
  // target rejects without downlevelIteration.
  days.forEach((day, i) => pages.push(dayPage(day, i, ++n)));

  if (hotels.length > 0) add(hotelPages(hotels, n + 1));

  const route = routePage(days, n + 1);
  if (route) {
    n += 1;
    pages.push(route);
  }

  add(teamPages(n + 1));
  add(inclusionsPages(tour, n + 1));
  pages.push(closingPage());

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${escapeHtml(tour.title)} | iLuxury Egypt</title>
<style>${styles()}</style>
<script>
// Swaps an image that failed to load for the same navy panel a missing one
// gets. Defined before the body so it exists by the time the first error
// fires. Keeps the element's classes, so the panel sits in the box the
// photograph would have occupied.
function brochureFallback(img) {
  var panel = document.createElement("div");
  panel.className = (img.className ? img.className + " " : "") + "fallback";
  var label = document.createElement("span");
  label.textContent = img.getAttribute("data-fallback") || "";
  panel.appendChild(label);
  img.replaceWith(panel);
}
</script>
</head>
<body>
${pages.join("\n")}
</body>
</html>`;
}
