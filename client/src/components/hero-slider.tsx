import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { getResponsiveImageProps } from "@/lib/responsive-image";

interface Slide {
  id: string;
  type: "video" | "image";
  src: string;
  poster?: string;
  subtitle: string;
  title: string;
  description: string;
  cta: {
    text: string;
    link: string;
  };
}

// Fallback slides data - used when database is empty
const fallbackSlides: Slide[] = [
  {
    id: "1",
    type: "video",
    src: "https://player.vimeo.com/external/434045526.hd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9e7c02d&profile_id=175",
    poster: "",
    subtitle: "Discover Ancient Wonders",
    title: "The Pyramids of Giza",
    description: "Stand before the last remaining wonder of the ancient world with exclusive private access",
    cta: {
      text: "Explore Pyramid Tours",
      link: "/egypt-tour-packages",
    },
  },
  {
    id: "2",
    type: "video",
    src: "https://player.vimeo.com/external/371867030.hd.mp4?s=45917fe3ef32bd82d5ca8b7e72b5a8e5e71a1db3&profile_id=175",
    poster: "",
    subtitle: "Sail in Ultimate Luxury",
    title: "Nile River Cruises",
    description: "Experience the timeless beauty of Egypt aboard our handpicked luxury vessels",
    cta: {
      text: "View Nile Cruises",
      link: "/egypt-nile-cruise-tours",
    },
  },
  {
    id: "3",
    type: "video",
    src: "https://player.vimeo.com/external/370467553.hd.mp4?s=ce49c8c6d8e28a89298ffb4c53a2e842bdb11546&profile_id=175",
    poster: "",
    subtitle: "Unwind in Paradise",
    title: "Red Sea Retreats",
    description: "Discover pristine beaches and world-class resorts along Egypt's stunning coastline",
    cta: {
      text: "Discover Retreats",
      link: "/egypt-day-tours",
    },
  },
];

export default function HeroSlider() {
  // Fetch slides from database
  const { data: slidesData } = useQuery({
    queryKey: ["publicHeroSlides"],
    queryFn: async () => {
      const response = await fetch("/api/public/hero-slides");
      if (!response.ok) throw new Error("Failed to fetch hero slides");
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Transform database slides to component format, or use fallback
  const slides: Slide[] = slidesData?.slides?.length > 0
    ? slidesData.slides.map((slide: any) => ({
        id: slide.id,
        type: slide.mediaType,
        src: slide.mediaUrl,
        poster: slide.posterUrl || "",
        subtitle: slide.subtitle || "",
        title: slide.title,
        description: slide.description || "",
        cta: {
          text: slide.ctaText || "Learn More",
          link: slide.ctaLink || "/egypt-tour-packages",
        },
      }))
    : fallbackSlides;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  // Only the first slide's media loads on initial paint (it's the LCP element);
  // the rest are preloaded in idle time so autoplay never shows a blank slide,
  // without making every slide's video/image compete for bandwidth up front.
  const [loadedSlides, setLoadedSlides] = useState<Set<number>>(() => new Set([0]));
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (slides.length <= 1) return;
    const preloadRest = () => setLoadedSlides(new Set(slides.map((_, i) => i)));
    const ric = (window as any).requestIdleCallback;
    const cic = (window as any).cancelIdleCallback;
    const idleId = ric ? ric(preloadRest, { timeout: 4000 }) : window.setTimeout(preloadRest, 2000);
    return () => {
      if (ric && cic) cic(idleId);
      else window.clearTimeout(idleId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length]);

  // Auto-advance slides
  useEffect(() => {
    const startAutoPlay = () => {
      autoPlayRef.current = setInterval(() => {
        goToNextSlide();
      }, 8000); // 8 seconds per slide
    };

    startAutoPlay();

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [currentSlide]);

  // Handle video playback
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentSlide) {
          video.currentTime = 0;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    });
  }, [currentSlide]);

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);

    // Reset autoplay timer
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }

    setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);
  };

  const goToNextSlide = () => {
    goToSlide((currentSlide + 1) % slides.length);
  };

  const goToPrevSlide = () => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    videoRefs.current.forEach((video) => {
      if (video) {
        video.muted = !isMuted;
      }
    });
  };

  return (
    <section className="relative h-screen overflow-hidden bg-black" data-testid="hero-slider">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Video/Image Background — only mounted once this slide has been
              marked loaded, so the initial page load fetches just one hero
              media file instead of every slide's video/image at once. */}
          {loadedSlides.has(index) && (
            slide.type === "video" ? (
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                className="absolute inset-0 w-full h-full object-cover"
                src={slide.src}
                poster={slide.poster}
                muted={isMuted}
                loop
                playsInline
                preload={index === 0 ? "auto" : "metadata"}
              />
            ) : (
              <img
                {...getResponsiveImageProps(slide.src)}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : undefined}
              />
            )
          )}

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-end pb-32 md:pb-40">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`transition-all duration-700 ease-out ${
                index === currentSlide
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8 absolute pointer-events-none"
              }`}
            >
              {index === currentSlide && (
                <div className="max-w-3xl">
                  {/* Subtitle */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-px bg-accent" />
                    <span className="text-accent-text text-xs md:text-sm tracking-[0.3em] uppercase font-light">
                      {slide.subtitle}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight">
                    {slide.title}
                  </h1>

                  {/* Description */}
                  <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl leading-relaxed">
                    {slide.description}
                  </p>

                  {/* CTA Button */}
                  <Link href={slide.cta.link}>
                    <Button
                      size="lg"
                      className="bg-accent hover:bg-accent/90 text-white px-8 py-6 text-base tracking-wide group"
                    >
                      {slide.cta.text}
                      <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>
      <button
        onClick={goToNextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative h-1 rounded-full transition-all duration-500 overflow-hidden ${
              index === currentSlide ? "w-12 bg-white/30" : "w-8 bg-white/20 hover:bg-white/30"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            {index === currentSlide && (
              <div
                className="absolute inset-y-0 left-0 bg-accent rounded-full"
                style={{
                  animation: "progress 8s linear forwards",
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Mute/Unmute Button */}
      <button
        onClick={toggleMute}
        className="absolute bottom-8 right-4 md:right-8 z-30 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>

      {/* Slide Counter */}
      <div className="absolute bottom-8 left-4 md:left-8 z-30 text-white/60 text-sm font-light tracking-wider">
        <span className="text-white font-medium">{String(currentSlide + 1).padStart(2, "0")}</span>
        <span className="mx-2">/</span>
        <span>{String(slides.length).padStart(2, "0")}</span>
      </div>

      {/* Progress Animation Keyframes */}
      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}
