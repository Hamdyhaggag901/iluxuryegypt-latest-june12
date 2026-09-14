import { useSEO } from "@/hooks/use-seo";
import { useQuery } from '@tanstack/react-query';
import { motion } from "framer-motion";
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import ScrollToTopButton from '@/components/scroll-to-top-button';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Loader2, ArrowRight } from 'lucide-react';
import type { Tour, Category } from "@shared/schema";
import DestinationCityCard from "@/components/destination-city-card";
import DestinationToursCarousel from "@/components/destination-tours-carousel";
import WhereYouWillStaySection from "@/components/where-you-will-stay-section";
import ReadBeforeYouGoSection from "@/components/tour-detail/ReadBeforeYouGoSection";
import FaqSection, { buildFaqJsonLd, type FaqItem } from "@/components/faq-section";
import panoramicHeroImage from "@assets/sunset-felucca_1757456567256.jpg";

interface Destination {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  heroImage: string;
  gallery: string[];
  highlights: string[];
  region: string;
  featured: boolean;
  published: boolean;
}

// Same real, already-published Egypt-travel FAQ content shown on the
// homepage (client/src/components/home-faq-section.tsx) — the subset that's
// actually about exploring destinations rather than booking mechanics —
// reused verbatim here rather than inventing new copy, and finally given
// real FAQPage schema (the homepage's own copy of these currently has none).
const GENERAL_EGYPT_FAQS: FaqItem[] = [
  {
    question: "Is Egypt safe for American tourists?",
    answer:
      "Yes. Millions of international visitors safely explore Egypt every year. Tourist destinations are well protected, and private guided travel offers an even higher level of comfort, convenience, and security.",
  },
  {
    question: "Visa requirements for US citizens",
    answer:
      "U.S. passport holders generally require a tourist visa to enter Egypt. Most visitors can obtain an eVisa online before departure or purchase a visa on arrival, depending on current regulations.",
  },
  {
    question: "Best time to visit Egypt",
    answer:
      "The most comfortable months are October through April, when temperatures are ideal for sightseeing. Summer is warmer but offers fewer crowds and attractive luxury hotel rates.",
  },
];

