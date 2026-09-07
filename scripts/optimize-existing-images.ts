// Re-compresses already-stored images that predate the automatic WebP
// compression pipeline added to /api/cms/media (see server/image-optimize.ts).
// New uploads are compressed on the way in; this script is the one-time
// catch-up pass for whatever was uploaded before that pipeline existed,
// across every table with an image field:
// - hero_slides.mediaUrl/posterUrl: the homepage hero image.
// - partners.logoUrl and hotels.partnerLogoUrl: partner/trusted-partner
//   badge logos, capped at 400px (never render larger than ~140px wide).
// - hotels.image/gallery[]
// - categories.image
// - destinations.heroImage/gallery[]/attractions[].image (jsonb)
// - tours.heroImage/gallery[]/itinerary[].image (jsonb, optional per day)
//
// Run against the real database with:
//   DATABASE_URL="postgresql://..." npx tsx scripts/optimize-existing-images.ts
//
// Safe to re-run: any URL that's already a small-enough WebP is left
// untouched and reported as "already optimized".

import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import { db, pool } from "../server/db";
import { heroSlides, partners, hotels, categories, destinations, tours } from "../shared/schema";
import { optimizeUploadedImage } from "../server/image-optimize";
import { eq } from "drizzle-orm";

const UPLOAD_DIR = path.resolve(import.meta.dirname, "..", "attached_assets", "uploads");
const UPLOAD_URL_PREFIX = "/api/assets/uploads/";
const TARGET_BYTES = 100 * 1024;
const LOGO_MAX_WIDTH = 400;
const CONTENT_MAX_WIDTH = 1600;

interface ReoptimizeResult {
  action: "optimized" | "already-optimized" | "skipped-external" | "skipped-missing-file" | "error";
  originalUrl: string;
  newUrl?: string;
  originalSize?: number;
  newSize?: number;
  detail?: string;
}

let totalOriginalBytes = 0;
let totalNewBytes = 0;
let totalOptimizedCount = 0;

// The same photo is often reused across many rows/fields (this project's
// content scripts routinely share one placeholder across a dozen
// attraction entries — see content-updates/*.sql). Without caching, the
// first reference renames the file on disk; every later reference to that
// same original URL then finds nothing at the old path and gets skipped
// as "missing", silently leaving it pointed at a URL that now 404s.
// Keying by url+maxWidth (not just url) so a logo vs. content-width pass
// over the same file don't collide.
const urlCache = new Map<string, ReoptimizeResult | null>();

// Media is stored as absolute URLs in this database
// (https://iluxuryegypt.com/api/assets/uploads/x.jpg), not the relative
// form (/api/assets/uploads/x.jpg) the upload route itself returns.
// startsWith(UPLOAD_URL_PREFIX) alone missed every real row as a result —
// this pulls the path out of either form so both match.
function extractUploadPath(url: string): string | null {
  let pathname = url;
  try {
    pathname = new URL(url).pathname;
  } catch {
    // Not a valid absolute URL — already relative, use as-is.
  }
  return pathname.startsWith(UPLOAD_URL_PREFIX) ? pathname : null;
}

// Preserves the original URL's scheme+host (if it had one) when pointing
// at the newly optimized file, so an absolute URL stays absolute and a
// relative one stays relative — matching whatever form was already there.
function buildNewUrl(originalUrl: string, newFilename: string): string {
  const newPath = `${UPLOAD_URL_PREFIX}${newFilename}`;
  try {
    const parsed = new URL(originalUrl);
    parsed.pathname = newPath;
    return parsed.toString();
  } catch {
    return newPath;
  }
}

async function reoptimizeUrl(url: string | null | undefined, maxWidth: number): Promise<ReoptimizeResult | null> {
  if (!url) return null;

  const cacheKey = `${url}::${maxWidth}`;
  if (urlCache.has(cacheKey)) {
    return urlCache.get(cacheKey)!;
  }

  const result = await reoptimizeUrlUncached(url, maxWidth);
  urlCache.set(cacheKey, result);
  return result;
}

