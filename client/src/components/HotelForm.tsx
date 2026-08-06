import { useState } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { insertHotelSchema, facilitySchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WysiwygEditor } from "@/components/ui/wysiwyg-editor";
import { useToast } from "@/hooks/use-toast";
import { Plus, X, Loader2, GripVertical, Upload, AlertTriangle } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const HOTEL_TYPE_OPTIONS = ["Nile-view", "Historic palace", "Desert resort", "Nile cruise"];

const FACILITY_ICON_OPTIONS = [
  { value: "pool", label: "Pool" },
  { value: "spa", label: "Spa" },
  { value: "dining", label: "Dining" },
  { value: "wifi", label: "Wifi" },
  { value: "transfers", label: "Transfers" },
  { value: "concierge", label: "Concierge" },
  { value: "gym", label: "Gym" },
  { value: "ac", label: "Air Conditioning" },
  { value: "breakfast", label: "Breakfast" },
  { value: "parking", label: "Parking" },
  { value: "pets", label: "Pet Friendly" },
];

const hotelFormSchema = insertHotelSchema.extend({
  rating: z.union([z.number(), z.string().min(1)]).transform((val) =>
    typeof val === "string" ? Number(val) : val
  ),
});

type HotelFormData = z.infer<typeof hotelFormSchema>;
type FacilityData = z.infer<typeof facilitySchema>;

// Which tab each field lives in, so a validation error can jump the user
// straight to the tab that needs fixing instead of failing silently.
const FIELD_TAB_MAP: Record<string, string> = {
  name: "overview",
  slug: "overview",
  type: "overview",
  rating: "overview",
  location: "overview",
  region: "overview",
  priceTier: "overview",
  status: "overview",
  description: "content",
  article: "content",
  whyWeChoseQuote: "content",
  facilities: "facilities",
  image: "media",
  gallery: "media",
  route: "cruise-seo",
  duration: "cruise-seo",
  focusKeyword: "cruise-seo",
};

const FIELD_LABELS: Record<string, string> = {
  name: "Hotel Name",
  slug: "Slug",
  type: "Type",
  rating: "Star Rating",
  location: "Location",
  region: "City / Region",
  priceTier: "Price Tier",
  status: "Status",
  description: "Short Description",
  image: "Hero Image URL",
};

