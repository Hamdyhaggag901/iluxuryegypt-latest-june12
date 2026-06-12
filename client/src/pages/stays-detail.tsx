import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, MapPin, ArrowLeft, Home, X, Clock } from "lucide-react";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import ScrollToTopButton from "../components/scroll-to-top-button";
import type { Hotel, Tour } from "@shared/schema";

// ─── JSON-LD LodgingBusiness schema ──────────────────────────────────────────
function HotelJsonLd({ hotel }: { hotel: Hotel }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: hotel.name,
    description: hotel.metaDescription || hotel.description,
    image: hotel.image,
    address: {
      "@type": "PostalAddress",
      addressLocality: hotel.location,
      addressCountry: "EG",
    },
    url: typeof window !== "undefined" ? window.location.href : "",
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

// ─── Gallery Lightbox ─────────────────────────────────────────────────────────
function GalleryLightbox({ images, hotelName, location, onClose, startIndex }: {
  images: string[];
  hotelName: string;
  location: string;
  onClose: () => void;
  startIndex: number;
}) {
  const [current, setCurrent] = useState(startIndex);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setCurrent((c) => (c + 1) % images.length);
      if (e.key === "ArrowLeft") setCurrent((c) => (c - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [images.length, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white/70 hover:text-white z-10"
        onClick={onClose}
      >
        <X className="w-8 h-8" />
      </button>
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-4xl z-10 px-4 py-2"
        onClick={(e) => { e.stopPropagation(); setCurrent((c) => (c - 1 + images.length) % images.length); }}
      >
        ‹
      </button>
      <img
        src={images[current]}
        alt={`${hotelName} – ${location} luxury hotel`}
        className="max-h-[90vh] max-w-[90vw] object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-4xl z-10 px-4 py-2"
        onClick={(e) => { e.stopPropagation(); setCurrent((c) => (c + 1) % images.length); }}
      >
        ›
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm">
        {current + 1} / {images.length}
      </div>
    </div>
  );
}

// ─── FAQ accordion ────────────────────────────────────────────────────────────
function FaqItem({ question, answer, isOpen, onToggle }: { question: string; answer: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-[#c9a96e]/20">
      <button
        className="w-full text-left flex items-center justify-between py-5 px-1 group"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="font-serif text-[#1a2332] text-lg pr-8 group-hover:text-[#c9a96e] transition-colors">{question}</span>
        <ChevronDown className={`w-5 h-5 text-[#c9a96e] flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 pb-5" : "max-h-0"}`}>
        <p className="text-[#1a2332]/70 leading-relaxed px-1">{answer}</p>
      </div>
    </div>
  );
}

// ─── Related tour card ────────────────────────────────────────────────────────
function RelatedTourCard({ tour }: { tour: Tour }) {
  return (
    <Link href={`/${tour.slug}`}>
      <div className="group cursor-pointer overflow-hidden rounded-sm shadow-md hover:shadow-xl transition-shadow">
        <div className="relative h-48 overflow-hidden">
          <img
            src={tour.heroImage}
            alt={tour.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-[#1a2332]/40" />
        </div>
        <div className="bg-[#1a2332] px-5 py-4">
          <div className="flex items-center text-[#c9a96e] text-xs mb-2">
            <Clock className="w-3.5 h-3.5 mr-1" />
            <span>{tour.duration}</span>
          </div>
          <h4 className="text-white font-serif text-base font-bold leading-snug line-clamp-2">{tour.title}</h4>
        </div>
      </div>
    </Link>
  );
}

// ─── Default article fallback ─────────────────────────────────────────────────
function defaultArticleFor(hotel: Hotel): string {
  return `<p>From the moment you arrive at ${hotel.name}, it becomes clear that this is no ordinary hotel. Set in the heart of ${hotel.location}, this remarkable property has established itself as one of the defining luxury addresses in Egypt — a place where world-class service meets an environment of genuine historical and cultural resonance.</p>
<h2>An Exceptional Setting</h2>
<p>The hotel occupies a privileged position in ${hotel.location}, placing guests within immediate reach of the region's most celebrated attractions while offering a sanctuary of calm and elegance. The architecture balances grandeur with intimacy, creating spaces that feel both impressively appointed and genuinely welcoming.</p>
<h2>A Commitment to Excellence</h2>
<p>The team at ${hotel.name} understands that luxury is ultimately a matter of attention — attention to the details that guests remember long after they return home. Every interaction, from the morning coffee to the arrangement of a private excursion, is handled with the same care and precision that defines the very best hospitality in the world.</p>
<blockquote>To stay at ${hotel.name} is to experience Egypt at its most refined — a journey that honours both the ancient and the contemporary.</blockquote>
<h3>Dining and Cuisine</h3>
<p>The culinary programme draws on Egypt's extraordinarily rich food culture, offering both authentic regional dishes and international cuisine of the highest standard. Breakfast on the terrace, with views extending across ${hotel.location}, sets the tone for a day of exploration and discovery.</p>
<h3>Planning Your Stay</h3>
<p>Our specialists are available to assist with every aspect of your visit to ${hotel.name}, from securing your preferred room category to arranging private guides, transfers, and exclusive experiences. We encourage guests to enquire well in advance, as the most desirable room types and experiences can be reserved months ahead.</p>`;
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function StaysDetail() {
  const [match, params] = useRoute("/stays/:slug");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const slug = params?.slug || "";

  const { data: hotelResponse, isLoading, error } = useQuery<{ success: boolean; hotel: Hotel }>({
    queryKey: ["/api/hotels", slug],
    queryFn: () => fetch(`/api/hotels/${slug}`).then((r) => r.json()),
    enabled: !!slug,
  });

  const hotel = hotelResponse?.hotel;

  // Fetch all tours to find related ones
  const { data: toursData } = useQuery<{ success: boolean; tours: Tour[] }>({
    queryKey: ["/api/public/tours"],
    enabled: !!hotel,
  });

  // Update page title & meta dynamically
  useEffect(() => {
    if (!hotel) return;
    document.title = hotel.metaTitle
      ? hotel.metaTitle
      : `${hotel.name} | Luxury Hotel in ${hotel.location} | iLUXURY EGYPT`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && hotel.metaDescription) {
      metaDesc.setAttribute("content", hotel.metaDescription);
    }
  }, [hotel]);

  if (!match) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf9f7]">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-[#c9a96e] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#1a2332]/50 font-serif">Loading property details…</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen bg-[#faf9f7]">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center px-4">
            <h1 className="font-serif text-4xl font-bold text-[#1a2332] mb-4">Property Not Found</h1>
            <p className="text-[#1a2332]/60 mb-8">This hotel may have moved or been removed from our portfolio.</p>
            <Link href="/stays">
              <button className="bg-[#1a2332] text-white px-8 py-3 font-medium hover:bg-[#c9a96e] transition-colors">
                Return to Stays
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const gallery = (hotel.gallery || []) as string[];
  const amenities = (hotel.amenities || []) as string[];
  const hotelFaqs = (hotel.hotelFaqs || []) as { question: string; answer: string }[];
  const articleBody = hotel.articleBody || defaultArticleFor(hotel);

  // Related tours: same region or destinations that include this hotel's location
  const relatedTours = (toursData?.tours || [])
    .filter((t) =>
      t.featured ||
      (t.destinations || []).some((d) => d.toLowerCase().includes(hotel.location.toLowerCase()) || d.toLowerCase().includes(hotel.region.toLowerCase()))
    )
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {hotel && <HotelJsonLd hotel={hotel} />}
      <Navigation />

      {/* ── SECTION 1: Hero ─────────────────────────────────────────────────── */}
      <section className="relative h-[85vh] flex items-end justify-start overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${hotel.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a2332]/90 via-[#1a2332]/30 to-[#1a2332]/20" />

        {/* Top nav bar inside hero */}
        <div className="absolute top-0 left-0 right-0 z-10 px-6 pt-24 md:pt-28 flex items-center justify-between">
          <Link href="/stays">
            <button className="flex items-center gap-2 text-white/80 hover:text-[#c9a96e] transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" />
              Back to Stays
            </button>
          </Link>
          {/* Breadcrumb */}
          <nav className="hidden md:flex items-center gap-2 text-white/50 text-xs">
            <Link href="/"><span className="hover:text-[#c9a96e] transition-colors flex items-center gap-1"><Home className="w-3 h-3" /> Home</span></Link>
            <span>/</span>
            <Link href="/stays"><span className="hover:text-[#c9a96e] transition-colors">Stays</span></Link>
            <span>/</span>
            <span className="text-white/80 truncate max-w-40">{hotel.name}</span>
          </nav>
        </div>

        {/* Hotel name / location overlay */}
        <div className="relative z-10 px-6 md:px-12 pb-12 md:pb-16 max-w-4xl">
          <div className="flex items-center text-[#c9a96e] text-sm mb-4">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{hotel.location}, {hotel.region}</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4">
            {hotel.name}
          </h1>
          <p className="text-white/70 text-lg max-w-xl leading-relaxed">{hotel.description}</p>
        </div>
      </section>

      <main>
        {/* ── SECTION 2: Long-form Article ──────────────────────────────────── */}
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-6">
            <div
              className="
                prose prose-lg max-w-none
                text-[#1a2332]/80 leading-relaxed
                [&_h2]:font-serif [&_h2]:text-[#1a2332] [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-5
                [&_h3]:font-serif [&_h3]:text-[#1a2332] [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-4
                [&_blockquote]:border-l-4 [&_blockquote]:border-[#c9a96e] [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:text-[#1a2332]/70 [&_blockquote]:my-8
                [&_p]:mb-5
                [&_a]:text-[#c9a96e] [&_a]:underline
                [&_strong]:text-[#1a2332]
              "
              dangerouslySetInnerHTML={{ __html: articleBody }}
            />

            {/* Book This Stay CTA */}
            <div className="mt-14 pt-10 border-t border-[#c9a96e]/20">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="font-serif text-[#1a2332] text-xl font-bold">Ready to experience {hotel.name}?</p>
                  <p className="text-[#1a2332]/60 text-sm mt-1">Our specialists will arrange every detail of your stay.</p>
                </div>
                <Link href="/contact">
                  <button className="bg-[#c9a96e] text-white px-8 py-4 font-medium tracking-wide uppercase text-sm hover:bg-[#b8944f] transition-colors flex-shrink-0">
                    Book This Stay
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: Amenities Tags ──────────────────────────────────────── */}
        {amenities.length > 0 && (
          <section className="py-14 bg-[#faf9f7]">
            <div className="max-w-5xl mx-auto px-6">
              <p className="tracking-[0.25em] uppercase text-[#c9a96e] text-xs font-medium mb-6">Amenities & Features</p>
              <div className="flex flex-wrap gap-3">
                {amenities.map((amenity, i) => (
                  <span
                    key={i}
                    className="border border-[#c9a96e] text-[#c9a96e] px-4 py-2 text-sm rounded-sm tracking-wide"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── SECTION 4: Photo Gallery ───────────────────────────────────────── */}
        {gallery.length > 0 && (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6">
              <p className="tracking-[0.25em] uppercase text-[#c9a96e] text-xs font-medium mb-6">Sites Gallery</p>
              <div className={`grid gap-3 ${gallery.length === 1 ? "grid-cols-1" : gallery.length === 2 ? "grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}>
                {gallery.map((img, i) => (
                  <div
                    key={i}
                    className={`relative overflow-hidden cursor-pointer group ${i === 0 && gallery.length > 2 ? "md:col-span-2 lg:col-span-2 h-80" : "h-56"}`}
                    onClick={() => setLightboxIndex(i)}
                  >
                    <img
                      src={img}
                      alt={`${hotel.name} – ${hotel.location} luxury hotel`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-[#1a2332]/0 group-hover:bg-[#1a2332]/20 transition-colors flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm tracking-widest uppercase">View</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {lightboxIndex !== null && (
              <GalleryLightbox
                images={gallery}
                hotelName={hotel.name}
                location={hotel.location}
                onClose={() => setLightboxIndex(null)}
                startIndex={lightboxIndex}
              />
            )}
          </section>
        )}

        {/* ── SECTION 5: Related Tours ───────────────────────────────────────── */}
        {relatedTours.length > 0 && (
          <section className="py-20 bg-[#1a2332]">
            <div className="max-w-7xl mx-auto px-6">
              <div className="mb-10">
                <p className="tracking-[0.25em] uppercase text-[#c9a96e] text-xs font-medium mb-4">Explore Further</p>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">Tours From {hotel.location}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {relatedTours.map((tour) => (
                  <RelatedTourCard key={tour.id} tour={tour} />
                ))}
              </div>
              <div className="mt-10 text-center">
                <Link href="/egypt-tour-packages">
                  <button className="border border-[#c9a96e] text-[#c9a96e] px-8 py-3 text-sm tracking-widest uppercase hover:bg-[#c9a96e]/10 transition-colors">
                    View All Experiences
                  </button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── SECTION 6: Hotel FAQs ──────────────────────────────────────────── */}
        {hotelFaqs.length > 0 && (
          <section className="py-20 bg-white">
            <div className="max-w-3xl mx-auto px-6">
              <div className="text-center mb-12">
                <p className="tracking-[0.25em] uppercase text-[#c9a96e] text-xs font-medium mb-4">Questions & Answers</p>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1a2332]">
                  {hotel.name} — Frequently Asked Questions
                </h2>
                <div className="w-12 h-px bg-[#c9a96e] mx-auto mt-6" />
              </div>
              {hotelFaqs.map((faq, i) => (
                <FaqItem
                  key={i}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
