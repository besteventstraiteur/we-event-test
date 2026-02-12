
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Copy, LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PortalLinkManagerProps {
  guestPortalLink: string;
  setGuestPortalLink: React.Dispatch<React.SetStateAction<string>>;
}

const PortalLinkManager: React.FC<PortalLinkManagerProps> = ({
  guestPortalLink,
  setGuestPortalLink
}) => {
  const { toast } = useToast();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(guestPortalLink);
    toast({
      title: "Lien copié",
      description: "Le lien d'accès au portail invité a été copié dans le presse-papier",
    });
  };

  const handleActivateGuestPortal = () => {
    toast({
      title: "Portail invité activé",
      description: "L'espace invité est maintenant actif et accessible par vos invités",
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Lien d'accès à l'espace invité</h3>
      <div className="flex">
        <Input 
          value={guestPortalLink} 
          readOnly 
          className="flex-1 rounded-r-none"
        />
        <Button 
          variant="outline" 
          onClick={handleCopyLink}
          className="rounded-l-none border-l-0"
        >
          <Copy size={16} />
        </Button>
      </div>
      <p className="text-sm text-gray-500">
        Partagez ce lien avec vos invités ou utilisez les options d'envoi par email
      </p>
      
      <div className="pt-4">
        <h3 className="text-lg font-medium mb-2">Statut de l'espace invité</h3>
        <div className="flex items-center space-x-2">
          <Switch id="guest-portal-active" />
          <Label htmlFor="guest-portal-active">Activer l'espace invité</Label>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Lorsque l'espace invité est activé, vos invités pourront y accéder avec les identifiants que vous leur avez envoyés
        </p>
      </div>
      
      <div className="pt-4">
        <Button 
          onClick={handleActivateGuestPortal}
          className="gap-2 bg-amber-500 hover:bg-amber-600"
        >
          <LinkIcon size={16} />
          Activer l'espace invité
        </Button>
      </div>
    </div>
  );
};

export default PortalLinkManager;
