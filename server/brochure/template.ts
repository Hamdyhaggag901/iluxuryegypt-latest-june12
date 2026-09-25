// The brochure's HTML, rendered once per tour and printed by Puppeteer.
//
// Everything here is print CSS. @page sets A4 with no margin and each page div
// carries page-break-after, so one div is exactly one sheet. Nothing may rely
// on a network fetch at print time: the fonts are inlined from
// ./fonts.ts and images are the only remote resource, which is why
// generate.ts waits on networkidle0 before printing.
//
// NO PRICES. Not the tour price, not a room rate, not a "from" figure. That is
// deliberate and it is what keeps the PDF evergreen: a brochure with a number
// in it is wrong the moment a season changes, and the price conversation
// belongs in the reply to the email rather than in a file that gets forwarded.

import type { Hotel, ItineraryDay, Tour } from "@shared/schema";
import { BROCHURE_FONT_CSS } from "./fonts";

const GOLD = "#C4A661";
const NAVY = "#26303F";
const OFF_WHITE = "#F7F4EF";

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
 * into a document that goes to a client. Everything that fails this test gets
 * the navy block instead.
 */
function usableImage(src: string | null | undefined): src is string {
  if (typeof src !== "string") return false;
  const trimmed = src.trim();
  return trimmed.length > 0 && trimmed !== PENDING;
}

/**
 * An image, or a flat navy panel carrying the place name in Playfair.
 *
 * The fallback is deliberately not a grey box or a placeholder graphic. It
 * reads as a design choice rather than as a missing asset, which means a
 * brochure for a tour whose photography is half uploaded still goes out.
 */
function imageOrFallback(src: string | null | undefined, alt: string, label: string, extraClass = ""): string {
  if (usableImage(src)) {
    return `<img class="photo ${extraClass}" src="${escapeHtml(src.trim())}" alt="${escapeHtml(alt)}">`;
  }
  return `<div class="photo photo-fallback ${extraClass}"><span>${escapeHtml(label)}</span></div>`;
}

function dayLabel(day: ItineraryDay, index: number): string {
  const n = typeof day.day === "number" && Number.isFinite(day.day) ? day.day : index + 1;
  return `Day ${n}`;
}

function list(items: string[] | null | undefined): string[] {
  return Array.isArray(items) ? items.filter((x) => typeof x === "string" && x.trim().length > 0) : [];
}

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------

function coverPage(tour: Tour): string {
  const hero = imageOrFallback(tour.heroImage, tour.heroImageAlt?.trim() || tour.title, tour.title, "cover-photo");
  return `
<div class="page cover">
  ${hero}
  <div class="cover-veil"></div>
  <div class="cover-body">
    <p class="wordmark">iLuxury Egypt</p>
    <div class="rule"></div>
    <p class="eyebrow">${escapeHtml(tour.duration)}</p>
    <h1>${escapeHtml(tour.title)}</h1>
    <p class="cover-foot">A private journey, planned in full</p>
  </div>
</div>`;
}

