import { useSEO } from "@/hooks/use-seo";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import ScrollToTopButton from "../components/scroll-to-top-button";
import TripBuilderForm from "../components/trip-builder-form";

export default function PlanYourTrip() {
  useSEO({
    title: "Plan Your Bespoke Egypt Journey | iLuxury Egypt",
    description: "Tell us your dates, style, and budget, and our specialists will design a fully private Egypt itinerary tailored around you.",
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-32 md:pt-40 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <TripBuilderForm className="bg-card border border-border rounded-2xl shadow-sm" />
        </div>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
