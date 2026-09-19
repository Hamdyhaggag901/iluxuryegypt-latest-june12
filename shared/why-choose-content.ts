// How the Why Us ledger packs two strings into one database column.
//
// The section shows a paragraph and a short pull quote for each of its five
// terms, and why_choose_cards has one `content` column. A second column would
// mean a migration against a live table plus changes to the insert schema, the
// CMS routes and the admin form, all for one short string. A marker inside the
// existing column costs a split, and the admin dialog shows the two halves as
// separate inputs so nobody has to type the marker by hand.
//
// Shared rather than local to either side, because the component reads this
// and the admin form writes it, and a second copy of the marker in one of them
// would break the other the day somebody changed it.

export const PULL_QUOTE_MARKER = "::pull::";

/** Splits stored content into its paragraph and its pull quote. */
export function splitCardContent(content: string | null | undefined): {
  body: string;
  pullQuote: string;
} {
  const [body, pullQuote = ""] = String(content ?? "").split(PULL_QUOTE_MARKER);
  return { body: body.trim(), pullQuote: pullQuote.trim() };
}

/** Packs them back together. An empty pull quote stores no marker at all. */
export function joinCardContent(body: string, pullQuote: string): string {
  const quote = pullQuote.trim();
  return quote ? `${body.trim()}\n${PULL_QUOTE_MARKER}\n${quote}` : body.trim();
}

/**
 * The display heading is two lines and the second is italic. The admin field
 * is a single line input, so the break travels as a marker here too, and a
 * title saved without one simply renders as a single line.
 */
export const HEADING_BREAK = "::";
