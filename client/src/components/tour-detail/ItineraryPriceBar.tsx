import { useState } from "react";
import { Phone, Users } from "lucide-react";
import SpeakToExpertModal from "@/components/speak-to-expert-modal";

export default function ItineraryPriceBar({
  duration,
  groupSize,
  price,
  currency,
  visible,
}: {
  duration: string;
  groupSize?: string | null;
  price: number;
  currency: string;
  visible: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const symbol = currency === "USD" ? "$" : `${currency} `;
  const formattedPrice = new Intl.NumberFormat("en-US").format(price);

  return (
    <>
      {/* Desktop-only: the site already has a global floating "Speak to an Expert"
          button (bottom-right) covering this action on mobile, so this itinerary-
          specific price bar only appears at lg+ to avoid two competing CTAs
          crowding the same corner on small screens. */}
      <div
        className={`hidden lg:block fixed bottom-6 left-6 z-40 transition-all duration-300 ${
          visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-4 bg-card border border-card-border rounded-xl shadow-lg pl-5 pr-2 py-2.5">
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {duration}
              {groupSize ? (
                <span className="inline-flex items-center gap-1 ml-2">
                  <Users className="h-3 w-3 inline" /> {groupSize}
                </span>
              ) : null}
            </span>
            <span className="text-sm font-serif text-primary">
              from <span className="font-bold">{symbol}{formattedPrice}</span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 whitespace-nowrap bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg px-4 py-2.5 text-xs sm:text-sm font-medium transition-colors"
            data-testid="button-itinerary-speak-expert"
          >
            <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            Speak to an Expert
          </button>
        </div>
      </div>

      <SpeakToExpertModal open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
