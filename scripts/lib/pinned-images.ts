// Images a person chose by hand, which no automated run may replace.
//
// HOW TO PIN AN IMAGE
//
// Add its URL to PINNED_IMAGE_URLS below and commit. That is the whole
// mechanism, and it is a list rather than a database column on purpose: it
// lives in git, it is reviewable in a diff, and it keeps working if a row is
// reloaded from its SQL file.
//
// The URL is the one in the <img src> or in posts.featured_image, including
// the /api/assets/uploads/ prefix. Copy it from the Media Library or from the
// article body; it is the filename that identifies the image, not the position,
// so a pinned picture stays pinned if the article is restructured around it.
//
// A <figure data-pinned> in the body is honoured too, for anyone editing the
// SQL directly. It is the second mechanism rather than the first because the
// admin editor cannot represent a <figure> at all: TipTap's StarterKit has no
// node for one and drops it on parse, so an attribute added there would not
// survive a save. The URL list is the one that always works.

/** Exact image URLs that automated runs must leave alone. */
export const PINNED_IMAGE_URLS: string[] = [
  // Chosen by hand after the automated runs produced engravings for these two.
  // coptic-cairo, before <h2>The Coptic Museum</h2>
  "/api/assets/uploads/013cb0e7-55ae-4e81-8108-f08a114c39e1.webp",
  // medinet-habu, before <h2>How Long to Allow, and When</h2>
  "/api/assets/uploads/6610f691-0fd6-4100-9f60-3673faea671b.webp",
];

const pinned = new Set(PINNED_IMAGE_URLS.map(normalise));

/**
 * Compares by filename rather than by full path.
 *
 * The same upload is reachable as /api/assets/uploads/x.webp and as
 * /uploads/x.webp depending on which script wrote the row, and a pin that
 * depended on which of those was stored would be a pin that silently stopped
 * working.
 */
function normalise(url: string): string {
  const clean = url.trim().split(/[?#]/)[0];
  return (clean.split("/").pop() ?? clean).toLowerCase();
}

/** True when this exact image was placed by hand and must not be replaced. */
export function isPinnedUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return pinned.has(normalise(url));
}

/** The <figure> block ending at `end`, or null if there is no figure there. */
export function figureEndingAt(body: string, end: number): { start: number; end: number; html: string } | null {
  const close = body.lastIndexOf("</figure>", end);
  if (close === -1) return null;
  const start = body.lastIndexOf("<figure", close);
  if (start === -1) return null;
  const stop = close + "</figure>".length;
  // Anything but whitespace between the close tag and `end` means this figure
  // is not the one sitting at that position.
  if (body.slice(stop, end).trim() !== "") return null;
  return { start, end: stop, html: body.slice(start, stop) };
}

/** True when a figure is pinned, by its src or by an explicit data-pinned. */
export function isPinnedFigure(figureHtml: string): boolean {
  if (/<figure[^>]*\bdata-pinned\b/i.test(figureHtml)) return true;
  const src = figureHtml.match(/<img[^>]*\bsrc="([^"]+)"/i)?.[1];
  return isPinnedUrl(src);
}

/** Every pinned image URL present in a body, by filename. */
export function pinnedImagesIn(body: string): Set<string> {
  const found = new Set<string>();
  for (const m of body.matchAll(/<img[^>]*\bsrc="([^"]+)"/gi)) {
    if (isPinnedUrl(m[1])) found.add(normalise(m[1]));
  }
  return found;
}

/**
 * Names any pinned image that was in `before` and is not in `after`.
 *
 * The position based checks should make this impossible, and that is exactly
 * why it is worth having: it does not depend on the H2 indices in the spec
 * being right, so a stale index or a restructured article cannot quietly cost
 * a picture someone chose by hand.
 */
export function pinnedImagesLost(before: string, after: string): string[] {
  const had = pinnedImagesIn(before);
  const has = pinnedImagesIn(after);
  return [...had].filter((f) => !has.has(f));
}
