import { Link } from "wouter";
import { Compass, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface DestinationCityCardProps {
  slug: string;
  name: string;
  region: string;
  tagline?: string;
  image: string;
  index?: number;
}

// Deliberately distinct from every other card style already on the site
// (Categories Carousel, Packages Bento, Hotel cards all use a straight
// rounded-rectangle image + bottom gradient + overlaid text). This one cuts
// the image's bottom edge on a diagonal via clip-path, with the destination
// name sitting on that seam and a compass icon that spins in on hover — a
// distinctly "travel poster" identity for the destinations landing page.
export default function DestinationCityCard({ slug, name, region, tagline, image, index = 0 }: DestinationCityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.6, delay: (index % 6) * 0.1, ease: "easeOut" }}
    >
      <Link href={`/destinations/${slug}`} className="group block" data-testid={`destination-card-${slug}`}>
        <div className="relative">
          <div
            className="aspect-[3/4] overflow-hidden transition-[filter] duration-500 ease-out group-hover:[filter:drop-shadow(0_20px_20px_rgb(0_0_0/0.3))]"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 88%, 0% 100%)" }}
          >
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
          </div>

          <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center">
            <Compass className="w-5 h-5 text-white transition-transform duration-700 ease-out group-hover:rotate-[135deg]" />
          </div>

          <div className="relative -mt-8 pl-1">
            <span className="text-[11px] tracking-[0.25em] uppercase text-accent font-medium">
              {region}
            </span>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-primary mt-1 leading-tight">
              {name}
            </h3>
            {tagline && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{tagline}</p>
            )}
            <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary mt-3 group-hover:text-accent transition-colors duration-300">
              Explore
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
