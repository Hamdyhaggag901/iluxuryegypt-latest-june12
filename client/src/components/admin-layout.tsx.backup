import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutDashboard, 
  Image, 
  FileText, 
  MapPin, 
  Building, 
  Plane,
  Package,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Users,
  Grid3x3,
  Settings
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  count?: number;
}

export default function AdminLayout({ children, title, description }: AdminLayoutProps) {
  const [, setLocation] = useLocation();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("adminUser");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setLocation("/admin/login");
  };

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
    },
    {
      id: "hotels",
      label: "Hotels",
      icon: Building,
      href: "/admin/hotels",
    },
    {
      id: "tours",
      label: "Tours",
      icon: Plane,
      href: "/admin/tours",
    },
    {
      id: "categories",
      label: "Categories",
      icon: Grid3x3,
      href: "/admin/categories",
    },
    {
      id: "posts",
      label: "Blog Posts",
      icon: FileText,
      href: "/admin/posts",
    },
    {
      id: "media",
      label: "Media",
      icon: Image,
      href: "/admin/media",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/admin/settings",
    }
  ];

  const isActiveRoute = (href: string) => {
    if (href === "/admin") {
      return location === "/admin";
    }
    return location.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        transition-transform duration-300 ease-in-out 
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold text-gray-900">
                I.LuxuryEgypt
              </h1>
            </div>
            <button
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* User Info */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <Users className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {user?.username || 'Admin'}
                </p>
                <Badge variant="secondary" className="text-xs mt-1">
                  {user?.role || 'admin'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = isActiveRoute(item.href);
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setLocation(item.href);
                      setSidebarOpen(false);
                    }}
                    className={`
                      w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                    data-testid={`nav-${item.id}`}
                  >
                    <IconComponent className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.count && (
                      <Badge variant={isActive ? "default" : "secondary"} className="ml-2">
                        {item.count}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </nav>
          </ScrollArea>

          {/* Sidebar Footer */}
          <div className="px-3 py-4 border-t border-gray-200">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
              data-testid="sidebar-logout"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <button
                  className="lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-6 w-6" />
                </button>
                <div className="ml-4 lg:ml-0">
                  <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                  {description && (
                    <p className="text-sm text-gray-500">{description}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}