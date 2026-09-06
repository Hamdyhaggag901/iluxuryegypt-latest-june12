import { motion } from "framer-motion";
import { useSEO } from "@/hooks/use-seo";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import ScrollToTopButton from "../components/scroll-to-top-button";

const GREAT_PYRAMID = "https://iluxuryegypt.com/api/assets/uploads/9dff839b-b0b2-43c2-b43c-f9e56900e392.webp";
const LUXOR_TEMPLE = "https://iluxuryegypt.com/api/assets/uploads/957e080e-b0c1-4a40-8db8-49b317460747.webp";
const EGYPTIAN_MUSEUM = "https://iluxuryegypt.com/api/assets/uploads/8cc1ba23-71a6-4635-a217-ddda9c4a48f8.webp";
const EXCAVATION_SITE = "https://iluxuryegypt.com/api/assets/uploads/179e2e5e-fd76-447b-843d-7a9a187c43ec.webp";

const MOMENTS = [
  {
    title: "The Great Pyramid, Before the World Wakes",
    body: "Step inside the last standing wonder of the ancient world in complete solitude. Your private permit grants entry to the King's Chamber and the rarely-opened Queen's Chamber, hours before the gates open to the public.",
    image: GREAT_PYRAMID,
    alt: "The Great Pyramid of Giza at sunrise",
  },
  {
    title: "Between the Paws of the Sphinx",
    body: "Few travelers are ever granted entry into the Sphinx's own enclosure. Stand where pharaohs once stood, close enough to read the weathered stone, as the desert wakes around you.",
    image: GREAT_PYRAMID,
    alt: "The Great Sphinx of Giza close up",
  },
  {
    title: "Luxor Temple, Lit Only for You",
    body: "When the crowds leave and the gates close, Luxor Temple is transformed. Walk its colonnades under floodlight and starlight, with the ancient stones entirely your own.",
    image: LUXOR_TEMPLE,
    alt: "Luxor Temple illuminated at night",
  },
  {
    title: "The Egyptian Museum, After Hours",
    body: "Cairo's treasures — from golden masks to royal mummies — are yours to study without a single other visitor in sight. A private evening among five thousand years of history.",
    image: EGYPTIAN_MUSEUM,
    alt: "Egyptian Museum exhibition hall in Cairo",
  },
  {
    title: "Where Egypt's Past Is Still Being Uncovered",
    body: "Step onto an active excavation site and witness archaeology as it happens. Meet the teams unearthing Egypt's next chapter, in places closed to all but a select few.",
    image: EXCAVATION_SITE,
    alt: "An active archaeological excavation site in Egypt",
  },
  {
    title: "The Step Pyramid, Egypt's First Wonder",
    body: "Before Giza, there was Saqqara. Explore the world's oldest monumental stone structure in near-total privacy, guided through the origins of pyramid building itself.",
    image: GREAT_PYRAMID,
    alt: "The Step Pyramid of Djoser at Saqqara",
  },
  {
    title: "The Hidden Vaults of the Egyptian Museum",
    body: "Beneath the museum's public halls lies a basement rarely opened to outsiders — artifacts still being catalogued, studied, and preserved. A rare look at Egyptology in progress.",
    image: EGYPTIAN_MUSEUM,
    alt: "Storage vaults beneath the Egyptian Museum",
  },
];

export default function PrivateAccess() {
  useSEO({
    title: "Private Access | Egypt's Most Guarded Places, Opened Only for You | iLuxury Egypt",
    description:
      "Permit-secured, private access to Egypt's most guarded monuments — the Great Pyramid, the Sphinx, Luxor Temple, and more, opened only for you.",
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <section className="pt-32 md:pt-40 pb-16 md:pb-24" data-testid="private-access-header">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-accent font-medium">
              Private Access
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mt-4 mb-6">
              Egypt&rsquo;s Most Guarded Places, Opened Only for You
            </h1>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Some places in Egypt were never meant to be seen by crowds. Through permits secured directly with
              Egyptian authorities, we open doors that remain closed to the public — quiet hours inside the
              world&rsquo;s greatest monuments, granted to a privileged few.
            </p>
          </div>
        </section>

        <section className="pb-20 md:pb-28" data-testid="private-access-gallery">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {MOMENTS.map((moment, index) => (
                <motion.div
                  key={moment.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col"
                  data-testid={`private-access-card-${index + 1}`}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={moment.image}
                      alt={moment.alt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-serif text-xl font-bold text-primary mb-3">{moment.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{moment.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
