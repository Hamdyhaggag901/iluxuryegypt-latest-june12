import Navigation from "../components/navigation";
import { useSEO } from "@/hooks/use-seo";
import Footer from "../components/footer";
import ScrollToTopButton from "../components/scroll-to-top-button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Info, Shield, Globe } from "lucide-react";

export default function Disclaimer() {
  useSEO({
    title: "Disclaimer",
    description: "I.LuxuryEgypt legal disclaimer for website content and travel services.",
  });

  const disclaimerPoints = [
    {
      icon: <Info className="h-6 w-6 text-accent" />,
      title: "Information Accuracy",
      description: "We strive for accuracy but information may change without notice."
    },
    {
      icon: <Shield className="h-6 w-6 text-accent" />,
      title: "Service Limitations",
      description: "Our liability is limited as outlined in our terms and conditions."
    },
    {
      icon: <Globe className="h-6 w-6 text-accent" />,
      title: "Third-Party Services",
      description: "We work with partners but are not responsible for their services."
    },
    {
      icon: <AlertTriangle className="h-6 w-6 text-accent" />,
      title: "Travel Risks",
      description: "International luxury travel involves inherent risks and uncertainties."
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
            Disclaimer
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
            Important information about our luxury travel services and limitations of liability.
          </p>
        </div>
      </section>

      <main>
        {/* Disclaimer Overview Section */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
                Important Disclaimers
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Please read these important disclaimers carefully before using our luxury travel services. They outline the limitations and conditions of our services.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {disclaimerPoints.map((point, index) => (
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

        {/* Disclaimer Details */}
        <section className="py-20 bg-muted">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              
              {/* General Disclaimer */}
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  General Disclaimer
                </h2>
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="text-muted-foreground leading-relaxed space-y-4">
                      <p>The information provided on this website and through our luxury travel services is for general informational purposes only. While we strive to keep the information up to date and accurate, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information contained on this website or in our services.</p>
                      <p>Any reliance you place on such information is therefore strictly at your own risk. In no event will I.LuxuryEgypt be liable for any loss or damage including, without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website or our services.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Travel Service Disclaimer */}
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  Travel Service Disclaimer
                </h2>
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="space-y-6 text-muted-foreground leading-relaxed">
                      <div>
                        <h4 className="text-xl font-semibold text-primary mb-3">Role as Travel Consultant</h4>
                        <p>I.LuxuryEgypt acts as a luxury travel consultant and intermediary. We arrange bookings with third-party providers including:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                          <li>Luxury hotels and resorts</li>
                          <li>Airlines and transportation companies</li>
                          <li>Local tour operators and guides</li>
                          <li>Restaurants and entertainment venues</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-xl font-semibold text-primary mb-3">Service Provider Responsibility</h4>
                        <p>Each service provider is responsible for the provision of their own services. We are not liable for:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                          <li>Quality of accommodations or service standards</li>
                          <li>Flight delays, cancellations, or schedule changes</li>
                          <li>Changes to hotel amenities or room categories</li>
                          <li>Restaurant closures or menu changes</li>
                          <li>Weather conditions affecting outdoor activities</li>
                        </ul>
                      </div>
                      
                      <div className="bg-accent/10 rounded-lg p-4">
                        <p className="font-semibold text-primary">We carefully select our luxury partners based on their reputation and service standards, but we cannot guarantee their performance.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Travel Risks and Insurance */}
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  Travel Risks and Insurance
                </h2>
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="space-y-6 text-muted-foreground leading-relaxed">
                      <div>
                        <h4 className="text-xl font-semibold text-primary mb-3">Inherent Travel Risks</h4>
                        <p>International travel involves inherent risks, including but not limited to:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-2">
                          <li>Political instability or government travel advisories</li>
                          <li>Natural disasters, weather events, or climate conditions</li>
                          <li>Health risks, pandemics, or medical emergencies</li>
                          <li>Currency fluctuations affecting costs</li>
                          <li>Changes in local laws or regulations</li>
                          <li>Transportation strikes or infrastructure issues</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-xl font-semibold text-primary mb-3">Travel Insurance Requirement</h4>
                        <p>We strongly recommend that all clients obtain comprehensive travel insurance that covers:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-2">
                          <li>Trip cancellation and interruption</li>
                          <li>Medical expenses and emergency evacuation</li>
                          <li>Lost or delayed baggage</li>
                          <li>Travel delays and missed connections</li>
                        </ul>
                      </div>
                      
                      <div className="bg-primary/10 rounded-lg p-4">
                        <p className="font-semibold text-primary">Travel insurance is not included in our service fees but is essential for luxury travel protection.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Information Accuracy */}
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  Information Accuracy
                </h2>
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="space-y-6 text-muted-foreground leading-relaxed">
                      <div>
                        <h4 className="text-xl font-semibold text-primary mb-3">Website Content</h4>
                        <p>Information on our website, including prices, availability, and service descriptions, may change without notice. We strive to maintain accuracy but:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-2">
                          <li>Prices are subject to change until booking is confirmed</li>
                          <li>Availability depends on third-party providers</li>
                          <li>Images may not represent actual accommodations</li>
                          <li>Service descriptions are based on provider information</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-xl font-semibold text-primary mb-3">Booking Confirmation</h4>
                        <p>All bookings are subject to confirmation by our partners. Final prices and availability will be confirmed in writing before your travel.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Health and Safety */}
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  Health and Safety
                </h2>
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="space-y-6 text-muted-foreground leading-relaxed">
                      <div>
                        <h4 className="text-xl font-semibold text-primary mb-3">Medical Advice</h4>
                        <p>We are not medical professionals and cannot provide health advice. Before traveling to Egypt, please:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-2">
                          <li>Consult your physician about required vaccinations</li>
                          <li>Check government health advisories for Egypt</li>
                          <li>Consider your physical fitness for planned activities</li>
                          <li>Bring necessary medications and prescriptions</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-xl font-semibold text-primary mb-3">Safety Precautions</h4>
                        <p>While Egypt is generally safe for luxury travelers, please:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-2">
                          <li>Follow local laws and customs</li>
                          <li>Keep copies of important documents</li>
                          <li>Stay informed about local conditions</li>
                          <li>Follow guidance from local authorities and guides</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Limitation of Liability */}
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  Limitation of Liability
                </h2>
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                      <p>I.LuxuryEgypt's liability is limited to the total amount paid for our services. We are not liable for:</p>
                      <ul className="list-disc ml-6 space-y-2">
                        <li>Indirect, incidental, or consequential damages</li>
                        <li>Loss of profits, data, or business opportunities</li>
                        <li>Damages exceeding the cost of our services</li>
                        <li>Acts of third-party service providers</li>
                        <li>Force majeure events beyond our control</li>
                      </ul>
                      <div className="bg-accent/10 rounded-lg p-4 mt-6">
                        <p className="font-semibold text-primary">This limitation applies to the fullest extent permitted by law.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Jurisdiction */}
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  Jurisdiction and Governing Law
                </h2>
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="text-muted-foreground leading-relaxed space-y-4">
                      <p>This disclaimer is governed by Egyptian law. Any disputes arising from our services will be subject to the exclusive jurisdiction of Egyptian courts in Cairo.</p>
                      <p>If any provision of this disclaimer is found to be invalid or unenforceable, the remaining provisions will continue to be valid and enforceable.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  Questions or Concerns?
                </h2>
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="text-muted-foreground leading-relaxed">
                      <p className="mb-4">If you have questions about this disclaimer or need clarification about our services, please contact us:</p>
                      <div className="space-y-2">
                        <p><strong>Email:</strong> legal@i.luxuryegypt.com</p>
                        <p><strong>Phone:</strong> +20 xxx xxx xxxx</p>
                        <p><strong>Address:</strong> Cairo, Egypt</p>
                      </div>
                      <p className="mt-6 text-sm text-muted-foreground/80">
                        This Disclaimer was last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
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