import { useQuery } from "@tanstack/react-query";
import type { Partner } from "@shared/schema";

export default function PartnersMarqueeSection() {
  const { data } = useQuery({
    queryKey: ["publicPartners"],
    queryFn: async () => {
      const response = await fetch("/api/public/partners");
      if (!response.ok) throw new Error("Failed to fetch partners");
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });

  const partners: Partner[] = data?.partners || [];

  // Nothing to show until an admin adds partners via /admin/partners — no
  // placeholder logos, since inventing brand logos isn't an option.
  if (partners.length === 0) return null;

  return (
    <section className="py-14 bg-background" data-testid="partners-marquee-section">
      <p className="text-center text-sm md:text-base text-muted-foreground font-medium mb-8">
        Trusted by the world's finest hotels
      </p>

      <div
        className="group relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
        data-testid="partners-marquee-track"
      >
        <div className="flex w-max animate-partners-marquee group-hover:[animation-play-state:paused]">
          {[...partners, ...partners].map((partner, index) => (
            <div key={`${partner.id}-${index}`} className="mx-8 md:mx-10 shrink-0 flex items-center justify-center">
              <img
                src={partner.logoUrl}
                alt={partner.name}
                className="h-10 md:h-12 w-auto max-w-[140px] object-contain grayscale opacity-60 transition-all duration-300 hover:grayscale-0 hover:opacity-100 hover:scale-105"
                data-testid={`img-partner-logo-${partner.id}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
