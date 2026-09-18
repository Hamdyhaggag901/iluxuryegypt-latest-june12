# Publishing schedule: 13 SEO articles

13 articles across five weeks, one every two to three days. Publishing a
batch at once is an unnatural pattern for a site this young, which is the only
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
| 1 | Tuesday, 22 September 2026, 09:00 Cairo time | `abu-simbel-tour-from-aswan` | `abu simbel tour from aswan` | 1773 |
| 2 | Thursday, 24 September 2026, 09:00 Cairo time | `grand-egyptian-museum-tour` | `grand egyptian museum tour` | 1968 |
| 3 | Sunday, 27 September 2026, 09:00 Cairo time | `tombs-in-the-valley-of-kings` | `tombs in the valley of kings` | 1789 |
| 4 | Tuesday, 29 September 2026, 09:00 Cairo time | `what-to-see-in-luxor` | `what to see in luxor` | 1914 |
| 5 | Friday, 2 October 2026, 09:00 Cairo time | `dahshur-pyramids-egypt` | `dahshur pyramids egypt` | 1543 |
| 6 | Monday, 5 October 2026, 09:00 Cairo time | `nubian-village-aswan-egypt` | `nubian village aswan egypt` | 1409 |
| 7 | Thursday, 8 October 2026, 09:00 Cairo time | `dendera-temple-egypt` | `dendera temple egypt` | 1933 |
| 8 | Sunday, 11 October 2026, 09:00 Cairo time | `kom-ombo-temple` | `kom ombo temple` | 1751 |
| 9 | Wednesday, 14 October 2026, 09:00 Cairo time | `medinet-habu` | `medinet habu` | 1403 |
| 10 | Saturday, 17 October 2026, 09:00 Cairo time | `things-to-do-in-aswan` | `things to do in aswan` | 1717 |
| 11 | Tuesday, 20 October 2026, 09:00 Cairo time | `coptic-cairo` | `coptic cairo` | 1437 |
| 12 | Friday, 23 October 2026, 09:00 Cairo time | `islamic-cairo` | `islamic cairo` | 1535 |
| 13 | Monday, 26 October 2026, 09:00 Cairo time | `alexandria-day-trip-from-cairo` | `alexandria day trip from cairo` | 1390 |

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
- **Length:** 1773 words, 11 H2 sections
- **FAQs:** 8, rendered on the page and emitted as FAQPage structured data
- **SQL file:** `content-updates/blog-01-abu-simbel-tour-from-aswan.sql`
- **Internal links:**
  - tour: `/12-days-egypt-tour` &mdash; anchor "twelve day Egypt itinerary"
  - tour: `/egypt-nile-cruise-packages` &mdash; anchor "Nile cruise options"
  - destination: `/egypt-travel-guide/aswan-egypt-attractions` &mdash; anchor "Aswan area guide"
  - destination: `/egypt-travel-guide/attractions-in-luxor` &mdash; anchor "Luxor guide"

### 2. Grand Egyptian Museum Tour: A Visitor's Guide

- **Goes live:** Thursday, 24 September 2026, 09:00 Cairo time
- **URL:** `/blog/grand-egyptian-museum-tour`
- **Primary keyword:** `grand egyptian museum tour` (4 uses in the body)
- **Secondary:** `grand egyptian museum tours`, `grand egyptian museum reviews`
- **SEO title:** Grand Egyptian Museum Tour: Visitor's Guide (43 chars)
- **Meta description:** 151 chars
- **Length:** 1968 words, 12 H2 sections
- **FAQs:** 8, rendered on the page and emitted as FAQPage structured data
- **SQL file:** `content-updates/blog-02-grand-egyptian-museum-tour.sql`
- **Internal links:**
  - tour: `/7-day-egypt-tour` &mdash; anchor "seven day Egypt itinerary"
  - destination: `/egypt-travel-guide/cairo-travel-guide` &mdash; anchor "Cairo area guide"
  - article: `/blog/abu-simbel-tour-from-aswan` &mdash; anchor "Abu Simbel comparison"

### 3. Tombs in the Valley of Kings: Which Three to Pick

