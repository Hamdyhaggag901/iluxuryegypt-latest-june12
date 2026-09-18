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

export const ARTICLES = [a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13];

// One article every two to three days. A site this young publishing a batch at
// once is an unnatural pattern, which is the only reason they are spread out.
// The order is not arbitrary: an article may only link back to one already
// published, so anything it wants to point at has to come first.
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
];

// Real slugs. Tours live at the site ROOT, never under the category path.
export const TOUR_SLUGS = new Set([
  "7-day-egypt-tour", "10-day-egypt-tour", "12-days-egypt-tour",
  "family-tours-egypt", "egypt-family-vacation-packages", "egypt-tours-family",
  "egypt-small-group-tour", "egypt-private-tours", "egypt-private-tour-packages",
  "egypt-nile-cruise-packages", "best-luxury-egypt-tours", "luxury-small-group-tours-egypt",
]);

export const DESTINATION_SLUGS = new Set([
  "cairo-travel-guide", "attractions-in-luxor", "aswan-egypt-attractions",
  "alexandria-egypt-attractions", "things-to-do-in-hurghada", "siwa-oasis-egypt",
]);

// Articles that were on the site before this batch. An article may link to one
// of these freely: they are already live, so the link cannot 404 on publication.
export const EXISTING_POST_SLUGS = new Set([
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
};
