
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useDeviceType } from "@/hooks/use-mobile";

interface TodoListHeaderProps {
  onAddTask: () => void;
}

const TodoListHeader: React.FC<TodoListHeaderProps> = ({ onAddTask }) => {
  const deviceType = useDeviceType();
  const isMobile = deviceType === 'mobile';
  
  return (
    <div className={`flex ${isMobile ? 'flex-col' : 'justify-between'} items-start mb-6`}>
      <div className={isMobile ? 'mb-4 w-full' : ''}>
        <h1 className="text-2xl font-bold mb-1">Liste de tâches</h1>
        <p className="text-gray-500">
          Gérez les tâches de votre événement et suivez leur avancement
        </p>
      </div>
      <Button 
        onClick={onAddTask}
        className="bg-amber-500 hover:bg-amber-600"
        size={isMobile ? "default" : "lg"}
      >
        <Plus size={isMobile ? 16 : 18} className="mr-2" /> 
        {isMobile ? "Ajouter une tâche" : "Ajouter une tâche"}
      </Button>
    </div>
  );
};

export default TodoListHeader;
