
import React from 'react';
import { Loader2 } from "lucide-react";

const LoadingFallback: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-white">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-green-600" />
        <p className="text-lg font-semibold text-gray-800">Chargement de We Event...</p>
        <p className="text-sm text-gray-500">Veuillez patienter quelques instants</p>
      </div>
    </div>
  );
};

export default LoadingFallback;
