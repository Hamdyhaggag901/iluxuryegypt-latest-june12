---
name: Stays section redesign
description: Patterns and decisions made when building the /stays and /stays/:slug editorial pages
---

## Key decisions

- `/stays` replaces `/stay` (old page kept at `/stay` for backwards compat)
- `/stays/:slug` replaces `/hotel/:slug` (old page kept too)
- Navigation default href updated to `/stays`
- Hotel detail uses generated fallback article if `hotel.articleBody` is empty (so all hotels have meaningful content immediately)
- Gallery lightbox: pure React state modal, no external library, keyboard-navigable (ArrowLeft/Right/Escape)
- Scroll animations: native IntersectionObserver on hotel cards (index-staggered delay) — no framer-motion dependency needed for this
- JSON-LD LodgingBusiness schema injected via `<script type="application/ld+json">` in stays-detail.tsx

**Why:** User spec required no filters/prices, editorial tone, and admin-editable content for hero image, article title/body, and FAQs

## New DB fields on hotels table
- `article_body` (text) — rich HTML, edited via TipTap in HotelForm "Article & SEO" tab
- `hotel_faqs` (jsonb, default []) — array of {question, answer}
- `meta_title` (text) — overrides auto-generated SEO title
- `meta_description` (text) — overrides auto-generated meta description

## Settings keys used (via storage.upsertSetting)
- `stays_hero_image` — background URL for /stays hero
- `stays_article_title` — editorial article title on /stays
- `stays_article_body` — HTML body for the article (TipTap editor in admin)
- `stays_faqs` — JSON string of FAQ array

## Admin routes
- `/admin/stays-settings` → AdminStaysSettings page
- `GET/PUT /api/public/stays-settings` / `/api/cms/stays-settings` for the settings

## RichTextEditor component
- Created at `client/src/components/rich-text-editor.tsx`
- TipTap v3 with StarterKit, Underline, TextAlign, Link, Placeholder
- Reusable: `<RichTextEditor value={html} onChange={setHtml} />`
