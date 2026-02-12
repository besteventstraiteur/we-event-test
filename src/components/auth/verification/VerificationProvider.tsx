
import React, { ReactNode } from "react";
import { VerificationProvider as ContextProvider } from "@/contexts/VerificationContext";

interface VerificationProviderProps {
  children: ReactNode;
  onVerify: (code: string) => Promise<boolean>;
  onCancel?: () => void;
  onResend?: () => Promise<void>;
  codeLength?: number;
  maxAttempts?: number;
}

const VerificationProvider: React.FC<VerificationProviderProps> = ({
  children,
  onVerify,
  onCancel,
  onResend,
  codeLength = 6,
  maxAttempts = 3,
}) => {
  return (
    <ContextProvider
      onVerify={onVerify}
      onCancel={onCancel}
      onResend={onResend}
      codeLength={codeLength}
      maxAttempts={maxAttempts}
    >
      {children}
    </ContextProvider>
  );
};

export default VerificationProvider;
