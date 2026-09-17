// Fetches the featured image and the in-body figures for the five new blog
// posts, and writes the alt text for each one after the photo is chosen.
//
// Run this AFTER the five content-updates/blog-0*.sql files, because it edits
// the body_en those files insert.
//
// Same rules as scripts/refix-itinerary-images.ts, which exists because the
// first pass at this got them wrong:
//
//   Pexels, then Pixabay, then Unsplash, the order the admin "Suggest Photo"
//   button uses. Several phrasings per image. Every candidate is checked
//   against the PROVIDER'S OWN DESCRIPTION, not against the query that found
//   it, because a query is not evidence about the photograph it returned.
//
//   If nothing can be confirmed, THE IMAGE IS LEFT OUT and the post is
//   reported. A post that goes live missing a figure is fixable. A post
//   illustrated with a picture of somewhere else is worse than one with no
//   picture at all.
//
//   Alt text is composed from that description AFTER the pick, never before,
//   and every content word in it has to trace back to the description or to
//   the place name. The focus keyword appears in exactly one image per post.
//
// ---------------------------------------------------------------------------
// Running it
// ---------------------------------------------------------------------------
//   npx tsx scripts/fill-post-images.ts --plan      # no network, no writes
//   npx tsx scripts/fill-post-images.ts --dry-run   # full run, then rollback
//   npx tsx scripts/fill-post-images.ts             # for real
//
// Flags:
//   --only=<slug>   restrict to one post (repeatable)
//
// Needs DATABASE_URL and PEXELS_API_KEY. PIXABAY_API_KEY and
// UNSPLASH_ACCESS_KEY are optional; a provider with no key is skipped.

import "dotenv/config";
import fs from "fs/promises";
import { pool } from "../server/db";
import {
  KEYS, PROVIDER_ORDER, UPLOAD_URL_PREFIX, UPLOAD_DIR,
  type Guard, auditVocabulary, composeAlt, findInventedWords,
  findConfirmed, downloadAndOptimise, creditLine,
} from "./lib/provider-images";

// ---------------------------------------------------------------------------
// What each post needs
// ---------------------------------------------------------------------------
// `afterH2` is the 1-based index of the H2 whose section the figure is inserted
// after. The featured image has no position: it goes in posts.featured_image
// and the post page renders it as the hero.

interface ImageSpec {
  role: "featured" | "body";
  afterH2?: number;
  place: string;
  city: string;
  queries: string[];
  guard: Guard;
  /** The one image per post that carries the focus keyword. */
  keyword?: boolean;
}

interface PostSpec {
  slug: string;
  focusKeyword: string;
  /**
   * How the focus keyword is worked into the one image alt that carries it.
   * A single shared template does not work: "on this abu simbel tour from
   * aswan" reads naturally and "on this dahshur pyramids egypt" does not, so
   * each keyword gets the frame that fits its grammar.
   */
  keywordSuffix: string;
  images: ImageSpec[];
}

