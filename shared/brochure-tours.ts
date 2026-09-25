/**
 * Tours whose page shows the "Download our journey" button.
 *
 * The generator itself is generic and will render a brochure for any tour in
 * the table. This list is the gate on the button, nothing else, and it exists
 * so the rollout can start with the six small group tours rather than all 67
 * at once.
 *
 * TO OPEN IT UP TO EVERY TOUR: delete the `hasBrochure` call at the two call
 * sites in client/src/pages/tour-detail.tsx, or make this function return
 * true. Nothing else in the feature reads this list, and in particular the
 * API does not: a brochure requested for a tour that is not listed here still
 * generates, because gating the endpoint as well would mean two places to
 * change instead of one.
 */
export const BROCHURE_TOUR_SLUGS = [
  "best-luxury-egypt-tours",
  "egypt-nile-cruise-packages",
  "egypt-private-tour-packages",
  "egypt-private-tours",
  "egypt-small-group-tour",
  "luxury-small-group-tours-egypt",
] as const;

const SLUG_SET: ReadonlySet<string> = new Set(BROCHURE_TOUR_SLUGS);

/** True when this tour's page should show the brochure button. */
export function hasBrochure(slug: string | null | undefined): boolean {
  return typeof slug === "string" && SLUG_SET.has(slug);
}
