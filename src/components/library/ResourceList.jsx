import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Download, ExternalLink, FileText, Play, PenTool, HelpCircle, BookOpen, Link } from "lucide-react";

export default function ResourceList({ resources, topics, onSelect }) {
  const resourceTypeIcons = {
    article: FileText,
    video_link: Play,
    exercise: PenTool,
    quiz: HelpCircle,
    tutorial: BookOpen,
    reference: Link
  };

  const difficultyColors = {
    beginner: "bg-green-100 text-green-800",
    intermediate: "bg-yellow-100 text-yellow-800",
    advanced: "bg-red-100 text-red-800"
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50">
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {resources.map((resource) => {
            const ResourceIcon = resourceTypeIcons[resource.resource_type] || FileText;
            const resourceTopics = resource.topic_ids?.map(id => 
              topics.find(t => t.id === id)
            ).filter(Boolean) || [];

            return (
              <div
                key={resource.id}
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onSelect(resource)}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-100 rounded-lg flex-shrink-0">
                    <ResourceIcon className="w-5 h-5 text-emerald-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {resource.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {resource.content}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <Badge className="bg-blue-100 text-blue-800">
                            {resource.resource_type.replace(/_/g, ' ')}
                          </Badge>
                          <Badge className={difficultyColors[resource.difficulty_level]}>
                            {resource.difficulty_level}
                          </Badge>
                          
                          {resource.estimated_time_minutes && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {resource.estimated_time_minutes}m
                            </Badge>
                          )}
                          
                          {resource.offline_available && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Download className="w-3 h-3" />
                              Offline
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {resourceTopics.slice(0, 3).map((topic) => (
                            <Badge key={topic.id} variant="outline" className="text-xs">
                              {topic.name}
                            </Badge>
                          ))}
                          {resourceTopics.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{resourceTopics.length - 3} more topics
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <Button className="ml-4 bg-emerald-600 hover:bg-emerald-700">
                        View Resource
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}