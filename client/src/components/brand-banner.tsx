export default function BrandBanner() {
  return (
    <section className="py-12 bg-accent border-t border-accent/20" data-testid="brand-banner">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center space-x-4 animate-fade-in">
          <div className="h-px bg-accent-foreground/30 flex-1 max-w-24"></div>
          <div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-accent-foreground mb-2">
              I.LUXURYEGYPT
            </h2>
            <p className="text-sm md:text-base text-accent-foreground/80 font-light tracking-wide">
              Where Pharaohs' Legacy Meets Modern Luxury
            </p>
          </div>
          <div className="h-px bg-accent-foreground/30 flex-1 max-w-24"></div>
        </div>
      </div>
    </section>
  );
}