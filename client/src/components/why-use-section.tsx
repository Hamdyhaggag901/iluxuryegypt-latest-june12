import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { splitCardContent, HEADING_BREAK } from "@shared/why-choose-content";

/**
 * The five terms, as a ledger.
 *
 * This section used to be four photo cards with two word abstract titles and a
 * paragraph of superlatives each. Every competitor in this market writes the
 * same four claims in the same words, so the section told a reader nothing.
 * What replaced it is five specific things the business actually does, set as
 * an ordered list of terms with a rule between each one.
 *
 * No photography, deliberately. There is no first hand photography yet, and
 * the stock images that were here are the same ones the competition uses, so a
 * picture led layout would have argued against the copy.
 *
 * Colours are written as fixed hex values rather than the site's semantic
 * tokens. Those tokens flip with the light and dark themes; this section is
 * dark in both, so a token would be wrong in one of them. Measured against the
 * #12100e ground: display 16.6:1, body 10.6:1, numerals and lede 7.0:1, the
 * pull quote 8.1:1.
 */

interface Claim {
  id: string;
  title: string;
  body: string;
  pullQuote: string;
}

const fallbackSection = {
  title: `Five things we will${HEADING_BREAK}put in writing`,
  subtitle: "Every line below is a term of business. If one of them stops being true, this page changes.",
  isActive: true,
};

const fallbackClaims: Claim[] = [
  {
    id: "price",
    title: "The price is on the page",
    body: "You will not be asked to enquire before you are told what this costs. Our itineraries start at 4,000 USD per person, and that number is published rather than negotiated into existence after a discovery call.",
    pullQuote: "From 4,000 USD per person",
  },
  {
    id: "party",
    title: "One party. Never a group",
    body: "No coaches, no fixed departures, no strangers on your itinerary. The car, the driver and the guide belong to your party for the length of the journey.",
    pullQuote: "Your party only, start to finish",
  },
  {
    id: "access",
    title: "Temples before they open",
    body: "Private access arranged in advance, so you stand in front of the great facade at first light with no one else in the frame.",
    pullQuote: "Access outside public hours",
  },
  {
    id: "dahabiya",
    title: "A private dahabiya, not a deck of cabins",
    body: "A wooden sailing boat that moves at the river's pace and moors where the schedule does not reach.",
    pullQuote: "The whole boat, your party",
  },
  {
    id: "planner",
    title: "Planned by the person who guided it",
    body: "Your itinerary is built from the first call by a former guide who has walked these sites, not assembled from a template by a booking desk.",
    pullQuote: "One planner, first call to last day",
  },
];

/** Row markers. The rows are an ordered list of terms, which is what a ledger is. */
const NUMERALS = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii"];

