import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import type { Tour } from "@shared/schema";
import { getTourImageAlt } from "@/lib/seo-alt-text";
import { getResponsiveImageProps } from "@/lib/responsive-image";

export default function CtaBanner({ tour, onReserve }: { tour: Tour; onReserve: () => void }) {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0">
        <img
          {...getResponsiveImageProps(tour.heroImage)}
          alt={getTourImageAlt(tour)}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        <div className="w-16 h-px bg-accent mx-auto mb-6"></div>
        <h2 className="text-3xl md:text-5xl font-serif font-light text-white mb-4">
          Ready to Begin Your Journey?
        </h2>
        <p className="text-base md:text-lg text-white/80 mb-8 md:mb-10">
          Let our travel experts turn this itinerary into your own bespoke Egyptian story.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={onReserve}
            className="bg-accent hover:bg-accent/90 text-primary font-semibold px-8 py-6 text-base w-full sm:w-auto"
            data-testid="button-reserve-journey"
          >
            Reserve This Journey
          </Button>
          <Link href="/tailor-made" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10 hover:text-white px-8 py-6 text-base w-full"
              data-testid="button-design-egypt-story"
            >
              Design My Egypt Story
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
