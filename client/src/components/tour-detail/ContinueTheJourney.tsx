import { Link } from "wouter";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import type { Tour } from "@shared/schema";
import TourCard from "@/components/tour-card";
import { openLinkInNewTab } from "@/lib/open-in-new-tab";

function similarityScore(current: Tour, candidate: Tour): number {
  let score = 0;
  if (candidate.category === current.category) score += 2;
  const currentDestinations = new Set(current.destinations);
  for (const destination of candidate.destinations) {
    if (currentDestinations.has(destination)) score += 1;
  }
  return score;
}

export default function ContinueTheJourney({
  currentTour,
  allTours,
}: {
  currentTour: Tour;
  allTours: Tour[];
}) {
  const relatedTours = allTours
    .filter((t) => t.id !== currentTour.id)
    .map((t) => ({ tour: t, score: similarityScore(currentTour, t) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((entry) => entry.tour);

  if (relatedTours.length === 0) return null;

  return (
    <section id="continue-journey" className="py-12 md:py-24 bg-[#f8f6f3]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8 md:mb-16">
          <div className="w-12 md:w-16 h-px bg-accent mx-auto mb-4 md:mb-6"></div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-light text-primary mb-2 md:mb-4">
            Continue the Journey
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">More experiences you might love</p>
        </div>

        <Carousel opts={{ align: "start", loop: false }} className="px-2 md:px-10">
          <CarouselContent>
            {relatedTours.map((t) => (
              <CarouselItem key={t.id} className="basis-[85%] sm:basis-[60%] md:basis-1/3">
                <TourCard
                  image={t.heroImage}
                  category={t.category}
                  title={t.title}
                  days={t.duration}
                  guests={t.groupSize || undefined}
                  itinerary={t.destinations}
                  price={t.price}
                  currency={t.currency}
                  link={`/${t.slug}`}
                  openInNewTab
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          {relatedTours.length > 1 && (
            <>
              <CarouselPrevious className="left-0 md:-left-2 border-primary/20 text-primary" />
              <CarouselNext className="right-0 md:-right-2 border-primary/20 text-primary" />
            </>
          )}
        </Carousel>

        <div className="text-center mt-8 md:mt-12">
          <Link href="/egypt-tour-packages" target="_blank" rel="noopener noreferrer" onClick={openLinkInNewTab}>
            <Button className="bg-primary hover:bg-primary/90 text-white px-6 md:px-8 py-4 md:py-6 text-sm md:text-base">
              View All Experiences
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
