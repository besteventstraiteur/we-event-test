
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/utils/accessControl';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  requiredRole?: UserRole;
  children?: React.ReactNode;
  // Support des rôles multiples
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  requiredRole,
  allowedRoles,
  children 
}) => {
  const { isAuthenticated, hasRole, user, isLoading } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  
  console.log("ProtectedRoute - isAuthenticated:", isAuthenticated, "user:", user, "isLoading:", isLoading);
  console.log("ProtectedRoute - requiredRole:", requiredRole, "allowedRoles:", allowedRoles);

  useEffect(() => {
    // Journaliser les détails supplémentaires lorsque l'état d'authentification change
    if (!isLoading) {
      console.log("Auth state resolved - isAuthenticated:", isAuthenticated, "user present:", !!user);
      if (user) {
        console.log("User metadata:", user.user_metadata);
        console.log("User role from metadata:", user.user_metadata?.role);
      }
    }
  }, [isLoading, isAuthenticated, user]);

  // Afficher un indicateur de chargement pendant la vérification de l'authentification
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Loading authentication state...</span>
      </div>
    );
  }

  // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
  if (!isAuthenticated || !user) {
    console.log("Not authenticated, redirecting to login from:", location.pathname);
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Vérifier les rôles autorisés si fournis
  if (allowedRoles && allowedRoles.length > 0) {
    const hasAllowedRole = allowedRoles.some(role => {
      const result = hasRole(role);
      console.log(`Checking if user has role ${role}: ${result}`);
      return result;
    });
    
    if (!hasAllowedRole) {
      toast({
        title: "Accès non autorisé",
        description: "Vous n'avez pas les permissions nécessaires pour accéder à cette page",
        variant: "destructive",
      });
      return <Navigate to="/unauthorized" replace />;
    }
    return children ? <>{children}</> : <Outlet />;
  }

  // Vérifier un seul rôle requis si fourni
  if (requiredRole) {
    const result = hasRole(requiredRole);
    console.log(`Checking if user has required role ${requiredRole}: ${result}`);
    
    if (!result) {
      toast({
        title: "Accès non autorisé",
        description: "Vous n'avez pas les permissions nécessaires pour accéder à cette page",
        variant: "destructive",
      });
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
