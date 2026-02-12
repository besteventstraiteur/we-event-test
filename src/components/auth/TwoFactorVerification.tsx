
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import VerificationProvider from "./verification/VerificationProvider";
import VerificationContent from "./verification/VerificationContent";
import VerificationActions from "./verification/VerificationActions";

interface TwoFactorVerificationProps {
  onVerify: (code: string) => Promise<boolean>;
  onCancel?: () => void;
  onResend?: () => Promise<void>;
  codeLength?: number;
  maxAttempts?: number;
}

const TwoFactorVerification: React.FC<TwoFactorVerificationProps> = ({
  onVerify,
  onCancel,
  onResend,
  codeLength = 6,
  maxAttempts = 3,
}) => {
  return (
    <VerificationProvider
      onVerify={onVerify}
      onCancel={onCancel}
      onResend={onResend}
      codeLength={codeLength}
      maxAttempts={maxAttempts}
    >
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Vérification en deux étapes</CardTitle>
          <CardDescription>
            Veuillez entrer le code à {codeLength} chiffres qui a été envoyé à votre appareil.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VerificationContent />
        </CardContent>
        <CardFooter>
          <VerificationActions />
        </CardFooter>
      </Card>
    </VerificationProvider>
  );
};

export default TwoFactorVerification;
