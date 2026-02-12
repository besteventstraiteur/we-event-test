
import React from "react";
import NavItem from "./NavItem";
import { 
  LayoutDashboard, 
  ListTodo, 
  Users, 
  Calendar, 
  SquareStack, 
  CreditCard, 
  MessageSquare, 
  Image, 
  Package, 
  Radio, 
  Heart,
  User,
  Headphones,
  PanelLeft,
  Star,
  Building2
} from "lucide-react";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";

const ClientNavigation = () => {
  const { features } = useFeatureFlags();
  
  return (
    <div className="space-y-4">
      <NavItem
        icon={<LayoutDashboard size={20} />}
        title="Dashboard"
        href="/client/dashboard"
      />
      <NavItem
        icon={<ListTodo size={20} />}
        title="To-do list"
        href="/client/todo-list"
      />
      
      <NavItem
        icon={<CreditCard size={20} />}
        title="Budget"
        href="/client/budget"
      />
      <NavItem
        icon={<Building2 size={20} />}
        title="Prestataires"
        href="/client/partners"
      />

      {features.guests && (
        <NavItem
          icon={<Users size={20} />}
          title="Guests"
          href="/client/guests"
        />
      )}
      
      {features.floorPlan && (
        <NavItem
          icon={<Calendar size={20} />}
          title="Floor Plan"
          href="/client/floor-plans"
        />
      )}
      
      {features.menus && (
        <NavItem
          icon={<Package size={20} />}
          title="Menus"
          href="/client/menus"
        />
      )}
      
      {features.pinterbest && (
        <NavItem
          icon={<Heart size={20} />}
          title="Inspiration"
          href="/client/pinterbest"
        />
      )}
      
      {features.photos && (
        <NavItem
          icon={<Image size={20} />}
          title="Photos"
          href="/client/photos"
        />
      )}
      
      {features.playlists && (
        <NavItem
          icon={<SquareStack size={20} />}
          title="Playlists"
          href="/client/music-playlists"
        />
      )}
      
      {features.talkshows && (
        <NavItem
          icon={<Radio size={20} />}
          title="Talkshows"
          href="/client/talkshows"
        />
      )}
      
      {features.podcasts && (
        <NavItem
          icon={<Headphones size={20} />}
          title="Podcasts"
          href="/client/podcasts"
        />
      )}
      
      {features.requests && (
        <NavItem
          icon={<MessageSquare size={20} />}
          title="Requests"
          href="/client/requests"
        />
      )}

  
      
      {features.miniSite && (
        <NavItem
          icon={<PanelLeft size={20} />}
          title="Mini-site"
          href="/client/mini-site"
        />
      )}
      
      <NavItem
        icon={<User size={20} />}
        title="Account"
        href="/client/account"
      />
    </div>
  );
};

export default ClientNavigation;
