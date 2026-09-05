import { Star, ChevronLeft, ChevronRight, ExternalLink, Quote } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import pyramidFromMenaHouseImage from "@assets/the-pyramid-from-mena-house_1757459228638.jpeg";

interface TestimonialData {
  id: string;
  quote: string;
  author: string;
  location: string | null;
  rating: number;
}

// Fallback data — Michael R. is the first, real testimonial; the rest fill in
// until an admin adds more via the CMS (Testimonials Section in Page Edits).
const fallbackTestimonials: TestimonialData[] = [
  {
    id: "1",
    quote: "I'll be honest I almost canceled this trip after reading so many conflicting opinions online. From my very first email, Hamdy patiently answered every question without ever making me feel pressured to book. When we landed in Cairo, Magdy was already waiting outside arrivals, and within an hour I realized I'd spent weeks worrying for nothing. Looking back, what I'll remember most isn't just the pyramids, but how easy the entire journey felt.",
    author: "Michael R.",
    location: "California, USA",
    rating: 5
  },
  {
    id: "2",
    quote: "As a solo traveler, safety was naturally my biggest concern before coming to Egypt. Ahmed Hosni stayed in touch before I arrived and made sure I always knew what to expect. During the trip, Christine checked in more than once just to make sure everything was going smoothly. That level of communication gave me far more confidence than I expected, and I never once felt alone.",
    author: "Melissa Carter",
    location: "Boston, USA",
    rating: 5
  },
  {
    id: "3",
    quote: "The Grand Egyptian Museum was one of the main reasons we came to Egypt, but spending the day with Amr Youssef made it even better. He somehow turned every gallery into a conversation instead of a lecture. We stayed longer than planned because I kept asking questions, and no one ever made us feel rushed.",
    author: "Emily S.",
    location: "New York, USA",
    rating: 5
  },
  {
    id: "4",
    quote: "We booked this trip to celebrate our 20th wedding anniversary, and it turned out to be even better than we imagined. Our favorite day was sailing on the Nile at sunset. It never felt rushed, and we always had enough time to enjoy each place instead of simply checking attractions off a list.",
    author: "Karen & David",
    location: "Texas, USA",
    rating: 5
  },
  {
    id: "5",
    quote: "Our teenage kids usually lose interest after the first museum, but our guide somehow managed to keep them engaged the whole time. Even now they're still talking about Karnak Temple and the Valley of the Kings. That's probably the best compliment I can give.",
    author: "The Wilson Family",
    location: "North Carolina, USA",
    rating: 5
  }
];

function TestimonialCard({ testimonial }: { testimonial: TestimonialData }) {
  return (
    <div
      className="relative bg-white rounded-2xl shadow-2xl px-5 py-6 md:px-6 md:py-7 h-full flex flex-col text-center overflow-hidden"
      data-testid="testimonial-content"
    >
      {/* Decorative gold quote mark */}
      <Quote className="absolute -top-3 -right-3 h-20 w-20 text-accent/10 rotate-180" strokeWidth={1} />

      {/* Stars */}
      <div className="relative flex justify-center mb-3">
        <div className="flex text-accent">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-current" />
          ))}
        </div>
      </div>

      {/* Quote */}
      <blockquote className="relative flex-1 text-sm md:text-base font-serif text-primary italic leading-relaxed mb-4 line-clamp-2">
        "{testimonial.quote}"
      </blockquote>

      {/* Author */}
      <div className="relative mb-4">
        <p className="font-semibold text-primary text-sm">{testimonial.author}</p>
        {testimonial.location && (
          <p className="text-xs text-muted-foreground">{testimonial.location}</p>
        )}
      </div>

      {/* TripAdvisor Badge */}
      <a
        href="https://www.tripadvisor.com/Attraction_Review-g294201-d34077128-Reviews-I_Luxury_Egypt-Cairo_Cairo_Governorate.html"
        target="_blank"
        rel="noopener noreferrer"
        className="relative inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#00aa6c] hover:bg-[#00995f] text-white text-xs font-semibold rounded-full transition-all duration-300 mx-auto"
      >
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
        Read More on TripAdvisor
        <ExternalLink className="w-3 h-3 shrink-0" />
      </a>
    </div>
  );
}

