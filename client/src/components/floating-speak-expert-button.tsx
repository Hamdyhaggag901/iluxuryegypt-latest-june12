import { useState } from "react";
import { Phone } from "lucide-react";
import SpeakToExpertModal from "@/components/speak-to-expert-modal";

export default function FloatingSpeakExpertButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap bg-[#101010] hover:bg-[#101010]/90 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ring-2 ring-accent/60 px-3.5 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-medium"
        aria-label="Speak to an Expert"
        data-testid="button-floating-speak-expert"
      >
        <Phone className="w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0" />
        Speak to an Expert
      </button>

      <SpeakToExpertModal open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
