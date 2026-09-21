import type { Request, Response, NextFunction } from "express";
import { log } from "./vite";
import { currentYear } from "@shared/year-placeholder";

let puppeteer: any = null;

const BOT_USER_AGENTS = [
  "googlebot", "bingbot", "yandexbot", "duckduckbot", "slurp",
  "baiduspider", "facebookexternalhit", "facebot", "twitterbot",
  "linkedinbot", "whatsapp", "telegrambot", "applebot",
  "pinterest", "semrushbot", "siteauditbot", "ahrefsbot", "mj12bot",
  "rogerbot", "dotbot", "petalbot", "bytespider", "gptbot",
  "screaming frog", "sitebulb", "deepcrawl", "oncrawl",
  // AI assistants' live/on-demand fetch identities — used when a user asks
  // the assistant to open a specific URL right now, distinct from that same
  // company's offline training crawler (already covered by the generic
  // "bot"/"crawler"/"spider" catch-all below: gptbot, claudebot,
  // perplexitybot, oai-searchbot, claude-searchbot). None of these contain
  // "bot"/"crawler"/"spider" so they need an explicit entry. Verified via
  // multiple corroborating secondary sources (OpenAI/Anthropic/Perplexity/
  // Meta's own docs pages were not reachable from this environment to
  // cross-check directly) — "claude-user" is the least certain of the five.
  "chatgpt-user", "claude-user", "perplexity-user",
  "meta-externalagent", "meta-externalfetcher",
  "bot", "crawler", "spider",
];

// In-memory cache: url -> { html, timestamp }
const cache = new Map<string, { html: string; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

/**
 * Drop cached bot snapshots, for the given paths or for every page.
 *
 * A snapshot here is a photograph of the page as it was, and at a day long it
 * is by far the longest lived copy in the request path. Nothing used to clear
 * it, so after an edit a crawler could keep being handed the pre-edit page for
 * twenty four hours, missing whatever the edit added, structured data
 * included. It is now cleared alongside the server rendered content cache on
 * every CMS write.
 *
 * Paths are passed where the caller knows them, because re-rendering is one
 * headless Chrome at a time and clearing the whole map over a single edit
 * would queue up the entire site behind it.
 *
 * A change made straight in the database, by SQL rather than through the
 * admin, goes through no handler and so reaches neither cache: restart the
 * process after running one.
 */
export function clearPrerenderCache(paths?: string[]): void {
  if (cache.size === 0) return;

  if (!paths) {
    const cleared = cache.size;
    cache.clear();
    log(`Prerender cache cleared (${cleared} page${cleared === 1 ? "" : "s"})`);
    return;
  }

  const cleared = paths.filter((path) => cache.delete(cacheKeyFor(path)));
  if (cleared.length > 0) log(`Prerender cache cleared: ${cleared.join(", ")}`);
}

// Concurrency control - only allow 1 Chrome at a time, queue the rest
let activeRenders = 0;
const MAX_CONCURRENT = 1;
const renderQueue: Array<{ resolve: (html: string) => void; reject: (err: Error) => void; url: string }> = [];

async function queuedRender(url: string): Promise<string> {
  if (activeRenders < MAX_CONCURRENT) {
    activeRenders++;
    try {
      const html = await renderPage(url);
      return html;
    } finally {
      activeRenders--;
      processQueue();
    }
  }
  return new Promise((resolve, reject) => {
    renderQueue.push({ resolve, reject, url });
  });
}

function processQueue() {
  if (renderQueue.length > 0 && activeRenders < MAX_CONCURRENT) {
    const next = renderQueue.shift()!;
    activeRenders++;
    renderPage(next.url)
      .then(next.resolve)
      .catch(next.reject)
      .finally(() => {
        activeRenders--;
        processQueue();
      });
  }
}

async function renderPage(url: string): Promise<string> {
  if (!puppeteer) {
    puppeteer = await import("puppeteer");
  }

  // Use full Chrome binary (NOT chrome-headless-shell) to avoid React 18 compatibility issues
  const chromePath = process.env.PUPPETEER_EXECUTABLE_PATH || undefined;

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: chromePath,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    // Wait for content to render
    await new Promise((r) => setTimeout(r, 3000));

    const html = await page.content();
    await page.close();
    return html;
  } finally {
    await browser.close();
  }
}

function isBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some((bot) => ua.includes(bot));
}

// Shared with markdown-negotiation.ts so a markdown request and a bot
// prerender of the same path reuse one Puppeteer render and one cache entry.
/**
 * Cache key for a path.
 *
 * The year is in it because article titles carry a {year} placeholder filled in
 * at render time. A snapshot taken on 31 December says 2026, and this cache
 * holds for 24 hours, so without the year in the key the first crawler of the
 * new year would be handed last year's title. Keying on it makes every entry
 * unreachable at midnight Cairo instead.
 */
export function cacheKeyFor(reqPath: string): string {
  return `${currentYear()}:${reqPath}`;
}

export async function getRenderedHtml(reqPath: string): Promise<string> {
  const cached = cache.get(cacheKeyFor(reqPath));
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.html;
  }

  const fullUrl = `http://localhost:${process.env.PORT || 5000}${reqPath}`;
  const html = await queuedRender(fullUrl);

  if (html.length > 10000) {
    cache.set(cacheKeyFor(reqPath), { html, timestamp: Date.now() });
  }

  return html;
}

export function prerenderMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== "GET") return next();
    if (req.path.startsWith("/api")) return next();
    if (req.path.startsWith("/admin")) return next();
    if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|webp|avif|woff|woff2|mp4|pdf)$/)) return next();

    const userAgent = req.headers["user-agent"] || "";
    const forcePrerender = req.query._prerender === "true";

    if (!isBot(userAgent) && !forcePrerender) return next();

    const fullUrl = `http://localhost:${process.env.PORT || 5000}${req.path}`;
    const cacheKey = cacheKeyFor(req.path);

    try {
      // Check cache
      const cached = cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL && !forcePrerender) {
        log(`Prerender cache hit: ${req.path}`);
        res.set("Content-Type", "text/html");
        res.set("X-Prerendered", "cache");
        return res.send(cached.html);
      }

      log(`Prerendering: ${req.path} (${forcePrerender ? "manual test" : userAgent.slice(0, 40)})`);

      const html = await queuedRender(fullUrl);

      // Only cache if real content rendered
      if (html.length > 10000) {
        cache.set(cacheKey, { html, timestamp: Date.now() });
      }

      res.set("Content-Type", "text/html");
      res.set("X-Prerendered", "true");
      res.send(html);
    } catch (err: any) {
      log(`Prerender error for ${req.path}: ${err.message}`);
      next();
    }
  };
}
