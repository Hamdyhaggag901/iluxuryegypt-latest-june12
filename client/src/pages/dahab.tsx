import { Button } from "@/components/ui/button";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { ArrowLeft, MapPin, Clock, Plane } from "lucide-react";
import { Link } from "wouter";

export default function Dahab() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop"
          alt="Dahab - Bohemian Red Sea Gem"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
        
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">Dahab</h1>
          <p className="text-xl md:text-2xl text-accent font-medium mb-8 tracking-wide">
            Bohemian Red Sea Gem
          </p>
          <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed max-w-3xl mx-auto">
            A laid-back paradise where desert meets sea, Dahab offers world-class diving, windswept beaches, 
            and the free-spirited atmosphere that has captivated travelers for decades.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="px-8 py-4 text-lg min-w-[200px]" data-testid="button-plan-dahab">
                Plan Your Dahab Journey
              </Button>
            </Link>
            <Link href="/destinations">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg min-w-[200px] border-white text-white hover:bg-white hover:text-primary" data-testid="button-explore-destinations">
                Explore More Destinations
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Facts */}
      <section className="py-16 bg-muted">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Clock className="h-8 w-8 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-primary mb-2">Best Time to Visit</h3>
              <p className="text-muted-foreground">September to May<br />Perfect diving conditions</p>
            </div>
            <div className="text-center">
              <Plane className="h-8 w-8 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-primary mb-2">Travel Time</h3>
              <p className="text-muted-foreground">1.5 hours from Sharm<br />2 hours from Taba</p>
            </div>
            <div className="text-center">
              <MapPin className="h-8 w-8 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-primary mb-2">Location</h3>
              <p className="text-muted-foreground">Southeast Sinai Peninsula<br />Gulf of Aqaba coast</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <Link href="/destinations">
              <Button variant="ghost" className="mb-8" data-testid="button-back-destinations">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Destinations
              </Button>
            </Link>
            
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
              Dahab: Where Adventure Meets Serenity
            </h2>
            <div className="w-24 h-px bg-accent mb-8"></div>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              Once a humble Bedouin fishing village, Dahab has evolved into a unique destination that perfectly balances adventure 
              and relaxation. This bohemian paradise attracts divers, windsurfers, and free spirits drawn to its famous Blue Hole, 
              world-class reefs, and the laid-back atmosphere that pervades its beachfront cafes and desert camps. Here, modern 
              amenities blend seamlessly with traditional Bedouin hospitality.
            </p>
          </div>

          {/* Highlights Grid */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Blue Hole */}
            <div className="group">
              <div className="relative overflow-hidden rounded-xl mb-6">
                <img
                  src="https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=2070&auto=format&fit=crop"
                  alt="Blue Hole Diving Site"
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Blue Hole</h3>
              <p className="text-muted-foreground leading-relaxed">
                One of the world's most famous diving sites, the Blue Hole is a submarine sinkhole that plunges over 100 meters 
                into the depths of the Red Sea. This natural phenomenon creates an underwater cathedral where divers can explore 
                coral walls, encounter pelagic species, and experience the mystic blue depths that have made this site legendary 
                among the diving community worldwide.
              </p>
            </div>

            {/* Lighthouse Reef */}
            <div className="group">
              <div className="relative overflow-hidden rounded-xl mb-6">
                <img
                  src="https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?q=80&w=2070&auto=format&fit=crop"
                  alt="Lighthouse Reef"
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Lighthouse Reef</h3>
              <p className="text-muted-foreground leading-relaxed">
                This pristine coral reef ecosystem offers some of the Red Sea's most spectacular diving and snorkeling experiences. 
                The reef's perfect location provides shelter from currents while maintaining excellent visibility, creating ideal 
                conditions to observe the incredible diversity of marine life, from colorful reef fish to graceful rays and occasional 
                shark sightings in crystal-clear waters.
              </p>
            </div>

            {/* Bedouin Culture */}
            <div className="group">
              <div className="relative overflow-hidden rounded-xl mb-6">
                <img
                  src="https://images.unsplash.com/photo-1578917319419-d47b0ba7ea8b?q=80&w=2070&auto=format&fit=crop"
                  alt="Bedouin Culture in Dahab"
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Bedouin Culture</h3>
              <p className="text-muted-foreground leading-relaxed">
                Dahab provides authentic opportunities to experience traditional Bedouin culture through desert camps, camel treks, 
                and traditional meals under starlit skies. Local Bedouin guides share ancient knowledge of the desert, while visitors 
                can enjoy traditional music, storytelling, and the warm hospitality that has welcomed travelers to this region for 
                countless generations.
              </p>
            </div>

            {/* Windsurfing */}
            <div className="group">
              <div className="relative overflow-hidden rounded-xl mb-6">
                <img
                  src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop"
                  alt="Windsurfing in Dahab"
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Windsurfing</h3>
              <p className="text-muted-foreground leading-relaxed">
                Dahab's consistent thermal winds and protected lagoon create world-class conditions for windsurfing and kitesurfing. 
                The shallow, sandy-bottom lagoon provides a perfect learning environment for beginners, while experienced sailors 
                can challenge themselves in the open waters of the Gulf of Aqaba. Professional schools and equipment rental make 
                it easy to harness the power of the desert winds.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-muted rounded-2xl p-12">
            <h3 className="text-3xl font-serif font-bold text-primary mb-6">
              Ready to Experience Dahab's Unique Spirit?
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Let our specialists arrange your perfect Dahab adventure, from diving the legendary Blue Hole to authentic 
              Bedouin experiences and luxury beachfront accommodations.
            </p>
            <Link href="/contact">
              <Button size="lg" className="px-8 py-4 text-lg text-white" data-testid="button-contact-dahab">
                Start Planning Your Dahab Adventure
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}