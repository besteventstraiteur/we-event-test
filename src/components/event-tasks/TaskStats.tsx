
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { EventTask } from '@/hooks/useEventTasks';

interface TaskStatsProps {
  tasks: EventTask[];
}

const TaskStats: React.FC<TaskStatsProps> = ({ tasks }) => {
  // Calculate stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Count tasks by priority that are not completed
  const highPriorityTasks = tasks.filter(task => !task.completed && task.priority === 'high').length;
  
  // Get upcoming tasks (tasks with due dates in the next 7 days)
  const now = new Date();
  const oneWeekLater = new Date();
  oneWeekLater.setDate(now.getDate() + 7);
  
  const upcomingTasks = tasks.filter(task => {
    if (!task.completed && task.dueDate) {
      const dueDate = new Date(task.dueDate);
      return dueDate >= now && dueDate <= oneWeekLater;
    }
    return false;
  }).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Progression</p>
              <h3 className="text-2xl font-bold">{completionPercentage}%</h3>
              <p className="text-sm text-gray-500">{completedTasks} / {totalTasks} tâches</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <CheckCircle size={24} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tâches à faire</p>
              <h3 className="text-2xl font-bold">{pendingTasks}</h3>
              <p className="text-sm text-gray-500">Restantes</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Clock size={24} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Haute priorité</p>
              <h3 className="text-2xl font-bold">{highPriorityTasks}</h3>
              <p className="text-sm text-gray-500">À traiter rapidement</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <AlertCircle size={24} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">À venir</p>
              <h3 className="text-2xl font-bold">{upcomingTasks}</h3>
              <p className="text-sm text-gray-500">Dans les 7 jours</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <Clock size={24} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskStats;
