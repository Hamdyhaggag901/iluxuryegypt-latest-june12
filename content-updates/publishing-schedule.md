# Publishing schedule: 22 SEO articles

22 articles across 12 weeks, most of them two to three days apart.
Publishing a batch at once is an unnatural pattern for a site this young, which
is the only reason they are spread out rather than shipped together.

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
| 10 | Thursday, 15 October 2026, 09:00 Cairo time | `valley-of-the-queens` | `valley of the queens` | 1813 |
| 11 | Friday, 16 October 2026, 09:00 Cairo time | `egypt-diving-red-sea` | `egypt diving red sea` | 1438 |
| 12 | Saturday, 17 October 2026, 09:00 Cairo time | `things-to-do-in-aswan` | `things to do in aswan` | 1717 |
| 13 | Monday, 19 October 2026, 09:00 Cairo time | `black-and-white-desert-egypt` | `black and white desert egypt` | 1519 |
| 14 | Tuesday, 20 October 2026, 09:00 Cairo time | `coptic-cairo` | `coptic cairo` | 1437 |
| 15 | Wednesday, 21 October 2026, 09:00 Cairo time | `tombs-of-the-nobles` | `tombs of the nobles` | 1415 |
| 16 | Friday, 23 October 2026, 09:00 Cairo time | `islamic-cairo` | `islamic cairo` | 1535 |
| 17 | Saturday, 24 October 2026, 09:00 Cairo time | `open-air-museum-memphis-egypt` | `open air museum memphis egypt` | 1450 |
| 18 | Monday, 26 October 2026, 09:00 Cairo time | `alexandria-day-trip-from-cairo` | `alexandria day trip from cairo` | 1390 |
| 19 | Tuesday, 1 December 2026, 09:00 Cairo time | `hatshepsut-temple` | `hatshepsut temple` | 2025 |
| 20 | Saturday, 5 December 2026, 09:00 Cairo time | `memphis-egypt` | `memphis egypt` | 1871 |
| 21 | Thursday, 10 December 2026, 09:00 Cairo time | `deir-el-medina` | `deir el medina` | 1428 |
| 22 | Tuesday, 15 December 2026, 09:00 Cairo time | `bahariya-oasis-egypt` | `bahariya oasis egypt` | 1458 |

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

### 10. Valley of the Queens: Nefertari and the Three Other Tombs

- **Goes live:** Thursday, 15 October 2026, 09:00 Cairo time
- **URL:** `/blog/valley-of-the-queens`
- **Primary keyword:** `valley of the queens` (5 uses in the body)
- **Secondary:** `valley of the queens egypt`, `valley of the queens luxor`, `the valley of the queens egypt`, `valley of the queens map`
- **SEO title:** Valley of the Queens: Nefertari and What Else Opens (51 chars)
- **Meta description:** 154 chars
- **Length:** 1813 words, 9 H2 sections
- **FAQs:** 8, rendered on the page and emitted as FAQPage structured data
- **SQL file:** `content-updates/add-posts-wave-one-october.sql`
- **Internal links:**
  - article: `/blog/tombs-in-the-valley-of-kings` &mdash; anchor "guide to choosing royal tombs"
  - destination: `/egypt-travel-guide/attractions-in-luxor` &mdash; anchor "Luxor area guide"
  - tour: `/best-luxury-egypt-tours` &mdash; anchor "longer Egypt itineraries"

### 11. Egypt Diving Red Sea Guide: Seasons, Sites and First Dives

- **Goes live:** Friday, 16 October 2026, 09:00 Cairo time
- **URL:** `/blog/egypt-diving-red-sea`
- **Primary keyword:** `egypt diving red sea` (3 uses in the body)
- **Secondary:** `diving in egypt red sea`, `diving the red sea egypt`, `diving red sea egypt`, `scuba diving egypt red sea`
- **SEO title:** Egypt Diving Red Sea: Seasons, Sites, First Dives (49 chars)
- **Meta description:** 157 chars
- **Length:** 1438 words, 8 H2 sections
- **FAQs:** 8, rendered on the page and emitted as FAQPage structured data
- **SQL file:** `content-updates/add-posts-wave-one-october.sql`
- **Internal links:**
  - article: `/blog/best-time-to-visit-egypt` &mdash; anchor "month by month guide to visiting Egypt"
  - destination: `/egypt-travel-guide/things-to-do-in-hurghada` &mdash; anchor "Hurghada area guide"
  - tour: `/best-luxury-egypt-tours` &mdash; anchor "longer Egypt itineraries"

