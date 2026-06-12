import { useState } from "react";
import { useSEO } from "@/hooks/use-seo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { insertInquirySchema, type InsertInquiry } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { MapPin, Mail, Phone, Clock } from "lucide-react";
import Navigation from "../components/navigation";
import AnnouncementBar from "../components/announcement-bar";
import Footer from "../components/footer";
import ScrollToTopButton from "../components/scroll-to-top-button";

interface ContactPageContent {
  heroTitle: string;
  heroSubtitle: string;
  getInTouchTitle: string;
  getInTouchSubtitle: string;
  locationTitle: string;
  locationDetails: string[];
  emailTitle: string;
  emailDetails: string[];
  phoneTitle: string;
  phoneDetails: string[];
  hoursTitle: string;
  hoursDetails: string[];
  whyChooseTitle: string;
  whyChooseItems: {
    title: string;
    description: string;
  }[];
}

// Default content for fallback
const defaultContent: ContactPageContent = {
  heroTitle: "Contact Us",
  heroSubtitle: "Ready to embark on your luxury Egyptian adventure? Our specialists are here to craft your perfect journey.",
  getInTouchTitle: "Get In Touch",
  getInTouchSubtitle: "Whether you're planning your dream vacation or have questions about our services, we're here to help.",
  locationTitle: "Our Location",
  locationDetails: ["Cairo, Egypt", "Serving all of Egypt"],
  emailTitle: "Email Us",
  emailDetails: ["concierge@i.luxuryegypt.com", "info@i.luxuryegypt.com"],
  phoneTitle: "Call Us",
  phoneDetails: ["+20 xxx xxx xxxx", "+20 xxx xxx xxxx"],
  hoursTitle: "Business Hours",
  hoursDetails: ["24/7 Concierge Service", "Sunday - Thursday: 9AM - 6PM"],
  whyChooseTitle: "Why Choose I.LuxuryEgypt?",
  whyChooseItems: [
    { title: "Bespoke Experiences", description: "Every journey is uniquely crafted to your personal preferences and interests." },
    { title: "24/7 Concierge", description: "Round-the-clock support from our dedicated luxury travel specialists." },
    { title: "Expert Knowledge", description: "Deep local expertise and exclusive access to Egypt's hidden treasures." },
  ],
};

