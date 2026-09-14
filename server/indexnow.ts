import type { Express, Request, Response } from "express";

// IndexNow lets us tell Bing, Yandex, Seznam and Naver that a URL changed,
// instead of waiting for a recrawl or clicking "Request Indexing" per page.
// Submitting to any one endpoint shares the ping with every participating
// engine, so api.indexnow.org is enough.
//
// Google does NOT participate. Its Indexing API is restricted to JobPosting
// and BroadcastEvent pages, so there is deliberately no Google call here; the
// sitemap remains how Google finds changes.
//
// Verification works by serving the key as a plain text file at the site root
// whose body is the key itself. That route is registered below, and only when
// a key is configured.
// Overridable so the payload can be pointed at a local receiver when testing,
// and so a different IndexNow-compatible endpoint can be used if ever needed.
// Submitting to any one of them propagates to the rest.
const INDEXNOW_ENDPOINT = process.env.INDEXNOW_ENDPOINT?.trim() || "https://api.indexnow.org/indexnow";
const HOST = "iluxuryegypt.com";
const SITE_URL = `https://${HOST}`;

// Protocol ceiling per request. Larger sets are split.
const MAX_URLS_PER_REQUEST = 10_000;

const KEY = (process.env.INDEXNOW_KEY ?? "").trim();

/** False when INDEXNOW_KEY is unset, which disables every path below silently. */
export function isIndexNowEnabled(): boolean {
  return KEY.length > 0;
}

export interface SubmitResult {
  ok: boolean;
  submitted: number;
  batches: number;
  status?: number;
  reason?: string;
}

function toAbsolute(pathOrUrl: string): string | null {
  const value = pathOrUrl.trim();
  if (!value) return null;
  try {
    const url = value.startsWith("http") ? new URL(value) : new URL(value, SITE_URL);
    // IndexNow rejects a payload whose URLs are not all on the declared host.
    return url.host === HOST ? url.toString() : null;
  } catch {
    return null;
  }
}

async function postBatch(urlList: string[]): Promise<{ ok: boolean; status?: number; reason?: string }> {
  const body = JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `${SITE_URL}/${KEY}.txt`,
    urlList,
  });

  const attempt = async () => {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body,
      signal: AbortSignal.timeout(15_000),
    });
    // 200 accepted, 202 accepted but key still being validated. Both are fine.
    return { ok: response.ok, status: response.status };
  };

  try {
    const first = await attempt();
    if (first.ok) return first;
    // One retry, for a timeout or a 5xx on their side. A 4xx means the payload
    // or the key is wrong and retrying changes nothing, but retrying once is
    // cheap enough not to special-case.
    const second = await attempt();
    return second.ok
      ? second
      : { ok: false, status: second.status, reason: `rejected with ${second.status}` };
  } catch (error) {
    try {
      const retry = await attempt();
      if (retry.ok) return retry;
      return { ok: false, status: retry.status, reason: `rejected with ${retry.status}` };
    } catch (retryError) {
      return { ok: false, reason: retryError instanceof Error ? retryError.message : String(retryError) };
    }
  }
}

/**
 * Submits paths or absolute URLs to IndexNow. Never throws and never rejects:
 * callers fire this after their own work has already succeeded, so a search
 * engine being unreachable must not turn a successful save into a failed
 * request. Failures are logged and reported in the return value instead.
 */
export async function submitUrls(urls: string[]): Promise<SubmitResult> {
  if (!isIndexNowEnabled()) {
    return { ok: false, submitted: 0, batches: 0, reason: "INDEXNOW_KEY is not set" };
  }

  const absolute = Array.from(
    new Set(urls.map(toAbsolute).filter((u): u is string => u !== null))
  );
  if (absolute.length === 0) {
    return { ok: true, submitted: 0, batches: 0 };
  }

  const batches: string[][] = [];
  for (let i = 0; i < absolute.length; i += MAX_URLS_PER_REQUEST) {
    batches.push(absolute.slice(i, i + MAX_URLS_PER_REQUEST));
  }

  let failure: { status?: number; reason?: string } | null = null;
  for (const batch of batches) {
    const result = await postBatch(batch);
    if (!result.ok && !failure) failure = { status: result.status, reason: result.reason };
  }

  if (failure) {
    console.error(
      `[indexnow] submission failed for ${absolute.length} url(s) in ${batches.length} batch(es): ${failure.reason ?? "unknown"}`
    );
    return { ok: false, submitted: absolute.length, batches: batches.length, ...failure };
  }

  console.log(`[indexnow] submitted ${absolute.length} url(s) in ${batches.length} batch(es)`);
  return { ok: true, submitted: absolute.length, batches: batches.length };
}

