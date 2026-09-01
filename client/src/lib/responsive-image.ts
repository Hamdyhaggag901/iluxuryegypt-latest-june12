// Builds srcset/sizes so mobile viewports fetch a smaller file instead of the
// same desktop-sized image used everywhere. Two sources support this via a
// `?w=` query param: Unsplash-hosted images (Unsplash's own resizing), and
// CMS-uploaded files served from /api/assets/uploads/ (resized + converted to
// WebP on the fly by the server route, cached to disk after the first hit).
// Any other source is passed through unchanged.

const RESPONSIVE_WIDTHS = [480, 768, 1080, 1600, 2070];

export function isUnsplashUrl(url: string | undefined | null): boolean {
  return !!url && url.includes("images.unsplash.com");
}

export function isCmsUploadUrl(url: string | undefined | null): boolean {
  return !!url && url.includes("/api/assets/uploads/");
}

export function getResponsiveImageProps(
  url: string | undefined | null,
  defaultWidth = 1920
): { src: string; srcSet?: string; sizes?: string } {
  if (!url) return { src: "" };
  if (!isUnsplashUrl(url) && !isCmsUploadUrl(url)) return { src: url };

  const [base, query = ""] = url.split("?");
  const params = new URLSearchParams(query);
  params.delete("w");

  const buildUrl = (w: number) => {
    const p = new URLSearchParams(params);
    p.set("w", String(w));
    return `${base}?${p.toString()}`;
  };

  return {
    src: buildUrl(defaultWidth),
    srcSet: RESPONSIVE_WIDTHS.map((w) => `${buildUrl(w)} ${w}w`).join(", "),
    sizes: "100vw",
  };
}
