-- Article: The Egypt Osiris Temple at Abydos: The Osireion, Seti I and the King List
--
--   psql "$DATABASE_URL" -f content-updates/article-osiris-temple.sql
--
-- Inserts one row into posts. Safe to run twice: ON CONFLICT (slug) DO UPDATE,
-- and the image lookups are deterministic, so a second run changes nothing.
--
-- KEYWORDS
-- "egypt osiris temple" appears as an exact phrase in title_en (which renders as the H1 and is
-- a different column from meta_title), the slug, meta_title, meta_description,
-- the FIRST SENTENCE of the body, exactly two h2 headings and no more,
-- featured_image_alt, and one FAQ question. It is used 3 times in the body,
-- inside the three to five the brief allows. Synonyms and close variants carry
-- the rest of the topic, which is what keeps the page off stuffing.
-- Secondary phrases, each in exactly one h2 and once more in the body:
--   osirion abydos
--   osirion temple
--
-- IMAGES ARE RESOLVED AT RUN TIME
-- No UUID is written here. Four lookups per article, each an ordered list of
-- include patterns against media.alt_en with ILIKE: first pattern that matches
-- wins, lowest id within it, so a re-run picks the same row. Excludes apply from
-- the second pattern onwards, never to the first, and they also keep the four
-- images on this page distinct from one another. Nothing matching gives
-- PENDING_UPLOAD rather than an empty src.
--
-- featured_image_alt is built as the focus phrase followed by the resolved
-- media alt_en, so it carries the phrase AND describes the photograph that was
-- actually selected. The three in body alts are the media alt_en unchanged and
-- carry no focus phrase, which is checked by the guard below.
--
-- SCHEMA
-- The FAQPage node is built from the faqs column in SQL rather than written out
-- twice, so the two cannot drift. The graph is an Article node plus that
-- FAQPage. No offers, no price property, no price string.
--
-- PUBLISHING
-- status published with scheduled_at NULL is "live now" per
-- shared/post-visibility.ts, which is the documented Publish now state and is
-- immune to clock skew in a way a "past timestamp" is not. published_at carries
-- the staggered date: 2026-10-01 14:45:00.
--
-- Canonical is SITE_URL + '/blog/' + slug, matching server/seo-meta.ts.
--
-- Dollar quoting on every text value.

\set ON_ERROR_STOP on

BEGIN;

