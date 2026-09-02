import { Link } from "wouter";
import { openLinkInNewTab } from "@/lib/open-in-new-tab";

export interface TourCardProps {
  image: string;
  category: string;
  /** Shown as a pill over the top-right of the image. Omit for no badge. */
  badge?: "NEW" | "OFFER" | null;
  title: string;
  /** e.g. "2026 - 2027". Omit to hide the line entirely. */
  years?: string;
  /** Pre-formatted duration text, e.g. "7 Days" or "Full Day (8 hours)". */
  days: string;
  /** Pre-formatted group size text, e.g. "12 Guests" or "2-12 People". Omit to hide. */
  guests?: string;
  /** City/stop names, rendered joined with " • ". */
  itinerary: string[];
  price: number;
  currency?: string;
  link: string;
  /** Opens the card's link in a new tab instead of navigating away — used
   *  where the card sits on a page the visitor is likely still using (e.g.
   *  a "you might also like" carousel), off by default everywhere else. */
  openInNewTab?: boolean;
}

export default function TourCard({
  image,
  category,
  badge,
  title,
  years,
  days,
  guests,
  itinerary,
  price,
  currency = "USD",
  link,
  openInNewTab = false,
}: TourCardProps) {
  const currencySymbol = currency === "USD" ? "$" : `${currency} `;

  return (
    <Link
      href={link}
      data-testid={`card-tour-${link}`}
      {...(openInNewTab ? { target: "_blank", rel: "noopener noreferrer", onClick: openLinkInNewTab } : {})}
    >
      <article className="group h-full flex flex-col cursor-pointer bg-card border border-card-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Cover image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />

          <span className="absolute top-3 left-3 md:top-4 md:left-4 bg-background/85 backdrop-blur-sm text-primary text-[10px] md:text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
            {category}
          </span>

          {badge && (
            <span
              className={`absolute top-3 right-3 md:top-4 md:right-4 text-[10px] md:text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${
                badge === "NEW"
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent text-accent-foreground"
              }`}
            >
              {badge}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="p-5 md:p-6 flex flex-col flex-grow">
          <h3 className="font-serif text-lg md:text-xl font-bold text-primary leading-snug line-clamp-2">
            {title}
          </h3>

          {years && <p className="text-xs md:text-sm text-muted-foreground mt-1">{years}</p>}

          <p className="text-[11px] md:text-xs font-medium text-muted-foreground uppercase tracking-[0.1em] mt-3">
            {days}
            {guests ? ` • Limited to ${guests}` : ""}
          </p>

          {itinerary.length > 0 && (
            <div className="mt-4">
              <span className="text-[11px] md:text-xs font-bold text-primary uppercase tracking-[0.1em] block mb-1">
                Itinerary
              </span>
              <p className="text-xs md:text-sm text-muted-foreground/80 leading-relaxed">
                {itinerary.join(" • ")}
              </p>
            </div>
          )}

          <hr className="border-t border-border my-5" />

          <div className="mt-auto flex items-end justify-between gap-3">
            <div>
              <span className="text-[11px] text-muted-foreground block mb-0.5">From</span>
              <span className="font-serif text-base md:text-lg font-bold text-primary">
                {currencySymbol}
                {price.toLocaleString()}{" "}
                <span className="font-sans text-xs font-normal text-muted-foreground">per person.</span>
              </span>
            </div>

            <span className="shrink-0 text-[11px] md:text-xs font-semibold uppercase tracking-wide px-4 py-2 rounded-full border border-primary/40 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary">
              View Journey
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
