import type { Season } from "@shared/schema";

/**
 * Applies one season's rule to a base price.
 * priceMultiplier is a percentage (e.g. 120 = +20%); flatMarkup is a flat amount.
 * A season should have exactly one of the two set (enforced by the admin form / CMS route).
 */
function applySeason(basePrice: number, season: Season): number {
  if (season.flatMarkup != null) return basePrice + season.flatMarkup;
  if (season.priceMultiplier != null) return Math.round((basePrice * season.priceMultiplier) / 100);
  return basePrice;
}

/**
 * Returns the standard (base) price and the highest price across all active seasons.
 * When there are no active seasons, peakPrice equals basePrice (caller can choose to
 * hide the "Peak Season" card in that case).
 */
export function computeSeasonalPricing(basePrice: number, seasons: Season[]) {
  const activeSeasons = seasons.filter((s) => s.isActive);
  const peakPrice = activeSeasons.reduce(
    (max, season) => Math.max(max, applySeason(basePrice, season)),
    basePrice
  );

  return {
    standardPrice: basePrice,
    peakPrice,
    hasPeakSeason: peakPrice > basePrice,
  };
}
