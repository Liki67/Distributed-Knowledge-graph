import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";

export default function LibraryFilters({ filters, onFiltersChange, topics }) {
  const resourceTypes = [
    "article", "video_link", "exercise", "quiz", "tutorial", "reference"
  ];

  const updateFilter = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      type: "all",
      difficulty: "all", 
      topic: "all",
      offline: "all"
    });
  };

  const activeFilters = Object.entries(filters).filter(([key, value]) => value !== "all");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Select value={filters.type} onValueChange={(value) => updateFilter("type", value)}>
          <SelectTrigger className="w-40">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {resourceTypes.map(type => (
              <SelectItem key={type} value={type}>
                {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.difficulty} onValueChange={(value) => updateFilter("difficulty", value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.topic} onValueChange={(value) => updateFilter("topic", value)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Topic" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Topics</SelectItem>
            {topics.map(topic => (
              <SelectItem key={topic.id} value={topic.id}>
                {topic.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.offline} onValueChange={(value) => updateFilter("offline", value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Resources</SelectItem>
            <SelectItem value="yes">Offline Ready</SelectItem>
            <SelectItem value="no">Online Only</SelectItem>
          </SelectContent>
        </Select>

        {activeFilters.length > 0 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={clearFilters}
            className="flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear Filters
          </Button>
        )}
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-500">Active filters:</span>
          {activeFilters.map(([key, value]) => (
            <Badge key={key} variant="secondary" className="flex items-center gap-1">
              {key}: {value}
              <button
                onClick={() => updateFilter(key, "all")}
                className="ml-1 hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}