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
};

export function registerPathPrefixRedirects(app: Express) {
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method !== "GET") return next();

    for (const [oldPrefix, newPrefix] of Object.entries(PATH_PREFIX_REDIRECTS)) {
      if (req.path === oldPrefix || req.path.startsWith(`${oldPrefix}/`)) {
        const rest = req.path.slice(oldPrefix.length); // "" for the parent itself, "/classic-egypt" for a sub-page
        // req.url is path + query string as received; slicing off the path
        // portion preserves any query string (e.g. ?utm_source=...) on the target.
        const query = req.url.slice(req.path.length);
        return res.redirect(301, `${newPrefix}${rest}${query}`);
      }
    }

    next();
  });
}
