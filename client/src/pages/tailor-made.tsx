import { useState } from "react";
import { useSEO } from "@/hooks/use-seo";
import { useLocation } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  MapPin,
  Compass,
  DollarSign,
  User,
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
  Calendar,
  Users,
  Sparkles,
  Heart,
  Mountain,
  Palmtree,
  Ship,
  Camera,
  Utensils
} from "lucide-react";

const steps = [
  { id: 1, name: "Trip Details", icon: MapPin },
  { id: 2, name: "Travel Style", icon: Compass },
  { id: 3, name: "Budget", icon: DollarSign },
  { id: 4, name: "Contact", icon: User },
];

const travelStyles = [
  { id: "luxury", label: "Ultra Luxury", icon: Sparkles, description: "5-star hotels, private jets, exclusive access" },
  { id: "comfort", label: "Comfort & Style", icon: Heart, description: "Boutique hotels, curated experiences" },
  { id: "adventure", label: "Adventure", icon: Mountain, description: "Active excursions, unique destinations" },
  { id: "cultural", label: "Cultural Immersion", icon: Camera, description: "Local experiences, historical sites" },
  { id: "relaxation", label: "Relaxation", icon: Palmtree, description: "Spa retreats, beach resorts" },
  { id: "cruise", label: "Nile Cruise", icon: Ship, description: "Sailing experiences on the Nile" },
];

const interests = [
  "Ancient History & Archaeology",
  "Temples & Monuments",
  "Desert & Safari",
  "Beach & Red Sea",
  "Culinary Experiences",
  "Photography Tours",
  "Wellness & Spa",
  "Family Activities",
  "Romantic Getaways",
  "Religious & Spiritual",
];