WITH feat AS (
  SELECT m.url, m.alt_en
  FROM unnest(ARRAY[$A$%Osireion%$A$, $A$%Osirion%$A$, $A$%Abydos%$A$, $A$%Seti I%$A$]) WITH ORDINALITY AS p(pat, ord)
  JOIN media m ON m.alt_en ILIKE p.pat
  WHERE m.url <> $A$$A$
    AND (p.ord = 1 OR NOT (m.alt_en ILIKE ANY (ARRAY[]::text[])))
    AND (m.mime_type LIKE $A$image/%$A$ OR m.url ~* $A$[.](webp|jpe?g|png|avif)$$A$)
  ORDER BY p.ord, m.id
  LIMIT 1
),
img1 AS (
  SELECT m.url, m.alt_en
  FROM unnest(ARRAY[$A$%Abydos%relief%$A$, $A$%Seti I%relief%$A$, $A$%Abydos%$A$, $A$%Seti%$A$]) WITH ORDINALITY AS p(pat, ord)
  JOIN media m ON m.alt_en ILIKE p.pat
  WHERE m.url <> $A$$A$
    AND (p.ord = 1 OR NOT (m.alt_en ILIKE ANY (ARRAY[$A$%Osireion%$A$, $A$%Osirion%$A$, $A$%king list%$A$])))
    AND (m.mime_type LIKE $A$image/%$A$ OR m.url ~* $A$[.](webp|jpe?g|png|avif)$$A$)
  ORDER BY p.ord, m.id
  LIMIT 1
),
img2 AS (
  SELECT m.url, m.alt_en
  FROM unnest(ARRAY[$A$%king list%$A$, $A$%Abydos%list%$A$, $A$%Abydos%wall%$A$, $A$%Abydos%$A$]) WITH ORDINALITY AS p(pat, ord)
  JOIN media m ON m.alt_en ILIKE p.pat
  WHERE m.url <> $A$$A$
    AND (p.ord = 1 OR NOT (m.alt_en ILIKE ANY (ARRAY[$A$%Osireion%$A$, $A$%Osirion%$A$, $A$%relief%$A$])))
    AND (m.mime_type LIKE $A$image/%$A$ OR m.url ~* $A$[.](webp|jpe?g|png|avif)$$A$)
  ORDER BY p.ord, m.id
  LIMIT 1
),
img3 AS (
  SELECT m.url, m.alt_en
  FROM unnest(ARRAY[$A$%Abydos%exterior%$A$, $A$%Abydos%courtyard%$A$, $A$%Abydos%temple%$A$, $A$%Abydos%$A$]) WITH ORDINALITY AS p(pat, ord)
  JOIN media m ON m.alt_en ILIKE p.pat
  WHERE m.url <> $A$$A$
    AND (p.ord = 1 OR NOT (m.alt_en ILIKE ANY (ARRAY[$A$%Osireion%$A$, $A$%Osirion%$A$, $A$%relief%$A$, $A$%king list%$A$])))
    AND (m.mime_type LIKE $A$image/%$A$ OR m.url ~* $A$[.](webp|jpe?g|png|avif)$$A$)
  ORDER BY p.ord, m.id
  LIMIT 1
)
INSERT INTO posts (
  slug, title_en, body_en, excerpt, category, focus_keyword, meta_title, meta_description,
  featured_image, featured_image_alt, og_image, canonical_url, robots, schema_type,
  status, scheduled_at, published_at, faqs
)
SELECT
  $A$egypt-osiris-temple$A$,
  $A$The Egypt Osiris Temple at Abydos: The Osireion, Seti I and the King List$A$,
  replace(replace(replace($A$<p>The building people mean when they search for the egypt osiris temple is the Osireion, which stands behind and below the temple of Seti I at Abydos.</p>
<p>It does not look like the temple in front of it, and that is the whole reason it attracts attention.</p>
<p>Enormous granite blocks, set without mortar, standing in water that has never been drained, in a plain style with almost no decoration.</p>
<p>Nobody searching this goes to Abydos for one structure, because the site holds three things a visitor sees in a single stop, so this article covers the Osireion, the temple in front of it and the king list on its wall.</p>

<h2>What the Egypt Osiris Temple at Abydos Actually Is</h2>
<p>The Osireion sits at a lower level than everything around it, in a cutting behind the Seti I temple, and it is reached along a descending passage.</p>
<p>The central hall has a platform of rock surrounded by a channel of water, with two stairways down into it.</p>
<p>That platform is generally read as an island, and the water around it as the primordial ocean from which the world was thought to emerge.</p>
<p>The symbolism is Osirian: the god's tomb, surrounded by water, reached from below.</p>
<p>The construction is what surprises people.</p>
<p>The pillars are single blocks of red granite weighing many tonnes, undecorated, set with joints tight enough that the fit rather than any mortar holds them.</p>
<p>The style has more in common with the valley temple at Giza than with anything built in the New Kingdom around it.</p>
<IMG1>
<p>The water is not a leak and it is not neglect.</p>
<p>The chamber was cut down to the water table deliberately, and the level rises and falls with the groundwater, which now sits higher than it did because of changes to the river upstream.</p>
<p>That is why the floor of the central hall is usually flooded and why the lower courses are permanently wet.</p>

<h2>Osirion Abydos: How the Structure Is Usually Dated</h2>
<p>The conventional dating attributes the osirion abydos structure to Seti I in the nineteenth dynasty, roughly the thirteenth century before the common era, with the decoration finished under his grandson Merenptah.</p>
<p>The evidence for it is direct.</p>
<p>The passage leading into the structure carries inscriptions naming Seti I, and the decorated parts of the building carry texts of a type well attested for that period, including passages from the Book of Gates.</p>
<p>The building also sits on the axis of the Seti I temple and behind it, which reads as a deliberate pairing rather than a coincidence of position.</p>
<p>Excavation of the site in the early twentieth century found the structure buried and cleared it, and the reports from that work are the basis of most later discussion.</p>
<p>On this reading the plain granite style is a deliberate choice, archaising to suit a building meant to represent an ancient tomb, rather than evidence of an earlier date.</p>

<h2>Why the Osirion Temple Is Dated Differently by Some</h2>
<p>The alternative arguments about the osirion temple start from the masonry rather than the inscriptions.</p>
<p>Those who argue for an earlier date point to the scale of the blocks, the absence of decoration on the structural elements, and the close similarity to Old Kingdom work at Giza.</p>
<p>They argue that inscriptions on a passage show who decorated or restored a building rather than who built it, which is a point that holds generally in Egyptian archaeology.</p>
<p>They also note the depth at which the structure sits, and argue that it was built when the water table was lower and later adapted.</p>
<p>The conventional response is that style is not a reliable dating method on its own, that archaising is well documented in the period, and that the Book of Gates texts are integral to the building rather than added.</p>
<p>Where this stands honestly is that the inscriptional evidence supports the conventional date, the stylistic argument is not absurd, and the question of whether a structure was built or merely finished by the king named on it is a real one in Egyptology generally.</p>
<p>Some readers find the earlier dating persuasive and Egyptologists generally do not.</p>
<p>Stating either as settled would misrepresent where the discussion actually is.</p>

<h2>The Temple of Seti I in Front of It</h2>
<p>Most visitors are more impressed by the temple than by the structure behind it, and they are not wrong to be.</p>
<p>The raised relief in the Seti I temple is the finest carving surviving anywhere in Egypt.</p>
<p>Raised relief means the background was cut away to leave the figures standing proud, which takes far more work than sinking a line into the stone, and the modelling of faces and limbs in these chapels is on a different level from the sunk relief of later reigns.</p>
<p>Pigment survives in places, which gives a sense of what the whole building looked like.</p>
<p>The temple has seven sanctuaries rather than the usual one, dedicated to Osiris, Isis, Horus, Amun, Ra, Ptah and the deified Seti himself.</p>
<p>That arrangement is unusual and is one of the reasons the building matters to specialists as much as to visitors.</p>
<IMG2>

<h2>The Abydos King List</h2>
<p>On a wall of one corridor is a list of cartouches naming the kings of Egypt in order, from Menes down to Seti I himself.</p>
<p>It is one of a small number of such lists and it is among the most complete, which makes it a primary source for the sequence of dynasties.</p>
<p>What it leaves out is as informative as what it includes.</p>
<p>Hatshepsut is absent, as are Akhenaten, Tutankhamun and Ay, because the list records legitimate predecessors rather than a complete record, and those reigns had been written out.</p>
<p>A visitor should understand that this is a political document as much as a historical one.</p>
<p>The same corridor carries the scene of Seti and his young son, the future Ramesses II, performing rites before the list.</p>

<h2>Why Abydos Mattered in the First Place</h2>
<p>Abydos was the cult centre of Osiris for most of Egyptian history, and that is the reason anything was built there at all.</p>
<p>The earliest royal tombs in Egypt are at Umm el Qaab, a short distance into the desert behind the later temples, and they belong to the first dynasties.</p>
<p>By the Middle Kingdom one of those early tombs had come to be identified as the burial place of Osiris himself, and the site became a destination for pilgrimage on a scale that has no real parallel elsewhere in Egypt.</p>
<p>People who could not be buried at Abydos had memorial stelae set up there instead, and the ground is thick with them.</p>
<p>An annual procession carried the god from the temple out towards the desert tomb and back, watched by crowds who had travelled to be there.</p>
<p>That context is what a visitor is standing in, and it explains why a New Kingdom pharaoh would build a mortuary temple this far from his capital and put an Osirian structure behind it.</p>

<h2>What Is Actually Carved Inside the Osireion</h2>
<p>The structure is plain where it is structural and decorated where it is not, which is part of what makes it odd.</p>
<p>The great granite pillars of the central hall carry no decoration at all.</p>
<p>The transverse chamber at the far end and the sloping passage into the building do carry texts, and those texts are funerary compositions of a well documented kind.</p>
<p>Passages from the Book of Gates and the Book of the Dead appear there, along with astronomical ceiling scenes of a type found in royal tombs of the same period.</p>
<p>For the conventional dating this decoration is the strongest single piece of evidence, because those compositions have a known date range and are cut into the building rather than applied to it.</p>
<p>For the alternative reading it is the point most often set aside, and a reader weighing the two should notice which arguments engage with it and which do not.</p>

<h2>Visiting the Egypt Osiris Temple</h2>
<p>Abydos is roughly three hours by road north of Luxor, and there is no way to shorten that.</p>
<p>The drive runs through farmland along the valley rather than through desert, and it is the price of admission for a site that receives a fraction of the visitors Luxor does.</p>
<p>Most people pair it with Dendera, which is on the same road and roughly an hour and a half from Luxor, and that makes a long day of it.</p>
<p>Leaving early is the difference between a full day and a rushed one.</p>
<p>The practical side of that road trip is covered in the <a href="/blog/dendera-temple-egypt">Dendera and Abydos day trip guide</a>.</p>
<p>The fourteen day <a href="/private-spiritual-tours-egypt-14-days-sacred-journey">Egypt Spiritual Retreat</a> gives Abydos its own day rather than half of one shared with Dendera, which is the difference between seeing the Osireion and glancing at it.</p>

<h2>What the Water Means for Access</h2>
<p>You do not walk around inside the Osireion the way you walk through the temple.</p>
<p>The central hall is usually flooded and visitors view it from the edge and from the descending passage rather than crossing to the platform.</p>
<p>How much is visible depends on the water level that season, and in a high year rather less of the lower structure shows than the photographs suggest.</p>
<p>The ground around the cutting is uneven and there are no handrails in places.</p>
<p>It is worth knowing that the best view is from above and slightly to one side, which is also where the light works for most of the day.</p>
<IMG3>

<h2>The Three Things You Will See, Compared</h2>
<p>A single stop, three very different buildings.</p>
<table>
<tr><th>What</th><th>Why it matters</th><th>Time to give it</th></tr>
<tr><td>The Osireion</td><td>Unmortared granite in groundwater, plain style, disputed dating</td><td>Thirty to forty minutes, viewed from the edge</td></tr>
<tr><td>Temple of Seti I</td><td>The finest raised relief in Egypt, seven sanctuaries, surviving pigment</td><td>An hour and a half at least</td></tr>
<tr><td>The Abydos king list</td><td>A near complete royal sequence, and a record of who was written out</td><td>Twenty minutes with someone who can read it</td></tr>
</table>
<p>The ordering matters: most guides take the temple first and the Osireion last, which means people arrive at the disputed structure tired.</p>
<p>Asking to reverse it is reasonable and usually possible.</p>

<h2>The Marks on the Column</h2>
<p>On one of the granite columns of the Osireion is a pattern of overlapping circles, cut shallowly into the stone rather than carved as part of the building.</p>
<p>It has become one of the most photographed details of the site and its date is genuinely unresolved, with explanations ranging from Greek or Roman period graffiti to much later marking.</p>
<p>It is a separate question from the dating of the structure itself and it is treated separately in <a href="/blog/flower-of-life-egypt">the article on the overlapping circle pattern at Abydos</a>.</p>
<p>Conflating the two is the most common error in writing about this site, because the age of a mark on a surface says nothing about the age of the surface.</p>

<h2>Before You Go</h2>
<p>Photography rules at Abydos change and the position on tripods and on flash inside the temple is best confirmed at the gate that morning.</p>
<p>There is little shade on the walk between the temple and the Osireion cutting.</p>
<p>The site is open in normal daylight hours and it is quietest early, before the Luxor day trips arrive in the middle of the morning.</p>
<p>Anyone going for the Osireion specifically should check the water level with their guide beforehand, because it determines how much of the structure is above the surface on the day.</p>$A$, $A$<IMG1>$A$,
    $A$<img src="$A$ || COALESCE((SELECT url FROM img1), $A$PENDING_UPLOAD$A$) || $A$" alt="$A$ || COALESCE((SELECT alt_en FROM img1), $A$Raised relief carving with surviving pigment in the temple of Seti I at Abydos$A$) || $A$" />$A$), $A$<IMG2>$A$,
    $A$<img src="$A$ || COALESCE((SELECT url FROM img2), $A$PENDING_UPLOAD$A$) || $A$" alt="$A$ || COALESCE((SELECT alt_en FROM img2), $A$The wall carrying the Abydos king list in the temple of Seti I$A$) || $A$" />$A$), $A$<IMG3>$A$,
    $A$<img src="$A$ || COALESCE((SELECT url FROM img3), $A$PENDING_UPLOAD$A$) || $A$" alt="$A$ || COALESCE((SELECT alt_en FROM img3), $A$The approach to the temple of Seti I at Abydos in the afternoon$A$) || $A$" />$A$),
  $A$The egypt osiris temple at Abydos is the Osireion, unmortared granite standing in groundwater. Its dating, the Seti I temple, the king list and getting there.$A$,
  $A$Egypt Travel$A$,
  $A$egypt osiris temple$A$,
  $A$Egypt Osiris Temple: The Osireion at Abydos$A$,
  $A$The egypt osiris temple at Abydos is the Osireion, unmortared granite standing in groundwater. Its dating, the Seti I temple, the king list and getting there.$A$,
  COALESCE((SELECT url FROM feat), $A$PENDING_UPLOAD$A$),
  $A$egypt osiris temple$A$ || $A$: $A$ || COALESCE((SELECT alt_en FROM feat), $A$the sunken granite structure behind the temple of Seti I at Abydos$A$),
  COALESCE((SELECT url FROM feat), $A$PENDING_UPLOAD$A$),
  $A$https://iluxuryegypt.com/blog/egypt-osiris-temple$A$,
  $A$index, follow$A$,
  $A$Article$A$,
  $A$published$A$,
  NULL,
  $A$2026-10-01 14:45:00$A$::timestamp,
  $A$[
  {
    "id": "art2-0001-4000-8000-000000000001",
    "question": "What is the egypt osiris temple and where is it?",
    "answer": "It is the Osireion, a sunken structure of unmortared granite standing behind and below the temple of Seti I at Abydos in Upper Egypt. It is reached along a descending passage and its central hall sits in groundwater. Abydos is roughly three hours by road north of Luxor."
  },
  {
    "id": "art2-0002-4000-8000-000000000002",
    "question": "Why is the Osireion always full of water?",
    "answer": "Because it was deliberately cut down to the water table, with a rock platform surrounded by a channel that is usually read as an island in the primordial ocean. The level rises and falls with the groundwater, which now sits higher than it once did. It is not a leak or neglect."
  },
  {
    "id": "art2-0003-4000-8000-000000000003",
    "question": "Who built the Osireion and when?",
    "answer": "The conventional attribution is Seti I in the nineteenth dynasty, with decoration completed under Merenptah, based on inscriptions in the passage and on Book of Gates texts integral to the building. Some readers argue for a much earlier date on stylistic grounds. Egyptologists generally hold to the nineteenth dynasty attribution."
  },
  {
    "id": "art2-0004-4000-8000-000000000004",
    "question": "Why do some people date it much earlier?",
    "answer": "The argument rests on the masonry rather than the texts: very large undecorated granite blocks set without mortar, closely resembling Old Kingdom work at Giza. Those making it hold that an inscription can record a restorer rather than a builder. The usual reply is that archaising style is well documented in the period and that style alone does not date a building."
  },
  {
    "id": "art2-0005-4000-8000-000000000005",
    "question": "Can you walk inside the Osireion?",
    "answer": "Not through the central hall, which is normally flooded. Visitors view it from the edge of the cutting and from the descending passage, and how much of the lower structure shows depends on the water level that season. The ground around it is uneven and partly without handrails."
  },
  {
    "id": "art2-0006-4000-8000-000000000006",
    "question": "How long does Abydos take, and can it be combined with Dendera?",
    "answer": "Allow two and a half to three hours at Abydos for the temple, the king list and the Osireion together. Dendera is on the same road about an hour and a half from Luxor, and the two are commonly combined into one long day. Starting early is what makes the combination work."
  },
  {
    "id": "art2-0007-4000-8000-000000000007",
    "question": "What is missing from the Abydos king list?",
    "answer": "Hatshepsut, Akhenaten, Tutankhamun and Ay, among others. The list records legitimate predecessors rather than a complete sequence, and those reigns had been written out of the official record. That makes it a political document as well as a historical source."
  },
  {
    "id": "art2-0008-4000-8000-000000000008",
    "question": "Is the temple of Seti I worth as much time as the Osireion?",
    "answer": "More, for most visitors. Its raised relief is the finest surviving anywhere in Egypt, with pigment still in place in parts, and it has seven sanctuaries rather than the usual one. People who come for the Osireion often leave saying the temple was the surprise."
  }
]$A$::jsonb
ON CONFLICT (slug) DO UPDATE SET
  title_en           = EXCLUDED.title_en,
  body_en            = EXCLUDED.body_en,
  excerpt            = EXCLUDED.excerpt,
  category           = EXCLUDED.category,
  focus_keyword      = EXCLUDED.focus_keyword,
  meta_title         = EXCLUDED.meta_title,
  meta_description   = EXCLUDED.meta_description,
  featured_image     = EXCLUDED.featured_image,
  featured_image_alt = EXCLUDED.featured_image_alt,
  og_image           = EXCLUDED.og_image,
  canonical_url      = EXCLUDED.canonical_url,
  robots             = EXCLUDED.robots,
  schema_type        = EXCLUDED.schema_type,
  status             = EXCLUDED.status,
  scheduled_at       = NULL,
  published_at       = EXCLUDED.published_at,
  faqs               = EXCLUDED.faqs,
  updated_at         = now();

