
import React from 'react';
import { Button } from "@/components/ui/button";
import { LayoutGrid, Square, RectangleHorizontal, CircleIcon } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RoomPreset {
  id: string;
  name: string;
  width: number;
  height: number;
  icon: React.ReactNode;
}

const roomPresets: RoomPreset[] = [
  {
    id: 'rectangular-hall',
    name: 'Grande salle rectangulaire',
    width: 1000,
    height: 600,
    icon: <RectangleHorizontal className="mr-2 h-4 w-4" />
  },
  {
    id: 'square-room',
    name: 'Salle carrée',
    width: 500,
    height: 500,
    icon: <Square className="mr-2 h-4 w-4" />
  },
  {
    id: 'small-room',
    name: 'Petite salle',
    width: 400,
    height: 300,
    icon: <RectangleHorizontal className="mr-2 h-4 w-4" />
  },
  {
    id: 'circular-hall',
    name: 'Salle circulaire',
    width: 600,
    height: 600,
    icon: <CircleIcon className="mr-2 h-4 w-4" />
  },
];

interface RoomPresetsSelectorProps {
  onSelectPreset: (width: number, height: number) => void;
}

const RoomPresetsSelector: React.FC<RoomPresetsSelectorProps> = ({ onSelectPreset }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full sm:w-auto bg-white border-gray-200 text-gray-700 hover:bg-gray-100"
        >
          <LayoutGrid className="mr-2 h-4 w-4" />
          Préréglages
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white border-gray-200">
        <DropdownMenuLabel>Dimensions préréglées</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {roomPresets.map((preset) => (
            <DropdownMenuItem 
              key={preset.id}
              onClick={() => onSelectPreset(preset.width, preset.height)}
              className="cursor-pointer"
            >
              {preset.icon}
              <span>{preset.name}</span>
              <span className="ml-auto text-xs text-gray-500">
                {preset.width}×{preset.height}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RoomPresetsSelector;
