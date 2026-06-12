import { Button } from "@/components/ui/button";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { ArrowLeft, MapPin, Clock, Plane } from "lucide-react";
import { Link } from "wouter";

export default function Hurghada() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop"
          alt="Hurghada - Red Sea Diving Paradise"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
        
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">Hurghada</h1>
          <p className="text-xl md:text-2xl text-accent font-medium mb-8 tracking-wide">
            Red Sea Diving Paradise
          </p>
          <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed max-w-3xl mx-auto">
            Where crystal-clear waters meet vibrant coral reefs, Hurghada offers world-class diving, pristine beaches, 
            and luxury resorts along Egypt's stunning Red Sea coastline.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="px-8 py-4 text-lg min-w-[200px]" data-testid="button-plan-hurghada">
                Plan Your Hurghada Journey
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
              <p className="text-muted-foreground">Year-round destination<br />Excellent diving conditions</p>
            </div>
            <div className="text-center">
              <Plane className="h-8 w-8 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-primary mb-2">Travel Time</h3>
              <p className="text-muted-foreground">1 hour from Cairo<br />Direct international flights</p>
            </div>
            <div className="text-center">
              <MapPin className="h-8 w-8 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-primary mb-2">Location</h3>
              <p className="text-muted-foreground">Red Sea Governorate<br />Egyptian Red Sea coast</p>
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
              Hurghada: Red Sea Paradise
            </h2>
            <div className="w-24 h-px bg-accent mb-8"></div>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              Hurghada has transformed from a small fishing village into Egypt's premier Red Sea resort destination, 
              renowned for its exceptional diving sites, luxury resorts, and year-round sunshine. The crystal-clear waters 
              reveal spectacular coral reefs teeming with tropical fish, while the desert landscape offers adventurous 
              excursions just minutes from pristine beaches.
            </p>
          </div>

          {/* Highlights Grid */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Coral Reefs */}
            <div className="group">
              <div className="relative overflow-hidden rounded-xl mb-6">
                <img
                  src="https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?q=80&w=2070&auto=format&fit=crop"
                  alt="Coral Reefs in Hurghada"
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Coral Reefs</h3>
              <p className="text-muted-foreground leading-relaxed">
                The Red Sea's coral reefs around Hurghada are among the world's most pristine and biodiverse marine ecosystems. 
                These living underwater gardens showcase vibrant hard and soft corals in brilliant colors, creating an underwater 
                paradise that supports hundreds of species of tropical fish, rays, and occasional dolphin encounters.
              </p>
            </div>

            {/* World-class Diving */}
            <div className="group">
              <div className="relative overflow-hidden rounded-xl mb-6">
                <img
                  src="https://images.unsplash.com/photo-1582967788606-a171c1080cb0?q=80&w=2070&auto=format&fit=crop"
                  alt="Diving in Hurghada"
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">World-class Diving</h3>
              <p className="text-muted-foreground leading-relaxed">
                Hurghada offers diving experiences for all levels, from beginner-friendly shallow reefs to challenging deep-water sites. 
                Professional dive centers provide access to famous sites like Giftun Island, the Careless Reef, and Abu Ramada, 
                where exceptional visibility and warm waters create perfect conditions for underwater exploration year-round.
              </p>
            </div>

            {/* Marina Boulevard */}
            <div className="group">
              <div className="relative overflow-hidden rounded-xl mb-6">
                <img
                  src="https://images.unsplash.com/photo-1578073075043-3e5d87b9a6b3?q=80&w=2070&auto=format&fit=crop"
                  alt="Marina Boulevard Hurghada"
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Marina Boulevard</h3>
              <p className="text-muted-foreground leading-relaxed">
                The heart of Hurghada's evening entertainment, Marina Boulevard offers an elegant waterfront promenade lined 
                with upscale restaurants, cafes, and boutiques. This sophisticated destination provides stunning Red Sea views, 
                international cuisine, and a vibrant nightlife scene, all while maintaining the relaxed atmosphere of a premier beach resort.
              </p>
            </div>

            {/* Desert Safari */}
            <div className="group">
              <div className="relative overflow-hidden rounded-xl mb-6">
                <img
                  src="https://images.unsplash.com/photo-1569849653922-e3adcbcc6b9d?q=80&w=2070&auto=format&fit=crop"
                  alt="Desert Safari from Hurghada"
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Desert Safari</h3>
              <p className="text-muted-foreground leading-relaxed">
                Just beyond Hurghada's coastal resorts lies the dramatic Eastern Desert, offering thrilling safari adventures by 4WD 
                or quad bike. These excursions reveal stunning desert landscapes, traditional Bedouin culture, and unforgettable 
                stargazing experiences under some of the clearest night skies on Earth, creating perfect contrast to marine adventures.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-muted rounded-2xl p-12">
            <h3 className="text-3xl font-serif font-bold text-primary mb-6">
              Ready to Dive into Red Sea Paradise?
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Let our specialists create your perfect Hurghada experience, from luxury resort stays to exclusive diving expeditions 
              and desert adventures.
            </p>
            <Link href="/contact">
              <Button size="lg" className="px-8 py-4 text-lg text-white" data-testid="button-contact-hurghada">
                Start Planning Your Hurghada Adventure
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}