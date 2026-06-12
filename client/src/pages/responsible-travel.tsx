import Navigation from "../components/navigation";
import { useSEO } from "@/hooks/use-seo";
import Footer from "../components/footer";
import ScrollToTopButton from "../components/scroll-to-top-button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Heart, Users, Globe } from "lucide-react";

export default function ResponsibleTravel() {
  useSEO({
    title: "Responsible Travel",
    description: "Our commitment to responsible and sustainable luxury travel in Egypt.",
  });

  const responsibilityPillars = [
    {
      icon: <Leaf className="h-6 w-6 text-accent" />,
      title: "Environmental Care",
      description: "Protecting Egypt's natural wonders and ancient sites for future generations."
    },
    {
      icon: <Heart className="h-6 w-6 text-accent" />,
      title: "Cultural Respect",
      description: "Honoring local traditions and supporting authentic Egyptian heritage."
    },
    {
      icon: <Users className="h-6 w-6 text-accent" />,
      title: "Community Support",
      description: "Empowering local communities through sustainable tourism practices."
    },
    {
      icon: <Globe className="h-6 w-6 text-accent" />,
      title: "Global Responsibility",
      description: "Contributing to sustainable travel practices worldwide."
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
            Responsible Travel
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
            Luxury travel with a conscience - preserving Egypt's treasures while creating meaningful experiences.
          </p>
        </div>
      </section>

      <main>
        {/* Responsibility Pillars Section */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
                Our Responsibility Pillars
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                At I.LuxuryEgypt, we believe luxury travel should enrich both travelers and destinations. Our responsible travel approach ensures your experiences contribute positively to Egypt's future.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {responsibilityPillars.map((pillar, index) => (
                <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-all duration-300 hover-elevate">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                        {pillar.icon}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-primary mb-3">{pillar.title}</h3>
                    <p className="text-muted-foreground">{pillar.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Responsible Travel Details */}
        <section className="py-20 bg-muted">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              
              {/* Environmental Stewardship */}
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  Environmental Stewardship
                </h2>
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="space-y-6 text-muted-foreground leading-relaxed">
                      <div>
                        <h4 className="text-xl font-semibold text-primary mb-3">Protecting Ancient Sites</h4>
                        <p>We work exclusively with operators who follow strict conservation guidelines:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-2">
                          <li>Small group sizes to minimize impact on archaeological sites</li>
                          <li>Supporting restoration projects at historic monuments</li>
                          <li>Following UNESCO guidelines for World Heritage site visits</li>
                          <li>Educating travelers about the importance of preservation</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-xl font-semibold text-primary mb-3">Sustainable Practices</h4>
                        <p>Our luxury experiences incorporate environmentally conscious practices:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-2">
                          <li>Partnering with eco-certified luxury hotels and resorts</li>
                          <li>Promoting water conservation in desert environments</li>
                          <li>Supporting renewable energy initiatives in hospitality</li>
                          <li>Encouraging responsible wildlife viewing in natural areas</li>
                        </ul>
                      </div>
                      
                      <div className="bg-accent/10 rounded-lg p-4">
                        <p className="font-semibold text-primary">We offset carbon emissions from luxury transportation through verified environmental programs.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Cultural Preservation */}
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  Cultural Preservation & Respect
                </h2>
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="space-y-6 text-muted-foreground leading-relaxed">
                      <div>
                        <h4 className="text-xl font-semibold text-primary mb-3">Authentic Cultural Experiences</h4>
                        <p>We create meaningful connections with Egyptian culture:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-2">
                          <li>Supporting traditional artisans and craftspeople</li>
                          <li>Organizing private workshops with master artisans</li>
                          <li>Promoting authentic cuisine prepared by local chefs</li>
                          <li>Facilitating respectful interactions with local communities</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-xl font-semibold text-primary mb-3">Heritage Protection</h4>
                        <p>We actively support cultural heritage preservation:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-2">
                          <li>Contributing to archaeological research and documentation</li>
                          <li>Supporting museums and cultural institutions</li>
                          <li>Promoting traditional arts and music performances</li>
                          <li>Funding educational programs about Egyptian heritage</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-xl font-semibold text-primary mb-3">Respectful Travel Guidelines</h4>
                        <p>We educate our travelers about:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-2">
                          <li>Appropriate dress codes for religious and cultural sites</li>
                          <li>Photography etiquette at sacred locations</li>
                          <li>Respectful interaction with local communities</li>
                          <li>Understanding and appreciating local customs and traditions</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Community Empowerment */}
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  Community Empowerment
                </h2>
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="space-y-6 text-muted-foreground leading-relaxed">
                      <div>
                        <h4 className="text-xl font-semibold text-primary mb-3">Local Economic Support</h4>
                        <p>Our luxury travel experiences prioritize local economic development:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-2">
                          <li>Partnering with locally-owned luxury accommodations</li>
                          <li>Sourcing experiences from local operators and guides</li>
                          <li>Purchasing from local artisans and businesses</li>
                          <li>Supporting restaurants that use local ingredients</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-xl font-semibold text-primary mb-3">Education and Training</h4>
                        <p>We invest in local community development:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-2">
                          <li>Supporting hospitality training programs</li>
                          <li>Funding language education for tourism professionals</li>
                          <li>Providing scholarships for tourism and heritage studies</li>
                          <li>Mentoring young entrepreneurs in the travel industry</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-xl font-semibold text-primary mb-3">Community Projects</h4>
                        <p>A portion of our profits supports:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-2">
                          <li>Educational programs in rural Egyptian communities</li>
                          <li>Healthcare initiatives in underserved areas</li>
                          <li>Infrastructure improvements near tourist destinations</li>
                          <li>Environmental conservation projects</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Ethical Guidelines */}
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  Ethical Travel Guidelines
                </h2>
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="space-y-6 text-muted-foreground leading-relaxed">
                      <div>
                        <h4 className="text-xl font-semibold text-primary mb-3">For Our Travelers</h4>
                        <p>We encourage our guests to:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-2">
                          <li>Respect local customs, traditions, and religious practices</li>
                          <li>Support local businesses and artisans</li>
                          <li>Minimize environmental impact during travels</li>
                          <li>Engage meaningfully with local communities</li>
                          <li>Share their positive experiences responsibly</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-xl font-semibold text-primary mb-3">For Our Partners</h4>
                        <p>We require our luxury partners to:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-2">
                          <li>Maintain fair labor practices and competitive wages</li>
                          <li>Implement environmental sustainability measures</li>
                          <li>Respect local communities and cultural sites</li>
                          <li>Provide excellent service while preserving authenticity</li>
                          <li>Contribute to local economic development</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Measuring Impact */}
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  Measuring Our Impact
                </h2>
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="space-y-6 text-muted-foreground leading-relaxed">
                      <div>
                        <h4 className="text-xl font-semibold text-primary mb-3">Transparency and Accountability</h4>
                        <p>We regularly assess and report on our responsible travel initiatives:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-2">
                          <li>Annual sustainability reports for stakeholders</li>
                          <li>Tracking economic impact on local communities</li>
                          <li>Monitoring environmental conservation contributions</li>
                          <li>Measuring guest satisfaction with responsible travel aspects</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-xl font-semibold text-primary mb-3">Continuous Improvement</h4>
                        <p>We continuously enhance our responsible travel practices:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-2">
                          <li>Regular audits of partner sustainability practices</li>
                          <li>Guest feedback integration into our programs</li>
                          <li>Collaboration with international sustainable tourism organizations</li>
                          <li>Investment in innovative responsible travel solutions</li>
                        </ul>
                      </div>
                      
                      <div className="bg-primary/10 rounded-lg p-4">
                        <p className="font-semibold text-primary">Our goal is to be Egypt's leading example of luxury travel that benefits all stakeholders.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Get Involved */}
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  Travel Responsibly With Us
                </h2>
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="space-y-6 text-muted-foreground leading-relaxed">
                      <div>
                        <h4 className="text-xl font-semibold text-primary mb-3">Make a Difference</h4>
                        <p>When you choose I.LuxuryEgypt, you're not just experiencing luxury - you're contributing to:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-2">
                          <li>Preservation of Egypt's ancient monuments and cultural heritage</li>
                          <li>Economic development of local communities</li>
                          <li>Environmental conservation in the Nile region</li>
                          <li>Education and capacity building for Egyptian youth</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-xl font-semibold text-primary mb-3">Optional Contributions</h4>
                        <p>Guests can make additional voluntary contributions to:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-2">
                          <li>Archaeological preservation projects</li>
                          <li>Local education and healthcare initiatives</li>
                          <li>Environmental restoration programs</li>
                          <li>Artisan and craftsperson support funds</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  Learn More About Our Impact
                </h2>
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="text-muted-foreground leading-relaxed">
                      <p className="mb-4">Want to learn more about our responsible travel initiatives or suggest new ways to make a positive impact? Contact us:</p>
                      <div className="space-y-2">
                        <p><strong>Email:</strong> sustainability@i.luxuryegypt.com</p>
                        <p><strong>Phone:</strong> +20 xxx xxx xxxx</p>
                        <p><strong>Address:</strong> Cairo, Egypt</p>
                      </div>
                      <p className="mt-6 text-sm text-muted-foreground/80">
                        This Responsible Travel Policy was last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
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