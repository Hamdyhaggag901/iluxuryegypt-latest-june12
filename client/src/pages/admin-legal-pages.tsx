import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Scale, Plus, Edit, Search, Trash2, Eye, GripVertical, PanelBottom } from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import { LEGACY_LEGAL_SLUGS, getLegalPageHref } from "@shared/schema";
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface LegalPage {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  status: string;
  showInFooter: boolean;
  sortOrder: number;
  updatedAt: string;
}

function SortableLegalPageRow({
  page,
  onView,
  onEdit,
  onDelete,
}: {
  page: LegalPage;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: page.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isLegacy = (LEGACY_LEGAL_SLUGS as readonly string[]).includes(page.slug);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border rounded-lg p-4 hover:bg-muted/50 transition-colors bg-background"
      data-testid={`legal-page-${page.id}`}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex gap-4 flex-1 min-w-0">
          <div
            {...attributes}
            {...listeners}
            className="flex items-center cursor-grab active:cursor-grabbing text-muted-foreground"
            data-testid={`legal-page-drag-handle-${page.id}`}
          >
            <GripVertical className="h-5 w-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="font-medium" data-testid={`text-title-${page.id}`}>{page.title}</h3>
              <Badge variant={page.status === "draft" ? "outline" : "default"} data-testid={`badge-status-${page.id}`}>
                {page.status === "draft" ? "Draft" : "Published"}
              </Badge>
              {isLegacy && (
                <Badge variant="secondary" data-testid={`badge-legacy-${page.id}`}>Original Page</Badge>
              )}
              {page.showInFooter && (
                <Badge variant="outline" className="text-xs gap-1">
                  <PanelBottom className="h-3 w-3" /> In Footer
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-1" data-testid={`text-href-${page.id}`}>
              {getLegalPageHref(page.slug)}
            </p>
            {page.subtitle && (
              <p className="text-sm text-muted-foreground line-clamp-1">{page.subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button variant="outline" size="sm" onClick={onView} data-testid={`button-view-${page.id}`}>
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit} data-testid={`button-edit-${page.id}`}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="text-destructive hover:text-destructive"
            data-testid={`button-delete-${page.id}`}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminLegalPages() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingPage, setDeletingPage] = useState<LegalPage | null>(null);
  const [orderedPages, setOrderedPages] = useState<LegalPage[]>([]);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const { data: pagesResponse, isLoading } = useQuery({
    queryKey: ["/api/cms/legal-pages"],
  });

  const pages: LegalPage[] = (pagesResponse as any)?.legalPages || [];

  useEffect(() => {
    setOrderedPages(pages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagesResponse]);

  const reorderMutation = useMutation({
    mutationFn: async (ordered: LegalPage[]) => {
      await Promise.all(
        ordered.map((page, index) =>
          apiRequest("PUT", `/api/cms/legal-pages/${page.id}`, { sortOrder: index }),
        ),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/legal-pages"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error saving order",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/legal-pages"] });
    },
  });

  const deletePageMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/cms/legal-pages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/legal-pages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/public/footer-links"] });
      setIsDeleteDialogOpen(false);
      setDeletingPage(null);
      toast({ title: "Legal page deleted successfully!" });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting page",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (page: LegalPage) => {
    setDeletingPage(page);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingPage) {
      deletePageMutation.mutate(deletingPage.id);
    }
  };

  const isFiltering = searchTerm.trim().length > 0;
  const filteredPages = isFiltering
    ? orderedPages.filter(
        (page) =>
          page.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          page.slug?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : orderedPages;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = orderedPages.findIndex((p) => p.id === active.id);
    const newIndex = orderedPages.findIndex((p) => p.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const newOrder = arrayMove(orderedPages, oldIndex, newIndex);
    setOrderedPages(newOrder);
    reorderMutation.mutate(newOrder);
  };

  return (
    <AdminLayout title="Legal Pages" description="Manage Privacy Policy, Terms, and other legal/policy pages">
      <div className="mb-6 flex justify-end">
        <Button onClick={() => setLocation("/admin/legal-pages/new")} data-testid="button-new-legal-page">
          <Plus className="h-4 w-4 mr-2" />
          Add New Page
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <div className="flex items-center">
              <Scale className="h-5 w-5 mr-2" />
              Legal Pages ({pages.length})
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search pages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                data-testid="input-search"
              />
            </div>
          </CardTitle>
          <CardDescription>
            Drag the handle to reorder. Clear the search box to reorder. Pages marked "Original Page" are the
            site's 5 legacy legal pages — their URLs cannot change without breaking indexed links.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading legal pages...</p>
            </div>
          ) : filteredPages.length === 0 ? (
            <div className="text-center py-8">
              <Scale className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium">
                {pages.length === 0 ? "No legal pages yet" : "No pages match your search"}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {pages.length === 0
                  ? "Get started by adding your first legal page."
                  : "Try adjusting your search terms."}
              </p>
              {pages.length === 0 && (
                <Button
                  className="mt-4"
                  onClick={() => setLocation("/admin/legal-pages/new")}
                  data-testid="button-add-first-legal-page"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Legal Page
                </Button>
              )}
            </div>
          ) : isFiltering ? (
            <div className="space-y-4">
              {filteredPages.map((page) => (
                <SortableLegalPageRow
                  key={page.id}
                  page={page}
                  onView={() => window.open(getLegalPageHref(page.slug), "_blank")}
                  onEdit={() => setLocation(`/admin/legal-pages/edit/${page.id}`)}
                  onDelete={() => handleDelete(page)}
                />
              ))}
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={filteredPages.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {filteredPages.map((page) => (
                    <SortableLegalPageRow
                      key={page.id}
                      page={page}
                      onView={() => window.open(getLegalPageHref(page.slug), "_blank")}
                      onEdit={() => setLocation(`/admin/legal-pages/edit/${page.id}`)}
                      onDelete={() => handleDelete(page)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Legal Page</DialogTitle>
            <DialogDescription>
              {deletingPage && (LEGACY_LEGAL_SLUGS as readonly string[]).includes(deletingPage.slug) ? (
                <>
                  Warning: "{deletingPage?.title}" is one of the site's original legal
                  pages. Deleting it will make its indexed URL (<code>{deletingPage && getLegalPageHref(deletingPage.slug)}</code>)
                  return a 404 immediately. This action cannot be undone.
                </>
              ) : (
                <>Are you sure you want to delete "{deletingPage?.title}"? This action cannot be undone.</>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setDeletingPage(null);
              }}
              data-testid="delete-button-cancel"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deletePageMutation.isPending}
              data-testid="delete-button-confirm"
            >
              {deletePageMutation.isPending ? "Deleting..." : "Delete Page"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
