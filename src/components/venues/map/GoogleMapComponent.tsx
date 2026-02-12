
import React from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { mapContainerStyle, defaultCenter, mapStyles } from './MapConfig';
import VenueMarker from './VenueMarker';
import VenueInfoWindow from './VenueInfoWindow';
import { useMapContext } from './MapContext';

interface MapMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  price?: string;
  imageUrl?: string;
}

interface GoogleMapComponentProps {
  markers: MapMarker[];
  onVenueSelect?: (venueId: string) => void;
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ markers, onVenueSelect }) => {
  const { selectedMarkerId, setSelectedMarkerId } = useMapContext();
  
  const selectedMarker = markers.find(marker => marker.id === selectedMarkerId) || null;

  const handleMapClick = () => {
    setSelectedMarkerId(null);
  };

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={selectedMarker ? { lat: selectedMarker.lat, lng: selectedMarker.lng } : defaultCenter}
      zoom={selectedMarker ? 12 : 6}
      onClick={handleMapClick}
      options={{
        styles: mapStyles,
      }}
    >
      {/* Render markers on the map */}
      {markers.map((marker) => (
        <VenueMarker key={marker.id} marker={marker} />
      ))}

      {/* InfoWindow for the selected marker */}
      {selectedMarker && (
        <VenueInfoWindow marker={selectedMarker} onVenueSelect={onVenueSelect} />
      )}
    </GoogleMap>
  );
};

export default GoogleMapComponent;
