
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import FloorPlanner from '../floor-planner/FloorPlanner';
import VenueSearch from './list/VenueSearch';
import VenueGrid from './list/VenueGrid';
import { Venue } from '@/types/venueTypes';

interface VenuesListProps {
  venues: Venue[];
  selectedVenueId?: string | null;
}

const VenuesList: React.FC<VenuesListProps> = ({ venues = [], selectedVenueId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [viewFloorPlan, setViewFloorPlan] = useState(false);
  const { toast } = useToast();

  const filteredVenues = venues.filter(venue => 
    venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venue.partner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venue.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewFloorPlan = (venue: Venue) => {
    setSelectedVenue(venue);
    setViewFloorPlan(true);
  };

  const handleDownloadPlan = (venue: Venue) => {
    if (venue.floorPlan) {
      const blob = new Blob([venue.floorPlan], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${venue.name.replace(/\s+/g, '_').toLowerCase()}.json`;
      link.click();
      
      toast({
        description: `Plan téléchargé: ${venue.name}`
      });
    } else {
      toast({
        title: "Erreur",
        description: "Plan non disponible",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col">
      <Card className="bg-vip-gray-900 border-vip-gray-800 mb-4">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <CardTitle className="text-vip-white">Salles de réception prestataires</CardTitle>
              <CardDescription className="text-vip-gray-400">
                Explorez les plans des salles de nos prestataires
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <VenueSearch 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          <VenueGrid 
            venues={filteredVenues}
            onViewFloorPlan={handleViewFloorPlan}
            onDownloadPlan={handleDownloadPlan}
          />
        </CardContent>
      </Card>

      <Dialog open={viewFloorPlan} onOpenChange={setViewFloorPlan}>
        <DialogContent className="bg-vip-gray-900 border-vip-gray-800 text-vip-white max-w-5xl">
          <DialogHeader>
            <DialogTitle>Plan de salle: {selectedVenue?.name}</DialogTitle>
            <DialogDescription className="text-vip-gray-400">
              Capacité: {selectedVenue?.capacity} personnes | Prestataire: {selectedVenue?.partner}
              {selectedVenue?.price && ` | Tarif: ${selectedVenue.price}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {selectedVenue?.floorPlan ? (
              <FloorPlanner initialData={selectedVenue.floorPlan} readOnly={true} />
            ) : (
              <div className="text-center py-10 text-vip-gray-400">
                Plan non disponible pour cette salle
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              className="border-vip-gray-700 text-vip-gray-400 hover:text-vip-white"
              onClick={() => setViewFloorPlan(false)}
            >
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VenuesList;
