import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AdminLayout from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus, Trash2, Save, Image, Link2, Eye, EyeOff, ExternalLink,
  Facebook, Instagram, Twitter, Youtube, Linkedin
} from "lucide-react";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const footerLinkSchema = z.object({
  section: z.string().min(1, "Section is required"),
  label: z.string().min(1, "Label is required"),
  href: z.string().min(1, "Link is required"),
  sortOrder: z.number().default(0),
  isVisible: z.boolean().default(true),
  openInNewTab: z.boolean().default(false),
});

const socialLinkSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  url: z.string().url("Valid URL required"),
  sortOrder: z.number().default(0),
  isVisible: z.boolean().default(true),
});

type FooterLink = {
  id: string;
  section: string;
  label: string;
  href: string;
  sortOrder: number;
  isVisible: boolean;
  openInNewTab: boolean;
};

type SocialLink = {
  id: string;
  platform: string;
  url: string;
  sortOrder: number;
  isVisible: boolean;
};

const FOOTER_SECTIONS = [
  { value: "quick_links", label: "Quick Links" },
  { value: "experiences", label: "Experiences" },
  { value: "support", label: "Support" },
  { value: "legal", label: "Legal" },
];

const SOCIAL_PLATFORMS = [
  { value: "facebook", label: "Facebook", icon: Facebook },
  { value: "instagram", label: "Instagram", icon: Instagram },
  { value: "twitter", label: "Twitter / X", icon: Twitter },
  { value: "youtube", label: "YouTube", icon: Youtube },
  { value: "linkedin", label: "LinkedIn", icon: Linkedin },
];

