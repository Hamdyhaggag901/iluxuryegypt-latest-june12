import { useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useSEO } from '@/hooks/use-seo';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import ScrollToTopButton from '@/components/scroll-to-top-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'wouter';
import { MapPin, Clock, Camera, Car, Star, Loader2 } from 'lucide-react';

interface Attraction {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface Destination {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  heroImage: string;
  gallery: string[];
  highlights: string[];
  attractions: Attraction[];
  bestTimeToVisit?: string;
  duration?: string;
  difficulty?: string;
  region: string;
  featured: boolean;
  published: boolean;
}

export default function DestinationDetail() {
  const [, params] = useRoute('/destinations/:slug');
  const slug = params?.slug;

  const { data: destination, isLoading, error } = useQuery<Destination>({
    queryKey: ['/api/public/destinations', slug],
    queryFn: async () => {
      const response = await fetch(`/api/public/destinations/${slug}`);
      if (!response.ok) {
        throw new Error('Destination not found');
      }
      const data = await response.json();
      return data.destination;
    },
    enabled: !!slug,
  });

  useSEO({
    title: destination?.name ? `${destination.name} - Luxury Travel Guide` : undefined,
    description: destination?.shortDescription || destination?.description?.slice(0, 160),
    image: destination?.heroImage,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading destination...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-4xl font-serif font-bold text-primary mb-4">Destination Not Found</h1>
            <p className="text-muted-foreground mb-8">The destination you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/destinations">View All Destinations</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const quickFacts = [
    {
      label: "Best Time to Visit",
      value: destination.bestTimeToVisit || "Year-round",
      icon: <Clock className="w-5 h-5" />
    },
    {
      label: "Region",
      value: destination.region,
      icon: <MapPin className="w-5 h-5" />
    },
    {
      label: "Recommended Duration",
      value: destination.duration || "2-3 days",
      icon: <Camera className="w-5 h-5" />
    },
    {
      label: "Difficulty",
      value: destination.difficulty || "Easy",
      icon: <Car className="w-5 h-5" />
    }
  ];

  // Use attractions if available, otherwise fall back to highlights
  const attractions = destination.attractions && destination.attractions.length > 0
    ? destination.attractions
    : destination.highlights?.map((name, index) => ({
        id: `highlight-${index}`,
        name,
        description: `Experience the wonder of ${name} in ${destination.name}.`,
        image: destination.gallery?.[index] || destination.heroImage,
      })) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-screen flex items-center justify-center overflow-hidden">
        <img
          src={destination.heroImage}
          alt={destination.name}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-serif font-bold mb-4 md:mb-6" data-testid="destination-hero-title">
            {destination.name}
          </h1>
          <div className="w-20 md:w-32 h-px bg-accent mx-auto mb-4 md:mb-8"></div>
          <p className="text-base sm:text-lg md:text-2xl lg:text-3xl font-light tracking-wide mb-6 md:mb-12 px-2" data-testid="destination-tagline">
            {destination.shortDescription || `Discover the wonders of ${destination.name}`}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
            <Button size="lg" className="px-5 md:px-8 py-3 md:py-4 text-sm md:text-lg" asChild data-testid="button-plan-visit">
              <Link href="/contact">Plan Your Experience</Link>
            </Button>
            <Button size="lg" variant="secondary" className="px-5 md:px-8 py-3 md:py-4 text-sm md:text-lg" asChild data-testid="button-view-all-destinations">
              <Link href="/destinations">View All Destinations</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Facts */}
      <section className="py-10 md:py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {quickFacts.map((fact, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-4 md:p-6">
                  <div className="flex justify-center mb-2 md:mb-4 text-primary [&_svg]:w-4 [&_svg]:h-4 md:[&_svg]:w-5 md:[&_svg]:h-5">
                    {fact.icon}
                  </div>
                  <h3 className="font-semibold text-foreground mb-1 md:mb-2 text-xs md:text-base" data-testid={`fact-label-${index}`}>
                    {fact.label}
                  </h3>
                  <p className="text-muted-foreground text-xs md:text-base" data-testid={`fact-value-${index}`}>
                    {fact.value}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="py-12 md:py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-primary mb-4 md:mb-6">
              Discover {destination.name}
            </h2>
            <div className="w-16 md:w-24 h-px bg-accent mx-auto mb-4 md:mb-8"></div>
          </div>

          <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
            <p className="text-sm md:text-lg lg:text-xl mb-6 md:mb-8">
              {destination.description}
            </p>
          </div>
        </div>
      </section>

      {/* Main Attractions */}
      {attractions.length > 0 && (
        <section className="py-12 md:py-20 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-primary mb-4 md:mb-6">
                {destination.name} Highlights
              </h2>
              <div className="w-16 md:w-24 h-px bg-accent mx-auto mb-4 md:mb-8"></div>
              <p className="text-sm md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
                Explore the treasures that make {destination.name} one of Egypt's most captivating destinations.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
              {attractions.map((attraction, index) => (
                <Card key={attraction.id} className="overflow-hidden group hover:shadow-xl transition-all duration-500">
                  <div className="relative">
                    <img
                      src={attraction.image}
                      alt={attraction.name}
                      className="w-full h-48 md:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-white/90 backdrop-blur-sm p-2 md:p-3 rounded-full">
                      <div className="text-primary">
                        <Star className="w-4 h-4 md:w-6 md:h-6" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-5 md:p-8">
                    <h3 className="text-lg md:text-2xl font-serif font-bold text-primary mb-2 md:mb-4" data-testid={`attraction-title-${index}`}>
                      {attraction.name}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed" data-testid={`attraction-description-${index}`}>
                      {attraction.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-12 md:py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4 md:mb-6">
            Ready to Explore {destination.name}?
          </h2>
          <div className="w-16 md:w-24 h-px bg-accent mx-auto mb-4 md:mb-8"></div>
          <p className="text-sm md:text-lg lg:text-xl leading-relaxed mb-6 md:mb-10 text-white/90 px-2">
            Let our specialists create a bespoke itinerary that captures the magic of this extraordinary destination.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
            <Button size="lg" variant="secondary" className="px-5 md:px-8 py-3 md:py-4 text-sm md:text-lg w-full sm:w-auto sm:min-w-[220px] text-white" asChild data-testid="button-contact-specialists">
              <Link href="/contact">Contact Our Specialists</Link>
            </Button>
            <Button size="lg" variant="outline" className="px-5 md:px-8 py-3 md:py-4 text-sm md:text-lg w-full sm:w-auto sm:min-w-[220px] border-white text-white hover:bg-white hover:text-primary" asChild data-testid="button-view-all-egypt-destinations">
              <Link href="/destinations">View All Destinations</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
