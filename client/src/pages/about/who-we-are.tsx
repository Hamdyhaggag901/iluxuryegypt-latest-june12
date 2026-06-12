import Navigation from "../../components/navigation";
import { useSEO } from "@/hooks/use-seo";
import Footer from "../../components/footer";
import ScrollToTopButton from "../../components/scroll-to-top-button";
import { Button } from "@/components/ui/button";
import { Play, Star, Award, Users, MapPin, BookOpen, Heart } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

interface WhoWeArePageContent {
  heroSubtitle: string;
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  heroVideoUrl: string;
  storySubtitle: string;
  storyTitle: string;
  storyIntro: string;
  storyBlock1Tag: string;
  storyBlock1Title: string;
  storyBlock1Text: string;
  storyBlock1Text2: string;
  storyBlock1Image: string;
  storyBlock2Tag: string;
  storyBlock2Title: string;
  storyBlock2Text: string;
  storyBlock2Text2: string;
  storyImages: string[];
  statsTitle: string;
  statsSubtitle: string;
  stats: { number: string; label: string }[];
  teamSubtitle: string;
  teamTitle: string;
  teamIntro: string;
  teamMembers: { name: string; role: string; description: string; image: string }[];
  philosophySubtitle: string;
  philosophyTitle: string;
  philosophyQuote: string;
  philosophyValues: { title: string; description: string }[];
  promiseSubtitle: string;
  promiseTitle: string;
  promiseText: string;
  promiseCards: { title: string; description: string }[];
}

// Import luxury Egyptian images
import pyramidLobbyImage from "@assets/pyramid-from-lobby_1757459228637.jpeg";
import menahousePyramidImage from "@assets/the-pyramid-from-mena-house_1757459228638.jpeg";
import sunsetFeluccaImage from "@assets/sunset-felucca_1757456567256.jpg";
import khanKhaliliImage from "@assets/khan-khalili-restaurant_1757459228636.jpeg";
import islamicDistrictImage from "@assets/islamic-district-at-dawn_1757699232100.jpg";
import poolsideDrinkImage from "@assets/pool-side-drink_1757699232100.jpg";
import siwaPalmTreesImage from "@assets/siwa-palm-trees_1757699232101.jpg";

