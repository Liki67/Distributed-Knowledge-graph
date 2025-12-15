import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Network, Map, Clock, Target, Download, FileText, Play, PenTool, HelpCircle, Link } from "lucide-react";

export default function SearchResults({ results, allData, type }) {
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

  const categoryColors = {
    mathematics: "bg-blue-100 text-blue-800",
    science: "bg-green-100 text-green-800", 
    technology: "bg-purple-100 text-purple-800",
    language: "bg-orange-100 text-orange-800",
    social_studies: "bg-red-100 text-red-800",
    arts: "bg-pink-100 text-pink-800",
    practical_skills: "bg-gray-100 text-gray-800"
  };

  const renderResource = (resource) => {
    const ResourceIcon = resourceTypeIcons[resource.resource_type] || FileText;
    const resourceTopics = resource.topic_ids?.map(id => 
      allData.topics.find(t => t.id === id)
    ).filter(Boolean) || [];

    return (
      <Card key={resource.id} className="bg-white border-gray-200 hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg flex-shrink-0">
              <ResourceIcon className="w-5 h-5 text-emerald-600" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 mb-2">
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

              {resourceTopics.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
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
            </div>
            
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              View
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderTopic = (topic) => (
    <Card key={topic.id} className="bg-white border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-lg flex-shrink-0">
            <Network className="w-5 h-5 text-blue-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-2">
              {topic.name}
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              {topic.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge className={categoryColors[topic.category] || "bg-gray-100 text-gray-800"}>
                {topic.category?.replace(/_/g, ' ')}
              </Badge>
              <Badge className={difficultyColors[topic.difficulty_level]}>
                <Target className="w-3 h-3 mr-1" />
                {topic.difficulty_level}
              </Badge>
            </div>

            {topic.keywords && topic.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {topic.keywords.slice(0, 3).map((keyword, index) => (
                  <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {keyword}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <Button variant="outline">
            Explore
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderPath = (path) => (
    <Card key={path.id} className="bg-white border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-100 rounded-lg flex-shrink-0">
            <Map className="w-5 h-5 text-purple-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-2">
              {path.name}
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              {path.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge className={categoryColors[path.category] || "bg-gray-100 text-gray-800"}>
                {path.category?.replace(/_/g, ' ')}
              </Badge>
              <Badge className={difficultyColors[path.difficulty_level]}>
                {path.difficulty_level}
              </Badge>
              
              {path.estimated_duration_hours && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {path.estimated_duration_hours}h
                </Badge>
              )}
            </div>

            {path.target_audience && (
              <p className="text-xs text-gray-500">
                <strong>For:</strong> {path.target_audience}
              </p>
            )}
          </div>
          
          <Button className="bg-purple-600 hover:bg-purple-700">
            Start Path
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const getResultsToShow = () => {
    switch (type) {
      case "resources": return results.resources;
      case "topics": return results.topics;
      case "paths": return results.paths;
      default: return [
        ...results.resources.slice(0, 3),
        ...results.topics.slice(0, 3),
        ...results.paths.slice(0, 3)
      ];
    }
  };

  const resultsToShow = getResultsToShow();

  if (resultsToShow.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-2xl">🔍</span>
        </div>
        <p>No results found</p>
        <p className="text-sm">Try different keywords or browse by category</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {type === "all" && (
        <>
          {results.resources.slice(0, 3).map(renderResource)}
          {results.topics.slice(0, 3).map(renderTopic)}
          {results.paths.slice(0, 3).map(renderPath)}
        </>
      )}
      {type === "resources" && results.resources.map(renderResource)}
      {type === "topics" && results.topics.map(renderTopic)}
      {type === "paths" && results.paths.map(renderPath)}
    </div>
  );
}