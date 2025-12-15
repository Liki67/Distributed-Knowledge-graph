import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Loader2 } from "lucide-react";

export default function CreatePathModal({ isOpen, onClose, onSubmit, isCreating }) {
  const [pathData, setPathData] = useState({
    name: "",
    description: "",
    target_audience: "",
    category: "",
    difficulty_level: "beginner"
  });

  const categories = [
    "mathematics",
    "science", 
    "technology",
    "language",
    "social_studies",
    "arts",
    "practical_skills"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pathData.name && pathData.description && pathData.category) {
      onSubmit(pathData);
    }
  };

  const handleClose = () => {
    setPathData({
      name: "",
      description: "",
      target_audience: "",
      category: "",
      difficulty_level: "beginner"
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-emerald-600" />
            Create AI Learning Path
          </DialogTitle>
          <p className="text-gray-600 mt-2">
            Our AI will create a comprehensive learning path based on your requirements
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div>
            <Label htmlFor="name" className="text-sm font-semibold text-gray-900">
              Path Name *
            </Label>
            <Input
              id="name"
              placeholder="e.g., Introduction to Machine Learning"
              value={pathData.name}
              onChange={(e) => setPathData({...pathData, name: e.target.value})}
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-semibold text-gray-900">
              Description *
            </Label>
            <Textarea
              id="description"
              placeholder="Describe what students will learn and achieve..."
              value={pathData.description}
              onChange={(e) => setPathData({...pathData, description: e.target.value})}
              className="mt-1 h-24"
              required
            />
          </div>

          <div>
            <Label htmlFor="audience" className="text-sm font-semibold text-gray-900">
              Target Audience
            </Label>
            <Input
              id="audience"
              placeholder="e.g., High school students, Adult learners, Professionals..."
              value={pathData.target_audience}
              onChange={(e) => setPathData({...pathData, target_audience: e.target.value})}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-semibold text-gray-900">
                Category *
              </Label>
              <Select
                value={pathData.category}
                onValueChange={(value) => setPathData({...pathData, category: value})}
                required
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-semibold text-gray-900">
                Difficulty Level
              </Label>
              <Select
                value={pathData.difficulty_level}
                onValueChange={(value) => setPathData({...pathData, difficulty_level: value})}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isCreating}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={isCreating || !pathData.name || !pathData.description || !pathData.category}
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Path
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}