// Default content
const defaultContent: WhoWeArePageContent = {
  heroSubtitle: "About I.LuxuryEgypt",
  heroTitle: "Who We Are",
  heroDescription: "Passionate curators of extraordinary Egyptian journeys, committed to redefining luxury travel in the land of the Pharaohs.",
  heroImage: "",
  heroVideoUrl: "/attached_assets/Salt Lake Float Therapy_1757459954474.mp4",
  storySubtitle: "Heritage & Excellence",
  storyTitle: "Our Story",
  storyIntro: "A journey that began with passion for Egypt's timeless beauty and evolved into the finest luxury travel experience in the land of the Pharaohs.",
  storyBlock1Tag: "Our Beginning",
  storyBlock1Title: "Born from Passion",
  storyBlock1Text: "Born from a passion for Egypt's timeless beauty and a commitment to unparalleled luxury, I.LuxuryEgypt was founded to offer discerning travelers an extraordinary way to experience the land of the Pharaohs.",
  storyBlock1Text2: "Our founder, Ahmed Hassan, spent decades immersed in Egypt's hospitality industry, witnessing firsthand how standard tourism often fails to capture the true magic of this ancient land. He envisioned something different—a travel experience that honors Egypt's 5,000-year heritage while delivering the highest standards of modern luxury.",
  storyBlock1Image: "",
  storyBlock2Tag: "Our Evolution",
  storyBlock2Title: "Growing with Purpose",
  storyBlock2Text: "What started as a small team of passionate travel experts has grown into Egypt's premier luxury travel company. We've carefully expanded our offerings while maintaining the intimate, personalized approach that defines us.",
  storyBlock2Text2: "Today, I.LuxuryEgypt partners with the finest hotels, employs expert Egyptologists, and curates exclusive experiences that remain inaccessible to ordinary tourists. Yet we've never lost sight of our founding mission: to create transformative journeys that connect travelers deeply with Egypt's soul.",
  storyImages: [],
  statsTitle: "Excellence in Numbers",
  statsSubtitle: "Our commitment to luxury travel excellence, measured by the experiences we've crafted.",
  stats: [
    { number: "500+", label: "Luxury Travelers" },
    { number: "15+", label: "Years Experience" },
    { number: "50+", label: "Luxury Partners" },
    { number: "25+", label: "Unique Destinations" },
  ],
  teamSubtitle: "Our Experts",
  teamTitle: "Our Team",
  teamIntro: "The passionate curators behind every extraordinary Egyptian journey, bringing decades of expertise and an intimate knowledge of Egypt's hidden treasures.",
  teamMembers: [
    { name: "Ahmed Hassan", role: "Founder & Chief Experience Officer", description: "With over 15 years in luxury hospitality, Ahmed founded I.LuxuryEgypt to share Egypt's wonders with discerning travelers. His vision combines authentic Egyptian heritage with world-class service standards.", image: "" },
    { name: "Yasmin Farouk", role: "Luxury Travel Curator", description: "Our expert curator designs exclusive experiences that blend ancient history with modern luxury. Yasmin's deep knowledge of Egypt's hidden treasures ensures every journey is unique.", image: "" },
    { name: "Omar Mansour", role: "Guest Experience Director", description: "Ensuring every moment of your journey exceeds expectations with 24/7 concierge service. Omar's attention to detail and dedication to guest satisfaction is unmatched.", image: "" },
  ],
  philosophySubtitle: "Our Beliefs",
  philosophyTitle: "Our Philosophy",
  philosophyQuote: "We believe that luxury travel is not just about where you go, but how deeply you connect with a destination. Our team doesn't just plan trips—we craft transformative journeys that honor Egypt's timeless heritage while exceeding your every expectation.",
  philosophyValues: [
    { title: "Authenticity", description: "Every experience reflects the true spirit of Egypt" },
    { title: "Excellence", description: "Uncompromising standards in every detail" },
    { title: "Connection", description: "Creating meaningful bonds with Egypt's heritage" },
  ],
  promiseSubtitle: "Our Commitment",
  promiseTitle: "Our Promise",
  promiseText: "We promise to transform your Egyptian journey into something extraordinary. From the moment you reach out to us until long after you've returned home, we commit to exceeding your expectations at every turn. Your adventure will be seamlessly orchestrated, deeply personal, and utterly unforgettable.",
  promiseCards: [
    { title: "Personalized Excellence", description: "Every journey tailored to your unique preferences" },
    { title: "24/7 Support", description: "We're always here, whenever you need us" },
    { title: "Exclusive Access", description: "Experiences unavailable to ordinary travelers" },
    { title: "Lasting Memories", description: "Moments that stay with you forever" },
  ],
};

// Default team images
const defaultTeamImages = [pyramidLobbyImage, islamicDistrictImage, khanKhaliliImage];
// Default story images
const defaultStoryImages = [sunsetFeluccaImage, poolsideDrinkImage, khanKhaliliImage, siwaPalmTreesImage];

