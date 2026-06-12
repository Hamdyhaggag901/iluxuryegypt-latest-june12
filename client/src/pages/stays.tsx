import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ChevronDown, ChevronRight, MapPin, ArrowRight, Clock } from "lucide-react";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import ScrollToTopButton from "../components/scroll-to-top-button";
import { useSEO } from "@/hooks/use-seo";
import type { Hotel, Tour } from "@shared/schema";

// ─── Scroll-reveal hook ───────────────────────────────────────────────────────
function useScrollReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ─── Hotel card with scroll animation ────────────────────────────────────────
function HotelCard({ hotel, index }: { hotel: Hotel; index: number }) {
  const { ref, visible } = useScrollReveal(0.1);
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.6s ease ${index * 0.07}s, transform 0.6s ease ${index * 0.07}s`,
      }}
    >
      <Link href={`/stays/${hotel.slug}`}>
        <div className="group cursor-pointer overflow-hidden rounded-sm shadow-md hover:shadow-xl transition-shadow duration-400">
          <div className="relative h-64 overflow-hidden">
            <img
              src={hotel.image}
              alt={`${hotel.name} – ${hotel.location} luxury hotel`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a2332]/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="text-white font-serif text-xl font-bold leading-tight mb-1">{hotel.name}</h3>
              <div className="flex items-center text-[#c9a96e] text-sm">
                <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                <span>{hotel.location}</span>
              </div>
            </div>
          </div>
          <div className="bg-white px-5 py-4 border-b border-[#c9a96e]/20">
            <p className="text-[#1a2332]/70 text-sm leading-relaxed line-clamp-2">{hotel.description}</p>
            <div className="mt-3 flex items-center text-[#c9a96e] text-sm font-medium">
              <span>Discover this property</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

// ─── Tour card ────────────────────────────────────────────────────────────────
function TourCard({ tour }: { tour: Tour }) {
  return (
    <div className="flex-none w-80 group cursor-pointer">
      <Link href={`/${tour.slug}`}>
        <div className="overflow-hidden rounded-sm shadow-md hover:shadow-xl transition-shadow duration-300">
          <div className="relative h-52 overflow-hidden">
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
            <h4 className="text-white font-serif text-lg font-bold leading-snug mb-2 line-clamp-2">{tour.title}</h4>
            <p className="text-white/60 text-sm line-clamp-2">{tour.shortDescription || tour.description.slice(0, 100)}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}

// ─── FAQ item ─────────────────────────────────────────────────────────────────
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

// ─── Default FAQs ─────────────────────────────────────────────────────────────
const DEFAULT_FAQS = [
  { question: "What types of luxury hotels are available in Egypt?", answer: "Egypt offers an exceptional range of luxury properties including historic palace hotels like the iconic Mena House near the Pyramids, ultra-modern five-star city hotels along the Nile, boutique desert lodges in Siwa, and elegant Nile cruise ships that combine transport and accommodation in supreme comfort." },
  { question: "How far in advance should I book a luxury hotel in Egypt?", answer: "We recommend booking luxury properties at least 3–6 months in advance, especially for peak travel seasons (October–April). Iconic properties such as the Winter Palace in Luxor or the Cataract Hotel in Aswan can be fully reserved a year or more ahead during peak periods." },
  { question: "Are luxury hotels in Egypt safe for international travelers?", answer: "Egypt's luxury hotel properties maintain the highest international safety and security standards. All of our partner properties are vetted for security protocols, and our team provides up-to-date destination guidance. The major tourist areas host millions of international visitors each year." },
  { question: "Can I arrange private experiences through my hotel?", answer: "Absolutely. Our curated partner hotels all offer dedicated concierge services that can arrange private Egyptologist guides, after-hours monument access, helicopter transfers, private dining, and bespoke cultural experiences. Simply let us know your preferences when enquiring." },
  { question: "What is the best region to stay in Egypt for a first visit?", answer: "Cairo and Giza offer immediate access to the Pyramids and the Egyptian Museum. Luxor is essential for temple lovers. For pure relaxation with Nile views, Aswan is unmatched. Most first-time visitors combine 2–3 regions with a short Nile cruise — our specialists can design the ideal itinerary for your journey." },
];

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Stays() {
  useSEO({
    title: "Luxury Stays in Egypt | Curated Hotels & Palaces | iLUXURY EGYPT",
    description: "Discover Egypt's finest luxury hotels, palace retreats, and boutique properties. Handpicked by our experts for discerning travellers.",
  });

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Fetch hotels
  const { data: hotelsData } = useQuery<{ success: boolean; hotels: Hotel[] }>({
    queryKey: ["/api/hotels"],
  });

  // Fetch featured tours
  const { data: toursData } = useQuery<{ success: boolean; tours: Tour[] }>({
    queryKey: ["/api/public/tours"],
  });

  // Fetch stays page settings
  const { data: settingsData } = useQuery<{
    heroImage: string;
    articleTitle: string;
    articleBody: string;
    faqs: { question: string; answer: string }[];
  }>({
    queryKey: ["/api/public/stays-settings"],
  });

  const hotels = hotelsData?.hotels || [];
  const featuredTours = (toursData?.tours || []).filter((t) => t.featured).slice(0, 3);
  const heroImage = settingsData?.heroImage || "";
  const articleTitle = settingsData?.articleTitle || "The Art of Luxury Accommodation in Egypt";
  const articleBody = settingsData?.articleBody || "";
  const faqs = (settingsData?.faqs && settingsData.faqs.length > 0) ? settingsData.faqs : DEFAULT_FAQS;

  const defaultArticle = `Egypt's landscape of luxury accommodation is unlike anywhere else on earth. Here, a five-star hotel is not merely a place to sleep — it is a stage upon which millennia of history, culture, and grandeur are performed anew each day.

The finest hotels in Egypt occupy positions of extraordinary privilege. Some gaze directly upon the Great Pyramids of Giza, those ancient monuments that have humbled rulers and philosophers alike. Others stand sentinel on the banks of the Nile, that eternal artery of civilization, where feluccas still drift past in the early morning light much as they did in the time of the pharaohs.

What distinguishes a truly great Egyptian hotel from a merely good one is often invisible at first glance. It is the knowledge of the concierge who can secure a private dawn visit to the Valley of the Kings, or the chef who knows which spice market to visit at first light for the freshest dukkah. It is the attentiveness of staff who anticipate a guest's preferences before they are voiced, and the curator's eye with which every space has been assembled.

Palace hotels carry the stories of the great and the famous within their walls. The Mena House has hosted Churchill, Roosevelt, and Agatha Christie. The Winter Palace in Luxor once sheltered Howard Carter as he prepared to open Tutankhamun's tomb. To stay in these places is to inhabit a specific chapter of modern history.

Newer properties bring the full force of contemporary luxury design to ancient landscapes. The best among them achieve the remarkable feat of feeling entirely modern while remaining deeply rooted in their Egyptian context — using local stone, traditional geometric patterns, and regional artisanship in ways that feel genuinely integrated rather than superficially decorative.

For the discerning traveller, choosing where to stay in Egypt is one of the most consequential decisions of any journey. Our team has visited, assessed, and cultivated relationships with each property in our portfolio. We do not list hotels we would not ourselves stay in. Every recommendation is built on direct experience and an uncompromising commitment to the quality of your experience.`;

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <Navigation />

      {/* ── SECTION 1: Hero ─────────────────────────────────────────────────── */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage || "/api/assets/elegant-hall_1757459228629.jpeg"})`,
          }}
        />
        <div className="absolute inset-0 bg-[#1a2332]/60" />
        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
          <p className="tracking-[0.3em] uppercase text-[#c9a96e] text-sm font-light mb-6">iLUXURY EGYPT</p>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Where You Rest<br />Matters
          </h1>
          <div className="w-16 h-px bg-[#c9a96e] mx-auto mb-6" />
          <p className="text-white/80 text-lg md:text-xl leading-relaxed">
            Curated luxury properties across Egypt
          </p>
        </div>
      </section>

      {/* ── SECTION 2: Editorial Article ────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <p className="tracking-[0.25em] uppercase text-[#c9a96e] text-xs font-medium mb-6">Editorial</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#1a2332] mb-8 leading-tight">
            {articleTitle}
          </h2>
          <div className="w-12 h-px bg-[#c9a96e] mb-10" />
          {articleBody ? (
            <div
              className="prose prose-lg max-w-none text-[#1a2332]/75 leading-relaxed [&_h2]:font-serif [&_h2]:text-[#1a2332] [&_h3]:font-serif [&_h3]:text-[#1a2332] [&_blockquote]:border-l-[#c9a96e] [&_blockquote]:text-[#1a2332]/80 [&_a]:text-[#c9a96e]"
              dangerouslySetInnerHTML={{ __html: articleBody }}
            />
          ) : (
            <div className="space-y-5">
              {defaultArticle.split("\n\n").map((para, i) => (
                <p key={i} className="text-[#1a2332]/75 text-lg leading-relaxed">{para}</p>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── SECTION 3: Hotels Grid ───────────────────────────────────────────── */}
      <section className="py-24 bg-[#faf9f7]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="tracking-[0.25em] uppercase text-[#c9a96e] text-xs font-medium mb-4">Our Portfolio</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#1a2332] mb-4">Curated Properties</h2>
            <div className="w-16 h-px bg-[#c9a96e] mx-auto" />
          </div>

          {hotels.length === 0 ? (
            <div className="text-center py-20 text-[#1a2332]/40">
              <p className="font-serif text-xl">Properties coming soon</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotels.map((hotel, i) => (
                <HotelCard key={hotel.id} hotel={hotel} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── SECTION 4: Journey Further Tours ────────────────────────────────── */}
      {featuredTours.length > 0 && (
        <section className="py-24 bg-[#1a2332]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
              <div>
                <p className="tracking-[0.25em] uppercase text-[#c9a96e] text-xs font-medium mb-4">Beyond the Hotel</p>
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight">
                  Journey Further —<br className="hidden md:block" /> Our Curated Tours
                </h2>
              </div>
              <Link href="/egypt-tour-packages">
                <button className="flex items-center gap-2 text-[#c9a96e] border border-[#c9a96e]/40 px-6 py-3 text-sm tracking-widest uppercase hover:bg-[#c9a96e]/10 transition-colors flex-shrink-0">
                  View All Tours <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide">
              {featuredTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 5: FAQ ───────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="tracking-[0.25em] uppercase text-[#c9a96e] text-xs font-medium mb-4">Your Questions Answered</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#1a2332]">Frequently Asked Questions</h2>
            <div className="w-16 h-px bg-[#c9a96e] mx-auto mt-6" />
          </div>

          <div>
            {faqs.map((faq, i) => (
              <FaqItem
                key={i}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
