import { Button } from "@/components/ui/button";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { ArrowLeft, MapPin, Clock, Plane } from "lucide-react";
import { Link } from "wouter";

export default function Aswan() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop"
          alt="Aswan - Gateway to Nubian Heritage"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
        
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">Aswan</h1>
          <p className="text-xl md:text-2xl text-accent font-medium mb-8 tracking-wide">
            Gateway to Nubian Heritage
          </p>
          <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed max-w-3xl mx-auto">
            Where the Nile flows through ancient Nubian lands, Aswan offers a perfect blend of natural beauty, 
            cultural heritage, and tranquil moments along Egypt's most scenic stretch of river.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="px-8 py-4 text-lg min-w-[200px]" data-testid="button-plan-aswan">
                Plan Your Aswan Journey
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
              <p className="text-muted-foreground">October to April<br />Perfect weather for exploring</p>
            </div>
            <div className="text-center">
              <Plane className="h-8 w-8 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-primary mb-2">Travel Time</h3>
              <p className="text-muted-foreground">1.5 hours from Cairo<br />13 hours drive to Luxor</p>
            </div>
            <div className="text-center">
              <MapPin className="h-8 w-8 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-primary mb-2">Location</h3>
              <p className="text-muted-foreground">Upper Egypt<br />First Cataract of the Nile</p>
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
              Discover Aswan's Nubian Soul
            </h2>
            <div className="w-24 h-px bg-accent mb-8"></div>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              Aswan, Egypt's southernmost city, serves as the gateway to Nubian culture and the magnificent temples of Abu Simbel. 
              Here, where the Nile flows through granite boulders and around emerald islands, ancient traditions blend seamlessly 
              with modern engineering marvels. The city's tranquil atmosphere, vibrant Nubian villages, and strategic position 
              as the starting point for luxury Nile cruises make it an essential stop on any Egyptian odyssey.
            </p>
          </div>

          {/* Highlights Grid */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Philae Temple */}
            <div className="group">
              <div className="relative overflow-hidden rounded-xl mb-6">
                <img
                  src="https://images.unsplash.com/photo-1594735797063-9d0c7e54f6c8?q=80&w=2070&auto=format&fit=crop"
                  alt="Philae Temple"
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Philae Temple</h3>
              <p className="text-muted-foreground leading-relaxed">
                Rescued from the rising waters of Lake Nasser and relocated stone by stone to Agilkia Island, 
                the Temple of Philae stands as a testament to both ancient devotion to Isis and modern preservation efforts. 
                The temple's graceful columns and intricate reliefs create one of Egypt's most romantic settings, 
                especially during the evening sound and light show.
              </p>
            </div>

            {/* High Dam */}
            <div className="group">
              <div className="relative overflow-hidden rounded-xl mb-6">
                <img
                  src="https://images.unsplash.com/photo-1578917319415-01c0e82e31b7?q=80&w=2070&auto=format&fit=crop"
                  alt="Aswan High Dam"
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Aswan High Dam</h3>
              <p className="text-muted-foreground leading-relaxed">
                A marvel of modern engineering completed in 1970, the High Dam transformed Egypt's relationship with the Nile. 
                Standing atop this massive structure, you'll appreciate the engineering feat that created Lake Nasser, 
                one of the world's largest artificial lakes, while providing stunning panoramic views of the surrounding desert and river.
              </p>
            </div>

            {/* Nubian Villages */}
            <div className="group">
              <div className="relative overflow-hidden rounded-xl mb-6">
                <img
                  src="https://images.unsplash.com/photo-1578917319419-d47b0ba7ea8b?q=80&w=2070&auto=format&fit=crop"
                  alt="Nubian Villages"
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Nubian Villages</h3>
              <p className="text-muted-foreground leading-relaxed">
                Experience the warm hospitality and vibrant culture of Nubian communities in their colorfully painted houses 
                along the Nile's banks. These villages offer authentic encounters with traditional Nubian life, from aromatic 
                spice markets to traditional handicrafts, all while enjoying breathtaking views of the desert meeting the river.
              </p>
            </div>

            {/* Felucca Sailing */}
            <div className="group">
              <div className="relative overflow-hidden rounded-xl mb-6">
                <img
                  src="https://images.unsplash.com/photo-1578925441513-b3c1bd1bb0e8?q=80&w=2070&auto=format&fit=crop"
                  alt="Felucca Sailing on the Nile"
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Felucca Sailing</h3>
              <p className="text-muted-foreground leading-relaxed">
                Glide silently along the Nile aboard a traditional felucca sailboat, watching the desert landscape and ancient 
                monuments drift by. These peaceful journeys, particularly magical at sunset, offer intimate moments with the 
                river that has sustained Egyptian civilization for millennia, accompanied only by the gentle lapping of water 
                against the boat.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-muted rounded-2xl p-12">
            <h3 className="text-3xl font-serif font-bold text-primary mb-6">
              Ready to Experience Aswan's Timeless Beauty?
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Let our specialists design your perfect Aswan experience, from intimate felucca journeys to exclusive 
              temple visits and authentic Nubian cultural encounters.
            </p>
            <Link href="/contact">
              <Button size="lg" className="px-8 py-4 text-lg text-white" data-testid="button-contact-aswan">
                Start Planning Your Aswan Adventure
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}