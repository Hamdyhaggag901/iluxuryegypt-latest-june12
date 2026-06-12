import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { FileText, MessageSquare, Image, Plus, Building, MapPin, Plane, Package, Grid3x3, Hotel, Compass } from "lucide-react";
import AdminLayout from "@/components/admin-layout";

interface DashboardStats {
  posts: number;
  media: number;
  categories: number;
  tours: number;
  hotels: number;
  destinations: number;
  inquiries: number;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/cms/stats"],
    queryFn: async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No auth token");

      try {
        // Fetch real data from ALL available endpoints
        const [
          postsRes,
          categoriesRes,
          mediaRes,
          toursRes,
          hotelsRes,
          destinationsRes
        ] = await Promise.all([
          fetch("/api/cms/posts", {
            headers: { "Authorization": `Bearer ${token}` }
          }),
          fetch("/api/cms/categories", {
            headers: { "Authorization": `Bearer ${token}` }
          }),
          fetch("/api/cms/media", {
            headers: { "Authorization": `Bearer ${token}` }
          }),
          fetch("/api/cms/tours", {
            headers: { "Authorization": `Bearer ${token}` }
          }),
          fetch("/api/cms/hotels", {
            headers: { "Authorization": `Bearer ${token}` }
          }),
          fetch("/api/cms/destinations", {
            headers: { "Authorization": `Bearer ${token}` }
          })
        ]);

        const postsData = postsRes.ok ? await postsRes.json() : { posts: [] };
        const categoriesData = categoriesRes.ok ? await categoriesRes.json() : { categories: [] };
        const mediaData = mediaRes.ok ? await mediaRes.json() : { media: [] };
        const toursData = toursRes.ok ? await toursRes.json() : { tours: [] };
        const hotelsData = hotelsRes.ok ? await hotelsRes.json() : { hotels: [] };
        const destinationsData = destinationsRes.ok ? await destinationsRes.json() : { destinations: [] };

        return {
          posts: postsData.posts?.length || 0,
          media: mediaData.media?.length || 0,
          categories: categoriesData.categories?.length || 0,
          tours: toursData.tours?.length || 0,
          hotels: hotelsData.hotels?.length || 0,
          destinations: destinationsData.destinations?.length || 0,
          inquiries: 0
        } as DashboardStats;
      } catch (error) {
        console.error("Error fetching stats:", error);
        // Return zero stats on error
        return {
          posts: 0,
          media: 0,
          categories: 0,
          tours: 0,
          hotels: 0,
          destinations: 0,
          inquiries: 0
        } as DashboardStats;
      }
    },
    enabled: !!localStorage.getItem("adminToken"),
    retry: 1,
    staleTime: 30000, // Cache for 30 seconds
  });

  const statsCards = [
    {
      title: "Blog Posts",
      value: stats?.posts || 0,
      description: "Published & draft posts",
      icon: FileText,
      color: "bg-green-500",
      href: "/admin/posts"
    },
    {
      title: "Tours & Packages",
      value: stats?.tours || 0,
      description: "Tour experiences",
      icon: Plane,
      color: "bg-blue-500",
      href: "/admin/tours"
    },
    {
      title: "Hotels",
      value: stats?.hotels || 0,
      description: "Luxury accommodations",
      icon: Hotel,
      color: "bg-orange-500",
      href: "/admin/hotels"
    },
    {
      title: "Destinations",
      value: stats?.destinations || 0,
      description: "Egyptian locations",
      icon: Compass,
      color: "bg-teal-500",
      href: "/admin/destinations"
    },
    {
      title: "Categories",
      value: stats?.categories || 0,
      description: "Experience categories",
      icon: Grid3x3,
      color: "bg-pink-500",
      href: "/admin/categories"
    },
    {
      title: "Media Files",
      value: stats?.media || 0,
      description: "Images & documents",
      icon: Image,
      color: "bg-purple-500",
      href: "/admin/media"
    }
  ];

  const quickActions = [
    { label: "New Blog Post", href: "/admin/posts", icon: Plus },
    { label: "New Tour", href: "/admin/tours/new", icon: Plus },
    { label: "Upload Media", href: "/admin/media", icon: Plus },
    { label: "New Hotel", href: "/admin/hotels", icon: Plus },
  ];

  return (
    <AdminLayout
      title="Dashboard"
      description="Overview of your travel website content and statistics"
    >
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back!
        </h2>
        <p className="text-gray-600">
          Manage your travel website content, blog posts, and customer inquiries from this central dashboard.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {statsCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.title}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setLocation(card.href)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <div className={`${card.color} p-2 rounded-lg`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : card.value}
                </div>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.label}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2"
                  onClick={() => setLocation(action.href)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity placeholder - can be enhanced later */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Current system information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Content Status</span>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Content Items</span>
              <span className="text-sm font-medium">
                {(stats?.posts || 0) + (stats?.tours || 0) + (stats?.hotels || 0) + (stats?.media || 0)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
