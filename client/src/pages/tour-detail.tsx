import { useEffect, useMemo, useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useSEO } from "@/hooks/use-seo";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import { Link } from "wouter";
import type { Tour, Hotel, Season, ItineraryDay } from "@shared/schema";
import { getTourImageAlt } from "@/lib/seo-alt-text";
import { getResponsiveImageProps } from "@/lib/responsive-image";
import ItineraryMap from "@/components/tour-detail/ItineraryMap";
import WhereYouWillStay from "@/components/tour-detail/WhereYouWillStay";
import CtaBanner from "@/components/tour-detail/CtaBanner";
import InclusionsList from "@/components/tour-detail/InclusionsList";
import ReserveJourneyModal from "@/components/tour-detail/ReserveJourneyModal";
import DatesAndPrices from "@/components/tour-detail/DatesAndPrices";
import ContinueTheJourney from "@/components/tour-detail/ContinueTheJourney";
import WhyILuxurySection from "@/components/tour-detail/WhyILuxurySection";
import TourStickyNav, { type TourStickyNavSection } from "@/components/tour-detail/TourStickyNav";
import WhyYoullLoveJourneySection from "@/components/tour-detail/WhyYoullLoveJourneySection";
import ReadBeforeYouGoSection from "@/components/tour-detail/ReadBeforeYouGoSection";
import { buildTourHighlights } from "@/lib/tour-highlights";
import { buildTourFaqs } from "@/lib/tour-faq";
import FaqSection, { buildFaqJsonLd } from "@/components/faq-section";

const blockedSlugs = new Set(["aswan-city-tour-philae-temple-high-dam"]);

// Full candidate list, in page order — TourStickyNav checks the live DOM on
// mount and only shows tabs for ids that actually rendered, since several
// of these sections (gallery, itinerary, stays, why-love, read-before-you-go,
// continue-journey) return null when a given tour has no matching data.
const TOUR_NAV_SECTIONS: TourStickyNavSection[] = [
  { id: "overview", label: "Overview" },
  { id: "gallery", label: "Gallery" },
  { id: "itinerary", label: "Itinerary" },
  { id: "why-love", label: "Why You'll Love This Journey" },
  { id: "stays", label: "Hotels & Stays" },
  { id: "why-iluxury", label: "Why iLuxury Egypt" },
  { id: "inclusions", label: "Inclusions" },
  { id: "dates-prices", label: "Dates & Prices" },
  { id: "tour-faq", label: "FAQ" },
  { id: "read-before-you-go", label: "Read Before You Go" },
  { id: "continue-journey", label: "Continue the Journey" },
];

