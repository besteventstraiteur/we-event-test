
import React from 'react';
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut } from 'lucide-react';
import {
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface FloorPlanHeaderProps {
  handleZoom: (zoomIn: boolean) => void;
  readOnly: boolean;
}

const FloorPlanHeader: React.FC<FloorPlanHeaderProps> = ({
  handleZoom,
  readOnly
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <CardTitle className="text-gray-900">Éditeur de Plan</CardTitle>
        <CardDescription className="text-gray-500">
          Créez et modifiez le plan de votre salle de réception
        </CardDescription>
      </div>
      <div className="flex gap-2">
        {!readOnly && (
          <>
            <Button
              variant="outline"
              className="border-gray-200 text-gray-600 hover:text-gray-900"
              onClick={() => handleZoom(true)}
            >
              <ZoomIn size={18} />
            </Button>
            <Button
              variant="outline"
              className="border-gray-200 text-gray-600 hover:text-gray-900"
              onClick={() => handleZoom(false)}
            >
              <ZoomOut size={18} />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default FloorPlanHeader;
