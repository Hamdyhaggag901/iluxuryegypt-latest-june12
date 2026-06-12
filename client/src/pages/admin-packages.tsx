import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Package, Plus, Edit, Trash2, Search, ArrowLeft, DollarSign, Calendar } from "lucide-react";

interface PackageType {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  heroImage: string;
  gallery: string[];
  duration: string;
  groupSize: string;
  price: number;
  currency: string;
  includes: string[];
  excludes: string[];
  tours: string[];
  hotels: string[];
  destinations: string[];
  category: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPackages() {
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

  const { data: packages, isLoading, error } = useQuery({
    queryKey: ["/api/cms/packages"],
    queryFn: async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No auth token");
      
      const response = await fetch("/api/cms/packages", {
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

  const deletePackageMutation = useMutation({
    mutationFn: async (packageId: string) => {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No auth token");
      
      const response = await fetch(`/api/cms/packages/${packageId}`, {
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
      queryClient.invalidateQueries({ queryKey: ["/api/cms/packages"] });
    },
  });

  const filteredPackages = packages?.packages?.filter((pkg: PackageType) =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleDeletePackage = (packageId: string) => {
    if (confirm("Are you sure you want to delete this package?")) {
      deletePackageMutation.mutate(packageId);
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
                <h1 className="text-xl font-semibold">Packages Management</h1>
                <p className="text-sm text-muted-foreground">Manage travel packages (Family Holiday, Nile Cruises, etc.)</p>
              </div>
            </div>
            <Button onClick={() => setLocation("/admin/packages/new")} data-testid="button-add-package">
              <Plus className="h-4 w-4 mr-2" />
              Add New Package
            </Button>
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
              placeholder="Search packages by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-packages"
            />
          </div>
        </div>

        {/* Packages Grid */}
        {isLoading ? (
          <div className="text-center py-8" data-testid="loading-packages">Loading packages...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg: PackageType) => (
              <Card key={pkg.id} className="hover-elevate" data-testid={`card-package-${pkg.id}`}>
                <CardHeader>
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg">{pkg.name}</CardTitle>
                      <CardDescription className="line-clamp-1">
                        {pkg.category}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col gap-1">
                      {pkg.featured && (
                        <Badge variant="default" className="whitespace-nowrap">Featured</Badge>
                      )}
                      <Badge variant={pkg.published ? "secondary" : "outline"} className="whitespace-nowrap">
                        {pkg.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {pkg.duration}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Group Size:</span>
                      <span className="font-medium">{pkg.groupSize || "Flexible"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-medium flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {pkg.price} {pkg.currency}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Includes:</span>
                      <span className="font-medium">{pkg.tours?.length || 0} tours</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 pt-2">
                      {pkg.shortDescription || pkg.description}
                    </p>
                    <div className="flex justify-between pt-4 border-t gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLocation(`/admin/packages/${pkg.id}/edit`)}
                        data-testid={`button-edit-package-${pkg.id}`}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeletePackage(pkg.id)}
                        disabled={deletePackageMutation.isPending}
                        data-testid={`button-delete-package-${pkg.id}`}
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

        {filteredPackages.length === 0 && !isLoading && (
          <div className="text-center py-12" data-testid="empty-packages">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">No packages found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchTerm ? "Try adjusting your search terms." : "Get started by adding a new package."}
            </p>
            <div className="mt-6">
              <Button onClick={() => setLocation("/admin/packages/new")} data-testid="button-add-first-package">
                <Plus className="h-4 w-4 mr-2" />
                Add New Package
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
