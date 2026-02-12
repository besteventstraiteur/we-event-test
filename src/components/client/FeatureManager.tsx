
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";

const featureLabels = {
  photos: "Galerie Photos",
  playlists: "Playlists Musicales",
  menus: "Menus",
  guests: "Gestion des Invités",
  floorPlan: "Plan de Table",
  pinterbest: "Inspiration (Pinterbest)",
  requests: "Demandes",
  miniSite: "Mini-site",
  talkshows: "Talkshows",
  podcasts: "Podcasts",
};

const FeatureManager = () => {
  const { features, setFeature } = useFeatureFlags();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-vip-gold flex items-center gap-2">
          Fonctionnalités Actives
        </CardTitle>
        <CardDescription>
          Activez ou désactivez les fonctionnalités dont vous avez besoin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {Object.entries(featureLabels).map(([key, label]) => (
              <div
                key={key}
                className="flex items-center justify-between py-2"
              >
                <div className="space-y-0.5">
                  <div className="font-medium">{label}</div>
                </div>
                <Switch
                  checked={features[key as keyof typeof features]}
                  onCheckedChange={() => setFeature(key as keyof typeof features, !features[key as keyof typeof features])}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default FeatureManager;
