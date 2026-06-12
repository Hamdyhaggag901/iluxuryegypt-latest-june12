import { Button } from "@/components/ui/button";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { ArrowLeft, MapPin, Clock, Plane } from "lucide-react";
import { Link } from "wouter";

export default function Luxor() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1540979336798-c06a5e4bfac8?q=80&w=2070&auto=format&fit=crop"
          alt="Luxor - The World's Greatest Open-Air Museum"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
        
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">Luxor</h1>
          <p className="text-xl md:text-2xl text-accent font-medium mb-8 tracking-wide">
            The World's Greatest Open-Air Museum
          </p>
          <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed max-w-3xl mx-auto">
            Built on the ruins of ancient Thebes, Luxor hosts the world's greatest concentration of ancient monuments. 
            Here, pharaohs built eternal temples and carved their tombs into sacred valleys.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="px-8 py-4 text-lg min-w-[200px]" data-testid="button-plan-luxor">
                Plan Your Luxor Journey
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
              <p className="text-muted-foreground">October to April<br />Perfect temple exploration weather</p>
            </div>
            <div className="text-center">
              <Plane className="h-8 w-8 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-primary mb-2">Travel Time</h3>
              <p className="text-muted-foreground">1.5 hours from Cairo<br />Luxor International Airport</p>
            </div>
            <div className="text-center">
              <MapPin className="h-8 w-8 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-primary mb-2">Location</h3>
              <p className="text-muted-foreground">Upper Egypt<br />Ancient Thebes</p>
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
              Luxor: Ancient Thebes Revealed
            </h2>
            <div className="w-24 h-px bg-accent mb-8"></div>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              Once the capital of ancient Egypt during the New Kingdom, Luxor contains about one-third of the world's 
              most valuable ancient monuments. The city straddles the Nile, with magnificent temples on the East Bank 
              and the legendary Valley of the Kings on the West Bank, creating an unparalleled archaeological wonderland 
              that continues to reveal new secrets.
            </p>
          </div>

          {/* Highlights Grid */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Valley of the Kings */}
            <div className="group">
              <div className="relative overflow-hidden rounded-xl mb-6">
                <img
                  src="https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=2070&auto=format&fit=crop"
                  alt="Valley of the Kings"
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Valley of the Kings</h3>
              <p className="text-muted-foreground leading-relaxed">
                The sacred burial ground of Egypt's greatest pharaohs, including Tutankhamun, Ramesses II, and Seti I. 
                These elaborately decorated tombs, carved deep into limestone cliffs, contain some of the finest ancient art 
                ever created, with walls covered in intricate paintings and hieroglyphs that guide pharaohs through the afterlife.
              </p>
            </div>

            {/* Karnak Temple */}
            <div className="group">
              <div className="relative overflow-hidden rounded-xl mb-6">
                <img
                  src="https://images.unsplash.com/photo-1553913863-7e72d2b9e9b3?q=80&w=2070&auto=format&fit=crop"
                  alt="Karnak Temple Complex"
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Karnak Temple</h3>
              <p className="text-muted-foreground leading-relaxed">
                The largest religious complex ever built, Karnak represents 2,000 years of ancient Egyptian religious development. 
                The famous Hypostyle Hall contains 134 massive columns, each as wide as 12 people holding hands, while the sacred 
                lake and multiple temples create a spiritual journey through ancient Egyptian beliefs and architectural mastery.
              </p>
            </div>

            {/* Luxor Temple */}
            <div className="group">
              <div className="relative overflow-hidden rounded-xl mb-6">
                <img
                  src="https://images.unsplash.com/photo-1590073844006-33174c997e49?q=80&w=2070&auto=format&fit=crop"
                  alt="Luxor Temple"
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Luxor Temple</h3>
              <p className="text-muted-foreground leading-relaxed">
                Built primarily by Amenhotep III and Ramesses II, this graceful temple was dedicated to the rejuvenation of kingship. 
                Connected to Karnak by the ancient Avenue of Sphinxes, Luxor Temple is particularly magical when illuminated at night, 
                revealing the detailed reliefs and towering statues that have stood guard for over 3,000 years.
              </p>
            </div>

            {/* Hatshepsut Temple */}
            <div className="group">
              <div className="relative overflow-hidden rounded-xl mb-6">
                <img
                  src="https://images.unsplash.com/photo-1583991928792-db38bb14fd69?q=80&w=2070&auto=format&fit=crop"
                  alt="Hatshepsut Temple"
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Hatshepsut Temple</h3>
              <p className="text-muted-foreground leading-relaxed">
                The magnificent mortuary temple of Egypt's most successful female pharaoh rises in terraces against the dramatic 
                cliffs of Deir el-Bahari. This architectural marvel, with its unique design that harmonizes with the natural landscape, 
                celebrates Hatshepsut's 22-year reign and remains one of the most photographed monuments in Egypt.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-muted rounded-2xl p-12">
            <h3 className="text-3xl font-serif font-bold text-primary mb-6">
              Ready to Walk Among Pharaohs?
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Let our specialists design your perfect Luxor experience, from exclusive tomb access to private temple tours 
              and luxury Nile cruise departures.
            </p>
            <Link href="/contact">
              <Button size="lg" className="px-8 py-4 text-lg text-white" data-testid="button-contact-luxor">
                Start Planning Your Luxor Adventure
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}