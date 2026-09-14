// Fills the day-by-day itinerary photos for the three "Family" and three
// "Solo" Egypt tours (58 days total, none of which currently carry an image),
// and fixes the itinerary text those photos depend on.
//
// Five things happen, in this order, per day:
//
//   1. `title`      — em/en dashes are converted to a colon (or a comma when a
//                     colon is already taken). Only the three family tours
//                     actually contain dashes; the solo tours already use the
//                     colon style, so this is a no-op there.
//   2. `placeName`  — replaced with the actual SITE the client visits that day
//                     instead of the city it sits in. "Giza, Egypt" becomes
//                     "Great Pyramid of Khufu"; "Cairo, Egypt" on the Kom el
//                     Dikka day becomes "Kom el Dikka". Departure days keep
//                     the bare city, since there is no site to name.
//   3. `image`      — a Pexels photo of that site, downloaded, converted to
//                     WebP through the same pipeline as an admin upload, and
//                     stored as a RELATIVE /api/assets/uploads/... path.
//   4. `imageAlt`   — a descriptive 8-15 word sentence about what the photo
//                     shows, not a restatement of the site name.
//   5. gallery      — for the three solo tours only (their galleries are
//                     empty), 6-8 of the day photos are promoted into
//                     tours.gallery with matching tours.gallery_alt entries.
//
// `lat`/`lng` are deliberately NEVER touched. On this site they encode the
// OVERNIGHT location, not the day's sightseeing stop — that is a standing
// convention (see the Day 6 Abydos/Dendera decision on the small-group tour,
// where the coordinates stayed on the Sofitel Winter Palace in Luxor). Day 4
// of 12-days-egypt-tour is a good illustration: the day is spent at Kom el
// Dikka in Alexandria but the night is in Cairo, so placeName becomes
// "Kom el Dikka" while lat/lng stay on Cairo.
//
// ---------------------------------------------------------------------------
// Running it
// ---------------------------------------------------------------------------
//   # 1. Review first. No network, no writes — prints the whole plan.
//   npx tsx scripts/fill-itinerary-images.ts --plan
//
//   # 2. Rehearse. Downloads everything, prints the results table, then rolls
//   #    back and deletes the files it wrote. Costs Pexels quota.
//   npx tsx scripts/fill-itinerary-images.ts --dry-run
//
//   # 3. For real.
//   npx tsx scripts/fill-itinerary-images.ts
//
// Other flags:
//   --only=<slug>          restrict the run to one tour (repeatable)
//   --force                overwrite days that already have an image, and
//                          overwrite a gallery that is not empty
//   --allow-title-drift    proceed even when a day's title in the database no
//                          longer matches what this script expects
//
// Needs DATABASE_URL and PEXELS_API_KEY. Both are in .env on the server and
// are picked up automatically by the dotenv import below.

import "dotenv/config";
import path from "path";
import fs from "fs/promises";
import { randomUUID } from "crypto";
import { pool } from "../server/db";
import { optimizeUploadedImage } from "../server/image-optimize";

// ---------------------------------------------------------------------------
// Curated itinerary data
// ---------------------------------------------------------------------------
// Transcribed from the itinerary JSON in content-updates/update-family-tours-full.sql
// and content-updates/update-solo-tours-full.sql, which is what produced the
// live rows. `expectTitle` is the title as those files wrote it; the script
// compares it against the database before changing anything, so if an admin
// has since edited a day by hand the run stops rather than silently stamping
// a placeName onto a day that is no longer about that place.
//
// `place` is the new placeName. `query` is an optional extra Pexels search
// tried when "<place> Egypt" returns nothing — several of these sites (Abu
// Rawash, Kom el Dikka, Cleopatra's Bath) are too obscure to be tagged in a
// stock library by name, and a descriptive query gets a real photo of the
// right kind of place where a bare city fallback would not. `city` is the
// last resort.
//
// `alt` is 8-15 words and describes the photograph, per the site's alt-text
// convention. The tour's focus keyword appears in exactly two or three of
// them per tour (checked by a guard below), never in all of them.

interface Day {
  day: number;
  expectTitle: string;
  place: string;
  query?: string;
  city: string;
  alt: string;
}

interface Tour {
  slug: string;
  label: string;
  focusKeyword: string;
  days: Day[];
  /** Day numbers to promote into tours.gallery. Empty = leave the gallery alone. */
  galleryDays: number[];
}

