import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ArrowUp } from "lucide-react";
import type { ItineraryDay } from "@shared/schema";
import ItineraryDayCard from "./ItineraryDayCard";
import ItineraryPriceBar from "./ItineraryPriceBar";

// Matches --primary (Nile Deep Blue) and --accent (Pharaoh Gold) from index.css
const PRIMARY_COLOR = "hsl(220, 26%, 20%)";
const ACCENT_COLOR = "hsl(41, 37%, 60%)";

function buildDayIcon(active: boolean) {
  const size = active ? 34 : 22;
  const bg = active ? ACCENT_COLOR : PRIMARY_COLOR;
  return L.divIcon({
    className: "",
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:9999px;
      background:${bg};border:2px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,0.35);
      transition:all 0.25s ease;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

type MappedDay = ItineraryDay & { day: number; title: string; description: string; activities: string[]; meals: string[] };

export default function ItineraryMap({
  itinerary,
  price,
  currency,
  duration,
  groupSize,
}: {
  itinerary: MappedDay[];
  price?: number;
  currency?: string;
  duration?: string;
  groupSize?: string | null;
}) {
  const [activeDay, setActiveDay] = useState<number | null>(itinerary[0]?.day ?? null);
  const [sectionVisible, setSectionVisible] = useState(false);
  const dayRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const sectionRef = useRef<HTMLElement>(null);

  const daysWithCoords = useMemo(
    () => itinerary.filter((d): d is MappedDay & { lat: number; lng: number } => d.lat != null && d.lng != null),
    [itinerary]
  );

  const bounds = useMemo(() => {
    if (daysWithCoords.length === 0) return null;
    return L.latLngBounds(daysWithCoords.map((d) => [d.lat, d.lng] as [number, number]));
  }, [daysWithCoords]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const day = Number(entry.target.getAttribute("data-day"));
            if (!Number.isNaN(day)) setActiveDay(day);
          }
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );

    dayRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [itinerary]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setSectionVisible(entry.isIntersecting), {
      threshold: 0.1,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (itinerary.length === 0) return null;

  return (
    <section ref={sectionRef} className="py-12 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8 md:mb-16">
          <div className="w-12 md:w-16 h-px bg-accent mx-auto mb-4 md:mb-6"></div>
          <span className="text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase text-accent">
            Day By Day
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-light text-primary mt-3 md:mt-4">
            Your Journey Across Egypt
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-0 lg:items-start">
          {/* Map — a small sticky bar on mobile so it stays visible while scrolling the day
              list; a full-height sticky column on desktop (lg:) as before. */}
          <div className="w-full lg:w-[42%] sticky top-20 lg:top-24 z-30 lg:z-auto">
            {bounds ? (
              <div className="relative h-[110px] lg:h-[calc(100vh-8rem)] rounded-lg lg:rounded-xl overflow-hidden border border-border shadow-md lg:shadow-lg [&_.leaflet-control-zoom]:hidden lg:[&_.leaflet-control-zoom]:block">
                <MapContainer bounds={bounds} boundsOptions={{ padding: [24, 24] }} className="h-full w-full" scrollWheelZoom={false}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Polyline
                    positions={daysWithCoords.map((d) => [d.lat, d.lng])}
                    pathOptions={{ color: PRIMARY_COLOR, weight: 2.5, opacity: 0.7, dashArray: "1 9", lineCap: "round" }}
                  />
                  {daysWithCoords.map((d) => (
                    <Marker key={d.day} position={[d.lat, d.lng]} icon={buildDayIcon(d.day === activeDay)} />
                  ))}
                </MapContainer>

                <button
                  type="button"
                  onClick={scrollToTop}
                  className="hidden lg:flex absolute top-3 right-3 z-[400] items-center justify-center w-9 h-9 rounded-full bg-card/95 border border-card-border shadow-md text-primary hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors"
                  aria-label="Back to top"
                  data-testid="button-itinerary-back-to-top"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="h-[110px] lg:h-[calc(100vh-8rem)] rounded-lg lg:rounded-xl border border-border bg-muted flex items-center justify-center text-muted-foreground text-sm">
                Map coordinates not available for this itinerary
              </div>
            )}
          </div>

          {/* Day list — scrollable */}
          <div className="w-full lg:w-[58%] lg:pl-10 xl:pl-16 space-y-10 md:space-y-0">
            {itinerary.map((day, index) => (
              <div
                key={day.day}
                data-day={day.day}
                ref={(el) => {
                  if (el) dayRefs.current.set(day.day, el);
                  else dayRefs.current.delete(day.day);
                }}
              >
                <ItineraryDayCard day={day} active={day.day === activeDay} isFirst={index === 0} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <ItineraryPriceBar
        duration={duration ?? (itinerary.length > 0 ? `${itinerary.length} Days` : "")}
        groupSize={groupSize}
        price={price ?? 0}
        currency={currency ?? "USD"}
        visible={sectionVisible && price != null}
      />
    </section>
  );
}
