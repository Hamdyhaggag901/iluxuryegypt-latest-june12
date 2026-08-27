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
import { getTourImageAlt } from "@/lib/seo-alt-text";

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
    <section className="py-12 md:py-24 bg-[#f8f6f3]">
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
                <Link href={`/${t.slug}`}>
                  <article className="bg-card border border-card-border rounded-lg overflow-hidden flex flex-col h-full group cursor-pointer hover:shadow-lg transition-shadow duration-300">
                    <div className="relative h-56 md:h-64 overflow-hidden">
                      <img
                        src={t.heroImage}
                        alt={getTourImageAlt(t)}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>

                    <div className="p-5 md:p-6 flex flex-col flex-grow">
                      <div className="flex flex-col gap-2 md:gap-3 flex-grow">
                        <span className="text-xs font-semibold text-accent tracking-[0.15em] uppercase">
                          {t.category}
                        </span>
                        <h3 className="font-serif text-base md:text-xl text-primary leading-tight group-hover:text-accent transition-colors">
                          {t.title}
                        </h3>
                        <p className="text-xs font-semibold text-accent tracking-[0.1em] uppercase">
                          {t.duration}
                        </p>
                      </div>

                      <hr className="border-t border-border my-4 md:my-6" />

                      <div className="flex justify-between items-end">
                        <div>
                          <span className="text-xs text-muted-foreground block mb-1">From</span>
                          <span className="font-serif text-base md:text-lg text-primary">
                            {t.currency === "USD" ? "$" : `${t.currency} `}
                            {t.price.toLocaleString()}
                          </span>
                        </div>
                        <span className="text-xs md:text-sm font-semibold text-primary group-hover:text-accent transition-colors">
                          View Journey
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
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
          <Link href="/egypt-tour-packages">
            <Button className="bg-primary hover:bg-primary/90 text-white px-6 md:px-8 py-4 md:py-6 text-sm md:text-base">
              View All Experiences
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
