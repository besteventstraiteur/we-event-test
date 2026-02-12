
import React from "react";
import { useLocation } from "react-router-dom";
import NavItem from "../NavItem";
import { 
  MapPin, 
  Package, 
  Star, 
  Presentation, 
  CreditCard,
  Globe,
  TrendingUp
} from "lucide-react";

interface BusinessNavigationProps {
  showVenues: boolean;
  showWeddingPackages: boolean;
  showRatings: boolean;
  showPresentations: boolean;
  showSubscriptions: boolean;
  showMiniSite: boolean;
  showRecommendations: boolean;
}

const BusinessNavigation: React.FC<BusinessNavigationProps> = ({
  showVenues,
  showWeddingPackages,
  showRatings,
  showPresentations,
  showSubscriptions,
  showMiniSite,
  showRecommendations
}) => {
  const location = useLocation();

  return (
    <>
      {showVenues && (
        <NavItem
          href="/partner/venues"
          icon={<MapPin size={20} />}
          title="Lieux"
          active={location.pathname === "/partner/venues"}
        />
      )}

      {showWeddingPackages && (
        <NavItem
          href="/partner/wedding-packages"
          icon={<Package size={20} />}
          title="Packages Mariage"
          active={location.pathname === "/partner/wedding-packages"}
        />
      )}

      {showRatings && (
        <NavItem
          href="/partner/ratings"
          icon={<Star size={20} />}
          title="Avis & Notes"
          active={location.pathname === "/partner/ratings"}
        />
      )}

      {showPresentations && (
        <NavItem
          href="/partner/presentations"
          icon={<Presentation size={20} />}
          title="Présentations"
          active={location.pathname === "/partner/presentations"}
        />
      )}

      {showMiniSite && (
        <NavItem
          href="/partner/mini-site"
          icon={<Globe size={20} />}
          title="Mini-Site"
          active={location.pathname === "/partner/mini-site"}
        />
      )}

      {showRecommendations && (
        <NavItem
          href="/partner/recommendations"
          icon={<TrendingUp size={20} />}
          title="Recommandations"
          active={location.pathname === "/partner/recommendations"}
        />
      )}

      {showSubscriptions && (
        <NavItem
          href="/partner/subscription"
          icon={<CreditCard size={20} />}
          title="Abonnement"
          active={location.pathname === "/partner/subscription"}
        />
      )}
    </>
  );
};

export default BusinessNavigation;
