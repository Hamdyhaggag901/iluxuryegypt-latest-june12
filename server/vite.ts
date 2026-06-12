import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  
  // Catch-all for SPA routing - only for GET requests that don't start with /api
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    
    // Skip non-GET requests
    if (req.method !== "GET") return next();
    
    // Skip API routes
    if (url.startsWith("/api")) return next();
    
    // Skip asset-like URLs
    if (url.includes(".") && !url.endsWith("/")) return next();
    
    // Only serve HTML to clients that accept it (relaxed for curl and other tools)
    const accept = req.headers.accept;
    if (accept && !accept.includes("text/html") && accept !== "*/*") return next();

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });

  // Add JSON 404 handler for API routes AFTER Vite middlewares as final fallback
  app.use("/api/*", (_req, res) => {
    res.status(404).json({ message: "API endpoint not found" });
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "..", "dist", "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // Add JSON 404 handler for API routes in production
  app.use("/api/*", (_req, res) => {
    res.status(404).json({ message: "API endpoint not found" });
  });

  // fall through to index.html only for SPA routes (no file extension)
  app.use("*", (req, res) => {
    const url = req.originalUrl.split("?")[0];
    // If the URL has a file extension, it's a missing static file — return 404
    if (url.match(/\.\w{2,5}$/)) {
      return res.status(404).send("Not found");
    }
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
