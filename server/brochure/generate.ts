// Renders a tour's brochure to a PDF, and caches it on disk.
//
// Two things here exist because of how this runs in production, on a single
// VPS handling every download:
//
//   1. ONE browser for the whole process. Puppeteer's launch is the expensive
//      part, around a second of CPU and a couple of hundred megabytes, and a
//      browser per download would have the box swapping under any real burst.
//      The launch is memoised in a module-level promise so concurrent first
//      requests share one launch rather than racing into several. Pages are
//      closed after every render; the browser never is.
//
//   2. A DISK CACHE keyed on the tour's updated_at. A render is roughly six
//      seconds; serving the cached file is a stat and a read. The cache is
//      only used when the file is NEWER than the row, so an admin editing the
//      itinerary invalidates it by saving, with nothing to purge by hand.

import fs from "fs/promises";
import path from "path";
import type { Browser } from "puppeteer";
import puppeteer from "puppeteer";
import { storage } from "../storage";
import type { Hotel } from "@shared/schema";
import { renderBrochureHtml } from "./template";

/**
 * Where the rendered files live.
 *
 * attached_assets is outside the build output on purpose: dist/ is replaced
 * wholesale on every deploy, and a cache that a deploy empties is a cache that
 * makes the first download after every deploy slow for no reason.
 */
export const BROCHURE_DIR =
  process.env.BROCHURE_CACHE_DIR ||
  path.resolve(process.cwd(), "attached_assets", "brochures");

let browserPromise: Promise<Browser> | null = null;

/**
 * The shared browser, launched at most once per process.
 *
 * --no-sandbox is required because the server runs as root, where Chrome
 * refuses to start otherwise. --disable-dev-shm-usage stops Chrome using the
 * default 64MB /dev/shm, which it will exhaust on a page of full bleed
 * photographs and then crash mid-render.
 */
function getBrowser(): Promise<Browser> {
  if (!browserPromise) {
    browserPromise = puppeteer
      .launch({
        headless: "new" as unknown as boolean,
        args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
      })
      .catch((error) => {
        // Without this the failed promise is cached forever and every later
        // request rejects with the same stale error, including after whatever
        // caused it has been fixed.
        browserPromise = null;
        throw error;
      });
  }
  return browserPromise;
}

/** Closes the shared browser. For tests and for a clean shutdown. */
export async function closeBrochureBrowser(): Promise<void> {
  if (!browserPromise) return;
  const current = browserPromise;
  browserPromise = null;
  try {
    (await current).close();
  } catch {
    // A browser that has already died is the state we wanted anyway.
  }
}

export function brochureFilename(slug: string): string {
  return `${slug}.pdf`;
}

export function brochurePath(slug: string): string {
  return path.join(BROCHURE_DIR, brochureFilename(slug));
}

async function readFreshCache(slug: string, tourUpdatedAt: Date | null): Promise<Buffer | null> {
  try {
    const file = brochurePath(slug);
    const stat = await fs.stat(file);
    if (tourUpdatedAt && stat.mtime.getTime() <= tourUpdatedAt.getTime()) return null;
    return await fs.readFile(file);
  } catch {
    return null;
  }
}

export interface GenerateResult {
  pdf: Buffer;
  cached: boolean;
}

/**
 * The brochure for `tourSlug`, from cache when it is newer than the tour row
 * and freshly rendered otherwise.
 */
export async function generateBrochurePdfWithMeta(tourSlug: string): Promise<GenerateResult> {
  const tour = await storage.getTourBySlug(tourSlug);
  if (!tour) throw new Error(`No tour with slug "${tourSlug}"`);

  const cached = await readFreshCache(tourSlug, tour.updatedAt ?? null);
  if (cached) return { pdf: cached, cached: true };

  // Hotels are fetched one at a time because that is the only accessor this
  // storage layer exposes. A missing id resolves to undefined rather than
  // throwing, so one unpublished hotel cannot fail the whole brochure.
  const hotelIds: string[] = Array.isArray(tour.hotelIds) ? tour.hotelIds : [];
  const hotels = (await Promise.all(hotelIds.map((id) => storage.getHotel(id)))).filter(
    (h): h is Hotel => Boolean(h)
  );

  const html = renderBrochureHtml(tour, hotels);
  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdf = Buffer.from(
      await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true })
    );

    // Written through a temp file and renamed, because rename is atomic on the
    // same filesystem: a second request arriving mid-write reads either the
    // old complete file or the new one, never a half written PDF.
    await fs.mkdir(BROCHURE_DIR, { recursive: true });
    const finalPath = brochurePath(tourSlug);
    const tmpPath = `${finalPath}.${process.pid}.${Date.now()}.tmp`;
    await fs.writeFile(tmpPath, pdf);
    await fs.rename(tmpPath, finalPath);

    return { pdf, cached: false };
  } finally {
    // Always, including on a render that threw. A leaked page holds its
    // renderer process and the leak is only visible as memory that never
    // comes back.
    await page.close().catch(() => undefined);
  }
}

export async function generateBrochurePdf(tourSlug: string): Promise<Buffer> {
  return (await generateBrochurePdfWithMeta(tourSlug)).pdf;
}
