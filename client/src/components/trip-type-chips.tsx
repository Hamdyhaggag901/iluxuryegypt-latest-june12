import { cn } from "@/lib/utils";

export const TRIP_TYPES = [
  "Small Group Tours",
  "Luxury Family",
  "Luxury Solo",
  "Spiritual Journeys",
  "Luxury Honeymoon",
  "Solar Eclipse",
  "Tailor Made Tour",
];

interface TripTypeChipsProps {
  value: string;
  onChange: (value: string) => void;
  testIdPrefix?: string;
}

export default function TripTypeChips({ value, onChange, testIdPrefix = "chip-trip-type" }: TripTypeChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {TRIP_TYPES.map((type) => {
        const isSelected = value === type;
        return (
          <button
            key={type}
            type="button"
            onClick={() => onChange(isSelected ? "" : type)}
            className={cn(
              "px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200",
              isSelected
                ? "bg-accent text-accent-foreground border-accent shadow-sm"
                : "border-input bg-background text-muted-foreground hover:border-accent hover:text-accent"
            )}
            data-testid={`${testIdPrefix}-${type.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {type}
          </button>
        );
      })}
    </div>
  );
}
