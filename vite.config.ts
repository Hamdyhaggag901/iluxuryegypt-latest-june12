import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// The built CSS bundle is otherwise injected as a plain render-blocking
// <link rel="stylesheet">. This rewrites it to the standard preload+onload
// swap pattern (same technique already used for the Google Fonts link in
// index.html) so first paint doesn't wait on it, with a <noscript> fallback
// for when JS is disabled.
function deferCss(): Plugin {
  return {
    name: "defer-css",
    transformIndexHtml: {
      order: "post",
      handler(html) {
        return html.replace(
          /<link rel="stylesheet"([^>]*?)href="([^"]+\.css)"([^>]*?)>/g,
          (_match, before, href, after) =>
            `<link rel="preload" as="style"${before}href="${href}"${after}>` +
            `<link rel="stylesheet"${before}href="${href}"${after} media="print" onload="this.media='all'">` +
            `<noscript><link rel="stylesheet" href="${href}"></noscript>`,
        );
      },
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    deferCss(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    // "true" (not "hidden") because Lighthouse's Best Practices audit only
    // detects a source map via the //# sourceMappingURL reference it leaves
    // in the JS file — "hidden" omits that reference and still flags "no
    // source map". Trade-off: this does expose readable original source via
    // devtools in production.
    sourcemap: true,
    rollupOptions: {
      output: {
        // The default build puts React, wouter, react-query, framer-motion,
        // Radix primitives and the Home page's whole component tree into one
        // ~730KB entry chunk. Splitting the rarely-changing vendor libraries
        // out lets the browser fetch/cache/parse them in parallel with the
        // app code instead of as one monolithic blocking chunk, and keeps
        // vendor bytes cached across deploys that only touch app code.
        manualChunks: {
          "vendor-react": ["react", "react-dom", "wouter"],
          "vendor-motion": ["framer-motion"],
          "vendor-query": ["@tanstack/react-query"],
        },
      },
    },
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
