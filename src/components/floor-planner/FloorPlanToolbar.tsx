
import React from 'react';
import { Button } from "@/components/ui/button";
import { Circle, Table, Trash2 } from 'lucide-react';

interface FloorPlanToolbarProps {
  selectedTool: string;
  setSelectedTool: (tool: string) => void;
  addObject: (type: string) => void;
  deleteSelected: () => void;
  isMobile?: boolean;
}

const FloorPlanToolbar: React.FC<FloorPlanToolbarProps> = ({
  selectedTool,
  setSelectedTool,
  addObject,
  deleteSelected,
  isMobile = false
}) => {
  if (isMobile) {
    // Version simplifiée pour mobile
    return (
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        <Button
          variant={selectedTool === 'select' ? "default" : "outline"} 
          onClick={() => setSelectedTool('select')}
          className={`${selectedTool === 'select' ? "border-vip-gold text-vip-black" : "border-gray-200 text-gray-600"} min-w-[44px] h-11`}
        >
          Sélection
        </Button>
        <Button
          variant="outline"
          onClick={() => addObject('tableRonde180')}
          className="border-gray-200 text-gray-600 min-w-[44px] h-11"
        >
          <Circle size={18} />
        </Button>
        <Button
          variant="outline"
          onClick={() => addObject('tableRectangle')}
          className="border-gray-200 text-gray-600 min-w-[44px] h-11"
        >
          <Table size={18} />
        </Button>
        <Button
          variant="outline"
          onClick={deleteSelected}
          className="border-gray-200 text-red-400 min-w-[44px] h-11"
        >
          <Trash2 size={18} />
        </Button>
      </div>
    );
  }
  
  // Version desktop
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button
        variant={selectedTool === 'select' ? "default" : "outline"} 
        onClick={() => setSelectedTool('select')}
        className={selectedTool === 'select' ? "border-vip-gold text-vip-black" : "border-gray-200 text-gray-600 hover:text-gray-900"}
      >
        Sélection
      </Button>
      <Button
        variant="outline"
        onClick={() => addObject('tableRonde180')}
        className="border-gray-200 text-gray-600 hover:text-gray-900"
      >
        <Circle size={18} className="mr-2" /> Table ronde (180cm)
      </Button>
      <Button
        variant="outline"
        onClick={() => addObject('tableRonde152')}
        className="border-gray-200 text-gray-600 hover:text-gray-900"
      >
        <Circle size={16} className="mr-2" /> Table ronde (152cm)
      </Button>
      <Button
        variant="outline"
        onClick={() => addObject('tableRectangle')}
        className="border-gray-200 text-gray-600 hover:text-gray-900"
      >
        <Table size={18} className="mr-2" /> Table rectangle
      </Button>
      <Button
        variant="outline"
        onClick={() => addObject('chaise')}
        className="border-gray-200 text-gray-600 hover:text-gray-900"
      >
        Chaise
      </Button>
      <Button
        variant="outline"
        onClick={deleteSelected}
        className="border-gray-200 text-red-400 hover:text-red-600 hover:border-red-200"
      >
        <Trash2 size={18} className="mr-2" /> Supprimer
      </Button>
    </div>
  );
};

export default FloorPlanToolbar;
