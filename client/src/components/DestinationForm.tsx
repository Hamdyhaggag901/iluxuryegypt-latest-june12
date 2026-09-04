import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { insertDestinationSchema, type Media, type Attraction } from "@shared/schema";
import { normalizeForMatch, suggestDayPhotoAlt } from "@shared/itinerary-detection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { WysiwygEditor } from "@/components/ui/wysiwyg-editor";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Loader2, Trash2, Sparkles, Upload, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { stripHtml } from "@shared/strip-html";

const destinationFormSchema = insertDestinationSchema.extend({
  heroImage: z.string().min(1, "Hero image is required"),
});

type DestinationFormData = z.infer<typeof destinationFormSchema>;

// Shared candidate shape across all three stock-photo sources — Unsplash is
// the only one with a downloadLocation ping its API guidelines require.
// Mirrors TourForm.tsx's itinerary-day photo pipeline exactly, applied here
// to per-attraction photos instead of per-day ones.
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

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface DestinationFormProps {
  initialData?: Partial<any>;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export function DestinationForm({ initialData, onSubmit, isLoading }: DestinationFormProps) {
  const [attractions, setAttractions] = useState<Attraction[]>(initialData?.attractions || []);
  const [faqs, setFaqs] = useState<FAQ[]>(initialData?.faqs || []);
  const [photoPreview, setPhotoPreview] = useState<Record<number, { source: StockPhotoSource; candidates: StockPhotoCandidate[]; currentIndex: number } | null>>({});
  const [photoImportingIndex, setPhotoImportingIndex] = useState<number | null>(null);
  const { toast } = useToast();

  // Used for "Suggest Photo" (matching an attraction name against media
  // filenames/alt text) — last-resort source, tried after the stock APIs.
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

  const form = useForm<DestinationFormData>({
    resolver: zodResolver(destinationFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      shortDescription: "",
      heroImage: "",
      gallery: [],
      highlights: [],
      attractions: [],
      bestTimeToVisit: "",
      duration: "",
      difficulty: "Easy",
      region: "",
      featured: false,
      published: true,
      ...initialData,
    },
  });

  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        form.setValue(key as any, initialData[key]);
      });
      if (initialData.attractions) {
        setAttractions(initialData.attractions);
      }
      if (initialData.faqs) {
        setFaqs(initialData.faqs);
      }
    }
  }, [initialData, form]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue("name", name);
    if (!initialData?.slug) {
      form.setValue("slug", generateSlug(name));
    }
  };

  // Attraction management
  const addAttraction = () => {
    const newAttraction: Attraction = {
      id: uuidv4(),
      name: "",
      description: "",
      image: "",
      imageAlt: "",
    };
    setAttractions([...attractions, newAttraction]);
  };

  const updateAttraction = (id: string, field: keyof Attraction, value: string) => {
    setAttractions(attractions.map(attr =>
      attr.id === id ? { ...attr, [field]: value } : attr
    ));
  };

  const removeAttraction = (id: string) => {
    setAttractions(attractions.filter(attr => attr.id !== id));
  };

  // FAQ management — mirrors the Attractions repeater above (same pattern:
  // local state array, add/update/remove by id) since there's no other
  // per-entity FAQ form elsewhere in the codebase to follow instead (tour
  // FAQs are auto-generated from tour data, and the sitewide /admin/faq
  // page is a separate flat CRUD list, not a repeater embedded in a form).
  const addFaq = () => {
    const newFaq: FAQ = { id: uuidv4(), question: "", answer: "" };
    setFaqs([...faqs, newFaq]);
  };

  const updateFaq = (id: string, field: keyof FAQ, value: string) => {
    setFaqs(faqs.map(faq => (faq.id === id ? { ...faq, [field]: value } : faq)));
  };

  const removeFaq = (id: string) => {
    setFaqs(faqs.filter(faq => faq.id !== id));
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

  const handleAttractionPhotoUpload = (attractionId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadImageMutation.mutate(file, {
      onSuccess: (url) => updateAttraction(attractionId, "image", url),
      onError: (error: any) => toast({ title: "Upload failed", description: error.message, variant: "destructive" }),
    });
  };

  // How many other attractions already carry a photo whose name loosely
  // matches this one — used to vary the alt-text suggestion (via
  // suggestDayPhotoAlt's variantIndex) so repeated landmark photos never get
  // identical alt text.
  const countExistingPhotosForAttraction = (name: string, excludeIndex: number): number => {
    const needle = normalizeForMatch(name);
    return attractions.filter(
      (a, i) => i !== excludeIndex && a.image?.trim() && normalizeForMatch(a.name || "").includes(needle)
    ).length;
  };

  const buildAttractionPhotoAlt = (index: number, name: string): string =>
    suggestDayPhotoAlt({
      placeName: name,
      description: attractions[index]?.description,
      variantIndex: countExistingPhotosForAttraction(name, index),
    });

  const suggestAttractionPhoto = async (index: number) => {
    const attraction = attractions[index];
    const name = attraction?.name?.trim();
    if (!name) {
      toast({ title: "Add an attraction name first", description: "Suggest Photo matches against the attraction name.", variant: "destructive" });
      return;
    }

    // 1-3) Stock sources, tried in priority order (Pexels, then Pixabay,
    // then Unsplash). Each just opens a preview the admin has to explicitly
    // approve — nothing is saved by a search call. A source that isn't
    // configured (no API key) or returns nothing is skipped silently, moving
    // straight to the next one. Tracked separately from "returned zero
    // results" so the final fallback message can tell an admin the real
    // reason nothing came back, instead of implying their search terms are
    // just too obscure to match anything.
    const token = localStorage.getItem("adminToken");
    let anySourceConfigured = false;
    for (const { source, searchEndpoint } of STOCK_PHOTO_SOURCES) {
      try {
        const response = await fetch(`${searchEndpoint}?q=${encodeURIComponent(name)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();
        if (result.configured) anySourceConfigured = true;
        if (result.success && result.candidates?.length > 0) {
          setPhotoPreview((prev) => ({ ...prev, [index]: { source, candidates: result.candidates, currentIndex: 0 } }));
          return;
        }
      } catch {
        // Fall through to the next source — any one of these is a bonus, not a dependency.
      }
    }

    // 4) Last resort — the local Media Library. Checked last on purpose: its
    // existing assets aren't always an accurate match for a given attraction,
    // so a real stock photo above is preferred whenever one is available.
    const needle = normalizeForMatch(name);
    const match = mediaImages.find(
      (m) => normalizeForMatch(m.originalName).includes(needle) || normalizeForMatch(m.altEn || "").includes(needle)
    );
    if (match) {
      updateAttraction(attraction.id, "image", match.url);
      let alt = attraction.imageAlt?.trim();
      if (!alt) {
        alt = buildAttractionPhotoAlt(index, name);
        updateAttraction(attraction.id, "imageAlt", alt);
      }
      toast({ title: "Photo suggested", description: match.originalName });
      return;
    }

    if (!anySourceConfigured) {
      toast({
        title: "Stock photo sources aren't configured",
        description: "Pexels, Pixabay, and Unsplash all have no API key set on this server — ask an admin to configure one, or upload a photo below.",
        variant: "destructive",
      });
      return;
    }

    toast({ title: "No matching photo found", description: "Upload one below, or add it to the Media Library first.", variant: "destructive" });
  };

  const cyclePhotoPreview = (index: number) => {
    setPhotoPreview((prev) => {
      const entry = prev[index];
      if (!entry) return prev;
      const nextIndex = (entry.currentIndex + 1) % entry.candidates.length;
      return { ...prev, [index]: { ...entry, currentIndex: nextIndex } };
    });
  };

  const cancelPhotoPreview = (index: number) => {
    setPhotoPreview((prev) => ({ ...prev, [index]: null }));
  };

  const useStockPhoto = async (index: number) => {
    const entry = photoPreview[index];
    const attraction = attractions[index];
    if (!entry || !attraction) return;
    const candidate = entry.candidates[entry.currentIndex];
    const name = attraction.name?.trim() || "";
    const sourceConfig = STOCK_PHOTO_SOURCES.find((s) => s.source === entry.source)!;

    setPhotoImportingIndex(index);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(sourceConfig.importEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
        body: JSON.stringify({
          fullUrl: candidate.fullUrl,
          downloadLocation: candidate.downloadLocation,
          description: candidate.description || name,
          photographerName: candidate.photographerName,
          photographerUrl: candidate.photographerUrl,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to import photo");
      }

      updateAttraction(attraction.id, "image", result.media.url);
      let alt = attraction.imageAlt?.trim();
      if (!alt && name) {
        alt = buildAttractionPhotoAlt(index, name);
      }
      if (alt) updateAttraction(attraction.id, "imageAlt", alt);
      setPhotoPreview((prev) => ({ ...prev, [index]: null }));
      toast({ title: "Photo imported", description: `Credit: ${candidate.photographerName || sourceConfig.label}` });
    } catch (error: any) {
      toast({ title: "Import failed", description: error.message, variant: "destructive" });
    } finally {
      setPhotoImportingIndex(null);
    }
  };

  const handleSubmit = (data: DestinationFormData) => {
    const transformedData = {
      ...data,
      attractions: attractions.filter(attr => attr.name.trim().length > 0),
      highlights: attractions.filter(attr => attr.name.trim().length > 0).map(attr => attr.name),
      gallery: attractions.filter(attr => attr.image.trim().length > 0).map(attr => attr.image),
      faqs: faqs.filter(faq => faq.question.trim().length > 0 && faq.answer.trim().length > 0),
    };
    onSubmit(transformedData);
  };

  const focusKeyword = form.watch("focusKeyword") || "";
  const destinationName = form.watch("name") || "";
  const description = form.watch("description") || "";
  const showKeywordHint =
    focusKeyword.trim().length > 0 &&
    !destinationName.toLowerCase().includes(focusKeyword.toLowerCase()) &&
    !stripHtml(description).toLowerCase().includes(focusKeyword.toLowerCase());

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5" data-testid="tabs-destination-form">
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="attractions" data-testid="tab-attractions">Attractions</TabsTrigger>
          <TabsTrigger value="faqs" data-testid="tab-faqs">FAQs</TabsTrigger>
          <TabsTrigger value="seo" data-testid="tab-seo">SEO</TabsTrigger>
          <TabsTrigger value="settings" data-testid="tab-settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Main details about the destination</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Destination Name *</Label>
                  <Input
                    id="name"
                    data-testid="input-destination-name"
                    {...form.register("name")}
                    onChange={handleNameChange}
                    placeholder="e.g., Cairo"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive">{String(form.formState.errors.name.message)}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    data-testid="input-destination-slug"
                    {...form.register("slug")}
                    placeholder="cairo"
                  />
                  {form.formState.errors.slug && (
                    <p className="text-sm text-destructive">{String(form.formState.errors.slug.message)}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="region">Region *</Label>
                  <Select
                    value={form.watch("region")}
                    onValueChange={(value) => form.setValue("region", value)}
                  >
                    <SelectTrigger data-testid="select-destination-region">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cairo & Giza">Cairo & Giza</SelectItem>
                      <SelectItem value="Upper Egypt">Upper Egypt</SelectItem>
                      <SelectItem value="Lower Egypt">Lower Egypt</SelectItem>
                      <SelectItem value="Red Sea">Red Sea</SelectItem>
                      <SelectItem value="Sinai">Sinai</SelectItem>
                      <SelectItem value="Western Desert">Western Desert</SelectItem>
                      <SelectItem value="Eastern Desert">Eastern Desert</SelectItem>
                      <SelectItem value="Siwa Oasis">Siwa Oasis</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.region && (
                    <p className="text-sm text-destructive">{String(form.formState.errors.region.message)}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select
                    value={form.watch("difficulty") || "Easy"}
                    onValueChange={(value) => form.setValue("difficulty", value)}
                  >
                    <SelectTrigger data-testid="select-destination-difficulty">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Challenging">Challenging</SelectItem>
                      <SelectItem value="Expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Recommended Duration</Label>
                  <Input
                    id="duration"
                    data-testid="input-destination-duration"
                    {...form.register("duration")}
                    placeholder="e.g., 2-3 days"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bestTimeToVisit">Best Time to Visit</Label>
                  <Input
                    id="bestTimeToVisit"
                    data-testid="input-destination-best-time"
                    {...form.register("bestTimeToVisit")}
                    placeholder="e.g., October to April"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description (tagline)</Label>
                <Input
                  id="shortDescription"
                  data-testid="input-destination-short-description"
                  {...form.register("shortDescription")}
                  placeholder="e.g., The City of a Thousand Minarets"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Full Description *</Label>
                <p className="text-sm text-muted-foreground">
                  Shown as the city page's Overview section. Use paragraph breaks, links, and simple
                  formatting freely — this is what visitors read.
                </p>
                <WysiwygEditor
                  value={form.watch("description") || ""}
                  onChange={(value) => form.setValue("description", value, { shouldValidate: true })}
                  placeholder="Detailed destination description..."
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-destructive">{String(form.formState.errors.description.message)}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="heroImage">Hero Image URL *</Label>
                <Input
                  id="heroImage"
                  data-testid="input-destination-hero-image"
                  {...form.register("heroImage")}
                  placeholder="https://example.com/destination-hero.jpg or /assets/image.jpg"
                />
                {form.formState.errors.heroImage && (
                  <p className="text-sm text-destructive">{String(form.formState.errors.heroImage.message)}</p>
                )}
                {form.watch("heroImage") && (
                  <div className="mt-2">
                    <img
                      src={form.watch("heroImage")}
                      alt="Hero preview"
                      className="w-full max-w-md h-48 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attractions Tab */}
        <TabsContent value="attractions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Destination Attractions</CardTitle>
              <CardDescription>Add the key attractions and highlights for this destination. Each attraction needs a name, description, and image.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {attractions.map((attraction, index) => (
                <Card key={attraction.id} className="border-2">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Attraction {index + 1}</CardTitle>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttraction(attraction.id)}
                        className="text-destructive hover:text-destructive"
                        data-testid={`button-remove-attraction-${index}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Attraction Name *</Label>
                      <Input
                        value={attraction.name}
                        onChange={(e) => updateAttraction(attraction.id, "name", e.target.value)}
                        placeholder="e.g., Bibliotheca Alexandrina"
                        data-testid={`input-attraction-name-${index}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Short Description *</Label>
                      <Textarea
                        value={attraction.description}
                        onChange={(e) => updateAttraction(attraction.id, "description", e.target.value)}
                        placeholder="A brief description of this attraction..."
                        rows={3}
                        data-testid={`input-attraction-description-${index}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Image</Label>
                      <div className="flex gap-2">
                        <Input
                          value={attraction.image}
                          onChange={(e) => updateAttraction(attraction.id, "image", e.target.value)}
                          placeholder="https://example.com/attraction.jpg or /assets/image.jpg"
                          data-testid={`input-attraction-image-${index}`}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => suggestAttractionPhoto(index)}
                          data-testid={`button-suggest-photo-${index}`}
                        >
                          <Sparkles className="h-4 w-4" />
                          <span className="ml-2 hidden sm:inline">Suggest Photo</span>
                        </Button>
                        <Button type="button" variant="outline" className="relative" data-testid={`button-upload-attraction-photo-${index}`}>
                          {uploadImageMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAttractionPhotoUpload(attraction.id)}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        "Suggest Photo" tries Pexels, then Pixabay, then Unsplash, and the Media Library last — either way you review before it's saved. Uploads are automatically converted to WebP and compressed.
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

                      {attraction.image && (
                        <div className="mt-2">
                          <img
                            src={attraction.image}
                            alt={attraction.name || "Attraction preview"}
                            className="w-full max-w-xs h-32 object-cover rounded-lg"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Image Alt Text</Label>
                      <Input
                        value={attraction.imageAlt || ""}
                        onChange={(e) => updateAttraction(attraction.id, "imageAlt", e.target.value)}
                        placeholder="e.g., Great Pyramids of Giza at golden hour"
                        data-testid={`input-attraction-image-alt-${index}`}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addAttraction}
                className="w-full"
                data-testid="button-add-attraction"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Attraction
              </Button>

              {attractions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No attractions added yet.</p>
                  <p className="text-sm">Click the button above to add attractions for this destination.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQs Tab */}
        <TabsContent value="faqs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Destination FAQs</CardTitle>
              <CardDescription>
                Shown in the "Frequently Asked Questions" section on this destination's page, and included in its
                FAQPage structured data for search engines.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={faq.id} className="border-2">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">FAQ {index + 1}</CardTitle>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFaq(faq.id)}
                        className="text-destructive hover:text-destructive"
                        data-testid={`button-remove-faq-${index}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Question *</Label>
                      <Input
                        value={faq.question}
                        onChange={(e) => updateFaq(faq.id, "question", e.target.value)}
                        placeholder="e.g., How many days do I need in Cairo?"
                        data-testid={`input-faq-question-${index}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Answer *</Label>
                      <Textarea
                        value={faq.answer}
                        onChange={(e) => updateFaq(faq.id, "answer", e.target.value)}
                        placeholder="Give a clear, specific answer..."
                        rows={3}
                        data-testid={`input-faq-answer-${index}`}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addFaq}
                className="w-full"
                data-testid="button-add-faq"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add FAQ
              </Button>

              {faqs.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No FAQs added yet.</p>
                  <p className="text-sm">Click the button above to add questions for this destination.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO Overrides</CardTitle>
              <CardDescription>
                Optional — leave blank to keep using the automatic defaults built from this destination's own name,
                description, and hero image.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seoTitle">Meta Title</Label>
                <Input
                  id="seoTitle"
                  data-testid="input-destination-seo-title"
                  {...form.register("seoTitle")}
                  placeholder={form.watch("name") ? `${form.watch("name")} - Luxury Travel Guide` : "Auto-generated from the destination name"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  data-testid="input-destination-meta-description"
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

              <div className="space-y-2">
                <Label htmlFor="focusKeyword">Focus Keyword</Label>
                <Input
                  id="focusKeyword"
                  data-testid="input-destination-focus-keyword"
                  {...form.register("focusKeyword")}
                  placeholder="e.g., luxury Cairo tours"
                />
                {showKeywordHint && (
                  <div className="flex items-start gap-2 text-sm text-amber-600 dark:text-amber-500">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>This keyword doesn't appear in the destination name or description yet — consider weaving it in naturally.</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="canonicalUrl">Canonical URL</Label>
                <Input
                  id="canonicalUrl"
                  data-testid="input-destination-canonical-url"
                  {...form.register("canonicalUrl")}
                  placeholder="Leave blank to use this page's own URL"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="robots">Robots</Label>
                  <Select
                    value={form.watch("robots") || "__default__"}
                    onValueChange={(value) => form.setValue("robots", value === "__default__" ? "" : value)}
                  >
                    <SelectTrigger id="robots" data-testid="select-destination-robots">
                      <SelectValue placeholder="Default" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__default__">Default (index, follow)</SelectItem>
                      <SelectItem value="index, follow">index, follow</SelectItem>
                      <SelectItem value="noindex, follow">noindex, follow</SelectItem>
                      <SelectItem value="index, nofollow">index, nofollow</SelectItem>
                      <SelectItem value="noindex, nofollow">noindex, nofollow</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schemaType">Schema Type</Label>
                  <Select
                    value={form.watch("schemaType") || "__default__"}
                    onValueChange={(value) => form.setValue("schemaType", value === "__default__" ? "" : value)}
                  >
                    <SelectTrigger id="schemaType" data-testid="select-destination-schema-type">
                      <SelectValue placeholder="Default" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__default__">Default (TouristDestination)</SelectItem>
                      <SelectItem value="TouristDestination">TouristDestination</SelectItem>
                      <SelectItem value="TouristAttraction">TouristAttraction</SelectItem>
                      <SelectItem value="City">City</SelectItem>
                      <SelectItem value="Place">Place</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ogImage">Social Share Image (OG Image)</Label>
                <Input
                  id="ogImage"
                  data-testid="input-destination-og-image"
                  {...form.register("ogImage")}
                  placeholder="Leave blank to use the Hero Image"
                />
                {form.watch("ogImage") && (
                  <div className="mt-2">
                    <img
                      src={form.watch("ogImage") || ""}
                      alt="OG image preview"
                      className="w-full max-w-md h-48 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Destination Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="featured">Featured Destination</Label>
                  <p className="text-sm text-muted-foreground">Show this destination prominently on the website</p>
                </div>
                <Switch
                  id="featured"
                  checked={form.watch("featured")}
                  onCheckedChange={(checked) => form.setValue("featured", checked)}
                  data-testid="switch-destination-featured"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="published">Published</Label>
                  <p className="text-sm text-muted-foreground">Make this destination visible to visitors</p>
                </div>
                <Switch
                  id="published"
                  checked={form.watch("published")}
                  onCheckedChange={(checked) => form.setValue("published", checked)}
                  data-testid="switch-destination-published"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button
          type="submit"
          disabled={isLoading}
          data-testid="button-submit-destination"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Destination" : "Create Destination"}
        </Button>
      </div>
    </form>
  );
}
