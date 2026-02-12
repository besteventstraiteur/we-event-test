import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import Forgetpassword from "../components/auth/Forgetpassword";
import ConfirmPage from "../components/auth/EmailSentConfirm";

const ConfirmEmailPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  

  const handleRegister = (e: unknown) => {
    
  };
  return (
    <AuthLayout title="Réinitialisez votre mot de passe 👋" subtitle="Nous vous avons envoyé un lien sécurisé pour réinitialiser votre mot de passe.">
      <ConfirmPage onSubmit={handleRegister} isLoading={isLoading} />
    </AuthLayout>
  );
};

export default ConfirmEmailPage;
