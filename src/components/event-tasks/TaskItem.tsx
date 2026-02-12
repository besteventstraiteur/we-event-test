
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { EventTask } from '@/hooks/useEventTasks';
import { getAssigneeLabel, getCategoryBadge, getPriorityBadge } from './taskUtils';

interface TaskItemProps {
  task: EventTask;
  onToggleCompletion: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: EventTask) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleCompletion,
  onDeleteTask,
  onEditTask
}) => {
  return (
    <TableRow 
      key={task.id} 
      className={task.completed ? "bg-gray-50" : ""}
    >
      <TableCell>
        <Checkbox 
          checked={task.completed} 
          onCheckedChange={() => onToggleCompletion(task.id)}
        />
      </TableCell>
      <TableCell className={task.completed ? "line-through text-gray-500" : ""}>
        <div className="font-medium">{task.title}</div>
        {task.description && (
          <div className="text-sm text-gray-500 truncate max-w-[200px]">
            {task.description}
          </div>
        )}
      </TableCell>
      <TableCell>{getAssigneeLabel(task.assignedTo)}</TableCell>
      <TableCell>{getCategoryBadge(task.category)}</TableCell>
      <TableCell>{getPriorityBadge(task.priority)}</TableCell>
      <TableCell>
        {task.dueDate ? (
          <div className="flex items-center text-sm">
            <CalendarIcon size={14} className="mr-1 text-gray-500" />
            {format(new Date(task.dueDate), 'dd MMM yyyy', { locale: fr })}
          </div>
        ) : (
          <span className="text-gray-400 text-sm">Non définie</span>
        )}
      </TableCell>
      <TableCell className="text-right">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onEditTask(task)}
          className="h-8 w-8 p-0 mr-1"
        >
          <Edit size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onDeleteTask(task.id)}
          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <Trash2 size={16} />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default TaskItem;
