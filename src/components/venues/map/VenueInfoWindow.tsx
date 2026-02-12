
import React from 'react';
import { InfoWindow } from '@react-google-maps/api';
import { MapPin } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMapContext } from './MapContext';

interface MapMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  price?: string;
  imageUrl?: string;
}

interface VenueInfoWindowProps {
  marker: MapMarker;
  onVenueSelect?: (venueId: string) => void;
}

const VenueInfoWindow: React.FC<VenueInfoWindowProps> = ({ marker, onVenueSelect }) => {
  const { setSelectedMarkerId } = useMapContext();

  const handleCloseClick = () => {
    setSelectedMarkerId(null);
  };

  return (
    <InfoWindow
      position={{ lat: marker.lat, lng: marker.lng }}
      onCloseClick={handleCloseClick}
    >
      <Card className="bg-vip-gray-800 border-vip-gray-700 shadow-xl max-w-[250px]">
        <div className="h-32 bg-vip-gray-700 relative overflow-hidden">
          {marker.imageUrl ? (
            <img 
              src={marker.imageUrl} 
              alt={marker.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-vip-gray-500">
              <MapPin size={24} />
            </div>
          )}
          {marker.price && (
            <Badge className="absolute top-2 right-2 bg-vip-gold text-vip-black">
              {marker.price}
            </Badge>
          )}
        </div>
        <CardContent className="p-3">
          <h3 className="font-medium text-white mb-2">{marker.name}</h3>
          <Button 
            size="sm" 
            variant="outline" 
            className="w-full border-vip-gray-600 text-vip-gray-400 hover:text-vip-white"
            onClick={() => onVenueSelect?.(marker.id)}
          >
            Voir les détails
          </Button>
        </CardContent>
      </Card>
    </InfoWindow>
  );
};

export default VenueInfoWindow;
