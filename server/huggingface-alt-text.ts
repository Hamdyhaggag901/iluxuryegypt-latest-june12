// Hugging Face Inference API-driven alt text for the "Bulk Auto Alt Text"
// admin job — replaces an earlier Google Cloud Vision-based version (see
// git history) that this project's account has no billing budget for.
// Hugging Face's free serverless Inference API has no monetary billing risk
// (requests are just rate-limited, never charged), so unlike that Vision
// version this deliberately does NOT persist a monthly usage counter or
// hard-refuse to start a run — it follows the same reactive throttling
// philosophy already used for Pexels/Pixabay/Unsplash in routes.ts: a
// queued, capped call wrapper that throws once the window's cap is hit, and
// the caller (the bulk job below, in routes.ts) stops the run gracefully
// when that happens rather than hammering further requests that would also
// fail.
//
// Auth: relies entirely on HUGGINGFACE_API_TOKEN already present on the
// server's .env — this module never logs or embeds the token itself.
//
// Model: Salesforce/blip-image-captioning-large — a well-established, free,
// general-purpose image captioning model on the Inference API. It describes
// a photo's visual content (e.g. "a group of pyramids in a desert") but,
// unlike Google Vision's LANDMARK_DETECTION, has no notion of named
// landmarks — so the luxury phrase below leans on whatever place-name
// context the caller already has (an itinerary day's placeName, or a
// tour-level hint for gallery photos with no per-image location) rather
// than trying to extract a landmark name from the image itself.

import { ACTIVITY_ALT_PHRASES, withArticle } from "@shared/itinerary-detection";

const HF_MODEL = "Salesforce/blip-image-captioning-large";
const HF_API_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

// Hugging Face's actual current free-tier rate limit could not be confirmed
// from this sandbox (huggingface.co is blocked by the outbound network
// proxy here, same as every other provider checked this session) — this is
// a deliberately conservative placeholder. Verify against the account's
// real usage on huggingface.co/settings and raise HF_MAX_PER_HOUR if it
// turns out more generous.
const HF_MAX_PER_HOUR = 60;
const HF_MIN_SPACING_MS = 1500;

const hfCallTimestamps: number[] = [];
let hfQueueTail: Promise<void> = Promise.resolve();

export class HuggingFaceRateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "HuggingFaceRateLimitError";
  }
}

async function throttledHFCall<T>(fn: () => Promise<T>): Promise<T> {
  const run = async (): Promise<T> => {
    const now = Date.now();
    while (hfCallTimestamps.length && now - hfCallTimestamps[0] > 60 * 60 * 1000) {
      hfCallTimestamps.shift();
    }
    if (hfCallTimestamps.length >= HF_MAX_PER_HOUR) {
      throw new HuggingFaceRateLimitError("Hugging Face hourly rate limit reached — try again later.");
    }
    hfCallTimestamps.push(Date.now());
    return fn();
  };

  const result = hfQueueTail.then(run);
  hfQueueTail = result.then(
    () => new Promise<void>((r) => setTimeout(r, HF_MIN_SPACING_MS)),
    () => new Promise<void>((r) => setTimeout(r, HF_MIN_SPACING_MS))
  );
  return result;
}

export function isHuggingFaceConfigured(): boolean {
  return Boolean(process.env.HUGGINGFACE_API_TOKEN);
}

async function requestCaption(imageBytes: Buffer): Promise<Response> {
  const token = process.env.HUGGINGFACE_API_TOKEN;
  return throttledHFCall(() =>
    fetch(HF_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/octet-stream",
      },
      body: imageBytes,
    })
  );
}

/** Calls the captioning model and returns its raw generated caption text.
 * Handles the Inference API's "model is currently loading" cold-start
 * response (503, with an estimated_time) by waiting briefly and retrying
 * once. Throws HuggingFaceRateLimitError on a real 429. */
