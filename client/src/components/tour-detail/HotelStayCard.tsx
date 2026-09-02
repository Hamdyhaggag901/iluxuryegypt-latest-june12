import { Link } from "wouter";
import { getResponsiveImageProps } from "@/lib/responsive-image";
import { openLinkInNewTab } from "@/lib/open-in-new-tab";

export interface HotelStayCardProps {
  image: string;
  imageAlt: string;
  location: string;
  name: string;
  /** Shown as a small pill over the top-left of the image. Omit for no badge. */
  badge?: string;
  link: string;
}

export default function HotelStayCard({ image, imageAlt, location, name, badge, link }: HotelStayCardProps) {
  return (
    <article className="bg-card border border-card-border rounded-lg overflow-hidden h-full flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        <img
          {...getResponsiveImageProps(image)}
          alt={imageAlt}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {badge && (
          <span className="absolute top-3 left-3 md:top-4 md:left-4 bg-primary text-primary-foreground text-[10px] md:text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
            {badge}
          </span>
        )}
      </div>

      <div className="p-5 md:p-6 flex flex-col flex-grow gap-2">
        <span className="text-[11px] md:text-xs font-medium text-muted-foreground uppercase tracking-[0.15em]">
          {location}
        </span>
        <h3 className="font-serif text-lg md:text-xl font-bold text-primary leading-snug line-clamp-2">
          {name}
        </h3>

        <div className="mt-auto pt-3">
          <Link href={link} target="_blank" rel="noopener noreferrer" onClick={openLinkInNewTab}>
            <span className="block w-full text-center border border-primary text-primary font-semibold text-sm py-3 rounded-md transition-colors duration-300 hover:bg-primary hover:text-primary-foreground cursor-pointer">
              View Details
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
