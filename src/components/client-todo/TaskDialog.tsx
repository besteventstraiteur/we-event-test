
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TaskForm from "./TaskForm";
import { Task } from "@/hooks/useTaskList";

interface TaskDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentTask?: Task;
  onSave: (task: Omit<Task, "id" | "completed">) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const TaskDialog: React.FC<TaskDialogProps> = ({
  isOpen,
  onOpenChange,
  currentTask,
  onSave,
  onCancel,
  isEditing = !!currentTask
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier la tâche" : "Ajouter une nouvelle tâche"}
          </DialogTitle>
        </DialogHeader>
        <TaskForm 
          initialTask={currentTask} 
          onSave={onSave} 
          onCancel={onCancel} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