async function captionImage(imageBytes: Buffer): Promise<string> {
  if (!isHuggingFaceConfigured()) throw new Error("Hugging Face is not configured");

  let response = await requestCaption(imageBytes);

  if (response.status === 503) {
    const body = await response.json().catch(() => ({}) as any);
    const waitSeconds = Math.min(Math.max(Number(body?.estimated_time) || 5, 2), 20);
    await new Promise((r) => setTimeout(r, waitSeconds * 1000));
    response = await requestCaption(imageBytes);
  }

  if (response.status === 429) {
    throw new HuggingFaceRateLimitError("Hugging Face rate limit reached");
  }
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Hugging Face responded with ${response.status}${text ? `: ${text.slice(0, 200)}` : ""}`);
  }

  const data = await response.json();
  const caption = Array.isArray(data) ? data[0]?.generated_text : (data as any)?.generated_text;
  if (!caption || typeof caption !== "string") throw new Error("Hugging Face returned no caption");
  return caption;
}

// BLIP captions routinely open with a stock lead-in ("a photo of...", "an
// image of...") that reads redundantly once it's the lead phrase of an alt
// text — stripped before composing the luxury version below.
function stripCaptionBoilerplate(caption: string): string {
  return caption.replace(/^(a |an )?(photo|picture|image)\s+of\s+/i, "").trim();
}

const ALT_TEXT_VARIANT_SUFFIXES = [
  ", captured at golden hour",
  ", from an exclusive morning departure",
  ", arranged as a private evening experience",
  ", during an intimate small-group visit",
];

// Trailing words a hard word-count cut can leave dangling mid-clause
// ("...hotel lobby with") — stripped so a truncated caption still reads as
// a complete phrase rather than trailing off on a preposition or article.
const DANGLING_TRAILING_WORD = /\s+(with|and|of|in|at|on|for|the|a|an|to|by|from)$/i;

function truncateToMaxWords(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/);
  let result = words.length <= maxWords ? text.trim() : words.slice(0, maxWords).join(" ").replace(/[,;:]+$/, "");
  while (DANGLING_TRAILING_WORD.test(result)) {
    result = result.replace(DANGLING_TRAILING_WORD, "");
  }
  return result;
}

export interface CaptionAltTextContext {
  caption: string;
  /** A specific, known place name for this exact photo (an itinerary day's
   * placeName) — preferred over locationHint when available. */
  placeNameHint?: string;
  /** A broader fallback hint (e.g. the tour's own title or first
   * destination) used only when placeNameHint isn't available, such as for
   * a tour-level gallery photo with no per-image location. */
  locationHint?: string;
  variantIndex?: number;
}

/** Composes the same luxury-toned copy as suggestDayPhotoAlt/the earlier
 * Vision version, but driven by a Hugging Face caption plus whatever place
 * context the caller already has — reuses ACTIVITY_ALT_PHRASES/withArticle
 * from shared/itinerary-detection.ts so all three alt-text paths in this
 * codebase read as one consistent voice. Targets roughly 8-15 words. */
export function buildHuggingFaceAltText(ctx: CaptionAltTextContext): string {
  const matched = ACTIVITY_ALT_PHRASES.find(({ pattern }) => pattern.test(ctx.caption));
  const place = ctx.placeNameHint?.trim();

  let base: string;
  if (place) {
    base = matched
      ? `${matched.activity} at ${withArticle(place)} ${matched.qualifier}`
      : `Private luxury tour of ${withArticle(place)}, Egypt`;
  } else if (matched) {
    const where = ctx.locationHint?.trim() ? ` in ${ctx.locationHint.trim()}` : "";
    base = `${matched.activity}${where} ${matched.qualifier}`;
  } else {
    // Only the free-text portion (the model's own caption) gets bounded
    // here — place names, hotel names and the curated activity/qualifier
    // phrases above are never touched, so a long location like "Old
    // Cataract Hotel" can never end up cut mid-word the way truncating the
    // whole composed sentence risked.
    const subject = truncateToMaxWords(stripCaptionBoilerplate(ctx.caption) || "an exclusive Egypt experience", 6);
    const where = ctx.locationHint?.trim() || "Egypt";
    base = `Private luxury moment featuring ${subject} in ${where}, captured for an exclusive journey`;
  }

  if (ctx.variantIndex && ctx.variantIndex > 0) {
    base += ALT_TEXT_VARIANT_SUFFIXES[(ctx.variantIndex - 1) % ALT_TEXT_VARIANT_SUFFIXES.length];
  }
  return base;
}

export type AltTextImageSource = { content: Buffer } | { imageUri: string };

/** Captions the image (downloading it first if given as a URL) and composes
 * the luxury alt text in one call — mirrors the earlier Vision module's
 * analyzeImageForAltText shape so routes.ts's job loop barely changed. */
export async function analyzeImageForAltText(
  source: AltTextImageSource,
  context: Omit<CaptionAltTextContext, "caption"> = {}
): Promise<string> {
  let imageBytes: Buffer;
  if ("content" in source) {
    imageBytes = source.content;
  } else {
    const response = await fetch(source.imageUri);
    if (!response.ok) throw new Error(`Failed to download image (${response.status})`);
    imageBytes = Buffer.from(await response.arrayBuffer());
  }

  const caption = await captionImage(imageBytes);
  return buildHuggingFaceAltText({ ...context, caption });
}
