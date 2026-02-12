
import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskFilter as FilterType } from "@/hooks/useTaskList";
import { Filter, Search, Calendar, CheckCircle, Tag } from "lucide-react";
import { useDeviceType } from "@/hooks/use-mobile";

interface TaskFilterProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const TaskFilter: React.FC<TaskFilterProps> = ({ filter, onFilterChange }) => {
  const deviceType = useDeviceType();
  const isMobile = deviceType === 'mobile';
  
  const handleFilterChange = (key: keyof FilterType, value: any) => {
    onFilterChange({
      ...filter,
      [key]: value
    });
  };
  
  return (
    <Card className="p-4 mb-6 bg-gray-50 border-gray-200">
      <div className="flex items-center mb-4 gap-2">
        <Filter size={18} className="text-gray-500" />
        <h3 className="text-lg font-medium">Filtrer les tâches</h3>
      </div>
      
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 md:grid-cols-5 gap-4'}`}>
        <div>
          <Label htmlFor="search" className="text-sm font-medium flex items-center mb-1.5">
            <Search size={14} className="mr-1.5" /> Recherche
          </Label>
          <Input
            id="search"
            placeholder="Rechercher..."
            value={filter.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="bg-white"
          />
        </div>
        
        <div>
          <Label htmlFor="status" className="text-sm font-medium flex items-center mb-1.5">
            <CheckCircle size={14} className="mr-1.5" /> Statut
          </Label>
          <Select
            value={filter.status}
            onValueChange={(value) => handleFilterChange("status", value)}
          >
            <SelectTrigger id="status" className="bg-white">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="completed">Terminées</SelectItem>
              <SelectItem value="pending">En cours</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="category" className="text-sm font-medium flex items-center mb-1.5">
            <Tag size={14} className="mr-1.5" /> Catégorie
          </Label>
          <Select
            value={filter.category}
            onValueChange={(value) => handleFilterChange("category", value)}
          >
            <SelectTrigger id="category" className="bg-white">
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              <SelectItem value="venue">Lieu</SelectItem>
              <SelectItem value="catering">Traiteur</SelectItem>
              <SelectItem value="decoration">Décoration</SelectItem>
              <SelectItem value="music">Musique</SelectItem>
              <SelectItem value="photography">Photographie</SelectItem>
              <SelectItem value="clothing">Tenues</SelectItem>
              <SelectItem value="other">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="priority" className="text-sm font-medium flex items-center mb-1.5">
            <Filter size={14} className="mr-1.5" /> Priorité
          </Label>
          <Select
            value={filter.priority}
            onValueChange={(value) => handleFilterChange("priority", value)}
          >
            <SelectTrigger id="priority" className="bg-white">
              <SelectValue placeholder="Toutes les priorités" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les priorités</SelectItem>
              <SelectItem value="high">Haute</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="low">Basse</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="dueDate" className="text-sm font-medium flex items-center mb-1.5">
            <Calendar size={14} className="mr-1.5" /> Échéance
          </Label>
          <Select
            value={filter.dueDate}
            onValueChange={(value) => handleFilterChange("dueDate", value)}
          >
            <SelectTrigger id="dueDate" className="bg-white">
              <SelectValue placeholder="Toutes les dates" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les échéances</SelectItem>
              <SelectItem value="overdue">En retard</SelectItem>
              <SelectItem value="today">Aujourd'hui</SelectItem>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};

export default TaskFilter;
