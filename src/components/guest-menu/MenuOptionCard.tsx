
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface MenuOption {
  id: string;
  name: string;
  description: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  image?: string;
}

interface MenuOptionCardProps {
  option: MenuOption;
  isSelected: boolean;
  onSelect: (id: string) => void;
  type: "starter" | "main" | "dessert";
}

const MenuOptionCard: React.FC<MenuOptionCardProps> = ({ 
  option, 
  isSelected, 
  onSelect,
  type
}) => {
  const typeLabel = {
    starter: "Entrée",
    main: "Plat principal",
    dessert: "Dessert"
  };

  return (
    <Card className={`relative overflow-hidden ${isSelected ? 'ring-2 ring-amber-500' : ''}`}>
      {option.image ? (
        <div className="h-40 overflow-hidden">
          <img
            src={option.image}
            alt={option.name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="h-40 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400">Image non disponible</span>
        </div>
      )}

      {isSelected && (
        <div className="absolute top-2 right-2 bg-amber-500 text-white rounded-full p-1">
          <Check size={16} />
        </div>
      )}

      <CardContent className="pt-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-gray-900">{option.name}</h3>
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            {typeLabel[type]}
          </Badge>
        </div>
        <p className="text-gray-600 text-sm">{option.description}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {option.isVegetarian && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Végétarien
            </Badge>
          )}
          {option.isVegan && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Vegan
            </Badge>
          )}
          {option.isGlutenFree && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Sans Gluten
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          variant={isSelected ? "default" : "outline"}
          className={`w-full ${isSelected ? 'bg-amber-500 hover:bg-amber-600' : 'border-amber-200 text-amber-700 hover:bg-amber-50'}`}
          onClick={() => onSelect(option.id)}
        >
          {isSelected ? "Sélectionné" : "Choisir cette option"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MenuOptionCard;
