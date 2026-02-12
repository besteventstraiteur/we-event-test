
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  title?: string;
  children?: React.ReactNode;
  active?: boolean;
  "aria-label"?: string;
}

const NavItem = ({ href, icon, title, children, active: propActive, "aria-label": ariaLabel }: NavItemProps) => {
  const location = useLocation();
  const isActive = propActive || location.pathname === href || location.pathname.startsWith(`${href}/`);
  
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200",
        "hover:bg-we-beige/50 hover:text-we-green focus:outline-none focus:ring-2 focus:ring-we-gold focus:ring-offset-2",
        isActive ? "bg-we-beige/50 text-we-green font-medium shadow-sm" : "text-we-gray-600"
      )}
      role="menuitem"
      aria-current={isActive ? "page" : undefined}
      aria-label={ariaLabel || title}
    >
      <div className={cn(
        "transition-colors duration-200",
        isActive ? "text-we-gold" : "text-we-gray-500"
      )}
        aria-hidden="true"
      >
        {icon}
      </div>
      <span className="text-sm">{title || children}</span>
      {isActive && (
        <div 
          className="absolute left-0 w-1 h-6 bg-we-gold rounded-r-full"
          aria-hidden="true"
        />
      )}
    </Link>
  );
};

export default NavItem;
