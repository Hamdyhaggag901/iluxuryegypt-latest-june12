import { useParams, useLocation } from "wouter";
import { useMemo } from "react";
import { useSEO } from "@/hooks/use-seo";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import FaqSection, { buildFaqJsonLd } from "@/components/faq-section";
import LuxuryPackagesSection from "@/components/destination-blocks";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { legacyTextToHtml } from "@/lib/legacy-text-to-html";
import { stripHtml } from "@shared/strip-html";
import type { Category } from "@shared/schema";

export default function CategoryDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const [location] = useLocation();
  const basePath = location.startsWith("/egypt-day-tours")
    ? "/egypt-day-tours"
    : location.startsWith("/egypt-nile-cruise-tours")
      ? "/egypt-nile-cruise-tours"
      : "/luxury-egypt-tour-packages";
  const baseLabel = basePath === "/egypt-day-tours"
    ? "Day Tours"
    : basePath === "/egypt-nile-cruise-tours"
      ? "Nile Cruises"
      : "Packages";

  const { data, isLoading, isError } = useQuery<{ success: boolean; category: Category }>({
    queryKey: [`/api/public/categories/${slug}`],
    enabled: !!slug,
  });

  // Admin-curated FAQs, same "filter out half-written entries" guard
  // tour-detail.tsx applies to tour.faqs.
  const categoryFaqs = useMemo(
    () =>
      (data?.category?.faqs || [])
        .filter(
          (f): f is { id: string; question: string; answer: string } =>
            Boolean(f && f.question?.trim() && f.answer?.trim())
        )
        .map((f) => ({ question: f.question, answer: f.answer })),
    [data]
  );

  useSEO({
    title: data?.category?.seoTitle?.trim() || data?.category?.name,
    description:
      data?.category?.metaDescription?.trim() ||
      data?.category?.shortDescription ||
      (data?.category?.description ? stripHtml(data.category.description).slice(0, 160) : undefined),
    image: data?.category?.image,
    jsonLd: buildFaqJsonLd(categoryFaqs),
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
              {category.shortDescription || stripHtml(category.description)}
            </p>
          </div>
        </div>
      </section>

      {/* Long-form category copy. Rendered as HTML (same sanitize +
          legacyTextToHtml pipeline as tour-detail.tsx) so the h2/h3
          subheadings and internal links in the DB copy render as real
          markup rather than visible tags. */}
      {category.description?.trim() && (
        <section className="py-12 md:py-16">
          <div
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-base md:text-lg text-muted-foreground leading-relaxed [&>p]:mb-4 last:[&>p]:mb-0 [&>h2]:text-2xl md:[&>h2]:text-3xl [&>h2]:font-serif [&>h2]:font-bold [&>h2]:text-primary [&>h2]:mt-8 [&>h2]:mb-4 [&>h3]:text-xl md:[&>h3]:text-2xl [&>h3]:font-serif [&>h3]:font-semibold [&>h3]:text-primary [&>h3]:mt-6 [&>h3]:mb-3 [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(legacyTextToHtml(category.description)) }}
          />
        </section>
      )}

      {/* Tours Section - Using LuxuryPackagesSection with category filter.
          No description prop: that slot renders plain text, and the
          category's own description is long-form HTML rendered above. */}
      <LuxuryPackagesSection
        category={category.name}
        // Names increasingly carry the word themselves ("Egypt Family Tours",
        // "Egypt Tours for Solo Travellers"), so only append where it is absent.
        title={/\btours?\b/i.test(category.name) ? category.name : `${category.name} Tours`}
      />

      <FaqSection id="category-faq" faqs={categoryFaqs} testId="category-faq-section" />

      <Footer />
    </div>
  );
}

