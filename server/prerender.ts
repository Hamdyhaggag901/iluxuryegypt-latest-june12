import type { Request, Response, NextFunction } from "express";
import { log } from "./vite";

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
export async function getRenderedHtml(reqPath: string): Promise<string> {
  const cached = cache.get(reqPath);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.html;
  }

  const fullUrl = `http://localhost:${process.env.PORT || 5000}${reqPath}`;
  const html = await queuedRender(fullUrl);

  if (html.length > 10000) {
    cache.set(reqPath, { html, timestamp: Date.now() });
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
    const cacheKey = req.path;

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
