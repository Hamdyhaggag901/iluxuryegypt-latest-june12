import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Numbered-circle step indicator shared by every multi-step modal (Trip
 * Builder, Reserve This Journey) so they stay visually identical.
 */
export default function StepProgressBar({
  currentStep,
  stepLabels,
}: {
  currentStep: number;
  stepLabels: string[];
}) {
  return (
    <div className="flex items-center" data-testid="step-progress-bar">
      {stepLabels.map((label, index) => {
        const stepNum = index + 1;
        const isCompleted = stepNum < currentStep;
        const isCurrent = stepNum === currentStep;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold border-2 transition-colors shrink-0",
                  isCompleted || isCurrent
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-background border-border text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : stepNum}
              </div>
              <span
                className={cn(
                  "text-xs font-medium text-center whitespace-nowrap hidden sm:block",
                  isCurrent ? "text-primary" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </div>
            {stepNum < stepLabels.length && (
              <div className={cn("flex-1 h-0.5 mx-2 mb-0 sm:-mb-5 transition-colors", isCompleted ? "bg-accent" : "bg-border")} />
            )}
          </div>
        );
      })}
    </div>
  );
}
