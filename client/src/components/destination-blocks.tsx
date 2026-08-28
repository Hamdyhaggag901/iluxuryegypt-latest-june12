import { Package } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Tour } from "@shared/schema";
import TourCard from "@/components/tour-card";

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
            <TourCard
              key={tour.id}
              image={tour.heroImage}
              category={tour.category}
              title={tour.title}
              days={tour.duration}
              guests={tour.groupSize || undefined}
              itinerary={tour.destinations}
              price={tour.price}
              currency={tour.currency}
              link={`/${tour.slug}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
