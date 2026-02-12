import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import LoginForm from "../components/auth/LoginForm";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  

  return (
    <AuthLayout
      title={`Heureux de vous revoir👋`}
      subtitle={
        "Connectez-vous pour continuer à organiser votre prochain bel événement"
      }
    >
      <LoginForm isLoading={isLoading} />
    </AuthLayout>
  );
};

export default LoginPage;
