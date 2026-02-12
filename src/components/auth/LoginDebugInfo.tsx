
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface LoginDebugInfoProps {
  email?: string;
  userType?: string;
  redirectPath?: string;
  redirectAttempted?: boolean;
}

const LoginDebugInfo: React.FC<LoginDebugInfoProps> = ({
  redirectPath, 
  redirectAttempted
}) => {
  const navigate = useNavigate();

  // Ne pas afficher les informations de débogage
  return null;
};

export default LoginDebugInfo;
