import { useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TourForm } from "@/components/TourForm";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminToursNew() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const createTourMutation = useMutation({
    mutationFn: async (data: any) => {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No auth token");

      const response = await fetch("/api/cms/tours", {
        method: "POST",
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
      toast({
        title: "Success",
        description: "Tour created successfully",
      });
      setLocation("/admin/tours");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create tour",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: any) => {
    createTourMutation.mutate(data);
  };

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
              <h1 className="text-xl font-semibold">Add New Tour</h1>
              <p className="text-sm text-muted-foreground">Create a new tour package</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TourForm
          onSubmit={handleSubmit}
          isLoading={createTourMutation.isPending}
        />
      </main>
    </div>
  );
}
