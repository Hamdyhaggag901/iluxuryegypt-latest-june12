import { Link } from "wouter";

const POPULAR_SEARCHES = [
  { label: "Small Group Tours Egypt", slug: "small-group-tours-egypt" },
  { label: "Luxury Family Egypt", slug: "family-luxury" },
  { label: "Luxury Solo Egypt", slug: "egypt-solo-travel" },
  { label: "Spiritual Journeys Egypt", slug: "spiritual-journeys" },
  { label: "Luxury Honeymoon Egypt", slug: "luxury-honeymoon-egypt" },
  { label: "Solar Eclipse Egypt", slug: "solar-eclipse-egypt" },
];

export default function PopularSearchSection() {
  return (
    <section className="py-12 bg-background" data-testid="popular-search-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary text-center mb-6">
          Popular search
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {POPULAR_SEARCHES.map(({ label, slug }) => (
            <Link
              key={slug}
              href={`/egypt-tour-packages/${slug}`}
              className="px-5 py-2.5 rounded-full border border-input bg-background text-sm font-medium text-muted-foreground transition-all duration-200 hover:border-accent hover:text-accent hover:shadow-sm"
              data-testid={`link-popular-search-${slug}`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
