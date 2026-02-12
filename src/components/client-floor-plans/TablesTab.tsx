
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TableCreation from '@/components/floor-planner/TableCreation';
import TableAssignment from '@/components/floor-planner/TableAssignment';
import type { Table, Guest } from '@/types/floorPlanTypes';

interface TablesTabProps {
  tables: Table[];
  guests: Guest[];
  onCreateTable: (name: string, seatCount: number) => string;
  onUpdateTableName: (tableId: string, newName: string) => void;
  onDeleteTable: (tableId: string) => void;
  onAssignGuest: (guestId: string, tableId: string, seatId: string) => boolean;
  onUnassignGuest: (guestId: string) => void;
  getGuestsForTable: (tableId: string) => Guest[];
  findSeatByGuestId: (guestId: string) => { table: Table; seat: { id: string; number: string; guestId?: string; } } | null;
}

const TablesTab: React.FC<TablesTabProps> = ({
  tables,
  guests,
  onCreateTable,
  onUpdateTableName,
  onDeleteTable,
  onAssignGuest,
  onUnassignGuest,
  getGuestsForTable,
  findSeatByGuestId
}) => {
  const [activeTableTab, setActiveTableTab] = useState('create');

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <CardTitle>Gestion des tables</CardTitle>
        <CardDescription>Créez des tables et placez vos invités</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTableTab} onValueChange={setActiveTableTab}>
          <TabsList className="mb-4">
            <TabsTrigger 
              value="create" 
              className="data-[state=active]:bg-vip-gold data-[state=active]:text-vip-black"
            >
              Créer une table
            </TabsTrigger>
            <TabsTrigger 
              value="assign" 
              className="data-[state=active]:bg-vip-gold data-[state=active]:text-vip-black"
            >
              Placer les invités
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="mt-2">
            <TableCreation onCreateTable={onCreateTable} />
          </TabsContent>
          
          <TabsContent value="assign" className="mt-2">
            {tables.length > 0 ? (
              <TableAssignment 
                tables={tables}
                guests={guests}
                onUpdateTableName={onUpdateTableName}
                onDeleteTable={onDeleteTable}
                onAssignGuest={onAssignGuest}
                onUnassignGuest={onUnassignGuest}
                getGuestsForTable={getGuestsForTable}
                findSeatByGuestId={findSeatByGuestId}
              />
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-md">
                <p className="text-gray-500">Aucune table créée</p>
                <p className="text-sm text-gray-400 mt-1">Commencez par créer une table dans l'onglet "Créer une table"</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TablesTab;
