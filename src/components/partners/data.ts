
import { BadgeType } from "@/models/partnerGamification";

// Catégories de partenaires
export const partnerCategories = [
  { id: "venue", name: "Domaines & Lieux" },
  { id: "photo", name: "Photographes" },
  { id: "catering", name: "Traiteurs" },
  { id: "music", name: "DJ & Musiciens" },
  { id: "flowers", name: "Fleuristes" },
  { id: "decor", name: "Décorateurs" },
  { id: "cake", name: "Pâtissiers" },
  { id: "beauty", name: "Coiffure & Maquillage" },
  { id: "transport", name: "Transport" },
  { id: "dress", name: "Robes & Costumes" },
  { id: "animation", name: "Animations" },
  { id: "planner", name: "Wedding Planners" },
];

// Données initiales des partenaires (version minimale pour démarrage)
export const allPartners = [
  {
    id: "partner-1",
    name: "Château des Merveilles",
    category: "venue",
    description: "Un domaine d'exception niché dans un parc de 5 hectares avec une vue imprenable sur la vallée.",
    location: "Bordeaux, France",
    rating: 4.8,
    reviewCount: 125,
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1498&q=80",
    availableDate: "2023-09-25",
    price: "€€€€",
    tags: ["château", "extérieur", "vue panoramique"],
    badges: ["quality", "verified"],
    bestAwards: true
  },
  {
    id: "partner-2",
    name: "Studio Photo Elite",
    category: "photo",
    description: "Capturez l'émotion de votre mariage à travers notre regard artistique et notre approche naturelle.",
    location: "Paris, France",
    rating: 4.9,
    reviewCount: 142,
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    availableDate: "2023-10-05",
    price: "€€€",
    tags: ["reportage", "artistique", "album"],
    badges: ["quality", "featured"],
    bestAwards: true
  }
];

// Partenaires sélectionnés par défaut (version vide pour nouveau démarrage)
export const myPartners = [];

// Helper pour récupérer l'icône du badge
export const getBadgeIcon = (badgeType: BadgeType): string => {
  const badgeConfig = {
    speed: "Zap",
    quality: "Star",
    popular: "TrendingUp",
    reliable: "Shield",
    exclusive: "Award",
    recommended: "Users",
    topRated: "ThumbsUp",
    seasonal: "Gift",
    verified: "CheckCircle",
    featured: "Crown",
    bestAwards: "Trophy"
  };
  
  return badgeConfig[badgeType] || "Award";
};