export default function TestimonialSection() {
  // Fetch testimonials from database
  const { data } = useQuery({
    queryKey: ["publicTestimonials"],
    queryFn: async () => {
      const response = await fetch("/api/public/testimonials");
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });

  // Fetch the section's background image (admin-editable; falls back to the
  // bundled default when nothing has been set yet)
  const { data: sectionData } = useQuery({
    queryKey: ["publicTestimonialsSection"],
    queryFn: async () => {
      const response = await fetch("/api/public/testimonials-section");
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });

  const backgroundImage = sectionData?.section?.backgroundImage || pyramidFromMenaHouseImage;

  // Use database testimonials if available, otherwise fallback
  const testimonials: TestimonialData[] = data?.testimonials?.length > 0
    ? data.testimonials.map((t: any) => ({
        id: t.id,
        quote: t.quote,
        author: t.author,
        location: t.location,
        rating: t.rating,
      }))
    : fallbackTestimonials;

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  if (testimonials.length === 0) return null;

  // Desktop: a sliding window of up to 4 consecutive cards starting at
  // currentIndex, wrapping around — always shows 4 filled cards (or fewer
  // if there simply aren't 4 testimonials yet) instead of leaving empty
  // grid slots on a "last page".
  const visibleCount = Math.min(4, testimonials.length);
  const desktopTestimonials = Array.from({ length: visibleCount }, (_, i) => testimonials[(currentIndex + i) % testimonials.length]);
  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="relative py-20 overflow-hidden" data-testid="testimonial-section">
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt="The Great Pyramid of Giza at dusk — iLuxury Egypt"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-accent font-medium">
            What Our Guests Say
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mt-4 mb-4">
            Voices From the Journey
          </h2>
          <p className="text-base md:text-lg text-white/75 max-w-2xl mx-auto">
            Real stories from travelers who trusted us with their journey through Egypt.
          </p>
        </div>

        <div className="relative w-full">
          {/* Navigation Arrows — desktop only; mobile uses swipe + dots */}
          <div className="absolute inset-0 hidden lg:flex items-center justify-between pointer-events-none px-0 xl:-px-4 z-10">
            <button
              onClick={handlePrev}
              className="pointer-events-auto -translate-x-6 w-12 h-12 rounded-full border border-white/40 text-white flex items-center justify-center backdrop-blur-sm hover:bg-white hover:text-primary transition-all duration-300"
              data-testid="testimonial-prev"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              onClick={handleNext}
              className="pointer-events-auto translate-x-6 w-12 h-12 rounded-full border border-white/40 text-white flex items-center justify-center backdrop-blur-sm hover:bg-white hover:text-primary transition-all duration-300"
              data-testid="testimonial-next"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Desktop: 4 cards side by side */}
          <div className="hidden lg:grid grid-cols-4 gap-6">
            {desktopTestimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                whileHover={{ y: -4 }}
              >
                <TestimonialCard testimonial={testimonial} />
              </motion.div>
            ))}
          </div>

          {/* Mobile/Tablet: single card, swipeable */}
          <div className="lg:hidden px-2 sm:px-8">
            <motion.div
              key={currentTestimonial.id}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={(_e, info) => {
                if (info.offset.x < -60) handleNext();
                else if (info.offset.x > 60) handlePrev();
              }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="max-w-xl mx-auto cursor-grab active:cursor-grabbing"
            >
              <TestimonialCard testimonial={currentTestimonial} />
            </motion.div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-10 space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-accent scale-125'
                    : 'bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
                data-testid={`testimonial-dot-${index}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
