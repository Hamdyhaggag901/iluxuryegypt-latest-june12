import { Link } from "wouter";
import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Hotel } from "@shared/schema";

interface HotelShowcaseCardProps {
  hotel: Hotel;
  isSpotlight?: boolean;
  index?: number;
}

// "Gilded Frame Card" — a distinct hotel-specific identity, deliberately
// different from both the ordinary rounded-rectangle cards used everywhere
// else (tour cards, the old hotel cards) and the destinations page's
// diagonal-cut "Angled Editorial Card". A thin accent-colored frame sits
// just outside the image with generous inset padding, like a hung portrait,
// and the price/rating badge breaks slightly out over the frame's edge
// instead of overlaying the photo — a small gallery-plaque touch that reads
// as curated rather than a generic booking-site listing card.
export default function HotelShowcaseCard({ hotel, isSpotlight = false, index = 0 }: HotelShowcaseCardProps) {
  const imageHeight = isSpotlight ? "h-72 md:h-80" : "h-48 md:h-56";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.08, ease: "easeOut" }}
      className="group"
      data-testid={`hotel-showcase-card-${hotel.slug}`}
    >
      <Link href={`/hotel/${hotel.slug}`}>
        <div className="relative p-2.5 border border-accent/30 rounded-sm transition-all duration-500 group-hover:border-accent group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
          <div className={`relative ${imageHeight} overflow-hidden rounded-sm`}>
            <img
              src={hotel.image}
              alt={`${hotel.name} luxury hotel in ${hotel.location}, Egypt`}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent transition-opacity duration-500 group-hover:from-black/30" />

            {hotel.featured && (
              <div className="absolute top-3 left-3">
                <Badge className="bg-accent text-accent-foreground text-xs font-medium">Featured</Badge>
              </div>
            )}
          </div>

          {/* Rating plaque, breaking slightly over the frame's edge */}
          <div className="absolute -top-3 -right-3 bg-background border border-accent/40 rounded-full px-3 py-1 shadow-md flex items-center gap-1">
            {Array.from({ length: hotel.rating }, (_, i) => (
              <Star key={i} className="w-3 h-3 text-accent fill-accent" />
            ))}
          </div>

          <div className="pt-5 px-1 pb-1">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h3 className={`font-serif font-bold text-primary leading-tight ${isSpotlight ? "text-xl" : "text-lg"}`}>
                {hotel.name}
              </h3>
              <span className="text-accent font-semibold text-sm whitespace-nowrap">{hotel.priceTier}</span>
            </div>

            <div className="flex items-center text-muted-foreground mb-3 text-sm">
              <MapPin className="w-3.5 h-3.5 mr-1 text-accent" />
              <span>{hotel.location}</span>
              <span className="mx-1.5 text-xs">&middot;</span>
              <span className="text-xs">{hotel.type}</span>
            </div>

            {isSpotlight && (
              <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">{hotel.description}</p>
            )}

            <Button className="w-full" size={isSpotlight ? "default" : "sm"} data-testid={`button-read-more-${hotel.slug}`}>
              Read More
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
