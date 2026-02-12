
import React from "react";
import { 
  Sheet,
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle
} from "@/components/ui/sheet";
import QuoteForm from "./QuoteForm";
import { Quote } from "./QuotesList";

interface QuoteFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quote?: Quote;
  onSave: (quote: Omit<Quote, "id">) => void;
}

const QuoteFormDialog: React.FC<QuoteFormDialogProps> = ({
  open,
  onOpenChange,
  quote,
  onSave
}) => {
  const isEditing = !!quote;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {isEditing ? "Modifier le devis" : "Créer un nouveau devis"}
          </SheetTitle>
          <SheetDescription>
            {isEditing 
              ? "Modifiez les détails du devis ci-dessous"
              : "Remplissez les informations pour créer un nouveau devis"}
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6">
          <QuoteForm 
            quote={quote} 
            onSave={onSave}
            onCancel={() => onOpenChange(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default QuoteFormDialog;
