import { Card, CardContent } from "@/components/ui/card";
import { 
  Plane, 
  Bell, 
  Landmark, 
  Utensils, 
  Ship, 
  Sparkles 
} from "lucide-react";

export default function HighlightsSection() {
  const highlights = [
    {
      icon: Plane,
      title: "Private Airport Transfers",
      description: "Your journey begins the moment you land. A private representative meets you at the gate, guides you through a dedicated fast-track lane, and takes you directly to your hotel — no shared shuttles, no waiting.",
    },
    {
      icon: Bell,
      title: "24/7 Concierge Service",
      description: "Every guest gets a personal concierge reachable around the clock — not just business hours. Whether it's a last-minute reservation or a question at midnight, you have a direct line to someone who knows your trip in detail.",
    },
    {
      icon: Landmark,
      title: "Curated Cultural Experiences",
      description: "We arrange access most tour groups never get close to: private viewing hours at major sites before public opening, and time with resident Egyptologists. These aren't add-ons — they're built into how we plan every itinerary.",
    },
    {
      icon: Utensils,
      title: "Fine Dining & Culinary Journeys",
      description: "Beyond hotel breakfast buffets, we arrange private dining that showcases Egypt's real culinary heritage — from a chef-guided meal in a heritage Cairo house to a sunset dinner on your Nile vessel's deck.",
    },
    {
      icon: Ship,
      title: "Private Nile Cruises",
      description: "Sail the Nile aboard boutique vessels limited to a small number of cabins, not 200-passenger ships. Expect private balconies, a crew that knows your name by day two, and shore excursions timed to avoid the crowds.",
    },
    {
      icon: Sparkles,
      title: "Spa & Wellness Retreats",
      description: "After days of exploring ancient sites, we build in time for rest — treatments inspired by traditional Egyptian ingredients, arranged at properties chosen specifically for their spa facilities.",
    },
  ];

  return (
    <section id="experiences" className="py-20 bg-muted" data-testid="highlights-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-8 animate-fade-in">
            A Bespoke Journey Awaits
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {highlights.map((highlight, index) => {
            const IconComponent = highlight.icon;
            return (
              <Card 
                key={highlight.title}
                className="group hover-elevate luxury-transition shadow-lg hover:shadow-2xl hover:scale-105 hover:-translate-y-2 cursor-pointer border-0 bg-card hover:bg-card/90 overflow-hidden"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
                data-testid={`highlight-card-${index}`}
              >
                <CardContent className="p-8 text-center relative">
                  {/* Animated background glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 mx-auto mb-6 bg-accent rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 group-hover:bg-primary group-hover:shadow-lg">
                      <IconComponent className="h-8 w-8 text-accent-foreground group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-300" />
                    </div>
                    <h3 className="text-xl font-serif font-semibold text-primary mb-4 group-hover:text-accent transition-colors duration-300 transform group-hover:translate-y-1">
                      {highlight.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed group-hover:text-foreground transition-all duration-300 transform group-hover:translate-y-1">
                      {highlight.description}
                    </p>
                  </div>
                  
                  {/* Decorative corner elements that appear on hover */}
                  <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-accent opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0"></div>
                  <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-accent opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0"></div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