-- Built from the row's own faqs, so the FAQPage text cannot drift from it.
UPDATE posts p SET schema_markup = jsonb_pretty(
  jsonb_build_object(
    $A$@context$A$, $A$https://schema.org$A$,
    $A$@graph$A$, jsonb_build_array(
      jsonb_build_object(
        $A$@type$A$, $A$Article$A$,
        $A$@id$A$, p.canonical_url,
        $A$headline$A$, p.title_en,
        $A$description$A$, p.meta_description,
        $A$inLanguage$A$, $A$en$A$,
        $A$datePublished$A$, to_char(p.published_at, $A$YYYY-MM-DD$A$),
        $A$image$A$, p.featured_image,
        $A$mainEntityOfPage$A$, jsonb_build_object($A$@type$A$, $A$WebPage$A$, $A$@id$A$, p.canonical_url),
        $A$author$A$, jsonb_build_object($A$@type$A$, $A$Organization$A$, $A$name$A$, $A$iLuxury Egypt$A$),
        $A$publisher$A$, jsonb_build_object($A$@type$A$, $A$Organization$A$, $A$name$A$, $A$iLuxury Egypt$A$)
      ),
      jsonb_build_object(
        $A$@type$A$, $A$FAQPage$A$,
        $A$mainEntity$A$, (
          SELECT jsonb_agg(jsonb_build_object(
            $A$@type$A$, $A$Question$A$,
            $A$name$A$, e->>$A$question$A$,
            $A$acceptedAnswer$A$, jsonb_build_object($A$@type$A$, $A$Answer$A$, $A$text$A$, e->>$A$answer$A$)))
          FROM jsonb_array_elements(p.faqs) AS e))
    )))
