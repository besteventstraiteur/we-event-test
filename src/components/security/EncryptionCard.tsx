
import React from "react";
import { Key, Eye, EyeOff } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface EncryptionCardProps {
  encryptionEnabled: boolean;
  setEncryptionEnabled: (enabled: boolean) => void;
  showEncryptionDetails: boolean;
  setShowEncryptionDetails: (show: boolean) => void;
}

const EncryptionCard: React.FC<EncryptionCardProps> = ({
  encryptionEnabled,
  setEncryptionEnabled,
  showEncryptionDetails,
  setShowEncryptionDetails
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Key className="h-8 w-8 text-primary" />
        <div>
          <CardTitle>Chiffrement des données</CardTitle>
          <CardDescription>
            Protection de vos données sensibles
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="encryption-toggle" className="flex flex-col gap-1">
              <span>Chiffrement des données</span>
              <span className="font-normal text-sm text-muted-foreground">
                Le chiffrement renforcé protège vos données sensibles
              </span>
            </Label>
            <Switch 
              id="encryption-toggle" 
              checked={encryptionEnabled} 
              onCheckedChange={setEncryptionEnabled}
              disabled={true} // Toujours activé
            />
          </div>

          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-between" 
            onClick={() => setShowEncryptionDetails(!showEncryptionDetails)}
          >
            Détails du chiffrement
            {showEncryptionDetails ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>

          {showEncryptionDetails && (
            <div className="text-sm space-y-2 bg-gray-50 p-4 rounded-md">
              <p className="font-medium">Notre système utilise:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Chiffrement SSL/TLS pour toutes les communications</li>
                <li>Chiffrement AES-256 pour les données stockées</li>
                <li>Hachage bcrypt avec sel aléatoire pour les mots de passe</li>
                <li>Isolation des données par compte</li>
                <li>Surveillance active des accès anormaux</li>
              </ul>
              <p>Les données sensibles comme les informations de paiement sont chiffrées avec des clés spécifiques à chaque utilisateur.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EncryptionCard;
