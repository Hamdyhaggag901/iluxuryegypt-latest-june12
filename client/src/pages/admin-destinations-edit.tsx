import { useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DestinationForm } from "@/components/DestinationForm";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDestinationsEdit() {
  const [, params] = useRoute("/admin/destinations/edit/:id");
  const destinationId = params?.id;
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const { data: destination, isLoading } = useQuery({
    queryKey: ["/api/cms/destinations", destinationId],
    queryFn: async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No auth token");

      const response = await fetch(`/api/cms/destinations/${destinationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setLocation("/admin/login");
          throw new Error("Session expired");
        }
        throw new Error("Failed to fetch destination");
      }

      const data = await response.json();
      return data.destination;
    },
    enabled: !!destinationId && !!localStorage.getItem("adminToken"),
  });

  const updateDestinationMutation = useMutation({
    mutationFn: async (data: any) => {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No auth token");

      const response = await fetch(`/api/cms/destinations/${destinationId}`, {
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
      queryClient.invalidateQueries({ queryKey: ["/api/cms/destinations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/destinations", destinationId] });
      toast({
        title: "Success",
        description: "Destination updated successfully",
      });
      setLocation("/admin/destinations");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update destination",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: any) => {
    updateDestinationMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading destination...</p>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">Destination not found</p>
          <Button onClick={() => setLocation("/admin/destinations")} data-testid="button-back-destinations">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Destinations
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
              onClick={() => setLocation("/admin/destinations")}
              className="mr-4"
              data-testid="button-back-destinations"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Destinations
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Edit Destination</h1>
              <p className="text-sm text-muted-foreground">{destination.name}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DestinationForm
          initialData={destination}
          onSubmit={handleSubmit}
          isLoading={updateDestinationMutation.isPending}
        />
      </main>
    </div>
  );
}
