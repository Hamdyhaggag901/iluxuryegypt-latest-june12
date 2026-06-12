import { useMemo } from "react";
import { MapPin, Mail, Phone } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import NewsletterBar from "./newsletter-bar";

interface FooterLink {
  id: string;
  section: string;
  label: string;
  href: string;
  sortOrder: number;
  isVisible: boolean;
  openInNewTab: boolean;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  sortOrder: number;
  isVisible: boolean;
}

interface SiteConfig {
  id: string;
  key: string;
  value: string;
  type: string;
}

// Section labels for display (fallback labels if not provided in DB)
const defaultSectionLabels: Record<string, string> = {
  quick_links: "About & Services",
  experiences: "Experiences",
  support: "Destinations",
  legal: "Legal & Policies",
  about: "About",
  services: "Services",
  destinations: "Destinations",
};

// Social media icons
const socialIcons: Record<string, JSX.Element> = {
  instagram: (
    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  facebook: (
    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  twitter: (
    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
    </svg>
  ),
  linkedin: (
    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  youtube: (
    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  tiktok: (
    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  ),
};

// Default footer links (fallback)
const defaultFooterLinks = {
  quick_links: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/faq" },
    { label: "Experiences", href: "#" },
    { label: "Stays", href: "#" },
  ],
  support: [
    { label: "Cairo & Pyramids", href: "#" },
    { label: "Luxor & Valley of Kings", href: "#" },
    { label: "Aswan & Abu Simbel", href: "#" },
    { label: "Red Sea Resorts", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-conditions" },
    { label: "Cookie Policy", href: "/cookie-policy" },
    { label: "Responsible Travel", href: "/responsible-travel" },
    { label: "Disclaimer", href: "/disclaimer" },
  ],
};

// Default social links
const defaultSocialLinks = [
  { platform: "instagram", url: "#" },
  { platform: "facebook", url: "#" },
  { platform: "twitter", url: "#" },
];

export default function Footer() {
  // Fetch footer links from database
  const { data: footerLinksResponse } = useQuery<{ success: boolean; footerLinks: Record<string, FooterLink[]> }>({
    queryKey: ["/api/public/footer-links"],
    staleTime: 5 * 60 * 1000,
  });

  // Fetch social links from database
  const { data: socialLinksResponse } = useQuery<{ success: boolean; socialLinks: SocialLink[] }>({
    queryKey: ["/api/public/social-links"],
    staleTime: 5 * 60 * 1000,
  });

  // Fetch site config
  const { data: siteConfigResponse } = useQuery<{ success: boolean; config: Record<string, string> }>({
    queryKey: ["/api/public/site-config"],
    staleTime: 5 * 60 * 1000,
  });

  const dbFooterLinks = footerLinksResponse?.footerLinks;
  const dbSocialLinks = socialLinksResponse?.socialLinks;
  const siteConfig = siteConfigResponse?.config;

  // Group footer links by section
  const footerLinksBySection = useMemo(() => {
    if (!dbFooterLinks || Object.keys(dbFooterLinks).length === 0) {
      return defaultFooterLinks;
    }

    // dbFooterLinks is already grouped by section from the API
    const grouped: Record<string, { label: string; href: string; openInNewTab?: boolean }[]> = {};

    Object.entries(dbFooterLinks).forEach(([section, links]) => {
      grouped[section] = links
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(link => ({
          label: link.label,
          href: link.href,
          openInNewTab: link.openInNewTab,
        }));
    });

    return grouped;
  }, [dbFooterLinks]);

  // Get visible social links
  const socialLinks = useMemo(() => {
    if (!dbSocialLinks || dbSocialLinks.length === 0) {
      return defaultSocialLinks;
    }

    return dbSocialLinks
      .filter(link => link.isVisible)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [dbSocialLinks]);

  // Get config values
  const getConfigValue = (key: string, defaultValue: string = "") => {
    if (!siteConfig) return defaultValue;
    return siteConfig[key] || defaultValue;
  };

  const footerLogo = getConfigValue("footer_logo");
  const footerDescription = getConfigValue("footer_description", "Redefining bespoke travel in the land of the Pharaohs.");
  const contactAddress = getConfigValue("contact_address", "Cairo, Egypt");
  const contactEmail = getConfigValue("contact_email", "concierge@i.luxuryegypt.com");
  const contactPhone = getConfigValue("contact_phone", "+20 xxx xxx xxxx");

  // Get all sections from the database (dynamically)
  const sectionsToShow = useMemo(() => {
    const sections = Object.keys(footerLinksBySection);
    // Sort to ensure consistent order: quick_links first, then alphabetical, legal last
    return sections.sort((a, b) => {
      if (a === 'quick_links') return -1;
      if (b === 'quick_links') return 1;
      if (a === 'legal') return 1;
      if (b === 'legal') return -1;
      return a.localeCompare(b);
    });
  }, [footerLinksBySection]);

  // Format section name for display
  const formatSectionLabel = (section: string) => {
    // Use default label if available, otherwise format the section name
    if (defaultSectionLabels[section]) return defaultSectionLabels[section];
    // Convert snake_case to Title Case
    return section.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Calculate grid columns based on number of sections (sections + contact = total columns)
  const totalColumns = sectionsToShow.length + 1; // +1 for Contact section

  return (
    <footer className="bg-primary text-primary-foreground py-10 md:py-16" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo and Description */}
        <div className="text-center mb-8 md:mb-12">
          {footerLogo ? (
            <img
              src={footerLogo}
              alt="I.LuxuryEgypt"
              className="h-10 md:h-12 w-auto mx-auto mb-3 md:mb-4"
            />
          ) : (
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-3 md:mb-4">I.LuxuryEgypt</h2>
          )}
          <p className="text-base md:text-xl italic px-4 text-primary-foreground/90">{footerDescription}</p>
        </div>

        {/* Links Grid - Single column on mobile, multi-column on tablet+ */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10 ${
          totalColumns <= 4 ? 'lg:grid-cols-4' :
          totalColumns <= 5 ? 'lg:grid-cols-5' :
          'lg:grid-cols-6'
        }`}>
          {sectionsToShow.map(section => {
            const links = footerLinksBySection[section];
            if (!links || links.length === 0) return null;

            return (
              <div key={section} className="text-left">
                <h3 className="text-base md:text-lg font-semibold mb-4 text-accent">{formatSectionLabel(section)}</h3>
                <div className="space-y-3">
                  {links.map((link, index) => (
                    link.openInNewTab ? (
                      <a
                        key={index}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm md:text-base text-primary-foreground/80 hover:text-accent transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : link.href.startsWith("/") ? (
                      <Link
                        key={index}
                        href={link.href}
                        className="block text-sm md:text-base text-primary-foreground/80 hover:text-accent transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        key={index}
                        href={link.href}
                        className="block text-sm md:text-base text-primary-foreground/80 hover:text-accent transition-colors"
                      >
                        {link.label}
                      </a>
                    )
                  ))}
                </div>
              </div>
            );
          })}

          {/* Contact Section */}
          <div className="text-left">
            <h3 className="text-base md:text-lg font-semibold mb-4 text-accent">Contact Us</h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 md:h-5 md:w-5 mr-2 text-accent flex-shrink-0" />
                <span className="text-sm md:text-base text-primary-foreground/80">{contactAddress}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 md:h-5 md:w-5 mr-2 text-accent flex-shrink-0" />
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-sm md:text-base text-primary-foreground/80 hover:text-accent transition-colors break-all"
                  data-testid="link-email"
                >
                  {contactEmail}
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 md:h-5 md:w-5 mr-2 text-accent flex-shrink-0" />
                <a
                  href={`tel:${contactPhone.replace(/\s/g, "")}`}
                  className="text-sm md:text-base text-primary-foreground/80 hover:text-accent transition-colors"
                  data-testid="link-phone"
                >
                  {contactPhone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Social & Newsletter */}
        <div className="mt-10 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row items-start justify-between gap-6">
            {/* Social Links */}
            <div className="text-left">
              <h4 className="text-sm md:text-base font-semibold mb-3">Follow Us</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-foreground hover:text-accent transition-colors p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20"
                    data-testid={`link-${social.platform}`}
                    aria-label={social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}
                  >
                    <span className="[&_svg]:h-5 [&_svg]:w-5">
                      {socialIcons[social.platform] || (
                        <span className="flex items-center justify-center w-5 h-5">
                          {social.platform.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="text-left w-full md:w-auto md:max-w-sm">
              <h4 className="text-sm md:text-base font-semibold mb-2">Newsletter</h4>
              <p className="text-xs md:text-sm text-primary-foreground/70 mb-3">Subscribe for exclusive offers and updates</p>
              <NewsletterBar />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center">
          <p className="text-sm text-primary-foreground/70">&copy; {new Date().getFullYear()} I.LuxuryEgypt. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
