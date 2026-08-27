import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CountryCodeSelect, DEFAULT_COUNTRY_ISO, getDialCode } from "@/components/phone-country-select";
import StepProgressBar from "@/components/step-progress-bar";
import type { Tour } from "@shared/schema";

const STEP_LABELS = ["Trip Details", "Your Details", "Tell Us More"];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const TITLES = ["Mr", "Mrs", "Ms", "Dr", "Prof", "Lord", "Lady", "Sir"];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = [CURRENT_YEAR, CURRENT_YEAR + 1];

const initialState = {
  adults: 2,
  teens: 0,
  children: 0,
  preferredMonth: "" as string,
  preferredYear: "" as string,
  title: "",
  fullName: "",
  email: "",
  countryIso: DEFAULT_COUNTRY_ISO,
  phone: "",
  bestTimeToReach: "",
  notes: "",
  acceptPrivacy: false,
};

function GuestCounter({
  label,
  sublabel,
  value,
  onChange,
  min = 0,
}: {
  label: string;
  sublabel: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
      <div>
        <p className="text-sm font-medium text-primary">{label}</p>
        <p className="text-xs text-muted-foreground">{sublabel}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-primary disabled:opacity-30 hover:border-accent transition-colors"
          data-testid={`button-decrement-${label.toLowerCase()}`}
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-6 text-center text-sm font-medium">{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-primary hover:border-accent transition-colors"
          data-testid={`button-increment-${label.toLowerCase()}`}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function ReserveJourneyModal({
  tour,
  open,
  onOpenChange,
}: {
  tour: Tour;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const set = <K extends keyof typeof initialState>(key: K, value: (typeof initialState)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleClose = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      setStep(1);
      setForm(initialState);
    }
  };

  const canProceedFromStep2 = form.fullName.trim().length > 0 && form.email.trim().length > 0 && form.phone.trim().length > 0;

  const handleNext = () => {
    if (step === 2 && !canProceedFromStep2) {
      toast({ title: "Please fill in your name, email and phone", variant: "destructive" });
      return;
    }
    setStep((s) => Math.min(3, s + 1));
  };

  const handleSubmit = async () => {
    if (!canProceedFromStep2) {
      setStep(2);
      toast({ title: "Please fill in your name, email and phone", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const preferredDates = [
        form.preferredMonth || "Any month",
        form.preferredYear || "Any year",
      ].join(" ");

      const response = await fetch("/api/tour-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourId: tour.id,
          tourTitle: tour.title,
          tourSlug: tour.slug,
          tourPrice: tour.price,
          tourDuration: tour.duration,
          title: form.title || undefined,
          fullName: form.fullName,
          email: form.email,
          phone: `${getDialCode(form.countryIso)} ${form.phone.trim()}`,
          preferredDates,
          preferredMonth: form.preferredMonth ? MONTHS.indexOf(form.preferredMonth) + 1 : undefined,
          preferredYear: form.preferredYear ? Number(form.preferredYear) : undefined,
          numberOfGuests: form.adults + form.teens + form.children,
          adults: form.adults,
          teens: form.teens,
          children: form.children,
          bestTimeToReach: form.bestTimeToReach || undefined,
          specialRequests: form.notes || undefined,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to send");

      toast({ title: "Request Received", description: "Our travel experts will contact you within 24 hours." });
      handleClose(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Please try again or contact us directly.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const galleryPreview = [tour.heroImage, ...(tour.gallery || [])].slice(0, 3);

  return (
    <Dialog
      open={open}
      onOpenChange={handleClose}
    >
      <DialogContent
        aria-describedby={undefined}
        className="w-[95vw] sm:w-[90vw] max-w-[1400px] p-0 overflow-hidden max-h-[90vh] flex flex-col gap-0"
      >
        {/* Header + progress */}
        <div className="px-8 lg:px-12 pt-8 pb-6 border-b border-border shrink-0">
          <DialogTitle className="text-2xl md:text-3xl font-serif font-bold text-primary mb-1">
            Reserve This Journey
          </DialogTitle>
          <p className="text-sm text-muted-foreground mb-6">{tour.title}</p>
          <StepProgressBar currentStep={step} stepLabels={STEP_LABELS} />
        </div>

        {/* Step content */}
        <div className="overflow-y-auto flex-1">
          {step === 1 && (
            <div className="p-8 lg:p-12 space-y-8">
              {galleryPreview.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {galleryPreview.map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt={`${tour.title} — preview ${idx + 1}`}
                      className="aspect-square rounded-lg object-cover w-full"
                    />
                  ))}
                </div>
              )}

              <div className="border border-border rounded-lg px-4 max-w-xl">
                <GuestCounter label="Adults" sublabel="18+" value={form.adults} onChange={(v) => set("adults", v)} min={1} />
                <GuestCounter label="Teens" sublabel="13-17" value={form.teens} onChange={(v) => set("teens", v)} />
                <GuestCounter label="Children" sublabel="0-12" value={form.children} onChange={(v) => set("children", v)} />
              </div>

              <div className="max-w-xl">
                <p className="text-sm font-medium text-primary mb-2">Preferred Travel Dates</p>
                <div className="grid grid-cols-2 gap-3">
                  <Select value={form.preferredMonth} onValueChange={(v) => set("preferredMonth", v)}>
                    <SelectTrigger data-testid="select-preferred-month">
                      <SelectValue placeholder="Any month" />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTHS.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={form.preferredYear} onValueChange={(v) => set("preferredYear", v)}>
                    <SelectTrigger data-testid="select-preferred-year">
                      <SelectValue placeholder="Any year" />
                    </SelectTrigger>
                    <SelectContent>
                      {YEARS.map((y) => (
                        <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="p-8 lg:p-12 space-y-6 max-w-2xl">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="reserve-title">Title</Label>
                  <Select value={form.title} onValueChange={(v) => set("title", v)}>
                    <SelectTrigger id="reserve-title" data-testid="select-title">
                      <SelectValue placeholder="Optional" />
                    </SelectTrigger>
                    <SelectContent>
                      {TITLES.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5 col-span-2">
                  <Label htmlFor="reserve-full-name">Full Name *</Label>
                  <Input
                    id="reserve-full-name"
                    value={form.fullName}
                    onChange={(e) => set("fullName", e.target.value)}
                    placeholder="John Smith"
                    data-testid="input-full-name"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reserve-email">Email *</Label>
                <Input
                  id="reserve-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="john@example.com"
                  data-testid="input-email"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reserve-phone">Phone *</Label>
                <div className="flex items-center gap-2">
                  <CountryCodeSelect
                    value={form.countryIso}
                    onChange={(iso) => set("countryIso", iso)}
                    testId="select-country-code"
                  />
                  <Input
                    id="reserve-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="555 123 4567"
                    data-testid="input-phone"
                  />
                </div>
              </div>

              <div className="space-y-1.5 max-w-xs">
                <Label htmlFor="reserve-best-time">Best Time to Reach You</Label>
                <Select value={form.bestTimeToReach} onValueChange={(v) => set("bestTimeToReach", v)}>
                  <SelectTrigger id="reserve-best-time" data-testid="select-best-time">
                    <SelectValue placeholder="Any time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Any time">Any time</SelectItem>
                    <SelectItem value="Morning">Morning</SelectItem>
                    <SelectItem value="Afternoon">Afternoon</SelectItem>
                    <SelectItem value="Evening">Evening</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="p-8 lg:p-12 space-y-6 max-w-2xl">
              <div className="space-y-1.5">
                <Label htmlFor="reserve-notes">Tell Us More</Label>
                <Textarea
                  id="reserve-notes"
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value.slice(0, 1000))}
                  placeholder="Any specific requests, celebrations, or questions about this journey?"
                  rows={6}
                  maxLength={1000}
                  data-testid="input-notes"
                />
                <p className="text-xs text-muted-foreground text-right">{form.notes.length}/1000</p>
              </div>

              <div className="flex items-start gap-2">
                <Checkbox
                  id="reserve-privacy"
                  checked={form.acceptPrivacy}
                  onCheckedChange={(checked) => set("acceptPrivacy", checked === true)}
                  data-testid="checkbox-privacy"
                />
                <Label htmlFor="reserve-privacy" className="font-normal cursor-pointer leading-snug">
                  By submitting, you agree to our{" "}
                  <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent">
                    Privacy Policy
                  </a>
                </Label>
              </div>
            </div>
          )}
        </div>

        {/* Footer navigation */}
        <div className="px-8 lg:px-12 py-6 border-t border-border shrink-0 flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            data-testid="button-back"
          >
            Back
          </Button>

          <div className="flex items-center gap-4">
            {step === 3 && (
              <p className="text-xs text-muted-foreground hidden sm:block">
                A member of our team will respond within 24 hours
              </p>
            )}
            {step < 3 ? (
              <Button type="button" onClick={handleNext} className="bg-primary hover:bg-primary/90" data-testid="button-next">
                Next
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-accent hover:bg-accent/90 text-primary font-semibold"
                data-testid="button-submit-reservation"
              >
                {isSubmitting ? "Sending..." : "Reserve This Journey"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
