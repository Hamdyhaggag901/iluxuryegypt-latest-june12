import { useQuery } from "@tanstack/react-query";

// Fallback content
const fallbackContent = {
  title: "I.LUXURYEGYPT Guest Experiences",
  description: "Step into a world where heritage and luxury intertwine. I.LUXURYEGYPT curates bespoke stays across Egypt's most iconic destinations — from Nile-side sanctuaries to Red Sea havens. Every detail is handpicked to ensure comfort, elegance, and authenticity.",
  tagline: "Your journey, our promise.",
  isActive: true,
};

export default function GuestExperienceIntro() {
  // Fetch from database
  const { data } = useQuery({
    queryKey: ["publicGuestExperienceSection"],
    queryFn: async () => {
      const response = await fetch("/api/public/guest-experience-section");
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });

  const content = data?.section || fallbackContent;

  // Don't render if explicitly set to inactive
  if (data?.section && !content.isActive) {
    return null;
  }

  return (
    <section className="py-20 bg-primary" data-testid="guest-experience-intro">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mb-8">
            {content.title}
          </h2>
          <div className="max-w-4xl mx-auto">
            {content.description && (
              <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed mb-8">
                {content.description}
              </p>
            )}
            {content.tagline && (
              <p className="text-xl md:text-2xl font-serif text-accent font-medium">
                {content.tagline}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}