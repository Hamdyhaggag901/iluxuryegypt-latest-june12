import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Hotel } from "@shared/schema";

export default function WhereYouWillStaySection() {
  const { data } = useQuery<{ success: boolean; hotels: Hotel[] }>({
    queryKey: ["/api/hotels"],
    queryFn: async () => {
      const res = await fetch("/api/hotels");
      if (!res.ok) throw new Error("Failed to load hotels");
      return res.json();
    },
  });

  const hotels = (data?.hotels || [])
    .filter((h) => h.status === "published")
    .slice(0, 3);

  if (hotels.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-background" data-testid="where-you-will-stay-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-accent font-medium">
            Where You Will Stay
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-primary mt-4 mb-4">
            Hand-Selected for the Discerning Traveler
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Five-star properties chosen for their location, service, and character — not just a room to sleep in.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="group" data-testid={`card-stay-${hotel.slug}`}>
              <div className="aspect-[4/3] rounded-lg overflow-hidden mb-5 relative">
                <img
                  src={hotel.image}
                  alt={hotel.imageAlt || hotel.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                {hotel.isPartner && (
                  <div
                    className="absolute top-4 left-4 flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm"
                    data-testid={`badge-trusted-partner-${hotel.slug}`}
                  >
                    {hotel.partnerLogoUrl && (
                      <img
                        src={hotel.partnerLogoUrl}
                        alt={`${hotel.name} logo`}
                        className="h-4 max-w-[60px] w-auto object-contain shrink-0"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                    )}
                    <span className="text-primary text-[11px] font-semibold uppercase tracking-wide">
                      Trusted Partner
                    </span>
                  </div>
                )}
              </div>
              <span className="text-xs tracking-[0.2em] uppercase text-accent font-medium">
                {hotel.region}, Egypt
              </span>
              <h3 className="font-serif text-xl md:text-2xl font-bold text-primary mt-2 mb-4 leading-snug">
                {hotel.name}
              </h3>
              <Link href={`/hotel/${hotel.slug}`}>
                <Button
                  variant="outline"
                  className="border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
                  data-testid={`button-stay-view-details-${hotel.slug}`}
                >
                  View Details
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 md:mt-16">
          <Link
            href="/stay"
            className="inline-flex items-center gap-2 text-primary font-medium hover:text-accent transition-colors duration-300"
            data-testid="link-view-all-stays"
          >
            View All Stays
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
