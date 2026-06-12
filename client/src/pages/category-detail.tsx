import { useParams, useLocation } from "wouter";
import { useSEO } from "@/hooks/use-seo";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import LuxuryPackagesSection from "@/components/destination-blocks";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "wouter";
import type { Category } from "@shared/schema";

export default function CategoryDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const [location] = useLocation();
  const basePath = location.startsWith("/egypt-day-tours")
    ? "/egypt-day-tours"
    : location.startsWith("/egypt-nile-cruise-tours")
      ? "/egypt-nile-cruise-tours"
      : "/egypt-tour-packages";
  const baseLabel = basePath === "/egypt-day-tours"
    ? "Day Tours"
    : basePath === "/egypt-nile-cruise-tours"
      ? "Nile Cruises"
      : "Packages";

  const { data, isLoading, isError } = useQuery<{ success: boolean; category: Category }>({
    queryKey: [`/api/public/categories/${slug}`],
    enabled: !!slug,
  });

  useSEO({
    title: data?.category?.name,
    description: data?.category?.description?.slice(0, 160),
    image: data?.category?.image,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (isError || !data?.category) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-serif font-bold text-primary mb-4">Category Not Found</h1>
            <p className="text-muted-foreground mb-8">The category you're looking for doesn't exist.</p>
            <Link href={basePath}>
              <Button data-testid="button-back-experiences">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to {baseLabel}
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const category = data.category;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 md:pt-40 pb-16 bg-gradient-to-br from-background via-accent/5 to-primary/10 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10" 
          style={{ backgroundImage: `url(${category.image})` }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href={basePath}>
            <Button variant="outline" className="mb-8 hover:scale-105 transition-transform" data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {baseLabel}
            </Button>
          </Link>

          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary mb-8 leading-tight">
              {category.name}
            </h1>

            <div className="w-32 h-px bg-accent mx-auto mb-8"></div>

            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              {category.shortDescription || category.description}
            </p>
          </div>
        </div>
      </section>

      {/* Tours Section - Using LuxuryPackagesSection with category filter */}
      <LuxuryPackagesSection 
        category={category.name}
        title={`${category.name} Tours`}
        description={category.description}
      />

      <Footer />
    </div>
  );
}

