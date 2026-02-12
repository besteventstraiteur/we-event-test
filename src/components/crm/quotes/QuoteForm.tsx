
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Quote } from "./QuotesList";
import { quoteFormSchema, type QuoteFormValues } from "./schemas/quoteFormSchema";
import { BasicInfoFields } from "./form-sections/BasicInfoFields";
import { StatusAndDatesFields } from "./form-sections/StatusAndDatesFields";
import { FormActions } from "./form-sections/FormActions";

interface QuoteFormProps {
  quote?: Quote;
  onSave: (quote: Omit<Quote, "id">) => void;
  onCancel: () => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({
  quote,
  onSave,
  onCancel
}) => {
  const isEditing = !!quote;
  
  const defaultValues: QuoteFormValues = {
    reference: quote?.reference || "",
    clientName: quote?.clientName || "",
    totalAmount: quote?.totalAmount || 0,
    status: quote?.status || "draft",
    issueDate: quote?.issueDate ? new Date(quote.issueDate.split('/').reverse().join('-')) : new Date(),
    expiryDate: quote?.expiryDate ? new Date(quote.expiryDate.split('/').reverse().join('-')) : new Date(new Date().setMonth(new Date().getMonth() + 1)),
    eventDate: quote?.eventDate || new Date()
  };

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues
  });

  const onSubmit = (data: QuoteFormValues) => {
    const formattedQuote = {
      reference: data.reference,
      clientName: data.clientName,
      totalAmount: data.totalAmount,
      status: data.status,
      issueDate: data.issueDate.toLocaleDateString('fr-FR'),
      expiryDate: data.expiryDate.toLocaleDateString('fr-FR'),
      eventDate: data.eventDate
    };
    onSave(formattedQuote);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BasicInfoFields form={form} />
          <StatusAndDatesFields form={form} />
        </div>
        <FormActions isEditing={isEditing} onCancel={onCancel} />
      </form>
    </Form>
  );
};

export default QuoteForm;
