import { useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LegalPageForm } from "@/components/LegalPageForm";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLegalPagesNew() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const createPageMutation = useMutation({
    mutationFn: async (data: any) => {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No auth token");

      const response = await fetch("/api/cms/legal-pages", {
        method: "POST",
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
      queryClient.invalidateQueries({ queryKey: ["/api/public/footer-links"] });
      toast({
        title: "Success",
        description: "Legal page created successfully",
      });
      setLocation("/admin/legal-pages");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create legal page",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: any) => {
    createPageMutation.mutate(data);
  };

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
              <h1 className="text-xl font-semibold">Add New Legal Page</h1>
              <p className="text-sm text-muted-foreground">Create a new policy or legal page</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LegalPageForm
          onSubmit={handleSubmit}
          isLoading={createPageMutation.isPending}
        />
      </main>
    </div>
  );
}
