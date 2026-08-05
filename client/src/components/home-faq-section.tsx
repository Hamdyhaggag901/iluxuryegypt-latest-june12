import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const homeFaqs = [
  {
    question: "Is Egypt safe for American tourists?",
    answer:
      "Yes. Millions of international visitors safely explore Egypt every year. Tourist destinations are well protected, and private guided travel offers an even higher level of comfort, convenience, and security.",
  },
  {
    question: "Visa requirements for US citizens",
    answer:
      "U.S. passport holders generally require a tourist visa to enter Egypt. Most visitors can obtain an eVisa online before departure or purchase a visa on arrival, depending on current regulations.",
  },
  {
    question: "Best time to visit Egypt",
    answer:
      "The most comfortable months are October through April, when temperatures are ideal for sightseeing. Summer is warmer but offers fewer crowds and attractive luxury hotel rates.",
  },
  {
    question: "What's included in the package price?",
    answer:
      "Most luxury packages include luxury accommodations, private Egyptologist guide, private transportation, airport transfers, sightseeing, entrance fees, selected meals, domestic flights (when applicable), bottled water, and all planned experiences listed in your itinerary.",
  },
  {
    question: "Can I customize my itinerary?",
    answer:
      "Absolutely. Every iLuxury Egypt itinerary is fully tailor-made around your interests, schedule, and travel style.",
  },
  {
    question: "What level of luxury hotels do you use?",
    answer:
      "We partner exclusively with Egypt's finest luxury hotels and resorts, including Four Seasons Cairo at Nile Plaza, The St. Regis Cairo, The Nile Ritz-Carlton, Marriott Mena House, Sofitel Legend Old Cataract Aswan, Sofitel Winter Palace Luxor, and other internationally recognized 5-star properties.",
  },
  {
    question: "What's your cancellation/refund policy?",
    answer:
      "Our cancellation policy depends on the booked hotels, cruise, and travel services. Most reservations can be modified if requested in advance.",
  },
  {
    question: "Do you offer customized packages?",
    answer:
      "Yes. Every itinerary is individually designed based on your interests, travel dates, pace, accommodation preferences, and budget.",
  },
];

export default function HomeFAQSection() {
  return (
    <section className="py-20 bg-muted" data-testid="home-faq-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-8 animate-fade-in">
            Frequently Asked Questions
          </h2>
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="w-16 h-px bg-accent"></div>
            <div className="w-2 h-2 bg-accent rotate-45"></div>
            <div className="w-16 h-px bg-accent"></div>
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {homeFaqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`home-faq-${index}`}
              className="border rounded-xl bg-white px-2 overflow-hidden shadow-sm hover:shadow-md transition-shadow border-accent/5"
              data-testid={`home-faq-item-${index}`}
            >
              <AccordionTrigger className="px-4 py-6 text-left hover:no-underline group">
                <span className="text-lg font-serif font-semibold text-primary group-data-[state=open]:text-accent transition-colors">
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-6">
                <div className="text-muted-foreground leading-relaxed text-base border-t border-accent/5 pt-4">
                  {faq.answer}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-12">
          <Link href="/faq">
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg" data-testid="button-view-all-faqs">
              View All FAQs
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
