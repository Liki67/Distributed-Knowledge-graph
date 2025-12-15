import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Download, ExternalLink, FileText, Play, PenTool, HelpCircle, BookOpen, Link, Tag } from "lucide-react";

export default function ResourceDetails({ resource, topics, onClose }) {
  if (!resource) return null;

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
    <Dialog open={!!resource} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <ResourceIcon className="w-6 h-6 text-emerald-600" />
            </div>
            {resource.title}
          </DialogTitle>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge className="bg-blue-100 text-blue-800">
              {resource.resource_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
            <Badge className={difficultyColors[resource.difficulty_level]}>
              {resource.difficulty_level}
            </Badge>
            
            {resource.estimated_time_minutes && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {resource.estimated_time_minutes} minutes
              </Badge>
            )}
            
            {resource.offline_available && (
              <Badge variant="outline" className="flex items-center gap-1 text-green-700 border-green-200">
                <Download className="w-3 h-3" />
                Available Offline
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Content</h3>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {resource.content}
                </p>
              </div>
            </CardContent>
          </Card>

          {resourceTopics.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Related Topics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {resourceTopics.map((topic) => (
                  <Card key={topic.id} className="bg-white border-gray-200">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {topic.name}
                      </h4>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {topic.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {topic.category?.replace(/_/g, ' ')}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {topic.difficulty_level}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {resource.tags && resource.tags.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {resource.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-700">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {resource.source_url && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Original Source</h3>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-800 font-medium mb-1">External Resource</p>
                      <p className="text-blue-600 text-sm truncate max-w-md">
                        {resource.source_url}
                      </p>
                    </div>
                    <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <BookOpen className="w-4 h-4 mr-2" />
              Start Learning
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}