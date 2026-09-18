# Blog post generator

Source for the five articles in `content-updates/blog-0*.sql` and for
`content-updates/publishing-schedule.md`.

The content lives in `a1.mjs` through `a5.mjs`. `gen.mjs` enforces every rule
and refuses to write anything if one fails, which is the point of having it:
editing the SQL by hand loses the checks.

```bash
cd content-updates/blog-generator
node gen.mjs      # validates and rewrites the five SQL files
node sched.mjs    # rewrites publishing-schedule.md
```

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

Do not re-run `blog-0*.sql` against a live row. Those files insert with
`ON CONFLICT (slug) DO UPDATE SET body_en = EXCLUDED.body_en`, so re-running one
overwrites the body, and the body in the database is no longer the body those
files wrote: `scripts/fill-post-images.ts` and `scripts/fetch-wikimedia-image.ts`
have since inserted `<figure>` elements into it. A re-run deletes every one of
them.

Instead, put the change in a patch file as `[old text, new text]` pairs and run
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
