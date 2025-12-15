import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Map, Clock, ArrowRight, Target } from "lucide-react";

export default function RecommendedPaths({ paths }) {
  const categoryColors = {
    mathematics: "bg-blue-100 text-blue-800",
    science: "bg-green-100 text-green-800", 
    technology: "bg-purple-100 text-purple-800",
    language: "bg-orange-100 text-orange-800",
    social_studies: "bg-yellow-100 text-yellow-800",
    arts: "bg-pink-100 text-pink-800",
    practical_skills: "bg-gray-100 text-gray-800"
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Map className="w-6 h-6 text-emerald-600" />
            Recommended Learning Paths
          </CardTitle>
          <Link to="/learning-paths">
            <Button variant="outline" size="sm">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {paths.length > 0 ? paths.map((path) => (
          <div key={path.id} className="p-4 rounded-lg border border-gray-200 bg-white/50 hover:bg-white/80 transition-all duration-300 hover:shadow-md">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{path.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{path.description}</p>
                
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={categoryColors[path.category] || "bg-gray-100 text-gray-800"}>
                    {path.category?.replace(/_/g, ' ')}
                  </Badge>
                  
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    {path.difficulty_level}
                  </Badge>
                  
                  {path.estimated_duration_hours && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {path.estimated_duration_hours}h
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {path.sequence?.length || 0} learning steps
              </span>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                Start Learning
              </Button>
            </div>
          </div>
        )) : (
          <div className="text-center py-8 text-gray-500">
            <Map className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No learning paths available yet.</p>
            <p className="text-sm">Check back later for personalized recommendations!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}