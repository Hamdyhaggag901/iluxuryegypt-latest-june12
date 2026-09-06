import { Link } from "wouter";
import { useSEO } from "@/hooks/use-seo";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import ScrollToTopButton from "../components/scroll-to-top-button";
import HotelCard from "../components/hotel-card";
import { Button } from "@/components/ui/button";

const MENA_HOUSE = "https://iluxuryegypt.com/api/assets/uploads/32ef96ad-7c53-4204-bda3-06a9865b332b.webp";
const NILE_RITZ = "https://iluxuryegypt.com/api/assets/uploads/1baf9cb1-334b-4688-9b0e-e3dda1d2d13e.webp";
const FAIRMONT_NILE_CITY = "https://iluxuryegypt.com/api/assets/uploads/31bb173b-480a-4a0d-afb7-7f76245df3c6.webp";

const HOTELS = [
  {
    name: "Marriott Mena House",
    location: "Giza, at the Foot of the Pyramids",
    rating: 5,
    description:
      "Few hotels anywhere can claim a view like this one. Marriott Mena House began as a royal hunting lodge in the shadow of the Great Pyramid, and more than a century later, that address remains unmatched. Manicured gardens, domed reception halls, and rooms with the Pyramids rising just beyond the window make this less a place to sleep and more a piece of the journey itself.",
    image: MENA_HOUSE,
    imageAlt: "Marriott Mena House exterior beneath the Pyramids of Giza",
  },
  {
    name: "Nile Ritz-Carlton",
    location: "Downtown Cairo, on the Nile Corniche",
    rating: 5,
    description:
      "Set on the Nile Corniche in the heart of downtown Cairo, the Nile Ritz-Carlton pairs sweeping river views with the polish expected of its name. Rooms and suites look out over the water, the Egyptian Museum sits within walking distance, and the hotel's restaurants and rooftop spaces make it as suited to a quiet evening as a lively one.",
    image: NILE_RITZ,
    imageAlt: "Nile Ritz-Carlton hotel exterior overlooking the Nile",
  },
  {
    name: "Fairmont Nile City",
    location: "Nile City Towers, Cairo",
    rating: 5,
    description:
      "Rising above the Nile from the Nile City Towers complex, the Fairmont Nile City combines contemporary design with some of Cairo's most striking river views. Spacious rooms, an extensive spa, and a choice of restaurants overlooking the water make it a favorite for travelers who want modern comfort without leaving the city's rhythm behind.",
    image: FAIRMONT_NILE_CITY,
    imageAlt: "Fairmont Nile City hotel exterior on the Nile",
  },
];

export default function Accommodation() {
  useSEO({
    title: "5 Star Hotels in Cairo | Luxury Accommodation Near the Pyramids – iLuxuryEgypt",
    description:
      "Handpicked 5-star hotels in Cairo and along the Nile — from a royal lodge beneath the Pyramids to modern riverside towers. Discover luxury accommodation built around your journey.",
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <section className="relative" data-testid="accommodation-hero">
          <div className="relative h-[60vh] min-h-[440px] md:min-h-[560px] w-full overflow-hidden">
            <img
              src={MENA_HOUSE}
              alt="Marriott Mena House beneath the Pyramids of Giza at dusk"
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-black/55" />
            <div className="absolute inset-0 flex items-center justify-center text-center px-4">
              <div>
                <h1 className="text-5xl md:text-7xl font-serif italic font-bold text-white mb-4">Accommodation</h1>
                <p className="text-white/85 text-lg max-w-xl mx-auto">For Your Peace of Mind</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24" data-testid="accommodation-intro">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8 md:gap-12">
            <p className="text-muted-foreground leading-relaxed">
              <span className="text-accent font-bold">Rest</span>, in Egypt, should feel as considered as
              everything else on your itinerary. We select every property in our collection for what makes it
              irreplaceable, not simply its star rating — a location beside the monuments you&rsquo;ve come to
              see, a history as rich as the country around it, service that anticipates rather than reacts.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              From a nineteenth-century hunting lodge at the foot of the Pyramids to a modern tower rising above
              the Nile, each hotel in our portfolio offers a different way to experience Egyptian hospitality —
              but all share the same standard of comfort, discretion, and genuine warmth.
            </p>
          </div>
        </section>

        <section className="pb-16 md:pb-24" data-testid="accommodation-hotel-list">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {HOTELS.map((hotel) => (
              <HotelCard key={hotel.name} {...hotel} />
            ))}
          </div>
        </section>

        <section className="pb-20 md:pb-28" data-testid="accommodation-bento-gallery">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary mb-8 md:mb-10 text-center">
              A Closer Look at Our Collection
            </h2>
            <div
              className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 md:gap-6 h-[500px] md:h-[440px]"
              data-testid="bento-grid"
            >
              <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden">
                <img
                  src={MENA_HOUSE}
                  alt="Marriott Mena House garden facade"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="col-span-2 row-span-1 md:col-span-2 rounded-2xl overflow-hidden">
                <img
                  src={NILE_RITZ}
                  alt="Nile Ritz-Carlton suite interior"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="col-span-2 row-span-1 md:col-span-2 rounded-2xl overflow-hidden">
                <img
                  src={FAIRMONT_NILE_CITY}
                  alt="Fairmont Nile City view over the Nile"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="pb-20 md:pb-28 text-center" data-testid="accommodation-closing-cta">
          <Link href="/stay">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              data-testid="button-explore-all-hotels"
            >
              Explore All Hotels
            </Button>
          </Link>
        </section>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
