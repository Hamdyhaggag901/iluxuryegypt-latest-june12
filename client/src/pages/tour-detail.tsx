import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useSEO } from "@/hooks/use-seo";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Send,
  Phone,
  Mail,
  Download,
  Shield,
  Star,
} from "lucide-react";
import { Link } from "wouter";
import type { Tour } from "@shared/schema";

const blockedSlugs = new Set(["aswan-city-tour-philae-temple-high-dam"]);

type ItineraryDay = {
  day?: number;
  title?: string;
  description?: string;
  activities?: string[];
};

export default function TourDetail() {
  const params = useParams();
  const slug = params.slug || params.id || "";
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showBrochureModal, setShowBrochureModal] = useState(false);
  const [brochureEmail, setBrochureEmail] = useState("");
  const [isSubmittingBrochure, setIsSubmittingBrochure] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    preferredDates: "",
    guests: "",
    specialRequests: "",
  });

  const { data, isLoading, isError } = useQuery<{ success: boolean; tour: Tour }>({
    queryKey: ["/api/public/tours", slug],
    queryFn: async () => {
      const res = await fetch(`/api/public/tours/${slug}`);
      if (!res.ok) throw new Error("Failed to fetch tour");
      return res.json();
    },
    enabled: Boolean(slug) && !blockedSlugs.has(slug),
  });

  const tour = data?.tour;

  // Fetch related tours from the same category
  const { data: relatedData } = useQuery<{ success: boolean; tours: Tour[] }>({
    queryKey: ["/api/public/tours", "related", tour?.category],
    queryFn: async () => {
      const res = await fetch(`/api/public/tours?category=${encodeURIComponent(tour!.category)}`);
      if (!res.ok) throw new Error("Failed to fetch related tours");
      return res.json();
    },
    enabled: Boolean(tour?.category),
  });

  // Use tour's brochure URL if available
  const brochureUrl = tour?.brochureUrl;

  const relatedTours = (relatedData?.tours || [])
    .filter(t => t.id !== tour?.id)
    .slice(0, 3);

  useSEO({
    title: tour?.title,
    description: tour?.shortDescription || tour?.description?.slice(0, 160),
    image: tour?.heroImage,
    type: "article",
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
    })
  );

  const location = tour.destinations?.length ? tour.destinations.join(" • ") : "Egypt";
  const currency = tour.currency || "USD";
  const priceLabel = new Intl.NumberFormat("en-US").format(tour.price);
  const allImages = [tour.heroImage, ...(tour.gallery || [])];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tour) return;
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/tour-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourId: tour.id,
          tourTitle: tour.title,
          tourSlug: tour.slug,
          tourPrice: tour.price,
          tourDuration: tour.duration,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone || undefined,
          preferredDates: formData.preferredDates || undefined,
          numberOfGuests: formData.guests ? parseInt(formData.guests) : undefined,
          specialRequests: formData.specialRequests || undefined,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({ title: "Request Received", description: "Our travel experts will contact you within 24 hours." });
        setFormData({ fullName: "", email: "", phone: "", preferredDates: "", guests: "", specialRequests: "" });
      } else {
        throw new Error(result.message || "Failed to send");
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Please try again or contact us directly.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            src={tour.heroImage}
            alt={tour.title}
            className="w-full h-full object-cover"
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

      {/* Main Content with Floating Booking Card */}
      <section className="relative bg-background">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-20">
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 lg:gap-16">

            {/* Mobile Booking Card - Shows first on mobile */}
            <div className="lg:hidden order-first">
              <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
                {/* Price Header */}
                <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] p-4 text-center">
                  <p className="text-white/70 text-xs tracking-[0.2em] uppercase mb-1">Starting From</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-accent text-base">{currency}</span>
                    <span className="text-3xl font-serif text-white">{priceLabel}</span>
                  </div>
                  <p className="text-white/60 text-xs mt-1">per person</p>
                </div>
                <div className="p-4">
                  <Link href="#booking-form">
                    <Button className="w-full bg-accent hover:bg-accent/90 text-primary font-semibold py-4">
                      Book This Experience
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Left Content */}
            <div className="lg:col-span-2 space-y-10 md:space-y-20 order-2 lg:order-1">

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
              <div>
                <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-8">
                  <div className="w-8 md:w-12 h-px bg-accent"></div>
                  <h2 className="text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase text-accent">The Experience</h2>
                </div>
                <p className="text-base md:text-xl lg:text-2xl font-serif font-light text-primary leading-relaxed">
                  {tour.description}
                </p>
              </div>

              {/* Cinematic Gallery */}
              {allImages.length > 1 && (
                <div>
                  <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-8">
                    <div className="w-8 md:w-12 h-px bg-accent"></div>
                    <h2 className="text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase text-accent">Gallery</h2>
                  </div>

                  {/* Main Image */}
                  <div className="relative aspect-[16/9] overflow-hidden rounded-lg mb-4 cursor-pointer group"
                       onClick={() => setIsLightboxOpen(true)}>
                    <img
                      src={allImages[selectedImage]}
                      alt={`${tour.title} - Image ${selectedImage + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                    {allImages.length > 1 && (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedImage(prev => prev === 0 ? allImages.length - 1 : prev - 1); }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <ChevronLeft className="h-6 w-6 text-primary" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedImage(prev => prev === allImages.length - 1 ? 0 : prev + 1); }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100"
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
                        <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Visual Timeline Itinerary */}
              {itinerary.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-12">
                    <div className="w-8 md:w-12 h-px bg-accent"></div>
                    <h2 className="text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase text-accent">Your Journey</h2>
                  </div>

                  <div className="relative">
                    {/* Vertical gold line */}
                    <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-accent via-accent/50 to-transparent"></div>

                    <div className="space-y-8 md:space-y-12">
                      {itinerary.map((day, index) => (
                        <div key={day.day} className="relative pl-12 md:pl-16">
                          {/* Day number circle */}
                          <div className="absolute left-0 top-0 w-8 h-8 md:w-12 md:h-12 rounded-full bg-primary text-white flex items-center justify-center font-serif text-sm md:text-lg border-2 md:border-4 border-background">
                            {day.day}
                          </div>

                          <div>
                            <h3 className="text-lg md:text-2xl font-serif text-primary mb-2">{day.title}</h3>
                            {day.description && (
                              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-3 md:mb-4">{day.description}</p>
                            )}
                            {day.activities.length > 0 && (
                              <ul className="space-y-1.5 md:space-y-2">
                                {day.activities.map((activity, idx) => (
                                  <li key={idx} className="flex items-start gap-2 md:gap-3 text-sm md:text-base text-muted-foreground">
                                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                    <span>{activity}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div>
                  <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                    <div className="w-6 md:w-8 h-px bg-accent"></div>
                    <h3 className="text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase text-accent">Included</h3>
                  </div>
                  {tour.includes.length === 0 ? (
                    <p className="text-sm md:text-base text-muted-foreground">Details available upon request.</p>
                  ) : (
                    <ul className="space-y-2 md:space-y-3">
                      {tour.includes.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 md:gap-3 text-sm md:text-base text-primary">
                          <Check className="h-4 w-4 md:h-5 md:w-5 text-accent mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                    <div className="w-6 md:w-8 h-px bg-muted-foreground/30"></div>
                    <h3 className="text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase text-muted-foreground">Not Included</h3>
                  </div>
                  {tour.excludes.length === 0 ? (
                    <p className="text-sm md:text-base text-muted-foreground">Details available upon request.</p>
                  ) : (
                    <ul className="space-y-2 md:space-y-3">
                      {tour.excludes.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 md:gap-3 text-sm md:text-base text-muted-foreground">
                          <X className="h-4 w-4 md:h-5 md:w-5 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar - Elegant Booking Card (Desktop only) */}
            <div className="hidden lg:block lg:col-span-1 order-3">
              <div className="lg:sticky lg:top-28" id="booking-form">
                <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                  {/* Price Header */}
                  <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] p-6 text-center">
                    <p className="text-white/70 text-xs tracking-[0.2em] uppercase mb-1">Starting From</p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-accent text-lg">{currency}</span>
                      <span className="text-4xl font-serif text-white">{priceLabel}</span>
                    </div>
                    <p className="text-white/60 text-sm mt-1">per person</p>
                  </div>

                  {/* Form */}
                  <div className="p-6">
                    <h3 className="text-lg font-serif text-primary mb-4 text-center">Book Your Experience</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Full Name *</label>
                        <Input
                          placeholder="John Smith"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          required
                          className="border-gray-200 focus:border-accent focus:ring-accent/20"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Email Address *</label>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="border-gray-200 focus:border-accent focus:ring-accent/20"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Phone Number</label>
                        <Input
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="border-gray-200 focus:border-accent focus:ring-accent/20"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Travel Date</label>
                          <Input
                            type="date"
                            value={formData.preferredDates}
                            onChange={(e) => setFormData({ ...formData, preferredDates: e.target.value })}
                            className="border-gray-200 focus:border-accent focus:ring-accent/20"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Guests</label>
                          <Input
                            type="number"
                            placeholder="2"
                            min="1"
                            value={formData.guests}
                            onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                            className="border-gray-200 focus:border-accent focus:ring-accent/20"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Special Requests</label>
                        <Textarea
                          placeholder="Any special requirements or preferences..."
                          value={formData.specialRequests}
                          onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                          rows={3}
                          className="border-gray-200 focus:border-accent focus:ring-accent/20 resize-none"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-accent hover:bg-accent/90 text-primary font-semibold py-6 text-base shadow-lg shadow-accent/20 transition-all hover:shadow-xl hover:shadow-accent/30"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Sending..." : "Request This Experience"}
                      </Button>
                    </form>

                    {/* Trust Badges */}
                    <div className="mt-6 pt-5 border-t border-gray-100 space-y-3">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Shield className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Free cancellation up to 48 hours</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Star className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Instant confirmation</span>
                      </div>
                    </div>

                    {/* Contact Options */}
                    <div className="mt-5 pt-5 border-t border-gray-100">
                      <p className="text-gray-400 text-xs text-center mb-3 uppercase tracking-wide">Or Contact Directly</p>
                      <div className="flex justify-center gap-6">
                        <a href="tel:+201234567890" className="flex items-center gap-2 text-gray-600 hover:text-accent transition-colors">
                          <Phone className="h-4 w-4" />
                          <span className="text-sm font-medium">Call</span>
                        </a>
                        <a href="mailto:concierge@iluxuryegypt.com" className="flex items-center gap-2 text-gray-600 hover:text-accent transition-colors">
                          <Mail className="h-4 w-4" />
                          <span className="text-sm font-medium">Email</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Booking Form - Shows at bottom on mobile */}
            <div className="lg:hidden order-last mt-8" id="booking-form">
              <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
                <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] p-4 text-center">
                  <p className="text-white/70 text-xs tracking-[0.2em] uppercase mb-1">Starting From</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-accent text-base">{currency}</span>
                    <span className="text-3xl font-serif text-white">{priceLabel}</span>
                  </div>
                  <p className="text-white/60 text-xs mt-1">per person</p>
                </div>

                <div className="p-4">
                  <h3 className="text-base font-serif text-primary mb-4 text-center">Book Your Experience</h3>
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Full Name *</label>
                      <Input
                        placeholder="John Smith"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                        className="border-gray-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Email Address *</label>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="border-gray-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Phone Number</label>
                      <Input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="border-gray-200 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Date</label>
                        <Input
                          type="date"
                          value={formData.preferredDates}
                          onChange={(e) => setFormData({ ...formData, preferredDates: e.target.value })}
                          className="border-gray-200 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Guests</label>
                        <Input
                          type="number"
                          placeholder="2"
                          min="1"
                          value={formData.guests}
                          onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                          className="border-gray-200 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Special Requests</label>
                      <Textarea
                        placeholder="Any special requirements..."
                        value={formData.specialRequests}
                        onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                        rows={2}
                        className="border-gray-200 text-sm resize-none"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-accent hover:bg-accent/90 text-primary font-semibold py-5 text-sm"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Request This Experience"}
                    </Button>
                  </form>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-center gap-6">
                    <a href="tel:+201234567890" className="flex items-center gap-2 text-gray-600 text-sm">
                      <Phone className="h-4 w-4" />
                      <span>Call</span>
                    </a>
                    <a href="mailto:concierge@iluxuryegypt.com" className="flex items-center gap-2 text-gray-600 text-sm">
                      <Mail className="h-4 w-4" />
                      <span>Email</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Tours Section */}
      {relatedTours.length > 0 && (
        <section className="py-12 md:py-24 bg-[#f8f6f3]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8 md:mb-16">
              <div className="w-12 md:w-16 h-px bg-accent mx-auto mb-4 md:mb-6"></div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-light text-primary mb-2 md:mb-4">
                Continue Your Journey
              </h2>
              <p className="text-sm md:text-base text-muted-foreground">More experiences you might love</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
              {relatedTours.map((t) => (
                <Link key={t.id} href={`/${t.slug}`}>
                  <div className="group cursor-pointer">
                    <div className="relative aspect-[4/3] md:aspect-[4/5] overflow-hidden rounded-xl md:rounded-2xl shadow-lg mb-3 md:mb-4">
                      <img
                        src={t.heroImage}
                        alt={t.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6">
                        <span className="text-accent text-xs tracking-[0.2em] uppercase">{t.duration}</span>
                        <h3 className="text-base md:text-xl font-serif text-white mt-1 md:mt-2 group-hover:text-accent transition-colors">
                          {t.title}
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground text-xs md:text-sm">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 md:h-4 md:w-4" />
                        {t.destinations?.[0] || "Egypt"}
                      </span>
                      <span className="text-primary font-medium">From ${t.price.toLocaleString()}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8 md:mt-12">
              <Link href="/egypt-tour-packages">
                <Button className="bg-primary hover:bg-primary/90 text-white px-6 md:px-8 py-4 md:py-6 text-sm md:text-base">
                  View All Experiences
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
          >
            <X className="h-6 w-6 text-white" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setSelectedImage(prev => prev === 0 ? allImages.length - 1 : prev - 1); }}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
          >
            <ChevronLeft className="h-7 w-7 text-white" />
          </button>
          <img
            src={allImages[selectedImage]}
            alt={`${tour.title} - Image ${selectedImage + 1}`}
            className="max-w-[90vw] max-h-[85vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => { e.stopPropagation(); setSelectedImage(prev => prev === allImages.length - 1 ? 0 : prev + 1); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
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
