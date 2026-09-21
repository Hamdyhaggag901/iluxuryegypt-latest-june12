// Does a redirect actually run, in the order the server registers things?
//
// This exists because of a redirect that was correct in source, correct in the
// compiled bundle, deployed, and still answered 200 on the live site. The map
// said /stay -> /luxury-hotels-in-egypt, registerPathPrefixRedirects ran second
// inside registerRoutes, and `curl -sI https://iluxuryegypt.com/stay` returned
// 200 every time. Nothing about reading the code found it, because reading the
// code was not the problem.
//
// -I sends HEAD. The middleware guard read `req.method !== "GET"` and called
// next() for anything else, so HEAD skipped every redirect and fell through to
// the SPA catch-all, which answers 200 for any path without a file extension.
// A browser was redirecting correctly the whole time.
//
// So the test boots the real route stack, in the real order, and asks over
// HTTP rather than asserting against the map. Both methods, because the bug
// lived entirely in the difference between them.
//
//   npx tsx scripts/test-redirects.ts

import { ENV_REPORT } from "./lib/script-env";

void ENV_REPORT;

// registerRoutes reaches storage, which reaches db.ts, which refuses to load
// without a connection string, and auth refuses to load without a secret.
// Neither is contacted: every route here answers before it touches either.
process.env.DATABASE_URL ||= "postgres://placeholder:placeholder@127.0.0.1:1/placeholder";
process.env.JWT_SECRET ||= "test-only-secret-never-used-to-sign-anything";

const realError = console.error;
console.error = (...args: unknown[]) => {
  if (typeof args[0] === "string" && /Database seeding error/.test(args[0])) return;
  realError(...args);
};

const express = (await import("express")).default;
const { registerRoutes } = await import("../server/routes");
const { EXACT_PATH_REDIRECTS, PATH_PREFIX_REDIRECTS, CHILD_PATH_REDIRECTS, resolveRedirect } =
  await import("../server/path-redirects");
const { TOUR_SLUG_REDIRECTS } = await import("../server/tour-redirects");

let fails = 0;
function ok(name: string, passed: boolean, detail = ""): void {
  console.log(`${passed ? "PASS" : "FAIL"}  ${name}${passed || !detail ? "" : `\n        ${detail}`}`);
  if (!passed) fails++;
}

const PORT = 5399;
const BASE = `http://127.0.0.1:${PORT}`;

const app = express();
const httpServer = await registerRoutes(app);
// Stands in for everything registered after the redirects in production:
// express.static, the API 404, and the SSR catch-all. All of them answer 200
// for a path like /stay, which is what makes the ordering matter.
app.use((_req: unknown, res: { status: (n: number) => { send: (b: string) => void } }) =>
  res.status(200).send("<html>SPA shell</html>"));

const listener = app.listen(PORT);
await new Promise((resolve) => listener.once("listening", resolve));

async function head(path: string) {
  return fetch(`${BASE}${path}`, { method: "HEAD", redirect: "manual" });
}
async function get(path: string) {
  return fetch(`${BASE}${path}`, { method: "GET", redirect: "manual" });
}

// ---------------------------------------------------------------------------
console.log("\nA. The request that was reported as broken\n");

for (const [label, send] of [["GET", get], ["HEAD", send0(head)]] as Array<[string, (p: string) => Promise<Response>]>) {
  const res = await send("/stay");
  ok(`${label} /stay is a 301`, res.status === 301, `got ${res.status}`);
  ok(`${label} /stay points at the hotel listing`,
     res.headers.get("location") === "/luxury-hotels-in-egypt",
     String(res.headers.get("location")));
}
function send0<T>(f: T): T { return f; }

