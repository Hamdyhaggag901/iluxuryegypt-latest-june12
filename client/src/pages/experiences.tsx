import CategoryGroupPage from "@/components/category-group-page";
import { useSEO } from "@/hooks/use-seo";

export default function Experiences() {
  useSEO({
    title: "Luxury Egypt Tour Packages",
    description: "Curated multi-day luxury journeys through Egypt. Private guides, five-star hotels, and iconic Egyptian experiences.",
  });

  return (
    <CategoryGroupPage
      group="packages"
      title="Packages"
      description="Curated multi-day journeys that blend luxury stays, private guides, and iconic Egyptian sites."
      basePath="/egypt-tour-packages"
    />
  );
}
