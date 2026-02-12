
import React, { useState } from "react";
import InputField from "@/components/InputField";
import GoldButton from "@/components/GoldButton";

interface PasswordResetFormProps {
  onSubmit: (email: string) => void;
  onCancel: () => void;
  isLoading: boolean;
  resetSent: boolean;
}

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({
  onSubmit,
  onCancel,
  isLoading,
  resetSent
}) => {
  const [resetEmail, setResetEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(resetEmail);
  };

  if (resetSent) {
    return (
      <div className="text-center space-y-4">
        <p className="text-vip-gray-400">
          Si un compte existe avec cette adresse email, vous recevrez un lien de récupération de mot de passe.
        </p>
        <GoldButton 
          onClick={onCancel} 
          className="mx-auto"
        >
          Retour à la connexion
        </GoldButton>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField
        label="Email"
        id="reset-email"
        type="email"
        placeholder="votre@email.com"
        value={resetEmail}
        onChange={(e) => setResetEmail(e.target.value)}
        required
      />
      <GoldButton type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Envoi en cours..." : "Envoyer le lien de récupération"}
      </GoldButton>
      <button 
        type="button" 
        onClick={onCancel}
        className="block w-full text-center text-sm text-vip-gold hover:underline mt-2"
      >
        Retour à la connexion
      </button>
    </form>
  );
};

export default PasswordResetForm;
