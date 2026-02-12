
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDeviceType } from "@/hooks/use-mobile";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PartnersHeader: React.FC = () => {
  const { t } = useLanguage();
  const deviceType = useDeviceType();
  const isMobile = deviceType === 'mobile';
  const navigate = useNavigate();
  
  return (
    <div className={`border-b border-gray-200 ${isMobile ? 'px-4 py-3' : 'px-6 py-4'}`}>
      {isMobile && (
        <div className="flex items-center mb-3">
          <button 
            onClick={() => navigate(-1)} 
            className="mr-2 p-1 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
      )}
      
      <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold`}>
        {t('partners.title')}
      </h1>
      
      <p className={`text-vip-gray-600 ${isMobile ? 'text-sm mt-1' : 'mt-2'}`}>
        {t('partners.subtitle')}
      </p>
    </div>
  );
};

export default PartnersHeader;
