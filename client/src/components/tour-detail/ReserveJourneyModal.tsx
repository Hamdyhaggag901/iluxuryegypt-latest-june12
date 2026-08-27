import { useState } from "react";
import { Link } from "wouter";
import { Minus, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Tour } from "@shared/schema";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const TITLES = ["Mr", "Mrs", "Ms", "Dr", "Prof", "Lord", "Lady", "Sir"];

const COUNTRY_CODES = [
  { code: "+1", label: "United States (+1)" },
  { code: "+44", label: "United Kingdom (+44)" },
  { code: "+20", label: "Egypt (+20)" },
  { code: "+971", label: "United Arab Emirates (+971)" },
  { code: "+966", label: "Saudi Arabia (+966)" },
  { code: "+974", label: "Qatar (+974)" },
  { code: "+973", label: "Bahrain (+973)" },
  { code: "+965", label: "Kuwait (+965)" },
  { code: "+61", label: "Australia (+61)" },
  { code: "+49", label: "Germany (+49)" },
  { code: "+33", label: "France (+33)" },
  { code: "+39", label: "Italy (+39)" },
  { code: "+34", label: "Spain (+34)" },
  { code: "+31", label: "Netherlands (+31)" },
  { code: "+41", label: "Switzerland (+41)" },
];

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
  countryCode: "+1",
  phone: "",
  bestTimeToReach: "",
  notes: "",
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
          phone: `${form.countryCode} ${form.phone}`,
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-primary">Reserve This Journey</DialogTitle>
          <DialogDescription>{tour.title}</DialogDescription>
        </DialogHeader>

        {/* Progress */}
        <div className="mb-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Step {step} of 3</p>
          <div className="flex gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${s <= step ? "bg-accent" : "bg-border"}`}
              />
            ))}
          </div>
        </div>

        {/* Step 1 — Trip Details */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="border border-border rounded-lg px-4">
              <GuestCounter label="Adults" sublabel="18+" value={form.adults} onChange={(v) => set("adults", v)} min={1} />
              <GuestCounter label="Teens" sublabel="13-17" value={form.teens} onChange={(v) => set("teens", v)} />
              <GuestCounter label="Children" sublabel="0-12" value={form.children} onChange={(v) => set("children", v)} />
            </div>

            <div>
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

        {/* Step 2 — Your Details */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">Title</label>
              <Select value={form.title} onValueChange={(v) => set("title", v)}>
                <SelectTrigger data-testid="select-title">
                  <SelectValue placeholder="Optional" />
                </SelectTrigger>
                <SelectContent>
                  {TITLES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">Full Name *</label>
              <Input
                value={form.fullName}
                onChange={(e) => set("fullName", e.target.value)}
                placeholder="John Smith"
                data-testid="input-full-name"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">Email *</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="john@example.com"
                data-testid="input-email"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">Phone *</label>
              <div className="flex gap-2">
                <Select value={form.countryCode} onValueChange={(v) => set("countryCode", v)}>
                  <SelectTrigger className="w-32 flex-shrink-0" data-testid="select-country-code">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRY_CODES.map((c) => (
                      <SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="555 123 4567"
                  data-testid="input-phone"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">Best Time to Reach You</label>
              <Select value={form.bestTimeToReach} onValueChange={(v) => set("bestTimeToReach", v)}>
                <SelectTrigger data-testid="select-best-time">
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

        {/* Step 3 — Tell Us More */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                Tell Us More
              </label>
              <Textarea
                value={form.notes}
                onChange={(e) => set("notes", e.target.value.slice(0, 1000))}
                placeholder="Any specific requests, celebrations, or questions about this journey?"
                rows={5}
                maxLength={1000}
                data-testid="input-notes"
              />
              <p className="text-xs text-muted-foreground text-right mt-1">{form.notes.length}/1000</p>
            </div>

            <p className="text-xs text-muted-foreground">
              By submitting, you agree to our{" "}
              <Link href="/privacy-policy" className="underline hover:text-accent">Privacy Policy</Link>.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-border mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            data-testid="button-back"
          >
            Back
          </Button>

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

        {step === 3 && (
          <p className="text-xs text-center text-muted-foreground">
            A member of our team will respond within 24 hours
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
