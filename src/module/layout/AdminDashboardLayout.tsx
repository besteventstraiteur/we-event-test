import React, { useEffect, useState } from "react";
import Sidebar, { SidebarLink } from "../Dashboard/Sidebar";
import ThemeToggleSwitch from "../../components/Mode";
import {
  LayoutDashboard,
  LogOut,
  User,
  UsersRound,
  Contact2Icon,
  TableOfContentsIcon,
  Menu,
  Map,
  CalendarCheck,
  BadgeCheck,
  Package,
  Workflow,
  Video,
  Award,
  Bell,
  Newspaper,
  MailCheck,
} from "lucide-react";

import Logo from "../../assets/images/logo-transparent.png";
import Topbar from "./Topbar";

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

const providerLinks: SidebarLink[] = [
  {
    to: "/admin/dashboard",
    labelKey: "Tableau de bord",
    icon: <LayoutDashboard size={18} />,
    end: true,
  },
  {
    to: "/admin/manage-content",
    labelKey: "Gérer le contenu",
    icon: <TableOfContentsIcon size={18} />,
  },
  {
    to: "/admin/manage-users",
    labelKey: "Gérer les utilisateurs",
    icon: <UsersRound size={18} />,
  },
  {
    to: "/admin/contact-enquires",
    labelKey: "Gérer les demandes de contact",
    icon: <Contact2Icon size={18} />,
  },
  {
    to: "/admin/manage-roadmap",
    labelKey: "Gérer la feuille de route",
    icon: <Map size={18} />,
  },
  {
    to: "/admin/manage-plans",
    labelKey: "Gérer les plans",
    icon: <CalendarCheck size={18} />,
  },
  {
    to: "/admin/manage-subscriptions",
    labelKey: "Gérer l'abonnement",
    icon: <BadgeCheck size={18} />,
  },
  {
    to: "/admin/manage-refferals",
    labelKey: "Gérer les parrainages",
    icon: <Workflow size={18} />,
  },
  {
    to: "/admin/manage-payouts",
    labelKey: "Gérer les paiements",
    icon: <Package size={18} />,
  },
  {
    to: "/admin/email-templates",
    labelKey: "Modèles d'e-mails",
    icon: <MailCheck size={18} />,
  },
  {
    to: "/admin/manage-subscribers",
    labelKey: "Gérer la newsletter",
    icon: <Newspaper size={18} />,
  },
  {
    to: "/admin/admin-training",
    labelKey: "Gérer la formation",
    icon: <Video size={18} />,
  },
  {
    to: "/admin/manage-recomendation",
    labelKey: "Gérer les recommandations",
    icon: <Award size={18} />,
  },

  // {
  //   to: "/admin/subscriptions",
  //   labelKey: "subscriptions",
  //   icon: <BadgeCheck />,
  // },
  { to: "/admin/profile", labelKey: "Profil", icon: <User size={18} /> },
];

const providerBottomLink: SidebarLink = {
  to: "/provider/settings",
  labelKey: "Déconnexion",
  icon: <LogOut size={18} />,
};

const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({
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
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="dashboard-navbar flex justify-between items-center fixed z-30 bg-white dark:bg-darkmode w-full p-3 h-16 visible lg:hidden">
        <img src={Logo} alt="we event" className="max-w-[150px]" />
        <div className="mobile-mode sm:w-full flex justify-between items-center gap-1 sm:gap-3">
          <Topbar />
          <Menu
            onClick={handleClick}
            className="visible lg:hidden dark:text-primary"
          />
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
        <div className="py-12 lg:py-6 px-4">
          {children}
        </div>
      </div>
    </div>
    
  );
};

export default AdminDashboardLayout;
