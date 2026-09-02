import { Star, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
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

export default function TestimonialSection() {
  // Fetch from database
  const { data } = useQuery({
    queryKey: ["publicTestimonials"],
    queryFn: async () => {
      const response = await fetch("/api/public/testimonials");
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });

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
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const currentTestimonial = testimonials[currentIndex];

  if (!currentTestimonial) return null;

  return (
    <section className="relative py-20 overflow-hidden" data-testid="testimonial-section">
      <div className="absolute inset-0">
        <img
          src={pyramidFromMenaHouseImage}
          alt="The Great Pyramid of Giza at dusk — iLuxury Egypt"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/40" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-accent font-medium">
            What Our Guests Say
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mt-4">
            Voices From the Journey
          </h2>
        </div>

        <div className="relative w-full">
          {/* Flex Overlay for Navigation Buttons */}
          <div className="absolute inset-0 flex items-center justify-between pointer-events-none px-4 md:px-8 lg:px-16 z-10">
            <button
              onClick={handlePrev}
              className="pointer-events-auto w-12 h-12 rounded-full border border-white/40 text-white flex items-center justify-center backdrop-blur-sm hover:bg-white hover:text-primary transition-all duration-300 hidden lg:flex"
              data-testid="testimonial-prev"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              onClick={handleNext}
              className="pointer-events-auto w-12 h-12 rounded-full border border-white/40 text-white flex items-center justify-center backdrop-blur-sm hover:bg-white hover:text-primary transition-all duration-300 hidden lg:flex"
              data-testid="testimonial-next"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Testimonial Card */}
          <div className="px-4 md:px-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl shadow-2xl px-6 py-10 md:px-14 md:py-14 max-w-3xl mx-auto text-center"
                data-testid="testimonial-content"
              >
                {/* Stars */}
                <div className="flex justify-center mb-6">
                  <div className="flex text-accent">
                    {[...Array(currentTestimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 fill-current" />
                    ))}
                  </div>
                </div>

                {/* Quote */}
                <blockquote className="text-lg md:text-xl font-serif text-primary italic leading-relaxed mb-8">
                  "{currentTestimonial.quote}"
                </blockquote>

                {/* Author */}
                <div className="mb-6">
                  <p className="font-semibold text-primary">{currentTestimonial.author}</p>
                  {currentTestimonial.location && (
                    <p className="text-sm text-muted-foreground">{currentTestimonial.location}</p>
                  )}
                </div>

                {/* TripAdvisor Badge */}
                <a
                  href="https://www.tripadvisor.com/Attraction_Review-g294201-d34077128-Reviews-I_Luxury_Egypt-Cairo_Cairo_Governorate.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00aa6c] hover:bg-[#00995f] text-white text-sm font-semibold rounded-full transition-all duration-300"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                  Read More on TripAdvisor
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </motion.div>
            </AnimatePresence>
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
