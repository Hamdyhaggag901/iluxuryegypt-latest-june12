import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface SiteBootstrap {
  siteTitle: string;
  faviconUrl: string | null;
}

export default function SiteMetadata() {
  // Shares one request with Navigation, WhatsAppButton and Footer's social
  // links (all mount on every page) via React Query's cache dedup on
  // identical queryKeys — see /api/public/site-bootstrap.
  const { data } = useQuery<SiteBootstrap>({
    queryKey: ["/api/public/site-bootstrap"],
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    // Only set default title if no page-specific title has been set by useSEO
    if (data?.siteTitle && !document.title.includes("|")) {
      document.title = data.siteTitle;
    }
  }, [data?.siteTitle]);

  useEffect(() => {
    if (data?.faviconUrl) {
      let link = document.querySelector("link[rel='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = data.faviconUrl;
      link.type = data.faviconUrl.endsWith('.ico') ? 'image/x-icon' :
                  data.faviconUrl.endsWith('.png') ? 'image/png' :
                  data.faviconUrl.endsWith('.svg') ? 'image/svg+xml' : 'image/x-icon';
    }
  }, [data?.faviconUrl]);

  // Ensure canonical tag exists on every page as a fallback
  useEffect(() => {
    const canonical = `https://iluxuryegypt.com${window.location.pathname}`;
    let link = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;
  });

  return null;
}
