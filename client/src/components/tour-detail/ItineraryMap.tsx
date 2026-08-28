import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Hotel, Utensils } from "lucide-react";
import type { ItineraryDay } from "@shared/schema";

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

export default function ItineraryMap({ itinerary }: { itinerary: MappedDay[] }) {
  const [activeDay, setActiveDay] = useState<number | null>(itinerary[0]?.day ?? null);
  const dayRefs = useRef<Map<number, HTMLDivElement>>(new Map());

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

  if (itinerary.length === 0) return null;

  return (
    <section className="py-12 md:py-24 bg-background">
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
          <div className="w-full lg:w-1/2 sticky top-20 lg:top-24 z-30 lg:z-auto">
            {bounds ? (
              <div className="h-[110px] lg:h-[calc(100vh-8rem)] rounded-lg lg:rounded-xl overflow-hidden border border-border shadow-md lg:shadow-lg [&_.leaflet-control-zoom]:hidden lg:[&_.leaflet-control-zoom]:block">
                <MapContainer bounds={bounds} boundsOptions={{ padding: [24, 24] }} className="h-full w-full" scrollWheelZoom={false}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Polyline
                    positions={daysWithCoords.map((d) => [d.lat, d.lng])}
                    pathOptions={{ color: PRIMARY_COLOR, weight: 3, opacity: 0.6, dashArray: "6 8" }}
                  />
                  {daysWithCoords.map((d) => (
                    <Marker key={d.day} position={[d.lat, d.lng]} icon={buildDayIcon(d.day === activeDay)} />
                  ))}
                </MapContainer>
              </div>
            ) : (
              <div className="h-[110px] lg:h-[calc(100vh-8rem)] rounded-lg lg:rounded-xl border border-border bg-muted flex items-center justify-center text-muted-foreground text-sm">
                Map coordinates not available for this itinerary
              </div>
            )}
          </div>

          {/* Day list — scrollable */}
          <div className="w-full lg:w-1/2 lg:pl-10 xl:pl-16 space-y-10 md:space-y-16">
            {itinerary.map((day) => (
              <div
                key={day.day}
                data-day={day.day}
                ref={(el) => {
                  if (el) dayRefs.current.set(day.day, el);
                  else dayRefs.current.delete(day.day);
                }}
                className={`transition-opacity duration-300 ${day.day === activeDay ? "opacity-100" : "opacity-60"}`}
              >
                {day.image && (
                  <div className="relative h-56 md:h-72 rounded-lg overflow-hidden mb-5">
                    <img src={day.image} alt={day.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                )}

                <div className="flex items-center gap-3 mb-3">
                  <span className="flex-shrink-0 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-serif text-sm">
                    {day.day}
                  </span>
                  <h3 className="text-lg md:text-2xl font-serif text-primary leading-tight">
                    {day.title}
                  </h3>
                </div>

                {day.description && (
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
                    {day.description}
                  </p>
                )}

                {day.activities.length > 0 && (
                  <ul className="space-y-1.5 md:space-y-2 mb-4">
                    {day.activities.map((activity, idx) => (
                      <li key={idx} className="flex items-start gap-2 md:gap-3 text-sm md:text-base text-muted-foreground">
                        <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                        <span>{activity}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {(day.accommodation || day.meals.length > 0) && (
                  <div className="flex flex-wrap gap-x-6 gap-y-2 pt-3 border-t border-border">
                    {day.accommodation && (
                      <div className="flex items-center gap-2 text-sm text-primary">
                        <Hotel className="h-4 w-4 text-accent" />
                        <span>{day.accommodation}</span>
                      </div>
                    )}
                    {day.meals.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-primary">
                        <Utensils className="h-4 w-4 text-accent" />
                        <span>{day.meals.join(", ")}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
