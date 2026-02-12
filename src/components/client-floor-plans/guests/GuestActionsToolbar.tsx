
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, DownloadCloud } from 'lucide-react';

interface GuestActionsToolbarProps {
  onImportClick: () => void;
  onExportClick: () => void;
  isOnline: boolean;
}

const GuestActionsToolbar: React.FC<GuestActionsToolbarProps> = ({
  onImportClick,
  onExportClick,
  isOnline
}) => {
  return (
    <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={onImportClick} className="gap-2">
          <Upload size={16} />
          Importer
        </Button>
        
        <Button variant="outline" onClick={onExportClick} className="gap-2">
          <DownloadCloud size={16} />
          Exporter
        </Button>
      </div>
      
      {!isOnline && (
        <div className="bg-amber-100 px-3 py-1 rounded-full text-xs text-amber-800">
          Mode hors-ligne
        </div>
      )}
    </div>
  );
};

export default GuestActionsToolbar;
