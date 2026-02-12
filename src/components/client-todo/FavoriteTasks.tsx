
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Task } from "@/hooks/useTaskList";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Star, Calendar, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDeviceType } from "@/hooks/use-mobile";

interface FavoriteTasksProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
}

const FavoriteTasks: React.FC<FavoriteTasksProps> = ({ tasks, onTaskClick }) => {
  const deviceType = useDeviceType();
  const isMobile = deviceType === 'mobile';
  
  if (tasks.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6 border-amber-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Star className="h-5 w-5 text-amber-500 mr-2 fill-amber-500" />
          Tâches importantes
        </CardTitle>
      </CardHeader>
      <CardContent className={isMobile ? "px-3 py-2" : "px-6"}>
        <div className="space-y-3">
          {tasks.map(task => (
            <div 
              key={task.id}
              className="p-3 bg-amber-50 rounded-md cursor-pointer hover:bg-amber-100 transition-colors border border-amber-100"
              onClick={() => onTaskClick(task.id)}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{task.title}</h3>
                <PriorityBadge priority={task.priority} />
              </div>
              
              <div className="flex items-center mt-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-1" />
                {format(new Date(task.dueDate), "d MMMM yyyy", { locale: fr })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const PriorityBadge: React.FC<{ priority: Task["priority"] }> = ({ priority }) => {
  switch (priority) {
    case "high":
      return <Badge className="bg-red-500">High</Badge>;
    case "medium":
      return <Badge className="bg-amber-500">Medium</Badge>;
    case "low":
      return <Badge className="bg-blue-500">Low</Badge>;
    default:
      return null;
  }
};

export default FavoriteTasks;