export default function WhoWeAre() {
  useSEO({
    title: "Who We Are - About I.LuxuryEgypt",
    description: "Meet the team behind I.LuxuryEgypt. Passionate travel experts dedicated to crafting bespoke luxury Egypt experiences.",
  });

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Fetch page content from CMS
  const { data: pageData } = useQuery({
    queryKey: ["publicWhoWeArePage"],
    queryFn: async () => {
      const response = await fetch("/api/public/who-we-are-page");
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });

  // Use fetched content or defaults
  const content: WhoWeArePageContent = pageData?.content || defaultContent;

  // Helper to get stat icon
  const getStatIcon = (index: number) => {
    const icons = [
      <Users className="h-8 w-8 text-accent" />,
      <Star className="h-8 w-8 text-accent" />,
      <Award className="h-8 w-8 text-accent" />,
      <MapPin className="h-8 w-8 text-accent" />,
    ];
    return icons[index] || <Award className="h-8 w-8 text-accent" />;
  };

  // Helper to get philosophy value icon
  const getPhilosophyIcon = (index: number) => {
    const icons = [
      <Star className="w-6 h-6 text-accent" />,
      <Award className="w-6 h-6 text-accent" />,
      <Heart className="w-6 h-6 text-accent" />,
    ];
    return icons[index] || <Star className="w-6 h-6 text-accent" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] pt-32 md:pt-40 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {!isVideoPlaying ? (
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${content.heroImage || menahousePyramidImage})`
              }}
            />
          ) : (
            <video
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              controls={false}
            >
              <source src={content.heroVideoUrl || "/attached_assets/Salt Lake Float Therapy_1757459954474.mp4"} type="video/mp4" />
            </video>
          )}
        </div>

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
          <Button
            size="lg"
            className="px-8 py-4 text-lg"
            onClick={() => setIsVideoPlaying(!isVideoPlaying)}
          >
            <Play className="h-5 w-5 mr-2" />
            {isVideoPlaying ? "View Gallery" : "Watch Our Story"}
          </Button>
        </div>
      </section>

      <main>
        {/* Our Story Section */}
        <section className="py-24 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23D4A574%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            {/* Section Header */}
            <div className="text-center mb-20">
              <div className="relative inline-block mb-8">
                <div className="absolute -inset-4 bg-accent/10 rounded-full blur-xl"></div>
                <div className="relative bg-background/80 backdrop-blur-sm rounded-full p-6 border border-accent/20">
                  <BookOpen className="h-8 w-8 text-accent" />
                </div>
              </div>

              <p className="tracking-[0.3em] uppercase text-accent text-sm font-medium mb-4 animate-fade-in">
                {content.storySubtitle}
              </p>

              <h2 className="text-5xl md:text-6xl font-serif font-bold text-primary mb-8 leading-tight">
                {content.storyTitle}
              </h2>

              <div className="flex items-center justify-center space-x-6 mb-10">
                <div className="w-20 h-px bg-gradient-to-r from-transparent to-accent"></div>
                <div className="w-3 h-3 bg-accent rotate-45 rounded-sm"></div>
                <div className="w-20 h-px bg-gradient-to-l from-transparent to-accent"></div>
              </div>

              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light">
                {content.storyIntro}
              </p>
            </div>

            {/* Story Content */}
            <div className="space-y-20">
              {/* First Block */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="relative">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src={content.storyBlock1Image || menahousePyramidImage}
                      alt="The Pyramids from Mena House"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                        <h4 className="text-white font-serif font-bold text-lg mb-1">Where It All Began</h4>
                        <p className="text-white/90 text-sm">The view that inspired our vision</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-6 -right-6 w-20 h-20 bg-accent/20 rounded-full blur-2xl animate-pulse"></div>
                </div>

                <div className="space-y-8 lg:pl-8">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 bg-accent/10 rounded-full px-4 py-2">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span className="text-accent font-medium text-sm">{content.storyBlock1Tag}</span>
                    </div>

                    <h3 className="text-3xl md:text-4xl font-serif font-bold text-primary leading-tight">
                      {content.storyBlock1Title}
                    </h3>

                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {content.storyBlock1Text}
                    </p>

                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {content.storyBlock1Text2}
                    </p>
                  </div>
                </div>
              </div>

              {/* Second Block - Reversed */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8 lg:pr-8 lg:order-1 order-2">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 bg-accent/10 rounded-full px-4 py-2">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span className="text-accent font-medium text-sm">{content.storyBlock2Tag}</span>
                    </div>

                    <h3 className="text-3xl md:text-4xl font-serif font-bold text-primary leading-tight">
                      {content.storyBlock2Title}
                    </h3>

                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {content.storyBlock2Text}
                    </p>

                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {content.storyBlock2Text2}
                    </p>
                  </div>
                </div>

                <div className="relative lg:order-2 order-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="aspect-square rounded-xl overflow-hidden shadow-lg group">
                        <img
                          src={(content.storyImages && content.storyImages[0]) || defaultStoryImages[0]}
                          alt="Sunset felucca cruise"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg group">
                        <img
                          src={(content.storyImages && content.storyImages[1]) || defaultStoryImages[1]}
                          alt="Luxury service"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    </div>
                    <div className="space-y-4 mt-8">
                      <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg group">
                        <img
                          src={(content.storyImages && content.storyImages[2]) || defaultStoryImages[2]}
                          alt="Khan Khalili experience"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="aspect-square rounded-xl overflow-hidden shadow-lg group">
                        <img
                          src={(content.storyImages && content.storyImages[3]) || defaultStoryImages[3]}
                          alt="Siwa Oasis"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mb-6">
                {content.statsTitle}
              </h2>
              <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
                {content.statsSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {(content.stats || defaultContent.stats).map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
                      {getStatIcon(index)}
                    </div>
                  </div>
                  <div className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mb-2">
                    {stat.number}
                  </div>
                  <div className="text-primary-foreground/80 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Meet Our Team */}
        <section className="py-20 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="tracking-[0.2em] uppercase text-accent text-sm font-medium mb-4">
                {content.teamSubtitle}
              </p>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
                {content.teamTitle}
              </h2>
              <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {content.teamIntro}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {(content.teamMembers || defaultContent.teamMembers).map((member, index) => (
                <div key={index} className="group">
                  <div className="relative mb-8">
                    <div className="aspect-[4/5] overflow-hidden rounded-lg shadow-xl">
                      <img
                        src={member.image || defaultTeamImages[index] || defaultTeamImages[0]}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </div>

                    <div className="absolute -bottom-6 left-6 right-6 bg-background rounded-lg shadow-xl p-6 border border-accent/10">
                      <h3 className="text-xl font-serif font-bold text-primary mb-1">
                        {member.name}
                      </h3>
                      <p className="text-accent font-medium text-sm tracking-wide uppercase">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  <div className="pt-8">
                    <p className="text-muted-foreground leading-relaxed text-center">
                      {member.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Philosophy */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="relative inline-block mb-8">
                <div className="absolute -inset-4 bg-accent/10 rounded-full blur-xl"></div>
                <div className="relative bg-background/80 backdrop-blur-sm rounded-full p-6 border border-accent/20">
                  <Heart className="h-8 w-8 text-accent" />
                </div>
              </div>

              <p className="tracking-[0.2em] uppercase text-accent text-sm font-medium mb-4">
                {content.philosophySubtitle}
              </p>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
                {content.philosophyTitle}
              </h2>
              <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-muted rounded-2xl p-8 md:p-12 shadow-lg border border-accent/10">
                <blockquote className="text-xl md:text-2xl text-primary font-serif italic leading-relaxed mb-8 text-center">
                  "{content.philosophyQuote}"
                </blockquote>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                  {(content.philosophyValues || defaultContent.philosophyValues).map((value, index) => (
                    <div key={index} className="text-center">
                      <div className="w-12 h-12 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center">
                        {getPhilosophyIcon(index)}
                      </div>
                      <h4 className="font-serif font-bold text-primary mb-2">{value.title}</h4>
                      <p className="text-muted-foreground text-sm">
                        {value.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Promise */}
        <section className="py-20 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90"></div>
          <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <p className="tracking-[0.2em] uppercase text-accent text-sm font-medium mb-4">
              {content.promiseSubtitle}
            </p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mb-8">
              {content.promiseTitle}
            </h2>
            <div className="w-24 h-px bg-accent mx-auto mb-10"></div>

            <p className="text-xl md:text-2xl text-primary-foreground/90 leading-relaxed mb-12">
              {content.promiseText}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
              {(content.promiseCards || defaultContent.promiseCards).map((card, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <h4 className="font-serif font-bold text-primary-foreground mb-2">{card.title}</h4>
                  <p className="text-primary-foreground/80 text-sm">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>

            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                Start Your Journey With Us
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
