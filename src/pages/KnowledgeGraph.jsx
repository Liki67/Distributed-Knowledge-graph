import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Network, Download } from "lucide-react";
import { getTopicsFromNeo4j, getAllResources } from "@/lib/api";

import GraphVisualization from "../components/graph/GraphVisualization";
import TopicDetails from "../components/graph/TopicDetails";
import GraphControls from "../components/graph/GraphControls";

export default function KnowledgeGraph() {
  const [topics, setTopics] = useState([]);
  const [resources, setResources] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [topicsData, resourcesData] = await Promise.all([
        getTopicsFromNeo4j(),
        getAllResources()
      ]);
      setTopics(topicsData || []);
      setResources(resourcesData || []);
    } catch (error) {
      console.error("Error loading knowledge graph data:", error);
      setTopics([]);
      setResources([]);
    }
    setIsLoading(false);
  };

  const categories = useMemo(() => {
    return [...new Set(topics.map(topic => topic.category).filter(Boolean))];
  }, [topics]);

  const filteredTopics = useMemo(() => {
    return topics.filter(topic => {
      const matchesSearch = !searchTerm || 
        topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === "all" || topic.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  }, [topics, searchTerm, categoryFilter]);

  const handleDownloadOffline = async () => {
    console.log("Downloading selected content for offline access...");
    // Implementation would use IPFS and in-memory storage
    alert("Offline download feature will be implemented with backend support");
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Knowledge Graph
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore educational content through an interactive knowledge graph. 
            Discover connections between topics and resources.
          </p>
        </div>

        <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <Network className="w-6 h-6 text-emerald-600" />
                Interactive Knowledge Network
              </CardTitle>
              
              <Button 
                onClick={handleDownloadOffline}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download for Offline
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="w-4 h-4 mr-2" />
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
            </div>
          </CardHeader>
          <CardContent>
            <GraphVisualization 
              topics={filteredTopics}
              resources={resources}
              onTopicSelect={setSelectedTopic}
              selectedTopic={selectedTopic}
            />
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GraphControls 
              topics={filteredTopics}
              onTopicSelect={setSelectedTopic}
            />
          </div>
          
          <div>
            <TopicDetails 
              topic={selectedTopic}
              resources={resources}
              topics={topics}
            />
          </div>
        </div>
      </div>
    </div>
  );
}