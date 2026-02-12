
import React from "react";
import { Badge } from "@/components/ui/badge";

interface FeaturesListProps {
  accountOptions: {
    canViewFloorPlan: boolean;
    canSelectMenu: boolean;
    canUploadPhotos: boolean;
    canAddSongs: boolean;
    canUseGuestbook: boolean;
    canUseGiftFund: boolean;
  };
}

const FeaturesList: React.FC<FeaturesListProps> = ({ accountOptions }) => {
  return (
    <div className="pt-4">
      <h3 className="text-lg font-medium mb-2">Fonctionnalités activées</h3>
      <ul className="space-y-2 text-sm">
        <li className="flex items-center gap-2">
          <Badge variant="outline" className={accountOptions.canSelectMenu ? "bg-green-50 text-green-800 border-green-200" : "bg-gray-100 text-gray-600 border-gray-200"}>
            {accountOptions.canSelectMenu ? "Activé" : "Désactivé"}
          </Badge>
          Choix du menu
        </li>
        <li className="flex items-center gap-2">
          <Badge variant="outline" className={accountOptions.canViewFloorPlan ? "bg-green-50 text-green-800 border-green-200" : "bg-gray-100 text-gray-600 border-gray-200"}>
            {accountOptions.canViewFloorPlan ? "Activé" : "Désactivé"}
          </Badge>
          Consultation du plan de salle
        </li>
        <li className="flex items-center gap-2">
          <Badge variant="outline" className={accountOptions.canUseGuestbook ? "bg-green-50 text-green-800 border-green-200" : "bg-gray-100 text-gray-600 border-gray-200"}>
            {accountOptions.canUseGuestbook ? "Activé" : "Désactivé"}
          </Badge>
          Livre d'or
        </li>
        <li className="flex items-center gap-2">
          <Badge variant="outline" className={accountOptions.canUseGiftFund ? "bg-green-50 text-green-800 border-green-200" : "bg-gray-100 text-gray-600 border-gray-200"}>
            {accountOptions.canUseGiftFund ? "Activé" : "Désactivé"}
          </Badge>
          Cagnotte des mariés
        </li>
        <li className="flex items-center gap-2">
          <Badge variant="outline" className={accountOptions.canAddSongs ? "bg-green-50 text-green-800 border-green-200" : "bg-gray-100 text-gray-600 border-gray-200"}>
            {accountOptions.canAddSongs ? "Activé" : "Désactivé"}
          </Badge>
          Proposition de chansons
        </li>
        <li className="flex items-center gap-2">
          <Badge variant="outline" className={accountOptions.canUploadPhotos ? "bg-green-50 text-green-800 border-green-200" : "bg-gray-100 text-gray-600 border-gray-200"}>
            {accountOptions.canUploadPhotos ? "Activé" : "Désactivé"}
          </Badge>
          Upload de photos
        </li>
      </ul>
    </div>
  );
};

export default FeaturesList;
