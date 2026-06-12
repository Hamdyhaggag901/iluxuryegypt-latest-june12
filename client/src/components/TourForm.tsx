import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { insertTourSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Loader2 } from "lucide-react";

const tourFormSchema = insertTourSchema.extend({
  price: z.union([z.number(), z.string().min(1)]).transform((val) => 
    typeof val === "string" ? Number(val) : val
  ),
  itinerary: z.array(z.object({
    day: z.number().positive(),
    title: z.string().min(1, "Day title is required"),
    description: z.string().min(1, "Day description is required"),
    activities: z.array(z.string().min(1)).default([]),
  })).min(1, "At least one itinerary day is required"),
});

type TourFormData = z.infer<typeof tourFormSchema>;

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

  const form = useForm<TourFormData>({
    resolver: zodResolver(tourFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      shortDescription: "",
      heroImage: "",
      gallery: [],
      duration: "",
      groupSize: "",
      difficulty: "Easy",
      price: "0" as any,
      currency: "USD",
      includes: [],
      excludes: [],
      itinerary: [{ day: 1, title: "", description: "", activities: [] }],
      destinations: [],
      category: "",
      featured: false,
      published: true,
      brochureUrl: "",
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
      { day: currentItinerary.length + 1, title: "", description: "", activities: [] }
    ]);
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
      })),
      includes: (data.includes || []).filter(i => i.trim().length > 0),
      excludes: (data.excludes || []).filter(e => e.trim().length > 0),
      destinations: (data.destinations || []).filter(d => d.trim().length > 0),
      gallery: (data.gallery || []).filter(g => g.trim().length > 0),
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
                <Textarea
                  id="description"
                  data-testid="input-tour-description"
                  {...form.register("description")}
                  placeholder="Detailed tour description..."
                  rows={6}
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
                        {...form.register(`itinerary.${index}.description`)}
                        placeholder="What happens on this day..."
                        rows={3}
                        data-testid={`input-itinerary-description-${index}`}
                      />
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
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.watch("gallery")?.map((url: string, index: number) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      Image {index + 1}
                      <button
                        type="button"
                        onClick={() => removeArrayItem("gallery", index)}
                        className="ml-1"
                        data-testid={`button-remove-gallery-${index}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
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
