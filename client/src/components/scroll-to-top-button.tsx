import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrolled = document.documentElement.scrollTop || document.body.scrollTop;
      if (scrolled > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Check on mount
    toggleVisibility();

    window.addEventListener("scroll", toggleVisibility);
    document.addEventListener("scroll", toggleVisibility);
    
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
      document.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Button
      onClick={scrollToTop}
      size="icon"
      className={`fixed bottom-8 right-8 z-[9999] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary text-primary-foreground hover:bg-primary/90 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      data-testid="button-scroll-to-top"
      style={{ 
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 9999
      }}
    >
      <ChevronUp className="h-5 w-5" />
    </Button>
  );
}