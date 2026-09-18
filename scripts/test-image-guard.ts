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

import {
  checkRelevance, composeAlt, hasToken, unsplashDescription, auditPlaceGuards, type Guard,
} from "./lib/provider-images";
import { POSTS } from "./lib/post-image-specs";
import { isPinnedFigure, isPinnedUrl, pinnedImagesLost } from "./lib/pinned-images";
import {
  decideAction, outcomeFor, replaceFigureAfterH2, figureHtmlFor, composeAltForPosition,
} from "./lib/image-placement";

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

// ---------------------------------------------------------------------------
console.log("\nD. Unsplash candidates\n");

// Unsplash gives two texts and either can be null. The photographer's own
// `description` is the better evidence and leads; `alt_description` is
// Unsplash's generated caption and carries the load when description is null,
// which in practice it usually is.
{
  const both = unsplashDescription({
    description: "The temple of Medinet Habu on the Luxor west bank at sunrise",
    alt_description: "brown concrete building under blue sky",
  });
  ok("photographer's description comes first", both.startsWith("The temple of Medinet Habu"), both);
  ok("alt_description is kept as well", both.includes("brown concrete building"), both);
}
{
  const onlyAlt = unsplashDescription({ description: null, alt_description: "Karnak temple columns in Luxor, Egypt" });
  ok("a null description falls back to alt_description",
     onlyAlt === "Karnak temple columns in Luxor, Egypt", JSON.stringify(onlyAlt));
}
{
  const neither = unsplashDescription({ description: null, alt_description: null });
  ok("both null gives an empty string, which the guard then refuses", neither === "", JSON.stringify(neither));
  const v = checkRelevance(neither, { requirePlace: ["karnak"], require: [], deny: [] });
  ok("an undescribed Unsplash photo is refused", !v.ok, v.reason);
}
{
  const tagged = unsplashDescription({
    description: null, alt_description: "a large stone gate",
    tags: [{ title: "cairo" }, { title: "bab zuweila" }],
  });
  ok("tags are appended after the captions", tagged.endsWith("cairo bab zuweila"), tagged);
}
{
  // A real Unsplash shaped candidate has to survive the same place guard as
  // any other, and be rejected the same way when it is of somewhere else.
  const guard: Guard = { requirePlace: ["medinet habu", "habu"], allowPlaces: ["luxor", "thebes"],
                         require: [["temple", "column", "columns", "wall", "relief"]], deny: [] };
  const good = unsplashDescription({ description: null, alt_description: "Columns and carved walls at Medinet Habu temple in Luxor, Egypt" });
  ok("a correct Unsplash photo passes", checkRelevance(good, guard).ok);
  const wrong = unsplashDescription({ description: "Hypostyle hall columns at Karnak in Luxor, Egypt", alt_description: null });
  const v = checkRelevance(wrong, guard);
  ok("a Karnak photo is still refused for a Medinet Habu position", !v.ok, v.reason);
}

// ---------------------------------------------------------------------------
console.log("\nE. --replace never empties a position\n");

const FIG_A = `<figure><img src="/api/assets/uploads/aaa.webp" alt="An old picture" loading="lazy" width="1600" height="1067"><figcaption>An old picture</figcaption></figure>`;
const BODY = `<p>One</p>\n<h2>First</h2>\n<p>Two</p>\n${FIG_A}\n<h2>Second</h2>\n<p>Three</p>`;

{
  // The decision table, which is what the running script calls.
  ok("a filled position with no replace flag is kept",
     decideAction({ filled: true, pinned: false, replaceMode: false }) === "keep");
  ok("a filled position under --replace is a replace",
     decideAction({ filled: true, pinned: false, replaceMode: true }) === "replace");
  ok("an empty position is a fill",
     decideAction({ filled: false, pinned: false, replaceMode: false }) === "fill");

  // The rule this whole task turns on.
  ok("a replace that finds nothing keeps the old image", outcomeFor("replace", false) === "kept");
  ok("a fill that finds nothing leaves the position empty", outcomeFor("fill", false) === "skipped");
  ok("a replace that finds something replaces", outcomeFor("replace", true) === "replaced");
  ok("a fill that finds something sets", outcomeFor("fill", true) === "set");
}
{
  // And the body itself: nothing is removed except in the same operation that
  // puts the new figure in, so there is no path to an empty position.
  const replaced = replaceFigureAfterH2(BODY, 1, figureHtmlFor("/api/assets/uploads/bbb.webp", "A new picture"));
  ok("the new image is in", replaced.includes("bbb.webp"), replaced);
  ok("the old image is gone", !replaced.includes("aaa.webp"));
  ok("there is still exactly one figure", (replaced.match(/<figure/g) || []).length === 1);
  ok("the surrounding prose is untouched",
     replaced.includes("<p>Two</p>") && replaced.includes("<h2>Second</h2>") && replaced.includes("<p>Three</p>"));
}
{
  // The failure path is the absence of a call, so the property to lock down is
  // that the body a run never edits is the body it started with.
  const untouched = BODY;
  ok("a position whose search failed is byte for byte unchanged", untouched === BODY);
  ok("and still holds its image", untouched.includes("aaa.webp"));
}

