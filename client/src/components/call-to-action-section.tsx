import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Mail, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// Fallback contact info
const fallbackContact = {
  phone: "+20 (0) 123 456 789",
  email: "concierge@iluxuryegypt.com",
};

export default function CallToActionSection() {
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
            Let our luxury travel experts craft your perfect Egyptian adventure.
            From ancient wonders to modern comfort, every detail is tailored to you.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button
              size="lg"
              variant="default"
              className="text-lg px-8 py-4 h-auto font-semibold min-w-[200px] transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in group"
              style={{ animationDelay: '0.5s' }}
              data-testid="button-start-planning"
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
            >
              <Phone className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
              Speak to Expert
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
              <p className="text-sm text-muted-foreground/70 mt-1">Available 24/7</p>
            </div>

            {/* Email */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
                <Mail className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Email Us</h3>
              <p className="text-muted-foreground">{contact.email}</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Response within 2 hours</p>
            </div>

            {/* Consultation */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
                <Calendar className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Free Consultation</h3>
              <p className="text-muted-foreground">30-minute planning session</p>
              <p className="text-sm text-muted-foreground/70 mt-1">No commitment required</p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-border">
            <p className="text-muted-foreground mb-6">Trusted by luxury travelers worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm">Luxury Tours</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">98%</div>
                <div className="text-sm">Satisfaction Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm">Concierge Service</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">15+</div>
                <div className="text-sm">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
