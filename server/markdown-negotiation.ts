import type { Request, Response, NextFunction } from "express";
import TurndownService from "turndown";
import { getRenderedHtml } from "./prerender";
import { log } from "./vite";

const turndown = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced" });
// "svg" isn't in TurndownService's HTMLElementTagNameMap-derived Filter type; cast around it.
turndown.remove(["script", "style", "noscript", "nav", "footer", "svg"] as unknown as TurndownService.TagName[]);

function htmlToMarkdown(html: string): string {
  // Convert just <main> (falling back to <body>) so nav/footer chrome and
  // scripts don't pollute the markdown an agent reads.
  const mainMatch = html.match(/<main[^>]*>([\s\S]*)<\/main>/i);
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const content = mainMatch?.[1] ?? bodyMatch?.[1] ?? html;
  return turndown.turndown(content).trim();
}

// #2 — Markdown Negotiation: `Accept: text/markdown` gets back a Markdown
// rendition of the page instead of HTML. Reuses the same Puppeteer
// render + 24h cache as prerenderMiddleware (production only).
export function markdownNegotiationMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== "GET") return next();
    if (req.path.startsWith("/api")) return next();
    if (req.path.startsWith("/admin")) return next();
    if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|webp|avif|woff|woff2|mp4|pdf)$/)) return next();

    const accept = req.headers.accept || "";
    if (!accept.includes("text/markdown")) return next();

    try {
      const html = await getRenderedHtml(req.path);
      const markdown = htmlToMarkdown(html);
      res.set("Content-Type", "text/markdown; charset=utf-8");
      res.set("Vary", "Accept");
      res.send(markdown);
    } catch (err: any) {
      log(`Markdown negotiation error for ${req.path}: ${err.message}`);
      next();
    }
  };
}
