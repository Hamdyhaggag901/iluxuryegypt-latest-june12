import { useState } from "react";
import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { useSEO } from "@/hooks/use-seo";
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
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Facility, Destination, Tour, Attraction } from "@shared/schema";
import { getHotelImageAlt } from "@/lib/seo-alt-text";
import { getResponsiveImageProps } from "@/lib/responsive-image";
import { normalizeForMatch } from "@shared/itinerary-detection";
import { Card, CardContent } from "@/components/ui/card";
import FaqSection, { buildFaqJsonLd } from "@/components/faq-section";
import DestinationToursCarousel from "@/components/destination-tours-carousel";

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

function RelatedHotelCard({ hotel, index = 0 }: { hotel: any; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.1, ease: "easeOut" }}
    >
      <Card
        className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        data-testid={`related-hotel-card-${hotel.slug}`}
      >
        <Link href={`/hotel/${hotel.slug}`}>
          <div className="relative h-44 overflow-hidden">
            <img
              src={hotel.image}
              alt={getHotelImageAlt(hotel)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          </div>
          <CardContent className="p-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <MapPin className="w-3 h-3 text-accent" />
              <span>{hotel.location}</span>
            </div>
            <h3 className="font-serif font-bold text-base text-primary leading-tight">{hotel.name}</h3>
          </CardContent>
        </Link>
      </Card>
    </motion.div>
  );
}

