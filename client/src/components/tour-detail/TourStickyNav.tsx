import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Phone } from "lucide-react";
import SpeakToExpertModal from "@/components/speak-to-expert-modal";
import "./TourStickyNav.css";

export interface TourStickyNavSection {
  id: string;
  label: string;
}

// Fixed site header (Navigation) is h-20 (80px). This bar sits directly
// beneath it once stuck, and anchor jumps need to clear both the header and
// this bar's own height.
const HEADER_HEIGHT = 80;
const SCROLL_OFFSET = 148;

export default function TourStickyNav({
  sections,
  price,
  currency,
}: {
  sections: TourStickyNavSection[];
  price?: number;
  currency?: string;
}) {
  const [visibleSections, setVisibleSections] = useState<TourStickyNavSection[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isStuck, setIsStuck] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  // While true, the scroll-spy observer effect below doesn't even exist — a
  // click already knows definitively which section it's navigating to, so
  // nothing useful can come from the observer until that scroll genuinely
  // settles (see handleTabClick). An earlier version gated this by checking
  // a ref inside the observer's callback instead; live debugging showed the
  // callback consistently read that ref as unset even immediately after the
  // click handler set it, which pointed to a closure/observer-identity issue
  // this project didn't chase further. Gating the observer's *existence* via
  // a state-driven effect dependency sidesteps it entirely: while navigating,
  // no observer is even created, so nothing but the click handler can touch
  // activeId; once settled, a fresh effect run creates a new observer whose
  // own initial callback re-syncs correctly.
  const [isNavigating, setIsNavigating] = useState(false);

  // The nav can only ever show a tab for a section that actually rendered on
  // this specific tour's page — several sections (Gallery, Itinerary, Stays,
  // Why You'll Love This Journey, Read Before You Go, Continue the Journey)
  // return null when that tour has no matching data. Checking the live DOM
  // after mount, instead of re-deriving each component's own condition here,
  // guarantees the tab list can never drift out of sync with what's real.
  useEffect(() => {
    setVisibleSections(sections.filter((s) => document.getElementById(s.id)));
  }, [sections]);

  useEffect(() => {
    if (visibleSections.length === 0 || isNavigating) return;

    // The active section is whichever one's top is the largest value still
    // at or above the sticky offset line — i.e. the section currently
    // occupying the reading position just below the bar. Recomputed live
    // from getBoundingClientRect() for every tracked section on each
    // IntersectionObserver firing, rather than trusting the batched entries'
    // own boundingClientRect: with a handful of thresholds on a page this
    // long, a section not involved in the firing batch can go a long time
    // between callbacks, so its entry.boundingClientRect would be stale by
    // the time another section's crossing triggers a re-evaluation.
    const updateActive = () => {
      let bestId: string | null = null;
      let bestTop = -Infinity;
      for (const s of visibleSections) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= SCROLL_OFFSET + 1 && top > bestTop) {
          bestTop = top;
          bestId = s.id;
        }
      }
      setActiveId(bestId ?? visibleSections[0].id);
    };

    const observer = new IntersectionObserver(updateActive, {
      rootMargin: "0px",
      threshold: [0, 0.01, 0.25, 0.5, 0.75, 1],
    });
    visibleSections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [visibleSections, isNavigating]);

  // Sentinel just above the bar: once it scrolls past the header, the bar
  // has "stuck" — used only to toggle the shadow, sticky positioning itself
  // is plain CSS.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setIsStuck(!entry.isIntersecting), {
      rootMargin: `-${HEADER_HEIGHT + 1}px 0px 0px 0px`,
      threshold: 0,
    });
    observer.observe(el);
    return () => observer.disconnect();
    // The component renders null (no sentinel in the DOM yet) on the very
    // first paint, before visibleSections is populated — this must re-run
    // once that happens so the observer actually attaches to a real node.
  }, [visibleSections]);

  useLayoutEffect(() => {
    if (!activeId) return;
    const tab = tabRefs.current.get(activeId);
    const container = tabsScrollRef.current;
    if (!tab || !container) return;
    setIndicator({ left: tab.offsetLeft, width: tab.offsetWidth });
    // Keep the active tab in view when the strip scrolls horizontally on mobile.
    const tabLeft = tab.offsetLeft;
    const tabRight = tabLeft + tab.offsetWidth;
    if (tabLeft < container.scrollLeft || tabRight > container.scrollLeft + container.clientWidth) {
      container.scrollTo({ left: tabLeft - 24, behavior: "smooth" });
    }
  }, [activeId, visibleSections]);

  const handleTabClick = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    // A click already knows definitively which section it's navigating to —
    // set it immediately (instant feedback) and tear down the scroll-spy
    // observer entirely until the scroll settles (see isNavigating above).
    setIsNavigating(true);
    setActiveId(id);
    const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });

    // Re-assert the clicked id once the scroll genuinely settles: this is a
    // defensive correction in case the freshly (re)created observer's own
    // initial callback fires with a transitional value before the layout has
    // fully caught up.
    const onSettle = () => {
      setActiveId(id);
      setIsNavigating(false);
    };
    window.addEventListener("scrollend", onSettle, { once: true });
    // Fallback for browsers without scrollend support (e.g. older Safari).
    // Calling this twice (scrollend + timeout both firing) is harmless.
    setTimeout(onSettle, 3000);
  };

  if (visibleSections.length === 0) return null;

  const symbol = currency === "USD" ? "$" : currency ? `${currency} ` : "$";
  const formattedPrice = price != null ? new Intl.NumberFormat("en-US").format(price) : null;

  return (
    <>
      <div ref={sentinelRef} />
      <div
        className={`sticky z-30 bg-card/95 backdrop-blur-md border-b border-card-border transition-shadow duration-300 ${
          isStuck ? "shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]" : ""
        }`}
        style={{ top: HEADER_HEIGHT }}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
          <div ref={tabsScrollRef} className="tour-sticky-nav-tabs no-scrollbar relative flex-1 flex overflow-x-auto">
            {indicator && (
              <div
                className="absolute bottom-0 h-[2.5px] bg-accent rounded-full transition-all duration-300 ease-out"
                style={{ left: indicator.left, width: indicator.width }}
              />
            )}
            {visibleSections.map((section) => {
              const active = section.id === activeId;
              return (
                <button
                  key={section.id}
                  ref={(el) => {
                    if (el) tabRefs.current.set(section.id, el);
                    else tabRefs.current.delete(section.id);
                  }}
                  type="button"
                  onClick={() => handleTabClick(section.id)}
                  className={`relative shrink-0 whitespace-nowrap px-4 md:px-5 py-4 text-xs md:text-sm uppercase tracking-wider transition-all duration-300 ${
                    active ? "text-primary font-bold scale-[1.03]" : "text-muted-foreground font-medium hover:text-primary"
                  }`}
                  data-testid={`tab-section-${section.id}`}
                >
                  {section.label}
                </button>
              );
            })}
          </div>

          {formattedPrice && (
            <div className="hidden md:flex items-center gap-3 shrink-0 py-2.5">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                from <span className="font-bold text-accent">{symbol}{formattedPrice}</span>
              </span>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 whitespace-nowrap bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-4 py-2 text-xs font-medium transition-all duration-300 hover:scale-[1.03]"
                data-testid="button-sticky-nav-cta"
              >
                <Phone className="w-3 h-3 shrink-0" />
                Speak to an Expert
              </button>
            </div>
          )}
        </div>
      </div>

      <SpeakToExpertModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
