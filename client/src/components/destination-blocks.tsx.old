import { Link } from "wouter";
import { Package } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Tour } from "@shared/schema";

interface LuxuryPackagesSectionProps {
  category?: string;
  title?: string;
  description?: string;
}

export default function LuxuryPackagesSection({ 
  category, 
  title = "Our Luxury Packages",
  description = "Discover our carefully curated luxury travel packages, each designed to offer extraordinary experiences across Egypt's most iconic destinations."
}: LuxuryPackagesSectionProps) {
  const apiUrl = category 
    ? `/api/public/tours?category=${encodeURIComponent(category)}`
    : '/api/public/tours';
    
  const { data, isLoading } = useQuery<{ success: boolean; tours: Tour[] }>({
    queryKey: [apiUrl],
    enabled: true,
  });

  const tours = data?.tours?.filter(tour => tour.published) || [];

  if (isLoading) {
    return (
      <section className="py-20 bg-background" data-testid="packages-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="flex justify-center mb-6">
              <Package className="h-12 w-12 text-accent" />
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-8">
              {title}
            </h2>
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="w-16 h-px bg-accent"></div>
              <div className="w-2 h-2 bg-accent rotate-45"></div>
              <div className="w-16 h-px bg-accent"></div>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {description}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div 
                key={i}
                className="relative h-[500px] overflow-hidden shadow-2xl animate-pulse"
                style={{ borderRadius: '10px' }}
              >
                <div className="absolute inset-0 bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!tours.length) {
    return (
      <section className="py-20 bg-background" data-testid="packages-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="flex justify-center mb-6">
              <Package className="h-12 w-12 text-accent" />
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-8">
              {title}
            </h2>
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="w-16 h-px bg-accent"></div>
              <div className="w-2 h-2 bg-accent rotate-45"></div>
              <div className="w-16 h-px bg-accent"></div>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              No tours available at the moment. Please check back later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background" data-testid="packages-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="flex justify-center mb-6">
            <Package className="h-12 w-12 text-accent" />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-8">
            {title}
          </h2>
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="w-16 h-px bg-accent"></div>
            <div className="w-2 h-2 bg-accent rotate-45"></div>
            <div className="w-16 h-px bg-accent"></div>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {description}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour) => (
            <Link key={tour.id} href={`/tour/${tour.slug}`}>
              <div 
                className="group cursor-pointer relative h-[500px] overflow-hidden shadow-2xl"
                style={{ borderRadius: '10px' }}
                data-testid={`card-package-${tour.slug}`}
              >
                {/* Full Card Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 lg:group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${tour.heroImage})`,
                  }}
                />
                
                {/* Overlay - Always visible on mobile, changes on desktop hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent lg:from-black/60 lg:via-black/30 lg:to-black/10 lg:group-hover:from-black/90 lg:group-hover:via-black/70 lg:group-hover:to-black/40 transition-all duration-700" />
                
                {/* Decorative corner accent - top right */}
                <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-accent/60 opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500" style={{ borderTopRightRadius: '10px' }} />
                
                {/* Decorative corner accent - bottom left */}
                <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-accent/60 opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500" style={{ borderBottomLeftRadius: '10px' }} />
                
                {/* Content Container */}
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  
                  {/* Duration Badge */}
                  <div className="absolute top-6 left-6 bg-accent/90 backdrop-blur-sm px-4 py-2 shadow-lg" style={{ borderRadius: '10px' }}>
                    <span className="text-white text-sm font-semibold tracking-wide">{tour.duration}</span>
                  </div>
                  
                  {/* Price Badge */}
                  {tour.price && (
                    <div className="absolute top-6 right-6 bg-primary/90 backdrop-blur-sm px-4 py-2 shadow-lg" style={{ borderRadius: '10px' }}>
                      <span className="text-white text-sm font-semibold tracking-wide">
                        From {tour.currency} {tour.price}
                      </span>
                    </div>
                  )}
                  
                  {/* Title - Always visible */}
                  <h3 className="text-white text-3xl md:text-4xl font-serif font-light mb-4 tracking-wide transform transition-all duration-500 lg:group-hover:-translate-y-2" data-testid={`text-title-${tour.slug}`}>
                    {tour.title}
                  </h3>
                  
                  {/* Decorative divider */}
                  <div className="w-16 h-px bg-accent mb-4 transition-all duration-500 lg:group-hover:w-24"></div>
                  
                  {/* Description - Always visible on mobile, appears on hover on desktop */}
                  <div className="transform transition-all duration-700 lg:translate-y-8 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
                    <p className="text-white/90 text-base leading-relaxed mb-6" data-testid={`text-description-${tour.slug}`}>
                      {tour.shortDescription || tour.description.substring(0, 150) + '...'}
                    </p>
                    
                    {/* Call to Action */}
                    <div className="flex items-center text-accent font-medium tracking-wide">
                      <span className="text-sm uppercase">Explore Package</span>
                      <svg className="w-5 h-5 ml-2 transition-transform duration-300 lg:group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
