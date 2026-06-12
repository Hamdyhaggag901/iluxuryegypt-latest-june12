import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface SiteMetadata {
  siteTitle: string;
  faviconUrl: string | null;
}

export default function SiteMetadata() {
  const { data } = useQuery<SiteMetadata>({
    queryKey: ["/api/public/site-metadata"],
    queryFn: async () => {
      const response = await fetch("/api/public/site-metadata");
      if (!response.ok) throw new Error("Failed to fetch site metadata");
      return response.json();
    },
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