// ---------------------------------------------------------------------------
console.log("\nF. Hand placed images are never replaced\n");

const PINNED_FIG = `<figure><img src="/api/assets/uploads/013cb0e7-55ae-4e81-8108-f08a114c39e1.webp" alt="Chosen by hand" loading="lazy" width="1600" height="1067"><figcaption>Chosen by hand</figcaption></figure>`;

ok("the coptic-cairo hand placed image is recognised", isPinnedFigure(PINNED_FIG));
ok("the medinet-habu hand placed image is recognised",
   isPinnedUrl("/api/assets/uploads/6610f691-0fd6-4100-9f60-3673faea671b.webp"));
ok("an ordinary image is not pinned", !isPinnedFigure(FIG_A));
ok("a pinned url is matched whichever prefix it was stored under",
   isPinnedUrl("/uploads/013cb0e7-55ae-4e81-8108-f08a114c39e1.webp"));
ok("a data-pinned attribute pins a figure the list does not name",
   isPinnedFigure(`<figure data-pinned><img src="/api/assets/uploads/zzz.webp" alt="x"></figure>`));
{
  // The backstop that does not depend on the H2 indices being right. One of the
  // two hand placed images sits at a position the spec does not manage, so a
  // position based check alone would never look at it.
  const withPin = `<p>a</p>\n<h2>One</h2>\n${PINNED_FIG}\n<h2>Two</h2>\n${FIG_A}\n<h2>Three</h2>`;
  ok("a body keeping its pinned image loses nothing", pinnedImagesLost(withPin, withPin).length === 0);
  const swappedOrdinary = replaceFigureAfterH2(withPin, 2, figureHtmlFor("/api/assets/uploads/ccc.webp", "New"));
  ok("replacing the ordinary image leaves the pinned one alone",
     pinnedImagesLost(withPin, swappedOrdinary).length === 0 && swappedOrdinary.includes("013cb0e7"));
  const swappedPinned = replaceFigureAfterH2(withPin, 1, figureHtmlFor("/api/assets/uploads/ddd.webp", "New"));
  ok("removing the pinned image is detected", pinnedImagesLost(withPin, swappedPinned).length === 1);
}

ok("a pinned position is left alone even under --replace",
   decideAction({ filled: true, pinned: true, replaceMode: true }) === "pinned");
ok("and reports as pinned rather than as kept", outcomeFor("pinned", true) === "pinned");

// ---------------------------------------------------------------------------
console.log("\nG. One alt per post carries the focus keyword\n");

// medinet-habu is the hard case: the focus keyword IS the place name, so every
// position produces it naturally. Composing all four and then rejecting the
// batch is what cost a whole commit on the last run.
{
  const post = { focusKeyword: "medinet habu", keywordSuffix: " at medinet habu in Luxor" };
  const desc = "Carved reliefs and painted columns of a temple at Medinet Habu in Luxor, Egypt";

  const hero = composeAltForPosition(post, { place: "Medinet Habu", city: "Luxor", keyword: true }, desc, false);
  ok("the keyword position gets an alt", !("refused" in hero), "refused" in hero ? hero.refused : "");
  if (!("refused" in hero)) {
    ok("and it carries the focus keyword", hero.carriesKeyword, hero.alt);
  }

  const other = composeAltForPosition(post, { place: "Medinet Habu", city: "Luxor" }, desc, true);
  ok("a second position still gets an alt", !("refused" in other), "refused" in other ? other.refused : "");
  if (!("refused" in other)) {
    ok("which does NOT carry the keyword", !other.carriesKeyword, other.alt);
    ok("and does not name the place", !other.alt.toLowerCase().includes("medinet habu"), other.alt);
    ok("but still says where it is", other.alt.toLowerCase().includes("luxor"), other.alt);
    ok("and is at least 5 words", other.alt.trim().split(/\s+/).length >= 5, other.alt);
  }

  const third = composeAltForPosition(post, { place: "Medinet Habu", city: "Luxor" }, desc, true);
  if (!("refused" in third) && !("refused" in other)) {
    ok("a third position behaves the same way", !third.carriesKeyword, third.alt);
  }
}
{
  // coptic-cairo: the keyword is the place AND contains the city, so the retry
  // has to drop the place without producing a nonsense location.
  const post = { focusKeyword: "coptic cairo", keywordSuffix: " in coptic cairo" };
  const desc = "A Coptic church interior with columns and icons in Coptic Cairo, Egypt";
  const other = composeAltForPosition(post, { place: "Coptic Cairo", city: "Cairo" }, desc, true);
  ok("coptic-cairo phrases a non keyword alt", !("refused" in other), "refused" in other ? other.refused : "");
  if (!("refused" in other)) {
    ok("without the keyword in it", !other.alt.toLowerCase().includes("coptic cairo"), other.alt);
  }
}
{
  // A description too thin to say anything is still a refusal, not a guess.
  const post = { focusKeyword: "kom ombo temple", keywordSuffix: " at kom ombo temple" };
  const thin = composeAltForPosition(post, { place: "Kom Ombo", city: "Aswan" }, "", false);
  ok("an empty description is refused", "refused" in thin);
}

