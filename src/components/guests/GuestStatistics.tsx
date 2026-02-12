
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Guest } from '@/types/floorPlanTypes';

interface GuestStatisticsProps {
  guests: Guest[];
}

const GuestStatistics: React.FC<GuestStatisticsProps> = ({ guests }) => {
  // Calculate guest statistics
  const totalGuests = guests.length;
  const invitedGuests = totalGuests;
  const respondedGuests = guests.filter(guest => 
    guest.ceremonie || guest.vin || guest.repas
  ).length;
  const pendingGuests = totalGuests - respondedGuests;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-vip-gold">{totalGuests}</span>
            <span className="text-sm text-gray-500">Invités au total</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-green-600">{respondedGuests}</span>
            <span className="text-sm text-gray-500">Réponses reçues</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-amber-600">{pendingGuests}</span>
            <span className="text-sm text-gray-500">En attente de réponse</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuestStatistics;
