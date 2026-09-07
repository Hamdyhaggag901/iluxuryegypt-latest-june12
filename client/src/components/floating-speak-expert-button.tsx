// 2. client/src/components/floating-speak-expert-button.tsx
import { useState, lazy, Suspense } from "react";
import { Phone } from "lucide-react";

// Lazy loaded: not needed until a visitor clicks the button
const SpeakToExpertModal = lazy(() => import("@/components/speak-to-expert-modal"));

export default function FloatingSpeakExpertButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap bg-accent hover:bg-accent/90 text-accent-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-3.5 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-medium"
        aria-label="Speak to an Expert"
        data-testid="button-floating-speak-expert"
      >
        <Phone className="w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0" />
        Speak to an Expert
      </button>

      {isOpen && (
        <Suspense fallback={null}>
          <SpeakToExpertModal open={isOpen} onOpenChange={setIsOpen} />
        </Suspense>
      )}
    </>
  );
}
