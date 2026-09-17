
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { WysiwygEditor } from "@/components/ui/wysiwyg-editor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FileText, Plus, Edit, Search, ArrowLeft, Trash2, Calendar, X } from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import { insertPostSchema } from "@shared/schema";
import { postState } from "@shared/post-visibility";

// Form validation schema based on insertPostSchema with required fields
const postFormSchema = insertPostSchema.extend({
  titleEn: z.string().min(1, "English title is required"),
  slug: z.string().min(1, "Slug is required"),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type PostFormData = z.infer<typeof postFormSchema>;

// ---------------------------------------------------------------------------
// SEO overrides
// ---------------------------------------------------------------------------
// The same set tours, categories and destinations already carry. Every field
// falls back to a sensible default when left blank, so blank must be stored as
// null and never as an empty string: an empty string is a value, and a value
// beats a fallback.

const SCHEMA_TYPES = ["BlogPosting", "Article", "NewsArticle", "TravelGuide", "FAQPage", "HowTo"];

/** Blank means "use the default", which is null in the database. */
const orNull = (v: string) => (v.trim() === "" ? null : v);

function SeoOverrideFields({ form, idPrefix }: { form: any; idPrefix: string }) {
  const metaDescription: string = form.watch("metaDescription") || "";
  const metaLength = metaDescription.length;
  const metaInRange = metaLength >= 150 && metaLength <= 160;

  return (
    <div className="border-t pt-4 mt-6">
      <h3 className="text-lg font-semibold mb-1">SEO Overrides</h3>
      <p className="text-xs text-gray-500 mb-4">
        Leave a field blank to use its default. Nothing here is required.
      </p>

      <FormField
        control={form.control}
        name="metaTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Meta Title</FormLabel>
            <FormControl>
              <Input
                placeholder="Blank uses the article title"
                data-testid={`input-${idPrefix}-meta-title`}
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(orNull(e.target.value))}
              />
            </FormControl>
            <p className="text-xs text-gray-500">{(field.value ?? "").length} characters, aim for under 60.</p>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="metaDescription"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Meta Description</FormLabel>
            <FormControl>
              <Textarea
                rows={3}
                placeholder="Blank uses the excerpt"
                data-testid={`textarea-${idPrefix}-meta-description`}
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(orNull(e.target.value))}
              />
            </FormControl>
            <p className={`text-xs ${metaInRange ? "text-green-600" : "text-amber-600"}`} data-testid={`text-${idPrefix}-meta-count`}>
              {metaLength} characters{metaInRange ? "" : ", aim for 150 to 160"}
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="focusKeyword"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Focus Keyword</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g. abu simbel tour from aswan"
                data-testid={`input-${idPrefix}-focus-keyword`}
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(orNull(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="canonicalUrl"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Canonical URL</FormLabel>
            <FormControl>
              <Input
                placeholder="Blank uses this page's own URL"
                data-testid={`input-${idPrefix}-canonical-url`}
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(orNull(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4 mt-4">
        <FormField
          control={form.control}
          name="robots"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Robots</FormLabel>
              <Select
                value={field.value || "__default__"}
                onValueChange={(v) => field.onChange(v === "__default__" ? null : v)}
              >
                <FormControl>
                  <SelectTrigger data-testid={`select-${idPrefix}-robots`}>
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
              <Select
                value={field.value || "__default__"}
                onValueChange={(v) => field.onChange(v === "__default__" ? null : v)}
              >
                <FormControl>
                  <SelectTrigger data-testid={`select-${idPrefix}-schema-type`}>
                    <SelectValue placeholder="Default" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="__default__">Default (BlogPosting)</SelectItem>
                  {SCHEMA_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
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
          <FormItem className="mt-4">
            <FormLabel>Social Share Image</FormLabel>
            <FormControl>
              <Input
                placeholder="Blank uses the featured image"
                data-testid={`input-${idPrefix}-og-image`}
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(orNull(e.target.value))}
              />
            </FormControl>
            <p className="text-xs text-gray-500">
              Only changes the preview on social networks. The article still shows the featured image.
            </p>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}


// ---------------------------------------------------------------------------
// Publication control
// ---------------------------------------------------------------------------
// The database stores two fields, `status` and `scheduledAt`, but an editor
// thinks in one choice with three outcomes. This maps between them so the two
// fields can never end up in a combination nobody meant, such as a draft with
// a schedule hanging off it.

type Publication = "draft" | "now" | "schedule";

function publicationOf(status: string | undefined, scheduledAt: unknown): Publication {
  if (status !== "published") return "draft";
  return scheduledAt ? "schedule" : "now";
}

// <input type="datetime-local"> speaks local wall-clock time with no zone, and
// the column is a timestamptz. These two convert across that boundary in the
// browser's own zone, which is what the editor means by "9am".
function toLocalInputValue(value: unknown): string {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function fromLocalInputValue(value: string): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatScheduled(value: unknown): string {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, {
    weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit",
  });
}

function PublicationField({ form, idPrefix }: { form: any; idPrefix: string }) {
  const status = form.watch("status");
  const scheduledAt = form.watch("scheduledAt");
  const mode = publicationOf(status, scheduledAt);
  const scheduledDate = scheduledAt ? new Date(String(scheduledAt)) : null;
  const isPast = !!scheduledDate && !Number.isNaN(scheduledDate.getTime()) && scheduledDate.getTime() <= Date.now();

  const setMode = (next: Publication) => {
    if (next === "draft") {
      form.setValue("status", "draft");
      form.setValue("scheduledAt", null);
      return;
    }
    form.setValue("status", "published");
    if (next === "now") {
      form.setValue("scheduledAt", null);
    } else if (!scheduledAt) {
      // Seeding tomorrow morning beats an empty box that silently means "now".
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      form.setValue("scheduledAt", tomorrow);
    }
  };

  return (
    <div className="space-y-2">
      <FormItem>
        <FormLabel>Publication</FormLabel>
        <Select onValueChange={(v) => setMode(v as Publication)} value={mode}>
          <FormControl>
            <SelectTrigger data-testid={`select-${idPrefix}-publication`}>
              <SelectValue />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="draft">Draft, not visible</SelectItem>
            <SelectItem value="now">Publish now</SelectItem>
            <SelectItem value="schedule">Schedule for later</SelectItem>
          </SelectContent>
        </Select>
      </FormItem>

      {mode === "schedule" && (
        <FormField
          control={form.control}
          name="scheduledAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Goes live at</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  data-testid={`input-${idPrefix}-scheduled-at`}
                  value={toLocalInputValue(field.value)}
                  onChange={(e) => field.onChange(fromLocalInputValue(e.target.value))}
                />
              </FormControl>
              <p className="text-xs text-gray-500">
                Your local time. The post stays hidden from the blog, the sitemap and search engines until then.
              </p>
              {isPast && (
                <p className="text-xs text-amber-600" data-testid={`text-${idPrefix}-scheduled-past`}>
                  That time has already passed, so this will go live as soon as you save.
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}


export default function AdminPosts() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPost, setEditingPost] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingPost, setDeletingPost] = useState<any>(null);
  const { toast } = useToast();


  const { data: postsResponse, isLoading } = useQuery({
    queryKey: ["/api/cms/posts"],
    enabled: true
  });

  const posts = (postsResponse as any)?.posts || [];

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async (data: PostFormData) => {
      return apiRequest('POST', '/api/cms/posts', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/stats"] });
      setIsCreateDialogOpen(false);
      toast({ title: "Blog post created successfully!" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error creating post", 
        description: error.message || "Something went wrong",
        variant: "destructive" 
      });
    },
  });

  // Update post mutation
  const updatePostMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PostFormData> }) => {
      return apiRequest('PUT', `/api/cms/posts/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/stats"] });
      setIsEditDialogOpen(false);
      setEditingPost(null);
      toast({ title: "Blog post updated successfully!" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error updating post", 
        description: error.message || "Something went wrong",
        variant: "destructive" 
      });
    },
  });

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/cms/posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/stats"] });
      setIsDeleteDialogOpen(false);
      setDeletingPost(null);
      toast({ title: "Blog post deleted successfully!" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error deleting post", 
        description: error.message || "Something went wrong",
        variant: "destructive" 
      });
    },
  });

  // Form for creating posts
  const createForm = useForm<PostFormData>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      slug: "",
      titleEn: "",
      titleEs: "",
      titleFr: "",
      titleJp: "",
      bodyEn: "",
      bodyEs: "",
      bodyFr: "",
      bodyJp: "",
      featuredImage: "",
      excerpt: "",
      category: "",
      tags: [],
      focusKeyword: null,
      metaTitle: null,
      metaDescription: null,
      canonicalUrl: null,
      robots: null,
      schemaType: null,
      ogImage: null,
      featuredImageAlt: null,
      status: "draft",
      scheduledAt: null,
    },
  });

  // Form for editing posts
  const editForm = useForm<PostFormData>({
    resolver: zodResolver(postFormSchema),
  });

  // Reset edit form when editing post changes
  useEffect(() => {
    if (editingPost) {
      editForm.reset({
        slug: editingPost.slug || "",
        titleEn: editingPost.titleEn || "",
        titleEs: editingPost.titleEs || "",
        titleFr: editingPost.titleFr || "",
        titleJp: editingPost.titleJp || "",
        bodyEn: editingPost.bodyEn || "",
        bodyEs: editingPost.bodyEs || "",
        bodyFr: editingPost.bodyFr || "",
        bodyJp: editingPost.bodyJp || "",
        featuredImage: editingPost.featuredImage || "",
        excerpt: editingPost.excerpt || "",
        category: editingPost.category || "",
        tags: editingPost.tags || [],
        focusKeyword: editingPost.focusKeyword ?? null,
        metaTitle: editingPost.metaTitle ?? null,
        metaDescription: editingPost.metaDescription ?? null,
        canonicalUrl: editingPost.canonicalUrl ?? null,
        robots: editingPost.robots ?? null,
        schemaType: editingPost.schemaType ?? null,
        ogImage: editingPost.ogImage ?? null,
        featuredImageAlt: editingPost.featuredImageAlt ?? null,
        status: editingPost.status || "draft",
        scheduledAt: editingPost.scheduledAt ? new Date(editingPost.scheduledAt) : null,
      });
    }
  }, [editingPost, editForm]);

  const onCreateSubmit = (data: PostFormData) => {
    createPostMutation.mutate(data);
  };

  const onEditSubmit = (data: PostFormData) => {
    if (editingPost) {
      updatePostMutation.mutate({ id: editingPost.id, data });
    }
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (post: any) => {
    setDeletingPost(post);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingPost) {
      deletePostMutation.mutate(deletingPost.id);
    }
  };

  // Filter posts based on search term
  const filteredPosts = posts.filter((post: any) =>
    post.titleEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Blog Posts" description="Manage blog content">
      {/* Create Post Dialog */}
      <div className="mb-6 flex justify-end">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-new-post">
                  <Plus className="h-4 w-4 mr-2" />
                  Write New Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Blog Post</DialogTitle>
                  <DialogDescription>
                    Create a new blog post for your travel website.
                  </DialogDescription>
                </DialogHeader>
                <Form {...createForm}>
                  <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={createForm.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Slug (URL)</FormLabel>
                            <FormControl>
                              <Input placeholder="my-blog-post" {...field} data-testid="input-slug" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <PublicationField form={createForm} idPrefix="create" />
                    </div>
                    
                    <FormField
                      control={createForm.control}
                      name="titleEn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title (English)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter post title" {...field} data-testid="input-title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={createForm.control}
                      name="excerpt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Excerpt</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Brief description of the post" {...field}
                        value={field.value ?? ""} data-testid="textarea-excerpt" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={createForm.control}
                      name="bodyEn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content (English)</FormLabel>
                          <FormControl>
                            <WysiwygEditor
                              value={field.value || ''}
                              onChange={field.onChange}
                              placeholder="Write your blog post content here..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={createForm.control}
                      name="featuredImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Featured Image URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/image.jpg" {...field}
                        value={field.value ?? ""} data-testid="input-image" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

              <FormField
                control={editForm.control}
                name="featuredImageAlt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured Image Alt Text</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Describe what the photo shows, 8 to 15 words"
                        data-testid="input-edit-featured-image-alt"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(orNull(e.target.value))}
                      />
                    </FormControl>
                    <p className="text-xs text-gray-500">
                      Read aloud by screen readers. Blank falls back to the article title, which describes the article rather than the picture.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

                    <FormField
                      control={createForm.control}
                      name="featuredImageAlt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Featured Image Alt Text</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Describe what the photo shows, 8 to 15 words"
                              data-testid="input-create-featured-image-alt"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) => field.onChange(orNull(e.target.value))}
                            />
                          </FormControl>
                          <p className="text-xs text-gray-500">
                            Read aloud by screen readers. Blank falls back to the article title, which describes the article rather than the picture.
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <SeoOverrideFields form={createForm} idPrefix="create" />
                    <div className="border-t pt-4 mt-4">
                      <h3 className="text-lg font-semibold mb-4">Categories & Tags</h3>
                      
                      <FormField
                        control={createForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-category">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="All Posts">All Posts</SelectItem>
                                <SelectItem value="Culture & History">Culture & History</SelectItem>
                                <SelectItem value="Travel Tips">Travel Tips</SelectItem>
                                <SelectItem value="Destinations">Destinations</SelectItem>
                                <SelectItem value="Food & Culture">Food & Culture</SelectItem>
                                <SelectItem value="Travel Planning">Travel Planning</SelectItem>
                                <SelectItem value="Responsible Travel">Responsible Travel</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={createForm.control}
                        name="tags"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Tags (comma-separated)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., pyramids, luxury, egypt" 
                                value={field.value?.join(', ') || ''}
                                onChange={(e) => {
                                  const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                                  field.onChange(tags);
                                }}
                                data-testid="input-tags" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <DialogFooter>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsCreateDialogOpen(false)}
                        data-testid="button-cancel"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={createPostMutation.isPending}
                        data-testid="button-create"
                      >
                        {createPostMutation.isPending ? "Creating..." : "Create Post"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
        </div>

      {/* Posts List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Blog Posts ({posts.length})
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                  data-testid="input-search"
                />
              </div>
            </CardTitle>
            <CardDescription>
              Manage your blog posts and articles
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Loading posts...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {posts.length === 0 ? "No blog posts yet" : "No posts match your search"}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {posts.length === 0 
                    ? "Get started by creating your first blog post." 
                    : "Try adjusting your search terms."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map((post: any) => (
                  <div 
                    key={post.id} 
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    data-testid={`post-${post.id}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-gray-900" data-testid={`text-title-${post.id}`}>
                            {post.titleEn || "Untitled"}
                          </h3>
                          <Badge
                            variant={postState(post) === "published" ? "default" : "secondary"}
                            className={postState(post) === "scheduled" ? "bg-amber-100 text-amber-800 hover:bg-amber-100" : undefined}
                            data-testid={`badge-status-${post.id}`}
                          >
                            {postState(post)}
                          </Badge>
                          {postState(post) === "scheduled" && (
                            <span className="text-xs text-amber-700" data-testid={`text-scheduled-${post.id}`}>
                              Scheduled for {formatScheduled(post.scheduledAt)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2" data-testid={`text-slug-${post.id}`}>
                          Slug: {post.slug}
                        </p>
                        {post.excerpt && (
                          <p className="text-sm text-gray-500 mb-2" data-testid={`text-excerpt-${post.id}`}>
                            {post.excerpt}
                          </p>
                        )}
                        <div className="flex items-center text-xs text-gray-400 gap-4">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Created: {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                          {post.updatedAt && post.updatedAt !== post.createdAt && (
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Updated: {new Date(post.updatedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(post)}
                          data-testid={`button-edit-${post.id}`}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(post)}
                          className="text-red-600 hover:text-red-700"
                          data-testid={`button-delete-${post.id}`}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
            <DialogDescription>
              Update your blog post information.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug (URL)</FormLabel>
                      <FormControl>
                        <Input placeholder="my-blog-post" {...field} data-testid="input-edit-slug" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <PublicationField form={editForm} idPrefix="edit" />
              </div>
              
              <FormField
                control={editForm.control}
                name="titleEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title (English)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter post title" {...field} data-testid="input-edit-title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Brief description of the post" {...field}
                        value={field.value ?? ""} data-testid="textarea-edit-excerpt" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="bodyEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content (English)</FormLabel>
                    <FormControl>
                      <WysiwygEditor
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="Write your blog post content here..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="featuredImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field}
                        value={field.value ?? ""} data-testid="input-edit-image" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SeoOverrideFields form={editForm} idPrefix="edit" />
              <div className="border-t pt-4 mt-4">
                <h3 className="text-lg font-semibold mb-4">Categories & Tags</h3>
                
                <FormField
                  control={editForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-edit-category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="All Posts">All Posts</SelectItem>
                          <SelectItem value="Culture & History">Culture & History</SelectItem>
                          <SelectItem value="Travel Tips">Travel Tips</SelectItem>
                          <SelectItem value="Destinations">Destinations</SelectItem>
                          <SelectItem value="Food & Culture">Food & Culture</SelectItem>
                          <SelectItem value="Travel Planning">Travel Planning</SelectItem>
                          <SelectItem value="Responsible Travel">Responsible Travel</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Tags (comma-separated)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., pyramids, luxury, egypt" 
                          value={field.value?.join(', ') || ''}
                          onChange={(e) => {
                            const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                            field.onChange(tags);
                          }}
                          data-testid="input-edit-tags" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingPost(null);
                  }}
                  data-testid="button-edit-cancel"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={updatePostMutation.isPending}
                  data-testid="button-edit-save"
                >
                  {updatePostMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Blog Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingPost?.titleEn}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setDeletingPost(null);
              }}
              data-testid="button-delete-cancel"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deletePostMutation.isPending}
              data-testid="button-delete-confirm"
            >
              {deletePostMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
