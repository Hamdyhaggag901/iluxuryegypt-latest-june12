import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MessageCircle, Loader2, Star } from "lucide-react";
import TripTypeChips from "@/components/trip-type-chips";
import { CountryCodeSelect, DEFAULT_COUNTRY_ISO, getDialCode } from "@/components/phone-country-select";

const BACKGROUND_IMAGE_URL = "https://iluxuryegypt.com/api/assets/uploads/ee366046-f7f3-4c54-a946-878414a60aa0.jpg";
const WHATSAPP_NUMBER = "201121012676";

interface SpeakToExpertModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialFormState = {
  title: "Mr",
  firstName: "",
  lastName: "",
  countryIso: DEFAULT_COUNTRY_ISO,
  phone: "",
  email: "",
  tripType: "",
  message: "",
  acceptPrivacy: false,
  wantsUpdates: false,
};

export default function SpeakToExpertModal({ open, onOpenChange }: SpeakToExpertModalProps) {
  const { toast } = useToast();
  const [form, setForm] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = <K extends keyof typeof initialFormState>(field: K, value: (typeof initialFormState)[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in your name and email address.",
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
        tourTitle: "General Inquiry - Speak to an Expert",
        fullName: `${form.title} ${form.firstName} ${form.lastName}`.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() ? `${getDialCode(form.countryIso)} ${form.phone.trim()}` : undefined,
        specialRequests: [
          form.tripType ? `Trip type: ${form.tripType}` : null,
          form.message.trim() ? `Message: ${form.message.trim()}` : null,
          "Privacy Policy accepted: Yes",
          `Wants marketing updates: ${form.wantsUpdates ? "Yes" : "No"}`,
        ]
          .filter(Boolean)
          .join("\n"),
      });

      toast({
        title: "Thank you!",
        description: "Our luxury travel specialists will contact you within 24 hours.",
      });
      setForm(initialFormState);
      onOpenChange(false);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className="w-[95vw] sm:w-[90vw] max-w-[1400px] p-0 overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-0 max-h-[90vh]"
      >
        {/* Side image */}
        <div className="hidden md:block relative h-full min-h-full">
          <img
            src={BACKGROUND_IMAGE_URL}
            alt="Begin your bespoke Egypt journey"
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
            decoding="async"
          />
        </div>

        {/* Form side */}
        <div className="p-8 lg:p-12 overflow-y-auto max-h-[90vh]">
          <DialogTitle className="text-2xl md:text-3xl font-serif font-bold text-primary mb-2">
            Begin Your Bespoke Egypt
          </DialogTitle>

          <p className="text-sm font-medium text-accent flex items-center gap-1.5 mb-4">
            <Star className="h-3.5 w-3.5 fill-current" />
            125+ Discerning Travelers · 4.9 Client Satisfaction
          </p>

          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
            Tell us about your dream trip, and one of our Egypt specialists will reach out personally — no call centers, no bots.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="ste-title">Title</Label>
                <Select value={form.title} onValueChange={(v) => updateField("title", v)}>
                  <SelectTrigger id="ste-title" data-testid="select-title">
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
              <div className="col-span-1 space-y-1.5">
                <Label htmlFor="ste-first-name">First Name</Label>
                <Input
                  id="ste-first-name"
                  required
                  value={form.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  data-testid="input-first-name"
                />
              </div>
              <div className="col-span-1 space-y-1.5">
                <Label htmlFor="ste-last-name">Last Name</Label>
                <Input
                  id="ste-last-name"
                  required
                  value={form.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  data-testid="input-last-name"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ste-phone">Phone Number</Label>
              <div className="flex items-center gap-2">
                <CountryCodeSelect
                  value={form.countryIso}
                  onChange={(iso) => updateField("countryIso", iso)}
                  testId="select-ste-country-code"
                />
                <Input
                  id="ste-phone"
                  type="tel"
                  placeholder="1XX XXX XXXX"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  data-testid="input-phone"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ste-email">Email Address</Label>
              <Input
                id="ste-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                data-testid="input-email"
              />
            </div>

            <div className="space-y-2">
              <Label>What type of journey interests you?</Label>
              <TripTypeChips value={form.tripType} onChange={(v) => updateField("tripType", v)} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ste-message">Tell us more about your travel plans</Label>
              <Textarea
                id="ste-message"
                rows={4}
                value={form.message}
                onChange={(e) => updateField("message", e.target.value)}
                data-testid="textarea-message"
              />
            </div>

            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-2">
                <Checkbox
                  id="ste-privacy"
                  checked={form.acceptPrivacy}
                  onCheckedChange={(checked) => updateField("acceptPrivacy", checked === true)}
                  data-testid="checkbox-privacy"
                />
                <Label htmlFor="ste-privacy" className="font-normal cursor-pointer leading-snug">
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
              <div className="flex items-start gap-2">
                <Checkbox
                  id="ste-updates"
                  checked={form.wantsUpdates}
                  onCheckedChange={(checked) => updateField("wantsUpdates", checked === true)}
                  data-testid="checkbox-updates"
                />
                <Label htmlFor="ste-updates" className="font-normal cursor-pointer leading-snug">
                  Yes, I would like to receive news and updates
                </Label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-auto py-4 text-base font-semibold tracking-wide uppercase bg-accent hover:bg-accent/90 text-accent-foreground"
              data-testid="button-submit-speak-expert"
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : null}
              Talk to an Egypt Specialist
            </Button>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 text-sm font-medium text-muted-foreground hover:text-accent transition-colors"
              data-testid="link-whatsapp-modal"
            >
              <MessageCircle className="h-4 w-4" />
              Or contact us directly on WhatsApp
            </a>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