{
  // The exact command the owner ran. -I is HEAD, and -I plus a cache buster is
  // still HEAD, which is why ?nocache=1 changed nothing.
  const res = await head("/stay?nocache=1");
  ok("HEAD /stay?nocache=1 is a 301 and keeps the query",
     res.status === 301 && res.headers.get("location") === "/luxury-hotels-in-egypt?nocache=1",
     `${res.status} ${res.headers.get("location")}`);
}
{
  const res = await head("/stay/");
  ok("HEAD /stay/ with a trailing slash is a 301", res.status === 301,
     `${res.status} ${res.headers.get("location")}`);
}

// ---------------------------------------------------------------------------
console.log("\nB. Every blog post redirect, over HTTP, both methods\n");

for (const [from, to] of Object.entries(EXACT_PATH_REDIRECTS)) {
  const g = await get(from);
  const h = await head(from);
  ok(`${from}`,
     g.status === 301 && h.status === 301 && g.headers.get("location") === to && h.headers.get("location") === to,
     `GET ${g.status} ${g.headers.get("location")} / HEAD ${h.status} ${h.headers.get("location")}, wanted 301 ${to}`);
}

// ---------------------------------------------------------------------------
console.log("\nC. One hop, never two\n");

{
  // A target that is also a key sends a visitor through two redirects. Search
  // engines follow the chain and dislike it, and it is the failure that turns
  // up months later when somebody redirects a page that was a destination.
  const chained: string[] = [];
  for (const [from, to] of Object.entries(EXACT_PATH_REDIRECTS)) {
    const next = resolveRedirect(to.split("?")[0]);
    if (next) chained.push(`${from} -> ${to} -> ${next}`);
  }
  ok("no exact redirect lands on another redirect", chained.length === 0, chained.join("\n        "));

  const prefixChains: string[] = [];
  for (const [, to] of Object.entries(PATH_PREFIX_REDIRECTS)) {
    const next = resolveRedirect(to);
    if (next) prefixChains.push(`${to} -> ${next}`);
  }
  for (const [, to] of Object.entries(CHILD_PATH_REDIRECTS)) {
    const next = resolveRedirect(`${to}/example-slug`);
    if (next) prefixChains.push(`${to}/example-slug -> ${next}`);
  }
  for (const [, to] of Object.entries(TOUR_SLUG_REDIRECTS)) {
    const next = resolveRedirect(`/${to}`);
    if (next) prefixChains.push(`/${to} -> ${next}`);
  }
  ok("no prefix, child or tour redirect lands on another redirect",
     prefixChains.length === 0, prefixChains.join("\n        "));

  // And over HTTP, for real: follow each target once and it must not move.
  const live: string[] = [];
  for (const to of new Set(Object.values(EXACT_PATH_REDIRECTS))) {
    const res = await get(to);
    if (res.status === 301) live.push(`${to} -> ${res.headers.get("location")}`);
  }
  ok("and no target redirects again when actually requested", live.length === 0, live.join("\n        "));
}

// ---------------------------------------------------------------------------
console.log("\nD. Everything else is left alone\n");

for (const path of ["/blog", "/luxury-hotels-in-egypt", "/hotel/example", "/", "/egypt-travel-guide/cairo-travel-guide"]) {
  const res = await head(path);
  ok(`HEAD ${path} is not redirected`, res.status !== 301, `got ${res.status} ${res.headers.get("location") ?? ""}`);
}
{
  // A slug that merely starts with a redirected one must not be caught. This
  // matters here: /blog/private-egypt-tour redirects and
  // /blog/private-egypt-tour-vs-group-tour is a live article that does not.
  const res = await head("/blog/private-egypt-tour-vs-group-tour");
  ok("a longer slug sharing a redirected prefix is not caught", res.status !== 301,
     `got ${res.status} ${res.headers.get("location") ?? ""}`);
}
{
  const res = await fetch(`${BASE}/stay`, { method: "POST", redirect: "manual" });
  ok("POST /stay is not redirected", res.status !== 301, `got ${res.status}`);
}

listener.close();
httpServer.close?.();

console.log(fails === 0 ? "\nAll redirect cases passed." : `\n${fails} failure(s)`);
process.exit(fails === 0 ? 0 : 1);
