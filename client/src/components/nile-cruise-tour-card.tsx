import { Link } from "wouter";
import { Ship, Users, CalendarDays } from "lucide-react";
import { openLinkInNewTab } from "@/lib/open-in-new-tab";
import type { TourCardProps } from "@/components/tour-card";

function shipType(category: string) {
  if (/dahabiya/i.test(category)) return "Dahabiya";
  if (/deluxe/i.test(category)) return "Deluxe";
  if (/luxury/i.test(category)) return "Luxury";
  return "Nile Cruise";
}

export default function NileCruiseTourCard({
  image,
  category,
  title,
  days,
  guests,
  itinerary,
  price,
  currency = "USD",
  link,
  openInNewTab = false,
}: TourCardProps) {
  const symbol = currency === "USD" ? "$" : `${currency} `;
  const hasPrice = typeof price === "number" && price > 0;
  const route =
    itinerary.length > 1
      ? `${itinerary[0]} ↔ ${itinerary[itinerary.length - 1]}`
      : itinerary[0] || "";

  return (
    <Link
      href={link}
      data-testid={`card-nile-${link}`}
      {...(openInNewTab
        ? { target: "_blank", rel: "noopener noreferrer", onClick: openLinkInNewTab }
        : {})}
    >
      <article className="group h-full flex flex-col cursor-pointer bg-card border border-card-border rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <span className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm text-primary text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full">
            {shipType(category)}
          </span>
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="w-8 h-px bg-accent mb-3" />
            <h3 className="font-serif text-xl md:text-2xl font-bold text-white leading-snug line-clamp-2">
              {title}
            </h3>
            {route && (
              <p className="text-white/80 text-xs md:text-sm mt-1 tracking-wide">
                {route}
              </p>
            )}
          </div>
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            {days && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-accent-text" /> {days}
              </span>
            )}
            {guests && (
              <span className="inline-flex items-center gap-1.5">
                <Users className="w-4 h-4 text-accent-text" /> {guests}
              </span>
            )}
            {itinerary.length > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <Ship className="w-4 h-4 text-accent-text" /> {itinerary.length} stops
              </span>
            )}
          </div>

          <hr className="border-t border-border my-4" />

          <div className="mt-auto flex items-end justify-between gap-3">
            <div>
              {hasPrice ? (
                <>
                  <span className="text-[11px] text-muted-foreground block">From</span>
                  <span className="font-serif text-lg font-bold text-primary">
                    {symbol}
                    {price.toLocaleString()}
                    <span className="font-sans text-xs font-normal text-muted-foreground">
                      {" "}per person
                    </span>
                  </span>
                </>
              ) : (
                <span className="font-serif text-base font-bold text-primary">
                  Price on request
                </span>
              )}
            </div>
            <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wide px-4 py-2 rounded-full border border-primary/40 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary">
              View Ship
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
