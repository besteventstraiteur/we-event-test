import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";

interface LogoutButtonProps {
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  className?: string;
  showIcon?: boolean;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = "default",
  className = "",
  showIcon = false,
  ...props
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: t("auth.logout.success"),
        description: t("auth.logout.successMessage"),
      });

      // Ajout d'une redirection plus immédiate
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: t("auth.logout.error"),
        description: t("auth.logout.errorMessage"),
      });
    }
  };

  return (
    <Button
      onClick={handleLogout}
      variant={variant}
      className={className}
      {...props}
    >
      {showIcon && <LogOutIcon className="mr-2 h-4 w-4" />}
      {t("auth.logout.button")}
    </Button>
  );
};

export default LogoutButton;
