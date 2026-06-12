
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AdminLayout from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Shield, Mail, Globe, User, Key, FileText, MessageCircle } from "lucide-react";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Schemas
const changeUsernameSchema = z.object({
  newUsername: z.string().min(3, "Username must be at least 3 characters"),
  currentPassword: z.string().min(1, "Current password is required"),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const siteInfoSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  siteTitle: z.string().min(1, "Site title is required"),
  faviconUrl: z.string().optional(),
  contactEmail: z.string().email("Valid email required"),
  contactPhone: z.string().min(1, "Phone number is required"),
  contactAddress: z.string().min(1, "Address is required"),
});

const emailSettingsSchema = z.object({
  inquiryNotificationEmail: z.string().email("Valid email required"),
});

const brochureSettingsSchema = z.object({
  brochureUrl: z.string().min(1, "Brochure URL is required"),
});

const whatsappSettingsSchema = z.object({
  whatsappNumber: z.string().min(1, "WhatsApp number is required"),
  whatsappEnabled: z.boolean().default(true),
});

export default function AdminSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeSection, setActiveSection] = useState<string>("username");

  // Fetch current settings
  const { data: settingsData } = useQuery({
    queryKey: ["/api/cms/settings"],
    queryFn: async () => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/cms/settings", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch settings");
      return response.json();
    },
  });

  // Change Username Form
  const usernameForm = useForm({
    resolver: zodResolver(changeUsernameSchema),
    defaultValues: {
      newUsername: "",
      currentPassword: "",
    },
  });

  const changeUsernameMutation = useMutation({
    mutationFn: async (data: z.infer<typeof changeUsernameSchema>) => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/cms/settings/change-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to change username");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Username updated successfully",
      });
      // Update local storage with new user data
      localStorage.setItem("adminUser", JSON.stringify(data.user));
      usernameForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Change Password Form
  const passwordForm = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: z.infer<typeof changePasswordSchema>) => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/cms/settings/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to change password");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Password updated successfully",
      });
      passwordForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Site Info Form
  const siteInfoForm = useForm({
    resolver: zodResolver(siteInfoSchema),
    defaultValues: {
      siteName: settingsData?.settings?.site_name || "I.LuxuryEgypt",
      siteTitle: settingsData?.settings?.site_title || "I.LuxuryEgypt - Bespoke Luxury Travel in Egypt",
      faviconUrl: settingsData?.settings?.favicon_url || "",
      contactEmail: settingsData?.settings?.contact_email || "info@i.luxuryegypt.com",
      contactPhone: settingsData?.settings?.contact_phone || "+20 xxx xxx xxxx",
      contactAddress: settingsData?.settings?.contact_address || "Cairo, Egypt",
    },
  });

  // Update site info form when settings data loads
  useEffect(() => {
    if (settingsData?.settings) {
      siteInfoForm.reset({
        siteName: settingsData.settings.site_name || "I.LuxuryEgypt",
        siteTitle: settingsData.settings.site_title || "I.LuxuryEgypt - Bespoke Luxury Travel in Egypt",
        faviconUrl: settingsData.settings.favicon_url || "",
        contactEmail: settingsData.settings.contact_email || "info@i.luxuryegypt.com",
        contactPhone: settingsData.settings.contact_phone || "+20 xxx xxx xxxx",
        contactAddress: settingsData.settings.contact_address || "Cairo, Egypt",
      });
    }
  }, [settingsData?.settings, siteInfoForm]);

  const updateSiteInfoMutation = useMutation({
    mutationFn: async (data: z.infer<typeof siteInfoSchema>) => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/cms/settings/site-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error("Failed to update site information");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/public/site-metadata"] });
      toast({
        title: "Success",
        description: "Site information updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Email Settings Form
  const emailForm = useForm({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: {
      inquiryNotificationEmail: settingsData?.settings?.inquiry_notification_email || "inquiries@i.luxuryegypt.com",
    },
  });

  const updateEmailMutation = useMutation({
    mutationFn: async (data: z.infer<typeof emailSettingsSchema>) => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/cms/settings/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update email settings");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Email settings updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Brochure Settings Form
  const brochureForm = useForm({
    resolver: zodResolver(brochureSettingsSchema),
    defaultValues: {
      brochureUrl: settingsData?.settings?.brochure_url || "",
    },
  });

  const updateBrochureMutation = useMutation({
    mutationFn: async (data: z.infer<typeof brochureSettingsSchema>) => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/cms/settings/brochure", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update brochure settings");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Brochure URL updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // WhatsApp Settings Form
  const whatsappForm = useForm({
    resolver: zodResolver(whatsappSettingsSchema),
    defaultValues: {
      whatsappNumber: settingsData?.settings?.whatsapp_number || "",
      whatsappEnabled: settingsData?.settings?.whatsapp_enabled === "true",
    },
  });

  // Update form when settings data loads
  useEffect(() => {
    if (settingsData?.settings) {
      whatsappForm.reset({
        whatsappNumber: settingsData.settings.whatsapp_number || "",
        whatsappEnabled: settingsData.settings.whatsapp_enabled === "true",
      });
    }
  }, [settingsData?.settings, whatsappForm]);

  const updateWhatsappMutation = useMutation({
    mutationFn: async (data: z.infer<typeof whatsappSettingsSchema>) => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/cms/settings/whatsapp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update WhatsApp settings");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/public/whatsapp-settings"] });
      toast({
        title: "Success",
        description: "WhatsApp settings updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AdminLayout
      title="Settings"
      description="Manage your account and website settings"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Settings Menu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant={activeSection === "username" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveSection("username")}
            >
              <User className="h-4 w-4 mr-2" />
              Change Username
            </Button>
            <Button
              variant={activeSection === "password" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveSection("password")}
            >
              <Key className="h-4 w-4 mr-2" />
              Change Password
            </Button>
            <Button
              variant={activeSection === "site-info" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveSection("site-info")}
            >
              <Globe className="h-4 w-4 mr-2" />
              Site Information
            </Button>
            <Button
              variant={activeSection === "email" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveSection("email")}
            >
              <Mail className="h-4 w-4 mr-2" />
              Email Settings
            </Button>
            <Button
              variant={activeSection === "brochure" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveSection("brochure")}
            >
              <FileText className="h-4 w-4 mr-2" />
              Brochure
            </Button>
            <Button
              variant={activeSection === "whatsapp" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveSection("whatsapp")}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Change Username */}
          {activeSection === "username" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Change Username
                </CardTitle>
                <CardDescription>
                  Update your admin dashboard username
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...usernameForm}>
                  <form onSubmit={usernameForm.handleSubmit((data) => changeUsernameMutation.mutate(data))} className="space-y-4">
                    <FormField
                      control={usernameForm.control}
                      name="newUsername"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter new username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={usernameForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Enter current password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={changeUsernameMutation.isPending}>
                      {changeUsernameMutation.isPending ? "Updating..." : "Update Username"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Change Password */}
          {activeSection === "password" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="h-5 w-5 mr-2" />
                  Change Password
                </CardTitle>
                <CardDescription>
                  Update your password for enhanced security
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit((data) => changePasswordMutation.mutate(data))} className="space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Enter current password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Enter new password (min 6 characters)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Confirm new password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={changePasswordMutation.isPending}>
                      {changePasswordMutation.isPending ? "Updating..." : "Update Password"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Site Information */}
          {activeSection === "site-info" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Site Information
                </CardTitle>
                <CardDescription>
                  Update basic contact information and browser tab settings for your website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...siteInfoForm}>
                  <form onSubmit={siteInfoForm.handleSubmit((data) => updateSiteInfoMutation.mutate(data))} className="space-y-4">
                    <div className="rounded-lg border p-4 space-y-4 bg-muted/30">
                      <h3 className="font-semibold text-sm">Browser Tab Settings</h3>
                      <FormField
                        control={siteInfoForm.control}
                        name="siteTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Site Title (Browser Tab)</FormLabel>
                            <FormControl>
                              <Input placeholder="I.LuxuryEgypt - Bespoke Luxury Travel in Egypt" {...field} />
                            </FormControl>
                            <FormMessage />
                            <p className="text-sm text-muted-foreground">
                              This text appears in the browser tab and search results
                            </p>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={siteInfoForm.control}
                        name="faviconUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Favicon URL</FormLabel>
                            <FormControl>
                              <Input placeholder="/api/assets/uploads/favicon.ico or https://..." {...field} />
                            </FormControl>
                            <FormMessage />
                            <p className="text-sm text-muted-foreground">
                              The small icon shown in the browser tab. Upload an image in Media section first, then paste the URL here. Recommended size: 32x32 or 64x64 pixels.
                            </p>
                          </FormItem>
                        )}
                      />
                    </div>
                    <Separator />
                    <FormField
                      control={siteInfoForm.control}
                      name="siteName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site Name</FormLabel>
                          <FormControl>
                            <Input placeholder="I.LuxuryEgypt" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={siteInfoForm.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="info@i.luxuryegypt.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={siteInfoForm.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="+20 xxx xxx xxxx" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={siteInfoForm.control}
                      name="contactAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Cairo, Egypt" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={updateSiteInfoMutation.isPending}>
                      {updateSiteInfoMutation.isPending ? "Updating..." : "Update Site Information"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Email Settings */}
          {activeSection === "email" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Email Settings
                </CardTitle>
                <CardDescription>
                  Configure email notifications for inquiries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...emailForm}>
                  <form onSubmit={emailForm.handleSubmit((data) => updateEmailMutation.mutate(data))} className="space-y-4">
                    <FormField
                      control={emailForm.control}
                      name="inquiryNotificationEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Inquiry Notification Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="inquiries@i.luxuryegypt.com" {...field} />
                          </FormControl>
                          <FormMessage />
                          <p className="text-sm text-muted-foreground">
                            New inquiry submissions will be sent to this email address
                          </p>
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={updateEmailMutation.isPending}>
                      {updateEmailMutation.isPending ? "Updating..." : "Update Email Settings"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Brochure Settings */}
          {activeSection === "brochure" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Brochure Settings
                </CardTitle>
                <CardDescription>
                  Set the URL for the downloadable brochure shown on tour pages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...brochureForm}>
                  <form onSubmit={brochureForm.handleSubmit((data) => updateBrochureMutation.mutate(data))} className="space-y-4">
                    <FormField
                      control={brochureForm.control}
                      name="brochureUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brochure URL</FormLabel>
                          <FormControl>
                            <Input placeholder="/api/assets/uploads/brochure.pdf or https://..." {...field} />
                          </FormControl>
                          <FormMessage />
                          <p className="text-sm text-muted-foreground">
                            Enter the URL of your PDF brochure. You can upload the PDF in the Media section first, then copy the URL here.
                          </p>
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={updateBrochureMutation.isPending}>
                      {updateBrochureMutation.isPending ? "Updating..." : "Update Brochure URL"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* WhatsApp Settings */}
          {activeSection === "whatsapp" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  WhatsApp Settings
                </CardTitle>
                <CardDescription>
                  Configure the floating WhatsApp button that appears on all pages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...whatsappForm}>
                  <form onSubmit={whatsappForm.handleSubmit((data) => updateWhatsappMutation.mutate(data))} className="space-y-6">
                    <FormField
                      control={whatsappForm.control}
                      name="whatsappEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Enable WhatsApp Button</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Show or hide the floating WhatsApp button on your website
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={whatsappForm.control}
                      name="whatsappNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>WhatsApp Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+20 123 456 7890" {...field} />
                          </FormControl>
                          <FormMessage />
                          <p className="text-sm text-muted-foreground">
                            Enter the phone number with country code (e.g., +20 for Egypt). The number will be used to open WhatsApp chat.
                          </p>
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={updateWhatsappMutation.isPending}>
                      {updateWhatsappMutation.isPending ? "Updating..." : "Save WhatsApp Settings"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
