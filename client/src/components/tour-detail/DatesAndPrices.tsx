import { computeSeasonalPricing } from "@/lib/seasonal-pricing";
import type { Season } from "@shared/schema";

export default function DatesAndPrices({
  basePrice,
  currency,
  seasons,
}: {
  basePrice: number;
  currency: string;
  seasons: Season[];
}) {
  const { standardPrice, peakPrice, hasPeakSeason } = computeSeasonalPricing(basePrice, seasons);
  const symbol = currency === "USD" ? "$" : `${currency} `;
  const format = (n: number) => new Intl.NumberFormat("en-US").format(n);

  return (
    <section className="py-12 md:py-24 bg-[#f8f6f3]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8 md:mb-16">
          <div className="w-12 md:w-16 h-px bg-accent mx-auto mb-4 md:mb-6"></div>
          <span className="text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase text-accent">
            Dates & Prices
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-light text-primary mt-3 md:mt-4">
            Travel Whenever It Suits You
          </h2>
        </div>

        <div className={`grid grid-cols-1 ${hasPeakSeason ? "sm:grid-cols-2" : ""} gap-4 md:gap-8 max-w-3xl mx-auto`}>
          <div className="bg-card border border-card-border rounded-xl p-6 md:p-10 text-center">
            <span className="text-xs md:text-sm tracking-[0.2em] uppercase text-muted-foreground">
              Standard Season
            </span>
            <div className="flex items-baseline justify-center gap-1 mt-3 md:mt-4">
              <span className="text-accent text-lg">{symbol}</span>
              <span className="text-3xl md:text-4xl font-serif text-primary">{format(standardPrice)}</span>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-2">From, per person</p>
          </div>

          {hasPeakSeason && (
            <div className="bg-primary rounded-xl p-6 md:p-10 text-center">
              <span className="text-xs md:text-sm tracking-[0.2em] uppercase text-accent">
                Peak Season
              </span>
              <div className="flex items-baseline justify-center gap-1 mt-3 md:mt-4">
                <span className="text-accent text-lg">{symbol}</span>
                <span className="text-3xl md:text-4xl font-serif text-primary-foreground">{format(peakPrice)}</span>
              </div>
              <p className="text-xs md:text-sm text-primary-foreground/70 mt-2">From, per person</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