export default function Contact() {
  useSEO({
    title: "Contact Us - Luxury Egypt Travel",
    description: "Get in touch with I.LuxuryEgypt. Plan your bespoke luxury Egypt vacation with our expert travel consultants.",
  });

  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fetch contact page content from CMS
  const { data: pageData } = useQuery<{ success: boolean; content: ContactPageContent | null }>({
    queryKey: ["/api/public/contact-page"],
    queryFn: async () => {
      const response = await fetch("/api/public/contact-page");
      if (!response.ok) throw new Error("Failed to fetch contact page content");
      return response.json();
    },
  });

  const content = pageData?.content || defaultContent;

  const form = useForm<InsertInquiry>({
    resolver: zodResolver(insertInquirySchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      destination: "",
      preferredDates: "",
      specialRequests: "",
    },
  });

  const submitInquiry = useMutation({
    mutationFn: async (data: InsertInquiry) => {
      return await apiRequest("POST", "/api/inquiries", data);
    },
    onSuccess: (data) => {
      setIsSubmitted(true);
      toast({
        title: "Message Sent Successfully!",
        description: data.message || "Thank you for contacting us. We'll get back to you within 24 hours.",
      });
      setTimeout(() => {
        form.reset();
      }, 100);
    },
    onError: (error: any) => {
      toast({
        title: "Submission Error",
        description: error.message || "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertInquiry) => {
    submitInquiry.mutate(data);
  };

  const handleSendAnother = () => {
    form.reset();
    setIsSubmitted(false);
  };

  const destinations = [
    { value: "alexandria", label: "Alexandria" },
    { value: "aswan", label: "Aswan" },
    { value: "cairo", label: "Cairo" },
    { value: "giza", label: "Giza" },
    { value: "hurghada", label: "Hurghada" },
    { value: "luxor", label: "Luxor" },
    { value: "sharm-el-sheikh", label: "Sharm El-Sheikh" },
    { value: "siwa-oasis", label: "Siwa Oasis" },
    { value: "dahab", label: "Dahab" },
    { value: "custom", label: "Custom Itinerary" },
    { value: "general", label: "General Inquiry" },
  ];

  const contactInfo = [
    {
      icon: <MapPin className="h-6 w-6 text-accent" />,
      title: content.locationTitle,
      details: content.locationDetails,
    },
    {
      icon: <Mail className="h-6 w-6 text-accent" />,
      title: content.emailTitle,
      details: content.emailDetails,
    },
    {
      icon: <Phone className="h-6 w-6 text-accent" />,
      title: content.phoneTitle,
      details: content.phoneDetails,
    },
    {
      icon: <Clock className="h-6 w-6 text-accent" />,
      title: content.hoursTitle,
      details: content.hoursDetails,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 md:pt-40 pb-16 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary-foreground mb-6 animate-fade-in">
            {content.heroTitle}
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
            {content.heroSubtitle}
          </p>
        </div>
      </section>

      <main>
        {/* Contact Information Cards */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
                {content.getInTouchTitle}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {content.getInTouchSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
              {contactInfo.map((info, index) => (
                <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-all duration-300 hover-elevate">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                        {info.icon}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-primary mb-3">{info.title}</h3>
                    <div className="space-y-1">
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-muted-foreground">{detail}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-20 bg-muted" data-testid="contact-form-section">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-8">
                Send Us a Message
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Fill out the form below and our luxury travel specialists will respond within 24 hours.
              </p>
            </div>

            {isSubmitted ? (
              <Card className="shadow-xl">
                <CardContent className="p-12 text-center">
                  <div className="animate-fade-in">
                    <div className="w-16 h-16 mx-auto mb-6 bg-accent rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-accent-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-3xl font-serif font-bold text-primary mb-4">
                      Message Sent!
                    </h3>
                    <p className="text-lg text-muted-foreground mb-8">
                      Thank you for contacting I.LuxuryEgypt. Our team will respond to your inquiry within 24 hours.
                    </p>
                    <Button 
                      onClick={handleSendAnother}
                      variant="outline"
                      data-testid="button-send-another"
                    >
                      Send Another Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-xl">
                <CardContent className="p-8 md:p-12">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your full name"
                                  {...field}
                                  data-testid="input-full-name"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address *</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="Enter your email address"
                                  {...field}
                                  data-testid="input-email"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input
                                  type="tel"
                                  placeholder="Enter your phone number"
                                  {...field}
                                  data-testid="input-phone"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="destination"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Inquiry Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-inquiry-type">
                                    <SelectValue placeholder="Select inquiry type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {destinations.map((destination) => (
                                    <SelectItem key={destination.value} value={destination.value}>
                                      {destination.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="preferredDates"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Travel Dates (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., March 15-25, 2024"
                                {...field}
                                data-testid="input-dates"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="specialRequests"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Message *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us about your dream Egypt experience or ask us any questions..."
                                className="min-h-[120px]"
                                {...field}
                                data-testid="textarea-message"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="text-center">
                        <Button
                          type="submit"
                          size="lg"
                          disabled={submitInquiry.isPending}
                          className="px-8 py-4 text-lg font-medium"
                          data-testid="button-send-message"
                        >
                          {submitInquiry.isPending ? "Sending..." : "Send Message"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
                {content.whyChooseTitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {content.whyChooseItems.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-accent/10 rounded-full flex items-center justify-center">
                    {index === 0 && (
                      <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    )}
                    {index === 1 && (
                      <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {index === 2 && (
                      <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
}