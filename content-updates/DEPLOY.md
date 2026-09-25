# Deploying Phases A, B and C

Everything the sixteen rewritten articles need, in the order it has to happen.
Read the whole file before starting the first command: step 2 has to be
complete and live before step 5 runs, or every old blog URL 404s in the gap.

`/root/iluxury` is the git checkout. `/var/www/iluxuryegypt` is the live site
and is **not** a git repo, which is why files are copied rather than pulled.

---

## 1. Pull the branch

```bash
cd /root/iluxury
git fetch origin claude/tour-details-sections-audit-g6w7aj
git checkout claude/tour-details-sections-audit-g6w7aj
git pull origin claude/tour-details-sections-audit-g6w7aj
```

Check the tests pass before anything is copied anywhere:

```bash
cd /root/iluxury
npx tsx scripts/test-redirects.ts
npx tsx scripts/test-year-placeholder.ts
npx tsx scripts/test-image-guard.ts
npx tsx scripts/test-seo-content.ts
npx tsc -p tsconfig.scripts.json | grep '^scripts/' || echo "scripts: 0 errors"
```

---

## 2. Copy the application files

Ten files. These are everything this programme changed that the running site
actually executes:

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
  scripts/lib/post-image-specs.ts
do
  mkdir -p "/var/www/iluxuryegypt/$(dirname "$f")"
  cp -v "$f" "/var/www/iluxuryegypt/$f"
done
```

`shared/year-placeholder.ts` is a new file. If the copy of it fails the build
fails at import, which is the good failure: nothing half-deploys.

If you would rather not track a file list, this cannot miss anything:

```bash
cd /root/iluxury
rsync -av --delete \
  --exclude .git --exclude node_modules --exclude dist \
  --exclude .env --exclude uploads --exclude public/uploads \
  ./ /var/www/iluxuryegypt/
```

Check `.env` and `uploads` really are excluded before running that.

---

## 3. Build

```bash
cd /var/www/iluxuryegypt
npm run build
```

`verify-build.sh` runs first and will stop the build rather than ship a broken
bundle. If it stops, fix that before going further; do not pass it.

---

## 4. Restart, and confirm the new code is live

```bash
pm2 restart iluxury
pm2 logs iluxury --lines 40 --nostream
```

The one line that proves step 2 landed:

```bash
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' https://iluxuryegypt.com/stay
curl -s -I -o /dev/null -w '%{http_code} %{redirect_url}\n' https://iluxuryegypt.com/stay
```

Both must print `301 https://iluxuryegypt.com/luxury-hotels-in-egypt`. The
second one is the check that used to print `200` and started all of this.

### IndexNow

There is nothing to recreate on disk. `server/indexnow.ts` reads `INDEXNOW_KEY`
from the environment and serves the proof file from that value, so the key file
exists whenever the variable is set:

```bash
grep -c INDEXNOW_KEY /var/www/iluxuryegypt/.env     # must be 1
pm2 logs iluxury --lines 200 --nostream | grep indexnow
```

The log says either `enabled, key file served at /<key>.txt` or
`INDEXNOW_KEY not set, IndexNow is disabled`. If it is enabled:

```bash
KEY=$(grep '^INDEXNOW_KEY=' /var/www/iluxuryegypt/.env | cut -d= -f2- | tr -d '"'"'"'')
curl -s "https://iluxuryegypt.com/$KEY.txt"          # must print the key back
```

If it printed `disabled`, set `INDEXNOW_KEY` in `.env` and restart before
continuing. Submitting the sitemap is the last step, after the SQL.

---

## 5. Run the SQL, in this order

Take a backup first. Every file below is idempotent and safe to re-run, but a
backup costs a minute.

```bash
pg_dump "$DATABASE_URL" -t posts -t destinations -t tours \
  > ~/backup-before-rewrite-$(date +%Y%m%d-%H%M).sql
```

Then, in order:

```bash
cd /root/iluxury/content-updates

# 1. The three rewrite waves. Each UPDATEs rows that are already published,
#    never touches published_at, and renames six slugs between them.
psql "$DATABASE_URL" -f add-posts-wave-rewrite-phase-a.sql
psql "$DATABASE_URL" -f add-posts-wave-rewrite-phase-b.sql
psql "$DATABASE_URL" -f add-posts-wave-rewrite-phase-c.sql

# 2. Take the five merged posts down. Sets status='draft', keeps the bodies.
psql "$DATABASE_URL" -f unpublish-merged-posts.sql

# 3. Point every internal link in existing content at the new slugs, so no
#    reader and no crawler takes a redirect hop that does not need taking.
psql "$DATABASE_URL" -f rewrite-internal-links.sql
```

