
import React, { useRef, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import FloorPlanHeader from './FloorPlanHeader';
import FloorPlanSettings from './FloorPlanSettings';
import FloorPlanToolbar from './FloorPlanToolbar';
import FloorPlanActions from './FloorPlanActions';
import FloorPlanCanvas from './FloorPlanCanvas';
import { useIsMobile } from '@/hooks/use-mobile';
import { useFloorPlanCanvas } from '@/hooks/useFloorPlanCanvas';

interface FloorPlannerProps {
  onSave?: (data: string) => void;
  initialData?: string;
  readOnly?: boolean;
}

const FloorPlanner: React.FC<FloorPlannerProps> = ({ onSave, initialData, readOnly = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [planName, setPlanName] = useState<string>('Nouveau plan');
  const [planMode, setPlanMode] = useState<'2d' | '2d'>('2d');
  const [roomWidth, setRoomWidth] = useState<number>(700);
  const [roomHeight, setRoomHeight] = useState<number>(500);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Use our custom hook for canvas operations
  const {
    handleZoom,
    addObject,
    deleteSelected,
    updateRoomDimensions: updateCanvasDimensions,
    savePlan,
    importPlan,
    resetRoomPlan
  } = useFloorPlanCanvas({
    canvasRef,
    initialData,
    readOnly,
    isMobile,
    roomWidth,
    roomHeight
  });

  // Update room dimensions
  const updateRoomDimensions = () => {
    updateCanvasDimensions(roomWidth, roomHeight);
  };

  // Save plan handler
  const handleSavePlan = () => {
    const jsonData = savePlan(planName);
    
    if (jsonData && onSave) {
      onSave(jsonData);
      toast({
        title: "Plan sauvegardé",
        description: "Votre plan a été enregistré avec succès"
      });
    }
  };

  // Format information for help tooltip
  const formatInfo = (
    <div className="text-sm">
      <p className="font-semibold mb-1">Format d'importation compatible:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Fichier JSON généré par l'éditeur de plan</li>
        <li>Doit contenir les propriétés 'objects' et 'background'</li>
        <li>Les objets doivent avoir leurs propriétés de dimensions et positions</li>
      </ul>
    </div>
  );

  return (
    <div className="flex flex-col">
      <Card className="bg-white border-gray-200 mb-4">
        <CardHeader className="pb-3">
          <FloorPlanHeader handleZoom={handleZoom} readOnly={readOnly} />
        </CardHeader>
        <CardContent>
          {!readOnly && !isMobile && (
            <FloorPlanSettings
              planName={planName}
              setPlanName={setPlanName}
              planMode={planMode}
              setPlanMode={setPlanMode}
              roomWidth={roomWidth}
              setRoomWidth={setRoomWidth}
              roomHeight={roomHeight}
              setRoomHeight={setRoomHeight}
              updateRoomDimensions={updateRoomDimensions}
            />
          )}
          
          {!readOnly && (
            <FloorPlanToolbar
              selectedTool={selectedTool}
              setSelectedTool={setSelectedTool}
              addObject={addObject}
              deleteSelected={deleteSelected}
              isMobile={isMobile}
            />
          )}

          <FloorPlanCanvas ref={canvasRef} />

          {!readOnly && (
            <FloorPlanActions
              createRoomPlan={resetRoomPlan}
              savePlan={handleSavePlan}
              importPlan={importPlan}
              isMobile={isMobile}
              formatInfo={formatInfo}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FloorPlanner;
