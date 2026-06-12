import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import AdminLayout from "@/components/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Search, Mail, Users, UserCheck, Trash2, ToggleLeft, ToggleRight, Download } from "lucide-react";

interface NewsletterSubscriber {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminNewsletter() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState<NewsletterSubscriber | null>(null);
  const { toast } = useToast();

  const { data: subscribersData, isLoading } = useQuery<{ success: boolean; subscribers: NewsletterSubscriber[] }>({
    queryKey: ["/api/cms/newsletter"],
    queryFn: async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No auth token");

      const response = await fetch("/api/cms/newsletter", {
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

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      return apiRequest("PUT", `/api/cms/newsletter/${id}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/newsletter"] });
      toast({
        title: "Success",
        description: "Subscriber status updated",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update subscriber",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/cms/newsletter/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/newsletter"] });
      toast({
        title: "Success",
        description: "Subscriber deleted",
      });
      setDeleteDialogOpen(false);
      setSubscriberToDelete(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete subscriber",
        variant: "destructive",
      });
    },
  });

  const subscribers = subscribersData?.subscribers || [];

  const filteredSubscribers = subscribers.filter((subscriber) =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = subscribers.filter((s) => s.isActive).length;

  const handleToggleStatus = (subscriber: NewsletterSubscriber) => {
    toggleStatusMutation.mutate({ id: subscriber.id, isActive: !subscriber.isActive });
  };

  const handleDeleteClick = (subscriber: NewsletterSubscriber) => {
    setSubscriberToDelete(subscriber);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (subscriberToDelete) {
      deleteMutation.mutate(subscriberToDelete.id);
    }
  };

  const handleExportCSV = () => {
    const csvContent = [
      ["Email", "Status", "Subscribed Date"].join(","),
      ...subscribers.map((s) => [
        s.email,
        s.isActive ? "Active" : "Inactive",
        new Date(s.createdAt).toLocaleDateString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();

    toast({
      title: "Export Complete",
      description: `Exported ${subscribers.length} subscribers to CSV`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AdminLayout title="Newsletter Subscribers" description="Manage newsletter subscriptions">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Subscribers</p>
                  <p className="text-2xl font-bold">{subscribers.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold">{activeCount}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Inactive</p>
                  <p className="text-2xl font-bold">{subscribers.length - activeCount}</p>
                </div>
                <Mail className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Export */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={handleExportCSV} variant="outline" disabled={subscribers.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Subscribers Table */}
        {isLoading ? (
          <div className="text-center py-8">Loading subscribers...</div>
        ) : subscribers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Mail className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No Subscribers</h3>
              <p className="mt-1 text-sm text-gray-500">
                Newsletter subscribers will appear here when visitors subscribe.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Subscribed</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell className="font-medium">{subscriber.email}</TableCell>
                      <TableCell>
                        <Badge variant={subscriber.isActive ? "default" : "secondary"}>
                          {subscriber.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(subscriber.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(subscriber)}
                            title={subscriber.isActive ? "Deactivate" : "Activate"}
                          >
                            {subscriber.isActive ? (
                              <ToggleRight className="h-4 w-4 text-green-600" />
                            ) : (
                              <ToggleLeft className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(subscriber)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {filteredSubscribers.length === 0 && subscribers.length > 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No subscribers found matching "{searchTerm}"
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Subscriber</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {subscriberToDelete?.email}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}