export default function TailorMade() {
  useSEO({
    title: "Tailor-Made Luxury Egypt Tours",
    description: "Create your perfect Egypt journey. Our travel experts craft personalized luxury itineraries tailored to your preferences.",
  });

  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Trip Details
    destinations: [] as string[],
    startDate: "",
    endDate: "",
    travelers: "",

    // Step 2: Travel Style
    travelStyle: "",
    interests: [] as string[],
    pace: "moderate",
    specialRequests: "",

    // Step 3: Budget
    budgetPerPerson: "",
    includeFlights: false,

    // Step 4: Contact
    fullName: "",
    email: "",
    phone: "",
    preferredContact: "email",
    additionalNotes: "",
  });

  const destinations = [
    "Cairo & Giza",
    "Luxor",
    "Aswan",
    "Alexandria",
    "Hurghada",
    "Sharm El Sheikh",
    "Siwa Oasis",
    "Dahab",
    "Abu Simbel",
    "White Desert",
  ];

  const handleDestinationToggle = (dest: string) => {
    setFormData(prev => ({
      ...prev,
      destinations: prev.destinations.includes(dest)
        ? prev.destinations.filter(d => d !== dest)
        : [...prev.destinations, dest]
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Build special requests with all the tailor-made details
      const specialRequests = `
TAILOR-MADE TOUR REQUEST

TRIP DETAILS:
- Destinations: ${formData.destinations.join(", ") || "Not specified"}
- Travel Dates: ${formData.startDate} to ${formData.endDate}
- Number of Travelers: ${formData.travelers}

TRAVEL STYLE:
- Style: ${travelStyles.find(s => s.id === formData.travelStyle)?.label || formData.travelStyle}
- Interests: ${formData.interests.join(", ") || "Not specified"}
- Pace: ${formData.pace}
- Special Requests: ${formData.specialRequests || "None"}

BUDGET:
- Budget Per Person: $${formData.budgetPerPerson || "Not specified"}
- Include Flights: ${formData.includeFlights ? "Yes" : "No"}

ADDITIONAL NOTES:
${formData.additionalNotes || "None"}
`.trim();

      const response = await fetch("/api/tour-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourTitle: "Tailor-Made Tour Request",
          tourSlug: "tailor-made",
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone || undefined,
          preferredDates: `${formData.startDate} to ${formData.endDate}`,
          numberOfGuests: formData.travelers ? parseInt(formData.travelers) : undefined,
          specialRequests: specialRequests,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: "Request Submitted!",
          description: "Our travel specialists will contact you within 24 hours to start crafting your perfect Egyptian adventure.",
        });
        setLocation("/");
      } else {
        throw new Error(data.message || "Failed to submit request");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div>
              <Label className="text-lg font-medium mb-4 block">Where would you like to explore?</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {destinations.map((dest) => (
                  <button
                    key={dest}
                    type="button"
                    onClick={() => handleDestinationToggle(dest)}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                      formData.destinations.includes(dest)
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-gray-200 hover:border-accent/50"
                    }`}
                  >
                    {dest}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="startDate" className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4" />
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="endDate" className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4" />
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="travelers" className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4" />
                Number of Travelers
              </Label>
              <Input
                id="travelers"
                type="number"
                min="1"
                placeholder="e.g., 2"
                value={formData.travelers}
                onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
                className="w-full max-w-xs"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div>
              <Label className="text-lg font-medium mb-4 block">What's your travel style?</Label>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {travelStyles.map((style) => {
                  const Icon = style.icon;
                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, travelStyle: style.id })}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        formData.travelStyle === style.id
                          ? "border-accent bg-accent/10"
                          : "border-gray-200 hover:border-accent/50"
                      }`}
                    >
                      <Icon className={`w-6 h-6 mb-2 ${formData.travelStyle === style.id ? "text-accent" : "text-gray-400"}`} />
                      <h4 className="font-medium">{style.label}</h4>
                      <p className="text-sm text-muted-foreground">{style.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <Label className="text-lg font-medium mb-4 block">What are your interests?</Label>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                      formData.interests.includes(interest)
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-gray-200 hover:border-accent/50"
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-lg font-medium mb-4 block">Preferred pace</Label>
              <div className="flex gap-4">
                {["relaxed", "moderate", "active"].map((pace) => (
                  <button
                    key={pace}
                    type="button"
                    onClick={() => setFormData({ ...formData, pace })}
                    className={`flex-1 p-4 rounded-lg border-2 capitalize transition-all ${
                      formData.pace === pace
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-gray-200 hover:border-accent/50"
                    }`}
                  >
                    {pace}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="specialRequests" className="text-lg font-medium mb-2 block">
                Any special requests or preferences?
              </Label>
              <Textarea
                id="specialRequests"
                placeholder="Tell us about any specific experiences, dietary requirements, accessibility needs, or anything else..."
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                className="min-h-[100px]"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div>
              <Label htmlFor="budgetPerPerson" className="text-lg font-medium mb-4 block">
                What's your budget per person? (USD)
              </Label>
              <div className="max-w-md">
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="budgetPerPerson"
                    type="number"
                    min="0"
                    step="100"
                    placeholder="Enter amount per person"
                    value={formData.budgetPerPerson}
                    onChange={(e) => setFormData({ ...formData, budgetPerPerson: e.target.value })}
                    className="pl-10 text-lg h-14"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  This helps us tailor accommodations and experiences to your preferences.
                </p>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, includeFlights: !formData.includeFlights })}
                className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${
                  formData.includeFlights
                    ? "border-accent bg-accent/10"
                    : "border-gray-200 hover:border-accent/50"
                }`}
              >
                <div className="text-left">
                  <h4 className="font-medium">Include International Flights</h4>
                  <p className="text-sm text-muted-foreground">We can arrange flights to/from Egypt</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  formData.includeFlights ? "border-accent bg-accent" : "border-gray-300"
                }`}>
                  {formData.includeFlights && <Check className="w-4 h-4 text-white" />}
                </div>
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fullName" className="mb-2 block">Full Name *</Label>
                <Input
                  id="fullName"
                  placeholder="Your full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="mb-2 block">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="phone" className="mb-2 block">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <Label className="mb-2 block">Preferred Contact Method</Label>
                <div className="flex gap-4">
                  {["email", "phone", "whatsapp"].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setFormData({ ...formData, preferredContact: method })}
                      className={`flex-1 p-3 rounded-lg border-2 capitalize text-sm transition-all ${
                        formData.preferredContact === method
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-gray-200 hover:border-accent/50"
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="additionalNotes" className="mb-2 block">Additional Notes</Label>
              <Textarea
                id="additionalNotes"
                placeholder="Anything else you'd like us to know..."
                value={formData.additionalNotes}
                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                className="min-h-[100px]"
              />
            </div>

            {/* Summary */}
            <div className="bg-muted p-6 rounded-xl mt-8">
              <h4 className="font-semibold mb-4">Your Trip Summary</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Destinations:</strong> {formData.destinations.join(", ") || "Not selected"}</p>
                <p><strong>Dates:</strong> {formData.startDate && formData.endDate ? `${formData.startDate} to ${formData.endDate}` : "Not specified"}</p>
                <p><strong>Travelers:</strong> {formData.travelers || "Not specified"}</p>
                <p><strong>Style:</strong> {travelStyles.find(s => s.id === formData.travelStyle)?.label || "Not selected"}</p>
                <p><strong>Budget:</strong> {formData.budgetPerPerson ? `$${formData.budgetPerPerson} per person` : "Not specified"}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.destinations.length > 0;
      case 2:
        return formData.travelStyle !== "";
      case 3:
        return formData.budgetPerPerson !== "";
      case 4:
        return formData.fullName !== "" && formData.email !== "";
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-[140px] pb-16 bg-[#e7e1da] relative overflow-hidden">
        <div className="absolute top-1/4 left-8 w-px h-32 bg-gradient-to-b from-transparent via-accent/30 to-transparent" />
        <div className="absolute top-1/3 right-8 w-px h-24 bg-gradient-to-b from-transparent via-accent/20 to-transparent" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-12 h-px bg-accent/40" />
            <span className="text-accent/60 text-xs tracking-[0.4em] uppercase font-light">
              Your Perfect Journey
            </span>
            <div className="w-12 h-px bg-accent/40" />
          </div>

          <h1 className="text-4xl md:text-6xl font-serif font-light text-primary mb-6 tracking-wide">
            Tailor-Made Tour
          </h1>

          <div className="w-20 h-px bg-accent mx-auto mb-8" />

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Let us craft a personalized Egyptian adventure just for you. Tell us your dreams, and we'll make them reality.
          </p>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-8 bg-white border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isCompleted ? "bg-accent text-white" :
                      isActive ? "bg-accent/20 text-accent border-2 border-accent" :
                      "bg-gray-100 text-gray-400"
                    }`}>
                      {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span className={`mt-2 text-xs font-medium ${isActive ? "text-accent" : "text-gray-500"}`}>
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 md:w-24 h-px mx-2 ${
                      currentStep > step.id ? "bg-accent" : "bg-gray-200"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form Content */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-serif font-medium text-primary">
              Step {currentStep}: {steps[currentStep - 1].name}
            </h2>
          </div>

          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-12 pt-8 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            {currentStep < 4 ? (
              <Button
                onClick={nextStep}
                disabled={!canProceed()}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Request
                    <Check className="w-4 h-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
