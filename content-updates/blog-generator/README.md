# Blog post generator

Source for the articles in `content-updates/blog-*.sql` and for
`content-updates/publishing-schedule.md`.

The content lives in `a1.mjs` onwards, one file per article. `articles.mjs` is
the single list that `gen.mjs`, `sched.mjs` and `apply-patches.mjs` all read:
add a new article there and in nothing else, alongside its publication date, its
reserved keywords and the slugs it is allowed to link to.

`gen.mjs` enforces every rule and refuses to write anything if one fails, which
is the point of having it: editing the SQL by hand loses the checks.

## Adding an article

1. Write `aN.mjs`, copying the shape of an existing one.
2. Add the import, the entry and a publication date in `articles.mjs`. The date
   decides what the article is allowed to link to: an article may link back to
   one published earlier or to one of the `EXISTING_POST_SLUGS`, never forward
   to one still scheduled. Append to the end of `ARTICLES` rather than slotting
   the entry into date order, so the existing SQL files regenerate unchanged;
   the array order and the publishing order are deliberately independent and
   every check that cares uses the date.

   Publication times are 9am Cairo, written as an ISO string with an explicit
   offset. Egypt keeps summer time from late April to the last Friday in
   October, so that is `+03:00` in summer and `+02:00` in winter. `gen.mjs`
   checks the wall clock time rather than trusting the offset, because a wrong
   one publishes the article an hour early forever and nothing else notices.

   An article may carry `wave: "<name>"`. Articles in a wave ship together in
   `content-updates/add-posts-wave-<name>.sql` instead of one file each, and
   that file also sets `published_at` and opens with a SELECT showing what is
   already in the database for those slugs.
3. Add its four image positions to `scripts/lib/post-image-specs.ts`. The
   `afterH2` index is 1 based and must be less than the article's H2 count;
   `fill-post-images.ts` checks that against the live body before it downloads
   anything.
4. Run `node gen.mjs && node sched.mjs`.

Two keyword rules are worth knowing before you write, because both have bitten:

- The primary keyword is counted as a raw substring, so a secondary that
  **contains** the primary spends one of the primary's 3 to 5 slots every time
  it appears. `medinet habu` with three secondaries all containing it leaves
  room for only one bare use.
- A secondary that is contained **inside** the primary has the primary's count
  subtracted from its own, so it needs standalone uses that are not part of the
  longer phrase.

```bash
cd content-updates/blog-generator
node gen.mjs      # validates and rewrites the five SQL files
node sched.mjs    # rewrites publishing-schedule.md
```

Each article also carries `heroAlt`, the alt text its featured image should get
once there is one. It is emitted as a comment at the top of the wave SQL rather
than written to `featured_image_alt`, which stays NULL until an image exists.

`gen.mjs` checks, per article: keyword in the SEO title, H1, meta description,
first hundred words, one H2 and the slug; primary keyword 3 to 5 times and each
secondary 1 to 2; word count in range; words per H2 under about 300; no
paragraph over four sentences; sentence length standard deviation of 6 or more,
which is what stops the prose reading as generated; no em or en dashes; none of
a banned phrase list; no keyword that belongs to another page; at most two
promotional sentences; at least three internal links including a tour, a
destination and another article; no tour link under `/luxury-egypt-tour-packages/`,
which 404s; no link to a sibling scheduled later than itself, which would 404
until that date; descriptive rather than keyword anchors; and 5 to 7 FAQs with
no empty halves.

It also collects every `data-placeholder` marker and `{{TOKEN}}` into the
placeholder list at the bottom of the schedule, so no price or opening hour is
ever invented.

## Changing an article that is already in the database

The article files are now safe to re-run. `body_en` is assigned through a CASE
that keeps whatever is in the row once it contains a `<figure>`, so re-running a
file after `scripts/fill-post-images.ts` or `scripts/fetch-wikimedia-image.ts`
has illustrated it refreshes the title, the SEO fields and the FAQs and leaves
the body alone. The verification block prints which of the two happened.

That guard was added after the first version wiped every figure from a row and
reported success. It also means a re-run is not how you change the prose of an
illustrated post: the file will be ignored for the body.

To change the prose of a row that already has images, put the change in a patch
file as `[old text, new text]` pairs and run
the applier. It edits the `a*.mjs` sources so a regeneration keeps the change,
and writes a surgical `UPDATE ... replace()` for the rows already live.

```bash
node apply-patches.mjs   # rewrites a1..a5 and writes the .sql patch
node gen.mjs             # re-validates and rewrites the five SQL files
node sched.mjs           # rewrites publishing-schedule.md
```

`prices-2026-09.mjs` is the worked example: September 2026 prices and three
factual corrections. The applier refuses to write anything at all unless every
old string is found exactly once, because a patch that quietly matches nothing
is worse than one that fails, and it emits verification queries that must all
read 0 before the transaction is committed.

## Tables in article bodies

Tables are raw HTML inside `body_en` and are styled by the `.prose-xl table`
rules in `client/src/index.css`. Write them plainly:

```html
<table>
<thead>
<tr><th>Tomb</th><th class="price">Price</th><th>Worth the extra?</th></tr>
</thead>
<tbody>
<tr><td>Tutankhamun (KV62)</td><td class="price">700 EGP, about 13 USD</td><td>...</td></tr>
</tbody>
</table>
```

`class="price"` is the only class the styles need. It right aligns the column
and lines the digits up; everything else is automatic. Put the name of the thing
in the first column, which is styled as the row's label.

The rich text editor in the admin cannot represent a table: TipTap's StarterKit
has no table node, so it drops one on parse. That is handled, not ignored. The
edit dialog keeps the body exactly as it loaded unless you type in the editor,
and it blocks a save that would reduce the number of tables, figures or cells.
Alt text and the SEO fields can still be edited and saved normally. To change
the prose itself, change it here and regenerate.
