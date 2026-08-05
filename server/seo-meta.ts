import { storage } from "./storage";

const SITE_NAME = "iLuxury Egypt";
const SITE_URL = "https://iluxuryegypt.com";
const DEFAULT_DESCRIPTION =
  "Experience Egypt in pure luxury with iLuxury Egypt. Curated bespoke stays across Egypt's most iconic destinations from Nile-side sanctuaries to Red Sea havens.";
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

// Matches any casing/spacing/punctuation variant of the site name, optionally
// preceded by a separator, anchored to the end of the string. Handles content
// authored as "iLuxury Egypt", "I.LuxuryEgypt", "I LuxuryEgypt", etc. so it
// can be stripped before re-appending the canonical suffix exactly once.
const SITE_NAME_SUFFIX_RE = /[\s|\-–—:,]*i[.\s]?luxury\s?egypt\s*$/i;

function withSiteName(title: string): string {
  const trimmed = title.trim();
  const stripped = trimmed.replace(SITE_NAME_SUFFIX_RE, "").trim();
  if (!stripped) return SITE_NAME;
  return `${stripped} | ${SITE_NAME}`;
}

interface StaticMeta {
  title: string;
  description: string;
}

// Every static route registered in client/src/App.tsx (i.e. anything that is
// NOT one of the dynamic `:slug` routes handled by the DB-backed matchers
// below). Titles/descriptions are copied verbatim from each page's own
// `useSEO(...)` call in the client so the server-rendered tags match exactly
// what React would set after hydration. These are checked BEFORE the dynamic
// matchers, which also protects paths like `/egypt-tour-packages/classic-egypt`
// from being mistaken for a category slug.
const STATIC_PAGE_META: Record<string, StaticMeta> = {
  "/": {
    title: "Egypt Luxury Tours | iLuxury Egypt - Bespoke Private Travel",
    description:
      "Private Egypt luxury tours crafted for discerning travelers. Exclusive Pyramid access, 5-star Nile cruises & Egyptologist guides. Start planning your bespoke journey today.",
  },
  "/contact": {
    title: "Contact Us - Luxury Egypt Travel",
    description:
      "Get in touch with I.LuxuryEgypt. Plan your bespoke luxury Egypt vacation with our expert travel consultants.",
  },
  "/about/who-we-are": {
    title: "Who We Are - About iLuxury Egypt",
    description:
      "Meet the team behind I.LuxuryEgypt. Passionate travel experts dedicated to crafting bespoke luxury Egypt experiences.",
  },
  "/about/iluxury-difference": {
    title: "The iLuxury Difference",
    description: "What sets I.LuxuryEgypt apart. Discover our commitment to unparalleled luxury and personalized service.",
  },
  "/about/your-experience": {
    title: "Your Experience Includes",
    description: "Everything included in your I.LuxuryEgypt journey. From private transfers to expert guides.",
  },
  "/about/trusted-worldwide": {
    title: "Trusted Worldwide",
    description: "I.LuxuryEgypt is trusted by discerning travelers worldwide for luxury Egypt travel experiences.",
  },
  "/destinations": {
    title: "Egypt Destinations - Luxury Travel Guide",
    description:
      "Explore Egypt's most extraordinary destinations. From ancient temples and pyramids to pristine Red Sea coastlines.",
  },
  "/egypt-tour-packages": {
    title: "Luxury Egypt Tour Packages",
    description:
      "Curated multi-day luxury journeys through Egypt. Private guides, five-star hotels, and iconic Egyptian experiences.",
  },
  "/egypt-tour-packages/classic-egypt": {
    title: "Classic Egypt Tours - Luxury Packages",
    description:
      "Experience the timeless wonders of Egypt with our classic luxury tour packages. Pyramids, temples, and Nile cruises.",
  },
  "/egypt-tour-packages/ultra-luxury": {
    title: "Ultra Luxury Egypt Tours - Premium Experiences",
    description: "The pinnacle of luxury travel in Egypt. Exclusive access, private jets, and the finest accommodations.",
  },
  "/egypt-tour-packages/family-luxury": {
    title: "Luxury Family Vacations in Egypt",
    description:
      "Create unforgettable family memories in Egypt. Kid-friendly luxury tours with private guides and five-star comfort.",
  },
  "/egypt-tour-packages/spiritual-journeys": {
    title: "Spiritual Tours in Egypt - Sacred Journeys",
    description: "Discover Egypt's spiritual heritage. Visit ancient temples, sacred sites, and experience transformative journeys.",
  },
  "/egypt-day-tours": {
    title: "Egypt Day Tours - Private Guided Experiences",
    description: "Explore Egypt with private guided day tours. Cairo, Luxor, Aswan, and beyond with expert Egyptologist guides.",
  },
  "/egypt-nile-cruise-tours": {
    title: "Luxury Nile Cruise Tours in Egypt",
    description: "Sail Egypt's eternal river aboard boutique vessels. Private balconies, gourmet cuisine, and curated shore excursions.",
  },
  "/nile-cruises": {
    title: "Luxury Nile Cruise Tours in Egypt",
    description: "Sail Egypt's eternal river aboard boutique vessels. Private balconies, gourmet cuisine, and curated shore excursions.",
  },
  "/stay": {
    title: "Luxury Hotels & Stays in Egypt",
    description:
      "Discover Egypt's finest luxury hotels and boutique accommodations. Handpicked stays from Nile-side palaces to Red Sea resorts.",
  },
  "/blog": {
    title: "Egypt Travel Blog | Tips, Guides & Inspiration - iLuxury Egypt",
    description:
      "Insider travel tips, destination guides, and inspiration for planning your luxury Egypt journey — from Nile cruises to hidden desert oases.",
  },
  "/faq": {
    title: "Egypt Travel Guide & FAQs | Planning Your Luxury Journey",
    description:
      "Expert answers to your questions about luxury Egypt tours, visa requirements, best time to visit, and bespoke concierge services.",
  },
  "/tailor-made": {
    title: "Tailor-Made Luxury Egypt Tours",
    description:
      "Create your perfect Egypt journey. Our travel experts craft personalized luxury itineraries tailored to your preferences.",
  },
  "/privacy-policy": {
    title: "Privacy Policy",
    description: "I.LuxuryEgypt privacy policy. How we collect, use, and protect your personal information.",
  },
  "/terms-conditions": {
    title: "Terms & Conditions",
    description: "I.LuxuryEgypt terms and conditions of service for luxury Egypt travel bookings.",
  },
  "/cookie-policy": {
    title: "Cookie Policy",
    description: "I.LuxuryEgypt cookie policy. How we use cookies to improve your browsing experience.",
  },
  "/responsible-travel": {
    title: "Responsible Travel",
    description: "Our commitment to responsible and sustainable luxury travel in Egypt.",
  },
  "/disclaimer": {
    title: "Disclaimer",
    description: "I.LuxuryEgypt legal disclaimer for website content and travel services.",
  },
};

