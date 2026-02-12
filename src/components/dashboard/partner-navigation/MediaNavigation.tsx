
import React from "react";
import { Video, HeadphonesIcon } from "lucide-react";
import NavigationSection from "./NavigationSection";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface MediaNavigationProps {
  showTalkshows: boolean;
  showPodcasts: boolean;
}

const MediaNavigation = ({ showTalkshows, showPodcasts }: MediaNavigationProps) => {
  const location = useLocation();
  const { t } = useLanguage();
  
  return (
    <>
      {showTalkshows && (
        <NavigationSection
          href="/partner/talkshows"
          icon={<Video size={18} />}
          isActive={location.pathname === "/partner/talkshows"}
        >
          {t('partner.talkshows')}
        </NavigationSection>
      )}
      
      {showPodcasts && (
        <NavigationSection
          href="/partner/podcasts"
          icon={<HeadphonesIcon size={18} />}
          isActive={location.pathname === "/partner/podcasts"}
        >
          {t('partner.podcasts')}
        </NavigationSection>
      )}
    </>
  );
};

export default MediaNavigation;
