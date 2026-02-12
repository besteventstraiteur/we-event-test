
import * as z from "zod";

export const quoteFormSchema = z.object({
  reference: z.string().min(1, "La référence est requise"),
  clientName: z.string().min(1, "Le nom du client est requis"),
  totalAmount: z.coerce.number().positive("Le montant doit être positif"),
  status: z.enum(["draft", "sent", "accepted", "rejected", "expired"]),
  issueDate: z.date(),
  expiryDate: z.date(),
  eventDate: z.date()
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;
