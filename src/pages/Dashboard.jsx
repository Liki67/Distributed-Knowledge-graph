import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { getTopicsFromNeo4j, getAllResources, getAllLearningPaths } from "@/lib/api";
import { Network } from "lucide-react";
import { Button } from "@/components/ui/button";

import WelcomeHero from "../components/dashboard/WelcomeHero";
import QuickStats from "../components/dashboard/QuickStats";
import RecommendedPaths from "../components/dashboard/RecommendedPaths";
import RecentProgress from "../components/dashboard/RecentProgress";
import TopicInsights from "../components/dashboard/TopicInsights";

export default function Dashboard() {
  const [user, setUser] = useState({ full_name: "Student" });
  const [stats, setStats] = useState({
    totalTopics: 0,
    totalResources: 0,
    totalPaths: 0,
    userProgress: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [recommendedPaths, setRecommendedPaths] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [topics, resources, paths] = await Promise.all([
        getTopicsFromNeo4j(),
        getAllResources(),
        getAllLearningPaths()
      ]);

      // Ensure we have arrays even if API returns null/undefined
      const topicsArray = Array.isArray(topics) ? topics : [];
      const resourcesArray = Array.isArray(resources) ? resources : [];
      const pathsArray = Array.isArray(paths) ? paths : [];

      setStats({
        totalTopics: topicsArray.length,
        totalResources: resourcesArray.length,
        totalPaths: pathsArray.length,
        userProgress: 0 // Will be updated when user progress endpoint is available
      });

      setRecentActivity([]); // Will be populated from user progress API
      setRecommendedPaths(pathsArray.slice(0, 3));
      
    } catch (err) {
      console.error("Error loading dashboard:", err);
      setError("Failed to load dashboard data. Please try again.");
      
      // Reset to safe defaults on error
      setStats({
        totalTopics: 0,
        totalResources: 0,
        totalPaths: 0,
        userProgress: 0
      });
      setRecentActivity([]);
      setRecommendedPaths([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-white/70 backdrop-blur-sm border-red-200">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Dashboard</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={loadDashboardData} className="bg-emerald-600 hover:bg-emerald-700">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <WelcomeHero user={user} />
        
        <QuickStats stats={stats} />
        
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <RecommendedPaths paths={recommendedPaths} />
            <RecentProgress activities={recentActivity} />
          </div>
          
          <div className="space-y-6">
            <TopicInsights />
            
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-blue-900 flex items-center gap-2">
                  <Network className="w-6 h-6" />
                  Explore Knowledge Graph
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700 mb-4">
                  Discover how topics connect and find your optimal learning path through our interactive knowledge graph.
                </p>
                <Link to="/knowledge-graph">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Network className="w-4 h-4 mr-2" />
                    Explore Graph
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}