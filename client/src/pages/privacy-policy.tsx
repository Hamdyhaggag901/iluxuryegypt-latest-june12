import Navigation from "../components/navigation";
import { useSEO } from "@/hooks/use-seo";
import Footer from "../components/footer";
import ScrollToTopButton from "../components/scroll-to-top-button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Eye, Cookie, Mail } from "lucide-react";

export default function PrivacyPolicy() {
  useSEO({
    title: "Privacy Policy",
    description: "I.LuxuryEgypt privacy policy. How we collect, use, and protect your personal information.",
  });

  const privacyPoints = [
    {
      icon: <Shield className="h-6 w-6 text-accent" />,
      title: "Data Protection",
      description: "Your personal information is secured with industry-standard encryption."
    },
    {
      icon: <Eye className="h-6 w-6 text-accent" />,
      title: "Transparency",
      description: "We clearly explain what data we collect and how we use it."
    },
    {
      icon: <Cookie className="h-6 w-6 text-accent" />,
      title: "Cookie Control",
      description: "You have full control over cookies and tracking preferences."
    },
    {
      icon: <Mail className="h-6 w-6 text-accent" />,
      title: "Communication",
      description: "We only send travel-related communications you've requested."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-32 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary-foreground mb-6 animate-fade-in">
            Privacy Policy
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
            Your privacy is paramount to us. Learn how we protect and respect your personal information.
          </p>
        </div>
      </section>

      <main>
        {/* Privacy Commitment Section */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
                Our Privacy Commitment
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                At I.LuxuryEgypt, we are committed to protecting your privacy and ensuring the security of your personal information. This policy outlines our practices regarding the collection, use, and protection of your data.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {privacyPoints.map((point, index) => (
                <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-all duration-300 hover-elevate">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                        {point.icon}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-primary mb-3">{point.title}</h3>
                    <p className="text-muted-foreground">{point.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Policy Details */}
        <section className="py-20 bg-muted">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              
              {/* Information Collection */}
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  Information We Collect
                </h2>
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="space-y-6 text-muted-foreground leading-relaxed">
                      <div>
                        <h4 className="text-xl font-semibold text-primary mb-3">Personal Information</h4>
                        <p>We collect information you provide directly to us, such as when you:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                          <li>Submit travel inquiries through our contact forms</li>
                          <li>Subscribe to our newsletter or travel updates</li>
                          <li>Book luxury travel experiences with us</li>
                          <li>Communicate with our concierge team</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-xl font-semibold text-primary mb-3">Travel Preferences</h4>
                        <p>To create bespoke luxury experiences, we may collect information about your:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                          <li>Preferred destinations and travel dates</li>
                          <li>Accommodation preferences and dietary requirements</li>
                          <li>Special interests and accessibility needs</li>
                          <li>Previous travel history with us</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-xl font-semibold text-primary mb-3">Technical Information</h4>
                        <p>We automatically collect certain information when you visit our website, including:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                          <li>IP address and browser information</li>
                          <li>Pages visited and time spent on our site</li>
                          <li>Device information and screen resolution</li>
                          <li>Referral sources and search terms</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* How We Use Information */}
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  How We Use Your Information
                </h2>
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="space-y-6 text-muted-foreground leading-relaxed">
                      <p>We use the information we collect to:</p>
                      <ul className="list-disc ml-6 space-y-2">
                        <li>Design and deliver personalized luxury travel experiences</li>
                        <li>Communicate with you about your inquiries and bookings</li>
                        <li>Provide 24/7 concierge support during your travels</li>
                        <li>Send you travel inspiration and exclusive offers (with your consent)</li>
                        <li>Improve our services and website functionality</li>
                        <li>Comply with legal obligations and protect our business interests</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Information Sharing */}
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  Information Sharing
                </h2>
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="space-y-6 text-muted-foreground leading-relaxed">
                      <p>We may share your information with:</p>
                      <ul className="list-disc ml-6 space-y-2">
                        <li><strong>Luxury hotel partners and service providers</strong> - To arrange your accommodations and experiences</li>
                        <li><strong>Transportation providers</strong> - To organize transfers and flights</li>
                        <li><strong>Local guides and experience curators</strong> - To deliver authentic cultural experiences</li>
                        <li><strong>Payment processors</strong> - To securely handle transactions</li>
                        <li><strong>Legal authorities</strong> - When required by law or to protect our rights</li>
                      </ul>
                      <p className="font-semibold text-primary">We never sell your personal information to third parties.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Data Security */}
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  Data Security
                </h2>
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                      <p>We implement appropriate security measures to protect your personal information, including:</p>
                      <ul className="list-disc ml-6 space-y-2">
                        <li>SSL encryption for all data transmissions</li>
                        <li>Secure servers and databases with access controls</li>
                        <li>Regular security audits and updates</li>
                        <li>Employee training on data protection practices</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Your Rights */}
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  Your Rights
                </h2>
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                      <p>You have the right to:</p>
                      <ul className="list-disc ml-6 space-y-2">
                        <li>Access and review the personal information we have about you</li>
                        <li>Request corrections to any inaccurate information</li>
                        <li>Request deletion of your personal information</li>
                        <li>Opt-out of marketing communications at any time</li>
                        <li>Restrict how we process your information</li>
                        <li>Request a copy of your data in a portable format</li>
                      </ul>
                      <p>To exercise these rights, please contact us at privacy@i.luxuryegypt.com</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  Contact Us
                </h2>
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="text-muted-foreground leading-relaxed">
                      <p className="mb-4">If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
                      <div className="space-y-2">
                        <p><strong>Email:</strong> privacy@i.luxuryegypt.com</p>
                        <p><strong>Phone:</strong> +20 xxx xxx xxxx</p>
                        <p><strong>Address:</strong> Cairo, Egypt</p>
                      </div>
                      <p className="mt-6 text-sm text-muted-foreground/80">
                        This Privacy Policy was last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}