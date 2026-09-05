import { Link } from "wouter";
import { motion } from "framer-motion";
import { MessageCircle, Route, PlaneTakeoff } from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    number: "01",
    icon: MessageCircle,
    title: "Tell us your vision",
    description: "Share your travel dates, style, and the experiences you're dreaming of.",
  },
  {
    number: "02",
    icon: Route,
    title: "We craft your journey",
    description: "Our specialists design a fully private itinerary tailored around you.",
  },
  {
    number: "03",
    icon: PlaneTakeoff,
    title: "Travel, worry-free",
    description: "Every detail is handled — from arrival to your final farewell.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-20 md:py-28 bg-background" data-testid="how-it-works-section">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-accent font-medium">
            The Process
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mt-4 mb-4">
            How it works
          </h2>
          <div className="w-16 h-px bg-accent mx-auto mb-16" />

          <div className="text-left">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === STEPS.length - 1;
              return (
                <div key={step.number} className="flex gap-6">
                  {/* Number circle + connecting line */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="relative w-16 h-16 rounded-full border border-accent/60 bg-background flex items-center justify-center">
                      <span className="font-serif text-xl text-accent">{step.number}</span>
                      <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full border border-accent/60 bg-background flex items-center justify-center">
                        <Icon className="w-3.5 h-3.5 text-accent" strokeWidth={1.5} />
                      </div>
                    </div>
                    {!isLast && (
                      <div className="w-px flex-1 min-h-[3rem] bg-gradient-to-b from-accent/60 to-accent/0" />
                    )}
                  </div>

                  {/* Step text */}
                  <div className={isLast ? "pb-0" : "pb-10"}>
                    <h3 className="text-xl font-serif font-semibold text-primary mt-3 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <Link href="/plan-your-trip">
            <Button
              size="lg"
              variant="outline"
              className="mt-6 px-8 py-4 text-base border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              data-testid="button-start-planning-trip"
            >
              Start planning your trip
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
