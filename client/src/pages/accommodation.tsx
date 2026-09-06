import { Link } from "wouter";
import { useSEO } from "@/hooks/use-seo";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import ScrollToTopButton from "../components/scroll-to-top-button";
import { Button } from "@/components/ui/button";
import ZigzagDivider from "../components/zigzag-divider";

const MENA_HOUSE = "https://iluxuryegypt.com/api/assets/uploads/32ef96ad-7c53-4204-bda3-06a9865b332b.webp";
const NILE_RITZ = "https://iluxuryegypt.com/api/assets/uploads/1baf9cb1-334b-4688-9b0e-e3dda1d2d13e.webp";
const FAIRMONT_NILE_CITY = "https://iluxuryegypt.com/api/assets/uploads/31bb173b-480a-4a0d-afb7-7f76245df3c6.webp";

export default function Accommodation() {
  useSEO({
    title: "5-Star Accommodation | Palaces Along the Nile | iLuxury Egypt",
    description:
      "Thirteen handpicked five-star Egyptian residences, from a royal hunting lodge beneath the Pyramids to a legendary Nile retreat once graced by Agatha Christie.",
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <section className="pt-32 md:pt-40 pb-16 md:pb-24" data-testid="accommodation-header">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-accent font-medium">
              5-Star Accommodation
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mt-4 mb-6">
              Palaces Along the Nile
            </h1>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Where you rest should be as remarkable as where you explore. Our collection spans thirteen of
              Egypt&rsquo;s most storied properties — from a former royal hunting lodge beneath the Pyramids, to
              riverside residences that have hosted kings, to a legendary Nile retreat once graced by Agatha
              Christie herself.
            </p>
          </div>
        </section>

        <section className="relative" data-testid="accommodation-overlay-section">
          <div className="relative h-[70vh] min-h-[520px] md:min-h-[640px] w-full overflow-hidden">
            <img
              src={MENA_HOUSE}
              alt="Marriott Mena House exterior beneath the Pyramids of Giza"
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
                  A Portfolio Built on History, Not Just Stars
                </h2>
                <p className="text-white/85 leading-relaxed">
                  Each property in our collection is chosen for what makes it irreplaceable — not simply its
                  rating. Marriott Mena House carries the weight of a nineteenth-century royal residence at the
                  foot of Giza. The Sofitel Legend Old Cataract in Aswan has sheltered writers, royalty, and
                  dignitaries since 1899. Every stay becomes part of the story of your journey, not a pause
                  between one destination and the next.
                </p>
              </div>
            </div>
          </div>
        </section>

        <ZigzagDivider />

        <section className="py-16 md:py-24" data-testid="accommodation-masonry-section">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
              <div className="grid grid-cols-2 gap-4 md:gap-6" data-testid="masonry-grid">
                <div className="col-span-2 rounded-2xl overflow-hidden aspect-[16/11]">
                  <img
                    src={NILE_RITZ}
                    alt="Nile Ritz-Carlton hotel exterior overlooking the Nile"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-[3/4] mt-8">
                  <img
                    src={MENA_HOUSE}
                    alt="Marriott Mena House garden facade"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-square -mt-4">
                  <img
                    src={FAIRMONT_NILE_CITY}
                    alt="Fairmont Nile City hotel exterior on the Nile"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-5">
                  From Cairo to Aswan, a Residence for Every Chapter
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Whether your journey begins in Cairo, continues along the Nile, or ends beneath the ancient
                  walls of Aswan, our handpicked hotels ensure that every night is as considered as every day.
                </p>
                <Link href="/stay">
                  <Button
                    size="lg"
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    data-testid="button-explore-all-hotels"
                  >
                    Explore All Hotels
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <ZigzagDivider reverse />

        <section className="py-16 md:py-24 bg-primary" data-testid="accommodation-closing-section">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-5">
              The Nile, in Complete Comfort
            </h2>
            <p className="text-primary-foreground/80 leading-relaxed">
              Beyond our hotel collection, a private Nile cruise offers a different kind of luxury — the
              riverbanks of ancient Egypt drifting past as you rest in comfort, tracing the same waters that
              carried pharaohs for thousands of years.
            </p>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
