
import React, { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Bell, 
  Calendar, 
  Check, 
  Edit, 
  MoreHorizontal, 
  Star, 
  Tag, 
  Trash2, 
  UserPlus, 
  Users, 
  X 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { EnhancedTask } from "@/hooks/useEnhancedTaskList";

interface TaskCardProps {
  task: EnhancedTask;
  onToggleComplete: () => void;
  onToggleFavorite: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddReminder: () => void;
  onShareTask: () => void;
  onDeleteReminder: (reminderId: string) => void;
  onDeleteSharing: (sharingId: string) => void;
  categories: { value: string; label: string }[];
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onToggleFavorite,
  onEdit,
  onDelete,
  onAddReminder,
  onShareTask,
  onDeleteReminder,
  onDeleteSharing,
  categories
}) => {
  const [expanded, setExpanded] = useState<string | undefined>(undefined);

  // Vérifier si la tâche est en retard
  const isOverdue = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    return dueDate < today && !task.completed;
  };

  // Formatter la date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d MMMM yyyy", { locale: fr });
  };
  
  // Obtenir l'étiquette de la catégorie
  const getCategoryLabel = (value: string) => {
    const category = categories.find(c => c.value === value);
    return category ? category.label : value;
  };

  // Obtenir la couleur de priorité
  const getPriorityColor = () => {
    switch (task.priority) {
      case "high":
        return "bg-red-500 text-white";
      case "medium":
        return "bg-amber-500 text-white";
      case "low":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Obtenir la classe de bordure pour la carte
  const getCardBorderClass = () => {
    if (task.completed) {
      return "border-l-4 border-l-green-500";
    }
    if (isOverdue()) {
      return "border-l-4 border-l-red-500";
    }
    switch (task.priority) {
      case "high":
        return "border-l-4 border-l-red-500";
      case "medium":
        return "border-l-4 border-l-amber-500";
      case "low":
        return "border-l-4 border-l-blue-500";
      default:
        return "";
    }
  };

  return (
    <Card className={`${getCardBorderClass()}`}>
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <Checkbox 
                checked={task.completed} 
                onCheckedChange={onToggleComplete}
                className="mt-1"
              />
              
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                    {task.title}
                  </h3>
                  {task.isFavorite && (
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  )}
                </div>
                
                <div className="flex flex-wrap items-center mt-1 gap-2 text-sm text-gray-500">
                  <Badge variant="outline" className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(task.dueDate)}
                    {isOverdue() && !task.completed && (
                      <span className="ml-1 text-red-500 font-medium">• En retard</span>
                    )}
                  </Badge>
                  
                  <Badge className={`${getPriorityColor()}`}>
                    {task.priority === "high" ? "Haute" : task.priority === "medium" ? "Moyenne" : "Basse"}
                  </Badge>
                  
                  <Badge variant="secondary">
                    {getCategoryLabel(task.category)}
                  </Badge>
                  
                  {task.hasReminders && (
                    <Badge variant="outline" className="flex items-center bg-amber-50">
                      <Bell className="h-3 w-3 mr-1 text-amber-500" />
                      Rappels
                    </Badge>
                  )}
                  
                  {task.isShared && (
                    <Badge variant="outline" className="flex items-center bg-indigo-50">
                      <Users className="h-3 w-3 mr-1 text-indigo-500" />
                      Partagée
                    </Badge>
                  )}
                </div>
                
                {task.description && (
                  <p className={`mt-2 text-sm ${task.completed ? 'text-gray-500' : 'text-gray-700'}`}>
                    {task.description}
                  </p>
                )}
                
                {task.tags && task.tags.length > 0 && (
                  <div className="flex items-center mt-2 flex-wrap gap-1">
                    {task.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="flex items-center text-xs bg-gray-50">
                        <Tag className="h-3 w-3 mr-1 text-gray-400" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {task.assignedToName && (
                  <div className="mt-2 text-sm text-gray-500">
                    Assignée à: <span className="font-medium">{task.assignedToName}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onToggleFavorite} 
                className="h-8 w-8"
              >
                <Star className={`h-4 w-4 ${task.isFavorite ? 'text-amber-500 fill-amber-500' : ''}`} />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={onAddReminder} className="cursor-pointer">
                    <Bell className="h-4 w-4 mr-2" />
                    Ajouter un rappel
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={onShareTask} className="cursor-pointer">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Partager
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={onDelete} className="text-red-500 cursor-pointer">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        
        {(task.hasReminders || task.isShared) && (
          <Accordion
            type="single"
            collapsible
            value={expanded}
            onValueChange={setExpanded}
            className="border-t"
          >
            {task.hasReminders && (
              <AccordionItem value="reminders" className="border-b-0">
                <AccordionTrigger className="py-2 px-4">
                  <span className="flex items-center text-sm">
                    <Bell className="h-4 w-4 mr-2" />
                    Rappels ({task.reminders.length})
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-3">
                  <ul className="space-y-2">
                    {task.reminders.map(reminder => (
                      <li key={reminder.id} className="bg-amber-50 p-2 rounded flex justify-between items-center">
                        <div>
                          <div className="flex items-center">
                            {reminder.type === 'push' ? (
                              <Bell className="h-3 w-3 mr-1 text-amber-600" />
                            ) : reminder.type === 'email' ? (
                              <Badge className="bg-blue-500">Email</Badge>
                            ) : (
                              <Badge className="bg-green-500">SMS</Badge>
                            )}
                            <span className="text-sm ml-1">
                              {formatDate(reminder.date)}
                            </span>
                          </div>
                          {reminder.message && (
                            <p className="text-xs text-gray-600 mt-1">{reminder.message}</p>
                          )}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => onDeleteReminder(reminder.id)}
                          className="h-6 w-6 text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )}
            
            {task.isShared && (
              <AccordionItem value="sharing" className="border-b-0">
                <AccordionTrigger className="py-2 px-4">
                  <span className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2" />
                    Partagée avec ({task.sharing.length})
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-3">
                  <ul className="space-y-2">
                    {task.sharing.map(share => (
                      <li key={share.id} className="bg-indigo-50 p-2 rounded flex justify-between items-center">
                        <div>
                          <div className="flex items-center">
                            <span className="text-sm font-medium">{share.userName}</span>
                            <Badge className="ml-2" variant="outline">
                              {share.userType === 'witness' ? 'Témoin' : 
                               share.userType === 'family' ? 'Famille' :
                               share.userType === 'friend' ? 'Ami(e)' :
                               share.userType === 'vendor' ? 'Prestataire' :
                               share.userType === 'client' ? 'Client' : 'Partenaire'}
                            </Badge>
                          </div>
                          <div className="flex items-center text-xs text-gray-600 mt-1">
                            <span>
                              {share.permission === 'view' ? 'Lecture seule' :
                               share.permission === 'edit' ? 'Peut modifier' : 'Gestion complète'}
                            </span>
                            {share.accepted ? (
                              <span className="ml-2 flex items-center text-green-600">
                                <Check className="h-3 w-3 mr-1" /> Accepté
                              </span>
                            ) : (
                              <span className="ml-2 flex items-center text-amber-600">
                                En attente
                              </span>
                            )}
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => onDeleteSharing(share.id)}
                          className="h-6 w-6 text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCard;
