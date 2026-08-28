import type { Express, Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { storage } from "./storage";
import { SITE_URL } from "./seo-meta";

// Not bundled by esbuild (only fs.readFile'd, never imported) — resolve from
// the repo root rather than import.meta.dirname so this still finds the
// files once server/index.ts is bundled to a single dist/index.js file.
const SKILLS_DIR = path.resolve(import.meta.dirname, "..", "server", "agent-skills-content");
const MCP_ENDPOINT = `${SITE_URL}/api/mcp`;
const MCP_PROTOCOL_VERSION = "2025-06-18";

async function sha256OfFile(filePath: string): Promise<string> {
  const buffer = await fs.readFile(filePath);
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

// ---- MCP: minimal real server behind the "search Egypt tours" tool ----

const MCP_TOOLS = [
  {
    name: "search_tours",
    description: "Search iLuxury Egypt's luxury tour packages by destination and/or category.",
    inputSchema: {
      type: "object",
      properties: {
        destination: { type: "string", description: "City name to filter by, e.g. 'Luxor' or 'Aswan'" },
        category: { type: "string", description: "Tour category name, e.g. 'Classic Egypt' or 'Nile Cruise'" },
      },
    },
  },
];

async function runSearchTours(args: { destination?: string; category?: string }) {
  const tours = await storage.getTours();
  const matches = tours.filter((t) => {
    if (!t.published) return false;
    if (args.category && t.category.toLowerCase() !== args.category.toLowerCase()) return false;
    if (args.destination) {
      const needle = args.destination.toLowerCase();
      if (!t.destinations.some((d) => d.toLowerCase().includes(needle))) return false;
    }
    return true;
  });

  return matches.slice(0, 10).map((t) => ({
    title: t.title,
    url: `${SITE_URL}/${t.slug}`,
    duration: t.duration,
    price: t.price,
    currency: t.currency,
    destinations: t.destinations,
  }));
}

async function handleMcpRequest(req: Request, res: Response) {
  const { id, method, params } = req.body ?? {};

  try {
    if (method === "initialize") {
      return res.json({
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: MCP_PROTOCOL_VERSION,
          capabilities: { tools: {} },
          serverInfo: { name: "iluxuryegypt-mcp", version: "1.0.0" },
        },
      });
    }

    if (method === "tools/list") {
      return res.json({ jsonrpc: "2.0", id, result: { tools: MCP_TOOLS } });
    }

    if (method === "tools/call") {
      const toolName = params?.name;
      if (toolName !== "search_tours") {
        return res.json({
          jsonrpc: "2.0",
          id,
          error: { code: -32601, message: `Unknown tool: ${toolName}` },
        });
      }
      const results = await runSearchTours(params?.arguments ?? {});
      return res.json({
        jsonrpc: "2.0",
        id,
        result: { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] },
      });
    }

    return res.json({
      jsonrpc: "2.0",
      id,
      error: { code: -32601, message: `Method not found: ${method}` },
    });
  } catch (error) {
    console.error("Error handling MCP request:", error);
    return res.status(500).json({
      jsonrpc: "2.0",
      id,
      error: { code: -32603, message: "Internal error" },
    });
  }
}

function mcpServerCard() {
  return {
    serverInfo: { name: "iluxuryegypt-mcp", version: "1.0.0" },
    protocolVersion: MCP_PROTOCOL_VERSION,
    transport: { type: "streamable-http", url: MCP_ENDPOINT },
    capabilities: { tools: {} },
    tools: MCP_TOOLS.map((t) => ({ name: t.name, description: t.description })),
  };
}

const ROBOTS_TXT_PATH = path.resolve(import.meta.dirname, "..", "robots.txt");
const AUTH_MD_PATH = path.resolve(import.meta.dirname, "..", "auth.md");

