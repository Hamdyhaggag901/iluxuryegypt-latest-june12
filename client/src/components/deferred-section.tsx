import { useEffect, useRef, useState, type ReactNode } from "react";

// Mounts children only once the wrapper scrolls near the viewport, rather
// than on initial render. Used for below-the-fold sections whose mount
// work (data fetching, async chunk loads like testimonial-section.tsx's
// framer-motion domMax import) would otherwise fire immediately on page
// load, competing with the hero image for bandwidth/CPU during the
// LCP-critical window even though the section itself isn't visible yet.
export default function DeferredSection({
  children,
  minHeight,
}: {
  children: ReactNode;
  minHeight?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (shouldRender) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldRender]);

  if (shouldRender) return <>{children}</>;
  return <div ref={ref} aria-hidden="true" style={minHeight ? { minHeight } : undefined} />;
}
