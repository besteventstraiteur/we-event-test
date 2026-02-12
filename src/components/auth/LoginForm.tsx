import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Loader2 } from "lucide-react";
import InputGroup from "../ui-main/InputGroup";
import Button from "../ui/Button";
import { useToast } from "../../utils/toast";
import { loginAction } from "../../module/Auth/Login/LoginActions";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { requestNotificationPermission } from "../../utils/notifications";

interface LoginFormprops {
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
}

const LoginForm: React.FC<LoginFormprops> = () => {
  const { t, i18n } = useTranslation();

  const schema = useMemo(
    () =>
      yup.object().shape({
        email: yup
          .string()
          .email("Veuillez entrer un email valide")
          .required("L'email est obligatoire")
          .matches(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Veuillez entrer un email valide"
          ),
        password: yup
          .string()
          .required("Le mot de passe est obligatoire")
          .min(8, "Minimum 8 caractères")
          .matches(/[0-9!@#$%^&*]/, "Doit contenir un chiffre ou un symbole"),
        // terms: yup.boolean().oneOf([true], t("you_must_accept_terms")),
      }),
    [i18n.language]
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
  const [searchParams] = useSearchParams();
  const providerId = searchParams?.get("providerId");
 
  const navigate = useNavigate();
  const toast = useToast();
  const { loader, message, messageType } = useSelector(
    (state) => state.request
  );

  const dispatch = useDispatch();
  const handleLogin = async (e: unknown) => {
    const fcmToken = await requestNotificationPermission();
    try {
      const payload = {
        email: e?.email,
        password: e?.password,
        fcmToken: fcmToken || null,
      };
      dispatch(loginAction(payload, navigate, providerId));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!loader && messageType === "error") {
      toast.error(message);
    }
  }, [loader]);
  useEffect(() => {
    reset({}, { keepValues: true });
  }, [schema, reset]);
  return (
    <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
      <div>
        <InputGroup
          inputProps={register("email")}
          error={errors.email}
          placeholder="Saisir Adresse e-mail"
          type="email"
          label={`Adresse email*`}
        />
      </div>

      {/* Password */}
      <div>
        <InputGroup
          inputProps={register("password")}
          error={errors.password}
          type="password"
          label={`Mot de passe*`}
          placeholder="Saisir le mot de passe"
        />
      </div>

      <div className="text-end">
        <Link
          to="/forget-password"
          className="text-secondary dark:text-neutral-300 hover:text-[#1f79aa] text-sm md:text-base"
        >
          Mot de passe oublié ?
        </Link>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        size="large"
        className="w-full"
        disabled={loader}
      >
        {loader ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Se connecter in...
          </>
        ) : (
          ` Se connecter`
        )}
      </Button>
      <div className="text-center text-sm dark:text-neutral-300">
        Vous n’avez pas encore de compte?
        <Link
          to="/register"
          className="text-secondary underline hover:text-tertiary ml-1"
        >
          Inscrivez-vous
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