/**
 * Fire-and-forget wrapper for the CMS mutation handlers. Deliberately not
 * awaited by callers so a save never waits on an external API, and it swallows
 * everything so an unhandled rejection can't take the process down.
 */
export function notifyIndexNow(urls: string[]): void {
  if (!isIndexNowEnabled() || urls.length === 0) return;
  void submitUrls(urls).catch((error) => {
    console.error("[indexnow] unexpected failure:", error);
  });
}

// Public URL shapes, kept next to each other so a route change is a one-line
// fix here rather than a hunt through the mutation handlers.
const CATEGORY_BASE_PATH: Record<string, string> = {
  packages: "/luxury-egypt-tour-packages",
  "day-tours": "/egypt-day-tours",
  "nile-cruise": "/egypt-nile-cruise-tours",
};

export const publicUrl = {
  // Tours sit at the site root (App.tsx's catch-all "/:slug").
  tour: (slug: string) => `/${slug}`,
  category: (slug: string, categoryType?: string | null) =>
    `${CATEGORY_BASE_PATH[categoryType ?? "packages"] ?? CATEGORY_BASE_PATH.packages}/${slug}`,
  destination: (slug: string) => `/egypt-travel-guide/${slug}`,
  post: (slug: string) => `/blog/${slug}`,
  hotel: (slug: string) => `/hotel/${slug}`,
};

/**
 * Builds the notification list for a mutation. When a slug changes, BOTH the
 * old and the new URL are submitted: the old one now 301s and the engines need
 * to be told to re-fetch it, not just the new location.
 */
export function changedUrls(
  build: (slug: string) => string,
  previousSlug: string | null | undefined,
  nextSlug: string | null | undefined
): string[] {
  const urls: string[] = [];
  if (nextSlug) urls.push(build(nextSlug));
  if (previousSlug && previousSlug !== nextSlug) urls.push(build(previousSlug));
  return urls;
}

// Manual submissions are rate limited in memory. A single process serves this
// app, so a shared timestamp is enough; the point is stopping an admin from
// firing the whole sitemap at the API repeatedly, not distributed coordination.
const MANUAL_COOLDOWN_MS = 10 * 60 * 1000;
let lastManualSubmission = 0;

export function registerIndexNowRoutes(app: Express) {
  if (!isIndexNowEnabled()) {
    console.log("[indexnow] INDEXNOW_KEY not set, IndexNow is disabled");
    return;
  }

  // Ownership proof: a text file at the site root containing only the key.
  app.get(`/${KEY}.txt`, (_req: Request, res: Response) => {
    res.type("text/plain").send(KEY);
  });

  console.log(`[indexnow] enabled, key file served at /${KEY}.txt`);
}

/**
 * Backs the "Notify Search Engines" button in Admin Settings. Reads the live
 * sitemap rather than rebuilding the URL list, so the two can never drift.
 */
export async function submitSitemap(req: Request): Promise<SubmitResult & { rateLimited?: boolean; retryAfterSeconds?: number }> {
  if (!isIndexNowEnabled()) {
    return { ok: false, submitted: 0, batches: 0, reason: "INDEXNOW_KEY is not set" };
  }

  const elapsed = Date.now() - lastManualSubmission;
  if (lastManualSubmission > 0 && elapsed < MANUAL_COOLDOWN_MS) {
    return {
      ok: false,
      submitted: 0,
      batches: 0,
      rateLimited: true,
      retryAfterSeconds: Math.ceil((MANUAL_COOLDOWN_MS - elapsed) / 1000),
      reason: "Rate limited. The sitemap can be submitted once every 10 minutes.",
    };
  }

  // Fetched from this server's own origin rather than the canonical domain, so
  // it works the same in staging and locally.
  const origin = `${req.protocol}://${req.get("host")}`;
  let xml: string;
  try {
    const response = await fetch(`${origin}/sitemap.xml`, { signal: AbortSignal.timeout(20_000) });
    if (!response.ok) {
      return { ok: false, submitted: 0, batches: 0, reason: `sitemap.xml returned ${response.status}` };
    }
    xml = await response.text();
  } catch (error) {
    return {
      ok: false,
      submitted: 0,
      batches: 0,
      reason: error instanceof Error ? error.message : "could not read sitemap.xml",
    };
  }

  const urls = Array.from(xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)).map((m) => m[1]);
  if (urls.length === 0) {
    return { ok: false, submitted: 0, batches: 0, reason: "no URLs found in sitemap.xml" };
  }

  // Only start the cooldown once a submission is actually attempted, so a
  // failed read does not lock the button for ten minutes.
  lastManualSubmission = Date.now();
  return submitUrls(urls);
}