export default function HotelDetail() {
  const [match, params] = useRoute("/hotel/:slug");
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

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

  const { data: allHotelsResponse } = useQuery({
    queryKey: ["/api/hotels"],
    queryFn: async () => {
      const response = await fetch("/api/hotels");
      if (!response.ok) throw new Error("Failed to fetch hotels");
      return response.json();
    },
  });

  // Published destinations, used to link this hotel to its city page — see
  // linkedDestination below.
  const { data: destinationsResponse } = useQuery<{ success: boolean; destinations: Destination[] }>({
    queryKey: ["/api/public/destinations"],
  });

  // All published tours, used for "Tours Featuring This Hotel" — see
  // relatedTours below.
  const { data: toursResponse } = useQuery<{ success: boolean; tours: Tour[] }>({
    queryKey: ["/api/public/tours"],
  });

  const seoHotel = hotelResponse?.hotel;

  // The destination whose name is contained in this hotel's region (e.g.
  // region "Cairo & Giza" matches destination name "Cairo") — same matching
  // convention already used to filter city-page "Where to Stay" hotels, just
  // applied in reverse. No match (region doesn't correspond to a published
  // city page) hides the link rather than risking a dead one.
  const linkedDestination = seoHotel?.region && destinationsResponse?.destinations
    ? destinationsResponse.destinations.find(
        (d) => d.published && normalizeForMatch(seoHotel.region).includes(normalizeForMatch(d.name))
      ) || null
    : null;

  // Generic questions that apply to any hotel — grounded only in data that
  // actually exists (facilities list); booking-policy questions with no
  // per-hotel data (breakfast, cancellation) point to our specialists
  // instead of inventing an answer.
  const hotelFaqs = seoHotel
    ? [
        {
          question: "Is breakfast included?",
          answer: "Contact our travel specialists for details on what's included at this property.",
        },
        {
          question: "What's the cancellation policy?",
          answer: "Contact our travel specialists for cancellation details for your dates.",
        },
        {
          question: "What facilities are available?",
          answer:
            ((seoHotel.facilities || []) as Facility[]).length > 0
              ? `This property offers: ${((seoHotel.facilities || []) as Facility[]).map((f) => f.label).join(", ")}.`
              : "Contact our travel specialists for a full list of facilities at this property.",
        },
      ]
    : [];

  // Title/description/image + FAQPage only — no Hotel/LodgingBusiness jsonLd
  // here. server/seo-meta.ts already injects a complete Hotel schema (name,
  // description, images, address, starRating, priceRange, amenityFeature)
  // into the initial server-rendered HTML for this route; a second
  // client-side Hotel block would just duplicate/conflict with it once JS
  // runs (including in the Puppeteer prerender bots receive). FAQPage is a
  // different @type the server doesn't add, so it's safe to add here.
  useSEO({
    title: seoHotel?.name,
    description: seoHotel?.description?.slice(0, 160),
    image: seoHotel?.image,
    jsonLd: buildFaqJsonLd(hotelFaqs),
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
  const allImages = [hotel.image, ...gallery.filter((img) => img !== hotel.image)];
  const hasCruiseDetails = Boolean(hotel.route || hotel.duration);
  const relatedHotels = ((allHotelsResponse?.hotels || []) as any[])
    .filter((h) => h.status === "published" && h.region === hotel.region && h.slug !== hotel.slug)
    .slice(0, 4);

  // Tours whose manually-curated hotelIds include this hotel — the reverse
  // of the tour page's own "Where You Will Stay" lookup. hotelIds is
  // admin-curated, so this is exact-id matching only, no fuzzy logic.
  const relatedTours = (toursResponse?.tours || []).filter(
    (t) => t.published && (t.hotelIds || []).includes(hotel.id)
  );

  // Real attractions from the hotel's own linked destination (see
  // linkedDestination below) — shown as "Nearby Attractions", distinct from
  // the single "Explore [City]" link in the hero.
  const nearbyAttractions = ((linkedDestination?.attractions as Attraction[] | undefined) || []).slice(0, 3);

  // Intro paragraph fallback — hotel.description/fullDescription are real
  // admin-written content already used on hotel cards elsewhere on the site,
  // but were never rendered on the hotel's own page. When there's no
  // free-form article, this guarantees the page still opens with a direct,
  // real description instead of jumping straight from hero to facilities.
  const introText = !hotel.article ? (hotel.fullDescription || hotel.description) : null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        {/* Hero Gallery — main image cycles through hotel.image + gallery,
            with a thumbnail strip and a full-screen lightbox, matching the
            same interaction pattern already used on the tour detail page. */}
        <section
          className="relative h-[60vh] md:h-[75vh] flex items-end overflow-hidden cursor-pointer group"
          onClick={() => setIsLightboxOpen(true)}
        >
          <img
            {...getResponsiveImageProps(allImages[selectedImage])}
            alt={getHotelImageAlt(hotel, selectedImage)}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedImage((prev) => (prev === 0 ? allImages.length - 1 : prev - 1)); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100 z-10"
                aria-label="Previous image"
                data-testid="button-hero-prev"
              >
                <ChevronLeft className="h-6 w-6 text-primary" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedImage((prev) => (prev === allImages.length - 1 ? 0 : prev + 1)); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100 z-10"
                aria-label="Next image"
                data-testid="button-hero-next"
              >
                <ChevronRight className="h-6 w-6 text-primary" />
              </button>
            </>
          )}

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 md:pb-14 text-white">
            <div className="flex items-center gap-2 text-sm md:text-base text-white/80 mb-2">
              <MapPin className="w-4 h-4 text-accent" />
              <span>{hotel.location} · {hotel.type}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold">{hotel.name}</h1>

            {linkedDestination && (
              <Link
                href={`/destinations/${linkedDestination.slug}`}
                onClick={(e) => e.stopPropagation()}
                className="group inline-flex items-center gap-1.5 mt-3 text-sm md:text-base text-white/90 hover:text-white transition-colors duration-300"
                data-testid="link-explore-hotel-destination"
              >
                Explore {linkedDestination.name}
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            )}

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

            {allImages.length > 1 && (
              <div
                className="flex gap-2 mt-6 overflow-x-auto pb-1 max-w-full"
                onClick={(e) => e.stopPropagation()}
                data-testid="hero-thumbnail-strip"
              >
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-16 h-12 md:w-20 md:h-14 rounded-md overflow-hidden transition-all duration-300 ${
                      selectedImage === idx ? "ring-2 ring-accent ring-offset-2 ring-offset-black/40 opacity-100" : "opacity-60 hover:opacity-90"
                    }`}
                    data-testid={`hero-thumbnail-${idx}`}
                  >
                    <img src={img} alt={getHotelImageAlt(hotel, idx)} className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Intro — direct-answer fallback when there's no free-form article */}
        {introText && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="py-14 md:py-20"
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">{introText}</p>
            </div>
          </motion.section>
        )}

        {/* Article — free-form rich text */}
        {hotel.article && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="py-14 md:py-20"
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div
                className="prose prose-xl max-w-none prose-primary"
                dangerouslySetInnerHTML={{ __html: hotel.article }}
              />
            </div>
          </motion.section>
        )}

        {/* Facilities & Amenities */}
        {facilities.length > 0 && (
          <section className="py-14 md:py-20 bg-muted/40">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-2xl md:text-3xl font-serif font-bold text-primary mb-10 text-center"
              >
                Facilities &amp; Amenities
              </motion.h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {facilities.map((facility, index) => (
                  <motion.div
                    key={`${facility.label}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, delay: (index % 8) * 0.06, ease: "easeOut" }}
                    whileHover={{ y: -4 }}
                    className="flex flex-col items-center text-center gap-3"
                  >
                    <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center transition-colors duration-300 hover:bg-accent/20">
                      {getFacilityIcon(facility.icon)}
                    </div>
                    <span className="text-sm font-medium text-primary">{facility.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        <FaqSection faqs={hotelFaqs} testId="hotel-faq-section" />

        {/* Nearby Attractions — real attractions from this hotel's own
            destination page, distinct from the "Explore [City]" hero link. */}
        {nearbyAttractions.length > 0 && linkedDestination && (
          <section className="py-14 md:py-20 bg-muted/40" data-testid="hotel-nearby-attractions-section">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-2xl md:text-3xl font-serif font-bold text-primary mb-8 text-center"
              >
                Nearby Attractions in {linkedDestination.name}
              </motion.h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {nearbyAttractions.map((attraction, index) => (
                  <motion.div
                    key={attraction.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                    className="group"
                  >
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-3">
                      <img
                        src={attraction.image}
                        alt={attraction.imageAlt || attraction.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-primary leading-snug">{attraction.name}</h3>
                  </motion.div>
                ))}
              </div>
              <div className="text-center mt-10">
                <Link
                  href={`/destinations/${linkedDestination.slug}`}
                  className="group inline-flex items-center gap-2 text-primary font-medium hover:text-accent transition-colors duration-300"
                  data-testid="link-nearby-attractions-view-more"
                >
                  Explore all of {linkedDestination.name}
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Tours Featuring This Hotel */}
        <DestinationToursCarousel tours={relatedTours} eyebrow="Curated Journeys" title="Tours Featuring This Hotel" />

        {/* Why We Chose This Hotel — full-width brand-color focal point */}
        {hotel.whyWeChoseQuote && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="py-20 md:py-28 bg-primary"
          >
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
          </motion.section>
        )}

        {/* You Might Also Like — other hotels in the same region */}
        {relatedHotels.length > 0 && (
          <section className="py-14 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-2xl md:text-3xl font-serif font-bold text-primary mb-8 text-center"
              >
                You Might Also Like
              </motion.h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedHotels.map((related, index) => (
                  <RelatedHotelCard key={related.id} hotel={related} index={index} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-14 md:py-20 bg-muted/40"
        >
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
        </motion.section>
      </main>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6 text-white" />
          </button>
          {allImages.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedImage((prev) => (prev === 0 ? allImages.length - 1 : prev - 1)); }}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-7 w-7 text-white" />
            </button>
          )}
          <img
            src={allImages[selectedImage]}
            alt={getHotelImageAlt(hotel, selectedImage)}
            className="max-w-[90vw] max-h-[85vh] object-contain"
            loading="eager"
            onClick={(e) => e.stopPropagation()}
          />
          {allImages.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedImage((prev) => (prev === allImages.length - 1 ? 0 : prev + 1)); }}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
              aria-label="Next image"
            >
              <ChevronRight className="h-7 w-7 text-white" />
            </button>
          )}
          {allImages.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {allImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setSelectedImage(idx); }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    selectedImage === idx ? "bg-accent w-6" : "bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
