import { useQuery } from "@tanstack/react-query";
import { useSEO } from "@/hooks/use-seo";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import ScrollToTopButton from "../components/scroll-to-top-button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, MessageCircle, Phone, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import NewsletterSection from "../components/newsletter-section";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  sortOrder: number;
  isVisible: boolean;
}

export default function FAQPage() {
  useSEO({
    title: "Frequently Asked Questions - Luxury Egypt Travel",
    description: "Find answers to common questions about luxury travel in Egypt, booking, and our bespoke services.",
  });

  const { data, isLoading } = useQuery<{ success: boolean; faqs: FAQ[] }>({
    queryKey: ["/api/public/faqs"],
    queryFn: async () => {
      const res = await fetch("/api/public/faqs");
      return res.json();
    },
  });

  const faqs = data?.faqs || [];

  // Group FAQs by category
  const groupedFaqs = faqs.reduce((acc, faq) => {
    const category = faq.category || "General";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(faq);
    return acc;
  }, {} as Record<string, FAQ[]>);

  const categories = Object.keys(groupedFaqs);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary-foreground mb-6 animate-fade-in">
            Frequently Asked Questions
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
            Find answers to common questions about our luxury Egypt travel experiences
          </p>
        </div>
      </section>

      <main>
        {/* Quick Help Cards */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <Card className="text-center shadow-lg hover:shadow-xl transition-all duration-300 hover-elevate">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                      <HelpCircle className="h-6 w-6 text-accent" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-primary mb-3">Browse FAQs</h3>
                  <p className="text-muted-foreground">Find quick answers to the most common questions about our services</p>
                </CardContent>
              </Card>

              <Card className="text-center shadow-lg hover:shadow-xl transition-all duration-300 hover-elevate">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                      <MessageCircle className="h-6 w-6 text-accent" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-primary mb-3">Live Chat</h3>
                  <p className="text-muted-foreground">Connect with our concierge team for personalized assistance</p>
                </CardContent>
              </Card>

              <Card className="text-center shadow-lg hover:shadow-xl transition-all duration-300 hover-elevate">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                      <Phone className="h-6 w-6 text-accent" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-primary mb-3">Call Us</h3>
                  <p className="text-muted-foreground">Speak directly with our travel experts 24/7</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Accordion Section */}
        <section className="py-20 bg-muted">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
                <span className="ml-2 text-muted-foreground">Loading FAQs...</span>
              </div>
            ) : faqs.length === 0 ? (
              <div className="text-center py-20">
                <HelpCircle className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold text-primary mb-2">No FAQs Available</h3>
                <p className="text-muted-foreground">Check back soon for frequently asked questions.</p>
              </div>
            ) : (
              <div className="space-y-12">
                {categories.map((category) => (
                  <div key={category}>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                      {category}
                    </h2>
                    <Card className="shadow-lg">
                      <CardContent className="p-0">
                        <Accordion type="single" collapsible className="w-full">
                          {groupedFaqs[category].map((faq, index) => (
                            <AccordionItem key={faq.id} value={faq.id} className="border-b last:border-b-0">
                              <AccordionTrigger className="px-6 py-4 text-left hover:no-underline hover:bg-muted/50 transition-colors">
                                <span className="text-lg font-medium text-primary pr-4">{faq.question}</span>
                              </AccordionTrigger>
                              <AccordionContent className="px-6 pb-6 pt-2">
                                <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                  {faq.answer}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Still Have Questions Section */}
        <section className="py-20 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
              Still Have Questions?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our dedicated concierge team is here to help you plan your perfect Egyptian adventure.
              Don't hesitate to reach out for personalized assistance.
            </p>
            <div className="flex justify-center">
              <Link href="/contact">
                <Button size="lg" className="px-8">
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <NewsletterSection />
      </main>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
