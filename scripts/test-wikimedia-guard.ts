// Proves the Wikimedia licence and quality rules reject what they are there to
// reject, by handing each one a file that should fail it.
//
// A licence filter is only worth having if someone has watched it say no. These
// fixtures are all shapes the Commons API really returns, including the two that
// matter most for a commercial site: a non-commercial licence on an excellent
// photograph, and a file whose licence field says nothing at all.
//
//   npx tsx scripts/test-wikimedia-guard.ts

import {
  type CommonsCandidate, MIN_WIDTH, PREFER_WIDTH,
  licenceVerdict, screen, plain, titleToWords, commonsCaption,
} from "./lib/wikimedia-commons";
import type { Guard } from "./lib/provider-images";

let failures = 0;
function check(name: string, ok: boolean, detail = ""): void {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok || !detail ? "" : `\n        ${detail}`}`);
  if (!ok) failures++;
}

const meta = (o: Record<string, string>) =>
  Object.fromEntries(Object.entries(o).map(([k, v]) => [k, { value: v }]));

// ---------------------------------------------------------------------------
console.log("\nA. Licences: only CC0, public domain, CC BY and CC BY-SA get through\n");

const ACCEPT: [string, Record<string, string>][] = [
  ["CC0", { License: "cc0", LicenseShortName: "CC0" }],
  ["CC0 written as cc-zero", { License: "cc-zero", LicenseShortName: "CC0" }],
  ["public domain", { License: "pd", LicenseShortName: "Public domain" }],
  ["public domain, old author", { License: "pd-old-100", LicenseShortName: "Public domain" }],
  ["CC BY 2.0", { License: "cc-by-2.0", LicenseShortName: "CC BY 2.0" }],
  ["CC BY-SA 4.0", { License: "cc-by-sa-4.0", LicenseShortName: "CC BY-SA 4.0" }],
  ["CC BY-SA 3.0 German port", { License: "cc-by-sa-3.0-de", LicenseShortName: "CC BY-SA 3.0 DE" }],
];
for (const [name, m] of ACCEPT) {
  const v = licenceVerdict(meta(m));
  check(`accepts ${name}`, v.ok, v.reason);
}

const REJECT: [string, Record<string, string>][] = [
  ["non-commercial", { License: "cc-by-nc-2.0", LicenseShortName: "CC BY-NC 2.0" }],
  ["non-commercial share alike", { License: "cc-by-nc-sa-4.0", LicenseShortName: "CC BY-NC-SA 4.0" }],
  ["no derivatives", { License: "cc-by-nd-3.0", LicenseShortName: "CC BY-ND 3.0" }],
  ["GFDL", { License: "gfdl", LicenseShortName: "GFDL" }],
  ["fair use", { License: "fairuse", LicenseShortName: "Fair use" }],
  ["no licence field at all", { LicenseShortName: "See the file page" }],
  ["an unrecognised code", { License: "attribution-only-weird", LicenseShortName: "Custom" }],
  ["free code, non-commercial wording", {
    License: "cc-by-4.0", LicenseShortName: "CC BY 4.0",
    UsageTerms: "Creative Commons Attribution, non-commercial use only",
  }],
];
for (const [name, m] of REJECT) {
  const v = licenceVerdict(meta(m));
  check(`rejects ${name}`, !v.ok, `it was accepted: ${v.reason}`);
}

// ---------------------------------------------------------------------------
console.log("\nB. Quality and subject: the file has to be a usable photograph of the place\n");

const guard: Guard = {
  requirePlace: ["lake nasser", "nasser"],
  require: [],
  deny: [],
  allowPlaces: ["nasser", "aswan"],
};

const base = {
  provider: "wikimedia" as const,
  id: "1",
  fullUrl: "https://upload.wikimedia.org/x.jpg",
  photographer: "A Photographer",
  pageUrl: "https://commons.wikimedia.org/w/index.php?curid=1",
  width: 3200,
  height: 2100,
  mime: "image/jpeg",
  licence: "",
  categories: "Lake Nasser",
  title: "File:Lake Nasser.jpg",
  description: "Blue water of Lake Nasser seen from the western shore at sunrise.",
};
const file = (over: Partial<CommonsCandidate> & { _meta?: any } = {}) => ({
  ...base,
  _meta: meta({ License: "cc-by-sa-4.0", LicenseShortName: "CC BY-SA 4.0" }),
  ...over,
}) as CommonsCandidate & { _meta: any };

{
  const v = screen(file(), guard);
  check("accepts a free, large, relevant photograph", v.ok, v.ok ? "" : v.reason);
}
{
  const v = screen(file({ width: 1200 }), guard);
  check(`rejects ${1200}px, under the ${MIN_WIDTH}px minimum`, !v.ok && v.reason.includes("minimum"), !v.ok ? v.reason : "accepted");
}
{
  const v = screen(file({ width: MIN_WIDTH }), guard);
  check(`accepts exactly ${MIN_WIDTH}px`, v.ok, v.ok ? "" : v.reason);
}
{
  const v = screen(file({ mime: "image/svg+xml" }), guard);
  check("rejects an SVG", !v.ok && v.reason.includes("photograph format"), !v.ok ? v.reason : "accepted");
}
{
  const v = screen(file({ mime: "application/pdf" }), guard);
  check("rejects a PDF", !v.ok, !v.ok ? v.reason : "accepted");
}
{
  const v = screen(file({ categories: "Engravings of Egypt Lake Nasser" }), guard);
  check("rejects an engraving found by its category", !v.ok && v.reason.includes("engraving"), !v.ok ? v.reason : "accepted");
}
{
  const v = screen(file({ title: "File:Map of Lake Nasser 1965.jpg" }), guard);
  check("rejects a map found by its title", !v.ok, !v.ok ? v.reason : "accepted");
}
{
  const v = screen(file({
    description: "Lithograph of the Nile above the cataract near Lake Nasser.",
  }), guard);
  check("rejects a lithograph found by its description", !v.ok, !v.ok ? v.reason : "accepted");
}
{
  // The one that matters. A beautiful, free, enormous photograph of the wrong lake.
  const v = screen(file({
    title: "File:Lake Qarun.jpg",
    categories: "Lake Qarun",
    description: "Blue water of Lake Qarun in Faiyum, Egypt, with reeds along the shore. Lake Nasser is further south.",
  }), guard);
  check("rejects a photograph of a different Egyptian lake", !v.ok, !v.ok ? v.reason : "accepted");
}
{
  const v = screen(file({ description: "" }), guard);
  check("rejects a file Commons describes not at all", !v.ok, !v.ok ? v.reason : "accepted");
}
{
  const v = screen(file({ _meta: meta({ License: "cc-by-nc-2.0", LicenseShortName: "CC BY-NC 2.0" }), width: 5000 }), guard);
  check("rejects a 5000px non-commercial file, however good", !v.ok && v.reason.includes("NC"), !v.ok ? v.reason : "accepted");
}

// ---------------------------------------------------------------------------
console.log("\nC. What ends up in the Media Library\n");

{
  const c = file({ licence: "CC BY-SA 4.0" });
  const caption = commonsCaption(c);
  check("caption names the photographer", caption.includes("A Photographer"), caption);
  check("caption names the licence", caption.includes("CC BY-SA 4.0"), caption);
  check("caption links the Commons file page", caption.includes("commons.wikimedia.org"), caption);
}
{
  const caption = commonsCaption(file({ photographer: "", licence: "CC0" }));
  check("caption says so when Commons names nobody", caption.includes("unnamed contributor"), caption);
}
{
  check("Artist HTML is reduced to a name", plain('<a href="/wiki/User:JDoe" title="x">John Doe</a>') === "John Doe");
  check("a file name reads as words", titleToWords("File:Abu_Simbel_temples-2019.jpg") === "Abu Simbel temples 2019");
}
check(`the preferred width is above the minimum`, PREFER_WIDTH > MIN_WIDTH);

console.log(failures === 0 ? "\nAll Wikimedia guard cases passed." : `\n${failures} case(s) FAILED.`);
process.exit(failures === 0 ? 0 : 1);
