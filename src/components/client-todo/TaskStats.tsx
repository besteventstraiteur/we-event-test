
import React from "react";
import { Card } from "@/components/ui/card";
import { Clock, CheckCircle2, CalendarClock, AlertTriangle, Star } from "lucide-react";
import { Task } from "@/hooks/useTaskList";
import { useDeviceType } from "@/hooks/use-mobile";

interface TaskStatsProps {
  tasks: Task[];
  favoriteTasks: Task[];
  onTaskClick: (taskId: string) => void;
}

const TaskStats: React.FC<TaskStatsProps> = ({ tasks, favoriteTasks, onTaskClick }) => {
  const deviceType = useDeviceType();
  const isMobile = deviceType === 'mobile';
  
  const getTasksByStatus = () => {
    const inProgress = tasks.filter(task => !task.completed);
    const completed = tasks.filter(task => task.completed);
    const urgent = tasks.filter(task => task.priority === "high" && !task.completed);
    
    // Tâches en retard (avec date d'échéance passée)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const overdue = tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < today && !task.completed;
    });
    
    return { inProgress, completed, urgent, overdue };
  };
  
  const { inProgress, completed, urgent, overdue } = getTasksByStatus();
  
  return (
    <div className={`grid ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-5 gap-4'} mb-6`}>
      <StatCard 
        icon={<Clock className="h-8 w-8 text-blue-500" />} 
        label={isMobile ? "En cours" : "Tâches en cours"}
        count={inProgress.length}
        bgColor="bg-blue-100"
        onClick={() => inProgress[0] && onTaskClick(inProgress[0].id)}
      />
      
      <StatCard 
        icon={<CheckCircle2 className="h-8 w-8 text-green-500" />} 
        label={isMobile ? "Terminées" : "Tâches terminées"}
        count={completed.length}
        bgColor="bg-green-100"
        onClick={() => completed[0] && onTaskClick(completed[0].id)}
      />
      
      <StatCard 
        icon={<CalendarClock className="h-8 w-8 text-amber-500" />} 
        label={isMobile ? "Échéances" : "Échéances proches"}
        count={0}
        bgColor="bg-amber-100"
        onClick={() => {}}
      />
      
      <StatCard 
        icon={<AlertTriangle className="h-8 w-8 text-red-500" />} 
        label={isMobile ? "Urgentes" : "Tâches urgentes"}
        count={urgent.length}
        bgColor="bg-red-100"
        onClick={() => urgent[0] && onTaskClick(urgent[0].id)}
      />
      
      <StatCard 
        icon={<AlertTriangle className="h-8 w-8 text-orange-500" />} 
        label={isMobile ? "En retard" : "Tâches en retard"}
        count={overdue.length}
        bgColor="bg-orange-100"
        onClick={() => overdue[0] && onTaskClick(overdue[0].id)}
      />
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  count: number;
  bgColor: string;
  onClick: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, count, bgColor, onClick }) => {
  const deviceType = useDeviceType();
  const isMobile = deviceType === 'mobile';
  
  return (
    <Card 
      className={`${bgColor} border-none shadow-sm cursor-pointer transition-transform hover:scale-105 flex flex-col items-center justify-center p-4 ${isMobile ? 'py-3' : 'py-6'}`}
      onClick={onClick}
    >
      <div className="rounded-full bg-white p-2 mb-2 flex items-center justify-center">
        {icon}
      </div>
      <p className={`font-medium text-gray-600 text-center ${isMobile ? 'text-xs mb-1' : 'text-sm mb-2'}`}>{label}</p>
      <p className="text-3xl font-bold">{count}</p>
    </Card>
  );
};

export default TaskStats;
