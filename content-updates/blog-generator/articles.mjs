// The one list of articles and the one publishing schedule.
//
// gen.mjs, sched.mjs and apply-patches.mjs all read from here. They each used
// to import a1..a5 by hand and carry their own copy of the dates, which meant
// adding an article was three edits in three files and a chance for the
// schedule in one to drift from the schedule in another.

import a1 from "./a1.mjs";
import a2 from "./a2.mjs";
import a3 from "./a3.mjs";
import a4 from "./a4.mjs";
import a5 from "./a5.mjs";
import a6 from "./a6.mjs";
import a7 from "./a7.mjs";
import a8 from "./a8.mjs";
import a9 from "./a9.mjs";
import a10 from "./a10.mjs";
import a11 from "./a11.mjs";
import a12 from "./a12.mjs";
import a13 from "./a13.mjs";
import a14 from "./a14.mjs";
import a15 from "./a15.mjs";
import a16 from "./a16.mjs";
import a17 from "./a17.mjs";
import a18 from "./a18.mjs";
import a19 from "./a19.mjs";
import a20 from "./a20.mjs";
import a21 from "./a21.mjs";
import a22 from "./a22.mjs";
import a23 from "./a23.mjs";
import a24 from "./a24.mjs";
import a25 from "./a25.mjs";
import a26 from "./a26.mjs";
import a27 from "./a27.mjs";
import a28 from "./a28.mjs";
import a29 from "./a29.mjs";
import a30 from "./a30.mjs";
import a31 from "./a31.mjs";
import a32 from "./a32.mjs";
import a33 from "./a33.mjs";
import a34 from "./a34.mjs";
import a35 from "./a35.mjs";
import a36 from "./a36.mjs";
import a37 from "./a37.mjs";
import a38 from "./a38.mjs";

// a14 onwards are the two later waves. They are APPENDED rather than slotted
// into date order, so the 13 files above regenerate byte for byte. The order of
// this array no longer matches the order of publication, which is why gen.mjs
// validates "does this link point at something already live" by date.
export const ARTICLES = [a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38];

// One article every two to three days. A site this young publishing a batch at
// once is an unnatural pattern, which is the only reason they are spread out.
// The order is not arbitrary: an article may only link back to one already
// published, so anything it wants to point at has to come first.
/**
 * Marks an article that is already published. A rewrite of a live post has no
 * publish date to set: the row keeps the published_at it has carried since it
 * first went out, and only its body and its SEO fields change.
 */
export const LIVE = "live";

export const SCHEDULE = [
  "2026-09-22T09:00:00+03:00", // abu-simbel-tour-from-aswan
  "2026-09-24T09:00:00+03:00", // grand-egyptian-museum-tour
  "2026-09-27T09:00:00+03:00", // tombs-in-the-valley-of-kings
  "2026-09-29T09:00:00+03:00", // what-to-see-in-luxor
  "2026-10-02T09:00:00+03:00", // dahshur-pyramids-egypt
  "2026-10-05T09:00:00+03:00", // nubian-village-aswan-egypt
  "2026-10-08T09:00:00+03:00", // dendera-temple-egypt
  "2026-10-11T09:00:00+03:00", // kom-ombo-temple
  "2026-10-14T09:00:00+03:00", // medinet-habu
  "2026-10-17T09:00:00+03:00", // things-to-do-in-aswan
  "2026-10-20T09:00:00+03:00", // coptic-cairo
  "2026-10-23T09:00:00+03:00", // islamic-cairo
  "2026-10-26T09:00:00+03:00", // alexandria-day-trip-from-cairo

  // Wave one: low difficulty keywords, publishing across the second half of
  // October alongside the tail of the batch above.
  "2026-10-15T09:00:00+03:00", // valley-of-the-queens
  "2026-10-16T09:00:00+03:00", // egypt-diving-red-sea
  "2026-10-19T09:00:00+03:00", // black-and-white-desert-egypt
  "2026-10-21T09:00:00+03:00", // tombs-of-the-nobles
  "2026-10-24T09:00:00+03:00", // open-air-museum-memphis-egypt

  // Wave two: higher difficulty keywords, written now and dated December on
  // purpose so they publish into a site with more depth behind them.
  //
  // +02:00, not +03:00. Egypt keeps summer time from late April to the last
  // Friday in October, so 9am Cairo is +03:00 for every date above and +02:00
  // for every date here. Writing +03:00 on a December row publishes it at 8am
  // local, silently. gen.mjs now checks each of these renders as 09:00 in
  // Africa/Cairo rather than trusting the offset typed in the string.
  "2026-12-01T09:00:00+02:00", // hatshepsut-temple
  "2026-12-05T09:00:00+02:00", // memphis-egypt
  "2026-12-10T09:00:00+02:00", // deir-el-medina
  "2026-12-15T09:00:00+02:00", // bahariya-oasis-egypt

  // Rewrites of articles that are already published. See LIVE above.
  LIVE, // best-time-to-visit-egypt
  LIVE, // luxury-egypt-tours
  LIVE, // egypt-visa-for-us-citizens
  LIVE, // is-egypt-safe-for-americans
  LIVE, // egypt-travel-insurance
  LIVE, // egypt-honeymoon
  LIVE, // egypt-plug-type
  LIVE, // private-pyramid-tours-egypt
  LIVE, // best-luxury-nile-cruise-egypt
  LIVE, // vaccinations-needed-for-egypt
  LIVE, // planning-a-trip-to-egypt
  LIVE, // egypt-travel-tips
  LIVE, // what-to-pack-for-egypt
  LIVE, // private-tours-in-cairo-egypt
  LIVE, // tailor-made-egypt-tours
  LIVE, // currency-in-egypt
];

