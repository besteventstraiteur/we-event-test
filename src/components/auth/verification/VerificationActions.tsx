
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useVerification } from "@/contexts/VerificationContext";

const VerificationActions: React.FC = () => {
  const { 
    otp,
    codeLength,
    isVerifying, 
    isResending, 
    isExpired, 
    timeLeft, 
    hasReachedMaxAttempts,
    handleVerify,
    handleResend,
    handleCancel
  } = useVerification();

  const isCodeComplete = otp.length === codeLength;

  return (
    <div className="flex justify-between">
      <Button variant="outline" onClick={handleCancel} disabled={isVerifying}>
        Annuler
      </Button>
      <div className="flex space-x-2">
        <Button 
          variant="ghost" 
          onClick={handleResend} 
          disabled={isResending || isVerifying || (!isExpired && timeLeft > 240)} // Disable resend until less than 1 minute left
        >
          {isResending ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" /> 
              Envoi en cours...
            </>
          ) : (
            "Renvoyer le code"
          )}
        </Button>
        <Button 
          onClick={handleVerify} 
          disabled={!isCodeComplete || isVerifying || isExpired || hasReachedMaxAttempts}
        >
          {isVerifying ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" /> 
              Vérification...
            </>
          ) : (
            "Vérifier"
          )}
        </Button>
      </div>
    </div>
  );
};

export default VerificationActions;
