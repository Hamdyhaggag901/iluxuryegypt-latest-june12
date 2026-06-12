import { useState } from 'react';
import { useSEO } from "@/hooks/use-seo";
import { useQuery } from '@tanstack/react-query';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import ScrollToTopButton from '@/components/scroll-to-top-button';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Loader2 } from 'lucide-react';

interface Destination {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  heroImage: string;
  gallery: string[];
  highlights: string[];
  region: string;
  featured: boolean;
  published: boolean;
}

export default function Destinations() {
  useSEO({
    title: "Egypt Destinations - Luxury Travel Guide",
    description: "Explore Egypt's most extraordinary destinations. From ancient temples and pyramids to pristine Red Sea coastlines.",
  });

  const [selectedFilter, setSelectedFilter] = useState('all');

  const { data: destinationsData, isLoading } = useQuery<{ success: boolean; destinations: Destination[] }>({
    queryKey: ['/api/public/destinations'],
    queryFn: async () => {
      const response = await fetch('/api/public/destinations');
      if (!response.ok) {
        throw new Error('Failed to fetch destinations');
      }
      return response.json();
    },
  });

  const destinations = destinationsData?.destinations || [];

  const filteredDestinations = destinations.filter(destination => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'ancient') {
      return ['cairo', 'giza', 'luxor', 'aswan'].includes(destination.slug);
    }
    if (selectedFilter === 'coastal') {
      return ['alexandria', 'hurghada', 'sharm-el-sheikh', 'dahab'].includes(destination.slug);
    }
    if (selectedFilter === 'desert') {
      return ['siwa-oasis', 'giza'].includes(destination.slug);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-16 md:pt-20 pb-10 md:pb-16 bg-gradient-to-br from-background via-accent/5 to-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-primary mb-4 md:mb-6">
            Egyptian Destinations
          </h1>
          <div className="w-20 md:w-32 h-px bg-accent mx-auto mb-4 md:mb-8"></div>
          <p className="text-sm md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-2">
            Discover Egypt's most extraordinary destinations. From ancient temples and pyramids to pristine Red Sea coastlines,
            explore the land of pharaohs through our bespoke luxury experiences.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-4 md:py-8 bg-background border-b border-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {[
              { key: 'all', label: 'All Destinations' },
              { key: 'ancient', label: 'Ancient Wonders' },
              { key: 'coastal', label: 'Red Sea & Mediterranean' },
              { key: 'desert', label: 'Desert Experiences' }
            ].map((filter) => (
              <Button
                key={filter.key}
                variant={selectedFilter === filter.key ? 'default' : 'outline'}
                onClick={() => setSelectedFilter(filter.key)}
                className="min-w-[100px] md:min-w-[140px] text-xs md:text-sm px-3 md:px-4 py-2"
                data-testid={`filter-${filter.key}`}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Loading destinations...</p>
              </div>
            </div>
          ) : filteredDestinations.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">No destinations found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDestinations.map((destination) => (
                <div
                  key={destination.id}
                  className="group cursor-pointer transform transition-all duration-500 hover:scale-[1.02]"
                  data-testid={`destination-${destination.slug}`}
                >
                  <Link href={`/destinations/${destination.slug}`} className="block h-full">
                    <div className="relative bg-gradient-to-br from-white via-white to-accent/5 rounded-2xl border border-accent/20 shadow-lg overflow-hidden h-full flex flex-col cursor-pointer transition-all duration-500 hover:shadow-2xl hover:border-accent/40 group-hover:bg-gradient-to-br group-hover:from-white group-hover:via-accent/5 group-hover:to-accent/10">

                      {/* Luxury accent line */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>

                      {/* Image container with sophisticated overlay */}
                      <div className="aspect-[4/3] relative overflow-hidden">
                        <img
                          src={destination.heroImage}
                          alt={destination.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />

                        {/* Sophisticated gradient overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-primary/30 opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

                        {/* Elegant destination name with luxury styling */}
                        <div className="absolute bottom-6 left-6 right-6">
                          <div className="space-y-2">
                            <div className="w-12 h-px bg-accent/80"></div>
                            <h3 className="text-2xl font-serif font-bold text-white mb-1 tracking-wide" data-testid={`destination-name-${destination.slug}`}>
                              {destination.name}
                            </h3>
                            <p className="text-accent/90 font-light text-sm tracking-widest uppercase">
                              {destination.shortDescription || destination.region}
                            </p>
                          </div>
                        </div>

                        {/* Premium corner accent */}
                        <div className="absolute top-4 right-4 w-8 h-8 border-2 border-accent/60 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm group-hover:bg-accent/20 transition-all duration-500">
                          <div className="w-2 h-2 bg-accent rounded-full"></div>
                        </div>
                      </div>

                      {/* Luxury card content */}
                      <div className="p-8 flex-1 flex flex-col relative">

                        {/* Premium highlights with elegant styling */}
                        <div className="space-y-3 mb-6 flex-1">
                          <h4 className="text-sm font-medium text-primary/70 tracking-widest uppercase mb-4">
                            Signature Experiences
                          </h4>
                          {destination.highlights?.slice(0, 3).map((highlight: string, index: number) => (
                            <div key={index} className="flex items-start group/item">
                              <div className="w-2 h-2 bg-gradient-to-r from-accent to-accent/60 rounded-full mr-4 mt-2 flex-shrink-0 group-hover/item:scale-125 transition-transform duration-300"></div>
                              <span className="text-muted-foreground font-light leading-relaxed group-hover/item:text-primary transition-colors duration-300">
                                {highlight}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Luxury action area with sophisticated styling */}
                        <div className="pt-6 border-t border-gradient-to-r from-transparent via-accent/20 to-transparent">
                          <div className="flex items-center justify-between group/action">
                            <div className="flex flex-col">
                              <span className="text-primary font-serif font-medium text-lg group-hover/action:text-accent transition-colors duration-300">
                                Discover Luxury
                              </span>
                              <span className="text-muted-foreground text-xs tracking-wide uppercase font-light">
                                Bespoke Experiences Await
                              </span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/10 to-accent/20 flex items-center justify-center group-hover/action:bg-gradient-to-br group-hover/action:from-accent/20 group-hover/action:to-accent/30 transition-all duration-300 group-hover/action:scale-110">
                              <svg className="w-5 h-5 text-accent group-hover/action:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Subtle decorative elements */}
                        <div className="absolute top-4 right-4 w-16 h-16 border border-accent/10 rounded-full opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                        <div className="absolute top-6 right-6 w-8 h-8 border border-accent/20 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 md:py-20 bg-muted">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-primary mb-4 md:mb-6">
            Ready to Explore the World?
          </h2>
          <div className="w-16 md:w-24 h-px bg-accent mx-auto mb-4 md:mb-8"></div>
          <p className="text-sm md:text-lg lg:text-xl text-muted-foreground mb-6 md:mb-10 leading-relaxed px-2">
            Let our travel specialists create a bespoke itinerary that captures the magic of the world's most extraordinary destinations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
            <Link href="/contact">
              <Button size="lg" className="px-6 md:px-8 py-3 md:py-4 text-sm md:text-lg w-full sm:w-auto sm:min-w-[200px]" data-testid="button-contact-specialists">
                Contact Our Specialists
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="px-6 md:px-8 py-3 md:py-4 text-sm md:text-lg w-full sm:w-auto sm:min-w-[200px]" data-testid="button-learn-more">
                Learn More About Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
