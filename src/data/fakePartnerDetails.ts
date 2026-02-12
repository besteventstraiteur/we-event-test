// Fake detailed partner data for development/demo of Provider-details page

export const fakePartnerDetails: Record<string, any> = {
  "1": {
    id: "1",
    businessName: "Élégance Florale",
    businessDescription: "Créateur de bouquets et décorateur floral pour vos événements les plus précieux. Avec plus de 15 ans d'expérience, nous transformons vos célébrations en moments inoubliables grâce à des compositions florales uniques et sur mesure. Notre passion pour les fleurs se reflète dans chaque création, alliant élégance, fraîcheur et créativité.",
    email: "contact@elegance-florale.fr",
    phone: "+33 1 42 60 12 34",
    address: "15 Rue de la Paix",
    city: "Paris",
    postalCode: "75002",
    country: "France",
    website: "https://elegance-florale.fr",
    isVerified: true,
    averageResponseTime: "< 2h",
    completedEvents: 234,
    portfolioImages: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&h=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&h=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=1200&h=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&h=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517457373958-a1b29644f66e?w=1200&h=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&h=800&q=80&auto=format&fit=crop"
    ],
    socialLinks: {
      facebook: "https://facebook.com/eleganceflorale",
      instagram: "https://instagram.com/eleganceflorale",
      linkedin: "",
      youtube: ""
    },
    services: [
      { id: "1", name: "Fleuriste", isActive: true },
      { id: "2", name: "Bouquets de mariée", isActive: true },
      { id: "3", name: "Décoration florale", isActive: true }
    ],
    rating: {
      averageRating: 4.9,
      totalCount: 127,
      rating5: 98,
      rating4: 22,
      rating3: 5,
      rating2: 1,
      rating1: 1
    },
    reviews: [
      {
        id: "1",
        userName: "Marie Dupont",
        rating: 5,
        comment: "Un travail exceptionnel ! Les bouquets étaient absolument magnifiques et ont dépassé toutes nos attentes. L'équipe est professionnelle et à l'écoute. Je recommande vivement !",
        createdAt: "2024-01-15"
      },
      {
        id: "2",
        userName: "Jean Martin",
        rating: 5,
        comment: "Service impeccable pour notre mariage. Les compositions florales étaient splendides et fraîches toute la journée. Merci pour ce magnifique travail !",
        createdAt: "2024-01-10"
      },
      {
        id: "3",
        userName: "Sophie Bernard",
        rating: 4,
        comment: "Très beau travail et équipe sympathique. Seul petit bémol : délai un peu juste pour la livraison, mais le résultat final était parfait !",
        createdAt: "2024-01-05"
      }
    ]
  },
  "2": {
    id: "2",
    businessName: "Traiteur Excellence",
    businessDescription: "Spécialiste de la gastronomie événementielle depuis 1995. Notre équipe de chefs passionnés crée des expériences culinaires mémorables pour tous vos événements. Des mariages aux séminaires d'entreprise, nous mettons notre savoir-faire à votre service avec des menus personnalisés et des produits de première qualité.",
    email: "contact@traiteur-excellence.fr",
    phone: "+33 1 45 62 89 45",
    address: "42 Avenue des Champs-Élysées",
    city: "Paris",
    postalCode: "75008",
    country: "France",
    website: "https://traiteur-excellence.fr",
    isVerified: true,
    averageResponseTime: "< 1h",
    completedEvents: 456,
    portfolioImages: [
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&h=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=1200&h=800&q=80&auto=format&fit=crop"
    ],
    socialLinks: {
      facebook: "https://facebook.com/traiteurexcellence",
      instagram: "https://instagram.com/traiteurexcellence",
      linkedin: "https://linkedin.com/company/traiteur-excellence",
      youtube: ""
    },
    services: [
      { id: "1", name: "Traiteur, Restauration & Boissons", isActive: true },
      { id: "2", name: "Menu personnalisé", isActive: true },
      { id: "3", name: "Service à table", isActive: true },
      { id: "4", name: "Buffet", isActive: true }
    ],
    rating: {
      averageRating: 4.8,
      totalCount: 189,
      rating5: 145,
      rating4: 35,
      rating3: 7,
      rating2: 1,
      rating1: 1
    },
    reviews: [
      {
        id: "1",
        userName: "Pierre Dubois",
        rating: 5,
        comment: "Une cuisine raffinée et un service irréprochable. Tous nos invités ont adoré le repas de notre mariage. Un grand merci à toute l'équipe !",
        createdAt: "2024-01-20"
      },
      {
        id: "2",
        userName: "Claire Lefebvre",
        rating: 5,
        comment: "Professionnel de A à Z. Les plats étaient délicieux et magnifiquement présentés. Je recommande sans hésitation pour tout type d'événement.",
        createdAt: "2024-01-12"
      },
      {
        id: "3",
        userName: "Thomas Moreau",
        rating: 4,
        comment: "Très bon rapport qualité-prix. Cuisine savoureuse et équipe agréable. Juste un petit délai sur le service des desserts, mais rien de grave !",
        createdAt: "2024-01-08"
      }
    ]
  },
  "3": {
    id: "3",
    businessName: "Photographie Lumière",
    businessDescription: "Photographes et vidéastes professionnels capturant l'essence de vos moments précieux. Avec un style artistique et contemporain, nous immortalisons vos émotions les plus authentiques. Spécialisés dans les mariages, événements d'entreprise et portraits, nous offrons un service haut de gamme avec des livrables rapides.",
    email: "contact@photographie-lumiere.fr",
    phone: "+33 4 78 92 45 67",
    address: "8 Rue Saint-Honoré",
    city: "Lyon",
    postalCode: "69001",
    country: "France",
    website: "https://photographie-lumiere.fr",
    isVerified: true,
    averageResponseTime: "< 3h",
    completedEvents: 178,
    portfolioImages: [
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&h=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&h=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544168190-79c17527004f?w=1200&h=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1200&h=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&h=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=1200&h=800&q=80&auto=format&fit=crop"
    ],
    socialLinks: {
      facebook: "https://facebook.com/photographielumiere",
      instagram: "https://instagram.com/photographielumiere",
      linkedin: "",
      youtube: "https://youtube.com/@photographielumiere"
    },
    services: [
      { id: "1", name: "Photographe", isActive: true },
      { id: "2", name: "Vidéaste", isActive: true },
      { id: "3", name: "Drone", isActive: true }
    ],
    rating: {
      averageRating: 5.0,
      totalCount: 98,
      rating5: 95,
      rating4: 3,
      rating3: 0,
      rating2: 0,
      rating1: 0
    },
    reviews: [
      {
        id: "1",
        userName: "Émilie Rousseau",
        rating: 5,
        comment: "Des photos absolument sublimes ! Le photographe a su capter tous les moments importants avec une sensibilité artistique remarquable. Nous sommes ravis du résultat !",
        createdAt: "2024-01-18"
      },
      {
        id: "2",
        userName: "Alexandre Laurent",
        rating: 5,
        comment: "Un vrai professionnel avec un œil artistique exceptionnel. Les vidéos sont magnifiques et montées avec beaucoup de goût. Je recommande à 100% !",
        createdAt: "2024-01-14"
      },
      {
        id: "3",
        userName: "Isabelle Petit",
        rating: 5,
        comment: "Service de qualité et résultat au-delà de nos espérances. Photos livrées rapidement et retouchées avec soin. Un grand merci !",
        createdAt: "2024-01-09"
      }
    ]
  }
};
