import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Loader2, ArrowRight, Sparkles } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import type { Category, Tour } from "@shared/schema";

type CategoryGroup = "packages" | "day-tours" | "nile-cruise";

interface CategoryGroupPageProps {
  group: CategoryGroup;
  title: string;
  description: string;
  basePath: string;
}

export default function CategoryGroupPage({
  group,
  title,
  description,
  basePath,
}: CategoryGroupPageProps) {
  const { data, isLoading, isError } = useQuery<{ success: boolean; categories: Category[] }>({
    queryKey: ["/api/public/categories", group],
    queryFn: async () => {
      const res = await fetch(`/api/public/categories?type=${group}`);
      if (!res.ok) throw new Error("Failed to load categories");
      return res.json();
    },
  });

  const { data: toursData } = useQuery<{ success: boolean; tours: Tour[] }>({
    queryKey: ["/api/public/tours", group],
    queryFn: async () => {
      const res = await fetch("/api/public/tours");
      if (!res.ok) throw new Error("Failed to load tours");
      return res.json();
    },
  });

  const categories = data?.categories || [];
  const tours = toursData?.tours || [];
  const tourCounts = categories.reduce((acc, category) => {
    acc[category.name] = tours.filter((tour) => tour.category === category.name).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="min-h-[70vh] pt-[140px] pb-20 bg-[#e7e1da] relative overflow-hidden flex items-center">
        {/* Subtle decorative elements */}
        <div className="absolute top-1/4 left-8 w-px h-32 bg-gradient-to-b from-transparent via-accent/30 to-transparent" />
        <div className="absolute top-1/3 right-8 w-px h-24 bg-gradient-to-b from-transparent via-accent/20 to-transparent" />
        <div className="absolute bottom-1/4 left-1/4 w-24 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        <div className="absolute top-1/2 right-1/4 w-16 h-px bg-gradient-to-r from-transparent via-accent/15 to-transparent" />

        {/* Floating accent circles */}
        <div className="absolute top-1/3 right-[15%] w-2 h-2 rounded-full bg-accent/20 animate-pulse" />
        <div className="absolute bottom-1/3 left-[20%] w-1.5 h-1.5 rounded-full bg-accent/30 animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Animated top line */}
          <div className="flex items-center justify-center gap-4 mb-12 animate-fade-in">
            <div className="w-12 h-px bg-accent/40" />
            <span className="text-accent/60 text-xs tracking-[0.4em] uppercase font-light">
              Luxury Travel
            </span>
            <div className="w-12 h-px bg-accent/40" />
          </div>

          {/* Main title with staggered animation */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light text-primary mb-8 tracking-wide animate-slide-up">
            {title}
          </h1>

          {/* Animated accent line */}
          <div className="w-0 h-px bg-accent mx-auto mb-10 animate-expand-line" />

          {/* Description with fade in */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light animate-fade-in-delayed">
            {description}
          </p>

          {/* Scroll indicator */}
          <div className="mt-16 animate-fade-in-delayed">
            <div className="flex flex-col items-center gap-2 text-accent/50">
              <span className="text-xs tracking-[0.3em] uppercase">Explore</span>
              <div className="w-px h-8 bg-gradient-to-b from-accent/50 to-transparent animate-bounce-slow" />
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes expand-line {
          from { width: 0; }
          to { width: 80px; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 1s ease-out 0.2s forwards;
          opacity: 0;
        }
        .animate-expand-line {
          animation: expand-line 0.8s ease-out 0.6s forwards;
        }
        .animate-fade-in-delayed {
          animation: fade-in 1s ease-out 0.8s forwards;
          opacity: 0;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>

      {/* Tailor Made CTA - Always visible */}
      <section className="py-12 bg-background border-b border-accent/10">
        <div className="max-w-[90rem] mx-auto px-6 sm:px-10 lg:px-16">
          <Link href="/tailor-made" className="group block">
            <div className="relative bg-gradient-to-r from-primary via-primary/95 to-primary rounded-2xl p-8 md:p-12 overflow-hidden transition-all duration-500 hover:shadow-2xl">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-accent/40 rounded-full" />
              <div className="absolute bottom-1/3 right-1/3 w-1.5 h-1.5 bg-accent/30 rounded-full" />

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  {/* Icon */}
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-accent" />
                  </div>

                  {/* Text content */}
                  <div>
                    <span className="text-accent text-xs tracking-[0.3em] uppercase font-medium">
                      Custom Experience
                    </span>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mt-1">
                      Tailor Made Tour
                    </h3>
                    <p className="text-white/70 mt-2 max-w-lg text-sm md:text-base">
                      Can't find what you're looking for? Let us craft a personalized Egyptian adventure just for you.
                    </p>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="flex items-center gap-3 bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-full transition-all duration-300 group-hover:scale-105">
                  <span className="font-medium">Create Your Trip</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-[90rem] mx-auto px-6 sm:px-10 lg:px-16">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="text-center text-muted-foreground py-16">
              Unable to load categories right now.
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                More experiences coming soon. In the meantime, create your own tailor-made journey above.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`${basePath}/${category.slug}`}
                  className="group cursor-pointer block"
                >
                  <div className="relative bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl border border-accent/10 hover:border-accent/30 h-full flex flex-col">
                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                    {/* Image section with overlay */}
                    <div className="aspect-[4/3] relative overflow-hidden flex-shrink-0">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                      {/* Experience count badge */}
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                        <span className="text-primary text-xs font-semibold tracking-wide">
                          {tourCounts[category.name] || 0} {tourCounts[category.name] === 1 ? "Experience" : "Experiences"}
                        </span>
                      </div>

                      {/* Corner decorative element */}
                      <div className="absolute top-4 right-4 w-10 h-10 border-2 border-white/40 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:border-accent/60 group-hover:bg-accent/20 transition-all duration-500">
                        <div className="w-2 h-2 bg-white rounded-full group-hover:bg-accent transition-colors duration-500" />
                      </div>

                      {/* Category name on image */}
                      <div className="absolute bottom-4 left-5 right-5">
                        <div className="w-10 h-px bg-accent mb-3" />
                        <h3 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-wide">
                          {category.name}
                        </h3>
                      </div>
                    </div>

                    {/* Content box */}
                    <div className="p-6 md:p-8 relative flex flex-col flex-1">
                      {/* Decorative circles */}
                      <div className="absolute top-4 right-4 w-20 h-20 border border-accent/10 rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
                      <div className="absolute top-8 right-8 w-10 h-10 border border-accent/15 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500" />

                      {/* Category type */}
                      <span className="text-accent text-xs tracking-[0.25em] uppercase font-medium">
                        {group.replace("-", " ")}
                      </span>

                      {/* Description - fixed 150 characters */}
                      <div className="mt-4 flex-1">
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {(() => {
                            const desc = category.shortDescription || category.description || "";
                            return desc.length > 150 ? desc.substring(0, 150) + "..." : desc;
                          })()}
                        </p>
                      </div>

                      {/* Action area */}
                      <div className="mt-6 pt-6 border-t border-accent/10 flex items-center justify-between">
                        <div>
                          <span className="text-primary font-serif font-medium group-hover:text-accent transition-colors duration-300">
                            Explore Collection
                          </span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-all duration-300 group-hover:scale-110">
                          <ArrowRight className="w-5 h-5 text-accent group-hover:translate-x-0.5 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-muted">
        <div className="max-w-5xl mx-auto text-center px-6 sm:px-10 lg:px-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
            Ready to Plan Something Extraordinary?
          </h2>
          <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
            Tell us the style, dates, and pace you want — our specialists will craft a bespoke itinerary for you.
          </p>
          <Link href="/contact">
            <Button size="lg" className="px-10 py-5 text-lg" data-testid="button-contact-specialists">
              Contact Our Specialists
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
