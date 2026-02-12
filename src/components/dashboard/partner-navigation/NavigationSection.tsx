
import React from "react";
import NavItem from "../NavItem";
import { LucideIcon } from "lucide-react";

interface NavigationSectionProps {
  icon: React.ReactElement<LucideIcon>;
  href: string;
  isActive: boolean;
  children: React.ReactNode;
}

const NavigationSection = ({ icon, href, isActive, children }: NavigationSectionProps) => {
  return (
    <NavItem
      href={href}
      icon={icon}
      active={isActive}
    >
      {children}
    </NavItem>
  );
};

export default NavigationSection;
