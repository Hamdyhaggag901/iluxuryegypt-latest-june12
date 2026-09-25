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
  return `<img${attr} src="${escapeHtml(src.trim())}" alt="${escapeHtml(alt)}" onerror="brochureFallback(this)" data-fallback="${escapeHtml(label)}">`;
}

function list(items: string[] | null | undefined): string[] {
  return Array.isArray(items) ? items.filter((x) => typeof x === "string" && x.trim().length > 0) : [];
}

function paragraphs(text: string | null | undefined): string[] {
  return String(text || "")
    .split(/\n{2,}|\r\n\r\n/)
    .map((p) => p.trim())
    .filter(Boolean);
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

function journeyPage(tour: Tour, pageNumber: number): string {
  const body = paragraphs(tour.description);
  const opening = body[0] ?? String(tour.description || "").trim();
  const rest = body.slice(1);

  // The pulled line is the second paragraph's own first sentence, so the quote
  // is the tour's words rather than a line written about it here.
  const quoteSource = rest[0] ?? opening;
  const pulled = (quoteSource.split(/(?<=[.!?])\s+/)[0] ?? quoteSource).trim();
  const closing = rest.slice(1);

  return `<div class="pg">
  <div class="pad">
    <div class="kick">The journey</div>
    <h3>${escapeHtml(tour.title)}</h3>
    <p class="first">${escapeHtml(opening)}</p>
    ${rest.length > 0 ? `<p>${escapeHtml(rest[0])}</p>` : ""}
    ${pulled ? `<div class="quote">${escapeHtml(pulled)}</div>` : ""}
    ${closing.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n    ")}
  </div>
  ${folio("The journey", pageNumber)}
</div>`;
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
  const description = String(day.description || "").trim();
  const photo = imageOrFallback(day.image, String(day.imageAlt || "").trim() || title || place, place || title);

  // The pulled line is the paragraph's last sentence when there is more than
  // one, so the quote is not the sentence the reader has just read at the top
  // of the same block.
  const sentences = description.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 0);
  const pulled = sentences.length > 1 ? sentences[sentences.length - 1].trim() : "";

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
        <p>${escapeHtml(String(h.description || "").trim())}</p>
      </div>
    </div>`
      )
      .join("\n");

    pages.push(`<div class="pg">
  <div class="hot">
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
function teamPage(pageNumber: number): string {
  return `<div class="pg">
  <div class="pad">
    <div class="kick">The detail</div>
    <h3>Your team on the ground.</h3>
    <div class="tm">
      <h4>Your Egyptologist</h4>
      <p>A licensed guide who stays with you for the whole journey rather than a different face at every site. They are chosen for the places on your particular route, because the person who is good at Saqqara is not always the person who is good at Karnak.</p>
    </div>
    <div class="tm">
      <h4>Your concierge in Cairo</h4>
      <p>One planner writes your itinerary and stays with it from the first email to the morning you fly home. Nothing is handed to a call centre, and you are never asked to explain your trip to somebody who has not read it.</p>
    </div>
    <div class="tm">
      <h4>Reachable at any hour</h4>
      <p>A flight moves, a site closes, somebody wakes up unwell, and the plan has to change before breakfast. Write to travel@iluxuryegypt.com at any hour and the answer comes from the office in Cairo that built the itinerary.</p>
    </div>
  </div>
  ${folio("Your team", pageNumber)}
</div>`;
}

function inclusionsPage(tour: Tour, pageNumber: number): string {
  const includes = list(tour.includes);
  const excludes = list(tour.excludes);
  const items = (rows: string[]) =>
    rows.length > 0
      ? `<ul>${rows.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>`
      : `<ul><li>Confirmed with your final itinerary.</li></ul>`;

  return `<div class="pg">
  <div class="pad">
    <div class="kick">The detail</div>
    <h3>What is carried for you, and what is not.</h3>
    <div class="cols">
      <div><h4>Included</h4>${items(includes)}</div>
      <div class="ex"><h4>Not included</h4>${items(excludes)}</div>
    </div>
  </div>
  ${folio("Inclusions", pageNumber)}
</div>`;
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
.cols li{list-style:none;font-size:9.5pt;font-weight:300;line-height:1.6;color:#3d4653;padding:2.6mm 0;border-bottom:1px solid rgba(38,48,63,.08)}
.cols .ex li{color:#8d95a1}
.end{background:var(--n);color:var(--w)}
.end .pad{display:flex;flex-direction:column;justify-content:center;height:100%}
.end h3{color:var(--w)}
.end p{color:rgba(247,244,239,.72);max-width:118mm}
.sig{margin-top:14mm;font-size:9pt;letter-spacing:.2em;color:var(--g);line-height:2.2}
.hot{position:absolute;inset:0;display:grid;grid-template-rows:1fr 1fr}
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
.tm{padding:7mm 0;border-bottom:1px solid rgba(38,48,63,.08)}
.tm h4{font-family:Playfair Display,serif;font-weight:400;font-size:15pt;color:var(--n);margin-bottom:3mm}

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

  pages.push(journeyPage(tour, ++n));
  // forEach rather than for..of over .entries(), which this tsconfig's
  // target rejects without downlevelIteration.
  days.forEach((day, i) => pages.push(dayPage(day, i, ++n)));

  if (hotels.length > 0) {
    const hotelHtml = hotelPages(hotels, n + 1);
    n += hotelHtml.length;
    pages.push(...hotelHtml);
  }

  const route = routePage(days, n + 1);
  if (route) {
    n += 1;
    pages.push(route);
  }

  pages.push(teamPage(++n));
  pages.push(inclusionsPage(tour, ++n));
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