async function reoptimizeUrlUncached(url: string, maxWidth: number): Promise<ReoptimizeResult> {
  const uploadPath = extractUploadPath(url);
  if (!uploadPath) {
    return { action: "skipped-external", originalUrl: url, detail: "Not a local /api/assets/uploads/ URL" };
  }

  const filename = uploadPath.slice(UPLOAD_URL_PREFIX.length);
  const filePath = path.join(UPLOAD_DIR, filename);

  let stat;
  try {
    stat = await fs.stat(filePath);
  } catch {
    return { action: "skipped-missing-file", originalUrl: url, detail: `File not found: ${filePath}` };
  }

  // Re-run even an already-small WebP if it's wider than maxWidth allows —
  // logos in particular were often already under 100KB despite being
  // 1600px wide (logos compress well), so file size alone doesn't catch them.
  const isWebp = filename.toLowerCase().endsWith(".webp");
  if (isWebp && stat.size <= TARGET_BYTES) {
    const meta = await sharp(filePath).metadata();
    if (!meta.width || meta.width <= maxWidth) {
      return { action: "already-optimized", originalUrl: url, originalSize: stat.size };
    }
  }

  try {
    const optimized = await optimizeUploadedImage(UPLOAD_DIR, filename, maxWidth);
    if (!optimized) {
      return { action: "error", originalUrl: url, detail: "optimizeUploadedImage returned null" };
    }
    return {
      action: "optimized",
      originalUrl: url,
      newUrl: buildNewUrl(url, optimized.filename),
      originalSize: stat.size,
      newSize: optimized.size,
    };
  } catch (err: any) {
    return { action: "error", originalUrl: url, detail: err?.message || String(err) };
  }
}

// Tracks which original URLs have already been counted in the running
// totals, so a shared photo referenced by many rows (see urlCache above)
// only contributes its savings once instead of once per reference.
const countedUrls = new Set<string>();

function logResult(label: string, result: ReoptimizeResult) {
  if (result.action === "optimized") {
    const before = (result.originalSize! / 1024).toFixed(1);
    const after = (result.newSize! / 1024).toFixed(1);
    const reused = countedUrls.has(result.originalUrl) ? " [shared photo, already counted]" : "";
    console.log(`✓ ${label}: ${before}KB -> ${after}KB  (${result.originalUrl} -> ${result.newUrl})${reused}`);
    if (!countedUrls.has(result.originalUrl)) {
      countedUrls.add(result.originalUrl);
      totalOriginalBytes += result.originalSize!;
      totalNewBytes += result.newSize!;
      totalOptimizedCount += 1;
    }
  } else if (result.action === "already-optimized") {
    console.log(`- ${label}: already optimized (${(result.originalSize! / 1024).toFixed(1)}KB)`);
  } else {
    console.log(`! ${label}: ${result.action} — ${result.detail}`);
  }
}

// Handles a single text-column image field on one row.
async function processSingleColumn(
  label: string,
  url: string | null | undefined,
  maxWidth: number,
  onOptimized: (newUrl: string) => Promise<void>
) {
  const result = await reoptimizeUrl(url, maxWidth);
  if (!result) return;
  logResult(label, result);
  if (result.action === "optimized") await onOptimized(result.newUrl!);
}

// Handles a text[] gallery column on one row — rebuilds the whole array
// with any optimized URLs swapped in, then writes it back once.
async function processGalleryColumn(
  labelPrefix: string,
  urls: string[] | null | undefined,
  maxWidth: number,
  onChanged: (newUrls: string[]) => Promise<void>
) {
  if (!urls || urls.length === 0) return;
  let changed = false;
  const newUrls: string[] = [];
  for (let i = 0; i < urls.length; i++) {
    const result = await reoptimizeUrl(urls[i], maxWidth);
    if (!result) {
      newUrls.push(urls[i]);
      continue;
    }
    logResult(`${labelPrefix}[${i}]`, result);
    if (result.action === "optimized") {
      newUrls.push(result.newUrl!);
      changed = true;
    } else {
      newUrls.push(urls[i]);
    }
  }
  if (changed) await onChanged(newUrls);
}

// Handles a jsonb array of objects each carrying an optional `image` field
// (destinations.attractions, tours.itinerary) — rebuilds the array with
// any optimized image URLs swapped in, then writes it back once.
async function processJsonbImageArray(
  labelPrefix: string,
  items: Array<Record<string, any>> | null | undefined,
  maxWidth: number,
  onChanged: (newItems: Array<Record<string, any>>) => Promise<void>
) {
  if (!items || items.length === 0) return;
  let changed = false;
  const newItems: Array<Record<string, any>> = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const result = await reoptimizeUrl(item?.image, maxWidth);
    if (!result) {
      newItems.push(item);
      continue;
    }
    const itemLabel = item?.name || item?.title || i;
    logResult(`${labelPrefix}[${itemLabel}].image`, result);
    if (result.action === "optimized") {
      newItems.push({ ...item, image: result.newUrl });
      changed = true;
    } else {
      newItems.push(item);
    }
  }
  if (changed) await onChanged(newItems);
}

