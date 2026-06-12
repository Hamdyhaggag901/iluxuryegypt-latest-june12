import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import AdminLayout from "@/components/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { queryClient } from "@/lib/queryClient";
import {
  Search,
  Trash2,
  Download,
  Mail,
  FileText,
} from "lucide-react";

interface BrochureDownload {
  id: string;
  email: string;
  tourId: string | null;
  tourTitle: string | null;
  tourSlug: string | null;
  downloadedAt: string;
}

export default function AdminBrochureDownloads() {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDownload, setSelectedDownload] = useState<BrochureDownload | null>(null);
  const { toast } = useToast();

  const { data: downloadsData, isLoading } = useQuery<{ success: boolean; downloads: BrochureDownload[] }>({
    queryKey: ["/api/cms/brochure-downloads"],
    queryFn: async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No auth token");
      const res = await fetch("/api/cms/brochure-downloads", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`/api/cms/brochure-downloads/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/brochure-downloads"] });
      toast({ title: "Deleted", description: "Download record removed." });
      setDeleteDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete.", variant: "destructive" });
    }
  });

  const downloads = downloadsData?.downloads || [];

  const filteredDownloads = downloads.filter(d =>
    d.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.tourTitle && d.tourTitle.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const exportToCSV = () => {
    const headers = ["Email", "Tour", "Downloaded At"];
    const rows = filteredDownloads.map(d => [
      d.email,
      d.tourTitle || "N/A",
      formatDate(d.downloadedAt)
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `brochure-downloads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <AdminLayout
      title="Brochure Downloads"
      description="View emails captured from brochure downloads"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Downloads</p>
                <p className="text-3xl font-bold">{downloads.length}</p>
              </div>
              <Download className="h-8 w-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unique Emails</p>
                <p className="text-3xl font-bold">
                  {new Set(downloads.map(d => d.email.toLowerCase())).size}
                </p>
              </div>
              <Mail className="h-8 w-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-3xl font-bold">
                  {downloads.filter(d => {
                    const date = new Date(d.downloadedAt);
                    const now = new Date();
                    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Export */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by email or tour..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={exportToCSV}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : filteredDownloads.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {searchTerm ? "No downloads match your search." : "No brochure downloads yet."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Tour</TableHead>
                  <TableHead>Downloaded At</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDownloads.map((download) => (
                  <TableRow key={download.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${download.email}`} className="text-primary hover:underline">
                          {download.email}
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>
                      {download.tourTitle || <span className="text-muted-foreground">N/A</span>}
                    </TableCell>
                    <TableCell>{formatDate(download.downloadedAt)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedDownload(download);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Download Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this record? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedDownload && deleteMutation.mutate(selectedDownload.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
