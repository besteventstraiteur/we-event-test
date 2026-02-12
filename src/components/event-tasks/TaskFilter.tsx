
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EventTask } from '@/hooks/useEventTasks';

interface TaskFilterProps {
  filter: {
    status: 'all' | 'completed' | 'pending';
    assignee: 'all' | 'couple' | 'witness' | 'both';
    category: 'all' | EventTask['category'];
    priority: 'all' | EventTask['priority'];
  };
  onFilterChange: (filter: TaskFilterProps['filter']) => void;
}

const TaskFilter: React.FC<TaskFilterProps> = ({ filter, onFilterChange }) => {
  const handleFilterChange = (key: keyof TaskFilterProps['filter'], value: string) => {
    onFilterChange({
      ...filter,
      [key]: value
    });
  };

  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <div className="w-full sm:w-auto">
        <Select
          value={filter.status}
          onValueChange={(value) => handleFilterChange('status', value)}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="pending">À faire</SelectItem>
            <SelectItem value="completed">Terminé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full sm:w-auto">
        <Select
          value={filter.assignee}
          onValueChange={(value) => handleFilterChange('assignee', value)}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Assignée à" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="couple">Mariés</SelectItem>
            <SelectItem value="witness">Témoins</SelectItem>
            <SelectItem value="both">Les deux</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full sm:w-auto">
        <Select
          value={filter.category}
          onValueChange={(value) => handleFilterChange('category', value as EventTask['category'] | 'all')}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes catégories</SelectItem>
            <SelectItem value="venue">Lieu</SelectItem>
            <SelectItem value="catering">Traiteur</SelectItem>
            <SelectItem value="decoration">Décoration</SelectItem>
            <SelectItem value="attire">Tenues</SelectItem>
            <SelectItem value="ceremony">Cérémonie</SelectItem>
            <SelectItem value="reception">Réception</SelectItem>
            <SelectItem value="other">Autre</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full sm:w-auto">
        <Select
          value={filter.priority}
          onValueChange={(value) => handleFilterChange('priority', value as EventTask['priority'] | 'all')}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Priorité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes priorités</SelectItem>
            <SelectItem value="low">Basse</SelectItem>
            <SelectItem value="medium">Moyenne</SelectItem>
            <SelectItem value="high">Haute</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TaskFilter;
