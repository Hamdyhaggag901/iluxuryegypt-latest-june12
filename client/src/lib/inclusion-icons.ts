import {
  Plane,
  UtensilsCrossed,
  UserRound,
  Hotel,
  Shield,
  BookUser,
  Car,
  Check,
  X,
  type LucideIcon,
} from "lucide-react";

const KEYWORD_ICONS: Array<{ keywords: string[]; icon: LucideIcon }> = [
  { keywords: ["flight", "airfare"], icon: Plane },
  { keywords: ["meal", "breakfast", "lunch", "dinner", "dining"], icon: UtensilsCrossed },
  { keywords: ["concierge", "guide", "escort", "egyptologist"], icon: UserRound },
  { keywords: ["hotel", "accommodation", "resort", "cruise"], icon: Hotel },
  { keywords: ["insurance"], icon: Shield },
  { keywords: ["visa", "passport"], icon: BookUser },
  { keywords: ["transfer", "transport", "pickup", "drop-off", "vehicle"], icon: Car },
];

/**
 * Picks an icon for an inclusion/exclusion list item based on keywords in its text.
 * Falls back to a plain check/cross when nothing matches.
 */
export function getInclusionIcon(text: string, type: "included" | "excluded"): LucideIcon {
  const lower = text.toLowerCase();
  const match = KEYWORD_ICONS.find(({ keywords }) => keywords.some((k) => lower.includes(k)));
  if (match) return match.icon;
  return type === "included" ? Check : X;
}
