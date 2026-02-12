
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyTasksProps {
  onAddTask: () => void;
}

const EmptyTasks: React.FC<EmptyTasksProps> = ({ onAddTask }) => {
  return (
    <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
      <p className="text-gray-500 mb-4">Aucune tâche à afficher.</p>
      <Button 
        onClick={onAddTask}
        variant="outline"
        className="border-amber-200 text-amber-600 hover:bg-amber-50"
      >
        <Plus size={16} className="mr-2" /> Créer votre première tâche
      </Button>
    </div>
  );
};

export default EmptyTasks;
