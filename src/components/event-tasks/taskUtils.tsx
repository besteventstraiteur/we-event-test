
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { EventTask } from '@/hooks/useEventTasks';

export const getPriorityBadge = (priority: EventTask['priority']) => {
  switch (priority) {
    case 'high':
      return <Badge className="bg-red-500 text-white">Haute</Badge>;
    case 'medium':
      return <Badge className="bg-orange-500 text-white">Moyenne</Badge>;
    case 'low':
      return <Badge className="bg-green-500 text-white">Basse</Badge>;
    default:
      return null;
  }
};

export const getCategoryBadge = (category: EventTask['category']) => {
  const categories: Record<EventTask['category'], { label: string, color: string }> = {
    'venue': { label: 'Lieu', color: 'bg-purple-500' },
    'catering': { label: 'Traiteur', color: 'bg-yellow-500' },
    'decoration': { label: 'Décoration', color: 'bg-pink-500' },
    'attire': { label: 'Tenues', color: 'bg-blue-500' },
    'ceremony': { label: 'Cérémonie', color: 'bg-teal-500' },
    'reception': { label: 'Réception', color: 'bg-indigo-500' },
    'other': { label: 'Autre', color: 'bg-gray-500' }
  };
  
  const { label, color } = categories[category];
  return <Badge className={`${color} text-white`}>{label}</Badge>;
};

export const getAssigneeLabel = (assignee: EventTask['assignedTo']) => {
  switch (assignee) {
    case 'couple':
      return 'Mariés';
    case 'witness':
      return 'Témoins';
    case 'both':
      return 'Tous';
    default:
      return '';
  }
};
