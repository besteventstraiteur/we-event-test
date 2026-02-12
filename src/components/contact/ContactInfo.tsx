
import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ContactInfo = () => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
      <h2 className="text-xl font-semibold text-vip-gold">{t('contact.info.title')}</h2>
      
      <div className="space-y-4">
        <div className="flex items-start">
          <Mail className="text-vip-gold mr-3 mt-1" size={20} />
          <div>
            <p className="font-medium text-vip-black">{t('contact.info.email')}</p>
            <a href="mailto:contact@we-event.com" className="text-vip-gray-700 hover:text-vip-gold">
              contact@we-event.com
            </a>
          </div>
        </div>
        
        <div className="flex items-start">
          <Phone className="text-vip-gold mr-3 mt-1" size={20} />
          <div>
            <p className="font-medium text-vip-black">{t('contact.info.phone')}</p>
            <a href="tel:+33123456789" className="text-vip-gray-700 hover:text-vip-gold">
              +33 1 23 45 67 89
            </a>
          </div>
        </div>
        
        <div className="flex items-start">
          <MapPin className="text-vip-gold mr-3 mt-1" size={20} />
          <div>
            <p className="font-medium text-vip-black">{t('contact.info.address')}</p>
            <p className="text-vip-gray-700">
              {t('contact.info.addressLine1')}<br />
              {t('contact.info.addressLine2')}
            </p>
          </div>
        </div>
      </div>
      
      <div className="pt-6 border-t border-gray-300">
        <h3 className="text-vip-black font-medium mb-3">{t('contact.info.hours.title')}</h3>
        <div className="space-y-2 text-vip-gray-700">
          <div className="flex justify-between">
            <span>{t('contact.info.hours.weekdays')}</span>
            <span>{t('contact.info.hours.weekdayHours')}</span>
          </div>
          <div className="flex justify-between">
            <span>{t('contact.info.hours.saturday')}</span>
            <span>{t('contact.info.hours.saturdayHours')}</span>
          </div>
          <div className="flex justify-between">
            <span>{t('contact.info.hours.sunday')}</span>
            <span>{t('contact.info.hours.sundayHours')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
