# Publishing schedule: five SEO articles

Five articles across two weeks, one every two to three days. Publishing all
five at once is an unnatural pattern for a site this young, which is the only
reason they are spread out rather than shipped together.

Each one is already loaded with `status = 'published'` and a `scheduled_at`
timestamp, so nothing needs to be done on the day. The post stays out of the
blog list, the sitemap and the server rendered meta tags until its moment, then
appears on all of them at once. See `shared/post-visibility.ts` for the rule.

When a scheduled post goes live, IndexNow is notified automatically by the
claim in `server/indexnow.ts`, triggered at server boot and on the first
sitemap fetch after the moment passes. No manual step is needed for that.

## Order and dates

| # | Goes live | Slug | Primary keyword | Words |
|---|---|---|---|---|
| 1 | Tuesday, 22 September 2026, 09:00 Cairo time | `abu-simbel-tour-from-aswan` | `abu simbel tour from aswan` | 1679 |
| 2 | Thursday, 24 September 2026, 09:00 Cairo time | `grand-egyptian-museum-tour` | `grand egyptian museum tour` | 1807 |
| 3 | Sunday, 27 September 2026, 09:00 Cairo time | `tombs-in-the-valley-of-kings` | `tombs in the valley of kings` | 1520 |
| 4 | Tuesday, 29 September 2026, 09:00 Cairo time | `what-to-see-in-luxor` | `what to see in luxor` | 1816 |
| 5 | Friday, 2 October 2026, 09:00 Cairo time | `dahshur-pyramids-egypt` | `dahshur pyramids egypt` | 1510 |

The order is deliberate. Each article links back to ones already published and
never forward to one still scheduled, because a link to a post that has not
reached its date would 404. The generator enforces this.

## Per article

### 1. Abu Simbel Tour from Aswan: Flight or Road

- **Goes live:** Tuesday, 22 September 2026, 09:00 Cairo time
- **URL:** `/blog/abu-simbel-tour-from-aswan`
- **Primary keyword:** `abu simbel tour from aswan` (3 uses in the body)
- **Secondary:** `abu simbel day trip from aswan`, `abu simbel from aswan`
- **SEO title:** Abu Simbel Tour from Aswan: Flight vs Road (42 chars)
- **Meta description:** 153 chars
- **Length:** 1679 words, 11 H2 sections
- **FAQs:** 8, rendered on the page and emitted as FAQPage structured data
- **SQL file:** `content-updates/blog-01-abu-simbel-tour-from-aswan.sql`
- **Internal links:**
  - tour: `/12-days-egypt-tour` &mdash; anchor "twelve day Egypt itinerary"
  - tour: `/egypt-nile-cruise-packages` &mdash; anchor "Nile cruise options"
  - destination: `/egypt-travel-guide/aswan-egypt-attractions` &mdash; anchor "Aswan area guide"
  - destination: `/egypt-travel-guide/attractions-in-luxor` &mdash; anchor "Luxor guide"
  - article: `/blog/{{RELATED_POST_SLUG}}` &mdash; anchor "{{RELATED_POST_ANCHOR}}"
- **Placeholders to fill:** `abu-simbel-road-cost`, `abu-simbel-air-cost`, `abu-simbel-ticket`, `abu-simbel-hours`, `RELATED_POST_SLUG`, `RELATED_POST_ANCHOR`

### 2. Grand Egyptian Museum Tour: A Visitor's Guide

- **Goes live:** Thursday, 24 September 2026, 09:00 Cairo time
- **URL:** `/blog/grand-egyptian-museum-tour`
- **Primary keyword:** `grand egyptian museum tour` (4 uses in the body)
- **Secondary:** `grand egyptian museum tours`, `grand egyptian museum reviews`
- **SEO title:** Grand Egyptian Museum Tour: Visitor's Guide (43 chars)
- **Meta description:** 151 chars
- **Length:** 1807 words, 12 H2 sections
- **FAQs:** 8, rendered on the page and emitted as FAQPage structured data
- **SQL file:** `content-updates/blog-02-grand-egyptian-museum-tour.sql`
- **Internal links:**
  - tour: `/7-day-egypt-tour` &mdash; anchor "seven day Egypt itinerary"
  - destination: `/egypt-travel-guide/cairo-travel-guide` &mdash; anchor "Cairo area guide"
  - article: `/blog/abu-simbel-tour-from-aswan` &mdash; anchor "Abu Simbel comparison"
- **Placeholders to fill:** `gem-hours`, `gem-ticket`

### 3. Tombs in the Valley of Kings: Which Three to Pick

- **Goes live:** Sunday, 27 September 2026, 09:00 Cairo time
- **URL:** `/blog/tombs-in-the-valley-of-kings`
- **Primary keyword:** `tombs in the valley of kings` (3 uses in the body)
- **Secondary:** `how many tombs are in the valley of the kings`, `valley of the kings tickets`
- **SEO title:** Tombs in the Valley of Kings: Which to Choose (45 chars)
- **Meta description:** 159 chars
- **Length:** 1520 words, 11 H2 sections
- **FAQs:** 8, rendered on the page and emitted as FAQPage structured data
- **SQL file:** `content-updates/blog-03-tombs-in-the-valley-of-kings.sql`
- **Internal links:**
  - tour: `/12-days-egypt-tour` &mdash; anchor "twelve day Egypt itinerary"
  - destination: `/egypt-travel-guide/attractions-in-luxor` &mdash; anchor "Luxor area guide"
  - article: `/blog/abu-simbel-tour-from-aswan` &mdash; anchor "Abu Simbel guide"
