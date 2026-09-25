# Deploying the fourteen cluster articles: Phases A, B and C

The Nile group, the hotels group and the Fayoum group, in one ordered list.
Read the whole file before running the first command. The three things that
bite if the order slips are all in here, at the step where they bite.

`/root/iluxury` is the git checkout. `/var/www/iluxuryegypt` is the live site
and is **not** a git repo, which is why files are copied rather than pulled.

## What ships

| Phase | Articles | Publishes | Wave file |
|---|---|---|---|
| A, the Nile | 5 | 3 to 15 November 2026 | `add-posts-wave-nile-cluster.sql` |
| B, hotels | 6 | 18 November to 3 December 2026 | `add-posts-wave-hotels-cluster.sql` |
| C, Fayoum and the Old Cataract | 3 | 6 to 12 December 2026 | `add-posts-wave-planning-cluster.sql` |

Every row is inserted with `status='published'` and a `scheduled_at` in the
future, so nothing is visible until its own morning. All fourteen are 09:00
Africa/Cairo. Egypt leaves summer time on 30 October 2026, so every one of
these dates is `+02:00` and not `+03:00`.

Three hub files go with them, and each one refuses to run before the articles
it points at exist:

- `nile-cluster-hub.sql`, on or after **15 November**
- `hotels-cluster-hub.sql`, on or after **12 December** (seven members, and the
  seventh is the Phase C Old Cataract article)
- `planning-cluster-hub.sql`, on or after **9 December**

## The three orderings that matter

1. **The rewrite waves run before the hubs.** `add-posts-wave-rewrite-*.sql`
   assign `body_en` wholesale to `planning-a-trip-to-egypt`,
   `best-luxury-nile-cruise-egypt`, `best-time-to-visit-egypt` and
   `egypt-travel-tips`. A hub written into one of those rows before its wave
   ran would be overwritten without a word. Do `DEPLOY.md` first, or at least
   its step 5, before touching anything here.
2. **The hub files run after `fill-post-images.ts`.** The image filler reads a
   body, inserts figures and writes it back, so it is safe with a hub already
   present, but running things in the documented order keeps that true if the
   filler changes.
3. **`inbound-internal-links.sql` runs last**, after the images, for the same
   reason it does in `DEPLOY.md`.

---

## 1. Pull the branch and prove the tests pass

```bash
cd /root/iluxury
git fetch origin claude/tour-details-sections-audit-g6w7aj
git checkout claude/tour-details-sections-audit-g6w7aj
git pull origin claude/tour-details-sections-audit-g6w7aj

npx tsx scripts/test-redirects.ts
npx tsx scripts/test-year-placeholder.ts
npx tsx scripts/test-image-guard.ts
npx tsx scripts/test-seo-content.ts
npx tsx scripts/test-body-images.ts
npx tsx scripts/test-wikimedia-guard.ts
npx tsx scripts/test-new-article-structure.ts
npx tsc -p tsconfig.scripts.json | grep '^scripts/' || echo "scripts: 0 errors"
```

All seven must print their "All ... passed" line. `test-new-article-structure.ts`
reads the bodies back out of the three generated wave files, so it is the one
that proves the furniture, the schema and the image positions survive into the
SQL rather than only into the generator's report.

---

## 2. Copy the application files

Everything this programme changed that the running site executes. It is the
list from `DEPLOY.md` plus three files:

```bash
cd /root/iluxury
for f in \
  shared/year-placeholder.ts \
  server/path-redirects.ts \
  server/tour-redirects.ts \
  server/seo-meta.ts \
  server/seo-content.ts \
  server/prerender.ts \
  client/src/pages/blog-post.tsx \
  client/src/pages/blog.tsx \
  client/src/pages/admin-posts.tsx \
  scripts/lib/post-image-specs.ts \
  scripts/fill-post-images.ts
do
  mkdir -p "/var/www/iluxuryegypt/$(dirname "$f")"
  cp -v "$f" "/var/www/iluxuryegypt/$f"
done
```

Two of those carry changes this programme depends on and that are easy to miss:

- `server/seo-meta.ts` parses `posts.schema_markup` and appends it to the
  JSON-LD graph. Without it the three `ItemList` blocks the hub files write are
  stored and never served, and the hubs are half a cluster.
