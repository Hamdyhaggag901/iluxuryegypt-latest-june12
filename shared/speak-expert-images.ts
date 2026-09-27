// The images used by the "Speak to an Expert" modal, made editable from the
// CMS without a code change.
//
// One definition shared by every surface that has to agree on it: the seed SQL
// writes these keys, the public endpoint reads them, the admin settings page
// renders one field per key, and the modal falls back to these defaults when
// the request fails or the stored value is empty. Keeping the list and the
// fallback URLs here is what stops the modal's fallback drifting away from
// what was actually seeded.
//
// TO ADD ANOTHER IMAGE: add the key to SPEAK_EXPERT_IMAGE_KEYS, its current
// hardcoded URL to SPEAK_EXPERT_IMAGE_DEFAULTS and a label to
// SPEAK_EXPERT_IMAGE_LABELS, then add one INSERT to
// content-updates/seed-speak-expert-images.sql. Nothing else needs changing:
// the endpoint, the admin field list and the modal all iterate this array.
//
// The modal is a single step form, so there is one image today. Per step keys
// (speak_expert_image_step_1 and so on) would be CMS fields pointing at images
// that do not exist, which is why they are not seeded.

export const SPEAK_EXPERT_IMAGE_KEYS = [
  "speak_expert_image_main",
] as const;

export type SpeakExpertImageKey = (typeof SPEAK_EXPERT_IMAGE_KEYS)[number];

/**
 * The URL each key had hardcoded before this was made editable.
 *
 * These are the seeded values and the client side fallback, so a failed
 * request, an empty stored value or an unseeded database all render exactly
 * what the site rendered before.
 */
export const SPEAK_EXPERT_IMAGE_DEFAULTS: Record<SpeakExpertImageKey, string> = {
  speak_expert_image_main:
    "https://iluxuryegypt.com/api/assets/uploads/ee366046-f7f3-4c54-a946-878414a60aa0.jpg",
};

/** Field labels and help text for the admin settings section. */
export const SPEAK_EXPERT_IMAGE_LABELS: Record<
  SpeakExpertImageKey,
  { label: string; description: string }
> = {
  speak_expert_image_main: {
    label: "Modal side image",
    description:
      "The tall photograph beside the form in the Speak to an Expert modal. Hidden on small screens, so it is only seen from tablet width upwards.",
  },
};

/** True when `key` is one of the keys this feature owns. */
export function isSpeakExpertImageKey(key: string): key is SpeakExpertImageKey {
  return (SPEAK_EXPERT_IMAGE_KEYS as readonly string[]).includes(key);
}

/**
 * Merges stored values over the defaults.
 *
 * A stored value only wins when it is a non-empty string, so a row that exists
 * but holds an empty value falls back rather than rendering a broken image.
 */
export function resolveSpeakExpertImages(
  stored: Record<string, string | null | undefined> | undefined | null,
): Record<SpeakExpertImageKey, string> {
  const resolved = { ...SPEAK_EXPERT_IMAGE_DEFAULTS };
  if (!stored) return resolved;
  for (const key of SPEAK_EXPERT_IMAGE_KEYS) {
    const value = stored[key];
    if (typeof value === "string" && value.trim()) {
      resolved[key] = value.trim();
    }
  }
  return resolved;
}
