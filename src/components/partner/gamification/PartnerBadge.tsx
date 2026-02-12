
import React from "react";
import { PartnerBadge as PartnerBadgeType } from "@/models/partnerGamification";
import { Badge } from "@/components/ui/badge";
import { 
  Award, 
  Star, 
  TrendingUp, 
  Shield, 
  Users, 
  ThumbsUp, 
  Gift, 
  CheckCircle, 
  Crown, 
  Trophy,
  Zap
} from "lucide-react";

interface PartnerBadgeProps {
  badge: PartnerBadgeType;
  size?: "sm" | "md" | "lg";
}

const PartnerBadge = ({ badge, size = "md" }: PartnerBadgeProps) => {
  const getIcon = () => {
    switch (badge.type) {
      case 'speed': return <Zap className="h-4 w-4" />;
      case 'quality': return <Star className="h-4 w-4" />;
      case 'popular': return <TrendingUp className="h-4 w-4" />;
      case 'reliable': return <Shield className="h-4 w-4" />;
      case 'exclusive': return <Award className="h-4 w-4" />;
      case 'recommended': return <Users className="h-4 w-4" />;
      case 'topRated': return <ThumbsUp className="h-4 w-4" />;
      case 'seasonal': return <Gift className="h-4 w-4" />;
      case 'verified': return <CheckCircle className="h-4 w-4" />;
      case 'featured': return <Crown className="h-4 w-4" />;
      case 'bestAwards': return <Trophy className="h-4 w-4" />;
      default: return <Award className="h-4 w-4" />;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-12 h-12';
      case 'lg': return 'w-20 h-20';
      default: return 'w-16 h-16';
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className={`${getSizeClasses()} rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white shadow-lg`}>
        {getIcon()}
      </div>
      <Badge variant="secondary" className="mt-2 text-xs">
        +{badge.points} pts
      </Badge>
    </div>
  );
};

export default PartnerBadge;