export function registerAgentReadinessRoutes(app: Express) {
  // #3 — Content Signals: robots.txt was never actually served (no route existed
  // for it at all), so wire it up here alongside the Content-Signal line it carries.
  app.get("/robots.txt", async (_req, res) => {
    try {
      const content = await fs.readFile(ROBOTS_TXT_PATH, "utf-8");
      res.type("text/plain").send(content);
    } catch {
      res.status(404).send("Not found");
    }
  });

  // Agent registration/access policy (WorkOS "auth.md" convention) — lives at
  // the domain root, not /.well-known/, mirroring llms.txt. Declares public,
  // no-auth access; deliberately does NOT publish oauth-authorization-server
  // or oauth-protected-resource, since per RFC 9728 and MCP's own auth spec,
  // publishing those is itself a signal that authorization is required —
  // their absence is the spec-correct way to say "no auth at all."
  app.get("/auth.md", async (_req, res) => {
    try {
      const content = await fs.readFile(AUTH_MD_PATH, "utf-8");
      res.type("text/markdown").send(content);
    } catch {
      res.status(404).send("Not found");
    }
  });

  // #4 — RFC 9727 api-catalog (application/linkset+json, RFC 9264 format)
  app.get("/.well-known/api-catalog", (_req, res) => {
    res.type("application/linkset+json").json({
      linkset: [
        {
          anchor: `${SITE_URL}/.well-known/api-catalog`,
          item: [
            { href: `${SITE_URL}/api/public/tours`, title: "Egypt luxury tour packages" },
            { href: `${SITE_URL}/api/public/tours/{slug}`, title: "Single tour by slug" },
            { href: `${SITE_URL}/api/hotels`, title: "Luxury hotels and Nile cruises" },
            { href: `${SITE_URL}/api/hotels/{idOrSlug}`, title: "Single hotel by id or slug" },
            { href: `${SITE_URL}/api/public/destinations`, title: "Egypt destinations" },
            { href: `${SITE_URL}/api/public/categories`, title: "Tour categories" },
            { href: `${SITE_URL}/api/public/faqs`, title: "Frequently asked questions" },
            { href: `${SITE_URL}/api/public/seasons`, title: "Seasonal pricing rules" },
          ],
        },
      ],
    });
  });

  // #9 — Agentic Resource Discovery (ARD) manifest
  app.get("/.well-known/ai-catalog.json", (_req, res) => {
    res.type("application/json").json({
      specVersion: "1.0",
      host: "iluxuryegypt.com",
      entries: [
        {
          urn: "urn:air:iluxuryegypt.com:tours:catalog",
          displayName: "Egypt Luxury Tour Packages",
          type: "content-catalog",
          url: `${SITE_URL}/api/public/tours`,
          representativeQueries: [
            "Luxury tours in Egypt",
            "Private Nile cruise packages",
            "Classic Egypt itinerary with pyramids and Luxor",
          ],
        },
        {
          urn: "urn:air:iluxuryegypt.com:stays:catalog",
          displayName: "Egypt Luxury Hotels & Stays",
          type: "content-catalog",
          url: `${SITE_URL}/api/hotels`,
          representativeQueries: [
            "Best luxury hotels in Cairo",
            "5-star hotel near the pyramids",
            "Nile-view resorts in Aswan",
          ],
        },
        {
          urn: "urn:air:iluxuryegypt.com:destinations:catalog",
          displayName: "Egypt Destinations Guide",
          type: "content-catalog",
          url: `${SITE_URL}/api/public/destinations`,
          representativeQueries: [
            "Best places to visit in Egypt",
            "What to see in Luxor",
            "Egypt destination guide for first-time visitors",
          ],
        },
      ],
    });
  });

  // #7 — Agent Skills discovery index (Cloudflare Agent Skills Discovery RFC, over RFC 8615)
  app.get("/.well-known/agent-skills/index.json", async (_req, res) => {
    try {
      const skills = [
        { file: "search-tours.md", name: "search-tours", type: "reference", description: "How to search and fetch iLuxury Egypt's tour packages via the public API." },
        { file: "search-stays.md", name: "search-stays", type: "reference", description: "How to browse and fetch iLuxury Egypt's luxury hotels and Nile cruises via the public API." },
      ];

      const entries = await Promise.all(
        skills.map(async (s) => ({
          name: s.name,
          type: s.type,
          description: s.description,
          url: `${SITE_URL}/.well-known/agent-skills/${s.file}`,
          sha256: await sha256OfFile(path.join(SKILLS_DIR, s.file)),
        }))
      );

      res.type("application/json").json({
        $schema: "https://agent-skills-discovery-rfc.pages.dev/schema/index.v1.json",
        skills: entries,
      });
    } catch (error) {
      console.error("Error building agent-skills index:", error);
      res.status(500).json({ message: "Error building agent-skills index" });
    }
  });

  // Serve the actual skill files referenced above
  app.get("/.well-known/agent-skills/:file", async (req, res) => {
    const file = req.params.file;
    if (!/^[a-z0-9-]+\.md$/.test(file)) return res.status(404).send("Not found");
    try {
      const content = await fs.readFile(path.join(SKILLS_DIR, file), "utf-8");
      res.type("text/markdown").send(content);
    } catch {
      res.status(404).send("Not found");
    }
  });

  // #6 — MCP Server Card (SEP-2127): served at <mcp-endpoint>/server-card,
  // plus a site-level catalog at /.well-known/mcp/catalog.json
  app.get("/.well-known/mcp/catalog.json", (_req, res) => {
    res.type("application/json").json({
      servers: [{ ...mcpServerCard(), serverCardUrl: `${MCP_ENDPOINT}/server-card` }],
    });
  });

  app.get("/api/mcp/server-card", (_req, res) => {
    res.type("application/json").json(mcpServerCard());
  });

  // Minimal real MCP server (Streamable HTTP transport, JSON-RPC 2.0) so the
  // server-card above points at something that actually works.
  app.post("/api/mcp", handleMcpRequest);
}
