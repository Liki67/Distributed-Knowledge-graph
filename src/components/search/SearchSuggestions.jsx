import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, BookOpen, Network, Map } from "lucide-react";

export default function SearchSuggestions({ onSearchClick, allData }) {
  const popularTopics = allData.topics?.slice(0, 3) || [];
  const recentResources = allData.resources?.slice(0, 2) || [];
  
  const suggestions = [
    "Introduction to sustainable farming",
    "Basic financial literacy",
    "How does a water pump work?",
    "Learning English for beginners"
  ];

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-amber-500" />
          Not sure where to start?
        </CardTitle>
        <p className="text-gray-600">Here are some ideas and popular content to explore.</p>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Popular Search Ideas</h3>
          <div className="space-y-2">
            {suggestions.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => onSearchClick(suggestion)}
                className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors text-gray-700"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Network className="w-5 h-5 text-blue-500" />
            Popular Topics
          </h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {popularTopics.map((topic) => (
              <Badge
                key={topic.id}
                variant="outline"
                className="cursor-pointer hover:bg-gray-100 p-2 text-sm"
                onClick={() => onSearchClick(topic.name)}
              >
                {topic.name}
              </Badge>
            ))}
          </div>

          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-500" />
            Recently Added Resources
          </h3>
          <div className="space-y-2">
            {recentResources.map((resource) => (
              <button
                key={resource.id}
                onClick={() => onSearchClick(resource.title)}
                className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-colors text-gray-700 text-sm"
              >
                {resource.title}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}