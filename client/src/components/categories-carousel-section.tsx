import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import type { Category, Tour } from "@shared/schema";

const CATEGORIES_BASE_PATH = "/egypt-tour-packages";

// Short, one-to-two-line taglines for the carousel card (the full paragraph
// copy on the /egypt-tour-packages grid is too long for this compact format).
const CATEGORY_TAGLINE_OVERRIDES: Record<string, string> = {
  "small-group-tours-egypt": "Intimate groups, licensed Egyptologist guides, five-star stays.",
  "egypt-family-tours": "Private guides and flexible itineraries built for every generation.",
  "egypt-solo-travel": "Independent journeys shaped entirely around your own pace.",
  "egypt-spiritual-tours": "Sacred temples, quiet reflection, and five-star comfort.",
  "luxury-honeymoon-egypt": "Private, romantic, and tailor-made for two.",
  "solar-eclipse-egypt": "Witness the 2027 total eclipse from a private viewing site.",
};

export default function CategoriesCarouselSection() {
  const { data: categoriesData, isLoading } = useQuery<{ success: boolean; categories: Category[] }>({
    queryKey: ["/api/public/categories", "packages"],
    queryFn: async () => {
      const res = await fetch("/api/public/categories?type=packages");
      if (!res.ok) throw new Error("Failed to load categories");
      return res.json();
    },
  });

  const { data: toursData } = useQuery<{ success: boolean; tours: Tour[] }>({
    queryKey: ["/api/public/tours"],
    queryFn: async () => {
      const res = await fetch("/api/public/tours");
      if (!res.ok) throw new Error("Failed to load tours");
      return res.json();
    },
  });

  const categories = categoriesData?.categories || [];
  const tours = toursData?.tours || [];
  const tourCounts = categories.reduce((acc, category) => {
    acc[category.name] = tours.filter((tour) => tour.category === category.name).length;
    return acc;
  }, {} as Record<string, number>);

  if (!isLoading && categories.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-background" data-testid="categories-carousel-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Carousel opts={{ align: "start", loop: false }} className="w-full">
            <div className="flex items-end justify-between mb-8 md:mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-primary">
                  Curated Journeys, By Design
                </h2>
                <div className="w-16 h-px bg-accent mt-4 md:mt-5" />
              </div>
              <div className="hidden sm:flex items-center gap-3 shrink-0">
                <CarouselPrevious
                  className="static translate-y-0 h-10 w-10 border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
                  data-testid="button-categories-prev"
                />
                <CarouselNext
                  className="static translate-y-0 h-10 w-10 border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
                  data-testid="button-categories-next"
                />
              </div>
            </div>

            <CarouselContent>
              {categories.map((category) => {
                const count = tourCounts[category.name] || 0;
                const tagline =
                  CATEGORY_TAGLINE_OVERRIDES[category.slug] ||
                  category.shortDescription ||
                  category.description ||
                  "";

                return (
                  <CarouselItem
                    key={category.id}
                    className="basis-[85%] sm:basis-[55%] md:basis-[38%] lg:basis-[28%]"
                  >
                    <Link
                      href={`${CATEGORIES_BASE_PATH}/${category.slug}`}
                      className="group block h-[420px] sm:h-[450px] relative rounded-lg overflow-hidden"
                      data-testid={`card-category-${category.slug}`}
                    >
                      <img
                        src={category.image}
                        alt={category.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />

                      <div className="absolute top-4 left-4 bg-primary/70 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <span className="text-primary-foreground text-[11px] font-semibold uppercase tracking-wider">
                          {count} {count === 1 ? "Experience" : "Experiences"}
                        </span>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                        <h3 className="font-serif text-xl md:text-2xl font-bold text-primary-foreground leading-snug">
                          {category.name}
                        </h3>
                        {tagline && (
                          <p className="text-sm text-primary-foreground/75 leading-snug mt-2 line-clamp-2">
                            {tagline}
                          </p>
                        )}
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-accent mt-4">
                          Explore Collection
                          <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                            →
                          </span>
                        </span>
                      </div>
                    </Link>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        )}
      </div>
    </section>
  );
}
