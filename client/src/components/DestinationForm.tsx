import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertDestinationSchema, attractionSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Loader2, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const destinationFormSchema = insertDestinationSchema.extend({
  heroImage: z.string().min(1, "Hero image is required"),
});

type DestinationFormData = z.infer<typeof destinationFormSchema>;

interface Attraction {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface DestinationFormProps {
  initialData?: Partial<any>;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export function DestinationForm({ initialData, onSubmit, isLoading }: DestinationFormProps) {
  const [attractions, setAttractions] = useState<Attraction[]>(initialData?.attractions || []);

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

  const handleSubmit = (data: DestinationFormData) => {
    const transformedData = {
      ...data,
      attractions: attractions.filter(attr => attr.name.trim().length > 0),
      highlights: attractions.filter(attr => attr.name.trim().length > 0).map(attr => attr.name),
      gallery: attractions.filter(attr => attr.image.trim().length > 0).map(attr => attr.image),
    };
    onSubmit(transformedData);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3" data-testid="tabs-destination-form">
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="attractions" data-testid="tab-attractions">Attractions</TabsTrigger>
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
                <Textarea
                  id="description"
                  data-testid="input-destination-description"
                  {...form.register("description")}
                  placeholder="Detailed destination description..."
                  rows={6}
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
                      <Label>Image URL *</Label>
                      <Input
                        value={attraction.image}
                        onChange={(e) => updateAttraction(attraction.id, "image", e.target.value)}
                        placeholder="https://example.com/attraction.jpg or /assets/image.jpg"
                        data-testid={`input-attraction-image-${index}`}
                      />
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
