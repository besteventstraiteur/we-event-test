
import React from "react";
import { Fingerprint, AlertTriangle, ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useDeviceType } from "@/hooks/use-mobile";

interface BiometricCardProps {
  isBiometricEnabled: boolean;
  isBiometricSupported: boolean;
  onToggleBiometric: () => void;
  isNative: boolean;
  isLoading: boolean;
}

const BiometricCard: React.FC<BiometricCardProps> = ({
  isBiometricEnabled,
  isBiometricSupported,
  onToggleBiometric,
  isNative,
  isLoading
}) => {
  const deviceType = useDeviceType();
  const isMobile = deviceType === 'mobile' || deviceType === 'tablet';
  
  return (
    <Card className={isMobile ? "overflow-hidden" : ""}>
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Fingerprint className="h-6 w-6 text-primary" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <CardTitle>Authentification biométrique</CardTitle>
            {isBiometricEnabled && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Activé
              </Badge>
            )}
          </div>
          <CardDescription>
            Utilisez votre empreinte digitale ou Face ID pour vous connecter
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Label htmlFor="biometric-toggle" className="flex flex-col gap-1">
            <span>{isBiometricEnabled ? 'Activé' : 'Désactivé'}</span>
            <span className="font-normal text-sm text-muted-foreground">
              {!isBiometricSupported 
                ? "Non disponible sur votre appareil"
                : isBiometricEnabled 
                  ? "Vous pouvez vous connecter avec votre empreinte digitale ou Face ID" 
                  : "Activez pour vous connecter avec votre empreinte digitale ou Face ID"}
            </span>
          </Label>
          <Switch 
            id="biometric-toggle" 
            checked={isBiometricEnabled} 
            onCheckedChange={onToggleBiometric}
            disabled={!isBiometricSupported || isLoading}
          />
        </div>
        
        {!isBiometricSupported && isNative && (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Non disponible</AlertTitle>
            <AlertDescription>
              Votre appareil ne prend pas en charge l'authentification biométrique ou 
              vous n'avez pas configuré de méthode biométrique dans les paramètres de votre appareil.
            </AlertDescription>
          </Alert>
        )}
        
        {isBiometricEnabled && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-green-800">Sécurité renforcée</h4>
              <p className="text-xs text-green-700 mt-1">
                L'authentification biométrique ajoute une couche de sécurité supplémentaire à votre compte 
                et permet une connexion plus rapide.
              </p>
            </div>
          </div>
        )}
      </CardContent>
      {isMobile && isBiometricSupported && (
        <CardFooter className="bg-gray-50 px-6 py-4">
          <p className="text-xs text-gray-500">
            Les données biométriques ne quittent jamais votre appareil et sont gérées par le système d'exploitation.
          </p>
        </CardFooter>
      )}
    </Card>
  );
};

export default BiometricCard;
