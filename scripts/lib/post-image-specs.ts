// The image plan for every article this project generates, plus the two
// functions that decide where a figure goes in a body.
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
        guard: { requirePlace: ["western desert", "sahara", "egypt", "egyptian"],
                 allowPlaces: ["aswan", "siwa", "bahariya", "farafra"],
                 require: [["desert", "dune", "dunes", "sand"]],
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
        guard: { requirePlace: ["grand egyptian museum"],
                 allowPlaces: ["giza", "cairo", "grand egyptian museum", "egyptian museum"],
                 require: [["egypt", "egyptian", "pharaoh", "sarcophagus", "statue"]],
                 deny: ["louvre", "metropolitan", "british museum"] } },
      { role: "body", afterH2: 1, place: "Grand Egyptian Museum", city: "Giza",
        queries: ["Grand Egyptian Museum gallery", "Egyptian museum statue gallery Cairo", "ancient Egyptian sarcophagus museum", "Egyptian museum artifacts display"],
        guard: { requirePlace: ["grand egyptian museum"],
                 allowPlaces: ["giza", "cairo", "grand egyptian museum", "egyptian museum"],
                 require: [["statue", "sculpture", "sarcophagus", "artifact", "coffin", "mask"]],
                 deny: ["louvre", "british museum"] } },
      { role: "body", afterH2: 10, place: "Giza Pyramids", city: "Giza",
        queries: ["Giza pyramids Egypt", "pyramids of Giza sunrise Egypt", "Great Pyramid Giza Egypt"],
        guard: { requirePlace: ["giza", "great pyramid"], allowPlaces: ["giza", "cairo", "memphis"],
                 require: [["egypt", "egyptian", "desert", "sand", "sky"]],
                 deny: ["museum", "sudan", "maya", "chichen"] } },
      // Left empty on the first run: "a boat" is not enough to confirm the
      // solar boat or to write an honest alt. Wider phrasings, same strictness.
      { role: "body", afterH2: 5, place: "Khufu solar boat", city: "Giza",
        queries: ["Khufu solar boat Egypt museum", "ancient Egyptian wooden funerary boat", "Egyptian solar barque museum", "ancient wooden ship museum Egypt"],
        guard: { requirePlace: ["giza", "solar boat"],
                 allowPlaces: ["giza", "cairo", "solar boat", "grand egyptian museum", "egyptian museum"],
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
        guard: { requirePlace: ["valley of the kings", "luxor", "thebes", "theban"], allowPlaces: ["luxor", "thebes", "theban"],
                 require: [["egypt", "egyptian", "desert", "rock", "entrance", "tomb", "tombs", "painting", "paintings", "wall", "burial", "chamber", "valley", "hill", "cliff"]],
                 deny: ["hatshepsut", "karnak", "temple", "column", "pyramid"] } },
      { role: "body", afterH2: 2, place: "Valley of the Kings", city: "Luxor",
        queries: ["Valley of the Kings tomb painting", "ancient Egyptian painted tomb Luxor", "Egyptian tomb wall paintings hieroglyphs", "painted burial chamber Egypt"],
        guard: { requirePlace: ["valley of the kings", "luxor", "thebes", "theban"], allowPlaces: ["luxor", "thebes", "theban"],
                 require: [["painting", "paintings", "painted", "mural", "murals", "fresco", "frescoes", "artwork", "decorated", "decoration", "hieroglyph", "relief", "wall", "colour", "color"]],
                 deny: ["museum", "replica", "temple", "karnak"] } },
      // Left empty on the first run. Nefertari and the Valley of the Queens are
      // thinly tagged, so this asks for the subject rather than the site name.
      { role: "body", afterH2: 6, place: "Valley of the Queens", city: "Luxor",
        queries: ["Valley of the Queens Egypt tomb", "Nefertari tomb painting Egypt", "ancient Egyptian queen tomb wall painting", "Egyptian painted tomb chamber colour"],
        guard: { requirePlace: ["valley of the queens", "tomb of nefertari", "nefertari tomb"], allowPlaces: ["luxor", "thebes", "theban"],
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
        guard: { requirePlace: ["karnak"], allowPlaces: ["luxor", "karnak", "thebes"],
                 require: [["column", "columns", "hall", "hieroglyph", "stone", "pillar"]],
                 deny: ["greece", "athens", "pyramid", "museum"] } },
      { role: "body", afterH2: 2, place: "Hatshepsut Temple", city: "Luxor",
        queries: ["Hatshepsut temple Luxor Egypt", "Deir el Bahari temple terraces Egypt", "Hatshepsut mortuary temple cliff Egypt"],
        guard: { requirePlace: ["deir el bahari", "deir el-bahari", "hatshepsut temple"], allowPlaces: ["luxor", "thebes", "theban"],
                 require: [["temple", "cliff", "terrace", "column", "stone"]],
                 deny: ["karnak", "pyramid", "museum"] } },
      { role: "body", afterH2: 4, place: "Luxor Temple", city: "Luxor",
        queries: ["Luxor temple at night illuminated Egypt", "Luxor temple Egypt evening lit columns"],
        guard: { requirePlace: ["luxor temple"], allowPlaces: ["luxor", "karnak", "thebes"],
                 require: [["column", "columns", "statue", "stone", "illuminated", "lit", "night"]],
                 deny: ["pyramid", "museum", "greece"] } },
      { role: "body", afterH2: 9, place: "Nile River", city: "Luxor",
        queries: ["felucca sailing Nile Luxor Egypt", "Nile river Luxor boat sunset Egypt", "felucca Nile Egypt sail"],
        guard: { requirePlace: ["nile"], allowPlaces: ["luxor", "aswan", "cairo", "thebes"],
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
        guard: { requirePlace: ["dahshur", "bent pyramid"], allowPlaces: ["dahshur", "cairo", "memphis"],
                 require: [["pyramid", "pyramids"]],
                 deny: ["sphinx", "maya", "chichen", "sudan", "museum"] } },
      { role: "body", afterH2: 3, place: "Red Pyramid", city: "Dahshur",
        queries: ["Red Pyramid Dahshur Egypt", "Dahshur red pyramid desert Egypt", "Red Pyramid Sneferu Egypt"],
        guard: { requirePlace: ["dahshur", "red pyramid"], allowPlaces: ["dahshur", "cairo", "memphis"],
                 require: [["pyramid", "pyramids"]],
                 deny: ["sphinx", "maya", "chichen", "sudan", "museum"] } },
      // Left empty on the first run. Wider phrasings, and Sakkara spelled both
      // ways because providers are inconsistent about it.
      { role: "body", afterH2: 5, place: "Saqqara", city: "Cairo",
        queries: ["Saqqara step pyramid Egypt", "Sakkara pyramid Egypt", "Saqqara necropolis pyramid Egypt", "stepped pyramid Egypt desert"],
        guard: { requirePlace: ["saqqara", "sakkara", "step pyramid", "stepped pyramid"],
                 allowPlaces: ["saqqara", "sakkara", "cairo", "memphis"],
                 require: [["pyramid", "pyramids", "necropolis", "tomb"]],
                 deny: ["giza", "sphinx", "maya", "chichen"] } },
      // Previously accepted a relief described as "from Luxor, Egypt", a
      // different governorate. The contradiction check now rejects that.
      { role: "body", afterH2: 4, place: "Saqqara", city: "Cairo",
        queries: ["Saqqara mastaba tomb relief Egypt", "Saqqara tomb carving Egypt", "ancient Egyptian mastaba relief Saqqara"],
        guard: { requirePlace: ["saqqara", "sakkara", "serapeum"],
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
        guard: { requirePlace: ["dendera", "denderah"], allowPlaces: ["qena", "dendera"],
                 require: [["temple", "column", "columns", "ceiling", "hall", "relief", "carved"]],
                 deny: ["pyramid", "sphinx", "luxor", "karnak", "abydos"] } },
      { role: "body", afterH2: 2, place: "Dendera", city: "Qena",
        queries: ["Dendera temple painted ceiling astronomical", "Dendera zodiac ceiling Egypt", "Dendera hypostyle hall ceiling colour"],
        guard: { requirePlace: ["dendera", "denderah"], allowPlaces: ["qena", "dendera"],
                 require: [["ceiling", "painted", "paint", "colour", "color", "astronomical", "zodiac", "relief"]],
                 deny: ["pyramid", "luxor", "karnak", "abydos"] } },
      { role: "body", afterH2: 4, place: "Abydos", city: "Sohag",
        queries: ["Abydos temple Seti relief Egypt", "temple of Seti I Abydos carving", "Abydos temple hieroglyphs Egypt"],
        guard: { requirePlace: ["abydos"], allowPlaces: ["abydos", "sohag"],
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
        guard: { requirePlace: ["edfu"], allowPlaces: ["edfu", "aswan"],
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
        guard: { requirePlace: ["philae", "agilkia"], allowPlaces: ["aswan", "philae", "agilkia"],
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
        guard: { requirePlace: ["coptic cairo", "old cairo", "cairo"], allowPlaces: ["cairo"],
                 require: [["church", "cross", "tower", "towers", "facade", "chapel", "basilica"]],
                 deny: ["pyramid", "sphinx", "mosque", "minaret", "luxor", "alexandria"] } },
      { role: "body", afterH2: 2, place: "Coptic Cairo", city: "Cairo",
        queries: ["Coptic church interior Cairo Egypt", "Coptic Cairo church nave icons", "Coptic church screen icons Egypt"],
        guard: { requirePlace: ["coptic cairo", "old cairo", "cairo"], allowPlaces: ["cairo"],
                 require: [["church", "interior", "nave", "icon", "icons", "screen", "column", "columns", "altar"]],
                 deny: ["pyramid", "mosque", "minaret", "luxor"] } },
      { role: "body", afterH2: 4, place: "Coptic Cairo", city: "Cairo",
        queries: ["Coptic Museum Cairo", "Coptic art icon Egypt museum", "Coptic textile manuscript Egypt", "Coptic carved wood Egypt museum"],
        guard: { requirePlace: ["coptic cairo", "old cairo", "cairo"], allowPlaces: ["cairo"],
                 require: [["icon", "icons", "art", "textile", "manuscript", "carved", "wood", "museum", "exhibit"]],
                 deny: ["pyramid", "mosque", "minaret", "luxor"] } },
      { role: "body", afterH2: 6, place: "Old Cairo", city: "Cairo",
        queries: ["Old Cairo street", "Old Cairo narrow street Egypt", "Old Cairo alley stone wall", "Old Cairo lane historic Egypt"],
        guard: { requirePlace: ["cairo"], allowPlaces: ["cairo", "old cairo", "coptic cairo", "islamic cairo"],
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
        guard: { requirePlace: ["bab zuweila", "bab zuwayla", "zuweila", "zuwayla", "bab al futuh"], allowPlaces: ["cairo"],
                 require: [["gate", "tower", "towers", "minaret", "minarets", "wall", "stone"]],
                 deny: ["pyramid", "church", "luxor", "aswan"] } },
      { role: "body", afterH2: 5, place: "Ibn Tulun Mosque", city: "Cairo",
        queries: ["Ibn Tulun mosque Cairo courtyard", "Ibn Tulun mosque arcade Egypt", "Ibn Tulun spiral minaret Cairo"],
        guard: { requirePlace: ["ibn tulun", "tulun"], allowPlaces: ["cairo"],
                 require: [["mosque", "courtyard", "arcade", "arch", "arches", "minaret", "brick"]],
                 deny: ["pyramid", "church", "luxor", "aswan"] } },
      { role: "body", afterH2: 7, place: "Khan al Khalili", city: "Cairo",
        queries: ["Khan el Khalili bazaar Cairo Egypt", "Cairo bazaar lanterns market", "Khan al Khalili market Cairo stalls"],
        guard: { requirePlace: ["khan el khalili", "khan al khalili", "khalili"], allowPlaces: ["cairo"],
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
        guard: { requirePlace: ["qaitbay", "qaitbey"], allowPlaces: ["alexandria"],
                 require: [["citadel", "fort", "fortress", "sea", "harbour", "harbor", "stone", "wall"]],
                 deny: ["pyramid", "sphinx", "cairo", "luxor", "aswan", "temple"] } },
      { role: "body", afterH2: 2, place: "Alexandria corniche", city: "Alexandria",
        queries: ["Alexandria corniche Egypt sea front", "Alexandria Mediterranean waterfront Egypt", "Alexandria harbour Egypt boats"],
        guard: { requirePlace: ["alexandria"], allowPlaces: ["alexandria"],
                 require: [["sea", "corniche", "waterfront", "harbour", "harbor", "coast", "mediterranean", "boat", "boats"]],
                 deny: ["pyramid", "cairo", "luxor", "aswan", "nile", "temple"] } },
      { role: "body", afterH2: 3, place: "Bibliotheca Alexandrina", city: "Alexandria",
        queries: ["Bibliotheca Alexandrina library Egypt", "Alexandria library modern building Egypt", "Bibliotheca Alexandrina reading room"],
        guard: { requirePlace: ["bibliotheca", "alexandrina", "bibliotheca alexandrina"], allowPlaces: ["alexandria"],
                 require: [["library", "building", "modern", "architecture", "reading", "granite", "disc"]],
                 deny: ["pyramid", "cairo", "luxor", "temple", "ruins"] } },
      { role: "body", afterH2: 6, place: "Roman theatre Alexandria", city: "Alexandria",
        queries: ["Roman theatre Alexandria Egypt Kom el Dikka", "Alexandria Roman amphitheatre marble", "Kom el Dikka Alexandria ruins"],
        guard: { requirePlace: ["alexandria", "kom el dikka", "kom al dikka"], allowPlaces: ["alexandria"],
                 require: [["roman", "theatre", "theater", "amphitheatre", "marble", "ruins", "tier", "tiers", "column", "columns"]],
                 deny: ["pyramid", "cairo", "luxor", "aswan", "rome", "italy"] } },
    ],
  },

  // -------------------------------------------------------------------------
  // The October and December waves.
  //
  // Queries are two or three words. The providers return nothing at all for a
  // four word phrase, so the focus keyword goes in the alt text and never in
  // the search.
  //
  // Several of these lean on the contradiction check rather than on deny
  // lists, because it is stronger: any EGYPT_PLACES name the guard does not
  // allow rejects the candidate outright. "Valley of the Kings" is one of
  // those names, which is what keeps royal tomb photographs out of the two
  // articles below that are about anywhere but.
  // -------------------------------------------------------------------------
  {
    slug: "valley-of-the-queens",
    focusKeyword: "valley of the queens",
    keywordSuffix: " in the valley of the queens",
    images: [
      // Nefertari and this valley are thinly tagged by the stock providers, so
      // these will often find nothing. An empty position is a no-op; a photo
      // of the Kings valley sold as the Queens valley is not.
      { role: "featured", place: "Valley of the Queens", city: "Luxor", keyword: true,
        queries: ["Nefertari tomb painting", "Valley of the Queens", "Egyptian queen tomb"],
        guard: { requirePlace: ["valley of the queens", "tomb of nefertari", "nefertari tomb"],
                 allowPlaces: ["luxor", "thebes", "theban", "valley of the queens"],
                 require: [["painting", "painted", "tomb", "chamber", "wall", "relief", "hieroglyph", "colour", "color"]],
                 deny: ["museum", "replica", "model", "exhibition"] } },
      { role: "body", afterH2: 3, place: "Valley of the Queens", city: "Luxor",
        queries: ["Egyptian tomb chamber", "ancient Egyptian mural", "tomb wall painting"],
        guard: { requirePlace: ["valley of the queens", "tomb of nefertari", "nefertari tomb"],
                 allowPlaces: ["luxor", "thebes", "theban", "valley of the queens"],
                 require: [["painting", "painted", "mural", "fresco", "relief", "hieroglyph", "chamber"]],
                 deny: ["museum", "replica", "model"] } },
      { role: "body", afterH2: 5, place: "Valley of the Queens", city: "Luxor",
        queries: ["Theban necropolis valley", "Luxor west bank", "desert valley Egypt"],
        guard: { requirePlace: ["valley of the queens"],
                 allowPlaces: ["luxor", "thebes", "theban", "valley of the queens"],
                 require: [["valley", "cliff", "cliffs", "rock", "desert", "entrance", "path", "hillside"]],
                 deny: ["temple", "column", "columns", "pylon", "pyramid", "museum"] } },
    ],
  },
  {
    slug: "egypt-diving-red-sea",
    focusKeyword: "egypt diving red sea",
    keywordSuffix: " on an egypt diving red sea trip",
    images: [
      // "red sea" is not in EGYPT_PLACES, so it cannot contradict anything and
      // is safe to require. The coast towns are allowed rather than required,
      // because a reef photograph usually names the sea and not the town.
      { role: "featured", place: "Red Sea reef", city: "Hurghada", keyword: true,
        queries: ["Red Sea coral reef", "Red Sea underwater", "coral reef Egypt"],
        guard: { requirePlace: ["red sea"],
                 allowPlaces: ["hurghada", "marsa alam", "sharm", "dahab", "safaga", "sinai"],
                 require: [["reef", "coral", "fish", "underwater", "diver", "diving", "scuba", "snorkel"]],
                 deny: ["aquarium", "tank", "captivity", "zoo", "maldives", "caribbean", "bahamas",
                        "great barrier", "fiji", "swimming pool"] } },
      { role: "body", afterH2: 3, place: "Red Sea wreck", city: "Hurghada",
        queries: ["Red Sea shipwreck", "underwater wreck diving", "sunken ship reef"],
        guard: { requirePlace: ["red sea", "thistlegorm", "abu nuhas"],
                 allowPlaces: ["hurghada", "marsa alam", "sharm", "dahab", "safaga", "sinai"],
                 require: [["wreck", "shipwreck", "sunken", "hull", "cargo", "underwater"]],
                 deny: ["aquarium", "museum", "harbour", "harbor", "beached", "maldives", "caribbean",
                        "great barrier", "truk", "scapa"] } },
      { role: "body", afterH2: 4, place: "Red Sea marine life", city: "Marsa Alam",
        queries: ["Red Sea fish", "reef shark Egypt", "Red Sea turtle"],
        guard: { requirePlace: ["red sea"],
                 allowPlaces: ["hurghada", "marsa alam", "sharm", "dahab", "safaga", "sinai"],
                 require: [["shark", "turtle", "dolphin", "fish", "ray", "reef", "shoal", "school"]],
                 deny: ["aquarium", "tank", "captivity", "zoo", "maldives", "caribbean", "bahamas",
                        "great barrier", "galapagos"] } },
    ],
  },
  {
    slug: "black-and-white-desert-egypt",
    focusKeyword: "black and white desert egypt",
    keywordSuffix: " on the black and white desert egypt route",
    images: [
      // The deny lists here are unusually long on purpose. "White desert" and
      // "black desert" are generic enough as English that they return polar
      // ice, Namibian dunes and New Mexico gypsum, none of which name a
      // country the OUTSIDE_EGYPT list would catch in every caption.
      { role: "featured", place: "White Desert", city: "Farafra", keyword: true,
        queries: ["White Desert Egypt", "chalk rock formation", "Farafra desert"],
        guard: { requirePlace: ["white desert", "farafra"],
                 allowPlaces: ["white desert", "farafra", "bahariya"],
                 require: [["chalk", "limestone", "formation", "formations", "rock", "outcrop", "desert", "sand"]],
                 deny: ["antarctic", "antarctica", "arctic", "greenland", "patagonia", "namib",
                        "sossusvlei", "white sands", "new mexico", "atacama", "gobi", "mojave",
                        "snow", "ice", "glacier", "salt flat", "salar"] } },
      { role: "body", afterH2: 1, place: "White Desert", city: "Farafra",
        queries: ["chalk formations desert", "wind eroded rock", "White Desert sunset"],
        guard: { requirePlace: ["white desert", "farafra"],
                 allowPlaces: ["white desert", "farafra", "bahariya"],
                 require: [["chalk", "limestone", "formation", "formations", "eroded", "mushroom", "pinnacle", "rock"]],
                 deny: ["antarctic", "antarctica", "arctic", "greenland", "namib", "sossusvlei",
                        "white sands", "new mexico", "atacama", "gobi", "mojave", "snow", "ice",
                        "glacier", "salt flat", "salar"] } },
      { role: "body", afterH2: 2, place: "White Desert camp", city: "Farafra",
        queries: ["desert camp night", "White Desert camping", "desert stars Egypt"],
        guard: { requirePlace: ["white desert", "farafra"],
                 allowPlaces: ["white desert", "farafra", "bahariya"],
                 require: [["camp", "camping", "tent", "campfire", "fire", "night", "stars", "bedouin"]],
                 deny: ["antarctic", "antarctica", "arctic", "namib", "sossusvlei", "white sands",
                        "atacama", "gobi", "mojave", "snow", "ice", "glacier", "resort", "hotel",
                        "glamping", "festival"] } },
      { role: "body", afterH2: 3, place: "Black Desert", city: "Bahariya",
        queries: ["Black Desert Egypt", "volcanic desert hills", "dark conical hills"],
        guard: { requirePlace: ["black desert", "bahariya"],
                 allowPlaces: ["black desert", "bahariya", "farafra"],
                 require: [["hill", "hills", "cone", "conical", "volcanic", "basalt", "dolerite", "dark", "desert"]],
                 deny: ["antarctic", "antarctica", "iceland", "hawaii", "etna", "vesuvius", "namib",
                        "atacama", "snow", "ice", "glacier", "lava flow", "eruption"] } },
    ],
  },
  {
    slug: "tombs-of-the-nobles",
    focusKeyword: "tombs of the nobles",
    keywordSuffix: " in the tombs of the nobles",
    images: [
      // The whole risk on this one is a royal tomb passing for an official's
      // tomb: both are painted, both are at Luxor, and the captions are nearly
      // identical. "valley of the kings" is in EGYPT_PLACES and is not allowed
      // here, so the contradiction check refuses it before anything else runs,
      // and the royal vocabulary in deny covers a caption that omits the valley.
      { role: "featured", place: "Tombs of the Nobles", city: "Luxor", keyword: true,
        queries: ["Sheikh Abd el Qurna tomb", "nobles tomb Luxor", "Egyptian banquet fresco"],
        guard: { requirePlace: ["tombs of the nobles", "tomb of the nobles", "sheikh abd el qurna", "qurna", "gurna"],
                 allowPlaces: ["luxor", "thebes", "theban"],
                 require: [["painting", "painted", "fresco", "mural", "relief", "wall", "chamber", "scene"]],
                 deny: ["valley of the kings", "royal tomb", "tutankhamun", "pharaoh",
                        "museum", "replica", "model"] } },
      { role: "body", afterH2: 1, place: "Tombs of the Nobles", city: "Luxor",
        queries: ["Egyptian harvest painting", "ancient Egyptian daily life", "tomb painting musicians"],
        guard: { requirePlace: ["tombs of the nobles", "tomb of the nobles", "sheikh abd el qurna", "qurna", "gurna"],
                 allowPlaces: ["luxor", "thebes", "theban"],
                 require: [["harvest", "banquet", "musician", "musicians", "farming", "fishing",
                            "daily", "painting", "painted", "fresco"]],
                 deny: ["valley of the kings", "royal tomb", "tutankhamun", "pharaoh", "museum", "replica"] } },
      { role: "body", afterH2: 4, place: "Qubbet el Hawa", city: "Aswan",
        queries: ["Qubbet el Hawa Aswan", "Aswan cliff tombs", "Nile cliff tombs"],
        guard: { requirePlace: ["qubbet el hawa", "qubbet al hawa", "qubbet-el-hawa"],
                 allowPlaces: ["aswan", "elephantine", "nubia"],
                 require: [["tomb", "tombs", "cliff", "rock", "stair", "stairway", "facade", "nile"]],
                 deny: ["valley of the kings", "museum", "replica"] } },
    ],
  },
  {
    slug: "open-air-museum-memphis-egypt",
    focusKeyword: "open air museum memphis egypt",
    keywordSuffix: " at the open air museum memphis egypt",
    images: [
      // Memphis is the one name on this site that exists in another country
      // and is far more famous there. "tennessee" and "graceland" are already
      // refused globally by OUTSIDE_EGYPT; the rest of that city's vocabulary
      // is not, so it goes in deny here. "blues" is deliberately absent: it
      // singularises to "blue" and would reject every description with a blue
      // sky in it.
      { role: "featured", place: "Memphis", city: "Mit Rahina", keyword: true,
        queries: ["Memphis Egypt colossus", "Ramesses statue Memphis", "Mit Rahina Egypt"],
        guard: { requirePlace: ["memphis", "mit rahina"],
                 allowPlaces: ["memphis", "cairo"],
                 require: [["colossus", "statue", "ramesses", "ramses", "ancient", "egyptian", "limestone"]],
                 deny: ["elvis", "beale street", "mississippi", "guitar", "bbq", "barbecue",
                        "grizzlies", "pyramid arena", "sun studio", "memphis belle"] } },
      { role: "body", afterH2: 1, place: "Alabaster sphinx Memphis", city: "Mit Rahina",
        queries: ["alabaster sphinx Memphis", "Egyptian alabaster statue", "Memphis sphinx Egypt"],
        // "sphinx" has to be allowed because the subject is one, which is why
        // giza is NOT allowed: it is the only thing keeping the Great Sphinx out.
        guard: { requirePlace: ["memphis", "mit rahina"],
                 allowPlaces: ["memphis", "sphinx"],
                 require: [["sphinx", "alabaster", "calcite", "statue"]],
                 deny: ["elvis", "beale street", "mississippi", "guitar", "grizzlies",
                        "great sphinx", "pyramid"] } },
      { role: "body", afterH2: 4, place: "Memphis museum garden", city: "Mit Rahina",
        queries: ["Memphis Egypt ruins", "Mit Rahina statuary", "Egyptian sarcophagus garden"],
        guard: { requirePlace: ["memphis", "mit rahina"],
                 allowPlaces: ["memphis", "cairo"],
                 require: [["statue", "statues", "sarcophagus", "capital", "capitals", "ruins",
                            "fragment", "fragments", "garden", "palm", "palms"]],
                 deny: ["elvis", "beale street", "mississippi", "guitar", "grizzlies"] } },
    ],
  },
  {
    slug: "hatshepsut-temple",
    focusKeyword: "hatshepsut temple",
    keywordSuffix: " at the hatshepsut temple",
    images: [
      // "hatshepsut" on its own is in NOT_A_PLACE_PERSON and cannot confirm a
      // place: she has a temple here, a tomb in the royal valley and statues
      // in several museums. The two word forms and "deir el bahari" do name
      // the building, so those are what requirePlace holds.
      { role: "featured", place: "Temple of Hatshepsut", city: "Luxor", keyword: true,
        queries: ["Hatshepsut temple", "Deir el Bahari", "temple terraces Egypt"],
        guard: { requirePlace: ["hatshepsut temple", "temple of hatshepsut", "deir el bahari", "deir el-bahari"],
                 allowPlaces: ["luxor", "thebes", "theban", "hatshepsut temple", "deir el bahari", "deir el-bahari"],
                 require: [["temple", "terrace", "terraces", "colonnade", "column", "columns", "ramp", "cliff", "limestone"]],
                 deny: ["museum", "replica", "model", "miniature", "drawing"] } },
      { role: "body", afterH2: 3, place: "Temple of Hatshepsut", city: "Luxor",
        queries: ["Hatshepsut temple relief", "Egyptian carved relief", "Deir el Bahari wall"],
        guard: { requirePlace: ["hatshepsut temple", "temple of hatshepsut", "deir el bahari", "deir el-bahari"],
                 allowPlaces: ["luxor", "thebes", "theban", "hatshepsut temple", "deir el bahari", "deir el-bahari"],
                 require: [["relief", "carving", "carved", "hieroglyph", "wall", "painted", "colonnade"]],
                 deny: ["museum", "replica", "model"] } },
      { role: "body", afterH2: 8, place: "Temple of Hatshepsut", city: "Luxor",
        queries: ["Deir el Bahari cliff", "Hatshepsut temple wide", "temple below cliff"],
        guard: { requirePlace: ["hatshepsut temple", "temple of hatshepsut", "deir el bahari", "deir el-bahari"],
                 allowPlaces: ["luxor", "thebes", "theban", "hatshepsut temple", "deir el bahari", "deir el-bahari"],
                 require: [["cliff", "terrace", "terraces", "temple", "facade", "rock", "landscape"]],
                 deny: ["museum", "replica", "model", "interior"] } },
    ],
  },
  {
    slug: "memphis-egypt",
    focusKeyword: "memphis egypt",
    keywordSuffix: " at the site of memphis egypt",
    images: [
      { role: "featured", place: "Memphis", city: "Mit Rahina", keyword: true,
        queries: ["Memphis Egypt ruins", "Mit Rahina palms", "ancient Memphis Egypt"],
        guard: { requirePlace: ["memphis", "mit rahina"],
                 allowPlaces: ["memphis", "cairo"],
                 require: [["ruins", "stone", "statue", "palm", "palms", "ancient", "egyptian", "excavation", "colossus"]],
                 deny: ["elvis", "beale street", "mississippi", "guitar", "bbq", "barbecue",
                        "grizzlies", "pyramid arena", "sun studio", "memphis belle"] } },
      { role: "body", afterH2: 5, place: "Memphis colossus", city: "Mit Rahina",
        queries: ["Ramesses colossus Memphis", "fallen statue Egypt", "Memphis Egypt statue"],
        guard: { requirePlace: ["memphis", "mit rahina"],
                 allowPlaces: ["memphis", "cairo"],
                 require: [["colossus", "statue", "ramesses", "ramses", "limestone", "fallen", "recumbent"]],
                 deny: ["elvis", "beale street", "mississippi", "guitar", "grizzlies"] } },
      { role: "body", afterH2: 8, place: "Saqqara", city: "Giza",
        queries: ["Saqqara necropolis", "Saqqara pyramid Egypt", "Saqqara desert"],
        guard: { requirePlace: ["saqqara", "sakkara"],
                 allowPlaces: ["saqqara", "sakkara", "memphis", "cairo", "giza"],
                 require: [["pyramid", "step", "stepped", "mastaba", "necropolis", "desert", "sand", "tomb"]],
                 deny: ["great pyramid", "giza pyramids", "elvis", "meroe"] } },
    ],
  },
  {
    slug: "deir-el-medina",
    focusKeyword: "deir el medina",
    keywordSuffix: " at deir el medina",
    images: [
      // The named case from the brief. A painted royal tomb matches "tomb",
      // "painted" and "Luxor" and is the wrong picture for a village of
      // houses, so the village spec denies the royal vocabulary outright and
      // requires the settlement itself.
      { role: "featured", place: "Deir el Medina", city: "Luxor", keyword: true,
        queries: ["Deir el Medina village", "ancient Egyptian village", "workers village Luxor"],
        guard: { requirePlace: ["deir el medina", "deir el-medina", "set maat"],
                 allowPlaces: ["luxor", "thebes", "theban", "deir el medina"],
                 require: [["village", "house", "houses", "settlement", "street", "wall", "walls",
                            "foundation", "foundations", "ruins", "stone"]],
                 deny: ["valley of the kings", "royal tomb", "tutankhamun", "pharaoh",
                        "sarcophagus", "temple", "column", "columns", "pylon", "museum"] } },
      // The workmen's own painted tombs ARE the exception, so they get their
      // own position rather than a looser guard on the one above. Sennedjem,
      // Pashedu and Inherkhau are private individuals whose tombs exist only
      // here, so unlike a king's name they do identify the place.
      { role: "body", afterH2: 3, place: "Deir el Medina tomb", city: "Luxor",
        queries: ["Sennedjem tomb painting", "Deir el Medina tomb", "Egyptian vaulted tomb"],
        guard: { requirePlace: ["deir el medina", "deir el-medina", "sennedjem", "pashedu", "inherkhau"],
                 allowPlaces: ["luxor", "thebes", "theban", "deir el medina"],
                 require: [["painting", "painted", "vault", "vaulted", "chamber", "fresco", "mural", "relief"]],
                 deny: ["valley of the kings", "royal tomb", "tutankhamun", "museum", "replica"] } },
      { role: "body", afterH2: 4, place: "Deir el Medina temple", city: "Luxor",
        queries: ["Deir el Medina temple", "Ptolemaic temple Egypt", "small Egyptian temple"],
        guard: { requirePlace: ["deir el medina", "deir el-medina"],
                 allowPlaces: ["luxor", "thebes", "theban", "deir el medina"],
                 require: [["temple", "chapel", "ptolemaic", "enclosure", "stone", "sandstone"]],
                 deny: ["valley of the kings", "museum", "replica"] } },
    ],
  },
  {
    slug: "bahariya-oasis-egypt",
    focusKeyword: "bahariya oasis egypt",
    keywordSuffix: " in bahariya oasis egypt",
    images: [
      // The oasis, deliberately not the desert next to it. "white desert" is
      // in EGYPT_PLACES and is NOT allowed on the first two positions, so a
      // chalk landscape captioned "White Desert, Bahariya" is refused here and
      // left for the article that is actually about it.
      { role: "featured", place: "Bahariya Oasis", city: "Bawiti", keyword: true,
        queries: ["Bahariya oasis Egypt", "Egyptian oasis palms", "desert oasis spring"],
        guard: { requirePlace: ["bahariya", "bawiti"],
                 allowPlaces: ["bahariya"],
                 require: [["oasis", "palm", "palms", "grove", "spring", "water", "pool", "village", "green"]],
                 deny: ["antarctic", "namib", "atacama", "resort", "waterpark", "beach",
                        "swimming pool"] } },
      { role: "body", afterH2: 1, place: "Bahariya springs", city: "Bawiti",
        queries: ["desert hot spring", "Bahariya spring Egypt", "oasis pool palms"],
        guard: { requirePlace: ["bahariya", "bawiti"],
                 allowPlaces: ["bahariya"],
                 require: [["spring", "pool", "water", "bath", "palm", "palms", "steam"]],
                 deny: ["antarctic", "iceland", "blue lagoon", "onsen", "resort",
                        "waterpark", "beach"] } },
      { role: "body", afterH2: 4, place: "Black Desert", city: "Bahariya",
        queries: ["Black Desert Egypt", "volcanic desert hills", "dark desert cones"],
        guard: { requirePlace: ["black desert", "bahariya"],
                 allowPlaces: ["black desert", "bahariya"],
                 require: [["hill", "hills", "cone", "conical", "volcanic", "basalt", "dolerite", "dark", "desert"]],
                 deny: ["antarctic", "iceland", "hawaii", "etna", "vesuvius", "namib", "atacama",
                        "snow", "ice", "glacier", "lava flow", "eruption"] } },
    ],
  },

  // -------------------------------------------------------------------------
  // The sixteen rewritten articles
  // -------------------------------------------------------------------------
  // These differ from everything above in one way that matters. The earlier
  // posts are ABOUT a place, so the guard confirming the place is also
  // confirming the subject. Several of these are about a topic instead, and a
  // topic has no photograph: nothing in a stock library is captioned "travel
  // insurance for Egypt". They are illustrated with the country the article is
  // actually about, guarded on real places so a wrong photograph is still
  // impossible, and the alt describes what is in the frame rather than the
  // topic of the page.
  //
  // Two positions below are deliberately long shots: the wall socket on
  // egypt-plug-type and the banknotes on currency-in-egypt. Both
  // need a description that names Egypt AND the object, which stock providers
  // rarely write. If they find nothing that is the correct outcome, and the
  // owner adds an image by hand. A loose guard that found something would be
  // the failure, not an empty position.
  //
  // Those same two positions need their ALT checked by hand if they do fill.
  // composeAlt builds an alt from the place vocabulary, and for a place of
  // "Egypt" it has nothing specific to work with: given a description reading
  // "Egyptian pound banknotes held in a hand at a market in Egypt" it composes
  // "A market", which is true of the photograph and useless as a description
  // of it. That is the composer working as designed on a subject it was not
  // designed for, not a guard failure, and it is a two word edit in the admin
  // editor rather than a reason to loosen anything here.
  {
    slug: "best-time-to-visit-egypt",
    focusKeyword: "best time to visit egypt",
    keywordSuffix: " at the best time to visit egypt",
    images: [
      { role: "featured", place: "Nile at Aswan", city: "Aswan", keyword: true,
        queries: ["Aswan Nile felucca Egypt", "Nile river Aswan sunset Egypt", "felucca sailing Aswan Egypt"],
        guard: { requirePlace: ["aswan"], allowPlaces: ["aswan", "nubia"],
                 require: [["felucca", "sail", "sailing", "boat", "nile", "river"]],
                 deny: ["cruise ship", "temple", "pyramid", "luxor", "cairo"] } },
      { role: "body", afterH2: 4, place: "Karnak Temple", city: "Luxor",
        queries: ["Karnak temple columns Luxor", "Karnak hypostyle hall Egypt", "Karnak temple Luxor Egypt"],
        guard: { requirePlace: ["karnak"], allowPlaces: ["luxor", "karnak", "thebes"],
                 require: [["column", "columns", "hall", "hieroglyph", "stone", "pillar"]],
                 deny: ["greece", "athens", "pyramid", "museum"] } },
      { role: "body", afterH2: 8, place: "Giza Pyramids", city: "Giza",
        queries: ["Giza pyramids Egypt", "Great Pyramid Giza desert", "pyramids of Giza sky Egypt"],
        guard: { requirePlace: ["giza", "great pyramid"], allowPlaces: ["giza", "cairo", "memphis"],
                 require: [["egypt", "egyptian", "desert", "sand", "sky"]],
                 deny: ["museum", "sudan", "maya", "chichen"] } },
      { role: "body", afterH2: 11, place: "Red Sea reef", city: "Hurghada",
        queries: ["Red Sea coral reef Egypt", "Red Sea underwater fish Egypt", "Red Sea diving Hurghada"],
        guard: { requirePlace: ["red sea"], allowPlaces: ["hurghada", "marsa alam", "sharm", "dahab", "safaga", "sinai"],
                 require: [["reef", "coral", "fish", "underwater", "diver", "diving", "snorkel"]],
                 deny: ["aquarium", "tank", "captivity", "zoo", "maldives", "caribbean", "bahamas", "great barrier", "fiji", "swimming pool"] } },
    ],
  },
  {
    slug: "luxury-egypt-tours",
    focusKeyword: "luxury egypt tours",
    keywordSuffix: " on luxury egypt tours",
    images: [
      { role: "featured", place: "Giza Pyramids", city: "Giza", keyword: true,
        queries: ["Giza pyramids Egypt", "Great Pyramid Giza desert", "pyramids Giza plateau Egypt"],
        guard: { requirePlace: ["giza", "great pyramid"], allowPlaces: ["giza", "cairo", "memphis"],
                 require: [["egypt", "egyptian", "desert", "sand", "sky"]],
                 deny: ["museum", "sudan", "maya", "chichen"] } },
      { role: "body", afterH2: 4, place: "Nile River", city: "Luxor",
        queries: ["Nile river boat Egypt", "felucca sailing Nile Egypt", "Nile river water Egypt"],
        guard: { requirePlace: ["nile"], allowPlaces: ["luxor", "aswan", "cairo", "thebes"],
                 require: [["boat", "sail", "river", "water", "felucca"]],
                 deny: ["cruise ship", "yacht", "marina", "motorboat"] } },
      { role: "body", afterH2: 8, place: "Luxor Temple", city: "Luxor",
        queries: ["Luxor temple at night Egypt", "Luxor temple columns illuminated", "Luxor temple statues Egypt"],
        guard: { requirePlace: ["luxor temple"], allowPlaces: ["luxor", "karnak", "thebes"],
                 require: [["column", "columns", "statue", "stone", "illuminated", "lit", "night"]],
                 deny: ["pyramid", "museum", "greece"] } },
      { role: "body", afterH2: 11, place: "Abu Simbel", city: "Aswan",
        queries: ["Abu Simbel temple Egypt", "Abu Simbel Ramesses colossi", "Abu Simbel facade Nubia"],
        guard: { requirePlace: ["simbel"], allowPlaces: ["abu simbel", "aswan", "nubia"],
                 require: [["temple", "statue", "statues", "colossi", "facade", "rock"]],
                 deny: ["pyramid", "sphinx", "car", "vehicle"] } },
    ],
  },
  {
    slug: "egypt-visa-for-us-citizens",
    focusKeyword: "egypt visa for us citizens",
    keywordSuffix: " for travellers arranging an egypt visa for us citizens",
    images: [
      { role: "featured", place: "Old Cairo", city: "Cairo", keyword: true,
        queries: ["old Cairo street Egypt", "historic Cairo lane Egypt", "Cairo old town street"],
        guard: { requirePlace: ["cairo"], allowPlaces: ["cairo", "old cairo", "coptic cairo", "islamic cairo"],
                 require: [["street", "alley", "lane", "wall", "stone", "old", "historic"]],
                 deny: ["pyramid", "sphinx", "luxor", "aswan", "alexandria", "skyline", "traffic"] } },
      { role: "body", afterH2: 4, place: "Giza Pyramids", city: "Giza",
        queries: ["Giza pyramids Egypt", "Great Pyramid Giza desert", "pyramids Giza Egypt sky"],
        guard: { requirePlace: ["giza", "great pyramid"], allowPlaces: ["giza", "cairo", "memphis"],
                 require: [["egypt", "egyptian", "desert", "sand", "sky"]],
                 deny: ["museum", "sudan", "maya", "chichen"] } },
      { role: "body", afterH2: 8, place: "Nile River", city: "Cairo",
        queries: ["Nile river Cairo Egypt", "Nile water Cairo boat", "Nile river bank Egypt"],
        guard: { requirePlace: ["nile"], allowPlaces: ["cairo", "giza"],
                 require: [["river", "water", "boat", "bank", "bridge"]],
                 deny: ["cruise ship", "yacht", "marina", "luxor", "aswan"] } },
    ],
  },
  {
    slug: "is-egypt-safe-for-americans",
    focusKeyword: "is egypt safe for americans",
    keywordSuffix: ", the ordinary scene behind is egypt safe for americans",
    images: [
      { role: "featured", place: "Khan al Khalili", city: "Cairo", keyword: true,
        queries: ["Khan el Khalili market Cairo", "Khan al Khalili bazaar lanterns", "Cairo bazaar stalls Egypt"],
        guard: { requirePlace: ["khan el khalili", "khan al khalili", "khalili"], allowPlaces: ["cairo"],
                 require: [["market", "bazaar", "stall", "stalls", "shop", "shops", "lantern", "lanterns", "lane"]],
                 deny: ["pyramid", "church", "luxor", "aswan", "supermarket"] } },
      { role: "body", afterH2: 4, place: "Luxor Temple", city: "Luxor",
        queries: ["Luxor temple Egypt", "Luxor temple columns", "Luxor temple statues stone"],
        guard: { requirePlace: ["luxor temple"], allowPlaces: ["luxor", "karnak", "thebes"],
                 require: [["column", "columns", "statue", "stone", "illuminated", "lit", "night"]],
                 deny: ["pyramid", "museum", "greece"] } },
      { role: "body", afterH2: 8, place: "Nile at Aswan", city: "Aswan",
        queries: ["Aswan Nile felucca Egypt", "Nile Aswan islands water", "Aswan river sunset Egypt"],
        guard: { requirePlace: ["aswan"], allowPlaces: ["aswan", "nubia", "elephantine"],
                 require: [["nile", "river", "water", "sunset", "island", "islands", "felucca"]],
                 deny: ["temple", "pyramid", "cruise ship", "luxor", "cairo"] } },
    ],
  },
  {
    slug: "egypt-travel-insurance",
    focusKeyword: "egypt travel insurance",
    keywordSuffix: " on the kind of trip egypt travel insurance is bought for",
    images: [
      { role: "featured", place: "Nile at Aswan", city: "Aswan", keyword: true,
        queries: ["Aswan Nile felucca Egypt", "Nile river Aswan Egypt", "Aswan islands Nile water"],
        guard: { requirePlace: ["aswan"], allowPlaces: ["aswan", "nubia", "elephantine"],
                 require: [["nile", "river", "water", "felucca", "sail", "island", "islands"]],
                 deny: ["temple", "pyramid", "cruise ship", "luxor", "cairo"] } },
      { role: "body", afterH2: 4, place: "Theban hills", city: "Luxor",
        queries: ["Theban hills Luxor Egypt", "Luxor west bank cliffs", "desert hills Luxor Egypt"],
        guard: { requirePlace: ["theban", "thebes", "luxor", "valley of the kings"], allowPlaces: ["luxor", "thebes", "theban"],
                 require: [["hill", "hills", "cliff", "cliffs", "desert", "rock", "mountain", "mountains"]],
                 deny: ["pyramid", "cairo", "aswan", "temple", "karnak", "column", "columns"] } },
      { role: "body", afterH2: 8, place: "Red Sea reef", city: "Hurghada",
        queries: ["Red Sea coral reef Egypt", "Red Sea diver underwater Egypt", "Red Sea reef fish Hurghada"],
        guard: { requirePlace: ["red sea"], allowPlaces: ["hurghada", "marsa alam", "sharm", "dahab", "safaga", "sinai"],
                 require: [["reef", "coral", "fish", "underwater", "diver", "diving", "scuba", "snorkel"]],
                 deny: ["aquarium", "tank", "captivity", "zoo", "maldives", "caribbean", "bahamas", "great barrier", "fiji", "swimming pool"] } },
    ],
  },
  {
    slug: "egypt-honeymoon",
    focusKeyword: "egypt honeymoon",
    keywordSuffix: " on an egypt honeymoon",
    images: [
      { role: "featured", place: "Nile River", city: "Luxor", keyword: true,
        queries: ["dahabiya sailing Nile Egypt", "felucca sunset Nile Egypt", "sailing boat Nile river Egypt"],
        guard: { requirePlace: ["nile"], allowPlaces: ["luxor", "aswan", "cairo", "thebes"],
                 require: [["boat", "sail", "sailing", "river", "water", "felucca", "deck"]],
                 deny: ["cruise ship", "yacht", "marina", "motorboat", "ocean", "sea"] } },
      { role: "body", afterH2: 5, place: "Giza Pyramids", city: "Giza",
        queries: ["Giza pyramids at sunrise Egypt", "Great Pyramid Giza Egypt", "pyramids Giza desert sky"],
        guard: { requirePlace: ["giza", "great pyramid"], allowPlaces: ["giza", "cairo", "memphis"],
                 require: [["egypt", "egyptian", "desert", "sand", "sky"]],
                 deny: ["museum", "sudan", "maya", "chichen"] } },
      { role: "body", afterH2: 9, place: "Philae Temple", city: "Aswan",
        queries: ["Philae temple Aswan Egypt", "Philae island temple columns", "Philae temple Egypt water"],
        guard: { requirePlace: ["philae", "agilkia"], allowPlaces: ["aswan", "philae", "agilkia"],
                 require: [["temple", "column", "columns", "island", "pylon", "ruins"]],
                 deny: ["pyramid", "karnak", "luxor", "cairo", "abu simbel"] } },
      { role: "body", afterH2: 12, place: "Red Sea reef", city: "Hurghada",
        queries: ["Red Sea beach Egypt", "Red Sea coral reef Egypt", "Red Sea water Hurghada"],
        guard: { requirePlace: ["red sea"], allowPlaces: ["hurghada", "marsa alam", "sharm", "dahab", "safaga", "sinai"],
                 require: [["reef", "coral", "fish", "underwater", "beach", "coast", "water"]],
                 deny: ["aquarium", "tank", "zoo", "maldives", "caribbean", "bahamas", "great barrier", "fiji", "swimming pool"] } },
    ],
  },
  {
    slug: "egypt-plug-type",
    focusKeyword: "egypt plug type",
    keywordSuffix: " where the egypt plug type matters",
    images: [
      { role: "featured", place: "Old Cairo", city: "Cairo", keyword: true,
        queries: ["old Cairo street Egypt", "Cairo historic lane Egypt", "Cairo old town wall street"],
        guard: { requirePlace: ["cairo"], allowPlaces: ["cairo", "old cairo", "coptic cairo", "islamic cairo"],
                 require: [["street", "alley", "lane", "wall", "stone", "old", "historic"]],
                 deny: ["pyramid", "sphinx", "luxor", "aswan", "alexandria", "skyline", "traffic"] } },
      // The long shot. A description has to name Egypt AND the object, which
      // almost nothing in a stock library does. Finding nothing is correct.
      { role: "body", afterH2: 3, place: "Egypt", city: "Cairo",
        queries: ["power socket Egypt wall", "electrical outlet Egypt hotel", "two round pin plug socket Egypt"],
        guard: { requirePlace: ["egypt", "egyptian"], allowPlaces: ["cairo"],
                 require: [["socket", "outlet", "plug", "adapter", "adaptor", "electrical"]],
                 deny: ["usb hub", "data centre", "data center", "server", "circuit board", "factory", "industrial", "pylon", "power station"] } },
      { role: "body", afterH2: 6, place: "Nile River", city: "Luxor",
        queries: ["Nile river boat Egypt", "felucca Nile Egypt", "Nile water river Egypt"],
        guard: { requirePlace: ["nile"], allowPlaces: ["luxor", "aswan", "cairo", "thebes"],
                 require: [["boat", "sail", "river", "water", "felucca"]],
                 deny: ["cruise ship", "yacht", "marina", "motorboat"] } },
    ],
  },
  {
    slug: "private-pyramid-tours-egypt",
    focusKeyword: "private pyramid tours egypt",
    keywordSuffix: " on private pyramid tours egypt",
    images: [
      { role: "featured", place: "Giza Pyramids", city: "Giza", keyword: true,
        queries: ["Giza pyramids sunrise Egypt", "Great Pyramid Giza empty desert", "pyramids of Giza Egypt morning"],
        guard: { requirePlace: ["giza", "great pyramid"], allowPlaces: ["giza", "cairo", "memphis"],
                 require: [["egypt", "egyptian", "desert", "sand", "sky"]],
                 deny: ["museum", "sudan", "maya", "chichen"] } },
      { role: "body", afterH2: 3, place: "Saqqara", city: "Cairo",
        queries: ["Saqqara step pyramid Egypt", "Saqqara necropolis Egypt", "stepped pyramid Saqqara desert"],
        guard: { requirePlace: ["saqqara", "sakkara", "step pyramid", "stepped pyramid"], allowPlaces: ["saqqara", "sakkara", "cairo", "memphis"],
                 require: [["pyramid", "pyramids", "necropolis", "tomb"]],
                 deny: ["giza", "sphinx", "maya", "chichen"] } },
      { role: "body", afterH2: 6, place: "Bent Pyramid", city: "Dahshur",
        queries: ["Bent Pyramid Dahshur Egypt", "Dahshur pyramid desert Egypt", "Bent Pyramid Egypt sand"],
        guard: { requirePlace: ["dahshur", "bent pyramid"], allowPlaces: ["dahshur", "cairo", "memphis"],
                 require: [["pyramid", "pyramids"]],
                 deny: ["sphinx", "maya", "chichen", "sudan", "museum"] } },
    ],
  },
  {
    slug: "best-luxury-nile-cruise-egypt",
    focusKeyword: "best luxury nile cruise",
    keywordSuffix: " on the best luxury nile cruise route",
    images: [
      { role: "featured", place: "Nile between Aswan and Luxor", city: "Aswan", keyword: true,
        queries: ["dahabiya sailing Nile Egypt", "Nile river bank palms Egypt", "sailing boat Nile Aswan Luxor"],
        guard: { requirePlace: ["nile"], allowPlaces: ["aswan", "luxor", "edfu", "kom ombo"],
                 require: [["river", "boat", "water", "bank", "palm", "sail", "sailing"]],
                 deny: ["temple", "pyramid", "tomb", "cairo", "ocean", "sea"] } },
      { role: "body", afterH2: 4, place: "Kom Ombo", city: "Aswan",
        queries: ["Kom Ombo temple Egypt", "Kom Ombo columns Nile", "Kom Ombo temple ruins Egypt"],
        guard: { requirePlace: ["kom ombo", "ombo"], allowPlaces: ["aswan", "kom ombo"],
                 require: [["temple", "column", "columns", "relief", "carved", "ruins", "hall"]],
                 deny: ["pyramid", "sphinx", "luxor", "karnak", "edfu"] } },
      { role: "body", afterH2: 9, place: "Edfu", city: "Edfu",
        queries: ["Edfu temple Egypt", "Temple of Horus Edfu pylon", "Edfu temple courtyard Egypt"],
        guard: { requirePlace: ["edfu"], allowPlaces: ["edfu", "aswan"],
                 require: [["temple", "pylon", "column", "columns", "falcon", "statue", "courtyard", "wall"]],
                 deny: ["pyramid", "luxor", "karnak", "kom ombo"] } },
      { role: "body", afterH2: 12, place: "Nile at Aswan", city: "Aswan",
        queries: ["Aswan Nile felucca sunset", "Aswan river islands Egypt", "Nile Aswan water Egypt"],
        guard: { requirePlace: ["aswan"], allowPlaces: ["aswan", "nubia", "elephantine"],
                 require: [["felucca", "sail", "sailing", "boat", "sunset", "nile", "river"]],
                 deny: ["pyramid", "cairo", "luxor", "cruise ship"] } },
    ],
  },
  {
    slug: "vaccinations-needed-for-egypt",
    focusKeyword: "vaccinations needed for egypt",
    keywordSuffix: " for a trip that starts with the vaccinations needed for egypt",
    images: [
      { role: "featured", place: "Nile River", city: "Luxor", keyword: true,
        queries: ["Nile river Egypt boat", "felucca sailing Nile Egypt", "Nile water palms Egypt"],
        guard: { requirePlace: ["nile"], allowPlaces: ["luxor", "aswan", "cairo", "thebes"],
                 require: [["boat", "sail", "river", "water", "felucca"]],
                 deny: ["cruise ship", "yacht", "marina", "motorboat"] } },
      { role: "body", afterH2: 4, place: "Khan al Khalili", city: "Cairo",
        queries: ["Khan el Khalili market Cairo", "Cairo bazaar stalls spices", "Khan al Khalili lanterns Cairo"],
        guard: { requirePlace: ["khan el khalili", "khan al khalili", "khalili"], allowPlaces: ["cairo"],
                 require: [["market", "bazaar", "stall", "stalls", "shop", "shops", "lantern", "lanterns", "lane"]],
                 deny: ["pyramid", "church", "luxor", "aswan", "supermarket"] } },
      { role: "body", afterH2: 8, place: "Giza Pyramids", city: "Giza",
        queries: ["Giza pyramids Egypt", "Great Pyramid Giza desert", "pyramids Giza sand sky"],
        guard: { requirePlace: ["giza", "great pyramid"], allowPlaces: ["giza", "cairo", "memphis"],
                 require: [["egypt", "egyptian", "desert", "sand", "sky"]],
                 deny: ["museum", "sudan", "maya", "chichen"] } },
    ],
  },
  {
    slug: "planning-a-trip-to-egypt",
    focusKeyword: "planning a trip to egypt",
    keywordSuffix: " worth planning a trip to egypt around",
    images: [
      { role: "featured", place: "Giza Pyramids", city: "Giza", keyword: true,
        queries: ["Giza pyramids Egypt", "Great Pyramid Giza desert sky", "pyramids of Giza Egypt"],
        guard: { requirePlace: ["giza", "great pyramid"], allowPlaces: ["giza", "cairo", "memphis"],
                 require: [["egypt", "egyptian", "desert", "sand", "sky"]],
                 deny: ["museum", "sudan", "maya", "chichen"] } },
      { role: "body", afterH2: 4, place: "Nile at Aswan", city: "Aswan",
        queries: ["Aswan Nile felucca Egypt", "Nile Aswan islands water", "Aswan river Egypt sunset"],
        guard: { requirePlace: ["aswan"], allowPlaces: ["aswan", "nubia", "elephantine"],
                 require: [["nile", "river", "water", "sunset", "island", "islands", "felucca"]],
                 deny: ["temple", "pyramid", "cruise ship", "luxor", "cairo"] } },
      { role: "body", afterH2: 9, place: "Karnak Temple", city: "Luxor",
        queries: ["Karnak temple columns Luxor", "Karnak hypostyle hall Egypt", "Karnak pillars Luxor Egypt"],
        guard: { requirePlace: ["karnak"], allowPlaces: ["luxor", "karnak", "thebes"],
                 require: [["column", "columns", "hall", "hieroglyph", "stone", "pillar"]],
                 deny: ["greece", "athens", "pyramid", "museum"] } },
      { role: "body", afterH2: 12, place: "Red Sea reef", city: "Hurghada",
        queries: ["Red Sea coral reef Egypt", "Red Sea underwater Egypt", "Red Sea Hurghada water"],
        guard: { requirePlace: ["red sea"], allowPlaces: ["hurghada", "marsa alam", "sharm", "dahab", "safaga", "sinai"],
                 require: [["reef", "coral", "fish", "underwater", "diver", "diving", "coast", "water"]],
                 deny: ["aquarium", "tank", "zoo", "maldives", "caribbean", "bahamas", "great barrier", "fiji", "swimming pool"] } },
    ],
  },
  {
    slug: "egypt-travel-tips",
    focusKeyword: "egypt travel tips",
    keywordSuffix: " behind the practical egypt travel tips",
    images: [
      { role: "featured", place: "Khan al Khalili", city: "Cairo", keyword: true,
        queries: ["Khan el Khalili market Cairo", "Cairo bazaar stalls Egypt", "Khan al Khalili lanterns lane"],
        guard: { requirePlace: ["khan el khalili", "khan al khalili", "khalili"], allowPlaces: ["cairo"],
                 require: [["market", "bazaar", "stall", "stalls", "shop", "shops", "lantern", "lanterns", "lane"]],
                 deny: ["pyramid", "church", "luxor", "aswan", "supermarket"] } },
      { role: "body", afterH2: 4, place: "Islamic Cairo", city: "Cairo",
        queries: ["Islamic Cairo street minarets", "Al Muizz street Cairo Egypt", "Cairo medieval mosque street"],
        guard: { requirePlace: ["islamic cairo", "muizz", "moez"], allowPlaces: ["cairo"],
                 require: [["street", "minaret", "minarets", "mosque", "dome", "domes", "facade", "gate"]],
                 deny: ["pyramid", "sphinx", "church", "luxor", "aswan", "alexandria"] } },
      { role: "body", afterH2: 9, place: "Nile River", city: "Luxor",
        queries: ["Nile river boat Egypt", "felucca Nile Egypt water", "Nile river palms Egypt"],
        guard: { requirePlace: ["nile"], allowPlaces: ["luxor", "aswan", "cairo", "thebes"],
                 require: [["boat", "sail", "river", "water", "felucca"]],
                 deny: ["cruise ship", "yacht", "marina", "motorboat"] } },
      { role: "body", afterH2: 14, place: "Luxor Temple", city: "Luxor",
        queries: ["Luxor temple Egypt night", "Luxor temple columns illuminated", "Luxor temple statue stone"],
        guard: { requirePlace: ["luxor temple"], allowPlaces: ["luxor", "karnak", "thebes"],
                 require: [["column", "columns", "statue", "stone", "illuminated", "lit", "night"]],
                 deny: ["pyramid", "museum", "greece"] } },
    ],
  },
  {
    slug: "what-to-pack-for-egypt",
    focusKeyword: "what to pack for egypt",
    keywordSuffix: " that decides what to pack for egypt",
    images: [
      { role: "featured", place: "Giza Pyramids", city: "Giza", keyword: true,
        queries: ["Giza pyramids sand Egypt", "Great Pyramid Giza desert ground", "pyramids Giza Egypt sand sky"],
        guard: { requirePlace: ["giza", "great pyramid"], allowPlaces: ["giza", "cairo", "memphis"],
                 require: [["egypt", "egyptian", "desert", "sand", "sky"]],
                 deny: ["museum", "sudan", "maya", "chichen"] } },
      { role: "body", afterH2: 4, place: "Theban hills", city: "Luxor",
        queries: ["Theban hills Luxor Egypt", "Luxor west bank cliffs desert", "rocky hills Luxor Egypt"],
        guard: { requirePlace: ["theban", "thebes", "luxor", "valley of the kings"], allowPlaces: ["luxor", "thebes", "theban"],
                 require: [["hill", "hills", "cliff", "cliffs", "desert", "rock", "mountain", "mountains"]],
                 deny: ["pyramid", "cairo", "aswan", "temple", "karnak", "column", "columns"] } },
      { role: "body", afterH2: 8, place: "White Desert", city: "Farafra",
        queries: ["White Desert Egypt chalk formations", "White Desert Farafra rock Egypt", "chalk outcrops White Desert Egypt"],
        guard: { requirePlace: ["white desert", "farafra"], allowPlaces: ["white desert", "farafra", "bahariya"],
                 require: [["chalk", "limestone", "formation", "formations", "rock", "outcrop", "desert", "sand"]],
                 deny: ["antarctic", "antarctica", "arctic", "greenland", "patagonia", "namib", "sossusvlei", "white sands", "new mexico", "atacama", "gobi", "mojave", "snow", "ice", "glacier", "salt flat", "salar"] } },
      { role: "body", afterH2: 11, place: "Nile at Aswan", city: "Aswan",
        queries: ["Aswan Nile felucca sunset Egypt", "Nile Aswan evening water", "Aswan river boat Egypt"],
        guard: { requirePlace: ["aswan"], allowPlaces: ["aswan", "nubia", "elephantine"],
                 require: [["felucca", "sail", "sailing", "boat", "sunset", "nile", "river"]],
                 deny: ["pyramid", "cairo", "luxor", "cruise ship"] } },
    ],
  },
  {
    slug: "private-tours-in-cairo-egypt",
    focusKeyword: "private tours in cairo egypt",
    keywordSuffix: " on private tours in cairo egypt",
    images: [
      { role: "featured", place: "Giza Pyramids", city: "Giza", keyword: true,
        queries: ["Giza pyramids Egypt", "Great Pyramid Giza desert", "pyramids Giza Cairo Egypt"],
        guard: { requirePlace: ["giza", "great pyramid"], allowPlaces: ["giza", "cairo", "memphis"],
                 require: [["egypt", "egyptian", "desert", "sand", "sky"]],
                 deny: ["museum", "sudan", "maya", "chichen"] } },
      { role: "body", afterH2: 3, place: "Saqqara", city: "Cairo",
        queries: ["Saqqara step pyramid Egypt", "Saqqara necropolis desert Egypt", "stepped pyramid Saqqara"],
        guard: { requirePlace: ["saqqara", "sakkara", "step pyramid", "stepped pyramid"], allowPlaces: ["saqqara", "sakkara", "cairo", "memphis"],
                 require: [["pyramid", "pyramids", "necropolis", "tomb"]],
                 deny: ["giza", "sphinx", "maya", "chichen"] } },
      { role: "body", afterH2: 6, place: "Islamic Cairo", city: "Cairo",
        queries: ["Islamic Cairo minarets street", "Al Muizz street Cairo", "Cairo mosque dome facade"],
        guard: { requirePlace: ["islamic cairo", "muizz", "moez"], allowPlaces: ["cairo"],
                 require: [["street", "minaret", "minarets", "mosque", "dome", "domes", "facade", "gate"]],
                 deny: ["pyramid", "sphinx", "church", "luxor", "aswan", "alexandria"] } },
      { role: "body", afterH2: 10, place: "Coptic Cairo", city: "Cairo",
        queries: ["Coptic Cairo church Egypt", "Hanging Church Cairo facade", "Coptic Cairo chapel interior"],
        guard: { requirePlace: ["coptic cairo", "old cairo", "cairo"], allowPlaces: ["cairo"],
                 require: [["church", "cross", "tower", "towers", "facade", "chapel", "basilica"]],
                 deny: ["pyramid", "sphinx", "mosque", "minaret", "luxor", "alexandria"] } },
    ],
  },
  {
    slug: "tailor-made-egypt-tours",
    focusKeyword: "tailor-made egypt tours",
    keywordSuffix: " on tailor-made egypt tours",
    images: [
      { role: "featured", place: "Nile between Aswan and Luxor", city: "Aswan", keyword: true,
        queries: ["Nile river bank palms Egypt", "dahabiya sailing Nile Egypt", "Nile river water Egypt boat"],
        guard: { requirePlace: ["nile"], allowPlaces: ["aswan", "luxor", "edfu", "kom ombo"],
                 require: [["river", "boat", "water", "bank", "palm", "sail", "sailing"]],
                 deny: ["temple", "pyramid", "tomb", "cairo", "ocean", "sea"] } },
      { role: "body", afterH2: 4, place: "Karnak Temple", city: "Luxor",
        queries: ["Karnak temple columns Luxor", "Karnak hypostyle hall Egypt", "Karnak stone pillars Egypt"],
        guard: { requirePlace: ["karnak"], allowPlaces: ["luxor", "karnak", "thebes"],
                 require: [["column", "columns", "hall", "hieroglyph", "stone", "pillar"]],
                 deny: ["greece", "athens", "pyramid", "museum"] } },
      { role: "body", afterH2: 9, place: "Abu Simbel", city: "Aswan",
        queries: ["Abu Simbel temple Egypt", "Abu Simbel colossi facade", "Abu Simbel Nubia rock temple"],
        guard: { requirePlace: ["simbel"], allowPlaces: ["abu simbel", "aswan", "nubia"],
                 require: [["temple", "statue", "statues", "colossi", "facade", "rock"]],
                 deny: ["pyramid", "sphinx", "car", "vehicle"] } },
      { role: "body", afterH2: 13, place: "Giza Pyramids", city: "Giza",
        queries: ["Giza pyramids Egypt", "Great Pyramid Giza desert sky", "pyramids Giza sand Egypt"],
        guard: { requirePlace: ["giza", "great pyramid"], allowPlaces: ["giza", "cairo", "memphis"],
                 require: [["egypt", "egyptian", "desert", "sand", "sky"]],
                 deny: ["museum", "sudan", "maya", "chichen"] } },
    ],
  },
  {
    slug: "currency-in-egypt",
    focusKeyword: "currency in egypt",
    keywordSuffix: ", the currency in egypt",
    images: [
      // The other long shot. "Egyptian pound banknotes" is a real stock
      // subject, but the description has to say Egypt as well as money or the
      // guard cannot tell it from any other country's notes, and it should not
      // try to.
      { role: "featured", place: "Egypt", city: "Cairo", keyword: true,
        queries: ["Egyptian pound banknotes", "Egypt currency notes money", "Egyptian pound cash notes"],
        guard: { requirePlace: ["egypt", "egyptian"], allowPlaces: ["cairo"],
                 require: [["banknote", "banknotes", "currency", "money", "cash", "pound", "pounds", "piastre"]],
                 deny: ["dollar", "euro", "sterling", "dirham", "riyal", "lira", "rupee", "bitcoin", "crypto", "credit card", "stock market", "chart"] } },
      { role: "body", afterH2: 4, place: "Khan al Khalili", city: "Cairo",
        queries: ["Khan el Khalili market Cairo stalls", "Cairo bazaar shop Egypt", "Khan al Khalili lane lanterns"],
        guard: { requirePlace: ["khan el khalili", "khan al khalili", "khalili"], allowPlaces: ["cairo"],
                 require: [["market", "bazaar", "stall", "stalls", "shop", "shops", "lantern", "lanterns", "lane"]],
                 deny: ["pyramid", "church", "luxor", "aswan", "supermarket"] } },
      { role: "body", afterH2: 8, place: "Old Cairo", city: "Cairo",
        queries: ["old Cairo street Egypt", "historic Cairo lane wall", "Cairo old town street Egypt"],
        guard: { requirePlace: ["cairo"], allowPlaces: ["cairo", "old cairo", "coptic cairo", "islamic cairo"],
                 require: [["street", "alley", "lane", "wall", "stone", "old", "historic"]],
                 deny: ["pyramid", "sphinx", "luxor", "aswan", "alexandria", "skyline", "traffic"] } },
    ],
  },

  // -------------------------------------------------------------------------
  // The Nile cluster
  // -------------------------------------------------------------------------
  // Every one of these is about the river, so the guards lean on the places
  // along it rather than on the word "cruise", which describes a subject and
  // would confirm a photograph of a ship anywhere in the world.
  {
    slug: "dahabiya-nile-cruise",
    focusKeyword: "dahabiya nile cruise",
    keywordSuffix: " on a dahabiya nile cruise",
    images: [
      { role: "featured", place: "Nile River", city: "Aswan", keyword: true,
        queries: ["dahabiya sailing boat Nile Egypt", "traditional sailing boat Nile Aswan", "lateen sail boat Nile river Egypt"],
        guard: { requirePlace: ["nile"], allowPlaces: ["aswan", "luxor", "edfu", "kom ombo", "esna"],
                 require: [["sail", "sailing", "boat", "felucca", "dahabiya", "deck", "mast"]],
                 deny: ["ocean", "sea", "maldives", "caribbean", "yacht", "marina", "cruise ship", "cairo"] } },
      { role: "body", afterH2: 4, place: "Nile between Aswan and Luxor", city: "Aswan",
        queries: ["Nile river bank palms Egypt", "Nile riverbank village Egypt", "Nile water palm trees Egypt"],
        guard: { requirePlace: ["nile"], allowPlaces: ["aswan", "luxor", "edfu", "kom ombo"],
                 require: [["river", "bank", "palm", "water", "green", "field"]],
                 deny: ["temple", "pyramid", "tomb", "cairo", "ocean", "sea"] } },
      { role: "body", afterH2: 8, place: "Kom Ombo", city: "Aswan",
        queries: ["Kom Ombo temple Egypt river", "Kom Ombo columns Nile", "Kom Ombo temple ruins Egypt"],
        guard: { requirePlace: ["kom ombo", "ombo"], allowPlaces: ["aswan", "kom ombo"],
                 require: [["temple", "column", "columns", "relief", "carved", "ruins", "hall"]],
                 deny: ["pyramid", "sphinx", "luxor", "karnak", "edfu"] } },
      { role: "body", afterH2: 12, place: "Nile at Aswan", city: "Aswan",
        queries: ["Aswan Nile felucca sunset Egypt", "Aswan river islands Egypt", "Nile Aswan evening water"],
        guard: { requirePlace: ["aswan"], allowPlaces: ["aswan", "nubia", "elephantine"],
                 require: [["felucca", "sail", "sailing", "boat", "sunset", "nile", "river"]],
                 deny: ["pyramid", "cairo", "luxor", "cruise ship"] } },
    ],
  },
  {
    slug: "nile-cruise-luxor-to-aswan",
    focusKeyword: "nile cruise luxor to aswan",
    keywordSuffix: " on the nile cruise luxor to aswan route",
    images: [
      { role: "featured", place: "Nile between Aswan and Luxor", city: "Luxor", keyword: true,
        queries: ["Nile river between Luxor and Aswan", "Nile riverbank Egypt boat", "Nile water palms Egypt"],
        guard: { requirePlace: ["nile"], allowPlaces: ["aswan", "luxor", "edfu", "kom ombo", "esna"],
                 require: [["river", "boat", "water", "bank", "palm", "sail"]],
                 deny: ["temple", "pyramid", "tomb", "cairo", "ocean", "sea"] } },
      { role: "body", afterH2: 3, place: "Edfu", city: "Edfu",
        queries: ["Edfu temple Egypt", "Temple of Horus Edfu pylon", "Edfu temple courtyard Egypt"],
        guard: { requirePlace: ["edfu"], allowPlaces: ["edfu", "aswan"],
                 require: [["temple", "pylon", "column", "columns", "falcon", "statue", "courtyard", "wall"]],
                 deny: ["pyramid", "luxor", "karnak", "kom ombo"] } },
      { role: "body", afterH2: 7, place: "Kom Ombo", city: "Aswan",
        queries: ["Kom Ombo temple Egypt", "Kom Ombo relief carving", "Kom Ombo columns Egypt"],
        guard: { requirePlace: ["kom ombo", "ombo"], allowPlaces: ["aswan", "kom ombo"],
                 require: [["relief", "carving", "carved", "hieroglyph", "hieroglyphs", "wall", "column", "columns", "temple"]],
                 deny: ["pyramid", "luxor", "karnak", "edfu"] } },
      { role: "body", afterH2: 10, place: "Karnak Temple", city: "Luxor",
        queries: ["Karnak temple columns Luxor", "Karnak hypostyle hall Egypt", "Karnak pillars Egypt"],
        guard: { requirePlace: ["karnak"], allowPlaces: ["luxor", "karnak", "thebes"],
                 require: [["column", "columns", "hall", "hieroglyph", "stone", "pillar"]],
                 deny: ["greece", "athens", "pyramid", "museum"] } },
    ],
  },
  {
    slug: "7-night-nile-cruise",
    focusKeyword: "7 night nile cruise",
    keywordSuffix: " across a 7 night nile cruise",
    images: [
      { role: "featured", place: "Nile between Aswan and Luxor", city: "Luxor", keyword: true,
        queries: ["Nile river boat dawn Egypt", "Nile riverbank morning Egypt", "Nile water boat palms Egypt"],
        guard: { requirePlace: ["nile"], allowPlaces: ["aswan", "luxor", "edfu", "kom ombo"],
                 require: [["river", "boat", "water", "bank", "palm", "sail", "morning", "dawn"]],
                 deny: ["temple", "pyramid", "tomb", "cairo", "ocean", "sea"] } },
      { role: "body", afterH2: 3, place: "Dendera", city: "Qena",
        queries: ["Dendera temple ceiling Egypt", "Dendera Hathor temple columns", "Dendera painted ceiling Egypt"],
        guard: { requirePlace: ["dendera", "denderah"], allowPlaces: ["qena", "dendera"],
                 require: [["ceiling", "painted", "paint", "colour", "color", "astronomical", "zodiac", "relief", "column", "columns"]],
                 deny: ["pyramid", "luxor", "karnak", "abydos"] } },
      { role: "body", afterH2: 6, place: "Abydos", city: "Sohag",
        queries: ["Abydos temple relief Egypt", "Seti I temple Abydos carving", "Abydos hieroglyphs Egypt"],
        guard: { requirePlace: ["abydos"], allowPlaces: ["abydos", "sohag"],
                 require: [["temple", "relief", "carving", "carved", "hieroglyph", "hieroglyphs", "wall", "column", "columns"]],
                 deny: ["pyramid", "luxor", "karnak", "dendera"] } },
    ],
  },
  {
    slug: "lake-nasser-cruise",
    focusKeyword: "lake nasser cruise",
    keywordSuffix: " seen from a lake nasser cruise",
    images: [
      { role: "featured", place: "Lake Nasser", city: "Aswan", keyword: true,
        queries: ["Lake Nasser Egypt water", "Lake Nasser Aswan reservoir Egypt", "Lake Nasser Nubia shore Egypt"],
        guard: { requirePlace: ["nasser"], allowPlaces: ["aswan", "abu simbel", "nubia"],
                 require: [["lake", "water", "reservoir", "shore"]],
                 deny: ["yacht", "marina", "cruise ship", "qarun", "victoria", "nasser square"] } },
      { role: "body", afterH2: 3, place: "Abu Simbel", city: "Aswan",
        queries: ["Abu Simbel temple Egypt", "Abu Simbel colossi facade", "Abu Simbel Nubia rock temple"],
        guard: { requirePlace: ["simbel"], allowPlaces: ["abu simbel", "aswan", "nubia"],
                 require: [["temple", "statue", "statues", "colossi", "facade", "rock"]],
                 deny: ["pyramid", "sphinx", "car", "vehicle"] } },
      { role: "body", afterH2: 8, place: "Lake Nasser", city: "Aswan",
        queries: ["Lake Nasser shoreline Egypt", "Lake Nasser desert water Egypt", "Lake Nasser Nubia landscape"],
        guard: { requirePlace: ["nasser"], allowPlaces: ["aswan", "abu simbel", "nubia"],
                 require: [["lake", "water", "shore", "desert", "rock", "landscape"]],
                 deny: ["yacht", "marina", "cruise ship", "qarun", "victoria", "city"] } },
    ],
  },
  {
    slug: "best-time-to-go-to-egypt-nile-cruise",
    focusKeyword: "best time to go to egypt nile cruise",
    keywordSuffix: " in the months that are the best time to go to egypt nile cruise",
    images: [
      { role: "featured", place: "Nile at Aswan", city: "Aswan", keyword: true,
        queries: ["Aswan Nile winter light Egypt", "Nile Aswan felucca sunset", "Aswan river islands Egypt"],
        guard: { requirePlace: ["aswan"], allowPlaces: ["aswan", "nubia", "elephantine"],
                 require: [["nile", "river", "water", "sunset", "island", "islands", "felucca", "sail"]],
                 deny: ["temple", "pyramid", "cruise ship", "luxor", "cairo"] } },
      { role: "body", afterH2: 4, place: "Nile between Aswan and Luxor", city: "Luxor",
        queries: ["Nile river bank Egypt winter", "Nile riverbank palms Egypt", "Nile water green fields Egypt"],
        guard: { requirePlace: ["nile"], allowPlaces: ["aswan", "luxor", "edfu", "kom ombo"],
                 require: [["river", "bank", "palm", "water", "green", "field"]],
                 deny: ["temple", "pyramid", "tomb", "cairo", "ocean", "sea"] } },
      { role: "body", afterH2: 9, place: "Theban hills", city: "Luxor",
        queries: ["Theban hills Luxor Egypt", "Luxor west bank cliffs desert", "rocky hills Luxor Egypt"],
        guard: { requirePlace: ["theban", "thebes", "luxor", "valley of the kings"], allowPlaces: ["luxor", "thebes", "theban"],
                 require: [["hill", "hills", "cliff", "cliffs", "desert", "rock", "mountain", "mountains"]],
                 deny: ["pyramid", "cairo", "aswan", "temple", "karnak", "column", "columns"] } },
    ],
  },

  // -------------------------------------------------------------------------
  // The hotels cluster
  // -------------------------------------------------------------------------
  // The hard case in this whole file. A photograph of a hotel interior is
  // interchangeable: a marble lobby in Cairo and a marble lobby in Dubai are
  // the same picture, and a guard that asks for "hotel" plus "luxury" would
  // accept either. So none of these guards asks for a hotel at all. Each one
  // requires the PLACE the article is about and something outdoors that ties
  // the frame to it, and every one of them denies the generic interior
  // vocabulary outright. An empty position is the right outcome here; a
  // Dubai lobby captioned as Cairo is not.
  {
    slug: "where-to-stay-in-cairo",
    focusKeyword: "where to stay in cairo",
    keywordSuffix: " when deciding where to stay in cairo",
    images: [
      { role: "featured", place: "Nile River", city: "Cairo", keyword: true,
        queries: ["Nile river Cairo corniche evening", "Cairo Nile waterfront Egypt", "Nile Cairo bridge river Egypt"],
        guard: { requirePlace: ["nile"], allowPlaces: ["cairo", "giza"],
                 require: [["river", "water", "corniche", "bridge", "bank", "boat"]],
                 deny: ["lobby", "suite", "bedroom", "interior", "reception", "spa", "buffet", "luxor", "aswan", "dubai", "abu dhabi", "doha", "istanbul"] } },
      { role: "body", afterH2: 4, place: "Old Cairo", city: "Cairo",
        queries: ["old Cairo street Egypt", "historic Cairo lane Egypt", "Cairo old town street"],
        guard: { requirePlace: ["cairo"], allowPlaces: ["cairo", "old cairo", "coptic cairo", "islamic cairo"],
                 require: [["street", "alley", "lane", "wall", "stone", "old", "historic"]],
                 deny: ["pyramid", "sphinx", "luxor", "aswan", "alexandria", "skyline", "traffic", "lobby", "suite", "interior"] } },
      { role: "body", afterH2: 8, place: "Giza Pyramids", city: "Giza",
        queries: ["Giza pyramids Egypt", "Great Pyramid Giza desert", "pyramids Giza sand sky"],
        guard: { requirePlace: ["giza", "great pyramid"], allowPlaces: ["giza", "cairo", "memphis"],
                 require: [["egypt", "egyptian", "desert", "sand", "sky"]],
                 deny: ["museum", "sudan", "maya", "chichen", "lobby", "interior", "model"] } },
    ],
  },
  {
    slug: "luxury-hotels-cairo",
    focusKeyword: "luxury hotels cairo",
    keywordSuffix: " above the river near the luxury hotels cairo keeps on the corniche",
    images: [
      { role: "featured", place: "Nile River", city: "Cairo", keyword: true,
        queries: ["Nile Cairo corniche at dusk", "Cairo river waterfront evening Egypt", "Nile Cairo skyline water"],
        guard: { requirePlace: ["nile"], allowPlaces: ["cairo", "giza", "zamalek", "gezira"],
                 require: [["river", "water", "corniche", "bank", "bridge", "dusk", "evening"]],
                 deny: ["lobby", "suite", "bedroom", "interior", "reception", "spa", "buffet", "ballroom", "luxor", "aswan", "dubai", "abu dhabi", "doha", "beirut"] } },
      { role: "body", afterH2: 5, place: "Islamic Cairo", city: "Cairo",
        queries: ["Islamic Cairo minarets street", "Al Muizz street Cairo", "Cairo mosque dome facade"],
        guard: { requirePlace: ["islamic cairo", "muizz", "moez"], allowPlaces: ["cairo"],
                 require: [["street", "minaret", "minarets", "mosque", "dome", "domes", "facade", "gate"]],
                 deny: ["pyramid", "church", "luxor", "aswan", "alexandria", "lobby", "interior", "hotel room"] } },
      { role: "body", afterH2: 10, place: "Old Cairo", city: "Cairo",
        queries: ["old Cairo lane Egypt", "Cairo historic street wall", "Cairo old town Egypt"],
        guard: { requirePlace: ["cairo"], allowPlaces: ["cairo", "old cairo", "coptic cairo", "islamic cairo"],
                 require: [["street", "alley", "lane", "wall", "stone", "old", "historic"]],
                 deny: ["pyramid", "sphinx", "luxor", "aswan", "skyline", "traffic", "lobby", "suite", "interior"] } },
    ],
  },
  {
    slug: "cairo-hotel-with-pyramid-view",
    focusKeyword: "cairo hotel with pyramid view",
    keywordSuffix: " of the kind a cairo hotel with pyramid view looks out on",
    images: [
      { role: "featured", place: "Giza Pyramids", city: "Giza", keyword: true,
        queries: ["Giza pyramids at dusk Egypt", "Great Pyramid Giza golden light", "pyramids Giza evening sky Egypt"],
        guard: { requirePlace: ["giza", "great pyramid"], allowPlaces: ["giza", "cairo", "memphis"],
                 require: [["egypt", "egyptian", "desert", "sand", "sky", "sunset", "dusk"]],
                 deny: ["museum", "sudan", "maya", "chichen", "model", "lobby", "interior", "pool", "resort"] } },
      { role: "body", afterH2: 4, place: "Giza Pyramids", city: "Giza",
        queries: ["Sphinx and pyramid Giza Egypt", "Great Sphinx Giza plateau", "Sphinx Giza Egypt stone"],
        guard: { requirePlace: ["giza", "sphinx", "great pyramid"], allowPlaces: ["giza", "cairo", "memphis"],
                 require: [["sphinx", "pyramid", "pyramids", "stone", "limestone", "plateau"]],
                 deny: ["museum", "replica", "model", "las vegas", "luxor hotel", "sudan", "lobby", "interior"] } },
      { role: "body", afterH2: 9, place: "Giza Pyramids", city: "Giza",
        queries: ["Giza plateau desert sand Egypt", "pyramids desert edge Egypt", "Giza pyramids from a distance"],
        guard: { requirePlace: ["giza", "great pyramid"], allowPlaces: ["giza", "cairo", "memphis"],
                 require: [["desert", "sand", "plateau", "sky", "egypt", "egyptian"]],
                 deny: ["museum", "model", "sudan", "maya", "chichen", "lobby", "interior", "pool"] } },
    ],
  },
  {
    slug: "best-hotels-in-luxor-egypt",
    focusKeyword: "best hotels in luxor egypt",
    keywordSuffix: " on the river the best hotels in luxor egypt look over",
    images: [
      { role: "featured", place: "Nile River", city: "Luxor", keyword: true,
        queries: ["Nile river Luxor corniche Egypt", "Luxor waterfront Nile feluccas", "Nile at Luxor water Egypt"],
        // "luxor" as well as "nile", because a photograph captioned "the
        // corniche at Luxor" is exactly this position and many are. The Las
        // Vegas casino of the same name is the reason this would normally be
        // risky, and it is denied outright below.
        guard: { requirePlace: ["nile", "luxor"], allowPlaces: ["luxor", "thebes", "theban"],
                 require: [["river", "water", "felucca", "boat", "bank", "corniche"]],
                 deny: ["cairo", "aswan", "ocean", "sea", "lobby", "suite", "bedroom", "interior", "reception", "las vegas", "luxor hotel"] } },
      { role: "body", afterH2: 3, place: "Karnak Temple", city: "Luxor",
        queries: ["Karnak temple columns Luxor", "Karnak hypostyle hall Egypt", "Karnak pillars Egypt"],
        guard: { requirePlace: ["karnak"], allowPlaces: ["luxor", "karnak", "thebes"],
                 require: [["column", "columns", "hall", "hieroglyph", "stone", "pillar"]],
                 deny: ["greece", "athens", "pyramid", "museum", "las vegas", "casino", "lobby", "interior"] } },
      { role: "body", afterH2: 8, place: "Theban hills", city: "Luxor",
        queries: ["Theban hills Luxor west bank", "Luxor west bank cliffs desert", "rocky hills Luxor Egypt"],
        guard: { requirePlace: ["theban", "thebes", "luxor", "valley of the kings"], allowPlaces: ["luxor", "thebes", "theban"],
                 require: [["hill", "hills", "cliff", "cliffs", "desert", "rock", "mountain", "mountains"]],
                 deny: ["pyramid", "cairo", "aswan", "temple", "karnak", "column", "columns", "las vegas", "lobby", "interior"] } },
    ],
  },
  {
    slug: "best-hotels-in-aswan",
    focusKeyword: "best hotels in aswan",
    keywordSuffix: " on the water the best hotels in aswan face",
    images: [
      { role: "featured", place: "Nile at Aswan", city: "Aswan", keyword: true,
        queries: ["Aswan Nile felucca sunset Egypt", "Aswan river islands granite Egypt", "Nile Aswan water evening"],
        guard: { requirePlace: ["aswan"], allowPlaces: ["aswan", "nubia", "elephantine"],
                 require: [["felucca", "sail", "sailing", "boat", "sunset", "nile", "river", "island", "islands"]],
                 deny: ["pyramid", "cairo", "luxor", "cruise ship", "lobby", "suite", "bedroom", "interior", "reception", "buffet"] } },
      { role: "body", afterH2: 5, place: "Philae Temple", city: "Aswan",
        queries: ["Philae temple Aswan Egypt", "Philae island temple columns", "Philae temple water Egypt"],
        guard: { requirePlace: ["philae", "agilkia"], allowPlaces: ["aswan", "philae", "agilkia"],
                 require: [["temple", "column", "columns", "island", "pylon", "ruins"]],
                 deny: ["pyramid", "karnak", "luxor", "cairo", "abu simbel", "lobby", "interior"] } },
      { role: "body", afterH2: 10, place: "Nubian village", city: "Aswan",
        queries: ["Nubian village Aswan painted houses", "Nubian house blue wall Aswan", "Nubian village colourful Egypt"],
        guard: { requirePlace: ["nubian", "nubia"], allowPlaces: ["aswan", "nubia"],
                 require: [["village", "house", "houses", "wall", "walls", "street", "painted", "colourful", "colorful"]],
                 deny: ["temple", "pyramid", "tomb", "museum", "abu simbel", "luxor", "lobby", "interior", "resort"] } },
    ],
  },
  {
    slug: "5-star-hotels-in-egypt",
    focusKeyword: "5 star hotels in egypt",
    keywordSuffix: " in the country where 5 star hotels in egypt are licensed rather than reviewed",
    images: [
      { role: "featured", place: "Nile River", city: "Cairo", keyword: true,
        queries: ["Nile river Cairo evening Egypt", "Cairo corniche water dusk", "Nile Cairo waterfront Egypt"],
        guard: { requirePlace: ["nile"], allowPlaces: ["cairo", "giza", "luxor", "aswan"],
                 require: [["river", "water", "corniche", "bank", "bridge", "boat"]],
                 deny: ["lobby", "suite", "bedroom", "interior", "reception", "spa", "buffet", "ballroom", "dubai", "abu dhabi", "doha", "istanbul", "maldives"] } },
      { role: "body", afterH2: 4, place: "Nile at Aswan", city: "Aswan",
        queries: ["Aswan Nile islands water Egypt", "Nile Aswan felucca river", "Aswan river granite Egypt"],
        guard: { requirePlace: ["aswan"], allowPlaces: ["aswan", "nubia", "elephantine"],
                 require: [["nile", "river", "water", "island", "islands", "felucca", "sail"]],
                 deny: ["temple", "pyramid", "cruise ship", "luxor", "cairo", "lobby", "interior", "resort"] } },
      { role: "body", afterH2: 8, place: "Red Sea reef", city: "Hurghada",
        queries: ["Red Sea coast Egypt water", "Red Sea coral reef Egypt", "Red Sea shoreline Hurghada"],
        guard: { requirePlace: ["red sea"], allowPlaces: ["hurghada", "marsa alam", "sharm", "dahab", "safaga", "sinai"],
                 require: [["reef", "coral", "fish", "underwater", "coast", "water", "beach"]],
                 deny: ["aquarium", "tank", "zoo", "maldives", "caribbean", "bahamas", "great barrier", "fiji", "swimming pool", "lobby", "interior"] } },
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
