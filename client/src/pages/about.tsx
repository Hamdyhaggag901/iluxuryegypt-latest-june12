import Navigation from "../components/navigation";
import Footer from "../components/footer";
import ScrollToTopButton from "../components/scroll-to-top-button";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Star, Award, Users, MapPin, Clock, BookOpen } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

interface AboutPageContent {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroVideoUrl: string;
  storySubtitle: string;
  storyTitle: string;
  storyIntro: string;
  storyBlock1Tag: string;
  storyBlock1Title: string;
  storyBlock1Text: string;
  storyBlock1Image: string;
  storyPhilosophyTitle: string;
  storyPhilosophyText: string;
  storyBlock2Tag: string;
  storyBlock2Title: string;
  storyBlock2Text: string;
  storyPromiseText: string;
  storyImages: string[];
  statsTitle: string;
  statsSubtitle: string;
  stats: { number: string; label: string }[];
  valuesSubtitle: string;
  valuesTitle: string;
  valuesIntro: string;
  values: { title: string; description: string; image: string }[];
  teamSubtitle: string;
  teamTitle: string;
  teamIntro: string;
  teamMembers: { name: string; role: string; description: string; image: string }[];
  teamPhilosophyTitle: string;
  teamPhilosophyText: string;
  differenceTitle: string;
  differenceItems: { title: string; description: string }[];
  ctaTitle: string;
  ctaSubtitle: string;
}

// Import luxury Egyptian images
import luxuryHallImage from "@assets/elegant-hall_1757459228629.jpeg";
import pyramidLobbyImage from "@assets/pyramid-from-lobby_1757459228637.jpeg";
import menahousePyramidImage from "@assets/the-pyramid-from-mena-house_1757459228638.jpeg";
import suiteNileImage from "@assets/suite-nile_1757457083796.jpg";
import poolRiverImage from "@assets/pool-and-rivet_1757457083793.jpg";
import sunsetFeluccaImage from "@assets/sunset-felucca_1757456567256.jpg";
import khanKhaliliImage from "@assets/khan-khalili-restaurant_1757459228636.jpeg";
import columnHallImage from "@assets/inside-the-column-hall_1757699232094.jpg";
import islamicDistrictImage from "@assets/islamic-district-at-dawn_1757699232100.jpg";
import poolsideDrinkImage from "@assets/pool-side-drink_1757699232100.jpg";
import siwaPalmTreesImage from "@assets/siwa-palm-trees_1757699232101.jpg";

// Default content for fallback
const defaultContent: AboutPageContent = {
  heroTitle: "About I.LuxuryEgypt",
  heroSubtitle: "Redefining luxury travel in the cradle of civilization, where ancient wonders meet modern sophistication.",
  heroImage: "",
  heroVideoUrl: "/attached_assets/Salt Lake Float Therapy_1757459954474.mp4",
  storySubtitle: "Heritage & Excellence",
  storyTitle: "Our Story",
  storyIntro: "A journey that began with passion for Egypt's timeless beauty and evolved into the finest luxury travel experience in the land of the Pharaohs.",
  storyBlock1Tag: "Our Beginning",
  storyBlock1Title: "Born from Passion",
  storyBlock1Text: "Born from a passion for Egypt's timeless beauty and a commitment to unparalleled luxury, I.LuxuryEgypt was founded to offer discerning travelers an extraordinary way to experience the land of the Pharaohs.",
  storyBlock1Image: "",
  storyPhilosophyTitle: "Our Philosophy",
  storyPhilosophyText: "Luxury travel isn't just about opulent accommodations—it's about creating transformative experiences.",
  storyBlock2Tag: "Our Mission",
  storyBlock2Title: "Transformative Experiences",
  storyBlock2Text: "We believe in creating deeply personal connections with Egypt's rich heritage, breathtaking landscapes, and warm hospitality. From private sunrise ceremonies at the Pyramids to intimate felucca cruises on the Nile.",
  storyPromiseText: "To transform the way luxury travelers experience Egypt, creating deeply personal connections with ancient wonders through uncompromising excellence.",
  storyImages: [],
  statsTitle: "Excellence in Numbers",
  statsSubtitle: "Our commitment to luxury travel excellence, measured by the experiences we've crafted.",
  stats: [
    { number: "500+", label: "Luxury Travelers" },
    { number: "15+", label: "Years Experience" },
    { number: "50+", label: "Luxury Partners" },
    { number: "25+", label: "Unique Destinations" },
  ],
  valuesSubtitle: "Our Foundation",
  valuesTitle: "Our Values",
  valuesIntro: "Three principles that guide every extraordinary journey we create.",
  values: [
    { title: "Bespoke Excellence", description: "Every journey is meticulously crafted to exceed your expectations, with attention to the finest details that create unforgettable moments.", image: "" },
    { title: "Cultural Authenticity", description: "Experience Egypt's rich heritage through exclusive access to historical sites and genuine connections with local traditions.", image: "" },
    { title: "Luxury Accommodations", description: "Stay in Egypt's most prestigious hotels and resorts, handpicked for their exceptional service and unparalleled comfort.", image: "" },
  ],
  teamSubtitle: "Our Experts",
  teamTitle: "Meet Our Team",
  teamIntro: "The passionate curators behind every extraordinary Egyptian journey, bringing decades of expertise and an intimate knowledge of Egypt's hidden treasures.",
  teamMembers: [
    { name: "Ahmed Hassan", role: "Founder & Chief Experience Officer", description: "With over 15 years in luxury hospitality, Ahmed founded I.LuxuryEgypt to share Egypt's wonders with discerning travelers.", image: "" },
    { name: "Yasmin Farouk", role: "Luxury Travel Curator", description: "Our expert curator designs exclusive experiences that blend ancient history with modern luxury.", image: "" },
    { name: "Omar Mansour", role: "Guest Experience Director", description: "Ensuring every moment of your journey exceeds expectations with 24/7 concierge service.", image: "" },
  ],
  teamPhilosophyTitle: "Our Philosophy",
  teamPhilosophyText: "We believe that luxury travel is not just about where you go, but how deeply you connect with a destination. Our team doesn't just plan trips—we craft transformative journeys that honor Egypt's timeless heritage while exceeding your every expectation.",
  differenceTitle: "The I.LuxuryEgypt Difference",
  differenceItems: [
    { title: "24/7 Concierge", description: "Round-the-clock support from our dedicated luxury travel specialists, ensuring every need is met." },
    { title: "Exclusive Access", description: "Private entrances to historical sites, after-hours museum visits, and VIP experiences unavailable to regular tourists." },
    { title: "Luxury Partners", description: "Partnerships with Egypt's finest hotels, restaurants, and service providers for an unmatched experience." },
  ],
  ctaTitle: "Begin Your Egyptian Journey",
  ctaSubtitle: "Ready to experience Egypt like never before? Let our luxury travel specialists craft your perfect adventure in the land of ancient wonders.",
};