export default function Destinations() {
  const { data: destinationsData, isLoading } = useQuery<{ success: boolean; destinations: Destination[] }>({
    queryKey: ['/api/public/destinations'],
    queryFn: async () => {
      const response = await fetch('/api/public/destinations');
      if (!response.ok) throw new Error('Failed to fetch destinations');
      return response.json();
    },
  });

  const { data: toursData } = useQuery<{ success: boolean; tours: Tour[] }>({
    queryKey: ["/api/public/tours"],
  });

  const { data: categoriesData } = useQuery<{ success: boolean; categories: Category[] }>({
    queryKey: ["/api/public/categories", "packages"],
    queryFn: async () => {
      const res = await fetch("/api/public/categories?type=packages");
      if (!res.ok) throw new Error("Failed to load categories");
      return res.json();
    },
  });

  const destinations = (destinationsData?.destinations || []).filter((d) => d.published);
  const tours = (toursData?.tours || []).filter((t) => t.published).slice(0, 9);
  const categories = categoriesData?.categories || [];

  const faqJsonLd = buildFaqJsonLd(GENERAL_EGYPT_FAQS);

  useSEO({
    title: "Egypt Travel Guide | Cities, Sites and Seasons",
    description:
      "An Egypt travel guide to Cairo, Luxor, Aswan, Alexandria, Hurghada and Siwa Oasis, covering what each place holds, when to go, and how long to stay.",
    jsonLd: faqJsonLd,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="relative h-[70vh] md:h-[85vh] flex items-center justify-center overflow-hidden">
        <img
          src={panoramicHeroImage}
          alt="The Nile at sunset — Egypt Destinations"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-primary/20" />

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-accent font-medium">
            Egypt Destinations
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-serif font-bold mt-4 mb-6">
            Egypt Travel Guide
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed">
            From the pyramids of Giza to the temples of Luxor and the shores of the Red Sea — every
            city tells its own chapter of Egypt's story.
          </p>
        </div>
      </section>

      {/* Intro copy. Links every city by its own slug so the guide reads as one
          piece rather than a grid of cards with no connective tissue. */}
      <section className="py-12 md:py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-base md:text-lg text-muted-foreground leading-relaxed [&>p]:mb-4 last:[&>p]:mb-0 [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2">
          <p>
            This Egypt travel guide covers the six places most journeys are built around, with
            what each one actually holds and how much time it deserves. Begin with the{" "}
            <Link href="/egypt-travel-guide/cairo-travel-guide" className="text-accent underline underline-offset-2">Cairo Egypt travel guide</Link>{" "}
            for the Giza plateau and the Grand Egyptian Museum, then move south to{" "}
            <Link href="/egypt-travel-guide/attractions-in-luxor" className="text-accent underline underline-offset-2">Luxor's royal tombs and temple complexes</Link>{" "}
            and{" "}
            <Link href="/egypt-travel-guide/aswan-egypt-attractions" className="text-accent underline underline-offset-2">Aswan, where the Nile narrows between granite islands</Link>.
          </p>
          <p>
            On the coast,{" "}
            <Link href="/egypt-travel-guide/alexandria-egypt-attractions" className="text-accent underline underline-offset-2">Alexandria keeps its Greco-Roman layers</Link>{" "}
            and{" "}
            <Link href="/egypt-travel-guide/things-to-do-in-hurghada" className="text-accent underline underline-offset-2">Hurghada opens onto the Red Sea reefs</Link>, while{" "}
            <Link href="/egypt-travel-guide/siwa-oasis-egypt" className="text-accent underline underline-offset-2">Siwa lies far west in the Western Desert</Link>,
            Berber-speaking and still largely its own world. Together they work as an ancient Egypt
            travel guide and a practical travel guide in Egypt: temples and tombs on one side,
            seasons, transport and realistic pacing on the other.
          </p>
        </div>
      </section>

      {/* City Cards */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-20">
            <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-accent font-medium">
              Where To Go
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-primary mt-4">
              Cities & Destinations
            </h2>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : destinations.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">No destinations found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 md:gap-y-20">
              {destinations.map((destination, index) => (
                <DestinationCityCard
                  key={destination.id}
                  slug={destination.slug}
                  name={destination.name}
                  region={destination.region}
                  tagline={destination.shortDescription}
                  image={destination.heroImage}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Tours Across Egypt */}
      <DestinationToursCarousel tours={tours} eyebrow="Curated Journeys" title="Tours Across Egypt" />

      {/* Where You Will Stay Across Egypt */}
      <WhereYouWillStaySection
        eyebrow="Accommodations"
        title="Where You Will Stay Across Egypt"
        subtitle="Hand-selected five-star properties from Cairo to Aswan, each chosen for its location, service, and character."
        limit={6}
      />

      {/* Plan Your Journey */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-accent font-medium">
            Plan Your Journey
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mt-4 mb-10 md:mb-14">
            Journeys Built Around You
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/luxury-egypt-tour-packages/${category.slug}`}
                className="group inline-flex items-center gap-1.5 text-lg font-serif text-primary hover:text-accent transition-colors duration-300"
                data-testid={`link-plan-${category.slug}`}
              >
                {category.name}
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Read Before You Go */}
      <ReadBeforeYouGoSection />

      {/* FAQ */}
      <FaqSection
        faqs={GENERAL_EGYPT_FAQS}
        description="A few essentials before you start planning your trip to Egypt."
        testId="destinations-faq-section"
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
            Ready to Explore Egypt?
          </h2>
          <div className="w-16 md:w-24 h-px bg-accent mx-auto mb-4 md:mb-8"></div>
          <p className="text-sm md:text-lg lg:text-xl leading-relaxed mb-6 md:mb-10 text-white/90 px-2">
            Let our travel specialists create a bespoke itinerary that captures the magic of Egypt's
            most extraordinary destinations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
            <Button size="lg" variant="secondary" className="px-5 md:px-8 py-3 md:py-4 text-sm md:text-lg w-full sm:w-auto sm:min-w-[220px] text-white" asChild data-testid="button-contact-specialists">
              <Link href="/contact">Contact Our Specialists</Link>
            </Button>
          </div>
        </div>
      </motion.section>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