- `server/seo-content.ts` renders `stay_listing_settings.description` on
  `/luxury-hotels-in-egypt`. Without it the hotels hub is invisible to a
  crawler, because that page server rendered as a heading and a list of hotel
  names with no prose at all.

`scripts/lib/post-image-specs.ts` and `scripts/fill-post-images.ts` both changed
for the same fix: the image placer counted headings with `/<h2>/g`, which
matches nothing in an article carrying `<h2 id="...">`. Every one of these
fourteen articles does. Copy both or copy neither.

Or, if you would rather not track a file list:

```bash
cd /root/iluxury
rsync -av --delete \
  --exclude .git --exclude node_modules --exclude dist \
  --exclude .env --exclude uploads --exclude public/uploads \
  ./ /var/www/iluxuryegypt/
```

---

## 3. Build

```bash
cd /var/www/iluxuryegypt
npm run build
```

`verify-build.sh` runs first and stops the build rather than shipping a broken
bundle. If it stops, fix that; do not pass it.

---

## 4. Restart and confirm the new code is live

```bash
pm2 restart iluxury
pm2 logs iluxury --lines 40 --nostream
```

The two lines that prove step 2 landed:

```bash
curl -s    -o /dev/null -w 'GET  %{http_code} %{redirect_url}\n' https://iluxuryegypt.com/stay
curl -s -I -o /dev/null -w 'HEAD %{http_code} %{redirect_url}\n' https://iluxuryegypt.com/stay
```

Both must print `301 https://iluxuryegypt.com/luxury-hotels-in-egypt`.

### IndexNow

```bash
grep -c INDEXNOW_KEY /var/www/iluxuryegypt/.env     # must be 1
pm2 logs iluxury --lines 200 --nostream | grep indexnow
KEY=$(grep '^INDEXNOW_KEY=' /var/www/iluxuryegypt/.env | cut -d= -f2- | tr -d '"')
curl -s "https://iluxuryegypt.com/$KEY.txt"          # must print the key back
```

If the log says `disabled`, set `INDEXNOW_KEY` in `.env` and restart before
continuing. Submitting the sitemap is the last step, after the SQL.

---

## 5. Back up, then run the SQL

```bash
pg_dump "$DATABASE_URL" -t posts -t destinations -t tours -t stay_listing_settings \
  > ~/backup-before-clusters-$(date +%Y%m%d-%H%M).sql
```

Then, in this order:

```bash
cd /root/iluxury/content-updates

# The rewrite waves first, if DEPLOY.md has not already been run. They assign
# body_en to four of the pages the hubs below write into.
psql "$DATABASE_URL" -f add-posts-wave-rewrite-phase-a.sql
psql "$DATABASE_URL" -f add-posts-wave-rewrite-phase-b.sql
psql "$DATABASE_URL" -f add-posts-wave-rewrite-phase-c.sql
psql "$DATABASE_URL" -f unpublish-merged-posts.sql
psql "$DATABASE_URL" -f rewrite-internal-links.sql

# Phase A, B and C: the fourteen new articles.
psql "$DATABASE_URL" -f add-posts-wave-nile-cluster.sql
psql "$DATABASE_URL" -f add-posts-wave-hotels-cluster.sql
psql "$DATABASE_URL" -f add-posts-wave-planning-cluster.sql
```

Every file prints a verification block. **Each column labelled `bad` must read
`0`**, and the `before` block at the top of each wave file returns no rows on a
first run, which is the expected result.

Then check the publication moments, which is the one thing a wave file cannot
check for itself because it depends on the server's timezone data:

```bash
psql "$DATABASE_URL" -c "
SELECT slug,
       to_char(published_at AT TIME ZONE 'Africa/Cairo', 'YYYY-MM-DD HH24:MI') AS cairo,
       (published_at = scheduled_at) AS dates_agree
FROM posts
WHERE slug IN (
  'dahabiya-nile-cruise','nile-cruise-luxor-to-aswan','7-night-nile-cruise',
  'lake-nasser-cruise','best-time-to-go-to-egypt-nile-cruise',
  'where-to-stay-in-cairo','luxury-hotels-cairo','cairo-hotel-with-pyramid-view',
  'best-hotels-in-luxor-egypt','best-hotels-in-aswan','5-star-hotels-in-egypt',
  'fayoum-oasis-egypt','valley-of-the-whales','aswan-old-cataract-hotel-egypt')
ORDER BY published_at;"
```

