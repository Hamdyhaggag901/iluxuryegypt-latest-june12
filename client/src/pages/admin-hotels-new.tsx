import { useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HotelForm } from "@/components/HotelForm";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminHotelsNew() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const createHotelMutation = useMutation({
    mutationFn: async (data: any) => {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No auth token");

      const response = await fetch("/api/cms/hotels", {
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
      queryClient.invalidateQueries({ queryKey: ["/api/cms/hotels"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/stats"] });
      toast({
        title: "Success",
        description: "Hotel created successfully",
      });
      setLocation("/admin/hotels");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create hotel",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: any) => {
    createHotelMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/admin/hotels")}
              className="mr-4"
              data-testid="button-back-hotels"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Hotels
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Add New Hotel</h1>
              <p className="text-sm text-muted-foreground">Create a new luxury hotel</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HotelForm
          onSubmit={handleSubmit}
          isLoading={createHotelMutation.isPending}
        />
      </main>
    </div>
  );
}
