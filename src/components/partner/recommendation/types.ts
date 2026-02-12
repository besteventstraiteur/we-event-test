
import { z } from "zod";

export const formSchema = z.object({
  clientName: z.string().min(2, { message: "Le nom du client est requis" }),
  clientEmail: z.string().email({ message: "Email invalide" }),
  clientPhone: z.string().min(10, { message: "Numéro de téléphone invalide" }),
  eventDate: z.date({ required_error: "Une date est requise" }),
  budget: z.string().min(1, { message: "Le budget est requis" }),
  details: z.string().min(10, { message: "Plus de détails sont requis" }),
  partners: z.array(z.string()).min(1, { message: "Sélectionnez au moins un prestataire" }),
});

export type RecommendationFormValues = z.infer<typeof formSchema>;

export interface CategoryType {
  label: string;
  value: string;
  partners: {
    id: string;
    name: string;
  }[];
}

export const categories: CategoryType[] = [
  { label: "DJ", value: "dj", partners: [
    { id: "dj1", name: "DJ Mix Master" },
    { id: "dj2", name: "Harmony Musique" },
    { id: "dj3", name: "Electro Events" },
  ]},
  { label: "Traiteurs", value: "caterers", partners: [
    { id: "cat1", name: "Pâtisserie Royale" },
    { id: "cat2", name: "Gastronomie Délice" },
    { id: "cat3", name: "Saveurs Exquises" },
  ]},
  { label: "Photographes", value: "photographers", partners: [
    { id: "photo1", name: "Studio Photo Elite" },
    { id: "photo2", name: "Moments Immortels" },
    { id: "photo3", name: "Captures Élégantes" },
  ]},
  { label: "Fleuristes", value: "florists", partners: [
    { id: "fleur1", name: "Fleurs Élégance" },
    { id: "fleur2", name: "Bouquets Enchantés" },
    { id: "fleur3", name: "Nature Poétique" },
  ]},
  { label: "Domaines", value: "venues", partners: [
    { id: "venue1", name: "Domaine du Château" },
    { id: "venue2", name: "Château des Lumières" },
    { id: "venue3", name: "Manoir de Prestige" },
  ]},
  { label: "Décorateurs", value: "decorators", partners: [
    { id: "deco1", name: "Décor de Rêve" },
    { id: "deco2", name: "Ambiances Magiques" },
    { id: "deco3", name: "Design Événementiel" },
  ]},
];
