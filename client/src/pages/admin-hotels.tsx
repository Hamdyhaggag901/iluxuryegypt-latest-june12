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
import { Building, Plus, Edit, Search, Trash2, Star, MapPin, Eye, GripVertical } from "lucide-react";
import AdminLayout from "@/components/admin-layout";
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

interface Hotel {
  id: string;
  name: string;
  slug: string;
  location: string;
  region: string;
  type: string;
  rating: number;
  priceTier: string;
  image: string;
  description: string;
  gallery?: string[];
  facilities?: { icon: string; label: string }[];
  status: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

function SortableHotelRow({
  hotel,
  onView,
  onEdit,
  onDelete,
}: {
  hotel: Hotel;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: hotel.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-3 w-3 ${i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} />
    ));

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border rounded-lg p-4 hover:bg-muted/50 transition-colors bg-background"
      data-testid={`hotel-${hotel.id}`}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex gap-4 flex-1 min-w-0">
          <div
            {...attributes}
            {...listeners}
            className="flex items-center cursor-grab active:cursor-grabbing text-muted-foreground"
            data-testid={`hotel-drag-handle-${hotel.id}`}
          >
            <GripVertical className="h-5 w-5" />
          </div>

          {hotel.image && (
            <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0 bg-muted">
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="font-medium" data-testid={`text-name-${hotel.id}`}>{hotel.name}</h3>
              <div className="flex items-center">{renderStars(hotel.rating)}</div>
              <Badge
                variant={hotel.status === "draft" ? "outline" : "default"}
                data-testid={`badge-status-${hotel.id}`}
              >
                {hotel.status === "draft" ? "Draft" : "Published"}
              </Badge>
              <Badge variant="secondary" data-testid={`badge-type-${hotel.id}`}>{hotel.type}</Badge>
              <Badge variant="outline" data-testid={`badge-price-${hotel.id}`}>{hotel.priceTier}</Badge>
            </div>
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <MapPin className="h-3 w-3 mr-1" />
              <span data-testid={`text-location-${hotel.id}`}>{hotel.location}, {hotel.region}</span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2" data-testid={`text-description-${hotel.id}`}>
              {hotel.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {hotel.facilities && hotel.facilities.length > 0 && (
                <Badge variant="outline" className="text-xs">{hotel.facilities.length} Facilities</Badge>
              )}
              {hotel.gallery && hotel.gallery.length > 0 && (
                <Badge variant="outline" className="text-xs">{hotel.gallery.length} Gallery Images</Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button variant="outline" size="sm" onClick={onView} data-testid={`button-view-${hotel.id}`}>
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit} data-testid={`button-edit-${hotel.id}`}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="text-destructive hover:text-destructive"
            data-testid={`button-delete-${hotel.id}`}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminHotels() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingHotel, setDeletingHotel] = useState<Hotel | null>(null);
  const [orderedHotels, setOrderedHotels] = useState<Hotel[]>([]);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const { data: hotelsResponse, isLoading } = useQuery({
    queryKey: ["/api/cms/hotels"],
    enabled: true
  });

  const hotels: Hotel[] = (hotelsResponse as any)?.hotels || [];

  useEffect(() => {
    setOrderedHotels(hotels);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotelsResponse]);

  const reorderMutation = useMutation({
    mutationFn: async (orderedIds: string[]) => {
      return apiRequest("POST", "/api/cms/hotels/reorder", { orderedIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/hotels"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error saving order",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/hotels"] });
    },
  });

  const deleteHotelMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/cms/hotels/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/hotels"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/stats"] });
      setIsDeleteDialogOpen(false);
      setDeletingHotel(null);
      toast({ title: "Hotel deleted successfully!" });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting hotel",
        description: error.message || "Something went wrong",
        variant: "destructive"
      });
    },
  });

  const handleDelete = (hotel: Hotel) => {
    setDeletingHotel(hotel);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingHotel) {
      deleteHotelMutation.mutate(deletingHotel.id);
    }
  };

  const isFiltering = searchTerm.trim().length > 0;
  const filteredHotels = isFiltering
    ? orderedHotels.filter((hotel) =>
        hotel.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.region?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : orderedHotels;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = orderedHotels.findIndex((h) => h.id === active.id);
    const newIndex = orderedHotels.findIndex((h) => h.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const newOrder = arrayMove(orderedHotels, oldIndex, newIndex);
    setOrderedHotels(newOrder);
    reorderMutation.mutate(newOrder.map((h) => h.id));
  };

  return (
    <AdminLayout title="Hotels" description="Manage luxury accommodations and Nile cruises">
      <div className="mb-6 flex justify-end">
        <Button onClick={() => setLocation("/admin/hotels/new")} data-testid="button-new-hotel">
          <Plus className="h-4 w-4 mr-2" />
          Add New Hotel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <div className="flex items-center">
              <Building className="h-5 w-5 mr-2" />
              Hotels ({hotels.length})
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search hotels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                data-testid="input-search"
              />
            </div>
          </CardTitle>
          <CardDescription>
            Drag the handle to reorder how hotels appear on the /stay grid. Clear the search box to reorder.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading hotels...</p>
            </div>
          ) : filteredHotels.length === 0 ? (
            <div className="text-center py-8">
              <Building className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium">
                {hotels.length === 0 ? "No hotels yet" : "No hotels match your search"}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {hotels.length === 0
                  ? "Get started by adding your first hotel."
                  : "Try adjusting your search terms."}
              </p>
              {hotels.length === 0 && (
                <Button
                  className="mt-4"
                  onClick={() => setLocation("/admin/hotels/new")}
                  data-testid="button-add-first-hotel"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Hotel
                </Button>
              )}
            </div>
          ) : isFiltering ? (
            <div className="space-y-4">
              {filteredHotels.map((hotel) => (
                <SortableHotelRow
                  key={hotel.id}
                  hotel={hotel}
                  onView={() => window.open(`/hotel/${hotel.slug}`, "_blank")}
                  onEdit={() => setLocation(`/admin/hotels/edit/${hotel.id}`)}
                  onDelete={() => handleDelete(hotel)}
                />
              ))}
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={filteredHotels.map((h) => h.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {filteredHotels.map((hotel) => (
                    <SortableHotelRow
                      key={hotel.id}
                      hotel={hotel}
                      onView={() => window.open(`/hotel/${hotel.slug}`, "_blank")}
                      onEdit={() => setLocation(`/admin/hotels/edit/${hotel.id}`)}
                      onDelete={() => handleDelete(hotel)}
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
            <DialogTitle>Delete Hotel</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingHotel?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setDeletingHotel(null);
              }}
              data-testid="delete-button-cancel"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteHotelMutation.isPending}
              data-testid="delete-button-confirm"
            >
              {deleteHotelMutation.isPending ? "Deleting..." : "Delete Hotel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
