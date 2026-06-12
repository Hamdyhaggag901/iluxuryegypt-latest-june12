import { useQuery } from "@tanstack/react-query";
import { useSEO } from "@/hooks/use-seo";
import Navigation from "../../components/navigation";
import Footer from "../../components/footer";
import ScrollToTopButton from "../../components/scroll-to-top-button";
import { Button } from "@/components/ui/button";
import {
  Crown, Users, BookOpen, Hotel, UtensilsCrossed,
  Landmark, Heart, Sparkles, ArrowRight, Star, Plane, Map, LucideIcon
} from "lucide-react";
import { Link } from "wouter";

// Import luxury Egyptian images as fallbacks
import luxuryHallImage from "@assets/elegant-hall_1757459228629.jpeg";
import pyramidLobbyImage from "@assets/pyramid-from-lobby_1757459228637.jpeg";
import menahousePyramidImage from "@assets/the-pyramid-from-mena-house_1757459228638.jpeg";
import suiteNileImage from "@assets/suite-nile_1757457083796.jpg";
import poolRiverImage from "@assets/pool-and-rivet_1757457083793.jpg";
import sunsetFeluccaImage from "@assets/sunset-felucca_1757456567256.jpg";
import khanKhaliliImage from "@assets/khan-khalili-restaurant_1757459228636.jpeg";
import columnHallImage from "@assets/inside-the-column-hall_1757699232094.jpg";

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Crown, Users, BookOpen, Hotel, UtensilsCrossed,
  Landmark, Heart, Star, Plane, Map
};

interface ExperienceItem {
  icon: string;
  title: string;
  description: string;
  highlights: string[];
  image: string;
}

interface SummaryCard {
  title: string;
  description: string;
}

interface YourExperiencePageContent {
  heroSubtitle: string;
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  introTitle: string;
  introText: string;
  experiences: ExperienceItem[];
  summaryTitle: string;
  summaryDescription: string;
  summaryCards: SummaryCard[];
  ctaButtonText: string;
}

// Default fallback images for experiences
const defaultExperienceImages = [
  menahousePyramidImage,
  sunsetFeluccaImage,
  columnHallImage,
  suiteNileImage,
  khanKhaliliImage,
  pyramidLobbyImage,
  poolRiverImage
];

const defaultContent: YourExperiencePageContent = {
  heroSubtitle: "Every Element Crafted",
  heroTitle: "Your Experience Includes",
  heroDescription: "Every journey with I.LuxuryEgypt encompasses these exceptional elements, ensuring an experience that exceeds imagination.",
  heroImage: "",
  introTitle: "A Complete Luxury Experience",
  introText: "When you travel with I.LuxuryEgypt, you're not just booking a trip—you're investing in a comprehensive experience designed to inspire, delight, and transform. Here's what awaits you on every journey we create.",
  experiences: [
    {
      icon: "Crown",
      title: "Private & VIP Experiences",
      description: "Step beyond the velvet rope into a world of exclusive access. Imagine the Great Pyramid to yourself at dawn, a private viewing at the Egyptian Museum, or a sunset dinner atop a Luxor temple. These aren't just tours—they're once-in-a-lifetime privileges.",
      highlights: [
        "Private access to monuments before or after public hours",
        "VIP museum experiences with behind-the-scenes access",
        "Exclusive dining in historic venues",
        "Private yacht and felucca experiences on the Nile"
      ],
      image: ""
    },
    {
      icon: "Users",
      title: "Boutique Group Journeys",
      description: "For those who enjoy the camaraderie of like-minded travelers, our boutique group journeys offer intimacy and exclusivity. Limited to small groups, these curated experiences combine the benefits of shared adventure with the standards of private travel.",
      highlights: [
        "Maximum 12 guests per journey",
        "Like-minded travelers with similar interests",
        "Expertly curated social experiences",
        "Exclusive group rates at premium properties"
      ],
      image: ""
    },
    {
      icon: "BookOpen",
      title: "Expert Storytellers",
      description: "Our guides aren't just knowledgeable—they're master storytellers who bring Egypt's 5,000-year history to vivid life. Each is a certified Egyptologist with deep expertise and the rare ability to make ancient history feel immediate and personal.",
      highlights: [
        "Certified Egyptologists with advanced degrees",
        "Fluent in multiple languages",
        "Passionate storytellers, not script readers",
        "Available for private, in-depth discussions"
      ],
      image: ""
    },
    {
      icon: "Hotel",
      title: "Curated Stays",
      description: "We've personally inspected and selected each property in our portfolio. From legendary grande dames like the Old Cataract to intimate desert camps under the stars, every accommodation is chosen for its exceptional character, service, and ability to enhance your journey.",
      highlights: [
        "Egypt's most prestigious hotels and resorts",
        "Unique boutique properties with character",
        "Luxury Nile cruise experiences",
        "Private desert camps and oasis retreats"
      ],
      image: ""
    },
    {
      icon: "UtensilsCrossed",
      title: "The Art of Dining",
      description: "Egyptian cuisine is a revelation, and we ensure you experience its full depth and variety. From street food tours with expert guides to private dinners at exclusive venues, every meal is an opportunity to discover Egypt's culinary heritage.",
      highlights: [
        "Private dining in historic locations",
        "Cooking classes with renowned chefs",
        "Curated food tours through local markets",
        "Fine dining at Egypt's best restaurants"
      ],
      image: ""
    },
    {
      icon: "Landmark",
      title: "Cultural & Historical Immersion",
      description: "Go beyond surface-level sightseeing to truly understand Egypt. Participate in archaeological discussions, attend exclusive lectures, visit active excavation sites, and engage with local artisans keeping ancient crafts alive.",
      highlights: [
        "Access to active archaeological sites",
        "Meetings with renowned Egyptologists",
        "Traditional craft workshops and demonstrations",
        "Cultural performances and artistic experiences"
      ],
      image: ""
    },
    {
      icon: "Heart",
      title: "Tailored for Every Traveler",
      description: "Whether you're a solo adventurer, a romantic couple, a multi-generational family, or a group of friends, we adapt every element to suit your needs. Special dietary requirements, accessibility needs, specific interests—everything is anticipated and accommodated.",
      highlights: [
        "Family-friendly itineraries with engaging activities for all ages",
        "Romantic experiences for couples",
        "Accessibility accommodations throughout",
        "Special interest journeys (photography, archaeology, wellness)"
      ],
      image: ""
    }
  ],
  summaryTitle: "All This and More",
  summaryDescription: "Beyond these core elements, every I.LuxuryEgypt journey includes thoughtful touches that elevate your experience from excellent to extraordinary.",
  summaryCards: [
    { title: "Seamless Logistics", description: "Airport meet-and-greet, all internal transfers, luggage handling, and documentation assistance." },
    { title: "Premium Inclusions", description: "Entry fees, gratuities, mineral water throughout, and quality refreshments during excursions." },
    { title: "Thoughtful Details", description: "Welcome amenities, personalized travel documents, and surprise touches throughout your journey." }
  ],
  ctaButtonText: "Create Your Experience"
};

