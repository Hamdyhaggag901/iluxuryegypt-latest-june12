import { Link } from "wouter";
import { MapPin } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import type { Hotel } from "@shared/schema";
import { getHotelImageAlt } from "@/lib/seo-alt-text";
import { getResponsiveImageProps } from "@/lib/responsive-image";

export default function WhereYouWillStay({ hotels }: { hotels: Hotel[] }) {
  if (hotels.length === 0) return null;

  return (
    <section className="py-12 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8 md:mb-16">
          <div className="w-12 md:w-16 h-px bg-accent mx-auto mb-4 md:mb-6"></div>
          <span className="text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase text-accent">
            Where You Will Stay
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-light text-primary mt-3 md:mt-4">
            Curated for a Truly Exceptional Stay
          </h2>
        </div>

        <Carousel opts={{ align: "center", loop: hotels.length > 1 }} className="px-2 md:px-10">
          <CarouselContent>
            {hotels.map((hotel) => (
              <CarouselItem key={hotel.id} className="basis-[85%] sm:basis-[70%] md:basis-1/2 lg:basis-[45%]">
                <article className="bg-card border border-card-border rounded-xl overflow-hidden shadow-lg h-full flex flex-col">
                  <div className="relative h-64 md:h-80 overflow-hidden">
                    <img
                      {...getResponsiveImageProps(hotel.image)}
                      alt={getHotelImageAlt(hotel)}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5 md:p-6 flex flex-col flex-grow gap-3">
                    <div className="flex items-center gap-2 text-accent">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="text-xs md:text-sm tracking-[0.2em] uppercase">
                        {hotel.location}, Egypt
                      </span>
                    </div>
                    <h3 className="font-serif text-xl md:text-2xl text-primary leading-tight">
                      {hotel.name}
                    </h3>
                    <div className="mt-auto pt-2">
                      <Link href={`/hotel/${hotel.slug}`}>
                        <span className="block w-full text-center bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-md transition-colors cursor-pointer">
                          View Details
                        </span>
                      </Link>
                    </div>
                  </div>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
          {hotels.length > 1 && (
            <>
              <CarouselPrevious className="left-0 md:-left-2 border-primary/20 text-primary" />
              <CarouselNext className="right-0 md:-right-2 border-primary/20 text-primary" />
            </>
          )}
        </Carousel>
      </div>
    </section>
  );
}
