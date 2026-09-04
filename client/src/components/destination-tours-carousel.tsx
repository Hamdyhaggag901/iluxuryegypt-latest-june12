import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import TourCard from "@/components/tour-card";
import type { Tour } from "@shared/schema";

interface DestinationToursCarouselProps {
  tours: Tour[];
  eyebrow: string;
  title: string;
}

export default function DestinationToursCarousel({ tours, eyebrow, title }: DestinationToursCarouselProps) {
  if (tours.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-background" data-testid="destination-tours-carousel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Carousel opts={{ align: "start", loop: false }} className="w-full">
          <div className="flex items-end justify-between mb-8 md:mb-12">
            <div>
              <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-accent font-medium">
                {eyebrow}
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mt-4">
                {title}
              </h2>
              <div className="w-16 h-px bg-accent mt-4 md:mt-5" />
            </div>
            <div className="hidden sm:flex items-center gap-3 shrink-0">
              <CarouselPrevious
                className="static translate-y-0 h-10 w-10 border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
                data-testid="button-destination-tours-prev"
              />
              <CarouselNext
                className="static translate-y-0 h-10 w-10 border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
                data-testid="button-destination-tours-next"
              />
            </div>
          </div>

          <CarouselContent>
            {tours.map((tour) => (
              <CarouselItem key={tour.id} className="basis-[85%] sm:basis-[55%] md:basis-1/3">
                <TourCard
                  image={tour.heroImage}
                  category={tour.category}
                  title={tour.title}
                  days={tour.duration}
                  guests={tour.groupSize || undefined}
                  itinerary={tour.destinations}
                  price={tour.price}
                  currency={tour.currency}
                  link={`/${tour.slug}`}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
