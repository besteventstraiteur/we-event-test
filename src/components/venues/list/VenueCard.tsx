
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Download, MapPin } from 'lucide-react';
import { Venue } from '@/types/venueTypes';

interface VenueCardProps {
  venue: Venue;
  onViewFloorPlan: (venue: Venue) => void;
  onDownloadPlan: (venue: Venue) => void;
}

const VenueCard: React.FC<VenueCardProps> = ({ venue, onViewFloorPlan, onDownloadPlan }) => {
  return (
    <Card className={`bg-vip-gray-800 border-vip-gray-700 overflow-hidden transition-all duration-300`}>
      <div className="h-40 bg-vip-gray-700 flex items-center justify-center relative overflow-hidden">
        {venue.imageUrl ? (
          <img 
            src={venue.imageUrl} 
            alt={venue.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        ) : (
          <svg className="h-12 w-12 text-vip-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        )}
        
        {venue.price && (
          <Badge className="absolute top-2 right-2 bg-vip-gold text-vip-black">
            {venue.price}
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-bold text-vip-white mb-1">{venue.name}</h3>
        <p className="text-sm text-vip-gray-400 mb-2">{venue.partner}</p>
        <div className="flex justify-between items-center text-sm text-vip-gray-400 mb-3">
          <div className="flex items-center">
            <MapPin size={12} className="mr-1" />
            <span>{venue.location}</span>
          </div>
          <span>{venue.capacity} personnes</span>
        </div>
        <div className="flex mt-4 justify-between">
          <Button
            variant="outline"
            size="sm"
            className="text-vip-gray-400 border-vip-gray-600 hover:text-vip-white"
            onClick={() => onViewFloorPlan(venue)}
          >
            <Eye size={16} className="mr-1" /> Voir le plan
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-vip-gray-400 hover:text-vip-white"
            onClick={() => onDownloadPlan(venue)}
          >
            <Download size={16} className="mr-1" /> Télécharger
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VenueCard;