function introPage(tour: Tour, dayCount: number): string {
  const paragraphs = String(tour.description || "")
    .split(/\n{2,}|\r\n\r\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .slice(0, 4);
  const body = paragraphs.length > 0 ? paragraphs : [String(tour.description || "").trim()].filter(Boolean);

  return `
<div class="page pad">
  <p class="section-eyebrow">The journey</p>
  <h2>${escapeHtml(tour.title)}</h2>
  <div class="rule left"></div>
  <div class="intro-grid">
    <div class="intro-copy">
      ${body.map((p) => `<p>${escapeHtml(p)}</p>`).join("")}
    </div>
    <div class="intro-facts">
      <div class="fact"><span class="fact-label">Duration</span><span class="fact-value">${escapeHtml(tour.duration)}</span></div>
      <div class="fact"><span class="fact-label">Days planned</span><span class="fact-value">${dayCount}</span></div>
      ${tour.groupSize ? `<div class="fact"><span class="fact-label">Group size</span><span class="fact-value">${escapeHtml(tour.groupSize)}</span></div>` : ""}
      ${tour.category ? `<div class="fact"><span class="fact-label">Style</span><span class="fact-value">${escapeHtml(tour.category)}</span></div>` : ""}
    </div>
  </div>
</div>`;
}

/**
 * One page per itinerary day, flipping the photo from left to right on each
 * one. The flip is driven by the index rather than written into the markup, so
 * the alternation holds for a four day tour and a fourteen day tour alike.
 */
function dayPage(day: ItineraryDay, index: number): string {
  const flipped = index % 2 === 1;
  const title = String(day.title || "").trim();
  const place = String(day.placeName || "").trim();
  const label = dayLabel(day, index);
  const photo = imageOrFallback(day.image, String(day.imageAlt || "").trim() || title || label, place || title || label);
  const activities = list(day.activities);
  const meals = list(day.meals);
  const accommodation = String(day.accommodation || "").trim();
  const description = String(day.description || "").trim();

  return `
<div class="page day ${flipped ? "flip" : ""}">
  <div class="day-photo">${photo}</div>
  <div class="day-copy">
    <p class="day-number">${escapeHtml(label)}</p>
    ${place ? `<p class="day-place">${escapeHtml(place)}</p>` : ""}
    ${title ? `<h3>${escapeHtml(title)}</h3>` : ""}
    <div class="rule left short"></div>
    ${description ? `<p class="day-lede">${escapeHtml(description)}</p>` : ""}
    ${
      activities.length > 0
        ? `<ul class="ticks">${activities.map((a) => `<li>${escapeHtml(a)}</li>`).join("")}</ul>`
        : ""
    }
    <div class="day-foot">
      ${
        // A day with no accommodation is the last day, and an empty "Stay"
        // line on it reads as a missing value rather than as a departure.
        accommodation ? `<div class="foot-item"><span class="foot-label">Stay</span><span>${escapeHtml(accommodation)}</span></div>` : ""
      }
      ${meals.length > 0 ? `<div class="foot-item"><span class="foot-label">Meals</span><span>${escapeHtml(meals.join(", "))}</span></div>` : ""}
    </div>
  </div>
</div>`;
}

function inclusionsPage(tour: Tour): string {
  const includes = list(tour.includes);
  const excludes = list(tour.excludes);
  return `
<div class="page pad">
  <p class="section-eyebrow">What is covered</p>
  <h2>Included, and not included</h2>
  <div class="rule left"></div>
  <div class="two-col">
    <div>
      <h4 class="col-head">Included</h4>
      ${
        includes.length > 0
          ? `<ul class="ticks">${includes.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>`
          : `<p class="muted">Confirmed with your final itinerary.</p>`
      }
    </div>
    <div>
      <h4 class="col-head">Not included</h4>
      ${
        excludes.length > 0
          ? `<ul class="crosses">${excludes.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>`
          : `<p class="muted">Confirmed with your final itinerary.</p>`
      }
    </div>
  </div>
</div>`;
}

function hotelsPage(hotels: Hotel[]): string {
  if (hotels.length === 0) return "";
  return `
<div class="page pad">
  <p class="section-eyebrow">Where you will stay</p>
  <h2>The addresses on this journey</h2>
  <div class="rule left"></div>
  <div class="hotel-grid">
    ${hotels
      .slice(0, 6)
      .map(
        (h) => `
      <div class="hotel-card">
        ${imageOrFallback(h.image, h.imageAlt?.trim() || h.name, h.location || h.name, "hotel-photo")}
        <div class="hotel-copy">
          <h4>${escapeHtml(h.name)}</h4>
          <p class="hotel-where">${escapeHtml(h.location || "")}</p>
        </div>
      </div>`
      )
      .join("")}
  </div>
</div>`;
}

function routePage(tour: Tour, days: ItineraryDay[]): string {
  // Consecutive duplicates collapse: four nights in one city is one stop on a
  // route, not four, and listing it four times makes the journey look padded.
  const stops: string[] = [];
  for (const d of days) {
    const place = String(d.placeName || "").trim();
    if (!place) continue;
    if (stops[stops.length - 1] !== place) stops.push(place);
  }
  if (stops.length === 0) return "";

  return `
<div class="page pad">
  <p class="section-eyebrow">The route</p>
  <h2>${escapeHtml(tour.duration)}, end to end</h2>
  <div class="rule left"></div>
  <ol class="route">
    ${stops
      .map(
        (s, i) => `
      <li>
        <span class="route-dot"></span>
        <span class="route-index">${String(i + 1).padStart(2, "0")}</span>
        <span class="route-name">${escapeHtml(s)}</span>
      </li>`
      )
      .join("")}
  </ol>
</div>`;
}

function teamPage(): string {
  return `
<div class="page pad">
  <p class="section-eyebrow">Who plans it</p>
  <h2>People, not a call centre</h2>
  <div class="rule left"></div>
  <div class="team-copy">
    <p>Every journey on these pages is built by hand, by the same small team that answers the phone when you call.</p>
    <p>Your itinerary is written by one planner who stays with it from the first email to the morning you fly home, and who has walked the ground you are about to walk.</p>
    <p>Your guides are Egyptologists rather than escorts, licensed and chosen for the specific sites on your route.</p>
    <p>On the ground there is one number to call, answered in Cairo, at any hour of the day or night you happen to need it.</p>
  </div>
  <div class="team-marks">
    <div class="mark"><span class="mark-value">1</span><span class="mark-label">planner, start to finish</span></div>
    <div class="mark"><span class="mark-value">24/7</span><span class="mark-label">on the ground in Cairo</span></div>
    <div class="mark"><span class="mark-value">0</span><span class="mark-label">shops on the itinerary</span></div>
  </div>
</div>`;
}

function closingPage(tour: Tour): string {
  return `
<div class="page closing">
  <p class="wordmark light">iLuxury Egypt</p>
  <div class="rule center"></div>
  <h2 class="closing-head">Tell us your dates</h2>
  <p class="closing-copy">This journey is a starting point rather than a fixed departure, and the shape of it changes with who is travelling and when.</p>
  <p class="closing-copy">Reply to the email this brochure arrived with and we will come back with the version built for your dates.</p>
  <p class="closing-mail">travel@iluxuryegypt.com</p>
  <p class="closing-tour">${escapeHtml(tour.title)}</p>
</div>`;
}

// ---------------------------------------------------------------------------

function styles(): string {
  return `
${BROCHURE_FONT_CSS}
@page { size: A4; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 210mm; }
body {
  font-family: 'Inter', system-ui, sans-serif;
  color: ${NAVY};
  background: ${OFF_WHITE};
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.page {
  position: relative;
  width: 210mm;
  height: 297mm;
  overflow: hidden;
  background: ${OFF_WHITE};
  page-break-after: always;
  break-after: page;
}
.page:last-child { page-break-after: auto; break-after: auto; }
.pad { padding: 22mm 20mm; }

h1, h2, h3, h4, .wordmark, .fact-value, .mark-value, .route-index, .photo-fallback span {
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 400;
}
p, li, span { font-weight: 300; line-height: 1.6; }

.rule { width: 26mm; height: 1px; background: ${GOLD}; margin: 6mm auto; }
.rule.left { margin: 6mm 0 8mm; }
.rule.left.short { width: 14mm; margin: 4mm 0 6mm; }
.rule.center { margin: 6mm auto; }

.section-eyebrow {
  font-size: 8pt; letter-spacing: 0.32em; text-transform: uppercase;
  color: ${GOLD}; font-weight: 600;
}
h2 { font-size: 26pt; line-height: 1.15; margin-top: 4mm; }
h3 { font-size: 20pt; line-height: 1.2; }
h4 { font-size: 12pt; }

/* Photos, and the navy panel that stands in for a missing one. */
.photo { width: 100%; height: 100%; object-fit: cover; display: block; }
.photo-fallback {
  background: ${NAVY};
  display: flex; align-items: center; justify-content: center;
  text-align: center; padding: 10mm;
}
.photo-fallback span {
  color: ${OFF_WHITE}; font-size: 17pt; line-height: 1.3;
  letter-spacing: 0.02em;
}

/* Cover */
.cover { padding: 0; }
.cover .cover-photo { position: absolute; inset: 0; }
.cover-veil {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(38,48,63,0.92) 0%, rgba(38,48,63,0.55) 45%, rgba(38,48,63,0.35) 100%);
}
.cover-body { position: absolute; left: 20mm; right: 20mm; bottom: 26mm; text-align: center; }
.wordmark {
  font-size: 13pt; letter-spacing: 0.34em; text-transform: uppercase;
  color: ${GOLD}; font-weight: 400;
}
.wordmark.light { color: ${GOLD}; }
.eyebrow {
  font-size: 8.5pt; letter-spacing: 0.3em; text-transform: uppercase;
  color: rgba(247,244,239,0.82); margin-bottom: 5mm;
}
.cover h1 { font-size: 34pt; line-height: 1.12; color: ${OFF_WHITE}; }
.cover-foot {
  margin-top: 7mm; font-size: 10pt; letter-spacing: 0.12em;
  color: rgba(247,244,239,0.72);
}

/* Intro */
.intro-grid { display: flex; gap: 12mm; margin-top: 4mm; }
.intro-copy { flex: 1.7; }
.intro-copy p { font-size: 11pt; margin-bottom: 5mm; }
.intro-facts { flex: 1; border-left: 1px solid rgba(38,48,63,0.14); padding-left: 8mm; }
.fact { margin-bottom: 7mm; }
.fact-label {
  display: block; font-size: 7.5pt; letter-spacing: 0.22em;
  text-transform: uppercase; color: ${GOLD}; font-weight: 600; margin-bottom: 1.5mm;
}
.fact-value { display: block; font-size: 14pt; }

/* Day pages: photo half, copy half, flipped on the odd ones. */
.day { display: flex; padding: 0; }
.day.flip { flex-direction: row-reverse; }
.day-photo { width: 84mm; height: 297mm; }
.day-copy { flex: 1; padding: 22mm 16mm; display: flex; flex-direction: column; }
.day-number {
  font-size: 8pt; letter-spacing: 0.32em; text-transform: uppercase;
  color: ${GOLD}; font-weight: 600;
}
.day-place {
  font-size: 8pt; letter-spacing: 0.2em; text-transform: uppercase;
  color: rgba(38,48,63,0.5); margin-top: 2mm;
}
.day-lede { font-size: 10.5pt; margin-bottom: 6mm; }

ul.ticks, ul.crosses { list-style: none; }
ul.ticks li, ul.crosses li {
  position: relative; padding-left: 7mm; margin-bottom: 3mm; font-size: 10pt;
}
ul.ticks li::before {
  content: ""; position: absolute; left: 0; top: 2.2mm;
  width: 3mm; height: 1.6mm; border-left: 1px solid ${GOLD}; border-bottom: 1px solid ${GOLD};
  transform: rotate(-45deg);
}
ul.crosses li::before {
  content: "\\00d7"; position: absolute; left: 0.5mm; top: 0;
  color: rgba(38,48,63,0.4); font-size: 11pt;
}

.day-foot { margin-top: auto; padding-top: 8mm; border-top: 1px solid rgba(38,48,63,0.14); }
.foot-item { display: flex; gap: 4mm; font-size: 9.5pt; margin-bottom: 2mm; }
.foot-label {
  min-width: 18mm; font-size: 7.5pt; letter-spacing: 0.2em; text-transform: uppercase;
  color: ${GOLD}; font-weight: 600; padding-top: 0.8mm;
}

/* Inclusions */
.two-col { display: flex; gap: 14mm; margin-top: 4mm; }
.two-col > div { flex: 1; }
.col-head {
  font-size: 13pt; padding-bottom: 3mm; margin-bottom: 5mm;
  border-bottom: 1px solid rgba(38,48,63,0.14);
}
.muted { font-size: 10pt; color: rgba(38,48,63,0.55); }

/* Hotels */
.hotel-grid { display: flex; flex-wrap: wrap; gap: 8mm; margin-top: 4mm; }
.hotel-card { width: 81mm; }
.hotel-photo { height: 52mm; }
.hotel-copy { padding-top: 4mm; }
.hotel-card h4 { font-size: 13pt; line-height: 1.25; }
.hotel-where {
  font-size: 8pt; letter-spacing: 0.2em; text-transform: uppercase;
  color: ${GOLD}; font-weight: 600; margin-top: 2mm;
}

/* Route */
ol.route { list-style: none; margin-top: 4mm; }
ol.route li {
  position: relative; display: flex; align-items: baseline; gap: 6mm;
  padding: 4mm 0 4mm 8mm; border-bottom: 1px solid rgba(38,48,63,0.1);
}
.route-dot {
  position: absolute; left: 0; top: 7mm;
  width: 2mm; height: 2mm; border-radius: 50%; background: ${GOLD};
}
.route-index { font-size: 11pt; color: ${GOLD}; min-width: 9mm; }
.route-name { font-size: 14pt; font-family: 'Playfair Display', Georgia, serif; }

/* Team */
.team-copy { margin-top: 4mm; max-width: 140mm; }
.team-copy p { font-size: 11pt; margin-bottom: 5mm; }
.team-marks { display: flex; gap: 12mm; margin-top: 12mm; padding-top: 8mm; border-top: 1px solid rgba(38,48,63,0.14); }
.mark { flex: 1; }
.mark-value { display: block; font-size: 24pt; color: ${GOLD}; }
.mark-label { display: block; font-size: 9pt; color: rgba(38,48,63,0.6); margin-top: 2mm; }

/* Closing */
.closing {
  background: ${NAVY}; color: ${OFF_WHITE};
  padding: 40mm 24mm; text-align: center;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.closing-head { font-size: 30pt; color: ${OFF_WHITE}; margin-bottom: 8mm; }
.closing-copy { font-size: 11pt; color: rgba(247,244,239,0.8); max-width: 130mm; margin-bottom: 5mm; }
.closing-mail { margin-top: 10mm; font-size: 13pt; letter-spacing: 0.12em; color: ${GOLD}; }
.closing-tour {
  margin-top: 16mm; font-size: 8pt; letter-spacing: 0.28em;
  text-transform: uppercase; color: rgba(247,244,239,0.45);
}
`;
}

/**
 * The whole brochure for one tour.
 *
 * The day count is whatever the itinerary array holds. Nothing here assumes
 * seven, which matters because the six tours this ships for range across
 * different lengths and a template that counted on seven would silently drop
 * days from the longer ones.
 */
export function renderBrochureHtml(tour: Tour, hotels: Hotel[]): string {
  const days: ItineraryDay[] = Array.isArray(tour.itinerary) ? (tour.itinerary as ItineraryDay[]) : [];

  const pages = [
    coverPage(tour),
    introPage(tour, days.length),
    ...days.map((d, i) => dayPage(d, i)),
    inclusionsPage(tour),
    hotelsPage(hotels),
    routePage(tour, days),
    teamPage(),
    closingPage(tour),
  ].filter((p) => p.trim().length > 0);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${escapeHtml(tour.title)} | iLuxury Egypt</title>
<style>${styles()}</style>
</head>
<body>
${pages.join("\n")}
</body>
</html>`;
}
