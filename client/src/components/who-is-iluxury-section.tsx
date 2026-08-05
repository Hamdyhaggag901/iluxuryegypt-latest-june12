export default function WhoIsILuxurySection() {
  return (
    <section className="py-20 bg-background" data-testid="who-is-iluxury-section">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-8 animate-fade-in">
          Who is iLuxury Egypt
        </h2>
        <div className="flex items-center justify-center space-x-4 mb-10">
          <div className="w-16 h-px bg-accent"></div>
          <div className="w-2 h-2 bg-accent rotate-45"></div>
          <div className="w-16 h-px bg-accent"></div>
        </div>
        <div className="space-y-6 max-w-4xl mx-auto">
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            iLuxury Egypt is a boutique private tour operator built for travelers who want more than a checklist of monuments — we design journeys around access, timing, and comfort most visitors never experience. Every itinerary is arranged personally, from the moment you land in Cairo to your final departure, with a single point of contact managing every detail along the way.
          </p>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Unlike mass-market operators running fixed group tours, we work exclusively in private and small-group formats — never more than a handful of travelers per journey — so you're never rushed or competing for your guide's attention. Our Egyptologists are chosen for depth of knowledge, and our hotel and cruise partners are selected personally, not booked through a standard allotment.
          </p>
        </div>
      </div>
    </section>
  );
}
