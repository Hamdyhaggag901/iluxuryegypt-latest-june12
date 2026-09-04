import DOMPurify from "dompurify";

// Thin wrapper so every rich-text render site imports one thing and gets
// DOMPurify's default (safe, permissive-enough-for-Tiptap-output) config —
// strips <script>, event handler attributes, javascript: hrefs, etc.
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html);
}