const TOURS: Tour[] = [
  {
    slug: "family-tours-egypt",
    label: "7-Day Family Tours Egypt",
    focusKeyword: "family tours egypt",
    galleryDays: [],
    days: [
      { day: 1, expectTitle: "Giza — Arrival and the Great Pyramid", place: "Great Pyramid of Khufu", city: "Giza",
        alt: "Great Pyramid of Khufu rising above the Giza sands on family tours Egypt" },
      { day: 2, expectTitle: "Cairo — The Egyptian Museum and Old Cairo", place: "Egyptian Museum", city: "Cairo",
        alt: "Golden funerary mask and antiquities displayed inside the Egyptian Museum in Cairo" },
      { day: 3, expectTitle: "Fly to Luxor — Karnak and Luxor Temple", place: "Karnak Temple", city: "Luxor",
        alt: "Massive sandstone columns of the Karnak Temple hypostyle hall in Luxor" },
      { day: 4, expectTitle: "Luxor West Bank — Valley of the Kings", place: "Valley of the Kings", city: "Luxor",
        alt: "Painted tomb corridor descending into the Valley of the Kings on family tours Egypt" },
      { day: 5, expectTitle: "Sail to Aswan — Kom Ombo and Edfu", place: "Kom Ombo Temple", city: "Aswan",
        alt: "Riverside columns of Kom Ombo Temple catching late afternoon light beside the Nile" },
      { day: 6, expectTitle: "Aswan — Nile Felucca and Nubian Village", place: "Nubian Village", query: "Nubian village Aswan colourful houses", city: "Aswan",
        alt: "Brightly painted Nubian village houses on the Nile riverbank near Aswan" },
      { day: 7, expectTitle: "Fly to Cairo — Departure", place: "Cairo", city: "Cairo",
        alt: "Cairo skyline and Nile bridges on the final morning of family tours Egypt" },
    ],
  },
  {
    slug: "egypt-family-vacation-packages",
    label: "10-Day Egypt Family Vacation Packages",
    focusKeyword: "egypt family vacation packages",
    galleryDays: [],
    days: [
      { day: 1, expectTitle: "Giza — Arrival and the Great Pyramid", place: "Great Pyramid of Khufu", city: "Giza",
        alt: "Great Pyramid of Khufu towering over the Giza plateau under clear morning sky" },
      { day: 2, expectTitle: "Cairo — The Egyptian Museum and Old Cairo", place: "Egyptian Museum", city: "Cairo",
        alt: "Gilded Tutankhamun treasures behind glass in the Egyptian Museum galleries" },
      { day: 3, expectTitle: "Saqqara and Dahshur — Beyond Giza", place: "Step Pyramid of Djoser", query: "Saqqara step pyramid Egypt", city: "Cairo",
        alt: "Stepped limestone terraces of Djoser's pyramid rising from the Saqqara desert" },
      { day: 4, expectTitle: "Fly to Luxor — Karnak and Luxor Temple", place: "Karnak Temple", city: "Luxor",
        alt: "Ram-headed sphinxes lining the processional avenue at Karnak Temple in Luxor" },
      { day: 5, expectTitle: "Luxor West Bank — Valley of the Kings", place: "Valley of the Kings", city: "Luxor",
        alt: "Rock-cut tomb entrances scattered across the Valley of the Kings hillside" },
      { day: 6, expectTitle: "Sail to Aswan — Kom Ombo and Edfu", place: "Kom Ombo Temple", city: "Aswan",
        alt: "Twin sanctuaries of Kom Ombo Temple standing on the Nile's eastern bank" },
      { day: 7, expectTitle: "Aswan — Nile Felucca and Nubian Village", place: "Nubian Village", query: "Nubian village Aswan colourful houses", city: "Aswan",
        alt: "Colourful Nubian houses and palm trees along the Aswan riverbank" },
      { day: 8, expectTitle: "Fly to Hurghada — Red Sea Arrival", place: "Hurghada", city: "Hurghada",
        alt: "Turquoise Red Sea water meeting the Hurghada shoreline on egypt family vacation packages" },
      { day: 9, expectTitle: "Hurghada — Red Sea Relaxation", place: "Red Sea", query: "Red Sea coral reef snorkelling Egypt", city: "Hurghada",
        alt: "Coral reef and tropical fish in the clear shallow Red Sea water" },
      { day: 10, expectTitle: "Fly to Cairo — Departure", place: "Cairo", city: "Cairo",
        alt: "Cairo rooftops at sunrise closing these egypt family vacation packages" },
    ],
  },
  {
    slug: "egypt-tours-family",
    label: "12-Day Egypt Tours Family",
    focusKeyword: "egypt tours family",
    galleryDays: [],
    days: [
      { day: 1, expectTitle: "Giza — Arrival and the Great Pyramid", place: "Great Pyramid of Khufu", city: "Giza",
        alt: "Great Sphinx and the Great Pyramid of Giza welcoming egypt tours family" },
      { day: 2, expectTitle: "Cairo — The Egyptian Museum and Old Cairo", place: "Egyptian Museum", city: "Cairo",
        alt: "Ancient statues and painted coffins filling the Egyptian Museum's main hall" },
      { day: 3, expectTitle: "Drive to Alexandria — Mediterranean Egypt", place: "Qaitbay Citadel", city: "Alexandria",
        alt: "Qaitbay Citadel standing on the Mediterranean seafront at Alexandria harbour" },
      { day: 4, expectTitle: "Alexandria — Catacombs and Return to Cairo", place: "Catacombs of Kom el Shoqafa", query: "ancient underground catacombs carved stone Egypt", city: "Alexandria",
        alt: "Carved stone burial chambers deep inside the Catacombs of Kom el Shoqafa" },
      { day: 5, expectTitle: "Fly to Luxor — Karnak and Luxor Temple", place: "Karnak Temple", city: "Luxor",
        alt: "Towering hypostyle columns of Karnak Temple lit by late Luxor sun" },
      { day: 6, expectTitle: "Luxor West Bank — Valley of the Kings", place: "Valley of the Kings", city: "Luxor",
        alt: "Barren limestone hills sheltering the royal tombs of the Valley of the Kings" },
      { day: 7, expectTitle: "Sail to Aswan — Kom Ombo and Edfu", place: "Kom Ombo Temple", city: "Aswan",
        alt: "Kom Ombo Temple columns reflected in the Nile at golden hour" },
      { day: 8, expectTitle: "Aswan — Nile Felucca and Nubian Village", place: "Nubian Village", query: "Nubian village Aswan colourful houses", city: "Aswan",
        alt: "Nubian village painted in blue and ochre beside the Aswan Nile" },
      { day: 9, expectTitle: "Fly to Cairo, Drive to Siwa — Desert Arrival", place: "Siwa Oasis", city: "Siwa Oasis",
        alt: "Palm groves and salt lakes spreading across Siwa Oasis in the Western Desert" },
      { day: 10, expectTitle: "Siwa — Temple of the Oracle and Shali Fortress", place: "Temple of the Oracle", query: "Siwa Oasis ancient temple ruins", city: "Siwa Oasis",
        alt: "Mudbrick ruins of the Temple of the Oracle above Siwa Oasis" },
      { day: 11, expectTitle: "Siwa — Cleopatra's Bath and Return to Cairo", place: "Cleopatra's Bath", query: "Siwa Oasis natural spring pool palm trees", city: "Siwa Oasis",
        alt: "Clear spring water of Cleopatra's Bath ringed by palms in Siwa" },
      { day: 12, expectTitle: "Cairo — Departure", place: "Cairo", city: "Cairo",
        alt: "Cairo at first light on the last day of egypt tours family" },
    ],
  },
  {
    slug: "7-day-egypt-tour",
    label: "7 Day Egypt Tour (solo)",
    focusKeyword: "7 day egypt tour",
    galleryDays: [1, 2, 3, 4, 5, 6],
    days: [
      { day: 1, expectTitle: "Giza: Dahshur and Memphis, Before the Crowds", place: "Red Pyramid of Dahshur", query: "Dahshur pyramid desert Egypt", city: "Giza",
        alt: "Red Pyramid of Dahshur standing alone on empty desert sand" },
      { day: 2, expectTitle: "Giza: Sunrise at the Plateau and an Evening in Zamalek", place: "Giza Pyramids", city: "Giza",
        alt: "Giza pyramids silhouetted against the pale sunrise sky on this 7 day egypt tour" },
      { day: 3, expectTitle: "Cairo: Islamic Cairo on Foot and a Craft Workshop", place: "Ibn Tulun Mosque", query: "Islamic Cairo mosque courtyard minaret", city: "Cairo",
        alt: "Spiral minaret and vast courtyard of the Ibn Tulun Mosque in Cairo" },
      { day: 4, expectTitle: "Fly to Luxor: Deir el-Medina and the Tombs of the Nobles", place: "Deir el-Medina", query: "Luxor west bank ancient village ruins", city: "Luxor",
        alt: "Stone workers' houses of Deir el-Medina on the Luxor west bank" },
      { day: 5, expectTitle: "Luxor: Dendera Day Trip", place: "Dendera Temple", query: "Dendera temple painted ceiling Egypt", city: "Luxor",
        alt: "Painted astronomical ceiling inside the hypostyle hall of Dendera Temple" },
      { day: 6, expectTitle: "Fly to Aswan: Nubian Culture and an Evening Alone on the Nile", place: "Nubian Village", query: "felucca sailing Nile Aswan sunset", city: "Aswan",
        alt: "Traditional felucca sailing past a Nubian village on the Nile at Aswan" },
      { day: 7, expectTitle: "Fly to Cairo: Departure", place: "Cairo", city: "Cairo",
        alt: "Cairo streets in morning light closing this 7 day egypt tour" },
    ],
  },
  {
    slug: "10-day-egypt-tour",
    label: "10 Day Egypt Tour (solo)",
    focusKeyword: "10 day egypt tour",
    galleryDays: [1, 2, 3, 4, 5, 6, 7, 8],
    days: [
      { day: 1, expectTitle: "Giza: Abu Rawash and the Forgotten Pyramid", place: "Abu Rawash", query: "ruined pyramid rubble desert ridge Egypt", city: "Giza",
        alt: "Ruined foundation blocks of the Abu Rawash pyramid on a desert ridge" },
      { day: 2, expectTitle: "Giza: Sunrise Plateau and the Solar Boat", place: "Giza Pyramids", city: "Giza",
        alt: "Giza pyramids and the reassembled solar boat under early morning light" },
      { day: 3, expectTitle: "Cairo: Coptic Cairo and the Egyptian Museum's Quiet Rooms", place: "Coptic Cairo", query: "Coptic Cairo church old Cairo Egypt", city: "Cairo",
        alt: "Hanging Church facade and narrow lanes of Coptic Cairo in old Cairo" },
      { day: 4, expectTitle: "Drive to Siwa Oasis: Into the Western Desert", place: "Siwa Oasis", city: "Siwa Oasis",
        alt: "Palm groves and mudbrick houses of Siwa Oasis deep in the Western Desert" },
      { day: 5, expectTitle: "Siwa: Temple of the Oracle and Shali at Dusk", place: "Temple of the Oracle", query: "Siwa Oasis ancient temple ruins dusk", city: "Siwa Oasis",
        alt: "Ruins of the Temple of the Oracle catching dusk light at Siwa" },
      { day: 6, expectTitle: "Siwa: Great Sand Sea and a Night Under the Stars", place: "Great Sand Sea", query: "Great Sand Sea dunes Western Desert Egypt", city: "Siwa Oasis",
        alt: "Unbroken dunes of the Great Sand Sea stretching toward the Libyan border" },
      { day: 7, expectTitle: "Return to Cairo, Fly to Luxor: Karnak After Hours", place: "Karnak Temple", query: "Karnak temple columns illuminated night", city: "Luxor",
        alt: "Illuminated columns of Karnak Temple after dark on this 10 day egypt tour" },
      { day: 8, expectTitle: "Luxor: Abydos and the Osireion", place: "Abydos Temple", query: "Abydos temple Seti relief carving Egypt", city: "Luxor",
        alt: "Fine relief carvings covering the walls of the Temple of Seti at Abydos" },
      { day: 9, expectTitle: "Fly to Aswan: Elephantine Island, Return to Cairo", place: "Elephantine Island", query: "Elephantine Island Aswan Nile ruins", city: "Aswan",
        alt: "Granite ruins and Nilometer steps on Elephantine Island in the Aswan Nile" },
      { day: 10, expectTitle: "Cairo: Departure", place: "Cairo", city: "Cairo",
        alt: "Quiet Cairo morning closing this 10 day egypt tour before departure" },
    ],
  },
  {
    slug: "12-days-egypt-tour",
    label: "12 Days Egypt Tour (solo)",
    focusKeyword: "12 days egypt tour",
    galleryDays: [1, 2, 3, 5, 6, 7, 8, 10],
    days: [
      { day: 1, expectTitle: "Giza: Saqqara's Lesser Tombs and the Serapeum", place: "Saqqara", query: "Saqqara necropolis tomb relief Egypt", city: "Giza",
        alt: "Granite sarcophagi lining the underground Serapeum gallery at Saqqara" },
      { day: 2, expectTitle: "Giza: The Plateau at Dawn and the Grand Egyptian Museum", place: "Giza Pyramids", city: "Giza",
        alt: "Giza plateau at dawn with the three pyramids catching first light" },
      { day: 3, expectTitle: "Drive to Alexandria: The Catacombs and a Mediterranean Evening", place: "Catacombs of Kom el Shoqafa", query: "ancient underground catacombs carved stone Egypt", city: "Alexandria",
        alt: "Carved Roman and Egyptian funerary niches inside the Kom el Shoqafa catacombs" },
      // Day 4's placeName is currently "Cairo, Egypt" even though the whole day
      // is in Alexandria — the single clearest case of the city-instead-of-site
      // problem this script exists to fix. lat/lng stay on Cairo (the night's
      // location) on purpose.
      { day: 4, expectTitle: "Alexandria: Kom el Dikka and the Cavafy Museum", place: "Kom el Dikka", query: "Roman amphitheatre Alexandria Egypt", city: "Alexandria",
        alt: "Tiered marble seating of the Roman amphitheatre at Kom el Dikka, Alexandria" },
      { day: 5, expectTitle: "Fly to Luxor: Medinet Habu and the Ramesseum", place: "Medinet Habu", query: "Medinet Habu temple painted relief Luxor", city: "Luxor",
        alt: "Painted battle reliefs on the outer walls of Medinet Habu temple" },
      { day: 6, expectTitle: "Luxor: Valley of the Queens and Howard Carter's House", place: "Valley of the Queens", query: "Valley of the Queens Luxor tombs", city: "Luxor",
        alt: "Rocky desert path leading into the tombs of the Valley of the Queens" },
      { day: 7, expectTitle: "Fly to Aswan: Philae Temple and the Unfinished Obelisk", place: "Philae Temple", city: "Aswan",
        alt: "Philae Temple rising from its island in the Nile near Aswan" },
      { day: 8, expectTitle: "Aswan: Abu Simbel Day Trip", place: "Abu Simbel", city: "Aswan",
        alt: "Colossal seated statues of Ramesses II carved into the Abu Simbel cliff" },
      { day: 9, expectTitle: "Fly to Hurghada: Red Sea Arrival", place: "Hurghada", city: "Hurghada",
        alt: "Turquoise Red Sea shallows along the Hurghada coast on this 12 days egypt tour" },
      { day: 10, expectTitle: "Hurghada: Diving or Doing Nothing", place: "Red Sea", query: "scuba diver coral reef Red Sea", city: "Hurghada",
        alt: "Diver above a coral reef in the clear Red Sea water" },
      { day: 11, expectTitle: "Fly to Cairo: Islamic Cairo on Foot", place: "Al-Muizz Street", query: "Al Muizz street Islamic Cairo lanterns", city: "Cairo",
        alt: "Medieval stone facades and lanterns along Al-Muizz Street in Islamic Cairo" },
      { day: 12, expectTitle: "Cairo: Departure", place: "Cairo", city: "Cairo",
        alt: "Cairo skyline at sunrise ending this 12 days egypt tour" },
    ],
  },
];

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
const argv = process.argv.slice(2);
const PLAN_ONLY = argv.includes("--plan");
const DRY_RUN = argv.includes("--dry-run");
const FORCE = argv.includes("--force");
const ALLOW_TITLE_DRIFT = argv.includes("--allow-title-drift");
const ONLY = argv.filter((a) => a.startsWith("--only=")).map((a) => a.slice("--only=".length));

