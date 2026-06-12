import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/use-seo";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import LuxuryPackagesSection from "@/components/destination-blocks";
import { ArrowLeft, Heart, Baby, Users } from "lucide-react";
import { Link } from "wouter";

export default function FamilyLuxury() {
  useSEO({
    title: "Luxury Family Vacations in Egypt",
    description: "Create unforgettable family memories in Egypt. Kid-friendly luxury tours with private guides and five-star comfort.",
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 bg-gradient-to-br from-background via-accent/5 to-primary/10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.egypttoursportal.com/images/2022/09/Discover-Ancient-Egypt-in-8-Days-Luxury-Holiday-Egypt-Tours-Portal.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/egypt-tour-packages">
            <Button variant="outline" className="mb-8 hover:scale-105 transition-transform" data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Experiences
            </Button>
          </Link>

          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-accent/10 rounded-full px-6 py-3 mb-8">
              <Heart className="h-6 w-6 text-accent" />
              <span className="text-accent font-semibold">Family Luxury Adventures</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary mb-8 leading-tight">
              Family
              <span className="block text-accent">Luxury</span>
            </h1>

            <div className="w-32 h-px bg-accent mx-auto mb-8"></div>

            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-12">
              Perfect adventures designed for families to explore Egypt together with engaging activities for all ages.
              Create lasting memories while discovering ancient wonders through interactive experiences that captivate both children and adults.
            </p>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-accent/20">
                <Baby className="h-8 w-8 text-accent mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-primary mb-2">Kid-Friendly</h3>
                <p className="text-sm text-muted-foreground">Activities designed for children aged 4+</p>
              </div>
              <div className="text-center p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-accent/20">
                <Users className="h-8 w-8 text-accent mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-primary mb-2">Family Groups</h3>
                <p className="text-sm text-muted-foreground">Perfect for families of 4-16 people</p>
              </div>
              <div className="text-center p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-accent/20">
                <Heart className="h-8 w-8 text-accent mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-primary mb-2">Educational Fun</h3>
                <p className="text-sm text-muted-foreground">Learning through interactive experiences</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tours Section - Now using LuxuryPackagesSection with category filter */}
      <LuxuryPackagesSection 
        category="Egypt Family Holidays"
        title="Family Adventure Tours"
        description="Choose from our carefully curated family experiences, each designed to engage and educate all family members."
      />

      {/* Why Choose Family Luxury Section */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
              Why Choose Our Family Experiences?
            </h2>
            <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-background rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Baby className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-4">Child-Centered Design</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every tour is carefully crafted with children's attention spans, interests, and safety in mind.
              </p>
            </div>

            <div className="text-center p-8 bg-background rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-4">Expert Family Guides</h3>
              <p className="text-muted-foreground leading-relaxed">
                Specialized guides trained in working with families and making history come alive for young minds.
              </p>
            </div>

            <div className="text-center p-8 bg-background rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-4">Memorable Bonding</h3>
              <p className="text-muted-foreground leading-relaxed">
                Create lasting family memories through shared discoveries and interactive learning experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Ready for a Family Adventure?
          </h2>
          <div className="w-24 h-px bg-accent mx-auto mb-8"></div>
          <p className="text-xl mb-10 leading-relaxed opacity-90">
            Let our family travel specialists help you create the perfect Egyptian adventure for your loved ones.
            Every detail is carefully planned to ensure smiles, learning, and unforgettable moments.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg min-w-[200px] hover:scale-105 transition-transform" data-testid="button-plan-adventure">
                Plan Our Adventure
              </Button>
            </Link>
            <Link href="/egypt-tour-packages">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg min-w-[200px] border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary hover:scale-105 transition-all" data-testid="button-all-experiences">
                See All Experiences
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

