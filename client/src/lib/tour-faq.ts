import type { Tour, Hotel } from "@shared/schema";
import type { FaqItem } from "@/components/faq-section";

const CONTACT_FALLBACK = "Contact our travel specialists and we'll confirm the exact details for your dates.";

function joinNatural(items: string[]): string {
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

// Builds a small set of FAQ questions for a tour detail page, each answered
// only from data that already exists on the tour (and its linked hotels) —
// same "no invented answers" rule used for the hotel/package pages' FAQs:
// a question redirects to contacting a specialist rather than guessing when
// the underlying field is empty, and a question with no real angle at all
// (destinations) is left out entirely instead of forcing a weak answer.
export function buildTourFaqs(tour: Tour, hotels: Hotel[]): FaqItem[] {
  const faqs: FaqItem[] = [];

  faqs.push({
    question: "What's included in the price?",
    answer:
      tour.includes.length > 0
        ? `This journey includes ${joinNatural(tour.includes)}.`
        : CONTACT_FALLBACK,
  });

  const groupNote = tour.groupSize ? ` in a group of ${tour.groupSize}` : "";
  faqs.push({
    question: "How long is this tour?",
    answer: `This is a ${tour.duration} journey${groupNote}.`,
  });

  faqs.push({
    question: "Where will I stay?",
    answer:
      hotels.length > 0
        ? `You'll stay at hand-picked properties including ${joinNatural(hotels.map((h) => h.name))}.`
        : CONTACT_FALLBACK,
  });

  if (tour.destinations.length > 0) {
    faqs.push({
      question: "What destinations will I visit?",
      answer: `This journey takes you through ${joinNatural(tour.destinations)}.`,
    });
  }

  return faqs;
}
