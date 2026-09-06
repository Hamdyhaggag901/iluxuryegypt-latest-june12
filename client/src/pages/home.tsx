import { useSEO } from "@/hooks/use-seo";
import Navigation from "../components/navigation";
import HeroSlider from "../components/hero-slider";
import OurStorySection from "../components/our-story-section";
import WhyChooseUsEditorial from "../components/why-choose-us-editorial";
import CategoriesCarouselSection from "../components/categories-carousel-section";
import WhereYouWillStaySection from "../components/where-you-will-stay-section";
import PartnersMarqueeSection from "../components/partners-marquee-section";
import BrandBanner from "../components/brand-banner";
import GuestExperienceIntro from "../components/guest-experience-intro";
import WhyUseSection from "../components/why-use-section";
import HighlightsSection from "../components/highlights-section";
import LuxuryPackagesSection from "../components/destination-blocks";
import InteractiveMapSection from "../components/interactive-map-section";
import HowItWorksSection from "../components/how-it-works-section";
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
        <OurStorySection />
        <WhyChooseUsEditorial />
        <CategoriesCarouselSection />
        <WhereYouWillStaySection />
        <PartnersMarqueeSection />
        <BrandBanner />
        <GuestExperienceIntro />
        <WhyUseSection />
        <LuxuryPackagesSection
          limit={3}
          layout="bento"
          eyebrow="Our Collection"
          title="Luxury Egypt Tours"
          description="Handpicked luxury Egypt tours that pair private guides, five-star stays, and iconic sites into one seamless journey."
        />
        <InteractiveMapSection />
        <HighlightsSection />
        <HowItWorksSection />
        <TestimonialSection />
        <CallToActionSection />
        <HomeFAQSection />
        <NewsletterSection />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
