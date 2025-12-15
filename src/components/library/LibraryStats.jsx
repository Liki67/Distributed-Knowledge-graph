import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Clock, Download, Target } from "lucide-react";

export default function LibraryStats({ resources }) {
  const stats = {
    total: resources.length,
    totalHours: Math.round(resources.reduce((sum, r) => sum + (r.estimated_time_minutes || 0), 0) / 60),
    offlineAvailable: resources.filter(r => r.offline_available).length,
    resourceTypes: [...new Set(resources.map(r => r.resource_type))].length
  };

  const statItems = [
    {
      title: "Total Resources",
      value: stats.total,
      icon: BookOpen,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100"
    },
    {
      title: "Learning Hours",
      value: `${stats.totalHours}h`,
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Offline Ready",
      value: stats.offlineAvailable,
      icon: Download,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Resource Types",
      value: stats.resourceTypes,
      icon: Target,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((item) => (
        <Card key={item.title} className="bg-white/70 backdrop-blur-sm border-gray-200/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {item.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {item.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${item.bgColor}`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}