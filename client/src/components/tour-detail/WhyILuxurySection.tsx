import { useEffect, useMemo, useRef, useState } from "react";
import type { Tour, Hotel } from "@shared/schema";
import { getWhyILuxuryContent, type WhyILuxuryStrength } from "@/lib/why-iluxury-content";

type Strength = WhyILuxuryStrength;

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
      <div className="relative h-40 overflow-hidden">
        <img
          src={strength.image}
          alt={`${strength.title} — iLuxury Egypt`}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent" />
      </div>
      <div className="p-5 md:p-6">
        <h3 className="font-serif text-lg text-primary mb-2">{strength.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{strength.body}</p>
      </div>
    </div>
  );
}

export default function WhyILuxurySection({ tour, hotels }: { tour: Tour; hotels: Hotel[] }) {
  const { ref: introRef, visible: introVisible } = useScrollReveal<HTMLDivElement>();
  const { heroImage, strengths } = useMemo(() => getWhyILuxuryContent(tour, hotels), [tour, hotels]);

  return (
    <section id="why-iluxury" className="py-12 md:py-24 bg-background">
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
              src={heroImage}
              alt="Elegant luxury hotel interior in Egypt – iLuxury Egypt"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {strengths.map((strength, index) => (
            <RevealCard key={strength.title} strength={strength} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
