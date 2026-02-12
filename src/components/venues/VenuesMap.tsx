
import React from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { MapProvider, useMapContext } from './map/MapContext';
import MapKeyInput from './map/MapKeyInput';
import LoadingIndicator from './map/LoadingIndicator';
import MapErrorDisplay from './map/MapErrorDisplay';
import GoogleMapComponent from './map/GoogleMapComponent';

interface VenueMapProps {
  venues: any[];
  onVenueSelect?: (venueId: string) => void;
}

interface MapMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  price?: string;
  imageUrl?: string;
}

const VenuesMapContent: React.FC<VenueMapProps> = ({ venues, onVenueSelect }) => {
  const { mapKey, isKeySet } = useMapContext();
  
  // Create markers from venue data
  const markers: MapMarker[] = venues
    .filter(venue => venue.coordinates?.lat && venue.coordinates?.lng)
    .map(venue => ({
      id: venue.id,
      name: venue.name,
      lat: venue.coordinates.lat,
      lng: venue.coordinates.lng,
      price: venue.price,
      imageUrl: venue.imageUrl
    }));

  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: mapKey || 'PLACEHOLDER_API_KEY',
    id: 'google-map-script'
  });

  if (loadError) {
    return <MapErrorDisplay />;
  }

  if (!isKeySet) {
    return <MapKeyInput />;
  }

  return (
    <div className="w-full h-[500px] relative overflow-hidden rounded-lg border border-vip-gray-700 bg-vip-gray-800 mb-4">
      {!isLoaded ? (
        <LoadingIndicator />
      ) : (
        <GoogleMapComponent markers={markers} onVenueSelect={onVenueSelect} />
      )}
      
      {/* Add gradient overlay for aesthetics */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-vip-gray-900/20"></div>
    </div>
  );
};

const VenuesMap: React.FC<VenueMapProps> = ({ venues, onVenueSelect }) => {
  return (
    <MapProvider>
      <VenuesMapContent venues={venues} onVenueSelect={onVenueSelect} />
    </MapProvider>
  );
};

export default VenuesMap;
