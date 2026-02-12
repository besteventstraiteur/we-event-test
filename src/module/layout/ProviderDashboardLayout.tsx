import React, { useEffect, useState, useMemo } from "react";
import Sidebar, { SidebarLink } from "../Dashboard/Sidebar";
import ThemeToggleSwitch from "../../components/Mode";
import {
  BriefcaseBusiness,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  MessageCircleQuestionMark,
  Map,
  BadgeCheck,
  Workflow,
  X,
  MessageSquare,
  Award,
  Contact,
  Video,
  Waypoints,
  Mail,
  CalendarRange,
  ChartArea,
  BookTemplate,
  LayoutTemplate,
  ReceiptIcon,
  TrendingUp,
  Calculator,
  MailCheck,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/logo-transparent.png";
import OuterModal from "../../components/Custommodal/OuterModal";
import FeatureNotIncluded from "../../pages/provider/NoIncludedFeature";
import { useSelector } from "react-redux";
import Topbar from "./Topbar";

interface ProviderDashboardLayoutProps {
  children: React.ReactNode;
}

const providerLinks: SidebarLink[] = [
  {
    to: "/provider/dashboard",
    labelKey: "Tableau de bord",
    icon: <LayoutDashboard size={18} />,
    end: true,
  },
  {
    to: "/provider/add-business-info",
    labelKey: "Informations commerciales",
    icon: <BriefcaseBusiness size={18} />,
    end: true,
  },

  {
    to: "/provider/roadmap",
    labelKey: "Feuille de route",
    icon: <Map size={18} />,
    end: true,
  },
  {
    to: "/provider/refferal",
    labelKey: "Pararainages",
    icon: <Workflow size={18} />,
    requiredFeature: "referral",
    end: true,
  },
  // {
  //   to: "/provider/contacts",
  //   labelKey: "manage Contacts",
  //   icon: <Contact size={18} />,
  //   end: true,
  // },
  // {
  //   to: "/provider/requests",
  //   labelKey: "requests",
  //   icon: <MessageCircleQuestionMark />,
  //   end: true,
  // },
  // {
  //   to: "/provider/email-templates",
  //   labelKey: "Modèles d'e-mails",
  //   icon: <MailCheck size={18} />,
  //   end: true,
  // },
  {
    labelKey: "Crm",
    icon: <BriefcaseBusiness size={18} />,
    children: [
      {
        to: "/provider/contacts",
        labelKey: "Contacts",
        icon: <Contact size={18} />,
        requiredFeature: "sales_crm",
      },
      {
        to: "/provider/requests",
        labelKey: "requests",
        icon: <MessageCircleQuestionMark />,
        end: true,
        requiredFeature: "sales_crm",
      },

      {
        to: "/provider/opportunites",
        labelKey: "Opportunités",
        icon: <Waypoints size={18} />,
        requiredFeature: "sales_crm",
      },
      {
        to: "/provider/provider-chat",
        labelKey: "Messages",
        icon: <MessageSquare size={18} />,
        requiredFeature: "messaging",
      },
      {
        to: "/provider/email",
        labelKey: "Emails",
        icon: <ChartArea size={18} />,
        requiredFeature: "email_assistant",
      },
      {
        to: "/provider/assistant",
        labelKey: "Assistant IA",
        icon: <ChartArea size={18} />,
        requiredFeature: "commercial_ai",
      },
    ],
  },
  {
    labelKey: "Ventes",
    icon: <TrendingUp size={18} />,
    children: [
      {
        to: "/provider/document",
        labelKey: "Documents",
        icon: <BookTemplate size={18} />,
      },
      {
        to: "/provider/email-templates",
        labelKey: "Modèles d'e-mails",
        icon: <MailCheck size={18} />,
      },
      {
        to: "/provider/templates",
        labelKey: "Modèles",
        icon: <LayoutTemplate size={18} />,
      },
      {
        to: "/provider/catalogue",
        labelKey: "Catalogue",
        icon: <BookTemplate size={18} />,
        end: true,
      },
    ],
  },
  {
    labelKey: "Finances",
    icon: <Calculator size={18} />,
    children: [
      {
        to: "/provider/finance",
        labelKey: "Facturation et Dépenses",
        icon: <ReceiptIcon size={18} />,
        requiredFeature: "accounting",
      },
      {
        to: "/provider/treasury",
        labelKey: "Trésorerie",
        icon: <LayoutTemplate size={18} />,
        requiredFeature: "accounting",
      },
      {
        to: "/provider/automation",
        labelKey: "Relances",
        icon: <BookTemplate size={18} />,
        requiredFeature: "accounting",
      },
      {
        to: "/provider/payment-setting",
        labelKey: "Configuration paiements",
        icon: <BookTemplate size={18} />,
        requiredFeature: "accounting",
        end: true,
      },
    ],
  },
  {
    labelKey: "Mes Stocks",
    icon: <Calculator size={18} />,
    children: [
      {
        to: "/provider/suppliers",
        labelKey: "Fournisseurs",
        icon: <ReceiptIcon size={18} />,
      },
    ],
  },
  {
    to: "/provider/partner-training",
    labelKey: "Formation",
    icon: <Video size={18} />,
    end: true,
  },
  {
    to: "/provider/recommendations",
    labelKey: "Recommandations",
    icon: <Award size={18} />,
    // requiredFeature: "accounting",
    end: true,
  },
  {
    to: "/provider/plans",
    labelKey: "Abonnement",
    icon: <BadgeCheck size={18} />,
    end: true,
  },
  { to: "/provider/profile", labelKey: "Profil", icon: <User size={18} /> },
];

const providerBottomLink: SidebarLink = {
  to: "/provider/settings",
  labelKey: "Déconnexion",
  icon: <LogOut size={18} />,
};

const ProviderDashboardLayout: React.FC<ProviderDashboardLayoutProps> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const login = useSelector((state: any) => state.login);
  const handleProtectedNavigation = (to?: string, requiredFeature?: string) => {
    if (requiredFeature && !hasFeature(requiredFeature)) {
      setOpenModal(true);
      return false;
    }
    return true;
  };

  const handleClick = () => setOpen((s) => !s);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (key: string) => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    document.documentElement.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const features: Array<{ key: string; label: string; isActive: boolean }> =
    useMemo(() => {
      const raw = login?.user?.subscription?.plan?.features;

      console.log(raw, "dsjbdjkskjsdskdskksk");
      try {
        if (Array.isArray(raw)) return raw as any[];
        if (typeof raw === "string") return JSON.parse(raw || "[]");
      } catch (e) {
        console.error("Failed to parse plan.features:", e);
      }
      return [];
    }, [login]);

  const hasFeature = (key: string) =>
    features?.some((f) => f?.key === key && f?.isActive);

  const hasReferralAccess =
    hasFeature("access_to_the_sponsorship_program") ||
    hasFeature("referral") ||
    hasFeature("referral_program");

  useEffect(() => {
    if (location.pathname === "/provider/refferal") {
      if (!hasReferralAccess) {
        // navigate("/provider/dashboard");
        setTimeout(() => setOpenModal(true), 100);
      } else {
        setOpenModal(false);
      }
    } else {
      setOpenModal(false);
    }
  }, [location.pathname, hasReferralAccess, navigate]);

  const currentPath = location.pathname;
  useEffect(() => {
    if (location.pathname === "/provider/refferal" && !hasReferralAccess) {
      setOpenModal(true);
      navigate("/provider/dashboard", { replace: true });
    }
  }, [location.pathname, hasReferralAccess]);

  useEffect(() => {
    const handler = () => setOpenModal(true);
    window.addEventListener("feature-blocked", handler);

    return () => {
      window.removeEventListener("feature-blocked", handler);
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="dashboard-navbar bg-white dark:bg-darkmode flex justify-between items-center fixed z-30 w-full p-3 h-16 visible lg:hidden">
        <img src={Logo} alt="we event" className="max-w-[150px] shrink-0" />
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
        onNavigate={handleProtectedNavigation}
      />

        <div className="flex-1 flex flex-col w-full lg:w-[calc(100%-288px)] overflow-y-auto bg-lightbg dark:bg-neutral-900 h-full">
        <div className="invisible lg:visible sticky top-0 z-40">
          <Topbar />
        </div>
        <div
          className={`py-12 lg:py-6 px-4 
          ${
            currentPath === "/provider/provider-chat"
              ? "px-0  md:px-6 pt-0 md:pt-6"
              : "py-12 lg:py-6 px-4"
          }
        `}
        >
          {children}
        </div>
      </div>

      <OuterModal active={openModal} setActive={setOpenModal}>
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-xl mx-auto p-5 md:p-8 border-2 border-transparent dark:border-[#2F2F2F] rounded-2xl bg-white dark:bg-[#1E1E1E] relative"
        >
          <X
            className="absolute top-4 right-4 cursor-pointer dark:text-neutral-300"
            onClick={() => {
              setOpenModal(false);
            }}
          />
          <FeatureNotIncluded />
        </div>
      </OuterModal>
    </div>
  );
};

export default ProviderDashboardLayout;
