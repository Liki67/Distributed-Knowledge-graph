import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Clock, CheckCircle } from "lucide-react";
import { format } from "date-fns";

export default function RecentProgress({ activities }) {
  return (
    <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          Recent Learning Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.length > 0 ? activities.map((activity) => (
          <div key={activity.id} className="p-4 rounded-lg border border-gray-200 bg-white/50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">Topic Progress</h3>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {activity.last_accessed ? format(new Date(activity.last_accessed), "MMM d") : "Recently"}
              </span>
            </div>
            
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="text-sm font-semibold text-gray-900">
                  {activity.progress_percentage}%
                </span>
              </div>
              <Progress value={activity.progress_percentage} className="h-2" />
            </div>
            
            {activity.completed_resources && activity.completed_resources.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                {activity.completed_resources.length} resources completed
              </div>
            )}
          </div>
        )) : (
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No learning activity yet.</p>
            <p className="text-sm">Start exploring topics to track your progress!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}