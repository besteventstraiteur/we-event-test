
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Users, Calendar, Menu, X, Settings, CreditCard, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Logo from "@/components/Logo";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

interface MobileNavigationProps {
  type: "client" | "partner" | "admin" | "guest";
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ type }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Navigation items by user type
  const getNavItems = (): NavItem[] => {
    switch(type) {
      case "client":
        return [
          { icon: <Home size={20} />, label: "Accueil", path: "/client/dashboard" },
          { icon: <Calendar size={20} />, label: "Planning", path: "/client/todo" },
          { icon: <Users size={20} />, label: "Invités", path: "/client/guests" },
          { icon: <Star size={20} />, label: "Prestataires", path: "/client/partners" },
          { icon: <CreditCard size={20} />, label: "Budget", path: "/client/budget" },
        ];
      case "partner":
        return [
          { icon: <Home size={20} />, label: "Accueil", path: "/partner/dashboard" },
          { icon: <Calendar size={20} />, label: "Événements", path: "/partner/requests" },
          { icon: <Star size={20} />, label: "Recommandations", path: "/partner/recommendations" },
          { icon: <Settings size={20} />, label: "Compte", path: "/partner/account" },
        ];
      case "admin":
        return [
          { icon: <Home size={20} />, label: "Accueil", path: "/admin/dashboard" },
          { icon: <Users size={20} />, label: "Clients", path: "/admin/clients" },
          { icon: <Star size={20} />, label: "Prestataires", path: "/admin/partners" },
          { icon: <Settings size={20} />, label: "Paramètres", path: "/admin/settings" },
        ];
      case "guest":
        return [
          { icon: <Home size={20} />, label: "Accueil", path: "/guest" },
          { icon: <Calendar size={20} />, label: "Événement", path: "/guest/event" },
          { icon: <Menu size={20} />, label: "Menu", path: "/guest/menu" },
        ];
      default:
        return [];
    }
  };
  
  const navItems = getNavItems();
  
  // Always display the navigation bar regardless of device type
  return (
    <>
      {/* Navigation bar - shown on all devices */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 grid grid-cols-5 py-2 px-1 z-50 safe-area-bottom">
        {navItems.slice(0, 4).map((item, index) => (
          <button
            key={index}
            className={`flex flex-col items-center justify-center px-1 py-1 ${
              location.pathname === item.path ? "text-vip-gold" : "text-gray-500"
            }`}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
        
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <button className="flex flex-col items-center justify-center px-1 py-1 text-gray-500">
              <Menu size={20} />
              <span className="text-xs mt-1">Plus</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[60vh] pt-6">
            <div className="flex justify-between items-center mb-6">
              <Logo size="small" />
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                <X size={20} />
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-100 hover:bg-gray-50"
                  onClick={() => {
                    navigate(item.path);
                    setIsMenuOpen(false);
                  }}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2 text-vip-gold">
                    {item.icon}
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
              
              {type !== "guest" && (
                <button
                  className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-100 hover:bg-gray-50"
                  onClick={() => {
                    navigate("/");
                    setIsMenuOpen(false);
                  }}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2 text-red-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Déconnexion</span>
                </button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Add spacing at the bottom to prevent content from being hidden behind the tab bar */}
      <div className="h-16"></div>
    </>
  );
};

export default MobileNavigation;
