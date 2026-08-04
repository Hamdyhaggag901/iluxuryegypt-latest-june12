import { storage } from "./storage";

const SITE_NAME = "I.LuxuryEgypt";
const SITE_URL = "https://iluxuryegypt.com";
const DEFAULT_DESCRIPTION =
  "Experience Egypt in pure luxury with I.LuxuryEgypt. Curated bespoke stays across Egypt's most iconic destinations from Nile-side sanctuaries to Red Sea havens.";
const DEFAULT_IMAGE = `${SITE_URL}/api/assets/uploads/e1643e72-36f2-409f-9d0a-c8e894a66d3d.png`;

export interface PageMeta {
  title: string;
  description: string;
  image: string;
  type: string;
}

function truncate(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1).trim()}…` : clean;
}

function withSiteName(title: string): string {
  return title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
}

// Every static route registered in client/src/App.tsx (i.e. anything that is
// NOT one of the dynamic `:slug` routes handled below). These must be
// excluded before the dynamic matchers run, otherwise a static page like
// `/egypt-tour-packages/classic-egypt` could be mistaken for a category or
// tour slug and get the wrong title/description injected.
const STATIC_PATHS = new Set<string>([
  "/",
  "/contact",
  "/about/who-we-are",
  "/about/iluxury-difference",
  "/about/your-experience",
  "/about/trusted-worldwide",
  "/destinations",
  "/egypt-tour-packages",
  "/egypt-tour-packages/classic-egypt",
  "/egypt-tour-packages/ultra-luxury",
  "/egypt-tour-packages/family-luxury",
  "/egypt-tour-packages/spiritual-journeys",
  "/egypt-day-tours",
  "/egypt-nile-cruise-tours",
  "/nile-cruises",
  "/stay",
  "/blog",
  "/faq",
  "/tailor-made",
  "/privacy-policy",
  "/terms-conditions",
  "/cookie-policy",
  "/responsible-travel",
  "/disclaimer",
]);

function isStaticOrAdminPath(pathname: string): boolean {
  const normalized = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  return STATIC_PATHS.has(normalized) || normalized.startsWith("/admin") || normalized.startsWith("/nile-cruises/");
}

/**
 * Resolves page-specific SEO metadata for a request path by looking up the
 * matching content record in the DB. Returns null when the path is a static
 * route (default index.html tags are fine) or no matching record is found —
 * callers should fall back to the default template untouched in that case.
 */
export async function resolvePageMeta(pathname: string): Promise<PageMeta | null> {
  if (isStaticOrAdminPath(pathname)) return null;

  try {
    let match: RegExpMatchArray | null;

    if ((match = pathname.match(/^\/blog\/([^/]+)\/?$/))) {
      const post = await storage.getPostBySlug(decodeURIComponent(match[1]));
      if (!post || post.status !== "published") return null;
      return {
        title: withSiteName(post.metaTitle || post.titleEn),
        description: truncate(post.metaDescription || post.excerpt || DEFAULT_DESCRIPTION, 160),
        image: post.featuredImage || DEFAULT_IMAGE,
        type: "article",
      };
    }

    if ((match = pathname.match(/^\/destinations\/([^/]+)\/?$/))) {
      const destination = await storage.getDestinationBySlug(decodeURIComponent(match[1]));
      if (!destination || destination.published === false) return null;
      return {
        title: withSiteName(destination.seoTitle || destination.name),
        description: truncate(
          destination.metaDescription || destination.shortDescription || destination.description || DEFAULT_DESCRIPTION,
          160,
        ),
        image: destination.ogImage || destination.heroImage || DEFAULT_IMAGE,
        type: "website",
      };
    }

    if ((match = pathname.match(/^\/hotel\/([^/]+)\/?$/))) {
      const hotel = await storage.getHotelBySlug(decodeURIComponent(match[1]));
      if (!hotel) return null;
      return {
        title: withSiteName(`${hotel.name} - ${hotel.location}`),
        description: truncate(hotel.description || DEFAULT_DESCRIPTION, 160),
        image: hotel.image || DEFAULT_IMAGE,
        type: "website",
      };
    }

    if (
      (match = pathname.match(
        /^\/(?:egypt-tour-packages|egypt-day-tours|egypt-nile-cruise-tours|categories)\/([^/]+)\/?$/,
      ))
    ) {
      const category = await storage.getCategoryBySlug(decodeURIComponent(match[1]));
      if (!category) return null;
      return {
        title: withSiteName(category.name),
        description: truncate(category.shortDescription || category.description || DEFAULT_DESCRIPTION, 160),
        image: category.image || DEFAULT_IMAGE,
        type: "website",
      };
    }

    // Tour detail is the catch-all `/:slug` route on the client, so it must
    // stay last and only match single-segment paths that aren't a known
    // static route (App.tsx registers all static routes before this one).
    if ((match = pathname.match(/^\/([^/]+)\/?$/))) {
      const tour = await storage.getTourBySlug(decodeURIComponent(match[1]));
      if (!tour || tour.published === false) return null;
      return {
        title: withSiteName(tour.title),
        description: truncate(tour.shortDescription || tour.description || DEFAULT_DESCRIPTION, 160),
        image: tour.heroImage || DEFAULT_IMAGE,
        type: "website",
      };
    }

    return null;
  } catch (err) {
    console.error("[seo-meta] Failed to resolve page metadata:", err);
    return null;
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

/**
 * Injects page-specific meta tags into a fully-formed index.html string.
 * Pure string replacement — no DOM parsing — so it stays cheap enough to run
 * on every request. Safe against HTML/attribute injection via escaping.
 */
export function injectMetaTags(html: string, url: string, meta: PageMeta): string {
  const canonicalUrl = `${SITE_URL}${url.split("?")[0]}`;
  const safeTitle = escapeHtml(meta.title);
  const safeDescription = escapeAttr(meta.description);
  const safeImage = escapeAttr(meta.image);
  const safeUrl = escapeAttr(canonicalUrl);

  let result = html;

  result = result.replace(/<title>[\s\S]*?<\/title>/, `<title>${safeTitle}</title>`);
  result = result.replace(
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${safeDescription}" />`,
  );
  result = result.replace(
    /<meta property="og:url" content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${safeUrl}" />`,
  );
  result = result.replace(
    /<meta property="og:title" content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${safeTitle}" />`,
  );
  result = result.replace(
    /<meta property="og:description" content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${safeDescription}" />`,
  );
  result = result.replace(
    /<meta property="og:image" content="[^"]*"\s*\/?>/,
    `<meta property="og:image" content="${safeImage}" />`,
  );
  result = result.replace(
    /<meta property="og:type" content="[^"]*"\s*\/?>/,
    `<meta property="og:type" content="${escapeAttr(meta.type)}" />`,
  );

  // Canonical link — add it if the template doesn't already have one.
  if (/<link rel="canonical"/.test(result)) {
    result = result.replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${safeUrl}" />`);
  } else {
    result = result.replace("</head>", `    <link rel="canonical" href="${safeUrl}" />\n  </head>`);
  }

  return result;
}
