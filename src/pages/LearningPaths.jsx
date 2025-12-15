import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Map, Sparkles, Plus } from "lucide-react";

import { getAllLearningPaths, getTopicsFromNeo4j, getAllResources, performAISearch } from "@/lib/api";

import PathCard from "../components/paths/PathCard";
import PathDetails from "../components/paths/PathDetails";
import CreatePathModal from "../components/paths/CreatePathModal";

export default function LearningPaths() {
  const [paths, setPaths] = useState([]);
  const [topics, setTopics] = useState([]);
  const [resources, setResources] = useState([]);
  const [selectedPath, setSelectedPath] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [pathsData, topicsData, resourcesData] = await Promise.all([
        getAllLearningPaths(),
        getTopicsFromNeo4j(),
        getAllResources()
      ]);
      
      setPaths(pathsData || []);
      setTopics(topicsData || []);
      setResources(resourcesData || []);
    } catch (error) {
      console.error("Error loading data:", error);
      setPaths([]);
      setTopics([]);
      setResources([]);
    }
    setIsLoading(false);
  };

  const filteredPaths = useMemo(() => {
    if (!paths.length) return [];
    
    const searchLower = searchTerm.toLowerCase();
    
    return paths.filter(path => {
      const matchesSearch = !searchTerm ||
        path.name.toLowerCase().includes(searchLower) ||
        path.description?.toLowerCase().includes(searchLower);
      
      const matchesCategory = categoryFilter === "all" || path.category === categoryFilter;
      const matchesDifficulty = difficultyFilter === "all" || path.difficulty_level === difficultyFilter;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [paths, searchTerm, categoryFilter, difficultyFilter]);

  const categories = useMemo(() => {
    return [...new Set(paths.map(path => path.category).filter(Boolean))];
  }, [paths]);

  const generateAIPath = async (pathData) => {
    setIsCreating(true);
    try {
      const availableTopics = topics.map(t => `${t.name} (${t.category})`).join(", ");
      
      const promptContext = {
        ...pathData,
        available_topics: availableTopics
      };

      const result = await performAISearch(
        `Create a comprehensive learning path for: "${pathData.name}"`, 
        promptContext
      );

      console.log("AI Generated Path Data:", result);
      
      // Note: Backend should return the newly created path
      // If result contains the path, add it to the list:
      // if (result.path) {
      //   setPaths(prev => [result.path, ...prev]);
      // }
      
      alert("AI path generation requested. Implementation requires backend support to save the path.");
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error generating AI path:", error);
      alert("Failed to generate AI path. Please try again.");
    }
    setIsCreating(false);
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Learning Paths
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Structured learning journeys designed to build knowledge progressively and help you master complex topics.
          </p>
        </div>

        <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <Map className="w-6 h-6 text-emerald-600" />
                Available Paths ({filteredPaths.length})
              </CardTitle>
              
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create AI Path
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search learning paths..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
        </Card>

        {filteredPaths.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPaths.map((path) => (
              <PathCard
                key={path.id}
                path={path}
                topics={topics}
                onSelect={setSelectedPath}
              />
            ))}
          </div>
        ) : (
          <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50">
            <CardContent className="text-center py-12">
              <Map className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 mb-2">No learning paths found</p>
              <p className="text-sm text-gray-400">Try adjusting your search or create a new path</p>
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="mt-4 bg-emerald-600 hover:bg-emerald-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Create Your First Path
              </Button>
            </CardContent>
          </Card>
        )}

        <PathDetails
          path={selectedPath}
          topics={topics}
          resources={resources}
          onClose={() => setSelectedPath(null)}
        />

        <CreatePathModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={generateAIPath}
          isCreating={isCreating}
        />
      </div>
    </div>
  );
}