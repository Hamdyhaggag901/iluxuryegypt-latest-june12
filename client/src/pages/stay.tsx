import Navigation from "../components/navigation";
import { motion } from "framer-motion";
import { useSEO } from "@/hooks/use-seo";
import Footer from "../components/footer";
import ScrollToTopButton from "../components/scroll-to-top-button";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Hotel, Destination, Tour, Testimonial } from "@shared/schema";
import { normalizeForMatch } from "@shared/itinerary-detection";
import { Sparkles, ShieldCheck, PhoneCall } from "lucide-react";
import HotelRevealCard from "@/components/hotel-reveal-card";
import DestinationMiniCard from "@/components/destination-mini-card";
import DestinationToursCarousel from "@/components/destination-tours-carousel";

import luxuryHallImage from "@assets/elegant-hall_1757459228629.jpeg";
import suiteNileImage from "@assets/suite-nile_1757457083796.jpg";

// A pull-quote needs to read as a complete, standalone thought — a single
// sentence can cut off mid-idea, so this takes two sentences whenever they
// still fit a short quote (<=200 chars combined), and falls back to just
// the first only if that alone is already long.
function extractPullQuote(quote: string): string {
  const sentences = quote.match(/[^.!?]+[.!?]+/g) || [quote];
  const first = sentences[0]?.trim() || quote.trim();
  const firstTwo = sentences.slice(0, 2).join(" ").trim();
  return firstTwo.length <= 260 ? firstTwo : first;
}

