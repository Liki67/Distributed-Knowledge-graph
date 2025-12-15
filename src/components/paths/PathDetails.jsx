import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Map, Clock, Target, BookOpen, ArrowRight, CheckCircle } from "lucide-react";

export default function PathDetails({ path, topics, resources, onClose }) {
  if (!path) return null;

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
    <Dialog open={!!path} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Map className="w-6 h-6 text-emerald-600" />
            {path.name}
          </DialogTitle>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge className={categoryColors[path.category] || "bg-gray-100 text-gray-800"}>
              {path.category?.replace(/_/g, ' ')}
            </Badge>
            <Badge className={difficultyColors[path.difficulty_level]}>
              <Target className="w-3 h-3 mr-1" />
              {path.difficulty_level}
            </Badge>
            {path.estimated_duration_hours && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {path.estimated_duration_hours} hours
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600">{path.description}</p>
          </div>

          {path.target_audience && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Target Audience</h3>
              <p className="text-gray-600">{path.target_audience}</p>
            </div>
          )}

          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Learning Sequence ({path.sequence?.length || 0} steps)
            </h3>
            
            {path.sequence && path.sequence.length > 0 ? (
              <div className="space-y-4">
                {path.sequence.map((step, index) => {
                  const topic = topics.find(t => t.id === step.topic_id);
                  
                  return (
                    <Card key={index} className="bg-gradient-to-r from-white to-gray-50 border-l-4 border-l-emerald-500">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                            <span className="text-emerald-700 font-semibold text-sm">
                              {step.step}
                            </span>
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {topic ? topic.name : `Step ${step.step}`}
                            </h4>
                            <p className="text-gray-600 text-sm mb-2">
                              {step.description}
                            </p>
                            
                            {topic && (
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Badge variant="outline" className="text-xs">
                                  {topic.category?.replace(/_/g, ' ')}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {topic.difficulty_level}
                                </Badge>
                              </div>
                            )}
                          </div>
                          
                          <Button size="sm" variant="outline">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No learning steps defined yet
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <ArrowRight className="w-4 h-4 mr-2" />
              Start Learning Path
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}