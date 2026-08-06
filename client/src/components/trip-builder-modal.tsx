import { useState } from "react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Check, CalendarIcon, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import TripTypeChips from "@/components/trip-type-chips";
import { CountryCodeSelect, DEFAULT_COUNTRY_ISO, getDialCode } from "@/components/phone-country-select";

const DESTINATIONS = ["Cairo", "Luxor", "Aswan", "Hurghada", "Sharm El Sheikh", "Alexandria", "Siwa"];
const NIGHT_OPTIONS = ["1-3 nights", "4-6 nights", "7-9 nights", "10-13 nights", "14+ nights"];
const BUDGET_OPTIONS = ["Under $3,000", "$3,000 - $6,000", "$6,000 - $10,000", "$10,000 - $20,000", "$20,000+"];
const BUDGET_FLEXIBILITY_OPTIONS = [
  "Keeping to my budget",
  "For the right trip, I'll increase my budget",
  "Taking the perfect trip",
];
const STEP_LABELS = ["Trip Details", "Travel Style", "Budget", "Contact Info"];

interface TripBuilderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialFormState = {
  destinations: [] as string[],
  travelDate: undefined as Date | undefined,
  isFlexibleDates: false,
  nights: "",
  travelers: 2,
  tripType: "",
  additionalDetails: "",
  budget: "",
  budgetFlexibility: "",
  title: "Mr",
  firstName: "",
  lastName: "",
  countryIso: DEFAULT_COUNTRY_ISO,
  phone: "",
  email: "",
  acceptPrivacy: false,
};

type FormState = typeof initialFormState;

function ProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center" data-testid="trip-builder-progress">
      {STEP_LABELS.map((label, index) => {
        const stepNum = index + 1;
        const isCompleted = stepNum < currentStep;
        const isCurrent = stepNum === currentStep;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold border-2 transition-colors shrink-0",
                  isCompleted || isCurrent
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-background border-border text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : stepNum}
              </div>
              <span
                className={cn(
                  "text-xs font-medium text-center whitespace-nowrap hidden sm:block",
                  isCurrent ? "text-primary" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </div>
            {stepNum < STEP_LABELS.length && (
              <div className={cn("flex-1 h-0.5 mx-2 mb-0 sm:-mb-5 transition-colors", isCompleted ? "bg-accent" : "bg-border")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function TripBuilderModal({ open, onOpenChange }: TripBuilderModalProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleDestination = (destination: string) => {
    setForm((prev) => ({
      ...prev,
      destinations: prev.destinations.includes(destination)
        ? prev.destinations.filter((d) => d !== destination)
        : [...prev.destinations, destination],
    }));
  };

  const resetAndClose = () => {
    setForm(initialFormState);
    setStep(1);
    onOpenChange(false);
  };

  const validateStep = (currentStep: number): string | null => {
    if (currentStep === 1) {
      if (form.destinations.length === 0) {
        return "Please choose at least one destination to continue.";
      }
      if (!form.isFlexibleDates && !form.travelDate) {
        return "Please select a travel date, or check that you're flexible on dates.";
      }
      if (!form.nights) {
        return "Please select the number of nights.";
      }
    }
    if (currentStep === 2) {
      if (!form.tripType) {
        return "Please select the type of journey that interests you.";
      }
    }
    if (currentStep === 3) {
      if (!form.budget) {
        return "Please select a budget range.";
      }
      if (!form.budgetFlexibility) {
        return "Please let us know how flexible your budget is.";
      }
    }
    return null;
  };

  const handleNext = () => {
    const error = validateStep(step);
    if (error) {
      toast({
        title: "Missing information",
        description: error,
        variant: "destructive",
      });
      return;
    }
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFinish = async () => {
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.phone.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in your name, phone number, and email address.",
        variant: "destructive",
      });
      return;
    }

    if (!form.acceptPrivacy) {
      toast({
        title: "Privacy Policy required",
        description: "Please accept the Privacy Policy to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/tour-bookings", {
        tourTitle: form.destinations.length ? `Trip Builder: ${form.destinations.join(", ")}` : "Trip Builder Request",
        fullName: `${form.title} ${form.firstName} ${form.lastName}`.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() ? `${getDialCode(form.countryIso)} ${form.phone.trim()}` : undefined,
        preferredDates: form.isFlexibleDates
          ? "Flexible"
          : form.travelDate
            ? format(form.travelDate, "PPP")
            : undefined,
        numberOfGuests: form.travelers,
        specialRequests: [
          `Destinations: ${form.destinations.join(", ") || "Not specified"}`,
          `Nights: ${form.nights || "Not specified"}`,
          `Trip type: ${form.tripType || "Not specified"}`,
          form.additionalDetails.trim() ? `Additional details: ${form.additionalDetails.trim()}` : null,
          `Budget per person: ${form.budget || "Not specified"}`,
          `Budget flexibility: ${form.budgetFlexibility || "Not specified"}`,
        ]
          .filter(Boolean)
          .join("\n"),
      });

      toast({
        title: "Thank you!",
        description: "Your bespoke trip request has been received. Our specialists will reach out within 24 hours.",
      });
      resetAndClose();
    } catch (error: any) {
      toast({
        title: "Submission Error",
        description: error?.message || "There was an error sending your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setStep(1);
        }
        onOpenChange(next);
      }}
    >
      <DialogContent
        aria-describedby={undefined}
        className="w-[95vw] sm:w-[90vw] max-w-[1400px] p-0 overflow-hidden max-h-[90vh] flex flex-col gap-0"
      >
        {/* Header + progress */}
        <div className="px-8 lg:px-12 pt-8 pb-6 border-b border-border shrink-0">
          <DialogTitle className="text-2xl md:text-3xl font-serif font-bold text-primary mb-6">
            Plan Your Bespoke Egypt Journey
          </DialogTitle>
          <ProgressBar currentStep={step} />
        </div>

        {/* Step content */}
        <div className="overflow-y-auto flex-1">
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr]">
              <img
                src="https://iluxuryegypt.com/api/assets/uploads/1079b196-39ee-4172-ba0b-847d1749503b.webp"
                alt="Egypt luxury travel destination"
                className="hidden md:block h-full min-h-[420px] w-full object-cover"
              />
              <div className="p-8 lg:p-12 space-y-6">
                <div className="space-y-2">
                  <Label>Where would you like to go?</Label>
                  <div className="flex flex-wrap gap-2">
                    {DESTINATIONS.map((destination) => {
                      const isSelected = form.destinations.includes(destination);
                      return (
                        <button
                          key={destination}
                          type="button"
                          onClick={() => toggleDestination(destination)}
                          className={cn(
                            "px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200",
                            isSelected
                              ? "bg-accent text-accent-foreground border-accent shadow-sm"
                              : "border-input bg-background text-muted-foreground hover:border-accent hover:text-accent"
                          )}
                          data-testid={`chip-destination-${destination.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          {destination}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Travel Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={form.isFlexibleDates}
                        className="w-full justify-start text-left font-normal"
                        data-testid="button-travel-date"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {form.travelDate ? format(form.travelDate, "PPP") : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={form.travelDate}
                        onSelect={(date) => updateField("travelDate", date)}
                        disabled={{ before: new Date() }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <div className="flex items-center gap-2 pt-1">
                    <Checkbox
                      id="tb-flexible"
                      checked={form.isFlexibleDates}
                      onCheckedChange={(checked) => updateField("isFlexibleDates", checked === true)}
                      data-testid="checkbox-flexible-dates"
                    />
                    <Label htmlFor="tb-flexible" className="font-normal cursor-pointer">
                      I'm flexible on dates
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tb-nights">Number of Nights</Label>
                  <Select value={form.nights} onValueChange={(v) => updateField("nights", v)}>
                    <SelectTrigger id="tb-nights" data-testid="select-nights">
                      <SelectValue placeholder="Select nights" />
                    </SelectTrigger>
                    <SelectContent>
                      {NIGHT_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Number of Travelers</Label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => updateField("travelers", Math.max(1, form.travelers - 1))}
                      className="flex items-center justify-center w-10 h-10 rounded-full border border-input hover:border-accent hover:text-accent transition-colors disabled:opacity-50"
                      disabled={form.travelers <= 1}
                      data-testid="button-travelers-decrement"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-lg font-semibold text-primary w-8 text-center" data-testid="text-travelers-count">
                      {form.travelers}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateField("travelers", form.travelers + 1)}
                      className="flex items-center justify-center w-10 h-10 rounded-full border border-input hover:border-accent hover:text-accent transition-colors"
                      data-testid="button-travelers-increment"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="p-8 lg:p-12 space-y-6">
              <img
                src="https://iluxuryegypt.com/api/assets/uploads/8f2bb619-ebf9-4ade-8c35-55da12e9399b.webp"
                alt="Egypt travel style"
                className="w-full h-40 md:h-56 rounded-xl object-cover"
              />
              <div className="space-y-2">
                <Label>What type of journey interests you?</Label>
                <TripTypeChips value={form.tripType} onChange={(v) => updateField("tripType", v)} testIdPrefix="chip-builder-trip-type" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tb-details">Tell us more about what you're hoping for</Label>
                <Textarea
                  id="tb-details"
                  rows={5}
                  value={form.additionalDetails}
                  onChange={(e) => updateField("additionalDetails", e.target.value)}
                  data-testid="textarea-additional-details"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="p-8 lg:p-12">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-8">
                <div className="space-y-6 order-2 md:order-1">
                  <div className="space-y-2">
                    <Label htmlFor="tb-budget">Budget per person, for the whole trip</Label>
                    <Select value={form.budget} onValueChange={(v) => updateField("budget", v)}>
                      <SelectTrigger id="tb-budget" data-testid="select-budget">
                        <SelectValue placeholder="Select a budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        {BUDGET_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>How flexible is your budget?</Label>
                    <RadioGroup
                      value={form.budgetFlexibility}
                      onValueChange={(v) => updateField("budgetFlexibility", v)}
                      className="space-y-3"
                    >
                      {BUDGET_FLEXIBILITY_OPTIONS.map((option) => (
                        <div key={option} className="flex items-center gap-2">
                          <RadioGroupItem
                            value={option}
                            id={`tb-budget-flex-${option}`}
                            data-testid={`radio-budget-${option.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                          />
                          <Label htmlFor={`tb-budget-flex-${option}`} className="font-normal cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>

                <img
                  src="https://iluxuryegypt.com/api/assets/uploads/1d4ffc47-d263-41ee-a7a4-f0be83ef9d53.webp"
                  alt="Luxury travel detail"
                  className="order-1 md:order-2 w-full aspect-square md:aspect-auto md:h-56 rounded-xl object-cover"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="p-8 lg:p-12 space-y-6">
              <div className="grid grid-cols-3 gap-3">
                <img
                  src="https://iluxuryegypt.com/api/assets/uploads/32ef96ad-7c53-4204-bda3-06a9865b332b.webp"
                  alt="Egypt travel highlight 1"
                  className="aspect-square rounded-lg object-cover w-full"
                />
                <img
                  src="https://iluxuryegypt.com/api/assets/uploads/ad97288a-ef4c-4074-8b88-57d03c441bbc.webp"
                  alt="Egypt travel highlight 2"
                  className="aspect-square rounded-lg object-cover w-full"
                />
                <img
                  src="https://iluxuryegypt.com/api/assets/uploads/22804d05-02fc-4e28-ae32-25c5e07d64b7.avif"
                  alt="Egypt travel highlight 3"
                  className="aspect-square rounded-lg object-cover w-full"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="tb-title">Title</Label>
                  <Select value={form.title} onValueChange={(v) => updateField("title", v)}>
                    <SelectTrigger id="tb-title" data-testid="select-tb-title">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mr">Mr</SelectItem>
                      <SelectItem value="Mrs">Mrs</SelectItem>
                      <SelectItem value="Ms">Ms</SelectItem>
                      <SelectItem value="Dr">Dr</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tb-first-name">First Name</Label>
                  <Input
                    id="tb-first-name"
                    required
                    value={form.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    data-testid="input-tb-first-name"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tb-last-name">Last Name</Label>
                  <Input
                    id="tb-last-name"
                    required
                    value={form.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    data-testid="input-tb-last-name"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tb-phone">Phone Number</Label>
                <div className="flex items-center gap-2">
                  <CountryCodeSelect
                    value={form.countryIso}
                    onChange={(iso) => updateField("countryIso", iso)}
                    testId="select-tb-country-code"
                  />
                  <Input
                    id="tb-phone"
                    type="tel"
                    required
                    placeholder="1XX XXX XXXX"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    data-testid="input-tb-phone"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tb-email">Email Address</Label>
                <Input
                  id="tb-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  data-testid="input-tb-email"
                />
              </div>

              <div className="flex items-start gap-2">
                <Checkbox
                  id="tb-privacy"
                  checked={form.acceptPrivacy}
                  onCheckedChange={(checked) => updateField("acceptPrivacy", checked === true)}
                  data-testid="checkbox-tb-privacy"
                />
                <Label htmlFor="tb-privacy" className="font-normal cursor-pointer leading-snug">
                  I accept the{" "}
                  <a
                    href="/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-accent"
                  >
                    Privacy Policy
                  </a>
                </Label>
              </div>
            </div>
          )}
        </div>

        {/* Footer navigation */}
        <div className="px-8 lg:px-12 py-6 border-t border-border shrink-0 flex items-center justify-between">
          <Button type="button" variant="outline" onClick={handleBack} disabled={step === 1} data-testid="button-tb-back">
            Back
          </Button>
          {step < 4 ? (
            <Button type="button" onClick={handleNext} data-testid="button-tb-next">
              Next
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleFinish}
              disabled={isSubmitting}
              className="font-semibold tracking-wide uppercase bg-accent hover:bg-accent/90 text-accent-foreground"
              data-testid="button-tb-finish"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Finish
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
