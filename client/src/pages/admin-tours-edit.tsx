import { useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TourForm } from "@/components/TourForm";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminToursEdit() {
  const [, params] = useRoute("/admin/tours/edit/:id");
  const tourId = params?.id;
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const { data: tour, isLoading } = useQuery({
    queryKey: ["/api/cms/tours", tourId],
    queryFn: async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No auth token");

      const response = await fetch(`/api/cms/tours/${tourId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setLocation("/admin/login");
          throw new Error("Session expired");
        }
        throw new Error("Failed to fetch tour");
      }

      const data = await response.json();
      return data.tour;
    },
    enabled: !!tourId && !!localStorage.getItem("adminToken"),
  });

  const updateTourMutation = useMutation({
    mutationFn: async (data: any) => {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No auth token");

      const response = await fetch(`/api/cms/tours/${tourId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/tours"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/tours", tourId] });
      toast({
        title: "Success",
        description: "Tour updated successfully",
      });
      setLocation("/admin/tours");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update tour",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: any) => {
    updateTourMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading tour...</p>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">Tour not found</p>
          <Button onClick={() => setLocation("/admin/tours")} data-testid="button-back-tours">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tours
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/admin/tours")}
              className="mr-4"
              data-testid="button-back-tours"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tours
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Edit Tour</h1>
              <p className="text-sm text-muted-foreground">{tour.title}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TourForm
          initialData={tour}
          onSubmit={handleSubmit}
          isLoading={updateTourMutation.isPending}
        />
      </main>
    </div>
  );
}
