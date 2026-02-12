
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  BarChart3,
  Zap
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export interface ProjectStatistics {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  highPriorityTasks: number;
  completionPercentage: number;
}

interface ProjectStatsProps {
  statistics: ProjectStatistics;
}

const ProjectStats: React.FC<ProjectStatsProps> = ({ statistics }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Progression globale</h3>
            <span className="text-sm font-bold">{statistics.completionPercentage}%</span>
          </div>
          <Progress value={statistics.completionPercentage} className="h-2" />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>{statistics.completedTasks} tâches terminées</span>
            <span>Total: {statistics.totalTasks} tâches</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border-gray-200">
          <CardContent className="p-6 flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Tâches terminées</p>
              <p className="text-2xl font-semibold">{statistics.completedTasks}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-gray-200">
          <CardContent className="p-6 flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <Clock className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">En cours</p>
              <p className="text-2xl font-semibold">{statistics.inProgressTasks}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-gray-200">
          <CardContent className="p-6 flex items-center">
            <div className="rounded-full bg-amber-100 p-3 mr-4">
              <Zap className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">En attente</p>
              <p className="text-2xl font-semibold">{statistics.pendingTasks}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-gray-200">
          <CardContent className="p-6 flex items-center">
            <div className="rounded-full bg-red-100 p-3 mr-4">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Haute priorité</p>
              <p className="text-2xl font-semibold">{statistics.highPriorityTasks}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectStats;
