import { useState } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertLegalPageSchema, legalHighlightSchema, LEGACY_LEGAL_SLUGS } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { WysiwygEditor } from "@/components/ui/wysiwyg-editor";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  X,
  Loader2,
  AlertTriangle,
  Shield,
  Eye,
  Cookie,
  Mail,
  Scale,
  FileText,
  Calendar,
  CreditCard,
  Settings,
  BarChart,
  Leaf,
  Heart,
  Users,
  Globe,
  Info,
} from "lucide-react";

const ICON_OPTIONS = [
  { value: "shield", label: "Shield", icon: Shield },
  { value: "eye", label: "Eye", icon: Eye },
  { value: "cookie", label: "Cookie", icon: Cookie },
  { value: "mail", label: "Mail", icon: Mail },
  { value: "scale", label: "Scale", icon: Scale },
  { value: "file-text", label: "File Text", icon: FileText },
  { value: "calendar", label: "Calendar", icon: Calendar },
  { value: "credit-card", label: "Credit Card", icon: CreditCard },
  { value: "settings", label: "Settings", icon: Settings },
  { value: "bar-chart", label: "Bar Chart", icon: BarChart },
  { value: "leaf", label: "Leaf", icon: Leaf },
  { value: "heart", label: "Heart", icon: Heart },
  { value: "users", label: "Users", icon: Users },
  { value: "globe", label: "Globe", icon: Globe },
  { value: "info", label: "Info", icon: Info },
  { value: "alert-triangle", label: "Alert Triangle", icon: AlertTriangle },
];

function getIconComponent(value: string) {
  return ICON_OPTIONS.find((o) => o.value === value)?.icon || Info;
}

type LegalPageFormData = z.infer<typeof insertLegalPageSchema>;
type HighlightData = z.infer<typeof legalHighlightSchema>;

// Which tab each field lives in, so a validation error can jump the user
// straight to the tab that needs fixing instead of failing silently.
const FIELD_TAB_MAP: Record<string, string> = {
  title: "overview",
  slug: "overview",
  subtitle: "overview",
  status: "overview",
  showInFooter: "overview",
  introTitle: "highlights",
  introDescription: "highlights",
  highlights: "highlights",
  content: "content",
  contactEmail: "content",
  contactPhone: "content",
  contactAddress: "content",
};

