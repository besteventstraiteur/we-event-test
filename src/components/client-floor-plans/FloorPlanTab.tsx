
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FloorPlanner from '@/components/floor-planner/FloorPlanner';
import TableAssignment from '@/components/floor-planner/TableAssignment';
import { useIsMobile } from '@/hooks/use-mobile';
import AISeatingAssistant from './AISeatingAssistant';
import { Guest, Table } from '@/types/floorPlanTypes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface FloorPlanTabProps {
  guests: Guest[];
  tables: Table[];
  createTable: (name: string, seatCount: number) => string;
  assignGuestToSeat: (guestId: string, tableId: string, seatId: string) => boolean;
  unassignGuestFromSeat: (guestId: string) => void;
  getGuestsForTable: (tableId: string) => Guest[];
  findSeatByGuestId: (guestId: string) => any;
  savedFloorPlan?: string | null;
  onSave?: (data: string) => void;
}

const FloorPlanTab: React.FC<FloorPlanTabProps> = ({
  guests,
  tables,
  createTable,
  assignGuestToSeat,
  unassignGuestFromSeat,
  getGuestsForTable,
  findSeatByGuestId,
  savedFloorPlan,
  onSave
}) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState('floor-plan');
  const [isOnline, setIsOnline] = useState(true);
  const [localFloorPlan, setLocalFloorPlan] = useState<string | null>(null);
  
  // Handle offline/online status
  useEffect(() => {
    const updateOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      
      if (!online) {
        toast({
          title: "Mode hors-ligne activé",
          description: "Vos modifications seront enregistrées localement"
        });
      } else if (localFloorPlan && onSave) {
        // When back online, sync local changes
        toast({
          title: "Reconnecté",
          description: "Synchronisation des modifications locales en cours"
        });
        onSave(localFloorPlan);
        setLocalFloorPlan(null);
      }
    };
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Initial status
    setIsOnline(navigator.onLine);
    
    // Load local floor plan from localStorage if exists
    const cachedPlan = localStorage.getItem('cached_floor_plan');
    if (cachedPlan) {
      setLocalFloorPlan(cachedPlan);
    }
    
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [toast, onSave, localFloorPlan]);
  
  // Enhanced save function that handles both online and offline scenarios
  const handleSave = (data: string) => {
    // Save to localStorage regardless of connection status
    localStorage.setItem('cached_floor_plan', data);
    setLocalFloorPlan(data);
    
    // If online, also save to server
    if (isOnline && onSave) {
      onSave(data);
    } else {
      toast({
        title: "Enregistré localement",
        description: "Le plan sera synchronisé lorsque vous serez en ligne"
      });
    }
  };
  
  // Render different UI for mobile vs desktop
  if (isMobile) {
    return (
      <div className="space-y-4">
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="floor-plan">Plan</TabsTrigger>
            <TabsTrigger value="tables">Tables</TabsTrigger>
            <TabsTrigger value="ai">IA Assistant</TabsTrigger>
          </TabsList>
          
          <TabsContent value="floor-plan" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <FloorPlanner 
                  initialData={localFloorPlan || savedFloorPlan || undefined}
                  onSave={handleSave}
                />
              </CardContent>
            </Card>
            
            <div className="mt-4 text-xs text-center text-gray-500">
              {!isOnline ? "Mode hors-ligne: modifications enregistrées localement" : ""}
            </div>
          </TabsContent>
          
          <TabsContent value="tables" className="mt-4">
            <Card>
              <CardContent className="p-3">
                <TableAssignment 
                  guests={guests}
                  tables={tables}
                  onUpdateTableName={() => {}}
                  onDeleteTable={() => {}}
                  onAssignGuest={assignGuestToSeat}
                  onUnassignGuest={unassignGuestFromSeat}
                  getGuestsForTable={getGuestsForTable}
                  findSeatByGuestId={findSeatByGuestId}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ai" className="mt-4">
            <AISeatingAssistant 
              guests={guests}
              tables={tables}
              createTable={createTable}
              assignGuestToSeat={assignGuestToSeat}
            />
          </TabsContent>
        </Tabs>
      </div>
    );
  }
  
  // Desktop view
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <FloorPlanner 
                initialData={localFloorPlan || savedFloorPlan || undefined}
                onSave={handleSave}
              />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <AISeatingAssistant 
            guests={guests}
            tables={tables}
            createTable={createTable}
            assignGuestToSeat={assignGuestToSeat}
          />
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <TableAssignment 
            guests={guests}
            tables={tables}
            onUpdateTableName={() => {}}
            onDeleteTable={() => {}}
            onAssignGuest={assignGuestToSeat}
            onUnassignGuest={unassignGuestFromSeat}
            getGuestsForTable={getGuestsForTable}
            findSeatByGuestId={findSeatByGuestId}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default FloorPlanTab;
