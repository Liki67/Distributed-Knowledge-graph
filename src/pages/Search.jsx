import React, { useState, useEffect, useMemo, useCallback } from "react";
import { 
  getAllResources, 
  getTopicsFromNeo4j, 
  getAllLearningPaths,
  performAISearch as apiPerformAISearch
} from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Sparkles, BookOpen, Network, Map, Loader2 } from "lucide-react";

import SearchResults from "@/components/search/SearchResults";
import AISearchResults from "@/components/search/AISearchResults";
import SearchSuggestions from "@/components/search/SearchSuggestions";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    resources: [],
    topics: [],
    paths: []
  });
  const [aiResults, setAiResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isAISearching, setIsAISearching] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [hasSearched, setHasSearched] = useState(false);

  const [allData, setAllData] = useState({
    resources: [],
    topics: [],
    paths: []
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [resources, topics, paths] = await Promise.all([
        getAllResources(),
        getTopicsFromNeo4j(),
        getAllLearningPaths()
      ]);
      
      setAllData({ 
        resources: resources || [], 
        topics: topics || [], 
        paths: paths || [] 
      });
    } catch (error) {
      console.error("Error loading data:", error);
      setAllData({
        resources: [],
        topics: [],
        paths: []
      });
    }
  };

  const performSearch = useCallback((query) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setHasSearched(true);
    const lowerQuery = query.toLowerCase();

    // Search through resources
    const matchingResources = allData.resources.filter(resource =>
      resource.title.toLowerCase().includes(lowerQuery) ||
      resource.content?.toLowerCase().includes(lowerQuery) ||
      resource.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );

    // Search through topics
    const matchingTopics = allData.topics.filter(topic =>
      topic.name.toLowerCase().includes(lowerQuery) ||
      topic.description?.toLowerCase().includes(lowerQuery) ||
      topic.keywords?.some(keyword => keyword.toLowerCase().includes(lowerQuery))
    );

    // Search through learning paths
    const matchingPaths = allData.paths.filter(path =>
      path.name.toLowerCase().includes(lowerQuery) ||
      path.description?.toLowerCase().includes(lowerQuery) ||
      path.target_audience?.toLowerCase().includes(lowerQuery)
    );

    setSearchResults({
      resources: matchingResources,
      topics: matchingTopics,
      paths: matchingPaths
    });
    
    setIsSearching(false);
  }, [allData]);

  const performAISearch = useCallback(async (query) => {
    if (!query.trim()) return;
    
    setIsAISearching(true);
    
    try {
      const availableContent = {
        topics: allData.topics.map(t => ({ 
          name: t.name, 
          description: t.description, 
          category: t.category 
        })),
        resources: allData.resources.map(r => ({ 
          title: r.title, 
          content: r.content ? r.content.substring(0, 200) : '', 
          type: r.resource_type 
        })),
        paths: allData.paths.map(p => ({ 
          name: p.name, 
          description: p.description 
        }))
      };
      
      const result = await apiPerformAISearch(query, availableContent);
      setAiResults(result);

    } catch (error) {
      console.error("Error performing AI search:", error);
      setAiResults({ 
        error: "AI search is temporarily unavailable. Please try again later." 
      });
    }
    
    setIsAISearching(false);
  }, [allData]);

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(searchQuery);
    performAISearch(searchQuery);
  };
  
  const handleSuggestionClick = useCallback((suggestion) => {
    setSearchQuery(suggestion);
    performSearch(suggestion);
    performAISearch(suggestion);
  }, [performSearch, performAISearch]);

  const totalResults = useMemo(() => {
    return searchResults.resources.length + 
           searchResults.topics.length + 
           searchResults.paths.length;
  }, [searchResults]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Search & Discovery
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Find educational content, explore topics, and get AI-powered learning recommendations.
          </p>
        </div>

        <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50">
          <CardContent className="p-8">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for topics, resources, or ask a question..."
                  className="pl-12 pr-4 py-4 text-lg rounded-xl border-2 border-gray-200 focus:border-emerald-400"
                />
              </div>
              
              <div className="flex gap-3">
                <Button 
                  type="submit"
                  disabled={isSearching || !searchQuery.trim()}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 py-3"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Search
                    </>
                  )}
                </Button>
                
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => performAISearch(searchQuery)}
                  disabled={isAISearching || !searchQuery.trim()}
                  className="flex-1 border-2 border-purple-200 text-purple-700 hover:bg-purple-50 py-3"
                >
                  {isAISearching ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      AI Thinking...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      AI Search
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {!hasSearched && (
          <SearchSuggestions 
            onSearchClick={handleSuggestionClick}
            allData={allData}
          />
        )}

        {hasSearched && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold">
                    Search Results for "{searchQuery}"
                  </CardTitle>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {totalResults} results
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            <div className="grid lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50">
                  <CardContent className="p-0">
                    <TabsList className="grid w-full grid-cols-4 p-1">
                      <TabsTrigger value="all" className="flex items-center gap-2">
                        <Search className="w-4 h-4" />
                        All ({totalResults})
                      </TabsTrigger>
                      <TabsTrigger value="resources" className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Resources ({searchResults.resources.length})
                      </TabsTrigger>
                      <TabsTrigger value="topics" className="flex items-center gap-2">
                        <Network className="w-4 h-4" />
                        Topics ({searchResults.topics.length})
                      </TabsTrigger>
                      <TabsTrigger value="paths" className="flex items-center gap-2">
                        <Map className="w-4 h-4" />
                        Paths ({searchResults.paths.length})
                      </TabsTrigger>
                    </TabsList>

                    <div className="p-6">
                      <TabsContent value="all" className="mt-0">
                        <SearchResults 
                          results={searchResults}
                          allData={allData}
                          type="all"
                        />
                      </TabsContent>
                      
                      <TabsContent value="resources" className="mt-0">
                        <SearchResults 
                          results={searchResults}
                          allData={allData}
                          type="resources"
                        />
                      </TabsContent>
                      
                      <TabsContent value="topics" className="mt-0">
                        <SearchResults 
                          results={searchResults}
                          allData={allData}
                          type="topics"
                        />
                      </TabsContent>
                      
                      <TabsContent value="paths" className="mt-0">
                        <SearchResults 
                          results={searchResults}
                          allData={allData}
                          type="paths"
                        />
                      </TabsContent>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <AISearchResults 
                  results={aiResults}
                  isLoading={isAISearching}
                  onRelatedSearch={handleSuggestionClick}
                />
              </div>
            </div>
          </Tabs>
        )}
      </div>
    </div>
  );
}