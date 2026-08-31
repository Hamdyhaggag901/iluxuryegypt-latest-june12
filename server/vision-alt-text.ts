// Google Cloud Vision-driven alt text for the "Bulk Auto Alt Text" admin job.
// Unlike suggestDayPhotoAlt (shared/itinerary-detection.ts), which mines an
// admin-written description for a recognizable activity, this analyzes the
// photo itself (label + landmark detection) and reuses the same luxury-
// phrase dictionary to keep the tone consistent across both paths. Also
// owns the monthly free-tier quota guard: usage is persisted in the
// existing `settings` key/value table (via storage.getSetting/upsertSetting)
// rather than kept in memory, so a server restart never loses track of how
// much of the month's quota has already been spent.
//
// Auth: relies entirely on GOOGLE_APPLICATION_CREDENTIALS pointing at a
// service-account JSON file already present on the server — this module
// never reads, embeds, or logs that file's contents itself; the Vision SDK
// handles it internally via Application Default Credentials.

import { ImageAnnotatorClient, protos } from "@google-cloud/vision";
import { storage } from "./storage";
import { ACTIVITY_ALT_PHRASES, withArticle } from "@shared/itinerary-detection";

// Google's Vision API free tier is documented as 1,000 units/month. This
// project has no way to confirm from here whether that limit applies
// per-feature or as one shared pool across LABEL_DETECTION +
// LANDMARK_DETECTION (network access to Google's docs is blocked in the
// dev sandbox this was built in) — so it conservatively assumes the
// stricter shared-pool reading and charges both features against one
// combined budget. If your Google Cloud Console quota page shows a more
// generous real limit after the first run, adjust VISION_MONTHLY_LIMIT (or
// UNITS_PER_IMAGE, if it turns out each feature has its own 1,000/month)
// accordingly.
export const VISION_MONTHLY_LIMIT = 1000;
export const UNITS_PER_IMAGE = 2; // LABEL_DETECTION + LANDMARK_DETECTION, one call each per image

const VISION_USAGE_SETTING_KEY = "vision_alt_text_usage";

export class VisionQuotaExceededError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VisionQuotaExceededError";
  }
}

export function isVisionConfigured(): boolean {
  return Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS);
}

let cachedClient: ImageAnnotatorClient | null | undefined;

function getVisionClient(): ImageAnnotatorClient {
  if (cachedClient === undefined) {
    cachedClient = isVisionConfigured() ? new ImageAnnotatorClient() : null;
  }
  if (!cachedClient) throw new Error("Google Vision is not configured");
  return cachedClient;
}

function currentMonthKey(): string {
  return new Date().toISOString().slice(0, 7); // "YYYY-MM"
}

interface VisionUsageRecord {
  month: string;
  unitsUsed: number;
}

async function getVisionUsage(): Promise<VisionUsageRecord> {
  const month = currentMonthKey();
  const setting = await storage.getSetting(VISION_USAGE_SETTING_KEY);
  if (!setting) return { month, unitsUsed: 0 };
  try {
    const parsed = JSON.parse(setting.value) as VisionUsageRecord;
    // A stored record from a previous month means the counter has already
    // rolled over — treat this month as fresh rather than carrying it forward.
    if (parsed.month !== month || typeof parsed.unitsUsed !== "number") return { month, unitsUsed: 0 };
    return parsed;
  } catch {
    return { month, unitsUsed: 0 };
  }
}

async function recordVisionUsage(unitsUsed: number, adminUserId: string): Promise<void> {
  const month = currentMonthKey();
  await storage.upsertSetting(VISION_USAGE_SETTING_KEY, JSON.stringify({ month, unitsUsed }), adminUserId);
}

export interface VisionQuotaCheck {
  ok: boolean;
  alreadyUsed: number;
  imagesToProcess: number;
  unitsNeeded: number;
  remaining: number;
  limit: number;
}

/** Hard pre-check: called before the bulk job is allowed to start at all,
 * so an admin sees the exact numbers and a refusal *before* any Vision API
 * call happens, never a mid-run surprise. */
