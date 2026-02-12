
import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AvailabilityStatus } from "@/models/partnerAvailability";
import { format } from "date-fns";

interface AvailabilityEditorProps {
  selectedDate: Date | undefined;
  currentStatus: AvailabilityStatus;
  notes: string;
  setCurrentStatus: (status: AvailabilityStatus) => void;
  setNotes: (notes: string) => void;
  handleUpdateAvailability: () => void;
}

const AvailabilityEditor: React.FC<AvailabilityEditorProps> = ({
  selectedDate,
  currentStatus,
  notes,
  setCurrentStatus,
  setNotes,
  handleUpdateAvailability
}) => {
  if (!selectedDate) {
    return (
      <div className="text-center py-8 text-gray-500">
        Veuillez sélectionner une date dans le calendrier pour mettre à jour votre disponibilité.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="status" className="text-sm font-medium">Statut</label>
        <Select 
          value={currentStatus} 
          onValueChange={(value) => setCurrentStatus(value as AvailabilityStatus)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez votre disponibilité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={AvailabilityStatus.AVAILABLE}>Disponible</SelectItem>
            <SelectItem value={AvailabilityStatus.TENTATIVE}>Provisoire</SelectItem>
            <SelectItem value={AvailabilityStatus.BUSY}>Occupé</SelectItem>
            <SelectItem value={AvailabilityStatus.UNAVAILABLE}>Indisponible</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium">Notes (optionnel)</label>
        <Textarea 
          id="notes" 
          placeholder="Ajoutez des détails supplémentaires..." 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      
      <Button onClick={handleUpdateAvailability} className="w-full">
        Mettre à jour
      </Button>
    </div>
  );
};

export default AvailabilityEditor;
