
import React from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useVerification } from "@/contexts/VerificationContext";

const VerificationCodeInput: React.FC = () => {
  const { codeLength, otp, setOtp, isVerifying, isExpired } = useVerification();

  return (
    <InputOTP
      maxLength={codeLength}
      value={otp}
      onChange={setOtp}
      render={({ slots }) => (
        <InputOTPGroup>
          {slots.map((slot, index) => (
            <InputOTPSlot key={index} {...slot} index={index} />
          ))}
        </InputOTPGroup>
      )}
      disabled={isVerifying || isExpired}
    />
  );
};

export default VerificationCodeInput;
