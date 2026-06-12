export default function AnnouncementBar() {
  const announcements = [
    "Exclusive Access to Egypt's Iconic Sites.",
    "Stay in Handpicked Luxury Accommodations.",
    "Crafted by Experts Who Understand Luxury."
  ];

  return (
    <div className="bg-accent text-accent-foreground py-2 relative overflow-hidden z-50" data-testid="announcement-bar">
      <div className="flex animate-scroll whitespace-nowrap">
        {/* Repeat the announcements multiple times for seamless loop */}
        {[...Array(3)].map((_, setIndex) => (
          <div key={setIndex} className="flex">
            {announcements.map((text, index) => (
              <div key={`${setIndex}-${index}`} className="flex items-center mx-8">
                <span className="text-sm font-medium">{text}</span>
                <span className="mx-4 text-accent-foreground/60">•</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}