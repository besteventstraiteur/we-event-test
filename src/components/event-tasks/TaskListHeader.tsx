
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface TaskListHeaderProps {
  onAddNewTask: () => void;
}

const TaskListHeader: React.FC<TaskListHeaderProps> = ({ onAddNewTask }) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold">Liste des tâches</h2>
      <Button onClick={onAddNewTask} className="bg-vip-gold text-vip-black hover:bg-vip-gold/90">
        <Plus size={16} className="mr-2" /> Nouvelle tâche
      </Button>
    </div>
  );
};

export default TaskListHeader;
