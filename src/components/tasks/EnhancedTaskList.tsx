
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Bell, UserPlus, Star, Calendar } from "lucide-react";
import { EnhancedTask, UseEnhancedTaskListOptions, useEnhancedTaskList, TaskFilter } from "@/hooks/useEnhancedTaskList";
import { NewReminderParams } from "@/models/taskReminder";
import { NewSharingParams } from "@/models/sharedTask";
import TaskForm from "./TaskForm";
import ReminderForm from "./ReminderForm";
import SharingForm from "./SharingForm";
import TasksFilter from "./TasksFilter";
import TaskCard from "./TaskCard";
import TasksStats from "./TasksStats";

interface EnhancedTaskListProps extends Omit<UseEnhancedTaskListOptions, 'initialTasks'> {
  initialTasks?: EnhancedTask[];
}

const EnhancedTaskList: React.FC<EnhancedTaskListProps> = ({
  userId,
  userName,
  userType,
  initialTasks,
  initialCategories,
  storageKey
}) => {
  const {
    tasks,
    favoriteTasks,
    tasksWithReminders,
    sharedTasks,
    overdueTasks,
    categories,
    filter,
    setFilter,
    statistics,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    toggleFavorite,
    addReminder,
    deleteReminder,
    shareTask,
    removeSharing
  } = useEnhancedTaskList({
    userId,
    userName,
    userType,
    initialTasks,
    initialCategories,
    storageKey
  });

  const [activeTab, setActiveTab] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    type: 'task' | 'reminder' | 'sharing';
    taskId?: string;
    taskTitle?: string;
  }>({
    isOpen: false,
    type: 'task'
  });

  const { toast } = useToast();

  // Ouvre la boîte de dialogue pour ajouter/modifier une tâche
  const openTaskDialog = (task?: EnhancedTask) => {
    setDialogState({
      isOpen: true,
      type: 'task',
      taskId: task?.id,
      taskTitle: task?.title
    });
  };

  // Ouvre la boîte de dialogue pour ajouter un rappel
  const openReminderDialog = (taskId: string, taskTitle: string) => {
    setDialogState({
      isOpen: true,
      type: 'reminder',
      taskId,
      taskTitle
    });
  };

  // Ouvre la boîte de dialogue pour partager une tâche
  const openSharingDialog = (taskId: string, taskTitle: string) => {
    setDialogState({
      isOpen: true,
      type: 'sharing',
      taskId,
      taskTitle
    });
  };

  // Ferme la boîte de dialogue
  const closeDialog = () => {
    setDialogState({
      ...dialogState,
      isOpen: false
    });
  };

  // Gère l'ajout d'une tâche
  const handleAddTask = (taskData: any) => {
    addTask(taskData);
    closeDialog();
  };

  // Gère la mise à jour d'une tâche
  const handleUpdateTask = (taskData: any) => {
    if (dialogState.taskId) {
      updateTask(dialogState.taskId, taskData);
      closeDialog();
    }
  };

  // Gère l'ajout d'un rappel
  const handleAddReminder = (reminderData: NewReminderParams) => {
    if (dialogState.taskId) {
      addReminder(dialogState.taskId, reminderData);
      closeDialog();
      
      // Simuler un rappel push immédiat
      if (reminderData.type === 'push') {
        setTimeout(() => {
          toast({
            title: "Rappel de tâche",
            description: reminderData.message || `Rappel pour la tâche "${dialogState.taskTitle}"`,
          });
        }, 5000);
      }
    }
  };

  // Gère le partage d'une tâche
  const handleShareTask = (sharingData: NewSharingParams) => {
    if (dialogState.taskId) {
      shareTask(dialogState.taskId, sharingData);
      closeDialog();
    }
  };

  // Filtre les tâches en fonction de l'onglet actif
  const getFilteredTasks = (): EnhancedTask[] => {
    switch (activeTab) {
      case "favorites":
        return favoriteTasks;
      case "reminders":
        return tasksWithReminders;
      case "shared":
        return sharedTasks;
      case "overdue":
        return overdueTasks;
      default:
        return tasks;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Tâches</h2>
          <p className="text-muted-foreground">
            Gérez et suivez vos tâches, avec rappels et partage
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filtres
          </Button>
          
          <Button onClick={() => openTaskDialog()} className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle tâche
          </Button>
        </div>
      </div>
      
      {showFilters && (
        <TasksFilter 
          filter={filter}
          setFilter={setFilter}
          categories={categories}
        />
      )}
      
      <TasksStats statistics={statistics} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all" className="flex items-center">
            Toutes <span className="ml-1.5 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{tasks.length}</span>
          </TabsTrigger>
          <TabsTrigger value="favorites" className="flex items-center">
            <Star className="mr-1 h-4 w-4" /> Favorites <span className="ml-1.5 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{favoriteTasks.length}</span>
          </TabsTrigger>
          <TabsTrigger value="reminders" className="flex items-center">
            <Bell className="mr-1 h-4 w-4" /> Rappels <span className="ml-1.5 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{tasksWithReminders.length}</span>
          </TabsTrigger>
          <TabsTrigger value="shared" className="flex items-center">
            <UserPlus className="mr-1 h-4 w-4" /> Partagées <span className="ml-1.5 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{sharedTasks.length}</span>
          </TabsTrigger>
          <TabsTrigger value="overdue" className="flex items-center">
            <Calendar className="mr-1 h-4 w-4" /> En retard <span className="ml-1.5 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{overdueTasks.length}</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          {getFilteredTasks().length === 0 ? (
            <div className="bg-muted/40 border rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium mb-2">Aucune tâche trouvée</h3>
              <p className="text-muted-foreground mb-4">
                {activeTab === "all" 
                  ? "Commencez par créer votre première tâche"
                  : activeTab === "favorites"
                  ? "Marquez des tâches comme favorites pour les retrouver ici"
                  : activeTab === "reminders"
                  ? "Ajoutez des rappels à vos tâches pour les retrouver ici"
                  : activeTab === "shared"
                  ? "Partagez des tâches avec d'autres personnes pour les retrouver ici"
                  : "Vous n'avez pas de tâches en retard, bravo!"}
              </p>
              <Button onClick={() => openTaskDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Créer une tâche
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {getFilteredTasks().map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={() => toggleTaskCompletion(task.id)}
                  onToggleFavorite={() => toggleFavorite(task.id)}
                  onEdit={() => openTaskDialog(task)}
                  onDelete={() => deleteTask(task.id)}
                  onAddReminder={() => openReminderDialog(task.id, task.title)}
                  onShareTask={() => openSharingDialog(task.id, task.title)}
                  onDeleteReminder={(reminderId) => deleteReminder(task.id, reminderId)}
                  onDeleteSharing={(sharingId) => removeSharing(task.id, sharingId)}
                  categories={categories}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Dialog for task/reminder/sharing forms */}
      <Dialog open={dialogState.isOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-w-md md:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {dialogState.type === 'task' 
                ? dialogState.taskId ? "Modifier la tâche" : "Ajouter une tâche"
                : dialogState.type === 'reminder'
                ? "Ajouter un rappel"
                : "Partager la tâche"}
            </DialogTitle>
          </DialogHeader>
          
          {dialogState.type === 'task' && (
            <TaskForm
              initialTask={tasks.find(t => t.id === dialogState.taskId)}
              onSubmit={dialogState.taskId ? handleUpdateTask : handleAddTask}
              onCancel={closeDialog}
              categories={categories}
            />
          )}
          
          {dialogState.type === 'reminder' && dialogState.taskTitle && (
            <ReminderForm
              taskTitle={dialogState.taskTitle}
              onSubmit={handleAddReminder}
              onCancel={closeDialog}
            />
          )}
          
          {dialogState.type === 'sharing' && dialogState.taskTitle && (
            <SharingForm
              taskTitle={dialogState.taskTitle}
              onSubmit={handleShareTask}
              onCancel={closeDialog}
              userId={userId}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedTaskList;