- **Goes live:** Sunday, 27 September 2026, 09:00 Cairo time
- **URL:** `/blog/tombs-in-the-valley-of-kings`
- **Primary keyword:** `tombs in the valley of kings` (3 uses in the body)
- **Secondary:** `how many tombs are in the valley of the kings`, `valley of the kings tickets`
- **SEO title:** Tombs in the Valley of Kings: Which to Choose (45 chars)
- **Meta description:** 159 chars
- **Length:** 1789 words, 11 H2 sections
- **FAQs:** 8, rendered on the page and emitted as FAQPage structured data
- **SQL file:** `content-updates/blog-03-tombs-in-the-valley-of-kings.sql`
- **Internal links:**
  - tour: `/12-days-egypt-tour` &mdash; anchor "twelve day Egypt itinerary"
  - destination: `/egypt-travel-guide/attractions-in-luxor` &mdash; anchor "Luxor area guide"
  - article: `/blog/abu-simbel-tour-from-aswan` &mdash; anchor "Abu Simbel guide"

### 4. What to See in Luxor: Two Days, Two Banks

- **Goes live:** Tuesday, 29 September 2026, 09:00 Cairo time
- **URL:** `/blog/what-to-see-in-luxor`
- **Primary keyword:** `what to see in luxor` (4 uses in the body)
- **Secondary:** `what to do in luxor egypt`, `luxor sightseeing`
- **SEO title:** What to See in Luxor: A Two Day Plan (36 chars)
- **Meta description:** 150 chars
- **Length:** 1914 words, 14 H2 sections
- **FAQs:** 8, rendered on the page and emitted as FAQPage structured data
- **SQL file:** `content-updates/blog-04-what-to-see-in-luxor.sql`
- **Internal links:**
  - article: `/blog/tombs-in-the-valley-of-kings` &mdash; anchor "which three tombs to pick"
  - tour: `/10-day-egypt-tour` &mdash; anchor "ten day Egypt itinerary"
  - destination: `/egypt-travel-guide/attractions-in-luxor` &mdash; anchor "Luxor area guide"

### 5. Dahshur Pyramids Egypt: Saqqara Without the Crowds

- **Goes live:** Friday, 2 October 2026, 09:00 Cairo time
- **URL:** `/blog/dahshur-pyramids-egypt`
- **Primary keyword:** `dahshur pyramids egypt` (3 uses in the body)
- **Secondary:** `dahshur pyramids`, `saqqara pyramid egypt`, `bent pyramid`
- **SEO title:** Dahshur Pyramids Egypt: Pyramids Without Crowds (47 chars)
- **Meta description:** 155 chars
- **Length:** 1543 words, 12 H2 sections
- **FAQs:** 8, rendered on the page and emitted as FAQPage structured data
- **SQL file:** `content-updates/blog-05-dahshur-pyramids-egypt.sql`
- **Internal links:**
  - tour: `/12-days-egypt-tour` &mdash; anchor "twelve day Egypt itinerary"
  - article: `/blog/grand-egyptian-museum-tour` &mdash; anchor "museum guide"
  - destination: `/egypt-travel-guide/cairo-travel-guide` &mdash; anchor "Cairo area guide"

### 6. Nubian Village Aswan Egypt: What a Visit Is Really Like

- **Goes live:** Monday, 5 October 2026, 09:00 Cairo time
- **URL:** `/blog/nubian-village-aswan-egypt`
- **Primary keyword:** `nubian village aswan egypt` (3 uses in the body)
- **Secondary:** `nubian village in aswan`, `nubian village aswan`, `nubian village tour aswan`
- **SEO title:** Nubian Village Aswan Egypt: What the Visit Is Like (50 chars)
- **Meta description:** 152 chars
- **Length:** 1409 words, 9 H2 sections
- **FAQs:** 8, rendered on the page and emitted as FAQPage structured data
- **SQL file:** `content-updates/blog-06-nubian-village-aswan-egypt.sql`
- **Internal links:**
  - tour: `/egypt-private-tours` &mdash; anchor "private Egypt itineraries"
  - destination: `/egypt-travel-guide/aswan-egypt-attractions` &mdash; anchor "Aswan area guide"
  - article: `/blog/abu-simbel-tour-from-aswan` &mdash; anchor "Abu Simbel guide"

