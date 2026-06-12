import { MapPin, Compass, Navigation } from "lucide-react";
import { useState } from "react";
import { Link } from 'wouter';

export default function InteractiveMapSection() {
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);

  const destinations = [
    {
      id: 'alexandria',
      name: 'Alexandria',
      tagline: 'Timeless Mediterranean elegance where ancient wisdom meets coastal luxury',
      region: 'North',
      highlights: ['Bibliotheca Alexandrina - Modern Wonder', 'Citadel of Qaitbay - Mamluk Fortress', 'Montaza Palace Gardens', 'Roman Amphitheatre', 'Catacombs of Kom el Shoqafa'],
      coordinates: '31.2001°N, 29.9187°E',
      position: { top: '25%', left: '15%' }
    },
    {
      id: 'cairo',
      name: 'Cairo',
      tagline: 'Pulsating heart of the Arab world with unmatched Islamic architecture',
      region: 'Central',
      highlights: ['Islamic Cairo UNESCO Site', 'Khan el-Khalili Historic Bazaar', 'Saladin Citadel & Mohammed Ali Mosque', 'Al-Azhar Mosque', 'Coptic Quarter'],
      coordinates: '30.0444°N, 31.2357°E',
      position: { top: '35%', left: '25%' }
    },
    {
      id: 'giza',
      name: 'Giza',
      tagline: 'Eternal guardians of ancient mysteries and architectural perfection',
      region: 'Central',
      highlights: ['Great Pyramid of Khufu', 'Great Sphinx of Giza', 'Solar Boat Museum', 'Pyramid of Khafre', 'Grand Egyptian Museum'],
      coordinates: '29.9792°N, 31.1342°E',
      position: { top: '40%', left: '20%' }
    },
    {
      id: 'luxor',
      name: 'Luxor',
      tagline: 'Ancient Thebes - where pharaohs built monuments for eternity',
      region: 'South',
      highlights: ['Valley of the Kings Tombs', 'Karnak Temple Complex', 'Luxor Temple at Night', 'Queen Hatshepsut Temple', 'Colossi of Memnon'],
      coordinates: '25.6872°N, 32.6396°E',
      position: { top: '65%', left: '30%' }
    },
    {
      id: 'aswan',
      name: 'Aswan',
      tagline: 'Nubian jewel on the Nile with golden desert dunes and granite islands',
      region: 'South',
      highlights: ['Philae Temple Complex', 'High Dam Engineering Marvel', 'Authentic Nubian Villages', 'Elephantine Island', 'Unfinished Obelisk'],
      coordinates: '24.0889°N, 32.8998°E',
      position: { top: '75%', left: '35%' }
    },
    {
      id: 'siwa-oasis',
      name: 'Siwa Oasis',
      tagline: 'Remote desert paradise where Alexander sought the Oracle\'s prophecy',
      region: 'West',
      highlights: ['Temple of the Oracle of Amun', 'Cleopatra\'s Natural Springs', 'Shali Fortress Ruins', 'Salt Lakes & Hot Springs', 'Berber Culture Experience'],
      coordinates: '29.2032°N, 25.5197°E',
      position: { top: '45%', left: '5%' }
    }
  ];

  return (
    <section className="py-20 bg-background" data-testid="interactive-map-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Compass className="h-12 w-12 text-accent" />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-8 animate-fade-in">
            Journey Across Egypt's Iconic Destinations
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            Discover Egypt's treasures from the Mediterranean coast to the Nubian heartland,
            each destination offering unique luxury experiences.
          </p>
        </div>

        {/* Side-to-Side Interactive Map */}
        <div className="relative">
          {/* Destinations Grid - Side to Side Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 relative">
            {destinations.map((destination, index) => (
              <div
                key={destination.id}
                className={`relative group cursor-pointer transform transition-all duration-700 ease-out hover:scale-105 hover:-translate-y-2 ${
                  index % 2 === 0 ? 'lg:translate-y-8' : ''
                } animate-fade-in`}
                style={{
                  animationDelay: `${index * 200}ms`,
                  transitionProperty: 'transform, box-shadow, filter',
                  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onClick={() => setSelectedDestination(
                  selectedDestination === destination.id ? null : destination.id
                )}
                data-testid={`destination-${destination.id}`}
              >
                {/* Destination Card */}
                <div className={`
                  bg-gradient-to-br ${destination.region === 'North' ? 'from-primary to-accent' : destination.region === 'Central' ? 'from-accent to-secondary' : destination.region === 'South' ? 'from-primary to-secondary' : 'from-secondary to-accent'} p-1 rounded-2xl shadow-lg
                  group-hover:shadow-2xl group-hover:shadow-primary/20 transition-all duration-700 ease-out
                  ${selectedDestination === destination.id ? 'ring-4 ring-primary/50 scale-105' : ''}
                `}
                style={{
                  transitionProperty: 'box-shadow, transform, filter, border-color',
                  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                >
                  <div className="bg-card/95 backdrop-blur-sm rounded-xl p-6 h-full">
                    {/* Position Indicator */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-accent transition-all duration-300 ease-out group-hover:scale-110 group-hover:text-primary" />
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide transition-colors duration-300 ease-out group-hover:text-accent">
                          {destination.region}
                        </span>
                      </div>
                      <Navigation className="h-4 w-4 text-primary opacity-60 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:rotate-12 group-hover:scale-110" />
                    </div>

                    {/* Destination Name */}
                    <h3 className="text-xl font-serif font-bold text-primary mb-2 group-hover:text-accent transition-colors duration-300 ease-out">
                      {destination.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {destination.tagline}
                    </p>

                    {/* Coordinates Display */}
                    <div className="text-xs text-muted-foreground/70 mb-3 font-mono">
                      {destination.coordinates}
                    </div>

                    {/* Attractions Preview */}
                    <div className={`
                      transition-all duration-700 ease-out overflow-hidden
                      ${selectedDestination === destination.id ? 'max-h-32 opacity-100 transform translate-y-0' : 'max-h-0 opacity-0 transform -translate-y-2'}
                    `}
                    style={{
                      transitionProperty: 'max-height, opacity, transform, margin',
                      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                      transitionDelay: selectedDestination === destination.id ? '100ms' : '0ms'
                    }}
                    >
                      <div className="border-t border-border/30 pt-3">
                        <h4 className="text-xs font-semibold text-primary mb-2 uppercase tracking-wide">
                          Key Attractions
                        </h4>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {destination.highlights.map((attraction, i) => (
                            <li key={i} className="flex items-center space-x-1">
                              <div className="w-1 h-1 bg-accent rounded-full"></div>
                              <span>{attraction}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Interaction Hint */}
                    <div className="mt-4 pt-3 border-t border-border/20">
                      <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground/60">
                        <span>Click to explore</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connection Line to Geographic Flow */}
                <div className="absolute top-1/2 left-1/2 w-px h-8 bg-gradient-to-b from-primary/60 to-transparent transform -translate-x-1/2 -translate-y-full"></div>
              </div>
            ))}
          </div>

        </div>

        {/* Legend and Instructions */}
        <div className="mt-20 flex justify-center items-center">
          <Link href="/destinations">
            <div className="inline-flex items-center space-x-2 px-6 py-3 bg-muted rounded-full cursor-pointer">
              <MapPin className="h-4 w-4 text-accent" />
              <span className="text-sm text-muted-foreground">Click destinations to explore details</span>
            </div>
          </Link>
        </div>

        {/* Decorative elements */}
        <div className="relative mt-16">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>
          <div className="flex justify-center pt-8">
            <div className="w-16 h-1 bg-accent rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}