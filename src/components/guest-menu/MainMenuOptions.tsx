
import React from 'react';
import MenuOptionCard from './MenuOptionCard';
import { MenuOption } from '@/hooks/useGuestMenu';

interface MainMenuOptionsProps {
  menuChoices: MenuOption[];
  selectedMenu: string;
  onMenuSelect: (menuId: string) => void;
}

const MainMenuOptions: React.FC<MainMenuOptionsProps> = ({
  menuChoices,
  selectedMenu,
  onMenuSelect
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Sélectionnez votre menu</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {menuChoices.map((menu) => (
          <MenuOptionCard
            key={menu.id}
            option={menu}
            isSelected={selectedMenu === menu.id}
            onSelect={onMenuSelect}
            type={menu.type}
          />
        ))}
      </div>
    </div>
  );
};

export default MainMenuOptions;
