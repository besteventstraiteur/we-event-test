import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles?: string[];
  Layout?: React.ComponentType<{ children: React.ReactNode }>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  Layout,
}) => {
  const login = useSelector((state: any) => state?.login);
  const token = login?.access_token || null;
  const role = login?.data?.role; // FIX: Changed from login?.user?.role to login?.data?.role

  if (!token) return <Navigate to="/login" replace />;
  if (allowedRoles && role && !allowedRoles.includes(role!))
    return <Navigate to="/" replace />;

  const content = <Outlet />;
  return Layout ? <Layout>{content}</Layout> : content;
};

export default ProtectedRoute;