async function run() {
  // hero_slides
  const slides = await db.select().from(heroSlides);
  console.log(`\n=== hero_slides (${slides.length} row(s)) ===`);
  for (const slide of slides) {
    await processSingleColumn(
      `hero_slides[${slide.id}].mediaUrl`,
      slide.mediaType === "image" ? slide.mediaUrl : null,
      CONTENT_MAX_WIDTH,
      async (newUrl) => db.update(heroSlides).set({ mediaUrl: newUrl }).where(eq(heroSlides.id, slide.id))
    );
    await processSingleColumn(
      `hero_slides[${slide.id}].posterUrl`,
      slide.posterUrl,
      CONTENT_MAX_WIDTH,
      async (newUrl) => db.update(heroSlides).set({ posterUrl: newUrl }).where(eq(heroSlides.id, slide.id))
    );
  }

  // partners
  const partnerRows = await db.select().from(partners);
  console.log(`\n=== partners (${partnerRows.length} row(s)) ===`);
  for (const partner of partnerRows) {
    await processSingleColumn(
      `partners[${partner.name}].logoUrl`,
      partner.logoUrl,
      LOGO_MAX_WIDTH,
      async (newUrl) => db.update(partners).set({ logoUrl: newUrl }).where(eq(partners.id, partner.id))
    );
  }

  // hotels
  const hotelRows = await db.select().from(hotels);
  console.log(`\n=== hotels (${hotelRows.length} row(s)) ===`);
  for (const hotel of hotelRows) {
    await processSingleColumn(
      `hotels[${hotel.name}].image`,
      hotel.image,
      CONTENT_MAX_WIDTH,
      async (newUrl) => db.update(hotels).set({ image: newUrl }).where(eq(hotels.id, hotel.id))
    );
    await processSingleColumn(
      `hotels[${hotel.name}].partnerLogoUrl`,
      hotel.partnerLogoUrl,
      LOGO_MAX_WIDTH,
      async (newUrl) => db.update(hotels).set({ partnerLogoUrl: newUrl }).where(eq(hotels.id, hotel.id))
    );
    await processGalleryColumn(
      `hotels[${hotel.name}].gallery`,
      hotel.gallery,
      CONTENT_MAX_WIDTH,
      async (newGallery) => db.update(hotels).set({ gallery: newGallery }).where(eq(hotels.id, hotel.id))
    );
  }

  // categories
  const categoryRows = await db.select().from(categories);
  console.log(`\n=== categories (${categoryRows.length} row(s)) ===`);
  for (const category of categoryRows) {
    await processSingleColumn(
      `categories[${category.name}].image`,
      category.image,
      CONTENT_MAX_WIDTH,
      async (newUrl) => db.update(categories).set({ image: newUrl }).where(eq(categories.id, category.id))
    );
  }

  // destinations
  const destinationRows = await db.select().from(destinations);
  console.log(`\n=== destinations (${destinationRows.length} row(s)) ===`);
  for (const destination of destinationRows) {
    await processSingleColumn(
      `destinations[${destination.name}].heroImage`,
      destination.heroImage,
      CONTENT_MAX_WIDTH,
      async (newUrl) => db.update(destinations).set({ heroImage: newUrl }).where(eq(destinations.id, destination.id))
    );
    await processGalleryColumn(
      `destinations[${destination.name}].gallery`,
      destination.gallery,
      CONTENT_MAX_WIDTH,
      async (newGallery) => db.update(destinations).set({ gallery: newGallery }).where(eq(destinations.id, destination.id))
    );
    await processJsonbImageArray(
      `destinations[${destination.name}].attractions`,
      destination.attractions as Array<Record<string, any>> | null,
      CONTENT_MAX_WIDTH,
      async (newAttractions) => db.update(destinations).set({ attractions: newAttractions }).where(eq(destinations.id, destination.id))
    );
  }

  // tours
  const tourRows = await db.select().from(tours);
  console.log(`\n=== tours (${tourRows.length} row(s)) ===`);
  for (const tour of tourRows) {
    await processSingleColumn(
      `tours[${tour.title}].heroImage`,
      tour.heroImage,
      CONTENT_MAX_WIDTH,
      async (newUrl) => db.update(tours).set({ heroImage: newUrl }).where(eq(tours.id, tour.id))
    );
    await processGalleryColumn(
      `tours[${tour.title}].gallery`,
      tour.gallery,
      CONTENT_MAX_WIDTH,
      async (newGallery) => db.update(tours).set({ gallery: newGallery }).where(eq(tours.id, tour.id))
    );
    await processJsonbImageArray(
      `tours[${tour.title}].itinerary`,
      tour.itinerary as Array<Record<string, any>> | null,
      CONTENT_MAX_WIDTH,
      async (newItinerary) => db.update(tours).set({ itinerary: newItinerary }).where(eq(tours.id, tour.id))
    );
  }

  await pool.end();
  console.log(`\n=== Summary ===`);
  console.log(`${totalOptimizedCount} image(s) optimized.`);
  if (totalOptimizedCount > 0) {
    console.log(`Total: ${(totalOriginalBytes / 1024).toFixed(1)}KB -> ${(totalNewBytes / 1024).toFixed(1)}KB (saved ${((totalOriginalBytes - totalNewBytes) / 1024).toFixed(1)}KB)`);
  }
  console.log("Done.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
