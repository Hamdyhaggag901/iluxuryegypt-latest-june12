import type { Season } from "@shared/schema";

export type MonthPricing = {
  month: number; // 1-12
  price: number;
  season: Season | null; // null = standard (no season covers this month)
};

/**
 * Ordinal used only to compare month/day pairs chronologically within a
 * conceptual (non-leap-aware) year. Not a real day-of-year count — just
 * needs to preserve ordering for comparison/overlap purposes.
 */
function monthDayOrdinal(month: number, day: number): number {
  return month * 31 + day;
}

/** Applies one season's rule to a base price. */
function applySeason(basePrice: number, season: Season): number {
  if (season.flatMarkup != null) return basePrice + season.flatMarkup;
  if (season.priceMultiplier != null) return Math.round((basePrice * season.priceMultiplier) / 100);
  return basePrice;
}

/** Whether a season's date range overlaps the given calendar month at all. */
function seasonCoversMonth(season: Season, month: number): boolean {
  const start = monthDayOrdinal(season.startMonth, season.startDay);
  const end = monthDayOrdinal(season.endMonth, season.endDay);
  const monthStart = monthDayOrdinal(month, 1);
  const monthEnd = monthDayOrdinal(month, 31);

  if (start <= end) {
    return start <= monthEnd && end >= monthStart;
  }
  // Wraps around the year end (e.g. Dec 15 -> Jan 10)
  const yearEnd = monthDayOrdinal(12, 31);
  const yearStart = monthDayOrdinal(1, 1);
  return (start <= monthEnd && yearEnd >= monthStart) || (yearStart <= monthEnd && end >= monthStart);
}

/**
 * Computes the price for every month of the year. When multiple active
 * seasons cover the same month, the one yielding the highest price wins.
 */
export function getMonthlyPricing(basePrice: number, seasons: Season[]): MonthPricing[] {
  const activeSeasons = seasons.filter((s) => s.isActive);

  return Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const covering = activeSeasons.filter((s) => seasonCoversMonth(s, month));

    if (covering.length === 0) {
      return { month, price: basePrice, season: null };
    }

    const best = covering.reduce((max, s) =>
      applySeason(basePrice, s) > applySeason(basePrice, max) ? s : max
    );

    return { month, price: applySeason(basePrice, best), season: best };
  });
}

function isDateWithinSeason(season: Season, date: Date): boolean {
  const ordinal = monthDayOrdinal(date.getMonth() + 1, date.getDate());
  const start = monthDayOrdinal(season.startMonth, season.startDay);
  const end = monthDayOrdinal(season.endMonth, season.endDay);
  return start <= end ? ordinal >= start && ordinal <= end : ordinal >= start || ordinal <= end;
}

/** Days from `today` until the next occurrence of a season's start date (0 if today is the start date). */
function daysUntilNextStart(season: Season, today: Date): number {
  const candidate = new Date(today.getFullYear(), season.startMonth - 1, season.startDay);
  candidate.setHours(0, 0, 0, 0);
  const todayMidnight = new Date(today);
  todayMidnight.setHours(0, 0, 0, 0);

  if (candidate < todayMidnight) {
    candidate.setFullYear(candidate.getFullYear() + 1);
  }
  return Math.round((candidate.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Picks the month the "Dates & Prices" strip should open on:
 * 1. If a season is active right now, show that (today's) month — no reason
 *    to skip ahead when there's already a live opportunity.
 * 2. Otherwise, the soonest upcoming season's start month (wraps into next
 *    year automatically via daysUntilNextStart).
 * 3. No active seasons at all -> just today's month.
 */
export function getDefaultMonth(seasons: Season[], today: Date = new Date()): number {
  const activeSeasons = seasons.filter((s) => s.isActive);
  if (activeSeasons.length === 0) return today.getMonth() + 1;

  const currentlyActive = activeSeasons.find((s) => isDateWithinSeason(s, today));
  if (currentlyActive) return today.getMonth() + 1;

  const soonest = activeSeasons.reduce((closest, s) =>
    daysUntilNextStart(s, today) < daysUntilNextStart(closest, today) ? s : closest
  );
  return soonest.startMonth;
}
