import React, { useState } from "react";
import WeEventLogo from "../WeEventLogo";
import { Home, Menu, Bell, Search, ChevronLeft, User } from "lucide-react";
import { Button } from "../ui/Button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeaderProps {
  type: "client" | "partner" | "admin" | "guest";
  isMobile?: boolean;
  onMenuClick?: () => void;
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

const Header = ({
  type,
  isMobile = false,
  onMenuClick,
  title,
  showBackButton = false,
  onBackClick,
}: HeaderProps) => {
  const actualIsMobile = useIsMobile();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { t } = useLanguage();

  // Determine if we're on a native mobile platform
  const isNativeLike = actualIsMobile || isMobile;

  return (
    <header className="border-b border-we-beige py-3 px-3 sm:px-6 bg-white sticky top-0 z-10 w-full overflow-hidden shadow-sm">
      <div className="flex items-center justify-between max-w-full">
        {showBackButton && isNativeLike ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 flex-shrink-0 text-we-gray-700"
            onClick={onBackClick}
          >
            <ChevronLeft size={22} />
          </Button>
        ) : isNativeLike ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 flex-shrink-0 text-we-gray-700"
            onClick={onMenuClick}
          >
            <Menu size={22} />
          </Button>
        ) : (
          <div className="w-10 flex-shrink-0"></div>
        )}

        <div className="flex justify-center flex-1 overflow-hidden">
          {title && isNativeLike ? (
            <h1 className="text-lg font-medium truncate text-we-green font-display">
              {title}
            </h1>
          ) : (
            <WeEventLogo asButton={true} />
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <LanguageSelector variant="minimal" />

          {isNativeLike && (
            <>
              <Sheet open={searchOpen} onOpenChange={setSearchOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-we-gray-700 hover:bg-we-beige/50"
                  >
                    <Search size={20} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="top" className="pt-6 pb-2">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                    <input
                      type="text"
                      placeholder={t("common.search") + "..."}
                      className="w-full pl-9 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-we-gold/50"
                      autoFocus
                    />
                  </div>
                </SheetContent>
              </Sheet>

              <Sheet
                open={notificationsOpen}
                onOpenChange={setNotificationsOpen}
              >
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 relative text-we-gray-700 hover:bg-we-beige/50"
                  >
                    <Bell size={20} />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                  </Button>
                </SheetTrigger>
                <SheetContent className="pt-6">
                  <div>
                    <h2 className="text-lg font-display font-semibold mb-4 text-we-green">
                      {t("common.notifications")}
                    </h2>
                    <div className="space-y-4">
                      <div className="p-3 bg-we-beige/50 rounded-lg hover:bg-we-beige/70 transition-colors cursor-pointer">
                        <div className="font-medium text-we-gray-900">
                          Nouvelle demande
                        </div>
                        <div className="text-sm text-we-gray-600">
                          Vous avez reçu une demande de prix.
                        </div>
                        <div className="text-xs text-we-gray-500 mt-1">
                          Il y a 2 heures
                        </div>
                      </div>
                      <div className="p-3 bg-we-beige/50 rounded-lg hover:bg-we-beige/70 transition-colors cursor-pointer">
                        <div className="font-medium text-we-gray-900">
                          Rappel: Rendez-vous
                        </div>
                        <div className="text-sm text-we-gray-600">
                          Visite du lieu de réception demain.
                        </div>
                        <div className="text-xs text-we-gray-500 mt-1">
                          Il y a 1 jour
                        </div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-we-gray-700 hover:bg-we-beige/50"
              >
                <User size={20} />
              </Button>
            </>
          )}

          <div className="text-sm text-we-gray-600 hidden sm:block font-display">
            {type === "client" && t("common.clientSpace")}
            {type === "partner" && t("common.partnerSpace")}
            {type === "admin" && t("common.administration")}
            {type === "guest" && t("common.guestSpace")}
          </div>
          {isNativeLike && <div className="sm:hidden w-1"></div>}
        </div>
      </div>

      {isNativeLike && (
        <div className="bottom-tabs fixed bottom-0 left-0 right-0 bg-white border-t border-we-beige flex justify-around py-2 px-1 z-10 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
          <TabButton
            icon={<Home size={20} />}
            label={t("common.home")}
            isActive={false}
            href="/client/dashboard"
          />
          <TabButton
            icon={<Bell size={20} />}
            label={t("common.notifications")}
            isActive={false}
            href="/client/notifications"
          />
          <TabButton
            icon={<Search size={20} />}
            label={t("common.explore")}
            isActive={false}
            href="/client/explore"
          />
          <TabButton
            icon={<User size={20} />}
            label={t("common.profile")}
            isActive={false}
            href="/client/profile"
          />
        </div>
      )}
    </header>
  );
};

// Tab button component for mobile navigation
const TabButton = ({
  icon,
  label,
  isActive,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  href: string;
}) => {
  return (
    <a
      href={href}
      className={`flex flex-col items-center justify-center px-2 transition-colors ${
        isActive ? "text-we-gold" : "text-we-gray-500 hover:text-we-green"
      }`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </a>
  );
};

export default Header;
