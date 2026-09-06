import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExperienceCardProps {
  index: number;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  imageAlt: string;
  reverse?: boolean;
  onMoreInfo: () => void;
}

export default function ExperienceCard({
  index,
  eyebrow,
  title,
  subtitle,
  description,
  image,
  imageAlt,
  reverse = false,
  onMoreInfo,
}: ExperienceCardProps) {
  const number = String(index).padStart(2, "0");

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-0 items-stretch"
      data-testid={`experience-card-${index}`}
    >
      <div className={reverse ? "md:order-2" : ""}>
        <div className="h-full min-h-[280px] md:min-h-[380px] rounded-2xl overflow-hidden">
          <img src={image} alt={imageAlt} className="w-full h-full object-cover" loading="lazy" />
        </div>
      </div>

      <div className={reverse ? "md:order-1" : ""}>
        <div
          className={
            "relative h-full bg-card rounded-2xl border-t-4 border-accent shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-8 md:p-10 flex flex-col justify-center overflow-hidden " +
            (reverse ? "md:mr-6" : "md:ml-6")
          }
        >
          <span
            aria-hidden="true"
            className="absolute top-4 right-6 font-serif text-7xl md:text-8xl leading-none font-bold text-accent/10 select-none pointer-events-none"
          >
            {number}
          </span>
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="h-4 w-4 text-accent" strokeWidth={1.75} />
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">{eyebrow}</span>
            </div>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-primary mb-2">{title}</h3>
            <p className="italic text-sm text-muted-foreground mb-4">{subtitle}</p>
            <p className="text-muted-foreground leading-relaxed mb-6">{description}</p>
            <Button
              type="button"
              variant="outline"
              onClick={onMoreInfo}
              className="self-start border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              data-testid={`button-experience-more-info-${index}`}
            >
              More Info
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
