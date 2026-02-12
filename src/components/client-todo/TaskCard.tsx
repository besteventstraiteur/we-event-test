
import React from "react";
import { Task } from "@/hooks/useTaskList";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Edit, Trash2, Calendar, Star } from "lucide-react";
import { useDeviceType } from "@/hooks/use-mobile";

interface TaskCardProps {
  task: Task;
  onToggleCompletion: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleCompletion,
  onEdit,
  onDelete,
  onToggleFavorite
}) => {
  const deviceType = useDeviceType();
  const isMobile = deviceType === 'mobile';

  const getCategoryLabel = (category: Task["category"]) => {
    switch (category) {
      case "venue": return "Lieu";
      case "catering": return "Traiteur";
      case "decoration": return "Décoration";
      case "music": return "Musique";
      case "photography": return "Photographie";
      case "clothing": return "Tenues";
      default: return "Autre";
    }
  };
  
  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-amber-500";
      case "low": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Card className={`${task.completed ? "bg-gray-50" : ""} border-gray-200 shadow-sm overflow-hidden`}>
      <div className={`h-1 w-full ${getPriorityColor(task.priority)}`} />
      <CardContent className={`pt-4 ${isMobile ? "px-3 py-3" : ""}`}>
        <div className="flex items-start">
          <div className="mr-3 mt-1">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => onToggleCompletion(task.id)}
              className="mt-1"
            />
          </div>
          
          <div className="flex-1">
            <div className="flex flex-wrap justify-between items-start gap-2">
              <h3 className={`font-medium text-lg ${task.completed ? "line-through text-gray-500" : ""}`}>
                {task.title}
              </h3>
              
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`p-1 h-auto ${task.isFavorite ? "text-amber-500" : "text-gray-400"}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(task.id);
                  }}
                >
                  <Star className={`h-5 w-5 ${task.isFavorite ? "fill-amber-500" : ""}`} />
                </Button>
              </div>
            </div>
            
            <p className={`text-gray-600 mt-1 ${task.completed ? "line-through text-gray-400" : ""}`}>
              {task.description}
            </p>
            
            <div className={`flex ${isMobile ? "flex-col gap-2 mt-3" : "flex-row gap-4 mt-4"} items-start`}>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="bg-gray-50">
                  {getCategoryLabel(task.category)}
                </Badge>
                
                {task.assignedTo && (
                  <Badge variant="outline" className="bg-gray-50">
                    {task.assignedTo}
                  </Badge>
                )}
                
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar size={14} className="mr-1" />
                  {format(new Date(task.dueDate), "dd MMM yyyy", { locale: fr })}
                </div>
              </div>
              
              <div className={`flex items-center space-x-2 ${isMobile ? "" : "ml-auto"}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(task);
                  }}
                >
                  <Edit size={16} className="mr-1" />
                  {!isMobile && "Modifier"}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task.id);
                  }}
                >
                  <Trash2 size={16} className="mr-1" />
                  {!isMobile && "Supprimer"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
