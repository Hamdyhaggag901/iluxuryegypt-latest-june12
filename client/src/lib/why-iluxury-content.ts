// Builds the "Why iLuxury Egypt" section's 6 strength cards for a given
// tour: hybrid copy (a fixed template per box, with a real tour detail —
// hotel name, group size, destinations — injected where the data exists,
// falling back to the original generic line otherwise) and a real image
// per box, picked from the tour's own itinerary/hotel/gallery photos by
// rough content category. Every box always resolves to a real photo (a
// curated static fallback per category) so none is ever left with an
// empty placeholder circle.

import type { Tour, Hotel, ItineraryDay } from "@shared/schema";
import luxuryHallImage from "@assets/elegant-hall_1757459228629.jpeg";
import suiteNileImage from "@assets/suite-nile_1757457083796.jpg";
import sunsetFeluccaImage from "@assets/sunset-felucca_1757456567256.jpg";
import khanKhaliliImage from "@assets/khan-khalili-restaurant_1757459228636.jpeg";
import columnHallImage from "@assets/inside-the-column-hall_1757699232094.jpg";
import poolsideImage from "@assets/pool-and-rivet_1757457083793.jpg";
import pyramidLobbyImage from "@assets/pyramid-from-lobby_1757459228637.jpeg";

export interface WhyILuxuryStrength {
  title: string;
  body: string;
  image: string;
}

export interface WhyILuxuryContent {
  heroImage: string;
  strengths: WhyILuxuryStrength[];
}

type ContentTour = Pick<Tour, "gallery" | "itinerary" | "destinations" | "groupSize">;

const LANDMARK_PATTERN =
  /pyramid|sphinx|temple|karnak|abu simbel|philae|valley of the kings|citadel|museum|tomb|obelisk|monastery/i;
const EXPERIENCE_PATTERN = /felucca|nile cruise|sail|dahabiya|balloon|camel|desert|snorkel|dive|kayak/i;
const LOCAL_PATTERN = /bazaar|khan el-khalili|khan khalili|market|souk|old town|neighbo(u)?rhood|village/i;
const SERVICE_PATTERN = /welcome|arrival|check-in|concierge|spa|butler|transfer|dinner|lunch/i;

function findDayImage(days: ItineraryDay[], pattern: RegExp, used: Set<string>): string | undefined {
  for (const day of days) {
    if (!day.image || used.has(day.image)) continue;
    const text = `${day.title || ""} ${day.description || ""} ${(day.activities || []).join(" ")}`;
    if (pattern.test(text)) return day.image;
  }
  return undefined;
}

function claim(used: Set<string>, url: string | undefined | null): string | undefined {
  if (!url || used.has(url)) return undefined;
  used.add(url);
  return url;
}

function joinDestinations(destinations: string[]): string {
  if (destinations.length === 0) return "Cairo, Luxor, and Aswan";
  if (destinations.length === 1) return destinations[0];
  if (destinations.length === 2) return `${destinations[0]} and ${destinations[1]}`;
  return `${destinations.slice(0, -1).join(", ")}, and ${destinations[destinations.length - 1]}`;
}

export function getWhyILuxuryContent(tour: ContentTour | undefined, hotels: Hotel[]): WhyILuxuryContent {
  const days: ItineraryDay[] = Array.isArray(tour?.itinerary) ? (tour!.itinerary as ItineraryDay[]) : [];
  const gallery = tour?.gallery ?? [];
  const signatureHotel = hotels.find((h) => h.featured) ?? hotels[0];
  const used = new Set<string>();

  const heroImage =
    claim(used, gallery[0]) ?? claim(used, findDayImage(days, LANDMARK_PATTERN, used)) ?? luxuryHallImage;

  const landmarkImage = claim(used, findDayImage(days, LANDMARK_PATTERN, used)) ?? columnHallImage;
  const experienceImage = claim(used, findDayImage(days, EXPERIENCE_PATTERN, used)) ?? sunsetFeluccaImage;
  const hotelImage = claim(used, signatureHotel?.image) ?? suiteNileImage;
  const serviceImage = claim(used, findDayImage(days, SERVICE_PATTERN, used)) ?? poolsideImage;
  const localImage = claim(used, findDayImage(days, LOCAL_PATTERN, used)) ?? khanKhaliliImage;
  const generalImage = claim(used, gallery[1]) ?? claim(used, gallery[0]) ?? pyramidLobbyImage;

  const hotelText = signatureHotel
    ? `We personally vet every property on your itinerary — from ${signatureHotel.name} to boutique dahabiyas on the river — so each night matches the standard of the day before it.`
    : "We personally vet every property on your itinerary — from Nile-view suites in Cairo to boutique dahabiyas on the river — so each night matches the standard of the day before it.";

  const groupText = tour?.groupSize
    ? `Group size on this journey: ${tour.groupSize} — small enough that a temple visit feels like a discovery, not a queue.`
    : "Most of our departures are private or limited to a handful of travelers, so a temple visit feels like a discovery, not a queue.";

  const destinations = tour?.destinations ?? [];
  const localText =
    destinations.length > 0
      ? `Two decades of relationships across ${joinDestinations(destinations)} mean access most operators simply don't have: early museum entry, private felucca sunsets, tables at restaurants without a sign.`
      : "Two decades of relationships across Cairo, Luxor, and Aswan mean access most operators simply don't have: early museum entry, private felucca sunsets, tables at restaurants without a sign.";

  return {
    heroImage,
    strengths: [
      {
        title: "Private Egyptologist Guides",
        body: "Every journey is led by a private, professionally trained Egyptologist — not a shared coach tour with a megaphone. You set the pace; they bring 5,000 years of history to life.",
        image: landmarkImage,
      },
      {
        title: "Small, Intimate Groups",
        body: groupText,
        image: experienceImage,
      },
      {
        title: "Hand-Picked Luxury Hotels",
        body: hotelText,
        image: hotelImage,
      },
      {
        title: "24/7 Personal Concierge",
        body: "A dedicated concierge is reachable around the clock throughout your trip, on the ground in Egypt — not a call center reading from a script.",
        image: serviceImage,
      },
      {
        title: "Deep Local Expertise",
        body: localText,
        image: localImage,
      },
      {
        title: "Bespoke, Not Templated",
        body: "Every private Nile cruise and boutique Egypt travel itinerary we build starts from a conversation with you, not a brochure.",
        image: generalImage,
      },
    ],
  };
}
