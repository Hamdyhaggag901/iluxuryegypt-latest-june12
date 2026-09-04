import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function AdminStayPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form state for the Hero (title + background image are the only fields
  // the live /stay page actually renders — see client/src/pages/stay.tsx)
  const [heroForm, setHeroForm] = useState({
    title: "",
    backgroundImage: "",
  });

  // Form state for CTA — only the primary button is rendered on /stay
  const [ctaForm, setCtaForm] = useState({
    title: "",
    primaryButtonText: "",
    primaryButtonLink: "",
  });

  // Fetch hero
  const { data: heroData, isLoading: heroLoading } = useQuery({
    queryKey: ["/api/cms/stay-page/hero"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/cms/stay-page/hero");
      return res;
    },
  });

  useEffect(() => {
    const hero = (heroData as any)?.hero;
    if (hero) {
      setHeroForm({
        title: hero.title || "",
        backgroundImage: hero.backgroundImage || "",
      });
    }
  }, [heroData]);

  // Fetch CTA
  const { data: ctaData, isLoading: ctaLoading } = useQuery({
    queryKey: ["/api/cms/stay-page/cta"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/cms/stay-page/cta");
      return res;
    },
  });

  useEffect(() => {
    const cta = (ctaData as any)?.cta;
    if (cta) {
      setCtaForm({
        title: cta.title || "",
        primaryButtonText: cta.primaryButtonText || "",
        primaryButtonLink: cta.primaryButtonLink || "",
      });
    }
  }, [ctaData]);

  const saveHeroMutation = useMutation({
    mutationFn: async (data: typeof heroForm) => {
      return await apiRequest("POST", "/api/cms/stay-page/hero", data);
    },
    onSuccess: () => {
      toast({ title: "Hero saved successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/stay-page/hero"] });
      queryClient.invalidateQueries({ queryKey: ["/api/public/stay-page"] });
    },
    onError: () => {
      toast({ title: "Error saving hero", variant: "destructive" });
    },
  });

  const saveCtaMutation = useMutation({
    mutationFn: async (data: typeof ctaForm) => {
      return await apiRequest("POST", "/api/cms/stay-page/cta", data);
    },
    onSuccess: () => {
      toast({ title: "CTA section saved successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/stay-page/cta"] });
      queryClient.invalidateQueries({ queryKey: ["/api/public/stay-page"] });
    },
    onError: () => {
      toast({ title: "Error saving CTA section", variant: "destructive" });
    },
  });

  const isLoading = heroLoading || ctaLoading;

  if (isLoading) {
    return (
      <AdminLayout title="Stay Page" description="Edit the /stay listing page">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }
  return (
    <AdminLayout title="Stay Page" description="Edit the /stay listing page">
      <div className="space-y-8 pb-10">
        <div>
          <h1 className="text-3xl font-bold">Stay Page Editor</h1>
          <p className="text-muted-foreground mt-1">
            Edit the /stay listing page — hero banner and the closing CTA. Hotels shown on the
            page (order, featured status) are managed on the Hotels page.
          </p>
        </div>

        {/* Hero */}
        <Card>
          <CardHeader>
            <CardTitle>Hero</CardTitle>
            <CardDescription>The full-bleed banner at the top of /stay</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title (H1)</Label>
              <Input
                value={heroForm.title}
                onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                placeholder="Where You'll Stay in Egypt"
                data-testid="input-hero-title"
              />
            </div>
            <div className="space-y-2">
              <Label>Background Image URL</Label>
              <Input
                value={heroForm.backgroundImage}
                onChange={(e) => setHeroForm({ ...heroForm, backgroundImage: e.target.value })}
                placeholder="https://..."
                data-testid="input-hero-background-image"
              />
              {heroForm.backgroundImage && (
                <img
                  src={heroForm.backgroundImage}
                  alt="Hero background preview"
                  className="mt-2 h-32 w-full rounded border object-cover"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                  onLoad={(e) => { e.currentTarget.style.display = "block"; }}
                />
              )}
            </div>
            <Button
              onClick={() => saveHeroMutation.mutate(heroForm)}
              disabled={saveHeroMutation.isPending}
              data-testid="button-save-hero"
            >
              {saveHeroMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Hero
            </Button>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card>
          <CardHeader>
            <CardTitle>Closing CTA Band</CardTitle>
            <CardDescription>The band at the bottom of /stay. Only the primary button is shown on the page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={ctaForm.title}
                onChange={(e) => setCtaForm({ ...ctaForm, title: e.target.value })}
                placeholder="Can't decide? Let us choose for you."
                data-testid="input-cta-title"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Button Text</Label>
                <Input
                  value={ctaForm.primaryButtonText}
                  onChange={(e) => setCtaForm({ ...ctaForm, primaryButtonText: e.target.value })}
                  placeholder="Speak with a Specialist"
                  data-testid="input-cta-button-text"
                />
              </div>
              <div className="space-y-2">
                <Label>Button Link</Label>
                <Input
                  value={ctaForm.primaryButtonLink}
                  onChange={(e) => setCtaForm({ ...ctaForm, primaryButtonLink: e.target.value })}
                  placeholder="/contact"
                  data-testid="input-cta-button-link"
                />
              </div>
            </div>
            <Button onClick={() => saveCtaMutation.mutate(ctaForm)} disabled={saveCtaMutation.isPending} data-testid="button-save-cta">
              {saveCtaMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Closing CTA
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
