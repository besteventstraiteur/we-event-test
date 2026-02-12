
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  isEditMode: boolean;
  onCancel: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({ isEditMode, onCancel }) => {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        Annuler
      </Button>
      <Button type="submit" className="bg-vip-gold hover:bg-vip-gold/90 text-vip-black">
        {isEditMode ? 'Mettre à jour' : 'Créer'}
      </Button>
    </div>
  );
};

export default FormActions;
