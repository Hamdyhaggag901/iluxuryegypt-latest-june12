-- The 2027 eclipse pillar article.
--
--   psql "$DATABASE_URL" -f content-updates/eclipse-article.sql
--
-- Inserts one row into posts and appends one contextual link to four existing
-- posts. Safe to run twice: the insert is ON CONFLICT (slug) DO UPDATE, and
-- each inbound link statement carries its own NOT LIKE guard, so a second run
-- changes nothing rather than duplicating a paragraph.
--
-- KEYWORDS
-- This page owns the informational phrase and must not compete with the tour
-- page for the commercial one. "6 minute solar eclipse 2027" appears in
-- title_en (which renders as the H1, and is a different column from
-- meta_title), the slug, meta_title, meta_description, the first 100 words of
-- the body, the first h2, one further h2, featured_image_alt and one FAQ
-- question. It appears four times in body_en, inside the three to five the
-- brief allows. "egypt solar eclipse 2027 tour packages" appears nowhere on
-- this page. "longest solar eclipse 2027" has exactly one h2 and one body use.
--
-- THE TOUR LINK TARGET
-- The three links to the tour use /egypt-solar-eclipse-luxury-tour, not
-- /luxury-egypt-tour-packages/egypt-solar-eclipse-luxury-tour as the brief
-- gave it. A tour's canonical URL on this site is SITE_URL + '/' + slug
-- (server/seo-meta.ts, and the sitemap emits the same), and
-- /luxury-egypt-tour-packages/:slug routes to CategoryDetail, which looks up a
-- category rather than a tour. There is no redirect covering the prefixed
-- form, so it would not resolve to this tour. To use the prefixed path anyway,
-- sed the URL in this file and add the mapping to server/path-redirects.ts.
--
-- SCHEMA
-- schema_markup is built from the faqs column by the second statement rather
-- than written out by hand, so the FAQPage text cannot drift from the faqs
-- text. The graph carries an Article node, that FAQPage, and an Event node for
-- the eclipse itself with no offer, no price and no ticket URL.
--
-- status published with scheduled_at NULL is "live now" per
-- shared/post-visibility.ts. The eclipse is 11 months out and a new article
-- needs months to rank, so it cannot be scheduled.
--
-- Dollar quoting on every text value.

\set ON_ERROR_STOP on

BEGIN;

