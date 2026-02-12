
import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { UserRole, PartnerType } from "@/utils/accessControl";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface PartnerTypeRouteProps {
  requiredRole?: UserRole.PARTNER;
  fallbackPath?: string;
  allowedTypes?: PartnerType[];
  children?: React.ReactNode;
}

const PartnerTypeRoute: React.FC<PartnerTypeRouteProps> = ({
  requiredRole = UserRole.PARTNER,
  fallbackPath = "/login",
  allowedTypes,
  children
}) => {
  const { user, isLoading, hasRole, hasPartnerType } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Vérification des accès partenaire...</span>
      </div>
    );
  }

  if (!user) {
    console.log("PartnerTypeRoute - No current user, redirecting to:", fallbackPath);
    return <Navigate to={fallbackPath} state={{ from: location.pathname }} replace />;
  }

  const isPartner = hasRole(requiredRole);
  
  if (!isPartner) {
    console.log("PartnerTypeRoute - User is not a partner:", user.user_metadata?.role);
    return <Navigate to="/unauthorized" replace />;
  }
  
  if (allowedTypes && allowedTypes.length > 0) {
    const hasAllowedType = allowedTypes.some(type => hasPartnerType(type));
    
    if (!hasAllowedType) {
      console.log("PartnerTypeRoute - Partner type not allowed:", user.user_metadata?.partner_type);
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
};

export default PartnerTypeRoute;