export default function AdminFooter() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isSocialDialogOpen, setIsSocialDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<FooterLink | null>(null);
  const [editingSocial, setEditingSocial] = useState<SocialLink | null>(null);
  const [footerLogo, setFooterLogo] = useState("");
  const [footerDescription, setFooterDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactAddress, setContactAddress] = useState("");

  // Fetch footer links
  const { data: linksData, isLoading: linksLoading } = useQuery({
    queryKey: ["/api/cms/footer-links"],
    queryFn: async () => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/cms/footer-links", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch footer links");
      return response.json();
    },
  });

  // Fetch social links
  const { data: socialData, isLoading: socialLoading } = useQuery({
    queryKey: ["/api/cms/social-links"],
    queryFn: async () => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/cms/social-links", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch social links");
      return response.json();
    },
  });

  // Fetch site config
  const { data: configData } = useQuery({
    queryKey: ["/api/cms/site-config"],
    queryFn: async () => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/cms/site-config", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch site config");
      const data = await response.json();
      // Set values from config (config is an array of {id, key, value, type})
      if (Array.isArray(data.config)) {
        data.config.forEach((c: any) => {
          if (c.key === 'footer_logo') setFooterLogo(c.value);
          if (c.key === 'footer_description') setFooterDescription(c.value);
          if (c.key === 'contact_email') setContactEmail(c.value);
          if (c.key === 'contact_phone') setContactPhone(c.value);
          if (c.key === 'contact_address') setContactAddress(c.value);
        });
      }
      return data;
    },
  });

  const linkForm = useForm({
    resolver: zodResolver(footerLinkSchema),
    defaultValues: {
      section: "quick_links",
      label: "",
      href: "",
      sortOrder: 0,
      isVisible: true,
      openInNewTab: false,
    },
  });

  const socialForm = useForm({
    resolver: zodResolver(socialLinkSchema),
    defaultValues: {
      platform: "facebook",
      url: "",
      sortOrder: 0,
      isVisible: true,
    },
  });

  // Save footer link
  const saveLinkMutation = useMutation({
    mutationFn: async ({ id, data }: { id?: string; data: z.infer<typeof footerLinkSchema> }) => {
      const token = localStorage.getItem("adminToken");
      const url = id
        ? `/api/cms/footer-links/${id}`
        : "/api/cms/footer-links";
      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save footer link");
      return response.json();
    },
    onSuccess: (_, variables) => {
      toast({ title: "Success", description: `Footer link ${variables.id ? 'updated' : 'created'}` });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/footer-links"] });
      setIsLinkDialogOpen(false);
      setEditingLink(null);
      linkForm.reset();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Delete footer link
  const deleteLinkMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/cms/footer-links/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete footer link");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Footer link deleted" });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/footer-links"] });
    },
  });

  // Save social link
  const saveSocialMutation = useMutation({
    mutationFn: async ({ id, data }: { id?: string; data: z.infer<typeof socialLinkSchema> }) => {
      const token = localStorage.getItem("adminToken");
      const url = id
        ? `/api/cms/social-links/${id}`
        : "/api/cms/social-links";
      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save social link");
      return response.json();
    },
    onSuccess: (_, variables) => {
      toast({ title: "Success", description: `Social link ${variables.id ? 'updated' : 'created'}` });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/social-links"] });
      setIsSocialDialogOpen(false);
      setEditingSocial(null);
      socialForm.reset();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Delete social link
  const deleteSocialMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/cms/social-links/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete social link");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Social link deleted" });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/social-links"] });
    },
  });

  // Save site config
  const saveConfigMutation = useMutation({
    mutationFn: async (configs: { key: string; value: string; type?: string }[]) => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/cms/site-config/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ configs }),
      });
      if (!response.ok) throw new Error("Failed to save configuration");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Footer configuration saved" });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/site-config"] });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Toggle link visibility
  const toggleLinkVisibility = useMutation({
    mutationFn: async ({ id, isVisible }: { id: string; isVisible: boolean }) => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/cms/footer-links/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ isVisible }),
      });
      if (!response.ok) throw new Error("Failed to update visibility");
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/cms/footer-links"] }),
  });

  // Toggle social visibility
  const toggleSocialVisibility = useMutation({
    mutationFn: async ({ id, isVisible }: { id: string; isVisible: boolean }) => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/cms/social-links/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ isVisible }),
      });
      if (!response.ok) throw new Error("Failed to update visibility");
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/cms/social-links"] }),
  });

  const footerLinks: FooterLink[] = linksData?.footerLinks || [];
  const socialLinks: SocialLink[] = socialData?.socialLinks || [];

  const openEditLinkDialog = (link: FooterLink) => {
    setEditingLink(link);
    linkForm.reset({
      section: link.section,
      label: link.label,
      href: link.href,
      sortOrder: link.sortOrder,
      isVisible: link.isVisible,
      openInNewTab: link.openInNewTab,
    });
    setIsLinkDialogOpen(true);
  };

  const openEditSocialDialog = (social: SocialLink) => {
    setEditingSocial(social);
    socialForm.reset({
      platform: social.platform,
      url: social.url,
      sortOrder: social.sortOrder,
      isVisible: social.isVisible,
    });
    setIsSocialDialogOpen(true);
  };

  const getSocialIcon = (platform: string) => {
    const found = SOCIAL_PLATFORMS.find(p => p.value === platform);
    return found ? <found.icon className="h-4 w-4" /> : null;
  };

  return (
    <AdminLayout title="Footer Settings" description="Manage your footer content, links, and social media">
      <div className="space-y-6">
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="links">Footer Links</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Footer Logo & Description
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Footer Logo URL</label>
                  <div className="flex gap-4">
                    {footerLogo && (
                      <div className="border rounded p-2 bg-primary">
                        <img src={footerLogo} alt="Footer logo" className="h-10 object-contain" />
                      </div>
                    )}
                    <Input
                      placeholder="Enter footer logo URL"
                      value={footerLogo}
                      onChange={(e) => setFooterLogo(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Footer Description</label>
                  <Textarea
                    placeholder="Enter a short description for the footer"
                    value={footerDescription}
                    onChange={(e) => setFooterDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      placeholder="contact@example.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                      placeholder="+1 234 567 890"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Address</label>
                  <Textarea
                    placeholder="Enter your address"
                    value={contactAddress}
                    onChange={(e) => setContactAddress(e.target.value)}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={() => saveConfigMutation.mutate([
                { key: 'footer_logo', value: footerLogo, type: 'image' },
                { key: 'footer_description', value: footerDescription, type: 'text' },
                { key: 'contact_email', value: contactEmail, type: 'text' },
                { key: 'contact_phone', value: contactPhone, type: 'text' },
                { key: 'contact_address', value: contactAddress, type: 'text' },
              ])}
              disabled={saveConfigMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {saveConfigMutation.isPending ? "Saving..." : "Save Footer Settings"}
            </Button>
          </TabsContent>

          {/* Footer Links Tab */}
          <TabsContent value="links" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Link2 className="h-5 w-5" />
                      Footer Links
                    </CardTitle>
                    <CardDescription>Manage links organized by sections</CardDescription>
                  </div>
                  <Button onClick={() => {
                    setEditingLink(null);
                    linkForm.reset();
                    setIsLinkDialogOpen(true);
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Link
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {linksLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading...</div>
                ) : (
                  <div className="space-y-6">
                    {FOOTER_SECTIONS.map((section) => {
                      const sectionLinks = footerLinks.filter(l => l.section === section.value);
                      return (
                        <div key={section.value} className="space-y-2">
                          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                            {section.label}
                          </h3>
                          {sectionLinks.length === 0 ? (
                            <p className="text-sm text-muted-foreground py-2">No links in this section</p>
                          ) : (
                            <div className="border rounded-lg divide-y">
                              {sectionLinks.sort((a, b) => a.sortOrder - b.sortOrder).map((link) => (
                                <div key={link.id} className="flex items-center gap-3 p-3">
                                  <div className="flex-1">
                                    <div className="font-medium">{link.label}</div>
                                    <div className="text-sm text-muted-foreground">{link.href}</div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {link.openInNewTab && <ExternalLink className="h-4 w-4 text-muted-foreground" />}
                                    <button onClick={() => toggleLinkVisibility.mutate({ id: link.id, isVisible: !link.isVisible })}>
                                      {link.isVisible ? <Eye className="h-4 w-4 text-green-600" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                                    </button>
                                    <Button variant="ghost" size="sm" onClick={() => openEditLinkDialog(link)}>Edit</Button>
                                    <Button variant="ghost" size="sm" onClick={() => deleteLinkMutation.mutate(link.id)}>
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Media Tab */}
          <TabsContent value="social" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Social Media Links</CardTitle>
                    <CardDescription>Manage your social media profiles</CardDescription>
                  </div>
                  <Button onClick={() => {
                    setEditingSocial(null);
                    socialForm.reset();
                    setIsSocialDialogOpen(true);
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Social Link
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {socialLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading...</div>
                ) : socialLinks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No social links yet. Click "Add Social Link" to create one.
                  </div>
                ) : (
                  <div className="border rounded-lg divide-y">
                    {socialLinks.sort((a, b) => a.sortOrder - b.sortOrder).map((social) => (
                      <div key={social.id} className="flex items-center gap-3 p-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          {getSocialIcon(social.platform)}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium capitalize">{social.platform}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-md">{social.url}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => toggleSocialVisibility.mutate({ id: social.id, isVisible: !social.isVisible })}>
                            {social.isVisible ? <Eye className="h-4 w-4 text-green-600" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                          </button>
                          <Button variant="ghost" size="sm" onClick={() => openEditSocialDialog(social)}>Edit</Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteSocialMutation.mutate(social.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Link Dialog */}
        <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingLink ? "Edit Footer Link" : "Add Footer Link"}</DialogTitle>
              <DialogDescription>
                {editingLink ? "Update the footer link details" : "Create a new footer link"}
              </DialogDescription>
            </DialogHeader>

            <Form {...linkForm}>
              <form onSubmit={linkForm.handleSubmit((data) => saveLinkMutation.mutate({ id: editingLink?.id, data }))} className="space-y-4">
                <FormField
                  control={linkForm.control}
                  name="section"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a section" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {FOOTER_SECTIONS.map((section) => (
                            <SelectItem key={section.value} value={section.value}>{section.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={linkForm.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Label</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Privacy Policy" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={linkForm.control}
                  name="href"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., /privacy-policy" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={linkForm.control}
                  name="sortOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sort Order</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <FormField
                    control={linkForm.control}
                    name="isVisible"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="!mt-0">Visible</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={linkForm.control}
                    name="openInNewTab"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="!mt-0">Open in New Tab</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsLinkDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={saveLinkMutation.isPending}>
                    {saveLinkMutation.isPending ? "Saving..." : "Save"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Social Link Dialog */}
        <Dialog open={isSocialDialogOpen} onOpenChange={setIsSocialDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSocial ? "Edit Social Link" : "Add Social Link"}</DialogTitle>
              <DialogDescription>
                {editingSocial ? "Update the social media link" : "Add a new social media profile"}
              </DialogDescription>
            </DialogHeader>

            <Form {...socialForm}>
              <form onSubmit={socialForm.handleSubmit((data) => saveSocialMutation.mutate({ id: editingSocial?.id, data }))} className="space-y-4">
                <FormField
                  control={socialForm.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SOCIAL_PLATFORMS.map((platform) => (
                            <SelectItem key={platform.value} value={platform.value}>
                              <div className="flex items-center gap-2">
                                <platform.icon className="h-4 w-4" />
                                {platform.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={socialForm.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://facebook.com/yourpage" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={socialForm.control}
                  name="sortOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sort Order</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={socialForm.control}
                  name="isVisible"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="!mt-0">Visible</FormLabel>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsSocialDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={saveSocialMutation.isPending}>
                    {saveSocialMutation.isPending ? "Saving..." : "Save"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