- **Placeholders to fill:** `vok-separate-tickets`, `vok-general-ticket`

### 4. What to See in Luxor: Two Days, Two Banks

- **Goes live:** Tuesday, 29 September 2026, 09:00 Cairo time
- **URL:** `/blog/what-to-see-in-luxor`
- **Primary keyword:** `what to see in luxor` (4 uses in the body)
- **Secondary:** `what to do in luxor egypt`, `luxor sightseeing`
- **SEO title:** What to See in Luxor: A Two Day Plan (36 chars)
- **Meta description:** 150 chars
- **Length:** 1816 words, 14 H2 sections
- **FAQs:** 8, rendered on the page and emitted as FAQPage structured data
- **SQL file:** `content-updates/blog-04-what-to-see-in-luxor.sql`
- **Internal links:**
  - article: `/blog/tombs-in-the-valley-of-kings` &mdash; anchor "which three tombs to pick"
  - tour: `/10-day-egypt-tour` &mdash; anchor "ten day Egypt itinerary"
  - destination: `/egypt-travel-guide/attractions-in-luxor` &mdash; anchor "Luxor area guide"
- **Placeholders to fill:** `luxor-tickets`

### 5. Dahshur Pyramids Egypt: Saqqara Without the Crowds

- **Goes live:** Friday, 2 October 2026, 09:00 Cairo time
- **URL:** `/blog/dahshur-pyramids-egypt`
- **Primary keyword:** `dahshur pyramids egypt` (3 uses in the body)
- **Secondary:** `dahshur pyramids`, `saqqara pyramid egypt`, `bent pyramid`
- **SEO title:** Dahshur Pyramids Egypt: Pyramids Without Crowds (47 chars)
- **Meta description:** 155 chars
- **Length:** 1510 words, 12 H2 sections
- **FAQs:** 8, rendered on the page and emitted as FAQPage structured data
- **SQL file:** `content-updates/blog-05-dahshur-pyramids-egypt.sql`
- **Internal links:**
  - tour: `/12-days-egypt-tour` &mdash; anchor "twelve day Egypt itinerary"
  - article: `/blog/grand-egyptian-museum-tour` &mdash; anchor "museum guide"
  - destination: `/egypt-travel-guide/cairo-travel-guide` &mdash; anchor "Cairo area guide"
- **Placeholders to fill:** `saqqara-dahshur-tickets`, `saqqara-dahshur-hours`

## Placeholders

Nothing below was invented. Every price and opening hour in the five articles is
a marked placeholder instead of a number that might be wrong. Search the body
for `data-placeholder` to find them, or use the list here.

| Article | Key | What to fill in |
|---|---|---|
| `abu-simbel-tour-from-aswan` | `abu-simbel-road-cost` | FILL IN: typical road trip cost per person |
| `abu-simbel-tour-from-aswan` | `abu-simbel-air-cost` | FILL IN: typical flight package cost per person |
| `abu-simbel-tour-from-aswan` | `abu-simbel-ticket` | FILL IN: current Abu Simbel entry ticket price |
| `abu-simbel-tour-from-aswan` | `abu-simbel-hours` | FILL IN: current opening hours |
| `abu-simbel-tour-from-aswan` | `RELATED_POST_SLUG` | template token, must be replaced before publishing |
| `abu-simbel-tour-from-aswan` | `RELATED_POST_ANCHOR` | template token, must be replaced before publishing |
| `grand-egyptian-museum-tour` | `gem-hours` | FILL IN: current Grand Egyptian Museum opening hours, including any late evening |
| `grand-egyptian-museum-tour` | `gem-ticket` | FILL IN: current general entry ticket price, and the separate Tutankhamun gallery supplement if one applies |
| `tombs-in-the-valley-of-kings` | `vok-separate-tickets` | FILL IN: current separate ticket prices for Tutankhamun, Seti I and Nefertari |
| `tombs-in-the-valley-of-kings` | `vok-general-ticket` | FILL IN: current general Valley of the Kings ticket price, and whether it still covers three tombs |
| `what-to-see-in-luxor` | `luxor-tickets` | FILL IN: current ticket prices for Valley of the Kings, Hatshepsut, Medinet Habu, Karnak and Luxor Temple |
| `dahshur-pyramids-egypt` | `saqqara-dahshur-tickets` | FILL IN: current Saqqara and Dahshur entry prices, plus any separate Serapeum or mastaba charges |
| `dahshur-pyramids-egypt` | `saqqara-dahshur-hours` | FILL IN: current opening hours for both sites |

Two of these are not prices. `RELATED_POST_SLUG` and `RELATED_POST_ANCHOR` in
article 1 are a link to one of the 25 articles already on the site: article 1
publishes first, so it has no earlier sibling of these five to point at, and
this session could not read the live post list to choose one. Pick a Nile or
Luxor piece and replace both tokens.

## Checks worth running after each goes live

1. Open `/blog/<slug>` and confirm the FAQ accordion renders.
2. Paste the URL into Google's Rich Results Test and confirm both BlogPosting
   and FAQPage are detected.
3. Confirm the URL is present in `/sitemap.xml`.
4. Confirm no `data-placeholder` markers are visible on the page.
