import type { Express, Request, Response, NextFunction } from "express";

// For a renamed *prefix* (a listing page plus all its sub-pages), not a
// single slug — e.g. /egypt-tour-packages -> /luxury-egypt-tour-packages
// needs to redirect both the parent and every /egypt-tour-packages/:slug
// under it. server/tour-redirects.ts's exact-string map doesn't fit this
// shape (it's one slug to a different slug, not "rewrite this prefix and
// keep whatever comes after it"), so this is deliberately a separate,
// smaller mechanism rather than overloading that one.
//
// Add an entry here whenever a listing page's own path changes.
export const PATH_PREFIX_REDIRECTS: Record<string, string> = {
  "/egypt-tour-packages": "/luxury-egypt-tour-packages",
  "/luxury-egypt-tour-packages/egypt-solo-travel": "/luxury-egypt-tour-packages/egypt-tours-for-solo-travellers",
  "/luxury-egypt-tour-packages/small-group-tours-egypt": "/luxury-egypt-tour-packages/small-group-egypt-tours",
  // /categories/:slug (App.tsx) renders the same category page as the
  // parent-path form above, so a renamed slug 404s there too even though
  // the sitemap only ever emits the parent-path URLs.
  "/categories/egypt-solo-travel": "/luxury-egypt-tour-packages/egypt-tours-for-solo-travellers",
  "/categories/small-group-tours-egypt": "/luxury-egypt-tour-packages/small-group-egypt-tours",

  // /destinations -> /egypt-travel-guide, where the destination slugs changed
  // in the same move. ORDER MATTERS: the loop below returns on the first
  // match, so each old slug has to be listed BEFORE the bare /destinations
  // prefix. Otherwise /destinations/cairo would match the prefix first and
  // redirect to /egypt-travel-guide/cairo, which no longer exists.
  "/destinations/cairo": "/egypt-travel-guide/cairo-travel-guide",
  "/destinations/luxor": "/egypt-travel-guide/attractions-in-luxor",
  "/destinations/aswan": "/egypt-travel-guide/aswan-egypt-attractions",
  "/destinations/alexandria": "/egypt-travel-guide/alexandria-egypt-attractions",
  "/destinations/hurghada": "/egypt-travel-guide/things-to-do-in-hurghada",
  "/destinations/siwa-oasis": "/egypt-travel-guide/siwa-oasis-egypt",
  // Catch-all for the landing page itself and any destination whose slug did
  // not change.
  "/destinations": "/egypt-travel-guide",

  // /stay -> /luxury-hotels-in-egypt, putting the phrase the page targets in
  // its own URL. Only the listing page itself is handled here: /stay/<slug>
  // goes to /hotel/<slug> via CHILD_PATH_REDIRECTS below, because that is
  // where a hotel page actually lives.
  "/stay": "/luxury-hotels-in-egypt",
};

/**
 * Redirects for the children of a path, never the path itself.
 *
 * Needed where a parent and its children move to different places. /stay
 * became /luxury-hotels-in-egypt, but there has never been a /stay/:slug
 * route: hotel pages are served at /hotel/:slug, and that is what every
 * hotel's canonical_url points at. Old /stay/<slug> links (they existed:
 * six hotels shipped with a /stay/<slug> canonical before it was corrected)
 * therefore belong at /hotel/<slug>, not at a /luxury-hotels-in-egypt/<slug>
 * that nothing serves. /luxury-hotels-in-egypt/<slug> is mapped the same way
 * so a hand-typed or guessed child of the new listing lands on the hotel
 * rather than on a 404.
 *
 * Checked before PATH_PREFIX_REDIRECTS so the parent's own entry above can
 * still send the bare /stay to the listing page.
 */
export const CHILD_PATH_REDIRECTS: Record<string, string> = {
  "/stay": "/hotel",
  "/luxury-hotels-in-egypt": "/hotel",
};

/**
 * Redirects for one exact path, with no children and no prefix matching.
 *
 * Single blog posts live here rather than in PATH_PREFIX_REDIRECTS. A post has
 * no sub-pages, so prefix matching would only ever be a way to catch a URL
 * nobody asked for, and an exact map says what it means.
 *
 * Every target must be a path this table does not also hold a key for, so a
 * visitor is never sent through two redirects to reach the page. The test
 * suite asserts that, because the chain is the kind of thing that appears
 * later, when somebody redirects a target that was already a destination.
 */