// SEO-only overrides for specific category records, keyed by category slug
// (not full path — these categories are shared across /egypt-tour-packages,
// /egypt-day-tours, /egypt-nile-cruise-tours, and /categories). Overrides the
// injected <title>/description ONLY; the category's `name`/`shortDescription`
// in the DB (and therefore the on-page heading/copy) are left untouched.
const CATEGORY_META_OVERRIDES: Record<string, StaticMeta> = {
  "small-group-tours-egypt": {
    title: "Small Group Egypt Tours | iLuxury Egypt",
    description:
      "Join intimate small group tours of Egypt with expert Egyptologist guides, five-star hotels, and Nile cruises. Authentic cultural immersion, never mass tourism.",
  },
  "egypt-family-tours": {
    title: "Luxury Family Tours Egypt | iLuxury Egypt",
    description:
      "Bespoke family vacations in Egypt designed for discerning travelers. Private guides, five-star hotels, and unforgettable experiences for all ages.",
  },
  "egypt-solo-travel": {
    title: "Luxury Solo Travel Egypt | iLuxury Egypt",
    description:
      "Independent luxury travel in Egypt with private Egyptologist guides, five-star accommodations, and flexible itineraries built around you.",
  },
  "egypt-spiritual-tours": {
    title: "Spiritual Tours Egypt | iLuxury Egypt",
    description:
      "Private spiritual journeys through Egypt's sacred temples. Guided meditation, luxury accommodations, and transformative experiences.",
  },
  "luxury-honeymoon-egypt": {
    title: "Luxury Egypt Honeymoon | iLuxury Egypt",
    description:
      "Romantic luxury honeymoon tours in Egypt. Private Egyptologist guides, five-star hotels, Nile cruises, and tailor-made experiences for couples.",
  },
  "solar-eclipse-egypt": {
    title: "Egypt Solar Eclipse Tour 2027 | iLuxury Egypt",
    description:
      "Witness the total solar eclipse from Egypt with private viewing access, expert Egyptologist guides, and five-star luxury accommodations.",
  },
};

function normalizePath(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
}

/**
 * Resolves page-specific SEO metadata for a request path. Static routes are
 * served straight from STATIC_PAGE_META; everything else is looked up in the
 * DB. Returns null when nothing matches (admin routes, unknown paths, or a
 * dynamic slug with no DB record) — callers should fall back to the default
 * template untouched in that case.
 */
export async function resolvePageMeta(pathname: string): Promise<PageMeta | null> {
  const normalized = normalizePath(pathname);

  if (normalized.startsWith("/admin")) return null;

  const staticMeta = STATIC_PAGE_META[normalized];
  if (staticMeta) {
    return {
      title: staticMeta.title,
      description: truncate(staticMeta.description, 160),
      image: DEFAULT_IMAGE,
      type: "website",
    };
  }

  // `/nile-cruises/:slug` (client component ASaraNileCruise) ignores its own
  // slug param and renders identical hardcoded content regardless of value —
  // there is no DB table or API backing it. Treated as a static page reusing
  // the `/nile-cruises` listing's title/description for every slug.
  if (normalized.startsWith("/nile-cruises/")) {
    const meta = STATIC_PAGE_META["/nile-cruises"];
    return {
      title: meta.title,
      description: truncate(meta.description, 160),
      image: DEFAULT_IMAGE,
      type: "website",
    };
  }

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
      const slug = decodeURIComponent(match[1]);
      const category = await storage.getCategoryBySlug(slug);
      if (!category) return null;
      const override = CATEGORY_META_OVERRIDES[slug];
      return {
        title: override?.title || withSiteName(category.name),
        description: truncate(
          override?.description || category.shortDescription || category.description || DEFAULT_DESCRIPTION,
          160,
        ),
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
