
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface GiftFundSettingsProps {
  isEnabled: boolean;
  setIsEnabled: (enabled: boolean) => void;
  fundTitle: string;
  setFundTitle: (title: string) => void;
  fundDescription: string;
  setFundDescription: (description: string) => void;
  handleSaveSettings: () => void;
}

const GiftFundSettings: React.FC<GiftFundSettingsProps> = ({
  isEnabled,
  setIsEnabled,
  fundTitle,
  setFundTitle,
  fundDescription,
  setFundDescription,
  handleSaveSettings
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="gift-fund-enabled" className="font-medium">Activer la cagnotte</Label>
          <p className="text-sm text-gray-500">Rendez votre cagnotte visible pour vos invités</p>
        </div>
        <Switch
          id="gift-fund-enabled"
          checked={isEnabled}
          onCheckedChange={setIsEnabled}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="fund-title">Titre de la cagnotte</Label>
        <Input 
          id="fund-title" 
          value={fundTitle}
          onChange={(e) => setFundTitle(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="fund-description">Description</Label>
        <Textarea
          id="fund-description"
          value={fundDescription}
          onChange={(e) => setFundDescription(e.target.value)}
          rows={4}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Options de paiement</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="option-card"
              className="h-4 w-4 rounded border-gray-300"
              defaultChecked
            />
            <label htmlFor="option-card" className="text-sm">Carte bancaire</label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="option-paypal"
              className="h-4 w-4 rounded border-gray-300"
              defaultChecked
            />
            <label htmlFor="option-paypal" className="text-sm">PayPal</label>
          </div>
        </div>
      </div>
      
      <Button className="w-full" onClick={handleSaveSettings}>Enregistrer les modifications</Button>
    </div>
  );
};

export default GiftFundSettings;
