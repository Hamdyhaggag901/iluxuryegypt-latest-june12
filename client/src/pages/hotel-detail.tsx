import { useRoute } from "wouter";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import ScrollToTopButton from "../components/scroll-to-top-button";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Quote,
  Calendar,
  Route as RouteIcon,
  Waves,
  Sparkles,
  Utensils,
  Wifi,
  Car,
  Shield,
  Dumbbell,
  Wind,
  Coffee,
  ParkingCircle,
  PawPrint,
  Star,
} from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Facility } from "@shared/schema";

function getFacilityIcon(iconName: string) {
  const className = "h-6 w-6 text-accent";
  const icons: Record<string, JSX.Element> = {
    pool: <Waves className={className} />,
    spa: <Sparkles className={className} />,
    dining: <Utensils className={className} />,
    wifi: <Wifi className={className} />,
    transfers: <Car className={className} />,
    concierge: <Shield className={className} />,
    gym: <Dumbbell className={className} />,
    ac: <Wind className={className} />,
    breakfast: <Coffee className={className} />,
    parking: <ParkingCircle className={className} />,
    pets: <PawPrint className={className} />,
  };
  return icons[iconName] || <Star className={className} />;
}

export default function HotelDetail() {
  const [match, params] = useRoute("/hotel/:slug");

  if (!match || !params?.slug) {
    return <div>Hotel not found</div>;
  }

  const { data: hotelResponse, isLoading, error } = useQuery({
    queryKey: ["/api/hotels", params.slug],
    queryFn: async () => {
      const response = await fetch(`/api/hotels/${params.slug}`);
      if (!response.ok) {
        throw new Error("Hotel not found");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading hotel details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !hotelResponse?.success) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-4xl font-serif font-bold text-primary mb-4">Hotel Not Found</h1>
            <p className="text-muted-foreground mb-8">The hotel you're looking for doesn't exist.</p>
            <Link href="/stay">
              <Button>Return to Hotels</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const hotel = hotelResponse.hotel;
  const facilities = (hotel.facilities || []) as Facility[];
  const gallery = (hotel.gallery || []) as string[];
  const hasCruiseDetails = Boolean(hotel.route || hotel.duration);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        {/* Hero — full-width image, hotel name overlaid, no buttons */}
        <section className="relative h-[60vh] md:h-[75vh] flex items-end overflow-hidden">
          <img
            src={hotel.image}
            alt={`${hotel.name} — ${hotel.location}, Egypt`}
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 md:pb-14 text-white">
            <div className="flex items-center gap-2 text-sm md:text-base text-white/80 mb-2">
              <MapPin className="w-4 h-4 text-accent" />
              <span>{hotel.location} · {hotel.type}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold">{hotel.name}</h1>

            {hasCruiseDetails && (
              <div className="flex flex-wrap gap-6 mt-4 text-sm md:text-base text-white/90">
                {hotel.route && (
                  <div className="flex items-center gap-2">
                    <RouteIcon className="w-4 h-4 text-accent" />
                    <span>{hotel.route}</span>
                  </div>
                )}
                {hotel.duration && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-accent" />
                    <span>{hotel.duration}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Article — free-form rich text */}
        {hotel.article && (
          <section className="py-14 md:py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div
                className="prose prose-xl max-w-none prose-primary"
                dangerouslySetInnerHTML={{ __html: hotel.article }}
              />
            </div>
          </section>
        )}

        {/* Facilities & Amenities */}
        {facilities.length > 0 && (
          <section className="py-14 md:py-20 bg-muted/40">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary mb-10 text-center">
                Facilities &amp; Amenities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {facilities.map((facility, index) => (
                  <div key={`${facility.label}-${index}`} className="flex flex-col items-center text-center gap-3">
                    <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center">
                      {getFacilityIcon(facility.icon)}
                    </div>
                    <span className="text-sm font-medium text-primary">{facility.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Gallery — horizontal scroll strip */}
        {gallery.length > 0 && (
          <section className="py-14 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary mb-8">Gallery</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 px-4 sm:px-6 lg:px-8 snap-x snap-mandatory">
              {gallery.map((image, index) => (
                <div
                  key={index}
                  className="relative shrink-0 w-[75vw] sm:w-[380px] h-64 sm:h-80 rounded-xl overflow-hidden shadow-lg snap-start"
                >
                  <img
                    src={image}
                    alt={`${hotel.name} — atmosphere photo ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Why We Chose This Hotel — full-width brand-color focal point */}
        {hotel.whyWeChoseQuote && (
          <section className="py-20 md:py-28 bg-primary">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <Quote className="w-8 h-8 text-accent mx-auto mb-6" />
              <p className="text-2xl md:text-4xl font-serif italic text-primary-foreground leading-relaxed">
                {hotel.whyWeChoseQuote}
              </p>
              <div className="w-16 h-px bg-accent mx-auto my-8" />
              <p className="text-sm tracking-[0.2em] uppercase text-primary-foreground/70">
                — iLuxury Egypt Team
              </p>
            </div>
          </section>
        )}

        {/* Call to Action */}
        <section className="py-14 md:py-20 bg-muted/40">
          <div className="max-w-3xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-primary mb-4">
              Discover More Luxury Accommodations
            </h2>
            <div className="w-16 h-px bg-accent mx-auto mb-8" />
            <Link href="/stay">
              <Button size="lg" data-testid="button-view-all-hotels">
                View All Hotels
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
