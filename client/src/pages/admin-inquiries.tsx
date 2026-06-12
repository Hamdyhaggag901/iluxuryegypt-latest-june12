
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { MessageSquare, Search, ArrowLeft, Mail, Phone, Calendar } from "lucide-react";

interface Inquiry {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  destination: string;
  preferredDates: string;
  groupSize: number;
  accommodationType: string;
  budget: string;
  specialRequests?: string;
  createdAt: string;
}

export default function AdminInquiries() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const { data: inquiries, isLoading, error } = useQuery({
    queryKey: ["/api/inquiries"],
    queryFn: async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No auth token");
      
      const response = await fetch("/api/inquiries", {
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
    retry: (failureCount, error: any) => {
      if (error?.message === "Session expired") return false;
      return failureCount < 2;
    }
  });

  const filteredInquiries = inquiries?.inquiries?.filter((inquiry: Inquiry) =>
    inquiry.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.destination.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/admin")}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Travel Inquiries</h1>
                <p className="text-sm text-gray-500">Manage customer inquiries</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search inquiries by name, email, or destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Inquiries List */}
        {isLoading ? (
          <div className="text-center py-8">Loading inquiries...</div>
        ) : (
          <div className="space-y-4">
            {filteredInquiries.map((inquiry: Inquiry) => (
              <Card key={inquiry.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{inquiry.fullName}</CardTitle>
                      <CardDescription>
                        {inquiry.destination} • {inquiry.groupSize} guests
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{inquiry.email}</span>
                      </div>
                      {inquiry.phone && (
                        <div className="flex items-center text-sm">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{inquiry.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{inquiry.preferredDates}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Accommodation:</span> {inquiry.accommodationType}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Budget:</span> {inquiry.budget}
                      </div>
                    </div>
                  </div>
                  {inquiry.specialRequests && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-medium text-sm mb-2">Special Requests:</h4>
                      <p className="text-sm text-gray-600">{inquiry.specialRequests}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredInquiries.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No inquiries found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? "Try adjusting your search terms." : "No travel inquiries have been submitted yet."}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
