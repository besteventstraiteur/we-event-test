
import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const VIPAdvantageNotice: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-vip-gray-100 p-4 rounded-lg">
      <p className="text-vip-gray-800 italic text-sm">
        <span className="font-semibold text-vip-gold">{t('partners.vipAdvantage')}</span> {t('partners.vipDescription')}
        <Link to="/register-client" className="ml-2 text-vip-gold hover:underline">
          {t('common.register')}
        </Link>
      </p>
    </div>
  );
};

export default VIPAdvantageNotice;
