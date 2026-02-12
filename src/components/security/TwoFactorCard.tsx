
import React from "react";
import { Shield, Mail, Smartphone } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface TwoFactorCardProps {
  is2FAEnabled: boolean;
  onToggle2FA: () => void;
  verificationMethod: "email" | "app";
  setVerificationMethod: (method: "email" | "app") => void;
  isLoading: boolean;
}

const TwoFactorCard: React.FC<TwoFactorCardProps> = ({
  is2FAEnabled,
  onToggle2FA,
  verificationMethod,
  setVerificationMethod,
  isLoading
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <CardTitle>Authentification à deux facteurs</CardTitle>
          <CardDescription>
            Une couche de sécurité supplémentaire pour votre compte
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Label htmlFor="2fa-toggle" className="flex flex-col gap-1">
            <span>{is2FAEnabled ? 'Activé' : 'Désactivé'}</span>
            <span className="font-normal text-sm text-muted-foreground">
              {is2FAEnabled 
                ? "Votre compte est protégé par une vérification en deux étapes." 
                : "Activez cette option pour renforcer la sécurité de votre compte."}
            </span>
          </Label>
          <Switch 
            id="2fa-toggle" 
            checked={is2FAEnabled} 
            onCheckedChange={onToggle2FA}
            disabled={isLoading}
          />
        </div>
      </CardContent>
      {is2FAEnabled && (
        <CardFooter className="flex-col items-start gap-4 border-t px-6 py-4">
          <h4 className="text-sm font-medium">Méthode de vérification</h4>
          <div className="grid w-full gap-2">
            <div className="flex items-center gap-2">
              <Button 
                variant={verificationMethod === "email" ? "default" : "outline"} 
                className="w-full justify-start"
                onClick={() => setVerificationMethod("email")}
              >
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant={verificationMethod === "app" ? "default" : "outline"} 
                className="w-full justify-start"
                onClick={() => setVerificationMethod("app")}
              >
                <Smartphone className="mr-2 h-4 w-4" />
                Application d'authentification
              </Button>
            </div>
          </div>
          {is2FAEnabled && (
            <div className="text-sm text-muted-foreground mt-2">
              Dernière vérification: aujourd'hui à {new Date().toLocaleTimeString()}
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default TwoFactorCard;
