import { Star } from "lucide-react";

interface HotelCardProps {
  name: string;
  location: string;
  rating: number;
  description: string;
  image: string;
  imageAlt: string;
}

export default function HotelCard({ name, location, rating, description, image, imageAlt }: HotelCardProps) {
  return (
    <article className="relative" data-testid={`hotel-card-${name.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="rounded-t-3xl overflow-hidden aspect-[16/10]">
        <img src={image} alt={imageAlt} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="relative -mt-10 mx-4 md:mx-8 rounded-3xl bg-card shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-6 md:p-8">
        <div className="flex items-center gap-0.5 mb-3" aria-label={`${rating} out of 5 stars`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={i < rating ? "h-4 w-4 fill-accent text-accent" : "h-4 w-4 text-border"}
              strokeWidth={1.5}
            />
          ))}
        </div>
        <h3 className="font-serif text-xl md:text-2xl font-bold text-primary mb-1">{name}</h3>
        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-4">{location}</p>
        <p className="text-muted-foreground leading-relaxed text-sm">{description}</p>
      </div>
    </article>
  );
}
