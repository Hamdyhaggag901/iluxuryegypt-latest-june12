
import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminPackageForm() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/admin/packages/:id/edit");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditMode = !!params?.id;

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    shortDescription: "",
    heroImage: "",
    gallery: [] as string[],
    duration: "",
    groupSize: "",
    price: 0,
    currency: "USD",
    includes: [] as string[],
    excludes: [] as string[],
    tours: [] as string[],
    hotels: [] as string[],
    destinations: [] as string[],
    category: "",
    featured: false,
    published: true
  });

  const [includesInput, setIncludesInput] = useState("");
  const [excludesInput, setExcludesInput] = useState("");
  const [galleryInput, setGalleryInput] = useState("");

  // Fetch package data if editing
  const { data: packageData } = useQuery({
    queryKey: [`/api/cms/packages/${params?.id}`],
    queryFn: async () => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/cms/packages/${params?.id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch package");
      return response.json();
    },
    enabled: isEditMode
  });

  useEffect(() => {
    if (packageData?.package) {
      setFormData(packageData.package);
    }
  }, [packageData]);

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const token = localStorage.getItem("adminToken");
      const url = isEditMode 
        ? `/api/cms/packages/${params?.id}`
        : "/api/cms/packages";
      
      const response = await fetch(url, {
        method: isEditMode ? "PUT" : "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) throw new Error("Failed to save package");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/packages"] });
      toast({
        title: "Success",
        description: `Package ${isEditMode ? "updated" : "created"} successfully`
      });
      setLocation("/admin/packages");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save package",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const addToArray = (field: 'includes' | 'excludes' | 'gallery', value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      if (field === 'includes') setIncludesInput("");
      if (field === 'excludes') setExcludesInput("");
      if (field === 'gallery') setGalleryInput("");
    }
  };

  const removeFromArray = (field: 'includes' | 'excludes' | 'gallery', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/admin/packages")}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Packages
            </Button>
            <h1 className="text-xl font-semibold">
              {isEditMode ? "Edit Package" : "Create New Package"}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Package Details</CardTitle>
              <CardDescription>
                Fill in the package information below
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Package Name*</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug*</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description*</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea
                  id="shortDescription"
                  value={formData.shortDescription || ""}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category*</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heroImage">Hero Image URL*</Label>
                  <Input
                    id="heroImage"
                    value={formData.heroImage}
                    onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration*</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 7 Days / 6 Nights"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price*</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="groupSize">Group Size</Label>
                <Input
                  id="groupSize"
                  value={formData.groupSize || ""}
                  onChange={(e) => setFormData({ ...formData, groupSize: e.target.value })}
                  placeholder="e.g., 2-12 people"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                  <Label htmlFor="featured">Featured Package</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                  />
                  <Label htmlFor="published">Published</Label>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/admin/packages")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="h-4 w-4 mr-2" />
                  {isEditMode ? "Update Package" : "Create Package"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </main>
    </div>
  );
}
