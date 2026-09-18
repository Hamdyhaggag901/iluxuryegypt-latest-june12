// The image plan for the five SEO articles, plus the two functions that decide
// where a figure goes in a body.
//
// This lives on its own because two scripts need exactly the same answer to
// "which position on which post still has no image": fill-post-images.ts, which
// fills them from the stock providers, and fetch-wikimedia-image.ts, which fills
// what those providers have no photograph of. Two copies of this list would
// drift, and the drift would show up as a script quietly filling a position the
// other one had already filled.

import type { Guard } from "./provider-images";

// ---------------------------------------------------------------------------
// What each post needs
// ---------------------------------------------------------------------------
// `afterH2` is the 1-based index of the H2 whose section the figure is inserted
// after. The featured image has no position: it goes in posts.featured_image
// and the post page renders it as the hero.

export interface ImageSpec {
  role: "featured" | "body";
  afterH2?: number;
  place: string;
  city: string;
  queries: string[];
  guard: Guard;
  /** The one image per post that carries the focus keyword. */
  keyword?: boolean;
}

export interface PostSpec {
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

export const POSTS: PostSpec[] = [
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
                 require: [["egypt", "egyptian", "desert", "rock", "entrance", "tomb", "tombs", "painting", "paintings", "wall", "burial", "chamber", "valley", "hill", "cliff"]],
                 deny: ["hatshepsut", "karnak", "temple", "column", "pyramid"] } },
      { role: "body", afterH2: 2, place: "Valley of the Kings", city: "Luxor",
        queries: ["ancient Egyptian painted tomb Luxor", "Egyptian tomb wall paintings hieroglyphs", "painted burial chamber Egypt"],
        guard: { requirePlace: ["tomb", "tombs", "burial", "chamber", "sarcophagus"], allowPlaces: ["luxor", "thebes", "theban"],
                 require: [["painting", "paintings", "painted", "mural", "murals", "fresco", "frescoes", "artwork", "decorated", "decoration", "hieroglyph", "relief", "wall", "colour", "color"]],
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

/**
 * True when a figure already sits at the end of section `h2Index`, which is
 * exactly where insertFigureAfterH2 puts one. Lets a re-run skip the images
 * that already worked rather than replacing them.
 */
export function figureExistsAfterH2(body: string, h2Index: number): boolean {
  const positions = [...body.matchAll(/<h2>/g)].map((m) => m.index!);
  const next = positions[h2Index];
  if (next === undefined) return /<\/figure>\s*$/.test(body.trimEnd());
  return /<\/figure>\s*$/.test(body.slice(0, next).trimEnd());
}

/**
 * Removes the figure sitting at the end of section `h2Index`, if there is one.
 *
 * The counterpart to insertFigureAfterH2, for swapping an image rather than
 * adding one. It only ever removes a figure that is the last thing in its
 * section, which is exactly where insertFigureAfterH2 puts one; a figure a
 * person placed mid section by hand in the editor is left alone.
 */
export function removeFigureAfterH2(body: string, h2Index: number): string {
  const positions = [...body.matchAll(/<h2>/g)].map((m) => m.index!);
  const next = positions[h2Index];
  const head = next === undefined ? body : body.slice(0, next);
  const tail = next === undefined ? "" : body.slice(next);

  const start = head.lastIndexOf("<figure");
  if (start === -1) return body;
  const closeAt = head.indexOf("</figure>", start);
  if (closeAt === -1) return body;
  const end = closeAt + "</figure>".length;
  // Anything other than whitespace after it means this figure is not the one
  // insertFigureAfterH2 put at the end of the section.
  if (head.slice(end).trim() !== "") return body;

  return head.slice(0, start) + tail;
}

/** Inserts a figure after the Nth H2's section, or at the end if there is no next H2. */
export function insertFigureAfterH2(body: string, h2Index: number, figure: string): string {
  const positions = [...body.matchAll(/<h2>/g)].map((m) => m.index!);
  if (positions.length === 0) return body + figure;
  // Place it just before the H2 that follows the target section, so the figure
  // sits inside the section it illustrates rather than above the next heading.
  const next = positions[h2Index];
  if (next === undefined) return body + figure;
  return body.slice(0, next) + figure + body.slice(next);
}