export default function TourDetail() {
  const params = useParams();
  const slug = params.slug || params.id || "";
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [showBrochureModal, setShowBrochureModal] = useState(false);
  const [brochureEmail, setBrochureEmail] = useState("");
  const [isSubmittingBrochure, setIsSubmittingBrochure] = useState(false);

  const { data, isLoading, isError } = useQuery<{ success: boolean; tour: Tour; hotels: Hotel[] }>({
    queryKey: ["/api/public/tours", slug],
    queryFn: async () => {
      const res = await fetch(`/api/public/tours/${slug}`);
      if (!res.ok) throw new Error("Failed to fetch tour");
      return res.json();
    },
    enabled: Boolean(slug) && !blockedSlugs.has(slug),
  });

  const tour = data?.tour;
  const stayHotels = data?.hotels || [];

  const tourHighlights = useMemo(
    () => (tour ? buildTourHighlights(tour, stayHotels) : []),
    [tour, stayHotels]
  );

  const tourFaqs = useMemo(
    () => (tour ? buildTourFaqs(tour, stayHotels) : []),
    [tour, stayHotels]
  );

  // All published tours, used for the "Continue the Journey" similarity matching
  const { data: allToursData } = useQuery<{ success: boolean; tours: Tour[] }>({
    queryKey: ["/api/public/tours"],
    queryFn: async () => {
      const res = await fetch(`/api/public/tours`);
      if (!res.ok) throw new Error("Failed to fetch tours");
      return res.json();
    },
    enabled: Boolean(tour),
  });

  // Active seasons, used to compute the "Dates & Prices" peak-season price
  const { data: seasonsData } = useQuery<{ success: boolean; seasons: Season[] }>({
    queryKey: ["/api/public/seasons"],
    queryFn: async () => {
      const res = await fetch(`/api/public/seasons`);
      if (!res.ok) throw new Error("Failed to fetch seasons");
      return res.json();
    },
    enabled: Boolean(tour),
  });

  // Use tour's brochure URL if available
  const brochureUrl = tour?.brochureUrl;

  useSEO({
    title: tour?.title,
    description: tour?.shortDescription || tour?.description?.slice(0, 160),
    image: tour?.heroImage,
    type: "article",
    jsonLd: buildFaqJsonLd(tourFaqs),
  });

  if (!slug || blockedSlugs.has(slug)) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-32 pb-16 text-center">
          <h1 className="text-4xl font-serif font-bold text-primary mb-4">Tour Not Found</h1>
          <p className="text-muted-foreground">This tour is no longer available.</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading experience...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isError || !tour) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-32 pb-16 text-center">
          <h1 className="text-4xl font-serif font-bold text-primary mb-4">Tour Not Found</h1>
          <p className="text-muted-foreground">We could not load this tour. Please try again.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const itinerary = (Array.isArray(tour.itinerary) ? tour.itinerary : []).map(
    (day: ItineraryDay, index: number) => ({
      day: day.day ?? index + 1,
      title: day.title || `Day ${index + 1}`,
      description: day.description || "",
      activities: Array.isArray(day.activities) ? day.activities : [],
      meals: Array.isArray(day.meals) ? day.meals : [],
      lat: day.lat,
      lng: day.lng,
      image: day.image,
      accommodation: day.accommodation,
      placeName: day.placeName,
    })
  );

  const location = tour.destinations?.length ? tour.destinations.join(" • ") : "Egypt";
  const currency = tour.currency || "USD";
  const allImages = [tour.heroImage, ...(tour.gallery || [])];

  const handleBrochureDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brochureEmail || !brochureUrl) return;
    setIsSubmittingBrochure(true);

    try {
      const response = await fetch("/api/brochure-downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: brochureEmail,
          tourId: tour?.id,
          tourTitle: tour?.title,
          tourSlug: tour?.slug,
        }),
      });

      if (response.ok) {
        // Open brochure in new tab
        window.open(brochureUrl, "_blank");
        setShowBrochureModal(false);
        setBrochureEmail("");
        toast({ title: "Thank you!", description: "Your brochure is downloading." });
      } else {
        throw new Error("Failed to submit");
      }
    } catch (error) {
      toast({ title: "Error", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsSubmittingBrochure(false);
    }
  };

  return (
    <>
      <Navigation />

      {/* Hero Section - Full Screen */}
      <section className="relative h-[70vh] md:h-screen w-full">
        <div className="absolute inset-0">
          <img
            {...getResponsiveImageProps(tour.heroImage)}
            alt={getTourImageAlt(tour)}
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-end pb-12 md:pb-24 px-4">
          <div className="max-w-6xl mx-auto w-full text-center">
            {/* Gold accent line */}
            <div className="w-16 md:w-24 h-px bg-accent mx-auto mb-4 md:mb-8"></div>

            {/* Category & Duration */}
            <div className="flex items-center justify-center gap-2 md:gap-4 mb-3 md:mb-6 text-white/80">
              <span className="text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase">{tour.category}</span>
              <span className="w-1 h-1 bg-accent rounded-full"></span>
              <span className="text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase">{tour.duration}</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-serif font-light text-white mb-4 md:mb-8 leading-tight px-2">
              {tour.title}
            </h1>

            {/* Location */}
            <div className="flex items-center justify-center gap-2 text-white/70">
              <MapPin className="h-3 w-3 md:h-4 md:w-4 text-accent" />
              <span className="text-sm md:text-lg font-light tracking-wide">{location}</span>
            </div>

            {/* Scroll indicator - hidden on mobile */}
            <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
              <div className="w-6 h-10 border border-white/30 rounded-full flex items-start justify-center p-2">
                <div className="w-1 h-2 bg-accent rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TourStickyNav sections={TOUR_NAV_SECTIONS} price={tour.price} currency={currency} />

      {/* Main Content */}
      <section className="relative bg-background">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-20">
          <div className="max-w-4xl mx-auto space-y-10 md:space-y-20">

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:flex md:flex-wrap justify-center lg:justify-start gap-4 md:gap-8 lg:gap-12 py-6 md:py-8 border-y border-border">
                <div className="text-center">
                  <Clock className="h-5 w-5 md:h-6 md:w-6 text-accent mx-auto mb-1 md:mb-2" />
                  <p className="text-lg md:text-2xl font-serif text-primary">{tour.duration}</p>
                  <p className="text-xs md:text-sm text-muted-foreground uppercase tracking-wide">Duration</p>
                </div>
                <div className="text-center">
                  <Users className="h-5 w-5 md:h-6 md:w-6 text-accent mx-auto mb-1 md:mb-2" />
                  <p className="text-lg md:text-2xl font-serif text-primary">{tour.groupSize || "Private"}</p>
                  <p className="text-xs md:text-sm text-muted-foreground uppercase tracking-wide">Group Size</p>
                </div>
                <div className="text-center">
                  <MapPin className="h-5 w-5 md:h-6 md:w-6 text-accent mx-auto mb-1 md:mb-2" />
                  <p className="text-lg md:text-2xl font-serif text-primary">{tour.destinations?.length || 1}</p>
                  <p className="text-xs md:text-sm text-muted-foreground uppercase tracking-wide">Destinations</p>
                </div>
                <div className="text-center">
                  <Calendar className="h-5 w-5 md:h-6 md:w-6 text-accent mx-auto mb-1 md:mb-2" />
                  <p className="text-lg md:text-2xl font-serif text-primary">Daily</p>
                  <p className="text-xs md:text-sm text-muted-foreground uppercase tracking-wide">Departures</p>
                </div>
              </div>

              {/* Overview */}
              <div id="overview">
                <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-8">
                  <div className="w-8 md:w-12 h-px bg-accent"></div>
                  <h2 className="text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase text-accent-text">The Experience</h2>
                </div>
                <p className="text-base md:text-xl lg:text-2xl font-serif font-light text-primary leading-relaxed">
                  {tour.description}
                </p>
              </div>

              {/* Cinematic Gallery */}
              {allImages.length > 1 && (
                <div id="gallery">
                  <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-8">
                    <div className="w-8 md:w-12 h-px bg-accent"></div>
                    <h2 className="text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase text-accent-text">Gallery</h2>
                  </div>

                  {/* Main Image */}
                  <div className="relative aspect-[16/9] overflow-hidden rounded-lg mb-4 cursor-pointer group"
                       onClick={() => setIsLightboxOpen(true)}>
                    <img
                      src={allImages[selectedImage]}
                      alt={getTourImageAlt(tour, selectedImage)}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                    {allImages.length > 1 && (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedImage(prev => prev === 0 ? allImages.length - 1 : prev - 1); }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="h-6 w-6 text-primary" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedImage(prev => prev === allImages.length - 1 ? 0 : prev + 1); }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100"
                          aria-label="Next image"
                        >
                          <ChevronRight className="h-6 w-6 text-primary" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Thumbnails */}
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {allImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`flex-shrink-0 w-28 h-20 rounded-lg overflow-hidden transition-all duration-300 ${
                          selectedImage === idx
                            ? 'ring-2 ring-accent ring-offset-2 opacity-100'
                            : 'opacity-50 hover:opacity-80'
                        }`}
                      >
                        <img src={img} alt={getTourImageAlt(tour, idx)} className="w-full h-full object-cover" loading="lazy" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      </section>

      <ItineraryMap
        itinerary={itinerary}
        tourTitle={tour.title}
        price={tour.price}
        currency={currency}
        duration={tour.duration}
        groupSize={tour.groupSize}
      />

      <WhyYoullLoveJourneySection tourTitle={tour.title} highlights={tourHighlights} />

      <WhereYouWillStay hotels={stayHotels} />

      <WhyILuxurySection tour={tour} hotels={stayHotels} />

      <CtaBanner tour={tour} onReserve={() => setIsReserveModalOpen(true)} />

      <InclusionsList includes={tour.includes} excludes={tour.excludes} />

      <DatesAndPrices basePrice={tour.price} currency={currency} seasons={seasonsData?.seasons || []} />

      <FaqSection id="tour-faq" faqs={tourFaqs} testId="tour-faq-section" />

      <ReadBeforeYouGoSection />

      <ContinueTheJourney currentTour={tour} allTours={allToursData?.tours || []} />

      <ReserveJourneyModal tour={tour} open={isReserveModalOpen} onOpenChange={setIsReserveModalOpen} />

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
          <button
            onClick={(e) => { e.stopPropagation(); setSelectedImage(prev => prev === 0 ? allImages.length - 1 : prev - 1); }}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-7 w-7 text-white" />
          </button>
          <img
            src={allImages[selectedImage]}
            alt={getTourImageAlt(tour, selectedImage)}
            className="max-w-[90vw] max-h-[85vh] object-contain"
            loading="eager"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => { e.stopPropagation(); setSelectedImage(prev => prev === allImages.length - 1 ? 0 : prev + 1); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
            aria-label="Next image"
          >
            <ChevronRight className="h-7 w-7 text-white" />
          </button>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {allImages.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setSelectedImage(idx); }}
                className={`w-2 h-2 rounded-full transition-all ${
                  selectedImage === idx ? 'bg-accent w-6' : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Fixed Brochure Download Button */}
      {brochureUrl && (
        <button
          onClick={() => setShowBrochureModal(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-3 rounded-full shadow-2xl transition-all hover:scale-105 group"
        >
          <Download className="h-5 w-5 group-hover:animate-bounce" />
          <span className="font-medium">Download Brochure</span>
        </button>
      )}

      {/* Brochure Email Modal */}
      {showBrochureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="bg-primary p-6 text-white">
              <h3 className="text-xl font-serif font-semibold">Download Brochure</h3>
              <p className="text-white/80 text-sm mt-1">Enter your email to receive the brochure</p>
            </div>
            <form onSubmit={handleBrochureDownload} className="p-6 space-y-4">
              <div>
                <label htmlFor="brochure-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input
                  id="brochure-email"
                  type="email"
                  value={brochureEmail}
                  onChange={(e) => setBrochureEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowBrochureModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingBrochure || !brochureEmail}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  {isSubmittingBrochure ? "Submitting..." : "Download"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