Fourteen rows. Every `cairo` column must end `09:00` and every `dates_agree`
must be `t`.

---

## 6. Check the redirects, GET and HEAD

```bash
bash /root/iluxury/content-updates/verify-redirects.sh https://iluxuryegypt.com
```

55 redirects, both methods, 110 assertions. It exits non-zero on any failure.

None of the fourteen new articles has a redirect: they are new URLs and have
never been anything else. The Old Cataract article ships at
`/blog/aswan-old-cataract-hotel-egypt` and has never existed at any other path,
so there is nothing to redirect from.

---

## 7. Fill the images, three slugs per run

Plan first. It touches no network and writes nothing:

```bash
cd /var/www/iluxuryegypt
npx tsx scripts/fill-post-images.ts --plan
```

Then, one line at a time, checking the report after each:

```bash
# Phase A, the Nile
npx tsx scripts/fill-post-images.ts --only=dahabiya-nile-cruise --only=nile-cruise-luxor-to-aswan --only=7-night-nile-cruise
npx tsx scripts/fill-post-images.ts --only=lake-nasser-cruise --only=best-time-to-go-to-egypt-nile-cruise

# Phase B, hotels
npx tsx scripts/fill-post-images.ts --only=where-to-stay-in-cairo --only=luxury-hotels-cairo --only=cairo-hotel-with-pyramid-view
npx tsx scripts/fill-post-images.ts --only=best-hotels-in-luxor-egypt --only=best-hotels-in-aswan --only=5-star-hotels-in-egypt

# Phase C, Fayoum and the Old Cataract
npx tsx scripts/fill-post-images.ts --only=fayoum-oasis-egypt --only=valley-of-the-whales --only=aswan-old-cataract-hotel-egypt
```

Each article wants four images: a hero and three body figures. A position that
finds nothing is reported and skipped rather than filled with something
approximate, and that is the correct behaviour: the guards on these specs are
deliberately strict.

Two are expected to be hard and it is not a fault if they come back empty:

- the fossil skeleton on `valley-of-the-whales`, because the guard refuses any
  description naming an ocean, a museum, a replica or a model. A cast in a
  gallery is exactly the photograph that would overstate what is on show at the
  site, which is the one thing this article must not do.
- the Hawara pyramid on `fayoum-oasis-egypt`, because Giza and Dahshur are what
  a search for an Egyptian pyramid actually returns and all of them are denied.

Nothing in the Old Cataract article's three positions is a photograph of the
hotel. All three ask for Aswan, the river and the granite, and none of them
asks for a hotel at all. That is deliberate: the property is somebody else's
brand, this site is not its agent, and a guard loose enough to accept its
facade would accept any hotel facade anywhere.

Re-running a wave file after this point will not discard the figures: the
`ON CONFLICT` block keeps a body that already contains `<figure`.

---

## 8. The three hub files, each on or after its own date

These are the other half of each cluster: the pillar linking down to its
members, plus the `ItemList` that tells a crawler they are an ordered set.
Each one refuses to run if a member is missing, and each is idempotent, so a
second run changes nothing.

```bash
cd /root/iluxury/content-updates

# On or after 15 November 2026.
psql "$DATABASE_URL" -f nile-cluster-hub.sql

# On or after 9 December 2026.
psql "$DATABASE_URL" -f planning-cluster-hub.sql

# On or after 12 December 2026, once the Old Cataract article is live.
psql "$DATABASE_URL" -f hotels-cluster-hub.sql
```

Each prints a verification block. In all three, every `bad` must read `0`, and
the `links_up` column must read `1` for every cluster article: that is the
orphan check, and a `0` there means an article the pillar points at does not
point back.

`planning-cluster-hub.sql` also carries the one cross-link the generator could
not write. `fayoum-oasis-egypt` publishes on 6 December and
`valley-of-the-whales` on 9 December, so a link from the first to the second
would have been dead for three days, which the generator's link-recency guard
refuses to emit. Its last two checks confirm the link landed exactly once and
that the return link is still there.

