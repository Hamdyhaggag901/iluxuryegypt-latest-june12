# Agent Access Policy — iLuxury Egypt

This site's public read API requires **no authentication, no API key, and no
OAuth registration**. Every endpoint listed below is open for direct,
unauthenticated GET requests by AI agents, crawlers, and automated clients.

There is no `/.well-known/oauth-authorization-server` or
`/.well-known/oauth-protected-resource` document, and none should be assumed
to exist — their absence is deliberate and itself signals that this API has
no authorization layer to negotiate.

## Discovery

- API catalog (RFC 9727 / RFC 9264 linkset): `/.well-known/api-catalog`
- Agentic resource manifest (ARD): `/.well-known/ai-catalog.json`
- Agent skills index: `/.well-known/agent-skills/index.json`
- MCP server card: `/api/mcp/server-card`
- MCP site catalog: `/.well-known/mcp/catalog.json`
- MCP endpoint (JSON-RPC 2.0, Streamable HTTP): `POST /api/mcp`

## Public read endpoints

- `GET /api/public/tours` — tour packages
- `GET /api/public/tours/{slug}` — single tour
- `GET /api/hotels` — hotels and Nile cruises
- `GET /api/hotels/{idOrSlug}` — single hotel
- `GET /api/public/destinations` — destinations
- `GET /api/public/categories` — tour categories
- `GET /api/public/faqs` — frequently asked questions
- `GET /api/public/seasons` — seasonal pricing rules

## Rate limits

No rate limit is currently enforced. Please make requests at a reasonable
pace. For sustained high-volume or bulk access, get in touch first via
https://iluxuryegypt.com/contact so we can accommodate it without disruption
to the site.

## Content use

See `/robots.txt` for the `Content-Signal` directive governing AI training
and input use of this site's content.
