-- Why Us: replace the four abstract cards with the five terms.
--
-- The section on the home page was four photo cards titled "Bespoke Luxury",
-- "Authentic Heritage", "Elite Storytellers" and "Exclusive Access", each with
-- a paragraph of superlatives. Every competitor in this market writes those
-- same four claims in the same words. What replaces them is five specific
-- things the business does, rendered as a ledger of terms.
--
-- The component ships the same five as its fallback, so the page already reads
-- correctly without this file. Run it so the database stops serving the old
-- copy over the top, and so the owner can edit the new copy in the admin.
--
-- THIS FILE MAKES why_choose_cards EXACTLY THESE FIVE ROWS. Anything else in
-- the table is deleted, including a card added by hand after this was written.
-- The preview below shows what is there now, so look at it before committing.
--
-- Two things worth knowing about the shape of the data:
--
--   image_url is no longer read by this section. The column is NOT NULL and is
--   left in place rather than dropped, so anything else that reads or writes it
--   keeps working. These rows store an empty string in it.
--
--   The pull quote travels inside `content`, after a ::pull:: marker, rather
--   than in a column of its own. A column would have meant a migration against
--   a live table plus changes to the insert schema, the CMS routes and the
--   admin form, for one short string. The admin dialog shows the paragraph and
--   the pull quote as two separate inputs, so nobody types the marker by hand.
--   See shared/why-choose-content.ts.
--
--   The section title carries a :: where its second line begins, because that
--   line is set in italic. A title saved without one renders as a single line.
--
-- Ids are fixed rather than generated, so a second run updates these five rows
-- instead of deleting them and inserting five new ones with new ids.
--
-- Run with: psql "$DATABASE_URL" -f content-updates/rewrite-why-choose-section.sql
-- Then restart the app: a direct SQL edit goes through no handler, so it clears
-- neither the server rendered content cache nor the bot snapshots.

-- ---------------------------------------------------------------------------
-- Before: what is in the two tables now.
-- ---------------------------------------------------------------------------
SELECT 'section' AS source, title AS a, coalesce(subtitle, '') AS b, is_active::text AS c
FROM why_choose_section
UNION ALL
SELECT 'card ' || sort_order, title, left(content, 60), is_active::text
FROM why_choose_cards
ORDER BY 1;

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. The heading and the lede
-- ---------------------------------------------------------------------------
UPDATE why_choose_section SET
  title = 'Five things we will::put in writing',
  subtitle = 'Every line below is a term of business. If one of them stops being true, this page changes.',
  is_active = true,
  updated_at = now();

-- Only when the table is empty. The section is read with LIMIT 1, so a second
-- row would be invisible and confusing.
INSERT INTO why_choose_section (title, subtitle, is_active)
SELECT 'Five things we will::put in writing',
       'Every line below is a term of business. If one of them stops being true, this page changes.',
       true
WHERE NOT EXISTS (SELECT 1 FROM why_choose_section);

-- ---------------------------------------------------------------------------
-- 2. The five terms
-- ---------------------------------------------------------------------------
INSERT INTO why_choose_cards (id, sort_order, title, content, image_url, is_active) VALUES
  ('b1d4f6a2-3c58-4e71-9a20-5f7c1e8d4a01', 0,
   'The price is on the page',
   'You will not be asked to enquire before you are told what this costs. Our itineraries start at 4,000 USD per person, and that number is published rather than negotiated into existence after a discovery call.
::pull::
From 4,000 USD per person',
   '', true),

  ('b1d4f6a2-3c58-4e71-9a20-5f7c1e8d4a02', 1,
   'One party. Never a group',
   'No coaches, no fixed departures, no strangers on your itinerary. The car, the driver and the guide belong to your party for the length of the journey.
::pull::
Your party only, start to finish',
   '', true),

  ('b1d4f6a2-3c58-4e71-9a20-5f7c1e8d4a03', 2,
   'Temples before they open',
   'Private access arranged in advance, so you stand in front of the great facade at first light with no one else in the frame.
::pull::
Access outside public hours',
   '', true),

  ('b1d4f6a2-3c58-4e71-9a20-5f7c1e8d4a04', 3,
   'A private dahabiya, not a deck of cabins',
   'A wooden sailing boat that moves at the river''s pace and moors where the schedule does not reach.
::pull::
The whole boat, your party',
   '', true),

  ('b1d4f6a2-3c58-4e71-9a20-5f7c1e8d4a05', 4,
   'Planned by the person who guided it',
   'Your itinerary is built from the first call by a former guide who has walked these sites, not assembled from a template by a booking desk.
::pull::
One planner, first call to last day',
   '', true)
ON CONFLICT (id) DO UPDATE SET
  sort_order = EXCLUDED.sort_order,
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  is_active = EXCLUDED.is_active,
  -- image_url is deliberately NOT reset. If somebody has put a value back in
  -- it for a use this section does not know about, a re-run should not wipe it.
  updated_at = now();

-- ---------------------------------------------------------------------------
-- 3. Anything else in the table, including the old four
-- ---------------------------------------------------------------------------
DELETE FROM why_choose_cards
WHERE id NOT IN (
  'b1d4f6a2-3c58-4e71-9a20-5f7c1e8d4a01',
  'b1d4f6a2-3c58-4e71-9a20-5f7c1e8d4a02',
  'b1d4f6a2-3c58-4e71-9a20-5f7c1e8d4a03',
  'b1d4f6a2-3c58-4e71-9a20-5f7c1e8d4a04',
  'b1d4f6a2-3c58-4e71-9a20-5f7c1e8d4a05'
);

COMMIT;

-- ---------------------------------------------------------------------------
-- Verification. Every "bad" column must read 0, and the count must be 5.
-- ---------------------------------------------------------------------------
SELECT count(*) AS cards_present FROM why_choose_cards;

SELECT sort_order,
       title,
       split_part(content, '::pull::', 2) AS pull_quote,
       length(split_part(content, '::pull::', 1)) AS body_chars,
       is_active
FROM why_choose_cards ORDER BY sort_order;

SELECT 'card missing its pull quote' AS check, count(*) AS bad
FROM why_choose_cards WHERE position('::pull::' IN content) = 0;

SELECT 'old abstract titles still present' AS check, count(*) AS bad
FROM why_choose_cards
WHERE title IN ('Bespoke Luxury', 'Authentic Heritage', 'Elite Storytellers', 'Exclusive Access');

SELECT 'banned words in the new copy' AS check, count(*) AS bad
FROM why_choose_cards
WHERE content ~* '(meticulously|unparalleled|nestled|boasts|hidden gem|tapestry|testament to|delve into)';

-- chr(8211) is the en dash and chr(8212) the em dash, written as codepoints
-- so that the check itself does not put one of them in this file.
SELECT 'em or en dash present' AS check, count(*) AS bad
FROM why_choose_cards
WHERE content LIKE '%' || chr(8211) || '%' OR content LIKE '%' || chr(8212) || '%'
   OR title   LIKE '%' || chr(8211) || '%' OR title   LIKE '%' || chr(8212) || '%';

SELECT 'section heading has no second line' AS check, count(*) AS bad
FROM why_choose_section WHERE position('::' IN title) = 0;

SELECT 'more than one section row' AS check, greatest(count(*) - 1, 0) AS bad
FROM why_choose_section;
