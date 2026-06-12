import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { Link } from "wouter";
import insideColumnHallImg from "@assets/inside-the-column-hall_1757699232094.jpg";
import islamicDistrictImg from "@assets/islamic-district-at-dawn_1757699232100.jpg";
import poolSideDrinkImg from "@assets/pool-side-drink_1757699232100.jpg";
import siwaPalmTreesImg from "@assets/siwa-palm-trees_1757699232101.jpg";

interface WhyUseItem {
  id: string;
  title: string;
  image: string;
  content: string;
}

// Fallback data
const fallbackSection = {
  title: "Why Choose I.LUXURYEGYPT?",
  subtitle: "Discover what sets us apart in crafting extraordinary Egyptian adventures for the most discerning travelers",
  isActive: true,
};

const fallbackCards: WhyUseItem[] = [
  {
    id: "1",
    title: "Bespoke Luxury",
    image: insideColumnHallImg,
    content: "Every journey is meticulously crafted by our local experts to reflect your personal style and desires. Experience Egypt through completely personalized itineraries that transform your travel dreams into extraordinary realities.",
  },
  {
    id: "2",
    title: "Authentic Heritage",
    image: islamicDistrictImg,
    content: "We are passionate Egyptians with deep roots in this ancient land. Connect with the authentic heart of Egypt through meaningful experiences that honor our rich heritage while creating memories that last a lifetime.",
  },
  {
    id: "3",
    title: "Elite Storytellers",
    image: poolSideDrinkImg,
    content: "Our expert guides are Egypt's finest storytellers and cultural ambassadors. They bring ancient wonders to life with captivating narratives and insider knowledge, creating connections that transcend ordinary tourism.",
  },
  {
    id: "4",
    title: "Exclusive Access",
    image: siwaPalmTreesImg,
    content: "Enjoy privileged access to Egypt's most coveted experiences. From private museum viewings to after-hours temple visits, we unlock doors that remain closed to ordinary travelers, ensuring truly unique encounters.",
  }
];

export default function WhyUseSection() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Fetch from database
  const { data } = useQuery({
    queryKey: ["publicWhyChooseSection"],
    queryFn: async () => {
      const response = await fetch("/api/public/why-choose-section");
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });

  const section = data?.section || fallbackSection;
  const dbCards = data?.cards || [];

  // Use database cards if available, otherwise fallback
  const whyUseItems: WhyUseItem[] = dbCards.length > 0
    ? dbCards.map((card: any) => ({
        id: card.id,
        title: card.title,
        image: card.imageUrl,
        content: card.content,
      }))
    : fallbackCards;

  // Don't render if explicitly set to inactive
  if (data?.section && !section.isActive) {
    return null;
  }

  return (
    <section className="py-12 md:py-20 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-16 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-primary mb-4 md:mb-6">
            {section.title}
          </h2>
          <div className="flex items-center justify-center space-x-3 md:space-x-4 mb-4 md:mb-8">
            <div className="w-10 md:w-16 h-px bg-accent"></div>
            <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-accent rotate-45"></div>
            <div className="w-10 md:w-16 h-px bg-accent"></div>
          </div>
          {section.subtitle && (
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base lg:text-lg leading-relaxed px-4">
              {section.subtitle}
            </p>
          )}
        </div>

        {/* Luxury Cards Grid - Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:flex gap-4 md:gap-6 max-w-7xl mx-auto lg:h-[450px]">
          {whyUseItems.map((item) => (
            <div
              key={item.id}
              className={`relative bg-card shadow-xl overflow-hidden transition-all duration-700 ease-in-out border border-primary/10 hover:border-accent/50 group transform hover:shadow-2xl min-h-[280px] md:min-h-[320px] lg:min-h-0 ${
                hoveredCard === null
                  ? 'lg:flex-1'
                  : hoveredCard === item.id
                    ? 'lg:flex-[2.5]'
                    : 'lg:flex-[0.5] lg:opacity-30'
              }`}
              onMouseEnter={() => setHoveredCard(item.id)}
              onMouseLeave={() => setHoveredCard(null)}
              data-testid={`why-use-item-${item.id}`}
            >
              {/* Luxury Top Accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-200 z-10" />

              {/* Main Card Content */}
              <div className="relative flex flex-col lg:flex-row h-full">
                {/* Image Section */}
                <div className={`relative overflow-hidden transition-all duration-700 ease-in-out h-48 md:h-56 lg:h-full ${
                  hoveredCard === item.id ? 'lg:w-1/2' : 'lg:w-full'
                }`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 transition-all duration-300 group-hover:from-black/70 group-hover:via-black/30 group-hover:to-black/5" />

                  {/* Title on Image - Mobile & Default */}
                  <div className={`absolute left-0 right-0 transform transition-all duration-500 ease-out lg:block ${
                    hoveredCard === item.id
                      ? 'bottom-4 lg:bottom-6 translate-y-0'
                      : 'bottom-4 lg:bottom-1/2 lg:translate-y-1/2'
                  }`}>
                    <div className="px-4 lg:px-6">
                      <div className="flex items-center justify-center mb-2 lg:mb-4">
                        <div className="w-8 lg:w-12 h-px bg-accent"></div>
                      </div>

                      <h3 className={`font-serif font-bold text-white leading-tight transition-all duration-300 text-center text-lg lg:text-xl ${
                        hoveredCard === item.id ? 'lg:text-2xl lg:group-hover:text-accent/90' : ''
                      }`}>
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  {/* Side Accent Line - Desktop only */}
                  <div className={`hidden lg:block absolute left-0 top-6 bottom-6 bg-gradient-to-b from-accent/0 via-accent/80 to-accent/0 transition-all duration-300 ease-out ${
                    hoveredCard === item.id ? 'w-1 via-accent/100' : 'w-0.5'
                  }`} />
                </div>

                {/* Content Section - Always visible on mobile, expandable on desktop */}
                <div className={`bg-gradient-to-br from-card via-card/95 to-accent/5 backdrop-blur-lg transition-all duration-500 ease-in-out overflow-hidden lg:border-l lg:border-accent/20 p-4 lg:p-0 ${
                  hoveredCard === item.id ? 'lg:w-1/2 lg:opacity-100' : 'lg:w-0 lg:opacity-0'
                }`}>
                  <div className={`h-full flex flex-col justify-center lg:px-6 lg:py-8 transform transition-all duration-300 ease-in-out ${
                    hoveredCard === item.id ? 'lg:translate-x-0 lg:opacity-100' : 'lg:translate-x-4 lg:opacity-0'
                  }`}>
                    <div className="text-center space-y-3 lg:space-y-5">
                      <p className="text-foreground/85 text-sm lg:text-base leading-relaxed font-light max-w-sm mx-auto">
                        {item.content}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Accent Line */}
              <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent transition-all duration-300 ease-out ${
                hoveredCard === item.id ? 'opacity-100 via-accent/70' : 'opacity-60'
              }`} />
            </div>
          ))}
        </div>

        {/* Call to Action Button */}
        <div className="text-center mt-20">
          <Link href="/contact">
            <div className="inline-flex items-center space-x-2 px-6 py-3 bg-muted rounded-full cursor-pointer">
              <Star className="h-4 w-4 text-accent" />
              <span className="text-sm text-muted-foreground">Experience Unparalleled Luxury</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
