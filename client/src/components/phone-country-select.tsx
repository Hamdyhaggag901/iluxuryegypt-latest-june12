import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface CountryCode {
  name: string;
  iso: string;
  flag: string;
  dialCode: string;
}

export const COUNTRY_CODES: CountryCode[] = [
  { name: "Egypt", iso: "EG", flag: "🇪🇬", dialCode: "+20" },
  { name: "United States", iso: "US", flag: "🇺🇸", dialCode: "+1" },
  { name: "United Kingdom", iso: "GB", flag: "🇬🇧", dialCode: "+44" },
  { name: "Canada", iso: "CA", flag: "🇨🇦", dialCode: "+1" },
  { name: "Australia", iso: "AU", flag: "🇦🇺", dialCode: "+61" },
  { name: "United Arab Emirates", iso: "AE", flag: "🇦🇪", dialCode: "+971" },
  { name: "Saudi Arabia", iso: "SA", flag: "🇸🇦", dialCode: "+966" },
  { name: "Qatar", iso: "QA", flag: "🇶🇦", dialCode: "+974" },
  { name: "Kuwait", iso: "KW", flag: "🇰🇼", dialCode: "+965" },
  { name: "Germany", iso: "DE", flag: "🇩🇪", dialCode: "+49" },
  { name: "France", iso: "FR", flag: "🇫🇷", dialCode: "+33" },
  { name: "Italy", iso: "IT", flag: "🇮🇹", dialCode: "+39" },
  { name: "Spain", iso: "ES", flag: "🇪🇸", dialCode: "+34" },
];

export const DEFAULT_COUNTRY_ISO = "EG";

export function getDialCode(iso: string): string {
  return COUNTRY_CODES.find((c) => c.iso === iso)?.dialCode ?? COUNTRY_CODES[0].dialCode;
}

interface CountryCodeSelectProps {
  value: string;
  onChange: (iso: string) => void;
  testId?: string;
}

export function CountryCodeSelect({ value, onChange, testId = "select-country-code" }: CountryCodeSelectProps) {
  const selected = COUNTRY_CODES.find((c) => c.iso === value) ?? COUNTRY_CODES[0];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[105px] shrink-0 px-2.5" data-testid={testId}>
        <SelectValue>
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true">{selected.flag}</span>
            {selected.dialCode}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {COUNTRY_CODES.map((country) => (
          <SelectItem key={country.iso} value={country.iso}>
            <span className="flex items-center gap-2">
              <span aria-hidden="true">{country.flag}</span>
              {country.name} ({country.dialCode})
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