// Real slugs. Tours live at the site ROOT, never under the category path.
//
// KEEP THIS IN STEP WITH THE `tours` TABLE. It is a hand maintained copy of
// data that lives in the database, and the generator has no database access at
// generation time, so nothing here can notice when the two drift. The failure
// is quiet in both directions: a slug missing from this list makes the
// generator reject a link to a tour that exists, and a slug left here after the
// tour is unpublished or renamed lets a link through that 404s on the live
// site. See the README for the query to check it with.
export const TOUR_SLUGS = new Set([
  "7-day-egypt-tour", "10-day-egypt-tour", "12-days-egypt-tour",
  "family-tours-egypt", "egypt-family-vacation-packages", "egypt-tours-family",
  "egypt-small-group-tour", "egypt-private-tours", "egypt-private-tour-packages",
  "egypt-nile-cruise-packages", "best-luxury-egypt-tours", "luxury-small-group-tours-egypt",
  // Confirmed published in the tours table on 19 September 2026.
  "white-desert-luxury-camping",
]);

export const DESTINATION_SLUGS = new Set([
  "cairo-travel-guide", "attractions-in-luxor", "aswan-egypt-attractions",
  "alexandria-egypt-attractions", "things-to-do-in-hurghada", "siwa-oasis-egypt",
]);

// Articles that were on the site before this batch. An article may link to one
// of these freely: they are already live, so the link cannot 404 on publication.
// The sixteen rewritten posts. Every one of these rows is already published;
// six of them change slug in the same wave, and server/path-redirects.ts sends
// the old path to the new one. They are listed here so an article may link to
// one whether or not its own module is in ARTICLES yet, which is what lets the
// rewrite phases ship one at a time.
export const REWRITTEN_POST_SLUGS = new Set([
  "best-time-to-visit-egypt", "luxury-egypt-tours", "egypt-visa-for-us-citizens",
  "is-egypt-safe-for-americans", "egypt-travel-insurance", "egypt-honeymoon",
  "egypt-plug-type", "private-pyramid-tours-egypt", "best-luxury-nile-cruise-egypt",
  "vaccinations-needed-for-egypt", "planning-a-trip-to-egypt", "egypt-travel-tips",
  "what-to-pack-for-egypt", "private-tours-in-cairo-egypt", "tailor-made-egypt-tours",
  "currency-in-egypt",
]);

export const EXISTING_POST_SLUGS = new Set([
  ...REWRITTEN_POST_SLUGS,
  "best-luxury-nile-cruise-egypt",
  "luxury-cairo-luxor-aswan-itinerary",
  "best-time-to-visit-egypt",
  "egypt-packing-list",
  "private-egypt-tour-vs-group-tour",
]);

// Keywords that belong to another page. Using one here would put two pages of
// the same site in the same search result, competing with each other.
export const RESERVED_KEYWORDS = {
  "what-to-see-in-luxor": ["attractions in luxor"],
  "grand-egyptian-museum-tour": [],
  "dahshur-pyramids-egypt": ["step pyramid of djoser"],
  // The destination pages own these outright.
  "things-to-do-in-aswan": ["aswan egypt attractions"],
  "alexandria-day-trip-from-cairo": ["alexandria egypt attractions"],
  "nubian-village-aswan-egypt": ["aswan egypt attractions"],
  // Higher difficulty variants of the same intent, deliberately not chased.
  "dendera-temple-egypt": ["abydos temple egypt"],
  "islamic-cairo": ["cair islamic"],
  // The Kings tombs have their own article. This one stays on the Queens, and
  // the combined phrase is a harder keyword than either page should chase.
  "valley-of-the-queens": ["valley of the kings and queens"],
  // The camping tour page owns bare "white desert egypt". This article covers
  // both deserts as a pair and must never use that phrase on its own, and Siwa
  // belongs to its destination guide.
  "black-and-white-desert-egypt": ["white desert egypt", "siwa oasis egypt"],
  // Both destination pages own their phrases outright. This article covers two
  // cities and could drift into either without the guard.
  "tombs-of-the-nobles": ["attractions in luxor", "aswan egypt attractions"],
  // Saqqara and the new Giza museum are both far harder keywords than this
  // short museum piece should be chasing, and both are easy to wander into.
  "open-air-museum-memphis-egypt": ["step pyramid of djoser", "grand egyptian museum", "egyptian museum cairo"],
  "hatshepsut-temple": ["attractions in luxor", "karnak"],
  // "memphis tours egypt" is a competitor's brand name as well as a hard
  // keyword, and it is one careless sentence away in an article like this.
  "memphis-egypt": ["memphis tours egypt", "step pyramid of djoser"],
  // Deir el Bahari belongs to the Hatshepsut article. Two neighbouring sites
  // with confusingly similar names is exactly how a page ends up outranking
  // its own sibling for the wrong query.
  "deir-el-medina": ["deir el bahari", "attractions in luxor", "karnak"],
  // The desert article owns the chalk, the camping tour page owns bare "white
  // desert egypt", and Siwa belongs to its destination guide.
  "bahariya-oasis-egypt": ["white desert egypt", "siwa oasis egypt"],
};
