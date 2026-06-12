import CategoryGroupPage from "@/components/category-group-page";
import { useSEO } from "@/hooks/use-seo";

export default function AdventureTours() {
  useSEO({
    title: "Egypt Day Tours - Private Guided Experiences",
    description: "Explore Egypt with private guided day tours. Cairo, Luxor, Aswan, and beyond with expert Egyptologist guides.",
  });

  return (
    <CategoryGroupPage
      group="day-tours"
      title="Day Tours"
      description="Shorter escapes built for flexible schedules, guided by local experts and tailored to your pace."
      basePath="/egypt-day-tours"
    />
  );
}
