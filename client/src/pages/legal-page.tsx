import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navigation from "../components/navigation";
import { useSEO } from "@/hooks/use-seo";
import Footer from "../components/footer";
import ScrollToTopButton from "../components/scroll-to-top-button";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Shield,
  Eye,
  Cookie,
  Mail,
  Scale,
  FileText,
  Calendar,
  CreditCard,
  Settings,
  BarChart,
  Leaf,
  Heart,
  Users,
  Globe,
  Info,
  AlertTriangle,
} from "lucide-react";
import { LEGAL_PAGES_FALLBACK } from "@/data/legal-pages-fallback";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  shield: Shield,
  eye: Eye,
  cookie: Cookie,
  mail: Mail,
  scale: Scale,
  "file-text": FileText,
  calendar: Calendar,
  "credit-card": CreditCard,
  settings: Settings,
  "bar-chart": BarChart,
  leaf: Leaf,
  heart: Heart,
  users: Users,
  globe: Globe,
  info: Info,
  "alert-triangle": AlertTriangle,
};

function getIcon(value: string) {
  return ICON_MAP[value] || Info;
}

interface LegalPageData {
  title: string;
  subtitle?: string | null;
  introTitle?: string | null;
  introDescription?: string | null;
  highlights?: { icon: string; title: string; description: string }[];
  content?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  contactAddress?: string | null;
  updatedAt?: string;
}

interface LegalPageProps {
  /** Passed for the 5 legacy routes (/privacy-policy etc.) so their URL stays fixed. */
  slug?: string;
}

export default function LegalPage({ slug: slugProp }: LegalPageProps) {
  const [, params] = useRoute("/legal/:slug");
  const slug = slugProp || params?.slug || "";

  const { data, isLoading, isFetched } = useQuery({
    queryKey: ["/api/public/legal-pages", slug],
    queryFn: async (): Promise<LegalPageData | null> => {
      const response = await fetch(`/api/public/legal-pages/${slug}`);
      if (!response.ok) return null;
      const json = await response.json();
      return json.legalPage;
    },
    enabled: !!slug,
  });

  const fallback = LEGAL_PAGES_FALLBACK[slug];
  const page: LegalPageData | undefined = data || fallback;

  useSEO({
    title: page?.title || "Legal",
    description: page?.subtitle || undefined,
  });

  if (isLoading && !isFetched) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-4xl font-serif font-bold text-primary mb-4">Page Not Found</h1>
            <p className="text-muted-foreground mb-8">The page you're looking for doesn't exist.</p>
            <Link href="/">
              <Button>Return Home</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const highlights = page.highlights || [];
  const hasContact = Boolean(page.contactEmail || page.contactPhone || page.contactAddress);
  const lastUpdated = data?.updatedAt
    ? new Date(data.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-32 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary-foreground mb-6 animate-fade-in">
            {page.title}
          </h1>
          {page.subtitle && (
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
              {page.subtitle}
            </p>
          )}
        </div>
      </section>

      <main>
        {/* Intro + Highlight Cards */}
        {(page.introTitle || page.introDescription || highlights.length > 0) && (
          <section className="py-20 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {(page.introTitle || page.introDescription) && (
                <div className="text-center mb-16">
                  {page.introTitle && (
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">{page.introTitle}</h2>
                  )}
                  {page.introDescription && (
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{page.introDescription}</p>
                  )}
                </div>
              )}

              {highlights.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {highlights.map((point, index) => {
                    const Icon = getIcon(point.icon);
                    return (
                      <Card
                        key={index}
                        className="text-center shadow-lg hover:shadow-xl transition-all duration-300 hover-elevate"
                        data-testid={`highlight-card-${index}`}
                      >
                        <CardContent className="p-6">
                          <div className="flex justify-center mb-4">
                            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                              <Icon className="h-6 w-6 text-accent" />
                            </div>
                          </div>
                          <h3 className="text-lg font-semibold text-primary mb-3">{point.title}</h3>
                          <p className="text-muted-foreground">{point.description}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Body Content */}
        {page.content && (
          <section className="py-20 bg-muted">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <Card className="shadow-lg">
                <CardContent className="p-8 md:p-12">
                  <div
                    className="prose prose-lg max-w-none prose-primary"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                  />
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Contact Block */}
        {hasContact && (
          <section className="py-20 bg-background">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">Contact Us</h2>
              <Card className="shadow-lg">
                <CardContent className="p-8">
                  <div className="text-muted-foreground leading-relaxed">
                    <p className="mb-4">If you have any questions, please contact us:</p>
                    <div className="space-y-2">
                      {page.contactEmail && (
                        <p>
                          <strong>Email:</strong>{" "}
                          <a href={`mailto:${page.contactEmail}`} className="text-accent-text hover:underline">
                            {page.contactEmail}
                          </a>
                        </p>
                      )}
                      {page.contactPhone && (
                        <p>
                          <strong>Phone:</strong> {page.contactPhone}
                        </p>
                      )}
                      {page.contactAddress && (
                        <p>
                          <strong>Address:</strong> {page.contactAddress}
                        </p>
                      )}
                    </div>
                    {lastUpdated && (
                      <p className="mt-6 text-sm text-muted-foreground/80">
                        This page was last updated: {lastUpdated}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}
      </main>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
