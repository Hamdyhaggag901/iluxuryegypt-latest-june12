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
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#101010] hover:bg-[#101010]/90 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 ring-2 ring-accent/60"
        aria-label="Speak to an Expert"
        data-testid="button-floating-speak-expert"
      >
        <Phone className="w-6 h-6" />
      </button>

      <SpeakToExpertModal open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
