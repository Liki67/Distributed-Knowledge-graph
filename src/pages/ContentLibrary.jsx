import React, { useState, useEffect, useMemo } from "react";
import { getAllResources, getTopicsFromNeo4j } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, BookOpen, Grid, List } from "lucide-react";

import ResourceCard from "@/components/library/ResourceCard";
import ResourceList from "@/components/library/ResourceList";
import ResourceDetails from "@/components/library/ResourceDetails";
import LibraryFilters from "@/components/library/LibraryFilters";
import LibraryStats from "@/components/library/LibraryStats";

export default function ContentLibrary() {
  const [resources, setResources] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    difficulty: "all",
    topic: "all",
    offline: "all"
  });
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLibraryData();
  }, []);

  const loadLibraryData = async () => {
    setIsLoading(true);
    try {
      const [resourcesData, topicsData] = await Promise.all([
        getAllResources(),
        getTopicsFromNeo4j()
      ]);
      
      setResources(resourcesData || []);
      setTopics(topicsData || []);
    } catch (error) {
      console.error("Error loading library data:", error);
      setResources([]);
      setTopics([]);
    }
    setIsLoading(false);
  };

  // Memoized filtering and sorting for better performance
  const filteredAndSortedResources = useMemo(() => {
    if (!resources.length) return [];
    
    const searchLower = searchTerm.toLowerCase();
    
    return resources
      .filter(resource => {
        // Search matching
        const matchesSearch = !searchTerm || 
          resource.title.toLowerCase().includes(searchLower) ||
          resource.content?.toLowerCase().includes(searchLower) ||
          resource.tags?.some(tag => tag.toLowerCase().includes(searchLower));
        
        // Filter matching
        const matchesType = filters.type === "all" || resource.resource_type === filters.type;
        const matchesDifficulty = filters.difficulty === "all" || resource.difficulty_level === filters.difficulty;
        const matchesTopic = filters.topic === "all" || resource.topic_ids?.includes(filters.topic);
        const matchesOffline = filters.offline === "all" || 
                             (filters.offline === "yes" && resource.offline_available) ||
                             (filters.offline === "no" && !resource.offline_available);
        
        return matchesSearch && matchesType && matchesDifficulty && matchesTopic && matchesOffline;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "newest": 
            return new Date(b.created_date || 0) - new Date(a.created_date || 0);
          case "oldest": 
            return new Date(a.created_date || 0) - new Date(b.created_date || 0);
          case "title": 
            return a.title.localeCompare(b.title);
          case "duration": 
            return (a.estimated_time_minutes || 0) - (b.estimated_time_minutes || 0);
          default: 
            return 0;
        }
      });
  }, [resources, searchTerm, filters, sortBy]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array(8).fill(0).map((_, i) => (
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
            Content Library
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore our collection of educational resources designed for rural learning environments.
          </p>
        </div>

        <LibraryStats resources={resources} />

        <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50">
          <CardHeader>
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <BookOpen className="w-6 h-6 text-emerald-600" />
                Resource Library ({filteredAndSortedResources.length})
              </CardTitle>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <Button 
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="title">Alphabetical</SelectItem>
                    <SelectItem value="duration">By Duration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search resources, topics, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <LibraryFilters 
              filters={filters}
              onFiltersChange={setFilters}
              topics={topics}
            />
          </CardContent>
        </Card>

        {filteredAndSortedResources.length > 0 ? (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAndSortedResources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    topics={topics}
                    onSelect={setSelectedResource}
                  />
                ))}
              </div>
            ) : (
              <ResourceList
                resources={filteredAndSortedResources}
                topics={topics}
                onSelect={setSelectedResource}
              />
            )}
          </>
        ) : (
          <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50">
            <CardContent className="text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 mb-2">No resources found</p>
              <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        )}

        <ResourceDetails
          resource={selectedResource}
          topics={topics}
          onClose={() => setSelectedResource(null)}
        />
      </div>
    </div>
  );
}