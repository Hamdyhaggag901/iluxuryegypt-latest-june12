import { useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DestinationForm } from "@/components/DestinationForm";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDestinationsNew() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const createDestinationMutation = useMutation({
    mutationFn: async (data: any) => {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No auth token");

      const response = await fetch("/api/cms/destinations", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/destinations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/stats"] });
      toast({
        title: "Success",
        description: "Destination created successfully",
      });
      setLocation("/admin/destinations");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create destination",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: any) => {
    createDestinationMutation.mutate(data);
  };

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
              <h1 className="text-xl font-semibold">Add New Destination</h1>
              <p className="text-sm text-muted-foreground">Create a new travel destination</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DestinationForm
          onSubmit={handleSubmit}
          isLoading={createDestinationMutation.isPending}
        />
      </main>
    </div>
  );
}
