import { Compass } from "lucide-react";

export default function WhoIsILuxurySection() {
  return (
    <section className="py-20 bg-background" data-testid="who-is-iluxury-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="relative inline-block mb-8">
          <div className="absolute -inset-4 bg-accent/10 rounded-full blur-xl"></div>
          <div className="relative bg-background/80 backdrop-blur-sm rounded-full p-6 border border-accent/20">
            <Compass className="h-8 w-8 text-accent" />
          </div>
        </div>

        <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-8 animate-fade-in">
          Who is iLuxury Egypt
        </h2>
        <div className="flex items-center justify-center space-x-4 mb-10">
          <div className="w-16 h-px bg-accent"></div>
          <div className="w-2 h-2 bg-accent rotate-45"></div>
          <div className="w-16 h-px bg-accent"></div>
        </div>

        <div className="bg-muted/30 rounded-2xl p-8 md:p-12 border border-accent/10">
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            iLuxury Egypt is a boutique private tour operator designing journeys around access, timing, and comfort most visitors never experience every detail arranged personally, from arrival to departure.
          </p>
        </div>
      </div>
    </section>
  );
}
