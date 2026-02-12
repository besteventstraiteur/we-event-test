import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import Forgetpassword from "../components/auth/Forgetpassword";

const ForgetpasswordPage = () => {
  

  return (
    <AuthLayout
      title={`Mot de passe oublié? 👋`}
      subtitle={
        "Entrez votre email enregistré et nous vous enverrons un lien pour réinitialiser votre mot de passe"
      }
    >
      <Forgetpassword />
    </AuthLayout>
  );
};

export default ForgetpasswordPage;
