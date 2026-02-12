
import React from "react";
import { Image, Music, FileText, Grid3X3 } from "lucide-react";
import NavigationSection from "./NavigationSection";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { PartnerType } from "@/utils/accessControl";

interface PartnerTypeNavigationProps {
  partnerType: PartnerType;
  showPhotos: boolean;
  showPlaylists: boolean;
  showMenus: boolean;
  showFloorPlan: boolean;
}

const PartnerTypeNavigation = ({ 
  partnerType, 
  showPhotos, 
  showPlaylists, 
  showMenus, 
  showFloorPlan 
}: PartnerTypeNavigationProps) => {
  const location = useLocation();
  const { t } = useLanguage();

  const isPartnerTypeAllowed = (allowedType: PartnerType) => {
    return partnerType === allowedType || partnerType === PartnerType.GENERAL;
  };

  return (
    <>
      {isPartnerTypeAllowed(PartnerType.PHOTOGRAPHER) && showPhotos && (
        <NavigationSection
          href="/partner/photos"
          icon={<Image size={18} />}
          isActive={location.pathname === "/partner/photos"}
        >
          {t('partner.photos')}
        </NavigationSection>
      )}

      {isPartnerTypeAllowed(PartnerType.DJ) && showPlaylists && (
        <NavigationSection
          href="/partner/playlists"
          icon={<Music size={18} />}
          isActive={location.pathname === "/partner/playlists"}
        >
          {t('partner.playlists')}
        </NavigationSection>
      )}

      {isPartnerTypeAllowed(PartnerType.CATERER) && showMenus && (
        <NavigationSection
          href="/partner/menus"
          icon={<FileText size={18} />}
          isActive={location.pathname === "/partner/menus"}
        >
          {t('partner.menus')}
        </NavigationSection>
      )}

      {isPartnerTypeAllowed(PartnerType.VENUE) && showFloorPlan && (
        <NavigationSection
          href="/partner/floor-plans"
          icon={<Grid3X3 size={18} />}
          isActive={location.pathname === "/partner/floor-plans"}
        >
          {t('partner.floorPlans')}
        </NavigationSection>
      )}
    </>
  );
};

export default PartnerTypeNavigation;
