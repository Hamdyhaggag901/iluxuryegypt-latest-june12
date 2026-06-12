
import { useState } from "react";
import { useSEO } from "@/hooks/use-seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Clock, Users, MapPin, Star, Calendar, ArrowLeft, Crown, Gem } from "lucide-react";
import { Link } from "wouter";

const ultraLuxuryTours = [
  {
    id: 'pharaohs-platinum-experience',
    name: 'Pharaohs Platinum Experience',
    location: 'Cairo, Luxor & Abu Simbel',
    duration: '10 Days',
    groupSize: '2-6 People',
    price: 'From $8,500',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?q=80&w=2070&auto=format&fit=crop',
    highlights: ['Private Jet', 'Presidential Suites', 'After-Hours Access', 'Personal Egyptologist'],
    description: 'The ultimate Egyptian luxury experience with private jet transfers, presidential suite accommodations, and exclusive after-hours temple access.',
    itinerary: 'Stay in presidential suites at Egypt\'s finest hotels, private jet transfers between destinations, exclusive after-hours access to pyramids and temples, Michelin-starred dining experiences, personal Egyptologist guide, and bespoke itinerary tailored to your desires.',
    tourType: 'Platinum Experience',
    luxuryFeatures: ['Private jet', 'Presidential suites', 'Exclusive access', 'Bespoke itinerary']
  }
];

export default function UltraLuxury() {
  useSEO({
    title: "Ultra Luxury Egypt Tours - Premium Experiences",
    description: "The pinnacle of luxury travel in Egypt. Exclusive access, private jets, and the finest accommodations.",
  });

  const [selectedTour, setSelectedTour] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 bg-gradient-to-br from-background via-accent/5 to-primary/10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://cf.bstatic.com/xdata/images/hotel/max1024x768/39926658.jpg?k=5706e07d5b2a27afcfb631edb94dbb1d589cb6803e84733cd3df136a16386f7a&o=&hp=1')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/egypt-tour-packages">
            <Button variant="outline" className="mb-8 hover:scale-105 transition-transform">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Experiences
            </Button>
          </Link>

          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-accent/10 rounded-full px-6 py-3 mb-8">
              <Crown className="h-6 w-6 text-accent" />
              <span className="text-accent font-semibold">The Pinnacle of Luxury</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary mb-8 leading-tight">
              Ultra
              <span className="block text-accent">Luxury</span>
            </h1>

            <div className="w-32 h-px bg-accent mx-auto mb-8"></div>

            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-12">
              The pinnacle of Egyptian luxury travel with exclusive access, private vessels, and unparalleled service. 
              Experience Egypt like royalty with our most exclusive and prestigious offerings.
            </p>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-accent/20">
                <Crown className="h-8 w-8 text-accent mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-primary mb-2">Royal Treatment</h3>
                <p className="text-sm text-muted-foreground">Presidential suites and personal butler service</p>
              </div>
              <div className="text-center p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-accent/20">
                <Users className="h-8 w-8 text-accent mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-primary mb-2">Exclusive Access</h3>
                <p className="text-sm text-muted-foreground">Private visits to sites unavailable to others</p>
              </div>
              <div className="text-center p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-accent/20">
                <Gem className="h-8 w-8 text-accent mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-primary mb-2">Unparalleled Service</h3>
                <p className="text-sm text-muted-foreground">World-class service at every moment</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tours Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
              Ultra Luxury Experiences
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The most exclusive and luxurious Egyptian experiences, crafted for discerning travelers who demand perfection.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {ultraLuxuryTours.map((tour) => (
              <Card
                key={tour.id}
                className="group overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 hover:scale-[1.02] flex flex-col h-full min-h-[600px]"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={tour.image}
                    alt={tour.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Tour Type Badge */}
                  <div className="absolute top-4 left-4 bg-accent/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
                    <Crown className="h-3 w-3 mr-1 inline" />
                    ULTRA LUXURY
                  </div>

                  {/* Rating */}
                  <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                    <Star className="h-4 w-4 text-accent fill-accent" />
                    <span className="text-sm font-medium">{tour.rating}</span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 text-accent font-medium text-sm mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>{tour.location}</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">{tour.name}</h3>
                  </div>
                </div>

                <CardContent className="p-6 flex flex-col justify-between flex-grow">
                  <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{tour.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{tour.groupSize}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {tour.description}
                  </p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tour.highlights.slice(0, 3).map((highlight: string, index: number) => (
                      <span
                        key={index}
                        className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full font-medium border border-accent/20"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between border-t border-border pt-4 mt-auto">
                    <div>
                      <p className="text-2xl font-serif font-bold text-primary">{tour.price}</p>
                      <p className="text-xs text-muted-foreground">per person</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTour(selectedTour === tour.id ? null : tour.id)}
                        className="hover:scale-105 transition-transform"
                      >
                        {selectedTour === tour.id ? 'Hide' : 'Details'}
                      </Button>
                      <Button size="sm" asChild className="hover:scale-105 transition-transform bg-accent hover:bg-accent/90">
                        <Link href="/contact">
                          Book Now
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {/* Expandable Details */}
                  {selectedTour === tour.id && (
                    <div className="mt-8 p-6 bg-muted/30 rounded-xl border border-accent/20">
                      <h4 className="text-xl font-serif font-bold text-primary mb-4 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-accent" />
                        Ultra Luxury Experience Details
                      </h4>
                      <div className="space-y-4">
                        <div className="bg-background/50 p-4 rounded-lg">
                          <p className="text-muted-foreground leading-relaxed">
                            {tour.itinerary}
                          </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div className="font-semibold text-primary">Duration</div>
                            <div className="text-muted-foreground">{tour.duration}</div>
                          </div>
                          <div className="space-y-2">
                            <div className="font-semibold text-primary">Group Size</div>
                            <div className="text-muted-foreground">{tour.groupSize}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Ultra Luxury Section */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
              Why Choose Ultra Luxury?
            </h2>
            <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-background rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Crown className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-4">Royal Treatment</h3>
              <p className="text-muted-foreground leading-relaxed">
                Presidential suites, private butlers, and personalized service that exceeds every expectation.
              </p>
            </div>

            <div className="text-center p-8 bg-background rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-4">Exclusive Access</h3>
              <p className="text-muted-foreground leading-relaxed">
                Private entrances to historical sites, after-hours museum visits, and VIP experiences unavailable to others.
              </p>
            </div>

            <div className="text-center p-8 bg-background rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Gem className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-4">Unmatched Luxury</h3>
              <p className="text-muted-foreground leading-relaxed">
                The finest accommodations, gourmet dining, and world-class service that defines true luxury travel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Experience Royal Egypt
          </h2>
          <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
          <p className="text-xl mb-10 leading-relaxed opacity-90">
            Indulge in the ultimate luxury Egyptian experience. Our ultra-luxury packages offer exclusive access, 
            unparalleled service, and memories that will last a lifetime.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg min-w-[200px] hover:scale-105 transition-transform">
                Request Ultra Luxury Experience
              </Button>
            </Link>
            <Link href="/egypt-tour-packages">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg min-w-[200px] border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary hover:scale-105 transition-all">
                Explore Other Experiences
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

