import { useQuery } from "@tanstack/react-query";
import { useSEO } from "@/hooks/use-seo";
import Navigation from "../../components/navigation";
import Footer from "../../components/footer";
import ScrollToTopButton from "../../components/scroll-to-top-button";
import { Button } from "@/components/ui/button";
import { Star, Quote, Award, Building2, Plane, Shield, Globe, LucideIcon } from "lucide-react";
import { Link } from "wouter";

// Import luxury Egyptian images as fallbacks
import menahousePyramidImage from "@assets/the-pyramid-from-mena-house_1757459228638.jpeg";
import suiteNileImage from "@assets/suite-nile_1757457083796.jpg";

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Building2, Plane, Award, Globe, Star, Shield
};

interface PartnerItem {
  name: string;
  description: string;
}

interface PartnerCategory {
  category: string;
  icon: string;
  items: PartnerItem[];
}

interface Testimonial {
  text: string;
  author: string;
  location: string;
  trip: string;
  rating: number;
}

interface StatItem {
  value: string;
  label: string;
}

interface TrustedWorldwidePageContent {
  heroSubtitle: string;
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  stats: StatItem[];
  partnersSubtitle: string;
  partnersTitle: string;
  partnersDescription: string;
  partnerCategories: PartnerCategory[];
  testimonialsSubtitle: string;
  testimonialsTitle: string;
  testimonialsDescription: string;
  testimonials: Testimonial[];
  trustTitle: string;
  trustDescription: string;
  trustFeatures: string[];
  trustImage: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaPrimaryText: string;
  ctaSecondaryText: string;
}

const defaultContent: TrustedWorldwidePageContent = {
  heroSubtitle: "Our Reputation",
  heroTitle: "Trusted Worldwide",
  heroDescription: "Partnered with Egypt's finest, endorsed by travelers across the globe.",
  heroImage: "",
  stats: [
    { value: "500+", label: "Happy Travelers" },
    { value: "50+", label: "Premium Partners" },
    { value: "15+", label: "Years of Excellence" },
    { value: "4.9", label: "Average Rating" }
  ],
  partnersSubtitle: "Excellence Network",
  partnersTitle: "Our Partners",
  partnersDescription: "We've cultivated relationships with Egypt's most prestigious hotels, services, and organizations to ensure every aspect of your journey meets the highest standards.",
  partnerCategories: [
    {
      category: "Luxury Hotels",
      icon: "Building2",
      items: [
        { name: "Four Seasons Hotels Egypt", description: "Cairo & Alexandria properties" },
        { name: "Sofitel Legend Old Cataract", description: "Aswan's iconic heritage hotel" },
        { name: "Marriott Mena House", description: "Pyramid views since 1886" },
        { name: "The St. Regis Cairo", description: "Modern luxury on the Nile" },
        { name: "Oberoi Hotels Egypt", description: "Sahl Hasheesh & Philae" },
        { name: "Kempinski Hotels", description: "Red Sea & Nile properties" }
      ]
    },
    {
      category: "Premium Services",
      icon: "Plane",
      items: [
        { name: "EgyptAir Business Class", description: "Official airline partner" },
        { name: "Sanctuary Sun Boat", description: "Luxury Nile cruising" },
        { name: "Oberoi Zahra", description: "Premium cruise experiences" },
        { name: "Private Aviation", description: "Charter flight arrangements" },
        { name: "Luxury Ground Transport", description: "Mercedes & BMW fleet" },
        { name: "Desert Camps", description: "Exclusive Siwa & White Desert" }
      ]
    },
    {
      category: "Certifications & Memberships",
      icon: "Award",
      items: [
        { name: "Egyptian Tourism Authority", description: "Licensed tour operator" },
        { name: "ASTA Member", description: "American Society of Travel Advisors" },
        { name: "Virtuoso", description: "Luxury travel network" },
        { name: "Traveller Made", description: "Bespoke travel consortium" },
        { name: "IATA Accredited", description: "International airline ticketing" },
        { name: "Safe Travels Certified", description: "WTTC health & safety protocols" }
      ]
    }
  ],
  testimonialsSubtitle: "Guest Stories",
  testimonialsTitle: "Testimonials",
  testimonialsDescription: "Don't just take our word for it. Here's what travelers from around the world have said about their I.LuxuryEgypt experiences.",
  testimonials: [
    {
      text: "I've traveled extensively, but nothing has compared to my journey with I.LuxuryEgypt. The private sunrise at the Pyramids brought me to tears. Every detail was perfect, every guide exceptional. This wasn't a trip—it was a transformation.",
      author: "Sarah Mitchell",
      location: "New York, USA",
      trip: "Classic Egypt Journey",
      rating: 5
    },
    {
      text: "As a family with three generations traveling together, I was worried about keeping everyone happy. I.LuxuryEgypt made it effortless. My 8-year-old was as engaged as my 80-year-old mother. The guides were phenomenal with all ages.",
      author: "James & Elizabeth Chen",
      location: "San Francisco, USA",
      trip: "Multi-Generational Family Journey",
      rating: 5
    },
    {
      text: "The level of access we received was unbelievable. Private museum viewings, dinner inside a temple, conversations with real archaeologists—I still can't believe these experiences were possible. Worth every penny and more.",
      author: "Dr. Michael Roberts",
      location: "London, UK",
      trip: "Archaeological Deep Dive",
      rating: 5
    },
    {
      text: "Our honeymoon exceeded every dream. From the rose petals on our bed to the private felucca sunset, I.LuxuryEgypt created moments we'll cherish forever. The attention to romantic details was extraordinary.",
      author: "Emma & David Thompson",
      location: "Sydney, Australia",
      trip: "Romantic Egypt Escape",
      rating: 5
    },
    {
      text: "As a solo female traveler, safety was my priority. I never once felt unsafe or uncomfortable. My guide was professional, knowledgeable, and respectful. I'll be back—this time bringing my sister!",
      author: "Maria Santos",
      location: "São Paulo, Brazil",
      trip: "Solo Discovery Journey",
      rating: 5
    },
    {
      text: "We've used luxury travel agencies around the world, but I.LuxuryEgypt set a new standard. The seamlessness, the surprise upgrades, the genuine warmth—it felt like traveling with dear friends who happened to know everyone and everything in Egypt.",
      author: "Robert & Caroline Anderson",
      location: "Toronto, Canada",
      trip: "Nile Cruise & Cairo",
      rating: 5
    }
  ],
  trustTitle: "Your Trust, Our Priority",
  trustDescription: "When you book with I.LuxuryEgypt, you're protected by comprehensive safeguards. We're fully licensed, insured, and bonded. Your payments are secure, your data is protected, and your journey is backed by our reputation and guarantees.",
  trustFeatures: [
    "Fully licensed Egyptian tour operator",
    "Comprehensive liability insurance",
    "Secure payment processing",
    "GDPR-compliant data protection"
  ],
  trustImage: "",
  ctaTitle: "Ready to Experience the Difference?",
  ctaDescription: "Join hundreds of discerning travelers who have entrusted their Egyptian dreams to us. Let us show you why we're the most trusted name in luxury Egypt travel.",
  ctaPrimaryText: "Start Planning Your Journey",
  ctaSecondaryText: "Explore Experiences"
};