export async function checkVisionQuota(imagesToProcess: number): Promise<VisionQuotaCheck> {
  const usage = await getVisionUsage();
  const unitsNeeded = imagesToProcess * UNITS_PER_IMAGE;
  const remaining = VISION_MONTHLY_LIMIT - usage.unitsUsed;
  return {
    ok: unitsNeeded <= remaining,
    alreadyUsed: usage.unitsUsed,
    imagesToProcess,
    unitsNeeded,
    remaining,
    limit: VISION_MONTHLY_LIMIT,
  };
}

// A handful of Vision labels that come back on nearly every outdoor/
// landmark photo but describe nothing specific about the scene — filtered
// out only for the no-landmark-recognized fallback phrase below, so it
// doesn't read as "Photograph and Sky" instead of an actual subject.
const GENERIC_LABEL_BLOCKLIST =
  /^(sky|cloud|photograph|photography|font|art|tourism|travel|vacation|world|adaptation|tourist attraction|monument|landmark|historic site|ancient history|building|architecture|history)$/i;

function truncateToMaxWords(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text.trim();
  return words.slice(0, maxWords).join(" ").replace(/[,;:]+$/, "");
}

export interface VisionAnalysis {
  labels: string[]; // description strings, highest confidence first
  landmarkName?: string;
}

/** Composes the same luxury-toned copy as suggestDayPhotoAlt, but driven by
 * what Vision actually saw in the photo rather than admin-written text —
 * reuses ACTIVITY_ALT_PHRASES/withArticle from shared/itinerary-detection.ts
 * so both paths read as one consistent voice. Targets roughly 8-15 words. */
export function buildVisionAltText(analysis: VisionAnalysis, placeNameHint?: string): string {
  const landmarkName = analysis.landmarkName?.trim() || placeNameHint?.trim();
  const searchText = [analysis.landmarkName, ...analysis.labels].filter(Boolean).join(" ");
  const matched = ACTIVITY_ALT_PHRASES.find(({ pattern }) => pattern.test(searchText));

  if (landmarkName) {
    const phrase = matched
      ? `${matched.activity} at ${withArticle(landmarkName)} ${matched.qualifier}`
      : `Private luxury tour of ${withArticle(landmarkName)}, Egypt`;
    return truncateToMaxWords(phrase, 15);
  }

  const usefulLabels = analysis.labels.filter((l) => !GENERIC_LABEL_BLOCKLIST.test(l.trim())).slice(0, 2);
  const subject = usefulLabels.length > 0 ? usefulLabels.join(" and ").toLowerCase() : "an exclusive Egypt experience";
  return truncateToMaxWords(`Private luxury moment featuring ${subject}, captured for an exclusive Egypt journey`, 15);
}

type VisionImageSource = { content: Buffer } | { imageUri: string };

/** Runs LABEL_DETECTION + LANDMARK_DETECTION on one image and returns a
 * ready-to-save alt text string. Throws VisionQuotaExceededError if
 * Google's own API reports the quota is exhausted (a safety net alongside
 * checkVisionQuota's pre-check, in case usage happened outside this app on
 * the same Google Cloud project). */
export async function analyzeImageForAltText(source: VisionImageSource, placeNameHint?: string): Promise<string> {
  const client = getVisionClient();
  // The Vision API's own image shape nests imageUri under `source`, while
  // raw bytes stay flat under `content` — VisionImageSource keeps the
  // simpler flat shape for callers and this is the one place that adapts it.
  const image = "content" in source ? { content: source.content } : { source: { imageUri: source.imageUri } };
  const [result] = await client.annotateImage({
    image,
    features: [
      { type: protos.google.cloud.vision.v1.Feature.Type.LABEL_DETECTION, maxResults: 8 },
      { type: protos.google.cloud.vision.v1.Feature.Type.LANDMARK_DETECTION, maxResults: 1 },
    ],
  });

  if (result.error) {
    const message = result.error.message || "Vision analysis failed";
    if (result.error.code === 8 || /quota|resource_exhausted/i.test(message)) {
      throw new VisionQuotaExceededError(message);
    }
    throw new Error(message);
  }

  const labels = (result.labelAnnotations || [])
    .filter((l) => (l.score ?? 0) >= 0.6)
    .map((l) => l.description || "")
    .filter(Boolean);
  const landmarkName = result.landmarkAnnotations?.[0]?.description || undefined;

  return buildVisionAltText({ labels, landmarkName }, placeNameHint);
}

export { recordVisionUsage, getVisionUsage };
