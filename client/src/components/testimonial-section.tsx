import { Star, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface TestimonialData {
  id: string;
  quote: string;
  author: string;
  location: string | null;
  rating: number;
}

// Fallback data
const fallbackTestimonials: TestimonialData[] = [
  {
    id: "1",
    quote: "From the moment we arrived, every detail exceeded our expectations. I.LuxuryEgypt created not just a trip, but a lifetime memory filled with wonder.",
    author: "Sarah & Michael",
    location: "UK",
    rating: 5
  },
  {
    id: "2",
    quote: "The private Nile cruise was beyond imagination. Every moment was crafted to perfection, from the sunset views to the impeccable service aboard.",
    author: "Luis & Marta",
    location: "Spain",
    rating: 5
  },
  {
    id: "3",
    quote: "A perfect mix of history and modern luxury. The way they seamlessly blended ancient wonders with contemporary comfort was simply extraordinary.",
    author: "Akira & Yumi",
    location: "Japan",
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
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, testimonials.length]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const currentTestimonial = testimonials[currentIndex];

  if (!currentTestimonial) return null;

  return (
    <section className="py-20 bg-muted" data-testid="testimonial-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-8 animate-fade-in">
            What Our Guests Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the experiences that have left lasting impressions on travelers from around the world.
          </p>
        </div>

        <div className="relative w-full">
          {/* Flex Overlay for Navigation Buttons */}
          <div className="absolute inset-0 flex items-center justify-between pointer-events-none px-4 md:px-8 lg:px-16 z-10">
            <button
              onClick={handlePrev}
              disabled={isAnimating}
              className="pointer-events-auto w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center shadow-lg hover-elevate transition-all duration-300 disabled:opacity-50 hidden lg:flex"
              data-testid="testimonial-prev"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              onClick={handleNext}
              disabled={isAnimating}
              className="pointer-events-auto w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center shadow-lg hover-elevate transition-all duration-300 disabled:opacity-50 hidden lg:flex"
              data-testid="testimonial-next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Testimonial Content */}
          <div className="px-4 md:px-16">
            <div
              className={`text-center transition-all duration-300 ${
                isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
              }`}
              data-testid="testimonial-content"
            >
              {/* Stars */}
              <div className="flex justify-center mb-8">
                <div className="flex text-accent text-2xl">
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-7 w-7 fill-current transform hover:scale-110 transition-transform duration-200"
                      style={{ animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                </div>
              </div>

              {/* Quote */}
              <blockquote className="text-2xl md:text-3xl lg:text-4xl font-serif text-primary italic leading-relaxed mb-10 max-w-4xl mx-auto">
                "{currentTestimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="text-xl text-muted-foreground">
                <p className="font-medium text-primary mb-1">
                  {currentTestimonial.author}
                </p>
                {currentTestimonial.location && (
                  <p className="text-accent font-medium">
                    {currentTestimonial.location}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-12 space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true);
                    setCurrentIndex(index);
                    setTimeout(() => setIsAnimating(false), 300);
                  }
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-accent scale-125'
                    : 'bg-accent/30 hover:bg-accent/60'
                }`}
                data-testid={`testimonial-dot-${index}`}
              />
            ))}
          </div>

          {/* TripAdvisor Button */}
          <div className="flex justify-center mt-10">
            <a
              href="https://www.tripadvisor.com/Attraction_Review-g294201-d34077128-Reviews-I_Luxury_Egypt-Cairo_Cairo_Governorate.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#00aa6c] hover:bg-[#00995f] text-white font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              Read More Reviews on TripAdvisor
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="relative mt-16">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>
          <div className="flex justify-center pt-8">
            <div className="w-16 h-1 bg-accent rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
