import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AdminLayout from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Edit, Trash2, Search, HelpCircle, GripVertical, Eye, EyeOff } from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  sortOrder: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

const faqFormSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  category: z.string().optional(),
  sortOrder: z.number().default(0),
  isVisible: z.boolean().default(true),
});

type FaqFormData = z.infer<typeof faqFormSchema>;

export default function AdminFAQ() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const { toast } = useToast();

  const form = useForm<FaqFormData>({
    resolver: zodResolver(faqFormSchema),
    defaultValues: {
      question: "",
      answer: "",
      category: "",
      sortOrder: 0,
      isVisible: true,
    },
  });

  const { data: faqsData, isLoading } = useQuery<{ success: boolean; faqs: FAQ[] }>({
    queryKey: ["/api/cms/faqs"],
    queryFn: async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No auth token");

      const response = await fetch("/api/cms/faqs", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminUser");
          setLocation("/admin/login");
          throw new Error("Session expired");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    enabled: !!localStorage.getItem("adminToken"),
  });

  const createFaqMutation = useMutation({
    mutationFn: async (data: FaqFormData) => {
      return apiRequest("POST", "/api/cms/faqs", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/faqs"] });
      toast({
        title: "Success",
        description: "FAQ created successfully",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create FAQ",
        variant: "destructive",
      });
    },
  });

  const updateFaqMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<FaqFormData> }) => {
      return apiRequest("PUT", `/api/cms/faqs/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/faqs"] });
      toast({
        title: "Success",
        description: "FAQ updated successfully",
      });
      setIsDialogOpen(false);
      setEditingFaq(null);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update FAQ",
        variant: "destructive",
      });
    },
  });

  const deleteFaqMutation = useMutation({
    mutationFn: async (faqId: string) => {
      return apiRequest("DELETE", `/api/cms/faqs/${faqId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/faqs"] });
      toast({
        title: "Success",
        description: "FAQ deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete FAQ",
        variant: "destructive",
      });
    },
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ id, isVisible }: { id: string; isVisible: boolean }) => {
      return apiRequest("PUT", `/api/cms/faqs/${id}`, { isVisible });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/faqs"] });
      toast({
        title: "Success",
        description: "FAQ visibility updated",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update FAQ",
        variant: "destructive",
      });
    },
  });

  const faqs = faqsData?.faqs || [];

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (faq.category && faq.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Group FAQs by category
  const groupedFaqs = filteredFaqs.reduce((acc, faq) => {
    const category = faq.category || "General";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(faq);
    return acc;
  }, {} as Record<string, FAQ[]>);

  const categories = Object.keys(groupedFaqs).sort();

  const handleDeleteFaq = (faqId: string) => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      deleteFaqMutation.mutate(faqId);
    }
  };

  const handleEditFaq = (faq: FAQ) => {
    setEditingFaq(faq);
    form.reset({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || "",
      sortOrder: faq.sortOrder,
      isVisible: faq.isVisible,
    });
    setIsDialogOpen(true);
  };

  const handleOpenDialog = () => {
    setEditingFaq(null);
    form.reset({
      question: "",
      answer: "",
      category: "",
      sortOrder: faqs.length,
      isVisible: true,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (data: FaqFormData) => {
    if (editingFaq) {
      updateFaqMutation.mutate({ id: editingFaq.id, data });
    } else {
      createFaqMutation.mutate(data);
    }
  };

  const handleToggleVisibility = (faq: FAQ) => {
    toggleVisibilityMutation.mutate({ id: faq.id, isVisible: !faq.isVisible });
  };

  // Get unique categories for suggestions
  const existingCategories = [...new Set(faqs.map(f => f.category).filter(Boolean))];

  return (
    <AdminLayout title="FAQ Management" description="Manage frequently asked questions">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search FAQs by question, answer, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={handleOpenDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add New FAQ
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total FAQs</p>
                  <p className="text-2xl font-bold">{faqs.length}</p>
                </div>
                <HelpCircle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Visible</p>
                  <p className="text-2xl font-bold">{faqs.filter(f => f.isVisible).length}</p>
                </div>
                <Eye className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Categories</p>
                  <p className="text-2xl font-bold">{existingCategories.length || 1}</p>
                </div>
                <GripVertical className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ List */}
        {isLoading ? (
          <div className="text-center py-8">Loading FAQs...</div>
        ) : faqs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <HelpCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No FAQs</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new FAQ.</p>
              <div className="mt-6">
                <Button onClick={handleOpenDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New FAQ
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {categories.map((category) => (
              <div key={category}>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Badge variant="outline" className="mr-2">{category}</Badge>
                  <span className="text-sm text-gray-500 font-normal">
                    ({groupedFaqs[category].length} {groupedFaqs[category].length === 1 ? "item" : "items"})
                  </span>
                </h2>
                <div className="space-y-4">
                  {groupedFaqs[category]
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                    .map((faq) => (
                    <Card key={faq.id} className={`transition-all ${!faq.isVisible ? "opacity-60" : ""}`}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-base font-medium flex items-center gap-2">
                              {faq.question}
                              {!faq.isVisible && (
                                <Badge variant="secondary" className="text-xs">
                                  <EyeOff className="h-3 w-3 mr-1" />
                                  Hidden
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription className="text-xs mt-1">
                              Sort Order: {faq.sortOrder}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleVisibility(faq)}
                              title={faq.isVisible ? "Hide FAQ" : "Show FAQ"}
                            >
                              {faq.isVisible ? (
                                <Eye className="h-4 w-4 text-green-600" />
                              ) : (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditFaq(faq)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteFaq(faq.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-3">
                          {faq.answer}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingFaq ? "Edit FAQ" : "Create New FAQ"}</DialogTitle>
              <DialogDescription>
                {editingFaq ? "Update the FAQ details below" : "Fill in the details to create a new FAQ"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., What is included in the tour package?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="answer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Answer</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide a detailed answer to the question..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Booking, Payment, Tours"
                          {...field}
                          list="category-suggestions"
                        />
                      </FormControl>
                      <datalist id="category-suggestions">
                        {existingCategories.map((cat) => (
                          <option key={cat} value={cat!} />
                        ))}
                      </datalist>
                      <FormDescription>
                        Use categories to group related FAQs together
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sortOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sort Order</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Lower numbers appear first within their category
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isVisible"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Visible</FormLabel>
                        <FormDescription>
                          Show this FAQ on the public FAQ page
                        </FormDescription>
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
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createFaqMutation.isPending || updateFaqMutation.isPending}
                  >
                    {createFaqMutation.isPending || updateFaqMutation.isPending
                      ? "Saving..."
                      : editingFaq ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
