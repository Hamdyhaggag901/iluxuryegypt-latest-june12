// Server-rendered page content for clients that do not run JavaScript.
//
// WHY
//
// This is a Vite SPA. Until now the server injected a correct per-page
// <title>, description, canonical, robots and JSON-LD into index.html, and
// everything else — the H1, the prose, the images, the internal links — only
// existed after React ran. Google renders JavaScript eventually; the assistant
// crawlers behind ChatGPT, Perplexity and Claude do not run it at all, so they
// saw a titled empty page. Eight answer-first FAQs per article reached none of
// them.
//
// HYDRATION
//
// There is none to break. client/src/main.tsx calls createRoot().render(), not
// hydrateRoot(), and createRoot empties its container before its first paint.
// So the markup below is written into <div id="root">, React discards it the
// moment it mounts, and no mismatch is possible because nothing is being
// matched. What a reader gets instead of today's blank screen is the article
// text as a first paint, which is a gain rather than a flash: the content is
// styled by the same stylesheet and is replaced by the identical content.
//
// This is also why the markup here does not have to mirror the React tree
// class for class. It has to be correct, readable and crawlable. Trying to
// reproduce every wrapper div would be a second copy of the UI to keep in step
// for no benefit to anyone.
//
// ESCAPING
//
// body_en and the description columns are HTML written in our own admin and go
// through untouched, entities and all. Everything that is a value rather than
// markup — titles, alt text, names, hrefs — is escaped exactly once on the way
// in. The two are never mixed by accident: `esc` and `trusted` are separate
// functions and every interpolation uses one of them by name.

import { storage } from "./storage";
import { isPostLive } from "@shared/post-visibility";
import { destinationHeading, HOTEL_INDEX_FALLBACK_HEADING } from "@shared/page-heading";
import { HOME_INTRO_PARAGRAPH } from "@shared/home-intro";
import { stripHtml } from "@shared/strip-html";
import { SITE_URL } from "./seo-meta";

/** Escapes a value for use as text or inside a double-quoted attribute. */
export function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * HTML from our own admin, emitted as written.
 *
 * Named so that every call site says out loud that it is trusting the value.
 * The only inputs are body_en and the description columns, all of them authored
 * behind the admin login.
 */
export function trusted(html: unknown): string {
  return String(html ?? "");
}

