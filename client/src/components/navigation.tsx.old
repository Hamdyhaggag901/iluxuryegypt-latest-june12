import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

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

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const [openMobileDropdowns, setOpenMobileDropdowns] = useState<Record<string, boolean>>({});
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
  const getMobileDropdownState = (id: string) => openMobileDropdowns[id] || false;
  const toggleMobileDropdown = (id: string) => {
    setOpenMobileDropdowns(prev => ({ ...prev, [id]: !prev[id] }));
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

          {/* Desktop Navigation */}
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
                        location.startsWith(`/${item.id}`) ? 'text-accent bg-accent/10' : ''
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
                            
                              key={subItem.href}
                              href={subItem.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`block w-full text-left px-4 py-3 text-sm font-medium text-accent hover:bg-accent/5 hover:text-accent/70 transition-colors ${
                                location === subItem.href ? 'bg-accent/10 text-accent/70' : ''
                              }`}
                            >
                              {subItem.label}
                            </a>
                          ) : (
                            <Link key={subItem.href} href={subItem.href}>
                              <button
                                className={`w-full text-left px-4 py-3 text-sm font-medium text-accent hover:bg-accent/5 hover:text-accent/70 transition-colors ${
                                  location === subItem.href ? 'bg-accent/10 text-accent/70' : ''
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
                    
                      key={item.id}
                      href={item.href!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`relative text-primary hover:text-accent transition-all duration-300 hover-elevate px-4 py-3 rounded-lg text-sm font-medium group ${
                        location === item.href ? 'text-accent bg-accent/10' : ''
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
                          location === item.href ? 'text-accent bg-accent/10' : ''
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

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="h-12 w-12 text-primary hover:text-accent"
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-primary/20 bg-white shadow-lg">
            <div className="px-4 py-6 space-y-2">
              {navItems.map((item) => (
                item.type === "dropdown" ? (
                  <div key={item.id}>
                    <button
                      onClick={() => toggleMobileDropdown(item.id)}
                      className={`text-primary hover:text-accent hover:bg-accent/10 flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium w-full transition-all duration-300 ${
                        location.startsWith(`/${item.id}`) ? 'text-accent bg-accent/10' : ''
                      }`}
                      data-testid={`nav-mobile-${item.id}`}
                    >
                      {item.label}
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${getMobileDropdownState(item.id) ? 'rotate-180' : ''}`} />
                    </button>
                    {getMobileDropdownState(item.id) && (
                      <div className="ml-4 mt-2 space-y-1 border-l-2 border-primary/20 pl-4">
                        {item.subItems?.map((subItem) => (
                          subItem.openInNewTab ? (
                            
                              key={subItem.href}
                              href={subItem.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={`text-primary hover:text-accent hover:bg-accent/10 block px-4 py-2 rounded-lg text-sm font-medium w-full text-left transition-all duration-300 ${
                                location === subItem.href ? 'text-accent bg-accent/10' : ''
                              }`}
                            >
                              {subItem.label}
                            </a>
                          ) : (
                            <Link key={subItem.href} href={subItem.href}>
                              <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`text-primary hover:text-accent hover:bg-accent/10 block px-4 py-2 rounded-lg text-sm font-medium w-full text-left transition-all duration-300 ${
                                  location === subItem.href ? 'text-accent bg-accent/10' : ''
                                }`}
                              >
                                {subItem.label}
                              </button>
                            </Link>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                ) : item.type === "page" ? (
                  item.openInNewTab ? (
                    
                      key={item.id}
                      href={item.href!}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-primary hover:text-accent hover:bg-accent/10 block px-4 py-3 rounded-lg text-base font-medium w-full text-left transition-all duration-300 ${
                        location === item.href ? 'text-accent bg-accent/10' : ''
                      }`}
                      data-testid={`nav-mobile-${item.id}`}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link key={item.id} href={item.href!}>
                      <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`text-primary hover:text-accent hover:bg-accent/10 block px-4 py-3 rounded-lg text-base font-medium w-full text-left transition-all duration-300 ${
                          location === item.href ? 'text-accent bg-accent/10' : ''
                        }`}
                        data-testid={`nav-mobile-${item.id}`}
                      >
                        {item.label}
                      </button>
                    </Link>
                  )
                ) : (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="text-primary hover:text-accent hover:bg-accent/10 block px-4 py-3 rounded-lg text-base font-medium w-full text-left transition-all duration-300"
                    data-testid={`nav-mobile-${item.id}`}
                  >
                    {item.label}
                  </button>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