export default function YourExperience() {
  useSEO({
    title: "Your Experience Includes",
    description: "Everything included in your I.LuxuryEgypt journey. From private transfers to expert guides.",
  });

  const { data } = useQuery({
    queryKey: ["yourExperiencePagePublic"],
    queryFn: async () => {
      const response = await fetch("/api/public/your-experience-page");
      if (!response.ok) throw new Error("Failed to fetch page content");
      return response.json();
    },
  });

  const content: YourExperiencePageContent = data?.content || defaultContent;

  // Helper function to get icon component
  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || Crown;
    return <IconComponent className="h-8 w-8" />;
  };

  // Helper function to get experience image
  const getExperienceImage = (exp: ExperienceItem, index: number) => {
    if (exp.image && exp.image.trim() !== "") {
      return exp.image;
    }
    return defaultExperienceImages[index] || defaultExperienceImages[0];
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${content.heroImage || luxuryHallImage})`
          }}
        />

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <p className="tracking-[0.3em] uppercase text-accent text-sm font-medium mb-4">
            {content.heroSubtitle}
          </p>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 animate-fade-in">
            {content.heroTitle}
          </h1>
          <p className="text-xl md:text-2xl mb-8 leading-relaxed max-w-3xl mx-auto">
            {content.heroDescription}
          </p>
        </div>
      </section>

      <main>
        {/* Introduction */}
        <section className="py-20 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="relative inline-block mb-8">
              <div className="absolute -inset-4 bg-accent/10 rounded-full blur-xl"></div>
              <div className="relative bg-background/80 backdrop-blur-sm rounded-full p-6 border border-accent/20">
                <Sparkles className="h-8 w-8 text-accent" />
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-8">
              {content.introTitle}
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              {content.introText}
            </p>
          </div>
        </section>

        {/* Experience Cards */}
        {content.experiences.map((exp, index) => (
          <section
            key={index}
            className={`py-16 ${index % 2 === 0 ? 'bg-muted/30' : 'bg-background'}`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}>
                {/* Image - alternating sides */}
                <div className={`relative ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src={getExperienceImage(exp, index)}
                      alt={exp.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                  </div>

                  {/* Icon badge */}
                  <div className={`absolute -bottom-4 ${index % 2 === 0 ? 'right-8' : 'left-8'} w-20 h-20 bg-accent rounded-full flex items-center justify-center shadow-xl text-primary`}>
                    {getIcon(exp.icon)}
                  </div>
                </div>

                {/* Content */}
                <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div>
                    <p className="text-accent font-medium text-sm tracking-wide uppercase mb-2">
                      Experience {String(index + 1).padStart(2, '0')}
                    </p>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary">
                      {exp.title}
                    </h2>
                  </div>

                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {exp.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {exp.highlights.map((highlight, hIndex) => (
                      <div key={hIndex} className="flex items-start gap-3">
                        <ArrowRight className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                        <p className="text-muted-foreground text-sm">{highlight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* Summary Section */}
        <section className="py-20 bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mb-6">
                {content.summaryTitle}
              </h2>
              <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
              <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
                {content.summaryDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {content.summaryCards.map((card, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 text-center">
                  <h3 className="font-serif font-bold text-primary-foreground text-xl mb-4">
                    {card.title}
                  </h3>
                  <p className="text-primary-foreground/80">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="px-8 py-4 text-lg bg-accent text-primary hover:bg-accent/90"
                >
                  {content.ctaButtonText}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
