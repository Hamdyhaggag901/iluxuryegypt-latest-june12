// Generates 4-6 "Why You'll Love This Journey" highlight points purely from
// data that already exists on the tour — its own fields, its itinerary, and
// the real hotels linked via hotelIds. No per-tour field an admin has to
// fill in separately. Conceptually the same idea as server/seo-meta.ts's
// buildTourUniquenessSignals (derive marketing signal from linked-hotel
// data), but this produces richer narrative copy for on-page display rather
// than terse structured-data strings, so it's kept as its own function.

import type { Hotel, ItineraryDay } from "@shared/schema";

export interface TourHighlight {
  title: string;
  body: string;
  icon: "stay" | "cruise" | "duration" | "activity" | "destinations" | "guide" | "concierge";
  image?: string;
}

interface HighlightTour {
  title: string;
  duration: string;
  durationDays?: number | null;
  destinations: string[];
  itinerary: unknown;
}

const NOTABLE_ACTIVITY_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /hot air balloon/i, label: "a sunrise hot air balloon flight over {place}" },
  { pattern: /felucca/i, label: "a private felucca sail on the Nile at {place}" },
  { pattern: /private (dinner|lunch)/i, label: "a private dining experience in {place}" },
  { pattern: /sunset/i, label: "a sunset moment you won't find on a group itinerary, in {place}" },
  { pattern: /camel/i, label: "a camel ride at {place}" },
  { pattern: /desert/i, label: "time in the desert around {place}" },
  { pattern: /snorkel|diving|dive/i, label: "time in the Red Sea's reefs near {place}" },
];

const EVERGREEN_HIGHLIGHTS: TourHighlight[] = [
  {
    title: "A Private Egyptologist at Every Site",
    body: "A private, professionally trained Egyptologist accompanies you throughout — no shared coach, no megaphone, no rushing to keep up with a group.",
    icon: "guide",
  },
  {
    title: "24/7 Concierge on the Ground",
    body: "A dedicated concierge based in Egypt is reachable around the clock for the length of your trip, for anything from a restaurant table to a change of plans.",
    icon: "concierge",
  },
];

export function buildTourHighlights(tour: HighlightTour, hotels: Hotel[]): TourHighlight[] {
  const highlights: TourHighlight[] = [];
  const days: ItineraryDay[] = Array.isArray(tour.itinerary) ? (tour.itinerary as ItineraryDay[]) : [];

  const signatureHotel = hotels.find((h) => h.featured || h.rating === 5);
  if (signatureHotel) {
    highlights.push({
      title: "Nights That Match the Days",
      body: `Stay at ${signatureHotel.name}${signatureHotel.location ? `, ${signatureHotel.location}` : ""} — one of our hand-picked five-star properties, chosen so your evenings live up to what you saw that day.`,
      icon: "stay",
      image: signatureHotel.image,
    });
  }

  const cruiseHotel = hotels.find((h) => h.route && h.duration);
  if (cruiseHotel) {
    highlights.push({
      title: "A Private Nile Cruise",
      body: `Sail ${cruiseHotel.route} (${cruiseHotel.duration}) aboard ${cruiseHotel.name} — waking up to a new stretch of the Nile each morning instead of another transfer.`,
      icon: "cruise",
      image: cruiseHotel.image,
    });
  }

  const notableActivityDay = days.find((day) => {
    const text = `${day.title || ""} ${day.description || ""} ${(day.activities || []).join(" ")}`;
    return NOTABLE_ACTIVITY_PATTERNS.some(({ pattern }) => pattern.test(text));
  });

  if (notableActivityDay) {
    const text = `${notableActivityDay.title || ""} ${notableActivityDay.description || ""} ${(notableActivityDay.activities || []).join(" ")}`;
    const match = NOTABLE_ACTIVITY_PATTERNS.find(({ pattern }) => pattern.test(text))!;
    const place = notableActivityDay.placeName?.trim() || notableActivityDay.title?.trim() || "your journey";
    highlights.push({
      title: "A Moment That's Actually Yours",
      body: `Your itinerary includes ${match.label.replace("{place}", place)} — the kind of moment that's hard to book once you're already there.`,
      icon: "activity",
      image: notableActivityDay.image,
    });
  }

  if (tour.destinations.length >= 3) {
    highlights.push({
      title: "One Trip, All of Egypt",
      body: `A single journey spanning ${tour.destinations.join(" → ")}, each stop with its own guide and pace rather than a single itinerary stretched too thin.`,
      icon: "destinations",
    });
  } else {
    const dayCount = tour.durationDays ?? days.length;
    if (dayCount >= 7) {
      highlights.push({
        title: "Time to Actually Be There",
        body: `${dayCount} days is enough to see ${tour.destinations[0] || "Egypt"} properly — with room to slow down, not just check sites off a list.`,
        icon: "duration",
      });
    }
  }

  const withEvergreen = [...highlights];
  for (const evergreen of EVERGREEN_HIGHLIGHTS) {
    if (withEvergreen.length >= 6) break;
    withEvergreen.push(evergreen);
  }

  // Guarantee at least 4 points even if a tour has thin data — evergreen
  // highlights are safe to repeat pulling from since they're never
  // tour-specific claims.
  let i = 0;
  while (withEvergreen.length < 4 && i < EVERGREEN_HIGHLIGHTS.length) {
    if (!withEvergreen.includes(EVERGREEN_HIGHLIGHTS[i])) withEvergreen.push(EVERGREEN_HIGHLIGHTS[i]);
    i++;
  }

  return withEvergreen.slice(0, 6);
}
