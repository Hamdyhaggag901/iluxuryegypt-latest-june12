import type { Hotel } from "@shared/schema";
import { getHotelImageAlt } from "@/lib/seo-alt-text";
import HotelStayCard from "./HotelStayCard";

export default function WhereYouWillStay({ hotels }: { hotels: Hotel[] }) {
  if (hotels.length === 0) return null;

  return (
    <section className="py-12 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8 md:mb-16">
          <div className="w-12 md:w-16 h-px bg-accent mx-auto mb-4 md:mb-6"></div>
          <span className="text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase text-accent">
            Your Accommodations
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-light text-primary mt-3 md:mt-4">
            Handpicked Stays for an Extraordinary Journey
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <HotelStayCard
              key={hotel.id}
              image={hotel.image}
              imageAlt={getHotelImageAlt(hotel)}
              location={`${hotel.location}, Egypt`}
              name={hotel.name}
              badge={hotel.featured ? "Featured" : undefined}
              link={`/hotel/${hotel.slug}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
