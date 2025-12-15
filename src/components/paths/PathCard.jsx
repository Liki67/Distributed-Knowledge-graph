import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Map, Clock, Target, ArrowRight, BookOpen } from "lucide-react";

export default function PathCard({ path, topics, onSelect }) {
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
    <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 hover:bg-white/90 hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => onSelect(path)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Map className="w-5 h-5 text-emerald-600" />
            <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
              {path.name}
            </CardTitle>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
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
              {path.estimated_duration_hours}h
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {path.description}
        </p>
        
        {path.target_audience && (
          <p className="text-xs text-gray-500 mb-4">
            <strong>For:</strong> {path.target_audience}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <BookOpen className="w-4 h-4" />
            {path.sequence?.length || 0} steps
          </div>
          
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity">
            Start Path
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}