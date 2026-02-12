
import React from 'react';
import { Marker } from '@react-google-maps/api';
import { useMapContext } from './MapContext';

interface MapMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  price?: string;
  imageUrl?: string;
}

interface VenueMarkerProps {
  marker: MapMarker;
}

const VenueMarker: React.FC<VenueMarkerProps> = ({ marker }) => {
  const { setSelectedMarkerId } = useMapContext();

  const handleMarkerClick = () => {
    setSelectedMarkerId(marker.id);
  };
  
  return (
    <Marker
      key={marker.id}
      position={{ lat: marker.lat, lng: marker.lng }}
      onClick={handleMarkerClick}
      icon={{
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTExLjI5MDUgMjEuNzYyMkMxMS4yOTA1IDIxLjc2MjIgMTkuMjkwNSAxNi43NjIyIDE5LjI5MDUgMTAuNzYyMkMxOS4yOTA1IDYuNDQ3OTEgMTUuNjA0OCAzIDE5LjI5MDUgM0M2Ljk3NzE3IDMgMi4yOTA1NCA3LjY4NjYzIDIyLjI5MDUgMTAuNzYyMkMyLjI5MDU0IDE2Ljc2MjIgMTAuMjkwNSAyMS43NjIyIDEwLjI5MDUgMjEuNzYyMkMxMC41NTcgMjIuMDc5NiAxMS4wMjQgMjIuMDc5NiAxMS4yOTA1IDIxLjc2MjJaIiBmaWxsPSIjRDRBRjM3IiBzdHJva2U9IiNENEFGMzciIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+',
        scaledSize: new google.maps.Size(32, 32),
        anchor: new google.maps.Point(16, 32),
      }}
    />
  );
};

export default VenueMarker;
