import { Hotel, MapPin, Utensils } from "lucide-react";
import type { ItineraryDay } from "@shared/schema";

export type ItineraryDayCardDay = ItineraryDay & {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: string[];
};

export default function ItineraryDayCard({
  day,
  active,
  isFirst,
}: {
  day: ItineraryDayCardDay;
  active: boolean;
  isFirst: boolean;
}) {
  return (
    <div
      className={`transition-opacity duration-300 ${!isFirst ? "pt-10 md:pt-16 border-t border-border" : ""} ${
        active ? "opacity-100" : "opacity-60"
      }`}
    >
      {day.placeName && (
        <span className="inline-flex items-center gap-1.5 text-[10px] md:text-xs font-bold uppercase tracking-wider text-accent-foreground bg-accent px-3 py-1.5 rounded-full mb-3">
          <MapPin className="h-3 w-3" />
          {day.placeName}
        </span>
      )}

      <div className={`flex flex-col-reverse sm:flex-row sm:items-start gap-5 ${day.image ? "sm:justify-between" : ""}`}>
        <div className="flex-1 min-w-0">
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
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {day.accommodation && (
                <div className="flex items-center gap-2.5 text-sm text-primary">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center">
                    <Hotel className="h-3.5 w-3.5 text-accent" />
                  </span>
                  <span>{day.accommodation}</span>
                </div>
              )}
              {day.meals.length > 0 && (
                <div className="flex items-center gap-2.5 text-sm text-primary">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center">
                    <Utensils className="h-3.5 w-3.5 text-accent" />
                  </span>
                  <span>{day.meals.join(", ")}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {day.image && (
          <div className="w-full sm:w-32 md:w-40 flex-shrink-0">
            <div className="relative aspect-square sm:aspect-[4/5] rounded-lg overflow-hidden">
              <img src={day.image} alt={day.imageAlt?.trim() || day.title} className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
