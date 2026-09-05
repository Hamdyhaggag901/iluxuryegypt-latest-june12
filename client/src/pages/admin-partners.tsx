import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, Upload } from "lucide-react";
import type { Partner } from "@shared/schema";

const CATEGORIES = ["hotels", "airlines", "cruises", "restaurants"] as const;

const emptyForm = {
  name: "",
  logoUrl: "",
  category: "hotels" as (typeof CATEGORIES)[number],
  displayOrder: 0,
  isActive: true,
};

export default function AdminPartners() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const token = localStorage.getItem("adminToken");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [partnerToDelete, setPartnerToDelete] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data, isLoading } = useQuery({
    queryKey: ["adminPartners"],
    queryFn: async () => {
      const response = await fetch("/api/cms/partners", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch partners");
      return response.json();
    },
  });

  const partners: Partner[] = data?.partners || [];

  const createMutation = useMutation({
    mutationFn: async (values: typeof form) => {
      const response = await fetch("/api/cms/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Failed to create partner");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPartners"] });
      setDialogOpen(false);
      setForm(emptyForm);
      toast({ title: "Success", description: "Partner added" });
    },
    onError: () => toast({ title: "Error", description: "Failed to add partner", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: typeof form }) => {
      const response = await fetch(`/api/cms/partners/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Failed to update partner");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPartners"] });
      setDialogOpen(false);
      setEditingPartner(null);
      setForm(emptyForm);
      toast({ title: "Success", description: "Partner updated" });
    },
    onError: () => toast({ title: "Error", description: "Failed to update partner", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/cms/partners/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete partner");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPartners"] });
      setDeleteDialogOpen(false);
      setPartnerToDelete(null);
      toast({ title: "Success", description: "Partner deleted" });
    },
    onError: () => toast({ title: "Error", description: "Failed to delete partner", variant: "destructive" }),
  });

  const uploadLogoMutation = useMutation({
    mutationFn: async (file: File): Promise<string> => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/cms/media", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(error.message || "Upload failed");
      }
      const data = await response.json();
      return data.media.url as string;
    },
    onSuccess: (url) => setForm((prev) => ({ ...prev, logoUrl: url })),
    onError: (error: any) => toast({ title: "Upload failed", description: error.message, variant: "destructive" }),
  });

  const openNew = () => {
    setEditingPartner(null);
    setForm({ ...emptyForm, displayOrder: partners.length });
    setDialogOpen(true);
  };

  const openEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setForm({
      name: partner.name,
      logoUrl: partner.logoUrl,
      category: partner.category as (typeof CATEGORIES)[number],
      displayOrder: partner.displayOrder,
      isActive: partner.isActive,
    });
    setDialogOpen(true);
  };

  return (
    <AdminLayout title="Partners" description="Manage the homepage's scrolling partner logo marquee">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              Logos shown, in order, in the "Trusted by the world's finest hotels" marquee on the homepage.
            </p>
            <Button onClick={openNew} data-testid="button-add-partner">
              <Plus className="h-4 w-4 mr-1" /> Add Partner
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : partners.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No partners yet. Add your first one.</p>
          ) : (
            <div className="space-y-2">
              {partners.map((partner) => (
                <div key={partner.id} className={`flex items-center gap-4 p-4 border rounded-lg ${!partner.isActive ? "opacity-50" : ""}`}>
                  <img src={partner.logoUrl} alt={partner.name} className="h-10 w-20 object-contain bg-muted rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{partner.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{partner.category} · order {partner.displayOrder}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${partner.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                    {partner.isActive ? "Active" : "Inactive"}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => openEdit(partner)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" className="text-red-600" onClick={() => { setPartnerToDelete(partner.id); setDeleteDialogOpen(true); }}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPartner ? "Edit Partner" : "Add Partner"}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              editingPartner
                ? updateMutation.mutate({ id: editingPartner.id, values: form })
                : createMutation.mutate(form);
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Waldorf Astoria Cairo Heliopolis" />
            </div>
            <div className="space-y-2">
              <Label>Logo</Label>
              <div className="flex gap-2">
                <Input value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} placeholder="https://... or upload" required />
                <Button type="button" variant="outline" className="relative shrink-0">
                  {uploadLogoMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadLogoMutation.mutate(file);
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </Button>
              </div>
              {form.logoUrl && (
                <img src={form.logoUrl} alt="Preview" className="mt-2 h-12 w-24 object-contain bg-muted rounded border" />
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as typeof form.category })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.isActive} onCheckedChange={(c) => setForm({ ...form, isActive: c })} />
              <Label>Active</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingPartner ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Partner</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">Are you sure you want to delete this partner? This can't be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => partnerToDelete && deleteMutation.mutate(partnerToDelete)} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
