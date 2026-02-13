// Fake detailed partner data for development/demo of Provider-details page

export const fakePartnerDetails: Record<string, any> = {
  "1": {
    id: "1",
    name: "Élégance Florale",
    description: `<p>Bienvenue chez <strong>Élégance Florale</strong>, votre créateur de bouquets et décorateur floral pour vos événements les plus précieux.</p>
    
    <p>Avec plus de <strong>15 ans d'expérience</strong>, nous transformons vos célébrations en moments inoubliables grâce à des compositions florales uniques et sur mesure. Notre passion pour les fleurs se reflète dans chaque création, alliant élégance, fraîcheur et créativité.</p>
    
    <h3>Notre expertise</h3>
    <p>Nous maîtrisons l'art de la décoration florale dans toutes ses dimensions : des bouquets de mariée romantiques aux installations florales spectaculaires pour vos réceptions. Chaque projet est unique et personnalisé selon vos désirs et votre thématique.</p>
    
    <h3>Notre engagement</h3>
    <p>Nous travaillons exclusivement avec des fleurs fraîches de saison, sélectionnées avec soin auprès de producteurs locaux. Cette démarche écoresponsable nous permet de vous offrir des créations exceptionnelles tout en respectant l'environnement.</p>
    
    <p>Que ce soit pour un mariage, un baptême, une soirée d'entreprise ou tout autre événement, nous mettons notre créativité et notre savoir-faire à votre service pour créer l'ambiance florale de vos rêves.</p>`,
    email: "contact@elegance-florale.fr",
    phoneNumber: "+33 1 42 60 12 34",
    address: "15 Rue de la Paix, 75002 Paris",
    city: "Paris",
    postcode: "75002",
    country: "France",
    webUrl: "https://elegance-florale.fr",
    isVerified: true,
    portfolioImages: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&h=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&h=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=1200&h=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&h=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517457373958-a1b29644f66e?w=1200&h=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&h=800&q=80&auto=format&fit=crop"
    ],
    fbUrl: "https://facebook.com/eleganceflorale",
    inUrl: "https://instagram.com/eleganceflorale",
    xUrl: "https://x.com/eleganceflorale",
    liUrl: "https://linkedin.com/company/elegance-florale",
    ytUrl: "https://youtube.com/@eleganceflorale",
    BusinessVideo: [
      {
        id: "1",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        type: "youtube"
      },
      {
        id: "2",
        url: "https://www.youtube.com/embed/2Vv-BfVoq4g",
        type: "youtube"
      }
    ],
    BusinessDocument: [
      {
        id: "1",
        name: "Catalogue Floral 2024",
        url: "https://example.com/catalogue.pdf",
        type: "pdf"
      },
      {
        id: "2",
        name: "Tarifs & Prestations",
        url: "https://example.com/tarifs.pdf",
        type: "pdf"
      },
      {
        id: "3",
        name: "Guide de nos Services",
        url: "https://example.com/guide.pdf",
        type: "pdf"
      }
    ],

    BusinessService: [
      { 
        businessId: "1", 
        serviceId: "1", 
        service: { 
          id: "1", 
          name: "Fleuriste", 
          isActive: true, 
          createdAt: "2023-01-01", 
          updatedAt: "2023-01-01", 
          deletedAt: null 
        } 
      },
      { 
        businessId: "1", 
        serviceId: "2", 
        service: { 
          id: "2", 
          name: "Bouquets de mariée", 
          isActive: true, 
          createdAt: "2023-01-01", 
          updatedAt: "2023-01-01", 
          deletedAt: null 
        } 
      },
      { 
        businessId: "1", 
        serviceId: "3", 
        service: { 
          id: "3", 
          name: "Décoration florale", 
          isActive: true, 
          createdAt: "2023-01-01", 
          updatedAt: "2023-01-01", 
          deletedAt: null 
        } 
      }
    ],
    RatingOverview: {
      id: "1",
      averageRating: 4.9,
      totalCount: 127,
      rating5: 98,
      rating4: 22,
      rating3: 5,
      rating2: 1,
      rating1: 1,
      createdAt: "2023-01-01",
      updatedAt: "2024-01-15",
      businessId: "1"
    },
    BusinessReview: [
      {
        id: "1",
        userName: "Marie Dupont",
        rating: 5,
        review: "Un travail exceptionnel ! Les bouquets étaient absolument magnifiques et ont dépassé toutes nos attentes. L'équipe est professionnelle et à l'écoute. Je recommande vivement !",
        createdAt: "2024-01-15"
      },
      {
        id: "2",
        userName: "Jean Martin",
        rating: 5,
        review: "Service impeccable pour notre mariage. Les compositions florales étaient splendides et fraîches toute la journée. Merci pour ce magnifique travail !",
        createdAt: "2024-01-10"
      },
      {
        id: "3",
        userName: "Sophie Bernard",
        rating: 4,
        review: "Très beau travail et équipe sympathique. Seul petit bémol : délai un peu juste pour la livraison, mais le résultat final était parfait !",
        createdAt: "2024-01-05"
      },
      {
        id: "4",
        userName: "Laurent Durand",
        rating: 5,
        review: "Des créations florales époustouflantes ! Chaque détail était pensé avec soin. Un immense merci pour avoir sublimé notre événement.",
        createdAt: "2024-01-20"
      },
      {
        id: "5",
        userName: "Céline Moreau",
        rating: 5,
        review: "Professionnel, créatif et ponctuel. Les fleurs ont fait l'unanimité auprès de tous nos invités. Je recommande les yeux fermés !",
        createdAt: "2024-01-25"
      }
    ]
  },
  "2": {
    id: "2",
    name: "Traiteur Excellence",
    description: `<p>Bienvenue chez <strong>Traiteur Excellence</strong>, spécialiste de la gastronomie événementielle depuis 1995.</p>
    
    <p>Notre équipe de chefs passionnés crée des expériences culinaires mémorables pour tous vos événements. Des mariages aux séminaires d'entreprise, nous mettons notre savoir-faire à votre service avec des menus personnalisés et des produits de première qualité.</p>
    
    <h3>Notre savoir-faire</h3>
    <p>Chaque plat est préparé avec passion dans nos cuisines équipées selon les normes les plus strictes. Nous privilégions les circuits courts et les produits de saison pour garantir fraîcheur et qualité exceptionnelle.</p>
    
    <h3>Nos prestations</h3>
    <p>Du cocktail dinatoire au menu gastronomique complet, en passant par le buffet convivial, nous adaptons nos prestations à vos besoins et votre budget. Service à table, buffet ou formule mixte : tout est possible !</p>
    
    <p>Faites confiance à notre expérience de plus de 25 ans pour régaler vos invités et faire de votre événement un moment inoubliable.</p>`,
    email: "contact@traiteur-excellence.fr",
    phoneNumber: "+33 1 45 62 89 45",
    address: "42 Avenue des Champs-Élysées, 75008 Paris",
    city: "Paris",
    postcode: "75008",
    country: "France",
    webUrl: "https://traiteur-excellence.fr",
    isVerified: true,
    portfolioImages: [
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=1200&h=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=1200&q=80&auto=format&fit=crop"
    ],
    fbUrl: "https://facebook.com/traiteurexcellence",
    inUrl: "https://instagram.com/traiteurexcellence",
    xUrl: "https://x.com/traiteurexcellence",
    liUrl: "https://linkedin.com/company/traiteur-excellence",
    ytUrl: "https://youtube.com/@traiteurexcellence",
    BusinessVideo: [
      {
        id: "1",
        url: "https://www.youtube.com/embed/jfKfPfyJRdk",
        type: "youtube"
      }
    ],
    BusinessDocument: [
      {
        id: "1",
        name: "Menus 2024",
        url: "https://example.com/menus-2024.pdf",
        type: "pdf"
      },
      {
        id: "2",
        name: "Grille Tarifaire",
        url: "https://example.com/tarifs-traiteur.pdf",
        type: "pdf"
      }
    ],
    BusinessService: [
      { 
        businessId: "2", 
        serviceId: "1", 
        service: { 
          id: "1", 
          name: "Traiteur, Restauration & Boissons", 
          isActive: true, 
          createdAt: "2023-01-01", 
          updatedAt: "2023-01-01", 
          deletedAt: null 
        } 
      },
      { 
        businessId: "2", 
        serviceId: "2", 
        service: { 
          id: "2", 
          name: "Menu personnalisé", 
          isActive: true, 
          createdAt: "2023-01-01", 
          updatedAt: "2023-01-01", 
          deletedAt: null 
        } 
      },
      { 
        businessId: "2", 
        serviceId: "3", 
        service: { 
          id: "3", 
          name: "Service à table", 
          isActive: true, 
          createdAt: "2023-01-01", 
          updatedAt: "2023-01-01", 
          deletedAt: null 
        } 
      },
      { 
        businessId: "2", 
        serviceId: "4", 
        service: { 
          id: "4", 
          name: "Buffet", 
          isActive: true, 
          createdAt: "2023-01-01", 
          updatedAt: "2023-01-01", 
          deletedAt: null 
        } 
      }
    ],
    RatingOverview: {
      id: "2",
      averageRating: 4.8,
      totalCount: 189,
      rating5: 145,
      rating4: 35,
      rating3: 7,
      rating2: 1,
      rating1: 1,
      createdAt: "2023-01-01",
      updatedAt: "2024-01-20",
      businessId: "2"
    },
    BusinessReview: [
      {
        id: "1",
        userName: "Pierre Dubois",
        rating: 5,
        review: "Une cuisine raffinée et un service irréprochable. Tous nos invités ont adoré le repas de notre mariage. Un grand merci à toute l'équipe !",
        createdAt: "2024-01-20"
      },
      {
        id: "2",
        userName: "Claire Lefebvre",
        rating: 5,
        review: "Professionnel de A à Z. Les plats étaient délicieux et magnifiquement présentés. Je recommande sans hésitation pour tout type d'événement.",
        createdAt: "2024-01-12"
      },
      {
        id: "3",
        userName: "Thomas Moreau",
        rating: 4,
        review: "Très bon rapport qualité-prix. Cuisine savoureuse et équipe agréable. Juste un petit délai sur le service des desserts, mais rien de grave !",
        createdAt: "2024-01-08"
      },
      {
        id: "4",
        userName: "Nathalie Blanc",
        rating: 5,
        review: "Une prestation d'exception ! La qualité des produits, la présentation des plats et le professionnalisme de l'équipe ont fait de notre événement un succès.",
        createdAt: "2024-01-25"
      }
    ]
  },
  "3": {
    id: "3",
    name: "Photographie Lumière",
    description: `<p>Photographes et vidéastes professionnels capturant l'essence de vos moments précieux.</p>
    
    <p>Avec un <strong>style artistique et contemporain</strong>, nous immortalisons vos émotions les plus authentiques. Spécialisés dans les mariages, événements d'entreprise et portraits, nous offrons un service haut de gamme avec des livrables rapides.</p>
    
    <h3>Notre approche</h3>
    <p>Nous croyons que chaque instant est unique. Notre équipe capture non seulement des images, mais des émotions, des rires, des larmes de joie. Nous racontons votre histoire à travers notre objectif avec sensibilité et créativité.</p>
    
    <h3>Nos services</h3>
    <p>Photographie professionnelle, vidéographie cinématographique, prises de vues par drone pour des perspectives spectaculaires. Nous combinons techniques modernes et sensibilité artistique pour créer des souvenirs inoubliables.</p>
    
    <p>Livrables rapides, retouches soignées et albums personnalisés : nous accompagnons votre projet de A à Z pour un résultat exceptionnel.</p>`,
    email: "contact@photographie-lumiere.fr",
    phoneNumber: "+33 4 78 92 45 67",
    address: "8 Rue Saint-Honoré, 69001 Lyon",
    city: "Lyon",
    postcode: "69001",
    country: "France",
    webUrl: "https://photographie-lumiere.fr",
    isVerified: true,
    portfolioImages: [
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&h=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&h=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544168190-79c17527004f?w=1200&h=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1200&h=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&h=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=1200&h=800&q=80&auto=format&fit=crop"
    ],
    fbUrl: "https://facebook.com/photographielumiere",
    inUrl: "https://instagram.com/photographielumiere",
    xUrl: "https://x.com/photographielumiere",
    liUrl: "https://linkedin.com/company/photographie-lumiere",
    ytUrl: "https://youtube.com/@photographielumiere",
    BusinessVideo: [
      {
        id: "1",
        url: "https://www.youtube.com/embed/L_LUpnjgPso",
        type: "youtube"
      },
      {
        id: "2",
        url: "https://www.youtube.com/embed/mwtbEGNABWU",
        type: "youtube"
      }
    ],
    BusinessDocument: [
      {
        id: "1",
        name: "Portfolio Complet 2024",
        url: "https://example.com/portfolio-photo.pdf",
        type: "pdf"
      },
      {
        id: "2",
        name: "Tarifs Photo & Vidéo",
        url: "https://example.com/tarifs-photo.pdf",
        type: "pdf"
      },
      {
        id: "3",
        name: "Forfaits Mariage",
        url: "https://example.com/forfaits-mariage.pdf",
        type: "pdf"
      }
    ],
    BusinessService: [
      { 
        businessId: "3", 
        serviceId: "1", 
        service: { 
          id: "1", 
          name: "Photographe", 
          isActive: true, 
          createdAt: "2023-01-01", 
          updatedAt: "2023-01-01", 
          deletedAt: null 
        } 
      },
      { 
        businessId: "3", 
        serviceId: "2", 
        service: { 
          id: "2", 
          name: "Vidéaste", 
          isActive: true, 
          createdAt: "2023-01-01", 
          updatedAt: "2023-01-01", 
          deletedAt: null 
        } 
      },
      { 
        businessId: "3", 
        serviceId: "3", 
        service: { 
          id: "3", 
          name: "Drone", 
          isActive: true, 
          createdAt: "2023-01-01", 
          updatedAt: "2023-01-01", 
          deletedAt: null 
        } 
      }
    ],
    RatingOverview: {
      id: "3",
      averageRating: 5.0,
      totalCount: 98,
      rating5: 95,
      rating4: 3,
      rating3: 0,
      rating2: 0,
      rating1: 0,
      createdAt: "2023-01-01",
      updatedAt: "2024-01-18",
      businessId: "3"
    },
    BusinessReview: [
      {
        id: "1",
        userName: "Émilie Rousseau",
        rating: 5,
        review: "Des photos absolument sublimes ! Le photographe a su capter tous les moments importants avec une sensibilité artistique remarquable. Nous sommes ravis du résultat !",
        createdAt: "2024-01-18"
      },
      {
        id: "2",
        userName: "Alexandre Laurent",
        rating: 5,
        review: "Un vrai professionnel avec un œil artistique exceptionnel. Les vidéos sont magnifiques et montées avec beaucoup de goût. Je recommande à 100% !",
        createdAt: "2024-01-14"
      },
      {
        id: "3",
        userName: "Isabelle Petit",
        rating: 5,
        review: "Service de qualité et résultat au-delà de nos espérances. Photos livrées rapidement et retouchées avec soin. Un grand merci !",
        createdAt: "2024-01-09"
      },
      {
        id: "4",
        userName: "Marc Bertrand",
        rating: 5,
        review: "Travail exceptionnel, très professionnel et créatif. Les photos de notre mariage sont magnifiques et capturent parfaitement l'ambiance de la journée.",
        createdAt: "2024-01-22"
      }
    ]
  }
};
