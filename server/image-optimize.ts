import path from "path";
import sharp from "sharp";

// Every uploaded image (Media Library, hotels, tours — they all share this
// one function) is converted to WebP and compressed toward a 50-100KB
// target so admins never have to think about image weight themselves.
// Never inflates a naturally small/simple image up to hit the 50KB floor —
// that would work against the point of compressing it in the first place.
export async function optimizeUploadedImage(
  uploadDir: string,
  savedFilename: string,
  maxWidth: number = 1600
): Promise<{ filename: string; size: number } | null> {
  const fs = await import("fs/promises");
  const originalPath = path.join(uploadDir, savedFilename);
  const webpFilename = `${path.parse(savedFilename).name}.webp`;
  const webpPath = path.join(uploadDir, webpFilename);

  const TARGET_BYTES = 100 * 1024;
  const compressAtWidth = async (width: number): Promise<Buffer> => {
    let quality = 82;
    let buf = await sharp(originalPath).resize({ width, withoutEnlargement: true }).webp({ quality }).toBuffer();
    while (buf.length > TARGET_BYTES && quality > 35) {
      quality -= 12;
      buf = await sharp(originalPath).resize({ width, withoutEnlargement: true }).webp({ quality }).toBuffer();
    }
    return buf;
  };

  // Quality alone can't hit the target on genuinely high-entropy images
  // (dense texture, scanned noise) — once quality bottoms out, step the
  // dimensions down too rather than shipping an oversized file. Capped at
  // maxWidth so callers with a known small display size (partner logos,
  // rendered at ~140px wide) don't ship pixels nothing on the page uses.
  const widths = [maxWidth, 1200, 1000, 800, 600].filter((w) => w <= maxWidth);
  let buffer = await compressAtWidth(widths[0]);
  for (let i = 1; i < widths.length && buffer.length > TARGET_BYTES; i++) {
    buffer = await compressAtWidth(widths[i]);
  }

  await fs.writeFile(webpPath, buffer);
  if (webpPath !== originalPath) {
    await fs.unlink(originalPath).catch(() => {});
  }

  return { filename: webpFilename, size: buffer.length };
}
