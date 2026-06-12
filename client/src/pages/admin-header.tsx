import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AdminLayout from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Plus, Trash2, GripVertical, Save, Image,
  ChevronDown, ChevronRight, Eye, EyeOff, ExternalLink
} from "lucide-react";
import { z } from "zod";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const navItemSchema = z.object({
  label: z.string().min(1, "Label is required"),
  href: z.string().min(1, "Link is required"),
  parentId: z.string().nullable().optional(),
  sortOrder: z.number().default(0),
  isVisible: z.boolean().default(true),
  openInNewTab: z.boolean().default(false),
});

type NavItem = {
  id: string;
  label: string;
  href: string;
  parentId: string | null;
  sortOrder: number;
  isVisible: boolean;
  openInNewTab: boolean;
};

export default function AdminHeader() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NavItem | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [logoUrl, setLogoUrl] = useState("");

  // Fetch navigation items
  const { data: navData, isLoading } = useQuery({
    queryKey: ["/api/cms/nav-items"],
    queryFn: async () => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/cms/nav-items", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch navigation items");
      return response.json();
    },
  });

  // Fetch site config (for logo)
  const { data: configData } = useQuery({
    queryKey: ["/api/cms/site-config"],
    queryFn: async () => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/cms/site-config", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch site config");
      const data = await response.json();
      // config is an array of {id, key, value, type} objects
      if (Array.isArray(data.config)) {
        const logoConfig = data.config.find((c: any) => c.key === 'header_logo');
        if (logoConfig) setLogoUrl(logoConfig.value);
      }
      return data;
    },
  });

  const form = useForm({
    resolver: zodResolver(navItemSchema),
    defaultValues: {
      label: "",
      href: "",
      parentId: null as string | null,
      sortOrder: 0,
      isVisible: true,
      openInNewTab: false,
    },
  });

  // Create/Update navigation item
  const saveMutation = useMutation({
    mutationFn: async (data: z.infer<typeof navItemSchema>) => {
      const token = localStorage.getItem("adminToken");
      const url = editingItem
        ? `/api/cms/nav-items/${editingItem.id}`
        : "/api/cms/nav-items";
      const method = editingItem ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save navigation item");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: `Navigation item ${editingItem ? 'updated' : 'created'}` });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/nav-items"] });
      setIsDialogOpen(false);
      setEditingItem(null);
      form.reset();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Delete navigation item
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/cms/nav-items/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete navigation item");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Navigation item deleted" });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/nav-items"] });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Toggle visibility
  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ id, isVisible }: { id: string; isVisible: boolean }) => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/cms/nav-items/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ isVisible }),
      });
      if (!response.ok) throw new Error("Failed to update visibility");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/nav-items"] });
    },
  });

  // Update sort order mutation
  const updateSortOrderMutation = useMutation({
    mutationFn: async (items: { id: string; sortOrder: number }[]) => {
      const token = localStorage.getItem("adminToken");
      // Update each item's sort order
      await Promise.all(
        items.map(item =>
          fetch(`/api/cms/nav-items/${item.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ sortOrder: item.sortOrder }),
          })
        )
      );
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Menu order updated" });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/nav-items"] });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end for parent items
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = parentItems.findIndex(item => item.id === active.id);
      const newIndex = parentItems.findIndex(item => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(parentItems, oldIndex, newIndex);
        const updates = newOrder.map((item, index) => ({
          id: item.id,
          sortOrder: index,
        }));
        updateSortOrderMutation.mutate(updates);
      }
    }
  };

  // Handle drag end for child items
  const handleChildDragEnd = (parentId: string) => (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const children = getChildren(parentId);
      const oldIndex = children.findIndex(item => item.id === active.id);
      const newIndex = children.findIndex(item => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(children, oldIndex, newIndex);
        const updates = newOrder.map((item, index) => ({
          id: item.id,
          sortOrder: index,
        }));
        updateSortOrderMutation.mutate(updates);
      }
    }
  };

  // Save logo
  const saveLogoMutation = useMutation({
    mutationFn: async (url: string) => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/cms/site-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ key: "header_logo", value: url, type: "image" }),
      });
      if (!response.ok) throw new Error("Failed to save logo");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Logo updated" });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/site-config"] });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const navItems: NavItem[] = navData?.navItems || [];

  // Get parent items (items without parentId)
  const parentItems = navItems.filter(item => !item.parentId);

  // Get children for a parent
  const getChildren = (parentId: string) =>
    navItems.filter(item => item.parentId === parentId);

  const openEditDialog = (item: NavItem) => {
    setEditingItem(item);
    form.reset({
      label: item.label,
      href: item.href,
      parentId: item.parentId,
      sortOrder: item.sortOrder,
      isVisible: item.isVisible,
      openInNewTab: item.openInNewTab,
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = (parentId?: string) => {
    setEditingItem(null);
    form.reset({
      label: "",
      href: "",
      parentId: parentId || null,
      sortOrder: navItems.length,
      isVisible: true,
      openInNewTab: false,
    });
    setIsDialogOpen(true);
  };

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  // Sortable Nav Item Component
  const SortableNavItem = ({ item, children: itemChildren }: { item: NavItem; children?: NavItem[] }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: item.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    const hasChildren = itemChildren && itemChildren.length > 0;
    const isExpanded = expandedItems.has(item.id);

    return (
      <div ref={setNodeRef} style={style} className="border rounded-lg">
        {/* Parent Item */}
        <div className="flex items-center gap-3 p-3 bg-muted/30">
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>

          {hasChildren ? (
            <button onClick={() => toggleExpand(item.id)} className="p-1">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ) : (
            <div className="w-6" />
          )}

          <div className="flex-1">
            <div className="font-medium">{item.label}</div>
            <div className="text-sm text-muted-foreground">{item.href}</div>
          </div>

          <div className="flex items-center gap-2">
            {item.openInNewTab && (
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            )}

            <button
              onClick={() => toggleVisibilityMutation.mutate({
                id: item.id,
                isVisible: !item.isVisible
              })}
              className="p-1"
            >
              {item.isVisible ? (
                <Eye className="h-4 w-4 text-green-600" />
              ) : (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              )}
            </button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => openCreateDialog(item.id)}
            >
              <Plus className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => openEditDialog(item)}
            >
              Edit
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteMutation.mutate(item.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>

        {/* Children Items */}
        {hasChildren && isExpanded && (
          <div className="border-t">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleChildDragEnd(item.id)}
            >
              <SortableContext
                items={itemChildren.map(c => c.id)}
                strategy={verticalListSortingStrategy}
              >
                {itemChildren.sort((a, b) => a.sortOrder - b.sortOrder).map((child) => (
                  <SortableChildItem key={child.id} item={child} />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        )}
      </div>
    );
  };

  // Sortable Child Item Component
  const SortableChildItem = ({ item }: { item: NavItem }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: item.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex items-center gap-3 p-3 pl-12 border-b last:border-b-0 bg-background"
      >
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="flex-1">
          <div className="font-medium">{item.label}</div>
          <div className="text-sm text-muted-foreground">{item.href}</div>
        </div>

        <div className="flex items-center gap-2">
          {item.openInNewTab && (
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          )}

          <button
            onClick={() => toggleVisibilityMutation.mutate({
              id: item.id,
              isVisible: !item.isVisible
            })}
            className="p-1"
          >
            {item.isVisible ? (
              <Eye className="h-4 w-4 text-green-600" />
            ) : (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            )}
          </button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => openEditDialog(item)}
          >
            Edit
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteMutation.mutate(item.id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout title="Header Settings" description="Manage your site logo and navigation menu">
      <div className="space-y-6">

        {/* Logo Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Site Logo
            </CardTitle>
            <CardDescription>Update your header logo image</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {logoUrl && (
                <div className="border rounded p-2 bg-white">
                  <img src={logoUrl} alt="Logo preview" className="h-12 object-contain" />
                </div>
              )}
              <div className="flex-1">
                <Input
                  placeholder="Enter logo URL"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                />
              </div>
              <Button onClick={() => saveLogoMutation.mutate(logoUrl)}>
                <Save className="h-4 w-4 mr-2" />
                Save Logo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Items Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Navigation Menu</CardTitle>
                <CardDescription>Add, edit, or remove navigation items and dropdowns</CardDescription>
              </div>
              <Button onClick={() => openCreateDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Menu Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : parentItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No navigation items yet. Click "Add Menu Item" to create one.
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={parentItems.sort((a, b) => a.sortOrder - b.sortOrder).map(item => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {parentItems.sort((a, b) => a.sortOrder - b.sortOrder).map((item) => (
                      <SortableNavItem
                        key={item.id}
                        item={item}
                        children={getChildren(item.id).sort((a, b) => a.sortOrder - b.sortOrder)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Navigation Item" : "Add Navigation Item"}
              </DialogTitle>
              <DialogDescription>
                {editingItem
                  ? "Update the navigation item details"
                  : "Create a new navigation menu item"}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => saveMutation.mutate(data))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Label</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., About Us" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="href"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., /about or https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent Menu (for dropdown)</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value === "none" ? null : value)}
                        value={field.value || "none"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select parent (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">No Parent (Top Level)</SelectItem>
                          {parentItems
                            .filter(p => p.id !== editingItem?.id)
                            .map((parent) => (
                              <SelectItem key={parent.id} value={parent.id}>
                                {parent.label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sortOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sort Order</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="isVisible"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">Visible</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="openInNewTab"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">Open in New Tab</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saveMutation.isPending}>
                    {saveMutation.isPending ? "Saving..." : "Save"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
