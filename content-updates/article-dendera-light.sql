-- Article: The Dendera Light: What the Carving in the Hathor Crypt Actually Shows
--
--   psql "$DATABASE_URL" -f content-updates/article-dendera-light.sql
--
-- Inserts one row into posts. Safe to run twice: ON CONFLICT (slug) DO UPDATE,
-- and the image lookups are deterministic, so a second run changes nothing.
--
-- KEYWORDS
-- "dendera light" appears as an exact phrase in title_en (which renders as the H1 and is
-- a different column from meta_title), the slug, meta_title, meta_description,
-- the FIRST SENTENCE of the body, exactly two h2 headings and no more,
-- featured_image_alt, and one FAQ question. It is used 3 times in the body,
-- inside the three to five the brief allows. Synonyms and close variants carry
-- the rest of the topic, which is what keeps the page off stuffing.
-- Secondary phrases, each in exactly one h2 and once more in the body:
--   dendera lamp
--   egyptian light bulb
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
-- the staggered date: 2026-09-29 09:20:00.
--
-- Canonical is SITE_URL + '/blog/' + slug, matching server/seo-meta.ts.
--
-- Dollar quoting on every text value.

\set ON_ERROR_STOP on

BEGIN;

WITH feat AS (
  SELECT m.url, m.alt_en
  FROM unnest(ARRAY[$A$%Dendera%crypt%$A$, $A$%Dendera%relief%$A$, $A$%Dendera%$A$, $A$%Hathor%$A$]) WITH ORDINALITY AS p(pat, ord)
  JOIN media m ON m.alt_en ILIKE p.pat
  WHERE m.url <> $A$$A$
    AND (p.ord = 1 OR NOT (m.alt_en ILIKE ANY (ARRAY[]::text[])))
    AND (m.mime_type LIKE $A$image/%$A$ OR m.url ~* $A$[.](webp|jpe?g|png|avif)$$A$)
  ORDER BY p.ord, m.id
  LIMIT 1
),
img1 AS (
  SELECT m.url, m.alt_en
  FROM unnest(ARRAY[$A$%Dendera%ceiling%$A$, $A$%Hathor%ceiling%$A$, $A$%Dendera%$A$]) WITH ORDINALITY AS p(pat, ord)
  JOIN media m ON m.alt_en ILIKE p.pat
  WHERE m.url <> $A$$A$
    AND (p.ord = 1 OR NOT (m.alt_en ILIKE ANY (ARRAY[$A$%crypt%$A$, $A$%relief%$A$])))
    AND (m.mime_type LIKE $A$image/%$A$ OR m.url ~* $A$[.](webp|jpe?g|png|avif)$$A$)
  ORDER BY p.ord, m.id
  LIMIT 1
),
img2 AS (
  SELECT m.url, m.alt_en
  FROM unnest(ARRAY[$A$%Dendera%hypostyle%$A$, $A$%Hathor%capital%$A$, $A$%Dendera%column%$A$, $A$%Dendera%$A$]) WITH ORDINALITY AS p(pat, ord)
  JOIN media m ON m.alt_en ILIKE p.pat
  WHERE m.url <> $A$$A$
    AND (p.ord = 1 OR NOT (m.alt_en ILIKE ANY (ARRAY[$A$%crypt%$A$, $A$%ceiling%$A$, $A$%relief%$A$])))
    AND (m.mime_type LIKE $A$image/%$A$ OR m.url ~* $A$[.](webp|jpe?g|png|avif)$$A$)
  ORDER BY p.ord, m.id
  LIMIT 1
),
img3 AS (
  SELECT m.url, m.alt_en
  FROM unnest(ARRAY[$A$%Dendera%exterior%$A$, $A$%Dendera%facade%$A$, $A$%Dendera%temple%$A$, $A$%Dendera%$A$]) WITH ORDINALITY AS p(pat, ord)
  JOIN media m ON m.alt_en ILIKE p.pat
  WHERE m.url <> $A$$A$
    AND (p.ord = 1 OR NOT (m.alt_en ILIKE ANY (ARRAY[$A$%crypt%$A$, $A$%ceiling%$A$, $A$%column%$A$, $A$%capital%$A$, $A$%relief%$A$])))
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
  $A$dendera-light$A$,
  $A$The Dendera Light: What the Carving in the Hathor Crypt Actually Shows$A$,
  replace(replace(replace($A$<p>The dendera light is a set of reliefs carved into the wall of a small crypt beneath the Temple of Hathor at Dendera, and it is one of the most argued over images in Egypt.</p>
<p>What is carved is not in dispute.</p>
<p>How to read it very much is, and the two readings have almost nothing in common.</p>
<p>This article describes the carving, gives the reading Egyptologists work from, gives the alternative reading as the people who hold it actually state it, and then covers the part almost nobody writes about, which is what it is like to go and look at the thing.</p>

<h2>What the Dendera Light Actually Shows</h2>
<p>There are several panels, and the one that circulates online is only one of them.</p>
<p>Each shows a large rounded shape, wider at one end and tapering towards the other, resting on or emerging from a support.</p>
<p>Inside that shape runs a long sinuous line with a head at one end, which is unambiguously a snake in Egyptian iconography.</p>
<p>The narrow end of the shape sits against what looks like a stand or a pillar with arms.</p>
<p>Beside the panels stand human figures and, in some of them, a squatting figure with a knife and a baboon.</p>
<p>The reliefs are sunk into the stone rather than raised, and they run along the wall at roughly chest height and below, which matters more than it sounds once you are in there.</p>
<IMG1>
<p>The panels are in the southern crypt, one of a set of small chambers built into the thickness of the temple walls and under the floor.</p>
<p>Crypts at Dendera were storage for cult objects and for the temple's most valuable equipment, and they were sealed and hidden rather than public.</p>
<p>That is the first thing worth holding onto, because it shapes both readings: whatever is depicted was not meant to be seen by anybody outside the priesthood.</p>

<h2>How Egyptologists Read the Carving</h2>
<p>The conventional reading treats every element as standard Egyptian religious iconography, and the elements are individually well attested elsewhere.</p>
<p>The rounded shape is a lotus flower, drawn in the elongated form Egyptian art often uses, with the bud opening at the wide end.</p>
<p>The snake inside it is a form of the creator god emerging from the lotus, an image of the first sunrise that appears across Egyptian art from much earlier periods.</p>
<p>The pillar with arms at the narrow end is a djed pillar, a symbol associated with Osiris and with stability, and the arms holding the shape up are a standard way of showing support.</p>
<p>The squatting figure with the knife is a protective demon of a type found guarding crypts and gateways throughout Egyptian temples.</p>
<p>Read together, Egyptologists generally take the panels as a creation scene: the lotus rises from the primordial water, the god comes out of it, and the whole thing is held up by the pillar of stability.</p>
<p>The strongest argument for this reading is that it needs no new vocabulary.</p>
<p>Every element in it appears elsewhere in Egyptian art with the same meaning, and the accompanying texts on the same walls are religious rather than technical.</p>

<h2>The Dendera Lamp Argument</h2>
<p>The alternative reading starts from the shape rather than from the iconography.</p>
<p>People who make the dendera lamp argument point out that the rounded form with a filament inside it, mounted on a stand and connected by a cable to a box, is what an electric lamp looks like to a modern eye.</p>
<p>In that reading the snake is a filament or an arc, the djed pillar is an insulator, the shape itself is a glass envelope, and the object at the narrow end is a power source.</p>
<p>Supporters add that the crypts and the deeper chambers of Egyptian temples show little or no soot from torches or oil lamps, and ask how the carvers saw what they were doing.</p>
<p>They also point to the sheer size of the objects relative to the figures, which is larger than a lotus is usually drawn.</p>
<p>Egyptologists answer the soot point by noting that oil lamps with a salt additive produce very little smoke, and that mirrors were used to carry daylight into interior rooms.</p>
<p>The scale point they answer by observing that Egyptian art routinely scales objects by importance rather than by size.</p>
<p>Neither answer persuades everyone, which is why this argument is still running.</p>
<IMG2>

<h2>Why People Call It an Egyptian Light Bulb</h2>
<p>The phrase egyptian light bulb came out of popular writing rather than from Egyptology, and it spread because it is a good description of what the image resembles.</p>
<p>It is worth separating three claims that often get bundled together.</p>
<p>The first is that the carving looks like a lamp, which is simply true and which nobody disputes.</p>
<p>The second is that the Egyptians therefore had electric lighting, which requires evidence beyond the resemblance and which has not been produced.</p>
<p>The third is that Egyptology is suppressing this, which is a claim about people rather than about the carving and which the published literature does not support, since the panels are catalogued, photographed and discussed in the standard publications of the temple.</p>
<p>A reader can accept the first without the second or the third.</p>
<p>The honest position on the current evidence is that the resemblance is real and the inference is not established, and both halves of that sentence matter.</p>

<h2>Seeing the Dendera Light in Person</h2>
<p>This is the part the argument articles leave out entirely.</p>
<p>The crypt is not a separate site and it is not signposted as an attraction.</p>
<p>It is reached from inside the main temple, down a narrow stair in the floor at the southern end, and most visitors walk over it without noticing.</p>
<p>Whether it is open is not guaranteed on any given day, because access to the crypts is controlled and has been restricted at various times for conservation.</p>
<p>Asking at the ticket office rather than assuming is the practical advice, and a guide who works at Dendera regularly will know that morning's position.</p>
<p>There is also usually a separate charge for the parts of the temple beyond the main hall, and that arrangement changes from time to time.</p>

<h2>The Crypt Is Smaller Than the Photographs Suggest</h2>
<p>Photographs of the reliefs are taken square on with a wide lens, which makes the chamber read as a room.</p>
<p>It is closer to a corridor.</p>
<p>The southern crypt is narrow enough that two people passing have to turn sideways, and low enough that a tall visitor will be conscious of the ceiling.</p>
<p>There is no ventilation to speak of and in the warmer months it is markedly hotter down there than in the hall above.</p>
<p>Anybody who is uncomfortable in confined spaces should know all of that before going down the stair rather than after.</p>
<p>The visit itself is short, because there is not much floor to stand on and other people will be waiting.</p>
<IMG3>

<h2>Photographing a Relief That Sits Low and in the Dark</h2>
<p>The panels run along the wall from roughly chest height downwards, which means the well known images are shot from a crouch.</p>
<p>There is no natural light at all and the artificial lighting is dim and uneven.</p>
<p>Flash photography inside the crypts is restricted, and the rules on cameras and on tripods at Egyptian sites change often enough that the only reliable answer is the one you get at the gate that morning.</p>
<p>A phone will produce something recognisable and will not produce the images you have seen, which were made with equipment and time that a visitor does not have.</p>
<p>Going in knowing that removes most of the disappointment.</p>

<h2>Where the Crypt Sits Inside the Temple</h2>
<p>Dendera is a large and unusually complete temple complex, and the crypt is a footnote to it rather than the main event.</p>
<p>Above the crypt is one of the best preserved hypostyle halls in Egypt, with Hathor headed columns and a ceiling that was cleaned of centuries of soot in recent decades.</p>
<p>The colour that came out from under that soot is the thing most visitors remember, and it is closer to the original paint than almost anywhere else in the country.</p>
<p>There are roof chapels reached by a stair, a zodiac ceiling of which the original is in Paris and the version on site is a replica, and a sacred lake in the grounds.</p>
<p>The <a href="/blog/dendera-temple-egypt">full guide to visiting Dendera and Abydos</a> covers the practical side of the whole site and the road from Luxor.</p>
<p>The ten day <a href="/10-day-spiritual-egypt">Spiritual Egypt</a> itinerary gives Dendera a full day rather than a stop on the way to somewhere else, which is the difference between seeing the crypt and queuing for it.</p>

<h2>The Two Readings, Element by Element</h2>
<p>The same five features of the panel, read two ways.</p>
<table>
<tr><th>Feature</th><th>Conventional reading</th><th>Alternative reading</th></tr>
<tr><td>The large rounded shape</td><td>An elongated lotus flower</td><td>A glass envelope or bulb</td></tr>
<tr><td>The sinuous line inside it</td><td>A snake, the creator emerging at the first sunrise</td><td>A filament or an electrical arc</td></tr>
<tr><td>The pillar with arms</td><td>A djed pillar, stability, associated with Osiris</td><td>An insulator supporting the bulb</td></tr>
<tr><td>The object at the narrow end</td><td>The base from which the lotus grows</td><td>A power source or generator</td></tr>
<tr><td>The squatting figure with a knife</td><td>A protective demon of a standard crypt guarding type</td><td>Interpretations vary and are not consistent</td></tr>
</table>
<p>What the table shows is that the disagreement is not about any single element but about which frame is applied to all of them at once.</p>
<p>That is why the two sides rarely move each other.</p>

<h2>How Late the Carving Actually Is</h2>
<p>The date of the building is the piece of context that changes how both readings land, and it is usually left out.</p>
<p>The temple standing at Dendera today is late, built and decorated largely in the Ptolemaic and early Roman periods, which puts the crypt reliefs within the last century or so before the common era and the first century after it.</p>
<p>That is not the age of the pyramids, and it is not a lost early dynasty.</p>
<p>It is a period in which Egypt was in constant contact with the Greek and Roman world, and in which Egyptian temples were being decorated in a deliberately archaising style that reached back to much older models.</p>
<p>For the conventional reading this is unremarkable, because the creation imagery it identifies was already ancient by then and was being reproduced faithfully.</p>
<p>For the alternative reading it cuts both ways, since a late date puts the carving in a better documented period, and the documentation of that period contains no lamps.</p>
<p>Anybody arguing either case should know the date of the wall they are arguing about.</p>

<h2>What Is Worth Knowing Before You Argue About It</h2>
<p>The panels are published, and the standard temple publications include them with photographs and line drawings.</p>
<p>The accompanying inscriptions are religious formulae rather than instructions, and anybody claiming otherwise should be asked which text they mean.</p>
<p>No comparable object has been excavated anywhere in Egypt, which is the strongest argument against the electrical reading and the one supporters have the least to say about.</p>
<p>Equally, the scale and the specific combination of elements in these panels is unusual within Egyptian art, which is why the question keeps being asked rather than settled by pointing at a parallel.</p>
<p>A reader who wants to form a view should look at all the panels in the crypt rather than the single image that circulates, because the others complicate both readings.</p>$A$, $A$<IMG1>$A$,
    $A$<img src="$A$ || COALESCE((SELECT url FROM img1), $A$PENDING_UPLOAD$A$) || $A$" alt="$A$ || COALESCE((SELECT alt_en FROM img1), $A$The painted ceiling of the Temple of Hathor at Dendera after cleaning$A$) || $A$" />$A$), $A$<IMG2>$A$,
    $A$<img src="$A$ || COALESCE((SELECT url FROM img2), $A$PENDING_UPLOAD$A$) || $A$" alt="$A$ || COALESCE((SELECT alt_en FROM img2), $A$Hathor headed columns in the hypostyle hall at Dendera$A$) || $A$" />$A$), $A$<IMG3>$A$,
    $A$<img src="$A$ || COALESCE((SELECT url FROM img3), $A$PENDING_UPLOAD$A$) || $A$" alt="$A$ || COALESCE((SELECT alt_en FROM img3), $A$The outer wall of the Temple of Hathor at Dendera in morning light$A$) || $A$" />$A$),
  $A$The dendera light is a relief in a crypt under the Hathor temple at Dendera. What is carved, how Egyptologists read it, the lamp argument, and seeing it.$A$,
  $A$Egypt Travel$A$,
  $A$dendera light$A$,
  $A$The Dendera Light: What the Carving Really Shows$A$,
  $A$The dendera light is a relief in a crypt under the Hathor temple at Dendera. What is carved, how Egyptologists read it, the lamp argument, and seeing it.$A$,
  COALESCE((SELECT url FROM feat), $A$PENDING_UPLOAD$A$),
  $A$dendera light$A$ || $A$: $A$ || COALESCE((SELECT alt_en FROM feat), $A$the carved relief in the crypt beneath the Hathor temple at Dendera$A$),
  COALESCE((SELECT url FROM feat), $A$PENDING_UPLOAD$A$),
  $A$https://iluxuryegypt.com/blog/dendera-light$A$,
  $A$index, follow$A$,
  $A$Article$A$,
  $A$published$A$,
  NULL,
  $A$2026-09-29 09:20:00$A$::timestamp,
  $A$[
  {
    "id": "art1-0001-4000-8000-000000000001",
    "question": "What is the dendera light and where exactly is it?",
    "answer": "It is a group of relief panels carved into the wall of a crypt beneath the Temple of Hathor at Dendera in Upper Egypt. The crypt is reached by a narrow stair from inside the main temple rather than being a separate site. The panels show a large rounded shape with a snake inside it, resting on a pillar with arms."
  },
  {
    "id": "art1-0002-4000-8000-000000000002",
    "question": "Is the carving actually a picture of an electric lamp?",
    "answer": "That is the disputed part. The resemblance to a lamp is real and nobody denies it, but Egyptologists read every element as standard religious iconography, with the shape as a lotus and the snake as the creator god emerging at the first sunrise. Whether the resemblance implies the technology is a separate claim, and no comparable object has been excavated in Egypt."
  },
  {
    "id": "art1-0003-4000-8000-000000000003",
    "question": "How do Egyptologists explain the lack of soot in the crypts?",
    "answer": "Two ways, usually together. Oil lamps with a salt additive burn with very little smoke, and polished mirrors were used to carry daylight from open courts into interior rooms. Neither explanation satisfies everybody, which is part of why the argument continues."
  },
  {
    "id": "art1-0004-4000-8000-000000000004",
    "question": "Can visitors go down into the crypt?",
    "answer": "Sometimes. Access to the crypts at Dendera is controlled and has been restricted at various times for conservation, so it is not guaranteed on any given day. Ask at the ticket office on the morning rather than assuming, and expect a separate charge for the parts of the temple beyond the main hall."
  },
  {
    "id": "art1-0005-4000-8000-000000000005",
    "question": "Why do photographs of the panels look better than what you see?",
    "answer": "Because they were taken with equipment and time a visitor does not have. The crypt is dark, the lighting is dim and uneven, the reliefs sit from chest height downwards so the good angles need a crouch, and flash is restricted. A phone will produce something recognisable rather than something like the published images."
  },
  {
    "id": "art1-0006-4000-8000-000000000006",
    "question": "Is the crypt difficult to get into physically?",
    "answer": "It is narrow and low rather than difficult. Two people passing have to turn sideways, a tall visitor will be aware of the ceiling, and there is little ventilation, so it is noticeably hotter than the hall above in summer. Anyone uncomfortable in confined spaces should decide before going down the stair."
  },
  {
    "id": "art1-0007-4000-8000-000000000007",
    "question": "How long does the whole visit to Dendera take?",
    "answer": "Most visitors spend two to three hours at the site, of which the crypt is a few minutes. The hypostyle hall with its cleaned ceiling, the roof chapels and the outer walls take far longer than the panels do. Day trips from Luxor usually pair Dendera with Abydos, which makes for a long day on the road."
  },
  {
    "id": "art1-0008-4000-8000-000000000008",
    "question": "Are there other panels apart from the famous one?",
    "answer": "Yes, and that is the thing most articles miss. There are several panels in the crypt and the one that circulates online is a single example. Looking at all of them complicates both the conventional and the alternative reading, which is a good reason to see them in person rather than online."
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
WHERE p.slug = $A$dendera-light$A$;

DO $GUARD$
DECLARE n int; b text; alts text[];
BEGIN
  SELECT body_en INTO b FROM posts WHERE slug = $A$dendera-light$A$;
  IF b IS NULL THEN RAISE EXCEPTION $A$article dendera-light was not written$A$; END IF;

  n := (length(lower(b)) - length(replace(lower(b), $A$dendera light$A$, $A$$A$)))
       / length($A$dendera light$A$);
  IF n < 3 OR n > 5 THEN
    RAISE EXCEPTION $A$focus phrase used % times in the body, outside 3 to 5$A$, n;
  END IF;

  -- Exactly two headings carry the phrase, no more.
  SELECT count(*) INTO n FROM regexp_matches(b, $A$<h[23]>([^<]*)</h[23]>$A$, $A$g$A$) AS m
  WHERE lower(m[1]) LIKE $A$%dendera light%$A$;
  IF n <> 2 THEN
    RAISE EXCEPTION $A$the phrase is in % headings, expected exactly 2$A$, n;
  END IF;

  -- None of the three in body image alts may carry the phrase.
  SELECT count(*) INTO n FROM regexp_matches(b, $A$alt="([^"]*)"$A$, $A$g$A$) AS m
  WHERE lower(m[1]) LIKE $A$%dendera light%$A$;
  IF n <> 0 THEN
    RAISE EXCEPTION $A$% in body image alt(s) carry the focus phrase$A$, n;
  END IF;

  IF EXISTS (SELECT 1 FROM posts WHERE slug = $A$dendera-light$A$
             AND (schema_markup ILIKE $A$%"offers"%$A$ OR schema_markup ILIKE $A$%"price"%$A$)) THEN
    RAISE EXCEPTION $A$a price property reached the schema$A$;
  END IF;
END
$GUARD$;

COMMIT;

\echo
\echo dendera-light

SELECT
  slug,
  length(body_en) AS body_chars,
  (length(lower(body_en)) - length(replace(lower(body_en), $A$dendera light$A$, $A$$A$)))
    / length($A$dendera light$A$) AS phrase_uses,
  jsonb_array_length(faqs) AS faqs,
  status, scheduled_at IS NULL AS live_now, published_at
FROM posts WHERE slug = $A$dendera-light$A$;

SELECT
  $A$featured$A$ AS slot,
  CASE WHEN featured_image = $A$PENDING_UPLOAD$A$ THEN $A$FALLBACK, needs upload$A$ ELSE $A$resolved$A$ END AS status,
  featured_image AS image
FROM posts WHERE slug = $A$dendera-light$A$
UNION ALL
SELECT $A$in body $A$ || m.ord::text,
  CASE WHEN m.src[1] = $A$PENDING_UPLOAD$A$ THEN $A$FALLBACK, needs upload$A$ ELSE $A$resolved$A$ END,
  m.src[1]
FROM posts p,
  LATERAL ROWS FROM (regexp_matches(p.body_en, $A$<img src="([^"]*)"$A$, $A$g$A$))
    WITH ORDINALITY AS m(src, ord)
WHERE p.slug = $A$dendera-light$A$;