interface HotelFormProps {
  initialData?: Partial<any>;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function SortableGalleryImage({
  id,
  url,
  index,
  onRemove,
}: {
  id: string;
  url: string;
  index: number;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <img
        src={url}
        alt={`Gallery ${index + 1}`}
        className="w-full h-24 object-cover rounded-lg"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "https://via.placeholder.com/200x100?text=Invalid+URL";
        }}
      />
      <div
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1 bg-black/60 text-white rounded p-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        data-testid={`gallery-drag-handle-${index}`}
      >
        <GripVertical className="h-3 w-3" />
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        data-testid={`button-remove-gallery-${index}`}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

export function HotelForm({ initialData, onSubmit, isLoading }: HotelFormProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [highlightsInput, setHighlightsInput] = useState("");
  const [galleryUrlInput, setGalleryUrlInput] = useState("");
  const [facilityIcon, setFacilityIcon] = useState("pool");
  const [facilityLabel, setFacilityLabel] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const form = useForm<HotelFormData>({
    resolver: zodResolver(hotelFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      location: "",
      region: "",
      type: "",
      rating: 5,
      priceTier: "",
      amenities: [],
      image: "",
      description: "",
      highlights: [],
      gallery: [],
      rooms: [],
      facilities: [],
      article: "",
      whyWeChoseQuote: "",
      route: "",
      duration: "",
      status: "published",
      focusKeyword: "",
      featured: false,
      ...initialData,
    },
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue("name", name);
    if (!initialData?.slug) {
      form.setValue("slug", generateSlug(name));
    }
  };

  const suggestSlugWithKeyword = () => {
    const name = form.getValues("name");
    const keyword = form.getValues("focusKeyword");
    if (!name) return;
    form.setValue("slug", generateSlug(keyword ? `${name} ${keyword}` : name));
  };

  const addArrayItem = (field: "highlights" | "gallery", value: string) => {
    if (!value.trim()) return;
    const current = form.getValues(field) || [];
    form.setValue(field, [...current, value.trim()]);
  };

  const removeArrayItem = (field: "highlights" | "gallery", index: number) => {
    const current = form.getValues(field) || [];
    form.setValue(field, current.filter((_: any, i: number) => i !== index));
  };

  const addFacility = () => {
    if (!facilityLabel.trim()) return;
    const current = form.getValues("facilities") || [];
    form.setValue("facilities", [...current, { icon: facilityIcon, label: facilityLabel.trim() }]);
    setFacilityLabel("");
  };

  const removeFacility = (index: number) => {
    const current = form.getValues("facilities") || [];
    form.setValue("facilities", current.filter((_: any, i: number) => i !== index));
  };

  const handleGalleryDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const gallery = form.getValues("gallery") || [];
    const oldIndex = gallery.indexOf(String(active.id));
    const newIndex = gallery.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;
    form.setValue("gallery", arrayMove(gallery, oldIndex, newIndex));
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

  const handleHeroUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadImageMutation.mutate(file, {
      onSuccess: (url) => form.setValue("image", url),
    });
    e.target.value = "";
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadImageMutation.mutate(file, {
      onSuccess: (url) => addArrayItem("gallery", url),
    });
    e.target.value = "";
  };

  const handleSubmit = (data: HotelFormData) => {
    const transformedData = {
      ...data,
      rating: Number(data.rating),
      highlights: (data.highlights || []).filter((h) => h.trim().length > 0),
      gallery: (data.gallery || []).filter((g) => g.trim().length > 0),
      facilities: data.facilities || [],
    };
    onSubmit(transformedData);
  };

  const onInvalid = (errors: FieldErrors<HotelFormData>) => {
    const errorFields = Object.keys(errors);
    if (errorFields.length === 0) return;

    const firstTab = FIELD_TAB_MAP[errorFields[0]] || "overview";
    setActiveTab(firstTab);

    const description = errorFields
      .map((field) => {
        const label = FIELD_LABELS[field] || field;
        const message = (errors as Record<string, { message?: string }>)[field]?.message || "This field is invalid.";
        return `${label}: ${message}`;
      })
      .join("\n");

    toast({
      title: "Please fix the following before saving",
      description,
      variant: "destructive",
    });
  };

  const facilities: FacilityData[] = form.watch("facilities") || [];
  const gallery: string[] = form.watch("gallery") || [];
  const galleryIds = gallery.map((url) => url);

  const focusKeyword = form.watch("focusKeyword") || "";
  const name = form.watch("name") || "";
  const article = form.watch("article") || "";
  const showKeywordHint =
    focusKeyword.trim().length > 0 &&
    !name.toLowerCase().includes(focusKeyword.toLowerCase()) &&
    !stripHtml(article).toLowerCase().includes(focusKeyword.toLowerCase());

  return (
    <form onSubmit={form.handleSubmit(handleSubmit, onInvalid)} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5" data-testid="tabs-hotel-form">
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="content" data-testid="tab-content">Content</TabsTrigger>
          <TabsTrigger value="facilities" data-testid="tab-facilities">Facilities</TabsTrigger>
          <TabsTrigger value="media" data-testid="tab-media">Media</TabsTrigger>
          <TabsTrigger value="cruise-seo" data-testid="tab-cruise-seo">Cruise &amp; SEO</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Main details about the hotel or Nile cruise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Hotel Name *</Label>
                  <Input
                    id="name"
                    data-testid="input-hotel-name"
                    {...form.register("name")}
                    onChange={handleNameChange}
                    placeholder="e.g., Mena House Hotel"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive">{String(form.formState.errors.name.message)}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="slug"
                      data-testid="input-hotel-slug"
                      {...form.register("slug")}
                      placeholder="mena-house-hotel"
                    />
                    {!initialData && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={suggestSlugWithKeyword}
                        data-testid="button-suggest-slug"
                      >
                        Suggest
                      </Button>
                    )}
                  </div>
                  {form.formState.errors.slug && (
                    <p className="text-sm text-destructive">{String(form.formState.errors.slug.message)}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select value={form.watch("type")} onValueChange={(value) => form.setValue("type", value)}>
                    <SelectTrigger data-testid="select-hotel-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {HOTEL_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Matches the type filter chips on /stay</p>
                  {form.formState.errors.type && (
                    <p className="text-sm text-destructive">{String(form.formState.errors.type.message)}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rating">Star Rating *</Label>
                  <Select
                    value={form.watch("rating")?.toString()}
                    onValueChange={(value) => form.setValue("rating", parseInt(value) as any)}
                  >
                    <SelectTrigger data-testid="select-hotel-rating">
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 Stars</SelectItem>
                      <SelectItem value="4">4 Stars</SelectItem>
                      <SelectItem value="3">3 Stars</SelectItem>
                      <SelectItem value="2">2 Stars</SelectItem>
                      <SelectItem value="1">1 Star</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.rating && (
                    <p className="text-sm text-destructive">{String(form.formState.errors.rating.message)}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    data-testid="input-hotel-location"
                    {...form.register("location")}
                    placeholder="e.g., Giza"
                  />
                  {form.formState.errors.location && (
                    <p className="text-sm text-destructive">{String(form.formState.errors.location.message)}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region">City / Region *</Label>
                  <Select value={form.watch("region")} onValueChange={(value) => form.setValue("region", value)}>
                    <SelectTrigger data-testid="select-hotel-region">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cairo & Giza">Cairo & Giza</SelectItem>
                      <SelectItem value="Luxor">Luxor</SelectItem>
                      <SelectItem value="Aswan">Aswan</SelectItem>
                      <SelectItem value="Alexandria">Alexandria</SelectItem>
                      <SelectItem value="Red Sea">Red Sea</SelectItem>
                      <SelectItem value="Sinai">Sinai</SelectItem>
                      <SelectItem value="Siwa Oasis">Siwa Oasis</SelectItem>
                      <SelectItem value="Western Desert">Western Desert</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Matches the city filter chips on /stay</p>
                  {form.formState.errors.region && (
                    <p className="text-sm text-destructive">{String(form.formState.errors.region.message)}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priceTier">Price Tier *</Label>
                  <Select value={form.watch("priceTier")} onValueChange={(value) => form.setValue("priceTier", value)}>
                    <SelectTrigger data-testid="select-hotel-price-tier">
                      <SelectValue placeholder="Select price tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="$">$ - Budget</SelectItem>
                      <SelectItem value="$$">$$ - Moderate</SelectItem>
                      <SelectItem value="$$$">$$$ - Upscale</SelectItem>
                      <SelectItem value="$$$$">$$$$ - Luxury</SelectItem>
                      <SelectItem value="$$$$$">$$$$$ - Ultra Luxury</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.priceTier && (
                    <p className="text-sm text-destructive">{String(form.formState.errors.priceTier.message)}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select value={form.watch("status")} onValueChange={(value) => form.setValue("status", value as any)}>
                    <SelectTrigger data-testid="select-hotel-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Draft hotels are hidden from /stay</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
                {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Short Description</CardTitle>
              <CardDescription>One line shown on cards and previews</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                id="description"
                data-testid="input-hotel-description"
                {...form.register("description")}
                placeholder="Brief overview for hotel cards and previews..."
                rows={2}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-destructive">{String(form.formState.errors.description.message)}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Article</CardTitle>
              <CardDescription>Free-form long-form content for the hotel page</CardDescription>
            </CardHeader>
            <CardContent>
              <WysiwygEditor
                value={form.watch("article") || ""}
                onChange={(value) => form.setValue("article", value)}
                placeholder="Write the full story of this property..."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Why We Chose This Hotel</CardTitle>
              <CardDescription>The pull-quote shown in the brand-color focal section on the hotel page</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                data-testid="input-why-we-chose"
                {...form.register("whyWeChoseQuote")}
                placeholder="e.g., Because no other Nile-side terrace catches the sunset quite like this one."
                rows={3}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>Shown as badges on the hotel card and the Featured Stay card on /stay</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={highlightsInput}
                  onChange={(e) => setHighlightsInput(e.target.value)}
                  placeholder="e.g., Pyramid views"
                  data-testid="input-tags"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addArrayItem("highlights", highlightsInput);
                      setHighlightsInput("");
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => {
                    addArrayItem("highlights", highlightsInput);
                    setHighlightsInput("");
                  }}
                  data-testid="button-add-tag"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.watch("highlights")?.map((item: string, index: number) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {item}
                    <button
                      type="button"
                      onClick={() => removeArrayItem("highlights", index)}
                      className="ml-1"
                      data-testid={`button-remove-tag-${index}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Facilities Tab */}
        <TabsContent value="facilities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Facilities &amp; Amenities</CardTitle>
              <CardDescription>Icon + label pairs shown on the hotel page (pool, spa, dining, wifi...)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Select value={facilityIcon} onValueChange={setFacilityIcon}>
                  <SelectTrigger className="w-48" data-testid="select-facility-icon">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FACILITY_ICON_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={facilityLabel}
                  onChange={(e) => setFacilityLabel(e.target.value)}
                  placeholder="e.g., Infinity Pool"
                  data-testid="input-facility-label"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addFacility();
                    }
                  }}
                />
                <Button type="button" onClick={addFacility} data-testid="button-add-facility">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {facilities.map((facility, index) => (
                  <div
                    key={`${facility.label}-${index}`}
                    className="flex items-center justify-between p-3 border rounded-lg"
                    data-testid={`facility-row-${index}`}
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{FACILITY_ICON_OPTIONS.find((o) => o.value === facility.icon)?.label || facility.icon}</Badge>
                      <span className="text-sm font-medium">{facility.label}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFacility(index)}
                      data-testid={`button-remove-facility-${index}`}
                    >
                      <X className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                ))}
                {facilities.length === 0 && (
                  <p className="text-sm text-muted-foreground">No facilities added yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Image</CardTitle>
              <CardDescription>Main full-width image at the top of the hotel page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image">Hero Image URL *</Label>
                <div className="flex gap-2">
                  <Input
                    id="image"
                    data-testid="input-hotel-image"
                    {...form.register("image")}
                    placeholder="https://example.com/hotel-hero.jpg"
                  />
                  <Button type="button" variant="outline" className="relative" data-testid="button-upload-hero">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHeroUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </Button>
                </div>
                {form.formState.errors.image && (
                  <p className="text-sm text-destructive">{String(form.formState.errors.image.message)}</p>
                )}
                {form.watch("image") && (
                  <img
                    src={form.watch("image")}
                    alt="Hero preview"
                    className="mt-2 w-full max-w-md h-48 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gallery</CardTitle>
              <CardDescription>Atmosphere photos for the horizontal-scroll gallery. Drag to reorder.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={galleryUrlInput}
                  onChange={(e) => setGalleryUrlInput(e.target.value)}
                  placeholder="https://example.com/gallery-image.jpg"
                  data-testid="input-gallery-url"
                />
                <Button
                  type="button"
                  onClick={() => {
                    addArrayItem("gallery", galleryUrlInput);
                    setGalleryUrlInput("");
                  }}
                  data-testid="button-add-gallery-url"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button type="button" variant="outline" className="relative" data-testid="button-upload-gallery">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleGalleryUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </Button>
              </div>

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleGalleryDragEnd}>
                <SortableContext items={galleryIds} strategy={horizontalListSortingStrategy}>
                  <div className="grid grid-cols-4 gap-4">
                    {gallery.map((url, index) => (
                      <SortableGalleryImage
                        key={url}
                        id={url}
                        url={url}
                        index={index}
                        onRemove={() => removeArrayItem("gallery", index)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cruise & SEO Tab */}
        <TabsContent value="cruise-seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nile Cruise Details</CardTitle>
              <CardDescription>Optional — only fill these in for Nile cruise entries. Shown near the hero when present.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="route">Route</Label>
                <Input id="route" data-testid="input-route" {...form.register("route")} placeholder="e.g., Luxor → Aswan" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input id="duration" data-testid="input-duration" {...form.register("duration")} placeholder="e.g., 4 nights / 5 days" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Focus Keyword</CardTitle>
              <CardDescription>Optional SEO target phrase for this hotel's page title, description, and alt text</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Input
                data-testid="input-focus-keyword"
                {...form.register("focusKeyword")}
                placeholder="e.g., luxury hotel Giza pyramid view"
              />
              {showKeywordHint && (
                <div className="flex items-start gap-2 text-sm text-amber-600 dark:text-amber-500">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>This keyword doesn't appear in the hotel name or article yet — consider weaving it in naturally.</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button type="submit" disabled={isLoading} data-testid="button-submit-hotel">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Hotel" : "Create Hotel"}
        </Button>
      </div>
    </form>
  );
}
