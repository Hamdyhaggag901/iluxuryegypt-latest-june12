import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  faqs: FaqItem[];
  description?: string;
  testId?: string;
}

export default function FaqSection({ faqs, description, testId = "faq-section" }: FaqSectionProps) {
  if (faqs.length === 0) return null;

  return (
    <section className="py-12 md:py-20 bg-muted" data-testid={testId}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-primary mb-4 md:mb-6">
            Frequently Asked Questions
          </h2>
          <div className="w-16 md:w-24 h-px bg-accent mx-auto mb-4 md:mb-8"></div>
          {description && (
            <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">{description}</p>
          )}
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`} data-testid={`faq-item-${index}`}>
              <AccordionTrigger
                className="text-left text-base md:text-lg font-medium"
                data-testid={`faq-question-${index}`}
              >
                {faq.question}
              </AccordionTrigger>
              <AccordionContent
                className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line"
                data-testid={`faq-answer-${index}`}
              >
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export function buildFaqJsonLd(faqs: FaqItem[]) {
  if (faqs.length === 0) return undefined;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
