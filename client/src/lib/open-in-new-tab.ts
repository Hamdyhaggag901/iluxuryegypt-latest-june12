import type { MouseEvent } from "react";

// wouter v3's <Link> intercepts every plain left-click for client-side SPA
// navigation regardless of the `target` prop — it only skips that
// interception for a modifier-key click (ctrl/cmd/alt/shift) or a
// non-primary mouse button, never for target="_blank" itself (confirmed in
// node_modules/wouter/esm/index.js's onClick handler). So a <Link
// target="_blank"> renders the attribute correctly in the DOM, but a real
// left-click still navigates the current tab — verified live via Playwright
// (a real click, not just reading the rendered attribute).
//
// Pass this as the Link's own onClick alongside target="_blank"
// rel="noopener noreferrer": it calls preventDefault() before wouter's
// handler gets to (which is what stops wouter's own preventDefault+navigate
// from running, since it only fires when the event isn't already
// defaultPrevented), then opens the link's real href with window.open() to
// reproduce the native new-tab behavior the target attribute alone can't
// deliver here. Right-click "open in new tab", middle-click, and ctrl/cmd
// click aren't affected by this bug (wouter already skips its own
// interception for those) and work natively either way.
export function openLinkInNewTab(event: MouseEvent<HTMLAnchorElement>): void {
  event.preventDefault();
  window.open(event.currentTarget.href, "_blank", "noopener,noreferrer");
}
