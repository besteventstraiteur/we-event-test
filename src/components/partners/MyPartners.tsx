
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import GoldButton from "@/components/GoldButton";
import PartnerCard from "./PartnerCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { Trophy } from "lucide-react";

interface MyPartnersProps {
  partners: any[];
  partnerCategories: { id: string; name: string }[];
  onContactPartner: (partner: any) => void;
  onScheduleAppointment: (partner: any) => void;
  onBrowseDirectory: () => void;
}

const MyPartners: React.FC<MyPartnersProps> = ({
  partners,
  partnerCategories,
  onContactPartner,
  onScheduleAppointment,
  onBrowseDirectory,
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
        <p className="text-amber-700 font-medium text-sm">
          Gérez vos prestataires sélectionnés, suivez les demandes en cours et programmez vos rendez-vous.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {partners.length > 0 ? (
          partners.map((partner) => (
            <div key={partner.id} className="relative">
              {partner.bestAwards && (
                <div className="absolute -top-2 -right-2 z-10">
                  <Badge className="bg-amber-500 text-white font-semibold px-2 py-1 flex items-center gap-1 shadow-md">
                    <Trophy className="w-3 h-3" /> Best Awards 2025
                  </Badge>
                </div>
              )}
              <PartnerCard 
                partner={partner}
                categoryName={partnerCategories.find(c => c.id === partner.category)?.name || ""}
                onContact={onContactPartner}
                onScheduleAppointment={onScheduleAppointment}
                showAppointmentInfo={true}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Vous n'avez pas encore sélectionné de prestataires.</p>
            <p className="text-gray-400 text-sm mt-2">
              Consultez notre annuaire VIP pour trouver des prestataires de qualité pour votre événement.
            </p>
            <GoldButton 
              className="mt-4" 
              onClick={onBrowseDirectory}
            >
              Parcourir l'annuaire
            </GoldButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPartners;
