// The hotel schema_markup override, end to end through the real resolver.
//
// hotels had no schema_markup column at all: a hotel page's structured data
// was entirely generated from the row, which meant no FAQPage matching the
// article's own FAQ block, and a priceRange emitted from price_tier on a site
// that publishes no prices. This asserts the four things that change.
//
//   npx tsx scripts/test-hotel-schema-markup.ts

import { ENV_REPORT } from "./lib/script-env";
void ENV_REPORT;
process.env.DATABASE_URL ||= "postgres://p:p@127.0.0.1:1/p";
const realError = console.error;
console.error = (...a: unknown[]) => { if (typeof a[0] === "string" && a[0].startsWith("Database seeding error")) return; realError(...a); };

const { storage } = await import("../server/storage");
const { resolvePageMeta } = await import("../server/seo-meta");
import fs from "fs";
import path from "path";

let fails = 0;
const ok = (n: string, c: boolean, d = "") => { if (!c) fails++; console.log(`${c ? "PASS" : "FAIL"}  ${n}${d ? "  " + d : ""}`); };

// The schema_markup value is read straight out of the shipped SQL file, so
// this tests what Hamdy will actually run rather than a copy pasted stub.
const dir = path.resolve(import.meta.dirname, "../stay-pages");
const FILES: Array<[string, string, string]> = [
  ["5-star-nile-cruise", "article-5-star-nile-cruise.sql", "MS Le Fayan"],
  ["old-winter-palace-luxor-hotel", "article-old-winter-palace-luxor-hotel.sql", "Sofitel Winter Palace Luxor"],
  ["oberoi-sahl-hasheesh", "article-oberoi-sahl-hasheesh.sql", "The Oberoi Sahl Hasheesh"],
  ["four-seasons-hotel-alexandria-egypt", "article-four-seasons-hotel-alexandria-egypt.sql", "Four Seasons Hotel Alexandria at San Stefano"],
];

function grab(sql: string, tag: string): string {
  const m = sql.match(new RegExp(`\\$${tag}\\$([\\s\\S]*?)\\$${tag}\\$`));
  if (!m) throw new Error(`no $${tag}$ block`);
  return m[1];
}

function stubHotel(slug: string, name: string, schemaMarkup: string | null, article: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (storage as any).getHotelBySlug = async (s: string) => s !== slug ? undefined : ({
    id: "0", slug, name, location: "Luxor", region: "Luxor", type: "Hotel",
    rating: 5, priceTier: "$$$$", amenities: ["Pool"],
    image: "/u/hero.jpg", imageAlt: "hero alt", description: "A description.",
    fullDescription: null, highlights: [], gallery: ["/u/g1.jpg"], galleryAlt: { "/u/g1.jpg": "g1 alt" },
    rooms: [], facilities: [{ icon: "pool", label: "Pool" }],
    article, whyWeChoseQuote: null, route: null, duration: null,
    status: "published", sortOrder: 0, focusKeyword: null,
    seoTitle: "T", metaDescription: "D", canonicalUrl: null, robots: null,
    schemaType: "Hotel", schemaMarkup, ogImage: null,
    featured: false, isPartner: false, partnerLogoUrl: null,
    createdAt: new Date(), updatedAt: new Date(), createdBy: null,
  });
}

const strip = (h: string) => h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

for (const [slug, file, name] of FILES) {
  const sql = fs.readFileSync(path.join(dir, file), "utf8");
  const schemaMarkup = grab(sql, "SC");
  const article = grab(sql, "ART");
  console.log(`\n--- ${slug} ---`);

  stubHotel(slug, name, schemaMarkup, article);
  const meta = await resolvePageMeta(`/hotel/${slug}`);
  const nodes = (Array.isArray(meta!.jsonLd) ? meta!.jsonLd : [meta!.jsonLd]) as Array<Record<string, unknown>>;
  const types = nodes.map((n) => n["@type"]);

  ok("the override replaces the generated node, it does not stack",
     types.filter((t) => t === "Hotel" || t === "LodgingBusiness" || t === "Resort").length === 1, types.join(", "));
  ok("one FAQPage in the served graph", types.filter((t) => t === "FAQPage").length === 1);
  ok("BreadcrumbList still added", types.includes("BreadcrumbList"));
  ok("no priceRange anywhere in the served JSON-LD", !JSON.stringify(nodes).includes("priceRange"));
  ok("no aggregateRating and no offers", !/aggregateRating|"offers"/.test(JSON.stringify(nodes)));

  const hotelNode = nodes.find((n) => ["Hotel", "LodgingBusiness", "Resort"].includes(n["@type"] as string))!;
  ok("the hero and gallery images survive the override", JSON.stringify(hotelNode.image ?? "").includes("/u/hero.jpg"),
     JSON.stringify(hotelNode.image));
  ok("url inherited from the generated node", String(hotelNode.url).endsWith(`/hotel/${slug}`), String(hotelNode.url));
  ok("starRating is the string 5",
     (hotelNode.starRating as { ratingValue?: unknown })?.ratingValue === "5");

  // The served FAQPage has to match the article's visible FAQ block exactly.
  const faq = nodes.find((n) => n["@type"] === "FAQPage") as { mainEntity: Array<Record<string, any>> };
  const faqHtml = article.split("<h2>Frequently Asked Questions</h2>")[1] ?? "";
  const visible = [...faqHtml.matchAll(/<h3>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3>|$)/g)]
    .map((m) => [strip(m[1]), strip(m[2])]);
  ok("6 visible FAQs", visible.length === 6, String(visible.length));
  const bad = visible.filter(([q, a], i) =>
    faq.mainEntity[i]?.name !== q || faq.mainEntity[i]?.acceptedAnswer?.text !== a);
  ok("every served FAQ matches the visible one word for word", bad.length === 0,
     bad.length ? bad[0][0].slice(0, 60) : "");
}

// Malformed JSON must fall back rather than ship broken structured data.
console.log("\n--- a malformed override falls back ---");
stubHotel("bad-json", "Broken", "{not json", "<p>x</p>");
const bad = await resolvePageMeta("/hotel/bad-json");
const badNodes = (Array.isArray(bad!.jsonLd) ? bad!.jsonLd : [bad!.jsonLd]) as Array<Record<string, unknown>>;
ok("falls back to the generated Hotel node", badNodes.some((n) => n["@type"] === "Hotel"));
ok("and the generated node is intact", badNodes.some((n) => n.name === "Broken"));

console.log(fails === 0 ? "\nAll hotel schema cases passed." : `\n${fails} failure(s)`);
process.exit(fails === 0 ? 0 : 1);
