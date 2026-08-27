import { getInclusionIcon } from "@/lib/inclusion-icons";

export default function InclusionsList({ includes, excludes }: { includes: string[]; excludes: string[] }) {
  return (
    <section className="py-12 md:py-24 bg-background">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div>
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="w-6 md:w-8 h-px bg-accent"></div>
              <h3 className="text-lg md:text-xl font-serif text-primary">What's Included</h3>
            </div>
            {includes.length === 0 ? (
              <p className="text-sm md:text-base text-muted-foreground">Details available upon request.</p>
            ) : (
              <ul className="space-y-2 md:space-y-3">
                {includes.map((item, idx) => {
                  const Icon = getInclusionIcon(item, "included");
                  return (
                    <li key={idx} className="flex items-start gap-2 md:gap-3 text-sm md:text-base text-primary">
                      <Icon className="h-4 w-4 md:h-5 md:w-5 text-accent mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div>
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="w-6 md:w-8 h-px bg-muted-foreground/30"></div>
              <h3 className="text-lg md:text-xl font-serif text-primary">Not Included</h3>
            </div>
            {excludes.length === 0 ? (
              <p className="text-sm md:text-base text-muted-foreground">Details available upon request.</p>
            ) : (
              <ul className="space-y-2 md:space-y-3">
                {excludes.map((item, idx) => {
                  const Icon = getInclusionIcon(item, "excluded");
                  return (
                    <li key={idx} className="flex items-start gap-2 md:gap-3 text-sm md:text-base text-muted-foreground">
                      <Icon className="h-4 w-4 md:h-5 md:w-5 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
