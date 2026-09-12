import CategoryGroupPage, { GROUP_FAQS } from "@/components/category-group-page";
import { buildFaqJsonLd } from "@/components/faq-section";
import { useSEO } from "@/hooks/use-seo";

export default function Experiences() {
  // Single useSEO call for this page on purpose: the hook clears every
  // [data-seo-jsonld] script before writing its own, so a second call inside
  // CategoryGroupPage would wipe whichever block lost the race.
  useSEO({
    title: "Luxury Egypt Tour Packages | Private Journeys",
    description:
      "Explore our luxury Egypt tour packages, private journeys with expert Egyptologists, five-star stays, and itineraries built entirely around you.",
    jsonLd: buildFaqJsonLd(GROUP_FAQS.packages || []),
  });

  return (
    <CategoryGroupPage
      group="packages"
      title="Luxury Egypt Tour Packages"
      description="Explore our luxury Egypt tour packages, private journeys with expert Egyptologists, five-star stays, and itineraries built entirely around you."
      basePath="/luxury-egypt-tour-packages"
    />
  );
}
