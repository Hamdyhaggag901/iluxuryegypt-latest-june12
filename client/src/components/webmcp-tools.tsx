import { useEffect } from "react";
import { useLocation } from "wouter";

interface ModelContextTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (input: any) => Promise<unknown> | unknown;
}

declare global {
  interface Navigator {
    modelContext?: {
      registerTool: (tool: ModelContextTool) => void;
      unregisterTool: (name: string) => void;
    };
  }
}

interface Tour {
  title: string;
  slug: string;
  duration?: string;
  price?: number;
  currency?: string;
  destinations?: string[];
  category?: string;
}

// #8 — WebMCP: exposes page-level tools to AI agents/browser assistants via
// `navigator.modelContext.registerTool()` (current spec API; `provideContext()`
// was removed from the proposal in March 2026).
export default function WebMcpTools() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const modelContext = navigator.modelContext;
    if (!modelContext) return; // WebMCP not supported by this browser yet

    const searchToursTool: ModelContextTool = {
      name: "search_tours",
      description:
        "Search iLuxury Egypt's luxury tour packages by destination and/or category.",
      inputSchema: {
        type: "object",
        properties: {
          destination: { type: "string", description: "City name to filter by, e.g. 'Luxor' or 'Aswan'" },
          category: { type: "string", description: "Tour category name, e.g. 'Classic Egypt' or 'Nile Cruise'" },
        },
      },
      execute: async (input: { destination?: string; category?: string } = {}) => {
        const params = new URLSearchParams();
        if (input.category) params.set("category", input.category);
        const res = await fetch(`/api/public/tours${params.toString() ? `?${params}` : ""}`);
        const data = await res.json();
        let tours: Tour[] = Array.isArray(data?.tours) ? data.tours : [];

        if (input.destination) {
          const needle = input.destination.toLowerCase();
          tours = tours.filter((t) =>
            Array.isArray(t.destinations) && t.destinations.some((d) => d.toLowerCase().includes(needle))
          );
        }

        return {
          count: tours.length,
          tours: tours.slice(0, 10).map((t) => ({
            title: t.title,
            url: `/${t.slug}`,
            duration: t.duration,
            price: t.price,
            currency: t.currency,
            destinations: t.destinations,
          })),
        };
      },
    };

    const showPackagesTool: ModelContextTool = {
      name: "show_available_packages",
      description: "Show the visitor the full list of available Egypt tour packages by navigating to the packages page.",
      inputSchema: { type: "object", properties: {} },
      execute: async () => {
        setLocation("/egypt-tour-packages");
        return { navigatedTo: "/egypt-tour-packages" };
      },
    };

    modelContext.registerTool(searchToursTool);
    modelContext.registerTool(showPackagesTool);

    return () => {
      modelContext.unregisterTool("search_tours");
      modelContext.unregisterTool("show_available_packages");
    };
  }, [setLocation]);

  return null;
}
