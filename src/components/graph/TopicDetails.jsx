import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Network, Target, Clock, ArrowRight } from "lucide-react";

export default function TopicDetails({ topic, resources, topics }) {
  if (!topic) {
    return (
      <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50">
        <CardContent className="text-center py-12 text-gray-500">
          <Network className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>Select a topic from the graph</p>
          <p className="text-sm">to see detailed information</p>
        </CardContent>
      </Card>
    );
  }

  const topicResources = resources.filter(resource => 
    resource.topic_ids?.includes(topic.id)
  );

  const relatedTopics = topic.related_topics?.map(id => 
    topics.find(t => t.id === id)
  ).filter(Boolean) || [];

  const categoryColors = {
    mathematics: "bg-blue-100 text-blue-800",
    science: "bg-green-100 text-green-800", 
    technology: "bg-purple-100 text-purple-800",
    language: "bg-orange-100 text-orange-800",
    social_studies: "bg-red-100 text-red-800",
    arts: "bg-pink-100 text-pink-800",
    practical_skills: "bg-gray-100 text-gray-800"
  };

  const difficultyColors = {
    beginner: "bg-green-100 text-green-800",
    intermediate: "bg-yellow-100 text-yellow-800",
    advanced: "bg-red-100 text-red-800"
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900">
          {topic.name}
        </CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge className={categoryColors[topic.category] || "bg-gray-100 text-gray-800"}>
            {topic.category?.replace(/_/g, ' ')}
          </Badge>
          <Badge className={difficultyColors[topic.difficulty_level]}>
            <Target className="w-3 h-3 mr-1" />
            {topic.difficulty_level}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
          <p className="text-gray-600 text-sm leading-relaxed">
            {topic.description}
          </p>
        </div>

        {topic.keywords && topic.keywords.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Keywords</h4>
            <div className="flex flex-wrap gap-1">
              {topic.keywords.map((keyword, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {relatedTopics.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Network className="w-4 h-4" />
              Related Topics
            </h4>
            <div className="space-y-1">
              {relatedTopics.map((relatedTopic) => (
                <div key={relatedTopic.id} className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                  • {relatedTopic.name}
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Learning Resources
          </h4>
          {topicResources.length > 0 ? (
            <div className="space-y-2">
              {topicResources.slice(0, 3).map((resource) => (
                <div key={resource.id} className="p-3 bg-white/60 rounded-lg border border-gray-200">
                  <h5 className="font-medium text-gray-900 text-sm mb-1">
                    {resource.title}
                  </h5>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Badge variant="outline" className="text-xs">
                      {resource.resource_type}
                    </Badge>
                    {resource.estimated_time_minutes && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {resource.estimated_time_minutes}m
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {topicResources.length > 3 && (
                <p className="text-xs text-gray-500 text-center">
                  +{topicResources.length - 3} more resources
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No resources available yet</p>
          )}
        </div>

        <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
          Start Learning
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}