export const EXACT_PATH_REDIRECTS: Record<string, string> = {
  // Slugs rewritten so the URL carries the keyword the article targets.
  "/blog/do-us-citizens-need-a-visa-for-egypt": "/blog/egypt-visa-for-us-citizens",
  "/blog/is-egypt-safe-for-american-tourists": "/blog/is-egypt-safe-for-americans",
  "/blog/vaccines-for-egypt-travel": "/blog/vaccinations-needed-for-egypt",
  "/blog/how-to-plan-a-luxury-egypt-trip": "/blog/planning-a-trip-to-egypt",
  "/blog/things-to-know-before-traveling-to-egypt": "/blog/egypt-travel-tips",
  "/blog/egypt-packing-list": "/blog/what-to-pack-for-egypt",

  // Posts merged into another article covering the same intent.
  "/blog/luxury-egypt-vacations": "/blog/luxury-egypt-tours",
  "/blog/luxury-egypt-anniversary-trip": "/blog/egypt-honeymoon",
  "/blog/grand-egyptian-museum-private-tour": "/blog/grand-egyptian-museum-tour",
  "/blog/vip-cairo-experience": "/blog/private-tours-in-cairo-egypt",

  // Repurposed: the homepage owns "egypt private tours", and nobody searches
  // "bespoke", so both rows were rewritten against a keyword that has volume.
  "/blog/private-egypt-tour": "/blog/private-tours-in-cairo-egypt",
  "/blog/bespoke-egypt-travel": "/blog/tailor-made-egypt-tours",

  // Wrong audience, removed rather than rewritten. Its readers were looking
  // for an airport taxi, which is not a service this business sells.
  "/blog/cairo-airport-transfer": "/",
};

/**
 * Where a path should redirect to, or null when it should be served as asked.
 *
 * Separated from the middleware so the mapping can be tested directly: every
 * case here is a URL someone else may already have linked or indexed, and
 * "does /stay/x still work" should not need a running server to answer.
 *
 * `query` is the query string including its "?", or "" when there is none. It
 * is carried through to the target so a redirect never drops a utm tag.
 */
export function resolveRedirect(rawPath: string, query = ""): string | null {
  // One trailing slash is the same page. Without this, /stay/ falls through
  // every table below and is served as a 200 by the SPA catch-all, which is
  // the same class of bug as the HEAD one described on the middleware.
  const path = rawPath.length > 1 ? rawPath.replace(/\/+$/, "") : rawPath;

  const exact = EXACT_PATH_REDIRECTS[path];
  if (exact) return `${exact}${query}`;

  for (const [parent, newParent] of Object.entries(CHILD_PATH_REDIRECTS)) {
    if (path.startsWith(`${parent}/`) && path.length > parent.length + 1) {
      return `${newParent}${path.slice(parent.length)}${query}`;
    }
  }

  for (const [oldPrefix, newPrefix] of Object.entries(PATH_PREFIX_REDIRECTS)) {
    if (path === oldPrefix || path.startsWith(`${oldPrefix}/`)) {
      const rest = path.slice(oldPrefix.length); // "" for the parent itself, "/classic-egypt" for a sub-page
      return `${newPrefix}${rest}${query}`;
    }
  }

  return null;
}

export function registerPathPrefixRedirects(app: Express) {
  app.use((req: Request, res: Response, next: NextFunction) => {
    // GET and HEAD, not GET alone.
    //
    // This is why the owner's `curl -sI https://iluxuryegypt.com/stay` kept
    // answering 200 while a browser redirected correctly: -I sends HEAD, the
    // guard here read `req.method !== "GET"` and called next(), and the
    // request fell through to the SPA catch-all. The redirect was registered,
    // compiled and deployed the whole time; it simply never ran for the one
    // request being used to check it.
    //
    // HEAD has to answer exactly as GET would, minus the body. Link checkers
    // and some crawlers use it, and a HEAD that says 200 where a GET says 301
    // reports a redirect as a live page.
    if (req.method !== "GET" && req.method !== "HEAD") return next();

    // req.url is path + query string as received; slicing off the path portion
    // preserves any query string (e.g. ?utm_source=...) on the target.
    const target = resolveRedirect(req.path, req.url.slice(req.path.length));
    if (!target) return next();

    // 301, not 302: these paths are not coming back, and a temporary redirect
    // leaves the old URL in the index competing with the new one.
    res.redirect(301, target);
  });
}