INSERT INTO posts (
  slug, title_en, body_en, excerpt, category, focus_keyword, meta_title, meta_description,
  featured_image_alt, canonical_url, robots, schema_type, status, scheduled_at, published_at, faqs
)
VALUES (
  $A$6-minute-solar-eclipse-2027$A$,
  $A$The 6 Minute Solar Eclipse 2027: Why Luxor Is the Place to Stand$A$,
  $A$<p>On Monday 2 August 2027 the moon will cover the sun completely over Upper Egypt for 6 minutes and 23 seconds.</p>
<p>That single number is the reason this date has been circled for years by people who follow eclipses.</p>
<p>The 6 minute solar eclipse 2027 will hold the sky dark for more than twice as long as an ordinary totality, and the ground beneath the longest part of it is Egyptian desert within reach of Luxor.</p>
<p>One correction before anything else: a great many people are searching for this event as August 2 2025, which is the wrong year, and the date to put in a calendar is 2 August 2027.</p>
<p>No future eclipse offers this much totality until 2114, which is 87 years away, so for anyone reading this the choice is 2027 or nothing.</p>

<h2>What the 6 Minute Solar Eclipse 2027 Actually Means</h2>
<p>Totality is the part of a solar eclipse when the moon's disc sits entirely over the sun and the sky goes dark.</p>
<p>Most total eclipses give two or three minutes of it.</p>
<p>The North American eclipse of 2024, which drew millions of people to a line across the continent, reached about four and a half minutes at its very best point, and that was considered a generous one.</p>
<p>At its maximum in 2027 the moon stays over the sun for 6 minutes and 23 seconds.</p>
<p>The point of greatest duration falls roughly 60 km southeast of Luxor, in open desert, and the duration tapers as you move away from it along the path.</p>
<p>Luxor sits close enough to that point to take the full six minutes rather than a trimmed version of them.</p>
<p>The other half of the picture is overhead: at maximum the sun will stand 82 degrees above the horizon over Luxor, which is close to vertical.</p>
<p>Sitting near the point of greatest duration with the sun almost directly overhead is the combination that produces a long totality, and Luxor has both of those things at once.</p>
<p>The seven day itinerary we run for the date is built backwards from that one afternoon, and it is set out in full on <a href="/egypt-solar-eclipse-luxury-tour">the eclipse tour page</a>.</p>

<h2>Longest Solar Eclipse 2027: How It Compares to 2024 and 2114</h2>
<p>Calling this the longest solar eclipse 2027 will bring is accurate, and it still undersells the scale of it.</p>
<p>The comparison that matters is not with the rest of 2027 but with the rest of the century.</p>
<p>No future eclipse offers this much totality until 2114.</p>
<p>That is 87 years, which is another way of saying that nobody reading this sentence gets a second chance at a totality of this length.</p>
<p>Set against the recent past the gap is just as wide, because the 2024 eclipse peaked at about four and a half minutes and a typical total eclipse gives two or three.</p>
<p>Six minutes and 23 seconds is therefore something like triple the ordinary allowance.</p>
<p>The practical consequence is not a matter of degree but of what you can actually do while it lasts.</p>
<p>Two minutes of totality is over before most people have finished fumbling with a camera.</p>
<p>Six minutes is long enough to look at the corona, look at the horizon, look at the faces of the people standing near you, and then look back at the corona again before it ends.</p>

<h2>Cairo Is Not in the Path of Totality</h2>
<p>This is the single most common planning error about this eclipse, so it is stated here as plainly as it can be.</p>
<p>Cairo is not in the path of totality.</p>
<p>From Cairo you will see a partial eclipse, which means the moon takes a bite out of the sun, the light turns slightly odd, and then the moon moves on.</p>
<p>The sky does not go dark, the corona never appears, and at no point in it is it safe to look at the sun without a filter.</p>
<p>A partial eclipse and a total eclipse are not two grades of the same experience.</p>
<p>They are different events, and only one of them is the reason people cross the world.</p>
<p>The pyramids are at Giza, so Cairo is the default assumption for almost any Egypt trip, and that default is exactly what will cost people this eclipse.</p>
<p>The 6 minute solar eclipse 2027 is an Upper Egypt event, not a Cairo one.</p>
<p>If you want totality you have to be south on the day, with the travel already done by the morning of 2 August.</p>

<h2>Luxor or Aswan: Six Minutes Against Four</h2>
<p>Both cities are inside the path, and that is roughly where the similarity ends.</p>
<p>Aswan gets four to five minutes of totality.</p>
<p>Luxor gets the full six.</p>
<p>Four minutes is an excellent eclipse by any historical standard, and it is still a visibly shorter event than the one Luxor will see.</p>
<p>Luxor has a second advantage that has nothing to do with astronomy, which is that it has an airport, hotels and visitor infrastructure.</p>
<p>Much of the line of totality crosses country with no road, no accommodation and no way to move people in and out inside a day, so the places that can actually host an eclipse crowd are a short list and Luxor is near the top of it.</p>
<p>If you are planning time in both cities anyway, the sensible shape is to see <a href="/egypt-travel-guide/aswan-egypt-attractions">Aswan's temples and islands</a> on one side of the date and to be in Luxor itself for the eclipse.</p>
<p>Luxor earns the extra days regardless, and <a href="/egypt-travel-guide/attractions-in-luxor">the west bank and Karnak</a> will take more of your attention than you expect them to.</p>

<h2>The Timing on the Day</h2>
<p>Maximum eclipse over Luxor falls at 13:05 local time.</p>
<p>The sun will be 82 degrees above the horizon at that moment, so you will be looking almost straight up rather than out towards a horizon.</p>
<p>That has a consequence worth planning for, which is that a reclining chair or a mat is the difference between watching comfortably and spending six minutes with your neck at an angle it will complain about.</p>
<p>The whole event, from the first moment the moon touches the sun's edge to the last moment it leaves, spans almost three hours.</p>
<p>Totality is the 6 minutes and 23 seconds sitting in the middle of that span.</p>
<p>The partial phases either side are long and slow, and for the first stretch of it, seen through a filter, almost nothing appears to be happening.</p>
<p>The final minutes before totality are where that changes, as the light goes thin and metallic, shadows sharpen, and the temperature drops enough to notice.</p>
<p>Because the exact contact times for the partial phases shift with where you stand, treat 13:05 as the anchor and let whoever is guiding you build the rest of the day around it.</p>
<p>Being in position long before first contact rather than arriving for the main event is the entire logistical problem of eclipse day, and it is why <a href="/egypt-solar-eclipse-luxury-tour">the eclipse itinerary</a> treats 2 August as a fixed point and arranges the other six days around it.</p>

<h2>Where the Minutes Fall</h2>
<p>Four places, and what each of them gets on the day.</p>
<table>
<tr><th>Location</th><th>What you see</th><th>Notes</th></tr>
<tr><td>Point of greatest duration</td><td>6 minutes 23 seconds</td><td>Roughly 60 km southeast of Luxor, in open desert</td></tr>
<tr><td>Luxor</td><td>The full six minutes</td><td>Maximum at 13:05 local time, sun 82 degrees up, with an airport and hotels</td></tr>
<tr><td>Aswan</td><td>Four to five minutes</td><td>Inside the path, but a shorter totality than Luxor</td></tr>
<tr><td>Cairo</td><td>Partial eclipse only</td><td>Not in the path of totality, so the sky never goes dark</td></tr>
</table>

<h2>Why Early August in Upper Egypt Favours You</h2>
<p>An eclipse is only as good as the sky above it, and this is where Egypt earns its place on the list.</p>
<p>Cloud cover probability for the Luxor area in early August is low, and the region carries roughly an 80 percent likelihood of clear skies on eclipse day.</p>
<p>Eight chances in ten is about as good as eclipse chasing gets anywhere, and it is a large part of why the Egyptian section of this path has drawn more attention than the rest of it.</p>
<p>The trade is heat, and it is not a small one.</p>
<p>August in Upper Egypt is hot, and a maximum at 13:05 means standing outdoors through the middle of the day rather than at either end of it.</p>
<p>Shade before and after, water in quantity, and a settled plan for where you sit out the partial phases matter more on the day than any of the astronomy does.</p>
<p>If you are weighing this date against a more comfortable month, <a href="/egypt-travel-guide/best-time-to-visit-egypt">the best time to visit Egypt</a> is a real question with a different answer in most years, and 2027 is the exception where the sky decides it for you.</p>

<h2>What the 6 Minute Solar Eclipse 2027 Will Look Like</h2>
<p>For anyone who has not stood under a total eclipse, the descriptions tend to sound overheated until the thing actually happens.</p>
<p>Here is the sequence without embellishment.</p>
<p>For the first long stretch, behind your filter, the sun is simply a disc with a curve missing from it, and very little else about the afternoon changes.</p>
<p>Then the light begins to fail in a way that does not resemble dusk, because the colour goes out of it rather than the brightness, and everything takes on a flat silvered quality.</p>
<p>Shadows turn strange, since the light source has become a thin crescent rather than a disc, so gaps between leaves project crescents onto the ground instead of dots.</p>
<p>In the last moments the remaining sliver breaks into separate points of light where it shines through valleys on the edge of the moon, and then the final point goes out.</p>
<p>That is totality, and at that moment the filters come off.</p>
<p>The corona appears as a pale structured halo around a black disc, brighter close in and reaching out in streamers that hold still rather than flicker.</p>
<p>The horizon looks like sunset in every direction at once, because you are standing inside a shadow and the sunlit world is all the way around the edge of it.</p>
<p>Stars and planets come out, the temperature drops, and the sound changes as birds and insects react to it.</p>
<p>With 6 minutes and 23 seconds there is time for all of that rather than a forced choice between one part of it and another.</p>
<p>Then a point of light returns at the opposite edge, the filters go straight back on, and the whole sequence runs again in reverse over the rest of the afternoon.</p>
<p>The question almost everyone asks beforehand is whether to photograph it.</p>
<p>For a first total eclipse the honest answer is mostly no, because a phone will not capture the corona in any way that resembles what your eye sees, and the minutes spent framing a shot are the minutes you came for.</p>
<p>Six minutes is generous enough to change that calculation slightly, so if you do want an image, set the camera up during the partial phases, decide on the settings before totality begins, and then leave it alone and look up.</p>
<p>The one photograph genuinely worth taking with a phone is of the landscape and the people rather than the sun, because the strange horizon light is something a phone handles well and the corona is not.</p>

<h2>Eye Safety Is Not Optional</h2>
<p>During every partial phase the sun must never be viewed without certified eclipse filters.</p>
<p>Ordinary sunglasses are not protection, and neither is stacking two or three pairs of them together.</p>
<p>That holds for the entire event with one exception, which is the 6 minutes and 23 seconds of totality itself.</p>
<p>Only when the disc is fully covered is direct viewing safe, and the moment the first point of sunlight returns the filters go back on.</p>
<p>The rule applies to anything you look through as well as anything you look with, so a camera, a phone, binoculars or a telescope each need proper filtration on the front of the lens.</p>
<p>Eclipse glasses held behind an unfiltered lens are worse than no plan at all, because the lens concentrates exactly what the glasses were meant to stop.</p>
<p>Buy filters from a supplier who can state the certification, and buy them well before you travel rather than from whoever is selling them near the site on the day.</p>
<p>The reason to be strict about this is that the damage is painless, so you would not know it had happened until afterwards.</p>
<p>During the partial phases there is a safe alternative that needs no equipment at all, which is to turn your back on the sun and project it.</p>
<p>A card with a pinhole in it, or the gaps in a straw hat, or a colander held over a sheet of paper, will all throw a small image of the partly covered sun onto the ground, and children in particular tend to find the projection more interesting than the filtered view.</p>
<p>Travelling with a group, this is the one thing that ought to be handled for you rather than left to individuals, and any serious operator will supply certified filters and say out loud when they come off and when they go back on.</p>

<h2>Deciding, and When</h2>
<p>The date cannot move, which makes this unlike every other trip to Egypt.</p>
<p>Everybody who wants to be inside the path wants to be there on the same afternoon, and Luxor has a finite number of hotel rooms and a finite number of seats on the flights that reach it.</p>
<p>That is the whole of the supply problem, and it does not need exaggerating to be taken seriously.</p>
<p>What it means in practice is that the decision is worth making earlier than it would be for an ordinary itinerary, because the constraint here is the calendar.</p>
<p>Nobody should be quoting you a fixed figure for what is still available this far out, because that changes from week to week and a hard number this far ahead is a guess dressed up as information.</p>
<p>Our own answers are set out on <a href="/egypt-solar-eclipse-luxury-tour">the eclipse itinerary page</a>, along with the seven day shape that puts Giza and Karnak before the date and a deliberately quiet day after it.</p>
<p>Ask any operator instead for the four specifics that actually decide an eclipse trip: where the group will be positioned on the morning, how far that is from where you sleep, what the contingency is if the road is slow, and who is supplying the filters.</p>
<p>Those four answers will tell you more about an eclipse trip than any amount of itinerary description.</p>$A$,
  $A$Totality on 2 August 2027 lasts 6 minutes and 23 seconds over Upper Egypt. Where the maximum falls, why Cairo sees nothing but a partial eclipse, and how Luxor compares with Aswan.$A$,
  $A$Egypt Travel$A$,
  $A$6 minute solar eclipse 2027$A$,
  $A$6 Minute Solar Eclipse 2027: Luxor Viewing Guide$A$,
  $A$The 6 minute solar eclipse 2027 crosses Luxor on 2 August with 6 minutes 23 seconds of totality. Why Cairo sees only a partial eclipse, and where to stand.$A$,
  $A$A total solar eclipse corona, the sight the 6 minute solar eclipse 2027 will bring to the sky above Luxor$A$,
  $A$https://iluxuryegypt.com/blog/6-minute-solar-eclipse-2027$A$,
  $A$index, follow$A$,
  $A$Article$A$,
  $A$published$A$,
  NULL,
  now(),
  $A$[
  {
    "id": "3f1c9a20-0001-4a10-9c01-ec2027000001",
    "question": "When is the 6 minute solar eclipse 2027 and where is the best place to see it?",
    "answer": "The total solar eclipse falls on Monday 2 August 2027. Totality at maximum lasts 6 minutes and 23 seconds, and the point of greatest duration is roughly 60 km southeast of Luxor. Luxor itself receives the full six minutes and has an airport, hotels and visitor infrastructure, which most of the path does not."
  },
  {
    "id": "3f1c9a20-0002-4a10-9c01-ec2027000002",
    "question": "Can I see the 2027 total solar eclipse from Cairo?",
    "answer": "No. Cairo is not in the path of totality, so from Cairo you will see a partial eclipse only. The sky does not go dark and the corona never appears. This is the single most common planning error about this eclipse."
  },
  {
    "id": "3f1c9a20-0003-4a10-9c01-ec2027000003",
    "question": "Is the eclipse on 2 August 2025 or 2 August 2027?",
    "answer": "It is 2027. A large number of searches use August 2 2025, which is the wrong year. The eclipse is on Monday 2 August 2027."
  },
  {
    "id": "3f1c9a20-0004-4a10-9c01-ec2027000004",
    "question": "How does Aswan compare with Luxor for this eclipse?",
    "answer": "Aswan is inside the path and receives four to five minutes of totality. Luxor receives the full six minutes. Both are worth time on a trip, but if you have to choose one place to stand on the day, Luxor gives the longer event."
  },
  {
    "id": "3f1c9a20-0005-4a10-9c01-ec2027000005",
    "question": "What time does the eclipse reach maximum over Luxor?",
    "answer": "Maximum eclipse over Luxor is at 13:05 local time, with the sun 82 degrees above the horizon, close to directly overhead. The whole event from first contact to last spans almost three hours, with the 6 minutes and 23 seconds of totality in the middle of it."
  },
  {
    "id": "3f1c9a20-0006-4a10-9c01-ec2027000006",
    "question": "What are the chances of clear skies in Luxor in August?",
    "answer": "Cloud cover probability for the Luxor area in early August is low. The region has roughly an 80 percent likelihood of clear skies on eclipse day, which is a large part of why this section of the path has drawn so much attention."
  },
  {
    "id": "3f1c9a20-0007-4a10-9c01-ec2027000007",
    "question": "When is the next eclipse as long as this one?",
    "answer": "No future eclipse offers this much totality until 2114, which is 87 years away. For comparison, most total eclipses give two or three minutes, and the North American eclipse of 2024 reached about four and a half minutes at its best point."
  },
  {
    "id": "3f1c9a20-0008-4a10-9c01-ec2027000008",
    "question": "Do I need eclipse glasses, and when can I take them off?",
    "answer": "Yes. During every partial phase the sun must never be viewed without certified eclipse filters, and ordinary sunglasses are not protection. Only during totality itself, when the disc is fully covered, is direct viewing safe. The filters go back on the instant the first point of sunlight returns."
  }
]$A$::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title_en           = EXCLUDED.title_en,
  body_en            = EXCLUDED.body_en,
  excerpt            = EXCLUDED.excerpt,
  category           = EXCLUDED.category,
  focus_keyword      = EXCLUDED.focus_keyword,
  meta_title         = EXCLUDED.meta_title,
  meta_description   = EXCLUDED.meta_description,
  featured_image_alt = EXCLUDED.featured_image_alt,
  canonical_url      = EXCLUDED.canonical_url,
  robots             = EXCLUDED.robots,
  schema_type        = EXCLUDED.schema_type,
  status             = EXCLUDED.status,
  scheduled_at       = NULL,
  -- Kept, not refreshed, so a second run does not move the publication date.
  published_at       = COALESCE(posts.published_at, EXCLUDED.published_at),
  faqs               = EXCLUDED.faqs,
  updated_at         = now();


-- Built from the row's own faqs and published_at, so re-running is a no-op and
-- the FAQPage text matches the faqs text exactly.
UPDATE posts p
SET schema_markup = jsonb_pretty(
  jsonb_build_object(
    $A$@context$A$, $A$https://schema.org$A$,
    $A$@graph$A$, jsonb_build_array(
      jsonb_build_object(
        $A$@type$A$, $A$Article$A$,
        $A$@id$A$, $A$https://iluxuryegypt.com/blog/6-minute-solar-eclipse-2027$A$,
        $A$headline$A$, p.title_en,
        $A$description$A$, p.meta_description,
        $A$inLanguage$A$, $A$en$A$,
        $A$datePublished$A$, to_char(p.published_at, $A$YYYY-MM-DD$A$),
        $A$mainEntityOfPage$A$, jsonb_build_object($A$@type$A$, $A$WebPage$A$, $A$@id$A$, $A$https://iluxuryegypt.com/blog/6-minute-solar-eclipse-2027$A$),
        $A$author$A$, jsonb_build_object($A$@type$A$, $A$Organization$A$, $A$name$A$, $A$iLuxury Egypt$A$),
        $A$publisher$A$, jsonb_build_object($A$@type$A$, $A$Organization$A$, $A$name$A$, $A$iLuxury Egypt$A$),
        $A$about$A$, jsonb_build_object($A$@type$A$, $A$Event$A$, $A$name$A$, $A$Total Solar Eclipse of 2 August 2027$A$)
      ),
      jsonb_build_object(
          $A$@type$A$, $A$FAQPage$A$,
          $A$mainEntity$A$, (
            SELECT jsonb_agg(jsonb_build_object(
              $A$@type$A$, $A$Question$A$,
              $A$name$A$, e->>$A$question$A$,
              $A$acceptedAnswer$A$, jsonb_build_object(
                $A$@type$A$, $A$Answer$A$,
                $A$text$A$, e->>$A$answer$A$)))
            FROM jsonb_array_elements(p.faqs) AS e)),
      jsonb_build_object(
        $A$@type$A$, $A$Event$A$,
        $A$name$A$, $A$Total Solar Eclipse of 2 August 2027$A$,
        $A$description$A$, $A$A total solar eclipse crossing Upper Egypt. Totality at maximum lasts 6 minutes and 23 seconds, with the point of greatest duration roughly 60 km southeast of Luxor.$A$,
        $A$startDate$A$, $A$2027-08-02$A$,
        $A$endDate$A$, $A$2027-08-02$A$,
        $A$eventAttendanceMode$A$, $A$https://schema.org/OfflineEventAttendanceMode$A$,
        $A$location$A$, jsonb_build_object(
          $A$@type$A$, $A$Place$A$,
          $A$name$A$, $A$Luxor, Egypt$A$,
          $A$address$A$, jsonb_build_object($A$@type$A$, $A$PostalAddress$A$, $A$addressLocality$A$, $A$Luxor$A$, $A$addressCountry$A$, $A$EG$A$))
      )
    )))
WHERE p.slug = $A$6-minute-solar-eclipse-2027$A$;


-- Inbound links. Each statement is independently re-runnable: the NOT LIKE
-- guard means a second run appends nothing.

UPDATE posts
SET body_en  = body_en || $L$<p>One date now overrides every other consideration in this question: on 2 August 2027 a total solar eclipse brings 6 minutes and 23 seconds of totality to Luxor, and <a href="/blog/6-minute-solar-eclipse-2027">the 6 minute solar eclipse 2027 guide</a> sets out why Cairo sees nothing but a partial eclipse that day.</p>$L$,
    updated_at = now()
WHERE slug = $A$best-time-to-visit-egypt$A$
  AND body_en IS NOT NULL
  AND body_en NOT LIKE $A$%/blog/6-minute-solar-eclipse-2027%$A$;

UPDATE posts
SET body_en  = body_en || $L$<p>If your dates have any flexibility in them, 2 August 2027 brings a total solar eclipse over Luxor lasting 6 minutes and 23 seconds, and <a href="/blog/6-minute-solar-eclipse-2027">the full eclipse guide</a> covers the timing and where the path of totality actually runs.</p>$L$,
    updated_at = now()
WHERE slug = $A$planning-a-trip-to-egypt$A$
  AND body_en IS NOT NULL
  AND body_en NOT LIKE $A$%/blog/6-minute-solar-eclipse-2027%$A$;

UPDATE posts
SET body_en  = body_en || $L$<p>An itinerary of this shape carries a different weight in 2027, because Luxor receives the full six minutes of totality on 2 August while Aswan receives four to five, as <a href="/blog/6-minute-solar-eclipse-2027">the eclipse guide</a> explains.</p>$L$,
    updated_at = now()
WHERE slug = $A$luxury-cairo-luxor-aswan-itinerary$A$
  AND body_en IS NOT NULL
  AND body_en NOT LIKE $A$%/blog/6-minute-solar-eclipse-2027%$A$;

UPDATE posts
SET body_en  = body_en || $L$<p>Anyone sailing this stretch in the summer of 2027 should read <a href="/blog/6-minute-solar-eclipse-2027">the eclipse guide</a> first, because the total eclipse of 2 August lasts 6 minutes and 23 seconds at Luxor and only four to five minutes at Aswan.</p>$L$,
    updated_at = now()
WHERE slug = $A$nile-cruise-luxor-to-aswan$A$
  AND body_en IS NOT NULL
  AND body_en NOT LIKE $A$%/blog/6-minute-solar-eclipse-2027%$A$;


DO $GUARD$
DECLARE
  n int;
  body_len int;
  uses int;
BEGIN
  SELECT count(*) INTO n FROM posts WHERE slug = $A$6-minute-solar-eclipse-2027$A$ AND status = $A$published$A$ AND scheduled_at IS NULL;
  IF n <> 1 THEN
    RAISE EXCEPTION $A$the article is not present and live$A$;
  END IF;

  SELECT length(body_en) INTO body_len FROM posts WHERE slug = $A$6-minute-solar-eclipse-2027$A$;
  IF body_len < 14000 OR body_len > 18000 THEN
    RAISE EXCEPTION $A$body_en is % characters, outside 14000 to 18000$A$, body_len;
  END IF;

  SELECT (length(lower(body_en)) - length(replace(lower(body_en), $A$6 minute solar eclipse 2027$A$, $A$$A$)))
         / length($A$6 minute solar eclipse 2027$A$)
    INTO uses FROM posts WHERE slug = $A$6-minute-solar-eclipse-2027$A$;
  IF uses < 3 OR uses > 5 THEN
    RAISE EXCEPTION $A$the focus phrase appears % times in body_en, outside 3 to 5$A$, uses;
  END IF;

  SELECT count(*) INTO n FROM jsonb_array_elements(
    (SELECT faqs FROM posts WHERE slug = $A$6-minute-solar-eclipse-2027$A$)) ;
  IF n <> 8 THEN
    RAISE EXCEPTION $A$expected 8 FAQ pairs, got %$A$, n;
  END IF;
END
$GUARD$;

COMMIT;

\echo
\echo eclipse-article

SELECT
  slug,
  length(body_en)                      AS body_chars,
  (length(lower(body_en)) - length(replace(lower(body_en), $A$6 minute solar eclipse 2027$A$, $A$$A$)))
    / length($A$6 minute solar eclipse 2027$A$) AS focus_uses_in_body,
  (length(lower(body_en)) - length(replace(lower(body_en), $A$longest solar eclipse 2027$A$, $A$$A$)))
    / length($A$longest solar eclipse 2027$A$) AS longest_phrase_uses,
  jsonb_array_length(faqs)             AS faq_count,
  status,
  scheduled_at IS NULL                 AS live_now
FROM posts WHERE slug = $A$6-minute-solar-eclipse-2027$A$;

SELECT
  slug,
  body_en LIKE $A$%/blog/6-minute-solar-eclipse-2027%$A$ AS links_to_article,
  (length(body_en) - length(replace(body_en, $A$/blog/6-minute-solar-eclipse-2027$A$, $A$$A$)))
    / length($A$/blog/6-minute-solar-eclipse-2027$A$) AS link_count
FROM posts
WHERE slug IN ($A$best-time-to-visit-egypt$A$, $A$planning-a-trip-to-egypt$A$, $A$luxury-cairo-luxor-aswan-itinerary$A$, $A$nile-cruise-luxor-to-aswan$A$)
ORDER BY slug;
