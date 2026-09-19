// How a destination page's H1 is built, in one place.
//
// destinations.name stays short ("Cairo", "Luxor") because cards, breadcrumbs
// and tour links all render it. The page's own H1 and hero alt want the phrase
// the page actually targets, so they come from focus_keyword instead, cased for
// display. Small joining words stay lowercase; everything else is capitalised.
//
// This lived in client/src/pages/destination-detail.tsx and was the client's
// alone. Now the server renders the same H1 into the HTML a crawler reads, and
// two copies of this rule would drift the moment either was edited: the crawler
// would index one heading and the reader would see another.

const TITLE_CASE_MINOR_WORDS = new Set(["in", "to", "of", "the", "and", "for", "a", "an", "on", "at"]);

export function titleCaseKeyword(keyword: string): string {
  return keyword
    .trim()
    .split(/\s+/)
    .map((word, index) =>
      index > 0 && TITLE_CASE_MINOR_WORDS.has(word.toLowerCase())
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

/** The H1 a destination page shows: its focus keyword, cased, else its name. */
export function destinationHeading(
  destination: { focusKeyword?: string | null; name: string }
): string {
  return destination.focusKeyword?.trim()
    ? titleCaseKeyword(destination.focusKeyword)
    : destination.name;
}

/**
 * The hotel listing page's H1 when no hero row has been saved yet.
 *
 * client/src/pages/stay.tsx falls back to this when /api/public/stay-page
 * returns no hero, and server/seo-content.ts has to fall back to the same
 * string: a crawler reading one heading while a visitor sees another is the
 * drift this module exists to prevent.
 */
export const HOTEL_INDEX_FALLBACK_HEADING = "Where Luxury Meets the Nile";
