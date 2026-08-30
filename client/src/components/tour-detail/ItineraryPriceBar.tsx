import { useState } from "react";
import { Phone, Users } from "lucide-react";
import SpeakToExpertModal from "@/components/speak-to-expert-modal";

export default function ItineraryPriceBar({
  tourTitle,
  duration,
  groupSize,
  price,
  currency,
  visible,
}: {
  tourTitle?: string;
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
        <div className="flex items-center gap-5 bg-card/80 backdrop-blur-md border border-card-border/70 rounded-2xl shadow-[0_10px_34px_-6px_rgba(0,0,0,0.18)] pl-6 pr-2.5 py-3">
          <div className="flex flex-col leading-snug">
            {tourTitle && (
              <span className="font-serif font-bold text-primary text-[15px] max-w-[220px] truncate">
                {tourTitle}
              </span>
            )}
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground mt-0.5">
              {duration}
              {groupSize ? (
                <span className="inline-flex items-center gap-1 ml-2">
                  <Users className="h-3 w-3 inline" /> {groupSize}
                </span>
              ) : null}
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              Price guide from{" "}
              <span className="font-bold text-accent text-sm">
                {symbol}
                {formattedPrice}
              </span>{" "}
              PP
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 whitespace-nowrap bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-5 py-3 text-xs sm:text-sm font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.03]"
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
