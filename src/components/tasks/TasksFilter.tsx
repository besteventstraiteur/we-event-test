
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskFilter } from "@/hooks/useEnhancedTaskList";

interface TasksFilterProps {
  filter: TaskFilter;
  setFilter: (filter: TaskFilter) => void;
  categories: { value: string; label: string }[];
}

const TasksFilter: React.FC<TasksFilterProps> = ({
  filter,
  setFilter,
  categories
}) => {
  const handleFilterChange = (key: keyof TaskFilter, value: string) => {
    setFilter({
      ...filter,
      [key]: value
    });
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Rechercher dans les tâches..."
          className="pl-8"
          value={filter.searchTerm}
          onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="status-filter" className="text-sm">Statut</Label>
          <Select
            value={filter.status}
            onValueChange={(value) => handleFilterChange('status', value)}
          >
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="active">Tâches actives</SelectItem>
              <SelectItem value="completed">Tâches terminées</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="priority-filter" className="text-sm">Priorité</Label>
          <Select
            value={filter.priority}
            onValueChange={(value) => handleFilterChange('priority', value)}
          >
            <SelectTrigger id="priority-filter">
              <SelectValue placeholder="Filtrer par priorité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les priorités</SelectItem>
              <SelectItem value="high">Haute priorité</SelectItem>
              <SelectItem value="medium">Priorité moyenne</SelectItem>
              <SelectItem value="low">Priorité basse</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="category-filter" className="text-sm">Catégorie</Label>
          <Select
            value={filter.category}
            onValueChange={(value) => handleFilterChange('category', value)}
          >
            <SelectTrigger id="category-filter">
              <SelectValue placeholder="Filtrer par catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="due-date-filter" className="text-sm">Échéance</Label>
          <Select
            value={filter.dueDate}
            onValueChange={(value) => handleFilterChange('dueDate', value)}
          >
            <SelectTrigger id="due-date-filter">
              <SelectValue placeholder="Filtrer par échéance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les échéances</SelectItem>
              <SelectItem value="overdue">En retard</SelectItem>
              <SelectItem value="today">Aujourd'hui</SelectItem>
              <SelectItem value="tomorrow">Demain</SelectItem>
              <SelectItem value="thisWeek">Cette semaine</SelectItem>
              <SelectItem value="nextWeek">Semaine prochaine</SelectItem>
              <SelectItem value="thisMonth">Ce mois-ci</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="assignee-filter" className="text-sm">Assignée à</Label>
          <Select
            value={filter.assignee}
            onValueChange={(value) => handleFilterChange('assignee', value)}
          >
            <SelectTrigger id="assignee-filter">
              <SelectValue placeholder="Filtrer par assignation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="me">Moi</SelectItem>
              <SelectItem value="others">Autres</SelectItem>
              <SelectItem value="unassigned">Non assignées</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="shared-filter" className="text-sm">Partage</Label>
          <Select
            value={filter.shared}
            onValueChange={(value) => handleFilterChange('shared', value)}
          >
            <SelectTrigger id="shared-filter">
              <SelectValue placeholder="Filtrer par partage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="shared">Partagées</SelectItem>
              <SelectItem value="notShared">Non partagées</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="reminders-filter" className="text-sm">Rappels</Label>
          <Select
            value={filter.hasReminders}
            onValueChange={(value) => handleFilterChange('hasReminders', value)}
          >
            <SelectTrigger id="reminders-filter">
              <SelectValue placeholder="Filtrer par rappels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="withReminders">Avec rappels</SelectItem>
              <SelectItem value="withoutReminders">Sans rappels</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default TasksFilter;
