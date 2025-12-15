import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Lightbulb, BookOpen, ArrowRight } from "lucide-react";

export default function TopicInsights() {
  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-100 border-amber-200">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-amber-900 flex items-center gap-2">
          <Lightbulb className="w-6 h-6" />
          Learning Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-3 bg-white/60 rounded-lg">
            <h4 className="font-medium text-amber-900 mb-1">💡 Did you know?</h4>
            <p className="text-amber-800 text-sm">
              Connected learning helps you understand concepts 40% faster than isolated study.
            </p>
          </div>
          
          <div className="p-3 bg-white/60 rounded-lg">
            <h4 className="font-medium text-amber-900 mb-1">🎯 Pro Tip</h4>
            <p className="text-amber-800 text-sm">
              Start with fundamental topics to build a strong knowledge foundation.
            </p>
          </div>
        </div>
        
        <Link to="/content-library" className="block mt-4">
          <Button className="w-full bg-amber-600 hover:bg-amber-700">
            <BookOpen className="w-4 h-4 mr-2" />
            Explore Library
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}