const UPLOAD_DIR = path.resolve(import.meta.dirname, "..", "attached_assets", "uploads");
const UPLOAD_URL_PREFIX = "/api/assets/uploads/";
const CONTENT_MAX_WIDTH = 1600;
// Pexels documents 200 requests/hour on the free tier; server/routes.ts already
// throttles its own usage to 180/hour with ~1.1s spacing. This run needs at
// most ~120 searches even if every site falls through to a second and third
// query, so the same spacing keeps it comfortably inside the budget.
const PEXELS_SPACING_MS = 1100;
// Enough results per search that a site used by several tours still has an
// unused photo left for the last of them.
const PEXELS_PER_PAGE = 25;

const selectedTours = ONLY.length > 0 ? TOURS.filter((t) => ONLY.includes(t.slug)) : TOURS;
if (selectedTours.length === 0) {
  console.error(`No tour matched --only=. Known slugs:\n  ${TOURS.map((t) => t.slug).join("\n  ")}`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Title normalisation
// ---------------------------------------------------------------------------
// Day titles on this site follow "Place: what happens". The three family tours
// were written with em dashes instead, which read poorly and are banned from
// this project's copy. A dash that separates the place from the rest becomes a
// colon; a dash inside a title that already has a colon becomes a comma, so the
// result never carries two colons.
function normaliseTitle(title: string): string {
  let out = title.replace(/\s*[–—]\s*/g, (_m, offset: number) => {
    const before = title.slice(0, offset);
    return before.includes(":") ? ", " : ": ";
  });
  // A dash with no surrounding space (e.g. "Cairo–Luxor") reads as a range, not
  // a separator, so it becomes a plain hyphen rather than punctuation.
  out = out.replace(/[–—]/g, "-");
  return out.replace(/\s+/g, " ").trim();
}

// ---------------------------------------------------------------------------
// Guards — run before any network call or database write, so a bad piece of
// curated copy fails in a second rather than after 58 downloads.
// ---------------------------------------------------------------------------
function runGuards(): void {
  const problems: string[] = [];

  for (const tour of TOURS) {
    const seenDays = new Set<number>();
    let keywordAlts = 0;

    for (const d of tour.days) {
      const label = `${tour.slug} D${d.day}`;

      if (seenDays.has(d.day)) problems.push(`${label}: duplicate day number`);
      seenDays.add(d.day);

      const words = d.alt.trim().split(/\s+/).length;
      if (words < 8 || words > 15) problems.push(`${label}: alt is ${words} words (want 8-15) -> "${d.alt}"`);

      // "descriptive, not just the name" — an alt that is only the place name
      // plus a word or two is exactly what this rule exists to prevent.
      if (d.alt.trim().toLowerCase() === d.place.toLowerCase()) problems.push(`${label}: alt is just the place name`);

      if (/[–—]/.test(d.alt)) problems.push(`${label}: alt contains an em or en dash`);
      if (/[–—]/.test(normaliseTitle(d.expectTitle))) problems.push(`${label}: normalised title still contains a dash`);

      const colons = (normaliseTitle(d.expectTitle).match(/:/g) || []).length;
      if (colons > 1) problems.push(`${label}: normalised title has ${colons} colons -> "${normaliseTitle(d.expectTitle)}"`);

      if (d.alt.toLowerCase().includes(tour.focusKeyword.toLowerCase())) keywordAlts++;

      // placeName feeds the itinerary map's geocoding query as well as the
      // photo search, so it must not carry the ", Egypt" suffix this script is
      // replacing, and must not be empty.
      if (!d.place.trim()) problems.push(`${label}: empty placeName`);
      if (/,\s*egypt$/i.test(d.place)) problems.push(`${label}: placeName still has a ", Egypt" suffix`);
    }

    // The focus keyword is an SEO signal, not a filler: two or three alts per
    // tour carry it, the rest stay purely descriptive.
    if (keywordAlts < 2 || keywordAlts > 3) {
      problems.push(`${tour.slug}: focus keyword "${tour.focusKeyword}" appears in ${keywordAlts} alt(s) (want 2-3)`);
    }

    for (const g of tour.galleryDays) {
      if (!tour.days.some((d) => d.day === g)) problems.push(`${tour.slug}: galleryDays references day ${g}, which does not exist`);
    }
    if (tour.galleryDays.length > 0 && (tour.galleryDays.length < 6 || tour.galleryDays.length > 8)) {
      problems.push(`${tour.slug}: ${tour.galleryDays.length} gallery days (want 6-8)`);
    }
  }

  if (problems.length > 0) {
    console.error("GUARD FAILURES:\n  " + problems.join("\n  "));
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// Pexels
// ---------------------------------------------------------------------------
interface PexelsPhoto {
  id: number;
  alt: string;
  photographer: string;
  photographer_url: string;
  url: string;
  src: { original?: string; large2x?: string; large?: string };
}

const PEXELS_KEY = (process.env.PEXELS_API_KEY ?? "").trim();

// Cached per query so the same search is not paid for twice when several tours
// visit the same site.
const searchCache = new Map<string, PexelsPhoto[]>();
// Every photo id handed out so far, across every tour. This is what enforces
// "never the same image twice" — both within a tour and, where the results
// allow it, between tours visiting the same site.
const usedPhotoIds = new Set<number>();

let lastPexelsCall = 0;
async function pexelsSearch(query: string): Promise<PexelsPhoto[]> {
  const cached = searchCache.get(query);
  if (cached) return cached;

  const wait = PEXELS_SPACING_MS - (Date.now() - lastPexelsCall);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastPexelsCall = Date.now();

  // Overridable only so the whole download/optimise/dedupe path can be
  // exercised against a local receiver during testing. Unset in production.
  const base = process.env.PEXELS_API_BASE?.trim() || "https://api.pexels.com/v1";
  const url = new URL(`${base}/search`);
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", String(PEXELS_PER_PAGE));
  url.searchParams.set("orientation", "landscape");

  const response = await fetch(url, { headers: { Authorization: PEXELS_KEY } });
  if (!response.ok) throw new Error(`Pexels responded with ${response.status} for "${query}"`);
  const data = (await response.json()) as { photos?: PexelsPhoto[] };
  const photos = data.photos ?? [];
  searchCache.set(query, photos);
  return photos;
}

/** Tries each query in turn and returns the first photo not already used. */
async function pickPhoto(queries: string[]): Promise<{ photo: PexelsPhoto; query: string } | null> {
  for (const query of queries) {
    const photos = await pexelsSearch(query);
    const fresh = photos.find((p) => !usedPhotoIds.has(p.id));
    if (fresh) {
      usedPhotoIds.add(fresh.id);
      return { photo: fresh, query };
    }
  }
  return null;
}

// Files this run has written, so --dry-run can undo itself completely and a
// failure part-way through does not leave orphans on disk.
const writtenFiles: string[] = [];

async function downloadAndOptimise(photo: PexelsPhoto): Promise<{ url: string; filename: string; size: number }> {
  const source = photo.src.large2x || photo.src.large || photo.src.original;
  if (!source) throw new Error(`Pexels photo ${photo.id} has no usable source URL`);

  const response = await fetch(source);
  if (!response.ok) throw new Error(`Failed to download Pexels photo ${photo.id} (${response.status})`);
  const buffer = Buffer.from(await response.arrayBuffer());

  // Downloaded as .jpg and handed to the same optimiser an admin upload goes
  // through: sharp sniffs the real format, so the extension is only a
  // placeholder. optimizeUploadedImage writes <uuid>.webp and removes this.
  const tempName = `${randomUUID()}.jpg`;
  await fs.writeFile(path.join(UPLOAD_DIR, tempName), buffer);
  writtenFiles.push(path.join(UPLOAD_DIR, tempName));

  const optimised = await optimizeUploadedImage(UPLOAD_DIR, tempName, CONTENT_MAX_WIDTH);
  if (!optimised) throw new Error(`Optimisation returned nothing for Pexels photo ${photo.id}`);
  writtenFiles.push(path.join(UPLOAD_DIR, optimised.filename));

  // RELATIVE path, never an absolute https://iluxuryegypt.com/... URL: this is
  // the form the upload route itself returns and the form the front end
  // expects, and it keeps the content portable between environments.
  return { url: `${UPLOAD_URL_PREFIX}${optimised.filename}`, filename: optimised.filename, size: optimised.size };
}

async function removeWrittenFiles(): Promise<void> {
  for (const file of writtenFiles) {
    await fs.unlink(file).catch(() => {});
  }
}

// ---------------------------------------------------------------------------
// Database
// ---------------------------------------------------------------------------
// server/db.ts exports a pool that is either a Neon pool or a node-postgres
// pool depending on DATABASE_URL, and the union of those two types is awkward
// to call through. Only connect/query/release are needed here and both drivers
// expose them identically, so the pool is narrowed to that shape.
interface TxClient {
  query(text: string, values?: unknown[]): Promise<{ rows: any[] }>;
  release(): void;
}
const connectable = pool as unknown as { connect(): Promise<TxClient> };

interface ItineraryDayRow {
  day?: number;
  title?: string;
  description?: string;
  placeName?: string;
  image?: string;
  imageAlt?: string;
  [key: string]: unknown;
}

interface TourRow {
  id: string;
  slug: string;
  title: string;
  itinerary: ItineraryDayRow[];
  gallery: string[];
  gallery_alt: Record<string, string>;
}

interface ReportRow {
  tour: string;
  day: number;
  titleBefore: string;
  titleAfter: string;
  placeBefore: string;
  placeAfter: string;
  image: string;
  query: string;
  photoId: string;
  credit: string;
  altWords: number;
  note: string;
}

const report: ReportRow[] = [];
const galleryReport: string[] = [];

function pad(value: string, width: number): string {
  const v = value.length > width ? value.slice(0, width - 1) + "…" : value;
  return v + " ".repeat(Math.max(0, width - v.length));
}

function printReport(): void {
  const cols: Array<[keyof ReportRow, string, number]> = [
    ["tour", "TOUR", 30],
    ["day", "DAY", 3],
    ["placeBefore", "PLACENAME BEFORE", 20],
    ["placeAfter", "PLACENAME AFTER", 28],
    ["image", "IMAGE", 46],
    ["query", "SOURCE QUERY", 38],
    ["photoId", "PEXELS ID", 10],
    ["altWords", "ALT W", 5],
    ["note", "NOTE", 22],
  ];
  console.log("\n" + cols.map(([, h, w]) => pad(h, w)).join("  "));
  console.log(cols.map(([, , w]) => "-".repeat(w)).join("  "));
  for (const row of report) {
    console.log(cols.map(([k, , w]) => pad(String(row[k] ?? ""), w)).join("  "));
  }

  const titleChanges = report.filter((r) => r.titleBefore !== r.titleAfter);
  if (titleChanges.length > 0) {
    console.log(`\nDay titles rewritten (${titleChanges.length}):`);
    for (const r of titleChanges) console.log(`  ${r.tour} D${r.day}\n    - ${r.titleBefore}\n    + ${r.titleAfter}`);
  }

  if (galleryReport.length > 0) {
    console.log("\nGalleries:");
    for (const line of galleryReport) console.log(`  ${line}`);
  }

  console.log("\nPhoto credits (Pexels requires no attribution, but each is stored in media.caption):");
  for (const r of report) {
    if (r.credit) console.log(`  ${r.tour} D${r.day}: ${r.credit}`);
  }
}

async function loadTour(client: TxClient, slug: string): Promise<TourRow | null> {
  const { rows } = await client.query(
    `SELECT id, slug, title, itinerary, gallery, gallery_alt FROM tours WHERE slug = $1`,
    [slug]
  );
  return rows[0] ?? null;
}

async function resolveUploader(client: TxClient): Promise<string | null> {
  // media.uploaded_by is a nullable FK to users. Attributing these rows to the
  // first admin keeps the Media Library entries looking like every other
  // import rather than orphaned; null is a fine fallback.
  const { rows } = await client.query(
    `SELECT id FROM users WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1`
  );
  return rows[0]?.id ?? null;
}

async function run(): Promise<void> {
  runGuards();
  console.log(`Guards passed: ${TOURS.reduce((n, t) => n + t.days.length, 0)} curated days across ${TOURS.length} tours.`);

  if (PLAN_ONLY) {
    console.log("\n--plan: no network calls, no writes. Showing what a real run would do.\n");
  } else if (!PEXELS_KEY) {
    console.error("PEXELS_API_KEY is not set. Add it to .env, or use --plan to review without it.");
    process.exit(1);
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  const client = await connectable.connect();
  let committed = false;

  try {
    await client.query("BEGIN");

    const uploader = PLAN_ONLY ? null : await resolveUploader(client);
    const drift: string[] = [];

    for (const tour of selectedTours) {
      const row = await loadTour(client, tour.slug);
      if (!row) {
        throw new Error(`Tour "${tour.slug}" was not found. Has its slug changed again?`);
      }

      const itinerary: ItineraryDayRow[] = Array.isArray(row.itinerary) ? row.itinerary : [];
      if (itinerary.length !== tour.days.length) {
        throw new Error(
          `Tour "${tour.slug}" has ${itinerary.length} days in the database but ${tour.days.length} are curated here. ` +
            `The itinerary has changed since this script was written; update TOURS before running it.`
        );
      }

      const newItinerary: ItineraryDayRow[] = [];
      const dayImages = new Map<number, { url: string; alt: string }>();

      for (const curated of tour.days) {
        const existing = itinerary.find((d) => Number(d.day) === curated.day);
        if (!existing) throw new Error(`Tour "${tour.slug}" has no day ${curated.day}`);

        const titleBefore = String(existing.title ?? "");
        const titleAfter = normaliseTitle(titleBefore);
        const placeBefore = String(existing.placeName ?? "");

        // Drift check. Compared after normalisation so the dash rewrite itself
        // is never mistaken for someone having edited the day.
        if (normaliseTitle(curated.expectTitle) !== titleAfter) {
          const message =
            `${tour.slug} D${curated.day}: title in the database is "${titleBefore}" ` +
            `but this script was written for "${curated.expectTitle}"`;
          if (!ALLOW_TITLE_DRIFT) drift.push(message);
          else console.warn(`WARNING (--allow-title-drift): ${message}`);
        }

        let image = String(existing.image ?? "");
        let query = "";
        let photoId = "";
        let credit = "";
        let note = "";

        if (image && !FORCE) {
          note = "kept existing image";
        } else if (PLAN_ONLY) {
          image = "(would be downloaded)";
          query = [`${curated.place} Egypt`, curated.query, `${curated.city} Egypt`].filter(Boolean).join("  |  ");
          note = "plan only";
        } else {
          // The query chain the brief asked for: the site's own name first,
          // then a descriptive query for sites too obscure to be tagged by
          // name in a stock library, then the city as a last resort.
          const queries = [`${curated.place} Egypt`, curated.query, `${curated.city} Egypt`].filter(
            (q): q is string => Boolean(q)
          );
          const picked = await pickPhoto(queries);
          if (!picked) {
            throw new Error(
              `No unused Pexels photo found for ${tour.slug} D${curated.day} ("${curated.place}") ` +
                `after trying: ${queries.join(", ")}`
            );
          }

          const saved = await downloadAndOptimise(picked.photo);
          image = saved.url;
          query = picked.query;
          photoId = String(picked.photo.id);
          credit = `Photo by ${picked.photo.photographer} on Pexels (${picked.photo.url})`;
          note = picked.query === `${curated.place} Egypt` ? "" : "fallback query";

          // Registered in the Media Library so the client can see, reuse and
          // replace these photos from the admin UI like any other asset.
          await client.query(
            `INSERT INTO media (filename, original_name, mime_type, size, url, alt_en, caption, uploaded_by)
             VALUES ($1, $2, 'image/webp', $3, $4, $5, $6, $7)`,
            [
              saved.filename,
              `pexels-${curated.place.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
              saved.size,
              saved.url,
              curated.alt,
              credit,
              uploader,
            ]
          );
        }

        // Spread first so activities, meals, accommodation, description and
        // — crucially — lat and lng survive untouched. This script writes
        // exactly four keys and never removes any.
        newItinerary.push({
          ...existing,
          title: titleAfter,
          placeName: curated.place,
          image,
          imageAlt: curated.alt,
        });

        if (image && !image.startsWith("(")) dayImages.set(curated.day, { url: image, alt: curated.alt });

        report.push({
          tour: tour.slug,
          day: curated.day,
          titleBefore,
          titleAfter,
          placeBefore,
          placeAfter: curated.place,
          image,
          query,
          photoId,
          credit,
          altWords: curated.alt.trim().split(/\s+/).length,
          note,
        });
      }

      // Days are written back in their original order rather than the curated
      // order, in case the stored array is not sorted by day number.
      const byDay = new Map(newItinerary.map((d) => [Number(d.day), d]));
      const ordered = itinerary.map((d) => byDay.get(Number(d.day)) ?? d);

      if (!PLAN_ONLY) {
        await client.query(`UPDATE tours SET itinerary = $1::jsonb, updated_at = now() WHERE id = $2`, [
          JSON.stringify(ordered),
          row.id,
        ]);
      }

      // Gallery, for the three solo tours whose galleries are empty.
      if (tour.galleryDays.length > 0) {
        const currentGallery = Array.isArray(row.gallery) ? row.gallery : [];
        if (currentGallery.length > 0 && !FORCE) {
          galleryReport.push(`${tour.slug}: left alone, already has ${currentGallery.length} image(s) (use --force to replace)`);
        } else if (PLAN_ONLY) {
          galleryReport.push(`${tour.slug}: would take days ${tour.galleryDays.join(", ")} (${tour.galleryDays.length} images)`);
        } else {
          const gallery: string[] = [];
          const galleryAlt: Record<string, string> = {};
          for (const dayNumber of tour.galleryDays) {
            const picked = dayImages.get(dayNumber);
            if (!picked) continue;
            gallery.push(picked.url);
            galleryAlt[picked.url] = picked.alt;
          }
          await client.query(
            `UPDATE tours SET gallery = $1::text[], gallery_alt = $2::jsonb, updated_at = now() WHERE id = $3`,
            [gallery, JSON.stringify(galleryAlt), row.id]
          );
          galleryReport.push(`${tour.slug}: ${gallery.length} image(s) from days ${tour.galleryDays.join(", ")}`);
        }
      }
    }

    if (drift.length > 0) {
      throw new Error(
        `Itinerary titles have drifted from what this script expects:\n  ${drift.join("\n  ")}\n` +
          `Update the TOURS table in this script, or re-run with --allow-title-drift if the curated ` +
          `placeName and alt text are still correct for these days.`
      );
    }

    printReport();

    if (PLAN_ONLY) {
      await client.query("ROLLBACK");
      console.log("\n--plan: nothing was written and nothing was downloaded.");
    } else if (DRY_RUN) {
      await client.query("ROLLBACK");
      await removeWrittenFiles();
      console.log(`\n--dry-run: rolled back, and removed ${writtenFiles.length} file(s) written to ${UPLOAD_DIR}.`);
    } else {
      await client.query("COMMIT");
      committed = true;
      console.log(`\nCOMMITTED. ${report.filter((r) => r.photoId).length} photo(s) downloaded into ${UPLOAD_DIR}.`);
      console.log(
        "Next: press “Notify Search Engines” in Admin → Settings, since writing straight to the " +
          "database bypasses the IndexNow hooks on the CMS routes."
      );
    }
  } catch (error) {
    if (!committed) {
      await client.query("ROLLBACK").catch(() => {});
      await removeWrittenFiles();
    }
    throw error;
  } finally {
    client.release();
    await (pool as unknown as { end(): Promise<void> }).end();
  }
}

run().catch((error) => {
  console.error("\nFAILED, nothing was committed:\n", error instanceof Error ? error.message : error);
  process.exit(1);
});
