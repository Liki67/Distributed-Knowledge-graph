import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Network, Map, TrendingUp } from "lucide-react";

const statItems = [
  {
    title: "Topics Available",
    key: "totalTopics",
    icon: Network,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100"
  },
  {
    title: "Learning Resources",
    key: "totalResources", 
    icon: BookOpen,
    color: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  {
    title: "Learning Paths",
    key: "totalPaths",
    icon: Map,
    color: "text-purple-600", 
    bgColor: "bg-purple-100"
  },
  {
    title: "Your Progress",
    key: "userProgress",
    icon: TrendingUp,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    suffix: " topics"
  }
];

export default function QuickStats({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item) => (
        <Card key={item.title} className="bg-white/70 backdrop-blur-sm border-gray-200/50 hover:bg-white/80 transition-all duration-300 hover:shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                {item.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${item.bgColor}`}>
                <item.icon className={`w-4 h-4 ${item.color}`} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-gray-900">
              {stats[item.key]}{item.suffix || ""}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}