export default function Stay() {
  useSEO({
    title: "Luxury Hotels & Stays in Egypt",
    description: "Discover Egypt's finest luxury hotels and boutique accommodations. Handpicked stays from Nile-side palaces to Red Sea resorts.",
  });

  const [selectedCity, setSelectedCity] = useState("All");

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

  // Used to resolve each hotel card's "In [City] →" link — same
  // region↔destination-name matching already built for hotel-detail.tsx.
  const { data: destinationsResponse } = useQuery<{ success: boolean; destinations: Destination[] }>({
    queryKey: ["/api/public/destinations"],
  });

  // Tours that include at least one hotel shown on this page, for "Journeys
  // That Include These Stays".
  const { data: toursResponse } = useQuery<{ success: boolean; tours: Tour[] }>({
    queryKey: ["/api/public/tours"],
  });

  // The first real testimonial, for the short pull-quote — same source the
  // homepage's TestimonialSection reads from, so an admin-added review
  // shows up here too, not just Michael R.'s fallback one.
  const { data: testimonialsResponse } = useQuery<{ testimonials: Testimonial[] }>({
    queryKey: ["publicTestimonials"],
    queryFn: async () => {
      const response = await fetch("/api/public/testimonials");
      if (!response.ok) throw new Error("Failed to fetch testimonials");
      return response.json();
    },
  });

  const allHotels: Hotel[] = (hotelsResponse?.hotels || []).filter((h: Hotel) => h.status === "published");
  const destinations = destinationsResponse?.destinations || [];

  // Cities are read from the hotels themselves, not a hardcoded list — a
  // city only appears here if a real published hotel is actually in it.
  const cities = useMemo(() => {
    const set = new Set<string>();
    allHotels.forEach((h) => set.add(h.region));
    return Array.from(set).sort();
  }, [allHotels]);

  const displayedHotels = selectedCity === "All" ? allHotels : allHotels.filter((h) => h.region === selectedCity);

  // One published destination per city shown in the filter above — matched
  // the same way as each hotel card's own "In [City]" link.
  const exploreDestinations = useMemo(() => {
    return cities
      .map((city) => destinations.find((d) => d.published && normalizeForMatch(city).includes(normalizeForMatch(d.name))))
      .filter((d): d is Destination => Boolean(d))
      .filter((d, index, arr) => arr.findIndex((x) => x.id === d.id) === index);
  }, [cities, destinations]);

  const hotelIdSet = new Set(allHotels.map((h) => h.id));
  const relatedTours = (toursResponse?.tours || []).filter(
    (t) => t.published && (t.hotelIds || []).some((id) => hotelIdSet.has(id))
  );

  const featuredTestimonial = testimonialsResponse?.testimonials?.[0];

  const heroData = stayPageData?.hero || {
    title: "Where Luxury Meets the Nile",
    backgroundImage: luxuryHallImage,
  };

  const ctaData = stayPageData?.cta || {
    title: "Let Us Find Your Stay",
    primaryButtonText: "Contact Our Specialists",
    primaryButtonLink: "/contact",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
        <img
          src={heroData.backgroundImage || luxuryHallImage}
          alt="Luxury hotel in Egypt"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/40" />

        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-white text-4xl sm:text-5xl md:text-7xl font-serif font-bold"
          >
            {heroData.title}
          </motion.h1>
          {allHotels.length > 0 && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-white/85 text-sm md:text-base tracking-[0.2em] uppercase mt-5"
              data-testid="hero-hotel-count"
            >
              {allHotels.length} Hand-Selected Properties Across Egypt
            </motion.p>
          )}
        </div>
      </section>

      <main>
        {/* City filter — simple text pills, derived from real hotel data */}
        <section className="pt-14 md:pt-20 pb-8 md:pb-10 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedCity("All")}
              className={`px-5 py-2 text-sm tracking-wide rounded-full border transition-colors duration-300 ${
                selectedCity === "All"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-accent/30 text-primary hover:border-accent"
              }`}
              data-testid="city-filter-all"
            >
              All
            </button>
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-5 py-2 text-sm tracking-wide rounded-full border transition-colors duration-300 ${
                  selectedCity === city
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-accent/30 text-primary hover:border-accent"
                }`}
                data-testid={`city-filter-${city.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and")}`}
              >
                {city}
              </button>
            ))}
          </div>
        </section>

        {/* Hotel Grid */}
        <section className="pb-16 md:pb-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {displayedHotels.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {displayedHotels.map((hotel, index) => (
                  <HotelRevealCard key={hotel.id} hotel={hotel} destinations={destinations} index={index} />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-16">No hotels found in {selectedCity}.</p>
            )}
          </div>
        </section>

        {/* Explore by Destination */}
        {exploreDestinations.length > 0 && (
          <section className="py-16 md:py-24 bg-muted" data-testid="explore-by-destination-section">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-2xl md:text-3xl font-serif font-bold text-primary text-center mb-12"
              >
                Explore by Destination
              </motion.h2>
              <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                {exploreDestinations.map((destination, index) => (
                  <div key={destination.id} className="w-32 md:w-40">
                    <DestinationMiniCard
                      slug={destination.slug}
                      name={destination.name}
                      image={destination.heroImage}
                      index={index}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* The iLuxury Standard */}
        <section className="py-16 md:py-24 bg-background" data-testid="iluxury-standard-section">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-3 gap-4 md:gap-8">
              {[
                { icon: <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-accent" />, label: "Hand-Selected" },
                { icon: <ShieldCheck className="w-6 h-6 md:w-7 md:h-7 text-accent" />, label: "Personally Inspected" },
                { icon: <PhoneCall className="w-6 h-6 md:w-7 md:h-7 text-accent" />, label: "Concierge Included" },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: index * 0.12, ease: "easeOut" }}
                  className="flex flex-col items-center text-center gap-3"
                >
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-accent/10 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-xs md:text-sm font-medium text-primary tracking-wide">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Guest quote — one short pull-quote, no full testimonial section */}
        {featuredTestimonial && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="py-16 md:py-20 bg-muted"
            data-testid="stay-guest-quote-section"
          >
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-xl md:text-2xl font-serif italic text-primary leading-relaxed mb-4">
                "{extractPullQuote(featuredTestimonial.quote)}"
              </p>
              <span className="text-sm tracking-[0.2em] uppercase text-accent">
                — {featuredTestimonial.author}
              </span>
            </div>
          </motion.section>
        )}

        {/* Journeys That Include These Stays */}
        <DestinationToursCarousel
          tours={relatedTours}
          eyebrow="Curated Journeys"
          title="Journeys That Include These Stays"
        />

        {/* Call to Action — "Closing Frame": a full-bleed image band that
            mirrors the hero, closing the page in the same visual language
            it opened with, instead of a boxed text CTA. */}
        <section className="relative h-[45vh] md:h-[55vh] flex items-center justify-center overflow-hidden">
          <motion.img
            src={suiteNileImage}
            alt="Luxury suite in Egypt"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            initial={{ scale: 1.08 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-black/50" />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative z-10 text-center px-4"
          >
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-white mb-8">{ctaData.title}</h2>
            <Link href={ctaData.primaryButtonLink || "/contact"}>
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg" data-testid="button-contact-specialists">
                {ctaData.primaryButtonText || "Contact Our Specialists"}
              </Button>
            </Link>
          </motion.div>
        </section>
      </main>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
