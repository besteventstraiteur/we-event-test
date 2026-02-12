
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Circle, Clock, AlertTriangle, Filter } from "lucide-react";
import { ProjectTask, TaskStatus, TaskCategory } from "@/hooks/useProjectTasks";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface TaskTimelineProps {
  tasks: ProjectTask[];
  categories: TaskCategory[];
}

const TaskTimeline: React.FC<TaskTimelineProps> = ({ tasks, categories }) => {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Filtre les tâches selon les critères
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = searchTerm === "" || 
                          (task.title?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (task.description?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || task.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Trier les tâches par date d'échéance
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const dateA = new Date(a.dueDate).getTime();
    const dateB = new Date(b.dueDate).getTime();
    return dateA - dateB;
  });

  // Organiser les tâches par mois
  const tasksByMonth: Record<string, ProjectTask[]> = {};
  
  sortedTasks.forEach(task => {
    const dueDate = new Date(task.dueDate);
    const monthKey = `${dueDate.getFullYear()}-${dueDate.getMonth() + 1}`;
    
    if (!tasksByMonth[monthKey]) {
      tasksByMonth[monthKey] = [];
    }
    
    tasksByMonth[monthKey].push(task);
  });

  // Obtenir le statut correspondant à l'icône et à la couleur
  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "blocked":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  // Obtenir la classe CSS de la ligne de connexion basée sur le statut
  const getLineClass = (status: TaskStatus) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-blue-500";
      case "blocked":
        return "bg-red-500";
      default:
        return "bg-gray-300";
    }
  };

  // Calculer si une tâche est en retard
  const isOverdue = (dueDate: string | Date, status: TaskStatus) => {
    return status !== "completed" && new Date(dueDate) < new Date();
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={toggleFilters}
          className="flex items-center gap-2"
        >
          <Filter size={16} />
          Filtres {showFilters ? "◾" : "◽"}
        </Button>
      </div>
      
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg border space-y-4 sm:space-y-0 sm:flex sm:gap-4 sm:items-center">
          <div className="flex-1">
            <Input
              placeholder="Rechercher une tâche..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="w-full sm:w-56">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full sm:w-56">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="in-progress">En cours</SelectItem>
                <SelectItem value="completed">Terminée</SelectItem>
                <SelectItem value="blocked">Bloquée</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      
      <div className="p-4 space-y-8">
        {Object.entries(tasksByMonth).map(([monthKey, monthTasks], monthIndex) => {
          const [year, month] = monthKey.split('-');
          const monthLabel = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
          
          return (
            <div key={monthKey} className="relative">
              <div className="flex items-center mb-4">
                <Calendar className="mr-2 h-5 w-5 text-amber-500" />
                <h3 className="text-lg font-semibold">{monthLabel}</h3>
              </div>
              
              <div className="space-y-4 pl-4">
                {monthTasks.map((task, index) => (
                  <div key={task.id} className="relative">
                    {/* Ligne de connexion verticale */}
                    {index < monthTasks.length - 1 && (
                      <div 
                        className={`absolute left-2.5 top-6 w-0.5 h-full -ml-0.5 ${getLineClass(task.status)}`}
                        style={{ height: 'calc(100% + 1rem)' }}
                      />
                    )}
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(task.status)}
                      </div>
                      
                      <Card className={`ml-4 w-full ${isOverdue(task.dueDate, task.status) ? 'border-red-300 bg-red-50' : ''}`}>
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                            <h4 className="font-medium">{task.title}</h4>
                            <div className="flex items-center mt-2 sm:mt-0">
                              <Badge variant={task.status === "completed" ? "outline" : "secondary"} className="ml-2">
                                {task.status === "completed" ? "Terminée" : 
                                 task.status === "in-progress" ? "En cours" : 
                                 task.status === "blocked" ? "Bloquée" : "À faire"}
                              </Badge>
                              {isOverdue(task.dueDate, task.status) && (
                                <Badge variant="destructive" className="ml-2">En retard</Badge>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                          
                          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                            <div className="flex items-center">
                              <Calendar size={12} className="mr-1" />
                              {new Date(task.dueDate).toLocaleDateString("fr-FR")}
                            </div>
                            {task.assignedTo && (
                              <div>
                                Assignée à: <span className="font-medium">{task.assignedTo}</span>
                              </div>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {categories.find(c => c.value === task.category)?.label || task.category}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        
        {Object.keys(tasksByMonth).length === 0 && (
          <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
            <p className="text-gray-500">Aucune tâche planifiée</p>
            <p className="text-sm text-gray-400 mt-1">Ajoutez des tâches avec des dates d'échéance pour les voir apparaître sur la chronologie</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskTimeline;
