
import * as z from "zod";

export const loginFormSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
  rememberMe: z.boolean().default(false)
});

export const registerClientSchema = z.object({
  firstName: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
  lastName: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Email invalide" }),
  phone: z.string().regex(/^[0-9+ -]{8,}$/, { message: "Numéro de téléphone invalide" }),
  password: z.string()
    .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
    .regex(/[A-Z]/, { message: "Le mot de passe doit contenir au moins une majuscule" })
    .regex(/[0-9]/, { message: "Le mot de passe doit contenir au moins un chiffre" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export const registerPartnerSchema = z.object({
  companyName: z.string().min(2, { message: "Le nom de l'entreprise doit contenir au moins 2 caractères" }),
  siret: z.string().regex(/^[0-9]{14}$/, { message: "SIRET invalide" }),
  address: z.string().min(10, { message: "Adresse invalide" }),
  email: z.string().email({ message: "Email invalide" }),
  phone: z.string().regex(/^[0-9+ -]{8,}$/, { message: "Numéro de téléphone invalide" }),
  description: z.string().min(20, { message: "La description doit contenir au moins 20 caractères" }),
  category: z.string().min(1, { message: "Veuillez sélectionner une catégorie" }),
  password: z.string()
    .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
    .regex(/[A-Z]/, { message: "Le mot de passe doit contenir au moins une majuscule" })
    .regex(/[0-9]/, { message: "Le mot de passe doit contenir au moins un chiffre" }),
  confirmPassword: z.string(),
  subscriptionTier: z.enum(["premium", "standard", "free"])
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type RegisterClientFormValues = z.infer<typeof registerClientSchema>;
export type RegisterPartnerFormValues = z.infer<typeof registerPartnerSchema>;
