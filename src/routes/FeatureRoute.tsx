import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface FeatureRouteProps {
  feature: string;
  children: React.ReactNode;
  onBlocked?: () => void;
}

const FeatureRoute: React.FC<FeatureRouteProps> = ({
  feature,
  children,
  onBlocked,
}) => {
  const login = useSelector((state: any) => state.login);
  const navigate = useNavigate();

  const raw = login?.user?.subscription?.plan?.features || [];
  let features: any[] = [];

  try {
    features = Array.isArray(raw) ? raw : JSON.parse(raw || "[]");
  } catch {}

  const hasAccess = features.some((f) => f?.key === feature && f?.isActive);

  useEffect(() => {
    if (!hasAccess) {
      onBlocked?.(); // optional popup
      navigate("/provider/plans", { replace: true });
    }
  }, [hasAccess, navigate, onBlocked]);

  if (!hasAccess) return null;

  return <>{children}</>;
};

export default FeatureRoute;
