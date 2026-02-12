
import React from "react";
import { 
  Sheet,
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle
} from "@/components/ui/sheet";
import OpportunityForm from "./OpportunityForm";

export interface Opportunity {
  id: string;
  name: string;
  company: string;
  value: number;
  stage: "new" | "qualified" | "proposal" | "negotiation" | "closed_won" | "closed_lost";
  source: string;
  nextStep: string;
  expectedCloseDate: string;
}

interface OpportunityFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  opportunity?: Opportunity;
  onSave: (opportunity: Omit<Opportunity, "id">) => void;
}

const OpportunityFormDialog: React.FC<OpportunityFormDialogProps> = ({
  open,
  onOpenChange,
  opportunity,
  onSave
}) => {
  const isEditing = !!opportunity;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {isEditing ? "Modifier l'opportunité" : "Créer une nouvelle opportunité"}
          </SheetTitle>
          <SheetDescription>
            {isEditing 
              ? "Modifiez les détails de l'opportunité ci-dessous"
              : "Remplissez les informations pour créer une nouvelle opportunité"}
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6">
          <OpportunityForm
            opportunity={opportunity}
            onSave={onSave}
            onCancel={() => onOpenChange(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default OpportunityFormDialog;
