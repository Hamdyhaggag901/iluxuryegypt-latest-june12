import { Package } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { Tour } from "@shared/schema";
import TourCard from "@/components/tour-card";

interface LuxuryPackagesSectionProps {
  category?: string;
  title?: string;
  description?: string;
  limit?: number;
  /** "grid" (default) is the plain equal-columns grid used by category pages
   *  (which can render any number of tours). "bento" is the homepage's
   *  editorial layout — one large featured card plus smaller ones — and
   *  assumes a small, fixed-ish tour count (used with limit={3}). */
  layout?: "grid" | "bento";
}

function BentoCard({ tour, big }: { tour: Tour; big?: boolean }) {
  const currencySymbol = tour.currency === "USD" ? "$" : `${tour.currency} `;

  return (
    <Link
      href={`/${tour.slug}`}
      className={`group relative block rounded-lg overflow-hidden ${
        big ? "lg:col-span-2 lg:row-span-2 h-[320px] lg:h-full" : "h-[240px] lg:h-full"
      }`}
      data-testid={`card-package-${tour.slug}`}
    >
      <img
        src={tour.heroImage}
        alt={tour.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />

      {big && tour.featured && (
        <span className="absolute top-5 left-5 md:top-6 md:left-6 bg-accent text-accent-foreground text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
          Featured Journey
        </span>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 lg:p-8">
        <h3
          className={`font-serif font-bold text-primary-foreground leading-snug ${
            big ? "text-2xl md:text-3xl lg:text-4xl mb-3" : "text-lg md:text-xl mb-2"
          }`}
        >
          {tour.title}
        </h3>
        <div className="flex items-center justify-between gap-3">
          <span className={`text-primary-foreground/85 ${big ? "text-sm md:text-base" : "text-xs md:text-sm"}`}>
            From <span className="font-serif font-bold text-accent">{currencySymbol}{tour.price.toLocaleString()}</span>
          </span>
          <span className="text-xs font-medium uppercase tracking-wider text-accent inline-flex items-center gap-1.5">
            View Journey
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function LuxuryPackagesSection({
  category,
  title = "Our Luxury Packages",
  description = "Discover our carefully curated luxury travel packages, each designed to offer extraordinary experiences across Egypt's most iconic destinations.",
  limit,
  layout = "grid",
}: LuxuryPackagesSectionProps) {
  const apiUrl = category
    ? `/api/public/tours?category=${encodeURIComponent(category)}`
    : '/api/public/tours';

  const { data, isLoading } = useQuery<{ success: boolean; tours: Tour[] }>({
    queryKey: [apiUrl],
    enabled: true,
  });

  const allTours = data?.tours?.filter(tour => tour.published) || [];
  // The bento layout's "big" slot goes to a featured tour when one exists,
  // otherwise just the first tour in the returned order — same
  // featured-else-first fallback used for the new Where You Will Stay
  // section's hotel picks. The plain grid layout doesn't care about this
  // order, so only bother sorting when it'll actually be used.
  const orderedTours = layout === "bento"
    ? [...allTours].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    : allTours;
  const tours = limit ? orderedTours.slice(0, limit) : orderedTours;

  const sectionHeader = (
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
  );

  if (isLoading) {
    return (
      <section className="py-20 bg-background" data-testid="packages-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {sectionHeader}
          {layout === "bento" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-6 lg:h-[640px]">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`animate-pulse bg-muted rounded-lg ${i === 1 ? "aspect-[4/5] lg:aspect-auto lg:col-span-2 lg:row-span-2" : "aspect-[4/3] lg:aspect-auto"}`}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-[4/5] animate-pulse bg-muted" />
              ))}
            </div>
          )}
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
        {sectionHeader}

        {layout === "bento" ? (
          (() => {
            const [bigTour, ...smallTours] = tours;
            return (
              <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-6 lg:h-[640px]">
                <BentoCard tour={bigTour} big />
                {smallTours.map((tour) => (
                  <BentoCard key={tour.id} tour={tour} />
                ))}
              </div>
            );
          })()
        ) : (
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
        )}
      </div>
    </section>
  );
}
