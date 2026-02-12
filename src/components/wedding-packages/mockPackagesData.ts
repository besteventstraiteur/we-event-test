
import { WeddingPackage } from "@/models/weddingPackage";

export const mockWeddingPackages: WeddingPackage[] = [
  {
    id: "pack-1",
    name: "Pack Essentiel",
    description: "L'essentiel pour un mariage réussi avec les prestataires essentiels",
    services: [
      {
        id: "service-1",
        type: "photography",
        vendorId: "vendor-1",
        vendorName: "Studio Photo Elite",
        description: "Couverture photo complète, de la préparation à la soirée",
        price: 150000, // 1500€
        included: true,
        canBeRemoved: false,
      },
      {
        id: "service-2",
        type: "dj",
        vendorId: "vendor-2",
        vendorName: "DJ Mix Master",
        description: "Animation musicale pendant la soirée, équipement inclus",
        price: 100000, // 1000€
        included: true,
        canBeRemoved: false,
      },
      {
        id: "service-3",
        type: "catering",
        vendorId: "vendor-3",
        vendorName: "Traiteur Délice",
        description: "Cocktail et dîner pour 80 personnes, service inclus",
        price: 800000, // 8000€
        included: true,
        canBeRemoved: false,
      },
    ],
    discount: 10,
    totalPrice: 945000, // 9450€ après réduction
    originalPrice: 1050000, // 10500€ avant réduction
    featured: false,
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000",
    rating: 4.7,
    reviewCount: 28,
    availability: [
      "2024-07-15T00:00:00.000Z",
      "2024-08-12T00:00:00.000Z",
      "2024-08-26T00:00:00.000Z",
      "2024-09-09T00:00:00.000Z",
    ],
  },
  {
    id: "pack-2",
    name: "Pack Élégance",
    description: "Une formule complète pour un mariage élégant et mémorable",
    services: [
      {
        id: "service-4",
        type: "photography",
        vendorId: "vendor-4",
        vendorName: "Objectif Emotion",
        description: "Reportage photo premium avec album inclus",
        price: 180000, // 1800€
        included: true,
        canBeRemoved: false,
      },
      {
        id: "service-5",
        type: "videography",
        vendorId: "vendor-5",
        vendorName: "Ciné Mariage",
        description: "Film de mariage professionnel, montage inclus",
        price: 200000, // 2000€
        included: true,
        canBeRemoved: true,
      },
      {
        id: "service-6",
        type: "dj",
        vendorId: "vendor-6",
        vendorName: "Melody Events",
        description: "DJ professionnel avec équipement son et lumière haut de gamme",
        price: 130000, // 1300€
        included: true,
        canBeRemoved: false,
      },
      {
        id: "service-7",
        type: "catering",
        vendorId: "vendor-7",
        vendorName: "Saveurs Gourmandes",
        description: "Menu gastronomique pour 100 personnes, service et boissons inclus",
        price: 1200000, // 12000€
        included: true,
        canBeRemoved: false,
      },
      {
        id: "service-8",
        type: "decoration",
        vendorId: "vendor-8",
        vendorName: "Décor Enchanteur",
        description: "Décoration complète de la salle et des tables",
        price: 350000, // 3500€
        included: true,
        canBeRemoved: true,
      },
    ],
    discount: 15,
    totalPrice: 1751000, // 17510€ après réduction
    originalPrice: 2060000, // 20600€ avant réduction
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1509927083814-b8bce181c34d?q=80&w=1000",
    rating: 4.9,
    reviewCount: 42,
    availability: [
      "2024-07-08T00:00:00.000Z",
      "2024-07-22T00:00:00.000Z",
      "2024-08-05T00:00:00.000Z",
      "2024-09-02T00:00:00.000Z",
    ],
  },
  {
    id: "pack-3",
    name: "Pack Prestige",
    description: "Le nec plus ultra pour un mariage de luxe inoubliable",
    services: [
      {
        id: "service-9",
        type: "photography",
        vendorId: "vendor-9",
        vendorName: "Art & Lumière",
        description: "Duo de photographes, reportage complet et album prestige",
        price: 250000, // 2500€
        included: true,
        canBeRemoved: false,
      },
      {
        id: "service-10",
        type: "videography",
        vendorId: "vendor-10",
        vendorName: "Vision Cinéma",
        description: "Film cinématique avec drone et équipe de tournage",
        price: 300000, // 3000€
        included: true,
        canBeRemoved: false,
      },
      {
        id: "service-11",
        type: "dj",
        vendorId: "vendor-11",
        vendorName: "Prestige Sound",
        description: "DJ et orchestre live pour la soirée",
        price: 280000, // 2800€
        included: true,
        canBeRemoved: false,
      },
      {
        id: "service-12",
        type: "catering",
        vendorId: "vendor-12",
        vendorName: "Chef Étoilé Réceptions",
        description: "Menu gastronomique étoilé pour 120 personnes, open bar inclus",
        price: 1800000, // 18000€
        included: true,
        canBeRemoved: false,
      },
      {
        id: "service-13",
        type: "decoration",
        vendorId: "vendor-13",
        vendorName: "Luxe & Élégance",
        description: "Scénographie complète, fleurs et éclairage architectural",
        price: 500000, // 5000€
        included: true,
        canBeRemoved: false,
      },
      {
        id: "service-14",
        type: "car",
        vendorId: "vendor-14",
        vendorName: "Voitures de Prestige",
        description: "Limousine avec chauffeur pour toute la journée",
        price: 120000, // 1200€
        included: true,
        canBeRemoved: true,
      },
      {
        id: "service-15",
        type: "venue",
        vendorId: "vendor-15",
        vendorName: "Château des Lumières",
        description: "Location exclusive du château et de son parc",
        price: 800000, // 8000€
        included: true,
        canBeRemoved: false,
      },
    ],
    discount: 20,
    totalPrice: 3240000, // 32400€ après réduction
    originalPrice: 4050000, // 40500€ avant réduction
    featured: false,
    imageUrl: "https://images.unsplash.com/photo-1529636798458-92182e662485?q=80&w=1000",
    rating: 5.0,
    reviewCount: 15,
    availability: [
      "2024-07-01T00:00:00.000Z",
      "2024-08-19T00:00:00.000Z",
      "2024-09-16T00:00:00.000Z",
      "2024-10-07T00:00:00.000Z",
    ],
  },
];
