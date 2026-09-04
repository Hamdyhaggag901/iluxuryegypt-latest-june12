import { motion } from "framer-motion";
import { Link } from "wouter";
import { PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";

// Elevates the existing "24/7 concierge" promise (already real, already
// live in highlights-section.tsx) into its own dedicated moment, since a
// buried icon in a 4-up grid undersells it for a high-value traveler. No
// photo or named person here on purpose — there is no real staff portrait
// anywhere in the asset library yet, and a stock photo of a stranger would
// read as fake the moment it was noticed. This stays honest: real copy,
// no invented face.
export default function PersonalAdvisorSection() {
  return (
    <section className="py-20 md:py-28 bg-primary text-primary-foreground" data-testid="personal-advisor-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-8">
            <PhoneCall className="w-7 h-7 text-accent" />
          </div>
          <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-accent font-medium">
            Your Personal Egypt Advisor
          </span>
          <p className="text-2xl md:text-4xl font-serif italic leading-relaxed mt-6 mb-8">
            "Every guest is assigned a personal concierge, reachable around the clock — before you
            land, throughout your journey, and long after you've gone home."
          </p>
          <div className="w-16 h-px bg-accent mx-auto mb-8" />
          <p className="text-base md:text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-10">
            Not a call center, not a chatbot — a dedicated point of contact who already knows your
            itinerary, your preferences, and how to reach you.
          </p>
          <Link href="/contact">
            <Button size="lg" variant="secondary" className="px-8 py-4 text-lg" data-testid="button-meet-advisor">
              Start Planning With a Specialist
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
