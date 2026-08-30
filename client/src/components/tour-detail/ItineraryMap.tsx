import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./ItineraryMap.css";
import { ArrowUp, RotateCcw } from "lucide-react";
import type { ItineraryDay } from "@shared/schema";
import { buildCurvedRoute } from "@/lib/route-curve";
import ItineraryDayCard from "./ItineraryDayCard";
import ItineraryPriceBar from "./ItineraryPriceBar";

// Matches --primary (Nile Deep Blue) and --accent (Pharaoh Gold) from index.css
const PRIMARY_COLOR = "hsl(220, 26%, 20%)";
const ACCENT_COLOR = "hsl(41, 37%, 60%)";
const INACTIVE_RING = "hsl(220, 18%, 62%)";

// A couple of small, curated line-art glyphs shown next to a handful of
// well-known place names — purely decorative depth, deliberately not a
// full icon set (kept to the two clearest, least-ambiguous matches so the
// map doesn't get busy).
const PYRAMID_SVG = `<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="${PRIMARY_COLOR}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 22 20H2Z"/></svg>`;
const PALM_SVG = `<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="${PRIMARY_COLOR}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22V13"/><path d="M12 13c-3-4-8-3-9-1 2 2 6 2 9 1Z"/><path d="M12 13c3-4 8-3 9-1-2 2-6 2-9 1Z"/><path d="M12 13c-1-4 0-8 2-10-3 0-5 3-5 6"/></svg>`;

function getPlaceGlyph(placeName: string): string | null {
  const key = placeName.toLowerCase();
  if (key.includes("giza") || key.includes("pyramid")) return PYRAMID_SVG;
  if (key.includes("aswan")) return PALM_SVG;
  return null;
}

function buildStopIcon(active: boolean, placeName: string) {
  const outer = active ? 38 : 24;
  const inner = active ? 15 : 9;
  const ringColor = active ? ACCENT_COLOR : INACTIVE_RING;
  const glyph = getPlaceGlyph(placeName);
  const glyphBadge = glyph
    ? `<div style="
        position:absolute; top:-4px; right:-4px; width:16px; height:16px;
        border-radius:9999px; background:white; border:1px solid hsl(var(--card-border));
        display:flex; align-items:center; justify-content:center;
        box-shadow:0 1px 3px rgba(0,0,0,0.2);
      ">${glyph}</div>`
    : "";
  return L.divIcon({
    className: "",
    html: `<div style="position:relative;width:${outer}px;height:${outer}px;">
      <div style="
        width:${outer}px;height:${outer}px;border-radius:9999px;
        display:flex;align-items:center;justify-content:center;
        background:${active ? "hsla(41, 45%, 60%, 0.18)" : "transparent"};
        border:1.5px solid ${ringColor};
        opacity:${active ? 1 : 0.65};
        transition:all 0.3s ease;
      ">
        <div style="
          width:${inner}px;height:${inner}px;border-radius:9999px;
          background:${ringColor};border:1.5px solid white;
          box-shadow:0 2px 6px rgba(0,0,0,0.3);
        "></div>
      </div>
      ${glyphBadge}
    </div>`,
    iconSize: [outer, outer],
    iconAnchor: [outer / 2, outer / 2],
  });
}

// Outline-style plane glyph (matches lucide's stroke aesthetic used
// everywhere else on the site) inside a small white pin, dropped at the
// midpoint of any route segment the itinerary text describes as a flight.
const PLANE_SVG = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="${PRIMARY_COLOR}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate(45deg)"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.4 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.2.6-.6.5-1.1"/></svg>`;

function buildPlaneIcon() {
  const html = `<div style="
    width:21px;height:21px;border-radius:9999px;background:white;
    border:1.5px solid hsl(var(--card-border));display:flex;align-items:center;
    justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.2);
  ">${PLANE_SVG}</div>`;
  return L.divIcon({ className: "", html, iconSize: [21, 21], iconAnchor: [10, 10] });
}

const FLIGHT_PATTERN = /\bfly\b|\bflying\b|\bflight\b/i;

type MappedDay = ItineraryDay & { day: number; title: string; description: string; activities: string[]; meals: string[] };

type Stop = {
  placeName: string;
  lat: number;
  lng: number;
  days: number[];
  hasIncomingFlight: boolean;
};

/** Groups consecutive itinerary days at the same place into one map stop
 * (so a 2-night stay in Cairo gets a single marker with a day range, not two
 * overlapping pins), and flags stops reached by flight based on the day's
 * own text — no separate "transport mode" field exists on itinerary days. */
function buildStops(days: (MappedDay & { lat: number; lng: number })[]): Stop[] {
  const stops: Stop[] = [];
  for (const d of days) {
    const placeName = d.placeName?.trim() || d.title;
    const last = stops[stops.length - 1];
    const text = `${d.title} ${d.description} ${d.activities.join(" ")}`;
    const isFlight = FLIGHT_PATTERN.test(text);

    if (last && last.placeName === placeName) {
      last.days.push(d.day);
    } else {
      stops.push({ placeName, lat: d.lat, lng: d.lng, days: [d.day], hasIncomingFlight: stops.length > 0 && isFlight });
    }
  }
  return stops;
}

