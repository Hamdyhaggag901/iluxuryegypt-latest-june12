export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-background" data-testid="about-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-8">
            I.LuxuryEgypt Guest Experiences
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
              Step into a world where heritage and luxury intertwine. I.LuxuryEgypt curates bespoke stays across Egypt's most iconic destinations — from Nile-side sanctuaries to Red Sea havens. Every detail is handpicked to ensure comfort, elegance, and authenticity.
            </p>
            <p className="text-xl md:text-2xl font-serif text-accent font-medium">
              Your journey, our promise.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
