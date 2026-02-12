
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { GuestAccountOptions, GuestAccountsManagerProps } from "./types";
import FeatureSettingsDialog from "./FeatureSettingsDialog";
import PortalLinkManager from "./PortalLinkManager";
import FeaturesList from "./FeaturesList";

const GuestAccountsManager: React.FC<GuestAccountsManagerProps> = ({ 
  eventTitle = "Notre Mariage" 
}) => {
  const { toast } = useToast();
  const [isCreateSettingsOpen, setIsCreateSettingsOpen] = useState(false);
  const [guestPortalLink, setGuestPortalLink] = useState(`https://votre-mariage.com/guest/portal`);
  const [accountOptions, setAccountOptions] = useState<GuestAccountOptions>({
    canViewFloorPlan: true,
    canSelectMenu: true,
    canUploadPhotos: false,
    canAddSongs: false,
    canUseGuestbook: true,
    canUseGiftFund: true
  });

  const handleSaveSettings = () => {
    setIsCreateSettingsOpen(false);
    toast({
      title: "Paramètres enregistrés",
      description: "Les paramètres de l'espace invité ont été mis à jour",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-amber-500" />
            Espace Invités
          </CardTitle>
          <CardDescription>
            Créez un espace dédié pour vos invités où ils pourront consulter les informations de votre événement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Titre de l'événement</h3>
              <Input 
                value={eventTitle} 
                onChange={(e) => {/* In a real app, this would update the event title */}} 
                className="max-w-md"
              />
              
              <FeaturesList accountOptions={accountOptions} />
              
              <div className="pt-4 flex flex-col sm:flex-row gap-2">
                <Button onClick={() => setIsCreateSettingsOpen(true)} className="gap-2">
                  <UserPlus size={16} />
                  Paramètres de l'espace invité
                </Button>
              </div>
            </div>
            
            <PortalLinkManager 
              guestPortalLink={guestPortalLink}
              setGuestPortalLink={setGuestPortalLink}
            />
          </div>
          
          <div className="pt-4">
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
              <h3 className="font-medium text-amber-800 flex items-center gap-2 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Information
              </h3>
              <p className="text-sm text-amber-700">
                Pour que vos invités puissent accéder à leur espace, vous devez d'abord créer leurs comptes et leur envoyer leurs identifiants.
                Utilisez l'onglet "Comptes invités" de la page "Gestion des invités" pour gérer les comptes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <FeatureSettingsDialog
        open={isCreateSettingsOpen}
        onOpenChange={setIsCreateSettingsOpen}
        eventTitle={eventTitle}
        accountOptions={accountOptions}
        setAccountOptions={setAccountOptions}
        onSave={handleSaveSettings}
      />
    </div>
  );
};

export default GuestAccountsManager;
