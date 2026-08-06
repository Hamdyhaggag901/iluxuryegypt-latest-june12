import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, X, Pencil, Trash2, Star, Waves, Sparkles, Shield, Utensils, Car, Wifi, ArrowRight } from "lucide-react";
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
  const [featureDialog, setFeatureDialog] = useState(false);
  const [editingFeature, setEditingFeature] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string } | null>(null);

  // Form state for listing settings (header, chips, featured hotel)
  const [listingForm, setListingForm] = useState({
    eyebrow: "",
    title: "",
    description: "",
    typeChips: [] as string[],
    cityChips: [] as string[],
    featuredHotelId: "",
  });
  const [typeChipInput, setTypeChipInput] = useState("");
  const [cityChipInput, setCityChipInput] = useState("");

  // Form states for luxury features (rendered on /stay as "Why Book Through Us")
  const [featureForm, setFeatureForm] = useState({
    icon: "star",
    title: "",
    description: "",
    sortOrder: 0,
    isActive: true,
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

  // Fetch listing settings
  const { data: listingSettingsData, isLoading: listingLoading } = useQuery({
    queryKey: ["/api/cms/stay-page/listing-settings"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/cms/stay-page/listing-settings");
      if (res.settings) {
        setListingForm({
          eyebrow: res.settings.eyebrow || "",
          title: res.settings.title || "",
          description: res.settings.description || "",
          typeChips: res.settings.typeChips || [],
          cityChips: res.settings.cityChips || [],
          featuredHotelId: res.settings.featuredHotelId || "",
        });
      }
      return res;
    },
  });

  // Fetch hotels (for the Featured Stay selector)
  const { data: hotelsData, isLoading: hotelsLoading } = useQuery({
    queryKey: ["/api/cms/hotels"],
  });
  const hotels = (hotelsData as any)?.hotels || [];

  // Fetch luxury features
  const { data: featuresDataRaw, isLoading: featuresLoading } = useQuery({
    queryKey: ["/api/cms/stay-page/luxury-features"],
  });
  const featuresData = featuresDataRaw as { features?: any[] } | undefined;

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
  const saveListingSettingsMutation = useMutation({
    mutationFn: async (data: typeof listingForm) => {
      return await apiRequest("POST", "/api/cms/stay-page/listing-settings", data);
    },
    onSuccess: () => {
      toast({ title: "Stay listing settings saved successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/stay-page/listing-settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/public/stay-page"] });
    },
    onError: () => {
      toast({ title: "Error saving listing settings", variant: "destructive" });
    },
  });

  const createFeatureMutation = useMutation({
    mutationFn: async (data: typeof featureForm) => {
      return await apiRequest("POST", "/api/cms/stay-page/luxury-features", data);
    },
    onSuccess: () => {
      toast({ title: "Point created" });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/stay-page/luxury-features"] });
      setFeatureDialog(false);
      resetFeatureForm();
    },
    onError: () => {
      toast({ title: "Error creating point", variant: "destructive" });
    },
  });

  const updateFeatureMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof featureForm }) => {
      return await apiRequest("PUT", `/api/cms/stay-page/luxury-features/${id}`, data);
    },
    onSuccess: () => {
      toast({ title: "Point updated" });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/stay-page/luxury-features"] });
      setFeatureDialog(false);
      setEditingFeature(null);
      resetFeatureForm();
    },
    onError: () => {
      toast({ title: "Error updating point", variant: "destructive" });
    },
  });

  const deleteFeatureMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/cms/stay-page/luxury-features/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Point deleted" });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/stay-page/luxury-features"] });
      setDeleteConfirm(null);
    },
    onError: () => {
      toast({ title: "Error deleting point", variant: "destructive" });
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

  const resetFeatureForm = () => {
    setFeatureForm({
      icon: "star",
      title: "",
      description: "",
      sortOrder: 0,
      isActive: true,
    });
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

  const handleSaveFeature = () => {
    if (editingFeature) {
      updateFeatureMutation.mutate({ id: editingFeature.id, data: featureForm });
    } else {
      createFeatureMutation.mutate(featureForm);
    }
  };

  const handleDelete = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === "feature") {
      deleteFeatureMutation.mutate(deleteConfirm.id);
    }
  };

  const addTypeChip = () => {
    if (!typeChipInput.trim()) return;
    setListingForm({ ...listingForm, typeChips: [...listingForm.typeChips, typeChipInput.trim()] });
    setTypeChipInput("");
  };

  const removeTypeChip = (index: number) => {
    setListingForm({ ...listingForm, typeChips: listingForm.typeChips.filter((_, i) => i !== index) });
  };

  const addCityChip = () => {
    if (!cityChipInput.trim()) return;
    setListingForm({ ...listingForm, cityChips: [...listingForm.cityChips, cityChipInput.trim()] });
    setCityChipInput("");
  };

  const removeCityChip = (index: number) => {
    setListingForm({ ...listingForm, cityChips: listingForm.cityChips.filter((_, i) => i !== index) });
  };

  const isLoading = listingLoading || hotelsLoading || featuresLoading || ctaLoading;

  if (isLoading) {
    return (
      <AdminLayout title="Stay Page" description="Edit the /stay listing page">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }
    return (
    <AdminLayout title="Stay Page" description="Edit the /stay listing page">
      <div className="space-y-8 pb-10">
        <div>
          <h1 className="text-3xl font-bold">Stay Page Editor</h1>
          <p className="text-muted-foreground mt-1">
            Edit the /stay listing page — header, filters, featured stay, and the closing CTA
          </p>
        </div>

        {/* Stay Listing Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Header &amp; Filters</CardTitle>
            <CardDescription>The intro text at the top of /stay and the filter chips visitors can use</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Eyebrow</Label>
                <Input
                  value={listingForm.eyebrow}
                  onChange={(e) => setListingForm({ ...listingForm, eyebrow: e.target.value })}
                  placeholder="The Collection"
                />
              </div>
              <div className="space-y-2">
                <Label>Title (H1)</Label>
                <Input
                  value={listingForm.title}
                  onChange={(e) => setListingForm({ ...listingForm, title: e.target.value })}
                  placeholder="Where You'll Stay in Egypt"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={listingForm.description}
                onChange={(e) => setListingForm({ ...listingForm, description: e.target.value })}
                placeholder="A handpicked portfolio of Egypt's finest hotels..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Type Chips</Label>
              <p className="text-xs text-muted-foreground">
                Should match the hotel "Type" values used in the Hotels form (e.g. Nile-view, Historic palace, Desert resort, Nile cruise)
              </p>
              <div className="flex gap-2">
                <Input
                  value={typeChipInput}
                  onChange={(e) => setTypeChipInput(e.target.value)}
                  placeholder="e.g., Nile-view"
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTypeChip(); } }}
                  data-testid="input-type-chip"
                />
                <Button type="button" onClick={addTypeChip} data-testid="button-add-type-chip">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {listingForm.typeChips.map((chip, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {chip}
                    <button type="button" onClick={() => removeTypeChip(index)} data-testid={`button-remove-type-chip-${index}`}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>City Chips</Label>
              <p className="text-xs text-muted-foreground">Should match hotel "City / Region" values (e.g. Cairo & Giza, Luxor, Aswan, Red Sea)</p>
              <div className="flex gap-2">
                <Input
                  value={cityChipInput}
                  onChange={(e) => setCityChipInput(e.target.value)}
                  placeholder="e.g., Cairo"
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCityChip(); } }}
                  data-testid="input-city-chip"
                />
                <Button type="button" onClick={addCityChip} data-testid="button-add-city-chip">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {listingForm.cityChips.map((chip, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {chip}
                    <button type="button" onClick={() => removeCityChip(index)} data-testid={`button-remove-city-chip-${index}`}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Featured Stay</Label>
              <p className="text-xs text-muted-foreground">The one property shown in the large spotlight card at the top of the grid</p>
              <Select
                value={listingForm.featuredHotelId || "none"}
                onValueChange={(v) => setListingForm({ ...listingForm, featuredHotelId: v === "none" ? "" : v })}
              >
                <SelectTrigger data-testid="select-featured-hotel">
                  <SelectValue placeholder="No featured stay" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {hotels.map((hotel: any) => (
                    <SelectItem key={hotel.id} value={hotel.id}>{hotel.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <p className="text-sm text-muted-foreground">
                Grid order and adding/removing hotels is managed on the Hotels page.
              </p>
              <Link href="/admin/hotels">
                <Button variant="outline" size="sm" data-testid="link-manage-hotels">
                  Manage Hotels <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>

            <Button
              onClick={() => saveListingSettingsMutation.mutate(listingForm)}
              disabled={saveListingSettingsMutation.isPending}
              data-testid="button-save-listing-settings"
            >
              {saveListingSettingsMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Header &amp; Filters
            </Button>
          </CardContent>
        </Card>

        {/* Why Book Through Us */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Why Book Through Us</CardTitle>
              <CardDescription>The 3 trust points shown once on /stay (e.g. Concierge Service, Exclusive Access, Personally Vetted)</CardDescription>
            </div>
            <Button onClick={() => { resetFeatureForm(); setEditingFeature(null); setFeatureDialog(true); }} data-testid="button-add-why-book-point">
              <Plus className="h-4 w-4 mr-2" /> Add Point
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
                    <p className="font-medium text-sm">{item.title}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEditFeature(item)} data-testid={`button-edit-why-book-${item.id}`}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteConfirm({ type: "feature", id: item.id })} data-testid={`button-delete-why-book-${item.id}`}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
              {(!featuresData?.features || featuresData.features.length === 0) && (
                <p className="col-span-2 text-center text-muted-foreground py-8">No points yet. Add one to get started.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card>
          <CardHeader>
            <CardTitle>Closing CTA Band</CardTitle>
            <CardDescription>The band at the bottom of /stay. Only the primary button is shown on the page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={ctaForm.title}
                onChange={(e) => setCtaForm({ ...ctaForm, title: e.target.value })}
                placeholder="Can't decide? Let us choose for you."
              />
            </div>
            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Textarea
                value={ctaForm.subtitle}
                onChange={(e) => setCtaForm({ ...ctaForm, subtitle: e.target.value })}
                placeholder="Tell us what you're after and our specialists will match you to the right property."
                rows={2}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Button Text</Label>
                <Input
                  value={ctaForm.primaryButtonText}
                  onChange={(e) => setCtaForm({ ...ctaForm, primaryButtonText: e.target.value })}
                  placeholder="Speak with a Specialist"
                />
              </div>
              <div className="space-y-2">
                <Label>Button Link</Label>
                <Input
                  value={ctaForm.primaryButtonLink}
                  onChange={(e) => setCtaForm({ ...ctaForm, primaryButtonLink: e.target.value })}
                  placeholder="/contact"
                />
              </div>
            </div>
            <Button onClick={() => saveCtaMutation.mutate(ctaForm)} disabled={saveCtaMutation.isPending} data-testid="button-save-cta">
              {saveCtaMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Closing CTA
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Why Book Through Us Point Dialog */}
      <Dialog open={featureDialog} onOpenChange={(open) => { if (!open) { setEditingFeature(null); resetFeatureForm(); } setFeatureDialog(open); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingFeature ? "Edit Point" : "Add Point"}</DialogTitle>
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
                placeholder="Concierge Service"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={featureForm.description}
                onChange={(e) => setFeatureForm({ ...featureForm, description: e.target.value })}
                placeholder="24/7 dedicated concierge to arrange tours, dining, and every detail of your stay."
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
              Are you sure you want to delete this point? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteFeatureMutation.isPending}>
              {deleteFeatureMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
