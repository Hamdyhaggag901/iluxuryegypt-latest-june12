// Builds srcset/sizes for Unsplash-hosted images so mobile viewports fetch a
// smaller file instead of the same desktop-sized (~2070px) image used everywhere.
// Non-Unsplash sources (e.g. CMS-uploaded files served from /api/assets/uploads)
// are passed through unchanged — they need a server-side resize pipeline, not
// a URL-param trick, which is out of scope here.

const UNSPLASH_WIDTHS = [480, 768, 1080, 1600, 2070];

export function isUnsplashUrl(url: string | undefined | null): boolean {
  return !!url && url.includes("images.unsplash.com");
}

export function getResponsiveImageProps(
  url: string | undefined | null,
  defaultWidth = 1920
): { src: string; srcSet?: string; sizes?: string } {
  if (!url) return { src: "" };
  if (!isUnsplashUrl(url)) return { src: url };

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
    srcSet: UNSPLASH_WIDTHS.map((w) => `${buildUrl(w)} ${w}w`).join(", "),
    sizes: "100vw",
  };
}
