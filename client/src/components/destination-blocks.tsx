import { Link } from "wouter";
import { Package, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Tour } from "@shared/schema";
import { getResponsiveImageProps } from "@/lib/responsive-image";

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
                className="bg-card border border-card-border rounded-lg overflow-hidden flex flex-col h-full group cursor-pointer hover:shadow-lg transition-shadow duration-300"
                data-testid={`card-package-${tour.slug}`}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    {...getResponsiveImageProps(tour.heroImage, 640)}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    alt={tour.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex flex-col gap-3 flex-grow">
                    <span className="text-xs font-semibold text-accent-readable tracking-[0.15em] uppercase">
                      {tour.category}
                    </span>

                    <h3
                      className="font-serif text-xl text-primary leading-tight group-hover:text-accent transition-colors"
                      data-testid={`text-title-${tour.slug}`}
                    >
                      {tour.title}
                    </h3>

                    <p className="text-xs font-semibold text-accent-readable tracking-[0.1em] uppercase">
                      {tour.duration}
                      {tour.groupSize ? ` · ${tour.groupSize}` : ""}
                    </p>

                    {tour.destinations.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs font-semibold text-muted-foreground tracking-[0.15em] uppercase block mb-1">
                          The Route
                        </span>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {tour.destinations.join(" → ")}
                        </p>
                      </div>
                    )}
                  </div>

                  <hr className="border-t border-border my-6" />

                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-xs text-muted-foreground block mb-1">From</span>
                      <span className="font-serif text-lg text-primary">
                        {tour.currency === "USD" ? "$" : `${tour.currency} `}
                        {tour.price.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-primary group-hover:text-accent transition-colors">
                      View Journey
                    </span>
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