### 7. Dendera Temple Egypt and Abydos: One Long Day from Luxor

- **Goes live:** Thursday, 8 October 2026, 09:00 Cairo time
- **URL:** `/blog/dendera-temple-egypt`
- **Primary keyword:** `dendera temple egypt` (3 uses in the body)
- **Secondary:** `dendera temple`, `temple of hathor at dendera`, `abydos temple`, `temple of seti i abydos`
- **SEO title:** Dendera Temple Egypt and Abydos: A Day from Luxor (49 chars)
- **Meta description:** 156 chars
- **Length:** 1933 words, 12 H2 sections
- **FAQs:** 8, rendered on the page and emitted as FAQPage structured data
- **SQL file:** `content-updates/blog-07-dendera-temple-egypt.sql`
- **Internal links:**
  - destination: `/egypt-travel-guide/attractions-in-luxor` &mdash; anchor "Luxor area guide"
  - article: `/blog/tombs-in-the-valley-of-kings` &mdash; anchor "guide to choosing tombs"
  - tour: `/12-days-egypt-tour` &mdash; anchor "twelve day itinerary"

### 8. Kom Ombo Temple and Edfu: The Two Temples You See from the River

- **Goes live:** Sunday, 11 October 2026, 09:00 Cairo time
- **URL:** `/blog/kom-ombo-temple`
- **Primary keyword:** `kom ombo temple` (3 uses in the body)
- **Secondary:** `temple of kom ombo`, `temple of edfu egypt`, `temple of horus edfu`
- **SEO title:** Kom Ombo Temple and Edfu: The Two River Temples (47 chars)
- **Meta description:** 156 chars
- **Length:** 1751 words, 11 H2 sections
- **FAQs:** 8, rendered on the page and emitted as FAQPage structured data
- **SQL file:** `content-updates/blog-08-kom-ombo-temple.sql`
- **Internal links:**
  - tour: `/egypt-nile-cruise-packages` &mdash; anchor "Nile cruise itineraries"
  - destination: `/egypt-travel-guide/aswan-egypt-attractions` &mdash; anchor "Aswan area guide"
  - article: `/blog/what-to-see-in-luxor` &mdash; anchor "Luxor guide"

### 9. Medinet Habu: The Luxor Temple Almost Everyone Drives Past

- **Goes live:** Wednesday, 14 October 2026, 09:00 Cairo time
- **URL:** `/blog/medinet-habu`
- **Primary keyword:** `medinet habu` (5 uses in the body)
- **Secondary:** `medinet habu luxor`, `medinet habu temple`, `temple of medinet habu`
- **SEO title:** Medinet Habu: The Luxor Temple People Drive Past (48 chars)
- **Meta description:** 155 chars
- **Length:** 1403 words, 9 H2 sections
- **FAQs:** 8, rendered on the page and emitted as FAQPage structured data
- **SQL file:** `content-updates/blog-09-medinet-habu.sql`
- **Internal links:**
  - destination: `/egypt-travel-guide/attractions-in-luxor` &mdash; anchor "Luxor area guide"
  - article: `/blog/tombs-in-the-valley-of-kings` &mdash; anchor "tomb choosing guide"
  - tour: `/best-luxury-egypt-tours` &mdash; anchor "longer Egypt itineraries"

### 10. Things to Do in Aswan, in the Order That Actually Matters

- **Goes live:** Saturday, 17 October 2026, 09:00 Cairo time
- **URL:** `/blog/things-to-do-in-aswan`
- **Primary keyword:** `things to do in aswan` (3 uses in the body)
- **Secondary:** `things to do in aswan egypt`, `best things to do in aswan`
- **SEO title:** Things to Do in Aswan: What to See First (40 chars)
- **Meta description:** 153 chars
- **Length:** 1717 words, 13 H2 sections
- **FAQs:** 8, rendered on the page and emitted as FAQPage structured data
- **SQL file:** `content-updates/blog-10-things-to-do-in-aswan.sql`
- **Internal links:**
  - article: `/blog/nubian-village-aswan-egypt` &mdash; anchor "guide to visiting one"
  - article: `/blog/abu-simbel-tour-from-aswan` &mdash; anchor "Abu Simbel guide"
  - destination: `/egypt-travel-guide/aswan-egypt-attractions` &mdash; anchor "Aswan destination guide"
  - tour: `/egypt-nile-cruise-packages` &mdash; anchor "Nile cruise itineraries"