export default function ItineraryMap({
  itinerary,
  tourTitle,
  price,
  currency,
  duration,
  groupSize,
}: {
  itinerary: MappedDay[];
  tourTitle?: string;
  price?: number;
  currency?: string;
  duration?: string;
  groupSize?: string | null;
}) {
  const [activeDay, setActiveDay] = useState<number | null>(itinerary[0]?.day ?? null);
  const [sectionVisible, setSectionVisible] = useState(false);
  const dayRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const sectionRef = useRef<HTMLElement>(null);

  const mapRef = useRef<L.Map | null>(null);

  const daysWithCoords = useMemo(
    () => itinerary.filter((d): d is MappedDay & { lat: number; lng: number } => d.lat != null && d.lng != null),
    [itinerary]
  );

  const stops = useMemo(() => buildStops(daysWithCoords), [daysWithCoords]);

  const curvedRoute = useMemo(
    () => buildCurvedRoute(stops.map((s) => [s.lat, s.lng] as [number, number])),
    [stops]
  );

  // Midpoint markers for stops reached by flight, per the itinerary's own text.
  const flightMidpoints = useMemo(
    () =>
      stops
        .map((stop, i) => (stop.hasIncomingFlight ? { stop, prev: stops[i - 1] } : null))
        .filter((x): x is { stop: Stop; prev: Stop } => x !== null)
        .map(({ stop, prev }) => [(stop.lat + prev.lat) / 2, (stop.lng + prev.lng) / 2] as [number, number]),
    [stops]
  );

  const bounds = useMemo(() => {
    if (daysWithCoords.length === 0) return null;
    return L.latLngBounds(daysWithCoords.map((d) => [d.lat, d.lng] as [number, number]));
  }, [daysWithCoords]);

  const resetView = () => {
    if (mapRef.current && bounds) mapRef.current.fitBounds(bounds, { padding: [24, 24] });
  };

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
              <div className="itinerary-map-wrap relative h-[110px] lg:h-[calc(100vh-8rem)] rounded-lg lg:rounded-xl overflow-hidden border border-border shadow-md lg:shadow-lg [&_.leaflet-control-zoom]:hidden lg:[&_.leaflet-control-zoom]:block">
                <MapContainer
                  ref={mapRef}
                  bounds={bounds}
                  boundsOptions={{ padding: [24, 24] }}
                  className="h-full w-full"
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
                  />
                  {/* Soft glow layer beneath the main dashed line, plus a slow
                      marching-dash animation on top — a lightweight stand-in
                      for a single travelling light, CSS-driven (see
                      ItineraryMap.css). react-leaflet's pathOptions only
                      reaches Leaflet's setStyle() (color/weight/dashArray),
                      not the path's className (only read at DOM-creation
                      time internally) — so the animation class is added
                      imperatively via the layer ref instead. */}
                  <Polyline
                    positions={curvedRoute}
                    pathOptions={{ color: ACCENT_COLOR, weight: 6, opacity: 0.15, lineCap: "round" }}
                  />
                  <Polyline
                    ref={(layer) => layer?.getElement()?.classList.add("itinerary-route-glow")}
                    positions={curvedRoute}
                    pathOptions={{
                      color: ACCENT_COLOR,
                      weight: 2.5,
                      opacity: 0.85,
                      dashArray: "1 11",
                      lineCap: "round",
                    }}
                  />
                  {flightMidpoints.map((pos, i) => (
                    <Marker key={`flight-${i}`} position={pos} icon={buildPlaneIcon()} />
                  ))}
                  {stops.map((stop) => {
                    const active = stop.days.includes(activeDay ?? -1);
                    const dayLabel = stop.days.length > 1 ? `Days ${stop.days[0]}–${stop.days[stop.days.length - 1]}` : `Day ${stop.days[0]}`;
                    return (
                      <Marker
                        key={`${stop.placeName}-${stop.days[0]}`}
                        position={[stop.lat, stop.lng]}
                        icon={buildStopIcon(active, stop.placeName)}
                      >
                        <Tooltip className="itinerary-city-tooltip" direction="top" offset={[0, -16]} opacity={1}>
                          <span className="font-semibold">{stop.placeName}</span> — {dayLabel}
                        </Tooltip>
                      </Marker>
                    );
                  })}
                </MapContainer>

                <div className="hidden lg:flex flex-col gap-2 absolute top-3 right-3 z-[400]">
                  <button
                    type="button"
                    onClick={scrollToTop}
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-card/95 border border-card-border shadow-md text-primary hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors"
                    aria-label="Back to top"
                    data-testid="button-itinerary-back-to-top"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={resetView}
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-card/95 border border-card-border shadow-md text-primary hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors"
                    aria-label="Reset map view"
                    data-testid="button-itinerary-reset-view"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
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
        tourTitle={tourTitle}
        duration={duration ?? (itinerary.length > 0 ? `${itinerary.length} Days` : "")}
        groupSize={groupSize}
        price={price ?? 0}
        currency={currency ?? "USD"}
        visible={sectionVisible && price != null}
      />
    </section>
  );
}
