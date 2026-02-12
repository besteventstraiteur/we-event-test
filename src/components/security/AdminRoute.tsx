
import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { UserRole } from "@/utils/accessControl";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AdminRouteProps {
  fallbackPath?: string;
}

const AdminRoute: React.FC<AdminRouteProps> = ({
  fallbackPath = "/login"
}) => {
  const { user, isLoading, hasRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Vérification des accès administrateur...</span>
      </div>
    );
  }

  if (!user) {
    console.log("AdminRoute - No current user, redirecting to:", fallbackPath);
    return <Navigate to={fallbackPath} state={{ from: location.pathname }} replace />;
  }

  // Check if user has admin role
  const isAdmin = hasRole(UserRole.ADMIN);
  
  if (!isAdmin) {
    console.log("AdminRoute - User is not admin:", user.role);
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
