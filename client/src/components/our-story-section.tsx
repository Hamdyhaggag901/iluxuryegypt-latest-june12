import { useState } from "react";
import { Button } from "@/components/ui/button";
import TripBuilderModal from "@/components/trip-builder-modal";
import islamicDistrictImg from "@assets/islamic-district-at-dawn_1757699232100.jpg";

export default function OurStorySection() {
  const [isTripBuilderOpen, setIsTripBuilderOpen] = useState(false);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden" data-testid="our-story-section">
      <div className="absolute inset-0">
        <img
          src={islamicDistrictImg}
          alt="Historic Cairo at dawn — iLuxury Egypt"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/85 to-primary/70" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-accent font-medium">
          Our Story
        </span>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-primary-foreground mt-4 mb-8 leading-tight">
          Egypt, Curated for the Few
        </h2>
        <p className="text-base md:text-lg text-primary-foreground/85 leading-relaxed mb-10 max-w-2xl mx-auto">
          iLuxury Egypt is a boutique private tour operator, not a booking platform. Every journey is
          shaped by a team on the ground who know Egypt personally — the right guide, the right hour
          at the Pyramids, the right table for dinner. We handle the details most operators overlook,
          so you experience Egypt exactly as it deserves to be seen.
        </p>
        <Button
          onClick={() => setIsTripBuilderOpen(true)}
          className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-6 text-base"
          data-testid="button-our-story-start-planning"
        >
          Start Planning
        </Button>
      </div>

      <TripBuilderModal open={isTripBuilderOpen} onOpenChange={setIsTripBuilderOpen} />
    </section>
  );
}
