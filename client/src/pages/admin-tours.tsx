import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { Map, Plus, Edit, Trash2, Search, ArrowLeft, DollarSign, Upload } from "lucide-react";

interface Tour {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  heroImage: string;
  gallery: string[];
  duration: string;
  groupSize: string;
  difficulty: string;
  price: number;
  currency: string;
  includes: string[];
  excludes: string[];
  itinerary: any;
  destinations: string[];
  category: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminTours() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const { data: tours, isLoading, error } = useQuery({
    queryKey: ["/api/cms/tours"],
    queryFn: async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No auth token");
      
      const response = await fetch("/api/cms/tours", {
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
    retry: (failureCount, error: any) => {
      if (error?.message === "Session expired") return false;
      return failureCount < 2;
    }
  });

  const deleteTourMutation = useMutation({
    mutationFn: async (tourId: string) => {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No auth token");
      
      const response = await fetch(`/api/cms/tours/${tourId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/tours"] });
    },
  });

  const filteredTours = tours?.tours?.filter((tour: Tour) =>
    tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tour.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tour.destinations.some(dest => dest.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const handleDeleteTour = (tourId: string) => {
    if (confirm("Are you sure you want to delete this tour?")) {
      deleteTourMutation.mutate(tourId);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/admin")}
                className="mr-4"
                data-testid="button-back-dashboard"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Tours Management</h1>
                <p className="text-sm text-muted-foreground">Manage tour packages and experiences</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setLocation("/admin/tours/bulk")} data-testid="button-bulk-import">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Import
              </Button>
              <Button onClick={() => setLocation("/admin/tours/new")} data-testid="button-add-tour">
                <Plus className="h-4 w-4 mr-2" />
                Add New Tour
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search tours by title, category, or destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-tours"
            />
          </div>
        </div>

        {/* Tours Grid */}
        {isLoading ? (
          <div className="text-center py-8" data-testid="loading-tours">Loading tours...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTours.map((tour: Tour) => (
              <Card key={tour.id} className="hover-elevate" data-testid={`card-tour-${tour.id}`}>
                <CardHeader>
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg">{tour.title}</CardTitle>
                      <CardDescription className="line-clamp-1">
                        {tour.category}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col gap-1">
                      {tour.featured && (
                        <Badge variant="default" className="whitespace-nowrap">Featured</Badge>
                      )}
                      <Badge variant={tour.published ? "secondary" : "outline"} className="whitespace-nowrap">
                        {tour.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{tour.duration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Difficulty:</span>
                      <span className="font-medium">{tour.difficulty || "Easy"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-medium flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {tour.price} {tour.currency}
                      </span>
                    </div>
                    {tour.destinations && tour.destinations.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-2">
                        {tour.destinations.slice(0, 3).map((dest, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {dest}
                          </Badge>
                        ))}
                        {tour.destinations.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{tour.destinations.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {tour.shortDescription || tour.description}
                    </p>
                    <div className="flex justify-between pt-4 border-t gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLocation(`/admin/tours/edit/${tour.id}`)}
                        data-testid={`button-edit-tour-${tour.id}`}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteTour(tour.id)}
                        disabled={deleteTourMutation.isPending}
                        data-testid={`button-delete-tour-${tour.id}`}
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

        {filteredTours.length === 0 && !isLoading && (
          <div className="text-center py-12" data-testid="empty-tours">
            <Map className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">No tours found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchTerm ? "Try adjusting your search terms." : "Get started by adding a new tour."}
            </p>
            <div className="mt-6">
              <Button onClick={() => setLocation("/admin/tours/new")} data-testid="button-add-first-tour">
                <Plus className="h-4 w-4 mr-2" />
                Add New Tour
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
