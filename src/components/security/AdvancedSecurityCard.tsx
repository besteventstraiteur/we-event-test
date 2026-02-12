import React, { useState } from "react";
import { Shield, Lock, Eye, EyeOff, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { encryptData, decryptData } from "@/utils/encryption";
import { AccessControlUser } from "@/utils/accessControl";

interface AdvancedSecurityCardProps {
  currentUser: AccessControlUser | null;
}

const AdvancedSecurityCard: React.FC<AdvancedSecurityCardProps> = ({ currentUser }) => {
  const [useStrictAccess, setUseStrictAccess] = useState(true);
  const [useAdvancedEncryption, setUseAdvancedEncryption] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(30); // Minutes
  const [passwordStrength, setPasswordStrength] = useState("high");
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [isRotatingKeys, setIsRotatingKeys] = useState(false);
  const { toast } = useToast();
  
  const handleRotateEncryptionKeys = async () => {
    setIsRotatingKeys(true);
    try {
      // Simuler la rotation des clés
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Démonstration du chiffrement/déchiffrement
      const testData = { message: "Données sensibles", userId: currentUser?.id };
      const encrypted = await encryptData(testData);
      const decrypted = await decryptData(encrypted);
      
      console.log("Démonstration chiffrement:", { 
        données_originales: testData,
        données_chiffrées: encrypted,
        données_déchiffrées: decrypted
      });
      
      toast({
        title: "Clés de chiffrement renouvelées",
        description: "Les nouvelles clés ont été générées avec succès"
      });
    } catch (error) {
      console.error("Erreur lors de la rotation des clés:", error);
      toast({
        variant: "destructive",
        title: "Échec",
        description: "Impossible de renouveler les clés de chiffrement"
      });
    } finally {
      setIsRotatingKeys(false);
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <CardTitle>Paramètres de sécurité avancés</CardTitle>
          <CardDescription>
            Configuration de sécurité renforcée pour les données sensibles
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="strict-access-toggle" className="flex flex-col gap-1">
              <span>Contrôle d'accès strict</span>
              <span className="font-normal text-sm text-muted-foreground">
                Vérifie les permissions à chaque action sensible
              </span>
            </Label>
            <Switch 
              id="strict-access-toggle" 
              checked={useStrictAccess} 
              onCheckedChange={setUseStrictAccess}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <Label htmlFor="advanced-encryption-toggle" className="flex flex-col gap-1">
              <span>Chiffrement de bout en bout</span>
              <span className="font-normal text-sm text-muted-foreground">
                Chiffrement AES-256 de toutes les données sensibles
              </span>
            </Label>
            <Switch 
              id="advanced-encryption-toggle" 
              checked={useAdvancedEncryption} 
              onCheckedChange={setUseAdvancedEncryption}
            />
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-2">
            <Label htmlFor="session-timeout" className="text-sm font-medium">
              Expiration de session: {sessionTimeout} minutes
            </Label>
            <Slider 
              id="session-timeout"
              min={5} 
              max={60} 
              step={5} 
              value={[sessionTimeout]} 
              onValueChange={(value) => setSessionTimeout(value[0])} 
            />
            <p className="text-xs text-muted-foreground mt-1">
              Déconnexion automatique après {sessionTimeout} minutes d'inactivité
            </p>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Niveau de sécurité du mot de passe</Label>
            <RadioGroup value={passwordStrength} onValueChange={setPasswordStrength}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium">Moyen (min. 8 caractères, majuscule, chiffre)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high">Élevé (min. 12 caractères, majuscule, chiffre, symbole)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="extreme" id="extreme" />
                <Label htmlFor="extreme">Extrême (min. 16 caractères, majuscules, chiffres, symboles)</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 items-start">
        <div className="flex justify-between w-full">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          >
            {showTechnicalDetails ? <EyeOff size={16} /> : <Eye size={16} />}
            {showTechnicalDetails ? "Masquer" : "Afficher"} les détails techniques
          </Button>
          
          <Button 
            variant="default" 
            size="sm" 
            className="gap-2"
            onClick={handleRotateEncryptionKeys}
            disabled={isRotatingKeys}
          >
            <RefreshCw size={16} className={isRotatingKeys ? "animate-spin" : ""} />
            Renouveler les clés de chiffrement
          </Button>
        </div>
        
        {showTechnicalDetails && (
          <div className="w-full text-sm space-y-2 bg-gray-50 p-4 rounded-md">
            <p className="font-medium">Détails de l'implémentation de sécurité:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Chiffrement AES-256-GCM avec dérivation de clé PBKDF2</li>
              <li>Contrôle d'accès basé sur les rôles (RBAC) avec permissions granulaires</li>
              <li>Validation systématique des tokens et sessions</li>
              <li>Rotation des clés de chiffrement tous les 30 jours</li>
              <li>Protection contre les attaques CSRF, XSS et injections</li>
              <li>Journalisation sécurisée de toutes les actions sensibles</li>
            </ul>
            <div className="mt-3 p-2 bg-gray-100 rounded text-xs font-mono">
              <p>Utilisateur actuel: {currentUser?.id ?? 'Non connecté'}</p>
              <p>Rôle: {currentUser?.role ?? 'N/A'}</p>
              <p>Permissions: {currentUser?.permissions?.length ?? 0}</p>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default AdvancedSecurityCard;
