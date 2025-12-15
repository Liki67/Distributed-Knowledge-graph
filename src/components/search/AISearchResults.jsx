import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, AlertTriangle } from "lucide-react";

export default function AISearchResults({ results, isLoading, onRelatedSearch }) {
  const CardSkeleton = () => (
    <Card className="bg-gradient-to-br from-purple-50 to-indigo-100 border-purple-200">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-purple-900 flex items-center gap-2">
          <Sparkles className="w-6 h-6" />
          AI-Powered Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 animate-pulse">
        <div className="h-4 bg-purple-200 rounded w-3/4"></div>
        <div className="h-4 bg-purple-200 rounded w-1/2"></div>
        <div className="space-y-2 pt-4">
          <div className="h-6 bg-purple-200 rounded w-1/3"></div>
          <div className="h-10 bg-purple-200 rounded"></div>
          <div className="h-10 bg-purple-200 rounded"></div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return <CardSkeleton />;
  }

  if (!results) {
    return (
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-100 border-purple-200">
        <CardContent className="text-center py-12 text-purple-700">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-400" />
          <p>Get AI-powered insights</p>
          <p className="text-sm">by clicking the "AI Search" button!</p>
        </CardContent>
      </Card>
    );
  }
  
  if (results.error) {
    return (
       <Card className="bg-gradient-to-br from-red-50 to-orange-100 border-red-200">
        <CardContent className="text-center py-12 text-red-700">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-400" />
          <p className="font-semibold">Search Unavailable</p>
          <p className="text-sm">{results.error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-indigo-100 border-purple-200">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-purple-900 flex items-center gap-2">
          <Sparkles className="w-6 h-6" />
          AI-Powered Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {results.interpretation && (
          <div>
            <h4 className="font-semibold text-purple-900 mb-2">Interpretation</h4>
            <p className="text-purple-800 text-sm">
              {results.interpretation}
            </p>
          </div>
        )}

        {results.recommended_topics && results.recommended_topics.length > 0 && (
          <div>
            <h4 className="font-semibold text-purple-900 mb-2">Recommended Topics</h4>
            <div className="flex flex-wrap gap-2">
              {results.recommended_topics.map((topic, index) => (
                <Badge key={index} variant="outline" className="bg-white/50 cursor-pointer" onClick={() => onRelatedSearch(topic)}>
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {results.suggested_resources && results.suggested_resources.length > 0 && (
           <div>
            <h4 className="font-semibold text-purple-900 mb-2">Suggested Resources</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-purple-800">
                {results.suggested_resources.map((resource, index) => (
                    <li key={index} className="cursor-pointer hover:underline" onClick={() => onRelatedSearch(resource)}>{resource}</li>
                ))}
            </ul>
          </div>
        )}

        {results.learning_path_suggestion && (
          <div>
            <h4 className="font-semibold text-purple-900 mb-2">Learning Path Suggestion</h4>
            <p className="text-purple-800 text-sm italic">
              "{results.learning_path_suggestion}"
            </p>
          </div>
        )}

        {results.related_searches && results.related_searches.length > 0 && (
          <div>
            <h4 className="font-semibold text-purple-900 mb-2">Related Searches</h4>
            <div className="flex flex-wrap gap-2">
              {results.related_searches.map((search, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => onRelatedSearch(search)}
                >
                  {search}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}