import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { insertTourSchema, type Media } from "@shared/schema";
import { detectPlaceName, detectMeals, suggestDayPhotoAlt, normalizeForMatch } from "@shared/itinerary-detection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { WysiwygEditor } from "@/components/ui/wysiwyg-editor";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Loader2, MapPin, Sparkles, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const tourFormSchema = insertTourSchema.extend({
  price: z.union([z.number(), z.string().min(1)]).transform((val) =>
    typeof val === "string" ? Number(val) : val
  ),
  durationDays: z.union([z.number(), z.string(), z.null()]).optional().transform((val) =>
    val === "" || val == null ? null : Number(val)
  ),
  itinerary: z.array(z.object({
    day: z.number().positive(),
    title: z.string().min(1, "Day title is required"),
    description: z.string().min(1, "Day description is required"),
    activities: z.array(z.string().min(1)).default([]),
    lat: z.union([z.number(), z.string(), z.null()]).optional().transform((val) =>
      val === "" || val == null ? undefined : Number(val)
    ),
    lng: z.union([z.number(), z.string(), z.null()]).optional().transform((val) =>
      val === "" || val == null ? undefined : Number(val)
    ),
    placeName: z.string().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    accommodation: z.string().optional(),
    meals: z.array(z.string()).default([]),
  })).min(1, "At least one itinerary day is required"),
});

type TourFormData = z.infer<typeof tourFormSchema>;

// Shared candidate shape across all three stock-photo sources — Unsplash is
// the only one with a downloadLocation ping its API guidelines require.
interface StockPhotoCandidate {
  id: string;
  thumbUrl: string;
  fullUrl: string;
  downloadLocation?: string;
  photographerName?: string;
  photographerUrl?: string;
  description?: string;
}

type StockPhotoSource = "pexels" | "pixabay" | "unsplash";

const STOCK_PHOTO_SOURCES: Array<{ source: StockPhotoSource; searchEndpoint: string; importEndpoint: string; label: string }> = [
  { source: "pexels", searchEndpoint: "/api/cms/pexels-search", importEndpoint: "/api/cms/pexels-import", label: "Pexels" },
  { source: "pixabay", searchEndpoint: "/api/cms/pixabay-search", importEndpoint: "/api/cms/pixabay-import", label: "Pixabay" },
  { source: "unsplash", searchEndpoint: "/api/cms/unsplash-search", importEndpoint: "/api/cms/unsplash-import", label: "Unsplash" },
];

interface TourFormProps {
  initialData?: Partial<any>;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export function TourForm({ initialData, onSubmit, isLoading }: TourFormProps) {
  const [includesInput, setIncludesInput] = useState("");
  const [excludesInput, setExcludesInput] = useState("");
  const [destinationsInput, setDestinationsInput] = useState("");
  const [galleryInput, setGalleryInput] = useState("");
  const [geocodingDayIndex, setGeocodingDayIndex] = useState<number | null>(null);
  const [otherAccommodation, setOtherAccommodation] = useState<Record<number, boolean>>({});
  const [photoPreview, setPhotoPreview] = useState<Record<number, { source: StockPhotoSource; candidates: StockPhotoCandidate[]; currentIndex: number } | null>>({});
  const [photoImportingIndex, setPhotoImportingIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: categoriesData } = useQuery({
    queryKey: ["/api/cms/categories"],
    queryFn: async () => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/cms/categories", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json();
    },
  });

