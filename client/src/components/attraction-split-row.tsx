import { motion } from "framer-motion";

interface AttractionSplitRowProps {
  name: string;
  description: string;
  image: string;
  imageAlt?: string;
  index: number;
}

// Full-width alternating rows (image-right/text-left, then image-left/
// text-right) rather than a grid — each row's entrance direction matches
// which side its image sits on, so image-right rows slide in from the
// right and image-left rows slide in from the left.
export default function AttractionSplitRow({ name, description, image, imageAlt, index }: AttractionSplitRowProps) {
  const imageOnRight = index % 2 === 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0 items-center">
      <motion.div
        initial={{ opacity: 0, x: imageOnRight ? -60 : 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className={`${imageOnRight ? "md:order-2" : "md:order-1"} md:px-10 lg:px-16`}
      >
        <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-accent font-medium">
          Attraction {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-primary mt-3 mb-4 md:mb-6 leading-tight">
          {name}
        </h3>
        <p className="text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed">
          {description}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: imageOnRight ? 60 : -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className={`${imageOnRight ? "md:order-1" : "md:order-2"} group overflow-hidden rounded-lg`}
      >
        <div className="aspect-[4/3] overflow-hidden rounded-lg">
          <img
            src={image}
            alt={imageAlt || name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
          />
        </div>
      </motion.div>
    </div>
  );
}
