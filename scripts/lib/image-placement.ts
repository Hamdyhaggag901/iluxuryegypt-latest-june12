// The decisions a fill or replace run makes about one image position, with no
// database and no network in them, so they can be tested directly.
//
// The rule these exist to enforce: a position that already holds an image is
// never emptied. A replacement that finds nothing is a no-op. The body is only
// ever edited after a candidate has been confirmed AND downloaded, and the
// removal and the insertion happen in one string operation, so there is no
// moment, not even inside this process, at which the position is empty.

import { composeAlt, findInventedWords } from "./provider-images";
import { figureAtAfterH2, insertFigureAfterH2, type PostSpec, type ImageSpec } from "./post-image-specs";

export type Action = "pinned" | "keep" | "fill" | "replace";

export interface PositionState {
  /** Is there an image at this position now? */
  filled: boolean;
  /** Was it placed by hand? */
  pinned: boolean;
  /** Did the run ask for existing images to be re-sourced? */
  replaceMode: boolean;
}

/**
 * What to do with one position, before any search happens.
 *
 * "keep" and "pinned" both mean leave it alone; they are separate so the report
 * can say which, because "we did not try" and "you told us not to" are
 * different answers to the owner asking why a picture did not change.
 */
export function decideAction(state: PositionState): Action {
  if (state.pinned) return "pinned";
  if (!state.filled) return "fill";
  return state.replaceMode ? "replace" : "keep";
}

/**
 * What to do once the search has finished.
 *
 * This is the guarantee in one line: without a candidate, a filled position
 * keeps what it has and an empty one stays empty. Nothing is ever removed on
 * the strength of an intention to put something better there.
 */
export function outcomeFor(action: Action, foundCandidate: boolean): "pinned" | "kept" | "skipped" | "set" | "replaced" {
  if (action === "pinned") return "pinned";
  if (action === "keep") return "kept";
  if (!foundCandidate) return action === "replace" ? "kept" : "skipped";
  return action === "replace" ? "replaced" : "set";
}

/**
 * Swaps the figure at a position for a new one, in a single splice.
 *
 * Returns the body unchanged if there is no figure there, which makes calling
 * it on an empty position harmless rather than destructive.
 */
export function replaceFigureAfterH2(body: string, h2Index: number, figureHtml: string): string {
  const span = figureAtAfterH2(body, h2Index);
  if (!span) return insertFigureAfterH2(body, h2Index, figureHtml);
  return body.slice(0, span.start) + figureHtml + body.slice(span.end);
}

export function figureHtmlFor(url: string, alt: string): string {
  const escaped = alt.replace(/"/g, "&quot;");
  return `<figure><img src="${url}" alt="${escaped}" loading="lazy" width="1600" height="1067">` +
    `<figcaption>${escaped}</figcaption></figure>\n`;
}

/** The alt already on an image, so a kept position still counts toward the rules. */
export function existingAlt(figureHtml: string): string {
  return (figureHtml.match(/<img[^>]*\balt="([^"]*)"/i)?.[1] ?? "")
    .replace(/&quot;/g, '"').replace(/&amp;/g, "&");
}

export type AltResult =
  | { alt: string; tier: string; carriesKeyword: boolean }
  | { refused: string };

/**
 * The alt for one chosen photograph, obeying the one-keyword-per-post rule.
 *
 * Five of these posts have a focus keyword that IS the place name: medinet
 * habu, coptic cairo, islamic cairo, kom ombo temple, dendera temple egypt.
 * Every position on them produces the keyword naturally, and the previous
 * behaviour was to compose all four and then reject the post for breaking the
 * rule, which cost the whole commit. Here the position that owns the keyword
 * keeps the name and the others are composed again, located by city instead.
 */
export function composeAltForPosition(
  post: Pick<PostSpec, "focusKeyword" | "keywordSuffix">,
  spec: Pick<ImageSpec, "place" | "city" | "keyword">,
  description: string,
  keywordSpent: boolean
): AltResult {
  const keyword = post.focusKeyword.toLowerCase();
  const wantsKeyword = Boolean(spec.keyword) && !keywordSpent;
  const suffix = wantsKeyword ? post.keywordSuffix : undefined;
  const hasKeyword = (alt: string) => alt.toLowerCase().includes(keyword);

  const first = composeAlt(description, spec.place, spec.city, { suffix, placeConfirmed: true });
  if (!first) return { refused: "description too thin to write an honest alt" };

  if (wantsKeyword || !hasKeyword(first.alt)) {
    const invented = findInventedWords(first.alt, description, spec.place, spec.city, suffix);
    if (invented.length > 0) return { refused: `alt would invent: ${invented.join(", ")}` };
    return { alt: first.alt, tier: first.tier, carriesKeyword: hasKeyword(first.alt) };
  }

  // This position does not own the keyword and its natural alt contains it.
  const retry = composeAlt(description, spec.place, spec.city, { placeConfirmed: true, avoidPlaceName: true });
  if (!retry) return { refused: "cannot phrase this one without the focus keyword" };
  if (hasKeyword(retry.alt)) return { refused: "the focus keyword survives even without the place name" };
  const invented = findInventedWords(retry.alt, description, spec.place, spec.city, undefined);
  if (invented.length > 0) return { refused: `alt would invent: ${invented.join(", ")}` };
  return { alt: retry.alt, tier: retry.tier, carriesKeyword: false };
}
