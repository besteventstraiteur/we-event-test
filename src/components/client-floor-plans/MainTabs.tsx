
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FloorPlanTab from './FloorPlanTab';
import TablesTab from './TablesTab';
import GuestsTab from './GuestsTab';
import VenuesTab from './VenuesTab';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import type { Guest, Table } from '@/types/floorPlanTypes';

interface MainTabsProps {
  guests: Guest[];
  setGuests: (guests: Guest[]) => void;
  tables: Table[];
  createTable: (name: string, seatCount?: number) => string;
  updateTableName: (tableId: string, newName: string) => void;
  deleteTable: (tableId: string) => void;
  assignGuestToSeat: (guestId: string, tableId: string, seatId: string) => boolean;
  unassignGuestFromSeat: (guestId: string) => void;
  getGuestsForTable: (tableId: string) => Guest[];
  findSeatByGuestId: (guestId: string) => { table: Table; seat: { id: string; number: string; guestId?: string; } } | null;
  partnerVenues: any[];
}

const MainTabs: React.FC<MainTabsProps> = ({
  guests,
  setGuests,
  tables,
  createTable,
  updateTableName,
  deleteTable,
  assignGuestToSeat,
  unassignGuestFromSeat,
  getGuestsForTable,
  findSeatByGuestId,
  partnerVenues
}) => {
  const [activeTab, setActiveTab] = useState('plan');
  const [savedFloorPlan, setSavedFloorPlan] = useState<string | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Charger le plan de salle sauvegardé depuis le localStorage
  React.useEffect(() => {
    const savedPlan = localStorage.getItem('clientFloorPlan');
    if (savedPlan) {
      setSavedFloorPlan(savedPlan);
    }
  }, []);

  const handleSaveFloorPlan = (data: string) => {
    localStorage.setItem('clientFloorPlan', data);
    setSavedFloorPlan(data);
    toast({
      title: "Plan sauvegardé",
      description: "Votre plan de salle a été sauvegardé avec succès"
    });
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-3">
      <div className="overflow-x-auto -mx-2 px-2">
        <TabsList className="bg-white border border-gray-200 w-full">
          <TabsTrigger 
            value="plan" 
            className="data-[state=active]:bg-vip-gold data-[state=active]:text-vip-black text-xs sm:text-sm"
          >
            Plan de salle
          </TabsTrigger>
          <TabsTrigger 
            value="tables" 
            className="data-[state=active]:bg-vip-gold data-[state=active]:text-vip-black text-xs sm:text-sm"
          >
            Tables et placements
          </TabsTrigger>
          <TabsTrigger 
            value="guests" 
            className="data-[state=active]:bg-vip-gold data-[state=active]:text-vip-black text-xs sm:text-sm"
          >
            Liste d'invités
          </TabsTrigger>
          <TabsTrigger 
            value="venues" 
            className="data-[state=active]:bg-vip-gold data-[state=active]:text-vip-black text-xs sm:text-sm"
          >
            Salles partenaires
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="plan" className="space-y-3 mt-2">
        <FloorPlanTab 
          tables={tables}
          guests={guests}
          createTable={createTable}
          assignGuestToSeat={assignGuestToSeat}
          unassignGuestFromSeat={unassignGuestFromSeat}
          getGuestsForTable={getGuestsForTable}
          findSeatByGuestId={findSeatByGuestId}
          savedFloorPlan={savedFloorPlan}
          onSave={handleSaveFloorPlan}
        />
      </TabsContent>
      
      <TabsContent value="tables" className="space-y-3 mt-2">
        <TablesTab 
          tables={tables}
          guests={guests}
          onCreateTable={createTable}
          onUpdateTableName={updateTableName}
          onDeleteTable={deleteTable}
          onAssignGuest={assignGuestToSeat}
          onUnassignGuest={unassignGuestFromSeat}
          getGuestsForTable={getGuestsForTable}
          findSeatByGuestId={findSeatByGuestId}
        />
      </TabsContent>

      <TabsContent value="guests" className="space-y-3 mt-2">
        <GuestsTab 
          guests={guests} 
          onSave={setGuests}
          tables={tables}
        />
      </TabsContent>

      <TabsContent value="venues" className="space-y-3 mt-2">
        <VenuesTab venues={partnerVenues} />
      </TabsContent>
    </Tabs>
  );
};

export default MainTabs;
