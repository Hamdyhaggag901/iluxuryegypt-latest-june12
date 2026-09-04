// Tour descriptions used to be stored as plain text; the WysiwygEditor now
// stores real HTML. Old rows still hold plain text, detected here by the
// simple absence of any HTML tag. Rather than a one-time DB migration, this
// runs at render time so every existing tour immediately gets real paragraph
// breaks — an admin only needs to open one in the editor if they want to add
// further formatting, not just to fix squished text.
export function legacyTextToHtml(raw: string): string {
  const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(raw);
  if (looksLikeHtml) return raw;

  const escaped = raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const paragraphs = escaped
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) return "";
  return paragraphs.map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`).join("");
}
