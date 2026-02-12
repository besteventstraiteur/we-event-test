
import React from "react";
import PartnerCardSimple from "./PartnerCardSimple";
import { useDeviceType } from "@/hooks/use-mobile";
import { useLanguage } from "@/contexts/LanguageContext";

interface PartnerCategory {
  id: string;
  name: string;
}

interface Partner {
  id: number;
  name: string;
  category: string;
  description: string;
}

interface PartnerGridProps {
  partners: Partner[];
  categories: PartnerCategory[];
}

const PartnerGrid: React.FC<PartnerGridProps> = ({ partners, categories }) => {
  const deviceType = useDeviceType();
  const isMobile = deviceType === 'mobile';
  const { t } = useLanguage();
  
  if (partners.length === 0) {
    return (
      <div className="col-span-full text-center py-6 sm:py-8 md:py-12">
        <p className="text-vip-gray-500">{t('partners.noResults')}</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${isMobile ? 'px-2' : 'px-0'}`}>
      {partners.map((partner) => (
        <PartnerCardSimple 
          key={partner.id} 
          partner={partner} 
          categoryName={categories.find(c => c.id === partner.category)?.name || ''} 
        />
      ))}
    </div>
  );
};

export default PartnerGrid;
