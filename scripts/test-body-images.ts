// Checks for client/src/lib/body-images.ts, which edits the alt text of images
// embedded in a post's body HTML from the admin.
//
// The risk being guarded against is a one word alt change rewriting the whole
// article body, so most of these assert that everything OTHER than the alt and
// its mirrored caption comes out byte identical.
//
//   npx tsx scripts/test-body-images.ts

import { parseBodyImages, setBodyImageAlt } from "../client/src/lib/body-images";

const body = `<p>Intro.</p>
<h2>One</h2>
<p>Text with an <a href="/x">inline link</a>.</p>
<figure><img src="/api/assets/uploads/a.webp" alt="Terraces and cliffs at Hatshepsut Temple" loading="lazy" width="1600" height="1067"><figcaption>Terraces and cliffs at Hatshepsut Temple</figcaption></figure>
<h2>Two</h2>
<table><tr><td>keep &amp; me</td></tr></table>
<figure><img src="/api/assets/uploads/b.webp" alt="A boat at Nile River" loading="lazy" width="1600" height="1067"><figcaption>A different caption already</figcaption></figure>
<p>End with an <img src="/api/assets/uploads/c.webp"> with no alt at all.</p>`;

let fails = 0;
const ok = (label: string, cond: boolean, extra = "") => {
  if (!cond) fails++;
  console.log(`${cond ? "PASS" : "FAIL"}  ${label}${extra ? "  " + extra : ""}`);
};

const imgs = parseBodyImages(body);
ok("finds all 3 images", imgs.length === 3, `got ${imgs.length}`);
ok("reads src", imgs[0].src === "/api/assets/uploads/a.webp");
ok("reads alt", imgs[0].alt === "Terraces and cliffs at Hatshepsut Temple");
ok("reads caption when present", imgs[0].caption === "Terraces and cliffs at Hatshepsut Temple");
ok("caption null when the img has none", imgs[2].caption === null);
ok("empty alt reads as empty", imgs[2].alt === "");

// 1. Mirrored caption follows the alt.
const a = setBodyImageAlt(body, 0, "Three terraces of Hatshepsut's temple cut into the cliff at Luxor");
const pa = parseBodyImages(a);
ok("alt updated", pa[0].alt === "Three terraces of Hatshepsut's temple cut into the cliff at Luxor");
ok("mirrored caption followed", pa[0].caption === "Three terraces of Hatshepsut's temple cut into the cliff at Luxor");

// 2. A caption that was already different is left alone.
const b = setBodyImageAlt(body, 1, "New alt for the boat");
const pb = parseBodyImages(b);
ok("alt updated on image 2", pb[1].alt === "New alt for the boat");
ok("divergent caption untouched", pb[1].caption === "A different caption already");

// 3. An img with no alt gets one added.
const c = setBodyImageAlt(body, 2, "Added alt");
ok("alt added where there was none", parseBodyImages(c)[2].alt === "Added alt");

// 4. Nothing else in the body changes.
const untouched = (before: string, after: string) => {
  const strip = (s: string) => s.replace(/<img\b[^>]*>/gi, "IMG").replace(/<figcaption[^>]*>[\s\S]*?<\/figcaption>/gi, "CAP");
  return strip(before) === strip(after);
};
ok("rest of the body byte identical", untouched(body, a) && untouched(body, b) && untouched(body, c));
ok("table and entities survive", a.includes("<table><tr><td>keep &amp; me</td></tr></table>"));
ok("other attributes survive", a.includes('loading="lazy" width="1600" height="1067"'));

// 5. Quotes in the alt are escaped rather than breaking the tag.
const d = setBodyImageAlt(body, 0, 'A "quoted" phrase & an ampersand');
ok("quotes escaped in the attribute", d.includes('alt="A &quot;quoted&quot; phrase &amp; an ampersand"'));
ok("escaped alt reads back correctly", parseBodyImages(d)[0].alt === 'A "quoted" phrase & an ampersand');
ok("still exactly 3 images after escaping", parseBodyImages(d).length === 3);

// 6. Out of range index is a no-op.
ok("out of range index is a no-op", setBodyImageAlt(body, 9, "x") === body);

console.log(fails === 0 ? "\nAll body image cases passed." : `\n${fails} failure(s)`);
process.exit(fails === 0 ? 0 : 1);
