
import React from "react";
import { Info } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const SecurityHeader: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Sécurité du compte</h1>
      <p className="text-muted-foreground">
        Configurez les paramètres de sécurité de votre compte pour vous protéger contre les accès non autorisés.
      </p>
      <Alert className="mt-4">
        <Info className="h-4 w-4" />
        <AlertTitle>Votre sécurité est notre priorité</AlertTitle>
        <AlertDescription>
          Nous vous recommandons d'activer l'authentification à deux facteurs et, si disponible, 
          l'authentification biométrique pour une sécurité optimale.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default SecurityHeader;