WHERE p.slug = $A$egypt-osiris-temple$A$;

DO $GUARD$
DECLARE n int; b text; alts text[];
BEGIN
  SELECT body_en INTO b FROM posts WHERE slug = $A$egypt-osiris-temple$A$;
  IF b IS NULL THEN RAISE EXCEPTION $A$article egypt-osiris-temple was not written$A$; END IF;

  n := (length(lower(b)) - length(replace(lower(b), $A$egypt osiris temple$A$, $A$$A$)))
       / length($A$egypt osiris temple$A$);
  IF n < 3 OR n > 5 THEN
    RAISE EXCEPTION $A$focus phrase used % times in the body, outside 3 to 5$A$, n;
  END IF;

  -- Exactly two headings carry the phrase, no more.
  SELECT count(*) INTO n FROM regexp_matches(b, $A$<h[23]>([^<]*)</h[23]>$A$, $A$g$A$) AS m
  WHERE lower(m[1]) LIKE $A$%egypt osiris temple%$A$;
  IF n <> 2 THEN
    RAISE EXCEPTION $A$the phrase is in % headings, expected exactly 2$A$, n;
  END IF;

  -- None of the three in body image alts may carry the phrase.
  SELECT count(*) INTO n FROM regexp_matches(b, $A$alt="([^"]*)"$A$, $A$g$A$) AS m
  WHERE lower(m[1]) LIKE $A$%egypt osiris temple%$A$;
  IF n <> 0 THEN
    RAISE EXCEPTION $A$% in body image alt(s) carry the focus phrase$A$, n;
  END IF;

  IF EXISTS (SELECT 1 FROM posts WHERE slug = $A$egypt-osiris-temple$A$
             AND (schema_markup ILIKE $A$%"offers"%$A$ OR schema_markup ILIKE $A$%"price"%$A$)) THEN
    RAISE EXCEPTION $A$a price property reached the schema$A$;
  END IF;
