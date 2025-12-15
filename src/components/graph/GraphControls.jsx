import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Network, Target } from "lucide-react";

export default function GraphControls({ topics, onTopicSelect }) {
  const categoryGroups = topics.reduce((groups, topic) => {
    const category = topic.category || 'other';
    if (!groups[category]) groups[category] = [];
    groups[category].push(topic);
    return groups;
  }, {});

  const categoryColors = {
    mathematics: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    science: "bg-green-100 text-green-800 hover:bg-green-200", 
    technology: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    language: "bg-orange-100 text-orange-800 hover:bg-orange-200",
    social_studies: "bg-red-100 text-red-800 hover:bg-red-200",
    arts: "bg-pink-100 text-pink-800 hover:bg-pink-200",
    practical_skills: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    other: "bg-slate-100 text-slate-800 hover:bg-slate-200"
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Network className="w-5 h-5 text-emerald-600" />
          Topic Browser
        </CardTitle>
      </CardHeader>
      <CardContent>
        {Object.keys(categoryGroups).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(categoryGroups).map(([category, categoryTopics]) => (
              <div key={category}>
                <h3 className="font-semibold text-gray-900 mb-3 capitalize">
                  {category.replace(/_/g, ' ')} ({categoryTopics.length})
                </h3>
                <div className="grid gap-2">
                  {categoryTopics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => onTopicSelect(topic)}
                      className={`p-3 rounded-lg border border-gray-200 text-left transition-all duration-200 hover:shadow-md ${
                        categoryColors[category] || categoryColors.other
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{topic.name}</h4>
                          <p className="text-sm opacity-80 line-clamp-2">
                            {topic.description}
                          </p>
                        </div>
                        <Badge variant="outline" className="ml-2 text-xs">
                          <Target className="w-3 h-3 mr-1" />
                          {topic.difficulty_level}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Network className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No topics found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}