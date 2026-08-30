import { Compass, Hotel, Ship, Clock, MapPin, UserCheck, Phone } from "lucide-react";
import type { TourHighlight } from "@/lib/tour-highlights";

const ICONS: Record<TourHighlight["icon"], typeof Compass> = {
  stay: Hotel,
  cruise: Ship,
  duration: Clock,
  activity: Compass,
  destinations: MapPin,
  guide: UserCheck,
  concierge: Phone,
};

export default function WhyYoullLoveJourneySection({
  tourTitle,
  highlights,
}: {
  tourTitle: string;
  highlights: TourHighlight[];
}) {
  if (highlights.length === 0) return null;

  const [featured, ...rest] = highlights;
  const FeaturedIcon = ICONS[featured.icon];

  return (
    <section id="why-love" className="py-12 md:py-24 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8 md:mb-16 max-w-2xl mx-auto">
          <div className="w-12 md:w-16 h-px bg-accent mx-auto mb-4 md:mb-6"></div>
          <span className="text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase text-accent">
            Why You'll Love This Journey
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-light mt-3 md:mt-4">
            This journey was designed with you in mind, {tourTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {/* Featured highlight — spans 2 columns on larger screens */}
          <div className="relative md:col-span-2 lg:col-span-2 rounded-lg overflow-hidden min-h-[280px] md:min-h-[320px] flex items-end">
            {featured.image ? (
              <>
                <img
                  src={featured.image}
                  alt={`${featured.title} — ${tourTitle}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary" />
            )}
            <div className="relative p-6 md:p-8">
              <FeaturedIcon className="h-7 w-7 text-accent mb-3" />
              <h3 className="font-serif text-xl md:text-2xl mb-2">{featured.title}</h3>
              <p className="text-sm md:text-base text-primary-foreground/80 leading-relaxed max-w-lg">
                {featured.body}
              </p>
            </div>
          </div>

          {rest.map((highlight) => {
            const Icon = ICONS[highlight.icon];
            return (
              <div
                key={highlight.title}
                className="relative rounded-lg overflow-hidden bg-primary-foreground/5 border border-primary-foreground/10 p-6 md:p-8 flex flex-col justify-end min-h-[220px]"
              >
                {highlight.image && (
                  <>
                    <img
                      src={highlight.image}
                      alt={`${highlight.title} — ${tourTitle}`}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/20" />
                  </>
                )}
                <div className="relative">
                  <Icon className="h-6 w-6 text-accent mb-3" />
                  <h3 className="font-serif text-lg mb-2">{highlight.title}</h3>
                  <p className="text-sm text-primary-foreground/80 leading-relaxed">{highlight.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
