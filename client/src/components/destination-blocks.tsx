import { Link } from "wouter";
import { Package, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Tour } from "@shared/schema";

interface LuxuryPackagesSectionProps {
  category?: string;
  title?: string;
  description?: string;
  limit?: number;
}

export default function LuxuryPackagesSection({
  category,
  title = "Our Luxury Packages",
  description = "Discover our carefully curated luxury travel packages, each designed to offer extraordinary experiences across Egypt's most iconic destinations.",
  limit
}: LuxuryPackagesSectionProps) {
  const apiUrl = category
    ? `/api/public/tours?category=${encodeURIComponent(category)}`
    : '/api/public/tours';

  const { data, isLoading } = useQuery<{ success: boolean; tours: Tour[] }>({
    queryKey: [apiUrl],
    enabled: true,
  });

  const allTours = data?.tours?.filter(tour => tour.published) || [];
  const tours = limit ? allTours.slice(0, limit) : allTours;

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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-[4/5] animate-pulse bg-muted"
              />
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {tours.map((tour) => (
            <Link key={tour.id} href={`/${tour.slug}`}>
              <article
                className="group cursor-pointer"
                data-testid={`card-package-${tour.slug}`}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-lg">
                  {/* Image */}
                  <img
                    src={tour.heroImage}
                    alt={tour.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Content positioned at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    {/* Duration badge */}
                    <span className="inline-block text-accent text-xs tracking-[0.2em] uppercase font-light mb-2">
                      {tour.duration}
                    </span>

                    {/* Title - always visible */}
                    <h3
                      className="text-xl md:text-2xl font-serif text-white leading-tight"
                      data-testid={`text-title-${tour.slug}`}
                    >
                      {tour.title}
                    </h3>

                    {/* Description - slides up on hover */}
                    <div className="overflow-hidden">
                      <p className="text-white/80 text-sm leading-relaxed mt-3 line-clamp-3 translate-y-full opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                        {tour.shortDescription || tour.description}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
