import { useEffect, useRef, useState } from "react";
import luxuryHallImage from "@assets/elegant-hall_1757459228629.jpeg";
import suiteNileImage from "@assets/suite-nile_1757457083796.jpg";
import sunsetFeluccaImage from "@assets/sunset-felucca_1757456567256.jpg";
import khanKhaliliImage from "@assets/khan-khalili-restaurant_1757459228636.jpeg";
import columnHallImage from "@assets/inside-the-column-hall_1757699232094.jpg";

interface Strength {
  title: string;
  body: string;
  image?: string;
}

const STRENGTHS: Strength[] = [
  {
    title: "Private Egyptologist Guides",
    body: "Every journey is led by a private, professionally trained Egyptologist — not a shared coach tour with a megaphone. You set the pace; they bring 5,000 years of history to life.",
    image: columnHallImage,
  },
  {
    title: "Small, Intimate Groups",
    body: "Most of our departures are private or limited to a handful of travelers, so a temple visit feels like a discovery, not a queue.",
    image: sunsetFeluccaImage,
  },
  {
    title: "Hand-Picked Luxury Hotels",
    body: "We personally vet every property on your itinerary — from Nile-view suites in Cairo to boutique dahabiyas on the river — so each night matches the standard of the day before it.",
    image: suiteNileImage,
  },
  {
    title: "24/7 Personal Concierge",
    body: "A dedicated concierge is reachable around the clock throughout your trip, on the ground in Egypt — not a call center reading from a script.",
  },
  {
    title: "Deep Local Expertise",
    body: "Two decades of relationships across Cairo, Luxor, and Aswan mean access most operators simply don't have: early museum entry, private felucca sunsets, tables at restaurants without a sign.",
    image: khanKhaliliImage,
  },
  {
    title: "Bespoke, Not Templated",
    body: "Every private Nile cruise and boutique Egypt travel itinerary we build starts from a conversation with you, not a brochure.",
  },
];

function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function RevealCard({ strength, index }: { strength: Strength; index: number }) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`group relative rounded-lg overflow-hidden border border-card-border bg-card transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: `${(index % 3) * 100}ms` }}
    >
      {strength.image ? (
        <div className="relative h-40 overflow-hidden">
          <img
            src={strength.image}
            alt={`${strength.title} — iLuxury Egypt`}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent" />
        </div>
      ) : (
        <div className="h-40 bg-primary flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border border-accent/50" />
        </div>
      )}
      <div className="p-5 md:p-6">
        <h3 className="font-serif text-lg text-primary mb-2">{strength.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{strength.body}</p>
      </div>
    </div>
  );
}

export default function WhyILuxurySection() {
  const { ref: introRef, visible: introVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <section className="py-12 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div
          ref={introRef}
          className={`grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-10 lg:gap-16 items-center mb-10 md:mb-16 transition-all duration-700 ease-out ${
            introVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div>
            <div className="w-12 md:w-16 h-px bg-accent mb-4 md:mb-6"></div>
            <span className="text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase text-accent">
              Why iLuxury Egypt
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-primary mt-3 md:mt-4 leading-tight">
              Luxury Egypt tours, built around you
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mt-4 md:mt-6">
              We design boutique Egypt travel for guests who want more than a checklist of pyramids — private
              access, hand-picked hotels, and a team on the ground who treat every detail as personal.
            </p>
          </div>
          <div className="relative h-56 md:h-72 lg:h-80 rounded-lg overflow-hidden">
            <img
              src={luxuryHallImage}
              alt="Elegant luxury hotel interior in Egypt – iLuxury Egypt"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {STRENGTHS.map((strength, index) => (
            <RevealCard key={strength.title} strength={strength} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