### 12. Things to Do in Aswan, in the Order That Actually Matters

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

### 13. Black and White Desert Egypt: Two Deserts in One Drive

- **Goes live:** Monday, 19 October 2026, 09:00 Cairo time
- **URL:** `/blog/black-and-white-desert-egypt`
- **Primary keyword:** `black and white desert egypt` (3 uses in the body)
- **Secondary:** `black and white desert egypt tours`, `camping white desert egypt`, `white desert camp`
- **SEO title:** Black and White Desert Egypt: What the Trip Is Like (51 chars)
- **Meta description:** 157 chars
- **Length:** 1519 words, 7 H2 sections
- **FAQs:** 8, rendered on the page and emitted as FAQPage structured data
- **SQL file:** `content-updates/add-posts-wave-one-october.sql`
- **Internal links:**
  - tour: `/white-desert-luxury-camping` &mdash; anchor "luxury camping trip"
  - article: `/blog/best-time-to-visit-egypt` &mdash; anchor "month by month guide"
  - destination: `/egypt-travel-guide/siwa-oasis-egypt` &mdash; anchor "Siwa area guide"
  - tour: `/best-luxury-egypt-tours` &mdash; anchor "longer Egypt itineraries"

### 14. Coptic Cairo: Four Sites in One Walk, and How to Read Them

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

### 15. Tombs of the Nobles: Where Ancient Egypt Painted Daily Life

- **Goes live:** Wednesday, 21 October 2026, 09:00 Cairo time
- **URL:** `/blog/tombs-of-the-nobles`
- **Primary keyword:** `tombs of the nobles` (4 uses in the body)
- **Secondary:** `tombs of the nobles luxor`, `tombs of the nobles egypt`, `tomb of the nobles`
- **SEO title:** Tombs of the Nobles: Daily Life on Painted Walls (48 chars)
- **Meta description:** 157 chars
- **Length:** 1415 words, 7 H2 sections
- **FAQs:** 8, rendered on the page and emitted as FAQPage structured data
- **SQL file:** `content-updates/add-posts-wave-one-october.sql`
- **Internal links:**
  - article: `/blog/things-to-do-in-aswan` &mdash; anchor "Aswan guide"
  - destination: `/egypt-travel-guide/attractions-in-luxor` &mdash; anchor "Luxor area guide"
  - tour: `/best-luxury-egypt-tours` &mdash; anchor "longer Egypt itineraries"

### 16. Islamic Cairo: Walking Al Muizz Street End to End

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

### 17. Open Air Museum Memphis Egypt: The Colossus on Its Back

- **Goes live:** Saturday, 24 October 2026, 09:00 Cairo time
- **URL:** `/blog/open-air-museum-memphis-egypt`
- **Primary keyword:** `open air museum memphis egypt` (3 uses in the body)
- **Secondary:** `memphis open air museum`, `memphis open air museum egypt`
- **SEO title:** Open Air Museum Memphis Egypt: What Is on Display (49 chars)
- **Meta description:** 158 chars
- **Length:** 1450 words, 7 H2 sections
- **FAQs:** 8, rendered on the page and emitted as FAQPage structured data
- **SQL file:** `content-updates/add-posts-wave-one-october.sql`
- **Internal links:**
  - article: `/blog/dahshur-pyramids-egypt` &mdash; anchor "guide to Dahshur"
  - destination: `/egypt-travel-guide/cairo-travel-guide` &mdash; anchor "Cairo area guide"
  - tour: `/10-day-egypt-tour` &mdash; anchor "longer Egypt itineraries"

### 18. Alexandria Day Trip from Cairo: The Honest Logistics

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

### 19. Hatshepsut Temple at Deir el Bahari: One Monument, Two Names

