import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Edit, Trash2, Search, ArrowLeft, Grid3x3, AlertTriangle } from "lucide-react";
import { insertCategorySchema, type InsertCategory, type Category } from "@shared/schema";

export default function AdminCategories() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { toast } = useToast();

  const form = useForm<InsertCategory>({
    resolver: zodResolver(insertCategorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      shortDescription: "",
      image: "",
      sortOrder: 0,
      featured: false,
      categoryType: "packages",
      seoTitle: "",
      metaDescription: "",
      focusKeyword: "",
      canonicalUrl: "",
      robots: "",
      schemaType: "",
      ogImage: "",
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const { data: categories, isLoading } = useQuery<{ success: boolean; categories: Category[] }>({
    queryKey: ["/api/cms/categories"],
    queryFn: async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No auth token");
      
      const response = await fetch("/api/cms/categories", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminUser");
          setLocation("/admin/login");
          throw new Error("Session expired");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    },
    enabled: !!localStorage.getItem("adminToken"),
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: InsertCategory) => {
      return apiRequest("POST", "/api/cms/categories", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/categories"] });
      toast({
        title: "Success",
        description: "Category created successfully",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create category",
        variant: "destructive",
      });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertCategory> }) => {
      return apiRequest("PUT", `/api/cms/categories/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/categories"] });
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
      setIsDialogOpen(false);
      setEditingCategory(null);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update category",
        variant: "destructive",
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      return apiRequest("DELETE", `/api/cms/categories/${categoryId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/categories"] });
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete category",
        variant: "destructive",
      });
    },
  });

  const filteredCategories = categories?.categories?.filter((category: Category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteCategoryMutation.mutate(categoryId);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    form.reset({
      name: category.name,
      slug: category.slug,
      description: category.description,
      shortDescription: category.shortDescription || "",
      image: category.image,
      sortOrder: category.sortOrder,
      featured: category.featured,
      categoryType: category.categoryType || "packages",
      seoTitle: category.seoTitle || "",
      metaDescription: category.metaDescription || "",
      focusKeyword: category.focusKeyword || "",
      canonicalUrl: category.canonicalUrl || "",
      robots: category.robots || "",
      schemaType: category.schemaType || "",
      ogImage: category.ogImage || "",
    });
    setIsDialogOpen(true);
  };

  const handleOpenDialog = () => {
    setEditingCategory(null);
    form.reset({
      name: "",
      slug: "",
      description: "",
      shortDescription: "",
      image: "",
      sortOrder: 0,
      featured: false,
      categoryType: "packages",
      seoTitle: "",
      metaDescription: "",
      focusKeyword: "",
      canonicalUrl: "",
      robots: "",
      schemaType: "",
      ogImage: "",
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (data: InsertCategory) => {
    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, data });
    } else {
      createCategoryMutation.mutate(data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/admin")}
                className="mr-4"
                data-testid="button-back"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Categories Management</h1>
                <p className="text-sm text-gray-500">Manage experience categories</p>
              </div>
            </div>
            <Button onClick={handleOpenDialog} data-testid="button-add-category">
              <Plus className="h-4 w-4 mr-2" />
              Add New Category
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search categories by name or slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading categories...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category: Category) => (
              <Card key={category.id} className="hover:shadow-md transition-shadow" data-testid={`card-category-${category.id}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <CardDescription>{category.slug}</CardDescription>
                    </div>
                    <Badge variant={category.featured ? "default" : "secondary"} data-testid={`badge-featured-${category.id}`}>
                      {category.featured ? "Featured" : "Standard"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Type:</span>
                      <span className="font-medium capitalize" data-testid={`text-type-${category.id}`}>
                        {category.categoryType?.replace("-", " ") || "packages"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Sort Order:</span>
                      <span className="font-medium" data-testid={`text-sort-${category.id}`}>{category.sortOrder}</span>
                    </div>
                    {category.shortDescription && (
                      <p className="text-sm text-gray-600 line-clamp-2">{category.shortDescription}</p>
                    )}
                    {category.image && (
                      <div className="aspect-video rounded-md overflow-hidden">
                        <img 
                          src={category.image} 
                          alt={category.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="flex gap-2 pt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEditCategory(category)}
                        data-testid={`button-edit-${category.id}`}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDeleteCategory(category.id)}
                        data-testid={`button-delete-${category.id}`}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <Grid3x3 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No categories</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new category.</p>
            <div className="mt-6">
              <Button onClick={handleOpenDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Category
              </Button>
            </div>
          </div>
        )}
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Create New Category"}</DialogTitle>
            <DialogDescription>
              {editingCategory ? "Update the category details below" : "Fill in the details to create a new category"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="categoryType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Type</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger data-testid="select-category-type">
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="packages">Packages</SelectItem>
                        <SelectItem value="day-tours">Day Tours</SelectItem>
                        <SelectItem value="nile-cruise">Nile Cruises</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Family Luxury" {...field} data-testid="input-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., family-luxury" {...field} data-testid="input-slug" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief description..." {...field} value={field.value || ""} data-testid="input-short-description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Full description..." {...field} data-testid="input-description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} data-testid="input-image" />
                    </FormControl>
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
                        placeholder="0" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        data-testid="input-sort-order"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4"
                        data-testid="checkbox-featured"
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">Featured Category</FormLabel>
                  </FormItem>
                )}
              />

              <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold mb-1">SEO Overrides</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Optional — leave blank to keep using the automatic defaults built from this category's own name and description.
                </p>
              </div>

              <FormField
                control={form.control}
                name="seoTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Auto-generated from the category name" {...field} value={field.value || ""} data-testid="input-category-seo-title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="metaDescription"
                render={({ field }) => {
                  const len = (field.value || "").length;
                  const inRange = len >= 150 && len <= 160;
                  return (
                    <FormItem>
                      <FormLabel>Meta Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Auto-generated from the short description" rows={3} {...field} value={field.value || ""} data-testid="input-category-meta-description" />
                      </FormControl>
                      {len === 0 ? (
                        <p className="text-xs text-muted-foreground">Ideal length: 150–160 characters</p>
                      ) : (
                        <p className={`text-xs ${inRange ? "text-green-600" : len > 160 ? "text-destructive" : "text-muted-foreground"}`}>
                          {len} / 160 characters {inRange ? "(ideal length)" : len > 160 ? "(longer than ideal)" : "(ideal: 150–160)"}
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="focusKeyword"
                render={({ field }) => {
                  const keyword = (field.value || "").trim();
                  const name = form.watch("name") || "";
                  const description = form.watch("description") || "";
                  const showHint =
                    keyword.length > 0 &&
                    !name.toLowerCase().includes(keyword.toLowerCase()) &&
                    !description.toLowerCase().includes(keyword.toLowerCase());
                  return (
                    <FormItem>
                      <FormLabel>Focus Keyword</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., luxury family tours egypt" {...field} value={field.value || ""} data-testid="input-category-focus-keyword" />
                      </FormControl>
                      {showHint && (
                        <div className="flex items-start gap-2 text-sm text-amber-600 dark:text-amber-500">
                          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                          <span>This keyword doesn't appear in the name or description yet — consider weaving it in naturally.</span>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="canonicalUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Canonical URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Leave blank to use this page's own URL" {...field} value={field.value || ""} data-testid="input-category-canonical-url" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="robots"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Robots</FormLabel>
                      <Select value={field.value || "__default__"} onValueChange={(v) => field.onChange(v === "__default__" ? "" : v)}>
                        <FormControl>
                          <SelectTrigger data-testid="select-category-robots">
                            <SelectValue placeholder="Default" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="__default__">Default (index, follow)</SelectItem>
                          <SelectItem value="index, follow">index, follow</SelectItem>
                          <SelectItem value="noindex, follow">noindex, follow</SelectItem>
                          <SelectItem value="index, nofollow">index, nofollow</SelectItem>
                          <SelectItem value="noindex, nofollow">noindex, nofollow</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="schemaType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Schema Type</FormLabel>
                      <Select value={field.value || "__default__"} onValueChange={(v) => field.onChange(v === "__default__" ? "" : v)}>
                        <FormControl>
                          <SelectTrigger data-testid="select-category-schema-type">
                            <SelectValue placeholder="None" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="__default__">None</SelectItem>
                          <SelectItem value="CollectionPage">CollectionPage</SelectItem>
                          <SelectItem value="Service">Service</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="ogImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Social Share Image (OG Image)</FormLabel>
                    <FormControl>
                      <Input placeholder="Leave blank to use the Image URL above" {...field} value={field.value || ""} data-testid="input-category-og-image" />
                    </FormControl>
                    {field.value && (
                      <img
                        src={field.value}
                        alt="OG image preview"
                        className="mt-2 h-24 w-auto rounded border object-cover"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                        onLoad={(e) => { e.currentTarget.style.display = "block"; }}
                      />
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                  data-testid="button-submit"
                >
                  {editingCategory ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
