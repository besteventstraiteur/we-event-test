
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Headphones } from "lucide-react";
import GoldButton from "@/components/GoldButton";

const RecentPodcasts = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="truncate">Derniers podcasts</CardTitle>
        <CardDescription className="truncate">Les derniers conseils exclusifs We Event</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 p-2 rounded-md hover:bg-gray-50 transition-colors">
            <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-vip-gold">
              <Headphones size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">Comment choisir votre lieu de réception</h4>
              <p className="text-sm text-muted-foreground truncate">We Event • 24 min</p>
            </div>
            <GoldButton variant="outline" size="sm">
              Écouter
            </GoldButton>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentPodcasts;
