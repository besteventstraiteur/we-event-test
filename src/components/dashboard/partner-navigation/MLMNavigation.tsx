
import React from "react";
import { useLocation } from "react-router-dom";
import NavItem from "../NavItem";
import { Users, DollarSign } from "lucide-react";

interface MLMNavigationProps {
  showMLM: boolean;
}

const MLMNavigation: React.FC<MLMNavigationProps> = ({ showMLM }) => {
  const location = useLocation();

  if (!showMLM) return null;

  return (
    <>
      <NavItem
        href="/partner/mlm"
        icon={<Users size={20} />}
        title="MLM"
        active={location.pathname === "/partner/mlm"}
      />
    </>
  );
};

export default MLMNavigation;