### 11. Coptic Cairo: Four Sites in One Walk, and How to Read Them

- **Goes live:** Tuesday, 20 October 2026, 09:00 Cairo time
- **URL:** `/blog/coptic-cairo`
- **Primary keyword:** `coptic cairo` (3 uses in the body)
- **Secondary:** `coptic cairo egypt`, `coptic museum cairo`, `hanging church cairo`
- **SEO title:** Coptic Cairo: Four Sites in a Single Short Walk (47 chars)
- **Meta description:** 155 chars
- **Length:** 1437 words, 9 H2 sections
- **FAQs:** 8, rendered on the page and emitted as FAQPage structured data
- **SQL file:** `content-updates/blog-11-coptic-cairo.sql`
- **Internal links:**
  - destination: `/egypt-travel-guide/cairo-travel-guide` &mdash; anchor "Cairo area guide"
  - article: `/blog/grand-egyptian-museum-tour` &mdash; anchor "Grand Egyptian Museum guide"
  - tour: `/egypt-private-tours` &mdash; anchor "private Cairo itineraries"

### 12. Islamic Cairo: Walking Al Muizz Street End to End

- **Goes live:** Friday, 23 October 2026, 09:00 Cairo time
- **URL:** `/blog/islamic-cairo`
- **Primary keyword:** `islamic cairo` (3 uses in the body)
- **Secondary:** `al muizz street`, `al muizz street cairo`, `islamic cairo egypt`
- **SEO title:** Islamic Cairo: Walking Al Muizz Street End to End (49 chars)
- **Meta description:** 160 chars
- **Length:** 1535 words, 11 H2 sections
- **FAQs:** 8, rendered on the page and emitted as FAQPage structured data
- **SQL file:** `content-updates/blog-12-islamic-cairo.sql`
- **Internal links:**
  - destination: `/egypt-travel-guide/cairo-travel-guide` &mdash; anchor "Cairo area guide"
  - article: `/blog/coptic-cairo` &mdash; anchor "Coptic quarter guide"
  - tour: `/egypt-private-tours` &mdash; anchor "private Cairo itineraries"

### 13. Alexandria Day Trip from Cairo: The Honest Logistics

- **Goes live:** Monday, 26 October 2026, 09:00 Cairo time
- **URL:** `/blog/alexandria-day-trip-from-cairo`
- **Primary keyword:** `alexandria day trip from cairo` (3 uses in the body)
- **Secondary:** `day trip to alexandria from cairo`, `day trip from cairo to alexandria`, `what to see in alexandria egypt`
- **SEO title:** Alexandria Day Trip from Cairo: How to Do It Well (49 chars)
- **Meta description:** 150 chars
- **Length:** 1390 words, 8 H2 sections
- **FAQs:** 8, rendered on the page and emitted as FAQPage structured data
- **SQL file:** `content-updates/blog-13-alexandria-day-trip-from-cairo.sql`
- **Internal links:**
  - destination: `/egypt-travel-guide/alexandria-egypt-attractions` &mdash; anchor "Alexandria destination guide"
  - destination: `/egypt-travel-guide/cairo-travel-guide` &mdash; anchor "Cairo guide"
  - article: `/blog/grand-egyptian-museum-tour` &mdash; anchor "Grand Egyptian Museum guide"
  - tour: `/egypt-private-tours` &mdash; anchor "private day trips"

## Placeholders

Nothing here was invented. Where a price or an opening hour could not be
verified, the article says so in a sentence a reader can act on rather than
carrying a number that might be wrong.

There are none. Every article is publishable as written.


## Checks worth running after each goes live

1. Open `/blog/<slug>` and confirm the FAQ accordion renders.
2. Paste the URL into Google's Rich Results Test and confirm both BlogPosting
   and FAQPage are detected.
3. Confirm the URL is present in `/sitemap.xml`.
4. Confirm no `data-placeholder` markers are visible on the page.
