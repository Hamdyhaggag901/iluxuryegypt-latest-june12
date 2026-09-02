import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import TripBuilderModal from "@/components/trip-builder-modal";
import islamicDistrictImg from "@assets/islamic-district-at-dawn_1757699232100.jpg";

const fallbackContent = {
  eyebrow: "Our Story",
  title: "Egypt, Curated for the Few",
  description:
    "iLuxury Egypt is a boutique private tour operator, not a booking platform. Every journey is shaped by a team on the ground who know Egypt personally — the right guide, the right hour at the Pyramids, the right table for dinner. We handle the details most operators overlook, so you experience Egypt exactly as it deserves to be seen.",
  image: islamicDistrictImg,
  buttonText: "Start Planning",
  isActive: true,
};

export default function OurStorySection() {
  const [isTripBuilderOpen, setIsTripBuilderOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["publicOurStorySection"],
    queryFn: async () => {
      const response = await fetch("/api/public/our-story-section");
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });

  const content = data?.section || fallbackContent;

  // Don't render if explicitly set to inactive
  if (data?.section && !content.isActive) {
    return null;
  }

  return (
    <section className="py-20 md:py-28 bg-background" data-testid="our-story-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-accent font-medium">
              {content.eyebrow}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-primary mt-4 mb-6 leading-tight">
              {content.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8">
              {content.description}
            </p>
            <Button
              onClick={() => setIsTripBuilderOpen(true)}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-6 text-base"
              data-testid="button-our-story-start-planning"
            >
              {content.buttonText}
            </Button>
          </div>

          <div>
            <div className="aspect-[4/3] rounded-lg overflow-hidden">
              <img
                src={content.image}
                alt="Historic Cairo at dawn — iLuxury Egypt"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>

      <TripBuilderModal open={isTripBuilderOpen} onOpenChange={setIsTripBuilderOpen} />
    </section>
  );
}
