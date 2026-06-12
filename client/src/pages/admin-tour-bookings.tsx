import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import AdminLayout from "@/components/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Search,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  Download,
  DollarSign,
  Mail,
  Phone,
  User,
  MapPin
} from "lucide-react";

interface TourBooking {
  id: string;
  tourId: string | null;
  tourTitle: string;
  tourSlug: string | null;
  tourPrice: number | null;
  tourDuration: string | null;
  fullName: string;
  email: string;
  phone: string | null;
  preferredDates: string | null;
  numberOfGuests: number | null;
  specialRequests: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
};

export default function AdminTourBookings() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<TourBooking | null>(null);
  const { toast } = useToast();

  const { data: bookingsData, isLoading } = useQuery<{ success: boolean; bookings: TourBooking[] }>({
    queryKey: ["/api/cms/tour-bookings"],
    queryFn: async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No auth token");

      const response = await fetch("/api/cms/tour-bookings", {
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

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return apiRequest("PUT", `/api/cms/tour-bookings/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/tour-bookings"] });
      toast({
        title: "Success",
        description: "Booking status updated",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update booking",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/cms/tour-bookings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/tour-bookings"] });
      toast({
        title: "Success",
        description: "Booking deleted",
      });
      setDeleteDialogOpen(false);
      setSelectedBooking(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete booking",
        variant: "destructive",
      });
    },
  });

  const bookings = bookingsData?.bookings || [];

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.tourTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;
  const completedCount = bookings.filter((b) => b.status === "completed").length;

  const handleStatusChange = (booking: TourBooking, newStatus: string) => {
    updateStatusMutation.mutate({ id: booking.id, status: newStatus });
  };

  const handleViewDetails = (booking: TourBooking) => {
    setSelectedBooking(booking);
    setDetailDialogOpen(true);
  };

  const handleDeleteClick = (booking: TourBooking) => {
    setSelectedBooking(booking);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedBooking) {
      deleteMutation.mutate(selectedBooking.id);
    }
  };

  const handleExportCSV = () => {
    const csvContent = [
      ["Tour", "Customer", "Email", "Phone", "Dates", "Guests", "Status", "Submitted"].join(","),
      ...bookings.map((b) => [
        `"${b.tourTitle}"`,
        `"${b.fullName}"`,
        b.email,
        b.phone || "",
        `"${b.preferredDates || ""}"`,
        b.numberOfGuests || "",
        b.status,
        new Date(b.createdAt).toLocaleDateString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `tour-bookings-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();

    toast({
      title: "Export Complete",
      description: `Exported ${bookings.length} bookings to CSV`,
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

  const formatPrice = (price: number | null) => {
    if (!price) return "N/A";
    return `$${price.toLocaleString()}`;
  };

  return (
    <AdminLayout title="Tour Submissions" description="Manage tour booking requests">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                  <p className="text-2xl font-bold">{bookings.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Confirmed</p>
                  <p className="text-2xl font-bold">{confirmedCount}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{completedCount}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, email, or tour..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleExportCSV} variant="outline" disabled={bookings.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Bookings Table */}
        {isLoading ? (
          <div className="text-center py-8">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No Bookings</h3>
              <p className="mt-1 text-sm text-gray-500">
                Tour booking submissions will appear here when visitors submit booking requests.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tour</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Guests</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium truncate max-w-[200px]">{booking.tourTitle}</p>
                          {booking.tourPrice && (
                            <p className="text-sm text-muted-foreground">{formatPrice(booking.tourPrice)}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{booking.fullName}</p>
                          <p className="text-sm text-muted-foreground">{booking.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {booking.preferredDates || "Not specified"}
                      </TableCell>
                      <TableCell>
                        {booking.numberOfGuests ? (
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {booking.numberOfGuests}
                          </span>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={booking.status}
                          onValueChange={(value) => handleStatusChange(booking, value)}
                        >
                          <SelectTrigger className="w-[130px]">
                            <Badge className={statusColors[booking.status] || "bg-gray-100 text-gray-800"}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(booking.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(booking)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(booking)}
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

        {filteredBookings.length === 0 && bookings.length > 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No bookings found matching your search criteria
          </div>
        )}

        {/* Detail Dialog */}
        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
              <DialogDescription>
                Full details for this tour booking request
              </DialogDescription>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-6 overflow-y-auto pr-2">
                {/* Tour Info */}
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Tour Information
                  </h4>
                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <p><strong>Tour:</strong> {selectedBooking.tourTitle}</p>
                    {selectedBooking.tourPrice && (
                      <p><strong>Price:</strong> {formatPrice(selectedBooking.tourPrice)}</p>
                    )}
                    {selectedBooking.tourDuration && (
                      <p><strong>Duration:</strong> {selectedBooking.tourDuration}</p>
                    )}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Customer Information
                  </h4>
                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <p className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {selectedBooking.fullName}
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${selectedBooking.email}`} className="text-blue-600 hover:underline">
                        {selectedBooking.email}
                      </a>
                    </p>
                    {selectedBooking.phone && (
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a href={`tel:${selectedBooking.phone}`} className="text-blue-600 hover:underline">
                          {selectedBooking.phone}
                        </a>
                      </p>
                    )}
                  </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Booking Details
                  </h4>
                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <p><strong>Preferred Dates:</strong> {selectedBooking.preferredDates || "Not specified"}</p>
                    <p><strong>Number of Guests:</strong> {selectedBooking.numberOfGuests || "Not specified"}</p>
                    <p><strong>Status:</strong>
                      <Badge className={`ml-2 ${statusColors[selectedBooking.status] || ""}`}>
                        {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                      </Badge>
                    </p>
                    <p><strong>Submitted:</strong> {formatDate(selectedBooking.createdAt)}</p>
                  </div>
                </div>

                {/* Special Requests */}
                {selectedBooking.specialRequests && (
                  <div className="space-y-3">
                    <h4 className="font-semibold">Special Requests</h4>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="whitespace-pre-wrap">{selectedBooking.specialRequests}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Booking</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the booking from {selectedBooking?.fullName} for "{selectedBooking?.tourTitle}"? This action cannot be undone.
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
