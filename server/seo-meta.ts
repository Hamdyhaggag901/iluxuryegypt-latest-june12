import { storage } from "./storage";
import type { Facility, Tour } from "@shared/schema";
import { getLegalPageHref } from "@shared/schema";
import { stripHtml } from "@shared/strip-html";

const SITE_NAME = "iLuxury Egypt";
export const SITE_URL = "https://iluxuryegypt.com";
const DEFAULT_DESCRIPTION =
  "Experience Egypt in pure luxury with iLuxury Egypt. Curated bespoke stays across Egypt's most iconic destinations from Nile-side sanctuaries to Red Sea havens.";
const DEFAULT_IMAGE = `${SITE_URL}/api/assets/uploads/e1643e72-36f2-409f-9d0a-c8e894a66d3d.png`;

export interface PageMeta {
  title: string;
  description: string;
  image: string;
  type: string;
  jsonLd?: object | object[];
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

interface BreadcrumbItem {
  name: string;
  url: string;
}

// Builds a schema.org BreadcrumbList from the trail AFTER the homepage —
// Home is always prepended automatically, so callers only pass the segments
// specific to their page.
function buildBreadcrumbJsonLd(segments: BreadcrumbItem[]) {
  const items: BreadcrumbItem[] = [{ name: "Home", url: "/" }, ...segments];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

// Appends a BreadcrumbList alongside whatever schema a page already has
// (Hotel, BlogPosting, TouristTrip, FAQPage, Organization...) without
// disturbing it — injectMetaTags already renders one <script> per array item.
function withBreadcrumbs(jsonLd: object | object[] | undefined, segments: BreadcrumbItem[]): object | object[] {
  const breadcrumbs = buildBreadcrumbJsonLd(segments);
  if (!jsonLd) return breadcrumbs;
  return Array.isArray(jsonLd) ? [...jsonLd, breadcrumbs] : [jsonLd, breadcrumbs];
}

interface StaticMeta {
  title: string;
  description: string;
}

// `tours.itinerary` is untyped jsonb (`z.any()` in shared/schema.ts) — this
// mirrors the shape client/src/pages/tour-detail.tsx already assumes when
// rendering it, so the two stay in sync without a shared type to import.
interface TourItineraryDay {
  day?: number;
  title?: string;
  description?: string;
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
};

// Breadcrumb trail for each static route, as the segments AFTER Home (Home is
// prepended by buildBreadcrumbJsonLd). The 4 /about/* pages skip an
// intermediate "About" crumb — there's no standalone /about landing route in
// App.tsx to point it at, and a BreadcrumbList item without a real URL isn't
// valid, so it's simpler to keep those 2-level (Home > page).
const STATIC_BREADCRUMBS: Record<string, BreadcrumbItem[]> = {
  "/contact": [{ name: "Contact", url: "/contact" }],
  "/about/who-we-are": [{ name: "Who We Are", url: "/about/who-we-are" }],
  "/about/iluxury-difference": [{ name: "The iLuxury Difference", url: "/about/iluxury-difference" }],
  "/about/your-experience": [{ name: "Your Experience", url: "/about/your-experience" }],
  "/about/trusted-worldwide": [{ name: "Trusted Worldwide", url: "/about/trusted-worldwide" }],
  "/destinations": [{ name: "Destinations", url: "/destinations" }],
  "/egypt-tour-packages": [{ name: "Egypt Tour Packages", url: "/egypt-tour-packages" }],
  "/egypt-tour-packages/classic-egypt": [
    { name: "Egypt Tour Packages", url: "/egypt-tour-packages" },
    { name: "Classic Egypt", url: "/egypt-tour-packages/classic-egypt" },
  ],
  "/egypt-tour-packages/ultra-luxury": [
    { name: "Egypt Tour Packages", url: "/egypt-tour-packages" },
    { name: "Ultra Luxury", url: "/egypt-tour-packages/ultra-luxury" },
  ],
  "/egypt-tour-packages/family-luxury": [
    { name: "Egypt Tour Packages", url: "/egypt-tour-packages" },
    { name: "Family Luxury", url: "/egypt-tour-packages/family-luxury" },
  ],
  "/egypt-tour-packages/spiritual-journeys": [
    { name: "Egypt Tour Packages", url: "/egypt-tour-packages" },
    { name: "Spiritual Journeys", url: "/egypt-tour-packages/spiritual-journeys" },
  ],
  "/egypt-day-tours": [{ name: "Egypt Day Tours", url: "/egypt-day-tours" }],
  "/egypt-nile-cruise-tours": [{ name: "Egypt Nile Cruise Tours", url: "/egypt-nile-cruise-tours" }],
  "/nile-cruises": [{ name: "Nile Cruises", url: "/nile-cruises" }],
  "/stay": [{ name: "Stay", url: "/stay" }],
  "/blog": [{ name: "Blog", url: "/blog" }],
  "/faq": [{ name: "FAQ", url: "/faq" }],
  "/tailor-made": [{ name: "Tailor-Made", url: "/tailor-made" }],
};

// Fallback meta for the 5 original legal pages, used only until an admin saves
// real data for that slug in the legal_pages table (mirrors LEGACY_LEGAL_SLUGS
// in shared/schema.ts). Kept separate from STATIC_PAGE_META so a saved DB title
// always takes priority — see the legal-page matcher in resolvePageMeta below.
const LEGACY_LEGAL_META: Record<string, StaticMeta> = {
  "privacy-policy": {
    title: "Privacy Policy",
    description: "I.LuxuryEgypt privacy policy. How we collect, use, and protect your personal information.",
  },
  "terms-conditions": {
    title: "Terms & Conditions",
    description: "I.LuxuryEgypt terms and conditions of service for luxury Egypt travel bookings.",
  },
  "cookie-policy": {
    title: "Cookie Policy",
    description: "I.LuxuryEgypt cookie policy. How we use cookies to improve your browsing experience.",
  },
  "responsible-travel": {
    title: "Responsible Travel",
    description: "Our commitment to responsible and sustainable luxury travel in Egypt.",
  },
  disclaimer: {
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

// Maps the admin-set tours.availability_status column to the schema.org
// Offer.availability enumeration used in the tour's structured data.
const AVAILABILITY_SCHEMA_MAP: Record<string, string> = {
  available: "https://schema.org/InStock",
  limited: "https://schema.org/LimitedAvailability",
  sold_out: "https://schema.org/SoldOut",
};

interface UniquenessProperty {
  "@type": "PropertyValue";
  name: string;
  value: string | boolean;
  description?: string;
}

// Computes structured-data "uniqueness" signals purely from data that
// already exists elsewhere (linked hotels' featured/rating/route/duration,
// and the active seasons table) — no per-tour field an admin has to fill in.
async function buildTourUniquenessSignals(tour: Tour): Promise<UniquenessProperty[]> {
  const properties: UniquenessProperty[] = [];

  // Guarded like the seasons lookup below — this is best-effort structured
  // data, so a failure here (or any weird linked-hotel data) must never take
  // down the whole page's meta/SEO resolution, which used to hinge on this
  // whole function not throwing.
  try {
    if (tour.hotelIds?.length) {
      const hotels = (await Promise.all(tour.hotelIds.map((id) => storage.getHotel(id)))).filter(
        (h): h is NonNullable<typeof h> => Boolean(h),
      );

      const signatureHotel = hotels.find((h) => h.featured || h.rating === 5);
      if (signatureHotel) {
        properties.push({
          "@type": "PropertyValue",
          name: "signatureExperience",
          value: true,
          description: `Includes a stay at ${signatureHotel.name}, one of our featured 5-star properties.`,
        });
      }

      const cruiseHotel = hotels.find((h) => h.route && h.duration);
      if (cruiseHotel) {
        properties.push({
          "@type": "PropertyValue",
          name: "uniqueSellingPoint",
          value: `Includes a private Nile cruise (${cruiseHotel.route}, ${cruiseHotel.duration}) aboard ${cruiseHotel.name}.`,
        });
      }
    }
  } catch (err) {
    console.error("[seo-meta] Failed to compute hotel-based uniqueness signal:", err);
  }

  try {
    const seasons = await storage.getSeasons();
    const now = new Date();
    const currentMonthDay = (now.getMonth() + 1) * 100 + now.getDate();
    const activeSeason = seasons.find((s) => {
      if (!s.isActive) return false;
      const start = s.startMonth * 100 + s.startDay;
      const end = s.endMonth * 100 + s.endDay;
      // A range that wraps the year boundary (e.g. Nov 15 – Jan 10) has start > end.
      return start <= end
        ? currentMonthDay >= start && currentMonthDay <= end
        : currentMonthDay >= start || currentMonthDay <= end;
    });
    if (activeSeason) {
      properties.push({
        "@type": "PropertyValue",
        name: "seasonalHighlight",
        value: `Currently bookable during our ${activeSeason.name} period.`,
      });
    }
  } catch (err) {
    console.error("[seo-meta] Failed to compute seasonal uniqueness signal:", err);
  }

  return properties;
}

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

  // FAQ page needs FAQPage JSON-LD built from live DB data on top of its
  // otherwise-static title/description, so it's special-cased ahead of the
  // plain static lookup below.
  if (normalized === "/faq") {
    const meta = STATIC_PAGE_META["/faq"];
    try {
      const visibleFaqs = await storage.getVisibleFaqs();
      const jsonLd =
        visibleFaqs.length > 0
          ? {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: visibleFaqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            }
          : undefined;
      return {
        title: meta.title,
        description: truncate(meta.description, 160),
        image: DEFAULT_IMAGE,
        type: "website",
        jsonLd: withBreadcrumbs(jsonLd, STATIC_BREADCRUMBS["/faq"]),
      };
    } catch (err) {
      console.error("[seo-meta] Failed to resolve FAQ schema:", err);
      return {
        title: meta.title,
        description: truncate(meta.description, 160),
        image: DEFAULT_IMAGE,
        type: "website",
        jsonLd: withBreadcrumbs(undefined, STATIC_BREADCRUMBS["/faq"]),
      };
    }
  }

  // Homepage Organization schema — built from the same site-config key/value
  // store and social-links table the header/footer already read from, so
  // updating the logo, contact info, or socials in the admin updates this
  // automatically with no code change.
  if (normalized === "/") {
    const meta = STATIC_PAGE_META["/"];
    try {
      const [configRows, allSocialLinks] = await Promise.all([storage.getAllSiteConfig(), storage.getSocialLinks()]);
      const config = configRows.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {} as Record<string, string>);
      const logo = config.header_logo || config.footer_logo || DEFAULT_IMAGE;
      const sameAs = allSocialLinks
        .filter((link) => link.isVisible && link.url && link.url !== "#")
        .map((link) => link.url);
      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
        logo,
        image: logo,
        foundingDate: "2023",
        description: config.footer_description || DEFAULT_DESCRIPTION,
        ...(config.contact_email ? { email: config.contact_email } : {}),
        ...(config.contact_phone ? { telephone: config.contact_phone } : {}),
        ...(config.contact_address
          ? {
              address: {
                "@type": "PostalAddress",
                streetAddress: config.contact_address,
                addressCountry: "EG",
              },
            }
          : {}),
        ...(sameAs.length > 0 ? { sameAs } : {}),
      };
      return {
        title: meta.title,
        description: truncate(meta.description, 160),
        image: DEFAULT_IMAGE,
        type: "website",
        jsonLd,
      };
    } catch (err) {
      console.error("[seo-meta] Failed to resolve Organization schema:", err);
      return {
        title: meta.title,
        description: truncate(meta.description, 160),
        image: DEFAULT_IMAGE,
        type: "website",
      };
    }
  }

  const staticMeta = STATIC_PAGE_META[normalized];
  if (staticMeta) {
    const breadcrumbSegments = STATIC_BREADCRUMBS[normalized];
    return {
      title: staticMeta.title,
      description: truncate(staticMeta.description, 160),
      image: DEFAULT_IMAGE,
      type: "website",
      ...(breadcrumbSegments ? { jsonLd: buildBreadcrumbJsonLd(breadcrumbSegments) } : {}),
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
      jsonLd: buildBreadcrumbJsonLd(STATIC_BREADCRUMBS["/nile-cruises"]),
    };
  }

  try {
    let match: RegExpMatchArray | null;

    if ((match = pathname.match(/^\/blog\/([^/]+)\/?$/))) {
      const post = await storage.getPostBySlug(decodeURIComponent(match[1]));
      if (!post || post.status !== "published") return null;
      const description = truncate(post.metaDescription || post.excerpt || DEFAULT_DESCRIPTION, 160);
      const image = post.featuredImage || DEFAULT_IMAGE;
      // No byline field exists on posts (only `createdBy`, an internal admin
      // user id) — every article is published under this fixed team name.
      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.titleEn,
        description,
        image,
        url: `${SITE_URL}/blog/${post.slug}`,
        datePublished: (post.publishedAt || post.createdAt).toISOString(),
        dateModified: post.updatedAt.toISOString(),
        author: {
          "@type": "Organization",
          name: "iLuxury Egypt Team",
        },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          logo: {
            "@type": "ImageObject",
            url: DEFAULT_IMAGE,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${SITE_URL}/blog/${post.slug}`,
        },
        ...(post.tags && post.tags.length > 0 ? { keywords: post.tags.join(", ") } : {}),
      };
      return {
        title: withSiteName(post.metaTitle || post.titleEn),
        description,
        image,
        type: "article",
        jsonLd: withBreadcrumbs(jsonLd, [
          { name: "Blog", url: "/blog" },
          { name: post.titleEn, url: `/blog/${post.slug}` },
        ]),
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
        jsonLd: buildBreadcrumbJsonLd([
          { name: "Destinations", url: "/destinations" },
          { name: destination.name, url: `/destinations/${destination.slug}` },
        ]),
      };
    }

    if ((match = pathname.match(/^\/hotel\/([^/]+)\/?$/))) {
      const hotel = await storage.getHotelBySlug(decodeURIComponent(match[1]));
      if (!hotel) return null;
      const keyword = hotel.focusKeyword?.trim();
      const baseTitle = `${hotel.name} - ${hotel.location}`;
      const title = keyword && !baseTitle.toLowerCase().includes(keyword.toLowerCase())
        ? `${hotel.name} - ${keyword}`
        : baseTitle;
      const baseDescription = hotel.description || DEFAULT_DESCRIPTION;
      const description = keyword && !baseDescription.toLowerCase().includes(keyword.toLowerCase())
        ? `${keyword} — ${baseDescription}`
        : baseDescription;
      // Facilities (not the dormant `amenities` column — that field is
      // captured in the admin form but never rendered on the public hotel
      // page, so it would produce a schema that describes content visitors
      // never actually see) drive amenityFeature.
      const facilities = Array.isArray(hotel.facilities) ? (hotel.facilities as Facility[]) : [];
      const gallery = Array.isArray(hotel.gallery) ? hotel.gallery : [];
      const galleryAlt =
        hotel.galleryAlt && typeof hotel.galleryAlt === "object" ? (hotel.galleryAlt as Record<string, string>) : {};
      // Admin-written alt text (see imageAlt/galleryAlt columns) becomes an
      // ImageObject's caption so the same description shows up in the schema,
      // not just the <img alt> tag. Images without one stay plain URL strings
      // — both forms are valid inside schema.org's `image` array.
      const heroAlt = hotel.imageAlt?.trim();
      const heroImage = heroAlt ? { "@type": "ImageObject", url: hotel.image, caption: heroAlt } : hotel.image;
      const galleryImages = gallery.map((url) => {
        const alt = galleryAlt[url]?.trim();
        return alt ? { "@type": "ImageObject", url, caption: alt } : url;
      });
      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Hotel",
        name: hotel.name,
        description: hotel.description,
        image: [heroImage, ...galleryImages].filter(Boolean),
        url: `${SITE_URL}/hotel/${hotel.slug}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: hotel.location,
          addressRegion: hotel.region,
          addressCountry: "EG",
        },
        starRating: {
          "@type": "Rating",
          ratingValue: hotel.rating,
        },
        priceRange: hotel.priceTier,
        ...(facilities.length > 0
          ? {
              amenityFeature: facilities.map((facility) => ({
                "@type": "LocationFeatureSpecification",
                name: facility.label,
              })),
            }
          : {}),
      };
      return {
        title: withSiteName(title),
        description: truncate(description, 160),
        image: hotel.image || DEFAULT_IMAGE,
        type: "website",
        jsonLd: withBreadcrumbs(jsonLd, [
          { name: "Stay", url: "/stay" },
          { name: hotel.name, url: `/hotel/${hotel.slug}` },
        ]),
      };
    }

    if (
      (match = pathname.match(/^\/(privacy-policy|terms-conditions|cookie-policy|responsible-travel|disclaimer)\/?$/)) ||
      (match = pathname.match(/^\/legal\/([^/]+)\/?$/))
    ) {
      const slug = decodeURIComponent(match[1]);
      const legalPage = await storage.getLegalPageBySlug(slug);
      if (legalPage && legalPage.status === "published") {
        return {
          title: withSiteName(legalPage.title),
          description: truncate(legalPage.subtitle || DEFAULT_DESCRIPTION, 160),
          image: DEFAULT_IMAGE,
          type: "website",
          jsonLd: buildBreadcrumbJsonLd([{ name: legalPage.title, url: getLegalPageHref(slug) }]),
        };
      }
      const fallback = LEGACY_LEGAL_META[slug];
      if (fallback) {
        return {
          title: withSiteName(fallback.title),
          description: truncate(fallback.description, 160),
          image: DEFAULT_IMAGE,
          type: "website",
          jsonLd: buildBreadcrumbJsonLd([{ name: fallback.title, url: getLegalPageHref(slug) }]),
        };
      }
      return null;
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
      // /categories/:slug has no standalone listing page to link a parent
      // crumb to (App.tsx only registers the three real group pages), so it
      // stays a 2-level trail; the other three prefixes get their listing
      // page as the middle crumb.
      const categoryParent: BreadcrumbItem | null = pathname.startsWith("/egypt-day-tours/")
        ? { name: "Egypt Day Tours", url: "/egypt-day-tours" }
        : pathname.startsWith("/egypt-nile-cruise-tours/")
          ? { name: "Egypt Nile Cruise Tours", url: "/egypt-nile-cruise-tours" }
          : pathname.startsWith("/categories/")
            ? null
            : { name: "Egypt Tour Packages", url: "/egypt-tour-packages" };
      return {
        title: override?.title || withSiteName(category.name),
        description: truncate(
          override?.description || category.shortDescription || category.description || DEFAULT_DESCRIPTION,
          160,
        ),
        image: category.image || DEFAULT_IMAGE,
        type: "website",
        jsonLd: buildBreadcrumbJsonLd([
          ...(categoryParent ? [categoryParent] : []),
          { name: category.name, url: pathname },
        ]),
      };
    }

    // Tour detail is the catch-all `/:slug` route on the client, so it must
    // stay last and only match single-segment paths that aren't a known
    // static route (App.tsx registers all static routes before this one).
    if ((match = pathname.match(/^\/([^/]+)\/?$/))) {
      const tour = await storage.getTourBySlug(decodeURIComponent(match[1]));
      if (!tour || tour.published === false) return null;
      // Manual admin override takes priority over the auto-generated value,
      // same priority order already used for image alt text (custom first,
      // sensible fallback otherwise) — an empty/whitespace-only override is
      // treated as unset so a blank field never wins over the fallback.
      const titleBase = tour.seoTitle?.trim() || tour.title;
      // tour.description can now contain rich-text HTML (the WysiwygEditor-
      // backed "The Experience" field) — stripped here so a meta description
      // falling back to it never leaks raw markup into <meta>/og: tags.
      const description = truncate(
        tour.metaDescription?.trim() || tour.shortDescription || stripHtml(tour.description) || DEFAULT_DESCRIPTION,
        160,
      );
      const image = tour.heroImage || DEFAULT_IMAGE;
      const gallery = Array.isArray(tour.gallery) ? tour.gallery : [];
      const itineraryDays: TourItineraryDay[] = Array.isArray(tour.itinerary) ? tour.itinerary : [];
      const uniquenessProperties = await buildTourUniquenessSignals(tour);
      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "TouristTrip",
        name: tour.title,
        description,
        image: [tour.heroImage, ...gallery].filter(Boolean),
        url: `${SITE_URL}/${tour.slug}`,
        touristType: tour.category,
        dateModified: tour.updatedAt.toISOString(),
        offers: {
          "@type": "Offer",
          price: tour.price,
          priceCurrency: tour.currency,
          availability: AVAILABILITY_SCHEMA_MAP[tour.availabilityStatus] || AVAILABILITY_SCHEMA_MAP.available,
          url: `${SITE_URL}/${tour.slug}`,
        },
        provider: {
          "@type": "TravelAgency",
          name: SITE_NAME,
          url: SITE_URL,
        },
        ...(uniquenessProperties.length > 0 ? { additionalProperty: uniquenessProperties } : {}),
        ...(itineraryDays.length > 0
          ? {
              itinerary: {
                "@type": "ItemList",
                itemListElement: itineraryDays.map((day, index) => ({
                  "@type": "ListItem",
                  position: day?.day ?? index + 1,
                  name: day?.title || `Day ${index + 1}`,
                  ...(day?.description ? { description: day.description } : {}),
                })),
              },
            }
          : {}),
      };
      return {
        title: withSiteName(titleBase),
        description,
        image,
        type: "website",
        jsonLd: withBreadcrumbs(jsonLd, [{ name: tour.title, url: `/${tour.slug}` }]),
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

  // JSON-LD structured data — one <script> per schema object. `<` is escaped
  // as \u003c so a value containing a literal "</script>" can never close the
  // tag early; this is safe JSON since \u003c decodes back to "<" on parse.
  if (meta.jsonLd) {
    const items = Array.isArray(meta.jsonLd) ? meta.jsonLd : [meta.jsonLd];
    const scripts = items
      .map((item) => `    <script type="application/ld+json">${JSON.stringify(item).replace(/</g, "\\u003c")}</script>`)
      .join("\n");
    result = result.replace("</head>", `${scripts}\n  </head>`);
  }

  return result;
}
