import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { insertInquirySchema, type InsertInquiry } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function InquiryForm() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

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
      const response = await apiRequest("POST", "/api/inquiries", data);
      return response.json();
    },
    onSuccess: (data) => {
      setIsSubmitted(true);
      form.reset();
      toast({
        title: "Inquiry Submitted Successfully!",
        description: data.message,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Submission Error",
        description: error.message || "There was an error submitting your inquiry. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertInquiry) => {
    submitInquiry.mutate(data);
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

  if (isSubmitted) {
    return (
      <section id="contact" className="py-20 bg-muted" data-testid="inquiry-form-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-xl">
            <CardContent className="p-12 text-center">
              <div className="animate-fade-in">
                <div className="w-16 h-16 mx-auto mb-6 bg-accent rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-accent-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-3xl font-serif font-bold text-primary mb-4">
                  Thank You!
                </h3>
                <p className="text-lg text-muted-foreground mb-8">
                  Your luxury travel inquiry has been received. Our specialists will contact you within 24 hours to begin crafting your bespoke Egyptian journey.
                </p>
                <Button 
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                  data-testid="button-new-inquiry"
                >
                  Submit Another Inquiry
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 bg-muted" data-testid="inquiry-form-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-8">
            Begin Your Journey
          </h2>
        </div>
        
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
                        <FormLabel>Full Name</FormLabel>
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
                        <FormLabel>Email</FormLabel>
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
                        <FormLabel>Destination of Interest</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-destination">
                              <SelectValue placeholder="Select a destination" />
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
                      <FormLabel>Preferred Dates</FormLabel>
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
                      <FormLabel>Special Requests</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your dream Egypt experience..."
                          className="min-h-[120px]"
                          {...field}
                          data-testid="textarea-requests"
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
                    data-testid="button-submit-inquiry"
                  >
                    {submitInquiry.isPending ? "Submitting..." : "Plan My Luxury Journey"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
