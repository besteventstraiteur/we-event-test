
import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PlatformPresentation from "@/components/video-presentation/PlatformPresentation";

interface PresentationSectionProps {}

const PresentationSection: React.FC<PresentationSectionProps> = () => {
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  const [showClientPresentation, setShowClientPresentation] = useState(false);
  const [showPartnerPresentation, setShowPartnerPresentation] = useState(false);
  
  return (
    <section className="py-12 bg-we-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="max-w-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-we-green mb-4">
              {t('home.presentationTitle')}
            </h2>
            <p className="text-we-gray-700 mb-6">
              {t('home.presentationDescription')}
            </p>
          </div>
          <div className="w-full md:w-1/2">
            <img
              src="/images/platform-preview.jpg"
              alt={t('home.platformPreviewAlt')}
              className="rounded-lg shadow-md"
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/600x400?text=We+Event+Platform';
              }}
            />
          </div>
        </div>
        
        {/* Client and Partner Presentations Side by Side */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Client Presentation */}
          <div className="bg-we-beige/20 rounded-lg p-6 text-center flex flex-col items-center justify-between h-full shadow-sm">
            <div>
              <h3 className="text-xl font-semibold text-we-green mb-3">{t('home.clientPresentationTitle')}</h3>
              <p className="text-we-gray-700 mb-6">
                {t('home.clientPresentationDescription')}
              </p>
            </div>
            <Button 
              onClick={() => setShowClientPresentation(true)}
              className="flex items-center gap-2 bg-vip-gold hover:bg-amber-600 text-white"
            >
              {t('home.watchClientPresentation')}
            </Button>
          </div>
          
          {/* Partner Presentation */}
          <div className="bg-we-beige/20 rounded-lg p-6 text-center flex flex-col items-center justify-between h-full shadow-sm">
            <div>
              <h3 className="text-xl font-semibold text-we-green mb-3">{t('home.partnerPresentationTitle')}</h3>
              <p className="text-we-gray-700 mb-6">
                {t('home.partnerPresentationDescription')}
              </p>
            </div>
            <Button 
              onClick={() => setShowPartnerPresentation(true)}
              className="flex items-center gap-2 bg-vip-gold hover:bg-amber-600 text-white"
            >
              {t('home.watchPartnerPresentation')}
            </Button>
          </div>
        </div>

        {/* Conditional rendering of presentations */}
        {showClientPresentation && (
          <PlatformPresentation 
            onClose={() => setShowClientPresentation(false)} 
            title={t('home.clientPresentationTitle')}
            description={t('home.clientPresentationDescription')}
            clientOnly={true}
          />
        )}
        
        {showPartnerPresentation && (
          <PlatformPresentation 
            onClose={() => setShowPartnerPresentation(false)} 
            title={t('home.partnerPresentationTitle')}
            description={t('home.partnerPresentationDescription')}
            partnerOnly={true}
          />
        )}
      </div>
    </section>
  );
};

export default PresentationSection;
