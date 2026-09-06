import { useSEO } from "@/hooks/use-seo";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import ScrollToTopButton from "../components/scroll-to-top-button";
import ZigzagDivider from "../components/zigzag-divider";

const FAIRMONT_NILE_CITY = "https://iluxuryegypt.com/api/assets/uploads/31bb173b-480a-4a0d-afb7-7f76245df3c6.webp";
const DENDERA_TEMPLE = "https://iluxuryegypt.com/api/assets/uploads/dafdfff9-77fd-4112-a2cc-92ee26e68bf4.webp";

export default function VipService() {
  useSEO({
    title: "Luxury VIP Service | An Escort Worthy of Royalty | iLuxury Egypt",
    description:
      "A dedicated airport welcome team, a personal guide throughout your stay, and private transportation matched city by city — every arrangement made before you think to ask.",
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <section className="pt-32 md:pt-40 pb-16 md:pb-24" data-testid="vip-service-header">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-accent font-medium">
              Luxury VIP Service
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mt-4 mb-6">
              An Escort Worthy of Royalty
            </h1>
            <p className="text-muted-foreground leading-relaxed text-lg">
              From the moment you land, your journey is handled with quiet precision. A dedicated welcome team
              greets you at the airport, and your personal guide remains by your side throughout — every
              arrangement made before you think to ask.
            </p>
          </div>
        </section>

        <section className="relative" data-testid="vip-overlay-section">
          <div className="relative h-[70vh] min-h-[520px] md:min-h-[640px] w-full overflow-hidden">
            <img
              src={FAIRMONT_NILE_CITY}
              alt="Fairmont Nile City hotel exterior on the Nile"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
            <div className="absolute inset-0 flex items-end md:items-center">
              <div
                className="w-full max-w-2xl mx-4 sm:mx-8 md:ml-16 lg:ml-24 mb-10 md:mb-0 p-8 md:p-10 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
                data-testid="overlay-card"
              >
                <h2 className="font-serif text-2xl md:text-4xl font-bold text-white mb-4">
                  Private Transportation, Matched to Every City
                </h2>
                <p className="text-white/85 leading-relaxed">
                  Rather than one fleet stretched thin across the country, we select the finest private
                  transportation partner in each city you visit — vetted for comfort, punctuality, and
                  discretion. Whether you&rsquo;re crossing Cairo or arriving in Luxor, your transfer is arranged
                  by those who know that city best.
                </p>
              </div>
            </div>
          </div>
        </section>

        <ZigzagDivider />

        <section className="py-16 md:py-24" data-testid="vip-image-cards-section">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
              <div className="rounded-2xl overflow-hidden aspect-[4/5] md:sticky md:top-32">
                <img
                  src={DENDERA_TEMPLE}
                  alt="The Temple of Hathor at Dendera"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col gap-6">
                <div className="bg-card border border-border rounded-2xl p-8" data-testid="vip-stacked-card-1">
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary mb-3">
                    A Welcome Fit for Royalty
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Your journey begins the moment you step off the plane. Our airport welcome team is waiting
                    to guide you smoothly through arrival, while your personal guide takes over from there —
                    present throughout your stay, anticipating your needs before you voice them.
                  </p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-8" data-testid="vip-stacked-card-2">
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary mb-3">
                    Safety Without Compromise
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Every route, every destination, and every moment of your journey is planned with your
                    security in mind. Our team remains close at hand throughout your visit, allowing you to
                    explore Egypt with complete peace of mind.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
