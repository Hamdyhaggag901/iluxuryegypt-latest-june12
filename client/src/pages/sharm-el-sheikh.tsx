import { Button } from "@/components/ui/button";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { ArrowLeft, MapPin, Clock, Plane } from "lucide-react";
import { Link } from "wouter";

export default function SharmElSheikh() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop"
          alt="Sharm El-Sheikh - Sinai's Resort Paradise"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
        
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">Sharm El-Sheikh</h1>
          <p className="text-xl md:text-2xl text-accent font-medium mb-8 tracking-wide">
            Sinai's Resort Paradise
          </p>
          <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed max-w-3xl mx-auto">
            Where the desert meets the sea, Sharm El-Sheikh offers world-class resorts, exceptional diving, 
            and the mystical beauty of the Sinai Peninsula in one extraordinary destination.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="px-8 py-4 text-lg min-w-[200px]" data-testid="button-plan-sharm">
                Plan Your Sharm Journey
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
              <p className="text-muted-foreground">Year-round destination<br />Mild winters, warm summers</p>
            </div>
            <div className="text-center">
              <Plane className="h-8 w-8 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-primary mb-2">Travel Time</h3>
              <p className="text-muted-foreground">1.5 hours from Cairo<br />International airport</p>
            </div>
            <div className="text-center">
              <MapPin className="h-8 w-8 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-primary mb-2">Location</h3>
              <p className="text-muted-foreground">South Sinai Peninsula<br />Red Sea coast</p>
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
              Sharm El-Sheikh: Where Desert Meets Sea
            </h2>
            <div className="w-24 h-px bg-accent mb-8"></div>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              Nestled between the dramatic mountains of the Sinai Peninsula and the crystal-clear waters of the Red Sea, 
              Sharm El-Sheikh represents Egypt's premier resort destination. This sophisticated oasis combines luxury 
              accommodations, world-renowned diving sites, and access to some of the region's most significant religious 
              and historical sites, creating an unparalleled destination for discerning travelers.
            </p>
          </div>

          {/* Highlights Grid */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Ras Mohammed Park */}
            <div className="group">
              <div className="relative overflow-hidden rounded-xl mb-6">
                <img
                  src="https://images.unsplash.com/photo-1582967788606-a171c1080cb0?q=80&w=2070&auto=format&fit=crop"
                  alt="Ras Mohammed National Park"
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Ras Mohammed National Park</h3>
              <p className="text-muted-foreground leading-relaxed">
                Egypt's first national park protects some of the world's most spectacular coral reefs at the southern tip of Sinai. 
                The underwater ecosystem here is legendary among divers, featuring pristine coral gardens, dramatic drop-offs, 
                and encounters with sharks, rays, and countless species of tropical fish in crystal-clear waters.
              </p>
            </div>

            {/* Naama Bay */}
            <div className="group">
              <div className="relative overflow-hidden rounded-xl mb-6">
                <img
                  src="https://images.unsplash.com/photo-1578073075043-3e5d87b9a6b3?q=80&w=2070&auto=format&fit=crop"
                  alt="Naama Bay"
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Naama Bay</h3>
              <p className="text-muted-foreground leading-relaxed">
                The heart of Sharm's resort district, Naama Bay combines luxury hotels, fine dining, and vibrant nightlife 
                along a stunning crescent-shaped beach. This pedestrian-friendly promenade offers everything from world-class 
                spas to duty-free shopping, all set against the backdrop of the Red Sea's turquoise waters.
              </p>
            </div>

            {/* Blue Hole Diving */}
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
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Blue Hole Diving</h3>
              <p className="text-muted-foreground leading-relaxed">
                One of the world's most famous diving sites, the Blue Hole near Dahab offers an otherworldly underwater experience. 
                This submarine sinkhole, over 100 meters deep, creates a natural aquarium where divers can explore coral walls, 
                underwater caves, and encounter pelagic species in the deep blue waters of this geological marvel.
              </p>
            </div>

            {/* St. Catherine Monastery */}
            <div className="group">
              <div className="relative overflow-hidden rounded-xl mb-6">
                <img
                  src="https://images.unsplash.com/photo-1578073884727-9ba8b1f7a9c5?q=80&w=2070&auto=format&fit=crop"
                  alt="St. Catherine Monastery"
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">St. Catherine Monastery</h3>
              <p className="text-muted-foreground leading-relaxed">
                At the foot of Mount Sinai lies one of Christianity's oldest working monasteries, founded in the 6th century. 
                This UNESCO World Heritage site houses priceless religious artifacts, ancient manuscripts, and the legendary 
                Burning Bush. The monastery offers a profound spiritual experience combined with breathtaking mountain landscapes.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-muted rounded-2xl p-12">
            <h3 className="text-3xl font-serif font-bold text-primary mb-6">
              Ready to Experience Sinai's Magic?
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Let our specialists design your perfect Sharm El-Sheikh experience, from luxury resort stays to world-class diving 
              adventures and spiritual journeys in the Sinai mountains.
            </p>
            <Link href="/contact">
              <Button size="lg" className="px-8 py-4 text-lg text-white" data-testid="button-contact-sharm">
                Start Planning Your Sharm Adventure
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}