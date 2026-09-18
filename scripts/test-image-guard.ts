// Regression checks for the two halves of image selection.
//
// A. checkRelevance must keep rejecting the four photographs that reached
//    production showing the wrong place. Loosening the alt composer must never
//    loosen these, so they are asserted here rather than trusted.
// B. composeAlt must accept the correct photographs that the old eight word
//    floor threw away, and must still refuse a description that confirms
//    nothing.
//
//   npx tsx scripts/test-image-guard.ts

import { checkRelevance, composeAlt, hasToken, type Guard } from "./lib/provider-images";

let fails = 0;
const ok = (label: string, cond: boolean, detail = "") => {
  if (!cond) fails++;
  console.log(`${cond ? "PASS" : "FAIL"}  ${label}${detail ? "  " + detail : ""}`);
};

// ---------------------------------------------------------------------------
// A. The four that were wrong in production, with their real descriptions.
// ---------------------------------------------------------------------------
const lakeNasser: Guard = { requirePlace: ["nasser"], allowPlaces: ["aswan", "abu simbel", "nubia"],
  require: [["lake", "water", "reservoir", "shore"]], deny: ["yacht", "marina", "cruise ship"] };
const westernDesert: Guard = { requirePlace: ["desert", "sahara", "dune", "dunes"],
  allowPlaces: ["aswan", "siwa", "bahariya", "farafra"], require: [["egypt", "egyptian", "sahara"]],
  deny: ["car", "vehicle", "automobile", "truck", "jeep", "peugeot", "motorcycle", "bus", "road", "pyramid", "city"] };
const thebanHills: Guard = { requirePlace: ["hill", "hills", "cliff", "cliffs", "valley", "mountain", "desert"],
  allowPlaces: ["luxor", "thebes", "theban"], require: [["egypt", "egyptian", "desert", "rock", "sand"]],
  deny: ["temple", "karnak", "column", "columns", "hypostyle", "pylon", "statue", "obelisk", "pyramid"] };
const saqqaraRelief: Guard = { requirePlace: ["saqqara", "sakkara", "mastaba", "serapeum"],
  allowPlaces: ["saqqara", "sakkara", "cairo", "memphis"],
  require: [["relief", "carving", "carved", "hieroglyph", "tomb", "wall"]], deny: ["museum replica", "greece", "rome", "giza"] };

console.log("A. The four wrong photographs must stay rejected\n");
for (const [label, desc, guard] of [
  ["Lake Qarun for Lake Nasser", "Lake Qarun, Faiyum, Egypt", lakeNasser],
  ["a Peugeot for the Western Desert", "classic Peugeot car parked on a desert road in Egypt", westernDesert],
  ["Luxor Temple for the Theban hills", "Luxor Temple columns in Luxor, Egypt", thebanHills],
  ["a Luxor relief for Saqqara", "ancient carved relief from Luxor, Egypt", saqqaraRelief],
] as Array<[string, string, Guard]>) {
  const v = checkRelevance(desc, guard);
  ok(label, !v.ok, v.ok ? "WRONGLY ACCEPTED" : `(${v.reason})`);
}

// The contradiction rule specifically: place confirmed, other city named.
const c = checkRelevance("carved tomb relief at Saqqara, similar to those from Luxor", saqqaraRelief);
ok("a description naming Saqqara AND Luxor", !c.ok, `(${c.reason})`);

// And the correct photographs still pass the guard.
console.log("\nThe matching correct photographs still pass\n");
for (const [label, desc, guard] of [
  ["Lake Nasser", "Lake Nasser seen from the shore near Abu Simbel in Egypt", lakeNasser],
  ["Western Desert", "rippled sand dunes in the Western Desert of Egypt at sunset", westernDesert],
  ["Theban hills", "Desolate desert scene with rocky ground in Luxor, Egypt", thebanHills],
  ["Saqqara relief", "carved mastaba tomb reliefs at Saqqara, Egypt", saqqaraRelief],
] as Array<[string, string, Guard]>) {
  const v = checkRelevance(desc, guard);
  ok(label, v.ok, v.ok ? "" : `WRONGLY REJECTED (${v.reason})`);
}

