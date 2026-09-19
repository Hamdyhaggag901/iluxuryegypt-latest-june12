// The homepage intro paragraph, in one place.
//
// The hero slider renders entirely on the client from the hero_slides table,
// so none of the text inside it reaches a crawler that runs no JavaScript.
// This paragraph is the one place on the homepage where the phrases the page
// targets can actually be read by a search engine, which is why it exists and
// why it has to be in the server rendered HTML rather than only in React.
//
// Server (server/seo-content.ts) and client (client/src/pages/home.tsx) both
// read this constant. Two copies would drift the moment either was edited, and
// a crawler reading one wording while a visitor sees another is the exact
// problem this paragraph was added to avoid.
//
// The wording is keyword research, not prose to tidy: leave it alone unless
// asked to change it. It is plain text, and both renderers escape it.

export const HOME_INTRO_PARAGRAPH =
  "We build egypt private tours for a single travelling party — no coaches, " +
  "no fixed departures. Our egypt luxury private tours run seven to fourteen " +
  "days and start at 4,000 USD per person, covering Cairo, Luxor, Aswan, Abu " +
  "Simbel and the Western Desert. Our luxury egypt vacation packages include " +
  "hotels, transfers, entrance fees and guiding.";