- **Goes live:** Tuesday, 1 December 2026, 09:00 Cairo time
- **URL:** `/blog/hatshepsut-temple`
- **Primary keyword:** `hatshepsut temple` (3 uses in the body)
- **Secondary:** `mortuary temple of hatshepsut`, `temple of hatshepsut`, `queen hatshepsut temple`, `deir el bahari`, `deir el bahari temple`, `temple of hatshepsut egypt`, `hatshepsut temple facts`
- **SEO title:** Hatshepsut Temple at Deir el Bahari: A Full Guide (49 chars)
- **Meta description:** 157 chars
- **Length:** 2025 words, 10 H2 sections
- **FAQs:** 8, rendered on the page and emitted as FAQPage structured data
- **SQL file:** `content-updates/add-posts-wave-two-december.sql`
- **Internal links:**
  - article: `/blog/tombs-in-the-valley-of-kings` &mdash; anchor "guide to choosing royal tombs"
  - destination: `/egypt-travel-guide/attractions-in-luxor` &mdash; anchor "Luxor area guide"
  - tour: `/best-luxury-egypt-tours` &mdash; anchor "longer Egypt itineraries"

### 20. Memphis Egypt: The Ancient Capital, Not the One in Tennessee

- **Goes live:** Saturday, 5 December 2026, 09:00 Cairo time
- **URL:** `/blog/memphis-egypt`
- **Primary keyword:** `memphis egypt` (4 uses in the body)
- **Secondary:** `memphis ancient egypt`, `memphis old egypt`, `where is memphis egypt`, `memphis egypt map`
- **SEO title:** Memphis Egypt: The Ancient Capital South of Cairo (49 chars)
- **Meta description:** 157 chars
- **Length:** 1871 words, 10 H2 sections
- **FAQs:** 8, rendered on the page and emitted as FAQPage structured data
- **SQL file:** `content-updates/add-posts-wave-two-december.sql`
- **Internal links:**
  - article: `/blog/open-air-museum-memphis-egypt` &mdash; anchor "guide to the site museum"
  - article: `/blog/dahshur-pyramids-egypt` &mdash; anchor "Dahshur guide"
  - destination: `/egypt-travel-guide/cairo-travel-guide` &mdash; anchor "Cairo area guide"
  - tour: `/10-day-egypt-tour` &mdash; anchor "longer Egypt itineraries"

### 21. Deir el Medina: The Village That Built the Royal Tombs

- **Goes live:** Thursday, 10 December 2026, 09:00 Cairo time
- **URL:** `/blog/deir-el-medina`
- **Primary keyword:** `deir el medina` (4 uses in the body)
- **Secondary:** `deir el-medina`, `deir el medina egypt`, `deir el medina luxor`
- **SEO title:** Deir el Medina: The Village of the Tomb Builders (48 chars)
- **Meta description:** 151 chars
- **Length:** 1428 words, 7 H2 sections
- **FAQs:** 8, rendered on the page and emitted as FAQPage structured data
- **SQL file:** `content-updates/add-posts-wave-two-december.sql`
- **Internal links:**
  - article: `/blog/tombs-in-the-valley-of-kings` &mdash; anchor "guide to the royal tombs"
  - article: `/blog/hatshepsut-temple` &mdash; anchor "guide to Hatshepsut's temple"
  - destination: `/egypt-travel-guide/attractions-in-luxor` &mdash; anchor "Luxor area guide"
  - tour: `/best-luxury-egypt-tours` &mdash; anchor "longer Egypt itineraries"

### 22. Bahariya Oasis Egypt: Springs, Golden Mummies and Black Hills

- **Goes live:** Tuesday, 15 December 2026, 09:00 Cairo time
- **URL:** `/blog/bahariya-oasis-egypt`
- **Primary keyword:** `bahariya oasis egypt` (4 uses in the body)
- **Secondary:** `bahariya oasis`, `bahariya oasis tour`, `bahariya oasis hotels`
- **SEO title:** Bahariya Oasis Egypt: Springs, Mummies, Black Hills (51 chars)
- **Meta description:** 159 chars
- **Length:** 1458 words, 8 H2 sections
- **FAQs:** 8, rendered on the page and emitted as FAQPage structured data
- **SQL file:** `content-updates/add-posts-wave-two-december.sql`
- **Internal links:**
  - article: `/blog/black-and-white-desert-egypt` &mdash; anchor "guide to the two deserts"
  - tour: `/white-desert-luxury-camping` &mdash; anchor "luxury desert camp"
  - destination: `/egypt-travel-guide/cairo-travel-guide` &mdash; anchor "Cairo area guide"
  - tour: `/best-luxury-egypt-tours` &mdash; anchor "longer Egypt itineraries"

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
