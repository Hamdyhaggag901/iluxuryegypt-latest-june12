import Navigation from "../components/navigation";
import { motion } from "framer-motion";
import { useSEO } from "@/hooks/use-seo";
import Footer from "../components/footer";
import ScrollToTopButton from "../components/scroll-to-top-button";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Hotel, Destination } from "@shared/schema";
import HotelRevealCard from "@/components/hotel-reveal-card";

import luxuryHallImage from "@assets/elegant-hall_1757459228629.jpeg";

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

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center text-white text-4xl sm:text-5xl md:text-7xl font-serif font-bold px-4"
        >
          {heroData.title}
        </motion.h1>
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

        {/* Philosophy — one short paragraph, nothing more */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="py-16 md:py-24 bg-muted"
        >
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xl md:text-2xl font-serif italic text-primary leading-relaxed">
              Every property here has been visited and personally chosen by our Egypt specialists —
              never a full inventory, only what earns a place.
            </p>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-16 md:py-20 bg-background text-center"
        >
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-primary mb-8">{ctaData.title}</h2>
            <Link href={ctaData.primaryButtonLink || "/contact"}>
              <Button size="lg" className="px-8 py-4 text-lg" data-testid="button-contact-specialists">
                {ctaData.primaryButtonText || "Contact Our Specialists"}
              </Button>
            </Link>
          </div>
        </motion.section>
      </main>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