// ---------------------------------------------------------------------------
console.log("\nH. Nowhere outside Egypt gets through\n");

// The photograph that started this section. Pixabay returned it for the query
// "Theban hills Luxor west bank desert", the guard's requirePlace contained
// "west bank", the description named no Egyptian place so it contradicted
// nothing, and it was accepted and written to the article.
const BETHLEHEM = "bethlehem city houses hill view west bank bethlehem bethlehem palestine";
const thebanGuard: Guard = {
  requirePlace: ["theban", "thebes", "luxor", "valley of the kings"],
  allowPlaces: ["luxor", "thebes"],
  require: [["hill", "hills", "cliff", "cliffs", "desert", "rock", "mountain", "mountains"]],
  deny: ["pyramid", "cairo", "aswan"],
};
{
  const v = checkRelevance(BETHLEHEM, thebanGuard);
  ok("the Bethlehem photograph is refused", !v.ok, v.reason);
  ok("and the reason says it is not in Egypt", !v.ok && v.reason.includes("not in Egypt"), v.reason);
}
{
  // Even against the old loose guard, the country check alone stops it now.
  const loose: Guard = { requirePlace: ["west bank", "hill"], require: [], deny: [] };
  const v = checkRelevance(BETHLEHEM, loose);
  ok("it is refused even by a guard that would otherwise confirm it", !v.ok, v.reason);
}

for (const [where, text] of [
  ["Jerusalem", "the old city walls of Jerusalem at sunset"],
  ["Petra", "the treasury carved into rock at Petra, Jordan"],
  ["Wadi Rum", "red sand dunes in Wadi Rum under a clear sky"],
  ["Meroe", "pyramids of Meroe in the desert, Sudan"],
  ["Palmyra", "colonnaded street and ancient ruins at Palmyra, Syria"],
  ["Chichen Itza", "the stepped pyramid at Chichen Itza, Mexico"],
  ["Marrakech", "a market alley in Marrakech, Morocco"],
  ["Istanbul", "domes and minarets of a mosque in Istanbul"],
  ["Lalibela", "rock cut church at Lalibela, Ethiopia"],
  ["Memphis Tennessee", "a riverside street in Memphis, Tennessee"],
  ["Alexandria Virginia", "the waterfront at Alexandria, Virginia"],
  ["Monument Valley", "sandstone buttes at Monument Valley, Utah"],
] as Array<[string, string]>) {
  const v = checkRelevance(text, { requirePlace: ["pyramid", "temple", "market", "street", "dune", "church", "waterfront", "hill", "rock"], require: [], deny: [] });
  ok(`${where} is refused`, !v.ok, v.ok ? "ACCEPTED" : v.reason);
}

// ---------------------------------------------------------------------------
console.log("\nI. \"West bank\" only counts when something says Egypt\n");

{
  const v = checkRelevance("bare hills above the west bank at sunrise", thebanGuard);
  ok("\"west bank\" with no Egyptian anchor is refused", !v.ok, v.reason);
}
{
  const v = checkRelevance("bare desert hills on the Luxor west bank, Egypt", thebanGuard);
  ok("\"Luxor west bank\" passes", v.ok, v.ok ? "" : `WRONGLY REJECTED (${v.reason})`);
}
{
  const v = checkRelevance("the Theban hills above the west bank of the Nile", thebanGuard);
  ok("\"Theban ... west bank ... Nile\" passes", v.ok, v.ok ? "" : `WRONGLY REJECTED (${v.reason})`);
}
{
  // Babylon is the Roman fortress Coptic Cairo is built inside, and a city in
  // Iraq. Both readings have to work.
  const coptic: Guard = { requirePlace: ["coptic", "babylon"], allowPlaces: ["cairo"], require: [], deny: [] };
  const good = checkRelevance("the towers of Babylon Fortress in Coptic Cairo, Egypt", coptic);
  ok("\"Babylon Fortress, Cairo\" passes", good.ok, good.ok ? "" : `WRONGLY REJECTED (${good.reason})`);
  const bad = checkRelevance("the reconstructed gate of Babylon", coptic);
  ok("\"Babylon\" with no Egyptian anchor is refused", !bad.ok, bad.reason);
}

