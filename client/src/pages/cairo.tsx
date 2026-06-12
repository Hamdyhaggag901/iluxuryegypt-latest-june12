import { Button } from "@/components/ui/button";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { ArrowLeft, MapPin, Clock, Plane } from "lucide-react";
import { Link } from "wouter";

export default function Cairo() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1593115057322-e94b77572f20?q=80&w=2071&auto=format&fit=crop"
          alt="Cairo - The City of a Thousand Minarets"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
        
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">Cairo</h1>
          <p className="text-xl md:text-2xl text-accent font-medium mb-8 tracking-wide">
            The City of a Thousand Minarets
          </p>
          <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed max-w-3xl mx-auto">
            Where ancient Islamic architecture meets vibrant modern life, Cairo pulses with the energy of centuries. 
            The largest city in the Arab world offers an intoxicating blend of history, culture, and bustling street life.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="px-8 py-4 text-lg min-w-[200px]" data-testid="button-plan-cairo">
                Plan Your Cairo Journey
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
              <p className="text-muted-foreground">October to April<br />Ideal weather for exploration</p>
            </div>
            <div className="text-center">
              <Plane className="h-8 w-8 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-primary mb-2">Travel Hub</h3>
              <p className="text-muted-foreground">Cairo International Airport<br />Gateway to all Egypt</p>
            </div>
            <div className="text-center">
              <MapPin className="h-8 w-8 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-primary mb-2">Location</h3>
              <p className="text-muted-foreground">Northern Egypt<br />Nile Delta region</p>
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
              Cairo: Where History Meets Modernity
            </h2>
            <div className="w-24 h-px bg-accent mb-8"></div>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              Cairo, the "Mother of the World" as Arabs call it, is a city where minarets pierce the skyline and the call to prayer 
              echoes through labyrinthine medieval streets. Home to over 20 million people, this sprawling metropolis guards treasures 
              from Islamic Cairo, one of the world's largest collections of historic Islamic architecture, while the nearby Giza plateau 
              holds the last remaining Wonder of the Ancient World.
            </p>
          </div>

          {/* Highlights Grid */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Islamic Cairo */}
            <div className="group">
              <div className="relative overflow-hidden rounded-xl mb-6">
                <img
                  src="https://images.unsplash.com/photo-1593115057590-a49c93ae2c40?q=80&w=2070&auto=format&fit=crop"
                  alt="Islamic Cairo"
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Islamic Cairo</h3>
              <p className="text-muted-foreground leading-relaxed">
                A UNESCO World Heritage site encompassing hundreds of mosques, madrasas, hammams, and fountains dating from the Fatimid, 
                Ayyubid, Bahri Mamluk, and Ottoman periods. Walking through these medieval streets feels like traveling through time, 
                with architectural masterpieces around every corner and the authentic rhythm of traditional Cairo life.
              </p>
            </div>

            {/* Khan el-Khalili Bazaar */}
            <div className="group">
              <div className="relative overflow-hidden rounded-xl mb-6">
                <img
                  src="https://images.unsplash.com/photo-1578920036356-3a1d31b72e11?q=80&w=2069&auto=format&fit=crop"
                  alt="Khan el-Khalili Bazaar"
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Khan el-Khalili Bazaar</h3>
              <p className="text-muted-foreground leading-relaxed">
                The heart of Cairo's trading district since the 14th century, this legendary bazaar pulses with the energy of merchants, 
                craftsmen, and shoppers. Navigate through narrow alleys filled with spices, jewelry, textiles, and antiques while 
                experiencing the ancient art of bargaining and enjoying traditional mint tea at historic coffeehouses.
              </p>
            </div>

            {/* Saladin Citadel */}
            <div className="group">
              <div className="relative overflow-hidden rounded-xl mb-6">
                <img
                  src="https://images.unsplash.com/photo-1557200134-90327dfff544?q=80&w=2070&auto=format&fit=crop"
                  alt="Saladin Citadel"
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Saladin Citadel</h3>
              <p className="text-muted-foreground leading-relaxed">
                Built by the great Kurdish leader Saladin in the 12th century to defend against Crusader attacks, this imposing fortress 
                offers panoramic views of Cairo and houses the magnificent Mosque of Muhammad Ali. The citadel's massive walls and towers 
                tell the story of medieval Islamic military architecture while providing refuge from the city's bustling streets below.
              </p>
            </div>

            {/* Al-Azhar Mosque */}
            <div className="group">
              <div className="relative overflow-hidden rounded-xl mb-6">
                <img
                  src="https://images.unsplash.com/photo-1578920036476-7b4c7a1e6e5b?q=80&w=2069&auto=format&fit=crop"
                  alt="Al-Azhar Mosque"
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Al-Azhar Mosque</h3>
              <p className="text-muted-foreground leading-relaxed">
                Founded in 970 CE, Al-Azhar stands as one of Islam's most important centers of learning and spiritual guidance. 
                This architectural jewel combines Fatimid, Mamluk, and Ottoman elements, while its affiliated university remains 
                one of the world's oldest continuously operating educational institutions, attracting Islamic scholars from across the globe.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-muted rounded-2xl p-12">
            <h3 className="text-3xl font-serif font-bold text-primary mb-6">
              Ready to Explore Cairo's Rich Heritage?
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Let our specialists guide you through the winding streets of Islamic Cairo, bustling bazaars, and magnificent mosques 
              that make this city truly unforgettable.
            </p>
            <Link href="/contact">
              <Button size="lg" className="px-8 py-4 text-lg text-white" data-testid="button-contact-cairo">
                Start Planning Your Cairo Adventure
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}