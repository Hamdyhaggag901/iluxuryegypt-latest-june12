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
import { figureEndingAt } from "./pinned-images";

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
        queries: ["Western Desert Egypt", "Egyptian Western Desert sand dunes", "Sahara desert dunes Egypt landscape", "Egypt desert empty sand landscape"],
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
        queries: ["Grand Egyptian Museum gallery", "Egyptian museum statue gallery Cairo", "ancient Egyptian sarcophagus museum", "Egyptian museum artifacts display"],
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
        queries: ["Valley of the Kings tomb painting", "ancient Egyptian painted tomb Luxor", "Egyptian tomb wall paintings hieroglyphs", "painted burial chamber Egypt"],
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
        // requirePlace used to be a list of landforms, which confirmed nothing:
        // any hillside anywhere satisfied "the Theban hills". The landforms
        // belong in `require`, where they describe the subject; requirePlace is
        // for names that mean this place and nowhere else.
        guard: { requirePlace: ["theban", "thebes", "luxor", "valley of the kings"],
                 allowPlaces: ["luxor", "thebes", "theban"],
                 require: [["hill", "hills", "cliff", "cliffs", "valley", "mountain", "mountains", "desert", "rock", "sand"]],
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
  // -------------------------------------------------------------------------
  // The second batch, publishing 5 October to 26 October 2026.
  // -------------------------------------------------------------------------
  // Two guards here are stricter than they look. Anything in Aswan has to deny
  // Luxor and Abu Simbel outright, because a search for "Nubian village Egypt"
  // returns Abu Simbel more often than it returns a village. Anything in Cairo
  // has to deny the pyramids for the same reason.
  {
    slug: "nubian-village-aswan-egypt",
    focusKeyword: "nubian village aswan egypt",
    keywordSuffix: " in a nubian village aswan egypt visitors reach by boat",
    images: [
      { role: "featured", place: "Nubian village", city: "Aswan", keyword: true,
        queries: ["Nubian village Aswan Egypt painted houses", "Nubian house Aswan Egypt colourful", "Gharb Soheil Nubian village Aswan"],
        guard: { requirePlace: ["nubian", "nubia"], allowPlaces: ["aswan", "nubia"],
                 require: [["village", "house", "houses", "wall", "walls", "street", "painted", "colourful", "colorful"]],
                 deny: ["temple", "pyramid", "tomb", "museum", "abu simbel", "luxor"] } },
      { role: "body", afterH2: 2, place: "Nile at Aswan", city: "Aswan",
        queries: ["felucca sailing Aswan Egypt Nile", "felucca boat Nile Aswan", "sailing boat Nile Aswan Egypt"],
        guard: { requirePlace: ["aswan"], allowPlaces: ["aswan", "nubia"],
                 require: [["felucca", "sail", "sailing", "boat", "nile", "river"]],
                 deny: ["cruise ship", "temple", "pyramid", "luxor", "cairo"] } },
      { role: "body", afterH2: 3, place: "Nubian house", city: "Aswan",
        queries: ["Nubian village Aswan", "Nubian painted house wall Egypt", "Nubian village blue house Aswan", "Nubian architecture painted facade Egypt"],
        guard: { requirePlace: ["nubian", "nubia"], allowPlaces: ["aswan", "nubia"],
                 require: [["house", "houses", "wall", "walls", "door", "painted", "blue", "colourful", "colorful"]],
                 deny: ["temple", "pyramid", "tomb", "abu simbel", "luxor", "cairo"] } },
      { role: "body", afterH2: 8, place: "Nile at Aswan", city: "Aswan",
        queries: ["Aswan Nile sunset Egypt", "Nile river Aswan golden light", "Aswan river islands Egypt"],
        guard: { requirePlace: ["aswan"], allowPlaces: ["aswan", "nubia"],
                 require: [["nile", "river", "water", "sunset", "island", "islands"]],
                 deny: ["temple", "pyramid", "cruise ship", "luxor", "cairo"] } },
    ],
  },
  {
    slug: "dendera-temple-egypt",
    focusKeyword: "dendera temple egypt",
    keywordSuffix: " at dendera temple egypt",
    images: [
      { role: "featured", place: "Dendera", city: "Qena", keyword: true,
        queries: ["Dendera temple Hathor Egypt", "Dendera temple ceiling Egypt", "temple of Hathor Dendera columns"],
        guard: { requirePlace: ["dendera", "denderah", "hathor"], allowPlaces: ["qena", "dendera"],
                 require: [["temple", "column", "columns", "ceiling", "hall", "relief", "carved"]],
                 deny: ["pyramid", "sphinx", "luxor", "karnak", "abydos"] } },
      { role: "body", afterH2: 2, place: "Dendera", city: "Qena",
        queries: ["Dendera temple painted ceiling astronomical", "Dendera zodiac ceiling Egypt", "Dendera hypostyle hall ceiling colour"],
        guard: { requirePlace: ["dendera", "denderah", "hathor"], allowPlaces: ["qena", "dendera"],
                 require: [["ceiling", "painted", "paint", "colour", "color", "astronomical", "zodiac", "relief"]],
                 deny: ["pyramid", "luxor", "karnak", "abydos"] } },
      { role: "body", afterH2: 4, place: "Abydos", city: "Sohag",
        queries: ["Abydos temple Seti relief Egypt", "temple of Seti I Abydos carving", "Abydos temple hieroglyphs Egypt"],
        guard: { requirePlace: ["abydos", "seti"], allowPlaces: ["abydos", "sohag"],
                 require: [["temple", "relief", "carving", "carved", "hieroglyph", "hieroglyphs", "wall", "column", "columns"]],
                 deny: ["pyramid", "luxor", "karnak", "dendera"] } },
      { role: "body", afterH2: 9, place: "Nile near Qena", city: "Qena",
        queries: ["Nile river Qena Egypt countryside", "Egyptian countryside Nile valley fields", "Nile valley farmland Egypt palm"],
        guard: { requirePlace: ["nile", "qena"], allowPlaces: ["qena", "dendera"],
                 require: [["field", "fields", "farmland", "countryside", "palm", "green", "river", "valley"]],
                 deny: ["temple", "pyramid", "cruise ship", "city", "cairo"] } },
    ],
  },
  {
    slug: "kom-ombo-temple",
    focusKeyword: "kom ombo temple",
    keywordSuffix: " at kom ombo temple",
    images: [
      { role: "featured", place: "Kom Ombo", city: "Aswan", keyword: true,
        queries: ["Kom Ombo temple Egypt columns", "Kom Ombo double temple Nile", "temple of Kom Ombo Egypt"],
        guard: { requirePlace: ["kom ombo", "ombo"], allowPlaces: ["aswan", "kom ombo"],
                 require: [["temple", "column", "columns", "relief", "carved", "ruins", "hall"]],
                 deny: ["pyramid", "sphinx", "luxor", "karnak", "edfu"] } },
      { role: "body", afterH2: 3, place: "Kom Ombo", city: "Aswan",
        queries: ["Kom Ombo temple relief carving", "Kom Ombo carved wall Egypt", "Kom Ombo temple hieroglyphs"],
        guard: { requirePlace: ["kom ombo", "ombo"], allowPlaces: ["aswan", "kom ombo"],
                 require: [["relief", "carving", "carved", "hieroglyph", "hieroglyphs", "wall", "column", "columns"]],
                 deny: ["pyramid", "luxor", "karnak", "edfu"] } },
      { role: "body", afterH2: 5, place: "Edfu", city: "Edfu",
        queries: ["Edfu temple Horus Egypt pylon", "temple of Horus Edfu courtyard", "Edfu temple falcon statue Egypt"],
        guard: { requirePlace: ["edfu", "horus"], allowPlaces: ["edfu", "aswan"],
                 require: [["temple", "pylon", "column", "columns", "falcon", "statue", "courtyard", "wall"]],
                 deny: ["pyramid", "luxor", "karnak", "kom ombo"] } },
      { role: "body", afterH2: 10, place: "Nile between Aswan and Luxor", city: "Aswan",
        queries: ["Nile river Egypt", "Nile cruise boat Egypt river", "Nile river bank Egypt palm trees", "Nile Egypt riverbank green"],
        guard: { requirePlace: ["nile"], allowPlaces: ["aswan", "luxor", "edfu", "kom ombo"],
                 require: [["river", "boat", "water", "bank", "palm", "green"]],
                 deny: ["temple", "pyramid", "tomb", "cairo"] } },
    ],
  },
  {
    slug: "medinet-habu",
    focusKeyword: "medinet habu",
    keywordSuffix: " at medinet habu in Luxor",
    images: [
      { role: "featured", place: "Medinet Habu", city: "Luxor", keyword: true,
        queries: ["Medinet Habu temple Luxor", "Medinet Habu temple Luxor Egypt", "Medinet Habu Ramesses III temple", "Medinet Habu columns painted Egypt"],
        guard: { requirePlace: ["medinet habu", "habu"], allowPlaces: ["luxor", "thebes", "medinet habu"],
                 require: [["temple", "column", "columns", "wall", "relief", "carved", "painted", "court"]],
                 deny: ["pyramid", "sphinx", "karnak", "valley of the kings"] } },
      { role: "body", afterH2: 2, place: "Medinet Habu", city: "Luxor",
        queries: ["Medinet Habu painted ceiling colour", "Medinet Habu original paint relief", "Medinet Habu coloured columns Luxor"],
        guard: { requirePlace: ["medinet habu", "habu"], allowPlaces: ["luxor", "thebes", "medinet habu"],
                 require: [["paint", "painted", "colour", "color", "ceiling", "relief", "carved", "column", "columns"]],
                 deny: ["pyramid", "karnak", "valley of the kings"] } },
      { role: "body", afterH2: 3, place: "Medinet Habu", city: "Luxor",
        queries: ["Medinet Habu battle relief wall", "Medinet Habu carved wall Egypt", "Medinet Habu hieroglyphs exterior wall"],
        guard: { requirePlace: ["medinet habu", "habu"], allowPlaces: ["luxor", "thebes", "medinet habu"],
                 require: [["relief", "carving", "carved", "hieroglyph", "hieroglyphs", "wall"]],
                 deny: ["pyramid", "karnak", "valley of the kings"] } },
      { role: "body", afterH2: 6, place: "Theban hills", city: "Luxor",
        queries: ["Theban hills Luxor west bank desert", "Luxor west bank cliffs Egypt", "Theban necropolis hills landscape"],
        // "west bank" used to be in requirePlace here. It let through a
        // photograph of Bethlehem, in the Palestinian West Bank, whose
        // description contradicted no Egyptian place because it named none.
        // Only a name that means Luxor confirms Luxor.
        guard: { requirePlace: ["theban", "thebes", "luxor", "valley of the kings"],
                 allowPlaces: ["luxor", "thebes"],
                 require: [["hill", "hills", "cliff", "cliffs", "desert", "rock", "mountain", "mountains"]],
                 deny: ["pyramid", "cairo", "aswan", "temple interior"] } },
    ],
  },
  {
    slug: "things-to-do-in-aswan",
    focusKeyword: "things to do in aswan",
    keywordSuffix: " among the things to do in aswan",
    images: [
      { role: "featured", place: "Aswan", city: "Aswan", keyword: true,
        queries: ["Aswan Egypt Nile feluccas islands", "Aswan Nile river view Egypt", "Aswan Egypt river granite islands"],
        guard: { requirePlace: ["aswan"], allowPlaces: ["aswan", "nubia", "elephantine"],
                 require: [["nile", "river", "felucca", "boat", "island", "islands", "water"]],
                 deny: ["pyramid", "cairo", "luxor", "cruise ship"] } },
      { role: "body", afterH2: 1, place: "Philae Temple", city: "Aswan",
        queries: ["Philae temple Aswan Egypt island", "temple of Isis Philae Egypt", "Philae temple columns Aswan"],
        guard: { requirePlace: ["philae", "isis"], allowPlaces: ["aswan", "philae", "agilkia"],
                 require: [["temple", "column", "columns", "island", "pylon", "ruins"]],
                 deny: ["pyramid", "karnak", "luxor", "cairo", "abu simbel"] } },
      { role: "body", afterH2: 2, place: "Aswan", city: "Aswan",
        queries: ["felucca sunset Aswan Egypt Nile", "felucca sail Aswan golden hour", "sailing boat sunset Nile Aswan"],
        guard: { requirePlace: ["aswan"], allowPlaces: ["aswan", "nubia", "elephantine"],
                 require: [["felucca", "sail", "sailing", "boat", "sunset", "nile", "river"]],
                 deny: ["pyramid", "cairo", "luxor", "cruise ship"] } },
      { role: "body", afterH2: 5, place: "Unfinished Obelisk", city: "Aswan",
        queries: ["unfinished obelisk Aswan Egypt quarry", "Aswan granite quarry obelisk", "unfinished obelisk granite Aswan"],
        // Found by auditPlaceGuards: "obelisk, quarry" named no place, and
        // there are Egyptian obelisks standing in Rome, Paris, London and New
        // York. The subject words belong in require.
        guard: { requirePlace: ["aswan", "unfinished obelisk"], allowPlaces: ["aswan"],
                 require: [["granite", "quarry", "stone", "rock", "obelisk"]],
                 deny: ["temple", "pyramid", "cairo", "luxor", "karnak"] } },
    ],
  },
  {
    slug: "coptic-cairo",
    focusKeyword: "coptic cairo",
    keywordSuffix: " in coptic cairo",
    images: [
      { role: "featured", place: "Coptic Cairo", city: "Cairo", keyword: true,
        queries: ["Hanging Church Coptic Cairo Egypt", "Coptic Cairo church facade Egypt", "Coptic quarter Cairo church towers"],
        guard: { requirePlace: ["coptic", "copt"], allowPlaces: ["cairo"],
                 require: [["church", "cross", "tower", "towers", "facade", "chapel", "basilica"]],
                 deny: ["pyramid", "sphinx", "mosque", "minaret", "luxor", "alexandria"] } },
      { role: "body", afterH2: 2, place: "Coptic Cairo", city: "Cairo",
        queries: ["Coptic church interior Cairo Egypt", "Coptic Cairo church nave icons", "Coptic church screen icons Egypt"],
        guard: { requirePlace: ["coptic", "copt"], allowPlaces: ["cairo"],
                 require: [["church", "interior", "nave", "icon", "icons", "screen", "column", "columns", "altar"]],
                 deny: ["pyramid", "mosque", "minaret", "luxor"] } },
      { role: "body", afterH2: 4, place: "Coptic Cairo", city: "Cairo",
        queries: ["Coptic Museum Cairo", "Coptic art icon Egypt museum", "Coptic textile manuscript Egypt", "Coptic carved wood Egypt museum"],
        guard: { requirePlace: ["coptic", "copt"], allowPlaces: ["cairo"],
                 require: [["icon", "icons", "art", "textile", "manuscript", "carved", "wood", "museum", "exhibit"]],
                 deny: ["pyramid", "mosque", "minaret", "luxor"] } },
      { role: "body", afterH2: 6, place: "Old Cairo", city: "Cairo",
        queries: ["Old Cairo street", "Old Cairo narrow street Egypt", "Old Cairo alley stone wall", "Old Cairo lane historic Egypt"],
        guard: { requirePlace: ["cairo"], allowPlaces: ["cairo"],
                 require: [["street", "alley", "lane", "wall", "stone", "old", "historic"]],
                 deny: ["pyramid", "sphinx", "luxor", "aswan", "alexandria", "skyline", "traffic"] } },
    ],
  },
  {
    slug: "islamic-cairo",
    focusKeyword: "islamic cairo",
    keywordSuffix: " in islamic cairo",
    images: [
      { role: "featured", place: "Islamic Cairo", city: "Cairo", keyword: true,
        queries: ["Islamic Cairo Al Muizz street Egypt", "Islamic Cairo minarets domes Egypt", "Al Muizz street Cairo night lit"],
        guard: { requirePlace: ["islamic cairo", "muizz", "moez"], allowPlaces: ["cairo"],
                 require: [["street", "minaret", "minarets", "mosque", "dome", "domes", "facade", "gate"]],
                 deny: ["pyramid", "sphinx", "church", "luxor", "aswan", "alexandria"] } },
      { role: "body", afterH2: 1, place: "Bab Zuweila", city: "Cairo",
        queries: ["Bab Zuweila Cairo gate minarets", "Cairo medieval gate Bab al Futuh", "Cairo old city gate stone towers"],
        guard: { requirePlace: ["bab", "zuweila", "zuwayla", "futuh"], allowPlaces: ["cairo"],
                 require: [["gate", "tower", "towers", "minaret", "minarets", "wall", "stone"]],
                 deny: ["pyramid", "church", "luxor", "aswan"] } },
      { role: "body", afterH2: 5, place: "Ibn Tulun Mosque", city: "Cairo",
        queries: ["Ibn Tulun mosque Cairo courtyard", "Ibn Tulun mosque arcade Egypt", "Ibn Tulun spiral minaret Cairo"],
        guard: { requirePlace: ["ibn tulun", "tulun"], allowPlaces: ["cairo"],
                 require: [["mosque", "courtyard", "arcade", "arch", "arches", "minaret", "brick"]],
                 deny: ["pyramid", "church", "luxor", "aswan"] } },
      { role: "body", afterH2: 7, place: "Khan al Khalili", city: "Cairo",
        queries: ["Khan el Khalili bazaar Cairo Egypt", "Cairo bazaar lanterns market", "Khan al Khalili market Cairo stalls"],
        guard: { requirePlace: ["khan el khalili", "khan al khalili", "khalili", "bazaar"], allowPlaces: ["cairo"],
                 require: [["market", "bazaar", "stall", "stalls", "shop", "shops", "lantern", "lanterns", "lane"]],
                 deny: ["pyramid", "church", "luxor", "aswan", "supermarket"] } },
    ],
  },
  {
    slug: "alexandria-day-trip-from-cairo",
    focusKeyword: "alexandria day trip from cairo",
    keywordSuffix: " on an alexandria day trip from cairo",
    images: [
      { role: "featured", place: "Qaitbay Citadel", city: "Alexandria", keyword: true,
        queries: ["Qaitbay citadel Alexandria Egypt sea", "Alexandria citadel fort Mediterranean Egypt", "Qaitbay fort Alexandria harbour"],
        guard: { requirePlace: ["qaitbay", "qaitbey", "alexandria"], allowPlaces: ["alexandria"],
                 require: [["citadel", "fort", "fortress", "sea", "harbour", "harbor", "stone", "wall"]],
                 deny: ["pyramid", "sphinx", "cairo", "luxor", "aswan", "temple"] } },
      { role: "body", afterH2: 2, place: "Alexandria corniche", city: "Alexandria",
        queries: ["Alexandria corniche Egypt sea front", "Alexandria Mediterranean waterfront Egypt", "Alexandria harbour Egypt boats"],
        guard: { requirePlace: ["alexandria"], allowPlaces: ["alexandria"],
                 require: [["sea", "corniche", "waterfront", "harbour", "harbor", "coast", "mediterranean", "boat", "boats"]],
                 deny: ["pyramid", "cairo", "luxor", "aswan", "nile", "temple"] } },
      { role: "body", afterH2: 3, place: "Bibliotheca Alexandrina", city: "Alexandria",
        queries: ["Bibliotheca Alexandrina library Egypt", "Alexandria library modern building Egypt", "Bibliotheca Alexandrina reading room"],
        guard: { requirePlace: ["bibliotheca", "alexandrina", "library"], allowPlaces: ["alexandria"],
                 require: [["library", "building", "modern", "architecture", "reading", "granite", "disc"]],
                 deny: ["pyramid", "cairo", "luxor", "temple", "ruins"] } },
      { role: "body", afterH2: 6, place: "Roman theatre Alexandria", city: "Alexandria",
        queries: ["Roman theatre Alexandria Egypt Kom el Dikka", "Alexandria Roman amphitheatre marble", "Kom el Dikka Alexandria ruins"],
        guard: { requirePlace: ["alexandria", "kom el dikka", "kom al dikka"], allowPlaces: ["alexandria"],
                 require: [["roman", "theatre", "theater", "amphitheatre", "marble", "ruins", "tier", "tiers", "column", "columns"]],
                 deny: ["pyramid", "cairo", "luxor", "aswan", "rome", "italy"] } },
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
 * The figure sitting at the end of section `h2Index`, with its position in the
 * body, or null when there is none there.
 *
 * A replacement needs the span rather than a boolean: it removes and inserts in
 * one string operation, so the position is never briefly empty and a failure
 * part way through cannot leave it that way.
 */
export function figureAtAfterH2(
  body: string, h2Index: number
): { start: number; end: number; html: string } | null {
  const positions = [...body.matchAll(/<h2>/g)].map((m) => m.index!);
  const next = positions[h2Index];
  const head = next === undefined ? body : body.slice(0, next);
  return figureEndingAt(head, head.length);
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
