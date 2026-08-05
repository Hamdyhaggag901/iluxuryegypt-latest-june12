import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
  /** When true, use `title` verbatim as document.title (no site name appended). */
  titleOverride?: boolean;
  /** Raw JSON-LD string or object to inject as <script type="application/ld+json">. */
  jsonLd?: string | object | Array<string | object>;
  /** Override the canonical URL. Defaults to current page URL on iluxuryegypt.com. */
  canonical?: string;
  /** Robots directive (e.g. "index,follow", "noindex,nofollow"). */
  robots?: string;
}

const SITE_NAME = "iLuxury Egypt";
const SITE_URL = "https://iluxuryegypt.com";
const DEFAULT_DESCRIPTION = "Experience Egypt in pure luxury with iLuxury Egypt. Curated bespoke stays across Egypt's most iconic destinations from Nile-side sanctuaries to Red Sea havens.";
const DEFAULT_IMAGE = `${SITE_URL}/api/assets/uploads/e1643e72-36f2-409f-9d0a-c8e894a66d3d.png`;

// Matches any casing/spacing/punctuation variant of the site name, optionally
// preceded by a separator, anchored to the end of the string. Kept in sync
// with the identical regex in server/seo-meta.ts so a title already ending in
// the site name (in any old formatting) never gets it appended twice.
const SITE_NAME_SUFFIX_RE = /[\s|\-–—:,]*i[.\s]?luxury\s?egypt\s*$/i;

function withSiteName(title: string): string {
  const trimmed = title.trim();
  const stripped = trimmed.replace(SITE_NAME_SUFFIX_RE, "").trim();
  if (!stripped) return SITE_NAME;
  return `${stripped} | ${SITE_NAME}`;
}

function setMeta(name: string, content: string, property = false) {
  const attr = property ? "property" : "name";
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

export function useSEO({ title, description, image, type = "website", titleOverride = false, jsonLd, canonical, robots }: SEOProps = {}) {
  useEffect(() => {
    const path = window.location.pathname;
    const pageTitle = title
      ? (titleOverride ? title : withSiteName(title))
      : document.title || SITE_NAME;
    const pageDescription = description || DEFAULT_DESCRIPTION;
    const pageImage = image || DEFAULT_IMAGE;
    const canonicalUrl = canonical?.trim() || `${SITE_URL}${path}`;

    // Set title
    if (title) {
      document.title = pageTitle;
    }

    // Set description
    setMeta("description", pageDescription);

    // Robots
    setMeta("robots", robots?.trim() || "index,follow");

    // Canonical
    setLink("canonical", canonicalUrl);

    // Open Graph
    setMeta("og:title", pageTitle, true);
    setMeta("og:description", pageDescription, true);
    setMeta("og:image", pageImage, true);
    setMeta("og:url", canonicalUrl, true);
    setMeta("og:type", type, true);
    setMeta("og:site_name", SITE_NAME, true);
    setMeta("og:locale", "en_US", true);

    // Twitter Card
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", pageTitle);
    setMeta("twitter:description", pageDescription);
    setMeta("twitter:image", pageImage);

    // JSON-LD structured data — managed via [data-seo-jsonld] tags so we
    // can clean up between page navigations.
    document
      .querySelectorAll('script[type="application/ld+json"][data-seo-jsonld="true"]')
      .forEach((el) => el.parentNode?.removeChild(el));

    if (jsonLd) {
      const items = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      for (const item of items) {
        if (!item) continue;
        let content: string | null = null;
        if (typeof item === "string") {
          const trimmed = item.trim();
          if (!trimmed) continue;
          try {
            // Validate it's parseable JSON before injecting.
            JSON.parse(trimmed);
            content = trimmed;
          } catch {
            content = null;
          }
        } else {
          try {
            content = JSON.stringify(item);
          } catch {
            content = null;
          }
        }
        if (!content) continue;
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute("data-seo-jsonld", "true");
        script.text = content;
        document.head.appendChild(script);
      }
    }

    return () => {
      document
        .querySelectorAll('script[type="application/ld+json"][data-seo-jsonld="true"]')
        .forEach((el) => el.parentNode?.removeChild(el));
    };
  }, [title, description, image, type, titleOverride, JSON.stringify(jsonLd ?? null)]);
}
