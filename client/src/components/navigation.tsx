import { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, Phone, Search, ArrowRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

// Pulls in react-hook-form + Radix select; Navigation renders on every route,
// so load that only once someone actually opens the trip builder instead of
// on every page load.
const TripBuilderModal = lazy(() => import("@/components/trip-builder-modal"));

interface NavItem {
  id: string;
  label: string;
  href: string;
  parentId: string | null;
  sortOrder: number;
  isVisible: boolean;
  openInNewTab: boolean;
}

interface SiteConfig {
  id: string;
  key: string;
  value: string;
  type: string;
}

const defaultNavItems = [
  { label: "About", id: "about", type: "dropdown" as const, subItems: [
    { label: "Who We Are", href: "/about/who-we-are" },
    { label: "The iLuxury Difference", href: "/about/iluxury-difference" },
    { label: "Your Experience Includes", href: "/about/your-experience" },
    { label: "Trusted Worldwide", href: "/about/trusted-worldwide" },
  ]},
  { label: "Destinations", id: "destinations", type: "page" as const, href: "/destinations" },
  { label: "Experiences", id: "experiences", type: "dropdown" as const, subItems: [
    { label: "Packages", href: "/egypt-tour-packages" },
    { label: "Day Tours", href: "/egypt-day-tours" },
    { label: "Nile Cruises", href: "/egypt-nile-cruise-tours" },
  ]},
  { label: "Stays", id: "stays", type: "page" as const, href: "/stay" },
  { label: "Blog", id: "blog", type: "page" as const, href: "/blog" },
  { label: "Contact", id: "contact", type: "page" as const, href: "/contact" },
];

// Mobile slide-out menu content — hardcoded (not DB-driven) since this menu's
// information architecture (main categories / Popular / additional links)
// deliberately differs from the desktop dropdown nav above.
const MOBILE_MAIN_CATEGORIES = [
  { label: "Egypt Destinations", href: "/destinations" },
  { label: "Egypt Tour Packages", href: "/egypt-tour-packages" },
  { label: "Egypt Day Tours", href: "/egypt-day-tours" },
  { label: "Stay", href: "/stay" },
];

const MOBILE_POPULAR_LINKS = [
  { label: "SMALL GROUP TOURS EGYPT", href: "/egypt-tour-packages/small-group-tours-egypt" },
  { label: "LUXURY FAMILY EGYPT", href: "/egypt-tour-packages/egypt-family-tours" },
  { label: "LUXURY HONEYMOON EGYPT", href: "/egypt-tour-packages/luxury-honeymoon-egypt" },
  { label: "SOLAR ECLIPSE EGYPT", href: "/egypt-tour-packages/solar-eclipse-egypt" },
  { label: "SPIRITUAL JOURNEYS EGYPT", href: "/egypt-tour-packages/egypt-spiritual-tours" },
];

const MOBILE_ADDITIONAL_LINKS = [
  { label: "BLOG", href: "/blog", showArrow: true },
  { label: "ABOUT", href: "/about/who-we-are", showArrow: true },
  { label: "FAQ", href: "/faq", showArrow: false },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const [isTripBuilderOpen, setIsTripBuilderOpen] = useState(false);
  const [hasOpenedTripBuilder, setHasOpenedTripBuilder] = useState(false);
  const [location] = useLocation();

  const { data: navItemsResponse } = useQuery<{ success: boolean; navItems: NavItem[] }>({
    queryKey: ["/api/public/nav-items"],
    staleTime: 5 * 60 * 1000,
  });

  const { data: siteConfigResponse } = useQuery<{ success: boolean; config: Record<string, string> }>({
    queryKey: ["/api/public/site-config"],
    staleTime: 5 * 60 * 1000,
  });

  const dbNavItems = navItemsResponse?.navItems;
  const siteConfig = siteConfigResponse?.config;

  const navItems = useMemo(() => {
    if (!dbNavItems || dbNavItems.length === 0) {
      return defaultNavItems;
    }

    const topLevelItems = dbNavItems
      .filter(item => !item.parentId && item.isVisible)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    return topLevelItems.map(item => {
      const children = dbNavItems
        .filter(child => child.parentId === item.id && child.isVisible)
        .sort((a, b) => a.sortOrder - b.sortOrder);

      if (children.length > 0) {
        return {
          label: item.label,
          id: item.id,
          type: "dropdown" as const,
          href: item.href,
          openInNewTab: item.openInNewTab,
          subItems: children.map(child => ({
            label: child.label,
            href: child.href,
            openInNewTab: child.openInNewTab,
          })),
        };
      }

      return {
        label: item.label,
        id: item.id,
        type: "page" as const,
        href: item.href,
        openInNewTab: item.openInNewTab,
      };
    });
  }, [dbNavItems]);

  const logoUrl = useMemo(() => {
    if (!siteConfig) return null;
    return siteConfig.header_logo || null;
  }, [siteConfig]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (location === "/contact" && sectionId === "contact") {
      setIsMobileMenuOpen(false);
      return;
    }
    if (location !== "/") {
      window.location.href = `/#${sectionId}`;
      setIsMobileMenuOpen(false);
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  const getDropdownState = (id: string) => openDropdowns[id] || false;
  const setDropdownState = (id: string, state: boolean) => {
    setOpenDropdowns(prev => ({ ...prev, [id]: state }));
  };
  return (
    <nav className={`fixed top-0 left-0 right-0 w-full z-40 transition-all duration-300 ${
      isScrolled
        ? "bg-white border-b border-primary/20 shadow-lg"
        : "bg-white border-b border-primary/10"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0">
            <Link href="/">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="I.LUXURYEGYPT"
                  className="h-12 w-auto cursor-pointer"
                  loading="eager"
                  data-testid="logo-home"
                />
              ) : (
                <span className="text-2xl font-serif font-bold text-primary hover:text-accent transition-colors cursor-pointer"
                    data-testid="logo-home">
                  I.LUXURYEGYPT
                </span>
              )}
            </Link>
          </div>

          <div className="hidden lg:block">
            <div className="ml-10 flex items-center space-x-1">
              {navItems.map((item) => (
                item.type === "dropdown" ? (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => setDropdownState(item.id, true)}
                    onMouseLeave={() => setDropdownState(item.id, false)}
                  >
                    <button
                      className={`relative text-primary hover:text-accent transition-all duration-300 hover-elevate px-4 py-3 rounded-lg text-sm font-medium group flex items-center gap-1 ${
                        location.startsWith(`/${item.id}`) ? 'text-accent-text bg-accent/10' : ''
                      }`}
                      data-testid={`nav-${item.id}`}
                    >
                      {item.label}
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${getDropdownState(item.id) ? 'rotate-180' : ''}`} />
                      <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                    </button>
                    <div className={`absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-primary/10 overflow-hidden transition-all duration-200 ${
                      getDropdownState(item.id) ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                    }`}>
                      <div className="py-2">
                        {item.subItems?.map((subItem) => (
                          subItem.openInNewTab ? (
                            <a
                              key={subItem.href}
                              href={subItem.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`block w-full text-left px-4 py-3 text-sm font-medium text-accent-text hover:bg-accent/5 hover:text-accent/70 transition-colors ${
                                location === subItem.href ? 'bg-accent/10 text-accent-text/70' : ''
                              }`}
                            >
                              {subItem.label}
                            </a>
                          ) : (
                            <Link key={subItem.href} href={subItem.href}>
                              <button
                                className={`w-full text-left px-4 py-3 text-sm font-medium text-accent-text hover:bg-accent/5 hover:text-accent/70 transition-colors ${
                                  location === subItem.href ? 'bg-accent/10 text-accent-text/70' : ''
                                }`}
                              >
                                {subItem.label}
                              </button>
                            </Link>
                          )
                        ))}
                      </div>
                    </div>
                  </div>
                ) : item.type === "page" ? (
                  item.openInNewTab ? (
                    <a
                      key={item.id}
                      href={item.href!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`relative text-primary hover:text-accent transition-all duration-300 hover-elevate px-4 py-3 rounded-lg text-sm font-medium group ${
                        location === item.href ? 'text-accent-text bg-accent/10' : ''
                      }`}
                      data-testid={`nav-${item.id}`}
                    >
                      {item.label}
                      <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                    </a>
                  ) : (
                    <Link key={item.id} href={item.href!}>
                      <button
                        className={`relative text-primary hover:text-accent transition-all duration-300 hover-elevate px-4 py-3 rounded-lg text-sm font-medium group ${
                          location === item.href ? 'text-accent-text bg-accent/10' : ''
                        }`}
                        data-testid={`nav-${item.id}`}
                      >
                        {item.label}
                        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                      </button>
                    </Link>
                  )
                ) : (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="relative text-primary hover:text-accent transition-all duration-300 hover-elevate px-4 py-3 rounded-lg text-sm font-medium group"
                    data-testid={`nav-${item.id}`}
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                  </button>
                )
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              onClick={() => {
                setHasOpenedTripBuilder(true);
                setIsTripBuilderOpen(true);
              }}
              className="hidden sm:inline-flex bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-5 h-10 rounded-lg whitespace-nowrap"
              data-testid="button-nav-start-planning"
            >
              Design My Egypt Story
            </Button>

            <div className="lg:hidden shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="h-12 w-12 text-primary hover:text-accent"
                data-testid="button-mobile-menu"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background flex flex-col">
          {/* Top bar — phone number */}
          <div className="bg-primary px-4 py-2.5 flex items-center shrink-0">
            <a
              href="tel:+201121012676"
              className="flex items-center gap-2 text-primary-foreground text-sm font-medium"
              data-testid="mobile-menu-phone"
            >
              <Phone className="h-3.5 w-3.5" />
              +20 112 101 2676
            </a>
          </div>

          {/* Second bar — close, brand, search */}
          <div className="bg-secondary px-4 py-4 flex items-center justify-between shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-primary"
              aria-label="Close menu"
              data-testid="button-mobile-menu-close"
            >
              <X className="h-6 w-6" />
            </button>
            <span className="font-serif text-lg font-bold text-primary">iLuxury Egypt</span>
            <button
              className="text-primary"
              aria-label="Search"
              data-testid="button-mobile-menu-search"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10">
            {/* Main categories */}
            <div className="space-y-1">
              {MOBILE_MAIN_CATEGORIES.map((item) => (
                <Link key={item.href} href={item.href}>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center justify-between py-3 font-serif text-xl text-primary text-left"
                    data-testid={`mobile-menu-main-${item.href}`}
                  >
                    {item.label}
                    <ArrowRight className="h-4 w-4 text-accent shrink-0" />
                  </button>
                </Link>
              ))}
            </div>

            {/* Popular */}
            <div>
              <p className="text-xs font-semibold text-accent-text tracking-[0.2em] uppercase mb-3">
                Popular
              </p>
              <div className="space-y-1">
                {MOBILE_POPULAR_LINKS.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full text-left py-2.5 font-sans text-sm font-medium tracking-wide text-primary uppercase"
                      data-testid={`mobile-menu-popular-${item.href}`}
                    >
                      {item.label}
                    </button>
                  </Link>
                ))}
              </div>
            </div>

            {/* Additional links */}
            <div className="space-y-1 border-t border-border pt-6">
              {MOBILE_ADDITIONAL_LINKS.map((item) => (
                <Link key={item.href} href={item.href}>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center justify-between py-2.5 font-sans text-sm font-semibold tracking-wide text-primary uppercase"
                    data-testid={`mobile-menu-link-${item.href}`}
                  >
                    {item.label}
                    {item.showArrow && <ArrowRight className="h-3.5 w-3.5 text-accent shrink-0" />}
                  </button>
                </Link>
              ))}
            </div>

            {/* CTA */}
            <Button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setHasOpenedTripBuilder(true);
                setIsTripBuilderOpen(true);
              }}
              className="w-full bg-accent hover:bg-accent/90 text-primary font-semibold py-6 text-base"
              data-testid="button-mobile-menu-cta"
            >
              Design My Egypt Story
            </Button>
          </div>
        </div>
      )}

      {hasOpenedTripBuilder && (
        <Suspense fallback={null}>
          <TripBuilderModal open={isTripBuilderOpen} onOpenChange={setIsTripBuilderOpen} />
        </Suspense>
      )}
    </nav>
  );
}
