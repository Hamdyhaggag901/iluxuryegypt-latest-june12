// Plain regex strip — no DOM API involved, so this runs identically on the
// server (Node has no `document`) and in the browser. Used wherever a rich
// text field (which can now contain real markup) needs to feed a plain-text
// context, e.g. an auto-generated meta description.
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
