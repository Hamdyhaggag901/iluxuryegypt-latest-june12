import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import siwaVideo from "@assets/Salt Lake Float Therapy_1757459954474.mp4";

// Fallback content
const fallbackContent = {
  mediaType: "video" as const,
  mediaUrl: siwaVideo,
  title: "Discover Siwa Oasis",
  description: "Where ancient traditions meet pristine desert beauty in Egypt's most enchanting oasis",
  ctaText: "",
  ctaLink: "",
  isActive: true,
};

export default function SiwaVideoSection() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Fetch siwa section from database
  const { data: siwaData } = useQuery({
    queryKey: ["publicSiwaSection"],
    queryFn: async () => {
      const response = await fetch("/api/public/siwa-section");
      if (!response.ok) throw new Error("Failed to fetch siwa section");
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Use database content or fallback
  const content = siwaData?.section || fallbackContent;
  const isInactive = siwaData?.section && !content.isActive;

  useEffect(() => {
    if (videoRef.current && videoLoaded) {
      videoRef.current.play().catch(err => {
        console.error('Video autoplay failed:', err);
        setVideoError(true);
      });
    }
  }, [videoLoaded]);

  // Don't render if section is explicitly set to inactive (after all hooks)
  if (isInactive) {
    return null;
  }

  return (
    <section className="relative w-full h-[500px] overflow-hidden" data-testid="siwa-video-section">
      {content.mediaType === "video" ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          onLoadedData={() => setVideoLoaded(true)}
          onError={(e) => {
            console.error('Video loading error:', e);
            setVideoError(true);
          }}
        >
          <source src={content.mediaUrl} type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${content.mediaUrl})` }}
        />
      )}

      {/* Overlay for text visibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40"></div>

      {/* Text Content */}
      <div className="absolute inset-0 flex items-center justify-center text-center px-4">
        <div className="max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 drop-shadow-lg animate-fade-in">
            {content.title}
          </h2>
          {content.description && (
            <p className="text-lg md:text-xl text-white font-light drop-shadow-md animate-fade-in mb-6">
              {content.description}
            </p>
          )}
          {content.ctaText && content.ctaLink && (
            <Link href={content.ctaLink}>
              <span className="inline-flex items-center gap-3 mt-2 text-white/90 hover:text-white transition-colors duration-300 group cursor-pointer animate-fade-in">
                <span className="w-12 h-px bg-accent group-hover:w-16 transition-all duration-300"></span>
                <span className="text-sm tracking-[0.2em] uppercase font-light">
                  {content.ctaText}
                </span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}