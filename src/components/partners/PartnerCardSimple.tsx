
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import GoldButton from "@/components/GoldButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDeviceType } from "@/hooks/use-mobile";
import { ExternalLink } from "lucide-react";

interface Partner {
  id: number;
  name: string;
  category: string;
  description: string;
}

interface PartnerCardSimpleProps {
  partner: Partner;
  categoryName: string;
}

const PartnerCardSimple: React.FC<PartnerCardSimpleProps> = ({ partner, categoryName }) => {
  const { t } = useLanguage();
  const deviceType = useDeviceType();
  const isMobile = deviceType === 'mobile';
  
  return (
    <Card 
      className={`overflow-hidden border-vip-gray-300 ${isMobile ? 'shadow-sm' : ''} hover:shadow-md transition-shadow duration-200`}
    >
      <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <div className="flex justify-between items-start">
          <div className={`${isMobile ? 'pr-3' : 'pr-4'}`}>
            <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-vip-black line-clamp-1`}>
              {partner.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-vip-gray-600">
                {categoryName}
              </span>
            </div>
          </div>
          <div 
            className={`flex-shrink-0 ${isMobile ? 'w-10 h-10' : 'w-12 h-12'} bg-vip-gray-200 rounded-full flex items-center justify-center text-vip-gold font-bold border border-vip-gray-300`}
          >
            {partner.name.charAt(0)}
          </div>
        </div>
        
        <p className={`${isMobile ? 'mt-3' : 'mt-4'} text-vip-gray-600 text-sm line-clamp-3`}>
          {partner.description}
        </p>
        
        <div className={`${isMobile ? 'mt-3' : 'mt-4'} flex justify-end`}>
          <Link to={`/partner/profile/${partner.id}`} className="touch-ripple">
            <GoldButton size={isMobile ? "sm" : "default"}>
              {t('partners.seeDetails')}
              {isMobile && <ExternalLink size={16} className="ml-1" />}
            </GoldButton>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default PartnerCardSimple;
