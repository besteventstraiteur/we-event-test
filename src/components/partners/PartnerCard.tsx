
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Heart, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import GoldButton from "@/components/GoldButton";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PartnerAvailabilityCalendar from "./PartnerAvailabilityCalendar";

interface PartnerCardProps {
  partner: {
    id: number;
    name: string;
    category: string;
    discount: string;
    description: string;
    rating: number;
    status?: string;
    appointmentDate?: string | null;
  };
  categoryName: string;
  onContact: (partner: any) => void;
  onScheduleAppointment?: (partner: any) => void;
  showAppointmentInfo?: boolean;
}

const PartnerCard: React.FC<PartnerCardProps> = ({
  partner,
  categoryName,
  onContact,
  onScheduleAppointment,
  showAppointmentInfo = false,
}) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [showAvailability, setShowAvailability] = useState(false);

  return (
    <>
      <Card key={partner.id} className="bg-white border-gray-200 overflow-hidden">
        <CardContent className={`${isMobile ? 'p-3' : 'p-6'}`}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{partner.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">
                  {categoryName}
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                <span className="text-xs text-amber-600 font-medium">
                  Réduction: {partner.discount}
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                <span className="text-xs flex items-center">
                  <Star className="h-3 w-3 text-amber-500 fill-amber-500 mr-0.5" />
                  {partner.rating}
                </span>
              </div>
            </div>
            <div className="flex-shrink-0 w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 font-bold border border-amber-200">
              {partner.name.charAt(0)}
            </div>
          </div>
          
          <p className="mt-3 text-gray-600 text-xs line-clamp-2">{partner.description}</p>
          
          {partner.appointmentDate && showAppointmentInfo && (
            <div className="mt-3 flex items-center text-xs text-gray-500">
              <div className="flex items-center">
                <span>Rendez-vous prévu le: {new Date(partner.appointmentDate).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          )}
          
          <div className="mt-3 flex flex-wrap justify-end gap-2">
            <GoldButton 
              size="sm" 
              variant="outline" 
              className="border-amber-200 hover:bg-amber-50"
              onClick={() => setShowAvailability(true)}
            >
              <Calendar size={16} className="mr-1" /> Disponibilités
            </GoldButton>
            
            <Link to={`/partner/profile/${partner.id}`}>
              <GoldButton size="sm" variant="outline" className="border-amber-200 hover:bg-amber-50">
                <Star size={16} className="mr-1" /> Voir la vitrine
              </GoldButton>
            </Link>
            
            {!showAppointmentInfo && (
              <GoldButton 
                size="sm" 
                variant="outline" 
                className="border-amber-200 hover:bg-amber-50"
                onClick={() => {
                  // Vérifier si le prestataire est déjà dans "Mes prestataires"
                  toast({
                    title: "Prestataire ajouté",
                    description: `${partner.name} a été ajouté à vos prestataires favoris.`,
                  });
                }}
              >
                <Heart size={16} className="mr-1" /> Favoris
              </GoldButton>
            )}
            
            {showAppointmentInfo && partner.status === "confirmed" && onScheduleAppointment && (
              <GoldButton 
                size="sm" 
                variant="outline" 
                className="border-amber-200 hover:bg-amber-50"
                onClick={() => onScheduleAppointment(partner)}
              >
                <span className="mr-1" /> Rendez-vous
              </GoldButton>
            )}
            
            <GoldButton size="sm" onClick={() => onContact(partner)}>
              Contacter
            </GoldButton>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showAvailability} onOpenChange={setShowAvailability}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Disponibilités de {partner.name}</DialogTitle>
          </DialogHeader>
          <PartnerAvailabilityCalendar
            partnerId="partner-001"
            partnerName={partner.name}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PartnerCard;
