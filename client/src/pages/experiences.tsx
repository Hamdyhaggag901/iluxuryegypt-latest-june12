import CategoryGroupPage from "@/components/category-group-page";
import { useSEO } from "@/hooks/use-seo";

export default function Experiences() {
  useSEO({
    title: "Luxury Egypt Tour Packages | Private Journeys",
    description:
      "Explore our luxury Egypt tour packages, private journeys with expert Egyptologists, five-star stays, and itineraries built entirely around you.",
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
