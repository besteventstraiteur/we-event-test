
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProjectTask, TaskCategory, TaskPriority, TaskStatus } from "@/hooks/useProjectTasks";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Edit, Plus, Trash2 } from "lucide-react";
import TaskDialog from "./TaskDialog";

interface TaskKanbanProps {
  tasksByStatus: Record<TaskStatus, ProjectTask[]>;
  categories: TaskCategory[];
  onUpdateTaskStatus: (id: string, status: TaskStatus) => void;
  onUpdateTask: (id: string, task: Partial<ProjectTask>) => void;
  onDeleteTask: (id: string) => void;
}

const KanbanColumn: React.FC<{
  title: string;
  tasks: ProjectTask[];
  status: TaskStatus;
  onDrop: (taskId: string, status: TaskStatus) => void;
  onTaskClick: (task: ProjectTask) => void;
  onDeleteTask: (id: string) => void;
  onAddTask?: () => void;
}> = ({
  title,
  tasks,
  status,
  onDrop,
  onTaskClick,
  onDeleteTask,
  onAddTask,
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    onDrop(taskId, status);
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-amber-500";
      case "low":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div
      className="flex flex-col bg-gray-50 rounded-lg p-2 h-[600px] border border-gray-200"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex justify-between items-center mb-3 p-2">
        <h3 className="font-medium">{title}</h3>
        <Badge variant="outline">{tasks.length}</Badge>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="cursor-move bg-white rounded-md border shadow-sm"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("taskId", task.id);
            }}
          >
            <div className="p-3 space-y-2">
              <div className={`w-full h-1 rounded-sm ${getPriorityColor(task.priority)}`} />
              <h4 className="font-medium">{task.title}</h4>
              <p className="text-sm text-gray-500 line-clamp-2">{task.description}</p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <div className="flex items-center">
                  <Calendar size={12} className="mr-1" />
                  {new Date(task.dueDate).toLocaleDateString("fr-FR")}
                </div>
                <Badge variant="outline" className="text-xs">
                  {task.category}
                </Badge>
              </div>
              <div className="flex justify-between pt-2">
                <Button variant="ghost" size="sm" onClick={() => onTaskClick(task)}>
                  <Edit size={14} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-600" 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
                      onDeleteTask(task.id);
                    }
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {onAddTask && (
        <div className="mt-2">
          <Button 
            variant="ghost" 
            className="w-full border border-dashed border-gray-300 text-gray-500"
            onClick={onAddTask}
          >
            <Plus size={16} className="mr-1" />
            Ajouter
          </Button>
        </div>
      )}
    </div>
  );
};

const TaskKanban: React.FC<TaskKanbanProps> = ({
  tasksByStatus,
  categories,
  onUpdateTaskStatus,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<ProjectTask | null>(null);
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>("pending");

  const handleDrop = (taskId: string, newStatus: TaskStatus) => {
    onUpdateTaskStatus(taskId, newStatus);
  };

  const handleTaskClick = (task: ProjectTask) => {
    setCurrentTask(task);
    setIsDialogOpen(true);
  };

  const handleAddTask = (status: TaskStatus) => {
    setCurrentTask(null);
    setNewTaskStatus(status);
    setIsDialogOpen(true);
  };

  const handleSaveTask = (taskData: Omit<ProjectTask, "id">) => {
    if (currentTask) {
      onUpdateTask(currentTask.id, taskData);
    } else {
      // Ajouter une nouvelle tâche avec le statut spécifié
      onUpdateTask("new", { ...taskData, status: newTaskStatus });
    }
    setIsDialogOpen(false);
  };

  const columns: { title: string; status: TaskStatus }[] = [
    { title: "À faire", status: "pending" },
    { title: "En cours", status: "in-progress" },
    { title: "Bloquée", status: "blocked" },
    { title: "Terminée", status: "completed" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {columns.map((column) => (
          <KanbanColumn
            key={column.status}
            title={column.title}
            tasks={tasksByStatus[column.status] || []}
            status={column.status}
            onDrop={handleDrop}
            onTaskClick={handleTaskClick}
            onDeleteTask={onDeleteTask}
            onAddTask={() => handleAddTask(column.status)}
          />
        ))}
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

export default TaskKanban;
