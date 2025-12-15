import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Download, ExternalLink, BookOpen, Play, PenTool, HelpCircle, FileText, Link } from "lucide-react";

export default function ResourceCard({ resource, topics, onSelect }) {
  const resourceTypeIcons = {
    article: FileText,
    video_link: Play,
    exercise: PenTool,
    quiz: HelpCircle,
    tutorial: BookOpen,
    reference: Link
  };

  const ResourceIcon = resourceTypeIcons[resource.resource_type] || FileText;

  const difficultyColors = {
    beginner: "bg-green-100 text-green-800",
    intermediate: "bg-yellow-100 text-yellow-800",
    advanced: "bg-red-100 text-red-800"
  };

  const resourceTopics = resource.topic_ids?.map(id => 
    topics.find(t => t.id === id)
  ).filter(Boolean) || [];

  return (
    <Card 
      className="bg-white/80 backdrop-blur-sm border-gray-200/50 hover:bg-white/90 hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={() => onSelect(resource)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <ResourceIcon className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors truncate">
                {resource.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={difficultyColors[resource.difficulty_level]}>
                  {resource.difficulty_level}
                </Badge>
                {resource.offline_available && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    Offline
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        <p className="text-gray-600 text-sm line-clamp-3">
          {resource.content}
        </p>
        
        {resource.estimated_time_minutes && (
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            {resource.estimated_time_minutes} minutes
          </div>
        )}

        {resourceTopics.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {resourceTopics.slice(0, 2).map((topic) => (
              <Badge key={topic.id} variant="outline" className="text-xs">
                {topic.name}
              </Badge>
            ))}
            {resourceTopics.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{resourceTopics.length - 2} more
              </Badge>
            )}
          </div>
        )}

        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {resource.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <Badge className="bg-blue-100 text-blue-800">
            {resource.resource_type.replace(/_/g, ' ')}
          </Badge>
          
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity">
            View Resource
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}