
import React from 'react';
import { MapPin } from 'lucide-react';

const MapErrorDisplay: React.FC = () => {
  return (
    <div className="w-full h-[500px] flex items-center justify-center bg-vip-gray-800 rounded-lg border border-vip-gray-700">
      <div className="text-center p-6">
        <MapPin className="h-12 w-12 text-vip-gold mb-4 mx-auto" />
        <h3 className="text-white text-lg font-semibold mb-2">Erreur de chargement de la carte</h3>
        <p className="text-vip-gray-400">Impossible de charger Google Maps. Veuillez vérifier votre connexion et réessayer.</p>
      </div>
    </div>
  );
};

export default MapErrorDisplay;
