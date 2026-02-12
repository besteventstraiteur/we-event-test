import { useRef } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@/components/Button";

// OTP schema
const otpSchema = yup.object().shape({
  otp: yup
    .string()
    .required("OTP is required")
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits"),
});

export default function OtpModal({
  otploading,
  onVerify,
  onResend,
  loading,
  loading2FA,
  type,
}) {
  const inputRefs = useRef([]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  // Watch OTP value reactively
  const otpValue = useWatch({ control, name: "otp" }) || "";
  const otpArray = otpValue.padEnd(6, "").split("");

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const otpChars = otpValue.padEnd(6, "").split("");
    otpChars[index] = value;
    const newOtp = otpChars.join("");

    setValue("otp", newOtp, { shouldValidate: true });

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpArray[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // ✅ Handle Paste Event (for copy-paste OTP)
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("Text").trim();
    if (!/^\d{6}$/.test(pastedData)) return;

    setValue("otp", pastedData, { shouldValidate: true });

    // Autofill UI inputs
    pastedData.split("").forEach((digit, i) => {
      if (inputRefs.current[i]) {
        inputRefs.current[i].value = digit;
      }
    });

    // Move focus to last input
    inputRefs.current[5]?.focus();
  };

  const onSubmit = (data) => {
    onVerify(data.otp);
  };

  return (
    <div className="modal-content">
      <div className="modal-body">
        <div className="text-center mb-3">
          <img src="/images/verify.svg" alt="verify-account" />
        </div>
        <div className="text-center px-5">
          <span className="h3 fw-semibold text-color-dark">Almost There!</span>
          <p>
            We’ve sent a 6-digit verification code to your email. Please enter
            it below to verify your account.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="digit-group mt-3 d-flex justify-content-center gap-2"
        >
          <Controller
            control={control}
            name="otp"
            render={() =>
              Array.from({ length: 6 }).map((_, i) => (
                <input
                  key={i}
                  type="text"
                  className="form-control text-6xl text-center"
                  placeholder="0"
                  maxLength={1}
                  value={otpArray[i] || ""}
                  onChange={(e) => handleChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  onPaste={handlePaste} // ✅ Add paste listener
                  ref={(el) => (inputRefs.current[i] = el)}
                />
              ))
            }
          />
        </form>

        {errors.otp && (
          <p className="text-danger text-center text-sm mt-2">
            {errors.otp.message}
          </p>
        )}

        <Button
          loading={otploading}
          type="submit"
          className="btn btn-fill-dark w-100 mt-4"
          onClick={handleSubmit(onSubmit)}
        >
          {type === "mfa"
            ? "Verify & Complete 2FA"
            : "Verify & Complete Sign-Up"}
        </Button>

        <div className="text-sm text-center mt-3">
          Didn’t receive it?{" "}
          <button
            type="button"
            onClick={onResend}
            className="fw-semibold text-color-dark text-decoration-none border-0 bg-transparent p-0"
          >
            {loading ? "Resending..." : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}