export default function TrustedWorldwide() {
  useSEO({
    title: "Trusted Worldwide",
    description: "I.LuxuryEgypt is trusted by discerning travelers worldwide for luxury Egypt travel experiences.",
  });

  const { data } = useQuery({
    queryKey: ["trustedWorldwidePagePublic"],
    queryFn: async () => {
      const response = await fetch("/api/public/trusted-worldwide-page");
      if (!response.ok) throw new Error("Failed to fetch page content");
      return response.json();
    },
  });

  const content: TrustedWorldwidePageContent = data?.content || defaultContent;

  // Helper function to get icon component
  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || Building2;
    return <IconComponent className="h-6 w-6" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${content.heroImage || menahousePyramidImage})`
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
        {/* Trust Indicators */}
        <section className="py-16 bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {content.stats.map((stat, index) => (
                <div key={index}>
                  <div className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mb-2">
                    {stat.value}
                  </div>
                  <p className="text-primary-foreground/80">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Partners */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="relative inline-block mb-8">
                <div className="absolute -inset-4 bg-accent/10 rounded-full blur-xl"></div>
                <div className="relative bg-background/80 backdrop-blur-sm rounded-full p-6 border border-accent/20">
                  <Globe className="h-8 w-8 text-accent" />
                </div>
              </div>

              <p className="tracking-[0.2em] uppercase text-accent text-sm font-medium mb-4">
                {content.partnersSubtitle}
              </p>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
                {content.partnersTitle}
              </h2>
              <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {content.partnersDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {content.partnerCategories.map((category, index) => (
                <div key={index} className="bg-muted/30 rounded-2xl p-8 border border-accent/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                      {getIcon(category.icon)}
                    </div>
                    <h3 className="text-xl font-serif font-bold text-primary">
                      {category.category}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="border-b border-accent/10 pb-4 last:border-0 last:pb-0">
                        <h4 className="font-medium text-primary">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="relative inline-block mb-8">
                <div className="absolute -inset-4 bg-accent/10 rounded-full blur-xl"></div>
                <div className="relative bg-background/80 backdrop-blur-sm rounded-full p-6 border border-accent/20">
                  <Quote className="h-8 w-8 text-accent" />
                </div>
              </div>

              <p className="tracking-[0.2em] uppercase text-accent text-sm font-medium mb-4">
                {content.testimonialsSubtitle}
              </p>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
                {content.testimonialsTitle}
              </h2>
              <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {content.testimonialsDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {content.testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-background rounded-2xl p-8 shadow-lg border border-accent/10 flex flex-col"
                >
                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-muted-foreground leading-relaxed mb-6 flex-grow">
                    "{testimonial.text}"
                  </blockquote>

                  {/* Author */}
                  <div className="border-t border-accent/10 pt-6">
                    <p className="font-serif font-bold text-primary">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    <p className="text-sm text-accent mt-1">{testimonial.trip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust & Safety */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="relative inline-block mb-8">
                  <div className="absolute -inset-4 bg-accent/10 rounded-full blur-xl"></div>
                  <div className="relative bg-background/80 backdrop-blur-sm rounded-full p-6 border border-accent/20">
                    <Shield className="h-8 w-8 text-accent" />
                  </div>
                </div>

                <h2 className="text-4xl font-serif font-bold text-primary mb-6">
                  {content.trustTitle}
                </h2>

                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {content.trustDescription}
                </p>

                <div className="space-y-4">
                  {content.trustFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                        <Shield className="h-4 w-4 text-accent" />
                      </div>
                      <p className="text-muted-foreground">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={content.trustImage || suiteNileImage}
                    alt="Luxury suite"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent/20 rounded-full blur-2xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mb-6">
              {content.ctaTitle}
            </h2>
            <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
            <p className="text-xl text-primary-foreground/90 leading-relaxed mb-10">
              {content.ctaDescription}
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="px-8 py-4 text-lg bg-accent text-primary hover:bg-accent/90"
                >
                  {content.ctaPrimaryText}
                </Button>
              </Link>
              <Link href="/egypt-tour-packages">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-4 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                >
                  {content.ctaSecondaryText}
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
