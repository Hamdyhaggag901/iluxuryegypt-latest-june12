import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrolled = document.documentElement.scrollTop || document.body.scrollTop;
      setIsVisible(scrolled > 300);
    };

    // Check on mount
    toggleVisibility();

    // Same unthrottled-scroll-handler pattern a Chrome trace pinned a
    // forced-reflow Layout event to in Navigation's own scroll listener
    // (see the comment there) — this button is also fixed-position and
    // restyles (opacity/translate) on every scroll tick without this.
    // requestAnimationFrame coalesces it to at most once per frame.
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        toggleVisibility();
        ticking = false;
      });
    };

    // A duplicate document.addEventListener alongside this one used to
    // fire the same handler twice per scroll event for no benefit (window
    // scroll events already bubble/are observable at both targets).
    // passive: true avoids blocking the compositor's scroll-driven work.
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Button
      onClick={scrollToTop}
      size="icon"
      className={`fixed bottom-24 right-6 z-[9999] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary text-primary-foreground hover:bg-primary/90 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      data-testid="button-scroll-to-top"
      aria-label="Scroll to top"
      style={{
        position: 'fixed',
        bottom: '6rem',
        right: '1.5rem',
        zIndex: 9999
      }}
    >
      <ChevronUp className="h-5 w-5" />
    </Button>
  );
}