export default function WhyUseSection() {
  // Null until someone touches a row, so the first row can start open and
  // still be closable. Defaulting openId to the first id instead would make
  // that row impossible to close.
  const [openId, setOpenId] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const { data } = useQuery({
    queryKey: ["publicWhyChooseSection"],
    queryFn: async () => {
      const response = await fetch("/api/public/why-choose-section");
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });

  const section = data?.section || fallbackSection;
  const dbCards = data?.cards || [];

  // image_url is still on the row and is no longer read by this section. The
  // column is left alone rather than dropped, so nothing that writes it breaks.
  //
  // The endpoint returns inactive rows as well as active ones, so the filter
  // is here. Once the table has rows at all, they are the source of truth even
  // if an editor has switched every one of them off: falling back to the copy
  // below in that case would put back the thing they just took down.
  type DbCard = { id: string; title: string; content: string; isActive?: boolean };
  const claims: Claim[] = dbCards.length > 0
    ? dbCards
        .filter((card: DbCard) => card.isActive !== false)
        .map((card: DbCard) => ({
          id: card.id,
          title: card.title,
          ...splitCardContent(card.content),
        }))
    : fallbackClaims;

  if (data?.section && !section.isActive) return null;
  if (claims.length === 0) return null;

  const activeId = touched ? openId : claims[0].id;
  const [headingLine, headingItalic] = String(section.title ?? "").split(HEADING_BREAK);

  return (
    <section
      className="bg-[#12100e] py-20 md:py-28 lg:py-36"
      aria-labelledby="why-us-heading"
      data-testid="why-us-section"
    >
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <h2
          id="why-us-heading"
          className="font-serif text-[2rem] leading-[1.1] tracking-[-0.01em] text-[#f4efe6] sm:text-5xl lg:text-6xl"
        >
          <span className="block">{headingLine}</span>
          {headingItalic && <span className="block italic">{headingItalic}</span>}
        </h2>

        {section.subtitle && (
          <p className="mt-6 max-w-[46ch] text-[0.9375rem] leading-[1.7] text-[#a49c8e] sm:text-base">
            {section.subtitle}
          </p>
        )}

        <ol className="mt-12 border-t border-[#f4efe6]/[0.14] md:mt-16">
          {claims.map((claim, index) => {
            const isOpen = activeId === claim.id;
            const buttonId = `why-us-term-${claim.id}`;
            const panelId = `why-us-panel-${claim.id}`;

            return (
              <li key={claim.id} className="border-b border-[#f4efe6]/[0.14]">
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => {
                      setTouched(true);
                      setOpenId(isOpen ? null : claim.id);
                    }}
                    className="group flex w-full items-baseline gap-4 py-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bfa773] focus-visible:ring-offset-4 focus-visible:ring-offset-[#12100e] sm:gap-6 md:py-7"
                    data-testid={`why-us-term-${index + 1}`}
                  >
                    <span
                      aria-hidden="true"
                      className="w-6 shrink-0 font-serif text-sm text-[#a49c8e] sm:w-8 sm:text-base"
                    >
                      {NUMERALS[index] ?? String(index + 1)}
                    </span>

                    <span className="flex-1 font-serif text-xl leading-snug text-[#f4efe6] sm:text-2xl lg:text-[1.75rem]">
                      {claim.title}
                    </span>

                    {/* The one piece of motion: the bar that answers the click. */}
                    <span
                      aria-hidden="true"
                      className="relative mt-2 block h-3 w-3 shrink-0 self-start text-[#a49c8e] sm:h-3.5 sm:w-3.5"
                    >
                      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
                      <span
                        className={`absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current transition-transform duration-300 ease-out motion-reduce:transition-none ${
                          isOpen ? "scale-y-0" : "scale-y-100"
                        }`}
                      />
                    </span>
                  </button>
                </h3>

                {/* Rendered whether it is open or not, and clipped with
                    max-height. A crawler reads collapsed text as long as it is
                    in the markup, and conditionally rendering it would take the
                    five paragraphs out of the page entirely. */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  aria-hidden={!isOpen}
                  // 36rem is roughly twice the tallest of these panels at 360px
                  // wide, which leaves room for a longer paragraph from the
                  // admin without clipping it. Raising it further would not
                  // clip anything either, it would just make the closing
                  // animation appear to hang before the row visibly moves.
                  className={`overflow-hidden transition-[max-height] duration-500 ease-out motion-reduce:transition-none ${
                    isOpen ? "max-h-[36rem]" : "max-h-0"
                  }`}
                >
                  <div className="pb-8 pl-10 pr-0 sm:pl-14 md:pb-10">
                    <p className="max-w-[48ch] text-[0.9375rem] leading-[1.75] text-[#c9c0b2] sm:text-base">
                      {claim.body}
                    </p>
                    {claim.pullQuote && (
                      <p className="mt-6 border-l border-[#bfa773] pl-4 font-serif text-lg leading-snug text-[#bfa773] sm:text-xl">
                        {claim.pullQuote}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <p className="mt-12 text-[0.9375rem] text-[#a49c8e] md:mt-16">
          <Link
            href="/contact"
            className="border-b border-[#a49c8e]/50 pb-0.5 text-[#f4efe6] transition-colors hover:border-[#bfa773] hover:text-[#bfa773] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bfa773] focus-visible:ring-offset-4 focus-visible:ring-offset-[#12100e]"
            data-testid="why-us-contact-link"
          >
            Ask for an itinerary
          </Link>
        </p>
      </div>
    </section>
  );
}
