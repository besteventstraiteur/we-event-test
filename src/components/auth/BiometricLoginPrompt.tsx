
import React from "react";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface BiometricLoginPromptProps {
  biometricAttempt: boolean;
  isBiometricEnabled: boolean;
  isNative: boolean;
  isMobileDevice: boolean;
  biometricError: string | null;
  isLoading: boolean;
  onBiometricLogin: () => void;
}

const BiometricLoginPrompt: React.FC<BiometricLoginPromptProps> = ({
  biometricAttempt,
  isBiometricEnabled,
  isNative,
  isMobileDevice,
  biometricError,
  isLoading,
  onBiometricLogin
}) => {
  if (biometricAttempt) {
    return (
      <div className="mb-4 flex flex-col items-center justify-center py-6">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-3 animate-pulse">
          <LockKeyhole className="h-8 w-8 text-primary" />
        </div>
        <p className="text-center text-sm font-medium">
          Utilisez votre empreinte digitale ou Face ID pour vous connecter
        </p>
        <p className="text-center text-xs text-gray-500 mt-1">
          Authentification biométrique en cours...
        </p>
      </div>
    );
  }

  if (isBiometricEnabled && !biometricAttempt && (isNative || isMobileDevice)) {
    return (
      <div className="mb-6">
        <Button 
          onClick={onBiometricLogin} 
          className="w-full flex items-center justify-center gap-2"
          disabled={isLoading}
          variant="outline"
          size="lg"
        >
          <span className="flex items-center gap-2">
            <LockKeyhole size={18} />
            Se connecter avec biométrie
          </span>
        </Button>
        
        {biometricError && (
          <Alert variant="destructive" className="mt-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {biometricError}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-2 text-sm text-gray-500">ou</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default BiometricLoginPrompt;
