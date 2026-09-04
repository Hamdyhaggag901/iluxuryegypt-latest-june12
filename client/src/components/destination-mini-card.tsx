import { Link } from "wouter";
import { motion } from "framer-motion";

interface DestinationMiniCardProps {
  slug: string;
  name: string;
  image: string;
  index?: number;
}

// Minimal city card for "Explore by Destination" — just a photo and a name,
// nothing else. Kept deliberately simpler than destination-city-card.tsx's
// Angled Editorial Card since this is a small supporting link grid, not the
// destinations page's own hero content.
export default function DestinationMiniCard({ slug, name, image, index = 0 }: DestinationMiniCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.08, ease: "easeOut" }}
    >
      <Link
        href={`/destinations/${slug}`}
        className="group block relative aspect-square overflow-hidden rounded-full"
        data-testid={`destination-mini-card-${slug}`}
      >
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/25 group-hover:bg-black/40 transition-colors duration-300" />
        <span className="absolute inset-0 flex items-center justify-center text-white font-serif text-lg md:text-xl font-bold text-center px-2">
          {name}
        </span>
      </Link>
    </motion.div>
  );
}
