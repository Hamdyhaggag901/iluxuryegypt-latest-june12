import { useSEO } from "@/hooks/use-seo";
import Navigation from "../components/navigation";
import HeroSlider from "../components/hero-slider";
import SiwaVideoSection from "../components/siwa-video-section";
import BrandBanner from "../components/brand-banner";
import GuestExperienceIntro from "../components/guest-experience-intro";
import WhyUseSection from "../components/why-use-section";
import HighlightsSection from "../components/highlights-section";
import LuxuryPackagesSection from "../components/destination-blocks";
import InteractiveMapSection from "../components/interactive-map-section";
import TestimonialSection from "../components/testimonial-section";
import CallToActionSection from "../components/call-to-action-section";
import Footer from "../components/footer";
import ScrollToTopButton from "../components/scroll-to-top-button";
import NewsletterSection from "../components/newsletter-section";

export default function Home() {
  useSEO({
    title: "Luxury Egypt Tours & Vacation Packages | Bespoke Private Tours",
    description: "Experience Egypt in pure luxury with I.LuxuryEgypt. Curated bespoke stays across Egypt's most iconic destinations from Nile-side sanctuaries to Red Sea havens.",
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSlider />
        <BrandBanner />
        <SiwaVideoSection />
        <GuestExperienceIntro />
        <WhyUseSection />
        <HighlightsSection />
        <LuxuryPackagesSection limit={3} />
        <InteractiveMapSection />
        <TestimonialSection />
        <CallToActionSection />
        <NewsletterSection />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}