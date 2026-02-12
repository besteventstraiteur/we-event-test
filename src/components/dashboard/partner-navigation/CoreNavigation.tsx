
import React from "react";
import { useLocation } from "react-router-dom";
import NavItem from "../NavItem";
import { 
  Home, 
  Calendar, 
  CheckSquare, 
  MessageSquare, 
  BarChart3, 
  GraduationCap,
  Trophy,
  Gift,
  User
} from "lucide-react";

interface CoreNavigationProps {
  showStats: boolean;
  showGamification: boolean;
  showTraining: boolean;
}

const CoreNavigation: React.FC<CoreNavigationProps> = ({ 
  showStats, 
  showGamification, 
  showTraining 
}) => {
  const location = useLocation();

  return (
    <>
      <NavItem
        href="/partner/dashboard"
        icon={<Home size={20} />}
        title="Tableau de bord"
        active={location.pathname === "/partner/dashboard"}
      />
      
      <NavItem
        href="/partner/profile"
        icon={<User size={20} />}
        title="Profil"
        active={location.pathname === "/partner/profile"}
      />
      
      <NavItem
        href="/partner/calendar"
        icon={<Calendar size={20} />}
        title="Calendrier"
        active={location.pathname === "/partner/calendar"}
      />
      
      <NavItem
        href="/partner/tasks"
        icon={<CheckSquare size={20} />}
        title="Tâches"
        active={location.pathname === "/partner/tasks"}
      />
      
      <NavItem
        href="/partner/requests"
        icon={<MessageSquare size={20} />}
        title="Demandes"
        active={location.pathname === "/partner/requests"}
      />

      {showStats && (
        <NavItem
          href="/partner/stats"
          icon={<BarChart3 size={20} />}
          title="Statistiques"
          active={location.pathname === "/partner/stats"}
        />
      )}

      {showTraining && (
        <NavItem
          href="/partner/training"
          icon={<GraduationCap size={20} />}
          title="Formation"
          active={location.pathname === "/partner/training"}
        />
      )}

      {showGamification && (
        <>
          <NavItem
            href="/partner/gamification"
            icon={<Trophy size={20} />}
            title="Programme de Fidélité"
            active={location.pathname === "/partner/gamification"}
          />
          
          <NavItem
            href="/partner/best-awards"
            icon={<Gift size={20} />}
            title="Best Awards"
            active={location.pathname === "/partner/best-awards"}
          />
        </>
      )}
    </>
  );
};

export default CoreNavigation;
