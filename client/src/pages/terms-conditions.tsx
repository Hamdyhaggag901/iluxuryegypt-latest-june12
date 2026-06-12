import Navigation from "../components/navigation";
import { useSEO } from "@/hooks/use-seo";
import Footer from "../components/footer";
import ScrollToTopButton from "../components/scroll-to-top-button";
import { Card, CardContent } from "@/components/ui/card";
import { Scale, FileText, Calendar, CreditCard } from "lucide-react";

export default function TermsConditions() {
  useSEO({
    title: "Terms & Conditions",
    description: "I.LuxuryEgypt terms and conditions of service for luxury Egypt travel bookings.",
  });

  const termsHighlights = [
    {
      icon: <Scale className="h-6 w-6 text-accent" />,
      title: "Fair Terms",
      description: "Clear, transparent terms that protect both you and our luxury services."
    },
    {
      icon: <FileText className="h-6 w-6 text-accent" />,
      title: "Service Agreement",
      description: "Detailed outline of our luxury travel services and your expectations."
    },
    {
      icon: <Calendar className="h-6 w-6 text-accent" />,
      title: "Booking Terms",
      description: "Flexible booking and cancellation policies for luxury travel."
    },
    {
      icon: <CreditCard className="h-6 w-6 text-accent" />,
      title: "Payment Terms",
      description: "Secure payment processing with clear pricing structures."
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
            Terms & Conditions
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
            Understanding our service terms ensures a seamless luxury travel experience for you.
          </p>
        </div>
      </section>

      <main>
        {/* Terms Overview Section */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
                Service Terms Overview
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                These terms govern your use of I.LuxuryEgypt services and ensure a transparent, professional relationship throughout your luxury travel experience.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {termsHighlights.map((item, index) => (
                <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-all duration-300 hover-elevate">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                        {item.icon}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-primary mb-3">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Terms Details */}
        <section className="py-20 bg-muted">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              
              {/* Acceptance of Terms */}
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  Acceptance of Terms
                </h2>
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="text-muted-foreground leading-relaxed space-y-4">
                      <p>By accessing our website or using our luxury travel services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.</p>
                      <p>These terms apply to all visitors, users, and others who access or use I.LuxuryEgypt services, including our bespoke travel planning, concierge services, and luxury accommodations.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Service Description */}
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  Service Description
                </h2>
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="space-y-6 text-muted-foreground leading-relaxed">
                      <div>
                        <h4 className="text-xl font-semibold text-primary mb-3">Luxury Travel Services</h4>
                        <p>I.LuxuryEgypt provides bespoke luxury travel experiences in Egypt, including:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                          <li>Personalized itinerary planning and design</li>
                          <li>Luxury accommodation bookings at premium hotels</li>
                          <li>Private guided tours and cultural experiences</li>
                          <li>VIP access to historical sites and exclusive venues</li>
                          <li>24/7 concierge support throughout your journey</li>
                          <li>Transportation arrangements and transfers</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-xl font-semibold text-primary mb-3">Service Availability</h4>
                        <p>Our services are available to travelers worldwide who wish to experience luxury travel in Egypt. All services are subject to availability and confirmation by our team and partner providers.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Booking and Reservations */}
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  Booking and Reservations
                </h2>
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="space-y-6 text-muted-foreground leading-relaxed">
                      <div>
                        <h4 className="text-xl font-semibold text-primary mb-3">Booking Process</h4>
                        <ul className="list-disc ml-6 space-y-2">
                          <li>All bookings require written confirmation from I.LuxuryEgypt</li>
                          <li>A deposit may be required to secure your luxury experience</li>
                          <li>Final payments are due according to the agreed timeline</li>
                          <li>Travel insurance is strongly recommended for all bookings</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-xl font-semibold text-primary mb-3">Changes and Modifications</h4>
                        <ul className="list-disc ml-6 space-y-2">
                          <li>Changes to confirmed bookings may incur additional fees</li>
                          <li>Modifications are subject to availability of hotels and services</li>
                          <li>We will do our best to accommodate changes while maintaining luxury standards</li>
                          <li>Some partner services may have their own modification policies</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Payment Terms */}
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  Payment Terms
                </h2>
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="space-y-6 text-muted-foreground leading-relaxed">
                      <div>
                        <h4 className="text-xl font-semibold text-primary mb-3">Payment Schedule</h4>
                        <ul className="list-disc ml-6 space-y-2">
                          <li>Deposit required upon booking confirmation (typically 30-50%)</li>
                          <li>Final payment due 30 days prior to travel</li>
                          <li>Payment plans available for extended luxury experiences</li>
                          <li>All prices quoted are in USD unless otherwise specified</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-xl font-semibold text-primary mb-3">Accepted Payment Methods</h4>
                        <ul className="list-disc ml-6 space-y-2">
                          <li>Major credit cards (Visa, MasterCard, American Express)</li>
                          <li>Bank transfers for larger bookings</li>
                          <li>Online payment platforms as agreed</li>
                          <li>All payments are processed securely through encrypted systems</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Cancellation Policy */}
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  Cancellation Policy
                </h2>
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="space-y-6 text-muted-foreground leading-relaxed">
                      <div>
                        <h4 className="text-xl font-semibold text-primary mb-3">Cancellation Timeline</h4>
                        <ul className="list-disc ml-6 space-y-2">
                          <li><strong>60+ days before travel:</strong> Full refund minus 10% administrative fee</li>
                          <li><strong>30-59 days before travel:</strong> 50% refund of total booking value</li>
                          <li><strong>14-29 days before travel:</strong> 25% refund of total booking value</li>
                          <li><strong>Less than 14 days:</strong> No refund available</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-xl font-semibold text-primary mb-3">Special Circumstances</h4>
                        <p>We understand that luxury travel plans can change due to unforeseen circumstances. We may consider exceptions for:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-2">
                          <li>Medical emergencies (with documentation)</li>
                          <li>Government travel advisories</li>
                          <li>Force majeure events</li>
                          <li>Cases covered by comprehensive travel insurance</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Liability and Responsibility */}
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  Liability and Responsibility
                </h2>
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                      <p>I.LuxuryEgypt acts as an intermediary between travelers and service providers. While we carefully select our luxury partners, we are not liable for:</p>
                      <ul className="list-disc ml-6 space-y-2">
                        <li>Acts of third-party service providers (hotels, airlines, local operators)</li>
                        <li>Natural disasters, political events, or force majeure circumstances</li>
                        <li>Personal injuries or losses during travel</li>
                        <li>Delays or cancellations by airlines or other transportation providers</li>
                      </ul>
                      <p className="font-semibold text-primary">We strongly recommend comprehensive travel insurance for all luxury travel experiences.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Intellectual Property */}
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  Intellectual Property
                </h2>
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="text-muted-foreground leading-relaxed space-y-4">
                      <p>All content on our website, including text, images, logos, and itinerary designs, is the property of I.LuxuryEgypt and is protected by copyright laws.</p>
                      <p>You may not reproduce, distribute, or use our content for commercial purposes without written permission.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Governing Law */}
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  Governing Law
                </h2>
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="text-muted-foreground leading-relaxed space-y-4">
                      <p>These Terms and Conditions are governed by Egyptian law. Any disputes will be resolved through good faith negotiation or mediation in Cairo, Egypt.</p>
                      <p>If you have concerns about our services, please contact us first at: legal@i.luxuryegypt.com</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  Contact Information
                </h2>
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="text-muted-foreground leading-relaxed">
                      <p className="mb-4">For questions about these Terms and Conditions, please contact us:</p>
                      <div className="space-y-2">
                        <p><strong>Email:</strong> legal@i.luxuryegypt.com</p>
                        <p><strong>Phone:</strong> +20 xxx xxx xxxx</p>
                        <p><strong>Address:</strong> Cairo, Egypt</p>
                      </div>
                      <p className="mt-6 text-sm text-muted-foreground/80">
                        These Terms and Conditions were last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
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