const FIELD_LABELS: Record<string, string> = {
  title: "Title",
  slug: "Slug",
};

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface LegalPageFormProps {
  initialData?: Partial<any>;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export function LegalPageForm({ initialData, onSubmit, isLoading }: LegalPageFormProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [highlightIcon, setHighlightIcon] = useState("shield");
  const [highlightTitle, setHighlightTitle] = useState("");
  const [highlightDescription, setHighlightDescription] = useState("");

  const isLegacySlug = initialData?.slug
    ? (LEGACY_LEGAL_SLUGS as readonly string[]).includes(initialData.slug)
    : false;

  const form = useForm<LegalPageFormData>({
    resolver: zodResolver(insertLegalPageSchema),
    defaultValues: {
      slug: "",
      title: "",
      subtitle: "",
      introTitle: "",
      introDescription: "",
      highlights: [],
      content: "",
      contactEmail: "",
      contactPhone: "",
      contactAddress: "",
      showInFooter: true,
      sortOrder: 0,
      status: "published",
      ...initialData,
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue("title", title);
    if (!initialData) {
      form.setValue("slug", generateSlug(title));
    }
  };

  const addHighlight = () => {
    if (!highlightTitle.trim() || !highlightDescription.trim()) return;
    const current = form.getValues("highlights") || [];
    form.setValue("highlights", [
      ...current,
      { icon: highlightIcon, title: highlightTitle.trim(), description: highlightDescription.trim() },
    ]);
    setHighlightTitle("");
    setHighlightDescription("");
  };

  const removeHighlight = (index: number) => {
    const current = form.getValues("highlights") || [];
    form.setValue(
      "highlights",
      current.filter((_: any, i: number) => i !== index),
    );
  };

  const handleSubmit = (data: LegalPageFormData) => {
    onSubmit(data);
  };

  const onInvalid = (errors: FieldErrors<LegalPageFormData>) => {
    const errorFields = Object.keys(errors);
    if (errorFields.length === 0) return;

    const firstTab = FIELD_TAB_MAP[errorFields[0]] || "overview";
    setActiveTab(firstTab);

    const description = errorFields
      .map((field) => {
        const label = FIELD_LABELS[field] || field;
        const message = (errors as Record<string, { message?: string }>)[field]?.message || "This field is invalid.";
        return `${label}: ${message}`;
      })
      .join("\n");

    toast({
      title: "Please fix the following before saving",
      description,
      variant: "destructive",
    });
  };

  const highlights: HighlightData[] = form.watch("highlights") || [];

  return (
    <form onSubmit={form.handleSubmit(handleSubmit, onInvalid)} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3" data-testid="tabs-legal-page-form">
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="highlights" data-testid="tab-highlights">Intro &amp; Highlights</TabsTrigger>
          <TabsTrigger value="content" data-testid="tab-content">Content &amp; Contact</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>The page title, URL slug, and hero subtitle</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  data-testid="input-title"
                  {...form.register("title")}
                  onChange={handleTitleChange}
                  placeholder="e.g., Privacy Policy"
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive">{String(form.formState.errors.title.message)}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input id="slug" data-testid="input-slug" {...form.register("slug")} placeholder="privacy-policy" />
                {form.formState.errors.slug && (
                  <p className="text-sm text-destructive">{String(form.formState.errors.slug.message)}</p>
                )}
                {!isLegacySlug && (
                  <p className="text-xs text-muted-foreground">
                    Public URL will be <code>/legal/{form.watch("slug") || "your-slug"}</code>
                  </p>
                )}
                {isLegacySlug && (
                  <div
                    className="flex items-start gap-2 p-3 rounded-md border-2 border-destructive bg-destructive/10 text-sm text-destructive"
                    data-testid="warning-legacy-slug"
                  >
                    <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">
                        Warning: this is one of the site's original 5 legal pages.
                      </p>
                      <p>
                        Its current live URL is <code>/{initialData?.slug}</code> — indexed by Google and linked
                        from the site footer and other forms. Changing this slug changes the page's live URL and
                        will break that existing link with no automatic redirect. Only change it if you fully
                        intend to move this page to a new URL.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Textarea
                  id="subtitle"
                  data-testid="input-subtitle"
                  {...form.register("subtitle")}
                  placeholder="Shown under the title in the hero section"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select value={form.watch("status")} onValueChange={(v) => form.setValue("status", v as any)}>
                    <SelectTrigger id="status" data-testid="select-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Draft pages return a 404 on the live site</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="showInFooter">Show in Footer</Label>
                  <div className="flex items-center gap-2 h-10">
                    <Switch
                      id="showInFooter"
                      checked={form.watch("showInFooter")}
                      onCheckedChange={(v) => form.setValue("showInFooter", v)}
                      data-testid="switch-show-in-footer"
                    />
                    <span className="text-sm text-muted-foreground">
                      {form.watch("showInFooter") ? "Visible under Legal & Policies" : "Hidden from footer"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Highlights Tab */}
        <TabsContent value="highlights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Intro Section</CardTitle>
              <CardDescription>The heading and paragraph shown above the highlight cards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="introTitle">Intro Title</Label>
                <Input
                  id="introTitle"
                  data-testid="input-intro-title"
                  {...form.register("introTitle")}
                  placeholder="e.g., Our Privacy Commitment"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="introDescription">Intro Description</Label>
                <Textarea id="introDescription" data-testid="input-intro-description" {...form.register("introDescription")} rows={3} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Highlight Cards</CardTitle>
              <CardDescription>
                Icon + title + description cards shown under the intro (the original pages use 4, but any number works)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-[160px_1fr_1fr_auto] gap-2">
                <Select value={highlightIcon} onValueChange={setHighlightIcon}>
                  <SelectTrigger data-testid="select-highlight-icon">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <option.icon className="h-4 w-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={highlightTitle}
                  onChange={(e) => setHighlightTitle(e.target.value)}
                  placeholder="Title"
                  data-testid="input-highlight-title"
                />
                <Input
                  value={highlightDescription}
                  onChange={(e) => setHighlightDescription(e.target.value)}
                  placeholder="Short description"
                  data-testid="input-highlight-description"
                />
                <Button type="button" onClick={addHighlight} data-testid="button-add-highlight">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {highlights.map((highlight, index) => {
                  const Icon = getIconComponent(highlight.icon);
                  return (
                    <div
                      key={`${highlight.title}-${index}`}
                      className="flex items-center justify-between p-3 border rounded-lg"
                      data-testid={`highlight-row-${index}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-accent/10 rounded-full flex items-center justify-center">
                          <Icon className="h-4 w-4 text-accent" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{highlight.title}</p>
                          <p className="text-xs text-muted-foreground">{highlight.description}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeHighlight(index)}
                        data-testid={`button-remove-highlight-${index}`}
                      >
                        <X className="h-4 w-4 text-destructive" />
                      </button>
                    </div>
                  );
                })}
                {highlights.length === 0 && (
                  <p className="text-sm text-muted-foreground">No highlight cards added yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Body Content</CardTitle>
              <CardDescription>The main article — write headings, paragraphs, and lists freely</CardDescription>
            </CardHeader>
            <CardContent>
              <WysiwygEditor
                value={form.watch("content") || ""}
                onChange={(value) => form.setValue("content", value)}
                placeholder="Write the full policy text here..."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Block</CardTitle>
              <CardDescription>Shown at the end of the page. Leave blank to hide this section entirely.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email</Label>
                <Input
                  id="contactEmail"
                  data-testid="input-contact-email"
                  {...form.register("contactEmail")}
                  placeholder="privacy@i.luxuryegypt.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Phone</Label>
                <Input
                  id="contactPhone"
                  data-testid="input-contact-phone"
                  {...form.register("contactPhone")}
                  placeholder="+20 xxx xxx xxxx"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactAddress">Address</Label>
                <Input
                  id="contactAddress"
                  data-testid="input-contact-address"
                  {...form.register("contactAddress")}
                  placeholder="Cairo, Egypt"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button type="submit" disabled={isLoading} data-testid="button-submit-legal-page">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Page" : "Create Page"}
        </Button>
      </div>
    </form>
  );
}
