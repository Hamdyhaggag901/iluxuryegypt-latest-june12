import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, GripVertical, Star, Waves, Sparkles, Shield, Utensils, Car, Wifi, Image } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const iconOptions = [
  { value: "star", label: "Star", icon: Star },
  { value: "waves", label: "Waves", icon: Waves },
  { value: "sparkles", label: "Sparkles", icon: Sparkles },
  { value: "shield", label: "Shield", icon: Shield },
  { value: "utensils", label: "Utensils", icon: Utensils },
  { value: "car", label: "Car", icon: Car },
  { value: "wifi", label: "WiFi", icon: Wifi },
];

const getIconComponent = (iconName: string) => {
  const option = iconOptions.find(o => o.value === iconName);
  if (option) {
    const IconComponent = option.icon;
    return <IconComponent className="h-5 w-5" />;
  }
  return <Star className="h-5 w-5" />;
};

export default function AdminStayPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Dialog states
  const [accommodationDialog, setAccommodationDialog] = useState(false);
  const [featureDialog, setFeatureDialog] = useState(false);
  const [editingAccommodation, setEditingAccommodation] = useState<any>(null);
  const [editingFeature, setEditingFeature] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string } | null>(null);

  // Form states for hero
  const [heroForm, setHeroForm] = useState({
    title: "",
    subtitle: "",
    backgroundImage: "",
    primaryButtonText: "",
    primaryButtonLink: "",
    secondaryButtonText: "",
    secondaryButtonLink: "",
  });

  // Form states for accommodation types
  const [accommodationForm, setAccommodationForm] = useState({
    icon: "star",
    title: "",
    description: "",
    count: "",
    sortOrder: 0,
    isActive: true,
  });

  // Form states for luxury features
  const [featureForm, setFeatureForm] = useState({
    icon: "star",
    title: "",
    description: "",
    sortOrder: 0,
    isActive: true,
  });

  // Form states for nile section
  const [nileForm, setNileForm] = useState({
    title: "",
    paragraphs: ["", "", ""],
    buttonText: "",
    buttonLink: "",
    images: ["", "", "", ""],
  });

  // Form states for CTA
  const [ctaForm, setCtaForm] = useState({
    title: "",
    subtitle: "",
    primaryButtonText: "",
    primaryButtonLink: "",
    secondaryButtonText: "",
    secondaryButtonLink: "",
  });

  // Fetch hero
  const { data: heroData, isLoading: heroLoading } = useQuery({
    queryKey: ["/api/cms/stay-page/hero"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/cms/stay-page/hero");
      if (res.hero) {
        setHeroForm({
          title: res.hero.title || "",
          subtitle: res.hero.subtitle || "",
          backgroundImage: res.hero.backgroundImage || "",
          primaryButtonText: res.hero.primaryButtonText || "",
          primaryButtonLink: res.hero.primaryButtonLink || "",
          secondaryButtonText: res.hero.secondaryButtonText || "",
          secondaryButtonLink: res.hero.secondaryButtonLink || "",
        });
      }
      return res;
    },
  });

  // Fetch accommodation types
  const { data: accommodationData, isLoading: accommodationLoading } = useQuery({
    queryKey: ["/api/cms/stay-page/accommodation-types"],
  });

  // Fetch luxury features
  const { data: featuresData, isLoading: featuresLoading } = useQuery({
    queryKey: ["/api/cms/stay-page/luxury-features"],
  });

  // Fetch nile section
  const { data: nileData, isLoading: nileLoading } = useQuery({
    queryKey: ["/api/cms/stay-page/nile-section"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/cms/stay-page/nile-section");
      if (res.section) {
        setNileForm({
          title: res.section.title || "",
          paragraphs: res.section.paragraphs?.length > 0 ? res.section.paragraphs : ["", "", ""],
          buttonText: res.section.buttonText || "",
          buttonLink: res.section.buttonLink || "",
          images: res.section.images?.length > 0 ? res.section.images : ["", "", "", ""],
        });
      }
      return res;
    },
  });

  // Fetch CTA
  const { data: ctaData, isLoading: ctaLoading } = useQuery({
    queryKey: ["/api/cms/stay-page/cta"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/cms/stay-page/cta");
      if (res.cta) {
        setCtaForm({
          title: res.cta.title || "",
          subtitle: res.cta.subtitle || "",
          primaryButtonText: res.cta.primaryButtonText || "",
          primaryButtonLink: res.cta.primaryButtonLink || "",
          secondaryButtonText: res.cta.secondaryButtonText || "",
          secondaryButtonLink: res.cta.secondaryButtonLink || "",
        });
      }
      return res;
    },
  });

  // Mutations
  const saveHeroMutation = useMutation({
    mutationFn: async (data: typeof heroForm) => {
      return await apiRequest("POST", "/api/cms/stay-page/hero", data);
    },
    onSuccess: () => {
      toast({ title: "Hero section saved successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/stay-page/hero"] });
    },
    onError: () => {
      toast({ title: "Error saving hero section", variant: "destructive" });
    },
  });

  const createAccommodationMutation = useMutation({
    mutationFn: async (data: typeof accommodationForm) => {
      return await apiRequest("POST", "/api/cms/stay-page/accommodation-types", data);
    },
    onSuccess: () => {
      toast({ title: "Accommodation type created" });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/stay-page/accommodation-types"] });
      setAccommodationDialog(false);
      resetAccommodationForm();
    },
    onError: () => {
      toast({ title: "Error creating accommodation type", variant: "destructive" });
    },
  });

  const updateAccommodationMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof accommodationForm }) => {
      return await apiRequest("PUT", `/api/cms/stay-page/accommodation-types/${id}`, data);
    },
    onSuccess: () => {
      toast({ title: "Accommodation type updated" });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/stay-page/accommodation-types"] });
      setAccommodationDialog(false);
      setEditingAccommodation(null);
      resetAccommodationForm();
    },
    onError: () => {
      toast({ title: "Error updating accommodation type", variant: "destructive" });
    },
  });

  const deleteAccommodationMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/cms/stay-page/accommodation-types/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Accommodation type deleted" });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/stay-page/accommodation-types"] });
      setDeleteConfirm(null);
    },
    onError: () => {
      toast({ title: "Error deleting accommodation type", variant: "destructive" });
    },
  });

  const createFeatureMutation = useMutation({
    mutationFn: async (data: typeof featureForm) => {
      return await apiRequest("POST", "/api/cms/stay-page/luxury-features", data);
    },
    onSuccess: () => {
      toast({ title: "Luxury feature created" });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/stay-page/luxury-features"] });
      setFeatureDialog(false);
      resetFeatureForm();
    },
    onError: () => {
      toast({ title: "Error creating luxury feature", variant: "destructive" });
    },
  });

  const updateFeatureMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof featureForm }) => {
      return await apiRequest("PUT", `/api/cms/stay-page/luxury-features/${id}`, data);
    },
    onSuccess: () => {
      toast({ title: "Luxury feature updated" });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/stay-page/luxury-features"] });
      setFeatureDialog(false);
      setEditingFeature(null);
      resetFeatureForm();
    },
    onError: () => {
      toast({ title: "Error updating luxury feature", variant: "destructive" });
    },
  });

  const deleteFeatureMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/cms/stay-page/luxury-features/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Luxury feature deleted" });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/stay-page/luxury-features"] });
      setDeleteConfirm(null);
    },
    onError: () => {
      toast({ title: "Error deleting luxury feature", variant: "destructive" });
    },
  });

  const saveNileMutation = useMutation({
    mutationFn: async (data: typeof nileForm) => {
      return await apiRequest("POST", "/api/cms/stay-page/nile-section", data);
    },
    onSuccess: () => {
      toast({ title: "Nile section saved successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/stay-page/nile-section"] });
    },
    onError: () => {
      toast({ title: "Error saving nile section", variant: "destructive" });
    },
  });

  const saveCtaMutation = useMutation({
    mutationFn: async (data: typeof ctaForm) => {
      return await apiRequest("POST", "/api/cms/stay-page/cta", data);
    },
    onSuccess: () => {
      toast({ title: "CTA section saved successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/stay-page/cta"] });
    },
    onError: () => {
      toast({ title: "Error saving CTA section", variant: "destructive" });
    },
  });

  const resetAccommodationForm = () => {
    setAccommodationForm({
      icon: "star",
      title: "",
      description: "",
      count: "",
      sortOrder: 0,
      isActive: true,
    });
  };

  const resetFeatureForm = () => {
    setFeatureForm({
      icon: "star",
      title: "",
      description: "",
      sortOrder: 0,
      isActive: true,
    });
  };

  const openEditAccommodation = (item: any) => {
    setEditingAccommodation(item);
    setAccommodationForm({
      icon: item.icon || "star",
      title: item.title || "",
      description: item.description || "",
      count: item.count || "",
      sortOrder: item.sortOrder || 0,
      isActive: item.isActive ?? true,
    });
    setAccommodationDialog(true);
  };

  const openEditFeature = (item: any) => {
    setEditingFeature(item);
    setFeatureForm({
      icon: item.icon || "star",
      title: item.title || "",
      description: item.description || "",
      sortOrder: item.sortOrder || 0,
      isActive: item.isActive ?? true,
    });
    setFeatureDialog(true);
  };

  const handleSaveAccommodation = () => {
    if (editingAccommodation) {
      updateAccommodationMutation.mutate({ id: editingAccommodation.id, data: accommodationForm });
    } else {
      createAccommodationMutation.mutate(accommodationForm);
    }
  };

  const handleSaveFeature = () => {
    if (editingFeature) {
      updateFeatureMutation.mutate({ id: editingFeature.id, data: featureForm });
    } else {
      createFeatureMutation.mutate(featureForm);
    }
  };

  const handleDelete = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === "accommodation") {
      deleteAccommodationMutation.mutate(deleteConfirm.id);
    } else if (deleteConfirm.type === "feature") {
      deleteFeatureMutation.mutate(deleteConfirm.id);
    }
  };

  const isLoading = heroLoading || accommodationLoading || featuresLoading || nileLoading || ctaLoading;

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 pb-10">
        <div>
          <h1 className="text-3xl font-bold">Stay Page Editor</h1>
          <p className="text-muted-foreground mt-1">
            Edit the content sections of the Stay page
          </p>
        </div>

        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
            <CardDescription>The main banner at the top of the page</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={heroForm.title}
                  onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                  placeholder="Luxury Accommodations"
                />
              </div>
              <div className="space-y-2">
                <Label>Background Image URL</Label>
                <Input
                  value={heroForm.backgroundImage}
                  onChange={(e) => setHeroForm({ ...heroForm, backgroundImage: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Textarea
                value={heroForm.subtitle}
                onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                placeholder="From historic palaces to modern resorts..."
                rows={2}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Primary Button Text</Label>
                <Input
                  value={heroForm.primaryButtonText}
                  onChange={(e) => setHeroForm({ ...heroForm, primaryButtonText: e.target.value })}
                  placeholder="Book Your Stay"
                />
              </div>
              <div className="space-y-2">
                <Label>Primary Button Link</Label>
                <Input
                  value={heroForm.primaryButtonLink}
                  onChange={(e) => setHeroForm({ ...heroForm, primaryButtonLink: e.target.value })}
                  placeholder="/contact"
                />
              </div>
              <div className="space-y-2">
                <Label>Secondary Button Text</Label>
                <Input
                  value={heroForm.secondaryButtonText}
                  onChange={(e) => setHeroForm({ ...heroForm, secondaryButtonText: e.target.value })}
                  placeholder="Explore Destinations"
                />
              </div>
              <div className="space-y-2">
                <Label>Secondary Button Link</Label>
                <Input
                  value={heroForm.secondaryButtonLink}
                  onChange={(e) => setHeroForm({ ...heroForm, secondaryButtonLink: e.target.value })}
                  placeholder="/destinations"
                />
              </div>
            </div>
            <Button onClick={() => saveHeroMutation.mutate(heroForm)} disabled={saveHeroMutation.isPending}>
              {saveHeroMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Hero Section
            </Button>
          </CardContent>
        </Card>

        {/* Accommodation Types */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Accommodation Types</CardTitle>
              <CardDescription>The 4 cards showing accommodation categories</CardDescription>
            </div>
            <Button onClick={() => { resetAccommodationForm(); setEditingAccommodation(null); setAccommodationDialog(true); }}>
              <Plus className="h-4 w-4 mr-2" /> Add Type
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {accommodationData?.types?.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                      {getIconComponent(item.icon)}
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.count}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => openEditAccommodation(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteConfirm({ type: "accommodation", id: item.id })}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
              {(!accommodationData?.types || accommodationData.types.length === 0) && (
                <p className="text-center text-muted-foreground py-8">No accommodation types yet. Add one to get started.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Luxury Features */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Luxury Features & Services</CardTitle>
              <CardDescription>Features displayed in the luxury services section</CardDescription>
            </div>
            <Button onClick={() => { resetFeatureForm(); setEditingFeature(null); setFeatureDialog(true); }}>
              <Plus className="h-4 w-4 mr-2" /> Add Feature
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {featuresData?.features?.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                      {getIconComponent(item.icon)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEditFeature(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteConfirm({ type: "feature", id: item.id })}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
              {(!featuresData?.features || featuresData.features.length === 0) && (
                <p className="col-span-2 text-center text-muted-foreground py-8">No luxury features yet. Add one to get started.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Nile Section */}
        <Card>
          <CardHeader>
            <CardTitle>Nile-View Suites Section</CardTitle>
            <CardDescription>The featured Nile suite showcase section</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={nileForm.title}
                onChange={(e) => setNileForm({ ...nileForm, title: e.target.value })}
                placeholder="Nile-View Suites"
              />
            </div>
            <div className="space-y-2">
              <Label>Paragraphs</Label>
              {nileForm.paragraphs.map((p, i) => (
                <Textarea
                  key={i}
                  value={p}
                  onChange={(e) => {
                    const newParagraphs = [...nileForm.paragraphs];
                    newParagraphs[i] = e.target.value;
                    setNileForm({ ...nileForm, paragraphs: newParagraphs });
                  }}
                  placeholder={`Paragraph ${i + 1}`}
                  rows={2}
                />
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Button Text</Label>
                <Input
                  value={nileForm.buttonText}
                  onChange={(e) => setNileForm({ ...nileForm, buttonText: e.target.value })}
                  placeholder="Reserve Nile Suite"
                />
              </div>
              <div className="space-y-2">
                <Label>Button Link</Label>
                <Input
                  value={nileForm.buttonLink}
                  onChange={(e) => setNileForm({ ...nileForm, buttonLink: e.target.value })}
                  placeholder="/contact"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Images (4 images)</Label>
              <div className="grid grid-cols-2 gap-2">
                {nileForm.images.map((img, i) => (
                  <Input
                    key={i}
                    value={img}
                    onChange={(e) => {
                      const newImages = [...nileForm.images];
                      newImages[i] = e.target.value;
                      setNileForm({ ...nileForm, images: newImages });
                    }}
                    placeholder={`Image ${i + 1} URL`}
                  />
                ))}
              </div>
            </div>
            <Button onClick={() => saveNileMutation.mutate(nileForm)} disabled={saveNileMutation.isPending}>
              {saveNileMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Nile Section
            </Button>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card>
          <CardHeader>
            <CardTitle>Call to Action Section</CardTitle>
            <CardDescription>The final CTA at the bottom of the page</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={ctaForm.title}
                onChange={(e) => setCtaForm({ ...ctaForm, title: e.target.value })}
                placeholder="Book Your Perfect Stay"
              />
            </div>
            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Textarea
                value={ctaForm.subtitle}
                onChange={(e) => setCtaForm({ ...ctaForm, subtitle: e.target.value })}
                placeholder="Our luxury travel specialists will secure the perfect accommodation..."
                rows={2}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Primary Button Text</Label>
                <Input
                  value={ctaForm.primaryButtonText}
                  onChange={(e) => setCtaForm({ ...ctaForm, primaryButtonText: e.target.value })}
                  placeholder="Contact Our Specialists"
                />
              </div>
              <div className="space-y-2">
                <Label>Primary Button Link</Label>
                <Input
                  value={ctaForm.primaryButtonLink}
                  onChange={(e) => setCtaForm({ ...ctaForm, primaryButtonLink: e.target.value })}
                  placeholder="/contact"
                />
              </div>
              <div className="space-y-2">
                <Label>Secondary Button Text</Label>
                <Input
                  value={ctaForm.secondaryButtonText}
                  onChange={(e) => setCtaForm({ ...ctaForm, secondaryButtonText: e.target.value })}
                  placeholder="View All Destinations"
                />
              </div>
              <div className="space-y-2">
                <Label>Secondary Button Link</Label>
                <Input
                  value={ctaForm.secondaryButtonLink}
                  onChange={(e) => setCtaForm({ ...ctaForm, secondaryButtonLink: e.target.value })}
                  placeholder="/destinations"
                />
              </div>
            </div>
            <Button onClick={() => saveCtaMutation.mutate(ctaForm)} disabled={saveCtaMutation.isPending}>
              {saveCtaMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save CTA Section
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Accommodation Type Dialog */}
      <Dialog open={accommodationDialog} onOpenChange={(open) => { if (!open) { setEditingAccommodation(null); resetAccommodationForm(); } setAccommodationDialog(open); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAccommodation ? "Edit Accommodation Type" : "Add Accommodation Type"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Icon</Label>
              <Select value={accommodationForm.icon} onValueChange={(v) => setAccommodationForm({ ...accommodationForm, icon: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div className="flex items-center gap-2">
                        <opt.icon className="h-4 w-4" />
                        {opt.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={accommodationForm.title}
                onChange={(e) => setAccommodationForm({ ...accommodationForm, title: e.target.value })}
                placeholder="Luxury Hotels"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={accommodationForm.description}
                onChange={(e) => setAccommodationForm({ ...accommodationForm, description: e.target.value })}
                placeholder="Five-star properties with world-class service..."
              />
            </div>
            <div className="space-y-2">
              <Label>Count</Label>
              <Input
                value={accommodationForm.count}
                onChange={(e) => setAccommodationForm({ ...accommodationForm, count: e.target.value })}
                placeholder="15+ Partners"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sort Order</Label>
                <Input
                  type="number"
                  value={accommodationForm.sortOrder}
                  onChange={(e) => setAccommodationForm({ ...accommodationForm, sortOrder: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  checked={accommodationForm.isActive}
                  onCheckedChange={(v) => setAccommodationForm({ ...accommodationForm, isActive: v })}
                />
                <Label>Active</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAccommodationDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveAccommodation} disabled={createAccommodationMutation.isPending || updateAccommodationMutation.isPending}>
              {(createAccommodationMutation.isPending || updateAccommodationMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Luxury Feature Dialog */}
      <Dialog open={featureDialog} onOpenChange={(open) => { if (!open) { setEditingFeature(null); resetFeatureForm(); } setFeatureDialog(open); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingFeature ? "Edit Luxury Feature" : "Add Luxury Feature"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Icon</Label>
              <Select value={featureForm.icon} onValueChange={(v) => setFeatureForm({ ...featureForm, icon: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div className="flex items-center gap-2">
                        <opt.icon className="h-4 w-4" />
                        {opt.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={featureForm.title}
                onChange={(e) => setFeatureForm({ ...featureForm, title: e.target.value })}
                placeholder="Gourmet Dining"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={featureForm.description}
                onChange={(e) => setFeatureForm({ ...featureForm, description: e.target.value })}
                placeholder="World-class restaurants featuring..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sort Order</Label>
                <Input
                  type="number"
                  value={featureForm.sortOrder}
                  onChange={(e) => setFeatureForm({ ...featureForm, sortOrder: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  checked={featureForm.isActive}
                  onCheckedChange={(v) => setFeatureForm({ ...featureForm, isActive: v })}
                />
                <Label>Active</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFeatureDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveFeature} disabled={createFeatureMutation.isPending || updateFeatureMutation.isPending}>
              {(createFeatureMutation.isPending || updateFeatureMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {deleteConfirm?.type === "accommodation" ? "accommodation type" : "luxury feature"}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteAccommodationMutation.isPending || deleteFeatureMutation.isPending}>
              {(deleteAccommodationMutation.isPending || deleteFeatureMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
