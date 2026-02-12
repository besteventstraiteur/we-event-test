
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PartnerBadge as PartnerBadgeType } from "@/models/partnerGamification";
import PartnerBadge from "./PartnerBadge";

interface BadgesCollectionProps {
  badges: PartnerBadgeType[];
}

const BadgesCollection = ({ badges }: BadgesCollectionProps) => {
  return (
    <Card className="bg-vip-gray-900 border-vip-gray-800">
      <CardHeader>
        <CardTitle className="text-lg">Vos badges ({badges.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {badges.length === 0 ? (
          <div className="text-center py-6 text-vip-gray-400">
            <p>Vous n'avez pas encore obtenu de badge</p>
            <p className="text-sm mt-2">Complétez diverses actions pour gagner des badges et des points</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {badges.map((badge) => (
              <div key={badge.id} className="flex flex-col items-center gap-2">
                <PartnerBadge badge={badge} />
                <span className="text-xs text-center text-vip-gray-400">{badge.name}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BadgesCollection;
