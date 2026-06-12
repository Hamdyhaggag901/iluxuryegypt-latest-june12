import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Building, Plus, Edit, Search, Trash2, Star, MapPin, Eye } from "lucide-react";
import AdminLayout from "@/components/admin-layout";

interface Hotel {
  id: string;
  name: string;
  slug: string;
  location: string;
  region: string;
  type: string;
  rating: number;
  priceTier: string;
  amenities: string[];
  image: string;
  description: string;
  fullDescription?: string;
  highlights?: string[];
  gallery?: string[];
  rooms?: any[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminHotels() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingHotel, setDeletingHotel] = useState<Hotel | null>(null);
  const { toast } = useToast();

  const { data: hotelsResponse, isLoading } = useQuery({
    queryKey: ["/api/cms/hotels"],
    enabled: true
  });

  const hotels = (hotelsResponse as any)?.hotels || [];

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

  const filteredHotels = hotels.filter((hotel: Hotel) =>
    hotel.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.region?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <AdminLayout title="Hotels" description="Manage luxury accommodations">
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
            Manage your luxury hotel portfolio
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
          ) : (
            <div className="space-y-4">
              {filteredHotels.map((hotel: Hotel) => (
                <div
                  key={hotel.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  data-testid={`hotel-${hotel.id}`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-4 flex-1">
                      {hotel.image && (
                        <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                          <img
                            src={hotel.image}
                            alt={hotel.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-medium" data-testid={`text-name-${hotel.id}`}>
                            {hotel.name}
                          </h3>
                          <div className="flex items-center">
                            {renderStars(hotel.rating)}
                          </div>
                          {hotel.featured && (
                            <Badge variant="default" data-testid={`badge-featured-${hotel.id}`}>
                              Featured
                            </Badge>
                          )}
                          <Badge variant="secondary" data-testid={`badge-type-${hotel.id}`}>
                            {hotel.type}
                          </Badge>
                          <Badge variant="outline" data-testid={`badge-price-${hotel.id}`}>
                            {hotel.priceTier}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span data-testid={`text-location-${hotel.id}`}>
                            {hotel.location}, {hotel.region}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2" data-testid={`text-description-${hotel.id}`}>
                          {hotel.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {hotel.rooms && hotel.rooms.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {hotel.rooms.length} Room Types
                            </Badge>
                          )}
                          {hotel.gallery && hotel.gallery.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {hotel.gallery.length} Gallery Images
                            </Badge>
                          )}
                          {hotel.amenities && hotel.amenities.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {hotel.amenities.length} Amenities
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/hotel/${hotel.slug}`, '_blank')}
                        data-testid={`button-view-${hotel.id}`}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLocation(`/admin/hotels/edit/${hotel.id}`)}
                        data-testid={`button-edit-${hotel.id}`}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(hotel)}
                        className="text-destructive hover:text-destructive"
                        data-testid={`button-delete-${hotel.id}`}
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
