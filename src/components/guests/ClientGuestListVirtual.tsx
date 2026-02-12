
import React, { useState } from 'react';
import VirtualizedGuestList from './VirtualizedGuestList';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Guest } from '@/types/guestTypes';

export const ClientGuestListVirtual: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const eventId = 'current-event-id';

  // Mock guests data with complete Guest type implementation
  const mockGuests: Guest[] = Array(50).fill(0).map((_, i) => ({
    id: `guest-${i + 1}`,
    prenom: `Prénom ${i + 1}`,
    nom: `Nom ${i + 1}`,
    email: `invite${i + 1}@example.com`,
    telephone: i % 3 === 0 ? `+33 6 ${Math.floor(Math.random() * 90000000) + 10000000}` : undefined,
    statut: ['confirmed', 'pending', 'declined'][i % 3] as Guest['statut'],
    menu_option: ['standard', 'vegetarian', 'vegan', 'other'][i % 4] as Guest['menu_option'],
    ceremonie: true,
    vin: true,
    repas: true,
    brunch: i % 2 === 0,
    enfant: i % 5 === 0,
    table: i % 10 === 0 ? i / 10 + 1 : null,
    commentaires: i % 3 === 0 ? 'Commentaire test' : undefined,
    allergies: i % 4 === 0 ? ['gluten', 'lactose'] : undefined,
    conjoint: i % 6 === 0 ? `Conjoint ${i}` : undefined,
    enfants: i % 7 === 0 ? [`Enfant 1 de ${i}`, `Enfant 2 de ${i}`] : undefined,
    notes: i % 8 === 0 ? 'Notes additionnelles' : undefined
  }));

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-1/3">
          <Label htmlFor="search">Rechercher un invité</Label>
          <Input
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nom ou email..."
            className="mt-1"
          />
        </div>
        <div className="w-full md:w-1/4">
          <Label htmlFor="status">Statut</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger id="status" className="mt-1">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les statuts</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="confirmed">Confirmé</SelectItem>
              <SelectItem value="declined">Refusé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <VirtualizedGuestList 
        eventId={eventId}
        guests={mockGuests}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        className="mt-6"
      />
    </div>
  );
};

export default ClientGuestListVirtual;
