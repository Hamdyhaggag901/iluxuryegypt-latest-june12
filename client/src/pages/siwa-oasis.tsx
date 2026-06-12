import { Button } from "@/components/ui/button";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { ArrowLeft, MapPin, Clock, Plane } from "lucide-react";
import { Link } from "wouter";

export default function SiwaOasis() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1546026423-cc4642628d2b?q=80&w=2070&auto=format&fit=crop"
          alt="Siwa Oasis - Desert Sanctuary & Ancient Oracle"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
        
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">Siwa Oasis</h1>
          <p className="text-xl md:text-2xl text-accent font-medium mb-8 tracking-wide">
            Desert Sanctuary & Ancient Oracle
          </p>
          <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed max-w-3xl mx-auto">
            Hidden in the Western Desert, Siwa Oasis offers a mystical escape where ancient traditions thrive, 
            oracle temples echo with history, and natural springs create an oasis paradise.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="px-8 py-4 text-lg min-w-[200px]" data-testid="button-plan-siwa">
                Plan Your Siwa Journey
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
              <p className="text-muted-foreground">October to April<br />Mild desert temperatures</p>
            </div>
            <div className="text-center">
              <Plane className="h-8 w-8 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-primary mb-2">Travel Time</h3>
              <p className="text-muted-foreground">8 hours from Cairo<br />Remote desert location</p>
            </div>
            <div className="text-center">
              <MapPin className="h-8 w-8 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-primary mb-2">Location</h3>
              <p className="text-muted-foreground">Western Desert<br />Near Libyan border</p>
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
              Siwa: Egypt's Hidden Jewel
            </h2>
            <div className="w-24 h-px bg-accent mb-8"></div>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              Far from the bustling cities and tourist trails, Siwa Oasis remains one of Egypt's most magical and authentic destinations. 
              This remote sanctuary in the Western Desert preserves ancient traditions, from the legendary Oracle of Amun consulted by 
              Alexander the Great to the unique Siwan culture that thrives in harmony with the harsh desert environment. Here, 
              time moves at the pace of palm fronds swaying in desert breezes.
            </p>
          </div>

          {/* Highlights Grid */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Temple of the Oracle */}
            <div className="group">
              <div className="relative overflow-hidden rounded-xl mb-6">
                <img
                  src="https://images.unsplash.com/photo-1578073884727-9ba8b1f7a9c5?q=80&w=2070&auto=format&fit=crop"
                  alt="Temple of the Oracle"
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Temple of the Oracle</h3>
              <p className="text-muted-foreground leading-relaxed">
                The legendary temple where Alexander the Great sought divine confirmation of his destiny stands atop the ancient city of Aghurmi. 
                For centuries, pilgrims traveled across the desert to consult the Oracle of Amun, whose prophecies influenced the fate of empires. 
                Today, visitors can explore these mysterious ruins and feel the spiritual power that drew ancient rulers to this remote sanctuary.
              </p>
            </div>

            {/* Cleopatra Springs */}
            <div className="group">
              <div className="relative overflow-hidden rounded-xl mb-6">
                <img
                  src="https://images.unsplash.com/photo-1578073075043-3e5d87b9a6b3?q=80&w=2070&auto=format&fit=crop"
                  alt="Cleopatra Springs"
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Cleopatra Springs</h3>
              <p className="text-muted-foreground leading-relaxed">
                Fed by natural underground springs, these crystal-clear pools maintain a constant temperature year-round, creating 
                a refreshing oasis in the desert heat. Legend claims that Cleopatra herself bathed in these waters during her visits 
                to the oracle. Today, these pristine springs offer visitors a chance to float in mineral-rich waters surrounded by 
                date palms and the endless expanse of golden sand dunes.
              </p>
            </div>

            {/* Shali Fortress */}
            <div className="group">
              <div className="relative overflow-hidden rounded-xl mb-6">
                <img
                  src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2070&auto=format&fit=crop"
                  alt="Shali Fortress"
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Shali Fortress</h3>
              <p className="text-muted-foreground leading-relaxed">
                Rising from the heart of Siwa town, this medieval fortress was built entirely from kershef, a unique building material 
                made from salt, clay, and palm wood. The ancient citadel protected the oasis dwellers for centuries until heavy rains 
                in 1926 partially dissolved its walls. Today, the atmospheric ruins provide panoramic views of the oasis and insight 
                into traditional Siwan architecture and defensive strategies.
              </p>
            </div>

            {/* Salt Lakes */}
            <div className="group">
              <div className="relative overflow-hidden rounded-xl mb-6">
                <img
                  src="https://images.unsplash.com/photo-1565626424178-c699f6601afd?q=80&w=2070&auto=format&fit=crop"
                  alt="Salt Lakes of Siwa"
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Salt Lakes</h3>
              <p className="text-muted-foreground leading-relaxed">
                Scattered throughout the oasis, these hypersaline lakes create surreal landscapes where visitors can float effortlessly 
                like in the Dead Sea. The high salt content creates spectacular crystal formations along the shores, while the mineral-rich 
                waters are renowned for their therapeutic properties. At sunset, these lakes reflect the desert sky in brilliant colors, 
                creating some of Siwa's most magical moments.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-muted rounded-2xl p-12">
            <h3 className="text-3xl font-serif font-bold text-primary mb-6">
              Ready to Discover Siwa's Ancient Mysteries?
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Let our specialists arrange your journey to this remote desert sanctuary, from luxury eco-lodges to authentic 
              cultural experiences and oracle temple explorations.
            </p>
            <Link href="/contact">
              <Button size="lg" className="px-8 py-4 text-lg text-white" data-testid="button-contact-siwa">
                Start Planning Your Siwa Adventure
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}