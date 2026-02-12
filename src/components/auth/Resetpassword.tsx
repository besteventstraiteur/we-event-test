import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import clsx from "clsx";
import InputGroup from "../ui-main/InputGroup";
import Button from "../ui/Button";
import { postRequest } from "../../utils/http-client/axiosClient";
import { AUTH } from "../../utils/endPoints";
import { RESPONSE_CODE } from "../../utils/constants";
import { useToast } from "../../utils/toast";

const schema = yup.object().shape({
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Au moins 8 caractères")
    .matches(/[0-9!@#$%^&*]/, "Must contain a number or symbol"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

interface ResetpasswordFormprops {
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
}

const ResetpasswordForm: React.FC<ResetpasswordFormprops> = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const password = watch("password") || "";
  const email = watch("email") || "";
  const { token } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const handleRegister = async (e: unknown) => {
    
    const payload = {
      token: token,
      password: e.password,
    };
    setIsLoading(true);
    try {
      const response = await postRequest(`${AUTH.RESET_PASSWORD}`, payload);

      if (response.status === RESPONSE_CODE[200]) {
        reset();
        navigate("/password-changed");
      }
    } catch (error) {
      
      toast.error(error?.response?.data.message);
    }
    setIsLoading(false);
  };

  const rules = [
    {
      label: "Au moins 8 caractères",
      valid: password.length >= 8,
    },
    {
      label: "Contient un chiffre ou un symbole",
      valid: /[0-9!@#$%^&*]/.test(password),
    },
  ];

  const passwordStrength = rules.filter((r) => r.valid).length;
  const strengthLabel =
    password.length === 0
      ? ""
      : passwordStrength <= 1
      ? "Weak"
      : passwordStrength === 2
      ? "Medium"
      : "Strong";

  // ----------------------
  // ✅ Submit
  // ----------------------

  
  return (
    <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
      <div>
        <InputGroup
          label="Password"
          inputProps={register("password")}
          error={errors.password}
          type="password"
          placeholder="At least 8 characters"
        />
      </div>

      <div>
        {password.length > 0 && (
          <div className="mt-2 p-2 bg-gray-50 rounded-md text-sm">
            <p>
              Password Strength:{" "}
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
      </div>

      <div>
        <InputGroup
          label="Confirm Password *"
          inputProps={register("confirmPassword")}
          error={errors.confirmPassword}
          type="password"
          placeholder="At least 8 characters"
        />
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Reseting Password...
          </>
        ) : (
          "Reset Password"
        )}
      </Button>

      <div className="text-center text-sm dark:text-neutral-300">
        Don’t have an account?{" "}
        <Link
          to="/register"
          className="text-secondary underline hover:text-tertiary ml-1"
        >
          Register Now
        </Link>
      </div>
    </form>
  );
};

export default ResetpasswordForm;
