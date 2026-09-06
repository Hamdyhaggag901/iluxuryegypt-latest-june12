import type { LucideIcon } from "lucide-react";

interface SplitFeatureProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function SplitFeature({ icon: Icon, title, description }: SplitFeatureProps) {
  return (
    <div className="text-center md:text-left" data-testid={`split-feature-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 mb-5">
        <Icon className="h-7 w-7 text-accent" strokeWidth={1.5} />
      </div>
      <h3 className="font-serif text-xl font-bold text-primary mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-sm">{description}</p>
    </div>
  );
}
