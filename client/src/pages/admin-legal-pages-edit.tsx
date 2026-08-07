import { useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LegalPageForm } from "@/components/LegalPageForm";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLegalPagesEdit() {
  const [, params] = useRoute("/admin/legal-pages/edit/:id");
  const pageId = params?.id;
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const { data: legalPage, isLoading } = useQuery({
    queryKey: ["/api/cms/legal-pages", pageId],
    queryFn: async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No auth token");

      const response = await fetch(`/api/cms/legal-pages/${pageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setLocation("/admin/login");
          throw new Error("Session expired");
        }
        throw new Error("Failed to fetch legal page");
      }

      const data = await response.json();
      return data.legalPage;
    },
    enabled: !!pageId && !!localStorage.getItem("adminToken"),
  });

  const updatePageMutation = useMutation({
    mutationFn: async (data: any) => {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No auth token");

      const response = await fetch(`/api/cms/legal-pages/${pageId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const fieldErrors = Array.isArray(errorData.errors)
          ? errorData.errors
              .map((e: any) => `${(e.path || []).join(".") || "field"}: ${e.message}`)
              .join("; ")
          : undefined;
        throw new Error(fieldErrors || errorData.message || `HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/legal-pages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/legal-pages", pageId] });
      queryClient.invalidateQueries({ queryKey: ["/api/public/footer-links"] });
      toast({
        title: "Success",
        description: "Legal page updated successfully",
      });
      setLocation("/admin/legal-pages");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update legal page",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: any) => {
    updatePageMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading legal page...</p>
        </div>
      </div>
    );
  }

  if (!legalPage) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">Legal page not found</p>
          <Button onClick={() => setLocation("/admin/legal-pages")} data-testid="button-back-legal-pages">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Legal Pages
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
              onClick={() => setLocation("/admin/legal-pages")}
              className="mr-4"
              data-testid="button-back-legal-pages"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Legal Pages
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Edit Legal Page</h1>
              <p className="text-sm text-muted-foreground">{legalPage.title}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LegalPageForm
          initialData={legalPage}
          onSubmit={handleSubmit}
          isLoading={updatePageMutation.isPending}
        />
      </main>
    </div>
  );
}
