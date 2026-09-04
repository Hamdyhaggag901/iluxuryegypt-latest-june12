import { useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useSEO } from '@/hooks/use-seo';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import ScrollToTopButton from '@/components/scroll-to-top-button';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { MapPin, Clock, Calendar, Loader2 } from 'lucide-react';
import { getResponsiveImageProps } from '@/lib/responsive-image';
import { legacyTextToHtml } from '@/lib/legacy-text-to-html';
import { sanitizeHtml } from '@/lib/sanitize-html';
import { normalizeForMatch } from '@shared/itinerary-detection';
import type { Tour, Hotel } from '@shared/schema';
import AttractionSplitRow from '@/components/attraction-split-row';
import DestinationToursCarousel from '@/components/destination-tours-carousel';
import WhereYouWillStaySection from '@/components/where-you-will-stay-section';
import FaqSection, { buildFaqJsonLd } from '@/components/faq-section';

interface Attraction {
  id: string;
  name: string;
  description: string;
  image: string;
  imageAlt?: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
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
  seoTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: string | null;
  canonicalUrl?: string | null;
  robots?: string | null;
  schemaType?: string | null;
  schemaMarkup?: string | null;
  faqs?: FAQ[];
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

  const { data: toursData } = useQuery<{ success: boolean; tours: Tour[] }>({
    queryKey: ["/api/public/tours"],
  });

  const { data: hotelsData } = useQuery<{ success: boolean; hotels: Hotel[] }>({
    queryKey: ["/api/hotels"],
    queryFn: async () => {
      const res = await fetch("/api/hotels");
      if (!res.ok) throw new Error("Failed to load hotels");
      return res.json();
    },
  });

  const validFaqs = (destination?.faqs || []).filter(
    (f) => f && f.question?.trim() && f.answer?.trim()
  );

  const faqJsonLd = buildFaqJsonLd(validFaqs.map((f) => ({ question: f.question, answer: f.answer })));

  const customSchema = destination?.schemaMarkup?.trim() || null;
  const jsonLd: Array<string | object> = [];

  // Auto-generated structured data from the schemaType dropdown.
  // Only emitted when there is no custom JSON-LD override.
  if (!customSchema && destination?.schemaType?.trim()) {
    const auto: Record<string, any> = {
      "@context": "https://schema.org",
      "@type": destination.schemaType.trim(),
      name: destination.name,
      description:
        destination.metaDescription?.trim() ||
        destination.shortDescription ||
        destination.description?.slice(0, 200),
    };
    if (destination.heroImage) auto.image = destination.heroImage;
    if (destination.canonicalUrl?.trim()) auto.url = destination.canonicalUrl.trim();
    jsonLd.push(auto);
  }

  if (customSchema) jsonLd.push(customSchema);
  if (faqJsonLd) jsonLd.push(faqJsonLd);

  useSEO({
    title: destination?.seoTitle?.trim()
      ? destination.seoTitle.trim()
      : destination?.name
        ? `${destination.name} - Luxury Travel Guide`
        : undefined,
    titleOverride: !!destination?.seoTitle?.trim(),
    description:
      destination?.metaDescription?.trim() ||
      destination?.shortDescription ||
      destination?.description?.slice(0, 160),
    image: destination?.ogImage?.trim() || destination?.heroImage,
    canonical: destination?.canonicalUrl?.trim() || undefined,
    robots: destination?.robots?.trim() || undefined,
    jsonLd: jsonLd.length > 0 ? jsonLd : undefined,
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

  // Use attractions if available, otherwise fall back to highlights
  const attractions = destination.attractions && destination.attractions.length > 0
    ? destination.attractions
    : destination.highlights?.map((name, index) => ({
        id: `highlight-${index}`,
        name,
        description: `Experience the wonder of ${name} in ${destination.name}.`,
        image: destination.gallery?.[index] || destination.heroImage,
        imageAlt: undefined as string | undefined,
      })) || [];

  const cityNeedle = normalizeForMatch(destination.name);
  const cityTours = (toursData?.tours || [])
    .filter((t) => t.published)
    .filter((t) => (t.destinations || []).some((d) => normalizeForMatch(d).includes(cityNeedle) || cityNeedle.includes(normalizeForMatch(d))));

  const cityHotels = (hotelsData?.hotels || [])
    .filter((h) => h.status === "published")
    .filter((h) => normalizeForMatch(h.region || "").includes(cityNeedle));

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-screen flex items-center justify-center overflow-hidden">
        <img
          {...getResponsiveImageProps(destination.heroImage)}
          alt={destination.name}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
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

      {/* Overview */}
      <section className="py-12 md:py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-14">
            <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-accent font-medium">Overview</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-primary mt-4 mb-4 md:mb-6">
              Discover {destination.name}
            </h2>
            <div className="w-16 md:w-24 h-px bg-accent mx-auto"></div>
          </div>

          <div
            className="prose prose-lg max-w-none text-muted-foreground leading-relaxed text-sm md:text-lg lg:text-xl [&>p]:mb-4 last:[&>p]:mb-0 [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2 [&_strong]:font-semibold [&_em]:italic"
            data-testid="destination-overview"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(legacyTextToHtml(destination.description)) }}
          />
        </div>
      </section>

      {/* Attractions — Alternating Split Cards */}
      {attractions.length > 0 && (
        <section className="py-12 md:py-24 bg-muted overflow-hidden" data-testid="destination-attractions-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-20">
              <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-accent font-medium">
                Not To Be Missed
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-primary mt-4 mb-4 md:mb-6">
                {destination.name} Highlights
              </h2>
              <div className="w-16 md:w-24 h-px bg-accent mx-auto"></div>
            </div>

            <div className="space-y-16 md:space-y-28">
              {attractions.map((attraction, index) => (
                <AttractionSplitRow
                  key={attraction.id}
                  name={attraction.name}
                  description={attraction.description}
                  image={attraction.image}
                  imageAlt={attraction.imageAlt}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tours in [City] */}
      <DestinationToursCarousel tours={cityTours} eyebrow="Curated Journeys" title={`Tours in ${destination.name}`} />

      {/* Where to Stay */}
      <WhereYouWillStaySection
        hotels={cityHotels}
        eyebrow="Where to Stay"
        title={`Hand-Selected Stays in ${destination.name}`}
        subtitle={`Five-star properties in ${destination.name}, chosen for their location, service, and character.`}
        limit={3}
      />

      {/* Best Time to Visit */}
      <section className="py-12 md:py-20 bg-background" data-testid="destination-best-time-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-accent font-medium">
            Planning Your Visit
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-primary mt-4 mb-10 md:mb-14">
            Best Time to Visit {destination.name}
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-10"
          >
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-serif text-lg font-bold text-primary mb-1">Ideal Season</h3>
              <p className="text-sm text-muted-foreground">{destination.bestTimeToVisit || "Year-round"}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-serif text-lg font-bold text-primary mb-1">Recommended Stay</h3>
              <p className="text-sm text-muted-foreground">{destination.duration || "2-3 days"}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-serif text-lg font-bold text-primary mb-1">Region</h3>
              <p className="text-sm text-muted-foreground">{destination.region}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <FaqSection
        faqs={validFaqs.map((f) => ({ question: f.question, answer: f.answer }))}
        description={`Everything you need to know about visiting ${destination.name}.`}
        testId="destination-faq-section"
      />

      {/* Call to Action */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-12 md:py-20 bg-primary text-white"
      >
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
      </motion.section>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
