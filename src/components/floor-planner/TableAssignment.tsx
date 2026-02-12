
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Edit2, Trash2, MoreHorizontal, Users, User, Check } from 'lucide-react';

interface Guest {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  ceremonie: boolean;
  vin: boolean;
  repas: boolean;
  brunch: boolean;
  conjoint: boolean;
  enfants: number;
  table: string;
  seat?: string;
  notes: string;
  menuChoice?: string;
  menuOption?: string;
}

interface Table {
  id: string;
  name: string;
  seats: Seat[];
}

interface Seat {
  id: string;
  number: string;
  guestId?: string;
}

interface TableAssignmentProps {
  tables: Table[];
  guests: Guest[];
  onUpdateTableName: (tableId: string, newName: string) => void;
  onDeleteTable: (tableId: string) => void;
  onAssignGuest: (guestId: string, tableId: string, seatId: string) => void;
  onUnassignGuest: (guestId: string) => void;
  getGuestsForTable: (tableId: string) => Guest[];
  findSeatByGuestId: (guestId: string) => { table: Table; seat: Seat } | null;
}

const TableAssignment: React.FC<TableAssignmentProps> = ({
  tables,
  guests,
  onUpdateTableName,
  onDeleteTable,
  onAssignGuest,
  onUnassignGuest,
  getGuestsForTable,
  findSeatByGuestId
}) => {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newTableName, setNewTableName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  const handleOpenAssignDialog = (table: Table, seat: Seat) => {
    setSelectedTable(table);
    setSelectedSeat(seat);
    setIsDialogOpen(true);
  };
  
  const handleOpenRenameDialog = (table: Table) => {
    setSelectedTable(table);
    setNewTableName(table.name);
    setIsRenameDialogOpen(true);
  };
  
  const handleRenameTable = () => {
    if (!selectedTable || !newTableName.trim()) return;
    
    onUpdateTableName(selectedTable.id, newTableName.trim());
    toast({
      title: "Table renommée",
      description: `La table a été renommée en "${newTableName}"`
    });
    
    setIsRenameDialogOpen(false);
  };
  
  const handleDeleteTable = (tableId: string, tableName: string) => {
    onDeleteTable(tableId);
    toast({
      title: "Table supprimée",
      description: `La table "${tableName}" a été supprimée`
    });
  };
  
  const handleAssignGuest = (guestId: string) => {
    if (!selectedTable || !selectedSeat) return;
    
    // If this guest was already assigned to a seat, unassign them first
    const currentAssignment = findSeatByGuestId(guestId);
    if (currentAssignment) {
      onUnassignGuest(guestId);
    }
    
    // Assign to the new seat
    onAssignGuest(guestId, selectedTable.id, selectedSeat.id);
    
    const guest = guests.find(g => g.id === guestId);
    toast({
      title: "Invité assigné",
      description: `${guest?.prenom} ${guest?.nom} a été assigné à la table "${selectedTable.name}", siège ${selectedSeat.number}`
    });
    
    setIsDialogOpen(false);
  };
  
  const handleUnassignGuest = (guestId: string) => {
    onUnassignGuest(guestId);
    
    const guest = guests.find(g => g.id === guestId);
    toast({
      title: "Invité retiré",
      description: `${guest?.prenom} ${guest?.nom} a été retiré de son siège`
    });
  };
  
  const filteredGuests = searchTerm.trim() === "" 
    ? guests 
    : guests.filter(guest => 
        `${guest.prenom} ${guest.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.table.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
  const getAssignedGuest = (seat: Seat) => {
    if (!seat.guestId) return null;
    return guests.find(g => g.id === seat.guestId) || null;
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map(table => (
          <div key={table.id} className="border rounded-md p-4 bg-white">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-medium">{table.name}</h3>
                <p className="text-sm text-gray-500">
                  {table.seats.filter(s => s.guestId).length} / {table.seats.length} sièges assignés
                </p>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleOpenRenameDialog(table)}>
                    <Edit2 size={14} className="mr-2" />
                    Renommer
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-500"
                    onClick={() => handleDeleteTable(table.id, table.name)}
                  >
                    <Trash2 size={14} className="mr-2" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {table.seats.map(seat => {
                const assignedGuest = getAssignedGuest(seat);
                
                return (
                  <div 
                    key={seat.id} 
                    className={`border rounded-md p-2 cursor-pointer hover:border-gray-400 transition-colors ${
                      assignedGuest ? 'bg-green-50' : 'bg-gray-50'
                    }`}
                    onClick={() => handleOpenAssignDialog(table, seat)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">Siège {seat.number}</div>
                      {assignedGuest && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-red-500 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnassignGuest(assignedGuest.id);
                          }}
                        >
                          <Trash2 size={12} />
                        </Button>
                      )}
                    </div>
                    
                    {assignedGuest ? (
                      <div className="flex items-center mt-1">
                        <User size={14} className="text-green-600 mr-1" />
                        <span className="text-sm truncate">
                          {assignedGuest.prenom} {assignedGuest.nom}
                        </span>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400 mt-1">Non assigné</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {/* Dialog for renaming a table */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Renommer la table</DialogTitle>
            <DialogDescription>
              Donnez un nouveau nom à votre table
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Input
              value={newTableName}
              onChange={(e) => setNewTableName(e.target.value)}
              placeholder="Nom de la table"
              className="w-full"
            />
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsRenameDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleRenameTable}>
              Renommer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog for assigning a guest to a seat */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>
              Assigner un invité {selectedTable && selectedSeat && `(Table ${selectedTable.name}, Siège ${selectedSeat.number})`}
            </DialogTitle>
            <DialogDescription>
              Sélectionnez un invité à assigner à ce siège
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <Input
              placeholder="Rechercher un invité..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
            
            <div className="max-h-72 overflow-y-auto space-y-2">
              {filteredGuests.length > 0 ? (
                filteredGuests.map(guest => {
                  const currentAssignment = findSeatByGuestId(guest.id);
                  
                  return (
                    <div 
                      key={guest.id}
                      className="flex items-center justify-between border rounded-md p-3 cursor-pointer hover:bg-gray-50"
                      onClick={() => handleAssignGuest(guest.id)}
                    >
                      <div>
                        <div className="font-medium">
                          {guest.prenom} {guest.nom}
                        </div>
                        {currentAssignment && (
                          <div className="text-xs text-gray-500">
                            Actuellement à la table "{currentAssignment.table.name}", 
                            siège {currentAssignment.seat.number}
                          </div>
                        )}
                      </div>
                      {currentAssignment ? (
                        <Badge variant="outline" className="flex items-center gap-1 bg-green-50">
                          <Users size={12} />
                          <span>Assigné</span>
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Check size={12} />
                          <span>Assigner</span>
                        </Badge>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Aucun invité trouvé</p>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Annuler
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TableAssignment;
