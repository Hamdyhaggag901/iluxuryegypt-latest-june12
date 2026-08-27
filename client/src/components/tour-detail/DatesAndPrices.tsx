import { useMemo, useState } from "react";
import { getMonthlyPricing, getDefaultMonth } from "@/lib/seasonal-pricing";
import type { Season } from "@shared/schema";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function DatesAndPrices({
  basePrice,
  currency,
  seasons,
}: {
  basePrice: number;
  currency: string;
  seasons: Season[];
}) {
  const monthly = useMemo(() => getMonthlyPricing(basePrice, seasons), [basePrice, seasons]);
  const [selectedMonth, setSelectedMonth] = useState(() => getDefaultMonth(seasons));

  const symbol = currency === "USD" ? "$" : `${currency} `;
  const format = (n: number) => new Intl.NumberFormat("en-US").format(n);

  const selected = monthly[selectedMonth - 1];
  const prices = monthly.map((m) => m.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const activeSeasonNames = Array.from(
    new Map(
      monthly.filter((m) => m.season).map((m) => [m.season!.id, m.season!.name])
    ).values()
  );

  // Opacity scales with how much a month's price sits above the year's floor price.
  const opacityFor = (price: number) => {
    if (maxPrice === minPrice) return 0.15;
    const ratio = (price - minPrice) / (maxPrice - minPrice);
    return 0.2 + ratio * 0.8;
  };

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

        <div className="max-w-2xl mx-auto">
          {/* Big price card */}
          <div className="bg-primary rounded-2xl p-8 md:p-12 text-center transition-all duration-300">
            <span className="text-xs md:text-sm tracking-[0.2em] uppercase text-accent">
              {selected.season ? selected.season.name : "Standard Season"}
            </span>
            <p className="text-primary-foreground/70 text-sm mt-2">{MONTH_NAMES[selectedMonth - 1]}</p>
            <div className="flex items-baseline justify-center gap-1 mt-3 md:mt-4">
              <span className="text-accent text-lg md:text-xl">{symbol}</span>
              <span className="text-4xl md:text-6xl font-serif text-primary-foreground transition-all duration-300">
                {format(selected.price)}
              </span>
            </div>
            <p className="text-xs md:text-sm text-primary-foreground/70 mt-2">From, per person</p>
          </div>

          {/* 12-month strip */}
          <div className="flex mt-6 md:mt-8 gap-[2px]" role="group" aria-label="Select a travel month">
            {monthly.map((m, idx) => {
              const isSelected = m.month === selectedMonth;
              const isFirst = idx === 0;
              const isLast = idx === monthly.length - 1;
              return (
                <button
                  key={m.month}
                  type="button"
                  onClick={() => setSelectedMonth(m.month)}
                  aria-pressed={isSelected}
                  aria-label={`${MONTH_NAMES[idx]}, ${symbol}${format(m.price)}`}
                  className={`flex-1 h-12 md:h-14 flex items-center justify-center text-[10px] md:text-xs font-semibold uppercase tracking-wide transition-all duration-300 ${
                    isFirst ? "rounded-l-full" : ""
                  } ${isLast ? "rounded-r-full" : ""} ${
                    isSelected ? "ring-2 ring-white ring-offset-1 z-10 relative text-primary" : "text-primary/70 hover:opacity-80"
                  }`}
                  style={{
                    backgroundColor: m.season
                      ? `hsl(var(--accent) / ${opacityFor(m.price)})`
                      : `hsl(var(--primary) / 0.06)`,
                  }}
                  data-testid={`button-month-${m.month}`}
                >
                  {MONTH_LABELS[idx]}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 md:mt-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: `hsl(var(--primary) / 0.06)` }} />
              <span className="text-xs text-muted-foreground">Standard</span>
            </div>
            {activeSeasonNames.map((name) => (
              <div key={name} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: `hsl(var(--accent) / 0.8)` }} />
                <span className="text-xs text-muted-foreground">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
