
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface FormActionsProps {
  isEditing: boolean;
  onCancel: () => void;
}

export const FormActions = ({ isEditing, onCancel }: FormActionsProps) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Annuler
      </Button>
      <Button type="submit" className="gap-1">
        <Save className="h-4 w-4" />
        {isEditing ? "Mettre à jour" : "Créer le devis"}
      </Button>
    </div>
  );
};