const POSTS: PostSpec[] = [
  {
    slug: "abu-simbel-tour-from-aswan",
    focusKeyword: "abu simbel tour from aswan",
    keywordSuffix: " on this abu simbel tour from aswan",
    images: [
      { role: "featured", place: "Abu Simbel", city: "Aswan", keyword: true,
        queries: ["Abu Simbel temple Egypt", "Abu Simbel Ramesses colossi", "Abu Simbel Nubia Egypt facade"],
        guard: { requirePlace: ["simbel"], allowPlaces: ["abu simbel", "aswan", "nubia"],
                 require: [["temple", "statue", "statues", "colossi", "facade", "rock"]],
                 deny: ["pyramid", "sphinx", "car", "vehicle"] } },
      { role: "body", afterH2: 5, place: "Abu Simbel", city: "Aswan",
        queries: ["Abu Simbel statues Egypt", "Abu Simbel temple interior Egypt", "Abu Simbel colossal statue"],
        guard: { requirePlace: ["simbel"], allowPlaces: ["abu simbel", "aswan", "nubia"],
                 require: [["statue", "statues", "colossi", "temple", "carved", "relief"]],
                 deny: ["pyramid", "sphinx"] } },
      // Previously accepted a photo described as a "classic Peugeot car": the
      // old guard asked for desert OR Egypt and the description mentioned a
      // desert road. Vehicles are now denied outright.
      { role: "body", afterH2: 3, place: "Western Desert", city: "Aswan",
        queries: ["Egyptian Western Desert sand dunes", "Sahara desert dunes Egypt landscape", "Egypt desert empty sand landscape"],
        guard: { requirePlace: ["desert", "sahara", "dune", "dunes"],
                 allowPlaces: ["aswan", "siwa", "bahariya", "farafra"],
                 require: [["egypt", "egyptian", "sahara"]],
                 deny: ["car", "vehicle", "automobile", "truck", "jeep", "peugeot", "motorcycle", "bus", "road", "pyramid", "city"] } },
      // Previously accepted "Lake Qarun, Faiyum", a different lake in a
      // different governorate. The description must now name Nasser itself.
      { role: "body", afterH2: 7, place: "Lake Nasser", city: "Aswan",
        queries: ["Lake Nasser Egypt", "Lake Nasser Aswan water Egypt", "Lake Nasser Nubia reservoir Egypt"],
        guard: { requirePlace: ["nasser"], allowPlaces: ["aswan", "abu simbel", "nubia"],
                 require: [["lake", "water", "reservoir", "shore"]],
                 deny: ["yacht", "marina", "cruise ship"] } },
    ],
  },
  {
    slug: "grand-egyptian-museum-tour",
    focusKeyword: "grand egyptian museum tour",
    keywordSuffix: " on this grand egyptian museum tour",
    images: [
      { role: "featured", place: "Grand Egyptian Museum", city: "Giza", keyword: true,
        queries: ["Grand Egyptian Museum Giza", "Egyptian museum gallery Cairo", "Egyptian museum statues gallery"],
        guard: { requirePlace: ["museum", "gallery", "exhibit", "exhibition"], allowPlaces: ["giza", "cairo"],
                 require: [["egypt", "egyptian", "pharaoh", "sarcophagus", "statue"]],
                 deny: ["louvre", "metropolitan", "british museum"] } },
      { role: "body", afterH2: 1, place: "Grand Egyptian Museum", city: "Giza",
        queries: ["Egyptian museum statue gallery Cairo", "ancient Egyptian sarcophagus museum", "Egyptian museum artifacts display"],
        guard: { requirePlace: ["museum", "gallery", "exhibit", "exhibition"], allowPlaces: ["giza", "cairo"],
                 require: [["statue", "sculpture", "sarcophagus", "artifact", "coffin", "mask"]],
                 deny: ["louvre", "british museum"] } },
      { role: "body", afterH2: 10, place: "Giza Pyramids", city: "Giza",
        queries: ["Giza pyramids Egypt", "pyramids of Giza sunrise Egypt", "Great Pyramid Giza Egypt"],
        guard: { requirePlace: ["giza", "pyramid", "pyramids"], allowPlaces: ["giza", "cairo", "memphis"],
                 require: [["egypt", "egyptian", "desert", "sand", "sky"]],
                 deny: ["museum", "sudan", "maya", "chichen"] } },
      // Left empty on the first run: "a boat" is not enough to confirm the
      // solar boat or to write an honest alt. Wider phrasings, same strictness.
      { role: "body", afterH2: 5, place: "Khufu solar boat", city: "Giza",
        queries: ["Khufu solar boat Egypt museum", "ancient Egyptian wooden funerary boat", "Egyptian solar barque museum", "ancient wooden ship museum Egypt"],
        guard: { requirePlace: ["boat", "barque", "bark", "ship", "vessel"], allowPlaces: ["giza", "cairo"],
                 require: [["egypt", "egyptian", "khufu", "museum", "ancient", "wooden"]],
                 deny: ["yacht", "sailing", "marina", "fishing", "felucca", "cruise"] } },
    ],
  },
  {
    slug: "tombs-in-the-valley-of-kings",
    focusKeyword: "tombs in the valley of kings",
    keywordSuffix: ", among the tombs in the valley of kings",
    images: [
      { role: "featured", place: "Valley of the Kings", city: "Luxor", keyword: true,
        queries: ["Valley of the Kings Luxor Egypt", "Valley of the Kings tomb entrance", "Valley of the Kings desert Egypt"],
        guard: { requirePlace: ["valley", "tomb", "tombs", "kings"], allowPlaces: ["luxor", "thebes", "theban"],
                 require: [["egypt", "egyptian", "desert", "rock", "entrance"]],
                 deny: ["hatshepsut", "karnak", "temple", "column", "pyramid"] } },
      { role: "body", afterH2: 2, place: "Valley of the Kings", city: "Luxor",
        queries: ["ancient Egyptian painted tomb Luxor", "Egyptian tomb wall paintings hieroglyphs", "painted burial chamber Egypt"],
        guard: { requirePlace: ["tomb", "tombs", "burial", "chamber", "sarcophagus"], allowPlaces: ["luxor", "thebes", "theban"],
                 require: [["painting", "painted", "hieroglyph", "relief", "wall", "colour", "color"]],
                 deny: ["museum", "replica", "temple", "karnak"] } },
      // Left empty on the first run. Nefertari and the Valley of the Queens are
      // thinly tagged, so this asks for the subject rather than the site name.
      { role: "body", afterH2: 6, place: "Valley of the Queens", city: "Luxor",
        queries: ["Valley of the Queens Egypt tomb", "Nefertari tomb painting Egypt", "ancient Egyptian queen tomb wall painting", "Egyptian painted tomb chamber colour"],
        guard: { requirePlace: ["queen", "queens", "nefertari", "tomb", "burial"], allowPlaces: ["luxor", "thebes", "theban"],
                 require: [["painting", "painted", "hieroglyph", "relief", "wall", "chamber"]],
                 deny: ["hatshepsut", "karnak", "temple", "pyramid", "museum"] } },
      // Previously accepted a photo of Luxor Temple, which is the east bank and
      // the opposite of what this section is about. Temples and columns are now
      // denied, so only a landscape can pass.
      { role: "body", afterH2: 9, place: "Theban hills", city: "Luxor",
        queries: ["Theban hills Luxor desert landscape", "Luxor west bank desert hills Egypt", "arid rocky hills desert valley Egypt"],
        guard: { requirePlace: ["hill", "hills", "cliff", "cliffs", "valley", "mountain", "desert"],
                 allowPlaces: ["luxor", "thebes", "theban"],
                 require: [["egypt", "egyptian", "desert", "rock", "sand"]],
                 deny: ["temple", "karnak", "column", "columns", "hypostyle", "pylon", "statue", "obelisk", "pyramid"] } },
    ],
  },
  {
    slug: "what-to-see-in-luxor",
    focusKeyword: "what to see in luxor",
    keywordSuffix: ", part of what to see in Luxor",
    images: [
      { role: "featured", place: "Karnak Temple", city: "Luxor", keyword: true,
        queries: ["Karnak temple Luxor Egypt columns", "Karnak hypostyle hall Egypt", "Karnak temple Egypt"],
        guard: { requirePlace: ["karnak", "hypostyle", "temple"], allowPlaces: ["luxor", "karnak", "thebes"],
                 require: [["column", "columns", "hall", "hieroglyph", "stone", "pillar"]],
                 deny: ["greece", "athens", "pyramid", "museum"] } },
      { role: "body", afterH2: 2, place: "Hatshepsut Temple", city: "Luxor",
        queries: ["Hatshepsut temple Luxor Egypt", "Deir el Bahari temple terraces Egypt", "Hatshepsut mortuary temple cliff Egypt"],
        guard: { requirePlace: ["hatshepsut", "deir", "terrace", "terraces"], allowPlaces: ["luxor", "thebes", "theban"],
                 require: [["temple", "cliff", "terrace", "column", "stone"]],
                 deny: ["karnak", "pyramid", "museum"] } },
      { role: "body", afterH2: 4, place: "Luxor Temple", city: "Luxor",
        queries: ["Luxor temple at night illuminated Egypt", "Luxor temple Egypt evening lit columns"],
        guard: { requirePlace: ["luxor", "temple"], allowPlaces: ["luxor", "karnak", "thebes"],
                 require: [["column", "columns", "statue", "stone", "illuminated", "lit", "night"]],
                 deny: ["pyramid", "museum", "greece"] } },
      { role: "body", afterH2: 9, place: "Nile River", city: "Luxor",
        queries: ["felucca sailing Nile Luxor Egypt", "Nile river Luxor boat sunset Egypt", "felucca Nile Egypt sail"],
        guard: { requirePlace: ["nile", "felucca"], allowPlaces: ["luxor", "aswan", "cairo", "thebes"],
                 require: [["boat", "sail", "river", "water", "felucca"]],
                 deny: ["cruise ship", "yacht", "marina", "motorboat"] } },
    ],
  },
  {
    slug: "dahshur-pyramids-egypt",
    focusKeyword: "dahshur pyramids egypt",
    keywordSuffix: ", one of the dahshur pyramids Egypt holds",
    images: [
      { role: "featured", place: "Bent Pyramid", city: "Dahshur", keyword: true,
        queries: ["Bent Pyramid Dahshur Egypt", "Dahshur pyramid Egypt desert", "Bent Pyramid Sneferu Egypt"],
        guard: { requirePlace: ["dahshur", "bent", "sneferu", "snefru"], allowPlaces: ["dahshur", "cairo", "memphis"],
                 require: [["pyramid", "pyramids"]],
                 deny: ["sphinx", "maya", "chichen", "sudan", "museum"] } },
      { role: "body", afterH2: 3, place: "Red Pyramid", city: "Dahshur",
        queries: ["Red Pyramid Dahshur Egypt", "Dahshur red pyramid desert Egypt", "Red Pyramid Sneferu Egypt"],
        guard: { requirePlace: ["dahshur", "red pyramid", "sneferu", "snefru"], allowPlaces: ["dahshur", "cairo", "memphis"],
                 require: [["pyramid", "pyramids"]],
                 deny: ["sphinx", "maya", "chichen", "sudan", "museum"] } },
      // Left empty on the first run. Wider phrasings, and Sakkara spelled both
      // ways because providers are inconsistent about it.
      { role: "body", afterH2: 5, place: "Saqqara", city: "Cairo",
        queries: ["Saqqara step pyramid Egypt", "Sakkara pyramid Egypt", "Saqqara necropolis pyramid Egypt", "stepped pyramid Egypt desert"],
        guard: { requirePlace: ["saqqara", "sakkara", "djoser", "zoser", "step", "stepped"],
                 allowPlaces: ["saqqara", "sakkara", "cairo", "memphis"],
                 require: [["pyramid", "pyramids", "necropolis", "tomb"]],
                 deny: ["giza", "sphinx", "maya", "chichen"] } },
      // Previously accepted a relief described as "from Luxor, Egypt", a
      // different governorate. The contradiction check now rejects that.
      { role: "body", afterH2: 4, place: "Saqqara", city: "Cairo",
        queries: ["Saqqara mastaba tomb relief Egypt", "Saqqara tomb carving Egypt", "ancient Egyptian mastaba relief Saqqara"],
        guard: { requirePlace: ["saqqara", "sakkara", "mastaba", "serapeum"],
                 allowPlaces: ["saqqara", "sakkara", "cairo", "memphis"],
                 require: [["relief", "carving", "carved", "hieroglyph", "tomb", "wall"]],
                 deny: ["museum replica", "greece", "rome", "giza"] } },
    ],
  },
];

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
const argv = process.argv.slice(2);
const PLAN_ONLY = argv.includes("--plan");
const DRY_RUN = argv.includes("--dry-run");
const ONLY = argv.filter((a) => a.startsWith("--only=")).map((a) => a.slice("--only=".length));

