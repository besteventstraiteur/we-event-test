
import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Import } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

interface FloorPlanImportButtonProps {
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isImporting?: boolean;
  className?: string;
}

const FloorPlanImportButton: React.FC<FloorPlanImportButtonProps> = ({
  onImport,
  isImporting = false,
  className = ""
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className={`relative border-vip-gray-700 text-vip-gray-400 hover:text-vip-white ${className}`}
        onClick={handleClick}
        disabled={isImporting}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Import size={18} className="mr-2" />
        Importer un plan
        
        {isHovered && (
          <div className="absolute bottom-full left-0 mb-2 p-2 bg-vip-gray-800 text-xs rounded shadow-lg w-60 text-vip-white z-50">
            Format accepté: Fichier JSON généré par l'éditeur de plan
          </div>
        )}
      </Button>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={onImport}
        accept=".json"
        className="hidden"
      />
    </>
  );
};

export default FloorPlanImportButton;
