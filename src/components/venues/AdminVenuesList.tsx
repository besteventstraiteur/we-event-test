
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from 'lucide-react';

interface Venue {
  id: string;
  name: string;
  partner: string;
  location: string;
  capacity: number;
  description: string;
  floorPlan?: string;
}

interface AdminVenuesListProps {
  venues: Venue[];
  onViewFloorPlan: (venue: Venue) => void;
  onEditFloorPlan: (venue: Venue) => void;
  onEditVenue: (venue: Venue) => void;
  onRemoveVenue: (id: string) => void;
}

const AdminVenuesList: React.FC<AdminVenuesListProps> = ({
  venues,
  onViewFloorPlan,
  onEditFloorPlan,
  onEditVenue,
  onRemoveVenue
}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b-vip-gray-800 hover:bg-transparent">
            <TableHead className="text-vip-gray-400">Nom</TableHead>
            <TableHead className="text-vip-gray-400">Prestataire</TableHead>
            <TableHead className="text-vip-gray-400">Emplacement</TableHead>
            <TableHead className="text-vip-gray-400">Capacité</TableHead>
            <TableHead className="text-vip-gray-400">Plan</TableHead>
            <TableHead className="text-vip-gray-400 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {venues.length > 0 ? (
            venues.map((venue) => (
              <TableRow key={venue.id} className="border-b border-vip-gray-800 hover:bg-vip-gray-800/50">
                <TableCell className="font-medium text-vip-white">
                  {venue.name}
                </TableCell>
                <TableCell className="text-vip-gray-400">
                  {venue.partner}
                </TableCell>
                <TableCell className="text-vip-gray-400">
                  {venue.location}
                </TableCell>
                <TableCell className="text-vip-white">
                  {venue.capacity} personnes
                </TableCell>
                <TableCell className="text-vip-white">
                  {venue.floorPlan ? (
                    <span className="text-green-500">Disponible</span>
                  ) : (
                    <span className="text-red-500">Non disponible</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewFloorPlan(venue)}
                      className="h-8 text-vip-gray-400 hover:text-vip-white"
                      disabled={!venue.floorPlan}
                    >
                      <Eye size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditFloorPlan(venue)}
                      className="h-8 text-vip-gray-400 hover:text-vip-white"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditVenue(venue)}
                      className="h-8 text-vip-gray-400 hover:text-vip-white"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveVenue(venue.id)}
                      className="h-8 text-vip-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-vip-gray-400">
                Aucune salle trouvée
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminVenuesList;
