import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const scrollSentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // A Chrome trace (Tracing.start with the devtools.timeline.stack
    // category) pinned a forced-reflow Layout event to this same pattern in
    // Navigation's scroll listener — reading scrollTop/scrollY forces a
    // synchronous layout recalc whenever anything else has already dirtied
    // layout earlier in the same frame, and rAF-throttling (still visible
    // in git history) only cuts the frequency, not that root cause.
    //
    // IntersectionObserver never reads geometry synchronously, so it
    // sidesteps the problem instead of racing it. The sentinel below sits
    // 300px into the document (matching the old `scrolled > 300`
    // threshold) — isVisible flips exactly when it scrolls out of view.
    const sentinel = scrollSentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(!entry.isIntersecting));
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div ref={scrollSentinelRef} aria-hidden="true" style={{ position: "absolute", top: 300, left: 0, height: 1, width: 1, pointerEvents: "none" }} />
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
    </>
  );
}
