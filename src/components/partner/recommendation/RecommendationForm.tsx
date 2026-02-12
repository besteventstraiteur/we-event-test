
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { formSchema, RecommendationFormValues } from "./types";
import RecommendationClientForm from "./RecommendationClientForm";
import PartnersSelector from "./PartnersSelector";
import { useRecommendationSubmit } from "./useRecommendationSubmit";

const RecommendationForm = () => {
  const form = useForm<RecommendationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      budget: "",
      details: "",
      partners: [],
    },
  });

  const { isSubmitting, handleSubmit } = useRecommendationSubmit(form);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <RecommendationClientForm form={form} />
        <PartnersSelector form={form} />
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Envoyer la recommandation
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default RecommendationForm;
