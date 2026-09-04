import { Link } from "wouter";
import { motion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";
import type { Hotel, Destination } from "@shared/schema";
import { normalizeForMatch } from "@shared/itinerary-detection";

interface HotelRevealCardProps {
  hotel: Hotel;
  destinations: Destination[];
  index?: number;
}

// "Cinematic Reveal Card" — the image is the card; almost nothing else is
// visible until a visitor engages with it. At rest, only the hotel name
// sits over a light gradient at the bottom of a full-bleed portrait photo.
// On hover, a details panel (location, rating, and a link to the matching
// destination page) slides up and fades in beneath the name, like a
// curtain lifting, rather than crowding the card with text by default.
export default function HotelRevealCard({ hotel, destinations, index = 0 }: HotelRevealCardProps) {
  const linkedDestination = destinations.find(
    (d) => d.published && normalizeForMatch(hotel.region).includes(normalizeForMatch(d.name))
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.08, ease: "easeOut" }}
      className="group relative aspect-[4/5] overflow-hidden rounded-sm"
      data-testid={`hotel-reveal-card-${hotel.slug}`}
    >
      <Link href={`/hotel/${hotel.slug}`} className="absolute inset-0" data-testid={`link-hotel-image-${hotel.slug}`}>
        <img
          src={hotel.image}
          alt={`${hotel.name} luxury hotel in ${hotel.location}, Egypt`}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
      </Link>

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-all duration-500 ease-out group-hover:from-black/85 pointer-events-none" />

      {hotel.featured && (
        <span className="absolute top-4 left-4 text-[11px] tracking-[0.2em] uppercase text-white/90 border border-white/40 rounded-full px-3 py-1">
          Featured
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 text-white">
        <Link href={`/hotel/${hotel.slug}`}>
          <h3 className="font-serif text-xl md:text-2xl font-bold leading-tight">{hotel.name}</h3>
        </Link>

        <div className="max-h-0 opacity-0 overflow-hidden group-hover:max-h-32 group-hover:opacity-100 transition-all duration-500 ease-out">
          <div className="w-8 h-px bg-accent mt-3 mb-3 transition-all duration-500 ease-out group-hover:w-12" />
          <div className="flex items-center gap-2 text-sm text-white/85 mb-2">
            <span>{hotel.location}</span>
            <span className="text-white/40">&middot;</span>
            <span>{hotel.type}</span>
          </div>
          <div className="flex items-center gap-0.5 mb-3">
            {Array.from({ length: hotel.rating }, (_, i) => (
              <Star key={i} className="w-3 h-3 text-accent fill-accent" />
            ))}
          </div>
          {linkedDestination && (
            <Link
              href={`/destinations/${linkedDestination.slug}`}
              className="group/link inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-accent hover:text-white transition-colors duration-300"
              data-testid={`link-hotel-destination-${hotel.slug}`}
            >
              In {linkedDestination.name}
              <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover/link:translate-x-1" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
