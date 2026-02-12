
import * as z from "zod";

export const opportunityFormSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  company: z.string().min(1, "Le nom de l'entreprise est requis"),
  value: z.coerce.number().positive("Le montant doit être positif"),
  stage: z.enum(["new", "qualified", "proposal", "negotiation", "closed_won", "closed_lost"]),
  source: z.string().min(1, "La source est requise"),
  nextStep: z.string().min(1, "La prochaine étape est requise"),
  expectedCloseDate: z.date()
});

export type OpportunityFormValues = z.infer<typeof opportunityFormSchema>;

export const stageOptions = [
  { label: "Nouveau", value: "new" },
  { label: "Qualifié", value: "qualified" },
  { label: "Proposition", value: "proposal" },
  { label: "Négociation", value: "negotiation" },
  { label: "Gagné", value: "closed_won" },
  { label: "Perdu", value: "closed_lost" },
] as const;
