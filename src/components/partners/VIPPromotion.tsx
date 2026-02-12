
import React from "react";
import { Link } from "react-router-dom";
import GoldButton from "@/components/GoldButton";
import { useLanguage } from "@/contexts/LanguageContext";

const VIPPromotion: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="mt-16 bg-vip-gray-100 p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">{t('partners.joinVipTitle')}</h2>
      <p className="text-center text-vip-gray-700 mb-6">
        {t('partners.joinVipDescription')}
      </p>
      <div className="flex justify-center">
        <Link to="/register-client">
          <GoldButton size="lg">
            {t('partners.joinVipButton')}
          </GoldButton>
        </Link>
      </div>
    </div>
  );
};

export default VIPPromotion;
