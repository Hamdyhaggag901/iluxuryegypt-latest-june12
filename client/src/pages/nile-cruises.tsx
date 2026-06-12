import CategoryGroupPage from "@/components/category-group-page";
import { useSEO } from "@/hooks/use-seo";

export default function NileCruises() {
  useSEO({
    title: "Luxury Nile Cruise Tours in Egypt",
    description: "Sail Egypt's eternal river aboard boutique vessels. Private balconies, gourmet cuisine, and curated shore excursions.",
  });

  return (
    <CategoryGroupPage
      group="nile-cruise"
      title="Nile Cruises"
      description="Sail in style on handpicked vessels with curated itineraries from Luxor to Aswan."
      basePath="/egypt-nile-cruise-tours"
    />
  );
}
