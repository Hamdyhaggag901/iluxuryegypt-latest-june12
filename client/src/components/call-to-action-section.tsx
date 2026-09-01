import { useState, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Mail, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// Both pull in react-hook-form + Radix select; this section is on the home
// page, so load them only once someone actually opens a modal.
const SpeakToExpertModal = lazy(() => import("@/components/speak-to-expert-modal"));
const TripBuilderModal = lazy(() => import("@/components/trip-builder-modal"));

// Fallback contact info
const fallbackContact = {
  phone: "+20 (0) 123 456 789",
  email: "concierge@iluxuryegypt.com",
};

export default function CallToActionSection() {
  const [isSpeakToExpertOpen, setIsSpeakToExpertOpen] = useState(false);
  const [isTripBuilderOpen, setIsTripBuilderOpen] = useState(false);
  const [hasOpenedSpeakToExpert, setHasOpenedSpeakToExpert] = useState(false);
  const [hasOpenedTripBuilder, setHasOpenedTripBuilder] = useState(false);

  // Fetch from database
  const { data } = useQuery({
    queryKey: ["publicContactCtaSection"],
    queryFn: async () => {
      const response = await fetch("/api/public/contact-cta-section");
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });

  const contact = data?.section || fallbackContact;

  return (
    <section className="py-20 bg-background" data-testid="call-to-action-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary mb-6 animate-fade-in">
            Ready to Experience Egypt?
          </h2>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Our Egypt specialists design bespoke journeys for the discerning traveler — private access, elite
            accommodations, and seamless service from arrival to departure. This is Egypt, without compromise.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button
              size="lg"
              variant="default"
              className="text-lg px-8 py-4 h-auto font-semibold min-w-[200px] transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in group"
              style={{ animationDelay: '0.5s' }}
              data-testid="button-start-planning"
              onClick={() => {
                setHasOpenedTripBuilder(true);
                setIsTripBuilderOpen(true);
              }}
            >
              <Calendar className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:rotate-12" />
              Start Planning
              <ArrowRight className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 h-auto font-semibold min-w-[200px] transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in group"
              style={{ animationDelay: '0.7s' }}
              data-testid="button-speak-expert"
              onClick={() => {
                setHasOpenedSpeakToExpert(true);
                setIsSpeakToExpertOpen(true);
              }}
            >
              <Phone className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
              Speak to an Expert
            </Button>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Phone */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
                <Phone className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Call Us</h3>
              <p className="text-muted-foreground">{contact.phone}</p>
              <p className="text-sm text-muted-foreground mt-1">Available 24/7</p>
            </div>

            {/* Email */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
                <Mail className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Email Us</h3>
              <p className="text-muted-foreground">{contact.email}</p>
              <p className="text-sm text-muted-foreground mt-1">Response within 2 hours</p>
            </div>

            {/* Consultation */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
                <Calendar className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Free Consultation</h3>
              <p className="text-muted-foreground">30-minute planning session</p>
              <p className="text-sm text-muted-foreground mt-1">No commitment required</p>
            </div>
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        {hasOpenedSpeakToExpert && (
          <SpeakToExpertModal open={isSpeakToExpertOpen} onOpenChange={setIsSpeakToExpertOpen} />
        )}
        {hasOpenedTripBuilder && (
          <TripBuilderModal open={isTripBuilderOpen} onOpenChange={setIsTripBuilderOpen} />
        )}
      </Suspense>
    </section>
  );
}
