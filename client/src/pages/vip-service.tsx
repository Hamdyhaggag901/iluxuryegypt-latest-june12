import { Car, ShieldCheck, Headset } from "lucide-react";
import { useSEO } from "@/hooks/use-seo";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import ScrollToTopButton from "../components/scroll-to-top-button";
import SplitFeature from "../components/split-feature";
import GalleryCarousel from "../components/gallery-carousel";
import ZigzagDivider from "../components/zigzag-divider";

const FAIRMONT_NILE_CITY = "https://iluxuryegypt.com/api/assets/uploads/31bb173b-480a-4a0d-afb7-7f76245df3c6.webp";
const DENDERA_TEMPLE = "https://iluxuryegypt.com/api/assets/uploads/dafdfff9-77fd-4112-a2cc-92ee26e68bf4.webp";
const MENA_HOUSE = "https://iluxuryegypt.com/api/assets/uploads/32ef96ad-7c53-4204-bda3-06a9865b332b.webp";
const NILE_RITZ = "https://iluxuryegypt.com/api/assets/uploads/1baf9cb1-334b-4688-9b0e-e3dda1d2d13e.webp";

const FEATURES = [
  {
    icon: Car,
    title: "Private Luxury Transportation",
    description:
      "Rather than a single fleet stretched across the country, we partner with the finest private transportation provider in each city you visit — vetted for comfort, punctuality, and discretion, so every transfer feels considered rather than convenient.",
  },
  {
    icon: Headset,
    title: "Highly Trained Staff",
    description:
      "Every guide, driver, and welcome-team member in our network is selected for professionalism as much as expertise. Multilingual, discreet, and deeply familiar with Egypt, they anticipate what you need before you have to ask for it.",
  },
  {
    icon: ShieldCheck,
    title: "Safety and Security",
    description:
      "Your itinerary is planned with security considered at every stage — routes, timing, and destinations alike. Our team stays close at hand throughout your visit, so you're free to explore Egypt with complete peace of mind.",
  },
];

const GALLERY_SLIDES = [
  { src: FAIRMONT_NILE_CITY, alt: "Fairmont Nile City hotel exterior on the Nile", caption: "Private arrival, Cairo" },
  { src: DENDERA_TEMPLE, alt: "The Temple of Hathor at Dendera", caption: "A guided journey beyond the capital" },
  { src: MENA_HOUSE, alt: "Marriott Mena House exterior beneath the Pyramids of Giza", caption: "Welcomed like royalty" },
  { src: NILE_RITZ, alt: "Nile Ritz-Carlton hotel exterior overlooking the Nile", caption: "Every detail, quietly arranged" },
];

export default function VipService() {
  useSEO({
    title: "Luxury VIP Service in Egypt | Private Transportation & Elite Travel – iLuxuryEgypt",
    description:
      "A dedicated welcome team, private transportation matched city by city, and round-the-clock peace of mind — luxury private service in Egypt, from arrival to departure.",
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <section className="relative" data-testid="vip-service-hero">
          <div className="relative h-[60vh] min-h-[440px] md:min-h-[560px] w-full overflow-hidden">
            <img
              src={FAIRMONT_NILE_CITY}
              alt="Sunset over the Nile from Fairmont Nile City"
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-black/55" />
            <div className="absolute inset-0 flex items-center justify-center text-center px-4">
              <div>
                <h1 className="text-5xl md:text-7xl font-serif font-bold text-white uppercase tracking-wide mb-4">
                  Luxury VIP Service
                </h1>
                <p className="text-white/85 text-lg max-w-xl mx-auto">An escort worthy of royalty.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24" data-testid="vip-service-intro">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-accent font-medium">
              Elite Luxury Experiences
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mt-4 mb-5">
              A Journey Shaped Entirely Around You
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              True luxury travel is measured less by what you see and more by how effortlessly you experience it.
              From the instant you land in Egypt to the moment you depart, every arrangement — transportation,
              timing, security — is handled before you think to ask. This is VIP service built on precision, not
              spectacle: a team working quietly in the background so your only task is to enjoy the journey.
            </p>
          </div>
        </section>

        <section className="pb-16 md:pb-24" data-testid="vip-service-features">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
              {FEATURES.map((feature) => (
                <SplitFeature key={feature.title} {...feature} />
              ))}
            </div>
          </div>
        </section>

        <section className="pb-16 md:pb-24" data-testid="vip-service-closing-statement">
          <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-16 h-px bg-accent mx-auto mb-8" />
            <p className="font-serif italic text-xl md:text-2xl text-primary">
              From your first step off the plane to your final night in Egypt, VIP service means one thing:
              nothing left to chance.
            </p>
            <div className="w-16 h-px bg-accent mx-auto mt-8" />
          </div>
        </section>

        <section className="py-16 md:py-24 bg-primary" data-testid="vip-service-gallery">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary-foreground mb-8 md:mb-10">
              A Closer Look
            </h2>
            <GalleryCarousel slides={GALLERY_SLIDES} dark />
          </div>
        </section>

        <ZigzagDivider />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
