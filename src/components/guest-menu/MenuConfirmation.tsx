
import React from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { MenuOption } from '@/hooks/useGuestMenu';

interface MenuConfirmationProps {
  isConfirmed: boolean;
  selectedMenu: string;
  selectedOption: string;
  allergies: string[];
  menuChoices: MenuOption[];
}

const MenuConfirmation: React.FC<MenuConfirmationProps> = ({
  isConfirmed,
  selectedMenu,
  selectedOption,
  allergies,
  menuChoices,
}) => {
  if (!isConfirmed) return null;

  return (
    <Card className="bg-green-50 border-green-200">
      <div className="p-4 flex items-start gap-3">
        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
        <div>
          <h3 className="font-medium text-green-800">Choix confirmé</h3>
          <p className="text-green-700 text-sm mt-1">
            Vous avez sélectionné le {menuChoices.find(m => m.id === selectedMenu)?.name}
            {selectedOption && (
              <> avec l'option {selectedOption === 'starter' ? 'entrée' : 'dessert'}</>
            )}
            {allergies.length > 0 && (
              <> en tenant compte de vos allergies</>
            )}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default MenuConfirmation;
