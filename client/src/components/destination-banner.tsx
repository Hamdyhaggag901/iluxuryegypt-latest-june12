import { useState, useEffect, useRef } from "react";
import floatTherapyVideo from "@assets/Salt Lake Float Therapy_1757459954474.mp4";

export default function DestinationBanner() {
  const [scrollY, setScrollY] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Force play video after component mounts
    if (videoRef.current) {
      console.log('Video element found, attempting to play...');
      videoRef.current.play().catch(err => {
        console.error('Video autoplay failed:', err);
        setVideoError(true);
      });
    }
  }, [videoLoaded]);


  // Calculate parallax offset - more subtle for smoother experience
  const parallaxOffset = scrollY * 0.15;

  return (
    <section 
      ref={sectionRef}
      id="destinations" 
      className="relative min-h-[120vh] overflow-hidden destination-banner"
      data-testid="destination-banner"
    >
      {/* Video Background with Parallax */}
      <div 
        className="absolute inset-0"
        style={{
          transform: `translate3d(0, ${parallaxOffset}px, 0)`,
          height: "120%",
          top: "-10%",
        }}
      >
        {/* Video Background - Fixed z-index and visibility */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            zIndex: 1,
            transform: 'scale(1.05)', // Optimized scale for better coverage
            objectPosition: 'center center',
          }}
          onLoadedData={() => {
            setVideoLoaded(true);
          }}
          onError={(e) => {
            console.error('Video loading error:', e);
            setVideoError(true);
          }}
        >
          <source src={floatTherapyVideo} type="video/mp4" />
        </video>
        
        {/* Background is now applied to section element directly */}
      </div>
      
      {/* Light overlay for text readability only */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 z-10"></div>
      
      {/* Content with subtle parallax */}
      <div 
        className="relative max-w-4xl mx-auto text-center px-4 pt-24 pb-48 animate-fade-in z-20 flex flex-col justify-center min-h-[120vh]"
        style={{
          transform: `translate3d(0, ${scrollY * 0.03}px, 0)`,
        }}
      >
        <h2 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6 drop-shadow-lg">
          The Magic of Egypt
        </h2>
        <p className="text-xl md:text-2xl text-white font-light drop-shadow-md">
          Stunning landscapes, legendary monuments, world-class hospitality.
        </p>
      </div>
    </section>
  );
}
