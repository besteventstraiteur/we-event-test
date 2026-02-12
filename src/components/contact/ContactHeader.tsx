import React from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import GoldButton from "@/components/GoldButton";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

const ContactHeader = () => {
  const { t } = useLanguage();

  return (
    <header className="border-b border-gray-200 py-4 bg-white">
      <div className="container flex items-center justify-between">
        <Link to="/">
          <Logo />
        </Link>
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-vip-gray-600 hover:text-vip-gold">
            {t("common.home")}
          </Link>
          <Link
            to="/partners"
            className="text-vip-gray-600 hover:text-vip-gold"
          >
            {t("common.partners")}
          </Link>
          <Link to="/contact" className="text-vip-gold font-semibold">
            {t("common.contact")}
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <LanguageSelector />
          <Link to="/login">
            <GoldButton variant="outline" size="sm">
              {t("common.login")}
            </GoldButton>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default ContactHeader;