function absolute(url: string): string {
  if (!url) return "";
  return /^https?:\/\//i.test(url) ? url : `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

/** An <img> with everything a crawler needs, or nothing when there is no image. */
function img(src: string | null | undefined, alt: string, opts: { eager?: boolean } = {}): string {
  const source = (src ?? "").trim();
  if (!source) return "";
  return `<img src="${esc(source)}" alt="${esc(alt)}" width="1600" height="1067" ` +
    `loading="${opts.eager ? "eager" : "lazy"}" />`;
}

function link(href: string, text: string): string {
  return `<a href="${esc(href)}">${esc(text)}</a>`;
}

function section(heading: string, body: string): string {
  if (!body.trim()) return "";
  return `<section><h2>${esc(heading)}</h2>${body}</section>`;
}

/** A list of FAQ rows as real headings and paragraphs, matching the FAQPage JSON-LD. */
function faqList(faqs: unknown): string {
  const rows = (Array.isArray(faqs) ? faqs : []).filter(
    (f): f is { question: string; answer: string } =>
      Boolean(f && typeof f === "object" && (f as any).question?.trim() && (f as any).answer?.trim())
  );
  if (rows.length === 0) return "";
  const items = rows
    .map((f) => `<div><h3>${esc(f.question)}</h3><p>${esc(f.answer)}</p></div>`)
    .join("");
  return `<section><h2>Frequently Asked Questions</h2>${items}</section>`;
}

/**
 * The outcome for one request.
 *
 * `passthrough` is not the same as `notFound`: most paths are real client
 * routes this module has nothing extra to say about, and returning 404 for
 * those would take down working pages. Only an entity route whose row is
 * missing is a genuine 404.
 */
export type ContentResult =
  | { kind: "content"; html: string }
  | { kind: "notFound" }
  | { kind: "passthrough" };

const content = (html: string): ContentResult => ({ kind: "content", html });
const NOT_FOUND: ContentResult = { kind: "notFound" };
const PASSTHROUGH: ContentResult = { kind: "passthrough" };

// ---------------------------------------------------------------------------
// Per page type
// ---------------------------------------------------------------------------

async function blogPost(slug: string): Promise<ContentResult> {
  const post = await storage.getPostBySlug(slug);
  // A scheduled post is not a 404 to a person, who would be told it exists,
  // but it must not reach a crawler before its date either. Rendering nothing
  // and letting the SPA handle it keeps both true.
  if (!post) return NOT_FOUND;
  if (!isPostLive(post)) return PASSTHROUGH;

  const hero = img(post.featuredImage, post.featuredImageAlt || post.titleEn, { eager: true });
  return content(
    `<article>` +
      `<h1>${esc(post.titleEn)}</h1>` +
      (post.excerpt ? `<p>${esc(post.excerpt)}</p>` : "") +
      hero +
      // body_en is trusted HTML: headings, paragraphs, <figure> images with
      // their alt, the price tables and every internal <a href> in the prose.
      `<div>${trusted(post.bodyEn)}</div>` +
      faqList(post.faqs) +
      `</article>`
  );
}

async function blogIndex(): Promise<ContentResult> {
  const posts = (await storage.getPosts()).filter((p) => isPostLive(p));
  const items = posts
    .map(
      (p) =>
        `<li><article>${img(p.featuredImage, p.featuredImageAlt || p.titleEn)}` +
        `<h2>${link(`/blog/${p.slug}`, p.titleEn)}</h2>` +
        (p.excerpt ? `<p>${esc(p.excerpt)}</p>` : "") +
        `</article></li>`
    )
    .join("");
  return content(`<h1>Egypt Travel Blog</h1><ul>${items}</ul>`);
}

async function tourPage(slug: string): Promise<ContentResult | null> {
  const tour = await storage.getTourBySlug(slug);
  if (!tour) return null; // caller decides: could be a static route

  const days = Array.isArray(tour.itinerary) ? tour.itinerary : [];
  const itinerary = days
    .map((day: any, i: number) => {
      const title = day?.title || `Day ${day?.day ?? i + 1}`;
      const body = day?.description ? `<p>${esc(stripHtml(String(day.description)))}</p>` : "";
      return `<li><h3>${esc(title)}</h3>${body}${img(day?.image, day?.imageAlt || title)}</li>`;
    })
    .join("");

  const list = (values: unknown, heading: string) => {
    const rows = (Array.isArray(values) ? values : []).filter((v) => String(v ?? "").trim());
    if (rows.length === 0) return "";
    return section(heading, `<ul>${rows.map((v) => `<li>${esc(v)}</li>`).join("")}</ul>`);
  };

  return content(
    `<article>` +
      `<h1>${esc(tour.title)}</h1>` +
      img(tour.heroImage, tour.heroImageAlt || tour.title, { eager: true }) +
      (tour.description ? `<div>${trusted(tour.description)}</div>` : "") +
      (itinerary ? section("Itinerary", `<ol>${itinerary}</ol>`) : "") +
      list(tour.includes, "What is included") +
      list(tour.excludes, "What is not included") +
      faqList(tour.faqs) +
      `</article>`
  );
}

async function destinationPage(slug: string): Promise<ContentResult> {
  const destination = await storage.getDestinationBySlug(slug);
  if (!destination || !destination.published) return NOT_FOUND;

  // Same helper the client uses, so the H1 a crawler reads and the H1 a reader
  // sees cannot drift apart.
  const heading = destinationHeading(destination);
  return content(
    `<article>` +
      `<h1>${esc(heading)}</h1>` +
      img(destination.heroImage, heading, { eager: true }) +
      (destination.description ? `<div>${trusted(destination.description)}</div>` : "") +
      faqList((destination as { faqs?: unknown }).faqs) +
      `</article>`
  );
}

async function destinationIndex(): Promise<ContentResult> {
  const rows = (await storage.getDestinations()).filter((d) => d.published);
  const items = rows
    .map(
      (d) =>
        `<li>${img(d.heroImage, destinationHeading(d))}` +
        `<h2>${link(`/egypt-travel-guide/${d.slug}`, destinationHeading(d))}</h2></li>`
    )
    .join("");
  return content(`<h1>Egypt Travel Guide</h1><ul>${items}</ul>`);
}

/**
 * The hotel listing page.
 *
 * Added with the /stay -> /luxury-hotels-in-egypt rename: the page was in
 * resolvePageMeta (title, description, an ItemList of hotels) but never in
 * this layer, so a crawler that runs no JavaScript received the head and an
 * empty body. The H1 comes from the same stay_page_hero row the React page
 * reads, with the same fallback, so the two cannot show different headings.
 *
 * Hotel pages themselves are at /hotel/:slug, which is what the links here
 * and every hotel's canonical_url point at. That path is unchanged.
 */
async function hotelIndex(): Promise<ContentResult> {
  const [hero, hotels] = await Promise.all([
    storage.getStayPageHero().catch(() => undefined),
    storage.getHotels().catch(() => []),
  ]);

  const heading = hero?.title?.trim() || HOTEL_INDEX_FALLBACK_HEADING;
  const published = hotels.filter((h) => h.status === "published");
  const items = published
    .map(
      (h) =>
        `<li>${img(h.image, h.imageAlt || `${h.name}, ${h.location}`)}` +
        `<h2>${link(`/hotel/${h.slug}`, h.name)}</h2>` +
        `<p>${esc(h.location)}</p></li>`
    )
    .join("");

  return content(`<h1>${esc(heading)}</h1><ul>${items}</ul>`);
}

async function categoryPage(slug: string): Promise<ContentResult> {
  const category = await storage.getCategoryBySlug(slug);
  if (!category) return NOT_FOUND;

  const tours = (await storage.getTours()).filter(
    (t) => t.published && t.category === category.slug
  );
  const cards = tours
    .map(
      (t) =>
        `<li>${img(t.heroImage, t.heroImageAlt || t.title)}` +
        `<h3>${link(`/${t.slug}`, t.title)}</h3></li>`
    )
    .join("");

  return content(
    `<article>` +
      `<h1>${esc(category.name)}</h1>` +
      img(category.image, category.name, { eager: true }) +
      (category.description ? `<div>${trusted(category.description)}</div>` : "") +
      (cards ? section("Tours", `<ul>${cards}</ul>`) : "") +
      faqList((category as { faqs?: unknown }).faqs) +
      `</article>`
  );
}

async function homepage(): Promise<ContentResult> {
  const [tours, destinations, slides] = await Promise.all([
    storage.getTours().catch(() => []),
    storage.getDestinations().catch(() => []),
    storage.getActiveHeroSlides().catch(() => []),
  ]);

  const featuredTours = tours.filter((t) => t.published).slice(0, 8);
  const featuredDestinations = destinations.filter((d) => d.published).slice(0, 8);

  // The H1 is the first hero slide's title, which is the heading a visitor
  // sees first, rather than a sentence invented here that no reader would ever
  // encounter. The remaining slide titles follow as text.
  //
  // Worth knowing while reading this: the slider renders an <h1> for EVERY
  // slide, so the live page currently has as many H1s as there are slides and
  // the visible one rotates. That is a pre-existing defect on the client side
  // and not one this file can fix; the server emits exactly one.
  const [firstSlide, ...restSlides] = slides;
  const heading = firstSlide?.title?.trim() || "Luxury Egypt Tours and Tailor Made Travel";

  return content(
    `<h1>${esc(heading)}</h1>` +
      (firstSlide?.description ? `<p>${esc(firstSlide.description)}</p>` : "") +
      // Sits directly under the hero on the rendered page too. Everything
      // above it comes from hero_slides and is client only, so without this
      // paragraph the phrases the homepage targets appear nowhere a crawler
      // that runs no JavaScript can read them. Same constant the React
      // component renders, from @shared/home-intro.
      `<p>${esc(HOME_INTRO_PARAGRAPH)}</p>` +
      (restSlides.length > 0
        ? section(
            "Where we travel",
            `<ul>${restSlides
              .map((sl) => `<li><strong>${esc(sl.title)}</strong>${sl.description ? ` ${esc(sl.description)}` : ""}</li>`)
              .join("")}</ul>`
          )
        : "") +
      section(
        "Featured tours",
        `<ul>${featuredTours
          .map(
            (t) =>
              `<li>${img(t.heroImage, t.heroImageAlt || t.title)}` +
              `<h3>${link(`/${t.slug}`, t.title)}</h3></li>`
          )
          .join("")}</ul>`
      ) +
      section(
        "Destinations",
        `<ul>${featuredDestinations
          .map(
            (d) =>
              `<li>${img(d.heroImage, destinationHeading(d))}` +
              `<h3>${link(`/egypt-travel-guide/${d.slug}`, destinationHeading(d))}</h3></li>`
          )
          .join("")}</ul>`
      ) +
      section("Read before you go", `<p>${link("/blog", "The Egypt travel blog")}</p>`)
  );
}

async function tourIndex(): Promise<ContentResult> {
  const [tours, categories] = await Promise.all([storage.getTours(), storage.getCategories()]);
  const published = tours.filter((t) => t.published);
  const cats = categories;
  return content(
    `<h1>Luxury Egypt Tour Packages</h1>` +
      section(
        "Collections",
        `<ul>${cats
          .map((c) => `<li>${link(`/luxury-egypt-tour-packages/${c.slug}`, c.name)}</li>`)
          .join("")}</ul>`
      ) +
      section(
        "All tours",
        `<ul>${published
          .map(
            (t) =>
              `<li>${img(t.heroImage, t.heroImageAlt || t.title)}` +
              `<h3>${link(`/${t.slug}`, t.title)}</h3></li>`
          )
          .join("")}</ul>`
      )
  );
}

// ---------------------------------------------------------------------------
// Routing
// ---------------------------------------------------------------------------

/**
 * The crawler-visible content for a path, if this module has any.
 *
 * Mirrors the branches in resolvePageMeta rather than sharing them, because
 * that function answers "what goes in <head>" and this one answers "what goes
 * in <body>", and the two have different failure modes: a missing row means no
 * special meta there and a 404 here.
 */
export async function resolvePageContent(pathname: string): Promise<ContentResult> {
  const normalized = (pathname.split("?")[0] || "/").replace(/\/+$/, "") || "/";
  if (normalized.startsWith("/admin") || normalized.startsWith("/api")) return PASSTHROUGH;

  try {
    if (normalized === "/") return await homepage();
    if (normalized === "/blog") return await blogIndex();
    if (normalized === "/egypt-travel-guide") return await destinationIndex();
    if (normalized === "/luxury-egypt-tour-packages") return await tourIndex();
    if (normalized === "/luxury-hotels-in-egypt") return await hotelIndex();

    let match: RegExpMatchArray | null;

    if ((match = normalized.match(/^\/blog\/([^/]+)$/))) {
      return await blogPost(decodeURIComponent(match[1]));
    }
    if ((match = normalized.match(/^\/egypt-travel-guide\/([^/]+)$/))) {
      return await destinationPage(decodeURIComponent(match[1]));
    }
    if ((match = normalized.match(/^\/luxury-egypt-tour-packages\/([^/]+)$/))) {
      return await categoryPage(decodeURIComponent(match[1]));
    }

    // Tours sit at the site root, sharing that namespace with every static
    // client route. A slug that is not a tour is therefore not necessarily
    // missing, so this never returns 404: the SPA decides.
    if ((match = normalized.match(/^\/([^/]+)$/))) {
      const tour = await tourPage(decodeURIComponent(match[1]));
      if (tour) return tour;
    }

    return PASSTHROUGH;
  } catch (err) {
    // Content is an enhancement. A database hiccup must not take down a page
    // that would otherwise render client side.
    console.error("[seo-content] Failed to render page content:", err);
    return PASSTHROUGH;
  }
}

// ---------------------------------------------------------------------------
// Cache
// ---------------------------------------------------------------------------
// Every crawl of every page is otherwise a handful of database reads, and the
// crawlers this exists for are exactly the ones that fetch a lot of pages at
// once. The TTL is short because the invalidation below is the real mechanism:
// it only has to cover the window between an admin save and the next tick.

const TTL_MS = 5 * 60 * 1000;
/** Bounded so a crawler walking an infinite query string cannot grow it forever. */
const MAX_ENTRIES = 500;

const cache = new Map<string, { result: ContentResult; expires: number }>();

/**
 * Drops everything.
 *
 * Called from notifyIndexNow, which is the single funnel all fifteen CMS
 * create, update and delete handlers already go through. Hooking it there
 * rather than at each call site means a sixteenth handler gets cache
 * invalidation for free, and cannot forget it.
 *
 * Clearing the whole map rather than one key is deliberate: a tour edit changes
 * that tour's page, its category page, the tour index and the homepage, and
 * working out that list correctly every time is more ways to be wrong than a
 * few hundred cheap re-renders.
 */
export function clearContentCache(): void {
  cache.clear();
}

export async function resolvePageContentCached(pathname: string): Promise<ContentResult> {
  const key = (pathname.split("?")[0] || "/").replace(/\/+$/, "") || "/";
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.result;

  const result = await resolvePageContent(key);
  // A passthrough is cached too: "there is nothing to render here" is just as
  // expensive to work out as a page, and just as stable.
  if (cache.size >= MAX_ENTRIES) cache.clear();
  cache.set(key, { result, expires: Date.now() + TTL_MS });
  return result;
}

/**
 * Writes the content into the element React is about to take over.
 *
 * createRoot empties #root on mount, so this needs no cleanup script and
 * cannot collide with React. It is also why the content goes inside #root
 * rather than beside it: a sibling would need removing by hand, and anything
 * left behind would be duplicate content on the page.
 */
export function injectPageContent(html: string, contentHtml: string): string {
  return html.replace(
    /<div id="root"><\/div>/,
    `<div id="root"><div data-server-rendered="true">${contentHtml}</div></div>`
  );
}
