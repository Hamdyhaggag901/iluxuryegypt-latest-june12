import { Link } from "wouter";

const CARDS = [
  {
    number: "01",
    kicker: "Private Access",
    title: "Egypt Private Tours",
    body: "Through permits secured directly with Egyptian authorities, we open doors that remain closed to the public. Stand alone before the Great Pyramid, or between the paws of the Sphinx at sunrise — moments reserved for a privileged few, and at the very heart of what we do.",
    href: "/private-access",
    linkLabel: "See details",
  },
  {
    number: "02",
    kicker: "Luxury VIP Service",
    title: "An Escort Worthy of Royalty",
    body: "Your comfort and peace of mind are at the center of every journey. From a personal welcome team at the airport to private transportation matched to each city you visit, every arrangement is handled with quiet precision — so you can simply enjoy the journey.",
    href: "/vip-service",
    linkLabel: "See details",
  },
  {
    number: "03",
    kicker: "5-Star Accommodation",
    title: "Palaces Along the Nile",
    body: "Where you rest should be as remarkable as where you explore. Our collection spans thirteen of Egypt's most storied properties — from a royal hunting lodge beneath the Pyramids to a legendary Nile retreat once graced by literary royalty — each one a chapter of your journey in its own right.",
    href: "/accommodation",
    linkLabel: "See details",
  },
  {
    number: "04",
    kicker: "Tailor-Made Itineraries",
    title: "A Journey Written for You Alone",
    body: "No two journeys through Egypt should look the same. Every itinerary is composed around your pace, your interests, and the version of Egypt you came to find — never a package, always a private commission.",
    href: "/plan-your-trip",
    linkLabel: "Design My Egypt Story",
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="py-20 md:py-28 bg-background" data-testid="why-choose-us-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14 md:mb-20">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-5">Why Choose Us?</h2>
          <p className="text-muted-foreground leading-relaxed">
            We don&rsquo;t simply arrange tours — we compose journeys built entirely around you. Every experience
            combines privileged access to Egypt&rsquo;s most guarded monuments, a handpicked portfolio of storied
            five-star residences, private transportation vetted city by city, and the insight of expert
            Egyptologists. Nothing is left to chance, and nothing is ever repeated.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {CARDS.map((card) => (
            <Link
              key={card.number}
              href={card.href}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 md:p-10 flex flex-col"
              data-testid={`card-why-choose-${card.number}`}
            >
              <span
                aria-hidden="true"
                className="absolute -top-4 right-4 font-serif text-[6.5rem] md:text-[8rem] leading-none font-bold text-accent/10 select-none pointer-events-none"
              >
                {card.number}
              </span>
              <div className="relative">
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">{card.kicker}</span>
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-primary mt-3 mb-4">{card.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">{card.body}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-accent">
                  {card.linkLabel}
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
