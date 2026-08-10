import Navigation from "../components/navigation";
import { useSEO } from "@/hooks/use-seo";
import Footer from "../components/footer";
import ScrollToTopButton from "../components/scroll-to-top-button";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Quote,
  Utensils,
  Waves,
  Sparkles,
  Shield,
  Car,
  Wifi,
  Star,
} from "lucide-react";
import { Link } from "wouter";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Hotel } from "@shared/schema";
import { getResponsiveImageProps } from "@/lib/responsive-image";

const INITIAL_VISIBLE_COUNT = 12;

const DEFAULT_TYPE_CHIPS = ["Nile-view", "Historic palace", "Desert resort", "Nile cruise"];
const DEFAULT_CITY_CHIPS = ["Cairo", "Luxor", "Aswan", "Red Sea"];

const DEFAULT_WHY_BOOK_POINTS = [
  {
    icon: "shield",
    title: "Concierge Service",
    description: "24/7 dedicated concierge to arrange tours, dining, and every detail of your stay.",
  },
  {
    icon: "star",
    title: "Exclusive Access",
    description: "Private entrances and VIP experiences at properties unavailable to regular guests.",
  },
  {
    icon: "sparkles",
    title: "Personally Vetted",
    description: "Every property is visited and approved by our team before it joins the collection.",
  },
];

// Matches a chip label against a hotel field loosely in both directions, so
// admin-managed chip wording ("Nile cruise") still matches shorter existing
// data values ("Cruise") without requiring the two vocabularies to be identical.
function chipMatches(chip: string, value: string | undefined | null): boolean {
  if (!value) return false;
  const a = chip.toLowerCase().trim();
  const b = value.toLowerCase().trim();
  return a === b || a.includes(b) || b.includes(a);
}

function getFeatureIcon(iconName: string) {
  const className = "h-6 w-6 text-accent";
  const icons: Record<string, JSX.Element> = {
    star: <Star className={className} />,
    waves: <Waves className={className} />,
    sparkles: <Sparkles className={className} />,
    shield: <Shield className={className} />,
    utensils: <Utensils className={className} />,
    car: <Car className={className} />,
    wifi: <Wifi className={className} />,
  };
  return icons[iconName] || <Star className={className} />;
}

