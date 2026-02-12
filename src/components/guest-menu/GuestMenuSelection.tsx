
import React, { useState } from 'react';
import { useGuestMenu } from '@/hooks/useGuestMenu';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Check, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const GuestMenuSelection: React.FC = () => {
  const { menuOptions, selectedOptions, isSubmitting, hasSubmitted, isComplete, selectOption, submitMenuChoices } = useGuestMenu();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { toast } = useToast();

  const handleMenuSubmit = async () => {
    if (isComplete) {
      const success = await submitMenuChoices();
      if (success) {
        setShowConfirmation(true);
        toast({
          title: "Menu confirmé",
          description: "Vos choix de menu ont été enregistrés",
        });
      }
    } else {
      toast({
        title: "Sélection incomplète",
        description: "Veuillez sélectionner une entrée, un plat et un dessert",
        variant: "destructive"
      });
    }
  };

  if (showConfirmation || hasSubmitted) {
    return (
      <Card className="border-green-200 shadow-md">
        <CardContent className="pt-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 rounded-full p-3">
              <Check className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">Menu confirmé</h3>
          <p className="text-gray-600">Merci d'avoir fait vos choix de menu. Vos préférences ont été enregistrées.</p>
        </CardContent>
      </Card>
    );
  }

  const starters = menuOptions.filter(option => option.type === 'starter');
  const mains = menuOptions.filter(option => option.type === 'main');
  const desserts = menuOptions.filter(option => option.type === 'dessert');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Entrées</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {starters.map(starter => (
            <Card 
              key={starter.id} 
              className={cn(
                "cursor-pointer transition-all hover:border-primary",
                selectedOptions.starter === starter.id ? "border-2 border-primary" : ""
              )}
              onClick={() => selectOption(starter.id, 'starter')}
            >
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={starter.image || 'https://via.placeholder.com/300x200?text=Entrée'} 
                  alt={starter.name} 
                  className="w-full h-full object-cover"
                />
                {starter.isVegetarian && (
                  <Badge className="absolute top-2 right-2 bg-green-500">Végétarien</Badge>
                )}
              </div>
              <CardContent className="pt-4">
                <h4 className="font-medium flex items-center gap-2">
                  {selectedOptions.starter === starter.id && <Check className="h-4 w-4 text-primary" />}
                  {starter.name}
                </h4>
                <p className="text-sm text-muted-foreground">{starter.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Plats principaux</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mains.map(main => (
            <Card 
              key={main.id} 
              className={cn(
                "cursor-pointer transition-all hover:border-primary",
                selectedOptions.main === main.id ? "border-2 border-primary" : ""
              )}
              onClick={() => selectOption(main.id, 'main')}
            >
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={main.image || 'https://via.placeholder.com/300x200?text=Plat'} 
                  alt={main.name} 
                  className="w-full h-full object-cover"
                />
                {main.isVegetarian && (
                  <Badge className="absolute top-2 right-2 bg-green-500">Végétarien</Badge>
                )}
              </div>
              <CardContent className="pt-4">
                <h4 className="font-medium flex items-center gap-2">
                  {selectedOptions.main === main.id && <Check className="h-4 w-4 text-primary" />}
                  {main.name}
                </h4>
                <p className="text-sm text-muted-foreground">{main.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Desserts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {desserts.map(dessert => (
            <Card 
              key={dessert.id} 
              className={cn(
                "cursor-pointer transition-all hover:border-primary",
                selectedOptions.dessert === dessert.id ? "border-2 border-primary" : ""
              )}
              onClick={() => selectOption(dessert.id, 'dessert')}
            >
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={dessert.image || 'https://via.placeholder.com/300x200?text=Dessert'} 
                  alt={dessert.name} 
                  className="w-full h-full object-cover"
                />
                {dessert.isGlutenFree && (
                  <Badge className="absolute top-2 right-2 bg-blue-500">Sans Gluten</Badge>
                )}
              </div>
              <CardContent className="pt-4">
                <h4 className="font-medium flex items-center gap-2">
                  {selectedOptions.dessert === dessert.id && <Check className="h-4 w-4 text-primary" />}
                  {dessert.name}
                </h4>
                <p className="text-sm text-muted-foreground">{dessert.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {!isComplete && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <p className="text-amber-800">Veuillez sélectionner une option pour chaque partie du menu</p>
        </div>
      )}

      <div className="pt-4 flex justify-end">
        <Button 
          onClick={handleMenuSubmit} 
          disabled={!isComplete || isSubmitting}
          className="bg-vip-gold hover:bg-vip-gold/90 text-white"
        >
          {isSubmitting ? "En cours..." : "Confirmer mes choix"}
        </Button>
      </div>
    </div>
  );
};

export default GuestMenuSelection;
