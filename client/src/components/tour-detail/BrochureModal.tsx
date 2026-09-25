import { useState } from "react";
import { Check, Download, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Tour } from "@shared/schema";

const TRAVELLER_TYPES = ["A traveller", "A travel advisor"];

// Matches the server's pattern in server/routes.ts. Both sides check, because
// the inline message is what makes a typo fixable and the server check is what
// makes it true.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

const initialState = { fullName: "", email: "", travellerType: "" };
type FieldErrors = { fullName?: string; email?: string };

export default function BrochureModal({
  tour,
  open,
  onOpenChange,
  onRequestProposal,
}: {
  tour: Tour;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Opens the reserve flow from the confirmation state. */
  onRequestProposal: () => void;
}) {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const { toast } = useToast();

  const set = <K extends keyof typeof initialState>(key: K, value: (typeof initialState)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    // The message clears the moment the field is touched. Leaving it up while
    // somebody is fixing the thing it complains about reads as broken.
    if (key === "fullName" || key === "email") {
      const field = key as keyof FieldErrors;
      setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    }
  };

  const handleClose = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      // Reset after the close animation rather than during it, so the form
      // does not visibly blank out as the dialog fades.
      setTimeout(() => {
        setForm(initialState);
        setErrors({});
        setIsDone(false);
        setIsSubmitting(false);
      }, 200);
    }
  };

  const validate = (): boolean => {
    const next: FieldErrors = {};
    if (form.fullName.trim().length === 0) next.fullName = "Please enter your full name.";
    if (form.email.trim().length === 0) next.email = "Please enter your email address.";
    else if (!EMAIL_PATTERN.test(form.email.trim())) next.email = "That email address does not look right.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/brochure/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.fullName.trim(),
          email: form.email.trim(),
          tourSlug: tour.slug,
          travellerType: form.travellerType || undefined,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        // The server names the field it rejected, so its message lands next to
        // that input rather than in a toast the person has to map back.
        if (result.field === "name") setErrors({ fullName: result.message });
        else if (result.field === "email") setErrors({ email: result.message });
        else toast({ title: "We could not send that", description: result.message, variant: "destructive" });
        return;
      }

      // The download starts without leaving the page: a navigation here would
      // lose the confirmation state, which is the part that converts.
      const link = document.createElement("a");
      link.href = result.url;
      link.download = `${tour.slug}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      setIsDone(true);
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again, or email travel@iluxuryegypt.com.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        aria-describedby={undefined}
        className="w-[95vw] sm:w-[90vw] max-w-[540px] p-0 overflow-hidden flex flex-col gap-0"
      >
        <div className="px-8 pt-8 pb-6 border-b border-border shrink-0">
          <DialogTitle className="text-2xl font-serif font-bold text-primary mb-1">
            {isDone ? "Your journey is downloading" : "Download our journey"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{tour.title}</p>
        </div>

        {isDone ? (
          <div className="p-8 space-y-6" data-testid="brochure-confirmation">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                <Check className="h-5 w-5 text-accent" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-primary">Your journey is downloading</p>
                <p className="text-sm text-muted-foreground">We have emailed a copy as well.</p>
              </div>
            </div>

            {/* The highest intent moment on the page. Somebody who has just
                asked for the itinerary is the likeliest person on this site to
                want dates, and without this the modal closes and that is it. */}
            <div className="pt-6 border-t border-border space-y-3">
              <p className="text-sm text-muted-foreground">
                If you already have dates in mind, we can build this around them.
              </p>
              <Button
                type="button"
                onClick={() => {
                  handleClose(false);
                  onRequestProposal();
                }}
                className="w-full bg-accent hover:bg-accent/90 text-primary font-semibold"
                data-testid="button-request-proposal"
              >
                Request a proposal for these dates
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleClose(false)}
                className="w-full"
                data-testid="button-brochure-close"
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="p-8 space-y-6">
              <div className="space-y-1.5">
                <Label htmlFor="brochure-full-name">Full Name *</Label>
                <Input
                  id="brochure-full-name"
                  value={form.fullName}
                  onChange={(e) => set("fullName", e.target.value)}
                  aria-invalid={Boolean(errors.fullName)}
                  aria-describedby={errors.fullName ? "brochure-full-name-error" : undefined}
                  data-testid="input-brochure-name"
                />
                {errors.fullName && (
                  <p id="brochure-full-name-error" className="text-xs text-destructive" data-testid="error-brochure-name">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="brochure-email">Email *</Label>
                <Input
                  id="brochure-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "brochure-email-error" : undefined}
                  data-testid="input-brochure-email"
                />
                {errors.email && (
                  <p id="brochure-email-error" className="text-xs text-destructive" data-testid="error-brochure-email">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                {/* Optional on purpose. Every required field costs leads, and
                    this one is useful to know rather than necessary. */}
                <Label htmlFor="brochure-traveller-type">Travelling as</Label>
                <Select value={form.travellerType} onValueChange={(v) => set("travellerType", v)}>
                  <SelectTrigger id="brochure-traveller-type" data-testid="select-brochure-traveller-type">
                    <SelectValue placeholder="Optional" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRAVELLER_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <p className="text-xs text-muted-foreground">
                No prices in the PDF, because they move. Reply with your dates and we will send the
                version built around them.
              </p>
            </div>

            <div className="px-8 py-6 border-t border-border shrink-0 flex items-center justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => handleClose(false)} data-testid="button-brochure-cancel">
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-accent hover:bg-accent/90 text-primary font-semibold"
                data-testid="button-brochure-submit"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Preparing
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Download our journey
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
