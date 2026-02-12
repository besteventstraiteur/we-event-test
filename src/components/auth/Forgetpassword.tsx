import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import InputGroup from "../ui-main/InputGroup";
import Button from "../ui/Button";
import { useToast } from "../../utils/toast";
import { postRequest } from "../../utils/http-client/axiosClient";
import { AUTH } from "../../utils/endPoints";
import { RESPONSE_CODE } from "../../utils/constants";

interface Forgetpasswordprops {
  onSubmit: (email: string) => Promise<void>;
  isLoading: boolean;
}

const Forgetpassword: React.FC<Forgetpasswordprops> = () => {

  const schema = useMemo(
    () =>
      yup.object().shape({
        email: yup
          .string()
          .email("Invalid email")
          .required("Email is required")
          .matches(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter valid email address"
          ),
      }),
    []
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    watch,
    setValue,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const handleRegister = async (e: unknown) => {
    const payload = {
      email: e.email,
    };
    setLoading(true);
    try {
      const response = await postRequest(`${AUTH.FORGET_PASSSWORD}`, payload);

      if (response.status === RESPONSE_CODE[200]) {
        reset();
        // toast.success(response.data.message);
        navigate("/email-sent");
      }
    } catch (error) {
      
      toast.error(error?.response?.data.message);
    }

    setLoading(false);
  };
  useEffect(() => {
    reset({}, { keepValues: true });
  }, [schema, reset]);
  return (
    <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
     

      {/* Email */}

      <div>
        <InputGroup
          label="Adresse email*"
          inputProps={register("email")}
          error={errors.email}
          placeholder="Saisir votre e-mail enregistré"
          type="email"
        />
      </div>
      
      <div className="space-y-4 mt-8">
        <div>
          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            size="large"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi en cours…
              </>
            ) : (
              "Envoyer le lien de réinitialisation"
            )}
          </Button>
        </div>
        <div className="text-center text-sm dark:text-neutral-300">
          Vous souvenez-vous de votre mot de passe?
          <Link
            to="/login"
            className="text-secondary underline hover:text-tertiary ml-1"
          >
            Connexion
          </Link>
        </div>
      </div>
    </form>
  );
};

export default Forgetpassword;
