
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, Smartphone } from 'lucide-react';
import type { Guest } from '@/types/floorPlanTypes';
import { useToast } from '@/hooks/use-toast';

interface ImportGuestsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onImportContacts: () => void;
  onImportCsv: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isNative: boolean;
}

const ImportGuestsDialog: React.FC<ImportGuestsDialogProps> = ({
  isOpen,
  onOpenChange,
  onImportContacts,
  onImportCsv,
  isNative
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Importer des invités</DialogTitle>
          <DialogDescription>
            Importez vos invités depuis différentes sources
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {isNative && (
            <Button 
              onClick={onImportContacts} 
              variant="outline" 
              className="w-full gap-2 justify-start p-4 h-auto"
            >
              <Smartphone className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Contacts du téléphone</div>
                <div className="text-sm text-gray-500">Importez directement depuis vos contacts</div>
              </div>
            </Button>
          )}
          
          <Button
            variant="outline"
            className="w-full gap-2 justify-start p-4 h-auto"
            onClick={() => document.getElementById('csv-upload')?.click()}
          >
            <Upload className="h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">Fichier CSV</div>
              <div className="text-sm text-gray-500">Importez depuis Excel, Google Sheets, etc.</div>
            </div>
            <input
              id="csv-upload"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={onImportCsv}
            />
          </Button>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportGuestsDialog;
