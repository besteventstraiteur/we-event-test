
import React from "react";
import { ShoppingCart } from "lucide-react";

interface EmptyCartProps {
  message?: string;
  icon?: React.ReactNode;
}

const EmptyCart: React.FC<EmptyCartProps> = ({ 
  message = "Votre panier est vide. Ajoutez des services ou packs pour simuler le coût de votre mariage.",
  icon = <ShoppingCart className="h-16 w-16 text-vip-gray-600 mb-4" />
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-8">
      {icon}
      <p className="text-vip-gray-400 text-center max-w-[300px] mx-auto">
        {message}
      </p>
    </div>
  );
};

export default EmptyCart;