  const { data: hotelsData } = useQuery({
    queryKey: ["/api/cms/hotels"],
    queryFn: async () => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/cms/hotels", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch hotels");
      return response.json();
    },
  });

  // Used for "Suggest Photo" (matching a landmark name against media
  // filenames/alt text) and for uploading new day photos in place.
  const { data: mediaData } = useQuery<{ success: boolean; media: Media[] }>({
    queryKey: ["/api/cms/media"],
    queryFn: async () => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/cms/media", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch media");
      return response.json();
    },
  });
  const mediaImages = (mediaData?.media || []).filter((m) => m.mimeType.startsWith("image/"));
  const hotelNames: string[] = (hotelsData?.hotels || []).map((h: any) => h.name);

  const form = useForm<TourFormData>({
    resolver: zodResolver(tourFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      shortDescription: "",
      heroImage: "",
      heroImageAlt: "",
      gallery: [],
      galleryAlt: {},
      duration: "",
      durationDays: null,
      groupSize: "",
      difficulty: "Easy",
      price: "0" as any,
      currency: "USD",
      includes: [],
      excludes: [],
      itinerary: [{ day: 1, title: "", description: "", activities: [], meals: [] }],
      destinations: [],
      category: "",
      hotelIds: [],
      availabilityStatus: "available",
      featured: false,
      published: true,
      brochureUrl: "",
      seoTitle: "",
      metaDescription: "",
      ...initialData,
    },
  });

  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        form.setValue(key as any, initialData[key]);
      });
    }
  }, [initialData, form]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue("title", title);
    if (!initialData?.slug) {
      form.setValue("slug", generateSlug(title));
    }
  };

  const addArrayItem = (field: "includes" | "excludes" | "destinations" | "gallery", value: string) => {
    if (!value.trim()) return;
    const currentValues = form.getValues(field) || [];
    form.setValue(field, [...currentValues, value.trim()]);
  };

  const removeArrayItem = (field: "includes" | "excludes" | "destinations" | "gallery", index: number) => {
    const currentValues = form.getValues(field) || [];
    form.setValue(field, currentValues.filter((_: any, i: number) => i !== index));
  };

  const addItineraryDay = () => {
    const currentItinerary = form.getValues("itinerary") || [];
    form.setValue("itinerary", [
      ...currentItinerary,
      { day: currentItinerary.length + 1, title: "", description: "", activities: [], meals: [] }
    ]);
  };

  const toggleHotelId = (hotelId: string) => {
    const current = form.getValues("hotelIds") || [];
    form.setValue(
      "hotelIds",
      current.includes(hotelId) ? current.filter((id) => id !== hotelId) : [...current, hotelId]
    );
  };

  const toggleMeal = (dayIndex: number, meal: string) => {
    const current = form.getValues(`itinerary.${dayIndex}.meals`) || [];
    form.setValue(
      `itinerary.${dayIndex}.meals`,
      current.includes(meal) ? current.filter((m) => m !== meal) : [...current, meal]
    );
  };

  const findOnMap = async (dayIndex: number) => {
    const placeName = form.getValues(`itinerary.${dayIndex}.placeName`)?.trim();
    if (!placeName) {
      toast({ title: "Enter a place name first", variant: "destructive" });
      return;
    }

    setGeocodingDayIndex(dayIndex);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/cms/geocode?q=${encodeURIComponent(placeName)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        toast({ title: "Location not found", description: result.message || "Try a different place name.", variant: "destructive" });
        return;
      }

      form.setValue(`itinerary.${dayIndex}.lat`, result.lat);
      form.setValue(`itinerary.${dayIndex}.lng`, result.lng);
      toast({ title: "Location found", description: result.displayName });
    } catch (error) {
      toast({ title: "Error", description: "Failed to look up that place. Please try again.", variant: "destructive" });
    } finally {
      setGeocodingDayIndex(null);
    }
  };

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File): Promise<string> => {
      const formData = new FormData();
      formData.append("file", file);
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/cms/media", {
        method: "POST",
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
        body: formData,
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(error.message || "Upload failed");
      }
      const data = await response.json();
      return data.media.url as string;
    },
  });

  const handleDayPhotoUpload = (dayIndex: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadImageMutation.mutate(file, {
      onSuccess: (url) => form.setValue(`itinerary.${dayIndex}.image`, url),
      onError: (error: any) => toast({ title: "Upload failed", description: error.message, variant: "destructive" }),
    });
  };

  // Suggestion-only automation: fills placeName/accommodation/meals/coordinates
  // from the day's own description text, but only into fields that are still
  // empty — an admin's manual edits are never overwritten. Runs on blur so it
  // doesn't fight the admin while they're mid-sentence.
  const autoDetectFromDescription = async (dayIndex: number) => {
    const description = form.getValues(`itinerary.${dayIndex}.description`) || "";
    if (!description.trim()) return;

    let filledSomething = false;

    if (!form.getValues(`itinerary.${dayIndex}.placeName`)?.trim()) {
      const place = detectPlaceName(description);
      if (place) {
        form.setValue(`itinerary.${dayIndex}.placeName`, place);
        filledSomething = true;
      }
    }

    // Accommodation is deliberately NOT auto-filled from text here — the admin
    // picks it from the Hotels dropdown below instead. Text matching against
    // hotel names proved unreliable in practice, and a wrong silent guess in
    // a dropdown-backed field is worse than an empty one the admin fills in
    // directly. detectAccommodation is still used by the server-side bulk
    // job, where there's no dropdown UI and a best-effort empty-field fill is
    // the only automation option.

    if ((form.getValues(`itinerary.${dayIndex}.meals`) || []).length === 0) {
      const meals = detectMeals(description);
      if (meals.length > 0) {
        form.setValue(`itinerary.${dayIndex}.meals`, meals);
        filledSomething = true;
      }
    }

    const placeName = form.getValues(`itinerary.${dayIndex}.placeName`)?.trim();
    const hasCoords = form.getValues(`itinerary.${dayIndex}.lat`) != null && form.getValues(`itinerary.${dayIndex}.lng`) != null;
    if (placeName && !hasCoords) {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(`/api/cms/geocode?q=${encodeURIComponent(placeName)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();
        if (response.ok && result.success) {
          form.setValue(`itinerary.${dayIndex}.lat`, result.lat);
          form.setValue(`itinerary.${dayIndex}.lng`, result.lng);
          filledSomething = true;
        }
      } catch {
        // Silent — this is a background suggestion, not a directly requested lookup.
      }
    }

    if (filledSomething) {
      toast({ title: "Auto-filled from description", description: "Review the suggested fields below and adjust if needed." });
    }
  };

  // How many other days in this same itinerary already have a photo for the
  // same place name — passed to suggestDayPhotoAlt as variantIndex so a
  // second/third photo of one place gets distinguishing alt text instead of
  // a literal duplicate.
  const countExistingPhotosForPlace = (placeName: string, excludeIndex: number): number => {
    const itinerary = form.getValues("itinerary") || [];
    const needle = normalizeForMatch(placeName);
    return itinerary.filter(
      (d: any, i: number) => i !== excludeIndex && d.image?.trim() && normalizeForMatch(d.placeName || "").includes(needle)
    ).length;
  };

  const buildDayPhotoAlt = (dayIndex: number, placeName: string): string =>
    suggestDayPhotoAlt({
      placeName,
      description: form.getValues(`itinerary.${dayIndex}.description`),
      activities: form.getValues(`itinerary.${dayIndex}.activities`),
      accommodation: form.getValues(`itinerary.${dayIndex}.accommodation`),
      variantIndex: countExistingPhotosForPlace(placeName, dayIndex),
    });

  // Mirrors the day photo into the tour's own gallery (with its alt text) so
  // it shows up in both places without the admin uploading it twice — skips
  // silently if that exact URL is already in the gallery.
  const addToGallery = (url: string, alt: string) => {
    const gallery: string[] = form.getValues("gallery") || [];
    if (gallery.includes(url)) return;
    form.setValue("gallery", [...gallery, url]);
    if (alt) {
      form.setValue("galleryAlt", { ...(form.getValues("galleryAlt") || {}), [url]: alt });
    }
  };

  const suggestDayPhoto = async (dayIndex: number) => {
    const placeName = form.getValues(`itinerary.${dayIndex}.placeName`)?.trim();
    if (!placeName) {
      toast({ title: "Add a place name first", description: "Suggest Photo matches against the place name.", variant: "destructive" });
      return;
    }

    // 1-3) Stock sources, tried in priority order (Pexels, then Pixabay,
    // then Unsplash). Each just opens a preview the admin has to explicitly
    // approve — nothing is saved by a search call. A source that isn't
    // configured (no API key) or returns nothing is skipped silently, moving
    // straight to the next one.
    const token = localStorage.getItem("adminToken");
    for (const { source, searchEndpoint } of STOCK_PHOTO_SOURCES) {
      try {
        const response = await fetch(`${searchEndpoint}?q=${encodeURIComponent(placeName)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();
        if (result.success && result.candidates?.length > 0) {
          setPhotoPreview((prev) => ({ ...prev, [dayIndex]: { source, candidates: result.candidates, currentIndex: 0 } }));
          return;
        }
      } catch {
        // Fall through to the next source — any one of these is a bonus, not a dependency.
      }
    }

    // 4) Last resort — the local Media Library. Checked last on purpose: its
    // existing assets aren't always an accurate match for a given place, so
    // a real stock photo above is preferred whenever one is available.
    const needle = normalizeForMatch(placeName);
    const match = mediaImages.find(
      (m) => normalizeForMatch(m.originalName).includes(needle) || normalizeForMatch(m.altEn || "").includes(needle)
    );
    if (match) {
      form.setValue(`itinerary.${dayIndex}.image`, match.url);
      let alt = form.getValues(`itinerary.${dayIndex}.imageAlt`)?.trim();
      if (!alt) {
        alt = buildDayPhotoAlt(dayIndex, placeName);
        form.setValue(`itinerary.${dayIndex}.imageAlt`, alt);
      }
      addToGallery(match.url, alt);
      toast({ title: "Photo suggested", description: match.originalName });
      return;
    }

    toast({ title: "No matching photo found", description: "Upload one below, or add it to the Media Library first.", variant: "destructive" });
  };

  const cyclePhotoPreview = (dayIndex: number) => {
    setPhotoPreview((prev) => {
      const entry = prev[dayIndex];
      if (!entry) return prev;
      const nextIndex = (entry.currentIndex + 1) % entry.candidates.length;
      return { ...prev, [dayIndex]: { ...entry, currentIndex: nextIndex } };
    });
  };

  const cancelPhotoPreview = (dayIndex: number) => {
    setPhotoPreview((prev) => ({ ...prev, [dayIndex]: null }));
  };

  const useStockPhoto = async (dayIndex: number) => {
    const entry = photoPreview[dayIndex];
    if (!entry) return;
    const candidate = entry.candidates[entry.currentIndex];
    const placeName = form.getValues(`itinerary.${dayIndex}.placeName`)?.trim() || "";
    const sourceConfig = STOCK_PHOTO_SOURCES.find((s) => s.source === entry.source)!;

    setPhotoImportingIndex(dayIndex);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(sourceConfig.importEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
        body: JSON.stringify({
          fullUrl: candidate.fullUrl,
          downloadLocation: candidate.downloadLocation,
          description: candidate.description || placeName,
          photographerName: candidate.photographerName,
          photographerUrl: candidate.photographerUrl,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to import photo");
      }

      form.setValue(`itinerary.${dayIndex}.image`, result.media.url);
      let alt = form.getValues(`itinerary.${dayIndex}.imageAlt`)?.trim();
      if (!alt && placeName) {
        alt = buildDayPhotoAlt(dayIndex, placeName);
        form.setValue(`itinerary.${dayIndex}.imageAlt`, alt);
      }
      addToGallery(result.media.url, alt || "");
      setPhotoPreview((prev) => ({ ...prev, [dayIndex]: null }));
      toast({ title: "Photo imported", description: `Credit: ${candidate.photographerName || sourceConfig.label}` });
    } catch (error: any) {
      toast({ title: "Import failed", description: error.message, variant: "destructive" });
    } finally {
      setPhotoImportingIndex(null);
    }
  };

  const setGalleryAlt = (url: string, value: string) => {
    form.setValue("galleryAlt", { ...(form.getValues("galleryAlt") || {}), [url]: value });
  };

  const removeItineraryDay = (index: number) => {
    const currentItinerary = form.getValues("itinerary") || [];
    const updated = currentItinerary.filter((_: any, i: number) => i !== index);
    const reindexed = updated.map((day: any, idx: number) => ({ ...day, day: idx + 1 }));
    form.setValue("itinerary", reindexed);
  };

  const handleSubmit = (data: TourFormData) => {
    const transformedData = {
      ...data,
      price: Number(data.price),
      itinerary: data.itinerary.map((day, idx) => ({
        day: idx + 1,
        title: day.title.trim(),
        description: day.description.trim(),
        activities: (day.activities || []).filter(a => a.trim().length > 0).map(a => a.trim()),
        lat: day.lat,
        lng: day.lng,
        placeName: day.placeName?.trim() || undefined,
        image: day.image?.trim() || undefined,
        imageAlt: day.imageAlt?.trim() || undefined,
        accommodation: day.accommodation?.trim() || undefined,
        meals: day.meals || [],
      })),
      includes: (data.includes || []).filter(i => i.trim().length > 0),
      excludes: (data.excludes || []).filter(e => e.trim().length > 0),
      destinations: (data.destinations || []).filter(d => d.trim().length > 0),
      gallery: (data.gallery || []).filter(g => g.trim().length > 0),
      heroImageAlt: data.heroImageAlt?.trim() || undefined,
    };
    onSubmit(transformedData);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6" data-testid="tabs-tour-form">
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="content" data-testid="tab-content">Content</TabsTrigger>
          <TabsTrigger value="media" data-testid="tab-media">Media</TabsTrigger>
          <TabsTrigger value="details" data-testid="tab-details">Details</TabsTrigger>
          <TabsTrigger value="inclusions" data-testid="tab-inclusions">Inclusions</TabsTrigger>
          <TabsTrigger value="settings" data-testid="tab-settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Main details about the tour</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  data-testid="input-tour-title"
                  {...form.register("title")}
                  onChange={handleTitleChange}
                  placeholder="Amazing Nile Cruise Adventure"
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive">{String(form.formState.errors.title.message)}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  data-testid="input-tour-slug"
                  {...form.register("slug")}
                  placeholder="amazing-nile-cruise-adventure"
                />
                {form.formState.errors.slug && (
                  <p className="text-sm text-destructive">{String(form.formState.errors.slug.message)}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea
                  id="shortDescription"
                  data-testid="input-tour-short-description"
                  {...form.register("shortDescription")}
                  placeholder="Brief overview for cards and previews"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={form.watch("category")}
                  onValueChange={(value) => form.setValue("category", value)}
                >
                  <SelectTrigger data-testid="select-tour-category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesData?.categories?.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.category && (
                  <p className="text-sm text-destructive">{String(form.formState.errors.category.message)}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tour Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Full Description *</Label>
                <p className="text-sm text-muted-foreground">
                  Shown as "The Experience" on the tour page. Use paragraph breaks, links, and simple
                  formatting freely — this is what visitors read.
                </p>
                <WysiwygEditor
                  value={form.watch("description") || ""}
                  onChange={(value) => form.setValue("description", value, { shouldValidate: true })}
                  placeholder="Detailed tour description..."
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-destructive">{String(form.formState.errors.description.message)}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Itinerary</CardTitle>
              <CardDescription>Day-by-day tour schedule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {form.watch("itinerary")?.map((day: any, index: number) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">Day {day.day}</CardTitle>
                      {form.watch("itinerary").length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItineraryDay(index)}
                          data-testid={`button-remove-day-${index}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label>Day Title *</Label>
                      <Input
                        {...form.register(`itinerary.${index}.title`)}
                        placeholder="e.g., Arrive in Cairo"
                        data-testid={`input-itinerary-title-${index}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Day Description *</Label>
                      <Textarea
                        {...form.register(`itinerary.${index}.description`, {
                          onBlur: () => autoDetectFromDescription(index),
                        })}
                        placeholder="What happens on this day..."
                        rows={3}
                        data-testid={`input-itinerary-description-${index}`}
                      />
                      <p className="text-xs text-muted-foreground">
                        Place name, accommodation and meals below are auto-suggested from this text when you click away — always reviewable and editable.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Day Photo URL</Label>
                      <div className="flex gap-2">
                        <Input
                          {...form.register(`itinerary.${index}.image`)}
                          placeholder="https://example.com/day-photo.jpg"
                          data-testid={`input-itinerary-image-${index}`}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => suggestDayPhoto(index)}
                          data-testid={`button-suggest-photo-${index}`}
                        >
                          <Sparkles className="h-4 w-4" />
                          <span className="ml-2 hidden sm:inline">Suggest Photo</span>
                        </Button>
                        <Button type="button" variant="outline" className="relative" data-testid={`button-upload-day-photo-${index}`}>
                          {uploadImageMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleDayPhotoUpload(index)}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        "Suggest Photo" tries Pexels, then Pixabay, then Unsplash, and the Media Library last — either way you review before it's saved. The chosen photo is also added to the tour's gallery automatically. Uploads are automatically converted to WebP and compressed.
                      </p>

                      {photoPreview[index] && (() => {
                        const entry = photoPreview[index]!;
                        const candidate = entry.candidates[entry.currentIndex];
                        const sourceLabel = STOCK_PHOTO_SOURCES.find((s) => s.source === entry.source)!.label;
                        return (
                          <div className="border rounded-md p-3 flex gap-3 items-start bg-muted/30" data-testid={`photo-preview-${index}`}>
                            <img
                              src={candidate.thumbUrl}
                              alt={`${sourceLabel} suggestion`}
                              className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                            />
                            <div className="flex-1 space-y-2 min-w-0">
                              <p className="text-xs text-muted-foreground">
                                Suggested via {sourceLabel} — photo by{" "}
                                {candidate.photographerUrl ? (
                                  <a href={candidate.photographerUrl} target="_blank" rel="noopener noreferrer" className="underline">
                                    {candidate.photographerName || sourceLabel}
                                  </a>
                                ) : (
                                  candidate.photographerName || sourceLabel
                                )}{" "}
                                ({entry.currentIndex + 1}/{entry.candidates.length})
                              </p>
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() => useStockPhoto(index)}
                                  disabled={photoImportingIndex === index}
                                  data-testid={`button-use-photo-${index}`}
                                >
                                  {photoImportingIndex === index ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                                  Use this photo
                                </Button>
                                {entry.candidates.length > 1 && (
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => cyclePhotoPreview(index)}
                                    disabled={photoImportingIndex === index}
                                    data-testid={`button-try-another-photo-${index}`}
                                  >
                                    Try another
                                  </Button>
                                )}
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => cancelPhotoPreview(index)}
                                  disabled={photoImportingIndex === index}
                                  data-testid={`button-cancel-photo-${index}`}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                    <div className="space-y-2">
                      <Label>Day Photo Alt Text</Label>
                      <Input
                        {...form.register(`itinerary.${index}.imageAlt`)}
                        placeholder="e.g., Karnak Temple columns at sunset – iLuxury Egypt"
                        data-testid={`input-itinerary-image-alt-${index}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Place Name</Label>
                      <div className="flex gap-2">
                        <Input
                          {...form.register(`itinerary.${index}.placeName`)}
                          placeholder="e.g., Karnak Temple, Luxor"
                          data-testid={`input-itinerary-place-name-${index}`}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => findOnMap(index)}
                          disabled={geocodingDayIndex === index}
                          data-testid={`button-find-on-map-${index}`}
                        >
                          {geocodingDayIndex === index ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <MapPin className="h-4 w-4" />
                          )}
                          <span className="ml-2 hidden sm:inline">Find on Map</span>
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        A clear place name (not the day title) gives the most accurate result, e.g. "Karnak Temple" rather than "Pyramids of Giza".
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Latitude</Label>
                        <Input
                          type="number"
                          step="any"
                          {...form.register(`itinerary.${index}.lat`)}
                          placeholder="25.6872"
                          data-testid={`input-itinerary-lat-${index}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Longitude</Label>
                        <Input
                          type="number"
                          step="any"
                          {...form.register(`itinerary.${index}.lng`)}
                          placeholder="32.6396"
                          data-testid={`input-itinerary-lng-${index}`}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Used by the itinerary map. You can also type coordinates directly instead of using "Find on Map".
                    </p>
                    <div className="space-y-2">
                      <Label>Accommodation</Label>
                      {(() => {
                        const currentValue = form.watch(`itinerary.${index}.accommodation`) || "";
                        const isKnownHotel = hotelNames.includes(currentValue);
                        const isOther = otherAccommodation[index] ?? (currentValue !== "" && !isKnownHotel);
                        const selectValue = isOther ? "__other__" : isKnownHotel ? currentValue : "";
                        return (
                          <>
                            <Select
                              value={selectValue}
                              onValueChange={(value) => {
                                if (value === "__other__") {
                                  setOtherAccommodation((prev) => ({ ...prev, [index]: true }));
                                } else {
                                  setOtherAccommodation((prev) => ({ ...prev, [index]: false }));
                                  form.setValue(`itinerary.${index}.accommodation`, value);
                                }
                              }}
                            >
                              <SelectTrigger data-testid={`select-itinerary-accommodation-${index}`}>
                                <SelectValue placeholder="Select a hotel..." />
                              </SelectTrigger>
                              <SelectContent>
                                {hotelNames.map((name) => (
                                  <SelectItem key={name} value={name}>{name}</SelectItem>
                                ))}
                                <SelectItem value="__other__">Other (specify)…</SelectItem>
                              </SelectContent>
                            </Select>
                            {isOther && (
                              <Input
                                {...form.register(`itinerary.${index}.accommodation`)}
                                placeholder="e.g., Nile Cruise, Desert Camp"
                                className="mt-2"
                                data-testid={`input-itinerary-accommodation-other-${index}`}
                              />
                            )}
                          </>
                        );
                      })()}
                    </div>
                    <div className="space-y-2">
                      <Label>Meals Included</Label>
                      <div className="flex gap-4">
                        {["Breakfast", "Lunch", "Dinner"].map((meal) => (
                          <label key={meal} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={(form.watch(`itinerary.${index}.meals`) || []).includes(meal)}
                              onChange={() => toggleMeal(index, meal)}
                              data-testid={`checkbox-itinerary-meal-${meal.toLowerCase()}-${index}`}
                            />
                            {meal}
                          </label>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addItineraryDay}
                className="w-full"
                data-testid="button-add-itinerary-day"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Day
              </Button>
              {form.formState.errors.itinerary && (
                <p className="text-sm text-destructive">
                  {String(form.formState.errors.itinerary.message || "Invalid itinerary")}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tour Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="heroImage">Hero Image URL *</Label>
                <Input
                  id="heroImage"
                  data-testid="input-tour-hero-image"
                  {...form.register("heroImage")}
                  placeholder="https://example.com/image.jpg"
                />
                {form.formState.errors.heroImage && (
                  <p className="text-sm text-destructive">{String(form.formState.errors.heroImage.message)}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="heroImageAlt">Hero Image Alt Text</Label>
                <Input
                  id="heroImageAlt"
                  data-testid="input-tour-hero-image-alt"
                  {...form.register("heroImageAlt")}
                  placeholder="e.g., Sailboat on the Nile at sunset near Aswan – iLuxury Egypt"
                />
              </div>

              <div className="space-y-2">
                <Label>Gallery Images</Label>
                <div className="flex gap-2">
                  <Input
                    value={galleryInput}
                    onChange={(e) => setGalleryInput(e.target.value)}
                    placeholder="https://example.com/gallery-image.jpg"
                    data-testid="input-gallery-url"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      addArrayItem("gallery", galleryInput);
                      setGalleryInput("");
                    }}
                    data-testid="button-add-gallery"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2 mt-3">
                  {form.watch("gallery")?.map((url: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 border rounded-md p-2">
                      <Badge variant="secondary" className="shrink-0">Image {index + 1}</Badge>
                      <Input
                        value={form.watch("galleryAlt")?.[url] || ""}
                        onChange={(e) => setGalleryAlt(url, e.target.value)}
                        placeholder="Alt text for this photo"
                        className="flex-1"
                        data-testid={`input-gallery-alt-${index}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem("gallery", index)}
                        data-testid={`button-remove-gallery-${index}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="brochureUrl">Brochure PDF URL</Label>
                <Input
                  id="brochureUrl"
                  data-testid="input-tour-brochure-url"
                  {...form.register("brochureUrl")}
                  placeholder="/api/assets/uploads/brochure.pdf or https://..."
                />
                <p className="text-sm text-muted-foreground">
                  Upload the PDF in Media section first, then paste the URL here. A download button will appear on the tour page.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tour Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration *</Label>
                  <Input
                    id="duration"
                    data-testid="input-tour-duration"
                    {...form.register("duration")}
                    placeholder="5 Days / 4 Nights"
                  />
                  {form.formState.errors.duration && (
                    <p className="text-sm text-destructive">{String(form.formState.errors.duration.message)}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="groupSize">Group Size</Label>
                  <Input
                    id="groupSize"
                    data-testid="input-tour-group-size"
                    {...form.register("groupSize")}
                    placeholder="2-12 people"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="durationDays">Duration (Net Days)</Label>
                <Input
                  id="durationDays"
                  type="number"
                  min="1"
                  data-testid="input-tour-duration-days"
                  {...form.register("durationDays")}
                  placeholder="10"
                />
                <p className="text-sm text-muted-foreground">
                  Net number of days for this trip (not shown to visitors directly). Leave blank if unsure.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  value={form.watch("difficulty")}
                  onValueChange={(value) => form.setValue("difficulty", value)}
                >
                  <SelectTrigger data-testid="select-tour-difficulty">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Challenging">Challenging</SelectItem>
                    <SelectItem value="Difficult">Difficult</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    data-testid="input-tour-price"
                    type="text"
                    {...form.register("price")}
                    placeholder="1500"
                  />
                  {form.formState.errors.price && (
                    <p className="text-sm text-destructive">{String(form.formState.errors.price.message)}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={form.watch("currency")}
                    onValueChange={(value) => form.setValue("currency", value)}
                  >
                    <SelectTrigger data-testid="select-tour-currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Where You Will Stay</CardTitle>
              <CardDescription>Hotels shown in the "Where You Will Stay" section on this tour's page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {hotelsData?.hotels?.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {hotelsData.hotels.map((hotel: any) => (
                    <label key={hotel.id} className="flex items-center gap-2 text-sm border rounded-md p-2">
                      <input
                        type="checkbox"
                        checked={(form.watch("hotelIds") || []).includes(hotel.id)}
                        onChange={() => toggleHotelId(hotel.id)}
                        data-testid={`checkbox-hotel-${hotel.id}`}
                      />
                      <span>{hotel.name} <span className="text-muted-foreground">— {hotel.location}</span></span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No hotels found. Add hotels first from the Hotels section.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inclusions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>What's Included</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Add Inclusion</Label>
                <div className="flex gap-2">
                  <Input
                    value={includesInput}
                    onChange={(e) => setIncludesInput(e.target.value)}
                    placeholder="e.g., Hotel accommodation"
                    data-testid="input-includes"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      addArrayItem("includes", includesInput);
                      setIncludesInput("");
                    }}
                    data-testid="button-add-includes"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.watch("includes")?.map((item: string, index: number) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {item}
                      <button
                        type="button"
                        onClick={() => removeArrayItem("includes", index)}
                        className="ml-1"
                        data-testid={`button-remove-includes-${index}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What's Excluded</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Add Exclusion</Label>
                <div className="flex gap-2">
                  <Input
                    value={excludesInput}
                    onChange={(e) => setExcludesInput(e.target.value)}
                    placeholder="e.g., International flights"
                    data-testid="input-excludes"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      addArrayItem("excludes", excludesInput);
                      setExcludesInput("");
                    }}
                    data-testid="button-add-excludes"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.watch("excludes")?.map((item: string, index: number) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {item}
                      <button
                        type="button"
                        onClick={() => removeArrayItem("excludes", index)}
                        className="ml-1"
                        data-testid={`button-remove-excludes-${index}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Destinations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Add Destination</Label>
                <div className="flex gap-2">
                  <Input
                    value={destinationsInput}
                    onChange={(e) => setDestinationsInput(e.target.value)}
                    placeholder="e.g., Cairo"
                    data-testid="input-destinations"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      addArrayItem("destinations", destinationsInput);
                      setDestinationsInput("");
                    }}
                    data-testid="button-add-destinations"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.watch("destinations")?.map((item: string, index: number) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {item}
                      <button
                        type="button"
                        onClick={() => removeArrayItem("destinations", index)}
                        className="ml-1"
                        data-testid={`button-remove-destinations-${index}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO Overrides</CardTitle>
              <CardDescription>
                Optional — leave blank to keep using the tour title/description automatically
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seoTitle">Meta Title</Label>
                <Input
                  id="seoTitle"
                  data-testid="input-tour-seo-title"
                  {...form.register("seoTitle")}
                  placeholder={form.watch("title") || "Auto-generated from the tour title"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  data-testid="input-tour-meta-description"
                  {...form.register("metaDescription")}
                  rows={3}
                  placeholder="Auto-generated from the short description"
                />
                {(() => {
                  const len = (form.watch("metaDescription") || "").length;
                  if (len === 0) return <p className="text-xs text-muted-foreground">Ideal length: 150–160 characters</p>;
                  const inRange = len >= 150 && len <= 160;
                  return (
                    <p className={`text-xs ${inRange ? "text-green-600" : len > 160 ? "text-destructive" : "text-muted-foreground"}`}>
                      {len} / 160 characters {inRange ? "(ideal length)" : len > 160 ? "(longer than ideal)" : "(ideal: 150–160)"}
                    </p>
                  );
                })()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tour Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="featured">Featured Tour</Label>
                  <p className="text-sm text-muted-foreground">Show this tour prominently on the homepage</p>
                </div>
                <Switch
                  id="featured"
                  checked={form.watch("featured")}
                  onCheckedChange={(checked) => form.setValue("featured", checked)}
                  data-testid="switch-tour-featured"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="published">Published</Label>
                  <p className="text-sm text-muted-foreground">Make this tour visible to visitors</p>
                </div>
                <Switch
                  id="published"
                  checked={form.watch("published")}
                  onCheckedChange={(checked) => form.setValue("published", checked)}
                  data-testid="switch-tour-published"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="availabilityStatus">Availability</Label>
                <p className="text-sm text-muted-foreground">
                  Drives the availability shown to search engines and AI agents in this tour's structured data
                </p>
                <Select
                  value={form.watch("availabilityStatus")}
                  onValueChange={(value) => form.setValue("availabilityStatus", value as "available" | "limited" | "sold_out")}
                >
                  <SelectTrigger id="availabilityStatus" data-testid="select-tour-availability-status">
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="limited">Limited Availability</SelectItem>
                    <SelectItem value="sold_out">Sold Out</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button
          type="submit"
          disabled={isLoading}
          data-testid="button-submit-tour"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Tour" : "Create Tour"}
        </Button>
      </div>
    </form>
  );
}