END
$GUARD$;

COMMIT;

\echo
\echo egypt-osiris-temple

SELECT
  slug,
  length(body_en) AS body_chars,
  (length(lower(body_en)) - length(replace(lower(body_en), $A$egypt osiris temple$A$, $A$$A$)))
    / length($A$egypt osiris temple$A$) AS phrase_uses,
  jsonb_array_length(faqs) AS faqs,
  status, scheduled_at IS NULL AS live_now, published_at
FROM posts WHERE slug = $A$egypt-osiris-temple$A$;

SELECT
  $A$featured$A$ AS slot,
  CASE WHEN featured_image = $A$PENDING_UPLOAD$A$ THEN $A$FALLBACK, needs upload$A$ ELSE $A$resolved$A$ END AS status,
  featured_image AS image
FROM posts WHERE slug = $A$egypt-osiris-temple$A$
UNION ALL
SELECT $A$in body $A$ || m.ord::text,
  CASE WHEN m.src[1] = $A$PENDING_UPLOAD$A$ THEN $A$FALLBACK, needs upload$A$ ELSE $A$resolved$A$ END,
  m.src[1]
FROM posts p,
  LATERAL ROWS FROM (regexp_matches(p.body_en, $A$<img src="([^"]*)"$A$, $A$g$A$))
    WITH ORDINALITY AS m(src, ord)
WHERE p.slug = $A$egypt-osiris-temple$A$;
