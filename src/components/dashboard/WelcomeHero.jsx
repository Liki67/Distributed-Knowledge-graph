import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";

export default function WelcomeHero({ user }) {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  return (
    <Card className="bg-gradient-to-r from-emerald-500 via-teal-600 to-blue-600 text-white border-0 shadow-xl overflow-hidden relative">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-0 right-0 w-64 h-64 transform translate-x-32 -translate-y-32 bg-white/10 rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 transform -translate-x-24 translate-y-24 bg-white/5 rounded-full"></div>
      
      <CardContent className="relative p-8 md:p-12">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-yellow-300" />
            <span className="text-white/80 font-medium">Welcome to EduGraph</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {greeting}, {user?.full_name?.split(' ')[0] || 'Student'}!
          </h1>
          
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Your personalized knowledge network is ready. Explore interconnected topics, 
            discover learning paths, and build understanding through our AI-powered educational graph.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/knowledge-graph">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-white/90 font-semibold">
                Explore Knowledge Graph
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            
            <Link to="/learning-paths">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Browse Learning Paths
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}