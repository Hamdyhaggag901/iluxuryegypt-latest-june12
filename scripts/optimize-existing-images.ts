// Re-compresses already-stored images that predate the automatic WebP
// compression pipeline added to /api/cms/media (see server/image-optimize.ts).
// New uploads are compressed on the way in; this script is the one-time
// catch-up pass for whatever was uploaded before that pipeline existed:
// - hero_slides.mediaUrl/posterUrl: the homepage hero image (a 321KB JPG
//   that was the page's LCP element and the #1 flagged issue in a
//   Lighthouse/PageSpeed audit).
// - partners.logoUrl: partner hotel logos (Sofitel, Four Seasons, Oberoi,
//   Fairmont Nile City, St. Regis) uploaded at ~1600x888 despite never
//   rendering larger than ~140px wide anywhere in the app — recompressed
//   here at the same 400px cap the upload route now applies to new logo
//   uploads (?logo=true).
//
// Run against the real database with:
//   DATABASE_URL="postgresql://..." npx tsx scripts/optimize-existing-images.ts
//
// Safe to re-run: any URL that's already a small WebP under the 100KB
// target is left untouched and reported as "already optimized".

import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import { db, pool } from "../server/db";
import { heroSlides, partners } from "../shared/schema";
import { optimizeUploadedImage } from "../server/image-optimize";
import { eq } from "drizzle-orm";

const UPLOAD_DIR = path.resolve(import.meta.dirname, "..", "attached_assets", "uploads");
const UPLOAD_URL_PREFIX = "/api/assets/uploads/";
const TARGET_BYTES = 100 * 1024;

interface ReoptimizeResult {
  action: "optimized" | "already-optimized" | "skipped-external" | "skipped-missing-file" | "error";
  originalUrl: string;
  newUrl?: string;
  originalSize?: number;
  newSize?: number;
  detail?: string;
}

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

async function reoptimizeUrl(url: string | null, maxWidth: number = 1600): Promise<ReoptimizeResult | null> {
  if (!url) return null;

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
  // partner logos were often already under 100KB despite being 1600px wide
  // (logos compress well), so file size alone doesn't catch them.
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

async function run() {
  const slides = await db.select().from(heroSlides);
  console.log(`Found ${slides.length} hero_slides row(s).\n`);

  for (const slide of slides) {
    for (const [column, url] of [
      ["mediaUrl", slide.mediaType === "image" ? slide.mediaUrl : null],
      ["posterUrl", slide.posterUrl],
    ] as const) {
      const result = await reoptimizeUrl(url);
      if (!result) continue;

      const label = `hero_slides[${slide.id}].${column}`;
      if (result.action === "optimized") {
        const before = (result.originalSize! / 1024).toFixed(1);
        const after = (result.newSize! / 1024).toFixed(1);
        console.log(`✓ ${label}: ${before}KB -> ${after}KB  (${result.originalUrl} -> ${result.newUrl})`);

        if (column === "mediaUrl") {
          await db.update(heroSlides).set({ mediaUrl: result.newUrl! }).where(eq(heroSlides.id, slide.id));
        } else {
          await db.update(heroSlides).set({ posterUrl: result.newUrl! }).where(eq(heroSlides.id, slide.id));
        }
      } else if (result.action === "already-optimized") {
        console.log(`- ${label}: already optimized (${(result.originalSize! / 1024).toFixed(1)}KB)`);
      } else {
        console.log(`! ${label}: ${result.action} — ${result.detail}`);
      }
    }
  }

  const partnerRows = await db.select().from(partners);
  console.log(`\nFound ${partnerRows.length} partners row(s).\n`);

  for (const partner of partnerRows) {
    const result = await reoptimizeUrl(partner.logoUrl, 400);
    if (!result) continue;

    const label = `partners[${partner.id}].logoUrl (${partner.name})`;
    if (result.action === "optimized") {
      const before = (result.originalSize! / 1024).toFixed(1);
      const after = (result.newSize! / 1024).toFixed(1);
      console.log(`✓ ${label}: ${before}KB -> ${after}KB  (${result.originalUrl} -> ${result.newUrl})`);
      await db.update(partners).set({ logoUrl: result.newUrl! }).where(eq(partners.id, partner.id));
    } else if (result.action === "already-optimized") {
      console.log(`- ${label}: already optimized (${(result.originalSize! / 1024).toFixed(1)}KB)`);
    } else {
      console.log(`! ${label}: ${result.action} — ${result.detail}`);
    }
  }

  await pool.end();
  console.log("\nDone.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
