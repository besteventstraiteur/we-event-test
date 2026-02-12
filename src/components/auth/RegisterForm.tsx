import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import clsx from "clsx";
import InputGroup from "../ui-main/InputGroup";
import Button from "../ui/Button";
import { getRequest, postRequest } from "../../utils/http-client/axiosClient";
import { AUTH, PROVIDER } from "../../utils/endPoints";
import { RESPONSE_CODE } from "../../utils/constants";
import { useToast } from "../../utils/toast";

enum UserRole {
  CLIENT = "CLIENT",
  PARTNER = "PARTNER",
}

const RegisterForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const referralCodeFromQuery = queryParams.get("code") || "";

  const schema = useMemo(
    () =>
      yup.object().shape({
        firstName: yup.string().required("Nom de famille obligatoire"),
        lastName: yup.string().required("Prénom obligatoire"),
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
        role: yup
          .mixed<UserRole>()
          .oneOf(Object.values(UserRole))
          .required("Type de compte obligatoire"),
        terms: yup
          .boolean()
          .oneOf([true], "Vous devez accepter les conditions"),

        businessName: yup.string().when("role", {
          is: UserRole.PARTNER,
          then: (schema) =>
            schema.required("Le nom de l'entreprise est obligatoire"),
        }),

        phoneNumber: yup.string().when("role", {
          is: UserRole.CLIENT,
          then: (schema) =>
            schema.required("Le numéro de téléphone est obligatoire"),
        }),

        businessPhone: yup.string().when("role", {
          is: UserRole.PARTNER,
          then: (schema) =>
            schema
              .required("Le numéro de l’entreprise est obligatoire")
              .matches(/^\d+$/, "Doit être un nombre"),
        }),

        referralCode: yup.string().optional(),
      }),
    
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      referralCode: referralCodeFromQuery || "",
    },
  });

  const password = watch("password") || "";
  const firstName = watch("firstName") || "";
  const lastName = watch("lastName") || "";
  const email = watch("email") || "";
  const selectedRole = watch("role");
  const referralCode = watch("referralCode");

  const [loading, setLoading] = useState(false);
  const [referralValid, setReferralValid] = useState<boolean | null>(null);
  const [validating, setValidating] = useState(false);

  const validateReferralCode = async (code: string) => {
    if (!code) {
      setReferralValid(null);
      return;
    }
    try {
      setValidating(true);
      const res = await getRequest(
        `${PROVIDER.CHECK_CODE}?referralCode=${code}`
      );
      if (res?.data?.data?.valid) {
        setReferralValid(true);
      } else {
        setReferralValid(false);
      }
    } catch {
      setReferralValid(false);
    } finally {
      setValidating(false);
    }
  };

  useEffect(() => {
    if (!referralCode || referralCodeFromQuery) {
      setReferralValid(referralCodeFromQuery ? true : null);
      return;
    }
    const timeout = setTimeout(() => validateReferralCode(referralCode), 500);
    return () => clearTimeout(timeout);
  }, [referralCode]);
  const toast = useToast();

  const handleRegister = async (e: any) => {
    if (e.referralCode && referralValid === false) return;

    const payload: any = {
      firstName: e.firstName,
      lastName: e.lastName,
      email: e.email,
      password: e.password,
      userType: e.role?.toLowerCase(),
    };

    if (e.phoneNumber) payload.phoneNumber = e.phoneNumber;

    if (e.role === UserRole.PARTNER) {
      payload.business = {
        name: e.businessName,
        companyRegNo: e.businessPhone,
      };

      if (e.referralCode) payload.referredByCode = e.referralCode;
    }

    if (e.referralCode && referralValid === null) {
      try {
        const res = await getRequest(
          `${PROVIDER.CHECK_CODE}?referralCode=${e.referralCode}`
        );
        if (!res?.data?.data?.valid) {
          setReferralValid(false);
          return;
        }
      } catch {
        setReferralValid(false);
        return;
      }
    }

    setLoading(true);
    try {
      const response = await postRequest(`${AUTH.SIGNUP}`, payload);
      if (response.status === RESPONSE_CODE[201]) {
        reset();
        if (e.role === UserRole.PARTNER) {
          navigate("/account-created?type=partner");
        } else {
          navigate("/account-created?type=client");
        }
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Registration failed");
      
    }
    setLoading(false);
  };

  useEffect(() => {
    if (referralCodeFromQuery) {
      setValue("referralCode", referralCodeFromQuery);
      setReferralValid(true);
    }
  }, [referralCodeFromQuery, setValue]);

  // useEffect(() => {
  //   reset({}, { keepValues: true });
  // }, [schema, reset]);

  const rules = [
    { label: `Au moins 8 caractères`, valid: password.length >= 8 },
    {
      label: `Contient un chiffre ou un symbole`,
      valid: /[0-9!@#$%^&*]/.test(password),
    },
    {
      label: `Ne peut pas contenir votre nom ou votre adresse e-mail`,
      valid:
        password &&
        !password.toLowerCase().includes(firstName.toLowerCase()) &&
        !password.toLowerCase().includes(lastName.toLowerCase()) &&
        !password.toLowerCase().includes(email.split("@")[0]?.toLowerCase()),
    },
  ];
  const passwordStrength = rules.filter((r) => r.valid).length;
  const strengthLabel =
    password.length === 0
      ? ""
      : passwordStrength <= 1
      ? "Faible"
      : passwordStrength === 2
      ? "Moyen"
      : "Fort";

  return (
    <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
      <div>
      {/* First Name */}
      <InputGroup
        label={"Prénom*"}
        inputProps={register("firstName")}
        error={errors.firstName}
        placeholder="Saisir le prénom"
      />
      </div>

       <div>
      {/* Last Name */}
      <InputGroup
        label={"Nom de famille*"}
        inputProps={register("lastName")}
        error={errors.lastName}
        placeholder="Saisir le nom de famille"
      />
      </div>

      <div>
      {/* Email */}
      <InputGroup
        label={"Adresse e-mail*"}
        inputProps={register("email")}
        error={errors.email}
        placeholder="Saisir adresse e-mail"
        type="email"
      />
      </div>

      <div>
      {/* Password */}
      <InputGroup
        label={"Mot de passe *"}
        inputProps={register("password")}
        error={errors.password}
        type="password"
        placeholder={"Entrez votre mot de passe"}
      />
      </div>

      {/* Password Strength */}
      {password.length > 0 && (
        <div className="mt-2 p-3 bg-gray-200 rounded-md text-sm space-y-3">
          <p>
            Solidité du mot de passe:{" "}
            <span
              className={clsx(
                "font-medium",
                strengthLabel === "Weak" && "text-red-500",
                strengthLabel === "Medium" && "text-yellow-500",
                strengthLabel === "Strong" && "text-green-600"
              )}
            >
              {strengthLabel}
            </span>
          </p>
          <ul className="mt-1 space-y-1">
            {rules.map((rule, idx) => (
              <li
                key={idx}
                className={clsx(
                  "flex items-center gap-2",
                  rule.valid ? "text-green-600" : "text-red-500"
                )}
              >
                {rule.valid ? "✓" : "✗"} {rule.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Account Type */}
      <div>
        <label className="block mb-2 text-base font-medium text-mainclr dark:text-neutral-300">Type de compte *</label>
        <div className="space-y-2 mt-2">
          <div className="flex flex-col md:flex-row gap-2 justify-between">
            {/* Client */}
            <label
              className={clsx(
                "w-full flex items-center gap-3 border rounded-lg p-2 text-xs cursor-pointer transition",
                selectedRole === UserRole.CLIENT
                  ? "border-secondary bg-secondary text-white"
                  : "border-inputborder bg-inputbg dark:bg-inputdarkbg dark:text-neutral-300"
              )}
            >
              <input
                type="radio"
                value={UserRole.CLIENT}
                {...register("role")}
                className="hidden"
              />
              <span
                className={clsx(
                  "h-4 w-4 rounded-full border flex items-center justify-center shrink-0",
                  selectedRole === UserRole.CLIENT
                    ? "border-white bg-secondary"
                    : "border-inputborder bg-inputbg"
                )}
              >
                {selectedRole === UserRole.CLIENT && (
                  <span className="h-2 w-2 rounded-full bg-white" />
                )}
              </span>
              Organisateur d’événement (Client)
            </label>

            {/* Partner */}
            <label
              className={clsx(
                "w-full flex items-center gap-3 border rounded-lg p-2 text-xs cursor-pointer transition",
                selectedRole === UserRole.PARTNER
                  ? "border-secondary bg-secondary text-white"
                  : "border-inputborder bg-inputbg dark:bg-inputdarkbg dark:text-neutral-300"
              )}
            >
              <input
                type="radio"
                value={UserRole.PARTNER}
                {...register("role")}
                className="hidden"
              />
              <span
                className={clsx(
                  "h-4 w-4 rounded-full border flex items-center justify-center shrink-0",
                  selectedRole === UserRole.PARTNER
                    ? "border-white bg-secondary"
                    : "border-gray-400 bg-gray-200"
                )}
              >
                {selectedRole === UserRole.PARTNER && (
                  <span className="h-2 w-2 rounded-full bg-white" />
                )}
              </span>
              Fournisseur de services (Partenaire)
            </label>
          </div>
        </div>
        {errors.role && (
          <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
        )}
      </div>

      {/* Conditional Partner Fields */}
      {selectedRole === UserRole.PARTNER && (
        <>
          <InputGroup
            label={"Nom de l’entreprise"}
            inputProps={register("businessName")}
            error={errors.businessName}
            placeholder="Entrez le nom de l’entreprise"
          />
          <InputGroup
            label={"Numéro d’enregistrement de l’entreprise"}
            inputProps={register("businessPhone")}
            error={errors.businessPhone}
            placeholder={"Entrez le numéro d’enregistrement de l’entreprise"}
            type="number"
          />

          <div className="relative">
            <InputGroup
              label={"Code de parrainage"}
              inputProps={{
                ...register("referralCode"),
                disabled: !!referralCodeFromQuery,
              }}
            
              placeholder={"Entrez le code de parrainage"}
              defaultValue={referralCodeFromQuery}
            />

            {validating && (
              <p className="text-sm text-gray-500 mt-1">Validation en cours...</p>
            )}
            {referralValid !== null && referralCode && !validating && (
              <div className="flex items-center gap-1 mt-1">
                {referralValid ? (
                  <>
                    <CheckCircle className="text-green-600 w-4 h-4" />
                    <p className="text-green-600 text-sm">
                      Code de parrainage valide
                    </p>
                  </>
                ) : (
                  <>
                    <XCircle className="text-red-500 w-4 h-4" />
                    <p className="text-red-500 text-sm mt-1">
                      Code de parrainage invalide
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {selectedRole === UserRole.CLIENT && (
        <InputGroup
          label={"numéro de téléphone"}
          inputProps={register("phoneNumber")}
          error={errors.phoneNumber}
          placeholder={"Saisissez votre numéro de téléphone"}
          type="number"
        />
      )}

      {/* Terms */}
      <div className="flex items-center gap-2">
        <input type="checkbox" {...register("terms")} />
        <span className="text-sm dark:text-neutral-300">
          J’accepte les{" "}
          <Link
            to="/terms"
            className="text-secondary dark:text-neutral-300 underline hover:text-tertiary"
          >
            Conditions générales d’utilisation
          </Link>
        </span>
      </div>
      {errors.terms && (
        <p className="text-red-500 text-sm mt-1">{errors.terms.message}</p>
      )}

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        size="large"
        className="w-full text-xl"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Créer votre compte...
          </>
        ) : (
          `Créer votre compte`
        )}
      </Button>

      <div className="text-center text-sm dark:text-neutral-300">
        Vous avez déjà un compte?{" "}
        <Link
          to="/login"
          className="text-secondary underline hover:text-tertiary"
        >
          Connexion
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm;