interface TxClient {
  query(text: string, values?: unknown[]): Promise<{ rows: any[] }>;
  release(): void;
}
const connectable = pool as unknown as { connect(): Promise<TxClient> };

interface ResultRow {
  slug: string;
  role: string;
  position: string;
  place: string;
  outcome: "set" | "skipped";
  url: string;
  provider: string;
  query: string;
  description: string;
  alt: string;
  tier: string;
  detail: string;
  rejections?: string[];
}

const results: ResultRow[] = [];
const writtenFiles: string[] = [];
const notes: string[] = [];

/** Inserts a figure after the Nth H2's section, or at the end if there is no next H2. */
function insertFigureAfterH2(body: string, h2Index: number, figure: string): string {
  const positions = [...body.matchAll(/<h2>/g)].map((m) => m.index!);
  if (positions.length === 0) return body + figure;
  // Place it just before the H2 that follows the target section, so the figure
  // sits inside the section it illustrates rather than above the next heading.
  const next = positions[h2Index];
  if (next === undefined) return body + figure;
  return body.slice(0, next) + figure + body.slice(next);
}

async function run(): Promise<void> {
  const vocabProblems = auditVocabulary();
  if (vocabProblems.length > 0) {
    console.error("VOCABULARY GUARD FAILED:\n  " + vocabProblems.join("\n  "));
    process.exit(1);
  }

  const specs = ONLY.length > 0 ? POSTS.filter((p) => ONLY.includes(p.slug)) : POSTS;
  if (specs.length === 0) {
    console.error(`No post matched --only=. Known slugs:\n  ${POSTS.map((p) => p.slug).join("\n  ")}`);
    process.exit(1);
  }

  const configured = PROVIDER_ORDER.filter((p) => KEYS[p]);
  console.log(`Providers configured: ${configured.join(", ") || "none"}`);
  if (!PLAN_ONLY && configured.length === 0) {
    console.error("No image provider is configured. Set at least PEXELS_API_KEY.");
    process.exit(1);
  }

  // A stale afterH2 index is exactly the bug this run just found: the articles
  // were expanded after the specs were written and the figures landed in the
  // wrong sections. Checked against the live body before anything downloads.
  for (const post of specs) {
    const { rows } = await (await connectable.connect().then(async (c) => {
      const r = await c.query(`SELECT body_en FROM posts WHERE slug = $1`, [post.slug]);
      c.release();
      return r;
    }));
    if (!rows[0]) continue;
    const h2Count = (String(rows[0].body_en ?? "").match(/<h2>/g) || []).length;
    for (const img of post.images) {
      if (img.role === "body" && (img.afterH2! < 1 || img.afterH2! >= h2Count)) {
        console.error(
          `${post.slug}: afterH2 ${img.afterH2} is out of range, the post has ${h2Count} H2 headings. ` +
            `Update the spec rather than letting the figure land at the end of the article.`
        );
        process.exit(1);
      }
    }
  }

  // Sanity check the keyword rule before any network call.
  for (const post of POSTS) {
    const n = post.images.filter((i) => i.keyword).length;
    if (n !== 1) {
      console.error(`${post.slug}: ${n} image(s) marked to carry the focus keyword, must be exactly 1`);
      process.exit(1);
    }
  }

  const client = await connectable.connect();
  let committed = false;

  try {
    await client.query("BEGIN");

    const { rows: userRows } = await client.query(
      `SELECT id FROM users WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1`
    );
    const uploader: string | null = userRows[0]?.id ?? null;

    // Seeded with every provider photo already used anywhere, so a post never
    // reuses a picture an itinerary day is already showing.
    const usedIds = new Set<string>();
    const { rows: credits } = await client.query(
      `SELECT caption FROM media WHERE caption ILIKE '%pexels%' OR caption ILIKE '%pixabay%' OR caption ILIKE '%unsplash%'`
    );
    for (const row of credits) {
      const c = String(row.caption ?? "");
      let m = c.match(/pexels\.com\/photo\/(?:[^/\s]*-)?(\d+)/i);
      if (m) { usedIds.add(`pexels:${m[1]}`); continue; }
      m = c.match(/pixabay\.com\/[^\s)]*-(\d+)/i);
      if (m) { usedIds.add(`pixabay:${m[1]}`); continue; }
      m = c.match(/unsplash\.com\/photos\/(?:[^/\s]*-)?([A-Za-z0-9_-]{8,})/i);
      if (m) usedIds.add(`unsplash:${m[1]}`);
    }

    for (const post of specs) {
      const { rows } = await client.query(
        `SELECT id, body_en, featured_image FROM posts WHERE slug = $1`,
        [post.slug]
      );
      if (!rows[0]) {
        notes.push(`${post.slug}: post not found. Run its SQL file first.`);
        continue;
      }
      let body: string = rows[0].body_en ?? "";
      let featured: string | null = rows[0].featured_image ?? null;
      // Two images on one page with identical alt text is a real defect, and
      // it happens when two different photos of the same site come back with
      // similar descriptions. Tracked per post so it can be reported.
      const altsUsed = new Set<string>();

      // Body figures are inserted from the LAST position backwards, so an
      // earlier insertion never shifts the index of a later one.
      const ordered = [...post.images].sort((a, b) => (b.afterH2 ?? 0) - (a.afterH2 ?? 0));

      for (const spec of ordered) {
        const position = spec.role === "featured" ? "hero" : `after H2 #${spec.afterH2}`;
        const base: ResultRow = {
          slug: post.slug, role: spec.role, position, place: spec.place,
          outcome: "skipped", url: "", provider: "", query: "", description: "",
          alt: "", tier: "-", detail: "",
        };

        if (PLAN_ONLY) {
          results.push({ ...base, detail: `would try: ${spec.queries.join(" | ")}` });
          continue;
        }

        const found = await findConfirmed(spec.queries, spec.guard, usedIds);
        if (!("candidate" in found)) {
          // The rule this script exists for: no confirmed photo means no photo.
          results.push({
            ...base,
            detail: `nothing confirmed out of ${found.tried} candidate(s), image left out`,
            rejections: found.rejections,
          });
          console.warn(`  ! ${post.slug} ${position} (${spec.place}): nothing confirmed, leaving it out.`);
          continue;
        }

        const description = found.candidate.description;
        const suffix = spec.keyword ? post.keywordSuffix : undefined;
        const composed = composeAlt(description, spec.place, spec.city, { suffix });
        if (!composed) {
          results.push({
            ...base, description,
            detail: "description too thin to write an honest 8 word alt, image left out",
          });
          console.warn(`  ! ${post.slug} ${position}: description too thin for an alt, leaving it out.`);
          continue;
        }

        const invented = findInventedWords(composed.alt, description, spec.place, spec.city, suffix);
        if (invented.length > 0) {
          throw new Error(
            `${post.slug} ${position}: alt "${composed.alt}" contains word(s) the description ` +
              `"${description}" does not attest: ${invented.join(", ")}`
          );
        }

        if (altsUsed.has(composed.alt.toLowerCase())) {
          notes.push(
            `${post.slug} ${position}: alt would duplicate another image on this post ` +
              `("${composed.alt}"). The image is still set; reword one of them by hand.`
          );
        }
        altsUsed.add(composed.alt.toLowerCase());

        const saved = await downloadAndOptimise(found.candidate, writtenFiles);
        const credit = creditLine(found.candidate);

        await client.query(
          `INSERT INTO media (filename, original_name, mime_type, size, url, alt_en, caption, uploaded_by)
           VALUES ($1, $2, 'image/webp', $3, $4, $5, $6, $7)`,
          [
            saved.filename,
            `${found.candidate.provider}-${spec.place.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
            saved.size, saved.url, composed.alt, credit, uploader,
          ]
        );

        if (spec.role === "featured") {
          featured = saved.url;
        } else {
          const escaped = composed.alt.replace(/"/g, "&quot;");
          const figure =
            `<figure><img src="${saved.url}" alt="${escaped}" loading="lazy" width="1600" height="1067">` +
            `<figcaption>${escaped}</figcaption></figure>\n`;
          body = insertFigureAfterH2(body, spec.afterH2!, figure);
        }

        results.push({
          ...base, outcome: "set", url: saved.url, provider: found.candidate.provider,
          query: found.query, description, alt: composed.alt, tier: composed.tier,
          detail: found.query === spec.queries[0] ? "" : "fallback query",
        });
      }

      if (!PLAN_ONLY) {
        await client.query(
          `UPDATE posts SET featured_image = $1, body_en = $2, updated_at = now() WHERE id = $3`,
          [featured, body, rows[0].id]
        );
      }
    }

    printReport();
    verifyKeywordRule();

    if (PLAN_ONLY) {
      await client.query("ROLLBACK");
      console.log("\n--plan: nothing was written and nothing was downloaded.");
    } else if (DRY_RUN) {
      await client.query("ROLLBACK");
      for (const f of writtenFiles) await fs.unlink(f).catch(() => {});
      console.log(`\n--dry-run: rolled back, and removed ${writtenFiles.length} file(s) written to ${UPLOAD_DIR}.`);
    } else {
      await client.query("COMMIT");
      committed = true;
      const set = results.filter((r) => r.outcome === "set").length;
      const skipped = results.filter((r) => r.outcome === "skipped").length;
      console.log(`\nCOMMITTED. ${set} image(s) set, ${skipped} left out.`);
      if (skipped > 0) console.log("The skipped ones are listed above with the reason for each.");
      console.log("Next: press “Notify Search Engines” in Admin → Settings once the posts are live.");
    }
  } catch (error) {
    if (!committed) {
      await client.query("ROLLBACK").catch(() => {});
      for (const f of writtenFiles) await fs.unlink(f).catch(() => {});
    }
    throw error;
  } finally {
    client.release();
    await (pool as unknown as { end(): Promise<void> }).end();
  }
}

/** Exactly one image per post may carry the focus keyword. */
function verifyKeywordRule(): void {
  console.log("\nFocus keyword in image alt text:");
  for (const post of POSTS) {
    const mine = results.filter((r) => r.slug === post.slug && r.outcome === "set");
    if (mine.length === 0) continue;
    const n = mine.filter((r) => r.alt.toLowerCase().includes(post.focusKeyword.toLowerCase())).length;
    console.log(`  ${post.slug.padEnd(30)} ${n} of ${mine.length} image(s)`);
    if (n > 1) throw new Error(`${post.slug}: focus keyword appears in ${n} image alts, the rule is one`);
  }
}

function printReport(): void {
  const w = (n: number) => (s: string) => (s.length > n ? s.slice(0, n - 1) + "…" : s).padEnd(n);
  const cols: Array<[number, string]> = [[28, "POST"], [9, "ROLE"], [14, "POSITION"], [22, "PLACE"], [8, "OUTCOME"], [9, "PROVIDER"], [7, "TIER"]];
  console.log("\n" + cols.map(([n, h]) => w(n)(h)).join("  "));
  console.log(cols.map(([n]) => "-".repeat(n)).join("  "));
  for (const r of results) {
    console.log([w(28)(r.slug), w(9)(r.role), w(14)(r.position), w(22)(r.place), w(8)(r.outcome), w(9)(r.provider), w(7)(r.tier)].join("  "));
  }

  console.log("\nPer image:");
  for (const r of results) {
    console.log(`\n  ${r.slug} ${r.position} — ${r.place}`);
    if (r.description) console.log(`    the photo's own description: "${r.description}"`);
    if (r.outcome === "set") {
      console.log(`    file: ${r.url}`);
      console.log(`    alt:  ${r.alt}`);
      console.log(`    via:  ${r.provider} / "${r.query}"${r.detail ? ` (${r.detail})` : ""}`);
    } else {
      console.log(`    NOT SET: ${r.detail}`);
      for (const reason of r.rejections ?? []) console.log(`      - ${reason}`);
    }
  }

  const skipped = results.filter((r) => r.outcome === "skipped" && !PLAN_ONLY);
  if (skipped.length > 0) {
    console.log(`\n${skipped.length} image(s) could not be filled. Add these by hand from the Media Library:`);
    for (const r of skipped) console.log(`  ${r.slug} ${r.position} (${r.place})`);
  }

  if (notes.length > 0) {
    console.log("\nNotes:");
    for (const n of notes) console.log(`  ${n}`);
  }
}

run().catch((error) => {
  console.error("\nFAILED, nothing was committed:\n", error instanceof Error ? error.message : error);
  process.exit(1);
});
