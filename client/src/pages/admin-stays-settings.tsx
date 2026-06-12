import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Save, Eye } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Link } from "wouter";

interface FaqItem {
  question: string;
  answer: string;
}

interface StaysSettings {
  heroImage: string;
  articleTitle: string;
  articleBody: string;
  faqs: FaqItem[];
}

export default function AdminStaysSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [heroImage, setHeroImage] = useState("");
  const [articleTitle, setArticleTitle] = useState("");
  const [articleBody, setArticleBody] = useState("");
  const [faqs, setFaqs] = useState<FaqItem[]>([]);

  const { data, isLoading } = useQuery<StaysSettings>({
    queryKey: ["/api/public/stays-settings"],
  });

  useEffect(() => {
    if (data) {
      setHeroImage(data.heroImage || "");
      setArticleTitle(data.articleTitle || "");
      setArticleBody(data.articleBody || "");
      setFaqs(data.faqs || []);
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: () =>
      apiRequest("PUT", "/api/cms/stays-settings", {
        heroImage,
        articleTitle,
        articleBody,
        faqs,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/public/stays-settings"] });
      toast({ title: "Stays page settings saved successfully" });
    },
    onError: () => {
      toast({ title: "Failed to save settings", variant: "destructive" });
    },
  });

  const addFaq = () => setFaqs((prev) => [...prev, { question: "", answer: "" }]);

  const updateFaq = (index: number, field: keyof FaqItem, value: string) => {
    setFaqs((prev) => prev.map((f, i) => (i === index ? { ...f, [field]: value } : f)));
  };

  const removeFaq = (index: number) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary">Stays Page Settings</h1>
            <p className="text-muted-foreground mt-1">Manage the content of the /stays public page</p>
          </div>
          <div className="flex gap-3">
            <Link href="/stays" target="_blank">
              <Button variant="outline" size="sm" className="gap-2">
                <Eye className="w-4 h-4" /> Preview
              </Button>
            </Link>
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
              className="gap-2"
            >
              {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save All Changes
            </Button>
          </div>
        </div>

        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
            <CardDescription>
              The full-width image behind "Where You Rest Matters". Title and subtitle are fixed by design.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="heroImage">Hero Background Image URL</Label>
              <Input
                id="heroImage"
                value={heroImage}
                onChange={(e) => setHeroImage(e.target.value)}
                placeholder="/api/assets/your-image.jpg or https://..."
              />
              {heroImage && (
                <div className="mt-2">
                  <img
                    src={heroImage}
                    alt="Hero preview"
                    className="w-full max-w-lg h-40 object-cover rounded-md"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Editorial Article */}
        <Card>
          <CardHeader>
            <CardTitle>Editorial Article</CardTitle>
            <CardDescription>
              The long-form article displayed below the hero. Supports rich formatting.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="articleTitle">Article Title</Label>
              <Input
                id="articleTitle"
                value={articleTitle}
                onChange={(e) => setArticleTitle(e.target.value)}
                placeholder="The Art of Luxury Accommodation in Egypt"
              />
            </div>
            <div className="space-y-2">
              <Label>Article Body</Label>
              <RichTextEditor
                value={articleBody}
                onChange={setArticleBody}
                placeholder="Write your editorial article here..."
                minHeight="400px"
              />
              <p className="text-xs text-muted-foreground">Target length: 300–400 words. Use H2/H3 headings to structure the article.</p>
            </div>
          </CardContent>
        </Card>

        {/* FAQs */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>
              These FAQs appear in the accordion section at the bottom of the Stays page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="border border-accent/10">
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Question {index + 1}</Label>
                        <Input
                          value={faq.question}
                          onChange={(e) => updateFaq(index, "question", e.target.value)}
                          placeholder="e.g. What types of luxury hotels are available in Egypt?"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Answer</Label>
                        <textarea
                          className="w-full border border-input rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                          rows={3}
                          value={faq.answer}
                          onChange={(e) => updateFaq(index, "answer", e.target.value)}
                          placeholder="Write a clear, helpful answer..."
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10 flex-shrink-0 mt-5"
                      onClick={() => removeFaq(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button type="button" variant="outline" onClick={addFaq} className="gap-2 w-full">
              <Plus className="w-4 h-4" /> Add FAQ
            </Button>
          </CardContent>
        </Card>

        {/* Save button at bottom */}
        <div className="flex justify-end pb-8">
          <Button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            size="lg"
            className="gap-2"
          >
            {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save All Changes
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
