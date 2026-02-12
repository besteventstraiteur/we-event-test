
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GuestAccountOptions } from "./types";

interface FeatureSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventTitle: string;
  accountOptions: GuestAccountOptions;
  setAccountOptions: React.Dispatch<React.SetStateAction<GuestAccountOptions>>;
  onSave: () => void;
}

const FeatureSettingsDialog: React.FC<FeatureSettingsDialogProps> = ({
  open,
  onOpenChange,
  eventTitle,
  accountOptions,
  setAccountOptions,
  onSave,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Paramètres de l'espace invité</DialogTitle>
          <DialogDescription>
            Configurez les fonctionnalités que vous souhaitez mettre à disposition de vos invités.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="event-title">Titre de l'événement</Label>
            <Input id="event-title" value={eventTitle} onChange={(e) => {/* Update event title */}} />
            <p className="text-sm text-gray-500">Ce titre sera affiché en haut de l'espace invité</p>
          </div>
          
          <Tabs defaultValue="features">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="features">Fonctionnalités</TabsTrigger>
              <TabsTrigger value="appearance">Apparence</TabsTrigger>
            </TabsList>
            
            <TabsContent value="features" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="opt-menu">Choix du menu</Label>
                    <p className="text-sm text-gray-500">Permettre aux invités de choisir leur menu</p>
                  </div>
                  <Switch 
                    id="opt-menu" 
                    checked={accountOptions.canSelectMenu}
                    onCheckedChange={(checked) => 
                      setAccountOptions({...accountOptions, canSelectMenu: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="opt-floorplan">Plan de salle</Label>
                    <p className="text-sm text-gray-500">Permettre aux invités de consulter le plan de salle</p>
                  </div>
                  <Switch 
                    id="opt-floorplan" 
                    checked={accountOptions.canViewFloorPlan}
                    onCheckedChange={(checked) => 
                      setAccountOptions({...accountOptions, canViewFloorPlan: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="opt-guestbook">Livre d'or</Label>
                    <p className="text-sm text-gray-500">Permettre aux invités de laisser des messages dans le livre d'or</p>
                  </div>
                  <Switch 
                    id="opt-guestbook" 
                    checked={accountOptions.canUseGuestbook}
                    onCheckedChange={(checked) => 
                      setAccountOptions({...accountOptions, canUseGuestbook: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="opt-giftfund">Cagnotte</Label>
                    <p className="text-sm text-gray-500">Permettre aux invités de participer à la cagnotte</p>
                  </div>
                  <Switch 
                    id="opt-giftfund" 
                    checked={accountOptions.canUseGiftFund}
                    onCheckedChange={(checked) => 
                      setAccountOptions({...accountOptions, canUseGiftFund: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="opt-songs">Proposer des chansons</Label>
                    <p className="text-sm text-gray-500">Permettre aux invités de suggérer des chansons</p>
                  </div>
                  <Switch 
                    id="opt-songs" 
                    checked={accountOptions.canAddSongs}
                    onCheckedChange={(checked) => 
                      setAccountOptions({...accountOptions, canAddSongs: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="opt-photos">Upload de photos</Label>
                    <p className="text-sm text-gray-500">Permettre aux invités d'envoyer des photos</p>
                  </div>
                  <Switch 
                    id="opt-photos" 
                    checked={accountOptions.canUploadPhotos}
                    onCheckedChange={(checked) => 
                      setAccountOptions({...accountOptions, canUploadPhotos: checked})
                    }
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="appearance" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="portal-color">Couleur principale</Label>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-500 cursor-pointer ring-2 ring-amber-500 ring-offset-2" />
                    <div className="w-8 h-8 rounded-full bg-pink-500 cursor-pointer" />
                    <div className="w-8 h-8 rounded-full bg-blue-500 cursor-pointer" />
                    <div className="w-8 h-8 rounded-full bg-green-500 cursor-pointer" />
                    <div className="w-8 h-8 rounded-full bg-purple-500 cursor-pointer" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="portal-header">Image d'en-tête</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                    <Button variant="outline" size="sm">Ajouter une image</Button>
                    <p className="text-xs text-gray-500 mt-2">Formats acceptés: JPG, PNG. Max 2MB</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={onSave} className="bg-amber-500 hover:bg-amber-600">
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeatureSettingsDialog;
