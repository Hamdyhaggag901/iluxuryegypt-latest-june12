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
