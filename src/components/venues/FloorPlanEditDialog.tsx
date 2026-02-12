
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FloorPlanner from '@/components/floor-planner/FloorPlanner';
import { useIsMobile } from '@/hooks/use-mobile';
import FloorPlanImportButton from './FloorPlanImportButton';
import { usePlanPersistence } from '@/hooks/floor-planner/usePlanPersistence';

interface Venue {
  id: string;
  name: string;
  partner: string;
  location: string;
  capacity: number;
  description: string;
  floorPlan?: string;
}

interface FloorPlanEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  venue: Venue | null;
  onSave: (data: string) => void;
}

const FloorPlanEditDialog: React.FC<FloorPlanEditDialogProps> = ({
  open,
  onOpenChange,
  venue,
  onSave
}) => {
  const isMobile = useIsMobile();
  // Nous devons passer null au hook car nous n'avons pas encore accès au canvas
  // Le composant FloorPlanner gère son propre canvas et ses propres méthodes d'importation
  const { importPlan, isImporting } = usePlanPersistence({ canvas: null });
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`bg-vip-gray-900 border-vip-gray-800 text-vip-white ${isMobile ? 'max-w-[95vw] h-[90vh] p-3' : 'max-w-6xl h-[90vh]'}`}>
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Éditer: {venue?.name}</DialogTitle>
          <DialogDescription className="text-vip-gray-400 text-xs sm:text-sm">
            Créez ou modifiez le plan de cette salle
          </DialogDescription>
        </DialogHeader>
        
        <div className={`${isMobile ? 'py-2' : 'py-4'} h-full overflow-auto`}>
          {venue && (
            <FloorPlanner 
              initialData={venue.floorPlan} 
              onSave={onSave} 
            />
          )}
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <FloorPlanImportButton 
            onImport={importPlan} 
            isImporting={isImporting} 
          />
          
          <Button 
            variant="outline" 
            className="border-vip-gray-700 text-vip-gray-400 hover:text-vip-white"
            onClick={() => onOpenChange(false)}
          >
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FloorPlanEditDialog;
