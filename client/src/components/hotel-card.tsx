import { Link } from "wouter";

interface HotelCardProps {
  image: string;
  badge?: string;
  location: string;
  name: string;
  link: string;
}

export default function HotelCard({ image, badge, location, name, link }: HotelCardProps) {
  return (
    <article className="bg-card border border-card-border rounded-2xl overflow-hidden flex flex-col h-full">
      <div className="relative aspect-square sm:aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {badge && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {location}
        </span>
        <h3 className="font-serif font-bold text-lg md:text-xl text-primary leading-tight mt-2 mb-6 line-clamp-2">
          {name}
        </h3>

        <Link href={link} className="mt-auto">
          <button
            type="button"
            className="w-full border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-300 py-3 rounded-lg text-sm font-medium tracking-wide"
          >
            View Details
          </button>
        </Link>
      </div>
    </article>
  );
}
