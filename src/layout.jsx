
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Network, 
  BookOpen, 
  TrendingUp, 
  Search, 
  Map,
  Menu,
  X
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: TrendingUp,
    description: "Your learning overview"
  },
  {
    title: "Knowledge Graph",
    url: "/knowledge-graph",
    icon: Network,
    description: "Explore topic connections"
  },
  {
    title: "Learning Paths",
    url: "/learning-paths",
    icon: Map,
    description: "Guided learning sequences"
  },
  {
    title: "Content Library",
    url: "/content-library",
    icon: BookOpen,
    description: "Browse all resources"
  },
  {
    title: "Search",
    url: "/search",
    icon: Search,
    description: "Find learning materials"
  }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-50">
      <style>{`
        :root {
          --primary: #0f766e;
          --primary-light: #14b8a6;
          --accent: #1e40af;
          --accent-light: #3b82f6;
          --success: #059669;
          --background: #f8fafc;
          --card: #ffffff;
          --border: #e2e8f0;
          --muted: #64748b;
        }
      `}</style>

      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <Sidebar className="border-r border-emerald-100/50 bg-white/95 backdrop-blur-sm">
            <SidebarHeader className="border-b border-emerald-100/50 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Network className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-lg">EduGraph</h2>
                  <p className="text-xs text-gray-600">Rural Knowledge Network</p>
                </div>
              </div>
            </SidebarHeader>
            
            <SidebarContent className="p-4">
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                  Learning Hub
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-1">
                    {navigationItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`rounded-xl transition-all duration-200 px-4 py-3 ${
                            location.pathname === item.url 
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md' 
                              : 'hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3">
                            <item.icon className="w-5 h-5" />
                            <div className="flex-1">
                              <span className="font-medium">{item.title}</span>
                              <p className="text-xs opacity-75 mt-0.5">{item.description}</p>
                            </div>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup className="mt-8">
                <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                  Quick Stats
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="px-3 py-2 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Topics Explored</span>
                      <span className="font-semibold text-emerald-600">0</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Learning Hours</span>
                      <span className="font-semibold text-blue-600">0h</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Paths Completed</span>
                      <span className="font-semibold text-purple-600">0</span>
                    </div>
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-emerald-100/50 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                  S
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">Student</p>
                  <p className="text-xs text-gray-500">Building knowledge</p>
                </div>
              </div>
            </SidebarFooter>
          </Sidebar>

          <main className="flex-1 flex flex-col">
            {/* Mobile header */}
            <header className="bg-white/95 backdrop-blur-sm border-b border-emerald-100/50 px-6 py-4 md:hidden">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="hover:bg-emerald-50 p-2 rounded-lg transition-colors duration-200" />
                <div className="flex items-center gap-2">
                  <Network className="w-6 h-6 text-emerald-600" />
                  <h1 className="text-xl font-bold text-gray-900">EduGraph</h1>
                </div>
              </div>
            </header>

            {/* Main content area */}
            <div className="flex-1 overflow-auto">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
