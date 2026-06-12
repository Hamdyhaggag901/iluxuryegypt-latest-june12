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
import { MapPin, Plus, Edit, Search, Trash2, Star, Clock, Eye, EyeOff } from "lucide-react";
import AdminLayout from "@/components/admin-layout";

interface Destination {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  heroImage: string;
  gallery: string[];
  highlights: string[];
  bestTimeToVisit?: string;
  duration?: string;
  difficulty?: string;
  region: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDestinations() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingDestination, setDeletingDestination] = useState<Destination | null>(null);
  const { toast } = useToast();

  const { data: destinations = [], isLoading } = useQuery({
    queryKey: ["/api/cms/destinations"],
  });

  const deleteDestinationMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/cms/destinations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/destinations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/stats"] });
      setIsDeleteDialogOpen(false);
      setDeletingDestination(null);
      toast({ title: "Destination deleted successfully!" });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting destination",
        description: error.message || "Something went wrong",
        variant: "destructive"
      });
    },
  });

  const handleDelete = (destination: Destination) => {
    setDeletingDestination(destination);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingDestination) {
      deleteDestinationMutation.mutate(deletingDestination.id);
    }
  };

  const filteredDestinations = (destinations as Destination[]).filter((destination: Destination) =>
    destination.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    destination.region?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    destination.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Destinations" description="Manage travel destinations">
      <div className="mb-6 flex justify-end">
        <Button onClick={() => setLocation("/admin/destinations/new")} data-testid="button-new-destination">
          <Plus className="h-4 w-4 mr-2" />
          Add New Destination
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Destinations ({(destinations as Destination[]).length})
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                data-testid="input-search"
              />
            </div>
          </CardTitle>
          <CardDescription>
            Manage your travel destinations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading destinations...</p>
            </div>
          ) : filteredDestinations.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium">
                {(destinations as Destination[]).length === 0 ? "No destinations yet" : "No destinations match your search"}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {(destinations as Destination[]).length === 0
                  ? "Get started by adding your first destination."
                  : "Try adjusting your search terms."}
              </p>
              {(destinations as Destination[]).length === 0 && (
                <Button
                  className="mt-4"
                  onClick={() => setLocation("/admin/destinations/new")}
                  data-testid="button-add-first-destination"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Destination
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDestinations.map((destination: Destination) => (
                <div
                  key={destination.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  data-testid={`destination-${destination.id}`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-4 flex-1">
                      {destination.heroImage && (
                        <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                          <img
                            src={destination.heroImage}
                            alt={destination.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-medium" data-testid={`text-name-${destination.id}`}>
                            {destination.name}
                          </h3>
                          {destination.featured && (
                            <Badge variant="default" className="bg-yellow-100 text-yellow-800" data-testid={`badge-featured-${destination.id}`}>
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                          <Badge
                            variant={destination.published ? "default" : "secondary"}
                            className={destination.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                          >
                            {destination.published ? (
                              <><Eye className="h-3 w-3 mr-1" /> Published</>
                            ) : (
                              <><EyeOff className="h-3 w-3 mr-1" /> Draft</>
                            )}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mb-2 gap-4">
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {destination.region}
                          </span>
                          {destination.duration && (
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {destination.duration}
                            </span>
                          )}
                          {destination.difficulty && (
                            <Badge variant="outline" className="text-xs">
                              {destination.difficulty}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2" data-testid={`text-description-${destination.id}`}>
                          {destination.shortDescription || destination.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {destination.highlights && destination.highlights.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {destination.highlights.length} Highlights
                            </Badge>
                          )}
                          {destination.gallery && destination.gallery.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {destination.gallery.length} Gallery Images
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/destinations/${destination.slug}`, '_blank')}
                        data-testid={`button-view-${destination.id}`}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLocation(`/admin/destinations/edit/${destination.id}`)}
                        data-testid={`button-edit-${destination.id}`}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(destination)}
                        className="text-destructive hover:text-destructive"
                        data-testid={`button-delete-${destination.id}`}
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
            <DialogTitle>Delete Destination</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingDestination?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setDeletingDestination(null);
              }}
              data-testid="delete-button-cancel"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteDestinationMutation.isPending}
              data-testid="delete-button-confirm"
            >
              {deleteDestinationMutation.isPending ? "Deleting..." : "Delete Destination"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
