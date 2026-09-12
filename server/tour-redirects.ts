import type { Express, Request, Response, NextFunction } from "express";

// Tour slugs are flat at the site root (App.tsx's catch-all `/:slug` route
// renders TourDetail for any path that doesn't match an earlier route), so
// a renamed tour slug needs an actual server-side redirect — a client-side
// one would return 200 and let a stale link/bookmark/search result sit on
// dead content until a visitor's JS runs, and search engines weight a real
// 301 far more reliably than a JS-driven location change.
//
// No generic redirects table/admin UI exists yet (this project's other
// legacy-URL cases, e.g. LEGACY_LEGAL_SLUGS in shared/schema.ts, use the
// same small hardcoded-map approach) — add an entry here whenever a
// published tour's slug changes, so the old URL keeps working indefinitely
// instead of 404ing.
export const TOUR_SLUG_REDIRECTS: Record<string, string> = {
  "10-day-egypt-family-tour": "family-tours-egypt",
  "egypt-luxury-family-tour": "egypt-family-vacation-packages",
  "14-day-egypt-family-tour": "egypt-tours-family",
  "7-day-solo-travel-egypt": "7-day-egypt-tour",
  "9-day-solo-egypt": "10-day-egypt-tour",
  "solo-vacation-packages-luxury-egypt-5-day-tour": "12-days-egypt-tour",
  "14-day-royal-egypt": "egypt-private-tour-packages",
  "9-day-egypt-pyramids-luxor-sea": "egypt-private-tours",
  "14-day-egypt-small-group-tour": "egypt-small-group-tour",
  // Interim slug from an earlier revision of update-small-group-part1.sql,
  // mapped on in case that revision reached production before this one.
  "14-day-luxury-egypt-tour-package": "egypt-small-group-tour",
  "10-day-nile-cruise": "egypt-nile-cruise-packages",
  "luxury-siwa-oasis-expedition": "best-luxury-egypt-tours",
  "7-day-vip-egypt": "luxury-small-group-tours-egypt",
};

// Plain middleware with an exact-path string check, not an app.get("/:slug")
// route — that would match literally any single-segment GET path
// (/robots.txt, /sitemap.xml, /og-image.jpg, /admin, ...) and rely on
// Express's next()-driven fallthrough to reach their real handlers, which
// works but is a fragile way to express "only these 3 exact old slugs".
export function registerTourRedirects(app: Express) {
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method !== "GET") return next();
    const target = TOUR_SLUG_REDIRECTS[req.path.slice(1)];
    if (!target) return next();
    res.redirect(301, `/${target}`);
  });
}
