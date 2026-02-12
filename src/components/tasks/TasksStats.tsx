
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Star, 
  Bell, 
  Users, 
  ChevronRight
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface TasksStatsProps {
  statistics: {
    total: number;
    completed: number;
    active: number;
    highPriority: number;
    withReminders: number;
    shared: number;
    overdue: number;
    favorites: number;
    completionRate: number;
  };
}

const TasksStats: React.FC<TasksStatsProps> = ({ statistics }) => {
  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium">Progression</h3>
          <div className="text-sm font-medium">
            {statistics.completed}/{statistics.total} tâches complétées
          </div>
        </div>
        <Progress value={statistics.completionRate} className="h-2" />
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tâches actives</p>
              <p className="text-2xl font-bold">{statistics.active}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Complétées</p>
              <p className="text-2xl font-bold">{statistics.completed}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Haute priorité</p>
              <p className="text-2xl font-bold">{statistics.highPriority}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">En retard</p>
              <p className="text-2xl font-bold">{statistics.overdue}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Favorites</p>
              <p className="text-2xl font-bold">{statistics.favorites}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
              <Star className="h-4 w-4 text-amber-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Avec rappels</p>
              <p className="text-2xl font-bold">{statistics.withReminders}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
              <Bell className="h-4 w-4 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Partagées</p>
              <p className="text-2xl font-bold">{statistics.shared}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <Users className="h-4 w-4 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Taux d'achèvement</p>
              <p className="text-2xl font-bold">{statistics.completionRate}%</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <ChevronRight className="h-4 w-4 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TasksStats;
