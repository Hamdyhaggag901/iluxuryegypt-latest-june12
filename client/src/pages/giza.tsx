import { Button } from "@/components/ui/button";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { ArrowLeft, MapPin, Clock, Plane } from "lucide-react";
import { Link } from "wouter";

export default function Giza() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1553913861-c0fddf2619ee?q=80&w=2070&auto=format&fit=crop"
          alt="Giza - Home of the Great Pyramids"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
        
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">Giza</h1>
          <p className="text-xl md:text-2xl text-accent font-medium mb-8 tracking-wide">
            Home of the Great Pyramids
          </p>
          <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed max-w-3xl mx-auto">
            Stand before the last surviving Wonder of the Ancient World. The Great Pyramids of Giza have watched over the Nile 
            for over 4,500 years, representing the pinnacle of ancient Egyptian architectural achievement.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="px-8 py-4 text-lg min-w-[200px]" data-testid="button-plan-giza">
                Plan Your Giza Journey
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
              <p className="text-muted-foreground">October to April<br />Cool mornings ideal for exploring</p>
            </div>
            <div className="text-center">
              <Plane className="h-8 w-8 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-primary mb-2">Travel Time</h3>
              <p className="text-muted-foreground">45 minutes from Cairo<br />30 minutes from downtown</p>
            </div>
            <div className="text-center">
              <MapPin className="h-8 w-8 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-primary mb-2">Location</h3>
              <p className="text-muted-foreground">Giza Governorate<br />Southwest of Cairo</p>
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
              The Eternal Monuments of Giza
            </h2>
            <div className="w-24 h-px bg-accent mb-8"></div>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              For over four and a half millennia, the Pyramids of Giza have stood as humanity's most enduring achievement. 
              Built during Egypt's Fourth Dynasty as eternal resting places for pharaohs Khufu, Khafre, and Menkaure, 
              these colossal monuments continue to inspire awe and wonder. Here, where ancient engineering meets timeless mystery, 
              visitors encounter the only surviving Wonder of the Ancient World.
            </p>
          </div>

          {/* Highlights Grid */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Great Pyramids */}
            <div className="group">
              <div className="relative overflow-hidden rounded-xl mb-6">
                <img
                  src="https://images.unsplash.com/photo-1586779942416-90a5f8fc82d6?q=80&w=2070&auto=format&fit=crop"
                  alt="Great Pyramids of Giza"
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Great Pyramids</h3>
              <p className="text-muted-foreground leading-relaxed">
                The Great Pyramid of Khufu, originally standing 146 meters tall, was the world's tallest human-made structure for over 
                3,800 years. Together with the pyramids of Khafre and Menkaure, these monuments showcase the pinnacle of Old Kingdom 
                engineering, with their precise construction and astronomical alignments continuing to mystify experts today.
              </p>
            </div>

            {/* Great Sphinx */}
            <div className="group">
              <div className="relative overflow-hidden rounded-xl mb-6">
                <img
                  src="https://images.unsplash.com/photo-1587138854008-9b3ed33b10b1?q=80&w=2069&auto=format&fit=crop"
                  alt="Great Sphinx of Giza"
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Great Sphinx</h3>
              <p className="text-muted-foreground leading-relaxed">
                Carved from a single piece of limestone, this enigmatic guardian with a human head and lion's body has watched over 
                the Giza plateau for over 4,500 years. Standing 20 meters high and 73 meters long, the Sphinx continues to pose 
                its eternal riddle while serving as an iconic symbol of ancient Egyptian civilization.
              </p>
            </div>

            {/* Solar Boat Museum */}
            <div className="group">
              <div className="relative overflow-hidden rounded-xl mb-6">
                <img
                  src="https://images.unsplash.com/photo-1578398999190-e6bcccd94db0?q=80&w=2070&auto=format&fit=crop"
                  alt="Solar Boat Museum"
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Solar Boat Museum</h3>
              <p className="text-muted-foreground leading-relaxed">
                Housing one of archaeology's most remarkable discoveries, this museum displays the reconstructed cedar boat of Pharaoh Khufu, 
                found dismantled in a pit beside the Great Pyramid. This 43-meter vessel, intended to carry the pharaoh through the afterlife, 
                represents the finest example of ancient Egyptian shipbuilding and religious beliefs about the journey to eternity.
              </p>
            </div>

            {/* Sound & Light Show */}
            <div className="group">
              <div className="relative overflow-hidden rounded-xl mb-6">
                <img
                  src="https://images.unsplash.com/photo-1578399027467-c7ad6b2ba11b?q=80&w=2070&auto=format&fit=crop"
                  alt="Sound and Light Show at Giza"
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Sound & Light Show</h3>
              <p className="text-muted-foreground leading-relaxed">
                As darkness falls over the plateau, the pyramids and Sphinx are illuminated in a spectacular multimedia presentation 
                that brings ancient Egyptian history to life. This enchanting evening experience combines dramatic lighting effects 
                with narration that tells the story of the pharaohs and their eternal monuments, creating magical moments under the desert stars.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-muted rounded-2xl p-12">
            <h3 className="text-3xl font-serif font-bold text-primary mb-6">
              Ready to Stand Before Ancient Wonders?
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Let our specialists arrange your exclusive access to the Giza plateau, from sunrise visits to special chamber access 
              and private evening experiences.
            </p>
            <Link href="/contact">
              <Button size="lg" className="px-8 py-4 text-lg text-white" data-testid="button-contact-giza">
                Start Planning Your Giza Adventure
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}