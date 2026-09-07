// Generates a small "critical" CSS file — the CSS Navigation and
// HeroSlider (the only two components guaranteed to paint above the fold
// on every route) actually need, plus the global CSS variables and base
// reset every component depends on for correct colors/fonts. Run as part
// of `npm run build` (see package.json), right after `vite build`;
// inline-critical-css.ts then injects the result into dist/public/index.html
// and switches the full stylesheet to non-render-blocking.
//
// This app is pure client-side-rendered (no SSR/SSG — dist/public/index.html
// ships an empty <div id="root">), so there's no server-rendered markup a
// standard critical-CSS tool (critters/beasties) could analyze; the "above
// the fold" set here is chosen manually instead, scoped to exactly the
// components that always render first.
import fs from "fs/promises";
import path from "path";
import { createRequire } from "module";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import { transform } from "esbuild";

const projectRoot = path.resolve(import.meta.dirname, "..");
// tailwind.config.ts itself uses require() for its plugins (tailwindcss-animate,
// @tailwindcss/typography) — loading it as a real ESM import fails under tsx's
// ESM loader ("require is not defined"). Loading it via createRequire instead
// goes through tsx's CJS transform, which does support that file as-is.
const baseTailwindConfig = createRequire(import.meta.url)(path.join(projectRoot, "tailwind.config.ts")).default;
const indexCssPath = path.join(projectRoot, "client/src/index.css");
const outPath = path.join(projectRoot, "dist/critical.css");

// Pulls one top-level `selector { ... }` block out of the source CSS by
// brace-counting from the selector's opening `{` — index.css isn't run
// through postcss to extract this (that would need the full Tailwind
// pipeline just to get back to plain CSS), so a straightforward parser is
// simpler and has no other dependencies.
function extractBlock(css: string, selectorStart: string): string {
  const start = css.indexOf(selectorStart);
  if (start === -1) throw new Error(`generate-critical-css: couldn't find "${selectorStart}" in index.css`);
  const braceStart = css.indexOf("{", start);
  let depth = 0;
  for (let i = braceStart; i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}") {
      depth--;
      if (depth === 0) return css.slice(start, i + 1);
    }
  }
  throw new Error(`generate-critical-css: unbalanced braces reading "${selectorStart}"`);
}

async function run() {
  const fullCss = await fs.readFile(indexCssPath, "utf-8");

  const shellCss = [
    extractBlock(fullCss, ":root {"),
    extractBlock(fullCss, ".dark {"),
    extractBlock(fullCss, "@layer base {"),
  ].join("\n\n");

  const criticalSource = `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n${shellCss}\n`;

  const criticalConfig = {
    ...baseTailwindConfig,
    // Only classes actually used by the always-above-the-fold shell —
    // everything else (every other component on every page) keeps coming
    // from the full stylesheet, loaded async by inline-critical-css.ts.
    content: [
      path.join(projectRoot, "client/src/components/navigation.tsx"),
      path.join(projectRoot, "client/src/components/hero-slider.tsx"),
    ],
  };

  const result = await postcss([tailwindcss(criticalConfig as any), autoprefixer]).process(criticalSource, {
    from: indexCssPath,
  });
  const minified = await transform(result.css, { loader: "css", minify: true });

  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, minified.code, "utf-8");
  console.log(`Critical CSS written to ${outPath} (${(Buffer.byteLength(minified.code) / 1024).toFixed(1)}KB minified)`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
