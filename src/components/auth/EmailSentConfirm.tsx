import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import InputGroup from "../ui-main/InputGroup";
import Button from "../ui/Button";

// ----------------------
// ✅ Yup Validation Schema
// ----------------------

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required")
    .matches(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter valid email address"
    ),
});

interface ConfirmPageprops {
  onSubmit: (email: string) => Promise<void>;
  isLoading: boolean;
}

type FormData = yup.InferType<typeof schema>;

const ConfirmPage: React.FC<ConfirmPageprops> = ({ onSubmit, isLoading }) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-4">
      <p className="text-center text-gray-600 dark:text-neutral-300">
        Veuillez vérifier votre boîte de réception et suivre les instructions
        pour créer un nouveau mot de passe.
      </p>
      <Button
        type="submit"
        variant="primary"
        size="large"
        className="w-full"
        onClick={() => navigate("/login")}
        disabled={isLoading}
      >
        Retour à la connexion
      </Button>
      <div className="text-center text-sm dark:text-neutral-300">
        Vous vous souvenez de votre mot de passe?
        <Link
          to="/login"
          className="text-primary dark:text-neutral-300 underline hover:text-secondary"
        >
          Connectez-vous maintenant
        </Link>
      </div>
    </div>
  );
};

export default ConfirmPage;