Every file prints a verification block. **Each column labelled `bad` must read
`0`** and the row counts must match what the header says. Stop if one does not.

The inbound-link file is step 7, deliberately after the images.

---

## 6. Check the redirects, GET and HEAD

```bash
bash /root/iluxury/content-updates/verify-redirects.sh https://iluxuryegypt.com
```

55 redirects, both methods, 110 assertions. It prints the expected and actual
`Location` for each and exits non-zero on any failure.

Spot-check three of the renames by hand if you want to see it working:

```bash
for p in /blog/egypt-packing-list /blog/bespoke-egypt-travel /blog/private-egypt-tour; do
  echo "== $p"
  curl -s    -o /dev/null -w '  GET  %{http_code} %{redirect_url}\n' "https://iluxuryegypt.com$p"
  curl -s -I -o /dev/null -w '  HEAD %{http_code} %{redirect_url}\n' "https://iluxuryegypt.com$p"
done
```

And confirm the year is being substituted in what a crawler receives:

```bash
curl -s https://iluxuryegypt.com/blog/best-time-to-visit-egypt | grep -o '<title>[^<]*</title>'
curl -s https://iluxuryegypt.com/blog/best-time-to-visit-egypt | grep -c '{year}'
```

The title must contain the current year. The second command must print `0`.

---

## 7. Fill the images, three slugs per run

`--only=` is repeatable. Three at a time keeps each run short and keeps the
provider rate limits comfortable. Check the report after each run before
starting the next.

Plan first, which touches no network and writes nothing:

```bash
cd /var/www/iluxuryegypt
npx tsx scripts/fill-post-images.ts --plan
```

Then, one line at a time:

```bash
npx tsx scripts/fill-post-images.ts --only=best-time-to-visit-egypt --only=luxury-egypt-tours --only=egypt-visa-for-us-citizens
npx tsx scripts/fill-post-images.ts --only=is-egypt-safe-for-americans --only=egypt-travel-insurance --only=egypt-honeymoon
npx tsx scripts/fill-post-images.ts --only=egypt-plug-type --only=private-pyramid-tours-egypt --only=best-luxury-nile-cruise-egypt
npx tsx scripts/fill-post-images.ts --only=vaccinations-needed-for-egypt --only=planning-a-trip-to-egypt --only=egypt-travel-tips
npx tsx scripts/fill-post-images.ts --only=what-to-pack-for-egypt --only=private-tours-in-cairo-egypt --only=tailor-made-egypt-tours
npx tsx scripts/fill-post-images.ts --only=currency-in-egypt
```

Two positions are expected to find nothing and that is correct rather than a
fault: the wall socket on `egypt-plug-type` and the banknotes on
`currency-in-egypt`. Both need a provider description naming Egypt
*and* the object, which stock libraries rarely write, and a guard loose enough
to match one would match anybody's socket. Add those two by hand if you want
them, and write their alt text yourself: the alt composer builds from place
names and has nothing useful to say about a banknote.

Re-running a wave file after this point would discard the figures. It will not:
the per-article SQL keeps a body that already contains `<figure`.

---

## 8. Inbound internal links, last

```bash
psql "$DATABASE_URL" -f /root/iluxury/content-updates/inbound-internal-links.sql
```

82 contextual links from 19 destination guides and tour pages, to 30 articles.
40 of them are for the sixteen rewritten articles; the other 42 point at the
fourteen cluster articles and are harmless to run early, because the file skips
any target row that does not exist yet. It prints source, anchor text, target
and outcome for every one.

- lower-case outcomes are fine: `added` or `skipped: already links there`
- **UPPER-CASE outcomes need you**: a source slug that does not exist, or a page
  already carrying four internal links which the file refuses to push to five

`targets with fewer than 2 inbound links` must read `0`. If it does not, the
rows named above it are the ones to place somewhere else by hand.

---

## 9. Tell the search engines

Admin > Settings > Notify Search Engines, or:

```bash
curl -s https://iluxuryegypt.com/sitemap.xml | grep -c '<loc>'
```

Then check a handful of the new URLs are in it and that none of the old slugs
still are:

```bash
curl -s https://iluxuryegypt.com/sitemap.xml | grep -E 'egypt-packing-list|bespoke-egypt-travel|private-egypt-tour<' | wc -l
```

That must print `0`.

---

## Rolling back

The SQL is the only part that is not a file copy, and the wave files do not
delete anything: the five merged posts are `draft`, not gone, and their bodies
are intact. To restore the previous bodies, restore the `posts` table from the
dump taken in step 5.

For the code, `restore-dist.sh` puts the previous bundle back and restarts.
