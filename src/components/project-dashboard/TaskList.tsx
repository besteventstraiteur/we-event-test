import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Check, X, ArrowUpDown, Info, Star, StarOff, Calendar, User, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProjectTask, TaskCategory, TaskPriority, TaskStatus } from "@/hooks/useProjectTasks";
import TaskDialog from "./TaskDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface TaskListProps {
  tasks: ProjectTask[];
  categories: TaskCategory[];
  onAddTask: (task: Omit<ProjectTask, "id">) => void;
  onUpdateTask: (id: string, task: Partial<ProjectTask>) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: ProjectTask) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  categories,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onEditTask
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<ProjectTask | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<keyof ProjectTask>("dueDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [favoriteTaskIds, setFavoriteTaskIds] = useState<string[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const handleAddClick = () => {
    setCurrentTask(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (task: ProjectTask) => {
    setCurrentTask(task);
    setIsDialogOpen(true);
  };

  const handleSaveTask = (taskData: Omit<ProjectTask, "id">) => {
    if (currentTask) {
      onUpdateTask(currentTask.id, taskData);
    } else {
      onAddTask(taskData);
    }
    setIsDialogOpen(false);
  };

  const handleDeleteClick = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
      onDeleteTask(id);
    }
  };

  const handleToggleStatus = (task: ProjectTask) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    onUpdateTask(task.id, { status: newStatus });
  };

  const handleToggleFavorite = (taskId: string) => {
    setFavoriteTaskIds(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleQuickStatusChange = (taskId: string, status: TaskStatus) => {
    onUpdateTask(taskId, { status });
  };

  const handleQuickPriorityChange = (taskId: string, priority: TaskPriority) => {
    onUpdateTask(taskId, { priority });
  };

  const handleSort = (field: keyof ProjectTask) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredTasks = tasks.filter(task => {
    const taskTitle = task.title || "";
    const taskDescription = task.description || "";
    const searchTermLower = searchTerm.toLowerCase();
    
    const matchesSearch = searchTerm === "" || 
                         taskTitle.toLowerCase().includes(searchTermLower) ||
                         taskDescription.toLowerCase().includes(searchTermLower);
    const matchesCategory = categoryFilter === "all" || task.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortField === "dueDate") {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    } else if (sortField === "priority") {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const orderA = priorityOrder[a.priority];
      const orderB = priorityOrder[b.priority];
      return sortDirection === "asc" ? orderA - orderB : orderB - orderA;
    } else {
      const valueA = String(a[sortField] || "").toLowerCase();
      const valueB = String(b[sortField] || "").toLowerCase();
      return sortDirection === "asc" 
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
  });

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">Haute</Badge>;
      case "medium":
        return <Badge variant="default">Moyenne</Badge>;
      case "low":
        return <Badge variant="secondary">Basse</Badge>;
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-gray-100">En attente</Badge>;
      case "in-progress":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">En cours</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Terminée</Badge>;
      case "blocked":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Bloquée</Badge>;
    }
  };

  const isTaskOverdue = (task: ProjectTask) => {
    if (task.status === "completed") return false;
    const dueDate = task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);
    const today = new Date();
    return dueDate < today;
  };

  const getTaskRowClass = (task: ProjectTask) => {
    if (task.status === "completed") return "bg-gray-50";
    if (isTaskOverdue(task)) return "bg-red-50";
    if (task.status === "blocked") return "bg-red-50/50";
    if (favoriteTaskIds.includes(task.id)) return "bg-amber-50/50";
    return "";
  };

  const formatDueDate = (dateString: string | Date) => {
    const date = dateString instanceof Date ? dateString : new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Date invalide";
    }
    return format(date, 'dd MMM yyyy', { locale: fr });
  };

  const getDueDateWithStyle = (task: ProjectTask) => {
    if (!task.dueDate) {
      return (
        <div className="text-gray-500">
          <span>Non définie</span>
        </div>
      );
    }

    const isOverdue = isTaskOverdue(task);
    
    return (
      <div className={`flex items-center ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
        <Calendar size={14} className={`mr-1 ${isOverdue ? 'text-red-600' : 'text-gray-500'}`} />
        <span>{formatDueDate(task.dueDate)}</span>
        {isOverdue && 
          <Badge variant="outline" className="ml-2 text-red-600 border-red-600 text-xs">
            En retard
          </Badge>
        }
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            placeholder="Rechercher une tâche..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-80"
          />
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-40">
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
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
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
        
        <Button 
          onClick={handleAddClick} 
          className="w-full sm:w-auto"
        >
          <Plus size={16} className="mr-2" /> Ajouter une tâche
        </Button>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <span className="sr-only">Favori</span>
              </TableHead>
              <TableHead className="w-12">Statut</TableHead>
              <TableHead>
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("title")}
                >
                  Titre
                  {sortField === "title" && (
                    <ArrowUpDown size={16} className="ml-2" />
                  )}
                </div>
              </TableHead>
              <TableHead>
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("category")}
                >
                  Catégorie
                  {sortField === "category" && (
                    <ArrowUpDown size={16} className="ml-2" />
                  )}
                </div>
              </TableHead>
              <TableHead>
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("priority")}
                >
                  Priorité
                  {sortField === "priority" && (
                    <ArrowUpDown size={16} className="ml-2" />
                  )}
                </div>
              </TableHead>
              <TableHead>
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("dueDate")}
                >
                  Échéance
                  {sortField === "dueDate" && (
                    <ArrowUpDown size={16} className="ml-2" />
                  )}
                </div>
              </TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  Aucune tâche trouvée
                </TableCell>
              </TableRow>
            ) : (
              sortedTasks.map((task) => (
                <TableRow key={task.id} className={getTaskRowClass(task)}>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleFavorite(task.id)}
                      className={favoriteTaskIds.includes(task.id) ? "text-amber-500" : "text-gray-400"}
                    >
                      {favoriteTaskIds.includes(task.id) ? 
                        <Star size={18} className="fill-amber-500" /> : <Star size={18} />}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleStatus(task)}
                            className={task.status === "completed" ? "text-green-600" : "text-gray-400"}
                          >
                            {task.status === "completed" ? <Check size={18} /> : <X size={18} />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {task.status === "completed" ? "Marquer comme non terminée" : "Marquer comme terminée"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{task.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {task.description}
                    </div>
                    {task.assignedTo && (
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <User size={12} className="mr-1" />
                        <span>{task.assignedTo}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Tag size={14} className="text-gray-500" />
                      <span>{categories.find(c => c.value === task.category)?.label || task.category}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 data-[state=open]:bg-gray-100">
                          {getPriorityBadge(task.priority)}
                          <ArrowUpDown size={14} className="ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={() => handleQuickPriorityChange(task.id, "high")}>
                          <Badge variant="destructive" className="mr-2">Haute</Badge>
                          <span>Priorité haute</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleQuickPriorityChange(task.id, "medium")}>
                          <Badge variant="default" className="mr-2">Moyenne</Badge>
                          <span>Priorité moyenne</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleQuickPriorityChange(task.id, "low")}>
                          <Badge variant="secondary" className="mr-2">Basse</Badge>
                          <span>Priorité basse</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell>
                    {getDueDateWithStyle(task)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            {getStatusBadge(task.status)}
                            <ArrowUpDown size={14} className="ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleQuickStatusChange(task.id, "pending")}>
                            <Badge variant="outline" className="bg-gray-100 mr-2">En attente</Badge>
                            <span>À faire</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleQuickStatusChange(task.id, "in-progress")}>
                            <Badge variant="outline" className="bg-blue-100 text-blue-800 mr-2">En cours</Badge>
                            <span>En cours</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleQuickStatusChange(task.id, "completed")}>
                            <Badge variant="outline" className="bg-green-100 text-green-800 mr-2">Terminée</Badge>
                            <span>Terminée</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleQuickStatusChange(task.id, "blocked")}>
                            <Badge variant="outline" className="bg-red-100 text-red-800 mr-2">Bloquée</Badge>
                            <span>Bloquée</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <Popover open={selectedTaskId === task.id} onOpenChange={(open) => setSelectedTaskId(open ? task.id : null)}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Info size={16} />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-4" align="end">
                          <div className="space-y-2">
                            <h3 className="font-semibold">{task.title}</h3>
                            <p className="text-sm text-gray-600">{task.description || "Aucune description"}</p>
                            
                            <div className="flex flex-col gap-1 mt-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Statut:</span>
                                <span>{getStatusBadge(task.status)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Priorité:</span>
                                <span>{getPriorityBadge(task.priority)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Catégorie:</span>
                                <span>{categories.find(c => c.value === task.category)?.label || task.category}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Échéance:</span>
                                <span className={`${isTaskOverdue(task) ? 'text-red-600' : ''}`}>
                                  {formatDueDate(task.dueDate)}
                                </span>
                              </div>
                              {task.assignedTo && (
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-500">Assignée à:</span>
                                  <span>{task.assignedTo}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex gap-2 mt-4 justify-end">
                              <Button size="sm" variant="outline" onClick={() => setSelectedTaskId(null)}>
                                Fermer
                              </Button>
                              <Button size="sm" onClick={() => onEditTask(task)}>
                                Modifier
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditTask(task)}
                        className="h-8 w-8"
                      >
                        <Edit size={16} />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(task.id)}
                        className="text-red-600 h-8 w-8"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <TaskDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveTask}
        task={currentTask}
        categories={categories}
      />
    </div>
  );
};

export default TaskList;
