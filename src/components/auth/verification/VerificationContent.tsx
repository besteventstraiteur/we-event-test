
import React from "react";
import VerificationCodeInput from "./VerificationCodeInput";
import VerificationTimer from "./VerificationTimer";
import VerificationAttempts from "./VerificationAttempts";

const VerificationContent: React.FC = () => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <VerificationCodeInput />
      <VerificationTimer />
      <VerificationAttempts />
    </div>
  );
};

export default VerificationContent;
