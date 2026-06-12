import Navigation from "../../components/navigation";
import { useSEO } from "@/hooks/use-seo";
import Footer from "../../components/footer";
import ScrollToTopButton from "../../components/scroll-to-top-button";
import { Button } from "@/components/ui/button";
import { Compass, Globe, Gem, Shield, CheckCircle2, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

// Import luxury Egyptian images
import luxuryHallImage from "@assets/elegant-hall_1757459228629.jpeg";
import suiteNileImage from "@assets/suite-nile_1757457083796.jpg";
import poolRiverImage from "@assets/pool-and-rivet_1757457083793.jpg";
import columnHallImage from "@assets/inside-the-column-hall_1757699232094.jpg";

interface ILuxuryDifferencePageContent {
  heroSubtitle: string;
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  introTitle: string;
  introText: string;
  differences: {
    title: string;
    subtitle: string;
    description: string;
    features: string[];
    image: string;
  }[];
  whyItMattersTitle: string;
  whyItMattersText: string;
}

const defaultContent: ILuxuryDifferencePageContent = {
  heroSubtitle: "What Sets Us Apart",
  heroTitle: "The iLuxury Difference",
  heroDescription: "Discover why discerning travelers choose I.LuxuryEgypt for their most important journeys.",
  heroImage: "",
  introTitle: "Beyond Ordinary Travel",
  introText: "In a world of standardized tours and cookie-cutter itineraries, I.LuxuryEgypt stands apart. We've built our reputation on four foundational pillars that guide every decision we make and every experience we create. These aren't just promises—they're the essence of who we are.",
  differences: [
    {
      title: "Tailored Journeys",
      subtitle: "Your Vision, Our Expertise",
      description: "No two travelers are alike, and neither should their journeys be. We begin every relationship by deeply understanding your travel style, interests, and dreams. From there, we craft an itinerary that feels less like a tour and more like a personal odyssey.",
      features: [
        "In-depth consultation to understand your preferences",
        "Flexible itineraries that adapt to your pace",
        "Personalized recommendations for dining, activities, and hidden gems",
        "Special occasion arrangements and surprise elements"
      ],
      image: ""
    },
    {
      title: "Egyptian Soul, Global Standards",
      subtitle: "Authentic Heritage, World-Class Service",
      description: "We are proudly Egyptian, and that heritage infuses every experience we create. Yet we hold ourselves to the highest international standards of luxury hospitality. This unique combination means you'll enjoy authentic cultural immersion delivered with impeccable professionalism.",
      features: [
        "Local expertise from native Egyptians who know every nuance",
        "International service standards and protocols",
        "Seamless communication in multiple languages",
        "Cultural sensitivity combined with modern convenience"
      ],
      image: ""
    },
    {
      title: "Luxury in Every Detail",
      subtitle: "Where Excellence Is Standard",
      description: "True luxury lies in the details—the thread count of your sheets, the vintage of your wine, the expertise of your guide. We obsess over these details so you don't have to. Every element of your journey is carefully curated to meet the highest standards of excellence.",
      features: [
        "Hand-selected accommodations at Egypt's finest properties",
        "Private vehicles with professional chauffeurs",
        "Gourmet dining experiences at exclusive venues",
        "Premium amenities and thoughtful touches throughout"
      ],
      image: ""
    },
    {
      title: "Peace of Mind, Redefined",
      subtitle: "Travel Without Worry",
      description: "When you travel with I.LuxuryEgypt, you're never alone. Our dedicated team monitors every aspect of your journey, anticipating needs before they arise and resolving any issues instantly. This invisible support system allows you to be fully present in every moment.",
      features: [
        "24/7 dedicated concierge support",
        "Real-time trip monitoring and proactive assistance",
        "Comprehensive travel insurance options",
        "Emergency response protocols and local contacts"
      ],
      image: ""
    }
  ],
  whyItMattersTitle: "Why It Matters",
  whyItMattersText: "Egypt is more than a destination—it's a profound experience that has captivated travelers for millennia. The difference between an ordinary trip and an extraordinary journey lies in the details, the access, and the expertise that guide you. We exist to ensure that your encounter with Egypt is as magnificent as this ancient land deserves.",
};

// Default images for each pillar
const defaultImages = [luxuryHallImage, columnHallImage, suiteNileImage, poolRiverImage];

// Icons for each pillar
const pillarIcons = [
  <Compass className="h-10 w-10 text-accent" />,
  <Globe className="h-10 w-10 text-accent" />,
  <Gem className="h-10 w-10 text-accent" />,
  <Shield className="h-10 w-10 text-accent" />,
];

export default function ILuxuryDifference() {
  useSEO({
    title: "The iLuxury Difference",
    description: "What sets I.LuxuryEgypt apart. Discover our commitment to unparalleled luxury and personalized service.",
  });

  // Fetch page content from CMS
  const { data: pageData } = useQuery({
    queryKey: ["publicILuxuryDifferencePage"],
    queryFn: async () => {
      const response = await fetch("/api/public/iluxury-difference-page");
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });

  // Use fetched content or defaults
  const content: ILuxuryDifferencePageContent = pageData?.content || defaultContent;

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

        {/* Difference Sections */}
        {(content.differences || defaultContent.differences).map((diff, index) => (
          <section
            key={index}
            className={`py-20 ${index % 2 === 0 ? 'bg-muted/30' : 'bg-background'}`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}>
                {/* Content */}
                <div className={`space-y-8 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                      {pillarIcons[index]}
                    </div>
                    <div>
                      <p className="text-accent font-medium text-sm tracking-wide uppercase">
                        {diff.subtitle}
                      </p>
                      <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary">
                        {diff.title}
                      </h2>
                    </div>
                  </div>

                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {diff.description}
                  </p>

                  <div className="space-y-4">
                    {diff.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                        <p className="text-muted-foreground">{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Image */}
                <div className={`relative ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src={diff.image || defaultImages[index]}
                      alt={diff.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                  </div>

                  {/* Floating accent */}
                  <div className={`absolute -bottom-6 ${index % 2 === 0 ? '-right-6' : '-left-6'} w-24 h-24 bg-accent/20 rounded-full blur-2xl`}></div>

                  {/* Number badge */}
                  <div className={`absolute -top-4 ${index % 2 === 0 ? '-left-4' : '-right-4'} w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-xl`}>
                    <span className="text-2xl font-serif font-bold text-primary-foreground">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* Why It Matters */}
        <section className="py-20 bg-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mb-8">
              {content.whyItMattersTitle}
            </h2>
            <div className="w-24 h-px bg-accent mx-auto mb-10"></div>

            <p className="text-xl text-primary-foreground/90 leading-relaxed mb-12">
              {content.whyItMattersText}
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/about/your-experience">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-4 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                >
                  Explore Your Experience
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  className="px-8 py-4 text-lg bg-accent text-primary hover:bg-accent/90"
                >
                  Plan Your Journey
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
