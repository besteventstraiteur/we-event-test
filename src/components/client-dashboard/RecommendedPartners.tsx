
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import GoldButton from "@/components/GoldButton";

const RecommendedPartners = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="truncate">Partenaires recommandés</CardTitle>
        <CardDescription className="truncate">Sélectionnés spécialement pour vous</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {[
          { name: "Domaine des Roses", category: "Domaine", discount: "15%" },
          { name: "DJ Platine", category: "DJ", discount: "10%" },
          { name: "Fleurs de Luxe", category: "Fleuriste", discount: "20%" },
        ].map((partner, i) => (
          <div key={i} className="flex items-center gap-4 p-2 rounded-md hover:bg-gray-50 transition-colors">
            <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-vip-gold">
              {partner.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{partner.name}</h4>
              <p className="text-sm text-muted-foreground truncate">{partner.category} • Réduction: {partner.discount}</p>
            </div>
            <GoldButton variant="outline" size="sm">
              Contacter
            </GoldButton>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecommendedPartners;
