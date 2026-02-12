
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Star, Award, ThumbsUp, MessageSquare, Users, Zap, Shield } from "lucide-react";
import { BadgeType } from "@/models/partnerGamification";

interface RatingBadge {
  id: string;
  type: BadgeType;
  name: string;
  description: string;
  icon: React.ReactNode;
  criteria: string;
  dateAwarded?: string; // If present, the badge has been awarded
}

interface RatingBadgesProps {
  badges: RatingBadge[];
  partnerId: string;
}

const RatingBadges: React.FC<RatingBadgesProps> = ({ badges, partnerId }) => {
  // Helper to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long'
    });
  };

  // Sort badges: awarded first, then by type
  const sortedBadges = [...badges].sort((a, b) => {
    // Awarded badges first
    if (a.dateAwarded && !b.dateAwarded) return -1;
    if (!a.dateAwarded && b.dateAwarded) return 1;
    
    // Then alphabetically by name
    return a.name.localeCompare(b.name);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-500" />
          Badges et distinctions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {sortedBadges.map((badge) => (
            <TooltipProvider key={badge.id} delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className={`flex items-center p-3 rounded-lg cursor-help ${
                      badge.dateAwarded 
                        ? 'bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200' 
                        : 'bg-gray-100 border border-gray-200 opacity-50'
                    }`}
                  >
                    <div className={`p-2 rounded-full mr-3 flex-shrink-0 ${
                      badge.dateAwarded 
                        ? 'bg-amber-500 text-white' 
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {badge.icon}
                    </div>
                    <div>
                      <div className="font-medium">{badge.name}</div>
                      <div className="text-xs text-gray-500">
                        {badge.dateAwarded 
                          ? `Obtenu en ${formatDate(badge.dateAwarded)}` 
                          : "Non obtenu"}
                      </div>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="p-4 max-w-sm">
                  <div className="space-y-2">
                    <div className="font-medium">{badge.name}</div>
                    <p className="text-sm">{badge.description}</p>
                    <div className="text-xs text-gray-500 pt-1">
                      <div className="font-medium">Critères d'obtention:</div>
                      <div>{badge.criteria}</div>
                    </div>
                    {badge.dateAwarded && (
                      <div className="text-xs text-amber-600 font-medium pt-1">
                        Obtenu en {formatDate(badge.dateAwarded)}
                      </div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
        
        {badges.filter(b => b.dateAwarded).length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <p>Ce prestataire n'a pas encore obtenu de badges</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Predefined rating badges that can be used in the application
export const predefinedRatingBadges: RatingBadge[] = [
  {
    id: "top-rated",
    type: "topRated",
    name: "Excellence",
    description: "Prestataire excellant dans son domaine avec des avis constamment positifs",
    icon: <Star className="h-4 w-4" />,
    criteria: "Maintenir une note moyenne supérieure à 4.8/5 sur au moins 10 avis"
  },
  {
    id: "quick-response",
    type: "speed",
    name: "Réponse Éclair",
    description: "Répond rapidement aux demandes des clients",
    icon: <Zap className="h-4 w-4" />,
    criteria: "Temps de réponse moyen inférieur à 2 heures sur au moins 20 demandes"
  },
  {
    id: "super-communicator",
    type: "quality",
    name: "Super Communicant",
    description: "Excellence en communication avec les clients",
    icon: <MessageSquare className="h-4 w-4" />,
    criteria: "Note moyenne en communication supérieure à 4.7/5 sur au moins 8 avis"
  },
  {
    id: "reliable-partner",
    type: "reliable",
    name: "Fiabilité Exemplaire",
    description: "Prestataire d'une fiabilité exceptionnelle",
    icon: <Shield className="h-4 w-4" />,
    criteria: "Aucune annulation sur au moins 15 événements réalisés"
  },
  {
    id: "clients-choice",
    type: "popular",
    name: "Choix des Clients",
    description: "Particulièrement apprécié par les clients VIP",
    icon: <ThumbsUp className="h-4 w-4" />,
    criteria: "Parmi les 10% des prestataires les plus demandés dans sa catégorie"
  },
  {
    id: "veteran-partner",
    type: "verified",
    name: "Partenaire Vétéran",
    description: "Partenaire de longue date sur la plateforme",
    icon: <Award className="h-4 w-4" />,
    criteria: "Plus de 2 ans d'activité continue sur la plateforme"
  },
  {
    id: "community-contributor",
    type: "recommended",
    name: "Contributeur Communautaire",
    description: "Contribue activement à la communauté de prestataires",
    icon: <Users className="h-4 w-4" />,
    criteria: "A recommandé au moins 5 autres prestataires qui ont rejoint la plateforme"
  }
];

export default RatingBadges;
