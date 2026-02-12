
import { InspirationImage } from "./PinterbestGallery";

// Données fictives pour les images d'inspiration
export const mockInspirationImages: InspirationImage[] = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1519741347686-c1e331fcb4d0",
    title: "Décoration de table élégante",
    description: "Une table dressée avec élégance pour un mariage chic et romantique",
    tags: ["décoration", "table", "élégant"],
    width: 800,
    height: 1200,
    contributor: {
      name: "Studio Élégance",
      role: "Photographe",
      avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    likes: 124
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622",
    title: "Bouquet de mariée champêtre",
    description: "Magnifique bouquet aux tons pastel pour un mariage en plein air",
    tags: ["bouquet", "champêtre", "fleurs"],
    width: 800,
    height: 600,
    contributor: {
      name: "Floral Design",
      role: "Fleuriste",
      avatarUrl: "https://randomuser.me/api/portraits/men/22.jpg"
    },
    likes: 87
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6",
    title: "Lieu de réception vue mer",
    tags: ["lieu", "reception", "mer"],
    width: 800,
    height: 1000,
    contributor: {
      name: "Voyages Events",
      role: "Admin",
      avatarUrl: "https://randomuser.me/api/portraits/women/65.jpg"
    },
    likes: 215
  },
  {
    id: "4",
    imageUrl: "https://images.unsplash.com/photo-1470319149464-1a9ee333bd47",
    title: "Arche florale cérémonie",
    description: "Superbe arche pour cérémonie en extérieur composée de fleurs sauvages",
    tags: ["cérémonie", "arche", "fleurs"],
    width: 800,
    height: 1100,
    contributor: {
      name: "Nature & Co",
      role: "Décorateur",
      avatarUrl: "https://randomuser.me/api/portraits/men/42.jpg"
    },
    likes: 156
  },
  {
    id: "5",
    imageUrl: "https://images.unsplash.com/photo-1510076857177-7470076d4098",
    title: "Gâteau de mariage rustique",
    tags: ["gâteau", "rustique", "dessert"],
    width: 800,
    height: 800,
    contributor: {
      name: "Sweet Cakes",
      role: "Pâtissier",
      avatarUrl: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    likes: 93
  },
  {
    id: "6",
    imageUrl: "https://images.unsplash.com/photo-1482575832494-7f2a9b8d0c77",
    title: "Mise en place minimaliste",
    description: "Mise en place épurée et élégante pour un mariage contemporain",
    tags: ["minimaliste", "table", "moderne"],
    width: 800,
    height: 500,
    contributor: {
      name: "Modern Events",
      role: "Designer",
      avatarUrl: "https://randomuser.me/api/portraits/men/12.jpg"
    },
    likes: 76
  },
  {
    id: "7",
    imageUrl: "https://images.unsplash.com/photo-1459501462159-97d5bded1416",
    title: "Décoration bohème",
    tags: ["bohème", "décoration", "chic"],
    width: 800,
    height: 1300,
    contributor: {
      name: "Bohème Studio",
      role: "Photographe",
      avatarUrl: "https://randomuser.me/api/portraits/women/89.jpg"
    },
    likes: 184
  },
  {
    id: "8",
    imageUrl: "https://images.unsplash.com/photo-1529636798458-92182e662485",
    title: "Alliances originales",
    description: "Alliances personnalisées pour les amoureux de nature",
    tags: ["alliances", "bijoux", "original"],
    width: 800,
    height: 600,
    contributor: {
      name: "Bijoux d'Art",
      role: "Bijoutier",
      avatarUrl: "https://randomuser.me/api/portraits/men/67.jpg"
    },
    likes: 112
  }
];

// Catégories populaires pour le carousel
export const popularCategories = [
  { id: "cat1", name: "Décorations", image: "https://images.unsplash.com/photo-1510076857177-7470076d4098" },
  { id: "cat2", name: "Lieux", image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6" },
  { id: "cat3", name: "Fleurs", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622" },
  { id: "cat4", name: "Tables", image: "https://images.unsplash.com/photo-1519741347686-c1e331fcb4d0" },
  { id: "cat5", name: "Gâteaux", image: "https://images.unsplash.com/photo-1470319149464-1a9ee333bd47" },
  { id: "cat6", name: "Tenues", image: "https://images.unsplash.com/photo-1529636798458-92182e662485" },
];
