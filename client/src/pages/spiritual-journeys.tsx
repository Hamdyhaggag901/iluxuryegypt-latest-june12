
import { useState } from "react";
import { useSEO } from "@/hooks/use-seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Clock, Users, MapPin, Star, Calendar, ArrowLeft, Heart, Zap } from "lucide-react";
import { Link } from "wouter";

const spiritualTours = [
  {
    id: 'temple-healing-journey',
    name: 'Temple Healing Journey',
    location: 'Abydos, Dendera & Philae',
    duration: '5 Days',
    groupSize: '2-8 People',
    price: 'From $1,450',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1594735797063-9d0c7e54f6c8?q=80&w=2070&auto=format&fit=crop',
    highlights: ['Sacred Ceremonies', 'Temple Meditation', 'Energy Healing', 'Spiritual Guides'],
    description: 'Transformative journey through Egypt\'s most powerful spiritual temples with meditation and sacred ceremonies.',
    itinerary: 'Dawn meditation at the Great Pyramid, sacred ceremonies at Temple of Osiris in Abydos, energy healing sessions at Dendera, and sunset blessing ritual at Isis Temple in Philae with experienced spiritual guides.',
    tourType: 'Transformative Journey',
    spiritualFeatures: ['Sacred ceremonies', 'Temple meditation', 'Energy healing', 'Spiritual transformation']
  }
];

export default function SpiritualJourneys() {
  useSEO({
    title: "Spiritual Tours in Egypt - Sacred Journeys",
    description: "Discover Egypt's spiritual heritage. Visit ancient temples, sacred sites, and experience transformative journeys.",
  });

  const [selectedTour, setSelectedTour] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 bg-gradient-to-br from-background via-accent/5 to-primary/10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/33661271/pexels-photo-33661271.jpeg?_gl=1*ywbelw*_ga*MTUzMjg3NTA0Mi4xNzU4MjA4MjAy*_ga_8JE65Q40S6*czE3NTgyMDgyMDEkbzEkZzEkdDE3NTgyMDg2MjIkajM0JGwwJGgw')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/egypt-tour-packages">
            <Button variant="outline" className="mb-8 hover:scale-105 transition-transform">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Experiences
            </Button>
          </Link>

          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-accent/10 rounded-full px-6 py-3 mb-8">
              <Zap className="h-6 w-6 text-accent" />
              <span className="text-accent font-semibold">Sacred Experiences</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary mb-8 leading-tight">
              Spiritual
              <span className="block text-accent">Journeys</span>
            </h1>

            <div className="w-32 h-px bg-accent mx-auto mb-8"></div>

            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-12">
              Connect with ancient Egyptian spirituality through sacred sites, meditation, and transformative experiences. 
              Journey into the mystical heart of Egypt where ancient wisdom meets modern spiritual practice.
            </p>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-accent/20">
                <Zap className="h-8 w-8 text-accent mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-primary mb-2">Sacred Energy</h3>
                <p className="text-sm text-muted-foreground">Connect with powerful spiritual energies</p>
              </div>
              <div className="text-center p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-accent/20">
                <Users className="h-8 w-8 text-accent mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-primary mb-2">Spiritual Guides</h3>
                <p className="text-sm text-muted-foreground">Expert guides in ancient wisdom traditions</p>
              </div>
              <div className="text-center p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-accent/20">
                <Heart className="h-8 w-8 text-accent mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-primary mb-2">Transformation</h3>
                <p className="text-sm text-muted-foreground">Life-changing spiritual experiences</p>
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
              Sacred Journey Experiences
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Carefully curated spiritual experiences designed to connect you with ancient Egyptian wisdom and sacred energies.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {spiritualTours.map((tour) => (
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
                    {tour.tourType}
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
                        className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full font-medium"
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
                      <Button size="sm" asChild className="hover:scale-105 transition-transform">
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
                        Complete Itinerary
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

      {/* Why Choose Spiritual Journeys Section */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
              Why Choose Our Spiritual Experiences?
            </h2>
            <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-background rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-4">Sacred Energy</h3>
              <p className="text-muted-foreground leading-relaxed">
                Experience the profound spiritual energies of Egypt's most sacred sites and ancient temples.
              </p>
            </div>

            <div className="text-center p-8 bg-background rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-4">Expert Spiritual Guides</h3>
              <p className="text-muted-foreground leading-relaxed">
                Learn from experienced practitioners versed in ancient Egyptian wisdom and modern spiritual techniques.
              </p>
            </div>

            <div className="text-center p-8 bg-background rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-4">Personal Transformation</h3>
              <p className="text-muted-foreground leading-relaxed">
                Create meaningful connections with ancient wisdom that can transform your spiritual journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Begin Your Spiritual Transformation
          </h2>
          <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
          <p className="text-xl mb-10 leading-relaxed opacity-90">
            Connect with ancient wisdom and experience the profound spiritual energy of Egypt's most sacred sites. 
            Let our expert guides facilitate your transformative journey through mystical Egypt.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg min-w-[200px] hover:scale-105 transition-transform">
                Start Your Spiritual Journey
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

