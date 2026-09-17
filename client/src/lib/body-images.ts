// Reading and editing the alt text of images embedded in a post's body HTML.
//
// Body figures live as raw HTML inside posts.body_en, which is the same string
// the page renders. Keeping the alt there rather than in a parallel column
// means there is one source of truth: what you edit is what renders, a figure
// moved in the editor takes its alt with it, and anything that consumes
// body_en directly (the API, an export, a copy and paste) sees the real value.
//
// Writing back is done by replacing the whole <img ...> tag as a substring
// rather than by re-serialising the parsed document. Serialising would
// normalise quoting, self closing slashes and entity escapes across the entire
// body, producing a huge diff for a one word change and risking the tables and
// figures already in these articles.

export interface BodyImage {
  /** Position among the <img> tags in the body, 0 based. */
  index: number;
  src: string;
  alt: string;
  /** Visible caption, when the image sits inside a <figure> that has one. */
  caption: string | null;
}

const IMG_TAG = /<img\b[^>]*>/gi;

function attr(tag: string, name: string): string | null {
  const m = tag.match(new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`, "i"))
    ?? tag.match(new RegExp(`\\b${name}\\s*=\\s*'([^']*)'`, "i"));
  return m ? decodeEntities(m[1]) : null;
}

function decodeEntities(value: string): string {
  if (typeof document === "undefined") {
    return value.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
  }
  const el = document.createElement("textarea");
  el.innerHTML = value;
  return el.value;
}

function encodeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Every image in the body, in document order. */
export function parseBodyImages(html: string): BodyImage[] {
  const out: BodyImage[] = [];
  let index = 0;
  for (const match of Array.from(html.matchAll(IMG_TAG))) {
    const tag = match[0];
    const src = attr(tag, "src") ?? "";
    // The caption, if this img is wrapped in a figure that has one. Looked up
    // from the text following the tag so a figure without a caption yields null.
    const after = html.slice(match.index! + tag.length, match.index! + tag.length + 600);
    const capMatch = after.match(/^\s*<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);
    out.push({
      index: index++,
      src,
      alt: attr(tag, "alt") ?? "",
      caption: capMatch ? decodeEntities(capMatch[1].replace(/<[^>]+>/g, "")).trim() : null,
    });
  }
  return out;
}

/**
 * Sets the alt of the image at `index`. When the figure's visible caption
 * currently matches the old alt, which is how fill-post-images.ts writes them,
 * the caption follows along; once they have been deliberately made different
 * the caption is left alone.
 */
export function setBodyImageAlt(html: string, index: number, alt: string): string {
  const matches = Array.from(html.matchAll(IMG_TAG));
  const match = matches[index];
  if (!match) return html;

  const tag = match[0];
  const oldAlt = attr(tag, "alt") ?? "";
  const encoded = encodeAttr(alt);

  const newTag = /\balt\s*=\s*["']/i.test(tag)
    ? tag.replace(/\balt\s*=\s*"[^"]*"/i, `alt="${encoded}"`).replace(/\balt\s*=\s*'[^']*'/i, `alt="${encoded}"`)
    : tag.replace(/^<img\b/i, `<img alt="${encoded}"`);

  const start = match.index!;
  const end = start + tag.length;
  let result = html.slice(0, start) + newTag + html.slice(end);

  // Keep a mirrored caption in step, measured against the body AFTER the tag
  // was swapped so the offsets are still correct.
  const afterStart = start + newTag.length;
  const after = result.slice(afterStart, afterStart + 600);
  const capMatch = after.match(/^(\s*<figcaption[^>]*>)([\s\S]*?)(<\/figcaption>)/i);
  if (capMatch && capMatch[2].replace(/<[^>]+>/g, "").trim() === oldAlt.trim() && oldAlt.trim() !== "") {
    const capStart = afterStart + capMatch.index!;
    result =
      result.slice(0, capStart) +
      capMatch[1] + encodeAttr(alt).replace(/&quot;/g, '"') + capMatch[3] +
      result.slice(capStart + capMatch[0].length);
  }

  return result;
}