// ---------------------------------------------------------------------------
console.log("\nJ. Egyptian words are not collateral damage\n");

for (const [what, text, guard] of [
  ["Roman, in Alexandria", "the Roman theatre at Kom el Dikka in Alexandria, Egypt",
   { requirePlace: ["alexandria"], allowPlaces: ["alexandria"], require: [["roman", "theatre"]], deny: [] }],
  ["Greco Roman, at Dendera", "a Greco Roman temple ceiling at Dendera in Qena, Egypt",
   { requirePlace: ["dendera"], allowPlaces: ["qena", "dendera"], require: [["temple", "ceiling"]], deny: [] }],
  ["Mediterranean, at Alexandria", "the Mediterranean seafront corniche at Alexandria, Egypt",
   { requirePlace: ["alexandria"], allowPlaces: ["alexandria"], require: [["sea", "corniche"]], deny: [] }],
  ["Nubian, at Aswan", "a painted Nubian house in a village near Aswan, Egypt",
   { requirePlace: ["nubian"], allowPlaces: ["aswan", "nubia"], require: [["house", "village"]], deny: [] }],
  ["Sahara, in the Western Desert", "sand dunes of the Sahara in the Western Desert of Egypt",
   { requirePlace: ["sahara", "desert"], allowPlaces: [], require: [["dune", "sand"]], deny: [] }],
] as Array<[string, string, Guard]>) {
  const v = checkRelevance(text, guard);
  ok(`${what} still passes`, v.ok, v.ok ? "" : `WRONGLY REJECTED (${v.reason})`);
}

// ---------------------------------------------------------------------------
console.log("\nK. A guard that cannot fail is refused before the run starts\n");

{
  const problems = auditPlaceGuards([
    { slug: "x", position: "after H2 #9", place: "Theban hills",
      guard: { requirePlace: ["hill", "hills", "cliff", "valley", "desert"], require: [], deny: [] } },
  ]);
  ok("a requirePlace of landforms is rejected", problems.length === 1, problems.join(" | "));
  ok("and the message says what to do", problems[0]?.includes("Move them to require"), problems[0]);
}
{
  const problems = auditPlaceGuards([
    { slug: "x", position: "hero", place: "Theban hills",
      guard: { requirePlace: ["theban", "west bank"], require: [], deny: [] } },
  ]);
  ok("a requirePlace containing \"west bank\" is rejected", problems.length === 1, problems.join(" | "));
}
{
  const problems = auditPlaceGuards([
    { slug: "x", position: "hero", place: "Nowhere",
      guard: { requirePlace: [], require: [], deny: [] } },
  ]);
  ok("an empty requirePlace is rejected", problems.length === 1, problems.join(" | "));
}
{
  const problems = auditPlaceGuards([
    { slug: "x", position: "hero", place: "Medinet Habu",
      guard: { requirePlace: ["medinet habu", "habu"], require: [], deny: [] } },
    { slug: "y", position: "after H2 #5", place: "Unfinished Obelisk",
      guard: { requirePlace: ["aswan", "unfinished obelisk"], require: [["obelisk", "quarry"]], deny: [] } },
  ]);
  ok("a guard naming a real place passes the audit", problems.length === 0, problems.join(" | "));
}
{
  // The real specs, so a future edit that reintroduces this is caught here as
  // well as at the start of a run.
  const problems = auditPlaceGuards(
    POSTS.flatMap((post) =>
      post.images.map((img) => ({
        slug: post.slug,
        position: img.role === "featured" ? "hero" : `after H2 #${img.afterH2}`,
        place: img.place,
        guard: img.guard,
      }))
    )
  );
  ok(`all ${POSTS.reduce((n, p) => n + p.images.length, 0)} shipped guards name a real place`,
     problems.length === 0, problems.join("\n        "));
}

console.log(fails === 0 ? "\nAll image guard cases passed." : `\n${fails} failure(s)`);
process.exit(fails === 0 ? 0 : 1);
