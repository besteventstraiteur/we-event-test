
import React from 'react';
import MenuOptionCard from './MenuOptionCard';
import { MenuOption } from '@/hooks/useGuestMenu';

interface AdditionalOptionsProps {
  selectedMenu: string;
  selectedOption: string;
  onOptionSelect: (optionId: string) => void;
}

const AdditionalOptions: React.FC<AdditionalOptionsProps> = ({
  selectedMenu,
  selectedOption,
  onOptionSelect
}) => {
  if (!selectedMenu) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Options supplémentaires</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MenuOptionCard
          option={{
            id: "starter",
            name: "Option entrée",
            description: "Ajouter une entrée à votre menu",
            type: "starter"
          } as MenuOption}
          isSelected={selectedOption === 'starter'}
          onSelect={onOptionSelect}
          type="starter"
        />
        <MenuOptionCard
          option={{
            id: "dessert",
            name: "Option dessert",
            description: "Ajouter un dessert spécial à votre menu",
            type: "dessert"
          } as MenuOption}
          isSelected={selectedOption === 'dessert'}
          onSelect={onOptionSelect}
          type="dessert"
        />
      </div>
    </div>
  );
};

export default AdditionalOptions;
