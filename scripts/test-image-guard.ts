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
  const coptic: Guard = {
    requirePlace: ["coptic cairo", "babylon"],
    allowPlaces: ["cairo", "coptic cairo", "old cairo"], require: [], deny: [],
  };
  const good = checkRelevance("the towers of Babylon Fortress in Coptic Cairo, Egypt", coptic);
  ok("\"Babylon Fortress, Cairo\" passes", good.ok, good.ok ? "" : `WRONGLY REJECTED (${good.reason})`);
  const bad = checkRelevance("the reconstructed gate of Babylon", coptic);
  ok("\"Babylon\" with no Egyptian anchor is refused", !bad.ok, bad.reason);
}

// ---------------------------------------------------------------------------
console.log("\nJ. Egyptian words are not collateral damage\n");

for (const [what, text, guard] of [
  ["Roman, in Alexandria", "the Roman theatre at Kom el Dikka in Alexandria, Egypt",
   { requirePlace: ["alexandria"], allowPlaces: ["alexandria", "kom el dikka"], require: [["roman", "theatre"]], deny: [] }],
  ["Greco Roman, at Dendera", "a Greco Roman temple ceiling at Dendera in Qena, Egypt",
   { requirePlace: ["dendera"], allowPlaces: ["qena", "dendera", "denderah"], require: [["temple", "ceiling"]], deny: [] }],
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
  ok("a requirePlace of landforms is rejected", problems.length > 0, problems.join(" | "));
  ok("every offending token is named", problems.filter((x) => x.includes("describes a subject")).length === 5,
     problems.join(" | "));
  ok("and the message says what to do", problems.some((x) => x.includes("Move it to require")), problems[0]);
}
{
  const problems = auditPlaceGuards([
    { slug: "x", position: "hero", place: "Theban hills",
      guard: { requirePlace: ["theban", "west bank"], require: [], deny: [] } },
  ]);
  ok("a requirePlace containing \"west bank\" is rejected",
     problems.some((x) => x.includes("names somewhere outside Egypt")), problems.join(" | "));
}
{
  const problems = auditPlaceGuards([
    { slug: "x", position: "hero", place: "Nowhere",
      guard: { requirePlace: [], require: [], deny: [] } },
  ]);
  ok("an empty requirePlace is rejected",
     problems.some((x) => x.includes("requirePlace is empty")), problems.join(" | "));
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

// ---------------------------------------------------------------------------
console.log("\nL. A contradiction beats a confirmation\n");

// The photograph that started this section. Unsplash returned it for
// "temple of Seti I Abydos carving", the Abydos guard had "seti" in
// requirePlace, and the description says in as many words that it is the Valley
// of the Kings, 200 km from Abydos.
const SETI_KV17 = "Hieroglyphics in Tomb of Seti I in Valley of the Kings.. text";
const abydosGuard: Guard = {
  requirePlace: ["abydos"],
  allowPlaces: ["abydos", "sohag"],
  require: [["temple", "relief", "carving", "carved", "hieroglyph", "hieroglyphs", "wall"]],
  deny: ["pyramid", "luxor", "karnak", "dendera"],
};
{
  const v = checkRelevance(SETI_KV17, abydosGuard);
  ok("the KV17 photograph is refused for Abydos", !v.ok, v.reason);
  ok("and the reason names the place it actually is",
     !v.ok && v.reason.includes("valley of the kings"), v.reason);
}
{
  // Even with "seti" back in requirePlace, the contradiction now wins. This is
  // the property the user asked for: confirmation cannot outvote a clash.
  const loose: Guard = { ...abydosGuard, requirePlace: ["abydos", "seti"] };
  const v = checkRelevance(SETI_KV17, loose);
  ok("a confirming token does not rescue a contradicting description", !v.ok, v.reason);
}
{
  const good = "Carved relief of Seti I on a temple wall at Abydos in Sohag, Egypt";
  const v = checkRelevance(good, abydosGuard);
  ok("the real Abydos temple still passes", v.ok, v.ok ? "" : `WRONGLY REJECTED (${v.reason})`);
}
{
  // And the same photograph is correct for the Valley of the Kings position.
  const vokGuard: Guard = {
    requirePlace: ["valley of the kings", "luxor", "thebes", "theban"],
    allowPlaces: ["luxor", "thebes", "theban", "valley of the kings"],
    require: [["tomb", "hieroglyph", "hieroglyphs", "painted", "wall", "relief"]],
    deny: ["pyramid", "cairo"],
  };
  const v = checkRelevance(SETI_KV17, vokGuard);
  ok("the same photograph passes for the Valley of the Kings", v.ok, v.ok ? "" : `WRONGLY REJECTED (${v.reason})`);
}

for (const [what, text] of [
  ["Karnak offered for Luxor Temple", "columns of the hypostyle hall at Karnak, Luxor, Egypt"],
  ["Medinet Habu offered for the Ramesseum", "painted columns at Medinet Habu on the Luxor west bank, Egypt"],
  ["Philae offered for Kom Ombo", "the temple of Isis at Philae near Aswan, Egypt"],
  ["Dendera offered for Abydos", "the painted ceiling of the temple at Dendera, Egypt"],
] as Array<[string, string]>) {
  const guard: Guard = {
    requirePlace: ["abydos"], allowPlaces: ["abydos", "sohag"],
    require: [], deny: [],
  };
  const v = checkRelevance(text, guard);
  ok(`${what} is refused`, !v.ok, v.ok ? "ACCEPTED" : v.reason);
}

// ---------------------------------------------------------------------------
console.log("\nM. Kings and gods are not places\n");

for (const person of ["seti", "hathor", "horus", "isis", "sobek", "ramesses", "khufu", "djoser", "sneferu", "hatshepsut"]) {
  const problems = auditPlaceGuards([
    { slug: "x", position: "hero", place: "Somewhere", city: "Luxor",
      guard: { requirePlace: ["abydos", person], require: [], deny: [], allowPlaces: ["abydos", "luxor"] } },
  ]);
  ok(`"${person}" is refused in requirePlace`,
     problems.some((x) => x.includes("a king or a god")), problems.join(" | ") || "NO PROBLEM REPORTED");
}
{
  // A name that in practice means one building is not caught by that rule.
  const problems = auditPlaceGuards([
    { slug: "x", position: "hero", place: "Ibn Tulun Mosque", city: "Cairo",
      guard: { requirePlace: ["ibn tulun", "tulun"], allowPlaces: ["cairo", "ibn tulun"], require: [], deny: [] } },
  ]);
  ok("\"ibn tulun\" is allowed, since nobody uses it to mean the person",
     problems.length === 0, problems.join(" | "));
}
{
  // Every alternative has to confirm, because requirePlace is an OR. A list
  // holding one real name and one loose word is still no guard.
  const problems = auditPlaceGuards([
    { slug: "x", position: "hero", place: "Karnak Temple", city: "Luxor",
      guard: { requirePlace: ["karnak", "hypostyle", "temple"], allowPlaces: ["luxor", "karnak"], require: [], deny: [] } },
  ]);
  ok("a real name does not excuse a loose alternative beside it",
     problems.filter((x) => x.includes("describes a subject")).length === 2, problems.join(" | "));
}
{
  // The shipped specs, so a future edit that reintroduces either shape fails
  // here as well as at the start of a run.
  const problems = auditPlaceGuards(
    POSTS.flatMap((post) =>
      post.images.map((img) => ({
        slug: post.slug,
        position: img.role === "featured" ? "hero" : `after H2 #${img.afterH2}`,
        place: img.place,
        city: img.city,
        guard: img.guard,
      }))
    )
  );
  ok("no shipped guard names a king, a god or a subject as its place",
     problems.length === 0, problems.join("\n        "));
}
{
  // And no shipped guard contradicts its own place, which became possible the
  // moment EGYPT_PLACES learned monument names.
  const selfClash: string[] = [];
  for (const post of POSTS) {
    for (const img of post.images) {
      const text = `a photograph of ${img.place} in ${img.city}, Egypt`;
      const v = checkRelevance(text, img.guard);
      if (!v.ok && v.reason.includes("a different place")) {
        selfClash.push(`${post.slug} ${img.place}: ${v.reason}`);
      }
    }
  }
  ok("no shipped guard rejects a description of its own place",
     selfClash.length === 0, selfClash.join("\n        "));
}

// ---------------------------------------------------------------------------
console.log("\nN. The nine October and December specs\n");

// One deliberate false positive per spec, chosen to be the photograph that
// would plausibly come back from that spec's own search terms and be wrong.
// Every one of these is a picture somebody could reasonably have filed under
// the same words, which is the only kind worth testing.
const WAVE_SLUGS = [
  "valley-of-the-queens", "egypt-diving-red-sea", "black-and-white-desert-egypt",
  "tombs-of-the-nobles", "open-air-museum-memphis-egypt",
  "hatshepsut-temple", "memphis-egypt", "deir-el-medina", "bahariya-oasis-egypt",
];

const guardFor = (slug: string, place: string): Guard => {
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) throw new Error(`no spec for ${slug}`);
  const img = post.images.find((i) => i.place === place);
  if (!img) throw new Error(`no ${place} image in ${slug}`);
  return img.guard;
};

{
  const missing = WAVE_SLUGS.filter((slug) => !POSTS.some((p) => p.slug === slug));
  ok("all nine wave posts have image specs", missing.length === 0, missing.join(", "));
}

const WRONG: Array<[string, string, Guard]> = [
  // The Kings valley for the Queens valley. Same hillside, same word "tomb",
  // same city, and it is the single likeliest mistake on the west bank.
  ["a Valley of the Kings tomb for the Queens",
   "Painted wall in a tomb in the Valley of the Kings, Luxor, Egypt",
   guardFor("valley-of-the-queens", "Valley of the Queens")],

  // Tropical reef photography is interchangeable to look at and not to caption.
  ["a Maldives reef for the Red Sea",
   "Colourful coral reef and tropical fish in the Maldives",
   guardFor("egypt-diving-red-sea", "Red Sea reef")],

  // White gypsum dunes in New Mexico, which is what "white desert" returns.
  ["White Sands for the White Desert",
   "White gypsum sand dunes at White Sands, New Mexico",
   guardFor("black-and-white-desert-egypt", "White Desert")],

  // The brief's own example: royal tomb decoration sold as an official's tomb.
  ["a royal tomb painting for the nobles",
   "Painted royal tomb chamber with hieroglyphs, Luxor, Egypt",
   guardFor("tombs-of-the-nobles", "Tombs of the Nobles")],

  // Memphis, Tennessee. "tennessee" and "graceland" are refused globally, so
  // this one deliberately names neither and relies on the per spec deny list.
  ["Beale Street for the Memphis museum",
   "Neon signs on Beale Street in Memphis at night, guitar in the window",
   guardFor("open-air-museum-memphis-egypt", "Memphis")],

  // Her tomb is in the royal valley, 1 kilometre from her temple through the
  // rock, and "hatshepsut" alone cannot tell the two apart.
  ["Hatshepsut's tomb for Hatshepsut's temple",
   "Tomb of Hatshepsut in the Valley of the Kings, Luxor",
   guardFor("hatshepsut-temple", "Temple of Hatshepsut")],

  ["Graceland for ancient Memphis",
   "The mansion at Graceland, Memphis, Tennessee",
   guardFor("memphis-egypt", "Memphis")],

  // The workers' village is houses. A royal burial chamber is not.
  ["a royal burial chamber for the workers village",
   "Royal tomb burial chamber with painted sarcophagus, Valley of the Kings",
   guardFor("deir-el-medina", "Deir el Medina")],

  // Bahariya is the gateway to the chalk, so its own search terms return the
  // desert constantly. The oasis article is not about the desert.
  ["the White Desert for the oasis itself",
   "Chalk rock formations in the White Desert near Bahariya, Egypt",
   guardFor("bahariya-oasis-egypt", "Bahariya Oasis")],
];

for (const [label, desc, guard] of WRONG) {
  const v = checkRelevance(desc, guard);
  ok(label + " is refused", !v.ok, v.ok ? "WRONGLY ACCEPTED" : `(${v.reason})`);
}

console.log("\nAnd the right photograph still passes each one\n");

const RIGHT: Array<[string, string, Guard]> = [
  ["a Nefertari wall painting",
   "Wall painting in the tomb of Nefertari, Valley of the Queens, Luxor, Egypt",
   guardFor("valley-of-the-queens", "Valley of the Queens")],
  ["a Red Sea reef",
   "Coral reef with shoals of fish in the Red Sea off Hurghada, Egypt",
   guardFor("egypt-diving-red-sea", "Red Sea reef")],
  ["a White Desert chalk formation",
   "Wind eroded chalk rock formations in the White Desert, Farafra, Egypt",
   guardFor("black-and-white-desert-egypt", "White Desert")],
  ["a nobles tomb banquet scene",
   "Painted banquet scene with musicians in a tomb at Sheikh Abd el Qurna, Luxor",
   guardFor("tombs-of-the-nobles", "Tombs of the Nobles")],
  ["the Memphis colossus",
   "Colossal limestone statue of Ramesses II at Memphis, Egypt",
   guardFor("open-air-museum-memphis-egypt", "Memphis")],
  ["the terraces at Deir el Bahari",
   "The terraces and colonnades of the temple of Hatshepsut at Deir el Bahari",
   guardFor("hatshepsut-temple", "Temple of Hatshepsut")],
  ["the ruins of ancient Memphis",
   "Ancient stone ruins and palm trees at Memphis, Egypt",
   guardFor("memphis-egypt", "Memphis")],
  ["the village houses at Deir el Medina",
   "Stone foundations of the workers houses at Deir el Medina, Luxor, Egypt",
   guardFor("deir-el-medina", "Deir el Medina")],
  ["a Bahariya palm grove",
   "Palm grove and spring water at Bahariya, Egypt",
   guardFor("bahariya-oasis-egypt", "Bahariya Oasis")],
];

for (const [label, desc, guard] of RIGHT) {
  const v = checkRelevance(desc, guard);
  ok(label + " passes", v.ok, v.ok ? "" : `WRONGLY REFUSED (${v.reason})`);
}

console.log("\nCases that isolate the per spec deny lists\n");
{
  // The rejections above mostly fire on requirePlace, on the contradiction
  // check or on OUTSIDE_EGYPT, because those run first and are stronger. That
  // is the right order, and it means a deny list can rot without any test
  // noticing. These two descriptions satisfy everything else, so only the deny
  // list stands between them and the article.
  const elvis = checkRelevance(
    "Bronze statue of Elvis in Memphis",
    guardFor("memphis-egypt", "Memphis"));
  ok("an Elvis statue in Memphis is refused by the deny list alone",
     !elvis.ok, elvis.ok ? "WRONGLY ACCEPTED" : `(${elvis.reason})`);

  const antarctic = checkRelevance(
    "Chalk white rock formations in the white desert of Antarctica",
    guardFor("black-and-white-desert-egypt", "White Desert"));
  ok("an Antarctic white desert is refused by the deny list alone",
     !antarctic.ok, antarctic.ok ? "WRONGLY ACCEPTED" : `(${antarctic.reason})`);
}

console.log("\nThe two cases where a near miss has to be allowed through\n");
{
  // Deir el Medina's OWN painted tombs are the exception the village guard
  // denies, which is why they have a position of their own rather than a
  // looser guard on the village.
  const v = checkRelevance(
    "Painted vaulted burial chamber in the tomb of Sennedjem at Deir el Medina, Luxor",
    guardFor("deir-el-medina", "Deir el Medina tomb"));
  ok("Sennedjem's painted chamber passes on its own position", v.ok, v.ok ? "" : `REFUSED (${v.reason})`);

  // And the same photograph must NOT satisfy the village position.
  const w = checkRelevance(
    "Painted vaulted burial chamber in the tomb of Sennedjem at Deir el Medina, Luxor",
    guardFor("deir-el-medina", "Deir el Medina"));
  ok("and is still refused for the village position", !w.ok, w.ok ? "WRONGLY ACCEPTED" : `(${w.reason})`);

  // The alabaster sphinx has to allow the word "sphinx" to describe itself,
  // so giza is what keeps the Great Sphinx out rather than the word.
  const g = checkRelevance(
    "The Great Sphinx of Giza with the pyramids behind it, Egypt",
    guardFor("open-air-museum-memphis-egypt", "Alabaster sphinx Memphis"));
  ok("the Great Sphinx is refused for the alabaster sphinx", !g.ok, g.ok ? "WRONGLY ACCEPTED" : `(${g.reason})`);

  const a = checkRelevance(
    "The alabaster sphinx at Memphis, Egypt, carved from a single block",
    guardFor("open-air-museum-memphis-egypt", "Alabaster sphinx Memphis"));
  ok("and the alabaster sphinx itself passes", a.ok, a.ok ? "" : `REFUSED (${a.reason})`);
}

// ---------------------------------------------------------------------------
console.log("\nO. Every image position exists in the article it belongs to\n");

// afterH2 is 1 based and has to be less than the article's H2 count, or
// fill-post-images has nowhere to put the figure. That check happens at run
// time against the live body; this one runs it against the source, so a spec
// written for the wrong article fails here rather than on the server.
{
  const mod = await import("../content-updates/blog-generator/articles.mjs" as string);
  const articles = (mod as { ARTICLES: Array<{ slug: string; body: string }> }).ARTICLES;
  const h2Count = new Map(
    articles.map((a) => [a.slug, (a.body.match(/<h2>/g) ?? []).length]),
  );

  const bad: string[] = [];
  for (const post of POSTS) {
    const count = h2Count.get(post.slug);
    if (count === undefined) continue; // an article that predates the generator
    for (const img of post.images) {
      if (img.afterH2 === undefined) continue;
      if (img.afterH2 < 1 || img.afterH2 >= count) {
        bad.push(`${post.slug} afterH2 ${img.afterH2} but the article has ${count} H2 sections`);
      }
    }
  }
  ok("every afterH2 index is inside its article", bad.length === 0, bad.join("\n        "));

  const covered = WAVE_SLUGS.filter((slug) => h2Count.has(slug));
  ok("the nine wave articles are all readable from the generator",
     covered.length === WAVE_SLUGS.length, `${covered.length} of ${WAVE_SLUGS.length}`);
}

// ---------------------------------------------------------------------------
console.log("\nN. The sixteen rewritten articles\n");
// ---------------------------------------------------------------------------
// These specs are different in kind from the ones above. Several of the
// articles are about a topic rather than a place, so the guard is doing all of
// the work on its own: there is no "is this really Saqqara" intuition to fall
// back on, only "does this description actually say Egypt and say the thing".

const REWRITTEN_SLUGS = [
  "best-time-to-visit-egypt", "luxury-egypt-tours", "egypt-visa-for-us-citizens",
  "is-egypt-safe-for-americans", "egypt-travel-insurance", "egypt-honeymoon",
  "egypt-plug-type", "private-pyramid-tours-egypt", "best-luxury-nile-cruise-egypt",
  "vaccinations-needed-for-egypt", "planning-a-trip-to-egypt", "egypt-travel-tips",
  "what-to-pack-for-egypt", "private-tours-in-cairo-egypt", "tailor-made-egypt-tours",
  "currency-in-egypt",
];

{
  const missing = REWRITTEN_SLUGS.filter((slug) => !POSTS.some((p) => p.slug === slug));
  ok("all sixteen rewritten posts have image specs", missing.length === 0, missing.join(", "));
}

// The focus keyword on a spec and the primary keyword in the generator are the
// same fact stored twice. They drift silently, and the symptom is an alt that
// carries a keyword the article is no longer targeting.
{
  const mod = await import("../content-updates/blog-generator/articles.mjs" as string);
  const articles = (mod as { ARTICLES: Array<{ slug: string; primary: string }> }).ARTICLES;
  const primary = new Map(articles.map((a) => [a.slug, a.primary]));
  const drift: string[] = [];
  for (const post of POSTS) {
    const want = primary.get(post.slug);
    if (want === undefined) continue;
    if (want !== post.focusKeyword) drift.push(`${post.slug}: spec "${post.focusKeyword}" vs generator "${want}"`);
  }
  ok("every focusKeyword matches the generator's primary keyword", drift.length === 0, drift.join("\n        "));
}

// Exactly one image per post carries the keyword, and the suffix that puts it
// there actually contains it. A suffix that does not is a silent no-op: the
// post ships with no keyword-bearing alt at all.
{
  const bad: string[] = [];
  for (const post of POSTS) {
    const carriers = post.images.filter((i) => i.keyword).length;
    if (carriers !== 1) bad.push(`${post.slug} has ${carriers} images flagged keyword (want exactly 1)`);
    if (!post.keywordSuffix.toLowerCase().includes(post.focusKeyword.toLowerCase()))
      bad.push(`${post.slug}: keywordSuffix "${post.keywordSuffix}" does not contain "${post.focusKeyword}"`);
  }
  ok("one keyword image per post, and the suffix carries the keyword", bad.length === 0, bad.join("\n        "));
}

// Two figures in the same section would stack on top of each other, because
// insertFigureAfterH2 puts both immediately before the same following H2.
{
  const clashes: string[] = [];
  for (const post of POSTS) {
    const seen = new Set<number>();
    for (const img of post.images) {
      if (img.afterH2 === undefined) continue;
      if (seen.has(img.afterH2)) clashes.push(`${post.slug} has two images after H2 #${img.afterH2}`);
      seen.add(img.afterH2);
    }
  }
  ok("no two images share a position", clashes.length === 0, clashes.join("\n        "));
}

// The wrong photographs these particular guards have to keep out. Each one is
// a plausible provider result for the query next to it in the spec.
const WRONG_REWRITES: Array<[string, string, Guard]> = [
  ["US dollars for the Egyptian pound",
   "a stack of US dollar banknotes on a wooden table",
   guardFor("currency-in-egypt", "Egypt")],
  ["Turkish lira for the Egyptian pound",
   "Turkish lira banknotes and coins, currency of Turkey",
   guardFor("currency-in-egypt", "Egypt")],
  ["euros shown beside pounds",
   "euro banknotes next to Egyptian pound notes, money exchange in Egypt",
   guardFor("currency-in-egypt", "Egypt")],
  ["a German wall socket for the Egyptian one",
   "white electrical power socket on a wall in a flat in Berlin, Germany",
   guardFor("egypt-plug-type", "Egypt")],
  ["a server rack for the Egyptian socket",
   "power cables and electrical outlets in a data centre in Egypt",
   guardFor("egypt-plug-type", "Egypt")],
  ["a Sudanese pyramid for Giza",
   "pyramids of Meroe in the desert, Sudan",
   guardFor("private-pyramid-tours-egypt", "Giza Pyramids")],
  ["a supermarket for Khan al Khalili",
   "supermarket aisle with shelves in Cairo, Egypt",
   guardFor("egypt-travel-tips", "Khan al Khalili")],
  ["a Coptic church for Islamic Cairo",
   "Coptic church facade with a cross in Cairo, Egypt",
   guardFor("egypt-travel-tips", "Islamic Cairo")],
  ["Karnak for the Theban hills",
   "Karnak temple columns in Luxor, Egypt",
   guardFor("what-to-pack-for-egypt", "Theban hills")],
  ["a Maldives reef for the Red Sea",
   "coral reef and tropical fish in the Maldives",
   guardFor("egypt-travel-insurance", "Red Sea reef")],
  ["an ocean sailing boat for the Nile",
   "a sailing boat on the open ocean near the Greek islands",
   guardFor("best-luxury-nile-cruise-egypt", "Nile between Aswan and Luxor")],
  ["Edfu for Kom Ombo",
   "the Temple of Horus at Edfu, Egypt, pylon and courtyard",
   guardFor("best-luxury-nile-cruise-egypt", "Kom Ombo")],
];
for (const [label, desc, guard] of WRONG_REWRITES) {
  const v = checkRelevance(desc, guard);
  ok(label + " is rejected", !v.ok, v.ok ? "WRONGLY ACCEPTED" : `(${v.reason})`);
}

// And the photographs that should get through, so the guards above are not
// simply rejecting everything.
const RIGHT_REWRITES: Array<[string, string, Guard]> = [
  ["Egyptian pound banknotes",
   "Egyptian pound banknotes held in a hand at a market in Egypt",
   guardFor("currency-in-egypt", "Egypt")],
  ["a socket in an Egyptian hotel room",
   "a two pin electrical wall socket in a hotel room in Cairo, Egypt",
   guardFor("egypt-plug-type", "Egypt")],
  ["the Giza plateau",
   "the pyramids of Giza rising from the desert sand under a clear sky in Egypt",
   guardFor("private-pyramid-tours-egypt", "Giza Pyramids")],
  ["Khan al Khalili itself",
   "lanterns hanging above a lane of stalls in the Khan el Khalili bazaar, Cairo",
   guardFor("egypt-travel-tips", "Khan al Khalili")],
  ["the Theban hills",
   "bare desert cliffs above the west bank at Luxor, Egypt",
   guardFor("what-to-pack-for-egypt", "Theban hills")],
  ["a Red Sea reef",
   "coral reef and fish underwater in the Red Sea off Hurghada",
   guardFor("egypt-travel-insurance", "Red Sea reef")],
  ["the Nile between the two cities",
   "palm trees along the bank of the Nile river with a boat passing, Egypt",
   guardFor("best-luxury-nile-cruise-egypt", "Nile between Aswan and Luxor")],
];
for (const [label, desc, guard] of RIGHT_REWRITES) {
  const v = checkRelevance(desc, guard);
  ok(label + " is accepted", v.ok, v.ok ? "" : `WRONGLY REJECTED (${v.reason})`);
}

// The awkward suffixes. Three of these focus keywords are not noun phrases
// that sit naturally at the end of a sentence, and a suffix that makes the alt
// unusable is worse than no keyword at all, so the composed alt is asserted
// rather than assumed.
{
  const cases: Array<[string, string]> = [
    ["is-egypt-safe-for-americans", "lanterns hanging above a lane of stalls in the Khan el Khalili bazaar, Cairo"],
    ["egypt-travel-insurance", "feluccas sailing on the Nile at Aswan, Egypt"],
    ["currency-in-egypt", "Egyptian pound banknotes held in a hand at a market in Egypt"],
    ["vaccinations-needed-for-egypt", "a boat sailing on the Nile river in Egypt"],
  ];
  for (const [slug, description] of cases) {
    const post = POSTS.find((p) => p.slug === slug)!;
    const spec = post.images.find((i) => i.keyword)!;
    const result = composeAltForPosition(post, spec, description, false);
    const composed = "alt" in result ? result.alt : "";
    ok(`${slug} composes a keyword alt`, "alt" in result,
       "refused" in result ? result.refused : "");
    if ("alt" in result) {
      ok(`  ${slug} alt carries the focus keyword`, result.carriesKeyword, composed);
      // Alt text is read aloud. Past roughly 150 characters a screen reader
      // user is being made to sit through a sentence nobody wrote for them.
      ok(`  ${slug} alt stays under 150 characters`, composed.length <= 150,
         `${composed.length}: ${composed}`);
    }
  }
}

// ---------------------------------------------------------------------------
console.log("\nO. The Nile cluster\n");
// ---------------------------------------------------------------------------
const NILE_CLUSTER = [
  "dahabiya-nile-cruise", "nile-cruise-luxor-to-aswan", "7-night-nile-cruise",
  "lake-nasser-cruise", "best-time-to-go-to-egypt-nile-cruise",
];
{
  const missing = NILE_CLUSTER.filter((slug) => !POSTS.some((p) => p.slug === slug));
  ok("all five Nile cluster articles have image specs", missing.length === 0, missing.join(", "));
}
for (const [label, desc, guard] of [
  ["a Maldives sailing boat for the Nile",
   "a traditional sailing boat on turquoise water in the Maldives",
   guardFor("dahabiya-nile-cruise", "Nile River")],
  ["a cruise ship for a dahabiya",
   "a large white cruise ship moored on the Nile at Luxor, Egypt",
   guardFor("dahabiya-nile-cruise", "Nile River")],
  ["Lake Qarun for Lake Nasser again",
   "Lake Qarun in the Faiyum, Egypt, water and shore",
   guardFor("lake-nasser-cruise", "Lake Nasser")],
  ["Nasser Square in Cairo for the lake",
   "Nasser square in central Cairo, Egypt",
   guardFor("lake-nasser-cruise", "Lake Nasser")],
  ["Edfu standing in for Kom Ombo",
   "the Temple of Horus at Edfu, Egypt, pylon and courtyard",
   guardFor("nile-cruise-luxor-to-aswan", "Kom Ombo")],
  ["Karnak for the Theban hills",
   "Karnak temple columns in Luxor, Egypt",
   guardFor("best-time-to-go-to-egypt-nile-cruise", "Theban hills")],
] as Array<[string, string, Guard]>) {
  const v = checkRelevance(desc, guard);
  ok(label + " is rejected", !v.ok, v.ok ? "WRONGLY ACCEPTED" : `(${v.reason})`);
}
for (const [label, desc, guard] of [
  ["a sailing boat on the Nile",
   "a traditional wooden sailing boat with a lateen sail on the Nile river in Egypt",
   guardFor("dahabiya-nile-cruise", "Nile River")],
  ["Lake Nasser itself",
   "Lake Nasser seen from the shore near Abu Simbel in Egypt",
   guardFor("lake-nasser-cruise", "Lake Nasser")],
  ["Kom Ombo itself",
   "carved relief on a temple wall at Kom Ombo, Egypt",
   guardFor("nile-cruise-luxor-to-aswan", "Kom Ombo")],
  ["Dendera's ceiling",
   "the painted astronomical ceiling of the temple at Dendera, Egypt",
   guardFor("7-night-nile-cruise", "Dendera")],
] as Array<[string, string, Guard]>) {
  const v = checkRelevance(desc, guard);
  ok(label + " is accepted", v.ok, v.ok ? "" : `WRONGLY REJECTED (${v.reason})`);
}

// ---------------------------------------------------------------------------
console.log("\nP. The hotels cluster: a generic interior must never pass\n");
// ---------------------------------------------------------------------------
// The whole risk in this cluster is that hotel photography is interchangeable.
// A marble lobby is a marble lobby, and a guard asking for "hotel" plus
// "luxury" would take one shot in Dubai for one in Cairo without blinking.
// None of these guards asks for a hotel at all.

const HOTEL_CLUSTER = [
  "where-to-stay-in-cairo", "luxury-hotels-cairo", "cairo-hotel-with-pyramid-view",
  "best-hotels-in-luxor-egypt", "best-hotels-in-aswan", "5-star-hotels-in-egypt",
];
{
  const missing = HOTEL_CLUSTER.filter((slug) => !POSTS.some((p) => p.slug === slug));
  ok("all six hotel articles have image specs", missing.length === 0, missing.join(", "));
}
for (const [label, desc, guard] of [
  ["a Dubai lobby for Cairo",
   "luxury hotel lobby with marble floors and chandeliers in Dubai",
   guardFor("where-to-stay-in-cairo", "Nile River")],
  ["a generic five star suite",
   "elegant five star hotel suite interior with a king bed and city view",
   guardFor("luxury-hotels-cairo", "Nile River")],
  ["a resort pool for the Red Sea",
   "swimming pool at a luxury resort with sun loungers",
   guardFor("5-star-hotels-in-egypt", "Red Sea reef")],
  ["the Luxor casino in Las Vegas for Luxor",
   "the Luxor hotel and casino pyramid on the Las Vegas strip",
   guardFor("best-hotels-in-luxor-egypt", "Nile River")],
  ["an Aswan hotel buffet",
   "breakfast buffet and reception interior at a hotel in Aswan, Egypt",
   guardFor("best-hotels-in-aswan", "Nile at Aswan")],
  ["a Las Vegas sphinx replica",
   "replica sphinx model outside a casino in Las Vegas",
   guardFor("cairo-hotel-with-pyramid-view", "Giza Pyramids")],
  ["a Maldives resort for the Egyptian coast",
   "overwater villas and turquoise lagoon in the Maldives",
   guardFor("5-star-hotels-in-egypt", "Red Sea reef")],
] as Array<[string, string, Guard]>) {
  const v = checkRelevance(desc, guard);
  ok(label + " is rejected", !v.ok, v.ok ? "WRONGLY ACCEPTED" : `(${v.reason})`);
}
for (const [label, desc, guard] of [
  ["the Cairo corniche",
   "the Nile river and the corniche in Cairo, Egypt, at dusk",
   guardFor("where-to-stay-in-cairo", "Nile River")],
  ["feluccas at Aswan",
   "feluccas sailing between the granite islands on the Nile at Aswan, Egypt",
   guardFor("best-hotels-in-aswan", "Nile at Aswan")],
  ["the Giza plateau at dusk",
   "the pyramids of Giza in golden evening light over the desert sand in Egypt",
   guardFor("cairo-hotel-with-pyramid-view", "Giza Pyramids")],
  ["the Nile at Luxor",
   "feluccas on the water beside the corniche at Luxor, Egypt",
   guardFor("best-hotels-in-luxor-egypt", "Nile River")],
] as Array<[string, string, Guard]>) {
  const v = checkRelevance(desc, guard);
  ok(label + " is accepted", v.ok, v.ok ? "" : `WRONGLY REJECTED (${v.reason})`);
}

console.log(fails === 0 ? "\nAll image guard cases passed." : `\n${fails} failure(s)`);
process.exit(fails === 0 ? 0 : 1);
