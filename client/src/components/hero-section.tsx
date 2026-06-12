import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import pyramidFromMenaHouseImage from "@assets/the-pyramid-from-mena-house_1757459228638.jpeg";
import suiteNileImage from "@assets/suite-nile_1757457083796.jpg";
import luxorImage from "@assets/luxor_1757531163688.jpg";

const backgroundImages = [
  pyramidFromMenaHouseImage,
  suiteNileImage,
  luxorImage,
];

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-background" data-testid="hero-section">
      {/* Dynamic Background Images - Crystal Clear */}
      <div className="absolute inset-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            data-testid={index === currentImageIndex ? "hero-image" : undefined}
          />
        ))}
        {/* Light overlay for text contrast */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-end min-h-screen">
        <div className="w-full pb-0">
          {/* Blurry Card Container */}
          <div className="bg-black/20 backdrop-blur-md border-t border-white/20 p-4 lg:p-6">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
              <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 text-white">
                
                {/* Left Side */}
                <div className="flex-1 text-left space-y-2 max-w-xl">
                  <p className="text-[10px] tracking-[0.3em] uppercase font-light text-white/90" data-testid="text-subtitle">
                    Luxury Travel Agency
                  </p>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif leading-tight" data-testid="text-main-heading">
                    Travel Enlightened
                  </h1>
                </div>

                {/* Vertical Divider */}
                <div className="hidden lg:block w-[1px] h-24 bg-white/50" data-testid="divider-vertical"></div>

                {/* Right Side */}
                <div className="flex-1 text-left space-y-3 max-w-xl">
                  <h2 className="text-lg md:text-xl lg:text-2xl font-light leading-snug" data-testid="text-tagline">
                    Luxury Travel Designed Just For You
                  </h2>
                  <div className="pt-1">
                    <Link href="/egypt-tour-packages">
                      <Button 
                        size="default" 
                        className="text-xs px-6 py-2 h-auto font-normal tracking-[0.15em] uppercase border-2 border-white text-white bg-white/10 hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-sm"
                        data-testid="button-explore-vacations"
                      >
                        Explore Luxury Vacations
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

