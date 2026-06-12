import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import ScrollToTopButton from '@/components/scroll-to-top-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'wouter';
import { MapPin, Clock, Star, Camera, Ship, Building2, TreePine, Waves } from 'lucide-react';

// Import Alexandria images from assets
import alexandriaMainImage from '@assets/photo-1742262361725-ed34e4cbbcee_1758110281630.avif';
import citadelImage from '@assets/photo-1633033254409-bd538e785f51_1758110317428.avif';
import bibliothecaImage from '@assets/photo-1697546889969-27f7b5be8664_1758110296124.avif';
import corniche from '@assets/photo-1584114130913-0852aeb8fe8c_1758110469649.avif';

export default function Alexandria() {
  const highlights = [
    {
      title: "Bibliotheca Alexandrina",
      description: "A stunning modern tribute to the ancient Library of Alexandria, featuring world-class exhibitions and collections.",
      image: bibliothecaImage,
      icon: <Building2 className="w-6 h-6" />
    },
    {
      title: "Citadel of Qaitbay",
      description: "A 15th-century fortress built on the site of the ancient Lighthouse of Alexandria, one of the Seven Wonders.",
      image: citadelImage,
      icon: <Star className="w-6 h-6" />
    },
    {
      title: "Corniche Waterfront",
      description: "A picturesque Mediterranean promenade perfect for evening strolls and seaside dining.",
      image: corniche,
      icon: <Waves className="w-6 h-6" />
    },
    {
      title: "Montaza Palace",
      description: "Former royal palace surrounded by beautiful gardens overlooking the Mediterranean Sea.",
      image: alexandriaMainImage,
      icon: <TreePine className="w-6 h-6" />
    }
  ];

  const quickFacts = [
    { label: "Best Time to Visit", value: "October - April", icon: <Clock className="w-5 h-5" /> },
    { label: "Distance from Cairo", value: "225 km (2.5 hours)", icon: <MapPin className="w-5 h-5" /> },
    { label: "Must-See Duration", value: "2-3 days", icon: <Camera className="w-5 h-5" /> },
    { label: "Transportation", value: "Private car, train", icon: <Ship className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <img
          src={alexandriaMainImage}
          alt="Alexandria Mediterranean coastline"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-6xl md:text-8xl font-serif font-bold mb-6" data-testid="alexandria-hero-title">
            Alexandria
          </h1>
          <div className="w-32 h-px bg-accent mx-auto mb-8"></div>
          <p className="text-2xl md:text-3xl font-light tracking-wide mb-8" data-testid="alexandria-tagline">
            Mediterranean Pearl of Egypt
          </p>
          <p className="text-xl leading-relaxed max-w-2xl mx-auto mb-12 text-white/90">
            Where ancient history meets Mediterranean charm. Discover the legendary city founded by Alexander the Great, 
            where Cleopatra once ruled and scholars gathered at the Great Library.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="px-8 py-4 text-lg" asChild data-testid="button-plan-alexandria-visit">
              <Link href="/contact">Plan Your Alexandria Experience</Link>
            </Button>
            <Button size="lg" variant="secondary" className="px-8 py-4 text-lg" asChild data-testid="button-view-all-destinations">
              <Link href="/destinations">View All Destinations</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Facts */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickFacts.map((fact, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4 text-primary">
                    {fact.icon}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2" data-testid={`fact-label-${index}`}>
                    {fact.label}
                  </h3>
                  <p className="text-muted-foreground" data-testid={`fact-value-${index}`}>
                    {fact.value}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
              Discover Alexandria
            </h2>
            <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
          </div>
          
          <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
            <p className="text-xl mb-8">
              Alexandria beckons with its unique blend of ancient grandeur and Mediterranean sophistication. 
              Founded by Alexander the Great in 331 BC, this legendary city served as the intellectual and 
              cultural capital of the ancient world, home to the Great Library and the Lighthouse of Alexandria.
            </p>
            
            <p className="text-lg mb-8">
              Today, Alexandria offers visitors a fascinating journey through layers of history. Walk along the 
              Corniche waterfront where Mediterranean breezes carry echoes of Cleopatra's reign. Explore the 
              modern Bibliotheca Alexandrina, a stunning architectural tribute to the ancient seat of learning. 
              Stand in the shadow of the Citadel of Qaitbay, built upon the ruins of one of the Seven Wonders 
              of the Ancient World.
            </p>
            
            <p className="text-lg">
              Our carefully curated Alexandria experiences reveal both the city's storied past and its vibrant 
              present, from private tours of archaeological treasures to sunset sailing excursions along the 
              Mediterranean coast. Let us craft your perfect Alexandria adventure.
            </p>
          </div>
        </div>
      </section>

      {/* Main Highlights */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
              Alexandria Highlights
            </h2>
            <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore the treasures that make Alexandria Egypt's most captivating Mediterranean destination.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {highlights.map((highlight, index) => (
              <Card key={index} className="overflow-hidden group hover:shadow-xl transition-all duration-500">
                <div className="relative">
                  <img
                    src={highlight.image}
                    alt={highlight.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-full">
                    <div className="text-primary">
                      {highlight.icon}
                    </div>
                  </div>
                </div>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-serif font-bold text-primary mb-4" data-testid={`highlight-title-${index}`}>
                    {highlight.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed" data-testid={`highlight-description-${index}`}>
                    {highlight.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Ready to Explore Alexandria?
          </h2>
          <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
          <p className="text-xl leading-relaxed mb-10 text-white/90">
            Let our Alexandria specialists create a bespoke itinerary that captures the magic of this Mediterranean pearl. 
            From private archaeological tours to sunset sailing, we'll craft your perfect Alexandria adventure.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" variant="secondary" className="px-8 py-4 text-lg min-w-[220px] text-white" asChild data-testid="button-contact-alexandria-specialists">
              <Link href="/contact">Contact Our Alexandria Specialists</Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg min-w-[220px] border-white text-white hover:bg-white hover:text-primary" asChild data-testid="button-view-all-egypt-destinations">
              <Link href="/destinations">View All Egypt Destinations</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
}