import { useState } from "react";
import { useSEO } from "@/hooks/use-seo";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import ScrollToTopButton from "../components/scroll-to-top-button";
import ExperienceCard from "../components/experience-card";
import TripBuilderModal from "../components/trip-builder-modal";

const GREAT_PYRAMID = "https://iluxuryegypt.com/api/assets/uploads/9dff839b-b0b2-43c2-b43c-f9e56900e392.webp";
const LUXOR_TEMPLE = "https://iluxuryegypt.com/api/assets/uploads/957e080e-b0c1-4a40-8db8-49b317460747.webp";
const EGYPTIAN_MUSEUM = "https://iluxuryegypt.com/api/assets/uploads/8cc1ba23-71a6-4635-a217-ddda9c4a48f8.webp";
const EXCAVATION_SITE = "https://iluxuryegypt.com/api/assets/uploads/179e2e5e-fd76-447b-843d-7a9a187c43ec.webp";

const EXPERIENCES = [
  {
    title: "The Great Pyramid, Before the World Wakes",
    subtitle: "The King's Chamber, before the gates open",
    body: "Long before the first tour bus arrives, a private permit unlocks the last standing wonder of the ancient world for you alone. Descend through the ascending passage into the King's Chamber, and where access allows, the seldom-opened Queen's Chamber beyond it. In the hush of early morning, with no crowds pressing behind you, the scale and silence of the Great Pyramid become impossible to forget.",
    image: GREAT_PYRAMID,
    alt: "The Great Pyramid of Giza at sunrise",
  },
  {
    title: "Between the Paws of the Sphinx",
    subtitle: "Standing where pharaohs once stood",
    body: "The Sphinx's own enclosure is rarely opened to visitors, who typically view it from a distance behind a rope line. Our private arrangement brings you inside — close enough to trace the weathering on five thousand years of limestone, standing at eye level with a monument most travelers only ever photograph from afar, as the desert light shifts across its face.",
    image: GREAT_PYRAMID,
    alt: "The Great Sphinx of Giza close up",
  },
  {
    title: "Luxor Temple, Lit Only for You",
    subtitle: "The colonnades, entirely your own",
    body: "By day, Luxor Temple draws crowds through its avenue of columns. After the gates close to the public, a private evening visit transforms it completely. Floodlights pick out carved reliefs invisible in daylight, the Nile breeze replaces the afternoon heat, and for an hour the temple's colossal statues and colonnaded courts belong to no one but you.",
    image: LUXOR_TEMPLE,
    alt: "Luxor Temple illuminated at night",
  },
  {
    title: "The Egyptian Museum, After Hours",
    subtitle: "Five thousand years, without a single crowd",
    body: "Tutankhamun's golden mask, the royal mummy rooms, halls of statuary spanning three millennia — normally shared with thousands of daily visitors. A private after-hours visit removes the crowds entirely. Move at your own pace between galleries, linger as long as a piece holds your attention, and experience Cairo's greatest collection the way it was meant to be studied: quietly, and alone.",
    image: EGYPTIAN_MUSEUM,
    alt: "Egyptian Museum exhibition hall in Cairo",
  },
  {
    title: "Where Egypt's Past Is Still Being Uncovered",
    subtitle: "Archaeology, witnessed firsthand",
    body: "Beyond the monuments already open to the public, Egypt's excavation sites are still yielding discoveries. Where access can be arranged, step onto an active dig and meet the archaeologists piecing together the country's next chapter. It's a rare vantage point — not a finished exhibit, but history in the process of being written, one carefully brushed layer of sand at a time.",
    image: EXCAVATION_SITE,
    alt: "An active archaeological excavation site in Egypt",
  },
  {
    title: "The Step Pyramid, Egypt's First Wonder",
    subtitle: "Where pyramid-building began",
    body: "Before Giza's smooth-sided giants, there was Djoser's Step Pyramid at Saqqara — the world's oldest large-scale stone structure, and the prototype for everything that followed. Saqqara draws a fraction of Giza's visitors, so a private tour here feels closer to discovery than sightseeing. A knowledgeable guide walks you through the origins of pyramid design, in near-total quiet.",
    image: GREAT_PYRAMID,
    alt: "The Step Pyramid of Djoser at Saqqara",
  },
  {
    title: "The Hidden Vaults of the Egyptian Museum",
    subtitle: "Egyptology, still in progress",
    body: "Beneath the Egyptian Museum's public galleries lies a basement most visitors never see — storerooms of artifacts still being catalogued, conserved, and studied by resident Egyptologists. Where special access can be arranged, a private visit offers a glimpse of the discipline at work: the ongoing, painstaking process behind everything eventually placed on public display.",
    image: EGYPTIAN_MUSEUM,
    alt: "Storage vaults beneath the Egyptian Museum",
  },
];

export default function PrivateAccess() {
  const [isTripBuilderOpen, setIsTripBuilderOpen] = useState(false);
  const [activeExperience, setActiveExperience] = useState<string | undefined>(undefined);

  useSEO({
    title: "Private Access Tours in Egypt | Exclusive VIP Experiences – iLuxuryEgypt",
    description:
      "Step beyond the ropes and crowds with permit-secured private access to the Great Pyramid, the Sphinx, Luxor Temple and more — Egypt's most guarded places, opened only for you.",
  });

  const openTripBuilder = (experienceTitle: string) => {
    setActiveExperience(experienceTitle);
    setIsTripBuilderOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <section className="relative" data-testid="private-access-hero">
          <div className="relative h-[60vh] min-h-[440px] md:min-h-[560px] w-full overflow-hidden">
            <img
              src={GREAT_PYRAMID}
              alt="The Great Sphinx and Pyramids of Giza at dawn"
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-black/55" />
            <div className="absolute inset-0 flex items-center justify-center text-center px-4">
              <div>
                <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-4">Private Access</h1>
                <p className="text-white/85 text-lg max-w-xl mx-auto">
                  Egypt&rsquo;s most guarded monuments, opened only for you.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24" data-testid="private-access-intro">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-5">
              Reserved for the Privileged Few
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Some places in Egypt were never meant to be seen by crowds. Through permits secured directly with
              Egyptian authorities, we open doors that remain closed to the public — quiet hours inside the
              world&rsquo;s greatest monuments, granted to a privileged few.
            </p>
          </div>
        </section>

        <section className="pb-20 md:pb-28" data-testid="private-access-list">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10 md:gap-14">
            {EXPERIENCES.map((experience, i) => (
              <ExperienceCard
                key={experience.title}
                index={i + 1}
                eyebrow="Private Access"
                title={experience.title}
                subtitle={experience.subtitle}
                description={experience.body}
                image={experience.image}
                imageAlt={experience.alt}
                reverse={i % 2 === 1}
                onMoreInfo={() => openTripBuilder(experience.title)}
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTopButton />
      <TripBuilderModal
        open={isTripBuilderOpen}
        onOpenChange={setIsTripBuilderOpen}
        contextLabel={activeExperience}
      />
    </div>
  );
}
