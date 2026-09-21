// A title that carries the current year, without an annual edit.
//
// Several articles target queries where the year in the title earns the click:
// "best time to visit egypt in 2026", "egypt visa for us citizens in 2026".
// Hardcoding it means every one of them is stale on 1 January and somebody has
// to remember. The stored title holds {year} instead, and the year is filled in
// at render time.
//
// Africa/Cairo, not the server's clock and not UTC. The business is in Egypt,
// the editor is in Egypt, and on 31 December a server running in UTC would
// roll the year over two hours after Cairo did, or a server in the Americas
// several hours before. One timezone, stated once.
//
// This is deliberately NOT used for the "Last reviewed" line on the visa,
// safety and vaccination articles. That date is a claim about when a person
// checked the rules against the source, and a date that advances on its own
// would be a lie that maintains itself. It stays hardcoded and is changed by
// hand when somebody actually re-reads the advisory.

export const YEAR_PLACEHOLDER = "{year}";

/** The year it currently is in Egypt, as a string. */
export function currentYear(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Cairo",
    year: "numeric",
  }).format(now);
}

/**
 * Fills in every {year} in a piece of text.
 *
 * Safe on any string: text without the placeholder comes back unchanged, so
 * this can be applied at every render boundary without having to know which
 * fields might carry one. That is the point. A placeholder reaching a page is
 * the failure this is guarding against, and the way to prevent it is to
 * substitute everywhere rather than to remember where.
 */
export function applyYear<T extends string | null | undefined>(
  text: T,
  now: Date = new Date(),
): T {
  if (!text || !text.includes(YEAR_PLACEHOLDER)) return text;
  return text.split(YEAR_PLACEHOLDER).join(currentYear(now)) as T;
}
