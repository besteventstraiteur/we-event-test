
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LOYALTY_TIERS, LoyaltyTier } from "@/models/partnerGamification";

interface LoyaltyTierCardProps {
  tier: LoyaltyTier;
  points: number;
  nextTierPoints: number;
  levelProgress: number;
}

const LoyaltyTierCard = ({ tier, points, nextTierPoints, levelProgress }: LoyaltyTierCardProps) => {
  const tierInfo = LOYALTY_TIERS[tier];
  
  // Determine the styles based on tier
  const getBgGradient = () => {
    switch (tier) {
      case 'platinum':
        return 'bg-gradient-to-br from-[#E5E4E2] to-[#7B9095]';
      case 'gold':
        return 'bg-gradient-to-br from-[#FFD700] to-[#B8860B]';
      case 'silver':
        return 'bg-gradient-to-br from-[#C0C0C0] to-[#A9A9A9]';
      default:
        return 'bg-gradient-to-br from-[#CD7F32] to-[#8B4513]';
    }
  };

  return (
    <Card className={`border-0 text-white overflow-hidden ${getBgGradient()}`}>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold">{tierInfo.name}</h3>
          <span className="text-lg font-semibold">{points} points</span>
        </div>
        
        {tier !== 'platinum' && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Niveau actuel</span>
              <span>Prochain niveau</span>
            </div>
            <Progress value={levelProgress} className="h-2 bg-black/20" />
            <div className="flex justify-between text-xs">
              <span>{points} pts</span>
              <span>{nextTierPoints} pts requis</span>
            </div>
          </div>
        )}
        
        <div className="mt-4">
          <h4 className="text-sm font-semibold mb-1">Avantages :</h4>
          <ul className="text-xs space-y-1">
            {tierInfo.benefits.map((benefit, index) => (
              <li key={index} className="flex items-center gap-1">
                <span className="text-sm">•</span> {benefit}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoyaltyTierCard;
