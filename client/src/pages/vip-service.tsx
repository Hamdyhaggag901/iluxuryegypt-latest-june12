import { useSEO } from "@/hooks/use-seo";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import ScrollToTopButton from "../components/scroll-to-top-button";

export default function VipService() {
  useSEO({
    title: "Luxury VIP Service | iLuxury Egypt",
    description:
      "A personal welcome team, private transportation vetted city by city, and every arrangement handled with quiet precision.",
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="min-h-[60vh] flex items-center justify-center pt-32 pb-20" data-testid="vip-service-page">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-accent font-medium">
            Luxury VIP Service
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mt-4">Coming Soon</h1>
        </div>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