// ---------------------------------------------------------------------------
// B. The five correct photographs the alt composer used to throw away.
// ---------------------------------------------------------------------------
console.log("\nB. Correct photographs the eight word floor used to reject\n");
for (const [label, desc, place, city, suffix] of [
  ["valley of kings hero", "tomb paintings in Luxor's Valley of the Kings", "Valley of the Kings", "Luxor", ", among the tombs in the valley of kings"],
  ["luxor after H2 2", "Temple of Hatshepsut nestled in the cliffs of Luxor", "Hatshepsut Temple", "Luxor", undefined],
  ["gem after H2 10", "Great Pyramids of Giza in Egypt", "Giza Pyramids", "Giza", undefined],
  ["dahshur after H2 5", "step pyramid of Djoser in Saqqara, UNESCO site", "Saqqara", "Cairo", undefined],
  ["valley after H2 9", "Desolate desert scene with rocky ground in Luxor, Egypt", "Theban hills", "Luxor", undefined],
] as Array<[string, string, string, string, string | undefined]>) {
  const r = composeAlt(desc, place, city, { suffix, placeConfirmed: true });
  const words = r ? r.alt.trim().split(/\s+/).length : 0;
  ok(label, r !== null && words >= 4 && words <= 15, r ? `${words}w  "${r.alt}"` : "STILL REJECTED");
}

// The floor still applies when the place is NOT confirmed.
console.log("\nAn unconfirmed place still has to earn eight words\n");
const weak = composeAlt("a stone wall", "Kom el Dikka", "Alexandria", {});
ok("thin description, place not confirmed", weak === null, weak ? `WRONGLY ACCEPTED "${weak.alt}"` : "");
const weakConfirmed = composeAlt("a stone wall", "Kom el Dikka", "Alexandria", { placeConfirmed: true });
ok("thin description, place confirmed, falls back to the name",
   weakConfirmed !== null && /Kom el Dikka/.test(weakConfirmed.alt), weakConfirmed ? `"${weakConfirmed.alt}"` : "null");
const nothing = composeAlt("", "Saqqara", "Cairo", { placeConfirmed: true });
ok("empty description is still refused", nothing === null, nothing ? `WRONGLY ACCEPTED "${nothing.alt}"` : "");

// ---------------------------------------------------------------------------
// C. Singular and plural are the same word, without loosening anything else.
// ---------------------------------------------------------------------------
console.log("\nC. Plural forms match their singular, and near misses still do not\n");
const museum: Guard = { requirePlace: ["museum", "gallery", "exhibit", "exhibition"], allowPlaces: ["giza", "cairo"],
  require: [["statue", "sculpture", "sarcophagus", "artifact", "coffin", "mask"]],
  deny: ["louvre", "british museum"] };
const m = checkRelevance("ancient Egyptian statues and sarcophagi in a museum gallery in Cairo", museum);
ok("statues matches statue, sarcophagi matches sarcophagus", m.ok, m.ok ? "" : `WRONGLY REJECTED (${m.reason})`);

ok("\"roman\" does not match the denied \"rome\"", !hasToken("a roman theatre in Alexandria", "rome"));
ok("\"carved\" does not match the denied \"car\"", !hasToken("carved stone reliefs", "car"));
ok("\"cars\" does match the denied \"car\"", hasToken("two cars on a desert road", "car"));
ok("\"business\" does not match the denied \"bus\"", !hasToken("a business district", "bus"));
ok("\"frescoes\" matches \"fresco\"", hasToken("faded frescoes on the wall", "fresco"));

console.log(fails === 0 ? "\nAll image guard cases passed." : `\n${fails} failure(s)`);
process.exit(fails === 0 ? 0 : 1);
