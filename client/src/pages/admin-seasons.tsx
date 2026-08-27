import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Edit, Trash2, ArrowLeft, CalendarRange } from "lucide-react";
import { insertSeasonSchema, type Season } from "@shared/schema";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const seasonFormSchema = insertSeasonSchema.extend({
  pricingType: z.enum(["percentage", "flat"]),
  priceMultiplier: z.union([z.number(), z.string(), z.null()]).optional(),
  flatMarkup: z.union([z.number(), z.string(), z.null()]).optional(),
});
type SeasonFormData = z.infer<typeof seasonFormSchema>;

const defaultFormValues: SeasonFormData = {
  name: "",
  startMonth: 1,
  startDay: 1,
  endMonth: 1,
  endDay: 31,
  pricingType: "percentage",
  priceMultiplier: 120,
  flatMarkup: null,
  isActive: true,
  sortOrder: 0,
};

export default function AdminSeasons() {
  const [, setLocation] = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSeason, setEditingSeason] = useState<Season | null>(null);
  const { toast } = useToast();

  const form = useForm<SeasonFormData>({
    resolver: zodResolver(seasonFormSchema),
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const { data, isLoading } = useQuery<{ success: boolean; seasons: Season[] }>({
    queryKey: ["/api/cms/seasons"],
    queryFn: async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No auth token");

      const response = await fetch("/api/cms/seasons", {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
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

  const seasons = (data?.seasons || []).slice().sort((a, b) => a.sortOrder - b.sortOrder);

  const createMutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => apiRequest("POST", "/api/cms/seasons", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/seasons"] });
      toast({ title: "Success", description: "Season created successfully" });
      setIsDialogOpen(false);
      form.reset(defaultFormValues);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to create season", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
      apiRequest("PUT", `/api/cms/seasons/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/seasons"] });
      toast({ title: "Success", description: "Season updated successfully" });
      setIsDialogOpen(false);
      setEditingSeason(null);
      form.reset(defaultFormValues);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to update season", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => apiRequest("DELETE", `/api/cms/seasons/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/seasons"] });
      toast({ title: "Success", description: "Season deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to delete season", variant: "destructive" });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this season?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (season: Season) => {
    setEditingSeason(season);
    form.reset({
      name: season.name,
      startMonth: season.startMonth,
      startDay: season.startDay,
      endMonth: season.endMonth,
      endDay: season.endDay,
      pricingType: season.flatMarkup != null ? "flat" : "percentage",
      priceMultiplier: season.priceMultiplier ?? 120,
      flatMarkup: season.flatMarkup ?? null,
      isActive: season.isActive,
      sortOrder: season.sortOrder,
    });
    setIsDialogOpen(true);
  };

  const handleOpenDialog = () => {
    setEditingSeason(null);
    form.reset(defaultFormValues);
    setIsDialogOpen(true);
  };

  const onSubmit = (data: SeasonFormData) => {
    const payload = {
      name: data.name,
      startMonth: Number(data.startMonth),
      startDay: Number(data.startDay),
      endMonth: Number(data.endMonth),
      endDay: Number(data.endDay),
      priceMultiplier: data.pricingType === "percentage" ? Number(data.priceMultiplier) : null,
      flatMarkup: data.pricingType === "flat" ? Number(data.flatMarkup) : null,
      isActive: data.isActive,
      sortOrder: Number(data.sortOrder),
    };

    if (editingSeason) {
      updateMutation.mutate({ id: editingSeason.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const formatRange = (season: Season) =>
    `${MONTH_NAMES[season.startMonth - 1]} ${season.startDay} – ${MONTH_NAMES[season.endMonth - 1]} ${season.endDay}`;

  const formatRule = (season: Season) =>
    season.flatMarkup != null ? `+$${season.flatMarkup}` : `${season.priceMultiplier}% of base price`;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={() => setLocation("/admin")} className="mr-4" data-testid="button-back">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Seasons Management</h1>
                <p className="text-sm text-gray-500">Manage seasonal pricing rules used across all tours</p>
              </div>
            </div>
            <Button onClick={handleOpenDialog} data-testid="button-add-season">
              <Plus className="h-4 w-4 mr-2" />
              Add New Season
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-8">Loading seasons...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seasons.map((season) => (
              <Card key={season.id} className="hover:shadow-md transition-shadow" data-testid={`card-season-${season.id}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{season.name}</CardTitle>
                      <CardDescription>{formatRange(season)}</CardDescription>
                    </div>
                    <Badge variant={season.isActive ? "default" : "secondary"} data-testid={`badge-active-${season.id}`}>
                      {season.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Pricing Rule:</span>
                      <span className="font-medium" data-testid={`text-rule-${season.id}`}>{formatRule(season)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Sort Order:</span>
                      <span className="font-medium">{season.sortOrder}</span>
                    </div>
                    <div className="flex gap-2 pt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEdit(season)}
                        data-testid={`button-edit-${season.id}`}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDelete(season.id)}
                        data-testid={`button-delete-${season.id}`}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && seasons.length === 0 && (
          <div className="text-center py-12">
            <CalendarRange className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No seasons</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new season, e.g. "Peak Season – Winter Holidays".</p>
            <div className="mt-6">
              <Button onClick={handleOpenDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Season
              </Button>
            </div>
          </div>
        )}
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingSeason ? "Edit Season" : "Create New Season"}</DialogTitle>
            <DialogDescription>
              {editingSeason ? "Update the season details below" : "Applies to all tours automatically based on the base price"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Season Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Peak Season – Winter Holidays" {...field} data-testid="input-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <FormLabel>Start Date</FormLabel>
                  <div className="flex gap-2">
                    <FormField
                      control={form.control}
                      name="startMonth"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              type="number" min={1} max={12} placeholder="Month"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                              data-testid="input-start-month"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="startDay"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              type="number" min={1} max={31} placeholder="Day"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                              data-testid="input-start-day"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <FormLabel>End Date</FormLabel>
                  <div className="flex gap-2">
                    <FormField
                      control={form.control}
                      name="endMonth"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              type="number" min={1} max={12} placeholder="Month"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                              data-testid="input-end-month"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endDay"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              type="number" min={1} max={31} placeholder="Day"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                              data-testid="input-end-day"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground -mt-2">
                Month/day only (no year) — the season repeats every year. If the end date is earlier than the start date, it is treated as spanning into next year (e.g. Dec 15 → Jan 10).
              </p>

              <FormField
                control={form.control}
                name="pricingType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pricing Rule</FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex gap-6"
                        data-testid="radio-pricing-type"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="percentage" id="pricing-percentage" />
                          <FormLabel htmlFor="pricing-percentage" className="!mt-0 font-normal">Percentage</FormLabel>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="flat" id="pricing-flat" />
                          <FormLabel htmlFor="pricing-flat" className="!mt-0 font-normal">Flat Amount</FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("pricingType") === "percentage" ? (
                <FormField
                  control={form.control}
                  name="priceMultiplier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Percentage of Base Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number" placeholder="120"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value)}
                          data-testid="input-price-multiplier"
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">e.g. 120 = base price + 20%</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="flatMarkup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Flat Amount Added</FormLabel>
                      <FormControl>
                        <Input
                          type="number" placeholder="500"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value)}
                          data-testid="input-flat-markup"
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">Same currency as the tour, added to the base price</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="sortOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sort Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number" placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        data-testid="input-sort-order"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4"
                        data-testid="checkbox-active"
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">Active</FormLabel>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-submit"
                >
                  {editingSeason ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