If you want the hotels hub up before 12 December, that is a nine day gain and a
second run for it. The six Phase B articles are not orphaned in the meantime:
each one already links up to `/luxury-hotels-in-egypt` in its own prose.

Confirm the `ItemList` actually reaches a crawler rather than only the database:

```bash
curl -s https://iluxuryegypt.com/blog/best-luxury-nile-cruise-egypt | grep -c '"@type": "ItemList"'
curl -s https://iluxuryegypt.com/blog/planning-a-trip-to-egypt      | grep -c '"@type": "ItemList"'
curl -s https://iluxuryegypt.com/luxury-hotels-in-egypt             | grep -c 'cluster-hub'
```

The first two must print `1` each and the third at least `1`. A `0` on either of
the first two means `server/seo-meta.ts` did not get copied in step 2. A `0` on
the third means `server/seo-content.ts` did not.

---

## 9. Inbound internal links, last

```bash
psql "$DATABASE_URL" -f /root/iluxury/content-updates/inbound-internal-links.sql
```

82 contextual links from 19 destination guides and tour pages, to 30 articles.
42 of the 82 are for these fourteen: 15 to the Nile cluster, 18 to the hotels
cluster and 9 to the Phase C three. The other 40 belong to the sixteen
rewritten articles and go out with `DEPLOY.md`, from this same file. It prints
source, anchor, target and outcome for every one.

### Run it more than once

A link to an article that has not reached its scheduled moment is a dead link
on a destination guide, so the file **skips any target that is not live yet**
and prints the date to come back on. That is why this step is not finished on
the day you deploy. Run it here, then again after each of the three dates the
articles land on:

```bash
# again after 15 November, once the Nile five are all live
# again after 3 December, once the hotels six are all live
# again after 12 December, once the Phase C three are all live
psql "$DATABASE_URL" -f /root/iluxury/content-updates/inbound-internal-links.sql
```

Every run is idempotent, so a link already placed is left alone and only the
newly live targets pick anything up.

### Reading the report

- lower-case outcomes are fine: `added`, `skipped: already links there`, or
  `skipped: target is not live yet`, which says the date to re-run after
- **UPPER-CASE outcomes need you**: a source slug that does not exist, a target
  post that has not been inserted at all, or a page already carrying four
  internal links, which the file will not push to five

`live targets with fewer than 2 inbound links` names anything that came out
thin, and a small number here at the end is expected rather than a fault. The
cap is first come first served: a source page that spent its four links on the
rewritten articles in the first run has nothing left when a cluster article
goes live six weeks later. Those rows are the ones to place somewhere else by
hand. The file will not break its own cap to fix them, and it will not write a
link to a page that is not there yet to avoid the report.

---

## 10. llms.txt

`content-updates/llms-txt-additions.txt` holds three blocks to paste into
`llms.txt`: Nile cruises, Where to stay, and Planning the trip. They are text
for a human to paste rather than a script, because `llms.txt` is edited by hand
and nothing here should be the thing that overwrites it.

---

## 11. Tell the search engines

Admin > Settings > Notify Search Engines, or:

```bash
curl -s https://iluxuryegypt.com/sitemap.xml | grep -c '<loc>'
```

A scheduled article is deliberately absent from the sitemap until its own
morning, so on the day you deploy this the count does not jump by fourteen.
Check one that is live and one that is not:

```bash
curl -s https://iluxuryegypt.com/sitemap.xml | grep -c 'dahabiya-nile-cruise'
curl -s https://iluxuryegypt.com/sitemap.xml | grep -c 'aswan-old-cataract-hotel-egypt'
```

Before 3 November both print `0`. After 12 December both print `1`.

---

## Rolling back

The SQL is the only part that is not a file copy. The three wave files insert
new rows and delete nothing, so undoing them is a `DELETE` on those fourteen
slugs. The hub files strip and rewrite their own `<aside class="cluster-hub">`
block, so re-running a hub is safe and removing one is a `regexp_replace` with
the same pattern the file itself uses.

To restore the previous bodies, restore `posts` and `stay_listing_settings`
from the dump taken in step 5. For the code, `restore-dist.sh` puts the previous
bundle back and restarts.