function FeaturedStayCard({ hotel }: { hotel: Hotel }) {
  const tags = (hotel.highlights || []).slice(0, 4);

  return (
    <Card className="overflow-hidden border-0 shadow-2xl" data-testid={`featured-stay-${hotel.id}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative h-72 lg:h-full min-h-[360px]">
          <img
            {...getResponsiveImageProps(hotel.image)}
            alt={`${hotel.name} — ${hotel.location}, Egypt`}
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
          <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">Featured Stay</Badge>
        </div>

        <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
          <p className="text-sm font-medium text-muted-foreground mb-3" data-testid="featured-stay-plaque">
            {hotel.location} · {hotel.type}
          </p>

          <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary mb-4">{hotel.name}</h2>

          {hotel.whyWeChoseQuote && (
            <div className="flex gap-3 mb-5 pl-4 border-l-2 border-accent">
              <Quote className="h-5 w-5 text-accent shrink-0 mt-1" />
              <p className="text-lg italic font-serif text-primary/90 leading-relaxed">{hotel.whyWeChoseQuote}</p>
            </div>
          )}

          <p className="text-muted-foreground leading-relaxed mb-5">{hotel.description}</p>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-accent/10 text-accent-text border-0">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <Link href={`/hotel/${hotel.slug}`}>
            <Button size="lg" className="w-fit" data-testid={`button-view-hotel-${hotel.slug}`}>
              View Hotel
            </Button>
          </Link>
        </CardContent>
      </div>
    </Card>
  );
}

function StayGridCard({ hotel }: { hotel: Hotel }) {
  const tags = (hotel.highlights || []).slice(0, 3);

  return (
    <Card
      className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      data-testid={`hotel-card-${hotel.id}`}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={hotel.image}
          alt={`${hotel.name} — ${hotel.location}, Egypt`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-md px-2 py-1 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs font-medium text-primary">{hotel.location}</span>
        </div>
      </div>

      <CardContent className="p-5">
        <h3 className="font-serif font-bold text-lg text-primary mb-1 leading-tight">{hotel.name}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{hotel.description}</p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs bg-accent/10 text-accent-text border-0">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <Link href={`/hotel/${hotel.slug}`}>
          <Button variant="outline" size="sm" className="w-full" data-testid={`button-view-hotel-${hotel.slug}`}>
            View Hotel
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default function Stay() {
  useSEO({
    title: "Luxury Hotels & Stays in Egypt",
    description:
      "Discover Egypt's finest luxury hotels and boutique accommodations. Handpicked stays from Nile-side palaces to Red Sea resorts.",
  });

  const [selectedType, setSelectedType] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  const { data: hotelsResponse } = useQuery({
    queryKey: ["/api/hotels"],
    queryFn: async () => {
      const response = await fetch("/api/hotels");
      if (!response.ok) throw new Error("Failed to fetch hotels");
      return response.json();
    },
  });

  const { data: stayPageData } = useQuery({
    queryKey: ["/api/public/stay-page"],
    queryFn: async () => {
      const response = await fetch("/api/public/stay-page");
      if (!response.ok) throw new Error("Failed to fetch stay page content");
      return response.json();
    },
  });

  const publishedHotels: Hotel[] = useMemo(
    () => (hotelsResponse?.hotels || []).filter((hotel: Hotel) => hotel.status !== "draft"),
    [hotelsResponse],
  );

  const featuredHotel: Hotel | undefined = stayPageData?.featuredHotel;
  const listingSettings = stayPageData?.listingSettings;

  const typeChips: string[] = listingSettings?.typeChips?.length ? listingSettings.typeChips : DEFAULT_TYPE_CHIPS;
  const cityChips: string[] = listingSettings?.cityChips?.length ? listingSettings.cityChips : DEFAULT_CITY_CHIPS;

  const whyBookPoints = stayPageData?.luxuryFeatures?.length ? stayPageData.luxuryFeatures : DEFAULT_WHY_BOOK_POINTS;

  // Reset how many cards are revealed whenever the active filters change.
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }, [selectedType, selectedCity]);

  const gridHotels = useMemo(() => {
    return publishedHotels
      .filter((hotel) => !featuredHotel || hotel.id !== featuredHotel.id)
      .filter((hotel) => selectedType === "all" || chipMatches(selectedType, hotel.type))
      .filter(
        (hotel) =>
          selectedCity === "all" || chipMatches(selectedCity, hotel.region) || chipMatches(selectedCity, hotel.location),
      );
  }, [publishedHotels, featuredHotel, selectedType, selectedCity]);

  const visibleHotels = gridHotels.slice(0, visibleCount);
  const hasMore = visibleCount < gridHotels.length;

  const eyebrow = listingSettings?.eyebrow || "The Collection";
  const title = listingSettings?.title || "Where You'll Stay in Egypt";
  const description =
    listingSettings?.description ||
    "A handpicked portfolio of Egypt's finest hotels, historic palaces, and Nile cruises — every property personally vetted by our team.";

  const cta = stayPageData?.cta || {
    title: "Can't decide? Let us choose for you.",
    subtitle: "Tell us what you're after and our specialists will match you to the right property.",
    primaryButtonText: "Speak with a Specialist",
    primaryButtonLink: "/contact",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-28 md:pt-32">
        {/* Header / Intro */}
        <section className="py-10 md:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="tracking-[0.2em] uppercase text-accent-text text-sm font-medium mb-3">{eyebrow}</p>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-primary mb-4">{title}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">{description}</p>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="pb-10 md:pb-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="flex flex-wrap items-center justify-center gap-2" data-testid="filter-type-chips">
              <ChipButton label="All" active={selectedType === "all"} onClick={() => setSelectedType("all")} testId="chip-type-all" />
              {typeChips.map((chip) => (
                <ChipButton
                  key={chip}
                  label={chip}
                  active={selectedType === chip}
                  onClick={() => setSelectedType(chip)}
                  testId={`chip-type-${chip.toLowerCase().replace(/\s+/g, "-")}`}
                />
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2" data-testid="filter-city-chips">
              <ChipButton label="All Cities" active={selectedCity === "all"} onClick={() => setSelectedCity("all")} testId="chip-city-all" />
              {cityChips.map((chip) => (
                <ChipButton
                  key={chip}
                  label={chip}
                  active={selectedCity === chip}
                  onClick={() => setSelectedCity(chip)}
                  testId={`chip-city-${chip.toLowerCase().replace(/\s+/g, "-")}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Stay */}
        {featuredHotel && (
          <section className="pb-16 md:pb-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <FeaturedStayCard hotel={featuredHotel} />
            </div>
          </section>
        )}

        {/* All Stays Grid */}
        <section className="pb-20 md:pb-24 bg-muted/40 py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {gridHotels.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visibleHotels.map((hotel) => (
                    <StayGridCard key={hotel.id} hotel={hotel} />
                  ))}
                </div>

                {hasMore && (
                  <div className="text-center mt-12">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setVisibleCount((prev) => prev + INITIAL_VISIBLE_COUNT)}
                      data-testid="button-load-more-hotels"
                    >
                      Load More ({gridHotels.length - visibleCount} more)
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-center text-muted-foreground py-12">No stays match this filter yet.</p>
            )}
          </div>
        </section>

        {/* Why Book Through Us */}
        <section className="py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">Why Book Through Us</h2>
              <div className="w-16 h-px bg-accent mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {whyBookPoints.map((point: { icon: string; title: string; description: string; id?: string }, index: number) => (
                <div key={point.id || index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center">
                      {getFeatureIcon(point.icon)}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-2">{point.title}</h3>
                  <p className="text-muted-foreground">{point.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="py-20 bg-primary">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-4">{cta.title}</h2>
            {cta.subtitle && (
              <p className="text-primary-foreground/80 text-lg mb-8 leading-relaxed">{cta.subtitle}</p>
            )}
            <Link href={cta.primaryButtonLink || "/contact"}>
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20" data-testid="button-stay-closing-cta">
                {cta.primaryButtonText || "Speak with a Specialist"}
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

function ChipButton({
  label,
  active,
  onClick,
  testId,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  testId: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-accent text-accent-foreground border-accent shadow-sm"
          : "border-input bg-background text-muted-foreground hover:border-accent hover:text-accent"
      }`}
    >
      {label}
    </button>
  );
}
