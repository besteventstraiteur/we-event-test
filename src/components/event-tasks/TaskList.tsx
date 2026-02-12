
import React, { useState } from 'react';
import { EventTask } from '@/hooks/useEventTasks';
import TaskFilter from './TaskFilter';
import TaskForm from './TaskForm';
import TaskListHeader from './TaskListHeader';
import TaskTable from './TaskTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TaskListProps {
  tasks: EventTask[];
  onToggleCompletion: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Omit<EventTask, 'id'>>) => void;
  onAddTask: (task: Omit<EventTask, 'id' | 'completed'>) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleCompletion,
  onDeleteTask,
  onUpdateTask,
  onAddTask
}) => {
  const [openForm, setOpenForm] = useState(false);
  const [currentTask, setCurrentTask] = useState<EventTask | null>(null);
  const [filter, setFilter] = useState<{
    status: 'all' | 'completed' | 'pending';
    assignee: 'all' | 'couple' | 'witness' | 'both';
    category: 'all' | EventTask['category'];
    priority: 'all' | EventTask['priority'];
  }>({
    status: 'all',
    assignee: 'all',
    category: 'all',
    priority: 'all'
  });

  const handleEditTask = (task: EventTask) => {
    setCurrentTask(task);
    setOpenForm(true);
  };

  const handleAddNewTask = () => {
    setCurrentTask(null);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setCurrentTask(null);
  };

  const handleSaveTask = (task: Omit<EventTask, 'id' | 'completed'>) => {
    if (currentTask) {
      onUpdateTask(currentTask.id, task);
    } else {
      onAddTask(task);
    }
    handleCloseForm();
  };

  // Apply filters
  const filteredTasks = tasks.filter(task => {
    // Filter by status
    if (filter.status === 'completed' && !task.completed) return false;
    if (filter.status === 'pending' && task.completed) return false;
    
    // Filter by assignee
    if (filter.assignee !== 'all' && task.assignedTo !== filter.assignee && task.assignedTo !== 'both') return false;
    
    // Filter by category
    if (filter.category !== 'all' && task.category !== filter.category) return false;
    
    // Filter by priority
    if (filter.priority !== 'all' && task.priority !== filter.priority) return false;
    
    return true;
  });

  return (
    <div className="space-y-4">
      <TaskListHeader onAddNewTask={handleAddNewTask} />
      
      <TaskFilter filter={filter} onFilterChange={setFilter} />
      
      <TaskTable 
        tasks={filteredTasks}
        onToggleCompletion={onToggleCompletion}
        onDeleteTask={onDeleteTask}
        onEditTask={handleEditTask}
      />
      
      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {currentTask ? "Modifier la tâche" : "Créer une nouvelle tâche"}
            </DialogTitle>
          </DialogHeader>
          <TaskForm 
            initialTask={currentTask || undefined} 
            onSave={handleSaveTask} 
            onCancel={handleCloseForm} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskList;
