import React, { useEffect, useState } from "react";
import Sidebar, { SidebarLink } from "../Dashboard/Sidebar";
import ThemeToggleSwitch from "../../components/Mode";
import {
  CalendarClock,
  LayoutDashboard,
  LogOut,
  Menu,
  User,

  Heart,
  BadgeCheck,
  MessageSquare,
  Bell,
} from "lucide-react";

import Logo from "../../assets/images/logo-transparent.png";
import { useLocation } from "react-router-dom";
import Topbar from "./Topbar";

interface ClientDashboardLayoutProps {
  children: React.ReactNode;
}

const providerLinks: SidebarLink[] = [
  {
    to: "/client/dashboard",
    labelKey: "Tableau de bord",
    icon: <LayoutDashboard size={18} />,
    end: true,
  },
  {
    to: "/client/multi-events",
    labelKey: "Gérer les événements",
    icon: <CalendarClock size={18} />,
  },
  // {
  //   to: "/client/requests",
  //   labelKey: "requests",
  //   icon: <MessageCircleQuestionMark />,
  //   end: true,
  // },
  {
    to: "/client/client-chat",
    labelKey: "Messages",
    icon: <MessageSquare size={18} />,
    end: true,
  },
    {
    to: "/client/notifications",
    labelKey: "Notifications",
    icon: <Bell size={18} />,
    end: true,
  },
  // { to: "/client/guests", labelKey: "manage_guests", icon: <UsersRound /> },
  { to: "/client/profile", labelKey: "Profil", icon: <User size={18} /> },
  {
    to: "/client/plans",
    labelKey: "abonnement",
    icon: <BadgeCheck size={18} />,
    end: true,
  },
  {
    to: "/client/favourite",
    labelKey: "Favoris",
    icon: <Heart size={18} />,
    end: true,
  },
];

const providerBottomLink: SidebarLink = {
  to: "/client/settings",
  labelKey: "Déconnexion",
  icon: <LogOut size={18} />,
};

const ClientDashboardLayout: React.FC<ClientDashboardLayoutProps> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  
  const handleClick = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    }
  }, [open]);

 const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex h-screen overflow-hidden">
       <div className="dashboard-navbar bg-white dark:bg-darkmode flex justify-between items-center fixed z-30 w-full p-3 h-16 visible lg:hidden">
        <img src={Logo} alt="we event" className="max-w-[150px] shrink-0" />
        <div>
          <div className="mobile-mode sm:w-full flex justify-between items-center gap-1 sm:gap-3">
            <ThemeToggleSwitch />
            <Menu
              onClick={() => handleClick()}
              className="visible lg:hidden dark:text-primary"
            />
          </div>
        </div>
      </div>
      <Sidebar
        setOpen={setOpen}
        open={open}
        links={providerLinks}
        bottomLink={providerBottomLink}
      />
      
      <div className="flex-1 flex flex-col w-full lg:w-[calc(100%-288px)] overflow-y-auto bg-lightbg dark:bg-neutral-900 min-h-screen">
          <div className="invisible lg:visible sticky top-0 z-40">
         <Topbar />
         </div>
        <div
        className={`bg-lightbg dark:bg-neutral-900 py-12 lg:py-6 px-4 
          ${currentPath === "/client/client-chat" ? "px-0  md:px-6 pt-0 md:pt-6" : ""}
        `}
      >
          {children}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboardLayout;
