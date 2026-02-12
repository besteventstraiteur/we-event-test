
import React from "react";
import NavItem from "./NavItem";
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Calendar, 
  PackageOpen, 
  MessageSquare, 
  Radio, 
  Star,
  Headphones,
  Presentation,
  UserCog,
  BarChart,
  CreditCard,
  Network
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";

const AdminNavigation = () => {
  const { t } = useLanguage();
  const { features } = useFeatureFlags();
  
  return (
    <div className="space-y-4">
      <NavItem
        icon={<LayoutDashboard size={20} />}
        title="Dashboard"
        href="/admin/dashboard"
      />
      <NavItem
        icon={<BarChart size={20} />}
        title="Statistics"
        href="/admin/statistics"
      />
      <NavItem
        icon={<Users size={20} />}
        title="Clients"
        href="/admin/clients"
      />
      <NavItem
        icon={<Building2 size={20} />}
        title="Partners"
        href="/admin/partners"
      />
      
      {features.partnerTypes && (
        <NavItem
          icon={<UserCog size={20} />}
          title="Partner Types"
          href="/admin/partner-types"
        />
      )}
      
      {features.subscriptions && (
        <NavItem
          icon={<CreditCard size={20} />}
          title="Subscriptions"
          href="/admin/subscriptions"
        />
      )}
      
      {features.mlm && (
        <NavItem
          icon={<Network size={20} />}
          title="MLM Network"
          href="/admin/mlm"
        />
      )}
      
      {features.guests && (
        <NavItem
          icon={<Users size={20} />}
          title="Guests"
          href="/admin/guests"
        />
      )}
      
      {features.venues && (
        <NavItem
          icon={<Calendar size={20} />}
          title="Venues"
          href="/admin/venues"
        />
      )}
      
      {features.weddingPackages && (
        <NavItem
          icon={<PackageOpen size={20} />}
          title="Wedding Packages"
          href="/admin/wedding-packages"
        />
      )}
      
      {features.ratings && (
        <NavItem
          icon={<Star size={20} />}
          title="Ratings & Reviews"
          href="/admin/ratings"
        />
      )}
      
      {features.recommendations && (
        <NavItem
          icon={<MessageSquare size={20} />}
          title="Recommendations"
          href="/admin/recommendations"
        />
      )}
      
      {features.talkshows && (
        <NavItem
          icon={<Radio size={20} />}
          title="Talkshows"
          href="/admin/talkshows"
        />
      )}
      
      {features.podcasts && (
        <NavItem
          icon={<Headphones size={20} />}
          title="Podcasts"
          href="/admin/podcasts"
        />
      )}
      
      {features.presentations && (
        <NavItem
          icon={<Presentation size={20} />}
          title="Presentation"
          href="/admin/presentations"
        />
      )}
    </div>
  );
};

export default AdminNavigation;
