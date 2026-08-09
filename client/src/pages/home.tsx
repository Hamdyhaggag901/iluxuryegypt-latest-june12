import { useSEO } from "@/hooks/use-seo";
import Navigation from "../components/navigation";
import HeroSlider from "../components/hero-slider";
import WhoIsILuxurySection from "../components/who-is-iluxury-section";
import BrandBanner from "../components/brand-banner";
import GuestExperienceIntro from "../components/guest-experience-intro";
import WhyUseSection from "../components/why-use-section";
import HighlightsSection from "../components/highlights-section";
import LuxuryPackagesSection from "../components/destination-blocks";
import InteractiveMapSection from "../components/interactive-map-section";
import TestimonialSection from "../components/testimonial-section";
import CallToActionSection from "../components/call-to-action-section";
import HomeFAQSection from "../components/home-faq-section";
import Footer from "../components/footer";
import ScrollToTopButton from "../components/scroll-to-top-button";
import NewsletterSection from "../components/newsletter-section";

export default function Home() {
  useSEO({
    title: "Egypt Luxury Tours | iLuxury Egypt - Bespoke Private Travel",
    description: "Private Egypt luxury tours crafted for discerning travelers. Exclusive Pyramid access, 5-star Nile cruises & Egyptologist guides. Start planning your bespoke journey today.",
    titleOverride: true,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSlider />
        <WhoIsILuxurySection />
        <BrandBanner />
        <GuestExperienceIntro />
        <WhyUseSection />
        <HighlightsSection />
        <LuxuryPackagesSection limit={3} />
        <InteractiveMapSection />
        <TestimonialSection />
        <CallToActionSection />
        <NewsletterSection />
        <HomeFAQSection />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
