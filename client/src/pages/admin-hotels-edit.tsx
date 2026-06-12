import { useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HotelForm } from "@/components/HotelForm";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminHotelsEdit() {
  const [, params] = useRoute("/admin/hotels/edit/:id");
  const hotelId = params?.id;
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const { data: hotel, isLoading } = useQuery({
    queryKey: ["/api/cms/hotels", hotelId],
    queryFn: async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No auth token");

      const response = await fetch(`/api/cms/hotels/${hotelId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setLocation("/admin/login");
          throw new Error("Session expired");
        }
        throw new Error("Failed to fetch hotel");
      }

      const data = await response.json();
      return data.hotel;
    },
    enabled: !!hotelId && !!localStorage.getItem("adminToken"),
  });

  const updateHotelMutation = useMutation({
    mutationFn: async (data: any) => {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No auth token");

      const response = await fetch(`/api/cms/hotels/${hotelId}`, {
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
      queryClient.invalidateQueries({ queryKey: ["/api/cms/hotels"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/hotels", hotelId] });
      toast({
        title: "Success",
        description: "Hotel updated successfully",
      });
      setLocation("/admin/hotels");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update hotel",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: any) => {
    updateHotelMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading hotel...</p>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">Hotel not found</p>
          <Button onClick={() => setLocation("/admin/hotels")} data-testid="button-back-hotels">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Hotels
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
              onClick={() => setLocation("/admin/hotels")}
              className="mr-4"
              data-testid="button-back-hotels"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Hotels
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Edit Hotel</h1>
              <p className="text-sm text-muted-foreground">{hotel.name}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HotelForm
          initialData={hotel}
          onSubmit={handleSubmit}
          isLoading={updateHotelMutation.isPending}
        />
      </main>
    </div>
  );
}