export default function About() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Fetch about page content
  const { data: pageData } = useQuery({
    queryKey: ["publicAboutPage"],
    queryFn: async () => {
      const response = await fetch("/api/public/about-page");
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });

  // Use fetched content or defaults
  const content: AboutPageContent = pageData?.content || defaultContent;

  // Helper to get icon for stats
  const getStatIcon = (index: number) => {
    const icons = [
      <Users className="h-8 w-8 text-accent" />,
      <Star className="h-8 w-8 text-accent" />,
      <Award className="h-8 w-8 text-accent" />,
      <MapPin className="h-8 w-8 text-accent" />,
    ];
    return icons[index] || <Award className="h-8 w-8 text-accent" />;
  };

  // Default images for team if not set
  const defaultTeamImages = [pyramidLobbyImage, islamicDistrictImage, khanKhaliliImage];

  // Default images for values if not set
  const defaultValueImages = [luxuryHallImage, columnHallImage, suiteNileImage];

  // Default story images
  const defaultStoryGalleryImages = [sunsetFeluccaImage, poolsideDrinkImage, khanKhaliliImage, siwaPalmTreesImage];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section with Video Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {!isVideoPlaying ? (
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${content.heroImage || menahousePyramidImage})`
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
          <h1 className="text-6xl md:text-8xl font-serif font-bold mb-6 animate-fade-in">
            {content.heroTitle}
          </h1>
          <p className="text-xl md:text-2xl mb-8 leading-relaxed">
            {content.heroSubtitle}
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              size="lg"
              className="px-8 py-4 text-lg"
              onClick={() => setIsVideoPlaying(!isVideoPlaying)}
              data-testid="button-play-video"
            >
              <Play className="h-5 w-5 mr-2" />
              {isVideoPlaying ? "View Gallery" : "Watch Story"}
            </Button>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                data-testid="button-start-journey"
              >
                Start Your Journey
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <main>
        {/* Our Story Section - Redesigned */}
        <section className="py-24 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23D4A574%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            {/* Enhanced Section Header */}
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

            {/* Main Story Content - New Layout */}
            <div className="space-y-20">
              {/* First Story Block */}
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

                  {/* Floating accent element */}
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
                  </div>

                  <div className="flex items-start gap-4 p-6 bg-background/60 backdrop-blur-sm rounded-xl border border-accent/10">
                    <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Star className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-primary mb-2">{content.storyPhilosophyTitle}</h4>
                      <p className="text-muted-foreground">
                        {content.storyPhilosophyText}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Second Story Block - Reversed */}
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
                  </div>

                  {/* Mission Statement Card */}
                  <div className="relative p-8 bg-primary rounded-2xl text-white overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-4">
                        <Award className="h-6 w-6 text-accent" />
                        <span className="font-semibold text-accent">Our Promise</span>
                      </div>
                      <blockquote className="text-lg font-serif italic leading-relaxed">
                        "{content.storyPromiseText}"
                      </blockquote>
                    </div>
                  </div>
                </div>

                <div className="relative lg:order-2 order-1">
                  <div className="grid grid-cols-2 gap-4 h-96">
                    <div className="space-y-4">
                      <div className="aspect-square rounded-xl overflow-hidden shadow-lg group">
                        <img
                          src={content.storyImages?.[0] || defaultStoryGalleryImages[0]}
                          alt="Sunset felucca cruise"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg group">
                        <img
                          src={content.storyImages?.[1] || defaultStoryGalleryImages[1]}
                          alt="Luxury service"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    </div>
                    <div className="space-y-4 mt-8">
                      <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg group">
                        <img
                          src={content.storyImages?.[2] || defaultStoryGalleryImages[2]}
                          alt="Khan Khalili experience"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="aspect-square rounded-xl overflow-hidden shadow-lg group">
                        <img
                          src={content.storyImages?.[3] || defaultStoryGalleryImages[3]}
                          alt="Siwa Oasis"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Floating accent element */}
                  <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Bottom decorative element */}
            <div className="mt-24 text-center">
              <div className="inline-flex items-center gap-4">
                <div className="w-16 h-px bg-gradient-to-r from-transparent to-accent"></div>
                <div className="w-4 h-4 bg-accent rounded-full"></div>
                <div className="w-16 h-px bg-gradient-to-l from-transparent to-accent"></div>
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
              {content.stats.map((stat, index) => (
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

        {/* Our Values Section */}
        <section className="py-20 bg-background" data-testid="section-values">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="tracking-[0.2em] uppercase text-accent text-sm font-medium mb-4">
                {content.valuesSubtitle}
              </p>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
                {content.valuesTitle}
              </h2>
              <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {content.valuesIntro}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {content.values.map((value, index) => (
                <div key={index} className="group text-center">
                  <div className="relative aspect-[3/4] mb-6 overflow-hidden rounded-lg shadow-lg">
                    <img
                      src={value.image || defaultValueImages[index]}
                      alt={value.title}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-60" />
                    <div className="absolute inset-0 border border-accent/20 rounded-lg" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-primary mb-4" data-testid={`value-title-${index}`}>
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
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
              {content.teamMembers.map((member, index) => (
                <div key={index} className="group">
                  <div className="relative mb-8">
                    <div className="aspect-[4/5] overflow-hidden rounded-lg shadow-xl">
                      <img
                        src={member.image || defaultTeamImages[index]}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </div>

                    {/* Floating name card */}
                    <div className="absolute -bottom-6 left-6 right-6 bg-background rounded-lg shadow-xl p-6 border border-accent/10">
                      <h3 className="text-xl font-serif font-bold text-primary mb-1">
                        {member.name}
                      </h3>
                      <p className="text-accent font-medium text-sm tracking-wide uppercase">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  {/* Description below */}
                  <div className="pt-8">
                    <p className="text-muted-foreground leading-relaxed text-center">
                      {member.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Team philosophy */}
            <div className="mt-20 text-center max-w-4xl mx-auto">
              <div className="bg-background rounded-xl p-8 md:p-12 shadow-lg border border-accent/10">
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-primary mb-6">
                  {content.teamPhilosophyTitle}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  "{content.teamPhilosophyText}"
                </p>
                <div className="w-16 h-px bg-accent mx-auto"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
                {content.differenceTitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {content.differenceItems.map((item, index) => {
                const icons = [
                  <Clock className="w-8 h-8 text-accent" />,
                  <Star className="w-8 h-8 text-accent" />,
                  <Award className="w-8 h-8 text-accent" />,
                ];
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 mx-auto mb-6 bg-accent/10 rounded-full flex items-center justify-center">
                      {icons[index] || <Award className="w-8 h-8 text-accent" />}
                    </div>
                    <h3 className="text-xl font-semibold text-primary mb-3">{item.title}</h3>
                    <p className="text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-background relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-background to-primary/5"></div>
          <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl border border-accent/20">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
                {content.ctaTitle}
              </h2>
              <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
                {content.ctaSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/contact">
                  <Button
                    size="lg"
                    className="px-8 py-4 text-lg min-w-[200px]"
                    data-testid="button-contact-us"
                  >
                    Contact Our Specialists
                  </Button>
                </Link>
                <Link href="/">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 py-4 text-lg min-w-[200px]"
                    data-testid="button-explore-experiences"
                  >
                    Explore Experiences
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
}