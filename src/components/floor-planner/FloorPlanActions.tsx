
import React from 'react';
import { Button } from "@/components/ui/button";
import GoldButton from '@/components/GoldButton';
import { Save, Import, Trash2, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FloorPlanActionsProps {
  createRoomPlan: () => void;
  savePlan: () => void;
  importPlan?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isMobile?: boolean;
  formatInfo?: React.ReactNode;
}

const FloorPlanActions: React.FC<FloorPlanActionsProps> = ({
  createRoomPlan,
  savePlan,
  importPlan,
  isMobile = false,
  formatInfo
}) => {
  if (isMobile) {
    // Version simplifiée pour mobile
    return (
      <div className="flex justify-between mt-4">
        <Button
          variant="outline"
          className="border-gray-200 text-gray-600 h-11 px-3"
          onClick={createRoomPlan}
        >
          <Trash2 size={18} />
        </Button>
        
        {importPlan && (
          <Button
            variant="outline"
            className="border-gray-200 text-gray-600 h-11 px-3 mx-2"
            onClick={() => {
              const fileInput = document.getElementById('import-plan');
              if (fileInput) {
                fileInput.click();
              }
            }}
          >
            <Import size={18} />
          </Button>
        )}
        
        <GoldButton 
          onClick={savePlan}
          className="h-11"
        >
          <Save size={18} />
        </GoldButton>
        
        {/* Hidden file input for import functionality */}
        {importPlan && (
          <input
            id="import-plan"
            type="file"
            accept=".json"
            className="hidden"
            onChange={importPlan}
          />
        )}
      </div>
    );
  }
  
  // Version desktop
  return (
    <div className="flex justify-between mt-4">
      <div className="flex gap-2">
        {importPlan && (
          <>
            <div className="relative flex items-center">
              <Button
                variant="outline"
                className="border-gray-200 text-gray-600 hover:text-gray-900"
                onClick={() => {
                  const fileInput = document.getElementById('import-plan');
                  if (fileInput) {
                    fileInput.click();
                  }
                }}
              >
                <Import size={18} className="mr-2" /> Importer
              </Button>
              
              {formatInfo && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 ml-1 text-gray-500 hover:text-gray-700"
                      >
                        <HelpCircle size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs">
                      {formatInfo}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            
            <input
              id="import-plan"
              type="file"
              accept=".json"
              className="hidden"
              onChange={importPlan}
            />
          </>
        )}
        
        <Button
          variant="outline"
          className="border-gray-200 text-gray-600 hover:text-gray-900"
          onClick={createRoomPlan}
        >
          <Trash2 size={18} className="mr-2" /> Réinitialiser
        </Button>
      </div>
      <GoldButton onClick={savePlan}>
        <Save size={18} className="mr-2" /> Sauvegarder
      </GoldButton>
    </div>
  );
};

export default FloorPlanActions;
