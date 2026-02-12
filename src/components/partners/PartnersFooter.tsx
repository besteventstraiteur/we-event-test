
import React from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { useLanguage } from "@/contexts/LanguageContext";

const PartnersFooter: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="py-8 border-t border-vip-gray-200">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link to="/">
            <Logo />
          </Link>
          <p className="text-vip-gray-500 text-sm">
            {t('home.footer.copyright')}
          </p>
          <div className="flex gap-4">
            <Link to="/privacy" className="text-vip-gray-600 hover:text-vip-gold text-sm">
              {t('home.footer.privacy')}
            </Link>
            <Link to="/terms" className="text-vip-gray-600 hover:text-vip-gold text-sm">
              {t('home.footer.terms')}
            </Link>
            <Link to="/contact" className="text-vip-gray-600 hover:text-vip-gold text-sm">
              {t('common.contact')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PartnersFooter;
