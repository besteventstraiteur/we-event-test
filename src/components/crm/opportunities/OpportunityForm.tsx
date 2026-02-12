
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { format } from "date-fns";
import { type Opportunity } from "./OpportunityFormDialog";
import { opportunityFormSchema, type OpportunityFormValues } from "./schemas/opportunityFormSchema";
import BasicInfoFields from "./form-sections/BasicInfoFields";
import ValueStageFields from "./form-sections/ValueStageFields";
import AdditionalFields from "./form-sections/AdditionalFields";

interface OpportunityFormProps {
  opportunity?: Opportunity;
  onSave: (opportunity: Omit<Opportunity, "id">) => void;
  onCancel: () => void;
}

const OpportunityForm: React.FC<OpportunityFormProps> = ({
  opportunity,
  onSave,
  onCancel
}) => {
  const isEditing = !!opportunity;

  const defaultValues: OpportunityFormValues = {
    name: opportunity?.name || "",
    company: opportunity?.company || "",
    value: opportunity?.value || 0,
    stage: opportunity?.stage || "new",
    source: opportunity?.source || "",
    nextStep: opportunity?.nextStep || "",
    expectedCloseDate: opportunity 
      ? new Date(opportunity.expectedCloseDate.split('/').reverse().join('-')) 
      : new Date()
  };

  const form = useForm<OpportunityFormValues>({
    resolver: zodResolver(opportunityFormSchema),
    defaultValues
  });

  const onSubmit = (data: OpportunityFormValues) => {
    const formattedOpportunity: Omit<Opportunity, "id"> = {
      name: data.name,
      company: data.company,
      value: data.value,
      stage: data.stage,
      source: data.source,
      nextStep: data.nextStep,
      expectedCloseDate: format(data.expectedCloseDate, "dd/MM/yyyy")
    };
    onSave(formattedOpportunity);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BasicInfoFields form={form} />
          <ValueStageFields form={form} />
          <AdditionalFields form={form} />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" className="gap-1">
            <Save className="h-4 w-4" />
            {isEditing ? "Mettre à jour" : "Créer l'opportunité"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default OpportunityForm;
