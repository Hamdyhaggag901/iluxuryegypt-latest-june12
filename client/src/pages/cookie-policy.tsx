import Navigation from "../components/navigation";
import { useSEO } from "@/hooks/use-seo";
import Footer from "../components/footer";
import ScrollToTopButton from "../components/scroll-to-top-button";
import { Card, CardContent } from "@/components/ui/card";
import { Cookie, Settings, BarChart, Shield } from "lucide-react";

export default function CookiePolicy() {
  useSEO({
    title: "Cookie Policy",
    description: "I.LuxuryEgypt cookie policy. How we use cookies to improve your browsing experience.",
  });

  const cookieTypes = [
    {
      icon: <Shield className="h-6 w-6 text-accent" />,
      title: "Essential Cookies",
      description: "Required for website functionality and security."
    },
    {
      icon: <BarChart className="h-6 w-6 text-accent" />,
      title: "Analytics Cookies",
      description: "Help us understand how visitors use our website."
    },
    {
      icon: <Settings className="h-6 w-6 text-accent" />,
      title: "Functional Cookies",
      description: "Enable enhanced features and personalisation."
    },
    {
      icon: <Cookie className="h-6 w-6 text-accent" />,
      title: "Marketing Cookies",
      description: "Used to deliver relevant luxury travel content."
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
            Cookie Policy
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
            Learn how we use cookies to enhance your luxury travel experience on our website.
          </p>
        </div>
      </section>

      <main>
        {/* Cookie Types Section */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
                Types of Cookies We Use
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                We use different types of cookies to provide you with a personalized and secure browsing experience while planning your luxury Egyptian adventure.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {cookieTypes.map((type, index) => (
                <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-all duration-300 hover-elevate">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                        {type.icon}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-primary mb-3">{type.title}</h3>
                    <p className="text-muted-foreground">{type.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Cookie Details */}
        <section className="py-20 bg-muted">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              
              {/* What Are Cookies */}
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  What Are Cookies?
                </h2>
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="text-muted-foreground leading-relaxed space-y-4">
                      <p>Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.</p>
                      <p>I.LuxuryEgypt uses cookies responsibly to enhance your journey of discovering Egypt's luxury travel opportunities, ensuring you receive relevant information about our bespoke services.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Essential Cookies */}
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  Essential Cookies
                </h2>
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="space-y-6 text-muted-foreground leading-relaxed">
                      <p>These cookies are necessary for our website to function properly and cannot be switched off. They are usually set in response to actions you take, such as:</p>
                      <ul className="list-disc ml-6 space-y-2">
                        <li>Filling in contact forms for luxury travel inquiries</li>
                        <li>Setting privacy preferences</li>
                        <li>Logging into secured areas of our site</li>
                        <li>Security features that prevent fraud</li>
                      </ul>
                      <div className="bg-accent/10 rounded-lg p-4 mt-6">
                        <p className="font-semibold text-primary">These cookies do not store personally identifiable information and are automatically deleted when you close your browser.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Analytics Cookies */}
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  Analytics Cookies
                </h2>
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="space-y-6 text-muted-foreground leading-relaxed">
                      <p>These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. They help us:</p>
                      <ul className="list-disc ml-6 space-y-2">
                        <li>Understand which luxury destinations are most popular</li>
                        <li>See how long visitors spend reading about our services</li>
                        <li>Identify which pages need improvement</li>
                        <li>Measure the effectiveness of our marketing campaigns</li>
                      </ul>
                      <div className="bg-primary/10 rounded-lg p-4 mt-6">
                        <p><strong>Third-party services we use:</strong></p>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                          <li>Google Analytics - to understand website usage patterns</li>
                          <li>Hotjar - to see how users navigate our site (if applicable)</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Functional Cookies */}
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  Functional Cookies
                </h2>
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="space-y-6 text-muted-foreground leading-relaxed">
                      <p>These cookies enable enhanced functionality and personalization. They may be set by us or by third-party providers whose services we use on our pages. They help us:</p>
                      <ul className="list-disc ml-6 space-y-2">
                        <li>Remember your language and region preferences</li>
                        <li>Provide live chat functionality for immediate assistance</li>
                        <li>Embed videos showing Egypt's luxury destinations</li>
                        <li>Remember form information to make inquiries easier</li>
                      </ul>
                      <p>If you do not allow these cookies, some or all of these enhanced features may not function properly.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Marketing Cookies */}
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  Marketing Cookies
                </h2>
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="space-y-6 text-muted-foreground leading-relaxed">
                      <p>These cookies are used to deliver advertisements that are relevant to your interests. They help us:</p>
                      <ul className="list-disc ml-6 space-y-2">
                        <li>Show you luxury travel content that matches your interests</li>
                        <li>Limit the number of times you see the same advertisement</li>
                        <li>Measure the effectiveness of advertising campaigns</li>
                        <li>Provide social media features like sharing buttons</li>
                      </ul>
                      <div className="bg-accent/10 rounded-lg p-4 mt-6">
                        <p><strong>You can opt out of marketing cookies</strong> without affecting the core functionality of our website. Your luxury travel experience will remain uncompromised.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Managing Cookies */}
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  Managing Your Cookie Preferences
                </h2>
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="space-y-6 text-muted-foreground leading-relaxed">
                      <div>
                        <h4 className="text-xl font-semibold text-primary mb-3">Browser Settings</h4>
                        <p>You can control and delete cookies through your browser settings:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-2">
                          <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                          <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                          <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                          <li><strong>Edge:</strong> Settings → Site permissions → Cookies and site data</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-xl font-semibold text-primary mb-3">Cookie Consent</h4>
                        <p>When you first visit our website, we will ask for your consent to use cookies. You can:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-2">
                          <li>Accept all cookies for the full luxury browsing experience</li>
                          <li>Customize your preferences to choose which types of cookies to allow</li>
                          <li>Reject non-essential cookies while keeping core functionality</li>
                          <li>Change your preferences at any time using our cookie preferences center</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-xl font-semibold text-primary mb-3">Third-Party Opt-Outs</h4>
                        <p>You can also opt out of tracking by specific services:</p>
                        <ul className="list-disc ml-6 mt-2 space-y-2">
                          <li><strong>Google Analytics:</strong> <a href="https://tools.google.com/dlpage/gaoptout" className="text-accent hover:underline">Google Analytics Opt-out Browser Add-on</a></li>
                          <li><strong>Social Media:</strong> Adjust privacy settings on Facebook, Twitter, LinkedIn</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Cookie Retention */}
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  How Long We Keep Cookies
                </h2>
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-lg font-semibold text-primary mb-2">Session Cookies</h4>
                          <p>Deleted when you close your browser</p>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-primary mb-2">Persistent Cookies</h4>
                          <p>Stored for up to 24 months, then automatically deleted</p>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-primary mb-2">Analytics Cookies</h4>
                          <p>Retained for 26 months for traffic analysis</p>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-primary mb-2">Marketing Cookies</h4>
                          <p>Vary by provider, typically 30 days to 2 years</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  Questions About Cookies?
                </h2>
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="text-muted-foreground leading-relaxed">
                      <p className="mb-4">If you have any questions about our cookie policy or how we use cookies, please contact us:</p>
                      <div className="space-y-2">
                        <p><strong>Email:</strong> privacy@i.luxuryegypt.com</p>
                        <p><strong>Phone:</strong> +20 xxx xxx xxxx</p>
                        <p><strong>Address:</strong> Cairo, Egypt</p>
                      </div>
                      <p className="mt-6 text-sm text-muted-foreground/80">
                        This Cookie Policy was last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
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