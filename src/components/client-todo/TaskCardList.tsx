
import React from "react";
import TaskCard from "./TaskCard";
import EmptyTasks from "./EmptyTasks";
import { Task } from "@/hooks/useTaskList";

interface TaskCardListProps {
  tasks: Task[];
  onToggleCompletion: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onAddTask: () => void;
}

const TaskCardList: React.FC<TaskCardListProps> = ({
  tasks,
  onToggleCompletion,
  onEdit,
  onDelete,
  onToggleFavorite,
  onAddTask
}) => {
  if (tasks.length === 0) {
    return <EmptyTasks onAddTask={onAddTask} />;
  }

  return (
    <div className="space-y-4">
      {tasks.map(task => (
        <TaskCard 
          key={task.id}
          task={task}
          onToggleCompletion={onToggleCompletion}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};

export default TaskCardList;
